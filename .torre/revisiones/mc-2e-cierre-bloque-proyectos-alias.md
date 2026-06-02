# Cierre documental — Bloque MC-2
# Proyecto activo / alias / alta de proyecto

> **Microciclo de cierre:** MC-2E
> **Autoridad emisora:** Torre de Control
> **Estado del bloque:** CERRADO
> **`main` al momento del cierre:** `88264d0`

---

## 1. Propósito

Registrar el cierre del bloque MC-2, que dotó a la Torre de Control de un mapa de proyectos, un sistema de alias, un protocolo de alta de proyectos nuevos y un smoke test documental que valida ese protocolo.

Este documento es un acta de cierre. **No habilita implementación técnica.** Solo consolida lo que el bloque dejó disponible y delimita lo que sigue prohibido.

---

## 2. Bloque cerrado

| Microciclo | Entregable | Estado |
|---|---|---|
| **MC-2B** | `.torre/proyectos.md` — registro de proyectos, repos y alias operativos | ✅ cerrado en `main` (PR #34) |
| **MC-2C** | `.torre/protocolo_alta_proyecto.md` — protocolo de alta de proyecto nuevo | ✅ cerrado en `main` (PR #35) |
| **MC-2D** | `.torre/revisiones/mc-2d-smoke-test-alta-proyecto.md` — smoke test documental de alta | ✅ cerrado en `main` (PR #36) |

---

## 3. Qué quedó habilitado

A partir de este bloque, la Torre puede:

- **Usar alias para identificar proyectos** (ej. `torre`, `saas`, `sofse`) en órdenes y comunicación.
- **Consultar el proyecto activo por defecto** (`torre`, según `.torre/proyectos.md`).
- **Evaluar altas de proyectos nuevos** aplicando `.torre/protocolo_alta_proyecto.md`.
- **Clasificar proyectos incompletos** como `conocido / no iniciado` cuando faltan repo técnico, owner o rama destino.
- **Preparar una futura alta real** mediante una orden separada con los campos obligatorios declarados.

---

## 4. Qué NO quedó habilitado

Este bloque **no habilita** ninguna de las siguientes acciones. Cada una requiere su propio microciclo con orden explícita y criterios de habilitación:

- ❌ implementación técnica automática
- ❌ JSON / runtime
- ❌ lectura por código de los documentos del bloque
- ❌ creación de repos reales
- ❌ producción
- ❌ automatización
- ❌ MC-LOC-3
- ❌ location-tracking técnico

---

## 5. Evidencia

| Evidencia | Confirmación |
|---|---|
| MC-2B cerrado en `main` | ✅ `.torre/proyectos.md` presente (PR #34, `bdcb646`) |
| MC-2C cerrado en `main` | ✅ `.torre/protocolo_alta_proyecto.md` presente (PR #35, `a674727`) |
| MC-2D cerrado en `main` | ✅ `.torre/revisiones/mc-2d-smoke-test-alta-proyecto.md` presente (PR #36, `88264d0`) |
| Proyecto Demo Controlado NO dado de alta realmente | ✅ era ficticio; `.torre/proyectos.md` no fue modificado por MC-2D |
| `.torre/proyectos.md` como registro operativo actual | ✅ fuente de verdad del mapa de proyectos |
| `.torre/protocolo_alta_proyecto.md` como protocolo de futuras altas | ✅ define campos, estados y reglas para altas nuevas |

---

## 6. Próximo uso posible

A partir de este bloque, una futura orden de Torre puede pedir:

- **Alta documental de un proyecto real** (con los 11 campos del protocolo declarados).
- **Selección de proyecto activo por alias** para dirigir órdenes.
- **Auditoría de proyectos registrados** en `.torre/proyectos.md`.
- **Preparación de un archivo JSON/runtime** en otro microciclo, **si Torre lo autoriza explícitamente** (hoy diferido).

Cada uno de estos usos requiere una orden separada. Ninguno queda habilitado automáticamente por este cierre.

---

## 7. Estado final del bloque

- **Bloque MC-2:** CERRADO.
- **Torre:** en reposo, sin orden activa tras este cierre.
- **MC-LOC-3:** NO habilitado.
- **Location-tracking técnico:** NO habilitado.

El bloque queda como base documental para la gestión de proyectos y alias. Cualquier paso hacia implementación, runtime o proyectos reales requiere una orden nueva.
