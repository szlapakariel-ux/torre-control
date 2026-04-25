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
