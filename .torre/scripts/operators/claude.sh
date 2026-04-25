#!/usr/bin/env bash
# operators/claude.sh — adaptador Claude para el Invoker IA V1.
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

## [INVOCACIÓN — adaptador claude.sh — STUB]

El operador automático **Claude no está disponible** en este entorno todavía. La orden quedó detectada y validada por el Invoker, pero **ningún cambio se aplicó al repo**.

### Lo que falta para invocación real de Claude:

1. **CLI Claude Code instalado en el runner** — `npm install -g @anthropic-ai/claude-code` (o el método que la versión vigente use). Documentar en el workflow YAML el step de instalación.
2. **Credenciales** — `ANTHROPIC_API_KEY` configurado como repository secret y expuesto al workflow con scope mínimo. Hoy esta orden prohíbe usar secretos, así que el secret no existe aún.
3. **Política de sandbox** — definir explícitamente qué archivos puede modificar el operador automático. Sugerencia: solo permitir cambios bajo `.torre/`, prohibir todo lo demás vía permisos del checkout o pre-commit hook.
4. **Modo no interactivo** — invocar Claude Code en modo "headless" pasándole el contenido de la orden como prompt. Hay flags como `--print` o equivalente; verificar la versión actual.
5. **Aprobación humana antes de mergear** — el operador automático abre PR; un humano (Torre o Ariel) revisa y mergea. **Nunca auto-merge.**
6. **Manejo de costos** — límite duro de tokens/llamadas por orden y/o por día. Sin esto, una orden mal formada puede generar gasto descontrolado.
7. **Trazabilidad** — el adaptador real debe loguear qué prompt envió y qué recibió, además del reporte que escribe el operador. Audit trail completo.

### Estado de esta invocación

- Orden detectada con `EJECUTOR=claude` y `REQUIERE_IA=si`.
- Validación de identidad de proyecto: pasó.
- Adaptador stub respondió: **sin acción sobre el código**.
- Ciclo queda en `EN_PROCESO_POR=ninguno`. Torre/Ariel debe ejecutar manualmente o configurar la invocación real.
EOF

exit 99
