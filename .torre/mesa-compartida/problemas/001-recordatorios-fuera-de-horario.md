PROYECTO_FUNCIONAL: Recordatorios de Torre Control
REPO_TECNICO: szlapakariel-ux/agente-saas

## Problema

Los recordatorios no siempre llegan a horario. Algunos se pierden o se retrasan significativamente.

## Contexto

- Ariel debe recibir recordatorios puntuales sobre tareas pendientes
- El sistema de recordatorios está integrado en el agente-saas
- Los recordatorios deben respetarse en horarios configurables
- Hay inconsistencias en la entrega

## Síntomas observados

- Recordatorios llegan tarde (minutos u horas después de lo previsto)
- Algunos recordatorios desaparecen sin notificación
- No hay visibilidad sobre qué pasó con los recordatorios fallidos

## Criterio de éxito

El sistema debe:
1. Entregar recordatorios dentro de ±1 minuto de la hora programada
2. Registrar el estado de cada recordatorio (enviado/fallido)
3. Reintentar automáticamente si hay fallos
4. Notificar a Ariel si un recordatorio no se puede entregar

## Notas

- Empezar con diagnosticar el sistema de recordatorios actual
- Revisar logs para encontrar patrones de fallo
- No modificar la lógica de negocio, solo asegurar entrega confiable
