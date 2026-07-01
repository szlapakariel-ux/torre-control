'use strict';

/**
 * Tests del receptor WhatsApp de Torre-Control.
 * Cubre autenticación, validación de payload, idempotencia y privacidad de logs.
 */

// --- Entorno aislado: DB temporal + token de test ---
const os   = require('os');
const path = require('path');
const fs   = require('fs');

const TEST_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'torre-test-wa-'));
process.env.DATA_DIR  = TEST_DATA_DIR;
process.env.API_TOKEN = 'test-tower-token-x1';
process.env.PORT      = '0'; // Puerto aleatorio para evitar colisiones.

// --- Dependencias de test ---
const { test, after, mock } = require('node:test');
const assert = require('node:assert/strict');
const supertest = require('supertest');

const { app, server } = require('../server');
const whatsappStore   = require('../services/whatsappStore');
const request         = supertest(app);

const AUTH           = 'Bearer test-tower-token-x1';
const WRONG_AUTH     = 'Bearer wrong-token';
const ENDPOINT_MSG   = '/api/whatsapp/new-message';
const ENDPOINT_ERR   = '/api/whatsapp/poller-error';

// Payload mínimo válido; los tests lo sobrescriben cuando necesitan variaciones.
function basePayload(overrides = {}) {
  return Object.assign(
    {
      eventType:     'whatsapp.unread_chat_observed',
      clientEventId: 'wa-p-base-valid-001',
      provisional:   true,
      identity: {
        displayName:           'Alguien',
        chatRef:               null,
        verification:          'display_only',
        automaticActionAllowed: false,
      },
      observation: {
        unreadCount:       1,
        preview:           'Hola mundo',
        sourceReliability: 'ui_unread_indicator',
      },
    },
    overrides
  );
}

// Genera un clientEventId único para evitar colisiones entre tests.
let _seq = 0;
function uid() { return `wa-p-test-${++_seq}`; }

// ── 1. Token ausente ─────────────────────────────────────────────────────────
test('1. Token ausente → rechazo', async () => {
  const res = await request.post(ENDPOINT_MSG).send(basePayload({ clientEventId: uid() }));
  assert.notStrictEqual(res.status, 200);
  assert.strictEqual(res.body.ok, false);
});

// ── 2. Token vacío (Bearer vacío) ────────────────────────────────────────────
test('2. Token vacío → rechazo', async () => {
  const res = await request
    .post(ENDPOINT_MSG)
    .set('Authorization', 'Bearer ')
    .send(basePayload({ clientEventId: uid() }));
  assert.notStrictEqual(res.status, 200);
  assert.strictEqual(res.body.ok, false);
});

// ── 3. Token inválido ────────────────────────────────────────────────────────
test('3. Token inválido → rechazo', async () => {
  const res = await request
    .post(ENDPOINT_MSG)
    .set('Authorization', WRONG_AUTH)
    .send(basePayload({ clientEventId: uid() }));
  assert.notStrictEqual(res.status, 200);
  assert.strictEqual(res.body.ok, false);
});

// ── 4. Payload válido autenticado → { ok: true, duplicate: false } ───────────
test('4. Payload válido autenticado → ok=true duplicate=false', async () => {
  const res = await request
    .post(ENDPOINT_MSG)
    .set('Authorization', AUTH)
    .send(basePayload({ clientEventId: uid() }));
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.ok, true);
  assert.strictEqual(res.body.duplicate, false);
  assert.ok(typeof res.body.receiptId === 'string' && res.body.receiptId.length > 0);
});

// ── 5. Mismo clientEventId dos veces → segundo duplicate=true, sin 2.º registro
test('5. clientEventId duplicado → segundo ok=true duplicate=true', async () => {
  const id  = uid();
  const p   = basePayload({ clientEventId: id });

  const r1  = await request.post(ENDPOINT_MSG).set('Authorization', AUTH).send(p);
  assert.strictEqual(r1.body.ok, true);
  assert.strictEqual(r1.body.duplicate, false);
  const receiptId = r1.body.receiptId;

  const r2  = await request.post(ENDPOINT_MSG).set('Authorization', AUTH).send(p);
  assert.strictEqual(r2.body.ok, true);
  assert.strictEqual(r2.body.duplicate, true);
  // El receiptId devuelto debe ser el mismo del primer registro.
  assert.strictEqual(r2.body.receiptId, receiptId);
});

// ── 6. eventType inválido → rechazo ─────────────────────────────────────────
test('6. eventType inválido → rechazo', async () => {
  const res = await request
    .post(ENDPOINT_MSG)
    .set('Authorization', AUTH)
    .send(basePayload({ clientEventId: uid(), eventType: 'whatsapp.WRONG' }));
  assert.notStrictEqual(res.status, 200);
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_event_type');
});

// ── 7. clientEventId inválido → rechazo ─────────────────────────────────────
test('7a. clientEventId vacío → rechazo', async () => {
  const res = await request
    .post(ENDPOINT_MSG)
    .set('Authorization', AUTH)
    .send(basePayload({ clientEventId: '' }));
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_client_event_id');
});

test('7b. clientEventId array → rechazo', async () => {
  const res = await request
    .post(ENDPOINT_MSG)
    .set('Authorization', AUTH)
    .send(basePayload({ clientEventId: ['wa-p-1'] }));
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_client_event_id');
});

test('7c. clientEventId demasiado largo → rechazo', async () => {
  const res = await request
    .post(ENDPOINT_MSG)
    .set('Authorization', AUTH)
    .send(basePayload({ clientEventId: 'a'.repeat(129) }));
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_client_event_id');
});

test('7d. clientEventId con caracteres peligrosos → rechazo', async () => {
  const res = await request
    .post(ENDPOINT_MSG)
    .set('Authorization', AUTH)
    .send(basePayload({ clientEventId: 'wa-p-<script>' }));
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_client_event_id');
});

// ── 8. provisional: false → rechazo ─────────────────────────────────────────
test('8. provisional: false → rechazo', async () => {
  const res = await request
    .post(ENDPOINT_MSG)
    .set('Authorization', AUTH)
    .send(basePayload({ clientEventId: uid(), provisional: false }));
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_provisional');
});

// ── 9. chatRef distinto de null → rechazo ───────────────────────────────────
test('9. chatRef != null → rechazo', async () => {
  const payload = basePayload({ clientEventId: uid() });
  payload.identity.chatRef = '+5491100000000';
  const res = await request.post(ENDPOINT_MSG).set('Authorization', AUTH).send(payload);
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_identity_chat_ref');
});

// ── 10. verification inválida → rechazo ──────────────────────────────────────
test('10. verification inválida → rechazo', async () => {
  const payload = basePayload({ clientEventId: uid() });
  payload.identity.verification = 'verified';
  const res = await request.post(ENDPOINT_MSG).set('Authorization', AUTH).send(payload);
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_identity_verification');
});

// ── 11. automaticActionAllowed: true → rechazo ───────────────────────────────
test('11. automaticActionAllowed: true → rechazo', async () => {
  const payload = basePayload({ clientEventId: uid() });
  payload.identity.automaticActionAllowed = true;
  const res = await request.post(ENDPOINT_MSG).set('Authorization', AUTH).send(payload);
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_identity_automatic_action_allowed');
});

// ── 12. unreadCount = 0 → rechazo ────────────────────────────────────────────
test('12. unreadCount = 0 → rechazo', async () => {
  const payload = basePayload({ clientEventId: uid() });
  payload.observation.unreadCount = 0;
  const res = await request.post(ENDPOINT_MSG).set('Authorization', AUTH).send(payload);
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_observation_unread_count');
});

// ── 13. unreadCount negativo → rechazo ───────────────────────────────────────
test('13. unreadCount negativo → rechazo', async () => {
  const payload = basePayload({ clientEventId: uid() });
  payload.observation.unreadCount = -1;
  const res = await request.post(ENDPOINT_MSG).set('Authorization', AUTH).send(payload);
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_observation_unread_count');
});

// ── 14. unreadCount decimal → rechazo ────────────────────────────────────────
test('14. unreadCount decimal → rechazo', async () => {
  const payload = basePayload({ clientEventId: uid() });
  payload.observation.unreadCount = 1.5;
  const res = await request.post(ENDPOINT_MSG).set('Authorization', AUTH).send(payload);
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_observation_unread_count');
});

// ── 15. unreadCount string → rechazo ─────────────────────────────────────────
test('15. unreadCount string → rechazo', async () => {
  const payload = basePayload({ clientEventId: uid() });
  payload.observation.unreadCount = '3';
  const res = await request.post(ENDPOINT_MSG).set('Authorization', AUTH).send(payload);
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_observation_unread_count');
});

// ── 16. Preview sobredimensionado → rechazo ──────────────────────────────────
test('16. preview sobredimensionado → rechazo', async () => {
  const payload = basePayload({ clientEventId: uid() });
  payload.observation.preview = 'x'.repeat(2001);
  const res = await request.post(ENDPOINT_MSG).set('Authorization', AUTH).send(payload);
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_observation_preview_too_long');
});

// ── 17. Fallo de persistencia → no ACK positivo ──────────────────────────────
test('17. Fallo de persistencia → no ACK positivo', async () => {
  const mockFn = mock.method(whatsappStore, 'saveObservation', () => {
    throw new Error('DB simulado fuera de servicio');
  });

  try {
    const res = await request
      .post(ENDPOINT_MSG)
      .set('Authorization', AUTH)
      .send(basePayload({ clientEventId: uid() }));
    // No debe responder ok: true ante una falla real de persistencia.
    assert.notStrictEqual(res.body.ok, true);
  } finally {
    mockFn.mock.restore();
  }
});

// ── 18. Endpoint poller-error válido → { ok: true } ──────────────────────────
test('18. poller-error válido → ok=true', async () => {
  const res = await request
    .post(ENDPOINT_ERR)
    .set('Authorization', AUTH)
    .send({ consecutiveErrors: 5, error: 'timeout al conectar', timestamp: 0 });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.ok, true);
});

// ── 19. Payload inválido de poller-error → rechazo ───────────────────────────
test('19a. poller-error consecutiveErrors=0 → rechazo', async () => {
  const res = await request
    .post(ENDPOINT_ERR)
    .set('Authorization', AUTH)
    .send({ consecutiveErrors: 0, error: 'err', timestamp: 0 });
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_consecutive_errors');
});

test('19b. poller-error error ausente → rechazo', async () => {
  const res = await request
    .post(ENDPOINT_ERR)
    .set('Authorization', AUTH)
    .send({ consecutiveErrors: 1, error: '', timestamp: 0 });
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_error_message');
});

test('19c. poller-error timestamp no-número → rechazo', async () => {
  const res = await request
    .post(ENDPOINT_ERR)
    .set('Authorization', AUTH)
    .send({ consecutiveErrors: 1, error: 'timeout', timestamp: 'ahora' });
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_timestamp');
});

// ── 19d-f. Validación extendida de timestamp ─────────────────────────────────
test('19d. poller-error timestamp=-1 → rechazo con invalid_timestamp', async () => {
  const res = await request
    .post(ENDPOINT_ERR)
    .set('Authorization', AUTH)
    .send({ consecutiveErrors: 1, error: 'timeout', timestamp: -1 });
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_timestamp');
});

test('19e. poller-error timestamp=1.5 (decimal) → rechazo con invalid_timestamp', async () => {
  const res = await request
    .post(ENDPOINT_ERR)
    .set('Authorization', AUTH)
    .send({ consecutiveErrors: 1, error: 'timeout', timestamp: 1.5 });
  assert.strictEqual(res.body.ok, false);
  assert.strictEqual(res.body.error, 'invalid_timestamp');
});

test('19f. poller-error timestamp=0 (válido) → ok=true', async () => {
  const res = await request
    .post(ENDPOINT_ERR)
    .set('Authorization', AUTH)
    .send({ consecutiveErrors: 1, error: 'timeout', timestamp: 0 });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.ok, true);
});

// ── 20. Logs no contienen preview ni displayName completos ───────────────────
test('20. Log no incluye preview ni displayName completos', async () => {
  const capturedLines = [];
  const originalLog = console.log;
  console.log = (...args) => capturedLines.push(args.join(' '));

  const testPreview     = 'PREVIEW_SECRETO_XYZ_987';
  const testDisplayName = 'NOMBRE_SECRETO_ABC_456';

  try {
    await request
      .post(ENDPOINT_MSG)
      .set('Authorization', AUTH)
      .send(basePayload({
        clientEventId: uid(),
        identity: {
          displayName:           testDisplayName,
          chatRef:               null,
          verification:          'display_only',
          automaticActionAllowed: false,
        },
        observation: {
          unreadCount:       2,
          preview:           testPreview,
          sourceReliability: 'ui_unread_indicator',
        },
      }));
  } finally {
    console.log = originalLog;
  }

  const allLogs = capturedLines.join('\n');
  assert.ok(
    !allLogs.includes(testPreview),
    `Log no debe contener el preview completo. Encontrado en: ${allLogs}`
  );
  assert.ok(
    !allLogs.includes(testDisplayName),
    `Log no debe contener el displayName completo. Encontrado en: ${allLogs}`
  );
});

// ── 21. Rutas nuevas no llaman a LLM, WhatsApp, Playwright ni sender ─────────
test('21. Rutas nuevas no importan LLM, WhatsApp, Playwright ni senders', () => {
  const routeSource = fs.readFileSync(
    path.join(__dirname, '..', 'routes', 'whatsapp.js'),
    'utf8'
  );
  const storeSource = fs.readFileSync(
    path.join(__dirname, '..', 'services', 'whatsappStore.js'),
    'utf8'
  );
  const combined = routeSource + storeSource;

  // Verificar que no haya imports funcionales ni llamadas a servicios prohibidos.
  // Se buscan patrones de require() y llamadas concretas, no palabras en comentarios.
  const forbiddenPatterns = [
    // Imports de LLMs
    /@anthropic-ai\/sdk/,
    /require\(['"]openai['"]\)/,
    /new\s+Anthropic\s*\(/,
    // Puppeteer / Playwright
    /require\(['"]playwright['"]\)/,
    /require\(['"]puppeteer['"]\)/,
    /chromium\.launch/,
    // WhatsApp / senders automáticos
    /require\(['"]whatsapp/i,
    /\.sendMessage\s*\(/,
    /\.sendMsg\s*\(/,
    /\.reply\s*\(/,
    // Voz / ElevenLabs
    /require\(['"].*elevenLabs/i,
    /synthesize\s*\(/,
  ];

  for (const pattern of forbiddenPatterns) {
    assert.ok(
      !pattern.test(combined),
      `Patrón prohibido encontrado en rutas nuevas: ${pattern}`
    );
  }
});

// ── Limpieza ─────────────────────────────────────────────────────────────────
after(async () => {
  await new Promise((resolve) => server.close(resolve));
  try {
    fs.rmSync(TEST_DATA_DIR, { recursive: true, force: true });
  } catch (_) { /* ignorar errores de limpieza */ }
});
