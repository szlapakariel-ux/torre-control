# `.torre/` — Sistema Postal de la Torre

Carpeta-buzón compartida entre la Torre (humano que dirige) y los operadores IA (Claude Code, Codex, etc.). GitHub es el centro postal: todo pasa por commits.

## Estructura

```
.torre/
  protocolo.md            reglas operativas del ciclo
  estado.md               estado del último ciclo cerrado
  README.md               este archivo
  inbox/
    orden_actual.md       la orden activa que el operador debe leer
  outbox/
    reporte_actual.md     el reporte del operador del ciclo en curso
  historial/              pares orden+reporte ya cerrados (inmutable)
  templates/
    orden_template.md     formato de orden
    reporte_template.md   formato de reporte
```

## Flujo en una línea

`Torre escribe orden → Operador IA ejecuta → Operador escribe reporte → Estado actualizado → Operador para`.

## Para la Torre

1. Editar `.torre/inbox/orden_actual.md` partiendo del template.
2. Commitear y pushear.
3. Lanzar al operador (manualmente, por ahora).
4. Cuando vuelva, leer `.torre/outbox/reporte_actual.md` y `estado.md`.

## Para el operador IA

1. Leer `.torre/inbox/orden_actual.md`.
2. Ejecutar SOLO lo pedido. Si la orden está vacía o ambigua, no actuar.
3. Escribir `.torre/outbox/reporte_actual.md` con las secciones obligatorias.
4. Actualizar `.torre/estado.md`.
5. Archivar el par en `.torre/historial/<YYYY-MM-DD>_<slug>/` al cerrar el ciclo.
6. Detenerse. No iniciar nada nuevo sin nueva orden.

Reglas completas en [`protocolo.md`](./protocolo.md).

## Lo que este MVP NO hace todavía

- No conecta APIs.
- No dispara agentes automáticamente.
- No valida formato con CI.
- No notifica al humano.

Esas piezas vienen después. Esto es la cañería postal — la automatización viene encima.
