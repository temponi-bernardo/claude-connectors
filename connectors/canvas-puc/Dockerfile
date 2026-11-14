# Remote Canvas connector (ADR 0009): HTTP server with OAuth and the /mcp endpoint.
# Uses only the committed bundle server/remote.js (built by `npm run build`); no dependencies to install.
# Build from this folder: docker build -t canvas-puc-remote connectors/canvas-puc
FROM node:22-alpine
WORKDIR /app
# package.json only tells Node to treat the bundle as ESM ("type": "module").
COPY package.json ./
COPY server/remote.js ./server/remote.js
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
USER node
CMD ["node", "server/remote.js"]
