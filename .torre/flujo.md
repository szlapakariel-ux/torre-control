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
  1. `PROYECTO_FUNCIONAL`, `REPO_TECNICO`, `RAMA_TRABAJO`, `RAMA_DESTINO` y `EJECUTOR` deben estar presentes en la orden. Si falta alguno, la orden es inválida y el operador no actúa.
  2. El repo actual debe coincidir con `REPO_TECNICO` (`git remote -v`). Si no coincide, **no ejecutar**.
  3. La rama actual debe coincidir con `RAMA_TRABAJO` (`git branch --show-current`). Si no, no ejecutar hasta corregir el contexto.
  4. La identidad del operador debe coincidir con `EJECUTOR`. Si no, no ejecutar.
  5. `RAMA_DESTINO` no se verifica acá: queda como metadato para enrutar el PR al cierre del ciclo.
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
