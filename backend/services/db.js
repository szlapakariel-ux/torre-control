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
`);

module.exports = db;
