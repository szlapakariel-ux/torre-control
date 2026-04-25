const fs   = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'knowledge.json');

function readKnowledge() {
  try {
    const raw = fs.readFileSync(FILE, 'utf8').trim();
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(items) {
  fs.writeFileSync(FILE, JSON.stringify(items, null, 2), 'utf8');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function saveKnowledgeItem({ project, topic, type, title, description, why }) {
  const items = readKnowledge();
  const now   = new Date().toISOString();

  const item = {
    id: generateId(),
    project: project ?? null,
    topic,
    type,
    currentVersion: {
      version:     1,
      title,
      description,
      why:         why ?? null,
      status:      'actual',
    },
    evolution: [
      { version: 1, summary: title },
    ],
    createdAt: now,
    updatedAt: now,
  };

  items.push(item);
  write(items);
  return item;
}

function updateKnowledgeItem(id, { title, description, why }) {
  const items = readKnowledge();
  const idx   = items.findIndex((i) => i.id === id);

  if (idx === -1) return null;

  const existing = items[idx];
  const nextVersion = existing.currentVersion.version + 1;
  const now = new Date().toISOString();

  // Archive old version into evolution
  existing.evolution.push({
    version: existing.currentVersion.version,
    summary: existing.currentVersion.title,
  });

  existing.currentVersion = {
    version:     nextVersion,
    title:       title       ?? existing.currentVersion.title,
    description: description ?? existing.currentVersion.description,
    why:         why         ?? existing.currentVersion.why,
    status:      'actual',
  };

  existing.updatedAt = now;
  items[idx] = existing;
  write(items);
  return existing;
}

module.exports = { readKnowledge, saveKnowledgeItem, updateKnowledgeItem };
