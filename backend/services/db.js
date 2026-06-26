const fs   = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// El archivo de la base vive en DATA_DIR (montar un volumen persistente en
// producción para que sobreviva a redeploys). Por defecto, ./data junto al backend.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_FILE = path.join(DATA_DIR, 'torre.db');
const db = new Database(DB_FILE);

// WAL: mejor concurrencia lectura/escritura que el modo rollback por defecto.
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    project   TEXT,
    message   TEXT NOT NULL,
    intent    TEXT,
    priority  TEXT,
    response  TEXT,
    next_step TEXT,
    timestamp TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS knowledge (
    id          TEXT PRIMARY KEY,
    project     TEXT,
    topic       TEXT NOT NULL,
    type        TEXT NOT NULL,
    -- currentVersion y evolution se guardan como JSON serializado.
    current_version TEXT NOT NULL,
    evolution       TEXT NOT NULL,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_knowledge_project ON knowledge(project);

  -- Eventos PLIC. Cada mensaje del chat genera uno (source='chat'); también se
  -- pueden crear a mano por API. El score/priority se calculan en plicScore.js.
  CREATE TABLE IF NOT EXISTS events (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    source         TEXT NOT NULL DEFAULT 'chat',     -- chat | api | torre
    project        TEXT,
    event_type     TEXT NOT NULL,                    -- uno de los 12 tipos PLIC
    actor          TEXT,
    target         TEXT,
    description    TEXT NOT NULL,
    impact         INTEGER NOT NULL DEFAULT 1,       -- 1-5
    urgency        INTEGER NOT NULL DEFAULT 1,       -- 1-5
    blocked_items  INTEGER NOT NULL DEFAULT 0,       -- >= 0
    repetition     INTEGER NOT NULL DEFAULT 1,       -- 1-5
    risk           INTEGER NOT NULL DEFAULT 1,       -- 1-5
    status         TEXT NOT NULL DEFAULT 'abierto',  -- abierto | en_curso | cerrado
    evidence       TEXT,
    recommendation TEXT,
    score          REAL NOT NULL DEFAULT 0,
    priority       TEXT NOT NULL DEFAULT 'P3',       -- P0 | P1 | P2 | P3
    message_id     INTEGER,                          -- messages.id si vino del chat
    created_at     TEXT NOT NULL,
    updated_at     TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_events_status   ON events(status);
  CREATE INDEX IF NOT EXISTS idx_events_project  ON events(project);
  CREATE INDEX IF NOT EXISTS idx_events_priority ON events(priority);
`);

module.exports = db;
