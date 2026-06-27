// Cerebro de la Torre: clasifica el mensaje, le pone prioridad, responde y
// estima las dimensiones PLIC, usando un modelo de Claude. Si no hay
// ANTHROPIC_API_KEY o la API falla, cae al clasificador por palabras clave.
//
// El modelo es configurable por TORRE_MODEL. Default barato (Haiku) porque
// clasificar mensajes cortos no necesita el modelo más caro.

const Anthropic = require('@anthropic-ai/sdk');
const { classifyIntent } = require('./intentClassifier');
const { clampPlic } = require('./plicScore');

const MODEL = process.env.TORRE_MODEL || 'claude-haiku-4-5';

// Los modelos Fable 5 / Opus 4.7+ no aceptan thinking explícito 'disabled'
// (devuelven 400): hay que OMITIR el parámetro por completo. En Haiku/Sonnet
// sí se puede desactivar, lo que abarata y acelera la clasificación.
function modelOmitsThinkingDisable(model) {
  return /fable|mythos|opus-4-(7|8)/.test(model);
}

let client = null;
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) {
    client = new Anthropic({ timeout: 30_000, maxRetries: 1 });
  }
  return client;
}

// El intent se mantiene idéntico al clasificador por keywords para que el
// frontend (INTENT_LABELS) siga funcionando sin cambios.
const INTENTS = ['error', 'tarea', 'decisión', 'duda', 'idea', 'consulta_general'];
const PRIORITIES = ['alta', 'media', 'baja'];
const EVENT_TYPES = [
  'idea', 'pedido', 'orden', 'bloqueo', 'error', 'retrabajo',
  'decisión', 'handoff', 'verificación', 'cierre', 'reapertura', 'estado',
];

const TORRE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    intent:   { type: 'string', enum: INTENTS },
    priority: { type: 'string', enum: PRIORITIES },
    response: { type: 'string', description: 'Respuesta conversacional breve en español rioplatense, apta para leerse por voz.' },
    nextStep: { type: 'string', description: 'Próximo paso concreto sugerido.' },
    plic: {
      type: 'object',
      additionalProperties: false,
      properties: {
        event_type:    { type: 'string', enum: EVENT_TYPES },
        impact:        { type: 'integer', description: 'Impacto 1-5 (1 molestia menor, 5 rompe producción).' },
        urgency:       { type: 'integer', description: 'Urgencia 1-5 (1 puede esperar, 5 atención inmediata).' },
        blocked_items: { type: 'integer', description: 'Cuántas otras cosas quedan bloqueadas por esto (0 si ninguna).' },
        repetition:    { type: 'integer', description: 'Repetición 1-5 (1 apareció una vez, 5 patrón dominante).' },
        risk:          { type: 'integer', description: 'Riesgo 1-5 (1 reversible sin usuarios, 5 producción/datos/secrets).' },
      },
      required: ['event_type', 'impact', 'urgency', 'blocked_items', 'repetition', 'risk'],
    },
  },
  required: ['intent', 'priority', 'response', 'nextStep', 'plic'],
};

const SYSTEM_PROMPT = `Sos la Torre de Control: un coordinador operativo que ayuda a Ariel a dirigir proyectos de software con asistentes de IA. Hablás en español rioplatense, claro y conciso (tus respuestas pueden leerse en voz alta).

Tu trabajo con cada mensaje:
1. Clasificar la intención: error, tarea, decisión, duda, idea o consulta_general.
2. Asignar prioridad: alta, media o baja.
3. Responder en una o dos frases, útiles y directas (sin relleno, sin "como modelo de IA").
4. Estimar las dimensiones PLIC del evento que el mensaje representa.

PLIC (capa de priorización por concentración de impacto). Escalas 1-5 con anclas:
- impact: 1 molestia menor / 3 afecta un flujo con workaround / 5 rompe producción o bloquea varios ciclos.
- urgency: 1 puede esperar / 3 entra en planificación próxima / 5 atención inmediata o riesgo activo.
- blocked_items: cuántas OTRAS cosas no pueden avanzar por esto (conteo, 0 si ninguna).
- repetition: 1 apareció una vez / 3 reaparece en varios ciclos / 5 patrón dominante del proyecto.
- risk: 1 reversible sin usuarios / 3 toca código no crítico / 5 producción, datos, secrets o migraciones.
- event_type: idea, pedido, orden, bloqueo, error, retrabajo, decisión, handoff, verificación, cierre, reapertura, estado.

Regla rectora: no se prioriza lo más ruidoso, sino lo que más desbloquea. Mantra: estabilizar, cerrar, medir, subir un nivel.

Devolvé SIEMPRE el JSON con el formato pedido. Sé honesto en las estimaciones: no infles ni minimices.`;

// Defaults PLIC por intención, para el camino fallback (sin IA).
const PLIC_DEFAULTS_BY_INTENT = {
  error:            { event_type: 'error',    impact: 3, urgency: 4, blocked_items: 1, repetition: 1, risk: 3 },
  tarea:            { event_type: 'pedido',   impact: 3, urgency: 3, blocked_items: 0, repetition: 1, risk: 2 },
  'decisión':       { event_type: 'decisión', impact: 3, urgency: 2, blocked_items: 0, repetition: 1, risk: 2 },
  duda:             { event_type: 'pedido',   impact: 2, urgency: 2, blocked_items: 0, repetition: 1, risk: 1 },
  idea:             { event_type: 'idea',     impact: 2, urgency: 1, blocked_items: 0, repetition: 1, risk: 1 },
  consulta_general: { event_type: 'estado',   impact: 1, urgency: 1, blocked_items: 0, repetition: 1, risk: 1 },
};

function fallback(message) {
  const c = classifyIntent(message);
  const plic = PLIC_DEFAULTS_BY_INTENT[c.intent] || PLIC_DEFAULTS_BY_INTENT.consulta_general;
  return { ...c, plic: { ...plic }, source: 'keywords' };
}

async function analyzeMessage({ message, project }) {
  const ac = getClient();
  if (!ac) return fallback(message);

  try {
    const request = {
      model: MODEL,
      max_tokens: 4000,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [
        { role: 'user', content: `Proyecto: ${project ?? 'general'}\nMensaje: ${message}` },
      ],
      output_config: {

        format: { type: 'json_schema', schema: TORRE_SCHEMA },
      },
    };
    // Haiku/Sonnet: desactivar thinking (más rápido/barato). Fable/Opus 4.7+:
    // no mandar el parámetro (un 'disabled' explícito da 400).
    if (!modelOmitsThinkingDisable(MODEL)) {
      request.thinking = { type: 'disabled' };
    }

    const res = await ac.messages.create(request);

    // Chequear refusal ANTES de leer content (en refusal el content viene vacío).
    if (res.stop_reason === 'refusal') {
      console.warn('torreBrain: el modelo rechazó la solicitud (refusal), fallback a keywords.');
      return fallback(message);
    }

    const textBlock = res.content.find((b) => b.type === 'text');
    const parsed = JSON.parse(textBlock.text);

    const intent = INTENTS.includes(parsed.intent) ? parsed.intent : 'consulta_general';
    const priority = PRIORITIES.includes(parsed.priority) ? parsed.priority : 'baja';
    const plicClamped = clampPlic(parsed.plic || {});
    const eventType = EVENT_TYPES.includes(parsed.plic?.event_type) ? parsed.plic.event_type : 'estado';

    return {
      intent,
      priority,
      response: String(parsed.response || '').trim() || 'Entendido.',
      nextStep: String(parsed.nextStep || '').trim() || 'Ampliar información para poder avanzar.',
      plic: { event_type: eventType, ...plicClamped },
      source: 'ia',
    };
  } catch (err) {
    // Un 400 persistente con payload válido suele significar que la org no
    // tiene retención de datos de 30 días (requisito de Fable 5).
    console.warn('torreBrain: fallo la IA, fallback a keywords:', err.message);
    return fallback(message);
  }
}

module.exports = { analyzeMessage, MODEL };
