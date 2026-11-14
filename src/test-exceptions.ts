/**
 * Lista ÚNICA de funções sem teste automatizado (docs/TESTING.md, seção "Exceções").
 * Cada entrada precisa de motivo e de um teste manual descrito. O `docs:check` falha
 * se uma função não tiver teste e não estiver aqui, e se uma entrada aqui não existir no código.
 */

export interface TestException {
  /** Nome exato da função. */
  readonly name: string;
  /** Por que não há teste automatizado. */
  readonly reason: string;
  /** Como testar manualmente. */
  readonly manualTest: string;
}

export const TEST_EXCEPTIONS: readonly TestException[] = [
  {
    name: 'runDocsCli',
    reason: 'Ponto de entrada do CLI de docs: só despacha para runCheck/runGenerate (testadas).',
    manualTest: 'Rodar `npm run docs:check` e `npm run docs:generate` e conferir a saída.',
  },
  {
    name: 'startCanvasRemoteServer',
    reason:
      'Ponto de entrada: lê o ambiente e liga peças testadas (handler, servidor HTTP, conector).',
    manualTest:
      'Rodar `node server/remote.js` com PUBLIC_URL=http://localhost:8080 e SEAL_KEY, abrir `/.well-known/oauth-authorization-server` e conectar pelo MCP Inspector.',
  },
  {
    name: 'buildConnector',
    reason:
      'Lê o .mcp.json real e roda o esbuild na pasta do conector; as decisões estão em build.ts (testadas).',
    manualTest:
      'Rodar `npm run build` e conferir que `server/remote.js` foi regerado e que um .mcp.json com "command" faz o build falhar.',
  },
  {
    name: 'runBuildCli',
    reason: 'Ponto de entrada do CLI de build: só lista os conectores e chama buildConnector.',
    manualTest: 'Rodar `npm run build` e conferir uma linha "✔ <conector>" por conector.',
  },
];
