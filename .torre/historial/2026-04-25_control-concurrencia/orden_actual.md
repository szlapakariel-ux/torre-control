# Orden Torre — ORD-2026-04-25-03

- **ID**: ORD-2026-04-25-03
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **Operador asignado**: Claude Code (campo EJECUTOR: claude)

## Objetivo

Evitar ejecución duplicada. Preparar el sistema para coordinar múltiples operadores IA sin que se pisen entre sí.

## Tareas concretas

Agregar sección **"Control de concurrencia"** en:

1. `.torre/protocolo.md`
2. `.torre/flujo.md`
3. `.torre/roles.md`

Contenido a cubrir:

- **Una orden = un ejecutor.** Cada orden la toma exactamente un operador IA.
- **Campo obligatorio `EJECUTOR`** en la orden, identifica al operador asignado.
- **Campo `EN_PROCESO_POR`** en `.torre/estado.md`, dice quién (si alguien) está ejecutando ahora.
- **Regla:** si un operador lee la orden y no es el ejecutor designado, no ejecuta.

## Restricciones

- No tocar `backend/` ni `frontend/`.
- No cambiar la estructura de carpetas existente.
- Solo documentación (más actualización de `estado.md` para incluir el campo).
- No agregar dependencias.

## Criterio de aceptación

- [ ] Sección "Control de concurrencia" en `protocolo.md`.
- [ ] Sección "Control de concurrencia" en `flujo.md`.
- [ ] Sección "Control de concurrencia" en `roles.md`.
- [ ] Campo `EN_PROCESO_POR` presente en `.torre/estado.md`.
- [ ] Reporte escrito en `.torre/outbox/reporte_actual.md`.
- [ ] Par orden+reporte archivado en `.torre/historial/2026-04-25_control-concurrencia/`.
- [ ] Inbox y outbox en placeholder al cerrar.
- [ ] Todo en el mismo PR.

## Salida esperada

Sistema preparado para multi-agente sin colisiones.
