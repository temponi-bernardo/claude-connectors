# Funções

Toda função de topo do código aparece aqui, em um modelo fixo. Os campos entre `<!-- gerado:inicio -->` e
`<!-- gerado:fim -->` (Arquivo, Assinatura, Usada por, Processos) são escritos por `npm run docs:generate` a
partir do código — não edite à mão. Os campos **Faz**, **Entrada**, **Saída**, **Efeitos** e **Erros** são
manuais e obrigatórios; `npm run docs:check` falha enquanto houver `_preencher_`.

Modelo e regras de escrita: [DOCUMENTATION.md](DOCUMENTATION.md#função).

## Índice por módulo

<!-- indice:inicio -->

- `connectors/canvas-puc/src/auth.ts`: [`pickAuth`](#pickauth), [`authHeaders`](#authheaders), [`loginAndStore`](#loginandstore), [`renewAuth`](#renewauth), [`renewOnce`](#renewonce), [`createAuthProvider`](#createauthprovider)
- `connectors/canvas-puc/src/browser-login.ts`: [`isLoginChooserUrl`](#isloginchooserurl), [`launchLoginBrowser`](#launchloginbrowser), [`pageHasCanvasSession`](#pagehascanvassession), [`clickInstitutionButton`](#clickinstitutionbutton), [`waitForCanvasLogin`](#waitforcanvaslogin), [`browserLogin`](#browserlogin)
- `connectors/canvas-puc/src/client.ts`: [`unauthorizedMessage`](#unauthorizedmessage), [`sendCanvasRequest`](#sendcanvasrequest), [`unauthorizedError`](#unauthorizederror), [`requestWithRenewal`](#requestwithrenewal), [`collectPages`](#collectpages), [`fetchDownload`](#fetchdownload), [`fetchPlainText`](#fetchplaintext), [`fetchFileBytes`](#fetchfilebytes), [`createCanvasClient`](#createcanvasclient)
- `connectors/canvas-puc/src/config.ts`: [`readCanvasConfig`](#readcanvasconfig)
- `connectors/canvas-puc/src/files.ts`: [`fileContentBlock`](#filecontentblock), [`downloadedFileResult`](#downloadedfileresult), [`downloadRefusal`](#downloadrefusal), [`downloadCanvasFile`](#downloadcanvasfile), [`readCanvasFileText`](#readcanvasfiletext)
- `connectors/canvas-puc/src/format.ts`: [`shortText`](#shorttext), [`toProfile`](#toprofile), [`toCourse`](#tocourse), [`toSubmissionFlags`](#tosubmissionflags), [`toPlannerItem`](#toplanneritem), [`toAssignmentSummary`](#toassignmentsummary), [`toRubricCriterion`](#torubriccriterion), [`toFileInfo`](#tofileinfo), [`toSubmissionDetail`](#tosubmissiondetail), [`toAssignmentDetail`](#toassignmentdetail), [`toGradeRow`](#tograderow), [`toEnrollmentGrade`](#toenrollmentgrade), [`toAnnouncement`](#toannouncement), [`toModuleItem`](#tomoduleitem), [`toModule`](#tomodule), [`toDiscussionSummary`](#todiscussionsummary), [`flattenDiscussion`](#flattendiscussion), [`toCalendarEvent`](#tocalendarevent)
- `connectors/canvas-puc/src/helpers.ts`: [`isoDaysFrom`](#isodaysfrom), [`dateOnly`](#dateonly), [`courseContextCodes`](#coursecontextcodes), [`courseNameMap`](#coursenamemap), [`participantNames`](#participantnames), [`isTextFile`](#istextfile), [`matchModuleItems`](#matchmoduleitems), [`activeCourses`](#activecourses), [`fetchOwnSubmission`](#fetchownsubmission), [`getAllOrEmpty`](#getallorempty)
- `connectors/canvas-puc/src/main.ts`: [`startCanvasServer`](#startcanvasserver)
- `connectors/canvas-puc/src/playwright-runtime.ts`: [`runtimeDir`](#runtimedir), [`npmInstallArgs`](#npminstallargs), [`resolveFrom`](#resolvefrom), [`installPlaywright`](#installplaywright), [`loadPlaywright`](#loadplaywright)
- `connectors/canvas-puc/src/remote-main.ts`: [`startCanvasRemoteServer`](#startcanvasremoteserver)
- `connectors/canvas-puc/src/remote.ts`: [`withCanvasUserAgent`](#withcanvasuseragent), [`readCanvasRemoteSettings`](#readcanvasremotesettings), [`canvasLoginText`](#canvaslogintext), [`remoteUnauthorizedMessage`](#remoteunauthorizedmessage), [`createTokenAuthProvider`](#createtokenauthprovider), [`verifyCanvasToken`](#verifycanvastoken), [`matchesVisibleToken`](#matchesvisibletoken), [`planTokenRenewal`](#plantokenrenewal), [`canvasTokenApi`](#canvastokenapi), [`renewCanvasToken`](#renewcanvastoken), [`canvasRemoteConnector`](#canvasremoteconnector)
- `connectors/canvas-puc/src/session.ts`: [`sessionFilePath`](#sessionfilepath), [`cookieHeader`](#cookieheader), [`csrfToken`](#csrftoken), [`isCanvasSession`](#iscanvassession), [`loadSession`](#loadsession), [`saveSession`](#savesession), [`clearSession`](#clearsession)
- `connectors/canvas-puc/src/tools-write.ts`: [`submissionPayload`](#submissionpayload)
- `connectors/canvas-puc/src/tools.ts`: [`canvasServiceTools`](#canvasservicetools), [`canvasTools`](#canvastools), [`createCanvasMcpServer`](#createcanvasmcpserver)
- `connectors/canvas-puc/src/worker.ts`: [`createWorkerApp`](#createworkerapp), [`handleWorkerFetch`](#handleworkerfetch)
- `connectors/whatsapp/src/bridge-client.ts`: [`bridgeErrorFrom`](#bridgeerrorfrom), [`withDeadline`](#withdeadline), [`bridgeTimeoutMessage`](#bridgetimeoutmessage), [`callBridge`](#callbridge), [`bridgeJson`](#bridgejson), [`bridgePath`](#bridgepath), [`jsonPost`](#jsonpost)
- `connectors/whatsapp/src/config.ts`: [`requireEnv`](#requireenv), [`readIntInRange`](#readintinrange), [`readSleepAfter`](#readsleepafter), [`normalizePhone`](#normalizephone), [`readSendAllowlist`](#readsendallowlist), [`readAllowedEmails`](#readallowedemails), [`readTimingSettings`](#readtimingsettings), [`readSendSettings`](#readsendsettings), [`readWhatsAppSettings`](#readwhatsappsettings), [`containerEnvVars`](#containerenvvars)
- `connectors/whatsapp/src/container.ts`: [`workersFixedLength`](#workersfixedlength)
- `connectors/whatsapp/src/format.ts`: [`isHiddenChar`](#ishiddenchar), [`sanitizeText`](#sanitizetext), [`untrusted`](#untrusted), [`compactMessage`](#compactmessage), [`compactChat`](#compactchat), [`partialSyncWarning`](#partialsyncwarning), [`compactStatus`](#compactstatus)
- `connectors/whatsapp/src/lifecycle.ts`: [`withBridgeToken`](#withbridgetoken), [`fetchBridge`](#fetchbridge), [`readBridgePhase`](#readbridgephase), [`restoreRequestInit`](#restorerequestinit), [`ensureRestored`](#ensurerestored), [`snapshotBridge`](#snapshotbridge), [`planSend`](#plansend), [`guardSend`](#guardsend), [`forwardInit`](#forwardinit), [`createBridgeLifecycle`](#createbridgelifecycle), [`logSnapshotFailure`](#logsnapshotfailure), [`resetBridge`](#resetbridge), [`routeBridgeRequest`](#routebridgerequest)
- `connectors/whatsapp/src/pair-page.ts`: [`describePairStatus`](#describepairstatus), [`pairForm`](#pairform), [`pairingSection`](#pairingsection), [`maintenanceSection`](#maintenancesection), [`alertHtml`](#alerthtml), [`renderPairPage`](#renderpairpage)
- `connectors/whatsapp/src/pair.ts`: [`parseCookies`](#parsecookies), [`pairCookie`](#paircookie), [`redirectWithCookies`](#redirectwithcookies), [`readPairSession`](#readpairsession), [`issuePairCsrf`](#issuepaircsrf), [`isTrustedPost`](#istrustedpost), [`startPairLogin`](#startpairlogin), [`isValidPairLogin`](#isvalidpairlogin), [`openPairSession`](#openpairsession), [`handlePairCallback`](#handlepaircallback), [`pairDeadline`](#pairdeadline), [`fetchPairStatus`](#fetchpairstatus), [`pairPage`](#pairpage), [`pairActionError`](#pairactionerror), [`handlePairPost`](#handlepairpost), [`routePairPost`](#routepairpost), [`isPairPath`](#ispairpath), [`routePairRequest`](#routepairrequest)
- `connectors/whatsapp/src/snapshots.ts`: [`storedGeneration`](#storedgeneration), [`readUploadHeaders`](#readuploadheaders), [`storeSnapshot`](#storesnapshot), [`storeSnapshotResponse`](#storesnapshotresponse), [`archiveSnapshot`](#archivesnapshot), [`sameSecret`](#samesecret), [`acceptSnapshotPush`](#acceptsnapshotpush)
- `connectors/whatsapp/src/tools.ts`: [`toolDeadline`](#tooldeadline), [`syncWaitBudget`](#syncwaitbudget), [`prepareRead`](#prepareread), [`runRead`](#runread), [`compactContact`](#compactcontact), [`decodeHeaderText`](#decodeheadertext), [`mediaResult`](#mediaresult), [`allowedRecipient`](#allowedrecipient), [`whatsappTools`](#whatsapptools), [`createWhatsAppMcpServer`](#createwhatsappmcpserver)
- `connectors/whatsapp/src/worker-env.ts`: [`bridgeStub`](#bridgestub), [`bridgeFetchFor`](#bridgefetchfor)
- `connectors/whatsapp/src/worker.ts`: [`unixNow`](#unixnow), [`githubSettingsFrom`](#githubsettingsfrom), [`whatsappRemoteConnector`](#whatsappremoteconnector), [`createWhatsAppApps`](#createwhatsappapps), [`handleWhatsAppFetch`](#handlewhatsappfetch), [`isSyncCronEnabled`](#issynccronenabled), [`runScheduledSync`](#runscheduledsync)
- `src/core/bytes.ts`: [`byteView`](#byteview), [`concatBytes`](#concatbytes), [`utf16leToString`](#utf16letostring), [`bytesToBase64`](#bytestobase64)
- `src/core/cfb.ts`: [`isCfb`](#iscfb), [`readCfbHeader`](#readcfbheader), [`cfbSector`](#cfbsector), [`sectorWords`](#sectorwords), [`fatSectorIds`](#fatsectorids), [`followChain`](#followchain), [`readRegularChain`](#readregularchain), [`parseDirectory`](#parsedirectory), [`openCfb`](#opencfb), [`readMiniStream`](#readministream), [`readCfbStream`](#readcfbstream)
- `src/core/env.ts`: [`envValue`](#envvalue), [`parseFlag`](#parseflag), [`toEnvVars`](#toenvvars)
- `src/core/html.ts`: [`htmlToText`](#htmltotext)
- `src/core/http.ts`: [`buildUrl`](#buildurl), [`parseNextLink`](#parsenextlink)
- `src/core/word.ts`: [`docxXmlToText`](#docxxmltotext), [`docxToText`](#docxtotext), [`cp1252ToString`](#cp1252tostring), [`parsePieceTable`](#parsepiecetable), [`pieceText`](#piecetext), [`cleanWordText`](#cleanwordtext), [`docToText`](#doctotext), [`wordKind`](#wordkind), [`wordToText`](#wordtotext)
- `src/core/zip.ts`: [`findEndOfCentralDirectory`](#findendofcentraldirectory), [`listZipEntries`](#listzipentries), [`zipEntryBytes`](#zipentrybytes), [`inflateRaw`](#inflateraw), [`readZipEntry`](#readzipentry)
- `src/mcp/tools.ts`: [`defineTool`](#definetool), [`textResult`](#textresult), [`rawToolResult`](#rawtoolresult), [`toToolResult`](#totoolresult), [`errorResult`](#errorresult), [`runToolSafely`](#runtoolsafely), [`registerToolSpecs`](#registertoolspecs), [`binaryContentBlock`](#binarycontentblock)
- `src/remote/github-login.ts`: [`githubAuthorizeUrl`](#githubauthorizeurl), [`parseEmailList`](#parseemaillist), [`pickAllowedEmail`](#pickallowedemail), [`exchangeGithubCode`](#exchangegithubcode), [`fetchGithubEmails`](#fetchgithubemails), [`finishGithubLogin`](#finishgithublogin), [`githubUpstreamLogin`](#githubupstreamlogin)
- `src/remote/handler.ts`: [`jsonResponse`](#jsonresponse), [`pageSecurityPolicy`](#pagesecuritypolicy), [`htmlResponse`](#htmlresponse), [`readForm`](#readform), [`readJsonBody`](#readjsonbody), [`loginPageFor`](#loginpagefor), [`redirectWithCode`](#redirectwithcode), [`handleRegister`](#handleregister), [`redirectToUpstream`](#redirecttoupstream), [`handleAuthorizePage`](#handleauthorizepage), [`handleUpstreamCallback`](#handleupstreamcallback), [`handleAuthorizeSubmit`](#handleauthorizesubmit), [`renewSecretQuietly`](#renewsecretquietly), [`handleToken`](#handletoken), [`handleMcp`](#handlemcp), [`withCors`](#withcors), [`routeRemoteRequest`](#routeremoterequest), [`createRemoteHandler`](#createremotehandler)
- `src/remote/login-page.ts`: [`escapeHtml`](#escapehtml), [`renderLoginPage`](#renderloginpage)
- `src/remote/mcp-endpoint.ts`: [`serveMcpRequest`](#servemcprequest), [`mcpUnauthorizedResponse`](#mcpunauthorizedresponse)
- `src/remote/node-server.ts`: [`readPublicUrl`](#readpublicurl), [`readRemoteServerConfig`](#readremoteserverconfig), [`readNodeBody`](#readnodebody), [`toWebRequest`](#towebrequest), [`writeWebResponse`](#writewebresponse), [`serveNodeRequest`](#servenoderequest), [`startRemoteHttpServer`](#startremotehttpserver)
- `src/remote/oauth.ts`: [`readOAuthSettings`](#readoauthsettings), [`resolveIssuer`](#resolveissuer), [`oauthError`](#oautherror), [`authorizationServerMetadata`](#authorizationservermetadata), [`protectedResourceMetadata`](#protectedresourcemetadata), [`isAllowedRedirect`](#isallowedredirect), [`pkceChallenge`](#pkcechallenge), [`readRedirectUris`](#readredirecturis), [`registerClient`](#registerclient), [`clientRedirectUris`](#clientredirecturis), [`parseAuthorizeQuery`](#parseauthorizequery), [`readCodeChallenge`](#readcodechallenge)
- `src/remote/seal.ts`: [`parseSealKey`](#parsesealkey), [`sealPayload`](#sealpayload), [`unsealPayload`](#unsealpayload), [`openSealed`](#opensealed)
- `src/remote/tokens.ts`: [`sealAuthorizeRequest`](#sealauthorizerequest), [`openAuthorizeRequest`](#openauthorizerequest), [`issueAuthorizationCode`](#issueauthorizationcode), [`issueTokenSet`](#issuetokenset), [`redeemAuthorizationCode`](#redeemauthorizationcode), [`redeemRefreshToken`](#redeemrefreshtoken), [`redeemTokenRequest`](#redeemtokenrequest), [`readAccessSecret`](#readaccesssecret)
- `tools/docs/ast.ts`: [`toPosixRelative`](#toposixrelative), [`globToRegExp`](#globtoregexp), [`isAnalyzedSource`](#isanalyzedsource), [`openProject`](#openproject), [`signatureOf`](#signatureof), [`collectFileFunctions`](#collectfilefunctions), [`collectFunctions`](#collectfunctions), [`isDataDeclaration`](#isdatadeclaration), [`collectFileConstants`](#collectfileconstants), [`collectConstants`](#collectconstants), [`isIgnoredReference`](#isignoredreference), [`ownerLabelOf`](#ownerlabelof), [`findDeclaration`](#finddeclaration), [`buildReferenceIndex`](#buildreferenceindex), [`buildCallGraph`](#buildcallgraph)
- `tools/docs/checks.ts`: [`checkFunctionsDocumented`](#checkfunctionsdocumented), [`checkSectionModules`](#checksectionmodules), [`checkUniqueNames`](#checkuniquenames), [`checkGeneratedBlocks`](#checkgeneratedblocks), [`checkManualFields`](#checkmanualfields), [`checkProcessCitations`](#checkprocesscitations), [`checkStructure`](#checkstructure), [`checkUiComponents`](#checkuicomponents), [`checkTests`](#checktests), [`checkConstants`](#checkconstants), [`runAllChecks`](#runallchecks)
- `tools/docs/cli.ts`: [`runDocsCli`](#rundocscli)
- `tools/docs/config.ts`: [`mergeDocsConfig`](#mergedocsconfig), [`loadDocsConfig`](#loaddocsconfig)
- `tools/docs/inventory.ts`: [`listGitFiles`](#listgitfiles), [`walkFiles`](#walkfiles), [`dirsFromFiles`](#dirsfromfiles), [`listVersionedDirs`](#listversioneddirs), [`readTestFilesText`](#readtestfilestext), [`listUiComponents`](#listuicomponents), [`loadTestExceptions`](#loadtestexceptions), [`buildInventory`](#buildinventory)
- `tools/docs/markdown.ts`: [`firstGroup`](#firstgroup), [`stripCodeBlocks`](#stripcodeblocks), [`extractCalledNames`](#extractcallednames), [`sliceBetween`](#slicebetween), [`replaceBetween`](#replacebetween), [`extractFunctionSections`](#extractfunctionsections), [`buildSection`](#buildsection), [`extractProcessCitations`](#extractprocesscitations), [`extractDocumentedDirs`](#extractdocumenteddirs), [`extractBacktickedNames`](#extractbacktickednames)
- `tools/docs/render.ts`: [`formatList`](#formatlist), [`renderGeneratedBlock`](#rendergeneratedblock), [`renderNewSection`](#rendernewsection), [`renderModuleIndex`](#rendermoduleindex), [`computeGeneratedData`](#computegenerateddata), [`closureOf`](#closureof), [`processesByFunction`](#processesbyfunction), [`replaceSectionBlock`](#replacesectionblock), [`appendSection`](#appendsection), [`insertBeforeDataTable`](#insertbeforedatatable), [`removeSection`](#removesection), [`removeEmptyModules`](#removeemptymodules), [`pruneOrphanSections`](#pruneorphansections), [`applyGenerated`](#applygenerated)
- `tools/docs/run.ts`: [`readOptional`](#readoptional), [`readDocsTexts`](#readdocstexts), [`formatIssues`](#formatissues), [`runCheck`](#runcheck), [`generateFunctionsDoc`](#generatefunctionsdoc), [`runGenerate`](#rungenerate)
- `tools/pack/cli.ts`: [`installedExternalVersions`](#installedexternalversions), [`runNodeBin`](#runnodebin), [`writeJson`](#writejson), [`buildConnectorRuntime`](#buildconnectorruntime), [`packMcpb`](#packmcpb), [`runPackCli`](#runpackcli)
- `tools/pack/pack.ts`: [`listConnectors`](#listconnectors), [`pluginManifest`](#pluginmanifest), [`pluginMcpConfig`](#pluginmcpconfig), [`readManifestIdentity`](#readmanifestidentity), [`runtimePackageJson`](#runtimepackagejson), [`bundleOptions`](#bundleoptions)

<!-- indice:fim -->

## `tools/docs/ast.ts`

### `toPosixRelative`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `toPosixRelative(rootDir: string, absolutePath: string): string`
- **Usada por:** `collectFileConstants()`, `collectFileFunctions()`, `openProject()`, `ownerLabelOf()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Converte um caminho absoluto em caminho relativo à raiz, sempre com `/`.
- **Entrada:** `rootDir`: raiz absoluta; `absolutePath`: caminho absoluto dentro dela.
- **Saída:** Caminho relativo POSIX, ex.: `src/a.ts`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `globToRegExp`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `globToRegExp(glob: string): RegExp`
- **Usada por:** `isAnalyzedSource()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Converte um glob simples (`**/`, `**`, `*`) em expressão regular ancorada, para casar caminhos relativos.
- **Entrada:** `glob`: padrão, ex.: `**/fixtures/**`.
- **Saída:** `RegExp` que casa o caminho inteiro.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `isAnalyzedSource`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `isAnalyzedSource(relativePath: string, config: DocsConfig): boolean`
- **Usada por:** `openProject()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Decide se um arquivo entra na análise: termina em `.ts`, não é `.d.ts`, não é teste e não casa com nenhum glob de `ignore`.
- **Entrada:** `relativePath`: caminho relativo; `config`: configuração do docs.
- **Saída:** `true` se o arquivo deve ser analisado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `openProject`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `openProject(rootDir: string, config: DocsConfig): Project`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Cria o projeto ts-morph com módulo/resolução NodeNext, adiciona os `.ts` das pastas configuradas e remove os que `isAnalyzedSource()` rejeita.
- **Entrada:** `rootDir`: raiz do repositório; `config`: configuração do docs.
- **Saída:** `Project` do ts-morph pronto para análise.
- **Efeitos:** Lê arquivos do disco.
- **Erros:** Erros de leitura do sistema de arquivos propagam.

### `signatureOf`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `signatureOf(fn: FunctionDeclaration): string`
- **Usada por:** `collectFileFunctions()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Monta a assinatura legível de uma função: `async` se houver, nome, parâmetros como escritos e tipo de retorno (declarado ou inferido).
- **Entrada:** `fn`: declaração de função do ts-morph.
- **Saída:** Texto como `slugify(title: string): string`.
- **Efeitos:** Nenhum (pura sobre a AST).
- **Erros:** Nenhum.

### `collectFileFunctions`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `collectFileFunctions(rootDir: string, file: SourceFile): FunctionInfo[]`
- **Usada por:** `collectFunctions()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lista as funções de topo nomeadas de um arquivo, com arquivo relativo e assinatura.
- **Entrada:** `rootDir`: raiz; `file`: arquivo-fonte do ts-morph.
- **Saída:** Lista de `FunctionInfo` na ordem do arquivo.
- **Efeitos:** Nenhum (pura sobre a AST).
- **Erros:** Nenhum.

### `collectFunctions`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `collectFunctions(rootDir: string, project: Project): FunctionInfo[]`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lista todas as funções de topo do projeto, arquivos em ordem alfabética.
- **Entrada:** `rootDir`: raiz; `project`: projeto ts-morph aberto.
- **Saída:** Lista de `FunctionInfo` (o registro de funções).
- **Efeitos:** Nenhum (pura sobre a AST).
- **Erros:** Nenhum.

### `isDataDeclaration`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `isDataDeclaration(declaration: VariableDeclaration): boolean`
- **Usada por:** `collectFileConstants()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Decide se uma declaração de variável é dado/constante e não uma função atribuída a `const` (arrow ou function expression).
- **Entrada:** `declaration`: declaração de variável do ts-morph.
- **Saída:** `true` para dados (inclusive sem inicializador).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `collectFileConstants`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `collectFileConstants(rootDir: string, file: SourceFile): ConstantInfo[]`
- **Usada por:** `collectConstants()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lista as constantes exportadas de topo de um arquivo, excluindo funções atribuídas a variáveis.
- **Entrada:** `rootDir`: raiz; `file`: arquivo-fonte.
- **Saída:** Lista de `ConstantInfo`.
- **Efeitos:** Nenhum (pura sobre a AST).
- **Erros:** Nenhum.

### `collectConstants`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `collectConstants(rootDir: string, project: Project): ConstantInfo[]`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lista as constantes exportadas de todo o projeto, para a tabela "Dados e constantes".
- **Entrada:** `rootDir`: raiz; `project`: projeto ts-morph.
- **Saída:** Lista de `ConstantInfo`.
- **Efeitos:** Nenhum (pura sobre a AST).
- **Erros:** Nenhum.

### `isIgnoredReference`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `isIgnoredReference(node: Node): boolean`
- **Usada por:** `buildReferenceIndex()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Decide se um nó de referência deve ser ignorado no índice: a própria declaração, especificadores de import/export, cláusula de import e `export default`.
- **Entrada:** `node`: nó de referência retornado pelo ts-morph.
- **Saída:** `true` para ignorar.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `ownerLabelOf`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `ownerLabelOf(rootDir: string, node: Node): string`
- **Usada por:** `buildReferenceIndex()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Descobre quem contém uma referência: a função de topo que a envolve (`nome()`) ou, fora de função, o módulo do arquivo (`arquivo (módulo)`).
- **Entrada:** `rootDir`: raiz; `node`: nó de referência.
- **Saída:** Rótulo usado em "Usada por".
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `findDeclaration`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `findDeclaration(rootDir: string, project: Project, info: FunctionInfo): FunctionDeclaration | undefined`
- **Usada por:** `buildReferenceIndex()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Localiza a declaração de uma função do registro no projeto, pelo arquivo e nome.
- **Entrada:** `rootDir`: raiz; `project`: projeto; `info`: função do registro.
- **Saída:** A `FunctionDeclaration`, ou `undefined` se arquivo/função não existirem.
- **Efeitos:** Nenhum.
- **Erros:** Nenhum.

### `buildReferenceIndex`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `buildReferenceIndex(rootDir: string, project: Project, functions: readonly FunctionInfo[]): ReferenceIndex`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Monta o índice de referências: para cada função, o conjunto de rótulos de quem a chama ou a passa como valor (via `findReferencesAsNodes`, filtrado por `isIgnoredReference()`).
- **Entrada:** `rootDir`: raiz; `project`: projeto; `functions`: registro.
- **Saída:** `ReferenceIndex` (nome → rótulos).
- **Efeitos:** Nenhum (pura sobre a AST).
- **Erros:** Nenhum.

### `buildCallGraph`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/ast.ts`
- **Assinatura:** `buildCallGraph(functions: readonly FunctionInfo[], references: ReferenceIndex): CallGraph`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Inverte o índice de referências em grafo de chamadas: função → funções do registro que ela usa. Referências do nível de módulo não geram aresta.
- **Entrada:** `functions`: registro; `references`: índice de referências.
- **Saída:** `CallGraph` com uma entrada por função.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `tools/docs/checks.ts`

### `checkFunctionsDocumented`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkFunctionsDocumented(functions: readonly FunctionInfo[], sections: readonly FunctionSection[]): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Compara registro e seções: aponta função sem seção (`FUNCAO_SEM_DOC`) e seção sem função (`DOC_SEM_FUNCAO`).
- **Entrada:** `functions`: registro; `sections`: seções do FUNCTIONS.md.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkSectionModules`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkSectionModules(functions: readonly FunctionInfo[], sections: readonly FunctionSection[]): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Aponta seção colocada sob o heading `## arquivo` errado (`SECAO_NO_MODULO_ERRADO`).
- **Entrada:** `functions`: registro; `sections`: seções.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkUniqueNames`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkUniqueNames(functions: readonly FunctionInfo[]): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Aponta nome de função definido em mais de um arquivo (`NOME_DUPLICADO`).
- **Entrada:** `functions`: registro.
- **Saída:** Lista de `Issue`, uma por nome repetido.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkGeneratedBlocks`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkGeneratedBlocks(inventory: Inventory, sections: readonly FunctionSection[], citations: ProcessCitations): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Recalcula o bloco gerado de cada função documentada e compara com o texto atual (`BLOCO_GERADO_DESATUALIZADO`), mostrando esperado e encontrado.
- **Entrada:** `inventory`: inventário; `sections`: seções; `citations`: citações de processos.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkManualFields`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkManualFields(sections: readonly FunctionSection[]): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Confere os cinco campos manuais de cada seção: ausente (`CAMPO_MANUAL_FALTANDO`) ou ainda com o marcador `PLACEHOLDER` (`CAMPO_MANUAL_VAZIO`).
- **Entrada:** `sections`: seções.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkProcessCitations`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkProcessCitations(functions: readonly FunctionInfo[], citations: ProcessCitations): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Aponta função citada em PROCESSES.md que não existe no código (`PROCESSO_CITA_FUNCAO_INEXISTENTE`).
- **Entrada:** `functions`: registro; `citations`: citações por processo.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkStructure`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkStructure(versionedDirs: readonly string[], structureMarkdown: string): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Aponta pasta versionada ausente de STRUCTURE.md (`PASTA_SEM_DOC`).
- **Entrada:** `versionedDirs`: pastas com barra final; `structureMarkdown`: texto do STRUCTURE.md.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkUiComponents`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkUiComponents(components: readonly string[], uiMarkdown: string | null): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Aponta componente de UI sem menção em UI.md (`COMPONENTE_SEM_DOC`) ou UI.md ausente quando há componentes (`UI_DOC_FALTANDO`).
- **Entrada:** `components`: nomes dos componentes; `uiMarkdown`: texto do UI.md ou `null`.
- **Saída:** Lista de `Issue` (vazia sem componentes).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkTests`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkTests(inventory: Inventory): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Aponta função cujo nome não aparece em nenhum arquivo de teste e não está nas exceções (`FUNCAO_SEM_TESTE`), e exceção que cita função inexistente (`EXCECAO_DE_TESTE_OBSOLETA`).
- **Entrada:** `inventory`: inventário.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkConstants`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `checkConstants(inventory: Inventory, functionsMarkdown: string): Issue[]`
- **Usada por:** `runAllChecks()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Aponta constante exportada ausente da tabela "Dados e constantes" (`CONSTANTE_SEM_DOC`); só o trecho a partir desse heading conta.
- **Entrada:** `inventory`: inventário; `functionsMarkdown`: texto do FUNCTIONS.md.
- **Saída:** Lista de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `runAllChecks`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/checks.ts`
- **Assinatura:** `runAllChecks(inventory: Inventory, docs: DocsTexts, citations: ProcessCitations): Issue[]`
- **Usada por:** `runCheck()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Extrai as seções do FUNCTIONS.md e roda todas as checagens puras, concatenando os problemas na ordem fixa.
- **Entrada:** `inventory`: inventário; `docs`: textos dos documentos; `citations`: citações de processos.
- **Saída:** Lista completa de `Issue`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `tools/docs/cli.ts`

### `runDocsCli`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/cli.ts`
- **Assinatura:** `async runDocsCli(args: readonly string[]): Promise<number>`
- **Usada por:** `tools/docs/cli.ts (módulo)`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Interpreta o comando (`check` padrão ou `generate`), executa e imprime o resultado.
- **Entrada:** `args`: argumentos da linha de comando.
- **Saída:** Código de saída: 0 ok, 1 problemas, 2 comando desconhecido.
- **Efeitos:** Escreve no stdout/stderr; `generate` regrava FUNCTIONS.md.
- **Erros:** Propaga erros de configuração para o processo (sai com erro).

## `tools/docs/config.ts`

### `mergeDocsConfig`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/config.ts`
- **Assinatura:** `mergeDocsConfig(partial: unknown): DocsConfig`
- **Usada por:** `loadDocsConfig()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Mescla um objeto parcial sobre `DEFAULT_DOCS_CONFIG` e valida `sourceDirs` e `uiDir`.
- **Entrada:** `partial`: valor lido do JSON (qualquer tipo).
- **Saída:** `DocsConfig` completa.
- **Efeitos:** Nenhum (pura).
- **Erros:** `Error` com mensagem em português se não for objeto, se `sourceDirs` estiver vazio ou se `uiDir` tiver tipo inválido.

### `loadDocsConfig`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/config.ts`
- **Assinatura:** `loadDocsConfig(rootDir: string): DocsConfig`
- **Usada por:** `runCheck()`, `runGenerate()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lê `docs.config.json` da raiz e devolve a configuração completa; sem arquivo, usa os padrões.
- **Entrada:** `rootDir`: raiz do repositório.
- **Saída:** `DocsConfig`.
- **Efeitos:** Lê um arquivo.
- **Erros:** JSON malformado ou inválido (`mergeDocsConfig()`) lança `Error`.

## `tools/docs/inventory.ts`

### `listGitFiles`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `listGitFiles(rootDir: string): string[] | null`
- **Usada por:** `listVersionedDirs()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lista arquivos versionados e não ignorados via `git ls-files --cached --others --exclude-standard`.
- **Entrada:** `rootDir`: raiz.
- **Saída:** Lista de caminhos relativos, ou `null` se o git falhar/não existir.
- **Efeitos:** Executa o git como subprocesso.
- **Erros:** Nenhum (falhas viram `null`).

### `walkFiles`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `walkFiles(rootDir: string, relativeDir = ''): string[]`
- **Usada por:** `listUiComponents()`, `listVersionedDirs()`, `readTestFilesText()`, `walkFiles()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Percorre o disco recursivamente listando arquivos, pulando `WALK_IGNORED_DIRS`.
- **Entrada:** `rootDir`: raiz; `relativeDir`: subpasta (interno, padrão vazio).
- **Saída:** Lista de caminhos relativos a `rootDir`.
- **Efeitos:** Lê diretórios do disco.
- **Erros:** Erros de leitura propagam.

### `dirsFromFiles`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `dirsFromFiles(files: readonly string[]): string[]`
- **Usada por:** `listVersionedDirs()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Deriva de uma lista de arquivos todas as pastas, inclusive as intermediárias, com barra final e ordenadas.
- **Entrada:** `files`: caminhos relativos.
- **Saída:** Lista de pastas como `a/`, `a/b/`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `listVersionedDirs`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `listVersionedDirs(rootDir: string): string[]`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lista as pastas versionadas do repositório, pelo git ou, sem git, pelo disco.
- **Entrada:** `rootDir`: raiz.
- **Saída:** Lista de pastas com barra final.
- **Efeitos:** Git ou leitura de disco.
- **Erros:** Erros de leitura propagam.

### `readTestFilesText`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `readTestFilesText(rootDir: string, config: DocsConfig): string`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Concatena o conteúdo de todos os arquivos de teste das pastas de código (pelo sufixo configurado).
- **Entrada:** `rootDir`: raiz; `config`: configuração.
- **Saída:** Texto único com todos os testes.
- **Efeitos:** Lê arquivos do disco.
- **Erros:** Erros de leitura propagam.

### `listUiComponents`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `listUiComponents(rootDir: string, config: DocsConfig): string[]`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lista nomes de componentes de UI: arquivos `.tsx` da pasta `uiDir`, sem os de teste, ordenados.
- **Entrada:** `rootDir`: raiz; `config`: configuração.
- **Saída:** Lista de nomes (vazia se `uiDir` for `null` ou não existir).
- **Efeitos:** Lê diretórios do disco.
- **Erros:** Nenhum.

### `loadTestExceptions`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `async loadTestExceptions(rootDir: string, config: DocsConfig): Promise<TestExceptionEntry[]>`
- **Usada por:** `buildInventory()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Importa dinamicamente o arquivo de exceções de teste e devolve `TEST_EXCEPTIONS`.
- **Entrada:** `rootDir`: raiz; `config`: configuração.
- **Saída:** Promise com a lista de exceções (vazia se o arquivo não existir).
- **Efeitos:** Importa um módulo em tempo de execução.
- **Erros:** `Error` se `TEST_EXCEPTIONS` não for uma lista.

### `buildInventory`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/inventory.ts`
- **Assinatura:** `async buildInventory(rootDir: string, config: DocsConfig): Promise<Inventory>`
- **Usada por:** `runCheck()`, `runGenerate()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Monta o inventário completo: funções, constantes, referências, grafo de chamadas, pastas versionadas, texto dos testes, componentes de UI e exceções.
- **Entrada:** `rootDir`: raiz; `config`: configuração.
- **Saída:** Promise com `Inventory`.
- **Efeitos:** Lê disco, executa git, importa módulo.
- **Erros:** Propaga erros das etapas.

## `tools/docs/markdown.ts`

### `firstGroup`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `firstGroup(match: RegExpMatchArray): string`
- **Usada por:** `checkManualFields()`, `extractBacktickedNames()`, `extractCalledNames()`, `extractDocumentedDirs()`, `extractFunctionSections()`, `extractProcessCitations()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Devolve o primeiro grupo de captura de um match de regex, ou string vazia.
- **Entrada:** `match`: resultado de `exec`/`matchAll`.
- **Saída:** Texto do grupo 1.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `stripCodeBlocks`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `stripCodeBlocks(markdown: string): string`
- **Usada por:** `extractBacktickedNames()`, `extractCalledNames()`, `extractDocumentedDirs()`, `extractFunctionSections()`, `extractProcessCitations()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Remove blocos de código cercados por ``` ou ~~~ para que exemplos não contem como citações.
- **Entrada:** `markdown`: texto.
- **Saída:** Texto sem os blocos.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `extractCalledNames`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `extractCalledNames(text: string): Set<string>`
- **Usada por:** `extractProcessCitations()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Extrai nomes citados como `` `nome()` `` fora de blocos de código.
- **Entrada:** `text`: markdown.
- **Saída:** `Set` de nomes.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `sliceBetween`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `sliceBetween(text: string, start: string, end: string): string | null`
- **Usada por:** `buildSection()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Extrai o texto entre dois marcadores, sem espaços nas pontas.
- **Entrada:** `text`; `start` e `end`: marcadores.
- **Saída:** Miolo, ou `null` se algum marcador faltar.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `replaceBetween`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `replaceBetween(text: string, markers: readonly [string, string], content: string): string`
- **Usada por:** `applyGenerated()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Substitui o conteúdo entre dois marcadores, mantendo-os; sem marcadores devolve o texto intacto.
- **Entrada:** `text`; `markers`: par início/fim; `content`: novo miolo.
- **Saída:** Texto atualizado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `extractFunctionSections`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `extractFunctionSections(markdown: string): FunctionSection[]`
- **Usada por:** `applyGenerated()`, `pruneOrphanSections()`, `runAllChecks()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Divide o markdown em seções `### \`nome\``, registrando o heading `## ...` acima de cada uma, o bloco gerado e o texto manual; ignora blocos de código.
- **Entrada:** `markdown`: texto do FUNCTIONS.md.
- **Saída:** Lista de `FunctionSection`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `buildSection`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `buildSection(name: string, moduleHeading: string | null, raw: string): FunctionSection`
- **Usada por:** `extractFunctionSections()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Monta uma `FunctionSection` a partir do texto bruto de uma seção, separando bloco gerado e texto manual.
- **Entrada:** `name`; `moduleHeading` (ou `null`); `raw`: texto da seção.
- **Saída:** `FunctionSection`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `extractProcessCitations`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `extractProcessCitations(markdown: string): ProcessCitations`
- **Usada por:** `generateFunctionsDoc()`, `runCheck()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lê PROCESSES.md: para cada heading `## Pnn ...`, as funções citadas como `` `nome()` ``.
- **Entrada:** `markdown`: texto do PROCESSES.md.
- **Saída:** `ProcessCitations` (id → nomes).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `extractDocumentedDirs`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `extractDocumentedDirs(markdown: string): Set<string>`
- **Usada por:** `checkStructure()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lê as pastas documentadas em STRUCTURE.md: trechos em crase terminados em `/`.
- **Entrada:** `markdown`: texto do STRUCTURE.md.
- **Saída:** `Set` de pastas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `extractBacktickedNames`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/markdown.ts`
- **Assinatura:** `extractBacktickedNames(markdown: string): Set<string>`
- **Usada por:** `checkConstants()`, `checkUiComponents()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lê identificadores simples em crase (`` `Nome` ``) fora de blocos de código.
- **Entrada:** `markdown`: texto.
- **Saída:** `Set` de nomes.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `tools/docs/render.ts`

### `formatList`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `formatList(items: readonly string[]): string`
- **Usada por:** `renderGeneratedBlock()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Formata uma lista para markdown: itens em crase separados por vírgula, ou `—` se vazia.
- **Entrada:** `items`: textos.
- **Saída:** Texto formatado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `renderGeneratedBlock`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `renderGeneratedBlock(info: FunctionInfo, data: GeneratedData): string`
- **Usada por:** `applyGenerated()`, `checkGeneratedBlocks()`, `renderNewSection()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Renderiza as quatro linhas do bloco gerado (Arquivo, Assinatura, Usada por, Processos).
- **Entrada:** `info`: função; `data`: usada-por e processos calculados.
- **Saída:** Texto do bloco, sem os marcadores.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `renderNewSection`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `renderNewSection(info: FunctionInfo, data: GeneratedData): string`
- **Usada por:** `applyGenerated()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Renderiza uma seção nova completa: heading, bloco gerado com marcadores e campos manuais com o marcador `PLACEHOLDER`.
- **Entrada:** `info`: função; `data`: dados gerados.
- **Saída:** Texto da seção.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `renderModuleIndex`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `renderModuleIndex(functions: readonly FunctionInfo[]): string`
- **Usada por:** `applyGenerated()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Renderiza o índice por módulo: uma linha por arquivo com links para suas funções.
- **Entrada:** `functions`: registro.
- **Saída:** Texto do índice.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `computeGeneratedData`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `computeGeneratedData(name: string, references: ReferenceIndex, processesByFunction: ReadonlyMap<string, ReadonlySet<string>>): GeneratedData`
- **Usada por:** `checkGeneratedBlocks()`, `generateFunctionsDoc()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Calcula "Usada por" e "Processos" de uma função, ordenados, a partir do índice de referências e do mapa função → processos.
- **Entrada:** `name`; `references`; `processesByFunction`.
- **Saída:** `GeneratedData`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `closureOf`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `closureOf(graph: CallGraph, roots: ReadonlySet<string>): Set<string>`
- **Usada por:** `processesByFunction()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Fecho transitivo em um grafo: as raízes mais tudo o que elas chamam, direta ou indiretamente.
- **Entrada:** `graph`: grafo de chamadas; `roots`: nomes iniciais.
- **Saída:** `Set` com todos os alcançados (inclui raízes).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `processesByFunction`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `processesByFunction(citations: ProcessCitations, graph: CallGraph): Map<string, Set<string>>`
- **Usada por:** `checkGeneratedBlocks()`, `generateFunctionsDoc()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Inverte as citações: para cada processo, expande o fecho das funções citadas e registra o processo em cada uma.
- **Entrada:** `citations`: processo → citadas; `graph`: grafo de chamadas.
- **Saída:** `Map` função → ids de processo.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `replaceSectionBlock`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `replaceSectionBlock(markdown: string, name: string, block: string): string`
- **Usada por:** `applyGenerated()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Substitui o bloco gerado da seção de uma função específica.
- **Entrada:** `markdown`; `name`; `block`: novo conteúdo.
- **Saída:** Texto atualizado (intacto se a seção não existir).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `appendSection`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `appendSection(markdown: string, info: FunctionInfo, section: string): string`
- **Usada por:** `applyGenerated()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Acrescenta uma seção nova sob o heading `## arquivo` da função, antes do próximo heading; cria o heading antes da tabela de dados se faltar.
- **Entrada:** `markdown`; `info`: função; `section`: texto da seção.
- **Saída:** Texto atualizado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `insertBeforeDataTable`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `insertBeforeDataTable(markdown: string, text: string): string`
- **Usada por:** `appendSection()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Insere texto antes de `## Dados e constantes`, ou no fim se a tabela não existir.
- **Entrada:** `markdown`; `text`.
- **Saída:** Texto atualizado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `applyGenerated`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `applyGenerated(markdown: string, functions: readonly FunctionInfo[], dataOf: (name: string) => GeneratedData): string`
- **Usada por:** `generateFunctionsDoc()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Aplica o gerador ao FUNCTIONS.md: atualiza o índice, substitui blocos gerados existentes e acrescenta seções para funções novas.
- **Entrada:** `markdown`: texto atual; `functions`: registro; `dataOf`: função que calcula os dados gerados por nome.
- **Saída:** Novo texto do FUNCTIONS.md.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `removeSection`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `removeSection(markdown: string, name: string): string`
- **Usada por:** `pruneOrphanSections()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Remove a seção da função (heading `###` com o nome) inteira, do heading até o próximo heading `##`/`###` ou o fim do texto.
- **Entrada:** `markdown`: texto do FUNCTIONS.md; `name`: nome da função.
- **Saída:** Markdown sem a seção (intacto se ela não existir).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `removeEmptyModules`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `removeEmptyModules(markdown: string): string`
- **Usada por:** `pruneOrphanSections()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Remove headings de módulo (`##` com o caminho do arquivo) sem nenhuma seção abaixo e normaliza para uma única quebra de linha final.
- **Entrada:** `markdown`: texto do FUNCTIONS.md.
- **Saída:** Markdown sem módulos vazios.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pruneOrphanSections`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/render.ts`
- **Assinatura:** `pruneOrphanSections(markdown: string, functions: readonly FunctionInfo[]): string`
- **Usada por:** `applyGenerated()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Remove as seções de funções que não existem mais no código e, se removeu alguma, os módulos que ficaram vazios.
- **Entrada:** `markdown`: texto do FUNCTIONS.md; `functions`: funções do inventário.
- **Saída:** Markdown podado (o mesmo texto se não houver órfãs).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `tools/docs/run.ts`

### `readOptional`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/run.ts`
- **Assinatura:** `readOptional(rootDir: string, relativePath: string): string | null`
- **Usada por:** `readDocsTexts()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lê um arquivo de texto relativo à raiz, ou `null` se não existir.
- **Entrada:** `rootDir`; `relativePath`.
- **Saída:** Conteúdo ou `null`.
- **Efeitos:** Lê um arquivo.
- **Erros:** Erros de leitura (fora de "não existe") propagam.

### `readDocsTexts`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/run.ts`
- **Assinatura:** `readDocsTexts(rootDir: string, config: DocsConfig): DocsTexts`
- **Usada por:** `runCheck()`, `runGenerate()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Lê FUNCTIONS, PROCESSES, STRUCTURE (vazios se ausentes) e UI (`null` se ausente).
- **Entrada:** `rootDir`; `config`.
- **Saída:** `DocsTexts`.
- **Efeitos:** Lê arquivos.
- **Erros:** Erros de leitura propagam.

### `formatIssues`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/run.ts`
- **Assinatura:** `formatIssues(issues: readonly Issue[]): string`
- **Usada por:** `runDocsCli()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Formata os problemas para o terminal: `✔` sem problemas, ou lista numerada `[CODIGO] mensagem`.
- **Entrada:** `issues`: lista de `Issue`.
- **Saída:** Texto pronto para imprimir.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `runCheck`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/run.ts`
- **Assinatura:** `async runCheck(rootDir: string): Promise<Issue[]>`
- **Usada por:** `runDocsCli()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Executa a checagem completa: carrega configuração, inventário e documentos e roda `runAllChecks()`.
- **Entrada:** `rootDir`: raiz.
- **Saída:** Promise com a lista de `Issue`.
- **Efeitos:** Lê disco, executa git, importa módulo.
- **Erros:** Propaga erros de configuração.

### `generateFunctionsDoc`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/run.ts`
- **Assinatura:** `generateFunctionsDoc(inventory: Inventory, docs: DocsTexts): string`
- **Usada por:** `runGenerate()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Calcula o novo texto do FUNCTIONS.md a partir do inventário e dos documentos atuais.
- **Entrada:** `inventory`; `docs`: textos.
- **Saída:** Novo texto do FUNCTIONS.md.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `runGenerate`

<!-- gerado:inicio -->

- **Arquivo:** `tools/docs/run.ts`
- **Assinatura:** `async runGenerate(rootDir: string): Promise<boolean>`
- **Usada por:** `runDocsCli()`
- **Processos:** P01, P02, P06

<!-- gerado:fim -->

- **Faz:** Regrava o FUNCTIONS.md com índice, blocos gerados e seções novas, só se houver mudança.
- **Entrada:** `rootDir`: raiz.
- **Saída:** Promise com `true` se o arquivo mudou.
- **Efeitos:** Lê e grava `docs/FUNCTIONS.md`.
- **Erros:** Propaga erros de configuração e de escrita.

## `connectors/canvas-puc/src/auth.ts`

### `pickAuth`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/auth.ts`
- **Assinatura:** `pickAuth(session: CanvasSession | null, token: string | null): CanvasAuth | null`
- **Usada por:** `createAuthProvider()`, `renewAuth()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Escolhe a credencial atual: sessão se houver, senão token, senão nenhuma.
- **Entrada:** `session`: sessão salva ou `null`; `token`: token de acesso ou `null`.
- **Saída:** `CanvasAuth` do tipo `session` ou `token`; `null` se não houver nenhuma credencial.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `authHeaders`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/auth.ts`
- **Assinatura:** `authHeaders(auth: CanvasAuth, method: string): Record<string, string>`
- **Usada por:** `sendCanvasRequest()`
- **Processos:** P03, P04, P08, P09

<!-- gerado:fim -->

- **Faz:** Monta os headers de autenticação de uma requisição ao Canvas.
- **Entrada:** `auth`: credencial (sessão ou token); `method`: método HTTP (`GET`, `POST`...).
- **Saída:** `Authorization: Bearer` para token; `Cookie` (mais `X-CSRF-Token` fora de GET, se houver) para sessão.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `loginAndStore`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/auth.ts`
- **Assinatura:** `async loginAndStore(deps: AuthDeps, state: AuthState, mode: LoginMode): Promise<CanvasSession>`
- **Usada por:** `createAuthProvider()`, `renewAuth()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Faz login no navegador no modo pedido, guardando a sessão em disco e no estado.
- **Entrada:** `deps`: dependências (arquivo da sessão, função de login); `state`: estado mutável; `mode`: `silent` ou `window`.
- **Saída:** Promise com a `CanvasSession` obtida.
- **Efeitos:** Abre navegador (via `deps.login`), grava o arquivo da sessão, altera `state.session`.
- **Erros:** Propaga a rejeição de `deps.login` e erros de escrita do arquivo.

### `renewAuth`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/auth.ts`
- **Assinatura:** `async renewAuth(deps: AuthDeps, state: AuthState): Promise<CanvasAuth | null>`
- **Usada por:** `renewOnce()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Renova a credencial: login silencioso, depois token, depois janela de login.
- **Entrada:** `deps`: dependências do provedor; `state`: estado mutável.
- **Saída:** Promise com a nova `CanvasAuth`; `null` se nenhum caminho funcionar.
- **Efeitos:** Abre navegador (oculto e, se preciso, com janela), grava a sessão em disco, altera `state.session`.
- **Erros:** Nenhum (falhas de login viram `null`).

### `renewOnce`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/auth.ts`
- **Assinatura:** `renewOnce(deps: AuthDeps, state: AuthState): Promise<CanvasAuth | null>`
- **Usada por:** `createAuthProvider()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Garante uma só renovação por vez, compartilhando a promessa entre chamadas simultâneas.
- **Entrada:** `deps`: dependências do provedor; `state`: estado mutável (usa `state.pending`).
- **Saída:** A promessa de `renewAuth()` em andamento (nova ou já existente).
- **Efeitos:** Altera `state.pending` (definido no início, limpo ao terminar); efeitos de `renewAuth()`.
- **Erros:** Nenhum.

### `createAuthProvider`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/auth.ts`
- **Assinatura:** `createAuthProvider(deps: AuthDeps): AuthProvider`
- **Usada por:** `startCanvasServer()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Cria o provedor de autenticação a partir da sessão salva em disco.
- **Entrada:** `deps`: token opcional, caminho do arquivo da sessão e função de login no navegador.
- **Saída:** `AuthProvider` com `current`, `renew`, `connect` e `disconnect`.
- **Efeitos:** Lê o arquivo da sessão; os métodos devolvidos abrem navegador, gravam ou apagam a sessão.
- **Erros:** Nenhum.

## `connectors/canvas-puc/src/browser-login.ts`

### `isLoginChooserUrl`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/browser-login.ts`
- **Assinatura:** `isLoginChooserUrl(url: string): boolean`
- **Usada por:** `clickInstitutionButton()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Decide se a URL é a tela de escolha de login do Canvas.
- **Entrada:** `url`: endereço atual de uma aba.
- **Saída:** `true` para `login.instructure.com/discovery` ou caminhos `/login`; senão `false`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `launchLoginBrowser`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/browser-login.ts`
- **Assinatura:** `async launchLoginBrowser(dataDir: string, headless: boolean): Promise<BrowserContext>`
- **Usada por:** `browserLogin()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Abre o perfil do conector no primeiro navegador disponível (Chrome, depois Edge).
- **Entrada:** `dataDir`: pasta de dados (perfil em `browser-profile`); `headless`: `true` para navegador oculto.
- **Saída:** Promise com o `BrowserContext` persistente aberto.
- **Efeitos:** Abre um processo de navegador; cria/usa a pasta do perfil em disco.
- **Erros:** Rejeita com "Não consegui abrir o Chrome nem o Edge" se nenhum canal abrir.

### `pageHasCanvasSession`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/browser-login.ts`
- **Assinatura:** `async pageHasCanvasSession(page: Page, baseUrl: string): Promise<boolean>`
- **Usada por:** `waitForCanvasLogin()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Confere se uma aba no domínio do Canvas já tem sessão válida na API.
- **Entrada:** `page`: aba do navegador; `baseUrl`: URL base do Canvas.
- **Saída:** Promise com `true` se `/api/v1/users/self` responde ok; `false` fora do domínio ou em erro.
- **Efeitos:** Rede: faz `fetch` de dentro da aba.
- **Erros:** Nenhum (erros viram `false`).

### `clickInstitutionButton`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/browser-login.ts`
- **Assinatura:** `async clickInstitutionButton(pages: readonly Page[], text: string): Promise<void>`
- **Usada por:** `waitForCanvasLogin()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Clica no botão da instituição nas abas que estão na tela de escolha de login.
- **Entrada:** `pages`: abas abertas; `text`: trecho do texto do botão.
- **Saída:** Promise vazia.
- **Efeitos:** Navegador: clica no botão visível de cada aba elegível.
- **Erros:** Nenhum (falhas de clique são ignoradas).

### `waitForCanvasLogin`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/browser-login.ts`
- **Assinatura:** `async waitForCanvasLogin(context: BrowserContext, opts: BrowserLoginOptions, mode: LoginMode): Promise<void>`
- **Usada por:** `browserLogin()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Espera até alguma aba ter sessão no Canvas, clicando no botão da instituição pelo caminho.
- **Entrada:** `context`: navegador aberto; `opts`: URL base e texto do botão; `mode`: define o tempo máximo (`LOGIN_TIMEOUT_MS`).
- **Saída:** Promise vazia, resolvida quando há sessão.
- **Efeitos:** Navegador: consulta e clica nas abas; espera 1,5 s entre tentativas.
- **Erros:** Rejeita se todas as abas forem fechadas ou se o prazo acabar sem login.

### `browserLogin`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/browser-login.ts`
- **Assinatura:** `async browserLogin(opts: BrowserLoginOptions, mode: LoginMode): Promise<CanvasSession>`
- **Usada por:** `startCanvasServer()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Faz o login no navegador e devolve a sessão com os cookies do domínio do Canvas.
- **Entrada:** `opts`: URL base, pasta de dados e texto do botão; `mode`: `silent` (oculto) ou `window`.
- **Saída:** Promise com `CanvasSession` (URL base, data e cookies `name`/`value`).
- **Efeitos:** Abre e fecha o navegador; rede (navegação ao Canvas e login).
- **Erros:** Propaga as rejeições de `launchLoginBrowser()` e `waitForCanvasLogin()`.

## `connectors/canvas-puc/src/client.ts`

### `unauthorizedMessage`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/client.ts`
- **Assinatura:** `unauthorizedMessage(auth: CanvasAuth | null, baseUrl: string): string`
- **Usada por:** `unauthorizedError()`
- **Processos:** P03, P04, P08, P09

<!-- gerado:fim -->

- **Faz:** Escolhe a mensagem de erro para 401 ou ausência de credencial.
- **Entrada:** `auth`: credencial usada ou `null`; `baseUrl`: URL base do Canvas (para o link de gerar token).
- **Saída:** Texto pedindo `conectar_canvas`, adaptado a sem credencial, sessão expirada ou token inválido.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `sendCanvasRequest`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/client.ts`
- **Assinatura:** `sendCanvasRequest(deps: ClientDeps, req: CanvasRequest, auth: CanvasAuth): Promise<Response>`
- **Usada por:** `requestWithRenewal()`
- **Processos:** P03, P04, P08, P09

<!-- gerado:fim -->

- **Faz:** Envia uma requisição à API do Canvas com a credencial dada, sem tratar o status.
- **Entrada:** `deps`: URL base e `fetchFn`; `req`: método, caminho, parâmetros e corpo opcional; `auth`: credencial.
- **Saída:** Promise com a `Response` crua.
- **Efeitos:** Rede (via `deps.fetchFn`).
- **Erros:** Propaga a rejeição de `fetchFn`.

### `requestWithRenewal`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/client.ts`
- **Assinatura:** `async requestWithRenewal(deps: ClientDeps, req: CanvasRequest): Promise<Response>`
- **Usada por:** `collectPages()`, `createCanvasClient()`
- **Processos:** P03, P04, P08, P09

<!-- gerado:fim -->

- **Faz:** Envia a requisição e, em 401 ou sem credencial, renova uma vez e repete.
- **Entrada:** `deps`: dependências do cliente; `req`: requisição.
- **Saída:** Promise com a `Response` de status ok.
- **Efeitos:** Rede; pode renovar a autenticação (navegador, disco).
- **Erros:** Rejeita com `unauthorizedMessage()` se continuar 401/sem credencial; com `Canvas <status> em ...` para outro status não ok.

### `collectPages`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/client.ts`
- **Assinatura:** `async collectPages(deps: ClientDeps, first: CanvasRequest, max: number): Promise<T[]>`
- **Usada por:** `createCanvasClient()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Busca todas as páginas de uma listagem seguindo o header `Link`, até `max` itens.
- **Entrada:** `deps`: dependências do cliente; `first`: primeira requisição; `max`: limite de itens.
- **Saída:** Promise com até `max` itens (resposta não-lista vira um item); lista vazia se não houver.
- **Efeitos:** Rede (uma requisição por página).
- **Erros:** Propaga erros de `requestWithRenewal()` e de JSON inválido.

### `fetchPlainText`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/client.ts`
- **Assinatura:** `async fetchPlainText(fetchFn: typeof fetch, url: string): Promise<string>`
- **Usada por:** `createCanvasClient()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Baixa um arquivo de texto por URL direta.
- **Entrada:** `fetchFn`: função `fetch`; `url`: link de download (já autorizado pelo Canvas).
- **Saída:** Promise com o conteúdo do arquivo.
- **Efeitos:** Rede.
- **Erros:** Rejeita com "Falha ao baixar o arquivo (<status>)" se a resposta não for ok.

### `createCanvasClient`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/client.ts`
- **Assinatura:** `createCanvasClient(deps: ClientDeps): CanvasClient`
- **Usada por:** `canvasRemoteConnector()`, `startCanvasServer()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Cria o cliente do Canvas usado pelas ferramentas.
- **Entrada:** `deps`: URL base, provedor de autenticação e `fetchFn`.
- **Saída:** `CanvasClient` com `get`, `getAll` (página de `CANVAS_PAGE_SIZE`, limite `DEFAULT_MAX_ITEMS`), `post` e `fetchText`.
- **Efeitos:** Nenhum na criação; os métodos fazem rede.
- **Erros:** Nenhum na criação; os métodos propagam erros das requisições.

### `unauthorizedError`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/client.ts`
- **Assinatura:** `unauthorizedError(deps: ClientDeps, auth: CanvasAuth | null): Error`
- **Usada por:** `requestWithRenewal()`
- **Processos:** P03, P04, P08, P09

<!-- gerado:fim -->

- **Faz:** Cria o erro de 401 com a mensagem injetada (`describeUnauthorized`) ou a padrão.
- **Entrada:** `deps`: dependências do cliente; `auth`: credencial usada (ou nula).
- **Saída:** `Error` com a orientação ao usuário.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `fetchDownload`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/client.ts`
- **Assinatura:** `async fetchDownload(fetchFn: typeof fetch, url: string): Promise<Response>`
- **Usada por:** `fetchFileBytes()`, `fetchPlainText()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Baixa um link direto do Canvas e confere o status.
- **Entrada:** `fetchFn`: função `fetch`; `url`: link de download (já autorizado pelo Canvas).
- **Saída:** Promise com a `Response` ok.
- **Efeitos:** Rede.
- **Erros:** Rejeita com "Falha ao baixar o arquivo (<status>)" se a resposta não for ok.

### `fetchFileBytes`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/client.ts`
- **Assinatura:** `async fetchFileBytes(fetchFn: typeof fetch, url: string): Promise<Uint8Array>`
- **Usada por:** `createCanvasClient()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Baixa um arquivo binário por URL direta.
- **Entrada:** `fetchFn`; `url`.
- **Saída:** Promise com os bytes.
- **Efeitos:** Rede.
- **Erros:** Repassa o erro de `fetchDownload`.

## `connectors/canvas-puc/src/config.ts`

### `readCanvasConfig`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/config.ts`
- **Assinatura:** `readCanvasConfig(env: EnvVars, homeDir: string): CanvasConfig`
- **Usada por:** `startCanvasServer()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Monta a configuração do conector a partir do ambiente.
- **Entrada:** `env`: variáveis de ambiente (`CANVAS_*`); `homeDir`: pasta do usuário (base da pasta de dados padrão).
- **Saída:** `CanvasConfig` com URL base sem `/` final, token, `allowWrite`, texto do botão e pasta de dados (padrões quando ausentes).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/canvas-puc/src/format.ts`

### `shortText`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `shortText(html: string | null | undefined): string`
- **Usada por:** `toAnnouncement()`, `toCalendarEvent()`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Converte HTML em texto cortado em `MAX_TEXT_LENGTH` caracteres.
- **Entrada:** `html`: HTML, `null` ou `undefined`.
- **Saída:** Texto de até `MAX_TEXT_LENGTH` caracteres; `''` para entrada vazia.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toProfile`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toProfile(p: CanvasProfile): View`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Converte o perfil do Canvas em visualização enxuta.
- **Entrada:** `p`: perfil do usuário da API.
- **Saída:** `View` com `id`, `nome`, `email`, `login` e `fuso`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toCourse`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toCourse(c: CanvasCourse): View`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Converte um curso em visualização com a nota atual da matrícula do aluno.
- **Entrada:** `c`: curso da API (com `enrollments` e `term` opcionais).
- **Saída:** `View` com id, nome, código, período, `nota_atual` e `conceito_atual` (`null` sem matrícula).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toSubmissionFlags`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toSubmissionFlags(flags: CanvasSubmissionFlags | false | undefined): View | null`
- **Usada por:** `toPlannerItem()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Converte o status de entrega de um item da agenda.
- **Entrada:** `flags`: status da API, `false` ou `undefined`.
- **Saída:** `View` com `entregue`, `atrasado`, `faltando` e `corrigido`; `null` se o item não tem entrega.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toPlannerItem`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toPlannerItem(i: CanvasPlannerItem, baseUrl: string): View`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Converte um item da agenda do aluno em visualização com link absoluto.
- **Entrada:** `i`: item do planner; `baseUrl`: URL base do Canvas.
- **Saída:** `View` com tipo, título, curso, data, pontos, entrega e `url` (`undefined` sem `html_url`).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toAssignmentSummary`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toAssignmentSummary(a: CanvasAssignment): View`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Converte uma tarefa de listagem em visualização com status e nota da entrega.
- **Entrada:** `a`: tarefa da API (com `submission` opcional).
- **Saída:** `View` com id, nome, prazo, pontos, tipos de entrega, status, nota, atraso e falta (`null` sem entrega).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toRubricCriterion`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toRubricCriterion(r: CanvasRubricCriterion): View`
- **Usada por:** `toAssignmentDetail()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Converte um critério de rubrica com seus níveis como `pontos: descrição`.
- **Entrada:** `r`: critério da API.
- **Saída:** `View` com `criterio`, `pontos` e `niveis` (lista vazia sem níveis).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toFileInfo`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toFileInfo(f: CanvasAttachment): View`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`, `toSubmissionDetail()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Converte um anexo em visualização com tamanho em KB.
- **Entrada:** `f`: anexo/arquivo da API.
- **Saída:** `View` com id, nome, tipo, `tamanho_kb` (0 sem tamanho), data e link de download.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toSubmissionDetail`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toSubmissionDetail(s: CanvasSubmission): View`
- **Usada por:** `toAssignmentDetail()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Converte uma entrega do aluno com nota, comentários, rubrica e anexos.
- **Entrada:** `s`: entrega da API.
- **Saída:** `View` com status, data, nota, conceito, atraso, `comentarios`, `avaliacao_rubrica` (`null` se ausente) e `anexos`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toAssignmentDetail`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toAssignmentDetail(a: CanvasAssignment, submission: CanvasSubmission | null): View`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Converte uma tarefa completa com enunciado em texto, datas, rubrica e entrega.
- **Entrada:** `a`: tarefa da API; `submission`: entrega do aluno ou `null`.
- **Saída:** `View` com datas, pontos, enunciado, rubrica e `entrega` (`null` sem entrega).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toGradeRow`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toGradeRow(s: CanvasSubmission): View`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Converte uma entrega (com `assignment` incluído) em linha de nota.
- **Entrada:** `s`: entrega de `students/submissions` com `include[]=assignment`.
- **Saída:** `View` com tarefa, id, nota, `de` (pontos possíveis), conceito, status e prazo.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toEnrollmentGrade`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toEnrollmentGrade(e: CanvasEnrollment, courseNames: ReadonlyMap<string, string>): View`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Converte o resumo de notas de uma matrícula, com o nome do curso.
- **Entrada:** `e`: matrícula da API; `courseNames`: mapa id → nome do curso.
- **Saída:** `View` com `course_id`, `curso` (`undefined` se fora do mapa), nota e conceito atuais e nota final.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toAnnouncement`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toAnnouncement(a: CanvasAnnouncement): View`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Converte um aviso do curso com o texto convertido e cortado.
- **Entrada:** `a`: aviso da API.
- **Saída:** `View` com id, título, curso, autor, data, `texto` (via `shortText()`) e url.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toModuleItem`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toModuleItem(i: CanvasModuleItem): View`
- **Usada por:** `toModule()`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Converte um item de módulo em visualização.
- **Entrada:** `i`: item de módulo da API.
- **Saída:** `View` com id, tipo, título, `content_id`, `page_url`, url externa e `concluido` (`null` sem requisito).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toModule`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toModule(m: CanvasModule): View`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Converte um módulo com seus itens.
- **Entrada:** `m`: módulo da API.
- **Saída:** `View` com id, nome e `itens` (lista vazia sem itens).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toDiscussionSummary`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toDiscussionSummary(d: CanvasDiscussionTopic): View`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Converte um fórum de discussão de listagem em visualização.
- **Entrada:** `d`: tópico de discussão da API.
- **Saída:** `View` com id, título, prazo (`null` sem tarefa), respostas, não lidas, última resposta e url.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `flattenDiscussion`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `flattenDiscussion(entries: readonly CanvasDiscussionEntry[] | undefined, names: ReadonlyMap<string, string>, depth = 0): { nivel: number; autor: string | undefined; data: string | undefined; texto: string }[]`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`, `flattenDiscussion()`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Achata a árvore de postagens de um fórum, marcando o nível de cada resposta.
- **Entrada:** `entries`: postagens (ou `undefined`); `names`: mapa id → nome do autor; `depth`: nível inicial (padrão 0).
- **Saída:** Lista em pré-ordem de `{ nivel, autor, data, texto }`; vazia sem postagens.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toCalendarEvent`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/format.ts`
- **Assinatura:** `toCalendarEvent(e: CanvasCalendarEvent): View`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Converte um evento do calendário com descrição em texto curto.
- **Entrada:** `e`: evento da API.
- **Saída:** `View` com título, início, fim, local, curso e `descricao` de até 1000 caracteres.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/canvas-puc/src/helpers.ts`

### `isoDaysFrom`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/helpers.ts`
- **Assinatura:** `isoDaysFrom(now: Date, days: number): string`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Calcula a data/hora ISO `days` dias depois de `now`.
- **Entrada:** `now`: data de referência; `days`: número de dias (negativo vai para trás).
- **Saída:** Texto ISO 8601 em UTC.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `dateOnly`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/helpers.ts`
- **Assinatura:** `dateOnly(iso: string): string`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Extrai a parte `AAAA-MM-DD` de uma data ISO.
- **Entrada:** `iso`: data ISO.
- **Saída:** Os 10 primeiros caracteres.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `courseContextCodes`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/helpers.ts`
- **Assinatura:** `courseContextCodes(ids: readonly Id[]): string[]`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Monta os códigos de contexto `course_<id>` usados por avisos e calendário.
- **Entrada:** `ids`: ids de curso.
- **Saída:** Lista de códigos na mesma ordem; vazia para lista vazia.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `courseNameMap`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/helpers.ts`
- **Assinatura:** `courseNameMap(courses: readonly CanvasCourse[]): Map<string, string>`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Monta o mapa id → nome dos cursos.
- **Entrada:** `courses`: cursos da API.
- **Saída:** `Map` com id em texto e nome (`''` sem nome).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `participantNames`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/helpers.ts`
- **Assinatura:** `participantNames(view: CanvasDiscussionView): Map<string, string>`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Monta o mapa id → nome dos participantes de um fórum.
- **Entrada:** `view`: visão completa da discussão.
- **Saída:** `Map` com id em texto e nome (`''` sem nome); vazio sem participantes.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `isTextFile`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/helpers.ts`
- **Assinatura:** `isTextFile(contentType: string, name: string): boolean`
- **Usada por:** `readCanvasFileText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Decide se um arquivo pode ser lido como texto, pelo tipo MIME ou pela extensão.
- **Entrada:** `contentType`: tipo MIME; `name`: nome do arquivo.
- **Saída:** `true` para MIME `text/`, json, xml, javascript, csv ou extensões de texto/código; senão `false`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `matchModuleItems`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/helpers.ts`
- **Assinatura:** `matchModuleItems(modules: readonly CanvasModule[], term: string): ModuleMatch[]`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Encontra os itens de módulo cujo título contém o termo, sem diferenciar maiúsculas.
- **Entrada:** `modules`: módulos com itens; `term`: termo buscado.
- **Saída:** Lista de `ModuleMatch` (`modulo`, `titulo`, `tipo`); vazia sem resultados.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `activeCourses`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/helpers.ts`
- **Assinatura:** `activeCourses(client: CanvasClient): Promise<CanvasCourse[]>`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Busca os cursos ativos do aluno.
- **Entrada:** `client`: cliente do Canvas.
- **Saída:** Promise com a lista de cursos (`enrollment_state=active`).
- **Efeitos:** Rede.
- **Erros:** Propaga erros do cliente.

### `fetchOwnSubmission`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/helpers.ts`
- **Assinatura:** `async fetchOwnSubmission(client: CanvasClient, courseId: Id, assignmentId: Id): Promise<CanvasSubmission | null>`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Busca a entrega do próprio aluno numa tarefa, com comentários e rubrica.
- **Entrada:** `client`: cliente do Canvas; `courseId`: id do curso; `assignmentId`: id da tarefa.
- **Saída:** Promise com a `CanvasSubmission`; `null` se a busca falhar (sem acesso).
- **Efeitos:** Rede.
- **Erros:** Nenhum (falhas viram `null`).

### `getAllOrEmpty`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/helpers.ts`
- **Assinatura:** `getAllOrEmpty(client: CanvasClient, path: string, params: Record<string, string | readonly string[]>): Promise<T[]>`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Busca uma listagem paginada, trocando falha por lista vazia.
- **Entrada:** `client`: cliente do Canvas; `path`: caminho da API; `params`: parâmetros de query.
- **Saída:** Promise com os itens; lista vazia se a busca falhar.
- **Efeitos:** Rede.
- **Erros:** Nenhum (falhas viram `[]`).

## `connectors/canvas-puc/src/main.ts`

### `startCanvasServer`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/main.ts`
- **Assinatura:** `async startCanvasServer(): Promise<void>`
- **Usada por:** `connectors/canvas-puc/src/main.ts (módulo)`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Sobe o servidor MCP do Canvas em stdio.
- **Entrada:** Nenhuma (lê `process.env` e a pasta do usuário).
- **Saída:** Promise vazia, resolvida quando o transporte conecta.
- **Efeitos:** Lê ambiente e sessão em disco; registra ferramentas; abre o transporte stdio.
- **Erros:** Propaga erros de conexão do servidor MCP.

## `connectors/canvas-puc/src/session.ts`

### `sessionFilePath`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/session.ts`
- **Assinatura:** `sessionFilePath(dataDir: string): string`
- **Usada por:** `startCanvasServer()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Calcula o caminho do arquivo da sessão dentro da pasta de dados.
- **Entrada:** `dataDir`: pasta de dados do conector.
- **Saída:** `<dataDir>/session.json`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `cookieHeader`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/session.ts`
- **Assinatura:** `cookieHeader(session: CanvasSession): string`
- **Usada por:** `authHeaders()`
- **Processos:** P03, P04, P08, P09

<!-- gerado:fim -->

- **Faz:** Monta o valor do header `Cookie` com todos os cookies da sessão.
- **Entrada:** `session`: sessão salva.
- **Saída:** Texto `nome=valor; ...`; `''` sem cookies.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `csrfToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/session.ts`
- **Assinatura:** `csrfToken(session: CanvasSession): string | null`
- **Usada por:** `authHeaders()`
- **Processos:** P03, P04, P08, P09

<!-- gerado:fim -->

- **Faz:** Extrai o token CSRF (cookie `_csrf_token`, decodificado) da sessão.
- **Entrada:** `session`: sessão salva.
- **Saída:** Token decodificado; `null` se o cookie não existe.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `isCanvasSession`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/session.ts`
- **Assinatura:** `isCanvasSession(value: unknown): value is CanvasSession`
- **Usada por:** `loadSession()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Confere se um valor lido do disco tem a forma de uma sessão válida.
- **Entrada:** `value`: qualquer valor (JSON já interpretado).
- **Saída:** `true` se tem `baseUrl` texto e `cookies` lista de `{ name, value }` texto; senão `false`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `loadSession`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/session.ts`
- **Assinatura:** `loadSession(file: string): CanvasSession | null`
- **Usada por:** `createAuthProvider()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Lê a sessão salva em disco.
- **Entrada:** `file`: caminho do arquivo da sessão.
- **Saída:** `CanvasSession`; `null` se o arquivo não existe, está corrompido ou tem forma inválida.
- **Efeitos:** Lê um arquivo.
- **Erros:** Nenhum (falhas viram `null`).

### `saveSession`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/session.ts`
- **Assinatura:** `saveSession(file: string, session: CanvasSession): void`
- **Usada por:** `loginAndStore()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Grava a sessão em disco, criando a pasta se preciso.
- **Entrada:** `file`: caminho do arquivo; `session`: sessão a salvar.
- **Saída:** Nada.
- **Efeitos:** Cria pasta e grava o arquivo JSON.
- **Erros:** Propaga erros de escrita.

### `clearSession`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/session.ts`
- **Assinatura:** `clearSession(file: string): void`
- **Usada por:** `createAuthProvider()`
- **Processos:** P03, P04

<!-- gerado:fim -->

- **Faz:** Apaga o arquivo da sessão salva, se existir.
- **Entrada:** `file`: caminho do arquivo da sessão.
- **Saída:** Nada.
- **Efeitos:** Apaga o arquivo em disco.
- **Erros:** Propaga erros de remoção.

## `connectors/canvas-puc/src/tools-write.ts`

### `submissionPayload`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/tools-write.ts`
- **Assinatura:** `submissionPayload(kind: 'texto' | 'url', content: string): { submission: Readonly<Record<string, string>> }`
- **Usada por:** `connectors/canvas-puc/src/tools-write.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Monta o corpo de entrega para o tipo escolhido.
- **Entrada:** `kind`: `texto` (HTML aceito) ou `url`; `content`: texto ou link.
- **Saída:** `{ submission }` com `online_text_entry` e `body`, ou `online_url` e `url`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/canvas-puc/src/tools.ts`

### `canvasTools`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/tools.ts`
- **Assinatura:** `canvasTools(allowWrite: boolean): readonly ToolSpec<CanvasContext>[]`
- **Usada por:** `startCanvasServer()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Seleciona as ferramentas do Canvas a registrar.
- **Entrada:** `allowWrite`: se as ferramentas de escrita entram.
- **Saída:** Lista com conexão e leitura, mais `CANVAS_WRITE_TOOLS` quando `allowWrite` é `true`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `canvasServiceTools`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/tools.ts`
- **Assinatura:** `canvasServiceTools(allowWrite: boolean): readonly ToolSpec<CanvasContext>[]`
- **Usada por:** `canvasRemoteConnector()`, `canvasTools()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Lista as ferramentas do serviço (leitura, e escrita se permitida), sem as de conexão.
- **Entrada:** `allowWrite`: libera `entregar_tarefa_texto` e `responder_discussao`.
- **Saída:** Lista de `ToolSpec`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `createCanvasMcpServer`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/tools.ts`
- **Assinatura:** `createCanvasMcpServer(specs: readonly ToolSpec<CanvasContext>[], ctx: CanvasContext): McpServer`
- **Usada por:** `canvasRemoteConnector()`, `startCanvasServer()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Cria o `McpServer` do Canvas com as ferramentas ligadas ao contexto.
- **Entrada:** `specs`: ferramentas; `ctx`: cliente, autenticação e relógio.
- **Saída:** Servidor MCP ainda não conectado.
- **Efeitos:** Nenhum além de criar o objeto.
- **Erros:** Nenhum.

## `src/core/env.ts`

### `toEnvVars`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/env.ts`
- **Assinatura:** `toEnvVars(env: Readonly<Record<string, unknown>>): EnvVars`
- **Usada por:** `connectors/whatsapp/src/container.ts (módulo)`, `handleWhatsAppFetch()`, `handleWorkerFetch()`, `runScheduledSync()`
- **Processos:** P08, P10, P14

<!-- gerado:fim -->

- **Faz:** Converte o ambiente do Worker em variáveis de texto.
- **Entrada:** `env`: variáveis, secrets e bindings do Worker.
- **Saída:** Só as entradas cujo valor é texto.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `envValue`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/env.ts`
- **Assinatura:** `envValue(env: EnvVars, key: string): string | null`
- **Usada por:** `containerEnvVars()`, `readAllowedEmails()`, `readCanvasConfig()`, `readCanvasRemoteSettings()`, `readIntInRange()`, `readOAuthSettings()`, `readPublicUrl()`, `readRemoteServerConfig()`, `readSendAllowlist()`, `readSendSettings()`, `readSleepAfter()`, `readWhatsAppSettings()`, `requireEnv()`, `resolveIssuer()`
- **Processos:** P03, P08, P10, P14

<!-- gerado:fim -->

- **Faz:** Lê uma variável de ambiente, tratando vazio ou placeholder `${...}` como ausente.
- **Entrada:** `env`: variáveis de ambiente; `key`: nome da variável.
- **Saída:** Valor sem espaços nas pontas; `null` se ausente, vazio ou começando com `${`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `parseFlag`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/env.ts`
- **Assinatura:** `parseFlag(value: string | null): boolean`
- **Usada por:** `readCanvasConfig()`, `readCanvasRemoteSettings()`, `readSendSettings()`
- **Processos:** P03, P08, P10, P14

<!-- gerado:fim -->

- **Faz:** Interpreta uma opção liga/desliga.
- **Entrada:** `value`: texto da opção ou `null`.
- **Saída:** `true` para `1`, `true`, `sim` ou `yes` (sem diferenciar maiúsculas); senão `false`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `src/core/html.ts`

### `htmlToText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/html.ts`
- **Assinatura:** `htmlToText(html: string | null | undefined): string`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`, `docxXmlToText()`, `flattenDiscussion()`, `readCanvasFileText()`, `shortText()`, `toAssignmentDetail()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Converte HTML em texto simples, preservando parágrafos e listas como quebras de linha.
- **Entrada:** `html`: HTML, `null` ou `undefined`.
- **Saída:** Texto sem tags, com entidades decodificadas e sem espaços nas pontas; `''` para entrada vazia.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `src/core/http.ts`

### `buildUrl`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/http.ts`
- **Assinatura:** `buildUrl(base: string, path: string, params: QueryParams = {}): URL`
- **Usada por:** `sendCanvasRequest()`
- **Processos:** P03, P04, P08, P09

<!-- gerado:fim -->

- **Faz:** Monta a URL de uma requisição a partir de base, caminho e parâmetros.
- **Entrada:** `base`: URL base; `path`: caminho relativo ou URL absoluta (`http...`); `params`: query (padrão `{}`).
- **Saída:** `URL` com parâmetros; listas viram `chave[]=...`; `null`/`undefined` são omitidos.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `TypeError` se a URL resultante for inválida.

### `parseNextLink`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/http.ts`
- **Assinatura:** `parseNextLink(linkHeader: string | null): string | null`
- **Usada por:** `collectPages()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Extrai a URL `rel="next"` de um header `Link` de paginação.
- **Entrada:** `linkHeader`: valor do header ou `null`.
- **Saída:** URL da próxima página; `null` se não houver header ou `next`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `src/mcp/tools.ts`

### `defineTool`

<!-- gerado:inicio -->

- **Arquivo:** `src/mcp/tools.ts`
- **Assinatura:** `defineTool(def: ToolDefinition<C, S>): ToolSpec<C>`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`, `connectors/canvas-puc/src/tools-write.ts (módulo)`, `connectors/canvas-puc/src/tools.ts (módulo)`, `connectors/whatsapp/src/tools.ts (módulo)`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Cria uma `ToolSpec` que valida os argumentos com o `shape` antes de chamar `run`.
- **Entrada:** `def`: nome, descrição, `shape` zod e `run` tipado.
- **Saída:** `ToolSpec` com `run` que aceita argumentos crus (`undefined` vira `{}`).
- **Efeitos:** Nenhum na criação.
- **Erros:** O `run` devolvido rejeita com `ZodError` para argumentos inválidos e propaga erros de `def.run`.

### `textResult`

<!-- gerado:inicio -->

- **Arquivo:** `src/mcp/tools.ts`
- **Assinatura:** `textResult(data: unknown, notes: readonly string[] = []): CallToolResult`
- **Usada por:** `toToolResult()`
- **Processos:** P03, P08, P09, P10, P11

<!-- gerado:fim -->

- **Faz:** Converte o retorno de uma ferramenta em resultado MCP de texto.
- **Entrada:** `data`: texto ou valor serializável; `notes`: textos extras (padrão vazio).
- **Saída:** `CallToolResult` com um bloco de texto (JSON indentado se não for string) mais um por nota.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança se `data` não for serializável em JSON (ex.: referência circular).

### `errorResult`

<!-- gerado:inicio -->

- **Arquivo:** `src/mcp/tools.ts`
- **Assinatura:** `errorResult(error: unknown): CallToolResult`
- **Usada por:** `runToolSafely()`
- **Processos:** P03, P08, P09, P10, P11

<!-- gerado:fim -->

- **Faz:** Converte um erro em resultado MCP com `isError`.
- **Entrada:** `error`: qualquer valor lançado.
- **Saída:** `CallToolResult` com `isError: true` e a mensagem do erro (ou `String(error)`).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `runToolSafely`

<!-- gerado:inicio -->

- **Arquivo:** `src/mcp/tools.ts`
- **Assinatura:** `async runToolSafely(spec: ToolSpec<C>, ctx: C, rawArgs: unknown): Promise<CallToolResult>`
- **Usada por:** `registerToolSpecs()`
- **Processos:** P03, P08, P09, P10, P11

<!-- gerado:fim -->

- **Faz:** Executa uma ferramenta convertendo sucesso ou falha em resultado MCP.
- **Entrada:** `spec`: ferramenta; `ctx`: contexto do conector; `rawArgs`: argumentos crus.
- **Saída:** Promise com `textResult()` no sucesso ou `errorResult()` na falha.
- **Efeitos:** Os efeitos da própria ferramenta.
- **Erros:** Nenhum (erros viram `errorResult`).

### `registerToolSpecs`

<!-- gerado:inicio -->

- **Arquivo:** `src/mcp/tools.ts`
- **Assinatura:** `registerToolSpecs(server: McpServer, specs: readonly ToolSpec<C>[], ctx: C): void`
- **Usada por:** `createCanvasMcpServer()`, `createWhatsAppMcpServer()`
- **Processos:** P03, P08, P09, P10, P11

<!-- gerado:fim -->

- **Faz:** Registra cada `ToolSpec` no servidor MCP com o contexto do conector.
- **Entrada:** `server`: servidor MCP; `specs`: ferramentas; `ctx`: contexto passado a cada execução.
- **Saída:** Nada.
- **Efeitos:** Altera o servidor (registra as ferramentas).
- **Erros:** Propaga erros do SDK (ex.: nome repetido).

### `rawToolResult`

<!-- gerado:inicio -->

- **Arquivo:** `src/mcp/tools.ts`
- **Assinatura:** `rawToolResult(result: CallToolResult): RawToolResult`
- **Usada por:** `downloadedFileResult()`, `mediaResult()`
- **Processos:** P03, P11

<!-- gerado:fim -->

- **Faz:** Embrulha um resultado MCP pronto (imagem, recurso embutido) para a ferramenta devolver sem conversão para texto.
- **Entrada:** `result`: `CallToolResult`.
- **Saída:** `RawToolResult`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toToolResult`

<!-- gerado:inicio -->

- **Arquivo:** `src/mcp/tools.ts`
- **Assinatura:** `toToolResult(data: unknown): CallToolResult`
- **Usada por:** `runToolSafely()`
- **Processos:** P03, P08, P09, P10, P11

<!-- gerado:fim -->

- **Faz:** Converte o retorno de uma ferramenta em resultado MCP: o embrulhado por `rawToolResult` passa direto, o resto vira `textResult`.
- **Entrada:** `data`: retorno da ferramenta.
- **Saída:** `CallToolResult`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `binaryContentBlock`

<!-- gerado:inicio -->

- **Arquivo:** `src/mcp/tools.ts`
- **Assinatura:** `binaryContentBlock(mimeType: string, bytes: Uint8Array, uri: string): CallToolResult['content'][number]`
- **Usada por:** `fileContentBlock()`, `mediaResult()`
- **Processos:** P03, P11

<!-- gerado:fim -->

- **Faz:** Bloco MCP com um conteúdo binário: imagem, áudio ou, para o resto, recurso embutido com o `uri` dado.
- **Entrada:** `mimeType`, `bytes` do arquivo e `uri` do recurso.
- **Saída:** Bloco `image`, `audio` ou `resource` com os bytes em base64.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `tools/pack/cli.ts`

### `installedExternalVersions`

<!-- gerado:inicio -->

- **Arquivo:** `tools/pack/cli.ts`
- **Assinatura:** `installedExternalVersions(root: string): Record<string, string>`
- **Usada por:** `buildConnectorRuntime()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Lê as versões instaladas das dependências externas em `node_modules`.
- **Entrada:** `root`: raiz do repositório.
- **Saída:** Mapa dependência → versão para cada item de `RUNTIME_EXTERNALS`.
- **Efeitos:** Lê `package.json` em `node_modules`.
- **Erros:** Propaga erro se a dependência não estiver instalada ou o JSON for inválido.

### `runNodeBin`

<!-- gerado:inicio -->

- **Arquivo:** `tools/pack/cli.ts`
- **Assinatura:** `runNodeBin(bin: 'npm' | 'npx', args: readonly string[], cwd: string): void`
- **Usada por:** `buildConnectorRuntime()`, `packMcpb()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Roda `npm` ou `npx` de forma portátil entre Windows e Unix.
- **Entrada:** `bin`: `npm` ou `npx`; `args`: argumentos; `cwd`: pasta de trabalho.
- **Saída:** Nada.
- **Efeitos:** Executa processo filho com saída herdada (stdout/stderr).
- **Erros:** Lança se o comando sair com código diferente de zero.

### `runPackCli`

<!-- gerado:inicio -->

- **Arquivo:** `tools/pack/cli.ts`
- **Assinatura:** `async runPackCli(argv: readonly string[]): Promise<void>`
- **Usada por:** `tools/pack/cli.ts (módulo)`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Empacota o conector pedido, ou todos com `--all`.
- **Entrada:** `argv`: argumentos da linha de comando (nomes de conector ou `--all`).
- **Saída:** Promise vazia.
- **Efeitos:** Gera pacotes em disco; imprime o caminho de cada um no stdout.
- **Erros:** Rejeita com a mensagem de uso se nenhum conector for informado; propaga erros de `packConnector()`.

### `buildConnectorRuntime`

<!-- gerado:inicio -->

- **Arquivo:** `tools/pack/cli.ts`
- **Assinatura:** `async buildConnectorRuntime(root: string, name: string): Promise<void>`
- **Usada por:** `runPackCli()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Gera na pasta do conector o runtime usado pelo plugin: bundle `server/index.js`, `package.json` e `package-lock.json`.
- **Entrada:** `root`: raiz do repositório; `name`: nome da pasta do conector em `connectors/`.
- **Saída:** Promise vazia quando termina.
- **Efeitos:** Escreve arquivos na pasta do conector; roda o esbuild e `npm install --package-lock-only` (rede).
- **Erros:** Rejeita se o manifesto não tiver nome/versão, se o esbuild falhar ou se o npm sair com erro.

### `packMcpb`

<!-- gerado:inicio -->

- **Arquivo:** `tools/pack/cli.ts`
- **Assinatura:** `packMcpb(root: string, name: string): string`
- **Usada por:** `runPackCli()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Monta o staging com `RUNTIME_FILES` do conector, instala as externas e gera o `.mcpb`.
- **Entrada:** `root`: raiz do repositório; `name`: nome da pasta do conector.
- **Saída:** Caminho do `.mcpb` gerado em `dist/connectors/<nome>-<versão>.mcpb`.
- **Efeitos:** Apaga e recria `dist/stage/<nome>`; roda `npm ci` (rede) e `mcpb pack`; escreve em `dist/connectors/`.
- **Erros:** Lança se faltar um arquivo de runtime (rode `buildConnectorRuntime` antes) ou se npm/mcpb falharem.

### `writeJson`

<!-- gerado:inicio -->

- **Arquivo:** `tools/pack/cli.ts`
- **Assinatura:** `writeJson(file: string, data: unknown): void`
- **Usada por:** `buildConnectorRuntime()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Grava um valor como JSON indentado com quebra de linha final.
- **Entrada:** `file`: caminho do arquivo; `data`: valor serializável.
- **Saída:** Nada.
- **Efeitos:** Escreve o arquivo no disco (sobrescreve).
- **Erros:** Lança se o disco recusar a escrita.

## `tools/pack/pack.ts`

### `listConnectors`

<!-- gerado:inicio -->

- **Arquivo:** `tools/pack/pack.ts`
- **Assinatura:** `listConnectors(rootDir: string): string[]`
- **Usada por:** `runPackCli()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Lista os conectores com `manifest.json` em `connectors/`.
- **Entrada:** `rootDir`: raiz do repositório.
- **Saída:** Nomes das subpastas em ordem alfabética; vazia se `connectors/` não existe.
- **Efeitos:** Lê o disco.
- **Erros:** Propaga erros de leitura da pasta.

### `readManifestIdentity`

<!-- gerado:inicio -->

- **Arquivo:** `tools/pack/pack.ts`
- **Assinatura:** `readManifestIdentity(manifestPath: string): { name: string; version: string }`
- **Usada por:** `buildConnectorRuntime()`, `packMcpb()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Lê `name` e `version` do manifesto de um conector.
- **Entrada:** `manifestPath`: caminho do `manifest.json`.
- **Saída:** `{ name, version }`.
- **Efeitos:** Lê um arquivo.
- **Erros:** Lança se faltar `name` ou `version` (texto); propaga erros de leitura e JSON inválido.

### `runtimePackageJson`

<!-- gerado:inicio -->

- **Arquivo:** `tools/pack/pack.ts`
- **Assinatura:** `runtimePackageJson(identity: { name: string; version: string }, installedVersions: Readonly<Record<string, string>>): RuntimePackageJson`
- **Usada por:** `buildConnectorRuntime()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Monta o `package.json` do pacote com as versões exatas das dependências externas.
- **Entrada:** `identity`: nome e versão do conector; `installedVersions`: mapa dependência → versão instalada.
- **Saída:** `RuntimePackageJson` privado, ESM, com `dependencies` de `RUNTIME_EXTERNALS`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança se alguma dependência externa não estiver em `installedVersions`.

### `bundleOptions`

<!-- gerado:inicio -->

- **Arquivo:** `tools/pack/pack.ts`
- **Assinatura:** `bundleOptions(entry: string, outfile: string): BuildOptions`
- **Usada por:** `buildConnectorRuntime()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Monta as opções do esbuild para unir o conector num ESM para Node 18+.
- **Entrada:** `entry`: arquivo de entrada; `outfile`: arquivo de saída.
- **Saída:** `BuildOptions` com bundle, `node18`, externos de `RUNTIME_EXTERNALS` e banner que define `require`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pluginManifest`

<!-- gerado:inicio -->

- **Arquivo:** `tools/pack/pack.ts`
- **Assinatura:** `pluginManifest(manifest: McpbManifest): Record<string, unknown>`
- **Usada por:** `buildConnectorRuntime()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Gera o `plugin.json` do plugin a partir do manifesto `.mcpb`, fonte única de nome, descrição e configuração.
- **Entrada:** `manifest`: manifesto `.mcpb` do conector.
- **Saída:** Objeto com `name`, `description`, `author`, `repository` (URL) e `userConfig` (= `user_config` do manifesto).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pluginMcpConfig`

<!-- gerado:inicio -->

- **Arquivo:** `tools/pack/pack.ts`
- **Assinatura:** `pluginMcpConfig(manifest: McpbManifest): Record<string, unknown>`
- **Usada por:** `buildConnectorRuntime()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Gera o `.mcp.json` do plugin com o comando do `.mcpb`, trocando `${__dirname}` por `${CLAUDE_PLUGIN_ROOT}`.
- **Entrada:** `manifest`: manifesto `.mcpb` do conector.
- **Saída:** `{ mcpServers: { <nome>: { command, args, env } } }`; `env` vazio se o manifesto não tiver.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/canvas-puc/src/playwright-runtime.ts`

### `runtimeDir`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/playwright-runtime.ts`
- **Assinatura:** `runtimeDir(dataDir: string): string`
- **Usada por:** `loadPlaywright()`
- **Processos:** P03, P04, P07

<!-- gerado:fim -->

- **Faz:** Devolve a pasta onde o playwright-core é instalado sob demanda.
- **Entrada:** `dataDir`: pasta de dados do conector (padrão `~/.canvas-puc`).
- **Saída:** `<dataDir>/runtime`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `npmInstallArgs`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/playwright-runtime.ts`
- **Assinatura:** `npmInstallArgs(version: string): string[]`
- **Usada por:** `installPlaywright()`
- **Processos:** P03, P04, P07

<!-- gerado:fim -->

- **Faz:** Monta os argumentos do `npm install` que instala uma versão fixa do playwright-core.
- **Entrada:** `version`: versão exata do playwright-core.
- **Saída:** Lista de argumentos para o npm (sem dependências de desenvolvimento, sem audit/fund, silencioso).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `resolveFrom`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/playwright-runtime.ts`
- **Assinatura:** `resolveFrom(dir: string, pkg: string): string | null`
- **Usada por:** `loadPlaywright()`
- **Processos:** P03, P04, P07

<!-- gerado:fim -->

- **Faz:** Resolve o arquivo de entrada de um pacote instalado numa pasta.
- **Entrada:** `dir`: pasta que contém (ou não) `node_modules`; `pkg`: nome do pacote.
- **Saída:** Caminho absoluto do arquivo de entrada; `null` se o pacote não estiver instalado ali.
- **Efeitos:** Lê o disco (resolução de módulos do Node).
- **Erros:** Nenhum (falhas viram `null`).

### `installPlaywright`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/playwright-runtime.ts`
- **Assinatura:** `installPlaywright(dir: string): void`
- **Usada por:** `loadPlaywright()`
- **Processos:** P03, P04, P07

<!-- gerado:fim -->

- **Faz:** Instala o playwright-core na pasta de runtime com o npm do sistema.
- **Entrada:** `dir`: pasta de runtime (criada se não existir).
- **Saída:** Nada.
- **Efeitos:** Cria a pasta e um `package.json` mínimo; roda `npm install` (rede, disco).
- **Erros:** Lança se o npm não estiver no PATH ou sair com erro.

### `loadPlaywright`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/playwright-runtime.ts`
- **Assinatura:** `async loadPlaywright(dataDir: string): Promise<PlaywrightModule>`
- **Usada por:** `launchLoginBrowser()`
- **Processos:** P03, P04, P07

<!-- gerado:fim -->

- **Faz:** Carrega o playwright-core do node_modules normal, da pasta de runtime ou instalando nela.
- **Entrada:** `dataDir`: pasta de dados do conector.
- **Saída:** Promise com o módulo do playwright-core.
- **Efeitos:** Importa módulos dinamicamente; na primeira vez sem o pacote, instala com `installPlaywright()` (rede).
- **Erros:** Rejeita com "Não consegui instalar o playwright-core" se a instalação não deixar o pacote resolvível.

## `connectors/canvas-puc/src/remote-main.ts`

### `startCanvasRemoteServer`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote-main.ts`
- **Assinatura:** `startCanvasRemoteServer(): void`
- **Usada por:** `connectors/canvas-puc/src/remote-main.ts (módulo)`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Sobe o servidor HTTP do conector Canvas remoto.
- **Entrada:** Nenhuma (lê o ambiente do processo).
- **Saída:** Nada.
- **Efeitos:** Abre a porta HTTP e escreve no stdout.
- **Erros:** Lança se `PUBLIC_URL` ou `SEAL_KEY` faltarem ou forem inválidas.

## `connectors/canvas-puc/src/remote.ts`

### `readCanvasRemoteSettings`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote.ts`
- **Assinatura:** `readCanvasRemoteSettings(env: EnvVars): CanvasRemoteSettings`
- **Usada por:** `createWorkerApp()`, `startCanvasRemoteServer()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Lê a configuração do modo remoto (`CANVAS_BASE_URL`, `CANVAS_ALLOW_WRITE`).
- **Entrada:** `env`: variáveis de ambiente.
- **Saída:** `CanvasRemoteSettings` com URL sem barra final, escrita desligada por padrão e o `fetch` global com o `User-Agent` do conector (`withCanvasUserAgent`).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `canvasLoginText`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote.ts`
- **Assinatura:** `canvasLoginText(baseUrl: string): LoginPageText`
- **Usada por:** `canvasRemoteConnector()`
- **Processos:** P08, P09

<!-- gerado:fim -->

- **Faz:** Monta os textos da página de autorização do Canvas.
- **Entrada:** `baseUrl`: endereço do Canvas.
- **Saída:** `LoginPageText` com a ajuda apontando para `/profile/settings`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `remoteUnauthorizedMessage`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote.ts`
- **Assinatura:** `remoteUnauthorizedMessage(_auth: CanvasAuth | null, baseUrl: string): string`
- **Usada por:** `canvasRemoteConnector()`
- **Processos:** P08, P09

<!-- gerado:fim -->

- **Faz:** Escreve a mensagem de 401 do modo remoto (gerar outro token e reconectar no Claude).
- **Entrada:** `_auth`: ignorada; `baseUrl`: endereço do Canvas.
- **Saída:** Texto da mensagem.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `createTokenAuthProvider`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote.ts`
- **Assinatura:** `createTokenAuthProvider(token: string): AuthProvider`
- **Usada por:** `canvasRemoteConnector()`
- **Processos:** P08, P09

<!-- gerado:fim -->

- **Faz:** Cria um `AuthProvider` que usa só o token, sem renovação nem login.
- **Entrada:** `token`: token de acesso do Canvas.
- **Saída:** Provedor: `current` dá o token, `renew` dá nulo, `disconnect` não faz nada.
- **Efeitos:** Nenhum (pura).
- **Erros:** `connect` rejeita orientando a reconectar pelas configurações do Claude.

### `verifyCanvasToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote.ts`
- **Assinatura:** `async verifyCanvasToken(settings: CanvasRemoteSettings, token: string): Promise<void>`
- **Usada por:** `canvasRemoteConnector()`
- **Processos:** P08, P09

<!-- gerado:fim -->

- **Faz:** Confere o token chamando `/api/v1/users/self` no Canvas.
- **Entrada:** `settings`: Canvas e `fetch`; `token`: token colado pelo usuário.
- **Saída:** Promessa vazia se o token serve.
- **Efeitos:** Rede (uma requisição ao Canvas).
- **Erros:** Rejeita com mensagem ao usuário: token vazio, 401, outro status ou falha de rede.

### `canvasRemoteConnector`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote.ts`
- **Assinatura:** `canvasRemoteConnector(settings: CanvasRemoteSettings): RemoteConnector`
- **Usada por:** `createWorkerApp()`, `startCanvasRemoteServer()`
- **Processos:** P08, P09

<!-- gerado:fim -->

- **Faz:** Monta o `RemoteConnector` do Canvas para o servidor HTTP.
- **Entrada:** `settings`: configuração do modo remoto.
- **Saída:** Textos da página, verificação do token, fábrica de `McpServer` por token e renovação da validade (`renewCanvasToken()`).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `withCanvasUserAgent`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote.ts`
- **Assinatura:** `withCanvasUserAgent(init: RequestInit | undefined): RequestInit`
- **Usada por:** `readCanvasRemoteSettings()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Soma o `User-Agent` do conector (`CANVAS_USER_AGENT`) às opções do `fetch`; sem ele o Canvas responde 403, e o `fetch` do Workers não manda um.
- **Entrada:** `init`: opções do `fetch` (ou `undefined`).
- **Saída:** Cópia das opções com os headers originais (nomes em minúsculas) mais `user-agent`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `matchesVisibleToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote.ts`
- **Assinatura:** `matchesVisibleToken(visible: string, token: string): boolean`
- **Usada por:** `planTokenRenewal()`
- **Processos:** P08, P09

<!-- gerado:fim -->

- **Faz:** Diz se o começo visível de um token do Canvas (`visible_token`, ex.: `11748~abcd...`) é o do token dado.
- **Entrada:** `visible` (campo da lista de tokens) e o token completo.
- **Saída:** `true` se o token começa pelo prefixo visível sem as reticências; `false` com prefixo vazio.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `planTokenRenewal`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote.ts`
- **Assinatura:** `planTokenRenewal(list: readonly CanvasTokenInfo[], token: string, now: Date): { readonly id: number; readonly expiresAt: string } | null`
- **Usada por:** `renewCanvasToken()`
- **Processos:** P08, P09

<!-- gerado:fim -->

- **Faz:** Decide se o token do Canvas precisa ter a validade estendida e para quando (agora + `TOKEN_RENEWAL_SECONDS`).
- **Entrada:** Lista de `user_generated_tokens`, o token e o instante atual.
- **Saída:** `{ id, expiresAt }`, ou nulo se o token não está na lista, não tem validade ou já vence a menos de um dia do limite.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `canvasTokenApi`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote.ts`
- **Assinatura:** `async canvasTokenApi(settings: CanvasRemoteSettings, token: string, request: CanvasTokenRequest): Promise<unknown>`
- **Usada por:** `renewCanvasToken()`
- **Processos:** P08, P09

<!-- gerado:fim -->

- **Faz:** Chama a API do Canvas com o token do usuário (`Bearer`), enviando corpo JSON se houver.
- **Entrada:** Configuração remota, token e `CanvasTokenRequest` (`path`, `method` opcional, `body` opcional).
- **Saída:** O JSON da resposta.
- **Efeitos:** Requisição HTTP ao Canvas.
- **Erros:** Rejeita com o status se a resposta não for 2xx; repassa falha de rede.

### `renewCanvasToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote.ts`
- **Assinatura:** `async renewCanvasToken(settings: CanvasRemoteSettings, token: string, now: Date): Promise<void>`
- **Usada por:** `canvasRemoteConnector()`
- **Processos:** P08, P09

<!-- gerado:fim -->

- **Faz:** Estende a validade do próprio token no Canvas (Access Tokens API) quando ele está perto de vencer; o Canvas da PUC aceita no máximo 30 dias à frente.
- **Entrada:** Configuração remota, token e instante atual.
- **Saída:** Nada.
- **Efeitos:** `GET /api/v1/users/self/user_generated_tokens` e, se `planTokenRenewal()` mandar, `PUT /api/v1/users/self/tokens/:id` com `expires_at`.
- **Erros:** Rejeita como `canvasTokenApi()` (quem chama, `renewSecretQuietly()`, só registra o aviso).

## `src/remote/handler.ts`

### `jsonResponse`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `jsonResponse(data: unknown, status = 200): Response`
- **Usada por:** `handleMcp()`, `handleRegister()`, `handleToken()`, `src/remote/handler.ts (módulo)`
- **Processos:** P08, P09, P11

<!-- gerado:fim -->

- **Faz:** Monta uma resposta JSON sem cache.
- **Entrada:** `data`: valor; `status`: padrão 200.
- **Saída:** `Response`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `htmlResponse`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `htmlResponse(html: string, status = 200, formTarget: string | null = null): Response`
- **Usada por:** `handleAuthorizePage()`, `handleAuthorizeSubmit()`, `handlePairCallback()`, `handlePairPost()`, `handleUpstreamCallback()`, `loginPageFor()`, `pairPage()`, `routePairRequest()`
- **Processos:** P08, P10, P12

<!-- gerado:fim -->

- **Faz:** Monta uma resposta HTML sem cache, com CSP restrita.
- **Entrada:** `html`: página; `status`: padrão 200; `formTarget`: origem do retorno liberada no `form-action` (padrão `null`).
- **Saída:** `Response`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readForm`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `async readForm(request: Request): Promise<URLSearchParams>`
- **Usada por:** `handleAuthorizeSubmit()`, `handlePairPost()`, `handleToken()`
- **Processos:** P08, P10, P12

<!-- gerado:fim -->

- **Faz:** Lê o corpo de um formulário urlencoded.
- **Entrada:** `request`.
- **Saída:** `URLSearchParams`.
- **Efeitos:** Consome o corpo da requisição.
- **Erros:** Nenhum.

### `readJsonBody`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `async readJsonBody(request: Request): Promise<unknown>`
- **Usada por:** `handleRegister()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Lê o corpo JSON da requisição.
- **Entrada:** `request`.
- **Saída:** Valor lido; `null` se não for JSON válido.
- **Efeitos:** Consome o corpo da requisição.
- **Erros:** Nenhum (JSON inválido vira `null`).

### `loginPageFor`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `loginPageFor(app: RemoteApp, request: AuthorizeRequest, error: string | null): Response`
- **Usada por:** `handleAuthorizePage()`, `handleAuthorizeSubmit()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Monta a página de login de um pedido validado.
- **Entrada:** `app`; `request`: pedido; `error`: mensagem ou nulo.
- **Saída:** `Response` HTML com o pedido selado.
- **Efeitos:** Gera bytes aleatórios (selo).
- **Erros:** Nenhum.

### `redirectWithCode`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `redirectWithCode(request: AuthorizeRequest, code: string): Response`
- **Usada por:** `handleAuthorizeSubmit()`, `handleUpstreamCallback()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Redireciona ao cliente com o código e o `state`.
- **Entrada:** `request`: pedido; `code`: código selado.
- **Saída:** `Response` 302.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `handleRegister`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `async handleRegister(app: RemoteApp, request: Request): Promise<Response>`
- **Usada por:** `src/remote/handler.ts (módulo)`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Atende `POST /register` (registro dinâmico).
- **Entrada:** `app`; `request`.
- **Saída:** 201 com o cliente, ou 400 com erro OAuth.
- **Efeitos:** Consome o corpo.
- **Erros:** Nenhum.

### `handleAuthorizePage`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `handleAuthorizePage(app: RemoteApp, request: Request): Promise<Response>`
- **Usada por:** `src/remote/handler.ts (módulo)`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Atende `GET /authorize`: valida e mostra a página de login.
- **Entrada:** `app`; `request`.
- **Saída:** Página HTML, ou 400 sem redirecionar quando o pedido é inválido.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `handleAuthorizeSubmit`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `async handleAuthorizeSubmit(app: RemoteApp, request: Request): Promise<Response>`
- **Usada por:** `src/remote/handler.ts (módulo)`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Atende `POST /authorize`: confere a credencial e devolve o código.
- **Entrada:** `app`; `request`: formulário com `pending` e `secret`.
- **Saída:** 302 para o cliente; página com erro se a credencial falhar; 400 se o pedido venceu.
- **Efeitos:** Rede (via `verifySecret` do conector).
- **Erros:** Nenhum.

### `handleToken`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `async handleToken(app: RemoteApp, request: Request): Promise<Response>`
- **Usada por:** `src/remote/handler.ts (módulo)`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Atende `POST /token`; no refresh, chama `renewSecretQuietly()` antes de responder.
- **Entrada:** `app`; `request`: formulário OAuth.
- **Saída:** 200 com tokens, ou 400 com erro OAuth.
- **Efeitos:** Consome o corpo; no refresh, a renovação da credencial do conector.
- **Erros:** Nenhum.

### `handleMcp`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `handleMcp(app: RemoteApp, request: Request): Promise<Response>`
- **Usada por:** `src/remote/handler.ts (módulo)`
- **Processos:** P09, P11

<!-- gerado:fim -->

- **Faz:** Atende `/mcp` exigindo o access token.
- **Entrada:** `app`; `request`.
- **Saída:** Resposta MCP, ou 401 que inicia o OAuth.
- **Efeitos:** Executa ferramentas do conector (rede).
- **Erros:** Repassa erros do transporte MCP.

### `withCors`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `withCors(response: Response): Response`
- **Usada por:** `routeRemoteRequest()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Acrescenta os headers CORS a uma resposta.
- **Entrada:** `response`.
- **Saída:** A mesma resposta, com `CORS_HEADERS`.
- **Efeitos:** Altera os headers da resposta recebida.
- **Erros:** Nenhum.

### `routeRemoteRequest`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `async routeRemoteRequest(app: RemoteApp, request: Request): Promise<Response>`
- **Usada por:** `createRemoteHandler()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Escolhe a rota pelo método e caminho.
- **Entrada:** `app`; `request`.
- **Saída:** Resposta da rota com CORS; 204 no preflight; 404 em caminho desconhecido.
- **Efeitos:** Os da rota escolhida.
- **Erros:** Repassa erros da rota.

### `createRemoteHandler`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `createRemoteHandler(app: RemoteApp): (request: Request) => Promise<Response>`
- **Usada por:** `handleWhatsAppFetch()`, `handleWorkerFetch()`, `startCanvasRemoteServer()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Cria o handler HTTP do conector remoto.
- **Entrada:** `app`: configuração OAuth, conector e relógio.
- **Saída:** Função `(Request) => Promise<Response>`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pageSecurityPolicy`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `pageSecurityPolicy(formTarget: string | null): string`
- **Usada por:** `htmlResponse()`
- **Processos:** P08, P10, P12

<!-- gerado:fim -->

- **Faz:** Monta a CSP das páginas HTML; o `form-action` inclui a origem do retorno do OAuth, porque o navegador aplica o `form-action` também ao 302 que segue o envio do formulário.
- **Entrada:** `formTarget`: origem liberada para o envio (ex. `https://claude.ai`) ou `null`.
- **Saída:** Texto do header `content-security-policy`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `renewSecretQuietly`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `async renewSecretQuietly(connector: RemoteConnector, secret: string): Promise<void>`
- **Usada por:** `handleToken()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Pede ao conector para renovar a credencial (`renewSecret`), sem deixar a falha derrubar o refresh.
- **Entrada:** Conector remoto e o segredo do usuário.
- **Saída:** Nada.
- **Efeitos:** O que o `renewSecret` do conector fizer; `console.warn` se ele falhar.
- **Erros:** Nenhum (a falha vira aviso no log).

### `redirectToUpstream`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `redirectToUpstream(app: RemoteApp, login: UpstreamLogin, request: AuthorizeRequest): Response`
- **Usada por:** `handleAuthorizePage()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Redireciona o navegador ao provedor de identidade com o pedido selado no `state`.
- **Entrada:** `app`, o login delegado (`UpstreamLogin`) e o pedido de autorização validado.
- **Saída:** Resposta 302 para a URL de login do provedor.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `handleUpstreamCallback`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/handler.ts`
- **Assinatura:** `async handleUpstreamCallback(app: RemoteApp, request: Request): Promise<Response>`
- **Usada por:** `src/remote/handler.ts (módulo)`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** `GET /oauth/callback`: conclui o login delegado e devolve o código ao cliente, ou explica a recusa.
- **Entrada:** `app` e a requisição de retorno do provedor (`state`, `code`).
- **Saída:** 302 com o código ao `redirect_uri`; HTML 404 (login não delegado), 400 (pedido expirado) ou 403 (login recusado).
- **Efeitos:** O que o `finish` do login fizer (ex.: `fetch` ao GitHub).
- **Erros:** Nenhum (a falha do `finish` vira página 403).

## `src/remote/login-page.ts`

### `escapeHtml`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/login-page.ts`
- **Assinatura:** `escapeHtml(value: string): string`
- **Usada por:** `alertHtml()`, `handlePairCallback()`, `handleUpstreamCallback()`, `pairForm()`, `pairingSection()`, `renderLoginPage()`, `renderPairPage()`
- **Processos:** P08, P10, P12

<!-- gerado:fim -->

- **Faz:** Escapa texto para HTML (conteúdo e atributos).
- **Entrada:** `value`: texto.
- **Saída:** Texto com `& < > " '` trocados por entidades.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `renderLoginPage`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/login-page.ts`
- **Assinatura:** `renderLoginPage(view: LoginPageView): string`
- **Usada por:** `loginPageFor()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Gera a página HTML de autorização.
- **Entrada:** `view`: textos, pedido selado, host do cliente e erro opcional.
- **Saída:** HTML completo, sem script.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `src/remote/mcp-endpoint.ts`

### `serveMcpRequest`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/mcp-endpoint.ts`
- **Assinatura:** `async serveMcpRequest(server: McpServer, request: Request): Promise<Response>`
- **Usada por:** `handleMcp()`
- **Processos:** P09, P11

<!-- gerado:fim -->

- **Faz:** Atende uma requisição MCP sem sessão, com resposta JSON.
- **Entrada:** `server`: `McpServer` do usuário; `request`: requisição HTTP.
- **Saída:** `Response` do transporte.
- **Efeitos:** Conecta e fecha o servidor MCP (executa a ferramenta chamada).
- **Erros:** Repassa erros do transporte.

### `mcpUnauthorizedResponse`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/mcp-endpoint.ts`
- **Assinatura:** `mcpUnauthorizedResponse(issuer: string): Response`
- **Usada por:** `handleMcp()`
- **Processos:** P08, P09, P11

<!-- gerado:fim -->

- **Faz:** Monta o 401 que inicia o OAuth no cliente MCP.
- **Entrada:** `issuer`: URL pública.
- **Saída:** `Response` 401 com `WWW-Authenticate` apontando os metadados do recurso.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `src/remote/node-server.ts`

### `readPublicUrl`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/node-server.ts`
- **Assinatura:** `readPublicUrl(env: EnvVars): string`
- **Usada por:** `readRemoteServerConfig()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Lê a URL pública do servidor (`PUBLIC_URL`).
- **Entrada:** `env`: variáveis de ambiente.
- **Saída:** URL sem barra final.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança se ausente, inválida ou sem https fora de localhost.

### `readRemoteServerConfig`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/node-server.ts`
- **Assinatura:** `readRemoteServerConfig(env: EnvVars): RemoteServerConfig`
- **Usada por:** `startCanvasRemoteServer()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Monta a configuração do servidor remoto a partir do ambiente.
- **Entrada:** `env`: variáveis de ambiente.
- **Saída:** `RemoteServerConfig` com porta (padrão 8080) e `OAuthSettings`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Os de `readPublicUrl` e `parseSealKey`.

### `readNodeBody`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/node-server.ts`
- **Assinatura:** `async readNodeBody(req: IncomingMessage): Promise<Buffer | null>`
- **Usada por:** `serveNodeRequest()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Lê o corpo de uma requisição do Node.
- **Entrada:** `req`: requisição.
- **Saída:** `Buffer`; `null` se passar de `MAX_BODY_BYTES`.
- **Efeitos:** Consome o stream da requisição.
- **Erros:** Nenhum.

### `toWebRequest`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/node-server.ts`
- **Assinatura:** `toWebRequest(req: IncomingMessage, body: Buffer, origin: string): Request`
- **Usada por:** `serveNodeRequest()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Converte a requisição do Node em `Request` com a origem pública.
- **Entrada:** `req`; `body`: corpo lido; `origin`: URL pública.
- **Saída:** `Request` (sem corpo em GET/HEAD).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `writeWebResponse`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/node-server.ts`
- **Assinatura:** `async writeWebResponse(res: ServerResponse, response: Response): Promise<void>`
- **Usada por:** `serveNodeRequest()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Escreve um `Response` na resposta do Node.
- **Entrada:** `res`: resposta do Node; `response`.
- **Saída:** Promessa vazia.
- **Efeitos:** Escreve status, headers e corpo no socket.
- **Erros:** Nenhum.

### `serveNodeRequest`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/node-server.ts`
- **Assinatura:** `async serveNodeRequest(options: NodeServerOptions, req: IncomingMessage, res: ServerResponse): Promise<void>`
- **Usada por:** `startRemoteHttpServer()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Atende uma requisição do Node com o handler.
- **Entrada:** `options`: handler e origem; `req`; `res`.
- **Saída:** Promessa vazia.
- **Efeitos:** Lê o corpo, escreve a resposta; registra erros no stderr.
- **Erros:** Nenhum: corpo grande vira 413 e erro do handler vira 500.

### `startRemoteHttpServer`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/node-server.ts`
- **Assinatura:** `startRemoteHttpServer(options: NodeServerOptions): Server`
- **Usada por:** `startCanvasRemoteServer()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Sobe o servidor `node:http` com o handler.
- **Entrada:** `options`: handler, origem pública e porta (0 = livre).
- **Saída:** O `Server` escutando.
- **Efeitos:** Abre uma porta TCP.
- **Erros:** Nenhum.

## `src/remote/oauth.ts`

### `oauthError`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/oauth.ts`
- **Assinatura:** `oauthError(error: string, description: string): OAuthResult<T>`
- **Usada por:** `parseAuthorizeQuery()`, `readCodeChallenge()`, `redeemAuthorizationCode()`, `redeemRefreshToken()`, `redeemTokenRequest()`, `registerClient()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Monta um resultado de erro OAuth.
- **Entrada:** `error`: código OAuth; `description`: explicação.
- **Saída:** `OAuthResult` com `ok: false`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `authorizationServerMetadata`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/oauth.ts`
- **Assinatura:** `authorizationServerMetadata(issuer: string): Record<string, unknown>`
- **Usada por:** `src/remote/handler.ts (módulo)`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Monta os metadados do servidor de autorização (RFC 8414).
- **Entrada:** `issuer`: URL pública.
- **Saída:** Objeto com endpoints, PKCE S256 e cliente público.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `protectedResourceMetadata`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/oauth.ts`
- **Assinatura:** `protectedResourceMetadata(issuer: string): Record<string, unknown>`
- **Usada por:** `src/remote/handler.ts (módulo)`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Monta os metadados do recurso protegido `/mcp` (RFC 9728).
- **Entrada:** `issuer`: URL pública.
- **Saída:** Objeto com `resource` e `authorization_servers`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `isAllowedRedirect`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/oauth.ts`
- **Assinatura:** `isAllowedRedirect(uri: string, hosts: readonly string[]): boolean`
- **Usada por:** `registerClient()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Diz se um endereço de retorno do OAuth é aceito.
- **Entrada:** `uri`: endereço; `hosts`: hosts permitidos.
- **Saída:** `true` para https num host listado (ou subdomínio) ou http em localhost/127.0.0.1 quando `localhost` está na lista.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pkceChallenge`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/oauth.ts`
- **Assinatura:** `pkceChallenge(verifier: string): string`
- **Usada por:** `redeemAuthorizationCode()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Calcula o desafio PKCE S256 de um verificador.
- **Entrada:** `verifier`: `code_verifier`.
- **Saída:** SHA-256 em base64url.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readRedirectUris`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/oauth.ts`
- **Assinatura:** `readRedirectUris(body: unknown): string[] | null`
- **Usada por:** `clientRedirectUris()`, `registerClient()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Extrai `redirect_uris` de um objeto.
- **Entrada:** `body`: corpo do registro ou conteúdo selado.
- **Saída:** Lista de textos; `null` se ausente, vazia ou com itens que não são texto.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `registerClient`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/oauth.ts`
- **Assinatura:** `registerClient(body: unknown, settings: OAuthSettings, now: number): OAuthResult<ClientRegistration>`
- **Usada por:** `handleRegister()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Registra um cliente OAuth selando os endereços de retorno no `client_id`.
- **Entrada:** `body`: corpo JSON do registro; `settings`; `now`: segundos Unix.
- **Saída:** `ClientRegistration`, ou erro `invalid_redirect_uri`.
- **Efeitos:** Gera bytes aleatórios (selo).
- **Erros:** Nenhum.

### `clientRedirectUris`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/oauth.ts`
- **Assinatura:** `clientRedirectUris(clientId: string, settings: OAuthSettings, now: number): string[] | null`
- **Usada por:** `parseAuthorizeQuery()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Lê os endereços de retorno de um `client_id` deste servidor.
- **Entrada:** `clientId`; `settings`; `now`.
- **Saída:** Lista de endereços; `null` se o cliente não é deste servidor ou venceu.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `parseAuthorizeQuery`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/oauth.ts`
- **Assinatura:** `parseAuthorizeQuery(query: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<AuthorizeRequest>`
- **Usada por:** `handleAuthorizePage()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Valida a query do `/authorize`.
- **Entrada:** `query`: parâmetros; `settings`; `now`.
- **Saída:** `AuthorizeRequest`, ou erro `invalid_client`, `invalid_request` ou `unsupported_response_type`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readCodeChallenge`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/oauth.ts`
- **Assinatura:** `readCodeChallenge(query: URLSearchParams): OAuthResult<string>`
- **Usada por:** `parseAuthorizeQuery()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Confere `response_type=code` e PKCE S256 da query.
- **Entrada:** `query`: parâmetros do `/authorize`.
- **Saída:** O `code_challenge`, ou erro OAuth.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readOAuthSettings`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/oauth.ts`
- **Assinatura:** `readOAuthSettings(env: EnvVars, issuer: string): OAuthSettings`
- **Usada por:** `createWhatsAppApps()`, `createWorkerApp()`, `readRemoteServerConfig()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Monta a configuração OAuth do ambiente com o emissor dado.
- **Entrada:** `env`: variáveis (`SEAL_KEY`, `OAUTH_REDIRECT_HOSTS`); `issuer`: URL pública.
- **Saída:** `OAuthSettings`; hosts padrão `DEFAULT_REDIRECT_HOSTS` se a variável não vier.
- **Efeitos:** Nenhum (pura).
- **Erros:** Os de `parseSealKey` (chave ausente ou de tamanho errado).

### `resolveIssuer`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/oauth.ts`
- **Assinatura:** `resolveIssuer(env: EnvVars, origin: string): string`
- **Usada por:** `createWhatsAppApps()`, `createWorkerApp()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Emissor OAuth: `PUBLIC_URL` sem barra final ou, sem ela, a origem da requisição (ex.: `*.workers.dev`).
- **Entrada:** `env` e a origem da requisição.
- **Saída:** URL do emissor, sem barra final.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `src/remote/seal.ts`

### `parseSealKey`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/seal.ts`
- **Assinatura:** `parseSealKey(raw: string | null): Buffer`
- **Usada por:** `readOAuthSettings()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Decodifica a `SEAL_KEY` (base64 ou base64url) e exige 32 bytes.
- **Entrada:** `raw`: valor da variável (ou nulo).
- **Saída:** `Buffer` de 32 bytes.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança se ausente (com o comando para gerar) ou de tamanho errado.

### `sealPayload`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/seal.ts`
- **Assinatura:** `sealPayload(payload: unknown, key: Buffer): string`
- **Usada por:** `issueAuthorizationCode()`, `issuePairCsrf()`, `issueTokenSet()`, `openPairSession()`, `registerClient()`, `sealAuthorizeRequest()`, `startPairLogin()`
- **Processos:** P08, P10, P12

<!-- gerado:fim -->

- **Faz:** Sela um valor JSON com AES-256-GCM.
- **Entrada:** `payload`: valor serializável; `key`: chave de 32 bytes.
- **Saída:** Texto base64url com `iv + tag + cifra`.
- **Efeitos:** Gera bytes aleatórios (IV).
- **Erros:** Nenhum.

### `unsealPayload`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/seal.ts`
- **Assinatura:** `unsealPayload(sealed: string, key: Buffer): Record<string, unknown> | null`
- **Usada por:** `openSealed()`
- **Processos:** P08, P09, P10, P11, P12

<!-- gerado:fim -->

- **Faz:** Abre um selo e devolve o objeto dentro.
- **Entrada:** `sealed`: texto selado; `key`: chave.
- **Saída:** Objeto; `null` se a chave não confere, o texto foi alterado ou não é objeto.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum (erros de decifragem viram `null`).

### `openSealed`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/seal.ts`
- **Assinatura:** `openSealed(sealed: string, key: Buffer, expected: SealExpectation): SealedClaims | null`
- **Usada por:** `clientRedirectUris()`, `isTrustedPost()`, `isValidPairLogin()`, `openAuthorizeRequest()`, `readAccessSecret()`, `readPairSession()`, `redeemAuthorizationCode()`, `redeemRefreshToken()`
- **Processos:** P08, P09, P10, P11, P12

<!-- gerado:fim -->

- **Faz:** Abre um selo do tipo esperado que ainda não venceu.
- **Entrada:** `sealed`; `key`; `expected`: `typ` e instante `now` (segundos Unix).
- **Saída:** `SealedClaims`; `null` se inválido, de outro tipo, sem `exp` numérico ou vencido.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `src/remote/tokens.ts`

### `sealAuthorizeRequest`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/tokens.ts`
- **Assinatura:** `sealAuthorizeRequest(request: AuthorizeRequest, settings: OAuthSettings, now: number): string`
- **Usada por:** `loginPageFor()`, `redirectToUpstream()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Sela o pedido de autorização para o formulário de login (15 minutos).
- **Entrada:** `request`: pedido validado; `settings`; `now`.
- **Saída:** Texto selado do tipo `pending`.
- **Efeitos:** Gera bytes aleatórios (selo).
- **Erros:** Nenhum.

### `openAuthorizeRequest`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/tokens.ts`
- **Assinatura:** `openAuthorizeRequest(sealed: string, settings: OAuthSettings, now: number): AuthorizeRequest | null`
- **Usada por:** `handleAuthorizeSubmit()`, `handleUpstreamCallback()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Abre o pedido selado vindo do formulário.
- **Entrada:** `sealed`; `settings`; `now`.
- **Saída:** `AuthorizeRequest`; `null` se inválido ou vencido.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `issueAuthorizationCode`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/tokens.ts`
- **Assinatura:** `issueAuthorizationCode(grant: ApprovedGrant, settings: OAuthSettings, now: number): string`
- **Usada por:** `handleAuthorizeSubmit()`, `handleUpstreamCallback()`
- **Processos:** P08, P10

<!-- gerado:fim -->

- **Faz:** Emite o código de autorização (5 minutos) amarrado a cliente, retorno e PKCE.
- **Entrada:** `grant`: pedido + segredo; `settings`; `now`.
- **Saída:** Código selado do tipo `code`.
- **Efeitos:** Gera bytes aleatórios (selo).
- **Erros:** Nenhum.

### `issueTokenSet`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/tokens.ts`
- **Assinatura:** `issueTokenSet(secret: string, settings: OAuthSettings, now: number): TokenSet`
- **Usada por:** `redeemTokenRequest()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Emite access token (1 hora) e refresh token (30 dias) para um segredo.
- **Entrada:** `secret`: credencial do usuário; `settings`; `now`.
- **Saída:** `TokenSet` do tipo Bearer.
- **Efeitos:** Gera bytes aleatórios (selos).
- **Erros:** Nenhum.

### `redeemAuthorizationCode`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/tokens.ts`
- **Assinatura:** `redeemAuthorizationCode(form: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<string>`
- **Usada por:** `redeemTokenRequest()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Confere o código contra cliente, retorno e verificador PKCE.
- **Entrada:** `form`: corpo do `/token`; `settings`; `now`.
- **Saída:** O segredo selado, ou erro `invalid_grant`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `redeemRefreshToken`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/tokens.ts`
- **Assinatura:** `redeemRefreshToken(form: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<string>`
- **Usada por:** `redeemTokenRequest()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Confere o refresh token.
- **Entrada:** `form`: corpo do `/token`; `settings`; `now`.
- **Saída:** O segredo selado, ou erro `invalid_grant`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `redeemTokenRequest`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/tokens.ts`
- **Assinatura:** `redeemTokenRequest(form: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<RedeemedGrant>`
- **Usada por:** `handleToken()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Atende o `/token` conforme o `grant_type`.
- **Entrada:** `form`: corpo do `/token`; `settings`; `now`.
- **Saída:** `RedeemedGrant` (novo `TokenSet`, o segredo e se veio de refresh), ou erro `invalid_grant`/`unsupported_grant_type`.
- **Efeitos:** Gera bytes aleatórios (selos).
- **Erros:** Nenhum.

### `readAccessSecret`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/tokens.ts`
- **Assinatura:** `readAccessSecret(authorization: string | null, settings: OAuthSettings, now: number): string | null`
- **Usada por:** `handleMcp()`
- **Processos:** P09, P11

<!-- gerado:fim -->

- **Faz:** Lê o segredo de um header `Authorization: Bearer`.
- **Entrada:** `authorization`: header (ou nulo); `settings`; `now`.
- **Saída:** O segredo; `null` sem Bearer, com token de outro tipo ou vencido.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/canvas-puc/src/worker.ts`

### `createWorkerApp`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/worker.ts`
- **Assinatura:** `createWorkerApp(env: EnvVars, origin: string): RemoteApp`
- **Usada por:** `handleWorkerFetch()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Monta o app remoto do Canvas para o Worker.
- **Entrada:** `env`: variáveis de texto; `origin`: origem da requisição (emissor sem `PUBLIC_URL`).
- **Saída:** `RemoteApp` com OAuth, conector do Canvas e relógio em segundos.
- **Efeitos:** Nenhum (pura).
- **Erros:** Os de `readOAuthSettings` (sem `SEAL_KEY`).

### `handleWorkerFetch`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/worker.ts`
- **Assinatura:** `async handleWorkerFetch(request: Request, env: Readonly<Record<string, unknown>>): Promise<Response>`
- **Usada por:** `connectors/canvas-puc/src/worker.ts (módulo)`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Atende uma requisição no Cloudflare Workers.
- **Entrada:** `request`; `env`: ambiente do Worker.
- **Saída:** Resposta do handler remoto; 500 com a explicação se a configuração for inválida.
- **Efeitos:** Os do handler remoto (rede para o Canvas).
- **Erros:** Nenhum: configuração inválida vira 500.

## `connectors/canvas-puc/src/files.ts`

### `fileContentBlock`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/files.ts`
- **Assinatura:** `fileContentBlock(file: CanvasAttachment, bytes: Uint8Array): CallToolResult['content'][number]`
- **Usada por:** `downloadedFileResult()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Monta o bloco MCP com o conteúdo do arquivo: `image` para `image/*`, `resource` embutido (blob) para o resto.
- **Entrada:** `file`: arquivo do Canvas; `bytes`: conteúdo.
- **Saída:** Bloco de conteúdo MCP.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `downloadedFileResult`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/files.ts`
- **Assinatura:** `downloadedFileResult(file: CanvasAttachment, bytes: Uint8Array): RawToolResult`
- **Usada por:** `downloadCanvasFile()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Monta o resultado de `baixar_arquivo`: uma linha com nome, tipo, tamanho e link, e o bloco com o conteúdo.
- **Entrada:** `file`; `bytes`.
- **Saída:** `RawToolResult`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `downloadRefusal`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/files.ts`
- **Assinatura:** `downloadRefusal(file: CanvasAttachment): string | null`
- **Usada por:** `downloadCanvasFile()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Decide se o arquivo não pode ser trazido à conversa: sem link ou acima de `MAX_DOWNLOAD_BYTES`.
- **Entrada:** `file`: arquivo do Canvas.
- **Saída:** Mensagem em português com o motivo (e o link, se houver), ou `null` se pode baixar.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `downloadCanvasFile`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/files.ts`
- **Assinatura:** `async downloadCanvasFile(client: CanvasClient, file: CanvasAttachment): Promise<RawToolResult | string>`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Baixa o arquivo e devolve seu conteúdo para a conversa, ou o motivo de não baixar.
- **Entrada:** `client`: cliente do Canvas; `file`: metadados de `/files/:id`.
- **Saída:** Promise com `RawToolResult` ou mensagem.
- **Efeitos:** Rede (download do arquivo).
- **Erros:** Repassa os erros do download.

### `readCanvasFileText`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/files.ts`
- **Assinatura:** `async readCanvasFileText(client: CanvasClient, file: CanvasAttachment): Promise<string>`
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lê um arquivo do Canvas como texto: texto puro, HTML (convertido) ou Word (.doc/.docx); outros tipos devolvem o link e sugerem `baixar_arquivo`.
- **Entrada:** `client`; `file`: metadados de `/files/:id`.
- **Saída:** Promise com `# nome` e o texto (até `MAX_TEXT_CHARS`), ou a mensagem com o link.
- **Efeitos:** Rede (download do arquivo).
- **Erros:** Repassa os erros do download e da extração do Word.

## `src/core/cfb.ts`

### `isCfb`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/cfb.ts`
- **Assinatura:** `isCfb(bytes: Uint8Array): boolean`
- **Usada por:** `readCfbHeader()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Diz se os bytes começam com a assinatura OLE/CFB (`CFB_SIGNATURE`).
- **Entrada:** `bytes`: arquivo.
- **Saída:** `true` se for CFB.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readCfbHeader`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/cfb.ts`
- **Assinatura:** `readCfbHeader(bytes: Uint8Array): CfbHeader`
- **Usada por:** `openCfb()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lê do cabeçalho de 512 bytes os tamanhos de setor, o início do diretório, da mini FAT e da DIFAT.
- **Entrada:** `bytes`: arquivo CFB.
- **Saída:** `CfbHeader`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança "Arquivo não é um documento do Office (OLE)." sem a assinatura.

### `cfbSector`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/cfb.ts`
- **Assinatura:** `cfbSector(bytes: Uint8Array, header: CfbHeader, id: number): Uint8Array`
- **Usada por:** `fatSectorIds()`, `openCfb()`, `readRegularChain()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Recorta um setor regular pelo id (o setor 0 vem logo após o cabeçalho).
- **Entrada:** `bytes`; `header`; `id`: número do setor.
- **Saída:** `Uint8Array` do setor.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `sectorWords`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/cfb.ts`
- **Assinatura:** `sectorWords(sector: Uint8Array): number[]`
- **Usada por:** `fatSectorIds()`, `openCfb()`, `readMiniStream()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lê um setor como lista de inteiros de 32 bits little-endian (FAT, DIFAT, mini FAT).
- **Entrada:** `sector`: bytes.
- **Saída:** Lista de números.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `fatSectorIds`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/cfb.ts`
- **Assinatura:** `fatSectorIds(bytes: Uint8Array, header: CfbHeader): number[]`
- **Usada por:** `openCfb()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lista os setores que guardam a FAT: os 109 do cabeçalho e os da cadeia DIFAT.
- **Entrada:** `bytes`; `header`.
- **Saída:** Ids válidos (sem marcas de livre/fim).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `followChain`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/cfb.ts`
- **Assinatura:** `followChain(table: readonly number[], start: number): number[]`
- **Usada por:** `readMiniStream()`, `readRegularChain()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Segue uma cadeia de setores na tabela até o fim de cadeia, sem entrar em laço.
- **Entrada:** `table`: FAT ou mini FAT; `start`: primeiro setor.
- **Saída:** Ids na ordem da cadeia (vazia se `start` for fim de cadeia).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readRegularChain`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/cfb.ts`
- **Assinatura:** `readRegularChain(file: Omit<CfbFile, 'entries'>, start: number): Uint8Array`
- **Usada por:** `openCfb()`, `readCfbStream()`, `readMiniStream()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lê os bytes de uma cadeia de setores regulares.
- **Entrada:** `file`: bytes, cabeçalho e FAT; `start`: primeiro setor.
- **Saída:** Bytes concatenados (múltiplo do tamanho do setor).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `parseDirectory`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/cfb.ts`
- **Assinatura:** `parseDirectory(dir: Uint8Array): CfbEntry[]`
- **Usada por:** `openCfb()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lê as entradas de 128 bytes do diretório CFB.
- **Entrada:** `dir`: bytes do diretório.
- **Saída:** Lista de `CfbEntry` (nome, primeiro setor, tamanho).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `openCfb`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/cfb.ts`
- **Assinatura:** `openCfb(bytes: Uint8Array): CfbFile`
- **Usada por:** `docToText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Abre um arquivo CFB: cabeçalho, FAT completa e diretório.
- **Entrada:** `bytes`: arquivo .doc (ou outro CFB).
- **Saída:** `CfbFile`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Repassa o erro de `readCfbHeader`.

### `readMiniStream`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/cfb.ts`
- **Assinatura:** `readMiniStream(file: CfbFile, entry: CfbEntry): Uint8Array`
- **Usada por:** `readCfbStream()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lê um stream pequeno pelo mini stream (setores de 64 bytes guardados na entrada raiz), seguindo a mini FAT.
- **Entrada:** `file`: CFB aberto; `entry`: o stream.
- **Saída:** Bytes (com sobra do último mini setor).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readCfbStream`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/cfb.ts`
- **Assinatura:** `readCfbStream(file: CfbFile, name: string): Uint8Array | null`
- **Usada por:** `docToText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lê um stream pelo nome, pelo mini stream ou pela FAT conforme o tamanho.
- **Entrada:** `file`: CFB aberto; `name`: nome do stream (ex.: `WordDocument`).
- **Saída:** Bytes do stream no tamanho exato, ou `null` se não existir.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `src/core/word.ts`

### `docxXmlToText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/word.ts`
- **Assinatura:** `docxXmlToText(xml: string): string`
- **Usada por:** `docxToText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Converte o XML do corpo do .docx em texto: junta os `w:t`, troca `w:tab` por tabulação, `w:br`/`w:cr` e fim de parágrafo por quebra de linha e decodifica as entidades.
- **Entrada:** `xml`: conteúdo de `word/document.xml`.
- **Saída:** Texto sem espaços nas pontas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `docxToText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/word.ts`
- **Assinatura:** `async docxToText(bytes: Uint8Array): Promise<string>`
- **Usada por:** `wordToText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Extrai o texto de um .docx (abre o ZIP e lê `word/document.xml`).
- **Entrada:** `bytes`: arquivo .docx.
- **Saída:** Promise com o texto.
- **Efeitos:** Nenhum (só CPU).
- **Erros:** Rejeita com "Arquivo .docx sem word/document.xml." ou com os erros do ZIP.

### `cp1252ToString`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/word.ts`
- **Assinatura:** `cp1252ToString(bytes: Uint8Array): string`
- **Usada por:** `pieceText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Decodifica bytes em Windows-1252 (texto de 8 bits do .doc).
- **Entrada:** `bytes`.
- **Saída:** Texto.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `parsePieceTable`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/word.ts`
- **Assinatura:** `parsePieceTable(table: Uint8Array, fcClx: number): DocPiece[]`
- **Usada por:** `docToText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lê a tabela de peças (PlcPcd) do Clx do .doc, pulando os blocos de formatação (Prc).
- **Entrada:** `table`: stream 0Table/1Table; `fcClx`: posição do Clx (do FIB).
- **Saída:** Lista de `DocPiece`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança "Documento .doc com tabela de texto inválida." se o Clx não tiver a tabela.

### `pieceText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/word.ts`
- **Assinatura:** `pieceText(wordDoc: Uint8Array, piece: DocPiece): string`
- **Usada por:** `docToText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Decodifica uma peça do texto: Windows-1252 se o bit "compressed" estiver ligado, senão UTF-16LE.
- **Entrada:** `wordDoc`: stream WordDocument; `piece`.
- **Saída:** Texto da peça.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `cleanWordText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/word.ts`
- **Assinatura:** `cleanWordText(raw: string): string`
- **Usada por:** `docToText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Troca as marcas do Word por texto com `WORD_TEXT_REPLACEMENTS`: tira o código dos campos (fica o resultado), parágrafos viram quebras, células viram tabulação.
- **Entrada:** `raw`: texto bruto das peças.
- **Saída:** Texto limpo, sem espaços nas pontas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `docToText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/word.ts`
- **Assinatura:** `docToText(bytes: Uint8Array): string`
- **Usada por:** `wordToText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Extrai o texto principal de um .doc (Word 97-2003): abre o CFB, lê o FIB, a tabela de peças e decodifica cada peça, cortando em `ccpText` (sem rodapés e cabeçalhos).
- **Entrada:** `bytes`: arquivo .doc.
- **Saída:** Texto.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança "O .doc está protegido por senha.", "Arquivo .doc sem o stream WordDocument.", "Arquivo .doc sem o stream de tabela." ou os erros de `openCfb`/`parsePieceTable`.

### `wordKind`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/word.ts`
- **Assinatura:** `wordKind(contentType: string, name: string): 'docx' | 'doc' | null`
- **Usada por:** `readCanvasFileText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Decide se o arquivo é documento do Word pelo nome ou pelo MIME.
- **Entrada:** `contentType`: MIME; `name`: nome do arquivo.
- **Saída:** `docx`, `doc` ou `null`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `wordToText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/word.ts`
- **Assinatura:** `wordToText(kind: 'docx' | 'doc', bytes: Uint8Array): Promise<string>`
- **Usada por:** `readCanvasFileText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Extrai o texto de um documento do Word conforme o tipo.
- **Entrada:** `kind`: `docx` ou `doc`; `bytes`.
- **Saída:** Promise com o texto.
- **Efeitos:** Nenhum (só CPU).
- **Erros:** Repassa os erros de `docxToText`/`docToText`.

## `src/core/zip.ts`

### `findEndOfCentralDirectory`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/zip.ts`
- **Assinatura:** `findEndOfCentralDirectory(bytes: Uint8Array): number`
- **Usada por:** `listZipEntries()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Acha o registro de fim do diretório central (EOCD) do ZIP, procurando de trás para frente.
- **Entrada:** `bytes`: arquivo ZIP.
- **Saída:** Posição do EOCD.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança "Arquivo ZIP inválido: diretório central não encontrado.".

### `listZipEntries`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/zip.ts`
- **Assinatura:** `listZipEntries(bytes: Uint8Array): ZipEntry[]`
- **Usada por:** `readZipEntry()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lê as entradas do diretório central do ZIP.
- **Entrada:** `bytes`: arquivo ZIP.
- **Saída:** Lista de `ZipEntry`; para na primeira entrada corrompida.
- **Efeitos:** Nenhum (pura).
- **Erros:** Repassa o erro de `findEndOfCentralDirectory`.

### `zipEntryBytes`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/zip.ts`
- **Assinatura:** `zipEntryBytes(bytes: Uint8Array, entry: ZipEntry): Uint8Array`
- **Usada por:** `readZipEntry()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Recorta os bytes comprimidos de uma entrada, pulando o cabeçalho local.
- **Entrada:** `bytes`: ZIP; `entry`: entrada.
- **Saída:** `Uint8Array` comprimido.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `inflateRaw`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/zip.ts`
- **Assinatura:** `async inflateRaw(data: Uint8Array): Promise<Uint8Array>`
- **Usada por:** `readZipEntry()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Descomprime DEFLATE puro com `DecompressionStream` (Node 22 e Workers).
- **Entrada:** `data`: bytes comprimidos.
- **Saída:** Promise com os bytes descomprimidos.
- **Efeitos:** Nenhum (só CPU).
- **Erros:** Rejeita se os dados não forem DEFLATE válido.

### `readZipEntry`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/zip.ts`
- **Assinatura:** `async readZipEntry(bytes: Uint8Array, name: string): Promise<Uint8Array | null>`
- **Usada por:** `docxToText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Lê e descompacta uma entrada do ZIP pelo nome (métodos 0 e 8).
- **Entrada:** `bytes`: ZIP; `name`: caminho da entrada.
- **Saída:** Promise com os bytes, ou `null` se a entrada não existir.
- **Efeitos:** Nenhum (só CPU).
- **Erros:** Rejeita com "Compressão ZIP não suportada (método N)." para outros métodos.

## `src/core/bytes.ts`

### `bytesToBase64`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/bytes.ts`
- **Assinatura:** `bytesToBase64(bytes: Uint8Array): string`
- **Usada por:** `binaryContentBlock()`
- **Processos:** P03, P11

<!-- gerado:fim -->

- **Faz:** Codifica bytes em base64 em blocos de 32 KB, sem `Buffer` (Node e Workers).
- **Entrada:** `bytes`.
- **Saída:** Texto base64.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `byteView`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/bytes.ts`
- **Assinatura:** `byteView(bytes: Uint8Array): DataView`
- **Usada por:** `docToText()`, `findEndOfCentralDirectory()`, `listZipEntries()`, `parseDirectory()`, `parsePieceTable()`, `readCfbHeader()`, `sectorWords()`, `utf16leToString()`, `zipEntryBytes()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Cria uma `DataView` sobre exatamente a fatia de bytes dada (respeita `byteOffset`).
- **Entrada:** `bytes`: buffer ou fatia.
- **Saída:** `DataView` para leituras little-endian.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `concatBytes`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/bytes.ts`
- **Assinatura:** `concatBytes(parts: readonly Uint8Array[]): Uint8Array`
- **Usada por:** `readMiniStream()`, `readRegularChain()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Junta vários pedaços de bytes num buffer novo, em ordem.
- **Entrada:** `parts`: lista de `Uint8Array`.
- **Saída:** `Uint8Array` com todos os bytes.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `utf16leToString`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/bytes.ts`
- **Assinatura:** `utf16leToString(bytes: Uint8Array): string`
- **Usada por:** `parseDirectory()`, `pieceText()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Decodifica UTF-16LE sem `TextDecoder` (portável para o Workers).
- **Entrada:** `bytes`: texto em UTF-16LE.
- **Saída:** Texto; um byte solto no fim é ignorado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/whatsapp/src/bridge-client.ts`

### `bridgeErrorFrom`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/bridge-client.ts`
- **Assinatura:** `bridgeErrorFrom(status: number, body: unknown): BridgeError`
- **Usada por:** `callBridge()`, `ensureRestored()`
- **Processos:** P10, P11, P12, P13

<!-- gerado:fim -->

- **Faz:** Traduz uma resposta de erro da ponte em `BridgeError` com mensagem em português.
- **Entrada:** `status` HTTP e o corpo JSON da resposta (qualquer valor).
- **Saída:** `BridgeError` com mensagem de `BRIDGE_ERROR_MESSAGES` (ou a da ponte), status e código.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum (devolve o erro, não lança).

### `withDeadline`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/bridge-client.ts`
- **Assinatura:** `withDeadline(promise: Promise<T>, deadline: number, message: string): Promise<T>`
- **Usada por:** `callBridge()`, `runRead()`, `runScheduledSync()`
- **Processos:** P10, P11, P12, P14

<!-- gerado:fim -->

- **Faz:** Espera uma promessa até o instante `deadline` (ms Unix); depois disso rejeita com a mensagem dada.
- **Entrada:** `promise`, `deadline` (ms Unix) e a mensagem de tempo esgotado.
- **Saída:** Promessa com o valor da original.
- **Efeitos:** Agenda e limpa um `setTimeout`.
- **Erros:** Rejeita com `Error(message)` se o prazo passar (ou já passou); repassa a rejeição da original.

### `bridgeTimeoutMessage`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/bridge-client.ts`
- **Assinatura:** `bridgeTimeoutMessage(path: string): string`
- **Usada por:** `callBridge()`
- **Processos:** P10, P11, P12

<!-- gerado:fim -->

- **Faz:** Mensagem de tempo esgotado de uma chamada à ponte.
- **Entrada:** `path` da chamada (com ou sem query).
- **Saída:** Texto em português com a rota sem query.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `callBridge`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/bridge-client.ts`
- **Assinatura:** `async callBridge(bridge: BridgeFetch, path: string, options: { readonly init?: RequestInit; readonly deadline: number }): Promise<Response>`
- **Usada por:** `bridgeJson()`, `connectors/whatsapp/src/tools.ts (módulo)`
- **Processos:** P10, P11, P12

<!-- gerado:fim -->

- **Faz:** Chama a ponte dentro do prazo e devolve a resposta crua se for 2xx; senão lança `BridgeError`.
- **Entrada:** `bridge`, `path` e opções (`init`, `deadline`).
- **Saída:** `Response` 2xx da ponte.
- **Efeitos:** Rede: requisição ao Durable Object da ponte.
- **Erros:** Rejeita com `BridgeError` se não for 2xx, ou `Error` de tempo esgotado.

### `bridgeJson`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/bridge-client.ts`
- **Assinatura:** `async bridgeJson(bridge: BridgeFetch, path: string, options: { readonly init?: RequestInit; readonly deadline: number }): Promise<T>`
- **Usada por:** `connectors/whatsapp/src/pair.ts (módulo)`, `connectors/whatsapp/src/tools.ts (módulo)`, `fetchPairStatus()`, `prepareRead()`
- **Processos:** P10, P11, P12

<!-- gerado:fim -->

- **Faz:** Chama a ponte e lê o JSON da resposta.
- **Entrada:** `bridge`, `path` e opções (`init`, `deadline`).
- **Saída:** Corpo JSON tipado como `T`.
- **Efeitos:** Rede: requisição ao Durable Object da ponte.
- **Erros:** Os de `callBridge`; rejeita se o corpo não for JSON.

### `bridgePath`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/bridge-client.ts`
- **Assinatura:** `bridgePath(path: string, params: Readonly<Record<string, string | number | undefined>>): string`
- **Usada por:** `connectors/whatsapp/src/tools.ts (módulo)`, `prepareRead()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Monta `caminho?query` só com os parâmetros definidos.
- **Entrada:** `path` e os parâmetros (indefinidos e vazios são ignorados).
- **Saída:** Caminho com a query, ou só o caminho.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `jsonPost`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/bridge-client.ts`
- **Assinatura:** `jsonPost(body: unknown): RequestInit`
- **Usada por:** `connectors/whatsapp/src/pair.ts (módulo)`, `connectors/whatsapp/src/tools.ts (módulo)`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Corpo JSON de um POST para a ponte.
- **Entrada:** `body`: valor a serializar.
- **Saída:** `RequestInit` com método POST, `content-type` JSON e corpo.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/whatsapp/src/config.ts`

### `requireEnv`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/config.ts`
- **Assinatura:** `requireEnv(env: EnvVars, key: string, how: string): string`
- **Usada por:** `containerEnvVars()`, `readWhatsAppSettings()`
- **Processos:** P10, P14

<!-- gerado:fim -->

- **Faz:** Lê uma variável obrigatória ou lança dizendo como defini-la.
- **Entrada:** `env`, a chave e a instrução de como defini-la.
- **Saída:** Valor da variável.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `Error` se a variável estiver ausente ou vazia.

### `readIntInRange`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/config.ts`
- **Assinatura:** `readIntInRange(env: EnvVars, key: string, range: { readonly min: number; readonly max: number; readonly fallback: number }): number`
- **Usada por:** `readSendSettings()`, `readTimingSettings()`
- **Processos:** P10, P14

<!-- gerado:fim -->

- **Faz:** Lê um inteiro dentro de um intervalo; ausente vale o padrão, fora do intervalo lança.
- **Entrada:** `env`, a chave e o intervalo (`min`, `max`, `fallback`).
- **Saída:** O inteiro lido ou o padrão.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `Error` se não for inteiro ou estiver fora do intervalo.

### `readSleepAfter`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/config.ts`
- **Assinatura:** `readSleepAfter(env: EnvVars): string`
- **Usada por:** `connectors/whatsapp/src/container.ts (módulo)`, `readTimingSettings()`
- **Processos:** P10, P14

<!-- gerado:fim -->

- **Faz:** Valida `SLEEP_AFTER` (`30s` a `60m`, ou `1h`); ausente vale `5m`.
- **Entrada:** `env`.
- **Saída:** A duração no formato do `Container` (ex. `5m`).
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `Error` se o formato for inválido ou a duração estiver fora de 30 s a 1 h.

### `normalizePhone`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/config.ts`
- **Assinatura:** `normalizePhone(raw: string): string | null`
- **Usada por:** `allowedRecipient()`, `connectors/whatsapp/src/pair.ts (módulo)`, `readSendAllowlist()`
- **Processos:** P10, P12, P14

<!-- gerado:fim -->

- **Faz:** Normaliza um número de telefone ou JID de contato para só dígitos; nulo se não parecer um número.
- **Entrada:** `raw`: número ou JID (`...@s.whatsapp.net`).
- **Saída:** De 8 a 15 dígitos, ou `null`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readSendAllowlist`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/config.ts`
- **Assinatura:** `readSendAllowlist(env: EnvVars): string[]`
- **Usada por:** `readSendSettings()`
- **Processos:** P10, P14

<!-- gerado:fim -->

- **Faz:** Lê `SEND_ALLOWLIST` (números separados por vírgula); item inválido lança.
- **Entrada:** `env`.
- **Saída:** Lista de números normalizados (vazia se ausente).
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `Error` com o item inválido.

### `readAllowedEmails`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/config.ts`
- **Assinatura:** `readAllowedEmails(env: EnvVars): string[]`
- **Usada por:** `readWhatsAppSettings()`
- **Processos:** P10, P14

<!-- gerado:fim -->

- **Faz:** Lê a lista de donos (`ALLOWED_EMAILS`); vazia lança, porque ninguém conseguiria entrar.
- **Entrada:** `env`.
- **Saída:** Lista de e-mails em minúsculas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `Error` se a lista estiver vazia.

### `readTimingSettings`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/config.ts`
- **Assinatura:** `readTimingSettings(env: EnvVars): Pick<WhatsAppSettings, 'sleepAfter' | 'toolTimeoutMs' | 'syncWaitMs'>`
- **Usada por:** `readWhatsAppSettings()`
- **Processos:** P10, P14

<!-- gerado:fim -->

- **Faz:** Lê os prazos: sono do container, teto por ferramenta e espera do sync.
- **Entrada:** `env`.
- **Saída:** `sleepAfter`, `toolTimeoutMs` e `syncWaitMs`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Os de `readSleepAfter` e `readIntInRange`.

### `readSendSettings`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/config.ts`
- **Assinatura:** `readSendSettings(env: EnvVars): Pick<WhatsAppSettings, 'enableSend' | 'sendAllowlist' | 'sendMaxPerHour'>`
- **Usada por:** `connectors/whatsapp/src/container.ts (módulo)`, `readWhatsAppSettings()`
- **Processos:** P10, P14

<!-- gerado:fim -->

- **Faz:** Lê a configuração de envio (fase 2): ligado ou não, allowlist e limite por hora.
- **Entrada:** `env`.
- **Saída:** `enableSend`, `sendAllowlist` e `sendMaxPerHour`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Os de `readSendAllowlist` e `readIntInRange`.

### `readWhatsAppSettings`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/config.ts`
- **Assinatura:** `readWhatsAppSettings(env: EnvVars): WhatsAppSettings`
- **Usada por:** `createWhatsAppApps()`, `isSyncCronEnabled()`
- **Processos:** P10, P14

<!-- gerado:fim -->

- **Faz:** Lê e valida a configuração do conector a partir do ambiente do Worker.
- **Entrada:** `env`: variáveis de texto do Worker.
- **Saída:** `WhatsAppSettings` completo.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `Error` explicando a variável ausente ou inválida.

### `containerEnvVars`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/config.ts`
- **Assinatura:** `containerEnvVars(env: EnvVars): Record<string, string>`
- **Usada por:** `connectors/whatsapp/src/container.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Monta o ambiente do container: só as chaves da ponte, mais o endereço do snapshot de saída.
- **Entrada:** `env`: variáveis de texto do Worker.
- **Saída:** Variáveis de `BRIDGE_ENV_KEYS` presentes, mais `SNAPSHOT_PUSH_URL`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `Error` se faltar `BRIDGE_TOKEN` (ou tiver menos de 32 caracteres) ou `SNAPSHOT_KEY`.

## `connectors/whatsapp/src/container.ts`

### `workersFixedLength`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/container.ts`
- **Assinatura:** `workersFixedLength(body: ReadableStream<Uint8Array>, length: number): ReadableStream<Uint8Array>`
- **Usada por:** `connectors/whatsapp/src/container.ts (módulo)`
- **Processos:** P13

<!-- gerado:fim -->

- **Faz:** Fluxo de tamanho fixo do Workers para gravar no R2 sem carregar o arquivo na memória.
- **Entrada:** `body`: fluxo de bytes; `length`: tamanho total.
- **Saída:** Fluxo legível do `FixedLengthStream`.
- **Efeitos:** Encadeia `body` no `FixedLengthStream` (em segundo plano).
- **Erros:** Nenhum (falha do encadeamento não é observada aqui).

## `connectors/whatsapp/src/format.ts`

### `isHiddenChar`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/format.ts`
- **Assinatura:** `isHiddenChar(char: string): boolean`
- **Usada por:** `sanitizeText()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Diz se um caractere é invisível ou de controle (pode esconder texto do usuário).
- **Entrada:** `char`: um caractere.
- **Saída:** `true` se cai em `HIDDEN_CHAR_RANGES`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `sanitizeText`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/format.ts`
- **Assinatura:** `sanitizeText(text: string | null | undefined, max = MAX_TEXT_CHARS): string`
- **Usada por:** `compactChat()`, `compactContact()`, `compactMessage()`, `connectors/whatsapp/src/tools.ts (módulo)`, `mediaResult()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Limpa um texto de terceiros: tira caracteres invisíveis/de controle e corta no teto.
- **Entrada:** `text` (pode ser nulo) e `max` (padrão `MAX_TEXT_CHARS`).
- **Saída:** Texto limpo, com aviso `[truncated N chars]` se cortado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `untrusted`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/format.ts`
- **Assinatura:** `untrusted(data: T): { readonly notice: string; readonly data: T }`
- **Usada por:** `connectors/whatsapp/src/tools.ts (módulo)`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Embrulha dados com conteúdo de terceiros sob o aviso de não confiável.
- **Entrada:** `data`: qualquer valor.
- **Saída:** `{ notice: UNTRUSTED_NOTICE, data }`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `compactMessage`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/format.ts`
- **Assinatura:** `compactMessage(message: BridgeMessage): Record<string, unknown>`
- **Usada por:** `connectors/whatsapp/src/tools.ts (módulo)`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Mensagem compacta: só campos úteis, textos limpos, sem campos vazios.
- **Entrada:** `message`: mensagem da ponte.
- **Saída:** Objeto com `id`, `chat`, `from`, `at` e, se houver, nome, tipo, texto e mídia.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `compactChat`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/format.ts`
- **Assinatura:** `compactChat(chat: BridgeChat): Record<string, unknown>`
- **Usada por:** `connectors/whatsapp/src/tools.ts (módulo)`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Conversa compacta, com a prévia da última mensagem limpa e curta.
- **Entrada:** `chat`: conversa da ponte.
- **Saída:** Objeto com `jid`, `name`, `last_at` e, se houver, `group` e `last`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `partialSyncWarning`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/format.ts`
- **Assinatura:** `partialSyncWarning(status: BridgeStatus): string | null`
- **Usada por:** `prepareRead()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Aviso de resultado parcial quando o sync de pendências não terminou a tempo.
- **Entrada:** `status`: status da ponte.
- **Saída:** Aviso (sincronizando ou desconectado) ou `null` se não é parcial.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `compactStatus`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/format.ts`
- **Assinatura:** `compactStatus(status: BridgeStatus, pairUrl: string): Record<string, unknown>`
- **Usada por:** `connectors/whatsapp/src/tools.ts (módulo)`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Status compacto para `whatsapp_status`.
- **Entrada:** `status` da ponte e `pairUrl` da página de pareamento.
- **Saída:** Objeto com conexão, pareamento (e `pair_at` se preciso), sync, contagens e envio.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/whatsapp/src/lifecycle.ts`

### `withBridgeToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `withBridgeToken(token: string, init: RequestInit = {}): RequestInit`
- **Usada por:** `fetchBridge()`
- **Processos:** P11, P13

<!-- gerado:fim -->

- **Faz:** Junta o `Authorization` da ponte às opções de uma requisição.
- **Entrada:** `token` da ponte e `init` (opcional).
- **Saída:** `RequestInit` com `authorization: Bearer <token>`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `fetchBridge`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `fetchBridge(host: BridgeHost, path: string, init?: RequestInit): Promise<Response>`
- **Usada por:** `ensureRestored()`, `readBridgePhase()`, `routeBridgeRequest()`, `snapshotBridge()`
- **Processos:** P11, P13

<!-- gerado:fim -->

- **Faz:** Faz uma requisição à ponte dentro do container, já autenticada.
- **Entrada:** `host`, `path` e `init` opcional.
- **Saída:** Resposta da ponte.
- **Efeitos:** Rede: `containerFetch` (pode acordar o container).
- **Erros:** Repassa a rejeição do `containerFetch`.

### `readBridgePhase`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `async readBridgePhase(host: BridgeHost): Promise<string>`
- **Usada por:** `ensureRestored()`
- **Processos:** P11, P13

<!-- gerado:fim -->

- **Faz:** Lê a fase da ponte (`GET /health`).
- **Entrada:** `host`: porta do Durable Object.
- **Saída:** Fase (ex. `awaiting_restore`) ou `unknown`.
- **Efeitos:** Rede: `GET /health` no container.
- **Erros:** Rejeita se a chamada falhar ou o corpo não for JSON.

### `restoreRequestInit`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `async restoreRequestInit(host: BridgeHost): Promise<RequestInit>`
- **Usada por:** `ensureRestored()`
- **Processos:** P11, P13

<!-- gerado:fim -->

- **Faz:** Opções do `POST /restore`: o snapshot do bucket em fluxo, ou `X-Snapshot: none` se não houver.
- **Entrada:** `host`: porta do Durable Object.
- **Saída:** `RequestInit` do POST, com o snapshot como corpo ou o header `x-snapshot: none`.
- **Efeitos:** Lê o snapshot no R2.
- **Erros:** Repassa a rejeição do R2.

### `ensureRestored`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `async ensureRestored(host: BridgeHost): Promise<void>`
- **Usada por:** `routeBridgeRequest()`
- **Processos:** P11, P13

<!-- gerado:fim -->

- **Faz:** Restaura a ponte se ela acabou de acordar; snapshot recusado lança (nunca recomeça do zero sozinho).
- **Entrada:** `host`: porta do Durable Object.
- **Saída:** Nada.
- **Efeitos:** Rede: `/health` e `/restore` no container; lê o snapshot no R2.
- **Erros:** Lança `BridgeError` se o restore falhar (exceto 409, outra requisição já restaurou).

### `snapshotBridge`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `async snapshotBridge(host: BridgeHost, force = false): Promise<SnapshotOutcome>`
- **Usada por:** `connectors/whatsapp/src/lifecycle.ts (módulo)`
- **Processos:** P13

<!-- gerado:fim -->

- **Faz:** Pede o snapshot à ponte e grava no bucket.
- **Entrada:** `host`: porta do Durable Object; `force`: pede `?force=1` (depois de uma gravação que falhou).
- **Saída:** `SnapshotOutcome` (`saved`, `unchanged` ou `stale`).
- **Efeitos:** Rede: `GET /snapshot` no container; grava no R2.
- **Erros:** Os de `storeSnapshotResponse`.

### `planSend`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `planSend(history: readonly number[], now: number, maxPerHour: number): { readonly allowed: boolean; readonly history: number[]; readonly retryAfterSeconds: number }`
- **Usada por:** `guardSend()`
- **Processos:** P11, P14

<!-- gerado:fim -->

- **Faz:** Decide um envio: permitido (e o histórico novo) ou recusado com quantos segundos esperar. Pura.
- **Entrada:** `history` (ms dos envios), `now` (ms) e `maxPerHour`.
- **Saída:** `allowed`, o histórico da última hora e `retryAfterSeconds`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `guardSend`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `async guardSend(host: BridgeHost): Promise<Response | null>`
- **Usada por:** `routeBridgeRequest()`
- **Processos:** P11, P14

<!-- gerado:fim -->

- **Faz:** Aplica o limite de envios; devolve a resposta 429 se estourou, ou nulo (e registra o envio) se pode.
- **Entrada:** `host`: porta do Durable Object.
- **Saída:** Resposta 429 `rate_limited` ou `null`.
- **Efeitos:** Lê e grava `SEND_HISTORY_KEY` no armazenamento do Durable Object.
- **Erros:** Repassa a rejeição do armazenamento.

### `forwardInit`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `forwardInit(request: Request): RequestInit`
- **Usada por:** `routeBridgeRequest()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Opções para repassar uma requisição recebida à ponte (método, tipo e corpo).
- **Entrada:** `request`: requisição recebida.
- **Saída:** `RequestInit` com método, `content-type` e corpo (fora de GET/HEAD).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `createBridgeLifecycle`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `createBridgeLifecycle(host: BridgeHost): BridgeLifecycle`
- **Usada por:** `connectors/whatsapp/src/container.ts (módulo)`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Monta o ciclo de vida da ponte para um Durable Object.
- **Entrada:** `host`: porta do Durable Object.
- **Saída:** `BridgeLifecycle` (`handle`, `snapshotNow`, `snapshotQuietly`).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `logSnapshotFailure`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `async logSnapshotFailure(run: Promise<SnapshotOutcome>): Promise<void>`
- **Usada por:** `connectors/whatsapp/src/lifecycle.ts (módulo)`
- **Processos:** P13

<!-- gerado:fim -->

- **Faz:** Espera um snapshot e só registra a falha no log (sem dados de mensagens).
- **Entrada:** `run`: promessa do snapshot.
- **Saída:** Nada.
- **Efeitos:** `console.warn` se o snapshot falhar.
- **Erros:** Nenhum (a falha vira aviso no log).

### `resetBridge`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `async resetBridge(host: BridgeHost): Promise<Response>`
- **Usada por:** `routeBridgeRequest()`
- **Processos:** P11, P12

<!-- gerado:fim -->

- **Faz:** Recomeça do zero: arquiva o snapshot atual e para o container (o próximo uso sobe vazio).
- **Entrada:** `host`: porta do Durable Object.
- **Saída:** JSON `{ reset: true, archived }`.
- **Efeitos:** Copia e apaga o snapshot no R2; para o container.
- **Erros:** Repassa a rejeição do R2 ou do `stop`.

### `routeBridgeRequest`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/lifecycle.ts`
- **Assinatura:** `async routeBridgeRequest(router: BridgeRouter, request: Request): Promise<Response>`
- **Usada por:** `createBridgeLifecycle()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Atende uma requisição do Worker: rotas internas (`/__snapshot`, `/__reset`) ou repasse à ponte.
- **Entrada:** `router` (host e agendador de snapshots) e a requisição.
- **Saída:** Resposta da ponte, da rota interna ou 429 do limite de envio.
- **Efeitos:** Rede ao container; R2; armazenamento do Durable Object; pode agendar snapshot.
- **Erros:** Os de `ensureRestored`, `fetchBridge` e do snapshot/reset.

## `connectors/whatsapp/src/pair-page.ts`

### `describePairStatus`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair-page.ts`
- **Assinatura:** `describePairStatus(status: BridgeStatus | null): string`
- **Usada por:** `renderPairPage()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Frase de status para o dono.
- **Entrada:** `status` da ponte ou `null`.
- **Saída:** Frase em português (sem status, precisa parear, conectando ou conectado).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pairForm`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair-page.ts`
- **Assinatura:** `pairForm(action: string, csrf: string, body: string): string`
- **Usada por:** `maintenanceSection()`, `pairingSection()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Formulário POST com o token anti-CSRF e campos extras.
- **Entrada:** `action`, `csrf` e o HTML dos campos.
- **Saída:** HTML do `<form>`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pairingSection`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair-page.ts`
- **Assinatura:** `pairingSection(view: PairPageView): string`
- **Usada por:** `renderPairPage()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Bloco de pareamento: pedir código pelo número ou mostrar o QR.
- **Entrada:** `view`: dados da página.
- **Saída:** HTML com o código ou QR (se houver) e os formulários.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `maintenanceSection`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair-page.ts`
- **Assinatura:** `maintenanceSection(view: PairPageView): string`
- **Usada por:** `renderPairPage()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Bloco de manutenção: deslogar, recomeçar do zero (apaga o backup) e sair.
- **Entrada:** `view`: dados da página.
- **Saída:** HTML dos três formulários.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `alertHtml`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair-page.ts`
- **Assinatura:** `alertHtml(view: PairPageView): string`
- **Usada por:** `renderPairPage()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Aviso do resultado da última ação: erro, mensagem ou nada.
- **Entrada:** `view`: dados da página.
- **Saída:** HTML do aviso, ou texto vazio.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `renderPairPage`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair-page.ts`
- **Assinatura:** `renderPairPage(view: PairPageView): string`
- **Usada por:** `pairPage()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Renderiza a página `/pair` completa.
- **Entrada:** `view`: e-mail, CSRF, status e resultado da ação.
- **Saída:** HTML da página (com refresh de 20 s se mostra código ou QR).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/whatsapp/src/pair.ts`

### `parseCookies`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `parseCookies(header: string | null): Record<string, string>`
- **Usada por:** `isValidPairLogin()`, `readPairSession()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Lê os cookies de um header `Cookie`.
- **Entrada:** `header` (pode ser nulo).
- **Saída:** Mapa nome → valor.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `redirectWithCookies`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `redirectWithCookies(location: string, cookies: readonly string[]): Response`
- **Usada por:** `handlePairPost()`, `openPairSession()`, `routePairPost()`, `startPairLogin()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Redirecionamento com cookies.
- **Entrada:** `location` e a lista de `Set-Cookie`.
- **Saída:** Resposta 302 `no-store` com os cookies.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readPairSession`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `readPairSession(app: PairApp, request: Request): string | null`
- **Usada por:** `routePairRequest()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** E-mail da sessão do `/pair` no cookie; nulo se ausente, vencida ou de quem saiu da lista.
- **Entrada:** `app` e a requisição.
- **Saída:** E-mail da sessão ou `null`.
- **Efeitos:** Nenhum (pura; lê o cookie da requisição).
- **Erros:** Nenhum.

### `issuePairCsrf`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `issuePairCsrf(app: PairApp, email: string): string`
- **Usada por:** `pairPage()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Token anti-CSRF amarrado ao e-mail da sessão.
- **Entrada:** `app` e o e-mail.
- **Saída:** Token selado `pair_csrf` com validade da sessão.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `isTrustedPost`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `isTrustedPost(app: PairApp, request: Request, input: { csrf: string; email: string }): boolean`
- **Usada por:** `handlePairPost()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Confere o token anti-CSRF do formulário e a origem da requisição.
- **Entrada:** `app`, a requisição e `{ csrf, email }`.
- **Saída:** `true` se o token vale para o e-mail e o `Origin` é o do emissor.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `startPairLogin`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `startPairLogin(app: PairApp): Response`
- **Usada por:** `routePairRequest()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Começa o login do `/pair`: manda ao GitHub com `state` selado e amarra o navegador por um nonce em cookie.
- **Entrada:** `app`: dependências do `/pair`.
- **Saída:** 302 ao GitHub com o cookie do nonce.
- **Efeitos:** Gera um nonce aleatório (`crypto.randomUUID`).
- **Erros:** Nenhum.

### `isValidPairLogin`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `isValidPairLogin(app: PairApp, request: Request): boolean`
- **Usada por:** `handlePairCallback()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Confere o `state` do retorno do GitHub e o nonce do cookie deste navegador.
- **Entrada:** `app` e a requisição de retorno.
- **Saída:** `true` se o `state` é válido e o nonce bate com o cookie.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `openPairSession`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `openPairSession(app: PairApp, email: string): Response`
- **Usada por:** `handlePairCallback()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Abre a sessão do `/pair` para o e-mail aceito e volta à página.
- **Entrada:** `app` e o e-mail aceito.
- **Saída:** 302 para `/pair` com o cookie da sessão e o do nonce apagado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `handlePairCallback`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `async handlePairCallback(app: PairApp, request: Request): Promise<Response>`
- **Usada por:** `routePairRequest()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Retorno do GitHub no `/pair`: confere `state` e nonce, conclui o login e abre a sessão.
- **Entrada:** `app` e a requisição de retorno.
- **Saída:** 302 com a sessão; HTML 400 (login expirado ou de outro navegador) ou 403 (login recusado).
- **Efeitos:** Rede: `fetch` ao GitHub (token e e-mails).
- **Erros:** Nenhum (a falha do login vira página 403).

### `pairDeadline`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `pairDeadline(app: PairApp): number`
- **Usada por:** `connectors/whatsapp/src/pair.ts (módulo)`, `fetchPairStatus()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Prazo (ms Unix) de uma chamada do `/pair` à ponte.
- **Entrada:** `app`.
- **Saída:** `Date.now()` mais `timeoutMs`.
- **Efeitos:** Lê o relógio.
- **Erros:** Nenhum.

### `fetchPairStatus`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `async fetchPairStatus(app: PairApp): Promise<BridgeStatus | null>`
- **Usada por:** `pairPage()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Lê o status da ponte; nulo se ela não responder a tempo.
- **Entrada:** `app`.
- **Saída:** `BridgeStatus` ou `null`.
- **Efeitos:** Rede: `GET /status` na ponte.
- **Erros:** Nenhum (qualquer falha devolve `null`).

### `pairPage`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `async pairPage(app: PairApp, email: string, extra: Partial<PairPageView> = {}): Promise<Response>`
- **Usada por:** `handlePairPost()`, `routePairRequest()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Mostra a página com o status atual e o resultado de uma ação (código, QR, mensagem ou erro).
- **Entrada:** `app`, o e-mail e o resultado da ação (opcional).
- **Saída:** Resposta HTML da página `/pair`.
- **Efeitos:** Rede: `GET /status` na ponte.
- **Erros:** Nenhum (status indisponível vira `null`).

### `handlePairPost`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `async handlePairPost(app: PairApp, request: Request, email: string): Promise<Response>`
- **Usada por:** `routePairPost()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Atende um POST do `/pair` já autenticado: sair, ou executar a ação e mostrar a página.
- **Entrada:** `app`, a requisição e o e-mail da sessão.
- **Saída:** Página com o resultado; 302 ao sair; HTML 403 (formulário inválido) ou 404.
- **Efeitos:** Lê o corpo; rede à ponte pela ação; apaga o cookie ao sair.
- **Erros:** Nenhum (falha da ação vira erro na página).

### `routePairPost`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `routePairPost(app: PairApp, request: Request, email: string | null): Promise<Response>`
- **Usada por:** `routePairRequest()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Roteia um POST do `/pair`: sem sessão volta ao login; com sessão, executa a ação.
- **Entrada:** `app`, a requisição e o e-mail da sessão (ou `null`).
- **Saída:** 302 para `/pair` ou a resposta de `handlePairPost`.
- **Efeitos:** Os de `handlePairPost`.
- **Erros:** Nenhum.

### `isPairPath`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `isPairPath(path: string): boolean`
- **Usada por:** `routePairRequest()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Diz se o caminho pertence ao `/pair`.
- **Entrada:** `path`: caminho da URL.
- **Saída:** `true` para `/pair`, `/pair/*` e o retorno do GitHub do `/pair`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `routePairRequest`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `async routePairRequest(app: PairApp, request: Request): Promise<Response | null>`
- **Usada por:** `handleWhatsAppFetch()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Roteia as requisições do `/pair`; nulo se o caminho não é do `/pair`.
- **Entrada:** `app` e a requisição.
- **Saída:** Resposta da rota, HTML 404 ou `null` fora do `/pair`.
- **Efeitos:** Os das rotas (rede ao GitHub e à ponte, cookies).
- **Erros:** Nenhum.

### `pairCookie`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `pairCookie(name: string, value: string, maxAge: number): string`
- **Usada por:** `handlePairPost()`, `openPairSession()`, `startPairLogin()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Monta um `Set-Cookie` seguro (HttpOnly, Secure, SameSite=Lax); `maxAge` 0 apaga.
- **Entrada:** `name`, `value` e `maxAge` (segundos).
- **Saída:** Valor do header `Set-Cookie`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pairActionError`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/pair.ts`
- **Assinatura:** `pairActionError(error: unknown): Partial<PairPageView>`
- **Usada por:** `handlePairPost()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Mensagem de erro de uma ação.
- **Entrada:** `error`: qualquer valor lançado.
- **Saída:** `{ error: mensagem }`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/whatsapp/src/snapshots.ts`

### `storedGeneration`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/snapshots.ts`
- **Assinatura:** `storedGeneration(meta: Pick<SnapshotObject, 'customMetadata'> | null): number`
- **Usada por:** `storeSnapshot()`
- **Processos:** P13

<!-- gerado:fim -->

- **Faz:** Lê a geração gravada nos metadados de um objeto; 0 se ausente ou inválida.
- **Entrada:** `meta`: objeto do bucket (ou `null`).
- **Saída:** Geração (inteiro positivo) ou 0.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readUploadHeaders`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/snapshots.ts`
- **Assinatura:** `readUploadHeaders(headers: Headers): { readonly length: number; readonly generation: number } | null`
- **Usada por:** `acceptSnapshotPush()`, `storeSnapshotResponse()`
- **Processos:** P13

<!-- gerado:fim -->

- **Faz:** Lê tamanho e geração dos headers de uma resposta de snapshot; nulo se faltarem ou forem inválidos.
- **Entrada:** `headers`: `content-length` e `x-snapshot-generation`.
- **Saída:** `{ length, generation }` ou `null`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `storeSnapshot`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/snapshots.ts`
- **Assinatura:** `async storeSnapshot(bucket: SnapshotBucket, upload: SnapshotUpload, fixedLength: FixedLength): Promise<SnapshotOutcome>`
- **Usada por:** `acceptSnapshotPush()`, `storeSnapshotResponse()`
- **Processos:** P13

<!-- gerado:fim -->

- **Faz:** Grava o snapshot se a geração for mais nova que a do bucket; senão descarta o fluxo e diz `stale`.
- **Entrada:** `bucket`, `upload` (corpo, tamanho, geração) e `fixedLength`.
- **Saída:** `saved` ou `stale`.
- **Efeitos:** Lê os metadados e grava no R2; cancela o fluxo se velho.
- **Erros:** Repassa a rejeição do R2.

### `storeSnapshotResponse`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/snapshots.ts`
- **Assinatura:** `async storeSnapshotResponse(bucket: SnapshotBucket, res: Response, fixedLength: FixedLength): Promise<SnapshotOutcome>`
- **Usada por:** `snapshotBridge()`
- **Processos:** P13

<!-- gerado:fim -->

- **Faz:** Grava a resposta de `GET /snapshot` da ponte: 204 é `unchanged`; headers inválidos lançam.
- **Entrada:** `bucket`, a resposta da ponte e `fixedLength`.
- **Saída:** `saved`, `unchanged` ou `stale`.
- **Efeitos:** Grava no R2; cancela o corpo se inválido.
- **Erros:** Rejeita com `Error` se a resposta não for 2xx ou os headers forem inválidos.

### `archiveSnapshot`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/snapshots.ts`
- **Assinatura:** `async archiveSnapshot(bucket: SnapshotBucket, now: Date, fixedLength: FixedLength): Promise<boolean>`
- **Usada por:** `resetBridge()`
- **Processos:** P11, P12

<!-- gerado:fim -->

- **Faz:** Tira o snapshot atual do caminho (guarda uma cópia com data) para recomeçar do zero.
- **Entrada:** `bucket`, `now` (data do arquivo) e `fixedLength`.
- **Saída:** `true` se havia snapshot para arquivar.
- **Efeitos:** Lê, copia para `whatsapp/archive/` e apaga no R2.
- **Erros:** Repassa a rejeição do R2.

### `sameSecret`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/snapshots.ts`
- **Assinatura:** `sameSecret(given: string, expected: string): boolean`
- **Usada por:** `acceptSnapshotPush()`
- **Processos:** P13

<!-- gerado:fim -->

- **Faz:** Compara dois textos em tempo constante (para tokens).
- **Entrada:** `given` e `expected`.
- **Saída:** `true` se iguais e `expected` não vazio.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `acceptSnapshotPush`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/snapshots.ts`
- **Assinatura:** `async acceptSnapshotPush(bucket: SnapshotBucket, request: Request, options: { readonly token: string; readonly fixedLength: FixedLength }): Promise<Response>`
- **Usada por:** `connectors/whatsapp/src/container.ts (módulo)`
- **Processos:** P13

<!-- gerado:fim -->

- **Faz:** Recebe o snapshot que a ponte envia sozinha no `SIGTERM` (melhor esforço): confere o token e grava.
- **Entrada:** `bucket`, a requisição PUT e opções (`token`, `fixedLength`).
- **Saída:** JSON `{ outcome }`; 403 sem token válido ou não PUT; 400 sem headers ou corpo.
- **Efeitos:** Grava no R2.
- **Erros:** Repassa a rejeição do R2.

## `connectors/whatsapp/src/tools.ts`

### `toolDeadline`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/tools.ts`
- **Assinatura:** `toolDeadline(ctx: WhatsAppToolContext): number`
- **Usada por:** `connectors/whatsapp/src/tools.ts (módulo)`, `runRead()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Prazo final (ms Unix) de uma chamada que começa agora.
- **Entrada:** `ctx`: contexto das ferramentas.
- **Saída:** `now()` mais `toolTimeoutMs`.
- **Efeitos:** Lê o relógio do contexto.
- **Erros:** Nenhum.

### `syncWaitBudget`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/tools.ts`
- **Assinatura:** `syncWaitBudget(ctx: WhatsAppToolContext, deadline: number): number`
- **Usada por:** `prepareRead()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Quanto pedir à ponte para esperar o sync, sem invadir a folga da consulta.
- **Entrada:** `ctx` e o `deadline` (ms Unix).
- **Saída:** Milissegundos (0 ou mais, até `syncWaitMs`).
- **Efeitos:** Lê o relógio do contexto.
- **Erros:** Nenhum.

### `prepareRead`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/tools.ts`
- **Assinatura:** `async prepareRead(ctx: WhatsAppToolContext, deadline: number): Promise<string | null>`
- **Usada por:** `runRead()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Espera o sync dentro do orçamento; lança se precisa parear e devolve o aviso de resultado parcial.
- **Entrada:** `ctx` e o `deadline` (ms Unix).
- **Saída:** Aviso de resultado parcial ou `null`.
- **Efeitos:** Rede: `POST /sync/wait` na ponte.
- **Erros:** Rejeita se o WhatsApp não está pareado; os de `bridgeJson`.

### `runRead`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/tools.ts`
- **Assinatura:** `async runRead(ctx: WhatsAppToolContext, query: (deadline: number) => Promise<T>): Promise<T | { readonly warning: string; readonly result: T }>`
- **Usada por:** `connectors/whatsapp/src/tools.ts (módulo)`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Roda uma leitura com prazo total: espera o sync, consulta a ponte e junta o aviso (se houver).
- **Entrada:** `ctx` e a consulta (recebe o prazo).
- **Saída:** Resultado da consulta, ou `{ warning, result }`.
- **Efeitos:** Rede: chamadas à ponte.
- **Erros:** Rejeita se o prazo total esgotar; repassa os de `prepareRead` e da consulta.

### `compactContact`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/tools.ts`
- **Assinatura:** `compactContact(contact: Readonly<Record<string, string | null>>): Record<string, unknown>`
- **Usada por:** `connectors/whatsapp/src/tools.ts (módulo)`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Contato compacto, com nomes limpos.
- **Entrada:** `contact`: contato da ponte.
- **Saída:** Objeto com `jid`, `name` e, se houver, `phone`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `mediaResult`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/tools.ts`
- **Assinatura:** `mediaResult(res: Response, bytes: Uint8Array, messageId: string): RawToolResult`
- **Usada por:** `connectors/whatsapp/src/tools.ts (módulo)`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Resultado de `get_media`: uma linha de descrição e o arquivo como bloco MCP.
- **Entrada:** Resposta da ponte (headers), os bytes e o id da mensagem.
- **Saída:** `RawToolResult` com o texto e o bloco binário.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `allowedRecipient`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/tools.ts`
- **Assinatura:** `allowedRecipient(settings: WhatsAppSettings, recipient: string): string`
- **Usada por:** `connectors/whatsapp/src/tools.ts (módulo)`
- **Processos:** P14

<!-- gerado:fim -->

- **Faz:** Confere se o destinatário está na `SEND_ALLOWLIST`; devolve o número normalizado ou lança.
- **Entrada:** `settings` e o destinatário.
- **Saída:** Número normalizado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `Error` se o número for inválido ou estiver fora da allowlist.

### `whatsappTools`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/tools.ts`
- **Assinatura:** `whatsappTools(settings: WhatsAppSettings): ToolSpec<WhatsAppToolContext>[]`
- **Usada por:** `createWhatsAppMcpServer()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Ferramentas ativas: as de leitura e, só com `ENABLE_SEND`, a de envio.
- **Entrada:** `settings`.
- **Saída:** Lista de `ToolSpec`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `createWhatsAppMcpServer`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/tools.ts`
- **Assinatura:** `createWhatsAppMcpServer(ctx: WhatsAppToolContext): McpServer`
- **Usada por:** `whatsappRemoteConnector()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Cria o servidor MCP do WhatsApp com as ferramentas ativas.
- **Entrada:** `ctx`: contexto das ferramentas.
- **Saída:** `McpServer` com instruções e ferramentas registradas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `decodeHeaderText`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/tools.ts`
- **Assinatura:** `decodeHeaderText(value: string | null): string`
- **Usada por:** `mediaResult()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Decodifica um header em UTF-8 percent-encoded (como a ponte manda o nome do arquivo); inválido fica como veio.
- **Entrada:** `value`: valor do header ou nulo.
- **Saída:** Texto decodificado; `""` se nulo/vazio; o valor original se a codificação for inválida.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum (erro de `decodeURIComponent` é capturado).

## `connectors/whatsapp/src/worker-env.ts`

### `bridgeStub`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/worker-env.ts`
- **Assinatura:** `bridgeStub(env: WhatsAppEnv): BridgeStub`
- **Usada por:** `handleWhatsAppFetch()`, `runScheduledSync()`
- **Processos:** P10, P11, P14

<!-- gerado:fim -->

- **Faz:** Devolve o stub da instância única da ponte.
- **Entrada:** `env`: bindings do Worker.
- **Saída:** Stub do Durable Object de nome `BRIDGE_INSTANCE_NAME`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `bridgeFetchFor`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/worker-env.ts`
- **Assinatura:** `bridgeFetchFor(stub: BridgeStub): BridgeFetch`
- **Usada por:** `handleWhatsAppFetch()`, `runScheduledSync()`
- **Processos:** P10, P11, P14

<!-- gerado:fim -->

- **Faz:** Função que fala com a ponte pelo stub, com caminhos relativos (`/status`, `/chats?...`).
- **Entrada:** `stub` do Durable Object.
- **Saída:** `BridgeFetch`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/whatsapp/src/worker.ts`

### `unixNow`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/worker.ts`
- **Assinatura:** `unixNow(): number`
- **Usada por:** `createWhatsAppApps()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Relógio em segundos Unix.
- **Entrada:** Nada.
- **Saída:** Segundos Unix inteiros.
- **Efeitos:** Lê o relógio.
- **Erros:** Nenhum.

### `githubSettingsFrom`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/worker.ts`
- **Assinatura:** `githubSettingsFrom(settings: WhatsAppSettings): GithubLoginSettings`
- **Usada por:** `createWhatsAppApps()`, `whatsappRemoteConnector()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Configuração do login do dono pelo GitHub a partir da configuração do conector.
- **Entrada:** `settings` do conector.
- **Saída:** `GithubLoginSettings` com o `fetch` global.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `whatsappRemoteConnector`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/worker.ts`
- **Assinatura:** `whatsappRemoteConnector(settings: WhatsAppSettings, bridge: BridgeFetch, issuer: string): RemoteConnector`
- **Usada por:** `createWhatsAppApps()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Monta o conector remoto do WhatsApp: login pelo GitHub e servidor MCP ligado à ponte.
- **Entrada:** `settings`, `bridge` e o `issuer`.
- **Saída:** `RemoteConnector`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `createWhatsAppApps`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/worker.ts`
- **Assinatura:** `createWhatsAppApps(vars: EnvVars, bridge: BridgeFetch, origin: string): WhatsAppApps`
- **Usada por:** `handleWhatsAppFetch()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Monta os apps do Worker a partir do ambiente, da ponte e da origem da requisição.
- **Entrada:** `vars`, `bridge` e a origem da requisição.
- **Saída:** `WhatsAppApps` (`remote` e `pair`).
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `Error` se a configuração do ambiente for inválida.

### `handleWhatsAppFetch`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/worker.ts`
- **Assinatura:** `async handleWhatsAppFetch(request: Request, env: WhatsAppEnv): Promise<Response>`
- **Usada por:** `connectors/whatsapp/src/worker.ts (módulo)`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Atende uma requisição: `/pair` primeiro, depois OAuth e `/mcp`; configuração inválida vira 500 explicado.
- **Entrada:** A requisição e o ambiente do Worker.
- **Saída:** Resposta HTTP.
- **Efeitos:** Rede (ponte, GitHub), cookies e o que o handler remoto fizer.
- **Erros:** Nenhum (configuração inválida vira resposta 500).

### `isSyncCronEnabled`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/worker.ts`
- **Assinatura:** `isSyncCronEnabled(vars: EnvVars, cron: string): boolean`
- **Usada por:** `runScheduledSync()`
- **Processos:** P14

<!-- gerado:fim -->

- **Faz:** Diz se o cron que disparou é o sync opcional configurado em `SYNC_CRON`.
- **Entrada:** `vars` e o cron que disparou.
- **Saída:** `true` se `SYNC_CRON` está definido e é igual.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `Error` se a configuração do ambiente for inválida.

### `runScheduledSync`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/whatsapp/src/worker.ts`
- **Assinatura:** `async runScheduledSync(env: WhatsAppEnv, cron: string): Promise<string>`
- **Usada por:** `connectors/whatsapp/src/worker.ts (módulo)`
- **Processos:** P14

<!-- gerado:fim -->

- **Faz:** Sync periódico opcional: acorda a ponte, espera as pendências (até 20 s), guarda o snapshot e deixa dormir.
- **Entrada:** O ambiente do Worker e o cron que disparou.
- **Saída:** `disabled` ou o resultado do snapshot (`saved`, `unchanged`, `stale`, `unknown`).
- **Efeitos:** Rede: `/sync/wait` e `/__snapshot` na ponte (que grava no R2).
- **Erros:** Rejeita se o prazo de 50 s esgotar ou a configuração for inválida.

## `src/remote/github-login.ts`

### `githubAuthorizeUrl`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/github-login.ts`
- **Assinatura:** `githubAuthorizeUrl(settings: GithubLoginSettings, state: string, callbackUrl: string): string`
- **Usada por:** `githubUpstreamLogin()`, `startPairLogin()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Endereço da tela de autorização do GitHub, pedindo só a leitura dos e-mails.
- **Entrada:** `settings`, `state` e `callbackUrl`.
- **Saída:** URL de `github.com/login/oauth/authorize` com escopo `user:email`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `parseEmailList`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/github-login.ts`
- **Assinatura:** `parseEmailList(raw: string | null): string[]`
- **Usada por:** `readAllowedEmails()`
- **Processos:** P10, P14

<!-- gerado:fim -->

- **Faz:** Lê uma lista de e-mails separada por vírgula, em minúsculas e sem vazios.
- **Entrada:** `raw` (pode ser nulo).
- **Saída:** Lista de e-mails (só itens com `@`).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pickAllowedEmail`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/github-login.ts`
- **Assinatura:** `pickAllowedEmail(emails: readonly GithubEmail[], allowed: readonly string[]): string | null`
- **Usada por:** `finishGithubLogin()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Escolhe o primeiro e-mail verificado que está na lista; nulo se nenhum serve.
- **Entrada:** `emails` do GitHub e a lista permitida.
- **Saída:** E-mail em minúsculas ou `null`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `exchangeGithubCode`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/github-login.ts`
- **Assinatura:** `async exchangeGithubCode(settings: GithubLoginSettings, code: string, callbackUrl: string): Promise<string>`
- **Usada por:** `finishGithubLogin()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Troca o código do GitHub por um token de acesso; rejeita com mensagem ao usuário se falhar.
- **Entrada:** `settings`, `code` e `callbackUrl`.
- **Saída:** Token de acesso do GitHub.
- **Efeitos:** Rede: `POST` a `github.com/login/oauth/access_token`.
- **Erros:** Rejeita com `Error` se a resposta não for 2xx ou não trouxer `access_token`.

### `fetchGithubEmails`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/github-login.ts`
- **Assinatura:** `async fetchGithubEmails(settings: GithubLoginSettings, token: string): Promise<GithubEmail[]>`
- **Usada por:** `finishGithubLogin()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Lê os e-mails da conta do GitHub com o token de acesso.
- **Entrada:** `settings` e o token.
- **Saída:** Lista de `GithubEmail` (vazia se o corpo não for lista).
- **Efeitos:** Rede: `GET api.github.com/user/emails`.
- **Erros:** Rejeita com `Error` se o GitHub não responder 2xx.

### `finishGithubLogin`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/github-login.ts`
- **Assinatura:** `async finishGithubLogin(settings: GithubLoginSettings, query: URLSearchParams, callbackUrl: string): Promise<string>`
- **Usada por:** `githubUpstreamLogin()`, `handlePairCallback()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Conclui o login: confere o retorno do GitHub e devolve o e-mail aceito, ou rejeita explicando.
- **Entrada:** `settings`, a query do retorno e `callbackUrl`.
- **Saída:** E-mail aceito, em minúsculas.
- **Efeitos:** Rede: troca do código e leitura dos e-mails no GitHub.
- **Erros:** Rejeita com `Error` se não houver `code`, a troca falhar ou nenhum e-mail verificado estiver na lista.

### `githubUpstreamLogin`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/github-login.ts`
- **Assinatura:** `githubUpstreamLogin(settings: GithubLoginSettings): UpstreamLogin`
- **Usada por:** `whatsappRemoteConnector()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Login do conector remoto pelo GitHub, no formato que o servidor remoto espera.
- **Entrada:** `settings` do login.
- **Saída:** `UpstreamLogin` com `start` e `finish`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## Dados e constantes

| Nome                       | Arquivo                                           | O que é                                                                                                                     |
| -------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `CANVAS_USER_AGENT`        | `connectors/canvas-puc/src/remote.ts`             | User-Agent das chamadas do modo remoto ao Canvas (o Canvas devolve 403 sem User-Agent).                                     |
| `TOKEN_RENEWAL_SECONDS`    | `connectors/canvas-puc/src/remote.ts`             | Quanto cada renovação estende o token do Canvas: 30 dias menos 1 hora (o Canvas recusa mais de 30 dias à frente).           |
| `TEST_EXCEPTIONS`          | `src/test-exceptions.ts`                          | Lista única de funções sem teste automatizado, com motivo e teste manual.                                                   |
| `DEFAULT_DOCS_CONFIG`      | `tools/docs/config.ts`                            | Configuração padrão do `docs:check`; `docs.config.json` sobrescreve.                                                        |
| `MODULE_SCOPE_SUFFIX`      | `tools/docs/ast.ts`                               | Sufixo do rótulo de referência feita fora de função (`arquivo (módulo)`).                                                   |
| `WALK_IGNORED_DIRS`        | `tools/docs/inventory.ts`                         | Pastas puladas ao percorrer o disco sem git.                                                                                |
| `GENERATED_START`          | `tools/docs/markdown.ts`                          | Marcador de início do bloco gerado em FUNCTIONS.md.                                                                         |
| `GENERATED_END`            | `tools/docs/markdown.ts`                          | Marcador de fim do bloco gerado.                                                                                            |
| `INDEX_START`              | `tools/docs/markdown.ts`                          | Marcador de início do índice por módulo.                                                                                    |
| `INDEX_END`                | `tools/docs/markdown.ts`                          | Marcador de fim do índice por módulo.                                                                                       |
| `PLACEHOLDER`              | `tools/docs/markdown.ts`                          | Texto `_preencher_` deixado nos campos manuais novos.                                                                       |
| `MANUAL_FIELDS`            | `tools/docs/render.ts`                            | Ordem fixa dos campos manuais (Faz, Entrada, Saída, Efeitos, Erros).                                                        |
| `HTML_TEXT_REPLACEMENTS`   | `src/core/html.ts`                                | Substituições (regex → texto) aplicadas em ordem por `htmlToText`.                                                          |
| `CFB_SIGNATURE`            | `src/core/cfb.ts`                                 | Os 8 bytes iniciais de todo arquivo OLE/CFB (o contêiner do .doc).                                                          |
| `CP1252_HIGH`              | `src/core/word.ts`                                | Caracteres de 0x80 a 0x9F do Windows-1252, usados ao decodificar o texto de 8 bits do .doc.                                 |
| `WORD_TEXT_REPLACEMENTS`   | `src/core/word.ts`                                | Substituições (regex → texto) aplicadas em ordem por `cleanWordText` às marcas do Word.                                     |
| `MAX_DOWNLOAD_BYTES`       | `connectors/canvas-puc/src/files.ts`              | Maior arquivo que `baixar_arquivo` traz para a conversa (10 MB).                                                            |
| `MAX_TEXT_CHARS`           | `connectors/canvas-puc/src/files.ts`              | Maior texto devolvido por `ler_arquivo_texto` (100 000 caracteres).                                                         |
| `CONNECTORS_DIR`           | `tools/pack/pack.ts`                              | Pasta dos conectores relativa à raiz (`connectors`).                                                                        |
| `PACK_OUT_DIR`             | `tools/pack/pack.ts`                              | Pasta de saída dos pacotes `.mcpb` (`dist/connectors`).                                                                     |
| `RUNTIME_EXTERNALS`        | `tools/pack/pack.ts`                              | Dependências que o esbuild não une e vão para `node_modules` do pacote.                                                     |
| `PLAYWRIGHT_VERSION`       | `connectors/canvas-puc/src/playwright-runtime.ts` | Versão do playwright-core instalada sob demanda; um teste garante que é a mesma do `package.json`.                          |
| `RUNTIME_FILES`            | `tools/pack/pack.ts`                              | Arquivos de runtime de cada conector (manifesto, `package.json`, lockfile e bundle), versionados e copiados para o `.mcpb`. |
| `CONNECTOR_ENTRY`          | `tools/pack/pack.ts`                              | Arquivo de entrada de cada conector (`src/main.ts`).                                                                        |
| `BUNDLE_PATH`              | `tools/pack/pack.ts`                              | Caminho do bundle dentro do pacote (`server/index.js`).                                                                     |
| `LOGIN_TIMEOUT_MS`         | `connectors/canvas-puc/src/browser-login.ts`      | Tempo máximo de espera do login por modo (`silent` 25 s, `window` 5 min).                                                   |
| `BROWSER_CHANNELS`         | `connectors/canvas-puc/src/browser-login.ts`      | Navegadores tentados em ordem no login (`chrome`, `msedge`).                                                                |
| `CANVAS_PAGE_SIZE`         | `connectors/canvas-puc/src/client.ts`             | Itens por página pedidos ao Canvas (`per_page`, máximo da API).                                                             |
| `DEFAULT_MAX_ITEMS`        | `connectors/canvas-puc/src/client.ts`             | Limite padrão de itens somados entre páginas em `getAll`.                                                                   |
| `DEFAULT_CANVAS_URL`       | `connectors/canvas-puc/src/config.ts`             | URL do Canvas da PUC Minas, usada sem `CANVAS_BASE_URL`.                                                                    |
| `DEFAULT_LOGIN_BUTTON`     | `connectors/canvas-puc/src/config.ts`             | Trecho do texto do botão da instituição na tela de login, usado sem `CANVAS_LOGIN_BUTTON`.                                  |
| `MAX_TEXT_LENGTH`          | `connectors/canvas-puc/src/format.ts`             | Tamanho máximo de textos longos devolvidos ao modelo por `shortText`.                                                       |
| `ASSIGNMENT_BUCKETS`       | `connectors/canvas-puc/src/helpers.ts`            | Filtros de `listar_tarefas` → `bucket` da API do Canvas (`todas` não filtra).                                               |
| `CANVAS_READ_TOOLS`        | `connectors/canvas-puc/src/tools-read.ts`         | Ferramentas MCP de leitura do Canvas (cursos, tarefas, notas, avisos etc.).                                                 |
| `CANVAS_WRITE_TOOLS`       | `connectors/canvas-puc/src/tools-write.ts`        | Ferramentas MCP de escrita (entregar tarefa, responder discussão), só com `CANVAS_ALLOW_WRITE`.                             |
| `CANVAS_ACCOUNT_TOOLS`     | `connectors/canvas-puc/src/tools.ts`              | Ferramentas MCP de conexão: `conectar_canvas` e `desconectar_canvas`.                                                       |
| `CANVAS_SERVER_INFO`       | `connectors/canvas-puc/src/tools.ts`              | Nome e versão anunciados pelo servidor MCP do Canvas (stdio e remoto).                                                      |
| `REMOTE_ENTRY`             | `tools/pack/pack.ts`                              | Entrada opcional do servidor remoto de um conector (`src/remote-main.ts`).                                                  |
| `REMOTE_BUNDLE_PATH`       | `tools/pack/pack.ts`                              | Bundle do servidor remoto (`server/remote.js`), usado pelo Dockerfile.                                                      |
| `SEAL_KEY_BYTES`           | `src/remote/seal.ts`                              | Tamanho da `SEAL_KEY` (32 bytes, AES-256).                                                                                  |
| `CLIENT_TTL_SECONDS`       | `src/remote/oauth.ts`                             | Validade do `client_id` registrado (10 anos).                                                                               |
| `PENDING_TTL_SECONDS`      | `src/remote/tokens.ts`                            | Validade do pedido selado no formulário de login (15 minutos).                                                              |
| `CODE_TTL_SECONDS`         | `src/remote/tokens.ts`                            | Validade do código de autorização (5 minutos).                                                                              |
| `ACCESS_TTL_SECONDS`       | `src/remote/tokens.ts`                            | Validade do access token (1 hora).                                                                                          |
| `REFRESH_TTL_SECONDS`      | `src/remote/tokens.ts`                            | Validade do refresh token (30 dias, como o token da PUC).                                                                   |
| `LOGIN_PAGE_CSS`           | `src/remote/login-page.ts`                        | Estilo da página de autorização, com os tokens de `docs/UI.md`.                                                             |
| `CORS_HEADERS`             | `src/remote/handler.ts`                           | Headers CORS dos endpoints remotos (qualquer origem; não há cookies).                                                       |
| `REMOTE_ROUTES`            | `src/remote/handler.ts`                           | Tabela `MÉTODO caminho` → função do servidor remoto.                                                                        |
| `DEFAULT_REDIRECT_HOSTS`   | `src/remote/oauth.ts`                             | Hosts de retorno OAuth aceitos por padrão (`claude.ai`, `claude.com`, `localhost`).                                         |
| `MAX_BODY_BYTES`           | `src/remote/node-server.ts`                       | Maior corpo de requisição aceito pelo servidor remoto (1 MB).                                                               |
| `GITHUB_USER_AGENT`        | `src/remote/github-login.ts`                      | User-Agent das chamadas ao GitHub (a API recusa requisições sem ele e o `fetch` do Workers não manda um).                   |
| `UPSTREAM_CALLBACK_PATH`   | `src/remote/handler.ts`                           | Caminho do retorno do login delegado (`/oauth/callback`), cadastrado no provedor de identidade.                             |
| `BRIDGE_ERROR_MESSAGES`    | `connectors/whatsapp/src/bridge-client.ts`        | Mensagens ao usuário, em português, para os códigos de erro conhecidos da ponte.                                            |
| `WHATSAPP_DEFAULTS`        | `connectors/whatsapp/src/config.ts`               | Padrões do conector: dormir em 5 min, 25 s por ferramenta, 8 s esperando o sync, 10 envios por hora.                        |
| `BRIDGE_ENV_KEYS`          | `connectors/whatsapp/src/config.ts`               | Variáveis repassadas do Worker para o container da ponte (`bridge/API.md`).                                                 |
| `SNAPSHOT_PUSH_URL`        | `connectors/whatsapp/src/config.ts`               | Endereço interno, interceptado pelo Worker, para onde a ponte envia o snapshot no `SIGTERM`.                                |
| `UNTRUSTED_NOTICE`         | `connectors/whatsapp/src/format.ts`               | Aviso de dado de terceiros não confiável que acompanha todo resultado com mensagens ou contatos.                            |
| `HIDDEN_CHAR_RANGES`       | `connectors/whatsapp/src/format.ts`               | Faixas de caracteres invisíveis (controle, largura zero, bidi, BOM) removidas por `sanitizeText`.                           |
| `SNAPSHOT_INTERVAL_MS`     | `connectors/whatsapp/src/lifecycle.ts`            | Intervalo mínimo entre snapshots disparados por uso (1 minuto).                                                             |
| `SNAPSHOT_AFTER_PATHS`     | `connectors/whatsapp/src/lifecycle.ts`            | Rotas da ponte depois das quais o banco pode ter mudado e vale tentar um snapshot.                                          |
| `SEND_HISTORY_KEY`         | `connectors/whatsapp/src/lifecycle.ts`            | Chave, no armazenamento do Durable Object, dos instantes dos envios recentes (limite por hora).                             |
| `PAIR_PAGE_CSS`            | `connectors/whatsapp/src/pair-page.ts`            | Acréscimos de estilo da página `/pair` (código grande, QR, botões secundários e de perigo).                                 |
| `PAIR_SESSION_COOKIE`      | `connectors/whatsapp/src/pair.ts`                 | Nome do cookie (`__Host-`) da sessão selada do `/pair`.                                                                     |
| `PAIR_NONCE_COOKIE`        | `connectors/whatsapp/src/pair.ts`                 | Nome do cookie (`__Host-`) do nonce que amarra o login do `/pair` ao navegador.                                             |
| `PAIR_SESSION_TTL_SECONDS` | `connectors/whatsapp/src/pair.ts`                 | Validade da sessão do `/pair` e do token anti-CSRF (30 minutos).                                                            |
| `PAIR_LOGIN_TTL_SECONDS`   | `connectors/whatsapp/src/pair.ts`                 | Validade do login do `/pair` em andamento (10 minutos).                                                                     |
| `PAIR_CALLBACK_PATH`       | `connectors/whatsapp/src/pair.ts`                 | Caminho do retorno do GitHub para o `/pair` (subcaminho do retorno do OAuth App).                                           |
| `PAIR_ACTIONS`             | `connectors/whatsapp/src/pair.ts`                 | Ações do `/pair` por caminho: código, QR, desvincular e recomeçar do zero.                                                  |
| `SNAPSHOT_KEY_NAME`        | `connectors/whatsapp/src/snapshots.ts`            | Chave do snapshot atual no bucket R2 (`whatsapp/snapshot.was1`).                                                            |
| `WHATSAPP_INSTRUCTIONS`    | `connectors/whatsapp/src/tools.ts`                | Instruções do servidor MCP: o que é o conector e a regra sobre conteúdo não confiável.                                      |
| `READ_TOOLS`               | `connectors/whatsapp/src/tools.ts`                | Ferramentas de leitura (fase 1), sempre ativas.                                                                             |
| `BRIDGE_INSTANCE_NAME`     | `connectors/whatsapp/src/worker-env.ts`           | Nome fixo da única instância do Durable Object da ponte (instância única = sessão única).                                   |
| `WHATSAPP_WORKER_HANDLERS` | `connectors/whatsapp/src/worker.ts`               | Handlers do Worker (`fetch` e `scheduled`), exportados pelo `index.ts` com o Durable Object.                                |
