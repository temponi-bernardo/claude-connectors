# Funções

Toda função de topo do código aparece aqui, em um modelo fixo. Os campos entre `<!-- generated:start -->` e
`<!-- generated:end -->` (Arquivo, Assinatura, Usada por, Processos) são escritos por `npm run docs:generate` a
partir do código — não edite à mão. Os campos **Faz**, **Entrada**, **Saída**, **Efeitos** e **Erros** são
manuais e obrigatórios; `npm run docs:check` falha enquanto houver `_fill_in_`.

Modelo e regras de escrita: [DOCUMENTATION.md](DOCUMENTATION.md#função).

## Índice por módulo

<!-- index:start -->

- `connectors/canvas-puc/src/client.ts`: [`unauthorizedMessage`](#unauthorizedmessage), [`sendCanvasRequest`](#sendcanvasrequest), [`requestCanvas`](#requestcanvas), [`collectPages`](#collectpages), [`fetchDownload`](#fetchdownload), [`fetchPlainText`](#fetchplaintext), [`fetchFileBytes`](#fetchfilebytes), [`createCanvasClient`](#createcanvasclient)
- `connectors/canvas-puc/src/files.ts`: [`fileContentBlock`](#filecontentblock), [`downloadedFileResult`](#downloadedfileresult), [`downloadRefusal`](#downloadrefusal), [`downloadCanvasFile`](#downloadcanvasfile), [`readCanvasFileText`](#readcanvasfiletext)
- `connectors/canvas-puc/src/format.ts`: [`shortText`](#shorttext), [`toProfile`](#toprofile), [`toCourse`](#tocourse), [`toSubmissionFlags`](#tosubmissionflags), [`toPlannerItem`](#toplanneritem), [`toAssignmentSummary`](#toassignmentsummary), [`toRubricCriterion`](#torubriccriterion), [`toFileInfo`](#tofileinfo), [`toSubmissionDetail`](#tosubmissiondetail), [`toAssignmentDetail`](#toassignmentdetail), [`toGradeRow`](#tograderow), [`toEnrollmentGrade`](#toenrollmentgrade), [`toAnnouncement`](#toannouncement), [`toModuleItem`](#tomoduleitem), [`toModule`](#tomodule), [`toDiscussionSummary`](#todiscussionsummary), [`flattenDiscussion`](#flattendiscussion), [`toCalendarEvent`](#tocalendarevent)
- `connectors/canvas-puc/src/helpers.ts`: [`isoDaysFrom`](#isodaysfrom), [`dateOnly`](#dateonly), [`courseContextCodes`](#coursecontextcodes), [`courseNameMap`](#coursenamemap), [`participantNames`](#participantnames), [`isTextFile`](#istextfile), [`matchModuleItems`](#matchmoduleitems), [`activeCourses`](#activecourses), [`fetchOwnSubmission`](#fetchownsubmission), [`getAllOrEmpty`](#getallorempty)
- `connectors/canvas-puc/src/remote-main.ts`: [`startCanvasRemoteServer`](#startcanvasremoteserver)
- `connectors/canvas-puc/src/remote.ts`: [`withCanvasUserAgent`](#withcanvasuseragent), [`readCanvasRemoteSettings`](#readcanvasremotesettings), [`canvasLoginText`](#canvaslogintext), [`fetchCanvasSelf`](#fetchcanvasself), [`verifyCanvasToken`](#verifycanvastoken), [`matchesVisibleToken`](#matchesvisibletoken), [`planTokenRenewal`](#plantokenrenewal), [`canvasTokenApi`](#canvastokenapi), [`renewCanvasToken`](#renewcanvastoken), [`isCanvasTokenAlive`](#iscanvastokenalive), [`renewCanvasSecret`](#renewcanvassecret), [`canvasRemoteConnector`](#canvasremoteconnector)
- `connectors/canvas-puc/src/tools-write.ts`: [`submissionPayload`](#submissionpayload)
- `connectors/canvas-puc/src/tools.ts`: [`canvasTools`](#canvastools), [`createCanvasMcpServer`](#createcanvasmcpserver)
- `connectors/canvas-puc/src/worker.ts`: [`createWorkerApp`](#createworkerapp), [`handleWorkerFetch`](#handleworkerfetch)
- `connectors/gmail/src/access-token.ts`: [`accessTokenKey`](#accesstokenkey), [`forgetAccessToken`](#forgetaccesstoken), [`clearAccessTokenCache`](#clearaccesstokencache), [`relinkError`](#relinkerror), [`markAccountRevoked`](#markaccountrevoked), [`renewAccessToken`](#renewaccesstoken), [`getAccessToken`](#getaccesstoken)
- `connectors/gmail/src/accounts.ts`: [`accountAlias`](#accountalias), [`aliasAccounts`](#aliasaccounts), [`noAccountsError`](#noaccountserror), [`resolveAccounts`](#resolveaccounts), [`writeAccessError`](#writeaccesserror), [`requireWriteAccess`](#requirewriteaccess)
- `connectors/gmail/src/attachments.ts`: [`looksLikeText`](#looksliketext), [`detectAttachmentKind`](#detectattachmentkind), [`attachmentBytesToText`](#attachmentbytestotext), [`downloadAttachment`](#downloadattachment), [`readAttachmentText`](#readattachmenttext)
- `connectors/gmail/src/compose.ts`: [`prefixSubject`](#prefixsubject), [`threadingHeaders`](#threadingheaders), [`uniqueAddresses`](#uniqueaddresses), [`replyToList`](#replytolist), [`replyRecipients`](#replyrecipients), [`quotedText`](#quotedtext), [`forwardedText`](#forwardedtext), [`replyEmail`](#replyemail), [`forwardEmail`](#forwardemail)
- `connectors/gmail/src/config.ts`: [`hasModifyScope`](#hasmodifyscope), [`isEmailAddress`](#isemailaddress), [`parseAllowedEmails`](#parseallowedemails), [`requiredSecret`](#requiredsecret), [`readConsentSecret`](#readconsentsecret), [`readGmailSettings`](#readgmailsettings), [`isEmailAllowed`](#isemailallowed)
- `connectors/gmail/src/draft-tools.ts`: [`draftArgs`](#draftargs)
- `connectors/gmail/src/drafts.ts`: [`draftSummary`](#draftsummary), [`listDrafts`](#listdrafts), [`prepareDraftEmail`](#preparedraftemail), [`draftIds`](#draftids), [`createDraft`](#createdraft), [`updateDraft`](#updatedraft), [`sendDraft`](#senddraft), [`deleteDraft`](#deletedraft)
- `connectors/gmail/src/gmail-api.ts`: [`gmailUrl`](#gmailurl), [`gmailHttpError`](#gmailhttperror), [`gmailErrorDetail`](#gmailerrordetail), [`sendGmailRequest`](#sendgmailrequest), [`readGmailJson`](#readgmailjson), [`gmailCall`](#gmailcall), [`gmailGet`](#gmailget), [`gmailWrite`](#gmailwrite)
- `connectors/gmail/src/google-oauth.ts`: [`googleRedirectUri`](#googleredirecturi), [`googleAuthorizeUrl`](#googleauthorizeurl), [`randomToken`](#randomtoken), [`parseGoogleTokens`](#parsegoogletokens), [`googleErrorCode`](#googleerrorcode), [`postGoogleToken`](#postgoogletoken), [`exchangeGoogleCode`](#exchangegooglecode), [`refreshGoogleToken`](#refreshgoogletoken), [`revokeGoogleToken`](#revokegoogletoken)
- `connectors/gmail/src/id-token.ts`: [`decodeJwtJson`](#decodejwtjson), [`decodeJwt`](#decodejwt), [`idTokenProblems`](#idtokenproblems), [`checkIdTokenClaims`](#checkidtokenclaims), [`fetchGoogleKey`](#fetchgooglekey), [`verifyRs256`](#verifyrs256), [`verifyGoogleIdToken`](#verifygoogleidtoken)
- `connectors/gmail/src/link-flow.ts`: [`nowSeconds`](#nowseconds), [`issueLinkUrl`](#issuelinkurl), [`redeemLinkTicket`](#redeemlinkticket), [`linkRequestKey`](#linkrequestkey), [`readCookie`](#readcookie), [`linkCookie`](#linkcookie), [`invalidTicketPage`](#invalidticketpage), [`startAccountLink`](#startaccountlink), [`takeLinkRequest`](#takelinkrequest), [`linkRefusalReason`](#linkrefusalreason), [`storeGoogleAccount`](#storegoogleaccount), [`linkFromCode`](#linkfromcode), [`linkSafely`](#linksafely), [`finishAccountLink`](#finishaccountlink)
- `connectors/gmail/src/mailbox-tools.ts`: [`toggleAction`](#toggleaction), [`writableTargets`](#writabletargets), [`runMailboxAction`](#runmailboxaction)
- `connectors/gmail/src/mailbox.ts`: [`mailTargets`](#mailtargets), [`checkLabelChange`](#checklabelchange), [`resolveLabelIds`](#resolvelabelids), [`fetchLabels`](#fetchlabels), [`applyLabelChange`](#applylabelchange), [`targetCounts`](#targetcounts), [`moveToTrash`](#movetotrash)
- `connectors/gmail/src/message-format.ts`: [`base64UrlToBytes`](#base64urltobytes), [`partCharset`](#partcharset), [`decodePartBody`](#decodepartbody), [`headerValues`](#headervalues), [`flattenParts`](#flattenparts), [`isBodyPart`](#isbodypart), [`messageBodyText`](#messagebodytext), [`messageAttachments`](#messageattachments), [`truncateText`](#truncatetext), [`internalDateIso`](#internaldateiso), [`pickHeaders`](#pickheaders), [`formatMessage`](#formatmessage), [`perMessageLimit`](#permessagelimit), [`formatThread`](#formatthread), [`summarizeThread`](#summarizethread)
- `connectors/gmail/src/mime.ts`: [`splitAddressList`](#splitaddresslist), [`parseMailAddress`](#parsemailaddress), [`parseAddressList`](#parseaddresslist), [`parseRecipients`](#parserecipients), [`cleanHeaderText`](#cleanheadertext), [`isPrintableAscii`](#isprintableascii), [`encodeHeaderWord`](#encodeheaderword), [`formatMailAddress`](#formatmailaddress), [`addressHeader`](#addressheader), [`messageIdList`](#messageidlist), [`mimeHeaderLines`](#mimeheaderlines), [`wrapBase64`](#wrapbase64), [`textPart`](#textpart), [`safeMimeType`](#safemimetype), [`attachmentPart`](#attachmentpart), [`buildMimeMessage`](#buildmimemessage), [`toRawMessage`](#torawmessage)
- `connectors/gmail/src/pages.ts`: [`pageDocument`](#pagedocument), [`messagePage`](#messagepage), [`consentPageBody`](#consentpagebody), [`copyConsentHeaders`](#copyconsentheaders), [`consentPage`](#consentpage), [`redirectWith`](#redirectwith)
- `connectors/gmail/src/rate-limit.ts`: [`isRateLimited`](#isratelimited), [`rateLimitedResponse`](#ratelimitedresponse)
- `connectors/gmail/src/search.ts`: [`encodeMultiPageToken`](#encodemultipagetoken), [`decodeMultiPageToken`](#decodemultipagetoken), [`fetchThreadMetadata`](#fetchthreadmetadata), [`searchAccount`](#searchaccount), [`threadDate`](#threaddate), [`sortByDateDesc`](#sortbydatedesc), [`pagesToFetch`](#pagestofetch), [`searchThreads`](#searchthreads)
- `connectors/gmail/src/send-tools.ts`: [`replyTool`](#replytool)
- `connectors/gmail/src/send.ts`: [`checkRecipientLimit`](#checkrecipientlimit), [`composeEmail`](#composeemail), [`mimeBoundary`](#mimeboundary), [`gmailMessageResource`](#gmailmessageresource), [`fetchFullMessage`](#fetchfullmessage), [`prepareReply`](#preparereply), [`forwardAttachments`](#forwardattachments), [`prepareForward`](#prepareforward), [`sendPrepared`](#sendprepared), [`sentResult`](#sentresult)
- `connectors/gmail/src/sign-in.ts`: [`accessDeniedPage`](#accessdeniedpage), [`authorizationErrorResponse`](#authorizationerrorresponse), [`beginGoogleSignIn`](#begingooglesignin), [`showAuthorize`](#showauthorize), [`submitAuthorize`](#submitauthorize), [`linkSignedInAccount`](#linksignedinaccount), [`completeSignIn`](#completesignin), [`finishSignIn`](#finishsignin)
- `connectors/gmail/src/token-store.ts`: [`sha256Hex`](#sha256hex), [`ownerKey`](#ownerkey), [`toLinkedAccount`](#tolinkedaccount), [`sealOwnerAccounts`](#sealowneraccounts), [`openOwnerAccounts`](#openowneraccounts), [`loadOwnerAccounts`](#loadowneraccounts), [`saveOwnerAccounts`](#saveowneraccounts), [`upsertAccount`](#upsertaccount)
- `connectors/gmail/src/tools.ts`: [`ownerRefs`](#ownerrefs), [`resolveOwnerAccounts`](#resolveowneraccounts), [`resolveSingleAccount`](#resolvesingleaccount), [`resolveWritableAccount`](#resolvewritableaccount), [`accountBase`](#accountbase), [`accountStatus`](#accountstatus), [`withUntrustedNotice`](#withuntrustednotice), [`accountLabels`](#accountlabels)
- `connectors/gmail/src/worker.ts`: [`createGmailDeps`](#creategmaildeps), [`createGmailServer`](#creategmailserver), [`configErrorResponse`](#configerrorresponse), [`handleMcpApi`](#handlemcpapi), [`handleDefaultRequest`](#handledefaultrequest), [`checkClientRegistration`](#checkclientregistration), [`publicOrigin`](#publicorigin), [`createGmailProvider`](#creategmailprovider), [`clientIpKey`](#clientipkey), [`isMcpPath`](#ismcppath), [`handleGmailWorkerFetch`](#handlegmailworkerfetch)
- `connectors/whatsapp/src/bridge-client.ts`: [`bridgeErrorFrom`](#bridgeerrorfrom), [`withDeadline`](#withdeadline), [`bridgeTimeoutMessage`](#bridgetimeoutmessage), [`shouldRetryBridge`](#shouldretrybridge), [`attemptBridge`](#attemptbridge), [`callBridge`](#callbridge), [`bridgeJson`](#bridgejson), [`bridgePath`](#bridgepath), [`jsonPost`](#jsonpost)
- `connectors/whatsapp/src/config.ts`: [`requireEnv`](#requireenv), [`readIntInRange`](#readintinrange), [`readSleepAfter`](#readsleepafter), [`normalizePhone`](#normalizephone), [`normalizeRecipient`](#normalizerecipient), [`readSendAllowlist`](#readsendallowlist), [`readAllowedEmails`](#readallowedemails), [`readTimingSettings`](#readtimingsettings), [`readSendSettings`](#readsendsettings), [`readWhatsAppSettings`](#readwhatsappsettings), [`containerEnvVars`](#containerenvvars)
- `connectors/whatsapp/src/container.ts`: [`workersFixedLength`](#workersfixedlength)
- `connectors/whatsapp/src/format.ts`: [`isHiddenChar`](#ishiddenchar), [`sanitizeText`](#sanitizetext), [`untrusted`](#untrusted), [`compactMessage`](#compactmessage), [`compactChat`](#compactchat), [`partialSyncWarning`](#partialsyncwarning), [`compactStatus`](#compactstatus)
- `connectors/whatsapp/src/lifecycle.ts`: [`withBridgeToken`](#withbridgetoken), [`fetchBridge`](#fetchbridge), [`readBridgePhase`](#readbridgephase), [`restoreRequestInit`](#restorerequestinit), [`ensureRestored`](#ensurerestored), [`snapshotBridge`](#snapshotbridge), [`planSend`](#plansend), [`guardSend`](#guardsend), [`forwardInit`](#forwardinit), [`createBridgeLifecycle`](#createbridgelifecycle), [`logSnapshotFailure`](#logsnapshotfailure), [`resetBridge`](#resetbridge), [`routeBridgeRequest`](#routebridgerequest)
- `connectors/whatsapp/src/pair-page.ts`: [`describePairStatus`](#describepairstatus), [`pairForm`](#pairform), [`pairingSection`](#pairingsection), [`maintenanceSection`](#maintenancesection), [`alertHtml`](#alerthtml), [`renderPairPage`](#renderpairpage)
- `connectors/whatsapp/src/pair.ts`: [`parseCookies`](#parsecookies), [`pairCookie`](#paircookie), [`redirectWithCookies`](#redirectwithcookies), [`readPairSession`](#readpairsession), [`issuePairCsrf`](#issuepaircsrf), [`isTrustedPost`](#istrustedpost), [`startPairLogin`](#startpairlogin), [`isValidPairLogin`](#isvalidpairlogin), [`openPairSession`](#openpairsession), [`handlePairCallback`](#handlepaircallback), [`pairDeadline`](#pairdeadline), [`fetchPairStatus`](#fetchpairstatus), [`pairPage`](#pairpage), [`pairActionError`](#pairactionerror), [`handlePairPost`](#handlepairpost), [`routePairPost`](#routepairpost), [`isPairPath`](#ispairpath), [`routePairRequest`](#routepairrequest)
- `connectors/whatsapp/src/snapshots.ts`: [`pumpInto`](#pumpinto), [`storedGeneration`](#storedgeneration), [`readUploadHeaders`](#readuploadheaders), [`storeSnapshot`](#storesnapshot), [`storeSnapshotResponse`](#storesnapshotresponse), [`archiveSnapshot`](#archivesnapshot), [`sameSecret`](#samesecret), [`acceptSnapshotPush`](#acceptsnapshotpush)
- `connectors/whatsapp/src/tools.ts`: [`toolDeadline`](#tooldeadline), [`syncWaitBudget`](#syncwaitbudget), [`prepareRead`](#prepareread), [`runRead`](#runread), [`compactContact`](#compactcontact), [`decodeHeaderText`](#decodeheadertext), [`mediaResult`](#mediaresult), [`allowedRecipient`](#allowedrecipient), [`whatsappTools`](#whatsapptools), [`createWhatsAppMcpServer`](#createwhatsappmcpserver)
- `connectors/whatsapp/src/worker-env.ts`: [`bridgeStub`](#bridgestub), [`bridgeFetchFor`](#bridgefetchfor)
- `connectors/whatsapp/src/worker.ts`: [`unixNow`](#unixnow), [`githubSettingsFrom`](#githubsettingsfrom), [`whatsappRemoteConnector`](#whatsappremoteconnector), [`createWhatsAppApps`](#createwhatsappapps), [`handleWhatsAppFetch`](#handlewhatsappfetch), [`isSyncCronEnabled`](#issynccronenabled), [`runScheduledSync`](#runscheduledsync)
- `src/core/bytes.ts`: [`byteView`](#byteview), [`concatBytes`](#concatbytes), [`utf16leToString`](#utf16letostring), [`bytesToBase64`](#bytestobase64)
- `src/core/cfb.ts`: [`isCfb`](#iscfb), [`readCfbHeader`](#readcfbheader), [`cfbSector`](#cfbsector), [`sectorWords`](#sectorwords), [`fatSectorIds`](#fatsectorids), [`followChain`](#followchain), [`readRegularChain`](#readregularchain), [`parseDirectory`](#parsedirectory), [`openCfb`](#opencfb), [`readMiniStream`](#readministream), [`readCfbStream`](#readcfbstream)
- `src/core/env.ts`: [`envValue`](#envvalue), [`parseFlag`](#parseflag), [`toEnvVars`](#toenvvars)
- `src/core/html.ts`: [`htmlToText`](#htmltotext)
- `src/core/http.ts`: [`buildUrl`](#buildurl), [`parseNextLink`](#parsenextlink)
- `src/core/pdf.ts`: [`bytesToLatin1`](#bytestolatin1), [`isPdf`](#ispdf), [`streamDataStart`](#streamdatastart), [`trimStreamEol`](#trimstreameol), [`readRawObject`](#readrawobject), [`listRawObjects`](#listrawobjects), [`decodePdfStream`](#decodepdfstream), [`splitObjectStream`](#splitobjectstream), [`storePdfObject`](#storepdfobject), [`readPdfObjects`](#readpdfobjects), [`pdfRefs`](#pdfrefs), [`dictRefs`](#dictrefs), [`collectPdfPages`](#collectpdfpages), [`orderedPages`](#orderedpages), [`utf16beHexToString`](#utf16behextostring), [`readBfChars`](#readbfchars), [`readBfRanges`](#readbfranges), [`rangeTarget`](#rangetarget), [`parseToUnicodeCMap`](#parsetounicodecmap), [`addFontRefs`](#addfontrefs), [`fontResourceRefs`](#fontresourcerefs), [`fontCMaps`](#fontcmaps), [`decodePdfText`](#decodepdftext), [`readLiteralString`](#readliteralstring), [`readEscape`](#readescape), [`readHexString`](#readhexstring), [`skipPdfSpace`](#skippdfspace), [`nextPdfToken`](#nextpdftoken), [`readPdfWord`](#readpdfword), [`wrapString`](#wrapstring), [`classifyWord`](#classifyword), [`showArrayText`](#showarraytext), [`lastOperandText`](#lastoperandtext), [`moveText`](#movetext), [`applyTextOperator`](#applytextoperator), [`feedPdfToken`](#feedpdftoken), [`contentStreamText`](#contentstreamtext), [`tidyPdfText`](#tidypdftext), [`pdfToText`](#pdftotext)
- `src/core/word.ts`: [`docxXmlToText`](#docxxmltotext), [`docxToText`](#docxtotext), [`cp1252ToString`](#cp1252tostring), [`parsePieceTable`](#parsepiecetable), [`pieceText`](#piecetext), [`cleanWordText`](#cleanwordtext), [`docToText`](#doctotext), [`wordKind`](#wordkind), [`wordToText`](#wordtotext)
- `src/core/zip.ts`: [`findEndOfCentralDirectory`](#findendofcentraldirectory), [`listZipEntries`](#listzipentries), [`zipEntryBytes`](#zipentrybytes), [`decompressBytes`](#decompressbytes), [`inflateRaw`](#inflateraw), [`readZipEntry`](#readzipentry)
- `src/mcp/annotations.ts`: [`toolAnnotations`](#toolannotations)
- `src/mcp/server-version.ts`: [`manifestVersion`](#manifestversion)
- `src/mcp/tools.ts`: [`defineTool`](#definetool), [`textResult`](#textresult), [`rawToolResult`](#rawtoolresult), [`toToolResult`](#totoolresult), [`errorResult`](#errorresult), [`runToolSafely`](#runtoolsafely), [`registerToolSpecs`](#registertoolspecs), [`binaryContentBlock`](#binarycontentblock)
- `src/remote/github-login.ts`: [`githubAuthorizeUrl`](#githubauthorizeurl), [`parseEmailList`](#parseemaillist), [`pickAllowedEmail`](#pickallowedemail), [`exchangeGithubCode`](#exchangegithubcode), [`fetchGithubEmails`](#fetchgithubemails), [`finishGithubLogin`](#finishgithublogin), [`githubUpstreamLogin`](#githubupstreamlogin)
- `src/remote/handler.ts`: [`jsonResponse`](#jsonresponse), [`pageSecurityPolicy`](#pagesecuritypolicy), [`htmlResponse`](#htmlresponse), [`readForm`](#readform), [`readJsonBody`](#readjsonbody), [`loginPageFor`](#loginpagefor), [`redirectWithCode`](#redirectwithcode), [`handleRegister`](#handleregister), [`redirectToUpstream`](#redirecttoupstream), [`handleAuthorizePage`](#handleauthorizepage), [`handleUpstreamCallback`](#handleupstreamcallback), [`handleAuthorizeSubmit`](#handleauthorizesubmit), [`renewSecretQuietly`](#renewsecretquietly), [`handleToken`](#handletoken), [`handleMcp`](#handlemcp), [`withCors`](#withcors), [`routeRemoteRequest`](#routeremoterequest), [`createRemoteHandler`](#createremotehandler)
- `src/remote/login-page.ts`: [`escapeHtml`](#escapehtml), [`renderLoginPage`](#renderloginpage)
- `src/remote/mcp-endpoint.ts`: [`serveMcpRequest`](#servemcprequest), [`mcpUnauthorizedResponse`](#mcpunauthorizedresponse)
- `src/remote/node-server.ts`: [`readPublicUrl`](#readpublicurl), [`readRemoteServerConfig`](#readremoteserverconfig), [`readNodeBody`](#readnodebody), [`toWebRequest`](#towebrequest), [`writeWebResponse`](#writewebresponse), [`serveNodeRequest`](#servenoderequest), [`startRemoteHttpServer`](#startremotehttpserver)
- `src/remote/oauth.ts`: [`readOAuthSettings`](#readoauthsettings), [`resolveIssuer`](#resolveissuer), [`oauthError`](#oautherror), [`authorizationServerMetadata`](#authorizationservermetadata), [`protectedResourceMetadata`](#protectedresourcemetadata), [`isAllowedRedirect`](#isallowedredirect), [`pkceChallenge`](#pkcechallenge), [`readRedirectUris`](#readredirecturis), [`registerClient`](#registerclient), [`clientRedirectUris`](#clientredirecturis), [`parseAuthorizeQuery`](#parseauthorizequery), [`readCodeChallenge`](#readcodechallenge)
- `src/remote/seal.ts`: [`parseSealKey`](#parsesealkey), [`sealPayload`](#sealpayload), [`unsealPayload`](#unsealpayload), [`openSealed`](#opensealed)
- `src/remote/tokens.ts`: [`sealAuthorizeRequest`](#sealauthorizerequest), [`openAuthorizeRequest`](#openauthorizerequest), [`issueAuthorizationCode`](#issueauthorizationcode), [`issueTokenSet`](#issuetokenset), [`redeemAuthorizationCode`](#redeemauthorizationcode), [`redeemRefreshToken`](#redeemrefreshtoken), [`redeemTokenRequest`](#redeemtokenrequest), [`readAccessSecret`](#readaccesssecret)
- `tools/bundle/bundle.ts`: [`listConnectors`](#listconnectors), [`isRemoteMcpUrl`](#isremotemcpurl), [`mcpServerProblems`](#mcpserverproblems), [`pluginMcpProblems`](#pluginmcpproblems), [`bundleOptions`](#bundleoptions)
- `tools/bundle/cli.ts`: [`buildConnector`](#buildconnector), [`runBuildCli`](#runbuildcli)
- `tools/docs/ast.ts`: [`toPosixRelative`](#toposixrelative), [`globToRegExp`](#globtoregexp), [`isAnalyzedSource`](#isanalyzedsource), [`openProject`](#openproject), [`signatureOf`](#signatureof), [`collectFileFunctions`](#collectfilefunctions), [`collectFunctions`](#collectfunctions), [`isDataDeclaration`](#isdatadeclaration), [`collectFileConstants`](#collectfileconstants), [`collectConstants`](#collectconstants), [`isIgnoredReference`](#isignoredreference), [`ownerLabelOf`](#ownerlabelof), [`findDeclaration`](#finddeclaration), [`buildReferenceIndex`](#buildreferenceindex), [`buildCallGraph`](#buildcallgraph)
- `tools/docs/checks.ts`: [`checkFunctionsDocumented`](#checkfunctionsdocumented), [`checkSectionModules`](#checksectionmodules), [`checkUniqueNames`](#checkuniquenames), [`checkGeneratedBlocks`](#checkgeneratedblocks), [`checkManualFields`](#checkmanualfields), [`checkProcessCitations`](#checkprocesscitations), [`checkStructure`](#checkstructure), [`checkUiComponents`](#checkuicomponents), [`checkTests`](#checktests), [`checkConstants`](#checkconstants), [`runAllChecks`](#runallchecks)
- `tools/docs/cli.ts`: [`runDocsCli`](#rundocscli)
- `tools/docs/config.ts`: [`mergeDocsConfig`](#mergedocsconfig), [`loadDocsConfig`](#loaddocsconfig)
- `tools/docs/inventory.ts`: [`listGitFiles`](#listgitfiles), [`walkFiles`](#walkfiles), [`dirsFromFiles`](#dirsfromfiles), [`listVersionedDirs`](#listversioneddirs), [`readTestFilesText`](#readtestfilestext), [`listUiComponents`](#listuicomponents), [`loadTestExceptions`](#loadtestexceptions), [`buildInventory`](#buildinventory)
- `tools/docs/markdown.ts`: [`firstGroup`](#firstgroup), [`stripCodeBlocks`](#stripcodeblocks), [`extractCalledNames`](#extractcallednames), [`sliceBetween`](#slicebetween), [`replaceBetween`](#replacebetween), [`extractFunctionSections`](#extractfunctionsections), [`buildSection`](#buildsection), [`extractProcessCitations`](#extractprocesscitations), [`extractDocumentedDirs`](#extractdocumenteddirs), [`extractBacktickedNames`](#extractbacktickednames)
- `tools/docs/render.ts`: [`formatList`](#formatlist), [`renderGeneratedBlock`](#rendergeneratedblock), [`renderNewSection`](#rendernewsection), [`renderModuleIndex`](#rendermoduleindex), [`computeGeneratedData`](#computegenerateddata), [`closureOf`](#closureof), [`processesByFunction`](#processesbyfunction), [`replaceSectionBlock`](#replacesectionblock), [`appendSection`](#appendsection), [`insertBeforeDataTable`](#insertbeforedatatable), [`removeSection`](#removesection), [`removeEmptyModules`](#removeemptymodules), [`pruneOrphanSections`](#pruneorphansections), [`applyGenerated`](#applygenerated)
- `tools/docs/run.ts`: [`readOptional`](#readoptional), [`readDocsTexts`](#readdocstexts), [`formatIssues`](#formatissues), [`runCheck`](#runcheck), [`generateFunctionsDoc`](#generatefunctionsdoc), [`runGenerate`](#rungenerate)

<!-- index:end -->

## `tools/docs/ast.ts`

### `toPosixRelative`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `toPosixRelative(rootDir: string, absolutePath: string): string`
- **Used by:** `collectFileConstants()`, `collectFileFunctions()`, `openProject()`, `ownerLabelOf()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Converte um caminho absoluto em caminho relativo à raiz, sempre com `/`.
- **Input:** `rootDir`: raiz absoluta; `absolutePath`: caminho absoluto dentro dela.
- **Output:** Caminho relativo POSIX, ex.: `src/a.ts`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `globToRegExp`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `globToRegExp(glob: string): RegExp`
- **Used by:** `isAnalyzedSource()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Converte um glob simples (`**/`, `**`, `*`) em expressão regular ancorada, para casar caminhos relativos.
- **Input:** `glob`: padrão, ex.: `**/fixtures/**`.
- **Output:** `RegExp` que casa o caminho inteiro.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `isAnalyzedSource`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `isAnalyzedSource(relativePath: string, config: DocsConfig): boolean`
- **Used by:** `openProject()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Decide se um arquivo entra na análise: termina em `.ts`, não é `.d.ts`, não é teste e não casa com nenhum glob de `ignore`.
- **Input:** `relativePath`: caminho relativo; `config`: configuração do docs.
- **Output:** `true` se o arquivo deve ser analisado.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `openProject`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `openProject(rootDir: string, config: DocsConfig): Project`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Cria o projeto ts-morph com módulo/resolução NodeNext, adiciona os `.ts` das pastas configuradas e remove os que `isAnalyzedSource()` rejeita.
- **Input:** `rootDir`: raiz do repositório; `config`: configuração do docs.
- **Output:** `Project` do ts-morph pronto para análise.
- **Effects:** Lê arquivos do disco.
- **Errors:** Erros de leitura do sistema de arquivos propagam.

### `signatureOf`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `signatureOf(fn: FunctionDeclaration): string`
- **Used by:** `collectFileFunctions()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Monta a assinatura legível de uma função: `async` se houver, nome, parâmetros como escritos e tipo de retorno (declarado ou inferido).
- **Input:** `fn`: declaração de função do ts-morph.
- **Output:** Texto como `slugify(title: string): string`.
- **Effects:** Nenhum (pura sobre a AST).
- **Errors:** Nenhum.

### `collectFileFunctions`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `collectFileFunctions(rootDir: string, file: SourceFile): FunctionInfo[]`
- **Used by:** `collectFunctions()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lista as funções de topo nomeadas de um arquivo, com arquivo relativo e assinatura.
- **Input:** `rootDir`: raiz; `file`: arquivo-fonte do ts-morph.
- **Output:** Lista de `FunctionInfo` na ordem do arquivo.
- **Effects:** Nenhum (pura sobre a AST).
- **Errors:** Nenhum.

### `collectFunctions`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `collectFunctions(rootDir: string, project: Project): FunctionInfo[]`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lista todas as funções de topo do projeto, arquivos em ordem alfabética.
- **Input:** `rootDir`: raiz; `project`: projeto ts-morph aberto.
- **Output:** Lista de `FunctionInfo` (o registro de funções).
- **Effects:** Nenhum (pura sobre a AST).
- **Errors:** Nenhum.

### `isDataDeclaration`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `isDataDeclaration(declaration: VariableDeclaration): boolean`
- **Used by:** `collectFileConstants()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Decide se uma declaração de variável é dado/constante e não uma função atribuída a `const` (arrow ou function expression).
- **Input:** `declaration`: declaração de variável do ts-morph.
- **Output:** `true` para dados (inclusive sem inicializador).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `collectFileConstants`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `collectFileConstants(rootDir: string, file: SourceFile): ConstantInfo[]`
- **Used by:** `collectConstants()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lista as constantes exportadas de topo de um arquivo, excluindo funções atribuídas a variáveis.
- **Input:** `rootDir`: raiz; `file`: arquivo-fonte.
- **Output:** Lista de `ConstantInfo`.
- **Effects:** Nenhum (pura sobre a AST).
- **Errors:** Nenhum.

### `collectConstants`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `collectConstants(rootDir: string, project: Project): ConstantInfo[]`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lista as constantes exportadas de todo o projeto, para a tabela "Data and constants".
- **Input:** `rootDir`: raiz; `project`: projeto ts-morph.
- **Output:** Lista de `ConstantInfo`.
- **Effects:** Nenhum (pura sobre a AST).
- **Errors:** Nenhum.

### `isIgnoredReference`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `isIgnoredReference(node: Node): boolean`
- **Used by:** `buildReferenceIndex()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Decide se um nó de referência deve ser ignorado no índice: a própria declaração, especificadores de import/export, cláusula de import e `export default`.
- **Input:** `node`: nó de referência retornado pelo ts-morph.
- **Output:** `true` para ignorar.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `ownerLabelOf`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `ownerLabelOf(rootDir: string, node: Node): string`
- **Used by:** `buildReferenceIndex()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Descobre quem contém uma referência: a função de topo que a envolve (`nome()`) ou, fora de função, o módulo do arquivo (`arquivo (module)`).
- **Input:** `rootDir`: raiz; `node`: nó de referência.
- **Output:** Rótulo usado em "Usada por".
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `findDeclaration`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `findDeclaration(rootDir: string, project: Project, info: FunctionInfo): FunctionDeclaration | undefined`
- **Used by:** `buildReferenceIndex()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Localiza a declaração de uma função do registro no projeto, pelo arquivo e nome.
- **Input:** `rootDir`: raiz; `project`: projeto; `info`: função do registro.
- **Output:** A `FunctionDeclaration`, ou `undefined` se arquivo/função não existirem.
- **Effects:** Nenhum.
- **Errors:** Nenhum.

### `buildReferenceIndex`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `buildReferenceIndex(rootDir: string, project: Project, functions: readonly FunctionInfo[]): ReferenceIndex`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Monta o índice de referências: para cada função, o conjunto de rótulos de quem a chama ou a passa como valor (via `findReferencesAsNodes`, filtrado por `isIgnoredReference()`).
- **Input:** `rootDir`: raiz; `project`: projeto; `functions`: registro.
- **Output:** `ReferenceIndex` (nome → rótulos).
- **Effects:** Nenhum (pura sobre a AST).
- **Errors:** Nenhum.

### `buildCallGraph`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `buildCallGraph(functions: readonly FunctionInfo[], references: ReferenceIndex): CallGraph`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Inverte o índice de referências em grafo de chamadas: função → funções do registro que ela usa. Referências do nível de módulo não geram aresta.
- **Input:** `functions`: registro; `references`: índice de referências.
- **Output:** `CallGraph` com uma entrada por função.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `tools/docs/checks.ts`

### `checkFunctionsDocumented`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkFunctionsDocumented(functions: readonly FunctionInfo[], sections: readonly FunctionSection[]): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Compara registro e seções: aponta função sem seção (`FUNCTION_UNDOCUMENTED`) e seção sem função (`DOC_WITHOUT_FUNCTION`).
- **Input:** `functions`: registro; `sections`: seções do FUNCTIONS.md.
- **Output:** Lista de `Issue`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `checkSectionModules`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkSectionModules(functions: readonly FunctionInfo[], sections: readonly FunctionSection[]): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Aponta seção colocada sob o heading `## arquivo` errado (`SECTION_IN_WRONG_MODULE`).
- **Input:** `functions`: registro; `sections`: seções.
- **Output:** Lista de `Issue`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `checkUniqueNames`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkUniqueNames(functions: readonly FunctionInfo[]): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Aponta nome de função definido em mais de um arquivo (`DUPLICATE_NAME`).
- **Input:** `functions`: registro.
- **Output:** Lista de `Issue`, uma por nome repetido.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `checkGeneratedBlocks`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkGeneratedBlocks(inventory: Inventory, sections: readonly FunctionSection[], citations: ProcessCitations): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Recalcula o bloco gerado de cada função documentada e compara com o texto atual (`GENERATED_BLOCK_OUTDATED`), mostrando esperado e encontrado.
- **Input:** `inventory`: inventário; `sections`: seções; `citations`: citações de processos.
- **Output:** Lista de `Issue`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `checkManualFields`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkManualFields(sections: readonly FunctionSection[]): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Confere os cinco campos manuais de cada seção: ausente (`MANUAL_FIELD_MISSING`) ou ainda com o marcador `PLACEHOLDER` (`MANUAL_FIELD_UNFILLED`).
- **Input:** `sections`: seções.
- **Output:** Lista de `Issue`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `checkProcessCitations`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkProcessCitations(functions: readonly FunctionInfo[], citations: ProcessCitations): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Aponta função citada em PROCESSES.md que não existe no código (`PROCESS_CITES_UNKNOWN_FUNCTION`).
- **Input:** `functions`: registro; `citations`: citações por processo.
- **Output:** Lista de `Issue`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `checkStructure`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkStructure(versionedDirs: readonly string[], structureMarkdown: string): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Aponta pasta versionada ausente de STRUCTURE.md (`DIR_UNDOCUMENTED`).
- **Input:** `versionedDirs`: pastas com barra final; `structureMarkdown`: texto do STRUCTURE.md.
- **Output:** Lista de `Issue`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `checkUiComponents`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkUiComponents(components: readonly string[], uiMarkdown: string | null): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Aponta componente de UI sem menção em UI.md (`COMPONENT_UNDOCUMENTED`) ou UI.md ausente quando há componentes (`UI_DOC_MISSING`).
- **Input:** `components`: nomes dos componentes; `uiMarkdown`: texto do UI.md ou `null`.
- **Output:** Lista de `Issue` (vazia sem componentes).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `checkTests`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkTests(inventory: Inventory): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Aponta função cujo nome não aparece em nenhum arquivo de teste e não está nas exceções (`FUNCTION_UNTESTED`), e exceção que cita função inexistente (`STALE_TEST_EXCEPTION`).
- **Input:** `inventory`: inventário.
- **Output:** Lista de `Issue`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `checkConstants`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkConstants(inventory: Inventory, functionsMarkdown: string): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Aponta constante exportada ausente da tabela "Data and constants" (`CONSTANT_UNDOCUMENTED`); só o trecho a partir desse heading conta.
- **Input:** `inventory`: inventário; `functionsMarkdown`: texto do FUNCTIONS.md.
- **Output:** Lista de `Issue`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `runAllChecks`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `runAllChecks(inventory: Inventory, docs: DocsTexts, citations: ProcessCitations): Issue[]`
- **Used by:** `runCheck()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Extrai as seções do FUNCTIONS.md e roda todas as checagens puras, concatenando os problemas na ordem fixa.
- **Input:** `inventory`: inventário; `docs`: textos dos documentos; `citations`: citações de processos.
- **Output:** Lista completa de `Issue`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `tools/docs/cli.ts`

### `runDocsCli`

<!-- generated:start -->

- **File:** `tools/docs/cli.ts`
- **Signature:** `async runDocsCli(args: readonly string[]): Promise<number>`
- **Used by:** `tools/docs/cli.ts (module)`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Interpreta o comando (`check` padrão ou `generate`), executa e imprime o resultado.
- **Input:** `args`: argumentos da linha de comando.
- **Output:** Código de saída: 0 ok, 1 problemas, 2 comando desconhecido.
- **Effects:** Escreve no stdout/stderr; `generate` regrava FUNCTIONS.md.
- **Errors:** Propaga erros de configuração para o processo (sai com erro).

## `tools/docs/config.ts`

### `mergeDocsConfig`

<!-- generated:start -->

- **File:** `tools/docs/config.ts`
- **Signature:** `mergeDocsConfig(partial: unknown): DocsConfig`
- **Used by:** `loadDocsConfig()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Mescla um objeto parcial sobre `DEFAULT_DOCS_CONFIG` e valida `sourceDirs` e `uiDir`.
- **Input:** `partial`: valor lido do JSON (qualquer tipo).
- **Output:** `DocsConfig` completa.
- **Effects:** Nenhum (pura).
- **Errors:** `Error` com mensagem em português se não for objeto, se `sourceDirs` estiver vazio ou se `uiDir` tiver tipo inválido.

### `loadDocsConfig`

<!-- generated:start -->

- **File:** `tools/docs/config.ts`
- **Signature:** `loadDocsConfig(rootDir: string): DocsConfig`
- **Used by:** `runCheck()`, `runGenerate()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lê `docs.config.json` da raiz e devolve a configuração completa; sem arquivo, usa os padrões.
- **Input:** `rootDir`: raiz do repositório.
- **Output:** `DocsConfig`.
- **Effects:** Lê um arquivo.
- **Errors:** JSON malformado ou inválido (`mergeDocsConfig()`) lança `Error`.

## `tools/docs/inventory.ts`

### `listGitFiles`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `listGitFiles(rootDir: string): string[] | null`
- **Used by:** `listVersionedDirs()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lista arquivos versionados e não ignorados via `git ls-files --cached --others --exclude-standard`.
- **Input:** `rootDir`: raiz.
- **Output:** Lista de caminhos relativos, ou `null` se o git falhar/não existir.
- **Effects:** Executa o git como subprocesso.
- **Errors:** Nenhum (falhas viram `null`).

### `walkFiles`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `walkFiles(rootDir: string, relativeDir = ''): string[]`
- **Used by:** `listUiComponents()`, `listVersionedDirs()`, `readTestFilesText()`, `walkFiles()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Percorre o disco recursivamente listando arquivos, pulando `WALK_IGNORED_DIRS`.
- **Input:** `rootDir`: raiz; `relativeDir`: subpasta (interno, padrão vazio).
- **Output:** Lista de caminhos relativos a `rootDir`.
- **Effects:** Lê diretórios do disco.
- **Errors:** Erros de leitura propagam.

### `dirsFromFiles`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `dirsFromFiles(files: readonly string[]): string[]`
- **Used by:** `listVersionedDirs()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Deriva de uma lista de arquivos todas as pastas, inclusive as intermediárias, com barra final e ordenadas.
- **Input:** `files`: caminhos relativos.
- **Output:** Lista de pastas como `a/`, `a/b/`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `listVersionedDirs`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `listVersionedDirs(rootDir: string): string[]`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lista as pastas versionadas do repositório, pelo git ou, sem git, pelo disco.
- **Input:** `rootDir`: raiz.
- **Output:** Lista de pastas com barra final.
- **Effects:** Git ou leitura de disco.
- **Errors:** Erros de leitura propagam.

### `readTestFilesText`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `readTestFilesText(rootDir: string, config: DocsConfig): string`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Concatena o conteúdo de todos os arquivos de teste das pastas de código (pelo sufixo configurado).
- **Input:** `rootDir`: raiz; `config`: configuração.
- **Output:** Texto único com todos os testes.
- **Effects:** Lê arquivos do disco.
- **Errors:** Erros de leitura propagam.

### `listUiComponents`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `listUiComponents(rootDir: string, config: DocsConfig): string[]`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lista nomes de componentes de UI: arquivos `.tsx` da pasta `uiDir`, sem os de teste, ordenados.
- **Input:** `rootDir`: raiz; `config`: configuração.
- **Output:** Lista de nomes (vazia se `uiDir` for `null` ou não existir).
- **Effects:** Lê diretórios do disco.
- **Errors:** Nenhum.

### `loadTestExceptions`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `async loadTestExceptions(rootDir: string, config: DocsConfig): Promise<TestExceptionEntry[]>`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Importa dinamicamente o arquivo de exceções de teste e devolve `TEST_EXCEPTIONS`.
- **Input:** `rootDir`: raiz; `config`: configuração.
- **Output:** Promise com a lista de exceções (vazia se o arquivo não existir).
- **Effects:** Importa um módulo em tempo de execução.
- **Errors:** `Error` se `TEST_EXCEPTIONS` não for uma lista.

### `buildInventory`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `async buildInventory(rootDir: string, config: DocsConfig): Promise<Inventory>`
- **Used by:** `runCheck()`, `runGenerate()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Monta o inventário completo: funções, constantes, referências, grafo de chamadas, pastas versionadas, texto dos testes, componentes de UI e exceções.
- **Input:** `rootDir`: raiz; `config`: configuração.
- **Output:** Promise com `Inventory`.
- **Effects:** Lê disco, executa git, importa módulo.
- **Errors:** Propaga erros das etapas.

## `tools/docs/markdown.ts`

### `firstGroup`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `firstGroup(match: RegExpMatchArray): string`
- **Used by:** `checkManualFields()`, `extractBacktickedNames()`, `extractCalledNames()`, `extractDocumentedDirs()`, `extractFunctionSections()`, `extractProcessCitations()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Devolve o primeiro grupo de captura de um match de regex, ou string vazia.
- **Input:** `match`: resultado de `exec`/`matchAll`.
- **Output:** Texto do grupo 1.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `stripCodeBlocks`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `stripCodeBlocks(markdown: string): string`
- **Used by:** `extractBacktickedNames()`, `extractCalledNames()`, `extractDocumentedDirs()`, `extractFunctionSections()`, `extractProcessCitations()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Remove blocos de código cercados por ``` ou ~~~ para que exemplos não contem como citações.
- **Input:** `markdown`: texto.
- **Output:** Texto sem os blocos.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `extractCalledNames`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `extractCalledNames(text: string): Set<string>`
- **Used by:** `extractProcessCitations()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Extrai nomes citados como `` `nome()` `` fora de blocos de código.
- **Input:** `text`: markdown.
- **Output:** `Set` de nomes.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `sliceBetween`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `sliceBetween(text: string, start: string, end: string): string | null`
- **Used by:** `buildSection()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Extrai o texto entre dois marcadores, sem espaços nas pontas.
- **Input:** `text`; `start` e `end`: marcadores.
- **Output:** Miolo, ou `null` se algum marcador faltar.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `replaceBetween`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `replaceBetween(text: string, markers: readonly [string, string], content: string): string`
- **Used by:** `applyGenerated()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Substitui o conteúdo entre dois marcadores, mantendo-os; sem marcadores devolve o texto intacto.
- **Input:** `text`; `markers`: par início/fim; `content`: novo miolo.
- **Output:** Texto atualizado.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `extractFunctionSections`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `extractFunctionSections(markdown: string): FunctionSection[]`
- **Used by:** `applyGenerated()`, `pruneOrphanSections()`, `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Divide o markdown em seções `### \`nome\``, registrando o heading `## ...` acima de cada uma, o bloco gerado e o texto manual; ignora blocos de código.
- **Input:** `markdown`: texto do FUNCTIONS.md.
- **Output:** Lista de `FunctionSection`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `buildSection`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `buildSection(name: string, moduleHeading: string | null, raw: string): FunctionSection`
- **Used by:** `extractFunctionSections()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Monta uma `FunctionSection` a partir do texto bruto de uma seção, separando bloco gerado e texto manual.
- **Input:** `name`; `moduleHeading` (ou `null`); `raw`: texto da seção.
- **Output:** `FunctionSection`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `extractProcessCitations`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `extractProcessCitations(markdown: string): ProcessCitations`
- **Used by:** `generateFunctionsDoc()`, `runCheck()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lê PROCESSES.md: para cada heading `## Pnn ...`, as funções citadas como `` `nome()` ``.
- **Input:** `markdown`: texto do PROCESSES.md.
- **Output:** `ProcessCitations` (id → nomes).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `extractDocumentedDirs`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `extractDocumentedDirs(markdown: string): Set<string>`
- **Used by:** `checkStructure()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lê as pastas documentadas em STRUCTURE.md: trechos em crase terminados em `/`.
- **Input:** `markdown`: texto do STRUCTURE.md.
- **Output:** `Set` de pastas.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `extractBacktickedNames`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `extractBacktickedNames(markdown: string): Set<string>`
- **Used by:** `checkConstants()`, `checkUiComponents()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lê identificadores simples em crase (`` `Nome` ``) fora de blocos de código.
- **Input:** `markdown`: texto.
- **Output:** `Set` de nomes.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `tools/docs/render.ts`

### `formatList`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `formatList(items: readonly string[]): string`
- **Used by:** `renderGeneratedBlock()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Formata uma lista para markdown: itens em crase separados por vírgula, ou `—` se vazia.
- **Input:** `items`: textos.
- **Output:** Texto formatado.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `renderGeneratedBlock`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `renderGeneratedBlock(info: FunctionInfo, data: GeneratedData): string`
- **Used by:** `applyGenerated()`, `checkGeneratedBlocks()`, `renderNewSection()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Renderiza as quatro linhas do bloco gerado (Arquivo, Assinatura, Usada por, Processos).
- **Input:** `info`: função; `data`: usada-por e processos calculados.
- **Output:** Texto do bloco, sem os marcadores.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `renderNewSection`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `renderNewSection(info: FunctionInfo, data: GeneratedData): string`
- **Used by:** `applyGenerated()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Renderiza uma seção nova completa: heading, bloco gerado com marcadores e campos manuais com o marcador `PLACEHOLDER`.
- **Input:** `info`: função; `data`: dados gerados.
- **Output:** Texto da seção.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `renderModuleIndex`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `renderModuleIndex(functions: readonly FunctionInfo[]): string`
- **Used by:** `applyGenerated()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Renderiza o índice por módulo: uma linha por arquivo com links para suas funções.
- **Input:** `functions`: registro.
- **Output:** Texto do índice.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `computeGeneratedData`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `computeGeneratedData(name: string, references: ReferenceIndex, processesByFunction: ReadonlyMap<string, ReadonlySet<string>>): GeneratedData`
- **Used by:** `checkGeneratedBlocks()`, `generateFunctionsDoc()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Calcula "Usada por" e "Processos" de uma função, ordenados, a partir do índice de referências e do mapa função → processos.
- **Input:** `name`; `references`; `processesByFunction`.
- **Output:** `GeneratedData`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `closureOf`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `closureOf(graph: CallGraph, roots: ReadonlySet<string>): Set<string>`
- **Used by:** `processesByFunction()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Fecho transitivo em um grafo: as raízes mais tudo o que elas chamam, direta ou indiretamente.
- **Input:** `graph`: grafo de chamadas; `roots`: nomes iniciais.
- **Output:** `Set` com todos os alcançados (inclui raízes).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `processesByFunction`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `processesByFunction(citations: ProcessCitations, graph: CallGraph): Map<string, Set<string>>`
- **Used by:** `checkGeneratedBlocks()`, `generateFunctionsDoc()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Inverte as citações: para cada processo, expande o fecho das funções citadas e registra o processo em cada uma.
- **Input:** `citations`: processo → citadas; `graph`: grafo de chamadas.
- **Output:** `Map` função → ids de processo.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `replaceSectionBlock`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `replaceSectionBlock(markdown: string, name: string, block: string): string`
- **Used by:** `applyGenerated()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Substitui o bloco gerado da seção de uma função específica.
- **Input:** `markdown`; `name`; `block`: novo conteúdo.
- **Output:** Texto atualizado (intacto se a seção não existir).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `appendSection`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `appendSection(markdown: string, info: FunctionInfo, section: string): string`
- **Used by:** `applyGenerated()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Acrescenta uma seção nova sob o heading `## arquivo` da função, antes do próximo heading; cria o heading antes da tabela de dados se faltar.
- **Input:** `markdown`; `info`: função; `section`: texto da seção.
- **Output:** Texto atualizado.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `insertBeforeDataTable`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `insertBeforeDataTable(markdown: string, text: string): string`
- **Used by:** `appendSection()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Insere texto antes de `## Data and constants`, ou no fim se a tabela não existir.
- **Input:** `markdown`; `text`.
- **Output:** Texto atualizado.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `applyGenerated`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `applyGenerated(markdown: string, functions: readonly FunctionInfo[], dataOf: (name: string) => GeneratedData): string`
- **Used by:** `generateFunctionsDoc()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Aplica o gerador ao FUNCTIONS.md: atualiza o índice, substitui blocos gerados existentes e acrescenta seções para funções novas.
- **Input:** `markdown`: texto atual; `functions`: registro; `dataOf`: função que calcula os dados gerados por nome.
- **Output:** Novo texto do FUNCTIONS.md.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `removeSection`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `removeSection(markdown: string, name: string): string`
- **Used by:** `pruneOrphanSections()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Remove a seção da função (heading `###` com o nome) inteira, do heading até o próximo heading `##`/`###` ou o fim do texto.
- **Input:** `markdown`: texto do FUNCTIONS.md; `name`: nome da função.
- **Output:** Markdown sem a seção (intacto se ela não existir).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `removeEmptyModules`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `removeEmptyModules(markdown: string): string`
- **Used by:** `pruneOrphanSections()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Remove headings de módulo (`##` com o caminho do arquivo) sem nenhuma seção abaixo e normaliza para uma única quebra de linha final.
- **Input:** `markdown`: texto do FUNCTIONS.md.
- **Output:** Markdown sem módulos vazios.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `pruneOrphanSections`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `pruneOrphanSections(markdown: string, functions: readonly FunctionInfo[]): string`
- **Used by:** `applyGenerated()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Remove as seções de funções que não existem mais no código e, se removeu alguma, os módulos que ficaram vazios.
- **Input:** `markdown`: texto do FUNCTIONS.md; `functions`: funções do inventário.
- **Output:** Markdown podado (o mesmo texto se não houver órfãs).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `tools/docs/run.ts`

### `readOptional`

<!-- generated:start -->

- **File:** `tools/docs/run.ts`
- **Signature:** `readOptional(rootDir: string, relativePath: string): string | null`
- **Used by:** `readDocsTexts()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lê um arquivo de texto relativo à raiz, ou `null` se não existir.
- **Input:** `rootDir`; `relativePath`.
- **Output:** Conteúdo ou `null`.
- **Effects:** Lê um arquivo.
- **Errors:** Erros de leitura (fora de "não existe") propagam.

### `readDocsTexts`

<!-- generated:start -->

- **File:** `tools/docs/run.ts`
- **Signature:** `readDocsTexts(rootDir: string, config: DocsConfig): DocsTexts`
- **Used by:** `runCheck()`, `runGenerate()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lê FUNCTIONS, PROCESSES, STRUCTURE (vazios se ausentes) e UI (`null` se ausente).
- **Input:** `rootDir`; `config`.
- **Output:** `DocsTexts`.
- **Effects:** Lê arquivos.
- **Errors:** Erros de leitura propagam.

### `formatIssues`

<!-- generated:start -->

- **File:** `tools/docs/run.ts`
- **Signature:** `formatIssues(issues: readonly Issue[]): string`
- **Used by:** `runDocsCli()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Formata os problemas para o terminal: `✔` sem problemas, ou lista numerada `[CODIGO] mensagem`.
- **Input:** `issues`: lista de `Issue`.
- **Output:** Texto pronto para imprimir.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `runCheck`

<!-- generated:start -->

- **File:** `tools/docs/run.ts`
- **Signature:** `async runCheck(rootDir: string): Promise<Issue[]>`
- **Used by:** `runDocsCli()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Executa a checagem completa: carrega configuração, inventário e documentos e roda `runAllChecks()`.
- **Input:** `rootDir`: raiz.
- **Output:** Promise com a lista de `Issue`.
- **Effects:** Lê disco, executa git, importa módulo.
- **Errors:** Propaga erros de configuração.

### `generateFunctionsDoc`

<!-- generated:start -->

- **File:** `tools/docs/run.ts`
- **Signature:** `generateFunctionsDoc(inventory: Inventory, docs: DocsTexts): string`
- **Used by:** `runGenerate()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Calcula o novo texto do FUNCTIONS.md a partir do inventário e dos documentos atuais.
- **Input:** `inventory`; `docs`: textos.
- **Output:** Novo texto do FUNCTIONS.md.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `runGenerate`

<!-- generated:start -->

- **File:** `tools/docs/run.ts`
- **Signature:** `async runGenerate(rootDir: string): Promise<boolean>`
- **Used by:** `runDocsCli()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Regrava o FUNCTIONS.md com índice, blocos gerados e seções novas, só se houver mudança.
- **Input:** `rootDir`: raiz.
- **Output:** Promise com `true` se o arquivo mudou.
- **Effects:** Lê e grava `docs/FUNCTIONS.md`.
- **Errors:** Propaga erros de configuração e de escrita.

## `connectors/canvas-puc/src/client.ts`

### `unauthorizedMessage`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `unauthorizedMessage(baseUrl: string): string`
- **Used by:** `requestCanvas()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Monta a mensagem de erro para 401: o token venceu ou foi revogado.
- **Input:** `baseUrl`: URL base do Canvas (para o link de gerar token).
- **Output:** Texto pedindo para gerar outro token e reconectar o conector nas configurações do Claude.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `sendCanvasRequest`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `sendCanvasRequest(deps: ClientDeps, req: CanvasRequest): Promise<Response>`
- **Used by:** `requestCanvas()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Envia uma requisição à API do Canvas com o token (`Authorization: Bearer`), sem tratar o status.
- **Input:** `deps`: URL base, token e `fetchFn`; `req`: método, caminho, parâmetros e corpo opcional.
- **Output:** Promise com a `Response` crua.
- **Effects:** Rede (via `deps.fetchFn`).
- **Errors:** Propaga a rejeição de `fetchFn`.

### `collectPages`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async collectPages(deps: ClientDeps, first: CanvasRequest, max: number): Promise<T[]>`
- **Used by:** `createCanvasClient()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Busca todas as páginas de uma listagem seguindo o header `Link`, até `max` itens.
- **Input:** `deps`: dependências do cliente; `first`: primeira requisição; `max`: limite de itens.
- **Output:** Promise com até `max` itens (resposta não-lista vira um item); lista vazia se não houver.
- **Effects:** Rede (uma requisição por página).
- **Errors:** Propaga erros de `requestCanvas()` e de JSON inválido.

### `fetchPlainText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async fetchPlainText(fetchFn: typeof fetch, url: string): Promise<string>`
- **Used by:** `createCanvasClient()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Baixa um arquivo de texto por URL direta.
- **Input:** `fetchFn`: função `fetch`; `url`: link de download (já autorizado pelo Canvas).
- **Output:** Promise com o conteúdo do arquivo.
- **Effects:** Rede.
- **Errors:** Rejeita com "Falha ao baixar o arquivo (<status>)" se a resposta não for ok.

### `createCanvasClient`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `createCanvasClient(deps: ClientDeps): CanvasClient`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Cria o cliente do Canvas usado pelas ferramentas.
- **Input:** `deps`: URL base, token e `fetchFn`.
- **Output:** `CanvasClient` com `get`, `getAll` (página de `CANVAS_PAGE_SIZE`, limite `DEFAULT_MAX_ITEMS`), `post` e `fetchText`.
- **Effects:** Nenhum na criação; os métodos fazem rede.
- **Errors:** Nenhum na criação; os métodos propagam erros das requisições.

### `fetchDownload`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async fetchDownload(fetchFn: typeof fetch, url: string): Promise<Response>`
- **Used by:** `fetchFileBytes()`, `fetchPlainText()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Baixa um link direto do Canvas e confere o status.
- **Input:** `fetchFn`: função `fetch`; `url`: link de download (já autorizado pelo Canvas).
- **Output:** Promise com a `Response` ok.
- **Effects:** Rede.
- **Errors:** Rejeita com "Falha ao baixar o arquivo (<status>)" se a resposta não for ok.

### `fetchFileBytes`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async fetchFileBytes(fetchFn: typeof fetch, url: string): Promise<Uint8Array>`
- **Used by:** `createCanvasClient()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Baixa um arquivo binário por URL direta.
- **Input:** `fetchFn`; `url`.
- **Output:** Promise com os bytes.
- **Effects:** Rede.
- **Errors:** Repassa o erro de `fetchDownload`.

### `requestCanvas`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async requestCanvas(deps: ClientDeps, req: CanvasRequest): Promise<Response>`
- **Used by:** `collectPages()`, `createCanvasClient()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Envia uma requisição à API do Canvas com o token e confere o status.
- **Input:** `deps`: URL base, token e `fetchFn`; `req`: método, caminho, parâmetros e corpo opcional.
- **Output:** Promise com a `Response` 2xx.
- **Effects:** Rede (via `deps.fetchFn`).
- **Errors:** Rejeita com `unauthorizedMessage()` em 401 e com "Canvas <status> em <método> <caminho>: <corpo>" em outro status fora de 2xx.

## `connectors/canvas-puc/src/format.ts`

### `shortText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `shortText(html: string | null | undefined): string`
- **Used by:** `toAnnouncement()`, `toCalendarEvent()`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converte HTML em texto cortado em `MAX_TEXT_LENGTH` caracteres.
- **Input:** `html`: HTML, `null` ou `undefined`.
- **Output:** Texto de até `MAX_TEXT_LENGTH` caracteres; `''` para entrada vazia.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toProfile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toProfile(p: CanvasProfile): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converte o perfil do Canvas em visualização enxuta.
- **Input:** `p`: perfil do usuário da API.
- **Output:** `View` com `id`, `name`, `email`, `login` e `time_zone`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toCourse`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toCourse(c: CanvasCourse): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converte um curso em visualização com a nota atual da matrícula do aluno.
- **Input:** `c`: curso da API (com `enrollments` e `term` opcionais).
- **Output:** `View` com `id`, `name`, `code`, `term`, `current_score` e `current_grade` (`null` sem matrícula).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toSubmissionFlags`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toSubmissionFlags(flags: CanvasSubmissionFlags | false | undefined): View | null`
- **Used by:** `toPlannerItem()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converte o status de entrega de um item da agenda.
- **Input:** `flags`: status da API, `false` ou `undefined`.
- **Output:** `View` com `submitted`, `late`, `missing` e `graded`; `null` se o item não tem entrega.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toPlannerItem`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toPlannerItem(i: CanvasPlannerItem, baseUrl: string): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converte um item da agenda do aluno em visualização com link absoluto.
- **Input:** `i`: item do planner; `baseUrl`: URL base do Canvas.
- **Output:** `View` com `type`, `title`, `course`, `course_id`, `id`, `date`, `points`, `submission` e `url` (`undefined` sem `html_url`).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toAssignmentSummary`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toAssignmentSummary(a: CanvasAssignment): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converte uma tarefa de listagem em visualização com status e nota da entrega.
- **Input:** `a`: tarefa da API (com `submission` opcional).
- **Output:** `View` com `id`, `name`, `due_at`, `points`, `submission_types`, `status`, `score`, `late` e `missing` (`null` sem entrega).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toRubricCriterion`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toRubricCriterion(r: CanvasRubricCriterion): View`
- **Used by:** `toAssignmentDetail()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converte um critério de rubrica com seus níveis como `pontos: descrição`.
- **Input:** `r`: critério da API.
- **Output:** `View` com `criterion`, `points` e `ratings` (lista vazia sem níveis).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toFileInfo`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toFileInfo(f: CanvasAttachment): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `toSubmissionDetail()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converte um anexo em visualização com tamanho em KB.
- **Input:** `f`: anexo/arquivo da API.
- **Output:** `View` com `id`, `name`, `content_type`, `size_kb` (0 sem tamanho), `updated_at` e `download`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toSubmissionDetail`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toSubmissionDetail(s: CanvasSubmission): View`
- **Used by:** `toAssignmentDetail()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converte uma entrega do aluno com nota, comentários, rubrica e anexos.
- **Input:** `s`: entrega da API.
- **Output:** `View` com `status`, `submitted_at`, `score`, `grade`, `late`, `comments`, `rubric_assessment` (`null` se ausente) e `attachments`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toAssignmentDetail`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toAssignmentDetail(a: CanvasAssignment, submission: CanvasSubmission | null): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converte uma tarefa completa com enunciado em texto, datas, rubrica e entrega.
- **Input:** `a`: tarefa da API; `submission`: entrega do aluno ou `null`.
- **Output:** `View` com datas (`due_at`, `unlock_at`, `lock_at`), `points`, `description`, `rubric` e `submission` (`null` sem entrega).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toGradeRow`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toGradeRow(s: CanvasSubmission): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converte uma entrega (com `assignment` incluído) em linha de nota.
- **Input:** `s`: entrega de `students/submissions` com `include[]=assignment`.
- **Output:** `View` com `assignment`, `assignment_id`, `score`, `points_possible`, `grade`, `status` e `due_at`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toEnrollmentGrade`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toEnrollmentGrade(e: CanvasEnrollment, courseNames: ReadonlyMap<string, string>): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converte o resumo de notas de uma matrícula, com o nome do curso.
- **Input:** `e`: matrícula da API; `courseNames`: mapa id → nome do curso.
- **Output:** `View` com `course_id`, `course` (`undefined` se fora do mapa), `current_score`, `current_grade` e `final_score`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toAnnouncement`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toAnnouncement(a: CanvasAnnouncement): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converte um aviso do curso com o texto convertido e cortado.
- **Input:** `a`: aviso da API.
- **Output:** `View` com `id`, `title`, `course`, `author`, `posted_at`, `text` (via `shortText()`) e `url`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toModuleItem`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toModuleItem(i: CanvasModuleItem): View`
- **Used by:** `toModule()`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converte um item de módulo em visualização.
- **Input:** `i`: item de módulo da API.
- **Output:** `View` com `id`, `type`, `title`, `content_id`, `page_url`, `external_url` e `completed` (`null` sem requisito).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toModule`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toModule(m: CanvasModule): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converte um módulo com seus itens.
- **Input:** `m`: módulo da API.
- **Output:** `View` com `id`, `name` e `items` (lista vazia sem itens).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toDiscussionSummary`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toDiscussionSummary(d: CanvasDiscussionTopic): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converte um fórum de discussão de listagem em visualização.
- **Input:** `d`: tópico de discussão da API.
- **Output:** `View` com `id`, `title`, `due_at` (`null` sem tarefa), `reply_count`, `unread_count`, `last_reply_at` e `url`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `flattenDiscussion`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `flattenDiscussion(entries: readonly CanvasDiscussionEntry[] | undefined, names: ReadonlyMap<string, string>, depth = 0): { depth: number; author: string | undefined; date: string | undefined; text: string }[]`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `flattenDiscussion()`
- **Processes:** —

<!-- generated:end -->

- **Does:** Achata a árvore de postagens de um fórum, marcando o nível de cada resposta.
- **Input:** `entries`: postagens (ou `undefined`); `names`: mapa id → nome do autor; `depth`: nível inicial (padrão 0).
- **Output:** Lista em pré-ordem de `{ depth, author, date, text }`; vazia sem postagens.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toCalendarEvent`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toCalendarEvent(e: CanvasCalendarEvent): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converte um evento do calendário com descrição em texto curto.
- **Input:** `e`: evento da API.
- **Output:** `View` com `title`, `start_at`, `end_at`, `location`, `course` e `description` de até 1000 caracteres.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/canvas-puc/src/helpers.ts`

### `isoDaysFrom`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `isoDaysFrom(now: Date, days: number): string`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Calcula a data/hora ISO `days` dias depois de `now`.
- **Input:** `now`: data de referência; `days`: número de dias (negativo vai para trás).
- **Output:** Texto ISO 8601 em UTC.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `dateOnly`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `dateOnly(iso: string): string`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Extrai a parte `AAAA-MM-DD` de uma data ISO.
- **Input:** `iso`: data ISO.
- **Output:** Os 10 primeiros caracteres.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `courseContextCodes`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `courseContextCodes(ids: readonly Id[]): string[]`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Monta os códigos de contexto `course_<id>` usados por avisos e calendário.
- **Input:** `ids`: ids de curso.
- **Output:** Lista de códigos na mesma ordem; vazia para lista vazia.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `courseNameMap`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `courseNameMap(courses: readonly CanvasCourse[]): Map<string, string>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Monta o mapa id → nome dos cursos.
- **Input:** `courses`: cursos da API.
- **Output:** `Map` com id em texto e nome (`''` sem nome).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `participantNames`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `participantNames(view: CanvasDiscussionView): Map<string, string>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Monta o mapa id → nome dos participantes de um fórum.
- **Input:** `view`: visão completa da discussão.
- **Output:** `Map` com id em texto e nome (`''` sem nome); vazio sem participantes.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `isTextFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `isTextFile(contentType: string, name: string): boolean`
- **Used by:** `readCanvasFileText()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Decide se um arquivo pode ser lido como texto, pelo tipo MIME ou pela extensão.
- **Input:** `contentType`: tipo MIME; `name`: nome do arquivo.
- **Output:** `true` para MIME `text/`, json, xml, javascript, csv ou extensões de texto/código; senão `false`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `matchModuleItems`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `matchModuleItems(modules: readonly CanvasModule[], term: string): ModuleMatch[]`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Encontra os itens de módulo cujo título contém o termo, sem diferenciar maiúsculas.
- **Input:** `modules`: módulos com itens; `term`: termo buscado.
- **Output:** Lista de `ModuleMatch` (`module`, `title`, `type`); vazia sem resultados.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `activeCourses`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `activeCourses(client: CanvasClient): Promise<CanvasCourse[]>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Busca os cursos ativos do aluno.
- **Input:** `client`: cliente do Canvas.
- **Output:** Promise com a lista de cursos (`enrollment_state=active`).
- **Effects:** Rede.
- **Errors:** Propaga erros do cliente.

### `fetchOwnSubmission`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `async fetchOwnSubmission(client: CanvasClient, courseId: Id, assignmentId: Id): Promise<CanvasSubmission | null>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Busca a entrega do próprio aluno numa tarefa, com comentários e rubrica.
- **Input:** `client`: cliente do Canvas; `courseId`: id do curso; `assignmentId`: id da tarefa.
- **Output:** Promise com a `CanvasSubmission`; `null` se a busca falhar (sem acesso).
- **Effects:** Rede.
- **Errors:** Nenhum (falhas viram `null`).

### `getAllOrEmpty`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `getAllOrEmpty(client: CanvasClient, path: string, params: Record<string, string | readonly string[]>): Promise<T[]>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Busca uma listagem paginada, trocando falha por lista vazia.
- **Input:** `client`: cliente do Canvas; `path`: caminho da API; `params`: parâmetros de query.
- **Output:** Promise com os itens; lista vazia se a busca falhar.
- **Effects:** Rede.
- **Errors:** Nenhum (falhas viram `[]`).

## `connectors/canvas-puc/src/tools-write.ts`

### `submissionPayload`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/tools-write.ts`
- **Signature:** `submissionPayload(kind: 'text' | 'url', content: string): { submission: Readonly<Record<string, string>> }`
- **Used by:** `connectors/canvas-puc/src/tools-write.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Monta o corpo de entrega para o tipo escolhido.
- **Input:** `kind`: `text` (HTML aceito) ou `url`; `content`: texto ou link.
- **Output:** `{ submission }` com `online_text_entry` e `body`, ou `online_url` e `url`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/canvas-puc/src/tools.ts`

### `canvasTools`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/tools.ts`
- **Signature:** `canvasTools(allowWrite: boolean): readonly ToolSpec<CanvasContext>[]`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Seleciona as ferramentas do Canvas a registrar.
- **Input:** `allowWrite`: se as ferramentas de escrita entram.
- **Output:** `CANVAS_READ_TOOLS`, mais `CANVAS_WRITE_TOOLS` quando `allowWrite` é `true`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `createCanvasMcpServer`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/tools.ts`
- **Signature:** `createCanvasMcpServer(specs: readonly ToolSpec<CanvasContext>[], ctx: CanvasContext): McpServer`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Cria o `McpServer` do Canvas com as ferramentas ligadas ao contexto.
- **Input:** `specs`: ferramentas; `ctx`: cliente e relógio.
- **Output:** Servidor MCP ainda não conectado.
- **Effects:** Nenhum além de criar o objeto.
- **Errors:** Nenhum.

## `src/core/env.ts`

### `envValue`

<!-- generated:start -->

- **File:** `src/core/env.ts`
- **Signature:** `envValue(env: EnvVars, key: string): string | null`
- **Used by:** `containerEnvVars()`, `publicOrigin()`, `readAllowedEmails()`, `readCanvasRemoteSettings()`, `readGmailSettings()`, `readIntInRange()`, `readOAuthSettings()`, `readPublicUrl()`, `readRemoteServerConfig()`, `readSendAllowlist()`, `readSendSettings()`, `readSleepAfter()`, `readWhatsAppSettings()`, `requiredSecret()`, `requireEnv()`, `resolveIssuer()`
- **Processes:** P08, P10, P12, P13, P17

<!-- generated:end -->

- **Does:** Lê uma variável de ambiente, tratando vazio ou placeholder `${...}` como ausente.
- **Input:** `env`: variáveis de ambiente; `key`: nome da variável.
- **Output:** Valor sem espaços nas pontas; `null` se ausente, vazio ou começando com `${`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `parseFlag`

<!-- generated:start -->

- **File:** `src/core/env.ts`
- **Signature:** `parseFlag(value: string | null): boolean`
- **Used by:** `readCanvasRemoteSettings()`, `readSendSettings()`
- **Processes:** P08, P13, P17

<!-- generated:end -->

- **Does:** Interpreta uma opção liga/desliga.
- **Input:** `value`: texto da opção ou `null`.
- **Output:** `true` para `1`, `true`, `sim` ou `yes` (sem diferenciar maiúsculas); senão `false`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toEnvVars`

<!-- generated:start -->

- **File:** `src/core/env.ts`
- **Signature:** `toEnvVars(env: Readonly<Record<string, unknown>>): EnvVars`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`, `createGmailDeps()`, `handleWhatsAppFetch()`, `handleWorkerFetch()`, `publicOrigin()`, `runScheduledSync()`
- **Processes:** P08, P10, P12, P13, P17

<!-- generated:end -->

- **Does:** Converte o ambiente do Worker em variáveis de texto.
- **Input:** `env`: variáveis, secrets e bindings do Worker.
- **Output:** Só as entradas cujo valor é texto.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `src/core/html.ts`

### `htmlToText`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `htmlToText(html: string | null | undefined): string`
- **Used by:** `attachmentBytesToText()`, `connectors/canvas-puc/src/tools-read.ts (module)`, `docxXmlToText()`, `flattenDiscussion()`, `messageBodyText()`, `readCanvasFileText()`, `shortText()`, `toAssignmentDetail()`
- **Processes:** P03, P12, P18

<!-- generated:end -->

- **Does:** Converte HTML em texto simples, preservando parágrafos e listas como quebras de linha.
- **Input:** `html`: HTML, `null` ou `undefined`.
- **Output:** Texto sem tags, com entidades decodificadas e sem espaços nas pontas; `''` para entrada vazia.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `src/core/http.ts`

### `buildUrl`

<!-- generated:start -->

- **File:** `src/core/http.ts`
- **Signature:** `buildUrl(base: string, path: string, params: QueryParams = {}): URL`
- **Used by:** `sendCanvasRequest()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Monta a URL de uma requisição a partir de base, caminho e parâmetros.
- **Input:** `base`: URL base; `path`: caminho relativo ou URL absoluta (`http...`); `params`: query (padrão `{}`).
- **Output:** `URL` com parâmetros; listas viram `chave[]=...`; `null`/`undefined` são omitidos.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `TypeError` se a URL resultante for inválida.

### `parseNextLink`

<!-- generated:start -->

- **File:** `src/core/http.ts`
- **Signature:** `parseNextLink(linkHeader: string | null): string | null`
- **Used by:** `collectPages()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Extrai a URL `rel="next"` de um header `Link` de paginação.
- **Input:** `linkHeader`: valor do header ou `null`.
- **Output:** URL da próxima página; `null` se não houver header ou `next`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `src/mcp/tools.ts`

### `defineTool`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `defineTool(def: ToolDefinition<C, S>): ToolSpec<C>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `connectors/canvas-puc/src/tools-write.ts (module)`, `connectors/gmail/src/draft-tools.ts (module)`, `connectors/gmail/src/mailbox-tools.ts (module)`, `connectors/gmail/src/send-tools.ts (module)`, `connectors/gmail/src/tools.ts (module)`, `connectors/whatsapp/src/tools.ts (module)`, `replyTool()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Cria uma `ToolSpec` que valida os argumentos com o `shape` antes de chamar `run`.
- **Input:** `def`: nome, descrição, `shape` zod, `annotations` obrigatórias (`title` e dicas, de `toolAnnotations`) e `run` tipado.
- **Output:** `ToolSpec` com `run` que aceita argumentos crus (`undefined` vira `{}`).
- **Effects:** Nenhum na criação.
- **Errors:** O `run` devolvido rejeita com `ZodError` para argumentos inválidos e propaga erros de `def.run`.

### `textResult`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `textResult(data: unknown, notes: readonly string[] = []): CallToolResult`
- **Used by:** `toToolResult()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14

<!-- generated:end -->

- **Does:** Converte o retorno de uma ferramenta em resultado MCP de texto.
- **Input:** `data`: texto ou valor serializável; `notes`: textos extras (padrão vazio).
- **Output:** `CallToolResult` com um bloco de texto (JSON indentado se não for string) mais um por nota.
- **Effects:** Nenhum (pura).
- **Errors:** Lança se `data` não for serializável em JSON (ex.: referência circular).

### `errorResult`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `errorResult(error: unknown): CallToolResult`
- **Used by:** `runToolSafely()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14

<!-- generated:end -->

- **Does:** Converte um erro em resultado MCP com `isError`.
- **Input:** `error`: qualquer valor lançado.
- **Output:** `CallToolResult` com `isError: true` e a mensagem do erro (ou `String(error)`).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `runToolSafely`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `async runToolSafely(spec: ToolSpec<C>, ctx: C, rawArgs: unknown): Promise<CallToolResult>`
- **Used by:** `registerToolSpecs()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14

<!-- generated:end -->

- **Does:** Executa uma ferramenta convertendo sucesso ou falha em resultado MCP.
- **Input:** `spec`: ferramenta; `ctx`: contexto do conector; `rawArgs`: argumentos crus.
- **Output:** Promise com `textResult()` no sucesso ou `errorResult()` na falha.
- **Effects:** Os efeitos da própria ferramenta.
- **Errors:** Nenhum (erros viram `errorResult`).

### `registerToolSpecs`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `registerToolSpecs(server: McpServer, specs: readonly ToolSpec<C>[], ctx: C): void`
- **Used by:** `createCanvasMcpServer()`, `createGmailServer()`, `createWhatsAppMcpServer()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14

<!-- generated:end -->

- **Does:** Registers each `ToolSpec` on the MCP server, with its title and annotations, bound to the connector context.
- **Input:** `server`: servidor MCP; `specs`: ferramentas; `ctx`: contexto passado a cada execução.
- **Output:** Nada.
- **Effects:** Altera o servidor (registra as ferramentas).
- **Errors:** Propaga erros do SDK (ex.: nome repetido).

### `rawToolResult`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `rawToolResult(result: CallToolResult): RawToolResult`
- **Used by:** `downloadedFileResult()`, `mediaResult()`
- **Processes:** P03, P14

<!-- generated:end -->

- **Does:** Embrulha um resultado MCP pronto (imagem, recurso embutido) para a ferramenta devolver sem conversão para texto.
- **Input:** `result`: `CallToolResult`.
- **Output:** `RawToolResult`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toToolResult`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `toToolResult(data: unknown): CallToolResult`
- **Used by:** `runToolSafely()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14

<!-- generated:end -->

- **Does:** Converte o retorno de uma ferramenta em resultado MCP: o embrulhado por `rawToolResult` passa direto, o resto vira `textResult`.
- **Input:** `data`: retorno da ferramenta.
- **Output:** `CallToolResult`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `binaryContentBlock`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `binaryContentBlock(mimeType: string, bytes: Uint8Array, uri: string): CallToolResult['content'][number]`
- **Used by:** `fileContentBlock()`, `mediaResult()`
- **Processes:** P03, P14

<!-- generated:end -->

- **Does:** Bloco MCP com um conteúdo binário: imagem, áudio ou, para o resto, recurso embutido com o `uri` dado.
- **Input:** `mimeType`, `bytes` do arquivo e `uri` do recurso.
- **Output:** Bloco `image`, `audio` ou `resource` com os bytes em base64.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/canvas-puc/src/remote-main.ts`

### `startCanvasRemoteServer`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote-main.ts`
- **Signature:** `startCanvasRemoteServer(): void`
- **Used by:** `connectors/canvas-puc/src/remote-main.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Sobe o servidor HTTP do conector Canvas remoto.
- **Input:** Nenhuma (lê o ambiente do processo).
- **Output:** Nada.
- **Effects:** Abre a porta HTTP e escreve no stdout.
- **Errors:** Lança se `PUBLIC_URL` ou `SEAL_KEY` faltarem ou forem inválidas.

## `connectors/canvas-puc/src/remote.ts`

### `readCanvasRemoteSettings`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `readCanvasRemoteSettings(env: EnvVars): CanvasRemoteSettings`
- **Used by:** `createWorkerApp()`, `startCanvasRemoteServer()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Lê a configuração do modo remoto (`CANVAS_BASE_URL`, `CANVAS_ALLOW_WRITE`).
- **Input:** `env`: variáveis de ambiente.
- **Output:** `CanvasRemoteSettings` com URL sem barra final, escrita desligada por padrão e o `fetch` global com o `User-Agent` do conector (`withCanvasUserAgent`).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `canvasLoginText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `canvasLoginText(baseUrl: string): LoginPageText`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Monta os textos da página de autorização do Canvas.
- **Input:** `baseUrl`: endereço do Canvas.
- **Output:** `LoginPageText` com a ajuda apontando para `/profile/settings`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `verifyCanvasToken`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `async verifyCanvasToken(settings: CanvasRemoteSettings, token: string): Promise<void>`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Confere o token chamando `/api/v1/users/self` no Canvas.
- **Input:** `settings`: Canvas e `fetch`; `token`: token colado pelo usuário.
- **Output:** Promessa vazia se o token serve.
- **Effects:** Rede (uma requisição ao Canvas).
- **Errors:** Rejeita com mensagem ao usuário: token vazio, 401, outro status ou falha de rede.

### `canvasRemoteConnector`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `canvasRemoteConnector(settings: CanvasRemoteSettings): RemoteConnector`
- **Used by:** `createWorkerApp()`, `startCanvasRemoteServer()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Monta o `RemoteConnector` do Canvas para o servidor HTTP.
- **Input:** `settings`: configuração do modo remoto.
- **Output:** Textos da página, verificação do token, fábrica de `McpServer` por token e renovação da validade (`renewCanvasToken()`).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `withCanvasUserAgent`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `withCanvasUserAgent(init: RequestInit | undefined): RequestInit`
- **Used by:** `readCanvasRemoteSettings()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Soma o `User-Agent` do conector (`CANVAS_USER_AGENT`) às opções do `fetch`; sem ele o Canvas responde 403, e o `fetch` do Workers não manda um.
- **Input:** `init`: opções do `fetch` (ou `undefined`).
- **Output:** Cópia das opções com os headers originais (nomes em minúsculas) mais `user-agent`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `matchesVisibleToken`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `matchesVisibleToken(visible: string, token: string): boolean`
- **Used by:** `planTokenRenewal()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Diz se o começo visível de um token do Canvas (`visible_token`, ex.: `11748~abcd...`) é o do token dado.
- **Input:** `visible` (campo da lista de tokens) e o token completo.
- **Output:** `true` se o token começa pelo prefixo visível sem as reticências; `false` com prefixo vazio.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `planTokenRenewal`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `planTokenRenewal(list: readonly CanvasTokenInfo[], token: string, now: Date): { readonly id: number; readonly expiresAt: string } | null`
- **Used by:** `renewCanvasToken()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Decide se o token do Canvas precisa ter a validade estendida e para quando (agora + `TOKEN_RENEWAL_SECONDS`).
- **Input:** Lista de `user_generated_tokens`, o token e o instante atual.
- **Output:** `{ id, expiresAt }`, ou nulo se o token não está na lista, não tem validade ou já vence a menos de um dia do limite.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `canvasTokenApi`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `async canvasTokenApi(settings: CanvasRemoteSettings, token: string, request: CanvasTokenRequest): Promise<unknown>`
- **Used by:** `renewCanvasToken()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Chama a API do Canvas com o token do usuário (`Bearer`), enviando corpo JSON se houver.
- **Input:** Configuração remota, token e `CanvasTokenRequest` (`path`, `method` opcional, `body` opcional).
- **Output:** O JSON da resposta.
- **Effects:** Requisição HTTP ao Canvas.
- **Errors:** Rejeita com o status se a resposta não for 2xx; repassa falha de rede.

### `renewCanvasToken`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `async renewCanvasToken(settings: CanvasRemoteSettings, token: string, now: Date): Promise<void>`
- **Used by:** `renewCanvasSecret()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Estende a validade do próprio token no Canvas (Access Tokens API) quando ele está perto de vencer; o Canvas da PUC aceita no máximo 30 dias à frente.
- **Input:** Configuração remota, token e instante atual.
- **Output:** Nada.
- **Effects:** `GET /api/v1/users/self/user_generated_tokens` e, se `planTokenRenewal()` mandar, `PUT /api/v1/users/self/tokens/:id` com `expires_at`.
- **Errors:** Rejeita como `canvasTokenApi()` (quem chama, `renewSecretQuietly()`, só registra o aviso).

### `fetchCanvasSelf`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `fetchCanvasSelf(settings: CanvasRemoteSettings, token: string): Promise<Response>`
- **Used by:** `isCanvasTokenAlive()`, `verifyCanvasToken()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Asks Canvas `/api/v1/users/self` with the token (rejects only on network failure).
- **Input:** `settings`: Canvas address and `fetch`. `token`: the user's Canvas access token.
- **Output:** The raw Canvas `Response` (any status).
- **Effects:** Network: one GET to Canvas.
- **Errors:** Rejects if `fetch` fails (network).

### `isCanvasTokenAlive`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `async isCanvasTokenAlive(settings: CanvasRemoteSettings, token: string): Promise<boolean>`
- **Used by:** `renewCanvasSecret()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Says whether Canvas still accepts the token: only a 401 counts as dead; network or 5xx errors count as alive.
- **Input:** `settings`: Canvas address and `fetch`. `token`: the user's Canvas access token.
- **Output:** `false` only when `/users/self` answers 401; `true` otherwise, including network failure.
- **Effects:** Network: one GET to Canvas.
- **Errors:** None (network failure becomes `true`, so a Canvas outage never logs anyone out).

### `renewCanvasSecret`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `async renewCanvasSecret(settings: CanvasRemoteSettings, token: string, now: Date): Promise<SecretRenewal>`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** On each OAuth refresh: `revoked` if Canvas refuses the token, else extends its expiry and answers `kept`.
- **Input:** `settings`; `token`: the Canvas token sealed in the refresh token; `now`: current time.
- **Output:** `'revoked'` (Canvas answered 401) or `'kept'`.
- **Effects:** Network: `isCanvasTokenAlive()` and, if alive, `renewCanvasToken()`.
- **Errors:** Propagates `renewCanvasToken()` errors (`renewSecretQuietly()` turns them into a log warning).

## `src/remote/handler.ts`

### `jsonResponse`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `jsonResponse(data: unknown, status = 200): Response`
- **Used by:** `handleMcp()`, `handleRegister()`, `handleToken()`, `src/remote/handler.ts (module)`
- **Processes:** P08, P09, P14

<!-- generated:end -->

- **Does:** Monta uma resposta JSON sem cache.
- **Input:** `data`: valor; `status`: padrão 200.
- **Output:** `Response`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `htmlResponse`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `htmlResponse(html: string, status = 200, formTarget: string | null = null): Response`
- **Used by:** `consentPage()`, `handleAuthorizePage()`, `handleAuthorizeSubmit()`, `handlePairCallback()`, `handlePairPost()`, `handleUpstreamCallback()`, `loginPageFor()`, `messagePage()`, `pairPage()`, `routePairRequest()`
- **Processes:** P08, P10, P11, P13, P15

<!-- generated:end -->

- **Does:** Monta uma resposta HTML sem cache, com CSP restrita.
- **Input:** `html`: página; `status`: padrão 200; `formTarget`: origem do retorno liberada no `form-action` (padrão `null`).
- **Output:** `Response`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readForm`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async readForm(request: Request): Promise<URLSearchParams>`
- **Used by:** `handleAuthorizeSubmit()`, `handlePairPost()`, `handleToken()`, `submitAuthorize()`
- **Processes:** P08, P10, P13, P15

<!-- generated:end -->

- **Does:** Lê o corpo de um formulário urlencoded.
- **Input:** `request`.
- **Output:** `URLSearchParams`.
- **Effects:** Consome o corpo da requisição.
- **Errors:** Nenhum.

### `readJsonBody`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async readJsonBody(request: Request): Promise<unknown>`
- **Used by:** `handleRegister()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Lê o corpo JSON da requisição.
- **Input:** `request`.
- **Output:** Valor lido; `null` se não for JSON válido.
- **Effects:** Consome o corpo da requisição.
- **Errors:** Nenhum (JSON inválido vira `null`).

### `loginPageFor`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `loginPageFor(app: RemoteApp, request: AuthorizeRequest, error: string | null): Response`
- **Used by:** `handleAuthorizePage()`, `handleAuthorizeSubmit()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Monta a página de login de um pedido validado.
- **Input:** `app`; `request`: pedido; `error`: mensagem ou nulo.
- **Output:** `Response` HTML com o pedido selado.
- **Effects:** Gera bytes aleatórios (selo).
- **Errors:** Nenhum.

### `redirectWithCode`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `redirectWithCode(request: AuthorizeRequest, code: string): Response`
- **Used by:** `handleAuthorizeSubmit()`, `handleUpstreamCallback()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Redireciona ao cliente com o código e o `state`.
- **Input:** `request`: pedido; `code`: código selado.
- **Output:** `Response` 302.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `handleRegister`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async handleRegister(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Atende `POST /register` (registro dinâmico).
- **Input:** `app`; `request`.
- **Output:** 201 com o cliente, ou 400 com erro OAuth.
- **Effects:** Consome o corpo.
- **Errors:** Nenhum.

### `handleAuthorizePage`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `handleAuthorizePage(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Atende `GET /authorize`: valida e mostra a página de login.
- **Input:** `app`; `request`.
- **Output:** Página HTML, ou 400 sem redirecionar quando o pedido é inválido.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `handleAuthorizeSubmit`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async handleAuthorizeSubmit(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Atende `POST /authorize`: confere a credencial e devolve o código.
- **Input:** `app`; `request`: formulário com `pending` e `secret`.
- **Output:** 302 para o cliente; página com erro se a credencial falhar; 400 se o pedido venceu.
- **Effects:** Rede (via `verifySecret` do conector).
- **Errors:** Nenhum.

### `handleToken`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async handleToken(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Atende `POST /token`; no refresh, chama `renewSecretQuietly()` antes de responder.
- **Input:** `app`; `request`: formulário OAuth.
- **Output:** 200 com tokens, ou 400 com erro OAuth; 400 `invalid_grant` (`REVOKED_SECRET_DESCRIPTION`) when the connector says the credential was revoked.
- **Effects:** Consome o corpo; no refresh, a renovação da credencial do conector.
- **Errors:** Nenhum.

### `handleMcp`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `handleMcp(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Atende `/mcp` exigindo o access token.
- **Input:** `app`; `request`.
- **Output:** Resposta MCP, ou 401 que inicia o OAuth.
- **Effects:** Executa ferramentas do conector (rede).
- **Errors:** Repassa erros do transporte MCP.

### `withCors`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `withCors(response: Response): Response`
- **Used by:** `routeRemoteRequest()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Acrescenta os headers CORS a uma resposta.
- **Input:** `response`.
- **Output:** A mesma resposta, com `CORS_HEADERS`.
- **Effects:** Altera os headers da resposta recebida.
- **Errors:** Nenhum.

### `routeRemoteRequest`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async routeRemoteRequest(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `createRemoteHandler()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Escolhe a rota pelo método e caminho.
- **Input:** `app`; `request`.
- **Output:** Resposta da rota com CORS; 204 no preflight; 404 em caminho desconhecido.
- **Effects:** Os da rota escolhida.
- **Errors:** Repassa erros da rota.

### `createRemoteHandler`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `createRemoteHandler(app: RemoteApp): (request: Request) => Promise<Response>`
- **Used by:** `handleWhatsAppFetch()`, `handleWorkerFetch()`, `startCanvasRemoteServer()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Cria o handler HTTP do conector remoto.
- **Input:** `app`: configuração OAuth, conector e relógio.
- **Output:** Função `(Request) => Promise<Response>`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `pageSecurityPolicy`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `pageSecurityPolicy(formTarget: string | null): string`
- **Used by:** `htmlResponse()`
- **Processes:** P08, P10, P11, P13, P15

<!-- generated:end -->

- **Does:** Monta a CSP das páginas HTML; o `form-action` inclui a origem do retorno do OAuth, porque o navegador aplica o `form-action` também ao 302 que segue o envio do formulário.
- **Input:** `formTarget`: origem liberada para o envio (ex. `https://claude.ai`) ou `null`.
- **Output:** Texto do header `content-security-policy`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `renewSecretQuietly`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async renewSecretQuietly(connector: RemoteConnector, secret: string): Promise<SecretRenewal>`
- **Used by:** `handleToken()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Pede ao conector para renovar a credencial (`renewSecret`), sem deixar a falha derrubar o refresh.
- **Input:** Conector remoto e o segredo do usuário.
- **Output:** `SecretRenewal`: what `renewSecret` answered, or `'kept'` when the connector has none or it failed.
- **Effects:** O que o `renewSecret` do conector fizer; `console.warn` se ele falhar.
- **Errors:** Nenhum (a falha vira aviso no log).

### `redirectToUpstream`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `redirectToUpstream(app: RemoteApp, login: UpstreamLogin, request: AuthorizeRequest): Response`
- **Used by:** `handleAuthorizePage()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Redireciona o navegador ao provedor de identidade com o pedido selado no `state`.
- **Input:** `app`, o login delegado (`UpstreamLogin`) e o pedido de autorização validado.
- **Output:** Resposta 302 para a URL de login do provedor.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `handleUpstreamCallback`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async handleUpstreamCallback(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P13

<!-- generated:end -->

- **Does:** `GET /oauth/callback`: conclui o login delegado e devolve o código ao cliente, ou explica a recusa.
- **Input:** `app` e a requisição de retorno do provedor (`state`, `code`).
- **Output:** 302 com o código ao `redirect_uri`; HTML 404 (login não delegado), 400 (pedido expirado) ou 403 (login recusado).
- **Effects:** O que o `finish` do login fizer (ex.: `fetch` ao GitHub).
- **Errors:** Nenhum (a falha do `finish` vira página 403).

## `src/remote/login-page.ts`

### `escapeHtml`

<!-- generated:start -->

- **File:** `src/remote/login-page.ts`
- **Signature:** `escapeHtml(value: string): string`
- **Used by:** `alertHtml()`, `consentPageBody()`, `handlePairCallback()`, `handleUpstreamCallback()`, `messagePage()`, `pageDocument()`, `pairForm()`, `pairingSection()`, `renderLoginPage()`, `renderPairPage()`
- **Processes:** P08, P10, P11, P13, P15

<!-- generated:end -->

- **Does:** Escapa texto para HTML (conteúdo e atributos).
- **Input:** `value`: texto.
- **Output:** Texto com `& < > " '` trocados por entidades.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `renderLoginPage`

<!-- generated:start -->

- **File:** `src/remote/login-page.ts`
- **Signature:** `renderLoginPage(view: LoginPageView): string`
- **Used by:** `loginPageFor()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Gera a página HTML de autorização.
- **Input:** `view`: textos, pedido selado, host do cliente e erro opcional.
- **Output:** HTML completo, sem script.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `src/remote/mcp-endpoint.ts`

### `serveMcpRequest`

<!-- generated:start -->

- **File:** `src/remote/mcp-endpoint.ts`
- **Signature:** `async serveMcpRequest(server: McpServer, request: Request): Promise<Response>`
- **Used by:** `handleMcp()`, `handleMcpApi()`
- **Processes:** P09, P10, P12, P14

<!-- generated:end -->

- **Does:** Atende uma requisição MCP sem sessão, com resposta JSON.
- **Input:** `server`: `McpServer` do usuário; `request`: requisição HTTP.
- **Output:** `Response` do transporte.
- **Effects:** Conecta e fecha o servidor MCP (executa a ferramenta chamada).
- **Errors:** Repassa erros do transporte.

### `mcpUnauthorizedResponse`

<!-- generated:start -->

- **File:** `src/remote/mcp-endpoint.ts`
- **Signature:** `mcpUnauthorizedResponse(issuer: string): Response`
- **Used by:** `handleMcp()`
- **Processes:** P08, P09, P14

<!-- generated:end -->

- **Does:** Monta o 401 que inicia o OAuth no cliente MCP.
- **Input:** `issuer`: URL pública.
- **Output:** `Response` 401 com `WWW-Authenticate` apontando os metadados do recurso.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `src/remote/node-server.ts`

### `readPublicUrl`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `readPublicUrl(env: EnvVars): string`
- **Used by:** `readRemoteServerConfig()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Lê a URL pública do servidor (`PUBLIC_URL`).
- **Input:** `env`: variáveis de ambiente.
- **Output:** URL sem barra final.
- **Effects:** Nenhum (pura).
- **Errors:** Lança se ausente, inválida ou sem https fora de localhost.

### `readRemoteServerConfig`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `readRemoteServerConfig(env: EnvVars): RemoteServerConfig`
- **Used by:** `startCanvasRemoteServer()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Monta a configuração do servidor remoto a partir do ambiente.
- **Input:** `env`: variáveis de ambiente.
- **Output:** `RemoteServerConfig` com porta (padrão 8080) e `OAuthSettings`.
- **Effects:** Nenhum (pura).
- **Errors:** Os de `readPublicUrl` e `parseSealKey`.

### `readNodeBody`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `async readNodeBody(req: IncomingMessage): Promise<Buffer | null>`
- **Used by:** `serveNodeRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Lê o corpo de uma requisição do Node.
- **Input:** `req`: requisição.
- **Output:** `Buffer`; `null` se passar de `MAX_BODY_BYTES`.
- **Effects:** Consome o stream da requisição.
- **Errors:** Nenhum.

### `toWebRequest`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `toWebRequest(req: IncomingMessage, body: Buffer, origin: string): Request`
- **Used by:** `serveNodeRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Converte a requisição do Node em `Request` com a origem pública.
- **Input:** `req`; `body`: corpo lido; `origin`: URL pública.
- **Output:** `Request` (sem corpo em GET/HEAD).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `writeWebResponse`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `async writeWebResponse(res: ServerResponse, response: Response): Promise<void>`
- **Used by:** `serveNodeRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Escreve um `Response` na resposta do Node.
- **Input:** `res`: resposta do Node; `response`.
- **Output:** Promessa vazia.
- **Effects:** Escreve status, headers e corpo no socket.
- **Errors:** Nenhum.

### `serveNodeRequest`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `async serveNodeRequest(options: NodeServerOptions, req: IncomingMessage, res: ServerResponse): Promise<void>`
- **Used by:** `startRemoteHttpServer()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Atende uma requisição do Node com o handler.
- **Input:** `options`: handler e origem; `req`; `res`.
- **Output:** Promessa vazia.
- **Effects:** Lê o corpo, escreve a resposta; registra erros no stderr.
- **Errors:** Nenhum: corpo grande vira 413 e erro do handler vira 500.

### `startRemoteHttpServer`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `startRemoteHttpServer(options: NodeServerOptions): Server`
- **Used by:** `startCanvasRemoteServer()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Sobe o servidor `node:http` com o handler.
- **Input:** `options`: handler, origem pública e porta (0 = livre).
- **Output:** O `Server` escutando.
- **Effects:** Abre uma porta TCP.
- **Errors:** Nenhum.

## `src/remote/oauth.ts`

### `oauthError`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `oauthError(error: string, description: string): OAuthResult<T>`
- **Used by:** `parseAuthorizeQuery()`, `readCodeChallenge()`, `redeemAuthorizationCode()`, `redeemRefreshToken()`, `redeemTokenRequest()`, `registerClient()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Monta um resultado de erro OAuth.
- **Input:** `error`: código OAuth; `description`: explicação.
- **Output:** `OAuthResult` com `ok: false`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `authorizationServerMetadata`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `authorizationServerMetadata(issuer: string): Record<string, unknown>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Monta os metadados do servidor de autorização (RFC 8414).
- **Input:** `issuer`: URL pública.
- **Output:** Objeto com endpoints, PKCE S256 e cliente público.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `protectedResourceMetadata`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `protectedResourceMetadata(issuer: string): Record<string, unknown>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Monta os metadados do recurso protegido `/mcp` (RFC 9728).
- **Input:** `issuer`: URL pública.
- **Output:** Objeto com `resource` e `authorization_servers`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `isAllowedRedirect`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `isAllowedRedirect(uri: string, hosts: readonly string[]): boolean`
- **Used by:** `checkClientRegistration()`, `registerClient()`
- **Processes:** P08, P10

<!-- generated:end -->

- **Does:** Diz se um endereço de retorno do OAuth é aceito.
- **Input:** `uri`: endereço; `hosts`: hosts permitidos.
- **Output:** `true` para https num host listado (ou subdomínio) ou http em localhost/127.0.0.1 quando `localhost` está na lista.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `pkceChallenge`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `pkceChallenge(verifier: string): string`
- **Used by:** `beginGoogleSignIn()`, `redeemAuthorizationCode()`, `startAccountLink()`
- **Processes:** P08, P10, P11

<!-- generated:end -->

- **Does:** Calcula o desafio PKCE S256 de um verificador.
- **Input:** `verifier`: `code_verifier`.
- **Output:** SHA-256 em base64url.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readRedirectUris`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `readRedirectUris(body: unknown): string[] | null`
- **Used by:** `checkClientRegistration()`, `clientRedirectUris()`, `registerClient()`
- **Processes:** P08, P10, P13

<!-- generated:end -->

- **Does:** Extrai `redirect_uris` de um objeto.
- **Input:** `body`: corpo do registro ou conteúdo selado.
- **Output:** Lista de textos; `null` se ausente, vazia ou com itens que não são texto.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `registerClient`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `registerClient(body: unknown, settings: OAuthSettings, now: number): OAuthResult<ClientRegistration>`
- **Used by:** `handleRegister()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Registra um cliente OAuth selando os endereços de retorno no `client_id`.
- **Input:** `body`: corpo JSON do registro; `settings`; `now`: segundos Unix.
- **Output:** `ClientRegistration`, ou erro `invalid_redirect_uri`.
- **Effects:** Gera bytes aleatórios (selo).
- **Errors:** Nenhum.

### `clientRedirectUris`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `clientRedirectUris(clientId: string, settings: OAuthSettings, now: number): string[] | null`
- **Used by:** `parseAuthorizeQuery()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Lê os endereços de retorno de um `client_id` deste servidor.
- **Input:** `clientId`; `settings`; `now`.
- **Output:** Lista de endereços; `null` se o cliente não é deste servidor ou venceu.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `parseAuthorizeQuery`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `parseAuthorizeQuery(query: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<AuthorizeRequest>`
- **Used by:** `handleAuthorizePage()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Valida a query do `/authorize`.
- **Input:** `query`: parâmetros; `settings`; `now`.
- **Output:** `AuthorizeRequest`, ou erro `invalid_client`, `invalid_request` ou `unsupported_response_type`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readCodeChallenge`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `readCodeChallenge(query: URLSearchParams): OAuthResult<string>`
- **Used by:** `parseAuthorizeQuery()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Confere `response_type=code` e PKCE S256 da query.
- **Input:** `query`: parâmetros do `/authorize`.
- **Output:** O `code_challenge`, ou erro OAuth.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readOAuthSettings`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `readOAuthSettings(env: EnvVars, issuer: string): OAuthSettings`
- **Used by:** `createWhatsAppApps()`, `createWorkerApp()`, `readRemoteServerConfig()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Monta a configuração OAuth do ambiente com o emissor dado.
- **Input:** `env`: variáveis (`SEAL_KEY`, `OAUTH_REDIRECT_HOSTS`); `issuer`: URL pública.
- **Output:** `OAuthSettings`; hosts padrão `DEFAULT_REDIRECT_HOSTS` se a variável não vier.
- **Effects:** Nenhum (pura).
- **Errors:** Os de `parseSealKey` (chave ausente ou de tamanho errado).

### `resolveIssuer`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `resolveIssuer(env: EnvVars, origin: string): string`
- **Used by:** `createWhatsAppApps()`, `createWorkerApp()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Emissor OAuth: `PUBLIC_URL` sem barra final ou, sem ela, a origem da requisição (ex.: `*.workers.dev`).
- **Input:** `env` e a origem da requisição.
- **Output:** URL do emissor, sem barra final.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `src/remote/seal.ts`

### `parseSealKey`

<!-- generated:start -->

- **File:** `src/remote/seal.ts`
- **Signature:** `parseSealKey(raw: string | null, name = 'SEAL_KEY'): Buffer`
- **Used by:** `readGmailSettings()`, `readOAuthSettings()`
- **Processes:** P08, P10, P12, P13

<!-- generated:end -->

- **Does:** Decodifica a `SEAL_KEY` (base64 ou base64url) e exige 32 bytes.
- **Input:** `raw`: valor da variável (ou nulo).
- **Output:** `Buffer` de 32 bytes.
- **Effects:** Nenhum (pura).
- **Errors:** Lança se ausente (com o comando para gerar) ou de tamanho errado.

### `sealPayload`

<!-- generated:start -->

- **File:** `src/remote/seal.ts`
- **Signature:** `sealPayload(payload: unknown, key: Buffer): string`
- **Used by:** `issueAuthorizationCode()`, `issueLinkUrl()`, `issuePairCsrf()`, `issueTokenSet()`, `openPairSession()`, `registerClient()`, `sealAuthorizeRequest()`, `sealOwnerAccounts()`, `startAccountLink()`, `startPairLogin()`
- **Processes:** P08, P10, P11, P12, P13, P15, P18

<!-- generated:end -->

- **Does:** Sela um valor JSON com AES-256-GCM.
- **Input:** `payload`: valor serializável; `key`: chave de 32 bytes.
- **Output:** Texto base64url com `iv + tag + cifra`.
- **Effects:** Gera bytes aleatórios (IV).
- **Errors:** Nenhum.

### `unsealPayload`

<!-- generated:start -->

- **File:** `src/remote/seal.ts`
- **Signature:** `unsealPayload(sealed: string, key: Buffer): Record<string, unknown> | null`
- **Used by:** `openSealed()`
- **Processes:** P08, P09, P10, P11, P12, P13, P14, P15, P18

<!-- generated:end -->

- **Does:** Abre um selo e devolve o objeto dentro.
- **Input:** `sealed`: texto selado; `key`: chave.
- **Output:** Objeto; `null` se a chave não confere, o texto foi alterado ou não é objeto.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum (erros de decifragem viram `null`).

### `openSealed`

<!-- generated:start -->

- **File:** `src/remote/seal.ts`
- **Signature:** `openSealed(sealed: string, key: Buffer, expected: SealExpectation): SealedClaims | null`
- **Used by:** `clientRedirectUris()`, `isTrustedPost()`, `isValidPairLogin()`, `openAuthorizeRequest()`, `openOwnerAccounts()`, `readAccessSecret()`, `readPairSession()`, `redeemAuthorizationCode()`, `redeemLinkTicket()`, `redeemRefreshToken()`, `takeLinkRequest()`
- **Processes:** P08, P09, P10, P11, P12, P13, P14, P15, P18

<!-- generated:end -->

- **Does:** Abre um selo do tipo esperado que ainda não venceu.
- **Input:** `sealed`; `key`; `expected`: `typ` e instante `now` (segundos Unix).
- **Output:** `SealedClaims`; `null` se inválido, de outro tipo, sem `exp` numérico ou vencido.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `src/remote/tokens.ts`

### `sealAuthorizeRequest`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `sealAuthorizeRequest(request: AuthorizeRequest, settings: OAuthSettings, now: number): string`
- **Used by:** `loginPageFor()`, `redirectToUpstream()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Sela o pedido de autorização para o formulário de login (15 minutos).
- **Input:** `request`: pedido validado; `settings`; `now`.
- **Output:** Texto selado do tipo `pending`.
- **Effects:** Gera bytes aleatórios (selo).
- **Errors:** Nenhum.

### `openAuthorizeRequest`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `openAuthorizeRequest(sealed: string, settings: OAuthSettings, now: number): AuthorizeRequest | null`
- **Used by:** `handleAuthorizeSubmit()`, `handleUpstreamCallback()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Abre o pedido selado vindo do formulário.
- **Input:** `sealed`; `settings`; `now`.
- **Output:** `AuthorizeRequest`; `null` se inválido ou vencido.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `issueAuthorizationCode`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `issueAuthorizationCode(grant: ApprovedGrant, settings: OAuthSettings, now: number): string`
- **Used by:** `handleAuthorizeSubmit()`, `handleUpstreamCallback()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Emite o código de autorização (5 minutos) amarrado a cliente, retorno e PKCE.
- **Input:** `grant`: pedido + segredo; `settings`; `now`.
- **Output:** Código selado do tipo `code`.
- **Effects:** Gera bytes aleatórios (selo).
- **Errors:** Nenhum.

### `issueTokenSet`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `issueTokenSet(secret: string, settings: OAuthSettings, now: number): TokenSet`
- **Used by:** `redeemTokenRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Emite access token (1 hora) e refresh token (30 dias) para um segredo.
- **Input:** `secret`: credencial do usuário; `settings`; `now`.
- **Output:** `TokenSet` do tipo Bearer.
- **Effects:** Gera bytes aleatórios (selos).
- **Errors:** Nenhum.

### `redeemAuthorizationCode`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `redeemAuthorizationCode(form: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<string>`
- **Used by:** `redeemTokenRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Confere o código contra cliente, retorno e verificador PKCE.
- **Input:** `form`: corpo do `/token`; `settings`; `now`.
- **Output:** O segredo selado, ou erro `invalid_grant`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `redeemRefreshToken`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `redeemRefreshToken(form: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<string>`
- **Used by:** `redeemTokenRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Confere o refresh token.
- **Input:** `form`: corpo do `/token`; `settings`; `now`.
- **Output:** O segredo selado, ou erro `invalid_grant`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `redeemTokenRequest`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `redeemTokenRequest(form: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<RedeemedGrant>`
- **Used by:** `handleToken()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Atende o `/token` conforme o `grant_type`.
- **Input:** `form`: corpo do `/token`; `settings`; `now`.
- **Output:** `RedeemedGrant` (novo `TokenSet`, o segredo e se veio de refresh), ou erro `invalid_grant`/`unsupported_grant_type`.
- **Effects:** Gera bytes aleatórios (selos).
- **Errors:** Nenhum.

### `readAccessSecret`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `readAccessSecret(authorization: string | null, settings: OAuthSettings, now: number): string | null`
- **Used by:** `handleMcp()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Lê o segredo de um header `Authorization: Bearer`.
- **Input:** `authorization`: header (ou nulo); `settings`; `now`.
- **Output:** O segredo; `null` sem Bearer, com token de outro tipo ou vencido.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/canvas-puc/src/worker.ts`

### `createWorkerApp`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/worker.ts`
- **Signature:** `createWorkerApp(env: EnvVars, origin: string): RemoteApp`
- **Used by:** `handleWorkerFetch()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Monta o app remoto do Canvas para o Worker.
- **Input:** `env`: variáveis de texto; `origin`: origem da requisição (emissor sem `PUBLIC_URL`).
- **Output:** `RemoteApp` com OAuth, conector do Canvas e relógio em segundos.
- **Effects:** Nenhum (pura).
- **Errors:** Os de `readOAuthSettings` (sem `SEAL_KEY`).

### `handleWorkerFetch`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/worker.ts`
- **Signature:** `async handleWorkerFetch(request: Request, env: Readonly<Record<string, unknown>>): Promise<Response>`
- **Used by:** `connectors/canvas-puc/src/worker.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Atende uma requisição no Cloudflare Workers.
- **Input:** `request`; `env`: ambiente do Worker.
- **Output:** Resposta do handler remoto; 500 com a explicação se a configuração for inválida.
- **Effects:** Os do handler remoto (rede para o Canvas).
- **Errors:** Nenhum: configuração inválida vira 500.

## `connectors/canvas-puc/src/files.ts`

### `fileContentBlock`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `fileContentBlock(file: CanvasAttachment, bytes: Uint8Array): CallToolResult['content'][number]`
- **Used by:** `downloadedFileResult()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Monta o bloco MCP com o conteúdo do arquivo: `image` para `image/*`, `resource` embutido (blob) para o resto.
- **Input:** `file`: arquivo do Canvas; `bytes`: conteúdo.
- **Output:** Bloco de conteúdo MCP.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `downloadedFileResult`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `downloadedFileResult(file: CanvasAttachment, bytes: Uint8Array): RawToolResult`
- **Used by:** `downloadCanvasFile()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Monta o resultado de `download_file`: uma linha com nome, tipo, tamanho e link, e o bloco com o conteúdo.
- **Input:** `file`; `bytes`.
- **Output:** `RawToolResult`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `downloadRefusal`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `downloadRefusal(file: CanvasAttachment): string | null`
- **Used by:** `downloadCanvasFile()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Decide se o arquivo não pode ser trazido à conversa: sem link ou acima de `MAX_DOWNLOAD_BYTES`.
- **Input:** `file`: arquivo do Canvas.
- **Output:** Mensagem em português com o motivo (e o link, se houver), ou `null` se pode baixar.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `downloadCanvasFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `async downloadCanvasFile(client: CanvasClient, file: CanvasAttachment): Promise<RawToolResult | string>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Baixa o arquivo e devolve seu conteúdo para a conversa, ou o motivo de não baixar.
- **Input:** `client`: cliente do Canvas; `file`: metadados de `/files/:id`.
- **Output:** Promise com `RawToolResult` ou mensagem.
- **Effects:** Rede (download do arquivo).
- **Errors:** Repassa os erros do download.

### `readCanvasFileText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `async readCanvasFileText(client: CanvasClient, file: CanvasAttachment): Promise<string>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Lê um arquivo do Canvas como texto: texto puro, HTML (convertido) ou Word (.doc/.docx); outros tipos devolvem o link e sugerem `download_file`.
- **Input:** `client`; `file`: metadados de `/files/:id`.
- **Output:** Promise com `# nome` e o texto (até `MAX_TEXT_CHARS`), ou a mensagem com o link.
- **Effects:** Rede (download do arquivo).
- **Errors:** Repassa os erros do download e da extração do Word.

## `src/core/cfb.ts`

### `isCfb`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `isCfb(bytes: Uint8Array): boolean`
- **Used by:** `readCfbHeader()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Diz se os bytes começam com a assinatura OLE/CFB (`CFB_SIGNATURE`).
- **Input:** `bytes`: arquivo.
- **Output:** `true` se for CFB.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readCfbHeader`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `readCfbHeader(bytes: Uint8Array): CfbHeader`
- **Used by:** `openCfb()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Lê do cabeçalho de 512 bytes os tamanhos de setor, o início do diretório, da mini FAT e da DIFAT.
- **Input:** `bytes`: arquivo CFB.
- **Output:** `CfbHeader`.
- **Effects:** Nenhum (pura).
- **Errors:** Lança "Arquivo não é um documento do Office (OLE)." sem a assinatura.

### `cfbSector`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `cfbSector(bytes: Uint8Array, header: CfbHeader, id: number): Uint8Array`
- **Used by:** `fatSectorIds()`, `openCfb()`, `readRegularChain()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Recorta um setor regular pelo id (o setor 0 vem logo após o cabeçalho).
- **Input:** `bytes`; `header`; `id`: número do setor.
- **Output:** `Uint8Array` do setor.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `sectorWords`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `sectorWords(sector: Uint8Array): number[]`
- **Used by:** `fatSectorIds()`, `openCfb()`, `readMiniStream()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Lê um setor como lista de inteiros de 32 bits little-endian (FAT, DIFAT, mini FAT).
- **Input:** `sector`: bytes.
- **Output:** Lista de números.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `fatSectorIds`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `fatSectorIds(bytes: Uint8Array, header: CfbHeader): number[]`
- **Used by:** `openCfb()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Lista os setores que guardam a FAT: os 109 do cabeçalho e os da cadeia DIFAT.
- **Input:** `bytes`; `header`.
- **Output:** Ids válidos (sem marcas de livre/fim).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `followChain`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `followChain(table: readonly number[], start: number): number[]`
- **Used by:** `readMiniStream()`, `readRegularChain()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Segue uma cadeia de setores na tabela até o fim de cadeia, sem entrar em laço.
- **Input:** `table`: FAT ou mini FAT; `start`: primeiro setor.
- **Output:** Ids na ordem da cadeia (vazia se `start` for fim de cadeia).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readRegularChain`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `readRegularChain(file: Omit<CfbFile, 'entries'>, start: number): Uint8Array`
- **Used by:** `openCfb()`, `readCfbStream()`, `readMiniStream()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Lê os bytes de uma cadeia de setores regulares.
- **Input:** `file`: bytes, cabeçalho e FAT; `start`: primeiro setor.
- **Output:** Bytes concatenados (múltiplo do tamanho do setor).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `parseDirectory`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `parseDirectory(dir: Uint8Array): CfbEntry[]`
- **Used by:** `openCfb()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Lê as entradas de 128 bytes do diretório CFB.
- **Input:** `dir`: bytes do diretório.
- **Output:** Lista de `CfbEntry` (nome, primeiro setor, tamanho).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `openCfb`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `openCfb(bytes: Uint8Array): CfbFile`
- **Used by:** `docToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Abre um arquivo CFB: cabeçalho, FAT completa e diretório.
- **Input:** `bytes`: arquivo .doc (ou outro CFB).
- **Output:** `CfbFile`.
- **Effects:** Nenhum (pura).
- **Errors:** Repassa o erro de `readCfbHeader`.

### `readMiniStream`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `readMiniStream(file: CfbFile, entry: CfbEntry): Uint8Array`
- **Used by:** `readCfbStream()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Lê um stream pequeno pelo mini stream (setores de 64 bytes guardados na entrada raiz), seguindo a mini FAT.
- **Input:** `file`: CFB aberto; `entry`: o stream.
- **Output:** Bytes (com sobra do último mini setor).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readCfbStream`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `readCfbStream(file: CfbFile, name: string): Uint8Array | null`
- **Used by:** `docToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Lê um stream pelo nome, pelo mini stream ou pela FAT conforme o tamanho.
- **Input:** `file`: CFB aberto; `name`: nome do stream (ex.: `WordDocument`).
- **Output:** Bytes do stream no tamanho exato, ou `null` se não existir.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `src/core/word.ts`

### `docxXmlToText`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `docxXmlToText(xml: string): string`
- **Used by:** `docxToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Converte o XML do corpo do .docx em texto: junta os `w:t`, troca `w:tab` por tabulação, `w:br`/`w:cr` e fim de parágrafo por quebra de linha e decodifica as entidades.
- **Input:** `xml`: conteúdo de `word/document.xml`.
- **Output:** Texto sem espaços nas pontas.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `docxToText`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `async docxToText(bytes: Uint8Array): Promise<string>`
- **Used by:** `wordToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Extrai o texto de um .docx (abre o ZIP e lê `word/document.xml`).
- **Input:** `bytes`: arquivo .docx.
- **Output:** Promise com o texto.
- **Effects:** Nenhum (só CPU).
- **Errors:** Rejeita com "Arquivo .docx sem word/document.xml." ou com os erros do ZIP.

### `cp1252ToString`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `cp1252ToString(bytes: Uint8Array): string`
- **Used by:** `decodePartBody()`, `pieceText()`
- **Processes:** P03, P12, P18

<!-- generated:end -->

- **Does:** Decodifica bytes em Windows-1252 (texto de 8 bits do .doc).
- **Input:** `bytes`.
- **Output:** Texto.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `parsePieceTable`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `parsePieceTable(table: Uint8Array, fcClx: number): DocPiece[]`
- **Used by:** `docToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Lê a tabela de peças (PlcPcd) do Clx do .doc, pulando os blocos de formatação (Prc).
- **Input:** `table`: stream 0Table/1Table; `fcClx`: posição do Clx (do FIB).
- **Output:** Lista de `DocPiece`.
- **Effects:** Nenhum (pura).
- **Errors:** Lança "Documento .doc com tabela de texto inválida." se o Clx não tiver a tabela.

### `pieceText`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `pieceText(wordDoc: Uint8Array, piece: DocPiece): string`
- **Used by:** `docToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Decodifica uma peça do texto: Windows-1252 se o bit "compressed" estiver ligado, senão UTF-16LE.
- **Input:** `wordDoc`: stream WordDocument; `piece`.
- **Output:** Texto da peça.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `cleanWordText`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `cleanWordText(raw: string): string`
- **Used by:** `docToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Troca as marcas do Word por texto com `WORD_TEXT_REPLACEMENTS`: tira o código dos campos (fica o resultado), parágrafos viram quebras, células viram tabulação.
- **Input:** `raw`: texto bruto das peças.
- **Output:** Texto limpo, sem espaços nas pontas.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `docToText`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `docToText(bytes: Uint8Array): string`
- **Used by:** `wordToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Extrai o texto principal de um .doc (Word 97-2003): abre o CFB, lê o FIB, a tabela de peças e decodifica cada peça, cortando em `ccpText` (sem rodapés e cabeçalhos).
- **Input:** `bytes`: arquivo .doc.
- **Output:** Texto.
- **Effects:** Nenhum (pura).
- **Errors:** Lança "O .doc está protegido por senha.", "Arquivo .doc sem o stream WordDocument.", "Arquivo .doc sem o stream de tabela." ou os erros de `openCfb`/`parsePieceTable`.

### `wordKind`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `wordKind(contentType: string, name: string): 'docx' | 'doc' | null`
- **Used by:** `readCanvasFileText()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Decide se o arquivo é documento do Word pelo nome ou pelo MIME.
- **Input:** `contentType`: MIME; `name`: nome do arquivo.
- **Output:** `docx`, `doc` ou `null`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `wordToText`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `wordToText(kind: 'docx' | 'doc', bytes: Uint8Array): Promise<string>`
- **Used by:** `attachmentBytesToText()`, `readCanvasFileText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Extrai o texto de um documento do Word conforme o tipo.
- **Input:** `kind`: `docx` ou `doc`; `bytes`.
- **Output:** Promise com o texto.
- **Effects:** Nenhum (só CPU).
- **Errors:** Repassa os erros de `docxToText`/`docToText`.

## `src/core/zip.ts`

### `findEndOfCentralDirectory`

<!-- generated:start -->

- **File:** `src/core/zip.ts`
- **Signature:** `findEndOfCentralDirectory(bytes: Uint8Array): number`
- **Used by:** `listZipEntries()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Acha o registro de fim do diretório central (EOCD) do ZIP, procurando de trás para frente.
- **Input:** `bytes`: arquivo ZIP.
- **Output:** Posição do EOCD.
- **Effects:** Nenhum (pura).
- **Errors:** Lança "Arquivo ZIP inválido: diretório central não encontrado.".

### `listZipEntries`

<!-- generated:start -->

- **File:** `src/core/zip.ts`
- **Signature:** `listZipEntries(bytes: Uint8Array): ZipEntry[]`
- **Used by:** `readZipEntry()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Lê as entradas do diretório central do ZIP.
- **Input:** `bytes`: arquivo ZIP.
- **Output:** Lista de `ZipEntry`; para na primeira entrada corrompida.
- **Effects:** Nenhum (pura).
- **Errors:** Repassa o erro de `findEndOfCentralDirectory`.

### `zipEntryBytes`

<!-- generated:start -->

- **File:** `src/core/zip.ts`
- **Signature:** `zipEntryBytes(bytes: Uint8Array, entry: ZipEntry): Uint8Array`
- **Used by:** `readZipEntry()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Recorta os bytes comprimidos de uma entrada, pulando o cabeçalho local.
- **Input:** `bytes`: ZIP; `entry`: entrada.
- **Output:** `Uint8Array` comprimido.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `inflateRaw`

<!-- generated:start -->

- **File:** `src/core/zip.ts`
- **Signature:** `inflateRaw(data: Uint8Array): Promise<Uint8Array>`
- **Used by:** `readZipEntry()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Descomprime DEFLATE puro com `DecompressionStream` (Node 22 e Workers).
- **Input:** `data`: bytes comprimidos.
- **Output:** Promise com os bytes descomprimidos.
- **Effects:** Nenhum (só CPU).
- **Errors:** Rejeita se os dados não forem DEFLATE válido.

### `readZipEntry`

<!-- generated:start -->

- **File:** `src/core/zip.ts`
- **Signature:** `async readZipEntry(bytes: Uint8Array, name: string): Promise<Uint8Array | null>`
- **Used by:** `docxToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Lê e descompacta uma entrada do ZIP pelo nome (métodos 0 e 8).
- **Input:** `bytes`: ZIP; `name`: caminho da entrada.
- **Output:** Promise com os bytes, ou `null` se a entrada não existir.
- **Effects:** Nenhum (só CPU).
- **Errors:** Rejeita com "Compressão ZIP não suportada (método N)." para outros métodos.

### `decompressBytes`

<!-- generated:start -->

- **File:** `src/core/zip.ts`
- **Signature:** `async decompressBytes(data: Uint8Array, format: 'deflate' | 'deflate-raw'): Promise<Uint8Array>`
- **Used by:** `decodePdfStream()`, `inflateRaw()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Descomprime dados com `DecompressionStream` no formato dado.
- **Input:** `data`: bytes comprimidos. `format`: `deflate-raw` (DEFLATE puro) ou `deflate` (com cabeçalho zlib).
- **Output:** Os bytes descomprimidos.
- **Effects:** Nenhum (pura).
- **Errors:** Propaga o erro do `DecompressionStream` se os dados estiverem corrompidos.

## `src/core/bytes.ts`

### `byteView`

<!-- generated:start -->

- **File:** `src/core/bytes.ts`
- **Signature:** `byteView(bytes: Uint8Array): DataView`
- **Used by:** `docToText()`, `findEndOfCentralDirectory()`, `listZipEntries()`, `parseDirectory()`, `parsePieceTable()`, `readCfbHeader()`, `sectorWords()`, `utf16leToString()`, `zipEntryBytes()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Cria uma `DataView` sobre exatamente a fatia de bytes dada (respeita `byteOffset`).
- **Input:** `bytes`: buffer ou fatia.
- **Output:** `DataView` para leituras little-endian.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `concatBytes`

<!-- generated:start -->

- **File:** `src/core/bytes.ts`
- **Signature:** `concatBytes(parts: readonly Uint8Array[]): Uint8Array`
- **Used by:** `readMiniStream()`, `readRegularChain()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Junta vários pedaços de bytes num buffer novo, em ordem.
- **Input:** `parts`: lista de `Uint8Array`.
- **Output:** `Uint8Array` com todos os bytes.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `utf16leToString`

<!-- generated:start -->

- **File:** `src/core/bytes.ts`
- **Signature:** `utf16leToString(bytes: Uint8Array): string`
- **Used by:** `parseDirectory()`, `pieceText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Decodifica UTF-16LE sem `TextDecoder` (portável para o Workers).
- **Input:** `bytes`: texto em UTF-16LE.
- **Output:** Texto; um byte solto no fim é ignorado.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `bytesToBase64`

<!-- generated:start -->

- **File:** `src/core/bytes.ts`
- **Signature:** `bytesToBase64(bytes: Uint8Array): string`
- **Used by:** `binaryContentBlock()`
- **Processes:** P03, P14

<!-- generated:end -->

- **Does:** Codifica bytes em base64 em blocos de 32 KB, sem `Buffer` (Node e Workers).
- **Input:** `bytes`.
- **Output:** Texto base64.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `tools/bundle/bundle.ts`

### `listConnectors`

<!-- generated:start -->

- **File:** `tools/bundle/bundle.ts`
- **Signature:** `listConnectors(rootDir: string): string[]`
- **Used by:** `runBuildCli()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Lista os conectores com manifesto de plugin (`.claude-plugin/plugin.json`) em `connectors/`.
- **Input:** `rootDir`: raiz do repositório.
- **Output:** Nomes das subpastas em ordem alfabética; vazia se `connectors/` não existe.
- **Effects:** Lê o disco.
- **Errors:** Propaga erros de leitura da pasta.

### `bundleOptions`

<!-- generated:start -->

- **File:** `tools/bundle/bundle.ts`
- **Signature:** `bundleOptions(entry: string, outfile: string): BuildOptions`
- **Used by:** `buildConnector()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Monta as opções do esbuild para unir o servidor remoto num ESM para Node 22.
- **Input:** `entry`: arquivo de entrada; `outfile`: arquivo de saída.
- **Output:** `BuildOptions` com bundle, `node22`, sem dependências externas, e banner que define `require`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `mcpServerProblems`

<!-- generated:start -->

- **File:** `tools/bundle/bundle.ts`
- **Signature:** `mcpServerProblems(name: string, server: unknown): string[]`
- **Used by:** `pluginMcpProblems()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Confere um servidor do `.mcp.json` do plugin: tem de ser remoto (`type: "http"`, URL `https://`, sem `command`).
- **Input:** `name`: nome do servidor; `server`: valor lido do JSON.
- **Output:** Lista de problemas em português; vazia se o servidor está certo.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `pluginMcpProblems`

<!-- generated:start -->

- **File:** `tools/bundle/bundle.ts`
- **Signature:** `pluginMcpProblems(config: unknown): string[]`
- **Used by:** `buildConnector()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Confere o `.mcp.json` inteiro de um plugin: ao menos um servidor, todos remotos.
- **Input:** `config`: conteúdo do `.mcp.json` já lido como JSON.
- **Output:** Lista de problemas; vazia se a configuração está certa.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `isRemoteMcpUrl`

<!-- generated:start -->

- **File:** `tools/bundle/bundle.ts`
- **Signature:** `isRemoteMcpUrl(url: unknown): boolean`
- **Used by:** `mcpServerProblems()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Diz se a URL é remota e fixa (`https://`); recusa `${user_config.*}`, que quebra o Vincular (ADR 0018).
- **Input:** `url`: valor do campo `url` do servidor no `.mcp.json`.
- **Output:** `true` para `https://...` sem `${`; `false` para o resto (inclusive placeholders `${user_config.*}`).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `tools/bundle/cli.ts`

### `buildConnector`

<!-- generated:start -->

- **File:** `tools/bundle/cli.ts`
- **Signature:** `async buildConnector(root: string, name: string): Promise<void>`
- **Used by:** `runBuildCli()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Valida o `.mcp.json` do conector, se houver (plugin self-host não tem), e gera o bundle `server/remote.js`, se houver `src/remote-main.ts`.
- **Input:** `root`: raiz do repositório; `name`: pasta do conector.
- **Output:** Promise vazia.
- **Effects:** Lê o `.mcp.json`; roda o esbuild e grava `server/remote.js`.
- **Errors:** Rejeita listando os problemas de `pluginMcpProblems()`; propaga erros de leitura e do esbuild.

### `runBuildCli`

<!-- generated:start -->

- **File:** `tools/bundle/cli.ts`
- **Signature:** `async runBuildCli(): Promise<void>`
- **Used by:** `tools/bundle/cli.ts (module)`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Ponto de entrada de `npm run build`: faz o build de todos os conectores.
- **Input:** Nenhuma.
- **Output:** Promise vazia; imprime "✔ <conector>" por conector.
- **Effects:** Os de `buildConnector()`; escreve no terminal.
- **Errors:** Propaga erros de `buildConnector()`.

## `connectors/gmail/src/access-token.ts`

### `forgetAccessToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `forgetAccessToken(owner: string, email: string): void`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `gmailCall()`, `storeGoogleAccount()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Esquece o access token guardado de uma conta de um usuário.
- **Input:** `owner`: usuário. `email`: conta Gmail.
- **Output:** Nada.
- **Effects:** Memória do isolate: remove a entrada do cache.
- **Errors:** Nenhum.

### `clearAccessTokenCache`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `clearAccessTokenCache(): void`
- **Used by:** —
- **Processes:** —

<!-- generated:end -->

- **Does:** Esquece todos os access tokens guardados.
- **Input:** Nenhuma.
- **Output:** Nada.
- **Effects:** Memória do isolate: esvazia o cache de access tokens.
- **Errors:** Nenhum.

### `relinkError`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `relinkError(alias: string): Error`
- **Used by:** `getAccessToken()`, `renewAccessToken()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Monta o erro de conta que perdeu o acesso ao Gmail.
- **Input:** `alias`: apelido da conta.
- **Output:** `Error` que orienta a usar `link_account` e entrar de novo.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `renewAccessToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `async renewAccessToken(deps: OwnerDeps, ref: AccountRef): Promise<string>`
- **Used by:** `getAccessToken()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Renova o access token da conta pelo refresh token.
- **Input:** `deps`: dependências com o usuário. `ref`: conta com apelido.
- **Output:** O access token novo.
- **Effects:** Rede: endpoint de tokens do Google. Memória do isolate: guarda o token até 1 min antes de vencer. KV: marca a conta como revogada em `invalid_grant`.
- **Errors:** Lança `relinkError()` em `invalid_grant`; propaga outros `GoogleTokenError` e erros de rede.

### `getAccessToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `async getAccessToken(deps: OwnerDeps, ref: AccountRef): Promise<string>`
- **Used by:** `accountStatus()`, `gmailCall()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Devolve um access token válido da conta.
- **Input:** `deps`: dependências com o usuário. `ref`: conta com apelido.
- **Output:** Access token da memória, ou renovado.
- **Effects:** Os de `renewAccessToken()` quando não há token válido na memória.
- **Errors:** Lança `relinkError()` se a conta já está revogada; propaga os de `renewAccessToken()`.

### `accessTokenKey`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `accessTokenKey(owner: string, email: string): string`
- **Used by:** `forgetAccessToken()`, `getAccessToken()`, `renewAccessToken()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Monta a chave do cache de access tokens por usuário e conta.
- **Input:** `owner`: usuário (`sub`). `email`: conta Gmail.
- **Output:** Texto que separa usuário e conta.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `markAccountRevoked`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `async markAccountRevoked(deps: OwnerDeps, email: string): Promise<void>`
- **Used by:** `renewAccessToken()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Marca a conta do usuário como revogada no KV.
- **Input:** `deps`: dependências com o usuário. `email`: conta a marcar.
- **Output:** Nada.
- **Effects:** KV: lê e regrava o registro do usuário.
- **Errors:** Propaga falhas do KV.

## `connectors/gmail/src/attachments.ts`

### `looksLikeText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/attachments.ts`
- **Signature:** `looksLikeText(text: string): boolean`
- **Used by:** `detectAttachmentKind()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Diz se o texto parece texto de verdade (sem caracteres de controle além de espaços e quebras).
- **Input:** `text`: texto decodificado; só os primeiros 4096 caracteres são examinados.
- **Output:** Verdadeiro se a amostra não é vazia e tem menos de 1% de caracteres de controle ou de substituição; falso no resto.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `detectAttachmentKind`

<!-- generated:start -->

- **File:** `connectors/gmail/src/attachments.ts`
- **Signature:** `detectAttachmentKind(bytes: Uint8Array): AttachmentKind`
- **Used by:** `attachmentBytesToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Detecta o tipo do anexo pelos primeiros bytes ou pelo conteúdo.
- **Input:** `bytes`: conteúdo bruto do anexo.
- **Output:** `pdf`, `docx`, `doc`, `html` ou `text`; nulo se não for um tipo reconhecido.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `attachmentBytesToText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/attachments.ts`
- **Signature:** `async attachmentBytesToText(bytes: Uint8Array): Promise<string>`
- **Used by:** `readAttachmentText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Converte os bytes do anexo em texto conforme o tipo detectado.
- **Input:** `bytes`: conteúdo bruto do anexo.
- **Output:** O texto extraído; pode ser vazio (ex.: PDF escaneado).
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro se o tipo não for PDF, Word, HTML ou texto. Propaga os erros de `pdfToText()` e `wordToText()`.

### `readAttachmentText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/attachments.ts`
- **Signature:** `async readAttachmentText(deps: OwnerDeps, ref: AccountRef, ids: AttachmentIds): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Baixa um anexo do Gmail como texto limitado.
- **Input:** `deps`: dependências do conector (configuração, KV, rede, relógio). `account`: conta permitida. `ids`: `messageId` da mensagem e `attachmentId` do anexo.
- **Output:** Objeto com `account`, `message_id`, `size` e `text` (truncado em 50.000 caracteres; aviso de texto não extraível quando vazio).
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Lança erro se o anexo passar de 5 MB. Propaga os erros de `gmailGet()` e `attachmentBytesToText()`.

### `downloadAttachment`

<!-- generated:start -->

- **File:** `connectors/gmail/src/attachments.ts`
- **Signature:** `async downloadAttachment(deps: OwnerDeps, ref: AccountRef, ids: AttachmentIds): Promise<{ size: number; bytes: Uint8Array }>`
- **Used by:** `forwardAttachments()`, `readAttachmentText()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Baixa os bytes de um anexo com o tamanho informado pelo Gmail.
- **Input:** `deps`, `ref`: conta; `ids`: mensagem e anexo.
- **Output:** `{ size, bytes }` (size é o do Gmail ou o dos bytes).
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Propaga os erros de `gmailGet()`.

## `connectors/gmail/src/config.ts`

### `isEmailAddress`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `isEmailAddress(text: string): boolean`
- **Used by:** `parseAllowedEmails()`, `parseMailAddress()`
- **Processes:** P10, P12, P18

<!-- generated:end -->

- **Does:** Diz se o texto parece um e-mail simples (`nome@dominio.tld`, sem espaços).
- **Input:** `text`: texto a conferir.
- **Output:** Verdadeiro se tem o formato de e-mail; falso no resto.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `parseAllowedEmails`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `parseAllowedEmails(raw: string | null): string[] | null`
- **Used by:** `readGmailSettings()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Lê a lista opcional `ALLOWED_EMAILS`.
- **Input:** `raw`: valor do secret (vírgulas), ou nulo.
- **Output:** E-mails em minúsculas; nulo se vazio (modo público).
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro se algum item não for e-mail.

### `requiredSecret`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `requiredSecret(env: EnvVars, name: string): string`
- **Used by:** `readConsentSecret()`, `readGmailSettings()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Lê uma variável obrigatória do Worker.
- **Input:** `env`: variáveis de texto do Worker. `name`: nome da variável.
- **Output:** O valor da variável, sem espaços nas pontas.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro com o comando `wrangler secret put` se a variável faltar, estiver vazia ou for um placeholder.

### `readConsentSecret`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `readConsentSecret(env: EnvVars): string`
- **Used by:** `readGmailSettings()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Lê o segredo do consentimento lembrado com o tamanho mínimo exigido.
- **Input:** `env`: variáveis de texto do Worker.
- **Output:** O valor de `CONSENT_SECRET`.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro se o segredo tiver menos de 32 caracteres. Propaga o erro de `requiredSecret()`.

### `readGmailSettings`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `readGmailSettings(env: EnvVars): GmailSettings`
- **Used by:** `createGmailDeps()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Monta a configuração a partir dos secrets do Worker.
- **Input:** `env`: variáveis e secrets em texto.
- **Output:** `GmailSettings` com cliente Google, chave de cifra, allowlist opcional e segredo do consentimento.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro dizendo qual secret falta ou está inválido.

### `isEmailAllowed`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `isEmailAllowed(settings: GmailSettings, email: string): boolean`
- **Used by:** `completeSignIn()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Diz se o e-mail pode entrar no conector.
- **Input:** `settings`: configuração. `email`: e-mail verificado do login.
- **Output:** `true` no modo público; no privado, só para os e-mails de `ALLOWED_EMAILS`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `hasModifyScope`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `hasModifyScope(scope: string): boolean`
- **Used by:** `accountBase()`, `linkRefusalReason()`, `requireWriteAccess()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Diz se os escopos concedidos incluem `gmail.modify`.
- **Input:** `scope`: escopos separados por espaço.
- **Output:** `true` se tiver `gmail.modify` exato.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/gmail/src/gmail-api.ts`

### `gmailUrl`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `gmailUrl(path: string, params: Readonly<Record<string, GmailQueryValue>> = {}): string`
- **Used by:** `applyLabelChange()`, `connectors/gmail/src/tools.ts (module)`, `createDraft()`, `deleteDraft()`, `downloadAttachment()`, `fetchFullMessage()`, `fetchLabels()`, `fetchThreadMetadata()`, `listDrafts()`, `moveToTrash()`, `searchAccount()`, `sendDraft()`, `sendPrepared()`, `updateDraft()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Monta a URL de um caminho da Gmail API com os parâmetros dados.
- **Input:** `path`: caminho relativo à base da conta (ex.: `messages/<id>`). `params`: parâmetros opcionais; listas viram o parâmetro repetido.
- **Output:** A URL completa; parâmetros nulos, indefinidos ou vazios são omitidos.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `gmailHttpError`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `gmailHttpError(status: number, alias: string, detail: string | null = null): Error`
- **Used by:** `gmailCall()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Monta o erro acionável de uma falha da Gmail API.
- **Input:** `status`: status HTTP. `alias`: apelido da conta.
- **Output:** `Error` com a conta e a orientação.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `gmailGet`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `gmailGet(deps: OwnerDeps, ref: AccountRef, url: string): Promise<T>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `downloadAttachment()`, `fetchFullMessage()`, `fetchLabels()`, `fetchThreadMetadata()`, `listDrafts()`, `searchAccount()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Lê um recurso da Gmail API como JSON, com nova tentativa depois de 401.
- **Input:** `deps`: dependências com o usuário. `ref`: conta. `url`: URL da Gmail API.
- **Output:** O corpo JSON.
- **Effects:** Rede: Gmail API e, se renovar, Google. Memória do isolate: esquece o token depois de 401.
- **Errors:** Lança `gmailHttpError()` se a resposta final falhar; propaga os de `getAccessToken()`.

### `gmailErrorDetail`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `async gmailErrorDetail(response: Response): Promise<string | null>`
- **Used by:** `gmailCall()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Lê `error.message` de uma resposta de erro da Gmail API, limitado a 200 caracteres.
- **Input:** `response`: resposta de falha.
- **Output:** O detalhe, ou nulo.
- **Effects:** Consome o corpo da resposta.
- **Errors:** Nenhum: corpo inválido vira nulo.

### `sendGmailRequest`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `sendGmailRequest(deps: GmailDeps, request: GmailRequest, token: string): Promise<Response>`
- **Used by:** `gmailCall()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Envia um pedido autenticado à Gmail API (método, corpo JSON, token, User-Agent).
- **Input:** `deps`; `request`: URL, método e corpo; `token`: access token.
- **Output:** A `Response`.
- **Effects:** Rede: Gmail API.
- **Errors:** Propaga falhas de rede.

### `readGmailJson`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `async readGmailJson(response: Response): Promise<T>`
- **Used by:** `gmailCall()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Lê o JSON de uma resposta de sucesso; corpo vazio vira objeto vazio.
- **Input:** `response`: resposta 2xx.
- **Output:** O JSON tipado, ou `{}`.
- **Effects:** Consome o corpo da resposta.
- **Errors:** Lança erro se o corpo não for JSON.

### `gmailCall`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `async gmailCall(deps: OwnerDeps, ref: AccountRef, request: GmailRequest): Promise<T>`
- **Used by:** `gmailGet()`, `gmailWrite()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Faz um pedido à Gmail API e lê o JSON; depois de 401 renova o token e tenta mais uma vez.
- **Input:** `deps`, `ref`: conta; `request`: URL, método e corpo.
- **Output:** O JSON da resposta.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Lança `gmailHttpError()` (com o detalhe do Gmail) em falha HTTP; propaga os de `getAccessToken()`.

### `gmailWrite`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `async gmailWrite(deps: OwnerDeps, ref: AccountRef, request: GmailRequest): Promise<T>`
- **Used by:** `applyLabelChange()`, `createDraft()`, `deleteDraft()`, `moveToTrash()`, `sendDraft()`, `sendPrepared()`, `updateDraft()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Escreve na Gmail API exigindo antes o escopo `gmail.modify` da conta.
- **Input:** `deps`, `ref`: conta; `request`: pedido de escrita.
- **Output:** O JSON da resposta.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Lança `writeAccessError()` para conta só leitura; propaga os erros de `gmailCall()`.

## `connectors/gmail/src/google-oauth.ts`

### `googleRedirectUri`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `googleRedirectUri(origin: string): string`
- **Used by:** `beginGoogleSignIn()`, `exchangeGoogleCode()`, `startAccountLink()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Monta o endereço de retorno do Google para a origem do Worker.
- **Input:** `origin`: origem pública do Worker, sem barra no fim.
- **Output:** A URL `<origin>/google/callback`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `googleAuthorizeUrl`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `googleAuthorizeUrl(params: GoogleAuthorizeParams): string`
- **Used by:** `beginGoogleSignIn()`, `startAccountLink()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Monta a URL de autorização do Google.
- **Input:** `params`: cliente, endereço de retorno, escopos, `state`, desafio PKCE, `nonce` e `offline` (pede refresh token e novo consentimento).
- **Output:** A URL de autorização com PKCE S256 e escolha de conta.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `randomToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `randomToken(bytes = 32): string`
- **Used by:** `beginGoogleSignIn()`, `completeSignIn()`, `issueLinkUrl()`, `mimeBoundary()`, `startAccountLink()`
- **Processes:** P10, P11, P18

<!-- generated:end -->

- **Does:** Gera um texto aleatório em base64url (state, nonce, verificador PKCE).
- **Input:** `bytes`: bytes de entropia; padrão 32.
- **Output:** O texto aleatório em base64url.
- **Effects:** Lê o gerador aleatório criptográfico.
- **Errors:** Nenhum.

### `parseGoogleTokens`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `parseGoogleTokens(body: unknown): GoogleTokens`
- **Used by:** `postGoogleToken()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Valida o JSON de sucesso do endpoint de tokens do Google.
- **Input:** `body`: corpo JSON da resposta, de qualquer forma.
- **Output:** Os tokens; `expiresIn` vale 3600 se faltar, refresh token e `id_token` nulos se faltarem, escopo vazio se faltar.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `GoogleTokenError` (`invalid_response`) se faltar o access token.

### `googleErrorCode`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `async googleErrorCode(response: Response): Promise<string>`
- **Used by:** `postGoogleToken()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Extrai o código de erro OAuth de uma resposta de falha do Google.
- **Input:** `response`: resposta HTTP de falha.
- **Output:** O campo `error` do corpo; `http_<status>` se o corpo não for JSON ou não tiver `error`.
- **Effects:** Consome o corpo da resposta.
- **Errors:** Nenhum.

### `postGoogleToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `async postGoogleToken(deps: GmailDeps, form: Readonly<Record<string, string>>): Promise<GoogleTokens>`
- **Used by:** `exchangeGoogleCode()`, `refreshGoogleToken()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Envia um formulário ao endpoint de tokens do Google com as credenciais do cliente.
- **Input:** `deps`: dependências do conector (configuração, rede). `form`: campos do pedido (tipo de concessão e dados dela).
- **Output:** Os tokens validados.
- **Effects:** Rede: endpoint de tokens do Google.
- **Errors:** Lança `GoogleTokenError` com o código do Google se a resposta não for de sucesso. Propaga os erros de `parseGoogleTokens()` e de rede.

### `exchangeGoogleCode`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `exchangeGoogleCode(deps: GmailDeps, code: string, verifier: string): Promise<GoogleTokens>`
- **Used by:** `completeSignIn()`, `linkFromCode()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Troca o código de autorização do Google (com o verificador PKCE) por tokens.
- **Input:** `deps`: dependências do conector (configuração, origem, rede). `code`: código recebido no retorno. `verifier`: verificador PKCE da autorização.
- **Output:** Os tokens validados.
- **Effects:** Rede: endpoint de tokens do Google.
- **Errors:** Propaga os erros de `postGoogleToken()`.

### `refreshGoogleToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `refreshGoogleToken(deps: GmailDeps, refreshToken: string): Promise<GoogleTokens>`
- **Used by:** `renewAccessToken()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Renova o access token com o refresh token guardado.
- **Input:** `deps`: dependências do conector (configuração, rede). `refreshToken`: refresh token da conta.
- **Output:** Os tokens validados.
- **Effects:** Rede: endpoint de tokens do Google.
- **Errors:** Propaga os erros de `postGoogleToken()` (`invalid_grant` quando o acesso foi revogado).

### `revokeGoogleToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `async revokeGoogleToken(deps: GmailDeps, token: string): Promise<boolean>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Revoga o refresh token no Google.
- **Input:** `deps`: dependências. `token`: refresh token.
- **Output:** `true` se o Google confirmou; `false` se recusou ou a rede falhou.
- **Effects:** Rede: endpoint de revogação do Google.
- **Errors:** Nenhum (falha devolve `false`).

## `connectors/gmail/src/id-token.ts`

### `decodeJwtJson`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `decodeJwtJson(part: string): Record<string, unknown>`
- **Used by:** `decodeJwt()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Decodifica um pedaço base64url de JSON em objeto.
- **Input:** `part`: cabeçalho ou payload do JWT em base64url.
- **Output:** O objeto decodificado.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro se o JSON não for objeto. Propaga o `SyntaxError` de JSON inválido.

### `decodeJwt`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `decodeJwt(token: string): DecodedJwt`
- **Used by:** `verifyGoogleIdToken()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Separa e decodifica um JWT (`header.payload.assinatura`).
- **Input:** `token`: JWT compacto.
- **Output:** Cabeçalho, payload, texto assinado e bytes da assinatura.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro se o token não tiver três partes. Propaga os erros de `decodeJwtJson()`.

### `idTokenProblems`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `idTokenProblems(payload: Readonly<Record<string, unknown>>, expected: IdTokenExpectation): string[]`
- **Used by:** `checkIdTokenClaims()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Lista as verificações do `id_token` que falharam.
- **Input:** `payload`: claims do `id_token`. `expected`: cliente, `nonce` e instante atual em segundos Unix.
- **Output:** Nomes das verificações que falharam (emissor, audiência, validade, nonce, e-mail verificado); vazio quando todas passam.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `checkIdTokenClaims`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `checkIdTokenClaims(payload: Readonly<Record<string, unknown>>, expected: IdTokenExpectation): GoogleIdentity`
- **Used by:** `verifyGoogleIdToken()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Confere as claims do `id_token`.
- **Input:** `payload`: claims. `expected`: cliente, `nonce` e instante atual.
- **Output:** `GoogleIdentity` com `sub` e e-mail em minúsculas.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro listando as verificações que falharam.

### `fetchGoogleKey`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `async fetchGoogleKey(deps: GmailDeps, kid: string): Promise<webcrypto.JsonWebKey>`
- **Used by:** `verifyGoogleIdToken()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Busca a chave pública do Google com o `kid` dado.
- **Input:** `deps`: dependências do conector (rede). `kid`: identificador da chave no cabeçalho do JWT.
- **Output:** A chave pública em formato JWK.
- **Effects:** Rede: JWKS do Google.
- **Errors:** Lança erro se a resposta não for de sucesso ou se a chave não existir. Propaga as falhas de rede.

### `verifyRs256`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `async verifyRs256(jwt: DecodedJwt, jwk: webcrypto.JsonWebKey): Promise<boolean>`
- **Used by:** `verifyGoogleIdToken()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Confere a assinatura RS256 do JWT com a chave pública dada.
- **Input:** `jwt`: JWT decodificado. `jwk`: chave pública RSA em formato JWK.
- **Output:** Verdadeiro se a assinatura confere; falso no resto.
- **Effects:** Nenhum (pura).
- **Errors:** Propaga o erro de `crypto.subtle.importKey` se a chave for inválida.

### `verifyGoogleIdToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `async verifyGoogleIdToken(deps: GmailDeps, idToken: string, nonce: string): Promise<GoogleIdentity>`
- **Used by:** `completeSignIn()`, `linkFromCode()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Valida o `id_token` do Google.
- **Input:** `deps`: dependências. `idToken`: JWT. `nonce`: valor esperado.
- **Output:** `GoogleIdentity` verificada.
- **Effects:** Rede: JWKS do Google.
- **Errors:** Lança erro de algoritmo, chave, assinatura ou claims inválidas.

## `connectors/gmail/src/link-flow.ts`

### `linkRequestKey`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `linkRequestKey(state: string): string`
- **Used by:** `startAccountLink()`, `takeLinkRequest()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Monta a chave do pedido de vínculo no KV.
- **Input:** `state`: `state` do vínculo recebido ou gerado.
- **Output:** Texto `link:<sha256 do state>`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readCookie`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `readCookie(header: string | null, name: string): string | null`
- **Used by:** `takeLinkRequest()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Lê o valor de um cookie do header `Cookie`.
- **Input:** `header`: valor do header `Cookie`, ou nulo. `name`: nome exato do cookie.
- **Output:** Valor do cookie (pode conter `=`), ou nulo se o header faltar ou não tiver o cookie.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `linkCookie`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `linkCookie(value: string | null): string`
- **Used by:** `finishAccountLink()`, `startAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Monta o header `Set-Cookie` do vínculo.
- **Input:** `value`: valor do cookie, ou nulo para apagá-lo.
- **Output:** Texto do `Set-Cookie` de `__Host-gmail-link` (`Secure`, `HttpOnly`, `SameSite=Lax`), com `Max-Age` de 600 s ou 0 quando `value` é nulo.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `startAccountLink`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async startAccountLink(deps: GmailDeps, request: Request): Promise<Response>`
- **Used by:** `connectors/gmail/src/worker.ts (module)`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Resgata o ticket e manda o navegador ao Google para vincular a conta.
- **Input:** `deps`: dependências. `request`: requisição de `/accounts/link?ticket=...`.
- **Output:** 302 ao Google com cookie de vínculo; página 400 sem ticket válido.
- **Effects:** KV: marca o ticket e grava o pedido selado (10 minutos). Define o cookie `__Host-gmail-link`.
- **Errors:** Propaga falhas do KV.

### `takeLinkRequest`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async takeLinkRequest(deps: GmailDeps, request: Request): Promise<LinkRequest | null>`
- **Used by:** `finishAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Recupera e apaga o pedido de vínculo da volta do Google.
- **Input:** `deps`: dependências. `request`: volta do Google com `state` e cookie.
- **Output:** Usuário, verificador e `nonce`; nulo se ausente, vencido ou de outro navegador.
- **Effects:** KV: lê e apaga o pedido (uso único).
- **Errors:** Propaga falhas do KV.

### `linkFromCode`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async linkFromCode(deps: GmailDeps, code: string, link: LinkRequest): Promise<Response>`
- **Used by:** `linkSafely()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Troca o código do Google e grava a conta no usuário do ticket.
- **Input:** `deps`: dependências. `code`: código do Google. `link`: pedido recuperado (usuário, verificador, `nonce`).
- **Output:** Página de sucesso, ou página 400 sem `id_token` ou sem permissão do Gmail.
- **Effects:** Rede: tokens e JWKS do Google. KV: grava a conta.
- **Errors:** Propaga falhas da troca, do `id_token` e do limite de contas (tratadas por `linkSafely()`).

### `linkSafely`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async linkSafely(deps: GmailDeps, code: string, link: LinkRequest): Promise<Response>`
- **Used by:** `finishAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Roda `linkFromCode()` convertendo falhas em página de erro.
- **Input:** `deps`: dependências do conector. `code`: código do Google. `link`: pedido de vínculo recuperado.
- **Output:** A página de `linkFromCode()`, ou página 400 com a mensagem do erro.
- **Effects:** Os de `linkFromCode()` (rede com o Google; grava a conta no KV quando permitida).
- **Errors:** Nenhum: qualquer falha vira página 400 e nada é gravado.

### `finishAccountLink`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async finishAccountLink(deps: GmailDeps, request: Request): Promise<Response>`
- **Used by:** `connectors/gmail/src/worker.ts (module)`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Atende a volta do Google no vínculo de conta.
- **Input:** `deps`: dependências. `request`: volta com `state`, `code` ou `error` e o cookie.
- **Output:** Página do resultado, sempre com o cookie de vínculo apagado.
- **Effects:** Os de `takeLinkRequest()` e `linkSafely()`; apaga o cookie.
- **Errors:** Nenhum: falhas viram página 400.

### `nowSeconds`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `nowSeconds(deps: GmailDeps): number`
- **Used by:** `issueLinkUrl()`, `redeemLinkTicket()`, `startAccountLink()`, `takeLinkRequest()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Converte o relógio das dependências em segundos Unix.
- **Input:** `deps`: dependências.
- **Output:** Segundos inteiros.
- **Effects:** Lê o relógio injetado.
- **Errors:** Nenhum.

### `issueLinkUrl`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `issueLinkUrl(deps: OwnerDeps): string`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Gera o link de vínculo de uso único do usuário.
- **Input:** `deps`: dependências com o usuário.
- **Output:** `<origem>/accounts/link?ticket=<selo>`, válido por 10 minutos.
- **Effects:** Nenhum (só sela; não grava nada).
- **Errors:** Nenhum.

### `redeemLinkTicket`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async redeemLinkTicket(deps: GmailDeps, ticket: string): Promise<string | null>`
- **Used by:** `startAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Resgata o ticket de vínculo uma única vez.
- **Input:** `deps`: dependências. `ticket`: selo do link.
- **Output:** O usuário do ticket; nulo se inválido, vencido ou já usado.
- **Effects:** KV: lê e grava a marca de uso do `jti` (validade de 10 minutos).
- **Errors:** Propaga falhas do KV.

### `invalidTicketPage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `invalidTicketPage(): Response`
- **Used by:** `finishAccountLink()`, `startAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Monta a página de link de vínculo inválido.
- **Input:** Nenhuma.
- **Output:** Página 400 que orienta a pedir outro link com `link_account`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `linkRefusalReason`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `linkRefusalReason(tokens: GoogleTokens): string | null`
- **Used by:** `linkFromCode()`, `linkSignedInAccount()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Diz por que os tokens não servem para ler o Gmail.
- **Input:** `tokens`: resposta do Google.
- **Output:** Mensagem se faltar o escopo do Gmail ou o refresh token; nulo se servem.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `storeGoogleAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async storeGoogleAccount(deps: OwnerDeps, email: string, tokens: GoogleTokens): Promise<void>`
- **Used by:** `linkFromCode()`, `linkSignedInAccount()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Grava a conta Google nas contas do usuário.
- **Input:** `deps`: dependências com o usuário. `email`: conta verificada. `tokens`: tokens do Google com refresh token.
- **Output:** Nada.
- **Effects:** KV: lê e regrava o registro do usuário. Memória do isolate: esquece o access token antigo.
- **Errors:** Lança o erro de limite de `upsertAccount()`; propaga falhas do KV.

## `connectors/gmail/src/message-format.ts`

### `base64UrlToBytes`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `base64UrlToBytes(data: string): Uint8Array`
- **Used by:** `decodePartBody()`, `downloadAttachment()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Decodifica base64url em bytes.
- **Input:** `data`: texto em base64url (corpo ou anexo da Gmail API).
- **Output:** Bytes decodificados; vazio para texto vazio (caracteres inválidos são ignorados).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `partCharset`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `partCharset(part: GmailPart): string`
- **Used by:** `decodePartBody()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Lê o charset declarado no `Content-Type` de uma parte.
- **Input:** `part`: parte MIME da Gmail API.
- **Output:** Charset em minúsculas, ou `utf-8` se não houver.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `decodePartBody`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `decodePartBody(part: GmailPart): string`
- **Used by:** `messageBodyText()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Converte o corpo de uma parte MIME em texto.
- **Input:** `part`: parte MIME da Gmail API (corpo em base64url).
- **Output:** Texto do corpo: Windows-1252 para charsets latinos e `us-ascii`, UTF-8 nos demais; vazio sem corpo.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `headerValues`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `headerValues(headers: readonly { readonly name: string; readonly value: string }[]): Map<string, string>`
- **Used by:** `forwardedText()`, `forwardEmail()`, `partCharset()`, `pickHeaders()`, `quotedText()`, `replyEmail()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Indexa cabeçalhos pelo nome em minúsculas.
- **Input:** `headers`: lista de cabeçalhos `{ name, value }`.
- **Output:** Mapa nome em minúsculas → valor, com o primeiro de cada nome; vazio para lista vazia.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `flattenParts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `flattenParts(part: GmailPart | undefined, depth = 0): GmailPart[]`
- **Used by:** `flattenParts()`, `messageAttachments()`, `messageBodyText()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Achata a árvore MIME em profundidade.
- **Input:** `part`: raiz da árvore MIME, ou indefinida. `depth`: profundidade atual (padrão 0; acima de 20 para).
- **Output:** Todas as partes, a raiz primeiro; vazio sem raiz ou além da profundidade 20.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `isBodyPart`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `isBodyPart(part: GmailPart, mimeType: string): boolean`
- **Used by:** `messageBodyText()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Diz se a parte é corpo do tipo dado.
- **Input:** `part`: parte MIME. `mimeType`: tipo esperado (ex.: `text/plain`).
- **Output:** Verdadeiro se o tipo bate, não há nome de arquivo e há dados no corpo.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `messageBodyText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `messageBodyText(payload: GmailPart | undefined): string`
- **Used by:** `formatMessage()`, `forwardedText()`, `quotedText()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Extrai o corpo da mensagem em texto plano.
- **Input:** `payload`: raiz MIME da mensagem, ou indefinida.
- **Output:** Partes `text/plain` unidas; sem elas, as `text/html` convertidas em texto; vazio sem corpo.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `messageAttachments`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `messageAttachments(payload: GmailPart | undefined): AttachmentInfo[]`
- **Used by:** `formatMessage()`, `forwardAttachments()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Lista os anexos de uma mensagem.
- **Input:** `payload`: raiz MIME da mensagem, ou indefinida.
- **Output:** Anexos (`attachment_id`, `filename`, `mime_type`, `size`) das partes com nome e `attachmentId`; vazio se não houver.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `truncateText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `truncateText(text: string, max: number): string`
- **Used by:** `formatMessage()`, `quotedText()`, `readAttachmentText()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Corta um texto no limite de caracteres.
- **Input:** `text`: texto a limitar. `max`: maior número de caracteres mantidos.
- **Output:** O texto intacto se couber; senão os `max` primeiros caracteres e um aviso de quantos ficaram de fora.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `internalDateIso`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `internalDateIso(internalDate: string | undefined): string | null`
- **Used by:** `draftSummary()`, `formatMessage()`, `summarizeThread()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Converte `internalDate` da Gmail API em data ISO 8601.
- **Input:** `internalDate`: milissegundos Unix em texto, ou indefinido.
- **Output:** Data ISO 8601, ou nulo se vazio ou não numérico.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `pickHeaders`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `pickHeaders(payload: GmailPart | undefined): Record<string, string>`
- **Used by:** `draftSummary()`, `formatMessage()`, `summarizeThread()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Separa os cabeçalhos úteis da mensagem.
- **Input:** `payload`: raiz MIME da mensagem, ou indefinida.
- **Output:** Objeto com `from`, `to`, `cc`, `date` e `subject` presentes; vazio se não houver.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `formatMessage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `formatMessage(message: GmailMessage, format: MessageFormat, maxChars = MAX_MESSAGE_CHARS): Record<string, unknown>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `formatThread()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Converte uma mensagem da Gmail API em objeto enxuto.
- **Input:** `message`: mensagem da Gmail API. `format`: `text` (com corpo) ou `minimal`. `maxChars`: limite do corpo (padrão 20.000).
- **Output:** Ids, data, cabeçalhos, rótulos, resumo e anexos; no formato `text`, também o corpo cortado no limite. Campos ausentes viram nulo ou vazio.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `perMessageLimit`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `perMessageLimit(count: number): number`
- **Used by:** `formatThread()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Calcula o limite de corpo por mensagem numa conversa.
- **Input:** `count`: número de mensagens da conversa (0 conta como 1).
- **Output:** 60.000 dividido por `count`, entre 2.000 e 20.000 caracteres.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `formatThread`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `formatThread(thread: GmailThread, format: MessageFormat): Record<string, unknown>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Converte uma conversa da Gmail API em objeto enxuto.
- **Input:** `thread`: conversa da Gmail API. `format`: `text` (com corpos) ou `minimal`.
- **Output:** `thread_id`, `message_count` e as mensagens formatadas, com o limite de corpo dividido entre elas; lista vazia sem mensagens.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `summarizeThread`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `summarizeThread(thread: GmailThread, account: string): Record<string, unknown>`
- **Used by:** `searchAccount()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Resume uma conversa para a busca.
- **Input:** `thread`: conversa da Gmail API (só cabeçalhos basta). `account`: apelido da conta.
- **Output:** Conta, `thread_id`, assunto da primeira mensagem, remetente, data, resumo e rótulos da última, e `message_count`; texto vazio ou nulo onde faltar dado.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/gmail/src/pages.ts`

### `pageDocument`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `pageDocument(title: string, body: string): string`
- **Used by:** `consentPage()`, `messagePage()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Monta o documento HTML completo de uma página.
- **Input:** `title`: título (escapado aqui). `body`: corpo HTML já escapado por quem chama.
- **Output:** HTML com `lang="pt-BR"`, título e estilo inline.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `messagePage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `messagePage(title: string, message: string, status = 200): Response`
- **Used by:** `accessDeniedPage()`, `authorizationErrorResponse()`, `finishAccountLink()`, `handleDefaultRequest()`, `invalidTicketPage()`, `linkFromCode()`, `linkSafely()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Monta uma página simples de aviso.
- **Input:** `title`: título em texto. `message`: mensagem em texto. `status`: código HTTP (padrão 200).
- **Output:** Resposta HTML com o status dado, CSP restritiva e `no-store`; título e mensagem escapados.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `consentPageBody`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `consentPageBody(details: ConsentDescription, handle: string): string`
- **Used by:** `consentPage()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Monta o corpo HTML da página de consentimento.
- **Input:** `details`: descrição do cliente OAuth (nome, destino, se é loopback). `handle`: identificador da transação de consentimento.
- **Output:** HTML com quem pede, para onde vai o acesso, aviso de loopback quando houver e o formulário Permitir/Negar; tudo escapado.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `copyConsentHeaders`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `copyConsentHeaders(response: Response, headers: Headers): Response`
- **Used by:** `consentPage()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Copia para a resposta os headers da transação de consentimento.
- **Input:** `response`: resposta da página. `headers`: headers da biblioteca OAuth (cookies e anti-frame).
- **Output:** A mesma resposta com os cookies acrescentados e os demais headers copiados, exceto `content-type`, CSP e `set-cookie`.
- **Effects:** Altera os headers da resposta recebida.
- **Errors:** Nenhum.

### `consentPage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `consentPage(details: ConsentDescription, handle: string, headers: Headers): Response`
- **Used by:** `showAuthorize()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Monta a página de consentimento do conector.
- **Input:** `details`: descrição do cliente OAuth. `handle`: identificador da transação. `headers`: headers da transação de consentimento.
- **Output:** Página HTML 200 com CSP que só libera o formulário para o Google e a origem do retorno do cliente, mais os headers da transação.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `TypeError` se `details.redirectUri` não for URL válida.

### `redirectWith`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `redirectWith(location: string, headers: Headers = new Headers()): Response`
- **Used by:** `authorizationErrorResponse()`, `beginGoogleSignIn()`, `finishSignIn()`, `startAccountLink()`, `submitAuthorize()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Monta um redirecionamento 302 com os headers dados.
- **Input:** `location`: destino. `headers`: headers a manter, como cookies da transação (padrão vazio).
- **Output:** Resposta 302 sem corpo, com `Location` e `cache-control: no-store`.
- **Effects:** Altera o objeto `headers` recebido.
- **Errors:** Nenhum.

## `connectors/gmail/src/rate-limit.ts`

### `isRateLimited`

<!-- generated:start -->

- **File:** `connectors/gmail/src/rate-limit.ts`
- **Signature:** `async isRateLimited(limiter: RateLimiter | undefined, key: string): Promise<boolean>`
- **Used by:** `handleGmailWorkerFetch()`, `handleMcpApi()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Diz se a sessão passou do limite de requisições.
- **Input:** `limiter`: binding de rate limiting do Workers, ou indefinido. `key`: chave da sessão (id da sessão OAuth).
- **Output:** Verdadeiro se o binding recusou; falso se aceitou ou se não há binding.
- **Effects:** Conta a requisição no binding de rate limiting.
- **Errors:** Nenhum próprio; falhas do binding propagam.

### `rateLimitedResponse`

<!-- generated:start -->

- **File:** `connectors/gmail/src/rate-limit.ts`
- **Signature:** `rateLimitedResponse(): Response`
- **Used by:** `handleGmailWorkerFetch()`, `handleMcpApi()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Monta a resposta de excesso de requisições.
- **Input:** Nenhuma.
- **Output:** Resposta 429 em JSON (`rate_limited`) com `Retry-After: 60`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/gmail/src/search.ts`

### `encodeMultiPageToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `encodeMultiPageToken(tokens: MultiPageToken): string | null`
- **Used by:** `searchThreads()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Codifica os `page_token` de várias contas num só texto.
- **Input:** `tokens`: `page_token` por apelido de conta.
- **Output:** Base64url do JSON dos tokens, ou nulo se não houver nenhum.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `decodeMultiPageToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `decodeMultiPageToken(token: string): MultiPageToken`
- **Used by:** `pagesToFetch()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Decodifica o `page_token` de várias contas.
- **Input:** `token`: `next_page_token` de uma busca anterior com `all`.
- **Output:** `page_token` por apelido; entradas que não são texto são descartadas.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro acionável ("page_token inválido") se o texto não for base64url de um objeto JSON.

### `fetchThreadMetadata`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `fetchThreadMetadata(deps: OwnerDeps, ref: AccountRef, threadId: string): Promise<GmailThread>`
- **Used by:** `searchAccount()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lê uma conversa só com os cabeçalhos úteis.
- **Input:** `deps`: dependências do conector (configuração, KV, rede, relógio). `account`: conta permitida. `threadId`: id da conversa.
- **Output:** Conversa da Gmail API em `format=metadata`, com `From`, `To`, `Cc`, `Date` e `Subject`.
- **Effects:** Rede (Gmail API e, se preciso, renovação do token no Google); pode marcar a conta como revogada no KV.
- **Errors:** Propaga os erros de `gmailGet`: HTTP da Gmail API, conta sem vínculo ou revogada, falha na renovação do token.

### `searchAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `async searchAccount(deps: OwnerDeps, ref: AccountRef, request: SearchRequest): Promise<AccountSearchResult>`
- **Used by:** `searchThreads()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Busca conversas numa conta.
- **Input:** `deps`: dependências do conector (configuração, KV, rede, relógio). `account`: conta permitida. `request`: consulta, máximo de resultados e `page_token`.
- **Output:** Resumos das conversas encontradas e o próximo `page_token`, ou nulo; lista vazia sem resultados.
- **Effects:** Rede (Gmail API, uma leitura por conversa em paralelo, e renovação do token no Google); pode marcar a conta como revogada no KV.
- **Errors:** Propaga os erros de `gmailGet`: HTTP da Gmail API, conta sem vínculo ou revogada, falha na renovação do token.

### `threadDate`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `threadDate(thread: Readonly<Record<string, unknown>>): string`
- **Used by:** `sortByDateDesc()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lê a data ISO de um resumo de conversa.
- **Input:** `thread`: resumo de conversa.
- **Output:** O campo `date` se for texto; senão texto vazio.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `sortByDateDesc`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `sortByDateDesc(threads: Record<string, unknown>[]): Record<string, unknown>[]`
- **Used by:** `searchThreads()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Ordena resumos de conversas da mais recente para a mais antiga.
- **Input:** `threads`: resumos de conversas.
- **Output:** Nova lista ordenada por data decrescente; sem data vão para o fim.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `pagesToFetch`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `pagesToFetch(accounts: readonly AccountRef[], pageToken: string | null): [AccountRef, string | null][]`
- **Used by:** `searchThreads()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Decide quais contas consultar e com qual token.
- **Input:** `accounts`: contas da busca. `pageToken`: `page_token` de várias contas, ou nulo na primeira página.
- **Output:** Pares conta → token: todas as contas com nulo na primeira página; senão só as que têm token.
- **Effects:** Nenhum (pura).
- **Errors:** Lança o erro de `page_token` inválido de `decodeMultiPageToken`.

### `searchThreads`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `async searchThreads(deps: OwnerDeps, accounts: readonly AccountRef[], request: SearchRequest): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Busca conversas em uma ou várias contas.
- **Input:** `deps`: dependências do conector (configuração, KV, rede, relógio). `accounts`: contas resolvidas. `request`: consulta, máximo por conta e `page_token`.
- **Output:** `threads` (por data decrescente quando há várias contas) e `next_page_token`: o da conta, ou o combinado das contas; nulo quando acabou.
- **Effects:** Rede (Gmail API em paralelo por conta e renovação do token no Google); pode marcar contas como revogadas no KV.
- **Errors:** Lança erro de `page_token` inválido; propaga os erros de `gmailGet` de qualquer conta.

## `connectors/gmail/src/sign-in.ts`

### `authorizationErrorResponse`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `authorizationErrorResponse(error: unknown): Response`
- **Used by:** `finishSignIn()`, `showAuthorize()`, `submitAuthorize()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Converte um erro de autorização em resposta.
- **Input:** `error`: erro capturado no fluxo de autorização.
- **Output:** Redirecionamento 302 ao cliente se o `AuthorizationError` diz para onde; senão página 400 com a descrição do erro ou mensagem genérica.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `beginGoogleSignIn`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `async beginGoogleSignIn(deps: GmailDeps, oauth: OAuthHelpers, approved: { readonly request: AuthRequest; readonly headers: Headers }): Promise<Response>`
- **Used by:** `showAuthorize()`, `submitAuthorize()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Starts the Google sign-in asking for identity and Gmail (`gmail.modify`) with a refresh token.
- **Input:** `deps`: dependências. `oauth`: helpers da biblioteca. `approved`: pedido do Claude aprovado e headers.
- **Output:** 302 ao Google pedindo `openid email gmail.modify` com acesso offline.
- **Effects:** KV `OAUTH_KV` (pela biblioteca): grava a transação com verificador e `nonce`; define o cookie `__Host-`.
- **Errors:** Propaga os erros da biblioteca.

### `showAuthorize`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `async showAuthorize(deps: GmailDeps, oauth: OAuthHelpers, request: Request): Promise<Response>`
- **Used by:** `connectors/gmail/src/worker.ts (module)`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Mostra o consentimento do `GET /authorize`.
- **Input:** `deps`: dependências do conector (configuração, origem). `oauth`: `OAuthHelpers` da biblioteca. `request`: pedido de autorização do Claude.
- **Output:** Página de consentimento 200; ou redirecionamento 302 ao Google se o consentimento já foi lembrado.
- **Effects:** Lê o pedido e o cliente via `OAuthHelpers` (KV OAUTH_KV); abre a transação de consentimento ou a ida ao Google; define cookies.
- **Errors:** Nenhum: erros de autorização viram página 400 ou redirecionamento.

### `submitAuthorize`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `async submitAuthorize(deps: GmailDeps, oauth: OAuthHelpers, request: Request): Promise<Response>`
- **Used by:** `connectors/gmail/src/worker.ts (module)`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Atende a decisão do `POST /authorize`.
- **Input:** `deps`: dependências do conector (configuração, origem). `oauth`: `OAuthHelpers` da biblioteca. `request`: formulário com `handle` e `decision`.
- **Output:** Ao aprovar, redirecionamento 302 ao Google; ao negar, 302 de volta ao cliente.
- **Effects:** Fecha a transação de consentimento via `OAuthHelpers` (KV OAUTH_KV), lembrando a aprovação por 30 dias; define cookies.
- **Errors:** Nenhum: erros de autorização viram página 400 ou redirecionamento.

### `completeSignIn`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `async completeSignIn(deps: GmailDeps, oauth: OAuthHelpers, resumed: { readonly request: AuthRequest; readonly data: SignInData; readonly code: string }): Promise<string | null>`
- **Used by:** `finishSignIn()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Valida o login no Google e conclui a autorização do Claude.
- **Input:** `deps`: dependências. `oauth`: helpers da biblioteca. `resumed`: pedido do Claude, verificador e `nonce`, código do Google.
- **Output:** URL de retorno ao Claude; nulo se o e-mail não pode entrar (modo privado).
- **Effects:** Rede: Google. KV: vincula a conta e grava o grant (`OAUTH_KV`) com `props` de usuário, e-mail e sessão.
- **Errors:** Lança erro sem `id_token`; propaga os da troca e da validação do `id_token`.

### `finishSignIn`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `async finishSignIn(deps: GmailDeps, oauth: OAuthHelpers, request: Request): Promise<Response>`
- **Used by:** `connectors/gmail/src/worker.ts (module)`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Atende a volta do Google no login do dono.
- **Input:** `deps`: dependências do conector (configuração, rede, relógio). `oauth`: `OAuthHelpers` da biblioteca. `request`: volta do Google com `state` e `code` ou erro.
- **Output:** Redirecionamento 302 ao Claude com o código; 302 com `access_denied` se o Google recusou; página 403 se o e-mail não está na allowlist.
- **Effects:** Lê e consome o `state` via `OAuthHelpers` (KV OAUTH_KV); rede (Google); grava a concessão quando permitida; define cookies.
- **Errors:** Nenhum: erros de autorização, troca do código e `id_token` viram página 400 ou redirecionamento.

### `linkSignedInAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `async linkSignedInAccount(deps: GmailDeps, identity: GoogleIdentity, tokens: GoogleTokens): Promise<boolean>`
- **Used by:** `completeSignIn()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Vincula a conta que acabou de entrar no login.
- **Input:** `deps`: dependências. `identity`: `sub` e e-mail verificados. `tokens`: tokens do Google.
- **Output:** `true` se vinculou; `false` sem Gmail, sem refresh token ou se a gravação falhar.
- **Effects:** KV: grava a conta no registro do usuário.
- **Errors:** Nenhum: falha não impede o login.

### `accessDeniedPage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `accessDeniedPage(): Response`
- **Used by:** `finishSignIn()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Monta a página 403 do modo privado.
- **Input:** Nenhuma.
- **Output:** Página 403 para conta fora de `ALLOWED_EMAILS`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/gmail/src/tools.ts`

### `resolveSingleAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `async resolveSingleAccount(deps: OwnerDeps, requested: string): Promise<AccountRef>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`, `connectors/gmail/src/tools.ts (module)`, `resolveWritableAccount()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Resolve `account` exigindo uma única conta.
- **Input:** `deps`: dependências com o usuário. `requested`: apelido ou e-mail.
- **Output:** A conta pedida.
- **Effects:** KV: uma leitura.
- **Errors:** Lança erro para `all`; os de `resolveAccounts()`.

### `accountStatus`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `async accountStatus(deps: OwnerDeps, ref: AccountRef): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Monta o status de uma conta para `list_accounts`.
- **Input:** `deps`: dependências com o usuário. `ref`: conta.
- **Output:** Apelido, e-mail, data do vínculo e status `ok`, `needs_relink` ou `token_error` (com a mensagem).
- **Effects:** Os de `getAccessToken()` (rede e cache).
- **Errors:** Nenhum: falhas viram `token_error`.

### `withUntrustedNotice`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `withUntrustedNotice(data: Record<string, unknown>): Record<string, unknown>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Acrescenta o aviso de conteúdo não confiável a um resultado.
- **Input:** `data`: resultado com conteúdo de e-mail.
- **Output:** Novo objeto com `notice` primeiro e os campos de `data`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `accountLabels`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `async accountLabels(deps: OwnerDeps, ref: AccountRef): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lista os rótulos de uma conta.
- **Input:** `deps`: dependências do conector (configuração, KV, rede, relógio). `account`: conta permitida.
- **Output:** Apelido da conta e rótulos (`id`, `name`, `type`, com `user` por padrão); lista vazia se não houver.
- **Effects:** Rede (Gmail API e, se preciso, renovação do token no Google); pode marcar a conta como revogada no KV.
- **Errors:** Propaga os erros de `gmailGet`: HTTP da Gmail API, conta sem vínculo ou revogada, falha na renovação do token.

### `ownerRefs`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `async ownerRefs(deps: OwnerDeps): Promise<AccountRef[]>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `resolveOwnerAccounts()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Lê as contas vinculadas do usuário com apelidos.
- **Input:** `deps`: dependências com o usuário.
- **Output:** Lista de `AccountRef` (vazia sem contas).
- **Effects:** KV: uma leitura.
- **Errors:** Propaga falhas do KV.

### `resolveOwnerAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `async resolveOwnerAccounts(deps: OwnerDeps, requested: string): Promise<AccountRef[]>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `resolveSingleAccount()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Resolve `account` nas contas do usuário.
- **Input:** `deps`: dependências com o usuário. `requested`: apelido, e-mail ou `all`.
- **Output:** As contas pedidas.
- **Effects:** KV: uma leitura.
- **Errors:** Os de `resolveAccounts()`.

### `resolveWritableAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `async resolveWritableAccount(deps: OwnerDeps, requested: string): Promise<AccountRef>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`, `connectors/gmail/src/send-tools.ts (module)`, `replyTool()`, `writableTargets()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Resolve `account` numa conta só e exige o escopo de escrita antes de tocar o Gmail.
- **Input:** `deps`; `requested`: apelido ou e-mail.
- **Output:** A conta.
- **Effects:** KV: uma leitura.
- **Errors:** Os de `resolveSingleAccount()` e `requireWriteAccess()`.

### `accountBase`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `accountBase(ref: AccountRef): Record<string, unknown>`
- **Used by:** `accountStatus()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Dados fixos de uma conta em `list_accounts`, com `write_access` e a dica de novo vínculo.
- **Input:** `ref`: conta.
- **Output:** Objeto com apelido, e-mail, data, `write_access` e `hint` quando só leitura.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/gmail/src/worker.ts`

### `createGmailDeps`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `createGmailDeps(env: GmailWorkerEnv, origin: string): GmailDeps`
- **Used by:** `handleDefaultRequest()`, `handleMcpApi()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Monta as dependências da requisição a partir do ambiente do Worker.
- **Input:** `env`: variáveis, secrets e bindings do Worker. `origin`: origem pública do conector.
- **Output:** Dependências com configuração lida, KV `GMAIL_KV`, `fetch`, relógio e origem.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro se `ALLOWED_EMAILS` faltar ou for inválido, ou se faltar um secret obrigatório.

### `createGmailServer`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `createGmailServer(deps: OwnerDeps): McpServer`
- **Used by:** `handleMcpApi()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Cria o servidor MCP com as ferramentas do Gmail do usuário.
- **Input:** `deps`: dependências com o usuário.
- **Output:** `McpServer` com `GMAIL_TOOLS` registradas.
- **Effects:** Nenhum.
- **Errors:** Nenhum.

### `configErrorResponse`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `configErrorResponse(error: unknown): Response`
- **Used by:** `handleDefaultRequest()`, `handleMcpApi()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Monta a resposta de configuração inválida do Worker.
- **Input:** `error`: erro lançado ao ler a configuração.
- **Output:** Resposta 500 em texto com a mensagem do erro (nunca o valor de um secret).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `handleMcpApi`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `async handleMcpApi(request: Request, env: GmailWorkerEnv, ctx: ExecutionContext): Promise<Response>`
- **Used by:** `createGmailProvider()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Atende o `/mcp` já autenticado pela biblioteca.
- **Input:** `request`: requisição MCP. `env`: bindings e secrets. `ctx`: contexto com `props` (usuário, e-mail, sessão).
- **Output:** Resposta MCP; 429 acima do limite da sessão; 500 com configuração inválida.
- **Effects:** Binding de rate limiting por sessão; as ferramentas usam KV e rede.
- **Errors:** Nenhum: configuração inválida vira 500 e erros de ferramenta viram resultado MCP de erro.

### `handleDefaultRequest`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `async handleDefaultRequest(request: Request, env: GmailWorkerEnv): Promise<Response>`
- **Used by:** `createGmailProvider()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Atende as rotas próprias do conector fora do `/mcp`.
- **Input:** `request`: requisição recebida. `env`: variáveis, secrets e bindings do Worker, com `OAUTH_PROVIDER` injetado pela biblioteca.
- **Output:** 200 `ok` em `GET /`; a resposta da rota encontrada; página 404 se a rota não existe ou falta `OAUTH_PROVIDER`; 500 se a configuração é inválida.
- **Effects:** Os da rota atendida: KV, `OAuthHelpers` (KV OAUTH_KV), rede (Google) e cookies.
- **Errors:** Nenhum: configuração inválida vira 500; propaga só os erros não tratados da rota de vínculo (troca do código e `id_token`).

### `checkClientRegistration`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `checkClientRegistration(options: ClientRegistrationCallbackOptions): ClientRegistrationCallbackResult | undefined`
- **Used by:** `createGmailProvider()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Decide se o registro dinâmico de um cliente é aceito.
- **Input:** `options`: metadados do cliente que pede registro.
- **Output:** Indefinido se todos os endereços de retorno são do Claude ou localhost; senão erro `invalid_redirect_uri` com status 400.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `publicOrigin`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `publicOrigin(env: GmailWorkerEnv, request: Request): string`
- **Used by:** `handleDefaultRequest()`, `handleGmailWorkerFetch()`, `handleMcpApi()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Calcula a origem pública canônica do conector.
- **Input:** `env`: variáveis do Worker (`PUBLIC_URL` opcional). `request`: requisição recebida.
- **Output:** Origem de `PUBLIC_URL` sem barra final; sem ela, a origem da requisição.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `TypeError` se `PUBLIC_URL` não for URL válida.

### `createGmailProvider`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `createGmailProvider(origin: string): OAuthProvider<GmailWorkerEnv>`
- **Used by:** `handleGmailWorkerFetch()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Cria o provedor OAuth que embrulha o Worker.
- **Input:** `origin`: origem pública do conector.
- **Output:** `OAuthProvider` com `/mcp` como recurso, endpoints `/authorize`, `/token` e `/register`, TTLs de 1 hora e 30 dias e a checagem de registro.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `handleGmailWorkerFetch`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `async handleGmailWorkerFetch(request: Request, env: GmailWorkerEnv, ctx: ExecutionContext): Promise<Response>`
- **Used by:** `connectors/gmail/src/index.ts (module)`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Atende uma requisição do Worker.
- **Input:** `request`: requisição. `env`: bindings e secrets. `ctx`: contexto de execução.
- **Output:** 429 se o IP passou do limite fora do `/mcp`; senão a resposta do provedor OAuth.
- **Effects:** Binding de rate limiting por IP; os do provedor e das rotas.
- **Errors:** Propaga os da biblioteca OAuth.

### `clientIpKey`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `clientIpKey(request: Request): string`
- **Used by:** `handleGmailWorkerFetch()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Monta a chave do limite público pelo IP do cliente.
- **Input:** `request`: requisição.
- **Output:** `ip:<cf-connecting-ip>` ou `ip:unknown`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `isMcpPath`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `isMcpPath(request: Request): boolean`
- **Used by:** `handleGmailWorkerFetch()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Diz se a rota é o `/mcp` protegido por token.
- **Input:** `request`: requisição.
- **Output:** `true` para `/mcp` e subcaminhos.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `src/core/pdf.ts`

### `bytesToLatin1`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `bytesToLatin1(bytes: Uint8Array): string`
- **Used by:** `fontCMaps()`, `isPdf()`, `listRawObjects()`, `pdfToText()`, `splitObjectStream()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Converte bytes em texto de um caractere por byte (latin1), para achar palavras-chave sem perder offsets.
- **Input:** `bytes`: conteúdo binário qualquer.
- **Output:** Texto com um caractere por byte; vazio se não houver bytes.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `isPdf`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `isPdf(bytes: Uint8Array): boolean`
- **Used by:** `detectAttachmentKind()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Diz se os bytes começam como um PDF (`%PDF-`).
- **Input:** `bytes`: conteúdo do arquivo.
- **Output:** `true` se os cinco primeiros bytes são `%PDF-`; `false` caso contrário (inclusive arquivo curto).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `streamDataStart`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `streamDataStart(text: string, keywordAt: number): number`
- **Used by:** `readRawObject()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Calcula o início dos dados de um fluxo, depois de `stream` e da quebra de linha (CRLF ou LF).
- **Input:** `text`: PDF em latin1. `keywordAt`: posição da palavra `stream`.
- **Output:** Posição do primeiro byte de dados; logo após `stream` se não houver quebra de linha.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `trimStreamEol`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `trimStreamEol(text: string, dataStart: number, streamEnd: number): number`
- **Used by:** `readRawObject()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Calcula o fim dos dados de um fluxo sem a quebra de linha que precede `endstream`.
- **Input:** `text`: PDF em latin1. `dataStart`: início dos dados. `streamEnd`: posição de `endstream`.
- **Output:** Posição final dos dados, recuada de CRLF, LF ou CR; nunca antes de `dataStart`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readRawObject`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readRawObject(text: string, bytes: Uint8Array, start: number): { dict: string; stream: Uint8Array | null; end: number }`
- **Used by:** `listRawObjects()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lê o objeto que começa em `start`, logo após `N G obj`.
- **Input:** `text`: PDF em latin1. `bytes`: o mesmo PDF em bytes. `start`: posição logo após `N G obj`.
- **Output:** `{ dict, stream, end }`: dicionário em texto, bytes do fluxo ainda comprimido (`null` se não houver) e onde a busca pelo próximo objeto continua; sem `endobj`, vai até o fim do texto.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `listRawObjects`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `listRawObjects(bytes: Uint8Array): RawPdfObject[]`
- **Used by:** `readPdfObjects()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lista os objetos `N G obj ... endobj` do arquivo, na ordem em que aparecem.
- **Input:** `bytes`: conteúdo do PDF.
- **Output:** Lista de objetos crus com número, dicionário e fluxo comprimido (`null` sem fluxo); vazia se não houver objetos.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `decodePdfStream`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `async decodePdfStream(dict: string, stream: Uint8Array): Promise<Uint8Array | null>`
- **Used by:** `readPdfObjects()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Descomprime o fluxo conforme o `/Filter` do dicionário.
- **Input:** `dict`: dicionário do objeto. `stream`: bytes do fluxo como estão no arquivo.
- **Output:** Os próprios bytes sem `/Filter`; os bytes inflados com FlateDecode; `null` para outro filtro ou fluxo corrompido.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum (fluxo corrompido devolve `null`).

### `splitObjectStream`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `splitObjectStream(dict: string, data: Uint8Array): [number, PdfObject][]`
- **Used by:** `storePdfObject()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Separa os objetos guardados num fluxo de objetos (`/Type /ObjStm`).
- **Input:** `dict`: dicionário do fluxo de objetos, com `/First`. `data`: fluxo já descomprimido.
- **Output:** Pares [número, objeto] com o dicionário de cada objeto e `data` nulo; vazia se faltar `/First`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `storePdfObject`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `storePdfObject(objects: Map<number, PdfObject>, num: number, obj: PdfObject): void`
- **Used by:** `readPdfObjects()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Guarda um objeto lido e, se ele for um fluxo de objetos, os objetos de dentro sem sobrescrever.
- **Input:** `objects`: mapa de objetos em construção. `num`: número do objeto. `obj`: dicionário e fluxo descomprimido.
- **Output:** Nada.
- **Effects:** Altera `objects`.
- **Errors:** Nenhum.

### `readPdfObjects`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `async readPdfObjects(bytes: Uint8Array): Promise<PdfObjects>`
- **Used by:** `pdfToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lê todos os objetos do PDF, descomprimindo fluxos e abrindo os fluxos de objetos.
- **Input:** `bytes`: conteúdo do PDF.
- **Output:** Mapa número → objeto; fluxo com filtro desconhecido ou corrompido fica com `data` nulo; mapa vazio se não houver objetos.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum (fluxo corrompido fica com `data` nulo).

### `pdfRefs`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `pdfRefs(text: string): number[]`
- **Used by:** `dictRefs()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lista os números de objeto citados como referência (`N 0 R`) num trecho.
- **Input:** `text`: trecho de dicionário do PDF.
- **Output:** Números dos objetos referenciados, na ordem; vazia se não houver referência.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `dictRefs`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `dictRefs(dict: string, key: string): number[]`
- **Used by:** `collectPdfPages()`, `fontCMaps()`, `pdfToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lê o valor de uma chave que pode ser referência única ou lista de referências.
- **Input:** `dict`: dicionário do objeto. `key`: nome da chave sem a barra (ex.: `Kids`, `Contents`).
- **Output:** Números dos objetos referenciados; vazia se a chave não existir ou não for referência.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `collectPdfPages`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `collectPdfPages(objects: PdfObjects, num: number, pages: number[]): void`
- **Used by:** `collectPdfPages()`, `orderedPages()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Acrescenta a `pages` as páginas sob o nó `num` da árvore de páginas, em ordem.
- **Input:** `objects`: objetos do PDF. `num`: nó da árvore de páginas. `pages`: lista que recebe as páginas; a descida para em 10 000 páginas.
- **Output:** Nada.
- **Effects:** Altera `pages`.
- **Errors:** Nenhum.

### `orderedPages`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `orderedPages(objects: PdfObjects): number[]`
- **Used by:** `pdfToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lista as páginas na ordem de leitura, percorrendo a árvore `/Pages` a partir da raiz.
- **Input:** `objects`: objetos do PDF.
- **Output:** Números dos objetos de página em ordem; vazia se não houver raiz `/Pages`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `utf16beHexToString`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `utf16beHexToString(hex: string): string`
- **Used by:** `rangeTarget()`, `readBfChars()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Decodifica hexadecimal UTF-16BE (destino de um mapa ToUnicode) em texto.
- **Input:** `hex`: dígitos hexadecimais; dois dígitos valem como um byte.
- **Output:** O texto decodificado; dígitos que sobram fora de grupos de quatro são ignorados; vazio se `hex` for vazio.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readBfChars`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readBfChars(text: string, map: Map<number, string>): void`
- **Used by:** `parseToUnicodeCMap()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lê as linhas `<orig> <destino>` dos blocos `beginbfchar` de um mapa ToUnicode.
- **Input:** `text`: mapa ToUnicode em texto. `map`: mapa código → texto que recebe as entradas.
- **Output:** Nada.
- **Effects:** Altera `map`.
- **Errors:** Nenhum.

### `readBfRanges`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readBfRanges(text: string, map: Map<number, string>): void`
- **Used by:** `parseToUnicodeCMap()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lê os blocos `beginbfrange` de um mapa ToUnicode.
- **Input:** `text`: mapa ToUnicode em texto. `map`: mapa código → texto que recebe as entradas; cada faixa é limitada a 65 536 códigos.
- **Output:** Nada.
- **Effects:** Altera `map`.
- **Errors:** Nenhum.

### `rangeTarget`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `rangeTarget(targets: readonly string[], offset: number): string`
- **Used by:** `readBfRanges()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Calcula o destino de um código num `bfrange`.
- **Input:** `targets`: destinos em hexadecimal (um inicial ou uma lista). `offset`: distância do código ao início da faixa.
- **Output:** O item da lista, ou o destino inicial com o último caractere somado ao deslocamento; vazio se o destino for vazio ou faltar.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `parseToUnicodeCMap`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `parseToUnicodeCMap(text: string): PdfCMap`
- **Used by:** `fontCMaps()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Interpreta um mapa ToUnicode com seus códigos de 1 ou 2 bytes.
- **Input:** `text`: mapa ToUnicode em texto.
- **Output:** `{ map, bytes }`: código → texto e o tamanho do código (2 se o `codespacerange` tiver 4+ dígitos, senão 1); mapa vazio se não houver blocos.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `addFontRefs`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `addFontRefs(fonts: Map<string, number>, text: string): void`
- **Used by:** `fontResourceRefs()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Acrescenta a `fonts` os pares nome → objeto (`/F1 5 0 R`) de um dicionário de fontes.
- **Input:** `fonts`: mapa nome → objeto que recebe os pares. `text`: conteúdo do dicionário de fontes.
- **Output:** Nada.
- **Effects:** Altera `fonts` (não sobrescreve nomes já presentes).
- **Errors:** Nenhum.

### `fontResourceRefs`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `fontResourceRefs(objects: PdfObjects): Map<string, number>`
- **Used by:** `fontCMaps()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Junta os nomes de fonte (`/F1`) e seus objetos de todos os dicionários `/Font` dos recursos.
- **Input:** `objects`: objetos do PDF.
- **Output:** Mapa nome → número do objeto da fonte; o primeiro encontrado vence; vazio sem fontes.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `fontCMaps`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `fontCMaps(objects: PdfObjects): Map<string, PdfCMap>`
- **Used by:** `pdfToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Monta os mapas ToUnicode por nome de fonte, para as fontes que têm `/ToUnicode`.
- **Input:** `objects`: objetos do PDF.
- **Output:** Mapa nome da fonte → mapa ToUnicode; fontes sem `/ToUnicode` legível ficam de fora.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `decodePdfText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `decodePdfText(raw: string, cmap: PdfCMap | undefined): string`
- **Used by:** `lastOperandText()`, `showArrayText()`
- **Processes:** —

<!-- generated:end -->

- **Does:** Decodifica os bytes de uma string de texto pela fonte atual (ToUnicode).
- **Input:** `raw`: string crua (um caractere por byte). `cmap`: mapa ToUnicode da fonte, ou `undefined`.
- **Output:** O texto decodificado; sem mapa, a própria string (latin1); códigos sem entrada no mapa somem.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readLiteralString`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readLiteralString(src: string, start: number): [string, number]`
- **Used by:** `nextPdfToken()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lê uma string literal `( ... )` a partir do `(`.
- **Input:** `src`: fluxo de conteúdo. `start`: posição do `(`.
- **Output:** [texto cru com escapes resolvidos, posição seguinte]; sem `)` de fechamento, vai até o fim.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readEscape`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readEscape(src: string, pos: number): [string, number]`
- **Used by:** `readLiteralString()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lê o escape que vem depois de `\` numa string literal.
- **Input:** `src`: fluxo de conteúdo. `pos`: posição logo após a `\`.
- **Output:** [texto do escape, posição seguinte]: octal de até 3 dígitos, letra conhecida, vazio para quebra de linha ou o próprio caractere.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readHexString`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readHexString(src: string, start: number): [string, number]`
- **Used by:** `nextPdfToken()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lê uma string hexadecimal `<...>` a partir do `<`.
- **Input:** `src`: fluxo de conteúdo. `start`: posição do `<`.
- **Output:** [texto cru, posição seguinte]; ignora não-hexadecimais e completa dígito ímpar com 0; sem `>`, vai até o fim.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `skipPdfSpace`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `skipPdfSpace(src: string, pos: number): number`
- **Used by:** `nextPdfToken()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Acha a posição do próximo caractere que não é espaço, a partir de `pos`.
- **Input:** `src`: fluxo de conteúdo. `pos`: posição inicial.
- **Output:** A posição do próximo caractere não branco, ou o fim do texto.
- **Effects:** Altera o `lastIndex` da regex do módulo `PDF_SPACE`.
- **Errors:** Nenhum.

### `nextPdfToken`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `nextPdfToken(src: string, pos: number): [PdfToken, number] | null`
- **Used by:** `contentStreamText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lê o próximo item do fluxo de conteúdo a partir de `pos`.
- **Input:** `src`: fluxo de conteúdo. `pos`: posição inicial.
- **Output:** [item, posição seguinte]; `null` no fim do texto.
- **Effects:** Altera o `lastIndex` das regex do módulo `PDF_SPACE` e `PDF_WORD`.
- **Errors:** Nenhum.

### `readPdfWord`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readPdfWord(src: string, at: number): [PdfToken, number]`
- **Used by:** `nextPdfToken()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lê uma palavra (nome, número, operador, `<<`/`>>` ou comentário) a partir de `at`.
- **Input:** `src`: fluxo de conteúdo. `at`: posição de um caractere não branco.
- **Output:** [item classificado, posição seguinte].
- **Effects:** Altera o `lastIndex` da regex do módulo `PDF_WORD`.
- **Errors:** Nenhum.

### `wrapString`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `wrapString([value, next]: [string, number]): [PdfToken, number]`
- **Used by:** `nextPdfToken()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Embrulha o resultado de uma leitura de string num item `string`.
- **Input:** `[value, next]`: texto lido e posição seguinte.
- **Output:** [item `string` com o texto, posição seguinte].
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `classifyWord`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `classifyWord(word: string): PdfToken`
- **Used by:** `readPdfWord()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Classifica uma palavra do fluxo como nome (`/F1`), número ou operador.
- **Input:** `word`: palavra lida do fluxo.
- **Output:** Item `name` sem a barra, `number` com o valor, ou `op` com a palavra.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `showArrayText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `showArrayText(items: readonly PdfToken[], font: PdfCMap | undefined): string`
- **Used by:** `src/core/pdf.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Monta o texto de um operando de `TJ`, com espaços onde o ajuste é grande.
- **Input:** `items`: itens da lista do `TJ`. `font`: mapa ToUnicode da fonte atual, ou `undefined`.
- **Output:** Strings decodificadas, com espaço para ajuste menor que `TJ_SPACE_THRESHOLD`; vazio se não houver strings.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `lastOperandText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `lastOperandText(state: PdfTextState): string`
- **Used by:** `src/core/pdf.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Decodifica o texto da última string dos operandos pela fonte atual.
- **Input:** `state`: estado do intérprete de texto.
- **Output:** O texto decodificado; vazio se o último operando não for string ou não houver operandos.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `moveText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `moveText(state: PdfTextState): string`
- **Used by:** `src/core/pdf.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Decide o que um `Td`/`TD` produz no texto.
- **Input:** `state`: estado do intérprete, com os operandos do operador.
- **Output:** Quebra de linha se o último operando (ty) for número diferente de zero; senão um espaço.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `applyTextOperator`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `applyTextOperator(state: PdfTextState, op: string, cmaps: ReadonlyMap<string, PdfCMap>): void`
- **Used by:** `feedPdfToken()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Aplica um operador de texto ao estado do intérprete.
- **Input:** `state`: estado do intérprete. `op`: nome do operador. `cmaps`: mapas ToUnicode por nome de fonte.
- **Output:** Nada.
- **Effects:** Altera `state` (troca a fonte em `Tf` ou acrescenta texto em `out`); operador desconhecido não muda nada.
- **Errors:** Nenhum.

### `feedPdfToken`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `feedPdfToken(state: PdfTextState, token: PdfToken, cmaps: ReadonlyMap<string, PdfCMap>): void`
- **Used by:** `contentStreamText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Consome um item no intérprete de texto.
- **Input:** `state`: estado do intérprete. `token`: item lido do fluxo. `cmaps`: mapas ToUnicode por nome de fonte.
- **Output:** Nada.
- **Effects:** Altera `state` (lista aberta, operandos e texto produzido).
- **Errors:** Nenhum.

### `contentStreamText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `contentStreamText(content: string, cmaps: ReadonlyMap<string, PdfCMap>): string`
- **Used by:** `pdfToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Extrai o texto de um fluxo de conteúdo de página.
- **Input:** `content`: fluxo de conteúdo em latin1. `cmaps`: mapas ToUnicode por nome de fonte.
- **Output:** O texto produzido pelos operadores de texto; vazio se não houver nenhum.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `tidyPdfText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `tidyPdfText(text: string): string`
- **Used by:** `pdfToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Limpa o texto extraído de espaços repetidos, linhas em branco em excesso e pontas.
- **Input:** `text`: texto extraído do PDF.
- **Output:** O texto com espaços colapsados, no máximo uma linha em branco seguida e sem espaços nas pontas.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `pdfToText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `async pdfToText(bytes: Uint8Array): Promise<string>`
- **Used by:** `attachmentBytesToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Extrai o texto de um PDF, página por página.
- **Input:** `bytes`: conteúdo do PDF.
- **Output:** O texto das páginas separado por linha em branco e limpo; vazio se não houver texto legível (ex.: PDF só de imagens).
- **Effects:** Nenhum (pura).
- **Errors:** Lança `Error` se o PDF for cifrado (`/Encrypt` nos últimos 4 KB).

## `connectors/whatsapp/src/bridge-client.ts`

### `bridgeErrorFrom`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `bridgeErrorFrom(status: number, body: unknown): BridgeError`
- **Used by:** `attemptBridge()`, `ensureRestored()`
- **Processes:** P13, P14, P15, P16

<!-- generated:end -->

- **Does:** Traduz uma resposta de erro da ponte em `BridgeError` com mensagem em português.
- **Input:** `status` HTTP e o corpo JSON da resposta (qualquer valor).
- **Output:** `BridgeError` com mensagem de `BRIDGE_ERROR_MESSAGES` (ou a da ponte), status e código.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum (devolve o erro, não lança).

### `withDeadline`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `withDeadline(promise: Promise<T>, deadline: number, message: string): Promise<T>`
- **Used by:** `attemptBridge()`, `runRead()`, `runScheduledSync()`
- **Processes:** P13, P14, P15, P17

<!-- generated:end -->

- **Does:** Espera uma promessa até o instante `deadline` (ms Unix); depois disso rejeita com a mensagem dada.
- **Input:** `promise`, `deadline` (ms Unix) e a mensagem de tempo esgotado.
- **Output:** Promessa com o valor da original.
- **Effects:** Agenda e limpa um `setTimeout`.
- **Errors:** Rejeita com `Error(message)` se o prazo passar (ou já passou); repassa a rejeição da original.

### `bridgeTimeoutMessage`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `bridgeTimeoutMessage(path: string): string`
- **Used by:** `attemptBridge()`
- **Processes:** P13, P14, P15

<!-- generated:end -->

- **Does:** Mensagem de tempo esgotado de uma chamada à ponte.
- **Input:** `path` da chamada (com ou sem query).
- **Output:** Texto em português com a rota sem query.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `callBridge`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `async callBridge(bridge: BridgeFetch, path: string, options: { readonly init?: RequestInit; readonly deadline: number }): Promise<Response>`
- **Used by:** `bridgeJson()`, `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P13, P14, P15

<!-- generated:end -->

- **Does:** Chama a ponte dentro do prazo, esperando-a acordar (`not_ready`); 2xx devolve a resposta, o resto lança.
- **Input:** `bridge`, `path` e opções (`init`, `deadline`).
- **Output:** `Response` 2xx da ponte.
- **Effects:** Rede: requisição ao Durable Object da ponte.
- **Errors:** `BridgeError` com o código da ponte (depois de esgotar as novas tentativas de `not_ready`); erro de tempo esgotado.

### `bridgeJson`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `async bridgeJson(bridge: BridgeFetch, path: string, options: { readonly init?: RequestInit; readonly deadline: number }): Promise<T>`
- **Used by:** `connectors/whatsapp/src/pair.ts (module)`, `connectors/whatsapp/src/tools.ts (module)`, `fetchPairStatus()`, `prepareRead()`
- **Processes:** P13, P14, P15

<!-- generated:end -->

- **Does:** Chama a ponte e lê o JSON da resposta.
- **Input:** `bridge`, `path` e opções (`init`, `deadline`).
- **Output:** Corpo JSON tipado como `T`.
- **Effects:** Rede: requisição ao Durable Object da ponte.
- **Errors:** Os de `callBridge`; rejeita se o corpo não for JSON.

### `bridgePath`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `bridgePath(path: string, params: Readonly<Record<string, string | number | undefined>>): string`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`, `prepareRead()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Monta `caminho?query` só com os parâmetros definidos.
- **Input:** `path` e os parâmetros (indefinidos e vazios são ignorados).
- **Output:** Caminho com a query, ou só o caminho.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `jsonPost`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `jsonPost(body: unknown): RequestInit`
- **Used by:** `connectors/whatsapp/src/pair.ts (module)`, `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Corpo JSON de um POST para a ponte.
- **Input:** `body`: valor a serializar.
- **Output:** `RequestInit` com método POST, `content-type` JSON e corpo.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `shouldRetryBridge`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `shouldRetryBridge(error: BridgeError, deadline: number, now: number): boolean`
- **Used by:** `callBridge()`
- **Processes:** P13, P14, P15

<!-- generated:end -->

- **Does:** Diz se vale tentar de novo: a ponte ainda está iniciando e sobra prazo para mais uma tentativa.
- **Input:** `error`: erro da ponte; `deadline`: prazo (ms Unix); `now`: instante atual (ms).
- **Output:** `true` só para `not_ready` com prazo para mais uma espera de `BRIDGE_RETRY_MS`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `attemptBridge`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `async attemptBridge(bridge: BridgeFetch, path: string, options: { readonly init?: RequestInit; readonly deadline: number }): Promise<Response>`
- **Used by:** `callBridge()`
- **Processes:** P13, P14, P15

<!-- generated:end -->

- **Does:** Faz uma tentativa: resposta 2xx, ou `BridgeError` com o código da ponte.
- **Input:** `bridge`: fetch do Durable Object; `path`: rota com query; `options`: `init` opcional e `deadline` (ms Unix).
- **Output:** A resposta 2xx.
- **Effects:** Rede (chamada ao Durable Object da ponte).
- **Errors:** `BridgeError` em status ≠ 2xx; erro de tempo esgotado depois do `deadline`.

## `connectors/whatsapp/src/config.ts`

### `requireEnv`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `requireEnv(env: EnvVars, key: string, how: string): string`
- **Used by:** `containerEnvVars()`, `readWhatsAppSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Lê uma variável obrigatória ou lança dizendo como defini-la.
- **Input:** `env`, a chave e a instrução de como defini-la.
- **Output:** Valor da variável.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `Error` se a variável estiver ausente ou vazia.

### `readIntInRange`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readIntInRange(env: EnvVars, key: string, range: { readonly min: number; readonly max: number; readonly fallback: number }): number`
- **Used by:** `readSendSettings()`, `readTimingSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Lê um inteiro dentro de um intervalo; ausente vale o padrão, fora do intervalo lança.
- **Input:** `env`, a chave e o intervalo (`min`, `max`, `fallback`).
- **Output:** O inteiro lido ou o padrão.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `Error` se não for inteiro ou estiver fora do intervalo.

### `readSleepAfter`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readSleepAfter(env: EnvVars): string`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`, `readTimingSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Valida `SLEEP_AFTER` (`30s` a `60m`, ou `1h`); ausente vale `5m`.
- **Input:** `env`.
- **Output:** A duração no formato do `Container` (ex. `5m`).
- **Effects:** Nenhum (pura).
- **Errors:** Lança `Error` se o formato for inválido ou a duração estiver fora de 30 s a 1 h.

### `normalizePhone`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `normalizePhone(raw: string): string | null`
- **Used by:** `connectors/whatsapp/src/pair.ts (module)`, `normalizeRecipient()`
- **Processes:** P13, P15, P17

<!-- generated:end -->

- **Does:** Normaliza um número de telefone ou JID de contato para só dígitos; nulo se não parecer um número.
- **Input:** `raw`: número ou JID (`...@s.whatsapp.net`).
- **Output:** De 8 a 15 dígitos, ou `null`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readSendAllowlist`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readSendAllowlist(env: EnvVars): string[]`
- **Used by:** `readSendSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Lê `SEND_ALLOWLIST` (números ou JIDs separados por vírgula; vazia = qualquer destinatário); item inválido lança.
- **Input:** `env`.
- **Output:** Lista de JIDs normalizados (vazia se ausente).
- **Effects:** Nenhum (pura).
- **Errors:** Lança `Error` com o item inválido.

### `readAllowedEmails`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readAllowedEmails(env: EnvVars): string[]`
- **Used by:** `readWhatsAppSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Lê a lista de donos (`ALLOWED_EMAILS`); vazia lança, porque ninguém conseguiria entrar.
- **Input:** `env`.
- **Output:** Lista de e-mails em minúsculas.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `Error` se a lista estiver vazia.

### `readTimingSettings`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readTimingSettings(env: EnvVars): Pick<WhatsAppSettings, 'sleepAfter' | 'toolTimeoutMs' | 'syncWaitMs'>`
- **Used by:** `readWhatsAppSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Lê os prazos: sono do container, teto por ferramenta e espera do sync.
- **Input:** `env`.
- **Output:** `sleepAfter`, `toolTimeoutMs` e `syncWaitMs`.
- **Effects:** Nenhum (pura).
- **Errors:** Os de `readSleepAfter` e `readIntInRange`.

### `readSendSettings`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readSendSettings(env: EnvVars): Pick<WhatsAppSettings, 'enableSend' | 'sendAllowlist' | 'sendMaxPerHour'>`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`, `readWhatsAppSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Lê a configuração de envio: ligado ou não, allowlist opcional e limite por hora.
- **Input:** `env`.
- **Output:** `enableSend`, `sendAllowlist` e `sendMaxPerHour`.
- **Effects:** Nenhum (pura).
- **Errors:** Os de `readSendAllowlist` e `readIntInRange`.

### `readWhatsAppSettings`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readWhatsAppSettings(env: EnvVars): WhatsAppSettings`
- **Used by:** `createWhatsAppApps()`, `isSyncCronEnabled()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Lê e valida a configuração do conector a partir do ambiente do Worker.
- **Input:** `env`: variáveis de texto do Worker.
- **Output:** `WhatsAppSettings` completo.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `Error` explicando a variável ausente ou inválida.

### `containerEnvVars`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `containerEnvVars(env: EnvVars): Record<string, string>`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Monta o ambiente do container: só as chaves da ponte, mais o endereço do snapshot de saída.
- **Input:** `env`: variáveis de texto do Worker.
- **Output:** Variáveis de `BRIDGE_ENV_KEYS` presentes, mais `SNAPSHOT_PUSH_URL`.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `Error` se faltar `BRIDGE_TOKEN` (ou tiver menos de 32 caracteres) ou `SNAPSHOT_KEY`.

### `normalizeRecipient`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `normalizeRecipient(raw: string): string | null`
- **Used by:** `allowedRecipient()`, `readSendAllowlist()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Normaliza um destinatário de envio para JID: número (com ou sem `+`, espaços, traços) vira `<dígitos>@s.whatsapp.net`; JIDs de contato, LID e grupo (`@g.us`, inclusive `criador-timestamp`) passam como estão. Pura.
- **Input:** `raw`: número ou JID digitado.
- **Output:** JID normalizado, ou `null` se não for contato nem grupo (ex.: `status@broadcast`).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/whatsapp/src/container.ts`

### `workersFixedLength`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/container.ts`
- **Signature:** `workersFixedLength(body: ReadableStream<Uint8Array>, length: number): ReadableStream<Uint8Array>`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Fluxo de tamanho fixo do Workers para gravar no R2 sem carregar o arquivo na memória.
- **Input:** `body`: fluxo de bytes; `length`: tamanho total.
- **Output:** Fluxo legível do `FixedLengthStream`.
- **Effects:** Copia `body` para o `FixedLengthStream` com `pumpInto()` (em segundo plano).
- **Errors:** Nenhum (falha do encadeamento não é observada aqui).

## `connectors/whatsapp/src/format.ts`

### `isHiddenChar`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `isHiddenChar(char: string): boolean`
- **Used by:** `sanitizeText()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Diz se um caractere é invisível ou de controle (pode esconder texto do usuário).
- **Input:** `char`: um caractere.
- **Output:** `true` se cai em `HIDDEN_CHAR_RANGES`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `sanitizeText`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `sanitizeText(text: string | null | undefined, max = MAX_TEXT_CHARS): string`
- **Used by:** `compactChat()`, `compactContact()`, `compactMessage()`, `connectors/whatsapp/src/tools.ts (module)`, `mediaResult()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Limpa um texto de terceiros: tira caracteres invisíveis/de controle e corta no teto.
- **Input:** `text` (pode ser nulo) e `max` (padrão `MAX_TEXT_CHARS`).
- **Output:** Texto limpo, com aviso `[truncated N chars]` se cortado.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `untrusted`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `untrusted(data: T): { readonly notice: string; readonly data: T }`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Embrulha dados com conteúdo de terceiros sob o aviso de não confiável.
- **Input:** `data`: qualquer valor.
- **Output:** `{ notice: UNTRUSTED_NOTICE, data }`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `compactMessage`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `compactMessage(message: BridgeMessage): Record<string, unknown>`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Mensagem compacta: só campos úteis, textos limpos, sem campos vazios.
- **Input:** `message`: mensagem da ponte.
- **Output:** Objeto com `id`, `chat`, `from`, `at` e, se houver, nome, tipo, texto e mídia.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `compactChat`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `compactChat(chat: BridgeChat): Record<string, unknown>`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Conversa compacta, com a prévia da última mensagem limpa e curta.
- **Input:** `chat`: conversa da ponte.
- **Output:** Objeto com `jid`, `name`, `last_at` e, se houver, `group` e `last`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `partialSyncWarning`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `partialSyncWarning(status: BridgeStatus): string | null`
- **Used by:** `prepareRead()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Aviso de resultado parcial quando o sync de pendências não terminou a tempo.
- **Input:** `status`: status da ponte.
- **Output:** Aviso (sincronizando ou desconectado) ou `null` se não é parcial.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `compactStatus`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `compactStatus(status: BridgeStatus, pairUrl: string): Record<string, unknown>`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Status compacto para `whatsapp_status`.
- **Input:** `status` da ponte e `pairUrl` da página de pareamento.
- **Output:** Objeto com conexão, pareamento (e `pair_at` se preciso), sync, contagens e envio.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/whatsapp/src/lifecycle.ts`

### `withBridgeToken`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `withBridgeToken(token: string, init: RequestInit = {}): RequestInit`
- **Used by:** `fetchBridge()`
- **Processes:** P14, P16

<!-- generated:end -->

- **Does:** Junta o `Authorization` da ponte às opções de uma requisição.
- **Input:** `token` da ponte e `init` (opcional).
- **Output:** `RequestInit` com `authorization: Bearer <token>`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `fetchBridge`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `fetchBridge(host: BridgeHost, path: string, init?: RequestInit): Promise<Response>`
- **Used by:** `ensureRestored()`, `readBridgePhase()`, `routeBridgeRequest()`, `snapshotBridge()`
- **Processes:** P14, P16

<!-- generated:end -->

- **Does:** Faz uma requisição à ponte dentro do container, já autenticada.
- **Input:** `host`, `path` e `init` opcional.
- **Output:** Resposta da ponte.
- **Effects:** Rede: `containerFetch` (pode acordar o container).
- **Errors:** Repassa a rejeição do `containerFetch`.

### `readBridgePhase`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async readBridgePhase(host: BridgeHost): Promise<string>`
- **Used by:** `ensureRestored()`
- **Processes:** P14, P16

<!-- generated:end -->

- **Does:** Lê a fase da ponte (`GET /health`).
- **Input:** `host`: porta do Durable Object.
- **Output:** Fase (ex. `awaiting_restore`) ou `unknown`.
- **Effects:** Rede: `GET /health` no container.
- **Errors:** Rejeita se a chamada falhar ou o corpo não for JSON.

### `restoreRequestInit`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async restoreRequestInit(host: BridgeHost): Promise<RequestInit>`
- **Used by:** `ensureRestored()`
- **Processes:** P14, P16

<!-- generated:end -->

- **Does:** Opções do `POST /restore`: o snapshot do bucket em fluxo, ou `X-Snapshot: none` se não houver.
- **Input:** `host`: porta do Durable Object.
- **Output:** `RequestInit` do POST, com o snapshot como corpo ou o header `x-snapshot: none`.
- **Effects:** Lê o snapshot no R2.
- **Errors:** Repassa a rejeição do R2.

### `ensureRestored`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async ensureRestored(host: BridgeHost): Promise<void>`
- **Used by:** `routeBridgeRequest()`
- **Processes:** P14, P16

<!-- generated:end -->

- **Does:** Restaura a ponte se ela acabou de acordar; snapshot recusado lança (nunca recomeça do zero sozinho).
- **Input:** `host`: porta do Durable Object.
- **Output:** Nada.
- **Effects:** Rede: `/health` e `/restore` no container; lê o snapshot no R2.
- **Errors:** Lança `BridgeError` se o restore falhar (exceto 409, outra requisição já restaurou).

### `snapshotBridge`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async snapshotBridge(host: BridgeHost, force = false): Promise<SnapshotOutcome>`
- **Used by:** `connectors/whatsapp/src/lifecycle.ts (module)`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Pede o snapshot à ponte e grava no bucket.
- **Input:** `host`: porta do Durable Object; `force`: pede `?force=1` (depois de uma gravação que falhou).
- **Output:** `SnapshotOutcome` (`saved`, `unchanged` ou `stale`).
- **Effects:** Rede: `GET /snapshot` no container; grava no R2.
- **Errors:** Os de `storeSnapshotResponse`.

### `planSend`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `planSend(history: readonly number[], now: number, maxPerHour: number): { readonly allowed: boolean; readonly history: number[]; readonly retryAfterSeconds: number }`
- **Used by:** `guardSend()`
- **Processes:** P14, P17

<!-- generated:end -->

- **Does:** Decide um envio: permitido (e o histórico novo) ou recusado com quantos segundos esperar. Pura.
- **Input:** `history` (ms dos envios), `now` (ms) e `maxPerHour`.
- **Output:** `allowed`, o histórico da última hora e `retryAfterSeconds`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `guardSend`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async guardSend(host: BridgeHost): Promise<Response | null>`
- **Used by:** `routeBridgeRequest()`
- **Processes:** P14, P17

<!-- generated:end -->

- **Does:** Aplica o limite de envios; devolve a resposta 429 se estourou, ou nulo (e registra o envio) se pode.
- **Input:** `host`: porta do Durable Object.
- **Output:** Resposta 429 `rate_limited` ou `null`.
- **Effects:** Lê e grava `SEND_HISTORY_KEY` no armazenamento do Durable Object.
- **Errors:** Repassa a rejeição do armazenamento.

### `forwardInit`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `forwardInit(request: Request): RequestInit`
- **Used by:** `routeBridgeRequest()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Opções para repassar uma requisição recebida à ponte (método, tipo e corpo).
- **Input:** `request`: requisição recebida.
- **Output:** `RequestInit` com método, `content-type` e corpo (fora de GET/HEAD).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `createBridgeLifecycle`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `createBridgeLifecycle(host: BridgeHost): BridgeLifecycle`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Monta o ciclo de vida da ponte para um Durable Object.
- **Input:** `host`: porta do Durable Object.
- **Output:** `BridgeLifecycle` (`handle`, `snapshotNow`, `snapshotQuietly`).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `logSnapshotFailure`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async logSnapshotFailure(run: Promise<SnapshotOutcome>): Promise<void>`
- **Used by:** `connectors/whatsapp/src/lifecycle.ts (module)`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Espera um snapshot e só registra a falha no log (sem dados de mensagens).
- **Input:** `run`: promessa do snapshot.
- **Output:** Nada.
- **Effects:** `console.warn` se o snapshot falhar.
- **Errors:** Nenhum (a falha vira aviso no log).

### `resetBridge`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async resetBridge(host: BridgeHost): Promise<Response>`
- **Used by:** `routeBridgeRequest()`
- **Processes:** P14, P15

<!-- generated:end -->

- **Does:** Recomeça do zero: arquiva o snapshot atual e para o container (o próximo uso sobe vazio).
- **Input:** `host`: porta do Durable Object.
- **Output:** JSON `{ reset: true, archived }`.
- **Effects:** Copia e apaga o snapshot no R2; para o container.
- **Errors:** Repassa a rejeição do R2 ou do `stop`.

### `routeBridgeRequest`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async routeBridgeRequest(router: BridgeRouter, request: Request): Promise<Response>`
- **Used by:** `createBridgeLifecycle()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Atende uma requisição do Worker: rotas internas (`/__snapshot`, `/__reset`) ou repasse à ponte.
- **Input:** `router` (host e agendador de snapshots) e a requisição.
- **Output:** Resposta da ponte, da rota interna ou 429 do limite de envio.
- **Effects:** Rede ao container; R2; armazenamento do Durable Object; pode agendar snapshot.
- **Errors:** Os de `ensureRestored`, `fetchBridge` e do snapshot/reset.

## `connectors/whatsapp/src/pair-page.ts`

### `describePairStatus`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair-page.ts`
- **Signature:** `describePairStatus(status: BridgeStatus | null): string`
- **Used by:** `renderPairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Frase de status para o dono.
- **Input:** `status` da ponte ou `null`.
- **Output:** Frase em português (sem status, precisa parear, conectando ou conectado).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `pairForm`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair-page.ts`
- **Signature:** `pairForm(action: string, csrf: string, body: string): string`
- **Used by:** `maintenanceSection()`, `pairingSection()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Formulário POST com o token anti-CSRF e campos extras.
- **Input:** `action`, `csrf` e o HTML dos campos.
- **Output:** HTML do `<form>`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `pairingSection`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair-page.ts`
- **Signature:** `pairingSection(view: PairPageView): string`
- **Used by:** `renderPairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Bloco de pareamento: pedir código pelo número ou mostrar o QR.
- **Input:** `view`: dados da página.
- **Output:** HTML com o código ou QR (se houver) e os formulários.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `maintenanceSection`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair-page.ts`
- **Signature:** `maintenanceSection(view: PairPageView): string`
- **Used by:** `renderPairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Bloco de manutenção: deslogar, recomeçar do zero (apaga o backup) e sair.
- **Input:** `view`: dados da página.
- **Output:** HTML dos três formulários.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `alertHtml`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair-page.ts`
- **Signature:** `alertHtml(view: PairPageView): string`
- **Used by:** `renderPairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Aviso do resultado da última ação: erro, mensagem ou nada.
- **Input:** `view`: dados da página.
- **Output:** HTML do aviso, ou texto vazio.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `renderPairPage`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair-page.ts`
- **Signature:** `renderPairPage(view: PairPageView): string`
- **Used by:** `pairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Renderiza a página `/pair` completa.
- **Input:** `view`: e-mail, CSRF, status e resultado da ação.
- **Output:** HTML da página (com refresh de 20 s se mostra código ou QR).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/whatsapp/src/pair.ts`

### `parseCookies`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `parseCookies(header: string | null): Record<string, string>`
- **Used by:** `isValidPairLogin()`, `readPairSession()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Lê os cookies de um header `Cookie`.
- **Input:** `header` (pode ser nulo).
- **Output:** Mapa nome → valor.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `redirectWithCookies`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `redirectWithCookies(location: string, cookies: readonly string[]): Response`
- **Used by:** `handlePairPost()`, `openPairSession()`, `routePairPost()`, `startPairLogin()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Redirecionamento com cookies.
- **Input:** `location` e a lista de `Set-Cookie`.
- **Output:** Resposta 302 `no-store` com os cookies.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readPairSession`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `readPairSession(app: PairApp, request: Request): string | null`
- **Used by:** `routePairRequest()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** E-mail da sessão do `/pair` no cookie; nulo se ausente, vencida ou de quem saiu da lista.
- **Input:** `app` e a requisição.
- **Output:** E-mail da sessão ou `null`.
- **Effects:** Nenhum (pura; lê o cookie da requisição).
- **Errors:** Nenhum.

### `issuePairCsrf`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `issuePairCsrf(app: PairApp, email: string): string`
- **Used by:** `pairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Token anti-CSRF amarrado ao e-mail da sessão.
- **Input:** `app` e o e-mail.
- **Output:** Token selado `pair_csrf` com validade da sessão.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `isTrustedPost`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `isTrustedPost(app: PairApp, request: Request, input: { csrf: string; email: string }): boolean`
- **Used by:** `handlePairPost()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Confere o token anti-CSRF do formulário e a origem da requisição.
- **Input:** `app`, a requisição e `{ csrf, email }`.
- **Output:** `true` se o token vale para o e-mail e o `Origin` é o do emissor.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `startPairLogin`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `startPairLogin(app: PairApp): Response`
- **Used by:** `routePairRequest()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Começa o login do `/pair`: manda ao GitHub com `state` selado e amarra o navegador por um nonce em cookie.
- **Input:** `app`: dependências do `/pair`.
- **Output:** 302 ao GitHub com o cookie do nonce.
- **Effects:** Gera um nonce aleatório (`crypto.randomUUID`).
- **Errors:** Nenhum.

### `isValidPairLogin`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `isValidPairLogin(app: PairApp, request: Request): boolean`
- **Used by:** `handlePairCallback()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Confere o `state` do retorno do GitHub e o nonce do cookie deste navegador.
- **Input:** `app` e a requisição de retorno.
- **Output:** `true` se o `state` é válido e o nonce bate com o cookie.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `openPairSession`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `openPairSession(app: PairApp, email: string): Response`
- **Used by:** `handlePairCallback()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Abre a sessão do `/pair` para o e-mail aceito e volta à página.
- **Input:** `app` e o e-mail aceito.
- **Output:** 302 para `/pair` com o cookie da sessão e o do nonce apagado.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `handlePairCallback`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `async handlePairCallback(app: PairApp, request: Request): Promise<Response>`
- **Used by:** `routePairRequest()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Retorno do GitHub no `/pair`: confere `state` e nonce, conclui o login e abre a sessão.
- **Input:** `app` e a requisição de retorno.
- **Output:** 302 com a sessão; HTML 400 (login expirado ou de outro navegador) ou 403 (login recusado).
- **Effects:** Rede: `fetch` ao GitHub (token e e-mails).
- **Errors:** Nenhum (a falha do login vira página 403).

### `pairDeadline`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `pairDeadline(app: PairApp): number`
- **Used by:** `connectors/whatsapp/src/pair.ts (module)`, `fetchPairStatus()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Prazo (ms Unix) de uma chamada do `/pair` à ponte.
- **Input:** `app`.
- **Output:** `Date.now()` mais `timeoutMs`.
- **Effects:** Lê o relógio.
- **Errors:** Nenhum.

### `fetchPairStatus`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `async fetchPairStatus(app: PairApp): Promise<BridgeStatus | null>`
- **Used by:** `pairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Lê o status da ponte; nulo se ela não responder a tempo.
- **Input:** `app`.
- **Output:** `BridgeStatus` ou `null`.
- **Effects:** Rede: `GET /status` na ponte.
- **Errors:** Nenhum (qualquer falha devolve `null`).

### `pairPage`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `async pairPage(app: PairApp, email: string, extra: Partial<PairPageView> = {}): Promise<Response>`
- **Used by:** `handlePairPost()`, `routePairRequest()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Mostra a página com o status atual e o resultado de uma ação (código, QR, mensagem ou erro).
- **Input:** `app`, o e-mail e o resultado da ação (opcional).
- **Output:** Resposta HTML da página `/pair`.
- **Effects:** Rede: `GET /status` na ponte.
- **Errors:** Nenhum (status indisponível vira `null`).

### `handlePairPost`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `async handlePairPost(app: PairApp, request: Request, email: string): Promise<Response>`
- **Used by:** `routePairPost()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Atende um POST do `/pair` já autenticado: sair, ou executar a ação e mostrar a página.
- **Input:** `app`, a requisição e o e-mail da sessão.
- **Output:** Página com o resultado; 302 ao sair; HTML 403 (formulário inválido) ou 404.
- **Effects:** Lê o corpo; rede à ponte pela ação; apaga o cookie ao sair.
- **Errors:** Nenhum (falha da ação vira erro na página).

### `routePairPost`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `routePairPost(app: PairApp, request: Request, email: string | null): Promise<Response>`
- **Used by:** `routePairRequest()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Roteia um POST do `/pair`: sem sessão volta ao login; com sessão, executa a ação.
- **Input:** `app`, a requisição e o e-mail da sessão (ou `null`).
- **Output:** 302 para `/pair` ou a resposta de `handlePairPost`.
- **Effects:** Os de `handlePairPost`.
- **Errors:** Nenhum.

### `isPairPath`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `isPairPath(path: string): boolean`
- **Used by:** `routePairRequest()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Diz se o caminho pertence ao `/pair`.
- **Input:** `path`: caminho da URL.
- **Output:** `true` para `/pair`, `/pair/*` e o retorno do GitHub do `/pair`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `routePairRequest`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `async routePairRequest(app: PairApp, request: Request): Promise<Response | null>`
- **Used by:** `handleWhatsAppFetch()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Roteia as requisições do `/pair`; nulo se o caminho não é do `/pair`.
- **Input:** `app` e a requisição.
- **Output:** Resposta da rota, HTML 404 ou `null` fora do `/pair`.
- **Effects:** Os das rotas (rede ao GitHub e à ponte, cookies).
- **Errors:** Nenhum.

### `pairCookie`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `pairCookie(name: string, value: string, maxAge: number): string`
- **Used by:** `handlePairPost()`, `openPairSession()`, `startPairLogin()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Monta um `Set-Cookie` seguro (HttpOnly, Secure, SameSite=Lax); `maxAge` 0 apaga.
- **Input:** `name`, `value` e `maxAge` (segundos).
- **Output:** Valor do header `Set-Cookie`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `pairActionError`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `pairActionError(error: unknown): Partial<PairPageView>`
- **Used by:** `handlePairPost()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Mensagem de erro de uma ação.
- **Input:** `error`: qualquer valor lançado.
- **Output:** `{ error: mensagem }`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/whatsapp/src/snapshots.ts`

### `storedGeneration`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `storedGeneration(meta: Pick<SnapshotObject, 'customMetadata'> | null): number`
- **Used by:** `storeSnapshot()`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Lê a geração gravada nos metadados de um objeto; 0 se ausente ou inválida.
- **Input:** `meta`: objeto do bucket (ou `null`).
- **Output:** Geração (inteiro positivo) ou 0.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `readUploadHeaders`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `readUploadHeaders(headers: Headers): { readonly length: number; readonly generation: number } | null`
- **Used by:** `acceptSnapshotPush()`, `storeSnapshotResponse()`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Lê tamanho e geração dos headers de uma resposta de snapshot; nulo se faltarem ou forem inválidos.
- **Input:** `headers`: `content-length` e `x-snapshot-generation`.
- **Output:** `{ length, generation }` ou `null`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `storeSnapshot`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `async storeSnapshot(bucket: SnapshotBucket, upload: SnapshotUpload, fixedLength: FixedLength): Promise<SnapshotOutcome>`
- **Used by:** `acceptSnapshotPush()`, `storeSnapshotResponse()`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Grava o snapshot se a geração for mais nova que a do bucket; senão descarta o fluxo e diz `stale`.
- **Input:** `bucket`, `upload` (corpo, tamanho, geração) e `fixedLength`.
- **Output:** `saved` ou `stale`.
- **Effects:** Lê os metadados e grava no R2; cancela o fluxo se velho.
- **Errors:** Repassa a rejeição do R2.

### `storeSnapshotResponse`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `async storeSnapshotResponse(bucket: SnapshotBucket, res: Response, fixedLength: FixedLength): Promise<SnapshotOutcome>`
- **Used by:** `snapshotBridge()`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Grava a resposta de `GET /snapshot` da ponte: 204 é `unchanged`; headers inválidos lançam.
- **Input:** `bucket`, a resposta da ponte e `fixedLength`.
- **Output:** `saved`, `stale` ou `unchanged` (204 sem mudança, ou 503 com a ponte ainda iniciando).
- **Effects:** Grava no R2; cancela o corpo se inválido.
- **Errors:** Rejeita com `Error` se a resposta não for 2xx ou os headers forem inválidos.

### `archiveSnapshot`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `async archiveSnapshot(bucket: SnapshotBucket, now: Date, fixedLength: FixedLength): Promise<boolean>`
- **Used by:** `resetBridge()`
- **Processes:** P14, P15

<!-- generated:end -->

- **Does:** Tira o snapshot atual do caminho (guarda uma cópia com data) para recomeçar do zero.
- **Input:** `bucket`, `now` (data do arquivo) e `fixedLength`.
- **Output:** `true` se havia snapshot para arquivar.
- **Effects:** Lê, copia para `whatsapp/archive/` e apaga no R2.
- **Errors:** Repassa a rejeição do R2.

### `sameSecret`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `sameSecret(given: string, expected: string): boolean`
- **Used by:** `acceptSnapshotPush()`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Compara dois textos em tempo constante (para tokens).
- **Input:** `given` e `expected`.
- **Output:** `true` se iguais e `expected` não vazio.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `acceptSnapshotPush`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `async acceptSnapshotPush(bucket: SnapshotBucket, request: Request, options: { readonly token: string; readonly fixedLength: FixedLength }): Promise<Response>`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Recebe o snapshot que a ponte envia sozinha no `SIGTERM` (melhor esforço): confere o token e grava.
- **Input:** `bucket`, a requisição PUT e opções (`token`, `fixedLength`).
- **Output:** JSON `{ outcome }`; 403 sem token válido ou não PUT; 400 sem headers ou corpo.
- **Effects:** Grava no R2.
- **Errors:** Repassa a rejeição do R2.

### `pumpInto`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `async pumpInto(source: ReadableStream<Uint8Array>, writable: WritableStream<Uint8Array>): Promise<void>`
- **Used by:** `workersFixedLength()`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Copia um fluxo para outro bloco a bloco, sem `pipeTo` (que o Workers recusa entre fluxos internos, o que impedia o snapshot de chegar ao R2).
- **Input:** `source`: fluxo de origem (corpo da ponte); `writable`: destino (lado de escrita do `FixedLengthStream`).
- **Output:** Promessa que resolve quando a cópia termina ou falha.
- **Effects:** Lê `source` e escreve em `writable`; fecha o destino no fim.
- **Errors:** Nunca rejeita: erro de um lado aborta o destino e cancela a origem, e quem lê o destino (o `put` do R2) recebe o erro.

## `connectors/whatsapp/src/tools.ts`

### `toolDeadline`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `toolDeadline(ctx: WhatsAppToolContext): number`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`, `runRead()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Prazo final (ms Unix) de uma chamada que começa agora.
- **Input:** `ctx`: contexto das ferramentas.
- **Output:** `now()` mais `toolTimeoutMs`.
- **Effects:** Lê o relógio do contexto.
- **Errors:** Nenhum.

### `syncWaitBudget`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `syncWaitBudget(ctx: WhatsAppToolContext, deadline: number): number`
- **Used by:** `prepareRead()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Quanto pedir à ponte para esperar o sync, sem invadir a folga da consulta.
- **Input:** `ctx` e o `deadline` (ms Unix).
- **Output:** Milissegundos (0 ou mais, até `syncWaitMs`).
- **Effects:** Lê o relógio do contexto.
- **Errors:** Nenhum.

### `prepareRead`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `async prepareRead(ctx: WhatsAppToolContext, deadline: number): Promise<string | null>`
- **Used by:** `runRead()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Espera o sync dentro do orçamento; lança se precisa parear e devolve o aviso de resultado parcial.
- **Input:** `ctx` e o `deadline` (ms Unix).
- **Output:** Aviso de resultado parcial ou `null`.
- **Effects:** Rede: `POST /sync/wait` na ponte.
- **Errors:** Rejeita se o WhatsApp não está pareado; os de `bridgeJson`.

### `runRead`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `async runRead(ctx: WhatsAppToolContext, query: (deadline: number) => Promise<T>): Promise<T | { readonly warning: string; readonly result: T }>`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Roda uma leitura com prazo total: espera o sync, consulta a ponte e junta o aviso (se houver).
- **Input:** `ctx` e a consulta (recebe o prazo).
- **Output:** Resultado da consulta, ou `{ warning, result }`.
- **Effects:** Rede: chamadas à ponte.
- **Errors:** Rejeita se o prazo total esgotar; repassa os de `prepareRead` e da consulta.

### `compactContact`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `compactContact(contact: Readonly<Record<string, string | null>>): Record<string, unknown>`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Contato compacto, com nomes limpos.
- **Input:** `contact`: contato da ponte.
- **Output:** Objeto com `jid`, `name` e, se houver, `phone`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `mediaResult`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `mediaResult(res: Response, bytes: Uint8Array, messageId: string): RawToolResult`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Resultado de `get_media`: uma linha de descrição e o arquivo como bloco MCP.
- **Input:** Resposta da ponte (headers), os bytes e o id da mensagem.
- **Output:** `RawToolResult` com o texto e o bloco binário.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `allowedRecipient`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `allowedRecipient(settings: WhatsAppSettings, recipient: string): string`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P17

<!-- generated:end -->

- **Does:** Valida o destinatário (`normalizeRecipient()`) e, se a `SEND_ALLOWLIST` tiver itens, exige que ele esteja nela; vazia libera qualquer contato ou grupo.
- **Input:** `settings` e o destinatário (número ou JID).
- **Output:** JID normalizado.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `Error` se o destinatário for inválido ou estiver fora de uma allowlist não vazia.

### `whatsappTools`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `whatsappTools(settings: WhatsAppSettings): ToolSpec<WhatsAppToolContext>[]`
- **Used by:** `createWhatsAppMcpServer()`
- **Processes:** P13, P14

<!-- generated:end -->

- **Does:** Ferramentas ativas: as de leitura e, só com `ENABLE_SEND`, a de envio.
- **Input:** `settings`.
- **Output:** Lista de `ToolSpec`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `createWhatsAppMcpServer`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `createWhatsAppMcpServer(ctx: WhatsAppToolContext): McpServer`
- **Used by:** `whatsappRemoteConnector()`
- **Processes:** P13, P14

<!-- generated:end -->

- **Does:** Cria o servidor MCP do WhatsApp com as ferramentas ativas.
- **Input:** `ctx`: contexto das ferramentas.
- **Output:** `McpServer` com instruções e ferramentas registradas.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `decodeHeaderText`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `decodeHeaderText(value: string | null): string`
- **Used by:** `mediaResult()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Decodifica um header em UTF-8 percent-encoded (como a ponte manda o nome do arquivo); inválido fica como veio.
- **Input:** `value`: valor do header ou nulo.
- **Output:** Texto decodificado; `""` se nulo/vazio; o valor original se a codificação for inválida.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum (erro de `decodeURIComponent` é capturado).

## `connectors/whatsapp/src/worker-env.ts`

### `bridgeStub`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker-env.ts`
- **Signature:** `bridgeStub(env: WhatsAppEnv): BridgeStub`
- **Used by:** `handleWhatsAppFetch()`, `runScheduledSync()`
- **Processes:** P13, P14, P17

<!-- generated:end -->

- **Does:** Devolve o stub da instância única da ponte.
- **Input:** `env`: bindings do Worker.
- **Output:** Stub do Durable Object de nome `BRIDGE_INSTANCE_NAME`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `bridgeFetchFor`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker-env.ts`
- **Signature:** `bridgeFetchFor(stub: BridgeStub): BridgeFetch`
- **Used by:** `handleWhatsAppFetch()`, `runScheduledSync()`
- **Processes:** P13, P14, P17

<!-- generated:end -->

- **Does:** Função que fala com a ponte pelo stub, com caminhos relativos (`/status`, `/chats?...`).
- **Input:** `stub` do Durable Object.
- **Output:** `BridgeFetch`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/whatsapp/src/worker.ts`

### `unixNow`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `unixNow(): number`
- **Used by:** `createWhatsAppApps()`
- **Processes:** P13

<!-- generated:end -->

- **Does:** Relógio em segundos Unix.
- **Input:** Nada.
- **Output:** Segundos Unix inteiros.
- **Effects:** Lê o relógio.
- **Errors:** Nenhum.

### `githubSettingsFrom`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `githubSettingsFrom(settings: WhatsAppSettings): GithubLoginSettings`
- **Used by:** `createWhatsAppApps()`, `whatsappRemoteConnector()`
- **Processes:** P13

<!-- generated:end -->

- **Does:** Configuração do login do dono pelo GitHub a partir da configuração do conector.
- **Input:** `settings` do conector.
- **Output:** `GithubLoginSettings` com o `fetch` global.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `whatsappRemoteConnector`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `whatsappRemoteConnector(settings: WhatsAppSettings, bridge: BridgeFetch, issuer: string): RemoteConnector`
- **Used by:** `createWhatsAppApps()`
- **Processes:** P13

<!-- generated:end -->

- **Does:** Monta o conector remoto do WhatsApp: login pelo GitHub e servidor MCP ligado à ponte.
- **Input:** `settings`, `bridge` e o `issuer`.
- **Output:** `RemoteConnector`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `createWhatsAppApps`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `createWhatsAppApps(vars: EnvVars, bridge: BridgeFetch, origin: string): WhatsAppApps`
- **Used by:** `handleWhatsAppFetch()`
- **Processes:** P13

<!-- generated:end -->

- **Does:** Monta os apps do Worker a partir do ambiente, da ponte e da origem da requisição.
- **Input:** `vars`, `bridge` e a origem da requisição.
- **Output:** `WhatsAppApps` (`remote` e `pair`).
- **Effects:** Nenhum (pura).
- **Errors:** Lança `Error` se a configuração do ambiente for inválida.

### `handleWhatsAppFetch`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `async handleWhatsAppFetch(request: Request, env: WhatsAppEnv): Promise<Response>`
- **Used by:** `connectors/whatsapp/src/worker.ts (module)`
- **Processes:** P13

<!-- generated:end -->

- **Does:** Atende uma requisição: `/pair` primeiro, depois OAuth e `/mcp`; configuração inválida vira 500 explicado.
- **Input:** A requisição e o ambiente do Worker.
- **Output:** Resposta HTTP.
- **Effects:** Rede (ponte, GitHub), cookies e o que o handler remoto fizer.
- **Errors:** Nenhum (configuração inválida vira resposta 500).

### `isSyncCronEnabled`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `isSyncCronEnabled(vars: EnvVars, cron: string): boolean`
- **Used by:** `runScheduledSync()`
- **Processes:** P17

<!-- generated:end -->

- **Does:** Diz se o cron que disparou é o sync opcional configurado em `SYNC_CRON`.
- **Input:** `vars` e o cron que disparou.
- **Output:** `true` se `SYNC_CRON` está definido e é igual.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `Error` se a configuração do ambiente for inválida.

### `runScheduledSync`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `async runScheduledSync(env: WhatsAppEnv, cron: string): Promise<string>`
- **Used by:** `connectors/whatsapp/src/worker.ts (module)`
- **Processes:** P17

<!-- generated:end -->

- **Does:** Sync periódico opcional: acorda a ponte, espera as pendências (até 20 s), guarda o snapshot e deixa dormir.
- **Input:** O ambiente do Worker e o cron que disparou.
- **Output:** `disabled` ou o resultado do snapshot (`saved`, `unchanged`, `stale`, `unknown`).
- **Effects:** Rede: `/sync/wait` e `/__snapshot` na ponte (que grava no R2).
- **Errors:** Rejeita se o prazo de 50 s esgotar ou a configuração for inválida.

## `src/remote/github-login.ts`

### `githubAuthorizeUrl`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `githubAuthorizeUrl(settings: GithubLoginSettings, state: string, callbackUrl: string): string`
- **Used by:** `githubUpstreamLogin()`, `startPairLogin()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Endereço da tela de autorização do GitHub, pedindo só a leitura dos e-mails.
- **Input:** `settings`, `state` e `callbackUrl`.
- **Output:** URL de `github.com/login/oauth/authorize` com escopo `user:email`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `parseEmailList`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `parseEmailList(raw: string | null): string[]`
- **Used by:** `readAllowedEmails()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Lê uma lista de e-mails separada por vírgula, em minúsculas e sem vazios.
- **Input:** `raw` (pode ser nulo).
- **Output:** Lista de e-mails (só itens com `@`).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `pickAllowedEmail`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `pickAllowedEmail(emails: readonly GithubEmail[], allowed: readonly string[]): string | null`
- **Used by:** `finishGithubLogin()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Escolhe o primeiro e-mail verificado que está na lista; nulo se nenhum serve.
- **Input:** `emails` do GitHub e a lista permitida.
- **Output:** E-mail em minúsculas ou `null`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `exchangeGithubCode`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `async exchangeGithubCode(settings: GithubLoginSettings, code: string, callbackUrl: string): Promise<string>`
- **Used by:** `finishGithubLogin()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Troca o código do GitHub por um token de acesso; rejeita com mensagem ao usuário se falhar.
- **Input:** `settings`, `code` e `callbackUrl`.
- **Output:** Token de acesso do GitHub.
- **Effects:** Rede: `POST` a `github.com/login/oauth/access_token`.
- **Errors:** Rejeita com `Error` se a resposta não for 2xx ou não trouxer `access_token`.

### `fetchGithubEmails`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `async fetchGithubEmails(settings: GithubLoginSettings, token: string): Promise<GithubEmail[]>`
- **Used by:** `finishGithubLogin()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Lê os e-mails da conta do GitHub com o token de acesso.
- **Input:** `settings` e o token.
- **Output:** Lista de `GithubEmail` (vazia se o corpo não for lista).
- **Effects:** Rede: `GET api.github.com/user/emails`.
- **Errors:** Rejeita com `Error` se o GitHub não responder 2xx.

### `finishGithubLogin`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `async finishGithubLogin(settings: GithubLoginSettings, query: URLSearchParams, callbackUrl: string): Promise<string>`
- **Used by:** `githubUpstreamLogin()`, `handlePairCallback()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Conclui o login: confere o retorno do GitHub e devolve o e-mail aceito, ou rejeita explicando.
- **Input:** `settings`, a query do retorno e `callbackUrl`.
- **Output:** E-mail aceito, em minúsculas.
- **Effects:** Rede: troca do código e leitura dos e-mails no GitHub.
- **Errors:** Rejeita com `Error` se não houver `code`, a troca falhar ou nenhum e-mail verificado estiver na lista.

### `githubUpstreamLogin`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `githubUpstreamLogin(settings: GithubLoginSettings): UpstreamLogin`
- **Used by:** `whatsappRemoteConnector()`
- **Processes:** P13

<!-- generated:end -->

- **Does:** Login do conector remoto pelo GitHub, no formato que o servidor remoto espera.
- **Input:** `settings` do login.
- **Output:** `UpstreamLogin` com `start` e `finish`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/gmail/src/accounts.ts`

### `aliasAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/accounts.ts`
- **Signature:** `aliasAccounts(accounts: readonly LinkedAccount[]): AccountRef[]`
- **Used by:** `ownerRefs()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Dá a cada conta vinculada o apelido usado nas ferramentas.
- **Input:** `accounts`: contas vinculadas do usuário.
- **Output:** Lista de `AccountRef`: apelido é a parte antes do `@`, ou o e-mail inteiro quando duas contas a repetem.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `noAccountsError`

<!-- generated:start -->

- **File:** `connectors/gmail/src/accounts.ts`
- **Signature:** `noAccountsError(): Error`
- **Used by:** `resolveAccounts()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Monta o erro de quem ainda não vinculou nenhuma conta.
- **Input:** Nenhuma.
- **Output:** `Error` que orienta a usar `link_account`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `accountAlias`

<!-- generated:start -->

- **File:** `connectors/gmail/src/accounts.ts`
- **Signature:** `accountAlias(email: string): string`
- **Used by:** `aliasAccounts()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Extrai o apelido de um e-mail: a parte antes do `@`, em minúsculas.
- **Input:** `email`: endereço completo.
- **Output:** O apelido (ex.: `musica.nova`).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `resolveAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/accounts.ts`
- **Signature:** `resolveAccounts(refs: readonly AccountRef[], requested: string): AccountRef[]`
- **Used by:** `resolveOwnerAccounts()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Resolve o parâmetro `account` nas contas do usuário.
- **Input:** `refs`: contas com apelido. `requested`: apelido, e-mail ou `all` (sem diferenciar maiúsculas).
- **Output:** Todas as contas para `all`; senão a lista com a conta encontrada.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `noAccountsError()` sem contas; lança erro com os apelidos válidos se nenhuma conta casar.

### `writeAccessError`

<!-- generated:start -->

- **File:** `connectors/gmail/src/accounts.ts`
- **Signature:** `writeAccessError(alias: string): Error`
- **Used by:** `requireWriteAccess()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Monta o erro de conta vinculada só para leitura, pedindo novo vínculo por `link_account`.
- **Input:** `alias`: apelido da conta.
- **Output:** `Error` acionável.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `requireWriteAccess`

<!-- generated:start -->

- **File:** `connectors/gmail/src/accounts.ts`
- **Signature:** `requireWriteAccess(ref: AccountRef): void`
- **Used by:** `gmailWrite()`, `resolveWritableAccount()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Exige o escopo `gmail.modify` no token da conta.
- **Input:** `ref`: conta vinculada.
- **Output:** Nada.
- **Effects:** Nenhum (pura).
- **Errors:** Lança `writeAccessError()` se a conta foi vinculada só para leitura.

## `connectors/gmail/src/token-store.ts`

### `ownerKey`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `ownerKey(owner: string): string`
- **Used by:** `loadOwnerAccounts()`, `saveOwnerAccounts()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Monta a chave do registro do usuário no KV.
- **Input:** `owner`: usuário (`sub` do Google).
- **Output:** `owner:<sha256>`, sem o id em claro.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toLinkedAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `toLinkedAccount(value: unknown): LinkedAccount | null`
- **Used by:** `openOwnerAccounts()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Converte um item do selo em conta vinculada.
- **Input:** `value`: item lido do registro.
- **Output:** `LinkedAccount` com padrões para campos ausentes; nulo sem e-mail ou refresh token.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `sealOwnerAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `sealOwnerAccounts(owner: string, accounts: readonly LinkedAccount[], key: Buffer): string`
- **Used by:** `saveOwnerAccounts()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Sela as contas de um usuário para gravar no KV.
- **Input:** `owner`: usuário. `accounts`: contas. `key`: `TOKEN_ENC_KEY`.
- **Output:** Selo AES-256-GCM em base64url.
- **Effects:** Nenhum (pura, exceto o IV aleatório).
- **Errors:** Nenhum.

### `openOwnerAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `openOwnerAccounts(sealed: string, key: Buffer, owner: string): LinkedAccount[]`
- **Used by:** `loadOwnerAccounts()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Abre o registro do usuário conferindo o dono.
- **Input:** `sealed`: selo do KV. `key`: `TOKEN_ENC_KEY`. `owner`: usuário esperado.
- **Output:** Contas válidas; vazio se a chave, o conteúdo ou o dono não conferem.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `loadOwnerAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `async loadOwnerAccounts(kv: KvStore, key: Buffer, owner: string): Promise<LinkedAccount[]>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `markAccountRevoked()`, `ownerRefs()`, `storeGoogleAccount()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Lê as contas vinculadas do usuário.
- **Input:** `kv`: KV. `key`: `TOKEN_ENC_KEY`. `owner`: usuário.
- **Output:** Contas do usuário; vazio se ele ainda não vinculou nenhuma.
- **Effects:** KV: uma leitura.
- **Errors:** Propaga falhas do KV.

### `saveOwnerAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `async saveOwnerAccounts(kv: KvStore, key: Buffer, record: { readonly owner: string; readonly accounts: readonly LinkedAccount[] }): Promise<void>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `markAccountRevoked()`, `storeGoogleAccount()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Grava as contas do usuário no KV.
- **Input:** `kv`: KV. `key`: `TOKEN_ENC_KEY`. `record`: usuário e contas.
- **Output:** Nada.
- **Effects:** KV: grava o registro selado, ou apaga quando não sobra conta.
- **Errors:** Propaga falhas do KV.

### `upsertAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `upsertAccount(accounts: readonly LinkedAccount[], account: LinkedAccount): LinkedAccount[]`
- **Used by:** `storeGoogleAccount()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Põe ou troca a conta na lista pelo e-mail.
- **Input:** `accounts`: contas atuais. `account`: conta nova ou renovada.
- **Output:** Lista nova com a conta no fim.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro se passaria de `MAX_LINKED_ACCOUNTS`.

### `sha256Hex`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `sha256Hex(text: string): string`
- **Used by:** `linkRequestKey()`, `ownerKey()`, `redeemLinkTicket()`, `startAccountLink()`, `takeLinkRequest()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Calcula o SHA-256 em hexadecimal.
- **Input:** `text`: texto a resumir.
- **Output:** 64 caracteres hexadecimais.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/gmail/src/compose.ts`

### `prefixSubject`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `prefixSubject(subject: string, prefix: 'Re' | 'Fwd'): string`
- **Used by:** `forwardEmail()`, `replyEmail()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Põe `Re:` ou `Fwd:` no assunto sem repetir o prefixo.
- **Input:** `subject`; `prefix`: `Re` ou `Fwd`.
- **Output:** O assunto.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `threadingHeaders`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `threadingHeaders(headers: ReadonlyMap<string, string>): ThreadingHeaders`
- **Used by:** `replyEmail()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Calcula `In-Reply-To` e `References` da resposta a partir do original.
- **Input:** `headers`: cabeçalhos do original em minúsculas.
- **Output:** `{ inReplyTo, references }` (nulos se não houver).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `uniqueAddresses`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `uniqueAddresses(addresses: readonly MailAddress[], exclude: ReadonlySet<string>): MailAddress[]`
- **Used by:** `replyRecipients()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Tira endereços repetidos e os excluídos, sem diferenciar maiúsculas.
- **Input:** `addresses`; `exclude`: e-mails em minúsculas.
- **Output:** Lista sem repetidos.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `replyToList`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `replyToList(headers: ReadonlyMap<string, string>, self: string, replyAll: boolean): MailAddress[]`
- **Used by:** `replyRecipients()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Candidatos a `To` da resposta: remetente (ou `Reply-To`), mais o `To` com `replyAll`, ou os destinatários se a original foi enviada pela conta.
- **Input:** `headers`; `self`: e-mail da conta em minúsculas; `replyAll`.
- **Output:** Lista de endereços.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `replyRecipients`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `replyRecipients(headers: ReadonlyMap<string, string>, selfEmail: string, replyAll: boolean): { to: MailAddress[]; cc: MailAddress[] }`
- **Used by:** `replyEmail()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Calcula `To` e `Cc` da resposta, sem a própria conta e sem repetir.
- **Input:** `headers`; `selfEmail`; `replyAll`.
- **Output:** `{ to, cc }`.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro se não sobrar destinatário.

### `quotedText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `quotedText(message: GmailMessage): string`
- **Used by:** `replyEmail()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Cita o original com `> ` depois de "Em <data>, <remetente> escreveu:".
- **Input:** `message`: original no formato `full`.
- **Output:** Texto citado (até 20 mil caracteres do original).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `forwardedText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `forwardedText(message: GmailMessage): string`
- **Used by:** `forwardEmail()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Bloco do e-mail encaminhado: separador, cabeçalhos e corpo do original.
- **Input:** `message`: original.
- **Output:** Texto do bloco.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `replyEmail`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `replyEmail(message: GmailMessage, options: ReplyOptions): PreparedEmail`
- **Used by:** `prepareReply()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Monta a resposta: destinatários, `Re:`, conversa mantida e original citado.
- **Input:** `message`: original; `options`: texto, `replyAll` e e-mail da conta.
- **Output:** `PreparedEmail` com o `threadId` do original.
- **Effects:** Nenhum (pura).
- **Errors:** Os de `replyRecipients()`.

### `forwardEmail`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `forwardEmail(message: GmailMessage, options: ForwardOptions): PreparedEmail`
- **Used by:** `prepareForward()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Monta o encaminhamento: `Fwd:`, nota, bloco do original e anexos, em conversa nova.
- **Input:** `message`: original; `options`: destinatários, nota e anexos.
- **Output:** `PreparedEmail` sem `threadId`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/gmail/src/draft-tools.ts`

### `draftArgs`

<!-- generated:start -->

- **File:** `connectors/gmail/src/draft-tools.ts`
- **Signature:** `draftArgs(args: DraftToolArgs): DraftArgs`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Converte os parâmetros das ferramentas de rascunho no formato interno.
- **Input:** `args`: parâmetros validados.
- **Output:** `DraftArgs`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/gmail/src/drafts.ts`

### `draftSummary`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `draftSummary(draft: GmailDraft): Record<string, unknown>`
- **Used by:** `listDrafts()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Resume um rascunho para `list_drafts`.
- **Input:** `draft`: rascunho da Gmail API.
- **Output:** Ids, to, cc, assunto, data e trecho.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `listDrafts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `async listDrafts(deps: OwnerDeps, ref: AccountRef, maxResults: number): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Lista os rascunhos da conta e lê os cabeçalhos de cada um.
- **Input:** `deps`, `ref`; `maxResults`.
- **Output:** `{ account, drafts }`.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Propaga os de `gmailGet()`.

### `prepareDraftEmail`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `prepareDraftEmail(deps: OwnerDeps, ref: AccountRef, args: DraftArgs): Promise<PreparedEmail>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Monta o e-mail do rascunho: resposta ao original ou e-mail novo.
- **Input:** `deps`, `ref`; `args`: conteúdo e `replyToMessageId`.
- **Output:** `PreparedEmail`.
- **Effects:** Rede só quando é resposta (lê o original).
- **Errors:** Os de `composeEmail()` ou `prepareReply()`.

### `draftIds`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `draftIds(draft: GmailDraft): Record<string, unknown>`
- **Used by:** `createDraft()`, `draftSummary()`, `updateDraft()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Ids devolvidos por uma operação de rascunho.
- **Input:** `draft`.
- **Output:** `{ draft_id, message_id, thread_id }` (nulos se faltarem).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `createDraft`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `async createDraft(deps: OwnerDeps, ref: AccountRef, prepared: PreparedEmail): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Cria um rascunho com o e-mail pronto.
- **Input:** `deps`, `ref`; `prepared`.
- **Output:** `{ account, draft_id, message_id, thread_id }`.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Lança `writeAccessError()` para conta só leitura; propaga os erros de `gmailCall()`.

### `updateDraft`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `async updateDraft(deps: OwnerDeps, ref: AccountRef, change: { readonly draftId: string; readonly prepared: PreparedEmail }): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Substitui todo o conteúdo de um rascunho.
- **Input:** `deps`, `ref`; `change`: id do rascunho e e-mail pronto.
- **Output:** Ids do rascunho.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Lança `writeAccessError()` para conta só leitura; propaga os erros de `gmailCall()`.

### `sendDraft`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `async sendDraft(deps: OwnerDeps, ref: AccountRef, draftId: string): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Envia um rascunho existente.
- **Input:** `deps`, `ref`; `draftId`.
- **Output:** Resultado de `sentResult()`.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token. O e-mail sai da conta.
- **Errors:** Lança `writeAccessError()` para conta só leitura; propaga os erros de `gmailCall()`.

### `deleteDraft`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `async deleteDraft(deps: OwnerDeps, ref: AccountRef, draftId: string): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Apaga um rascunho (mensagens enviadas não são tocadas).
- **Input:** `deps`, `ref`; `draftId`.
- **Output:** `{ account, deleted_draft }`.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Lança `writeAccessError()` para conta só leitura; propaga os erros de `gmailCall()`.

## `connectors/gmail/src/mailbox-tools.ts`

### `toggleAction`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox-tools.ts`
- **Signature:** `toggleAction(on: boolean, onAction: MailboxAction, offAction: MailboxAction): MailboxAction`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Escolhe a ação ligada ou desligada pelo parâmetro booleano.
- **Input:** `on`; `onAction`; `offAction`.
- **Output:** A ação.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `writableTargets`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox-tools.ts`
- **Signature:** `async writableTargets(deps: OwnerDeps, args: TargetArgs): Promise<{ ref: AccountRef; targets: MailTargets }>`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`, `runMailboxAction()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Resolve a conta com escrita e os alvos: começo comum das ferramentas de organização.
- **Input:** `deps`; `args`: account, message_ids e thread_ids.
- **Output:** `{ ref, targets }`.
- **Effects:** KV: uma leitura.
- **Errors:** Os de `resolveWritableAccount()` e `mailTargets()`.

### `runMailboxAction`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox-tools.ts`
- **Signature:** `async runMailboxAction(deps: OwnerDeps, args: TargetArgs, action: MailboxAction): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Aplica uma ação pronta (lido, arquivar, estrela) nos alvos dos argumentos.
- **Input:** `deps`; `args`; `action`.
- **Output:** Resultado de `applyLabelChange()`.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Os de `writableTargets()` e `applyLabelChange()`.

## `connectors/gmail/src/mailbox.ts`

### `mailTargets`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `mailTargets(messageIds: readonly string[] | undefined, threadIds: readonly string[] | undefined): MailTargets`
- **Used by:** `writableTargets()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Monta os alvos de uma alteração (mensagens e conversas).
- **Input:** `messageIds`, `threadIds` (opcionais).
- **Output:** `MailTargets`.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro se não houver nenhum id.

### `checkLabelChange`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `checkLabelChange(change: LabelChange): void`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Valida uma mudança de marcadores.
- **Input:** `change`: add e remove.
- **Output:** Nada.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro se não houver marcador ou se o mesmo estiver nos dois lados.

### `resolveLabelIds`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `resolveLabelIds(labels: readonly GmailLabel[], wanted: readonly string[]): string[]`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Converte marcadores pedidos por id ou nome (sem maiúsculas) em ids.
- **Input:** `labels`: marcadores da conta; `wanted`: ids ou nomes.
- **Output:** Lista de ids.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro para marcador desconhecido, sugerindo `list_labels`.

### `fetchLabels`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `async fetchLabels(deps: OwnerDeps, ref: AccountRef): Promise<GmailLabel[]>`
- **Used by:** `accountLabels()`, `connectors/gmail/src/mailbox-tools.ts (module)`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Lê os marcadores da conta.
- **Input:** `deps`, `ref`.
- **Output:** Lista de `GmailLabel` (vazia sem campo).
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Propaga os de `gmailGet()`.

### `applyLabelChange`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `async applyLabelChange(deps: OwnerDeps, ref: AccountRef, request: { readonly targets: MailTargets; readonly change: LabelChange }): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`, `runMailboxAction()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Põe e tira marcadores: `batchModify` nas mensagens e `modify` em cada conversa.
- **Input:** `deps`, `ref`; `request`: alvos e mudança.
- **Output:** Contagens e marcadores alterados.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Lança `writeAccessError()` para conta só leitura; propaga os erros de `gmailCall()`.

### `targetCounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `targetCounts(alias: string, targets: MailTargets): Record<string, unknown>`
- **Used by:** `applyLabelChange()`, `moveToTrash()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Conta e quantidade de mensagens e conversas alteradas.
- **Input:** `alias`; `targets`.
- **Output:** `{ account, messages, threads }`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `moveToTrash`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `async moveToTrash(deps: OwnerDeps, ref: AccountRef, request: { readonly targets: MailTargets; readonly restore: boolean }): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Manda mensagens e conversas para a lixeira ou as restaura (sem exclusão definitiva).
- **Input:** `deps`, `ref`; `request`: alvos e `restore`.
- **Output:** Contagens e a ação (`trash`/`untrash`).
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Lança `writeAccessError()` para conta só leitura; propaga os erros de `gmailCall()`.

## `connectors/gmail/src/mime.ts`

### `splitAddressList`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `splitAddressList(text: string): string[]`
- **Used by:** `parseAddressList()`, `parseRecipients()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Separa uma lista de endereços por vírgula ou ponto e vírgula, fora de aspas e de `<...>`.
- **Input:** `text`: lista.
- **Output:** Itens aparados, sem vazios.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `parseMailAddress`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `parseMailAddress(item: string): MailAddress | null`
- **Used by:** `parseAddressList()`, `parseRecipients()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Lê `Nome <e-mail>`, `"Nome" <e-mail>` ou `e-mail` e valida o e-mail.
- **Input:** `item`: um endereço.
- **Output:** `{ name, email }`, ou nulo se inválido (inclusive com quebra de linha).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `parseAddressList`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `parseAddressList(text: string): MailAddress[]`
- **Used by:** `replyRecipients()`, `replyToList()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Endereços válidos de um cabeçalho, descartando os inválidos.
- **Input:** `text`: valor do cabeçalho.
- **Output:** Lista de `MailAddress`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `parseRecipients`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `parseRecipients(items: readonly string[], field: string): MailAddress[]`
- **Used by:** `composeEmail()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Valida os destinatários pedidos num campo.
- **Input:** `items`: endereços (um item pode ter vários); `field`: nome do campo.
- **Output:** Lista de `MailAddress`.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro com o campo e o item inválido.

### `cleanHeaderText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `cleanHeaderText(text: string): string`
- **Used by:** `attachmentPart()`, `mimeHeaderLines()`, `parseMailAddress()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Troca quebras de linha e tabs por espaço (impede injeção de cabeçalho).
- **Input:** `text`.
- **Output:** Texto numa linha só, aparado.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `isPrintableAscii`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `isPrintableAscii(text: string): boolean`
- **Used by:** `encodeHeaderWord()`, `formatMailAddress()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Diz se o texto só tem ASCII imprimível.
- **Input:** `text`.
- **Output:** Booleano.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `encodeHeaderWord`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `encodeHeaderWord(text: string): string`
- **Used by:** `attachmentPart()`, `formatMailAddress()`, `mimeHeaderLines()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Codifica texto não ASCII em palavras RFC 2047 `=?UTF-8?B?...?=` de até 75 caracteres.
- **Input:** `text`.
- **Output:** O texto (ASCII) ou as palavras codificadas, dobradas com CRLF + espaço.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `formatMailAddress`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `formatMailAddress(address: MailAddress): string`
- **Used by:** `addressHeader()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Formata um endereço para o cabeçalho (nome entre aspas ou codificado).
- **Input:** `address`.
- **Output:** `"Nome" <e-mail>`, `=?UTF-8?B?...?= <e-mail>` ou só o e-mail.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `addressHeader`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `addressHeader(name: string, addresses: readonly MailAddress[]): string[]`
- **Used by:** `mimeHeaderLines()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Monta a linha de um cabeçalho de endereços.
- **Input:** `name`: To, Cc ou Bcc; `addresses`.
- **Output:** Uma linha, ou nenhuma se a lista for vazia.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `messageIdList`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `messageIdList(text: string | undefined): string | null`
- **Used by:** `threadingHeaders()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Guarda só os ids `<...>` de um `Message-ID`/`References`.
- **Input:** `text`: valor do cabeçalho (ou nada).
- **Output:** Ids separados por espaço, ou nulo.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `mimeHeaderLines`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `mimeHeaderLines(email: OutgoingEmail): string[]`
- **Used by:** `buildMimeMessage()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Cabeçalhos do e-mail: versão MIME, destinatários, assunto e conversa.
- **Input:** `email`: e-mail a enviar.
- **Output:** Lista de linhas.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `wrapBase64`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `wrapBase64(bytes: Uint8Array): string`
- **Used by:** `attachmentPart()`, `textPart()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Codifica bytes em base64 com linhas de 76 caracteres.
- **Input:** `bytes`.
- **Output:** Texto base64 com CRLF.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `textPart`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `textPart(body: string): string[]`
- **Used by:** `buildMimeMessage()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Parte de texto plano UTF-8 em base64, com quebras CRLF.
- **Input:** `body`: texto.
- **Output:** Linhas da parte (cabeçalhos, linha vazia e conteúdo).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `safeMimeType`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `safeMimeType(mimeType: string): string`
- **Used by:** `attachmentPart()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Aceita só tipos MIME no formato `tipo/subtipo`.
- **Input:** `mimeType`.
- **Output:** O tipo, ou `application/octet-stream`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `attachmentPart`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `attachmentPart(attachment: MailAttachment): string[]`
- **Used by:** `buildMimeMessage()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Parte MIME de um anexo, com nome limpo e codificado.
- **Input:** `attachment`: nome, tipo e bytes.
- **Output:** Linhas da parte.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `buildMimeMessage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `buildMimeMessage(email: OutgoingEmail, boundary: string): string`
- **Used by:** `gmailMessageResource()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Monta a mensagem MIME completa; com anexos vira `multipart/mixed`.
- **Input:** `email`; `boundary`: fronteira das partes.
- **Output:** Texto MIME com CRLF.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

### `toRawMessage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `toRawMessage(mime: string): string`
- **Used by:** `gmailMessageResource()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Codifica a mensagem MIME em base64url (campo `raw` da Gmail API).
- **Input:** `mime`.
- **Output:** Texto base64url.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/gmail/src/send-tools.ts`

### `replyTool`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send-tools.ts`
- **Signature:** `replyTool(options: ReplyToolOptions): ToolSpec<OwnerDeps>`
- **Used by:** `connectors/gmail/src/send-tools.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Monta a ferramenta de resposta (ao remetente ou a todos) com as anotações de envio.
- **Input:** `options`: nome, título, `replyAll` e descrição.
- **Output:** `ToolSpec`.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `connectors/gmail/src/send.ts`

### `checkRecipientLimit`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `checkRecipientLimit(email: OutgoingEmail): void`
- **Used by:** `composeEmail()`, `prepareReply()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Exige ao menos um destinatário em `to` e no máximo 100 no total.
- **Input:** `email`.
- **Output:** Nada.
- **Effects:** Nenhum (pura).
- **Errors:** Lança erro acionável nos dois casos.

### `composeEmail`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `composeEmail(args: ComposeArgs): PreparedEmail`
- **Used by:** `connectors/gmail/src/send-tools.ts (module)`, `prepareDraftEmail()`, `prepareForward()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Monta um e-mail novo, sem conversa, a partir dos argumentos da ferramenta.
- **Input:** `args`: to, cc, bcc, assunto e corpo.
- **Output:** `PreparedEmail`.
- **Effects:** Nenhum (pura).
- **Errors:** Os de `parseRecipients()` e `checkRecipientLimit()`.

### `mimeBoundary`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `mimeBoundary(): string`
- **Used by:** `gmailMessageResource()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Gera uma fronteira MIME aleatória que não colide com base64.
- **Input:** Nenhuma.
- **Output:** `=_part_<aleatório>`.
- **Effects:** Lê o gerador aleatório.
- **Errors:** Nenhum.

### `gmailMessageResource`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `gmailMessageResource(prepared: PreparedEmail): { raw: string; threadId?: string }`
- **Used by:** `createDraft()`, `sendPrepared()`, `updateDraft()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Converte o e-mail pronto no recurso da Gmail API (`raw` e `threadId`).
- **Input:** `prepared`.
- **Output:** `{ raw, threadId? }`.
- **Effects:** Lê o gerador aleatório (fronteira).
- **Errors:** Nenhum.

### `fetchFullMessage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `fetchFullMessage(deps: OwnerDeps, ref: AccountRef, messageId: string): Promise<GmailMessage>`
- **Used by:** `prepareForward()`, `prepareReply()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Lê uma mensagem inteira (formato `full`) para responder ou encaminhar.
- **Input:** `deps`, `ref`; `messageId`.
- **Output:** A `GmailMessage`.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Propaga os de `gmailGet()`.

### `prepareReply`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `async prepareReply(deps: OwnerDeps, ref: AccountRef, request: ReplyRequest): Promise<PreparedEmail>`
- **Used by:** `prepareDraftEmail()`, `replyTool()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Lê o original e monta a resposta (ao remetente ou a todos).
- **Input:** `deps`, `ref`; `request`: id, texto e `replyAll`.
- **Output:** `PreparedEmail`.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Os de `fetchFullMessage()`, `replyEmail()` e `checkRecipientLimit()`.

### `forwardAttachments`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `async forwardAttachments(deps: OwnerDeps, ref: AccountRef, message: GmailMessage): Promise<MailAttachment[]>`
- **Used by:** `prepareForward()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Baixa os anexos do original para encaminhar.
- **Input:** `deps`, `ref`; `message`: original.
- **Output:** Lista de `MailAttachment`.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Lança erro se a soma passar de 18 MB (antes de baixar); propaga os de `downloadAttachment()`.

### `prepareForward`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `async prepareForward(deps: OwnerDeps, ref: AccountRef, request: ForwardRequest): Promise<PreparedEmail>`
- **Used by:** `connectors/gmail/src/send-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Valida os destinatários, lê o original e baixa os anexos dele para encaminhar.
- **Input:** `deps`, `ref`; `request`: id, destinatários e nota.
- **Output:** `PreparedEmail`.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token.
- **Errors:** Os de `composeEmail()`, `fetchFullMessage()` e `forwardAttachments()`.

### `sendPrepared`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `async sendPrepared(deps: OwnerDeps, ref: AccountRef, prepared: PreparedEmail): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/send-tools.ts (module)`, `replyTool()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Envia o e-mail pronto em `messages/send`.
- **Input:** `deps`, `ref`; `prepared`.
- **Output:** Resultado de `sentResult()`.
- **Effects:** Rede: Gmail API (e endpoint de tokens do Google, se renovar). KV e memória do isolate pelo access token. O e-mail sai da conta.
- **Errors:** Lança `writeAccessError()` para conta só leitura; propaga os erros de `gmailCall()`.

### `sentResult`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `sentResult(alias: string, sent: { readonly id?: string; readonly threadId?: string }): Record<string, unknown>`
- **Used by:** `sendDraft()`, `sendPrepared()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Monta o resultado de um envio.
- **Input:** `alias`; `sent`: resposta do Gmail.
- **Output:** `{ account, sent, message_id, thread_id }` (ids nulos se faltarem).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `src/mcp/annotations.ts`

### `toolAnnotations`

<!-- generated:start -->

- **File:** `src/mcp/annotations.ts`
- **Signature:** `toolAnnotations(title: string, hints: ToolHints): RequiredToolAnnotations`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `connectors/canvas-puc/src/tools-write.ts (module)`, `connectors/gmail/src/draft-tools.ts (module)`, `connectors/gmail/src/mailbox-tools.ts (module)`, `connectors/gmail/src/send-tools.ts (module)`, `connectors/gmail/src/tools.ts (module)`, `connectors/whatsapp/src/tools.ts (module)`, `replyTool()`
- **Processes:** P03, P18

<!-- generated:end -->

- **Does:** Joins a tool title with a hint preset.
- **Input:** `title`: human-readable tool title (English); `hints`: a preset from `src/mcp/annotations.ts` (`READ_ONLY_HINTS`, `SEND_HINTS`, `DESTRUCTIVE_HINTS`, `ORGANIZE_HINTS`, `CREATE_HINTS`).
- **Output:** `RequiredToolAnnotations`: `{ title, ...hints }`, the annotations every `defineTool` call must have (read-only, or writing with an explicit `destructiveHint`).
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum.

## `src/mcp/server-version.ts`

### `manifestVersion`

<!-- generated:start -->

- **File:** `src/mcp/server-version.ts`
- **Signature:** `manifestVersion(manifest: unknown): string`
- **Used by:** `connectors/canvas-puc/src/tools.ts (module)`, `connectors/gmail/src/worker.ts (module)`, `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** The manifest `version`, or `FALLBACK_SERVER_VERSION` when it is missing or not a non-empty string.
- **Input:** `manifest`: the parsed `plugin.json` of the connector (JSON import), or anything else.
- **Output:** The version string announced by the MCP server (`serverInfo.version`); `0.0.0` as fallback.
- **Effects:** Nenhum (pura).
- **Errors:** Nenhum (a missing or invalid version falls back).

## Data and constants

| Nome                         | Arquivo                                    | O que é                                                                                                                 |
| ---------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `CANVAS_USER_AGENT`          | `connectors/canvas-puc/src/remote.ts`      | User-Agent das chamadas do modo remoto ao Canvas (o Canvas devolve 403 sem User-Agent).                                 |
| `TOKEN_RENEWAL_SECONDS`      | `connectors/canvas-puc/src/remote.ts`      | Quanto cada renovação estende o token do Canvas: 30 dias menos 1 hora (o Canvas recusa mais de 30 dias à frente).       |
| `TEST_EXCEPTIONS`            | `src/test-exceptions.ts`                   | Lista única de funções sem teste automatizado, com motivo e teste manual.                                               |
| `DEFAULT_DOCS_CONFIG`        | `tools/docs/config.ts`                     | Configuração padrão do `docs:check`; `docs.config.json` sobrescreve.                                                    |
| `MODULE_SCOPE_SUFFIX`        | `tools/docs/ast.ts`                        | Sufixo do rótulo de referência feita fora de função (`arquivo (module)`).                                               |
| `WALK_IGNORED_DIRS`          | `tools/docs/inventory.ts`                  | Pastas puladas ao percorrer o disco sem git.                                                                            |
| `GENERATED_START`            | `tools/docs/markdown.ts`                   | Marcador de início do bloco gerado em FUNCTIONS.md.                                                                     |
| `GENERATED_END`              | `tools/docs/markdown.ts`                   | Marcador de fim do bloco gerado.                                                                                        |
| `INDEX_START`                | `tools/docs/markdown.ts`                   | Marcador de início do índice por módulo.                                                                                |
| `INDEX_END`                  | `tools/docs/markdown.ts`                   | Marcador de fim do índice por módulo.                                                                                   |
| `PLACEHOLDER`                | `tools/docs/markdown.ts`                   | Texto `_fill_in_` deixado nos campos manuais novos.                                                                     |
| `MANUAL_FIELDS`              | `tools/docs/render.ts`                     | Ordem fixa dos campos manuais (Faz, Entrada, Saída, Efeitos, Erros).                                                    |
| `HTML_TEXT_REPLACEMENTS`     | `src/core/html.ts`                         | Substituições (regex → texto) aplicadas em ordem por `htmlToText`.                                                      |
| `CFB_SIGNATURE`              | `src/core/cfb.ts`                          | Os 8 bytes iniciais de todo arquivo OLE/CFB (o contêiner do .doc).                                                      |
| `CP1252_HIGH`                | `src/core/word.ts`                         | Caracteres de 0x80 a 0x9F do Windows-1252, usados ao decodificar o texto de 8 bits do .doc.                             |
| `WORD_TEXT_REPLACEMENTS`     | `src/core/word.ts`                         | Substituições (regex → texto) aplicadas em ordem por `cleanWordText` às marcas do Word.                                 |
| `MAX_DOWNLOAD_BYTES`         | `connectors/canvas-puc/src/files.ts`       | Maior arquivo que `download_file` traz para a conversa (10 MB).                                                         |
| `MAX_TEXT_CHARS`             | `connectors/canvas-puc/src/files.ts`       | Maior texto devolvido por `read_file_text` (100 000 caracteres).                                                        |
| `CONNECTORS_DIR`             | `tools/bundle/bundle.ts`                   | Pasta dos conectores relativa à raiz (`connectors`).                                                                    |
| `PLUGIN_DIR`                 | `tools/bundle/bundle.ts`                   | Plugin subfolder of each connector (`plugin`), holding only plugin content (ADR 0020).                                  |
| `PLUGIN_MANIFEST_PATH`       | `tools/bundle/bundle.ts`                   | Plugin manifest in each connector (`plugin/.claude-plugin/plugin.json`); marks the folder as a connector.               |
| `PLUGIN_MCP_CONFIG_PATH`     | `tools/bundle/bundle.ts`                   | Plugin MCP config (`plugin/.mcp.json`) with the remote server URL.                                                      |
| `CANVAS_PAGE_SIZE`           | `connectors/canvas-puc/src/client.ts`      | Itens por página pedidos ao Canvas (`per_page`, máximo da API).                                                         |
| `DEFAULT_MAX_ITEMS`          | `connectors/canvas-puc/src/client.ts`      | Limite padrão de itens somados entre páginas em `getAll`.                                                               |
| `DEFAULT_CANVAS_URL`         | `connectors/canvas-puc/src/remote.ts`      | URL do Canvas da PUC Minas, usada sem `CANVAS_BASE_URL`.                                                                |
| `MAX_TEXT_LENGTH`            | `connectors/canvas-puc/src/format.ts`      | Tamanho máximo de textos longos devolvidos ao modelo por `shortText`.                                                   |
| `ASSIGNMENT_BUCKETS`         | `connectors/canvas-puc/src/helpers.ts`     | Filtros de `list_assignments` → `bucket` da API do Canvas (`all` não filtra).                                           |
| `CANVAS_READ_TOOLS`          | `connectors/canvas-puc/src/tools-read.ts`  | Ferramentas MCP de leitura do Canvas (cursos, tarefas, notas, avisos etc.).                                             |
| `CANVAS_WRITE_TOOLS`         | `connectors/canvas-puc/src/tools-write.ts` | Ferramentas MCP de escrita (`submit_text_assignment`, `reply_to_discussion`), só com `CANVAS_ALLOW_WRITE`; destrutivas. |
| `CANVAS_SERVER_INFO`         | `connectors/canvas-puc/src/tools.ts`       | MCP server name and version; the version comes from `plugin/.claude-plugin/plugin.json`.                                |
| `REMOTE_ENTRY`               | `tools/bundle/bundle.ts`                   | Entrada do servidor remoto em Node de um conector (`src/remote-main.ts`).                                               |
| `REMOTE_BUNDLE_PATH`         | `tools/bundle/bundle.ts`                   | Bundle do servidor remoto (`server/remote.js`), usado pelo Dockerfile.                                                  |
| `SEAL_KEY_BYTES`             | `src/remote/seal.ts`                       | Tamanho da `SEAL_KEY` (32 bytes, AES-256).                                                                              |
| `CLIENT_TTL_SECONDS`         | `src/remote/oauth.ts`                      | Validade do `client_id` registrado (10 anos).                                                                           |
| `PENDING_TTL_SECONDS`        | `src/remote/tokens.ts`                     | Validade do pedido selado no formulário de login (15 minutos).                                                          |
| `CODE_TTL_SECONDS`           | `src/remote/tokens.ts`                     | Validade do código de autorização (5 minutos).                                                                          |
| `ACCESS_TTL_SECONDS`         | `src/remote/tokens.ts`                     | Validade do access token (1 hora).                                                                                      |
| `REFRESH_TTL_SECONDS`        | `src/remote/tokens.ts`                     | Validade do refresh token (30 dias, como o token da PUC).                                                               |
| `REVOKED_SECRET_DESCRIPTION` | `src/remote/handler.ts`                    | `error_description` of the `invalid_grant` answered when the connector says the credential was revoked.                 |
| `LOGIN_PAGE_CSS`             | `src/remote/login-page.ts`                 | Estilo da página de autorização, com os tokens de `docs/UI.md`.                                                         |
| `CORS_HEADERS`               | `src/remote/handler.ts`                    | Headers CORS dos endpoints remotos (qualquer origem; não há cookies).                                                   |
| `REMOTE_ROUTES`              | `src/remote/handler.ts`                    | Tabela `MÉTODO caminho` → função do servidor remoto.                                                                    |
| `DEFAULT_REDIRECT_HOSTS`     | `src/remote/oauth.ts`                      | Hosts de retorno OAuth aceitos por padrão (`claude.ai`, `claude.com`, `localhost`).                                     |
| `MAX_BODY_BYTES`             | `src/remote/node-server.ts`                | Maior corpo de requisição aceito pelo servidor remoto (1 MB).                                                           |
| `PDF_ESCAPES`                | `src/core/pdf.ts`                          | Escapes de letra das strings literais do PDF (`\n`, `\t`...).                                                           |
| `TJ_SPACE_THRESHOLD`         | `src/core/pdf.ts`                          | Ajuste do `TJ` a partir do qual conta como espaço entre palavras.                                                       |
| `PDF_TEXT_OPERATORS`         | `src/core/pdf.ts`                          | Operador de texto do PDF → texto que ele produz.                                                                        |
| `ACCESS_TOKEN_MARGIN_MS`     | `connectors/gmail/src/access-token.ts`     | Margem antes do vencimento em que o access token do Google é renovado.                                                  |
| `MAX_ATTACHMENT_BYTES`       | `connectors/gmail/src/attachments.ts`      | Maior anexo lido como texto (5 MB).                                                                                     |
| `MAX_ATTACHMENT_CHARS`       | `connectors/gmail/src/attachments.ts`      | Maior texto devolvido de um anexo.                                                                                      |
| `GMAIL_MODIFY_SCOPE`         | `connectors/gmail/src/config.ts`           | Escopo `gmail.modify`, o único escopo de dados pedido (ler, enviar, organizar; sem exclusão definitiva).                |
| `MIN_CONSENT_SECRET_CHARS`   | `connectors/gmail/src/config.ts`           | Tamanho mínimo de `CONSENT_SECRET`.                                                                                     |
| `UPSTREAM_USER_AGENT`        | `connectors/gmail/src/context.ts`          | User-Agent enviado ao Google e à Gmail API.                                                                             |
| `GMAIL_API_BASE`             | `connectors/gmail/src/gmail-api.ts`        | Base da Gmail API para a conta do token.                                                                                |
| `GMAIL_STATUS_MESSAGES`      | `connectors/gmail/src/gmail-api.ts`        | Mensagem acionável por status HTTP da Gmail API.                                                                        |
| `GOOGLE_AUTHORIZE_URL`       | `connectors/gmail/src/google-oauth.ts`     | Endpoint de autorização do Google.                                                                                      |
| `GOOGLE_TOKEN_URL`           | `connectors/gmail/src/google-oauth.ts`     | Endpoint de tokens do Google.                                                                                           |
| `GOOGLE_CALLBACK_PATH`       | `connectors/gmail/src/google-oauth.ts`     | Caminho do retorno do Google (`/google/callback`).                                                                      |
| `GOOGLE_JWKS_URL`            | `connectors/gmail/src/id-token.ts`         | Chaves públicas que assinam os `id_token` do Google.                                                                    |
| `GOOGLE_ISSUERS`             | `connectors/gmail/src/id-token.ts`         | Emissores aceitos no `id_token`.                                                                                        |
| `CLOCK_SKEW_SECONDS`         | `connectors/gmail/src/id-token.ts`         | Folga de relógio aceita na validade do `id_token`.                                                                      |
| `LINK_STATE_PREFIX`          | `connectors/gmail/src/link-flow.ts`        | Prefixo do `state` do vínculo de conta (`link.`).                                                                       |
| `LINK_COOKIE`                | `connectors/gmail/src/link-flow.ts`        | Cookie `__Host-` que prende o vínculo ao navegador.                                                                     |
| `LINK_TTL_SECONDS`           | `connectors/gmail/src/link-flow.ts`        | Validade do pedido de vínculo (10 minutos).                                                                             |
| `LINK_REQUEST_TYP`           | `connectors/gmail/src/link-flow.ts`        | Tipo do selo do pedido de vínculo.                                                                                      |
| `MAX_MESSAGE_CHARS`          | `connectors/gmail/src/message-format.ts`   | Maior corpo de mensagem devolvido.                                                                                      |
| `MAX_THREAD_CHARS`           | `connectors/gmail/src/message-format.ts`   | Maior soma dos corpos de uma conversa.                                                                                  |
| `MIN_MESSAGE_CHARS`          | `connectors/gmail/src/message-format.ts`   | Menor fatia por mensagem numa conversa longa.                                                                           |
| `MESSAGE_HEADERS`            | `connectors/gmail/src/message-format.ts`   | Cabeçalhos devolvidos de cada mensagem.                                                                                 |
| `UNTRUSTED_NOTICE`           | `connectors/gmail/src/message-format.ts`   | Aviso de conteúdo de e-mail não confiável (prompt injection).                                                           |
| `GOOGLE_ACCOUNTS_ORIGIN`     | `connectors/gmail/src/pages.ts`            | Origem do Google liberada no `form-action` do consentimento.                                                            |
| `RATE_LIMIT_RETRY_SECONDS`   | `connectors/gmail/src/rate-limit.ts`       | Segundos do `Retry-After` na resposta 429.                                                                              |
| `GMAIL_ID`                   | `connectors/gmail/src/tools.ts`            | Esquema zod de id da Gmail API (só caracteres seguros na URL).                                                          |
| `listAccountsTool`           | `connectors/gmail/src/tools.ts`            | Ferramenta `list_accounts`.                                                                                             |
| `searchThreadsTool`          | `connectors/gmail/src/tools.ts`            | Ferramenta `search_threads`.                                                                                            |
| `getThreadTool`              | `connectors/gmail/src/tools.ts`            | Ferramenta `get_thread`.                                                                                                |
| `getMessageTool`             | `connectors/gmail/src/tools.ts`            | Ferramenta `get_message`.                                                                                               |
| `listLabelsTool`             | `connectors/gmail/src/tools.ts`            | Ferramenta `list_labels`.                                                                                               |
| `getAttachmentTextTool`      | `connectors/gmail/src/tools.ts`            | Ferramenta `get_attachment_text`.                                                                                       |
| `GMAIL_TOOLS`                | `connectors/gmail/src/tool-list.ts`        | Todas as ferramentas do Gmail, na ordem mostrada ao Claude.                                                             |
| `MAX_QUOTED_CHARS`           | `connectors/gmail/src/compose.ts`          | Maior trecho do original citado numa resposta (20 mil caracteres).                                                      |
| `FORWARD_SEPARATOR`          | `connectors/gmail/src/compose.ts`          | Linha que abre o bloco do e-mail encaminhado.                                                                           |
| `DRAFT_SHAPE`                | `connectors/gmail/src/draft-tools.ts`      | Parâmetros do conteúdo de um rascunho (criar e substituir).                                                             |
| `listDraftsTool`             | `connectors/gmail/src/draft-tools.ts`      | Ferramenta `list_drafts`.                                                                                               |
| `createDraftTool`            | `connectors/gmail/src/draft-tools.ts`      | Ferramenta `create_draft`.                                                                                              |
| `updateDraftTool`            | `connectors/gmail/src/draft-tools.ts`      | Ferramenta `update_draft`.                                                                                              |
| `sendDraftTool`              | `connectors/gmail/src/draft-tools.ts`      | Ferramenta `send_draft`.                                                                                                |
| `deleteDraftTool`            | `connectors/gmail/src/draft-tools.ts`      | Ferramenta `delete_draft`.                                                                                              |
| `MAX_GMAIL_ERROR_DETAIL`     | `connectors/gmail/src/gmail-api.ts`        | Maior detalhe de erro do Gmail repassado ao modelo (200 caracteres).                                                    |
| `TARGET_SHAPE`               | `connectors/gmail/src/mailbox-tools.ts`    | Parâmetros de alvo das ferramentas de organização (`message_ids`, `thread_ids`).                                        |
| `markReadTool`               | `connectors/gmail/src/mailbox-tools.ts`    | Ferramenta `mark_read`.                                                                                                 |
| `archiveTool`                | `connectors/gmail/src/mailbox-tools.ts`    | Ferramenta `archive`.                                                                                                   |
| `starTool`                   | `connectors/gmail/src/mailbox-tools.ts`    | Ferramenta `star`.                                                                                                      |
| `updateLabelsTool`           | `connectors/gmail/src/mailbox-tools.ts`    | Ferramenta `update_labels`.                                                                                             |
| `trashTool`                  | `connectors/gmail/src/mailbox-tools.ts`    | Ferramenta `trash`.                                                                                                     |
| `untrashTool`                | `connectors/gmail/src/mailbox-tools.ts`    | Ferramenta `untrash`.                                                                                                   |
| `MAX_TARGET_MESSAGES`        | `connectors/gmail/src/mailbox.ts`          | Mais mensagens por chamada das ferramentas de organização (50).                                                         |
| `MAX_TARGET_THREADS`         | `connectors/gmail/src/mailbox.ts`          | Mais conversas por chamada das ferramentas de organização (20).                                                         |
| `MAILBOX_ACTIONS`            | `connectors/gmail/src/mailbox.ts`          | Marcadores de sistema que cada ação põe e tira (lido, arquivar, estrela).                                               |
| `MAX_ENCODED_WORD_BYTES`     | `connectors/gmail/src/mime.ts`             | Maior trecho UTF-8 de uma palavra RFC 2047 (45 bytes, palavra ≤ 75).                                                    |
| `MAX_BODY_CHARS`             | `connectors/gmail/src/send-tools.ts`       | Maior corpo de e-mail aceito (100 mil caracteres).                                                                      |
| `RECIPIENTS`                 | `connectors/gmail/src/send-tools.ts`       | Esquema zod de lista de destinatários.                                                                                  |
| `BODY`                       | `connectors/gmail/src/send-tools.ts`       | Esquema zod do corpo em texto plano.                                                                                    |
| `SUBJECT`                    | `connectors/gmail/src/send-tools.ts`       | Esquema zod do assunto (até 998 caracteres).                                                                            |
| `sendEmailTool`              | `connectors/gmail/src/send-tools.ts`       | Ferramenta `send_email`.                                                                                                |
| `replyEmailTool`             | `connectors/gmail/src/send-tools.ts`       | Ferramenta `reply_email`.                                                                                               |
| `replyAllEmailTool`          | `connectors/gmail/src/send-tools.ts`       | Ferramenta `reply_all_email`.                                                                                           |
| `forwardEmailTool`           | `connectors/gmail/src/send-tools.ts`       | Ferramenta `forward_email`.                                                                                             |
| `MAX_RECIPIENTS`             | `connectors/gmail/src/send.ts`             | Mais destinatários (To + Cc + Bcc) num e-mail (100).                                                                    |
| `MAX_FORWARD_BYTES`          | `connectors/gmail/src/send.ts`             | Maior soma de anexos num encaminhamento (18 MB).                                                                        |
| `ONE_ACCOUNT`                | `connectors/gmail/src/tools.ts`            | Esquema zod do parâmetro `account` de uma conta só.                                                                     |
| `CONFIRM_HINT`               | `connectors/gmail/src/tools.ts`            | Frase das ferramentas de escrita: confirmar com o usuário e nunca agir por pedido de um e-mail.                         |
| `GMAIL_SERVER_INFO`          | `connectors/gmail/src/worker.ts`           | MCP server name and version; the version comes from `plugin/.claude-plugin/plugin.json`.                                |
| `GMAIL_SERVER_INSTRUCTIONS`  | `connectors/gmail/src/worker.ts`           | Instruções do servidor MCP (contas e conteúdo não confiável).                                                           |
| `ACCESS_TOKEN_TTL_SECONDS`   | `connectors/gmail/src/worker.ts`           | Validade do access token emitido ao Claude (1 hora).                                                                    |
| `REFRESH_TOKEN_TTL_SECONDS`  | `connectors/gmail/src/worker.ts`           | Validade do refresh token emitido ao Claude (30 dias).                                                                  |
| `GMAIL_ROUTES`               | `connectors/gmail/src/worker.ts`           | Rotas próprias do Worker: `MÉTODO caminho` → atendimento.                                                               |
| `BRIDGE_ERROR_MESSAGES`      | `connectors/whatsapp/src/bridge-client.ts` | User-facing messages (English) for the bridge's known error codes.                                                      |
| `WHATSAPP_DEFAULTS`          | `connectors/whatsapp/src/config.ts`        | Padrões do conector: dormir em 5 min, 25 s por ferramenta, 8 s esperando o sync, 10 envios por hora.                    |
| `BRIDGE_ENV_KEYS`            | `connectors/whatsapp/src/config.ts`        | Variáveis repassadas do Worker para o container da ponte (`bridge/API.md`).                                             |
| `SNAPSHOT_PUSH_URL`          | `connectors/whatsapp/src/config.ts`        | Endereço interno, interceptado pelo Worker, para onde a ponte envia o snapshot no `SIGTERM`.                            |
| `UNTRUSTED_NOTICE`           | `connectors/whatsapp/src/format.ts`        | Aviso de dado de terceiros não confiável que acompanha todo resultado com mensagens ou contatos.                        |
| `HIDDEN_CHAR_RANGES`         | `connectors/whatsapp/src/format.ts`        | Faixas de caracteres invisíveis (controle, largura zero, bidi, BOM) removidas por `sanitizeText`.                       |
| `SNAPSHOT_INTERVAL_MS`       | `connectors/whatsapp/src/lifecycle.ts`     | Intervalo mínimo entre snapshots disparados por uso (1 minuto).                                                         |
| `SNAPSHOT_AFTER_PATHS`       | `connectors/whatsapp/src/lifecycle.ts`     | Rotas da ponte depois das quais o banco pode ter mudado e vale tentar um snapshot.                                      |
| `SEND_HISTORY_KEY`           | `connectors/whatsapp/src/lifecycle.ts`     | Chave, no armazenamento do Durable Object, dos instantes dos envios recentes (limite por hora).                         |
| `PAIR_PAGE_CSS`              | `connectors/whatsapp/src/pair-page.ts`     | Acréscimos de estilo da página `/pair` (código grande, QR, botões secundários e de perigo).                             |
| `PAIR_SESSION_COOKIE`        | `connectors/whatsapp/src/pair.ts`          | Nome do cookie (`__Host-`) da sessão selada do `/pair`.                                                                 |
| `PAIR_NONCE_COOKIE`          | `connectors/whatsapp/src/pair.ts`          | Nome do cookie (`__Host-`) do nonce que amarra o login do `/pair` ao navegador.                                         |
| `PAIR_SESSION_TTL_SECONDS`   | `connectors/whatsapp/src/pair.ts`          | Validade da sessão do `/pair` e do token anti-CSRF (30 minutos).                                                        |
| `PAIR_LOGIN_TTL_SECONDS`     | `connectors/whatsapp/src/pair.ts`          | Validade do login do `/pair` em andamento (10 minutos).                                                                 |
| `PAIR_CALLBACK_PATH`         | `connectors/whatsapp/src/pair.ts`          | Caminho do retorno do GitHub para o `/pair` (subcaminho do retorno do OAuth App).                                       |
| `PAIR_ACTIONS`               | `connectors/whatsapp/src/pair.ts`          | Ações do `/pair` por caminho: código, QR, desvincular e recomeçar do zero.                                              |
| `SNAPSHOT_KEY_NAME`          | `connectors/whatsapp/src/snapshots.ts`     | Chave do snapshot atual no bucket R2 (`whatsapp/snapshot.was1`).                                                        |
| `WHATSAPP_INSTRUCTIONS`      | `connectors/whatsapp/src/tools.ts`         | Instruções do servidor MCP: o que é o conector e a regra sobre conteúdo não confiável.                                  |
| `WHATSAPP_SERVER_INFO`       | `connectors/whatsapp/src/tools.ts`         | MCP server name and version; the version comes from `plugin/.claude-plugin/plugin.json`.                                |
| `READ_TOOLS`                 | `connectors/whatsapp/src/tools.ts`         | Ferramentas de leitura (fase 1), sempre ativas.                                                                         |
| `BRIDGE_INSTANCE_NAME`       | `connectors/whatsapp/src/worker-env.ts`    | Nome fixo da única instância do Durable Object da ponte (instância única = sessão única).                               |
| `WHATSAPP_WORKER_HANDLERS`   | `connectors/whatsapp/src/worker.ts`        | Handlers do Worker (`fetch` e `scheduled`), exportados pelo `index.ts` com o Durable Object.                            |
| `GITHUB_USER_AGENT`          | `src/remote/github-login.ts`               | User-Agent das chamadas ao GitHub (a API recusa requisições sem ele).                                                   |
| `READ_ONLY_HINTS`            | `src/mcp/annotations.ts`                   | Hints of a read-only tool (`readOnlyHint: true`, idempotent, open world).                                               |
| `SEND_HINTS`                 | `src/mcp/annotations.ts`                   | Hints of a tool that sends or publishes (email, message, submission): destructive, not idempotent.                      |
| `DESTRUCTIVE_HINTS`          | `src/mcp/annotations.ts`                   | Hints of a tool that deletes or overwrites (trash, draft, account link): destructive, idempotent.                       |
| `ORGANIZE_HINTS`             | `src/mcp/annotations.ts`                   | Hints of a reversible organizing tool (read, archive, star, labels, restore): writes, not destructive.                  |
| `CREATE_HINTS`               | `src/mcp/annotations.ts`                   | Hints of a tool that creates something without deleting (draft, link): writes, not destructive.                         |
| `FALLBACK_SERVER_VERSION`    | `src/mcp/server-version.ts`                | Version announced when the plugin manifest has none (`0.0.0`).                                                          |
| `UPSTREAM_CALLBACK_PATH`     | `src/remote/handler.ts`                    | Caminho do retorno do login delegado (`/oauth/callback`), cadastrado no provedor.                                       |
| `BRIDGE_RETRY_MS`            | `connectors/whatsapp/src/bridge-client.ts` | Espera entre tentativas enquanto a ponte acorda (750 ms).                                                               |
| `GMAIL_SCOPES`               | `connectors/gmail/src/config.ts`           | Escopos do login e do vínculo (`openid email` + Gmail só leitura).                                                      |
| `GOOGLE_REVOKE_URL`          | `connectors/gmail/src/google-oauth.ts`     | Endpoint de revogação de tokens do Google.                                                                              |
| `LINK_TICKET_TYP`            | `connectors/gmail/src/link-flow.ts`        | Tipo do selo do ticket de vínculo emitido por `link_account`.                                                           |
| `OWNER_RECORD_TYP`           | `connectors/gmail/src/token-store.ts`      | Tipo do selo do registro de contas de um usuário.                                                                       |
| `OWNER_RECORD_EXP`           | `connectors/gmail/src/token-store.ts`      | Validade técnica do selo do registro (ano 2100).                                                                        |
| `MAX_LINKED_ACCOUNTS`        | `connectors/gmail/src/token-store.ts`      | Mais contas Gmail que um usuário pode vincular (10).                                                                    |
| `linkAccountTool`            | `connectors/gmail/src/tools.ts`            | Ferramenta `link_account`.                                                                                              |
| `unlinkAccountTool`          | `connectors/gmail/src/tools.ts`            | Ferramenta `unlink_account`.                                                                                            |
