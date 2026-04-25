const fs   = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'messages.json');

function readAll() {
  try {
    const raw = fs.readFileSync(FILE, 'utf8').trim();
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessage({ project, message, intent, priority, response, nextStep }) {
  const records = readAll();
  records.push({
    project:   project ?? null,
    message,
    intent,
    priority,
    response,
    nextStep,
    timestamp: new Date().toISOString(),
  });
  fs.writeFileSync(FILE, JSON.stringify(records, null, 2), 'utf8');
}

module.exports = { saveMessage, readAll };
