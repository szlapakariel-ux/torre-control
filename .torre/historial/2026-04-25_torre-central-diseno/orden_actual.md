# Orden Torre — ORD-2026-04-25-11

- **ID**: ORD-2026-04-25-11
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: claude/torre-central-multirepo (declarada en la orden; el operador trabaja en `claude/trigger-torre-mvp-rSWiS` por restricción del harness)
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude

## Objetivo

Diseñar cómo `torre-control` puede funcionar como **Torre Central** para emitir órdenes hacia otros repos (ej. `agente-saas`), sin violar la regla dura de identidad de proyecto.

## Contexto y problema

Hoy `.torre/` es repo-local. Una orden con `REPO_TECNICO=szlapakariel-ux/agente-saas` no se puede ejecutar desde `torre-control` porque rompe la regla:
> Si repo actual ≠ REPO_TECNICO → no ejecutar.

Pasó concretamente en ORD-2026-04-25-10, que cerró PARCIAL con override explícito de Torre. Este ciclo formaliza la solución.

## Tareas concretas

1. Diferenciar: Torre repo-local vs Torre central multi-repo.
2. Modelo de orden remota con campos: `REPO_ORIGEN`, `REPO_TECNICO`, `RAMA_TRABAJO`, `RAMA_DESTINO`, `EJECUTOR`, `TIPO_ORDEN: local | remota`.
3. Flujo seguro: Torre central crea → operador/trigger transporta → repo destino ejecuta con su propia `.torre/` → reporte vuelve a Torre central → ambos historiales claros.
4. Reglas duras nuevas:
   - `torre-control` NO ejecuta código de `agente-saas`.
   - `agente-saas` NO modifica `torre-control`.
   - Cada repo ejecuta solo SUS órdenes.
   - Torre central solo coordina.
5. Estructura propuesta de carpetas: `.torre/remotas/<repo>/`, `.torre/reportes-remotos/<repo>/`.

## Restricciones

- No implementar todavía.
- No tocar `backend/` ni `frontend/`.
- No agregar dependencias.
- Solo documentación y propuesta.

## Criterio de aceptación

- [ ] Documento de propuesta creado en `.torre/`.
- [ ] Cubre todas las secciones pedidas.
- [ ] Reporte escrito.
- [ ] Par archivado en `.torre/historial/2026-04-25_torre-central-diseno/`.
- [ ] Inbox y outbox en placeholder.
- [ ] `EN_PROCESO_POR: ninguno` al cerrar.
- [ ] Todo en el mismo PR.

## Formato de reporte esperado

```
[ESTADO]
[PROBLEMA DETECTADO]
[PROPUESTA TORRE CENTRAL]
[MODELO DE ORDEN REMOTA]
[FLUJO PROPUESTO]
[REGLAS DURAS]
[CAMBIOS DOCUMENTALES NECESARIOS]
[RIESGO]
[SIGUIENTE PASO]
[EN_PROCESO_POR]
```
