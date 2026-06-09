# Reporte Operador — ORD-20260609-01 (MC-APP-1 Preparación de producción del app)

- **Orden ejecutada**: ORD-20260609-01
- **Operador**: Claude Code
- **Fecha de cierre**: 2026-06-09
- **Branch**: `claude/eager-fermat-vr2ee4`
- **Commit final**: pendiente (ver evidencia en PR #58)

## [ESTADO]

OK — app técnicamente apto para despliegue. Persistencia, seguridad, config por entorno y artefactos de deploy listos y verificados en local. El **gate de producción NO se declara aprobado** (queda a Torre/Ariel + auditoría independiente).

## [ARCHIVOS CREADOS]

- `backend/services/db.js` — conexión SQLite (modo WAL) y esquema (`messages`, `knowledge`).
- `backend/scripts/migrate-json-to-sqlite.js` — migración idempotente de los JSON legacy.
- `backend/.env.example` — plantilla de variables de entorno.
- `backend/DEPLOY.md` — guía de despliegue (Railway + volumen).
- `frontend/config.js` — `backendUrl` configurable (vacío = mismo origen).
- `Dockerfile`, `.dockerignore`, `railway.toml` (raíz del repo) — build que incluye backend + frontend.
- `.gitignore` (raíz).

## [ARCHIVOS MODIFICADOS]

- `backend/server.js` — `PORT`/`ALLOWED_ORIGIN` por entorno; CORS cerrado; `helmet`; rate limit; límite de payload; auth Bearer en escrituras; manejo de errores global; apagado ordenado; sirve `frontend/` estático.
- `backend/services/storage.js`, `backend/services/knowledgeStore.js` — reescritos sobre SQLite, mismo contrato de API.
- `backend/package.json` / `package-lock.json` — deps (`better-sqlite3`, `helmet`, `express-rate-limit`) + `engines`.
- `frontend/app.js` — URL del backend desde config; token en `localStorage`; arreglada indentación corrupta de `loadLastDecision`.
- `frontend/index.html` — incluye `config.js`.
- **Baja de `node_modules`** del control de versiones (646 archivos; traía binarios nativos no portables).

## [QUÉ INCLUYE EL PROTOCOLO]

N/A en cuanto a la cañería postal. Este microciclo no modifica protocolo ni convenciones de `.torre/`. Sí inaugura la **línea MC-APP** (el app como producto técnico), distinta de la línea documental.

## [CÓMO SE USA]

- **Local**: `cd backend && npm install && API_TOKEN=<token> npm start`; abrir `http://localhost:3001/` (el backend sirve el frontend).
- **Migración legacy** (una vez): `node scripts/migrate-json-to-sqlite.js`.
- **Despliegue**: ver `backend/DEPLOY.md`. Railway con Root Directory = raíz, `Dockerfile` autodetectado, volumen en `/app/backend/data`, variable `API_TOKEN`.

## [DIFF RESUMIDO]

- Persistencia: JSON en disco → SQLite (WAL) con migración idempotente.
- Config por entorno: `PORT`, `ALLOWED_ORIGIN`, `DATA_DIR`, `API_TOKEN`.
- Seguridad: CORS cerrado, auth Bearer en escrituras, helmet, rate limit, límites de payload.
- Robustez: manejo de errores global + apagado ordenado (SIGTERM/SIGINT).
- Frontend servido desde el backend (mismo origen, sin CORS).
- Deploy: Dockerfile + railway.toml + .dockerignore + .env.example + DEPLOY.md + .gitignore.
- `node_modules` desversionado.
- Commits de la rama: `d7d4a8d`, `2a4e63d`, `743f760`, más el commit de este cierre.

## [RIESGO]

- **Gate de producción no cerrado por diseño**: el pase a producción real (merge a `main` + deploy en Railway con datos/usuarios) requiere, según `criterios_produccion_y_reglas_activas.md`: (a) auditor distinto del ejecutor, (b) autorización explícita de Ariel con conocimiento de riesgo y rollback, (c) verificación de reversión. Nada de eso lo cubre este microciclo. Ver el gate en `revisiones/`.
- **Persistencia depende de volumen**: sin un volumen persistente montado en `DATA_DIR`, la base SQLite se pierde en cada redeploy. Declarado en `DEPLOY.md`.
- **Token en cliente**: el frontend guarda el `API_TOKEN` en `localStorage`. Si el frontend se sirviera público sin más capa, cualquiera con el token puede escribir. Modelo pensado para uso de un único dueño.
- **Merge gate de CI**: `detect-cycle-closure` no corría en PRs que no tocan `.torre/`; este cierre, al tocar `.torre/`, lo dispara y reporta verde (ciclo cerrado).
- **`main` exige PR**: el cambio aterriza vía PR #58, no por push directo.

## [SIGUIENTE PASO]

Torre/Ariel decide. Opciones sugeridas:

1. **Cerrar el gate de producción** (`revisiones/mc-app-1-preparacion-produccion-app.md`): asignar auditor independiente, confirmar autorización explícita de Ariel y probar el rollback. Recién entonces el pase a producción queda APROBADO.
2. **MC-APP-2** — observabilidad/logging estructurado y tests automatizados del backend (hoy no hay).
3. **MC-APP-3** — endurecer el modelo de auth si el frontend va a ser público (más allá de token único).

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: claude_code
- **Liberación al cierre confirmada**: sí
