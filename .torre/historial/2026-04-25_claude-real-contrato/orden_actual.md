# Orden Torre — ORD-2026-04-25-16

- **ID**: ORD-2026-04-25-16
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

Diseñar **en papel** el contrato de seguridad para conectar Claude real detrás de `.torre/scripts/operators/claude.sh`. **Solo documento**, sin tocar código ejecutable ni workflow ni secrets. Sirve de baseline para una orden futura de implementación.

## Tarea concreta

Crear un único archivo nuevo: `.torre/claude_real_contrato.md`, cubriendo las 11 secciones que pidió la orden:
1. Qué problema resuelve.
2. Flujo esperado.
3. Alcance permitido para Claude.
4. Acciones prohibidas.
5. Sandbox.
6. Manejo de secrets.
7. Límite de costos.
8. Auditoría.
9. Criterios de corte.
10. Primera prueba real sugerida.
11. Preguntas abiertas para Torre/Ariel.

## Restricciones

- Solo documento. NO tocar scripts ni workflow.
- NO conectar Claude real.
- NO usar secrets, NO instalar CLI, NO mergear, NO borrar ramas.
- NO abrir V1.3.
- PR contra `main` en estado **draft**.

## Criterio de aceptación

- [ ] `.torre/claude_real_contrato.md` creado con las 11 secciones.
- [ ] Reporte escrito.
- [ ] `estado.md` actualizado.
- [ ] Par archivado en `.torre/historial/2026-04-25_claude-real-contrato/`.
- [ ] Inbox/outbox en placeholder al cerrar.
- [ ] PR draft contra `main`. NO mergear.

## Formato de reporte esperado

Reporta link del PR, archivos creados/modificados, riesgos.
