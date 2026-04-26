# Orden Torre — ORD-2026-04-25-17

- **ID**: ORD-2026-04-25-17
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: torre/claude-real-contrato
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude
- **TIPO_ORDEN**: local
- **REPO_ORIGEN**: szlapakariel-ux/torre-control
- **REQUIERE_IA**: no

## Objetivo

Actualizar `.torre/claude_real_contrato.md` con **decisiones V1** aprobadas por Torre para las 7 preguntas bloqueantes y **defaults V1 + diferidos a V2** para las 3 diferibles.

## Decisiones V1 aprobadas (resumen)

1. **CLI o API**: CLI Claude Code, **solo si soporta modo no interactivo**. Si no, frenar.
2. **Dónde corre**: GitHub Actions runner. Sin infra externa.
3. **Cómo abre PR**: rama nueva + PR a main. Nunca auto-merge. Mecanismo nativo del runner. Si no puede, frenar.
4. **Auditoría V1**: resumen en reporte commiteado + Step Summary. Raw prompt/respuesta diferido a V2 (artifact).
5. **Costos V1**: 1 invocación, timeout 5min, max_tokens conservador. Counter USD/día diferido a V2.
6. **Fallos**: una sola tentativa, sin retry. Reporte y escalar a humano.
7. **Aprobación**: solo Torre/Ariel humano aprueba y mergea.
8. **Branch protection**: obligatoria sobre `main` antes de conectar Claude real.
9. **Anti-loop**: todo commit del operador automático lleva `[skip torre]` en línea propia. Identificar por actor: opción a documentar como mejora futura.
10. **Budget ciclos/día**: diferido a V2. Default V1: **una orden automática activa por vez**.

## Tareas concretas

- Editar **solo** `.torre/claude_real_contrato.md`.
- Convertir la sección 11 ("Preguntas abiertas") en sección "Decisiones V1" con las 10 cerradas.
- Crear sección nueva "Pendientes V2" con lo diferido.
- Actualizar el header del documento: el estado pasa de "PROPUESTA" a "DECISIONES V1 INCORPORADAS".
- Cualquier sección anterior que afirmaba "propuesta" ajustarla a la decisión real.

## Restricciones

- Solo documento. NO tocar scripts, workflow, secrets.
- NO mergear PR #12.
- NO conectar Claude real, NO instalar CLI.
- Cierre de ciclo según protocolo: reporte, estado, historial, placeholders.
- Continuar en la rama existente `torre/claude-real-contrato` (PR #12 se actualiza solo al pushear).

## Criterio de aceptación

- [ ] `.torre/claude_real_contrato.md` con decisiones V1 incorporadas.
- [ ] Sección "Pendientes V2" presente.
- [ ] Reporte escrito.
- [ ] Par archivado en `.torre/historial/2026-04-25_contrato-claude-decisiones-v1/`.
- [ ] Inbox/outbox en placeholder al cerrar.
- [ ] Push a `torre/claude-real-contrato` (PR #12 actualizado).
- [ ] PR sigue draft, sin mergear.

## Formato de reporte esperado

Reporta archivos modificados, qué preguntas quedaron cerradas, qué quedó diferido, riesgos restantes.
