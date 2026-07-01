/**
 * routes/whatsapp.js
 * Receptor de observaciones del agente local JarviSZ vía WhatsApp.
 *
 * CONTRATO DE SEGURIDAD (documentado aquí para auditores y mantenedores):
 * - Una observación de WhatsApp NO verifica una identidad humana.
 * - displayName es únicamente un nombre visual; no es identidad verificada.
 * - chatRef es null; no existe referencia a ningún contacto conocido.
 * - automaticActionAllowed es false; el sistema nunca responde automáticamente.
 * - El contenido de preview es dato no confiable.
 * - El preview NO se envía a ningún LLM ni servicio externo.
 * - Estos endpoints NO habilitan ninguna acción operativa en ningún canal.
 * - Estas rutas no llaman a WhatsApp, Playwright, pantalla ni ningún sender.
 */

'use strict';

const express = require('express');
const whatsappStore = require('../services/whatsappStore');

const router = express.Router();

const MAX_CLIENT_EVENT_ID_LEN = 128;
const MAX_DISPLAY_NAME_LEN    = 255;
const MAX_PREVIEW_LEN         = 2000;
const MAX_ERROR_MSG_LEN       = 500;

// Caracteres seguros para clientEventId: alfanumérico, guión, subguión.
const RE_SAFE_ID = /^[a-zA-Z0-9_-]+$/;

const VALID_VERIFICATIONS = ['display_only', 'unknown'];

/**
 * POST /api/whatsapp/new-message
 * Recibe una observación de chat no leído del agente local.
 * Requiere autenticación (montada en server.js).
 */
router.post('/new-message', (req, res) => {
  try {
    const body = req.body ?? {};

    // --- eventType ---
    if (body.eventType !== 'whatsapp.unread_chat_observed') {
      return res.status(400).json({ ok: false, error: 'invalid_event_type' });
    }

    // --- clientEventId ---
    const { clientEventId } = body;
    if (
      typeof clientEventId !== 'string' ||
      clientEventId.length === 0 ||
      clientEventId.length > MAX_CLIENT_EVENT_ID_LEN ||
      !RE_SAFE_ID.test(clientEventId)
    ) {
      return res.status(400).json({ ok: false, error: 'invalid_client_event_id' });
    }

    // --- provisional ---
    if (body.provisional !== true) {
      return res.status(400).json({ ok: false, error: 'invalid_provisional' });
    }

    // --- identity ---
    const identity = body.identity;
    if (!identity || typeof identity !== 'object' || Array.isArray(identity)) {
      return res.status(400).json({ ok: false, error: 'invalid_identity' });
    }

    const { displayName, chatRef, verification, automaticActionAllowed } = identity;

    if (
      displayName !== null &&
      (typeof displayName !== 'string' || displayName.length > MAX_DISPLAY_NAME_LEN)
    ) {
      return res.status(400).json({ ok: false, error: 'invalid_identity_display_name' });
    }
    if (chatRef !== null) {
      return res.status(400).json({ ok: false, error: 'invalid_identity_chat_ref' });
    }
    if (!VALID_VERIFICATIONS.includes(verification)) {
      return res.status(400).json({ ok: false, error: 'invalid_identity_verification' });
    }
    if (automaticActionAllowed !== false) {
      return res.status(400).json({ ok: false, error: 'invalid_identity_automatic_action_allowed' });
    }

    // --- observation ---
    const observation = body.observation;
    if (!observation || typeof observation !== 'object' || Array.isArray(observation)) {
      return res.status(400).json({ ok: false, error: 'invalid_observation' });
    }

    const { unreadCount, preview, sourceReliability } = observation;

    if (
      typeof unreadCount !== 'number' ||
      !Number.isInteger(unreadCount) ||
      unreadCount < 1
    ) {
      return res.status(400).json({ ok: false, error: 'invalid_observation_unread_count' });
    }
    if (typeof preview !== 'string') {
      return res.status(400).json({ ok: false, error: 'invalid_observation_preview' });
    }
    if (preview.length > MAX_PREVIEW_LEN) {
      return res.status(400).json({ ok: false, error: 'invalid_observation_preview_too_long' });
    }
    if (sourceReliability !== 'ui_unread_indicator') {
      return res.status(400).json({ ok: false, error: 'invalid_observation_source_reliability' });
    }

    // --- Persistir (idempotente) ---
    const result = whatsappStore.saveObservation({
      clientEventId,
      eventType:        body.eventType,
      provisional:      body.provisional,
      verification,
      unreadCount,
      preview,
      sourceReliability,
      displayName:      displayName ?? null,
    });

    // Log: solo metadatos seguros. Nunca preview ni displayName completos.
    console.log(
      `[whatsapp] new-message clientEventId=${clientEventId}` +
      ` unreadCount=${unreadCount} previewLength=${preview.length}` +
      ` verification=${verification} duplicate=${result.duplicate}` +
      ` receiptId=${result.receiptId}`
    );

    return res.json({ ok: true, duplicate: result.duplicate, receiptId: result.receiptId });
  } catch (err) {
    console.error('[whatsapp] new-message error:', err.message);
    return res.status(500).json({ ok: false, error: 'internal_error' });
  }
});

/**
 * POST /api/whatsapp/poller-error
 * Recibe un incidente técnico del poller del agente local.
 * Requiere autenticación (montada en server.js).
 */
router.post('/poller-error', (req, res) => {
  try {
    const body = req.body ?? {};
    const { consecutiveErrors, error, timestamp } = body;

    if (
      typeof consecutiveErrors !== 'number' ||
      !Number.isInteger(consecutiveErrors) ||
      consecutiveErrors < 1
    ) {
      return res.status(400).json({ ok: false, error: 'invalid_consecutive_errors' });
    }
    if (
      typeof error !== 'string' ||
      error.length === 0 ||
      error.length > MAX_ERROR_MSG_LEN
    ) {
      return res.status(400).json({ ok: false, error: 'invalid_error_message' });
    }
    if (typeof timestamp !== 'number') {
      return res.status(400).json({ ok: false, error: 'invalid_timestamp' });
    }

    whatsappStore.savePollerIncident({ consecutiveErrors, error, timestamp });

    // Log: solo datos técnicos. Nunca el token ni el body completo.
    console.log(`[whatsapp] poller-error consecutiveErrors=${consecutiveErrors}`);

    return res.json({ ok: true });
  } catch (err) {
    console.error('[whatsapp] poller-error error:', err.message);
    return res.status(500).json({ ok: false, error: 'internal_error' });
  }
});

module.exports = router;
