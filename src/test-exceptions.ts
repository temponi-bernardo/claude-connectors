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
    name: 'launchLoginBrowser',
    reason: 'Abre o Chrome/Edge real (playwright-core); não há navegador no ambiente de teste.',
    manualTest:
      'Rodar `conectar_canvas` no Claude e conferir que a janela do Chrome abre no Canvas.',
  },
  {
    name: 'pageHasCanvasSession',
    reason: 'Executa fetch dentro de uma aba real do navegador logada no Canvas.',
    manualTest:
      'Depois do login em `conectar_canvas`, conferir que a janela fecha sozinha (sessão detectada).',
  },
  {
    name: 'clickInstitutionButton',
    reason: 'Clica num botão da página real de login do Canvas da instituição.',
    manualTest:
      'Apagar `~/.canvas-puc/session.json`, chamar uma ferramenta e ver o botão "Aluno / Professor" ser clicado sozinho.',
  },
  {
    name: 'waitForCanvasLogin',
    reason:
      'Laço de espera sobre abas reais do navegador; a decisão de URL está em isLoginChooserUrl (testada).',
    manualTest:
      'Fechar a janela de login no meio: a ferramenta deve responder "A janela de login foi fechada antes de terminar."',
  },
  {
    name: 'browserLogin',
    reason:
      'Orquestra o navegador real e lê os cookies dele; a lógica de sessão está em auth.ts (testada).',
    manualTest:
      'Com sessão válida no perfil, rodar `quem_sou_eu` após apagar `session.json`: deve renovar em segundos, sem janela.',
  },
  {
    name: 'startCanvasServer',
    reason: 'Ponto de entrada: só monta as peças (testadas) e conecta ao stdio.',
    manualTest:
      'Rodar o pacote `.mcpb` extraído com `node server/index.js` e chamar `tools/list` e `quem_sou_eu` via JSON-RPC.',
  },
  {
    name: 'startCanvasRemoteServer',
    reason:
      'Ponto de entrada: lê o ambiente e liga peças testadas (handler, servidor HTTP, conector).',
    manualTest:
      'Rodar `node server/remote.js` com PUBLIC_URL=http://localhost:8080 e SEAL_KEY, abrir `/.well-known/oauth-authorization-server` e conectar pelo MCP Inspector.',
  },
  {
    name: 'installedExternalVersions',
    reason: 'Lê node_modules reais da raiz; parte do CLI de empacotamento.',
    manualTest:
      'Rodar `npm run pack:all` e conferir a versão do playwright-core no package.json do pacote.',
  },
  {
    name: 'runNodeBin',
    reason: 'Executa npm/npx como processo filho; só repassa argumentos.',
    manualTest: 'Rodar `npm run pack:all` no Windows e conferir que npm install e mcpb pack rodam.',
  },
  {
    name: 'buildConnectorRuntime',
    reason:
      'Roda esbuild e npm de verdade na pasta do conector; as decisões estão em pack.ts (testadas).',
    manualTest:
      'Rodar `npm run pack:all` e conferir server/index.js, package.json e package-lock.json do conector.',
  },
  {
    name: 'packMcpb',
    reason:
      'Gera o pacote real (npm ci, mcpb pack); os arquivos copiados vêm de RUNTIME_FILES (testada).',
    manualTest: 'Rodar `npm run pack:all`, extrair o `.mcpb` e rodar `node server/index.js`.',
  },
  {
    name: 'installPlaywright',
    reason: 'Roda npm install de verdade (rede); os argumentos vêm de npmInstallArgs (testada).',
    manualTest:
      'Apagar o runtime do plugin, chamar `conectar_canvas` e conferir `~/.canvas-puc/runtime/node_modules/playwright-core`.',
  },
  {
    name: 'loadPlaywright',
    reason:
      'Importa módulos dinamicamente e pode instalar pela rede; a resolução está em resolveFrom (testada).',
    manualTest: 'No plugin instalado, chamar `conectar_canvas`: a janela do Chrome deve abrir.',
  },
  {
    name: 'runPackCli',
    reason:
      'Ponto de entrada do CLI de empacotamento: só lê argv e chama buildConnectorRuntime/packMcpb.',
    manualTest:
      'Rodar `npm run pack -- canvas-puc` e `npm run pack:all` e conferir os arquivos em dist/connectors/.',
  },
  {
    name: 'writeJson',
    reason:
      'Só escreve no disco o JSON que pluginManifest/pluginMcpConfig/runtimePackageJson (testadas) montam.',
    manualTest:
      'Rodar `npm run pack:all` e conferir .mcp.json e .claude-plugin/plugin.json do conector.',
  },
];
