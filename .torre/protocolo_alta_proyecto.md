# Protocolo de alta de proyecto nuevo en Torre de Control

> **Versión:** 1.0
> **Microciclo de registro:** MC-2C
> **Autoridad emisora:** Torre de Control
> **Relación con otros documentos:**
> - `.torre/proyectos.md` — registro operativo actual de proyectos conocidos. Actualizarlo requiere un microciclo separado con orden explícita.
> - `.torre/protocolo_principal.md` — protocolo general de flujo; este documento es complementario.
> - `.torre/protocolo.md` — reglas del ciclo de ejecución; aplica a cualquier orden de alta.

---

## 1. Propósito

Este documento define los criterios y pasos para incorporar un proyecto nuevo a la Torre de Control. Permite que cualquier proyecto futuro se dé de alta con campos verificables, sin depender de explicaciones sueltas en chat o de memoria conversacional.

**El alta documental no autoriza producción, no autoriza código y no habilita automatización.** Solo registra el proyecto en el mapa operativo.

---

## 2. Campos obligatorios del alta

Todo proyecto nuevo debe declarar los siguientes campos antes de ser incorporado a `.torre/proyectos.md`:

| Campo | Descripción | Ejemplo |
|---|---|---|
| **Nombre funcional** | Nombre legible del proyecto, usado en órdenes y comunicación con Ariel. | `Auditoría SOFSE` |
| **Alias principal** | Alias corto, minúsculas, sin espacios. Único en el mapa. | `sofse` |
| **Alias alternativos** | Otros alias reconocidos. Minúsculas, sin espacios. | `auditoria` |
| **Repo técnico** | `<owner>/<repo>` exacto. Sin este campo completo el proyecto queda `conocido / no iniciado`. | `szlapakariel-ux/auditoria-sofse` |
| **Rama destino** | Rama principal del repo técnico. Sin este campo el proyecto queda `conocido / no iniciado`. | `main` |
| **Estado inicial** | Ver sección 3. | `conocido / no iniciado` |
| **Responsable / fuente de verdad** | Quién es la autoridad de decisión para este proyecto. | `Torre de Control / Ariel` |
| **Qué NO se puede tocar** | Restricciones específicas del proyecto al momento del alta. | `código de producción`, `secrets`, `deploy` |
| **Próximo microciclo permitido** | Primer paso autorizado después del alta. | `diagnóstico read-only` |
| **Riesgos conocidos** | Riesgos identificados al incorporar el proyecto. | `repo con código en producción activa` |
| **Criterio de cierre del alta** | Qué condición confirma que el alta quedó bien registrada. | `proyecto visible en \`.torre/proyectos.md\` con todos los campos` |

### Regla de campos incompletos

Si falta **repo técnico**, **owner** o **rama destino**, el proyecto se registra como `conocido / no iniciado` y **no puede recibir órdenes técnicas** hasta que Torre declare esos campos por escrito en un microciclo separado.

---

## 3. Estados posibles

| Estado | Significado operativo |
|---|---|
| `activo` | Proyecto seleccionado como repo de trabajo. Puede recibir órdenes técnicas con alcance declarado. |
| `pausado` | Proyecto con trabajo iniciado, detenido temporalmente. Puede retomarse sin nueva orden de alta. |
| `suspendido` | Proyecto con orden o tarea congelada hasta nueva decisión de Torre. No recibe órdenes nuevas hasta descongelamiento. |
| `conocido / no iniciado` | Proyecto registrado en el mapa pero sin orden emitida, sin mesa local y/o con campos incompletos. No activar hasta completar campos obligatorios. |
| `cerrado` | Proyecto finalizado o descartado. No recibe nuevas órdenes. El historial se conserva como consulta. |

### Regla de transición de estado

- `conocido / no iniciado` → `activo`: requiere orden explícita de Torre con los 7 campos obligatorios y todos los campos del alta completos.
- `pausado` → `activo`: requiere orden de retoma con alcance declarado.
- `suspendido` → `activo`: requiere orden de descongelamiento explícita de Torre.
- Cualquier estado → `cerrado`: requiere decisión explícita de Torre; no se cierra por inactividad automática.

---

## 4. Reglas de seguridad

1. **Ningún alias habilita implementación por sí mismo.** El alias es solo un identificador de selección operativa.
2. **Ningún proyecto nuevo habilita código por el solo hecho de ser dado de alta.** El alta es documental; el código requiere orden técnica separada.
3. **Todo proyecto técnico requiere orden con los 7 campos obligatorios:** `PROYECTO_FUNCIONAL`, `REPO_TECNICO`, `RAMA_TRABAJO`, `RAMA_DESTINO`, `EJECUTOR`, `TIPO_ORDEN`, `REPO_ORIGEN`.
4. **Si falta repo, owner o rama, el proyecto queda `conocido / no iniciado`** y no puede recibir órdenes técnicas.
5. **No crear JSON ni runtime en el ciclo de alta.** El alta es un documento `.md`; cualquier archivo consumible por código requiere microciclo separado con orden explícita.
6. **El alta documental no autoriza producción ni automatización.** Producción y automatización requieren sus propios microciclos con contratos y criterios de habilitación.

---

## 5. Relación con `.torre/proyectos.md`

- **`.torre/proyectos.md`** es el registro operativo actual. Contiene los proyectos ya conocidos con sus campos declarados.
- **Este documento** define el *protocolo* para futuras altas: los campos requeridos, los estados posibles y las reglas de seguridad.
- **Actualizar `.torre/proyectos.md`** para incorporar un proyecto nuevo requiere un microciclo separado con orden explícita de Torre, rama propia, auditoría y merge autorizado — igual que cualquier otro cambio documental.
- Los dos documentos son complementarios: este protocolo dice *cómo* dar de alta; `.torre/proyectos.md` dice *qué* proyectos están dados de alta.

---

## 6. Flujo de alta paso a paso

```
1. Torre emite orden MC-ALTA-<nombre> con los 11 campos obligatorios declarados.
2. Operador crea rama desde main actualizado.
3. Operador actualiza .torre/proyectos.md agregando la nueva entrada.
4. Operador hace commit + push. No abre PR todavía.
5. Torre ejecuta auditoría read-only de la rama.
   - Verifica que todos los campos obligatorios estén presentes.
   - Verifica que no se tocaron otros archivos.
   - Verifica que no hay JSON, runtime ni código.
6. Si la auditoría es APTA, Torre autoriza abrir PR documental.
7. Verificación pre-merge: CI verde + diff único + sin comentarios.
8. Torre autoriza merge squash.
9. Post-merge: proyecto visible en .torre/proyectos.md en main.
```

---

## 7. Criterio de cierre de un alta

Un alta se considera cerrada cuando:

- El proyecto aparece en `.torre/proyectos.md` en `main` con todos los campos obligatorios.
- El merge fue squash autorizado por Torre.
- El estado inicial está correctamente declarado.
- Si el estado es `conocido / no iniciado`, los campos faltantes están marcados como `⚠️ pendiente de confirmación`.
- No se introdujo código, JSON, runtime, secret ni automatización en el PR de alta.
