# Protocolo Torre — Sistema Postal MVP

GitHub es el centro postal. La Torre (humano) deja órdenes, un operador IA las ejecuta y deja reporte. No hay automatización todavía: el ciclo se dispara manualmente.

## Roles

- **Torre**: emite órdenes. Única autoridad para iniciar trabajo.
- **Operador IA**: ejecuta UNA orden por ciclo (Claude Code, Codex u otro agente).
- **Repositorio**: buzón compartido. Todo pasa por commits.

## Flujo de un ciclo

1. Torre escribe la orden en `.torre/inbox/orden_actual.md` y commitea.
2. Operador IA lee `orden_actual.md`.
3. Operador ejecuta SOLO lo pedido. Sin scope creep.
4. Operador escribe el reporte en `.torre/outbox/reporte_actual.md`.
5. Operador actualiza `.torre/estado.md` con el nuevo estado del sistema.
6. Operador archiva el par orden+reporte cerrado en `.torre/historial/<timestamp>_<slug>/`.
7. Operador se detiene. No avanza sin nueva orden.

## Reglas operativas

- **Una orden por ciclo.** Si la orden contiene varios objetivos, se ejecuta lo escrito; no se infieren extras.
- **No avanzar sin orden.** Sin orden activa válida, el operador no toca código.
- **Sin scope creep.** No refactorizar, no "mejorar de paso", no agregar features colaterales.
- **Sin dependencias nuevas** salvo que la orden lo pida explícitamente.
- **Sin tocar frontend/backend** salvo que la orden lo requiera.
- **Reporte obligatorio.** Toda orden ejecutada debe terminar con `reporte_actual.md` actualizado.
- **Estado siempre fresco.** `estado.md` refleja el último ciclo cerrado.
- **Historial inmutable.** Lo archivado en `.torre/historial/` no se reescribe.

## Formato de orden

Ver `.torre/templates/orden_template.md`. Mínimo: ID, fecha, objetivo, restricciones, criterio de aceptación.

## Formato de reporte

Ver `.torre/templates/reporte_template.md`. Secciones obligatorias:

```
[ESTADO]
[ARCHIVOS CREADOS]
[QUÉ INCLUYE EL PROTOCOLO]   (solo si aplica)
[CÓMO SE USA]
[DIFF RESUMIDO]
[RIESGO]
[SIGUIENTE PASO]
```

## Cierre de ciclo (regla obligatoria)

El cierre de cada orden se hace en el MISMO PR que la ejecución. Pasos:

1. Ejecutar la orden completa.
2. Escribir el reporte en `.torre/outbox/reporte_actual.md`.
3. Actualizar `.torre/estado.md`.
4. Archivar en `.torre/historial/<YYYY-MM-DD>_<slug>/`:
   - `orden_actual.md`
   - `reporte_actual.md`
5. Dejar placeholders en:
   - `.torre/inbox/orden_actual.md`
   - `.torre/outbox/reporte_actual.md`
6. Todo lo anterior va en el MISMO PR.
7. El PR solo se considera completo cuando:
   - ejecución terminada
   - reporte completo
   - archivos archivados en `historial/`
   - inbox limpio (placeholder)

### Restricciones de cierre

- **No** crear PR separado para limpieza/archivado.
- **No** dejar órdenes activas en `inbox/` al cerrar.
- **No** ejecutar más de una orden por ciclo.
- **No** avanzar sin nueva orden de Torre.

## Control de concurrencia

El sistema soporta múltiples operadores IA (Claude Code, Codex, otros). Para que no se pisen entre sí:

- **Una orden = un ejecutor.** Cada orden la toma exactamente un operador. No se ejecuta una orden "a dos manos".
- **Campo `EJECUTOR` obligatorio en la orden.** Identifica al operador asignado (ej. `EJECUTOR: claude`, `EJECUTOR: codex`). Sin `EJECUTOR`, la orden es inválida y nadie ejecuta.
- **Campo `EN_PROCESO_POR` en `estado.md`.** Indica quién está ejecutando AHORA. Vale `ninguno` si no hay ciclo activo, o el identificador del operador en curso.
- **Regla del ejecutor.** Si un operador lee `inbox/orden_actual.md` y el campo `EJECUTOR` no coincide con su identidad, **no ejecuta**. Se detiene en silencio.
- **Toma de la orden.** Antes de ejecutar, el operador asignado actualiza `estado.md` poniendo `EN_PROCESO_POR: <su_id>`. Esto y la ejecución pueden ir en commits separados dentro del mismo PR.
- **Liberación.** Al cerrar el ciclo, `EN_PROCESO_POR` vuelve a `ninguno`.
- **Conflictos.** Si dos operadores intentan tomar la misma orden simultáneamente, gana el primero que mergea su PR; el otro se encuentra inbox en placeholder y no ejecuta.

## Lo que el MVP NO hace todavía

- No conecta APIs.
- No dispara agentes automáticamente.
- No valida órdenes con CI.
- No notifica a la Torre — la Torre vuelve y mira el repo.

Esas piezas vienen en una etapa posterior.
