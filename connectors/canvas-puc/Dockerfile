# Conector Canvas remoto (ADR 0009): servidor HTTP com OAuth e endpoint /mcp.
# Usa só o bundle versionado server/remote.js (gerado por `npm run pack`); nenhuma dependência a instalar.
# Build a partir desta pasta: docker build -t canvas-puc-remote connectors/canvas-puc
FROM node:22-alpine
WORKDIR /app
# O package.json só serve para o Node tratar o bundle como ESM ("type": "module").
COPY package.json ./
COPY server/remote.js ./server/remote.js
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
USER node
CMD ["node", "server/remote.js"]
