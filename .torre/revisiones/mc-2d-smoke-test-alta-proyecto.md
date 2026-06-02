# Smoke Test Documental — MC-2D
# Alta de proyecto nuevo (proyecto ficticio)

> **Microciclo:** MC-2D
> **Protocolo aplicado:** `.torre/protocolo_alta_proyecto.md`
> **Objetivo:** Verificar que el protocolo permite clasificar un proyecto ficticio y que produce el dictamen correcto sin modificar `.torre/proyectos.md`.
> **Proyecto evaluado:** ficticio — no crear repo, no dar de alta realmente.

---

## 1. Datos del proyecto evaluado

| Campo | Valor declarado |
|---|---|
| **Nombre funcional** | Proyecto Demo Controlado |
| **Alias principal** | `demo` |
| **Alias alternativos** | `prueba`, `sandbox` |
| **Repo técnico** | ⚠️ `pendiente de confirmación` |
| **Owner** | ⚠️ `pendiente de confirmación` |
| **Rama destino** | ⚠️ `pendiente de confirmación` |
| **Estado inicial** | `conocido / no iniciado` |
| **Responsable / fuente de verdad** | Torre de Control |
| **Qué NO se puede tocar** | código, scripts, workflows, secrets, producción, app/, backend/, frontend/, runtime, location-tracking |
| **Próximo microciclo permitido** | solo decisión documental de Torre |
| **Riesgos conocidos** | confundir proyecto ficticio con proyecto real; intentar crear repo sin autorización; convertir el smoke test en alta real |
| **Criterio de cierre del alta** | confirmar que el protocolo clasifica el proyecto como `conocido / no iniciado`; confirmar que faltan repo técnico completo y rama destino; confirmar que no habilita implementación |

---

## 2. Aplicación del protocolo

### 2.1 Chequeo de campos obligatorios (§2 del protocolo)

| Campo obligatorio | Estado |
|---|---|
| Nombre funcional | ✅ presente: `Proyecto Demo Controlado` |
| Alias principal | ✅ presente: `demo` |
| Alias alternativos | ✅ presente: `prueba`, `sandbox` |
| Repo técnico (`<owner>/<repo>`) | ❌ pendiente de confirmación |
| Rama destino | ❌ pendiente de confirmación |
| Estado inicial | ✅ presente: `conocido / no iniciado` |
| Responsable / fuente de verdad | ✅ presente: `Torre de Control` |
| Qué NO se puede tocar | ✅ presente |
| Próximo microciclo permitido | ✅ presente |
| Riesgos conocidos | ✅ presente |
| Criterio de cierre del alta | ✅ presente |

**Campos faltantes: repo técnico completo y rama destino.**

### 2.2 Regla de campos incompletos (§2 del protocolo)

> "Si falta **repo técnico**, **owner** o **rama destino**, el proyecto se registra como `conocido / no iniciado` y **no puede recibir órdenes técnicas** hasta que Torre declare esos campos por escrito en un microciclo separado."

**Aplica.** Faltan repo técnico (con owner) y rama destino → estado forzado: `conocido / no iniciado`.

### 2.3 Estado resultante (§3 del protocolo)

Estado asignado: **`conocido / no iniciado`**

Condición para avanzar a `activo`: orden explícita de Torre con los 7 campos obligatorios y todos los campos del alta completos. **No se puede activar en este estado.**

### 2.4 Reglas de seguridad verificadas (§4 del protocolo)

| Regla | Verificación |
|---|---|
| Ningún alias habilita implementación por sí mismo | ✅ `demo`, `prueba`, `sandbox` son solo identificadores |
| Ningún proyecto habilita código por el solo hecho de ser dado de alta | ✅ el alta es documental |
| Todo proyecto técnico requiere 7 campos obligatorios | ✅ faltan repo y rama → no puede recibir órdenes técnicas |
| No crear JSON ni runtime en el ciclo de alta | ✅ solo documento `.md` |
| El alta no autoriza producción ni automatización | ✅ confirmado |

---

## 3. Dictamen del smoke test

**`conocido / no iniciado` — NO APTO PARA ALTA COMPLETA en este estado**

Razones:
1. Falta repo técnico completo (`<owner>/<repo>`).
2. Falta rama destino.
3. Sin esos campos, el protocolo impide activar el proyecto y emitir órdenes técnicas.

**Consecuencias operativas:**
- El proyecto **NO debe incorporarse a `.torre/proyectos.md`** hasta que Torre declare repo técnico y rama destino.
- Ningún alias (`demo`, `prueba`, `sandbox`) habilita implementación.
- El alta documental **no crea repo**, **no crea código** y **no habilita automatización**.

---

## 4. Verificación de scope del smoke test

| Verificación | Resultado |
|---|---|
| `.torre/proyectos.md` no modificado | ✅ no tocado |
| `.torre/estado.md` no modificado | ✅ no tocado |
| `.torre/protocolo_alta_proyecto.md` no modificado | ✅ no tocado |
| Sin JSON/runtime creado | ✅ solo este `.md` |
| Sin código/scripts/workflows/secrets/producción/app/backend/frontend | ✅ |
| Contratos location-tracking intactos | ✅ no tocados |
| MC-LOC-3 sigue NO habilitado | ✅ |
| Proyecto demo NO dado de alta realmente | ✅ solo ejercicio de clasificación |
| No se creó repo real | ✅ |

---

## 5. Conclusión

El protocolo `.torre/protocolo_alta_proyecto.md` funciona correctamente para este caso:

- Clasifica el proyecto como `conocido / no iniciado` de forma determinista.
- Identifica los campos faltantes (repo técnico y rama destino).
- Impide activación y órdenes técnicas sin completar esos campos.
- No habilita código, runtime ni producción por el solo hecho del alta.

**Smoke test: APTO.** El protocolo produce el dictamen esperado.
