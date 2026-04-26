# criterios-para-replicar.md — Cuándo copiar el modelo a otro repo

Este documento define los criterios mínimos que deben cumplirse antes de replicar el modelo de mesa local desde el piloto `agente-saas` a otro repositorio técnico.

> Modelo conceptual: `.torre/arquitectura/modelo-mesas-locales.md`.
> Plantilla replicable: `.torre/templates/mesa-local/`.

---

## 1. Criterios mínimos

| # | Criterio | Cómo se verifica |
|---|---|---|
| 1 | **Plantilla clara** | `.torre/templates/mesa-local/` está completa, leíble, sin TODOs críticos abiertos. |
| 2 | **Piloto agente-saas validado** | Ariel/Torre revisó este directorio y aprobó el modelo. Al menos una tarea del piloto (001 o 002) llegó a `CIERRE_VALIDABLE`. |
| 3 | **Reglas ACK/FIN probadas** | Hubo al menos un ciclo real con `[ACK_AGENTE]` y `[FIN_AGENTE]` correctamente formateados. Se detectó al menos un caso de FIN incorrecto y el Guardián lo reportó como excepción. |
| 4 | **Guardián probado en simulación o sombra** | El Guardián funcionó en modo no intrusivo durante un período mínimo definido por Torre, sin generar falsos positivos significativos. |
| 5 | **No genera ruido** | El Guardián reporta excepciones, no actividad normal. Se confirmó que el ratio de alertas relevantes vs ruido es aceptable. |
| 6 | **Separación runtime/mesa confirmada** | Verificado que `.mesa/` en `agente-saas` no se importa desde producción, no entra en builds críticos y no afecta deploys. |
| 7 | **Ejecutores definidos** | `ejecutores_permitidos.md` del piloto refleja qué ejecutores están realmente operativos (no solo en lista). |
| 8 | **Cierre de tareas trazable** | Existe al menos una revisión completa en `revisiones/` con los 8 requisitos de cierre cumplidos (ver `.torre/arquitectura/modelo-mesas-locales.md` §5.1). |

---

## 2. Decisión de replicar

La decisión de replicar a otro repo la toma Ariel/Torre (decisión 39 de `.torre/arquitectura/decisiones-operativas.md`). El cumplimiento de los 8 criterios es **necesario** pero no suficiente: Torre puede esperar más por:

- Carga de trabajo real del repo destino (no abrir mesas vacías).
- Disponibilidad de ejecutores con scope.
- Madurez del equipo / contexto del proyecto.
- Otros pilotos en simultáneo que puedan saturar.

---

## 3. Procedimiento de replicación

Cuando los criterios se cumplen y Ariel/Torre lo aprueba:

1. Abrir un PR en el repo destino que cree `.mesa/` copiando la plantilla.
2. Adaptar `README.md`, `ejecutores_permitidos.md` y `estado.md` al contexto del repo.
3. Confirmar que `.mesa/` queda fuera del runtime (igual que en `agente-saas`).
4. Registrar en Torre: `"<repo> tiene mesa local activa desde <fecha>"` (en `.torre/estado.md` o donde corresponda).
5. Crear primer pedido real desde Torre con su orden ejecutiva + anexos (decisión 5 y 6 de `decisiones-operativas.md`).
6. Vigilar el primer ciclo: ACK, ejecución, FIN, revisión, cierre.

---

## 4. Lo que invalida la replicación

Aunque los 8 criterios estén marcados, **no replicar** si:

- El Guardián entró a `degradado` o volvió a `simulación` por falla crítica reciente y no se cerró la causa raíz.
- Hay decisiones cerradas en proceso de revisión por Ariel/Torre.
- El repo destino tiene su propio sistema de coordinación activo y no se decidió todavía cómo coexistir/migrar.
- El repo destino está en un momento de cambio mayor (refactor grande, migración de stack, freeze pre-deploy crítico).

En esos casos, esperar y registrar la pausa con motivo.

---

## 5. Revisión de criterios

Estos criterios pueden actualizarse a la luz de aprendizajes del piloto. Los cambios:

- Se proponen primero en `.torre/proyectos/agente-saas/decisiones.md` o se elevan a `.torre/arquitectura/decisiones-operativas.md` si son sistémicos.
- Los aprueba Ariel/Torre.
- Quedan registrados con fecha y motivo.
