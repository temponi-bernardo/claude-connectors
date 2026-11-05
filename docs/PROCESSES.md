# Processos

Fluxos do sistema, do gatilho ao resultado. Cada passo cita as funções envolvidas como `` `nome()` ``;
o `docs:check` usa essas citações (mais tudo o que elas chamam) para preencher o campo **Processos**
de cada função em [FUNCTIONS.md](FUNCTIONS.md). Função citada que não existe no código é erro.

Modelo de um processo: ver [DOCUMENTATION.md](DOCUMENTATION.md#processo).

## P01 — Checar a documentação (`npm run docs:check`)

- **Gatilho:** `npm run docs:check`, o `npm run check`, o hook `pre-push`, o `pr:check` e o hook `Stop` do Claude Code.
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

## P03 — Responder a uma ferramenta do Canvas (chamada do Claude)

- **Gatilho:** o Claude chama uma ferramenta do conector `canvas-puc` (ex.: `proximas_entregas`).
- **Passos:**
  1. Na subida, `startCanvasServer()` lê a configuração com `readCanvasConfig()`, cria a autenticação com
     `createAuthProvider()` e o cliente com `createCanvasClient()`, escolhe as ferramentas com `canvasTools()`
     e as registra com `registerToolSpecs()`.
  2. A chamada passa por `runToolSafely()`; a `ToolSpec` criada por `defineTool()` valida os argumentos.
  3. A ferramenta usa o cliente: `requestWithRenewal()` monta a requisição com `sendCanvasRequest()`
     (`buildUrl()` + `authHeaders()`); listagens seguem as páginas com `collectPages()` e `parseNextLink()`.
     Apoios como `activeCourses()`, `fetchOwnSubmission()` e `getAllOrEmpty()` compõem buscas.
  4. As respostas viram objetos enxutos em português (`toCourse()`, `toPlannerItem()`, `toAssignmentDetail()`
     etc.), com HTML convertido por `htmlToText()`.
  5. `textResult()` devolve o JSON ao Claude; qualquer erro vira `errorResult()` com a mensagem.
- **Resultado:** o Claude recebe só os campos úteis, com links absolutos e textos limpos.
- **Falhas:** status ≠ 2xx vira erro com status e corpo; argumentos inválidos são recusados pelo zod.

## P04 — Conectar e renovar a sessão do Canvas (login pelo navegador)

- **Gatilho:** ferramenta `conectar_canvas`, ou um 401 (ou ausência de credencial) em qualquer requisição.
- **Passos:**
  1. Ao subir, `createAuthProvider()` carrega a sessão salva com `loadSession()` (`isCanvasSession()` valida
     a forma) e `pickAuth()` escolhe sessão, token ou nenhuma.
  2. Em 401, `requestWithRenewal()` chama `renewOnce()`, que roda uma única `renewAuth()` por vez.
  3. `renewAuth()` tenta `loginAndStore()` em modo silencioso: `browserLogin()` abre o perfil com
     `launchLoginBrowser()` oculto (carregando o navegador por `loadPlaywright()`) e `waitForCanvasLogin()` espera `pageHasCanvasSession()`, clicando o botão
     da instituição com `clickInstitutionButton()` quando `isLoginChooserUrl()` reconhece a tela de escolha.
  4. Se o silencioso falhar, usa o token reserva (se houver) ou repete o login com janela visível.
  5. `saveSession()` grava os cookies; `cookieHeader()` e `csrfToken()` montam os headers das próximas chamadas.
  6. `desconectar_canvas` apaga a sessão com `clearSession()`.
- **Resultado:** a requisição original é repetida com a sessão nova, sem o usuário ver janela na maioria dos casos.
- **Falhas:** janela fechada ou tempo esgotado → `unauthorizedMessage()` orienta a usar `conectar_canvas`.

## P05 — Empacotar conectores (`npm run pack` / `npm run pack:all`)

- **Gatilho:** `npm run pack -- <conector>`, `npm run pack:all` ou o `pr:check`.
- **Passos:**
  1. `runPackCli()` escolhe os conectores; com `--all`, `listConnectors()` acha as pastas com `manifest.json`.
  2. `buildConnectorRuntime()` lê nome e versão com `readManifestIdentity()`, une o código com o esbuild usando
     `bundleOptions()` em `connectors/<nome>/server/index.js` e grava o `package.json` de runtime com
     `runtimePackageJson()` (versões de `installedExternalVersions()`) e o lockfile, via `runNodeBin()`; gera
     também o `plugin.json` (`pluginManifest()`) e o `.mcp.json` (`pluginMcpConfig()`) a partir do `manifest.json`,
     gravados por `writeJson()`.
  3. `packMcpb()` copia `RUNTIME_FILES` para o staging, roda `npm ci` e `mcpb pack`.
- **Resultado:** runtime versionado na pasta do conector (usado pelo plugin do Claude Code, P07) e
  `dist/connectors/<nome>-<versão>.mcpb` (Claude Desktop → Extensões).
- **Falhas:** manifesto sem nome/versão ou dependência externa não instalada interrompem com erro.

## P06 — Portão de PR local (`npm run pr:check`)

- **Gatilho:** antes de abrir e antes de mergear um PR (não há CI, ADR 0006).
- **Passos:**
  1. `scripts/pr-check.sh` exige o título do PR e roda `npm run check` (inclui o P01 via `runDocsCli()`).
  2. Roda o P05 (`npm run pack:all`) e falha se o runtime versionado dos conectores mudar sem commit.
  3. Roda o commitlint nos commits da branch desde `origin/main` e no título do PR.
- **Resultado:** `✔ pr:check verde`, condição para o Claude mergear com squash.
- **Falhas:** qualquer etapa com erro para o script com código ≠ 0.

## P07 — Instalar um conector como plugin (marketplace do Claude Code)

- **Gatilho:** no Claude, "Adicionar marketplace" com `temponi-bernardo/claude-connectors` e instalar o plugin.
- **Passos:**
  1. O Claude clona o repositório (credenciais git do PC; repo privado) e lê `.claude-plugin/marketplace.json`.
  2. Ao instalar, copia `connectors/<nome>/`, pede os campos de `userConfig` do `plugin.json` e roda
     `npm install` porque a pasta tem `package.json` e `package-lock.json` (só o playwright-core).
  3. O `.mcp.json` sobe `node ${CLAUDE_PLUGIN_ROOT}/server/index.js` com os campos como variáveis de ambiente
     (P03 a partir daí).
  4. Se o `npm install` automático não tiver rodado, `loadPlaywright()` instala o playwright-core em
     `runtimeDir()` na primeira vez que o login pelo navegador for necessário (`resolveFrom()`,
     `installPlaywright()`).
- **Resultado:** as ferramentas do conector aparecem como `mcp__plugin_<nome>_<servidor>__<ferramenta>`.
- **Falhas:** sem acesso ao repo privado, o "Adicionar marketplace" falha; sem npm no PATH, o login pelo
  navegador falha (a leitura com sessão salva continua funcionando).
