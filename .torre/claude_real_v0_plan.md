# Claude Real V0 — Plan técnico de implementación

> **Estado**: PLAN VIABLE — feasibility validado. Producido por ORD-2026-04-26-18, actualizado por ORD-2026-04-26-20 con el resultado del feasibility test del CLI (ORD-2026-04-26-19) aprobado por Torre. Los 4 bloqueantes principales (sección 14) quedaron resueltos. `.torre/scripts/operators/claude.sh` sigue siendo stub: este plan describe cómo se haría el cambio, sin hacerlo.

## 1. Objetivo

Reemplazar el stub `.torre/scripts/operators/claude.sh` por un adaptador real que:

- Reciba una orden Torre validada por el Invoker.
- Invoque a Claude de forma **controlada**, **acotada** y **auditable**.
- Trabaje siempre sobre una rama nueva, nunca sobre la rama del operador humano ni sobre `main`.
- Aplique únicamente cambios dentro del scope autorizado por la orden.
- Deje un reporte claro en `outbox/reporte_actual.md` de la rama nueva.
- Abra un PR contra `main` para revisión humana.
- **Nunca mergea, nunca pushea a `main`, nunca toca secrets, nunca instala dependencias por su cuenta.**

V0 es la mínima cantidad de código para cerrar el último eslabón del flujo (Torre → Invoker → adaptador → Claude → PR → humano), respetando todas las reglas del contrato.

## 2. Flujo completo esperado

```
Torre escribe orden en .torre/inbox/orden_actual.md
        │
        ▼
git push (workflow torre-trigger-v1 dispara)
        │
        ▼
Invoker valida (gates V1.1/V1.2 + 5 campos + regla dura REPO_TECNICO)
        │
        ▼
Invoker llama a .torre/scripts/operators/claude.sh
        │
        ▼
claude.sh (REAL):
  ├── precheck preconditions (CLI presente, secret presente, branch protection en main)
  ├── toma lock          → EN_PROCESO_POR=claude en .torre/estado.md
  ├── crea rama          → claude/auto-<ORD-ID>-<slug>
  ├── arma prompt seguro → orden + extracto contrato + scope; sin secrets
  ├── invoca Claude      → 1 sola llamada, timeout 5min, max_tokens conservador
  ├── aplica cambios     → solo dentro del SCOPE_PERMITIDO, verificación post
  ├── genera reporte     → resumen en outbox de la rama; sin raw, sin secrets
  ├── commitea           → mensaje con [skip torre] en línea propia
  ├── pushea rama        → nunca a main
  ├── abre PR            → contra main, draft o ready, body con auditoría
  ├── libera lock        → EN_PROCESO_POR=ninguno
  └── exit
        │
        ▼
Humano (Torre/Ariel):
  ├── lee el PR
  ├── revisa diff y reporte
  ├── aprueba/rechaza
  └── si aprueba: mergea ← única acción humana obligatoria del flujo
```

Punto crítico: el adaptador real **abre PR pero no mergea**. La autoridad para transferir trabajo a `main` sigue siendo humana. Branch protection (ya activa) lo refuerza a nivel infraestructura.

## 3. Cómo se invocaría Claude

**V0 elegida** (decisión 11.1 del contrato): usar **Claude Code CLI** (`@anthropic-ai/claude-code`), **modo no interactivo confirmado** por el feasibility test (ORD-2026-04-26-19, APROBADO por Torre).

### Comando confirmado

```sh
echo "$PROMPT" \
  | claude \
      --print \
      --bare \
      --no-session-persistence \
      --output-format json \
      --max-budget-usd 0.10 \
      --model sonnet \
  > /tmp/response.json
```

Cada flag tiene un rol explícito:

- **`-p` / `--print`**: modo no interactivo. Acepta prompt por stdin, escribe respuesta a stdout, sale sin REPL. Confirmado por el feasibility.
- **`--bare`**: minimal mode. Auth estricta vía `ANTHROPIC_API_KEY` (no OAuth, no keychain). Sin hooks, LSP, plugins, auto-memory, CLAUDE.md auto-discovery. Entorno limpio y predecible para CI.
- **`--no-session-persistence`**: no guarda sesión en disco. Apropiado para runner efímero.
- **`--output-format json`**: respuesta parseable. Permite extraer campos de auditoría (sección 9).
- **`--max-budget-usd 0.10`**: cap de costo nativo del CLI. Cualquier overrun aborta la invocación.
- **`--model sonnet`**: modelo default V0 según contrato (decisión 11.5). Opus prohibido salvo autorización explícita en la orden.

Auth: `ANTHROPIC_API_KEY` se expone al step del adaptador con `env:` del workflow YAML; `--bare` la consume sin login interactivo. Confirmado por el feasibility.

### Versión del CLI pineada

La versión validada por el feasibility test: **`@anthropic-ai/claude-code@2.1.119`**. El workflow del adaptador real debe pinear exactamente esa versión hasta que se decida subirla en una orden Torre dedicada.

### Lo que NO se hace en V0

- API directa con `anthropic` SDK + bash que arme prompts y aplique patches manualmente. Camino alternativo descartado: el CLI demostró ser viable.
- Cambiar versión del CLI sin orden Torre.
- Habilitar Opus por default.

## 4. Manejo de lock

El lock es `EN_PROCESO_POR` en `.torre/estado.md`. V0 lo usa así:

### Cuándo se setea

**Antes de modificar cualquier archivo del repo** y después de pasar todos los prechecks. Si los prechecks fallan (CLI ausente, secret ausente, branch protection no activa), no se toma lock.

```sh
# pseudocódigo
if precheck_failed; then
  log "abort sin tomar lock"
  exit <código apropiado>
fi
setear "EN_PROCESO_POR: claude" en .torre/estado.md   # commit este cambio en la rama nueva, NO en main
```

### Cuándo se libera

**Al cerrar el ciclo del adaptador**, sea exitoso o no:

- Éxito: tras escribir reporte, commitear, pushear y abrir PR → liberar lock antes de hacer `exit 0`.
- Falla recuperable (ej. la API devuelve error pero el adaptador puede limpiar): escribir reporte de error, liberar lock, salir con código ≠ 0.

### Qué pasa si falla antes de liberar

Tres escenarios:

1. **Falla limpia** (excepción detectada por el script): el adaptador captura el error, libera el lock, escribe reporte, exit ≠ 0. Funciona si el error es atrapado por el `set -e` + trap.
2. **Falla dura** (proceso muerto, runner abortado): el lock queda como **lock huérfano** (`EN_PROCESO_POR: claude` sin nadie ejecutando). Detalle ya cubierto en `protocolo.md` § "Control de concurrencia → Lock huérfano". Liberación manual por Torre/Ariel.
3. **Falla parcial** (cambios commiteados pero PR no abierto): el adaptador NO debe pushear si no puede abrir el PR. Si ya pusheó la rama y la apertura del PR falla, el reporte explica el estado y el lock se libera; el humano puede abrir el PR a mano.

### Lock cooperativo

El adaptador **nunca toma un lock que ya esté ocupado**. Si lee `EN_PROCESO_POR: <otro>`, sale con exit 30 (guardrail) sin tocar nada. El Invoker actual no toma el lock, así que el primer agente que lo toma es justamente el adaptador real.

## 5. Creación de rama

### Formato

```
claude/auto-<ORD-ID>-<slug-corto>
```

Ejemplo: `claude/auto-ORD-2026-04-27-NN-update-doc`.

### Base

Siempre desde `main` actualizado, **no** desde la rama del operador humano que disparó el workflow:

```sh
git fetch origin main
git checkout -b "claude/auto-${ORD_ID}-${SLUG}" origin/main
```

### Evitar pisar ramas existentes

Antes de crear, verificar que la rama no exista (local ni remoto):

```sh
if git rev-parse --verify "refs/heads/${BRANCH}" >/dev/null 2>&1 \
   || git ls-remote --exit-code origin "${BRANCH}" >/dev/null 2>&1; then
  log "rama ${BRANCH} ya existe, abort"
  exit <código apropiado>
fi
```

Esto previene que dos invocaciones del mismo `ORD-ID` (caso patológico) pisen su trabajo.

### Reglas duras

- Nunca trabajar directo sobre `main` (la branch protection lo bloquea de todas formas).
- Nunca `git push --force` a ninguna rama.
- Nunca `git branch -D` ni `git push origin --delete`.
- Nunca tocar la rama del operador humano que disparó el flujo.

## 6. Prompt seguro

El prompt que el adaptador construye y envía a Claude se arma desde **fuentes determinísticas**, sin variables sensibles, y nunca se ensambla concatenando strings sin escape.

### Qué incluye el prompt

1. **Contenido literal de `.torre/inbox/orden_actual.md`**: la orden completa tal como la escribió Torre.
2. **Extracto relevante de `.torre/claude_real_contrato.md`**: secciones 3 (Alcance permitido), 4 (Acciones prohibidas), 9 (Criterios de corte). No el contrato entero — chunk acotado para mantener prompt corto.
3. **Restricciones de scope**:
   - `SCOPE_PERMITIDO` declarado en la orden, o default `.torre/**`.
   - Lista explícita de archivos **prohibidos**: `.github/workflows/**`, `.torre/scripts/**`, secrets, archivos de config de producción.
4. **Criterios de aceptación** copiados de la orden (sección `## Criterio de aceptación`).
5. **Prohibiciones explícitas** en lenguaje natural:
   - "No leas, no escribas, no menciones `ANTHROPIC_API_KEY` ni ningún secret."
   - "No ejecutes `git merge`, `git push --force`, `git push origin main`, `gh pr merge`."
   - "No instales dependencias. No modifiques `package.json`, `requirements.txt`, etc."
   - "No tocas archivos fuera del scope listado."
6. **Instrucción explícita de devolver reporte**: pedir un bloque estructurado con `[ESTADO]`, `[ARCHIVOS MODIFICADOS]`, `[DIFF RESUMIDO]`, `[RIESGO]` para que el adaptador lo extraiga y lo escriba a `outbox/reporte_actual.md`.

### Qué NO incluye el prompt

- `ANTHROPIC_API_KEY` ni ningún otro secret.
- Variables de entorno sensibles (`env`, `printenv`).
- Tokens (`GITHUB_TOKEN`, etc.).
- Credenciales.
- Datos no requeridos por la orden (otros archivos del repo, contenido de `historial/`, contenido de otros PRs, etc.).
- El contrato completo (solo el extracto acotado).

### Construcción

El prompt se arma a archivo (`prompt.txt` en `/tmp/` del runner) leyendo solo de:
- `.torre/inbox/orden_actual.md`
- secciones 3, 4, 9 de `.torre/claude_real_contrato.md`
- variables del entorno seguras (`ORD_ID`, `BRANCH`, `SCOPE_PERMITIDO`).

Nunca se concatena con `$ANTHROPIC_API_KEY` ni con `$(env)`.

## 7. Scope permitido

### Default V0

`SCOPE_PERMITIDO` no declarado en la orden ⇒ scope default: **solo `.torre/**`**.

### Para la primera prueba real

Scope reducido: **solo `.torre/invoker.md`** (un archivo, una línea, máxima reversibilidad). Detalle en sección 13.

### Si la orden necesita más

La orden puede declarar `SCOPE_PERMITIDO` con paths/globs adicionales. Ejemplos válidos:
- `.torre/**` (default).
- `.torre/invoker.md` (un solo archivo).
- `README.md` (un archivo fuera de `.torre/`).
- `docs/**` (un directorio).

### Verificación post-ejecución

Después de la invocación a Claude, antes de pushear, el adaptador hace:

```sh
modified_files=$(git diff --name-only)
for f in $modified_files; do
  if ! file_in_scope "$f" "$SCOPE_PERMITIDO"; then
    log "scope violation: $f no está en SCOPE_PERMITIDO"
    abort_branch  # descartar cambios, NO commitear, NO pushear
    exit <código apropiado>
  fi
done
```

Si Claude tocó algo fuera del scope, el adaptador **descarta el branch** (no commitea, no pushea, no abre PR) y reporta el incidente.

### Reglas duras del scope

- **Nunca** archivos en `.github/workflows/**` ni `.torre/scripts/**` salvo autorización explícita en `SCOPE_PERMITIDO` (que en V0 **no se va a dar nunca**).
- **Nunca** `package.json`, `requirements.txt`, `Gemfile`, etc. salvo autorización explícita.
- **Nunca** archivos de config de deploy (`.env`, `Dockerfile`, `docker-compose.yml`, etc.).

## 8. Costo y límites

Decisiones del contrato (11.5) implementadas concretamente:

### Por invocación

- **1 invocación a la API por ejecución del adaptador.** Sin retries automáticos (ni con backoff ni sin él — decisión 11.6 del contrato).
- **Timeout duro 5 minutos** sobre el job:
  ```yaml
  timeout-minutes: 5
  ```
- **`max_tokens` conservador**: 4096 como punto de partida. Subir solo cuando haya datos reales de uso.
- **Modelo sugerido V0**: **Sonnet** (balance costo/capacidad para tareas chicas). Configurable por variable, pero Opus prohibido salvo autorización explícita en la orden.

### Cortes pre-invocación

El adaptador frena antes de llamar a la API si:
- La orden está vacía o no tiene `Objetivo` claro.
- Falta sección `## Criterio de aceptación` o está vacía.
- La orden ya fue intentada y existe un ciclo previo con `[ESTADO] PARCIAL/BLOQUEADO` en `historial/` para el mismo ID.
- El runner no tiene CLI Claude Code instalado.
- `ANTHROPIC_API_KEY` no está disponible como secret.
- Branch protection de `main` no está activa (verificable por API).

Cualquiera de esos cortes ahorra el costo de la llamada API.

### Sin counter persistente (decisión 11.5 V2)

V0 no tiene contador de invocaciones por día ni cap en USD/día. Eso es V2. El techo implícito de V0 es **una orden automática activa por vez**: el lock cooperativo (sección 4) impide concurrencia, así que el costo máximo del día es proporcional al número de ciclos secuenciales que pase Torre.

### Modelo: Opus prohibido por default

Opus no se usa en V0 salvo que la orden lo pida explícitamente con un campo `MODELO: claude-opus-*` y Torre justifique. Default Sonnet por costo y por suficiencia para tareas chicas.

## 9. Auditoría

V0 implementa la decisión 11.4 del contrato: **resumen** en reporte commiteado + Step Summary. **No raw completo todavía** (raw → V2 vía artifact).

### Qué queda registrado por invocación

Tanto en `outbox/reporte_actual.md` (commiteado a la rama nueva) como en `GITHUB_STEP_SUMMARY` del job:

- **ID de orden** (extraído de la propia orden).
- **Rama creada**: `claude/auto-<ID>-<slug>`.
- **Commit SHA** del input que disparó el flujo (`GITHUB_SHA` del runner).
- **Commit SHA** del trabajo del adaptador (el que lleva `[skip torre]`).
- **Archivos modificados**: output de `git diff --name-only`.
- **Exit code** del adaptador.
- **Resultado**: `OK` / `BLOQUEADO` / `ERROR`.
- **Resumen del prompt**: hash SHA-256 del prompt + primeras 200 chars literal (no el prompt completo).
- **Resumen de la respuesta**: longitud en tokens, primeras 200 chars literal, `stop_reason` de la API.
- **Costo estimado** si la API lo expone (`usage.input_tokens`, `usage.output_tokens` × tarifa conocida).
- **Costo real** si la API lo expone (algunas SDK lo dan como respuesta del endpoint).
- **Link del PR** abierto (si lo abrió).

### Qué NO se loguea (regla dura del contrato § 6)

- `ANTHROPIC_API_KEY`. Bajo ninguna circunstancia.
- `GITHUB_TOKEN`.
- Otros secrets.
- Prompt completo (raw).
- Respuesta completa (raw).
- Volcado de `env` o `printenv`.
- Contenido de archivos sensibles si los hubiera.

### Mecanismos para evitar leaks

- El adaptador **no usa `set -x`** con variables que contengan secrets en su expansión.
- El adaptador **no hace `echo "$ANTHROPIC_API_KEY"`** ni similar.
- Si por error el secret aparece en un log, GitHub Actions lo enmascara (`***`); buena última línea de defensa pero **no se depende** de ella.
- Trap de exit limpio: si el script aborta inesperadamente, corre un trap que **no** dumpea env.

## 10. Commits

### Regla dura del contrato (decisión 11.9)

**Todo commit del adaptador automático debe incluir `[skip torre]` en una línea propia** del commit message. Cumple la marca exacta del matcher V1.2 estricto: `^[[:space:]]*\[skip torre\][[:space:]]*$`.

### Formato sugerido

```
feat(torre): ejecución automática Claude para ORD-XXXX

<descripción breve del cambio aplicado>

Archivos modificados:
- <ruta1>
- <ruta2>

Generado por .torre/scripts/operators/claude.sh para ORD-XXXX.

[skip torre]
```

### Por qué `[skip torre]`

Sin la marca, el push del adaptador dispararía el workflow → Invoker → adaptador otra vez → loop. Con la marca, el gate (a) del Invoker omite el step y corta el loop.

### Si el commit no puede incluir `[skip torre]`

Frenar. No pushear. No abrir PR. Reportar.

Razonable porque:
- Si algún hook del repo bloquea ese formato, hay un bug de configuración a resolver antes.
- Si el adaptador no puede construir el message correctamente, mejor abortar que arriesgar un loop.

### Reglas duras

- Solo se commitea sobre la **rama nueva** del adaptador.
- Nunca commit directo a `main` (la branch protection lo bloquea, pero el adaptador igual no debe intentarlo).
- Nunca `git commit --amend` sobre commits de Torre o de Ariel; el adaptador solo amenda commits que él mismo creó.
- Nunca commit de archivos fuera del `SCOPE_PERMITIDO`.

## 11. Apertura de PR

### Mecanismo

Después de pushear la rama del adaptador, abrir PR contra `main`:

```sh
# Opción A: si el CLI Claude Code lo abre por sí mismo, usar eso.
# Opción B: usar gh CLI con GITHUB_TOKEN (provisto automáticamente por Actions).
gh pr create \
  --base main \
  --head "claude/auto-${ORD_ID}-${SLUG}" \
  --title "feat(torre): ejecución automática Claude para ORD-${ORD_ID}" \
  --body "$(cat /tmp/pr-body.md)" \
  --draft  # V0 abre como draft por defecto; humano lo pasa a ready cuando va a aprobar
```

### Body obligatorio del PR

```markdown
## Summary
Ejecución automática del adaptador Claude V0 para ORD-${ORD_ID}.

## Orden
- ID: ${ORD_ID}
- Objetivo (extracto): ...
- Scope permitido: ${SCOPE_PERMITIDO}

## Archivos modificados
- ${ruta1}
- ${ruta2}
...

## Riesgos
- ...

## Test plan
- Diff revisable
- Reporte commiteado en outbox/reporte_actual.md
- CI verde requerido (status check `detect-cycle-closure`)

## Costo
- Modelo: ${MODELO}
- Tokens input: ${IN}
- Tokens output: ${OUT}
- Estimado: USD ${COSTO}

## Confirmaciones
- [x] [skip torre] presente en commit message (línea propia)
- [x] Scope respetado (verificación post-ejecución pasó)
- [x] Lock liberado al cerrar
- [x] Sin auto-merge (humano revisa)
```

### Reglas duras

- **Nunca auto-merge.** El adaptador NO usa `gh pr merge`, NO activa "auto-merge" de GitHub.
- **Solo Torre/Ariel humano mergea** (decisión 11.7 del contrato).
- Si la apertura del PR falla (permisos, conflicto, rama base ya tiene cambios), el adaptador reporta el motivo y se detiene. NO hace fallback de pushear a `main` (la branch protection lo bloquearía igual).

### Permisos del workflow

```yaml
permissions:
  contents: write       # crear branches, pushear
  pull-requests: write  # abrir PRs vía gh
```

Sin más: nada de `actions: write`, `deployments: *`, `packages: *`.

## 12. Criterios de corte

Lista exhaustiva de condiciones bajo las cuales el adaptador **se detiene** (sin invocar Claude o sin commitear/pushear según el momento):

### Pre-ejecución (antes de tomar lock)

- Falta cualquier campo obligatorio del Invoker (los 7: `PROYECTO_FUNCIONAL`, `REPO_TECNICO`, `RAMA_TRABAJO`, `RAMA_DESTINO`, `EJECUTOR`, `TIPO_ORDEN`, `REPO_ORIGEN`).
- Falta `REQUIERE_IA: si` en la orden (entonces el Invoker no llama al adaptador).
- `EJECUTOR` no es `claude`.
- `REPO_TECNICO` no coincide con el repo actual (regla dura del Invoker).
- `main` no está protegido (verificable por API; si no protegido, abort).
- Branch protection no incluye los checks requeridos (status check `detect-cycle-closure`, force push bloqueado, delete bloqueado).
- CLI Claude Code ausente o versión sin modo no interactivo.
- `ANTHROPIC_API_KEY` ausente o vacío.
- `EN_PROCESO_POR ≠ ninguno` ya (lock ocupado por otro).

### Pre-invocación (después de tomar lock, antes de llamar API)

- No puede crear la rama (ya existe local o remota).
- Falta sección `## Objetivo` o está vacía / demasiado corta.
- Falta sección `## Criterio de aceptación` o está vacía.
- Existe ciclo previo en `historial/` para el mismo `ID` con `[ESTADO] PARCIAL/BLOQUEADO`.
- `SCOPE_PERMITIDO` declarado pero contiene paths prohibidos (workflow, scripts, secrets).

### Pos-invocación (cambios aplicados, antes de commitear/pushear)

- Claude tocó archivos fuera del `SCOPE_PERMITIDO` → descartar branch, no commitear, no pushear.
- Claude intentó modificar secrets / archivos prohibidos.
- El diff es vacío (Claude no hizo nada útil).
- El diff es enorme (`> N` líneas, configurable) → escalar a humano.

### Pos-commit (rama lista pero PR no se abrió)

- No se puede abrir PR (permisos, conflicto, otra causa) → reportar, liberar lock, exit ≠ 0.

### Errores de la API o del CLI

- Auth error.
- Quota exceeded.
- Server error 5xx persistente (V0 no reintenta).
- Output malformado (no se puede parsear).
- Timeout 5min superado.

En **todos** los casos: reporte escrito explicando el motivo + lock liberado si fue tomado + exit ≠ 0 (excluyendo 10 = "no aplica" y 99 = "stub").

## 13. Primera prueba real propuesta

Cuando todo lo anterior esté implementado y verificado, **una sola prueba mínima** antes de escalar el scope:

### Orden de prueba

```markdown
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: <la rama del operador humano que dispara>
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude
- **TIPO_ORDEN**: local
- **REPO_ORIGEN**: szlapakariel-ux/torre-control
- **REQUIERE_IA**: si
- **SCOPE_PERMITIDO**: .torre/invoker.md

## Objetivo
Modificar una sola línea de documentación en .torre/invoker.md, agregando
al final un comentario HTML claramente marcado como prueba: 
<!-- prueba real Claude #1 -->.

## Criterio de aceptación
- [ ] La línea agregada existe al final de .torre/invoker.md.
- [ ] Ningún otro archivo modificado.
- [ ] Commit con [skip torre] en línea propia.
- [ ] PR abierto contra main, no mergeado.
```

### Restricciones

- Solo tocar `.torre/invoker.md`.
- No tocar scripts (`invoke_operator.sh`, `claude.sh`, `codex.sh`, `check_cycle_closed.sh`).
- No tocar workflow (`.github/workflows/torre-trigger.yml`).
- No tocar otros stubs ni archivos del sistema postal.
- No tocar secrets.
- No mergear.
- Abrir PR y detenerse.

### Resultado esperado

1. Adaptador hace prechecks: pasa.
2. Adaptador toma lock: `EN_PROCESO_POR: claude`.
3. Adaptador crea rama: `claude/auto-ORD-XXXX-prueba-1`.
4. Adaptador invoca Claude con prompt acotado.
5. Claude modifica una sola línea de `.torre/invoker.md`.
6. Adaptador verifica scope: solo `.torre/invoker.md` modificado → pasa.
7. Adaptador escribe reporte en `outbox/reporte_actual.md` de la rama nueva.
8. Adaptador commitea con `[skip torre]` en línea propia.
9. Adaptador pushea la rama.
10. Adaptador abre PR draft contra `main` con body completo.
11. Adaptador libera lock: `EN_PROCESO_POR: ninguno`.
12. Step summary lista: ID, branch, PR URL, archivos modificados (1), exit 0.
13. **Ariel revisa el PR**: lee diff (1 línea agregada), lee reporte, decide.
14. Si aprueba: mergea (ahora cumple branch protection: PR + check verde).
15. `main` queda intacto hasta el merge humano.

### Si la prueba pasa

Escalar gradualmente: scope a más archivos, órdenes más complejas, eventualmente otros operadores (Codex).

### Si la prueba falla

**No escalar.** Debugear con la falla en mano: leer reporte, ver dónde cortó, ajustar el adaptador o el prompt o el contrato. Cada falla en V0 es información para hacer el sistema más robusto antes de pasar a producción.

## 14. Datos pendientes antes de implementar

Reorganizado tras el feasibility test del CLI (ORD-2026-04-26-19, APROBADO por Torre):

### 14.1 — Bloqueantes resueltos

Los 4 ítems que originalmente bloqueaban V0 quedaron **resueltos** por el feasibility test:

1. **Comando real de Claude Code CLI en modo no interactivo** ✅
   - **Confirmado**: `-p` / `--print`. Acepta prompt por stdin, escribe a stdout, sale con exit code claro, sin REPL.
   - Documentado en `claude --help` como caso de uso de pipes.
   - Versión validada: `@anthropic-ai/claude-code@2.1.119`.
2. **Cómo se autentica Claude Code en el runner** ✅
   - **Confirmado**: `ANTHROPIC_API_KEY` en el env, sin login interactivo.
   - Flag `--bare` lo refuerza explícitamente: "Anthropic auth is strictly `ANTHROPIC_API_KEY` or `apiKeyHelper`".
   - GitHub Actions secret + `env:` del step → CLI consume sin prompts.
3. **GitHub Actions runner `ubuntu-latest` Node 20+** ✅
   - **Confirmado**: el feasibility test corre exactamente en `ubuntu-latest` con Node 20+ (default actual).
   - El CLI se instala con `npm install -g @anthropic-ai/claude-code@2.1.119` sin problemas.
4. **Mecanismo para abrir PR** ✅ (parcial — ver 14.3)
   - **Confirmado**: `gh` CLI viene **preinstalado** en `ubuntu-latest`.
   - `GITHUB_TOKEN` provisto automáticamente por Actions con `permissions: pull-requests: write` declarado en el workflow.
   - **Falta probar end-to-end** dentro del adaptador real (ver 14.3).

### 14.2 — Pendientes diferibles (no bloquean V0)

Pueden resolverse con defaults conservadores en V0 y refinarse después:

5. **Nombre exacto del status check requerido**: ya confirmado por Torre como `detect-cycle-closure`. Si se renombra, hay que actualizar branch protection y el contrato.
6. **Verificación de branch protection por API**: el adaptador puede asumirla activa (responsabilidad del operador humano que activa la protección). Precheck por API es nice-to-have, no bloqueante.
7. **Cómo se mide costo real**: el CLI con `--output-format json` devuelve campos relacionados con usage. Validable inspeccionando la respuesta JSON del feasibility test cuando se ejecute. Si no se expone, V0 deja "no disponible" en el reporte.
8. **Cómo se obtiene uso de tokens**: idem #7. El JSON del CLI debería traerlo; si no, se difiere.
9. **Cómo se testear sin gastar mucho**: cubierto por `--max-budget-usd 0.10` y los pasos incrementales del plan (paso 1 dry-run sin invocar Claude, paso 2 invocación inocua).
10. **Política de versionado del CLI**: V0 **pinea `2.1.119`** (la versión validada por feasibility). Cualquier upgrade pasa por orden Torre dedicada.

### 14.3 — Pendiente a probar dentro del adaptador real

Único ítem que el feasibility test **no cubrió** y que falta validar end-to-end al implementar el adaptador:

- **`gh pr create` desde el adaptador**: el feasibility test confirmó que `gh` está en el runner y que `GITHUB_TOKEN` se provee. Falta probar la apertura efectiva de un PR cross-branch desde dentro de `claude.sh` real, con `permissions: pull-requests: write` en el workflow del adaptador. Esto se valida en el **paso 4** del plan incremental (sección 15): "Apertura de PR confirmada".

Si por algún motivo la apertura del PR falla (token sin scope, branch protection que bloquea, conflicto), el adaptador debe reportar y detenerse según los criterios de corte de la sección 12.

## 15. Recomendación de implementación

**No implementar todo junto.** Cinco pasos ordenados, cada uno verificable antes del siguiente:

### Paso 1 — Dry-run de prechecks

Modificar `claude.sh` solo para que verifique entorno y reporte "listo / no listo":
- ¿`claude` CLI presente y versión OK?
- ¿`ANTHROPIC_API_KEY` configurado como secret?
- ¿`gh` CLI presente?
- ¿`main` protegido por API?

Salida: imprimir resultado en step summary, `exit 0` si todo OK, `exit 30` si algo falta. **Sin invocar Claude todavía.**

Permite validar que el runner tiene todo lo necesario sin gastar API calls.

### Paso 2 — Invocación real sin modificar archivos

Extender `claude.sh` para que invoque Claude con un prompt **inocuo** (ej. "responde 'hola' y no toques ningún archivo"). El adaptador captura la respuesta, la loggea, **no commitea ni pushea**.

Verifica la cañería de invocación (auth, modo no interactivo, parsing de respuesta) sin riesgo de modificar el repo.

### Paso 3 — Invocación real modificando solo `.torre/invoker.md`

Implementar el flujo completo: tomar lock, crear rama, invocar, aplicar cambios, verificar scope, commitear, pushear, abrir PR, liberar lock — pero acotado al scope `.torre/invoker.md` (la prueba mínima de la sección 13).

### Paso 4 — Apertura de PR confirmada

Verificar que el PR queda abierto contra `main` con el body correcto, los checks verdes, listo para revisión humana. Ariel revisa, mergea (o no), y se confirma que la branch protection actuó como esperaba.

### Paso 5 — Recién después: pensar en órdenes útiles

Una vez que la prueba mínima pasa limpia, escalar gradualmente: scope a más archivos, órdenes con tareas reales (refactor de doc, corrección de typos, escritura de tests). Cada escalada va en su propia orden Torre.

**No saltar pasos.** Cada uno aporta confianza incremental. Si alguno falla, el problema se aísla en esa capa antes de que se acumule.

### Por qué este orden

- Paso 1 falla rápido y barato (sin API calls).
- Paso 2 valida la API call en abstracto, sin tocar el repo.
- Paso 3 valida el flujo completo en mínimo común denominador.
- Paso 4 valida la integración con branch protection y el humano.
- Paso 5 abre el espacio para uso real, ya con todas las garantías cubiertas.
