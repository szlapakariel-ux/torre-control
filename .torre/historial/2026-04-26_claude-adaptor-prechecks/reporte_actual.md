# Reporte Operador — ORD-2026-04-26-21

- **Orden ejecutada**: ORD-2026-04-26-21
- **Operador**: Claude Code (`claude`)
- **Fecha de cierre**: 2026-04-26
- **Rama**: `torre/claude-adaptor-prechecks` (base `main` post-PR #13)
- **Repo**: `szlapakariel-ux/torre-control`
- **Commit final**: pendiente al momento de redactar

## [ESTADO]

OK — workflow `claude-adaptor-prechecks.yml` y doc `claude_adaptor_prechecks.md` creados. **Workflow no ejecutado** (dispara solo manual). Implementa el paso 1 del plan V0 incremental: dry-run de los 10 prechecks **sin invocar Claude**, sin tocar archivos, sin abrir PRs.

## [QUÉ SE IMPLEMENTÓ]

### Workflow `.github/workflows/claude-adaptor-prechecks.yml`

- **Trigger**: solo `workflow_dispatch` (manual). Sin push, sin PR, sin schedule.
- **Permisos**: `contents: read + pull-requests: read`. Cero permisos de escritura.
- **Timeout**: 5 minutos.
- **Versión CLI pineada**: `@anthropic-ai/claude-code@2.1.119`.
- **10 prechecks** ejecutados en un solo step bash con `set -uo pipefail` (sin `-e`) para que TODOS corran aun si alguno falla, y se reporte el conjunto:

| # | Precheck | Cómo lo verifica |
|---|---|---|
| 1 | `main` protegido | `gh api /repos/{repo}/branches/main/protection` busca `required_status_checks` |
| 2 | `ANTHROPIC_API_KEY` presente | `[ -z "${ANTHROPIC_API_KEY}" ]`, NO imprime el valor |
| 3 | CLI instalable | `npm install -g @anthropic-ai/claude-code@2.1.119` |
| 4 | `claude --version` | comando + `grep 2.1.119` (warn si distinta) |
| 5 | `gh` disponible | `command -v gh` |
| 6 | Permisos GitHub lectura | `gh api /repos/{repo}` |
| 7 | Workflow principal | existe + `yaml.safe_load` parseable |
| 8 | Stubs | `[-f]` + `grep STUB` sobre `claude.sh` y `codex.sh` |
| 9 | Lock libre | parseo de `EN_PROCESO_POR` en `estado.md` |
| 10 | Scope válido | parseo de `SCOPE_PERMITIDO` en `inbox` (N/A si placeholder) |

- **Veredicto final**: vuelca al `GITHUB_STEP_SUMMARY` un `LISTO PARA INVOCACIÓN REAL: sí` o `no` según haya fallas. Warnings no fallan, solo quedan visibles.
- **Sanity post-checks**: verifica que el workflow no haya modificado el working tree (exit 99 si lo hizo, defensa en profundidad).
- **Exit code**: 0 si todos los prechecks pasan, 1 si alguno falla, 99 si modificó archivos.

### Doc `.torre/claude_adaptor_prechecks.md`

Cubre: qué es / qué NO es / cómo se dispara / los 10 prechecks tabulados / qué hacer si falla cada uno / qué falta validar después.

## [ARCHIVOS CREADOS/MODIFICADOS]

Creados:
- `.github/workflows/claude-adaptor-prechecks.yml` (workflow nuevo).
- `.torre/claude_adaptor_prechecks.md` (doc).
- `.torre/historial/2026-04-26_claude-adaptor-prechecks/{orden,reporte}_actual.md` (archivado).

Modificados (ciclo Torre estándar):
- `.torre/estado.md` (lock + cierre).
- `.torre/inbox/orden_actual.md` y `.torre/outbox/reporte_actual.md` (placeholder al cerrar).

NO modificados:
- `.torre/scripts/operators/claude.sh` ✅ stub intacto.
- `.torre/scripts/operators/codex.sh` ✅ stub intacto.
- `.torre/scripts/invoke_operator.sh` ✅
- `.torre/scripts/check_cycle_closed.sh` ✅
- `.github/workflows/torre-trigger.yml` ✅ workflow principal intacto.
- `.github/workflows/claude-cli-feasibility-test.yml` ✅ workflow del feasibility intacto.
- Backend, frontend, dependencias.

## [VERIFICACIONES]

- YAML válido (`python3 yaml.safe_load`).
- Cero secrets hardcoded; el workflow referencia `${{ secrets.ANTHROPIC_API_KEY }}` solo para verificar presencia, sin imprimirla.
- Permisos mínimos: `contents: read + pull-requests: read`.
- Sin `set -e` global a propósito (queremos correr los 10 chequeos aun si alguno falla).
- Sanity de "no modificó working tree" al final.

## [DIFF RESUMIDO]

- 1 workflow nuevo.
- 1 doc nuevo.
- Ciclo Torre estándar.
- 0 cambios en código existente, scripts, workflows previos, secrets, dependencias.

## [RIESGOS]

1. **Bajo, mientras el secret esté configurado**: si no, el precheck #2 falla limpio sin daño.
2. **Sin riesgo de invocación accidental**: solo `workflow_dispatch`, requiere acción humana.
3. **Sin riesgo de leak del secret**: el precheck #2 valida con `[ -z ]`, sin expandir la variable en logs. GitHub Actions enmascara cualquier match.
4. **Sin riesgo de costo**: cero llamadas a la API de Claude.
5. **El precheck #6 valida lectura, no escritura**: la verificación de `pull-requests: write` queda para el paso 4 del plan incremental cuando el adaptador real abra PR. Documentado.
6. **Pinning de versión `2.1.119`**: si Anthropic publica una versión incompatible, el dry-run sigue usando la pineada. Como diseño es lo querido.
7. **`set -uo pipefail` sin `-e`**: deliberado para ejecutar los 10 chequeos. Cada chequeo decide su propio fail/warn.

## [SIGUIENTE PASO]

1. **Revisión humana del PR**.
2. Si OK, **mergear** (con `main` protegido, requiere PR + status check; el check actual es `detect-cycle-closure`, que va a correr verde sobre este PR igual que sobre los anteriores).
3. **Configurar `ANTHROPIC_API_KEY`** como repo secret si no estaba ya.
4. **Disparar manualmente** el workflow `claude-adaptor-prechecks` desde la UI de Actions.
5. **Si veredicto = `LISTO: sí`**: orden Torre del paso 2 del plan V0 incremental (invocación real con prompt inocuo).
6. **Si veredicto = `LISTO: no`**: leer la tabla del doc para identificar el precheck que falla y resolverlo.

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: claude
- **Liberación al cierre confirmada**: sí
