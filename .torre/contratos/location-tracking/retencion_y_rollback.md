# Retención y rollback — Location Tracking

## Estado actual

No hay implementación. No hay eventos reales emitidos. Este documento es **propuesta documental**, no política activa.

## Almacenamiento futuro preferido

Si un MC-LOC-2 técnico futuro se autoriza, el almacenamiento por defecto debe ser:

- **In-repo**: dentro del propio repositorio Git, no en un servicio externo.
- **Texto plano**: formato append-only en `.jsonl` o `.md` estructurado, legible humano.
- **Auditable por Git**: cada evento queda asociado a un commit y a un PR; nada se escribe "fuera de banda".
- **Sin PII**: ninguno de los campos del esquema (`esquema_evento_v1.md`) admite datos personales. Si algún evento intenta incluir PII, el sistema debe rechazarlo y abrir incidente.

Cualquier alternativa (log externo, base de datos, servicio cloud) requiere ratificación explícita de Torre y queda fuera del default.

## Ubicación tentativa

Propuesta a ratificar por Torre en `decision_pendiente_mc_loc_2.md`:

- Eventos vivos: `.torre/tracking/AAAA-MM.jsonl`
- Eventos archivados: `.torre/tracking/historial/AAAA-MM.jsonl`

Ninguna de estas rutas existe todavía y no debe crearse hasta que MC-LOC-2 técnico esté autorizado.

## Política conceptual de retención

- **Rotación mensual**: cuando el archivo del mes en curso supere un umbral (sugerido: 1 MB), o al cierre del mes calendario, se mueve a `historial/` y se inicia uno nuevo.
- **No borrado**: ningún evento se borra. Solo se archiva. Como no contiene PII, no aplica derecho de supresión.
- **Sin compactación destructiva**: nada de reescribir histórico para reducir tamaño. La append-only es regla.
- **Si aparece dato prohibido**:
  - El ciclo que generó el evento queda **bloqueado** automáticamente.
  - Se registra un **incidente** en `.torre/historial/<fecha>_incidente_location_tracking_<id>.md`.
  - El evento ofensor **no se persiste**.
  - Torre revisa antes de continuar.

## Rollback documental

Si un PR técnico introduce:

- un campo nuevo no autorizado en el esquema,
- un valor de `state` fuera del enum,
- una ruta de almacenamiento distinta a la aprobada,
- cualquier dato prohibido por `alcance.md` o `privacidad.md`,

entonces el rollback documental es **obligatorio** y consiste en:

1. **Revertir el PR** con `git revert` o `gh pr revert`, generando un nuevo commit de reversa.
2. **Bloquear MC-LOC-2 técnico** hasta corrección documental.
3. **Registrar incidente** en `.torre/historial/` con:
   - PR ofensor (número, sha)
   - Campo o regla violada
   - Acción tomada
   - Próxima condición de desbloqueo
4. **Auditoría read-only** equivalente a MC-LOC-1A antes de retomar.

## Rollback técnico (cuando exista implementación)

Cuando MC-LOC-2 técnico esté autorizado e implementado:

- Cada archivo técnico nuevo debe poder eliminarse mediante un PR de reversa simétrico (`docs(torre): rollback MC-LOC-2 — <razón>`).
- No debe haber estado externo que sobreviva al rollback (ej. tablas de base de datos, secrets en cloud).
- El esquema in-repo asegura que `git revert` deje el árbol consistente.

## Alcance de este documento

- Define **propuesta** de retención y rollback.
- **No** activa políticas operativas.
- **No** autoriza creación de `.torre/tracking/`.
- **No** habilita MC-LOC-2 técnico.

Cualquier desviación de esta propuesta debe documentarse y ratificarse antes de tocar código.
