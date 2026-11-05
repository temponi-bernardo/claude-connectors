# Processos

Fluxos do sistema, do gatilho ao resultado. Cada passo cita as funções envolvidas como `` `nome()` ``;
o `docs:check` usa essas citações (mais tudo o que elas chamam) para preencher o campo **Processos**
de cada função em [FUNCTIONS.md](FUNCTIONS.md). Função citada que não existe no código é erro.

Modelo de um processo: ver [DOCUMENTATION.md](DOCUMENTATION.md#processo).

## P01 — Checar a documentação (`npm run docs:check`)

- **Gatilho:** `npm run docs:check`, o `npm run check`, o hook `pre-push`, o CI e o hook `Stop` do Claude Code.
- **Passos:**
  1. `runDocsCli()` lê o comando (`check` por padrão) e chama `runCheck()`.
  2. `runCheck()` carrega a configuração com `loadDocsConfig()`, monta o inventário com `buildInventory()`
     (código analisado por AST, pastas versionadas, testes, componentes de UI e exceções de teste) e lê os
     documentos com `readDocsTexts()`.
  3. As citações de PROCESSES.md são extraídas com `extractProcessCitations()`.
  4. `runAllChecks()` roda cada checagem pura e junta os problemas.
  5. `formatIssues()` imprime o resultado; o processo sai com código 1 se houver qualquer problema.
- **Resultado:** lista numerada de problemas com código (`FUNCAO_SEM_DOC`, `PASTA_SEM_DOC`...) e a
  correção esperada, ou `✔` quando tudo está em dia.
- **Falhas:** `docs.config.json` inválido ou `TEST_EXCEPTIONS` fora do formato interrompem a execução com erro.

## P02 — Gerar os blocos da documentação (`npm run docs:generate`)

- **Gatilho:** `npm run docs:generate`, normalmente logo depois de criar ou alterar funções.
- **Passos:**
  1. `runDocsCli()` recebe `generate` e chama `runGenerate()`.
  2. `runGenerate()` monta o inventário e lê os documentos como no P01, e chama `generateFunctionsDoc()`.
  3. `generateFunctionsDoc()` calcula "Processos" por função com `processesByFunction()` e aplica
     `applyGenerated()`: atualiza o índice por módulo, substitui os blocos gerados existentes e acrescenta
     seções novas com os campos manuais marcados como `_preencher_`.
  4. O arquivo só é regravado se houver mudança.
- **Resultado:** `docs/FUNCTIONS.md` com blocos gerados em dia; os campos manuais novos ficam para a pessoa
  (ou o Claude) preencher — o P01 cobra isso.
- **Falhas:** as mesmas do P01.

## P03 — Inicializar um projeto a partir do template (`npm run init`)

- **Gatilho:** `npm run init -- --name <nome> --description <descrição> --owner <conta-github>`, primeiro
  passo da skill `/novo-projeto`.
- **Passos:**
  1. `runInitCli()` chama `parseInitArgs()`, que valida os argumentos e normaliza o nome com `slugify()`.
  2. `initProject()` percorre `TEMPLATE_FILES` e, em cada um, `initFile()` substitui os marcadores
     `{{PROJECT_NAME}}`, `{{PROJECT_DESCRIPTION}}`, `{{GITHUB_OWNER}}` e `{{YEAR}}` via
     `replacePlaceholders()`.
  3. Em cada arquivo de `PACKAGE_FILES`, `rewriteFile()` aplica `applyPackageValues()` (nome do pacote e
     descrição no `package.json` e no `package-lock.json`).
  4. `rewriteFile()` aplica `resetChangelog()` ao `CHANGELOG.md`, esvaziando o histórico do template em
     "Não lançado".
- **Resultado:** lista dos arquivos alterados; o repositório deixa de ter marcadores e nome do template.
  Depois de usado, o init pode ser apagado (passo final da skill `/novo-projeto`).
- **Falhas:** argumento ausente ou fora do formato `--chave valor` encerra com código 1 e mensagem clara.

## P04 — Esqueleto executável (`npm start`)

- **Gatilho:** `npm start -- <título>`.
- **Passos:**
  1. `main()` junta os argumentos em um título (ou usa um exemplo) e chama `slugify()`.
  2. `slugify()` normaliza o texto com `removeDiacritics()`, troca o que não é letra/dígito por hífen e
     limita o tamanho a `MAX_SLUG_LENGTH`.
- **Resultado:** slug impresso no terminal. Serve de prova de que o esqueleto roda e de exemplo de lógica pura
  separada de efeito (decidir em `slugify()`, fazer em `main()`).
- **Falhas:** nenhuma prevista; entrada sem caracteres válidos produz slug vazio.
