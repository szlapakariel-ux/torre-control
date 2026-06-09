# Orden Torre — ORD-20260609-01 (MC-APP-1)

- **ID**: ORD-20260609-01
- **Fecha**: 2026-06-09
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: claude/eager-fermat-vr2ee4
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude
- **TIPO_ORDEN**: local
- **REPO_ORIGEN**: szlapakariel-ux/torre-control
- **Operador asignado** (descriptivo): Claude Code

## Objetivo

Dejar el app de `torre-control` (backend Express + frontend) **técnicamente apto para despliegue**, sin que este microciclo, por sí mismo, active producción ni autorice el pase a producción (eso queda sujeto al gate de `criterios_produccion_y_reglas_activas.md`).

## Contexto

Hasta este microciclo el app estaba armado solo para correr en local: URL y puerto hardcodeados, persistencia en archivos JSON (no concurrencia-segura y volátil en contenedores efímeros), CORS abierto (`origin: '*'`), sin autenticación, sin config por entorno y sin artefactos de despliegue. `node_modules` estaba versionado.

Este es el primer microciclo de la línea **MC-APP** (el app como producto), distinto de la línea documental/postal de la Torre. Toca código real bajo `backend/` y `frontend/`, no toca `.torre/` salvo este cierre.

## Tareas concretas

1. Reemplazar la persistencia en JSON por SQLite con migración idempotente de los datos legacy.
2. Mover configuración a variables de entorno (`PORT`, `ALLOWED_ORIGIN`, `DATA_DIR`, `API_TOKEN`).
3. Cerrar CORS por lista de orígenes y exigir token Bearer en endpoints de escritura.
4. Endurecer: `helmet`, rate limiting, límites de payload, manejo de errores global, apagado ordenado.
5. Servir el frontend desde el backend (mismo origen) y sacar URL/token hardcodeados del cliente.
6. Agregar artefactos de despliegue: `Dockerfile`, `.dockerignore`, `railway.toml`, `.env.example`, `DEPLOY.md`, `.gitignore`, y desversionar `node_modules`.

## Restricciones

- No activar producción ni declarar el gate de producción como APROBADO desde el rol ejecutor.
- No tocar `.torre/` salvo el cierre de este microciclo.
- No tocar otros repos ni otros proyectos (Inmobiliaria-, agente-saas).
- No introducir secretos en el repo: el `API_TOKEN` se configura por entorno; el cliente lo guarda en `localStorage`.

## Criterio de aceptación

- [x] Persistencia en SQLite con script de migración idempotente.
- [x] Config por entorno y CORS cerrado.
- [x] Auth por token en escrituras; lectura pública.
- [x] Artefactos de despliegue presentes y build verificado (`npm ci --omit=dev`).
- [x] Frontend servido desde el backend, verificado end-to-end en local.
- [x] Reporte escrito en `.torre/outbox/reporte_actual.md` (y archivado).
- [x] Estado actualizado en `.torre/estado.md`.
- [ ] **Gate de producción**: NO es criterio de este microciclo. Queda pendiente de auditoría independiente + autorización explícita de Ariel + verificación de rollback (ver `.torre/revisiones/mc-app-1-preparacion-produccion-app.md`).

## Formato de reporte esperado

```
[ESTADO]
[ARCHIVOS CREADOS]
[ARCHIVOS MODIFICADOS]
[QUÉ INCLUYE EL PROTOCOLO]
[CÓMO SE USA]
[DIFF RESUMIDO]
[RIESGO]
[SIGUIENTE PASO]
[EN_PROCESO_POR]
```
