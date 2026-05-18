# Modo demo / test — Location Tracking

## Naturaleza

Este documento describe **cómo debería probarse** un eventual MC-LOC-2 técnico de location tracking, **sin tocar producción ni datos reales**. No describe código existente. No autoriza implementación.

## Reglas generales

1. **Datos ficticios obligatorios.** Todo evento de prueba debe usar valores claramente ficticios:
   - `project: "demo-project"`
   - `repo: "demo-owner/demo-repo"`
   - `branch: "demo-branch"`
   - `microcycle: "MC-DEMO-1"`
   - `agent: "humano:demo"`
   - timestamps fijos o de prueba, no `now()` de producción.
2. **Modo demo por defecto.** El componente que emita eventos debe arrancar en `MODE=demo`. Cualquier modo distinto (`MODE=real`) requiere flag explícito y orden por escrito.
3. **Fail-closed.** Si el evento no valida contra `esquema_evento_v1.md`, no se escribe. No hay "best effort". No hay degradación silenciosa.
4. **Aislamiento.** En modo demo, la escritura debe ir a una ruta separada (ej. `.torre/tracking/demo/`), nunca a la ruta operativa.
5. **Idempotencia.** Repetir el mismo evento de prueba no debe duplicar líneas ni romper el archivo. Si la fuente quiere registrar dos veces, debe variar al menos un campo significativo (típicamente `timestamp`).

## Prohibiciones explícitas durante test

Durante cualquier prueba de MC-LOC-2:

- Prohibido tocar producción.
- Prohibido leer o escribir secrets.
- Prohibido modificar workflows de CI/CD.
- Prohibido crear endpoints HTTP o RPC.
- Prohibido agregar SDKs o dependencias externas para "facilitar el test".
- Prohibido recolectar ubicación real (GPS, IP, geocoding) ni siquiera como "valor de prueba".
- Prohibido usar nombres, emails o identificadores reales de personas físicas, ni siquiera placeholder.

## Evidencia mínima exigida

Antes de abrir un PR técnico de MC-LOC-2, la orden debe acompañarse de evidencia de:

1. **Evento de muestra** que valide correctamente contra el esquema (caso happy-path).
2. **Validación de esquema** ejecutable: una prueba que tome el evento y devuelva `ok`/`error`.
3. **Prueba de rechazo de campo prohibido**: el evento con un campo no autorizado (ej. `ip: "1.2.3.4"`) debe ser rechazado.
4. **Prueba de rechazo de `state` inválido**: `state: "foo"` debe ser rechazado.
5. **Prueba de timestamp inválido**: `timestamp: "ayer a las cinco"` debe ser rechazado; `timestamp: "2026-05-18 16:00:00"` (sin `Z`) también.
6. **Prueba de detección de PII**: un evento con email/teléfono/nombre real en `next_action` debe ser rechazado.
7. **Prueba de fail-closed**: cuando la validación falla, ninguna línea se escribe en el archivo destino.
8. **Prueba de aislamiento demo**: en `MODE=demo`, ninguna escritura toca la ruta operativa.

Cada prueba debe ser reproducible localmente y no depender de la red.

## Salida esperada del test

Las pruebas deben producir, mínimamente:

- Un resumen `ok`/`fail` por caso.
- En caso de `fail`, el motivo legible (campo, valor, regla).
- Cero efectos colaterales fuera de la ruta `.torre/tracking/demo/` (o equivalente).

## Alcance de este documento

- Define el contrato de prueba **antes** de existir implementación.
- **No** crea scripts de prueba.
- **No** crea archivos de tracking de demo.
- **No** habilita MC-LOC-2 técnico.

Cualquier MC-LOC-2 técnico que se proponga deberá demostrar el cumplimiento de cada punto de la "evidencia mínima exigida" antes de pedir merge.
