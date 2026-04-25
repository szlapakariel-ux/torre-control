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

## Repo central / Repo destino

Roles opcionales que un repo puede asumir cuando se usan **órdenes remotas** (ver `protocolo.md`, sección "Órdenes remotas"). Estos roles son **independientes** de los anteriores: un repo puede ser "Repo central" y a la vez seguir ejecutando órdenes locales propias.

### Repo central — coordina, no ejecuta cross-repo

- Es el repo donde Torre redacta órdenes destinadas a otros repos. Por defecto es `torre-control`, pero cualquier repo con `.torre/` instalado puede asumir el rol.
- Al recibir una orden con `TIPO_ORDEN: remota`, su operador local **no ejecuta el contenido** — hace transporte (mover a `remotas/<destino>/`) y archiva en `historial/remoto_*/`.
- Mantiene la cola de órdenes encoladas en `.torre/remotas/<destino-slug>/` y la bandeja de reportes recibidos en `.torre/reportes-remotos/<destino-slug>/`.
- **No tiene permisos** para modificar el código de los repos destino. Solo redacta y archiva.

### Repo destino — ejecuta lo que le llega como local

- Es cualquier repo con `.torre/` instalado que recibe órdenes desde una Torre Central.
- Cuando una orden remota es transportada a su `inbox/orden_actual.md`, **la ve como orden local**: su `REPO_TECNICO` coincide con su repo, el chequeo dura local pasa, ejecuta normalmente.
- Cierra el ciclo y archiva en su propio `historial/`. El reporte canónico vive ahí.
- **No modifica** la Torre Central. Si el reporte tiene que volver, lo hace por copia (PR cross-repo, fork, fetch o pegado manual).

### Reglas de coexistencia

- Un mismo repo puede ser, simultáneamente:
  - Repo-local (ejecuta sus órdenes locales).
  - Repo central (emite remotas hacia otros).
  - Repo destino (recibe remotas desde otros).
- Esos tres roles **conviven** sin pisarse, porque los archivos viven en directorios distintos: `inbox/` y `outbox/` para órdenes locales en curso; `remotas/` para emisiones de salida; `reportes-remotos/` para entradas externas.

## Control de concurrencia

Cuando hay más de un operador IA disponible, los roles tienen obligaciones extra:

### Torre

- Asigna el ejecutor al emitir la orden, mediante el campo `EJECUTOR` (ej. `EJECUTOR: claude`, `EJECUTOR: codex`).
- Declara la identidad de proyecto en la orden mediante `PROYECTO_FUNCIONAL`, `REPO_TECNICO`, `RAMA_TRABAJO` y `RAMA_DESTINO` (ver `protocolo.md`, sección "Identidad de proyecto").
- Declara el tipo de orden y origen mediante `TIPO_ORDEN` (`local` | `remota`) y `REPO_ORIGEN`. Para órdenes locales, `REPO_ORIGEN == REPO_TECNICO`. Para remotas (cross-repo), `REPO_ORIGEN` apunta a la Torre Central que la emite.
- No emite una orden sin esos siete campos: una orden incompleta es inválida.
- No reasigna ejecutor a mitad de un ciclo. Si quiere cambiar de operador, cierra el ciclo actual y emite una orden nueva.

### Operador IA

- Antes de actuar, **verifica identidad de proyecto** (ver `protocolo.md`, sección "Identidad de proyecto"):
  - Los siete campos obligatorios deben estar en la orden: `PROYECTO_FUNCIONAL`, `REPO_TECNICO`, `RAMA_TRABAJO`, `RAMA_DESTINO`, `EJECUTOR`, `TIPO_ORDEN`, `REPO_ORIGEN`.
  - Coherencia: `TIPO_ORDEN: local` ⇒ `REPO_ORIGEN == REPO_TECNICO`; `TIPO_ORDEN: remota` ⇒ `REPO_ORIGEN ≠ REPO_TECNICO`.
  - **Para `TIPO_ORDEN: local`**: el repo actual debe coincidir con `REPO_TECNICO`; la rama actual debe coincidir con `RAMA_TRABAJO`; su identidad debe coincidir con `EJECUTOR`. Si algo falla, **no ejecuta**, no toma el lock, no modifica archivos. `RAMA_DESTINO` no se verifica en runtime; se usa al abrir el PR.
  - **Para `TIPO_ORDEN: remota`**: el repo actual debe coincidir con `REPO_ORIGEN` (la Torre Central); su identidad debe coincidir con `EJECUTOR`. Hace **transporte**, no ejecuta el contenido (ver `flujo.md`, sección "Flujo de orden remota").
- Antes de modificar archivos, marca el ciclo como tomado: setea `EN_PROCESO_POR: <su_id>` en `.torre/estado.md`.
- Mientras `EN_PROCESO_POR` apunte a otro operador, no inicia ningún trabajo, aunque haya una orden visible en la `inbox`.
- Al cerrar el ciclo, libera el lock: `EN_PROCESO_POR: ninguno`.

### Repo

- Es el árbitro del lock. El estado del lock vive en `.torre/estado.md`, y como cualquier otro archivo del repo se sincroniza por commits y merges.
- Si dos operadores intentan tomar el mismo ciclo, el conflicto se resuelve a nivel git (gana el primer merge).

### Ariel

- No participa del lock operativo.
- Interviene si dos operadores quedan trabados (ambos creen tener el ciclo, o ninguno lo toma) y la Torre necesita desempate humano.

Regla general: **una orden = un ejecutor**. Cualquier operador que no sea el `EJECUTOR` designado, no ejecuta.

### Liberación de lock huérfano

Cuando `EN_PROCESO_POR` queda apuntando a un operador que ya no está ejecutando (caída, sesión cerrada, cierre parcial), el lock está huérfano. Quién puede liberarlo:

- **Torre**: autoridad principal. Liberación manual editando `.torre/estado.md`.
- **Ariel**: solo si la Torre está ausente y el lock bloquea trabajo crítico (rol "alto impacto").
- **Operador IA**: NO libera locks que apuntan a otros operadores. Solo puede liberar el propio si confirma que el ciclo no quedó en curso.

El MVP no libera automáticamente. Detalle completo en `protocolo.md`, sección "Control de concurrencia" → "Lock huérfano".
