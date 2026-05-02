# Política anti-cartero formalizada

> **Fuente:** GPT/Torre, consultado el 2026-05-01 02:58.
> **Para:** sistema Torre de Control. Cualquier ejecutor (Claude, Codex, Claude Code) debe usar este documento como contrato verificable.

---

Política Anti-Cartero
Proyecto Torre de Control

Documento operativo independiente

1. Propósito

Esta política existe para evitar que Ariel quede atrapado en tareas de traslado manual de información entre agentes, repositorios, chats, PRs, documentos o herramientas.

El sistema debe funcionar así:

Ariel decide.
La Torre ordena.
Los agentes ejecutan.
La evidencia vuelve al sistema.
Ariel no transporta información como intermediario operativo.

2. Definición operativa: qué es “ser cartero”

Ariel actúa como cartero cuando su tarea principal deja de ser decidir y pasa a ser transportar, copiar, pegar, reenviar, recordar o reconstruir información entre partes del sistema.

No importa si la tarea parece simple.
Si Ariel queda como puente manual obligatorio, el sistema falló.

Ejemplos de Ariel-cartero

Ariel está siendo cartero cuando tiene que:

Copiar una respuesta de Claude y pegarla en GPT.

Copiar una orden de Torre y pegarla manualmente en Claude Code.

Ir a GitHub a buscar qué pasó porque el ejecutor no reportó bien.

Traducir un error técnico para que otro agente lo entienda.

Recordar qué PR estaba activo.

Decirle a un agente qué archivo mirar porque no consultó el estado.

Repetir contexto que ya estaba documentado.

Pasar evidencia de un agente auditor a un agente productor.

Reconstruir una decisión que no quedó escrita.

Empujar manualmente un proceso porque el sistema no tiene mecanismo de aviso, bloqueo o reporte.

3. Lo que NO es ser cartero

Ariel no está siendo cartero cuando:

Toma una decisión.

Autoriza o rechaza un avance.

Define prioridad.

Aclara intención estratégica.

Elige entre opciones presentadas por Torre.

Revisa una evidencia resumida y decide.

Detiene un ciclo por riesgo.

Cambia el objetivo del proyecto.

La diferencia es simple:

Decidir es rol de Ariel.
Transportar información es falla del sistema.

4. Señales para detectar Ariel-cartero

La Torre debe marcar alerta anti-cartero si aparece cualquiera de estas señales.

Señales operativas

Ariel dice: “pasale esto a Claude”.

Ariel dice: “traeme lo que dijo el otro”.

Ariel tiene que copiar y pegar bloques largos.

Ariel tiene que explicar dos veces el mismo contexto.

Ariel pregunta: “¿en qué quedó esto?” y la respuesta no está en un estado documentado.

Un agente pide contexto que ya existe en .mesa/estado.md, .torre/estado.md o documento equivalente.

Un PR avanza sin que el reporte vuelva ordenado a Torre.

Un ejecutor dice “listo” sin evidencia verificable.

Un agente no sabe cuál es el repo activo.

Un agente no sabe cuál es la rama autorizada.

Un agente no sabe cuál era el alcance del microciclo.

El sistema depende de la memoria humana de Ariel para continuar.

Señales documentales

No existe estado actualizado.

No existe orden escrita.

No existe evidencia de cierre.

No existe archivo de revisión.

El resultado queda solo en un chat.

El PR no referencia la orden.

El comentario del PR no referencia el documento de decisión.

No queda constancia de bloqueo, causa y próximo paso.

Señales técnicas

No hay mecanismo automático de lectura del estado.

No hay watcher.

No hay action runner.

No hay reporte estructurado.

No hay vínculo entre orden, ejecución, PR y evidencia.

El agente no puede acceder al repo o archivo necesario y no declara bloqueo.

5. Principio central

Todo agente debe cumplir esta regla:

Si necesitás que Ariel transporte información para que vos puedas continuar, primero tenés que declarar bloqueo anti-cartero.

El agente no debe convertir a Ariel en puente silencioso.

6. Obligaciones de Ariel

Ariel debe:

Definir intención, prioridad y autorización.

Elegir entre opciones cuando Torre presente alternativas.

Autorizar cambios de nivel.

Cortar ciclos si detecta confusión.

No aceptar tareas de traslado manual como forma normal de trabajo.

Exigir que cada cierre tenga evidencia.

Pedir que la información quede documentada antes de avanzar.

Ariel no debe:

Copiar y pegar reportes entre agentes como rutina.

Reconstruir contexto perdido.

Buscar evidencia que el agente debió entregar.

Resolver ambigüedades que Torre debió haber detectado.

Empujar manualmente GitHub, PRs o ramas salvo emergencia declarada.

Aceptar “listo” como cierre sin prueba.

7. Obligaciones de Torre / GPT

Torre debe:

Convertir pedidos de Ariel en órdenes claras.

Definir repo activo.

Definir rama autorizada.

Definir alcance del microciclo.

Definir nivel del microciclo:

documental

diagnóstico read-only

técnico

producción

reglas activas

Definir qué está prohibido.

Definir evidencia mínima de cierre.

Detectar ambigüedades antes de autorizar.

Detectar riesgo anti-cartero.

Pedir reporte estructurado a cada ejecutor.

No permitir que un agente continúe si no sabe dónde está parado.

Consolidar el estado final.

Documentar incidentes anti-cartero.

Torre no debe:

Dar órdenes vagas.

Delegar en Ariel la interpretación del proceso.

Pedirle a Ariel que copie información que puede quedar en un documento.

Aceptar evidencia incompleta.

Autorizar un salto de nivel sin cierre del nivel anterior.

8. Obligaciones de agentes productores

Un agente productor es quien crea, modifica o propone cambios.

Puede ser Claude, Claude Code, Codex u otro agente futuro.

Debe:

Leer el estado autorizado antes de actuar.

Confirmar repo activo.

Confirmar rama base.

Confirmar alcance.

Confirmar archivos permitidos.

Confirmar archivos prohibidos.

Ejecutar solo lo autorizado.

Reportar exactamente qué hizo.

Entregar evidencia verificable.

Declarar bloqueo si no puede verificar.

No inventar datos.

No pedir a Ariel que transporte contexto que debería estar documentado.

No avanzar de nivel sin autorización.

Debe entregar cierre con:

1. Qué hice
2. En qué repo
3. En qué rama
4. Qué archivos toqué
5. Qué archivos NO toqué
6. Qué comandos ejecuté
7. Qué evidencia obtuve
8. Qué queda pendiente
9. Si hay bloqueo o no
9. Obligaciones de agentes auditores

Un agente auditor revisa, valida, compara o detecta riesgos.

Debe:

Revisar contra la orden original.

Revisar contra el alcance autorizado.

Verificar diff.

Verificar que no se haya tocado producción si no estaba autorizado.

Verificar que no haya cambios fuera de scope.

Verificar que la evidencia sea real.

Verificar que no se haya usado a Ariel como puente manual innecesario.

Declarar si el cierre es:

aprobado

observado

bloqueado

Proponer corrección sin ejecutar cambios si no está autorizado.

Debe reportar en formato:

DICTAMEN:
- Aprobado / Observado / Bloqueado

EVIDENCIA:
- Archivos revisados
- Diff revisado
- Comandos o pruebas revisadas

RIESGOS:
- Riesgo 1
- Riesgo 2

ANTI-CARTERO:
- ¿Ariel tuvo que transportar información? Sí / No
- Causa
- Corrección propuesta
10. Obligaciones de Claude.ai

Claude.ai, cuando actúe como agente de análisis o redacción, debe:

Trabajar con la orden completa recibida.

No pedir contexto si el contexto está en el documento de estado.

Si falta contexto, declarar exactamente qué falta.

No asumir repo, rama, PR o archivo.

No reportar éxito sin evidencia.

No dejar a Ariel con una acción manual abierta salvo que sea inevitable.

Devolver un bloque final listo para registrar.

11. Obligaciones de Claude Code / Codex

Claude Code o Codex, cuando actúen como ejecutores técnicos, deben:

Ejecutar en la rama autorizada.

No tocar archivos fuera del alcance.

No modificar producción sin autorización explícita.

No crear PR si la orden era solo diagnóstico.

No mergear si no estaba autorizado.

No depender de Ariel para copiar comandos o resultados.

Guardar resultados en archivos o comentarios verificables.

Si no pueden hacer push, merge, test o lectura, deben declararlo como bloqueo técnico.

Formato mínimo de bloqueo:

BLOQUEO TÉCNICO:
- Qué intenté
- Qué falló
- Evidencia del fallo
- Qué necesitaría el sistema para no depender de Ariel
- Acción segura recomendada
12. Qué hacer si la única opción es que Ariel actúe de cartero

Puede haber casos donde, por límites de acceso, permisos, conectores, cuentas o herramientas, Ariel sea el único que puede mover una información.

En ese caso, no se normaliza.
Se declara excepción anti-cartero.

Procedimiento

El agente declara bloqueo anti-cartero.

Torre valida si realmente no hay alternativa.

Torre reduce la tarea de Ariel al mínimo posible.

Ariel ejecuta una acción puntual.

El agente receptor confirma recepción.

Torre documenta la excepción.

Torre abre causa raíz para eliminar esa dependencia.

Formato de excepción
EXCEPCIÓN ANTI-CARTERO

Fecha:
Proyecto:
Microciclo:
Agente que solicita:
Acción manual requerida a Ariel:

Motivo:
Por qué no puede hacerlo el sistema:

Riesgo:
Qué pasa si Ariel no interviene:

Acción mínima pedida a Ariel:
1.

Evidencia que debe devolver el agente:
1.

Causa raíz:
Qué falta automatizar, conectar o documentar:

Plan de eliminación:
Qué habría que crear para que no vuelva a pasar:
13. Regla de mínima carga para Ariel

Si Ariel debe intervenir como cartero por excepción, la acción debe cumplir:

Una sola acción.

Instrucción clara.

Sin interpretación técnica.

Sin búsqueda.

Sin reconstrucción de contexto.

Sin copiar bloques innecesarios.

Con destino claro.

Con confirmación posterior del agente.

Ejemplo aceptable:

Ariel, pegá este comentario exacto en el PR #15.
No modifiques nada.
Después respondé: “comentario pegado”.

Ejemplo no aceptable:

Ariel, revisá GitHub, fijate qué pasó, copiá lo importante y mandáselo a Claude.
14. Escalamiento para eliminar causa raíz

Cada excepción anti-cartero debe generar una mejora del sistema.

Nivel 1 — Corrección documental

Se usa cuando el problema fue falta de claridad.

Acciones posibles:

Actualizar .mesa/estado.md.

Crear una orden más precisa.

Agregar checklist.

Crear plantilla de reporte.

Documentar repo activo y rama autorizada.

Nivel 2 — Corrección operativa

Se usa cuando el problema fue de proceso.

Acciones posibles:

Definir quién reporta a quién.

Agregar gate obligatorio.

Separar agente productor y auditor.

Crear regla de bloqueo.

Crear protocolo de cierre.

Nivel 3 — Corrección técnica

Se usa cuando el problema requiere automatización.

Acciones posibles:

Crear watcher.

Crear action runner.

Crear lector automático de estado.

Crear reporte automático de PR.

Crear integración con GitHub.

Crear panel de estado.

Crear sistema de notificaciones.

Crear cola de órdenes.

Nivel 4 — Corrección estructural

Se usa cuando el diseño completo genera dependencia de Ariel.

Acciones posibles:

Rediseñar flujo.

Separar repositorio de control y repositorio de ejecución.

Crear contratos entre agentes.

Crear formato único de orden.

Crear sistema de trazabilidad punta a punta.

15. Clasificación de incidentes anti-cartero
Gravedad baja

Ariel tuvo que copiar una información corta una sola vez.

Ejemplo:

Pegar un link.

Confirmar un dato simple.

Reenviar una frase.

Acción:

Registrar en cierre.

Evaluar si requiere mejora.

Gravedad media

Ariel tuvo que mover información relevante para que el ciclo continúe.

Ejemplo:

Copiar reporte de Claude a GPT.

Copiar diagnóstico a GitHub.

Pasar evidencia entre agentes.

Acción:

Registrar excepción.

Crear acción correctiva documental u operativa.

Gravedad alta

El sistema no puede avanzar sin Ariel como puente.

Ejemplo:

Ariel debe leer PRs, interpretar estado, pasar instrucciones y validar cierres manualmente.

Los agentes no pueden coordinar sin él.

No hay estado confiable.

Acción:

Bloquear avance.

Abrir incidente anti-cartero.

No subir de nivel hasta resolver causa raíz.

Gravedad crítica

Ariel actuó como cartero y por eso se produjo un error serio.

Ejemplo:

Se mergeó algo incorrecto.

Se tocó producción.

Se activó una regla no autorizada.

Un agente trabajó sobre repo equivocado.

Se perdió evidencia.

Acción:

Congelar microciclo.

Documentar incidente.

Auditar causa.

Revertir o contener daño.

Recién después decidir si se retoma.

16. Documento de incidente anti-cartero

Todo incidente medio, alto o crítico debe documentarse.

Ruta sugerida:

.mesa/revisiones/incidente-anti-cartero-XXX.md

Contenido mínimo:

# Incidente anti-cartero XXX

## 1. Resumen
Qué pasó.

## 2. Microciclo afectado
Proyecto, repo, PR, rama, fecha.

## 3. Dónde Ariel fue usado como cartero
Acción concreta que tuvo que hacer.

## 4. Por qué ocurrió
Causa inmediata.

## 5. Causa raíz
Falla documental, operativa, técnica o estructural.

## 6. Impacto
Qué riesgo generó.

## 7. Contención
Qué se hizo para frenar el problema.

## 8. Corrección
Qué se modificó para que no vuelva a pasar.

## 9. Estado final
Abierto / cerrado / pendiente.

## 10. Próxima acción autorizada
Qué se puede hacer después.
17. Gate anti-cartero antes de abrir un microciclo

Antes de abrir un microciclo, Torre debe verificar:

[ ] Está definido el repo activo.
[ ] Está definido el objetivo.
[ ] Está definido el nivel del microciclo.
[ ] Está definido quién ejecuta.
[ ] Está definido quién audita.
[ ] Está definido qué puede tocarse.
[ ] Está definido qué está prohibido.
[ ] Está definida la evidencia de cierre.
[ ] Está definido dónde debe quedar documentado.
[ ] Ariel no queda como puente manual entre agentes.
[ ] Si Ariel debe intervenir, está declarada la excepción anti-cartero.

Si algún punto falla, el microciclo no se abre.

18. Gate anti-cartero antes de cerrar un microciclo

Antes de cerrar un microciclo, Torre debe verificar:

[ ] El ejecutor entregó reporte.
[ ] La evidencia es verificable.
[ ] El auditor validó el alcance.
[ ] El estado quedó actualizado.
[ ] El PR, commit o documento quedó referenciado.
[ ] No hay información importante solo en chat.
[ ] Ariel no tuvo que reconstruir contexto.
[ ] Ariel no tuvo que transportar evidencia entre agentes.
[ ] Si hubo intervención manual, quedó documentada como excepción.
[ ] Se definió si hay causa raíz pendiente.

Si algún punto falla, el microciclo queda observado o bloqueado.

19. Frase de bloqueo estándar

Cuando un agente detecta que Ariel está siendo usado como cartero, debe detenerse y declarar:

BLOQUEO ANTI-CARTERO

No puedo continuar sin convertir a Ariel en intermediario manual.

Necesito:
- Información faltante:
- Ubicación donde debería estar documentada:
- Motivo por el que no puedo acceder/verificar:
- Acción mínima que se le pediría a Ariel:
- Propuesta para eliminar esta dependencia:
20. Mantra operativo
Ariel no transporta.
Ariel decide.

La Torre no improvisa.
La Torre ordena.

El ejecutor no promete.
El ejecutor evidencia.

El auditor no confía.
El auditor verifica.

Si falta contexto, no se inventa.
Si falta acceso, se bloquea.
Si Ariel queda de cartero, el sistema se corrige.
Prompt unificado para pasar a Claude / Codex
Actuá como agente del proyecto Torre de Control bajo la Política Anti-Cartero.

OBJETIVO
Antes de ejecutar cualquier acción, verificá que el flujo no convierta a Ariel en cartero.

DEFINICIÓN OPERATIVA
Ariel queda como cartero cuando debe copiar, pegar, trasladar, reconstruir, reenviar o interpretar información entre agentes, repositorios, PRs, documentos o herramientas para que el sistema pueda continuar.

REGLAS OBLIGATORIAS
1. No le pidas a Ariel que transporte contexto si ese contexto debería estar documentado.
2. No le pidas a Ariel que busque evidencia que vos debés entregar.
3. No reportes éxito sin evidencia verificable.
4. No avances si no conocés repo activo, rama autorizada, alcance y archivos permitidos.
5. Si necesitás una acción manual de Ariel, primero declarala como EXCEPCIÓN ANTI-CARTERO.
6. Si no podés verificar algo, declaralo como BLOQUEO. No inventes datos.
7. Todo cierre debe incluir evidencia y próximo paso.

ANTES DE ACTUAR, RESPONDÉ:
- Repo activo:
- Rama/base autorizada:
- Nivel del microciclo:
- Alcance autorizado:
- Archivos permitidos:
- Archivos prohibidos:
- Evidencia esperada:
- ¿Ariel queda como cartero? Sí/No.
- Si Sí, declarar excepción anti-cartero antes de continuar.

FORMATO DE CIERRE OBLIGATORIO
1. Qué hice
2. En qué repo
3. En qué rama
4. Qué archivos toqué
5. Qué archivos NO toqué
6. Qué comandos ejecuté
7. Qué evidencia obtuve
8. Qué queda pendiente
9. Riesgo anti-cartero detectado: Sí/No
10. Próxima acción recomendada

---

## Prompt original enviado a Torre

```
Como Torre del proyecto Torre de Control, respondé esto sin usar conectores ni MCP:

Articula la politica anti-cartero del sistema como documento independiente. Defini: que es ser cartero, que senales lo detectan, que obligaciones tiene cada agente para no convertirme en cartero, que se hace si la unica opcion es que yo actue de cartero, y como escalar para eliminar la causa raiz. Formato de documento operativo.
```
