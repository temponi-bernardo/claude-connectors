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
    name: 'packConnector',
    reason:
      'Gera o pacote real (esbuild, npm install, mcpb pack); as decisões estão em pack.ts (testadas).',
    manualTest: 'Rodar `npm run pack:all`, extrair o `.mcpb` e rodar `node server/index.js`.',
  },
  {
    name: 'runPackCli',
    reason: 'Ponto de entrada do CLI de empacotamento: só lê argv e chama packConnector.',
    manualTest:
      'Rodar `npm run pack -- canvas-puc` e `npm run pack:all` e conferir os arquivos em dist/connectors/.',
  },
];
