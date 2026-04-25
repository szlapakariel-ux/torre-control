# Orden Torre — ORD-2026-04-25-09

- **ID**: ORD-2026-04-25-09
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: claude/trigger-torre-mvp-rSWiS
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude

## Objetivo

Corregir el bug menor del Trigger V1 detectado en el sanity-check de ORD-2026-04-25-08: el campo "último ciclo" se ordena alfabéticamente y elige el ciclo equivocado cuando varios comparten el prefijo de fecha.

## Contexto

`check_cycle_closed.sh` usa `find ... | sort -r | head -1` para encontrar el último ciclo archivado. Con varios `2026-04-25_<slug>` en `historial/`, el ganador es el alfabéticamente posterior (`trigger-v1`), no el cronológicamente posterior (`nomenclatura-ramas`). El veredicto `CICLO CERRADO` es correcto; solo la diagnóstica está mal y puede confundir a operadores.

## Tareas concretas

1. Modificar `.torre/scripts/check_cycle_closed.sh` para ordenar `historial/<dir>` por timestamp del commit más reciente que tocó cada uno (`git log -1 --format=%ct -- <dir>`), no alfabético.
2. Mantener fallback razonable si `git log` falla para algún dir (timestamp 0, queda al final).
3. Verificar localmente que el script reporta el último ciclo correcto (post-corrección debe mostrar `2026-04-25_nomenclatura-ramas` como último, no `2026-04-25_trigger-v1`).
4. Actualizar `.torre/trigger.md` para reflejar la nueva lógica de ordenamiento.

## Restricciones

- No tocar `backend/` ni `frontend/`.
- No agregar dependencias.
- No tocar el workflow YAML salvo que sea estrictamente necesario.
- Solo el detector y su documentación.
- Si la corrección requiere reorganizar `historial/`, **no** hacerlo: `historial/` es inmutable.

## Recomendación técnica

Usar timestamp/mtime real (descarte filesystem `mtime` por fragilidad en clones; preferencia por `git log` commit timestamp).

## Criterio de aceptación

- [ ] `check_cycle_closed.sh` ordena por commit timestamp.
- [ ] Test local: `CICLO CERRADO` con `último ciclo: 2026-04-25_nomenclatura-ramas` o el más reciente real.
- [ ] `trigger.md` documenta el cambio.
- [ ] Reporte escrito.
- [ ] Par archivado en `.torre/historial/2026-04-25_fix-trigger-ultimo-ciclo/`.
- [ ] Inbox y outbox en placeholder.
- [ ] `EN_PROCESO_POR: ninguno` al cerrar.
- [ ] Todo en el mismo PR.

## Formato de reporte esperado

```
[ESTADO]
[ARCHIVOS MODIFICADOS]
[CAMBIO REALIZADO]
[VERIFICACIÓN]
[DIFF RESUMIDO]
[RIESGO]
[SIGUIENTE PASO]
[EN_PROCESO_POR]
```
