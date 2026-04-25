# Orden Torre — ORD-2026-04-25-10

- **ID**: ORD-2026-04-25-10
- **Fecha**: 2026-04-25
- **Emisor**: Torre (autorización explícita en chat, repetida dos veces)
- **PROYECTO_FUNCIONAL**: Secretaria IA
- **REPO_TECNICO**: szlapakariel-ux/agente-saas
- **RAMA_TRABAJO**: claude/portero-v1-diagnostico
- **RAMA_DESTINO**: master
- **EJECUTOR**: claude

> **Nota crítica**: esta orden viola la regla dura de "Identidad de proyecto" del protocolo (`REPO_TECNICO ≠ repo actual`). Torre autorizó explícitamente el override en chat, dos veces. Se procede con esa autorización pero con `[ESTADO] = PARCIAL`: el operador no tiene acceso al código de `agente-saas` desde la sesión actual (atada a `torre-control`). Detalles en el reporte.

## Objetivo

Diagnosticar el estado real del Portero V1 en `agente-saas` y definir el plan de cierre **sin escribir código**.

## Tareas concretas

1. Mapear el flujo actual: `webhook → agent_service → agent_intents_service → intents → módulos`.
2. Detectar:
   - dónde se interpreta lenguaje fuera del Portero,
   - dónde hay duplicación de lógica,
   - qué módulos todavía "piensan".
3. Producir mapa con secciones: `[FLUJO ACTUAL]`, `[PORTERO V1 YA IMPLEMENTADO]`, `[LOGICA FUERA DEL PORTERO]`, `[MODULOS CONTAMINADOS]`.
4. Plan de cierre V1 por dominio (notas, tareas, cumpleaños, eventos): qué eliminar, qué mover al Portero, qué adaptar al Decision DTO.

## Restricciones

- No escribir código.
- No crear PR en `agente-saas`.
- No mergear.
- No tocar producción.
- No implementar V2.

## Salida esperada

```
[ESTADO]
[FLUJO ACTUAL]
[BRECHAS DE PORTERO]
[PLAN DE CIERRE V1]
[ORDEN DE EJECUCIÓN]
[RIESGO]
[SIGUIENTE PASO]
```

## Limitación operativa conocida

El operador ejecuta desde `torre-control`. No puede leer archivos de `agente-saas`. Lo que se puede entregar acá es un **framework** de diagnóstico (qué buscar, dónde buscarlo, qué preguntas responder, plan de cierre por dominio basado en patrones conocidos de proyectos similares y en la información recibida de Torre en mensajes anteriores de esta misma sesión). El diagnóstico real con archivos concretos requiere ejecutar el ciclo en `agente-saas`.
