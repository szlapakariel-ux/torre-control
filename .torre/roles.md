# Roles

Cuatro roles. Cada uno con autoridad y responsabilidad acotadas. La separación es lo que hace que el sistema no se contamine.

## Torre — decide

- Única autoridad para iniciar trabajo.
- Define qué se hace, con qué restricciones y cuál es el criterio de aceptación.
- Escribe órdenes en `.torre/inbox/orden_actual.md`.
- Lee reportes en `.torre/outbox/reporte_actual.md` y `.torre/estado.md`.
- Decide cuándo se pasa al siguiente ciclo.

La Torre **no ejecuta código**. Si la Torre quiere algo hecho, lo encarga.

## Operador IA — ejecuta

- Claude Code, Codex u otro agente designado por la orden.
- Lee la orden activa.
- Ejecuta SOLO lo pedido. Nada más.
- Escribe el reporte y actualiza el estado.
- Archiva el ciclo y deja inbox/outbox en placeholder.
- Se detiene. No inicia nada nuevo sin nueva orden.

El operador **no decide alcance**. Si la orden es ambigua, lo dice en el reporte y se detiene; no completa por iniciativa propia.

## Repo — fuente de verdad

- El repositorio Git es el único canal oficial entre Torre y operador.
- Lo que está commiteado es lo que vale. Lo que está en chats, mails o docs externos no cuenta.
- El estado del sistema = `git log` + contenido actual de `.torre/`.
- Cualquier discrepancia entre canales se resuelve a favor del repo.

El repo **no opina ni interpreta**. Es transporte y archivo.

## Ariel — interviene en alto impacto

- No es operador del ciclo a ciclo (justamente la Torre existe para liberarlo de eso).
- Interviene cuando:
  - Una decisión arquitectónica afecta múltiples ciclos.
  - Hay un bloqueo que el operador no puede resolver siguiendo la orden.
  - Hay riesgo alto: datos en producción, seguridad, costos, decisiones irreversibles.
  - La Torre necesita una segunda opinión humana antes de emitir una orden grande.
- Su intervención queda registrada en el reporte (sección `[RIESGO]` o `[SIGUIENTE PASO]`) o en el commit message.

Ariel **no es cartero**. No traduce órdenes ni transporta mensajes. Si la Torre puede escribir la orden directamente, lo hace ella.
