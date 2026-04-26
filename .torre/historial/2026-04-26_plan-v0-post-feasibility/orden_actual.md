# Orden Torre — ORD-2026-04-26-20

- **ID**: ORD-2026-04-26-20
- **Fecha**: 2026-04-26
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: torre/claude-real-v0-plan
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude
- **TIPO_ORDEN**: local
- **REPO_ORIGEN**: szlapakariel-ux/torre-control
- **REQUIERE_IA**: no

## Objetivo

Actualizar el plan V0 (`.torre/claude_real_v0_plan.md`) para reflejar que el feasibility test del Claude Code CLI fue **APROBADO** por Torre, y reorganizar la sección 14 separando bloqueantes resueltos, pendientes diferibles y pendientes a probar dentro del adaptador real.

## Tareas concretas

1. Editar la sección 3 del plan ("Cómo se invocaría Claude") para sacar el "pseudocomando" tentativo y poner el comando confirmado por el feasibility (`--print --bare --no-session-persistence --output-format json --max-budget-usd 0.10 --model sonnet`).
2. Reorganizar la sección 14 ("Datos pendientes") en tres sub-secciones:
   - **14.1 — Bloqueantes resueltos** por el feasibility test (los 4 originales).
   - **14.2 — Pendientes diferibles** (los 6 originales que ya estaban marcados así).
   - **14.3 — Pendiente a probar dentro del adaptador real** (`gh pr create` end-to-end).
3. Actualizar el header del documento para reflejar que pasó del estado "PROPUESTA" a "PLAN VIABLE — feasibility validado".
4. Actualizar el body del PR #13 para que ya no diga "No mergear sin confirmar los 10 ítems" y refleje el nuevo estado.

## Restricciones

- No tocar `claude.sh`, `codex.sh`, `invoke_operator.sh`, `torre-trigger.yml`.
- No usar secrets.
- No ejecutar Claude.
- No mergear PR #13.
- No marcar Ready hasta verificar CI verde post-push.
- Cierre de ciclo Torre normal.

## Criterio de aceptación

- [ ] Plan V0 actualizado con el comando confirmado y la sección 14 reorganizada.
- [ ] Header del plan refleja el cambio de estado.
- [ ] Reporte escrito.
- [ ] `estado.md` actualizado al cerrar.
- [ ] Par archivado en `.torre/historial/2026-04-26_plan-v0-post-feasibility/`.
- [ ] Inbox/outbox en placeholder al cerrar.
- [ ] Push a `torre/claude-real-v0-plan` (PR #13 actualizado).
- [ ] Body del PR #13 actualizado.
- [ ] PR #13 sigue draft hasta verificar CI.

## Formato de reporte esperado

Reporta merge sin conflictos, archivos modificados, CI, mergeable, draft status, recomendación.
