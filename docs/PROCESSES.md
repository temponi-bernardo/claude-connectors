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
     e as registra com `registerToolSpecs()` dentro de `createCanvasMcpServer()`.
  2. A chamada passa por `runToolSafely()`; a `ToolSpec` criada por `defineTool()` valida os argumentos.
  3. A ferramenta usa o cliente: `requestWithRenewal()` monta a requisição com `sendCanvasRequest()`
     (`buildUrl()` + `authHeaders()`); listagens seguem as páginas com `collectPages()` e `parseNextLink()`.
     Apoios como `activeCourses()`, `fetchOwnSubmission()` e `getAllOrEmpty()` compõem buscas.
  4. As respostas viram objetos enxutos em português (`toCourse()`, `toPlannerItem()`, `toAssignmentDetail()`
     etc.), com HTML convertido por `htmlToText()`.
  5. Arquivos: `ler_arquivo_texto` usa `readCanvasFileText()`, que baixa texto com `fetchPlainText()` ou, para
     Word (`wordKind()`), os bytes com `fetchFileBytes()` e extrai o texto com `wordToText()` (`docxToText()`
     sobre `readZipEntry()`; `docToText()` sobre `openCfb()`/`readCfbStream()` e `parsePieceTable()`).
     `baixar_arquivo` usa `downloadCanvasFile()`: `downloadRefusal()` recusa arquivo sem link ou acima de 10 MB;
     senão `downloadedFileResult()` embute o conteúdo com `fileContentBlock()` e o marca com `rawToolResult()`.
  6. `toToolResult()` devolve o JSON (via `textResult()`) ou o resultado pronto ao Claude; qualquer erro vira
     `errorResult()` com a mensagem.
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
     `bundleOptions()` em `connectors/<nome>/server/index.js` (e, se houver `src/remote-main.ts`, também em
     `server/remote.js`, P08) e grava o `package.json` de runtime com
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

## P08 — Conectar o Canvas remoto (OAuth no claude.ai)

- **Gatilho:** no claude.ai, Configurações → Conectores → Adicionar conector personalizado com
  `https://<servidor>/mcp` (ADR 0009); ou um token vencido que obriga a reconectar.
- **Passos:**
  1. Na subida, `startCanvasRemoteServer()` lê `readRemoteServerConfig()` (`readPublicUrl()`, `parseSealKey()`) e
     `readCanvasRemoteSettings()`, monta `canvasRemoteConnector()` e sobe `startRemoteHttpServer()` com
     `createRemoteHandler()`; cada requisição passa por `serveNodeRequest()` (`readNodeBody()`, `toWebRequest()`,
     `writeWebResponse()`) e `routeRemoteRequest()`. No Cloudflare Workers (ADR 0010), `handleWorkerFetch()`
     converte o ambiente com `toEnvVars()` e monta o app com `createWorkerApp()` (`readOAuthSettings()`), usando a
     origem da requisição como emissor.
  2. O Claude chama `/mcp` sem token e recebe `mcpUnauthorizedResponse()`; lê os metadados de
     `protectedResourceMetadata()` e `authorizationServerMetadata()`.
  3. `handleRegister()` registra o cliente com `registerClient()`: `isAllowedRedirect()` confere o retorno e o
     `client_id` é um selo de `sealPayload()`.
  4. `handleAuthorizePage()` valida a query com `parseAuthorizeQuery()` (`clientRedirectUris()`,
     `readCodeChallenge()`) e mostra `renderLoginPage()` via `loginPageFor()`, com o pedido selado por
     `sealAuthorizeRequest()`.
  5. O usuário cola o token; `handleAuthorizeSubmit()` abre o pedido com `openAuthorizeRequest()`, confere o token
     com `verifyCanvasToken()` e devolve o código de `issueAuthorizationCode()` por `redirectWithCode()`.
  6. `handleToken()` troca o código em `redeemTokenRequest()` (`redeemAuthorizationCode()` confere PKCE com
     `pkceChallenge()`) e responde com `issueTokenSet()`; depois, o refresh passa por `redeemRefreshToken()`.
  7. A cada refresh, `handleToken()` chama `renewSecretQuietly()`: no Canvas, `renewCanvasToken()` lista os tokens
     com `canvasTokenApi()`, acha o próprio com `matchesVisibleToken()` e, se `planTokenRenewal()` mandar, estende a
     validade para agora + 30 dias (o máximo que a PUC aceita). Falha na renovação só vira aviso no log.
- **Resultado:** o conector aparece conectado no Claude (web, Cowork e celular); o servidor não guardou nada.
- **Falhas:** token recusado → a página volta com o erro; pedido com mais de 15 minutos → 400; retorno fora de
  `OAUTH_REDIRECT_HOSTS` → registro recusado; troca da `SEAL_KEY` → todos reconectam.

## P09 — Responder a uma ferramenta pelo conector remoto

- **Gatilho:** o Claude chama uma ferramenta em `POST /mcp` com o access token.
- **Passos:**
  1. `handleMcp()` lê o token do Canvas com `readAccessSecret()` (`openSealed()` confere tipo e validade).
  2. O `createServer` de `canvasRemoteConnector()` monta `createTokenAuthProvider()` e o cliente com
     `remoteUnauthorizedMessage()`, e `createCanvasMcpServer()` registra `canvasServiceTools()` (sem as de conexão).
  3. `serveMcpRequest()` atende a requisição sem sessão, em JSON, e fecha o servidor; a ferramenta segue o P03
     a partir do passo 2.
- **Resultado:** a mesma resposta do conector local, sem navegador nem arquivo no servidor.
- **Falhas:** access token vencido → 401 e o Claude usa o refresh token (e o P08 passo 7 estende o token do
  Canvas); token do Canvas vencido (mais de 30 dias sem uso, ou revogado) → `unauthorizedError()` devolve a
  orientação de gerar outro token e reconectar (P08).

## P10 — Conectar o WhatsApp remoto (OAuth com login do dono pelo GitHub)

- **Gatilho:** no Claude, adicionar o conector personalizado `https://<worker>/mcp` do WhatsApp (ADR 0012).
- **Passos:**
  1. `handleWhatsAppFetch()` monta os apps com `createWhatsAppApps()` (`readWhatsAppSettings()`: `readAllowedEmails()`,
     `requireEnv()`, `readTimingSettings()`, `readSendSettings()`; `resolveIssuer()`, `readOAuthSettings()`) e,
     como o caminho não é do `/pair`, passa a requisição a `routeRemoteRequest()`.
  2. Descoberta e registro seguem o P08 (passos 2 e 3). O conector vem de `whatsappRemoteConnector()`, com o login
     de `githubUpstreamLogin()` (`githubSettingsFrom()`).
  3. `handleAuthorizePage()` valida o pedido e, por ser login delegado, `redirectToUpstream()` manda o navegador a
     `githubAuthorizeUrl()` com o pedido selado no `state`.
  4. No retorno, `handleUpstreamCallback()` abre o `state` com `openAuthorizeRequest()` e chama `finishGithubLogin()`:
     `exchangeGithubCode()` troca o código, `fetchGithubEmails()` lê os e-mails e `pickAllowedEmail()` exige um
     verificado de `ALLOWED_EMAILS` (lista de `parseEmailList()`). O token do GitHub é descartado.
  5. O e-mail aceito vira o segredo do código (`issueAuthorizationCode()`, `redirectWithCode()`); a troca de tokens
     segue o P08 (passo 6).
- **Resultado:** o conector aparece conectado; o segredo selado nos tokens é só o e-mail do dono.
- **Falhas:** login cancelado ou conta fora da lista → página 403 com o motivo (`escapeHtml()`); `state` vencido →
  400; secret faltando → 500 explicando qual.

## P11 — Responder a uma ferramenta do WhatsApp (sob demanda)

- **Gatilho:** o Claude chama uma ferramenta em `POST /mcp` (ex.: `list_chats`).
- **Passos:**
  1. `handleMcp()` abre o access token e confere com `acceptsSecret` se o e-mail ainda está na lista; o
     `createServer` monta `createWhatsAppMcpServer()` com `whatsappTools()` (leitura; envio só com `ENABLE_SEND`).
  2. A ferramenta roda em `runRead()` com prazo de `toolDeadline()`: `prepareRead()` pede `POST /sync/wait` com o
     orçamento de `syncWaitBudget()` e, se precisa parear, devolve o endereço do `/pair`. `withDeadline()` corta o
     que passar do teto.
  3. As chamadas à ponte passam por `bridgeJson()`/`callBridge()` (`bridgePath()`, `jsonPost()`), que usam
     `bridgeFetchFor()` sobre o stub único de `bridgeStub()`. Erros viram texto com `bridgeErrorFrom()`;
     estouro de prazo, `bridgeTimeoutMessage()`.
  4. No Durable Object, `routeBridgeRequest()` (montado por `createBridgeLifecycle()`) chama `ensureRestored()`:
     `readBridgePhase()` e, se a ponte acabou de acordar, `restoreRequestInit()` manda o snapshot do R2. Depois
     `fetchBridge()` repassa com `withBridgeToken()` e `forwardInit()`.
  5. A resposta é reduzida por `compactChat()`, `compactMessage()`, `compactContact()` ou `compactStatus()` (textos
     limpos por `sanitizeText()` e `isHiddenChar()`) e embrulhada por `untrusted()`; `partialSyncWarning()` junta o
     aviso de resultado parcial. Mídia vira bloco MCP em `mediaResult()` (`binaryContentBlock()`, `bytesToBase64()`).
- **Resultado:** resposta compacta, com datas ISO com fuso e o aviso de conteúdo não confiável.
- **Falhas:** cold start lento → "Tempo esgotado…, tente de novo"; snapshot que não abre → erro `bad_snapshot`
  (a ponte nunca recomeça do zero sozinha); e-mail removido da lista → 403.

## P12 — Parear o número (`/pair`)

- **Gatilho:** o dono abre `https://<worker>/pair`.
- **Passos:**
  1. `routePairRequest()` reconhece o caminho com `isPairPath()` e lê a sessão com `readPairSession()`
     (`parseCookies()`, `openSealed()`).
  2. Sem sessão, `startPairLogin()` manda ao GitHub com `state` selado e um nonce em cookie (`pairCookie()`,
     `redirectWithCookies()`). No retorno, `handlePairCallback()` confere com `isValidPairLogin()`, conclui com
     `finishGithubLogin()` e `openPairSession()` grava a sessão.
  3. `pairPage()` mostra `renderPairPage()` com o status de `fetchPairStatus()` (`describePairStatus()`,
     `pairingSection()`, `maintenanceSection()`, `pairForm()`, `alertHtml()`) e um token de `issuePairCsrf()`.
  4. Cada POST passa por `routePairPost()` e `handlePairPost()`: `isTrustedPost()` confere token e `Origin`, e a
     ação de `PAIR_ACTIONS` chama a ponte (`/pair/code` com `normalizePhone()`, `/pair/qr`, `/logout`, ou
     `/__reset`, que chega a `resetBridge()` e `archiveSnapshot()`), com prazo de `pairDeadline()`; falha vira
     `pairActionError()`.
- **Resultado:** código de pareamento (ou QR) na tela; depois de digitado no celular, a ponte fica conectada.
- **Falhas:** formulário velho ou de outra origem → 403; número inválido → aviso na página; ponte sem resposta →
  "Não consegui ler o status".

## P13 — Guardar e restaurar a sessão (snapshots no R2)

- **Gatilho:** rotas que podem mudar o banco (`SNAPSHOT_AFTER_PATHS`), o fim do `SLEEP_AFTER` e, no melhor
  esforço, o `SIGTERM` da ponte.
- **Passos:**
  1. Depois do repasse, `SnapshotScheduler` agenda um snapshot se o último tem mais de `SNAPSHOT_INTERVAL_MS`;
     os snapshots rodam em fila e falhas só vão ao log (`logSnapshotFailure()`).
  2. `snapshotBridge()` pede `GET /snapshot` à ponte (já cifrado) e `storeSnapshotResponse()` lê
     `readUploadHeaders()`; `storeSnapshot()` compara com `storedGeneration()` e grava em fluxo de tamanho fixo
     (`workersFixedLength()`), descartando geração velha.
  3. Antes de dormir, o `onActivityExpired` do `WhatsAppBridge` tira o último snapshot e para o container.
  4. No `SIGTERM`, a ponte envia o snapshot a `snapshot.internal`, interceptado pelo Worker em
     `acceptSnapshotPush()` (token conferido por `sameSecret()`).
  5. No próximo boot, `ensureRestored()` devolve o snapshot à ponte (P11, passo 4).
- **Resultado:** sessão e mensagens sobrevivem ao container dormir, sem o Worker ver o conteúdo em claro.
- **Falhas:** snapshot recusado pela ponte → erro até "Recomeçar do zero" no `/pair`; queda abrupta sem `SIGTERM`
  → perde só o que mudou desde o último snapshot (o WhatsApp reenvia as pendências).

## P14 — Enviar uma mensagem (fase 2, `ENABLE_SEND`) e sync periódico opcional

- **Gatilho:** `send_message` com `confirmed_by_user: true`; ou um Cron Trigger igual a `SYNC_CRON`.
- **Passos:**
  1. Envio: `allowedRecipient()` exige o número na `SEND_ALLOWLIST` (`normalizePhone()`); no Durable Object,
     `guardSend()` aplica `planSend()` com o histórico do armazenamento antes de repassar o `/send` (a ponte confere
     allowlist e limite de novo).
  2. Cron: `runScheduledSync()` só age se `isSyncCronEnabled()`; acorda a ponte com `/sync/wait`, pede
     `/__snapshot` e deixa o container dormir após `SLEEP_AFTER`.
- **Resultado:** no máximo `SEND_MAX_PER_HOUR` envios por hora, só para a allowlist; com cron, histórico em dia
  mesmo sem uso.
- **Falhas:** destinatário fora da lista → recusa sem chamar a ponte; limite estourado → 429 com espera em segundos.
