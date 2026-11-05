/**
 * Ponto de entrada do conector Canvas remoto (ADR 0009): lê a configuração do ambiente e sobe o servidor
 * HTTP com OAuth e o endpoint `/mcp`. Variáveis em `.env.example`.
 */
import { createRemoteHandler } from '../../../src/remote/handler.js';
import { readRemoteServerConfig, startRemoteHttpServer } from '../../../src/remote/node-server.js';
import { canvasRemoteConnector, readCanvasRemoteSettings } from './remote.js';

/** Sobe o servidor remoto do Canvas na porta configurada. */
export function startCanvasRemoteServer(): void {
  const config = readRemoteServerConfig(process.env);
  const handler = createRemoteHandler({
    settings: config.settings,
    connector: canvasRemoteConnector(readCanvasRemoteSettings(process.env)),
    now: () => Math.floor(Date.now() / 1000),
  });
  startRemoteHttpServer({ handler, origin: config.settings.issuer, port: config.port });
  console.log(`Canvas remoto em ${config.settings.issuer}/mcp (porta ${String(config.port)})`);
}

startCanvasRemoteServer();
