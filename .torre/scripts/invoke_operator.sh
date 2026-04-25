#!/usr/bin/env bash
# invoke_operator.sh — Invoker IA V1 (con stubs honestos)
#
# Lee .torre/inbox/orden_actual.md, valida los 7 campos obligatorios,
# decide si invocar y a qué adaptador. NO toma el lock, NO archiva,
# NO cierra el ciclo. Solo deja constancia de la invocación en
# .torre/outbox/reporte_actual.md cuando ese archivo está en placeholder.
#
# Exit codes:
#   0   invocación exitosa real
#  10   no aplica (placeholder, REQUIERE_IA != si, EJECUTOR=humano)
#  20   orden inválida (campos faltantes o incoherentes)
#  30   guardrail (repo actual no coincide con REPO_TECNICO)
#  40   operador desconocido o adaptador no disponible
#  99   adaptador respondió como STUB (operador real no configurado)
#
# Uso: .torre/scripts/invoke_operator.sh

set -euo pipefail

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT"

INBOX=".torre/inbox/orden_actual.md"
OUTBOX=".torre/outbox/reporte_actual.md"
ESTADO=".torre/estado.md"
OPERATORS_DIR=".torre/scripts/operators"

EXIT_OK=0
EXIT_NO_APPLIES=10
EXIT_INVALID_ORDER=20
EXIT_GUARDRAIL=30
EXIT_NO_OPERATOR=40
EXIT_STUB=99

log() { echo "[invoker] $*" >&2; }

for f in "$INBOX" "$OUTBOX" "$ESTADO"; do
  [[ -f "$f" ]] || { log "ERROR: falta $f"; exit $EXIT_INVALID_ORDER; }
done

# 1. ¿Hay orden activa?
if grep -q "sin orden activa" "$INBOX"; then
  log "Inbox en placeholder. No hay orden activa."
  exit $EXIT_NO_APPLIES
fi

# 2. Extraer campos. Tolera formato Markdown con bullet/bold.
extract() {
  local key="$1"
  # `|| true` evita que set -e + pipefail aborte cuando grep no encuentra nada.
  { grep -E "^[[:space:]]*-?[[:space:]]*\*?\*?${key}\*?\*?[[:space:]]*:" "$INBOX" || true; } \
    | head -1 \
    | sed -E "s/.*${key}[*]*[[:space:]]*:[[:space:]]*//" \
    | tr -d '`' \
    | sed -E 's/[[:space:]]+$//' \
    | sed -E 's/[[:space:]]*<!--.*-->[[:space:]]*$//'
}

PROYECTO=$(extract "PROYECTO_FUNCIONAL")
REPO_TEC=$(extract "REPO_TECNICO")
RAMA_TRA=$(extract "RAMA_TRABAJO")
RAMA_DES=$(extract "RAMA_DESTINO")
EJECUTOR=$(extract "EJECUTOR")
REQUIERE_IA=$(extract "REQUIERE_IA")
TIPO_ORDEN=$(extract "TIPO_ORDEN")
REPO_ORI=$(extract "REPO_ORIGEN")

# 3. ¿REQUIERE_IA?
if [[ "$REQUIERE_IA" != "si" ]] && [[ "$REQUIERE_IA" != "sí" ]]; then
  log "REQUIERE_IA != 'si' (valor: '${REQUIERE_IA}'). Orden manual o sin marca explícita."
  exit $EXIT_NO_APPLIES
fi

# 4. Validar campos obligatorios
for var in PROYECTO REPO_TEC RAMA_TRA RAMA_DES EJECUTOR; do
  val="${!var}"
  if [[ -z "$val" ]]; then
    log "ERROR: campo obligatorio faltante o vacío: $var"
    exit $EXIT_INVALID_ORDER
  fi
done

# 5. Guardrail: repo actual debe coincidir con REPO_TECNICO (comparación exacta).
#
# normalize_repo() acepta cualquiera de estas formas y devuelve "owner/repo":
#   https://github.com/owner/repo.git
#   https://github.com/owner/repo
#   git@github.com:owner/repo.git
#   git@github.com:owner/repo
#   owner/repo
#   http://user@host:port/git/owner/repo            (proxy local de testing)
#
# Cualquier otra forma cae a un fallback que devuelve los últimos dos segmentos
# del path. Si no se puede normalizar, devuelve el string crudo (la comparación
# fallará y el guardrail dispara, que es el comportamiento conservador).
normalize_repo() {
  local raw="$1"
  # Quitar `.git` final
  raw="${raw%.git}"
  # Forma SSH: usuario@host:owner/repo
  if [[ "$raw" =~ ^[^/@]+@[^:/]+:(.+)$ ]]; then
    raw="${BASH_REMATCH[1]}"
  fi
  # Forma HTTP/HTTPS: quitar esquema y host (con auth y puerto opcionales)
  if [[ "$raw" =~ ^https?://[^/]+/(.*)$ ]]; then
    raw="${BASH_REMATCH[1]}"
  fi
  # Si quedaron más de 1 slash, tomar los últimos 2 segmentos
  local slash_count
  slash_count=$(echo -n "$raw" | tr -cd '/' | wc -c)
  if [[ "$slash_count" -gt 1 ]]; then
    raw=$(echo "$raw" | awk -F/ '{print $(NF-1) "/" $NF}')
  fi
  echo "$raw"
}

ORIGIN_URL=$(git remote get-url origin 2>/dev/null || true)
if [[ -z "$ORIGIN_URL" ]]; then
  log "GUARDRAIL: no hay 'origin' configurado en este repo. Abortando."
  exit $EXIT_GUARDRAIL
fi

ORIGIN_NORMALIZED=$(normalize_repo "$ORIGIN_URL")
REPO_TEC_NORMALIZED=$(normalize_repo "$REPO_TEC")

if [[ "$ORIGIN_NORMALIZED" != "$REPO_TEC_NORMALIZED" ]]; then
  log "GUARDRAIL: origin normalizado ('$ORIGIN_NORMALIZED') != REPO_TECNICO normalizado ('$REPO_TEC_NORMALIZED'). Abortando."
  log "  origin crudo: '$ORIGIN_URL'"
  log "  REPO_TECNICO crudo: '$REPO_TEC'"
  exit $EXIT_GUARDRAIL
fi

# 6. Si EJECUTOR=humano, invoker no actúa
case "$EJECUTOR" in
  humano|human)
    log "EJECUTOR=humano. Invoker no actúa; espera intervención manual."
    exit $EXIT_NO_APPLIES
    ;;
  claude)
    OPERATOR_SCRIPT="$OPERATORS_DIR/claude.sh"
    ;;
  codex)
    OPERATOR_SCRIPT="$OPERATORS_DIR/codex.sh"
    ;;
  *)
    log "EJECUTOR desconocido: '$EJECUTOR'. No hay adaptador."
    exit $EXIT_NO_OPERATOR
    ;;
esac

if [[ ! -f "$OPERATOR_SCRIPT" ]]; then
  log "Adaptador no encontrado: $OPERATOR_SCRIPT"
  exit $EXIT_NO_OPERATOR
fi
if [[ ! -x "$OPERATOR_SCRIPT" ]]; then
  log "Adaptador no ejecutable: $OPERATOR_SCRIPT"
  exit $EXIT_NO_OPERATOR
fi

# 7. Pre-reporte: solo si outbox está en placeholder, dejar nota inicial.
#    Esto evita pisar reportes reales de un operador humano u otro proceso.
if grep -q "sin reporte activo" "$OUTBOX"; then
  cat > "$OUTBOX" <<EOF
# Reporte parcial — invocación automática del Invoker IA V1

> Reporte preliminar generado por \`.torre/scripts/invoke_operator.sh\`. **No cierra el ciclo.** El operador real, cuando ejecute, debe sobreescribir este archivo con el reporte definitivo.

- **Orden detectada**: ${PROYECTO} (${REPO_TEC})
- **EJECUTOR**: ${EJECUTOR}
- **TIPO_ORDEN**: ${TIPO_ORDEN:-local}
- **REQUIERE_IA**: ${REQUIERE_IA}
- **Adaptador invocado**: ${OPERATOR_SCRIPT}

EOF
fi

# 8. Llamar adaptador. Pasa paths de orden y reporte por argumento.
log "Invocando $OPERATOR_SCRIPT (proyecto='$PROYECTO', ejecutor=$EJECUTOR)"

set +e
"$OPERATOR_SCRIPT" "$INBOX" "$OUTBOX"
op_exit=$?
set -e

log "Adaptador devolvió exit=$op_exit"

case "$op_exit" in
  0)  exit $EXIT_OK ;;
  99) exit $EXIT_STUB ;;
  *)  exit "$op_exit" ;;
esac
