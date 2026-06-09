# Despliegue — Backend Torre de Control

Backend Express con persistencia en SQLite. Pensado para Railway (o cualquier
host con volumen persistente), pero corre en cualquier lado con Node ≥ 20.

## Variables de entorno

Ver `.env.example`. Las relevantes en producción:

| Variable | Obligatoria | Descripción |
|---|---|---|
| `PORT` | No | Puerto de escucha. Railway/Render lo inyectan automáticamente. |
| `ALLOWED_ORIGIN` | Sí | Origen(es) del frontend, separados por coma, sin barra final. |
| `API_TOKEN` | Sí | Secreto para endpoints de escritura. Sin él, la escritura queda deshabilitada (503). |
| `DATA_DIR` | Sí (prod) | Carpeta de la base SQLite. Debe ser un **volumen persistente**. |

Generá el token, por ejemplo:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Persistencia

La base vive en `${DATA_DIR}/torre.db`. **Montá un volumen persistente** en `DATA_DIR`
o los datos se pierden en cada redeploy (los contenedores son efímeros).

## Despliegue en Railway

1. Crear servicio desde este repo, root del servicio = `backend/`.
2. Setear variables: `ALLOWED_ORIGIN`, `API_TOKEN`. (`PORT` lo da Railway.)
3. Agregar un **Volume** montado en `/app/data` y setear `DATA_DIR=/app/data`.
4. Deploy. Railway detecta el `Dockerfile` (o usa nixpacks con `npm start`).
5. Healthcheck path: `/api/health`.

## Migrar datos legacy (one-shot)

Si venís de los archivos `data/messages.json` / `data/knowledge.json`:

```bash
node scripts/migrate-json-to-sqlite.js
```

Es idempotente: no duplica.

## Frontend

En `frontend/config.js`, poné `backendUrl` con la URL pública del backend.
El frontend pide el `API_TOKEN` una vez por el navegador y lo guarda en
`localStorage` (no se versiona el secreto).
