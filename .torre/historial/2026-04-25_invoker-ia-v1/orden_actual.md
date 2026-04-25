# Orden Torre — ORD-2026-04-25-13

- **ID**: ORD-2026-04-25-13
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: claude/invoker-ia-v1 (declarada; operador en `claude/trigger-torre-mvp-rSWiS` por harness)
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude
- **TIPO_ORDEN**: local
- **REPO_ORIGEN**: szlapakariel-ux/torre-control

## Objetivo

Implementar el primer diseño real para que una orden en `.torre/inbox/` pueda disparar automáticamente a un operador IA, sin que Ariel tenga que avisarle manualmente. Si los proveedores reales (Claude API, Codex CLI) no están disponibles en el entorno actual, dejar adaptadores como stubs honestos que reporten qué falta.

## Tareas concretas

1. `.torre/invoker.md` — documentación del Invoker.
2. `.torre/scripts/invoke_operator.sh` — orquestador principal.
3. `.torre/scripts/operators/claude.sh` — adaptador Claude (stub honesto).
4. `.torre/scripts/operators/codex.sh` — adaptador Codex (stub honesto).
5. `.github/workflows/torre-trigger.yml` — agregar paso opcional que dispara el invoker tras detectar el cambio.

## Restricciones

- No mergear, no deployar, no activar flags.
- No tocar `backend/` ni `frontend/`.
- No agregar dependencias.
- No usar secretos todavía. No inventar credenciales.
- No ejecutar si falta contexto.
- No ejecutar si el repo actual no coincide con REPO_TECNICO.
- **No fingir automatización.** Si Claude/Codex no son invocables aquí, los stubs deben decirlo explícito.
- El invoker NO toma el lock (`EN_PROCESO_POR`); eso lo hace el operador real cuando exista.
- El invoker NO archiva ni cierra ciclos: solo invoca y deja un reporte parcial.

## Criterio de aceptación

- [ ] Los 4 archivos creados (1 doc + 1 orquestador + 2 adaptadores stub).
- [ ] Workflow extendido con un step opcional para invocar.
- [ ] Probado localmente: con inbox en placeholder sale como "no aplica"; con orden simulada con `REQUIERE_IA: si` y `EJECUTOR=claude` invoca el adaptador y recibe stub.
- [ ] Reporte escrito.
- [ ] Par archivado en `.torre/historial/2026-04-25_invoker-ia-v1/`.
- [ ] Inbox y outbox en placeholder.
- [ ] `EN_PROCESO_POR: ninguno` al cerrar.
- [ ] Todo en el mismo PR.

## Formato de reporte esperado

```
[ESTADO]
[QUÉ SE IMPLEMENTÓ]
[ARCHIVOS CREADOS/MODIFICADOS]
[QUÉ PARTE YA ES AUTOMÁTICA]
[QUÉ PARTE QUEDA COMO STUB]
[QUÉ FALTA PARA INVOCAR CLAUDE REAL]
[QUÉ FALTA PARA INVOCAR CODEX REAL]
[RIESGOS]
[SIGUIENTE PASO]
[EN_PROCESO_POR]
```
