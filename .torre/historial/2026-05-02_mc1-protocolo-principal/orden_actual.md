# Orden Torre — MC-1 Protocolo Principal

- **ID**: ORD-2026-05-02-01
- **Fecha**: 2026-05-02
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: claude/mc1-protocolo-principal
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude_code
- **TIPO_ORDEN**: local
- **REPO_ORIGEN**: szlapakariel-ux/torre-control
- **Operador asignado** (opcional, descriptivo): Claude Code

## Objetivo

Registrar el protocolo principal `WhatsApp → Portero Local → Torre → Repo Activo` como documento vigente del sistema, declarar la jerarquía documental y listar los documentos que quedan como consulta histórica. Microciclo documental, sin código.

## Contexto

Torre emitió el protocolo principal en respuesta al briefing `.torre/briefing_portero_a_torre.md`. Este microciclo formaliza ese protocolo en `torre-control` antes de cualquier implementación técnica del Portero Local. Decisiones de Torre que orientan el diseño quedan pendientes para microciclos posteriores (MC-2 en adelante).

Documentos base de la cañería postal (sistema.md, protocolo.md, roles.md, flujo.md, decisiones.md, README.md, estado.md) **siguen vigentes**. El protocolo principal que se registra acá se apoya sobre ellos, no los reemplaza.

## Tareas concretas

1. Crear `.torre/protocolo_principal.md` con el texto literal del protocolo emitido por Torre, encabezado con metadata (versión, fecha, autoridad, vigencia).
2. Crear `.torre/jerarquia_documental.md` que declare:
   - protocolo principal vigente,
   - documentos base de cañería postal vigentes,
   - documentos históricos consultables,
   - regla de prevalencia ante conflicto.
3. Crear `.torre/historico.md` que liste declarativamente los documentos que pasan a consulta histórica, **sin moverlos físicamente** (eso es microciclo separado si Torre lo autoriza).
4. Mantener la suspensión de `ORD-2026-04-25-10` copiándola intacta a `.torre/inbox/suspendidas/ORD-2026-04-25-10.md` antes de pisar `inbox/orden_actual.md` con esta orden.
5. Cerrar el ciclo dentro del mismo PR: escribir reporte en `outbox/reporte_actual.md`, archivar el par orden+reporte en `.torre/historial/2026-05-02_mc1-protocolo-principal/`, dejar inbox/outbox en placeholder, y actualizar `estado.md`.

## Restricciones

- Nada fuera de `.torre/`.
- Cero código, scripts, runtime, secrets, workflows.
- No modificar `agente-saas` ni `auditoria-sofse`.
- No activar Computer Use.
- No crear puente Portero → Torre.
- No implementar watcher de 15 minutos.
- No implementar `proyecto_activo.json`.
- No implementar alias de proyectos.
- No mover físicamente documentos históricos (salvo la copia ya autorizada de `ORD-2026-04-25-10` a `inbox/suspendidas/`).
- No tocar el branch `master` ni ramas de otros repos.
- No mergear, no abrir PR, no pushear sin reportar evidencia y esperar autorización de Ariel.

## Criterio de aceptación

- [ ] `.torre/protocolo_principal.md` creado con el texto literal del protocolo de Torre + metadata.
- [ ] `.torre/jerarquia_documental.md` creado con regla de prevalencia.
- [ ] `.torre/historico.md` creado con la lista declarativa de documentos históricos.
- [ ] `.torre/inbox/suspendidas/ORD-2026-04-25-10.md` existe con copia intacta de la orden suspendida.
- [ ] Reporte escrito en `.torre/outbox/reporte_actual.md`.
- [ ] Par orden+reporte archivado en `.torre/historial/2026-05-02_mc1-protocolo-principal/`.
- [ ] `inbox/orden_actual.md` y `outbox/reporte_actual.md` quedan en placeholder al cerrar.
- [ ] `estado.md` actualizado con cierre de ORD-2026-05-02-01.
- [ ] `git diff --name-only` muestra cambios solo dentro de `.torre/`.
- [ ] Cero archivos de código, scripts, runtime tocados.

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
