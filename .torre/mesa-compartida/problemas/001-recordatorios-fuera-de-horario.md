PROYECTO_FUNCIONAL: Secretaria
REPO_TECNICO: szlapakariel-ux/agente-saas

ID: 001-recordatorios-fuera-de-horario
FECHA: 2026-04-26
ESTADO: ABIERTA — ASIGNADA

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

RESPONSABLE_ACTUAL:
Claude Code como ejecutor técnico principal sobre `szlapakariel-ux/agente-saas`.
Codex como colaborador técnico/revisor si hace falta segunda mirada.

PROXIMO_RESPONSABLE:
Claude Code debe diagnosticar scheduler, Redis, backlog, flags de enviado y timezone en `szlapakariel-ux/agente-saas`.

ARCHIVOS_A_TOCAR:
Solo lectura inicialmente.

ARCHIVOS_RELEVANTES:
- app/services/reminder_service.py
- app/cron/runner.py
- app/services/timezone_service.py
- diagnostico_recordatorios.py

ARCHIVOS_PROHIBIDOS:
- secrets
- variables de entorno
- configuración de producción
- deploys
- base de datos
- código fuente sin autorización posterior

RESPUESTA_DEL_AGENTE:
Pendiente.

REVISION_DE_CHATGPT:
Pendiente.

ESTADO_FINAL:
Pendiente.
