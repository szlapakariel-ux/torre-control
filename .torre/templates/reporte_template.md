# Reporte Operador — <ID de orden>

- **Orden ejecutada**: ORD-YYYYMMDD-NN
- **Operador**: <Claude Code | Codex | otro>
- **Fecha de cierre**: YYYY-MM-DD
- **Branch**: <nombre del branch>
- **Commit final**: <hash o pendiente>

## [ESTADO]

<OK | PARCIAL | BLOQUEADO> — explicación en una línea.

## [ARCHIVOS CREADOS]

- `ruta/archivo1`
- `ruta/archivo2`

## [QUÉ INCLUYE EL PROTOCOLO]

<Solo si la orden tocó protocolo o convenciones. Si no aplica: "N/A".>

## [CÓMO SE USA]

<Pasos breves para que la Torre o el siguiente operador use lo entregado.>

## [DIFF RESUMIDO]

<Resumen en bullets de qué cambió a alto nivel. No pegar el diff completo.>

## [RIESGO]

<Qué podría romperse, qué quedó frágil, qué supuestos se hicieron.>

## [SIGUIENTE PASO]

<Una sugerencia concreta para la próxima orden. Decide la Torre.>

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: <claude | codex | humano | otro>
- **Liberación al cierre confirmada**: <sí | no>   <!-- "sí" implica que el operador devolvió EN_PROCESO_POR a `ninguno` en .torre/estado.md como parte de este ciclo. -->

