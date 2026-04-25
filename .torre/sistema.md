# Sistema Torre

## Qué es la Torre

La Torre es un sistema de coordinación entre un humano (la Torre) y uno o más operadores IA (Claude Code, Codex, otros). No es código ejecutable: es un protocolo y una convención de carpetas dentro del repositorio.

La Torre **decide** qué hay que hacer. Los operadores IA **ejecutan**. El repositorio **transporta** las órdenes y los reportes.

## Problema que resuelve

Antes de la Torre, el flujo era:

- La Torre tenía la idea.
- Un humano intermediario (Ariel) la traducía en instrucciones, las pegaba en un agente IA, leía la respuesta, la traía de vuelta a la Torre, etc.
- El humano intermediario era cuello de botella, fuente de errores y dependencia crítica.

Eso convierte al humano en cartero. No escala, se rompe cuando el cartero está ocupado, y el contexto se pierde entre saltos.

La Torre elimina al cartero: la orden vive en el repo, el operador IA la lee del repo, escribe el reporte en el repo y se detiene. El humano vuelve cuando quiere y mira el repo.

## Arquitectura: repo como centro postal

GitHub (el repo) es el centro postal. Toda comunicación entre Torre y operadores pasa por commits en una carpeta convencional: `.torre/`.

Ventajas de usar el repo como bus de mensajes:

- Historial inmutable y auditable (git log).
- Diffs revisables.
- Cero infraestructura nueva.
- Funciona desde cualquier cliente (web, CLI, IDE).
- Un solo lugar canónico — no hay copias en chats, mails, docs.

## Componentes

```
.torre/
  protocolo.md     reglas operativas del ciclo
  estado.md        estado del último ciclo cerrado
  sistema.md       este archivo
  roles.md         quién hace qué
  flujo.md         cómo fluye un ciclo
  decisiones.md    por qué el diseño es así
  README.md        entrada rápida
  inbox/
    orden_actual.md   la orden activa que el operador debe leer
  outbox/
    reporte_actual.md el reporte del operador del ciclo en curso
  historial/
    <YYYY-MM-DD>_<slug>/   pares orden+reporte ya cerrados (inmutable)
  templates/
    orden_template.md    formato de orden
    reporte_template.md  formato de reporte
```

### `inbox/`

Buzón de entrada del operador. Contiene `orden_actual.md` — siempre uno y solo uno. Cuando no hay ciclo activo, queda en placeholder. La Torre escribe acá; el operador lee.

### `outbox/`

Buzón de salida del operador. Contiene `reporte_actual.md` con el resultado del ciclo en curso. La Torre lee acá; el operador escribe.

### `estado.md`

Foto del último ciclo cerrado: qué orden fue, qué operador, qué branch, si hay orden activa, si hay bloqueos. Es la respuesta rápida a "¿en qué está la Torre ahora mismo?".

### `historial/`

Archivo permanente. Cada ciclo cerrado se copia a `historial/<YYYY-MM-DD>_<slug>/` con el par `orden_actual.md` + `reporte_actual.md` tal como quedaron al cerrar. Inmutable: no se reescribe.
