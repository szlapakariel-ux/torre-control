# Estado Torre

- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **Última actualización**: 2026-05-02
- **Última orden cerrada**: ORD-2026-05-02-01 — MC-1 protocolo principal documentado (WhatsApp → Portero Local → Torre → Repo Activo)
- **Operador del último ciclo**: Claude Code (`claude_code`)
- **Rama de trabajo del último ciclo**: `claude/mc1-protocolo-principal`
- **Rama destino del último ciclo**: `main`
- **Archivo del último ciclo**: `.torre/historial/2026-05-02_mc1-protocolo-principal/`
- **Orden activa**: NO (inbox en placeholder)
- **EN_PROCESO_POR**: ninguno
- **ORDENES_REMOTAS_EN_VUELO**: 0
- **Bloqueos**: ninguno
- **Órdenes en suspenso**: ORD-2026-04-25-10 (`.torre/inbox/suspendidas/ORD-2026-04-25-10.md`) — diagnóstico Portero V1 en agente-saas, congelada hasta nueva decisión de Torre.

## Resumen del estado del sistema

- `.torre/` instalado y documentado: protocolo, sistema, roles, flujo, decisiones, README, templates, estado, trigger, propuesta de Torre Central (aprobada e implementada), invoker (gates V1.1 + matcher V1.2 estricto), contrato Claude real (mergeado), plan V0 (mergeado), workflow del feasibility test (mergeado).
- **Nuevo (este ciclo, MC-1)**: protocolo principal `WhatsApp → Portero Local → Torre → Repo Activo` registrado en `.torre/protocolo_principal.md`; jerarquía documental declarada en `.torre/jerarquia_documental.md` (3 capas con regla de prevalencia); 10 documentos pasan a consulta histórica subordinada según `.torre/historico.md` (sin moverlos físicamente); ORD-2026-04-25-10 preservada en `.torre/inbox/suspendidas/`.
- `main` protegido (PR obligatorio, status check `detect-cycle-closure`, force/delete bloqueados).
- Stubs Claude/Codex intactos.
- Workflow principal `torre-trigger-v1` intacto.
- Workflow `claude-cli-feasibility-test`: APROBADO en feasibility manual de Torre.
- Historial: veintidós ciclos cerrados.
- `inbox/orden_actual.md` y `outbox/reporte_actual.md` en placeholder — no hay orden activa.
- Backend y frontend sin cambios. Cero dependencias nuevas. Cero código tocado en MC-1.

## Sugerencias acumuladas para próximas órdenes

1. **MC-2** — Mecánica mínima de proyecto activo y alias (`.torre/proyectos.json`, `.torre/inbox/proyecto_activo.json`), solo lectura, sin runtime nuevo.
2. **MC-3** — Formato de escalamiento Portero → Torre (`.torre/inbox/escalamientos/`), 12 campos del protocolo principal sección 9.
3. **MC-4** — Estados, opciones numeradas y avance verificable estructurado.
4. **MC-5** — Watcher de 15 minutos y recuperación interna.
5. **MC-6** — Puente real Portero → Torre, si corresponde.
6. **MC documental aparte** — archivado físico de documentos históricos a `.torre/historial/protocolos_v0/` (solo si Torre lo decide).
7. **MC documental aparte** — formalizar mesa local (`.mesa/{estado.md, pedidos/, revisiones/}`) en repos de proyecto.
8. Pendiente de plan V0: revisar PR del paso 1, disparar `claude-adaptor-prechecks`, etc. (cola previa a MC-1, decide Torre si retoma).
9. Limpieza de ramas pendiente.
10. Validador CI de campos obligatorios en `inbox/orden_actual.md`.

## Próximo trigger esperado

Torre publica una nueva orden en `.torre/inbox/orden_actual.md` con los 7 campos obligatorios. Hasta entonces, los operadores IA no actúan.
