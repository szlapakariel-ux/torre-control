# Protocolo Torre — Sistema Postal MVP

GitHub es el centro postal. La Torre (humano) deja órdenes, un operador IA las ejecuta y deja reporte. No hay automatización todavía: el ciclo se dispara manualmente.

## Roles

- **Torre**: emite órdenes. Única autoridad para iniciar trabajo.
- **Operador IA**: ejecuta UNA orden por ciclo (Claude Code, Codex u otro agente).
- **Repositorio**: buzón compartido. Todo pasa por commits.

## Flujo de un ciclo

1. Torre escribe la orden en `.torre/inbox/orden_actual.md` y commitea.
2. Operador IA lee `orden_actual.md`.
3. Operador ejecuta SOLO lo pedido. Sin scope creep.
4. Operador escribe el reporte en `.torre/outbox/reporte_actual.md`.
5. Operador actualiza `.torre/estado.md` con el nuevo estado del sistema.
6. Operador archiva el par orden+reporte cerrado en `.torre/historial/<timestamp>_<slug>/`.
7. Operador se detiene. No avanza sin nueva orden.

## Reglas operativas

- **Una orden por ciclo.** Si la orden contiene varios objetivos, se ejecuta lo escrito; no se infieren extras.
- **No avanzar sin orden.** Sin orden activa válida, el operador no toca código.
- **Sin scope creep.** No refactorizar, no "mejorar de paso", no agregar features colaterales.
- **Sin dependencias nuevas** salvo que la orden lo pida explícitamente.
- **Sin tocar frontend/backend** salvo que la orden lo requiera.
- **Reporte obligatorio.** Toda orden ejecutada debe terminar con `reporte_actual.md` actualizado.
- **Estado siempre fresco.** `estado.md` refleja el último ciclo cerrado.
- **Historial inmutable.** Lo archivado en `.torre/historial/` no se reescribe.

## Formato de orden

Ver `.torre/templates/orden_template.md`. Mínimo: ID, fecha, objetivo, restricciones, criterio de aceptación.

## Formato de reporte

Ver `.torre/templates/reporte_template.md`. Secciones obligatorias:

```
[ESTADO]
[ARCHIVOS CREADOS]
[QUÉ INCLUYE EL PROTOCOLO]   (solo si aplica)
[CÓMO SE USA]
[DIFF RESUMIDO]
[RIESGO]
[SIGUIENTE PASO]
```

## Cierre de ciclo (regla obligatoria)

El cierre de cada orden se hace en el MISMO PR que la ejecución. Pasos:

1. Ejecutar la orden completa.
2. Escribir el reporte en `.torre/outbox/reporte_actual.md`.
3. Actualizar `.torre/estado.md`.
4. Archivar en `.torre/historial/<YYYY-MM-DD>_<slug>/`:
   - `orden_actual.md`
   - `reporte_actual.md`
5. Dejar placeholders en:
   - `.torre/inbox/orden_actual.md`
   - `.torre/outbox/reporte_actual.md`
6. Todo lo anterior va en el MISMO PR.
7. El PR solo se considera completo cuando:
   - ejecución terminada
   - reporte completo
   - archivos archivados en `historial/`
   - inbox limpio (placeholder)

### Restricciones de cierre

- **No** crear PR separado para limpieza/archivado.
- **No** dejar órdenes activas en `inbox/` al cerrar.
- **No** ejecutar más de una orden por ciclo.
- **No** avanzar sin nueva orden de Torre.

## Identidad de proyecto

El nombre funcional del proyecto (ej. "Torre de Control", "Secretaria IA") no coincide siempre con el slug técnico del repo (`torre-control`, `agente-saas`). Una orden que solo dice el nombre funcional puede terminar ejecutándose en el repo equivocado.

Para evitar eso, **toda orden** debe llevar al frente siete campos obligatorios:

- `PROYECTO_FUNCIONAL`: nombre humano del proyecto (ej. `Torre de Control`).
- `REPO_TECNICO`: slug exacto `<owner>/<repo>` en GitHub donde el trabajo se ejecuta (ej. `szlapakariel-ux/torre-control`).
- `RAMA_TRABAJO`: rama donde el operador desarrolla y commitea (ej. `claude/<feature>`). El operador debe estar parado en esta rama para ejecutar.
- `RAMA_DESTINO`: rama donde el trabajo va a aterrizar eventualmente (típicamente `main`). Es metadato informativo para enrutar el PR; no se verifica en runtime.
- `EJECUTOR`: identificador del operador asignado (ver "Control de concurrencia").
- `TIPO_ORDEN`: `local` | `remota`. Default `local` si no se declara, por retro-compatibilidad. Una orden `remota` se emite desde una Torre Central hacia un repo destino (ver "Órdenes remotas").
- `REPO_ORIGEN`: repo donde la orden fue **emitida**. Para `TIPO_ORDEN: local`, vale lo mismo que `REPO_TECNICO`. Para `TIPO_ORDEN: remota`, apunta a la Torre Central que la emite.

Si falta cualquiera de estos campos, la orden es **inválida** y nadie ejecuta.

Reglas de coherencia:
- Una orden `remota` con `REPO_ORIGEN == REPO_TECNICO` es inválida (debería ser local).
- Una orden `local` con `REPO_ORIGEN ≠ REPO_TECNICO` es inválida.

> Nota histórica: hasta ORD-2026-04-25-07 se usaba un único campo `RAMA_OBJETIVO`, ambiguo entre "rama de trabajo" y "rama destino". Hasta ORD-2026-04-25-11 las órdenes no llevaban `TIPO_ORDEN` ni `REPO_ORIGEN`. Las órdenes archivadas en `historial/` previas a cada cambio se interpretan implícitamente: `local` y `REPO_ORIGEN == REPO_TECNICO`. No se retroeditan.

### Regla dura: chequeo de repo (solo órdenes locales)

Para órdenes con `TIPO_ORDEN: local`, antes de modificar ningún archivo, el operador asignado verifica:

1. Que el repositorio actual coincide con `REPO_TECNICO` (típicamente con `git remote -v`).
2. Que la rama actual coincide con `RAMA_TRABAJO` (con `git branch --show-current`).
3. Que su identidad coincide con `EJECUTOR`.

`RAMA_DESTINO` **no** se verifica en runtime. Se usa al abrir el PR para indicar la base.

**Si el repo actual no coincide con `REPO_TECNICO`, el operador NO ejecuta la orden.** Se detiene, no toca archivos, no toma el lock. Reportar en chat al humano que la orden parece dirigida a otro repo es aceptable; ejecutar "asumiendo que es lo mismo" no.

El mismo criterio aplica a `RAMA_TRABAJO`: si el operador está en otra rama, no ejecuta hasta corregir el contexto.

Para órdenes con `TIPO_ORDEN: remota`, este chequeo dura **no se aplica al repo actual** (ese es justamente el punto: la orden está dirigida a otro repo). En su lugar, el operador verifica que está en el repo `REPO_ORIGEN` (para poder hacer transporte) y procede según el flujo de la sección "Órdenes remotas".

## Órdenes remotas

Mecanismo para que una **Torre Central** (típicamente `torre-control`) emita órdenes hacia otros repos sin violar la regla dura de identidad de proyecto. Ver `torre_central_propuesta.md` para el contexto del diseño.

### Conceptos

- **Repo-local**: cada repo (incluyendo `torre-control`) ejecuta sus propias órdenes locales con su `.torre/` operativo. Sin cambios respecto al protocolo previo.
- **Torre Central**: rol opcional que puede asumir un repo (`torre-control` por defecto). Coordina órdenes destinadas a otros repos: las **emite, encola, transporta y archiva**. NO ejecuta el contenido de esas órdenes.

Ambos roles conviven en el mismo repo.

### Estructura de carpetas extendida

```
.torre/
  inbox/orden_actual.md          # solo orden LOCAL en curso
  outbox/reporte_actual.md       # solo reporte LOCAL en curso
  remotas/                       # cola de órdenes remotas pendientes de transporte
    <repo-slug>/                 # ej. agente-saas/
      orden_<ID>.md
  reportes-remotos/              # reportes que vinieron de vuelta del destino
    <repo-slug>/
      reporte_<ID>.md
  historial/
    <fecha>_<slug>/              # ciclos LOCALES
    remoto_<fecha>_<slug>/       # ciclos remotos: orden emitida + reporte recibido
```

### Flujo de una orden remota (7 pasos)

1. **Torre redacta** orden remota en `torre-control/.torre/inbox/orden_actual.md` con `TIPO_ORDEN: remota`, `REPO_ORIGEN: torre-control`, `REPO_TECNICO: <destino>`.
2. **Operador local lee** la orden, detecta `TIPO_ORDEN: remota`, **no ejecuta el contenido**.
3. **Operador hace transporte de salida**: mueve la orden a `.torre/remotas/<repo-slug>/orden_<ID>.md`. Cierra el ciclo de **emisión** con un reporte que dice "orden remota encolada para transporte". Archiva en `.torre/historial/remoto_<fecha>_<slug>/` con `orden_actual.md` (la orden tal cual se emitió). Libera el lock.
4. **Transporte propiamente dicho** (manual en MVP, automatizable después): el contenido de la orden encolada se publica en `<repo-destino>/.torre/inbox/orden_actual.md`. Para el repo destino aparece como orden **local** (su `REPO_TECNICO` coincide con su repo).
5. **Operador en repo destino ejecuta** la orden con sus reglas locales. Chequeo dura local pasa naturalmente. Cierra ciclo y archiva en su propio `historial/`.
6. **Reporte vuelve** a Torre Central como copia (PR cross-repo, fork, fetch o pegado manual). Aterriza en `torre-control/.torre/reportes-remotos/<repo-slug>/reporte_<ID>.md`.
7. **Torre Central completa** el ciclo remoto: copia el reporte recibido a `historial/remoto_<fecha>_<slug>/reporte_actual.md`, actualiza `estado.md`, cierra.

### Reglas duras de órdenes remotas

1. La Torre Central **no ejecuta** código de los repos destino. Solo emite, encola, transporta, archiva.
2. Los repos destino **no modifican** la Torre Central. Solo ejecutan lo que llega a su `inbox/`.
3. Cada repo ejecuta solo sus órdenes locales. La regla dura de identidad sigue intacta y se aplica en cada destino.
4. Torre Central **solo coordina**. No interpreta el contenido de las órdenes remotas, solo verifica forma.
5. **Override de Torre deja de ser necesario** para cross-repo: el patrón es `TIPO_ORDEN: remota`, no excepción ad-hoc.
6. **Transporte explícito**: nunca ejecución remota directa. Siempre cola + repo destino. Limita el blast radius.

## Control de concurrencia

## Control de concurrencia

El sistema soporta múltiples operadores IA (Claude Code, Codex, otros). Para que no se pisen entre sí:

- **Una orden = un ejecutor.** Cada orden la toma exactamente un operador. No se ejecuta una orden "a dos manos".
- **Campo `EJECUTOR` obligatorio en la orden.** Identifica al operador asignado (ej. `EJECUTOR: claude`, `EJECUTOR: codex`). Sin `EJECUTOR`, la orden es inválida y nadie ejecuta.
- **Campo `EN_PROCESO_POR` en `estado.md`.** Indica quién está ejecutando AHORA. Vale `ninguno` si no hay ciclo activo, o el identificador del operador en curso.
- **Regla del ejecutor.** Si un operador lee `inbox/orden_actual.md` y el campo `EJECUTOR` no coincide con su identidad, **no ejecuta**. Se detiene en silencio.
- **Toma de la orden.** Antes de ejecutar, el operador asignado actualiza `estado.md` poniendo `EN_PROCESO_POR: <su_id>`. Esto y la ejecución pueden ir en commits separados dentro del mismo PR.
- **Liberación.** Al cerrar el ciclo, `EN_PROCESO_POR` vuelve a `ninguno`.
- **Conflictos.** Si dos operadores intentan tomar la misma orden simultáneamente, gana el primero que mergea su PR; el otro se encuentra inbox en placeholder y no ejecuta.

### Lock huérfano

Un **lock huérfano** es un `EN_PROCESO_POR` distinto de `ninguno` que ya no corresponde a un ciclo realmente en curso.

#### Qué es

`EN_PROCESO_POR: <id>` señala que el operador `<id>` tomó el ciclo y no lo cerró. Si nadie está ejecutando de verdad, el lock está huérfano: bloquea al resto sin que haya trabajo activo.

#### Cuándo ocurre

- El operador toma el lock (`EN_PROCESO_POR: <su_id>`), arranca a ejecutar y se cae a mitad (timeout, error, sesión cerrada) sin devolver el lock a `ninguno`.
- El operador falla al pushear el commit de cierre y queda el lock seteado solo en local.
- Un cierre parcial: el operador escribió reporte pero no actualizó `estado.md`, o viceversa.
- Conflictos de merge mal resueltos que dejan `EN_PROCESO_POR` con un valor incorrecto.

Síntomas: `EN_PROCESO_POR: <id>` apunta a un operador, pero `inbox/orden_actual.md` está en placeholder, o el último commit de ese operador es viejo, o ningún PR abierto corresponde a un ciclo activo.

#### Quién puede liberarlo

- **Torre**: autoridad principal para liberar locks huérfanos. Liberación manual.
- **Ariel**: solo si la Torre está ausente y el lock está bloqueando trabajo crítico, dentro del rol "interviene en alto impacto".
- **Operador IA**: NO puede liberar un lock que apunte a otro operador. Sí puede liberar uno propio si confirma que el ciclo no quedó realmente en curso (rara vez aplica, porque si llega a ese punto suele significar que ya cerró).

#### Cómo se libera

Manualmente, en un commit (puede ser parte de la próxima orden Torre o una orden mínima dedicada):

1. Verificar que no hay ciclo realmente en curso (`inbox/orden_actual.md` en placeholder, sin PR abierto del operador, etc.).
2. Editar `.torre/estado.md` y poner `EN_PROCESO_POR: ninguno`.
3. Anotar la liberación en el commit message (ej. `chore(torre): liberar lock huérfano EN_PROCESO_POR=claude`).
4. Si hubo cierre parcial (reporte escrito pero sin archivar, etc.), completar el archivado a `historial/` con un slug `<fecha>_lock-huerfano-<id>` y dejar `outbox/reporte_actual.md` en placeholder.

#### Regla: no liberación automática todavía

El MVP **no** libera locks huérfanos de forma automática. Nada de timeouts, watchdogs, jobs programados ni heurísticas. La liberación es 100% manual y queda en el commit log. Esa restricción es deliberada hasta que el sistema tenga suficiente historia para definir un timeout sano sin matar ciclos lentos legítimos.

## Lo que el MVP NO hace todavía

- No conecta APIs.
- No dispara agentes automáticamente.
- No valida órdenes con CI.
- No notifica a la Torre — la Torre vuelve y mira el repo.

Esas piezas vienen en una etapa posterior.
