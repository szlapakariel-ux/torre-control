# Protocolo Principal — WhatsApp → Portero Local → Torre de Control → Repo Activo

> **Versión:** 1.0 (principal vigente)
> **Fecha de emisión:** 2026-05-02
> **Autoridad emisora:** Torre de Control
> **Microciclo de registro:** ORD-2026-05-02-01 (MC-1)
> **Estado:** vigente
> **Reemplaza a:** ningún protocolo previo (este es el primer protocolo principal explícito).
> **Subordina:** los documentos listados en [`.torre/historico.md`](./historico.md) pasan a consulta histórica. Los documentos base de cañería postal (`sistema.md`, `protocolo.md`, `roles.md`, `flujo.md`, `decisiones.md`, `README.md`, `estado.md`) siguen vigentes.
> **Regla de conflicto:** ver [`.torre/jerarquia_documental.md`](./jerarquia_documental.md).
>
> El texto desde la sección 1 hasta la 16 es **transcripción literal del protocolo emitido por Torre**. No se reinterpreta. Cualquier ambigüedad se eleva como conflicto a Torre.

---

## DOCUMENTO PRINCIPAL
## Protocolo WhatsApp → Portero Local → Torre de Control → Repo Activo

Estado: versión principal de diseño
Uso: referencia para diseñar la lógica del agente local
Proyecto: PLIC — Torre de Control
Autoridad: Torre de Control
Fecha base: 2026-05-02

---

### 1. PRINCIPIO GENERAL

Torre de Control es un ente único de gobierno operativo.

No existe una Torre distinta por cada repositorio.

Los repositorios de proyectos son gobernados por la lógica común de Torre de Control.

Ejemplos de repositorios gobernados:

- auditoria-sofse
- agente-saas
- otros proyectos futuros

La Torre define método, alcance, autorización, evidencia y cierre.

Cada repo del proyecto conserva su propia mesa local para registrar estado, pedidos, revisiones, bloqueos y evidencia.

La mesa local del proyecto no reemplaza a Torre.

---

### 2. DOCUMENTO PRINCIPAL Y ARCHIVO HISTÓRICO

Este documento queda como protocolo principal para el flujo:

WhatsApp → Portero Local → Torre → Claude Code → Repo Activo

Los documentos, notas o borradores anteriores quedan archivados como material de consulta histórica.

Si hay conflicto entre este documento principal y documentos anteriores, prevalece este documento.

Si el agente local encuentra una contradicción entre documentos, no debe improvisar.

Debe declarar conflicto de protocolo y escalar a Torre.

---

### 3. ROLES

#### ARIEL

Ariel es el usuario humano y dueño de la decisión final en cambios sensibles.

Ariel no debe actuar como cartero entre agentes.

El sistema debe darle opciones simples, numeradas y claras.

Ariel interviene cuando:

- hay que autorizar un diagnóstico;
- hay que autorizar un microciclo;
- hay bloqueo estructural;
- hay decisión humana real;
- hay cambio de alcance;
- hay riesgo de producción;
- hay autorización explícita pendiente.

---

#### WHATSAPP

WhatsApp es el canal rápido de entrada operativa.

WhatsApp no reemplaza a Torre.

WhatsApp no es un espacio para debates largos de arquitectura.

WhatsApp sirve para:

- elegir proyecto activo;
- consultar estado;
- autorizar opciones simples;
- recibir avisos relevantes;
- recibir bloqueos estructurales;
- continuar o suspender procesos.

---

#### PORTERO LOCAL

El Portero Local es la entrada operativa liviana al sistema Torre.

El Portero no es Torre.

El Portero no es Claude Code.

El Portero no es ejecutor técnico.

El Portero no autoriza merges.

El Portero no toca producción.

El Portero no decide alcance.

El Portero no abre microciclos por cuenta propia.

El Portero puede:

- recibir mensajes de Ariel por WhatsApp;
- detectar intención básica;
- responder consultas operativas simples;
- leer estado disponible;
- leer protocolos autorizados;
- leer logs autorizados;
- consultar estado git si está permitido;
- detectar falta de avance verificable;
- juntar evidencia parcial;
- escalar a Torre;
- informar estados claros a Ariel.

El Portero no puede:

- modificar código;
- modificar archivos sin autorización;
- crear ramas;
- abrir PR;
- mergear;
- tocar secrets;
- tocar workflows;
- tocar producción;
- activar Computer Use;
- ejecutar microciclos;
- decidir si un cambio es seguro;
- inventar contexto faltante.

---

#### TORRE DE CONTROL

Torre es la autoridad de método, alcance y autorización.

Torre decide:

- si corresponde diagnóstico read-only;
- si se abre microciclo;
- qué tipo de microciclo corresponde;
- qué repo está activo;
- qué alcance está permitido;
- qué archivos pueden tocarse;
- qué queda prohibido;
- si un bloqueo es estructural;
- si se escala a Ariel.

Torre no debe saltar etapas.

Regla madre:

Estabilizar → cerrar → medir → subir un nivel

No subir de nivel si no está cerrado.

No automatizar si no fue probado.

No sumar agentes si falta protocolo.

No tocar código si falta diagnóstico.

---

#### CLAUDE CODE / EJECUTOR

Claude Code es ejecutor.

Debe trabajar, cuando corresponda, abriendo dos repos juntos:

1. torre-control
2. repo del proyecto activo

Ejemplo:

torre-control + auditoria-sofse

o

torre-control + agente-saas

torre-control contiene la lógica general.

El repo activo contiene la evidencia técnica real.

Claude Code no debe decidir alcance por entusiasmo.

Claude Code debe ejecutar solo lo autorizado por Torre.

Si falta contexto, debe declarar bloqueo.

---

### 4. REGLA MULTI-REPO

Claude Code trabaja con:

- torre-control
- repo del proyecto activo

La fuente de reglas generales es torre-control.

La fuente de estado técnico verificable es el repo del proyecto.

La mesa local del proyecto registra estado, pedidos, revisiones y evidencia.

La mesa local no reemplaza a Torre.

Si hay conflicto de método, alcance o autorización, prevalece Torre.

Si hay conflicto entre lo que Torre espera y lo que el repo evidencia, se declara bloqueo.

Si falta contexto, se declara bloqueo.

No se improvisa.

---

### 5. FLUJO DE SELECCIÓN DE PROYECTO POR WHATSAPP

Ariel puede escribir por WhatsApp:

"Vamos a trabajar con auditoría SOFSE."

El Portero debe interpretar esto como selección de proyecto activo.

No debe iniciar diagnóstico automáticamente.

No debe tocar archivos.

No debe ejecutar nada.

Respuesta esperada del Portero:

Conexión establecida con la mesa local de auditoría SOFSE.

Estado actual: diagnóstico no iniciado.

Para avanzar, Torre necesita autorización:

1. Autorizar diagnóstico read-only
2. No autorizar
3. Dejar en suspenso

---

### 6. AUTORIZACIÓN DE DIAGNÓSTICO READ-ONLY

Si Ariel responde:

1

Entonces queda autorizado únicamente un diagnóstico read-only.

Diagnóstico read-only significa:

- relevar estado actual;
- revisar archivos de contexto;
- detectar pedidos pendientes;
- detectar revisiones abiertas;
- identificar bloqueos;
- proponer próximo microciclo.

Prohibido durante diagnóstico read-only:

- tocar código;
- modificar archivos;
- crear ramas;
- abrir PR;
- mergear;
- tocar producción;
- tocar secrets;
- tocar workflows;
- activar automatizaciones;
- ejecutar Computer Use.

Mensaje corto esperado:

Autorización recibida.

Se inicia diagnóstico read-only de auditoría SOFSE.

No se toca código, no se modifican archivos y no se abre PR.

Objetivo: relevar estado, detectar pendientes/bloqueos y proponer próximo microciclo.

---

### 7. RESULTADO ESPERADO DEL DIAGNÓSTICO

El diagnóstico debe devolver:

- proyecto activo;
- repo activo;
- mesa local detectada o no detectada;
- último cierre identificado;
- pedidos pendientes;
- revisiones pendientes;
- PRs relevantes si aplica;
- bloqueos;
- riesgos;
- recomendación de próximo microciclo;
- confirmación de que no se modificó nada.

Ejemplo de respuesta corta:

Diagnóstico read-only finalizado sobre auditoría SOFSE.

Estado encontrado:
- mesa local detectada;
- último cierre identificado;
- pendientes relevados;
- bloqueos revisados;
- código y producción sin tocar.

Recomendación de Torre:
autorizar próximo microciclo documental o declarar bloqueo.

Opciones:

1. Autorizar microciclo documental
2. Pedir ampliación de diagnóstico
3. Dejar en suspenso
4. Cancelar avance

---

### 8. AVANCE VERIFICABLE

Avance verificable significa evidencia comprobable.

No cuenta como avance verificable:

- "estoy trabajando";
- "estoy revisando";
- "ya casi";
- "sigo mirando";
- silencio;
- repetir la misma respuesta;
- logs sin novedad;
- abrir herramientas sin resultado.

Sí cuenta como avance verificable:

- se leyó un archivo concreto;
- se ejecutó un comando y dejó salida;
- se identificó un PR concreto;
- se revisó un diff;
- se detectó un conflicto concreto;
- se confirmó estado git;
- se generó reporte parcial;
- se identificó bloqueo con evidencia;
- se confirmó que no hay cambios.

Regla:

Si pasan 15 minutos sin evidencia nueva y comprobable, el Portero activa recuperación interna.

---

### 9. RECUPERACIÓN INTERNA A LOS 15 MINUTOS

Si un proceso lleva 15 minutos sin avance verificable, el Portero no debe avisar directamente a Ariel.

Primero debe juntar evidencia parcial y pasarla a Torre.

Flujo:

Proceso en curso
↓
15 minutos sin avance verificable
↓
Portero junta evidencia parcial
↓
Portero informa a Torre
↓
Torre revisa
↓
Torre intenta destrabar con nueva instrucción segura
↓
Si se destraba, continúa el proceso
↓
Si no se destraba, se declara bloqueo estructural
↓
Recién ahí se notifica a Ariel por WhatsApp

Evidencia mínima que debe juntar el Portero:

- proyecto activo;
- microciclo;
- ejecutor;
- tiempo sin avance;
- última acción registrada;
- último log relevante;
- estado git;
- archivos modificados si los hay;
- PR abierto si existe;
- error visible;
- hipótesis del Portero;
- decisión requerida de Torre.

---

### 10. BLOQUEO ESTRUCTURAL

Un bloqueo estructural ocurre cuando Torre no puede destrabar el proceso con una instrucción segura.

Causas posibles:

- falta decisión humana;
- falta autorización explícita;
- conflicto entre Torre y repo;
- cambio de alcance necesario;
- evidencia insuficiente;
- riesgo de tocar producción;
- riesgo de modificar algo no autorizado;
- contradicción entre documentos;
- ejecutor no puede avanzar sin intervención.

Mensaje a Ariel:

Bloqueo estructural detectado.

Torre revisó la evidencia parcial y no puede destrabar el proceso de forma segura.

No se modifica nada.

Opciones:

1. Revisar bloqueo
2. Cambiar alcance
3. Dejar en suspenso
4. Cancelar microciclo

---

### 11. ESTADOS VISIBLES DEL PROCESO

El Portero debe informar estados claros.

Estados permitidos:

1. Conectado
2. Diagnóstico no iniciado
3. Diagnóstico en curso
4. Avance verificable detectado
5. Recuperación interna activada
6. Bloqueo estructural
7. Diagnóstico finalizado
8. En suspenso

El Portero no debe usar frases ambiguas como:

- "estoy trabajando";
- "sigo revisando";
- "estamos viendo";
- "parece que avanza";
- "en breve".

Cada estado debe poder entenderse rápido.

---

### 12. OPCIONES NUMERADAS PARA ARIEL

Cada estado debe terminar, cuando corresponda, con opciones simples.

Ariel no debe redactar decisiones desde cero.

Ejemplos:

Diagnóstico no iniciado:

1. Autorizar diagnóstico read-only
2. No autorizar
3. Dejar en suspenso

Diagnóstico en curso:

1. Consultar avance
2. Dejar continuar
3. Suspender diagnóstico

Recuperación interna activada:

1. Consultar evidencia parcial
2. Dejar que Torre intente destrabar
3. Suspender proceso

Bloqueo estructural:

1. Revisar bloqueo
2. Cambiar alcance
3. Dejar en suspenso
4. Cancelar microciclo

Diagnóstico finalizado:

1. Autorizar microciclo sugerido
2. Pedir ampliación de diagnóstico
3. Dejar en suspenso
4. Cancelar avance

---

### 13. COMPUTER USE

Computer Use no está autorizado por default.

No forma parte del flujo normal.

Solo puede usarse si:

- Torre lo justifica;
- Ariel lo autoriza explícitamente;
- no existe alternativa programática más segura;
- queda registrado el motivo;
- queda definido alcance por tarea.

No se usa Computer Use para acciones que puedan resolverse con git, gh, scripts, APIs o lectura de archivos.

---

### 14. PROHIBICIONES GENERALES

Hasta nuevo microciclo, queda prohibido:

- escritura automática desde WhatsApp;
- ejecución automática desde WhatsApp;
- modificar repos de proyecto;
- tocar código;
- abrir PRs;
- mergear;
- tocar producción;
- tocar secrets;
- tocar workflows;
- activar Computer Use;
- crear puente Portero → Torre con capacidad ejecutiva;
- crear automatizaciones sin prueba;
- cambiar alcance sin autorización.

---

### 15. CRITERIO DE CIERRE DEL PROTOCOLO

Este protocolo queda cerrado cuando:

- está documentado en torre-control;
- los documentos anteriores quedan archivados como consulta histórica;
- este documento queda declarado como principal;
- el Portero Local tiene reglas claras de respuesta;
- Torre conserva autoridad de método y autorización;
- Ariel recibe opciones claras;
- el sistema evita que Ariel sea cartero;
- no se implementó ninguna capacidad nueva sin microciclo separado.

---

### 16. FRASE MADRE DEL FLUJO

WhatsApp despierta al Portero.

El Portero ordena el pedido.

Torre decide.

Claude Code ejecuta solo lo autorizado.

El repo activo aporta evidencia.

GitHub registra cierre verificable.

Ariel no actúa como cartero.
