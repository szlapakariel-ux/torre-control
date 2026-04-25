# Orden Torre — ORD-20260425-01

- **ID**: ORD-20260425-01
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **Operador asignado**: Claude Code

## Objetivo

Dejar instalado el sistema postal `.torre/` para coordinar Torre ↔ operadores IA vía GitHub.

## Contexto

Ariel actuaba como cartero manual entre Torre, Claude Code y Codex. El MVP convierte el repo en buzón compartido: órdenes en `inbox/`, reportes en `outbox/`, estado en `estado.md`, archivo en `historial/`.

## Tareas concretas

1. Crear estructura de carpetas `.torre/{inbox,outbox,historial,templates}`.
2. Escribir `protocolo.md` con reglas operativas del ciclo.
3. Crear template de orden y template de reporte.
4. Crear `estado.md` inicial.
5. Crear `README.md` corto que explique el flujo.

## Restricciones

- No conectar APIs.
- No ejecutar agentes automáticamente.
- No agregar dependencias.
- No tocar frontend/backend salvo que sea estrictamente necesario.
- No modificar lógica de la app.

## Criterio de aceptación

- [x] Estructura `.torre/` creada.
- [x] `protocolo.md` con reglas operativas claras.
- [x] Templates de orden y reporte presentes.
- [x] `estado.md` inicial.
- [x] `README.md` explicando el flujo.
- [x] Reporte escrito en `.torre/outbox/reporte_actual.md`.
- [x] Branch `claude/trigger-torre-mvp-rSWiS` con commit y push.

## Formato de reporte esperado

```
[ESTADO]
[ARCHIVOS CREADOS]
[QUÉ INCLUYE EL PROTOCOLO]
[CÓMO SE USA]
[DIFF RESUMIDO]
[RIESGO]
[SIGUIENTE PASO]
```
