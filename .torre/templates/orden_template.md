# Orden Torre — <ID corto>

- **ID**: ORD-YYYYMMDD-NN
- **Fecha**: YYYY-MM-DD
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: <nombre humano del proyecto, ej. "Torre de Control">   <!-- OBLIGATORIO. Ver protocolo.md, sección "Identidad de proyecto". -->
- **REPO_TECNICO**: <owner/repo donde se EJECUTA, ej. "szlapakariel-ux/torre-control">   <!-- OBLIGATORIO. En orden local, debe coincidir con el repo actual del operador. -->
- **RAMA_TRABAJO**: <branch donde el operador desarrolla, ej. "claude/feature-x">   <!-- OBLIGATORIO. El operador debe estar parado en esta rama (orden local). -->
- **RAMA_DESTINO**: <branch donde aterriza el trabajo, ej. "main">   <!-- OBLIGATORIO. Informativo: no se verifica en runtime; se usa al abrir el PR. -->
- **EJECUTOR**: <claude | codex | humano | otro>   <!-- OBLIGATORIO. Ver protocolo.md, sección "Control de concurrencia". -->
- **TIPO_ORDEN**: <local | remota>   <!-- OBLIGATORIO. Default 'local'. 'remota' si la Torre Central emite hacia otro repo. Ver protocolo.md, sección "Órdenes remotas". -->
- **REPO_ORIGEN**: <owner/repo que EMITE la orden, ej. "szlapakariel-ux/torre-control">   <!-- OBLIGATORIO. En orden local: igual a REPO_TECNICO. En orden remota: el repo de la Torre Central (≠ REPO_TECNICO). -->
- **Operador asignado** (opcional, descriptivo): <Claude Code | Codex | otro>

## Objetivo

<Una frase. Qué hay que lograr al cerrar el ciclo.>

## Contexto

<Lo mínimo que el operador necesita saber. Links a archivos relevantes.>

## Tareas concretas

1. <Acción 1>
2. <Acción 2>
3. <Acción 3>

## Restricciones

- No tocar <X> salvo que sea necesario.
- No agregar dependencias.
- No conectar APIs.
- <Otras>

## Criterio de aceptación

- [ ] <Resultado verificable 1>
- [ ] <Resultado verificable 2>
- [ ] Reporte escrito en `.torre/outbox/reporte_actual.md`.
- [ ] Estado actualizado en `.torre/estado.md`.

## Formato de reporte esperado

```
[ESTADO]
[ARCHIVOS CREADOS]
[QUÉ INCLUYE EL PROTOCOLO]
[CÓMO SE USA]
[DIFF RESUMIDO]
[RIESGO]
[SIGUIENTE PASO]
```
