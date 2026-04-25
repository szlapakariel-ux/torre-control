# Estado Torre

- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **Última actualización**: 2026-04-25
- **Última orden cerrada**: ORD-2026-04-25-15 — Invoker V1.2 (matcher estricto del skip)
- **Operador del último ciclo**: Claude Code (`claude`)
- **Rama de trabajo del último ciclo**: `torre/invoker-v1.2-skip-strict`
- **Rama destino del último ciclo**: `main`
- **Archivo del último ciclo**: `.torre/historial/2026-04-25_invoker-v1.2-skip-strict/`
- **Orden activa**: NO (inbox en placeholder)
- **EN_PROCESO_POR**: ninguno
- **ORDENES_REMOTAS_EN_VUELO**: 0
- **Bloqueos**: ninguno

## Resumen del estado del sistema

- `.torre/` instalado y documentado: protocolo, sistema, roles, flujo, decisiones, README, templates, estado, trigger, propuesta de Torre Central (aprobada e implementada), invoker (con gates V1.1 + matcher estricto V1.2).
- Regla de cierre formalizada: ejecución + reporte + archivado + inbox limpio se hacen en el MISMO PR.
- Control de concurrencia documentado, con caso "lock huérfano" cubierto (manual).
- Identidad de proyecto: 7 campos obligatorios. Regla dura por comparación exacta normalizada (V1.1).
- Trigger V1 con orden cronológico por commit timestamp.
- Torre Central multi-repo: cañería tendida, transporte manual.
- **Invoker IA V1.2**: matcher estricto del gate `[skip torre]` (línea propia, espacios opcionales). Cierra el falso positivo descubierto post-merge de PR #6.
- Stubs Claude/Codex intactos.
- Historial: quince ciclos cerrados.
- `inbox/orden_actual.md` y `outbox/reporte_actual.md` en placeholder — no hay orden activa.
- Backend y frontend sin cambios. Cero dependencias nuevas.

## Sugerencias acumuladas para próximas órdenes

1. Validar V1.2 en CI con un push real que use la marca correctamente y otro que la mencione en prosa.
2. Conectar Claude real detrás de `claude.sh` (CLI + secret + sandbox + aprobación humana + límite tokens + audit trail).
3. Conectar Codex después de Claude.
4. Re-emitir ORD-2026-04-25-10 como orden remota una vez que el Invoker conecte un operador real.
5. Validador CI de campos obligatorios en `inbox/orden_actual.md`.
6. Formalizar mecanismo de override Torre.

## Próximo trigger esperado

Torre publica una nueva orden en `.torre/inbox/orden_actual.md` con los 7 campos obligatorios (+ opcionalmente `REQUIERE_IA: si`). Hasta entonces, los operadores IA no actúan.
