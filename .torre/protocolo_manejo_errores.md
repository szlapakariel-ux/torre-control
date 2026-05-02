# Protocolo de manejo de errores y rollback

> **Fuente:** GPT/Torre, consultado el 2026-05-01 02:56.
> **Para:** sistema Torre de Control. Cualquier ejecutor (Claude, Codex, Claude Code) debe usar este documento como contrato verificable.

---

Protocolo formal de incidentes — Torre de Control

Regla madre:

Ante cualquier error grave, se detiene el avance, se congela el estado, se documenta evidencia y recién después se decide si se revierte, se corrige o se abre un nuevo microciclo.

No se arregla “sobre la marcha” sin registro.

0. Protocolo común para cualquier incidente

Aplica a todos los casos.

Orden obligatorio

Declarar incidente

Congelar avance

Preservar evidencia

Identificar alcance

Definir daño

Decidir acción

Ejecutar corrección

Verificar corrección

Documentar cierre

Recién ahí reabrir avance

Archivo mínimo del incidente

Crear un archivo en:

.mesa/incidentes/YYYY-MM-DD-incidente-XXX-descripcion-corta.md

Ejemplo:

.mesa/incidentes/2026-05-01-incidente-001-pr-mergeado-por-error.md
Estructura obligatoria del archivo
Markdown
# Incidente XXX — Título

## Fecha
YYYY-MM-DD

## Estado
ABIERTO / EN_CORRECCION / CERRADO

## Tipo de incidente
PR mergeado por error / ejecución falsa / ambigüedad / dato inventado / producción no autorizada

## Resumen
Qué pasó, en lenguaje directo.

## Evidencia
- PR:
- Commit:
- Rama:
- Archivo/s tocados:
- Agente involucrado:
- Mensaje o reporte que originó el incidente:

## Alcance
- Documental:
- Código:
- Runtime:
- Producción:
- Datos:
- Usuarios afectados:

## Decisión de Torre
Qué se decide hacer.

## Acción correctiva autorizada por Ariel
Qué autorizó Ariel explícitamente.

## Resultado
Qué se hizo finalmente.

## Verificación de cierre
Qué evidencia demuestra que el incidente quedó cerrado.

## Prevención futura
Qué regla nueva se incorpora para evitar repetición.
A) Un PR se mergeó por error
Definición

Un PR fue incorporado a master o rama protegida sin cumplir autorización, scope, revisión o evidencia requerida.

Qué hace Ariel

No autoriza nuevos PR.

Declara:

INCIDENTE: PR mergeado por error. Congelar avance.

Exige a Torre:

identificar PR,

commit de merge,

archivos afectados,

si tocó producción,

si requiere revert o corrección documental.

Ariel decide explícitamente una de estas opciones:

A) Revertir el merge.
B) Crear PR correctivo.
C) Mantener el merge, pero documentar excepción.
D) Bloquear proyecto hasta diagnóstico.
Qué hace Torre

Declara bloqueo del microciclo.

Abre archivo de incidente.

Identifica evidencia mínima:

número de PR,

commit de merge,

diff final,

archivos tocados,

si hubo cambios en runtime, producción, secrets, workflows o reglas activas.

Clasifica gravedad:

Nivel	Criterio
Bajo	Solo documentación, sin impacto operativo
Medio	Código mergeado, pero no activo
Alto	Código activo o posible impacto en usuarios
Crítico	Producción alterada sin autorización

Recomienda camino:

revert,

hotfix,

documentación correctiva,

congelamiento total.

Qué hacen los ejecutores

No ejecutan tareas nuevas.

No hacen pushes nuevos.

No abren PR correctivos sin orden.

Entregan evidencia:

comandos usados,

branch activa,

último commit,

diff,

estado del repo.

Si Torre lo autoriza, preparan una corrección en rama nueva.

Orden correcto
Ariel declara incidente
↓
Torre congela microciclo
↓
Ejecutor entrega evidencia
↓
Torre clasifica gravedad
↓
Ariel autoriza revert / hotfix / excepción
↓
Ejecutor aplica acción
↓
Torre verifica
↓
Se documenta cierre
Documentación obligatoria

Además del archivo de incidente, registrar:

.mesa/revisiones/revision-post-incidente-pr-XXX.md

Debe incluir:

causa raíz,

por qué pasó,

qué gate falló,

qué regla se agrega.

B) Un agente reportó éxito sin haber ejecutado
Definición

Un agente dice que completó una acción, pero no hay evidencia verificable de ejecución.

Ejemplos:

“PR creado” pero no existe PR.

“Tests pasaron” pero no hay output.

“Merge realizado” pero master no cambió.

“Archivo modificado” pero el diff está vacío.

Qué hace Ariel

No acepta el éxito informado.

Pide:

Mostrá evidencia verificable o declaralo como no ejecutado.

No autoriza avanzar al siguiente nivel.

Si se repite, Ariel puede degradar al agente:

Este agente queda solo como productor de propuestas, no como ejecutor.
Qué hace Torre

Marca el reporte como éxito no verificable.

Abre incidente.

Pide evidencia mínima según el caso:

Acción declarada	Evidencia requerida
PR creado	URL del PR + número
Commit hecho	SHA + diff
Test ejecutado	comando + salida
Merge hecho	commit en master
Archivo creado	path + contenido/diff
Deploy hecho	URL + healthcheck

Si no hay evidencia, Torre cambia el estado a:

NO EJECUTADO / REPORTE INVÁLIDO

Define si corresponde:

repetir ejecución,

reasignar a otro agente,

bajar nivel de confianza del ejecutor.

Qué hacen los ejecutores

El agente involucrado debe corregir el reporte.

Tiene que elegir una de estas frases:

Ejecutado con evidencia: [detalle]

o

No ejecutado. Reporté éxito por error.

Otros ejecutores no continúan el flujo hasta que Torre cierre el incidente.

Orden correcto
Agente reporta éxito
↓
Torre exige evidencia
↓
No hay evidencia
↓
Torre declara éxito no verificable
↓
Ariel congela avance
↓
Agente rectifica
↓
Torre decide repetir, reasignar o cerrar
↓
Se documenta incidente
Documentación obligatoria

Archivo:

.mesa/incidentes/YYYY-MM-DD-incidente-XXX-exito-no-verificable.md

Agregar una sección especial:

Markdown
## Frase incorrecta reportada
Texto exacto del agente.

## Evidencia faltante
Qué debía mostrar y no mostró.

## Corrección del estado
De "éxito" a "no ejecutado" / "parcial" / "fallido".
C) Una orden de Torre fue ambigua y dos agentes la interpretaron distinto
Definición

La orden no tenía suficiente precisión y dos agentes actuaron de manera diferente, generando riesgo de divergencia.

Ejemplo:

Uno entendió “documentar”.

Otro entendió “modificar código”.

Uno trabajó en repo A.

Otro trabajó en repo B.

Uno tomó producción.

Otro tomó staging.

Qué hace Ariel

No elige “al mejor resultado” sin revisión.

Declara:

La orden fue ambigua. Frenar y reconciliar.

Decide cuál interpretación queda válida.

Autoriza una orden corregida, no una continuación informal.

Qué hace Torre

Asume responsabilidad por ambigüedad.

Abre incidente.

Congela ambas ramas o acciones.

Compara interpretaciones:

Campo	Agente 1	Agente 2	Decisión válida
Repo			
Rama			
Nivel			
Archivos			
Producción			
Resultado			

Redacta una orden corregida con:

repo activo,

rama autorizada,

base autorizada,

nivel del microciclo,

archivos permitidos,

archivos prohibidos,

definición de éxito,

evidencia requerida.

Qué hacen los ejecutores

Frenan ejecución.

No intentan resolver entre ellos.

Reportan:

qué entendieron,

qué hicieron,

qué tocaron,

qué falta.

Esperan nueva orden unificada.

Orden correcto
Se detectan interpretaciones distintas
↓
Torre declara ambigüedad
↓
Se frenan agentes
↓
Cada agente reporta su interpretación
↓
Torre compara
↓
Ariel decide interpretación válida
↓
Torre emite orden corregida
↓
Ejecutor autorizado continúa
↓
Se documenta prevención
Documentación obligatoria

Archivo:

.mesa/incidentes/YYYY-MM-DD-incidente-XXX-orden-ambigua.md

Debe incluir:

Markdown
## Orden original
Texto exacto.

## Interpretación A
Qué entendió el agente A.

## Interpretación B
Qué entendió el agente B.

## Causa de ambigüedad
Qué faltó precisar.

## Orden corregida
Nueva versión autorizada.

## Regla preventiva
Qué campo será obligatorio desde ahora.
D) Un ejecutor inventó datos por no poder verificar
Definición

Un agente completó información sin evidencia real.

Ejemplos:

inventó un commit,

inventó que un test pasó,

asumió que producción estaba sana,

dijo que un archivo existía sin verlo,

supuso un estado de GitHub,

completó datos técnicos “por lógica”.

Qué hace Ariel

No discute el dato inventado como si fuera válido.

Declara:

Dato no verificable. Tratar como inventado hasta prueba contraria.

Puede bloquear al ejecutor para tareas de ejecución.

Autoriza revisión forense si el dato pudo afectar decisiones.

Qué hace Torre

Clasifica el incidente como fabricación de evidencia.

Abre incidente.

Separa tres cosas:

dato real,

dato inferido,

dato inventado.

Obliga a reemplazar el dato por una de estas etiquetas:

VERIFICADO
NO VERIFICADO
INFERIDO
INVENTADO POR ERROR

Revisa si alguna decisión previa se tomó usando ese dato.

Si hubo decisiones contaminadas, las invalida.

Qué hacen los ejecutores

El ejecutor involucrado debe retractar el dato.

Debe indicar:

No pude verificarlo. No debí afirmarlo como hecho.

Debe entregar solo evidencia real disponible.

Otro ejecutor puede ser asignado para verificación independiente.

Orden correcto
Se detecta dato dudoso
↓
Torre exige fuente
↓
No hay fuente
↓
Dato se marca como no verificable
↓
Si fue afirmado como hecho, se declara incidente
↓
Ariel congela decisiones basadas en ese dato
↓
Torre audita impacto
↓
Ejecutor rectifica
↓
Se corrige documentación
↓
Se cierra incidente
Documentación obligatoria

Archivo:

.mesa/incidentes/YYYY-MM-DD-incidente-XXX-dato-inventado.md

Debe incluir:

Markdown
## Dato afirmado
Texto exacto.

## Fuente solicitada
Qué evidencia debía existir.

## Fuente real
Existe / no existe.

## Clasificación final
VERIFICADO / NO VERIFICADO / INFERIDO / INVENTADO POR ERROR.

## Decisiones afectadas
Listado de decisiones que usaron ese dato.

## Corrección
Qué se reemplazó.
E) Un microciclo entró en producción con algo no autorizado
Definición

Un cambio llegó a producción sin autorización explícita de Ariel o sin cumplir gates previos.

Es el escenario más grave.

Qué hace Ariel

Declara incidente crítico:

INCIDENTE CRÍTICO: producción modificada sin autorización.

Ordena congelamiento total.

No autoriza nuevas funciones.

Decide prioridad:

A) Apagar feature.
B) Revertir deploy.
C) Activar modo seguro.
D) Hotfix mínimo.
E) Mantener temporalmente con monitoreo, solo si revertir es más riesgoso.

Exige reporte post-incidente antes de continuar cualquier microciclo.

Qué hace Torre

Bloquea el proyecto.

Abre incidente crítico.

Identifica:

qué entró,

cuándo entró,

por qué vía,

quién lo ejecutó,

qué usuarios o sistemas afectó,

cómo volver al estado anterior.

Separa el análisis en dos planos:

Plano técnico

commit,

deploy,

variables,

flags,

entorno,

endpoints,

base de datos,

logs.

Plano de autorización

qué estaba autorizado,

qué no estaba autorizado,

qué gate falló,

quién interpretó mal la orden,

dónde faltó bloqueo.

Propone acción inmediata de contención.

Pide autorización explícita de Ariel antes de ejecutar corrección, salvo que exista regla previa de emergencia.

Qué hacen los ejecutores

Frenan toda ejecución no relacionada con contención.

No hacen mejoras.

No refactorizan.

Solo pueden hacer una de estas acciones si Torre/Ariel lo autorizan:

revert
rollback
disable flag
hotfix mínimo
captura de logs
verificación de estado

Reportan evidencia antes y después.

Orden correcto
Se detecta producción no autorizada
↓
Ariel declara incidente crítico
↓
Torre congela proyecto
↓
Ejecutores frenan todo
↓
Torre identifica alcance
↓
Torre propone contención
↓
Ariel autoriza acción
↓
Ejecutor aplica acción mínima
↓
Torre verifica producción
↓
Se documenta causa raíz
↓
Se define regla preventiva
↓
Ariel autoriza reapertura
Documentación obligatoria

Archivo:

.mesa/incidentes/YYYY-MM-DD-incidente-XXX-produccion-no-autorizada.md

Debe incluir sí o sí:

Markdown
## Estado anterior conocido
Último estado seguro.

## Cambio no autorizado
Qué entró en producción.

## Vía de entrada
PR / merge directo / deploy automático / variable / workflow / otro.

## Impacto
Qué pudo afectar.

## Acción de contención
Qué se hizo para frenar daño.

## Verificación post-contención
Cómo se comprobó que producción volvió a estado seguro.

## Causa raíz
Qué permitió que pasara.

## Nueva regla obligatoria
Qué gate se agrega antes de producción.
Tabla resumen de actuación
Escenario	Ariel	Torre	Ejecutores	Nivel de bloqueo
PR mergeado por error	Autoriza revert/hotfix/excepción	Audita diff y gravedad	Frenan y entregan evidencia	Medio/alto
Éxito sin ejecución	No acepta avance	Marca éxito no verificable	Rectifican o prueban	Medio
Orden ambigua	Define interpretación válida	Reescribe orden	Frenan y reportan interpretación	Medio
Datos inventados	Invalida dato	Audita impacto	Rectifican y verifican	Alto
Producción no autorizada	Declara crítico	Congela proyecto	Solo contención autorizada	Crítico
Regla preventiva general

Desde este protocolo, ningún agente puede cerrar una tarea con “éxito” si no entrega al menos una evidencia verificable.

Formato obligatorio de cierre:

ESTADO: éxito / parcial / fallido / no ejecutado

EVIDENCIA:
- PR:
- Commit:
- Rama:
- Diff:
- Tests:
- Logs:
- Archivos tocados:

LIMITACIONES:
- Qué no pude verificar.
- Qué queda pendiente.
Prompt unificado para pasar a Claude / Codex / ejecutor
Actuá como ejecutor técnico/documental bajo protocolo de Torre de Control.

OBJETIVO
Aplicar el protocolo formal de incidentes para el siguiente caso:

[PEGAR AQUÍ EL INCIDENTE]

REGLAS OBLIGATORIAS
1. No avances con nuevas tareas.
2. No modifiques producción.
3. No hagas merge.
4. No inventes datos.
5. No declares éxito sin evidencia.
6. Si algo no puede verificarse, escribí: NO VERIFICADO.
7. Si una acción no fue ejecutada, escribí: NO EJECUTADO.
8. Si detectás ambigüedad, frená y declarala.
9. Si el incidente toca producción, tratá el caso como CRÍTICO.

TAREAS
1. Identificá el tipo de incidente:
   - PR mergeado por error
   - éxito reportado sin ejecución
   - orden ambigua
   - dato inventado/no verificable
   - producción no autorizada

2. Recolectá evidencia:
   - repo
   - rama
   - PR
   - commit
   - diff
   - archivos tocados
   - estado de producción si aplica
   - logs o salida de comandos si aplica

3. Clasificá gravedad:
   - bajo
   - medio
   - alto
   - crítico

4. Proponé acción correctiva, sin ejecutarla todavía:
   - revert
   - hotfix
   - documentación correctiva
   - bloqueo
   - rollback
   - disable flag
   - nueva orden corregida

5. Prepará el contenido del archivo de incidente en:
   .mesa/incidentes/YYYY-MM-DD-incidente-XXX-descripcion-corta.md

FORMATO DE RESPUESTA
Responder con:

1. Tipo de incidente detectado
2. Gravedad
3. Evidencia encontrada
4. Evidencia faltante
5. Riesgo
6. Acción recomendada
7. Acción que requiere autorización explícita de Ariel
8. Borrador del archivo de incidente
9. Estado final:
   - BLOQUEADO
   - LISTO PARA AUTORIZACIÓN
   - NO EJECUTADO

---

## Prompt original enviado a Torre

```
Como Torre del proyecto Torre de Control, respondé esto sin usar conectores ni MCP:

Listame el protocolo formal para los siguientes escenarios de error:
(a) un PR se mergeo por error
(b) un agente reporto exito sin haber ejecutado
(c) una orden de Torre fue ambigua y dos agentes la interpretaron distinto
(d) un ejecutor invento datos por no poder verificar
(e) un microciclo entro en produccion algo no autorizado

Para cada uno: que hago yo (Ariel), que hace Torre, que hacen los ejecutores, en que orden, y como se documenta el incidente.
```
