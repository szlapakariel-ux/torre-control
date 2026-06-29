/**
 * cycleStore.js
 * Persistencia de ciclos de coordinación en SQLite.
 */

const db = require('./db');

function initCycleTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cycles (
      id          TEXT PRIMARY KEY,
      source      TEXT NOT NULL,
      target      TEXT NOT NULL,
      notify      TEXT,
      prompt      TEXT,
      result      TEXT,
      status      TEXT NOT NULL DEFAULT 'pending',
      created_at  INTEGER NOT NULL,
      completed_at INTEGER,
      error       TEXT
    );
  `);
}

function createCycle({ id, source, target, notify, prompt }) {
  db.prepare(`
    INSERT INTO cycles (id, source, target, notify, prompt, status, created_at)
    VALUES (@id, @source, @target, @notify, @prompt, 'pending', @created_at)
  `).run({ id, source, target, notify: notify || null, prompt: prompt || null, created_at: Date.now() });
  return getCycle(id);
}

function startCycle(id) {
  db.prepare(`UPDATE cycles SET status = 'running' WHERE id = ?`).run(id);
}

function completeCycle(id, result) {
  db.prepare(`
    UPDATE cycles
    SET status = 'completed', result = @result, completed_at = @completed_at
    WHERE id = @id
  `).run({ id, result: typeof result === 'string' ? result : JSON.stringify(result), completed_at: Date.now() });
}

function failCycle(id, error) {
  db.prepare(`
    UPDATE cycles
    SET status = 'failed', error = @error, completed_at = @completed_at
    WHERE id = @id
  `).run({ id, error: String(error), completed_at: Date.now() });
}

function getCycle(id) {
  return db.prepare(`SELECT * FROM cycles WHERE id = ?`).get(id) || null;
}

function getRecentCycles(limit = 20) {
  return db.prepare(`
    SELECT * FROM cycles ORDER BY created_at DESC LIMIT ?
  `).all(limit);
}

function getActiveCycles() {
  return db.prepare(`
    SELECT * FROM cycles WHERE status IN ('pending', 'running') ORDER BY created_at ASC
  `).all();
}

module.exports = {
  initCycleTable,
  createCycle,
  startCycle,
  completeCycle,
  failCycle,
  getCycle,
  getRecentCycles,
  getActiveCycles,
};
