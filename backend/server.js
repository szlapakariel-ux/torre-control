const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { saveMessage } = require('./services/storage');
const { readKnowledge, saveKnowledgeItem, updateKnowledgeItem } = require('./services/knowledgeStore');
const { analyzeMessage } = require('./services/torreBrain');
const { createEvent, listEvents, updateEvent, getRanking } = require('./services/plicStore');
const { EVENT_TYPES, EVENT_STATUSES } = require('./services/plicScore');

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
app.use(helmet());
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
