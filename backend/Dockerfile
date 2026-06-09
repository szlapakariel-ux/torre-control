# Imagen de producción del backend Torre de Control.
FROM node:20-slim

WORKDIR /app

# Instalar dependencias primero (mejor cache). better-sqlite3 trae binarios
# precompilados para linux glibc, no requiere toolchain de compilación.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .

# DATA_DIR debe apuntar a un volumen persistente montado en el host.
ENV NODE_ENV=production
ENV DATA_DIR=/app/data
RUN mkdir -p /app/data

EXPOSE 3001
CMD ["node", "server.js"]
