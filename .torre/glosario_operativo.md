# Glosario operativo

> **Fuente:** GPT/Torre, consultado el 2026-05-01 02:53.
> **Para:** sistema Torre de Control. Cualquier ejecutor (Claude, Codex, Claude Code) debe usar este documento como contrato verificable.

---

Glosario operativo — Torre de Control

Versión base para usar como referencia común entre Ariel, Torre, Claude, Claude Code, Codex y agentes futuros.

1. Microciclo

Definición operativa:
Unidad mínima de trabajo autorizable, ejecutable y cerrable.

Un microciclo debe tener:

objetivo único;

alcance definido;

repo activo definido;

base autorizada definida;

agente responsable;

criterios de cierre;

evidencia verificable;

prohibiciones explícitas.

No es microciclo:
Una idea general, una conversación abierta, una investigación sin cierre o una tarea que mezcla muchas decisiones a la vez.

2. Evidencia verificable

Definición operativa:
Dato concreto que permite comprobar que algo ocurrió o que una condición se cumplió.

Ejemplos válidos:

número de PR;

URL de PR;

commit SHA;

lista exacta de archivos modificados;

resultado de tests;

salida de comando;

estado de merge;

diff confirmado;

mensaje publicado en un PR;

archivo creado con ruta exacta.

No cuenta como evidencia:
“Está listo”, “parece bien”, “lo revisé”, “debería funcionar”, “creo que quedó”.

3. Ariel-cartero

Definición operativa:
Situación en la que Ariel queda obligado a transportar manualmente información entre agentes, repositorios, chats o herramientas para que el sistema continúe funcionando.

Ocurre cuando:

Ariel copia y pega reportes entre agentes;

Ariel debe avisar manualmente que hay una tarea nueva;

Ariel debe recordar el estado de cada repo;

Ariel debe empujar procesos que deberían estar automatizados;

Ariel se convierte en el puente operativo entre GPT, Claude, GitHub, Codex u otros agentes.

Objetivo del sistema:
Reducir al mínimo el rol de Ariel-cartero.

4. Subir un nivel

Definición operativa:
Cambiar el foco desde la ejecución puntual hacia la regla, estructura, protocolo o arquitectura que evita repetir el mismo problema.

Ejemplo:

Nivel bajo: “Arreglar este PR”.

Nivel superior: “Definir el protocolo para que ningún PR se abra sin base autorizada”.

Nivel más alto: “Diseñar el sistema de gates que evita PRs fuera de alcance”.

Se debe subir un nivel cuando:

el mismo error se repite;

Ariel queda haciendo de cartero;

hay confusión entre repositorios;

los agentes ejecutan sin control;

el problema no es técnico sino de flujo.

5. Repo activo

Definición operativa:
Repositorio sobre el cual se está autorizando, ejecutando o auditando un microciclo.

Debe estar declarado antes de iniciar.

Ejemplo:

Repo activo: szlapakariel-ux/agente-saas

Regla:
Solo el repo activo puede recibir cambios dentro del microciclo autorizado.

6. Repo de contexto

Definición operativa:
Repositorio que puede ser consultado para entender arquitectura, reglas, antecedentes o decisiones, pero que no está autorizado para recibir modificaciones en ese microciclo.

Ejemplo:

Repo activo: auditoria-sofse
Repo de contexto: torre-control

Regla:
Un repo de contexto puede informar decisiones, pero no puede ser modificado sin nueva autorización.

7. Agente productor

Definición operativa:
Agente encargado de generar un entregable.

Puede producir:

código;

documento;

diagnóstico;

PR;

propuesta técnica;

archivo de reglas;

reporte de ejecución.

Ejemplos posibles:

Claude Code;

Codex;

Claude.ai;

agente futuro especializado.

Límite:
El agente productor no debe cerrar su propio trabajo sin auditoría cuando el cambio afecta código, reglas, producción o decisiones importantes.

8. Agente auditor

Definición operativa:
Agente encargado de revisar, validar o rechazar el trabajo producido por otro agente.

Debe verificar:

alcance;

archivos tocados;

riesgos;

evidencia;

cumplimiento de gates;

coherencia con la orden;

ausencia de cambios prohibidos.

Regla:
El auditor no debe modificar el entregable auditado salvo que el microciclo lo autorice explícitamente.

9. Rama autorizada

Definición operativa:
Branch específica sobre la cual un agente puede trabajar dentro de un microciclo.

Debe estar declarada por nombre.

Ejemplo:

Rama autorizada: docs/decision-smoke-local-portero-v1-notas

Regla:
No se puede cambiar de rama, crear otra rama o reutilizar una rama vieja sin informar y justificar.

10. Base autorizada

Definición operativa:
Commit, branch o estado de referencia desde el cual debe partir el trabajo.

Ejemplo:

Base autorizada: master @ 4c31551204a0d4691d42a3499f0cc34c7fcb0f2c

Función:
Evita trabajar sobre ramas viejas, estados inconsistentes o commits que no contienen decisiones previas.

Regla:
Si la base cambió, el agente debe declararlo antes de continuar.

11. Alcance documental

Definición operativa:
Microciclo que solo puede crear o modificar archivos de documentación, diagnóstico, pedidos, revisiones o estado.

Ejemplos:

.mesa/estado.md
.mesa/pedidos/...
.mesa/revisiones/...
README.md
docs/...

Prohibido en alcance documental:

modificar runtime;

modificar código de aplicación;

tocar variables de entorno;

tocar workflows;

tocar producción;

cambiar lógica funcional;

activar features.

12. Alcance técnico

Definición operativa:
Microciclo que puede modificar código, tests, estructura técnica o lógica interna, pero sin activar producción ni cambiar configuración sensible.

Puede incluir:

servicios;

funciones;

tests;

validadores;

endpoints;

helpers;

refactors controlados.

Debe tener:

objetivo técnico concreto;

archivos permitidos;

archivos prohibidos;

tests esperados;

evidencia de ejecución.

13. Alcance producción

Definición operativa:
Microciclo que puede afectar un entorno real, deploy, configuración activa, variables de entorno, usuarios reales o comportamiento visible del sistema.

Incluye:

Render;

Railway;

Vercel;

variables de entorno;

secrets;

activación de flags;

cambios en servicios reales;

cambios visibles para usuarios.

Regla:
Requiere autorización explícita de Ariel.

14. Bloqueo

Definición operativa:
Condición que impide continuar sin riesgo de error, pérdida de control o ejecución fuera de alcance.

Ejemplos:

repo incorrecto;

base no verificada;

rama vieja;

diff con archivos no autorizados;

tests fallando sin explicación;

falta de evidencia;

producción involucrada sin autorización;

contradicción entre orden y ejecución;

agente sin permisos suficientes;

información crítica ausente.

Regla:
Ante bloqueo, no se improvisa. Se declara bloqueo.

15. Declaración de bloqueo

Definición operativa:
Mensaje formal que detiene el avance y expone el motivo exacto del bloqueo.

Debe incluir:

BLOQUEO DETECTADO
Tipo:
Evidencia:
Riesgo:
Qué se necesita para destrabar:
Qué NO se debe hacer mientras tanto:

Ejemplo:

BLOQUEO DETECTADO

Tipo: base no autorizada.
Evidencia: la rama parte de un commit anterior al último merge en master.
Riesgo: duplicar archivos ya mergeados o abrir un PR contaminado.
Para destrabar: crear rama limpia desde master actual.
No hacer: mergear el PR actual.
16. Gate

Definición operativa:
Punto de control obligatorio antes de avanzar a una etapa de mayor impacto.

Un gate puede validar:

apertura de microciclo;

creación de rama;

creación de PR;

merge;

ejecución técnica;

smoke test;

activación en staging;

activación en producción.

Regla:
Si un gate no pasa, el sistema no avanza.

17. Mantra: Estabilizar → cerrar → medir → subir

Definición operativa:
Secuencia obligatoria para evitar dispersión, deuda operativa y ciclos abiertos.

Estabilizar

Ordenar el estado actual.

Implica:

saber dónde estamos;

confirmar repo activo;

confirmar base;

confirmar qué está abierto;

detectar contradicciones;

evitar ejecutar en falso.

Cerrar

Terminar el microciclo actual antes de abrir otro.

Implica:

PR mergeado o cerrado;

evidencia registrada;

estado actualizado;

próximos pasos claros;

sin tareas ambiguas abiertas.

Medir

Verificar con evidencia.

Implica:

tests;

smoke test;

diff;

logs;

outputs;

comparación con criterios de cierre.

Subir

Convertir lo aprendido en regla, protocolo o mejora estructural.

Implica:

documentar el patrón;

evitar repetir el error;

reducir dependencia de Ariel;

mejorar el sistema de coordinación.

18. Orden

Definición operativa:
Instrucción formal que habilita un microciclo.

Debe incluir:

objetivo;

repo activo;

base autorizada;

rama autorizada o criterio para crearla;

alcance;

agente ejecutor;

prohibiciones;

criterios de cierre;

evidencia requerida.

No es orden válida:
“Avanzá”, “seguí”, “hacelo”, “revisá todo”, “arreglá lo que veas”.

19. Criterio de cierre

Definición operativa:
Condición concreta que permite declarar terminado un microciclo.

Ejemplos:

PR creado y no mergeado;

PR mergeado con commit SHA;

archivo documental creado;

comentario publicado en PR;

tests ejecutados con resultado;

diff verificado;

bloqueo declarado correctamente.

20. Diff limpio

Definición operativa:
Conjunto de cambios que coincide exactamente con el alcance autorizado.

Ejemplo válido:

1 archivo tocado:
.mesa/revisiones/decision-x.md

Ejemplo inválido:

Archivo esperado:
.mesa/revisiones/decision-x.md

Archivo inesperado:
app/services/runtime.py

Regla:
Si aparece un archivo inesperado, el gate no pasa.

21. PR contaminado

Definición operativa:
Pull request que incluye cambios no autorizados, duplicados, heredados de una rama vieja o ajenos al microciclo.

Causas típicas:

rama creada desde base vieja;

squash merge previo no reconocido por la rama;

mezcla de tareas;

cambios manuales no declarados;

arrastre de commits anteriores.

Acción correcta:
No mergear. Cerrar o rehacer desde rama limpia.

22. Estado consolidado

Definición operativa:
Resumen confiable del punto actual del sistema después de cerrar un microciclo.

Debe incluir:

qué se hizo;

qué no se hizo;

qué quedó abierto;

último commit válido;

PRs relevantes;

riesgos pendientes;

próximo paso recomendado.

23. Autorización explícita de Ariel

Definición operativa:
Confirmación directa de Ariel para avanzar en acciones de impacto alto.

Requieren autorización explícita:

merge a master;

cambios de producción;

activación de flags;

modificación de secrets;

creación de deploy real;

cambio de alcance;

cierre de una decisión importante;

pasar de diagnóstico a ejecución técnica;

tocar usuarios reales o datos reales.

No alcanza con inferir intención.

24. Ratificación de Torre

Definición operativa:
Validación de control emitida por la Torre antes de permitir que un agente avance.

La Torre ratifica cuando:

revisa coherencia;

verifica alcance;

confirma que no hay bloqueo;

valida que el siguiente paso corresponde;

transforma una intención en orden ejecutable.

25. Decisión documental

Definición operativa:
Decisión registrada en archivo o comentario verificable, sin modificar código ni producción.

Sirve para:

dejar trazabilidad;

cerrar ambigüedades;

condicionar PRs;

definir alcance;

evitar discusiones repetidas.

26. Decisión técnica

Definición operativa:
Decisión que afecta implementación, arquitectura, lógica, tests, servicios, validadores o estructura del sistema.

Debe quedar respaldada por:

motivo;

alcance;

archivos afectados;

tests esperados;

riesgos;

plan de reversión si aplica.

27. Decisión productiva

Definición operativa:
Decisión que afecta un entorno real o usuarios reales.

Ejemplos:

activar una función;

cambiar variable en producción;

modificar deploy;

conectar servicio real;

cambiar comportamiento visible;

habilitar automatización sobre datos reales.

Regla:
Siempre requiere autorización explícita de Ariel.

28. Smoke test

Definición operativa:
Prueba mínima para confirmar que una funcionalidad arranca y responde sin romper lo básico.

No reemplaza una prueba completa.

Debe indicar:

entorno usado;

variables activadas;

usuario o dato de prueba;

pasos ejecutados;

resultado obtenido;

errores detectados.

29. Staging

Definición operativa:
Entorno separado de producción donde se puede probar una funcionalidad con menor riesgo.

Debe estar claramente diferenciado de producción.

No es staging:
Producción con una bandera apagada, salvo que Ariel autorice explícitamente un canary productivo.

30. Canary productivo

Definición operativa:
Prueba limitada dentro de producción, controlada por flag, allowlist o condición de acceso.

Tiene riesgo productivo aunque esté limitada.

Regla:
Requiere autorización explícita de Ariel.

31. Flag

Definición operativa:
Variable o condición que activa o desactiva una funcionalidad sin cambiar el código en ese momento.

Ejemplo:

PORTERO_V1_NOTAS=true

Regla:
Cambiar un flag en producción es alcance producción.

32. Allowlist

Definición operativa:
Lista explícita de usuarios habilitados para acceder a una funcionalidad en prueba.

Sirve para limitar impacto.

Ejemplo:

PORTERO_V1_USUARIOS_PERMITIDOS=usuario_1
33. Sin runtime

Definición operativa:
Condición que prohíbe modificar archivos o configuraciones que afecten la ejecución del sistema.

Incluye:

servicios;

endpoints;

lógica de aplicación;

imports;

configuración de ejecución;

dependencias;

variables;

workflows;

deploy.

34. Sin producción

Definición operativa:
Condición que prohíbe cualquier acción que afecte usuarios reales, entornos reales, deploys activos o configuración productiva.

Incluye:

no tocar Render/Railway/Vercel productivo;

no cambiar env vars;

no activar flags reales;

no modificar secrets;

no disparar workflows productivos;

no usar datos reales sin autorización.

35. Agente ejecutor

Definición operativa:
Agente que realiza acciones concretas dentro de un microciclo.

Puede ser productor o auditor según el rol asignado.

Ejemplos:

Claude Code ejecutando cambios;

Codex proponiendo código;

Claude.ai redactando diagnóstico;

Action Runner ejecutando comandos permitidos.

36. Torre

Definición operativa:
Capa de control que organiza decisiones, autoriza pasos, detecta bloqueos, define gates y protege el alcance del sistema.

La Torre no debe reemplazar a Ariel en decisiones de impacto alto.

Debe:

ordenar;

reducir ambigüedad;

exigir evidencia;

impedir saltos de alcance;

evitar que Ariel quede como cartero;

convertir aprendizajes en reglas.

37. Ariel

Definición operativa:
Dueño de la decisión final en temas de prioridad, riesgo, negocio, producción y dirección del proyecto.

Ariel autoriza explícitamente:

merges importantes;

cambios productivos;

cambios de alcance;

decisiones de negocio;

activación de funcionalidades;

continuidad o cierre de ciclos.

38. Regla de oro operativa

Antes de ejecutar, el sistema debe poder responder:

Qué se va a hacer.
Dónde se va a hacer.
Quién lo va a hacer.
Con qué límite.
Qué está prohibido.
Cómo se va a verificar.
Quién autoriza el siguiente paso.

Si alguna respuesta falta, no se ejecuta: se declara bloqueo o se pide definición.

---

## Prompt original enviado a Torre

```
Como Torre del proyecto Torre de Control, respondé esto sin usar conectores ni MCP:

Armame el glosario operativo del sistema. Definiciones precisas, sin metaforas, definicion operativa. Inclui al menos: microciclo, evidencia verificable, Ariel-cartero, subir un nivel, repo activo, repo de contexto, agente productor, agente auditor, rama autorizada, base autorizada, alcance documental vs tecnico vs produccion, bloqueo, declaracion de bloqueo, gate, mantra Estabilizar->cerrar->medir->subir.
```
