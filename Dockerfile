# Imagen de producción: backend Express que además sirve el frontend estático.
# Se construye desde la raíz del repo para incluir backend/ y frontend/.
FROM node:20-slim

WORKDIR /app

# Dependencias primero (mejor cache). better-sqlite3 trae binarios precompilados
# para linux glibc, no requiere toolchain de compilación.
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && (npm ci --omit=dev || npm install --omit=dev)

COPY backend ./backend
COPY frontend ./frontend

ENV NODE_ENV=production
# DATA_DIR debe apuntar a un volumen persistente montado en el host.
ENV DATA_DIR=/app/backend/data
RUN mkdir -p /app/backend/data

WORKDIR /app/backend
EXPOSE 3001
CMD ["node", "server.js"]
