# Orden Torre — ORD-2026-04-26-21

- **ID**: ORD-2026-04-26-21
- **Fecha**: 2026-04-26
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: torre/claude-adaptor-prechecks
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude
- **TIPO_ORDEN**: local
- **REPO_ORIGEN**: szlapakariel-ux/torre-control
- **REQUIERE_IA**: no

## Objetivo

Implementar el **paso 1 del plan V0 incremental** (sección 15 del plan): un workflow `workflow_dispatch` que hace dry-run de los 10 prechecks del adaptador real, **sin invocar Claude**, sin modificar archivos, sin abrir PRs.

El workflow termina diciendo `"LISTO PARA INVOCACIÓN REAL: sí"` o `"no"` con el motivo.

## Tareas concretas

1. Crear `.github/workflows/claude-adaptor-prechecks.yml` — workflow `workflow_dispatch` only, separado del workflow principal y del feasibility test. Permisos `contents: read + pull-requests: read` (no escribe).
2. Crear `.torre/claude_adaptor_prechecks.md` — doc del workflow (qué chequea, cómo se dispara, qué hacer si falla, lista explícita de lo que NO hace).
3. Cierre de ciclo Torre normal.

## 10 prechecks que verifica el workflow

1. `main` protegido (`GET /repos/{repo}/branches/main/protection`).
2. `ANTHROPIC_API_KEY` presente como secret (sin imprimirla).
3. Claude Code CLI instalable (`npm install -g @anthropic-ai/claude-code@2.1.119`).
4. `claude --version` retorna la versión pineada.
5. `gh` disponible.
6. Permisos GitHub mínimos para read (lectura del repo OK; write se valida cuando el adaptador real lo necesite).
7. Workflow principal `torre-trigger.yml` intacto y parseable.
8. Stubs `claude.sh` y `codex.sh` presentes y marcan "STUB".
9. Lock libre (`EN_PROCESO_POR: ninguno` en `estado.md`).
10. Scope válido (si hay orden activa con `SCOPE_PERMITIDO`).

## Restricciones

- **NO invocar Claude** para trabajar.
- **NO modificar archivos** del repo desde el workflow.
- **NO abrir PR automático** desde el workflow.
- **NO tocar `claude.sh` como adaptador real** completo (sigue stub).
- **NO correr órdenes de negocio**.
- **NO mergear nada** automático.
- No tocar `codex.sh`, `invoke_operator.sh`, `torre-trigger.yml`, `claude-cli-feasibility-test.yml`.
- No usar secrets más allá de los necesarios para verificación (solo lectura de presencia).

## Criterio de aceptación

- [ ] Workflow nuevo creado, `workflow_dispatch` only.
- [ ] Permisos mínimos.
- [ ] Los 10 prechecks implementados sin invocar Claude.
- [ ] Termina diciendo `LISTO: sí/no` en el step summary.
- [ ] Doc en `.torre/claude_adaptor_prechecks.md`.
- [ ] Reporte escrito.
- [ ] Par archivado en `.torre/historial/2026-04-26_claude-adaptor-prechecks/`.
- [ ] Inbox/outbox en placeholder al cerrar.
- [ ] Workflow principal y stubs sin cambios.
- [ ] PR draft contra `main`. NO mergear.

## Formato de reporte esperado

Reporta archivos creados, link del PR, riesgos, próximo paso.
