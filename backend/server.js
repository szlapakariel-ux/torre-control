const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { saveMessage } = require('./services/storage');
const { readKnowledge, saveKnowledgeItem, updateKnowledgeItem } = require('./services/knowledgeStore');
const { analyzeMessage } = require('./services/torreBrain');
const { synthesizeToBase64 } = require('./services/elevenLabsVoice');
const { createEvent, listEvents, updateEvent, getRanking } = require('./services/plicStore');
const { EVENT_TYPES, EVENT_STATUSES } = require('./services/plicScore');
const {
  registerAgent, updateHeartbeat, getAgentStatus,
  startNewCycle, readAgentWindow, writeAgentWindow,
  screenshotAgentWindow, registerWindowOnAgent,
  getCycleHistory, receiveCycleResult,
} = require('./services/orchestrator');
const { initCycleTable } = require('./services/cycleStore');

const app = express();
const PORT = process.env.PORT || 3001;

// Orígenes permitidos para CORS. En producción se setea ALLOWED_ORIGIN
// (uno o varios separados por coma). Sin la variable, se cae a localhost para dev.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || 'http://localhost:3001,http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Token de escritura. Si no se define, los endpoints de escritura quedan
// deshabilitados en producción (se exige configurarlo explícitamente).
const API_TOKEN = process.env.API_TOKEN || '';

app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      mediaSrc: ["'self'", "blob:"],
    },
  },
}));
app.use(cors({
  origin(origin, cb) {
    // Permite herramientas sin Origin (curl, health checks) y orígenes en lista.
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error('Origen no permitido por CORS.'));
  },
}));
app.use(express.json({ limit: '32kb' }));

// Sirve el frontend estático desde el mismo origen (sin CORS entre front y back).
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Demasiadas solicitudes. Probá de nuevo en un minuto.' },
});

// Middleware de autenticación para endpoints de escritura.
function requireAuth(req, res, next) {
  if (!API_TOKEN) {
    return res.status(503).json({ ok: false, error: 'Escritura deshabilitada: falta configurar API_TOKEN en el servidor.' });
  }
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (token !== API_TOKEN) {
    return res.status(401).json({ ok: false, error: 'No autorizado.' });
  }
  next();
}

const MAX_MESSAGE_LENGTH = 4000;
const MAX_FIELD_LENGTH = 2000;

// async: analyzeMessage puede llamar a la API de Claude. En Express 4 el
// middleware de error global NO captura rechazos async, así que el handler
// envuelve todo en try/catch y delega a next(err) ante una falla inesperada.
app.post('/api/message', writeLimiter, requireAuth, async (req, res, next) => {
  try {
    const { project, mode, message } = req.body ?? {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ ok: false, error: 'Mensaje vacío o inválido.' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ ok: false, error: `El mensaje supera el máximo de ${MAX_MESSAGE_LENGTH} caracteres.` });
    }

    const text = message.trim();
    // analyzeMessage tiene fallback interno: nunca lanza por falta de key o
    // error de la API; siempre devuelve una clasificación (IA o keywords).
    const result = await analyzeMessage({ message: text, project });

    // Generar audio de la respuesta con ElevenLabs (voz del primer Jarvis)
    const audioBase64 = await synthesizeToBase64(result.response);

    const messageId = saveMessage({
      project,
      message:  text,
      intent:   result.intent,
      priority: result.priority,
      response: result.response,
      nextStep: result.nextStep,
    });

    // Cada mensaje del chat queda registrado como evento PLIC: así el ranking
    // está vivo desde el primer mensaje, sin curaduría manual.
    createEvent({
      source:         'chat',
      project:        project ?? null,
      event_type:     result.plic.event_type,
      actor:          'ariel',
      description:    text,
      impact:         result.plic.impact,
      urgency:        result.plic.urgency,
      blocked_items:  result.plic.blocked_items,
      repetition:     result.plic.repetition,
      risk:           result.plic.risk,
      recommendation: result.nextStep,
      message_id:     messageId,
    });

    res.json({
      ok: true,
      project: project ?? null,
      mode: mode ?? 'pensar',
      intent: result.intent,
      priority: result.priority,
      response: result.response,
      audio: audioBase64 || null,
      nextStep: result.nextStep,
      plic: result.plic,
      source: result.source,
    });
  } catch (err) {
    next(err);
  }
});

// ── Knowledge endpoints ───────────────────────────────

app.post('/api/knowledge', writeLimiter, requireAuth, (req, res) => {
  const { project, topic, type, title, description, why } = req.body ?? {};

  if (!topic || !type || !title) {
    return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios: topic, type, title.' });
  }

  const VALID_TYPES = ['decision', 'flujo', 'regla', 'arquitectura'];
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ ok: false, error: `Tipo inválido. Valores permitidos: ${VALID_TYPES.join(', ')}.` });
  }

  for (const [name, value] of Object.entries({ topic, title, description, why })) {
    if (typeof value === 'string' && value.length > MAX_FIELD_LENGTH) {
      return res.status(400).json({ ok: false, error: `El campo ${name} supera el máximo de ${MAX_FIELD_LENGTH} caracteres.` });
    }
  }

  const item = saveKnowledgeItem({ project, topic, type, title, description, why });
  res.status(201).json({ ok: true, item });
});

app.patch('/api/knowledge/:id', writeLimiter, requireAuth, (req, res) => {
  const { id } = req.params;
  const { title, description, why } = req.body ?? {};

  if (!title && !description && !why) {
    return res.status(400).json({ ok: false, error: 'Enviá al menos un campo a actualizar: title, description, why.' });
  }

  const updated = updateKnowledgeItem(id, { title, description, why });
  if (!updated) {
    return res.status(404).json({ ok: false, error: `No se encontró el item con id: ${id}` });
  }

  res.json({ ok: true, item: updated });
});

app.get('/api/knowledge', (req, res) => {
  const { project } = req.query;
  const all = readKnowledge();
  const result = project ? all.filter((i) => i.project === project) : all;
  res.json({ ok: true, items: result });
});

// ── PLIC events endpoints ─────────────────────────────

app.post('/api/events', writeLimiter, requireAuth, (req, res) => {
  const { description, event_type } = req.body ?? {};

  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ ok: false, error: 'Falta el campo obligatorio: description.' });
  }
  if (description.length > MAX_FIELD_LENGTH) {
    return res.status(400).json({ ok: false, error: `description supera el máximo de ${MAX_FIELD_LENGTH} caracteres.` });
  }
  if (event_type && !EVENT_TYPES.includes(event_type)) {
    return res.status(400).json({ ok: false, error: `event_type inválido. Valores: ${EVENT_TYPES.join(', ')}.` });
  }

  const event = createEvent({ ...req.body, source: req.body.source || 'api' });
  res.status(201).json({ ok: true, event });
});

app.patch('/api/events/:id', writeLimiter, requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const fields = req.body ?? {};

  if (fields.status && !EVENT_STATUSES.includes(fields.status)) {
    return res.status(400).json({ ok: false, error: `status inválido. Valores: ${EVENT_STATUSES.join(', ')}.` });
  }
  if (fields.event_type && !EVENT_TYPES.includes(fields.event_type)) {
    return res.status(400).json({ ok: false, error: `event_type inválido. Valores: ${EVENT_TYPES.join(', ')}.` });
  }

  const updated = updateEvent(id, fields);
  if (!updated) {
    return res.status(404).json({ ok: false, error: `No se encontró el evento con id: ${id}` });
  }
  res.json({ ok: true, event: updated });
});

app.get('/api/events', (req, res) => {
  const { project, status } = req.query;
  res.json({ ok: true, events: listEvents({ project, status }) });
});

app.get('/api/plic/ranking', (_req, res) => {
  res.json({ ok: true, ranking: getRanking() });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, status: 'Torre de Control backend activo.' });
});

// ── Orquestador: agente local ─────────────────────────

// El agente local se registra al arrancar
app.post('/api/agent/register', (req, res) => {
  const info = registerAgent(req.body);
  res.json({ ok: true, agent: info });
});

// Heartbeat del agente (cada 30s)
app.post('/api/agent/heartbeat', (req, res) => {
  updateHeartbeat(req.body);
  res.json({ ok: true });
});

// Estado del agente (para Torre UI)
app.get('/api/agent/status', (_req, res) => {
  res.json({ ok: true, agent: getAgentStatus() });
});

// Registrar ventana nueva en el agente en caliente
app.post('/api/agent/windows', writeLimiter, requireAuth, async (req, res, next) => {
  try {
    const { name, type, urlPattern } = req.body || {};
    if (!name || !type) return res.status(400).json({ ok: false, error: 'Faltan name y type.' });
    const result = await registerWindowOnAgent(name, type, urlPattern);
    res.json({ ok: true, result });
  } catch (err) { next(err); }
});

// ── Orquestador: ciclos ───────────────────────────────

// Iniciar un ciclo nuevo (source → target → notify)
app.post('/api/cycles', writeLimiter, requireAuth, async (req, res, next) => {
  try {
    const { source, target, notify, prompt } = req.body || {};
    if (!source || !target) return res.status(400).json({ ok: false, error: 'Faltan source y target.' });
    const cycle = await startNewCycle({ source, target, notify, prompt });
    res.status(201).json({ ok: true, cycle });
  } catch (err) { next(err); }
});

// Historial de ciclos
app.get('/api/cycles', (_req, res) => {
  const limit = Math.min(parseInt(_req.query.limit || '20'), 100);
  res.json({ ok: true, cycles: getCycleHistory(limit) });
});

// El agente local reporta resultado de ciclo
app.post('/api/cycles/result', (req, res) => {
  receiveCycleResult(req.body);
  res.json({ ok: true });
});

// Acciones directas sobre ventanas (sin iniciar ciclo completo)
app.post('/api/agent/read', writeLimiter, requireAuth, async (req, res, next) => {
  try {
    const { window: win } = req.body || {};
    if (!win) return res.status(400).json({ ok: false, error: 'Falta window.' });
    const result = await readAgentWindow(win);
    res.json({ ok: true, ...result });
  } catch (err) { next(err); }
});

app.post('/api/agent/write', writeLimiter, requireAuth, async (req, res, next) => {
  try {
    const { window: win, text, submit } = req.body || {};
    if (!win || !text) return res.status(400).json({ ok: false, error: 'Faltan window y text.' });
    const result = await writeAgentWindow(win, text, submit ?? false);
    res.json({ ok: true, ...result });
  } catch (err) { next(err); }
});

app.post('/api/agent/screenshot', writeLimiter, requireAuth, async (req, res, next) => {
  try {
    const { window: win } = req.body || {};
    if (!win) return res.status(400).json({ ok: false, error: 'Falta window.' });
    const result = await screenshotAgentWindow(win);
    res.json({ ok: true, image: result.image });
  } catch (err) { next(err); }
});

// ── Voz JARVIS (ElevenLabs) ──────────────────────────────────────────────────

const { synthesize: elevenSynthesize, isConfigured: elevenConfigured } = require('./services/elevenLabsVoice');

const voiceLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, error: 'Demasiadas solicitudes de voz. Probá en un minuto.' },
});

// GET /api/voz/status — sin auth, solo informa si está configurado
app.get('/api/voz/status', (_req, res) => {
    res.json({ ok: true, configured: elevenConfigured() });
});

// POST /api/voz — requiere auth, devuelve audio/mpeg
app.post('/api/voz', writeLimiter, voiceLimiter, requireAuth, async (req, res) => {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string' || !text.trim()) {
          return res.status(400).json({ ok: false, error: 'Falta el campo "text" en el body.' });
    }
    if (text.length > 500) {
          return res.status(400).json({ ok: false, error: 'El texto no puede superar los 500 caracteres.' });
    }
    try {
          const audioBuffer = await elevenSynthesize(text.trim());
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Content-Length', audioBuffer.length);
          res.setHeader('Cache-Control', 'no-store');
          res.send(audioBuffer);
    } catch (err) {
          console.error('Error en síntesis de voz ElevenLabs:', err.message);
          res.status(502).json({ ok: false, error: err.message });
    }
});

// ── Manejo de errores global ──────────────────────────
// Captura errores de CORS, JSON malformado y cualquier excepción de un handler,
// para que una request inválida no tire el proceso.
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ ok: false, error: 'Payload demasiado grande.' });
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ ok: false, error: 'JSON inválido.' });
  }
  if (err.message === 'Origen no permitido por CORS.') {
    return res.status(403).json({ ok: false, error: err.message });
  }
  console.error('Error no controlado:', err);
  res.status(500).json({ ok: false, error: 'Error interno del servidor.' });
});

// Inicializar tablas adicionales
initCycleTable();

const server = app.listen(PORT, () => {
  console.log(`Torre de Control backend → puerto ${PORT}`);
});

// Apagado ordenado para no perder escrituras en redeploys.
function shutdown(signal) {
  console.log(`Recibido ${signal}, cerrando servidor...`);
  server.close(() => process.exit(0));
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = app;
