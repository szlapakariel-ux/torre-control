const express = require('express');
const cors = require('cors');
const { classifyIntent } = require('./services/intentClassifier');
const { saveMessage } = require('./services/storage');
const { readKnowledge, saveKnowledgeItem, updateKnowledgeItem } = require('./services/knowledgeStore');
const { fetchPage } = require('./services/browserReader');

const app = express();
const PORT = 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/api/message', (req, res) => {
  const { project, mode, message } = req.body ?? {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ ok: false, error: 'Mensaje vacío o inválido.' });
  }

  const classified = classifyIntent(message.trim());

  saveMessage({
    project,
    message: message.trim(),
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

app.post('/api/knowledge', (req, res) => {
  console.log('BODY KNOWLEDGE:', req.body);
  const { project, topic, type, title, description, why } = req.body ?? {};

  if (!topic || !type || !title) {
    return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios: topic, type, title.' });
  }

  const VALID_TYPES = ['decision', 'flujo', 'regla', 'arquitectura'];
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ ok: false, error: `Tipo inválido. Valores permitidos: ${VALID_TYPES.join(', ')}.` });
  }

  const item = saveKnowledgeItem({ project, topic, type, title, description, why });
  res.status(201).json({ ok: true, item });
});

app.patch('/api/knowledge/:id', (req, res) => {
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

// ── Browser: leer contenido de una URL ────────────────

app.post('/api/browse', async (req, res) => {
  const url = req.body?.url;

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ ok: false, error: 'Falta el campo "url".' });
  }

  try {
    const result = await fetchPage(url.trim());
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(422).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  Torre de Control backend → http://localhost:${PORT}\n`);
});
