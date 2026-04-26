#!/usr/bin/env bash
# check_mesa_compartida.sh — informa cambios en .torre/mesa-compartida/.
#
# Mira el último commit (HEAD~1..HEAD). Si no hay HEAD~1, considera lo que esté
# trackeado bajo el path como referencia (modo conservador para shallow clones
# o el primer commit del repo).
#
# Imprime un resumen humano-legible:
#   - lista de archivos modificados,
#   - señales detectadas (FIN_AGENTE, BLOQUEO/BLOQUEADA, ESTADO:,
#     RESPONSABLE_ACTUAL:, PROXIMO_RESPONSABLE:, ESTADO_FINAL:),
#   - acción sugerida para Torre.
#
# El script NO modifica archivos, NO invoca agentes, NO toca producción.
# Códigos de salida:
#   0  ejecución correcta (haya o no haya cambios)
#   2  error real del script

set -euo pipefail

repo_root=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$repo_root"

MESA_DIR=".torre/mesa-compartida"

if git rev-parse --verify HEAD~1 >/dev/null 2>&1; then
  changed=$(git diff --name-only HEAD~1 HEAD -- "$MESA_DIR" || true)
else
  changed=$(git ls-files -- "$MESA_DIR" || true)
fi

if [[ -z "$changed" ]]; then
  echo "MESA_COMPARTIDA: sin cambios."
  exit 0
fi

echo "MESA_COMPARTIDA: cambios detectados."
echo ""
echo "Archivos:"
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  echo "- $f"
done <<< "$changed"

fin_agente="no"
bloqueo="no"
estados=()
responsables=()
proximos=()
estados_final=()

while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  # Archivo borrado en este commit: no se puede grepear contenido actual.
  [[ ! -f "$f" ]] && continue

  if grep -q '\[FIN_AGENTE\]' "$f" 2>/dev/null; then
    fin_agente="sí"
  fi
  if grep -qE '(BLOQUEO|BLOQUEADA)' "$f" 2>/dev/null; then
    bloqueo="sí"
  fi

  while IFS= read -r line; do
    estados+=("$line")
  done < <(grep -E '^[[:space:]]*ESTADO[[:space:]]*:' "$f" 2>/dev/null || true)

  while IFS= read -r line; do
    responsables+=("$line")
  done < <(grep -E '^[[:space:]]*RESPONSABLE_ACTUAL[[:space:]]*:' "$f" 2>/dev/null || true)

  if grep -qE '^[[:space:]]*PROXIMO_RESPONSABLE[[:space:]]*:' "$f" 2>/dev/null; then
    nxt=$(grep -A1 -E '^[[:space:]]*PROXIMO_RESPONSABLE[[:space:]]*:' "$f" 2>/dev/null \
            | tail -n1 \
            | sed -E 's/^[[:space:]]+//;s/[[:space:]]+$//')
    [[ -n "$nxt" ]] && proximos+=("$nxt")
  fi

  while IFS= read -r line; do
    estados_final+=("$line")
  done < <(grep -E '^[[:space:]]*ESTADO_FINAL[[:space:]]*:' "$f" 2>/dev/null || true)

done <<< "$changed"

echo ""
echo "Señales:"
echo "- FIN_AGENTE: $fin_agente"
echo "- BLOQUEO/BLOQUEADA: $bloqueo"

if [[ "${#estados[@]}" -gt 0 ]]; then
  echo "- ESTADOS detectados:"
  for s in "${estados[@]}"; do
    echo "  - $s"
  done
else
  echo "- ESTADOS detectados: ninguno"
fi

if [[ "${#responsables[@]}" -gt 0 ]]; then
  echo "- RESPONSABLES detectados:"
  for r in "${responsables[@]}"; do
    echo "  - $r"
  done
else
  echo "- RESPONSABLES detectados: ninguno"
fi

if [[ "${#proximos[@]}" -gt 0 ]]; then
  echo "- PRÓXIMO RESPONSABLE:"
  for p in "${proximos[@]}"; do
    echo "  - $p"
  done
else
  echo "- PRÓXIMO RESPONSABLE: no declarado"
fi

if [[ "${#estados_final[@]}" -gt 0 ]]; then
  echo "- ESTADO_FINAL:"
  for ef in "${estados_final[@]}"; do
    echo "  - $ef"
  done
fi

echo ""
echo "Acción sugerida:"
echo "Torre debe revisar la mesa compartida."

exit 0
