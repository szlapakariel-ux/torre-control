# Decisiones pendientes — MC-LOC-2 técnico

## Propósito

Este documento concentra las decisiones humanas que **Ariel y Torre** deben tomar por escrito antes de que se pueda abrir un microciclo técnico (MC-LOC-2) de location tracking.

Mientras este documento esté abierto, **MC-LOC-2 técnico NO está habilitado**.

## Decisiones pendientes

### 1. Almacenamiento definitivo
Opciones:
- **A. In-repo, texto plano, append-only** (default propuesto en `retencion_y_rollback.md`).
- B. Externo (servicio, base, log centralizado).
- C. Híbrido (in-repo para auditoría, externo para consumo).

Ariel/Torre debe elegir y dejarlo escrito. Sin decisión, MC-LOC-2 queda bloqueado.

### 2. Granularidad del evento
Opciones:
- A. Un evento por **microciclo** (apertura + cierre).
- B. Un evento por **paso** dentro del microciclo.
- C. Un evento por **commit**.
- D. Un evento por **transición de `state`**.

Cada opción cambia volumen, costo de auditoría y riesgo de ruido. Decisión obligatoria.

### 3. Quién emite el evento
Opciones:
- A. El **agente** directamente (claude-code, codex, etc.).
- B. Un **wrapper** o invoker que envuelve al agente.
- C. Un **hook** de git/CLI.
- D. El **humano operador** vía comando manual.

Importante para responsabilidad y reproducibilidad.

### 4. Quién consume el evento
Opciones:
- A. Solo **lectura humana** por parte de Torre/Ariel.
- B. Un **agregador documental** que reescribe `.torre/estado.md`.
- C. Un **dashboard** externo (queda fuera del default in-repo).
- D. Combinación, especificar cuál.

Si se elige cualquier consumidor automatizado, debe diseñarse documentalmente antes del código.

### 5. Lista cerrada de archivos técnicos autorizados
Pendiente. MC-LOC-2 no puede abrirse sin esta lista. La lista debe enumerar paths exactos (no globs amplios) que el microciclo técnico puede crear o modificar.

Ejemplo de formato esperado:
```
- .torre/tracking/AAAA-MM.jsonl                 (datos operativos del mes en curso)
- .torre/tracking/historial/AAAA-MM.jsonl       (archivo histórico)
- .torre/tracking/demo/<fixture>.jsonl          (datos de prueba)
- .torre/scripts/tracking/<script>              (si aplica, requiere autorización separada)
```

La inclusión de scripts requiere autorización doble, ya que toca la zona `.torre/scripts/`.

### 6. Política final de retención
Confirmar o ajustar lo propuesto en `retencion_y_rollback.md`:
- Rotación mensual SÍ/NO.
- Umbral de tamaño.
- Archivado en `historial/` SÍ/NO.
- Regla de no-borrado SÍ/NO.

### 7. Modo demo / test aprobado
Confirmar o ajustar lo propuesto en `modo_demo_test.md`:
- Modo demo por defecto SÍ/NO.
- Aislamiento de escritura SÍ/NO.
- Lista de pruebas mínimas SÍ/NO.

### 8. Rollback aprobado
Confirmar o ajustar lo propuesto en `retencion_y_rollback.md`:
- Reversa por PR de rollback SÍ/NO.
- Registro obligatorio de incidente SÍ/NO.
- Auditoría read-only previa a retomar SÍ/NO.

### 9. Confirmación de exclusiones
Re-ratificar por escrito en la orden de apertura de MC-LOC-2:
- Producción fuera.
- Ubicación real fuera.
- Secrets fuera.
- Workflows fuera.
- Endpoints fuera.
- SDKs externos fuera.
- PII fuera.

## Dictamen

- **MC-LOC-2 técnico sigue NO habilitado.**
- Este documento existe para que la decisión humana pueda tomarse con todos los frentes a la vista, sin presión de tiempo y sin saltearse ningún punto.
- **MC-LOC-2B** (este microciclo) crea el contrato extendido necesario pero no abre ningún frente técnico.
- La próxima orden de Torre debería ser:
  - **MC-LOC-2C** (documental): cerrar las 9 decisiones pendientes con respuestas por escrito en este mismo documento o en `decisiones.md`,
  - o **MC-LOC-2-CONGELADO**: si Torre decide no avanzar, dejar el contrato como hito documental y cerrar el frente.

Hasta entonces, ninguna implementación es legítima.
