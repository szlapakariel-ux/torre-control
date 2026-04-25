# Reporte Operador — ORD-2026-04-25-08

- **Orden ejecutada**: ORD-2026-04-25-08
- **Operador**: Claude Code (`claude`)
- **Fecha de cierre**: 2026-04-25
- **RAMA_TRABAJO**: `claude/trigger-torre-mvp-rSWiS`
- **RAMA_DESTINO**: `main`
- **Repo**: `szlapakariel-ux/torre-control`
- **Commit final**: pendiente al momento de redactar

## [ESTADO]

OK — `RAMA_OBJETIVO` retirado. Reemplazado por `RAMA_TRABAJO` (lo que el operador verifica) y `RAMA_DESTINO` (informativo para enrutar el PR). El hueco que apareció en ORD-2026-04-25-07 queda cerrado.

## [ARCHIVOS MODIFICADOS]

- `.torre/protocolo.md` — sección "Identidad de proyecto" reescrita con los 5 campos y nota histórica sobre el campo retirado.
- `.torre/templates/orden_template.md` — línea `RAMA_OBJETIVO` reemplazada por `RAMA_TRABAJO` + `RAMA_DESTINO`.
- `.torre/flujo.md` — sub-checklist del paso "Ejecución" actualizado a 5 puntos (el 5 aclara que `RAMA_DESTINO` no se verifica en runtime).
- `.torre/roles.md` — obligaciones de Torre y Operador IA actualizadas con los nuevos campos.
- `.torre/inbox/orden_actual.md` — placeholder menciona los 5 campos (al cerrar).
- `.torre/estado.md` — bloque "Próximo trigger esperado" menciona los nuevos campos; lock tomado y devuelto a `ninguno`.
- `.torre/historial/2026-04-25_nomenclatura-ramas/orden_actual.md` (archivado).
- `.torre/historial/2026-04-25_nomenclatura-ramas/reporte_actual.md` (archivado).

## [CAMBIO REALIZADO]

### Semántica nueva

| Campo | Qué es | Quién lo usa |
|---|---|---|
| `RAMA_TRABAJO` | rama donde el operador desarrolla y commitea | Operador IA: chequeo dura `git branch --show-current` ↔ este valor |
| `RAMA_DESTINO` | rama donde aterriza el trabajo (típicamente `main`) | Torre/operador al abrir el PR como `base`; **no se verifica en runtime** |

### Detalle por archivo

- **`protocolo.md` § "Identidad de proyecto"**: ahora lista 5 campos obligatorios (antes 4). La regla dura solo verifica `REPO_TECNICO`, `RAMA_TRABAJO` y `EJECUTOR`; `RAMA_DESTINO` se aclara como metadato. Se agregó una nota histórica indicando que ORD-2026-04-25-07 y anteriores usan `RAMA_OBJETIVO` y no se retroeditan (`historial/` inmutable).
- **`templates/orden_template.md`**: reemplazo línea por línea, comentarios HTML actualizados para describir cada nuevo campo.
- **`flujo.md`**: paso "Ejecución" pasa de 4 a 5 puntos. El nuevo punto 5 explicita que `RAMA_DESTINO` no se verifica acá.
- **`roles.md`**: bloque Torre exige los 5 campos en cada orden; bloque Operador IA verifica los 4 que aplican (excluyendo `RAMA_DESTINO`).
- **`estado.md`**: bloque "Próximo trigger esperado" actualizado para mencionar la nueva nomenclatura. Encabezado del estado conserva `PROYECTO_FUNCIONAL` y `REPO_TECNICO`.

### Verificación operativa

Esta misma orden estrenó los nuevos campos:
- `RAMA_TRABAJO: claude/trigger-torre-mvp-rSWiS` — coincide con `git branch --show-current`. ✓
- `RAMA_DESTINO: main` — informativo, no verificado.
- Sin contradicción entre lo declarado y la realidad del operador. El problema de ORD-2026-04-25-07 no ocurre.

## [DIFF RESUMIDO]

- 4 docs actualizadas (`protocolo.md`, `flujo.md`, `roles.md`, `templates/orden_template.md`).
- `estado.md` actualizado al cerrar.
- Par orden+reporte archivado en `.torre/historial/2026-04-25_nomenclatura-ramas/`.
- Inbox y outbox vuelven a placeholder (mencionando los 5 campos).
- 0 cambios en `backend/`, `frontend/`, `sistema.md`, `decisiones.md`, `README.md`, `templates/reporte_template.md`, `trigger.md`, scripts, workflows.
- 0 dependencias nuevas.
- `historial/` no retroeditado: órdenes 06 y 07 conservan `RAMA_OBJETIVO`.

## [RIESGO]

Bajo. Solo nomenclatura.

Riesgos residuales:

1. **Workflow de Trigger V1 no cambia**, pero un check ligero futuro que valide la presencia de los campos obligatorios en `inbox/orden_actual.md` tendría que listar los 5 nuevos (ya no 4). Está fuera de scope acá; queda anotado.
2. **Órdenes archivadas viejas** siguen usando `RAMA_OBJETIVO`. Cualquier herramienta que parsee `historial/` debe tolerar ambos nombres. Por ahora ninguna herramienta lo hace, así que es teórico.
3. **Convención de PR**: ahora `RAMA_DESTINO` define explícitamente la base del PR. Conviene que la Torre la respete cuando autoriza merges.
4. **Bug detectado en Trigger V1 al hacer sanity-check de este ciclo.** El script `check_cycle_closed.sh` ordena `historial/<dir>` alfabéticamente con `sort -r`. Cuando varios ciclos comparten el mismo prefijo de fecha `YYYY-MM-DD_`, el "último ciclo" reportado es el alfabéticamente posterior, no el cronológicamente posterior. Ejemplo concreto: tras cerrar este ciclo (`2026-04-25_nomenclatura-ramas`), el script muestra `último ciclo: 2026-04-25_trigger-v1` porque `t > n`. El veredicto `CICLO CERRADO` es correcto (lo que importa); solo el campo informativo del último ciclo está mal. **No lo arreglo en esta orden** — está fuera de scope (la orden es renombrar campos, no tocar el detector).

## [SIGUIENTE PASO]

Sugerencias para próximas órdenes Torre, en orden de utilidad:

1. **Arreglar bug del Trigger V1 (último ciclo)**. Reemplazar `find ... | sort -r | head -1` por un orden que respete cronología real — opciones: usar fecha de modificación (`find ... -printf '%T@ %p\n' | sort -nr`), parsear el ID de orden (`ORD-YYYY-MM-DD-NN`) del reporte archivado, o agregar timestamp completo (`YYYY-MM-DDTHHMMSS_<slug>`) en los nombres de carpeta de `historial/`.
2. **Extender el detector para validar campos obligatorios** en `inbox/orden_actual.md` cuando no está en placeholder: los 5 nuevos campos deben estar presentes. Convierte la regla dura en defensa automática vía CI.

Lo decide la Torre.

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: claude
- **Liberación al cierre confirmada**: sí
