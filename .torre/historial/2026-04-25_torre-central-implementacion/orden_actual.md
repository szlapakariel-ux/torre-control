# Orden Torre — ORD-2026-04-25-12

- **ID**: ORD-2026-04-25-12
- **Fecha**: 2026-04-25
- **Emisor**: Torre (aprobación explícita de la propuesta `.torre/torre_central_propuesta.md`)
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: claude/torre-central-implementacion (declarada; operador en `claude/trigger-torre-mvp-rSWiS` por restricción del harness, consistente con ciclos previos)
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude

## Objetivo

Implementar los cambios documentales de la propuesta `.torre/torre_central_propuesta.md` (aprobada por Torre) para habilitar órdenes remotas multi-repo. Sin lógica de transporte automático (eso es un ciclo posterior).

## Tareas concretas

1. `protocolo.md` § "Identidad de proyecto":
   - Agregar `TIPO_ORDEN` y `REPO_ORIGEN` a los campos obligatorios.
   - Aclarar que la regla dura "repo actual = REPO_TECNICO" se evalúa solo cuando `TIPO_ORDEN: local`.
2. `protocolo.md`: nueva sección "Órdenes remotas" con el flujo de 7 pasos.
3. `templates/orden_template.md`: agregar `TIPO_ORDEN` y `REPO_ORIGEN`.
4. `flujo.md`:
   - Ramificar el sub-checklist de chequeo de identidad entre `local` y `remota`.
   - Nueva sección "Flujo de orden remota".
5. `roles.md`:
   - Torre: puede emitir órdenes locales o remotas.
   - Operador IA: si la orden es remota, no ejecuta contenido — transporta.
   - Nuevo bloque "Repo central / Repo destino".
6. `estado.md`: agregar campo opcional `ORDENES_REMOTAS_EN_VUELO`.
7. Crear carpetas vacías `.torre/remotas/` y `.torre/reportes-remotos/` con `.gitkeep`.
8. `trigger.md`: documentar que el detector tolera los directorios nuevos.
9. Marcar la propuesta `torre_central_propuesta.md` como APROBADA + implementada en este ciclo.

## Restricciones

- No tocar `backend/` ni `frontend/`.
- No agregar dependencias.
- No escribir el script `transport_remote_order.sh` (eso es ciclo posterior).
- No modificar `check_cycle_closed.sh` salvo que sea estrictamente necesario (solo mira `historial/`, no las nuevas carpetas, así que no hace falta).
- Solo cambios documentales y estructurales (carpetas vacías).

## Criterio de aceptación

- [ ] Cambios 1–9 aplicados.
- [ ] El template y los placeholders mencionan los 7 campos (5 originales + 2 nuevos).
- [ ] `remotas/` y `reportes-remotos/` existen como carpetas con `.gitkeep`.
- [ ] La propuesta queda marcada como aprobada/implementada.
- [ ] Reporte escrito.
- [ ] Par archivado en `.torre/historial/2026-04-25_torre-central-implementacion/`.
- [ ] Inbox y outbox en placeholder al cerrar.
- [ ] `EN_PROCESO_POR: ninguno` al cerrar.
- [ ] Todo en el mismo PR.

## Formato de reporte esperado

```
[ESTADO]
[ARCHIVOS MODIFICADOS]
[CAMBIO REALIZADO]
[VERIFICACIÓN]
[DIFF RESUMIDO]
[RIESGO]
[SIGUIENTE PASO]
[EN_PROCESO_POR]
```

## Después

Volver a "Secretaria IA": diagnóstico de Portero V1 ahora con el patrón de orden remota disponible (re-emitir ORD-2026-04-25-10 como remota, o abrir sesión Claude Code en `agente-saas`).
