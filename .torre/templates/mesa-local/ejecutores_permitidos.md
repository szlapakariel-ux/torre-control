# ejecutores_permitidos.md — Ejecutores autorizados en este repo

Lista de ejecutores que pueden tomar tareas en este repo. Los ejecutores son **intercambiables**: Torre elige según capacidad, disponibilidad, scope, velocidad, calidad y riesgo.

> Documento conceptual: `.torre/arquitectura/modelo-mesas-locales.md` §1.4.

---

## 1. Catálogo de ejecutores

| Ejecutor | Tipo | Estado en este repo | Scope autorizado | Notas |
|---|---|---|---|---|
| **Claude Code** | Agente IA (Anthropic) | _activo / sombra / no autorizado_ | _ej. solo `.torre/`, sin merges, sin secrets_ | _ej. requiere `[skip torre]` en commits_ |
| **Codex** | Agente IA (OpenAI) | _activo / sombra / no autorizado_ | _ej. mismo scope_ | _ej. alternativa cuando Claude no está disponible_ |
| **Antigravity** | Agente IA | _activo / sombra / no autorizado_ | _scope a definir_ | _capacidades a documentar_ |
| **Visual Codex** | Agente IA visual | _activo / sombra / no autorizado_ | _scope a definir_ | _para tareas con UI_ |
| **Agente imagen/video** | Agente IA multimodal | _activo / sombra / no autorizado_ | _scope a definir_ | _generación o análisis visual_ |
| **Humano técnico** | Persona | _activo_ | _full scope dentro de su rol_ | _registrar nombre/rol cuando toma tarea_ |

---

## 2. Criterios de elección

La selección de ejecutor para una tarea concreta depende de:

| Criterio | Pregunta |
|---|---|
| **Capacidad** | ¿El ejecutor sabe hacer este tipo de tarea con calidad razonable? |
| **Disponibilidad** | ¿Está accesible ahora? ¿Hay cap de costo o cuota? |
| **Scope** | ¿La tarea queda dentro del scope autorizado para este ejecutor en este repo? |
| **Velocidad** | ¿Cuánto tarda? ¿La urgencia lo justifica? |
| **Calidad** | ¿Históricamente da resultados confiables en este tipo de tarea? |
| **Riesgo** | ¿Qué pasa si se equivoca? ¿Es reversible? |

Si la tarea es sensible (ver `.torre/arquitectura/decisiones-operativas.md` §2 zona roja), la asignación final la confirma Ariel/Torre.

---

## 3. Cambios en este catálogo

- Cambios menores (nuevo ejecutor en sombra, ajuste de scope no sensible): los registra la mesa local.
- Cambios sensibles (ejecutor con acceso a producción, secrets, datos reales): autorización explícita de Ariel/Torre vía `[SOLICITUD_AUTORIZACION]`.
- Toda alta o baja queda en `memoria.md` como decisión local con fecha y motivo.
