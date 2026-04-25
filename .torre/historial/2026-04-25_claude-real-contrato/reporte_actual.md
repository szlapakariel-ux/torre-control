# Reporte Operador — ORD-2026-04-25-16

- **Orden ejecutada**: ORD-2026-04-25-16
- **Operador**: Claude Code (`claude`)
- **Fecha de cierre**: 2026-04-25
- **Rama**: `torre/claude-real-contrato` (base `main`)
- **Repo**: `szlapakariel-ux/torre-control`
- **Commit final**: pendiente al momento de redactar

## [ESTADO]

OK — contrato de seguridad de Claude real escrito como un único documento nuevo. Cero cambios en código, scripts, workflow, secrets, protocolo, flujo, roles, templates. Stubs Claude/Codex intactos.

## [QUÉ SE IMPLEMENTÓ]

Solo documentación. Un único archivo nuevo: `.torre/claude_real_contrato.md` con las 11 secciones requeridas:

1. **Qué problema resuelve** — Ariel deja de ser cartero pero la autoridad humana se preserva.
2. **Flujo esperado** — diagrama paso a paso del recorrido de una orden con Claude real.
3. **Alcance permitido** — `.torre/**` por default, expandible vía campo opcional `SCOPE_PERMITIDO` en la orden.
4. **Acciones prohibidas** — lista exhaustiva (no merge, no delete branches, no secrets, no deploy, no destructivo, no instalar deps sin autorización).
5. **Sandbox** — checkout en branch nueva, permisos mínimos del workflow, sin secrets innecesarios, sin auto-commit a main.
6. **Manejo de secrets** — `ANTHROPIC_API_KEY` como repo secret, regla "no logs", "no env dump", "no en reporte", "no en step summary".
7. **Límite de costos** — 1 invocación por orden, timeout 5min, max_tokens conservador, criterios de corte por orden ambigua o sin criterio de aceptación.
8. **Auditoría** — qué se logguea (ID, branch, hash de prompt, primeras 200 chars de respuesta, archivos modificados, exit, link PR) y qué NO (prompt completo, secrets).
9. **Criterios de corte** — pre-acción, mid-acción, escalada al humano.
10. **Primera prueba real sugerida** — orden trivial y reversible: una línea en `.torre/invoker.md` con `SCOPE_PERMITIDO` mínimo.
11. **Preguntas abiertas** — 10 decisiones pendientes para Torre/Ariel (CLI vs API, dónde corre, cómo abre PR, persistencia, costo USD/día, retry, aprobador, branch protection, identificar actor automático, budget diario).

## [ARCHIVOS CREADOS/MODIFICADOS]

Creados:
- `.torre/claude_real_contrato.md` (documento principal).
- `.torre/historial/2026-04-25_claude-real-contrato/{orden,reporte}_actual.md` (archivado).

Modificados:
- `.torre/estado.md` (lock tomado y devuelto).
- `.torre/inbox/orden_actual.md` (orden ORD-16 → placeholder).
- `.torre/outbox/reporte_actual.md` (este reporte → placeholder).

NO modificados (deliberadamente):
- `.torre/scripts/invoke_operator.sh`, `.torre/scripts/operators/claude.sh`, `.torre/scripts/operators/codex.sh`, `.torre/scripts/check_cycle_closed.sh`.
- `.github/workflows/torre-trigger.yml`.
- `.torre/protocolo.md`, `flujo.md`, `roles.md`, `templates/*`, `sistema.md`, `decisiones.md`, `README.md`, `trigger.md`, `invoker.md`, `torre_central_propuesta.md`.
- `backend/`, `frontend/`, dependencias.

## [VERIFICACIÓN]

- `git diff --name-status main..HEAD` (excluyendo el archivado y placeholders) muestra **un solo archivo nuevo**: `.torre/claude_real_contrato.md`.
- Sin tocar ningún archivo ejecutable.
- Sin agregar secrets ni referencias a credenciales reales (las menciones a `ANTHROPIC_API_KEY` son **documentales**, describiendo qué secret habría que configurar a futuro — mismo patrón que ya estaba en `claude.sh` stub).
- Sin tocar workflow.

## [RIESGOS]

1. **Bajo**. Solo documentación.
2. **El contrato es propuesta**, no decisión. Las 10 preguntas abiertas en la sección 11 dependen de Torre/Ariel. Hasta responder esas, no se puede implementar.
3. **Riesgo de drift**: cuando se implemente, los detalles concretos pueden diverger del contrato. Mitigación natural: la orden de implementación debe referenciar este documento y, si diverge, justificar por qué.
4. **Posibles puntos en contra del contrato** (los menciono para que el reviewer los considere):
   - El default de "1 invocación por orden, sin retry" es muy conservador. Si Claude falla por causa transient, el humano queda esperando. Trade-off vs. costo.
   - El default de scope solo `.torre/**` es muy chico. Cualquier orden útil va a requerir `SCOPE_PERMITIDO` explícito. Quizás conviene declarar un par de scopes default por dominio (ej. `docs`, `tests`).
   - "Audit log" sin prompt completo limita debugging post-hoc. Si Claude hace algo raro, no tendremos el prompt exacto. Trade-off vs. exposición de contenido sensible.

## [SIGUIENTE PASO]

1. **Revisión humana del PR** — Torre/Ariel lee el contrato y opina.
2. **Responder las preguntas abiertas** de la sección 11 (es lo que destraba todo lo demás).
3. **Si el contrato se aprueba**, abrir orden Torre dedicada para implementar:
   - Modificar `claude.sh` (sacar stub, conectar CLI/API según decisión).
   - Modificar workflow (instalar CLI, exponer secret, configurar permisos mínimos).
   - Activar branch protection en `main`.
   - Quizás extender el Invoker con preconditions extra.
4. **Antes de la primera invocación real**, ejecutar la "prueba mínima" de la sección 10.

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: claude
- **Liberación al cierre confirmada**: sí
