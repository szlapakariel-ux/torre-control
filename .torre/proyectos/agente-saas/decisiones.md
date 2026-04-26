# decisiones.md — Decisiones del piloto agente-saas

Decisiones específicas del piloto. Las decisiones generales de arquitectura están en `.torre/arquitectura/decisiones-operativas.md`.

---

## D-001 — `agente-saas` es el primer piloto

**Decisión**: `agente-saas` (proyecto funcional Secretaria) es el primer repo donde se va a probar el modelo V0 de mesa local.
**Motivo**: Ya tiene tareas reales activas (recordatorios, Portero V1) y un historial de coordinación experimental en `.torre/mesa-compartida/`.
**Alcance**: Solo modelado desde Torre en este PR. No se crea `.mesa/` real todavía.
**Quién decidió**: Ariel/Torre (instrucción del prompt de creación del PR).

## D-002 — La mesa real futura debe vivir en `.mesa/`

**Decisión**: Cuando el modelo se valide, `agente-saas` tendrá una carpeta `.mesa/` siguiendo la plantilla de `.torre/templates/mesa-local/`.
**Motivo**: Separar runtime (código productivo) de coordinación (mesa). El nombre `.mesa/` es reservado para esto.
**Alcance**: No se crea ahora. Se crea cuando Ariel/Torre apruebe el modelo y los criterios de replicación se cumplan (ver [`criterios-para-replicar.md`](./criterios-para-replicar.md)).
**Quién decidió**: Ariel/Torre.

## D-003 — `data/README_COMPARTIDA.md` no es el modelo final

**Decisión**: El archivo `data/README_COMPARTIDA.md` que pueda existir en el repo `agente-saas` corresponde a un modelo previo de coordinación. **No** debe usarse como referencia para la mesa local V0.
**Motivo**: Modelo viejo, mezcla de estándares. Generaría confusión si alguien lo confunde con el modelo nuevo.
**Acción futura**: Cuando se cree `.mesa/` en `agente-saas`, decidir explícitamente el destino del archivo viejo (deprecar, archivar como histórico, o eliminar tras migración del contenido relevante). **Esa decisión se toma en otro PR**, no en éste.
**Quién decidió**: Ariel/Torre (vía prompt del piloto).

## D-004 — Torre conserva la coordinación

**Decisión**: La habilitación de `.mesa/` en `agente-saas` no descentraliza la decisión final. Torre sigue coordinando, priorizando y aprobando lo sensible.
**Motivo**: Decisión 1, 3 y 39 de `.torre/arquitectura/decisiones-operativas.md`.
**Alcance**: Aplica a todas las tareas modeladas en este piloto.
**Quién decidió**: Ariel/Torre.

## D-005 — El ejecutor técnico se elige por disponibilidad y capacidad

**Decisión**: Ninguna tarea queda fija a un ejecutor específico por nombre. Se asigna a "ejecutor disponible con scope sobre `agente-saas`". Claude Code es la primera opción cuando esté disponible; Codex es alternativa válida.
**Motivo**: Decisión 34 y 35 de `.torre/arquitectura/decisiones-operativas.md`. Torre no se casa con una herramienta.
**Alcance**: Tareas 001, 002 y futuras del piloto.
**Quién decidió**: Ariel/Torre.

## D-006 — Orden 002 queda bloqueada por 001

**Decisión**: La tarea 002 (Portero V1 notas/tareas) **no avanza** hasta que 001 (recordatorios fuera de horario) tenga al menos diagnóstico suficiente.
**Motivo**: Cambiar el Portero V1 mientras los recordatorios están con causa raíz desconocida puede oscurecer el diagnóstico y mezclar dos problemas.
**Alcance**: Hasta que Ariel/Torre revise y desbloquee explícitamente.
**Quién decidió**: Ariel/Torre.
