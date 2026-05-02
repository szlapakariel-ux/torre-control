# Criterios de escalamiento de nivel

> **Fuente:** GPT/Torre, consultado el 2026-05-01 02:54.
> **Para:** sistema Torre de Control. Cualquier ejecutor (Claude, Codex, Claude Code) debe usar este documento como contrato verificable.

---

Criterios formales para subir un microciclo de nivel

Secuencia obligatoria:

Documental → Diagnóstico read-only → Técnico → Producción → Reglas activas

Regla madre:

Un microciclo no sube de nivel por intención.
Sube de nivel cuando el nivel anterior queda cerrado con evidencia verificable.

1. Salto: Documental → Diagnóstico read-only
Objetivo del salto

Pasar de una idea, pedido o problema redactado a una inspección real del repositorio, sin modificar nada.

Tiene que estar cerrado del nivel documental

Debe existir:

1. Pedido escrito

El problema debe estar formulado en un documento o instrucción clara.

Debe incluir:

qué se quiere revisar

por qué se revisa

qué repo corresponde

qué archivos o zonas podrían estar involucradas

qué está permitido hacer

qué está prohibido tocar

2. Alcance declarado

Debe quedar definido si el microciclo es:

documental

diagnóstico

técnico

producción

reglas activas

Para este salto, el nuevo alcance autorizado es:

diagnóstico read-only

3. Repo activo identificado

Debe estar claro cuál es el repo operativo real.

Ejemplo:

repo activo: auditoria-sofse

repo de contexto: torre-control

No se puede diagnosticar si hay duda sobre el repo correcto.

4. Pregunta de diagnóstico definida

No alcanza con decir “revisar”.

Debe haber una pregunta concreta.

Ejemplo correcto:

Verificar si el flujo desde mensaje entrante hasta feedback o revisión está documentado, implementado o disperso.

Ejemplo insuficiente:

Mirá cómo está todo.

Evidencia requerida

Para autorizar el paso se necesita:

documento o pedido visible

objetivo del diagnóstico

repo activo confirmado

alcance read-only confirmado

prohibición explícita de modificar archivos

criterio de salida del diagnóstico

Bloquea el salto

Bloquea pasar a diagnóstico si:

no está claro el repo activo

el pedido mezcla varios problemas grandes

no se distingue idea de ejecución

no hay pregunta concreta

se pide diagnosticar y corregir al mismo tiempo

se autoriza al agente a “mejorar” sin límites

el pedido toca producción sin haberlo declarado

2. Salto: Diagnóstico read-only → Técnico
Objetivo del salto

Pasar de mirar y entender el estado real del sistema a modificar archivos técnicos.

Tiene que estar cerrado del diagnóstico read-only

Debe existir un diagnóstico terminado que diga:

1. Qué se revisó

Archivos, carpetas, PRs, ramas, endpoints o reglas inspeccionadas.

Ejemplo:

.mesa/estado.md

.mesa/pedidos/

app_minimal.py

endpoints /api/...

reglas JSON

PR abierto

rama activa

2. Qué se encontró

Debe diferenciar:

hechos verificados

sospechas

hipótesis

problemas confirmados

problemas no confirmados

3. Qué no se tocó

Debe declarar explícitamente que no se modificó:

código

runtime

producción

secrets

workflows

variables de entorno

base de datos

reglas activas

4. Dictamen técnico

Debe haber una recomendación clara:

avanzar

no avanzar

avanzar con condiciones

dividir en microciclos

volver a documental

5. Alcance técnico propuesto

Debe decir exactamente qué se modificaría.

Ejemplo:

Crear únicamente flujo_operativo_mensajes.md, sin modificar runtime.

O:

Modificar solo rules/message_classifier.py y tests asociados.

Evidencia requerida

Para autorizar el paso a técnico se necesita:

diagnóstico escrito

lista de archivos inspeccionados

lista de hallazgos

lista de riesgos

propuesta de cambio acotada

archivos permitidos

archivos prohibidos

rama autorizada

base autorizada

criterio de prueba

criterio de cierre

Bloquea el salto

Bloquea pasar a técnico si:

el diagnóstico no distingue hechos de hipótesis

no se sabe qué archivos se van a tocar

el cambio propuesto es demasiado amplio

hay contradicción de repo, rama o PR

el agente propone corregir producción directamente

no hay criterio de prueba

no hay criterio de rollback

el cambio técnico mezcla reglas, runtime y producción sin separación

falta autorización explícita de Ariel

3. Salto: Técnico → Producción
Objetivo del salto

Pasar de cambios técnicos mergeados o preparados a una ejecución real en entorno productivo o equivalente.

Tiene que estar cerrado del nivel técnico

Debe existir cierre técnico con:

1. Cambios implementados

Debe indicarse:

rama usada

base usada

commit o PR

archivos modificados

archivos no modificados

diff final

2. Pruebas ejecutadas

Debe haber evidencia de pruebas.

Según el caso:

tests unitarios

smoke test local

validación de endpoints

validación de JSON

validación de estructura documental

comparación antes/después

ejecución con modo seguro

3. Diff verificado

El diff debe coincidir con el alcance autorizado.

Ejemplo:

Permitido:

app/services/portero_notas.py

tests/test_portero_notas.py

Prohibido:

secrets

workflows

variables de entorno

deploy config

producción

módulos no relacionados

4. Riesgo declarado

Debe quedar claro:

qué puede romperse

qué no debería afectarse

cómo se detecta el error

cómo se vuelve atrás

5. Estado de feature flag

Si existe feature flag, debe estar declarado.

Ejemplo:

PORTERO_V1_NOTAS=false por defecto

activación solo en staging

allowlist de un usuario

no producción masiva

Evidencia requerida

Para autorizar producción se necesita:

PR mergeado o cambio listo con commit identificado

diff final verificado

tests o smoke test ejecutados

resultado de pruebas

declaración de no tocar áreas prohibidas

plan de activación controlada

plan de rollback

autorización explícita de Ariel

Bloquea el salto

Bloquea pasar a producción si:

no hay commit identificable

no hay diff verificado

fallaron tests relevantes

hay archivos fuera de alcance

se tocaron secrets, workflows o variables sin autorización

no existe rollback

no existe feature flag cuando el cambio lo requiere

producción quedaría activada para todos de golpe

no hay evidencia de que el cambio técnico esté cerrado

Ariel no autorizó explícitamente

4. Salto: Producción → Reglas activas
Objetivo del salto

Pasar de tener el sistema funcionando en producción a considerar una regla, flujo o comportamiento como criterio operativo vigente.

Tiene que estar cerrado del nivel producción

Debe existir evidencia de producción controlada:

1. Deploy o activación confirmada

Debe saberse:

dónde está activo

desde cuándo

con qué commit

bajo qué configuración

para qué usuarios o casos

2. Smoke test productivo

Debe probarse el flujo mínimo real.

Ejemplo:

entra mensaje

se clasifica

pasa a revisión o feedback

se registra evidencia

no rompe la bandeja

no altera reglas no relacionadas

3. Monitoreo inicial

Debe revisarse si hubo:

errores

falsos positivos

falsos negativos

respuestas inesperadas

problemas de permisos

problemas de datos

latencia o fallos de endpoint

4. Validación humana

Antes de pasar a regla activa, debe haber revisión humana.

En proyectos de comunicación o reglas operativas, esto es obligatorio.

Debe quedar claro:

quién validó

qué casos validó

cuántos casos revisó

qué casos quedaron afuera

qué dudas siguen abiertas

5. Criterio de vigencia

La regla activa debe quedar escrita.

Debe incluir:

nombre de la regla

cuándo aplica

cuándo no aplica

ejemplos aprobados

ejemplos rechazados

severidad

salida esperada del sistema

relación con reglas existentes

Evidencia requerida

Para autorizar reglas activas se necesita:

commit productivo identificado

configuración productiva conocida

smoke test real exitoso

casos reales validados

registro de errores o ausencia de errores

documento de regla final

ejemplos aprobados

decisión explícita de activación

responsable de validación

fecha de entrada en vigencia

Bloquea el salto

Bloquea pasar a reglas activas si:

solo se probó en local

no hay casos reales

no hay validación humana

no está escrita la regla final

hay contradicción con reglas vigentes

no se sabe si aplica a todas las líneas o solo a una

no están definidos los casos límite

hay falsos positivos sin resolver

hay falsos negativos sin resolver

el sistema clasifica pero no explica por qué

Ariel no aprobó la regla como vigente

Matriz resumida
Salto	Nivel anterior debe cerrar	Evidencia mínima	Bloqueo principal
Documental → Diagnóstico read-only	Pedido claro, repo activo, alcance definido	Pedido escrito, pregunta de diagnóstico, prohibición de modificar	Repo dudoso, pedido amplio, mezcla diagnóstico con corrección
Diagnóstico read-only → Técnico	Diagnóstico completo y sin cambios	Hallazgos, riesgos, archivos permitidos, propuesta técnica	No hay diff previsto, no hay prueba, falta autorización
Técnico → Producción	Cambio implementado y probado	Commit, PR, diff, tests, rollback, feature flag	Tests fallan, diff fuera de alcance, riesgo no controlado
Producción → Reglas activas	Producción controlada y validada	Smoke real, casos reales, validación humana, regla escrita	Sin casos reales, sin validación, contradicción normativa
Regla de autorización por nivel
Documental

Puede avanzar con orden clara de Torre si no toca runtime.

Diagnóstico read-only

Puede avanzar si solo inspecciona y no modifica.

Técnico

Requiere autorización explícita de Ariel.

Producción

Requiere autorización explícita de Ariel y evidencia técnica cerrada.

Reglas activas

Requiere autorización explícita de Ariel y validación humana de criterio operativo.

Fórmula de cierre antes de subir un nivel

Antes de autorizar cualquier salto, la Torre debe poder responder:

Qué nivel estamos cerrando.

Qué evidencia demuestra que está cerrado.

Qué nivel queremos abrir.

Qué queda permitido.

Qué queda prohibido.

Qué condición detiene el avance.

Qué resultado esperado cierra el próximo microciclo.

Si una de esas siete respuestas falta, no se sube de nivel.

---

## Prompt original enviado a Torre

```
Como Torre del proyecto Torre de Control, respondé esto sin usar conectores ni MCP:

Listame los criterios formales para autorizar pasar un microciclo de un nivel al siguiente: documental -> diagnostico read-only -> tecnico -> produccion -> reglas activas. Para cada salto: que tiene que estar cerrado del nivel anterior, que evidencia se requiere, que bloquea el salto. Formato estructurado.
```
