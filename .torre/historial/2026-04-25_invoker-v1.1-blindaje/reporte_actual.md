# Reporte Operador — ORD-2026-04-25-14

- **Orden ejecutada**: ORD-2026-04-25-14
- **Operador**: Claude Code (`claude`)
- **Fecha de cierre**: 2026-04-25
- **Rama**: `torre/invoker-v1.1` (declarada en orden, real, base `main`)
- **Repo**: `szlapakariel-ux/torre-control`
- **Commit final**: pendiente al momento de redactar

## [ESTADO]

OK — Invoker V1.1 (blindaje pre-IA real) completo. Los cinco frentes cubiertos: filtro de archivo cambiado, `[skip torre]`, normalización exacta de `REPO_TECNICO`, documentación de persistencia efímera, logs claros. Stubs Claude/Codex intactos. Cero secrets, cero CLIs nuevos, cero dependencias.

## [QUÉ SE IMPLEMENTÓ]

1. **Gate `[skip torre]`** en el step del Invoker (workflow YAML): `git log -1 --pretty=%B | grep -F "[skip torre]"` → si match, log claro y exit 0.
2. **Gate "cambió `inbox/orden_actual.md`"** (workflow YAML): `git diff --name-only HEAD~1 HEAD | grep -E "^\.torre/inbox/orden_actual\.md$"` → si no hay match, log claro y exit 0. Fallback conservador si no existe `HEAD~1` (deja correr).
3. **`fetch-depth: 2`** en el `actions/checkout` para que el diff entre `HEAD~1` y `HEAD` funcione.
4. **`normalize_repo()`** en `invoke_operator.sh`: convierte `https://`, `git@`, y `owner/repo` a forma canónica `owner/repo` y compara exacto. Sin más matches por substring.
5. **Sección "Persistencia del reporte parcial"** en `invoker.md`: explica la diferencia entre correr local (persiste si commiteás) vs en CI (efímero, descartado al cerrar el job). V1.1 no auto-commitea ni sube artifacts; el reporte parcial vive solo en el log y el step summary.
6. **Subsección "Gates V1.1"** en `invoker.md`: documenta los dos gates y el comportamiento del step summary para cada motivo de "no corre".

## [ARCHIVOS MODIFICADOS]

- `.github/workflows/torre-trigger.yml` — checkout con `fetch-depth: 2`; step del Invoker reescrito con dos gates pre-script y summary diferenciado.
- `.torre/scripts/invoke_operator.sh` — agregada función `normalize_repo()` y reemplazada la comparación substring por comparación exacta normalizada con logs detallados (origen crudo + normalizado, `REPO_TECNICO` crudo + normalizado).
- `.torre/invoker.md` — secciones "Gates V1.1 antes de llamar al Invoker" y "Persistencia del reporte parcial".
- `.torre/estado.md` — lock tomado por `claude` y devuelto a `ninguno`.
- `.torre/inbox/orden_actual.md` — orden ORD-14 → placeholder al cerrar.
- `.torre/outbox/reporte_actual.md` — este reporte → placeholder al cerrar.
- `.torre/historial/2026-04-25_invoker-v1.1-blindaje/{orden,reporte}_actual.md` — archivado.

NO modificados (deliberadamente):
- `.torre/scripts/operators/claude.sh` y `codex.sh` (stubs intactos por criterio).
- `protocolo.md`, `flujo.md`, `roles.md`, `templates/*`, `sistema.md`, `decisiones.md`, `README.md`, `trigger.md`, `torre_central_propuesta.md`, `check_cycle_closed.sh`.
- `backend/`, `frontend/`, dependencias.

## [QUÉ PARTE YA ES AUTOMÁTICA]

Toda la lógica de gating + ejecución del Invoker corre sin intervención humana en cada push/PR que toca `.torre/**`. Los gates filtran agresivamente:

- Casi todos los pushes que tocan `.torre/**` (doc, scripts, historial, etc.) **no** llaman al Invoker porque no cambiaron `inbox/orden_actual.md`.
- Los pushes con `[skip torre]` tampoco lo llaman.
- Solo cuando un cambio real al inbox ocurre y no hay marca de skip, el Invoker se invoca, y ahí los filtros internos (placeholder, REQUIERE_IA, EJECUTOR) deciden si sigue.

## [QUÉ PARTE QUEDA COMO STUB]

Los adaptadores `claude.sh` y `codex.sh` siguen siendo stubs honestos (intactos por criterio explícito de la orden). Cuando se conecte un operador real será un ciclo aparte; V1.1 deja la base segura para que ese ciclo no genere loops ni gasto descontrolado.

## [VERIFICACIÓN]

### Pruebas del script (7 escenarios)

| # | Escenario | Esperado | Real |
|---|---|---|---|
| 1 | inbox en placeholder | exit 10 | OK 10 |
| 2 | orden válida sin `REQUIERE_IA` | exit 10 | OK 10 |
| 3 | `EJECUTOR=claude` + `REQUIERE_IA: si` | exit 99 (stub) | OK 99 |
| 4 | `EJECUTOR=humano` + `REQUIERE_IA: si` | exit 10 | OK 10 |
| 5 | `REPO_TECNICO=szlapakariel-ux/agente-saas` (mismatch) | exit 30 | OK 30 |
| 6 | `REPO_TECNICO=https://github.com/szlapakariel-ux/torre-control.git` | exit 99 (normaliza, llega al stub) | OK 99 |
| 7 | `REPO_TECNICO=git@github.com:szlapakariel-ux/torre-control.git` | exit 99 (normaliza, llega al stub) | OK 99 |

### Pruebas de `normalize_repo()` aislada (7 inputs)

Probados los formatos: `https://...git`, `https://...sin git`, `git@...git`, `git@...sin git`, `owner/repo`, URL del proxy local de testing, URL canónica de GitHub. Los 7 producen `owner/repo` correcto.

### Pruebas del workflow YAML

- `python3 -c "import yaml; yaml.safe_load(open(...))"` → OK.
- Lógica de gates verificada por inspección (no se puede ejecutar GitHub Actions localmente sin tooling extra). Va a probarse de verdad en el primer push del PR a CI.

### Comportamiento esperado del workflow tras el merge

- Push a `main` que toca solo doc/scripts/historial: detector corre y reporta estado; **Invoker se omite con log "no cambió `inbox/orden_actual.md`"**.
- Push con `[skip torre]` en el message: detector corre; **Invoker se omite con log "[skip torre]"**.
- Push que cambia inbox a una orden con `REQUIERE_IA: si` y `EJECUTOR: claude`: Invoker corre y devuelve stub 99.

## [DIFF RESUMIDO]

- 1 archivo de workflow modificado (gates + checkout fetch-depth).
- 1 script modificado (normalize_repo + comparación exacta).
- 1 doc actualizada (secciones nuevas en invoker.md).
- 1 estado actualizado (lock).
- 1 par archivado en `.torre/historial/`.
- Inbox y outbox en placeholder.
- 0 cambios en producto, dependencias, secrets, CLIs.
- 0 cambios en stubs.

## [RIESGOS]

1. **`HEAD~1` no existe en escenarios excepcionales** (primer commit absoluto del repo, o shallow clone con depth=1). El workflow detecta esa situación y deja correr el Invoker (fallback conservador). Trade-off aceptable: mejor falso positivo que falso negativo en un escenario raro.
2. **`fetch-depth: 2`** sigue siendo shallow. Si en algún momento se necesita ver más historia (ej. para resolver merges complejos en CI), hay que aumentar. Por ahora, 2 es suficiente para `git diff HEAD~1 HEAD`.
3. **`[skip torre]`** depende del **último** commit message; si un PR tiene varios commits y solo el último lleva la marca, el behaviour del workflow para `pull_request` depende de qué commit usa GitHub como `HEAD`. En PRs, GitHub usa un merge commit virtual. Detalle a validar en el primer PR real con la marca.
4. **Comparación exacta de `REPO_TECNICO` puede romper** si alguien declara la URL con `.git` final en la orden y el origin no la tiene (o viceversa). La normalización quita `.git` en ambos lados, así que está cubierto.
5. **El Invoker en CI sigue sin persistir** su reporte parcial. Si un humano espera ver el "reporte parcial" en `outbox/` después del run, no va a estar — solo en el step summary. Esto está documentado, pero es un cambio mental respecto a V1.
6. **Secret-fishing por logs**: el step summary muestra `out` del Invoker, que incluye el `origin` URL crudo. Si alguien configurara `origin` con un token embebido (`https://TOKEN@github.com/...`), ese token quedaría visible en el log. Mitigación V1.1: la URL del origin no es típicamente sensible en este repo. Para el futuro, si el operador real recibe secrets, hay que filtrar el output con cuidado.
7. **El gate de "cambió inbox" se basa solo en el último commit** (`HEAD~1..HEAD`). Si en un PR de varios commits, el inbox cambió en un commit intermedio pero no en el último, el gate omitiría el Invoker. Es lo correcto para la convención Torre (el último commit cierra el ciclo, deja inbox en placeholder), pero conviene tenerlo en mente.

## [SIGUIENTE PASO]

Recomendación operativa:

1. **Mergear este PR** después de revisión humana.
2. **Probar el behaviour en producción**: hacer un push a `main` que toque solo doc dentro de `.torre/` (sin tocar inbox) y verificar en Actions que el step "Invoker" reporta "omitido: inbox no cambió".
3. **Probar `[skip torre]`** con un push que tenga la marca y verificar el omitido.
4. **Solo después de eso, planificar la conexión real de Claude** detrás de `claude.sh`. La base ahora es lo bastante segura para que esa conexión no genere loops ni gasto descontrolado.
5. (Independiente) Volver a Secretaria/Portero V1 cuando Torre lo decida.

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: claude
- **Liberación al cierre confirmada**: sí
