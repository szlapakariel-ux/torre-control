# Pedido 001 — Tomar diagnóstico de recordatorios

PROYECTO_FUNCIONAL: Secretaria
REPO_TECNICO: szlapakariel-ux/agente-saas

ID: pedido-001-tomar-diagnostico-recordatorios
FECHA: 2026-04-26
ESTADO: PEDIDO_FORMAL — PENDIENTE_DE_EJECUTOR

TAREA_RELACIONADA:
001-recordatorios-fuera-de-horario

OBJETIVO:
Solicitar a una sesión de Claude Code con scope real sobre `szlapakariel-ux/agente-saas` que tome la tarea 001 y realice diagnóstico técnico.

CONTEXTO:
La mesa compartida central vive en `szlapakariel-ux/torre-control`.

La tarea 001 ya está registrada en:

.torre/mesa-compartida/problemas/001-recordatorios-fuera-de-horario.md

El repo técnico real es:

szlapakariel-ux/agente-saas

Esta sesión de Torre no debe fingir ejecución ni escribir [FIN_AGENTE] sin trabajo real.

RESPONSABLE_SOLICITADO:
Claude Code con acceso operativo a `szlapakariel-ux/agente-saas`.

TRABAJO_SOLICITADO:
Diagnosticar por qué los recordatorios no llegan siempre a horario.

Revisar en `agente-saas`:

- app/services/reminder_service.py
- app/cron/runner.py
- app/services/timezone_service.py
- diagnostico_recordatorios.py
- logs relevantes si están disponibles

ENTREGABLE_ESPERADO:
El ejecutor debe entregar:

1. causa probable,
2. evidencia en código o logs,
3. si hace falta correr diagnóstico en Railway,
4. riesgos,
5. propuesta de corrección,
6. próximos pasos.

CONDICION_DE_CIERRE:
Solo cuando el ejecutor real haya trabajado la tarea debe reportar con:

[FIN_AGENTE]

Ese reporte debe incluir:

- TAREA:
- AGENTE:
- ESTADO:
- QUÉ HICE:
- ARCHIVOS REVISADOS:
- PR / COMMIT, si aplica:
- TESTS / DIAGNÓSTICO:
- BLOQUEOS:
- PRÓXIMO PASO:

IMPORTANTE:
Sin [FIN_AGENTE] real, Torre no debe considerar terminada la tarea.

PROXIMO_RESPONSABLE:
Claude Code con scope sobre `szlapakariel-ux/agente-saas`.

ESTADO_FINAL:
Pendiente.
