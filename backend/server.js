const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { classifyIntent } = require('./services/intentClassifier');
const { saveMessage } = require('./services/storage');
const { readKnowledge, saveKnowledgeItem, updateKnowledgeItem } = require('./services/knowledgeStore');

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

app.post('/api/message', writeLimiter, requireAuth, (req, res) => {
  const { project, mode, message } = req.body ?? {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ ok: false, error: 'Mensaje vacío o inválido.' });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ ok: false, error: `El mensaje supera el máximo de ${MAX_MESSAGE_LENGTH} caracteres.` });
  }

  const classified = classifyIntent(message.trim());

  saveMessage({
    project,
    message:   message.trim(),
    intent:    classified.intent,
    priority:  classified.priority,
    response:  classified.response,
    nextStep:  classified.nextStep,
  });

  res.json({
    ok: true,
    project: project ?? null,
    mode: mode ?? 'pensar',
    intent: classified.intent,
    priority: classified.priority,
    response: classified.response,
    nextStep: classified.nextStep,
  });
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
