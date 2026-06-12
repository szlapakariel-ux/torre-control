# Protocolo Torre Universal V0.2 — carriles, roles, escalas PLIC

> **Versión:** 0.2
> **Fecha:** 2026-06-12
> **Microciclo de registro:** ORD-20260612-01 (MC-PLIC-1)
> **Estado:** vigente
> **Capa:** 2 (operativa)
> **Autoridad:** Torre
> **Fuente:** transcripción del documento "Protocolo Torre Universal V0.2" aportado por Ariel.

> Principio de esta versión: **el protocolo completo es una caja de herramientas, no una obligación para cada tornillo.**

## 1. Propósito

La Torre Universal existe para evitar que Ariel actúe como cartero entre ideas, agentes, repos, herramientas y decisiones. Convierte pedidos desordenados, problemas técnicos o ideas incompletas en **ciclos de trabajo claros, limitados, verificables y cerrables**. La Torre no reemplaza a Ariel, no ejecuta todo sola, no inventa decisiones, no acelera por ansiedad: **coordina**.

## 2. Mantra

**Estabilizar → Cerrar → Medir → Subir un nivel.** (Ver `00_definicion_plic.md`.)

## 3. Carriles de trabajo

No todo pedido requiere el protocolo completo. La Torre elige el carril **antes** de abrir el ciclo.

- **Express** — cambios simples, de bajo riesgo, fáciles de revertir (typo, actualizar un estado documental, cerrar un PR legacy ya evaluado, nota en `.mesa/`). Se comprimen pasos, pero **nunca** se elimina: scope claro, evidencia, cierre.
- **Normal** — el flujo estándar (sección 6).
- **Crítico** — toca usuarios reales, producción o algo difícil de revertir. Requisitos: autorización explícita de Ariel, preflight obligatorio, plan de rollback o mitigación, registro de riesgo, verificación posterior, postmortem si hubo incidente.

**Regla de carril:** si hay duda entre dos, usar el más seguro. Si el proceso pesa más que la tarea, Express. Si toca usuarios reales, Crítico.

## 4. Flujo general (carril Normal)

```
Ariel trae idea/problema/pedido
   ↓ Clarificador ordena el pedido
   ↓ Torre define carril (Express/Normal/Crítico)
   ↓ Torre clasifica el tipo de trabajo
   ↓ PLIC estima impacto, urgencia, bloqueo y repetición
   ↓ Guardián de Scope limita el alcance
   ↓ Torre decide si hace falta agente
   ↓ Certificador valida si el agente puede trabajar
   ↓ Ejecutor trabaja dentro del scope
   ↓ Verificador QA revisa evidencia
   ↓ Documentador registra cierre
   ↓ Torre decide cerrar, reabrir o subir un nivel
```

## 5. Roles (sombreros, no necesariamente agentes separados)

En la fase actual, varios roles son "sombreros" que usa la Torre/GPT. Se convierten en agentes separados **solo si la repetición lo justifica**.

- **Ariel** — dueño de criterio y autorización (prioridades reales, riesgo alto, producción, decisiones estratégicas, aceptar/rechazar cierres). No debería transportar contexto entre agentes ni ser el único punto de memoria.
- **Torre** — coordinador central (ordena el proceso, aplica protocolo, transforma pedidos en ciclos, asigna roles, prioriza con PLIC, exige evidencia).
- **Clarificador** — ordena el pedido (no prioriza).
- **Guardián de Scope** — limita el alcance (no inventa scope).
- **Triage PLIC** — estima impacto/urgencia/bloqueo/repetición/riesgo (no ejecuta).
- **Certificador de Agentes** — habilita o no a un agente para trabajar.
- **Ejecutor** — trabaja dentro del scope.
- **Verificador QA** — revisa evidencia (no inventa scope).
- **Documentador** — registra el cierre (no declara cierre sin evidencia).

## 6. Capa PLIC — priorización por concentración de impacto

PLIC busca detectar qué pocos eventos explican la mayor parte del bloqueo. No es ciencia exacta, no decide solo: **ordena señales**.

### 6.1 Dimensiones y escalas (1-5, anclas)

**Impacto** — 1 molestia menor/estética · 2 afecta orden interno sin bloquear · 3 afecta una función con workaround · 4 afecta usuarios reales / retrabajo alto · 5 rompe producción / bloquea varios ciclos.

**Urgencia** — 1 puede esperar · 2 conviene resolver · 3 entra en planificación próxima · 4 bloquea una decisión o ciclo actual · 5 atención inmediata / riesgo activo.

**Bloqueo** — 1 no bloquea · 2 bloquea una tarea menor · 3 bloquea una tarea importante · 4 bloquea varias tareas o una etapa · 5 bloquea el proyecto o impide operar.

**Repetición** — 1 una vez · 2 pocas veces · 3 reaparece en varios ciclos · 4 patrón recurrente claro · 5 patrón dominante del proyecto.

**Riesgo** — 1 reversible sin usuarios · 2 bajo riesgo (doc/test aislado) · 3 código no crítico · 4 flujo vivo / usuarios / config sensible · 5 producción, datos, secrets, pagos, seguridad, migraciones.

### 6.2 Prioridades

- **P0** — atacar primero.
- **P1** — atacar después.
- **P2** — importante, no bloqueante.
- **P3** — observar.

> Regla: **no se ataca lo más ruidoso. Se ataca lo que más desbloquea.**

### 6.3 Fórmula de score (implementada en `backend/services/plicScore.js`)

El conteo `blocked_items` se mapea a la escala 1-5 de Bloqueo (0 items → 1; 5+ → 5). El score pondera el desbloqueo por encima del resto:

```
score = 3*bloqueo + 2.5*impacto + 2*urgencia + 1.5*riesgo + 1*repetición    (máx 50)
```

Buckets:

- `score ≥ 40` → **P0**
- `score ≥ 30` → **P1**
- piso a **P1** si `blocked_items ≥ 5`, o si (`event_type ∈ {bloqueo, error}` y `impacto ≥ 4`)
- `score ≥ 18` → **P2**
- resto → **P3**

> Esta doc es la **fuente normativa** de la fórmula. Si cambia, se cambia primero acá y después en el código.

### 6.4 Esquema de evento PLIC

```json
{
  "source": "chat | api | torre",
  "project": "nombre-del-proyecto",
  "event_type": "bloqueo",
  "actor": "quién intervino",
  "target": "componente afectado",
  "description": "qué pasó",
  "impact": 5,
  "urgency": 4,
  "blocked_items": 2,
  "repetition": 3,
  "risk": 4,
  "status": "abierto | en_curso | cerrado",
  "evidence": "evidencia breve",
  "recommendation": "acción sugerida"
}
```

**12 tipos permitidos:** `idea`, `pedido`, `orden`, `bloqueo`, `error`, `retrabajo`, `decisión`, `handoff`, `verificación`, `cierre`, `reapertura`, `estado`.

## 7. Regla anti-caos

(Ver `00_definicion_plic.md`.) En síntesis: no subir de nivel sin cerrar; no automatizar sin probar; no sumar agentes sin protocolo; no tocar código sin diagnóstico; no mezclar dos problemas en un ciclo; no confundir cierre documental con técnico.

## 8. Estado de implementación (MC-PLIC-1)

Implementado en este microciclo:
- Capa PLIC viva: cada mensaje del chat genera un evento (`source: chat`); API para eventos manuales (`POST/PATCH /api/events`); ranking (`GET /api/plic/ranking`).
- Cerebro IA configurable (`torreBrain.js`) que clasifica y estima dimensiones PLIC, con fallback al clasificador por keywords.

Pendiente (futuros microciclos):
- Carriles, roles como agentes separados, bitácora local `.mesa/` por proyecto, cierre/reapertura de eventos desde el chat (MC-PLIC-2), conexión real Portero → Torre.
