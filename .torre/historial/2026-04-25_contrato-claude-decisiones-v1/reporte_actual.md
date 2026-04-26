# Reporte Operador — ORD-2026-04-25-17

- **Orden ejecutada**: ORD-2026-04-25-17
- **Operador**: Claude Code (`claude`)
- **Fecha de cierre**: 2026-04-25
- **Rama**: `torre/claude-real-contrato` (continúa la del ORD-16; PR #12 se actualiza)
- **Repo**: `szlapakariel-ux/torre-control`
- **Commit final**: pendiente al momento de redactar

## [ESTADO]

OK — `.torre/claude_real_contrato.md` actualizado con las decisiones V1 aprobadas por Torre. Las 10 preguntas abiertas anteriores quedaron cerradas en V1 (con sus diferidos a V2 listados aparte). Cero cambios fuera del documento. Stubs y workflow intactos.

## [ARCHIVOS MODIFICADOS]

Modificados:
- `.torre/claude_real_contrato.md`:
  - Header: estado pasa de "PROPUESTA" a "DECISIONES V1 INCORPORADAS".
  - Sección 11: reescrita de "Preguntas abiertas para Torre/Ariel" a "Decisiones V1" con 10 sub-secciones cerradas.
  - Sección 12 nueva: "Pendientes V2" agrupando lo diferido.
  - Notas finales: actualizadas para reflejar que el contrato ya no es propuesta abierta.
- `.torre/estado.md`: lock tomado/devuelto, último ciclo actualizado.
- `.torre/inbox/orden_actual.md` y `.torre/outbox/reporte_actual.md`: orden ORD-17 y este reporte → placeholder al cerrar.

Creados:
- `.torre/historial/2026-04-25_contrato-claude-decisiones-v1/{orden,reporte}_actual.md`.

NO modificados:
- Scripts (`invoke_operator.sh`, `claude.sh`, `codex.sh`, `check_cycle_closed.sh`).
- Workflow (`torre-trigger.yml`).
- Protocolo, flujo, roles, templates, sistema, decisiones, README, trigger, invoker, propuesta de Torre Central.
- Backend, frontend, dependencias.

## [QUÉ PREGUNTAS QUEDARON CERRADAS EN V1]

Las 10 preguntas, con su decisión V1 condensada:

| # | Pregunta | Decisión V1 |
|---|---|---|
| 1 | CLI o API directa | **CLI Claude Code** si soporta modo no interactivo. Si no, frenar y no implementar. |
| 2 | Dónde corre | **GitHub Actions runner**, sin infra externa. |
| 3 | Cómo abre PR | Branch nueva `claude/auto-<ID>` + `gh` CLI o mecanismo del CLI Claude. **Nunca auto-merge.** Si no puede, frenar. |
| 4 | Auditoría | Resumen en reporte commiteado + Step Summary. **Raw → V2.** |
| 5 | Costos | 1 invocación, timeout 5min, max_tokens 4096, cortes por orden ambigua. **USD/día → V2.** |
| 6 | Fallos | Una sola tentativa. Sin retry. Reporte y escalar a humano. |
| 7 | Aprobador | **Solo Torre/Ariel humano**. Ningún agente aprueba ni mergea. |
| 8 | Branch protection | **Obligatoria sobre `main` antes de conectar Claude real.** Cuatro reglas explícitas (push prohibido, reviews requeridas, status checks, restricción de mergeadores). |
| 9 | Anti-loop | **`[skip torre]` en línea propia** en todo commit del adaptador. Identificación por actor → V2 opcional. |
| 10 | Budget ciclos/día | **Diferido a V2.** Default V1: una orden automática activa por vez (techo implícito vía `EN_PROCESO_POR`). |

## [QUÉ QUEDÓ DIFERIDO A V2]

Sección 12 nueva del contrato con 8 items:
1. Auditoría raw vía artifact.
2. Counter persistente de costos (USD/día).
3. Budget máximo de ciclos/día.
4. Identificación por actor en el workflow como segunda línea anti-loop.
5. Review automatizado pre-humano.
6. Multi-CLI / multi-modelo.
7. Recuperación de fallos transitorios (retry con backoff).
8. Métricas de uso / dashboard.

## [DIFF RESUMIDO]

- 1 archivo de doc actualizado (`claude_real_contrato.md`).
- 4 archivos de ciclo Torre (estado, inbox, outbox, par archivado).
- 0 cambios en código, workflow, scripts, secrets.
- 0 dependencias nuevas.

## [RIESGOS]

1. **Bajo**. Solo documentación.
2. **Las decisiones son V1 tentativas, sujetas a primer contacto con la realidad del CLI**. La 11.1 explícitamente dice "frenar si el CLI no soporta modo no interactivo" — eso podría disparar una re-decisión inmediata cuando se intente implementar. Mitigación: ya está documentado el camino de fallback (API directa).
3. **Branch protection (11.8) requiere acción humana en Settings del repo**, no es algo que el adaptador pueda hacer solo. Si se conecta Claude real sin haber activado branch protection antes, queda sin la última línea de defensa. Mitigación: el contrato lo declara como **prerequisito** explícito de la implementación, y la orden de implementación debería incluir verificación previa.
4. **`[skip torre]` (11.9) depende de que el adaptador siempre lo agregue al commit message**. Un bug en el adaptador que omita el footer dispara loop. Mitigación: tests del adaptador deben cubrir ese caso, y el primer commit del adaptador debería ser revisado a mano.
5. **El default V1 "una orden automática activa por vez" (11.10)** descansa en `EN_PROCESO_POR`. Si por algún motivo el lock no se toma correctamente (bug del Invoker o del adaptador), pueden correr varias en paralelo. Mitigación: el Invoker actual no toma el lock por diseño de V1 — habría que decidir si el adaptador real lo hace, y eso es parte de la orden de implementación.
6. **Riesgo de drift**: cuando se implemente, el código puede divergir sutilmente del contrato. Mitigación: la orden de implementación debe citar este documento y el reporte debe justificar cualquier divergencia.

## [SIGUIENTE PASO]

1. **Re-revisión humana del PR #12** ahora que las decisiones están incorporadas. Si Torre/Ariel confirma, el contrato queda como baseline acordada.
2. **Mergear PR #12** cuando Torre lo decida (no antes).
3. **Antes de la orden de implementación**, activar branch protection en `main` (decisión 11.8) — es prerequisito hard.
4. **Orden Torre de implementación**: cubre `claude.sh` real, modificación del workflow (instalación CLI, secret, permisos, timeout), y validación de modo no interactivo. Si esa validación falla, se frena ahí.
5. **Primera invocación real**: la prueba mínima de la sección 10 (cambio trivial en `.torre/invoker.md` con `SCOPE_PERMITIDO` mínimo).

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: claude
- **Liberación al cierre confirmada**: sí
