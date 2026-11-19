/**
 * Entry point of the remote Canvas connector (ADR 0009): reads the configuration from the environment and
 * starts the HTTP server with OAuth and the `/mcp` endpoint. Variables in `.env.example`.
 */
import { createRemoteHandler } from '../../../src/remote/handler.js';
import { readRemoteServerConfig, startRemoteHttpServer } from '../../../src/remote/node-server.js';
import { canvasRemoteConnector, readCanvasRemoteSettings } from './remote.js';
import { memoryWriteAccessStore } from './write-access.js';

/** Starts the remote Canvas server on the configured port. */
export function startCanvasRemoteServer(): void {
  const config = readRemoteServerConfig(process.env);
  const access = {
    oauth: config.settings,
    store: memoryWriteAccessStore(),
    now: () => Math.floor(Date.now() / 1000),
  };
  const handler = createRemoteHandler({
    settings: config.settings,
    connector: canvasRemoteConnector(readCanvasRemoteSettings(process.env), access),
    now: access.now,
  });
  startRemoteHttpServer({ handler, origin: config.settings.issuer, port: config.port });
  console.log(`Remote Canvas at ${config.settings.issuer}/mcp (port ${String(config.port)})`);
}

startCanvasRemoteServer();
