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
  1. A cada requisição em `/mcp` (P09), `canvasRemoteConnector()` cria o cliente com `createCanvasClient()` e o
     token do usuário, escolhe as ferramentas com `canvasTools()` e as registra com `registerToolSpecs()` dentro de
     `createCanvasMcpServer()`.
  2. A chamada passa por `runToolSafely()`; a `ToolSpec` criada por `defineTool()` valida os argumentos.
  3. A ferramenta usa o cliente: `requestCanvas()` envia a requisição com `sendCanvasRequest()`
     (`buildUrl()` + `Authorization: Bearer`); listagens seguem as páginas com `collectPages()` e `parseNextLink()`.
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
- **Falhas:** 401 vira `unauthorizedMessage()` (gerar outro token e reconectar); outro status ≠ 2xx vira erro com
  status e corpo; argumentos inválidos são recusados pelo zod.

## P04 — (removido) Login pelo navegador

O modo local, com sessão do navegador, saiu do projeto ([ADR 0013](adr/0013-conector-so-remoto-pelo-marketplace.md)).
A autenticação agora é só o OAuth do P08. O número fica reservado para não renumerar os outros processos.

## P05 — Build dos conectores (`npm run build`)

- **Gatilho:** `npm run build` ou o `pr:check`.
- **Passos:**
  1. `runBuildCli()` acha os conectores com `listConnectors()` (pastas com `.claude-plugin/plugin.json`).
  2. `buildConnector()` lê o `.mcp.json` do plugin e falha se `pluginMcpProblems()` (com `mcpServerProblems()`)
     achar servidor que não seja `http` com URL `https://`, ou com `command` local.
  3. Se houver `src/remote-main.ts`, une o servidor remoto com o esbuild (`bundleOptions()`) em
     `connectors/<nome>/server/remote.js`, usado pelo Dockerfile (P08). O Worker compila direto do `src/`.
- **Resultado:** plugin conferido e bundle remoto atualizado na pasta do conector.
- **Falhas:** `.mcp.json` com servidor local ou URL insegura, ou erro de compilação, interrompem com a lista dos
  problemas.

## P06 — Portão de PR local (`npm run pr:check`)

- **Gatilho:** antes de abrir e antes de mergear um PR (não há CI, ADR 0006).
- **Passos:**
  1. `scripts/pr-check.sh` exige o título do PR e roda `npm run check` (inclui o P01 via `runDocsCli()`).
  2. Roda o P05 (`npm run build`) e falha se o bundle versionado dos conectores mudar sem commit.
  3. Roda o commitlint nos commits da branch desde `origin/main` e no título do PR.
- **Resultado:** `✔ pr:check verde`, condição para o Claude mergear com squash.
- **Falhas:** qualquer etapa com erro para o script com código ≠ 0.

## P07 — Instalar um conector pelo marketplace (Claude, Cowork e Claude Code)

- **Gatilho:** no Claude, "Adicionar marketplace" com `temponi-bernardo/claude-connectors` e instalar o plugin.
- **Passos:**
  1. O Claude lê `.claude-plugin/marketplace.json` e copia `connectors/<nome>/`, que só tem `plugin.json` e o
     `.mcp.json` (P05 garante que ele aponta para um servidor remoto).
  2. O `.mcp.json` registra o servidor `http` do Worker (`https://canvas-puc-remote.bftemponi.workers.dev/mcp`).
     Nada é instalado nem roda no computador.
  3. Na primeira chamada, o servidor responde 401 e o Claude abre o OAuth do P08 (Gmail: P10); a partir daí, P09
     (Gmail: P12).
- **Resultado:** as ferramentas aparecem como `mcp__plugin_<nome>_<servidor>__<ferramenta>`.
- **Falhas:** sem acesso ao repositório, o "Adicionar marketplace" falha; Worker fora do ar → o conector aparece
  como falha de conexão.

## P08 — Conectar o Canvas remoto (OAuth no claude.ai)

- **Gatilho:** a primeira chamada do plugin instalado (P07), ou no claude.ai: Configurações → Conectores →
  Adicionar conector personalizado com `https://<servidor>/mcp` (ADR 0009); ou um token vencido que obriga a
  reconectar.
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
  2. O `createServer` de `canvasRemoteConnector()` monta o cliente com o token, e `createCanvasMcpServer()` registra
     `canvasTools()`.
  3. `serveMcpRequest()` atende a requisição sem sessão, em JSON, e fecha o servidor; a ferramenta segue o P03
     a partir do passo 2.
- **Resultado:** a resposta da ferramenta, sem nada guardado no servidor.
- **Falhas:** access token vencido → 401 e o Claude usa o refresh token (e o P08 passo 7 estende o token do
  Canvas); token do Canvas vencido (mais de 30 dias sem uso, ou revogado) → `unauthorizedMessage()` devolve a
  orientação de gerar outro token e reconectar (P08).

## P10 — Conectar o Gmail remoto (OAuth do Claude com login no Google)

- **Gatilho:** no claude.ai, Configurações → Conectores → Adicionar conector personalizado com
  `https://<worker>/mcp` (ADR 0014).
- **Passos:**
  1. `handleGmailWorkerFetch()` (entrada `src/index.ts`) cria o provedor com `createGmailProvider()` para a origem
     de `publicOrigin()`; a biblioteca atende metadados, `/register` (filtrado por `checkClientRegistration()`) e
     `/token`, e manda o resto para `handleDefaultRequest()`, que monta `createGmailDeps()` (`readGmailSettings()`).
  2. `GET /authorize`: `showAuthorize()` valida o pedido e mostra `consentPage()`; se o consentimento já foi
     lembrado, vai direto a `beginGoogleSignIn()`.
  3. `POST /authorize`: `submitAuthorize()` nega (volta ao Claude com `access_denied`) ou aprova e chama
     `beginGoogleSignIn()`, que guarda verificador PKCE e `nonce` na transação e redireciona com
     `googleAuthorizeUrl()` (só `openid email`).
  4. `GET /google/callback` sem prefixo `link.`: `finishSignIn()` recupera a transação; `completeSignIn()` troca o
     código com `exchangeGoogleCode()`, valida o `id_token` com `verifyGoogleIdToken()` e confere a allowlist com
     `findAllowedAccount()` antes de a biblioteca concluir a autorização (props: e-mail e id de sessão).
- **Resultado:** o Claude recebe o código e troca por tokens no KV `OAUTH_KV`.
- **Falhas:** e-mail fora de `ALLOWED_EMAILS` → 403 (`accessDeniedPage()`); recusa no Google → `access_denied` ao
  Claude; pedido inválido ou cookie ausente → `authorizationErrorResponse()`; secret faltando → 500
  (`configErrorResponse()`).

## P11 — Vincular uma conta Gmail (`/accounts/link`)

- **Gatilho:** o dono abre `https://<worker>/accounts/link` no navegador (uma vez por conta, ou quando uma
  ferramenta diz que a conta perdeu o acesso).
- **Passos:**
  1. `startAccountLink()` cria `state` (`link.` + aleatório), verificador, `nonce` e cookie de vínculo; grava o
     pedido selado no KV pela chave de `linkRequestKey()` com validade de 10 minutos e redireciona com
     `googleAuthorizeUrl()` (`gmail.readonly`, acesso offline).
  2. Na volta, `finishAccountLink()` pega o pedido com `takeLinkRequest()` (uso único, cookie conferido por
     `readCookie()` e `sha256Hex()`).
  3. `linkSafely()` roda `linkFromCode()`, que troca o código, valida o `id_token`, confere a allowlist e `linkRefusal()` (escopo do Gmail e
     refresh token); `storeLinkedAccount()` grava com `saveLinkedAccount()` (selo de `sealLinkedAccount()`).
- **Resultado:** página "Conta vinculada"; o cookie é apagado com `linkCookie()`.
- **Falhas:** pedido vencido ou de outro navegador → "Pedido expirado"; recusa no Google → "Vínculo cancelado";
  conta fora da allowlist → 403; permissão do Gmail desmarcada → "Permissão faltando".

## P12 — Responder a uma ferramenta do Gmail

- **Gatilho:** o Claude chama uma ferramenta em `POST /mcp` com o access token.
- **Passos:**
  1. A biblioteca valida o token e chama `handleMcpApi()`, que aplica `isRateLimited()` pela sessão e monta
     `createGmailServer()` com `GMAIL_TOOLS`; `serveMcpRequest()` responde sem sessão.
  2. A ferramenta resolve `account` com `resolveAccounts()` ou `resolveSingleAccount()`.
  3. `gmailGet()` pega o access token com `getAccessToken()` (memória ou `renewAccessToken()` a partir de
     `requireLinkedAccount()`), chama a Gmail API com `gmailUrl()` e, depois de 401, tenta de novo uma vez.
  4. As respostas viram objetos enxutos: `searchThreads()` (`searchAccount()`, `summarizeThread()`, página
     combinada com `encodeMultiPageToken()`), `formatThread()`/`formatMessage()` (`messageBodyText()`,
     `truncateText()`), `accountLabels()`, `accountStatus()` ou `readAttachmentText()`
     (`attachmentBytesToText()` → `pdfToText()`, `wordToText()` ou `htmlToText()`); `withUntrustedNotice()` põe o
     aviso de conteúdo não confiável.
- **Resultado:** texto JSON enxuto, limitado em tamanho, com o apelido da conta em cada item.
- **Falhas:** conta não vinculada ou revogada → `relinkError()` com o link de `linkUrl()`; `invalid_grant` marca a
  conta como revogada; erro HTTP do Gmail → `gmailHttpError()`; mais de 120 req/min → 429
  (`rateLimitedResponse()`); anexo acima de 5 MB ou tipo não suportado → erro explicando o limite.
