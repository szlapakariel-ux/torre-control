#!/usr/bin/env bash
# check_cycle_closed.sh — detecta si el sistema .torre tiene un ciclo cerrado.
#
# Imprime estado humano-legible y devuelve:
#   0  ciclo cerrado (sistema en reposo)
#   1  ciclo abierto (hay trabajo en curso o algo no calza)
#   2  error de uso / archivos faltantes
#
# Sin dependencias externas: solo bash + grep + find + sed.

set -euo pipefail

repo_root=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$repo_root"

INBOX=".torre/inbox/orden_actual.md"
OUTBOX=".torre/outbox/reporte_actual.md"
ESTADO=".torre/estado.md"
HISTORIAL=".torre/historial"

for f in "$INBOX" "$OUTBOX" "$ESTADO"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: falta $f"
    exit 2
  fi
done
if [[ ! -d "$HISTORIAL" ]]; then
  echo "ERROR: falta directorio $HISTORIAL"
  exit 2
fi

# 1. EN_PROCESO_POR debe ser "ninguno"
en_proceso=$(grep -E '^\s*-?\s*\*?\*?EN_PROCESO_POR\*?\*?\s*:\s*' "$ESTADO" \
              | head -1 \
              | sed -E 's/.*:[[:space:]]*//' \
              | tr -d '[:space:]')

if [[ -z "$en_proceso" ]]; then
  echo "CICLO ABIERTO: campo EN_PROCESO_POR no encontrado en $ESTADO"
  exit 1
fi

if [[ "$en_proceso" != "ninguno" ]]; then
  echo "CICLO ABIERTO: EN_PROCESO_POR=$en_proceso"
  exit 1
fi

# 2. inbox debe estar en placeholder (contiene la frase canónica)
if ! grep -q "sin orden activa" "$INBOX"; then
  echo "CICLO ABIERTO: $INBOX tiene una orden activa"
  exit 1
fi

# 3. tiene que haber al menos un reporte archivado en historial/
archived_count=$(find "$HISTORIAL" -mindepth 2 -maxdepth 2 -name 'reporte_actual.md' -type f | wc -l)
if [[ "$archived_count" -eq 0 ]]; then
  echo "CICLO ABIERTO: no hay ningún reporte archivado en $HISTORIAL"
  exit 1
fi

# Reportar último ciclo archivado.
# Orden por timestamp del commit más reciente que tocó cada dir (git log %ct).
# No usamos sort alfabético (ambiguo cuando varios slugs comparten fecha) ni
# filesystem mtime (un clone fresco lo resetea). Si git log no devuelve nada
# para algún dir (no commiteado todavía), usamos 0 como timestamp.
last_dir=$(
  find "$HISTORIAL" -mindepth 1 -maxdepth 1 -type d \
    | while read -r dir; do
        ts=$(git log -1 --format=%ct -- "$dir" 2>/dev/null || true)
        printf '%s\t%s\n' "${ts:-0}" "$dir"
      done \
    | sort -nr -k1,1 \
    | head -1 \
    | cut -f2-
)
last_slug="${last_dir#$HISTORIAL/}"

# Intentar extraer ID de orden del último reporte archivado
last_order_id=$(grep -E '^\s*-?\s*\*?\*?Orden ejecutada\*?\*?\s*:\s*' \
                 "$last_dir/reporte_actual.md" 2>/dev/null \
                 | head -1 \
                 | sed -E 's/.*:[[:space:]]*//' \
                 | tr -d '[:space:]' || true)

echo "CICLO CERRADO"
echo "  EN_PROCESO_POR=ninguno"
echo "  inbox en placeholder"
echo "  ciclos archivados: $archived_count"
echo "  último ciclo: $last_slug"
[[ -n "${last_order_id:-}" ]] && echo "  última orden: $last_order_id"
exit 0
