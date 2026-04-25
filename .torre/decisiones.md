# Decisiones de diseño

Por qué la Torre está hecha así y no de otra forma. Cada decisión está atada a un problema concreto que evita.

## Por qué GitHub como centro postal

Alternativas consideradas implícitamente: chat (Slack, Discord), un dashboard propio, una base de datos, mensajes directos al agente.

Se eligió el repositorio Git porque:

- **Cero infraestructura nueva.** El repo ya existe, ya se versiona, ya se replica.
- **Historial inmutable.** `git log` es un audit trail gratis. Quién emitió qué orden, cuándo, en qué rama.
- **Diffs revisables.** Cada orden y cada reporte son texto plano con diff. Se puede revisar como cualquier cambio de código.
- **Una sola fuente de verdad.** El estado del sistema es el contenido actual de `.torre/`. No hay copias en chats que se desincronicen.
- **Acceso uniforme.** Web, CLI, IDE, agentes IA — todos hablan Git.
- **Branches como aislamiento natural.** Cada ciclo vive en su rama; los ciclos no se pisan.

Lo que se pierde: notificaciones en tiempo real. La Torre tiene que volver y mirar el repo. Aceptable: el MVP no busca tiempo real, busca eliminar el cartero humano.

## Por qué una orden por ciclo

Alternativa: dejar al operador encadenar varias tareas o "hacer todo lo que tenga sentido".

Se eligió una orden por ciclo porque:

- **Acota el alcance.** El operador IA tiende a expandir el trabajo si se lo permite. Una orden = un PR = un punto de revisión.
- **Hace el cierre limpio.** Si la unidad es chica, el reporte es chico, el archivado es trivial.
- **Reduce el costo de error.** Si algo sale mal, se descarta un ciclo, no una semana de trabajo encadenado.
- **Evita decisiones implícitas.** Cada cambio de dirección requiere una orden nueva escrita por la Torre. No hay deriva.
- **Hace la responsabilidad clara.** Lo que se hizo está exactamente en la orden. Lo que no está en la orden, no se hizo (y si se hizo, es bug del operador).

Lo que se pierde: throughput aparente. En la práctica se gana, porque no se acumulan reportes a medias.

## Por qué cierre en el mismo PR

Alternativa considerada: PR de ejecución + PR separado de "limpieza/archivado".

Se eligió mismo PR porque:

- **Atómico.** Si el PR mergea, el ciclo está cerrado de verdad. Si no mergea, no quedó orden activa colgada en `inbox/`.
- **Evita estados intermedios contaminados.** Sin esta regla, `main` podía tener una orden ya ejecutada todavía sentada en `inbox/orden_actual.md`, lo cual confunde a cualquier operador que llegue después.
- **Una sola revisión humana.** Un solo PR para revisar contiene todo el ciclo. No hay que cazar dos PRs por ciclo.
- **Hace imposible olvidarse de archivar.** El archivado es parte del criterio de aceptación del PR, no un paso opcional posterior.

Lo que se pierde: el PR queda un poco más grande. Aceptable: el archivado son dos copias de archivos y una limpieza de placeholders, no agrega ruido real.

## Qué problemas evita este diseño

- **Cartero humano cuello de botella.** El humano intermedio no es necesario para transportar mensajes.
- **Contexto perdido entre saltos.** El contexto vive en el commit y el archivo, no en la memoria de un humano.
- **Órdenes ambiguas o verbales.** Solo cuenta lo escrito en `inbox/orden_actual.md`. Si no está ahí, no existe.
- **Scope creep silencioso.** El operador ejecuta exactamente lo escrito. Cualquier extra requiere orden nueva.
- **Doble ejecución.** Al cerrar el ciclo el inbox queda en placeholder, así que un operador que llegue después no re-ejecuta lo ya hecho.
- **Estado oculto.** `estado.md` siempre dice cuál es la situación. No hay que reconstruirla preguntando.
- **Pérdida de trazabilidad.** `historial/` guarda el par orden+reporte de cada ciclo, inmutable.
- **Discrepancia entre canales.** El repo es la única fuente de verdad — no hay segunda copia que desincronizar.

<!-- Nota de validación V1.2 (rama descartable, no mergear). -->
