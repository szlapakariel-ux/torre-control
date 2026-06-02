# Registro de proyectos, repos y alias operativos

> **Fuente de verdad del mapa operativo de Torre.**
> Cualquier mención suelta de proyecto, repo o alias en otros documentos de `.torre/` está subordinada a este archivo.
> Este archivo **no reescribe el historial**: las órdenes archivadas usan la nomenclatura de su época y siguen siendo válidas como artefactos históricos.

---

## Reglas de alias

- Los alias son **cortos, minúsculas y sin espacios**.
- Un alias identifica un proyecto para selección operativa (ej. por WhatsApp o en órdenes).
- **Ningún alias habilita implementación por sí mismo.** La habilitación requiere orden explícita de Torre con alcance declarado.
- Si un mensaje de Ariel contiene un alias sin más contexto, el Portero consulta antes de actuar.

## Proyecto activo por defecto

`torre` (Torre de Control). Los demás proyectos pasan a "activo" solo cuando una orden los selecciona explícitamente.

## Nota sobre runtime

Un archivo JSON consumible por runtime (ej. `.torre/proyectos.json`, `.torre/inbox/proyecto_activo.json`) queda **diferido a otro microciclo**. Este documento es exclusivamente documental y no debe ser leído por código automatizado.

---

## Mapa de proyectos

### 1. Torre de Control

| Campo | Valor |
|---|---|
| **Proyecto funcional** | Torre de Control |
| **Alias principal** | `torre` |
| **Alias alternativos** | `tc`, `control` |
| **Repo técnico** | `szlapakariel-ux/torre-control` |
| **Rama destino** | `main` |
| **Estado** | `activo` |
| **Rol** | Instancia de gobierno y coordinación. Contiene reglas, protocolos, contratos y el mapa operativo. |

---

### 2. Secretaria IA

| Campo | Valor |
|---|---|
| **Proyecto funcional** | Secretaria IA |
| **Alias principal** | `saas` |
| **Alias alternativos** | `secretaria`, `agente-saas` |
| **Repo técnico** | `szlapakariel-ux/agente-saas` |
| **Rama destino** | `master` |
| **Estado** | `suspendido` |
| **Vinculado a** | `ORD-2026-04-25-10` (`.torre/inbox/suspendidas/ORD-2026-04-25-10.md`) — congelado hasta nueva decisión de Torre. |
| **Aclaración** | `.torre/proyectos/agente-saas/` dentro de este repo es un **espejo/modelo documental** (piloto), no el repo técnico real. El repo técnico real es `szlapakariel-ux/agente-saas`. |

---

### 3. Auditoría SOFSE

| Campo | Valor |
|---|---|
| **Proyecto funcional** | Auditoría SOFSE |
| **Alias principal** | `sofse` |
| **Alias alternativos** | `auditoria` |
| **Repo técnico** | `auditoria-sofse` |
| **Owner** | ⚠️ **Pendiente de confirmación** — no usar `auditoria-sofse` como repo técnico hasta que Torre declare el owner completo (`<owner>/auditoria-sofse`). |
| **Rama destino** | ⚠️ **Pendiente de confirmación** |
| **Estado** | `conocido / no iniciado` |
| **Nota** | No activar este proyecto hasta confirmar el repo técnico completo. Citado como ejemplo en `protocolo_principal.md §1` y `glosario_operativo.md §6`, pero sin orden emitida ni mesa local creada. |

---

## Regla de seguridad

Ninguno de los proyectos registrados aquí queda habilitado para implementación técnica por el solo hecho de estar listado en este documento. Toda implementación requiere:

1. Orden explícita de Torre con `PROYECTO_FUNCIONAL`, `REPO_TECNICO`, `RAMA_TRABAJO`, `RAMA_DESTINO`, `EJECUTOR`, `TIPO_ORDEN` y `REPO_ORIGEN`.
2. Cumplimiento del protocolo de ciclo declarado en `.torre/protocolo.md` y `.torre/protocolo_principal.md`.
3. Verificación de identidad de proyecto por parte del ejecutor antes de actuar (ver `.torre/protocolo.md` sección "Identidad de proyecto").
