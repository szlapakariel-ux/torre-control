# Orden Torre — ORD-2026-04-25-04

- **ID**: ORD-2026-04-25-04
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **EJECUTOR**: claude

## Objetivo

Alinear los templates con la nueva regla de control de concurrencia.

## Tareas concretas

1. Modificar `.torre/templates/orden_template.md`: agregar campo obligatorio `EJECUTOR: <claude | codex | humano | otro>`.
2. Modificar `.torre/templates/reporte_template.md`: agregar sección `[EN_PROCESO_POR]` con el operador que tomó la orden y confirmación de liberación al cierre (sí/no).

## Restricciones

- No tocar `backend/` ni `frontend/`.
- No cambiar lógica.
- No agregar dependencias.

## Criterio de aceptación

- [ ] `orden_template.md` con campo `EJECUTOR` obligatorio.
- [ ] `reporte_template.md` con sección `[EN_PROCESO_POR]` (operador + confirmación de liberación).
- [ ] Reporte escrito en `.torre/outbox/reporte_actual.md`.
- [ ] `.torre/estado.md` actualizado.
- [ ] Par orden+reporte archivado en `.torre/historial/2026-04-25_actualizar-templates/`.
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
```
