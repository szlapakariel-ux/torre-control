# Orden Torre — ORD-2026-04-25-08

- **ID**: ORD-2026-04-25-08
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: claude/trigger-torre-mvp-rSWiS
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude

> Esta orden estrena los campos `RAMA_TRABAJO` y `RAMA_DESTINO` en reemplazo de `RAMA_OBJETIVO` (legacy, retirado a partir de este ciclo).

## Objetivo

Eliminar la ambigüedad de `RAMA_OBJETIVO`. Reemplazarlo por dos campos explícitos:

- `RAMA_TRABAJO`: rama donde el operador desarrolla y commitea.
- `RAMA_DESTINO`: rama donde el trabajo va a aterrizar eventualmente (típicamente `main`).

## Contexto

En ORD-2026-04-25-07 (Trigger V1) se evidenció el problema: la orden declaró `RAMA_OBJETIVO: main` pero el operador trabajó en `claude/trigger-torre-mvp-rSWiS`. La regla dura ("la rama actual debe coincidir con `RAMA_OBJETIVO`") se interpretó como "destino eventual", lo cual contradice la regla literal. Separar los campos cierra el hueco: el operador verifica solo la rama de trabajo; el destino es metadato informativo para el PR.

## Tareas concretas

1. Actualizar `.torre/protocolo.md` (sección "Identidad de proyecto") para listar los 5 campos obligatorios actuales y reescribir la "Regla dura: chequeo de repo" usando `RAMA_TRABAJO`. Aclarar que `RAMA_DESTINO` no se verifica en runtime (es informativo).
2. Actualizar `.torre/templates/orden_template.md` reemplazando la línea `RAMA_OBJETIVO` por las dos nuevas.
3. Actualizar `.torre/flujo.md` (sub-checklist en paso 2 "Ejecución").
4. Actualizar `.torre/roles.md` (obligaciones de Torre y Operador IA).
5. Actualizar el placeholder de `.torre/inbox/orden_actual.md` para mencionar los nuevos campos.
6. Actualizar el bloque "Próximo trigger esperado" en `.torre/estado.md`.

## Restricciones

- No tocar `backend/` ni `frontend/`.
- No agregar dependencias.
- No retroeditar órdenes archivadas (`historial/` es inmutable; quedan con `RAMA_OBJETIVO` como artefactos de su época).
- El detector `check_cycle_closed.sh` y el workflow no requieren cambios (no usan `RAMA_OBJETIVO`).

## Criterio de aceptación

- [ ] `protocolo.md` con los 5 campos listados y regla dura reescrita.
- [ ] `orden_template.md` con `RAMA_TRABAJO` + `RAMA_DESTINO`, sin `RAMA_OBJETIVO`.
- [ ] `flujo.md` con sub-checklist actualizado.
- [ ] `roles.md` con obligaciones actualizadas.
- [ ] Placeholders mencionan los nuevos campos.
- [ ] Reporte escrito.
- [ ] Par archivado en `.torre/historial/2026-04-25_nomenclatura-ramas/`.
- [ ] Inbox y outbox en placeholder al cerrar.
- [ ] `EN_PROCESO_POR: ninguno` al cerrar.
- [ ] Todo en el mismo PR.

## Formato de reporte esperado

```
[ESTADO]
[ARCHIVOS MODIFICADOS]
[CAMBIO REALIZADO]
[DIFF RESUMIDO]
[RIESGO]
[SIGUIENTE PASO]
[EN_PROCESO_POR]
```
