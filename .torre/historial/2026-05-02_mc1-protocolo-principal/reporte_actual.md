# Reporte Operador — ORD-2026-05-02-01 (MC-1 Protocolo Principal)

- **Orden ejecutada**: ORD-2026-05-02-01
- **Operador**: Claude Code
- **Fecha de cierre**: 2026-05-02
- **Branch**: `claude/mc1-protocolo-principal`
- **Commit final**: pendiente (ver evidencia en este PR)

## [ESTADO]

OK — protocolo principal registrado, jerarquía documental declarada, históricos listados; ORD-2026-04-25-10 preservada en `inbox/suspendidas/`; cero código tocado.

## [ARCHIVOS CREADOS]

- `.torre/protocolo_principal.md` — texto literal del protocolo emitido por Torre + metadata (versión 1.0, fecha, autoridad, vigencia).
- `.torre/jerarquia_documental.md` — declara las 3 capas (protocolo principal / cañería postal / consulta histórica) y las reglas de prevalencia ante conflicto.
- `.torre/historico.md` — lista declarativa de documentos que pasan a consulta histórica subordinada, sin moverlos físicamente.
- `.torre/inbox/suspendidas/ORD-2026-04-25-10.md` — copia intacta de la orden previa que quedó en suspenso.
- `.torre/historial/2026-05-02_mc1-protocolo-principal/orden_actual.md` — copia de la orden MC-1 al cerrar.
- `.torre/historial/2026-05-02_mc1-protocolo-principal/reporte_actual.md` — copia de este reporte al cerrar.

## [ARCHIVOS MODIFICADOS]

- `.torre/inbox/orden_actual.md` — pisado con MC-1 durante la ejecución; vuelve a placeholder al cerrar.
- `.torre/outbox/reporte_actual.md` — escrito con este reporte durante la ejecución; vuelve a placeholder al cerrar.
- `.torre/estado.md` — actualizado para registrar el cierre de ORD-2026-05-02-01.

## [QUÉ INCLUYE EL PROTOCOLO]

`protocolo_principal.md` registra, **literal y sin reinterpretar**, el protocolo emitido por Torre:

1. Principio general: Torre como ente único de gobierno; los repos del proyecto se gobiernan bajo la lógica común de Torre.
2. Documento principal y archivo histórico: regla de prevalencia frente a documentos anteriores; obligación de declarar conflicto y escalar a Torre ante contradicciones.
3. Roles: Ariel, WhatsApp, Portero Local, Torre, Claude Code/ejecutor — con capacidades y prohibiciones explícitas para cada uno.
4. Regla multi-repo: torre-control + repo del proyecto activo; mesa local como `.mesa/` en el repo del proyecto.
5. Flujo de selección de proyecto por WhatsApp.
6. Autorización de diagnóstico read-only (opción numerada `1`).
7. Resultado esperado del diagnóstico.
8. Avance verificable: definición y lista de qué cuenta y qué no.
9. Recuperación interna a los 15 minutos (Portero junta evidencia, escala a Torre, Torre destraba o se declara bloqueo estructural).
10. Bloqueo estructural: causas y mensaje canónico a Ariel.
11. 8 estados visibles del proceso.
12. Opciones numeradas para Ariel en cada estado.
13. Computer Use: solo bajo autorización explícita; no es flujo normal.
14. Prohibiciones generales activas hasta nuevo microciclo.
15. Criterio de cierre del propio protocolo.
16. Frase madre del flujo.

`jerarquia_documental.md` declara la regla de capas:

- **Capa 1 (vigente)**: `protocolo_principal.md`.
- **Capa 2 (vigente, cañería postal)**: `sistema.md`, `protocolo.md`, `roles.md`, `flujo.md`, `decisiones.md`, `README.md`, `estado.md`.
- **Capa 3 (subordinada, consulta histórica)**: ver `historico.md`.
- Regla: Capa 1 prevalece sobre Capa 2 sobre Capa 3. Conflicto entre Capa 1 y Capa 2 se trata como bloqueo estructural y se escala a Torre, no se resuelve por iniciativa del agente.

`historico.md` lista 10 documentos que pasan a consulta subordinada (no se eliminan, no se mueven físicamente, no se modifican).

## [CÓMO SE USA]

- **Para Torre**: este protocolo es la referencia vigente para emitir órdenes. Cualquier orden futura debe ser coherente con `protocolo_principal.md`. Si Torre quiere modificar la jerarquía o promover/degradar documentos entre capas, requiere microciclo aparte.
- **Para el Portero Local**: cuando responde consultas de Ariel sobre reglas, prioriza Capa 1 → Capa 2 → Capa 3. El protocolo principal define qué puede y qué no puede hacer (sección 3, subrol "Portero Local"). MC-1 NO implementa nuevas capacidades; el Portero sigue siendo el de Fase A (9 tools de solo lectura) hasta que Torre apruebe MC-2 en adelante.
- **Para Claude Code / ejecutores**: antes de ejecutar una orden, verificar que es coherente con Capa 1. Si contradice, declarar bloqueo y detenerse.
- **Para Ariel**: las consultas operativas y autorizaciones por WhatsApp se enmarcan en lo definido en secciones 5–12 del protocolo principal. Las decisiones humanas reales (cambios sensibles, autorización de microciclos, bloqueos estructurales) siguen requiriendo su intervención explícita.

## [DIFF RESUMIDO]

- **Nuevos archivos en `.torre/`**: `protocolo_principal.md`, `jerarquia_documental.md`, `historico.md`.
- **Nuevo archivo en `.torre/inbox/`**: `suspendidas/ORD-2026-04-25-10.md` (copia intacta).
- **Inbox/outbox**: usados durante ejecución, vuelven a placeholder al cerrar.
- **Estado**: registra el cierre del MC-1.
- **Histórico**: nuevo directorio `historial/2026-05-02_mc1-protocolo-principal/` con par orden+reporte.
- **Cero archivos modificados fuera de `.torre/`.** Cero código, cero scripts, cero workflows tocados.

## [RIESGO]

- **Documentos históricos no movidos físicamente**: por decisión de Torre. Riesgo bajo: están listados en `historico.md` y la jerarquía declara que son subordinados. Si en el futuro confunden a un agente, Torre puede emitir microciclo aparte para archivado físico.
- **ORD-2026-04-25-10 en suspenso**: copia preservada en `inbox/suspendidas/`. No se cancela ni se ejecuta. Riesgo: si alguien la confunde con orden activa al revisar el repo, mirar `estado.md` y `inbox/orden_actual.md` (placeholder) aclara que no está activa.
- **Briefing previo (`.torre/briefing_portero_a_torre.md`)**: declarado histórico, sigue commiteado en `main`. Riesgo: que un agente lo lea como vigente. Mitigación: la primera línea de `historico.md` lo lista; la jerarquía aclara que es Capa 3 subordinada.
- **Capacidades del Portero NO ampliadas en este ciclo**: por diseño. El Portero hoy no implementa lo que el protocolo principal describe en secciones 5–12. Esa brecha la atacan MC-2 en adelante. Riesgo: que Ariel mande "Vamos a trabajar con auditoría SOFSE" por WhatsApp y el Portero responda con su comportamiento Fase A actual (no entiende la intención de selección de proyecto). Mitigación: Ariel ya está al tanto.
- **PR pendiente de revisión humana**: este reporte se escribe antes del push/PR. Ariel debe revisar la evidencia (`git status`, `diff --name-only`, `diff --stat`) antes de autorizar push.

## [SIGUIENTE PASO]

Torre tiene varias opciones para la próxima orden, en orden de prioridad sugerido (decide Torre):

1. **MC-2 — Mecánica mínima de proyecto activo y alias**. Crear `.torre/proyectos.json` (lista cerrada de proyectos con alias y rutas locales) y `.torre/inbox/proyecto_activo.json` (proyecto activo único). Solo lectura, sin runtime nuevo.
2. **MC-3 — Formato de escalamiento Portero → Torre**. Definir el contrato `.torre/inbox/escalamientos/ESC-YYYYMMDD-HHMM-proyecto.md` con los 12 campos del protocolo principal sección 9.
3. **MC documental aparte — archivado físico de documentos históricos**: mover los 10 listados en `historico.md` a `.torre/historial/protocolos_v0/`. Solo si Torre lo decide.
4. **MC documental aparte — formalizar mesa local**: definir estructura mínima `.mesa/{estado.md, pedidos/, revisiones/}` en repos de proyecto, con instructivo para Ariel.

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: claude_code
- **Liberación al cierre confirmada**: sí
