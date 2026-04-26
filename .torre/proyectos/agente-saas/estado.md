# estado.md — Piloto agente-saas

Tablero de tareas modeladas para el piloto `agente-saas`. Refleja en formato V0 las dos tareas vivas hoy en `.torre/mesa-compartida/` (001 y 002).

> Para definiciones de severidad y tipo de responsabilidad, ver `.torre/arquitectura/modelo-mesas-locales.md`.
> Detalle expandido de cada tarea: [`tareas.md`](./tareas.md).

---

## Tablero

| ID | Tarea | Estado | Severidad sugerida | Responsable operativo sugerido | Tipo de responsabilidad | Bloqueada por | Próximo paso | Criterio de cierre |
|---|---|---|---|---|---|---|---|---|
| **001** | Recordatorios fuera de horario | ABIERTA — PENDIENTE DE DIAGNÓSTICO REAL | SEV-2 (SEV-1 si hay cliente afectado) | Ejecutor disponible con scope sobre `agente-saas` | DIAGNOSTICAR | — | Diagnosticar scheduler, Redis, backlog, flags de enviado, timezone y reinicios | Causa probable + evidencia + propuesta + decisión de corrección |
| **002** | Portero V1 notas/tareas | ABIERTA — BLOQUEADA POR 001 | SEV-3 (revisar al desbloquear) | Ejecutor disponible con scope sobre `agente-saas` | DIAGNOSTICAR / IMPLEMENTAR cuando se habilite | 001 | Esperar diagnóstico suficiente de 001 | Brecha legacy vs V1 documentada + plan técnico aprobado |

---

## Notas sobre severidad

- **001**: si aparece cliente afectado real (turno perdido, recordatorio que llegó a las 3 AM, queja documentada), la severidad sube a SEV-1 y la confirma Ariel/Torre. Hasta entonces se mantiene SEV-2 sugerida.
- **002**: severidad debe revisarse cuando 001 desbloquee; depende del estado del Portero V1 al momento de retomarla.

## Notas sobre responsable operativo

- Hoy ambas tareas están "ASIGNADA Claude Code" en `.torre/mesa-compartida/`. En el modelo V0, el responsable se elige por disponibilidad y capacidad (ver `.torre/templates/mesa-local/ejecutores_permitidos.md`). Si Claude Code no está disponible, Codex es alternativa válida con mismo scope.
- Cualquier ejecutor que tome la tarea debe emitir `[ACK_AGENTE]` antes de empezar.

## Origen del tablero

Estas tareas hoy viven en:

- `.torre/mesa-compartida/problemas/001-recordatorios-fuera-de-horario.md`
- `.torre/mesa-compartida/pedidos/001-tomar-diagnostico-recordatorios.md`
- `.torre/mesa-compartida/ordenes/002-portero-v1-notas-tareas.md`

El piloto **no las mueve** ni las reescribe. Solo las modela en formato V0 para validar el diseño.
