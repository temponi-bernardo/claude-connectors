# Functions

Every top-level function in the code appears here, in a fixed template. The fields between `<!-- generated:start -->` and
`<!-- generated:end -->` (File, Signature, Used by, Processes) are written by `npm run docs:generate` from
the code — do not edit them by hand. The **Does**, **Input**, **Output**, **Effects** and **Errors** fields are
manual and mandatory; `npm run docs:check` fails while any `_fill_in_` remains.

Template and writing rules: [DOCUMENTATION.md](DOCUMENTATION.md#function).

## Index by module

<!-- index:start -->

- `connectors/canvas-puc/src/client.ts`: [`unauthorizedMessage`](#unauthorizedmessage), [`sendCanvasRequest`](#sendcanvasrequest), [`requestCanvas`](#requestcanvas), [`collectPages`](#collectpages), [`fetchDownload`](#fetchdownload), [`fetchPlainText`](#fetchplaintext), [`fetchFileBytes`](#fetchfilebytes), [`createCanvasClient`](#createcanvasclient)
- `connectors/canvas-puc/src/files.ts`: [`fileMimeType`](#filemimetype), [`fileContentBlock`](#filecontentblock), [`describeDownloadedFile`](#describedownloadedfile), [`downloadedFileResult`](#downloadedfileresult), [`tooLargeMessage`](#toolargemessage), [`downloadRefusal`](#downloadrefusal), [`openCanvasFileStream`](#opencanvasfilestream), [`streamCanvasFile`](#streamcanvasfile), [`downloadCanvasFile`](#downloadcanvasfile), [`readCanvasFileText`](#readcanvasfiletext)
- `connectors/canvas-puc/src/format.ts`: [`shortText`](#shorttext), [`toProfile`](#toprofile), [`toCourse`](#tocourse), [`toSubmissionFlags`](#tosubmissionflags), [`toPlannerItem`](#toplanneritem), [`toAssignmentSummary`](#toassignmentsummary), [`toRubricCriterion`](#torubriccriterion), [`toFileInfo`](#tofileinfo), [`toSubmissionDetail`](#tosubmissiondetail), [`toAssignmentDetail`](#toassignmentdetail), [`toGradeRow`](#tograderow), [`toEnrollmentGrade`](#toenrollmentgrade), [`toAnnouncement`](#toannouncement), [`toModuleItem`](#tomoduleitem), [`toModule`](#tomodule), [`toDiscussionSummary`](#todiscussionsummary), [`flattenDiscussion`](#flattendiscussion), [`toCalendarEvent`](#tocalendarevent)
- `connectors/canvas-puc/src/helpers.ts`: [`isoDaysFrom`](#isodaysfrom), [`dateOnly`](#dateonly), [`courseContextCodes`](#coursecontextcodes), [`courseNameMap`](#coursenamemap), [`participantNames`](#participantnames), [`isTextFile`](#istextfile), [`matchModuleItems`](#matchmoduleitems), [`activeCourses`](#activecourses), [`fetchOwnSubmission`](#fetchownsubmission), [`getAllOrEmpty`](#getallorempty)
- `connectors/canvas-puc/src/remote-main.ts`: [`startCanvasRemoteServer`](#startcanvasremoteserver)
- `connectors/canvas-puc/src/remote.ts`: [`withCanvasUserAgent`](#withcanvasuseragent), [`readCanvasRemoteSettings`](#readcanvasremotesettings), [`canvasLoginText`](#canvaslogintext), [`fetchCanvasSelf`](#fetchcanvasself), [`verifyCanvasToken`](#verifycanvastoken), [`matchesVisibleToken`](#matchesvisibletoken), [`planTokenRenewal`](#plantokenrenewal), [`canvasTokenApi`](#canvastokenapi), [`renewCanvasToken`](#renewcanvastoken), [`isCanvasTokenAlive`](#iscanvastokenalive), [`renewCanvasSecret`](#renewcanvassecret), [`canvasClientFor`](#canvasclientfor), [`streamCanvasTool`](#streamcanvastool), [`canvasRemoteConnector`](#canvasremoteconnector)
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
- `connectors/whatsapp/src/tools.ts`: [`toolDeadline`](#tooldeadline), [`syncWaitBudget`](#syncwaitbudget), [`waitForSync`](#waitforsync), [`prepareRead`](#prepareread), [`runRead`](#runread), [`compactContact`](#compactcontact), [`decodeHeaderText`](#decodeheadertext), [`mediaResult`](#mediaresult), [`allowedRecipient`](#allowedrecipient), [`whatsappTools`](#whatsapptools), [`createWhatsAppMcpServer`](#createwhatsappmcpserver)
- `connectors/whatsapp/src/worker-env.ts`: [`bridgeStub`](#bridgestub), [`bridgeFetchFor`](#bridgefetchfor)
- `connectors/whatsapp/src/worker.ts`: [`unixNow`](#unixnow), [`githubSettingsFrom`](#githubsettingsfrom), [`whatsappRemoteConnector`](#whatsappremoteconnector), [`createWhatsAppApps`](#createwhatsappapps), [`handleWhatsAppFetch`](#handlewhatsappfetch), [`isSyncCronEnabled`](#issynccronenabled), [`runScheduledSync`](#runscheduledsync)
- `src/core/bytes.ts`: [`byteView`](#byteview), [`concatBytes`](#concatbytes), [`utf16leToString`](#utf16letostring), [`bytesToBase64`](#bytestobase64)
- `src/core/cfb.ts`: [`isCfb`](#iscfb), [`readCfbHeader`](#readcfbheader), [`cfbSector`](#cfbsector), [`sectorWords`](#sectorwords), [`fatSectorIds`](#fatsectorids), [`followChain`](#followchain), [`readRegularChain`](#readregularchain), [`parseDirectory`](#parsedirectory), [`openCfb`](#opencfb), [`readMiniStream`](#readministream), [`readCfbStream`](#readcfbstream)
- `src/core/env.ts`: [`envValue`](#envvalue), [`parseFlag`](#parseflag), [`toEnvVars`](#toenvvars)
- `src/core/html.ts`: [`htmlToText`](#htmltotext)
- `src/core/http.ts`: [`buildUrl`](#buildurl), [`parseNextLink`](#parsenextlink)
- `src/core/pdf.ts`: [`bytesToLatin1`](#bytestolatin1), [`isPdf`](#ispdf), [`streamDataStart`](#streamdatastart), [`trimStreamEol`](#trimstreameol), [`readRawObject`](#readrawobject), [`listRawObjects`](#listrawobjects), [`decodePdfStream`](#decodepdfstream), [`splitObjectStream`](#splitobjectstream), [`storePdfObject`](#storepdfobject), [`readPdfObjects`](#readpdfobjects), [`pdfRefs`](#pdfrefs), [`dictRefs`](#dictrefs), [`collectPdfPages`](#collectpdfpages), [`orderedPages`](#orderedpages), [`utf16beHexToString`](#utf16behextostring), [`readBfChars`](#readbfchars), [`readBfRanges`](#readbfranges), [`rangeTarget`](#rangetarget), [`parseToUnicodeCMap`](#parsetounicodecmap), [`addFontRefs`](#addfontrefs), [`fontResourceRefs`](#fontresourcerefs), [`fontCMaps`](#fontcmaps), [`decodePdfText`](#decodepdftext), [`readLiteralString`](#readliteralstring), [`readEscape`](#readescape), [`readHexString`](#readhexstring), [`skipPdfSpace`](#skippdfspace), [`nextPdfToken`](#nextpdftoken), [`readPdfWord`](#readpdfword), [`wrapString`](#wrapstring), [`classifyWord`](#classifyword), [`showArrayText`](#showarraytext), [`lastOperandText`](#lastoperandtext), [`moveText`](#movetext), [`applyTextOperator`](#applytextoperator), [`feedPdfToken`](#feedpdftoken), [`contentStreamText`](#contentstreamtext), [`tidyPdfText`](#tidypdftext), [`pdfToText`](#pdftotext)
- `src/core/stream.ts`: [`splitBase64Ready`](#splitbase64ready), [`base64EncodeStream`](#base64encodestream), [`byteLimitStream`](#bytelimitstream), [`framedStream`](#framedstream), [`readLimitedBytes`](#readlimitedbytes)
- `src/core/word.ts`: [`docxXmlToText`](#docxxmltotext), [`docxToText`](#docxtotext), [`cp1252ToString`](#cp1252tostring), [`parsePieceTable`](#parsepiecetable), [`pieceText`](#piecetext), [`cleanWordText`](#cleanwordtext), [`docToText`](#doctotext), [`wordKind`](#wordkind), [`wordToText`](#wordtotext)
- `src/core/zip.ts`: [`findEndOfCentralDirectory`](#findendofcentraldirectory), [`listZipEntries`](#listzipentries), [`zipEntryBytes`](#zipentrybytes), [`decompressBytes`](#decompressbytes), [`inflateRaw`](#inflateraw), [`readZipEntry`](#readzipentry)
- `src/mcp/annotations.ts`: [`toolAnnotations`](#toolannotations)
- `src/mcp/server-version.ts`: [`manifestVersion`](#manifestversion)
- `src/mcp/tools.ts`: [`defineTool`](#definetool), [`textResult`](#textresult), [`rawToolResult`](#rawtoolresult), [`toToolResult`](#totoolresult), [`errorResult`](#errorresult), [`runToolSafely`](#runtoolsafely), [`registerToolSpecs`](#registertoolspecs), [`binaryContentBlock`](#binarycontentblock), [`base64ContentBlock`](#base64contentblock)
- `src/remote/github-login.ts`: [`githubAuthorizeUrl`](#githubauthorizeurl), [`parseEmailList`](#parseemaillist), [`pickAllowedEmail`](#pickallowedemail), [`exchangeGithubCode`](#exchangegithubcode), [`fetchGithubEmails`](#fetchgithubemails), [`finishGithubLogin`](#finishgithublogin), [`githubUpstreamLogin`](#githubupstreamlogin)
- `src/remote/handler.ts`: [`jsonResponse`](#jsonresponse), [`pageSecurityPolicy`](#pagesecuritypolicy), [`htmlResponse`](#htmlresponse), [`readForm`](#readform), [`readJsonBody`](#readjsonbody), [`loginPageFor`](#loginpagefor), [`redirectWithCode`](#redirectwithcode), [`handleRegister`](#handleregister), [`redirectToUpstream`](#redirecttoupstream), [`handleAuthorizePage`](#handleauthorizepage), [`handleUpstreamCallback`](#handleupstreamcallback), [`handleAuthorizeSubmit`](#handleauthorizesubmit), [`renewSecretQuietly`](#renewsecretquietly), [`handleToken`](#handletoken), [`handleMcp`](#handlemcp), [`serveMcpWithStreaming`](#servemcpwithstreaming), [`streamToolQuietly`](#streamtoolquietly), [`withCors`](#withcors), [`routeRemoteRequest`](#routeremoterequest), [`createRemoteHandler`](#createremotehandler)
- `src/remote/login-page.ts`: [`escapeHtml`](#escapehtml), [`renderLoginPage`](#renderloginpage)
- `src/remote/mcp-endpoint.ts`: [`serveMcpRequest`](#servemcprequest), [`mcpUnauthorizedResponse`](#mcpunauthorizedresponse)
- `src/remote/node-server.ts`: [`readPublicUrl`](#readpublicurl), [`readRemoteServerConfig`](#readremoteserverconfig), [`readNodeBody`](#readnodebody), [`toWebRequest`](#towebrequest), [`writeWebResponse`](#writewebresponse), [`serveNodeRequest`](#servenoderequest), [`startRemoteHttpServer`](#startremotehttpserver)
- `src/remote/oauth.ts`: [`readOAuthSettings`](#readoauthsettings), [`resolveIssuer`](#resolveissuer), [`oauthError`](#oautherror), [`authorizationServerMetadata`](#authorizationservermetadata), [`protectedResourceMetadata`](#protectedresourcemetadata), [`isAllowedRedirect`](#isallowedredirect), [`pkceChallenge`](#pkcechallenge), [`readRedirectUris`](#readredirecturis), [`registerClient`](#registerclient), [`clientRedirectUris`](#clientredirecturis), [`parseAuthorizeQuery`](#parseauthorizequery), [`readCodeChallenge`](#readcodechallenge)
- `src/remote/seal.ts`: [`parseSealKey`](#parsesealkey), [`sealPayload`](#sealpayload), [`unsealPayload`](#unsealpayload), [`openSealed`](#opensealed)
- `src/remote/streamed-tool.ts`: [`asJsonObject`](#asjsonobject), [`parseToolCallRequest`](#parsetoolcallrequest), [`readToolCallRequest`](#readtoolcallrequest), [`streamedResultFrame`](#streamedresultframe), [`streamedToolResponse`](#streamedtoolresponse)
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

- **Does:** Converts an absolute path into a path relative to the root, always with `/`.
- **Input:** `rootDir`: absolute root; `absolutePath`: absolute path inside it.
- **Output:** POSIX relative path, e.g. `src/a.ts`.
- **Effects:** None (pure).
- **Errors:** None.

### `globToRegExp`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `globToRegExp(glob: string): RegExp`
- **Used by:** `isAnalyzedSource()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Converts a simple glob (`**/`, `**`, `*`) into an anchored regular expression, to match relative paths.
- **Input:** `glob`: pattern, e.g. `**/fixtures/**`.
- **Output:** `RegExp` that matches the whole path.
- **Effects:** None (pure).
- **Errors:** None.

### `isAnalyzedSource`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `isAnalyzedSource(relativePath: string, config: DocsConfig): boolean`
- **Used by:** `openProject()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Decides whether a file enters the analysis: ends in `.ts`, is not `.d.ts`, is not a test and matches no `ignore` glob.
- **Input:** `relativePath`: relative path; `config`: docs configuration.
- **Output:** `true` if the file should be analyzed.
- **Effects:** None (pure).
- **Errors:** None.

### `openProject`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `openProject(rootDir: string, config: DocsConfig): Project`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Creates the ts-morph project with NodeNext module/resolution, adds the `.ts` files from the configured folders and removes those `isAnalyzedSource()` rejects.
- **Input:** `rootDir`: repository root; `config`: docs configuration.
- **Output:** ts-morph `Project` ready for analysis.
- **Effects:** Reads files from disk.
- **Errors:** File system read errors propagate.

### `signatureOf`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `signatureOf(fn: FunctionDeclaration): string`
- **Used by:** `collectFileFunctions()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Builds the readable signature of a function: `async` if present, name, parameters as written and return type (declared or inferred).
- **Input:** `fn`: ts-morph function declaration.
- **Output:** Text such as `slugify(title: string): string`.
- **Effects:** None (pure over the AST).
- **Errors:** None.

### `collectFileFunctions`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `collectFileFunctions(rootDir: string, file: SourceFile): FunctionInfo[]`
- **Used by:** `collectFunctions()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lists the named top-level functions of a file, with relative file and signature.
- **Input:** `rootDir`: root; `file`: ts-morph source file.
- **Output:** List of `FunctionInfo` in file order.
- **Effects:** None (pure over the AST).
- **Errors:** None.

### `collectFunctions`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `collectFunctions(rootDir: string, project: Project): FunctionInfo[]`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lists all top-level functions of the project, files in alphabetical order.
- **Input:** `rootDir`: root; `project`: open ts-morph project.
- **Output:** List of `FunctionInfo` (the function registry).
- **Effects:** None (pure over the AST).
- **Errors:** None.

### `isDataDeclaration`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `isDataDeclaration(declaration: VariableDeclaration): boolean`
- **Used by:** `collectFileConstants()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Decides whether a variable declaration is data/a constant and not a function assigned to a `const` (arrow or function expression).
- **Input:** `declaration`: ts-morph variable declaration.
- **Output:** `true` for data (including without an initializer).
- **Effects:** None (pure).
- **Errors:** None.

### `collectFileConstants`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `collectFileConstants(rootDir: string, file: SourceFile): ConstantInfo[]`
- **Used by:** `collectConstants()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lists the exported top-level constants of a file, excluding functions assigned to variables.
- **Input:** `rootDir`: root; `file`: source file.
- **Output:** List of `ConstantInfo`.
- **Effects:** None (pure over the AST).
- **Errors:** None.

### `collectConstants`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `collectConstants(rootDir: string, project: Project): ConstantInfo[]`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lists the exported constants of the whole project, for the "Data and constants" table.
- **Input:** `rootDir`: root; `project`: ts-morph project.
- **Output:** List of `ConstantInfo`.
- **Effects:** None (pure over the AST).
- **Errors:** None.

### `isIgnoredReference`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `isIgnoredReference(node: Node): boolean`
- **Used by:** `buildReferenceIndex()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Decides whether a reference node should be ignored in the index: the declaration itself, import/export specifiers, import clause and `export default`.
- **Input:** `node`: reference node returned by ts-morph.
- **Output:** `true` to ignore.
- **Effects:** None (pure).
- **Errors:** None.

### `ownerLabelOf`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `ownerLabelOf(rootDir: string, node: Node): string`
- **Used by:** `buildReferenceIndex()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Finds out what contains a reference: the enclosing top-level function (`nome()`) or, outside a function, the file's module (`arquivo (module)`).
- **Input:** `rootDir`: root; `node`: reference node.
- **Output:** Label used in "Used by".
- **Effects:** None (pure).
- **Errors:** None.

### `findDeclaration`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `findDeclaration(rootDir: string, project: Project, info: FunctionInfo): FunctionDeclaration | undefined`
- **Used by:** `buildReferenceIndex()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Locates the declaration of a registry function in the project, by file and name.
- **Input:** `rootDir`: root; `project`: project; `info`: registry function.
- **Output:** The `FunctionDeclaration`, or `undefined` if the file/function does not exist.
- **Effects:** None.
- **Errors:** None.

### `buildReferenceIndex`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `buildReferenceIndex(rootDir: string, project: Project, functions: readonly FunctionInfo[]): ReferenceIndex`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Builds the reference index: for each function, the set of labels of whoever calls it or passes it as a value (via `findReferencesAsNodes`, filtered by `isIgnoredReference()`).
- **Input:** `rootDir`: root; `project`: project; `functions`: registry.
- **Output:** `ReferenceIndex` (name → labels).
- **Effects:** None (pure over the AST).
- **Errors:** None.

### `buildCallGraph`

<!-- generated:start -->

- **File:** `tools/docs/ast.ts`
- **Signature:** `buildCallGraph(functions: readonly FunctionInfo[], references: ReferenceIndex): CallGraph`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Inverts the reference index into a call graph: function → registry functions it uses. Module-level references create no edge.
- **Input:** `functions`: registry; `references`: reference index.
- **Output:** `CallGraph` with one entry per function.
- **Effects:** None (pure).
- **Errors:** None.

## `tools/docs/checks.ts`

### `checkFunctionsDocumented`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkFunctionsDocumented(functions: readonly FunctionInfo[], sections: readonly FunctionSection[]): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Compares registry and sections: flags a function without a section (`FUNCTION_UNDOCUMENTED`) and a section without a function (`DOC_WITHOUT_FUNCTION`).
- **Input:** `functions`: registry; `sections`: FUNCTIONS.md sections.
- **Output:** List of `Issue`.
- **Effects:** None (pure).
- **Errors:** None.

### `checkSectionModules`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkSectionModules(functions: readonly FunctionInfo[], sections: readonly FunctionSection[]): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Flags a section placed under the wrong `## arquivo` heading (`SECTION_IN_WRONG_MODULE`).
- **Input:** `functions`: registry; `sections`: sections.
- **Output:** List of `Issue`.
- **Effects:** None (pure).
- **Errors:** None.

### `checkUniqueNames`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkUniqueNames(functions: readonly FunctionInfo[]): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Flags a function name defined in more than one file (`DUPLICATE_NAME`).
- **Input:** `functions`: registry.
- **Output:** List of `Issue`, one per repeated name.
- **Effects:** None (pure).
- **Errors:** None.

### `checkGeneratedBlocks`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkGeneratedBlocks(inventory: Inventory, sections: readonly FunctionSection[], citations: ProcessCitations): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Recomputes the generated block of each documented function and compares it with the current text (`GENERATED_BLOCK_OUTDATED`), showing expected and found.
- **Input:** `inventory`: inventory; `sections`: sections; `citations`: process citations.
- **Output:** List of `Issue`.
- **Effects:** None (pure).
- **Errors:** None.

### `checkManualFields`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkManualFields(sections: readonly FunctionSection[]): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Checks the five manual fields of each section: missing (`MANUAL_FIELD_MISSING`) or still holding the `PLACEHOLDER` marker (`MANUAL_FIELD_UNFILLED`).
- **Input:** `sections`: sections.
- **Output:** List of `Issue`.
- **Effects:** None (pure).
- **Errors:** None.

### `checkProcessCitations`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkProcessCitations(functions: readonly FunctionInfo[], citations: ProcessCitations): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Flags a function cited in PROCESSES.md that does not exist in the code (`PROCESS_CITES_UNKNOWN_FUNCTION`).
- **Input:** `functions`: registry; `citations`: citations per process.
- **Output:** List of `Issue`.
- **Effects:** None (pure).
- **Errors:** None.

### `checkStructure`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkStructure(versionedDirs: readonly string[], structureMarkdown: string): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Flags a versioned folder missing from STRUCTURE.md (`DIR_UNDOCUMENTED`).
- **Input:** `versionedDirs`: folders with a trailing slash; `structureMarkdown`: STRUCTURE.md text.
- **Output:** List of `Issue`.
- **Effects:** None (pure).
- **Errors:** None.

### `checkUiComponents`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkUiComponents(components: readonly string[], uiMarkdown: string | null): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Flags a UI component not mentioned in UI.md (`COMPONENT_UNDOCUMENTED`) or UI.md missing when there are components (`UI_DOC_MISSING`).
- **Input:** `components`: component names; `uiMarkdown`: UI.md text or `null`.
- **Output:** List of `Issue` (empty without components).
- **Effects:** None (pure).
- **Errors:** None.

### `checkTests`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkTests(inventory: Inventory): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Flags a function whose name appears in no test file and is not in the exceptions (`FUNCTION_UNTESTED`), and an exception that cites a nonexistent function (`STALE_TEST_EXCEPTION`).
- **Input:** `inventory`: inventory.
- **Output:** List of `Issue`.
- **Effects:** None (pure).
- **Errors:** None.

### `checkConstants`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `checkConstants(inventory: Inventory, functionsMarkdown: string): Issue[]`
- **Used by:** `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Flags an exported constant missing from the "Data and constants" table (`CONSTANT_UNDOCUMENTED`); only the text from that heading on counts.
- **Input:** `inventory`: inventory; `functionsMarkdown`: FUNCTIONS.md text.
- **Output:** List of `Issue`.
- **Effects:** None (pure).
- **Errors:** None.

### `runAllChecks`

<!-- generated:start -->

- **File:** `tools/docs/checks.ts`
- **Signature:** `runAllChecks(inventory: Inventory, docs: DocsTexts, citations: ProcessCitations): Issue[]`
- **Used by:** `runCheck()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Extracts the FUNCTIONS.md sections and runs all pure checks, concatenating the issues in a fixed order.
- **Input:** `inventory`: inventory; `docs`: document texts; `citations`: process citations.
- **Output:** Full list of `Issue`.
- **Effects:** None (pure).
- **Errors:** None.

## `tools/docs/cli.ts`

### `runDocsCli`

<!-- generated:start -->

- **File:** `tools/docs/cli.ts`
- **Signature:** `async runDocsCli(args: readonly string[]): Promise<number>`
- **Used by:** `tools/docs/cli.ts (module)`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Parses the command (`check` by default, or `generate`), runs it and prints the result.
- **Input:** `args`: command-line arguments.
- **Output:** Exit code: 0 ok, 1 issues, 2 unknown command.
- **Effects:** Writes to stdout/stderr; `generate` rewrites FUNCTIONS.md.
- **Errors:** Propagates configuration errors to the process (exits with an error).

## `tools/docs/config.ts`

### `mergeDocsConfig`

<!-- generated:start -->

- **File:** `tools/docs/config.ts`
- **Signature:** `mergeDocsConfig(partial: unknown): DocsConfig`
- **Used by:** `loadDocsConfig()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Merges a partial object over `DEFAULT_DOCS_CONFIG` and validates `sourceDirs` and `uiDir`.
- **Input:** `partial`: value read from the JSON (any type).
- **Output:** Complete `DocsConfig`.
- **Effects:** None (pure).
- **Errors:** `Error` with a Portuguese message if it is not an object, if `sourceDirs` is empty or if `uiDir` has an invalid type.

### `loadDocsConfig`

<!-- generated:start -->

- **File:** `tools/docs/config.ts`
- **Signature:** `loadDocsConfig(rootDir: string): DocsConfig`
- **Used by:** `runCheck()`, `runGenerate()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Reads `docs.config.json` from the root and returns the complete configuration; without the file, uses the defaults.
- **Input:** `rootDir`: repository root.
- **Output:** `DocsConfig`.
- **Effects:** Reads a file.
- **Errors:** Malformed or invalid JSON (`mergeDocsConfig()`) throws `Error`.

## `tools/docs/inventory.ts`

### `listGitFiles`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `listGitFiles(rootDir: string): string[] | null`
- **Used by:** `listVersionedDirs()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lists versioned, non-ignored files via `git ls-files --cached --others --exclude-standard`.
- **Input:** `rootDir`: root.
- **Output:** List of relative paths, or `null` if git fails/does not exist.
- **Effects:** Runs git as a subprocess.
- **Errors:** None (failures become `null`).

### `walkFiles`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `walkFiles(rootDir: string, relativeDir = ''): string[]`
- **Used by:** `listUiComponents()`, `listVersionedDirs()`, `readTestFilesText()`, `walkFiles()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Walks the disk recursively listing files, skipping `WALK_IGNORED_DIRS`.
- **Input:** `rootDir`: root; `relativeDir`: subfolder (internal, default empty).
- **Output:** List of paths relative to `rootDir`.
- **Effects:** Reads directories from disk.
- **Errors:** Read errors propagate.

### `dirsFromFiles`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `dirsFromFiles(files: readonly string[]): string[]`
- **Used by:** `listVersionedDirs()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Derives all folders from a list of files, including intermediate ones, with a trailing slash and sorted.
- **Input:** `files`: relative paths.
- **Output:** List of folders such as `a/`, `a/b/`.
- **Effects:** None (pure).
- **Errors:** None.

### `listVersionedDirs`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `listVersionedDirs(rootDir: string): string[]`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lists the repository's versioned folders, via git or, without git, from disk.
- **Input:** `rootDir`: root.
- **Output:** List of folders with a trailing slash.
- **Effects:** Git or disk reads.
- **Errors:** Read errors propagate.

### `readTestFilesText`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `readTestFilesText(rootDir: string, config: DocsConfig): string`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Concatenates the content of all test files in the code folders (by the configured suffix).
- **Input:** `rootDir`: root; `config`: configuration.
- **Output:** Single text with all the tests.
- **Effects:** Reads files from disk.
- **Errors:** Read errors propagate.

### `listUiComponents`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `listUiComponents(rootDir: string, config: DocsConfig): string[]`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Lists UI component names: `.tsx` files in the `uiDir` folder, excluding tests, sorted.
- **Input:** `rootDir`: root; `config`: configuration.
- **Output:** List of names (empty if `uiDir` is `null` or does not exist).
- **Effects:** Reads directories from disk.
- **Errors:** None.

### `loadTestExceptions`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `async loadTestExceptions(rootDir: string, config: DocsConfig): Promise<TestExceptionEntry[]>`
- **Used by:** `buildInventory()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Dynamically imports the test exceptions file and returns `TEST_EXCEPTIONS`.
- **Input:** `rootDir`: root; `config`: configuration.
- **Output:** Promise with the list of exceptions (empty if the file does not exist).
- **Effects:** Imports a module at runtime.
- **Errors:** `Error` if `TEST_EXCEPTIONS` is not a list.

### `buildInventory`

<!-- generated:start -->

- **File:** `tools/docs/inventory.ts`
- **Signature:** `async buildInventory(rootDir: string, config: DocsConfig): Promise<Inventory>`
- **Used by:** `runCheck()`, `runGenerate()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Builds the full inventory: functions, constants, references, call graph, versioned folders, test text, UI components and exceptions.
- **Input:** `rootDir`: root; `config`: configuration.
- **Output:** Promise with `Inventory`.
- **Effects:** Reads disk, runs git, imports a module.
- **Errors:** Propagates errors from the steps.

## `tools/docs/markdown.ts`

### `firstGroup`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `firstGroup(match: RegExpMatchArray): string`
- **Used by:** `checkManualFields()`, `extractBacktickedNames()`, `extractCalledNames()`, `extractDocumentedDirs()`, `extractFunctionSections()`, `extractProcessCitations()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Returns the first capture group of a regex match, or an empty string.
- **Input:** `match`: result of `exec`/`matchAll`.
- **Output:** Text of group 1.
- **Effects:** None (pure).
- **Errors:** None.

### `stripCodeBlocks`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `stripCodeBlocks(markdown: string): string`
- **Used by:** `extractBacktickedNames()`, `extractCalledNames()`, `extractDocumentedDirs()`, `extractFunctionSections()`, `extractProcessCitations()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Removes code blocks fenced by ``` or ~~~ so that examples do not count as citations.
- **Input:** `markdown`: text.
- **Output:** Text without the blocks.
- **Effects:** None (pure).
- **Errors:** None.

### `extractCalledNames`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `extractCalledNames(text: string): Set<string>`
- **Used by:** `extractProcessCitations()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Extracts names cited as `` `nome()` `` outside code blocks.
- **Input:** `text`: markdown.
- **Output:** `Set` of names.
- **Effects:** None (pure).
- **Errors:** None.

### `sliceBetween`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `sliceBetween(text: string, start: string, end: string): string | null`
- **Used by:** `buildSection()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Extracts the text between two markers, trimmed.
- **Input:** `text`; `start` and `end`: markers.
- **Output:** Inner text, or `null` if either marker is missing.
- **Effects:** None (pure).
- **Errors:** None.

### `replaceBetween`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `replaceBetween(text: string, markers: readonly [string, string], content: string): string`
- **Used by:** `applyGenerated()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Replaces the content between two markers, keeping them; without markers returns the text untouched.
- **Input:** `text`; `markers`: start/end pair; `content`: new inner text.
- **Output:** Updated text.
- **Effects:** None (pure).
- **Errors:** None.

### `extractFunctionSections`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `extractFunctionSections(markdown: string): FunctionSection[]`
- **Used by:** `applyGenerated()`, `pruneOrphanSections()`, `runAllChecks()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Splits the markdown into `### \`nome\``sections, recording the`## ...` heading above each one, the generated block and the manual text; ignores code blocks.
- **Input:** `markdown`: FUNCTIONS.md text.
- **Output:** List of `FunctionSection`.
- **Effects:** None (pure).
- **Errors:** None.

### `buildSection`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `buildSection(name: string, moduleHeading: string | null, raw: string): FunctionSection`
- **Used by:** `extractFunctionSections()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Builds a `FunctionSection` from the raw text of a section, separating the generated block and the manual text.
- **Input:** `name`; `moduleHeading` (or `null`); `raw`: section text.
- **Output:** `FunctionSection`.
- **Effects:** None (pure).
- **Errors:** None.

### `extractProcessCitations`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `extractProcessCitations(markdown: string): ProcessCitations`
- **Used by:** `generateFunctionsDoc()`, `runCheck()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Reads PROCESSES.md: for each `## Pnn ...` heading, the functions cited as `` `nome()` ``.
- **Input:** `markdown`: PROCESSES.md text.
- **Output:** `ProcessCitations` (id → names).
- **Effects:** None (pure).
- **Errors:** None.

### `extractDocumentedDirs`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `extractDocumentedDirs(markdown: string): Set<string>`
- **Used by:** `checkStructure()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Reads the folders documented in STRUCTURE.md: backticked snippets ending in `/`.
- **Input:** `markdown`: STRUCTURE.md text.
- **Output:** `Set` of folders.
- **Effects:** None (pure).
- **Errors:** None.

### `extractBacktickedNames`

<!-- generated:start -->

- **File:** `tools/docs/markdown.ts`
- **Signature:** `extractBacktickedNames(markdown: string): Set<string>`
- **Used by:** `checkConstants()`, `checkUiComponents()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Reads simple backticked identifiers (`` `Nome` ``) outside code blocks.
- **Input:** `markdown`: text.
- **Output:** `Set` of names.
- **Effects:** None (pure).
- **Errors:** None.

## `tools/docs/render.ts`

### `formatList`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `formatList(items: readonly string[]): string`
- **Used by:** `renderGeneratedBlock()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Formats a list for markdown: backticked items separated by commas, or `—` if empty.
- **Input:** `items`: texts.
- **Output:** Formatted text.
- **Effects:** None (pure).
- **Errors:** None.

### `renderGeneratedBlock`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `renderGeneratedBlock(info: FunctionInfo, data: GeneratedData): string`
- **Used by:** `applyGenerated()`, `checkGeneratedBlocks()`, `renderNewSection()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Renders the four lines of the generated block (File, Signature, Used by, Processes).
- **Input:** `info`: function; `data`: computed used-by and processes.
- **Output:** Block text, without the markers.
- **Effects:** None (pure).
- **Errors:** None.

### `renderNewSection`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `renderNewSection(info: FunctionInfo, data: GeneratedData): string`
- **Used by:** `applyGenerated()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Renders a complete new section: heading, generated block with markers and manual fields with the `PLACEHOLDER` marker.
- **Input:** `info`: function; `data`: generated data.
- **Output:** Section text.
- **Effects:** None (pure).
- **Errors:** None.

### `renderModuleIndex`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `renderModuleIndex(functions: readonly FunctionInfo[]): string`
- **Used by:** `applyGenerated()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Renders the index by module: one line per file with links to its functions.
- **Input:** `functions`: registry.
- **Output:** Index text.
- **Effects:** None (pure).
- **Errors:** None.

### `computeGeneratedData`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `computeGeneratedData(name: string, references: ReferenceIndex, processesByFunction: ReadonlyMap<string, ReadonlySet<string>>): GeneratedData`
- **Used by:** `checkGeneratedBlocks()`, `generateFunctionsDoc()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Computes a function's "Used by" and "Processes", sorted, from the reference index and the function → processes map.
- **Input:** `name`; `references`; `processesByFunction`.
- **Output:** `GeneratedData`.
- **Effects:** None (pure).
- **Errors:** None.

### `closureOf`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `closureOf(graph: CallGraph, roots: ReadonlySet<string>): Set<string>`
- **Used by:** `processesByFunction()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Transitive closure over a graph: the roots plus everything they call, directly or indirectly.
- **Input:** `graph`: call graph; `roots`: starting names.
- **Output:** `Set` with everything reached (includes the roots).
- **Effects:** None (pure).
- **Errors:** None.

### `processesByFunction`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `processesByFunction(citations: ProcessCitations, graph: CallGraph): Map<string, Set<string>>`
- **Used by:** `checkGeneratedBlocks()`, `generateFunctionsDoc()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Inverts the citations: for each process, expands the closure of the cited functions and records the process on each one.
- **Input:** `citations`: process → cited; `graph`: call graph.
- **Output:** `Map` function → process ids.
- **Effects:** None (pure).
- **Errors:** None.

### `replaceSectionBlock`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `replaceSectionBlock(markdown: string, name: string, block: string): string`
- **Used by:** `applyGenerated()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Replaces the generated block of a specific function's section.
- **Input:** `markdown`; `name`; `block`: new content.
- **Output:** Updated text (untouched if the section does not exist).
- **Effects:** None (pure).
- **Errors:** None.

### `appendSection`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `appendSection(markdown: string, info: FunctionInfo, section: string): string`
- **Used by:** `applyGenerated()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Appends a new section under the function's `## arquivo` heading, before the next heading; creates the heading before the data table if missing.
- **Input:** `markdown`; `info`: function; `section`: section text.
- **Output:** Updated text.
- **Effects:** None (pure).
- **Errors:** None.

### `insertBeforeDataTable`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `insertBeforeDataTable(markdown: string, text: string): string`
- **Used by:** `appendSection()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Inserts text before `## Data and constants`, or at the end if the table does not exist.
- **Input:** `markdown`; `text`.
- **Output:** Updated text.
- **Effects:** None (pure).
- **Errors:** None.

### `applyGenerated`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `applyGenerated(markdown: string, functions: readonly FunctionInfo[], dataOf: (name: string) => GeneratedData): string`
- **Used by:** `generateFunctionsDoc()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Applies the generator to FUNCTIONS.md: updates the index, replaces existing generated blocks and appends sections for new functions.
- **Input:** `markdown`: current text; `functions`: registry; `dataOf`: function that computes the generated data by name.
- **Output:** New FUNCTIONS.md text.
- **Effects:** None (pure).
- **Errors:** None.

### `removeSection`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `removeSection(markdown: string, name: string): string`
- **Used by:** `pruneOrphanSections()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Removes the function's whole section (`###` heading with the name), from the heading to the next `##`/`###` heading or the end of the text.
- **Input:** `markdown`: FUNCTIONS.md text; `name`: function name.
- **Output:** Markdown without the section (untouched if it does not exist).
- **Effects:** None (pure).
- **Errors:** None.

### `removeEmptyModules`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `removeEmptyModules(markdown: string): string`
- **Used by:** `pruneOrphanSections()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Removes module headings (`##` with the file path) that have no section below and normalizes to a single trailing newline.
- **Input:** `markdown`: FUNCTIONS.md text.
- **Output:** Markdown without empty modules.
- **Effects:** None (pure).
- **Errors:** None.

### `pruneOrphanSections`

<!-- generated:start -->

- **File:** `tools/docs/render.ts`
- **Signature:** `pruneOrphanSections(markdown: string, functions: readonly FunctionInfo[]): string`
- **Used by:** `applyGenerated()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Removes the sections of functions that no longer exist in the code and, if it removed any, the modules left empty.
- **Input:** `markdown`: FUNCTIONS.md text; `functions`: inventory functions.
- **Output:** Pruned markdown (the same text if there are no orphans).
- **Effects:** None (pure).
- **Errors:** None.

## `tools/docs/run.ts`

### `readOptional`

<!-- generated:start -->

- **File:** `tools/docs/run.ts`
- **Signature:** `readOptional(rootDir: string, relativePath: string): string | null`
- **Used by:** `readDocsTexts()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Reads a text file relative to the root, or `null` if it does not exist.
- **Input:** `rootDir`; `relativePath`.
- **Output:** Content or `null`.
- **Effects:** Reads a file.
- **Errors:** Read errors (other than "does not exist") propagate.

### `readDocsTexts`

<!-- generated:start -->

- **File:** `tools/docs/run.ts`
- **Signature:** `readDocsTexts(rootDir: string, config: DocsConfig): DocsTexts`
- **Used by:** `runCheck()`, `runGenerate()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Reads FUNCTIONS, PROCESSES, STRUCTURE (empty if missing) and UI (`null` if missing).
- **Input:** `rootDir`; `config`.
- **Output:** `DocsTexts`.
- **Effects:** Reads files.
- **Errors:** Read errors propagate.

### `formatIssues`

<!-- generated:start -->

- **File:** `tools/docs/run.ts`
- **Signature:** `formatIssues(issues: readonly Issue[]): string`
- **Used by:** `runDocsCli()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Formats the issues for the terminal: `✔` with no issues, or a numbered list `[CODIGO] mensagem`.
- **Input:** `issues`: list of `Issue`.
- **Output:** Text ready to print.
- **Effects:** None (pure).
- **Errors:** None.

### `runCheck`

<!-- generated:start -->

- **File:** `tools/docs/run.ts`
- **Signature:** `async runCheck(rootDir: string): Promise<Issue[]>`
- **Used by:** `runDocsCli()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Runs the full check: loads configuration, inventory and documents and runs `runAllChecks()`.
- **Input:** `rootDir`: root.
- **Output:** Promise with the list of `Issue`.
- **Effects:** Reads disk, runs git, imports a module.
- **Errors:** Propagates configuration errors.

### `generateFunctionsDoc`

<!-- generated:start -->

- **File:** `tools/docs/run.ts`
- **Signature:** `generateFunctionsDoc(inventory: Inventory, docs: DocsTexts): string`
- **Used by:** `runGenerate()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Computes the new FUNCTIONS.md text from the inventory and the current documents.
- **Input:** `inventory`; `docs`: texts.
- **Output:** New FUNCTIONS.md text.
- **Effects:** None (pure).
- **Errors:** None.

### `runGenerate`

<!-- generated:start -->

- **File:** `tools/docs/run.ts`
- **Signature:** `async runGenerate(rootDir: string): Promise<boolean>`
- **Used by:** `runDocsCli()`
- **Processes:** P01, P02, P06

<!-- generated:end -->

- **Does:** Rewrites FUNCTIONS.md with the index, generated blocks and new sections, only if something changed.
- **Input:** `rootDir`: root.
- **Output:** Promise with `true` if the file changed.
- **Effects:** Reads and writes `docs/FUNCTIONS.md`.
- **Errors:** Propagates configuration and write errors.

## `connectors/canvas-puc/src/client.ts`

### `unauthorizedMessage`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `unauthorizedMessage(baseUrl: string): string`
- **Used by:** `requestCanvas()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the error message for 401: the token expired or was revoked.
- **Input:** `baseUrl`: Canvas base URL (for the token generation link).
- **Output:** Text asking to generate another token and reconnect the connector in Claude's settings.
- **Effects:** None (pure).
- **Errors:** None.

### `sendCanvasRequest`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `sendCanvasRequest(deps: ClientDeps, req: CanvasRequest): Promise<Response>`
- **Used by:** `requestCanvas()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Sends a request to the Canvas API with the token (`Authorization: Bearer`), without handling the status.
- **Input:** `deps`: base URL, token and `fetchFn`; `req`: method, path, parameters and optional body.
- **Output:** Promise with the raw `Response`.
- **Effects:** Network (via `deps.fetchFn`).
- **Errors:** Propagates the rejection of `fetchFn`.

### `collectPages`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async collectPages(deps: ClientDeps, first: CanvasRequest, max: number): Promise<T[]>`
- **Used by:** `createCanvasClient()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Fetches all pages of a listing by following the `Link` header, up to `max` items.
- **Input:** `deps`: client dependencies; `first`: first request; `max`: item limit.
- **Output:** Promise with up to `max` items (a non-list response becomes one item); empty list if there are none.
- **Effects:** Network (one request per page).
- **Errors:** Propagates errors from `requestCanvas()` and from invalid JSON.

### `fetchPlainText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async fetchPlainText(fetchFn: typeof fetch, url: string): Promise<string>`
- **Used by:** `createCanvasClient()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Downloads a text file from a direct URL.
- **Input:** `fetchFn`: `fetch` function; `url`: download link (already authorized by Canvas).
- **Output:** Promise with the file content.
- **Effects:** Network.
- **Errors:** Rejects with "Failed to download the file (<status>)." if the response is not ok.

### `createCanvasClient`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `createCanvasClient(deps: ClientDeps): CanvasClient`
- **Used by:** `canvasClientFor()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Creates the Canvas client used by the tools.
- **Input:** `deps`: base URL, token and `fetchFn`.
- **Output:** `CanvasClient` with `get`, `getAll` (page of `CANVAS_PAGE_SIZE`, limit `DEFAULT_MAX_ITEMS`), `post` and `fetchText`.
- **Effects:** None on creation; the methods do network calls.
- **Errors:** None on creation; the methods propagate request errors.

### `fetchDownload`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async fetchDownload(fetchFn: typeof fetch, url: string): Promise<Response>`
- **Used by:** `createCanvasClient()`, `fetchFileBytes()`, `fetchPlainText()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Downloads a direct Canvas link and checks the status.
- **Input:** `fetchFn`: `fetch` function; `url`: download link (already authorized by Canvas).
- **Output:** Promise with the ok `Response`.
- **Effects:** Network.
- **Errors:** Rejects with "Failed to download the file (<status>)." if the response is not ok.

### `fetchFileBytes`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async fetchFileBytes(fetchFn: typeof fetch, url: string, maxBytes = MAX_DOWNLOAD_BYTES): Promise<Uint8Array>`
- **Used by:** `createCanvasClient()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Downloads a binary file from a direct URL, reading at most `maxBytes`.
- **Input:** `fetchFn`; `url`; `maxBytes` (default `MAX_DOWNLOAD_BYTES`).
- **Output:** Promise with the bytes.
- **Effects:** Network.
- **Errors:** Passes on the error from `fetchDownload`; rejects with `tooLargeMessage()` as soon as the body passes `maxBytes`.

### `requestCanvas`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async requestCanvas(deps: ClientDeps, req: CanvasRequest): Promise<Response>`
- **Used by:** `collectPages()`, `createCanvasClient()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Sends a request to the Canvas API with the token and checks the status.
- **Input:** `deps`: base URL, token and `fetchFn`; `req`: method, path, parameters and optional body.
- **Output:** Promise with the 2xx `Response`.
- **Effects:** Network (via `deps.fetchFn`).
- **Errors:** Rejects with `unauthorizedMessage()` on 401 and with "Canvas <status> on <method> <path>: <body>" on any other non-2xx status.

## `connectors/canvas-puc/src/format.ts`

### `shortText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `shortText(html: string | null | undefined): string`
- **Used by:** `toAnnouncement()`, `toCalendarEvent()`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converts HTML into text cut at `MAX_TEXT_LENGTH` characters.
- **Input:** `html`: HTML, `null` or `undefined`.
- **Output:** Text of up to `MAX_TEXT_LENGTH` characters; `''` for empty input.
- **Effects:** None (pure).
- **Errors:** None.

### `toProfile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toProfile(p: CanvasProfile): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converts the Canvas profile into a lean view.
- **Input:** `p`: user profile from the API.
- **Output:** `View` with `id`, `name`, `email`, `login` and `time_zone`.
- **Effects:** None (pure).
- **Errors:** None.

### `toCourse`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toCourse(c: CanvasCourse): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converts a course into a view with the current grade of the student's enrollment.
- **Input:** `c`: course from the API (with optional `enrollments` and `term`).
- **Output:** `View` with `id`, `name`, `code`, `term`, `current_score` and `current_grade` (`null` without enrollment).
- **Effects:** None (pure).
- **Errors:** None.

### `toSubmissionFlags`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toSubmissionFlags(flags: CanvasSubmissionFlags | false | undefined): View | null`
- **Used by:** `toPlannerItem()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converts the submission status of a planner item.
- **Input:** `flags`: status from the API, `false` or `undefined`.
- **Output:** `View` with `submitted`, `late`, `missing` and `graded`; `null` if the item has no submission.
- **Effects:** None (pure).
- **Errors:** None.

### `toPlannerItem`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toPlannerItem(i: CanvasPlannerItem, baseUrl: string): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converts an item from the student's planner into a view with an absolute link.
- **Input:** `i`: planner item; `baseUrl`: Canvas base URL.
- **Output:** `View` with `type`, `title`, `course`, `course_id`, `id`, `date`, `points`, `submission` and `url` (`undefined` without `html_url`).
- **Effects:** None (pure).
- **Errors:** None.

### `toAssignmentSummary`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toAssignmentSummary(a: CanvasAssignment): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converts a listed assignment into a view with the submission status and grade.
- **Input:** `a`: assignment from the API (with optional `submission`).
- **Output:** `View` with `id`, `name`, `due_at`, `points`, `submission_types`, `status`, `score`, `late` and `missing` (`null` without a submission).
- **Effects:** None (pure).
- **Errors:** None.

### `toRubricCriterion`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toRubricCriterion(r: CanvasRubricCriterion): View`
- **Used by:** `toAssignmentDetail()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converts a rubric criterion with its ratings as `points: description`.
- **Input:** `r`: criterion from the API.
- **Output:** `View` with `criterion`, `points` and `ratings` (empty list without ratings).
- **Effects:** None (pure).
- **Errors:** None.

### `toFileInfo`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toFileInfo(f: CanvasAttachment): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `toSubmissionDetail()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converts an attachment into a view with the size in KB.
- **Input:** `f`: attachment/file from the API.
- **Output:** `View` with `id`, `name`, `content_type`, `size_kb` (0 without a size), `updated_at` and `download`.
- **Effects:** None (pure).
- **Errors:** None.

### `toSubmissionDetail`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toSubmissionDetail(s: CanvasSubmission): View`
- **Used by:** `toAssignmentDetail()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converts a student submission with grade, comments, rubric and attachments.
- **Input:** `s`: submission from the API.
- **Output:** `View` with `status`, `submitted_at`, `score`, `grade`, `late`, `comments`, `rubric_assessment` (`null` if absent) and `attachments`.
- **Effects:** None (pure).
- **Errors:** None.

### `toAssignmentDetail`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toAssignmentDetail(a: CanvasAssignment, submission: CanvasSubmission | null): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converts a full assignment with its description as text, dates, rubric and submission.
- **Input:** `a`: assignment from the API; `submission`: the student's submission or `null`.
- **Output:** `View` with dates (`due_at`, `unlock_at`, `lock_at`), `points`, `description`, `rubric` and `submission` (`null` without a submission).
- **Effects:** None (pure).
- **Errors:** None.

### `toGradeRow`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toGradeRow(s: CanvasSubmission): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converts a submission (with `assignment` included) into a grade row.
- **Input:** `s`: submission from `students/submissions` with `include[]=assignment`.
- **Output:** `View` with `assignment`, `assignment_id`, `score`, `points_possible`, `grade`, `status` and `due_at`.
- **Effects:** None (pure).
- **Errors:** None.

### `toEnrollmentGrade`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toEnrollmentGrade(e: CanvasEnrollment, courseNames: ReadonlyMap<string, string>): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converts the grade summary of an enrollment, with the course name.
- **Input:** `e`: enrollment from the API; `courseNames`: map id → course name.
- **Output:** `View` with `course_id`, `course` (`undefined` if not in the map), `current_score`, `current_grade` and `final_score`.
- **Effects:** None (pure).
- **Errors:** None.

### `toAnnouncement`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toAnnouncement(a: CanvasAnnouncement): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converts a course announcement with its text converted and cut.
- **Input:** `a`: announcement from the API.
- **Output:** `View` with `id`, `title`, `course`, `author`, `posted_at`, `text` (via `shortText()`) and `url`.
- **Effects:** None (pure).
- **Errors:** None.

### `toModuleItem`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toModuleItem(i: CanvasModuleItem): View`
- **Used by:** `toModule()`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converts a module item into a view.
- **Input:** `i`: module item from the API.
- **Output:** `View` with `id`, `type`, `title`, `content_id`, `page_url`, `external_url` and `completed` (`null` without a requirement).
- **Effects:** None (pure).
- **Errors:** None.

### `toModule`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toModule(m: CanvasModule): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converts a module with its items.
- **Input:** `m`: module from the API.
- **Output:** `View` with `id`, `name` and `items` (empty list without items).
- **Effects:** None (pure).
- **Errors:** None.

### `toDiscussionSummary`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toDiscussionSummary(d: CanvasDiscussionTopic): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converts a listed discussion forum into a view.
- **Input:** `d`: discussion topic from the API.
- **Output:** `View` with `id`, `title`, `due_at` (`null` without an assignment), `reply_count`, `unread_count`, `last_reply_at` and `url`.
- **Effects:** None (pure).
- **Errors:** None.

### `flattenDiscussion`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `flattenDiscussion(entries: readonly CanvasDiscussionEntry[] | undefined, names: ReadonlyMap<string, string>, depth = 0): { depth: number; author: string | undefined; date: string | undefined; text: string }[]`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `flattenDiscussion()`
- **Processes:** —

<!-- generated:end -->

- **Does:** Flattens a forum's post tree, marking the level of each reply.
- **Input:** `entries`: posts (or `undefined`); `names`: map id → author name; `depth`: starting level (default 0).
- **Output:** Pre-order list of `{ depth, author, date, text }`; empty without posts.
- **Effects:** None (pure).
- **Errors:** None.

### `toCalendarEvent`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `toCalendarEvent(e: CanvasCalendarEvent): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Converts a calendar event with its description as short text.
- **Input:** `e`: event from the API.
- **Output:** `View` with `title`, `start_at`, `end_at`, `location`, `course` and `description` of up to 1000 characters.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/helpers.ts`

### `isoDaysFrom`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `isoDaysFrom(now: Date, days: number): string`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Computes the ISO date/time `days` days after `now`.
- **Input:** `now`: reference date; `days`: number of days (negative goes backwards).
- **Output:** ISO 8601 text in UTC.
- **Effects:** None (pure).
- **Errors:** None.

### `dateOnly`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `dateOnly(iso: string): string`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Extracts the `AAAA-MM-DD` part of an ISO date.
- **Input:** `iso`: ISO date.
- **Output:** The first 10 characters.
- **Effects:** None (pure).
- **Errors:** None.

### `courseContextCodes`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `courseContextCodes(ids: readonly Id[]): string[]`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Builds the `course_<id>` context codes used by announcements and the calendar.
- **Input:** `ids`: course ids.
- **Output:** List of codes in the same order; empty for an empty list.
- **Effects:** None (pure).
- **Errors:** None.

### `courseNameMap`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `courseNameMap(courses: readonly CanvasCourse[]): Map<string, string>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Builds the id → name map of the courses.
- **Input:** `courses`: courses from the API.
- **Output:** `Map` with the id as text and the name (`''` without a name).
- **Effects:** None (pure).
- **Errors:** None.

### `participantNames`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `participantNames(view: CanvasDiscussionView): Map<string, string>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Builds the id → name map of a forum's participants.
- **Input:** `view`: full view of the discussion.
- **Output:** `Map` with the id as text and the name (`''` without a name); empty without participants.
- **Effects:** None (pure).
- **Errors:** None.

### `isTextFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `isTextFile(contentType: string, name: string): boolean`
- **Used by:** `readCanvasFileText()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Decides whether a file can be read as text, by MIME type or by extension.
- **Input:** `contentType`: MIME type; `name`: file name.
- **Output:** `true` for MIME `text/`, json, xml, javascript, csv or text/code extensions; otherwise `false`.
- **Effects:** None (pure).
- **Errors:** None.

### `matchModuleItems`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `matchModuleItems(modules: readonly CanvasModule[], term: string): ModuleMatch[]`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Finds the module items whose title contains the term, case-insensitively.
- **Input:** `modules`: modules with items; `term`: search term.
- **Output:** List of `ModuleMatch` (`module`, `title`, `type`); empty without results.
- **Effects:** None (pure).
- **Errors:** None.

### `activeCourses`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `activeCourses(client: CanvasClient): Promise<CanvasCourse[]>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Fetches the student's active courses.
- **Input:** `client`: Canvas client.
- **Output:** Promise with the list of courses (`enrollment_state=active`).
- **Effects:** Network.
- **Errors:** Propagates client errors.

### `fetchOwnSubmission`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `async fetchOwnSubmission(client: CanvasClient, courseId: Id, assignmentId: Id): Promise<CanvasSubmission | null>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Fetches the student's own submission for an assignment, with comments and rubric.
- **Input:** `client`: Canvas client; `courseId`: course id; `assignmentId`: assignment id.
- **Output:** Promise with the `CanvasSubmission`; `null` if the fetch fails (no access).
- **Effects:** Network.
- **Errors:** None (failures become `null`).

### `getAllOrEmpty`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `getAllOrEmpty(client: CanvasClient, path: string, params: Record<string, string | readonly string[]>): Promise<T[]>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Fetches a paginated listing, replacing failure with an empty list.
- **Input:** `client`: Canvas client; `path`: API path; `params`: query parameters.
- **Output:** Promise with the items; empty list if the fetch fails.
- **Effects:** Network.
- **Errors:** None (failures become `[]`).

## `connectors/canvas-puc/src/tools-write.ts`

### `submissionPayload`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/tools-write.ts`
- **Signature:** `submissionPayload(kind: 'text' | 'url', content: string): { submission: Readonly<Record<string, string>> }`
- **Used by:** `connectors/canvas-puc/src/tools-write.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Builds the submission body for the chosen type.
- **Input:** `kind`: `text` (HTML accepted) or `url`; `content`: text or link.
- **Output:** `{ submission }` with `online_text_entry` and `body`, or `online_url` and `url`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/tools.ts`

### `canvasTools`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/tools.ts`
- **Signature:** `canvasTools(allowWrite: boolean): readonly ToolSpec<CanvasContext>[]`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Selects the Canvas tools to register.
- **Input:** `allowWrite`: whether the write tools are included.
- **Output:** `CANVAS_READ_TOOLS`, plus `CANVAS_WRITE_TOOLS` when `allowWrite` is `true`.
- **Effects:** None (pure).
- **Errors:** None.

### `createCanvasMcpServer`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/tools.ts`
- **Signature:** `createCanvasMcpServer(specs: readonly ToolSpec<CanvasContext>[], ctx: CanvasContext): McpServer`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Creates the Canvas `McpServer` with the tools bound to the context.
- **Input:** `specs`: tools; `ctx`: client and clock.
- **Output:** MCP server not yet connected.
- **Effects:** None beyond creating the object.
- **Errors:** None.

## `src/core/env.ts`

### `envValue`

<!-- generated:start -->

- **File:** `src/core/env.ts`
- **Signature:** `envValue(env: EnvVars, key: string): string | null`
- **Used by:** `containerEnvVars()`, `publicOrigin()`, `readAllowedEmails()`, `readCanvasRemoteSettings()`, `readGmailSettings()`, `readIntInRange()`, `readOAuthSettings()`, `readPublicUrl()`, `readRemoteServerConfig()`, `readSendAllowlist()`, `readSendSettings()`, `readSleepAfter()`, `readWhatsAppSettings()`, `requiredSecret()`, `requireEnv()`, `resolveIssuer()`
- **Processes:** P08, P10, P12, P13, P17

<!-- generated:end -->

- **Does:** Reads an environment variable, treating empty or a `${...}` placeholder as absent.
- **Input:** `env`: environment variables; `key`: variable name.
- **Output:** Trimmed value; `null` if absent, empty or starting with `${`.
- **Effects:** None (pure).
- **Errors:** None.

### `parseFlag`

<!-- generated:start -->

- **File:** `src/core/env.ts`
- **Signature:** `parseFlag(value: string | null): boolean`
- **Used by:** `readCanvasRemoteSettings()`, `readSendSettings()`
- **Processes:** P08, P13, P17

<!-- generated:end -->

- **Does:** Parses an on/off option.
- **Input:** `value`: option text or `null`.
- **Output:** `true` for `1`, `true`, `sim` or `yes` (case-insensitive); otherwise `false`.
- **Effects:** None (pure).
- **Errors:** None.

### `toEnvVars`

<!-- generated:start -->

- **File:** `src/core/env.ts`
- **Signature:** `toEnvVars(env: Readonly<Record<string, unknown>>): EnvVars`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`, `createGmailDeps()`, `handleWhatsAppFetch()`, `handleWorkerFetch()`, `publicOrigin()`, `runScheduledSync()`
- **Processes:** P08, P10, P12, P13, P17

<!-- generated:end -->

- **Does:** Converts the Worker environment into text variables.
- **Input:** `env`: Worker variables, secrets and bindings.
- **Output:** Only the entries whose value is text.
- **Effects:** None (pure).
- **Errors:** None.

## `src/core/html.ts`

### `htmlToText`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `htmlToText(html: string | null | undefined): string`
- **Used by:** `attachmentBytesToText()`, `connectors/canvas-puc/src/tools-read.ts (module)`, `docxXmlToText()`, `flattenDiscussion()`, `messageBodyText()`, `readCanvasFileText()`, `shortText()`, `toAssignmentDetail()`
- **Processes:** P03, P12, P18

<!-- generated:end -->

- **Does:** Converts HTML into plain text, preserving paragraphs and lists as line breaks.
- **Input:** `html`: HTML, `null` or `undefined`.
- **Output:** Text without tags, with entities decoded and trimmed; `''` for empty input.
- **Effects:** None (pure).
- **Errors:** None.

## `src/core/http.ts`

### `buildUrl`

<!-- generated:start -->

- **File:** `src/core/http.ts`
- **Signature:** `buildUrl(base: string, path: string, params: QueryParams = {}): URL`
- **Used by:** `sendCanvasRequest()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds a request URL from base, path and parameters.
- **Input:** `base`: base URL; `path`: relative path or absolute URL (`http...`); `params`: query (default `{}`).
- **Output:** `URL` with parameters; lists become `chave[]=...`; `null`/`undefined` are omitted.
- **Effects:** None (pure).
- **Errors:** Throws `TypeError` if the resulting URL is invalid.

### `parseNextLink`

<!-- generated:start -->

- **File:** `src/core/http.ts`
- **Signature:** `parseNextLink(linkHeader: string | null): string | null`
- **Used by:** `collectPages()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Extracts the `rel="next"` URL from a pagination `Link` header.
- **Input:** `linkHeader`: header value or `null`.
- **Output:** URL of the next page; `null` if there is no header or `next`.
- **Effects:** None (pure).
- **Errors:** None.

## `src/mcp/tools.ts`

### `defineTool`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `defineTool(def: ToolDefinition<C, S>): ToolSpec<C>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `connectors/canvas-puc/src/tools-write.ts (module)`, `connectors/gmail/src/draft-tools.ts (module)`, `connectors/gmail/src/mailbox-tools.ts (module)`, `connectors/gmail/src/send-tools.ts (module)`, `connectors/gmail/src/tools.ts (module)`, `connectors/whatsapp/src/tools.ts (module)`, `replyTool()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Creates a `ToolSpec` that validates the arguments with the `shape` before calling `run`.
- **Input:** `def`: name, description, zod `shape`, mandatory `annotations` (`title` and hints, from `toolAnnotations`) and typed `run`.
- **Output:** `ToolSpec` with a `run` that accepts raw arguments (`undefined` becomes `{}`).
- **Effects:** None on creation.
- **Errors:** The returned `run` rejects with `ZodError` for invalid arguments and propagates errors from `def.run`.

### `textResult`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `textResult(data: unknown, notes: readonly string[] = []): CallToolResult`
- **Used by:** `toToolResult()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14

<!-- generated:end -->

- **Does:** Converts a tool's return value into a text MCP result.
- **Input:** `data`: text or serializable value; `notes`: extra texts (default empty).
- **Output:** `CallToolResult` with one text block (indented JSON if not a string) plus one per note.
- **Effects:** None (pure).
- **Errors:** Throws if `data` is not JSON-serializable (e.g. circular reference).

### `errorResult`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `errorResult(error: unknown): CallToolResult`
- **Used by:** `runToolSafely()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14

<!-- generated:end -->

- **Does:** Converts an error into an MCP result with `isError`.
- **Input:** `error`: any thrown value.
- **Output:** `CallToolResult` with `isError: true` and the error message (or `String(error)`).
- **Effects:** None (pure).
- **Errors:** None.

### `runToolSafely`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `async runToolSafely(spec: ToolSpec<C>, ctx: C, rawArgs: unknown): Promise<CallToolResult>`
- **Used by:** `registerToolSpecs()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14

<!-- generated:end -->

- **Does:** Runs a tool, converting success or failure into an MCP result.
- **Input:** `spec`: tool; `ctx`: connector context; `rawArgs`: raw arguments.
- **Output:** Promise with `textResult()` on success or `errorResult()` on failure.
- **Effects:** The tool's own effects.
- **Errors:** None (errors become `errorResult`).

### `registerToolSpecs`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `registerToolSpecs(server: McpServer, specs: readonly ToolSpec<C>[], ctx: C): void`
- **Used by:** `createCanvasMcpServer()`, `createGmailServer()`, `createWhatsAppMcpServer()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14

<!-- generated:end -->

- **Does:** Registers each `ToolSpec` on the MCP server, with its title and annotations, bound to the connector context.
- **Input:** `server`: MCP server; `specs`: tools; `ctx`: context passed to each run.
- **Output:** Nothing.
- **Effects:** Mutates the server (registers the tools).
- **Errors:** Propagates SDK errors (e.g. repeated name).

### `rawToolResult`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `rawToolResult(result: CallToolResult): RawToolResult`
- **Used by:** `downloadedFileResult()`, `mediaResult()`
- **Processes:** P03, P14

<!-- generated:end -->

- **Does:** Wraps a ready MCP result (image, embedded resource) for the tool to return without converting it to text.
- **Input:** `result`: `CallToolResult`.
- **Output:** `RawToolResult`.
- **Effects:** None (pure).
- **Errors:** None.

### `toToolResult`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `toToolResult(data: unknown): CallToolResult`
- **Used by:** `runToolSafely()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14

<!-- generated:end -->

- **Does:** Converts a tool's return value into an MCP result: whatever `rawToolResult` wrapped passes straight through, the rest becomes `textResult`.
- **Input:** `data`: tool return value.
- **Output:** `CallToolResult`.
- **Effects:** None (pure).
- **Errors:** None.

### `binaryContentBlock`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `binaryContentBlock(mimeType: string, bytes: Uint8Array, uri: string): CallToolResult['content'][number]`
- **Used by:** `fileContentBlock()`, `mediaResult()`
- **Processes:** P03, P14

<!-- generated:end -->

- **Does:** MCP block with binary content: image, audio or, for anything else, an embedded resource with the given `uri`.
- **Input:** `mimeType`, file `bytes` and resource `uri`.
- **Output:** `image`, `audio` or `resource` block with the bytes in base64.
- **Effects:** None (pure).
- **Errors:** None.

### `base64ContentBlock`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `base64ContentBlock(mimeType: string, data: string, uri: string): CallToolResult['content'][number]`
- **Used by:** `binaryContentBlock()`, `streamedResultFrame()`
- **Processes:** P03, P09, P14

<!-- generated:end -->

- **Does:** Builds the MCP content block from data already in base64: `image` for `image/*`, `audio` for `audio/*`, embedded `resource` for the rest.
- **Input:** `mimeType`; `data` (base64, or a marker the stream replaces); `uri` of the resource.
- **Output:** `CallToolResult` content block.
- **Effects:** None.
- **Errors:** None.

## `connectors/canvas-puc/src/remote-main.ts`

### `startCanvasRemoteServer`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote-main.ts`
- **Signature:** `startCanvasRemoteServer(): void`
- **Used by:** `connectors/canvas-puc/src/remote-main.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Starts the HTTP server of the remote Canvas connector.
- **Input:** None (reads the process environment).
- **Output:** Nothing.
- **Effects:** Opens the HTTP port and writes to stdout.
- **Errors:** Throws if `PUBLIC_URL` or `SEAL_KEY` is missing or invalid.

## `connectors/canvas-puc/src/remote.ts`

### `readCanvasRemoteSettings`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `readCanvasRemoteSettings(env: EnvVars): CanvasRemoteSettings`
- **Used by:** `createWorkerApp()`, `startCanvasRemoteServer()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Reads the remote-mode configuration (`CANVAS_BASE_URL`, `CANVAS_ALLOW_WRITE`).
- **Input:** `env`: environment variables.
- **Output:** `CanvasRemoteSettings` with the URL without trailing slash, writes off by default and the global `fetch` with the connector's `User-Agent` (`withCanvasUserAgent`).
- **Effects:** None (pure).
- **Errors:** None.

### `canvasLoginText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `canvasLoginText(baseUrl: string): LoginPageText`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the texts of the Canvas authorization page.
- **Input:** `baseUrl`: Canvas address.
- **Output:** `LoginPageText` with the help pointing to `/profile/settings`.
- **Effects:** None (pure).
- **Errors:** None.

### `verifyCanvasToken`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `async verifyCanvasToken(settings: CanvasRemoteSettings, token: string): Promise<void>`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Checks the token by calling `/api/v1/users/self` on Canvas.
- **Input:** `settings`: Canvas and `fetch`; `token`: token pasted by the user.
- **Output:** Empty promise if the token works.
- **Effects:** Network (one request to Canvas).
- **Errors:** Rejects with a user-facing message: empty token, 401, other status or network failure.

### `canvasRemoteConnector`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `canvasRemoteConnector(settings: CanvasRemoteSettings): RemoteConnector`
- **Used by:** `createWorkerApp()`, `startCanvasRemoteServer()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the Canvas `RemoteConnector` for the HTTP server.
- **Input:** `settings`: remote-mode configuration.
- **Output:** Page texts, token verification, per-token `McpServer` factory and expiry renewal (`renewCanvasToken()`).
- **Effects:** None (pure).
- **Errors:** None.

### `withCanvasUserAgent`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `withCanvasUserAgent(init: RequestInit | undefined): RequestInit`
- **Used by:** `readCanvasRemoteSettings()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Adds the connector's `User-Agent` (`CANVAS_USER_AGENT`) to the `fetch` options; without it Canvas answers 403, and the Workers `fetch` does not send one.
- **Input:** `init`: `fetch` options (or `undefined`).
- **Output:** Copy of the options with the original headers (lowercase names) plus `user-agent`.
- **Effects:** None (pure).
- **Errors:** None.

### `matchesVisibleToken`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `matchesVisibleToken(visible: string, token: string): boolean`
- **Used by:** `planTokenRenewal()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Says whether the visible start of a Canvas token (`visible_token`, e.g. `11748~abcd...`) belongs to the given token.
- **Input:** `visible` (field from the token list) and the full token.
- **Output:** `true` if the token starts with the visible prefix minus the ellipsis; `false` with an empty prefix.
- **Effects:** None (pure).
- **Errors:** None.

### `planTokenRenewal`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `planTokenRenewal(list: readonly CanvasTokenInfo[], token: string, now: Date): { readonly id: number; readonly expiresAt: string } | null`
- **Used by:** `renewCanvasToken()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Decides whether the Canvas token needs its expiry extended and until when (now + `TOKEN_RENEWAL_SECONDS`).
- **Input:** List of `user_generated_tokens`, the token and the current time.
- **Output:** `{ id, expiresAt }`, or null if the token is not in the list, has no expiry or already expires less than a day from the limit.
- **Effects:** None (pure).
- **Errors:** None.

### `canvasTokenApi`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `async canvasTokenApi(settings: CanvasRemoteSettings, token: string, request: CanvasTokenRequest): Promise<unknown>`
- **Used by:** `renewCanvasToken()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Calls the Canvas API with the user's token (`Bearer`), sending a JSON body if there is one.
- **Input:** Remote configuration, token and `CanvasTokenRequest` (`path`, optional `method`, optional `body`).
- **Output:** The response JSON.
- **Effects:** HTTP request to Canvas.
- **Errors:** Rejects with the status if the response is not 2xx; passes network failures through.

### `renewCanvasToken`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `async renewCanvasToken(settings: CanvasRemoteSettings, token: string, now: Date): Promise<void>`
- **Used by:** `renewCanvasSecret()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Extends the expiry of the token itself on Canvas (Access Tokens API) when it is close to expiring; PUC's Canvas accepts at most 30 days ahead.
- **Input:** Remote configuration, token and current time.
- **Output:** Nothing.
- **Effects:** `GET /api/v1/users/self/user_generated_tokens` and, if `planTokenRenewal()` says so, `PUT /api/v1/users/self/tokens/:id` with `expires_at`.
- **Errors:** Rejects like `canvasTokenApi()` (the caller, `renewSecretQuietly()`, only logs the warning).

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

### `canvasClientFor`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `canvasClientFor(settings: CanvasRemoteSettings, token: string): CanvasClient`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Creates the Canvas client of the server's Canvas, authorized with the user's token.
- **Input:** `settings` (`CanvasRemoteSettings`); `token`.
- **Output:** `CanvasClient`.
- **Effects:** None (the client makes requests only when used).
- **Errors:** None.

### `streamCanvasTool`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `async streamCanvasTool(client: CanvasClient, call: ToolCallRequest): Promise<StreamedToolContent | null>`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Connector `streamTool` of Canvas: streams `download_file`, leaves every other tool to the MCP server.
- **Input:** `client`; `call` (`ToolCallRequest`).
- **Output:** `StreamedToolContent`; `null` for other tools or when `streamCanvasFile()` declines.
- **Effects:** Canvas GET `/files/:id` and the download.
- **Errors:** Rejects on invalid arguments (zod) or Canvas errors; the remote handler then falls back to the MCP server.

## `src/remote/handler.ts`

### `jsonResponse`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `jsonResponse(data: unknown, status = 200): Response`
- **Used by:** `handleMcp()`, `handleRegister()`, `handleToken()`, `src/remote/handler.ts (module)`
- **Processes:** P08, P09, P14

<!-- generated:end -->

- **Does:** Builds an uncached JSON response.
- **Input:** `data`: value; `status`: defaults to 200.
- **Output:** `Response`.
- **Effects:** None (pure).
- **Errors:** None.

### `htmlResponse`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `htmlResponse(html: string, status = 200, formTarget: string | null = null): Response`
- **Used by:** `consentPage()`, `handleAuthorizePage()`, `handleAuthorizeSubmit()`, `handlePairCallback()`, `handlePairPost()`, `handleUpstreamCallback()`, `loginPageFor()`, `messagePage()`, `pairPage()`, `routePairRequest()`
- **Processes:** P08, P10, P11, P13, P15

<!-- generated:end -->

- **Does:** Builds an uncached HTML response with a strict CSP.
- **Input:** `html`: page; `status`: defaults to 200; `formTarget`: return origin allowed in `form-action` (defaults to `null`).
- **Output:** `Response`.
- **Effects:** None (pure).
- **Errors:** None.

### `readForm`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async readForm(request: Request): Promise<URLSearchParams>`
- **Used by:** `handleAuthorizeSubmit()`, `handlePairPost()`, `handleToken()`, `submitAuthorize()`
- **Processes:** P08, P10, P13, P15

<!-- generated:end -->

- **Does:** Reads the body of a urlencoded form.
- **Input:** `request`.
- **Output:** `URLSearchParams`.
- **Effects:** Consumes the request body.
- **Errors:** None.

### `readJsonBody`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async readJsonBody(request: Request): Promise<unknown>`
- **Used by:** `handleRegister()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Reads the request's JSON body.
- **Input:** `request`.
- **Output:** Parsed value; `null` if it is not valid JSON.
- **Effects:** Consumes the request body.
- **Errors:** None (invalid JSON becomes `null`).

### `loginPageFor`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `loginPageFor(app: RemoteApp, request: AuthorizeRequest, error: string | null): Response`
- **Used by:** `handleAuthorizePage()`, `handleAuthorizeSubmit()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Builds the login page for a validated request.
- **Input:** `app`; `request`: request; `error`: message or null.
- **Output:** HTML `Response` with the sealed request.
- **Effects:** Generates random bytes (seal).
- **Errors:** None.

### `redirectWithCode`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `redirectWithCode(request: AuthorizeRequest, code: string): Response`
- **Used by:** `handleAuthorizeSubmit()`, `handleUpstreamCallback()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Redirects to the client with the code and the `state`.
- **Input:** `request`: request; `code`: sealed code.
- **Output:** 302 `Response`.
- **Effects:** None (pure).
- **Errors:** None.

### `handleRegister`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async handleRegister(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Handles `POST /register` (dynamic registration).
- **Input:** `app`; `request`.
- **Output:** 201 with the client, or 400 with an OAuth error.
- **Effects:** Consumes the body.
- **Errors:** None.

### `handleAuthorizePage`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `handleAuthorizePage(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Handles `GET /authorize`: validates and shows the login page.
- **Input:** `app`; `request`.
- **Output:** HTML page, or 400 without redirecting when the request is invalid.
- **Effects:** None (pure).
- **Errors:** None.

### `handleAuthorizeSubmit`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async handleAuthorizeSubmit(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Handles `POST /authorize`: checks the credential and returns the code.
- **Input:** `app`; `request`: form with `pending` and `secret`.
- **Output:** 302 to the client; page with an error if the credential fails; 400 if the request expired.
- **Effects:** Network (via the connector's `verifySecret`).
- **Errors:** None.

### `handleToken`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async handleToken(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Handles `POST /token`; on refresh, calls `renewSecretQuietly()` before answering.
- **Input:** `app`; `request`: OAuth form.
- **Output:** 200 with tokens, or 400 with an OAuth error; 400 `invalid_grant` (`REVOKED_SECRET_DESCRIPTION`) when the connector says the credential was revoked.
- **Effects:** Consumes the body; on refresh, the connector's credential renewal.
- **Errors:** None.

### `handleMcp`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `handleMcp(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Handles `/mcp`, requiring the access token; serves through `serveMcpWithStreaming()`.
- **Input:** `app`; `request`.
- **Output:** MCP response, or a 401 that starts OAuth.
- **Effects:** Runs connector tools (network).
- **Errors:** Passes MCP transport errors through.

### `withCors`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `withCors(response: Response): Response`
- **Used by:** `routeRemoteRequest()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Adds the CORS headers to a response.
- **Input:** `response`.
- **Output:** The same response, with `CORS_HEADERS`.
- **Effects:** Mutates the headers of the given response.
- **Errors:** None.

### `routeRemoteRequest`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async routeRemoteRequest(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `createRemoteHandler()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Picks the route by method and path.
- **Input:** `app`; `request`.
- **Output:** Route response with CORS; 204 on preflight; 404 on an unknown path.
- **Effects:** Those of the chosen route.
- **Errors:** Passes route errors through.

### `createRemoteHandler`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `createRemoteHandler(app: RemoteApp): (request: Request) => Promise<Response>`
- **Used by:** `handleWhatsAppFetch()`, `handleWorkerFetch()`, `startCanvasRemoteServer()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Creates the HTTP handler of the remote connector.
- **Input:** `app`: OAuth configuration, connector and clock.
- **Output:** Function `(Request) => Promise<Response>`.
- **Effects:** None (pure).
- **Errors:** None.

### `pageSecurityPolicy`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `pageSecurityPolicy(formTarget: string | null): string`
- **Used by:** `htmlResponse()`
- **Processes:** P08, P10, P11, P13, P15

<!-- generated:end -->

- **Does:** Builds the CSP of the HTML pages; `form-action` includes the OAuth return origin, because the browser also applies `form-action` to the 302 that follows the form submission.
- **Input:** `formTarget`: origin allowed for the submission (e.g. `https://claude.ai`) or `null`.
- **Output:** Text of the `content-security-policy` header.
- **Effects:** None (pure).
- **Errors:** None.

### `renewSecretQuietly`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async renewSecretQuietly(connector: RemoteConnector, secret: string): Promise<SecretRenewal>`
- **Used by:** `handleToken()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Asks the connector to renew the credential (`renewSecret`), without letting a failure break the refresh.
- **Input:** Remote connector and the user's secret.
- **Output:** `SecretRenewal`: what `renewSecret` answered, or `'kept'` when the connector has none or it failed.
- **Effects:** Whatever the connector's `renewSecret` does; `console.warn` if it fails.
- **Errors:** None (the failure becomes a log warning).

### `redirectToUpstream`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `redirectToUpstream(app: RemoteApp, login: UpstreamLogin, request: AuthorizeRequest): Response`
- **Used by:** `handleAuthorizePage()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Redirects the browser to the identity provider with the request sealed in `state`.
- **Input:** `app`, the delegated login (`UpstreamLogin`) and the validated authorization request.
- **Output:** 302 response to the provider's login URL.
- **Effects:** None (pure).
- **Errors:** None.

### `handleUpstreamCallback`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async handleUpstreamCallback(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P13

<!-- generated:end -->

- **Does:** `GET /oauth/callback`: completes the delegated login and returns the code to the client, or explains the refusal.
- **Input:** `app` and the provider's return request (`state`, `code`).
- **Output:** 302 with the code to `redirect_uri`; HTML 404 (login not delegated), 400 (expired request) or 403 (login refused).
- **Effects:** Whatever the login's `finish` does (e.g. `fetch` to GitHub).
- **Errors:** None (a `finish` failure becomes a 403 page).

### `serveMcpWithStreaming`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async serveMcpWithStreaming(connector: RemoteConnector, secret: string, request: Request): Promise<Response>`
- **Used by:** `handleMcp()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Serves `/mcp`: a call the connector streams goes straight out; everything else goes to the connector's MCP server.
- **Input:** `connector`; `secret` of the user; `request`.
- **Output:** `Response`.
- **Effects:** Like `streamToolQuietly()` and `serveMcpRequest()`.
- **Errors:** None (failures become MCP responses).

### `streamToolQuietly`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `async streamToolQuietly(connector: RemoteConnector, secret: string, request: Request): Promise<Response | null>`
- **Used by:** `serveMcpWithStreaming()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Asks the connector to stream a `tools/call`; any failure falls back to the MCP server with a warning.
- **Input:** `connector`; `secret`; `request`.
- **Output:** Streamed `Response`; `null` when the connector has no `streamTool`, the message is not a `tools/call`, it declines or fails.
- **Effects:** Calls the connector; logs a warning on failure.
- **Errors:** None.

## `src/remote/login-page.ts`

### `escapeHtml`

<!-- generated:start -->

- **File:** `src/remote/login-page.ts`
- **Signature:** `escapeHtml(value: string): string`
- **Used by:** `alertHtml()`, `consentPageBody()`, `handlePairCallback()`, `handleUpstreamCallback()`, `messagePage()`, `pageDocument()`, `pairForm()`, `pairingSection()`, `renderLoginPage()`, `renderPairPage()`
- **Processes:** P08, P10, P11, P13, P15

<!-- generated:end -->

- **Does:** Escapes text for HTML (content and attributes).
- **Input:** `value`: text.
- **Output:** Text with `& < > " '` replaced by entities.
- **Effects:** None (pure).
- **Errors:** None.

### `renderLoginPage`

<!-- generated:start -->

- **File:** `src/remote/login-page.ts`
- **Signature:** `renderLoginPage(view: LoginPageView): string`
- **Used by:** `loginPageFor()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Generates the HTML authorization page.
- **Input:** `view`: texts, sealed request, client host and optional error.
- **Output:** Complete HTML, without scripts.
- **Effects:** None (pure).
- **Errors:** None.

## `src/remote/mcp-endpoint.ts`

### `serveMcpRequest`

<!-- generated:start -->

- **File:** `src/remote/mcp-endpoint.ts`
- **Signature:** `async serveMcpRequest(server: McpServer, request: Request): Promise<Response>`
- **Used by:** `handleMcpApi()`, `serveMcpWithStreaming()`
- **Processes:** P09, P10, P12, P14

<!-- generated:end -->

- **Does:** Handles a sessionless MCP request with a JSON response.
- **Input:** `server`: the user's `McpServer`; `request`: HTTP request.
- **Output:** Transport `Response`.
- **Effects:** Connects and closes the MCP server (runs the called tool).
- **Errors:** Passes transport errors through.

### `mcpUnauthorizedResponse`

<!-- generated:start -->

- **File:** `src/remote/mcp-endpoint.ts`
- **Signature:** `mcpUnauthorizedResponse(issuer: string): Response`
- **Used by:** `handleMcp()`
- **Processes:** P08, P09, P14

<!-- generated:end -->

- **Does:** Builds the 401 that starts OAuth in the MCP client.
- **Input:** `issuer`: public URL.
- **Output:** 401 `Response` with `WWW-Authenticate` pointing to the resource metadata.
- **Effects:** None (pure).
- **Errors:** None.

## `src/remote/node-server.ts`

### `readPublicUrl`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `readPublicUrl(env: EnvVars): string`
- **Used by:** `readRemoteServerConfig()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Reads the server's public URL (`PUBLIC_URL`).
- **Input:** `env`: environment variables.
- **Output:** URL without trailing slash.
- **Effects:** None (pure).
- **Errors:** Throws if missing, invalid or not https outside localhost.

### `readRemoteServerConfig`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `readRemoteServerConfig(env: EnvVars): RemoteServerConfig`
- **Used by:** `startCanvasRemoteServer()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Builds the remote server configuration from the environment.
- **Input:** `env`: environment variables.
- **Output:** `RemoteServerConfig` with port (default 8080) and `OAuthSettings`.
- **Effects:** None (pure).
- **Errors:** Those of `readPublicUrl` and `parseSealKey`.

### `readNodeBody`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `async readNodeBody(req: IncomingMessage): Promise<Buffer | null>`
- **Used by:** `serveNodeRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Reads the body of a Node request.
- **Input:** `req`: request.
- **Output:** `Buffer`; `null` if it exceeds `MAX_BODY_BYTES`.
- **Effects:** Consumes the request stream.
- **Errors:** None.

### `toWebRequest`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `toWebRequest(req: IncomingMessage, body: Buffer, origin: string): Request`
- **Used by:** `serveNodeRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Converts the Node request into a `Request` with the public origin.
- **Input:** `req`; `body`: body read; `origin`: public URL.
- **Output:** `Request` (no body on GET/HEAD).
- **Effects:** None (pure).
- **Errors:** None.

### `writeWebResponse`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `async writeWebResponse(res: ServerResponse, response: Response): Promise<void>`
- **Used by:** `serveNodeRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Writes a `Response` to the Node response.
- **Input:** `res`: Node response; `response`.
- **Output:** Empty promise.
- **Effects:** Writes status, headers and body to the socket.
- **Errors:** None.

### `serveNodeRequest`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `async serveNodeRequest(options: NodeServerOptions, req: IncomingMessage, res: ServerResponse): Promise<void>`
- **Used by:** `startRemoteHttpServer()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Handles a Node request with the handler.
- **Input:** `options`: handler and origin; `req`; `res`.
- **Output:** Empty promise.
- **Effects:** Reads the body, writes the response; logs errors to stderr.
- **Errors:** None: a large body becomes 413 and a handler error becomes 500.

### `startRemoteHttpServer`

<!-- generated:start -->

- **File:** `src/remote/node-server.ts`
- **Signature:** `startRemoteHttpServer(options: NodeServerOptions): Server`
- **Used by:** `startCanvasRemoteServer()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Starts the `node:http` server with the handler.
- **Input:** `options`: handler, public origin and port (0 = any free one).
- **Output:** The listening `Server`.
- **Effects:** Opens a TCP port.
- **Errors:** None.

## `src/remote/oauth.ts`

### `oauthError`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `oauthError(error: string, description: string): OAuthResult<T>`
- **Used by:** `parseAuthorizeQuery()`, `readCodeChallenge()`, `redeemAuthorizationCode()`, `redeemRefreshToken()`, `redeemTokenRequest()`, `registerClient()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Builds an OAuth error result.
- **Input:** `error`: OAuth code; `description`: explanation.
- **Output:** `OAuthResult` with `ok: false`.
- **Effects:** None (pure).
- **Errors:** None.

### `authorizationServerMetadata`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `authorizationServerMetadata(issuer: string): Record<string, unknown>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Builds the authorization server metadata (RFC 8414).
- **Input:** `issuer`: public URL.
- **Output:** Object with endpoints, PKCE S256 and public client.
- **Effects:** None (pure).
- **Errors:** None.

### `protectedResourceMetadata`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `protectedResourceMetadata(issuer: string): Record<string, unknown>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Builds the protected resource metadata for `/mcp` (RFC 9728).
- **Input:** `issuer`: public URL.
- **Output:** Object with `resource` and `authorization_servers`.
- **Effects:** None (pure).
- **Errors:** None.

### `isAllowedRedirect`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `isAllowedRedirect(uri: string, hosts: readonly string[]): boolean`
- **Used by:** `checkClientRegistration()`, `registerClient()`
- **Processes:** P08, P10

<!-- generated:end -->

- **Does:** Says whether an OAuth return address is accepted.
- **Input:** `uri`: address; `hosts`: allowed hosts.
- **Output:** `true` for https on a listed host (or subdomain), or http on localhost/127.0.0.1 when `localhost` is in the list.
- **Effects:** None (pure).
- **Errors:** None.

### `pkceChallenge`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `pkceChallenge(verifier: string): string`
- **Used by:** `beginGoogleSignIn()`, `redeemAuthorizationCode()`, `startAccountLink()`
- **Processes:** P08, P10, P11

<!-- generated:end -->

- **Does:** Computes the PKCE S256 challenge of a verifier.
- **Input:** `verifier`: `code_verifier`.
- **Output:** SHA-256 in base64url.
- **Effects:** None (pure).
- **Errors:** None.

### `readRedirectUris`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `readRedirectUris(body: unknown): string[] | null`
- **Used by:** `checkClientRegistration()`, `clientRedirectUris()`, `registerClient()`
- **Processes:** P08, P10, P13

<!-- generated:end -->

- **Does:** Extracts `redirect_uris` from an object.
- **Input:** `body`: registration body or sealed content.
- **Output:** List of strings; `null` if missing, empty or with non-string items.
- **Effects:** None (pure).
- **Errors:** None.

### `registerClient`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `registerClient(body: unknown, settings: OAuthSettings, now: number): OAuthResult<ClientRegistration>`
- **Used by:** `handleRegister()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Registers an OAuth client by sealing the return addresses into the `client_id`.
- **Input:** `body`: JSON registration body; `settings`; `now`: Unix seconds.
- **Output:** `ClientRegistration`, or an `invalid_redirect_uri` error.
- **Effects:** Generates random bytes (seal).
- **Errors:** None.

### `clientRedirectUris`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `clientRedirectUris(clientId: string, settings: OAuthSettings, now: number): string[] | null`
- **Used by:** `parseAuthorizeQuery()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Reads the return addresses of a `client_id` from this server.
- **Input:** `clientId`; `settings`; `now`.
- **Output:** List of addresses; `null` if the client is not from this server or has expired.
- **Effects:** None (pure).
- **Errors:** None.

### `parseAuthorizeQuery`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `parseAuthorizeQuery(query: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<AuthorizeRequest>`
- **Used by:** `handleAuthorizePage()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Validates the `/authorize` query.
- **Input:** `query`: parameters; `settings`; `now`.
- **Output:** `AuthorizeRequest`, or an `invalid_client`, `invalid_request` or `unsupported_response_type` error.
- **Effects:** None (pure).
- **Errors:** None.

### `readCodeChallenge`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `readCodeChallenge(query: URLSearchParams): OAuthResult<string>`
- **Used by:** `parseAuthorizeQuery()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Checks `response_type=code` and PKCE S256 in the query.
- **Input:** `query`: `/authorize` parameters.
- **Output:** The `code_challenge`, or an OAuth error.
- **Effects:** None (pure).
- **Errors:** None.

### `readOAuthSettings`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `readOAuthSettings(env: EnvVars, issuer: string): OAuthSettings`
- **Used by:** `createWhatsAppApps()`, `createWorkerApp()`, `readRemoteServerConfig()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Builds the OAuth configuration from the environment with the given issuer.
- **Input:** `env`: variables (`SEAL_KEY`, `OAUTH_REDIRECT_HOSTS`); `issuer`: public URL.
- **Output:** `OAuthSettings`; default hosts `DEFAULT_REDIRECT_HOSTS` if the variable is not set.
- **Effects:** None (pure).
- **Errors:** Those of `parseSealKey` (missing key or wrong size).

### `resolveIssuer`

<!-- generated:start -->

- **File:** `src/remote/oauth.ts`
- **Signature:** `resolveIssuer(env: EnvVars, origin: string): string`
- **Used by:** `createWhatsAppApps()`, `createWorkerApp()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** OAuth issuer: `PUBLIC_URL` without trailing slash or, without it, the request origin (e.g. `*.workers.dev`).
- **Input:** `env` and the request origin.
- **Output:** Issuer URL, without trailing slash.
- **Effects:** None (pure).
- **Errors:** None.

## `src/remote/seal.ts`

### `parseSealKey`

<!-- generated:start -->

- **File:** `src/remote/seal.ts`
- **Signature:** `parseSealKey(raw: string | null, name = 'SEAL_KEY'): Buffer`
- **Used by:** `readGmailSettings()`, `readOAuthSettings()`
- **Processes:** P08, P10, P12, P13

<!-- generated:end -->

- **Does:** Decodes the `SEAL_KEY` (base64 or base64url) and requires 32 bytes.
- **Input:** `raw`: the variable's value (or null).
- **Output:** 32-byte `Buffer`.
- **Effects:** None (pure).
- **Errors:** Throws if missing (with the command to generate one) or of the wrong size.

### `sealPayload`

<!-- generated:start -->

- **File:** `src/remote/seal.ts`
- **Signature:** `sealPayload(payload: unknown, key: Buffer): string`
- **Used by:** `issueAuthorizationCode()`, `issueLinkUrl()`, `issuePairCsrf()`, `issueTokenSet()`, `openPairSession()`, `registerClient()`, `sealAuthorizeRequest()`, `sealOwnerAccounts()`, `startAccountLink()`, `startPairLogin()`
- **Processes:** P08, P10, P11, P12, P13, P15, P18

<!-- generated:end -->

- **Does:** Seals a JSON value with AES-256-GCM.
- **Input:** `payload`: serializable value; `key`: 32-byte key.
- **Output:** base64url text with `iv + tag + cifra`.
- **Effects:** Generates random bytes (IV).
- **Errors:** None.

### `unsealPayload`

<!-- generated:start -->

- **File:** `src/remote/seal.ts`
- **Signature:** `unsealPayload(sealed: string, key: Buffer): Record<string, unknown> | null`
- **Used by:** `openSealed()`
- **Processes:** P08, P09, P10, P11, P12, P13, P14, P15, P18

<!-- generated:end -->

- **Does:** Opens a seal and returns the object inside.
- **Input:** `sealed`: sealed text; `key`: key.
- **Output:** Object; `null` if the key does not match, the text was tampered with or it is not an object.
- **Effects:** None (pure).
- **Errors:** None (decryption errors become `null`).

### `openSealed`

<!-- generated:start -->

- **File:** `src/remote/seal.ts`
- **Signature:** `openSealed(sealed: string, key: Buffer, expected: SealExpectation): SealedClaims | null`
- **Used by:** `clientRedirectUris()`, `isTrustedPost()`, `isValidPairLogin()`, `openAuthorizeRequest()`, `openOwnerAccounts()`, `readAccessSecret()`, `readPairSession()`, `redeemAuthorizationCode()`, `redeemLinkTicket()`, `redeemRefreshToken()`, `takeLinkRequest()`
- **Processes:** P08, P09, P10, P11, P12, P13, P14, P15, P18

<!-- generated:end -->

- **Does:** Opens a not-yet-expired seal of the expected type.
- **Input:** `sealed`; `key`; `expected`: `typ` and instant `now` (Unix seconds).
- **Output:** `SealedClaims`; `null` if invalid, of another type, without a numeric `exp` or expired.
- **Effects:** None (pure).
- **Errors:** None.

## `src/remote/tokens.ts`

### `sealAuthorizeRequest`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `sealAuthorizeRequest(request: AuthorizeRequest, settings: OAuthSettings, now: number): string`
- **Used by:** `loginPageFor()`, `redirectToUpstream()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Seals the authorization request for the login form (15 minutes).
- **Input:** `request`: validated request; `settings`; `now`.
- **Output:** Sealed text of type `pending`.
- **Effects:** Generates random bytes (seal).
- **Errors:** None.

### `openAuthorizeRequest`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `openAuthorizeRequest(sealed: string, settings: OAuthSettings, now: number): AuthorizeRequest | null`
- **Used by:** `handleAuthorizeSubmit()`, `handleUpstreamCallback()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Opens the sealed request coming from the form.
- **Input:** `sealed`; `settings`; `now`.
- **Output:** `AuthorizeRequest`; `null` if invalid or expired.
- **Effects:** None (pure).
- **Errors:** None.

### `issueAuthorizationCode`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `issueAuthorizationCode(grant: ApprovedGrant, settings: OAuthSettings, now: number): string`
- **Used by:** `handleAuthorizeSubmit()`, `handleUpstreamCallback()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Issues the authorization code (5 minutes) bound to client, return address and PKCE.
- **Input:** `grant`: request + secret; `settings`; `now`.
- **Output:** Sealed code of type `code`.
- **Effects:** Generates random bytes (seal).
- **Errors:** None.

### `issueTokenSet`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `issueTokenSet(secret: string, settings: OAuthSettings, now: number): TokenSet`
- **Used by:** `redeemTokenRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Issues an access token (1 hour) and a refresh token (30 days) for a secret.
- **Input:** `secret`: user credential; `settings`; `now`.
- **Output:** Bearer-type `TokenSet`.
- **Effects:** Generates random bytes (seals).
- **Errors:** None.

### `redeemAuthorizationCode`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `redeemAuthorizationCode(form: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<string>`
- **Used by:** `redeemTokenRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Checks the code against client, return address and PKCE verifier.
- **Input:** `form`: `/token` body; `settings`; `now`.
- **Output:** The sealed secret, or an `invalid_grant` error.
- **Effects:** None (pure).
- **Errors:** None.

### `redeemRefreshToken`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `redeemRefreshToken(form: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<string>`
- **Used by:** `redeemTokenRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Checks the refresh token.
- **Input:** `form`: `/token` body; `settings`; `now`.
- **Output:** The sealed secret, or an `invalid_grant` error.
- **Effects:** None (pure).
- **Errors:** None.

### `redeemTokenRequest`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `redeemTokenRequest(form: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<RedeemedGrant>`
- **Used by:** `handleToken()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Handles `/token` according to `grant_type`.
- **Input:** `form`: `/token` body; `settings`; `now`.
- **Output:** `RedeemedGrant` (new `TokenSet`, the secret and whether it came from a refresh), or an `invalid_grant`/`unsupported_grant_type` error.
- **Effects:** Generates random bytes (seals).
- **Errors:** None.

### `readAccessSecret`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `readAccessSecret(authorization: string | null, settings: OAuthSettings, now: number): string | null`
- **Used by:** `handleMcp()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Reads the secret from an `Authorization: Bearer` header.
- **Input:** `authorization`: header (or null); `settings`; `now`.
- **Output:** The secret; `null` without Bearer, with a token of another type or expired.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/worker.ts`

### `createWorkerApp`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/worker.ts`
- **Signature:** `createWorkerApp(env: EnvVars, origin: string): RemoteApp`
- **Used by:** `handleWorkerFetch()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Builds the remote Canvas app for the Worker.
- **Input:** `env`: text variables; `origin`: request origin (issuer when there is no `PUBLIC_URL`).
- **Output:** `RemoteApp` with OAuth, the Canvas connector and a clock in seconds.
- **Effects:** None (pure).
- **Errors:** Those of `readOAuthSettings` (no `SEAL_KEY`).

### `handleWorkerFetch`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/worker.ts`
- **Signature:** `async handleWorkerFetch(request: Request, env: Readonly<Record<string, unknown>>): Promise<Response>`
- **Used by:** `connectors/canvas-puc/src/worker.ts (module)`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Handles a request on Cloudflare Workers.
- **Input:** `request`; `env`: Worker environment.
- **Output:** Response from the remote handler; 500 with the explanation if the configuration is invalid.
- **Effects:** Those of the remote handler (network to Canvas).
- **Errors:** None: an invalid configuration becomes 500.

## `connectors/canvas-puc/src/files.ts`

### `fileContentBlock`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `fileContentBlock(file: CanvasAttachment, bytes: Uint8Array): CallToolResult['content'][number]`
- **Used by:** `downloadedFileResult()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the MCP block with the file content: `image` for `image/*`, embedded `resource` (blob) for the rest.
- **Input:** `file`: Canvas file; `bytes`: content.
- **Output:** MCP content block.
- **Effects:** None (pure).
- **Errors:** None.

### `downloadedFileResult`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `downloadedFileResult(file: CanvasAttachment, bytes: Uint8Array): RawToolResult`
- **Used by:** `downloadCanvasFile()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the `download_file` result: one line with name, type, size and link, and the content block.
- **Input:** `file`; `bytes`.
- **Output:** `RawToolResult`.
- **Effects:** None (pure).
- **Errors:** None.

### `downloadRefusal`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `downloadRefusal(file: CanvasAttachment): string | null`
- **Used by:** `downloadCanvasFile()`, `streamCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Decides whether the file cannot be brought into the conversation: no link or above `MAX_DOWNLOAD_BYTES`.
- **Input:** `file`: Canvas file.
- **Output:** Message in Portuguese with the reason (and the link, if any), or `null` if it can be downloaded.
- **Effects:** None (pure).
- **Errors:** None.

### `downloadCanvasFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `async downloadCanvasFile(client: CanvasClient, file: CanvasAttachment): Promise<RawToolResult | string>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Downloads the file and returns its content to the conversation, or the reason for not downloading it.
- **Input:** `client`: Canvas client; `file`: metadata from `/files/:id`.
- **Output:** Promise with a `RawToolResult` or a message.
- **Effects:** Network (file download).
- **Errors:** Passes download errors through.

### `readCanvasFileText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `async readCanvasFileText(client: CanvasClient, file: CanvasAttachment): Promise<string>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Reads a Canvas file as text: plain text, HTML (converted) or Word (.doc/.docx); other types return the link and suggest `download_file`.
- **Input:** `client`; `file`: metadata from `/files/:id`.
- **Output:** Promise with `# nome` and the text (up to `MAX_TEXT_CHARS`), or the message with the link.
- **Effects:** Network (file download).
- **Errors:** Passes through download and Word extraction errors.

### `fileMimeType`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `fileMimeType(file: CanvasAttachment): string`
- **Used by:** `fileContentBlock()`, `streamCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Picks the MIME type of a Canvas file.
- **Input:** `file` (`CanvasAttachment`).
- **Output:** Its `content-type`, or `application/octet-stream`.
- **Effects:** None.
- **Errors:** None.

### `describeDownloadedFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `describeDownloadedFile(file: CanvasAttachment, size: number): string`
- **Used by:** `downloadedFileResult()`, `streamCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Writes the description line of a downloaded file.
- **Input:** `file` (`CanvasAttachment`); `size` in bytes.
- **Output:** `"<name>" (<type>, <n> KB). Link: <url>`.
- **Effects:** None.
- **Errors:** None.

### `tooLargeMessage`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `tooLargeMessage(name: string, size: number, url: string): string`
- **Used by:** `downloadRefusal()`, `fetchFileBytes()`, `streamCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Writes the refusal for a file above `MAX_DOWNLOAD_BYTES`, pointing to the link.
- **Input:** `name`; `size` in bytes; `url`.
- **Output:** Message with the size in MB and the 70 MB limit.
- **Effects:** None.
- **Errors:** None.

### `openCanvasFileStream`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `async openCanvasFileStream(client: CanvasClient, url: string): Promise<{ readonly body: ReadableStream<Uint8Array>; readonly size: number } | null>`
- **Used by:** `streamCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Opens a Canvas file download without reading it and checks the declared size.
- **Input:** `client`; `url` of the download.
- **Output:** `{ body, size }` (`size` from `content-length`, 0 if absent); `null` without a body or above `MAX_DOWNLOAD_BYTES` (body cancelled).
- **Effects:** HTTP GET to the file URL.
- **Errors:** Rejects like `fetchDownload()` (non-2xx, network).

### `streamCanvasFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `async streamCanvasFile(client: CanvasClient, file: CanvasAttachment): Promise<StreamedToolContent | null>`
- **Used by:** `streamCanvasTool()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Streams a Canvas file for the remote server, capped at `MAX_DOWNLOAD_BYTES` whatever Canvas declares (ADR 0023).
- **Input:** `client`; `file` (`CanvasAttachment`).
- **Output:** `StreamedToolContent` (description, MIME type, URI, capped body); `null` when `downloadRefusal()` refuses or the download is declared too large, so the regular tool answers.
- **Effects:** HTTP GET to the file URL.
- **Errors:** Rejects like `fetchDownload()`; the body errors with `tooLargeMessage()` if it passes the cap.

## `src/core/cfb.ts`

### `isCfb`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `isCfb(bytes: Uint8Array): boolean`
- **Used by:** `readCfbHeader()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Says whether the bytes start with the OLE/CFB signature (`CFB_SIGNATURE`).
- **Input:** `bytes`: file.
- **Output:** `true` if it is CFB.
- **Effects:** None (pure).
- **Errors:** None.

### `readCfbHeader`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `readCfbHeader(bytes: Uint8Array): CfbHeader`
- **Used by:** `openCfb()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Reads from the 512-byte header the sector sizes and the start of the directory, the mini FAT and the DIFAT.
- **Input:** `bytes`: CFB file.
- **Output:** `CfbHeader`.
- **Effects:** None (pure).
- **Errors:** Throws "File is not an Office (OLE) document." without the signature.

### `cfbSector`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `cfbSector(bytes: Uint8Array, header: CfbHeader, id: number): Uint8Array`
- **Used by:** `fatSectorIds()`, `openCfb()`, `readRegularChain()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Slices a regular sector by id (sector 0 comes right after the header).
- **Input:** `bytes`; `header`; `id`: sector number.
- **Output:** The sector's `Uint8Array`.
- **Effects:** None (pure).
- **Errors:** None.

### `sectorWords`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `sectorWords(sector: Uint8Array): number[]`
- **Used by:** `fatSectorIds()`, `openCfb()`, `readMiniStream()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Reads a sector as a list of 32-bit little-endian integers (FAT, DIFAT, mini FAT).
- **Input:** `sector`: bytes.
- **Output:** List of numbers.
- **Effects:** None (pure).
- **Errors:** None.

### `fatSectorIds`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `fatSectorIds(bytes: Uint8Array, header: CfbHeader): number[]`
- **Used by:** `openCfb()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Lists the sectors that hold the FAT: the 109 in the header and those in the DIFAT chain.
- **Input:** `bytes`; `header`.
- **Output:** Valid ids (without free/end markers).
- **Effects:** None (pure).
- **Errors:** None.

### `followChain`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `followChain(table: readonly number[], start: number): number[]`
- **Used by:** `readMiniStream()`, `readRegularChain()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Follows a sector chain in the table up to end of chain, without looping.
- **Input:** `table`: FAT or mini FAT; `start`: first sector.
- **Output:** Ids in chain order (empty if `start` is end of chain).
- **Effects:** None (pure).
- **Errors:** None.

### `readRegularChain`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `readRegularChain(file: Omit<CfbFile, 'entries'>, start: number): Uint8Array`
- **Used by:** `openCfb()`, `readCfbStream()`, `readMiniStream()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Reads the bytes of a chain of regular sectors.
- **Input:** `file`: bytes, header and FAT; `start`: first sector.
- **Output:** Concatenated bytes (a multiple of the sector size).
- **Effects:** None (pure).
- **Errors:** None.

### `parseDirectory`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `parseDirectory(dir: Uint8Array): CfbEntry[]`
- **Used by:** `openCfb()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Reads the 128-byte entries of the CFB directory.
- **Input:** `dir`: directory bytes.
- **Output:** List of `CfbEntry` (name, first sector, size).
- **Effects:** None (pure).
- **Errors:** None.

### `openCfb`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `openCfb(bytes: Uint8Array): CfbFile`
- **Used by:** `docToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Opens a CFB file: header, full FAT and directory.
- **Input:** `bytes`: .doc file (or another CFB).
- **Output:** `CfbFile`.
- **Effects:** None (pure).
- **Errors:** Passes through the `readCfbHeader` error.

### `readMiniStream`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `readMiniStream(file: CfbFile, entry: CfbEntry): Uint8Array`
- **Used by:** `readCfbStream()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Reads a small stream through the mini stream (64-byte sectors stored in the root entry), following the mini FAT.
- **Input:** `file`: open CFB; `entry`: the stream.
- **Output:** Bytes (with the leftover of the last mini sector).
- **Effects:** None (pure).
- **Errors:** None.

### `readCfbStream`

<!-- generated:start -->

- **File:** `src/core/cfb.ts`
- **Signature:** `readCfbStream(file: CfbFile, name: string): Uint8Array | null`
- **Used by:** `docToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Reads a stream by name, through the mini stream or the FAT depending on its size.
- **Input:** `file`: open CFB; `name`: stream name (e.g. `WordDocument`).
- **Output:** Stream bytes at the exact size, or `null` if it does not exist.
- **Effects:** None (pure).
- **Errors:** None.

## `src/core/word.ts`

### `docxXmlToText`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `docxXmlToText(xml: string): string`
- **Used by:** `docxToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Converts the .docx body XML into text: joins the `w:t`, turns `w:tab` into a tab, `w:br`/`w:cr` and paragraph ends into line breaks, and decodes the entities.
- **Input:** `xml`: content of `word/document.xml`.
- **Output:** Text trimmed at both ends.
- **Effects:** None (pure).
- **Errors:** None.

### `docxToText`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `async docxToText(bytes: Uint8Array): Promise<string>`
- **Used by:** `wordToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Extracts the text of a .docx (opens the ZIP and reads `word/document.xml`).
- **Input:** `bytes`: .docx file.
- **Output:** Promise with the text.
- **Effects:** None (CPU only).
- **Errors:** Rejects with "Arquivo .docx sem word/document.xml." or with the ZIP errors.

### `cp1252ToString`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `cp1252ToString(bytes: Uint8Array): string`
- **Used by:** `decodePartBody()`, `pieceText()`
- **Processes:** P03, P12, P18

<!-- generated:end -->

- **Does:** Decodes bytes as Windows-1252 (8-bit .doc text).
- **Input:** `bytes`.
- **Output:** Text.
- **Effects:** None (pure).
- **Errors:** None.

### `parsePieceTable`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `parsePieceTable(table: Uint8Array, fcClx: number): DocPiece[]`
- **Used by:** `docToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Reads the piece table (PlcPcd) from the .doc's Clx, skipping the formatting blocks (Prc).
- **Input:** `table`: 0Table/1Table stream; `fcClx`: Clx position (from the FIB).
- **Output:** List of `DocPiece`.
- **Effects:** None (pure).
- **Errors:** Throws ".doc document with an invalid text table." if the Clx has no table.

### `pieceText`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `pieceText(wordDoc: Uint8Array, piece: DocPiece): string`
- **Used by:** `docToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Decodes a text piece: Windows-1252 if the "compressed" bit is set, otherwise UTF-16LE.
- **Input:** `wordDoc`: WordDocument stream; `piece`.
- **Output:** Piece text.
- **Effects:** None (pure).
- **Errors:** None.

### `cleanWordText`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `cleanWordText(raw: string): string`
- **Used by:** `docToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Replaces Word marks with text using `WORD_TEXT_REPLACEMENTS`: strips field codes (keeping the result), paragraphs become line breaks, cells become tabs.
- **Input:** `raw`: raw text of the pieces.
- **Output:** Clean text, trimmed at both ends.
- **Effects:** None (pure).
- **Errors:** None.

### `docToText`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `docToText(bytes: Uint8Array): string`
- **Used by:** `wordToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Extracts the main text of a .doc (Word 97-2003): opens the CFB, reads the FIB and the piece table and decodes each piece, cutting at `ccpText` (no footers or headers).
- **Input:** `bytes`: .doc file.
- **Output:** Text.
- **Effects:** None (pure).
- **Errors:** Throws "The .doc is password-protected.", ".doc file without the WordDocument stream.", ".doc file without the table stream." or the errors of `openCfb`/`parsePieceTable`.

### `wordKind`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `wordKind(contentType: string, name: string): 'docx' | 'doc' | null`
- **Used by:** `readCanvasFileText()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Decides whether the file is a Word document by name or MIME type.
- **Input:** `contentType`: MIME; `name`: file name.
- **Output:** `docx`, `doc` or `null`.
- **Effects:** None (pure).
- **Errors:** None.

### `wordToText`

<!-- generated:start -->

- **File:** `src/core/word.ts`
- **Signature:** `wordToText(kind: 'docx' | 'doc', bytes: Uint8Array): Promise<string>`
- **Used by:** `attachmentBytesToText()`, `readCanvasFileText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Extracts the text of a Word document according to its type.
- **Input:** `kind`: `docx` or `doc`; `bytes`.
- **Output:** Promise with the text.
- **Effects:** None (CPU only).
- **Errors:** Passes through the errors of `docxToText`/`docToText`.

## `src/core/zip.ts`

### `findEndOfCentralDirectory`

<!-- generated:start -->

- **File:** `src/core/zip.ts`
- **Signature:** `findEndOfCentralDirectory(bytes: Uint8Array): number`
- **Used by:** `listZipEntries()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Finds the ZIP end of central directory (EOCD) record, searching backwards.
- **Input:** `bytes`: ZIP file.
- **Output:** EOCD position.
- **Effects:** None (pure).
- **Errors:** Throws "Invalid ZIP file: central directory not found.".

### `listZipEntries`

<!-- generated:start -->

- **File:** `src/core/zip.ts`
- **Signature:** `listZipEntries(bytes: Uint8Array): ZipEntry[]`
- **Used by:** `readZipEntry()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Reads the entries of the ZIP central directory.
- **Input:** `bytes`: ZIP file.
- **Output:** List of `ZipEntry`; stops at the first corrupted entry.
- **Effects:** None (pure).
- **Errors:** Passes through the `findEndOfCentralDirectory` error.

### `zipEntryBytes`

<!-- generated:start -->

- **File:** `src/core/zip.ts`
- **Signature:** `zipEntryBytes(bytes: Uint8Array, entry: ZipEntry): Uint8Array`
- **Used by:** `readZipEntry()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Slices the compressed bytes of an entry, skipping the local header.
- **Input:** `bytes`: ZIP; `entry`: entry.
- **Output:** Compressed `Uint8Array`.
- **Effects:** None (pure).
- **Errors:** None.

### `inflateRaw`

<!-- generated:start -->

- **File:** `src/core/zip.ts`
- **Signature:** `inflateRaw(data: Uint8Array): Promise<Uint8Array>`
- **Used by:** `readZipEntry()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Decompresses raw DEFLATE with `DecompressionStream` (Node 22 and Workers).
- **Input:** `data`: compressed bytes.
- **Output:** Promise with the decompressed bytes.
- **Effects:** None (CPU only).
- **Errors:** Rejects if the data is not valid DEFLATE.

### `readZipEntry`

<!-- generated:start -->

- **File:** `src/core/zip.ts`
- **Signature:** `async readZipEntry(bytes: Uint8Array, name: string): Promise<Uint8Array | null>`
- **Used by:** `docxToText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Reads and decompresses a ZIP entry by name (methods 0 and 8).
- **Input:** `bytes`: ZIP; `name`: entry path.
- **Output:** Promise with the bytes, or `null` if the entry does not exist.
- **Effects:** None (CPU only).
- **Errors:** Rejects with "Unsupported ZIP compression (method N)." for other methods.

### `decompressBytes`

<!-- generated:start -->

- **File:** `src/core/zip.ts`
- **Signature:** `async decompressBytes(data: Uint8Array, format: 'deflate' | 'deflate-raw'): Promise<Uint8Array>`
- **Used by:** `decodePdfStream()`, `inflateRaw()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Decompresses data with `DecompressionStream` in the given format.
- **Input:** `data`: compressed bytes. `format`: `deflate-raw` (raw DEFLATE) or `deflate` (with zlib header).
- **Output:** The decompressed bytes.
- **Effects:** None (pure).
- **Errors:** Propagates the `DecompressionStream` error if the data is corrupted.

## `src/core/bytes.ts`

### `byteView`

<!-- generated:start -->

- **File:** `src/core/bytes.ts`
- **Signature:** `byteView(bytes: Uint8Array): DataView`
- **Used by:** `docToText()`, `findEndOfCentralDirectory()`, `listZipEntries()`, `parseDirectory()`, `parsePieceTable()`, `readCfbHeader()`, `sectorWords()`, `utf16leToString()`, `zipEntryBytes()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Creates a `DataView` over exactly the given byte slice (honors `byteOffset`).
- **Input:** `bytes`: buffer or slice.
- **Output:** `DataView` for little-endian reads.
- **Effects:** None (pure).
- **Errors:** None.

### `concatBytes`

<!-- generated:start -->

- **File:** `src/core/bytes.ts`
- **Signature:** `concatBytes(parts: readonly Uint8Array[]): Uint8Array`
- **Used by:** `readMiniStream()`, `readRegularChain()`, `splitBase64Ready()`
- **Processes:** P03, P09, P12, P14

<!-- generated:end -->

- **Does:** Joins several byte chunks into a new buffer, in order.
- **Input:** `parts`: list of `Uint8Array`.
- **Output:** `Uint8Array` with all the bytes.
- **Effects:** None (pure).
- **Errors:** None.

### `utf16leToString`

<!-- generated:start -->

- **File:** `src/core/bytes.ts`
- **Signature:** `utf16leToString(bytes: Uint8Array): string`
- **Used by:** `parseDirectory()`, `pieceText()`
- **Processes:** P03, P12

<!-- generated:end -->

- **Does:** Decodes UTF-16LE without `TextDecoder` (portable to Workers).
- **Input:** `bytes`: UTF-16LE text.
- **Output:** Text; a stray trailing byte is ignored.
- **Effects:** None (pure).
- **Errors:** None.

### `bytesToBase64`

<!-- generated:start -->

- **File:** `src/core/bytes.ts`
- **Signature:** `bytesToBase64(bytes: Uint8Array): string`
- **Used by:** `base64EncodeStream()`, `binaryContentBlock()`
- **Processes:** P03, P09, P14

<!-- generated:end -->

- **Does:** Encodes bytes as base64 in 32 KB chunks, without `Buffer` (Node and Workers).
- **Input:** `bytes`.
- **Output:** base64 text.
- **Effects:** None (pure).
- **Errors:** None.

## `tools/bundle/bundle.ts`

### `listConnectors`

<!-- generated:start -->

- **File:** `tools/bundle/bundle.ts`
- **Signature:** `listConnectors(rootDir: string): string[]`
- **Used by:** `runBuildCli()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Lists the connectors with a plugin manifest (`.claude-plugin/plugin.json`) in `connectors/`.
- **Input:** `rootDir`: repository root.
- **Output:** Subfolder names in alphabetical order; empty if `connectors/` does not exist.
- **Effects:** Reads the disk.
- **Errors:** Propagates folder read errors.

### `bundleOptions`

<!-- generated:start -->

- **File:** `tools/bundle/bundle.ts`
- **Signature:** `bundleOptions(entry: string, outfile: string): BuildOptions`
- **Used by:** `buildConnector()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Builds the esbuild options to bundle the remote server into an ESM for Node 22.
- **Input:** `entry`: entry file; `outfile`: output file.
- **Output:** `BuildOptions` with bundle, `node22`, no external dependencies, and a banner that defines `require`.
- **Effects:** None (pure).
- **Errors:** None.

### `mcpServerProblems`

<!-- generated:start -->

- **File:** `tools/bundle/bundle.ts`
- **Signature:** `mcpServerProblems(name: string, server: unknown): string[]`
- **Used by:** `pluginMcpProblems()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Checks a server in the plugin's `.mcp.json`: it must be remote (`type: "http"`, `https://` URL, no `command`).
- **Input:** `name`: server name; `server`: value read from the JSON.
- **Output:** List of problems in Portuguese; empty if the server is correct.
- **Effects:** None (pure).
- **Errors:** None.

### `pluginMcpProblems`

<!-- generated:start -->

- **File:** `tools/bundle/bundle.ts`
- **Signature:** `pluginMcpProblems(config: unknown): string[]`
- **Used by:** `buildConnector()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Checks a plugin's whole `.mcp.json`: at least one server, all remote.
- **Input:** `config`: content of `.mcp.json` already parsed as JSON.
- **Output:** List of problems; empty if the configuration is correct.
- **Effects:** None (pure).
- **Errors:** None.

### `isRemoteMcpUrl`

<!-- generated:start -->

- **File:** `tools/bundle/bundle.ts`
- **Signature:** `isRemoteMcpUrl(url: unknown): boolean`
- **Used by:** `mcpServerProblems()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Says whether the URL is remote and fixed (`https://`); rejects `${user_config.*}`, which breaks Connect (ADR 0018).
- **Input:** `url`: value of the server's `url` field in `.mcp.json`.
- **Output:** `true` for `https://...` without `${`; `false` for everything else (including `${user_config.*}` placeholders).
- **Effects:** None (pure).
- **Errors:** None.

## `tools/bundle/cli.ts`

### `buildConnector`

<!-- generated:start -->

- **File:** `tools/bundle/cli.ts`
- **Signature:** `async buildConnector(root: string, name: string): Promise<void>`
- **Used by:** `runBuildCli()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Validates the connector's `.mcp.json`, if any (a self-host plugin has none), and generates the `server/remote.js` bundle, if there is a `src/remote-main.ts`.
- **Input:** `root`: repository root; `name`: connector folder.
- **Output:** Empty promise.
- **Effects:** Reads `.mcp.json`; runs esbuild and writes `server/remote.js`.
- **Errors:** Rejects listing the problems from `pluginMcpProblems()`; propagates read and esbuild errors.

### `runBuildCli`

<!-- generated:start -->

- **File:** `tools/bundle/cli.ts`
- **Signature:** `async runBuildCli(): Promise<void>`
- **Used by:** `tools/bundle/cli.ts (module)`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Entry point of `npm run build`: builds all connectors.
- **Input:** None.
- **Output:** Empty promise; prints "✔ <conector>" per connector.
- **Effects:** Those of `buildConnector()`; writes to the terminal.
- **Errors:** Propagates errors from `buildConnector()`.

## `connectors/gmail/src/access-token.ts`

### `forgetAccessToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `forgetAccessToken(owner: string, email: string): void`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `gmailCall()`, `storeGoogleAccount()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Forgets a user's stored access token for an account.
- **Input:** `owner`: user. `email`: Gmail account.
- **Output:** Nothing.
- **Effects:** Isolate memory: removes the cache entry.
- **Errors:** None.

### `clearAccessTokenCache`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `clearAccessTokenCache(): void`
- **Used by:** —
- **Processes:** —

<!-- generated:end -->

- **Does:** Forgets all stored access tokens.
- **Input:** None.
- **Output:** Nothing.
- **Effects:** Isolate memory: empties the access token cache.
- **Errors:** None.

### `relinkError`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `relinkError(alias: string): Error`
- **Used by:** `getAccessToken()`, `renewAccessToken()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Builds the error for an account that lost Gmail access.
- **Input:** `alias`: account alias.
- **Output:** `Error` telling the user to use `link_account` and sign in again.
- **Effects:** None (pure).
- **Errors:** None.

### `renewAccessToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `async renewAccessToken(deps: OwnerDeps, ref: AccountRef): Promise<string>`
- **Used by:** `getAccessToken()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Renews the account's access token with the refresh token.
- **Input:** `deps`: dependencies with the user. `ref`: account with alias.
- **Output:** The new access token.
- **Effects:** Network: Google token endpoint. Isolate memory: stores the token until 1 min before it expires. KV: marks the account as revoked on `invalid_grant`.
- **Errors:** Throws `relinkError()` on `invalid_grant`; propagates other `GoogleTokenError`s and network errors.

### `getAccessToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `async getAccessToken(deps: OwnerDeps, ref: AccountRef): Promise<string>`
- **Used by:** `accountStatus()`, `gmailCall()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Returns a valid access token for the account.
- **Input:** `deps`: dependencies with the user. `ref`: account with alias.
- **Output:** Access token from memory, or renewed.
- **Effects:** Those of `renewAccessToken()` when there is no valid token in memory.
- **Errors:** Throws `relinkError()` if the account is already revoked; propagates those of `renewAccessToken()`.

### `accessTokenKey`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `accessTokenKey(owner: string, email: string): string`
- **Used by:** `forgetAccessToken()`, `getAccessToken()`, `renewAccessToken()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Builds the access token cache key per user and account.
- **Input:** `owner`: user (`sub`). `email`: Gmail account.
- **Output:** Text that separates user and account.
- **Effects:** None (pure).
- **Errors:** None.

### `markAccountRevoked`

<!-- generated:start -->

- **File:** `connectors/gmail/src/access-token.ts`
- **Signature:** `async markAccountRevoked(deps: OwnerDeps, email: string): Promise<void>`
- **Used by:** `renewAccessToken()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Marks the user's account as revoked in KV.
- **Input:** `deps`: dependencies with the user. `email`: account to mark.
- **Output:** Nothing.
- **Effects:** KV: reads and rewrites the user's record.
- **Errors:** Propagates KV failures.

## `connectors/gmail/src/attachments.ts`

### `looksLikeText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/attachments.ts`
- **Signature:** `looksLikeText(text: string): boolean`
- **Used by:** `detectAttachmentKind()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Tells whether the text looks like real text (no control characters besides spaces and line breaks).
- **Input:** `text`: decoded text; only the first 4096 characters are examined.
- **Output:** True if the sample is not empty and has less than 1% control or replacement characters; false otherwise.
- **Effects:** None (pure).
- **Errors:** None.

### `detectAttachmentKind`

<!-- generated:start -->

- **File:** `connectors/gmail/src/attachments.ts`
- **Signature:** `detectAttachmentKind(bytes: Uint8Array): AttachmentKind`
- **Used by:** `attachmentBytesToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Detects the attachment type from its first bytes or its content.
- **Input:** `bytes`: raw attachment content.
- **Output:** `pdf`, `docx`, `doc`, `html` or `text`; null if it is not a recognized type.
- **Effects:** None (pure).
- **Errors:** None.

### `attachmentBytesToText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/attachments.ts`
- **Signature:** `async attachmentBytesToText(bytes: Uint8Array): Promise<string>`
- **Used by:** `readAttachmentText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Converts the attachment bytes to text according to the detected type.
- **Input:** `bytes`: raw attachment content.
- **Output:** The extracted text; may be empty (e.g. a scanned PDF).
- **Effects:** None (pure).
- **Errors:** Throws if the type is not PDF, Word, HTML or text. Propagates the errors of `pdfToText()` and `wordToText()`.

### `readAttachmentText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/attachments.ts`
- **Signature:** `async readAttachmentText(deps: OwnerDeps, ref: AccountRef, ids: AttachmentIds): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Downloads a Gmail attachment as bounded text.
- **Input:** `deps`: connector dependencies (settings, KV, network, clock). `account`: allowed account. `ids`: the message's `messageId` and the attachment's `attachmentId`.
- **Output:** Object with `account`, `message_id`, `size` and `text` (truncated at 50,000 characters; a notice of non-extractable text when empty).
- **Effects:** Network: Gmail API (and Google token endpoint, if renewing). KV and isolate memory for the access token.
- **Errors:** Throws if the attachment exceeds 5 MB. Propagates the errors of `gmailGet()` and `attachmentBytesToText()`.

### `downloadAttachment`

<!-- generated:start -->

- **File:** `connectors/gmail/src/attachments.ts`
- **Signature:** `async downloadAttachment(deps: OwnerDeps, ref: AccountRef, ids: AttachmentIds): Promise<{ size: number; bytes: Uint8Array }>`
- **Used by:** `forwardAttachments()`, `readAttachmentText()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Downloads an attachment's bytes with the size reported by Gmail.
- **Input:** `deps`, `ref`: account; `ids`: message and attachment.
- **Output:** `{ size, bytes }` (size is Gmail's or the bytes' length).
- **Effects:** Network: Gmail API (and Google token endpoint, if renewing). KV and isolate memory for the access token.
- **Errors:** Propagates the errors of `gmailGet()`.

## `connectors/gmail/src/config.ts`

### `isEmailAddress`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `isEmailAddress(text: string): boolean`
- **Used by:** `parseAllowedEmails()`, `parseMailAddress()`
- **Processes:** P10, P12, P18

<!-- generated:end -->

- **Does:** Tells whether the text looks like a simple email address (`nome@dominio.tld`, no spaces).
- **Input:** `text`: text to check.
- **Output:** True if it has the email format; false otherwise.
- **Effects:** None (pure).
- **Errors:** None.

### `parseAllowedEmails`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `parseAllowedEmails(raw: string | null): string[] | null`
- **Used by:** `readGmailSettings()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Reads the optional `ALLOWED_EMAILS` list.
- **Input:** `raw`: secret value (comma-separated), or null.
- **Output:** Lowercase emails; null if empty (public mode).
- **Effects:** None (pure).
- **Errors:** Throws if any item is not an email.

### `requiredSecret`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `requiredSecret(env: EnvVars, name: string): string`
- **Used by:** `readConsentSecret()`, `readGmailSettings()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Reads a required Worker variable.
- **Input:** `env`: Worker text variables. `name`: variable name.
- **Output:** The variable's value, trimmed.
- **Effects:** None (pure).
- **Errors:** Throws with the `wrangler secret put` command if the variable is missing, empty or a placeholder.

### `readConsentSecret`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `readConsentSecret(env: EnvVars): string`
- **Used by:** `readGmailSettings()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Reads the remembered-consent secret with the required minimum length.
- **Input:** `env`: Worker text variables.
- **Output:** The value of `CONSENT_SECRET`.
- **Effects:** None (pure).
- **Errors:** Throws if the secret has fewer than 32 characters. Propagates the error of `requiredSecret()`.

### `readGmailSettings`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `readGmailSettings(env: EnvVars): GmailSettings`
- **Used by:** `createGmailDeps()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Builds the settings from the Worker secrets.
- **Input:** `env`: text variables and secrets.
- **Output:** `GmailSettings` with Google client, encryption key, optional allowlist and consent secret.
- **Effects:** None (pure).
- **Errors:** Throws saying which secret is missing or invalid.

### `isEmailAllowed`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `isEmailAllowed(settings: GmailSettings, email: string): boolean`
- **Used by:** `completeSignIn()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Tells whether the email may enter the connector.
- **Input:** `settings`: settings. `email`: verified sign-in email.
- **Output:** `true` in public mode; in private mode, only for the emails in `ALLOWED_EMAILS`.
- **Effects:** None (pure).
- **Errors:** None.

### `hasModifyScope`

<!-- generated:start -->

- **File:** `connectors/gmail/src/config.ts`
- **Signature:** `hasModifyScope(scope: string): boolean`
- **Used by:** `accountBase()`, `linkRefusalReason()`, `requireWriteAccess()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Tells whether the granted scopes include `gmail.modify`.
- **Input:** `scope`: space-separated scopes.
- **Output:** `true` if it has exactly `gmail.modify`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/gmail/src/gmail-api.ts`

### `gmailUrl`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `gmailUrl(path: string, params: Readonly<Record<string, GmailQueryValue>> = {}): string`
- **Used by:** `applyLabelChange()`, `connectors/gmail/src/tools.ts (module)`, `createDraft()`, `deleteDraft()`, `downloadAttachment()`, `fetchFullMessage()`, `fetchLabels()`, `fetchThreadMetadata()`, `listDrafts()`, `moveToTrash()`, `searchAccount()`, `sendDraft()`, `sendPrepared()`, `updateDraft()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Builds the URL of a Gmail API path with the given parameters.
- **Input:** `path`: path relative to the account base (e.g. `messages/<id>`). `params`: optional parameters; lists become a repeated parameter.
- **Output:** The full URL; null, undefined or empty parameters are omitted.
- **Effects:** None (pure).
- **Errors:** None.

### `gmailHttpError`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `gmailHttpError(status: number, alias: string, detail: string | null = null): Error`
- **Used by:** `gmailCall()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Builds the actionable error for a Gmail API failure.
- **Input:** `status`: HTTP status. `alias`: account alias.
- **Output:** `Error` with the account and the guidance.
- **Effects:** None (pure).
- **Errors:** None.

### `gmailGet`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `gmailGet(deps: OwnerDeps, ref: AccountRef, url: string): Promise<T>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `downloadAttachment()`, `fetchFullMessage()`, `fetchLabels()`, `fetchThreadMetadata()`, `listDrafts()`, `searchAccount()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Reads a Gmail API resource as JSON, retrying after a 401.
- **Input:** `deps`: dependencies with the user. `ref`: account. `url`: Gmail API URL.
- **Output:** The JSON body.
- **Effects:** Network: Gmail API and, if renewing, Google. Isolate memory: forgets the token after a 401.
- **Errors:** Throws `gmailHttpError()` if the final response fails; propagates those of `getAccessToken()`.

### `gmailErrorDetail`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `async gmailErrorDetail(response: Response): Promise<string | null>`
- **Used by:** `gmailCall()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Reads `error.message` from a Gmail API error response, limited to 200 characters.
- **Input:** `response`: failed response.
- **Output:** The detail, or null.
- **Effects:** Consumes the response body.
- **Errors:** None: an invalid body becomes null.

### `sendGmailRequest`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `sendGmailRequest(deps: GmailDeps, request: GmailRequest, token: string): Promise<Response>`
- **Used by:** `gmailCall()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Sends an authenticated request to the Gmail API (method, JSON body, token, User-Agent).
- **Input:** `deps`; `request`: URL, method and body; `token`: access token.
- **Output:** The `Response`.
- **Effects:** Network: Gmail API.
- **Errors:** Propagates network failures.

### `readGmailJson`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `async readGmailJson(response: Response): Promise<T>`
- **Used by:** `gmailCall()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Reads the JSON of a successful response; an empty body becomes an empty object.
- **Input:** `response`: 2xx response.
- **Output:** The typed JSON, or `{}`.
- **Effects:** Consumes the response body.
- **Errors:** Throws if the body is not JSON.

### `gmailCall`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `async gmailCall(deps: OwnerDeps, ref: AccountRef, request: GmailRequest): Promise<T>`
- **Used by:** `gmailGet()`, `gmailWrite()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Makes a Gmail API request and reads the JSON; after a 401 it renews the token and tries once more.
- **Input:** `deps`, `ref`: account; `request`: URL, method and body.
- **Output:** The response JSON.
- **Effects:** Network: Gmail API (and Google token endpoint, if renewing). KV and isolate memory for the access token.
- **Errors:** Throws `gmailHttpError()` (with the Gmail detail) on HTTP failure; propagates those of `getAccessToken()`.

### `gmailWrite`

<!-- generated:start -->

- **File:** `connectors/gmail/src/gmail-api.ts`
- **Signature:** `async gmailWrite(deps: OwnerDeps, ref: AccountRef, request: GmailRequest): Promise<T>`
- **Used by:** `applyLabelChange()`, `createDraft()`, `deleteDraft()`, `moveToTrash()`, `sendDraft()`, `sendPrepared()`, `updateDraft()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Writes to the Gmail API, first requiring the account's `gmail.modify` scope.
- **Input:** `deps`, `ref`: account; `request`: write request.
- **Output:** The response JSON.
- **Effects:** Network: Gmail API (and Google token endpoint, if renewing). KV and isolate memory for the access token.
- **Errors:** Throws `writeAccessError()` for a read-only account; propagates the errors of `gmailCall()`.

## `connectors/gmail/src/google-oauth.ts`

### `googleRedirectUri`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `googleRedirectUri(origin: string): string`
- **Used by:** `beginGoogleSignIn()`, `exchangeGoogleCode()`, `startAccountLink()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Builds the Google redirect URI for the Worker origin.
- **Input:** `origin`: public Worker origin, without trailing slash.
- **Output:** The URL `<origin>/google/callback`.
- **Effects:** None (pure).
- **Errors:** None.

### `googleAuthorizeUrl`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `googleAuthorizeUrl(params: GoogleAuthorizeParams): string`
- **Used by:** `beginGoogleSignIn()`, `startAccountLink()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Builds the Google authorization URL.
- **Input:** `params`: client, redirect URI, scopes, `state`, PKCE challenge, `nonce` and `offline` (requests a refresh token and new consent).
- **Output:** The authorization URL with PKCE S256 and account selection.
- **Effects:** None (pure).
- **Errors:** None.

### `randomToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `randomToken(bytes = 32): string`
- **Used by:** `beginGoogleSignIn()`, `completeSignIn()`, `issueLinkUrl()`, `mimeBoundary()`, `startAccountLink()`
- **Processes:** P10, P11, P18

<!-- generated:end -->

- **Does:** Generates a random base64url string (state, nonce, PKCE verifier).
- **Input:** `bytes`: entropy bytes; default 32.
- **Output:** The random base64url string.
- **Effects:** Reads the cryptographic random generator.
- **Errors:** None.

### `parseGoogleTokens`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `parseGoogleTokens(body: unknown): GoogleTokens`
- **Used by:** `postGoogleToken()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Validates the success JSON from the Google token endpoint.
- **Input:** `body`: response JSON body, of any shape.
- **Output:** The tokens; `expiresIn` is 3600 if missing, refresh token and `id_token` null if missing, empty scope if missing.
- **Effects:** None (pure).
- **Errors:** Throws `GoogleTokenError` (`invalid_response`) if the access token is missing.

### `googleErrorCode`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `async googleErrorCode(response: Response): Promise<string>`
- **Used by:** `postGoogleToken()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Extracts the OAuth error code from a Google failure response.
- **Input:** `response`: failed HTTP response.
- **Output:** The body's `error` field; `http_<status>` if the body is not JSON or has no `error`.
- **Effects:** Consumes the response body.
- **Errors:** None.

### `postGoogleToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `async postGoogleToken(deps: GmailDeps, form: Readonly<Record<string, string>>): Promise<GoogleTokens>`
- **Used by:** `exchangeGoogleCode()`, `refreshGoogleToken()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Sends a form to the Google token endpoint with the client credentials.
- **Input:** `deps`: connector dependencies (settings, network). `form`: request fields (grant type and its data).
- **Output:** The validated tokens.
- **Effects:** Network: Google token endpoint.
- **Errors:** Throws `GoogleTokenError` with Google's code if the response is not successful. Propagates the errors of `parseGoogleTokens()` and network errors.

### `exchangeGoogleCode`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `exchangeGoogleCode(deps: GmailDeps, code: string, verifier: string): Promise<GoogleTokens>`
- **Used by:** `completeSignIn()`, `linkFromCode()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Exchanges the Google authorization code (with the PKCE verifier) for tokens.
- **Input:** `deps`: connector dependencies (settings, origin, network). `code`: code received on the callback. `verifier`: PKCE verifier from the authorization.
- **Output:** The validated tokens.
- **Effects:** Network: Google token endpoint.
- **Errors:** Propagates the errors of `postGoogleToken()`.

### `refreshGoogleToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `refreshGoogleToken(deps: GmailDeps, refreshToken: string): Promise<GoogleTokens>`
- **Used by:** `renewAccessToken()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Renews the access token with the stored refresh token.
- **Input:** `deps`: connector dependencies (settings, network). `refreshToken`: the account's refresh token.
- **Output:** The validated tokens.
- **Effects:** Network: Google token endpoint.
- **Errors:** Propagates the errors of `postGoogleToken()` (`invalid_grant` when access was revoked).

### `revokeGoogleToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `async revokeGoogleToken(deps: GmailDeps, token: string): Promise<boolean>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Revokes the refresh token at Google.
- **Input:** `deps`: dependencies. `token`: refresh token.
- **Output:** `true` if Google confirmed; `false` if it refused or the network failed.
- **Effects:** Network: Google revocation endpoint.
- **Errors:** None (a failure returns `false`).

## `connectors/gmail/src/id-token.ts`

### `decodeJwtJson`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `decodeJwtJson(part: string): Record<string, unknown>`
- **Used by:** `decodeJwt()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Decodes a base64url JSON segment into an object.
- **Input:** `part`: JWT header or payload in base64url.
- **Output:** The decoded object.
- **Effects:** None (pure).
- **Errors:** Throws if the JSON is not an object. Propagates the `SyntaxError` of invalid JSON.

### `decodeJwt`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `decodeJwt(token: string): DecodedJwt`
- **Used by:** `verifyGoogleIdToken()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Splits and decodes a JWT (`header.payload.assinatura`).
- **Input:** `token`: compact JWT.
- **Output:** Header, payload, signed text and signature bytes.
- **Effects:** None (pure).
- **Errors:** Throws if the token does not have three parts. Propagates the errors of `decodeJwtJson()`.

### `idTokenProblems`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `idTokenProblems(payload: Readonly<Record<string, unknown>>, expected: IdTokenExpectation): string[]`
- **Used by:** `checkIdTokenClaims()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Lists the `id_token` checks that failed.
- **Input:** `payload`: `id_token` claims. `expected`: client, `nonce` and current instant in Unix seconds.
- **Output:** Names of the failed checks (issuer, audience, expiry, nonce, verified email); empty when all pass.
- **Effects:** None (pure).
- **Errors:** None.

### `checkIdTokenClaims`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `checkIdTokenClaims(payload: Readonly<Record<string, unknown>>, expected: IdTokenExpectation): GoogleIdentity`
- **Used by:** `verifyGoogleIdToken()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Checks the `id_token` claims.
- **Input:** `payload`: claims. `expected`: client, `nonce` and current instant.
- **Output:** `GoogleIdentity` with `sub` and lowercase email.
- **Effects:** None (pure).
- **Errors:** Throws listing the checks that failed.

### `fetchGoogleKey`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `async fetchGoogleKey(deps: GmailDeps, kid: string): Promise<webcrypto.JsonWebKey>`
- **Used by:** `verifyGoogleIdToken()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Fetches the Google public key with the given `kid`.
- **Input:** `deps`: connector dependencies (network). `kid`: key identifier in the JWT header.
- **Output:** The public key in JWK format.
- **Effects:** Network: Google JWKS.
- **Errors:** Throws if the response is not successful or the key does not exist. Propagates network failures.

### `verifyRs256`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `async verifyRs256(jwt: DecodedJwt, jwk: webcrypto.JsonWebKey): Promise<boolean>`
- **Used by:** `verifyGoogleIdToken()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Checks the JWT's RS256 signature with the given public key.
- **Input:** `jwt`: decoded JWT. `jwk`: RSA public key in JWK format.
- **Output:** True if the signature matches; false otherwise.
- **Effects:** None (pure).
- **Errors:** Propagates the error of `crypto.subtle.importKey` if the key is invalid.

### `verifyGoogleIdToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/id-token.ts`
- **Signature:** `async verifyGoogleIdToken(deps: GmailDeps, idToken: string, nonce: string): Promise<GoogleIdentity>`
- **Used by:** `completeSignIn()`, `linkFromCode()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Validates the Google `id_token`.
- **Input:** `deps`: dependencies. `idToken`: JWT. `nonce`: expected value.
- **Output:** Verified `GoogleIdentity`.
- **Effects:** Network: Google JWKS.
- **Errors:** Throws on invalid algorithm, key, signature or claims.

## `connectors/gmail/src/link-flow.ts`

### `linkRequestKey`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `linkRequestKey(state: string): string`
- **Used by:** `startAccountLink()`, `takeLinkRequest()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Builds the KV key of the link request.
- **Input:** `state`: link `state`, received or generated.
- **Output:** Text `link:<sha256 do state>`.
- **Effects:** None (pure).
- **Errors:** None.

### `readCookie`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `readCookie(header: string | null, name: string): string | null`
- **Used by:** `takeLinkRequest()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Reads a cookie value from the `Cookie` header.
- **Input:** `header`: `Cookie` header value, or null. `name`: exact cookie name.
- **Output:** Cookie value (may contain `=`), or null if the header is missing or lacks the cookie.
- **Effects:** None (pure).
- **Errors:** None.

### `linkCookie`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `linkCookie(value: string | null): string`
- **Used by:** `finishAccountLink()`, `startAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Builds the link `Set-Cookie` header.
- **Input:** `value`: cookie value, or null to delete it.
- **Output:** `Set-Cookie` text for `__Host-gmail-link` (`Secure`, `HttpOnly`, `SameSite=Lax`), with `Max-Age` of 600 s, or 0 when `value` is null.
- **Effects:** None (pure).
- **Errors:** None.

### `startAccountLink`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async startAccountLink(deps: GmailDeps, request: Request): Promise<Response>`
- **Used by:** `connectors/gmail/src/worker.ts (module)`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Redeems the ticket and sends the browser to Google to link the account.
- **Input:** `deps`: dependencies. `request`: request to `/accounts/link?ticket=...`.
- **Output:** 302 to Google with the link cookie; 400 page without a valid ticket.
- **Effects:** KV: marks the ticket and stores the sealed request (10 minutes). Sets the `__Host-gmail-link` cookie.
- **Errors:** Propagates KV failures.

### `takeLinkRequest`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async takeLinkRequest(deps: GmailDeps, request: Request): Promise<LinkRequest | null>`
- **Used by:** `finishAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Retrieves and deletes the link request on the return from Google.
- **Input:** `deps`: dependencies. `request`: Google callback with `state` and cookie.
- **Output:** User, verifier and `nonce`; null if absent, expired or from another browser.
- **Effects:** KV: reads and deletes the request (single use).
- **Errors:** Propagates KV failures.

### `linkFromCode`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async linkFromCode(deps: GmailDeps, code: string, link: LinkRequest): Promise<Response>`
- **Used by:** `linkSafely()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Exchanges the Google code and stores the account under the ticket's user.
- **Input:** `deps`: dependencies. `code`: Google code. `link`: retrieved request (user, verifier, `nonce`).
- **Output:** Success page, or 400 page without `id_token` or without Gmail permission.
- **Effects:** Network: Google tokens and JWKS. KV: stores the account.
- **Errors:** Propagates failures of the exchange, the `id_token` and the account limit (handled by `linkSafely()`).

### `linkSafely`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async linkSafely(deps: GmailDeps, code: string, link: LinkRequest): Promise<Response>`
- **Used by:** `finishAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Runs `linkFromCode()`, turning failures into an error page.
- **Input:** `deps`: connector dependencies. `code`: Google code. `link`: retrieved link request.
- **Output:** The page from `linkFromCode()`, or a 400 page with the error message.
- **Effects:** Those of `linkFromCode()` (network with Google; stores the account in KV when allowed).
- **Errors:** None: any failure becomes a 400 page and nothing is stored.

### `finishAccountLink`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async finishAccountLink(deps: GmailDeps, request: Request): Promise<Response>`
- **Used by:** `connectors/gmail/src/worker.ts (module)`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Handles the Google callback in account linking.
- **Input:** `deps`: dependencies. `request`: callback with `state`, `code` or `error` and the cookie.
- **Output:** Result page, always with the link cookie deleted.
- **Effects:** Those of `takeLinkRequest()` and `linkSafely()`; deletes the cookie.
- **Errors:** None: failures become a 400 page.

### `nowSeconds`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `nowSeconds(deps: GmailDeps): number`
- **Used by:** `issueLinkUrl()`, `redeemLinkTicket()`, `startAccountLink()`, `takeLinkRequest()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Converts the dependencies' clock to Unix seconds.
- **Input:** `deps`: dependencies.
- **Output:** Whole seconds.
- **Effects:** Reads the injected clock.
- **Errors:** None.

### `issueLinkUrl`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `issueLinkUrl(deps: OwnerDeps): string`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Generates the user's single-use link URL.
- **Input:** `deps`: dependencies with the user.
- **Output:** `<origem>/accounts/link?ticket=<selo>`, valid for 10 minutes.
- **Effects:** None (only seals; stores nothing).
- **Errors:** None.

### `redeemLinkTicket`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async redeemLinkTicket(deps: GmailDeps, ticket: string): Promise<string | null>`
- **Used by:** `startAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Redeems the link ticket only once.
- **Input:** `deps`: dependencies. `ticket`: link seal.
- **Output:** The ticket's user; null if invalid, expired or already used.
- **Effects:** KV: reads and writes the `jti` usage mark (valid for 10 minutes).
- **Errors:** Propagates KV failures.

### `invalidTicketPage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `invalidTicketPage(): Response`
- **Used by:** `finishAccountLink()`, `startAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Builds the invalid link URL page.
- **Input:** None.
- **Output:** 400 page telling the user to request another link with `link_account`.
- **Effects:** None (pure).
- **Errors:** None.

### `linkRefusalReason`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `linkRefusalReason(tokens: GoogleTokens): string | null`
- **Used by:** `linkFromCode()`, `linkSignedInAccount()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Tells why the tokens cannot be used to read Gmail.
- **Input:** `tokens`: Google response.
- **Output:** Message if the Gmail scope or the refresh token is missing; null if they are usable.
- **Effects:** None (pure).
- **Errors:** None.

### `storeGoogleAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async storeGoogleAccount(deps: OwnerDeps, email: string, tokens: GoogleTokens): Promise<void>`
- **Used by:** `linkFromCode()`, `linkSignedInAccount()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Stores the Google account among the user's accounts.
- **Input:** `deps`: dependencies with the user. `email`: verified account. `tokens`: Google tokens with refresh token.
- **Output:** Nothing.
- **Effects:** KV: reads and rewrites the user's record. Isolate memory: forgets the old access token.
- **Errors:** Throws the limit error of `upsertAccount()`; propagates KV failures.

## `connectors/gmail/src/message-format.ts`

### `base64UrlToBytes`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `base64UrlToBytes(data: string): Uint8Array`
- **Used by:** `decodePartBody()`, `downloadAttachment()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Decodes base64url into bytes.
- **Input:** `data`: base64url text (Gmail API body or attachment).
- **Output:** Decoded bytes; empty for empty text (invalid characters are ignored).
- **Effects:** None (pure).
- **Errors:** None.

### `partCharset`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `partCharset(part: GmailPart): string`
- **Used by:** `decodePartBody()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Reads the charset declared in a part's `Content-Type`.
- **Input:** `part`: Gmail API MIME part.
- **Output:** Lowercase charset, or `utf-8` if there is none.
- **Effects:** None (pure).
- **Errors:** None.

### `decodePartBody`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `decodePartBody(part: GmailPart): string`
- **Used by:** `messageBodyText()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Converts a MIME part's body to text.
- **Input:** `part`: Gmail API MIME part (base64url body).
- **Output:** Body text: Windows-1252 for Latin charsets and `us-ascii`, UTF-8 for the rest; empty without a body.
- **Effects:** None (pure).
- **Errors:** None.

### `headerValues`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `headerValues(headers: readonly { readonly name: string; readonly value: string }[]): Map<string, string>`
- **Used by:** `forwardedText()`, `forwardEmail()`, `partCharset()`, `pickHeaders()`, `quotedText()`, `replyEmail()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Indexes headers by lowercase name.
- **Input:** `headers`: list of `{ name, value }` headers.
- **Output:** Map of lowercase name → value, with the first of each name; empty for an empty list.
- **Effects:** None (pure).
- **Errors:** None.

### `flattenParts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `flattenParts(part: GmailPart | undefined, depth = 0): GmailPart[]`
- **Used by:** `flattenParts()`, `messageAttachments()`, `messageBodyText()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Flattens the MIME tree depth-first.
- **Input:** `part`: root of the MIME tree, or undefined. `depth`: current depth (default 0; stops above 20).
- **Output:** All parts, root first; empty without a root or beyond depth 20.
- **Effects:** None (pure).
- **Errors:** None.

### `isBodyPart`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `isBodyPart(part: GmailPart, mimeType: string): boolean`
- **Used by:** `messageBodyText()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Tells whether the part is a body of the given type.
- **Input:** `part`: MIME part. `mimeType`: expected type (e.g. `text/plain`).
- **Output:** True if the type matches, there is no filename and the body has data.
- **Effects:** None (pure).
- **Errors:** None.

### `messageBodyText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `messageBodyText(payload: GmailPart | undefined): string`
- **Used by:** `formatMessage()`, `forwardedText()`, `quotedText()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Extracts the message body as plain text.
- **Input:** `payload`: message MIME root, or undefined.
- **Output:** `text/plain` parts joined; without them, the `text/html` parts converted to text; empty without a body.
- **Effects:** None (pure).
- **Errors:** None.

### `messageAttachments`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `messageAttachments(payload: GmailPart | undefined): AttachmentInfo[]`
- **Used by:** `formatMessage()`, `forwardAttachments()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Lists a message's attachments.
- **Input:** `payload`: message MIME root, or undefined.
- **Output:** Attachments (`attachment_id`, `filename`, `mime_type`, `size`) from parts with a name and `attachmentId`; empty if there are none.
- **Effects:** None (pure).
- **Errors:** None.

### `truncateText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `truncateText(text: string, max: number): string`
- **Used by:** `formatMessage()`, `quotedText()`, `readAttachmentText()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Cuts a text at the character limit.
- **Input:** `text`: text to limit. `max`: maximum number of characters kept.
- **Output:** The text intact if it fits; otherwise the first `max` characters and a notice of how many were left out.
- **Effects:** None (pure).
- **Errors:** None.

### `internalDateIso`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `internalDateIso(internalDate: string | undefined): string | null`
- **Used by:** `draftSummary()`, `formatMessage()`, `summarizeThread()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Converts the Gmail API `internalDate` to an ISO 8601 date.
- **Input:** `internalDate`: Unix milliseconds as text, or undefined.
- **Output:** ISO 8601 date, or null if empty or non-numeric.
- **Effects:** None (pure).
- **Errors:** None.

### `pickHeaders`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `pickHeaders(payload: GmailPart | undefined): Record<string, string>`
- **Used by:** `draftSummary()`, `formatMessage()`, `summarizeThread()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Picks out the message's useful headers.
- **Input:** `payload`: message MIME root, or undefined.
- **Output:** Object with the `from`, `to`, `cc`, `date` and `subject` present; empty if there are none.
- **Effects:** None (pure).
- **Errors:** None.

### `formatMessage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `formatMessage(message: GmailMessage, format: MessageFormat, maxChars = MAX_MESSAGE_CHARS): Record<string, unknown>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `formatThread()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Converts a Gmail API message into a lean object.
- **Input:** `message`: Gmail API message. `format`: `text` (with body) or `minimal`. `maxChars`: body limit (default 20,000).
- **Output:** Ids, date, headers, labels, snippet and attachments; in `text` format, also the body cut at the limit. Missing fields become null or empty.
- **Effects:** None (pure).
- **Errors:** None.

### `perMessageLimit`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `perMessageLimit(count: number): number`
- **Used by:** `formatThread()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Computes the per-message body limit in a thread.
- **Input:** `count`: number of messages in the thread (0 counts as 1).
- **Output:** 60,000 divided by `count`, between 2,000 and 20,000 characters.
- **Effects:** None (pure).
- **Errors:** None.

### `formatThread`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `formatThread(thread: GmailThread, format: MessageFormat): Record<string, unknown>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Converts a Gmail API thread into a lean object.
- **Input:** `thread`: Gmail API thread. `format`: `text` (with bodies) or `minimal`.
- **Output:** `thread_id`, `message_count` and the formatted messages, with the body limit split among them; empty list without messages.
- **Effects:** None (pure).
- **Errors:** None.

### `summarizeThread`

<!-- generated:start -->

- **File:** `connectors/gmail/src/message-format.ts`
- **Signature:** `summarizeThread(thread: GmailThread, account: string): Record<string, unknown>`
- **Used by:** `searchAccount()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Summarizes a thread for search.
- **Input:** `thread`: Gmail API thread (headers only is enough). `account`: account alias.
- **Output:** Account, `thread_id`, subject of the first message, sender, date, snippet and labels of the last one, and `message_count`; empty text or null where data is missing.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/gmail/src/pages.ts`

### `pageDocument`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `pageDocument(title: string, body: string): string`
- **Used by:** `consentPage()`, `messagePage()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Builds a page's full HTML document.
- **Input:** `title`: title (escaped here). `body`: HTML body already escaped by the caller.
- **Output:** HTML with `lang="pt-BR"`, title and inline style.
- **Effects:** None (pure).
- **Errors:** None.

### `messagePage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `messagePage(title: string, message: string, status = 200): Response`
- **Used by:** `accessDeniedPage()`, `authorizationErrorResponse()`, `finishAccountLink()`, `handleDefaultRequest()`, `invalidTicketPage()`, `linkFromCode()`, `linkSafely()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Builds a simple notice page.
- **Input:** `title`: plain-text title. `message`: plain-text message. `status`: HTTP code (default 200).
- **Output:** HTML response with the given status, restrictive CSP and `no-store`; title and message escaped.
- **Effects:** None (pure).
- **Errors:** None.

### `consentPageBody`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `consentPageBody(details: ConsentDescription, handle: string): string`
- **Used by:** `consentPage()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Builds the HTML body of the consent page.
- **Input:** `details`: OAuth client description (name, destination, whether it is loopback). `handle`: consent transaction identifier.
- **Output:** HTML with who is asking, where the access goes, a loopback notice when applicable and the Allow/Deny form; all escaped.
- **Effects:** None (pure).
- **Errors:** None.

### `copyConsentHeaders`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `copyConsentHeaders(response: Response, headers: Headers): Response`
- **Used by:** `consentPage()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Copies the consent transaction headers into the response.
- **Input:** `response`: page response. `headers`: OAuth library headers (cookies and anti-framing).
- **Output:** The same response with the cookies appended and the other headers copied, except `content-type`, CSP and `set-cookie`.
- **Effects:** Mutates the headers of the received response.
- **Errors:** None.

### `consentPage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `consentPage(details: ConsentDescription, handle: string, headers: Headers): Response`
- **Used by:** `showAuthorize()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Builds the connector's consent page.
- **Input:** `details`: OAuth client description. `handle`: transaction identifier. `headers`: consent transaction headers.
- **Output:** HTML 200 page with a CSP that only allows the form to target Google and the client's redirect origin, plus the transaction headers.
- **Effects:** None (pure).
- **Errors:** Throws `TypeError` if `details.redirectUri` is not a valid URL.

### `redirectWith`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `redirectWith(location: string, headers: Headers = new Headers()): Response`
- **Used by:** `authorizationErrorResponse()`, `beginGoogleSignIn()`, `finishSignIn()`, `startAccountLink()`, `submitAuthorize()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Builds a 302 redirect with the given headers.
- **Input:** `location`: destination. `headers`: headers to keep, such as transaction cookies (default empty).
- **Output:** Bodiless 302 response, with `Location` and `cache-control: no-store`.
- **Effects:** Mutates the received `headers` object.
- **Errors:** None.

## `connectors/gmail/src/rate-limit.ts`

### `isRateLimited`

<!-- generated:start -->

- **File:** `connectors/gmail/src/rate-limit.ts`
- **Signature:** `async isRateLimited(limiter: RateLimiter | undefined, key: string): Promise<boolean>`
- **Used by:** `handleGmailWorkerFetch()`, `handleMcpApi()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Tells whether the session exceeded the request limit.
- **Input:** `limiter`: Workers rate limiting binding, or undefined. `key`: session key (OAuth session id).
- **Output:** True if the binding refused; false if it accepted or there is no binding.
- **Effects:** Counts the request in the rate limiting binding.
- **Errors:** None of its own; binding failures propagate.

### `rateLimitedResponse`

<!-- generated:start -->

- **File:** `connectors/gmail/src/rate-limit.ts`
- **Signature:** `rateLimitedResponse(): Response`
- **Used by:** `handleGmailWorkerFetch()`, `handleMcpApi()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Builds the too-many-requests response.
- **Input:** None.
- **Output:** 429 JSON response (`rate_limited`) with `Retry-After: 60`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/gmail/src/search.ts`

### `encodeMultiPageToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `encodeMultiPageToken(tokens: MultiPageToken): string | null`
- **Used by:** `searchThreads()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Encodes the `page_token`s of several accounts into a single string.
- **Input:** `tokens`: `page_token` per account alias.
- **Output:** Base64url of the tokens' JSON, or null if there are none.
- **Effects:** None (pure).
- **Errors:** None.

### `decodeMultiPageToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `decodeMultiPageToken(token: string): MultiPageToken`
- **Used by:** `pagesToFetch()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Decodes the multi-account `page_token`.
- **Input:** `token`: `next_page_token` from a previous search with `all`.
- **Output:** `page_token` per alias; non-string entries are discarded.
- **Effects:** None (pure).
- **Errors:** Throws an actionable error ("Invalid page_token: ...") if the text is not base64url of a JSON object.

### `fetchThreadMetadata`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `fetchThreadMetadata(deps: OwnerDeps, ref: AccountRef, threadId: string): Promise<GmailThread>`
- **Used by:** `searchAccount()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Reads a thread with only the useful headers.
- **Input:** `deps`: connector dependencies (settings, KV, network, clock). `account`: allowed account. `threadId`: thread id.
- **Output:** Gmail API thread in `format=metadata`, with `From`, `To`, `Cc`, `Date` and `Subject`.
- **Effects:** Network (Gmail API and, if needed, token renewal at Google); may mark the account as revoked in KV.
- **Errors:** Propagates the errors of `gmailGet`: Gmail API HTTP, unlinked or revoked account, token renewal failure.

### `searchAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `async searchAccount(deps: OwnerDeps, ref: AccountRef, request: SearchRequest): Promise<AccountSearchResult>`
- **Used by:** `searchThreads()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Searches threads in one account.
- **Input:** `deps`: connector dependencies (settings, KV, network, clock). `account`: allowed account. `request`: query, maximum results and `page_token`.
- **Output:** Summaries of the threads found and the next `page_token`, or null; empty list without results.
- **Effects:** Network (Gmail API, one read per thread in parallel, and token renewal at Google); may mark the account as revoked in KV.
- **Errors:** Propagates the errors of `gmailGet`: Gmail API HTTP, unlinked or revoked account, token renewal failure.

### `threadDate`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `threadDate(thread: Readonly<Record<string, unknown>>): string`
- **Used by:** `sortByDateDesc()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Reads the ISO date of a thread summary.
- **Input:** `thread`: thread summary.
- **Output:** The `date` field if it is a string; otherwise empty text.
- **Effects:** None (pure).
- **Errors:** None.

### `sortByDateDesc`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `sortByDateDesc(threads: Record<string, unknown>[]): Record<string, unknown>[]`
- **Used by:** `searchThreads()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Sorts thread summaries from newest to oldest.
- **Input:** `threads`: thread summaries.
- **Output:** New list sorted by descending date; those without a date go to the end.
- **Effects:** None (pure).
- **Errors:** None.

### `pagesToFetch`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `pagesToFetch(accounts: readonly AccountRef[], pageToken: string | null): [AccountRef, string | null][]`
- **Used by:** `searchThreads()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Decides which accounts to query and with which token.
- **Input:** `accounts`: search accounts. `pageToken`: multi-account `page_token`, or null on the first page.
- **Output:** Account → token pairs: all accounts with null on the first page; otherwise only those that have a token.
- **Effects:** None (pure).
- **Errors:** Throws the invalid `page_token` error of `decodeMultiPageToken`.

### `searchThreads`

<!-- generated:start -->

- **File:** `connectors/gmail/src/search.ts`
- **Signature:** `async searchThreads(deps: OwnerDeps, accounts: readonly AccountRef[], request: SearchRequest): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Searches threads in one or several accounts.
- **Input:** `deps`: connector dependencies (settings, KV, network, clock). `accounts`: resolved accounts. `request`: query, maximum per account and `page_token`.
- **Output:** `threads` (by descending date when there are several accounts) and `next_page_token`: the account's, or the combined one of the accounts; null when finished.
- **Effects:** Network (Gmail API in parallel per account and token renewal at Google); may mark accounts as revoked in KV.
- **Errors:** Throws an invalid `page_token` error; propagates the errors of `gmailGet` from any account.

## `connectors/gmail/src/sign-in.ts`

### `authorizationErrorResponse`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `authorizationErrorResponse(error: unknown): Response`
- **Used by:** `finishSignIn()`, `showAuthorize()`, `submitAuthorize()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Converts an authorization error into a response.
- **Input:** `error`: error caught in the authorization flow.
- **Output:** 302 redirect to the client if the `AuthorizationError` says where to; otherwise a 400 page with the error description or a generic message.
- **Effects:** None (pure).
- **Errors:** None.

### `beginGoogleSignIn`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `async beginGoogleSignIn(deps: GmailDeps, oauth: OAuthHelpers, approved: { readonly request: AuthRequest; readonly headers: Headers }): Promise<Response>`
- **Used by:** `showAuthorize()`, `submitAuthorize()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Starts the Google sign-in asking for identity and Gmail (`gmail.modify`) with a refresh token.
- **Input:** `deps`: dependencies. `oauth`: library helpers. `approved`: approved Claude request and headers.
- **Output:** 302 to Google requesting `openid email gmail.modify` with offline access.
- **Effects:** KV `OAUTH_KV` (via the library): stores the transaction with verifier and `nonce`; sets the `__Host-` cookie.
- **Errors:** Propagates the library's errors.

### `showAuthorize`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `async showAuthorize(deps: GmailDeps, oauth: OAuthHelpers, request: Request): Promise<Response>`
- **Used by:** `connectors/gmail/src/worker.ts (module)`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Shows the `GET /authorize` consent.
- **Input:** `deps`: connector dependencies (settings, origin). `oauth`: the library's `OAuthHelpers`. `request`: Claude's authorization request.
- **Output:** 200 consent page; or 302 redirect to Google if consent was already remembered.
- **Effects:** Reads the request and the client via `OAuthHelpers` (KV OAUTH_KV); opens the consent transaction or the trip to Google; sets cookies.
- **Errors:** None: authorization errors become a 400 page or a redirect.

### `submitAuthorize`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `async submitAuthorize(deps: GmailDeps, oauth: OAuthHelpers, request: Request): Promise<Response>`
- **Used by:** `connectors/gmail/src/worker.ts (module)`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Handles the `POST /authorize` decision.
- **Input:** `deps`: connector dependencies (settings, origin). `oauth`: the library's `OAuthHelpers`. `request`: form with `handle` and `decision`.
- **Output:** On approval, 302 redirect to Google; on denial, 302 back to the client.
- **Effects:** Closes the consent transaction via `OAuthHelpers` (KV OAUTH_KV), remembering the approval for 30 days; sets cookies.
- **Errors:** None: authorization errors become a 400 page or a redirect.

### `completeSignIn`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `async completeSignIn(deps: GmailDeps, oauth: OAuthHelpers, resumed: { readonly request: AuthRequest; readonly data: SignInData; readonly code: string }): Promise<string | null>`
- **Used by:** `finishSignIn()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Validates the Google sign-in and completes Claude's authorization.
- **Input:** `deps`: dependencies. `oauth`: library helpers. `resumed`: Claude request, verifier and `nonce`, Google code.
- **Output:** Redirect URL back to Claude; null if the email may not enter (private mode).
- **Effects:** Network: Google. KV: links the account and stores the grant (`OAUTH_KV`) with `props` for user, email and session.
- **Errors:** Throws without `id_token`; propagates those of the exchange and of the `id_token` validation.

### `finishSignIn`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `async finishSignIn(deps: GmailDeps, oauth: OAuthHelpers, request: Request): Promise<Response>`
- **Used by:** `connectors/gmail/src/worker.ts (module)`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Handles the Google callback in the owner's sign-in.
- **Input:** `deps`: connector dependencies (settings, network, clock). `oauth`: the library's `OAuthHelpers`. `request`: Google callback with `state` and `code` or error.
- **Output:** 302 redirect to Claude with the code; 302 with `access_denied` if Google refused; 403 page if the email is not on the allowlist.
- **Effects:** Reads and consumes the `state` via `OAuthHelpers` (KV OAUTH_KV); network (Google); stores the grant when allowed; sets cookies.
- **Errors:** None: authorization, code exchange and `id_token` errors become a 400 page or a redirect.

### `linkSignedInAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `async linkSignedInAccount(deps: GmailDeps, identity: GoogleIdentity, tokens: GoogleTokens): Promise<boolean>`
- **Used by:** `completeSignIn()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Links the account that just signed in.
- **Input:** `deps`: dependencies. `identity`: verified `sub` and email. `tokens`: Google tokens.
- **Output:** `true` if it linked; `false` without Gmail, without refresh token or if the write fails.
- **Effects:** KV: stores the account in the user's record.
- **Errors:** None: a failure does not block sign-in.

### `accessDeniedPage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/sign-in.ts`
- **Signature:** `accessDeniedPage(): Response`
- **Used by:** `finishSignIn()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Builds the private-mode 403 page.
- **Input:** None.
- **Output:** 403 page for an account outside `ALLOWED_EMAILS`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/gmail/src/tools.ts`

### `resolveSingleAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `async resolveSingleAccount(deps: OwnerDeps, requested: string): Promise<AccountRef>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`, `connectors/gmail/src/tools.ts (module)`, `resolveWritableAccount()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Resolves `account`, requiring a single account.
- **Input:** `deps`: dependencies with the user. `requested`: alias or email.
- **Output:** The requested account.
- **Effects:** KV: one read.
- **Errors:** Throws for `all`; those of `resolveAccounts()`.

### `accountStatus`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `async accountStatus(deps: OwnerDeps, ref: AccountRef): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Builds an account's status for `list_accounts`.
- **Input:** `deps`: dependencies with the user. `ref`: account.
- **Output:** Alias, email, link date and status `ok`, `needs_relink` or `token_error` (with the message).
- **Effects:** Those of `getAccessToken()` (network and cache).
- **Errors:** None: failures become `token_error`.

### `withUntrustedNotice`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `withUntrustedNotice(data: Record<string, unknown>): Record<string, unknown>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Adds the untrusted-content notice to a result.
- **Input:** `data`: result with email content.
- **Output:** New object with `notice` first and the fields of `data`.
- **Effects:** None (pure).
- **Errors:** None.

### `accountLabels`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `async accountLabels(deps: OwnerDeps, ref: AccountRef): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lists an account's labels.
- **Input:** `deps`: connector dependencies (settings, KV, network, clock). `account`: allowed account.
- **Output:** Account alias and labels (`id`, `name`, `type`, with `user` by default); empty list if there are none.
- **Effects:** Network (Gmail API and, if needed, token renewal at Google); may mark the account as revoked in KV.
- **Errors:** Propagates the errors of `gmailGet`: Gmail API HTTP, unlinked or revoked account, token renewal failure.

### `ownerRefs`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `async ownerRefs(deps: OwnerDeps): Promise<AccountRef[]>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `resolveOwnerAccounts()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Reads the user's linked accounts with aliases.
- **Input:** `deps`: dependencies with the user.
- **Output:** List of `AccountRef` (empty without accounts).
- **Effects:** KV: one read.
- **Errors:** Propagates KV failures.

### `resolveOwnerAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `async resolveOwnerAccounts(deps: OwnerDeps, requested: string): Promise<AccountRef[]>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `resolveSingleAccount()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Resolves `account` among the user's accounts.
- **Input:** `deps`: dependencies with the user. `requested`: alias, email or `all`.
- **Output:** The requested accounts.
- **Effects:** KV: one read.
- **Errors:** Those of `resolveAccounts()`.

### `resolveWritableAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `async resolveWritableAccount(deps: OwnerDeps, requested: string): Promise<AccountRef>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`, `connectors/gmail/src/send-tools.ts (module)`, `replyTool()`, `writableTargets()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Resolves `account` to a single account and requires the write scope before touching Gmail.
- **Input:** `deps`; `requested`: alias or email.
- **Output:** The account.
- **Effects:** KV: one read.
- **Errors:** Those of `resolveSingleAccount()` and `requireWriteAccess()`.

### `accountBase`

<!-- generated:start -->

- **File:** `connectors/gmail/src/tools.ts`
- **Signature:** `accountBase(ref: AccountRef): Record<string, unknown>`
- **Used by:** `accountStatus()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Fixed data of an account in `list_accounts`, with `write_access` and the relink hint.
- **Input:** `ref`: account.
- **Output:** Object with alias, email, date, `write_access` and `hint` when read-only.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/gmail/src/worker.ts`

### `createGmailDeps`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `createGmailDeps(env: GmailWorkerEnv, origin: string): GmailDeps`
- **Used by:** `handleDefaultRequest()`, `handleMcpApi()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Builds the request dependencies from the Worker environment.
- **Input:** `env`: Worker variables, secrets and bindings. `origin`: the connector's public origin.
- **Output:** Dependencies with the loaded settings, KV `GMAIL_KV`, `fetch`, clock and origin.
- **Effects:** None (pure).
- **Errors:** Throws if `ALLOWED_EMAILS` is missing or invalid, or if a required secret is missing.

### `createGmailServer`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `createGmailServer(deps: OwnerDeps): McpServer`
- **Used by:** `handleMcpApi()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Creates the MCP server with the user's Gmail tools.
- **Input:** `deps`: dependencies with the user.
- **Output:** `McpServer` with `GMAIL_TOOLS` registered.
- **Effects:** None.
- **Errors:** None.

### `configErrorResponse`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `configErrorResponse(error: unknown): Response`
- **Used by:** `handleDefaultRequest()`, `handleMcpApi()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Builds the Worker's invalid-configuration response.
- **Input:** `error`: error thrown while reading the settings.
- **Output:** 500 plain-text response with the error message (never a secret's value).
- **Effects:** None (pure).
- **Errors:** None.

### `handleMcpApi`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `async handleMcpApi(request: Request, env: GmailWorkerEnv, ctx: ExecutionContext): Promise<Response>`
- **Used by:** `createGmailProvider()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Handles `/mcp`, already authenticated by the library.
- **Input:** `request`: MCP request. `env`: bindings and secrets. `ctx`: context with `props` (user, email, session).
- **Output:** MCP response; 429 above the session limit; 500 with invalid configuration.
- **Effects:** Per-session rate limiting binding; the tools use KV and network.
- **Errors:** None: invalid configuration becomes 500 and tool errors become an MCP error result.

### `handleDefaultRequest`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `async handleDefaultRequest(request: Request, env: GmailWorkerEnv): Promise<Response>`
- **Used by:** `createGmailProvider()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Handles the connector's own routes outside `/mcp`.
- **Input:** `request`: received request. `env`: Worker variables, secrets and bindings, with `OAUTH_PROVIDER` injected by the library.
- **Output:** 200 `ok` on `GET /`; the response of the matched route; 404 page if the route does not exist or `OAUTH_PROVIDER` is missing; 500 if the configuration is invalid.
- **Effects:** Those of the handled route: KV, `OAuthHelpers` (KV OAUTH_KV), network (Google) and cookies.
- **Errors:** None: invalid configuration becomes 500; only propagates the unhandled errors of the link route (code exchange and `id_token`).

### `checkClientRegistration`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `checkClientRegistration(options: ClientRegistrationCallbackOptions): ClientRegistrationCallbackResult | undefined`
- **Used by:** `createGmailProvider()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Decides whether a client's dynamic registration is accepted.
- **Input:** `options`: metadata of the client requesting registration.
- **Output:** Undefined if all redirect URIs are Claude's or localhost; otherwise an `invalid_redirect_uri` error with status 400.
- **Effects:** None (pure).
- **Errors:** None.

### `publicOrigin`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `publicOrigin(env: GmailWorkerEnv, request: Request): string`
- **Used by:** `handleDefaultRequest()`, `handleGmailWorkerFetch()`, `handleMcpApi()`
- **Processes:** P10, P12

<!-- generated:end -->

- **Does:** Computes the connector's canonical public origin.
- **Input:** `env`: Worker variables (optional `PUBLIC_URL`). `request`: received request.
- **Output:** Origin of `PUBLIC_URL` without trailing slash; without it, the request's origin.
- **Effects:** None (pure).
- **Errors:** Throws `TypeError` if `PUBLIC_URL` is not a valid URL.

### `createGmailProvider`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `createGmailProvider(origin: string): OAuthProvider<GmailWorkerEnv>`
- **Used by:** `handleGmailWorkerFetch()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Creates the OAuth provider that wraps the Worker.
- **Input:** `origin`: the connector's public origin.
- **Output:** `OAuthProvider` with `/mcp` as the resource, `/authorize`, `/token` and `/register` endpoints, TTLs of 1 hour and 30 days and the registration check.
- **Effects:** None (pure).
- **Errors:** None.

### `handleGmailWorkerFetch`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `async handleGmailWorkerFetch(request: Request, env: GmailWorkerEnv, ctx: ExecutionContext): Promise<Response>`
- **Used by:** `connectors/gmail/src/index.ts (module)`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Handles a Worker request.
- **Input:** `request`: request. `env`: bindings and secrets. `ctx`: execution context.
- **Output:** 429 if the IP exceeded the limit outside `/mcp`; otherwise the OAuth provider's response.
- **Effects:** Per-IP rate limiting binding; those of the provider and the routes.
- **Errors:** Propagates those of the OAuth library.

### `clientIpKey`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `clientIpKey(request: Request): string`
- **Used by:** `handleGmailWorkerFetch()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Builds the public limit key from the client IP.
- **Input:** `request`: request.
- **Output:** `ip:<cf-connecting-ip>` or `ip:unknown`.
- **Effects:** None (pure).
- **Errors:** None.

### `isMcpPath`

<!-- generated:start -->

- **File:** `connectors/gmail/src/worker.ts`
- **Signature:** `isMcpPath(request: Request): boolean`
- **Used by:** `handleGmailWorkerFetch()`
- **Processes:** P10

<!-- generated:end -->

- **Does:** Tells whether the route is the token-protected `/mcp`.
- **Input:** `request`: request.
- **Output:** `true` for `/mcp` and subpaths.
- **Effects:** None (pure).
- **Errors:** None.

## `src/core/pdf.ts`

### `bytesToLatin1`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `bytesToLatin1(bytes: Uint8Array): string`
- **Used by:** `fontCMaps()`, `isPdf()`, `listRawObjects()`, `pdfToText()`, `splitObjectStream()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Converts bytes to text with one character per byte (latin1), to find keywords without losing offsets.
- **Input:** `bytes`: any binary content.
- **Output:** Text with one character per byte; empty if there are no bytes.
- **Effects:** None (pure).
- **Errors:** None.

### `isPdf`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `isPdf(bytes: Uint8Array): boolean`
- **Used by:** `detectAttachmentKind()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Tells whether the bytes start like a PDF (`%PDF-`).
- **Input:** `bytes`: file content.
- **Output:** `true` if the first five bytes are `%PDF-`; `false` otherwise (including a short file).
- **Effects:** None (pure).
- **Errors:** None.

### `streamDataStart`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `streamDataStart(text: string, keywordAt: number): number`
- **Used by:** `readRawObject()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Computes where a stream's data starts, after `stream` and the line break (CRLF or LF).
- **Input:** `text`: PDF in latin1. `keywordAt`: position of the `stream` keyword.
- **Output:** Position of the first data byte; right after `stream` if there is no line break.
- **Effects:** None (pure).
- **Errors:** None.

### `trimStreamEol`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `trimStreamEol(text: string, dataStart: number, streamEnd: number): number`
- **Used by:** `readRawObject()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Computes where a stream's data ends, excluding the line break that precedes `endstream`.
- **Input:** `text`: PDF in latin1. `dataStart`: start of the data. `streamEnd`: position of `endstream`.
- **Output:** End position of the data, moved back past CRLF, LF or CR; never before `dataStart`.
- **Effects:** None (pure).
- **Errors:** None.

### `readRawObject`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readRawObject(text: string, bytes: Uint8Array, start: number): { dict: string; stream: Uint8Array | null; end: number }`
- **Used by:** `listRawObjects()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Reads the object that starts at `start`, right after `N G obj`.
- **Input:** `text`: PDF in latin1. `bytes`: the same PDF as bytes. `start`: position right after `N G obj`.
- **Output:** `{ dict, stream, end }`: dictionary as text, still-compressed stream bytes (`null` if none) and where the search for the next object resumes; without `endobj`, runs to the end of the text.
- **Effects:** None (pure).
- **Errors:** None.

### `listRawObjects`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `listRawObjects(bytes: Uint8Array): RawPdfObject[]`
- **Used by:** `readPdfObjects()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lists the file's `N G obj ... endobj` objects, in the order they appear.
- **Input:** `bytes`: PDF content.
- **Output:** List of raw objects with number, dictionary and compressed stream (`null` without a stream); empty if there are no objects.
- **Effects:** None (pure).
- **Errors:** None.

### `decodePdfStream`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `async decodePdfStream(dict: string, stream: Uint8Array): Promise<Uint8Array | null>`
- **Used by:** `readPdfObjects()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Decompresses the stream according to the dictionary's `/Filter`.
- **Input:** `dict`: object dictionary. `stream`: stream bytes as stored in the file.
- **Output:** The bytes themselves without `/Filter`; the inflated bytes with FlateDecode; `null` for another filter or a corrupt stream.
- **Effects:** None (pure).
- **Errors:** None (a corrupt stream returns `null`).

### `splitObjectStream`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `splitObjectStream(dict: string, data: Uint8Array): [number, PdfObject][]`
- **Used by:** `storePdfObject()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Splits out the objects stored in an object stream (`/Type /ObjStm`).
- **Input:** `dict`: object stream dictionary, with `/First`. `data`: already decompressed stream.
- **Output:** [number, object] pairs with each object's dictionary and null `data`; empty if `/First` is missing.
- **Effects:** None (pure).
- **Errors:** None.

### `storePdfObject`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `storePdfObject(objects: Map<number, PdfObject>, num: number, obj: PdfObject): void`
- **Used by:** `readPdfObjects()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Stores a parsed object and, if it is an object stream, the objects inside it without overwriting.
- **Input:** `objects`: object map being built. `num`: object number. `obj`: dictionary and decompressed stream.
- **Output:** Nothing.
- **Effects:** Mutates `objects`.
- **Errors:** None.

### `readPdfObjects`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `async readPdfObjects(bytes: Uint8Array): Promise<PdfObjects>`
- **Used by:** `pdfToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Reads all PDF objects, decompressing streams and opening object streams.
- **Input:** `bytes`: PDF content.
- **Output:** Map number → object; a stream with an unknown or corrupt filter gets null `data`; empty map if there are no objects.
- **Effects:** None (pure).
- **Errors:** None (a corrupt stream gets null `data`).

### `pdfRefs`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `pdfRefs(text: string): number[]`
- **Used by:** `dictRefs()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lists the object numbers cited as references (`N 0 R`) in a snippet.
- **Input:** `text`: PDF dictionary snippet.
- **Output:** Referenced object numbers, in order; empty if there is no reference.
- **Effects:** None (pure).
- **Errors:** None.

### `dictRefs`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `dictRefs(dict: string, key: string): number[]`
- **Used by:** `collectPdfPages()`, `fontCMaps()`, `pdfToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Reads the value of a key that may be a single reference or a list of references.
- **Input:** `dict`: object dictionary. `key`: key name without the slash (e.g. `Kids`, `Contents`).
- **Output:** Referenced object numbers; empty if the key does not exist or is not a reference.
- **Effects:** None (pure).
- **Errors:** None.

### `collectPdfPages`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `collectPdfPages(objects: PdfObjects, num: number, pages: number[]): void`
- **Used by:** `collectPdfPages()`, `orderedPages()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Appends to `pages` the pages under node `num` of the page tree, in order.
- **Input:** `objects`: PDF objects. `num`: page tree node. `pages`: list that receives the pages; the descent stops at 10 000 pages.
- **Output:** Nothing.
- **Effects:** Mutates `pages`.
- **Errors:** None.

### `orderedPages`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `orderedPages(objects: PdfObjects): number[]`
- **Used by:** `pdfToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Lists the pages in reading order, walking the `/Pages` tree from the root.
- **Input:** `objects`: PDF objects.
- **Output:** Page object numbers in order; empty if there is no `/Pages` root.
- **Effects:** None (pure).
- **Errors:** None.

### `utf16beHexToString`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `utf16beHexToString(hex: string): string`
- **Used by:** `rangeTarget()`, `readBfChars()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Decodes UTF-16BE hexadecimal (the target of a ToUnicode map) into text.
- **Input:** `hex`: hexadecimal digits; two digits count as one byte.
- **Output:** The decoded text; leftover digits outside groups of four are ignored; empty if `hex` is empty.
- **Effects:** None (pure).
- **Errors:** None.

### `readBfChars`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readBfChars(text: string, map: Map<number, string>): void`
- **Used by:** `parseToUnicodeCMap()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Reads the `<orig> <destino>` lines of a ToUnicode map's `beginbfchar` blocks.
- **Input:** `text`: ToUnicode map as text. `map`: code → text map that receives the entries.
- **Output:** Nothing.
- **Effects:** Mutates `map`.
- **Errors:** None.

### `readBfRanges`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readBfRanges(text: string, map: Map<number, string>): void`
- **Used by:** `parseToUnicodeCMap()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Reads a ToUnicode map's `beginbfrange` blocks.
- **Input:** `text`: ToUnicode map as text. `map`: code → text map that receives the entries; each range is capped at 65 536 codes.
- **Output:** Nothing.
- **Effects:** Mutates `map`.
- **Errors:** None.

### `rangeTarget`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `rangeTarget(targets: readonly string[], offset: number): string`
- **Used by:** `readBfRanges()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Computes the target of a code in a `bfrange`.
- **Input:** `targets`: hexadecimal targets (a starting one or a list). `offset`: distance from the code to the start of the range.
- **Output:** The list item, or the starting target with the offset added to its last character; empty if the target is empty or missing.
- **Effects:** None (pure).
- **Errors:** None.

### `parseToUnicodeCMap`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `parseToUnicodeCMap(text: string): PdfCMap`
- **Used by:** `fontCMaps()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Parses a ToUnicode map with its 1- or 2-byte codes.
- **Input:** `text`: ToUnicode map as text.
- **Output:** `{ map, bytes }`: code → text and the code size (2 if the `codespacerange` has 4+ digits, otherwise 1); empty map if there are no blocks.
- **Effects:** None (pure).
- **Errors:** None.

### `addFontRefs`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `addFontRefs(fonts: Map<string, number>, text: string): void`
- **Used by:** `fontResourceRefs()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Appends to `fonts` the name → object pairs (`/F1 5 0 R`) of a font dictionary.
- **Input:** `fonts`: name → object map that receives the pairs. `text`: font dictionary content.
- **Output:** Nothing.
- **Effects:** Mutates `fonts` (does not overwrite names already present).
- **Errors:** None.

### `fontResourceRefs`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `fontResourceRefs(objects: PdfObjects): Map<string, number>`
- **Used by:** `fontCMaps()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Collects the font names (`/F1`) and their objects from all `/Font` dictionaries in the resources.
- **Input:** `objects`: PDF objects.
- **Output:** Map name → font object number; the first one found wins; empty without fonts.
- **Effects:** None (pure).
- **Errors:** None.

### `fontCMaps`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `fontCMaps(objects: PdfObjects): Map<string, PdfCMap>`
- **Used by:** `pdfToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Builds the ToUnicode maps by font name, for fonts that have `/ToUnicode`.
- **Input:** `objects`: PDF objects.
- **Output:** Map font name → ToUnicode map; fonts without a readable `/ToUnicode` are left out.
- **Effects:** None (pure).
- **Errors:** None.

### `decodePdfText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `decodePdfText(raw: string, cmap: PdfCMap | undefined): string`
- **Used by:** `lastOperandText()`, `showArrayText()`
- **Processes:** —

<!-- generated:end -->

- **Does:** Decodes the bytes of a text string using the current font (ToUnicode).
- **Input:** `raw`: raw string (one character per byte). `cmap`: the font's ToUnicode map, or `undefined`.
- **Output:** The decoded text; without a map, the string itself (latin1); codes with no map entry are dropped.
- **Effects:** None (pure).
- **Errors:** None.

### `readLiteralString`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readLiteralString(src: string, start: number): [string, number]`
- **Used by:** `nextPdfToken()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Reads a literal string `( ... )` starting at the `(`.
- **Input:** `src`: content stream. `start`: position of the `(`.
- **Output:** [raw text with escapes resolved, next position]; without a closing `)`, runs to the end.
- **Effects:** None (pure).
- **Errors:** None.

### `readEscape`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readEscape(src: string, pos: number): [string, number]`
- **Used by:** `readLiteralString()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Reads the escape that follows `\` in a literal string.
- **Input:** `src`: content stream. `pos`: position right after the `\`.
- **Output:** [escape text, next position]: octal of up to 3 digits, a known letter, empty for a line break, or the character itself.
- **Effects:** None (pure).
- **Errors:** None.

### `readHexString`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readHexString(src: string, start: number): [string, number]`
- **Used by:** `nextPdfToken()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Reads a hexadecimal string `<...>` starting at the `<`.
- **Input:** `src`: content stream. `start`: position of the `<`.
- **Output:** [raw text, next position]; ignores non-hexadecimal characters and pads an odd digit with 0; without `>`, runs to the end.
- **Effects:** None (pure).
- **Errors:** None.

### `skipPdfSpace`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `skipPdfSpace(src: string, pos: number): number`
- **Used by:** `nextPdfToken()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Finds the position of the next non-whitespace character, starting at `pos`.
- **Input:** `src`: content stream. `pos`: starting position.
- **Output:** The position of the next non-whitespace character, or the end of the text.
- **Effects:** Mutates the `lastIndex` of the module regex `PDF_SPACE`.
- **Errors:** None.

### `nextPdfToken`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `nextPdfToken(src: string, pos: number): [PdfToken, number] | null`
- **Used by:** `contentStreamText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Reads the next token of the content stream starting at `pos`.
- **Input:** `src`: content stream. `pos`: starting position.
- **Output:** [token, next position]; `null` at the end of the text.
- **Effects:** Mutates the `lastIndex` of the module regexes `PDF_SPACE` and `PDF_WORD`.
- **Errors:** None.

### `readPdfWord`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `readPdfWord(src: string, at: number): [PdfToken, number]`
- **Used by:** `nextPdfToken()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Reads a word (name, number, operator, `<<`/`>>` or comment) starting at `at`.
- **Input:** `src`: content stream. `at`: position of a non-whitespace character.
- **Output:** [classified token, next position].
- **Effects:** Mutates the `lastIndex` of the module regex `PDF_WORD`.
- **Errors:** None.

### `wrapString`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `wrapString([value, next]: [string, number]): [PdfToken, number]`
- **Used by:** `nextPdfToken()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Wraps the result of a string read in a `string` token.
- **Input:** `[value, next]`: text read and next position.
- **Output:** [`string` token with the text, next position].
- **Effects:** None (pure).
- **Errors:** None.

### `classifyWord`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `classifyWord(word: string): PdfToken`
- **Used by:** `readPdfWord()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Classifies a stream word as a name (`/F1`), number or operator.
- **Input:** `word`: word read from the stream.
- **Output:** A `name` token without the slash, a `number` with the value, or an `op` with the word.
- **Effects:** None (pure).
- **Errors:** None.

### `showArrayText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `showArrayText(items: readonly PdfToken[], font: PdfCMap | undefined): string`
- **Used by:** `src/core/pdf.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Builds the text of a `TJ` operand, with spaces where the adjustment is large.
- **Input:** `items`: items of the `TJ` list. `font`: current font's ToUnicode map, or `undefined`.
- **Output:** Decoded strings, with a space for an adjustment below `TJ_SPACE_THRESHOLD`; empty if there are no strings.
- **Effects:** None (pure).
- **Errors:** None.

### `lastOperandText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `lastOperandText(state: PdfTextState): string`
- **Used by:** `src/core/pdf.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Decodes the text of the last string operand using the current font.
- **Input:** `state`: text interpreter state.
- **Output:** The decoded text; empty if the last operand is not a string or there are no operands.
- **Effects:** None (pure).
- **Errors:** None.

### `moveText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `moveText(state: PdfTextState): string`
- **Used by:** `src/core/pdf.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Decides what a `Td`/`TD` produces in the text.
- **Input:** `state`: interpreter state, with the operator's operands.
- **Output:** A line break if the last operand (ty) is a non-zero number; otherwise a space.
- **Effects:** None (pure).
- **Errors:** None.

### `applyTextOperator`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `applyTextOperator(state: PdfTextState, op: string, cmaps: ReadonlyMap<string, PdfCMap>): void`
- **Used by:** `feedPdfToken()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Applies a text operator to the interpreter state.
- **Input:** `state`: interpreter state. `op`: operator name. `cmaps`: ToUnicode maps by font name.
- **Output:** Nothing.
- **Effects:** Mutates `state` (switches the font on `Tf` or appends text to `out`); an unknown operator changes nothing.
- **Errors:** None.

### `feedPdfToken`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `feedPdfToken(state: PdfTextState, token: PdfToken, cmaps: ReadonlyMap<string, PdfCMap>): void`
- **Used by:** `contentStreamText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Consumes a token in the text interpreter.
- **Input:** `state`: interpreter state. `token`: token read from the stream. `cmaps`: ToUnicode maps by font name.
- **Output:** Nothing.
- **Effects:** Mutates `state` (open list, operands and produced text).
- **Errors:** None.

### `contentStreamText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `contentStreamText(content: string, cmaps: ReadonlyMap<string, PdfCMap>): string`
- **Used by:** `pdfToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Extracts the text of a page content stream.
- **Input:** `content`: content stream in latin1. `cmaps`: ToUnicode maps by font name.
- **Output:** The text produced by the text operators; empty if there is none.
- **Effects:** None (pure).
- **Errors:** None.

### `tidyPdfText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `tidyPdfText(text: string): string`
- **Used by:** `pdfToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Cleans repeated spaces, excess blank lines and leading/trailing whitespace from extracted text.
- **Input:** `text`: text extracted from the PDF.
- **Output:** The text with collapsed spaces, at most one consecutive blank line and no leading/trailing whitespace.
- **Effects:** None (pure).
- **Errors:** None.

### `pdfToText`

<!-- generated:start -->

- **File:** `src/core/pdf.ts`
- **Signature:** `async pdfToText(bytes: Uint8Array): Promise<string>`
- **Used by:** `attachmentBytesToText()`
- **Processes:** P12

<!-- generated:end -->

- **Does:** Extracts the text of a PDF, page by page.
- **Input:** `bytes`: PDF content.
- **Output:** The cleaned page text separated by blank lines; empty if there is no readable text (e.g. an image-only PDF).
- **Effects:** None (pure).
- **Errors:** Throws `Error` if the PDF is encrypted (`/Encrypt` in the last 4 KB).

## `connectors/whatsapp/src/bridge-client.ts`

### `bridgeErrorFrom`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `bridgeErrorFrom(status: number, body: unknown): BridgeError`
- **Used by:** `attemptBridge()`, `ensureRestored()`
- **Processes:** P13, P14, P15, P16

<!-- generated:end -->

- **Does:** Translates a bridge error response into a `BridgeError` with a Portuguese message.
- **Input:** HTTP `status` and the response's JSON body (any value).
- **Output:** `BridgeError` with the message from `BRIDGE_ERROR_MESSAGES` (or the bridge's own), status and code.
- **Effects:** None (pure).
- **Errors:** None (returns the error, does not throw).

### `withDeadline`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `withDeadline(promise: Promise<T>, deadline: number, message: string): Promise<T>`
- **Used by:** `attemptBridge()`, `runRead()`, `runScheduledSync()`
- **Processes:** P13, P14, P15, P17

<!-- generated:end -->

- **Does:** Awaits a promise until the `deadline` instant (Unix ms); after that, rejects with the given message.
- **Input:** `promise`, `deadline` (Unix ms) and the timeout message.
- **Output:** Promise with the original's value.
- **Effects:** Schedules and clears a `setTimeout`.
- **Errors:** Rejects with `Error(message)` if the deadline passes (or has already passed); forwards the original's rejection.

### `bridgeTimeoutMessage`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `bridgeTimeoutMessage(path: string): string`
- **Used by:** `attemptBridge()`
- **Processes:** P13, P14, P15

<!-- generated:end -->

- **Does:** Timeout message for a bridge call.
- **Input:** `path` of the call (with or without query).
- **Output:** Portuguese text with the route without the query.
- **Effects:** None (pure).
- **Errors:** None.

### `callBridge`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `async callBridge(bridge: BridgeFetch, path: string, options: { readonly init?: RequestInit; readonly deadline: number }): Promise<Response>`
- **Used by:** `bridgeJson()`, `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P13, P14, P15

<!-- generated:end -->

- **Does:** Calls the bridge within the deadline, waiting for it to wake up (`not_ready`); 2xx returns the response, anything else throws.
- **Input:** `bridge`, `path` and options (`init`, `deadline`).
- **Output:** The bridge's 2xx `Response`.
- **Effects:** Network: request to the bridge's Durable Object.
- **Errors:** `BridgeError` with the bridge's code (after exhausting the `not_ready` retries); timeout error.

### `bridgeJson`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `async bridgeJson(bridge: BridgeFetch, path: string, options: { readonly init?: RequestInit; readonly deadline: number }): Promise<T>`
- **Used by:** `connectors/whatsapp/src/pair.ts (module)`, `connectors/whatsapp/src/tools.ts (module)`, `fetchPairStatus()`, `waitForSync()`
- **Processes:** P13, P14, P15

<!-- generated:end -->

- **Does:** Calls the bridge and reads the response JSON.
- **Input:** `bridge`, `path` and options (`init`, `deadline`).
- **Output:** JSON body typed as `T`.
- **Effects:** Network: request to the bridge's Durable Object.
- **Errors:** Those of `callBridge`; rejects if the body is not JSON.

### `bridgePath`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `bridgePath(path: string, params: Readonly<Record<string, string | number | undefined>>): string`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`, `waitForSync()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Builds `caminho?query` with only the defined parameters.
- **Input:** `path` and the parameters (undefined and empty ones are ignored).
- **Output:** Path with the query, or just the path.
- **Effects:** None (pure).
- **Errors:** None.

### `jsonPost`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `jsonPost(body: unknown): RequestInit`
- **Used by:** `connectors/whatsapp/src/pair.ts (module)`, `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** JSON body of a POST to the bridge.
- **Input:** `body`: value to serialize.
- **Output:** `RequestInit` with POST method, JSON `content-type` and body.
- **Effects:** None (pure).
- **Errors:** None.

### `shouldRetryBridge`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `shouldRetryBridge(error: BridgeError, deadline: number, now: number): boolean`
- **Used by:** `callBridge()`
- **Processes:** P13, P14, P15

<!-- generated:end -->

- **Does:** Tells whether a retry is worthwhile: the bridge is still starting and there is time left for another attempt.
- **Input:** `error`: bridge error; `deadline`: deadline (Unix ms); `now`: current instant (ms).
- **Output:** `true` only for `not_ready` with enough time left for another `BRIDGE_RETRY_MS` wait.
- **Effects:** None (pure).
- **Errors:** None.

### `attemptBridge`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/bridge-client.ts`
- **Signature:** `async attemptBridge(bridge: BridgeFetch, path: string, options: { readonly init?: RequestInit; readonly deadline: number }): Promise<Response>`
- **Used by:** `callBridge()`
- **Processes:** P13, P14, P15

<!-- generated:end -->

- **Does:** Makes one attempt: a 2xx response, or a `BridgeError` with the bridge's code.
- **Input:** `bridge`: Durable Object fetch; `path`: route with query; `options`: optional `init` and `deadline` (Unix ms).
- **Output:** The 2xx response.
- **Effects:** Network (call to the bridge's Durable Object).
- **Errors:** `BridgeError` on status ≠ 2xx; timeout error after the `deadline`.

## `connectors/whatsapp/src/config.ts`

### `requireEnv`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `requireEnv(env: EnvVars, key: string, how: string): string`
- **Used by:** `containerEnvVars()`, `readWhatsAppSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Reads a required variable or throws explaining how to set it.
- **Input:** `env`, the key and the instruction on how to set it.
- **Output:** The variable's value.
- **Effects:** None (pure).
- **Errors:** Throws `Error` if the variable is missing or empty.

### `readIntInRange`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readIntInRange(env: EnvVars, key: string, range: { readonly min: number; readonly max: number; readonly fallback: number }): number`
- **Used by:** `readSendSettings()`, `readTimingSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Reads an integer within a range; missing yields the default, out of range throws.
- **Input:** `env`, the key and the range (`min`, `max`, `fallback`).
- **Output:** The integer read or the default.
- **Effects:** None (pure).
- **Errors:** Throws `Error` if it is not an integer or is out of range.

### `readSleepAfter`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readSleepAfter(env: EnvVars): string`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`, `readTimingSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Validates `SLEEP_AFTER` (`30s` to `60m`, or `1h`); missing yields `5m`.
- **Input:** `env`.
- **Output:** The duration in the `Container` format (e.g. `5m`).
- **Effects:** None (pure).
- **Errors:** Throws `Error` if the format is invalid or the duration is outside 30 s to 1 h.

### `normalizePhone`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `normalizePhone(raw: string): string | null`
- **Used by:** `connectors/whatsapp/src/pair.ts (module)`, `normalizeRecipient()`
- **Processes:** P13, P15, P17

<!-- generated:end -->

- **Does:** Normalizes a phone number or contact JID to digits only; null if it does not look like a number.
- **Input:** `raw`: number or JID (`...@s.whatsapp.net`).
- **Output:** 8 to 15 digits, or `null`.
- **Effects:** None (pure).
- **Errors:** None.

### `readSendAllowlist`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readSendAllowlist(env: EnvVars): string[]`
- **Used by:** `readSendSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Reads `SEND_ALLOWLIST` (comma-separated numbers or JIDs; empty = any recipient); an invalid item throws.
- **Input:** `env`.
- **Output:** List of normalized JIDs (empty if missing).
- **Effects:** None (pure).
- **Errors:** Throws `Error` naming the invalid item.

### `readAllowedEmails`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readAllowedEmails(env: EnvVars): string[]`
- **Used by:** `readWhatsAppSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Reads the owner list (`ALLOWED_EMAILS`); empty throws, because nobody could sign in.
- **Input:** `env`.
- **Output:** List of lowercase e-mails.
- **Effects:** None (pure).
- **Errors:** Throws `Error` if the list is empty.

### `readTimingSettings`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readTimingSettings(env: EnvVars): Pick<WhatsAppSettings, 'sleepAfter' | 'toolTimeoutMs' | 'syncWaitMs'>`
- **Used by:** `readWhatsAppSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Reads the timeouts: container sleep, per-tool cap and sync wait.
- **Input:** `env`.
- **Output:** `sleepAfter`, `toolTimeoutMs` and `syncWaitMs`.
- **Effects:** None (pure).
- **Errors:** Those of `readSleepAfter` and `readIntInRange`.

### `readSendSettings`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readSendSettings(env: EnvVars): Pick<WhatsAppSettings, 'enableSend' | 'sendAllowlist' | 'sendMaxPerHour'>`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`, `readWhatsAppSettings()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Reads the send configuration: enabled or not, optional allowlist and hourly limit.
- **Input:** `env`.
- **Output:** `enableSend`, `sendAllowlist` and `sendMaxPerHour`.
- **Effects:** None (pure).
- **Errors:** Those of `readSendAllowlist` and `readIntInRange`.

### `readWhatsAppSettings`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `readWhatsAppSettings(env: EnvVars): WhatsAppSettings`
- **Used by:** `createWhatsAppApps()`, `isSyncCronEnabled()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Reads and validates the connector configuration from the Worker environment.
- **Input:** `env`: the Worker's text variables.
- **Output:** Complete `WhatsAppSettings`.
- **Effects:** None (pure).
- **Errors:** Throws `Error` explaining the missing or invalid variable.

### `containerEnvVars`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `containerEnvVars(env: EnvVars): Record<string, string>`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Builds the container environment: only the bridge keys, plus the outbound snapshot address.
- **Input:** `env`: the Worker's text variables.
- **Output:** The `BRIDGE_ENV_KEYS` variables that are present, plus `SNAPSHOT_PUSH_URL`.
- **Effects:** None (pure).
- **Errors:** Throws `Error` if `BRIDGE_TOKEN` is missing (or shorter than 32 characters) or `SNAPSHOT_KEY` is missing.

### `normalizeRecipient`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/config.ts`
- **Signature:** `normalizeRecipient(raw: string): string | null`
- **Used by:** `allowedRecipient()`, `readSendAllowlist()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Normalizes a send recipient to a JID: a number (with or without `+`, spaces, dashes) becomes `<digits>@s.whatsapp.net`; contact, LID and group JIDs (`@g.us`, including `creator-timestamp`) pass through as is. Pure.
- **Input:** `raw`: typed number or JID.
- **Output:** Normalized JID, or `null` if it is neither a contact nor a group (e.g. `status@broadcast`).
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/whatsapp/src/container.ts`

### `workersFixedLength`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/container.ts`
- **Signature:** `workersFixedLength(body: ReadableStream<Uint8Array>, length: number): ReadableStream<Uint8Array>`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Workers fixed-length stream for writing to R2 without loading the file into memory.
- **Input:** `body`: byte stream; `length`: total size.
- **Output:** Readable stream of the `FixedLengthStream`.
- **Effects:** Copies `body` into the `FixedLengthStream` with `pumpInto()` (in the background).
- **Errors:** None (a failure of the piping is not observed here).

## `connectors/whatsapp/src/format.ts`

### `isHiddenChar`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `isHiddenChar(char: string): boolean`
- **Used by:** `sanitizeText()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Tells whether a character is invisible or a control character (it may hide text from the user).
- **Input:** `char`: a character.
- **Output:** `true` if it falls within `HIDDEN_CHAR_RANGES`.
- **Effects:** None (pure).
- **Errors:** None.

### `sanitizeText`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `sanitizeText(text: string | null | undefined, max = MAX_TEXT_CHARS): string`
- **Used by:** `compactChat()`, `compactContact()`, `compactMessage()`, `connectors/whatsapp/src/tools.ts (module)`, `mediaResult()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Cleans third-party text: strips invisible/control characters and truncates at the cap.
- **Input:** `text` (may be null) and `max` (default `MAX_TEXT_CHARS`).
- **Output:** Clean text, with a `[truncated N chars]` notice if truncated.
- **Effects:** None (pure).
- **Errors:** None.

### `untrusted`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `untrusted(data: T): { readonly notice: string; readonly data: T }`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Wraps data with third-party content under the untrusted notice.
- **Input:** `data`: any value.
- **Output:** `{ notice: UNTRUSTED_NOTICE, data }`.
- **Effects:** None (pure).
- **Errors:** None.

### `compactMessage`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `compactMessage(message: BridgeMessage): Record<string, unknown>`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Compact message: only useful fields, cleaned texts, no empty fields.
- **Input:** `message`: bridge message.
- **Output:** Object with `id`, `chat`, `from`, `at` and, when present, name, type, text and media.
- **Effects:** None (pure).
- **Errors:** None.

### `compactChat`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `compactChat(chat: BridgeChat): Record<string, unknown>`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Compact chat, with a short, cleaned preview of the last message.
- **Input:** `chat`: bridge chat.
- **Output:** Object with `jid`, `name`, `last_at` and, when present, `group` and `last`.
- **Effects:** None (pure).
- **Errors:** None.

### `partialSyncWarning`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `partialSyncWarning(status: BridgeStatus): string | null`
- **Used by:** `compactStatus()`, `prepareRead()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Partial-result warning when the pending-message sync did not finish in time.
- **Input:** `status`: bridge status.
- **Output:** Warning (syncing or disconnected) or `null` if not partial.
- **Effects:** None (pure).
- **Errors:** None.

### `compactStatus`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/format.ts`
- **Signature:** `compactStatus(status: BridgeStatus, pairUrl: string): Record<string, unknown>`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Compact status for `whatsapp_status`, with the partial-sync warning when the wait ran out.
- **Input:** The bridge's `status` and the pairing page's `pairUrl`.
- **Output:** Object with connection, pairing (and `pair_at` if needed), sync, counts, sending and `warning` (only
  when `status.partial`).
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/whatsapp/src/lifecycle.ts`

### `withBridgeToken`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `withBridgeToken(token: string, init: RequestInit = {}): RequestInit`
- **Used by:** `fetchBridge()`
- **Processes:** P14, P16

<!-- generated:end -->

- **Does:** Adds the bridge's `Authorization` to a request's options.
- **Input:** The bridge `token` and `init` (optional).
- **Output:** `RequestInit` with `authorization: Bearer <token>`.
- **Effects:** None (pure).
- **Errors:** None.

### `fetchBridge`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `fetchBridge(host: BridgeHost, path: string, init?: RequestInit): Promise<Response>`
- **Used by:** `ensureRestored()`, `readBridgePhase()`, `routeBridgeRequest()`, `snapshotBridge()`
- **Processes:** P14, P16

<!-- generated:end -->

- **Does:** Makes an already-authenticated request to the bridge inside the container.
- **Input:** `host`, `path` and optional `init`.
- **Output:** The bridge's response.
- **Effects:** Network: `containerFetch` (may wake the container).
- **Errors:** Forwards the `containerFetch` rejection.

### `readBridgePhase`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async readBridgePhase(host: BridgeHost): Promise<string>`
- **Used by:** `ensureRestored()`
- **Processes:** P14, P16

<!-- generated:end -->

- **Does:** Reads the bridge phase (`GET /health`).
- **Input:** `host`: Durable Object port.
- **Output:** Phase (e.g. `awaiting_restore`) or `unknown`.
- **Effects:** Network: `GET /health` on the container.
- **Errors:** Rejects if the call fails or the body is not JSON.

### `restoreRequestInit`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async restoreRequestInit(host: BridgeHost): Promise<RequestInit>`
- **Used by:** `ensureRestored()`
- **Processes:** P14, P16

<!-- generated:end -->

- **Does:** `POST /restore` options: the bucket snapshot as a stream, or `X-Snapshot: none` if there is none.
- **Input:** `host`: Durable Object port.
- **Output:** The POST's `RequestInit`, with the snapshot as the body or the `x-snapshot: none` header.
- **Effects:** Reads the snapshot from R2.
- **Errors:** Forwards the R2 rejection.

### `ensureRestored`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async ensureRestored(host: BridgeHost): Promise<void>`
- **Used by:** `routeBridgeRequest()`
- **Processes:** P14, P16

<!-- generated:end -->

- **Does:** Restores the bridge if it has just woken up; a rejected snapshot throws (it never starts from scratch on its own).
- **Input:** `host`: Durable Object port.
- **Output:** Nothing.
- **Effects:** Network: `/health` and `/restore` on the container; reads the snapshot from R2.
- **Errors:** Throws `BridgeError` if the restore fails (except 409, another request already restored).

### `snapshotBridge`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async snapshotBridge(host: BridgeHost, force = false): Promise<SnapshotOutcome>`
- **Used by:** `connectors/whatsapp/src/lifecycle.ts (module)`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Requests the snapshot from the bridge and writes it to the bucket.
- **Input:** `host`: Durable Object port; `force`: requests `?force=1` (after a failed write).
- **Output:** `SnapshotOutcome` (`saved`, `unchanged` or `stale`).
- **Effects:** Network: `GET /snapshot` on the container; writes to R2.
- **Errors:** Those of `storeSnapshotResponse`.

### `planSend`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `planSend(history: readonly number[], now: number, maxPerHour: number): { readonly allowed: boolean; readonly history: number[]; readonly retryAfterSeconds: number }`
- **Used by:** `guardSend()`
- **Processes:** P14, P17

<!-- generated:end -->

- **Does:** Decides a send: allowed (with the new history) or refused with how many seconds to wait. Pure.
- **Input:** `history` (ms of the sends), `now` (ms) and `maxPerHour`.
- **Output:** `allowed`, the last hour's history and `retryAfterSeconds`.
- **Effects:** None (pure).
- **Errors:** None.

### `guardSend`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async guardSend(host: BridgeHost): Promise<Response | null>`
- **Used by:** `routeBridgeRequest()`
- **Processes:** P14, P17

<!-- generated:end -->

- **Does:** Enforces the send limit; returns the 429 response if exceeded, or null (and records the send) if allowed.
- **Input:** `host`: Durable Object port.
- **Output:** 429 `rate_limited` response or `null`.
- **Effects:** Reads and writes `SEND_HISTORY_KEY` in the Durable Object storage.
- **Errors:** Forwards the storage rejection.

### `forwardInit`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `forwardInit(request: Request): RequestInit`
- **Used by:** `routeBridgeRequest()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Options for forwarding an incoming request to the bridge (method, type and body).
- **Input:** `request`: incoming request.
- **Output:** `RequestInit` with method, `content-type` and body (except for GET/HEAD).
- **Effects:** None (pure).
- **Errors:** None.

### `createBridgeLifecycle`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `createBridgeLifecycle(host: BridgeHost): BridgeLifecycle`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Builds the bridge lifecycle for a Durable Object.
- **Input:** `host`: Durable Object port.
- **Output:** `BridgeLifecycle` (`handle`, `snapshotNow`, `snapshotQuietly`).
- **Effects:** None (pure).
- **Errors:** None.

### `logSnapshotFailure`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async logSnapshotFailure(run: Promise<SnapshotOutcome>): Promise<void>`
- **Used by:** `connectors/whatsapp/src/lifecycle.ts (module)`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Awaits a snapshot and only logs the failure (without message data).
- **Input:** `run`: snapshot promise.
- **Output:** Nothing.
- **Effects:** `console.warn` if the snapshot fails.
- **Errors:** None (the failure becomes a log warning).

### `resetBridge`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async resetBridge(host: BridgeHost): Promise<Response>`
- **Used by:** `routeBridgeRequest()`
- **Processes:** P14, P15

<!-- generated:end -->

- **Does:** Starts from scratch: archives the current snapshot and stops the container (the next use starts empty).
- **Input:** `host`: Durable Object port.
- **Output:** JSON `{ reset: true, archived }`.
- **Effects:** Copies and deletes the snapshot in R2; stops the container.
- **Errors:** Forwards the rejection from R2 or from `stop`.

### `routeBridgeRequest`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/lifecycle.ts`
- **Signature:** `async routeBridgeRequest(router: BridgeRouter, request: Request): Promise<Response>`
- **Used by:** `createBridgeLifecycle()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Handles a Worker request: internal routes (`/__snapshot`, `/__reset`) or forwarding to the bridge.
- **Input:** `router` (host and snapshot scheduler) and the request.
- **Output:** Response from the bridge, from the internal route, or 429 from the send limit.
- **Effects:** Network to the container; R2; Durable Object storage; may schedule a snapshot.
- **Errors:** Those of `ensureRestored`, `fetchBridge` and of the snapshot/reset.

## `connectors/whatsapp/src/pair-page.ts`

### `describePairStatus`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair-page.ts`
- **Signature:** `describePairStatus(status: BridgeStatus | null): string`
- **Used by:** `renderPairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Status sentence for the owner.
- **Input:** The bridge's `status` or `null`.
- **Output:** Sentence in Portuguese (no status, needs pairing, connecting or connected).
- **Effects:** None (pure).
- **Errors:** None.

### `pairForm`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair-page.ts`
- **Signature:** `pairForm(action: string, csrf: string, body: string): string`
- **Used by:** `maintenanceSection()`, `pairingSection()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** POST form with the anti-CSRF token and extra fields.
- **Input:** `action`, `csrf` and the fields' HTML.
- **Output:** HTML of the `<form>`.
- **Effects:** None (pure).
- **Errors:** None.

### `pairingSection`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair-page.ts`
- **Signature:** `pairingSection(view: PairPageView): string`
- **Used by:** `renderPairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Pairing block: request a code by phone number or show the QR.
- **Input:** `view`: page data.
- **Output:** HTML with the code or QR (if any) and the forms.
- **Effects:** None (pure).
- **Errors:** None.

### `maintenanceSection`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair-page.ts`
- **Signature:** `maintenanceSection(view: PairPageView): string`
- **Used by:** `renderPairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Maintenance block: log out, start from scratch (deletes the backup) and sign out.
- **Input:** `view`: page data.
- **Output:** HTML of the three forms.
- **Effects:** None (pure).
- **Errors:** None.

### `alertHtml`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair-page.ts`
- **Signature:** `alertHtml(view: PairPageView): string`
- **Used by:** `renderPairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Notice with the result of the last action: error, message or nothing.
- **Input:** `view`: page data.
- **Output:** HTML of the notice, or empty text.
- **Effects:** None (pure).
- **Errors:** None.

### `renderPairPage`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair-page.ts`
- **Signature:** `renderPairPage(view: PairPageView): string`
- **Used by:** `pairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Renders the complete `/pair` page.
- **Input:** `view`: e-mail, CSRF, status and action result.
- **Output:** Page HTML (with a 20 s refresh if it shows a code or QR).
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/whatsapp/src/pair.ts`

### `parseCookies`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `parseCookies(header: string | null): Record<string, string>`
- **Used by:** `isValidPairLogin()`, `readPairSession()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Reads the cookies of a `Cookie` header.
- **Input:** `header` (may be null).
- **Output:** Map name → value.
- **Effects:** None (pure).
- **Errors:** None.

### `redirectWithCookies`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `redirectWithCookies(location: string, cookies: readonly string[]): Response`
- **Used by:** `handlePairPost()`, `openPairSession()`, `routePairPost()`, `startPairLogin()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Redirect with cookies.
- **Input:** `location` and the list of `Set-Cookie`.
- **Output:** 302 `no-store` response with the cookies.
- **Effects:** None (pure).
- **Errors:** None.

### `readPairSession`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `readPairSession(app: PairApp, request: Request): string | null`
- **Used by:** `routePairRequest()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** The `/pair` session e-mail from the cookie; null if missing, expired or belonging to someone removed from the list.
- **Input:** `app` and the request.
- **Output:** Session e-mail or `null`.
- **Effects:** None (pure; reads the request cookie).
- **Errors:** None.

### `issuePairCsrf`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `issuePairCsrf(app: PairApp, email: string): string`
- **Used by:** `pairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Anti-CSRF token bound to the session e-mail.
- **Input:** `app` and the e-mail.
- **Output:** Sealed `pair_csrf` token valid for the session's lifetime.
- **Effects:** None (pure).
- **Errors:** None.

### `isTrustedPost`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `isTrustedPost(app: PairApp, request: Request, input: { csrf: string; email: string }): boolean`
- **Used by:** `handlePairPost()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Checks the form's anti-CSRF token and the request origin.
- **Input:** `app`, the request and `{ csrf, email }`.
- **Output:** `true` if the token is valid for the e-mail and the `Origin` matches the issuer's.
- **Effects:** None (pure).
- **Errors:** None.

### `startPairLogin`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `startPairLogin(app: PairApp): Response`
- **Used by:** `routePairRequest()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Starts the `/pair` login: redirects to GitHub with a sealed `state` and binds the browser with a nonce cookie.
- **Input:** `app`: `/pair` dependencies.
- **Output:** 302 to GitHub with the nonce cookie.
- **Effects:** Generates a random nonce (`crypto.randomUUID`).
- **Errors:** None.

### `isValidPairLogin`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `isValidPairLogin(app: PairApp, request: Request): boolean`
- **Used by:** `handlePairCallback()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Checks the `state` from the GitHub callback and this browser's nonce cookie.
- **Input:** `app` and the callback request.
- **Output:** `true` if the `state` is valid and the nonce matches the cookie.
- **Effects:** None (pure).
- **Errors:** None.

### `openPairSession`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `openPairSession(app: PairApp, email: string): Response`
- **Used by:** `handlePairCallback()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Opens the `/pair` session for the accepted e-mail and returns to the page.
- **Input:** `app` and the accepted e-mail.
- **Output:** 302 to `/pair` with the session cookie and the nonce cookie cleared.
- **Effects:** None (pure).
- **Errors:** None.

### `handlePairCallback`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `async handlePairCallback(app: PairApp, request: Request): Promise<Response>`
- **Used by:** `routePairRequest()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** GitHub callback on `/pair`: checks `state` and nonce, completes the login and opens the session.
- **Input:** `app` and the callback request.
- **Output:** 302 with the session; HTML 400 (login expired or from another browser) or 403 (login refused).
- **Effects:** Network: `fetch` to GitHub (token and e-mails).
- **Errors:** None (a login failure becomes a 403 page).

### `pairDeadline`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `pairDeadline(app: PairApp): number`
- **Used by:** `connectors/whatsapp/src/pair.ts (module)`, `fetchPairStatus()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Deadline (Unix ms) for a `/pair` call to the bridge.
- **Input:** `app`.
- **Output:** `Date.now()` plus `timeoutMs`.
- **Effects:** Reads the clock.
- **Errors:** None.

### `fetchPairStatus`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `async fetchPairStatus(app: PairApp): Promise<BridgeStatus | null>`
- **Used by:** `pairPage()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Reads the bridge status; null if it does not respond in time.
- **Input:** `app`.
- **Output:** `BridgeStatus` or `null`.
- **Effects:** Network: `GET /status` on the bridge.
- **Errors:** None (any failure returns `null`).

### `pairPage`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `async pairPage(app: PairApp, email: string, extra: Partial<PairPageView> = {}): Promise<Response>`
- **Used by:** `handlePairPost()`, `routePairRequest()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Shows the page with the current status and the result of an action (code, QR, message or error).
- **Input:** `app`, the e-mail and the action result (optional).
- **Output:** HTML response of the `/pair` page.
- **Effects:** Network: `GET /status` on the bridge.
- **Errors:** None (an unavailable status becomes `null`).

### `handlePairPost`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `async handlePairPost(app: PairApp, request: Request, email: string): Promise<Response>`
- **Used by:** `routePairPost()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Handles an already-authenticated `/pair` POST: sign out, or run the action and show the page.
- **Input:** `app`, the request and the session e-mail.
- **Output:** Page with the result; 302 on sign-out; HTML 403 (invalid form) or 404.
- **Effects:** Reads the body; network to the bridge for the action; clears the cookie on sign-out.
- **Errors:** None (an action failure becomes an error on the page).

### `routePairPost`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `routePairPost(app: PairApp, request: Request, email: string | null): Promise<Response>`
- **Used by:** `routePairRequest()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Routes a `/pair` POST: without a session, goes back to login; with a session, runs the action.
- **Input:** `app`, the request and the session e-mail (or `null`).
- **Output:** 302 to `/pair` or the response from `handlePairPost`.
- **Effects:** Those of `handlePairPost`.
- **Errors:** None.

### `isPairPath`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `isPairPath(path: string): boolean`
- **Used by:** `routePairRequest()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Tells whether the path belongs to `/pair`.
- **Input:** `path`: URL path.
- **Output:** `true` for `/pair`, `/pair/*` and the `/pair` GitHub callback.
- **Effects:** None (pure).
- **Errors:** None.

### `routePairRequest`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `async routePairRequest(app: PairApp, request: Request): Promise<Response | null>`
- **Used by:** `handleWhatsAppFetch()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Routes `/pair` requests; null if the path is not part of `/pair`.
- **Input:** `app` and the request.
- **Output:** Route response, HTML 404 or `null` outside `/pair`.
- **Effects:** Those of the routes (network to GitHub and the bridge, cookies).
- **Errors:** None.

### `pairCookie`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `pairCookie(name: string, value: string, maxAge: number): string`
- **Used by:** `handlePairPost()`, `openPairSession()`, `startPairLogin()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Builds a secure `Set-Cookie` (HttpOnly, Secure, SameSite=Lax); `maxAge` 0 deletes it.
- **Input:** `name`, `value` and `maxAge` (seconds).
- **Output:** Value of the `Set-Cookie` header.
- **Effects:** None (pure).
- **Errors:** None.

### `pairActionError`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/pair.ts`
- **Signature:** `pairActionError(error: unknown): Partial<PairPageView>`
- **Used by:** `handlePairPost()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Error message of an action.
- **Input:** `error`: any thrown value.
- **Output:** `{ error: mensagem }`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/whatsapp/src/snapshots.ts`

### `storedGeneration`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `storedGeneration(meta: Pick<SnapshotObject, 'customMetadata'> | null): number`
- **Used by:** `storeSnapshot()`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Reads the generation stored in an object's metadata; 0 if missing or invalid.
- **Input:** `meta`: bucket object (or `null`).
- **Output:** Generation (positive integer) or 0.
- **Effects:** None (pure).
- **Errors:** None.

### `readUploadHeaders`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `readUploadHeaders(headers: Headers): { readonly length: number; readonly generation: number } | null`
- **Used by:** `acceptSnapshotPush()`, `storeSnapshotResponse()`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Reads size and generation from a snapshot response's headers; null if missing or invalid.
- **Input:** `headers`: `content-length` and `x-snapshot-generation`.
- **Output:** `{ length, generation }` or `null`.
- **Effects:** None (pure).
- **Errors:** None.

### `storeSnapshot`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `async storeSnapshot(bucket: SnapshotBucket, upload: SnapshotUpload, fixedLength: FixedLength): Promise<SnapshotOutcome>`
- **Used by:** `acceptSnapshotPush()`, `storeSnapshotResponse()`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Writes the snapshot if its generation is newer than the bucket's; otherwise discards the stream and reports `stale`.
- **Input:** `bucket`, `upload` (body, size, generation) and `fixedLength`.
- **Output:** `saved` or `stale`.
- **Effects:** Reads the metadata and writes to R2; cancels the stream if outdated.
- **Errors:** Forwards the R2 rejection.

### `storeSnapshotResponse`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `async storeSnapshotResponse(bucket: SnapshotBucket, res: Response, fixedLength: FixedLength): Promise<SnapshotOutcome>`
- **Used by:** `snapshotBridge()`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Stores the bridge's `GET /snapshot` response: 204 is `unchanged`; invalid headers throw.
- **Input:** `bucket`, the bridge response and `fixedLength`.
- **Output:** `saved`, `stale` or `unchanged` (204 with no change, or 503 while the bridge is still starting).
- **Effects:** Writes to R2; cancels the body if invalid.
- **Errors:** Rejects with `Error` if the response is not 2xx or the headers are invalid.

### `archiveSnapshot`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `async archiveSnapshot(bucket: SnapshotBucket, now: Date, fixedLength: FixedLength): Promise<boolean>`
- **Used by:** `resetBridge()`
- **Processes:** P14, P15

<!-- generated:end -->

- **Does:** Moves the current snapshot out of the way (keeps a dated copy) to start from scratch.
- **Input:** `bucket`, `now` (file date) and `fixedLength`.
- **Output:** `true` if there was a snapshot to archive.
- **Effects:** Reads, copies to `whatsapp/archive/` and deletes in R2.
- **Errors:** Forwards the R2 rejection.

### `sameSecret`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `sameSecret(given: string, expected: string): boolean`
- **Used by:** `acceptSnapshotPush()`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Compares two strings in constant time (for tokens).
- **Input:** `given` and `expected`.
- **Output:** `true` if equal and `expected` is not empty.
- **Effects:** None (pure).
- **Errors:** None.

### `acceptSnapshotPush`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `async acceptSnapshotPush(bucket: SnapshotBucket, request: Request, options: { readonly token: string; readonly fixedLength: FixedLength }): Promise<Response>`
- **Used by:** `connectors/whatsapp/src/container.ts (module)`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Receives the snapshot the bridge sends on its own on `SIGTERM` (best effort): checks the token and writes it.
- **Input:** `bucket`, the PUT request and options (`token`, `fixedLength`).
- **Output:** JSON `{ outcome }`; 403 without a valid token or if not PUT; 400 without headers or body.
- **Effects:** Writes to R2.
- **Errors:** Forwards the R2 rejection.

### `pumpInto`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/snapshots.ts`
- **Signature:** `async pumpInto(source: ReadableStream<Uint8Array>, writable: WritableStream<Uint8Array>): Promise<void>`
- **Used by:** `workersFixedLength()`
- **Processes:** P16

<!-- generated:end -->

- **Does:** Copies one stream to another chunk by chunk, without `pipeTo` (which Workers refuses between internal streams, which kept the snapshot from reaching R2).
- **Input:** `source`: source stream (bridge body); `writable`: destination (write side of the `FixedLengthStream`).
- **Output:** Promise that resolves when the copy finishes or fails.
- **Effects:** Reads `source` and writes to `writable`; closes the destination at the end.
- **Errors:** Never rejects: an error on either side aborts the destination and cancels the source, and whoever reads the destination (the R2 `put`) receives the error.

## `connectors/whatsapp/src/tools.ts`

### `toolDeadline`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `toolDeadline(ctx: WhatsAppToolContext): number`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`, `runRead()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Final deadline (Unix ms) for a call that starts now.
- **Input:** `ctx`: tool context.
- **Output:** `now()` plus `toolTimeoutMs`.
- **Effects:** Reads the context clock.
- **Errors:** None.

### `syncWaitBudget`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `syncWaitBudget(ctx: WhatsAppToolContext, deadline: number): number`
- **Used by:** `waitForSync()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** How long to ask the bridge to wait for the sync, without eating into the query's slack.
- **Input:** `ctx` and the `deadline` (Unix ms).
- **Output:** Milliseconds (0 or more, up to `syncWaitMs`).
- **Effects:** Reads the context clock.
- **Errors:** None.

### `prepareRead`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `async prepareRead(ctx: WhatsAppToolContext, deadline: number): Promise<string | null>`
- **Used by:** `runRead()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Waits for the sync within the budget; throws if pairing is needed and returns the partial-result warning.
- **Input:** `ctx` and the `deadline` (Unix ms).
- **Output:** Partial-result warning or `null`.
- **Effects:** Network: `POST /sync/wait` on the bridge (through `waitForSync()`).
- **Errors:** Rejects if WhatsApp is not paired; those of `bridgeJson`.

### `runRead`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `async runRead(ctx: WhatsAppToolContext, query: (deadline: number) => Promise<T>): Promise<T | { readonly warning: string; readonly result: T }>`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Runs a read with an overall deadline: waits for the sync, queries the bridge and attaches the warning (if any).
- **Input:** `ctx` and the query (receives the deadline).
- **Output:** Query result, or `{ warning, result }`.
- **Effects:** Network: calls to the bridge.
- **Errors:** Rejects if the overall deadline runs out; forwards those of `prepareRead` and of the query.

### `compactContact`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `compactContact(contact: Readonly<Record<string, string | null>>): Record<string, unknown>`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Compact contact, with cleaned names.
- **Input:** `contact`: bridge contact.
- **Output:** Object with `jid`, `name` and, when present, `phone`.
- **Effects:** None (pure).
- **Errors:** None.

### `mediaResult`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `mediaResult(res: Response, bytes: Uint8Array, messageId: string): RawToolResult`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P14

<!-- generated:end -->

- **Does:** `get_media` result: a description line and the file as an MCP block.
- **Input:** Bridge response (headers), the bytes and the message id.
- **Output:** `RawToolResult` with the text and the binary block.
- **Effects:** None (pure).
- **Errors:** None.

### `allowedRecipient`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `allowedRecipient(settings: WhatsAppSettings, recipient: string): string`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`
- **Processes:** P17

<!-- generated:end -->

- **Does:** Validates the recipient (`normalizeRecipient()`) and, if `SEND_ALLOWLIST` has items, requires it to be on the list; empty allows any contact or group.
- **Input:** `settings` and the recipient (number or JID).
- **Output:** Normalized JID.
- **Effects:** None (pure).
- **Errors:** Throws `Error` if the recipient is invalid or not on a non-empty allowlist.

### `whatsappTools`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `whatsappTools(settings: WhatsAppSettings): ToolSpec<WhatsAppToolContext>[]`
- **Used by:** `createWhatsAppMcpServer()`
- **Processes:** P13, P14

<!-- generated:end -->

- **Does:** Active tools: the read tools and, only with `ENABLE_SEND`, the send tool.
- **Input:** `settings`.
- **Output:** List of `ToolSpec`.
- **Effects:** None (pure).
- **Errors:** None.

### `createWhatsAppMcpServer`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `createWhatsAppMcpServer(ctx: WhatsAppToolContext): McpServer`
- **Used by:** `whatsappRemoteConnector()`
- **Processes:** P13, P14

<!-- generated:end -->

- **Does:** Creates the WhatsApp MCP server with the active tools.
- **Input:** `ctx`: tool context.
- **Output:** `McpServer` with instructions and registered tools.
- **Effects:** None (pure).
- **Errors:** None.

### `decodeHeaderText`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `decodeHeaderText(value: string | null): string`
- **Used by:** `mediaResult()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Decodes a percent-encoded UTF-8 header (how the bridge sends the file name); invalid values stay as received.
- **Input:** `value`: header value or null.
- **Output:** Decoded text; `""` if null/empty; the original value if the encoding is invalid.
- **Effects:** None (pure).
- **Errors:** None (the `decodeURIComponent` error is caught).

### `waitForSync`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `async waitForSync(ctx: WhatsAppToolContext, deadline: number): Promise<BridgeStatus>`
- **Used by:** `connectors/whatsapp/src/tools.ts (module)`, `prepareRead()`
- **Processes:** P14

<!-- generated:end -->

- **Does:** Asks the bridge to wait for the sync within the budget from `syncWaitBudget()` and returns its status.
- **Input:** `ctx` and the `deadline` (Unix ms).
- **Output:** The bridge status, with `partial: true` if the wait ran out first.
- **Effects:** Network: `POST /sync/wait` on the bridge.
- **Errors:** Those of `bridgeJson`.

## `connectors/whatsapp/src/worker-env.ts`

### `bridgeStub`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker-env.ts`
- **Signature:** `bridgeStub(env: WhatsAppEnv): BridgeStub`
- **Used by:** `handleWhatsAppFetch()`, `runScheduledSync()`
- **Processes:** P13, P14, P17

<!-- generated:end -->

- **Does:** Returns the stub of the bridge's single instance.
- **Input:** `env`: Worker bindings.
- **Output:** Stub of the Durable Object named `BRIDGE_INSTANCE_NAME`.
- **Effects:** None (pure).
- **Errors:** None.

### `bridgeFetchFor`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker-env.ts`
- **Signature:** `bridgeFetchFor(stub: BridgeStub): BridgeFetch`
- **Used by:** `handleWhatsAppFetch()`, `runScheduledSync()`
- **Processes:** P13, P14, P17

<!-- generated:end -->

- **Does:** Function that talks to the bridge through the stub, with relative paths (`/status`, `/chats?...`).
- **Input:** Durable Object `stub`.
- **Output:** `BridgeFetch`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/whatsapp/src/worker.ts`

### `unixNow`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `unixNow(): number`
- **Used by:** `createWhatsAppApps()`
- **Processes:** P13

<!-- generated:end -->

- **Does:** Clock in Unix seconds.
- **Input:** Nothing.
- **Output:** Integer Unix seconds.
- **Effects:** Reads the clock.
- **Errors:** None.

### `githubSettingsFrom`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `githubSettingsFrom(settings: WhatsAppSettings): GithubLoginSettings`
- **Used by:** `createWhatsAppApps()`, `whatsappRemoteConnector()`
- **Processes:** P13

<!-- generated:end -->

- **Does:** Owner GitHub login configuration derived from the connector configuration.
- **Input:** Connector `settings`.
- **Output:** `GithubLoginSettings` with the global `fetch`.
- **Effects:** None (pure).
- **Errors:** None.

### `whatsappRemoteConnector`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `whatsappRemoteConnector(settings: WhatsAppSettings, bridge: BridgeFetch, issuer: string): RemoteConnector`
- **Used by:** `createWhatsAppApps()`
- **Processes:** P13

<!-- generated:end -->

- **Does:** Builds the WhatsApp remote connector: GitHub login and an MCP server wired to the bridge.
- **Input:** `settings`, `bridge` and the `issuer`.
- **Output:** `RemoteConnector`.
- **Effects:** None (pure).
- **Errors:** None.

### `createWhatsAppApps`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `createWhatsAppApps(vars: EnvVars, bridge: BridgeFetch, origin: string): WhatsAppApps`
- **Used by:** `handleWhatsAppFetch()`
- **Processes:** P13

<!-- generated:end -->

- **Does:** Builds the Worker apps from the environment, the bridge and the request origin.
- **Input:** `vars`, `bridge` and the request origin.
- **Output:** `WhatsAppApps` (`remote` and `pair`).
- **Effects:** None (pure).
- **Errors:** Throws `Error` if the environment configuration is invalid.

### `handleWhatsAppFetch`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `async handleWhatsAppFetch(request: Request, env: WhatsAppEnv): Promise<Response>`
- **Used by:** `connectors/whatsapp/src/worker.ts (module)`
- **Processes:** P13

<!-- generated:end -->

- **Does:** Handles a request: `/pair` first, then OAuth and `/mcp`; invalid configuration becomes an explained 500.
- **Input:** The request and the Worker environment.
- **Output:** HTTP response.
- **Effects:** Network (bridge, GitHub), cookies and whatever the remote handler does.
- **Errors:** None (invalid configuration becomes a 500 response).

### `isSyncCronEnabled`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `isSyncCronEnabled(vars: EnvVars, cron: string): boolean`
- **Used by:** `runScheduledSync()`
- **Processes:** P17

<!-- generated:end -->

- **Does:** Tells whether the cron that fired is the optional sync configured in `SYNC_CRON`.
- **Input:** `vars` and the cron that fired.
- **Output:** `true` if `SYNC_CRON` is set and equal.
- **Effects:** None (pure).
- **Errors:** Throws `Error` if the environment configuration is invalid.

### `runScheduledSync`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/worker.ts`
- **Signature:** `async runScheduledSync(env: WhatsAppEnv, cron: string): Promise<string>`
- **Used by:** `connectors/whatsapp/src/worker.ts (module)`
- **Processes:** P17

<!-- generated:end -->

- **Does:** Optional periodic sync: wakes the bridge, waits for pending messages (up to 20 s), stores the snapshot and lets it sleep.
- **Input:** The Worker environment and the cron that fired.
- **Output:** `disabled` or the snapshot result (`saved`, `unchanged`, `stale`, `unknown`).
- **Effects:** Network: `/sync/wait` and `/__snapshot` on the bridge (which writes to R2).
- **Errors:** Rejects if the 50 s deadline runs out or the configuration is invalid.

## `src/remote/github-login.ts`

### `githubAuthorizeUrl`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `githubAuthorizeUrl(settings: GithubLoginSettings, state: string, callbackUrl: string): string`
- **Used by:** `githubUpstreamLogin()`, `startPairLogin()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Address of GitHub's authorization screen, requesting read access to emails only.
- **Input:** `settings`, `state` and `callbackUrl`.
- **Output:** URL of `github.com/login/oauth/authorize` with scope `user:email`.
- **Effects:** None (pure).
- **Errors:** None.

### `parseEmailList`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `parseEmailList(raw: string | null): string[]`
- **Used by:** `readAllowedEmails()`
- **Processes:** P13, P17

<!-- generated:end -->

- **Does:** Reads a comma-separated list of emails, lowercased and without empties.
- **Input:** `raw` (may be null).
- **Output:** List of emails (only items with `@`).
- **Effects:** None (pure).
- **Errors:** None.

### `pickAllowedEmail`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `pickAllowedEmail(emails: readonly GithubEmail[], allowed: readonly string[]): string | null`
- **Used by:** `finishGithubLogin()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Picks the first verified email that is on the list; null if none qualifies.
- **Input:** GitHub `emails` and the allowed list.
- **Output:** Lowercased email or `null`.
- **Effects:** None (pure).
- **Errors:** None.

### `exchangeGithubCode`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `async exchangeGithubCode(settings: GithubLoginSettings, code: string, callbackUrl: string): Promise<string>`
- **Used by:** `finishGithubLogin()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Exchanges the GitHub code for an access token; rejects with a user-facing message on failure.
- **Input:** `settings`, `code` and `callbackUrl`.
- **Output:** GitHub access token.
- **Effects:** Network: `POST` to `github.com/login/oauth/access_token`.
- **Errors:** Rejects with `Error` if the response is not 2xx or lacks `access_token`.

### `fetchGithubEmails`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `async fetchGithubEmails(settings: GithubLoginSettings, token: string): Promise<GithubEmail[]>`
- **Used by:** `finishGithubLogin()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Reads the GitHub account's emails with the access token.
- **Input:** `settings` and the token.
- **Output:** List of `GithubEmail` (empty if the body is not a list).
- **Effects:** Network: `GET api.github.com/user/emails`.
- **Errors:** Rejects with `Error` if GitHub does not answer 2xx.

### `finishGithubLogin`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `async finishGithubLogin(settings: GithubLoginSettings, query: URLSearchParams, callbackUrl: string): Promise<string>`
- **Used by:** `githubUpstreamLogin()`, `handlePairCallback()`
- **Processes:** P13, P15

<!-- generated:end -->

- **Does:** Finishes the login: checks GitHub's callback and returns the accepted email, or rejects with an explanation.
- **Input:** `settings`, the callback query and `callbackUrl`.
- **Output:** Accepted email, lowercased.
- **Effects:** Network: code exchange and email read on GitHub.
- **Errors:** Rejects with `Error` if there is no `code`, the exchange fails or no verified email is on the list.

### `githubUpstreamLogin`

<!-- generated:start -->

- **File:** `src/remote/github-login.ts`
- **Signature:** `githubUpstreamLogin(settings: GithubLoginSettings): UpstreamLogin`
- **Used by:** `whatsappRemoteConnector()`
- **Processes:** P13

<!-- generated:end -->

- **Does:** GitHub login for the remote connector, in the format the remote server expects.
- **Input:** Login `settings`.
- **Output:** `UpstreamLogin` with `start` and `finish`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/gmail/src/accounts.ts`

### `aliasAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/accounts.ts`
- **Signature:** `aliasAccounts(accounts: readonly LinkedAccount[]): AccountRef[]`
- **Used by:** `ownerRefs()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Gives each linked account the alias used in the tools.
- **Input:** `accounts`: the user's linked accounts.
- **Output:** List of `AccountRef`: the alias is the part before `@`, or the whole email when two accounts share it.
- **Effects:** None (pure).
- **Errors:** None.

### `noAccountsError`

<!-- generated:start -->

- **File:** `connectors/gmail/src/accounts.ts`
- **Signature:** `noAccountsError(): Error`
- **Used by:** `resolveAccounts()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Builds the error for a user who has not linked any account yet.
- **Input:** None.
- **Output:** `Error` that points to `link_account`.
- **Effects:** None (pure).
- **Errors:** None.

### `accountAlias`

<!-- generated:start -->

- **File:** `connectors/gmail/src/accounts.ts`
- **Signature:** `accountAlias(email: string): string`
- **Used by:** `aliasAccounts()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Extracts the alias from an email: the part before `@`, lowercased.
- **Input:** `email`: full address.
- **Output:** The alias (e.g. `musica.nova`).
- **Effects:** None (pure).
- **Errors:** None.

### `resolveAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/accounts.ts`
- **Signature:** `resolveAccounts(refs: readonly AccountRef[], requested: string): AccountRef[]`
- **Used by:** `resolveOwnerAccounts()`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Resolves the `account` parameter against the user's accounts.
- **Input:** `refs`: accounts with alias. `requested`: alias, email or `all` (case-insensitive).
- **Output:** All accounts for `all`; otherwise the list with the matching account.
- **Effects:** None (pure).
- **Errors:** Throws `noAccountsError()` with no accounts; throws an error listing the valid aliases if no account matches.

### `writeAccessError`

<!-- generated:start -->

- **File:** `connectors/gmail/src/accounts.ts`
- **Signature:** `writeAccessError(alias: string): Error`
- **Used by:** `requireWriteAccess()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Builds the error for an account linked read-only, asking to relink via `link_account`.
- **Input:** `alias`: account alias.
- **Output:** Actionable `Error`.
- **Effects:** None (pure).
- **Errors:** None.

### `requireWriteAccess`

<!-- generated:start -->

- **File:** `connectors/gmail/src/accounts.ts`
- **Signature:** `requireWriteAccess(ref: AccountRef): void`
- **Used by:** `gmailWrite()`, `resolveWritableAccount()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Requires the `gmail.modify` scope on the account's token.
- **Input:** `ref`: linked account.
- **Output:** Nothing.
- **Effects:** None (pure).
- **Errors:** Throws `writeAccessError()` if the account was linked read-only.

## `connectors/gmail/src/token-store.ts`

### `ownerKey`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `ownerKey(owner: string): string`
- **Used by:** `loadOwnerAccounts()`, `saveOwnerAccounts()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Builds the KV key of the user's record.
- **Input:** `owner`: user (Google `sub`).
- **Output:** `owner:<sha256>`, without the id in clear text.
- **Effects:** None (pure).
- **Errors:** None.

### `toLinkedAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `toLinkedAccount(value: unknown): LinkedAccount | null`
- **Used by:** `openOwnerAccounts()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Converts a sealed item into a linked account.
- **Input:** `value`: item read from the record.
- **Output:** `LinkedAccount` with defaults for missing fields; null without email or refresh token.
- **Effects:** None (pure).
- **Errors:** None.

### `sealOwnerAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `sealOwnerAccounts(owner: string, accounts: readonly LinkedAccount[], key: Buffer): string`
- **Used by:** `saveOwnerAccounts()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Seals a user's accounts to store in KV.
- **Input:** `owner`: user. `accounts`: accounts. `key`: `TOKEN_ENC_KEY`.
- **Output:** AES-256-GCM seal in base64url.
- **Effects:** None (pure, except the random IV).
- **Errors:** None.

### `openOwnerAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `openOwnerAccounts(sealed: string, key: Buffer, owner: string): LinkedAccount[]`
- **Used by:** `loadOwnerAccounts()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Opens the user's record, checking the owner.
- **Input:** `sealed`: KV seal. `key`: `TOKEN_ENC_KEY`. `owner`: expected user.
- **Output:** Valid accounts; empty if the key, content or owner do not match.
- **Effects:** None (pure).
- **Errors:** None.

### `loadOwnerAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `async loadOwnerAccounts(kv: KvStore, key: Buffer, owner: string): Promise<LinkedAccount[]>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `markAccountRevoked()`, `ownerRefs()`, `storeGoogleAccount()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Reads the user's linked accounts.
- **Input:** `kv`: KV. `key`: `TOKEN_ENC_KEY`. `owner`: user.
- **Output:** The user's accounts; empty if none linked yet.
- **Effects:** KV: one read.
- **Errors:** Propagates KV failures.

### `saveOwnerAccounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `async saveOwnerAccounts(kv: KvStore, key: Buffer, record: { readonly owner: string; readonly accounts: readonly LinkedAccount[] }): Promise<void>`
- **Used by:** `connectors/gmail/src/tools.ts (module)`, `markAccountRevoked()`, `storeGoogleAccount()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Stores the user's accounts in KV.
- **Input:** `kv`: KV. `key`: `TOKEN_ENC_KEY`. `record`: user and accounts.
- **Output:** Nothing.
- **Effects:** KV: writes the sealed record, or deletes it when no account is left.
- **Errors:** Propagates KV failures.

### `upsertAccount`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `upsertAccount(accounts: readonly LinkedAccount[], account: LinkedAccount): LinkedAccount[]`
- **Used by:** `storeGoogleAccount()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Adds or replaces the account in the list by email.
- **Input:** `accounts`: current accounts. `account`: new or renewed account.
- **Output:** New list with the account at the end.
- **Effects:** None (pure).
- **Errors:** Throws if it would exceed `MAX_LINKED_ACCOUNTS`.

### `sha256Hex`

<!-- generated:start -->

- **File:** `connectors/gmail/src/token-store.ts`
- **Signature:** `sha256Hex(text: string): string`
- **Used by:** `linkRequestKey()`, `ownerKey()`, `redeemLinkTicket()`, `startAccountLink()`, `takeLinkRequest()`
- **Processes:** P10, P11, P12, P18

<!-- generated:end -->

- **Does:** Computes SHA-256 in hexadecimal.
- **Input:** `text`: text to hash.
- **Output:** 64 hexadecimal characters.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/gmail/src/compose.ts`

### `prefixSubject`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `prefixSubject(subject: string, prefix: 'Re' | 'Fwd'): string`
- **Used by:** `forwardEmail()`, `replyEmail()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Adds `Re:` or `Fwd:` to the subject without repeating the prefix.
- **Input:** `subject`; `prefix`: `Re` or `Fwd`.
- **Output:** The subject.
- **Effects:** None (pure).
- **Errors:** None.

### `threadingHeaders`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `threadingHeaders(headers: ReadonlyMap<string, string>): ThreadingHeaders`
- **Used by:** `replyEmail()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Computes the reply's `In-Reply-To` and `References` from the original.
- **Input:** `headers`: original's headers, lowercased.
- **Output:** `{ inReplyTo, references }` (null if absent).
- **Effects:** None (pure).
- **Errors:** None.

### `uniqueAddresses`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `uniqueAddresses(addresses: readonly MailAddress[], exclude: ReadonlySet<string>): MailAddress[]`
- **Used by:** `replyRecipients()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Removes repeated and excluded addresses, case-insensitively.
- **Input:** `addresses`; `exclude`: lowercased emails.
- **Output:** List without repeats.
- **Effects:** None (pure).
- **Errors:** None.

### `replyToList`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `replyToList(headers: ReadonlyMap<string, string>, self: string, replyAll: boolean): MailAddress[]`
- **Used by:** `replyRecipients()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Reply `To` candidates: sender (or `Reply-To`), plus `To` with `replyAll`, or the recipients if the original was sent by the account.
- **Input:** `headers`; `self`: account email, lowercased; `replyAll`.
- **Output:** List of addresses.
- **Effects:** None (pure).
- **Errors:** None.

### `replyRecipients`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `replyRecipients(headers: ReadonlyMap<string, string>, selfEmail: string, replyAll: boolean): { to: MailAddress[]; cc: MailAddress[] }`
- **Used by:** `replyEmail()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Computes the reply's `To` and `Cc`, without the account itself and without repeats.
- **Input:** `headers`; `selfEmail`; `replyAll`.
- **Output:** `{ to, cc }`.
- **Effects:** None (pure).
- **Errors:** Throws if no recipient is left.

### `quotedText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `quotedText(message: GmailMessage): string`
- **Used by:** `replyEmail()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Quotes the original with `> ` after "Em <data>, <remetente> escreveu:".
- **Input:** `message`: original in `full` format.
- **Output:** Quoted text (up to 20 thousand characters of the original).
- **Effects:** None (pure).
- **Errors:** None.

### `forwardedText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `forwardedText(message: GmailMessage): string`
- **Used by:** `forwardEmail()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Forwarded email block: separator, headers and body of the original.
- **Input:** `message`: original.
- **Output:** Block text.
- **Effects:** None (pure).
- **Errors:** None.

### `replyEmail`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `replyEmail(message: GmailMessage, options: ReplyOptions): PreparedEmail`
- **Used by:** `prepareReply()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Builds the reply: recipients, `Re:`, kept thread and quoted original.
- **Input:** `message`: original; `options`: text, `replyAll` and account email.
- **Output:** `PreparedEmail` with the original's `threadId`.
- **Effects:** None (pure).
- **Errors:** Those of `replyRecipients()`.

### `forwardEmail`

<!-- generated:start -->

- **File:** `connectors/gmail/src/compose.ts`
- **Signature:** `forwardEmail(message: GmailMessage, options: ForwardOptions): PreparedEmail`
- **Used by:** `prepareForward()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Builds the forward: `Fwd:`, note, original block and attachments, in a new thread.
- **Input:** `message`: original; `options`: recipients, note and attachments.
- **Output:** `PreparedEmail` without `threadId`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/gmail/src/draft-tools.ts`

### `draftArgs`

<!-- generated:start -->

- **File:** `connectors/gmail/src/draft-tools.ts`
- **Signature:** `draftArgs(args: DraftToolArgs): DraftArgs`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Converts the draft tools' parameters into the internal format.
- **Input:** `args`: validated parameters.
- **Output:** `DraftArgs`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/gmail/src/drafts.ts`

### `draftSummary`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `draftSummary(draft: GmailDraft): Record<string, unknown>`
- **Used by:** `listDrafts()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Summarizes a draft for `list_drafts`.
- **Input:** `draft`: Gmail API draft.
- **Output:** Ids, to, cc, subject, date and snippet.
- **Effects:** None (pure).
- **Errors:** None.

### `listDrafts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `async listDrafts(deps: OwnerDeps, ref: AccountRef, maxResults: number): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Lists the account's drafts and reads each one's headers.
- **Input:** `deps`, `ref`; `maxResults`.
- **Output:** `{ account, drafts }`.
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token.
- **Errors:** Propagates `gmailGet()` errors.

### `prepareDraftEmail`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `prepareDraftEmail(deps: OwnerDeps, ref: AccountRef, args: DraftArgs): Promise<PreparedEmail>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Builds the draft email: a reply to the original or a new email.
- **Input:** `deps`, `ref`; `args`: content and `replyToMessageId`.
- **Output:** `PreparedEmail`.
- **Effects:** Network only for a reply (reads the original).
- **Errors:** Those of `composeEmail()` or `prepareReply()`.

### `draftIds`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `draftIds(draft: GmailDraft): Record<string, unknown>`
- **Used by:** `createDraft()`, `draftSummary()`, `updateDraft()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Ids returned by a draft operation.
- **Input:** `draft`.
- **Output:** `{ draft_id, message_id, thread_id }` (null if missing).
- **Effects:** None (pure).
- **Errors:** None.

### `createDraft`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `async createDraft(deps: OwnerDeps, ref: AccountRef, prepared: PreparedEmail): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Creates a draft with the prepared email.
- **Input:** `deps`, `ref`; `prepared`.
- **Output:** `{ account, draft_id, message_id, thread_id }`.
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token.
- **Errors:** Throws `writeAccessError()` for a read-only account; propagates `gmailCall()` errors.

### `updateDraft`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `async updateDraft(deps: OwnerDeps, ref: AccountRef, change: { readonly draftId: string; readonly prepared: PreparedEmail }): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Replaces all content of a draft.
- **Input:** `deps`, `ref`; `change`: draft id and prepared email.
- **Output:** Draft ids.
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token.
- **Errors:** Throws `writeAccessError()` for a read-only account; propagates `gmailCall()` errors.

### `sendDraft`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `async sendDraft(deps: OwnerDeps, ref: AccountRef, draftId: string): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Sends an existing draft.
- **Input:** `deps`, `ref`; `draftId`.
- **Output:** Result of `sentResult()`.
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token. The email leaves the account.
- **Errors:** Throws `writeAccessError()` for a read-only account; propagates `gmailCall()` errors.

### `deleteDraft`

<!-- generated:start -->

- **File:** `connectors/gmail/src/drafts.ts`
- **Signature:** `async deleteDraft(deps: OwnerDeps, ref: AccountRef, draftId: string): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/draft-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Deletes a draft (sent messages are not touched).
- **Input:** `deps`, `ref`; `draftId`.
- **Output:** `{ account, deleted_draft }`.
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token.
- **Errors:** Throws `writeAccessError()` for a read-only account; propagates `gmailCall()` errors.

## `connectors/gmail/src/mailbox-tools.ts`

### `toggleAction`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox-tools.ts`
- **Signature:** `toggleAction(on: boolean, onAction: MailboxAction, offAction: MailboxAction): MailboxAction`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Picks the on or off action by the boolean parameter.
- **Input:** `on`; `onAction`; `offAction`.
- **Output:** The action.
- **Effects:** None (pure).
- **Errors:** None.

### `writableTargets`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox-tools.ts`
- **Signature:** `async writableTargets(deps: OwnerDeps, args: TargetArgs): Promise<{ ref: AccountRef; targets: MailTargets }>`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`, `runMailboxAction()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Resolves the writable account and the targets: the common start of the organizing tools.
- **Input:** `deps`; `args`: account, message_ids and thread_ids.
- **Output:** `{ ref, targets }`.
- **Effects:** KV: one read.
- **Errors:** Those of `resolveWritableAccount()` and `mailTargets()`.

### `runMailboxAction`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox-tools.ts`
- **Signature:** `async runMailboxAction(deps: OwnerDeps, args: TargetArgs, action: MailboxAction): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Applies a ready action (read, archive, star) to the arguments' targets.
- **Input:** `deps`; `args`; `action`.
- **Output:** Result of `applyLabelChange()`.
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token.
- **Errors:** Those of `writableTargets()` and `applyLabelChange()`.

## `connectors/gmail/src/mailbox.ts`

### `mailTargets`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `mailTargets(messageIds: readonly string[] | undefined, threadIds: readonly string[] | undefined): MailTargets`
- **Used by:** `writableTargets()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Builds the targets of a change (messages and threads).
- **Input:** `messageIds`, `threadIds` (optional).
- **Output:** `MailTargets`.
- **Effects:** None (pure).
- **Errors:** Throws if there is no id.

### `checkLabelChange`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `checkLabelChange(change: LabelChange): void`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Validates a label change.
- **Input:** `change`: add and remove.
- **Output:** Nothing.
- **Effects:** None (pure).
- **Errors:** Throws if there is no label or the same one is on both sides.

### `resolveLabelIds`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `resolveLabelIds(labels: readonly GmailLabel[], wanted: readonly string[]): string[]`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Converts labels requested by id or name (case-insensitive) into ids.
- **Input:** `labels`: the account's labels; `wanted`: ids or names.
- **Output:** List of ids.
- **Effects:** None (pure).
- **Errors:** Throws for an unknown label, suggesting `list_labels`.

### `fetchLabels`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `async fetchLabels(deps: OwnerDeps, ref: AccountRef): Promise<GmailLabel[]>`
- **Used by:** `accountLabels()`, `connectors/gmail/src/mailbox-tools.ts (module)`
- **Processes:** P12, P18

<!-- generated:end -->

- **Does:** Reads the account's labels.
- **Input:** `deps`, `ref`.
- **Output:** List of `GmailLabel` (empty without the field).
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token.
- **Errors:** Propagates `gmailGet()` errors.

### `applyLabelChange`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `async applyLabelChange(deps: OwnerDeps, ref: AccountRef, request: { readonly targets: MailTargets; readonly change: LabelChange }): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`, `runMailboxAction()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Adds and removes labels: `batchModify` on messages and `modify` on each thread.
- **Input:** `deps`, `ref`; `request`: targets and change.
- **Output:** Counts and changed labels.
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token.
- **Errors:** Throws `writeAccessError()` for a read-only account; propagates `gmailCall()` errors.

### `targetCounts`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `targetCounts(alias: string, targets: MailTargets): Record<string, unknown>`
- **Used by:** `applyLabelChange()`, `moveToTrash()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Counts the changed messages and threads.
- **Input:** `alias`; `targets`.
- **Output:** `{ account, messages, threads }`.
- **Effects:** None (pure).
- **Errors:** None.

### `moveToTrash`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mailbox.ts`
- **Signature:** `async moveToTrash(deps: OwnerDeps, ref: AccountRef, request: { readonly targets: MailTargets; readonly restore: boolean }): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/mailbox-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Moves messages and threads to the trash or restores them (no permanent deletion).
- **Input:** `deps`, `ref`; `request`: targets and `restore`.
- **Output:** Counts and the action (`trash`/`untrash`).
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token.
- **Errors:** Throws `writeAccessError()` for a read-only account; propagates `gmailCall()` errors.

## `connectors/gmail/src/mime.ts`

### `splitAddressList`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `splitAddressList(text: string): string[]`
- **Used by:** `parseAddressList()`, `parseRecipients()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Splits an address list by comma or semicolon, outside quotes and `<...>`.
- **Input:** `text`: list.
- **Output:** Trimmed items, without empties.
- **Effects:** None (pure).
- **Errors:** None.

### `parseMailAddress`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `parseMailAddress(item: string): MailAddress | null`
- **Used by:** `parseAddressList()`, `parseRecipients()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Reads `Nome <e-mail>`, `"Nome" <e-mail>` or `e-mail` and validates the email.
- **Input:** `item`: one address.
- **Output:** `{ name, email }`, or null if invalid (including with a line break).
- **Effects:** None (pure).
- **Errors:** None.

### `parseAddressList`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `parseAddressList(text: string): MailAddress[]`
- **Used by:** `replyRecipients()`, `replyToList()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Valid addresses of a header, discarding invalid ones.
- **Input:** `text`: header value.
- **Output:** List of `MailAddress`.
- **Effects:** None (pure).
- **Errors:** None.

### `parseRecipients`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `parseRecipients(items: readonly string[], field: string): MailAddress[]`
- **Used by:** `composeEmail()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Validates the recipients requested in a field.
- **Input:** `items`: addresses (one item may hold several); `field`: field name.
- **Output:** List of `MailAddress`.
- **Effects:** None (pure).
- **Errors:** Throws with the field and the invalid item.

### `cleanHeaderText`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `cleanHeaderText(text: string): string`
- **Used by:** `attachmentPart()`, `mimeHeaderLines()`, `parseMailAddress()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Replaces line breaks and tabs with spaces (prevents header injection).
- **Input:** `text`.
- **Output:** Single-line text, trimmed.
- **Effects:** None (pure).
- **Errors:** None.

### `isPrintableAscii`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `isPrintableAscii(text: string): boolean`
- **Used by:** `encodeHeaderWord()`, `formatMailAddress()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Tells whether the text has only printable ASCII.
- **Input:** `text`.
- **Output:** Boolean.
- **Effects:** None (pure).
- **Errors:** None.

### `encodeHeaderWord`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `encodeHeaderWord(text: string): string`
- **Used by:** `attachmentPart()`, `formatMailAddress()`, `mimeHeaderLines()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Encodes non-ASCII text into RFC 2047 `=?UTF-8?B?...?=` words of up to 75 characters.
- **Input:** `text`.
- **Output:** The text (ASCII) or the encoded words, folded with CRLF + space.
- **Effects:** None (pure).
- **Errors:** None.

### `formatMailAddress`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `formatMailAddress(address: MailAddress): string`
- **Used by:** `addressHeader()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Formats an address for the header (name quoted or encoded).
- **Input:** `address`.
- **Output:** `"Nome" <e-mail>`, `=?UTF-8?B?...?= <e-mail>` or just the email.
- **Effects:** None (pure).
- **Errors:** None.

### `addressHeader`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `addressHeader(name: string, addresses: readonly MailAddress[]): string[]`
- **Used by:** `mimeHeaderLines()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Builds an address header line.
- **Input:** `name`: To, Cc or Bcc; `addresses`.
- **Output:** One line, or none if the list is empty.
- **Effects:** None (pure).
- **Errors:** None.

### `messageIdList`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `messageIdList(text: string | undefined): string | null`
- **Used by:** `threadingHeaders()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Keeps only the `<...>` ids of a `Message-ID`/`References`.
- **Input:** `text`: header value (or nothing).
- **Output:** Space-separated ids, or null.
- **Effects:** None (pure).
- **Errors:** None.

### `mimeHeaderLines`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `mimeHeaderLines(email: OutgoingEmail): string[]`
- **Used by:** `buildMimeMessage()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Email headers: MIME version, recipients, subject and thread.
- **Input:** `email`: email to send.
- **Output:** List of lines.
- **Effects:** None (pure).
- **Errors:** None.

### `wrapBase64`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `wrapBase64(bytes: Uint8Array): string`
- **Used by:** `attachmentPart()`, `textPart()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Encodes bytes in base64 with 76-character lines.
- **Input:** `bytes`.
- **Output:** Base64 text with CRLF.
- **Effects:** None (pure).
- **Errors:** None.

### `textPart`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `textPart(body: string): string[]`
- **Used by:** `buildMimeMessage()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** UTF-8 plain-text part in base64, with CRLF breaks.
- **Input:** `body`: text.
- **Output:** Part lines (headers, empty line and content).
- **Effects:** None (pure).
- **Errors:** None.

### `safeMimeType`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `safeMimeType(mimeType: string): string`
- **Used by:** `attachmentPart()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Accepts only MIME types in `tipo/subtipo` form.
- **Input:** `mimeType`.
- **Output:** The type, or `application/octet-stream`.
- **Effects:** None (pure).
- **Errors:** None.

### `attachmentPart`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `attachmentPart(attachment: MailAttachment): string[]`
- **Used by:** `buildMimeMessage()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** MIME part of an attachment, with a cleaned and encoded name.
- **Input:** `attachment`: name, type and bytes.
- **Output:** Lines of the part.
- **Effects:** None (pure).
- **Errors:** None.

### `buildMimeMessage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `buildMimeMessage(email: OutgoingEmail, boundary: string): string`
- **Used by:** `gmailMessageResource()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Builds the full MIME message; with attachments it becomes `multipart/mixed`.
- **Input:** `email`; `boundary`: part boundary.
- **Output:** MIME text with CRLF.
- **Effects:** None (pure).
- **Errors:** None.

### `toRawMessage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/mime.ts`
- **Signature:** `toRawMessage(mime: string): string`
- **Used by:** `gmailMessageResource()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Encodes the MIME message in base64url (the Gmail API `raw` field).
- **Input:** `mime`.
- **Output:** Base64url text.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/gmail/src/send-tools.ts`

### `replyTool`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send-tools.ts`
- **Signature:** `replyTool(options: ReplyToolOptions): ToolSpec<OwnerDeps>`
- **Used by:** `connectors/gmail/src/send-tools.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Builds the reply tool (to the sender or to all) with the send annotations.
- **Input:** `options`: name, title, `replyAll` and description.
- **Output:** `ToolSpec`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/gmail/src/send.ts`

### `checkRecipientLimit`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `checkRecipientLimit(email: OutgoingEmail): void`
- **Used by:** `composeEmail()`, `prepareReply()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Requires at least one recipient in `to` and at most 100 in total.
- **Input:** `email`.
- **Output:** Nothing.
- **Effects:** None (pure).
- **Errors:** Throws an actionable error in both cases.

### `composeEmail`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `composeEmail(args: ComposeArgs): PreparedEmail`
- **Used by:** `connectors/gmail/src/send-tools.ts (module)`, `prepareDraftEmail()`, `prepareForward()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Builds a new email, without a thread, from the tool arguments.
- **Input:** `args`: to, cc, bcc, subject and body.
- **Output:** `PreparedEmail`.
- **Effects:** None (pure).
- **Errors:** Those of `parseRecipients()` and `checkRecipientLimit()`.

### `mimeBoundary`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `mimeBoundary(): string`
- **Used by:** `gmailMessageResource()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Generates a random MIME boundary that does not collide with base64.
- **Input:** None.
- **Output:** `=_part_<random>`.
- **Effects:** Reads the random generator.
- **Errors:** None.

### `gmailMessageResource`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `gmailMessageResource(prepared: PreparedEmail): { raw: string; threadId?: string }`
- **Used by:** `createDraft()`, `sendPrepared()`, `updateDraft()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Converts the prepared email into the Gmail API resource (`raw` and `threadId`).
- **Input:** `prepared`.
- **Output:** `{ raw, threadId? }`.
- **Effects:** Reads the random generator (boundary).
- **Errors:** None.

### `fetchFullMessage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `fetchFullMessage(deps: OwnerDeps, ref: AccountRef, messageId: string): Promise<GmailMessage>`
- **Used by:** `prepareForward()`, `prepareReply()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Reads a whole message (`full` format) to reply or forward.
- **Input:** `deps`, `ref`; `messageId`.
- **Output:** The `GmailMessage`.
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token.
- **Errors:** Propagates `gmailGet()` errors.

### `prepareReply`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `async prepareReply(deps: OwnerDeps, ref: AccountRef, request: ReplyRequest): Promise<PreparedEmail>`
- **Used by:** `prepareDraftEmail()`, `replyTool()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Reads the original and builds the reply (to the sender or to all).
- **Input:** `deps`, `ref`; `request`: id, text and `replyAll`.
- **Output:** `PreparedEmail`.
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token.
- **Errors:** Those of `fetchFullMessage()`, `replyEmail()` and `checkRecipientLimit()`.

### `forwardAttachments`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `async forwardAttachments(deps: OwnerDeps, ref: AccountRef, message: GmailMessage): Promise<MailAttachment[]>`
- **Used by:** `prepareForward()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Downloads the original's attachments for forwarding.
- **Input:** `deps`, `ref`; `message`: original.
- **Output:** List of `MailAttachment`.
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token.
- **Errors:** Throws if the total exceeds 18 MB (before downloading); propagates those of `downloadAttachment()`.

### `prepareForward`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `async prepareForward(deps: OwnerDeps, ref: AccountRef, request: ForwardRequest): Promise<PreparedEmail>`
- **Used by:** `connectors/gmail/src/send-tools.ts (module)`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Validates the recipients, reads the original and downloads its attachments for forwarding.
- **Input:** `deps`, `ref`; `request`: id, recipients and note.
- **Output:** `PreparedEmail`.
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token.
- **Errors:** Those of `composeEmail()`, `fetchFullMessage()` and `forwardAttachments()`.

### `sendPrepared`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `async sendPrepared(deps: OwnerDeps, ref: AccountRef, prepared: PreparedEmail): Promise<Record<string, unknown>>`
- **Used by:** `connectors/gmail/src/send-tools.ts (module)`, `replyTool()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Sends the prepared email via `messages/send`.
- **Input:** `deps`, `ref`; `prepared`.
- **Output:** Result of `sentResult()`.
- **Effects:** Network: Gmail API (and Google's token endpoint, on renewal). KV and isolate memory for the access token. The email leaves the account.
- **Errors:** Throws `writeAccessError()` for a read-only account; propagates `gmailCall()` errors.

### `sentResult`

<!-- generated:start -->

- **File:** `connectors/gmail/src/send.ts`
- **Signature:** `sentResult(alias: string, sent: { readonly id?: string; readonly threadId?: string }): Record<string, unknown>`
- **Used by:** `sendDraft()`, `sendPrepared()`
- **Processes:** P18

<!-- generated:end -->

- **Does:** Builds the result of a send.
- **Input:** `alias`; `sent`: Gmail response.
- **Output:** `{ account, sent, message_id, thread_id }` (null ids if missing).
- **Effects:** None (pure).
- **Errors:** None.

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
- **Effects:** None (pure).
- **Errors:** None.

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
- **Effects:** None (pure).
- **Errors:** None (a missing or invalid version falls back).

## `src/core/stream.ts`

### `splitBase64Ready`

<!-- generated:start -->

- **File:** `src/core/stream.ts`
- **Signature:** `splitBase64Ready(carry: Uint8Array, chunk: Uint8Array): { readonly ready: Uint8Array; readonly rest: Uint8Array }`
- **Used by:** `base64EncodeStream()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Splits carried and new bytes into a part ready to encode (a multiple of 3) and the rest to carry.
- **Input:** `carry`; `chunk`.
- **Output:** `{ ready, rest }`.
- **Effects:** None.
- **Errors:** None.

### `base64EncodeStream`

<!-- generated:start -->

- **File:** `src/core/stream.ts`
- **Signature:** `base64EncodeStream(): TransformStream<Uint8Array, Uint8Array>`
- **Used by:** `streamedToolResponse()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Encodes a byte stream as base64 piece by piece, carrying 0–2 bytes between chunks so the output equals encoding the whole buffer.
- **Input:** None.
- **Output:** `TransformStream` from bytes to the ASCII bytes of the base64.
- **Effects:** None (CPU only).
- **Errors:** None.

### `byteLimitStream`

<!-- generated:start -->

- **File:** `src/core/stream.ts`
- **Signature:** `byteLimitStream(maxBytes: number, message: string): TransformStream<Uint8Array, Uint8Array>`
- **Used by:** `readLimitedBytes()`, `streamCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Passes bytes through and fails as soon as the running total passes the limit.
- **Input:** `maxBytes`; `message` of the error.
- **Output:** `TransformStream` of bytes.
- **Effects:** None.
- **Errors:** Errors the stream with `Error(message)` above `maxBytes`.

### `framedStream`

<!-- generated:start -->

- **File:** `src/core/stream.ts`
- **Signature:** `framedStream(prefix: string, suffix: string): TransformStream<Uint8Array, Uint8Array>`
- **Used by:** `streamedToolResponse()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Writes a prefix before and a suffix after the content of a byte stream.
- **Input:** `prefix`; `suffix` (UTF-8 text).
- **Output:** `TransformStream` of bytes.
- **Effects:** None.
- **Errors:** None.

### `readLimitedBytes`

<!-- generated:start -->

- **File:** `src/core/stream.ts`
- **Signature:** `async readLimitedBytes(body: ReadableStream<Uint8Array> | null, maxBytes: number, message: string): Promise<Uint8Array>`
- **Used by:** `fetchFileBytes()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Reads a whole body into memory with a hard byte cap.
- **Input:** `body` (or `null`); `maxBytes`; `message` of the error.
- **Output:** `Uint8Array` (empty for `null`).
- **Effects:** Consumes the stream.
- **Errors:** Rejects with `Error(message)` as soon as the body passes `maxBytes`.

## `src/remote/streamed-tool.ts`

### `asJsonObject`

<!-- generated:start -->

- **File:** `src/remote/streamed-tool.ts`
- **Signature:** `asJsonObject(value: unknown): Record<string, unknown> | null`
- **Used by:** `parseToolCallRequest()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Narrows a JSON value to a plain object.
- **Input:** `value`: any parsed JSON.
- **Output:** The object as a record; `null` for arrays, primitives and `null`.
- **Effects:** None.
- **Errors:** None.

### `parseToolCallRequest`

<!-- generated:start -->

- **File:** `src/remote/streamed-tool.ts`
- **Signature:** `parseToolCallRequest(message: unknown): ToolCallRequest | null`
- **Used by:** `readToolCallRequest()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Reads a single JSON-RPC `tools/call` message (batches and other methods are ignored).
- **Input:** `message`: parsed JSON body.
- **Output:** `{ id, name, args }` (`args` defaults to `{}`); `null` otherwise.
- **Effects:** None.
- **Errors:** None.

### `readToolCallRequest`

<!-- generated:start -->

- **File:** `src/remote/streamed-tool.ts`
- **Signature:** `async readToolCallRequest(request: Request): Promise<ToolCallRequest | null>`
- **Used by:** `streamToolQuietly()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Reads the `tools/call` of an `/mcp` POST from a clone, so the request can still go to the MCP server.
- **Input:** `request`.
- **Output:** `ToolCallRequest`; `null` for non-POST, invalid JSON or another message.
- **Effects:** Reads a clone of the body.
- **Errors:** None (invalid JSON becomes `null`).

### `streamedResultFrame`

<!-- generated:start -->

- **File:** `src/remote/streamed-tool.ts`
- **Signature:** `streamedResultFrame(id: string | number, content: StreamedToolContent, marker: string): readonly [string, string]`
- **Used by:** `streamedToolResponse()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Serializes the JSON-RPC result of a streamed tool and splits it around the base64 data.
- **Input:** `id` of the call; `content`; `marker` absent from the text.
- **Output:** `[prefix, suffix]`.
- **Effects:** None.
- **Errors:** None.

### `streamedToolResponse`

<!-- generated:start -->

- **File:** `src/remote/streamed-tool.ts`
- **Signature:** `streamedToolResponse(id: string | number, content: StreamedToolContent): Response`
- **Used by:** `streamToolQuietly()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Builds the HTTP response of a streamed tool: prefix, the content encoded as base64 while it flows, suffix.
- **Input:** `id` of the call; `content` (`StreamedToolContent`).
- **Output:** `Response` 200, `application/json`, streamed body.
- **Effects:** None until read (then reads `content.body`).
- **Errors:** The body errors if the source stream errors (e.g. over the cap).

## Data and constants

| Name                         | File                                       | What it is                                                                                                      |
| ---------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `CANVAS_USER_AGENT`          | `connectors/canvas-puc/src/remote.ts`      | User-Agent of the remote mode's calls to Canvas (Canvas returns 403 without a User-Agent).                      |
| `TOKEN_RENEWAL_SECONDS`      | `connectors/canvas-puc/src/remote.ts`      | How much each renewal extends the Canvas token: 30 days minus 1 hour (Canvas refuses more than 30 days ahead).  |
| `TEST_EXCEPTIONS`            | `src/test-exceptions.ts`                   | Single list of functions without automated tests, with reason and manual test.                                  |
| `DEFAULT_DOCS_CONFIG`        | `tools/docs/config.ts`                     | Default `docs:check` configuration; `docs.config.json` overrides it.                                            |
| `MODULE_SCOPE_SUFFIX`        | `tools/docs/ast.ts`                        | Suffix of the label for a reference made outside a function (`arquivo (module)`).                               |
| `WALK_IGNORED_DIRS`          | `tools/docs/inventory.ts`                  | Folders skipped when walking the disk without git.                                                              |
| `GENERATED_START`            | `tools/docs/markdown.ts`                   | Start marker of the generated block in FUNCTIONS.md.                                                            |
| `GENERATED_END`              | `tools/docs/markdown.ts`                   | End marker of the generated block.                                                                              |
| `INDEX_START`                | `tools/docs/markdown.ts`                   | Start marker of the per-module index.                                                                           |
| `INDEX_END`                  | `tools/docs/markdown.ts`                   | End marker of the per-module index.                                                                             |
| `PLACEHOLDER`                | `tools/docs/markdown.ts`                   | `_fill_in_` text left in new manual fields.                                                                     |
| `MANUAL_FIELDS`              | `tools/docs/render.ts`                     | Fixed order of the manual fields (Does, Input, Output, Effects, Errors).                                        |
| `HTML_TEXT_REPLACEMENTS`     | `src/core/html.ts`                         | Replacements (regex → text) applied in order by `htmlToText`.                                                   |
| `CFB_SIGNATURE`              | `src/core/cfb.ts`                          | The first 8 bytes of every OLE/CFB file (the .doc container).                                                   |
| `CP1252_HIGH`                | `src/core/word.ts`                         | Windows-1252 characters 0x80 to 0x9F, used when decoding the .doc's 8-bit text.                                 |
| `WORD_TEXT_REPLACEMENTS`     | `src/core/word.ts`                         | Replacements (regex → text) applied in order by `cleanWordText` to Word marks.                                  |
| `MAX_DOWNLOAD_BYTES`         | `connectors/canvas-puc/src/files.ts`       | Largest file `download_file` brings into the conversation (70 MB, streamed — ADR 0023).                         |
| `MAX_DOWNLOAD_MB`            | `connectors/canvas-puc/src/files.ts`       | The same limit in MB (70), used in the tool description and refusals.                                           |
| `downloadFileShape`          | `connectors/canvas-puc/src/tools-read.ts`  | Arguments of `download_file` (`file_id`), shared with `streamCanvasTool()`.                                     |
| `MAX_TEXT_CHARS`             | `connectors/canvas-puc/src/files.ts`       | Largest text returned by `read_file_text` (100,000 characters).                                                 |
| `CONNECTORS_DIR`             | `tools/bundle/bundle.ts`                   | Connectors folder relative to the root (`connectors`).                                                          |
| `PLUGIN_DIR`                 | `tools/bundle/bundle.ts`                   | Plugin subfolder of each connector (`plugin`), holding only plugin content (ADR 0020).                          |
| `PLUGIN_MANIFEST_PATH`       | `tools/bundle/bundle.ts`                   | Plugin manifest in each connector (`plugin/.claude-plugin/plugin.json`); marks the folder as a connector.       |
| `PLUGIN_MCP_CONFIG_PATH`     | `tools/bundle/bundle.ts`                   | Plugin MCP config (`plugin/.mcp.json`) with the remote server URL.                                              |
| `CANVAS_PAGE_SIZE`           | `connectors/canvas-puc/src/client.ts`      | Items per page requested from Canvas (`per_page`, the API maximum).                                             |
| `DEFAULT_MAX_ITEMS`          | `connectors/canvas-puc/src/client.ts`      | Default limit of items summed across pages in `getAll`.                                                         |
| `DEFAULT_CANVAS_URL`         | `connectors/canvas-puc/src/remote.ts`      | PUC Minas Canvas URL, used without `CANVAS_BASE_URL`.                                                           |
| `MAX_TEXT_LENGTH`            | `connectors/canvas-puc/src/format.ts`      | Maximum length of long texts returned to the model by `shortText`.                                              |
| `ASSIGNMENT_BUCKETS`         | `connectors/canvas-puc/src/helpers.ts`     | `list_assignments` filters → Canvas API `bucket` (`all` does not filter).                                       |
| `CANVAS_READ_TOOLS`          | `connectors/canvas-puc/src/tools-read.ts`  | Canvas read MCP tools (courses, assignments, grades, announcements etc.).                                       |
| `CANVAS_WRITE_TOOLS`         | `connectors/canvas-puc/src/tools-write.ts` | Write MCP tools (`submit_text_assignment`, `reply_to_discussion`), only with `CANVAS_ALLOW_WRITE`; destructive. |
| `CANVAS_SERVER_INFO`         | `connectors/canvas-puc/src/tools.ts`       | MCP server name and version; the version comes from `plugin/.claude-plugin/plugin.json`.                        |
| `REMOTE_ENTRY`               | `tools/bundle/bundle.ts`                   | Entry of a connector's Node remote server (`src/remote-main.ts`).                                               |
| `REMOTE_BUNDLE_PATH`         | `tools/bundle/bundle.ts`                   | Remote server bundle (`server/remote.js`), used by the Dockerfile.                                              |
| `SEAL_KEY_BYTES`             | `src/remote/seal.ts`                       | Size of `SEAL_KEY` (32 bytes, AES-256).                                                                         |
| `CLIENT_TTL_SECONDS`         | `src/remote/oauth.ts`                      | Lifetime of the registered `client_id` (10 years).                                                              |
| `PENDING_TTL_SECONDS`        | `src/remote/tokens.ts`                     | Lifetime of the request sealed in the login form (15 minutes).                                                  |
| `CODE_TTL_SECONDS`           | `src/remote/tokens.ts`                     | Lifetime of the authorization code (5 minutes).                                                                 |
| `ACCESS_TTL_SECONDS`         | `src/remote/tokens.ts`                     | Lifetime of the access token (1 hour).                                                                          |
| `REFRESH_TTL_SECONDS`        | `src/remote/tokens.ts`                     | Lifetime of the refresh token (30 days, like the PUC token).                                                    |
| `REVOKED_SECRET_DESCRIPTION` | `src/remote/handler.ts`                    | `error_description` of the `invalid_grant` answered when the connector says the credential was revoked.         |
| `LOGIN_PAGE_CSS`             | `src/remote/login-page.ts`                 | Style of the authorization page, with the tokens from `docs/UI.md`.                                             |
| `CORS_HEADERS`               | `src/remote/handler.ts`                    | CORS headers of the remote endpoints (any origin; there are no cookies).                                        |
| `REMOTE_ROUTES`              | `src/remote/handler.ts`                    | Table `MÉTODO caminho` → remote server function.                                                                |
| `DEFAULT_REDIRECT_HOSTS`     | `src/remote/oauth.ts`                      | OAuth redirect hosts accepted by default (`claude.ai`, `claude.com`, `localhost`).                              |
| `MAX_BODY_BYTES`             | `src/remote/node-server.ts`                | Largest request body accepted by the remote server (1 MB).                                                      |
| `PDF_ESCAPES`                | `src/core/pdf.ts`                          | Letter escapes of PDF literal strings (`\n`, `\t`...).                                                          |
| `TJ_SPACE_THRESHOLD`         | `src/core/pdf.ts`                          | `TJ` adjustment from which it counts as a space between words.                                                  |
| `PDF_TEXT_OPERATORS`         | `src/core/pdf.ts`                          | PDF text operator → the text it produces.                                                                       |
| `ACCESS_TOKEN_MARGIN_MS`     | `connectors/gmail/src/access-token.ts`     | Margin before expiry at which the Google access token is renewed.                                               |
| `MAX_ATTACHMENT_BYTES`       | `connectors/gmail/src/attachments.ts`      | Largest attachment read as text (5 MB).                                                                         |
| `MAX_ATTACHMENT_CHARS`       | `connectors/gmail/src/attachments.ts`      | Largest text returned from an attachment.                                                                       |
| `GMAIL_MODIFY_SCOPE`         | `connectors/gmail/src/config.ts`           | The `gmail.modify` scope, the only data scope requested (read, send, organize; no permanent deletion).          |
| `MIN_CONSENT_SECRET_CHARS`   | `connectors/gmail/src/config.ts`           | Minimum length of `CONSENT_SECRET`.                                                                             |
| `UPSTREAM_USER_AGENT`        | `connectors/gmail/src/context.ts`          | User-Agent sent to Google and the Gmail API.                                                                    |
| `GMAIL_API_BASE`             | `connectors/gmail/src/gmail-api.ts`        | Gmail API base for the token's account.                                                                         |
| `GMAIL_STATUS_MESSAGES`      | `connectors/gmail/src/gmail-api.ts`        | Actionable message per Gmail API HTTP status.                                                                   |
| `GOOGLE_AUTHORIZE_URL`       | `connectors/gmail/src/google-oauth.ts`     | Google authorization endpoint.                                                                                  |
| `GOOGLE_TOKEN_URL`           | `connectors/gmail/src/google-oauth.ts`     | Google token endpoint.                                                                                          |
| `GOOGLE_CALLBACK_PATH`       | `connectors/gmail/src/google-oauth.ts`     | Google callback path (`/google/callback`).                                                                      |
| `GOOGLE_JWKS_URL`            | `connectors/gmail/src/id-token.ts`         | Public keys that sign Google's `id_token`.                                                                      |
| `GOOGLE_ISSUERS`             | `connectors/gmail/src/id-token.ts`         | Issuers accepted in the `id_token`.                                                                             |
| `CLOCK_SKEW_SECONDS`         | `connectors/gmail/src/id-token.ts`         | Clock skew tolerated in the `id_token` validity.                                                                |
| `LINK_STATE_PREFIX`          | `connectors/gmail/src/link-flow.ts`        | Prefix of the account-link `state` (`link.`).                                                                   |
| `LINK_COOKIE`                | `connectors/gmail/src/link-flow.ts`        | `__Host-` cookie that binds the link to the browser.                                                            |
| `LINK_TTL_SECONDS`           | `connectors/gmail/src/link-flow.ts`        | Lifetime of the link request (10 minutes).                                                                      |
| `LINK_REQUEST_TYP`           | `connectors/gmail/src/link-flow.ts`        | Seal type of the link request.                                                                                  |
| `MAX_MESSAGE_CHARS`          | `connectors/gmail/src/message-format.ts`   | Largest message body returned.                                                                                  |
| `MAX_THREAD_CHARS`           | `connectors/gmail/src/message-format.ts`   | Largest sum of a thread's bodies.                                                                               |
| `MIN_MESSAGE_CHARS`          | `connectors/gmail/src/message-format.ts`   | Smallest slice per message in a long thread.                                                                    |
| `MESSAGE_HEADERS`            | `connectors/gmail/src/message-format.ts`   | Headers returned for each message.                                                                              |
| `UNTRUSTED_NOTICE`           | `connectors/gmail/src/message-format.ts`   | Notice of untrusted email content (prompt injection).                                                           |
| `GOOGLE_ACCOUNTS_ORIGIN`     | `connectors/gmail/src/pages.ts`            | Google origin allowed in the consent page's `form-action`.                                                      |
| `RATE_LIMIT_RETRY_SECONDS`   | `connectors/gmail/src/rate-limit.ts`       | `Retry-After` seconds in the 429 response.                                                                      |
| `GMAIL_ID`                   | `connectors/gmail/src/tools.ts`            | Zod schema of a Gmail API id (only URL-safe characters).                                                        |
| `listAccountsTool`           | `connectors/gmail/src/tools.ts`            | The `list_accounts` tool.                                                                                       |
| `searchThreadsTool`          | `connectors/gmail/src/tools.ts`            | The `search_threads` tool.                                                                                      |
| `getThreadTool`              | `connectors/gmail/src/tools.ts`            | The `get_thread` tool.                                                                                          |
| `getMessageTool`             | `connectors/gmail/src/tools.ts`            | The `get_message` tool.                                                                                         |
| `listLabelsTool`             | `connectors/gmail/src/tools.ts`            | The `list_labels` tool.                                                                                         |
| `getAttachmentTextTool`      | `connectors/gmail/src/tools.ts`            | The `get_attachment_text` tool.                                                                                 |
| `GMAIL_TOOLS`                | `connectors/gmail/src/tool-list.ts`        | All Gmail tools, in the order shown to Claude.                                                                  |
| `MAX_QUOTED_CHARS`           | `connectors/gmail/src/compose.ts`          | Largest excerpt of the original quoted in a reply (20 thousand characters).                                     |
| `FORWARD_SEPARATOR`          | `connectors/gmail/src/compose.ts`          | Line that opens the forwarded email block.                                                                      |
| `DRAFT_SHAPE`                | `connectors/gmail/src/draft-tools.ts`      | Parameters of a draft's content (create and replace).                                                           |
| `listDraftsTool`             | `connectors/gmail/src/draft-tools.ts`      | The `list_drafts` tool.                                                                                         |
| `createDraftTool`            | `connectors/gmail/src/draft-tools.ts`      | The `create_draft` tool.                                                                                        |
| `updateDraftTool`            | `connectors/gmail/src/draft-tools.ts`      | The `update_draft` tool.                                                                                        |
| `sendDraftTool`              | `connectors/gmail/src/draft-tools.ts`      | The `send_draft` tool.                                                                                          |
| `deleteDraftTool`            | `connectors/gmail/src/draft-tools.ts`      | The `delete_draft` tool.                                                                                        |
| `MAX_GMAIL_ERROR_DETAIL`     | `connectors/gmail/src/gmail-api.ts`        | Largest Gmail error detail passed to the model (200 characters).                                                |
| `TARGET_SHAPE`               | `connectors/gmail/src/mailbox-tools.ts`    | Target parameters of the organizing tools (`message_ids`, `thread_ids`).                                        |
| `markReadTool`               | `connectors/gmail/src/mailbox-tools.ts`    | The `mark_read` tool.                                                                                           |
| `archiveTool`                | `connectors/gmail/src/mailbox-tools.ts`    | The `archive` tool.                                                                                             |
| `starTool`                   | `connectors/gmail/src/mailbox-tools.ts`    | The `star` tool.                                                                                                |
| `updateLabelsTool`           | `connectors/gmail/src/mailbox-tools.ts`    | The `update_labels` tool.                                                                                       |
| `trashTool`                  | `connectors/gmail/src/mailbox-tools.ts`    | The `trash` tool.                                                                                               |
| `untrashTool`                | `connectors/gmail/src/mailbox-tools.ts`    | The `untrash` tool.                                                                                             |
| `MAX_TARGET_MESSAGES`        | `connectors/gmail/src/mailbox.ts`          | Maximum messages per call of the organizing tools (50).                                                         |
| `MAX_TARGET_THREADS`         | `connectors/gmail/src/mailbox.ts`          | Maximum threads per call of the organizing tools (20).                                                          |
| `MAILBOX_ACTIONS`            | `connectors/gmail/src/mailbox.ts`          | System labels each action adds and removes (read, archive, star).                                               |
| `MAX_ENCODED_WORD_BYTES`     | `connectors/gmail/src/mime.ts`             | Largest UTF-8 chunk of an RFC 2047 word (45 bytes, word ≤ 75).                                                  |
| `MAX_BODY_CHARS`             | `connectors/gmail/src/send-tools.ts`       | Largest email body accepted (100 thousand characters).                                                          |
| `RECIPIENTS`                 | `connectors/gmail/src/send-tools.ts`       | Zod schema of a recipient list.                                                                                 |
| `BODY`                       | `connectors/gmail/src/send-tools.ts`       | Zod schema of the plain-text body.                                                                              |
| `SUBJECT`                    | `connectors/gmail/src/send-tools.ts`       | Zod schema of the subject (up to 998 characters).                                                               |
| `sendEmailTool`              | `connectors/gmail/src/send-tools.ts`       | The `send_email` tool.                                                                                          |
| `replyEmailTool`             | `connectors/gmail/src/send-tools.ts`       | The `reply_email` tool.                                                                                         |
| `replyAllEmailTool`          | `connectors/gmail/src/send-tools.ts`       | The `reply_all_email` tool.                                                                                     |
| `forwardEmailTool`           | `connectors/gmail/src/send-tools.ts`       | The `forward_email` tool.                                                                                       |
| `MAX_RECIPIENTS`             | `connectors/gmail/src/send.ts`             | Maximum recipients (To + Cc + Bcc) in an email (100).                                                           |
| `MAX_FORWARD_BYTES`          | `connectors/gmail/src/send.ts`             | Largest sum of attachments in a forward (18 MB).                                                                |
| `ONE_ACCOUNT`                | `connectors/gmail/src/tools.ts`            | Zod schema of the single-account `account` parameter.                                                           |
| `CONFIRM_HINT`               | `connectors/gmail/src/tools.ts`            | Sentence of the write tools: confirm with the user and never act on an email's request.                         |
| `GMAIL_SERVER_INFO`          | `connectors/gmail/src/worker.ts`           | MCP server name and version; the version comes from `plugin/.claude-plugin/plugin.json`.                        |
| `GMAIL_SERVER_INSTRUCTIONS`  | `connectors/gmail/src/worker.ts`           | MCP server instructions (accounts and untrusted content).                                                       |
| `ACCESS_TOKEN_TTL_SECONDS`   | `connectors/gmail/src/worker.ts`           | Lifetime of the access token issued to Claude (1 hour).                                                         |
| `REFRESH_TOKEN_TTL_SECONDS`  | `connectors/gmail/src/worker.ts`           | Lifetime of the refresh token issued to Claude (30 days).                                                       |
| `GMAIL_ROUTES`               | `connectors/gmail/src/worker.ts`           | The Worker's own routes: `MÉTODO caminho` → handler.                                                            |
| `BRIDGE_ERROR_MESSAGES`      | `connectors/whatsapp/src/bridge-client.ts` | User-facing messages (English) for the bridge's known error codes.                                              |
| `WHATSAPP_DEFAULTS`          | `connectors/whatsapp/src/config.ts`        | Connector defaults: sleep after 5 min, 25 s per tool, 8 s waiting for sync, 10 sends per hour.                  |
| `BRIDGE_ENV_KEYS`            | `connectors/whatsapp/src/config.ts`        | Variables passed from the Worker to the bridge container (`bridge/API.md`).                                     |
| `SNAPSHOT_PUSH_URL`          | `connectors/whatsapp/src/config.ts`        | Internal address, intercepted by the Worker, to which the bridge sends the snapshot on `SIGTERM`.               |
| `UNTRUSTED_NOTICE`           | `connectors/whatsapp/src/format.ts`        | Notice of untrusted third-party data that accompanies every result with messages or contacts.                   |
| `HIDDEN_CHAR_RANGES`         | `connectors/whatsapp/src/format.ts`        | Ranges of invisible characters (control, zero-width, bidi, BOM) removed by `sanitizeText`.                      |
| `SNAPSHOT_INTERVAL_MS`       | `connectors/whatsapp/src/lifecycle.ts`     | Minimum interval between usage-triggered snapshots (1 minute).                                                  |
| `SNAPSHOT_AFTER_PATHS`       | `connectors/whatsapp/src/lifecycle.ts`     | Bridge routes after which the database may have changed and a snapshot is worth trying.                         |
| `SEND_HISTORY_KEY`           | `connectors/whatsapp/src/lifecycle.ts`     | Key, in the Durable Object storage, of the recent send timestamps (hourly limit).                               |
| `PAIR_PAGE_CSS`              | `connectors/whatsapp/src/pair-page.ts`     | Style additions of the `/pair` page (large code, QR, secondary and danger buttons).                             |
| `PAIR_SESSION_COOKIE`        | `connectors/whatsapp/src/pair.ts`          | Name of the `__Host-` cookie of the sealed `/pair` session.                                                     |
| `PAIR_NONCE_COOKIE`          | `connectors/whatsapp/src/pair.ts`          | Name of the `__Host-` cookie of the nonce that binds the `/pair` login to the browser.                          |
| `PAIR_SESSION_TTL_SECONDS`   | `connectors/whatsapp/src/pair.ts`          | Lifetime of the `/pair` session and the anti-CSRF token (30 minutes).                                           |
| `PAIR_LOGIN_TTL_SECONDS`     | `connectors/whatsapp/src/pair.ts`          | Lifetime of the in-progress `/pair` login (10 minutes).                                                         |
| `PAIR_CALLBACK_PATH`         | `connectors/whatsapp/src/pair.ts`          | GitHub callback path for `/pair` (a subpath of the OAuth App callback).                                         |
| `PAIR_ACTIONS`               | `connectors/whatsapp/src/pair.ts`          | `/pair` actions by path: code, QR, unlink and start over from scratch.                                          |
| `SNAPSHOT_KEY_NAME`          | `connectors/whatsapp/src/snapshots.ts`     | Key of the current snapshot in the R2 bucket (`whatsapp/snapshot.was1`).                                        |
| `WHATSAPP_INSTRUCTIONS`      | `connectors/whatsapp/src/tools.ts`         | MCP server instructions: what the connector is and the rule about untrusted content.                            |
| `WHATSAPP_SERVER_INFO`       | `connectors/whatsapp/src/tools.ts`         | MCP server name and version; the version comes from `plugin/.claude-plugin/plugin.json`.                        |
| `READ_TOOLS`                 | `connectors/whatsapp/src/tools.ts`         | Read tools (phase 1), always active.                                                                            |
| `BRIDGE_INSTANCE_NAME`       | `connectors/whatsapp/src/worker-env.ts`    | Fixed name of the bridge's single Durable Object instance (single instance = single session).                   |
| `WHATSAPP_WORKER_HANDLERS`   | `connectors/whatsapp/src/worker.ts`        | Worker handlers (`fetch` and `scheduled`), exported by `index.ts` with the Durable Object.                      |
| `GITHUB_USER_AGENT`          | `src/remote/github-login.ts`               | User-Agent of the calls to GitHub (the API refuses requests without it).                                        |
| `READ_ONLY_HINTS`            | `src/mcp/annotations.ts`                   | Hints of a read-only tool (`readOnlyHint: true`, idempotent, open world).                                       |
| `SEND_HINTS`                 | `src/mcp/annotations.ts`                   | Hints of a tool that sends or publishes (email, message, submission): destructive, not idempotent.              |
| `DESTRUCTIVE_HINTS`          | `src/mcp/annotations.ts`                   | Hints of a tool that deletes or overwrites (trash, draft, account link): destructive, idempotent.               |
| `ORGANIZE_HINTS`             | `src/mcp/annotations.ts`                   | Hints of a reversible organizing tool (read, archive, star, labels, restore): writes, not destructive.          |
| `CREATE_HINTS`               | `src/mcp/annotations.ts`                   | Hints of a tool that creates something without deleting (draft, link): writes, not destructive.                 |
| `FALLBACK_SERVER_VERSION`    | `src/mcp/server-version.ts`                | Version announced when the plugin manifest has none (`0.0.0`).                                                  |
| `UPSTREAM_CALLBACK_PATH`     | `src/remote/handler.ts`                    | Callback path of the delegated login (`/oauth/callback`), registered with the provider.                         |
| `BRIDGE_RETRY_MS`            | `connectors/whatsapp/src/bridge-client.ts` | Wait between attempts while the bridge wakes up (750 ms).                                                       |
| `GMAIL_SCOPES`               | `connectors/gmail/src/config.ts`           | Login and link scopes (`openid email` + Gmail read-only).                                                       |
| `GOOGLE_REVOKE_URL`          | `connectors/gmail/src/google-oauth.ts`     | Google token revocation endpoint.                                                                               |
| `LINK_TICKET_TYP`            | `connectors/gmail/src/link-flow.ts`        | Seal type of the link ticket issued by `link_account`.                                                          |
| `OWNER_RECORD_TYP`           | `connectors/gmail/src/token-store.ts`      | Seal type of a user's accounts record.                                                                          |
| `OWNER_RECORD_EXP`           | `connectors/gmail/src/token-store.ts`      | Technical expiry of the record's seal (year 2100).                                                              |
| `MAX_LINKED_ACCOUNTS`        | `connectors/gmail/src/token-store.ts`      | Maximum Gmail accounts a user can link (10).                                                                    |
| `linkAccountTool`            | `connectors/gmail/src/tools.ts`            | The `link_account` tool.                                                                                        |
| `unlinkAccountTool`          | `connectors/gmail/src/tools.ts`            | The `unlink_account` tool.                                                                                      |
