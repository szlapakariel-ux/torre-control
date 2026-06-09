const db = require('./db');

const insertStmt = db.prepare(`
  INSERT INTO knowledge (id, project, topic, type, current_version, evolution, created_at, updated_at)
  VALUES (@id, @project, @topic, @type, @currentVersion, @evolution, @createdAt, @updatedAt)
`);

const selectAllStmt  = db.prepare(`SELECT * FROM knowledge ORDER BY created_at ASC`);
const selectByIdStmt = db.prepare(`SELECT * FROM knowledge WHERE id = ?`);
const updateStmt     = db.prepare(`
  UPDATE knowledge
  SET current_version = @currentVersion, evolution = @evolution, updated_at = @updatedAt
  WHERE id = @id
`);

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Convierte una fila de SQLite (con JSON serializado) al objeto que espera la API.
function rowToItem(row) {
  if (!row) return null;
  return {
    id:             row.id,
    project:        row.project,
    topic:          row.topic,
    type:           row.type,
    currentVersion: JSON.parse(row.current_version),
    evolution:      JSON.parse(row.evolution),
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
  };
}

function readKnowledge() {
  return selectAllStmt.all().map(rowToItem);
}

function saveKnowledgeItem({ project, topic, type, title, description, why }) {
  const now  = new Date().toISOString();
  const item = {
    id: generateId(),
    project: project ?? null,
    topic,
    type,
    currentVersion: {
      version:     1,
      title,
      description: description ?? null,
      why:         why ?? null,
      status:      'actual',
    },
    evolution: [
      { version: 1, summary: title },
    ],
    createdAt: now,
    updatedAt: now,
  };

  insertStmt.run({
    id:             item.id,
    project:        item.project,
    topic:          item.topic,
    type:           item.type,
    currentVersion: JSON.stringify(item.currentVersion),
    evolution:      JSON.stringify(item.evolution),
    createdAt:      item.createdAt,
    updatedAt:      item.updatedAt,
  });

  return item;
}

function updateKnowledgeItem(id, { title, description, why }) {
  const existing = rowToItem(selectByIdStmt.get(id));
  if (!existing) return null;

  const now = new Date().toISOString();

  // Archiva la versión actual en el historial de evolución.
  existing.evolution.push({
    version: existing.currentVersion.version,
    summary: existing.currentVersion.title,
  });

  existing.currentVersion = {
    version:     existing.currentVersion.version + 1,
    title:       title       ?? existing.currentVersion.title,
    description: description ?? existing.currentVersion.description,
    why:         why         ?? existing.currentVersion.why,
    status:      'actual',
  };
  existing.updatedAt = now;

  updateStmt.run({
    id,
    currentVersion: JSON.stringify(existing.currentVersion),
    evolution:      JSON.stringify(existing.evolution),
    updatedAt:      now,
  });

  return existing;
}

module.exports = { readKnowledge, saveKnowledgeItem, updateKnowledgeItem };
