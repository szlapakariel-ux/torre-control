# Contrato de seguridad — Claude real detrás de `claude.sh`

> **Estado**: DECISIONES V1 INCORPORADAS. Producido por ORD-2026-04-25-16, actualizado por ORD-2026-04-25-17 con las decisiones aprobadas por Torre para V1. **Sigue sin implementarse**: `.torre/scripts/operators/claude.sh` es stub. La implementación debe partir de este documento como contrato. Lo diferido a V2 está en su propia sección al final.

---

## 1. Qué problema resuelve

Hoy Ariel hace de cartero entre la Torre y los operadores IA: copia órdenes, abre sesiones, pega resultados, monitorea. La Torre y el Invoker eliminaron la mayor parte de ese trabajo de transporte, pero el último eslabón (la **ejecución real** de la orden por una IA) sigue siendo manual.

Conectar Claude real detrás de `claude.sh` cierra ese eslabón: una orden válida en `inbox/orden_actual.md` con `EJECUTOR: claude` + `REQUIERE_IA: si` puede ser ejecutada **sin que Ariel intervenga en el momento**. Lo que se gana: latencia baja, escalado, y Ariel pasa de "cartero" a "aprobador" (revisa el PR, decide si mergea).

Lo que **no** se busca: entregar control total a la IA. La autoridad para mergear, deployar y modificar producción **sigue siendo humana**. Este contrato define exactamente qué puede y qué no puede hacer Claude real para que esa autoridad humana se preserve.

## 2. Flujo esperado

```
Torre escribe orden en inbox/orden_actual.md
  ↓
git push (CI dispara workflow torre-trigger-v1)
  ↓
Detector reporta estado del ciclo
  ↓
Invoker step:
  ├── Gate (a) [skip torre]?  → si → omite
  ├── Gate (b) inbox cambió?  → no → omite
  ├── Llama invoke_operator.sh
  │     ├── Valida 7 campos obligatorios
  │     ├── Verifica REPO_TECNICO normalizado vs origin
  │     ├── REQUIERE_IA: si?  → no → exit 10
  │     ├── EJECUTOR == claude?  → sí → llama claude.sh
  │     │
  │     └── claude.sh (REAL, post-implementación):
  │           ├── Verifica preconditions (secret presente, sandbox listo)
  │           ├── Hace checkout en RAMA NUEVA (no toca la rama actual)
  │           ├── Construye prompt con la orden + contexto mínimo
  │           ├── Llama API/CLI Claude con timeout y límite de tokens
  │           ├── Captura respuesta + lista de archivos modificados
  │           ├── Verifica scope (¿modificó solo lo permitido?)
  │           ├── Escribe reporte en outbox
  │           ├── Commit + push a la rama nueva
  │           └── Abre PR contra RAMA_DESTINO
  │
  └── Step summary registra: ID orden, branch, PR, exit code
  ↓
Humano (Torre o Ariel):
  ├── Lee el PR
  ├── Revisa el reporte y el diff
  ├── Aprueba/rechaza
  └── Si aprueba: mergea  ← ÚNICA acción humana obligatoria del flujo
```

Punto crítico: **Claude real abre PR pero no mergea**. El humano sigue siendo el único que puede transferir trabajo a `main`.

## 3. Alcance permitido para Claude

En la primera versión, Claude solo puede modificar archivos dentro de un **scope explícito** declarado en la orden. Default conservador:

- `.torre/**` — el sistema postal mismo.
- Archivos de documentación (`README.md`, `*.md` fuera de `.torre/` que la orden mencione explícitamente).
- Cualquier archivo o directorio listado en un campo nuevo opcional `SCOPE_PERMITIDO` de la orden.

Si `SCOPE_PERMITIDO` no aparece en la orden, el default es **solo `.torre/**`**.

El adaptador real verifica post-ejecución que la lista de archivos modificados está contenida en el scope. Si Claude modifica algo fuera, el adaptador descarta el branch (no pushea, no abre PR) y reporta el incidente.

## 4. Acciones prohibidas

Claude real **nunca** puede:

- **Mergear PRs** (suyos o ajenos). Sin excepciones.
- **Borrar branches**, locales o remotos.
- **Modificar secrets**, ni leerlos para fines distintos a su único propósito (autenticación con la API). Específicamente: `ANTHROPIC_API_KEY` se usa para llamar la API y no aparece en logs, prompts, ni reportes.
- **Modificar configuración de producción**: archivos de deploy, infrastructure-as-code, variables de entorno productivas, credenciales.
- **Deployar** a cualquier ambiente. El adaptador no llama a `kubectl`, `aws`, `gcloud`, `vercel`, etc.
- **Ejecutar comandos destructivos**: `rm -rf`, `git push --force` a ramas protegidas, `git reset --hard` sobre el árbol original, `DROP`, `DELETE FROM` sin `WHERE`, `truncate`, etc.
- **Instalar dependencias** sin que la orden lo pida explícitamente. Default: `package.json`, `requirements.txt`, `Gemfile`, etc., son inmutables salvo autorización en la orden.
- **Tocar archivos fuera del `SCOPE_PERMITIDO`**.
- **Hacer auto-commit a `main`** (la regla "no auto-merge" se acompaña con "no auto-commit a la rama default").
- **Abrir issues, comentar en otros PRs, modificar releases, o tocar Settings del repo**.

## 5. Sandbox

Política simple, defensa en profundidad:

- **Checkout en rama nueva**. El adaptador hace `git checkout -b claude/auto-<ID>` antes de cualquier modificación. Nunca trabaja sobre la rama del operador humano que disparó el workflow.
- **Permisos mínimos del workflow**:
  ```yaml
  permissions:
    contents: write       # crear branches, pushear
    pull-requests: write  # abrir PRs
    # NO: actions: write, deployments: *, packages: *, etc.
  ```
- **Sin acceso a secrets innecesarios**: solo `ANTHROPIC_API_KEY` expuesto al step del adaptador, nada más. Otros secrets del repo no aparecen en el `env:` del job.
- **Sin auto-commit a `main`** y sin auto-merge — duplica lo de "Acciones prohibidas" pero conviene tenerlo en el sandbox como regla técnica del workflow (ej. branch protection rules).
- **Filesystem**: el adaptador opera dentro del checkout del runner. No monta volúmenes externos, no escribe en `/etc`, `/usr`, `~/.ssh`, etc.
- **Red**: la única salida de red esperable es a `api.anthropic.com`. Si en el futuro el adaptador necesita más (ej. para clonar otro repo), declarar y restringir.
- **Aislamiento entre invocaciones**: el runner es efímero — un job, un FS limpio, sin estado compartido entre runs.

## 6. Manejo de secrets

`ANTHROPIC_API_KEY` es el único secret necesario. Reglas:

- Se configura como **repository secret** (no en variables de entorno globales, no en código, no en archivos del repo).
- Se expone al step del adaptador con scope mínimo:
  ```yaml
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  ```
- **No se imprime en logs**: el adaptador no hace `echo "$ANTHROPIC_API_KEY"`, no usa `set -x` con la variable expandida.
- **No se imprime el `env`**: el adaptador no hace `env`, `printenv`, ni `set` (que volcarían la variable al log).
- **No se pasa al reporte**: el reporte que escribe el adaptador en `outbox/reporte_actual.md` no contiene la clave.
- **No se expone en `GITHUB_STEP_SUMMARY`**: el summary no incluye dumps de env ni la clave.
- **No se pasa como argumento a procesos hijos** salvo el cliente API/CLI que lo necesita.
- Si el secret aparece accidentalmente en un log, GitHub Actions lo enmascara como `***`. Buena última línea de defensa, pero el adaptador **no debe depender** de eso.

## 7. Límite de costos

Defaults conservadores para que un loop o una orden mal formada no genere gasto descontrolado:

- **Máximo 1 invocación de Claude por ejecución del adaptador.** No retries automáticos. Si la primera respuesta falla o es ambigua, exit 30 y dejar que el humano decida.
- **Tiempo máximo de ejecución**: timeout duro de 5 minutos sobre el job (`timeout-minutes: 5` en el workflow). Si Claude no terminó, abort.
- **Tokens aproximados**: límite explícito en la llamada API (`max_tokens` chico al inicio, ej. 4096; subir solo cuando haya datos de uso real).
- **Corte si la orden es ambigua**: el adaptador hace una validación rápida del campo `Objetivo` (longitud mínima, no vacío). Si vacío o demasiado corto, exit 30.
- **Corte si falta `Criterio de aceptación`**: la orden debe tener una sección `## Criterio de aceptación` con al menos un item. Si no, exit 30.
- **Corte si la orden ya fue intentada**: si en el `historial/` existe un ciclo con el mismo `ID` y `[ESTADO] PARCIAL/BLOQUEADO`, no reintentar — escalar al humano.
- **Counter por día (futuro)**: persistir en algún lado el conteo de invocaciones del día y abortar si supera N. V1 puede dejar esto fuera.

## 8. Auditoría

Para cada invocación, el adaptador registra:

- **ID de orden** (extraído de `inbox/orden_actual.md`).
- **Commit SHA del input**: el SHA que disparó el workflow.
- **Branch de trabajo creada**: `claude/auto-<ID>`.
- **Prompt enviado**: hash + primeras 200 chars (no el prompt completo, para evitar inflar logs y exponer contenido sensible si lo hubiera).
- **Respuesta resumida**: longitud en tokens, primeras 200 chars del texto, `stop_reason` de la API.
- **Lista de archivos modificados**: output de `git diff --name-only`.
- **Exit code del adaptador**.
- **Reporte final**: ya escrito en `outbox/reporte_actual.md` (commiteado a la branch nueva).
- **Link del PR** que abrió (si lo abrió).

Todo esto va al `GITHUB_STEP_SUMMARY` del job (visible en la UI de Actions) y se commitea como parte del reporte estructurado en `outbox/reporte_actual.md` de la branch nueva.

**No** se loguea: prompt completo, respuesta completa, `ANTHROPIC_API_KEY`, otros secrets, contenido de archivos sensibles si los hubiera.

## 9. Criterios de corte

Claude se detiene **antes de actuar** si:

- Falta cualquiera de los **7 campos obligatorios** de la orden (chequeo del Invoker, ya implementado).
- `REPO_TECNICO` no coincide con el repo actual normalizado (chequeo del Invoker, ya implementado).
- `RAMA_TRABAJO` no coincide con la rama actual del checkout (regla dura del protocolo).
- Falta sección `Criterio de aceptación` o está vacía.
- Falta sección `Objetivo` o es demasiado corta.

Claude se detiene **a mitad de ejecución** si:

- La orden pide algo en la lista de "Acciones prohibidas" (sección 4).
- La salida de Claude indica que pretende modificar archivos fuera del `SCOPE_PERMITIDO`.
- Aparece un conflicto al pushear la branch nueva (otra invocación pisó el espacio de nombres).
- La invocación API devuelve error no-recuperable (auth, quota, server error 5xx persistente).
- El adaptador no puede abrir el PR (permisos faltantes, branch ya protegida, etc.).
- Detecta riesgo de loop: si el último commit en la rama base fue hecho por el actor automático del adaptador en los últimos N minutos.

Claude se detiene y **escala al humano** si:

- La orden tiene términos ambiguos que requerirían decisión arquitectónica.
- El criterio de aceptación referencia algo que el adaptador no puede verificar automáticamente.
- Cualquier paso del check de seguridad da resultado borderline.

En todos los casos: exit code distinto de 0 (excluyendo 10/99 que son "no aplica" / "stub"), reporte escrito explicando el motivo, sin abrir PR.

## 10. Primera prueba real sugerida

Cuando todo lo anterior esté implementado, la prueba mínima debe ser deliberadamente trivial y reversible:

**Orden de prueba**:
- `Objetivo`: modificar una única línea de `.torre/invoker.md`, agregando una nota de prueba al final claramente marcada (`<!-- prueba real Claude #1 -->`).
- `SCOPE_PERMITIDO`: solo `.torre/invoker.md`.
- `EJECUTOR: claude`, `REQUIERE_IA: si`, `RAMA_DESTINO: main`.

**Restricciones para esta primera prueba**:
- No tocar scripts, workflow, ni adaptadores.
- No tocar secrets visibles ni los archivos de los stubs.
- No mergear automáticamente.

**Esperado**:
- El adaptador llama a Claude.
- Claude crea `claude/auto-ORD-XX`, edita una línea, commitea, pushea, abre PR contra `main`.
- Step summary lista: ID, branch, PR URL, archivos modificados (1).
- Reporte parcial en outbox del runner (efímero).
- Humano revisa el PR (un cambio chiquito), aprueba, mergea.

**Si esa prueba pasa limpia**, escalar gradualmente el scope (más archivos, más complejidad). **Si falla**, no escalar — debugear con la falla en mano.

## 11. Decisiones V1

Decisiones cerradas por Torre tras la revisión del PR #12. Cada item indica qué es lo que se hace en V1 y, cuando aplica, qué quedó diferido a V2.

### 11.1 — CLI o API directa

**Decisión V1**: usar **CLI Claude Code** (`@anthropic-ai/claude-code`) **siempre que soporte modo no interactivo / headless** invocable desde un step de GitHub Actions sin TTY ni input humano.

**Si la versión vigente del CLI no soporta modo no interactivo de forma confiable, frenar y no implementar**: en ese caso, el ciclo de implementación se detiene, queda registrado el hallazgo, y se reabre la decisión (CLI cuando madure el soporte vs. API directa con esfuerzo extra).

API directa con `anthropic` SDK queda como camino alternativo solo si el CLI falla la prueba de no-interactividad.

### 11.2 — Dónde corre Claude real

**Decisión V1**: **GitHub Actions runner**, dentro del workflow `torre-trigger-v1` (o un workflow hermano si la orquestación queda más limpia separada).

Sin infraestructura externa nueva (sin Lambda, sin servicio propio, sin scheduler externo). Esto mantiene el blast radius reducido y aprovecha la cañería existente.

### 11.3 — Cómo se abre el PR

**Decisión V1**: el adaptador hace `git checkout -b claude/auto-<ID>`, commitea los cambios, pushea, y abre **PR contra `main`** usando el mecanismo nativo del runner:

- Si el CLI Claude Code abre el PR por sí mismo, usar eso.
- Si no, usar `gh` CLI con `GITHUB_TOKEN` (provisto automáticamente por Actions).

**Nunca auto-merge**. Si el adaptador no puede abrir el PR (permisos faltantes, branch ya existe, conflicto), reporta el motivo y se detiene. No hace fallback de pushear a `main`.

### 11.4 — Auditoría

**Decisión V1**:
- **Resumen en reporte commiteado** en `outbox/reporte_actual.md` de la branch nueva. Persiste en el historial git.
- **Step Summary** del job con los mismos datos (visible en UI de Actions hasta que expire la retención).
- Para cada invocación: ID de orden, commit/branch, hash + primeras 200 chars del prompt, longitud y primeras 200 chars de la respuesta, lista de archivos modificados, exit code, link del PR.

**No se loguean en V1**: prompt completo, respuesta completa, secrets.

**V2 (diferido)**: subir prompt+respuesta raw como artifact (`actions/upload-artifact`) para debugging post-hoc profundo. Reduce exposición al estar separado del repo y con retención propia, pero no se implementa todavía.

### 11.5 — Límite de costos

**Decisión V1** (límites por invocación, sin counter agregado):
- **1 invocación a la API por orden.** Sin retries automáticos.
- **Timeout 5 minutos** sobre el job (`timeout-minutes: 5`).
- **`max_tokens` conservador** en cada llamada: 4096 como punto de partida.
- **Cortes por orden ambigua**: vacía, sin `Objetivo` claro o sin `Criterio de aceptación` → exit antes de llamar a la API.

**V2 (diferido)**: counter persistente de invocaciones por día y/o cap explícito en USD/día. Requiere persistencia entre runs (ej. archivo committeable o KV externo) y cálculo de costo por token. Se implementa cuando haya datos reales de uso.

### 11.6 — Qué hacer si Claude falla

**Decisión V1**: **una sola tentativa**. Sin retry automático con backoff ni sin él.

Si la invocación falla (auth, quota, server error, output inválido, scope violado, etc.), el adaptador:
1. Escribe reporte explicando el motivo.
2. **No abre PR**.
3. Sale con exit ≠ 0 (excluyendo 10/99 que son "no aplica" / "stub").
4. Escala al humano vía step summary y log del job.

Esto evita loops y costos descontrolados a costa de no recuperar fallas transitorias automáticamente. Si una falla transitoria deja la orden trabada, Torre/Ariel decide el rehacer manualmente.

### 11.7 — Quién aprueba los PRs que abre Claude

**Decisión V1**: **solo Torre/Ariel humano** aprueba y mergea PRs abiertos por el adaptador automático.

- Ningún agente IA aprueba PRs.
- Ningún agente IA mergea PRs.
- No se usa "auto-merge" de GitHub bajo ninguna condición.
- Si en el futuro se quiere agregar review automático (ej. otro Claude leyendo el PR), va como capa adicional **antes** del humano, nunca en su lugar.

### 11.8 — Branch protection en `main`

**Decisión V1**: **obligatoria antes de conectar Claude real**.

`main` debe configurarse con:
- **Push directo prohibido**: solo merges vía PR.
- **Reviews requeridas**: al menos una aprobación humana por PR.
- **Status checks requeridos**: al menos `torre-trigger-v1 / detect-cycle-closure` en verde.
- **Restringir quién puede mergear**: solo cuentas humanas autorizadas (Torre/Ariel).

La activación de branch protection debe ocurrir en el mismo ciclo que conecta el operador real, idealmente **antes** de pushear el primer cambio del adaptador a `main`. Es la última línea de defensa contra un bug de configuración del workflow.

### 11.9 — Anti-loop

**Decisión V1**: **todo commit generado por el operador automático debe incluir `[skip torre]` en una línea propia** del commit message. El gate (a) de V1.2 lo detecta y omite el Invoker en el siguiente push, cortando cualquier loop.

Mecanismo concreto: el adaptador construye el message con un footer obligatorio:

```
<descripción del cambio>

[skip torre]
```

**V2 (diferido, opcional)**: agregar como segunda línea de defensa la identificación por `github.actor` en el workflow (omitir el Invoker si el push viene de la cuenta del bot automático). Documentado pero no implementado en V1 — alcanza con `[skip torre]` controlado por el adaptador.

### 11.10 — Budget de ciclos automáticos por día

**Decisión V1**: **diferida a V2**. No hay counter persistente de ciclos/día.

**Default operativo de V1**: **una orden automática activa por vez**. La concurrencia del sistema postal ya garantiza eso (`EN_PROCESO_POR` ≠ `ninguno` bloquea nuevas tomas). Mientras una orden esté en curso, no entra otra al adaptador.

Esto pone un techo implícito al gasto del día (=  duración de una orden × cantidad de ciclos secuenciales). Si en operación real se ve que ese techo es demasiado alto, V2 agrega counter dedicado.

---

## 12. Pendientes V2

Lo que queda explícitamente fuera de V1, agrupado:

1. **Auditoría raw**: subir prompt+respuesta crudos como artifact (`actions/upload-artifact`) para debugging post-hoc profundo. Decisión de retención y permisos al implementar.
2. **Counter de costos persistente**: archivo en repo o KV externo que cuente invocaciones del día y/o estime gasto en USD; cap automático cuando se supera el límite.
3. **Budget máximo de ciclos automáticos por día**: número absoluto que detiene al adaptador hasta el día siguiente. Requiere V2 #2 como prerequisito.
4. **Identificación por actor en el workflow** (`if: github.actor != '...'`) como segunda línea de defensa anti-loop. La primera (`[skip torre]` en el commit) ya cubre V1.
5. **Review automatizado pre-humano**: capa opcional donde otro agente IA lee el PR y deja comentarios antes de la revisión humana. Sigue requiriendo aprobación humana final.
6. **Multi-CLI / Multi-modelo**: si en algún momento se quiere usar simultáneamente Claude + Codex + otro, formalizar selección de adaptador y políticas de fallback entre ellos.
7. **Recuperación de fallos transitorios**: si la operación muestra muchas fallas transient inocuas, considerar retry con backoff. **No** se hace en V1 a propósito (riesgo de loop).
8. **Métricas de uso**: dashboard (interno o vía Actions) de invocaciones, exit codes, latencia, costo aproximado.

Todo lo de #1–#8 se hace en órdenes Torre dedicadas, **después** de que V1 esté operando estable durante un período razonable.

---

## Notas finales

Este documento ya **no** es propuesta abierta: las decisiones V1 están cerradas y las preguntas pendientes están agrupadas en "Pendientes V2".

La implementación real va a requerir, en una orden Torre dedicada:
- Modificar `.torre/scripts/operators/claude.sh` (hoy stub) para invocar el CLI Claude Code en modo no interactivo, validar scope, abrir PR y devolver exit code.
- Modificar `.github/workflows/torre-trigger.yml`: instalar CLI, exponer `ANTHROPIC_API_KEY` con scope mínimo, ajustar `permissions` (`contents: write` + `pull-requests: write`, sin más), agregar `timeout-minutes: 5`.
- **Activar branch protection en `main`** antes de la primera invocación real (decisión 11.8).
- Validar que el CLI Claude Code soporta modo no interactivo confiable (decisión 11.1) — si no, frenar.
- Ejecutar la prueba mínima de la sección 10 antes de escalar el scope.

Cualquier divergencia entre la implementación y este contrato debe justificarse en el reporte del ciclo.
