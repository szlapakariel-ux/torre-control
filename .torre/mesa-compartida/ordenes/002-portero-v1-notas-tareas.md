# Orden 002 — Portero V1 para notas y tareas

PROYECTO_FUNCIONAL: Secretaria
REPO_TECNICO: szlapakariel-ux/agente-saas

ID: 002-portero-v1-notas-tareas
FECHA: 2026-04-26
ESTADO: ABIERTA — ASIGNADA — BLOQUEADA POR 001

PROBLEMA_DE_ARIEL:
Después de resolver el tema de horarios / recordatorios, hay que terminar Portero V1 para notas y tareas. Esto ya está muy hablado: no dejarlo abierto indefinidamente, avanzar hasta cerrarlo.

CONTEXTO_ACTUAL:
En `master` / producción existe Portero legacy en `app/services/portero.py`.

Cobertura actual:

| Dominio | Cobertura | Qué hace |
|---|---:|---|
| Eventos | Completo | `analizar_entrada()` normaliza fecha, hora y entidades. |
| Cumpleaños | Completo | Usa el mismo portero para fechas. |
| Notas | Parcial | Solo normalización de fecha si aplica. |
| Tareas | Parcial | Solo normalización de fecha si aplica. |

ORDEN_GENERADA_POR_CHATGPT:
Completar el diagnóstico y cierre funcional de Portero V1 para notas y tareas, después de terminar la investigación de recordatorios / horarios.

La tarea debe revisar el estado real del Portero V1 y proponer/ejecutar, con autorización previa si toca código, el cierre de cobertura para:

1. Notas.
2. Tareas.

Debe mantener la coherencia con el comportamiento ya completo de:

1. Eventos.
2. Cumpleaños.

RESPONSABLE_ACTUAL:
Claude Code como ejecutor técnico principal sobre szlapakariel-ux/agente-saas.

Codex como colaborador técnico/revisor si hace falta segunda mirada o implementación alternativa.

AVISO_EXPLICITO_AL_RESPONSABLE:

Esta orden queda formalmente asignada. No es una nota suelta ni una idea pendiente.

Cuando la dependencia 001-recordatorios-fuera-de-horario quede cerrada o suficientemente diagnosticada, Claude Code debe tomar esta orden, revisar el repo técnico szlapakariel-ux/agente-saas y entregar diagnóstico/propuesta.

Si Claude Code no puede avanzar o detecta ambigüedad, debe reportar bloqueo explícito en la mesa compartida o en el PR correspondiente.

Codex puede intervenir como segundo agente técnico para revisar, contrastar o implementar una solución, pero no reemplaza la revisión de Torre/Ariel.

Nadie debe tratar esta orden como "no avisada". La asignación queda registrada en Torre.

BLOQUEADA_POR:
001-recordatorios-fuera-de-horario

DEPENDENCIA:
Antes de ejecutar esta orden, cerrar o dejar diagnosticado el problema `001-recordatorios-fuera-de-horario`.

ARCHIVOS_A_TOCAR:
Solo lectura inicialmente.

Archivos probables a revisar:

- `app/services/portero.py`
- servicios relacionados con notas
- servicios relacionados con tareas
- rutas o handlers que usan Portero V1
- tests existentes de portero/notas/tareas, si existen

ARCHIVOS_PROHIBIDOS:
- secrets
- variables de entorno
- configuración de producción
- deploys
- base de datos
- código fuente sin autorización posterior

CRITERIO_DE_EXITO:
La orden se considera encaminada cuando el agente entregue:

1. Diagnóstico claro del estado actual de Portero V1 para notas y tareas.
2. Brecha exacta entre legacy y V1.
3. Lista de archivos que habría que modificar.
4. Propuesta de implementación por pasos.
5. Riesgos.
6. Tests o pruebas manuales necesarias.
7. Recomendación concreta: implementar / no implementar / dividir en subórdenes.

La orden se considera cerrada cuando, con autorización de Ariel/Torre, notas y tareas queden cubiertas por Portero V1 con comportamiento consistente, probado y documentado.

RESPUESTA_DEL_AGENTE:
Pendiente.

REVISION_DE_CHATGPT:
Pendiente.

PROXIMO_RESPONSABLE:
Primero: Claude Code debe diagnosticar 001-recordatorios-fuera-de-horario.
Después: Claude Code debe diagnosticar Portero V1 en szlapakariel-ux/agente-saas.

Codex queda disponible como colaborador técnico si Torre lo deriva.

ESTADO_FINAL:
Pendiente.
