# Reporte Operador — ORD-2026-04-25-15

- **Orden ejecutada**: ORD-2026-04-25-15
- **Operador**: Claude Code (`claude`)
- **Fecha de cierre**: 2026-04-25
- **Rama**: `torre/invoker-v1.2-skip-strict` (base `main`)
- **Repo**: `szlapakariel-ux/torre-control`
- **Commit final**: pendiente al momento de redactar

## [ESTADO]

OK — matcher de `[skip torre]` endurecido. Solo cuenta cuando aparece sola en su línea (con espacios opcionales antes/después). Falso positivo del PR #6 cerrado. Cero cambios fuera del workflow y la doc del Invoker.

## [ARCHIVOS MODIFICADOS]

- `.github/workflows/torre-trigger.yml` — gate (a) usa ahora `grep -qE '^[[:space:]]*\[skip torre\][[:space:]]*$'` por línea (estricto) en lugar de `grep -qF "[skip torre]"` (substring laxo). Comentario actualizado.
- `.torre/invoker.md` — bullet del gate `[skip torre]` reescrito con regla, patrón, ejemplos válidos e inválidos, y nota sobre el caso real que motivó el cambio.
- `.torre/estado.md` — lock tomado y devuelto.
- `.torre/inbox/orden_actual.md` y `.torre/outbox/reporte_actual.md` — orden ORD-15 y este reporte → placeholder al cerrar.
- `.torre/historial/2026-04-25_invoker-v1.2-skip-strict/{orden,reporte}_actual.md` — archivado.

NO modificados (deliberadamente, por restricciones de la orden):
- `.torre/scripts/invoke_operator.sh` (no tocado).
- `.torre/scripts/operators/claude.sh`, `codex.sh` (stubs intactos).
- `protocolo.md`, `flujo.md`, `roles.md`, `templates/*`, `sistema.md`, `decisiones.md`, `README.md`, `trigger.md`, `torre_central_propuesta.md`, `check_cycle_closed.sh`.
- `backend/`, `frontend/`, dependencias.

## [QUÉ SE IMPLEMENTÓ]

Cambio puntual al gate (a) del step del Invoker en `torre-trigger.yml`:

```diff
- if echo "$last_msg" | grep -qF "[skip torre]"; then
+ if echo "$last_msg" | grep -qE '^[[:space:]]*\[skip torre\][[:space:]]*$'; then
```

`grep -E` aplica el regex línea por línea sobre el contenido del message. La marca solo dispara el skip cuando ocupa una línea entera (admitiendo espacios decorativos).

## [VERIFICACIÓN]

Probé el matcher contra 9 escenarios. Los 3 pedidos por la orden + 6 adicionales para cubrir variantes:

| # | Mensaje | Esperado | Resultado |
|---|---|---|---|
| 1 | token solo en su línea (con prefijo separado por línea en blanco) | omitir | OK |
| 2 | token con espacios extra alrededor en su línea | omitir | OK |
| 3 | message es solo `[skip torre]` | omitir | OK |
| 4 | `Agrega soporte [skip torre] al workflow` | seguir | OK |
| 5 | `feat: [skip torre] habilitar` (prefijo en la línea) | seguir | OK |
| 6 | `[skip torre] dispatch` (sufijo en la línea) | seguir | OK |
| 7 | sin token | seguir | OK |
| 8 | **caso real del falso positivo del merge de PR #6** (`Mergea ORD-14: Gates [skip torre] + cambió inbox.`) | seguir | OK |
| 9 | token al final del message en su línea | omitir | OK |

Validación YAML: `python3 yaml.safe_load` → OK.

## [RIESGOS]

1. **Bajo**. Cambio puntual a un regex; sin nuevos archivos, sin lógica nueva.
2. **Compatibilidad de regex**: `[[:space:]]` y la sintaxis ERE están soportadas por `grep` POSIX en `ubuntu-latest` (default del workflow). Si en algún momento se cambia a `runs-on` con un grep distinto (alpine, BusyBox), conviene re-validar.
3. **El matcher sigue siendo "última-commit-céntrico"**: sigue dependiendo de `git log -1 --pretty=%B`. Para PRs con varios commits, GitHub usa un merge commit virtual y el message es el del último commit del head branch (no incluye el body del PR). Comportamiento heredado de V1.1, no es nuevo en V1.2.
4. **El token sigue siendo case-sensitive**: `[skip torre]` con minúsculas exactas. Si alguien escribe `[Skip Torre]` o `[SKIP TORRE]` no dispara. Por ahora no agrego `-i` (no es un caso pedido); es una mejora opcional para una futura orden si surge la necesidad.
5. **No probado en GitHub Actions todavía**: las pruebas locales reproducen exactamente la lógica del shell del workflow. La validación final sucede al primer push del PR a CI.

## [SIGUIENTE PASO]

1. **Revisión humana** del PR.
2. Si aprueba, **mergear**. Sugerencia operativa para evitar repetir el falso positivo en este propio merge: usar un commit message que mencione la marca con backticks o cambiar la prosa (ej. "matcher estricto del token de skip" en lugar de "matcher estricto de [skip torre]").
3. **Validación de campo en producción**:
   - push deliberado con commit message que tenga la marca **en su propia línea** → debe aparecer "Invoker omitido por [skip torre]" en el step summary.
   - push deliberado con commit message que mencione la marca **dentro de una frase** → step debe seguir y reportar "no aplica" si inbox está en placeholder.
4. Después de validar, planificar conexión real de Claude detrás de `claude.sh` (orden distinta).

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: claude
- **Liberación al cierre confirmada**: sí
