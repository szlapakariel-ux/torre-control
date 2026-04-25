# Flujo de un ciclo

Un "ciclo" es la unidad mínima de trabajo: una orden, una ejecución, un reporte, un cierre. Todo en el mismo PR.

## Pasos

### 1. Creación de la orden

- La Torre abre o usa una rama feature (ej. `claude/<slug>-<id>`).
- La Torre escribe la orden en `.torre/inbox/orden_actual.md` partiendo de `.torre/templates/orden_template.md`.
- Mínimo obligatorio: ID, fecha, objetivo, tareas concretas, restricciones, criterio de aceptación.
- La Torre commitea y pushea la rama.

### 2. Ejecución

- El operador IA arranca en esa rama.
- Lee `.torre/inbox/orden_actual.md`.
- Si la orden está vacía, ambigua o hay placeholder, **no actúa** y se detiene.
- **Chequeo de identidad de proyecto** (obligatorio antes de tocar nada):
  1. Los siete campos obligatorios deben estar presentes en la orden: `PROYECTO_FUNCIONAL`, `REPO_TECNICO`, `RAMA_TRABAJO`, `RAMA_DESTINO`, `EJECUTOR`, `TIPO_ORDEN`, `REPO_ORIGEN`. Si falta alguno, la orden es inválida y el operador no actúa.
  2. Coherencia: si `TIPO_ORDEN: local`, debe cumplirse `REPO_ORIGEN == REPO_TECNICO`. Si `TIPO_ORDEN: remota`, debe cumplirse `REPO_ORIGEN ≠ REPO_TECNICO`. Cualquier otro caso = inválida.
  3. **Ramificación según `TIPO_ORDEN`:**
     - **`local`**:
       a. El repo actual debe coincidir con `REPO_TECNICO` (`git remote -v`). Si no, **no ejecutar**.
       b. La rama actual debe coincidir con `RAMA_TRABAJO` (`git branch --show-current`). Si no, no ejecutar hasta corregir.
       c. La identidad del operador debe coincidir con `EJECUTOR`. Si no, no ejecutar.
       d. `RAMA_DESTINO` no se verifica acá; queda como metadato para enrutar el PR al cierre.
     - **`remota`**:
       a. El repo actual debe coincidir con `REPO_ORIGEN` (la Torre Central). Si no, no ejecutar.
       b. La identidad del operador debe coincidir con `EJECUTOR`.
       c. El operador **no ejecuta el contenido** de la orden — hace transporte (ver "Flujo de orden remota").
- Si la orden es válida, ejecuta SOLO lo pedido. Sin scope creep, sin refactors colaterales, sin features extra.
- Las tareas que la orden no pide explícitamente, no se hacen.

### 3. Reporte

- El operador escribe `.torre/outbox/reporte_actual.md` siguiendo `.torre/templates/reporte_template.md`.
- Secciones obligatorias: `[ESTADO]`, `[ARCHIVOS CREADOS]`, `[CÓMO SE USA]`, `[DIFF RESUMIDO]`, `[RIESGO]`, `[SIGUIENTE PASO]`. Otras secciones según pida la orden.
- El reporte describe qué se hizo y qué riesgo queda. No describe pasos internos del operador.

### 4. Actualización de estado

- El operador actualiza `.torre/estado.md`:
  - última orden cerrada (ID),
  - operador,
  - branch,
  - referencia al archivo en `historial/`,
  - si hay orden activa o no,
  - bloqueos.

### 5. Cierre y archivado

- El operador crea `.torre/historial/<YYYY-MM-DD>_<slug>/` y copia ahí:
  - `orden_actual.md`
  - `reporte_actual.md`
- El operador deja `.torre/inbox/orden_actual.md` y `.torre/outbox/reporte_actual.md` en placeholder ("sin orden activa" / "sin reporte activo").
- El operador commitea y pushea.

### 6. Cierre del PR

- Todo lo anterior va en el MISMO PR. No se permite un PR separado solo para limpieza/archivado.
- El PR se considera completo cuando:
  - ejecución terminada,
  - reporte escrito,
  - par archivado en `historial/`,
  - inbox/outbox en placeholder.

### 7. Stop

- El operador no inicia ningún trabajo nuevo. Espera a que la Torre publique la próxima orden en `inbox/`.

## Flujo de orden remota

Aplica solo cuando la orden tiene `TIPO_ORDEN: remota`. El repo emisor (típicamente `torre-control`) actúa como Torre Central; el repo receptor ejecuta normalmente cuando la orden le llega.

### En la Torre Central (repo emisor, ej. `torre-control`)

1. **Recepción**: Torre escribe la orden remota en `.torre/inbox/orden_actual.md` con `TIPO_ORDEN: remota`, `REPO_ORIGEN: <repo de la Torre Central>`, `REPO_TECNICO: <repo destino>`.
2. **Detección**: el operador local lee la orden y detecta `TIPO_ORDEN: remota`. **No ejecuta el contenido** de las tareas.
3. **Transporte de salida**: el operador mueve la orden a `.torre/remotas/<repo-destino-slug>/orden_<ID>.md`. El nombre del archivo lleva el ID completo de la orden.
4. **Cierre del ciclo de emisión**: el operador escribe un reporte en `outbox/reporte_actual.md` que dice "orden remota encolada para transporte hacia `<destino>`", actualiza `estado.md`, y archiva el par en `.torre/historial/remoto_<fecha>_<slug>/`. Libera el lock.

### Transporte propiamente dicho

5. **Publicación en el destino** (manual en MVP): alguien con acceso a ambos repos copia el contenido de `.torre/remotas/<destino>/orden_<ID>.md` al archivo `<destino>/.torre/inbox/orden_actual.md`. Para el repo destino aparece como orden local: su `REPO_TECNICO` coincide con su repo, así que el chequeo dura local pasa. La cola en la Torre Central queda con la orden archivada como evidencia de qué se transportó.

### En el repo destino (ej. `agente-saas`)

6. **Ejecución local**: el operador en el repo destino ejecuta la orden siguiendo el flujo local de 7 pasos. Cierra ciclo y archiva en su propio `historial/`.

### Vuelta del reporte a la Torre Central

7. **Copia del reporte**: alguien (humano o agente con multi-repo) copia el reporte cerrado del repo destino a `<torre-central>/.torre/reportes-remotos/<repo-slug>/reporte_<ID>.md`. Es una **copia** (snapshot, no canon); el reporte canónico vive en el `historial/` del repo destino.
8. **Cierre del ciclo remoto en la Torre Central**: un nuevo ciclo en la Central (puede ser el mismo operador, otra orden Torre, o un trigger automatizado en el futuro) toma el reporte recibido, lo copia a `historial/remoto_<fecha>_<slug>/reporte_actual.md` (donde ya está la orden emitida), actualiza `estado.md` reduciendo `ORDENES_REMOTAS_EN_VUELO`, y deja el ciclo remoto cerrado del lado de la Central.

### Lo que NO hace este flujo

- No automatiza el transporte. V1 es manual.
- No notifica al destino cuando llega una orden encolada.
- No detecta si el destino ya cerró su ciclo.
- No verifica firma / autenticidad de la orden.

Todo eso es V2 / iteraciones posteriores.

## Control de concurrencia

Cuando hay más de un operador IA disponible (Claude Code, Codex, otros), el flujo se modifica para evitar colisiones:

- **Asignación en la orden.** Toda orden lleva un campo `EJECUTOR` con el identificador del operador asignado (ej. `claude`, `codex`). Sin ese campo, la orden es inválida.
- **Una orden = un ejecutor.** Solo el operador cuyo identificador coincide con `EJECUTOR` debe actuar. Cualquier otro operador que lea la orden se detiene.
- **Toma de la orden.** Antes de modificar archivos, el operador asignado actualiza `.torre/estado.md` poniendo `EN_PROCESO_POR: <su_id>`. Eso señala el ciclo como tomado.
- **Estado durante la ejecución.** Mientras `EN_PROCESO_POR` no sea `ninguno`, los demás operadores tratan el sistema como ocupado y no inician nada nuevo, incluso si la `inbox` queda con una orden distinta.
- **Liberación al cierre.** Al cerrar el ciclo, junto con vaciar la `inbox` y archivar, el operador setea `EN_PROCESO_POR: ninguno`.
- **Empate al tomar.** Si dos operadores tratan de tomar la misma orden a la vez, el conflicto se resuelve por el merge: el primero que mergea su PR es el que ejecutó; el segundo se encuentra `inbox` en placeholder y no actúa.

## Ejemplo real: ORD-20260425-01

Primer ciclo del sistema. Sirve como referencia concreta.

- **Orden**: instalar el sistema postal `.torre/` (carpetas, `protocolo.md`, templates, `estado.md`, `README.md`).
- **Operador**: Claude Code.
- **Branch**: `claude/trigger-torre-mvp-rSWiS`.
- **Ejecución**:
  - Creó `.torre/{inbox,outbox,historial,templates}/`.
  - Escribió `protocolo.md`, `README.md`, `estado.md`, dos templates.
  - Cero cambios en `backend/` o `frontend/`.
  - Cero dependencias nuevas.
- **Reporte**: `[ESTADO]=OK`, lista de archivos creados, qué incluía el protocolo, cómo usarlo, diff resumido, riesgo bajo, sugerencia de siguiente paso (definir mecánica de cierre de ciclo).
- **Cierre**: cuando se formalizó la regla de cierre en el mismo PR, el operador:
  - copió `orden_actual.md` y `reporte_actual.md` a `.torre/historial/2026-04-25_instalacion-sistema-postal/`,
  - dejó inbox y outbox en placeholder,
  - actualizó `estado.md` con `Orden activa: NO`.
- **Resultado**: ciclo cerrado, sistema postal listo para recibir la próxima orden.

Cualquier ciclo posterior debería verse igual estructuralmente, sin importar el dominio del trabajo.
