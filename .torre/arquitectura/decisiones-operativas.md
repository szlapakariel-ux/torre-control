# Decisiones operativas cerradas — Torre V0

Documento de registro de las decisiones de arquitectura y operación cerradas para Torre V0. No se reabren sin justificación nueva. El listado complementa `.torre/decisiones.md` (que registra decisiones del sistema postal MVP) con las decisiones de la nueva capa de mesas locales y Guardián.

---

## 1. Las 40 decisiones cerradas

| # | Decisión |
|---|---|
| 1 | Torre define el qué y el para qué. |
| 2 | La mesa local define el cómo técnico posible. |
| 3 | Ariel/Torre conserva decisión final. |
| 4 | Cada repo tendrá su mesa local en `.mesa/`. |
| 5 | Torre envía orden ejecutiva + anexos obligatorios. |
| 6 | La mesa local no recibe un WhatsApp pelado ni una novela imposible: recibe carátula clara + referencias. |
| 7 | Resultado ideal: issue + `.mesa/revisiones/`. |
| 8 | Guardián central + reglas locales. |
| 9 | El Guardián reporta excepciones, no actividad normal. |
| 10 | Preflight obligatorio antes de operar. |
| 11 | Modos: simulación → sombra → activo. |
| 12 | MVP validado por Torre/ChatGPT; operación crítica validada también por segundo agente. |
| 13 | Fallas menores → modo degradado. |
| 14 | Fallas críticas → vuelve a simulación. |
| 15 | Toda falla crítica se reporta a Ariel/Torre. |
| 16 | Severidades SEV-1 a SEV-4. |
| 17 | Solo Ariel/Torre puede cambiar severidad. |
| 18 | Severidad editable con trazabilidad. |
| 19 | El Guardián puede recomendar cambio de severidad y alertar si parece SEV-1. |
| 20 | "Solucionado" exige cierre completo. |
| 21 | `[FIN_AGENTE]` no cierra expediente; solo indica que el agente terminó su parte. |
| 22 | Cierre final depende de severidad. |
| 23 | Patrones repetidos: primero local, luego sistémico. |
| 24 | Patrón sistémico abre tarea macro y congela parches repetidos. |
| 25 | Mitigaciones temporales tienen vencimiento. |
| 26 | Tareas humanas externas se registran en mesa local y Torre. |
| 27 | Responsabilidad se registra sin culpa: responsable + tipo de responsabilidad. |
| 28 | Comunicación con Ariel debe ser por capas cuando está saturado. |
| 29 | Memoria doble: local por repo y central en Torre. |
| 30 | Aprendizajes incorrectos se conservan como rechazados con motivo. |
| 31 | Decisiones débiles de Ariel/Torre se registran como aprendizaje de criterio + regla preventiva. |
| 32 | Conflictos Torre vs mesa local se formalizan. |
| 33 | Riesgo aceptado exige plan de contención. |
| 34 | Claude Code, Codex u otros agentes son ejecutores intercambiables. |
| 35 | La arquitectura queda abierta a Antigravity, Visual Codex, agentes de imagen/video y futuros ejecutores. |
| 36 | Nivel de riesgo operativo: INTERMEDIO CONTROLADO. |
| 37 | Acciones sensibles requieren autorización explícita de Ariel/Torre. |
| 38 | Comunicación con clientes reales requiere aprobación de Ariel/Torre. |
| 39 | Prioridad entre proyectos la define Ariel/Torre. |
| 40 | Los agentes tienen autonomía operativa controlada, pero no representación plena de Ariel/Torre. |

---

## 2. Nivel de riesgo operativo: INTERMEDIO CONTROLADO

### Avanzar sin pedir autorización (zona verde)
- documentación,
- arquitectura,
- plantillas,
- estructura de carpetas,
- ordenamiento de mesa,
- checklists,
- glosarios,
- criterios de replicación,
- PR documental sin merge,
- análisis de riesgos,
- recomendaciones.

### Frenar y pedir autorización explícita (zona roja)
- código productivo,
- producción,
- secrets,
- variables de entorno,
- base de datos,
- deploy,
- datos de clientes reales,
- dinero,
- legal,
- reputación,
- merge a `main`,
- cambios irreversibles,
- cambios de criterio ya cerrado.

### Regla madre
> Si es reversible, documental y no toca producción, avanzá.
> Si puede afectar clientes, datos, dinero, producción o decisiones sensibles, frená y reportá.

---

## 3. Uso de modelos por capacidad

| Modelo | Uso principal | No debe |
|---|---|---|
| **Opus** | Revisar arquitectura, detectar contradicciones, ordenar decisiones, validar diseño. | Implementar todo de una. |
| **Sonnet** | Implementar documentación, estructura de carpetas, PRs documentales. | Cambiar decisiones cerradas sin reportar. |
| **Haiku** | Tareas mecánicas: completar plantillas, checklists, validaciones simples. | Decidir arquitectura. |

Regla común: **ningún modelo mergea sin autorización**.

---

## 4. Responsabilidad sin culpa

Cuando se registra responsable de una tarea o caso:

- **Responsable operativo**: quién toma la tarea.
- **Tipo de responsabilidad**: `DIAGNOSTICAR`, `IMPLEMENTAR`, `REVISAR`, `APROBAR`, `OBSERVAR`.

No se registra "culpable". Se registra qué rol tuvo cada parte. Esto se aplica también a Ariel/Torre cuando una decisión propia resulta débil: se documenta como aprendizaje de criterio.

---

## 5. Conflictos Torre vs mesa local

Cuando una mesa local discrepa con Torre, **no se resuelve en chat**. Se formaliza:

1. La mesa local registra su disenso en `revisiones/` con motivo técnico.
2. Torre evalúa.
3. Si Torre mantiene la orden, lo registra como decisión y razona el porqué.
4. Si la mesa identifica riesgo aceptado, debe acompañarse de plan de contención.

---

## 6. Referencias cruzadas

- Modelo conceptual: `.torre/arquitectura/modelo-mesas-locales.md`.
- Plantilla replicable: `.torre/templates/mesa-local/`.
- Piloto modelado: `.torre/proyectos/agente-saas/`.
- Decisiones del sistema postal MVP previas: `.torre/decisiones.md`.
- Roles operativos del MVP: `.torre/roles.md`.
