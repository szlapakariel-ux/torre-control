# Propuesta — Torre Central multi-repo

Estado: **PROPUESTA**, no implementada. Documento generado por ORD-2026-04-25-11. La aprobación, implementación y migración son ciclos posteriores.

## Por qué este documento

Hoy `.torre/` es repo-local: cada repo tiene su propia instancia y solo ejecuta sus propias órdenes. Eso es bueno (aisla, evita ejecución cruzada accidental) y a la vez limitante (Torre tiene que abrir una sesión distinta por cada proyecto).

ORD-2026-04-25-10 mostró el problema en concreto: Torre quiso ejecutar un diagnóstico en `agente-saas` desde la sesión de `torre-control`. La regla dura de identidad de proyecto disparó correctamente; Torre forzó un override en chat; el ciclo cerró PARCIAL porque el operador no tenía acceso al código del repo destino.

Esta propuesta resuelve el caso de forma estructural, sin romper la regla dura ni introducir un override informal.

## Concepto: dos roles, no dos repos

La distinción clave es de **roles**, no de repositorios:

- **Repo-local**: cada repo (ej. `agente-saas`, `torre-control`) tiene su `.torre/` operativo. Ejecuta sus propias órdenes. El `EJECUTOR` está parado en ese repo. La regla dura sigue intacta.
- **Torre Central**: un repo (típicamente `torre-control`) que **coordina** órdenes destinadas a otros repos. NO ejecuta el contenido de esas órdenes; las **emite**, **encola**, **transporta** y **archiva**. Es un panel de control, no un cluster de ejecución.

Ambos pueden coexistir en el mismo repo: `torre-control` sigue ejecutando sus propias órdenes locales (las que vimos hasta acá) y, además, gana un canal nuevo para emitir órdenes remotas.

## Campos nuevos en una orden

Toda orden mantiene los 5 campos actuales (`PROYECTO_FUNCIONAL`, `REPO_TECNICO`, `RAMA_TRABAJO`, `RAMA_DESTINO`, `EJECUTOR`) y agrega:

- **`TIPO_ORDEN`**: `local` (default, retro-compatible) | `remota`.
- **`REPO_ORIGEN`**: el repo donde la orden fue **emitida**.
  - Para `TIPO_ORDEN: local`, `REPO_ORIGEN == REPO_TECNICO`.
  - Para `TIPO_ORDEN: remota`, `REPO_ORIGEN` apunta a la Torre Central (ej. `szlapakariel-ux/torre-control`) y `REPO_TECNICO` apunta al repo destino.

Una orden remota tiene siempre `REPO_ORIGEN ≠ REPO_TECNICO`. Una orden local los tiene iguales.

## Estructura de carpetas extendida

`.torre/` se enriquece con dos carpetas nuevas, dejando todo lo existente intacto:

```
.torre/
  inbox/
    orden_actual.md              # solo orden LOCAL en curso (sin cambios)
  outbox/
    reporte_actual.md            # solo reporte LOCAL en curso (sin cambios)
  remotas/                       # NUEVO. Cola de órdenes remotas pendientes
    <repo-slug>/                 # ej. agente-saas/
      orden_<ID>.md              # una orden remota emitida, esperando transporte
  reportes-remotos/              # NUEVO. Reportes que vinieron de vuelta del destino
    <repo-slug>/
      reporte_<ID>.md            # snapshot del reporte ejecutado allá
  historial/
    <fecha>_<slug>/              # ciclos LOCALES (sin cambios)
    remoto_<fecha>_<slug>/       # NUEVO. Ciclos de emisión + (cuando vuelve) reporte remoto
```

Notas:

- `inbox/` y `outbox/` siguen siendo solo para órdenes locales del propio repo. Una orden remota nunca vive ahí más que el tiempo en que Torre la redacta antes de "encolar".
- `remotas/<repo-slug>/` es la **bandeja de salida hacia ese repo**. Una orden encolada está esperando que alguien (humano u operador con permisos) la transporte al repo destino.
- `reportes-remotos/<repo-slug>/` es la **bandeja de entrada de reportes** que volvieron del destino. Es solo un mirror de auditoría — el reporte canónico vive en el `historial/` del repo destino.
- `historial/remoto_<fecha>_<slug>/` registra el ciclo desde el punto de vista de la Torre Central: la orden que se emitió y, cuando llega de vuelta, el reporte. Mantiene la trazabilidad sin pretender que la Torre Central ejecutó el trabajo.

## Flujo de una orden remota

```
[Torre Central]                                     [Repo destino]
    |                                                     |
    | 1. Torre redacta orden con TIPO_ORDEN: remota,      |
    |    REPO_ORIGEN: torre-control,                      |
    |    REPO_TECNICO: agente-saas,                       |
    |    RAMA_TRABAJO/DESTINO: del repo destino.          |
    |                                                     |
    | 2. La pone en .torre/inbox/orden_actual.md          |
    |    de torre-control.                                |
    |                                                     |
    | 3. Operador local lee la orden, detecta             |
    |    TIPO_ORDEN: remota, NO ejecuta el contenido.     |
    |    En su lugar, hace TRANSPORTE:                    |
    |    a. Mueve la orden a                              |
    |       .torre/remotas/agente-saas/orden_<ID>.md      |
    |    b. Inicia ciclo de emisión: el reporte dice      |
    |       "orden remota encolada, esperando transporte" |
    |    c. Archiva el ciclo de emisión en                |
    |       .torre/historial/remoto_<fecha>_<slug>/       |
    |    d. Libera el lock.                               |
    |                                                     |
    | 4. Transporte (manual o GitHub Action):             |
    |    el contenido de remotas/agente-saas/orden_<ID>.md|
    |    se publica en agente-saas/.torre/inbox/          |
    |    orden_actual.md como orden LOCAL (con            |
    |    TIPO_ORDEN: local de cara al repo destino).      |
    |                                                     |
    |                                                  [agente-saas]
    |                                                     |
    |                                                     | 5. Operador en agente-saas
    |                                                     |    ejecuta la orden normalmente.
    |                                                     |    Chequeo dura LOCAL pasa
    |                                                     |    (REPO_TECNICO == repo actual).
    |                                                     |    Cierra el ciclo según protocolo,
    |                                                     |    archiva en su propio historial/.
    |                                                     |
    | 6. El reporte se publica de vuelta a Torre Central  |
    |    como copia: PR cross-repo, fork, fetch, o copy   |
    |    manual. Aterriza en                              |
    |    torre-control/.torre/reportes-remotos/           |
    |    agente-saas/reporte_<ID>.md                      |
    |                                                     |
    | 7. Torre Central completa el ciclo remoto:          |
    |    copia el reporte recibido a                      |
    |    historial/remoto_<fecha>_<slug>/reporte_         |
    |    actual.md, actualiza estado.md, cierra.          |
    +-----------------------------------------------------+
```

Resultado:

- El `historial/` de `torre-control` tiene un registro de "qué pidió y qué le respondieron".
- El `historial/` de `agente-saas` tiene un registro de "qué ejecuté localmente" — exactamente igual que cualquier ciclo local, sin saber ni importar que la orden vino de afuera.
- Los dos repos quedan trazables, ninguno contaminado.

## Reglas duras del modelo

1. **`torre-control` no ejecuta código de `agente-saas`** (ni de ningún otro repo destino). Solo emite, encola, transporta y archiva.
2. **`agente-saas` no modifica `torre-control`** (ni ningún otro repo origen). Solo ejecuta lo que llega a su propio `inbox/`.
3. **Cada repo ejecuta solo SUS órdenes locales.** La regla dura de identidad de proyecto sigue intacta y se aplica en cada repo destino.
4. **Torre Central solo coordina.** No interpreta el contenido de las órdenes remotas, solo verifica forma (tiene los campos requeridos) y las dispatcha.
5. **Override de Torre no es necesario en este modelo.** El caso ORD-2026-04-25-10 (forzar ejecución cross-repo) deja de ser una excepción ad-hoc — es un patrón de primera clase con `TIPO_ORDEN: remota`.
6. **Una orden remota es inválida** si `REPO_ORIGEN == REPO_TECNICO`. En ese caso debería ser local.
7. **Una orden local es inválida** si `REPO_ORIGEN ≠ REPO_TECNICO`. Si Torre lo intenta, el operador la rechaza.
8. **Transporte explícito.** No hay ejecución "remota directa" desde la Torre Central. Siempre pasa por la cola y el repo destino. Esto evita que Torre Central acumule permisos cross-repo y blast radius.

## Cambios documentales necesarios (cuando se implemente)

Lista para una futura orden de implementación, no para este ciclo:

1. **`protocolo.md`**:
   - Sección "Identidad de proyecto": agregar `TIPO_ORDEN` y `REPO_ORIGEN` a los campos obligatorios; aclarar que la regla dura "repo actual = REPO_TECNICO" se evalúa solo cuando `TIPO_ORDEN: local`.
   - Nueva sección "Órdenes remotas" con el flujo de 7 pasos.
   - Nueva sección "Roles del repo": ejecutor local + dispatcher central.

2. **`templates/orden_template.md`**: agregar `TIPO_ORDEN` y `REPO_ORIGEN`.

3. **`flujo.md`**:
   - Sub-checklist actualizado: paso 3 (chequeo de identidad) ramifica entre `local` y `remota`.
   - Sección nueva "Flujo de orden remota".

4. **`roles.md`**:
   - Bloque Torre: puede emitir órdenes locales (igual que ahora) o remotas (nueva).
   - Bloque Operador IA: si la orden es remota, no ejecuta contenido — hace transporte.
   - Nuevo bloque "Repo central / Repo destino".

5. **`estado.md`**: nuevo campo opcional `ORDENES_REMOTAS_EN_VUELO: <count>` para visibilidad.

6. **`trigger.md` y `check_cycle_closed.sh`**:
   - El detector debería tolerar la presencia de `remotas/` y `reportes-remotos/` sin marcarlas como ciclos abiertos.
   - Posiblemente agregar un check secundario: "¿hay órdenes remotas sin transportar hace > X tiempo?".

7. **Workflow `.github/workflows/torre-trigger.yml`**: opcionalmente extender para que detecte `reportes-remotos/` recientes y los anuncie.

8. **Nuevo script** `.torre/scripts/transport_remote_order.sh` (futuro): mueve un archivo de `remotas/<repo>/orden_<id>.md` al PR/branch del repo destino. MVP puede ser manual.

## Beneficios

- **Resuelve el caso del 25/04**: cross-repo deja de requerir override de Torre.
- **Centraliza la planificación**: Torre tiene un solo lugar donde ver "qué le estoy pidiendo a cada proyecto".
- **No rompe lo existente**: órdenes locales siguen igual; los repos que no usan Torre Central no se ven afectados.
- **Aislación preservada**: cada repo sigue siendo dueño de su ejecución y su historia.

## Limitaciones aceptadas

- **Transporte manual en MVP.** La primera implementación posiblemente sea: el operador en torre-control encola la orden; un humano (o un agente con multi-repo perms) la pega en agente-saas. Automatizarlo requiere tokens y workflows cross-repo, y se difiere a una iteración posterior.
- **Sincronización del reporte.** En el caso manual, el reporte vuelve cuando alguien lo trae. No hay un mecanismo de "polling" automático en V1 de la Torre Central.
- **Solo árbol unidireccional.** Torre Central → repos destino. No se contempla "repo destino emite a otro destino"; cualquier escalada tiene que pasar por la Central.
- **Sin protección de ramas hardening.** Este documento asume que cada repo destino acepta PRs que tocan `.torre/inbox/`. Si los repos tienen `.torre/inbox/` protegido, hay que pensar el transporte.

## Versiones futuras (fuera de scope)

- Automatización del transporte vía GitHub Action que abre PR cross-repo con la orden.
- Autenticación / firma de órdenes remotas (HMAC, GPG, etc.) para que el repo destino valide que la orden viene de Torre Central legítima.
- Polling/webhook para detectar cierre del ciclo en el repo destino y traer el reporte automáticamente.
- Multi-Torre (varias Torres Centrales coexistiendo).
