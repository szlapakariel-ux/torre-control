// Motor de priorización PLIC (Power-Law-based Inference and Coordination).
//
// Este módulo es la implementación de la fórmula definida en
// `.torre/plic/02_protocolo_torre_universal_v0_2.md`. La doc es la fuente
// normativa; este código la espeja. Si cambia la fórmula, se cambia primero
// en la doc y después acá.
//
// Es puro (sin dependencias, sin estado): recibe números, devuelve números.

// Los 12 tipos de evento PLIC.
const EVENT_TYPES = [
  'idea', 'pedido', 'orden', 'bloqueo', 'error', 'retrabajo',
  'decisión', 'handoff', 'verificación', 'cierre', 'reapertura', 'estado',
];

// Estados válidos de un evento.
const EVENT_STATUSES = ['abierto', 'en_curso', 'cerrado'];

function clamp(n, min, max, fallback) {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, Math.round(v)));
}

// Las dimensiones 1-5 se fuerzan acá: los structured outputs del modelo no
// pueden garantizar rangos numéricos en el schema, así que la validación de
// rango vive en este punto (y no en el JSON schema).
function clampPlic(plic = {}) {
  return {
    impact:        clamp(plic.impact, 1, 5, 1),
    urgency:       clamp(plic.urgency, 1, 5, 1),
    blocked_items: clamp(plic.blocked_items, 0, 99, 0),
    repetition:    clamp(plic.repetition, 1, 5, 1),
    risk:          clamp(plic.risk, 1, 5, 1),
  };
}

// blocked_items (un conteo) se mapea a la escala 1-5 de "Bloqueo":
// 0 items → 1 (no bloquea), 5+ items → 5 (bloquea el proyecto).
function bloqueoScale(blockedItems) {
  const b = clamp(blockedItems, 0, 99, 0);
  return Math.min(5, b + 1 > 5 ? 5 : (b === 0 ? 1 : Math.min(5, b)));
}

// Fórmula de score (máx 50). El desbloqueo pesa más porque la regla PLIC es
// "no se ataca lo más ruidoso, se ataca lo que más desbloquea".
//   score = 3*bloqueo + 2.5*impact + 2*urgency + 1.5*risk + 1*repetition
function computeScore(plic) {
  const p = clampPlic(plic);
  const bloqueo = bloqueoScale(p.blocked_items);
  return (
    3 * bloqueo +
    2.5 * p.impact +
    2 * p.urgency +
    1.5 * p.risk +
    1 * p.repetition
  );
}

// Mapea el score a un bucket de prioridad, con pisos por urgencia estructural.
function toPriority(plic) {
  const p = clampPlic(plic);
  const score = computeScore(p);

  // Pisos: algo que bloquea mucho, o un error/bloqueo de alto impacto,
  // entra al menos como P1 aunque el score quede por debajo.
  const isHardBlocker =
    p.blocked_items >= 5 ||
    ((plic.event_type === 'bloqueo' || plic.event_type === 'error') && p.impact >= 4);

  if (score >= 40) return 'P0';
  if (score >= 30) return 'P1';
  if (isHardBlocker) return 'P1';
  if (score >= 18) return 'P2';
  return 'P3';
}

module.exports = {
  EVENT_TYPES,
  EVENT_STATUSES,
  clampPlic,
  computeScore,
  toPriority,
};
