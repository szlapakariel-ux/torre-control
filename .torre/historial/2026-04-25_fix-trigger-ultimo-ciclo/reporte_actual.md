# Reporte Operador — ORD-2026-04-25-09

- **Orden ejecutada**: ORD-2026-04-25-09
- **Operador**: Claude Code (`claude`)
- **Fecha de cierre**: 2026-04-25
- **RAMA_TRABAJO**: `claude/trigger-torre-mvp-rSWiS`
- **RAMA_DESTINO**: `main`
- **Repo**: `szlapakariel-ux/torre-control`
- **Commit final**: pendiente al momento de redactar

## [ESTADO]

OK — bug del "último ciclo" en `check_cycle_closed.sh` corregido. El detector ahora ordena `historial/<dir>` por timestamp de commit (git log), no alfabéticamente. Verificado en aislado: `nomenclatura-ramas` queda primero por encima de `trigger-v1`. Cero cambios en producto.

## [ARCHIVOS MODIFICADOS]

- `.torre/scripts/check_cycle_closed.sh` — bloque de "último ciclo" reescrito.
- `.torre/trigger.md` — sección "Cómo se detecta..." documenta la nueva lógica de orden.
- `.torre/estado.md` — lock tomado por `claude` y devuelto a `ninguno` al cerrar.
- `.torre/historial/2026-04-25_fix-trigger-ultimo-ciclo/{orden,reporte}_actual.md` (archivado).

## [CAMBIO REALIZADO]

### Decisión técnica: por qué `git log %ct` y no `mtime`

La recomendación de la Torre fue "usar timestamp/mtime real, no orden alfabético". Tres opciones consideradas:

| Opción | Pro | Con | Decisión |
|---|---|---|---|
| Filesystem `mtime` | Simple | Un `git clone` fresco resetea mtime al checkout, rompiendo el orden en CI | Descartada |
| Parsear ID de orden (`ORD-YYYY-MM-DD-NN`) | Estable | Inconsistencia histórica de formato (`ORD-20260425-01` vs `ORD-2026-04-25-02`) | Descartada |
| **`git log -1 --format=%ct -- <dir>`** | Estable, persiste en clones, alineado con "git = fuente de verdad" del protocolo | Requiere git disponible (siempre lo está en este contexto) | **Elegida** |

### Cambio en `check_cycle_closed.sh`

Antes:
```sh
last_dir=$(find "$HISTORIAL" -mindepth 1 -maxdepth 1 -type d \
            | sort -r \
            | head -1)
```

Después:
```sh
last_dir=$(
  find "$HISTORIAL" -mindepth 1 -maxdepth 1 -type d \
    | while read -r dir; do
        ts=$(git log -1 --format=%ct -- "$dir" 2>/dev/null || true)
        printf '%s\t%s\n' "${ts:-0}" "$dir"
      done \
    | sort -nr -k1,1 \
    | head -1 \
    | cut -f2-
)
```

Si `git log` no devuelve nada para algún dir (no commiteado todavía o git no disponible), se asigna `0` y queda al final. Comportamiento estable bajo cualquier circunstancia.

### Cambio en `trigger.md`

Sección "Cómo se detecta un ciclo cerrado" extendida con un párrafo explicando el método de orden y el fallback a `0`.

## [VERIFICACIÓN]

Probado en aislado (sin entrar al `exit 1` por `EN_PROCESO_POR=claude` que aún no había liberado):

```
1777147198  .torre/historial/2026-04-25_nomenclatura-ramas
1777146370  .torre/historial/2026-04-25_trigger-v1
1777144793  .torre/historial/2026-04-25_identidad-proyecto
1777142924  .torre/historial/2026-04-25_lock-huerfano
1777142578  .torre/historial/2026-04-25_actualizar-templates
1777142257  .torre/historial/2026-04-25_control-concurrencia
1777141770  .torre/historial/2026-04-25_documentacion-torre
1777141359  .torre/historial/2026-04-25_instalacion-sistema-postal
```

Pre-corrección el script reportaba `2026-04-25_trigger-v1` (alfabético). Post-corrección reportará `2026-04-25_nomenclatura-ramas` (cronológico) hasta que esta orden sea commiteada, momento en el cual `2026-04-25_fix-trigger-ultimo-ciclo` pasará a ser el último. El sanity-check end-to-end (post-cierre) lo confirma.

## [DIFF RESUMIDO]

- 1 bloque del script reescrito (~10 líneas).
- 1 párrafo nuevo en `trigger.md` documentando la lógica.
- `estado.md` actualizado al cerrar.
- Par archivado en `.torre/historial/2026-04-25_fix-trigger-ultimo-ciclo/`.
- Inbox y outbox vuelven a placeholder.
- 0 cambios en `backend/`, `frontend/`, `protocolo.md`, `flujo.md`, `roles.md`, `sistema.md`, `decisiones.md`, `templates/`, `README.md`, workflow YAML.
- 0 dependencias nuevas.

## [RIESGO]

Bajo. Cambio puntual en un script bash, lógica acotada al bloque de diagnóstico.

Riesgos residuales:

1. **Dependencia de git en el script.** Si alguien corre el script en un tarball/zip sin `.git`, `git log` falla y todos los timestamps caen a `0`, con lo cual el "último ciclo" se vuelve indeterminado (queda alfabético implícito por orden de `find`). Mitigación: el script igual reporta `CICLO CERRADO` correcto; solo la diagnóstica del último ciclo es fuzzy en ese caso. Para Trigger V1, aceptable.
2. **Ties exactos de timestamp.** Si dos ciclos se commitean en el mismo segundo, el orden entre ellos depende de `find` (no garantizado). En la práctica los commits están separados por minutos. No mitigado a propósito.
3. **El script todavía tolera no estar en repo git.** El `git log` puede ejecutarse desde cualquier subdirectorio porque al inicio el script ya hizo `cd "$repo_root"`; el comportamiento es estable.

## [SIGUIENTE PASO]

Próxima orden ya decidida por Torre: **validador CI de campos obligatorios**. Detalle anticipado del scope esperable:

- Verificar que cuando `inbox/orden_actual.md` no está en placeholder, contiene los 5 campos obligatorios (`PROYECTO_FUNCIONAL`, `REPO_TECNICO`, `RAMA_TRABAJO`, `RAMA_DESTINO`, `EJECUTOR`).
- Verificar que `REPO_TECNICO` declarado coincide con el repo actual (mediante `gh` o variable de entorno del workflow `GITHUB_REPOSITORY`).
- Posiblemente extender `check_cycle_closed.sh` o crear un script paralelo `validate_active_order.sh`.

Lo decide la Torre.

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: claude
- **Liberación al cierre confirmada**: sí
