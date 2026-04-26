# Claude adaptor — dry-run de prechecks (paso 1 V0)

> **Estado**: PROPUESTA. Workflow en `.github/workflows/claude-adaptor-prechecks.yml`. Producido por ORD-2026-04-26-21. **No se ejecuta automáticamente.** Se dispara manualmente desde la UI de Actions cuando Torre quiera verificar el entorno.

## 1. Qué es

Implementación del **paso 1 del plan V0 incremental** (sección 15 de `claude_real_v0_plan.md`): un workflow que verifica las **10 precondiciones** del adaptador real V0 sin invocar a Claude, sin modificar archivos, sin abrir PRs.

Sirve para responder con confianza la pregunta: *"¿el entorno está listo para conectar Claude real?"*

## 2. Qué NO es

- **No es** el adaptador real `claude.sh`. Sigue siendo stub.
- **No invoca** la API de Claude. Cero tokens consumidos.
- **No modifica** archivos del repo. `permissions: contents: read`.
- **No abre PRs**. `permissions: pull-requests: read`.
- **No usa el Invoker**, no toma lock, no commit, no push.
- **No corre órdenes de negocio**. Solo verifica entorno.

Vive separado de los workflows existentes (`torre-trigger.yml`, `claude-cli-feasibility-test.yml`) y **no afecta** ninguno.

## 3. Cómo se dispara

Solo manualmente desde la UI de GitHub Actions:

1. Repo → **Actions** → workflow **`claude-adaptor-prechecks`** → **Run workflow** → branch → **Run**.
2. Esperá ~30 segundos.
3. Mirá el step summary del run.

Requiere que `ANTHROPIC_API_KEY` esté configurado como repo secret (lo confirmás en el feasibility test).

## 4. Los 10 prechecks

| # | Precheck | Fuente | OK si | FAIL si |
|---|---|---|---|---|
| 1 | `main` protegido | API GitHub `/repos/{repo}/branches/main/protection` | response trae `required_status_checks` | response dice "Branch not protected" |
| 2 | `ANTHROPIC_API_KEY` presente | env var del step | longitud > 0 | vacío |
| 3 | Claude CLI instalable | `npm install -g @anthropic-ai/claude-code@2.1.119` | exit 0 | exit ≠ 0 |
| 4 | `claude --version` | comando | sale `2.1.119` | distinta versión (warn) o no encontrado (fail) |
| 5 | `gh` disponible | `command -v gh` | exit 0 | no existe |
| 6 | Permisos GitHub mínimos | `gh api /repos/{repo}` | OK lectura | falla auth/repo |
| 7 | Workflow principal intacto | filesystem + `yaml.safe_load` | existe y parseable | falta o malformado |
| 8 | Stubs presentes | `[-f]` y `grep STUB` sobre `claude.sh`, `codex.sh` | ambos existen y marcan STUB | falta alguno |
| 9 | Lock libre | grep `EN_PROCESO_POR` en `estado.md` | vale `ninguno` | distinto de `ninguno` |
| 10 | Scope válido | parseo de `inbox/orden_actual.md` | `SCOPE_PERMITIDO` o placeholder (N/A) | inbox malformado |

## 5. Resultado

Al final el step summary dice:

- **`LISTO PARA INVOCACIÓN REAL: sí`** si los 10 prechecks pasan (warnings permitidos).
- **`LISTO PARA INVOCACIÓN REAL: no`** si al menos un precheck falla, listando cuáles.

Los **warnings** (versión distinta del CLI, stub sin marca explícita, etc.) no bloquean el veredicto pero quedan visibles para revisión humana.

## 6. Costo

**Cero costo de Claude.** El workflow NO invoca a la API.

Costo del runner de GitHub Actions: ~30 segundos (instalación del CLI + 9 comandos básicos).

## 7. Si el dry-run termina en `LISTO: no`

| Precheck que falla | Qué hacer |
|---|---|
| 1 (main no protegido) | Activar branch protection en `main` (Settings → Branches). |
| 2 (secret faltante) | Configurar `ANTHROPIC_API_KEY` en Settings → Secrets → Actions. |
| 3 (CLI no instalable) | Revisar `/tmp/npm.log` para entender la falla; verificar que la versión `2.1.119` siga publicada. |
| 4 (versión distinta) | Solo warning; si querés versión exacta, ajustar pin del workflow. |
| 5 (`gh` faltante) | Inusual en `ubuntu-latest`; agregar `setup-gh-cli` al workflow si pasa. |
| 6 (permisos) | Revisar `permissions:` del workflow YAML. |
| 7 (workflow principal) | Bug: alguien rompió el YAML del Trigger V1. Hay que arreglarlo antes. |
| 8 (stubs) | Verificar que los stubs están en el repo y son ejecutables. |
| 9 (lock ocupado) | Hay otro operador en proceso o lock huérfano. Revisar `estado.md`. |
| 10 (scope) | Si la orden activa tiene `SCOPE_PERMITIDO` mal formado, corregirlo. |

## 8. Si el dry-run termina en `LISTO: sí`

El siguiente paso es la **orden Torre del paso 2 del plan V0 incremental**: invocación real con prompt inocuo (sin modificar archivos), para validar la cañería de invocación end-to-end. Sigue siendo orden Torre dedicada, no se hace acá.

## 9. Persistencia

El workflow no commitea nada. Su salida vive solo en:
- El log del job (visible en la UI de Actions, retención según política del repo).
- El step summary del job (visible en la UI, retención igual).

No hay artifact en V0. Si después se quiere persistir el resultado, agregar `actions/upload-artifact` en una orden Torre dedicada.

## 10. Lo que falta validar después de este precheck

- **`gh pr create` end-to-end**: el feasibility confirmó `gh` disponible; este precheck confirma que el repo puede leerse con el token. Falta probar la apertura efectiva de un PR cross-branch desde un step con `pull-requests: write`. Eso se valida en el **paso 4** del plan incremental (sección 15 del plan V0).
- **Modificación de archivos por Claude dentro del scope**: paso 3 del plan incremental.
- **Invocación de Claude con prompt real**: paso 2 del plan incremental.

V0 separa cada paso en su propia orden Torre y su propia validación.
