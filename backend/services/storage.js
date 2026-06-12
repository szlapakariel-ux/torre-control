const db = require('./db');

const insertStmt = db.prepare(`
  INSERT INTO messages (project, message, intent, priority, response, next_step, timestamp)
  VALUES (@project, @message, @intent, @priority, @response, @nextStep, @timestamp)
`);

const selectAllStmt = db.prepare(`
  SELECT id, project, message, intent, priority, response,
         next_step AS nextStep, timestamp
  FROM messages
  ORDER BY id ASC
`);

function saveMessage({ project, message, intent, priority, response, nextStep }) {
  const info = insertStmt.run({
    project:   project ?? null,
    message,
    intent:    intent ?? null,
    priority:  priority ?? null,
    response:  response ?? null,
    nextStep:  nextStep ?? null,
    timestamp: new Date().toISOString(),
  });
  return info.lastInsertRowid;
}

function readAll() {
  return selectAllStmt.all();
}

module.exports = { saveMessage, readAll };
