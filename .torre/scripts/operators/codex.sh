#!/usr/bin/env bash
# operators/codex.sh — adaptador Codex para el Invoker IA V1.
#
# ESTADO ACTUAL: STUB. No invoca al modelo real. Documenta qué falta para
# hacerlo y deja constancia clara en el reporte parcial.
#
# El Invoker llama a este script con:
#   $1 = path al archivo de orden (default: .torre/inbox/orden_actual.md)
#   $2 = path al archivo de reporte (default: .torre/outbox/reporte_actual.md)
#
# Exit code 99 indica explícitamente "stub, operador real no disponible".

set -euo pipefail

ORDER_FILE="${1:-.torre/inbox/orden_actual.md}"
REPORT_FILE="${2:-.torre/outbox/reporte_actual.md}"

cat >> "$REPORT_FILE" <<'EOF'

## [INVOCACIÓN — adaptador codex.sh — STUB]

El operador automático **Codex no está disponible** en este entorno todavía. La orden quedó detectada y validada por el Invoker, pero **ningún cambio se aplicó al repo**.

### Lo que falta para invocación real de Codex:

1. **Decidir qué se entiende por "Codex" hoy** — el modelo Codex original (code-davinci) está retirado por OpenAI. Las alternativas son:
   - OpenAI Codex CLI (preview, en evolución): instalar como herramienta CLI propia.
   - GPT-4o / GPT-4.1 vía API con prompt orientado a código: requiere `openai` CLI o llamar la API directamente con `curl`.
   - GitHub Copilot CLI: distinto producto, distinto auth model.
2. **Credenciales** — `OPENAI_API_KEY` (o el equivalente que use el CLI elegido) como repository secret. Hoy prohibido por la orden actual.
3. **Política de sandbox** — igual que Claude: limitar qué archivos puede tocar el operador automático.
4. **Modo no interactivo** — el CLI debe poder consumir un prompt desde stdin/file y producir output sin interacción.
5. **Aprobación humana antes de mergear** — operador abre PR; humano revisa y mergea. Nunca auto-merge.
6. **Manejo de costos** — límite duro de tokens/llamadas.
7. **Trazabilidad** — log del prompt enviado y de la respuesta cruda recibida, además del reporte que el operador deja en outbox.

### Estado de esta invocación

- Orden detectada con `EJECUTOR=codex` y `REQUIERE_IA=si`.
- Validación de identidad de proyecto: pasó.
- Adaptador stub respondió: **sin acción sobre el código**.
- Ciclo queda en `EN_PROCESO_POR=ninguno`. Torre/Ariel debe ejecutar manualmente o configurar la invocación real.
EOF

exit 99
