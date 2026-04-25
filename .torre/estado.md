# Estado Torre

- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **Última actualización**: 2026-04-25
- **Última orden cerrada**: ORD-2026-04-25-13 — Invoker IA V1 (cañería con stubs honestos)
- **Operador del último ciclo**: Claude Code (`claude`)
- **Rama de trabajo del último ciclo**: `claude/trigger-torre-mvp-rSWiS` (orden declaró `claude/invoker-ia-v1`; harness)
- **Rama destino del último ciclo**: `main`
- **Archivo del último ciclo**: `.torre/historial/2026-04-25_invoker-ia-v1/`
- **Orden activa**: NO (inbox en placeholder)
- **EN_PROCESO_POR**: ninguno
- **ORDENES_REMOTAS_EN_VUELO**: 0
- **Bloqueos**: ninguno

## Resumen del estado del sistema

- `.torre/` instalado y documentado: protocolo, sistema, roles, flujo, decisiones, README, templates, estado, trigger, propuesta de Torre Central (aprobada), invoker.
- Regla de cierre formalizada: ejecución + reporte + archivado + inbox limpio se hacen en el MISMO PR.
- Control de concurrencia documentado y reflejado en templates; cubre el caso "lock huérfano" (manual).
- Identidad de proyecto: 7 campos obligatorios. La regla dura "repo actual = REPO_TECNICO" se evalúa solo cuando `TIPO_ORDEN: local`.
- Trigger V1 con orden cronológico por commit timestamp.
- Torre Central multi-repo: cañería tendida, transporte manual.
- **Invoker IA V1**: detector + dispatch automatizados; adaptadores stub para Claude y Codex que documentan qué falta para invocación real. Workflow extendido con step opcional. Probado en 7 escenarios.
- Historial: trece ciclos cerrados.
- `inbox/orden_actual.md` y `outbox/reporte_actual.md` en placeholder — no hay orden activa.
- Backend y frontend sin cambios. Cero dependencias nuevas.

## Sugerencias acumuladas para próximas órdenes

1. Conectar Claude real detrás de `claude.sh` (CLI + secret + sandbox + aprobación humana + límite tokens + audit trail).
2. Filtrado más fino del trigger del workflow para evitar que cada cambio en `.torre/**` invoque al modelo.
3. Conectar Codex después de Claude.
4. Re-emitir ORD-2026-04-25-10 como orden remota una vez que el Invoker conecte un operador real.
5. Validador CI de campos obligatorios en `inbox/orden_actual.md`.
6. Formalizar mecanismo de override Torre.

## Próximo trigger esperado

Torre publica una nueva orden en `.torre/inbox/orden_actual.md` con los 7 campos obligatorios (+ opcionalmente `REQUIERE_IA: si` para que el Invoker actúe). Hasta entonces, los operadores IA no actúan.
