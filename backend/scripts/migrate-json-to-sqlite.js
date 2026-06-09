// Migración one-shot: carga los datos legacy de data/messages.json y
// data/knowledge.json a la base SQLite. Idempotente: no duplica.
//
// Uso:  node scripts/migrate-json-to-sqlite.js
const fs   = require('fs');
const path = require('path');
const db   = require('../services/db');

const DATA_DIR = path.join(__dirname, '..', 'data');

function readJson(file) {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf8').trim();
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ── messages ──────────────────────────────────────────
const messages = readJson('messages.json');
const msgCount = db.prepare('SELECT COUNT(*) AS n FROM messages').get().n;
if (msgCount === 0 && messages.length) {
  const insert = db.prepare(`
    INSERT INTO messages (project, message, intent, priority, response, next_step, timestamp)
    VALUES (@project, @message, @intent, @priority, @response, @nextStep, @timestamp)
  `);
  const tx = db.transaction((rows) => {
    for (const m of rows) {
      insert.run({
        project:   m.project ?? null,
        message:   m.message,
        intent:    m.intent ?? null,
        priority:  m.priority ?? null,
        response:  m.response ?? null,
        nextStep:  m.nextStep ?? null,
        timestamp: m.timestamp ?? new Date().toISOString(),
      });
    }
  });
  tx(messages);
  console.log(`Migrados ${messages.length} mensaje(s).`);
} else {
  console.log(`Mensajes: sin cambios (tabla con ${msgCount} fila(s), JSON con ${messages.length}).`);
}

// ── knowledge ─────────────────────────────────────────
const knowledge = readJson('knowledge.json');
const insertK = db.prepare(`
  INSERT OR IGNORE INTO knowledge (id, project, topic, type, current_version, evolution, created_at, updated_at)
  VALUES (@id, @project, @topic, @type, @currentVersion, @evolution, @createdAt, @updatedAt)
`);
let inserted = 0;
const txK = db.transaction((rows) => {
  for (const k of rows) {
    const result = insertK.run({
      id:             k.id,
      project:        k.project ?? null,
      topic:          k.topic,
      type:           k.type,
      currentVersion: JSON.stringify(k.currentVersion),
      evolution:      JSON.stringify(k.evolution ?? []),
      createdAt:      k.createdAt ?? new Date().toISOString(),
      updatedAt:      k.updatedAt ?? new Date().toISOString(),
    });
    inserted += result.changes;
  }
});
txK(knowledge);
console.log(`Knowledge: ${inserted} item(s) nuevo(s) migrado(s) (de ${knowledge.length} en JSON).`);

console.log('Migración completa.');
