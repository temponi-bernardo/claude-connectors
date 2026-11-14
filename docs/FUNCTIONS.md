# Funções

Toda função de topo do código aparece aqui, em um modelo fixo. Os campos entre `<!-- gerado:inicio -->` e
`<!-- gerado:fim -->` (Arquivo, Assinatura, Usada por, Processos) são escritos por `npm run docs:generate` a
partir do código — não edite à mão. Os campos **Faz**, **Entrada**, **Saída**, **Efeitos** e **Erros** são
manuais e obrigatórios; `npm run docs:check` falha enquanto houver `_preencher_`.

Modelo e regras de escrita: [DOCUMENTATION.md](DOCUMENTATION.md#função).

## Índice por módulo

<!-- indice:inicio -->

- `connectors/canvas-puc/src/client.ts`: [`unauthorizedMessage`](#unauthorizedmessage), [`sendCanvasRequest`](#sendcanvasrequest), [`requestCanvas`](#requestcanvas), [`collectPages`](#collectpages), [`fetchDownload`](#fetchdownload), [`fetchPlainText`](#fetchplaintext), [`fetchFileBytes`](#fetchfilebytes), [`createCanvasClient`](#createcanvasclient)
- `connectors/canvas-puc/src/files.ts`: [`bytesToBase64`](#bytestobase64), [`fileContentBlock`](#filecontentblock), [`downloadedFileResult`](#downloadedfileresult), [`downloadRefusal`](#downloadrefusal), [`downloadCanvasFile`](#downloadcanvasfile), [`readCanvasFileText`](#readcanvasfiletext)
- `connectors/canvas-puc/src/format.ts`: [`shortText`](#shorttext), [`toProfile`](#toprofile), [`toCourse`](#tocourse), [`toSubmissionFlags`](#tosubmissionflags), [`toPlannerItem`](#toplanneritem), [`toAssignmentSummary`](#toassignmentsummary), [`toRubricCriterion`](#torubriccriterion), [`toFileInfo`](#tofileinfo), [`toSubmissionDetail`](#tosubmissiondetail), [`toAssignmentDetail`](#toassignmentdetail), [`toGradeRow`](#tograderow), [`toEnrollmentGrade`](#toenrollmentgrade), [`toAnnouncement`](#toannouncement), [`toModuleItem`](#tomoduleitem), [`toModule`](#tomodule), [`toDiscussionSummary`](#todiscussionsummary), [`flattenDiscussion`](#flattendiscussion), [`toCalendarEvent`](#tocalendarevent)
- `connectors/canvas-puc/src/helpers.ts`: [`isoDaysFrom`](#isodaysfrom), [`dateOnly`](#dateonly), [`courseContextCodes`](#coursecontextcodes), [`courseNameMap`](#coursenamemap), [`participantNames`](#participantnames), [`isTextFile`](#istextfile), [`matchModuleItems`](#matchmoduleitems), [`activeCourses`](#activecourses), [`fetchOwnSubmission`](#fetchownsubmission), [`getAllOrEmpty`](#getallorempty)
- `connectors/canvas-puc/src/remote-main.ts`: [`startCanvasRemoteServer`](#startcanvasremoteserver)
- `connectors/canvas-puc/src/remote.ts`: [`withCanvasUserAgent`](#withcanvasuseragent), [`readCanvasRemoteSettings`](#readcanvasremotesettings), [`canvasLoginText`](#canvaslogintext), [`verifyCanvasToken`](#verifycanvastoken), [`matchesVisibleToken`](#matchesvisibletoken), [`planTokenRenewal`](#plantokenrenewal), [`canvasTokenApi`](#canvastokenapi), [`renewCanvasToken`](#renewcanvastoken), [`canvasRemoteConnector`](#canvasremoteconnector)
- `connectors/canvas-puc/src/tools-write.ts`: [`submissionPayload`](#submissionpayload)
- `connectors/canvas-puc/src/tools.ts`: [`canvasTools`](#canvastools), [`createCanvasMcpServer`](#createcanvasmcpserver)
- `connectors/canvas-puc/src/worker.ts`: [`createWorkerApp`](#createworkerapp), [`handleWorkerFetch`](#handleworkerfetch)
- `connectors/gmail/src/access-token.ts`: [`forgetAccessToken`](#forgetaccesstoken), [`clearAccessTokenCache`](#clearaccesstokencache), [`linkUrl`](#linkurl), [`relinkError`](#relinkerror), [`requireLinkedAccount`](#requirelinkedaccount), [`renewAccessToken`](#renewaccesstoken), [`getAccessToken`](#getaccesstoken)
- `connectors/gmail/src/attachments.ts`: [`looksLikeText`](#looksliketext), [`detectAttachmentKind`](#detectattachmentkind), [`attachmentBytesToText`](#attachmentbytestotext), [`readAttachmentText`](#readattachmenttext)
- `connectors/gmail/src/config.ts`: [`accountAlias`](#accountalias), [`isEmailAddress`](#isemailaddress), [`parseAllowedEmails`](#parseallowedemails), [`requiredSecret`](#requiredsecret), [`readConsentSecret`](#readconsentsecret), [`readGmailSettings`](#readgmailsettings), [`findAllowedAccount`](#findallowedaccount), [`resolveAccounts`](#resolveaccounts)
- `connectors/gmail/src/gmail-api.ts`: [`gmailUrl`](#gmailurl), [`gmailHttpError`](#gmailhttperror), [`sendGmailGet`](#sendgmailget), [`gmailGet`](#gmailget)
- `connectors/gmail/src/google-oauth.ts`: [`googleRedirectUri`](#googleredirecturi), [`googleAuthorizeUrl`](#googleauthorizeurl), [`randomToken`](#randomtoken), [`parseGoogleTokens`](#parsegoogletokens), [`googleErrorCode`](#googleerrorcode), [`postGoogleToken`](#postgoogletoken), [`exchangeGoogleCode`](#exchangegooglecode), [`refreshGoogleToken`](#refreshgoogletoken)
- `connectors/gmail/src/id-token.ts`: [`decodeJwtJson`](#decodejwtjson), [`decodeJwt`](#decodejwt), [`idTokenProblems`](#idtokenproblems), [`checkIdTokenClaims`](#checkidtokenclaims), [`fetchGoogleKey`](#fetchgooglekey), [`verifyRs256`](#verifyrs256), [`verifyGoogleIdToken`](#verifygoogleidtoken)
- `connectors/gmail/src/link-flow.ts`: [`sha256Hex`](#sha256hex), [`linkRequestKey`](#linkrequestkey), [`readCookie`](#readcookie), [`linkCookie`](#linkcookie), [`startAccountLink`](#startaccountlink), [`takeLinkRequest`](#takelinkrequest), [`accessDeniedPage`](#accessdeniedpage), [`linkRefusal`](#linkrefusal), [`storeLinkedAccount`](#storelinkedaccount), [`linkFromCode`](#linkfromcode), [`linkSafely`](#linksafely), [`finishAccountLink`](#finishaccountlink)
- `connectors/gmail/src/message-format.ts`: [`base64UrlToBytes`](#base64urltobytes), [`partCharset`](#partcharset), [`decodePartBody`](#decodepartbody), [`headerValues`](#headervalues), [`flattenParts`](#flattenparts), [`isBodyPart`](#isbodypart), [`messageBodyText`](#messagebodytext), [`messageAttachments`](#messageattachments), [`truncateText`](#truncatetext), [`internalDateIso`](#internaldateiso), [`pickHeaders`](#pickheaders), [`formatMessage`](#formatmessage), [`perMessageLimit`](#permessagelimit), [`formatThread`](#formatthread), [`summarizeThread`](#summarizethread)
- `connectors/gmail/src/pages.ts`: [`pageDocument`](#pagedocument), [`messagePage`](#messagepage), [`consentPageBody`](#consentpagebody), [`copyConsentHeaders`](#copyconsentheaders), [`consentPage`](#consentpage), [`redirectWith`](#redirectwith)
- `connectors/gmail/src/rate-limit.ts`: [`isRateLimited`](#isratelimited), [`rateLimitedResponse`](#ratelimitedresponse)
- `connectors/gmail/src/search.ts`: [`encodeMultiPageToken`](#encodemultipagetoken), [`decodeMultiPageToken`](#decodemultipagetoken), [`fetchThreadMetadata`](#fetchthreadmetadata), [`searchAccount`](#searchaccount), [`threadDate`](#threaddate), [`sortByDateDesc`](#sortbydatedesc), [`pagesToFetch`](#pagestofetch), [`searchThreads`](#searchthreads)
- `connectors/gmail/src/sign-in.ts`: [`authorizationErrorResponse`](#authorizationerrorresponse), [`beginGoogleSignIn`](#begingooglesignin), [`showAuthorize`](#showauthorize), [`submitAuthorize`](#submitauthorize), [`completeSignIn`](#completesignin), [`finishSignIn`](#finishsignin)
- `connectors/gmail/src/token-store.ts`: [`accountKey`](#accountkey), [`sealLinkedAccount`](#seallinkedaccount), [`openLinkedAccount`](#openlinkedaccount), [`saveLinkedAccount`](#savelinkedaccount), [`loadLinkedAccount`](#loadlinkedaccount)
- `connectors/gmail/src/tools.ts`: [`resolveSingleAccount`](#resolvesingleaccount), [`accountStatus`](#accountstatus), [`withUntrustedNotice`](#withuntrustednotice), [`accountLabels`](#accountlabels)
- `connectors/gmail/src/worker.ts`: [`createGmailDeps`](#creategmaildeps), [`createGmailServer`](#creategmailserver), [`configErrorResponse`](#configerrorresponse), [`handleMcpApi`](#handlemcpapi), [`handleDefaultRequest`](#handledefaultrequest), [`checkClientRegistration`](#checkclientregistration), [`publicOrigin`](#publicorigin), [`createGmailProvider`](#creategmailprovider), [`handleGmailWorkerFetch`](#handlegmailworkerfetch)
- `src/core/bytes.ts`: [`byteView`](#byteview), [`concatBytes`](#concatbytes), [`utf16leToString`](#utf16letostring)
- `src/core/cfb.ts`: [`isCfb`](#iscfb), [`readCfbHeader`](#readcfbheader), [`cfbSector`](#cfbsector), [`sectorWords`](#sectorwords), [`fatSectorIds`](#fatsectorids), [`followChain`](#followchain), [`readRegularChain`](#readregularchain), [`parseDirectory`](#parsedirectory), [`openCfb`](#opencfb), [`readMiniStream`](#readministream), [`readCfbStream`](#readcfbstream)
- `src/core/env.ts`: [`envValue`](#envvalue), [`parseFlag`](#parseflag), [`toEnvVars`](#toenvvars)
- `src/core/html.ts`: [`htmlToText`](#htmltotext)
- `src/core/http.ts`: [`buildUrl`](#buildurl), [`parseNextLink`](#parsenextlink)
- `src/core/pdf.ts`: [`bytesToLatin1`](#bytestolatin1), [`isPdf`](#ispdf), [`streamDataStart`](#streamdatastart), [`trimStreamEol`](#trimstreameol), [`readRawObject`](#readrawobject), [`listRawObjects`](#listrawobjects), [`decodePdfStream`](#decodepdfstream), [`splitObjectStream`](#splitobjectstream), [`storePdfObject`](#storepdfobject), [`readPdfObjects`](#readpdfobjects), [`pdfRefs`](#pdfrefs), [`dictRefs`](#dictrefs), [`collectPdfPages`](#collectpdfpages), [`orderedPages`](#orderedpages), [`utf16beHexToString`](#utf16behextostring), [`readBfChars`](#readbfchars), [`readBfRanges`](#readbfranges), [`rangeTarget`](#rangetarget), [`parseToUnicodeCMap`](#parsetounicodecmap), [`addFontRefs`](#addfontrefs), [`fontResourceRefs`](#fontresourcerefs), [`fontCMaps`](#fontcmaps), [`decodePdfText`](#decodepdftext), [`readLiteralString`](#readliteralstring), [`readEscape`](#readescape), [`readHexString`](#readhexstring), [`skipPdfSpace`](#skippdfspace), [`nextPdfToken`](#nextpdftoken), [`readPdfWord`](#readpdfword), [`wrapString`](#wrapstring), [`classifyWord`](#classifyword), [`showArrayText`](#showarraytext), [`lastOperandText`](#lastoperandtext), [`moveText`](#movetext), [`applyTextOperator`](#applytextoperator), [`feedPdfToken`](#feedpdftoken), [`contentStreamText`](#contentstreamtext), [`tidyPdfText`](#tidypdftext), [`pdfToText`](#pdftotext)
- `src/core/word.ts`: [`docxXmlToText`](#docxxmltotext), [`docxToText`](#docxtotext), [`cp1252ToString`](#cp1252tostring), [`parsePieceTable`](#parsepiecetable), [`pieceText`](#piecetext), [`cleanWordText`](#cleanwordtext), [`docToText`](#doctotext), [`wordKind`](#wordkind), [`wordToText`](#wordtotext)
- `src/core/zip.ts`: [`findEndOfCentralDirectory`](#findendofcentraldirectory), [`listZipEntries`](#listzipentries), [`zipEntryBytes`](#zipentrybytes), [`decompressBytes`](#decompressbytes), [`inflateRaw`](#inflateraw), [`readZipEntry`](#readzipentry)
- `src/mcp/tools.ts`: [`defineTool`](#definetool), [`textResult`](#textresult), [`rawToolResult`](#rawtoolresult), [`toToolResult`](#totoolresult), [`errorResult`](#errorresult), [`runToolSafely`](#runtoolsafely), [`registerToolSpecs`](#registertoolspecs)
- `src/remote/handler.ts`: [`jsonResponse`](#jsonresponse), [`pageSecurityPolicy`](#pagesecuritypolicy), [`htmlResponse`](#htmlresponse), [`readForm`](#readform), [`readJsonBody`](#readjsonbody), [`loginPageFor`](#loginpagefor), [`redirectWithCode`](#redirectwithcode), [`handleRegister`](#handleregister), [`handleAuthorizePage`](#handleauthorizepage), [`handleAuthorizeSubmit`](#handleauthorizesubmit), [`renewSecretQuietly`](#renewsecretquietly), [`handleToken`](#handletoken), [`handleMcp`](#handlemcp), [`withCors`](#withcors), [`routeRemoteRequest`](#routeremoterequest), [`createRemoteHandler`](#createremotehandler)
- `src/remote/login-page.ts`: [`escapeHtml`](#escapehtml), [`renderLoginPage`](#renderloginpage)
- `src/remote/mcp-endpoint.ts`: [`serveMcpRequest`](#servemcprequest), [`mcpUnauthorizedResponse`](#mcpunauthorizedresponse)
- `src/remote/node-server.ts`: [`readPublicUrl`](#readpublicurl), [`readRemoteServerConfig`](#readremoteserverconfig), [`readNodeBody`](#readnodebody), [`toWebRequest`](#towebrequest), [`writeWebResponse`](#writewebresponse), [`serveNodeRequest`](#servenoderequest), [`startRemoteHttpServer`](#startremotehttpserver)
- `src/remote/oauth.ts`: [`readOAuthSettings`](#readoauthsettings), [`oauthError`](#oautherror), [`authorizationServerMetadata`](#authorizationservermetadata), [`protectedResourceMetadata`](#protectedresourcemetadata), [`isAllowedRedirect`](#isallowedredirect), [`pkceChallenge`](#pkcechallenge), [`readRedirectUris`](#readredirecturis), [`registerClient`](#registerclient), [`clientRedirectUris`](#clientredirecturis), [`parseAuthorizeQuery`](#parseauthorizequery), [`readCodeChallenge`](#readcodechallenge)
- `src/remote/seal.ts`: [`parseSealKey`](#parsesealkey), [`sealPayload`](#sealpayload), [`unsealPayload`](#unsealpayload), [`openSealed`](#opensealed)
- `src/remote/tokens.ts`: [`sealAuthorizeRequest`](#sealauthorizerequest), [`openAuthorizeRequest`](#openauthorizerequest), [`issueAuthorizationCode`](#issueauthorizationcode), [`issueTokenSet`](#issuetokenset), [`redeemAuthorizationCode`](#redeemauthorizationcode), [`redeemRefreshToken`](#redeemrefreshtoken), [`redeemTokenRequest`](#redeemtokenrequest), [`readAccessSecret`](#readaccesssecret)
- `tools/bundle/bundle.ts`: [`listConnectors`](#listconnectors), [`mcpServerProblems`](#mcpserverproblems), [`pluginMcpProblems`](#pluginmcpproblems), [`bundleOptions`](#bundleoptions)
- `tools/bundle/cli.ts`: [`buildConnector`](#buildconnector), [`runBuildCli`](#runbuildcli)
- `tools/docs/ast.ts`: [`toPosixRelative`](#toposixrelative), [`globToRegExp`](#globtoregexp), [`isAnalyzedSource`](#isanalyzedsource), [`openProject`](#openproject), [`signatureOf`](#signatureof), [`collectFileFunctions`](#collectfilefunctions), [`collectFunctions`](#collectfunctions), [`isDataDeclaration`](#isdatadeclaration), [`collectFileConstants`](#collectfileconstants), [`collectConstants`](#collectconstants), [`isIgnoredReference`](#isignoredreference), [`ownerLabelOf`](#ownerlabelof), [`findDeclaration`](#finddeclaration), [`buildReferenceIndex`](#buildreferenceindex), [`buildCallGraph`](#buildcallgraph)
- `tools/docs/checks.ts`: [`checkFunctionsDocumented`](#checkfunctionsdocumented), [`checkSectionModules`](#checksectionmodules), [`checkUniqueNames`](#checkuniquenames), [`checkGeneratedBlocks`](#checkgeneratedblocks), [`checkManualFields`](#checkmanualfields), [`checkProcessCitations`](#checkprocesscitations), [`checkStructure`](#checkstructure), [`checkUiComponents`](#checkuicomponents), [`checkTests`](#checktests), [`checkConstants`](#checkconstants), [`runAllChecks`](#runallchecks)
- `tools/docs/cli.ts`: [`runDocsCli`](#rundocscli)
- `tools/docs/config.ts`: [`mergeDocsConfig`](#mergedocsconfig), [`loadDocsConfig`](#loaddocsconfig)
- `tools/docs/inventory.ts`: [`listGitFiles`](#listgitfiles), [`walkFiles`](#walkfiles), [`dirsFromFiles`](#dirsfromfiles), [`listVersionedDirs`](#listversioneddirs), [`readTestFilesText`](#readtestfilestext), [`listUiComponents`](#listuicomponents), [`loadTestExceptions`](#loadtestexceptions), [`buildInventory`](#buildinventory)
- `tools/docs/markdown.ts`: [`firstGroup`](#firstgroup), [`stripCodeBlocks`](#stripcodeblocks), [`extractCalledNames`](#extractcallednames), [`sliceBetween`](#slicebetween), [`replaceBetween`](#replacebetween), [`extractFunctionSections`](#extractfunctionsections), [`buildSection`](#buildsection), [`extractProcessCitations`](#extractprocesscitations), [`extractDocumentedDirs`](#extractdocumenteddirs), [`extractBacktickedNames`](#extractbacktickednames)
- `tools/docs/render.ts`: [`formatList`](#formatlist), [`renderGeneratedBlock`](#rendergeneratedblock), [`renderNewSection`](#rendernewsection), [`renderModuleIndex`](#rendermoduleindex), [`computeGeneratedData`](#computegenerateddata), [`closureOf`](#closureof), [`processesByFunction`](#processesbyfunction), [`replaceSectionBlock`](#replacesectionblock), [`appendSection`](#appendsection), [`insertBeforeDataTable`](#insertbeforedatatable), [`removeSection`](#removesection), [`removeEmptyModules`](#removeemptymodules), [`pruneOrphanSections`](#pruneorphansections), [`applyGenerated`](#applygenerated)
- `tools/docs/run.ts`: [`readOptional`](#readoptional), [`readDocsTexts`](#readdocstexts), [`formatIssues`](#formatissues), [`runCheck`](#runcheck), [`generateFunctionsDoc`](#generatefunctionsdoc), [`runGenerate`](#rungenerate)

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

## `connectors/canvas-puc/src/client.ts`

### `unauthorizedMessage`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/client.ts`
- **Assinatura:** `unauthorizedMessage(baseUrl: string): string`
- **Usada por:** `requestCanvas()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Monta a mensagem de erro para 401: o token venceu ou foi revogado.
- **Entrada:** `baseUrl`: URL base do Canvas (para o link de gerar token).
- **Saída:** Texto pedindo para gerar outro token e reconectar o conector nas configurações do Claude.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `sendCanvasRequest`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/client.ts`
- **Assinatura:** `sendCanvasRequest(deps: ClientDeps, req: CanvasRequest): Promise<Response>`
- **Usada por:** `requestCanvas()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Envia uma requisição à API do Canvas com o token (`Authorization: Bearer`), sem tratar o status.
- **Entrada:** `deps`: URL base, token e `fetchFn`; `req`: método, caminho, parâmetros e corpo opcional.
- **Saída:** Promise com a `Response` crua.
- **Efeitos:** Rede (via `deps.fetchFn`).
- **Erros:** Propaga a rejeição de `fetchFn`.

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
- **Erros:** Propaga erros de `requestCanvas()` e de JSON inválido.

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
- **Usada por:** `canvasRemoteConnector()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Cria o cliente do Canvas usado pelas ferramentas.
- **Entrada:** `deps`: URL base, token e `fetchFn`.
- **Saída:** `CanvasClient` com `get`, `getAll` (página de `CANVAS_PAGE_SIZE`, limite `DEFAULT_MAX_ITEMS`), `post` e `fetchText`.
- **Efeitos:** Nenhum na criação; os métodos fazem rede.
- **Erros:** Nenhum na criação; os métodos propagam erros das requisições.

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

### `requestCanvas`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/client.ts`
- **Assinatura:** `async requestCanvas(deps: ClientDeps, req: CanvasRequest): Promise<Response>`
- **Usada por:** `collectPages()`, `createCanvasClient()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Envia uma requisição à API do Canvas com o token e confere o status.
- **Entrada:** `deps`: URL base, token e `fetchFn`; `req`: método, caminho, parâmetros e corpo opcional.
- **Saída:** Promise com a `Response` 2xx.
- **Efeitos:** Rede (via `deps.fetchFn`).
- **Erros:** Rejeita com `unauthorizedMessage()` em 401 e com "Canvas <status> em <método> <caminho>: <corpo>" em outro status fora de 2xx.

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
- **Usada por:** `canvasRemoteConnector()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Seleciona as ferramentas do Canvas a registrar.
- **Entrada:** `allowWrite`: se as ferramentas de escrita entram.
- **Saída:** `CANVAS_READ_TOOLS`, mais `CANVAS_WRITE_TOOLS` quando `allowWrite` é `true`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `createCanvasMcpServer`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/tools.ts`
- **Assinatura:** `createCanvasMcpServer(specs: readonly ToolSpec<CanvasContext>[], ctx: CanvasContext): McpServer`
- **Usada por:** `canvasRemoteConnector()`
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Cria o `McpServer` do Canvas com as ferramentas ligadas ao contexto.
- **Entrada:** `specs`: ferramentas; `ctx`: cliente e relógio.
- **Saída:** Servidor MCP ainda não conectado.
- **Efeitos:** Nenhum além de criar o objeto.
- **Erros:** Nenhum.

## `src/core/env.ts`

### `envValue`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/env.ts`
- **Assinatura:** `envValue(env: EnvVars, key: string): string | null`
- **Usada por:** `createWorkerApp()`, `publicOrigin()`, `readCanvasRemoteSettings()`, `readGmailSettings()`, `readOAuthSettings()`, `readPublicUrl()`, `readRemoteServerConfig()`, `requiredSecret()`
- **Processos:** P08, P10, P12

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
- **Usada por:** `readCanvasRemoteSettings()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Interpreta uma opção liga/desliga.
- **Entrada:** `value`: texto da opção ou `null`.
- **Saída:** `true` para `1`, `true`, `sim` ou `yes` (sem diferenciar maiúsculas); senão `false`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `toEnvVars`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/env.ts`
- **Assinatura:** `toEnvVars(env: Readonly<Record<string, unknown>>): EnvVars`
- **Usada por:** `createGmailDeps()`, `handleWorkerFetch()`, `publicOrigin()`
- **Processos:** P08, P10, P12

<!-- gerado:fim -->

- **Faz:** Converte o ambiente do Worker em variáveis de texto.
- **Entrada:** `env`: variáveis, secrets e bindings do Worker.
- **Saída:** Só as entradas cujo valor é texto.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `src/core/html.ts`

### `htmlToText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/html.ts`
- **Assinatura:** `htmlToText(html: string | null | undefined): string`
- **Usada por:** `attachmentBytesToText()`, `connectors/canvas-puc/src/tools-read.ts (módulo)`, `docxXmlToText()`, `flattenDiscussion()`, `messageBodyText()`, `readCanvasFileText()`, `shortText()`, `toAssignmentDetail()`
- **Processos:** P03, P12

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
- **Processos:** P03, P08, P09

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
- **Usada por:** `connectors/canvas-puc/src/tools-read.ts (módulo)`, `connectors/canvas-puc/src/tools-write.ts (módulo)`, `connectors/gmail/src/tools.ts (módulo)`
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
- **Processos:** P03, P08, P09, P10, P12

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
- **Processos:** P03, P08, P09, P10, P12

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
- **Processos:** P03, P08, P09, P10, P12

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
- **Usada por:** `createCanvasMcpServer()`, `createGmailServer()`
- **Processos:** P03, P08, P09, P10, P12

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
- **Usada por:** `downloadedFileResult()`
- **Processos:** P03

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
- **Processos:** P03, P08, P09, P10, P12

<!-- gerado:fim -->

- **Faz:** Converte o retorno de uma ferramenta em resultado MCP: o embrulhado por `rawToolResult` passa direto, o resto vira `textResult`.
- **Entrada:** `data`: retorno da ferramenta.
- **Saída:** `CallToolResult`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

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
- **Processos:** P03, P08, P09

<!-- gerado:fim -->

- **Faz:** Monta os textos da página de autorização do Canvas.
- **Entrada:** `baseUrl`: endereço do Canvas.
- **Saída:** `LoginPageText` com a ajuda apontando para `/profile/settings`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `verifyCanvasToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/remote.ts`
- **Assinatura:** `async verifyCanvasToken(settings: CanvasRemoteSettings, token: string): Promise<void>`
- **Usada por:** `canvasRemoteConnector()`
- **Processos:** P03, P08, P09

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
- **Processos:** P03, P08, P09

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
- **Processos:** P03, P08, P09

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
- **Processos:** P03, P08, P09

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
- **Processos:** P03, P08, P09

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
- **Processos:** P03, P08, P09

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
- **Usada por:** `handleRegister()`, `handleToken()`, `src/remote/handler.ts (módulo)`
- **Processos:** P08

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
- **Usada por:** `consentPage()`, `handleAuthorizePage()`, `handleAuthorizeSubmit()`, `loginPageFor()`, `messagePage()`
- **Processos:** P08, P10, P11

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
- **Usada por:** `handleAuthorizeSubmit()`, `handleToken()`, `submitAuthorize()`
- **Processos:** P08, P10

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
- **Processos:** P08

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
- **Usada por:** `handleAuthorizeSubmit()`
- **Processos:** P08

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
- **Processos:** P08

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
- **Processos:** P09

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
- **Processos:** P08

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
- **Processos:** P08

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
- **Usada por:** `handleWorkerFetch()`, `startCanvasRemoteServer()`
- **Processos:** P08

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
- **Processos:** P08, P10, P11

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

## `src/remote/login-page.ts`

### `escapeHtml`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/login-page.ts`
- **Assinatura:** `escapeHtml(value: string): string`
- **Usada por:** `consentPageBody()`, `messagePage()`, `pageDocument()`, `renderLoginPage()`
- **Processos:** P08, P10, P11

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
- **Processos:** P08

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
- **Usada por:** `handleMcp()`, `handleMcpApi()`
- **Processos:** P09, P10, P12

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
- **Processos:** P08, P09

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
- **Processos:** P08

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
- **Usada por:** `checkClientRegistration()`, `registerClient()`
- **Processos:** P08, P10

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
- **Usada por:** `beginGoogleSignIn()`, `redeemAuthorizationCode()`, `startAccountLink()`
- **Processos:** P08, P10, P11

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
- **Usada por:** `checkClientRegistration()`, `clientRedirectUris()`, `registerClient()`
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
- **Processos:** P08

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
- **Processos:** P08

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
- **Processos:** P08

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
- **Usada por:** `createWorkerApp()`, `readRemoteServerConfig()`
- **Processos:** P08

<!-- gerado:fim -->

- **Faz:** Monta a configuração OAuth do ambiente com o emissor dado.
- **Entrada:** `env`: variáveis (`SEAL_KEY`, `OAUTH_REDIRECT_HOSTS`); `issuer`: URL pública.
- **Saída:** `OAuthSettings`; hosts padrão `DEFAULT_REDIRECT_HOSTS` se a variável não vier.
- **Efeitos:** Nenhum (pura).
- **Erros:** Os de `parseSealKey` (chave ausente ou de tamanho errado).

## `src/remote/seal.ts`

### `parseSealKey`

<!-- gerado:inicio -->

- **Arquivo:** `src/remote/seal.ts`
- **Assinatura:** `parseSealKey(raw: string | null, name = 'SEAL_KEY'): Buffer`
- **Usada por:** `readGmailSettings()`, `readOAuthSettings()`
- **Processos:** P08, P10, P12

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
- **Usada por:** `issueAuthorizationCode()`, `issueTokenSet()`, `registerClient()`, `sealAuthorizeRequest()`, `sealLinkedAccount()`, `startAccountLink()`
- **Processos:** P08, P11, P12

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
- **Processos:** P08, P09, P11, P12

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
- **Usada por:** `clientRedirectUris()`, `openAuthorizeRequest()`, `openLinkedAccount()`, `readAccessSecret()`, `redeemAuthorizationCode()`, `redeemRefreshToken()`, `takeLinkRequest()`
- **Processos:** P08, P09, P11, P12

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
- **Usada por:** `loginPageFor()`
- **Processos:** P08

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
- **Usada por:** `handleAuthorizeSubmit()`
- **Processos:** P08

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
- **Usada por:** `handleAuthorizeSubmit()`
- **Processos:** P08

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
- **Processos:** P09

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

### `bytesToBase64`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/canvas-puc/src/files.ts`
- **Assinatura:** `bytesToBase64(bytes: Uint8Array): string`
- **Usada por:** `fileContentBlock()`
- **Processos:** P03

<!-- gerado:fim -->

- **Faz:** Codifica bytes em base64 em blocos de 32 KB, sem `Buffer` (Node e Workers).
- **Entrada:** `bytes`.
- **Saída:** Texto base64.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Usada por:** `decodePartBody()`, `pieceText()`
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Usada por:** `attachmentBytesToText()`, `readCanvasFileText()`
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

<!-- gerado:fim -->

- **Faz:** Recorta os bytes comprimidos de uma entrada, pulando o cabeçalho local.
- **Entrada:** `bytes`: ZIP; `entry`: entrada.
- **Saída:** `Uint8Array` comprimido.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `inflateRaw`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/zip.ts`
- **Assinatura:** `inflateRaw(data: Uint8Array): Promise<Uint8Array>`
- **Usada por:** `readZipEntry()`
- **Processos:** P03, P12

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
- **Processos:** P03, P12

<!-- gerado:fim -->

- **Faz:** Lê e descompacta uma entrada do ZIP pelo nome (métodos 0 e 8).
- **Entrada:** `bytes`: ZIP; `name`: caminho da entrada.
- **Saída:** Promise com os bytes, ou `null` se a entrada não existir.
- **Efeitos:** Nenhum (só CPU).
- **Erros:** Rejeita com "Compressão ZIP não suportada (método N)." para outros métodos.

### `decompressBytes`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/zip.ts`
- **Assinatura:** `async decompressBytes(data: Uint8Array, format: 'deflate' | 'deflate-raw'): Promise<Uint8Array>`
- **Usada por:** `decodePdfStream()`, `inflateRaw()`
- **Processos:** P03, P12

<!-- gerado:fim -->

- **Faz:** Descomprime dados com `DecompressionStream` no formato dado.
- **Entrada:** `data`: bytes comprimidos. `format`: `deflate-raw` (DEFLATE puro) ou `deflate` (com cabeçalho zlib).
- **Saída:** Os bytes descomprimidos.
- **Efeitos:** Nenhum (pura).
- **Erros:** Propaga o erro do `DecompressionStream` se os dados estiverem corrompidos.

## `src/core/bytes.ts`

### `byteView`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/bytes.ts`
- **Assinatura:** `byteView(bytes: Uint8Array): DataView`
- **Usada por:** `docToText()`, `findEndOfCentralDirectory()`, `listZipEntries()`, `parseDirectory()`, `parsePieceTable()`, `readCfbHeader()`, `sectorWords()`, `utf16leToString()`, `zipEntryBytes()`
- **Processos:** P03, P12

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
- **Processos:** P03, P12

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
- **Processos:** P03, P12

<!-- gerado:fim -->

- **Faz:** Decodifica UTF-16LE sem `TextDecoder` (portável para o Workers).
- **Entrada:** `bytes`: texto em UTF-16LE.
- **Saída:** Texto; um byte solto no fim é ignorado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `tools/bundle/bundle.ts`

### `listConnectors`

<!-- gerado:inicio -->

- **Arquivo:** `tools/bundle/bundle.ts`
- **Assinatura:** `listConnectors(rootDir: string): string[]`
- **Usada por:** `runBuildCli()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Lista os conectores com manifesto de plugin (`.claude-plugin/plugin.json`) em `connectors/`.
- **Entrada:** `rootDir`: raiz do repositório.
- **Saída:** Nomes das subpastas em ordem alfabética; vazia se `connectors/` não existe.
- **Efeitos:** Lê o disco.
- **Erros:** Propaga erros de leitura da pasta.

### `bundleOptions`

<!-- gerado:inicio -->

- **Arquivo:** `tools/bundle/bundle.ts`
- **Assinatura:** `bundleOptions(entry: string, outfile: string): BuildOptions`
- **Usada por:** `buildConnector()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Monta as opções do esbuild para unir o servidor remoto num ESM para Node 22.
- **Entrada:** `entry`: arquivo de entrada; `outfile`: arquivo de saída.
- **Saída:** `BuildOptions` com bundle, `node22`, sem dependências externas, e banner que define `require`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `mcpServerProblems`

<!-- gerado:inicio -->

- **Arquivo:** `tools/bundle/bundle.ts`
- **Assinatura:** `mcpServerProblems(name: string, server: unknown): string[]`
- **Usada por:** `pluginMcpProblems()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Confere um servidor do `.mcp.json` do plugin: tem de ser remoto (`type: "http"`, URL `https://`, sem `command`).
- **Entrada:** `name`: nome do servidor; `server`: valor lido do JSON.
- **Saída:** Lista de problemas em português; vazia se o servidor está certo.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pluginMcpProblems`

<!-- gerado:inicio -->

- **Arquivo:** `tools/bundle/bundle.ts`
- **Assinatura:** `pluginMcpProblems(config: unknown): string[]`
- **Usada por:** `buildConnector()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Confere o `.mcp.json` inteiro de um plugin: ao menos um servidor, todos remotos.
- **Entrada:** `config`: conteúdo do `.mcp.json` já lido como JSON.
- **Saída:** Lista de problemas; vazia se a configuração está certa.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `tools/bundle/cli.ts`

### `buildConnector`

<!-- gerado:inicio -->

- **Arquivo:** `tools/bundle/cli.ts`
- **Assinatura:** `async buildConnector(root: string, name: string): Promise<void>`
- **Usada por:** `runBuildCli()`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Valida o `.mcp.json` do conector e gera o bundle `server/remote.js`, se houver `src/remote-main.ts`.
- **Entrada:** `root`: raiz do repositório; `name`: pasta do conector.
- **Saída:** Promise vazia.
- **Efeitos:** Lê o `.mcp.json`; roda o esbuild e grava `server/remote.js`.
- **Erros:** Rejeita listando os problemas de `pluginMcpProblems()`; propaga erros de leitura e do esbuild.

### `runBuildCli`

<!-- gerado:inicio -->

- **Arquivo:** `tools/bundle/cli.ts`
- **Assinatura:** `async runBuildCli(): Promise<void>`
- **Usada por:** `tools/bundle/cli.ts (módulo)`
- **Processos:** P05

<!-- gerado:fim -->

- **Faz:** Ponto de entrada de `npm run build`: faz o build de todos os conectores.
- **Entrada:** Nenhuma.
- **Saída:** Promise vazia; imprime "✔ <conector>" por conector.
- **Efeitos:** Os de `buildConnector()`; escreve no terminal.
- **Erros:** Propaga erros de `buildConnector()`.

## `connectors/gmail/src/access-token.ts`

### `forgetAccessToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/access-token.ts`
- **Assinatura:** `forgetAccessToken(email: string): void`
- **Usada por:** `gmailGet()`, `storeLinkedAccount()`
- **Processos:** P11, P12

<!-- gerado:fim -->

- **Faz:** Esquece o access token guardado de uma conta (ex.: depois de um 401 do Gmail).
- **Entrada:** `email`: e-mail completo da conta, em minúsculas.
- **Saída:** Nada.
- **Efeitos:** Memória do isolate: remove a entrada da conta do cache de access tokens.
- **Erros:** Nenhum.

### `clearAccessTokenCache`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/access-token.ts`
- **Assinatura:** `clearAccessTokenCache(): void`
- **Usada por:** —
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Esquece todos os access tokens guardados.
- **Entrada:** Nenhuma.
- **Saída:** Nada.
- **Efeitos:** Memória do isolate: esvazia o cache de access tokens.
- **Erros:** Nenhum.

### `linkUrl`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/access-token.ts`
- **Assinatura:** `linkUrl(origin: string): string`
- **Usada por:** `accountStatus()`, `relinkError()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Monta o link da página que vincula contas.
- **Entrada:** `origin`: origem pública do Worker, sem barra no fim.
- **Saída:** A URL `<origin>/accounts/link`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `relinkError`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/access-token.ts`
- **Assinatura:** `relinkError(account: AllowedAccount, origin: string, revoked: boolean): Error`
- **Usada por:** `renewAccessToken()`, `requireLinkedAccount()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Cria o erro acionável de conta sem vínculo válido (nunca vinculada ou revogada).
- **Entrada:** `account`: conta permitida. `origin`: origem pública do Worker. `revoked`: verdadeiro se o acesso foi revogado ou expirou; falso se a conta nunca foi vinculada.
- **Saída:** Um `Error` com o apelido da conta, o motivo e o link de vínculo.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum (devolve o erro, não lança).

### `requireLinkedAccount`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/access-token.ts`
- **Assinatura:** `async requireLinkedAccount(deps: GmailDeps, account: AllowedAccount): Promise<LinkedAccount>`
- **Usada por:** `getAccessToken()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê a conta vinculada e ativa do KV.
- **Entrada:** `deps`: dependências do conector (configuração, KV, origem). `account`: conta permitida.
- **Saída:** A conta vinculada com status ativo.
- **Efeitos:** KV: lê o registro selado da conta.
- **Erros:** Lança o erro de `relinkError()` se não houver vínculo válido ou se a conta estiver revogada.

### `renewAccessToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/access-token.ts`
- **Assinatura:** `async renewAccessToken(deps: GmailDeps, account: AllowedAccount, linked: LinkedAccount): Promise<string>`
- **Usada por:** `getAccessToken()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Renova o access token da conta pelo refresh token.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio). `account`: conta permitida. `linked`: conta vinculada com o refresh token.
- **Saída:** O access token novo.
- **Efeitos:** Rede: endpoint de tokens do Google. Memória do isolate: guarda o token no cache até perto de vencer. KV: grava a conta como revogada se o Google responder `invalid_grant`.
- **Erros:** Lança o erro de `relinkError()` (revogada) quando o Google responde `invalid_grant`. Propaga os demais erros de `refreshGoogleToken()`.

### `getAccessToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/access-token.ts`
- **Assinatura:** `async getAccessToken(deps: GmailDeps, account: AllowedAccount): Promise<string>`
- **Usada por:** `accountStatus()`, `gmailGet()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Devolve um access token válido da conta, da memória ou renovado pelo refresh token do KV.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio). `account`: conta permitida.
- **Saída:** O access token válido.
- **Efeitos:** Memória do isolate: lê o cache de access tokens. Quando ele falta ou venceu: KV (lê, e grava se revogada) e rede (endpoint de tokens do Google).
- **Erros:** Propaga os erros de `requireLinkedAccount()` e `renewAccessToken()`.

## `connectors/gmail/src/attachments.ts`

### `looksLikeText`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/attachments.ts`
- **Assinatura:** `looksLikeText(text: string): boolean`
- **Usada por:** `detectAttachmentKind()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Diz se o texto parece texto de verdade (sem caracteres de controle além de espaços e quebras).
- **Entrada:** `text`: texto decodificado; só os primeiros 4096 caracteres são examinados.
- **Saída:** Verdadeiro se a amostra não é vazia e tem menos de 1% de caracteres de controle ou de substituição; falso no resto.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `detectAttachmentKind`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/attachments.ts`
- **Assinatura:** `detectAttachmentKind(bytes: Uint8Array): AttachmentKind`
- **Usada por:** `attachmentBytesToText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Detecta o tipo do anexo pelos primeiros bytes ou pelo conteúdo.
- **Entrada:** `bytes`: conteúdo bruto do anexo.
- **Saída:** `pdf`, `docx`, `doc`, `html` ou `text`; nulo se não for um tipo reconhecido.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `attachmentBytesToText`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/attachments.ts`
- **Assinatura:** `async attachmentBytesToText(bytes: Uint8Array): Promise<string>`
- **Usada por:** `readAttachmentText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Converte os bytes do anexo em texto conforme o tipo detectado.
- **Entrada:** `bytes`: conteúdo bruto do anexo.
- **Saída:** O texto extraído; pode ser vazio (ex.: PDF escaneado).
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança erro se o tipo não for PDF, Word, HTML ou texto. Propaga os erros de `pdfToText()` e `wordToText()`.

### `readAttachmentText`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/attachments.ts`
- **Assinatura:** `async readAttachmentText(deps: GmailDeps, account: AllowedAccount, ids: { readonly messageId: string; readonly attachmentId: string }): Promise<Record<string, unknown>>`
- **Usada por:** `connectors/gmail/src/tools.ts (módulo)`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Baixa um anexo do Gmail como texto limitado.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio). `account`: conta permitida. `ids`: `messageId` da mensagem e `attachmentId` do anexo.
- **Saída:** Objeto com `account`, `message_id`, `size` e `text` (truncado em 50.000 caracteres; aviso de texto não extraível quando vazio).
- **Efeitos:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Erros:** Lança erro se o anexo passar de 5 MB. Propaga os erros de `gmailGet()` e `attachmentBytesToText()`.

## `connectors/gmail/src/config.ts`

### `accountAlias`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/config.ts`
- **Assinatura:** `accountAlias(email: string): string`
- **Usada por:** `parseAllowedEmails()`, `saveLinkedAccount()`
- **Processos:** P10, P11, P12

<!-- gerado:fim -->

- **Faz:** Extrai o apelido de uma conta: a parte antes do `@`, em minúsculas.
- **Entrada:** `email`: e-mail completo; precisa conter `@`.
- **Saída:** O apelido em minúsculas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `isEmailAddress`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/config.ts`
- **Assinatura:** `isEmailAddress(text: string): boolean`
- **Usada por:** `parseAllowedEmails()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Diz se o texto parece um e-mail simples (`nome@dominio.tld`, sem espaços).
- **Entrada:** `text`: texto a conferir.
- **Saída:** Verdadeiro se tem o formato de e-mail; falso no resto.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `parseAllowedEmails`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/config.ts`
- **Assinatura:** `parseAllowedEmails(raw: string | null): AllowedAccount[]`
- **Usada por:** `readGmailSettings()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Lê `ALLOWED_EMAILS` como a lista de contas permitidas.
- **Entrada:** `raw`: e-mails separados por vírgula, ou nulo.
- **Saída:** As contas permitidas, com apelido e e-mail em minúsculas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança erro se a lista estiver vazia, se um item não for e-mail, ou se os apelidos se repetirem ou um deles for `all`.

### `requiredSecret`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/config.ts`
- **Assinatura:** `requiredSecret(env: EnvVars, name: string): string`
- **Usada por:** `readConsentSecret()`, `readGmailSettings()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Lê uma variável obrigatória do Worker.
- **Entrada:** `env`: variáveis de texto do Worker. `name`: nome da variável.
- **Saída:** O valor da variável, sem espaços nas pontas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança erro com o comando `wrangler secret put` se a variável faltar, estiver vazia ou for um placeholder.

### `readConsentSecret`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/config.ts`
- **Assinatura:** `readConsentSecret(env: EnvVars): string`
- **Usada por:** `readGmailSettings()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Lê o segredo do consentimento lembrado com o tamanho mínimo exigido.
- **Entrada:** `env`: variáveis de texto do Worker.
- **Saída:** O valor de `CONSENT_SECRET`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança erro se o segredo tiver menos de 32 caracteres. Propaga o erro de `requiredSecret()`.

### `readGmailSettings`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/config.ts`
- **Assinatura:** `readGmailSettings(env: EnvVars): GmailSettings`
- **Usada por:** `createGmailDeps()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Monta a configuração do conector a partir dos secrets do Worker.
- **Entrada:** `env`: variáveis de texto do Worker.
- **Saída:** A configuração validada: credenciais do cliente Google, chave de selagem, contas permitidas e segredo do consentimento.
- **Efeitos:** Nenhum (pura).
- **Erros:** Propaga os erros de `requiredSecret()`, `parseSealKey()`, `parseAllowedEmails()` e `readConsentSecret()`.

### `findAllowedAccount`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/config.ts`
- **Assinatura:** `findAllowedAccount(accounts: readonly AllowedAccount[], email: string): AllowedAccount | null`
- **Usada por:** `completeSignIn()`, `linkFromCode()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Procura a conta permitida com o e-mail dado, sem diferenciar maiúsculas.
- **Entrada:** `accounts`: contas permitidas. `email`: e-mail a procurar.
- **Saída:** A conta encontrada, ou nulo.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `resolveAccounts`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/config.ts`
- **Assinatura:** `resolveAccounts(accounts: readonly AllowedAccount[], requested: string): AllowedAccount[]`
- **Usada por:** `connectors/gmail/src/tools.ts (módulo)`, `resolveSingleAccount()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Resolve as contas pedidas numa ferramenta pelo apelido ou por `all`.
- **Entrada:** `accounts`: contas permitidas. `requested`: apelido ou `all` (espaços e maiúsculas ignorados).
- **Saída:** Todas as contas para `all`; senão, uma lista com a conta do apelido.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança erro listando os apelidos válidos se o apelido for desconhecido.

## `connectors/gmail/src/gmail-api.ts`

### `gmailUrl`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/gmail-api.ts`
- **Assinatura:** `gmailUrl(path: string, params: Readonly<Record<string, GmailQueryValue>> = {}): string`
- **Usada por:** `accountLabels()`, `connectors/gmail/src/tools.ts (módulo)`, `fetchThreadMetadata()`, `readAttachmentText()`, `searchAccount()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Monta a URL de um caminho da Gmail API com os parâmetros dados.
- **Entrada:** `path`: caminho relativo à base da conta (ex.: `messages/<id>`). `params`: parâmetros opcionais; listas viram o parâmetro repetido.
- **Saída:** A URL completa; parâmetros nulos, indefinidos ou vazios são omitidos.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `gmailHttpError`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/gmail-api.ts`
- **Assinatura:** `gmailHttpError(status: number, account: AllowedAccount): Error`
- **Usada por:** `gmailGet()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Cria o erro acionável para uma resposta de falha da Gmail API.
- **Entrada:** `status`: status HTTP da resposta. `account`: conta consultada.
- **Saída:** Um `Error` com o apelido da conta e a mensagem do status (ou uma genérica com o número do HTTP).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum (devolve o erro, não lança).

### `sendGmailGet`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/gmail-api.ts`
- **Assinatura:** `sendGmailGet(deps: GmailDeps, url: string, token: string): Promise<Response>`
- **Usada por:** `gmailGet()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Envia um GET autenticado à Gmail API com o access token dado.
- **Entrada:** `deps`: dependências do conector (rede). `url`: URL completa da Gmail API. `token`: access token da conta.
- **Saída:** A resposta HTTP, sem conferir o status.
- **Efeitos:** Rede: Gmail API.
- **Erros:** Propaga as falhas de rede de `deps.fetch`.

### `gmailGet`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/gmail-api.ts`
- **Assinatura:** `async gmailGet(deps: GmailDeps, account: AllowedAccount, url: string): Promise<T>`
- **Usada por:** `accountLabels()`, `connectors/gmail/src/tools.ts (módulo)`, `fetchThreadMetadata()`, `readAttachmentText()`, `searchAccount()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê um recurso da Gmail API como JSON, com uma nova tentativa depois de 401.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio). `account`: conta permitida. `url`: URL completa da Gmail API.
- **Saída:** O corpo JSON da resposta.
- **Efeitos:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). Memória do isolate: esquece o access token depois de 401. KV pelo access token.
- **Erros:** Lança o erro de `gmailHttpError()` se a resposta final não for de sucesso. Propaga os erros de `getAccessToken()` e de rede.

## `connectors/gmail/src/google-oauth.ts`

### `googleRedirectUri`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/google-oauth.ts`
- **Assinatura:** `googleRedirectUri(origin: string): string`
- **Usada por:** `beginGoogleSignIn()`, `exchangeGoogleCode()`, `startAccountLink()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Monta o endereço de retorno do Google para a origem do Worker.
- **Entrada:** `origin`: origem pública do Worker, sem barra no fim.
- **Saída:** A URL `<origin>/google/callback`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `googleAuthorizeUrl`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/google-oauth.ts`
- **Assinatura:** `googleAuthorizeUrl(params: GoogleAuthorizeParams): string`
- **Usada por:** `beginGoogleSignIn()`, `startAccountLink()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Monta a URL de autorização do Google.
- **Entrada:** `params`: cliente, endereço de retorno, escopos, `state`, desafio PKCE, `nonce` e `offline` (pede refresh token e novo consentimento).
- **Saída:** A URL de autorização com PKCE S256 e escolha de conta.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `randomToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/google-oauth.ts`
- **Assinatura:** `randomToken(bytes = 32): string`
- **Usada por:** `beginGoogleSignIn()`, `completeSignIn()`, `startAccountLink()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Gera um texto aleatório em base64url (state, nonce, verificador PKCE).
- **Entrada:** `bytes`: bytes de entropia; padrão 32.
- **Saída:** O texto aleatório em base64url.
- **Efeitos:** Lê o gerador aleatório criptográfico.
- **Erros:** Nenhum.

### `parseGoogleTokens`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/google-oauth.ts`
- **Assinatura:** `parseGoogleTokens(body: unknown): GoogleTokens`
- **Usada por:** `postGoogleToken()`
- **Processos:** P10, P11, P12

<!-- gerado:fim -->

- **Faz:** Valida o JSON de sucesso do endpoint de tokens do Google.
- **Entrada:** `body`: corpo JSON da resposta, de qualquer forma.
- **Saída:** Os tokens; `expiresIn` vale 3600 se faltar, refresh token e `id_token` nulos se faltarem, escopo vazio se faltar.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `GoogleTokenError` (`invalid_response`) se faltar o access token.

### `googleErrorCode`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/google-oauth.ts`
- **Assinatura:** `async googleErrorCode(response: Response): Promise<string>`
- **Usada por:** `postGoogleToken()`
- **Processos:** P10, P11, P12

<!-- gerado:fim -->

- **Faz:** Extrai o código de erro OAuth de uma resposta de falha do Google.
- **Entrada:** `response`: resposta HTTP de falha.
- **Saída:** O campo `error` do corpo; `http_<status>` se o corpo não for JSON ou não tiver `error`.
- **Efeitos:** Consome o corpo da resposta.
- **Erros:** Nenhum.

### `postGoogleToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/google-oauth.ts`
- **Assinatura:** `async postGoogleToken(deps: GmailDeps, form: Readonly<Record<string, string>>): Promise<GoogleTokens>`
- **Usada por:** `exchangeGoogleCode()`, `refreshGoogleToken()`
- **Processos:** P10, P11, P12

<!-- gerado:fim -->

- **Faz:** Envia um formulário ao endpoint de tokens do Google com as credenciais do cliente.
- **Entrada:** `deps`: dependências do conector (configuração, rede). `form`: campos do pedido (tipo de concessão e dados dela).
- **Saída:** Os tokens validados.
- **Efeitos:** Rede: endpoint de tokens do Google.
- **Erros:** Lança `GoogleTokenError` com o código do Google se a resposta não for de sucesso. Propaga os erros de `parseGoogleTokens()` e de rede.

### `exchangeGoogleCode`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/google-oauth.ts`
- **Assinatura:** `exchangeGoogleCode(deps: GmailDeps, code: string, verifier: string): Promise<GoogleTokens>`
- **Usada por:** `completeSignIn()`, `linkFromCode()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Troca o código de autorização do Google (com o verificador PKCE) por tokens.
- **Entrada:** `deps`: dependências do conector (configuração, origem, rede). `code`: código recebido no retorno. `verifier`: verificador PKCE da autorização.
- **Saída:** Os tokens validados.
- **Efeitos:** Rede: endpoint de tokens do Google.
- **Erros:** Propaga os erros de `postGoogleToken()`.

### `refreshGoogleToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/google-oauth.ts`
- **Assinatura:** `refreshGoogleToken(deps: GmailDeps, refreshToken: string): Promise<GoogleTokens>`
- **Usada por:** `renewAccessToken()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Renova o access token com o refresh token guardado.
- **Entrada:** `deps`: dependências do conector (configuração, rede). `refreshToken`: refresh token da conta.
- **Saída:** Os tokens validados.
- **Efeitos:** Rede: endpoint de tokens do Google.
- **Erros:** Propaga os erros de `postGoogleToken()` (`invalid_grant` quando o acesso foi revogado).

## `connectors/gmail/src/id-token.ts`

### `decodeJwtJson`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/id-token.ts`
- **Assinatura:** `decodeJwtJson(part: string): Record<string, unknown>`
- **Usada por:** `decodeJwt()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Decodifica um pedaço base64url de JSON em objeto.
- **Entrada:** `part`: cabeçalho ou payload do JWT em base64url.
- **Saída:** O objeto decodificado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança erro se o JSON não for objeto. Propaga o `SyntaxError` de JSON inválido.

### `decodeJwt`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/id-token.ts`
- **Assinatura:** `decodeJwt(token: string): DecodedJwt`
- **Usada por:** `verifyGoogleIdToken()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Separa e decodifica um JWT (`header.payload.assinatura`).
- **Entrada:** `token`: JWT compacto.
- **Saída:** Cabeçalho, payload, texto assinado e bytes da assinatura.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança erro se o token não tiver três partes. Propaga os erros de `decodeJwtJson()`.

### `idTokenProblems`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/id-token.ts`
- **Assinatura:** `idTokenProblems(payload: Readonly<Record<string, unknown>>, expected: IdTokenExpectation): string[]`
- **Usada por:** `checkIdTokenClaims()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Lista as verificações do `id_token` que falharam.
- **Entrada:** `payload`: claims do `id_token`. `expected`: cliente, `nonce` e instante atual em segundos Unix.
- **Saída:** Nomes das verificações que falharam (emissor, audiência, validade, nonce, e-mail verificado); vazio quando todas passam.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `checkIdTokenClaims`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/id-token.ts`
- **Assinatura:** `checkIdTokenClaims(payload: Readonly<Record<string, unknown>>, expected: IdTokenExpectation): string`
- **Usada por:** `verifyGoogleIdToken()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Confere as claims do `id_token` contra o esperado.
- **Entrada:** `payload`: claims do `id_token`. `expected`: cliente, `nonce` e instante atual em segundos Unix.
- **Saída:** O e-mail verificado, em minúsculas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança erro listando as verificações que falharam.

### `fetchGoogleKey`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/id-token.ts`
- **Assinatura:** `async fetchGoogleKey(deps: GmailDeps, kid: string): Promise<webcrypto.JsonWebKey>`
- **Usada por:** `verifyGoogleIdToken()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Busca a chave pública do Google com o `kid` dado.
- **Entrada:** `deps`: dependências do conector (rede). `kid`: identificador da chave no cabeçalho do JWT.
- **Saída:** A chave pública em formato JWK.
- **Efeitos:** Rede: JWKS do Google.
- **Erros:** Lança erro se a resposta não for de sucesso ou se a chave não existir. Propaga as falhas de rede.

### `verifyRs256`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/id-token.ts`
- **Assinatura:** `async verifyRs256(jwt: DecodedJwt, jwk: webcrypto.JsonWebKey): Promise<boolean>`
- **Usada por:** `verifyGoogleIdToken()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Confere a assinatura RS256 do JWT com a chave pública dada.
- **Entrada:** `jwt`: JWT decodificado. `jwk`: chave pública RSA em formato JWK.
- **Saída:** Verdadeiro se a assinatura confere; falso no resto.
- **Efeitos:** Nenhum (pura).
- **Erros:** Propaga o erro de `crypto.subtle.importKey` se a chave for inválida.

### `verifyGoogleIdToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/id-token.ts`
- **Assinatura:** `async verifyGoogleIdToken(deps: GmailDeps, idToken: string, nonce: string): Promise<string>`
- **Usada por:** `completeSignIn()`, `linkFromCode()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Valida o `id_token` do Google (assinatura e claims) para obter o e-mail verificado.
- **Entrada:** `deps`: dependências do conector (configuração, rede, relógio). `idToken`: JWT recebido do Google. `nonce`: nonce enviado na autorização.
- **Saída:** O e-mail verificado, em minúsculas.
- **Efeitos:** Rede: JWKS do Google.
- **Erros:** Lança erro se o algoritmo não for RS256 ou a assinatura não conferir. Propaga os erros de `decodeJwt()`, `fetchGoogleKey()`, `verifyRs256()` e `checkIdTokenClaims()`.

## `connectors/gmail/src/link-flow.ts`

### `sha256Hex`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/link-flow.ts`
- **Assinatura:** `sha256Hex(text: string): string`
- **Usada por:** `linkRequestKey()`, `startAccountLink()`, `takeLinkRequest()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Calcula o SHA-256 de um texto em hexadecimal.
- **Entrada:** `text`: texto a resumir (ex.: `state` ou cookie do vínculo).
- **Saída:** Hash SHA-256 em hexadecimal minúsculo (64 caracteres).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `linkRequestKey`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/link-flow.ts`
- **Assinatura:** `linkRequestKey(state: string): string`
- **Usada por:** `startAccountLink()`, `takeLinkRequest()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Monta a chave do pedido de vínculo no KV.
- **Entrada:** `state`: `state` do vínculo recebido ou gerado.
- **Saída:** Texto `link:<sha256 do state>`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readCookie`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/link-flow.ts`
- **Assinatura:** `readCookie(header: string | null, name: string): string | null`
- **Usada por:** `takeLinkRequest()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Lê o valor de um cookie do header `Cookie`.
- **Entrada:** `header`: valor do header `Cookie`, ou nulo. `name`: nome exato do cookie.
- **Saída:** Valor do cookie (pode conter `=`), ou nulo se o header faltar ou não tiver o cookie.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `linkCookie`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/link-flow.ts`
- **Assinatura:** `linkCookie(value: string | null): string`
- **Usada por:** `finishAccountLink()`, `startAccountLink()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Monta o header `Set-Cookie` do vínculo.
- **Entrada:** `value`: valor do cookie, ou nulo para apagá-lo.
- **Saída:** Texto do `Set-Cookie` de `__Host-gmail-link` (`Secure`, `HttpOnly`, `SameSite=Lax`), com `Max-Age` de 600 s ou 0 quando `value` é nulo.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `startAccountLink`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/link-flow.ts`
- **Assinatura:** `async startAccountLink(deps: GmailDeps): Promise<Response>`
- **Usada por:** `connectors/gmail/src/worker.ts (módulo)`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Inicia o vínculo de uma conta Gmail mandando o navegador ao Google.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio, origem).
- **Saída:** Redirecionamento 302 para o login do Google (`gmail.readonly`, acesso offline, PKCE e `nonce`) com o cookie de vínculo.
- **Efeitos:** Grava no KV o pedido de vínculo selado, com validade de 600 s; define o cookie `__Host-gmail-link`.
- **Erros:** Nenhum próprio; falhas do KV propagam.

### `takeLinkRequest`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/link-flow.ts`
- **Assinatura:** `async takeLinkRequest(deps: GmailDeps, request: Request): Promise<LinkRequest | null>`
- **Usada por:** `finishAccountLink()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Recupera o pedido de vínculo de uso único.
- **Entrada:** `deps`: dependências do conector (configuração, KV, relógio). `request`: volta do Google, com `state` na URL e o cookie de vínculo.
- **Saída:** O pedido (`verifier`, `nonce`, `bindingHash`), ou nulo se não existir, tiver vencido, o selo não abrir ou o cookie não conferir.
- **Efeitos:** Lê e apaga do KV o pedido de vínculo (mesmo quando depois o recusa).
- **Erros:** Nenhum próprio; falhas do KV propagam.

### `accessDeniedPage`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/link-flow.ts`
- **Assinatura:** `accessDeniedPage(): Response`
- **Usada por:** `finishSignIn()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Monta a página de conta Google fora da allowlist.
- **Entrada:** Nenhuma.
- **Saída:** Página HTML 403 "Acesso negado".
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `linkRefusal`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/link-flow.ts`
- **Assinatura:** `linkRefusal(tokens: GoogleTokens): Response | null`
- **Usada por:** `linkFromCode()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Decide se os tokens do Google servem para ler o Gmail.
- **Entrada:** `tokens`: tokens devolvidos pelo Google na troca do código.
- **Saída:** Página 400 se faltar o escopo `gmail.readonly` ou o refresh token; nulo se os tokens servem.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `storeLinkedAccount`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/link-flow.ts`
- **Assinatura:** `async storeLinkedAccount(deps: GmailDeps, email: string, tokens: GoogleTokens): Promise<void>`
- **Usada por:** `linkFromCode()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Grava a conta vinculada com o refresh token selado.
- **Entrada:** `deps`: dependências do conector (configuração, KV, relógio). `email`: e-mail da conta, já na allowlist. `tokens`: tokens do Google com refresh token.
- **Saída:** Nada.
- **Efeitos:** Grava no KV a conta selada com status `active`; descarta da memória o access token antigo dela.
- **Erros:** Nenhum próprio; falhas do KV propagam.

### `linkFromCode`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/link-flow.ts`
- **Assinatura:** `async linkFromCode(deps: GmailDeps, code: string, link: LinkRequest): Promise<Response>`
- **Usada por:** `linkSafely()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Conclui o vínculo a partir do código do Google.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio). `code`: código de autorização do Google. `link`: pedido de vínculo recuperado (verifier e `nonce`).
- **Saída:** Página 200 "Conta vinculada"; 400 sem `id_token`, sem escopo ou sem refresh token; 403 se o e-mail não está na allowlist.
- **Efeitos:** Rede (troca do código no Google, chaves públicas do Google); grava a conta no KV quando permitida.
- **Erros:** Propaga o erro da troca do código (`GoogleTokenError`) e da validação do `id_token` (malformado, assinatura ou claims inválidos, chaves indisponíveis).

### `linkSafely`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/link-flow.ts`
- **Assinatura:** `async linkSafely(deps: GmailDeps, code: string, link: LinkRequest): Promise<Response>`
- **Usada por:** `finishAccountLink()`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Roda `linkFromCode()` convertendo falhas em página de erro.
- **Entrada:** `deps`: dependências do conector. `code`: código do Google. `link`: pedido de vínculo recuperado.
- **Saída:** A página de `linkFromCode()`, ou página 400 com a mensagem do erro.
- **Efeitos:** Os de `linkFromCode()` (rede com o Google; grava a conta no KV quando permitida).
- **Erros:** Nenhum: qualquer falha vira página 400 e nada é gravado.

### `finishAccountLink`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/link-flow.ts`
- **Assinatura:** `async finishAccountLink(deps: GmailDeps, request: Request): Promise<Response>`
- **Usada por:** `connectors/gmail/src/worker.ts (módulo)`
- **Processos:** P11

<!-- gerado:fim -->

- **Faz:** Atende a volta do Google no vínculo de conta.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio). `request`: requisição da volta, com `state`, `code` ou `error` e o cookie de vínculo.
- **Saída:** Página 400 se o pedido expirou ou o Google recusou; senão a página de `linkFromCode`; sempre com o cookie de vínculo apagado.
- **Efeitos:** Lê e apaga o pedido no KV; rede (Google); grava a conta no KV quando permitida; apaga o cookie `__Host-gmail-link`.
- **Erros:** Nenhum: falhas da troca do código ou do `id_token` viram página 400 por `linkSafely()`.

## `connectors/gmail/src/message-format.ts`

### `base64UrlToBytes`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `base64UrlToBytes(data: string): Uint8Array`
- **Usada por:** `decodePartBody()`, `readAttachmentText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Decodifica base64url em bytes.
- **Entrada:** `data`: texto em base64url (corpo ou anexo da Gmail API).
- **Saída:** Bytes decodificados; vazio para texto vazio (caracteres inválidos são ignorados).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `partCharset`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `partCharset(part: GmailPart): string`
- **Usada por:** `decodePartBody()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê o charset declarado no `Content-Type` de uma parte.
- **Entrada:** `part`: parte MIME da Gmail API.
- **Saída:** Charset em minúsculas, ou `utf-8` se não houver.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `decodePartBody`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `decodePartBody(part: GmailPart): string`
- **Usada por:** `messageBodyText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Converte o corpo de uma parte MIME em texto.
- **Entrada:** `part`: parte MIME da Gmail API (corpo em base64url).
- **Saída:** Texto do corpo: Windows-1252 para charsets latinos e `us-ascii`, UTF-8 nos demais; vazio sem corpo.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `headerValues`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `headerValues(headers: readonly { readonly name: string; readonly value: string }[]): Map<string, string>`
- **Usada por:** `partCharset()`, `pickHeaders()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Indexa cabeçalhos pelo nome em minúsculas.
- **Entrada:** `headers`: lista de cabeçalhos `{ name, value }`.
- **Saída:** Mapa nome em minúsculas → valor, com o primeiro de cada nome; vazio para lista vazia.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `flattenParts`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `flattenParts(part: GmailPart | undefined, depth = 0): GmailPart[]`
- **Usada por:** `flattenParts()`, `messageAttachments()`, `messageBodyText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Achata a árvore MIME em profundidade.
- **Entrada:** `part`: raiz da árvore MIME, ou indefinida. `depth`: profundidade atual (padrão 0; acima de 20 para).
- **Saída:** Todas as partes, a raiz primeiro; vazio sem raiz ou além da profundidade 20.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `isBodyPart`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `isBodyPart(part: GmailPart, mimeType: string): boolean`
- **Usada por:** `messageBodyText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Diz se a parte é corpo do tipo dado.
- **Entrada:** `part`: parte MIME. `mimeType`: tipo esperado (ex.: `text/plain`).
- **Saída:** Verdadeiro se o tipo bate, não há nome de arquivo e há dados no corpo.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `messageBodyText`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `messageBodyText(payload: GmailPart | undefined): string`
- **Usada por:** `formatMessage()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Extrai o corpo da mensagem em texto plano.
- **Entrada:** `payload`: raiz MIME da mensagem, ou indefinida.
- **Saída:** Partes `text/plain` unidas; sem elas, as `text/html` convertidas em texto; vazio sem corpo.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `messageAttachments`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `messageAttachments(payload: GmailPart | undefined): AttachmentInfo[]`
- **Usada por:** `formatMessage()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lista os anexos de uma mensagem.
- **Entrada:** `payload`: raiz MIME da mensagem, ou indefinida.
- **Saída:** Anexos (`attachment_id`, `filename`, `mime_type`, `size`) das partes com nome e `attachmentId`; vazio se não houver.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `truncateText`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `truncateText(text: string, max: number): string`
- **Usada por:** `formatMessage()`, `readAttachmentText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Corta um texto no limite de caracteres.
- **Entrada:** `text`: texto a limitar. `max`: maior número de caracteres mantidos.
- **Saída:** O texto intacto se couber; senão os `max` primeiros caracteres e um aviso de quantos ficaram de fora.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `internalDateIso`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `internalDateIso(internalDate: string | undefined): string | null`
- **Usada por:** `formatMessage()`, `summarizeThread()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Converte `internalDate` da Gmail API em data ISO 8601.
- **Entrada:** `internalDate`: milissegundos Unix em texto, ou indefinido.
- **Saída:** Data ISO 8601, ou nulo se vazio ou não numérico.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pickHeaders`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `pickHeaders(payload: GmailPart | undefined): Record<string, string>`
- **Usada por:** `formatMessage()`, `summarizeThread()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Separa os cabeçalhos úteis da mensagem.
- **Entrada:** `payload`: raiz MIME da mensagem, ou indefinida.
- **Saída:** Objeto com `from`, `to`, `cc`, `date` e `subject` presentes; vazio se não houver.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `formatMessage`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `formatMessage(message: GmailMessage, format: MessageFormat, maxChars = MAX_MESSAGE_CHARS): Record<string, unknown>`
- **Usada por:** `connectors/gmail/src/tools.ts (módulo)`, `formatThread()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Converte uma mensagem da Gmail API em objeto enxuto.
- **Entrada:** `message`: mensagem da Gmail API. `format`: `text` (com corpo) ou `minimal`. `maxChars`: limite do corpo (padrão 20.000).
- **Saída:** Ids, data, cabeçalhos, rótulos, resumo e anexos; no formato `text`, também o corpo cortado no limite. Campos ausentes viram nulo ou vazio.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `perMessageLimit`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `perMessageLimit(count: number): number`
- **Usada por:** `formatThread()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Calcula o limite de corpo por mensagem numa conversa.
- **Entrada:** `count`: número de mensagens da conversa (0 conta como 1).
- **Saída:** 60.000 dividido por `count`, entre 2.000 e 20.000 caracteres.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `formatThread`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `formatThread(thread: GmailThread, format: MessageFormat): Record<string, unknown>`
- **Usada por:** `connectors/gmail/src/tools.ts (módulo)`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Converte uma conversa da Gmail API em objeto enxuto.
- **Entrada:** `thread`: conversa da Gmail API. `format`: `text` (com corpos) ou `minimal`.
- **Saída:** `thread_id`, `message_count` e as mensagens formatadas, com o limite de corpo dividido entre elas; lista vazia sem mensagens.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `summarizeThread`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/message-format.ts`
- **Assinatura:** `summarizeThread(thread: GmailThread, account: string): Record<string, unknown>`
- **Usada por:** `searchAccount()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Resume uma conversa para a busca.
- **Entrada:** `thread`: conversa da Gmail API (só cabeçalhos basta). `account`: apelido da conta.
- **Saída:** Conta, `thread_id`, assunto da primeira mensagem, remetente, data, resumo e rótulos da última, e `message_count`; texto vazio ou nulo onde faltar dado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/gmail/src/pages.ts`

### `pageDocument`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/pages.ts`
- **Assinatura:** `pageDocument(title: string, body: string): string`
- **Usada por:** `consentPage()`, `messagePage()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Monta o documento HTML completo de uma página.
- **Entrada:** `title`: título (escapado aqui). `body`: corpo HTML já escapado por quem chama.
- **Saída:** HTML com `lang="pt-BR"`, título e estilo inline.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `messagePage`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/pages.ts`
- **Assinatura:** `messagePage(title: string, message: string, status = 200): Response`
- **Usada por:** `accessDeniedPage()`, `authorizationErrorResponse()`, `finishAccountLink()`, `handleDefaultRequest()`, `linkFromCode()`, `linkRefusal()`, `linkSafely()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Monta uma página simples de aviso.
- **Entrada:** `title`: título em texto. `message`: mensagem em texto. `status`: código HTTP (padrão 200).
- **Saída:** Resposta HTML com o status dado, CSP restritiva e `no-store`; título e mensagem escapados.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `consentPageBody`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/pages.ts`
- **Assinatura:** `consentPageBody(details: ConsentDescription, handle: string): string`
- **Usada por:** `consentPage()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Monta o corpo HTML da página de consentimento.
- **Entrada:** `details`: descrição do cliente OAuth (nome, destino, se é loopback). `handle`: identificador da transação de consentimento.
- **Saída:** HTML com quem pede, para onde vai o acesso, aviso de loopback quando houver e o formulário Permitir/Negar; tudo escapado.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `copyConsentHeaders`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/pages.ts`
- **Assinatura:** `copyConsentHeaders(response: Response, headers: Headers): Response`
- **Usada por:** `consentPage()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Copia para a resposta os headers da transação de consentimento.
- **Entrada:** `response`: resposta da página. `headers`: headers da biblioteca OAuth (cookies e anti-frame).
- **Saída:** A mesma resposta com os cookies acrescentados e os demais headers copiados, exceto `content-type`, CSP e `set-cookie`.
- **Efeitos:** Altera os headers da resposta recebida.
- **Erros:** Nenhum.

### `consentPage`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/pages.ts`
- **Assinatura:** `consentPage(details: ConsentDescription, handle: string, headers: Headers): Response`
- **Usada por:** `showAuthorize()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Monta a página de consentimento do conector.
- **Entrada:** `details`: descrição do cliente OAuth. `handle`: identificador da transação. `headers`: headers da transação de consentimento.
- **Saída:** Página HTML 200 com CSP que só libera o formulário para o Google e a origem do retorno do cliente, mais os headers da transação.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `TypeError` se `details.redirectUri` não for URL válida.

### `redirectWith`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/pages.ts`
- **Assinatura:** `redirectWith(location: string, headers: Headers = new Headers()): Response`
- **Usada por:** `authorizationErrorResponse()`, `beginGoogleSignIn()`, `finishSignIn()`, `startAccountLink()`, `submitAuthorize()`
- **Processos:** P10, P11

<!-- gerado:fim -->

- **Faz:** Monta um redirecionamento 302 com os headers dados.
- **Entrada:** `location`: destino. `headers`: headers a manter, como cookies da transação (padrão vazio).
- **Saída:** Resposta 302 sem corpo, com `Location` e `cache-control: no-store`.
- **Efeitos:** Altera o objeto `headers` recebido.
- **Erros:** Nenhum.

## `connectors/gmail/src/rate-limit.ts`

### `isRateLimited`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/rate-limit.ts`
- **Assinatura:** `async isRateLimited(limiter: RateLimiter | undefined, key: string): Promise<boolean>`
- **Usada por:** `handleMcpApi()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Diz se a sessão passou do limite de requisições.
- **Entrada:** `limiter`: binding de rate limiting do Workers, ou indefinido. `key`: chave da sessão (id da sessão OAuth).
- **Saída:** Verdadeiro se o binding recusou; falso se aceitou ou se não há binding.
- **Efeitos:** Conta a requisição no binding de rate limiting.
- **Erros:** Nenhum próprio; falhas do binding propagam.

### `rateLimitedResponse`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/rate-limit.ts`
- **Assinatura:** `rateLimitedResponse(): Response`
- **Usada por:** `handleMcpApi()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Monta a resposta de excesso de requisições.
- **Entrada:** Nenhuma.
- **Saída:** Resposta 429 em JSON (`rate_limited`) com `Retry-After: 60`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

## `connectors/gmail/src/search.ts`

### `encodeMultiPageToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/search.ts`
- **Assinatura:** `encodeMultiPageToken(tokens: MultiPageToken): string | null`
- **Usada por:** `searchThreads()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Codifica os `page_token` de várias contas num só texto.
- **Entrada:** `tokens`: `page_token` por apelido de conta.
- **Saída:** Base64url do JSON dos tokens, ou nulo se não houver nenhum.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `decodeMultiPageToken`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/search.ts`
- **Assinatura:** `decodeMultiPageToken(token: string): MultiPageToken`
- **Usada por:** `pagesToFetch()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Decodifica o `page_token` de várias contas.
- **Entrada:** `token`: `next_page_token` de uma busca anterior com `all`.
- **Saída:** `page_token` por apelido; entradas que não são texto são descartadas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança erro acionável ("page_token inválido") se o texto não for base64url de um objeto JSON.

### `fetchThreadMetadata`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/search.ts`
- **Assinatura:** `fetchThreadMetadata(deps: GmailDeps, account: AllowedAccount, threadId: string): Promise<GmailThread>`
- **Usada por:** `searchAccount()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê uma conversa só com os cabeçalhos úteis.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio). `account`: conta permitida. `threadId`: id da conversa.
- **Saída:** Conversa da Gmail API em `format=metadata`, com `From`, `To`, `Cc`, `Date` e `Subject`.
- **Efeitos:** Rede (Gmail API e, se preciso, renovação do token no Google); pode marcar a conta como revogada no KV.
- **Erros:** Propaga os erros de `gmailGet`: HTTP da Gmail API, conta sem vínculo ou revogada, falha na renovação do token.

### `searchAccount`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/search.ts`
- **Assinatura:** `async searchAccount(deps: GmailDeps, account: AllowedAccount, request: SearchRequest): Promise<AccountSearchResult>`
- **Usada por:** `searchThreads()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Busca conversas numa conta.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio). `account`: conta permitida. `request`: consulta, máximo de resultados e `page_token`.
- **Saída:** Resumos das conversas encontradas e o próximo `page_token`, ou nulo; lista vazia sem resultados.
- **Efeitos:** Rede (Gmail API, uma leitura por conversa em paralelo, e renovação do token no Google); pode marcar a conta como revogada no KV.
- **Erros:** Propaga os erros de `gmailGet`: HTTP da Gmail API, conta sem vínculo ou revogada, falha na renovação do token.

### `threadDate`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/search.ts`
- **Assinatura:** `threadDate(thread: Readonly<Record<string, unknown>>): string`
- **Usada por:** `sortByDateDesc()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê a data ISO de um resumo de conversa.
- **Entrada:** `thread`: resumo de conversa.
- **Saída:** O campo `date` se for texto; senão texto vazio.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `sortByDateDesc`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/search.ts`
- **Assinatura:** `sortByDateDesc(threads: Record<string, unknown>[]): Record<string, unknown>[]`
- **Usada por:** `searchThreads()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Ordena resumos de conversas da mais recente para a mais antiga.
- **Entrada:** `threads`: resumos de conversas.
- **Saída:** Nova lista ordenada por data decrescente; sem data vão para o fim.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pagesToFetch`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/search.ts`
- **Assinatura:** `pagesToFetch(accounts: readonly AllowedAccount[], pageToken: string | null): [AllowedAccount, string | null][]`
- **Usada por:** `searchThreads()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Decide quais contas consultar e com qual token.
- **Entrada:** `accounts`: contas da busca. `pageToken`: `page_token` de várias contas, ou nulo na primeira página.
- **Saída:** Pares conta → token: todas as contas com nulo na primeira página; senão só as que têm token.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança o erro de `page_token` inválido de `decodeMultiPageToken`.

### `searchThreads`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/search.ts`
- **Assinatura:** `async searchThreads(deps: GmailDeps, accounts: readonly AllowedAccount[], request: SearchRequest): Promise<Record<string, unknown>>`
- **Usada por:** `connectors/gmail/src/tools.ts (módulo)`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Busca conversas em uma ou várias contas.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio). `accounts`: contas resolvidas. `request`: consulta, máximo por conta e `page_token`.
- **Saída:** `threads` (por data decrescente quando há várias contas) e `next_page_token`: o da conta, ou o combinado das contas; nulo quando acabou.
- **Efeitos:** Rede (Gmail API em paralelo por conta e renovação do token no Google); pode marcar contas como revogadas no KV.
- **Erros:** Lança erro de `page_token` inválido; propaga os erros de `gmailGet` de qualquer conta.

## `connectors/gmail/src/sign-in.ts`

### `authorizationErrorResponse`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/sign-in.ts`
- **Assinatura:** `authorizationErrorResponse(error: unknown): Response`
- **Usada por:** `finishSignIn()`, `showAuthorize()`, `submitAuthorize()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Converte um erro de autorização em resposta.
- **Entrada:** `error`: erro capturado no fluxo de autorização.
- **Saída:** Redirecionamento 302 ao cliente se o `AuthorizationError` diz para onde; senão página 400 com a descrição do erro ou mensagem genérica.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `beginGoogleSignIn`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/sign-in.ts`
- **Assinatura:** `async beginGoogleSignIn(deps: GmailDeps, oauth: OAuthHelpers, approved: { readonly request: AuthRequest; readonly headers: Headers }): Promise<Response>`
- **Usada por:** `showAuthorize()`, `submitAuthorize()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Inicia o login do dono no Google.
- **Entrada:** `deps`: dependências do conector (configuração, origem). `oauth`: `OAuthHelpers` da biblioteca. `approved`: pedido de autorização aprovado e headers da transação.
- **Saída:** Redirecionamento 302 ao Google com `openid email`, sem acesso offline, PKCE, `nonce` e os headers da biblioteca.
- **Efeitos:** Guarda o verifier e o `nonce` cifrados pela biblioteca (`beginUpstream`, KV OAUTH_KV); define cookies da transação.
- **Erros:** Propaga os erros de `beginUpstream`.

### `showAuthorize`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/sign-in.ts`
- **Assinatura:** `async showAuthorize(deps: GmailDeps, oauth: OAuthHelpers, request: Request): Promise<Response>`
- **Usada por:** `connectors/gmail/src/worker.ts (módulo)`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Mostra o consentimento do `GET /authorize`.
- **Entrada:** `deps`: dependências do conector (configuração, origem). `oauth`: `OAuthHelpers` da biblioteca. `request`: pedido de autorização do Claude.
- **Saída:** Página de consentimento 200; ou redirecionamento 302 ao Google se o consentimento já foi lembrado.
- **Efeitos:** Lê o pedido e o cliente via `OAuthHelpers` (KV OAUTH_KV); abre a transação de consentimento ou a ida ao Google; define cookies.
- **Erros:** Nenhum: erros de autorização viram página 400 ou redirecionamento.

### `submitAuthorize`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/sign-in.ts`
- **Assinatura:** `async submitAuthorize(deps: GmailDeps, oauth: OAuthHelpers, request: Request): Promise<Response>`
- **Usada por:** `connectors/gmail/src/worker.ts (módulo)`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Atende a decisão do `POST /authorize`.
- **Entrada:** `deps`: dependências do conector (configuração, origem). `oauth`: `OAuthHelpers` da biblioteca. `request`: formulário com `handle` e `decision`.
- **Saída:** Ao aprovar, redirecionamento 302 ao Google; ao negar, 302 de volta ao cliente.
- **Efeitos:** Fecha a transação de consentimento via `OAuthHelpers` (KV OAUTH_KV), lembrando a aprovação por 30 dias; define cookies.
- **Erros:** Nenhum: erros de autorização viram página 400 ou redirecionamento.

### `completeSignIn`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/sign-in.ts`
- **Assinatura:** `async completeSignIn(deps: GmailDeps, oauth: OAuthHelpers, resumed: { readonly request: AuthRequest; readonly data: SignInData; readonly code: string }): Promise<string | null>`
- **Usada por:** `finishSignIn()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Conclui a autorização do Claude a partir do código do Google.
- **Entrada:** `deps`: dependências do conector (configuração, rede, relógio). `oauth`: `OAuthHelpers` da biblioteca. `resumed`: pedido de autorização, verifier e `nonce` guardados e o código do Google.
- **Saída:** Endereço de retorno ao Claude com o código emitido; nulo se o e-mail não está na allowlist.
- **Efeitos:** Rede (troca do código e chaves públicas do Google); grava a concessão com e-mail e id de sessão via `OAuthHelpers` (KV OAUTH_KV).
- **Erros:** Lança erro se o Google não devolver `id_token`; propaga os erros da troca do código, da validação do `id_token` e da biblioteca.

### `finishSignIn`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/sign-in.ts`
- **Assinatura:** `async finishSignIn(deps: GmailDeps, oauth: OAuthHelpers, request: Request): Promise<Response>`
- **Usada por:** `connectors/gmail/src/worker.ts (módulo)`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Atende a volta do Google no login do dono.
- **Entrada:** `deps`: dependências do conector (configuração, rede, relógio). `oauth`: `OAuthHelpers` da biblioteca. `request`: volta do Google com `state` e `code` ou erro.
- **Saída:** Redirecionamento 302 ao Claude com o código; 302 com `access_denied` se o Google recusou; página 403 se o e-mail não está na allowlist.
- **Efeitos:** Lê e consome o `state` via `OAuthHelpers` (KV OAUTH_KV); rede (Google); grava a concessão quando permitida; define cookies.
- **Erros:** Nenhum: erros de autorização, troca do código e `id_token` viram página 400 ou redirecionamento.

## `connectors/gmail/src/token-store.ts`

### `accountKey`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/token-store.ts`
- **Assinatura:** `accountKey(alias: string): string`
- **Usada por:** `loadLinkedAccount()`, `saveLinkedAccount()`
- **Processos:** P11, P12

<!-- gerado:fim -->

- **Faz:** Monta a chave da conta no KV pelo apelido.
- **Entrada:** `alias`: apelido da conta.
- **Saída:** O texto `account:<apelido>`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `sealLinkedAccount`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/token-store.ts`
- **Assinatura:** `sealLinkedAccount(account: LinkedAccount, key: Buffer): string`
- **Usada por:** `saveLinkedAccount()`
- **Processos:** P11, P12

<!-- gerado:fim -->

- **Faz:** Sela uma conta vinculada para gravar no KV.
- **Entrada:** `account`: conta vinculada. `key`: chave AES-256 de 32 bytes (`TOKEN_ENC_KEY`).
- **Saída:** O selo em base64url, com tipo `gmail_account` e validade técnica no ano 2100.
- **Efeitos:** Lê o gerador aleatório criptográfico (vetor de inicialização).
- **Erros:** Propaga o erro da cifra se a chave não tiver 32 bytes.

### `openLinkedAccount`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/token-store.ts`
- **Assinatura:** `openLinkedAccount(sealed: string, key: Buffer, email: string): LinkedAccount | null`
- **Usada por:** `loadLinkedAccount()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Abre o selo de uma conta conferindo o e-mail esperado.
- **Entrada:** `sealed`: selo lido do KV. `key`: chave AES-256 (`TOKEN_ENC_KEY`). `email`: e-mail esperado da conta.
- **Saída:** A conta vinculada; nulo se a chave, o conteúdo ou o e-mail não conferem.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `saveLinkedAccount`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/token-store.ts`
- **Assinatura:** `async saveLinkedAccount(kv: KvStore, key: Buffer, account: LinkedAccount): Promise<void>`
- **Usada por:** `renewAccessToken()`, `storeLinkedAccount()`
- **Processos:** P11, P12

<!-- gerado:fim -->

- **Faz:** Grava a conta vinculada (selada) no KV.
- **Entrada:** `kv`: KV do conector. `key`: chave AES-256 (`TOKEN_ENC_KEY`). `account`: conta vinculada.
- **Saída:** Nada.
- **Efeitos:** KV: grava o selo na chave do apelido da conta.
- **Erros:** Propaga os erros do KV e de `sealLinkedAccount()`.

### `loadLinkedAccount`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/token-store.ts`
- **Assinatura:** `async loadLinkedAccount(kv: KvStore, key: Buffer, account: AllowedAccount): Promise<LinkedAccount | null>`
- **Usada por:** `accountStatus()`, `requireLinkedAccount()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê a conta vinculada do KV.
- **Entrada:** `kv`: KV do conector. `key`: chave AES-256 (`TOKEN_ENC_KEY`). `account`: conta permitida.
- **Saída:** A conta vinculada; nulo se não houver vínculo ou o registro não abrir.
- **Efeitos:** KV: lê o selo da conta.
- **Erros:** Propaga os erros do KV.

## `connectors/gmail/src/tools.ts`

### `resolveSingleAccount`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/tools.ts`
- **Assinatura:** `resolveSingleAccount(deps: GmailDeps, requested: string): AllowedAccount`
- **Usada por:** `connectors/gmail/src/tools.ts (módulo)`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Resolve o parâmetro `account` exigindo uma única conta.
- **Entrada:** `deps`: dependências do conector (configuração). `requested`: apelido pedido pelo modelo.
- **Saída:** A conta permitida correspondente.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança erro se `requested` é `all` ou resulta em mais de uma conta; propaga o erro de conta desconhecida.

### `accountStatus`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/tools.ts`
- **Assinatura:** `async accountStatus(deps: GmailDeps, account: AllowedAccount): Promise<Record<string, unknown>>`
- **Usada por:** `connectors/gmail/src/tools.ts (módulo)`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Monta o status de uma conta para `list_accounts`.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio, origem). `account`: conta permitida.
- **Saída:** Apelido, e-mail, data do vínculo e status: `not_linked` ou `needs_relink` (com `link_url`), `ok` ou `token_error` (com a mensagem).
- **Efeitos:** Lê a conta no KV; rede (renovação do token no Google, se não houver em memória); pode marcar a conta como revogada no KV.
- **Erros:** Nenhum: falhas do token viram `status: token_error`; falhas do KV propagam.

### `withUntrustedNotice`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/tools.ts`
- **Assinatura:** `withUntrustedNotice(data: Record<string, unknown>): Record<string, unknown>`
- **Usada por:** `connectors/gmail/src/tools.ts (módulo)`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Acrescenta o aviso de conteúdo não confiável a um resultado.
- **Entrada:** `data`: resultado com conteúdo de e-mail.
- **Saída:** Novo objeto com `notice` primeiro e os campos de `data`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `accountLabels`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/tools.ts`
- **Assinatura:** `async accountLabels(deps: GmailDeps, account: AllowedAccount): Promise<Record<string, unknown>>`
- **Usada por:** `connectors/gmail/src/tools.ts (módulo)`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lista os rótulos de uma conta.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio). `account`: conta permitida.
- **Saída:** Apelido da conta e rótulos (`id`, `name`, `type`, com `user` por padrão); lista vazia se não houver.
- **Efeitos:** Rede (Gmail API e, se preciso, renovação do token no Google); pode marcar a conta como revogada no KV.
- **Erros:** Propaga os erros de `gmailGet`: HTTP da Gmail API, conta sem vínculo ou revogada, falha na renovação do token.

## `connectors/gmail/src/worker.ts`

### `createGmailDeps`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/worker.ts`
- **Assinatura:** `createGmailDeps(env: GmailWorkerEnv, origin: string): GmailDeps`
- **Usada por:** `handleDefaultRequest()`, `handleMcpApi()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Monta as dependências da requisição a partir do ambiente do Worker.
- **Entrada:** `env`: variáveis, secrets e bindings do Worker. `origin`: origem pública do conector.
- **Saída:** Dependências com configuração lida, KV `GMAIL_KV`, `fetch`, relógio e origem.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança erro se `ALLOWED_EMAILS` faltar ou for inválido, ou se faltar um secret obrigatório.

### `createGmailServer`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/worker.ts`
- **Assinatura:** `createGmailServer(deps: GmailDeps): McpServer`
- **Usada por:** `handleMcpApi()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Cria o servidor MCP com as ferramentas do Gmail.
- **Entrada:** `deps`: dependências do conector (configuração, KV, rede, relógio).
- **Saída:** Servidor MCP `gmail-multi` com instruções e as seis ferramentas registradas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `configErrorResponse`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/worker.ts`
- **Assinatura:** `configErrorResponse(error: unknown): Response`
- **Usada por:** `handleDefaultRequest()`, `handleMcpApi()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Monta a resposta de configuração inválida do Worker.
- **Entrada:** `error`: erro lançado ao ler a configuração.
- **Saída:** Resposta 500 em texto com a mensagem do erro (nunca o valor de um secret).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `handleMcpApi`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/worker.ts`
- **Assinatura:** `async handleMcpApi(request: Request, env: GmailWorkerEnv, ctx: ExecutionContext): Promise<Response>`
- **Usada por:** `createGmailProvider()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Atende o `/mcp` já autenticado pela biblioteca.
- **Entrada:** `request`: requisição MCP. `env`: variáveis, secrets e bindings do Worker. `ctx`: contexto de execução, com `props` da concessão (e-mail e `sid`).
- **Saída:** Resposta do servidor MCP; 429 se a sessão passou do limite; 500 se a configuração é inválida.
- **Efeitos:** Conta a requisição no binding de rate limiting; as ferramentas acessam a rede (Gmail API, Google) e o KV.
- **Erros:** Nenhum: configuração inválida vira 500 e erros das ferramentas viram resultado de erro MCP.

### `handleDefaultRequest`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/worker.ts`
- **Assinatura:** `async handleDefaultRequest(request: Request, env: GmailWorkerEnv): Promise<Response>`
- **Usada por:** `createGmailProvider()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Atende as rotas próprias do conector fora do `/mcp`.
- **Entrada:** `request`: requisição recebida. `env`: variáveis, secrets e bindings do Worker, com `OAUTH_PROVIDER` injetado pela biblioteca.
- **Saída:** 200 `ok` em `GET /`; a resposta da rota encontrada; página 404 se a rota não existe ou falta `OAUTH_PROVIDER`; 500 se a configuração é inválida.
- **Efeitos:** Os da rota atendida: KV, `OAuthHelpers` (KV OAUTH_KV), rede (Google) e cookies.
- **Erros:** Nenhum: configuração inválida vira 500; propaga só os erros não tratados da rota de vínculo (troca do código e `id_token`).

### `checkClientRegistration`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/worker.ts`
- **Assinatura:** `checkClientRegistration(options: ClientRegistrationCallbackOptions): ClientRegistrationCallbackResult | undefined`
- **Usada por:** `createGmailProvider()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Decide se o registro dinâmico de um cliente é aceito.
- **Entrada:** `options`: metadados do cliente que pede registro.
- **Saída:** Indefinido se todos os endereços de retorno são do Claude ou localhost; senão erro `invalid_redirect_uri` com status 400.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `publicOrigin`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/worker.ts`
- **Assinatura:** `publicOrigin(env: GmailWorkerEnv, request: Request): string`
- **Usada por:** `handleDefaultRequest()`, `handleGmailWorkerFetch()`, `handleMcpApi()`
- **Processos:** P10, P12

<!-- gerado:fim -->

- **Faz:** Calcula a origem pública canônica do conector.
- **Entrada:** `env`: variáveis do Worker (`PUBLIC_URL` opcional). `request`: requisição recebida.
- **Saída:** Origem de `PUBLIC_URL` sem barra final; sem ela, a origem da requisição.
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `TypeError` se `PUBLIC_URL` não for URL válida.

### `createGmailProvider`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/worker.ts`
- **Assinatura:** `createGmailProvider(origin: string): OAuthProvider<GmailWorkerEnv>`
- **Usada por:** `handleGmailWorkerFetch()`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Cria o provedor OAuth que embrulha o Worker.
- **Entrada:** `origin`: origem pública do conector.
- **Saída:** `OAuthProvider` com `/mcp` como recurso, endpoints `/authorize`, `/token` e `/register`, TTLs de 1 hora e 30 dias e a checagem de registro.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `handleGmailWorkerFetch`

<!-- gerado:inicio -->

- **Arquivo:** `connectors/gmail/src/worker.ts`
- **Assinatura:** `handleGmailWorkerFetch(request: Request, env: GmailWorkerEnv, ctx: ExecutionContext): Promise<Response>`
- **Usada por:** `connectors/gmail/src/index.ts (módulo)`
- **Processos:** P10

<!-- gerado:fim -->

- **Faz:** Repassa a requisição do Worker ao provedor OAuth da origem pública.
- **Entrada:** `request`: requisição recebida. `env`: variáveis, secrets e bindings do Worker. `ctx`: contexto de execução.
- **Saída:** Resposta do provedor: endpoints OAuth, `/mcp` ou rotas próprias; 401 no `/mcp` sem token válido.
- **Efeitos:** Os da biblioteca OAuth (KV OAUTH_KV) e das rotas atendidas (KV, rede, rate limiting, cookies).
- **Erros:** Lança `TypeError` se `PUBLIC_URL` for inválida; propaga erros não tratados das rotas.

## `src/core/pdf.ts`

### `bytesToLatin1`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `bytesToLatin1(bytes: Uint8Array): string`
- **Usada por:** `fontCMaps()`, `isPdf()`, `listRawObjects()`, `pdfToText()`, `splitObjectStream()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Converte bytes em texto de um caractere por byte (latin1), para achar palavras-chave sem perder offsets.
- **Entrada:** `bytes`: conteúdo binário qualquer.
- **Saída:** Texto com um caractere por byte; vazio se não houver bytes.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `isPdf`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `isPdf(bytes: Uint8Array): boolean`
- **Usada por:** `detectAttachmentKind()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Diz se os bytes começam como um PDF (`%PDF-`).
- **Entrada:** `bytes`: conteúdo do arquivo.
- **Saída:** `true` se os cinco primeiros bytes são `%PDF-`; `false` caso contrário (inclusive arquivo curto).
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `streamDataStart`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `streamDataStart(text: string, keywordAt: number): number`
- **Usada por:** `readRawObject()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Calcula o início dos dados de um fluxo, depois de `stream` e da quebra de linha (CRLF ou LF).
- **Entrada:** `text`: PDF em latin1. `keywordAt`: posição da palavra `stream`.
- **Saída:** Posição do primeiro byte de dados; logo após `stream` se não houver quebra de linha.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `trimStreamEol`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `trimStreamEol(text: string, dataStart: number, streamEnd: number): number`
- **Usada por:** `readRawObject()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Calcula o fim dos dados de um fluxo sem a quebra de linha que precede `endstream`.
- **Entrada:** `text`: PDF em latin1. `dataStart`: início dos dados. `streamEnd`: posição de `endstream`.
- **Saída:** Posição final dos dados, recuada de CRLF, LF ou CR; nunca antes de `dataStart`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readRawObject`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `readRawObject(text: string, bytes: Uint8Array, start: number): { dict: string; stream: Uint8Array | null; end: number }`
- **Usada por:** `listRawObjects()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê o objeto que começa em `start`, logo após `N G obj`.
- **Entrada:** `text`: PDF em latin1. `bytes`: o mesmo PDF em bytes. `start`: posição logo após `N G obj`.
- **Saída:** `{ dict, stream, end }`: dicionário em texto, bytes do fluxo ainda comprimido (`null` se não houver) e onde a busca pelo próximo objeto continua; sem `endobj`, vai até o fim do texto.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `listRawObjects`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `listRawObjects(bytes: Uint8Array): RawPdfObject[]`
- **Usada por:** `readPdfObjects()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lista os objetos `N G obj ... endobj` do arquivo, na ordem em que aparecem.
- **Entrada:** `bytes`: conteúdo do PDF.
- **Saída:** Lista de objetos crus com número, dicionário e fluxo comprimido (`null` sem fluxo); vazia se não houver objetos.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `decodePdfStream`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `async decodePdfStream(dict: string, stream: Uint8Array): Promise<Uint8Array | null>`
- **Usada por:** `readPdfObjects()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Descomprime o fluxo conforme o `/Filter` do dicionário.
- **Entrada:** `dict`: dicionário do objeto. `stream`: bytes do fluxo como estão no arquivo.
- **Saída:** Os próprios bytes sem `/Filter`; os bytes inflados com FlateDecode; `null` para outro filtro ou fluxo corrompido.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum (fluxo corrompido devolve `null`).

### `splitObjectStream`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `splitObjectStream(dict: string, data: Uint8Array): [number, PdfObject][]`
- **Usada por:** `storePdfObject()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Separa os objetos guardados num fluxo de objetos (`/Type /ObjStm`).
- **Entrada:** `dict`: dicionário do fluxo de objetos, com `/First`. `data`: fluxo já descomprimido.
- **Saída:** Pares [número, objeto] com o dicionário de cada objeto e `data` nulo; vazia se faltar `/First`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `storePdfObject`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `storePdfObject(objects: Map<number, PdfObject>, num: number, obj: PdfObject): void`
- **Usada por:** `readPdfObjects()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Guarda um objeto lido e, se ele for um fluxo de objetos, os objetos de dentro sem sobrescrever.
- **Entrada:** `objects`: mapa de objetos em construção. `num`: número do objeto. `obj`: dicionário e fluxo descomprimido.
- **Saída:** Nada.
- **Efeitos:** Altera `objects`.
- **Erros:** Nenhum.

### `readPdfObjects`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `async readPdfObjects(bytes: Uint8Array): Promise<PdfObjects>`
- **Usada por:** `pdfToText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê todos os objetos do PDF, descomprimindo fluxos e abrindo os fluxos de objetos.
- **Entrada:** `bytes`: conteúdo do PDF.
- **Saída:** Mapa número → objeto; fluxo com filtro desconhecido ou corrompido fica com `data` nulo; mapa vazio se não houver objetos.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum (fluxo corrompido fica com `data` nulo).

### `pdfRefs`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `pdfRefs(text: string): number[]`
- **Usada por:** `dictRefs()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lista os números de objeto citados como referência (`N 0 R`) num trecho.
- **Entrada:** `text`: trecho de dicionário do PDF.
- **Saída:** Números dos objetos referenciados, na ordem; vazia se não houver referência.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `dictRefs`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `dictRefs(dict: string, key: string): number[]`
- **Usada por:** `collectPdfPages()`, `fontCMaps()`, `pdfToText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê o valor de uma chave que pode ser referência única ou lista de referências.
- **Entrada:** `dict`: dicionário do objeto. `key`: nome da chave sem a barra (ex.: `Kids`, `Contents`).
- **Saída:** Números dos objetos referenciados; vazia se a chave não existir ou não for referência.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `collectPdfPages`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `collectPdfPages(objects: PdfObjects, num: number, pages: number[]): void`
- **Usada por:** `collectPdfPages()`, `orderedPages()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Acrescenta a `pages` as páginas sob o nó `num` da árvore de páginas, em ordem.
- **Entrada:** `objects`: objetos do PDF. `num`: nó da árvore de páginas. `pages`: lista que recebe as páginas; a descida para em 10 000 páginas.
- **Saída:** Nada.
- **Efeitos:** Altera `pages`.
- **Erros:** Nenhum.

### `orderedPages`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `orderedPages(objects: PdfObjects): number[]`
- **Usada por:** `pdfToText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lista as páginas na ordem de leitura, percorrendo a árvore `/Pages` a partir da raiz.
- **Entrada:** `objects`: objetos do PDF.
- **Saída:** Números dos objetos de página em ordem; vazia se não houver raiz `/Pages`.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `utf16beHexToString`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `utf16beHexToString(hex: string): string`
- **Usada por:** `rangeTarget()`, `readBfChars()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Decodifica hexadecimal UTF-16BE (destino de um mapa ToUnicode) em texto.
- **Entrada:** `hex`: dígitos hexadecimais; dois dígitos valem como um byte.
- **Saída:** O texto decodificado; dígitos que sobram fora de grupos de quatro são ignorados; vazio se `hex` for vazio.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readBfChars`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `readBfChars(text: string, map: Map<number, string>): void`
- **Usada por:** `parseToUnicodeCMap()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê as linhas `<orig> <destino>` dos blocos `beginbfchar` de um mapa ToUnicode.
- **Entrada:** `text`: mapa ToUnicode em texto. `map`: mapa código → texto que recebe as entradas.
- **Saída:** Nada.
- **Efeitos:** Altera `map`.
- **Erros:** Nenhum.

### `readBfRanges`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `readBfRanges(text: string, map: Map<number, string>): void`
- **Usada por:** `parseToUnicodeCMap()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê os blocos `beginbfrange` de um mapa ToUnicode.
- **Entrada:** `text`: mapa ToUnicode em texto. `map`: mapa código → texto que recebe as entradas; cada faixa é limitada a 65 536 códigos.
- **Saída:** Nada.
- **Efeitos:** Altera `map`.
- **Erros:** Nenhum.

### `rangeTarget`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `rangeTarget(targets: readonly string[], offset: number): string`
- **Usada por:** `readBfRanges()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Calcula o destino de um código num `bfrange`.
- **Entrada:** `targets`: destinos em hexadecimal (um inicial ou uma lista). `offset`: distância do código ao início da faixa.
- **Saída:** O item da lista, ou o destino inicial com o último caractere somado ao deslocamento; vazio se o destino for vazio ou faltar.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `parseToUnicodeCMap`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `parseToUnicodeCMap(text: string): PdfCMap`
- **Usada por:** `fontCMaps()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Interpreta um mapa ToUnicode com seus códigos de 1 ou 2 bytes.
- **Entrada:** `text`: mapa ToUnicode em texto.
- **Saída:** `{ map, bytes }`: código → texto e o tamanho do código (2 se o `codespacerange` tiver 4+ dígitos, senão 1); mapa vazio se não houver blocos.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `addFontRefs`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `addFontRefs(fonts: Map<string, number>, text: string): void`
- **Usada por:** `fontResourceRefs()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Acrescenta a `fonts` os pares nome → objeto (`/F1 5 0 R`) de um dicionário de fontes.
- **Entrada:** `fonts`: mapa nome → objeto que recebe os pares. `text`: conteúdo do dicionário de fontes.
- **Saída:** Nada.
- **Efeitos:** Altera `fonts` (não sobrescreve nomes já presentes).
- **Erros:** Nenhum.

### `fontResourceRefs`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `fontResourceRefs(objects: PdfObjects): Map<string, number>`
- **Usada por:** `fontCMaps()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Junta os nomes de fonte (`/F1`) e seus objetos de todos os dicionários `/Font` dos recursos.
- **Entrada:** `objects`: objetos do PDF.
- **Saída:** Mapa nome → número do objeto da fonte; o primeiro encontrado vence; vazio sem fontes.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `fontCMaps`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `fontCMaps(objects: PdfObjects): Map<string, PdfCMap>`
- **Usada por:** `pdfToText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Monta os mapas ToUnicode por nome de fonte, para as fontes que têm `/ToUnicode`.
- **Entrada:** `objects`: objetos do PDF.
- **Saída:** Mapa nome da fonte → mapa ToUnicode; fontes sem `/ToUnicode` legível ficam de fora.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `decodePdfText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `decodePdfText(raw: string, cmap: PdfCMap | undefined): string`
- **Usada por:** `lastOperandText()`, `showArrayText()`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Decodifica os bytes de uma string de texto pela fonte atual (ToUnicode).
- **Entrada:** `raw`: string crua (um caractere por byte). `cmap`: mapa ToUnicode da fonte, ou `undefined`.
- **Saída:** O texto decodificado; sem mapa, a própria string (latin1); códigos sem entrada no mapa somem.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readLiteralString`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `readLiteralString(src: string, start: number): [string, number]`
- **Usada por:** `nextPdfToken()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê uma string literal `( ... )` a partir do `(`.
- **Entrada:** `src`: fluxo de conteúdo. `start`: posição do `(`.
- **Saída:** [texto cru com escapes resolvidos, posição seguinte]; sem `)` de fechamento, vai até o fim.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readEscape`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `readEscape(src: string, pos: number): [string, number]`
- **Usada por:** `readLiteralString()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê o escape que vem depois de `\` numa string literal.
- **Entrada:** `src`: fluxo de conteúdo. `pos`: posição logo após a `\`.
- **Saída:** [texto do escape, posição seguinte]: octal de até 3 dígitos, letra conhecida, vazio para quebra de linha ou o próprio caractere.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `readHexString`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `readHexString(src: string, start: number): [string, number]`
- **Usada por:** `nextPdfToken()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê uma string hexadecimal `<...>` a partir do `<`.
- **Entrada:** `src`: fluxo de conteúdo. `start`: posição do `<`.
- **Saída:** [texto cru, posição seguinte]; ignora não-hexadecimais e completa dígito ímpar com 0; sem `>`, vai até o fim.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `skipPdfSpace`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `skipPdfSpace(src: string, pos: number): number`
- **Usada por:** `nextPdfToken()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Acha a posição do próximo caractere que não é espaço, a partir de `pos`.
- **Entrada:** `src`: fluxo de conteúdo. `pos`: posição inicial.
- **Saída:** A posição do próximo caractere não branco, ou o fim do texto.
- **Efeitos:** Altera o `lastIndex` da regex do módulo `PDF_SPACE`.
- **Erros:** Nenhum.

### `nextPdfToken`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `nextPdfToken(src: string, pos: number): [PdfToken, number] | null`
- **Usada por:** `contentStreamText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê o próximo item do fluxo de conteúdo a partir de `pos`.
- **Entrada:** `src`: fluxo de conteúdo. `pos`: posição inicial.
- **Saída:** [item, posição seguinte]; `null` no fim do texto.
- **Efeitos:** Altera o `lastIndex` das regex do módulo `PDF_SPACE` e `PDF_WORD`.
- **Erros:** Nenhum.

### `readPdfWord`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `readPdfWord(src: string, at: number): [PdfToken, number]`
- **Usada por:** `nextPdfToken()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Lê uma palavra (nome, número, operador, `<<`/`>>` ou comentário) a partir de `at`.
- **Entrada:** `src`: fluxo de conteúdo. `at`: posição de um caractere não branco.
- **Saída:** [item classificado, posição seguinte].
- **Efeitos:** Altera o `lastIndex` da regex do módulo `PDF_WORD`.
- **Erros:** Nenhum.

### `wrapString`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `wrapString([value, next]: [string, number]): [PdfToken, number]`
- **Usada por:** `nextPdfToken()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Embrulha o resultado de uma leitura de string num item `string`.
- **Entrada:** `[value, next]`: texto lido e posição seguinte.
- **Saída:** [item `string` com o texto, posição seguinte].
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `classifyWord`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `classifyWord(word: string): PdfToken`
- **Usada por:** `readPdfWord()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Classifica uma palavra do fluxo como nome (`/F1`), número ou operador.
- **Entrada:** `word`: palavra lida do fluxo.
- **Saída:** Item `name` sem a barra, `number` com o valor, ou `op` com a palavra.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `showArrayText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `showArrayText(items: readonly PdfToken[], font: PdfCMap | undefined): string`
- **Usada por:** `src/core/pdf.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Monta o texto de um operando de `TJ`, com espaços onde o ajuste é grande.
- **Entrada:** `items`: itens da lista do `TJ`. `font`: mapa ToUnicode da fonte atual, ou `undefined`.
- **Saída:** Strings decodificadas, com espaço para ajuste menor que `TJ_SPACE_THRESHOLD`; vazio se não houver strings.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `lastOperandText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `lastOperandText(state: PdfTextState): string`
- **Usada por:** `src/core/pdf.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Decodifica o texto da última string dos operandos pela fonte atual.
- **Entrada:** `state`: estado do intérprete de texto.
- **Saída:** O texto decodificado; vazio se o último operando não for string ou não houver operandos.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `moveText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `moveText(state: PdfTextState): string`
- **Usada por:** `src/core/pdf.ts (módulo)`
- **Processos:** —

<!-- gerado:fim -->

- **Faz:** Decide o que um `Td`/`TD` produz no texto.
- **Entrada:** `state`: estado do intérprete, com os operandos do operador.
- **Saída:** Quebra de linha se o último operando (ty) for número diferente de zero; senão um espaço.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `applyTextOperator`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `applyTextOperator(state: PdfTextState, op: string, cmaps: ReadonlyMap<string, PdfCMap>): void`
- **Usada por:** `feedPdfToken()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Aplica um operador de texto ao estado do intérprete.
- **Entrada:** `state`: estado do intérprete. `op`: nome do operador. `cmaps`: mapas ToUnicode por nome de fonte.
- **Saída:** Nada.
- **Efeitos:** Altera `state` (troca a fonte em `Tf` ou acrescenta texto em `out`); operador desconhecido não muda nada.
- **Erros:** Nenhum.

### `feedPdfToken`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `feedPdfToken(state: PdfTextState, token: PdfToken, cmaps: ReadonlyMap<string, PdfCMap>): void`
- **Usada por:** `contentStreamText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Consome um item no intérprete de texto.
- **Entrada:** `state`: estado do intérprete. `token`: item lido do fluxo. `cmaps`: mapas ToUnicode por nome de fonte.
- **Saída:** Nada.
- **Efeitos:** Altera `state` (lista aberta, operandos e texto produzido).
- **Erros:** Nenhum.

### `contentStreamText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `contentStreamText(content: string, cmaps: ReadonlyMap<string, PdfCMap>): string`
- **Usada por:** `pdfToText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Extrai o texto de um fluxo de conteúdo de página.
- **Entrada:** `content`: fluxo de conteúdo em latin1. `cmaps`: mapas ToUnicode por nome de fonte.
- **Saída:** O texto produzido pelos operadores de texto; vazio se não houver nenhum.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `tidyPdfText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `tidyPdfText(text: string): string`
- **Usada por:** `pdfToText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Limpa o texto extraído de espaços repetidos, linhas em branco em excesso e pontas.
- **Entrada:** `text`: texto extraído do PDF.
- **Saída:** O texto com espaços colapsados, no máximo uma linha em branco seguida e sem espaços nas pontas.
- **Efeitos:** Nenhum (pura).
- **Erros:** Nenhum.

### `pdfToText`

<!-- gerado:inicio -->

- **Arquivo:** `src/core/pdf.ts`
- **Assinatura:** `async pdfToText(bytes: Uint8Array): Promise<string>`
- **Usada por:** `attachmentBytesToText()`
- **Processos:** P12

<!-- gerado:fim -->

- **Faz:** Extrai o texto de um PDF, página por página.
- **Entrada:** `bytes`: conteúdo do PDF.
- **Saída:** O texto das páginas separado por linha em branco e limpo; vazio se não houver texto legível (ex.: PDF só de imagens).
- **Efeitos:** Nenhum (pura).
- **Erros:** Lança `Error` se o PDF for cifrado (`/Encrypt` nos últimos 4 KB).

## Dados e constantes

| Nome                        | Arquivo                                    | O que é                                                                                                           |
| --------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `CANVAS_USER_AGENT`         | `connectors/canvas-puc/src/remote.ts`      | User-Agent das chamadas do modo remoto ao Canvas (o Canvas devolve 403 sem User-Agent).                           |
| `TOKEN_RENEWAL_SECONDS`     | `connectors/canvas-puc/src/remote.ts`      | Quanto cada renovação estende o token do Canvas: 30 dias menos 1 hora (o Canvas recusa mais de 30 dias à frente). |
| `TEST_EXCEPTIONS`           | `src/test-exceptions.ts`                   | Lista única de funções sem teste automatizado, com motivo e teste manual.                                         |
| `DEFAULT_DOCS_CONFIG`       | `tools/docs/config.ts`                     | Configuração padrão do `docs:check`; `docs.config.json` sobrescreve.                                              |
| `MODULE_SCOPE_SUFFIX`       | `tools/docs/ast.ts`                        | Sufixo do rótulo de referência feita fora de função (`arquivo (módulo)`).                                         |
| `WALK_IGNORED_DIRS`         | `tools/docs/inventory.ts`                  | Pastas puladas ao percorrer o disco sem git.                                                                      |
| `GENERATED_START`           | `tools/docs/markdown.ts`                   | Marcador de início do bloco gerado em FUNCTIONS.md.                                                               |
| `GENERATED_END`             | `tools/docs/markdown.ts`                   | Marcador de fim do bloco gerado.                                                                                  |
| `INDEX_START`               | `tools/docs/markdown.ts`                   | Marcador de início do índice por módulo.                                                                          |
| `INDEX_END`                 | `tools/docs/markdown.ts`                   | Marcador de fim do índice por módulo.                                                                             |
| `PLACEHOLDER`               | `tools/docs/markdown.ts`                   | Texto `_preencher_` deixado nos campos manuais novos.                                                             |
| `MANUAL_FIELDS`             | `tools/docs/render.ts`                     | Ordem fixa dos campos manuais (Faz, Entrada, Saída, Efeitos, Erros).                                              |
| `HTML_TEXT_REPLACEMENTS`    | `src/core/html.ts`                         | Substituições (regex → texto) aplicadas em ordem por `htmlToText`.                                                |
| `CFB_SIGNATURE`             | `src/core/cfb.ts`                          | Os 8 bytes iniciais de todo arquivo OLE/CFB (o contêiner do .doc).                                                |
| `CP1252_HIGH`               | `src/core/word.ts`                         | Caracteres de 0x80 a 0x9F do Windows-1252, usados ao decodificar o texto de 8 bits do .doc.                       |
| `WORD_TEXT_REPLACEMENTS`    | `src/core/word.ts`                         | Substituições (regex → texto) aplicadas em ordem por `cleanWordText` às marcas do Word.                           |
| `MAX_DOWNLOAD_BYTES`        | `connectors/canvas-puc/src/files.ts`       | Maior arquivo que `baixar_arquivo` traz para a conversa (10 MB).                                                  |
| `MAX_TEXT_CHARS`            | `connectors/canvas-puc/src/files.ts`       | Maior texto devolvido por `ler_arquivo_texto` (100 000 caracteres).                                               |
| `CONNECTORS_DIR`            | `tools/bundle/bundle.ts`                   | Pasta dos conectores relativa à raiz (`connectors`).                                                              |
| `PLUGIN_MANIFEST_PATH`      | `tools/bundle/bundle.ts`                   | Manifesto do plugin em cada conector (`.claude-plugin/plugin.json`); marca a pasta como conector.                 |
| `PLUGIN_MCP_CONFIG_PATH`    | `tools/bundle/bundle.ts`                   | Configuração MCP do plugin (`.mcp.json`), com a URL do servidor remoto.                                           |
| `CANVAS_PAGE_SIZE`          | `connectors/canvas-puc/src/client.ts`      | Itens por página pedidos ao Canvas (`per_page`, máximo da API).                                                   |
| `DEFAULT_MAX_ITEMS`         | `connectors/canvas-puc/src/client.ts`      | Limite padrão de itens somados entre páginas em `getAll`.                                                         |
| `DEFAULT_CANVAS_URL`        | `connectors/canvas-puc/src/remote.ts`      | URL do Canvas da PUC Minas, usada sem `CANVAS_BASE_URL`.                                                          |
| `MAX_TEXT_LENGTH`           | `connectors/canvas-puc/src/format.ts`      | Tamanho máximo de textos longos devolvidos ao modelo por `shortText`.                                             |
| `ASSIGNMENT_BUCKETS`        | `connectors/canvas-puc/src/helpers.ts`     | Filtros de `listar_tarefas` → `bucket` da API do Canvas (`todas` não filtra).                                     |
| `CANVAS_READ_TOOLS`         | `connectors/canvas-puc/src/tools-read.ts`  | Ferramentas MCP de leitura do Canvas (cursos, tarefas, notas, avisos etc.).                                       |
| `CANVAS_WRITE_TOOLS`        | `connectors/canvas-puc/src/tools-write.ts` | Ferramentas MCP de escrita (entregar tarefa, responder discussão), só com `CANVAS_ALLOW_WRITE`.                   |
| `CANVAS_SERVER_INFO`        | `connectors/canvas-puc/src/tools.ts`       | Nome e versão anunciados pelo servidor MCP do Canvas.                                                             |
| `REMOTE_ENTRY`              | `tools/bundle/bundle.ts`                   | Entrada do servidor remoto em Node de um conector (`src/remote-main.ts`).                                         |
| `REMOTE_BUNDLE_PATH`        | `tools/bundle/bundle.ts`                   | Bundle do servidor remoto (`server/remote.js`), usado pelo Dockerfile.                                            |
| `SEAL_KEY_BYTES`            | `src/remote/seal.ts`                       | Tamanho da `SEAL_KEY` (32 bytes, AES-256).                                                                        |
| `CLIENT_TTL_SECONDS`        | `src/remote/oauth.ts`                      | Validade do `client_id` registrado (10 anos).                                                                     |
| `PENDING_TTL_SECONDS`       | `src/remote/tokens.ts`                     | Validade do pedido selado no formulário de login (15 minutos).                                                    |
| `CODE_TTL_SECONDS`          | `src/remote/tokens.ts`                     | Validade do código de autorização (5 minutos).                                                                    |
| `ACCESS_TTL_SECONDS`        | `src/remote/tokens.ts`                     | Validade do access token (1 hora).                                                                                |
| `REFRESH_TTL_SECONDS`       | `src/remote/tokens.ts`                     | Validade do refresh token (30 dias, como o token da PUC).                                                         |
| `LOGIN_PAGE_CSS`            | `src/remote/login-page.ts`                 | Estilo da página de autorização, com os tokens de `docs/UI.md`.                                                   |
| `CORS_HEADERS`              | `src/remote/handler.ts`                    | Headers CORS dos endpoints remotos (qualquer origem; não há cookies).                                             |
| `REMOTE_ROUTES`             | `src/remote/handler.ts`                    | Tabela `MÉTODO caminho` → função do servidor remoto.                                                              |
| `DEFAULT_REDIRECT_HOSTS`    | `src/remote/oauth.ts`                      | Hosts de retorno OAuth aceitos por padrão (`claude.ai`, `claude.com`, `localhost`).                               |
| `MAX_BODY_BYTES`            | `src/remote/node-server.ts`                | Maior corpo de requisição aceito pelo servidor remoto (1 MB).                                                     |
| `PDF_ESCAPES`               | `src/core/pdf.ts`                          | Escapes de letra das strings literais do PDF (`\n`, `\t`...).                                                     |
| `TJ_SPACE_THRESHOLD`        | `src/core/pdf.ts`                          | Ajuste do `TJ` a partir do qual conta como espaço entre palavras.                                                 |
| `PDF_TEXT_OPERATORS`        | `src/core/pdf.ts`                          | Operador de texto do PDF → texto que ele produz.                                                                  |
| `ACCESS_TOKEN_MARGIN_MS`    | `connectors/gmail/src/access-token.ts`     | Margem antes do vencimento em que o access token do Google é renovado.                                            |
| `MAX_ATTACHMENT_BYTES`      | `connectors/gmail/src/attachments.ts`      | Maior anexo lido como texto (5 MB).                                                                               |
| `MAX_ATTACHMENT_CHARS`      | `connectors/gmail/src/attachments.ts`      | Maior texto devolvido de um anexo.                                                                                |
| `GMAIL_READONLY_SCOPE`      | `connectors/gmail/src/config.ts`           | Escopo `gmail.readonly`, o único escopo de dados pedido.                                                          |
| `GMAIL_LINK_SCOPES`         | `connectors/gmail/src/config.ts`           | Escopos do vínculo de conta (`openid email` + Gmail só leitura).                                                  |
| `SIGN_IN_SCOPES`            | `connectors/gmail/src/config.ts`           | Escopos do login do dono (`openid email`).                                                                        |
| `MIN_CONSENT_SECRET_CHARS`  | `connectors/gmail/src/config.ts`           | Tamanho mínimo de `CONSENT_SECRET`.                                                                               |
| `UPSTREAM_USER_AGENT`       | `connectors/gmail/src/context.ts`          | User-Agent enviado ao Google e à Gmail API.                                                                       |
| `GMAIL_API_BASE`            | `connectors/gmail/src/gmail-api.ts`        | Base da Gmail API para a conta do token.                                                                          |
| `GMAIL_STATUS_MESSAGES`     | `connectors/gmail/src/gmail-api.ts`        | Mensagem acionável por status HTTP da Gmail API.                                                                  |
| `GOOGLE_AUTHORIZE_URL`      | `connectors/gmail/src/google-oauth.ts`     | Endpoint de autorização do Google.                                                                                |
| `GOOGLE_TOKEN_URL`          | `connectors/gmail/src/google-oauth.ts`     | Endpoint de tokens do Google.                                                                                     |
| `GOOGLE_CALLBACK_PATH`      | `connectors/gmail/src/google-oauth.ts`     | Caminho do retorno do Google (`/google/callback`).                                                                |
| `GOOGLE_JWKS_URL`           | `connectors/gmail/src/id-token.ts`         | Chaves públicas que assinam os `id_token` do Google.                                                              |
| `GOOGLE_ISSUERS`            | `connectors/gmail/src/id-token.ts`         | Emissores aceitos no `id_token`.                                                                                  |
| `CLOCK_SKEW_SECONDS`        | `connectors/gmail/src/id-token.ts`         | Folga de relógio aceita na validade do `id_token`.                                                                |
| `LINK_STATE_PREFIX`         | `connectors/gmail/src/link-flow.ts`        | Prefixo do `state` do vínculo de conta (`link.`).                                                                 |
| `LINK_COOKIE`               | `connectors/gmail/src/link-flow.ts`        | Cookie `__Host-` que prende o vínculo ao navegador.                                                               |
| `LINK_TTL_SECONDS`          | `connectors/gmail/src/link-flow.ts`        | Validade do pedido de vínculo (10 minutos).                                                                       |
| `LINK_REQUEST_TYP`          | `connectors/gmail/src/link-flow.ts`        | Tipo do selo do pedido de vínculo.                                                                                |
| `MAX_MESSAGE_CHARS`         | `connectors/gmail/src/message-format.ts`   | Maior corpo de mensagem devolvido.                                                                                |
| `MAX_THREAD_CHARS`          | `connectors/gmail/src/message-format.ts`   | Maior soma dos corpos de uma conversa.                                                                            |
| `MIN_MESSAGE_CHARS`         | `connectors/gmail/src/message-format.ts`   | Menor fatia por mensagem numa conversa longa.                                                                     |
| `MESSAGE_HEADERS`           | `connectors/gmail/src/message-format.ts`   | Cabeçalhos devolvidos de cada mensagem.                                                                           |
| `UNTRUSTED_NOTICE`          | `connectors/gmail/src/message-format.ts`   | Aviso de conteúdo de e-mail não confiável (prompt injection).                                                     |
| `GOOGLE_ACCOUNTS_ORIGIN`    | `connectors/gmail/src/pages.ts`            | Origem do Google liberada no `form-action` do consentimento.                                                      |
| `RATE_LIMIT_RETRY_SECONDS`  | `connectors/gmail/src/rate-limit.ts`       | Segundos do `Retry-After` na resposta 429.                                                                        |
| `LINKED_ACCOUNT_TYP`        | `connectors/gmail/src/token-store.ts`      | Tipo do selo da conta vinculada.                                                                                  |
| `LINKED_ACCOUNT_EXP`        | `connectors/gmail/src/token-store.ts`      | Validade técnica do selo da conta (ano 2100).                                                                     |
| `GMAIL_ID`                  | `connectors/gmail/src/tools.ts`            | Esquema zod de id da Gmail API (só caracteres seguros na URL).                                                    |
| `listAccountsTool`          | `connectors/gmail/src/tools.ts`            | Ferramenta `list_accounts`.                                                                                       |
| `searchThreadsTool`         | `connectors/gmail/src/tools.ts`            | Ferramenta `search_threads`.                                                                                      |
| `getThreadTool`             | `connectors/gmail/src/tools.ts`            | Ferramenta `get_thread`.                                                                                          |
| `getMessageTool`            | `connectors/gmail/src/tools.ts`            | Ferramenta `get_message`.                                                                                         |
| `listLabelsTool`            | `connectors/gmail/src/tools.ts`            | Ferramenta `list_labels`.                                                                                         |
| `getAttachmentTextTool`     | `connectors/gmail/src/tools.ts`            | Ferramenta `get_attachment_text`.                                                                                 |
| `GMAIL_TOOLS`               | `connectors/gmail/src/tools.ts`            | Todas as ferramentas do Gmail, na ordem mostrada ao Claude.                                                       |
| `GMAIL_SERVER_INFO`         | `connectors/gmail/src/worker.ts`           | Nome e versão do servidor MCP do Gmail.                                                                           |
| `GMAIL_SERVER_INSTRUCTIONS` | `connectors/gmail/src/worker.ts`           | Instruções do servidor MCP (contas e conteúdo não confiável).                                                     |
| `ACCESS_TOKEN_TTL_SECONDS`  | `connectors/gmail/src/worker.ts`           | Validade do access token emitido ao Claude (1 hora).                                                              |
| `REFRESH_TOKEN_TTL_SECONDS` | `connectors/gmail/src/worker.ts`           | Validade do refresh token emitido ao Claude (30 dias).                                                            |
| `GMAIL_ROUTES`              | `connectors/gmail/src/worker.ts`           | Rotas próprias do Worker: `MÉTODO caminho` → atendimento.                                                         |
