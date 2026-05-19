# MC-LOC-2J — Preflight documental de habilitación técnica

## 1. Contexto

- MC-LOC-2J parte de **MC-LOC-2I cerrado en main** (PR #29, commit `7a40ca3`).
- El contrato `location-tracking` tiene **11 documentos** en main:
  1. `README.md`
  2. `alcance.md`
  3. `criterios_habilitacion_tecnica.md`
  4. `privacidad.md`
  5. `esquema_evento_v1.md`
  6. `modo_demo_test.md`
  7. `retencion_y_rollback.md`
  8. `decision_pendiente_mc_loc_2.md`
  9. `decision_mc_loc_2c.md`
  10. `lista_archivos_tecnicos_autorizados_mc_loc_2d.md`
  11. `decision_almacenamiento_emisor_mc_loc_2i.md`
- Este preflight **no implementa nada**: no crea archivos técnicos, no toca código, no toca producción.
- Este preflight **no habilita MC-LOC-2 técnico automáticamente**. Es una lectura conservadora de las 22 condiciones definidas en `decision_almacenamiento_emisor_mc_loc_2i.md §4`.
- Cualquier paso técnico requiere **orden separada explícita de Ariel/Torre** por escrito.

## 2. Fuente del preflight

Fuente principal:
- `.torre/contratos/location-tracking/decision_almacenamiento_emisor_mc_loc_2i.md §4` (checklist de 22 condiciones).

Documentos auxiliares revisados:
- `.torre/contratos/location-tracking/lista_archivos_tecnicos_autorizados_mc_loc_2d.md` (paths potencialmente autorizables y prohibidos).
- `.torre/contratos/location-tracking/esquema_evento_v1.md` (shape v1 y enum cerrado de `state`).
- `.torre/contratos/location-tracking/modo_demo_test.md` (reglas demo / fail-closed / pruebas mínimas).
- `.torre/contratos/location-tracking/retencion_y_rollback.md` (in-repo append-only, rollback documental).
- `.torre/contratos/location-tracking/decision_mc_loc_2c.md` (cierre de las 9 decisiones, exclusiones).

## 3. Checklist de 22 condiciones

| # | Condición | Estado | Evidencia documental | Bloquea apertura técnica |
|---|-----------|--------|----------------------|--------------------------|
| 1 | MC-LOC-2I mergeado en main | **CUMPLIDA** | PR #29 mergeado por squash, commit `7a40ca3` en `origin/main` | NO |
| 2 | PR técnico futuro limitado a lista de MC-LOC-2D | **CUMPLIDA CON LÍMITES** | `lista_archivos_tecnicos_autorizados_mc_loc_2d.md §3.1` + `§3.2` definen los 6 paths potenciales; §3.3 enumera prohibiciones | NO (límite documental; verificación real ocurre en el diff del PR técnico) |
| 3 | Almacenamiento limitado a `.torre/location-tracking/demo_eventos.jsonl` | **CUMPLIDA CON LÍMITES** | `decision_almacenamiento_emisor_mc_loc_2i.md §2.1` lo declara como único path operativo | NO |
| 4 | Emisor limitado a agente ejecutor autorizado por Torre | **CUMPLIDA CON LÍMITES** | `decision_almacenamiento_emisor_mc_loc_2i.md §3.1` lo declara; emisión visible en diff de PR | NO |
| 5 | Datos 100% ficticios | **CUMPLIDA CON LÍMITES** | `modo_demo_test.md §Reglas generales 1` + `decision_almacenamiento_emisor_mc_loc_2i.md §2.1` | NO (validación final en PR técnico) |
| 6 | Modo demo explícito | **CUMPLIDA CON LÍMITES** | `modo_demo_test.md §Reglas generales 2` (MODE=demo por defecto) | NO (validación final en PR técnico) |
| 7 | Validación fail-closed | **NO CUMPLIDA** | Regla declarada en `modo_demo_test.md §Reglas generales 3`; sin implementación ni prueba | SÍ (debe verificarse en PR técnico) |
| 8 | Evento válido de ejemplo | **NO CUMPLIDA** | Ejemplo conceptual en `esquema_evento_v1.md`; archivo `.json` no creado | SÍ (entregable del PR técnico) |
| 9 | Rechazo de campo prohibido | **NO CUMPLIDA** | Regla en `esquema_evento_v1.md §Regla transversal`; prueba no ejecutada | SÍ (entregable del PR técnico) |
| 10 | Rechazo de `state` inválido | **NO CUMPLIDA** | Enum cerrado en `esquema_evento_v1.md §Enum state`; prueba no ejecutada | SÍ (entregable del PR técnico) |
| 11 | Sin código fuera de lista autorizada | **CUMPLIDA CON LÍMITES** | `lista_archivos_tecnicos_autorizados_mc_loc_2d.md §3.3` + `§4` enumeran exclusiones | NO (verificación real en diff del PR técnico) |
| 12 | Sin scripts automáticos | **CUMPLIDA CON LÍMITES** | `lista_archivos_tecnicos_autorizados_mc_loc_2d.md §3.3` + `decision_almacenamiento_emisor_mc_loc_2i.md §2.2/§3.2` | NO |
| 13 | Sin workflows | **CUMPLIDA CON LÍMITES** | `lista_archivos_tecnicos_autorizados_mc_loc_2d.md §3.3` + `decision_almacenamiento_emisor_mc_loc_2i.md §2.2/§3.2` | NO |
| 14 | Sin producción | **CUMPLIDA CON LÍMITES** | `alcance.md`, `criterios_habilitacion_tecnica.md`, `decision_mc_loc_2c.md §2.9`, `decision_almacenamiento_emisor_mc_loc_2i.md §2.2/§3.2` | NO |
| 15 | Sin endpoints | **CUMPLIDA CON LÍMITES** | `decision_almacenamiento_emisor_mc_loc_2i.md §2.2/§3.1/§3.2` + `lista_…_mc_loc_2d.md §3.3` | NO |
| 16 | Sin SDKs | **CUMPLIDA CON LÍMITES** | `decision_almacenamiento_emisor_mc_loc_2i.md §3.1/§3.2` + `lista_…_mc_loc_2d.md §3.3` | NO |
| 17 | Sin secrets | **CUMPLIDA CON LÍMITES** | `criterios_habilitacion_tecnica.md`, `decision_mc_loc_2c.md §2.9`, `decision_almacenamiento_emisor_mc_loc_2i.md §2.1/§3.1/§3.2` | NO |
| 18 | Sin tracking real | **CUMPLIDA** | `alcance.md`, `privacidad.md`, `decision_mc_loc_2c.md §2.9`, `decision_almacenamiento_emisor_mc_loc_2i.md §2.2` (exclusión absoluta) | NO |
| 19 | Sin ubicación real | **CUMPLIDA** | `privacidad.md` (regla vinculante), `decision_mc_loc_2c.md §2.9`, `decision_almacenamiento_emisor_mc_loc_2i.md §2.2` | NO |
| 20 | Autorización explícita de Ariel/Torre para cada paso | **NO CUMPLIDA** | Requiere orden por escrito; no emitida todavía | **BLOQUEANTE** |
| 21 | Auditoría previa al PR técnico | **NO CUMPLIDA** | Patrón ya conocido (MC-LOC-1A, MC-LOC-2B-A, MC-LOC-2E, MC-LOC-2I-A); auditoría del PR técnico aún no existe | **BLOQUEANTE** |
| 22 | Orden técnica separada y específica | **NO CUMPLIDA** | Requiere orden explícita "habilito MC-LOC-2 técnico" con alcance puntual; no emitida | **BLOQUEANTE** |

## 4. Evaluación conservadora

Criterio aplicado:
- Cubierta por documentación existente → **CUMPLIDA** o **CUMPLIDA CON LÍMITES**.
- Depende de verificación dentro de un futuro PR técnico → **NO CUMPLIDA todavía**.
- Es requisito obligatorio antes de abrir técnica → **BLOQUEANTE**.
- La documentación nunca se interpreta como autorización técnica.

## 5. Resultado del preflight

### 5.1 Condiciones ya cubiertas documentalmente

**12 condiciones** con cobertura documental sólida:

- #1 (merge MC-LOC-2I).
- #2 (lista de paths potenciales).
- #3 (almacenamiento demo único).
- #4 (emisor único conceptual).
- #5 (datos ficticios — regla declarada).
- #6 (modo demo por defecto — regla declarada).
- #11 (sin código fuera de lista — regla declarada).
- #12, #13, #14, #15, #16, #17 (sin scripts/workflows/producción/endpoints/SDKs/secrets — todas declaradas en múltiples documentos).
- #18 (sin tracking real).
- #19 (sin ubicación real).

### 5.2 Condiciones que solo pueden verificarse en un futuro PR técnico

**6 condiciones** son entregables del eventual PR técnico, no del estado documental actual:

- #7 validación fail-closed (regla declarada; ejecución pendiente).
- #8 evento válido de ejemplo (archivo `.json` no creado).
- #9 rechazo de campo prohibido (prueba no ejecutada).
- #10 rechazo de `state` inválido (prueba no ejecutada).
- #5/#6/#11 confirmación final en el diff y el comportamiento del PR técnico (cobertura documental SÍ; verificación real NO).

### 5.3 Condiciones que requieren autorización humana explícita

**3 condiciones** son bloqueantes que solo Ariel/Torre pueden resolver:

- #20 autorización explícita de Ariel/Torre para cada paso.
- #21 auditoría previa al PR técnico.
- #22 orden técnica separada y específica (formato esperado: "habilito MC-LOC-2 técnico" con alcance puntual y archivos autorizados).

## 6. Riesgos residuales

- **Riesgo de abrir técnica demasiado pronto**: confundir la cobertura documental sólida con autorización técnica. Mitigación: 3 bloqueantes humanos (#20, #21, #22) que no pueden cubrirse desde el documento.
- **Riesgo de scope creep**: un PR técnico podría intentar agregar paths fuera de la lista MC-LOC-2D, justificándose como "necesario". Mitigación: auditoría del PR técnico debe rechazar cualquier path no listado y dispara rollback documental.
- **Riesgo de confundir demo con producción**: el flag `MODE=demo` podría ser cambiado a `MODE=real` por error o por presión. Mitigación: `modo_demo_test.md` exige flag explícito y orden por escrito para cualquier modo distinto.
- **Riesgo de convertir el archivo JSONL en base de datos real**: si el demo escala silenciosamente, deja de ser demo. Mitigación: `retencion_y_rollback.md` define rotación documental y `decision_almacenamiento_emisor_mc_loc_2i.md §2.3` exige contrato separado para cualquier almacenamiento no-demo.
- **Riesgo de volver a Ariel cartero**: que la emisión de eventos termine generando notificaciones, propagación, integraciones. Mitigación: `decision_almacenamiento_emisor_mc_loc_2i.md §3.3` deja a Torre/Ariel como consumidor humano único, sin pipelines automáticos.
- **Riesgo de automatización prematura**: un hook, cron, workflow o bot podría empezar a emitir sin revisión. Mitigación: `§3.2` prohíbe explícitamente todos esos emisores; cada emisión debe ser visible en el diff de un PR.

## 7. Dictamen final

**B) MC-LOC-2 técnico puede ser preparado como orden técnica separada, pero sigue NO habilitado hasta autorización explícita.**

Justificación:
- 12 condiciones cubiertas documentalmente (CUMPLIDA o CUMPLIDA CON LÍMITES).
- 6 condiciones (las que requieren ejecución de pruebas y diff técnico) **deberán** verificarse dentro del PR técnico cuando se abra.
- 3 condiciones (autorización explícita, auditoría previa, orden técnica separada) siguen siendo **BLOQUEANTES** humanas. Sin ellas, MC-LOC-2 técnico **no se abre**.
- La documentación está completa, los límites están claros, las prohibiciones consistentes. Falta la decisión humana explícita.

Este dictamen **no equivale a "C)"**: no autoriza implementación. Solo declara que la base documental es suficiente para que Torre, si lo decide, redacte una **orden técnica mínima** en un próximo microciclo.

## 8. Próximo microciclo recomendado

**MC-LOC-2K — redacción de orden técnica mínima, sin ejecutarla todavía.**

Tipo: documental. Crea un único archivo bajo `.torre/contratos/location-tracking/` (sugerido: `orden_tecnica_mc_loc_2k.md`) que:

- Define el alcance exacto del eventual PR técnico (qué archivos crear, en qué orden, con qué contenido conceptual).
- Enumera los entregables verificables: evento válido, evento rechazado por campo prohibido, evento rechazado por `state` inválido, validación fail-closed.
- Especifica el procedimiento de auditoría previa al PR técnico (estilo MC-LOC-2E / MC-LOC-2I-A).
- **Es propuesta de orden, no ejecución**. No crea archivos técnicos, no toca código. Torre y Ariel revisan y deciden si emiten la orden definitiva.

Tras MC-LOC-2K vendrían:
- **MC-LOC-2K-A** — auditoría documental de la orden propuesta.
- **MC-LOC-2K-B/C/D** — apertura/verificación/merge del PR documental que la incorpora.
- Solo después, con orden explícita de Ariel ("habilito MC-LOC-2 técnico"), podría abrirse el microciclo **MC-LOC-3 técnico** (renombre sugerido para marcar el salto a fase técnica).
