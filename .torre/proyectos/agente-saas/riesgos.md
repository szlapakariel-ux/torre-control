# riesgos.md — Riesgos del piloto agente-saas

Riesgos detectados al modelar el piloto. No son bloqueos, pero hay que tenerlos a la vista cuando el modelo se valide y antes de habilitar `.mesa/` real en `agente-saas`.

---

## R-001 — Tarea 001 sin ACK real

**Riesgo**: Hoy 001 figura como ASIGNADA Claude Code en `.torre/mesa-compartida/`, pero **no hay** `[ACK_AGENTE]` registrado. Si el agente nunca tomó la tarea, "asignada" es ficción.
**Impacto**: Falsa sensación de progreso. La tarea puede llevar días formalmente abierta sin avance.
**Mitigación**: Cuando se habilite la mesa real, exigir ACK explícito antes de marcar como EN_PROGRESO. Mientras tanto, el estado correcto es `ABIERTA — PENDIENTE DE DIAGNÓSTICO REAL`.

## R-002 — Dependencia del scope del ejecutor

**Riesgo**: Para diagnosticar 001, el ejecutor necesita scope sobre `agente-saas` (lectura mínima de código, posiblemente logs). Si se asigna a un ejecutor sin scope, se atasca.
**Impacto**: Ciclo abierto sin posibilidad de avanzar.
**Mitigación**: Verificar scope antes de asignar. Documentar en `ejecutores_permitidos.md` de la futura `.mesa/` qué ejecutores tienen acceso real al repo.

## R-003 — Claude Code puede no estar disponible

**Riesgo**: Claude Code es el ejecutor sugerido pero puede haber cap de costo, mantenimiento, rate limit u otra restricción.
**Impacto**: Tarea bloqueada si no hay alternativa preparada.
**Mitigación**: Codex es alternativa válida con scope similar. Asignar a "ejecutor disponible con scope" en lugar de fijar nombre, salvo que la tarea exija capacidad específica.

## R-004 — Confundir mitigación con solución

**Riesgo**: El equipo (humano o IA) puede aplicar un parche puntual a recordatorios fuera de horario y declarar el caso "solucionado" sin causa raíz.
**Impacto**: El problema vuelve, posiblemente como SEV-1 con cliente afectado.
**Mitigación**: Aplicar la taxonomía de `.torre/arquitectura/modelo-mesas-locales.md` §5. Para cerrar 001 hace falta `CAUSA_RAIZ_IDENTIFICADA` + los 8 requisitos de cierre. Un PARCHE no cierra la tarea, la marca como `MITIGACION_TEMPORAL` con vencimiento.

## R-005 — Parchar recordatorios sin diagnóstico

**Riesgo**: Variante específica de R-004. Tentación de probar "subir prioridad del cron", "agregar lock", "cambiar timezone hardcoded" antes de saber qué pasa.
**Impacto**: Síntoma cambia de forma pero la causa sigue. Se introduce deuda técnica.
**Mitigación**: La tarea 001 está explícitamente como DIAGNOSTICAR. No habilitar IMPLEMENTAR hasta que haya evidencia.

## R-006 — PR viejo `data/README_COMPARTIDA.md` en agente-saas genera confusión

**Riesgo**: En el repo `agente-saas` puede existir un `data/README_COMPARTIDA.md` (modelo viejo de coordinación que precedió a Torre). Si alguien lo encuentra primero, puede tomarlo como modelo a seguir y replicar prácticas que no encajan con el modelo V0 de mesa local.
**Impacto**: Deriva del estándar; doble fuente de verdad; trabajo duplicado o contradictorio.
**Mitigación**:
- En la decisión `D-003` de [`decisiones.md`](./decisiones.md) se deja constancia de que ese documento **no es** el modelo final.
- Cuando se cree `.mesa/` en `agente-saas`, se debe documentar la relación (deprecar, migrar contenido relevante o mantener solo como histórico).
- Torre **no toca** `data/README_COMPARTIDA.md` en este PR (vive en otro repo).

## R-007 — Workflow `torre-trigger.yml` corre con cualquier cambio en `.torre/`

**Riesgo**: Este PR documental modifica archivos en `.torre/**`, lo que dispara `torre-trigger-v1` en GitHub Actions.
**Impacto**: Si los gates fallan o cambian, podría intentar invocar agentes.
**Mitigación**: Verificado en exploración previa. Los gates del Invoker exigen cambio en `.torre/inbox/orden_actual.md` (que **no** se toca en este PR). Solo correrá el detector informativo (summary en Actions UI). No hay invocación de agentes ni costos.

## R-008 — Confusión entre `mesa-compartida/` actual y `mesa-local/` futura

**Riesgo**: El repo ya tiene `.torre/mesa-compartida/` con tareas vivas. Coexiste con la nueva plantilla `.torre/templates/mesa-local/` y el piloto `.torre/proyectos/agente-saas/`.
**Impacto**: Quién lee el repo por primera vez puede no saber cuál es la fuente de verdad.
**Mitigación**:
- `mesa-compartida/` queda como modelo experimental anterior, conservado por trazabilidad (decisiones cerradas).
- `templates/mesa-local/` es la plantilla nueva replicable.
- Este piloto modela el cómo. Cuando Ariel/Torre apruebe, se ejecuta migración formal (no se hace en este PR).

## R-009 — Riesgo aceptado sin plan de contención

**Riesgo**: La decisión 33 cerrada exige que todo riesgo aceptado tenga plan de contención. Si en el camino se acepta uno (ej. "vamos sin ACK formal por ahora") sin contención, se incumple la regla.
**Impacto**: Decisión silenciosa que después es difícil revertir.
**Mitigación**: Cualquier riesgo aceptado durante la ejecución del piloto se registra en este archivo con plan de contención explícito.
