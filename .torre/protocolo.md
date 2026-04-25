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

## Cierre de ciclo

Al finalizar un ciclo, el operador:

1. Copia `orden_actual.md` y `reporte_actual.md` a `.torre/historial/<YYYY-MM-DD>_<slug>/`.
2. Vacía `orden_actual.md` (deja placeholder "sin orden activa").
3. Vacía `reporte_actual.md` (deja placeholder "sin reporte activo").
4. Actualiza `estado.md`.

## Lo que el MVP NO hace todavía

- No conecta APIs.
- No dispara agentes automáticamente.
- No valida órdenes con CI.
- No notifica a la Torre — la Torre vuelve y mira el repo.

Esas piezas vienen en una etapa posterior.
