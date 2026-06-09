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

El backend **sirve el frontend** desde el mismo origen, así que el build se hace
desde la **raíz del repo** (no desde `backend/`). El `Dockerfile` y `railway.toml`
viven en la raíz.

1. Crear servicio desde este repo. **Root Directory = raíz** (el valor por defecto;
   no lo pongas en `backend/`).
2. Setear variables: `API_TOKEN`. (`PORT` lo da Railway. `ALLOWED_ORIGIN` solo hace
   falta si servís el frontend en otro host; sirviéndolo desde el backend no se usa.)
3. Agregar un **Volume** montado en `/app/backend/data` y setear
   `DATA_DIR=/app/backend/data`.
4. Deploy. Railway detecta el `Dockerfile` de la raíz.
5. Healthcheck path: `/api/health`.
6. El frontend queda disponible en la raíz de la URL del servicio (`/`).

## Migrar datos legacy (one-shot)

Si venís de los archivos `data/messages.json` / `data/knowledge.json`:

```bash
node scripts/migrate-json-to-sqlite.js
```

Es idempotente: no duplica.

## Frontend

Servido por el backend en la raíz (`/`). En `frontend/config.js`, `backendUrl`
queda en `''` (mismo origen, rutas relativas). Solo poné una URL absoluta si
servís el frontend en otro host.

El frontend pide el `API_TOKEN` una vez por el navegador y lo guarda en
`localStorage` (no se versiona el secreto).
