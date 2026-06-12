const db = require('./db');
const { EVENT_TYPES, EVENT_STATUSES, clampPlic, computeScore, toPriority } = require('./plicScore');

const insertStmt = db.prepare(`
  INSERT INTO events
    (source, project, event_type, actor, target, description,
     impact, urgency, blocked_items, repetition, risk,
     status, evidence, recommendation, score, priority, message_id,
     created_at, updated_at)
  VALUES
    (@source, @project, @eventType, @actor, @target, @description,
     @impact, @urgency, @blockedItems, @repetition, @risk,
     @status, @evidence, @recommendation, @score, @priority, @messageId,
     @createdAt, @updatedAt)
`);

const selectByIdStmt = db.prepare(`SELECT * FROM events WHERE id = ?`);
const updateStmt = db.prepare(`
  UPDATE events SET
    event_type     = @eventType,
    impact         = @impact,
    urgency        = @urgency,
    blocked_items  = @blockedItems,
    repetition     = @repetition,
    risk           = @risk,
    status         = @status,
    evidence       = @evidence,
    recommendation = @recommendation,
    score          = @score,
    priority       = @priority,
    updated_at     = @updatedAt
  WHERE id = @id
`);

// Convierte una fila de SQLite al objeto camelCase que expone la API.
function rowToEvent(row) {
  if (!row) return null;
  return {
    id:             row.id,
    source:         row.source,
    project:        row.project,
    eventType:      row.event_type,
    actor:          row.actor,
    target:         row.target,
    description:    row.description,
    impact:         row.impact,
    urgency:        row.urgency,
    blockedItems:   row.blocked_items,
    repetition:     row.repetition,
    risk:           row.risk,
    status:         row.status,
    evidence:       row.evidence,
    recommendation: row.recommendation,
    score:          row.score,
    priority:       row.priority,
    messageId:      row.message_id,
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
  };
}

function createEvent(data = {}) {
  const eventType = EVENT_TYPES.includes(data.event_type) ? data.event_type : 'estado';
  const status = EVENT_STATUSES.includes(data.status) ? data.status : 'abierto';
  const plic = clampPlic(data);
  const score = computeScore({ ...plic, event_type: eventType });
  const priority = toPriority({ ...plic, event_type: eventType });
  const now = new Date().toISOString();

  const info = insertStmt.run({
    source:         data.source ?? 'api',
    project:        data.project ?? null,
    eventType,
    actor:          data.actor ?? null,
    target:         data.target ?? null,
    description:    String(data.description ?? '').trim(),
    impact:         plic.impact,
    urgency:        plic.urgency,
    blockedItems:   plic.blocked_items,
    repetition:     plic.repetition,
    risk:           plic.risk,
    status,
    evidence:       data.evidence ?? null,
    recommendation: data.recommendation ?? null,
    score,
    priority,
    messageId:      data.message_id ?? null,
    createdAt:      now,
    updatedAt:      now,
  });

  return rowToEvent(selectByIdStmt.get(info.lastInsertRowid));
}

function listEvents({ project, status } = {}) {
  const clauses = [];
  const params = [];
  if (project) { clauses.push('project = ?'); params.push(project); }
  if (status)  { clauses.push('status = ?');  params.push(status); }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const rows = db.prepare(`SELECT * FROM events ${where} ORDER BY score DESC, id DESC`).all(...params);
  return rows.map(rowToEvent);
}

// Actualiza campos editables (estado y/o dimensiones PLIC) y recalcula score.
function updateEvent(id, fields = {}) {
  const existing = rowToEvent(selectByIdStmt.get(id));
  if (!existing) return null;

  const eventType = EVENT_TYPES.includes(fields.event_type) ? fields.event_type : existing.eventType;
  const status = EVENT_STATUSES.includes(fields.status) ? fields.status : existing.status;

  const merged = clampPlic({
    impact:        fields.impact        ?? existing.impact,
    urgency:       fields.urgency       ?? existing.urgency,
    blocked_items: fields.blocked_items ?? existing.blockedItems,
    repetition:    fields.repetition    ?? existing.repetition,
    risk:          fields.risk          ?? existing.risk,
  });

  const score = computeScore({ ...merged, event_type: eventType });
  const priority = toPriority({ ...merged, event_type: eventType });

  updateStmt.run({
    id,
    eventType,
    impact:         merged.impact,
    urgency:        merged.urgency,
    blockedItems:   merged.blocked_items,
    repetition:     merged.repetition,
    risk:           merged.risk,
    status,
    evidence:       fields.evidence       ?? existing.evidence,
    recommendation: fields.recommendation ?? existing.recommendation,
    score,
    priority,
    updatedAt:      new Date().toISOString(),
  });

  return rowToEvent(selectByIdStmt.get(id));
}

// Ranking PLIC: eventos no cerrados, ordenados por score desc, agrupados por bucket.
function getRanking() {
  const abiertos = listEvents().filter((e) => e.status !== 'cerrado');
  const buckets = { P0: [], P1: [], P2: [], P3: [] };
  for (const e of abiertos) {
    (buckets[e.priority] || buckets.P3).push(e);
  }
  return {
    generatedAt:   new Date().toISOString(),
    totalAbiertos: abiertos.length,
    buckets,
    top:           abiertos.slice(0, 10),
  };
}

module.exports = { createEvent, listEvents, updateEvent, getRanking };
