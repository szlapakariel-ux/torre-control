/**
 * whatsappStore.js
 * Persistencia de observaciones WhatsApp y de incidentes del poller local.
 *
 * CONTRATO DE SEGURIDAD:
 * - Una observación de WhatsApp NO verifica una identidad humana.
 * - displayName es únicamente un nombre visual; no representa identidad verificada.
 * - chatRef es siempre null; no hay referencia a contacto conocido.
 * - automaticActionAllowed es siempre false; el sistema no responde automáticamente.
 * - El contenido de preview es dato no confiable; nunca se envía a un LLM.
 * - Este módulo NO habilita ninguna acción operativa en ningún canal.
 */

const crypto = require('crypto');
const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS wa_observations (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_id         TEXT    NOT NULL UNIQUE,
    client_event_id    TEXT    NOT NULL UNIQUE,
    received_at        TEXT    NOT NULL,
    event_type         TEXT    NOT NULL,
    provisional        INTEGER NOT NULL CHECK(provisional = 1),
    verification       TEXT    NOT NULL,
    unread_count       INTEGER NOT NULL,
    preview            TEXT,
    preview_length     INTEGER NOT NULL,
    source_reliability TEXT    NOT NULL,
    display_name       TEXT,
    delivery_origin    TEXT    NOT NULL DEFAULT 'jarvisz-local-agent'
  );

  CREATE TABLE IF NOT EXISTS wa_poller_incidents (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    consecutive_errors INTEGER NOT NULL,
    error_message      TEXT,
    agent_timestamp    REAL,
    received_at        TEXT    NOT NULL
  );
`);

const stmtFindByClientEventId = db.prepare(
  'SELECT receipt_id FROM wa_observations WHERE client_event_id = ?'
);

const stmtInsertObservation = db.prepare(`
  INSERT INTO wa_observations
    (receipt_id, client_event_id, received_at, event_type, provisional,
     verification, unread_count, preview, preview_length,
     source_reliability, display_name, delivery_origin)
  VALUES
    (@receiptId, @clientEventId, @receivedAt, @eventType, @provisional,
     @verification, @unreadCount, @preview, @previewLength,
     @sourceReliability, @displayName, @deliveryOrigin)
`);

const stmtInsertIncident = db.prepare(`
  INSERT INTO wa_poller_incidents
    (consecutive_errors, error_message, agent_timestamp, received_at)
  VALUES
    (@consecutiveErrors, @errorMessage, @agentTimestamp, @receivedAt)
`);

/**
 * Persiste una observación de chat no leído de forma idempotente.
 * Si clientEventId ya existe, devuelve el receiptId original sin insertar.
 */
function saveObservation({ clientEventId, eventType, provisional, verification,
                           unreadCount, preview, sourceReliability, displayName }) {
  const existing = stmtFindByClientEventId.get(clientEventId);
  if (existing) {
    return { duplicate: true, receiptId: existing.receipt_id };
  }

  const receiptId = crypto.randomUUID();
  const receivedAt = new Date().toISOString();

  stmtInsertObservation.run({
    receiptId,
    clientEventId,
    receivedAt,
    eventType,
    provisional: provisional ? 1 : 0,
    verification,
    unreadCount,
    preview:       preview ?? null,
    previewLength: typeof preview === 'string' ? preview.length : 0,
    sourceReliability,
    displayName:   displayName ?? null,
    deliveryOrigin: 'jarvisz-local-agent',
  });

  return { duplicate: false, receiptId };
}

/**
 * Persiste un incidente técnico del poller de WhatsApp.
 */
function savePollerIncident({ consecutiveErrors, error, timestamp }) {
  stmtInsertIncident.run({
    consecutiveErrors,
    errorMessage:   error ?? null,
    agentTimestamp: timestamp ?? null,
    receivedAt:     new Date().toISOString(),
  });
}

module.exports = { saveObservation, savePollerIncident };
