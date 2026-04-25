# Contrato de seguridad — Claude real detrás de `claude.sh`

> **Estado**: PROPUESTA. Documento de diseño, **no** implementación. Producido por ORD-2026-04-25-16. La aprobación, implementación y migración son ciclos posteriores. Hasta entonces, `.torre/scripts/operators/claude.sh` sigue siendo un stub honesto.

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

## 11. Preguntas abiertas para Torre/Ariel

Antes de implementar, hay decisiones que dependen del contexto operativo y no las puedo tomar yo:

1. **CLI o API directa?**
   - **CLI Claude Code** (`@anthropic-ai/claude-code`): viene con su propia ergonomía (reconoce el repo, edita archivos, abre PRs). Más simple si ya hace lo que queremos.
   - **API directa** (`anthropic` SDK + bash que arma el prompt y aplica patches manualmente): más control, más esfuerzo, mejor auditoría granular.
   - Decisión recomendada: empezar por CLI si está disponible y soporta modo no-interactivo con permisos restringidos.

2. **Dónde corre Claude real?**
   - **GitHub Actions runner** (lo natural si seguimos con el workflow actual): efímero, gratis hasta cierto punto, ya tenemos la cañería.
   - **Servicio externo dedicado** (ej. una Lambda con scheduler): más control de costos y permisos, más infraestructura nueva.
   - Recomendado: GitHub Actions runner para V1.

3. **Cómo se abre el PR?**
   - El CLI de Claude lo hace solo si tiene permisos.
   - Si usamos API directa: bash + `gh` CLI o llamadas a la API REST de GitHub.
   - Para `gh` necesitamos `gh` instalado en el runner (es trivial) y `GITHUB_TOKEN` (lo provee Actions automáticamente).

4. **Cómo se guarda prompt/respuesta para auditoría?**
   - Tres opciones, no excluyentes:
     - Step summary del job (visible en UI, efímero después de N días por la retención de Actions).
     - Reporte commiteado en `outbox/reporte_actual.md` de la branch nueva (persistente en historial git).
     - Artifact (`actions/upload-artifact`) con el prompt+respuesta crudos (persistente N días, descargable, separado del repo).
   - Recomendado: reporte commiteado (resumen) + artifact opcional (raw).

5. **Cómo se limita el costo concretamente?**
   - `max_tokens` en cada llamada: 4096 inicial.
   - Timeout en el job: 5 min.
   - Counter diario (opcional V2).
   - Decisión: ¿queremos límite de gasto USD/día? Eso requiere calcular costo por token y persistir el counter.

6. **Qué hacer si Claude falla?**
   - Una sola tentativa, luego escalar al humano (recomendado).
   - O: retry con backoff (no recomendado V1, riesgo de loop).
   - Decisión clara antes de implementar.

7. **¿Quién aprueba los PRs que abre Claude?**
   - Solo Torre (Ariel)?
   - Cualquier humano con acceso al repo?
   - Otro agente de revisión (ej. otro Claude leyendo el PR antes de mergear)?
   - Recomendado V1: solo Torre/Ariel humano.

8. **¿Branch protection en `main`?**
   - Hoy `main` no parece estar protegida (los merges los hacemos directos vía API). Convendría protegerla **antes** de conectar Claude real, así un bug del adaptador no puede pushear a `main` por error.

9. **¿Cómo identifica Claude que un push proviene del actor automático?**
   - Para evitar loops (Claude pushea → workflow corre → Invoker llama a Claude → ...).
   - El gate `[skip torre]` ayuda: el adaptador puede agregarlo a sus commits.
   - Adicional: chequear `github.actor` en el workflow.

10. **¿Cuál es el budget máximo aceptable de "ciclos automáticos por día" para esta primera versión?**
    - Sin un número, no hay forma de poner un counter razonable.

---

## Notas finales

Este documento es el **contrato**. La implementación real va a requerir:
- Modificar `.torre/scripts/operators/claude.sh` (hoy stub).
- Modificar `.github/workflows/torre-trigger.yml` (agregar instalación CLI, exponer secret, configurar permisos).
- Crear las protecciones de `main` que correspondan.
- Quizás extender el Invoker para preconditions adicionales.

Todo eso debería hacerse en una orden Torre dedicada, **después** de que este contrato sea aprobado por Torre/Ariel y se respondan las preguntas de la sección 11.
