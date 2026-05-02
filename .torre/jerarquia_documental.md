# Jerarquía documental del sistema Torre

> **Versión:** 1.0
> **Fecha:** 2026-05-02
> **Microciclo de registro:** ORD-2026-05-02-01 (MC-1)
> **Estado:** vigente

Este archivo declara qué documentos rigen el sistema, en qué orden de prevalencia, y cómo se resuelven los conflictos entre ellos.

---

## Capas del sistema documental

El sistema Torre se estructura en **tres capas** de documentos. Cada capa tiene una función distinta y una autoridad distinta.

### Capa 1 — Protocolo principal vigente

Documentos que definen método, alcance, autorización y evidencia del flujo operativo actual. Emitidos por Torre.

- [`protocolo_principal.md`](./protocolo_principal.md) — protocolo principal `WhatsApp → Portero Local → Torre → Repo Activo`. Versión 1.0.

**Autoridad:** Torre. **Modificación:** solo via microciclo emitido por Torre.

### Capa 2 — Cañería postal vigente

Documentos base del sistema postal `.torre/` que sostienen la mecánica del ciclo (orden → ejecución → reporte → archivado). Siguen vigentes y operativos. El protocolo principal **se apoya** sobre ellos, no los reemplaza.

- [`sistema.md`](./sistema.md) — qué es la Torre y cómo se estructura.
- [`protocolo.md`](./protocolo.md) — reglas operativas del ciclo.
- [`roles.md`](./roles.md) — quién hace qué (Torre, operador, repo, Ariel).
- [`flujo.md`](./flujo.md) — cómo fluye un ciclo (creación, ejecución, reporte, cierre, archivado).
- [`decisiones.md`](./decisiones.md) — por qué el diseño es así.
- [`README.md`](./README.md) — entrada rápida.
- [`estado.md`](./estado.md) — estado del último ciclo cerrado.

**Autoridad:** Torre. **Modificación:** solo via microciclo emitido por Torre.

### Capa 3 — Consulta histórica subordinada

Documentos previos que **no son normativos** y se conservan como referencia histórica. Su contenido no rige el sistema actual; cualquier conflicto contra Capa 1 o Capa 2 se resuelve a favor de las capas superiores.

Lista completa: [`historico.md`](./historico.md).

**Autoridad:** Torre. **Modificación:** los documentos históricos no se modifican; se conservan tal cual quedaron.

---

## Reglas de prevalencia

1. **Capa 1 prevalece sobre Capa 2 y Capa 3.**
   Ante conflicto entre el protocolo principal y un documento de cañería postal o un documento histórico, prevalece el protocolo principal.

2. **Capa 2 prevalece sobre Capa 3.**
   Ante conflicto entre cañería postal y un documento histórico, prevalece la cañería postal.

3. **Conflicto dentro de Capa 1.**
   No debería existir: hay un único `protocolo_principal.md` vigente. Si en el futuro se versionan, vale la versión declarada vigente en este archivo.

4. **Conflicto entre Capa 1 y Capa 2.**
   No es esperable: el protocolo principal se apoya sobre la cañería postal. Si un agente detecta que el protocolo principal **exige algo que contradice** la cañería postal vigente (`sistema.md`, `protocolo.md`, etc.), **declara bloqueo estructural** y escala a Torre. No improvisa.

5. **Conflicto entre dos documentos de Capa 3.**
   Indeterminado. Se trata como información histórica: ningún documento de Capa 3 es normativo. Si se necesita decidir entre ellos, se escala a Torre.

---

## Comportamiento esperado de los agentes

### Portero Local

- Lee documentos de cualquier capa cuando se le pide citar protocolos.
- Si Ariel pregunta por una regla, prioriza Capa 1, luego Capa 2, luego Capa 3.
- Si detecta una **contradicción concreta** que afecta una acción a tomar, declara conflicto de protocolo y escala a Torre. No resuelve el conflicto por su cuenta.

### Claude Code / ejecutor

- Antes de actuar, verifica que la orden recibida es coherente con Capa 1.
- Si la orden contradice Capa 1, **declara bloqueo** y se detiene.
- No infiere reglas desde Capa 3 si Capa 1 o Capa 2 cubren el caso.

### Torre

- Es la única autoridad para emitir, modificar o subordinar documentos de cualquier capa.
- Resuelve conflictos escalados.
- Decide cuándo un documento histórico debe archivarse físicamente o seguir disponible en `.torre/` para consulta.

---

## Procedimiento ante conflicto

Si un agente detecta una contradicción concreta entre documentos:

1. **No improvisar.** No elegir una versión por su cuenta.
2. **Identificar los documentos en conflicto.** Citar archivo y sección de cada uno.
3. **Identificar la acción afectada.** Qué decisión concreta depende de resolver el conflicto.
4. **Declarar conflicto de protocolo.** En el reporte del microciclo en curso, en sección `[RIESGO]` o equivalente.
5. **Escalar a Torre.** Esperar resolución antes de continuar.

---

## Modificación de esta jerarquía

Esta declaración de jerarquía es vigente hasta que Torre emita un microciclo que la modifique. Cualquier cambio (agregar capas, mover documentos entre capas, redefinir reglas de prevalencia) requiere microciclo documental aparte y queda registrado en `historial/`.
