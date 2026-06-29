/**
 * orchestrator.js
 * Coordinador de ciclos en Torre-Control.
 *
 * Torre no ejecuta en la pantalla de Ariel directamente —
 * delega al agente local via WebSocket.
 * Este módulo gestiona la comunicación con el agente y el historial de ciclos.
 */

const { WebSocket } = require('ws');
const { createCycle, startCycle, completeCycle, failCycle, getRecentCycles } = require('./cycleStore');

// Referencia al WebSocket del agente local (se setea cuando el agente se conecta)
let agentSocket = null;
let agentInfo = null;
let pendingCommands = new Map(); // commandId → { resolve, reject }

let commandCounter = 0;
function nextCommandId() { return `cmd_${++commandCounter}_${Date.now()}`; }

// ── Registro del agente local ────────────────────────────────────────────────

/**
 * Registra la info del agente local. Llamado desde server.js en POST /api/agent/register.
 * Torre NO se conecta al agente — el agente se conecta a Torre.
 * Aquí guardamos la URL WS del agente para cuando Torre necesite iniciar comunicación.
 */
function registerAgent(info) {
  agentInfo = { ...info, registeredAt: Date.now() };
  console.log('[Orchestrator] Agente local registrado:', agentInfo);
  return agentInfo;
}

function updateHeartbeat(data) {
  if (agentInfo) {
    agentInfo.lastHeartbeat = Date.now();
    agentInfo.windows = data.windows;
  }
}

function getAgentStatus() {
  if (!agentInfo) return { connected: false };
  const secondsAgo = agentInfo.lastHeartbeat
    ? Math.round((Date.now() - agentInfo.lastHeartbeat) / 1000)
    : null;
  return {
    connected: secondsAgo !== null && secondsAgo < 60,
    secondsAgo,
    windows: agentInfo.windows || [],
    wsUrl: agentInfo.wsUrl,
  };
}

// ── Comunicación con el agente ────────────────────────────────────────────────

/**
 * Abre o reutiliza la conexión WS con el agente local.
 */
async function getAgentConnection() {
  if (agentSocket && agentSocket.readyState === WebSocket.OPEN) {
    return agentSocket;
  }

  if (!agentInfo?.wsUrl) {
    throw new Error('Agente local no registrado. ¿Está corriendo jarvis-local-agent?');
  }

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(agentInfo.wsUrl);

    ws.on('open', () => {
      agentSocket = ws;
      console.log('[Orchestrator] Conectado al agente local');
      resolve(ws);
    });

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.commandId && pendingCommands.has(msg.commandId)) {
          const { resolve: res, reject: rej } = pendingCommands.get(msg.commandId);
          pendingCommands.delete(msg.commandId);
          if (msg.ok) res(msg.result);
          else rej(new Error(msg.error || 'Error en agente'));
        }
      } catch { /* ignorar */ }
    });

    ws.on('error', (err) => {
      agentSocket = null;
      reject(err);
    });

    ws.on('close', () => {
      agentSocket = null;
      // Rechazar todos los comandos pendientes
      for (const [, { reject: rej }] of pendingCommands) {
        rej(new Error('Agente desconectado'));
      }
      pendingCommands.clear();
    });
  });
}

/**
 * Envía un comando al agente y espera la respuesta.
 */
async function sendCommand(action, params = {}) {
  const ws = await getAgentConnection();
  const id = nextCommandId();

  return new Promise((resolve, reject) => {
    pendingCommands.set(id, { resolve, reject });

    const timeout = setTimeout(() => {
      pendingCommands.delete(id);
      reject(new Error(`Timeout esperando respuesta del agente para: ${action}`));
    }, params.timeoutMs || 30000);

    const originalResolve = resolve;
    pendingCommands.set(id, {
      resolve: (v) => { clearTimeout(timeout); originalResolve(v); },
      reject:  (e) => { clearTimeout(timeout); reject(e); },
    });

    ws.send(JSON.stringify({ id, action, params }));
  });
}

// ── API pública para ciclos ───────────────────────────────────────────────────

/**
 * Inicia un ciclo nuevo.
 * source: nombre de ventana de donde leer (ej: 'gpt')
 * target: nombre de ventana donde escribir (ej: 'claude')
 * notify: nombre de ventana para notificar al terminar (ej: 'whatsapp')
 * prompt: texto opcional a enviar (si no, lee de source)
 */
async function startNewCycle({ source, target, notify, prompt }) {
  const id = `cycle_${Date.now()}`;

  // Registrar en BD
  const cycle = createCycle({ id, source, target, notify, prompt });
  startCycle(id);

  // Enviar al agente local (no espera — el resultado llega via /api/cycles/result)
  sendCommand('run-cycle', { cycleId: id, source, target, notify, customPrompt: prompt })
    .then(() => console.log(`[Orchestrator] Ciclo ${id} delegado al agente`))
    .catch(err => {
      console.error(`[Orchestrator] Ciclo ${id} falló:`, err.message);
      failCycle(id, err.message);
    });

  return cycle;
}

/**
 * Acción simple en el agente: leer, escribir, screenshot.
 */
async function readAgentWindow(windowName) {
  return sendCommand('read', { window: windowName });
}

async function writeAgentWindow(windowName, text, submit = false) {
  return sendCommand('write', { window: windowName, text, submit });
}

async function screenshotAgentWindow(windowName) {
  return sendCommand('screenshot', { window: windowName });
}

async function registerWindowOnAgent(name, type, urlPattern) {
  return sendCommand('register-window', { name, type, urlPattern });
}

/**
 * Retorna el historial de ciclos para el panel de Torre UI.
 */
function getCycleHistory(limit = 20) {
  return getRecentCycles(limit);
}

/**
 * Recibe el resultado de un ciclo completado (llamado desde POST /api/cycles/result).
 */
function receiveCycleResult({ cycleId, result, error }) {
  if (error) {
    failCycle(cycleId, error);
    console.log(`[Orchestrator] Ciclo ${cycleId} falló: ${error}`);
  } else {
    completeCycle(cycleId, result);
    console.log(`[Orchestrator] Ciclo ${cycleId} completado`);
  }
}

module.exports = {
  registerAgent,
  updateHeartbeat,
  getAgentStatus,
  startNewCycle,
  readAgentWindow,
  writeAgentWindow,
  screenshotAgentWindow,
  registerWindowOnAgent,
  getCycleHistory,
  receiveCycleResult,
};
