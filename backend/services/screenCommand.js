/**
 * screenCommand.js
 * Convierte mensajes en lenguaje natural de Ariel en acciones sobre las
 * pantallas (leer / escribir) que ejecuta el agente local vía el orchestrator.
 *
 * Ejemplos:
 *   "¿qué está haciendo Claude?"            → lee claude, resume y responde
 *   "decile a GPT que se olvidó el prompt"  → propone escribir en GPT y pide confirmar
 *   "sí" / "dale" / "mandá"                 → manda el envío pendiente
 *   "dame el texto completo"                → devuelve la última lectura literal
 *
 * Diseño: con confirmación antes de mandar (no escribe en una pantalla sin que
 * Ariel confirme), y lectura con resumen + opción de detalle.
 */

const Anthropic = require('@anthropic-ai/sdk');
const orchestrator = require('./orchestrator');

const MODEL = process.env.TORRE_MODEL || 'claude-haiku-4-5';
const KNOWN_WINDOWS = ['gpt', 'claude', 'gemini', 'grok', 'whatsapp', 'figma'];

// Estado conversacional en memoria (un solo usuario: Ariel).
let pendingWrite = null; // { window, text }
let pendingCycle = null; // { source, target, notify }
let lastRead = null;     // { window, text }

let client = null;
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic({ timeout: 30_000, maxRetries: 1 });
  return client;
}
function modelOmitsThinkingDisable(model) {
  return /fable|mythos|opus-4-(7|8)/.test(model);
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    kind:   { type: 'string', enum: ['read', 'write', 'confirm', 'cancel', 'detail', 'status', 'cycle', 'none'] },
    window: { type: 'string', description: `Una de: ${KNOWN_WINDOWS.join(', ')} — o vacío si no aplica.` },
    text:   { type: 'string', description: 'Texto exacto a escribir (solo para write). Vacío si no aplica.' },
  },
  required: ['kind', 'window', 'text'],
};

function buildSystem(ctx) {
  return `Sos el intérprete de órdenes de JarviSZ para Ariel. Clasificás CADA mensaje en una de estas acciones sobre las pantallas abiertas (GPT, Claude, etc.):

- "read": Ariel quiere saber qué hace/dice una pantalla. Ej: "qué está haciendo Claude", "qué dijo GPT", "leé Claude", "fijate GPT".
- "write": Ariel ordena escribir un texto en una pantalla. Ej: "decile a GPT que se olvidó el prompt", "escribí en Claude: continuá", "mandale a GPT que pare". Extraé el texto EXACTO a escribir en "text" (sin el verbo de orden; el mensaje tal como debe verse en la pantalla).
- "confirm": Ariel confirma algo pendiente (un envío o un ciclo a punto de arrancar). Ej: "sí", "dale", "mandá", "hacelo", "confirmo". ${(ctx.hasPendingWrite || ctx.hasPendingCycle) ? 'HAY algo pendiente de confirmar.' : 'NO hay nada pendiente, así que casi nunca uses confirm.'}
- "cancel": Ariel cancela el envío pendiente. Ej: "no", "cancelá", "dejá", "pará".
- "detail": Ariel pide el texto completo de la última lectura. Ej: "dame el texto completo", "el literal", "mostrame todo". ${ctx.hasLastRead ? 'HAY una lectura previa.' : 'NO hay lectura previa.'}
- "status": Ariel pregunta por el ESTADO del sistema/ciclo/agente. Ej: "por qué el ciclo está parado", "qué pasa con el ciclo", "está andando el agente", "qué onda con el ciclo", "por qué no arranca", "cómo viene todo".
- "cycle": Ariel ORDENA arrancar/iniciar un ciclo entre las pantallas. Ej: "arrancá el ciclo", "iniciá el ciclo", "empezá el loop GPT a Claude", "dale arrancá". (NO confundir con preguntar por el estado: eso es status.)
- "none": cualquier otra cosa (charla normal, ideas, errores ajenos al ciclo, etc.).

Ventanas válidas para "window": ${KNOWN_WINDOWS.join(', ')}. "chatgpt" = gpt. Si no se nombra ventana y la acción la necesita, dejá window vacío.

Devolvé SIEMPRE el JSON pedido. No inventes texto para "text": copiá lo que Ariel quiere que se escriba.`;
}

async function interpretIA(message, ctx) {
  const ac = getClient();
  if (!ac) return null;
  try {
    const request = {
      model: MODEL,
      max_tokens: 1000,
      system: [{ type: 'text', text: buildSystem(ctx) }],
      messages: [{ role: 'user', content: message }],
      output_config: { format: { type: 'json_schema', schema: SCHEMA } },
    };
    if (!modelOmitsThinkingDisable(MODEL)) request.thinking = { type: 'disabled' };
    const res = await ac.messages.create(request);
    if (res.stop_reason === 'refusal') return null;
    const block = res.content.find((b) => b.type === 'text');
    const parsed = JSON.parse(block.text);
    let win = (parsed.window || '').toLowerCase().trim();
    if (win === 'chatgpt') win = 'gpt';
    if (win && !KNOWN_WINDOWS.includes(win)) win = '';
    return { kind: parsed.kind, window: win, text: String(parsed.text || '') };
  } catch (err) {
    console.warn('screenCommand: IA falló, fallback keywords:', err.message);
    return null;
  }
}

function interpretFallback(message, ctx) {
  const m = message.toLowerCase().trim();
  let win = KNOWN_WINDOWS.find((w) => m.includes(w)) || '';
  if (!win && m.includes('chatgpt')) win = 'gpt';

  if ((ctx.hasPendingWrite || ctx.hasPendingCycle) && /^(s[ií]|dale|mand[áa]|envi[áa]|ok|hacelo|confirmo|de una|listo|arranc[áa])\b/.test(m)) {
    return { kind: 'confirm', window: '', text: '' };
  }
  if ((ctx.hasPendingWrite || ctx.hasPendingCycle) && /^(no|cancel[áa]|par[áa]|dej[áa]|olvidate)\b/.test(m)) {
    return { kind: 'cancel', window: '', text: '' };
  }
  if (ctx.hasLastRead && /(texto completo|el completo|el literal|literal|tal cual|todo el texto|el detalle|dame el texto)/.test(m)) {
    return { kind: 'detail', window: '', text: '' };
  }
  if (/(arranc[áa]|inici[áa]|empez[áa]|larg[áa]|dale).*(ciclo|loop)|(ciclo|loop).*(arranc|inici|empez)/.test(m)) {
    return { kind: 'cycle', window: '', text: '' };
  }
  if (/(ciclo|agente).*(parad|fren|no anda|no arranca|colgad|trabad|pasa|onda|estado|anda|funciona|conectad)/.test(m) ||
      /(por qu[ée]|qu[ée] pasa|qu[ée] onda|c[óo]mo (viene|va|anda|est[áa]))/.test(m) && /(ciclo|agente|torre|todo)/.test(m)) {
    return { kind: 'status', window: '', text: '' };
  }
  const writeVerb = /(decile|dec[ií]le|dec[ií] a|escrib[ií]|escribile|pon[ée]le?|mandale|mand[áa]le|avis[áa]le|preguntale|pregunt[áa]le|respondele|record[áa]le)/.test(m);
  if (writeVerb && win) {
    let text = '';
    const colon = message.indexOf(':');
    if (colon !== -1) {
      text = message.slice(colon + 1).trim();
    } else {
      const mm = message.match(/\bque\s+(.+)/i);
      if (mm) text = mm[1].trim();
    }
    if (text) return { kind: 'write', window: win, text };
  }
  const readVerb = /(qu[ée]\s+(hace|dice|dijo|respondi|est[áa])|le[ée]|mostr[áa]me|fijate|revis[áa]|mir[áa]|c[óo]mo va)/.test(m);
  if (win && (readVerb || m.includes('?'))) {
    return { kind: 'read', window: win, text: '' };
  }
  return { kind: 'none', window: '', text: '' };
}

async function interpret(message) {
  const ctx = { hasPendingWrite: !!pendingWrite, hasPendingCycle: !!pendingCycle, hasLastRead: !!lastRead };
  const ia = await interpretIA(message, ctx);
  const cmd = ia || interpretFallback(message, ctx);
  // Validación cruzada: confirm/detail solo si hay estado que lo respalde.
  if (cmd.kind === 'confirm' && !pendingWrite && !pendingCycle) return interpretFallback(message, ctx);
  if (cmd.kind === 'detail' && !lastRead) return { kind: 'none', window: '', text: '' };
  return cmd;
}

async function resumirLectura(windowName, texto) {
  const ac = getClient();
  const recorte = String(texto || '').trim();
  if (!recorte) return `${windowName} está en blanco o no pude leer nada.`;
  if (!ac) return recorte.slice(0, 280);
  try {
    const msg = await ac.messages.create({
      model: MODEL,
      max_tokens: 160,
      messages: [{
        role: 'user',
        content: `Sos JarviSZ, asistente de Ariel, tono seco y breve, español rioplatense. En 1-2 frases contale qué está mostrando la pantalla de ${windowName} ahora mismo. Sin tecnicismos innecesarios. No uses corchetes ni etiquetas.

Contenido de la pantalla:
${recorte.slice(0, 2500)}`,
      }],
    });
    return msg.content[0].text.trim();
  } catch {
    return recorte.slice(0, 280);
  }
}

// Junta el estado real del sistema en texto factual (sin inventar).
function describeEstado() {
  const ag = orchestrator.getAgentStatus();
  const ciclos = orchestrator.getCycleHistory(3) || [];
  const ultimo = ciclos[0] || null;
  const lineas = [];

  if (!ag.connected) {
    lineas.push(`Agente local: DESCONECTADO (última señal hace ${ag.secondsAgo ?? '—'}s). Sin agente conectado, ningún ciclo puede correr.`);
  } else {
    lineas.push(`Agente local: conectado (última señal hace ${ag.secondsAgo}s).`);
    const wins = (ag.windows || []).filter((w) => w.hasPage).map((w) => w.name);
    lineas.push(`Pantallas detectadas: ${wins.length ? wins.join(', ') : 'ninguna con página activa'}.`);
  }

  if (!ultimo) {
    lineas.push('No hay ningún ciclo registrado todavía.');
  } else {
    lineas.push(`Último ciclo: estado "${ultimo.status}"${ultimo.iterations ? `, ${ultimo.iterations} iteraciones` : ''}.`);
    if (ultimo.error)   lineas.push(`Error del último ciclo: ${ultimo.error}`);
    if (ultimo.summary) lineas.push(`Resumen del último ciclo: ${ultimo.summary}`);
  }
  return { texto: lineas.join('\n'), ag, ultimo };
}

// Diagnostica el estado del ciclo/sistema con la personalidad de JarviSZ.
async function diagnose() {
  const { texto, ag, ultimo } = describeEstado();
  const ac = getClient();

  if (!ac) {
    let d = texto;
    if (!ag.connected) d += '\n\n→ Arrancá el agente local (iniciar.ps1) y reintentá.';
    else if (ultimo && ultimo.status === 'failed') d += '\n\n→ El último ciclo falló. Revisá el error de arriba y reiniciá el ciclo.';
    else if (!ultimo) d += '\n\n→ Todavía no arrancaste ningún ciclo.';
    return d;
  }
  try {
    const msg = await ac.messages.create({
      model: MODEL,
      max_tokens: 240,
      messages: [{
        role: 'user',
        content: `Sos JarviSZ, coordinador de Ariel: tono seco, breve, leal, español rioplatense. Ariel pregunta por el estado del ciclo/sistema. Con estos datos REALES, explicale en 2-3 frases qué está pasando y qué conviene hacer. No inventes nada que no esté en los datos; si falta información, decilo. Sin corchetes ni etiquetas.

ESTADO ACTUAL (datos reales del sistema):
${texto}`,
      }],
    });
    return msg.content[0].text.trim();
  } catch {
    return texto;
  }
}

/**
 * Procesa un mensaje. Si es una orden de pantalla, la maneja y devuelve
 * { handled: true, response }. Si no, devuelve { handled: false }.
 */
async function handleScreenMessage(message) {
  const cmd = await interpret(message);

  if (cmd.kind === 'none') return { handled: false };

  try {
    switch (cmd.kind) {
      case 'read': {
        if (!cmd.window) return { handled: true, response: '¿Qué pantalla querés que mire? Decime gpt, claude, etc.' };
        const r = await orchestrator.readAgentWindow(cmd.window);
        const texto = (r && r.text) || '';
        lastRead = { window: cmd.window, text: texto };
        const resumen = await resumirLectura(cmd.window, texto);
        return { handled: true, response: `${resumen}\n\n¿Querés el texto completo?` };
      }

      case 'write': {
        if (!cmd.window || !cmd.text) {
          return { handled: true, response: '¿En qué pantalla y qué te gustaría que escriba exactamente?' };
        }
        pendingWrite = { window: cmd.window, text: cmd.text };
        return {
          handled: true,
          response: `Voy a escribir en ${cmd.window}:\n\n«${cmd.text}»\n\n¿Lo mando? (decime "sí" o "no")`,
        };
      }

      case 'confirm': {
        if (pendingCycle) {
          const c = pendingCycle;
          pendingCycle = null;
          await orchestrator.startNewCycle(c);
          return { handled: true, response: `Listo, arranqué el ciclo ${c.source} → ${c.target}. Te aviso por WhatsApp cuando termine.` };
        }
        if (pendingWrite) {
          const { window: w, text: t } = pendingWrite;
          pendingWrite = null;
          await orchestrator.writeAgentWindow(w, t, true);
          return { handled: true, response: `Listo, lo mandé a ${w}.` };
        }
        return { handled: true, response: 'No tengo nada pendiente para confirmar.' };
      }

      case 'cancel': {
        if (pendingCycle) { pendingCycle = null; return { handled: true, response: 'Listo, no arranco el ciclo.' }; }
        if (pendingWrite) { const w = pendingWrite.window; pendingWrite = null; return { handled: true, response: `Cancelado. No escribí nada en ${w}.` }; }
        return { handled: true, response: 'No había nada pendiente, pero quedamos.' };
      }

      case 'cycle': {
        // Dirección por defecto: GPT → Claude (el caso principal). Si Ariel
        // pide explícitamente "claude a gpt", invertir.
        let source = 'gpt', target = 'claude';
        if (/claude\s*(a|hacia|->|→|hasta)\s*gpt/i.test(message)) { source = 'claude'; target = 'gpt'; }
        pendingCycle = { source, target, notify: 'whatsapp' };
        return {
          handled: true,
          response: `Arranco el ciclo ${source} → ${target} y te aviso por WhatsApp al terminar. ¿Dale? (decime "sí")`,
        };
      }

      case 'detail': {
        if (!lastRead) return { handled: true, response: 'No tengo ninguna lectura reciente para mostrarte.' };
        const t = lastRead.text || '(vacío)';
        const recorte = t.length > 3000 ? t.slice(0, 3000) + '\n\n[…texto recortado]' : t;
        return { handled: true, response: `Texto completo de ${lastRead.window}:\n\n${recorte}` };
      }

      case 'status': {
        const dic = await diagnose();
        return { handled: true, response: dic };
      }

      default:
        return { handled: false };
    }
  } catch (err) {
    pendingWrite = null;
    const msg = /no registrado|desconectado|Timeout/i.test(err.message)
      ? 'El agente local no responde. ¿Está corriendo jarvis-local-agent en tu PC?'
      : `No pude hacerlo: ${err.message}`;
    return { handled: true, response: msg };
  }
}

module.exports = { handleScreenMessage };
