# Contrato — Location Tracking en Torre de Control

## Microciclo
MC-LOC-1 — contrato documental. Sucede a MC-LOC-0 (diagnóstico read-only), cuyo dictamen fue "A) No hay base suficiente; requiere contrato documental previo".

## Qué es location tracking para Torre
En el contexto de Torre de Control, "location tracking" significa **trazabilidad operativa de la ubicación de trabajo** de los agentes y microciclos. Es decir, dejar registro explícito de:

- en qué **repo** está trabajando un agente,
- en qué **branch**,
- en qué **microciclo activo**,
- qué **archivo o área documental** está tocando,
- qué **estado operativo** tiene ese trabajo (diagnóstico, documental, técnico, bloqueado, listo para PR, mergeado),
- qué **agente responsable** está al mando del paso.

Es trazabilidad de proceso, no de personas.

## Qué NO es location tracking en este contrato
- No es geolocalización real de personas.
- No es coordenadas GPS.
- No es seguimiento de usuarios finales de ningún producto.
- No es captura de IP, dispositivo, sesión ni navegador.
- No es monitoreo productivo automático de personas (productividad, presencia, horarios).
- No es tracking silencioso ni encubierto.

## Por qué se crea este contrato
La branch `claude/add-location-tracking-P11J6` lleva un nombre potencialmente ambiguo. Antes de que cualquier agente interprete "location tracking" como geolocalización real y abra un microciclo técnico de riesgo alto, Torre fija por escrito el alcance autorizado.

## Regla central
**El nombre de una branch no autoriza implementación.**
Solo un contrato documental aprobado por Torre, más el cumplimiento de los `criterios_habilitacion_tecnica.md`, puede habilitar un eventual MC-LOC-2 técnico. Este contrato, por sí solo, no habilita código, no habilita tracking real, no habilita producción.

## Archivos del contrato
- `README.md` — este documento.
- `alcance.md` — alcance incluido, excluido e interpretaciones descartadas.
- `privacidad.md` — declaración de privacidad de MC-LOC-1 y regla futura.
- `criterios_habilitacion_tecnica.md` — qué hace falta para autorizar MC-LOC-2.
