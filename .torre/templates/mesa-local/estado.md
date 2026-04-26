# estado.md — Tablero de mesa local

Tablero genérico de tareas activas de la mesa local. Una fila por tarea abierta. Las tareas cerradas se mueven a `revisiones/` con su sign-off.

> Para definiciones de severidad, tipo de responsabilidad y criterios de cierre, ver `.torre/arquitectura/modelo-mesas-locales.md`.

---

## Tablero

| ID | Tarea | Estado | Severidad | Responsable operativo | Tipo de responsabilidad | Bloqueada por | Próximo paso | Criterio de cierre |
|---|---|---|---|---|---|---|---|---|
| _ej. 001_ | _ej. Diagnosticar X_ | _ABIERTA / EN_PROGRESO / BLOQUEADA / CIERRE_VALIDABLE / CIERRE_RECHAZADO_ | _SEV-1..4_ | _ej. Claude Code_ | _DIAGNOSTICAR / IMPLEMENTAR / REVISAR / APROBAR / OBSERVAR_ | _otro ID o "—"_ | _siguiente acción concreta_ | _qué hace falta para cerrar_ |

---

## Convenciones

- **ID**: numeración correlativa local, en orden de aparición.
- **Estado**: alguno de los siguientes:
  - `ABIERTA` (creada, sin ACK).
  - `EN_PROGRESO` (con ACK, en ejecución).
  - `BLOQUEADA` (depende de algo externo o de otra tarea).
  - `CIERRE_VALIDABLE` (cumple los 8 requisitos, falta validación de Torre/Ariel).
  - `CIERRE_RECHAZADO` (cierre intentado pero rechazado; reabrir).
- **Severidad**: ver `.torre/arquitectura/modelo-mesas-locales.md` §4.
- **Tipo de responsabilidad**: registra qué se le pide al ejecutor — diagnosticar, implementar, revisar, aprobar u observar. No registra culpa.
- **Bloqueada por**: ID de otra tarea o nombre breve del bloqueante. `—` si no hay.
- **Próximo paso**: una acción concreta y verificable, no un objetivo vago.
- **Criterio de cierre**: qué evidencia debe existir para mover la tarea a `revisiones/`.

---

## Mantenimiento

- Cuando una tarea cambia de estado, se actualiza la fila en el mismo PR.
- Cuando se cierra, se mueve el cuerpo a `revisiones/` con sign-off y se marca `CIERRE_VALIDABLE` hasta que Torre/Ariel valide según severidad.
- Cambios de severidad usan el formato `[CAMBIO_SEVERIDAD]` y quedan en el expediente de la tarea, no acá.
