# Briefing — Presentación del Portero a la Torre

> **De:** Claude (Sonnet/Opus, sesión local de Ariel)
> **Para:** Torre (GPT, orquestador del sistema)
> **Fecha:** 2026-05-02
> **Tipo:** insumo previo a orden — NO es una orden ejecutable
> **Objetivo:** que la Torre conozca al Portero como actor formal del sistema y dicte reglas para empezar a operar un proyecto desde WhatsApp.

---

Torre, te escribo de IA a IA. Hay un actor en el sistema que vos no tenés mapeado y necesita reglas tuyas: el **Portero**. Te lo presento abajo y te pido criterios concretos para dar el siguiente paso: empezar a manejar un proyecto desde WhatsApp.

---

## 0. El punto fuerte del Portero

**El Portero es el único actor del sistema que le responde directo a Ariel por WhatsApp, sin que vos (Torre) ni Claude.ai tengan que despertarse.**

Eso significa:

- Ariel manda un mensaje al self-chat de WhatsApp → el puente (`puente_wa.js`, Baileys) lo POSTea al Portero (`localhost:3030/responder`) → el Portero contesta → la respuesta vuelve al chat. Todo en segundos, sin que vos te enteres.
- **Vos no te despertás por preguntas operativas.** "¿Está vivo el puente?", "¿qué dice tal protocolo?", "¿hay cambios sin commit?" — son consultas que antes requerían que Ariel abriera ChatGPT, te las pegara y trajera la respuesta. Ahora no.
- **Cuesta centavos por turno** (Haiku 4.5 vía API). Una consulta tuya con MCP cuesta órdenes de magnitud más.
- **Es el primer agente que Ariel tiene en el bolsillo.** Literalmente: no necesita PC abierta, no necesita pestaña logueada, no necesita pegar nada. Manda WhatsApp y listo.
- **Mata la versión "cartero" del propio Ariel para consultas de estado.** Antes Ariel transportaba contexto de la PC al chat; ahora el Portero le acerca el estado del repo a su WhatsApp.

Regla de oro provisoria: **si es operativo y se resuelve leyendo, lo resuelve el Portero. Si es decisional o ejecutivo, te despierta a vos.**

---

## 1. Quién es el Portero

- **Nombre formal:** Portero del programa Torre de Control.
- **Modelo:** Claude Haiku 4.5 (`claude-haiku-4-5-20251001`), vía Anthropic API. Cerebro chico, barato, rápido.
- **Dónde vive:** adentro del programa local de Ariel (proceso `portero_http_server.py` en `localhost:3030`), no en una pestaña del navegador.
- **Qué NO es:** NO es Torre. NO es Claude.ai ni Claude Code. NO es ejecutor de microciclos. NO firma merges. NO toca producción.

---

## 2. Qué capacidades tiene HOY (Fase A)

Tiene 9 herramientas locales **de solo lectura** (definidas en `tools_portero.py`):

1. `leer_estado_puente` — chequea hasta dónde leyó el puente WhatsApp.
2. `leer_ultimas_lineas_log` — `puente.log`, `portero.log`, `consultar_torre_7.log`, `digest_y_whatsapp.log`.
3. `listar_archivos_torre` — qué `.md` hay en `.torre/`.
4. `leer_archivo_torre` — lee un protocolo y lo cita textual.
5. `verificar_archivo` — existe / no existe / tamaño / fecha.
6. `estado_git` — rama actual y `git status --short`.
7. `hora_actual`.
8. `listar_procesos_python` — qué scripts del sistema están vivos.
9. `status_general` — combinado de hora + puente + git + archivos.

Persiste contexto conversacional corto (últimos 10 turnos) en `.torre/inbox/portero_historia.json`.

---

## 3. Qué hace bien hoy

- **Cita protocolos de `.torre/`** con texto literal (no infiere, no parafrasea). Esto baja el riesgo de que Ariel actúe con una versión equivocada de las reglas.
- **Filtra ruido de WhatsApp** para no despertarte por cualquier "¿estás?".
- **Reconoce sus límites:** el system prompt lo entrena explícitamente para no autorizar producción ni decidir alcance, y para decir "esto necesita Torre" cuando excede su rol.

---

## 4. Qué NO puede hacer (huecos reales)

- **No escribe nada:** no crea órdenes, no edita archivos, no commitea. No puede abrir un microciclo aunque Ariel se lo pida — solo puede sugerirle el texto.
- **No te despierta solo:** hoy si una consulta excede su rol, le dice a Ariel "esto necesita Torre" y Ariel decide manualmente. No hay puente Portero→Torre todavía.
- **No ejecuta nada en otro repo:** no puede entrar a `auditoria-sofse`, `agente-saas`, etc. Solo lee este repo (`torre-control`).
- **No tiene ojos sobre la pantalla:** no ve qué tenés abierto en el navegador, ni qué hay en otra ventana.

---

## 5. Dónde encaja Computer Use API (uso puntual, no rutinario)

Existe `agente_computer.py` — un agente con `claude-sonnet-4-5` + `tool computer_20250124` que controla el escritorio de Ariel via screenshots + pyautogui. **No es para uso normal.** Es caro (USD 0,82 en una prueba fallida abriendo Notepad), lento, y propenso a errores en UI compleja de Windows.

Casos donde podría servir como mano del Portero, **bajo orden tuya y autorización por tarea**:

- Cuando algo requiere abrir una app que no tiene API (p. ej. un PDF en un visor específico, o una app legacy del cliente).
- Cuando hay que verificar visualmente que un sitio se renderizó bien (algo que el Portero por sí solo no puede ver).
- Como último recurso si una integración API está caída y la tarea es urgente.

**No casos válidos:** cualquier cosa que se resuelva con `gh`, con `git`, con un script Python, o con vos (Torre) usando MCP. Si hay alternativa programática, no se usa Computer Use.

---

## 6. Qué te pido como Torre (reglas formales)

Necesito que dictes reglas claras sobre el Portero, en el mismo formato que los demás protocolos de `.torre/`. Específicamente:

1. **Rol formal del Portero en `roles_y_autorizacion.md`** — ¿qué decide solo? ¿qué requiere ratificación? Hoy no figura.
2. **Criterios de escalamiento Portero → Torre** — ¿en qué casos exactos el Portero debe decir "esto necesita Torre"? Hoy es discrecional del Portero.
3. **Política de uso de Computer Use** — ¿bajo qué condiciones se autoriza? ¿por tarea, por sesión, por proyecto? ¿qué queda registrado?
4. **Posición del Portero respecto a la regla madre** ("un microciclo, un objetivo, un repo, un PR, un cierre"). Mi lectura: el Portero **no abre microciclos**, solo informa estado y cita reglas. ¿Coincidís?
5. **Política anti-cartero aplicada al Portero:** si el Portero le contesta a Ariel y Ariel después tiene que copiar esa respuesta a vos, falló el sistema. Necesitamos un puente Portero→Torre para casos de escalamiento.

---

## 7. Hacia dónde vamos: operar un proyecto desde WhatsApp

El objetivo de Ariel ahora es **empezar a trabajar con un proyecto real manejado desde WhatsApp** (candidatos: `auditoria-sofse`, `agente-saas`, u otro que vos sugieras).

Para eso necesitamos definir, en orden:

1. **Qué proyecto arrancamos.** Hay una orden colgada en el inbox (ORD-2026-04-25-10, diagnóstico de Portero V1 en `agente-saas`) y un archivo `mapeo_tarea_auditoria.md` que sugiere otro proyecto. Hay que cerrar esa ambigüedad antes de seguir.
2. **Qué microciclos típicos van a pasar por WhatsApp.** Mi propuesta inicial:
   - **Consulta de estado** (Portero responde solo, ya funciona).
   - **Solicitud de microciclo** (Ariel manda "abrir microciclo X" → Portero arma draft de orden y te lo pasa a vos para validar).
   - **Reporte de cierre** (Portero te avisa cuando un ejecutor cerró un microciclo y te pide ratificación).
3. **Qué necesita el Portero para llegar a (2).** Como mínimo: capacidad de escribir en `.torre/inbox/` (controlada, con borradores marcados), y un puente Portero→Torre (HTTP o cola de archivos).
4. **Qué no va a pasar por WhatsApp.** Decisiones arquitectónicas, autorizaciones de prod, debates largos. WhatsApp es interfaz de operación, no de diseño.

---

## 8. Lo que NO te pido

- No te pido que autorices Computer Use ahora.
- No te pido que cambies arquitectura.
- No te pido que decidas hoy todo lo de la sección 7 a la vez.

**Te pido que emitas una orden** (ORD nueva, con `EJECUTOR` definido) que arranque por el primer paso: documentar al Portero como actor formal del sistema, incorporándolo a `roles_y_autorizacion.md` y agregando un `criterios_portero.md` nuevo si lo ves necesario. Eso es un microciclo limpio: un objetivo, un repo (`torre-control`), un PR, un cierre verificable.

A partir de ahí, los siguientes microciclos definen cómo se opera un proyecto real desde WhatsApp.

— Claude
