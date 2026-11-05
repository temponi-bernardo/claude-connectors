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
    name: 'main',
    reason: 'Ponto de entrada: só lê argv e imprime; a lógica está em slugify (testada).',
    manualTest: 'Rodar `npm start -- Olá Mundo` e conferir a saída `ola-mundo`.',
  },
  {
    name: 'runDocsCli',
    reason: 'Ponto de entrada do CLI de docs: só despacha para runCheck/runGenerate (testadas).',
    manualTest: 'Rodar `npm run docs:check` e `npm run docs:generate` e conferir a saída.',
  },
  {
    name: 'runInitCli',
    reason: 'Ponto de entrada do CLI de init: só lê argumentos e chama initProject (testada).',
    manualTest:
      'Rodar `npm run init -- --name x --description y` em uma cópia e conferir os arquivos.',
  },
];
