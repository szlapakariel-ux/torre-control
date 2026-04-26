# tareas.md — Detalle de tareas piloto agente-saas

Detalle expandido de las tareas modeladas para el piloto. Cada tarea incluye problema, objetivo, contexto, archivos sugeridos, restricciones, entregable y criterio de cierre.

> **Importante**: Torre **no toca** los archivos sugeridos en este PR. Quedan registrados como referencia para el ejecutor que trabaje dentro de `agente-saas` cuando se autorice.

---

## 001 — Recordatorios fuera de horario

### Problema
Recordatorios automáticos llegan fuera de la ventana de horario esperada por el cliente. No se sabe todavía si la causa es scheduler, cola Redis, backlog, flags de "ya enviado", timezone, reinicios del worker u otra cosa.

### Objetivo
Identificar causa raíz con evidencia. **No** aplicar parche sin diagnóstico.

### Contexto
- Proyecto funcional: Secretaria.
- Repo técnico: `szlapakariel-ux/agente-saas`.
- Severidad sugerida: SEV-2. Si se confirma cliente afectado real (turno perdido, recordatorio nocturno), sube a SEV-1 y la confirma Ariel/Torre.
- Hoy registrado en `.torre/mesa-compartida/problemas/001-recordatorios-fuera-de-horario.md` y pedido de diagnóstico en `.torre/mesa-compartida/pedidos/001-tomar-diagnostico-recordatorios.md`.

### Archivos sugeridos a inspeccionar (referencia, no editar desde Torre)

> Estos archivos viven en `agente-saas`. Torre **no los toca** en este PR. Sirven solo como mapa para el ejecutor cuando se asigne la tarea con scope sobre el repo.

- `app/services/reminder_service.py` — lógica de envío de recordatorios.
- `app/cron/runner.py` — scheduler que dispara los jobs.
- `app/services/timezone_service.py` — conversión de horarios cliente / servidor.
- `diagnostico_recordatorios.py` — eventual script de diagnóstico (puede no existir todavía).

Cualquier otro archivo relevante que el ejecutor descubra debe registrarlo en `[FIN_AGENTE]`.

### Restricciones
- **Diagnóstico primero.** No se aplican fixes en este ciclo.
- No tocar secrets, env vars, base de datos productiva ni datos reales.
- No mergear nada en `agente-saas` sin autorización de Ariel/Torre.
- Distinguir explícitamente PARCHE / MITIGACION_TEMPORAL / SOLUCION_PROPUESTA en cualquier propuesta posterior (ver `.torre/arquitectura/modelo-mesas-locales.md` §5).
- Si el diagnóstico revela datos sensibles (PII, mensajes a clientes), reportar antes de continuar.

### Entregable esperado
1. Reporte de diagnóstico en `revisiones/` con:
   - Hipótesis evaluadas.
   - Evidencia recolectada (logs, queries, configs leídas, no modificadas).
   - Causa raíz probable o posibles si hay ambigüedad.
   - Propuesta de corrección clasificada (PARCHE / MITIGACION_TEMPORAL / SOLUCION_PROPUESTA).
   - Riesgos restantes.
2. `[FIN_AGENTE]` correctamente formateado en una línea propia.
3. Issue o entrada en `revisiones/` lista para revisión de Torre.

### Criterio de cierre
- Causa raíz identificada **con evidencia** (no especulación).
- Propuesta de corrección con clasificación clara.
- Decisión de Ariel/Torre sobre cómo proceder (aplicar fix, postergar, escalar a SEV-1, etc.).
- Si se decide postergar, registrar como `MITIGACION_TEMPORAL` con vencimiento.

---

## 002 — Portero V1 notas/tareas

### Problema
Existe Portero legacy y se diseñó Portero V1. La brecha funcional entre ambos no está documentada con suficiente detalle para implementar V1 sin romper flujos existentes (notas, tareas, integraciones).

### Objetivo
Documentar la brecha legacy vs V1 y producir un plan técnico aprobable.

### Contexto
- Proyecto funcional: Secretaria.
- Repo técnico: `szlapakariel-ux/agente-saas`.
- **Bloqueada por 001**: si los recordatorios aún tienen causa raíz desconocida, encarar el Portero V1 puede introducir más cambios que oculten o compliquen el diagnóstico de 001.
- Hoy registrado en `.torre/mesa-compartida/ordenes/002-portero-v1-notas-tareas.md`.

### Restricciones
- **No comenzar implementación** hasta que 001 esté cerrada o desbloqueada explícitamente por Ariel/Torre.
- Tarea de diagnóstico documental primero, implementación después en ciclo separado.
- Misma regla de no tocar producción / secrets / DB / datos reales.

### Entregable esperado
Cuando 001 desbloquee:
1. Documento de brecha legacy vs V1 con tablas de comportamiento esperado.
2. Plan técnico con pasos concretos, riesgos, criterio de éxito.
3. Decisión de Ariel/Torre sobre alcance y orden de implementación.

### Criterio de cierre (de la fase de diagnóstico)
- Brecha documentada con evidencia.
- Plan técnico aprobado por Ariel/Torre.
- Severidad reevaluada al momento de desbloquear (puede haber cambiado el contexto).

### Archivos sugeridos a inspeccionar (referencia, no editar desde Torre)

> A definir cuando se tome la tarea. Hoy aún no hay mapa cerrado de archivos del Portero V1 vs legacy. El ejecutor debe explorar y reportar antes de proponer cambios.
