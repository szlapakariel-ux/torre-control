# Estado de mesa compartida — Torre de Control

Este archivo funciona como tablero mínimo de seguimiento.

Si una tarea está acá, no puede considerarse “no avisada”.

| ID | Tarea | Estado | Responsable | Repo técnico | Bloqueada por | Próximo paso | Criterio de cierre |
|---|---|---|---|---|---|---|---|
| 001 | Recordatorios fuera de horario | ABIERTA — ASIGNADA | Claude Code | szlapakariel-ux/agente-saas | - | Diagnosticar scheduler, Redis, backlog, flags de enviado y timezone | Causa identificada + propuesta de corrección + PR técnico o decisión documentada |
| 002 | Portero V1 notas y tareas | ABIERTA — ASIGNADA — BLOQUEADA | Claude Code / Codex | szlapakariel-ux/agente-saas | 001 | Esperar cierre o diagnóstico suficiente de 001; luego diagnosticar brecha Portero legacy vs V1 | Notas y tareas cubiertas por Portero V1 o plan técnico aprobado |

## Regla de seguimiento

Toda tarea debe tener:

- responsable,
- próximo paso,
- criterio de cierre,
- estado actualizado.

Si una tarea no puede avanzar, el responsable debe dejar un bloqueo explícito.
