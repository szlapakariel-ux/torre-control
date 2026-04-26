# Orden Torre — ORD-2026-04-26-18

- **ID**: ORD-2026-04-26-18
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

Diseñar el plan técnico V0 para convertir `.torre/scripts/operators/claude.sh` de stub a adaptador real, respetando el contrato ya mergeado en `.torre/claude_real_contrato.md`. **Solo documento**, sin tocar código ejecutable.

## Tarea concreta

Crear un único archivo nuevo: `.torre/claude_real_v0_plan.md` con secciones A–J:

A. Cómo se invocaría Claude (CLI headless, comando tentativo, condición de freno).
B. Cómo se tomaría el lock (cuándo setear/liberar `EN_PROCESO_POR`, qué pasa si falla).
C. Cómo se crea la rama de trabajo (formato, base, evitar pisar).
D. Cómo se arma el prompt (orden + contrato + restricciones + scope; sin secrets).
E. Cómo se limita el costo (1 invocación, timeout, max_tokens, sin retries).
F. Cómo se genera auditoría (resumen, Step Summary, no secrets, no raw).
G. Cómo se hacen commits (rama de trabajo, `[skip torre]` en línea propia, nunca a main).
H. Cómo se abre PR (contra main, título/body claros, humano revisa y mergea).
I. Criterios de corte (campos, repo, scope, rama, PR, conflictos).
J. Primera prueba real (1 línea en `.torre/invoker.md`, sin tocar scripts/workflow, PR sin merge).

## Restricciones

- **No implementar**, no tocar `claude.sh`, no instalar CLI, no usar secrets, no tocar workflow.
- No conectar Claude real.
- Cierre de ciclo Torre normal.
- PR contra `main` en estado **draft**.

## Criterio de aceptación

- [ ] `.torre/claude_real_v0_plan.md` con A–J cubiertas.
- [ ] Reporte escrito.
- [ ] Par archivado en `.torre/historial/2026-04-26_claude-real-v0-plan/`.
- [ ] Inbox/outbox en placeholder al cerrar.
- [ ] PR draft contra `main`. NO mergear.

## Formato de reporte esperado

Reporta link del PR, archivos creados/modificados, riesgos.
