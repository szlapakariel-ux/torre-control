# Reporte Operador — ORD-2026-04-25-11

- **Orden ejecutada**: ORD-2026-04-25-11
- **Operador**: Claude Code (`claude`)
- **Fecha de cierre**: 2026-04-25
- **RAMA_TRABAJO declarada**: `claude/torre-central-multirepo`
- **Rama real del operador**: `claude/trigger-torre-mvp-rSWiS` (restricción del harness; ya documentado en ciclos previos)
- **RAMA_DESTINO**: `main`
- **Repo**: `szlapakariel-ux/torre-control` (coincide con `REPO_TECNICO`, regla dura cumplida)
- **Commit final**: pendiente al momento de redactar

## [ESTADO]

OK — propuesta de Torre Central multi-repo entregada como documento dedicado en `.torre/torre_central_propuesta.md`. Sin código, sin implementación, sin cambios al flujo actual. Cero dependencias.

## [PROBLEMA DETECTADO]

`.torre/` es repo-local: cada instancia ejecuta solo sus propias órdenes. La regla dura de "Identidad de proyecto" (introducida en ORD-2026-04-25-06) bloquea explícitamente la ejecución cross-repo. ORD-2026-04-25-10 lo evidenció en concreto: Torre quiso ejecutar un diagnóstico de `agente-saas` desde `torre-control`, la regla disparó, Torre forzó override en chat, el ciclo cerró PARCIAL porque el operador no tenía acceso al código del repo destino.

El override informal sienta precedente: si la regla puede destrabarse por chat, deja de proteger. Hay que formalizar el cross-repo como un patrón de primera clase, no como una excepción.

## [PROPUESTA TORRE CENTRAL]

Distinción de **roles**, no de repos:

- **Repo-local**: cada repo (incluyendo `torre-control`) sigue ejecutando sus propias órdenes locales. Sin cambios.
- **Torre Central**: un repo (`torre-control` por defecto) **coordina** órdenes destinadas a otros repos. NO ejecuta el contenido; lo emite, encola, transporta y archiva. Es panel de control, no cluster de ejecución.

Ambos roles conviven en el mismo repo: `torre-control` mantiene su `.torre/` operativo y gana un canal nuevo para órdenes remotas.

## [MODELO DE ORDEN REMOTA]

Toda orden mantiene los 5 campos actuales y agrega 2 más:

| Campo | Local | Remota |
|---|---|---|
| `PROYECTO_FUNCIONAL` | nombre humano | nombre humano |
| `REPO_TECNICO` | repo donde se ejecuta | repo destino |
| `RAMA_TRABAJO` | rama del operador | rama del operador en el destino |
| `RAMA_DESTINO` | rama de merge | rama de merge en el destino |
| `EJECUTOR` | operador local | operador en el destino |
| **`TIPO_ORDEN`** *(nuevo)* | `local` (default) | `remota` |
| **`REPO_ORIGEN`** *(nuevo)* | igual a `REPO_TECNICO` | repo de la Torre Central |

Una orden es **remota** si `REPO_ORIGEN ≠ REPO_TECNICO`. El campo `TIPO_ORDEN` es declarativo y redundante con esa relación; ayuda al lector y a futuras validaciones de CI.

## [FLUJO PROPUESTO]

7 pasos, separando claramente quién hace qué:

1. **Torre redacta** orden remota en `torre-control/.torre/inbox/orden_actual.md` con `TIPO_ORDEN: remota`, `REPO_ORIGEN: torre-control`, `REPO_TECNICO: <destino>`.
2. **Operador local lee** la orden, detecta `TIPO_ORDEN: remota`, **no ejecuta contenido**.
3. **Operador local hace transporte**: mueve la orden a `.torre/remotas/<repo-slug>/orden_<ID>.md` (cola de salida), cierra ciclo de emisión cuyo reporte dice "encolada para transporte", archiva en `historial/remoto_<fecha>_<slug>/`.
4. **Transporte** (manual en MVP, automatizable después): el contenido de la orden encolada se publica en `<repo-destino>/.torre/inbox/orden_actual.md`. Para el repo destino aparece como orden local (su `REPO_TECNICO` coincide con su repo).
5. **Operador en repo destino ejecuta** la orden con sus reglas locales. Chequeo dura local pasa naturalmente. Cierra ciclo y archiva en su propio `historial/`.
6. **Reporte vuelve** a Torre Central como copia (PR cross-repo, fork, fetch o pegado manual). Aterriza en `torre-control/.torre/reportes-remotos/<repo-slug>/reporte_<ID>.md`.
7. **Torre Central completa** el ciclo remoto: copia el reporte recibido a `historial/remoto_<fecha>_<slug>/reporte_actual.md`, actualiza `estado.md`, cierra.

Resultado: ambos repos quedan con historial limpio; `torre-control` registra "qué pidió y qué le respondieron"; `agente-saas` registra "qué ejecuté", igual que cualquier ciclo local.

## [REGLAS DURAS]

1. `torre-control` **no ejecuta** código de repos destino. Solo emite, encola, transporta, archiva.
2. Repos destino **no modifican** `torre-control`. Solo ejecutan lo que llega a su `inbox/`.
3. Cada repo ejecuta **solo sus órdenes locales**. La regla dura de identidad sigue intacta y se aplica en cada destino.
4. Torre Central **solo coordina**. No interpreta el contenido de las órdenes remotas, solo verifica forma.
5. **Override de Torre deja de ser necesario**: el caso ORD-2026-04-25-10 ya no es excepción, es patrón de primera clase con `TIPO_ORDEN: remota`.
6. Una orden **remota es inválida** si `REPO_ORIGEN == REPO_TECNICO` (debería ser local).
7. Una orden **local es inválida** si `REPO_ORIGEN ≠ REPO_TECNICO`. Si Torre lo intenta por error, el operador la rechaza.
8. **No hay ejecución remota directa**. Siempre pasa por la cola + repo destino. Limita el blast radius de la Torre Central (no necesita permisos cross-repo).

## [CAMBIOS DOCUMENTALES NECESARIOS]

Para una futura orden de implementación (NO para este ciclo, que solo diseña):

1. `protocolo.md`: ampliar "Identidad de proyecto" con `TIPO_ORDEN` y `REPO_ORIGEN`; nueva sección "Órdenes remotas".
2. `templates/orden_template.md`: agregar los dos campos nuevos.
3. `flujo.md`: ramificar el sub-checklist de chequeo de identidad entre `local` y `remota`; nueva sección "Flujo de orden remota".
4. `roles.md`: actualizar Torre/Operador IA; nuevo bloque "Repo central / Repo destino".
5. `estado.md`: campo opcional `ORDENES_REMOTAS_EN_VUELO`.
6. `trigger.md` y `check_cycle_closed.sh`: tolerar `remotas/` y `reportes-remotos/`; opcionalmente alertar sobre órdenes remotas sin transportar hace mucho.
7. Workflow YAML: opcionalmente notificar cuando llega un `reporte-remoto`.
8. Nuevo script `transport_remote_order.sh` (futuro, MVP manual).

Lista completa y detallada en `.torre/torre_central_propuesta.md`.

## [RIESGO]

Bajo. El ciclo entrega solo documentación, sin afectar nada operativo.

Riesgos de la propuesta misma (a considerar antes de implementar):

1. **Transporte manual depende de disciplina humana.** Si nadie transporta la orden encolada, queda colgada para siempre. Mitigación: `check_cycle_closed.sh` extendido alerta sobre `remotas/` antiguas.
2. **Reporte de vuelta puede no llegar.** El repo destino ejecuta, cierra, y nadie copia el reporte de vuelta a Torre Central. La Central queda con un "ciclo remoto en vuelo" eterno. Mitigación: timeout (mismo problema que el lock huérfano, ya documentado; la solución es la misma — chequeo periódico humano).
3. **Permisos.** Si la Torre Central automatiza el transporte vía GitHub Action, necesita tokens cross-repo. Eso es un blast-radius mayor. Mitigación: V1 manual; automatización solo después de revisar el modelo de permisos.
4. **Doble fuente de verdad.** El reporte canónico vive en el `historial/` del repo destino; la copia en `reportes-remotos/` de Torre Central es solo mirror. Si divergen (alguien edita uno y no el otro), confunde. Mitigación documental: marcar la copia como "snapshot, ver canon en <link al historial del destino>".
5. **Complejidad creciente.** El sistema está pasando de 4 archivos clave a 4 + carpeta `remotas/` + carpeta `reportes-remotos/` + tipos de orden + roles diferenciados. Hay que asegurarse de que la curva de aprendizaje no se dispare. Mitigación: el documento `torre_central_propuesta.md` es la entrada de aprendizaje única.
6. **Retro-compatibilidad de ciclos viejos.** Las órdenes archivadas previas (1–11) no llevan `TIPO_ORDEN` ni `REPO_ORIGEN`. La implementación tiene que tratarlas implícitamente como `local`. Trivial pero hay que recordarlo.

## [SIGUIENTE PASO]

Tres caminos posibles para Torre, en orden recomendado:

1. **Aprobar/rechazar/iterar la propuesta.** Si Torre la aprueba como está, la próxima orden la implementa: agregar campos al template + protocolo + flujo + roles + estado + crear las carpetas vacías. Sin lógica de transporte automático todavía. Solo dejar la cañería tendida.

2. **Resolver primero el "override de Torre" formal.** Independiente de Torre Central, conviene documentar qué pasa cuando Torre necesita destrabar la regla dura. Aunque la propuesta acá vuelve innecesario el override para cross-repo, puede haber otros casos.

3. **Completar antes el ciclo cross-repo abierto.** ORD-2026-04-25-10 cerró PARCIAL. Si Torre va a abrir una sesión en `agente-saas` para hacer el diagnóstico real, conviene hacerlo con la Torre Central ya implementada — así el flujo queda limpio desde el primer ciclo cross-repo "real".

Recomendación operativa: ir por (1) → (3). Implementar la Torre Central antes de abrir más sesiones cross-repo evita acumular más overrides ad-hoc.

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: claude
- **Liberación al cierre confirmada**: sí
