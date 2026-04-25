# Reporte Operador — ORD-2026-04-25-10

- **Orden ejecutada**: ORD-2026-04-25-10
- **Operador**: Claude Code (`claude`)
- **Fecha de cierre**: 2026-04-25
- **Repo de trabajo del operador**: `szlapakariel-ux/torre-control` (no coincide con `REPO_TECNICO` de la orden)
- **REPO_TECNICO declarado**: `szlapakariel-ux/agente-saas`
- **RAMA_TRABAJO declarada**: `claude/portero-v1-diagnostico`
- **Override de regla dura**: autorización explícita de Torre en chat, dos veces.
- **Commit final**: pendiente al momento de redactar.

## [ESTADO]

**PARCIAL** — Torre autorizó override de la regla dura de identidad de proyecto. La parte mecánica del diagnóstico (leer código de `agente-saas`) no se puede ejecutar desde esta sesión. Lo que se entrega es un **framework de diagnóstico** estructurado para que el operador con acceso a `agente-saas` lo complete; más las inferencias que se pueden hacer a partir de los mensajes de Torre en esta sesión.

Lo que sí pude hacer:
- Estructurar las cinco secciones pedidas con qué buscar, dónde buscarlo y qué preguntas responder.
- Inferir un patrón de cierre típico para Portero V1 que es independiente del código concreto.
- Marcar explícitamente cada lugar donde falta información de `agente-saas`.

Lo que NO pude hacer:
- Ver `agent_service`, `agent_intents_service`, módulos `intents/*`, ni la carpeta `portero/`.
- Identificar archivos concretos de regex/`pre_classify`.
- Cuantificar duplicación real.
- Listar imports y referencias entre módulos.

## [FLUJO ACTUAL]

> Framework para completar con acceso a `agente-saas`. Los nombres `webhook`, `agent_service`, `agent_intents_service`, `intents`, `módulos` salen de la propia orden de Torre.

Cadena nominal:

```
webhook (entrada) 
  → agent_service (orquestador) 
    → agent_intents_service (clasificador / dispatcher) 
      → intents/* (handlers por intención) 
        → módulos/* (notas, tareas, cumpleaños, eventos)
```

Por cada eslabón, el operador en `agente-saas` debe responder:

1. **`webhook`**:
   - ¿Hace algún parseo de texto? ¿Algún regex de extracción antes de llamar al servicio?
   - ¿Pasa el payload "raw" o ya enriquecido?
2. **`agent_service`**:
   - ¿Tiene branching por keywords? (`if "recordame" in text:` etc.)
   - ¿Llama directamente al Portero o a `agent_intents_service`?
   - ¿Decide en algún punto qué módulo debe atender, sin pasar por el Portero?
3. **`agent_intents_service`**:
   - **Sospechoso #1.** Por nombre, este servicio es exactamente lo que el Portero V1 debería reemplazar.
   - ¿Usa regex / pre_classify / lookup de palabras clave?
   - ¿Emite el `Decision DTO` o un objeto interno propio?
   - ¿Hay un flag tipo `USE_PORTERO=True/False` ya implementado pero solo para `notas`?
4. **`intents/*`**:
   - ¿Cada intent reinterpreta el texto del usuario, o consume un `Decision` ya pre-procesado?
   - ¿Tienen regex propios? (sospechoso #2)
5. **`módulos/*` (notas, tareas, cumpleaños, eventos)**:
   - ¿Reciben texto crudo o ya parseado?
   - ¿Cuáles tienen lógica de "decidir qué hacer" (`if/elif` sobre text), y cuáles son ya pasivos?
   - **Hipótesis de Torre**: `notas` ya está integrado al Portero; los otros tres no.

Información que se necesita extraer (operador en agente-saas):

- Árbol de archivos de `portero/`, `intents/`, `módulos/`.
- Imports entre `agent_*`, `intents/`, `módulos/`.
- Definición y uso del `Decision DTO`.
- Flags: variables tipo `USE_PORTERO`, `PORTERO_V1_ENABLED`, switches en config.

## [BRECHAS DE PORTERO]

> Checklist de anti-patrones a buscar. Cada hit es una brecha que debe cerrar V1.

| Anti-patrón | Dónde buscarlo | Por qué es brecha |
|---|---|---|
| `re.match` / `re.search` sobre `text` o `message` fuera de `portero/` | grep recursivo | Lenguaje interpretado fuera del Portero |
| `if "<palabra>" in text` / `lower().startswith(...)` | grep en `intents/`, `módulos/`, `agent_*` | Mismo |
| Función `pre_classify` o similar fuera de `portero/` | grep por nombre | Duplicación: ese trabajo es del Portero |
| Módulo que recibe `text: str` en vez de `decision: Decision` | inspección de signaturas | Módulo "piensa" en vez de "ejecutar" |
| `agent_intents_service` sigue siendo llamado en producción | flags en config + uso real | Indica que el Portero todavía no es el camino dominante |
| Dos rutas paralelas (Portero vs legacy) sin cleanup | búsqueda de `if USE_PORTERO` o equivalentes | Cierre V1 incompleto |
| Tests del Portero solo para `notas` | inspección de `tests/portero/` | Cobertura falta para los otros dominios |

Hipótesis de Torre confirmable con grep:

- Existe carpeta `portero/` ✓ (declarado)
- Existe `Decision DTO` ✓ (declarado)
- Hay flags ✓ (declarado)
- Solo `notas` está integrado al Portero ✓ (declarado, a verificar el alcance real)

A producir como entrega real:

- **Lista concreta** de archivos `*.py` que matchean cada anti-patrón.
- **Conteo** de ocurrencias por módulo.
- **Mapa de "quién todavía piensa"**: módulo → técnica de interpretación local (regex / keywords / longitud / heurísticas).

## [PLAN DE CIERRE V1]

Por dominio. Estructura repetible para los cuatro.

### Notas (asumido como referencia "ya integrada")

- **Validar**: `notas` consume `Decision` puro, sin regex propios. Si lo hace, queda como modelo.
- **Eliminar**: rama legacy de `notas` que pasaba por `agent_intents_service` (si todavía existe).
- **Mover al Portero**: nada (ya migrado).
- **Adaptar al Decision DTO**: si el DTO evolucionó, ajustar el consumer de `notas` al schema final V1.

### Tareas

- **Eliminar**: regex/keyword matching local en `tareas/`.
- **Eliminar**: cualquier `pre_classify` específico de tareas en `agent_intents_service`.
- **Mover al Portero**: la lógica de clasificación "es una tarea / es un recordatorio / es un to-do" pasa al Portero, codificada como variantes de `Decision.intent`.
- **Adaptar al Decision DTO**: el handler de `tareas` debe recibir solo el `Decision` y producir efectos; nada de leer `text` original.

### Cumpleaños

- **Eliminar**: parseo de fechas dentro del módulo (si lo hace).
- **Mover al Portero**: extracción de fecha/persona/relación → campos del `Decision DTO` (ej. `decision.entities.date`, `decision.entities.person`).
- **Adaptar**: handler de cumpleaños recibe entidades ya parseadas.

### Eventos

- **Eliminar**: cualquier dispatcher local "esto es un evento" basado en keywords.
- **Mover al Portero**: clasificación + extracción de when/where/who.
- **Adaptar**: handler recibe entidades estructuradas.

> Faltan los archivos concretos para llenar esto con detalle. La estructura es estable; los nombres de funciones/archivos a editar requieren acceso al repo.

## [ORDEN DE EJECUCIÓN]

Secuencia recomendada para cerrar V1 sin tocar V2:

1. **Snapshot**: mapear y commitear el estado actual (este diagnóstico, ejecutado en agente-saas) — sirve de baseline inmutable.
2. **Estabilizar el Portero existente**: tests del path `notas → Portero → handler` deben pasar sin warnings; el `Decision DTO` debe tener un schema versionado y documentado.
3. **Migrar dominio por dominio**, en orden de menor a mayor complejidad. Sugerencia razonable a falta de datos:
   - `tareas` (probable que sea casi tan simple como notas)
   - `cumpleaños` (parsing de fechas, complejidad media)
   - `eventos` (más entidades, complejidad alta)
4. **Por cada dominio migrado**:
   a. agregar el intent al Portero,
   b. cambiar el handler para consumir `Decision`,
   c. dejar el camino legacy detrás de un flag, default desactivado,
   d. correr suite completa,
   e. commit.
5. **Cleanup**: cuando los cuatro dominios pasan por el Portero, eliminar `agent_intents_service`, eliminar regex residuales, eliminar flags, eliminar el camino legacy.
6. **Freeze V1**: tag, documento de "Portero V1 cerrado", baseline para discutir V2.

Cada paso debería ser un ciclo `.torre` propio en `agente-saas` (asumiendo que `agente-saas` adopte el sistema postal).

## [RIESGO]

Riesgos del propio ciclo (override de regla dura):

1. **Sienta precedente.** Si Torre puede destrabar la regla dura por chat, la regla deja de proteger. Hay que formalizar el override (ver siguiente paso) o las próximas veces el operador va a estar en zona ambigua sobre cuándo es legítimo.
2. **Contaminación de `historial/torre-control`.** Este ciclo queda archivado en `torre-control` con `REPO_TECNICO: agente-saas`. Cualquier auditor del historial de torre-control verá un ciclo "ajeno". Mitigación: el slug `2026-04-25_portero-v1-diagnostico-cross-repo` y el campo `[ESTADO] = PARCIAL` lo dejan visible.

Riesgos del diagnóstico en sí:

3. **Falsa precisión.** El framework arriba **no es un diagnóstico real** — es una plantilla con hipótesis. Si alguien en `agente-saas` lo trata como verdad y empieza a borrar archivos basándose en él, va a romper cosas. La sección [PLAN DE CIERRE V1] solo se vuelve accionable después de llenar [FLUJO ACTUAL] y [BRECHAS DE PORTERO] con datos reales.
4. **Hipótesis no validadas**. Asumí que `agent_intents_service` es el "competidor" del Portero por su nombre. Puede que ya esté retirado, o que tenga otro rol. Verificar con grep antes de actuar.
5. **Decision DTO desconocido en detalle**. No sé qué campos tiene hoy. Si el DTO actual no soporta entidades de cumpleaños/eventos (fecha, persona, lugar), agregar campos al DTO es parte del cierre V1, no asumido.

## [SIGUIENTE PASO]

Tres acciones, en este orden:

1. **Re-emitir esta misma orden en `agente-saas`** (camino limpio recomendado en mensajes anteriores). Allá:
   - Instalar `.torre/` en `agente-saas` (replicando ORD-20260425-01 archivado en torre-control).
   - Re-emitir ORD-2026-04-25-10 con `REPO_TECNICO: szlapakariel-ux/agente-saas`. Esta vez la regla dura se respeta sin override.
   - El operador con acceso al código llena los huecos del framework producido acá. Este reporte sirve como input.

2. **Formalizar el override Torre→regla dura** en el protocolo. Una orden chica acá en `torre-control` que agregue al `protocolo.md` una sección "Override de Torre" con:
   - cuándo es legítimo (Torre lo declara explícitamente, en chat o en la orden, con una razón),
   - cómo se registra (campo `OVERRIDE: <razón>` en la orden),
   - obligación del operador de marcar `[ESTADO] = PARCIAL` o `[ESTADO] = OVERRIDE` y explicar las limitaciones.
   - Esto convierte un caso ad-hoc (este ciclo) en un mecanismo repetible y auditable.

3. **Decidir el rol de `torre-control/.torre/` a futuro**: ¿es la "Torre console central" que dispatcha a otros repos, o cada repo tiene su `.torre/` independiente? El protocolo actual asume lo segundo. Este ciclo es un puente forzado; conviene cerrarlo con una decisión explícita en una orden Torre.

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: claude
- **Liberación al cierre confirmada**: sí
