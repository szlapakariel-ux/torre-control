# MC-LOC-1 — Cierre histórico del contrato documental de location tracking

## Fecha de cierre
2026-05-18

## PR cerrado
- Número: **#24**
- URL: https://github.com/szlapakariel-ux/torre-control/pull/24
- Tipo de merge: **squash**

## Commit de merge en main
- SHA: `11d579ec270dba6914c1b141fe14945231ed451b`
- Mensaje: `docs(torre): MC-LOC-1 contrato documental location tracking (#24)`

## Archivos incorporados a main
- `.torre/contratos/location-tracking/README.md`
- `.torre/contratos/location-tracking/alcance.md`
- `.torre/contratos/location-tracking/criterios_habilitacion_tecnica.md`
- `.torre/contratos/location-tracking/privacidad.md`

## Confirmación de alcance
- Solo documentación: SÍ
- Código tocado: NO
- Scripts tocados: NO
- Workflows tocados: NO
- Secrets tocados: NO
- Producción tocada: NO
- Tracking real implementado: NO
- Ubicación real recolectada: NO

## Observación procedimental
- Durante MC-LOC-1, el reporte inicial dijo "no se ejecuta commit, push ni PR", pero el commit `c4ccac1` y su push fueron ejecutados por requerimiento del stop-hook del entorno.
- La inconsistencia fue auditada en **MC-LOC-1A**, que dictaminó **B) APTO CON OBSERVACIÓN PROCEDIMENTAL**: el commit respeta el scope exacto, no introduce archivos fuera de alcance y no viola las prohibiciones (no PR, no merge sin autorización).
- Clasificación final: **no bloqueante**. Corrección documental incorporada: futuros reportes deben distinguir explícitamente entre "commit/push ejecutado por requisito del entorno" y "PR/merge no ejecutados".

## Trazabilidad de microciclos
- **MC-LOC-0**: diagnóstico read-only. Dictamen "A) No hay base suficiente; requiere contrato documental previo".
- **MC-LOC-1**: creación del contrato documental (commit `c4ccac1`).
- **MC-LOC-1A**: auditoría read-only del commit `c4ccac1`. Dictamen "B) APTO CON OBSERVACIÓN PROCEDIMENTAL".
- **MC-LOC-1B**: apertura del PR documental #24.
- **MC-LOC-1C**: verificación pre-merge. Dictamen "A) APTO PARA AUTORIZACIÓN DE MERGE SQUASH".
- **MC-LOC-1D**: merge squash autorizado y ejecutado. Commit `11d579e` en main.
- **MC-LOC-1E**: este registro histórico de cierre.

## Estado final
- **MC-LOC-1: cerrado.**
- **MC-LOC-2 técnico: NO habilitado.**

## Próxima condición
Cualquier avance técnico relacionado con location tracking requiere:

1. Un microciclo separado (MC-LOC-2) con orden explícita de Torre.
2. Cumplimiento punto por punto de la checklist documentada en `.torre/contratos/location-tracking/criterios_habilitacion_tecnica.md`.
3. Si el avance toca datos personales, ubicación real, IP o monitoreo de personas, debe abrirse adicionalmente un contrato legal/privacidad separado **antes** de cualquier código, según la regla vinculante de `.torre/contratos/location-tracking/privacidad.md`.

El nombre de la branch nunca autoriza implementación. Sin contrato y checklist verificada, MC-LOC-2 queda bloqueado.
