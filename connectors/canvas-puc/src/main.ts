/**
 * Ponto de entrada do conector Canvas: lê a configuração, monta autenticação e cliente,
 * registra as ferramentas e conversa com o Claude por stdio.
 */
import { homedir } from 'node:os';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createAuthProvider } from './auth.js';
import { browserLogin } from './browser-login.js';
import { createCanvasClient } from './client.js';
import { readCanvasConfig } from './config.js';
import { sessionFilePath } from './session.js';
import { canvasTools, createCanvasMcpServer } from './tools.js';

/** Sobe o servidor MCP do Canvas em stdio. */
export async function startCanvasServer(): Promise<void> {
  const config = readCanvasConfig(process.env, homedir());
  const auth = createAuthProvider({
    token: config.token,
    sessionFile: sessionFilePath(config.dataDir),
    login: (mode) => browserLogin(config, mode),
  });
  const client = createCanvasClient({ baseUrl: config.baseUrl, auth, fetchFn: fetch });
  const server = createCanvasMcpServer(canvasTools(config.allowWrite), {
    client,
    auth,
    now: () => new Date(),
  });
  await server.connect(new StdioServerTransport());
}

await startCanvasServer();
