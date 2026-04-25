# Estado Torre

- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **Última actualización**: 2026-04-25
- **Última orden cerrada**: ORD-2026-04-25-08 — nomenclatura de ramas (RAMA_TRABAJO + RAMA_DESTINO)
- **Operador del último ciclo**: Claude Code (`claude`)
- **Rama de trabajo del último ciclo**: `claude/trigger-torre-mvp-rSWiS`
- **Rama destino del último ciclo**: `main`
- **Archivo del último ciclo**: `.torre/historial/2026-04-25_nomenclatura-ramas/`
- **Orden activa**: NO (inbox en placeholder)
- **EN_PROCESO_POR**: ninguno
- **Bloqueos**: ninguno

## Resumen del estado del sistema

- `.torre/` instalado y documentado: protocolo, sistema, roles, flujo, decisiones, README, templates, estado, trigger.
- Regla de cierre formalizada: ejecución + reporte + archivado + inbox limpio se hacen en el MISMO PR.
- Control de concurrencia documentado y reflejado en templates; cubre el caso "lock huérfano" (manual, no automático).
- Identidad de proyecto: toda orden debe declarar `PROYECTO_FUNCIONAL`, `REPO_TECNICO`, `RAMA_TRABAJO`, `RAMA_DESTINO`, `EJECUTOR`. Si el repo actual no coincide con `REPO_TECNICO`, el operador no ejecuta. La rama actual debe coincidir con `RAMA_TRABAJO`. `RAMA_DESTINO` es informativo y se usa al abrir el PR.
- Trigger V1 instalado: `.torre/scripts/check_cycle_closed.sh` + `.github/workflows/torre-trigger.yml` + `.torre/trigger.md`. Sin notificación externa todavía.
- Historial: ocho ciclos cerrados (instalación, documentación, control de concurrencia, templates, lock huérfano, identidad de proyecto, trigger V1, nomenclatura de ramas). Las órdenes 01–07 archivadas conservan el campo legacy `RAMA_OBJETIVO`.
- `inbox/orden_actual.md` y `outbox/reporte_actual.md` en placeholder — no hay orden activa.
- Backend y frontend sin cambios. Cero dependencias nuevas.

## Próximo trigger esperado

Torre publica una nueva orden en `.torre/inbox/orden_actual.md` con los cinco campos obligatorios: `PROYECTO_FUNCIONAL`, `REPO_TECNICO`, `RAMA_TRABAJO`, `RAMA_DESTINO`, `EJECUTOR`. Hasta entonces, los operadores IA no actúan.
