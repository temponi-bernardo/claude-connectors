# Functions

Every top-level function in the code appears here, in a fixed template. The fields between `<!-- generated:start -->` and
`<!-- generated:end -->` (File, Signature, Used by, Processes) are written by `npm run docs:generate` from
the code — do not edit them by hand. The **Does**, **Input**, **Output**, **Effects** and **Errors** fields are
manual and mandatory; `npm run docs:check` fails while any `_fill_in_` remains.

Template and writing rules: [DOCUMENTATION.md](DOCUMENTATION.md#function).

## Index by module

<!-- index:start -->

- `connectors/canvas-puc/src/attachment-refs.ts`: [`attachmentCountRefusal`](#attachmentcountrefusal), [`conversationFolderId`](#conversationfolderid), [`fetchAttachmentFile`](#fetchattachmentfile), [`needsConversationCopy`](#needsconversationcopy), [`copyToConversationFolder`](#copytoconversationfolder), [`resolveFileAttachments`](#resolvefileattachments), [`collectMessageAttachments`](#collectmessageattachments), [`shellQuote`](#shellquote), [`curlUploadCommand`](#curluploadcommand), [`prepareAttachmentUpload`](#prepareattachmentupload)
- `connectors/canvas-puc/src/changes.ts`: [`latestStamp`](#lateststamp), [`keepChanged`](#keepchanged), [`assignmentStamps`](#assignmentstamps), [`announcementStamps`](#announcementstamps), [`topicStamps`](#topicstamps), [`conversationStamps`](#conversationstamps), [`checkedAtNote`](#checkedatnote), [`withCheckedAt`](#withcheckedat)
- `connectors/canvas-puc/src/chunks.ts`: [`planDownloadChunk`](#plandownloadchunk), [`chunkDescription`](#chunkdescription), [`chunkMimeType`](#chunkmimetype), [`chunkUri`](#chunkuri), [`rangeHeaders`](#rangeheaders), [`isRangeAnswer`](#israngeanswer)
- `connectors/canvas-puc/src/client.ts`: [`unauthorizedMessage`](#unauthorizedmessage), [`sendCanvasRequest`](#sendcanvasrequest), [`canvasApiError`](#canvasapierror), [`canvasErrorStatus`](#canvaserrorstatus), [`isPermissionDenial`](#ispermissiondenial), [`networkFailure`](#networkfailure), [`requestCanvas`](#requestcanvas), [`readCanvasJson`](#readcanvasjson), [`requestCanvasJson`](#requestcanvasjson), [`collectPages`](#collectpages), [`fetchDownload`](#fetchdownload), [`fetchPlainText`](#fetchplaintext), [`fetchFileBytes`](#fetchfilebytes), [`uploadForm`](#uploadform), [`postUploadForm`](#postuploadform), [`confirmUpload`](#confirmupload), [`isReadOnlyGraphql`](#isreadonlygraphql), [`graphqlData`](#graphqldata), [`queryCanvasGraphql`](#querycanvasgraphql), [`createCanvasClient`](#createcanvasclient)
- `connectors/canvas-puc/src/file-ref.ts`: [`fileRefFromUrl`](#filereffromurl), [`fileRefFromArgs`](#filereffromargs), [`fileLookupPlan`](#filelookupplan), [`fileAccessReason`](#fileaccessreason), [`fileAccessError`](#fileaccesserror), [`resolveCanvasFile`](#resolvecanvasfile)
- `connectors/canvas-puc/src/files.ts`: [`tooLargeMessage`](#toolargemessage), [`downloadRefusal`](#downloadrefusal), [`planCanvasDownload`](#plancanvasdownload), [`openCanvasChunk`](#opencanvaschunk), [`streamCanvasFile`](#streamcanvasfile), [`chunkToolResult`](#chunktoolresult), [`downloadCanvasFile`](#downloadcanvasfile), [`readCanvasFileText`](#readcanvasfiletext)
- `connectors/canvas-puc/src/format.ts`: [`shortText`](#shorttext), [`rawHtmlField`](#rawhtmlfield), [`linksField`](#linksfield), [`toProfile`](#toprofile), [`toCourse`](#tocourse), [`toSubmissionFlags`](#tosubmissionflags), [`plannerItemType`](#planneritemtype), [`reviewStatus`](#reviewstatus), [`toPlannerItem`](#toplanneritem), [`toAssignmentSummary`](#toassignmentsummary), [`toRubricCriterion`](#torubriccriterion), [`toFileInfo`](#tofileinfo), [`toSubmissionDetail`](#tosubmissiondetail), [`toAssignmentDetail`](#toassignmentdetail), [`toGradeRow`](#tograderow), [`toEnrollmentGrade`](#toenrollmentgrade), [`toAnnouncement`](#toannouncement), [`toModuleItem`](#tomoduleitem), [`toModule`](#tomodule), [`toDiscussionSummary`](#todiscussionsummary), [`flattenDiscussion`](#flattendiscussion), [`toCalendarEvent`](#tocalendarevent)
- `connectors/canvas-puc/src/helpers.ts`: [`isoDaysFrom`](#isodaysfrom), [`plannerWindow`](#plannerwindow), [`dateOnly`](#dateonly), [`courseContextCodes`](#coursecontextcodes), [`courseNameMap`](#coursenamemap), [`participantNames`](#participantnames), [`isTextFile`](#istextfile), [`matchModuleItems`](#matchmoduleitems), [`activeCourses`](#activecourses), [`fetchOwnSubmission`](#fetchownsubmission), [`getAllOrEmpty`](#getallorempty)
- `connectors/canvas-puc/src/inbox.ts`: [`attachmentIdsField`](#attachmentidsfield), [`replyPayload`](#replypayload), [`toRecipient`](#torecipient), [`participantName`](#participantname), [`conversationNames`](#conversationnames), [`toConversationSummary`](#toconversationsummary), [`toConversationMessage`](#toconversationmessage), [`toConversationDetail`](#toconversationdetail), [`newMessagePayload`](#newmessagepayload), [`sentConversation`](#sentconversation), [`sentReply`](#sentreply)
- `connectors/canvas-puc/src/linked-files.ts`: [`isLinkedFileLink`](#islinkedfilelink), [`linkedFileKey`](#linkedfilekey), [`moduleItemLinks`](#moduleitemlinks), [`originLinks`](#originlinks), [`collectLinkedFiles`](#collectlinkedfiles), [`toLinkedFile`](#tolinkedfile), [`fetchLinkSources`](#fetchlinksources), [`linkSource`](#linksource), [`listLinkedFiles`](#listlinkedfiles), [`linkedOnlyRows`](#linkedonlyrows), [`linkedOnlyNote`](#linkedonlynote), [`listFilesWithLinked`](#listfileswithlinked)
- `connectors/canvas-puc/src/links.ts`: [`hostMatches`](#hostmatches), [`isCanvasUrl`](#iscanvasurl), [`videoProviderOf`](#videoproviderof), [`canvasTargetOf`](#canvastargetof), [`canvasRefTarget`](#canvasreftarget), [`classifyCanvasRef`](#classifycanvasref), [`canvasHtml`](#canvashtml), [`redactVerifier`](#redactverifier)
- `connectors/canvas-puc/src/message-attachments.ts`: [`attachmentsRefusal`](#attachmentsrefusal), [`prepareAttachments`](#prepareattachments), [`attachmentUploadError`](#attachmentuploaderror), [`uploadMessageAttachment`](#uploadmessageattachment), [`uploadMessageAttachments`](#uploadmessageattachments), [`attachmentIds`](#attachmentids), [`attachmentSummary`](#attachmentsummary)
- `connectors/canvas-puc/src/peer-reviews.ts`: [`revieweeName`](#revieweename), [`assignmentPageUrl`](#assignmentpageurl), [`reviewedSubmissionPath`](#reviewedsubmissionpath), [`reviewPageUrl`](#reviewpageurl), [`peerSubmissionView`](#peersubmissionview), [`orNull`](#ornull), [`peerReviewAssignmentFields`](#peerreviewassignmentfields), [`toPeerReview`](#topeerreview), [`peerReviewsOf`](#peerreviewsof), [`reviewRank`](#reviewrank), [`reviewDueTime`](#reviewduetime), [`sortPeerReviews`](#sortpeerreviews), [`peerReviewDenial`](#peerreviewdenial), [`explainPeerReviewError`](#explainpeerreviewerror), [`fetchPeerReviewAssignment`](#fetchpeerreviewassignment), [`peerReviewAssignmentIds`](#peerreviewassignmentids), [`listCoursePeerReviews`](#listcoursepeerreviews), [`assignmentPeerReviews`](#assignmentpeerreviews), [`sweepPeerReviews`](#sweeppeerreviews), [`listPeerReviews`](#listpeerreviews)
- `connectors/canvas-puc/src/plan/page/checks.ts`: [`toCheckMap`](#tocheckmap), [`parseStoredChecks`](#parsestoredchecks), [`mergeChecks`](#mergechecks), [`hasLocalOnly`](#haslocalonly), [`localChecksKey`](#localcheckskey), [`readLocalChecks`](#readlocalchecks), [`pauseMs`](#pausems), [`createCheckStore`](#createcheckstore), [`writeLocalChecks`](#writelocalchecks), [`applyCheck`](#applycheck), [`refreshChecks`](#refreshchecks), [`onCheckChange`](#oncheckchange), [`registerCheck`](#registercheck), [`errorCode`](#errorcode), [`retryOnUnavailable`](#retryonunavailable), [`writeChecksOnce`](#writechecksonce), [`flushChecks`](#flushchecks), [`remoteChecksOf`](#remotechecksof), [`onRemoteSnapshot`](#onremotesnapshot), [`accountDocument`](#accountdocument), [`adoptAccount`](#adoptaccount), [`connectAccount`](#connectaccount)
- `connectors/canvas-puc/src/plan/page/dom.ts`: [`createEl`](#createel), [`richTextRuns`](#richtextruns), [`appendRichText`](#appendrichtext), [`createRichEl`](#createrichel), [`requireEl`](#requireel)
- `connectors/canvas-puc/src/plan/page/format.ts`: [`formatDayMonth`](#formatdaymonth), [`weekdayOf`](#weekdayof), [`saoPauloParts`](#saopauloparts), [`formatStamp`](#formatstamp), [`saoPauloToday`](#saopaulotoday)
- `connectors/canvas-puc/src/plan/page/main.ts`: [`readEmbeddedPlan`](#readembeddedplan), [`showSyncState`](#showsyncstate), [`renderPlanSections`](#renderplansections), [`updateCounters`](#updatecounters), [`bootPlanPage`](#bootplanpage), [`safeLocalStorage`](#safelocalstorage), [`startPlanPage`](#startplanpage)
- `connectors/canvas-puc/src/plan/page/render-courses.ts`: [`assessmentValueText`](#assessmentvaluetext), [`assessmentTitleText`](#assessmenttitletext), [`barLabel`](#barlabel), [`renderPointsBar`](#renderpointsbar), [`renderNeed`](#renderneed), [`renderAssessments`](#renderassessments), [`renderRules`](#renderrules), [`renderCardHead`](#rendercardhead), [`renderCourses`](#rendercourses)
- `connectors/canvas-puc/src/plan/page/render-days.ts`: [`dayRowClass`](#dayrowclass), [`progressText`](#progresstext), [`renderChecklistItem`](#renderchecklistitem), [`renderDayRow`](#renderdayrow), [`renderStudy`](#renderstudy), [`timelineEntry`](#timelineentry), [`renderTimeline`](#rendertimeline), [`renderToday`](#rendertoday), [`renderQuestions`](#renderquestions)
- `connectors/canvas-puc/src/plan/page/render-header.ts`: [`courseGoal`](#coursegoal), [`courseLevels`](#courselevels), [`levelClass`](#levelclass), [`situationText`](#situationtext), [`renderHeader`](#renderheader), [`renderRiskChips`](#renderriskchips), [`renderFooter`](#renderfooter)
- `connectors/canvas-puc/src/plan/plan-cli-core.ts`: [`parsePlanOptions`](#parseplanoptions), [`parsePlanArgs`](#parseplanargs), [`invalidResult`](#invalidresult), [`readJsonFile`](#readjsonfile), [`planSummaryLines`](#plansummarylines), [`runValidate`](#runvalidate), [`readPreviousPlan`](#readpreviousplan), [`runBuild`](#runbuild), [`runExtract`](#runextract), [`runSummary`](#runsummary), [`runPlanCommand`](#runplancommand)
- `connectors/canvas-puc/src/plan/plan-cli.ts`: [`runPlanCli`](#runplancli)
- `connectors/canvas-puc/src/plan/plan-embed.ts`: [`planTitle`](#plantitle), [`serializePlanJson`](#serializeplanjson), [`escapeHtmlText`](#escapehtmltext), [`countMatches`](#countmatches), [`injectPlan`](#injectplan), [`extractPlan`](#extractplan)
- `connectors/canvas-puc/src/plan/plan-ids.ts`: [`normalizeMatchText`](#normalizematchtext), [`fnvHash36`](#fnvhash36), [`stableItemId`](#stableitemid), [`itemMatchKey`](#itemmatchkey), [`idEntry`](#identry), [`planIdEntries`](#planidentries), [`previousIdIndex`](#previousidindex), [`assignPlanIds`](#assignplanids), [`carryDays`](#carrydays), [`carryPreviousItems`](#carrypreviousitems), [`mergeWithPrevious`](#mergewithprevious)
- `connectors/canvas-puc/src/plan/plan-points.ts`: [`roundPoints`](#roundpoints), [`formatPoints`](#formatpoints), [`pointsTotal`](#pointstotal), [`pointsMissing`](#pointsmissing), [`riskLevel`](#risklevel), [`barSegments`](#barsegments)
- `connectors/canvas-puc/src/plan/plan-validate.ts`: [`isRealIsoDate`](#isrealisodate), [`zodIssueLines`](#zodissuelines), [`checkPointSums`](#checkpointsums), [`planDates`](#plandates), [`checkDayOrder`](#checkdayorder), [`checkPlanDates`](#checkplandates), [`planItemIds`](#planitemids), [`repeatedValues`](#repeatedvalues), [`checkPlanIds`](#checkplanids), [`checkCourseRefs`](#checkcourserefs), [`validatePlan`](#validateplan)
- `connectors/canvas-puc/src/remote-main.ts`: [`startCanvasRemoteServer`](#startcanvasremoteserver)
- `connectors/canvas-puc/src/remote.ts`: [`withCanvasUserAgent`](#withcanvasuseragent), [`readCanvasRemoteSettings`](#readcanvasremotesettings), [`canvasLoginText`](#canvaslogintext), [`fetchCanvasSelf`](#fetchcanvasself), [`verifyCanvasToken`](#verifycanvastoken), [`matchesVisibleToken`](#matchesvisibletoken), [`planTokenRenewal`](#plantokenrenewal), [`canvasTokenApi`](#canvastokenapi), [`renewCanvasToken`](#renewcanvastoken), [`isCanvasTokenAlive`](#iscanvastokenalive), [`renewCanvasSecret`](#renewcanvassecret), [`readOnlyConnectionReason`](#readonlyconnectionreason), [`userAllowsWrite`](#userallowswrite), [`canvasWriteBlock`](#canvaswriteblock), [`canvasClientFor`](#canvasclientfor), [`streamCanvasTool`](#streamcanvastool), [`createCanvasUserServer`](#createcanvasuserserver), [`canvasRemoteConnector`](#canvasremoteconnector)
- `connectors/canvas-puc/src/tools-inbox.ts`: [`sendInboxMessage`](#sendinboxmessage), [`replyInboxMessage`](#replyinboxmessage)
- `connectors/canvas-puc/src/tools-write.ts`: [`submissionPayload`](#submissionpayload)
- `connectors/canvas-puc/src/tools.ts`: [`canvasTools`](#canvastools), [`createCanvasMcpServer`](#createcanvasmcpserver)
- `connectors/canvas-puc/src/upload.ts`: [`decodeUploadContent`](#decodeuploadcontent), [`fileExtension`](#fileextension), [`uploadContentType`](#uploadcontenttype), [`extensionRefusal`](#extensionrefusal), [`uploadSizeRefusal`](#uploadsizerefusal), [`uploadRefusal`](#uploadrefusal), [`onlineUploadPayload`](#onlineuploadpayload), [`uploadedFileFromArgs`](#uploadedfilefromargs), [`uploadCanvasFile`](#uploadcanvasfile), [`submitFileAssignment`](#submitfileassignment)
- `connectors/canvas-puc/src/worker.ts`: [`createWorkerApp`](#createworkerapp), [`writeAccessStoreFrom`](#writeaccessstorefrom), [`handleWorkerFetch`](#handleworkerfetch)
- `connectors/canvas-puc/src/write-access.ts`: [`tokenFingerprint`](#tokenfingerprint), [`writeAccessKey`](#writeaccesskey), [`hasStoredWriteOptIn`](#hasstoredwriteoptin), [`writeAccessUrl`](#writeaccessurl), [`openWriteTicket`](#openwriteticket), [`renderWriteAccessPage`](#renderwriteaccesspage), [`expiredWriteAccessPage`](#expiredwriteaccesspage), [`showWriteAccess`](#showwriteaccess), [`submitWriteAccess`](#submitwriteaccess), [`memoryWriteAccessStore`](#memorywriteaccessstore)
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
- `connectors/gmail/src/link-flow.ts`: [`nowSeconds`](#nowseconds), [`issueLinkUrl`](#issuelinkurl), [`openLinkTicket`](#openlinkticket), [`usedTicketKey`](#usedticketkey), [`redeemLinkTicket`](#redeemlinkticket), [`showLinkConfirmation`](#showlinkconfirmation), [`isConfirmedInThisBrowser`](#isconfirmedinthisbrowser), [`linkRequestKey`](#linkrequestkey), [`readCookie`](#readcookie), [`linkCookie`](#linkcookie), [`invalidTicketPage`](#invalidticketpage), [`redeemConfirmedTicket`](#redeemconfirmedticket), [`storeLinkRequest`](#storelinkrequest), [`linkStageUrl`](#linkstageurl), [`beginLinkStage`](#beginlinkstage), [`startAccountLink`](#startaccountlink), [`notOwnerPage`](#notownerpage), [`verifyOwnerThenLink`](#verifyownerthenlink), [`takeLinkRequest`](#takelinkrequest), [`linkRefusalReason`](#linkrefusalreason), [`storeGoogleAccount`](#storegoogleaccount), [`linkFromCode`](#linkfromcode), [`linkSafely`](#linksafely), [`finishAccountLink`](#finishaccountlink)
- `connectors/gmail/src/mailbox-tools.ts`: [`toggleAction`](#toggleaction), [`writableTargets`](#writabletargets), [`runMailboxAction`](#runmailboxaction)
- `connectors/gmail/src/mailbox.ts`: [`mailTargets`](#mailtargets), [`checkLabelChange`](#checklabelchange), [`resolveLabelIds`](#resolvelabelids), [`fetchLabels`](#fetchlabels), [`applyLabelChange`](#applylabelchange), [`targetCounts`](#targetcounts), [`moveToTrash`](#movetotrash)
- `connectors/gmail/src/message-format.ts`: [`base64UrlToBytes`](#base64urltobytes), [`partCharset`](#partcharset), [`decodePartBody`](#decodepartbody), [`headerValues`](#headervalues), [`flattenParts`](#flattenparts), [`isBodyPart`](#isbodypart), [`messageBodyText`](#messagebodytext), [`messageAttachments`](#messageattachments), [`truncateText`](#truncatetext), [`internalDateIso`](#internaldateiso), [`pickHeaders`](#pickheaders), [`formatMessage`](#formatmessage), [`perMessageLimit`](#permessagelimit), [`formatThread`](#formatthread), [`summarizeThread`](#summarizethread)
- `connectors/gmail/src/mime.ts`: [`splitAddressList`](#splitaddresslist), [`parseMailAddress`](#parsemailaddress), [`parseAddressList`](#parseaddresslist), [`parseRecipients`](#parserecipients), [`cleanHeaderText`](#cleanheadertext), [`isPrintableAscii`](#isprintableascii), [`encodeHeaderWord`](#encodeheaderword), [`formatMailAddress`](#formatmailaddress), [`addressHeader`](#addressheader), [`messageIdList`](#messageidlist), [`mimeHeaderLines`](#mimeheaderlines), [`wrapBase64`](#wrapbase64), [`textPart`](#textpart), [`safeMimeType`](#safemimetype), [`attachmentPart`](#attachmentpart), [`buildMimeMessage`](#buildmimemessage), [`toRawMessage`](#torawmessage)
- `connectors/gmail/src/pages.ts`: [`pageDocument`](#pagedocument), [`messagePage`](#messagepage), [`maskEmail`](#maskemail), [`linkConfirmBody`](#linkconfirmbody), [`linkConfirmPage`](#linkconfirmpage), [`consentPageBody`](#consentpagebody), [`copyConsentHeaders`](#copyconsentheaders), [`consentPage`](#consentpage), [`redirectWith`](#redirectwith)
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
- `connectors/whatsapp/src/tools.ts`: [`toolDeadline`](#tooldeadline), [`syncWaitBudget`](#syncwaitbudget), [`waitForSync`](#waitforsync), [`prepareRead`](#prepareread), [`runRead`](#runread), [`compactContact`](#compactcontact), [`decodeHeaderText`](#decodeheadertext), [`mediaResult`](#mediaresult), [`allowedRecipient`](#allowedrecipient), [`whatsappTools`](#whatsapptools), [`createWhatsAppCatalogServer`](#createwhatsappcatalogserver), [`createWhatsAppMcpServer`](#createwhatsappmcpserver)
- `connectors/whatsapp/src/worker-env.ts`: [`bridgeStub`](#bridgestub), [`bridgeFetchFor`](#bridgefetchfor)
- `connectors/whatsapp/src/worker.ts`: [`unixNow`](#unixnow), [`githubSettingsFrom`](#githubsettingsfrom), [`whatsappRemoteConnector`](#whatsappremoteconnector), [`createWhatsAppApps`](#createwhatsappapps), [`handleWhatsAppFetch`](#handlewhatsappfetch), [`isSyncCronEnabled`](#issynccronenabled), [`runScheduledSync`](#runscheduledsync)
- `src/core/async.ts`: [`drainQueue`](#drainqueue), [`mapWithLimit`](#mapwithlimit)
- `src/core/bytes.ts`: [`byteView`](#byteview), [`concatBytes`](#concatbytes), [`utf16leToString`](#utf16letostring), [`bytesToBase64`](#bytestobase64)
- `src/core/cfb.ts`: [`isCfb`](#iscfb), [`readCfbHeader`](#readcfbheader), [`cfbSector`](#cfbsector), [`sectorWords`](#sectorwords), [`fatSectorIds`](#fatsectorids), [`followChain`](#followchain), [`readRegularChain`](#readregularchain), [`parseDirectory`](#parsedirectory), [`openCfb`](#opencfb), [`readMiniStream`](#readministream), [`readCfbStream`](#readcfbstream)
- `src/core/env.ts`: [`envValue`](#envvalue), [`parseFlag`](#parseflag), [`toEnvVars`](#toenvvars)
- `src/core/html.ts`: [`safeHttpUrl`](#safehttpurl), [`keptHtmlAttrs`](#kepthtmlattrs), [`addHtmlRef`](#addhtmlref), [`markHtmlRef`](#markhtmlref), [`openHtmlAnchor`](#openhtmlanchor), [`closeHtmlAnchor`](#closehtmlanchor), [`addHtmlMedia`](#addhtmlmedia), [`openHtmlTag`](#openhtmltag), [`closeHtmlTag`](#closehtmltag), [`tidyHtmlText`](#tidyhtmltext), [`parseHtmlContent`](#parsehtmlcontent), [`htmlToText`](#htmltotext)
- `src/core/http.ts`: [`buildUrl`](#buildurl), [`parseNextLink`](#parsenextlink)
- `src/core/pdf.ts`: [`bytesToLatin1`](#bytestolatin1), [`isPdf`](#ispdf), [`streamDataStart`](#streamdatastart), [`trimStreamEol`](#trimstreameol), [`readRawObject`](#readrawobject), [`listRawObjects`](#listrawobjects), [`decodePdfStream`](#decodepdfstream), [`splitObjectStream`](#splitobjectstream), [`storePdfObject`](#storepdfobject), [`readPdfObjects`](#readpdfobjects), [`pdfRefs`](#pdfrefs), [`dictRefs`](#dictrefs), [`collectPdfPages`](#collectpdfpages), [`orderedPages`](#orderedpages), [`utf16beHexToString`](#utf16behextostring), [`readBfChars`](#readbfchars), [`readBfRanges`](#readbfranges), [`rangeTarget`](#rangetarget), [`parseToUnicodeCMap`](#parsetounicodecmap), [`addFontRefs`](#addfontrefs), [`fontResourceRefs`](#fontresourcerefs), [`fontCMaps`](#fontcmaps), [`decodePdfText`](#decodepdftext), [`readLiteralString`](#readliteralstring), [`readEscape`](#readescape), [`readHexString`](#readhexstring), [`skipPdfSpace`](#skippdfspace), [`nextPdfToken`](#nextpdftoken), [`readPdfWord`](#readpdfword), [`wrapString`](#wrapstring), [`classifyWord`](#classifyword), [`showArrayText`](#showarraytext), [`lastOperandText`](#lastoperandtext), [`moveText`](#movetext), [`applyTextOperator`](#applytextoperator), [`feedPdfToken`](#feedpdftoken), [`contentStreamText`](#contentstreamtext), [`tidyPdfText`](#tidypdftext), [`pdfToText`](#pdftotext)
- `src/core/redact.ts`: [`redactSecrets`](#redactsecrets), [`redactForLog`](#redactforlog), [`errorMessage`](#errormessage), [`logWarning`](#logwarning)
- `src/core/stream.ts`: [`splitBase64Ready`](#splitbase64ready), [`base64EncodeStream`](#base64encodestream), [`byteLimitStream`](#bytelimitstream), [`byteRangeStream`](#byterangestream), [`framedStream`](#framedstream), [`readLimitedBytes`](#readlimitedbytes)
- `src/core/time.ts`: [`parseOffsetLabel`](#parseoffsetlabel), [`zoneOffsetMinutes`](#zoneoffsetminutes), [`startOfDayIn`](#startofdayin)
- `src/core/word.ts`: [`docxXmlToText`](#docxxmltotext), [`docxToText`](#docxtotext), [`cp1252ToString`](#cp1252tostring), [`parsePieceTable`](#parsepiecetable), [`pieceText`](#piecetext), [`cleanWordText`](#cleanwordtext), [`docToText`](#doctotext), [`wordKind`](#wordkind), [`wordToText`](#wordtotext)
- `src/core/zip.ts`: [`findEndOfCentralDirectory`](#findendofcentraldirectory), [`listZipEntries`](#listzipentries), [`zipEntryBytes`](#zipentrybytes), [`decompressBytes`](#decompressbytes), [`inflateRaw`](#inflateraw), [`readZipEntry`](#readzipentry)
- `src/mcp/annotations.ts`: [`toolAnnotations`](#toolannotations)
- `src/mcp/server-version.ts`: [`manifestVersion`](#manifestversion)
- `src/mcp/tool-contract.ts`: [`readToolContract`](#readtoolcontract), [`contractEntryAsListed`](#contractentryaslisted), [`toolsFromListResponse`](#toolsfromlistresponse), [`toolContractOf`](#toolcontractof), [`toolContractDiff`](#toolcontractdiff), [`snakeCaseWords`](#snakecasewords), [`toolTexts`](#tooltexts), [`unregisteredToolMentions`](#unregisteredtoolmentions)
- `src/mcp/tool-gate.ts`: [`unavailableToolMessage`](#unavailabletoolmessage), [`disabledToolSpec`](#disabledtoolspec), [`gateToolSpecs`](#gatetoolspecs), [`refuseListOnlyUse`](#refuselistonlyuse), [`listOnlyContext`](#listonlycontext)
- `src/mcp/tools.ts`: [`defineTool`](#definetool), [`textResult`](#textresult), [`rawToolResult`](#rawtoolresult), [`toToolResult`](#totoolresult), [`errorResult`](#errorresult), [`runToolSafely`](#runtoolsafely), [`registerToolSpecs`](#registertoolspecs), [`binaryContentBlock`](#binarycontentblock), [`base64ContentBlock`](#base64contentblock)
- `src/remote/github-login.ts`: [`githubAuthorizeUrl`](#githubauthorizeurl), [`parseEmailList`](#parseemaillist), [`pickAllowedEmail`](#pickallowedemail), [`exchangeGithubCode`](#exchangegithubcode), [`fetchGithubEmails`](#fetchgithubemails), [`finishGithubLogin`](#finishgithublogin), [`githubUpstreamLogin`](#githubupstreamlogin)
- `src/remote/handler.ts`: [`jsonResponse`](#jsonresponse), [`pageSecurityPolicy`](#pagesecuritypolicy), [`htmlResponse`](#htmlresponse), [`readForm`](#readform), [`readJsonBody`](#readjsonbody), [`loginPageFor`](#loginpagefor), [`redirectWithCode`](#redirectwithcode), [`handleRegister`](#handleregister), [`redirectToUpstream`](#redirecttoupstream), [`handleAuthorizePage`](#handleauthorizepage), [`handleUpstreamCallback`](#handleupstreamcallback), [`handleAuthorizeSubmit`](#handleauthorizesubmit), [`chosenGrants`](#chosengrants), [`renewSecretQuietly`](#renewsecretquietly), [`handleToken`](#handletoken), [`handleMcp`](#handlemcp), [`serveMcpWithStreaming`](#servemcpwithstreaming), [`streamToolQuietly`](#streamtoolquietly), [`handleToolCatalog`](#handletoolcatalog), [`connectorPage`](#connectorpage), [`withCors`](#withcors), [`allowsCors`](#allowscors), [`routeRemoteRequest`](#routeremoterequest), [`createRemoteHandler`](#createremotehandler)
- `src/remote/login-page.ts`: [`escapeHtml`](#escapehtml), [`renderLoginPage`](#renderloginpage), [`grantCheckbox`](#grantcheckbox)
- `src/remote/mcp-endpoint.ts`: [`serveMcpRequest`](#servemcprequest), [`mcpUnauthorizedResponse`](#mcpunauthorizedresponse), [`toolsListRequest`](#toolslistrequest), [`serveToolCatalog`](#servetoolcatalog)
- `src/remote/node-server.ts`: [`readPublicUrl`](#readpublicurl), [`readRemoteServerConfig`](#readremoteserverconfig), [`readNodeBody`](#readnodebody), [`toWebRequest`](#towebrequest), [`writeWebResponse`](#writewebresponse), [`serveNodeRequest`](#servenoderequest), [`startRemoteHttpServer`](#startremotehttpserver)
- `src/remote/oauth.ts`: [`readOAuthSettings`](#readoauthsettings), [`resolveIssuer`](#resolveissuer), [`oauthError`](#oautherror), [`authorizationServerMetadata`](#authorizationservermetadata), [`protectedResourceMetadata`](#protectedresourcemetadata), [`isAllowedRedirect`](#isallowedredirect), [`pkceChallenge`](#pkcechallenge), [`readRedirectUris`](#readredirecturis), [`registerClient`](#registerclient), [`clientRedirectUris`](#clientredirecturis), [`parseAuthorizeQuery`](#parseauthorizequery), [`readCodeChallenge`](#readcodechallenge)
- `src/remote/seal.ts`: [`parseSealKey`](#parsesealkey), [`sealPayload`](#sealpayload), [`unsealPayload`](#unsealpayload), [`openSealed`](#opensealed), [`audienceMatches`](#audiencematches)
- `src/remote/streamed-tool.ts`: [`asJsonObject`](#asjsonobject), [`parseToolCallRequest`](#parsetoolcallrequest), [`readToolCallRequest`](#readtoolcallrequest), [`streamedResultFrame`](#streamedresultframe), [`streamedToolResponse`](#streamedtoolresponse)
- `src/remote/tokens.ts`: [`grantFromClaims`](#grantfromclaims), [`sealAuthorizeRequest`](#sealauthorizerequest), [`openAuthorizeRequest`](#openauthorizerequest), [`issueAuthorizationCode`](#issueauthorizationcode), [`issueTokenSet`](#issuetokenset), [`redeemAuthorizationCode`](#redeemauthorizationcode), [`redeemRefreshToken`](#redeemrefreshtoken), [`redeemTokenRequest`](#redeemtokenrequest), [`readAccessGrant`](#readaccessgrant)
- `tools/bundle/bundle.ts`: [`listConnectors`](#listconnectors), [`isRemoteMcpUrl`](#isremotemcpurl), [`mcpServerProblems`](#mcpserverproblems), [`pluginMcpProblems`](#pluginmcpproblems), [`bundleOptions`](#bundleoptions)
- `tools/bundle/cli.ts`: [`buildPlanSkill`](#buildplanskill), [`buildConnector`](#buildconnector), [`runBuildCli`](#runbuildcli)
- `tools/bundle/plan-skill.ts`: [`hasPlanSkill`](#hasplanskill), [`planCliBundleOptions`](#planclibundleoptions), [`planRuntimeBundleOptions`](#planruntimebundleoptions), [`inlinePlanRuntime`](#inlineplanruntime), [`buildPlanTemplate`](#buildplantemplate)
- `tools/docs/ast.ts`: [`toPosixRelative`](#toposixrelative), [`globToRegExp`](#globtoregexp), [`isAnalyzedSource`](#isanalyzedsource), [`openProject`](#openproject), [`signatureOf`](#signatureof), [`collectFileFunctions`](#collectfilefunctions), [`collectFunctions`](#collectfunctions), [`isDataDeclaration`](#isdatadeclaration), [`collectFileConstants`](#collectfileconstants), [`collectConstants`](#collectconstants), [`isIgnoredReference`](#isignoredreference), [`ownerLabelOf`](#ownerlabelof), [`findDeclaration`](#finddeclaration), [`buildReferenceIndex`](#buildreferenceindex), [`buildCallGraph`](#buildcallgraph)
- `tools/docs/checks.ts`: [`checkFunctionsDocumented`](#checkfunctionsdocumented), [`checkSectionModules`](#checksectionmodules), [`checkUniqueNames`](#checkuniquenames), [`checkGeneratedBlocks`](#checkgeneratedblocks), [`checkManualFields`](#checkmanualfields), [`checkProcessCitations`](#checkprocesscitations), [`checkStructure`](#checkstructure), [`checkUiComponents`](#checkuicomponents), [`checkTests`](#checktests), [`checkConstants`](#checkconstants), [`runAllChecks`](#runallchecks)
- `tools/docs/cli.ts`: [`runDocsCli`](#rundocscli)
- `tools/docs/config.ts`: [`mergeDocsConfig`](#mergedocsconfig), [`loadDocsConfig`](#loaddocsconfig)
- `tools/docs/inventory.ts`: [`listGitFiles`](#listgitfiles), [`walkFiles`](#walkfiles), [`dirsFromFiles`](#dirsfromfiles), [`listVersionedDirs`](#listversioneddirs), [`readTestFilesText`](#readtestfilestext), [`listUiComponents`](#listuicomponents), [`loadTestExceptions`](#loadtestexceptions), [`buildInventory`](#buildinventory)
- `tools/docs/markdown.ts`: [`firstGroup`](#firstgroup), [`stripCodeBlocks`](#stripcodeblocks), [`extractCalledNames`](#extractcallednames), [`sliceBetween`](#slicebetween), [`replaceBetween`](#replacebetween), [`extractFunctionSections`](#extractfunctionsections), [`buildSection`](#buildsection), [`extractProcessCitations`](#extractprocesscitations), [`extractDocumentedDirs`](#extractdocumenteddirs), [`extractBacktickedNames`](#extractbacktickednames)
- `tools/docs/render.ts`: [`formatList`](#formatlist), [`renderGeneratedBlock`](#rendergeneratedblock), [`renderNewSection`](#rendernewsection), [`renderModuleIndex`](#rendermoduleindex), [`computeGeneratedData`](#computegenerateddata), [`closureOf`](#closureof), [`processesByFunction`](#processesbyfunction), [`replaceSectionBlock`](#replacesectionblock), [`appendSection`](#appendsection), [`insertBeforeDataTable`](#insertbeforedatatable), [`removeSection`](#removesection), [`removeEmptyModules`](#removeemptymodules), [`pruneOrphanSections`](#pruneorphansections), [`applyGenerated`](#applygenerated)
- `tools/docs/run.ts`: [`readOptional`](#readoptional), [`readDocsTexts`](#readdocstexts), [`formatIssues`](#formatissues), [`runCheck`](#runcheck), [`generateFunctionsDoc`](#generatefunctionsdoc), [`runGenerate`](#rungenerate)
- `tools/pr-check/cli.ts`: [`runPrCheckCli`](#runprcheckcli)
- `tools/pr-check/whatsapp-image.ts`: [`touchesWhatsAppImage`](#toucheswhatsappimage), [`whatsAppImageDecision`](#whatsappimagedecision), [`splitGitLines`](#splitgitlines), [`runGit`](#rungit), [`listChangedFiles`](#listchangedfiles)
- `tools/smoke/cli.ts`: [`sleepMs`](#sleepms), [`readSmokeCheck`](#readsmokecheck), [`runSmokeCli`](#runsmokecli)
- `tools/smoke/smoke.ts`: [`wranglerValue`](#wranglervalue), [`workerBaseUrl`](#workerbaseurl), [`fetchWorkersSubdomain`](#fetchworkerssubdomain), [`fetchPublishedTools`](#fetchpublishedtools), [`smokeAttempt`](#smokeattempt), [`runSmokeCheck`](#runsmokecheck)

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
- **Input:** `fetchFn`: `fetch` function; `url`: download link (already authorized by Canvas); `headers` (e.g. `Range`).
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
- **Output:** `CanvasClient` with `get`, `getAll` (page of `CANVAS_PAGE_SIZE`, limit `DEFAULT_MAX_ITEMS`), `post`, `fetchText`, `upload` and `query` (read-only GraphQL).
- **Effects:** None on creation; the methods do network calls.
- **Errors:** None on creation; the methods propagate request errors.

### `fetchDownload`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async fetchDownload(fetchFn: typeof fetch, url: string, headers: Record<string, string> = {}): Promise<Response>`
- **Used by:** `createCanvasClient()`, `fetchFileBytes()`, `fetchPlainText()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Downloads a direct Canvas link and checks the status.
- **Input:** `fetchFn`: `fetch` function; `url`: download link (already authorized by Canvas); `headers` (e.g. `Range`).
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
- **Errors:** Passes on the error from `fetchDownload`; rejects with `tooLargeMessage()` (URL with the verifier hidden) as soon as the body passes `maxBytes`.

### `requestCanvas`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async requestCanvas(deps: ClientDeps, req: CanvasRequest): Promise<Response>`
- **Used by:** `collectPages()`, `requestCanvasJson()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Sends a request to the Canvas API with the token and checks the status.
- **Input:** `deps`: base URL, token and `fetchFn`; `req`: method, path, parameters and optional body.
- **Output:** Promise with the 2xx `Response`.
- **Effects:** Network (via `deps.fetchFn`).
- **Errors:** Rejects with a `CanvasApiError`: `unauthorizedMessage()` and `tokenRejected` on a 401 that refuses the token; "Canvas <status> on <method> <path>: <body>" with the status on any other non-2xx (including a 401 that only denies the resource).

### `canvasApiError`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `canvasApiError(message: string, status: number, tokenRejected = false): CanvasApiError`
- **Used by:** `assignmentPeerReviews()`, `explainPeerReviewError()`, `fetchPeerReviewAssignment()`, `graphqlData()`, `networkFailure()`, `requestCanvas()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Creates the error of a Canvas API call, carrying the HTTP status.
- **Input:** `message`; `status`; `tokenRejected` (default `false`).
- **Output:** `CanvasApiError` (an `Error` with `status` and `tokenRejected`).
- **Effects:** None (pure).
- **Errors:** None.

### `canvasErrorStatus`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `canvasErrorStatus(error: unknown): number | null`
- **Used by:** `explainPeerReviewError()`, `resolveCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Reads the HTTP status of a `CanvasApiError`.
- **Input:** `error`: anything caught.
- **Output:** The status, or `null` for any other error.
- **Effects:** None (pure).
- **Errors:** None.

### `isPermissionDenial`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `isPermissionDenial(body: string): boolean`
- **Used by:** `requestCanvas()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Says whether a 401 body is Canvas denying this resource (`"status": "unauthorized"`) rather than refusing the token.
- **Input:** `body`: response text.
- **Output:** `true` for a resource denial.
- **Effects:** None (pure).
- **Errors:** None.

### `uploadForm`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `uploadForm(slot: CanvasUploadSlot, file: UploadedBytes): FormData`
- **Used by:** `postUploadForm()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the multipart form of upload step 2, with Canvas's `upload_params` first and the file last.
- **Input:** `slot`: the upload slot of step 1 (`upload_url`, optional `upload_params`); `file`: name, MIME type and bytes.
- **Output:** A `FormData` with every param and a `file` field (a `Blob` named after the file).
- **Effects:** None (pure).
- **Errors:** None.

### `postUploadForm`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `postUploadForm(fetchFn: typeof fetch, slot: CanvasUploadSlot, file: UploadedBytes): Promise<Response>`
- **Used by:** `createCanvasClient()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Sends the file to the signed upload URL without the Canvas token and without following redirects.
- **Input:** `fetchFn`: injected `fetch`; `slot`: the upload slot; `file`: the file to send.
- **Output:** The raw `Response` of the upload host (2xx with the file, or a 3xx to confirm).
- **Effects:** Network: one `POST` to `slot.upload_url`.
- **Errors:** Rejects only on network failure; statuses are handled by `confirmUpload()`.

### `confirmUpload`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async confirmUpload(deps: ClientDeps, res: Response): Promise<T>`
- **Used by:** `createCanvasClient()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Finishes upload step 3, reading the file of a 2xx answer or confirming a 3xx at its `Location` with the token.
- **Input:** `deps`: client dependencies (base URL, token, fetch); `res`: the response of `postUploadForm()`.
- **Output:** The Canvas file JSON (`id`, `display_name`, `size`...).
- **Effects:** Network: one authenticated `POST` to `Location` when the answer is a 3xx.
- **Errors:** `Canvas rejected the file upload (<status>): <body>` for any other status or a 3xx without `Location`; `CanvasApiError` if the confirmation fails.

### `networkFailure`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `networkFailure(error: unknown, req: CanvasRequest): unknown`
- **Used by:** `readCanvasJson()`, `requestCanvas()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Turns a call that hit the `CANVAS_TIMEOUT_MS` limit into a clear error; any other error passes unchanged.
- **Input:** `error`: what `fetch` threw; `req`: the request (method and path, never the token).
- **Output:** A `CanvasApiError` 504 for a `TimeoutError`, else `error` itself.
- **Effects:** None (pure).
- **Errors:** None (returns the error, the caller throws it).

### `readCanvasJson`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async readCanvasJson(res: Response, req: CanvasRequest): Promise<T>`
- **Used by:** `collectPages()`, `requestCanvasJson()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Reads the JSON body of a Canvas answer under the call's timeout.
- **Input:** `res`: answer; `req`: the request (for the message).
- **Output:** The parsed body.
- **Effects:** Reads the body stream.
- **Errors:** A timeout while reading becomes the 504 of `networkFailure()`; invalid JSON throws `SyntaxError`.

### `requestCanvasJson`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async requestCanvasJson(deps: ClientDeps, req: CanvasRequest): Promise<T>`
- **Used by:** `confirmUpload()`, `createCanvasClient()`, `queryCanvasGraphql()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Sends a request with `requestCanvas()` and reads its JSON body with `readCanvasJson()`.
- **Input:** `deps`: client dependencies; `req`: request.
- **Output:** The parsed body.
- **Effects:** Network: one Canvas call.
- **Errors:** Same as `requestCanvas()` and `readCanvasJson()`.

### `isReadOnlyGraphql`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `isReadOnlyGraphql(document: string): boolean`
- **Used by:** `queryCanvasGraphql()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Says whether a GraphQL document only reads: starts with `{` or `query` and has no `mutation`/`subscription`.
- **Input:** `document`: GraphQL text.
- **Output:** `true` for a read-only query.
- **Effects:** None (pure).
- **Errors:** None.

### `graphqlData`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `graphqlData(envelope: GraphqlEnvelope<T>): T`
- **Used by:** `queryCanvasGraphql()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Extracts `data` from a GraphQL answer; Canvas answers 200 even on errors, so errors become exceptions.
- **Input:** `envelope`: `{ data, errors }`.
- **Output:** The `data`.
- **Effects:** None (pure).
- **Errors:** `CanvasApiError` 400 with the first error message, or "empty answer" when `data` is null.

### `queryCanvasGraphql`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/client.ts`
- **Signature:** `async queryCanvasGraphql(deps: ClientDeps, query: GraphqlQuery): Promise<T>`
- **Used by:** `createCanvasClient()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Posts a read-only GraphQL query to `/api/graphql` with the token and the timeout.
- **Input:** `deps`: client dependencies; `query`: document and variables.
- **Output:** The `data` of the answer.
- **Effects:** Network: one POST to Canvas GraphQL (a read).
- **Errors:** Error (without calling Canvas) for a mutation or subscription; `CanvasApiError` from `requestCanvas()` or `graphqlData()`.

## `connectors/canvas-puc/src/format.ts`

### `shortText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `shortText(html: string | null | undefined): string`
- **Used by:** `toCalendarEvent()`
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
- **Signature:** `toAssignmentDetail(a: CanvasAssignment, submission: CanvasSubmission | null, baseUrl: string): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converts a full assignment: description as text with `[link N]` marks and its links, dates, rubric and submission.
- **Input:** `a`: assignment from the API; `submission`: the student's submission or `null`; `baseUrl`: Canvas base URL.
- **Output:** `View` with dates (`due_at`, `unlock_at`, `lock_at`), `points`, `description`, `links` (`canvasHtml()`), `rubric` and `submission` (`null` without a submission).
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
- **Signature:** `toAnnouncement(a: CanvasAnnouncement, baseUrl: string): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converts a course announcement with its text converted and cut, and the links of the whole message.
- **Input:** `a`: announcement from the API; `baseUrl`.
- **Output:** `View` with `id`, `title`, `course`, `author`, `posted_at`, `text` (cut at `MAX_TEXT_LENGTH`), `links` and `url`.
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
- **Signature:** `flattenDiscussion(entries: readonly CanvasDiscussionEntry[] | undefined, ctx: DiscussionContext, depth = 0): View[]`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `flattenDiscussion()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Flattens a forum's post tree, marking the level of each reply and keeping each post's links.
- **Input:** `entries`: posts (or `undefined`); `ctx`: `names` (id → author) and `baseUrl`; `depth`: starting level (default 0).
- **Output:** Pre-order list of `{ depth, author, date, text, links? }` (`text` with `[link N]` marks, `links` only when there are some); empty without posts.
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

### `rawHtmlField`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `rawHtmlField(key: string, html: string | null | undefined, wanted: boolean): View`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** `{ [key]: html }` when the raw HTML was asked for (`raw_html: true`), else `{}`.
- **Input:** `key`: field name; `html`; `wanted`.
- **Output:** View to spread into the answer.
- **Effects:** None (pure).
- **Errors:** None.

### `linksField`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `linksField(links: readonly CanvasLink[]): View`
- **Used by:** `flattenDiscussion()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** `{ links }` only when there are links, keeping long lists (forum posts) lean.
- **Input:** `links`.
- **Output:** View to spread.
- **Effects:** None (pure).
- **Errors:** None.

### `plannerItemType`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `plannerItemType(plannableType: string | undefined): string | undefined`
- **Used by:** `toPlannerItem()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Names a planner item type for the model: `assessment_request` becomes `peer_review`; every other type passes unchanged.
- **Input:** `plannableType`: Canvas `plannable_type`.
- **Output:** The type name, or `undefined`.
- **Effects:** None (pure).
- **Errors:** None.

### `reviewStatus`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/format.ts`
- **Signature:** `reviewStatus(workflowState: string | null | undefined): 'pending' | 'completed'`
- **Used by:** `toPeerReview()`, `toPlannerItem()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Maps a peer review `workflow_state` to `pending` or `completed`.
- **Input:** `workflowState`: Canvas state (`assigned`, `completed`).
- **Output:** `'completed'` or `'pending'`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/helpers.ts`

### `isoDaysFrom`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `isoDaysFrom(now: Date, days: number): string`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `plannerWindow()`
- **Processes:** P03

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
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `sweepPeerReviews()`
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
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `fetchLinkSources()`, `listLinkedFiles()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Fetches a paginated listing, replacing failure with an empty list.
- **Input:** `client`: Canvas client; `path`: API path; `params`: query parameters.
- **Output:** Promise with the items; empty list if the fetch fails.
- **Effects:** Network.
- **Errors:** None (failures become `[]`).

### `plannerWindow`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/helpers.ts`
- **Signature:** `plannerWindow(now: Date, days: number): { start_date: string; end_date: string }`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the planner window: from 00:00 of today in São Paulo (`CANVAS_TIME_ZONE`) to the end of the day `days` days later, so items due earlier today stay in.
- **Input:** `now`: current instant; `days`: days after today.
- **Output:** `{ start_date, end_date }` in ISO.
- **Effects:** None (pure).
- **Errors:** None.

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
- **Signature:** `canvasTools(writeBlock: string | null): readonly ToolSpec<CanvasContext>[]`
- **Used by:** `canvasRemoteConnector()`, `createCanvasUserServer()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Lists every Canvas tool, always: the write ones run when `writeBlock` is null and otherwise answer each call with that reason.
- **Input:** `writeBlock`: why writing is off for this user (how to turn it on), or `null` when it is on.
- **Output:** `CANVAS_READ_TOOLS`, `CANVAS_INBOX_READ_TOOLS`, then `CANVAS_WRITE_TOOLS` and `CANVAS_INBOX_WRITE_TOOLS` through `gateToolSpecs()`.
- **Effects:** None (pure).
- **Errors:** None.

### `createCanvasMcpServer`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/tools.ts`
- **Signature:** `createCanvasMcpServer(specs: readonly ToolSpec<CanvasContext>[], ctx: CanvasContext): McpServer`
- **Used by:** `canvasRemoteConnector()`, `createCanvasUserServer()`
- **Processes:** P03, P08, P09, P19

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
- **Processes:** P08, P10, P12, P13, P17, P19

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
- **Processes:** P08, P10, P12, P13, P17, P19

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
- **Used by:** `attachmentBytesToText()`, `docxXmlToText()`, `downloadRefusal()`, `messageBodyText()`, `readCanvasFileText()`, `shortText()`, `toConversationMessage()`, `toConversationSummary()`
- **Processes:** P03, P08, P09, P12, P18

<!-- generated:end -->

- **Does:** Converts HTML into plain text (via `parseHtmlContent()`, without link marks), preserving paragraphs and lists as line breaks.
- **Input:** `html`: HTML, `null` or `undefined`.
- **Output:** Text without tags, with entities decoded and trimmed; `''` for empty input.
- **Effects:** None (pure).
- **Errors:** None.

### `safeHttpUrl`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `safeHttpUrl(raw: string | undefined, baseUrl?: string): string | null`
- **Used by:** `addHtmlMedia()`, `canvasRefTarget()`, `openHtmlAnchor()`
- **Processes:** P03, P08, P09, P12, P18

<!-- generated:end -->

- **Does:** Resolves a URL found in HTML to an absolute http(s) URL, dropping control characters.
- **Input:** `raw`: `href`/`src` value; `baseUrl`: base for relative URLs (optional).
- **Output:** Absolute URL, or `null` for empty, invalid, relative-without-base and non-http(s) URLs (`javascript:`, `data:`, `mailto:`).
- **Effects:** None (pure).
- **Errors:** None (invalid URLs become `null`).

### `keptHtmlAttrs`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `keptHtmlAttrs(attrs: Readonly<Record<string, string>>): Record<string, string>`
- **Used by:** `addHtmlMedia()`, `openHtmlAnchor()`
- **Processes:** P03, P08, P09, P12, P18

<!-- generated:end -->

- **Does:** Keeps only the attributes listed in `HTML_KEPT_ATTRS` that are not blank.
- **Input:** `attrs`: attributes of a tag.
- **Output:** Object with the kept attributes, trimmed.
- **Effects:** None (pure).
- **Errors:** None.

### `addHtmlRef`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `addHtmlRef(walk: HtmlWalk, ref: Omit<HtmlRef, 'n'>): number`
- **Used by:** `addHtmlMedia()`, `closeHtmlAnchor()`
- **Processes:** P03, P08, P09, P12, P18

<!-- generated:end -->

- **Does:** Registers a link/media reference, reusing the number of a URL seen before.
- **Input:** `walk`: parse state; `ref`: reference without number.
- **Output:** The reference number (`n`).
- **Effects:** Mutates `walk.refs` (local parse state only).
- **Errors:** None.

### `markHtmlRef`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `markHtmlRef(walk: HtmlWalk, n: number, title?: string): void`
- **Used by:** `addHtmlMedia()`, `closeHtmlAnchor()`
- **Processes:** P03, P08, P09, P12, P18

<!-- generated:end -->

- **Does:** Writes the ` [link N]` mark (with the title, for media) into the text when marks are on.
- **Input:** `walk`; `n`: number; `title`: optional title.
- **Output:** Nothing.
- **Effects:** Mutates `walk.out` (local parse state only).
- **Errors:** None.

### `openHtmlAnchor`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `openHtmlAnchor(walk: HtmlWalk, attrs: Readonly<Record<string, string>>): void`
- **Used by:** `openHtmlTag()`
- **Processes:** P03, P08, P09, P12, P18

<!-- generated:end -->

- **Does:** Starts collecting the text of an `<a>` whose `href` is a safe http(s) URL.
- **Input:** `walk`; `attrs`: attributes of the `<a>`.
- **Output:** Nothing.
- **Effects:** Sets `walk.anchor` (local parse state only).
- **Errors:** None.

### `closeHtmlAnchor`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `closeHtmlAnchor(walk: HtmlWalk): void`
- **Used by:** `closeHtmlTag()`, `parseHtmlContent()`
- **Processes:** P03, P08, P09, P12, P18

<!-- generated:end -->

- **Does:** Closes the open `<a>`: registers it with its text (or `title`/URL) and writes its mark.
- **Input:** `walk`.
- **Output:** Nothing (no-op without an open anchor).
- **Effects:** Mutates `walk` (local parse state only).
- **Errors:** None.

### `addHtmlMedia`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `addHtmlMedia(walk: HtmlWalk, tag: string, attrs: Readonly<Record<string, string>>): void`
- **Used by:** `openHtmlTag()`
- **Processes:** P03, P08, P09, P12, P18

<!-- generated:end -->

- **Does:** Registers a media tag (`iframe`, `img`, `video`, `audio`, `source`, `embed`) and writes `title [link N]`.
- **Input:** `walk`; `tag`: tag name; `attrs`: its attributes.
- **Output:** Nothing (media without a safe URL are skipped).
- **Effects:** Mutates `walk` (local parse state only).
- **Errors:** None.

### `openHtmlTag`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `openHtmlTag(walk: HtmlWalk, name: string, attrs: Readonly<Record<string, string>>): void`
- **Used by:** `parseHtmlContent()`
- **Processes:** P03, P08, P09, P12, P18

<!-- generated:end -->

- **Does:** Handles an opening tag: skipped blocks, line breaks, bullets, links and media.
- **Input:** `walk`; `name`: lower-case tag; `attrs`.
- **Output:** Nothing.
- **Effects:** Mutates `walk` (local parse state only).
- **Errors:** None.

### `closeHtmlTag`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `closeHtmlTag(walk: HtmlWalk, name: string): void`
- **Used by:** `parseHtmlContent()`
- **Processes:** P03, P08, P09, P12, P18

<!-- generated:end -->

- **Does:** Handles a closing tag: ends skipped blocks, links and block lines.
- **Input:** `walk`; `name`: lower-case tag.
- **Output:** Nothing.
- **Effects:** Mutates `walk` (local parse state only).
- **Errors:** None.

### `tidyHtmlText`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `tidyHtmlText(raw: string): string`
- **Used by:** `parseHtmlContent()`
- **Processes:** P03, P08, P09, P12, P18

<!-- generated:end -->

- **Does:** Cleans the collected text with `HTML_TEXT_CLEANUPS` and trims it.
- **Input:** `raw`: collected text.
- **Output:** Text without non-breaking spaces, trailing spaces or more than one blank line.
- **Effects:** None (pure).
- **Errors:** None.

### `parseHtmlContent`

<!-- generated:start -->

- **File:** `src/core/html.ts`
- **Signature:** `parseHtmlContent(html: string | null | undefined, options: HtmlParseOptions = {}): HtmlContent`
- **Used by:** `canvasHtml()`, `htmlToText()`
- **Processes:** P03, P08, P09, P12, P18

<!-- generated:end -->

- **Does:** Parses HTML with htmlparser2 into readable text and the list of its links and media, never running scripts.
- **Input:** `html`: HTML, `null` or `undefined`; `options`: `baseUrl` for relative links, `marks` to write `title [link N]`.
- **Output:** `{ text, refs }`; empty for empty input.
- **Effects:** None (pure).
- **Errors:** None (malformed HTML is tolerated by the parser).

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
- **Used by:** `connectors/canvas-puc/src/tools-inbox.ts (module)`, `connectors/canvas-puc/src/tools-read.ts (module)`, `connectors/canvas-puc/src/tools-write.ts (module)`, `connectors/gmail/src/draft-tools.ts (module)`, `connectors/gmail/src/mailbox-tools.ts (module)`, `connectors/gmail/src/send-tools.ts (module)`, `connectors/gmail/src/tools.ts (module)`, `connectors/whatsapp/src/tools.ts (module)`, `replyTool()`
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
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `listFilesWithLinked()`, `toToolResult()`, `withCheckedAt()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14, P19

<!-- generated:end -->

- **Does:** Converts a tool's return value into a text MCP result.
- **Input:** `data`: text or serializable value; `notes`: extra texts (default empty).
- **Output:** `CallToolResult` with one text block (compact JSON if not a string, to save tokens) plus one per note.
- **Effects:** None (pure).
- **Errors:** Throws if `data` is not JSON-serializable (e.g. circular reference).

### `errorResult`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `errorResult(error: unknown): CallToolResult`
- **Used by:** `runToolSafely()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14, P19

<!-- generated:end -->

- **Does:** Converts an error into an MCP result with `isError`, redacting secrets from the message (`redactSecrets`).
- **Input:** `error`: any thrown value.
- **Output:** `CallToolResult` with `isError: true` and the redacted error message.
- **Effects:** None (pure).
- **Errors:** None.

### `runToolSafely`

<!-- generated:start -->

- **File:** `src/mcp/tools.ts`
- **Signature:** `async runToolSafely(spec: ToolSpec<C>, ctx: C, rawArgs: unknown): Promise<CallToolResult>`
- **Used by:** `registerToolSpecs()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14, P19

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
- **Used by:** `createCanvasMcpServer()`, `createGmailServer()`, `createWhatsAppCatalogServer()`, `createWhatsAppMcpServer()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14, P19

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
- **Used by:** `chunkToolResult()`, `connectors/canvas-puc/src/tools-read.ts (module)`, `disabledToolSpec()`, `listFilesWithLinked()`, `mediaResult()`, `withCheckedAt()`
- **Processes:** P03, P08, P09, P13, P14, P19

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
- **Processes:** P03, P08, P09, P10, P12, P13, P14, P19

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
- **Used by:** `chunkToolResult()`, `mediaResult()`
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
- **Effects:** Opens the HTTP port and writes to stdout; write opt-ins live in memory (`memoryWriteAccessStore()`).
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
- **Signature:** `canvasLoginText(baseUrl: string, allowWrite: boolean): LoginPageText`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the texts of the Canvas authorization page.
- **Input:** `baseUrl`: Canvas address; `allowWrite`: whether the server offers the write opt-in.
- **Output:** `LoginPageText` with the help pointing to `/profile/settings` and, with writing on, the unticked write opt-in (`grantOption`).
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
- **Signature:** `canvasRemoteConnector(settings: CanvasRemoteSettings, access: WriteAccessDeps): RemoteConnector`
- **Used by:** `createWorkerApp()`, `startCanvasRemoteServer()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the Canvas `RemoteConnector` for the HTTP server; `access` backs the write-access page.
- **Input:** `settings`: remote-mode configuration; `access`: write-access dependencies (OAuth settings, opt-in store, clock).
- **Output:** Page texts, token verification, per-user `McpServer` factory (`createCanvasUserServer()`), list-only `catalogServer`, `download_file` streaming, expiry renewal (`renewCanvasToken()`) and the `GET`/`POST /write-access` pages.
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
- **Used by:** `canvasRemoteConnector()`, `createCanvasUserServer()`
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

- **Does:** Connector `streamTool` of Canvas: finds the file with `resolveCanvasFile()` (file_id or url) and streams `download_file` (with its `offset`/`length`), leaves every other tool to the MCP server.
- **Input:** `client`; `call` (`ToolCallRequest`).
- **Output:** `StreamedToolContent`; `null` for other tools or when `streamCanvasFile()` declines.
- **Effects:** Canvas GET `/files/:id` and the download.
- **Errors:** Rejects on invalid arguments (zod), on `resolveCanvasFile()` errors (never with the verifier) or Canvas errors; the remote handler then falls back to the MCP server.

### `readOnlyConnectionReason`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `readOnlyConnectionReason(link: string): string`
- **Used by:** `canvasWriteBlock()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Why the write tools are off for a read-only connection, with the link that turns writing on (no new token).
- **Input:** `link`: the sealed write-access page URL (`writeAccessUrl()`).
- **Output:** Reason text asking the user to open the link and click "Allow writing", then try again.
- **Effects:** None (pure).
- **Errors:** None.

### `userAllowsWrite`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `async userAllowsWrite(access: WriteAccessDeps, grant: SealedGrant): Promise<boolean>`
- **Used by:** `canvasWriteBlock()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Says whether this user may write: the write option ticked at sign-in, or turned on later on the write-access page.
- **Input:** `access`: write-access dependencies (store); `grant`: the user's sealed grant (secret and grants).
- **Output:** `true` when the grants include `CANVAS_WRITE_GRANT` or the store holds the opt-in for the token's fingerprint.
- **Effects:** KV read (through `hasStoredWriteOptIn()`) when the grant lacks the write permission.
- **Errors:** None (a store failure counts as off).

### `canvasWriteBlock`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `async canvasWriteBlock(settings: CanvasRemoteSettings, access: WriteAccessDeps, grant: SealedGrant): Promise<string | null>`
- **Used by:** `createCanvasUserServer()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Why the write tools are off for this user, or null when they are on; the tools stay listed either way.
- **Input:** `settings`: remote Canvas settings (`allowWrite`); `access`: write-access dependencies; `grant`: the user's sealed grant.
- **Output:** `CANVAS_WRITE_OFF_REASON` when the server turned writing off; `null` when the user may write; otherwise `readOnlyConnectionReason()` with a fresh write-access link.
- **Effects:** Like `userAllowsWrite()` (KV read).
- **Errors:** None.

### `createCanvasUserServer`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/remote.ts`
- **Signature:** `async createCanvasUserServer(settings: CanvasRemoteSettings, access: WriteAccessDeps, grant: SealedGrant): Promise<McpServer>`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Creates the user's MCP server: every tool listed, the write ones refusing with the reason when writing is off.
- **Input:** `settings`: remote Canvas settings; `access`: write-access dependencies; `grant`: the user's sealed grant (Canvas token and grants).
- **Output:** `McpServer` with `canvasTools(block)` bound to a Canvas client for the user's token and a clock.
- **Effects:** Like `canvasWriteBlock()` (KV read); the tools themselves only call Canvas when run.
- **Errors:** None.

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
- **Used by:** `consentPage()`, `expiredWriteAccessPage()`, `handleAuthorizePage()`, `handleAuthorizeSubmit()`, `handlePairCallback()`, `handlePairPost()`, `handleUpstreamCallback()`, `linkConfirmPage()`, `loginPageFor()`, `messagePage()`, `pairPage()`, `routePairRequest()`, `showWriteAccess()`, `submitWriteAccess()`
- **Processes:** P03, P08, P09, P10, P11, P13, P15, P19

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
- **Used by:** `handleAuthorizeSubmit()`, `handlePairPost()`, `handleToken()`, `redeemConfirmedTicket()`, `submitAuthorize()`, `submitWriteAccess()`
- **Processes:** P03, P08, P09, P10, P11, P13, P15

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
- **Input:** `app`; `request`: form with `pending`, `secret` and the optional `grant` checkbox.
- **Output:** 302 to the client with a code carrying the secret and the ticked permission (`chosenGrants`); page with a redacted error if the credential fails; 400 if the request expired.
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
- **Output:** MCP response; 401 (starts OAuth) for a missing, invalid or foreign token; 403 if the connector no longer accepts the secret.
- **Effects:** Runs connector tools (network).
- **Errors:** Passes MCP transport errors through.

### `withCors`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `withCors(response: Response): Response`
- **Used by:** `routeRemoteRequest()`
- **Processes:** P08, P09, P13

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
- **Processes:** P08, P09, P13

<!-- generated:end -->

- **Does:** Picks the route by method and path; a connector page is used only when no core route matches.
- **Input:** `app`; `request`.
- **Output:** Core route response, with CORS only on API routes (`allowsCors`); a connector page response (no CORS); 204 on preflight; 404 on an unknown path.
- **Effects:** Those of the chosen route or page.
- **Errors:** Passes route and page errors through.

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
- **Processes:** P03, P08, P09, P10, P11, P13, P15, P19

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
- **Effects:** Whatever the connector's `renewSecret` does; a redacted warning (`logWarning`) if it fails.
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
- **Signature:** `async serveMcpWithStreaming(connector: RemoteConnector, grant: SealedGrant, request: Request): Promise<Response>`
- **Used by:** `handleMcp()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Serves `/mcp`: a call the connector streams goes straight out; everything else goes to a new MCP server created (and awaited) for this request with the user's grant.
- **Input:** `connector`; `grant`: the user's secret and permissions; `request`.
- **Output:** `Response`.
- **Effects:** Like `streamToolQuietly()`, `connector.createServer()` and `serveMcpRequest()`.
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
- **Effects:** Calls the connector; logs a redacted warning on failure.
- **Errors:** None.

### `chosenGrants`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `chosenGrants(login: SecretLogin, form: URLSearchParams): string[]`
- **Used by:** `handleAuthorizeSubmit()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Permissions the user ticked on the login page: only the one the connector offers (`text.grantOption`); anything else in the form is ignored.
- **Input:** `login`: `SecretLogin`; `form`: posted form.
- **Output:** `[name]` or `[]`.
- **Effects:** None.
- **Errors:** None.

### `allowsCors`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `allowsCors(path: string): boolean`
- **Used by:** `routeRemoteRequest()`
- **Processes:** P08, P09, P13

<!-- generated:end -->

- **Does:** Says whether a path is an API route that other origins may call; the browser pages (`/authorize`, `/oauth/callback`) get no CORS headers.
- **Input:** `path`: request path without trailing slash.
- **Output:** `true` for API routes.
- **Effects:** None.
- **Errors:** None.

### `handleToolCatalog`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `handleToolCatalog(app: RemoteApp, request: Request): Promise<Response>`
- **Used by:** `src/remote/handler.ts (module)`
- **Processes:** P19

<!-- generated:end -->

- **Does:** `GET /tools`: serves the public tool catalog (names, schemas, annotations; never user data).
- **Input:** `app`: the remote app (its connector's `catalogServer`); `request`: the received request (origin).
- **Output:** The `tools/list` JSON-RPC response of the catalog server, or 404 when the connector has no `catalogServer`.
- **Effects:** Like `serveToolCatalog()` (in-process MCP round trip; no network, no user data).
- **Errors:** None.

### `connectorPage`

<!-- generated:start -->

- **File:** `src/remote/handler.ts`
- **Signature:** `connectorPage(app: RemoteApp, key: string): ((request: Request) => Promise<Response>) | undefined`
- **Used by:** `routeRemoteRequest()`
- **Processes:** P08, P09, P13

<!-- generated:end -->

- **Does:** Looks up the connector's own page for a `METHOD path` key.
- **Input:** `app`: the remote app; `key`: `METHOD path` (e.g. `GET /write-access`).
- **Output:** The page handler from `connector.pages`, or `undefined` when there is none.
- **Effects:** None (pure).
- **Errors:** None.

## `src/remote/login-page.ts`

### `escapeHtml`

<!-- generated:start -->

- **File:** `src/remote/login-page.ts`
- **Signature:** `escapeHtml(value: string): string`
- **Used by:** `alertHtml()`, `consentPageBody()`, `grantCheckbox()`, `handlePairCallback()`, `handleUpstreamCallback()`, `linkConfirmBody()`, `messagePage()`, `pageDocument()`, `pairForm()`, `pairingSection()`, `renderLoginPage()`, `renderPairPage()`, `renderWriteAccessPage()`
- **Processes:** P03, P08, P09, P10, P11, P13, P15, P19

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

### `grantCheckbox`

<!-- generated:start -->

- **File:** `src/remote/login-page.ts`
- **Signature:** `grantCheckbox(text: LoginPageText): string`
- **Used by:** `renderLoginPage()`
- **Processes:** P08, P13

<!-- generated:end -->

- **Does:** Renders the unticked, escaped checkbox of the optional permission the connector offers on the login page.
- **Input:** `text`: `LoginPageText`.
- **Output:** HTML (empty without `grantOption`).
- **Effects:** None.
- **Errors:** None.

## `src/remote/mcp-endpoint.ts`

### `serveMcpRequest`

<!-- generated:start -->

- **File:** `src/remote/mcp-endpoint.ts`
- **Signature:** `async serveMcpRequest(server: McpServer, request: Request): Promise<Response>`
- **Used by:** `handleMcpApi()`, `serveMcpWithStreaming()`, `serveToolCatalog()`
- **Processes:** P09, P10, P12, P14, P19

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

### `toolsListRequest`

<!-- generated:start -->

- **File:** `src/remote/mcp-endpoint.ts`
- **Signature:** `toolsListRequest(origin: string): Request`
- **Used by:** `serveToolCatalog()`
- **Processes:** P10, P19

<!-- generated:end -->

- **Does:** Builds the JSON-RPC `tools/list` request, as an MCP client would POST it to `/mcp`.
- **Input:** `origin`: the server origin.
- **Output:** `Request` `POST <origin>/mcp` with JSON content type, the MCP `accept` header and a `tools/list` body.
- **Effects:** None (pure).
- **Errors:** None.

### `serveToolCatalog`

<!-- generated:start -->

- **File:** `src/remote/mcp-endpoint.ts`
- **Signature:** `serveToolCatalog(server: McpServer, origin: string): Promise<Response>`
- **Used by:** `handleDefaultRequest()`, `handleToolCatalog()`
- **Processes:** P10, P19

<!-- generated:end -->

- **Does:** Answers the catalog route with the `tools/list` response of a server that only lists its tools.
- **Input:** `server`: a list-only MCP server; `origin`: the request origin.
- **Output:** `Response` with the JSON-RPC `tools/list` result.
- **Effects:** Like `serveMcpRequest()`: connects and closes the server in process.
- **Errors:** None (failures become MCP responses).

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
- **Effects:** Reads the body, writes the response; logs a redacted warning on errors.
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
- **Used by:** `beginGoogleSignIn()`, `linkStageUrl()`, `redeemAuthorizationCode()`
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

- **Does:** Registers an OAuth client by sealing the return addresses into the `client_id`, bound to this issuer (`aud`).
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
- **Processes:** P08, P10, P12, P13, P19

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
- **Used by:** `issueAuthorizationCode()`, `issueLinkUrl()`, `issuePairCsrf()`, `issueTokenSet()`, `openPairSession()`, `registerClient()`, `sealAuthorizeRequest()`, `sealOwnerAccounts()`, `showLinkConfirmation()`, `startPairLogin()`, `storeLinkRequest()`, `writeAccessUrl()`
- **Processes:** P03, P08, P09, P10, P11, P12, P13, P15, P18

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
- **Processes:** P03, P08, P09, P10, P11, P12, P13, P14, P15, P18

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
- **Used by:** `clientRedirectUris()`, `isConfirmedInThisBrowser()`, `isTrustedPost()`, `isValidPairLogin()`, `openAuthorizeRequest()`, `openLinkTicket()`, `openOwnerAccounts()`, `openWriteTicket()`, `readAccessGrant()`, `readPairSession()`, `redeemAuthorizationCode()`, `redeemRefreshToken()`, `takeLinkRequest()`
- **Processes:** P03, P08, P09, P10, P11, P12, P13, P14, P15, P18

<!-- generated:end -->

- **Does:** Opens a not-yet-expired seal of the expected type and, when `expected.aud` is set, of the expected audience (`audienceMatches`).
- **Input:** `sealed`; `key`; `expected`: `typ`, instant `now` (Unix seconds) and optional `aud` (connector issuer).
- **Output:** `SealedClaims`; `null` if invalid, of another type or audience, without a numeric `exp` or expired.
- **Effects:** None (pure).
- **Errors:** None.

### `audienceMatches`

<!-- generated:start -->

- **File:** `src/remote/seal.ts`
- **Signature:** `audienceMatches(claims: Readonly<Record<string, unknown>>, expected: SealExpectation): boolean`
- **Used by:** `openSealed()`
- **Processes:** P03, P08, P09, P10, P11, P12, P13, P14, P15, P18

<!-- generated:end -->

- **Does:** Says whether a seal's `aud` is the expected audience (the connector issuer); a seal without `aud` passes only before `LEGACY_AUDLESS_UNTIL`, and nothing is checked when no audience is expected.
- **Input:** `claims`: opened seal; `expected`: `SealExpectation` (`typ`, `now`, optional `aud`).
- **Output:** `true` if the audience fits.
- **Effects:** None.
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
- **Input:** `grant`: request + secret + permissions; `settings`; `now`.
- **Output:** Sealed code of type `code`.
- **Effects:** Generates random bytes (seal).
- **Errors:** None.

### `issueTokenSet`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `issueTokenSet(grant: SealedGrant, settings: OAuthSettings, now: number): TokenSet`
- **Used by:** `redeemTokenRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Issues an access token (1 hour) and a refresh token (30 days) carrying the secret and the opted-in permissions, bound to this issuer (`aud`).
- **Input:** `grant`: `SealedGrant` (secret + permissions); `settings`; `now`.
- **Output:** Bearer-type `TokenSet`.
- **Effects:** Generates random bytes (seals).
- **Errors:** None.

### `redeemAuthorizationCode`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `redeemAuthorizationCode(form: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<SealedGrant>`
- **Used by:** `redeemTokenRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Checks the code against client, return address and PKCE verifier.
- **Input:** `form`: `/token` body; `settings`; `now`.
- **Output:** The sealed `SealedGrant`, or an `invalid_grant` error (also for a code of another issuer).
- **Effects:** None (pure).
- **Errors:** None.

### `redeemRefreshToken`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `redeemRefreshToken(form: URLSearchParams, settings: OAuthSettings, now: number): OAuthResult<SealedGrant>`
- **Used by:** `redeemTokenRequest()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Checks the refresh token.
- **Input:** `form`: `/token` body; `settings`; `now`.
- **Output:** The sealed `SealedGrant`, or an `invalid_grant` error (also for a refresh token of another issuer).
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
- **Output:** `RedeemedGrant` (new `TokenSet`, the grant and whether it came from a refresh), or an `invalid_grant`/`unsupported_grant_type` error.
- **Effects:** Generates random bytes (seals).
- **Errors:** None.

### `grantFromClaims`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `grantFromClaims(claims: SealedClaims): SealedGrant`
- **Used by:** `readAccessGrant()`, `redeemAuthorizationCode()`, `redeemRefreshToken()`
- **Processes:** P08, P09, P14

<!-- generated:end -->

- **Does:** Reads the user secret and the opted-in permissions from opened token claims; a token without `grants` (issued before per-user permissions) has none.
- **Input:** `claims`: opened seal.
- **Output:** `SealedGrant` (`secret`, `grants` with string items only).
- **Effects:** None.
- **Errors:** None.

### `readAccessGrant`

<!-- generated:start -->

- **File:** `src/remote/tokens.ts`
- **Signature:** `readAccessGrant(authorization: string | null, settings: OAuthSettings, now: number): SealedGrant | null`
- **Used by:** `handleMcp()`
- **Processes:** P09, P14

<!-- generated:end -->

- **Does:** Reads the grant from an `Authorization: Bearer <access token>` header, accepting only an access token of this issuer (`aud`), unexpired and untampered.
- **Input:** `authorization`: header or null; `settings`; `now`.
- **Output:** `SealedGrant` or null.
- **Effects:** None.
- **Errors:** None (invalid → null).

## `connectors/canvas-puc/src/worker.ts`

### `createWorkerApp`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/worker.ts`
- **Signature:** `createWorkerApp(env: EnvVars, origin: string, store: WriteAccessStore): RemoteApp`
- **Used by:** `handleWorkerFetch()`
- **Processes:** P08

<!-- generated:end -->

- **Does:** Builds the remote Canvas app for the Worker.
- **Input:** `env`: text variables; `origin`: request origin (issuer when there is no `PUBLIC_URL`); `store`: the write opt-in store.
- **Output:** `RemoteApp` with OAuth, the Canvas connector (with its write-access dependencies) and a clock in seconds.
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

### `writeAccessStoreFrom`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/worker.ts`
- **Signature:** `writeAccessStoreFrom(env: Readonly<Record<string, unknown>>): WriteAccessStore`
- **Used by:** `handleWorkerFetch()`
- **Processes:** P08, P09

<!-- generated:end -->

- **Does:** Picks the store of the write opt-ins: the `CANVAS_KV` binding, or memory when it is missing (misconfigured).
- **Input:** `env`: Worker bindings and variables.
- **Output:** `WriteAccessStore`: the KV namespace, or `memoryWriteAccessStore()`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/files.ts`

### `downloadRefusal`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `downloadRefusal(file: CanvasAttachment): string | null`
- **Used by:** `planCanvasDownload()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Decides whether the file cannot be brought into the conversation: no link or above `MAX_DOWNLOAD_BYTES`.
- **Input:** `file`: Canvas file.
- **Output:** Message with the reason (no link: locked or restricted, with Canvas's `lock_explanation` when given; too large: with the link), or `null` if it can be downloaded.
- **Effects:** None (pure).
- **Errors:** None.

### `downloadCanvasFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `async downloadCanvasFile(client: CanvasClient, file: CanvasAttachment, request: ChunkRequest): Promise<RawToolResult | string>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Downloads the planned part (`planCanvasDownload()`, at most `MAX_CHUNK_BYTES`) and returns it to the conversation, or the reason for not downloading it.
- **Input:** `client`: Canvas client; `file`: metadata from `/files/:id`; `request` (`offset`, `length`).
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

### `tooLargeMessage`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `tooLargeMessage(name: string, size: number, url: string): string`
- **Used by:** `downloadRefusal()`, `fetchFileBytes()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Writes the refusal for a file above `MAX_DOWNLOAD_BYTES`, pointing to the link.
- **Input:** `name`; `size` in bytes; `url`.
- **Output:** Message with the size in MB and the 70 MB limit.
- **Effects:** None.
- **Errors:** None.

### `streamCanvasFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `async streamCanvasFile(client: CanvasClient, file: CanvasAttachment, request: ChunkRequest): Promise<StreamedToolContent | null>`
- **Used by:** `streamCanvasTool()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Streams the planned part of a Canvas file for the remote server (ADR 0023, 0024): at most `MAX_CHUNK_BYTES`, never whole in memory.
- **Input:** `client`; `file` (`CanvasAttachment`); `request` (`offset`, `length`).
- **Output:** `StreamedToolContent` (description, MIME type, URI, body of the part); `null` when `planCanvasDownload()` refuses, so the regular tool explains why.
- **Effects:** HTTP GET to the file URL (with `Range` for a part).
- **Errors:** Rejects like `openCanvasChunk()`.

### `planCanvasDownload`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `planCanvasDownload(file: CanvasAttachment, request: ChunkRequest): DownloadChunk | string`
- **Used by:** `downloadCanvasFile()`, `streamCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Plans the part of a Canvas file `download_file` returns.
- **Input:** `file` (`CanvasAttachment`); `request` (`offset`, `length`).
- **Output:** `DownloadChunk`; or a message for `downloadRefusal()`, an unknown size or an offset past the end.
- **Effects:** None.
- **Errors:** None.

### `openCanvasChunk`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `async openCanvasChunk(client: CanvasClient, url: string, chunk: DownloadChunk): Promise<ReadableStream<Uint8Array>>`
- **Used by:** `downloadCanvasFile()`, `streamCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Opens the bytes of a part: sends `Range` and, when the server ignores it, skips to the part in the stream; never passes more than the part.
- **Input:** `client`; `url`; `chunk`.
- **Output:** Stream with exactly the part's bytes (fewer if the file is shorter).
- **Effects:** HTTP GET to the file URL.
- **Errors:** Rejects like `fetchDownload()`; rejects on a download without a body.

### `chunkToolResult`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/files.ts`
- **Signature:** `chunkToolResult(file: CanvasAttachment, chunk: DownloadChunk, bytes: Uint8Array): RawToolResult`
- **Used by:** `downloadCanvasFile()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the `download_file` result: description line and content block of the part.
- **Input:** `file`; `chunk`; `bytes` of the part.
- **Output:** `RawToolResult`.
- **Effects:** None.
- **Errors:** None.

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

### `buildPlanSkill`

<!-- generated:start -->

- **File:** `tools/bundle/cli.ts`
- **Signature:** `async buildPlanSkill(dir: string): Promise<void>`
- **Used by:** `buildConnector()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Build CLI: `npm run build`. For each connector, checks that the plugin points to a remote server and generates the versioned bundle `server/remote.js` (used by the Dockerfile; the Worker compiles straight from `src/`). / import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'; import { dirname, join, resolve } from 'node:path'; import { build } from 'esbuild'; import { CONNECTORS_DIR, PLAN_SKILL_DIR, PLAN_SOURCES, PLUGIN_MCP_CONFIG_PATH, REMOTE_BUNDLE_PATH, REMOTE_ENTRY, bundleOptions, listConnectors, pluginMcpProblems, } from './bundle.js'; import { buildPlanTemplate, hasPlanSkill, planCliBundleOptions } from './plan-skill.js'; /** Writes the `/planejamento-faculdade` skill's generated script and page template.
- **Input:** `dir`: connector folder.
- **Output:** Nothing.
- **Effects:** Writes `plugin/skills/planejamento-faculdade/scripts/plan.mjs` (esbuild) and `assets/plan-template.html`.
- **Errors:** esbuild and file-system errors propagate (build fails).

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
- **Processes:** P10, P12, P18, P19

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
- **Processes:** P10, P12, P19

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
- **Processes:** P10, P12, P19

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
- **Processes:** P10, P12, P19

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
- **Processes:** P10, P12, P19

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
- **Used by:** `beginGoogleSignIn()`, `exchangeGoogleCode()`, `linkStageUrl()`
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
- **Used by:** `beginGoogleSignIn()`, `linkStageUrl()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Builds the Google authorization URL.
- **Input:** `params`: client, redirect, scopes, `state`, PKCE challenge, `nonce`, `offline` and optional `loginHint`.
- **Output:** The authorization URL with PKCE S256 and account selection.
- **Effects:** None (pure).
- **Errors:** None.

### `randomToken`

<!-- generated:start -->

- **File:** `connectors/gmail/src/google-oauth.ts`
- **Signature:** `randomToken(bytes = 32): string`
- **Used by:** `beginGoogleSignIn()`, `beginLinkStage()`, `completeSignIn()`, `issueLinkUrl()`, `mimeBoundary()`, `showLinkConfirmation()`, `storeLinkRequest()`
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
- **Used by:** `completeSignIn()`, `linkFromCode()`, `verifyOwnerThenLink()`
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
- **Used by:** `completeSignIn()`, `linkFromCode()`, `verifyOwnerThenLink()`
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
- **Used by:** `storeLinkRequest()`, `takeLinkRequest()`
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
- **Used by:** `redeemConfirmedTicket()`, `takeLinkRequest()`
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
- **Used by:** `beginLinkStage()`, `finishAccountLink()`, `showLinkConfirmation()`
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

- **Does:** Handles the confirmation `POST /accounts/link`: requires the confirmation from this browser (`redeemConfirmedTicket`), redeems the ticket and starts the owner check (`verify` stage) with `beginLinkStage()`.
- **Input:** `deps`: dependencies. `request`: form POST with `ticket` and `confirm` and the link cookie.
- **Output:** 302 to Google (`openid email`, owner `login_hint`) with the link cookie; 400 page without a valid confirmation or ticket.
- **Effects:** KV: marks the ticket and stores the sealed request (10 minutes, bound to the cookie set by the confirmation page).
- **Errors:** Propagates KV failures.

### `takeLinkRequest`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async takeLinkRequest(deps: GmailDeps, request: Request): Promise<(LinkRequest & { readonly binding: string }) | null>`
- **Used by:** `finishAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Retrieves and deletes the link request on the return from Google.
- **Input:** `deps`: dependencies. `request`: Google callback with `state` and cookie.
- **Output:** The request with its stage and the cookie binding; null if missing, expired, from another Worker, without a stage or the cookie does not match.
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
- **Signature:** `async linkSafely(deps: GmailDeps, code: string, link: LinkRequest & { readonly binding: string }): Promise<Response>`
- **Used by:** `finishAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Runs the stage of the request (`verifyOwnerThenLink()` or `linkFromCode()`); failures become a 400 page without storing anything.
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

- **Does:** Return from Google when linking: checks the request, runs its stage and deletes the cookie unless the flow goes on to the next stage.
- **Input:** `deps`: dependencies. `request`: callback with `state`, `code` or `error` and the cookie.
- **Output:** Result page, always with the link cookie deleted.
- **Effects:** Those of `takeLinkRequest()` and `linkSafely()`; deletes the cookie.
- **Errors:** None: failures become a 400 page.

### `nowSeconds`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `nowSeconds(deps: GmailDeps): number`
- **Used by:** `isConfirmedInThisBrowser()`, `issueLinkUrl()`, `openLinkTicket()`, `showLinkConfirmation()`, `storeLinkRequest()`, `takeLinkRequest()`
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

- **Does:** Generates the user's single-use link URL; the ticket carries owner, owner email and `jti`, bound to this Worker (`aud`).
- **Input:** `deps`: dependencies with the user.
- **Output:** `<origem>/accounts/link?ticket=<selo>`, valid for 10 minutes.
- **Effects:** None (only seals; stores nothing).
- **Errors:** None.

### `redeemLinkTicket`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async redeemLinkTicket(deps: GmailDeps, ticket: string): Promise<LinkTicket | null>`
- **Used by:** `redeemConfirmedTicket()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Redeems the link ticket only once.
- **Input:** `deps`: dependencies. `ticket`: link seal.
- **Output:** The opened `LinkTicket`; null if invalid, expired, from another Worker or already used.
- **Effects:** KV: reads and writes the `jti` usage mark (valid for 10 minutes).
- **Errors:** Propagates KV failures.

### `invalidTicketPage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `invalidTicketPage(): Response`
- **Used by:** `finishAccountLink()`, `showLinkConfirmation()`, `startAccountLink()`
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

### `openLinkTicket`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `openLinkTicket(deps: GmailDeps, ticket: string): LinkTicket | null`
- **Used by:** `isConfirmedInThisBrowser()`, `redeemLinkTicket()`, `showLinkConfirmation()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Opens a link ticket without spending it: type, expiry and audience (this Worker) are checked.
- **Input:** `deps`; `ticket`: sealed ticket.
- **Output:** `LinkTicket` (`owner`, `email`, `jti`) or null.
- **Effects:** None.
- **Errors:** None.

### `usedTicketKey`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `usedTicketKey(jti: string): string`
- **Used by:** `redeemLinkTicket()`, `showLinkConfirmation()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** KV key that marks a ticket as used (hash of its `jti`).
- **Input:** `jti`.
- **Output:** `ticket:<sha256>`.
- **Effects:** None.
- **Errors:** None.

### `showLinkConfirmation`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async showLinkConfirmation(deps: GmailDeps, request: Request): Promise<Response>`
- **Used by:** `connectors/gmail/src/worker.ts (module)`
- **Processes:** P11

<!-- generated:end -->

- **Does:** `GET /accounts/link`: validates the ticket without spending it and shows whose connector receives the account, with a confirmation form tied to the ticket and to a new `__Host-` browser cookie.
- **Input:** `deps`; `request`.
- **Output:** Confirmation page, or the invalid link page.
- **Effects:** Reads KV; sets the link cookie.
- **Errors:** None (invalid or used ticket → 400 page).

### `isConfirmedInThisBrowser`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `isConfirmedInThisBrowser(deps: GmailDeps, form: URLSearchParams, binding: string | null): boolean`
- **Used by:** `redeemConfirmedTicket()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Says whether a confirmation POST came from the page shown to this browser for this very ticket (sealed confirmation with the ticket `jti` and the cookie hash).
- **Input:** `deps`; `form`: posted fields; `binding`: link cookie value.
- **Output:** `true`/`false`.
- **Effects:** None.
- **Errors:** None.

### `redeemConfirmedTicket`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async redeemConfirmedTicket(deps: GmailDeps, request: Request): Promise<LinkStageStart | null>`
- **Used by:** `startAccountLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Checks the confirmation and the browser cookie, then redeems the ticket (single use).
- **Input:** `deps`; `request`: confirmation POST.
- **Output:** `LinkStageStart` for the `verify` stage (owner, binding, owner email hint) or null.
- **Effects:** Reads the body; reads and writes KV (used ticket).
- **Errors:** None (invalid → null).

### `storeLinkRequest`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async storeLinkRequest(deps: GmailDeps, link: LinkRequest, binding: string): Promise<string>`
- **Used by:** `beginLinkStage()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Stores the sealed link request (owner, PKCE verifier, nonce, stage, browser cookie hash, `aud`) under a new `link.` state.
- **Input:** `deps`; `link`: `LinkRequest`; `binding`: link cookie value.
- **Output:** The new `state`.
- **Effects:** Writes KV (10 minutes).
- **Errors:** None.

### `linkStageUrl`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `linkStageUrl(deps: GmailDeps, link: LinkRequest & { readonly state: string }, loginHint: string | null): string`
- **Used by:** `beginLinkStage()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Builds the Google address of a link stage: `openid email` with the owner `login_hint` for `verify`; Gmail scopes with offline access for `link`.
- **Input:** `deps`; `link`: request + `state`; `loginHint`: owner email or null.
- **Output:** Google authorization URL.
- **Effects:** None.
- **Errors:** None.

### `beginLinkStage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async beginLinkStage(deps: GmailDeps, start: LinkStageStart): Promise<Response>`
- **Used by:** `startAccountLink()`, `verifyOwnerThenLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Starts a link stage: stores the request and redirects the browser to Google, keeping the binding cookie.
- **Input:** `deps`; `start`: `LinkStageStart` (owner, binding, stage, login hint).
- **Output:** 302 to Google with the link cookie.
- **Effects:** Writes KV.
- **Errors:** None.

### `notOwnerPage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `notOwnerPage(): Response`
- **Used by:** `verifyOwnerThenLink()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Page shown when the Google account of the owner check is not the person who asked for the link.
- **Input:** None.
- **Output:** HTML `Response` 403 ("Nothing was linked").
- **Effects:** None.
- **Errors:** None.

### `verifyOwnerThenLink`

<!-- generated:start -->

- **File:** `connectors/gmail/src/link-flow.ts`
- **Signature:** `async verifyOwnerThenLink(deps: GmailDeps, code: string, link: LinkRequest & { readonly binding: string }): Promise<Response>`
- **Used by:** `linkSafely()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** `verify` stage return: exchanges the code, validates the `id_token` and requires its `sub` to be the link owner; only then starts the `link` stage. A forwarded link opened by someone else stops here.
- **Input:** `deps`; `code`: Google code; `link`: request with stage and binding.
- **Output:** 302 to the `link` stage; 403 `notOwnerPage()`; 400 without `id_token`.
- **Effects:** Network (Google token and JWKS); writes KV.
- **Errors:** Rejects if Google fails or the `id_token` is invalid (`linkSafely()` turns it into a page).

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
- **Used by:** `consentPage()`, `linkConfirmPage()`, `messagePage()`
- **Processes:** P10, P11, P19

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
- **Used by:** `accessDeniedPage()`, `authorizationErrorResponse()`, `finishAccountLink()`, `handleDefaultRequest()`, `invalidTicketPage()`, `linkFromCode()`, `linkSafely()`, `notOwnerPage()`, `verifyOwnerThenLink()`
- **Processes:** P10, P11, P19

<!-- generated:end -->

- **Does:** Builds a simple notice page.
- **Input:** `title`: plain-text title. `message`: plain-text message. `status`: HTTP code (default 200).
- **Output:** HTML response with the given status, restrictive CSP and `no-store`; title escaped, message redacted (`redactSecrets`) and escaped.
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
- **Used by:** `authorizationErrorResponse()`, `beginGoogleSignIn()`, `beginLinkStage()`, `finishSignIn()`, `submitAuthorize()`
- **Processes:** P10, P11

<!-- generated:end -->

- **Does:** Builds a 302 redirect with the given headers.
- **Input:** `location`: destination. `headers`: headers to keep, such as transaction cookies (default empty).
- **Output:** Bodiless 302 response, with `Location` and `cache-control: no-store`.
- **Effects:** Mutates the received `headers` object.
- **Errors:** None.

### `maskEmail`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `maskEmail(email: string): string`
- **Used by:** `linkConfirmBody()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Masks an email for display, keeping the first two characters of the name and the domain.
- **Input:** `email`.
- **Output:** Masked email (`ow***@example.com`; `***` if it is not an email).
- **Effects:** None.
- **Errors:** None.

### `linkConfirmBody`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `linkConfirmBody(view: LinkConfirmView): string`
- **Used by:** `linkConfirmPage()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Body of the link confirmation page: whose connector receives the account (masked), the warning about forwarded links and the form that posts ticket and confirmation.
- **Input:** `view`: `LinkConfirmView`.
- **Output:** Escaped HTML.
- **Effects:** None.
- **Errors:** None.

### `linkConfirmPage`

<!-- generated:start -->

- **File:** `connectors/gmail/src/pages.ts`
- **Signature:** `linkConfirmPage(view: LinkConfirmView, headers: Headers): Response`
- **Used by:** `showLinkConfirmation()`
- **Processes:** P11

<!-- generated:end -->

- **Does:** Link confirmation page; its CSP lets the form be redirected to Google and it carries the binding cookie.
- **Input:** `view`: `LinkConfirmView`; `headers`: `Set-Cookie` to copy.
- **Output:** HTML `Response` 200.
- **Effects:** None.
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
- **Processes:** P10, P12, P19

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
- **Used by:** `handleDefaultRequest()`, `handleMcpApi()`
- **Processes:** P10, P12, P19

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
- **Processes:** P10, P12, P19

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
- **Processes:** P10, P19

<!-- generated:end -->

- **Does:** Handles the connector's own routes outside `/mcp`.
- **Input:** `request`: received request. `env`: Worker variables, secrets and bindings, with `OAUTH_PROVIDER` injected by the library.
- **Output:** 200 `ok` on `GET /`; the public tool catalog on `GET /tools` (`serveToolCatalog()` with a list-only server); the response of the matched route; 404 page if the route does not exist or `OAUTH_PROVIDER` is missing; 500 if the configuration is invalid.
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
- **Processes:** P10, P12, P19

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

- **Does:** Reads the owner (`ALLOWED_EMAILS`): exactly one email. Empty or more than one throws, with no override (single tenant: everyone listed would read the same WhatsApp).
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
- **Used by:** `createWhatsAppCatalogServer()`, `createWhatsAppMcpServer()`
- **Processes:** P13, P14, P19

<!-- generated:end -->

- **Does:** Lists every WhatsApp tool, always: without `ENABLE_SEND` the send tool answers each call that sending is off.
- **Input:** `settings`: WhatsApp settings (`enableSend`).
- **Output:** `READ_TOOLS` plus `send_message`, switched off with `WHATSAPP_SEND_OFF_REASON` when `enableSend` is false.
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

### `createWhatsAppCatalogServer`

<!-- generated:start -->

- **File:** `connectors/whatsapp/src/tools.ts`
- **Signature:** `createWhatsAppCatalogServer(settings: WhatsAppSettings): McpServer`
- **Used by:** `whatsappRemoteConnector()`
- **Processes:** P13, P19

<!-- generated:end -->

- **Does:** Creates a server that only lists this deployment's tools (public catalog at `GET /tools`); none of them can run.
- **Input:** `settings`: WhatsApp settings (`enableSend`).
- **Output:** `McpServer` with `whatsappTools(settings)` registered on `listOnlyContext()`.
- **Effects:** None (pure).
- **Errors:** None when created; running a tool throws through `refuseListOnlyUse()`.

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
- **Used by:** `isConfirmedInThisBrowser()`, `linkRequestKey()`, `ownerKey()`, `showLinkConfirmation()`, `storeLinkRequest()`, `takeLinkRequest()`, `usedTicketKey()`
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
- **Used by:** `connectors/canvas-puc/src/tools-inbox.ts (module)`, `connectors/canvas-puc/src/tools-read.ts (module)`, `connectors/canvas-puc/src/tools-write.ts (module)`, `connectors/gmail/src/draft-tools.ts (module)`, `connectors/gmail/src/mailbox-tools.ts (module)`, `connectors/gmail/src/send-tools.ts (module)`, `connectors/gmail/src/tools.ts (module)`, `connectors/whatsapp/src/tools.ts (module)`, `replyTool()`
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
- **Used by:** `readLimitedBytes()`
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

### `byteRangeStream`

<!-- generated:start -->

- **File:** `src/core/stream.ts`
- **Signature:** `byteRangeStream(skip: number, take: number): TransformStream<Uint8Array, Uint8Array>`
- **Used by:** `openCanvasChunk()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Drops the first `skip` bytes of a stream, passes the next `take` and ends, cancelling the source.
- **Input:** `skip`; `take` (bytes).
- **Output:** `TransformStream` of bytes.
- **Effects:** Cancels the source once `take` bytes passed.
- **Errors:** None.

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

## `connectors/canvas-puc/src/chunks.ts`

### `planDownloadChunk`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/chunks.ts`
- **Signature:** `planDownloadChunk(total: number, request: ChunkRequest): DownloadChunk | string`
- **Used by:** `planCanvasDownload()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Plans bytes `[start, end)` of a file from the asked offset and length (default and cap `MAX_CHUNK_BYTES`).
- **Input:** `total` bytes; `request` (`ChunkRequest`).
- **Output:** `DownloadChunk` (`whole` when it is the entire file); a message for an offset past the end.
- **Effects:** None.
- **Errors:** None.

### `chunkDescription`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/chunks.ts`
- **Signature:** `chunkDescription(file: CanvasAttachment, chunk: DownloadChunk): string`
- **Used by:** `chunkToolResult()`, `streamCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Writes the description of what `download_file` returned: the file as before, or the part with its byte range, part number and the next offset.
- **Input:** `file` (`CanvasAttachment`); `chunk` (`DownloadChunk`).
- **Output:** Description line with the link.
- **Effects:** None.
- **Errors:** None.

### `chunkMimeType`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/chunks.ts`
- **Signature:** `chunkMimeType(file: CanvasAttachment, chunk: DownloadChunk): string`
- **Used by:** `chunkToolResult()`, `streamCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Picks the MIME type of the returned content: the file's own when whole, `application/octet-stream` for a part.
- **Input:** `file`; `chunk`.
- **Output:** MIME type.
- **Effects:** None.
- **Errors:** None.

### `chunkUri`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/chunks.ts`
- **Signature:** `chunkUri(url: string, chunk: DownloadChunk): string`
- **Used by:** `chunkToolResult()`, `streamCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the URI of the returned content.
- **Input:** `url` of the file; `chunk`.
- **Output:** The link, with `#bytes=<first>-<last>` for a part.
- **Effects:** None.
- **Errors:** None.

### `rangeHeaders`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/chunks.ts`
- **Signature:** `rangeHeaders(chunk: DownloadChunk): Record<string, string>`
- **Used by:** `openCanvasChunk()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the `Range` header of a part.
- **Input:** `chunk`.
- **Output:** `{ range: 'bytes=<first>-<last>' }`; `{}` for a whole file.
- **Effects:** None.
- **Errors:** None.

### `isRangeAnswer`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/chunks.ts`
- **Signature:** `isRangeAnswer(res: Response, chunk: DownloadChunk): boolean`
- **Used by:** `openCanvasChunk()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Says whether the download honoured the asked range.
- **Input:** `res` (`Response`); `chunk`.
- **Output:** `true` for a 206 whose `content-range` starts at the asked byte.
- **Effects:** None.
- **Errors:** None.

## `connectors/canvas-puc/src/inbox.ts`

### `toRecipient`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/inbox.ts`
- **Signature:** `toRecipient(r: CanvasRecipient): View`
- **Used by:** `connectors/canvas-puc/src/tools-inbox.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Maps a Canvas recipient to a lean view with its distinct course roles.
- **Input:** `r`: recipient from `GET /search/recipients`.
- **Output:** `{ id, name, roles }`; `roles` is empty without common courses.
- **Effects:** None (pure).
- **Errors:** None.

### `participantName`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/inbox.ts`
- **Signature:** `participantName(p: CanvasConversationParticipant): string | undefined`
- **Used by:** `conversationNames()`, `toConversationSummary()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Picks the display name of a conversation participant.
- **Input:** `p`: participant of a conversation.
- **Output:** `full_name`, else `name`, else `undefined`.
- **Effects:** None (pure).
- **Errors:** None.

### `conversationNames`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/inbox.ts`
- **Signature:** `conversationNames(c: CanvasConversation): Map<string, string | undefined>`
- **Used by:** `toConversationDetail()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Maps each participant id of a conversation to its display name.
- **Input:** `c`: conversation.
- **Output:** `Map` from id (string) to name; empty without participants.
- **Effects:** None (pure).
- **Errors:** None.

### `toConversationSummary`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/inbox.ts`
- **Signature:** `toConversationSummary(c: CanvasConversation): View`
- **Used by:** `connectors/canvas-puc/src/tools-inbox.ts (module)`, `toConversationDetail()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Maps a conversation to a listing view with a short last-message preview.
- **Input:** `c`: conversation from `GET /conversations`.
- **Output:** `{ id, subject, course, state, participants, message_count, last_message_at, last_message }`; the preview is text cut at `CONVERSATION_PREVIEW_LENGTH`.
- **Effects:** None (pure).
- **Errors:** None.

### `toConversationMessage`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/inbox.ts`
- **Signature:** `toConversationMessage(m: CanvasConversationMessage, names: ReadonlyMap<string, string | undefined>): View`
- **Used by:** `toConversationDetail()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Maps one inbox message to text with its author name and attachment links.
- **Input:** `m`: message; `names`: participant id → name map.
- **Output:** `{ id, author, date, text, attachments }`; `author` is `undefined` for unknown ids.
- **Effects:** None (pure).
- **Errors:** None.

### `toConversationDetail`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/inbox.ts`
- **Signature:** `toConversationDetail(c: CanvasConversation): View`
- **Used by:** `connectors/canvas-puc/src/tools-inbox.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Maps a full conversation with its messages oldest first.
- **Input:** `c`: conversation from `GET /conversations/:id`.
- **Output:** Summary fields plus `messages` (empty without messages).
- **Effects:** None (pure).
- **Errors:** None.

### `newMessagePayload`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/inbox.ts`
- **Signature:** `newMessagePayload(msg: NewMessage): Readonly<Record<string, unknown>>`
- **Used by:** `sendInboxMessage()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the `POST /conversations` body for one new group conversation.
- **Input:** `msg`: recipients (user ids), subject, body, optional `course_id` and optional `attachment_ids`.
- **Output:** Body with `recipients` as strings, `force_new`, `group_conversation`, with a course `context_code` and, with attachments, `attachment_ids` (`attachmentIdsField()`).
- **Effects:** None (pure).
- **Errors:** None.

### `sentConversation`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/inbox.ts`
- **Signature:** `sentConversation(created: readonly CanvasConversation[]): View`
- **Used by:** `sendInboxMessage()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Turns the `POST /conversations` response into the send result.
- **Input:** `created`: conversations Canvas returned.
- **Output:** `{ ok, conversation_id, subject, sent_at }`, or `{ ok, conversation_id: null, queued: true }` when the list is empty.
- **Effects:** None (pure).
- **Errors:** None.

### `sentReply`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/inbox.ts`
- **Signature:** `sentReply(c: CanvasConversation): View`
- **Used by:** `replyInboxMessage()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Turns the `add_message` response into the reply result.
- **Input:** `c`: conversation Canvas returned (newest message first).
- **Output:** `{ ok, conversation_id, message_id, sent_at }`; ids/dates are `null` without messages.
- **Effects:** None (pure).
- **Errors:** None.

### `attachmentIdsField`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/inbox.ts`
- **Signature:** `attachmentIdsField(ids: readonly Id[] | undefined): { attachment_ids?: string[] }`
- **Used by:** `newMessagePayload()`, `replyPayload()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the `attachment_ids` field of a message body, absent when there are no attachments.
- **Input:** `ids`: uploaded file IDs, or `undefined`.
- **Output:** `{ attachment_ids: string[] }` when there are IDs; `{}` otherwise.
- **Effects:** None (pure).
- **Errors:** None.

### `replyPayload`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/inbox.ts`
- **Signature:** `replyPayload(body: string, ids: readonly Id[] | undefined): Readonly<Record<string, unknown>>`
- **Used by:** `replyInboxMessage()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the body of `POST /conversations/:id/add_message`: the text and, when given, the attachment IDs.
- **Input:** `body`: plain text; `ids`: uploaded file IDs, or `undefined`.
- **Output:** `{ body }` plus `attachment_ids` (via `attachmentIdsField()`).
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/file-ref.ts`

### `fileRefFromUrl`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/file-ref.ts`
- **Signature:** `fileRefFromUrl(raw: string, baseUrl: string): CanvasFileRef`
- **Used by:** `fileRefFromArgs()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Reads the file id, course and verifier of a Canvas file link (file, preview, download, media iframe).
- **Input:** `raw`: absolute or relative link; `baseUrl`.
- **Output:** `CanvasFileRef`.
- **Effects:** None (pure).
- **Errors:** Throws for an invalid URL, another host (never fetched) or a link that is not a file.

### `fileRefFromArgs`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/file-ref.ts`
- **Signature:** `fileRefFromArgs(args: FileRefArgs, baseUrl: string): CanvasFileRef`
- **Used by:** `resolveCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the file reference from `file_id`, `url` or both; `course_id` fills the course.
- **Input:** `args`: `file_id`, `url`, `course_id`; `baseUrl`.
- **Output:** `CanvasFileRef`.
- **Effects:** None (pure).
- **Errors:** Throws when neither is given, when `file_id` and the url disagree, or as `fileRefFromUrl()`.

### `fileLookupPlan`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/file-ref.ts`
- **Signature:** `fileLookupPlan(ref: CanvasFileRef): FileLookup[]`
- **Used by:** `resolveCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Plans the lookups: course files, global files and, with a verifier, global files with it.
- **Input:** `ref`: `CanvasFileRef`.
- **Output:** List of `{ path, params, label }`; labels never contain the verifier.
- **Effects:** None (pure).
- **Errors:** None.

### `fileAccessReason`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/file-ref.ts`
- **Signature:** `fileAccessReason(status: number | null): string`
- **Used by:** `fileAccessError()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Explains in plain words why Canvas refused a file lookup (401 hidden/locked, 403 locked/restricted, 404 not found).
- **Input:** `status`: HTTP status or `null`.
- **Output:** Reason text.
- **Effects:** None (pure).
- **Errors:** None.

### `fileAccessError`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/file-ref.ts`
- **Signature:** `fileAccessError(ref: CanvasFileRef, failures: readonly FileLookupFailure[]): string`
- **Used by:** `resolveCanvasFile()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the error listing every endpoint tried, its status and the reason, with a hint to pass the link url.
- **Input:** `ref`; `failures`: label and status of each lookup.
- **Output:** Error text (no verifier).
- **Effects:** None (pure).
- **Errors:** None.

### `resolveCanvasFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/file-ref.ts`
- **Signature:** `async resolveCanvasFile(client: CanvasClient, args: FileRefArgs): Promise<CanvasAttachment>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `streamCanvasTool()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Finds a file by `file_id` and/or link, trying `fileLookupPlan()` in order, even when it is hidden from `list_files`.
- **Input:** `client`; `args`: `file_id`, `url`, `course_id`.
- **Output:** Promise with the `CanvasAttachment` of the first lookup that works.
- **Effects:** Network: up to three Canvas API calls.
- **Errors:** Rejects with `fileAccessError()` when every lookup fails, at once when Canvas rejects the token, or as `fileRefFromArgs()`.

## `connectors/canvas-puc/src/linked-files.ts`

### `isLinkedFileLink`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/linked-files.ts`
- **Signature:** `isLinkedFileLink(link: CanvasLink): boolean`
- **Used by:** `collectLinkedFiles()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Says whether a link is a file or a video.
- **Input:** `link`.
- **Output:** `true` for `file` and `video`.
- **Effects:** None (pure).
- **Errors:** None.

### `linkedFileKey`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/linked-files.ts`
- **Signature:** `linkedFileKey(link: CanvasLink): string`
- **Used by:** `collectLinkedFiles()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Dedupe key of a linked file: file id, media id or URL.
- **Input:** `link`.
- **Output:** Key string.
- **Effects:** None (pure).
- **Errors:** None.

### `moduleItemLinks`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/linked-files.ts`
- **Signature:** `moduleItemLinks(item: CanvasModuleItem, baseUrl: string): CanvasLink[]`
- **Used by:** `originLinks()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Links of a module item: `File` items as files and `ExternalUrl` items of video providers as videos.
- **Input:** `item`: module item; `baseUrl`.
- **Output:** List of `CanvasLink` (empty for other items).
- **Effects:** None (pure).
- **Errors:** None.

### `originLinks`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/linked-files.ts`
- **Signature:** `originLinks(sources: readonly LinkSource[], modules: readonly CanvasModule[], baseUrl: string): OriginLinks[]`
- **Used by:** `listLinkedFiles()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Links of every origin: assignments, pages, forums and announcements (HTML) and module items.
- **Input:** `sources`; `modules`; `baseUrl`.
- **Output:** List of `{ origin, links }`.
- **Effects:** None (pure).
- **Errors:** None.

### `collectLinkedFiles`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/linked-files.ts`
- **Signature:** `collectLinkedFiles(groups: readonly OriginLinks[]): LinkedFile[]`
- **Used by:** `listLinkedFiles()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Merges the file/video links of every origin into one entry per file (or video) with all the places it appears.
- **Input:** `groups`: links per origin.
- **Output:** List of `LinkedFile`, in order of first sighting.
- **Effects:** None (pure).
- **Errors:** None.

### `toLinkedFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/linked-files.ts`
- **Signature:** `toLinkedFile(link: CanvasLink, origin: LinkOrigin): LinkedFile`
- **Used by:** `collectLinkedFiles()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** First sighting of a file/video link as a `LinkedFile`.
- **Input:** `link`; `origin`.
- **Output:** `LinkedFile` with `found_in: [origin]`.
- **Effects:** None (pure).
- **Errors:** None.

### `fetchLinkSources`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/linked-files.ts`
- **Signature:** `async fetchLinkSources(client: CanvasClient, courseId: Id): Promise<LinkSource[]>`
- **Used by:** `listLinkedFiles()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Fetches the course content with HTML: assignments, pages with `include[]=body`, forums and announcements.
- **Input:** `client`; `courseId`.
- **Output:** Promise with the `LinkSource` list.
- **Effects:** Network: four Canvas listings in parallel.
- **Errors:** None: a listing that fails counts as empty (`getAllOrEmpty()`).

### `linkSource`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/linked-files.ts`
- **Signature:** `linkSource(kind: LinkOrigin['kind'], [id, title, html]: readonly [Id | undefined, string | undefined, string | null | undefined]): LinkSource`
- **Used by:** `fetchLinkSources()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds a `LinkSource` from its kind and `[id, title, html]`.
- **Input:** `kind`; tuple `[id, title, html]`.
- **Output:** `LinkSource` (blank id/title when missing).
- **Effects:** None (pure).
- **Errors:** None.

### `listLinkedFiles`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/linked-files.ts`
- **Signature:** `async listLinkedFiles(client: CanvasClient, courseId: Id): Promise<LinkedFile[]>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `listFilesWithLinked()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** `list_linked_files`: every file and video the course content points to, deduplicated by file id.
- **Input:** `client`; `courseId`.
- **Output:** Promise with the `LinkedFile` list.
- **Effects:** Network: the `fetchLinkSources()` listings and the modules.
- **Errors:** None: failing listings count as empty.

### `linkedOnlyRows`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/linked-files.ts`
- **Signature:** `linkedOnlyRows(listed: readonly View[], linked: readonly LinkedFile[]): View[]`
- **Used by:** `listFilesWithLinked()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Linked files missing from a `list_files` listing, as rows marked `linked_only: true`.
- **Input:** `listed`: listing rows; `linked`: linked files.
- **Output:** Extra rows with `id`, `name`, `type`, `url`, `linked_only` and `found_in`.
- **Effects:** None (pure).
- **Errors:** None.

### `linkedOnlyNote`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/linked-files.ts`
- **Signature:** `linkedOnlyNote(count: number): string`
- **Used by:** `listFilesWithLinked()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Note of `list_files` with `include_linked`: how many linked files the listing was missing.
- **Input:** `count`.
- **Output:** Note text.
- **Effects:** None (pure).
- **Errors:** None.

### `listFilesWithLinked`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/linked-files.ts`
- **Signature:** `async listFilesWithLinked(client: CanvasClient, courseId: Id, listed: readonly View[]): Promise<RawToolResult>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** `list_files` with `include_linked`: the listing plus the linked files it misses, and a note saying how many.
- **Input:** `client`; `courseId`; `listed`: rows already listed.
- **Output:** Promise with a `RawToolResult` (JSON rows and the note as a second text block).
- **Effects:** Network: as `listLinkedFiles()`.
- **Errors:** None: failing listings count as empty.

## `connectors/canvas-puc/src/links.ts`

### `hostMatches`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/links.ts`
- **Signature:** `hostMatches(host: string, domain: string): boolean`
- **Used by:** `videoProviderOf()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Says whether a host is a domain or one of its subdomains.
- **Input:** `host`; `domain`.
- **Output:** `true` on match (`evilyoutube.com` does not match `youtube.com`).
- **Effects:** None (pure).
- **Errors:** None.

### `isCanvasUrl`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/links.ts`
- **Signature:** `isCanvasUrl(url: URL, baseUrl: string): boolean`
- **Used by:** `canvasRefTarget()`, `classifyCanvasRef()`, `fileRefFromUrl()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Says whether a URL is on the connector's Canvas host.
- **Input:** `url`: parsed URL; `baseUrl`: Canvas base URL.
- **Output:** `true` when the hosts are equal.
- **Effects:** None (pure).
- **Errors:** Throws only if `baseUrl` is not a valid URL (it is server configuration).

### `videoProviderOf`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/links.ts`
- **Signature:** `videoProviderOf(url: URL, tag: string): string | null`
- **Used by:** `classifyCanvasRef()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Finds the video provider of a URL in `VIDEO_PROVIDERS`; embed-only providers (Drive, SharePoint) count only inside a player tag.
- **Input:** `url`; `tag`: tag the link came from.
- **Output:** Provider name (`youtube`, `vimeo`...) or `null`.
- **Effects:** None (pure).
- **Errors:** None.

### `canvasTargetOf`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/links.ts`
- **Signature:** `canvasTargetOf(pathname: string): CanvasTarget | null`
- **Used by:** `canvasRefTarget()`, `fileRefFromUrl()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Reads what a Canvas path points to (file, video, page, assignment, discussion, quiz, module) with its ids, from `CANVAS_PATH_PATTERNS`.
- **Input:** `pathname`: URL path.
- **Output:** `CanvasTarget`, or `null` for other Canvas paths.
- **Effects:** None (pure).
- **Errors:** None.

### `canvasRefTarget`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/links.ts`
- **Signature:** `canvasRefTarget(ref: HtmlRef, baseUrl: string): CanvasTarget`
- **Used by:** `classifyCanvasRef()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Target of a Canvas reference, preferring the `data-api-endpoint` the editor adds (same host only); a file in `img` is an image and in a player tag a video.
- **Input:** `ref`: parsed reference; `baseUrl`.
- **Output:** `CanvasTarget` (`{ type: "canvas" }` for unknown paths).
- **Effects:** None (pure).
- **Errors:** None.

### `classifyCanvasRef`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/links.ts`
- **Signature:** `classifyCanvasRef(ref: HtmlRef, baseUrl: string): CanvasLink`
- **Used by:** `canvasHtml()`, `moduleItemLinks()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Classifies one reference as a Canvas target, a provider video, an image or an external link; adds `media_id` from `data-media-id`.
- **Input:** `ref`; `baseUrl`.
- **Output:** `CanvasLink` with `followable` true only for Canvas and video providers.
- **Effects:** None (pure).
- **Errors:** None.

### `canvasHtml`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/links.ts`
- **Signature:** `canvasHtml(html: string | null | undefined, baseUrl: string): CanvasHtml`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`, `flattenDiscussion()`, `originLinks()`, `toAnnouncement()`, `toAssignmentDetail()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converts Canvas HTML into text with `title [link N]` marks and its classified links.
- **Input:** `html`: Canvas HTML, `null` or `undefined`; `baseUrl`.
- **Output:** `{ text, links }`.
- **Effects:** None (pure).
- **Errors:** None.

### `redactVerifier`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/links.ts`
- **Signature:** `redactVerifier(text: string): string`
- **Used by:** `fetchFileBytes()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Hides every `verifier` query value in a text, so errors and logs never carry it.
- **Input:** `text`.
- **Output:** The text with `verifier=[hidden]`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/upload.ts`

### `decodeUploadContent`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/upload.ts`
- **Signature:** `decodeUploadContent(content: string, encoding: UploadEncoding): Uint8Array`
- **Used by:** `uploadedFileFromArgs()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Turns the tool's `content` into bytes.
- **Input:** `content`: the text or base64 string; `encoding`: `text` (UTF-8) or `base64` (whitespace ignored).
- **Output:** The bytes as a `Uint8Array`.
- **Effects:** None (pure).
- **Errors:** Throws when `encoding` is `base64` and the content is not valid base64.

### `fileExtension`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/upload.ts`
- **Signature:** `fileExtension(name: string): string`
- **Used by:** `extensionRefusal()`, `uploadContentType()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Extracts the lowercase extension of a file name.
- **Input:** `name`: the file name.
- **Output:** The extension without the dot, or `''` when there is none (a name that only starts with a dot has none).
- **Effects:** None (pure).
- **Errors:** None.

### `uploadContentType`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/upload.ts`
- **Signature:** `uploadContentType(name: string): string`
- **Used by:** `prepareAttachmentUpload()`, `uploadedFileFromArgs()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Guesses the MIME type of a file name by its extension.
- **Input:** `name`: the file name.
- **Output:** The MIME type (`text/plain`, `application/pdf`...), or `application/octet-stream` when unknown.
- **Effects:** None (pure).
- **Errors:** None.

### `extensionRefusal`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/upload.ts`
- **Signature:** `extensionRefusal(allowed: readonly string[] | undefined, name: string): string | null`
- **Used by:** `uploadRefusal()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Checks the file extension against the assignment's `allowed_extensions`.
- **Input:** `allowed`: the assignment's list (empty or missing = any); `name`: the file name.
- **Output:** The refusal message naming the accepted extensions, or `null` when accepted (case-insensitive).
- **Effects:** None (pure).
- **Errors:** None.

### `uploadSizeRefusal`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/upload.ts`
- **Signature:** `uploadSizeRefusal(size: number): string | null`
- **Used by:** `attachmentsRefusal()`, `uploadRefusal()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Checks the size of a file to upload.
- **Input:** `size`: the size in bytes.
- **Output:** `The file is empty.`, `The file is N MB, above the 5 MB limit; upload it in Canvas itself.`, or `null`.
- **Effects:** None (pure).
- **Errors:** None.

### `uploadRefusal`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/upload.ts`
- **Signature:** `uploadRefusal(assignment: CanvasAssignment, name: string, size: number): string | null`
- **Used by:** `submitFileAssignment()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Decides whether a file can be submitted to the assignment (submission type, extension, size).
- **Input:** `assignment`: the Canvas assignment; `name`: the file name; `size`: the size in bytes.
- **Output:** The first refusal message (no `online_upload`, then `extensionRefusal()`, then `uploadSizeRefusal()`), or `null`.
- **Effects:** None (pure).
- **Errors:** None.

### `onlineUploadPayload`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/upload.ts`
- **Signature:** `onlineUploadPayload(fileIds: readonly Id[]): OnlineUploadBody`
- **Used by:** `submitFileAssignment()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the `online_upload` submission body.
- **Input:** `fileIds`: IDs of the files already uploaded.
- **Output:** `{ submission: { submission_type: 'online_upload', file_ids } }`.
- **Effects:** None (pure).
- **Errors:** None.

### `uploadedFileFromArgs`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/upload.ts`
- **Signature:** `uploadedFileFromArgs(args: FileSubmissionArgs): UploadedBytes`
- **Used by:** `connectors/canvas-puc/src/tools-write.ts (module)`, `prepareAttachments()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the file to upload from the `submit_file_assignment` arguments.
- **Input:** `args`: `file_name` (trimmed), `content`, `encoding` and optional `content_type`.
- **Output:** An `UploadedBytes` with the decoded bytes and the given or guessed MIME type.
- **Effects:** None (pure).
- **Errors:** Propagates the base64 error of `decodeUploadContent()`.

### `submitFileAssignment`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/upload.ts`
- **Signature:** `async submitFileAssignment(client: CanvasClient, base: string, file: UploadedBytes): Promise<FileSubmissionResult>`
- **Used by:** `connectors/canvas-puc/src/tools-write.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Submits a file to an assignment through Canvas's three-step upload, after checking the assignment.
- **Input:** `client`: the Canvas client; `base`: `/courses/:c/assignments/:a`; `file`: the file to upload.
- **Output:** `{ ok, submitted_at, attempt, file: { id, name, size } }`.
- **Effects:** Network: `GET` the assignment, the three-step upload to `.../submissions/self/files` (`uploadCanvasFile()`) and `POST .../submissions` — a real submission the teacher sees.
- **Errors:** Throws the `uploadRefusal()` message before uploading anything; propagates `CanvasApiError` and upload errors.

### `uploadCanvasFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/upload.ts`
- **Signature:** `async uploadCanvasFile(client: CanvasClient, request: CanvasUploadRequest): Promise<CanvasAttachment>`
- **Used by:** `submitFileAssignment()`, `uploadMessageAttachment()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Runs Canvas's three-step upload: asks `path` for a slot, sends the file there and returns the confirmed file.
- **Input:** `client`: the Canvas client; `request`: step-1 `path`, the `file` and optional `extra` step-1 fields (e.g. target folder).
- **Output:** The uploaded `CanvasAttachment` (id, name, size).
- **Effects:** Network: `POST <path>` (slot) and the upload to the slot (`client.upload`).
- **Errors:** Propagates `CanvasApiError` and upload errors.

## `src/core/redact.ts`

### `redactSecrets`

<!-- generated:start -->

- **File:** `src/core/redact.ts`
- **Signature:** `redactSecrets(text: string): string`
- **Used by:** `errorResult()`, `handleUpstreamCallback()`, `loginPageFor()`, `messagePage()`, `redactForLog()`
- **Processes:** P03, P08, P09, P10, P11, P12, P13, P14, P16, P19

<!-- generated:end -->

- **Does:** Replaces tokens and credentials in a text: Bearer headers, Canvas tokens (`n~...`), Google tokens (`ya29.`, `1//0`), JWTs, `access_token`/`refresh_token`/`client_secret`/`id_token` fields and long base64url seals.
- **Input:** `text`.
- **Output:** Redacted text.
- **Effects:** None.
- **Errors:** None.

### `redactForLog`

<!-- generated:start -->

- **File:** `src/core/redact.ts`
- **Signature:** `redactForLog(text: string): string`
- **Used by:** `logWarning()`
- **Processes:** P08, P09, P14, P16

<!-- generated:end -->

- **Does:** Redacts secrets and also masks email addresses, for text that goes to the logs.
- **Input:** `text`.
- **Output:** Redacted text.
- **Effects:** None.
- **Errors:** None.

### `errorMessage`

<!-- generated:start -->

- **File:** `src/core/redact.ts`
- **Signature:** `errorMessage(error: unknown): string`
- **Used by:** `attachmentUploadError()`, `conversationFolderId()`, `errorResult()`, `fetchAttachmentFile()`, `handleAuthorizeSubmit()`, `handleUpstreamCallback()`, `logWarning()`, `sweepPeerReviews()`
- **Processes:** P03, P08, P09, P10, P12, P13, P14, P16, P19

<!-- generated:end -->

- **Does:** Message of an unknown error: the `Error` message or the value as text.
- **Input:** `error`: any value.
- **Output:** Text.
- **Effects:** None.
- **Errors:** None.

### `logWarning`

<!-- generated:start -->

- **File:** `src/core/redact.ts`
- **Signature:** `logWarning(context: string, error: unknown): void`
- **Used by:** `logSnapshotFailure()`, `renewSecretQuietly()`, `serveNodeRequest()`, `streamToolQuietly()`
- **Processes:** P08, P09, P14, P16

<!-- generated:end -->

- **Does:** Writes a warning with the redacted error message (never the raw object or stack).
- **Input:** `context`: prefix; `error`: any value.
- **Output:** Nothing.
- **Effects:** `console.warn`.
- **Errors:** None.

## `connectors/canvas-puc/src/message-attachments.ts`

### `attachmentsRefusal`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/message-attachments.ts`
- **Signature:** `attachmentsRefusal(files: readonly UploadedBytes[]): string | null`
- **Used by:** `prepareAttachments()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Says why the files cannot be attached: the first empty or oversized one, by name.
- **Input:** `files`: the decoded attachments.
- **Output:** `Attachment "<name>": <uploadSizeRefusal()> Nothing was sent.`, or `null` when all can go.
- **Effects:** None (pure).
- **Errors:** None.

### `prepareAttachments`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/message-attachments.ts`
- **Signature:** `prepareAttachments(list: readonly FileSubmissionArgs[] | undefined): UploadedBytes[]`
- **Used by:** `collectMessageAttachments()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Decodes and checks the attachments of a tool call before any upload.
- **Input:** `list`: the `attachments` argument (`FileSubmissionArgs[]`), or `undefined`.
- **Output:** The files to upload (`UploadedBytes[]`; empty without attachments).
- **Effects:** None (pure).
- **Errors:** Throws the `attachmentsRefusal()` message, or the `decodeUploadContent()` error on invalid base64.

### `attachmentUploadError`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/message-attachments.ts`
- **Signature:** `attachmentUploadError(name: string, error: unknown): Error`
- **Used by:** `uploadMessageAttachment()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the error of a failed attachment upload: which file, why, and that the message was not sent.
- **Input:** `name`: file name; `error`: the upload failure.
- **Output:** `Error` `Could not upload attachment "<name>" (<message>). Nothing was sent.`
- **Effects:** None (pure).
- **Errors:** None.

### `uploadMessageAttachment`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/message-attachments.ts`
- **Signature:** `async uploadMessageAttachment(client: CanvasClient, file: UploadedBytes): Promise<CanvasAttachment>`
- **Used by:** `uploadMessageAttachments()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Uploads one attachment to the user's conversation attachments folder (steps 1–3).
- **Input:** `client`: the Canvas client; `file`: the decoded attachment.
- **Output:** The uploaded `CanvasAttachment`.
- **Effects:** Network: `POST /users/self/files` (folder `conversation attachments`, rename on duplicate) and the upload.
- **Errors:** Throws `attachmentUploadError()` on any failure.

### `uploadMessageAttachments`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/message-attachments.ts`
- **Signature:** `async uploadMessageAttachments(client: CanvasClient, files: readonly UploadedBytes[]): Promise<CanvasAttachment[]>`
- **Used by:** `collectMessageAttachments()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Uploads the attachments one by one, in order, stopping at the first failure.
- **Input:** `client`: the Canvas client; `files`: the decoded attachments.
- **Output:** The uploaded files, in order.
- **Effects:** Network: like `uploadMessageAttachment()` per file.
- **Errors:** Propagates the `attachmentUploadError()` of the first failure (later files are not uploaded).

### `attachmentIds`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/message-attachments.ts`
- **Signature:** `attachmentIds(uploaded: readonly CanvasAttachment[]): Id[]`
- **Used by:** `replyInboxMessage()`, `sendInboxMessage()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Takes the IDs of the uploaded files, for the message's `attachment_ids`.
- **Input:** `uploaded`: the uploaded files.
- **Output:** Their IDs, without missing ones.
- **Effects:** None (pure).
- **Errors:** None.

### `attachmentSummary`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/message-attachments.ts`
- **Signature:** `attachmentSummary(uploaded: readonly CanvasAttachment[]): readonly unknown[]`
- **Used by:** `replyInboxMessage()`, `sendInboxMessage()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the short view of the attached files returned to Claude.
- **Input:** `uploaded`: the uploaded files.
- **Output:** `{ id, name, size }` per file.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/tools-inbox.ts`

### `sendInboxMessage`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/tools-inbox.ts`
- **Signature:** `async sendInboxMessage(client: CanvasClient, args: SendMessageArgs): Promise<View>`
- **Used by:** `connectors/canvas-puc/src/tools-inbox.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Sends a new inbox message: checks and uploads the attachments first, then creates the conversation.
- **Input:** `client`: the Canvas client; `args`: `recipient_ids`, `subject`, `body`, optional `course_id` and `attachments`.
- **Output:** `sentConversation()` view plus `attachments` (`attachmentSummary()`).
- **Effects:** Network: the attachment uploads, then `POST /conversations` — a real message the recipients see.
- **Errors:** Throws before anything is uploaded when an attachment is refused; propagates upload errors (nothing sent) and `CanvasApiError`.

### `replyInboxMessage`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/tools-inbox.ts`
- **Signature:** `async replyInboxMessage(client: CanvasClient, args: ReplyMessageArgs): Promise<View>`
- **Used by:** `connectors/canvas-puc/src/tools-inbox.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Replies in a conversation: checks and uploads the attachments first, then adds the message.
- **Input:** `client`: the Canvas client; `args`: `conversation_id`, `body` and optional `attachments`.
- **Output:** `sentReply()` view plus `attachments` (`attachmentSummary()`).
- **Effects:** Network: the attachment uploads, then `POST /conversations/:id/add_message` — a real message all participants see.
- **Errors:** Throws before anything is uploaded when an attachment is refused; propagates upload errors (nothing sent) and `CanvasApiError`.

## `connectors/canvas-puc/src/write-access.ts`

### `tokenFingerprint`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/write-access.ts`
- **Signature:** `tokenFingerprint(token: string): string`
- **Used by:** `hasStoredWriteOptIn()`, `writeAccessUrl()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Computes the SHA-256 of the Canvas token in hex: identifies the connection without storing the token.
- **Input:** `token`: the Canvas token.
- **Output:** 64-character hex digest.
- **Effects:** None (pure).
- **Errors:** None.

### `writeAccessKey`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/write-access.ts`
- **Signature:** `writeAccessKey(fingerprint: string): string`
- **Used by:** `hasStoredWriteOptIn()`, `showWriteAccess()`, `submitWriteAccess()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the store key of a token's write opt-in.
- **Input:** `fingerprint`: the token fingerprint.
- **Output:** `write:<fingerprint>`.
- **Effects:** None (pure).
- **Errors:** None.

### `hasStoredWriteOptIn`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/write-access.ts`
- **Signature:** `async hasStoredWriteOptIn(store: WriteAccessStore, token: string): Promise<boolean>`
- **Used by:** `userAllowsWrite()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Says whether this token's user turned writing on through the write-access page.
- **Input:** `store`: the opt-in store; `token`: the Canvas token.
- **Output:** `true` when the key `write:<fingerprint>` holds `on`.
- **Effects:** KV read.
- **Errors:** None (a store failure counts as off).

### `writeAccessUrl`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/write-access.ts`
- **Signature:** `writeAccessUrl(deps: WriteAccessDeps, token: string): string`
- **Used by:** `canvasWriteBlock()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the link to the write-access page, carrying a sealed ticket with the token's fingerprint (never the token).
- **Input:** `deps`: OAuth settings (issuer, seal key) and clock; `token`: the Canvas token.
- **Output:** `<issuer>/write-access?t=<sealed ticket>`, valid for `WRITE_TICKET_TTL_SECONDS`.
- **Effects:** None (pure apart from the clock and the seal's random IV).
- **Errors:** None.

### `openWriteTicket`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/write-access.ts`
- **Signature:** `openWriteTicket(deps: WriteAccessDeps, ticket: string): string | null`
- **Used by:** `showWriteAccess()`, `submitWriteAccess()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Opens the ticket of the write-access page.
- **Input:** `deps`: OAuth settings and clock; `ticket`: the sealed `t` value.
- **Output:** The token fingerprint, or `null` when the ticket is invalid, expired or for another server.
- **Effects:** None (pure).
- **Errors:** None.

### `renderWriteAccessPage`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/write-access.ts`
- **Signature:** `renderWriteAccessPage(ticket: string, enabled: boolean): string`
- **Used by:** `showWriteAccess()`, `submitWriteAccess()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Renders the HTML of the write-access page: the current state and one button to change it (no script).
- **Input:** `ticket`: the sealed ticket (kept in a hidden field); `enabled`: whether writing is on.
- **Output:** HTML page with a POST form to `/write-access` (`Allow writing` or `Turn writing off`).
- **Effects:** None (pure).
- **Errors:** None.

### `expiredWriteAccessPage`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/write-access.ts`
- **Signature:** `expiredWriteAccessPage(): Response`
- **Used by:** `showWriteAccess()`, `submitWriteAccess()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** Builds the page shown when the write-access link expired or was tampered with.
- **Input:** None.
- **Output:** 400 HTML response asking the user to ask Claude again for a new link.
- **Effects:** None (pure).
- **Errors:** None.

### `showWriteAccess`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/write-access.ts`
- **Signature:** `async showWriteAccess(deps: WriteAccessDeps, request: Request): Promise<Response>`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** `GET /write-access`: shows the writing state of the connection behind the ticket.
- **Input:** `deps`: write-access dependencies; `request`: the request with `?t=<ticket>`.
- **Output:** 200 page from `renderWriteAccessPage()`, or `expiredWriteAccessPage()` for a bad ticket.
- **Effects:** KV read.
- **Errors:** Propagates store errors.

### `submitWriteAccess`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/write-access.ts`
- **Signature:** `async submitWriteAccess(deps: WriteAccessDeps, request: Request): Promise<Response>`
- **Used by:** `canvasRemoteConnector()`
- **Processes:** P03, P08, P09

<!-- generated:end -->

- **Does:** `POST /write-access`: stores (or removes) the write opt-in of the connection behind the ticket.
- **Input:** `deps`: write-access dependencies; `request`: form with `t` (ticket) and `action` (`on`/`off`).
- **Output:** 200 page with the new state, or `expiredWriteAccessPage()` for a bad ticket.
- **Effects:** KV write: `put write:<fingerprint> = on` or `delete`.
- **Errors:** Propagates store errors.

### `memoryWriteAccessStore`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/write-access.ts`
- **Signature:** `memoryWriteAccessStore(): WriteAccessStore`
- **Used by:** `startCanvasRemoteServer()`, `writeAccessStoreFrom()`
- **Processes:** P08, P09

<!-- generated:end -->

- **Does:** Creates a write opt-in store kept in memory (local Node server and tests).
- **Input:** None.
- **Output:** `WriteAccessStore` over a `Map`.
- **Effects:** None (in-memory state only).
- **Errors:** None.

## `src/mcp/tool-contract.ts`

### `readToolContract`

<!-- generated:start -->

- **File:** `src/mcp/tool-contract.ts`
- **Signature:** `readToolContract(json: unknown): ToolContractEntry[]`
- **Used by:** `readSmokeCheck()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Reads a contract file (`{ "tools": [{ "name", "readOnly" }] }`).
- **Input:** `json`: the parsed `tool-contract.json`.
- **Output:** Contract entries normalized and sorted by name (`toolContractOf()`).
- **Effects:** None (pure).
- **Errors:** Throws `Invalid tool contract...` when it does not have that shape.

### `contractEntryAsListed`

<!-- generated:start -->

- **File:** `src/mcp/tool-contract.ts`
- **Signature:** `contractEntryAsListed(entry: ToolContractEntry): ListedTool`
- **Used by:** `readToolContract()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Turns a contract entry into the `tools/list` shape, so both sides are normalized the same way.
- **Input:** `entry`: `{ name, readOnly }`.
- **Output:** `{ name, annotations: { readOnlyHint } }`.
- **Effects:** None (pure).
- **Errors:** None.

### `toolsFromListResponse`

<!-- generated:start -->

- **File:** `src/mcp/tool-contract.ts`
- **Signature:** `toolsFromListResponse(json: unknown): ListedTool[]`
- **Used by:** `fetchPublishedTools()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Extracts the tools of a JSON-RPC `tools/list` response.
- **Input:** `json`: the parsed response.
- **Output:** `result.tools` as `ListedTool[]`.
- **Effects:** None (pure).
- **Errors:** Throws `tools/list did not return tools: ...` (first 300 characters) when it is an error or has no tool list.

### `toolContractOf`

<!-- generated:start -->

- **File:** `src/mcp/tool-contract.ts`
- **Signature:** `toolContractOf(tools: readonly ListedTool[]): ToolContractEntry[]`
- **Used by:** `fetchPublishedTools()`, `readToolContract()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Turns a `tools/list` answer into contract entries, sorted by name.
- **Input:** `tools`: listed tools.
- **Output:** `{ name, readOnly }[]`, `readOnly` true only when `readOnlyHint` is `true`.
- **Effects:** None (pure).
- **Errors:** None.

### `toolContractDiff`

<!-- generated:start -->

- **File:** `src/mcp/tool-contract.ts`
- **Signature:** `toolContractDiff(expected: readonly ToolContractEntry[], listed: readonly ToolContractEntry[]): string[]`
- **Used by:** `smokeAttempt()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Lists the differences between the expected and the listed tools.
- **Input:** `expected`: the contract; `listed`: what the server lists.
- **Output:** `missing tool: X`, `X: readOnly is A, expected B` and `unexpected tool: X` lines; empty when equal.
- **Effects:** None (pure).
- **Errors:** None.

### `snakeCaseWords`

<!-- generated:start -->

- **File:** `src/mcp/tool-contract.ts`
- **Signature:** `snakeCaseWords(text: string): string[]`
- **Used by:** `unregisteredToolMentions()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Finds the distinct snake_case words of a text (the shape of a tool name, e.g. `send_message`).
- **Input:** `text`: any text.
- **Output:** Distinct words with at least one underscore.
- **Effects:** None (pure).
- **Errors:** None.

### `toolTexts`

<!-- generated:start -->

- **File:** `src/mcp/tool-contract.ts`
- **Signature:** `toolTexts(tool: DescribedTool): string[]`
- **Used by:** `unregisteredToolMentions()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Collects every text the model reads about a tool: its description and its arguments' descriptions.
- **Input:** `tool`: name, description and argument schemas.
- **Output:** The description followed by each argument description (`''` when missing).
- **Effects:** None (pure).
- **Errors:** None.

### `unregisteredToolMentions`

<!-- generated:start -->

- **File:** `src/mcp/tool-contract.ts`
- **Signature:** `unregisteredToolMentions(tools: readonly DescribedTool[], ignore: readonly string[]): string[]`
- **Used by:** —
- **Processes:** P19

<!-- generated:end -->

- **Does:** Finds tool-like words in descriptions that are not registered tools; argument names and the `ignore` list are not tool names.
- **Input:** `tools`: the described tools; `ignore`: API terms that look like tool names (e.g. `online_upload`).
- **Output:** `tool → word` lines; empty when every mention is registered.
- **Effects:** None (pure).
- **Errors:** None.

## `src/mcp/tool-gate.ts`

### `unavailableToolMessage`

<!-- generated:start -->

- **File:** `src/mcp/tool-gate.ts`
- **Signature:** `unavailableToolMessage(name: string, reason: string): string`
- **Used by:** `disabledToolSpec()`
- **Processes:** P03, P08, P09, P13, P14, P19

<!-- generated:end -->

- **Does:** Builds the error text of a call to a switched-off tool: names the tool and how to turn it on.
- **Input:** `name`: tool name; `reason`: why it is off.
- **Output:** `<name> is unavailable on this connection: <reason>`.
- **Effects:** None (pure).
- **Errors:** None.

### `disabledToolSpec`

<!-- generated:start -->

- **File:** `src/mcp/tool-gate.ts`
- **Signature:** `disabledToolSpec(spec: ToolSpec<C>, reason: string): ToolSpec<C>`
- **Used by:** `gateToolSpecs()`
- **Processes:** P03, P08, P09, P13, P14, P19

<!-- generated:end -->

- **Does:** Returns the same tool, still listed, whose every call answers an error result with the reason (it never runs nor calls the service).
- **Input:** `spec`: the tool; `reason`: why it is off (returned as is, so a sealed link stays usable).
- **Output:** `ToolSpec` with `UNAVAILABLE_TOOL_NOTE` and the reason appended to the description and a `run` that returns `isError` with `unavailableToolMessage()`.
- **Effects:** None (pure).
- **Errors:** None.

### `gateToolSpecs`

<!-- generated:start -->

- **File:** `src/mcp/tool-gate.ts`
- **Signature:** `gateToolSpecs(specs: readonly ToolSpec<C>[], reason: string | null): ToolSpec<C>[]`
- **Used by:** `canvasTools()`, `whatsappTools()`
- **Processes:** P03, P08, P09, P13, P14, P19

<!-- generated:end -->

- **Does:** Keeps the tools as they are when `reason` is null; otherwise switches each one off with that reason.
- **Input:** `specs`: the tools; `reason`: why they are off, or `null`.
- **Output:** A copy of `specs`, or each one through `disabledToolSpec()`.
- **Effects:** None (pure).
- **Errors:** None.

### `refuseListOnlyUse`

<!-- generated:start -->

- **File:** `src/mcp/tool-gate.ts`
- **Signature:** `refuseListOnlyUse(): never`
- **Used by:** `listOnlyContext()`
- **Processes:** P03, P08, P09, P10, P13, P19

<!-- generated:end -->

- **Does:** Throws on any use of the list-only context.
- **Input:** None.
- **Output:** Never returns.
- **Effects:** None.
- **Errors:** Always throws `This server only lists its tools; it cannot run them.`

### `listOnlyContext`

<!-- generated:start -->

- **File:** `src/mcp/tool-gate.ts`
- **Signature:** `listOnlyContext(): never`
- **Used by:** `canvasRemoteConnector()`, `createWhatsAppCatalogServer()`, `handleDefaultRequest()`
- **Processes:** P03, P08, P09, P10, P13, P19

<!-- generated:end -->

- **Does:** Builds the context of a server that only lists its tools (public catalog); fits any context type.
- **Input:** None.
- **Output:** A `Proxy` whose every property read calls `refuseListOnlyUse()`.
- **Effects:** None (pure).
- **Errors:** None when created; any property access throws.

## `tools/smoke/cli.ts`

### `sleepMs`

<!-- generated:start -->

- **File:** `tools/smoke/cli.ts`
- **Signature:** `sleepMs(ms: number): Promise<void>`
- **Used by:** `readSmokeCheck()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Waits `ms` milliseconds.
- **Input:** `ms`: milliseconds.
- **Output:** Promise resolved after the wait.
- **Effects:** Timer.
- **Errors:** None.

### `readSmokeCheck`

<!-- generated:start -->

- **File:** `tools/smoke/cli.ts`
- **Signature:** `async readSmokeCheck(name: string): Promise<SmokeCheck>`
- **Used by:** `runSmokeCli()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Reads the connector's `wrangler.toml` and `tool-contract.json` and resolves the published Worker address.
- **Input:** `name`: connector folder under `connectors/`.
- **Output:** `SmokeCheck` with `fetch`, `sleepMs`, the base URL and the expected tools.
- **Effects:** Reads files; network to the Cloudflare API (`fetchWorkersSubdomain()`) unless `SMOKE_URL` is set; reads `SMOKE_URL`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`.
- **Errors:** Throws on a missing file, invalid JSON or contract (`readToolContract()`), or a failed subdomain lookup.

### `runSmokeCli`

<!-- generated:start -->

- **File:** `tools/smoke/cli.ts`
- **Signature:** `async runSmokeCli(): Promise<void>`
- **Used by:** `tools/smoke/cli.ts (module)`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Runs the smoke test of the connector given on the command line and sets the exit code.
- **Input:** None (reads `process.argv[2]`).
- **Output:** Nothing.
- **Effects:** Network (`GET <worker>/tools`, Cloudflare API); writes to stdout/stderr; sets `process.exitCode = 1` and prints the rollback command when the tools differ.
- **Errors:** Rejects with the errors of `readSmokeCheck()`.

## `tools/smoke/smoke.ts`

### `wranglerValue`

<!-- generated:start -->

- **File:** `tools/smoke/smoke.ts`
- **Signature:** `wranglerValue(toml: string, key: string): string | null`
- **Used by:** `workerBaseUrl()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Reads the value of a `key = "value"` line of a `wrangler.toml`.
- **Input:** `toml`: file text; `key`: the key.
- **Output:** The quoted value, or `null`.
- **Effects:** None (pure).
- **Errors:** None.

### `workerBaseUrl`

<!-- generated:start -->

- **File:** `tools/smoke/smoke.ts`
- **Signature:** `workerBaseUrl(toml: string, subdomain: string, override?: string): string`
- **Used by:** `readSmokeCheck()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Says where the Worker answers: `SMOKE_URL`, else `PUBLIC_URL` from the toml, else `<name>.<subdomain>.workers.dev`.
- **Input:** `toml`: `wrangler.toml` text; `subdomain`: the account's `workers.dev` subdomain; `override`: `SMOKE_URL`, optional.
- **Output:** Base URL without trailing slashes.
- **Effects:** None (pure).
- **Errors:** Throws when the toml has no `name` and there is no explicit URL.

### `fetchWorkersSubdomain`

<!-- generated:start -->

- **File:** `tools/smoke/smoke.ts`
- **Signature:** `async fetchWorkersSubdomain(fetchFn: typeof fetch, account: CloudflareAccount): Promise<string>`
- **Used by:** `readSmokeCheck()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Reads the account's `workers.dev` subdomain from the Cloudflare API.
- **Input:** `fetchFn`: `fetch`; `account`: account ID and API token.
- **Output:** The subdomain.
- **Effects:** Network: `GET /client/v4/accounts/:id/workers/subdomain`.
- **Errors:** Throws `Cloudflare did not return the workers.dev subdomain (<status>).` on a failure or empty answer.

### `fetchPublishedTools`

<!-- generated:start -->

- **File:** `tools/smoke/smoke.ts`
- **Signature:** `async fetchPublishedTools(fetchFn: typeof fetch, baseUrl: string): Promise<ToolContractEntry[]>`
- **Used by:** `smokeAttempt()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Reads the published catalog `GET <base>/tools` as contract entries.
- **Input:** `fetchFn`: `fetch`; `baseUrl`: the Worker address.
- **Output:** Contract entries sorted by name.
- **Effects:** Network: `GET <base>/tools`.
- **Errors:** Throws on a non-2xx status or a response without tools (`toolsFromListResponse()`).

### `smokeAttempt`

<!-- generated:start -->

- **File:** `tools/smoke/smoke.ts`
- **Signature:** `async smokeAttempt(check: SmokeCheck): Promise<string[]>`
- **Used by:** `runSmokeCheck()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Runs one smoke attempt: the differences with the contract, or the error as a single problem.
- **Input:** `check`: fetch, sleep, base URL and expected tools.
- **Output:** Problem lines; empty when the tools match.
- **Effects:** Network: like `fetchPublishedTools()`.
- **Errors:** None (errors become a problem line).

### `runSmokeCheck`

<!-- generated:start -->

- **File:** `tools/smoke/smoke.ts`
- **Signature:** `async runSmokeCheck(check: SmokeCheck): Promise<string[]>`
- **Used by:** `runSmokeCli()`
- **Processes:** P19

<!-- generated:end -->

- **Does:** Compares the published tools with the contract, retrying while they differ.
- **Input:** `check`: fetch, sleep, base URL and expected tools.
- **Output:** The last attempt's problems; empty when they match.
- **Effects:** Network per attempt; up to `SMOKE_ATTEMPTS` attempts with `SMOKE_RETRY_MS` pauses.
- **Errors:** None.

## `connectors/canvas-puc/src/attachment-refs.ts`

### `attachmentCountRefusal`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/attachment-refs.ts`
- **Signature:** `attachmentCountRefusal(inline: number, byId: number): string | null`
- **Used by:** `collectMessageAttachments()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Checks the total attachments of one message (inline plus by id) against `MAX_MESSAGE_ATTACHMENTS`.
- **Input:** `inline`: inline file count; `byId`: file id count.
- **Output:** The refusal text, or null when the total fits.
- **Effects:** None (pure).
- **Errors:** None.

### `conversationFolderId`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/attachment-refs.ts`
- **Signature:** `async conversationFolderId(client: CanvasClient): Promise<Id>`
- **Used by:** `resolveFileAttachments()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Resolves the user's `conversation attachments` folder via `CONVERSATION_FOLDER_PATH` and takes the last folder of the path.
- **Input:** `client`: the Canvas client.
- **Output:** The folder id.
- **Effects:** Network: `GET /users/self/folders/by_path/conversation%20attachments`.
- **Errors:** Throws when the folder cannot be resolved (points to `prepare_attachment_upload`) or Canvas returns no folder; nothing is sent.

### `fetchAttachmentFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/attachment-refs.ts`
- **Signature:** `async fetchAttachmentFile(client: CanvasClient, fileId: Id): Promise<CanvasAttachment>`
- **Used by:** `resolveFileAttachments()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Reads one Canvas file the user can access, to validate a `file_ids` entry before anything is copied or sent.
- **Input:** `client`: the Canvas client; `fileId`: the file id.
- **Output:** The Canvas file (with `folder_id`).
- **Effects:** Network: `GET /files/:id`.
- **Errors:** Throws `Canvas file X is not accessible (...). Nothing was sent.`

### `needsConversationCopy`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/attachment-refs.ts`
- **Signature:** `needsConversationCopy(file: CanvasAttachment, folderId: Id): boolean`
- **Used by:** `resolveFileAttachments()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Says whether a file lives outside the conversation attachments folder, so Canvas would not attach it as is.
- **Input:** `file`: the Canvas file; `folderId`: the conversation attachments folder id.
- **Output:** `true` when the file must be copied.
- **Effects:** None (pure).
- **Errors:** None.

### `copyToConversationFolder`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/attachment-refs.ts`
- **Signature:** `copyToConversationFolder(client: CanvasClient, file: CanvasAttachment, folderId: Id): Promise<CanvasAttachment>`
- **Used by:** `resolveFileAttachments()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Copies a file into the conversation attachments folder, renaming on a name clash.
- **Input:** `client`: the Canvas client; `file`: the source file; `folderId`: the destination folder id.
- **Output:** The copy (new id).
- **Effects:** Network: `POST /folders/:id/copy_file` (creates a file in the user's private folder).
- **Errors:** Propagates Canvas errors.

### `resolveFileAttachments`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/attachment-refs.ts`
- **Signature:** `async resolveFileAttachments(client: CanvasClient, fileIds: readonly Id[] | undefined): Promise<CanvasAttachment[]>`
- **Used by:** `collectMessageAttachments()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Turns `file_ids` into attachable files: resolves the folder, reads every file first, then copies those outside the folder.
- **Input:** `client`: the Canvas client; `fileIds`: the ids (may be absent).
- **Output:** The attachable files, in order (empty without ids).
- **Effects:** Network: like `conversationFolderId()`, `fetchAttachmentFile()` and `copyToConversationFolder()`.
- **Errors:** Propagates the first error; no copy happens when a file is not accessible.

### `collectMessageAttachments`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/attachment-refs.ts`
- **Signature:** `async collectMessageAttachments(client: CanvasClient, args: MessageAttachmentArgs): Promise<CanvasAttachment[]>`
- **Used by:** `replyInboxMessage()`, `sendInboxMessage()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Gathers every attachment of a send or reply: count check, inline decode check, file id resolution, then inline uploads.
- **Input:** `client`: the Canvas client; `args`: `attachments` and `file_ids`.
- **Output:** Uploaded inline files followed by the referenced files.
- **Effects:** Network: like `resolveFileAttachments()` and `uploadMessageAttachments()`.
- **Errors:** Throws the `attachmentCountRefusal()` text, a decode or size refusal, or a file/upload error; the message is never sent after an error.

### `shellQuote`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/attachment-refs.ts`
- **Signature:** `shellQuote(value: string): string`
- **Used by:** `curlUploadCommand()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Quotes a value for a POSIX shell with single quotes, escaping inner single quotes.
- **Input:** `value`: the raw text.
- **Output:** The quoted text.
- **Effects:** None (pure).
- **Errors:** None.

### `curlUploadCommand`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/attachment-refs.ts`
- **Signature:** `curlUploadCommand(slot: CanvasUploadSlot): string`
- **Used by:** `prepareAttachmentUpload()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the `curl` that fills a Canvas upload slot from the user's machine: Canvas fields with `--form-string` (no `@` file expansion), the file last at `LOCAL_PATH_PLACEHOLDER`.
- **Input:** `slot`: the step-1 upload slot.
- **Output:** The command text.
- **Effects:** None (pure).
- **Errors:** None.

### `prepareAttachmentUpload`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/attachment-refs.ts`
- **Signature:** `async prepareAttachmentUpload(client: CanvasClient, args: DirectUploadArgs): Promise<Readonly<Record<string, unknown>>>`
- **Used by:** `connectors/canvas-puc/src/tools-inbox.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Asks Canvas for a single-use upload slot in the conversation attachments folder and returns the `curl` that uploads a local file straight to Canvas, plus `DIRECT_UPLOAD_NEXT_STEPS`.
- **Input:** `client`: the Canvas client; `args`: `file_name`, `size` (bytes, up to `MAX_DIRECT_UPLOAD_BYTES`), optional `content_type`.
- **Output:** `{ file_name, curl, next_steps }`.
- **Effects:** Network: `POST /users/self/files` (step 1 only; the bytes never pass through the Worker).
- **Errors:** Propagates Canvas errors.

## `connectors/canvas-puc/src/plan/page/checks.ts`

### `toCheckMap`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `toCheckMap(value: unknown): CheckMap`
- **Used by:** `parseStoredChecks()`, `remoteChecksOf()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped).
- **Input:** `value`: unknown value.
- **Output:** Only its boolean entries (empty for non-objects and arrays).
- **Effects:** None (pure).
- **Errors:** None.

### `parseStoredChecks`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `parseStoredChecks(text: string | null): CheckMap`
- **Used by:** `readLocalChecks()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text.
- **Input:** `text`: stored JSON or `null`.
- **Output:** Ticks map; empty when missing or broken.
- **Effects:** None (pure).
- **Errors:** None (broken JSON gives an empty map).

### `mergeChecks`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `mergeChecks(local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>): CheckMap`
- **Used by:** `adoptAccount()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load.
- **Input:** `local`: browser ticks; `remote`: account ticks; `touched`: ids changed in this page load.
- **Output:** Merged ticks: remote wins except for touched ids.
- **Effects:** None (pure).
- **Errors:** None.

### `hasLocalOnly`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `hasLocalOnly(local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>): boolean`
- **Used by:** `adoptAccount()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent.
- **Input:** `local`, `remote`: ticks; `touched`: ids changed in this page load.
- **Output:** `true` when the browser has ticks the account lacks or newer ones.
- **Effects:** None (pure).
- **Errors:** None.

### `localChecksKey`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `localChecksKey(planKey: string): string`
- **Used by:** `readLocalChecks()`, `writeLocalChecks()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser.
- **Input:** `planKey`: plan key.
- **Output:** `planejamento-faculdade:<planKey>`.
- **Effects:** None (pure).
- **Errors:** None.

### `readLocalChecks`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `readLocalChecks(storage: Storage | null, planKey: string): CheckMap`
- **Used by:** `createCheckStore()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked.
- **Input:** `storage`: browser storage or `null`; `planKey`: plan key.
- **Output:** Ticks saved in this browser; empty when missing or blocked.
- **Effects:** Reads localStorage.
- **Errors:** None (blocked storage gives an empty map).

### `pauseMs`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `pauseMs(ms: number): Promise<void>`
- **Used by:** `createCheckStore()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length.
- **Input:** `ms`: milliseconds.
- **Output:** Promise resolved after the pause.
- **Effects:** Starts a timer.
- **Errors:** None.

### `createCheckStore`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `createCheckStore(options: CheckStoreOptions): CheckStore`
- **Used by:** `bootPlanPage()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser.
- **Input:** `options`: `key`, `storage`, `status` callback, optional `wait`.
- **Output:** New `CheckStore` with this browser's ticks.
- **Effects:** Reads localStorage.
- **Errors:** None.

### `writeLocalChecks`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `writeLocalChecks(store: CheckStore): void`
- **Used by:** `adoptAccount()`, `onCheckChange()`, `onRemoteSnapshot()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working).
- **Input:** `store`: check store.
- **Output:** Nothing.
- **Effects:** Writes the ticks to localStorage.
- **Errors:** None (blocked storage is ignored).

### `applyCheck`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `applyCheck(store: CheckStore, id: string): void`
- **Used by:** `refreshChecks()`, `registerCheck()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan).
- **Input:** `store`: check store; `id`: item id.
- **Output:** Nothing.
- **Effects:** Sets the checkbox and the row's `done` class (saved tick, else the item default).
- **Errors:** None.

### `refreshChecks`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `refreshChecks(store: CheckStore): void`
- **Used by:** `adoptAccount()`, `onCheckChange()`, `onRemoteSnapshot()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan). _/ export function applyCheck(store: CheckStore, id: string): void { const entry = store.boxes.get(id); if (!entry) return; const checked = id in store.saved ? store.saved[id] === true : entry.def; entry.box.checked = checked; entry.row.classList.toggle('done', checked); } /_* Re-applies every tick and tells the listeners (progress counters).
- **Input:** `store`: check store.
- **Output:** Nothing.
- **Effects:** Re-applies every tick and calls the listeners (counters).
- **Errors:** None.

### `onCheckChange`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `onCheckChange(store: CheckStore, id: string, checked: boolean): void`
- **Used by:** `registerCheck()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan). _/ export function applyCheck(store: CheckStore, id: string): void { const entry = store.boxes.get(id); if (!entry) return; const checked = id in store.saved ? store.saved[id] === true : entry.def; entry.box.checked = checked; entry.row.classList.toggle('done', checked); } /_* Re-applies every tick and tells the listeners (progress counters). _/ export function refreshChecks(store: CheckStore): void { for (const id of store.boxes.keys()) applyCheck(store, id); store.listeners.forEach((listener) => { listener(); }); } /_* Records a change made by the viewer and saves it.
- **Input:** `store`: check store; `id`: item id; `checked`: new value.
- **Output:** Nothing.
- **Effects:** Updates the ticks, the page and localStorage, and starts a write to the account.
- **Errors:** None.

### `registerCheck`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `registerCheck(store: CheckStore, item: { id: string; def: boolean }, view: { box: HTMLInputElement; row: HTMLElement }): void`
- **Used by:** `renderChecklistItem()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan). _/ export function applyCheck(store: CheckStore, id: string): void { const entry = store.boxes.get(id); if (!entry) return; const checked = id in store.saved ? store.saved[id] === true : entry.def; entry.box.checked = checked; entry.row.classList.toggle('done', checked); } /_* Re-applies every tick and tells the listeners (progress counters). _/ export function refreshChecks(store: CheckStore): void { for (const id of store.boxes.keys()) applyCheck(store, id); store.listeners.forEach((listener) => { listener(); }); } /_* Records a change made by the viewer and saves it. _/ export function onCheckChange(store: CheckStore, id: string, checked: boolean): void { store.saved[id] = checked; store.touched.add(id); refreshChecks(store); writeLocalChecks(store); store.dirty = true; void flushChecks(store); } /_* Connects a checkbox (and its row) to the store under the item's stable id.
- **Input:** `store`: check store; `item`: `{id, def}`; `view`: `{box, row}`.
- **Output:** Nothing.
- **Effects:** Stores the checkbox, shows its tick and listens for changes.
- **Errors:** None.

### `errorCode`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `errorCode(error: unknown): string | undefined`
- **Used by:** `retryOnUnavailable()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan). _/ export function applyCheck(store: CheckStore, id: string): void { const entry = store.boxes.get(id); if (!entry) return; const checked = id in store.saved ? store.saved[id] === true : entry.def; entry.box.checked = checked; entry.row.classList.toggle('done', checked); } /_* Re-applies every tick and tells the listeners (progress counters). _/ export function refreshChecks(store: CheckStore): void { for (const id of store.boxes.keys()) applyCheck(store, id); store.listeners.forEach((listener) => { listener(); }); } /_* Records a change made by the viewer and saves it. _/ export function onCheckChange(store: CheckStore, id: string, checked: boolean): void { store.saved[id] = checked; store.touched.add(id); refreshChecks(store); writeLocalChecks(store); store.dirty = true; void flushChecks(store); } /_* Connects a checkbox (and its row) to the store under the item's stable id. _/ export function registerCheck( store: CheckStore, item: { id: string; def: boolean }, view: { box: HTMLInputElement; row: HTMLElement }, ): void { const { box, row } = view; store.boxes.set(item.id, { box, row, def: item.def }); applyCheck(store, item.id); box.addEventListener('change', () => { onCheckChange(store, item.id, box.checked); }); } /_* Error code of a runtime rejection, if any.
- **Input:** `error`: rejection value.
- **Output:** Its string `code`, or `undefined`.
- **Effects:** None (pure).
- **Errors:** None.

### `retryOnUnavailable`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `async retryOnUnavailable(call: () => Promise<T>, wait: (ms: number) => Promise<void>): Promise<T>`
- **Used by:** `adoptAccount()`, `writeChecksOnce()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan). _/ export function applyCheck(store: CheckStore, id: string): void { const entry = store.boxes.get(id); if (!entry) return; const checked = id in store.saved ? store.saved[id] === true : entry.def; entry.box.checked = checked; entry.row.classList.toggle('done', checked); } /_* Re-applies every tick and tells the listeners (progress counters). _/ export function refreshChecks(store: CheckStore): void { for (const id of store.boxes.keys()) applyCheck(store, id); store.listeners.forEach((listener) => { listener(); }); } /_* Records a change made by the viewer and saves it. _/ export function onCheckChange(store: CheckStore, id: string, checked: boolean): void { store.saved[id] = checked; store.touched.add(id); refreshChecks(store); writeLocalChecks(store); store.dirty = true; void flushChecks(store); } /_* Connects a checkbox (and its row) to the store under the item's stable id. _/ export function registerCheck( store: CheckStore, item: { id: string; def: boolean }, view: { box: HTMLInputElement; row: HTMLElement }, ): void { const { box, row } = view; store.boxes.set(item.id, { box, row, def: item.def }); applyCheck(store, item.id); box.addEventListener('change', () => { onCheckChange(store, item.id, box.checked); }); } /_* Error code of a runtime rejection, if any. _/ export function errorCode(error: unknown): string | undefined { const code = (error as { code?: unknown } | null)?.code; return typeof code === 'string' ? code : undefined; } /_* Runs a call and, when it fails with `unavailable`, once more after a short random pause.
- **Input:** `call`: async call; `wait`: pause function.
- **Output:** The call's result.
- **Effects:** Runs the call; once more after a random 0.6–1.4 s pause when it fails with `unavailable`.
- **Errors:** Rejects with any other error, or with the second failure.

### `writeChecksOnce`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `async writeChecksOnce(store: CheckStore, remote: DocRefLike): Promise<boolean>`
- **Used by:** `flushChecks()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan). _/ export function applyCheck(store: CheckStore, id: string): void { const entry = store.boxes.get(id); if (!entry) return; const checked = id in store.saved ? store.saved[id] === true : entry.def; entry.box.checked = checked; entry.row.classList.toggle('done', checked); } /_* Re-applies every tick and tells the listeners (progress counters). _/ export function refreshChecks(store: CheckStore): void { for (const id of store.boxes.keys()) applyCheck(store, id); store.listeners.forEach((listener) => { listener(); }); } /_* Records a change made by the viewer and saves it. _/ export function onCheckChange(store: CheckStore, id: string, checked: boolean): void { store.saved[id] = checked; store.touched.add(id); refreshChecks(store); writeLocalChecks(store); store.dirty = true; void flushChecks(store); } /_* Connects a checkbox (and its row) to the store under the item's stable id. _/ export function registerCheck( store: CheckStore, item: { id: string; def: boolean }, view: { box: HTMLInputElement; row: HTMLElement }, ): void { const { box, row } = view; store.boxes.set(item.id, { box, row, def: item.def }); applyCheck(store, item.id); box.addEventListener('change', () => { onCheckChange(store, item.id, box.checked); }); } /_* Error code of a runtime rejection, if any. _/ export function errorCode(error: unknown): string | undefined { const code = (error as { code?: unknown } | null)?.code; return typeof code === 'string' ? code : undefined; } /_* Runs a call and, when it fails with `unavailable`, once more after a short random pause. _/ export async function retryOnUnavailable<T>( call: () => Promise<T>, wait: (ms: number) => Promise<void>, ): Promise<T> { try { return await call(); } catch (error) { if (errorCode(error) !== 'unavailable') throw error; await wait(600 + Math.floor(Math.random() * 800)); return call(); } } /_* One write of the ticks to the account; false (and still pending) when it fails.
- **Input:** `store`: check store; `remote`: account document.
- **Output:** `true` when written; `false` when it failed.
- **Effects:** Writes `{checks, v: 1}` to the account document and reports the sync state.
- **Errors:** None (a failure marks the ticks pending and reports `error`).

### `flushChecks`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `async flushChecks(store: CheckStore): Promise<void>`
- **Used by:** `adoptAccount()`, `onCheckChange()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan). _/ export function applyCheck(store: CheckStore, id: string): void { const entry = store.boxes.get(id); if (!entry) return; const checked = id in store.saved ? store.saved[id] === true : entry.def; entry.box.checked = checked; entry.row.classList.toggle('done', checked); } /_* Re-applies every tick and tells the listeners (progress counters). _/ export function refreshChecks(store: CheckStore): void { for (const id of store.boxes.keys()) applyCheck(store, id); store.listeners.forEach((listener) => { listener(); }); } /_* Records a change made by the viewer and saves it. _/ export function onCheckChange(store: CheckStore, id: string, checked: boolean): void { store.saved[id] = checked; store.touched.add(id); refreshChecks(store); writeLocalChecks(store); store.dirty = true; void flushChecks(store); } /_* Connects a checkbox (and its row) to the store under the item's stable id. _/ export function registerCheck( store: CheckStore, item: { id: string; def: boolean }, view: { box: HTMLInputElement; row: HTMLElement }, ): void { const { box, row } = view; store.boxes.set(item.id, { box, row, def: item.def }); applyCheck(store, item.id); box.addEventListener('change', () => { onCheckChange(store, item.id, box.checked); }); } /_* Error code of a runtime rejection, if any. _/ export function errorCode(error: unknown): string | undefined { const code = (error as { code?: unknown } | null)?.code; return typeof code === 'string' ? code : undefined; } /_* Runs a call and, when it fails with `unavailable`, once more after a short random pause. _/ export async function retryOnUnavailable<T>( call: () => Promise<T>, wait: (ms: number) => Promise<void>, ): Promise<T> { try { return await call(); } catch (error) { if (errorCode(error) !== 'unavailable') throw error; await wait(600 + Math.floor(Math.random() * 800)); return call(); } } /_* One write of the ticks to the account; false (and still pending) when it fails. _/ export async function writeChecksOnce(store: CheckStore, remote: DocRefLike): Promise<boolean> { try { await retryOnUnavailable(() => remote.set({ checks: { ...store.saved }, v: 1 }), store.wait); store.status('account'); return true; } catch { store.dirty = true; store.status('error'); return false; } } /_* Sends the ticks to the account, one write at a time; a failure keeps them pending for the next change.
- **Input:** `store`: check store.
- **Output:** Nothing.
- **Effects:** Writes pending ticks to the account, one write at a time, until none is pending or a write fails.
- **Errors:** None.

### `remoteChecksOf`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `remoteChecksOf(snap: DocSnapLike): CheckMap`
- **Used by:** `adoptAccount()`, `onRemoteSnapshot()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan). _/ export function applyCheck(store: CheckStore, id: string): void { const entry = store.boxes.get(id); if (!entry) return; const checked = id in store.saved ? store.saved[id] === true : entry.def; entry.box.checked = checked; entry.row.classList.toggle('done', checked); } /_* Re-applies every tick and tells the listeners (progress counters). _/ export function refreshChecks(store: CheckStore): void { for (const id of store.boxes.keys()) applyCheck(store, id); store.listeners.forEach((listener) => { listener(); }); } /_* Records a change made by the viewer and saves it. _/ export function onCheckChange(store: CheckStore, id: string, checked: boolean): void { store.saved[id] = checked; store.touched.add(id); refreshChecks(store); writeLocalChecks(store); store.dirty = true; void flushChecks(store); } /_* Connects a checkbox (and its row) to the store under the item's stable id. _/ export function registerCheck( store: CheckStore, item: { id: string; def: boolean }, view: { box: HTMLInputElement; row: HTMLElement }, ): void { const { box, row } = view; store.boxes.set(item.id, { box, row, def: item.def }); applyCheck(store, item.id); box.addEventListener('change', () => { onCheckChange(store, item.id, box.checked); }); } /_* Error code of a runtime rejection, if any. _/ export function errorCode(error: unknown): string | undefined { const code = (error as { code?: unknown } | null)?.code; return typeof code === 'string' ? code : undefined; } /_* Runs a call and, when it fails with `unavailable`, once more after a short random pause. _/ export async function retryOnUnavailable<T>( call: () => Promise<T>, wait: (ms: number) => Promise<void>, ): Promise<T> { try { return await call(); } catch (error) { if (errorCode(error) !== 'unavailable') throw error; await wait(600 + Math.floor(Math.random() * 800)); return call(); } } /_* One write of the ticks to the account; false (and still pending) when it fails. _/ export async function writeChecksOnce(store: CheckStore, remote: DocRefLike): Promise<boolean> { try { await retryOnUnavailable(() => remote.set({ checks: { ...store.saved }, v: 1 }), store.wait); store.status('account'); return true; } catch { store.dirty = true; store.status('error'); return false; } } /_* Sends the ticks to the account, one write at a time; a failure keeps them pending for the next change. _/ export async function flushChecks(store: CheckStore): Promise<void> { const remote = store.remote; if (!remote || store.writing) return; while (store.dirty) { store.writing = true; store.dirty = false; const sent = await writeChecksOnce(store, remote); store.writing = false; if (!sent) return; } } /_* Ticks stored in an account document.
- **Input:** `snap`: account document snapshot.
- **Output:** Its ticks; empty when the document does not exist.
- **Effects:** None (pure).
- **Errors:** None.

### `onRemoteSnapshot`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `onRemoteSnapshot(store: CheckStore, snap: DocSnapLike): void`
- **Used by:** `adoptAccount()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan). _/ export function applyCheck(store: CheckStore, id: string): void { const entry = store.boxes.get(id); if (!entry) return; const checked = id in store.saved ? store.saved[id] === true : entry.def; entry.box.checked = checked; entry.row.classList.toggle('done', checked); } /_* Re-applies every tick and tells the listeners (progress counters). _/ export function refreshChecks(store: CheckStore): void { for (const id of store.boxes.keys()) applyCheck(store, id); store.listeners.forEach((listener) => { listener(); }); } /_* Records a change made by the viewer and saves it. _/ export function onCheckChange(store: CheckStore, id: string, checked: boolean): void { store.saved[id] = checked; store.touched.add(id); refreshChecks(store); writeLocalChecks(store); store.dirty = true; void flushChecks(store); } /_* Connects a checkbox (and its row) to the store under the item's stable id. _/ export function registerCheck( store: CheckStore, item: { id: string; def: boolean }, view: { box: HTMLInputElement; row: HTMLElement }, ): void { const { box, row } = view; store.boxes.set(item.id, { box, row, def: item.def }); applyCheck(store, item.id); box.addEventListener('change', () => { onCheckChange(store, item.id, box.checked); }); } /_* Error code of a runtime rejection, if any. _/ export function errorCode(error: unknown): string | undefined { const code = (error as { code?: unknown } | null)?.code; return typeof code === 'string' ? code : undefined; } /_* Runs a call and, when it fails with `unavailable`, once more after a short random pause. _/ export async function retryOnUnavailable<T>( call: () => Promise<T>, wait: (ms: number) => Promise<void>, ): Promise<T> { try { return await call(); } catch (error) { if (errorCode(error) !== 'unavailable') throw error; await wait(600 + Math.floor(Math.random() * 800)); return call(); } } /_* One write of the ticks to the account; false (and still pending) when it fails. _/ export async function writeChecksOnce(store: CheckStore, remote: DocRefLike): Promise<boolean> { try { await retryOnUnavailable(() => remote.set({ checks: { ...store.saved }, v: 1 }), store.wait); store.status('account'); return true; } catch { store.dirty = true; store.status('error'); return false; } } /_* Sends the ticks to the account, one write at a time; a failure keeps them pending for the next change. _/ export async function flushChecks(store: CheckStore): Promise<void> { const remote = store.remote; if (!remote || store.writing) return; while (store.dirty) { store.writing = true; store.dirty = false; const sent = await writeChecksOnce(store, remote); store.writing = false; if (!sent) return; } } /_* Ticks stored in an account document. _/ export function remoteChecksOf(snap: DocSnapLike): CheckMap { return snap.exists ? toCheckMap(snap.data()?.checks) : {}; } /_* Applies ticks changed on another device (ignores this page's own pending writes).
- **Input:** `store`: check store; `snap`: snapshot.
- **Output:** Nothing.
- **Effects:** Applies ticks changed on another device (ignored while writing or for own pending writes) and saves them locally.
- **Errors:** None.

### `accountDocument`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `async accountDocument(claude: ClaudeLike, planKey: string): Promise<DocRefLike | null>`
- **Used by:** `connectAccount()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan). _/ export function applyCheck(store: CheckStore, id: string): void { const entry = store.boxes.get(id); if (!entry) return; const checked = id in store.saved ? store.saved[id] === true : entry.def; entry.box.checked = checked; entry.row.classList.toggle('done', checked); } /_* Re-applies every tick and tells the listeners (progress counters). _/ export function refreshChecks(store: CheckStore): void { for (const id of store.boxes.keys()) applyCheck(store, id); store.listeners.forEach((listener) => { listener(); }); } /_* Records a change made by the viewer and saves it. _/ export function onCheckChange(store: CheckStore, id: string, checked: boolean): void { store.saved[id] = checked; store.touched.add(id); refreshChecks(store); writeLocalChecks(store); store.dirty = true; void flushChecks(store); } /_* Connects a checkbox (and its row) to the store under the item's stable id. _/ export function registerCheck( store: CheckStore, item: { id: string; def: boolean }, view: { box: HTMLInputElement; row: HTMLElement }, ): void { const { box, row } = view; store.boxes.set(item.id, { box, row, def: item.def }); applyCheck(store, item.id); box.addEventListener('change', () => { onCheckChange(store, item.id, box.checked); }); } /_* Error code of a runtime rejection, if any. _/ export function errorCode(error: unknown): string | undefined { const code = (error as { code?: unknown } | null)?.code; return typeof code === 'string' ? code : undefined; } /_* Runs a call and, when it fails with `unavailable`, once more after a short random pause. _/ export async function retryOnUnavailable<T>( call: () => Promise<T>, wait: (ms: number) => Promise<void>, ): Promise<T> { try { return await call(); } catch (error) { if (errorCode(error) !== 'unavailable') throw error; await wait(600 + Math.floor(Math.random() * 800)); return call(); } } /_* One write of the ticks to the account; false (and still pending) when it fails. _/ export async function writeChecksOnce(store: CheckStore, remote: DocRefLike): Promise<boolean> { try { await retryOnUnavailable(() => remote.set({ checks: { ...store.saved }, v: 1 }), store.wait); store.status('account'); return true; } catch { store.dirty = true; store.status('error'); return false; } } /_* Sends the ticks to the account, one write at a time; a failure keeps them pending for the next change. _/ export async function flushChecks(store: CheckStore): Promise<void> { const remote = store.remote; if (!remote || store.writing) return; while (store.dirty) { store.writing = true; store.dirty = false; const sent = await writeChecksOnce(store, remote); store.writing = false; if (!sent) return; } } /_* Ticks stored in an account document. _/ export function remoteChecksOf(snap: DocSnapLike): CheckMap { return snap.exists ? toCheckMap(snap.data()?.checks) : {}; } /_* Applies ticks changed on another device (ignores this page's own pending writes). _/ export function onRemoteSnapshot(store: CheckStore, snap: DocSnapLike): void { if (store.writing || snap.metadata?.hasPendingWrites === true) return; const remote = remoteChecksOf(snap); const changed = Object.keys(remote).filter((id) => store.saved[id] !== remote[id]); if (changed.length === 0) return; for (const id of changed) store.saved[id] = remote[id] === true; refreshChecks(store); writeLocalChecks(store); } /_* The viewer's private document for this plan, or null when there is no database or no signed-in viewer.
- **Input:** `claude`: page runtime; `planKey`: plan key.
- **Output:** The viewer's private document `data/users/<uid>/<planKey>`, or `null` without db or sign-in.
- **Effects:** Calls `claude.use('db')`, `claude.use('user')` and `user.id()`.
- **Errors:** Runtime rejections propagate.

### `adoptAccount`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `async adoptAccount(store: CheckStore, ref: DocRefLike): Promise<void>`
- **Used by:** `connectAccount()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan). _/ export function applyCheck(store: CheckStore, id: string): void { const entry = store.boxes.get(id); if (!entry) return; const checked = id in store.saved ? store.saved[id] === true : entry.def; entry.box.checked = checked; entry.row.classList.toggle('done', checked); } /_* Re-applies every tick and tells the listeners (progress counters). _/ export function refreshChecks(store: CheckStore): void { for (const id of store.boxes.keys()) applyCheck(store, id); store.listeners.forEach((listener) => { listener(); }); } /_* Records a change made by the viewer and saves it. _/ export function onCheckChange(store: CheckStore, id: string, checked: boolean): void { store.saved[id] = checked; store.touched.add(id); refreshChecks(store); writeLocalChecks(store); store.dirty = true; void flushChecks(store); } /_* Connects a checkbox (and its row) to the store under the item's stable id. _/ export function registerCheck( store: CheckStore, item: { id: string; def: boolean }, view: { box: HTMLInputElement; row: HTMLElement }, ): void { const { box, row } = view; store.boxes.set(item.id, { box, row, def: item.def }); applyCheck(store, item.id); box.addEventListener('change', () => { onCheckChange(store, item.id, box.checked); }); } /_* Error code of a runtime rejection, if any. _/ export function errorCode(error: unknown): string | undefined { const code = (error as { code?: unknown } | null)?.code; return typeof code === 'string' ? code : undefined; } /_* Runs a call and, when it fails with `unavailable`, once more after a short random pause. _/ export async function retryOnUnavailable<T>( call: () => Promise<T>, wait: (ms: number) => Promise<void>, ): Promise<T> { try { return await call(); } catch (error) { if (errorCode(error) !== 'unavailable') throw error; await wait(600 + Math.floor(Math.random() * 800)); return call(); } } /_* One write of the ticks to the account; false (and still pending) when it fails. _/ export async function writeChecksOnce(store: CheckStore, remote: DocRefLike): Promise<boolean> { try { await retryOnUnavailable(() => remote.set({ checks: { ...store.saved }, v: 1 }), store.wait); store.status('account'); return true; } catch { store.dirty = true; store.status('error'); return false; } } /_* Sends the ticks to the account, one write at a time; a failure keeps them pending for the next change. _/ export async function flushChecks(store: CheckStore): Promise<void> { const remote = store.remote; if (!remote || store.writing) return; while (store.dirty) { store.writing = true; store.dirty = false; const sent = await writeChecksOnce(store, remote); store.writing = false; if (!sent) return; } } /_* Ticks stored in an account document. _/ export function remoteChecksOf(snap: DocSnapLike): CheckMap { return snap.exists ? toCheckMap(snap.data()?.checks) : {}; } /_* Applies ticks changed on another device (ignores this page's own pending writes). _/ export function onRemoteSnapshot(store: CheckStore, snap: DocSnapLike): void { if (store.writing || snap.metadata?.hasPendingWrites === true) return; const remote = remoteChecksOf(snap); const changed = Object.keys(remote).filter((id) => store.saved[id] !== remote[id]); if (changed.length === 0) return; for (const id of changed) store.saved[id] = remote[id] === true; refreshChecks(store); writeLocalChecks(store); } /_* The viewer's private document for this plan, or null when there is no database or no signed-in viewer. _/ export async function accountDocument( claude: ClaudeLike, planKey: string, ): Promise<DocRefLike | null> { const [db, user] = (await Promise.all([claude.use('db'), claude.use('user')])) as [ DbLike | null, UserLike | null, ]; const uid = user ? await user.id() : null; return db && uid ? db.collection(`data/users/${uid}`).doc(planKey) : null; } /_* Merges the account's ticks with this browser's, sends what only this browser has and listens for changes.
- **Input:** `store`: check store; `ref`: account document.
- **Output:** Nothing.
- **Effects:** Reads the account (retry on `unavailable`), merges, saves locally, sends local-only ticks and subscribes with `onSnapshot`.
- **Errors:** Read errors propagate.

### `connectAccount`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/checks.ts`
- **Signature:** `async connectAccount(store: CheckStore, claude: ClaudeLike | undefined): Promise<void>`
- **Used by:** `bootPlanPage()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Persistent checklists of the plan page. Ticks are keyed by the item's stable id and saved in localStorage and, when the viewer is signed in, in the artifact database (`data/users/<uid>/<planKey>`, private to the viewer), merged local × remote, retried once on `unavailable` and kept in sync across devices by `onSnapshot`. / export type SyncState = 'loading' | 'account' | 'local' | 'error'; export type CheckMap = Record<string, boolean>; /** Status line of each sync state (pt-BR). _/ export const SYNC_MESSAGES: Record<SyncState, string> = { loading: 'Carregando as marcações salvas…', account: 'Marcações salvas na sua conta: seguem nas atualizações do plano e em qualquer dispositivo.', local: 'Marcações salvas só neste navegador; seguem nas atualizações do plano.', error: 'Não consegui salvar na sua conta agora; a marcação ficou neste navegador e vai na próxima alteração.', }; /_* How long the page waits for the account before saying the ticks are local only. _/ export const ACCOUNT_TIMEOUT_MS = 10000; export interface DocSnapLike { readonly exists: boolean; data(): Record<string, unknown> | undefined; readonly metadata?: { readonly hasPendingWrites: boolean }; } export interface DocRefLike { get(): Promise<DocSnapLike>; set(data: Record<string, unknown>): Promise<void>; onSnapshot(next: (snap: DocSnapLike) => void, error?: (e: unknown) => void): () => void; } export interface DbLike { collection(path: string): { doc(id: string): DocRefLike }; } export interface UserLike { id(): Promise<string | null>; } export interface ClaudeLike { use(name: string): Promise<unknown>; } interface Registered { readonly box: HTMLInputElement; readonly row: HTMLElement; readonly def: boolean; } export interface CheckStore { readonly key: string; saved: CheckMap; readonly touched: Set<string>; readonly boxes: Map<string, Registered>; readonly storage: Storage | null; remote: DocRefLike | null; writing: boolean; dirty: boolean; readonly listeners: (() => void)[]; readonly status: (state: SyncState) => void; readonly wait: (ms: number) => Promise<void>; } /_* Only the boolean entries of an unknown value (anything else is dropped). _/ export function toCheckMap(value: unknown): CheckMap { if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}; const map: CheckMap = {}; for (const [id, v] of Object.entries(value)) if (typeof v === 'boolean') map[id] = v; return map; } /_* Ticks stored as JSON text; empty on missing or broken text. _/ export function parseStoredChecks(text: string | null): CheckMap { try { return toCheckMap(text === null ? {} : JSON.parse(text)); } catch { return {}; } } /_* Remote ticks win over local ones, except those the viewer changed in this page load. _/ export function mergeChecks( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): CheckMap { const mine: CheckMap = {}; for (const id of touched) if (id in local) mine[id] = local[id] === true; return { ...local, ...remote, ...mine }; } /_* Says whether local ticks are missing from the account (or newer), so they must be sent. _/ export function hasLocalOnly( local: CheckMap, remote: CheckMap, touched: ReadonlySet<string>, ): boolean { return Object.keys(local).some((id) => !(id in remote) || touched.has(id)); } /_* Storage key of a plan's ticks in this browser. _/ export function localChecksKey(planKey: string): string { return `planejamento-faculdade:${planKey}`; } /_* Ticks saved in this browser for a plan; empty when storage is missing or blocked. _/ export function readLocalChecks(storage: Storage | null, planKey: string): CheckMap { try { return parseStoredChecks(storage?.getItem(localChecksKey(planKey)) ?? null); } catch { return {}; } } /_* Pause of the given length. _/ export function pauseMs(ms: number): Promise<void> { return new Promise<void>((resolve) => setTimeout(resolve, ms)); } /_* New store with the ticks already saved in this browser. _/ export function createCheckStore(options: { key: string; storage: Storage | null; status: (state: SyncState) => void; wait?: (ms: number) => Promise<void>; }): CheckStore { return { ...options, wait: options.wait ?? pauseMs, saved: readLocalChecks(options.storage, options.key), touched: new Set(), boxes: new Map(), remote: null, writing: false, dirty: false, listeners: [], }; } /_* Writes the ticks to this browser; a blocked storage is ignored (the page keeps working). _/ export function writeLocalChecks(store: CheckStore): void { try { store.storage?.setItem(localChecksKey(store.key), JSON.stringify(store.saved)); } catch { // Private mode or blocked storage: the ticks live only in this page load. } } /_* Shows an item's tick: the saved one, or the item's default (done in the plan). _/ export function applyCheck(store: CheckStore, id: string): void { const entry = store.boxes.get(id); if (!entry) return; const checked = id in store.saved ? store.saved[id] === true : entry.def; entry.box.checked = checked; entry.row.classList.toggle('done', checked); } /_* Re-applies every tick and tells the listeners (progress counters). _/ export function refreshChecks(store: CheckStore): void { for (const id of store.boxes.keys()) applyCheck(store, id); store.listeners.forEach((listener) => { listener(); }); } /_* Records a change made by the viewer and saves it. _/ export function onCheckChange(store: CheckStore, id: string, checked: boolean): void { store.saved[id] = checked; store.touched.add(id); refreshChecks(store); writeLocalChecks(store); store.dirty = true; void flushChecks(store); } /_* Connects a checkbox (and its row) to the store under the item's stable id. _/ export function registerCheck( store: CheckStore, item: { id: string; def: boolean }, view: { box: HTMLInputElement; row: HTMLElement }, ): void { const { box, row } = view; store.boxes.set(item.id, { box, row, def: item.def }); applyCheck(store, item.id); box.addEventListener('change', () => { onCheckChange(store, item.id, box.checked); }); } /_* Error code of a runtime rejection, if any. _/ export function errorCode(error: unknown): string | undefined { const code = (error as { code?: unknown } | null)?.code; return typeof code === 'string' ? code : undefined; } /_* Runs a call and, when it fails with `unavailable`, once more after a short random pause. _/ export async function retryOnUnavailable<T>( call: () => Promise<T>, wait: (ms: number) => Promise<void>, ): Promise<T> { try { return await call(); } catch (error) { if (errorCode(error) !== 'unavailable') throw error; await wait(600 + Math.floor(Math.random() * 800)); return call(); } } /_* One write of the ticks to the account; false (and still pending) when it fails. _/ export async function writeChecksOnce(store: CheckStore, remote: DocRefLike): Promise<boolean> { try { await retryOnUnavailable(() => remote.set({ checks: { ...store.saved }, v: 1 }), store.wait); store.status('account'); return true; } catch { store.dirty = true; store.status('error'); return false; } } /_* Sends the ticks to the account, one write at a time; a failure keeps them pending for the next change. _/ export async function flushChecks(store: CheckStore): Promise<void> { const remote = store.remote; if (!remote || store.writing) return; while (store.dirty) { store.writing = true; store.dirty = false; const sent = await writeChecksOnce(store, remote); store.writing = false; if (!sent) return; } } /_* Ticks stored in an account document. _/ export function remoteChecksOf(snap: DocSnapLike): CheckMap { return snap.exists ? toCheckMap(snap.data()?.checks) : {}; } /_* Applies ticks changed on another device (ignores this page's own pending writes). _/ export function onRemoteSnapshot(store: CheckStore, snap: DocSnapLike): void { if (store.writing || snap.metadata?.hasPendingWrites === true) return; const remote = remoteChecksOf(snap); const changed = Object.keys(remote).filter((id) => store.saved[id] !== remote[id]); if (changed.length === 0) return; for (const id of changed) store.saved[id] = remote[id] === true; refreshChecks(store); writeLocalChecks(store); } /_* The viewer's private document for this plan, or null when there is no database or no signed-in viewer. _/ export async function accountDocument( claude: ClaudeLike, planKey: string, ): Promise<DocRefLike | null> { const [db, user] = (await Promise.all([claude.use('db'), claude.use('user')])) as [ DbLike | null, UserLike | null, ]; const uid = user ? await user.id() : null; return db && uid ? db.collection(`data/users/${uid}`).doc(planKey) : null; } /_* Merges the account's ticks with this browser's, sends what only this browser has and listens for changes. _/ export async function adoptAccount(store: CheckStore, ref: DocRefLike): Promise<void> { const remote = remoteChecksOf(await retryOnUnavailable(() => ref.get(), store.wait)); const localOnly = hasLocalOnly(store.saved, remote, store.touched); store.saved = mergeChecks(store.saved, remote, store.touched); refreshChecks(store); writeLocalChecks(store); store.remote = ref; if (localOnly) { store.dirty = true; await flushChecks(store); } else store.status('account'); ref.onSnapshot( (snap) => { onRemoteSnapshot(store, snap); }, () => undefined, ); } /_* Connects the store to the viewer's account when the page runs inside Claude; otherwise stays local.
- **Input:** `store`: check store; `claude`: page runtime or `undefined`.
- **Output:** Nothing.
- **Effects:** Reports `loading`, then `account` or `local` (10 s timeout); connects the account when possible.
- **Errors:** None (failures fall back to `local`).

## `connectors/canvas-puc/src/plan/page/dom.ts`

### `createEl`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/dom.ts`
- **Signature:** `createEl(doc: Document, tag: K, options: { className?: string; text?: string } = {}): HTMLElementTagNameMap[K]`
- **Used by:** `appendRichText()`, `createRichEl()`, `renderAssessments()`, `renderCardHead()`, `renderChecklistItem()`, `renderCourses()`, `renderDayRow()`, `renderFooter()`, `renderHeader()`, `renderNeed()`, `renderPointsBar()`, `renderQuestions()`, `renderRiskChips()`, `renderRules()`, `renderStudy()`, `renderToday()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** The only way the plan page creates content: elements whose text goes in through `textContent`. Rich text is limited to `**bold**`, split after the fact into `<b>` elements — no outside text ever reaches `innerHTML`. / /** New element with an optional class and text (set as `textContent`).
- **Input:** `doc`: document; `tag`: tag; `options`: `className`, `text`.
- **Output:** New element; the text goes in as `textContent`.
- **Effects:** None (pure).
- **Errors:** None.

### `richTextRuns`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/dom.ts`
- **Signature:** `richTextRuns(text: string): { bold: boolean; text: string }[]`
- **Used by:** `appendRichText()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** The only way the plan page creates content: elements whose text goes in through `textContent`. Rich text is limited to `**bold**`, split after the fact into `<b>` elements — no outside text ever reaches `innerHTML`. / /** New element with an optional class and text (set as `textContent`). _/ export function createEl<K extends keyof HTMLElementTagNameMap>( doc: Document, tag: K, options: { className?: string; text?: string } = {}, ): HTMLElementTagNameMap[K] { const el = doc.createElement(tag); if (options.className) el.className = options.className; if (options.text !== undefined) el.textContent = options.text; return el; } /_* Splits `a **b** c` into plain and bold runs; an unpaired `**` stays as plain text.
- **Input:** `text`: text with `**bold**`.
- **Output:** Plain and bold runs; an unpaired `**` keeps the whole text plain.
- **Effects:** None (pure).
- **Errors:** None.

### `appendRichText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/dom.ts`
- **Signature:** `appendRichText(parent: HTMLElement, text: string): HTMLElement`
- **Used by:** `createRichEl()`, `renderHeader()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** The only way the plan page creates content: elements whose text goes in through `textContent`. Rich text is limited to `**bold**`, split after the fact into `<b>` elements — no outside text ever reaches `innerHTML`. / /** New element with an optional class and text (set as `textContent`). _/ export function createEl<K extends keyof HTMLElementTagNameMap>( doc: Document, tag: K, options: { className?: string; text?: string } = {}, ): HTMLElementTagNameMap[K] { const el = doc.createElement(tag); if (options.className) el.className = options.className; if (options.text !== undefined) el.textContent = options.text; return el; } /_* Splits `a **b** c` into plain and bold runs; an unpaired `**` stays as plain text. */ export function richTextRuns(text: string): { bold: boolean; text: string }[] { const parts = text.split('**'); if (parts.length % 2 === 0) return [{ bold: false, text }]; return parts .map((part, index) => ({ bold: index % 2 === 1, text: part })) .filter((run) => run.text.length > 0); } /** Appends text with `**bold**` runs to a parent, as text nodes and `<b>` elements.
- **Input:** `parent`: element; `text`: text with `**bold**`.
- **Output:** The parent.
- **Effects:** Appends text nodes and `<b>` elements (never HTML).
- **Errors:** None.

### `createRichEl`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/dom.ts`
- **Signature:** `createRichEl(doc: Document, tag: K, text: string): HTMLElementTagNameMap[K]`
- **Used by:** `renderCourses()`, `renderQuestions()`, `renderRules()`, `renderToday()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** The only way the plan page creates content: elements whose text goes in through `textContent`. Rich text is limited to `**bold**`, split after the fact into `<b>` elements — no outside text ever reaches `innerHTML`. / /** New element with an optional class and text (set as `textContent`). _/ export function createEl<K extends keyof HTMLElementTagNameMap>( doc: Document, tag: K, options: { className?: string; text?: string } = {}, ): HTMLElementTagNameMap[K] { const el = doc.createElement(tag); if (options.className) el.className = options.className; if (options.text !== undefined) el.textContent = options.text; return el; } /_* Splits `a **b** c` into plain and bold runs; an unpaired `**` stays as plain text. _/ export function richTextRuns(text: string): { bold: boolean; text: string }[] { const parts = text.split('**'); if (parts.length % 2 === 0) return [{ bold: false, text }]; return parts .map((part, index) => ({ bold: index % 2 === 1, text: part })) .filter((run) => run.text.length > 0); } /** Appends text with `**bold**` runs to a parent, as text nodes and `<b>` elements. */ export function appendRichText(parent: HTMLElement, text: string): HTMLElement { const doc = parent.ownerDocument; for (const run of richTextRuns(text)) { parent.append(run.bold ? createEl(doc, 'b', { text: run.text }) : doc.createTextNode(run.text)); } return parent; } /*_ Element with rich text content.
- **Input:** `doc`: document; `tag`: tag; `text`: text with `**bold**`.
- **Output:** New element with the rich text.
- **Effects:** None (pure).
- **Errors:** None.

### `requireEl`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/dom.ts`
- **Signature:** `requireEl(doc: Document, id: string): HTMLElement`
- **Used by:** `readEmbeddedPlan()`, `renderCourses()`, `renderFooter()`, `renderHeader()`, `renderQuestions()`, `renderRiskChips()`, `renderStudy()`, `renderTimeline()`, `renderToday()`, `updateCounters()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** The only way the plan page creates content: elements whose text goes in through `textContent`. Rich text is limited to `**bold**`, split after the fact into `<b>` elements — no outside text ever reaches `innerHTML`. / /** New element with an optional class and text (set as `textContent`). _/ export function createEl<K extends keyof HTMLElementTagNameMap>( doc: Document, tag: K, options: { className?: string; text?: string } = {}, ): HTMLElementTagNameMap[K] { const el = doc.createElement(tag); if (options.className) el.className = options.className; if (options.text !== undefined) el.textContent = options.text; return el; } /_* Splits `a **b** c` into plain and bold runs; an unpaired `**` stays as plain text. _/ export function richTextRuns(text: string): { bold: boolean; text: string }[] { const parts = text.split('**'); if (parts.length % 2 === 0) return [{ bold: false, text }]; return parts .map((part, index) => ({ bold: index % 2 === 1, text: part })) .filter((run) => run.text.length > 0); } /** Appends text with `**bold**` runs to a parent, as text nodes and `<b>` elements. */ export function appendRichText(parent: HTMLElement, text: string): HTMLElement { const doc = parent.ownerDocument; for (const run of richTextRuns(text)) { parent.append(run.bold ? createEl(doc, 'b', { text: run.text }) : doc.createTextNode(run.text)); } return parent; } /*_ Element with rich text content. _/ export function createRichEl<K extends keyof HTMLElementTagNameMap>( doc: Document, tag: K, text: string, ): HTMLElementTagNameMap[K] { const el = createEl(doc, tag); appendRichText(el, text); return el; } /_* Element found by id; throws naming the id when the template lacks it.
- **Input:** `doc`: document; `id`: element id.
- **Output:** The element.
- **Effects:** None.
- **Errors:** Throws naming the id when the template lacks it.

## `connectors/canvas-puc/src/plan/page/format.ts`

### `formatDayMonth`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/format.ts`
- **Signature:** `formatDayMonth(isoDate: string): string`
- **Used by:** `assessmentTitleText()`, `renderDayRow()`, `renderQuestions()`, `renderRules()`, `renderToday()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Pure text formatting of the plan page (pt-BR, America/Sao_Paulo). _/ /_* Time zone of every date and time the plan shows. _/ export const PLAN_TIME_ZONE = 'America/Sao_Paulo'; /_* Short weekday names in pt-BR, Sunday first. _/ export const WEEKDAYS_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const; /_* "DD/MM" of a YYYY-MM-DD date.
- **Input:** `isoDate`: `YYYY-MM-DD`.
- **Output:** `DD/MM`.
- **Effects:** None (pure).
- **Errors:** None.

### `weekdayOf`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/format.ts`
- **Signature:** `weekdayOf(isoDate: string): string`
- **Used by:** `renderDayRow()`, `renderToday()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Pure text formatting of the plan page (pt-BR, America/Sao_Paulo). _/ /_* Time zone of every date and time the plan shows. _/ export const PLAN_TIME_ZONE = 'America/Sao_Paulo'; /_* Short weekday names in pt-BR, Sunday first. _/ export const WEEKDAYS_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const; /_* "DD/MM" of a YYYY-MM-DD date. _/ export function formatDayMonth(isoDate: string): string { return `${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}`; } /_* Short pt-BR weekday of a YYYY-MM-DD date ("seg").
- **Input:** `isoDate`: `YYYY-MM-DD`.
- **Output:** Short pt-BR weekday (`seg`).
- **Effects:** None (pure).
- **Errors:** None.

### `saoPauloParts`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/format.ts`
- **Signature:** `saoPauloParts(instant: Date): Record<string, string>`
- **Used by:** `formatStamp()`, `saoPauloToday()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Pure text formatting of the plan page (pt-BR, America/Sao_Paulo). _/ /_* Time zone of every date and time the plan shows. _/ export const PLAN_TIME_ZONE = 'America/Sao_Paulo'; /_* Short weekday names in pt-BR, Sunday first. _/ export const WEEKDAYS_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const; /_* "DD/MM" of a YYYY-MM-DD date. _/ export function formatDayMonth(isoDate: string): string { return `${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}`; } /_* Short pt-BR weekday of a YYYY-MM-DD date ("seg"). _/ export function weekdayOf(isoDate: string): string { const [year, month, day] = isoDate.split('-').map(Number); const index = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1)).getUTCDay(); return WEEKDAYS_PT[index] ?? ''; } /_* Parts of an instant in São Paulo time, keyed by part type (year, month, day, hour, minute).
- **Input:** `instant`: date.
- **Output:** Year, month, day, hour and minute in São Paulo time, keyed by part type.
- **Effects:** None (pure).
- **Errors:** None.

### `formatStamp`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/format.ts`
- **Signature:** `formatStamp(isoInstant: string): string`
- **Used by:** `renderFooter()`, `situationText()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Pure text formatting of the plan page (pt-BR, America/Sao_Paulo). _/ /_* Time zone of every date and time the plan shows. _/ export const PLAN_TIME_ZONE = 'America/Sao_Paulo'; /_* Short weekday names in pt-BR, Sunday first. _/ export const WEEKDAYS_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const; /_* "DD/MM" of a YYYY-MM-DD date. _/ export function formatDayMonth(isoDate: string): string { return `${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}`; } /_* Short pt-BR weekday of a YYYY-MM-DD date ("seg"). _/ export function weekdayOf(isoDate: string): string { const [year, month, day] = isoDate.split('-').map(Number); const index = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1)).getUTCDay(); return WEEKDAYS_PT[index] ?? ''; } /_* Parts of an instant in São Paulo time, keyed by part type (year, month, day, hour, minute). _/ export function saoPauloParts(instant: Date): Record<string, string> { const parts = new Intl.DateTimeFormat('en-GB', { timeZone: PLAN_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', }).formatToParts(instant); return Object.fromEntries(parts.map((p) => [p.type, p.value])); } /_* "DD/MM/AAAA, HHhMM" of an ISO instant, in São Paulo time ("23/11/2026, 07h00").
- **Input:** `isoInstant`: ISO instant.
- **Output:** `DD/MM/AAAA, HHhMM` in São Paulo time.
- **Effects:** None (pure).
- **Errors:** None.

### `saoPauloToday`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/format.ts`
- **Signature:** `saoPauloToday(now: Date): string`
- **Used by:** `bootPlanPage()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Pure text formatting of the plan page (pt-BR, America/Sao_Paulo). _/ /_* Time zone of every date and time the plan shows. _/ export const PLAN_TIME_ZONE = 'America/Sao_Paulo'; /_* Short weekday names in pt-BR, Sunday first. _/ export const WEEKDAYS_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const; /_* "DD/MM" of a YYYY-MM-DD date. _/ export function formatDayMonth(isoDate: string): string { return `${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}`; } /_* Short pt-BR weekday of a YYYY-MM-DD date ("seg"). _/ export function weekdayOf(isoDate: string): string { const [year, month, day] = isoDate.split('-').map(Number); const index = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1)).getUTCDay(); return WEEKDAYS_PT[index] ?? ''; } /_* Parts of an instant in São Paulo time, keyed by part type (year, month, day, hour, minute). _/ export function saoPauloParts(instant: Date): Record<string, string> { const parts = new Intl.DateTimeFormat('en-GB', { timeZone: PLAN_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', }).formatToParts(instant); return Object.fromEntries(parts.map((p) => [p.type, p.value])); } /_* "DD/MM/AAAA, HHhMM" of an ISO instant, in São Paulo time ("23/11/2026, 07h00"). _/ export function formatStamp(isoInstant: string): string { const p = saoPauloParts(new Date(isoInstant)); return `${p.day ?? ''}/${p.month ?? ''}/${p.year ?? ''}, ${p.hour ?? ''}h${p.minute ?? ''}`; } /_* Today's date (YYYY-MM-DD) in São Paulo.
- **Input:** `now`: date.
- **Output:** Today's `YYYY-MM-DD` in São Paulo.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/plan/page/main.ts`

### `readEmbeddedPlan`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/main.ts`
- **Signature:** `readEmbeddedPlan(doc: Document): PlanData`
- **Used by:** `bootPlanPage()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Boot of the plan page: reads the JSON block, renders every section and wires the persistent checklists. _/ import type { PlanData } from '../plan-schema.js'; import type { ClaudeLike, SyncState } from './checks.js'; import { SYNC_MESSAGES, connectAccount, createCheckStore } from './checks.js'; import { requireEl } from './dom.js'; import { saoPauloToday } from './format.js'; import { renderCourses } from './render-courses.js'; import { progressText, renderQuestions, renderStudy, renderTimeline, renderToday, } from './render-days.js'; import type { DayContext } from './render-days.js'; import { courseLevels, renderFooter, renderHeader, renderRiskChips } from './render-header.js'; export interface PlanPageEnv { readonly doc: Document; readonly now: Date; readonly storage: Storage | null; readonly claude?: ClaudeLike | undefined; } /_* The plan embedded in the page.
- **Input:** `doc`: page.
- **Output:** The plan JSON of `#plan-data` (not validated: the script validated it).
- **Effects:** Reads the DOM.
- **Errors:** Throws when `#plan-data` is missing; `JSON.parse` errors propagate.

### `showSyncState`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/main.ts`
- **Signature:** `showSyncState(doc: Document, state: SyncState): void`
- **Used by:** `connectors/canvas-puc/src/plan/page/main.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Boot of the plan page: reads the JSON block, renders every section and wires the persistent checklists. _/ import type { PlanData } from '../plan-schema.js'; import type { ClaudeLike, SyncState } from './checks.js'; import { SYNC_MESSAGES, connectAccount, createCheckStore } from './checks.js'; import { requireEl } from './dom.js'; import { saoPauloToday } from './format.js'; import { renderCourses } from './render-courses.js'; import { progressText, renderQuestions, renderStudy, renderTimeline, renderToday, } from './render-days.js'; import type { DayContext } from './render-days.js'; import { courseLevels, renderFooter, renderHeader, renderRiskChips } from './render-header.js'; export interface PlanPageEnv { readonly doc: Document; readonly now: Date; readonly storage: Storage | null; readonly claude?: ClaudeLike | undefined; } /_* The plan embedded in the page. _/ export function readEmbeddedPlan(doc: Document): PlanData { return JSON.parse(requireEl(doc, 'plan-data').textContent || 'null') as PlanData; } /_* Shows a sync state in every status line.
- **Input:** `doc`: page; `state`: sync state.
- **Output:** Nothing.
- **Effects:** Writes the state message and `data-state` into every `.sync`.
- **Errors:** None.

### `renderPlanSections`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/main.ts`
- **Signature:** `renderPlanSections(ctx: DayContext, plan: PlanData): [HTMLInputElement[], HTMLInputElement[]]`
- **Used by:** `bootPlanPage()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Boot of the plan page: reads the JSON block, renders every section and wires the persistent checklists. _/ import type { PlanData } from '../plan-schema.js'; import type { ClaudeLike, SyncState } from './checks.js'; import { SYNC_MESSAGES, connectAccount, createCheckStore } from './checks.js'; import { requireEl } from './dom.js'; import { saoPauloToday } from './format.js'; import { renderCourses } from './render-courses.js'; import { progressText, renderQuestions, renderStudy, renderTimeline, renderToday, } from './render-days.js'; import type { DayContext } from './render-days.js'; import { courseLevels, renderFooter, renderHeader, renderRiskChips } from './render-header.js'; export interface PlanPageEnv { readonly doc: Document; readonly now: Date; readonly storage: Storage | null; readonly claude?: ClaudeLike | undefined; } /_* The plan embedded in the page. _/ export function readEmbeddedPlan(doc: Document): PlanData { return JSON.parse(requireEl(doc, 'plan-data').textContent || 'null') as PlanData; } /_* Shows a sync state in every status line. _/ export function showSyncState(doc: Document, state: SyncState): void { doc.querySelectorAll<HTMLElement>('.sync').forEach((el) => { el.textContent = SYNC_MESSAGES[state]; el.dataset.state = state; }); } /_* Renders every section; returns the study and timeline checkboxes.
- **Input:** `ctx`: day context; `plan`: plan.
- **Output:** Study and timeline checkboxes.
- **Effects:** Fills every section of the page.
- **Errors:** `requireEl` errors propagate.

### `updateCounters`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/main.ts`
- **Signature:** `updateCounters(doc: Document, study: readonly HTMLInputElement[], timeline: readonly HTMLInputElement[]): void`
- **Used by:** `bootPlanPage()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Boot of the plan page: reads the JSON block, renders every section and wires the persistent checklists. _/ import type { PlanData } from '../plan-schema.js'; import type { ClaudeLike, SyncState } from './checks.js'; import { SYNC_MESSAGES, connectAccount, createCheckStore } from './checks.js'; import { requireEl } from './dom.js'; import { saoPauloToday } from './format.js'; import { renderCourses } from './render-courses.js'; import { progressText, renderQuestions, renderStudy, renderTimeline, renderToday, } from './render-days.js'; import type { DayContext } from './render-days.js'; import { courseLevels, renderFooter, renderHeader, renderRiskChips } from './render-header.js'; export interface PlanPageEnv { readonly doc: Document; readonly now: Date; readonly storage: Storage | null; readonly claude?: ClaudeLike | undefined; } /_* The plan embedded in the page. _/ export function readEmbeddedPlan(doc: Document): PlanData { return JSON.parse(requireEl(doc, 'plan-data').textContent || 'null') as PlanData; } /_* Shows a sync state in every status line. _/ export function showSyncState(doc: Document, state: SyncState): void { doc.querySelectorAll<HTMLElement>('.sync').forEach((el) => { el.textContent = SYNC_MESSAGES[state]; el.dataset.state = state; }); } /_* Renders every section; returns the study and timeline checkboxes. _/ export function renderPlanSections( ctx: DayContext, plan: PlanData, ): [HTMLInputElement[], HTMLInputElement[]] { const { doc } = ctx; renderHeader(doc, plan); renderRiskChips(doc, plan); renderToday(doc, plan); const study = renderStudy(ctx, plan.study); renderCourses(doc, plan); const timeline = renderTimeline(ctx, plan.timeline, plan.undated); renderQuestions(doc, plan); renderFooter(doc, plan); return [study, timeline]; } /_* Writes the "X de Y" counters of both checklists.
- **Input:** `doc`: page; `study`, `timeline`: checkboxes.
- **Output:** Nothing.
- **Effects:** Writes the "X de Y" counters.
- **Errors:** None.

### `bootPlanPage`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/main.ts`
- **Signature:** `async bootPlanPage(env: PlanPageEnv): Promise<void>`
- **Used by:** `startPlanPage()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Boot of the plan page: reads the JSON block, renders every section and wires the persistent checklists. _/ import type { PlanData } from '../plan-schema.js'; import type { ClaudeLike, SyncState } from './checks.js'; import { SYNC_MESSAGES, connectAccount, createCheckStore } from './checks.js'; import { requireEl } from './dom.js'; import { saoPauloToday } from './format.js'; import { renderCourses } from './render-courses.js'; import { progressText, renderQuestions, renderStudy, renderTimeline, renderToday, } from './render-days.js'; import type { DayContext } from './render-days.js'; import { courseLevels, renderFooter, renderHeader, renderRiskChips } from './render-header.js'; export interface PlanPageEnv { readonly doc: Document; readonly now: Date; readonly storage: Storage | null; readonly claude?: ClaudeLike | undefined; } /_* The plan embedded in the page. _/ export function readEmbeddedPlan(doc: Document): PlanData { return JSON.parse(requireEl(doc, 'plan-data').textContent || 'null') as PlanData; } /_* Shows a sync state in every status line. _/ export function showSyncState(doc: Document, state: SyncState): void { doc.querySelectorAll<HTMLElement>('.sync').forEach((el) => { el.textContent = SYNC_MESSAGES[state]; el.dataset.state = state; }); } /_* Renders every section; returns the study and timeline checkboxes. _/ export function renderPlanSections( ctx: DayContext, plan: PlanData, ): [HTMLInputElement[], HTMLInputElement[]] { const { doc } = ctx; renderHeader(doc, plan); renderRiskChips(doc, plan); renderToday(doc, plan); const study = renderStudy(ctx, plan.study); renderCourses(doc, plan); const timeline = renderTimeline(ctx, plan.timeline, plan.undated); renderQuestions(doc, plan); renderFooter(doc, plan); return [study, timeline]; } /_* Writes the "X de Y" counters of both checklists. _/ export function updateCounters( doc: Document, study: readonly HTMLInputElement[], timeline: readonly HTMLInputElement[], ): void { requireEl(doc, 'study-progress').textContent = progressText(study, 'feitos'); requireEl(doc, 'timeline-progress').textContent = progressText(timeline, 'concluídos'); } /_* Renders the whole page and returns once the account sync has settled.
- **Input:** `env`: document, now, storage and optional Claude runtime.
- **Output:** Promise settled after the account sync.
- **Effects:** Renders the page, wires the checklists and connects the account.
- **Errors:** Rejects when the plan data or the template is broken.

### `safeLocalStorage`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/main.ts`
- **Signature:** `safeLocalStorage(win: Window): Storage | null`
- **Used by:** `startPlanPage()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Boot of the plan page: reads the JSON block, renders every section and wires the persistent checklists. _/ import type { PlanData } from '../plan-schema.js'; import type { ClaudeLike, SyncState } from './checks.js'; import { SYNC_MESSAGES, connectAccount, createCheckStore } from './checks.js'; import { requireEl } from './dom.js'; import { saoPauloToday } from './format.js'; import { renderCourses } from './render-courses.js'; import { progressText, renderQuestions, renderStudy, renderTimeline, renderToday, } from './render-days.js'; import type { DayContext } from './render-days.js'; import { courseLevels, renderFooter, renderHeader, renderRiskChips } from './render-header.js'; export interface PlanPageEnv { readonly doc: Document; readonly now: Date; readonly storage: Storage | null; readonly claude?: ClaudeLike | undefined; } /_* The plan embedded in the page. _/ export function readEmbeddedPlan(doc: Document): PlanData { return JSON.parse(requireEl(doc, 'plan-data').textContent || 'null') as PlanData; } /_* Shows a sync state in every status line. _/ export function showSyncState(doc: Document, state: SyncState): void { doc.querySelectorAll<HTMLElement>('.sync').forEach((el) => { el.textContent = SYNC_MESSAGES[state]; el.dataset.state = state; }); } /_* Renders every section; returns the study and timeline checkboxes. _/ export function renderPlanSections( ctx: DayContext, plan: PlanData, ): [HTMLInputElement[], HTMLInputElement[]] { const { doc } = ctx; renderHeader(doc, plan); renderRiskChips(doc, plan); renderToday(doc, plan); const study = renderStudy(ctx, plan.study); renderCourses(doc, plan); const timeline = renderTimeline(ctx, plan.timeline, plan.undated); renderQuestions(doc, plan); renderFooter(doc, plan); return [study, timeline]; } /_* Writes the "X de Y" counters of both checklists. _/ export function updateCounters( doc: Document, study: readonly HTMLInputElement[], timeline: readonly HTMLInputElement[], ): void { requireEl(doc, 'study-progress').textContent = progressText(study, 'feitos'); requireEl(doc, 'timeline-progress').textContent = progressText(timeline, 'concluídos'); } /_* Renders the whole page and returns once the account sync has settled. _/ export async function bootPlanPage(env: PlanPageEnv): Promise<void> { const { doc } = env; const plan = readEmbeddedPlan(doc); function status(state: SyncState): void { showSyncState(doc, state); } const store = createCheckStore({ key: plan.planKey, storage: env.storage, status }); const ctx = { doc, today: saoPauloToday(env.now), levels: courseLevels(plan), store }; const [study, timeline] = renderPlanSections(ctx, plan); store.listeners.push(() => { updateCounters(doc, study, timeline); }); updateCounters(doc, study, timeline); await connectAccount(store, env.claude); } /_* Browser storage, or null when the browser blocks it.
- **Input:** `win`: window.
- **Output:** Its localStorage, or `null` when the browser blocks it.
- **Effects:** Reads `window.localStorage`.
- **Errors:** None.

### `startPlanPage`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/main.ts`
- **Signature:** `startPlanPage(win: Window & { claude?: ClaudeLike }): Promise<void>`
- **Used by:** `connectors/canvas-puc/src/plan/page/entry.ts (module)`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Boot of the plan page: reads the JSON block, renders every section and wires the persistent checklists. _/ import type { PlanData } from '../plan-schema.js'; import type { ClaudeLike, SyncState } from './checks.js'; import { SYNC_MESSAGES, connectAccount, createCheckStore } from './checks.js'; import { requireEl } from './dom.js'; import { saoPauloToday } from './format.js'; import { renderCourses } from './render-courses.js'; import { progressText, renderQuestions, renderStudy, renderTimeline, renderToday, } from './render-days.js'; import type { DayContext } from './render-days.js'; import { courseLevels, renderFooter, renderHeader, renderRiskChips } from './render-header.js'; export interface PlanPageEnv { readonly doc: Document; readonly now: Date; readonly storage: Storage | null; readonly claude?: ClaudeLike | undefined; } /_* The plan embedded in the page. _/ export function readEmbeddedPlan(doc: Document): PlanData { return JSON.parse(requireEl(doc, 'plan-data').textContent || 'null') as PlanData; } /_* Shows a sync state in every status line. _/ export function showSyncState(doc: Document, state: SyncState): void { doc.querySelectorAll<HTMLElement>('.sync').forEach((el) => { el.textContent = SYNC_MESSAGES[state]; el.dataset.state = state; }); } /_* Renders every section; returns the study and timeline checkboxes. _/ export function renderPlanSections( ctx: DayContext, plan: PlanData, ): [HTMLInputElement[], HTMLInputElement[]] { const { doc } = ctx; renderHeader(doc, plan); renderRiskChips(doc, plan); renderToday(doc, plan); const study = renderStudy(ctx, plan.study); renderCourses(doc, plan); const timeline = renderTimeline(ctx, plan.timeline, plan.undated); renderQuestions(doc, plan); renderFooter(doc, plan); return [study, timeline]; } /_* Writes the "X de Y" counters of both checklists. _/ export function updateCounters( doc: Document, study: readonly HTMLInputElement[], timeline: readonly HTMLInputElement[], ): void { requireEl(doc, 'study-progress').textContent = progressText(study, 'feitos'); requireEl(doc, 'timeline-progress').textContent = progressText(timeline, 'concluídos'); } /_* Renders the whole page and returns once the account sync has settled. _/ export async function bootPlanPage(env: PlanPageEnv): Promise<void> { const { doc } = env; const plan = readEmbeddedPlan(doc); function status(state: SyncState): void { showSyncState(doc, state); } const store = createCheckStore({ key: plan.planKey, storage: env.storage, status }); const ctx = { doc, today: saoPauloToday(env.now), levels: courseLevels(plan), store }; const [study, timeline] = renderPlanSections(ctx, plan); store.listeners.push(() => { updateCounters(doc, study, timeline); }); updateCounters(doc, study, timeline); await connectAccount(store, env.claude); } /_* Browser storage, or null when the browser blocks it. _/ export function safeLocalStorage(win: Window): Storage | null { try { return win.localStorage; } catch { return null; } } /_* Starts the page in the browser, showing a short message if the plan data is broken.
- **Input:** `win`: browser window (with optional `claude`).
- **Output:** Promise settled after boot.
- **Effects:** Boots the page; on failure shows the message in `#plan-error`.
- **Errors:** None (errors become the visible message).

## `connectors/canvas-puc/src/plan/page/render-courses.ts`

### `assessmentValueText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-courses.ts`
- **Signature:** `assessmentValueText(a: Assessment): string`
- **Used by:** `renderAssessments()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Course cards: points missing, guaranteed and maximum, stacked bar with the goal, assessments, path and rules. _/ import type { Assessment, PlanCourse, PlanData } from '../plan-schema.js'; import { barSegments, formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth } from './format.js'; import { LEVEL_LABELS } from './render-header.js'; /_* pt-BR name of each bar segment, for the accessible description. _/ export const SEGMENT_LABELS = { sure: 'garantidos', pend: 'enviados sem nota', open: 'em aberto', lost: 'perdidos ou incertos', } as const; /_* "15 / 30", "≈8 / 10" (estimated) or "— / 30" (no grade yet).
- **Input:** `a`: assessment.
- **Output:** `score / max`, `≈score / max` (estimated) or `— / max`.
- **Effects:** None (pure).
- **Errors:** None.

### `assessmentTitleText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-courses.ts`
- **Signature:** `assessmentTitleText(a: Assessment): string`
- **Used by:** `renderAssessments()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Course cards: points missing, guaranteed and maximum, stacked bar with the goal, assessments, path and rules. _/ import type { Assessment, PlanCourse, PlanData } from '../plan-schema.js'; import { barSegments, formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth } from './format.js'; import { LEVEL_LABELS } from './render-header.js'; /_* pt-BR name of each bar segment, for the accessible description. _/ export const SEGMENT_LABELS = { sure: 'garantidos', pend: 'enviados sem nota', open: 'em aberto', lost: 'perdidos ou incertos', } as const; /_* "15 / 30", "≈8 / 10" (estimated) or "— / 30" (no grade yet). _/ export function assessmentValueText(a: Assessment): string { const score = a.score === null ? '—' : `${a.estimated ? '≈' : ''}${formatPoints(a.score)}`; return `${score} / ${formatPoints(a.max)}`; } /_* Assessment name with its date and whether the student gave the grade ("Prova 3 · 09/12").
- **Input:** `a`: assessment.
- **Output:** Title with `· DD/MM` and `· informado por você` when they apply.
- **Effects:** None (pure).
- **Errors:** None.

### `barLabel`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-courses.ts`
- **Signature:** `barLabel(course: PlanCourse, goal: number): string`
- **Used by:** `renderPointsBar()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Course cards: points missing, guaranteed and maximum, stacked bar with the goal, assessments, path and rules. _/ import type { Assessment, PlanCourse, PlanData } from '../plan-schema.js'; import { barSegments, formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth } from './format.js'; import { LEVEL_LABELS } from './render-header.js'; /_* pt-BR name of each bar segment, for the accessible description. _/ export const SEGMENT_LABELS = { sure: 'garantidos', pend: 'enviados sem nota', open: 'em aberto', lost: 'perdidos ou incertos', } as const; /_* "15 / 30", "≈8 / 10" (estimated) or "— / 30" (no grade yet). _/ export function assessmentValueText(a: Assessment): string { const score = a.score === null ? '—' : `${a.estimated ? '≈' : ''}${formatPoints(a.score)}`; return `${score} / ${formatPoints(a.max)}`; } /_* Assessment name with its date and whether the student gave the grade ("Prova 3 · 09/12"). _/ export function assessmentTitleText(a: Assessment): string { const date = a.date ? ` · ${formatDayMonth(a.date)}` : ''; return `${a.title}${date}${a.informedByStudent ? ' · informado por você' : ''}`; } /_* Accessible description of the bar: every segment in points and the goal.
- **Input:** `course`: course; `goal`: goal.
- **Output:** Accessible description of the non-empty bar segments and the goal.
- **Effects:** None (pure).
- **Errors:** None.

### `renderPointsBar`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-courses.ts`
- **Signature:** `renderPointsBar(doc: Document, course: PlanCourse, goal: number): HTMLElement`
- **Used by:** `renderCourses()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Course cards: points missing, guaranteed and maximum, stacked bar with the goal, assessments, path and rules. _/ import type { Assessment, PlanCourse, PlanData } from '../plan-schema.js'; import { barSegments, formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth } from './format.js'; import { LEVEL_LABELS } from './render-header.js'; /_* pt-BR name of each bar segment, for the accessible description. _/ export const SEGMENT_LABELS = { sure: 'garantidos', pend: 'enviados sem nota', open: 'em aberto', lost: 'perdidos ou incertos', } as const; /_* "15 / 30", "≈8 / 10" (estimated) or "— / 30" (no grade yet). _/ export function assessmentValueText(a: Assessment): string { const score = a.score === null ? '—' : `${a.estimated ? '≈' : ''}${formatPoints(a.score)}`; return `${score} / ${formatPoints(a.max)}`; } /_* Assessment name with its date and whether the student gave the grade ("Prova 3 · 09/12"). _/ export function assessmentTitleText(a: Assessment): string { const date = a.date ? ` · ${formatDayMonth(a.date)}` : ''; return `${a.title}${date}${a.informedByStudent ? ' · informado por você' : ''}`; } /_* Accessible description of the bar: every segment in points and the goal. _/ export function barLabel(course: PlanCourse, goal: number): string { const parts = (Object.keys(SEGMENT_LABELS) as (keyof typeof SEGMENT_LABELS)[]) .filter((kind) => course.points[kind] > 0) .map((kind) => `${formatPoints(course.points[kind])} ${SEGMENT_LABELS[kind]}`); return `${course.code}: ${parts.join(', ')}; meta ${formatPoints(goal)}`; } /_* Stacked bar (sure / pending / open / lost) with the goal marker.
- **Input:** `doc`: document; `course`: course; `goal`: goal.
- **Output:** The stacked bar (`role="img"`, `aria-label`) with the goal marker.
- **Effects:** None (pure).
- **Errors:** None.

### `renderNeed`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-courses.ts`
- **Signature:** `renderNeed(doc: Document, course: PlanCourse, goal: number): HTMLElement`
- **Used by:** `renderCourses()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Course cards: points missing, guaranteed and maximum, stacked bar with the goal, assessments, path and rules. _/ import type { Assessment, PlanCourse, PlanData } from '../plan-schema.js'; import { barSegments, formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth } from './format.js'; import { LEVEL_LABELS } from './render-header.js'; /_* pt-BR name of each bar segment, for the accessible description. _/ export const SEGMENT_LABELS = { sure: 'garantidos', pend: 'enviados sem nota', open: 'em aberto', lost: 'perdidos ou incertos', } as const; /_* "15 / 30", "≈8 / 10" (estimated) or "— / 30" (no grade yet). _/ export function assessmentValueText(a: Assessment): string { const score = a.score === null ? '—' : `${a.estimated ? '≈' : ''}${formatPoints(a.score)}`; return `${score} / ${formatPoints(a.max)}`; } /_* Assessment name with its date and whether the student gave the grade ("Prova 3 · 09/12"). _/ export function assessmentTitleText(a: Assessment): string { const date = a.date ? ` · ${formatDayMonth(a.date)}` : ''; return `${a.title}${date}${a.informedByStudent ? ' · informado por você' : ''}`; } /_* Accessible description of the bar: every segment in points and the goal. _/ export function barLabel(course: PlanCourse, goal: number): string { const parts = (Object.keys(SEGMENT_LABELS) as (keyof typeof SEGMENT_LABELS)[]) .filter((kind) => course.points[kind] > 0) .map((kind) => `${formatPoints(course.points[kind])} ${SEGMENT_LABELS[kind]}`); return `${course.code}: ${parts.join(', ')}; meta ${formatPoints(goal)}`; } /_* Stacked bar (sure / pending / open / lost) with the goal marker. _/ export function renderPointsBar(doc: Document, course: PlanCourse, goal: number): HTMLElement { const bar = createEl(doc, 'div', { className: 'bar' }); bar.setAttribute('role', 'img'); bar.setAttribute('aria-label', barLabel(course, goal)); for (const segment of barSegments(course.points)) { const span = createEl(doc, 'span', { className: `seg seg-${segment.kind}` }); span.style.width = `${segment.percent}%`; bar.append(span); } const marker = createEl(doc, 'span', { className: 'goal' }); marker.dataset.label = formatPoints(goal); marker.style.left = `${Math.min(100, goal)}%`; bar.append(marker); return bar; } /_* Big number and the guaranteed / maximum line.
- **Input:** `doc`: document; `course`: course; `goal`: goal.
- **Output:** Block with the missing points, guaranteed and maximum possible.
- **Effects:** None (pure).
- **Errors:** None.

### `renderAssessments`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-courses.ts`
- **Signature:** `renderAssessments(doc: Document, course: PlanCourse): HTMLElement`
- **Used by:** `renderCourses()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Course cards: points missing, guaranteed and maximum, stacked bar with the goal, assessments, path and rules. _/ import type { Assessment, PlanCourse, PlanData } from '../plan-schema.js'; import { barSegments, formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth } from './format.js'; import { LEVEL_LABELS } from './render-header.js'; /_* pt-BR name of each bar segment, for the accessible description. _/ export const SEGMENT_LABELS = { sure: 'garantidos', pend: 'enviados sem nota', open: 'em aberto', lost: 'perdidos ou incertos', } as const; /_* "15 / 30", "≈8 / 10" (estimated) or "— / 30" (no grade yet). _/ export function assessmentValueText(a: Assessment): string { const score = a.score === null ? '—' : `${a.estimated ? '≈' : ''}${formatPoints(a.score)}`; return `${score} / ${formatPoints(a.max)}`; } /_* Assessment name with its date and whether the student gave the grade ("Prova 3 · 09/12"). _/ export function assessmentTitleText(a: Assessment): string { const date = a.date ? ` · ${formatDayMonth(a.date)}` : ''; return `${a.title}${date}${a.informedByStudent ? ' · informado por você' : ''}`; } /_* Accessible description of the bar: every segment in points and the goal. _/ export function barLabel(course: PlanCourse, goal: number): string { const parts = (Object.keys(SEGMENT_LABELS) as (keyof typeof SEGMENT_LABELS)[]) .filter((kind) => course.points[kind] > 0) .map((kind) => `${formatPoints(course.points[kind])} ${SEGMENT_LABELS[kind]}`); return `${course.code}: ${parts.join(', ')}; meta ${formatPoints(goal)}`; } /_* Stacked bar (sure / pending / open / lost) with the goal marker. _/ export function renderPointsBar(doc: Document, course: PlanCourse, goal: number): HTMLElement { const bar = createEl(doc, 'div', { className: 'bar' }); bar.setAttribute('role', 'img'); bar.setAttribute('aria-label', barLabel(course, goal)); for (const segment of barSegments(course.points)) { const span = createEl(doc, 'span', { className: `seg seg-${segment.kind}` }); span.style.width = `${segment.percent}%`; bar.append(span); } const marker = createEl(doc, 'span', { className: 'goal' }); marker.dataset.label = formatPoints(goal); marker.style.left = `${Math.min(100, goal)}%`; bar.append(marker); return bar; } /_* Big number and the guaranteed / maximum line. _/ export function renderNeed(doc: Document, course: PlanCourse, goal: number): HTMLElement { const p = course.points; const need = createEl(doc, 'div', { className: 'need' }); need.append( createEl(doc, 'span', { className: 'need-big num', text: formatPoints(pointsMissing(p, goal)), }), ); need.append( createEl(doc, 'span', { className: 'need-label', text: `pts faltando · garantido ${formatPoints(p.sure + p.pend)} · máx. possível ${formatPoints(p.sure + p.pend + p.open)}`, }), ); return need; } /_* List of assessments with their grade or value.
- **Input:** `doc`: document; `course`: course.
- **Output:** List of assessments with grade or value.
- **Effects:** None (pure).
- **Errors:** None.

### `renderRules`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-courses.ts`
- **Signature:** `renderRules(doc: Document, course: PlanCourse): HTMLElement`
- **Used by:** `renderCourses()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Course cards: points missing, guaranteed and maximum, stacked bar with the goal, assessments, path and rules. _/ import type { Assessment, PlanCourse, PlanData } from '../plan-schema.js'; import { barSegments, formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth } from './format.js'; import { LEVEL_LABELS } from './render-header.js'; /_* pt-BR name of each bar segment, for the accessible description. _/ export const SEGMENT_LABELS = { sure: 'garantidos', pend: 'enviados sem nota', open: 'em aberto', lost: 'perdidos ou incertos', } as const; /_* "15 / 30", "≈8 / 10" (estimated) or "— / 30" (no grade yet). _/ export function assessmentValueText(a: Assessment): string { const score = a.score === null ? '—' : `${a.estimated ? '≈' : ''}${formatPoints(a.score)}`; return `${score} / ${formatPoints(a.max)}`; } /_* Assessment name with its date and whether the student gave the grade ("Prova 3 · 09/12"). _/ export function assessmentTitleText(a: Assessment): string { const date = a.date ? ` · ${formatDayMonth(a.date)}` : ''; return `${a.title}${date}${a.informedByStudent ? ' · informado por você' : ''}`; } /_* Accessible description of the bar: every segment in points and the goal. _/ export function barLabel(course: PlanCourse, goal: number): string { const parts = (Object.keys(SEGMENT_LABELS) as (keyof typeof SEGMENT_LABELS)[]) .filter((kind) => course.points[kind] > 0) .map((kind) => `${formatPoints(course.points[kind])} ${SEGMENT_LABELS[kind]}`); return `${course.code}: ${parts.join(', ')}; meta ${formatPoints(goal)}`; } /_* Stacked bar (sure / pending / open / lost) with the goal marker. _/ export function renderPointsBar(doc: Document, course: PlanCourse, goal: number): HTMLElement { const bar = createEl(doc, 'div', { className: 'bar' }); bar.setAttribute('role', 'img'); bar.setAttribute('aria-label', barLabel(course, goal)); for (const segment of barSegments(course.points)) { const span = createEl(doc, 'span', { className: `seg seg-${segment.kind}` }); span.style.width = `${segment.percent}%`; bar.append(span); } const marker = createEl(doc, 'span', { className: 'goal' }); marker.dataset.label = formatPoints(goal); marker.style.left = `${Math.min(100, goal)}%`; bar.append(marker); return bar; } /_* Big number and the guaranteed / maximum line. _/ export function renderNeed(doc: Document, course: PlanCourse, goal: number): HTMLElement { const p = course.points; const need = createEl(doc, 'div', { className: 'need' }); need.append( createEl(doc, 'span', { className: 'need-big num', text: formatPoints(pointsMissing(p, goal)), }), ); need.append( createEl(doc, 'span', { className: 'need-label', text: `pts faltando · garantido ${formatPoints(p.sure + p.pend)} · máx. possível ${formatPoints(p.sure + p.pend + p.open)}`, }), ); return need; } /_* List of assessments with their grade or value. _/ export function renderAssessments(doc: Document, course: PlanCourse): HTMLElement { const list = createEl(doc, 'ul', { className: 'facts' }); for (const a of course.assessments) { const li = createEl(doc, 'li'); li.append(createEl(doc, 'span', { text: assessmentTitleText(a) })); li.append(createEl(doc, 'span', { className: 'num', text: assessmentValueText(a) })); list.append(li); } return list; } /_* Collapsible "Regras e avisos", each rule with its source and date.
- **Input:** `doc`: document; `course`: course.
- **Output:** Collapsible "Regras e avisos" with source and date per rule.
- **Effects:** None (pure).
- **Errors:** None.

### `renderCardHead`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-courses.ts`
- **Signature:** `renderCardHead(doc: Document, course: PlanCourse, label: string): HTMLElement`
- **Used by:** `renderCourses()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Course cards: points missing, guaranteed and maximum, stacked bar with the goal, assessments, path and rules. _/ import type { Assessment, PlanCourse, PlanData } from '../plan-schema.js'; import { barSegments, formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth } from './format.js'; import { LEVEL_LABELS } from './render-header.js'; /_* pt-BR name of each bar segment, for the accessible description. _/ export const SEGMENT_LABELS = { sure: 'garantidos', pend: 'enviados sem nota', open: 'em aberto', lost: 'perdidos ou incertos', } as const; /_* "15 / 30", "≈8 / 10" (estimated) or "— / 30" (no grade yet). _/ export function assessmentValueText(a: Assessment): string { const score = a.score === null ? '—' : `${a.estimated ? '≈' : ''}${formatPoints(a.score)}`; return `${score} / ${formatPoints(a.max)}`; } /_* Assessment name with its date and whether the student gave the grade ("Prova 3 · 09/12"). _/ export function assessmentTitleText(a: Assessment): string { const date = a.date ? ` · ${formatDayMonth(a.date)}` : ''; return `${a.title}${date}${a.informedByStudent ? ' · informado por você' : ''}`; } /_* Accessible description of the bar: every segment in points and the goal. _/ export function barLabel(course: PlanCourse, goal: number): string { const parts = (Object.keys(SEGMENT_LABELS) as (keyof typeof SEGMENT_LABELS)[]) .filter((kind) => course.points[kind] > 0) .map((kind) => `${formatPoints(course.points[kind])} ${SEGMENT_LABELS[kind]}`); return `${course.code}: ${parts.join(', ')}; meta ${formatPoints(goal)}`; } /_* Stacked bar (sure / pending / open / lost) with the goal marker. _/ export function renderPointsBar(doc: Document, course: PlanCourse, goal: number): HTMLElement { const bar = createEl(doc, 'div', { className: 'bar' }); bar.setAttribute('role', 'img'); bar.setAttribute('aria-label', barLabel(course, goal)); for (const segment of barSegments(course.points)) { const span = createEl(doc, 'span', { className: `seg seg-${segment.kind}` }); span.style.width = `${segment.percent}%`; bar.append(span); } const marker = createEl(doc, 'span', { className: 'goal' }); marker.dataset.label = formatPoints(goal); marker.style.left = `${Math.min(100, goal)}%`; bar.append(marker); return bar; } /_* Big number and the guaranteed / maximum line. _/ export function renderNeed(doc: Document, course: PlanCourse, goal: number): HTMLElement { const p = course.points; const need = createEl(doc, 'div', { className: 'need' }); need.append( createEl(doc, 'span', { className: 'need-big num', text: formatPoints(pointsMissing(p, goal)), }), ); need.append( createEl(doc, 'span', { className: 'need-label', text: `pts faltando · garantido ${formatPoints(p.sure + p.pend)} · máx. possível ${formatPoints(p.sure + p.pend + p.open)}`, }), ); return need; } /_* List of assessments with their grade or value. _/ export function renderAssessments(doc: Document, course: PlanCourse): HTMLElement { const list = createEl(doc, 'ul', { className: 'facts' }); for (const a of course.assessments) { const li = createEl(doc, 'li'); li.append(createEl(doc, 'span', { text: assessmentTitleText(a) })); li.append(createEl(doc, 'span', { className: 'num', text: assessmentValueText(a) })); list.append(li); } return list; } /_* Collapsible "Regras e avisos", each rule with its source and date. _/ export function renderRules(doc: Document, course: PlanCourse): HTMLElement { const details = createEl(doc, 'details', { className: 'rules' }); details.append(createEl(doc, 'summary', { text: `Regras e avisos (${course.rules.length})` })); const list = createEl(doc, 'ul'); for (const rule of course.rules) { const li = createRichEl(doc, 'li', rule.text); li.append( createEl(doc, 'span', { className: 'rule-source', text: ` — ${rule.source}, ${formatDayMonth(rule.date)}`, }), ); list.append(li); } details.append(list); return details; } /_* Card head: code, name, instructor and level pill.
- **Input:** `doc`: document; `course`: course; `label`: level label.
- **Output:** Card head: code, name, instructor and level pill.
- **Effects:** None (pure).
- **Errors:** None.

### `renderCourses`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-courses.ts`
- **Signature:** `renderCourses(doc: Document, plan: PlanData): void`
- **Used by:** `renderPlanSections()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Course cards: points missing, guaranteed and maximum, stacked bar with the goal, assessments, path and rules. _/ import type { Assessment, PlanCourse, PlanData } from '../plan-schema.js'; import { barSegments, formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth } from './format.js'; import { LEVEL_LABELS } from './render-header.js'; /_* pt-BR name of each bar segment, for the accessible description. _/ export const SEGMENT_LABELS = { sure: 'garantidos', pend: 'enviados sem nota', open: 'em aberto', lost: 'perdidos ou incertos', } as const; /_* "15 / 30", "≈8 / 10" (estimated) or "— / 30" (no grade yet). _/ export function assessmentValueText(a: Assessment): string { const score = a.score === null ? '—' : `${a.estimated ? '≈' : ''}${formatPoints(a.score)}`; return `${score} / ${formatPoints(a.max)}`; } /_* Assessment name with its date and whether the student gave the grade ("Prova 3 · 09/12"). _/ export function assessmentTitleText(a: Assessment): string { const date = a.date ? ` · ${formatDayMonth(a.date)}` : ''; return `${a.title}${date}${a.informedByStudent ? ' · informado por você' : ''}`; } /_* Accessible description of the bar: every segment in points and the goal. _/ export function barLabel(course: PlanCourse, goal: number): string { const parts = (Object.keys(SEGMENT_LABELS) as (keyof typeof SEGMENT_LABELS)[]) .filter((kind) => course.points[kind] > 0) .map((kind) => `${formatPoints(course.points[kind])} ${SEGMENT_LABELS[kind]}`); return `${course.code}: ${parts.join(', ')}; meta ${formatPoints(goal)}`; } /_* Stacked bar (sure / pending / open / lost) with the goal marker. _/ export function renderPointsBar(doc: Document, course: PlanCourse, goal: number): HTMLElement { const bar = createEl(doc, 'div', { className: 'bar' }); bar.setAttribute('role', 'img'); bar.setAttribute('aria-label', barLabel(course, goal)); for (const segment of barSegments(course.points)) { const span = createEl(doc, 'span', { className: `seg seg-${segment.kind}` }); span.style.width = `${segment.percent}%`; bar.append(span); } const marker = createEl(doc, 'span', { className: 'goal' }); marker.dataset.label = formatPoints(goal); marker.style.left = `${Math.min(100, goal)}%`; bar.append(marker); return bar; } /_* Big number and the guaranteed / maximum line. _/ export function renderNeed(doc: Document, course: PlanCourse, goal: number): HTMLElement { const p = course.points; const need = createEl(doc, 'div', { className: 'need' }); need.append( createEl(doc, 'span', { className: 'need-big num', text: formatPoints(pointsMissing(p, goal)), }), ); need.append( createEl(doc, 'span', { className: 'need-label', text: `pts faltando · garantido ${formatPoints(p.sure + p.pend)} · máx. possível ${formatPoints(p.sure + p.pend + p.open)}`, }), ); return need; } /_* List of assessments with their grade or value. _/ export function renderAssessments(doc: Document, course: PlanCourse): HTMLElement { const list = createEl(doc, 'ul', { className: 'facts' }); for (const a of course.assessments) { const li = createEl(doc, 'li'); li.append(createEl(doc, 'span', { text: assessmentTitleText(a) })); li.append(createEl(doc, 'span', { className: 'num', text: assessmentValueText(a) })); list.append(li); } return list; } /_* Collapsible "Regras e avisos", each rule with its source and date. _/ export function renderRules(doc: Document, course: PlanCourse): HTMLElement { const details = createEl(doc, 'details', { className: 'rules' }); details.append(createEl(doc, 'summary', { text: `Regras e avisos (${course.rules.length})` })); const list = createEl(doc, 'ul'); for (const rule of course.rules) { const li = createRichEl(doc, 'li', rule.text); li.append( createEl(doc, 'span', { className: 'rule-source', text: ` — ${rule.source}, ${formatDayMonth(rule.date)}`, }), ); list.append(li); } details.append(list); return details; } /_* Card head: code, name, instructor and level pill. _/ export function renderCardHead(doc: Document, course: PlanCourse, label: string): HTMLElement { const head = createEl(doc, 'div', { className: 'card-head' }); const names = createEl(doc, 'div'); names.append(createEl(doc, 'h3', { text: course.code })); const teacher = course.teacher ? ` · ${course.teacher}` : ''; names.append(createEl(doc, 'p', { className: 'card-name', text: `${course.name}${teacher}` })); head.append(names, createEl(doc, 'span', { className: 'pill', text: label })); return head; } /_* Fills the course cards.
- **Input:** `doc`: page; `plan`: plan.
- **Output:** Nothing.
- **Effects:** Fills `#course-list` with one card per course.
- **Errors:** `requireEl` errors propagate.

## `connectors/canvas-puc/src/plan/page/render-days.ts`

### `dayRowClass`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-days.ts`
- **Signature:** `dayRowClass(date: string, today: string, conflict: boolean): string`
- **Used by:** `renderDayRow()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** "Hoje e amanhã" blocks, the day-by-day study plan, the timeline and the questions for instructors. _/ import type { ItemStatus, PlanData, RiskLevel, StudyDay, TimelineDay, TimelineItem, } from '../plan-schema.js'; import type { CheckStore } from './checks.js'; import { registerCheck } from './checks.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth, weekdayOf } from './format.js'; import { courseLevels, levelClass } from './render-header.js'; export interface ChecklistEntry { readonly id: string; readonly course: string; readonly title: string; readonly time?: string | undefined; readonly meta?: string | undefined; readonly optional?: boolean | undefined; readonly status: ItemStatus; } export interface DayContext { readonly doc: Document; readonly today: string; readonly levels: ReadonlyMap<string, RiskLevel>; readonly store: CheckStore; } /_* Classes of a day row: past days faded, today highlighted, conflict days in red.
- **Input:** `date`: day; `today`: today; `conflict`: whether the day has a clash.
- **Output:** `day` plus `past`, `now` and/or `clash`.
- **Effects:** None (pure).
- **Errors:** None.

### `progressText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-days.ts`
- **Signature:** `progressText(boxes: readonly HTMLInputElement[], verb: string): string`
- **Used by:** `updateCounters()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** "Hoje e amanhã" blocks, the day-by-day study plan, the timeline and the questions for instructors. _/ import type { ItemStatus, PlanData, RiskLevel, StudyDay, TimelineDay, TimelineItem, } from '../plan-schema.js'; import type { CheckStore } from './checks.js'; import { registerCheck } from './checks.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth, weekdayOf } from './format.js'; import { courseLevels, levelClass } from './render-header.js'; export interface ChecklistEntry { readonly id: string; readonly course: string; readonly title: string; readonly time?: string | undefined; readonly meta?: string | undefined; readonly optional?: boolean | undefined; readonly status: ItemStatus; } export interface DayContext { readonly doc: Document; readonly today: string; readonly levels: ReadonlyMap<string, RiskLevel>; readonly store: CheckStore; } /_* Classes of a day row: past days faded, today highlighted, conflict days in red. _/ export function dayRowClass(date: string, today: string, conflict: boolean): string { let when = ''; if (date < today) when = ' past'; else if (date === today) when = ' now'; return `day${when}${conflict ? ' clash' : ''}`; } /_* "X de Y feitos": checked items among those not dropped.
- **Input:** `boxes`: checkboxes; `verb`: `feitos`/`concluídos`.
- **Output:** `X de Y <verb>` over the enabled boxes.
- **Effects:** None (pure).
- **Errors:** None.

### `renderChecklistItem`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-days.ts`
- **Signature:** `renderChecklistItem(ctx: DayContext, entry: ChecklistEntry, parent: HTMLElement): HTMLInputElement`
- **Used by:** `renderStudy()`, `renderTimeline()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** "Hoje e amanhã" blocks, the day-by-day study plan, the timeline and the questions for instructors. _/ import type { ItemStatus, PlanData, RiskLevel, StudyDay, TimelineDay, TimelineItem, } from '../plan-schema.js'; import type { CheckStore } from './checks.js'; import { registerCheck } from './checks.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth, weekdayOf } from './format.js'; import { courseLevels, levelClass } from './render-header.js'; export interface ChecklistEntry { readonly id: string; readonly course: string; readonly title: string; readonly time?: string | undefined; readonly meta?: string | undefined; readonly optional?: boolean | undefined; readonly status: ItemStatus; } export interface DayContext { readonly doc: Document; readonly today: string; readonly levels: ReadonlyMap<string, RiskLevel>; readonly store: CheckStore; } /_* Classes of a day row: past days faded, today highlighted, conflict days in red. _/ export function dayRowClass(date: string, today: string, conflict: boolean): string { let when = ''; if (date < today) when = ' past'; else if (date === today) when = ' now'; return `day${when}${conflict ? ' clash' : ''}`; } /_* "X de Y feitos": checked items among those not dropped. _/ export function progressText(boxes: readonly HTMLInputElement[], verb: string): string { const live = boxes.filter((box) => !box.disabled); return `${live.filter((box) => box.checked).length} de ${live.length} ${verb}`; } /_* Appends one checklist row (checkbox, course tag, title, time and points or duration) to a day.
- **Input:** `ctx`: day context; `entry`: item; `parent`: day items container.
- **Output:** The checkbox.
- **Effects:** Appends the row and registers it in the check store.
- **Errors:** None.

### `renderDayRow`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-days.ts`
- **Signature:** `renderDayRow(ctx: DayContext, date: string | null, conflict?: string): [HTMLElement, HTMLElement]`
- **Used by:** `renderStudy()`, `renderTimeline()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** "Hoje e amanhã" blocks, the day-by-day study plan, the timeline and the questions for instructors. _/ import type { ItemStatus, PlanData, RiskLevel, StudyDay, TimelineDay, TimelineItem, } from '../plan-schema.js'; import type { CheckStore } from './checks.js'; import { registerCheck } from './checks.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth, weekdayOf } from './format.js'; import { courseLevels, levelClass } from './render-header.js'; export interface ChecklistEntry { readonly id: string; readonly course: string; readonly title: string; readonly time?: string | undefined; readonly meta?: string | undefined; readonly optional?: boolean | undefined; readonly status: ItemStatus; } export interface DayContext { readonly doc: Document; readonly today: string; readonly levels: ReadonlyMap<string, RiskLevel>; readonly store: CheckStore; } /_* Classes of a day row: past days faded, today highlighted, conflict days in red. _/ export function dayRowClass(date: string, today: string, conflict: boolean): string { let when = ''; if (date < today) when = ' past'; else if (date === today) when = ' now'; return `day${when}${conflict ? ' clash' : ''}`; } /_* "X de Y feitos": checked items among those not dropped. _/ export function progressText(boxes: readonly HTMLInputElement[], verb: string): string { const live = boxes.filter((box) => !box.disabled); return `${live.filter((box) => box.checked).length} de ${live.length} ${verb}`; } /_* Appends one checklist row (checkbox, course tag, title, time and points or duration) to a day. _/ export function renderChecklistItem( ctx: DayContext, entry: ChecklistEntry, parent: HTMLElement, ): HTMLInputElement { const { doc } = ctx; const dropped = entry.status === 'dropped'; const row = createEl(doc, 'div', { className: `item ${levelClass(ctx.levels, entry.course)}${entry.optional ? ' optional' : ''}${dropped ? ' dropped' : ''}`, }); const box = createEl(doc, 'input'); box.type = 'checkbox'; box.id = `chk-${entry.id}`; box.disabled = dropped; const label = createEl(doc, 'label', { text: dropped ? `${entry.title} (cancelado)` : entry.title, }); label.htmlFor = box.id; if (entry.time) label.append(createEl(doc, 'span', { className: 'time', text: entry.time })); row.append(box, createEl(doc, 'span', { className: 'tag', text: entry.course }), label); row.append(createEl(doc, 'span', { className: 'meta', text: entry.meta ?? '' })); registerCheck(ctx.store, { id: entry.id, def: entry.status === 'done' }, { box, row }); parent.append(row); return box; } /_* Day row with its date column; returns the row and its items container.
- **Input:** `ctx`: day context; `date`: day or `null` (undated); `conflict`: optional note.
- **Output:** `[row, items container]`.
- **Effects:** None (pure).
- **Errors:** None.

### `renderStudy`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-days.ts`
- **Signature:** `renderStudy(ctx: DayContext, days: readonly StudyDay[]): HTMLInputElement[]`
- **Used by:** `renderPlanSections()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** "Hoje e amanhã" blocks, the day-by-day study plan, the timeline and the questions for instructors. _/ import type { ItemStatus, PlanData, RiskLevel, StudyDay, TimelineDay, TimelineItem, } from '../plan-schema.js'; import type { CheckStore } from './checks.js'; import { registerCheck } from './checks.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth, weekdayOf } from './format.js'; import { courseLevels, levelClass } from './render-header.js'; export interface ChecklistEntry { readonly id: string; readonly course: string; readonly title: string; readonly time?: string | undefined; readonly meta?: string | undefined; readonly optional?: boolean | undefined; readonly status: ItemStatus; } export interface DayContext { readonly doc: Document; readonly today: string; readonly levels: ReadonlyMap<string, RiskLevel>; readonly store: CheckStore; } /_* Classes of a day row: past days faded, today highlighted, conflict days in red. _/ export function dayRowClass(date: string, today: string, conflict: boolean): string { let when = ''; if (date < today) when = ' past'; else if (date === today) when = ' now'; return `day${when}${conflict ? ' clash' : ''}`; } /_* "X de Y feitos": checked items among those not dropped. _/ export function progressText(boxes: readonly HTMLInputElement[], verb: string): string { const live = boxes.filter((box) => !box.disabled); return `${live.filter((box) => box.checked).length} de ${live.length} ${verb}`; } /_* Appends one checklist row (checkbox, course tag, title, time and points or duration) to a day. _/ export function renderChecklistItem( ctx: DayContext, entry: ChecklistEntry, parent: HTMLElement, ): HTMLInputElement { const { doc } = ctx; const dropped = entry.status === 'dropped'; const row = createEl(doc, 'div', { className: `item ${levelClass(ctx.levels, entry.course)}${entry.optional ? ' optional' : ''}${dropped ? ' dropped' : ''}`, }); const box = createEl(doc, 'input'); box.type = 'checkbox'; box.id = `chk-${entry.id}`; box.disabled = dropped; const label = createEl(doc, 'label', { text: dropped ? `${entry.title} (cancelado)` : entry.title, }); label.htmlFor = box.id; if (entry.time) label.append(createEl(doc, 'span', { className: 'time', text: entry.time })); row.append(box, createEl(doc, 'span', { className: 'tag', text: entry.course }), label); row.append(createEl(doc, 'span', { className: 'meta', text: entry.meta ?? '' })); registerCheck(ctx.store, { id: entry.id, def: entry.status === 'done' }, { box, row }); parent.append(row); return box; } /_* Day row with its date column; returns the row and its items container. _/ export function renderDayRow( ctx: DayContext, date: string | null, conflict?: string, ): [HTMLElement, HTMLElement] { const { doc } = ctx; const row = createEl(doc, 'div', { className: date ? dayRowClass(date, ctx.today, conflict !== undefined) : 'day undated', }); const when = createEl(doc, 'div', { className: 'date' }); when.append(createEl(doc, 'b', { text: date ? formatDayMonth(date) : '?' })); when.append(doc.createTextNode(date ? weekdayOf(date) : 'sem data')); const items = createEl(doc, 'div', { className: 'items' }); if (conflict) items.append(createEl(doc, 'p', { className: 'clash-note', text: conflict })); row.append(when, items); return [row, items]; } /_* The day-by-day study plan with its "X de Y feitos" counter.
- **Input:** `ctx`: day context; `days`: study days.
- **Output:** The study checkboxes.
- **Effects:** Fills `#study-list`.
- **Errors:** `requireEl` errors propagate.

### `timelineEntry`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-days.ts`
- **Signature:** `timelineEntry(item: TimelineItem): ChecklistEntry`
- **Used by:** `renderTimeline()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** "Hoje e amanhã" blocks, the day-by-day study plan, the timeline and the questions for instructors. _/ import type { ItemStatus, PlanData, RiskLevel, StudyDay, TimelineDay, TimelineItem, } from '../plan-schema.js'; import type { CheckStore } from './checks.js'; import { registerCheck } from './checks.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth, weekdayOf } from './format.js'; import { courseLevels, levelClass } from './render-header.js'; export interface ChecklistEntry { readonly id: string; readonly course: string; readonly title: string; readonly time?: string | undefined; readonly meta?: string | undefined; readonly optional?: boolean | undefined; readonly status: ItemStatus; } export interface DayContext { readonly doc: Document; readonly today: string; readonly levels: ReadonlyMap<string, RiskLevel>; readonly store: CheckStore; } /_* Classes of a day row: past days faded, today highlighted, conflict days in red. _/ export function dayRowClass(date: string, today: string, conflict: boolean): string { let when = ''; if (date < today) when = ' past'; else if (date === today) when = ' now'; return `day${when}${conflict ? ' clash' : ''}`; } /_* "X de Y feitos": checked items among those not dropped. _/ export function progressText(boxes: readonly HTMLInputElement[], verb: string): string { const live = boxes.filter((box) => !box.disabled); return `${live.filter((box) => box.checked).length} de ${live.length} ${verb}`; } /_* Appends one checklist row (checkbox, course tag, title, time and points or duration) to a day. _/ export function renderChecklistItem( ctx: DayContext, entry: ChecklistEntry, parent: HTMLElement, ): HTMLInputElement { const { doc } = ctx; const dropped = entry.status === 'dropped'; const row = createEl(doc, 'div', { className: `item ${levelClass(ctx.levels, entry.course)}${entry.optional ? ' optional' : ''}${dropped ? ' dropped' : ''}`, }); const box = createEl(doc, 'input'); box.type = 'checkbox'; box.id = `chk-${entry.id}`; box.disabled = dropped; const label = createEl(doc, 'label', { text: dropped ? `${entry.title} (cancelado)` : entry.title, }); label.htmlFor = box.id; if (entry.time) label.append(createEl(doc, 'span', { className: 'time', text: entry.time })); row.append(box, createEl(doc, 'span', { className: 'tag', text: entry.course }), label); row.append(createEl(doc, 'span', { className: 'meta', text: entry.meta ?? '' })); registerCheck(ctx.store, { id: entry.id, def: entry.status === 'done' }, { box, row }); parent.append(row); return box; } /_* Day row with its date column; returns the row and its items container. _/ export function renderDayRow( ctx: DayContext, date: string | null, conflict?: string, ): [HTMLElement, HTMLElement] { const { doc } = ctx; const row = createEl(doc, 'div', { className: date ? dayRowClass(date, ctx.today, conflict !== undefined) : 'day undated', }); const when = createEl(doc, 'div', { className: 'date' }); when.append(createEl(doc, 'b', { text: date ? formatDayMonth(date) : '?' })); when.append(doc.createTextNode(date ? weekdayOf(date) : 'sem data')); const items = createEl(doc, 'div', { className: 'items' }); if (conflict) items.append(createEl(doc, 'p', { className: 'clash-note', text: conflict })); row.append(when, items); return [row, items]; } /_* The day-by-day study plan with its "X de Y feitos" counter. _/ export function renderStudy(ctx: DayContext, days: readonly StudyDay[]): HTMLInputElement[] { const list = requireEl(ctx.doc, 'study-list'); const boxes: HTMLInputElement[] = []; for (const day of days) { const [row, items] = renderDayRow(ctx, day.date); items.append(createEl(ctx.doc, 'p', { className: 'focus', text: day.focus })); for (const item of day.items) { const entry = { ...item, id: item.id ?? '', title: item.task, meta: item.duration }; boxes.push(renderChecklistItem(ctx, entry, items)); } list.append(row); } return boxes; } /_* Timeline entry of a deadline or exam.
- **Input:** `item`: timeline item.
- **Output:** Checklist entry with the points as meta.
- **Effects:** None (pure).
- **Errors:** None.

### `renderTimeline`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-days.ts`
- **Signature:** `renderTimeline(ctx: DayContext, days: readonly TimelineDay[], undated: readonly TimelineItem[]): HTMLInputElement[]`
- **Used by:** `renderPlanSections()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** "Hoje e amanhã" blocks, the day-by-day study plan, the timeline and the questions for instructors. _/ import type { ItemStatus, PlanData, RiskLevel, StudyDay, TimelineDay, TimelineItem, } from '../plan-schema.js'; import type { CheckStore } from './checks.js'; import { registerCheck } from './checks.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth, weekdayOf } from './format.js'; import { courseLevels, levelClass } from './render-header.js'; export interface ChecklistEntry { readonly id: string; readonly course: string; readonly title: string; readonly time?: string | undefined; readonly meta?: string | undefined; readonly optional?: boolean | undefined; readonly status: ItemStatus; } export interface DayContext { readonly doc: Document; readonly today: string; readonly levels: ReadonlyMap<string, RiskLevel>; readonly store: CheckStore; } /_* Classes of a day row: past days faded, today highlighted, conflict days in red. _/ export function dayRowClass(date: string, today: string, conflict: boolean): string { let when = ''; if (date < today) when = ' past'; else if (date === today) when = ' now'; return `day${when}${conflict ? ' clash' : ''}`; } /_* "X de Y feitos": checked items among those not dropped. _/ export function progressText(boxes: readonly HTMLInputElement[], verb: string): string { const live = boxes.filter((box) => !box.disabled); return `${live.filter((box) => box.checked).length} de ${live.length} ${verb}`; } /_* Appends one checklist row (checkbox, course tag, title, time and points or duration) to a day. _/ export function renderChecklistItem( ctx: DayContext, entry: ChecklistEntry, parent: HTMLElement, ): HTMLInputElement { const { doc } = ctx; const dropped = entry.status === 'dropped'; const row = createEl(doc, 'div', { className: `item ${levelClass(ctx.levels, entry.course)}${entry.optional ? ' optional' : ''}${dropped ? ' dropped' : ''}`, }); const box = createEl(doc, 'input'); box.type = 'checkbox'; box.id = `chk-${entry.id}`; box.disabled = dropped; const label = createEl(doc, 'label', { text: dropped ? `${entry.title} (cancelado)` : entry.title, }); label.htmlFor = box.id; if (entry.time) label.append(createEl(doc, 'span', { className: 'time', text: entry.time })); row.append(box, createEl(doc, 'span', { className: 'tag', text: entry.course }), label); row.append(createEl(doc, 'span', { className: 'meta', text: entry.meta ?? '' })); registerCheck(ctx.store, { id: entry.id, def: entry.status === 'done' }, { box, row }); parent.append(row); return box; } /_* Day row with its date column; returns the row and its items container. _/ export function renderDayRow( ctx: DayContext, date: string | null, conflict?: string, ): [HTMLElement, HTMLElement] { const { doc } = ctx; const row = createEl(doc, 'div', { className: date ? dayRowClass(date, ctx.today, conflict !== undefined) : 'day undated', }); const when = createEl(doc, 'div', { className: 'date' }); when.append(createEl(doc, 'b', { text: date ? formatDayMonth(date) : '?' })); when.append(doc.createTextNode(date ? weekdayOf(date) : 'sem data')); const items = createEl(doc, 'div', { className: 'items' }); if (conflict) items.append(createEl(doc, 'p', { className: 'clash-note', text: conflict })); row.append(when, items); return [row, items]; } /_* The day-by-day study plan with its "X de Y feitos" counter. _/ export function renderStudy(ctx: DayContext, days: readonly StudyDay[]): HTMLInputElement[] { const list = requireEl(ctx.doc, 'study-list'); const boxes: HTMLInputElement[] = []; for (const day of days) { const [row, items] = renderDayRow(ctx, day.date); items.append(createEl(ctx.doc, 'p', { className: 'focus', text: day.focus })); for (const item of day.items) { const entry = { ...item, id: item.id ?? '', title: item.task, meta: item.duration }; boxes.push(renderChecklistItem(ctx, entry, items)); } list.append(row); } return boxes; } /_* Timeline entry of a deadline or exam. _/ export function timelineEntry(item: TimelineItem): ChecklistEntry { return { ...item, id: item.id ?? '', meta: item.points }; } /_* The timeline (dated days, then the "sem data" block).
- **Input:** `ctx`: day context; `days`: timeline days; `undated`: items without date.
- **Output:** The timeline checkboxes.
- **Effects:** Fills `#timeline-list` (and the "sem data" block).
- **Errors:** `requireEl` errors propagate.

### `renderToday`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-days.ts`
- **Signature:** `renderToday(doc: Document, plan: PlanData): void`
- **Used by:** `renderPlanSections()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** "Hoje e amanhã" blocks, the day-by-day study plan, the timeline and the questions for instructors. _/ import type { ItemStatus, PlanData, RiskLevel, StudyDay, TimelineDay, TimelineItem, } from '../plan-schema.js'; import type { CheckStore } from './checks.js'; import { registerCheck } from './checks.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth, weekdayOf } from './format.js'; import { courseLevels, levelClass } from './render-header.js'; export interface ChecklistEntry { readonly id: string; readonly course: string; readonly title: string; readonly time?: string | undefined; readonly meta?: string | undefined; readonly optional?: boolean | undefined; readonly status: ItemStatus; } export interface DayContext { readonly doc: Document; readonly today: string; readonly levels: ReadonlyMap<string, RiskLevel>; readonly store: CheckStore; } /_* Classes of a day row: past days faded, today highlighted, conflict days in red. _/ export function dayRowClass(date: string, today: string, conflict: boolean): string { let when = ''; if (date < today) when = ' past'; else if (date === today) when = ' now'; return `day${when}${conflict ? ' clash' : ''}`; } /_* "X de Y feitos": checked items among those not dropped. _/ export function progressText(boxes: readonly HTMLInputElement[], verb: string): string { const live = boxes.filter((box) => !box.disabled); return `${live.filter((box) => box.checked).length} de ${live.length} ${verb}`; } /_* Appends one checklist row (checkbox, course tag, title, time and points or duration) to a day. _/ export function renderChecklistItem( ctx: DayContext, entry: ChecklistEntry, parent: HTMLElement, ): HTMLInputElement { const { doc } = ctx; const dropped = entry.status === 'dropped'; const row = createEl(doc, 'div', { className: `item ${levelClass(ctx.levels, entry.course)}${entry.optional ? ' optional' : ''}${dropped ? ' dropped' : ''}`, }); const box = createEl(doc, 'input'); box.type = 'checkbox'; box.id = `chk-${entry.id}`; box.disabled = dropped; const label = createEl(doc, 'label', { text: dropped ? `${entry.title} (cancelado)` : entry.title, }); label.htmlFor = box.id; if (entry.time) label.append(createEl(doc, 'span', { className: 'time', text: entry.time })); row.append(box, createEl(doc, 'span', { className: 'tag', text: entry.course }), label); row.append(createEl(doc, 'span', { className: 'meta', text: entry.meta ?? '' })); registerCheck(ctx.store, { id: entry.id, def: entry.status === 'done' }, { box, row }); parent.append(row); return box; } /_* Day row with its date column; returns the row and its items container. _/ export function renderDayRow( ctx: DayContext, date: string | null, conflict?: string, ): [HTMLElement, HTMLElement] { const { doc } = ctx; const row = createEl(doc, 'div', { className: date ? dayRowClass(date, ctx.today, conflict !== undefined) : 'day undated', }); const when = createEl(doc, 'div', { className: 'date' }); when.append(createEl(doc, 'b', { text: date ? formatDayMonth(date) : '?' })); when.append(doc.createTextNode(date ? weekdayOf(date) : 'sem data')); const items = createEl(doc, 'div', { className: 'items' }); if (conflict) items.append(createEl(doc, 'p', { className: 'clash-note', text: conflict })); row.append(when, items); return [row, items]; } /_* The day-by-day study plan with its "X de Y feitos" counter. _/ export function renderStudy(ctx: DayContext, days: readonly StudyDay[]): HTMLInputElement[] { const list = requireEl(ctx.doc, 'study-list'); const boxes: HTMLInputElement[] = []; for (const day of days) { const [row, items] = renderDayRow(ctx, day.date); items.append(createEl(ctx.doc, 'p', { className: 'focus', text: day.focus })); for (const item of day.items) { const entry = { ...item, id: item.id ?? '', title: item.task, meta: item.duration }; boxes.push(renderChecklistItem(ctx, entry, items)); } list.append(row); } return boxes; } /_* Timeline entry of a deadline or exam. _/ export function timelineEntry(item: TimelineItem): ChecklistEntry { return { ...item, id: item.id ?? '', meta: item.points }; } /_* The timeline (dated days, then the "sem data" block). _/ export function renderTimeline( ctx: DayContext, days: readonly TimelineDay[], undated: readonly TimelineItem[], ): HTMLInputElement[] { const list = requireEl(ctx.doc, 'timeline-list'); const boxes: HTMLInputElement[] = []; for (const day of days) { const [row, items] = renderDayRow(ctx, day.date, day.conflict); for (const item of day.items) boxes.push(renderChecklistItem(ctx, timelineEntry(item), items)); list.append(row); } if (undated.length > 0) { const [row, items] = renderDayRow(ctx, null); list.append(row); for (const item of undated) boxes.push(renderChecklistItem(ctx, timelineEntry(item), items)); } return boxes; } /_* The "Hoje e amanhã" window and its blocks (critical ones highlighted, steps numbered).
- **Input:** `doc`: page; `plan`: plan.
- **Output:** Nothing.
- **Effects:** Fills the "Hoje e amanhã" range and blocks (or the empty state).
- **Errors:** `requireEl` errors propagate.

### `renderQuestions`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-days.ts`
- **Signature:** `renderQuestions(doc: Document, plan: PlanData): void`
- **Used by:** `renderPlanSections()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** "Hoje e amanhã" blocks, the day-by-day study plan, the timeline and the questions for instructors. _/ import type { ItemStatus, PlanData, RiskLevel, StudyDay, TimelineDay, TimelineItem, } from '../plan-schema.js'; import type { CheckStore } from './checks.js'; import { registerCheck } from './checks.js'; import { createEl, createRichEl, requireEl } from './dom.js'; import { formatDayMonth, weekdayOf } from './format.js'; import { courseLevels, levelClass } from './render-header.js'; export interface ChecklistEntry { readonly id: string; readonly course: string; readonly title: string; readonly time?: string | undefined; readonly meta?: string | undefined; readonly optional?: boolean | undefined; readonly status: ItemStatus; } export interface DayContext { readonly doc: Document; readonly today: string; readonly levels: ReadonlyMap<string, RiskLevel>; readonly store: CheckStore; } /_* Classes of a day row: past days faded, today highlighted, conflict days in red. _/ export function dayRowClass(date: string, today: string, conflict: boolean): string { let when = ''; if (date < today) when = ' past'; else if (date === today) when = ' now'; return `day${when}${conflict ? ' clash' : ''}`; } /_* "X de Y feitos": checked items among those not dropped. _/ export function progressText(boxes: readonly HTMLInputElement[], verb: string): string { const live = boxes.filter((box) => !box.disabled); return `${live.filter((box) => box.checked).length} de ${live.length} ${verb}`; } /_* Appends one checklist row (checkbox, course tag, title, time and points or duration) to a day. _/ export function renderChecklistItem( ctx: DayContext, entry: ChecklistEntry, parent: HTMLElement, ): HTMLInputElement { const { doc } = ctx; const dropped = entry.status === 'dropped'; const row = createEl(doc, 'div', { className: `item ${levelClass(ctx.levels, entry.course)}${entry.optional ? ' optional' : ''}${dropped ? ' dropped' : ''}`, }); const box = createEl(doc, 'input'); box.type = 'checkbox'; box.id = `chk-${entry.id}`; box.disabled = dropped; const label = createEl(doc, 'label', { text: dropped ? `${entry.title} (cancelado)` : entry.title, }); label.htmlFor = box.id; if (entry.time) label.append(createEl(doc, 'span', { className: 'time', text: entry.time })); row.append(box, createEl(doc, 'span', { className: 'tag', text: entry.course }), label); row.append(createEl(doc, 'span', { className: 'meta', text: entry.meta ?? '' })); registerCheck(ctx.store, { id: entry.id, def: entry.status === 'done' }, { box, row }); parent.append(row); return box; } /_* Day row with its date column; returns the row and its items container. _/ export function renderDayRow( ctx: DayContext, date: string | null, conflict?: string, ): [HTMLElement, HTMLElement] { const { doc } = ctx; const row = createEl(doc, 'div', { className: date ? dayRowClass(date, ctx.today, conflict !== undefined) : 'day undated', }); const when = createEl(doc, 'div', { className: 'date' }); when.append(createEl(doc, 'b', { text: date ? formatDayMonth(date) : '?' })); when.append(doc.createTextNode(date ? weekdayOf(date) : 'sem data')); const items = createEl(doc, 'div', { className: 'items' }); if (conflict) items.append(createEl(doc, 'p', { className: 'clash-note', text: conflict })); row.append(when, items); return [row, items]; } /_* The day-by-day study plan with its "X de Y feitos" counter. _/ export function renderStudy(ctx: DayContext, days: readonly StudyDay[]): HTMLInputElement[] { const list = requireEl(ctx.doc, 'study-list'); const boxes: HTMLInputElement[] = []; for (const day of days) { const [row, items] = renderDayRow(ctx, day.date); items.append(createEl(ctx.doc, 'p', { className: 'focus', text: day.focus })); for (const item of day.items) { const entry = { ...item, id: item.id ?? '', title: item.task, meta: item.duration }; boxes.push(renderChecklistItem(ctx, entry, items)); } list.append(row); } return boxes; } /_* Timeline entry of a deadline or exam. _/ export function timelineEntry(item: TimelineItem): ChecklistEntry { return { ...item, id: item.id ?? '', meta: item.points }; } /_* The timeline (dated days, then the "sem data" block). _/ export function renderTimeline( ctx: DayContext, days: readonly TimelineDay[], undated: readonly TimelineItem[], ): HTMLInputElement[] { const list = requireEl(ctx.doc, 'timeline-list'); const boxes: HTMLInputElement[] = []; for (const day of days) { const [row, items] = renderDayRow(ctx, day.date, day.conflict); for (const item of day.items) boxes.push(renderChecklistItem(ctx, timelineEntry(item), items)); list.append(row); } if (undated.length > 0) { const [row, items] = renderDayRow(ctx, null); list.append(row); for (const item of undated) boxes.push(renderChecklistItem(ctx, timelineEntry(item), items)); } return boxes; } /_* The "Hoje e amanhã" window and its blocks (critical ones highlighted, steps numbered). _/ export function renderToday(doc: Document, plan: PlanData): void { const { from, to, blocks } = plan.focus; const range = from === to ? '' : ` → ${weekdayOf(to)} ${formatDayMonth(to)}`; requireEl(doc, 'today-range').textContent = `${weekdayOf(from)} ${formatDayMonth(from)}${range}`; const grid = requireEl(doc, 'today-list'); for (const block of blocks) { const slot = createEl(doc, 'div', { className: `slot${block.critical ? ' critical' : ''}` }); slot.append(createEl(doc, 'span', { className: 'when', text: block.label })); slot.append(createEl(doc, 'h3', { text: block.title })); if (block.text) slot.append(createRichEl(doc, 'p', block.text)); if (block.steps.length > 0) { const steps = createEl(doc, 'ol'); for (const step of block.steps) steps.append(createRichEl(doc, 'li', step)); slot.append(steps); } grid.append(slot); } if (blocks.length === 0) grid.append( createEl(doc, 'p', { className: 'empty', text: 'Nada vence nem tem prova nesses dias.' }), ); } /_* Questions for instructors, the sent ones marked as waiting for an answer.
- **Input:** `doc`: page; `plan`: plan.
- **Output:** Nothing.
- **Effects:** Fills `#question-list` (or the empty state).
- **Errors:** `requireEl` errors propagate.

## `connectors/canvas-puc/src/plan/page/render-header.ts`

### `courseGoal`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-header.ts`
- **Signature:** `courseGoal(plan: PlanData, code: string): number`
- **Used by:** —
- **Processes:** —

<!-- generated:end -->

- **Does:** Header (title, situation, sources, goal and assumptions), risk chips and footer of the plan page. _/ import type { PlanData, RiskLevel } from '../plan-schema.js'; import { planTitle } from '../plan-embed.js'; import { formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { appendRichText, createEl, requireEl } from './dom.js'; import { formatStamp } from './format.js'; /_* pt-BR label of each risk level. _/ export const LEVEL_LABELS: Record<RiskLevel, string> = { high: 'Risco alto', warn: 'Atenção', ok: 'Tranquila', }; /_* pt-BR heading of each assumption kind, in display order. _/ export const ASSUMPTION_LABELS = { informed: 'Informado por você', estimate: 'Estimativas usadas', change: 'Mudanças recentes de data', } as const; /_* Goal of a course: its own (from the syllabus) or the plan's.
- **Input:** `plan`: plan; `code`: course code.
- **Output:** The course goal, else the plan goal.
- **Effects:** None (pure).
- **Errors:** None.

### `courseLevels`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-header.ts`
- **Signature:** `courseLevels(plan: PlanData): Map<string, RiskLevel>`
- **Used by:** `bootPlanPage()`, `renderQuestions()`, `renderRiskChips()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Header (title, situation, sources, goal and assumptions), risk chips and footer of the plan page. _/ import type { PlanData, RiskLevel } from '../plan-schema.js'; import { planTitle } from '../plan-embed.js'; import { formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { appendRichText, createEl, requireEl } from './dom.js'; import { formatStamp } from './format.js'; /_* pt-BR label of each risk level. _/ export const LEVEL_LABELS: Record<RiskLevel, string> = { high: 'Risco alto', warn: 'Atenção', ok: 'Tranquila', }; /_* pt-BR heading of each assumption kind, in display order. _/ export const ASSUMPTION_LABELS = { informed: 'Informado por você', estimate: 'Estimativas usadas', change: 'Mudanças recentes de data', } as const; /_* Goal of a course: its own (from the syllabus) or the plan's. _/ export function courseGoal(plan: PlanData, code: string): number { return plan.courses.find((c) => c.code === code)?.goal ?? plan.goal; } /_* Risk level of every course, by code.
- **Input:** `plan`: plan.
- **Output:** Map from course code to risk level.
- **Effects:** None (pure).
- **Errors:** None.

### `levelClass`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-header.ts`
- **Signature:** `levelClass(levels: ReadonlyMap<string, RiskLevel>, code: string): string`
- **Used by:** `renderChecklistItem()`, `renderQuestions()`, `renderRiskChips()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Header (title, situation, sources, goal and assumptions), risk chips and footer of the plan page. _/ import type { PlanData, RiskLevel } from '../plan-schema.js'; import { planTitle } from '../plan-embed.js'; import { formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { appendRichText, createEl, requireEl } from './dom.js'; import { formatStamp } from './format.js'; /_* pt-BR label of each risk level. _/ export const LEVEL_LABELS: Record<RiskLevel, string> = { high: 'Risco alto', warn: 'Atenção', ok: 'Tranquila', }; /_* pt-BR heading of each assumption kind, in display order. _/ export const ASSUMPTION_LABELS = { informed: 'Informado por você', estimate: 'Estimativas usadas', change: 'Mudanças recentes de data', } as const; /_* Goal of a course: its own (from the syllabus) or the plan's. _/ export function courseGoal(plan: PlanData, code: string): number { return plan.courses.find((c) => c.code === code)?.goal ?? plan.goal; } /_* Risk level of every course, by code. _/ export function courseLevels(plan: PlanData): Map<string, RiskLevel> { return new Map( plan.courses.map((c) => [c.code, riskLevel(c.points, c.goal ?? plan.goal, c.needsRecovery)]), ); } /_* CSS class that colors a tag: the course's level, or neutral for tags that are not a course.
- **Input:** `levels`: map; `code`: tag.
- **Output:** `lvl-<level>`, or `lvl-none` for tags that are not courses.
- **Effects:** None (pure).
- **Errors:** None.

### `situationText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-header.ts`
- **Signature:** `situationText(plan: PlanData): string`
- **Used by:** `renderHeader()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Header (title, situation, sources, goal and assumptions), risk chips and footer of the plan page. _/ import type { PlanData, RiskLevel } from '../plan-schema.js'; import { planTitle } from '../plan-embed.js'; import { formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { appendRichText, createEl, requireEl } from './dom.js'; import { formatStamp } from './format.js'; /_* pt-BR label of each risk level. _/ export const LEVEL_LABELS: Record<RiskLevel, string> = { high: 'Risco alto', warn: 'Atenção', ok: 'Tranquila', }; /_* pt-BR heading of each assumption kind, in display order. _/ export const ASSUMPTION_LABELS = { informed: 'Informado por você', estimate: 'Estimativas usadas', change: 'Mudanças recentes de data', } as const; /_* Goal of a course: its own (from the syllabus) or the plan's. _/ export function courseGoal(plan: PlanData, code: string): number { return plan.courses.find((c) => c.code === code)?.goal ?? plan.goal; } /_* Risk level of every course, by code. _/ export function courseLevels(plan: PlanData): Map<string, RiskLevel> { return new Map( plan.courses.map((c) => [c.code, riskLevel(c.points, c.goal ?? plan.goal, c.needsRecovery)]), ); } /_* CSS class that colors a tag: the course's level, or neutral for tags that are not a course. _/ export function levelClass(levels: ReadonlyMap<string, RiskLevel>, code: string): string { return `lvl-${levels.get(code) ?? 'none'}`; } /_* Sentence under the title: program, course count, situation time, sources and goal.
- **Input:** `plan`: plan.
- **Output:** Sentence with program, course count, situation time, sources and goal (with `**bold**`).
- **Effects:** None (pure).
- **Errors:** None.

### `renderHeader`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-header.ts`
- **Signature:** `renderHeader(doc: Document, plan: PlanData): void`
- **Used by:** `renderPlanSections()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Header (title, situation, sources, goal and assumptions), risk chips and footer of the plan page. _/ import type { PlanData, RiskLevel } from '../plan-schema.js'; import { planTitle } from '../plan-embed.js'; import { formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { appendRichText, createEl, requireEl } from './dom.js'; import { formatStamp } from './format.js'; /_* pt-BR label of each risk level. _/ export const LEVEL_LABELS: Record<RiskLevel, string> = { high: 'Risco alto', warn: 'Atenção', ok: 'Tranquila', }; /_* pt-BR heading of each assumption kind, in display order. _/ export const ASSUMPTION_LABELS = { informed: 'Informado por você', estimate: 'Estimativas usadas', change: 'Mudanças recentes de data', } as const; /_* Goal of a course: its own (from the syllabus) or the plan's. _/ export function courseGoal(plan: PlanData, code: string): number { return plan.courses.find((c) => c.code === code)?.goal ?? plan.goal; } /_* Risk level of every course, by code. _/ export function courseLevels(plan: PlanData): Map<string, RiskLevel> { return new Map( plan.courses.map((c) => [c.code, riskLevel(c.points, c.goal ?? plan.goal, c.needsRecovery)]), ); } /_* CSS class that colors a tag: the course's level, or neutral for tags that are not a course. _/ export function levelClass(levels: ReadonlyMap<string, RiskLevel>, code: string): string { return `lvl-${levels.get(code) ?? 'none'}`; } /_* Sentence under the title: program, course count, situation time, sources and goal. _/ export function situationText(plan: PlanData): string { const n = plan.courses.length; const custom = plan.courses.some((c) => c.goal !== undefined && c.goal !== plan.goal); return [ `${plan.program} · PUC Minas · ${n} ${n === 1 ? 'matéria' : 'matérias'}.`, `Situação em ${formatStamp(plan.generatedAt)}, a partir de: ${plan.sources.join(', ')}.`, `Para aprovar: **${formatPoints(plan.goal)} de 100** pontos em cada matéria${custom ? ' (salvo onde o plano de ensino diz outra meta)' : ''}.`, ].join(' '); } /_* Fills the header: title, situation and the assumptions box (hidden when empty).
- **Input:** `doc`: page; `plan`: plan.
- **Output:** Nothing.
- **Effects:** Fills the title, the situation and the assumptions box (hidden when empty).
- **Errors:** `requireEl` errors propagate.

### `renderRiskChips`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-header.ts`
- **Signature:** `renderRiskChips(doc: Document, plan: PlanData): void`
- **Used by:** `renderPlanSections()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Header (title, situation, sources, goal and assumptions), risk chips and footer of the plan page. _/ import type { PlanData, RiskLevel } from '../plan-schema.js'; import { planTitle } from '../plan-embed.js'; import { formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { appendRichText, createEl, requireEl } from './dom.js'; import { formatStamp } from './format.js'; /_* pt-BR label of each risk level. _/ export const LEVEL_LABELS: Record<RiskLevel, string> = { high: 'Risco alto', warn: 'Atenção', ok: 'Tranquila', }; /_* pt-BR heading of each assumption kind, in display order. _/ export const ASSUMPTION_LABELS = { informed: 'Informado por você', estimate: 'Estimativas usadas', change: 'Mudanças recentes de data', } as const; /_* Goal of a course: its own (from the syllabus) or the plan's. _/ export function courseGoal(plan: PlanData, code: string): number { return plan.courses.find((c) => c.code === code)?.goal ?? plan.goal; } /_* Risk level of every course, by code. _/ export function courseLevels(plan: PlanData): Map<string, RiskLevel> { return new Map( plan.courses.map((c) => [c.code, riskLevel(c.points, c.goal ?? plan.goal, c.needsRecovery)]), ); } /_* CSS class that colors a tag: the course's level, or neutral for tags that are not a course. _/ export function levelClass(levels: ReadonlyMap<string, RiskLevel>, code: string): string { return `lvl-${levels.get(code) ?? 'none'}`; } /_* Sentence under the title: program, course count, situation time, sources and goal. _/ export function situationText(plan: PlanData): string { const n = plan.courses.length; const custom = plan.courses.some((c) => c.goal !== undefined && c.goal !== plan.goal); return [ `${plan.program} · PUC Minas · ${n} ${n === 1 ? 'matéria' : 'matérias'}.`, `Situação em ${formatStamp(plan.generatedAt)}, a partir de: ${plan.sources.join(', ')}.`, `Para aprovar: **${formatPoints(plan.goal)} de 100** pontos em cada matéria${custom ? ' (salvo onde o plano de ensino diz outra meta)' : ''}.`, ].join(' '); } /_* Fills the header: title, situation and the assumptions box (hidden when empty). _/ export function renderHeader(doc: Document, plan: PlanData): void { requireEl(doc, 'plan-title').textContent = planTitle(plan.term); appendRichText(requireEl(doc, 'plan-situation'), situationText(plan)); const box = requireEl(doc, 'plan-assumptions'); for (const [kind, label] of Object.entries(ASSUMPTION_LABELS)) { const texts = plan.assumptions.filter((a) => a.kind === kind).map((a) => a.text); if (texts.length === 0) continue; const row = createEl(doc, 'p'); row.append(createEl(doc, 'strong', { text: `${label}: ` })); texts.forEach((t, i) => appendRichText(row, i === 0 ? t : ` · ${t}`)); box.append(row); } box.hidden = plan.assumptions.length === 0; } /_* One chip per course linking to its card: code, points missing and level.
- **Input:** `doc`: page; `plan`: plan.
- **Output:** Nothing.
- **Effects:** Fills `#risk-list` with one chip per course linking to its card.
- **Errors:** `requireEl` errors propagate.

### `renderFooter`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/page/render-header.ts`
- **Signature:** `renderFooter(doc: Document, plan: PlanData): void`
- **Used by:** `renderPlanSections()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Header (title, situation, sources, goal and assumptions), risk chips and footer of the plan page. _/ import type { PlanData, RiskLevel } from '../plan-schema.js'; import { planTitle } from '../plan-embed.js'; import { formatPoints, pointsMissing, riskLevel } from '../plan-points.js'; import { appendRichText, createEl, requireEl } from './dom.js'; import { formatStamp } from './format.js'; /_* pt-BR label of each risk level. _/ export const LEVEL_LABELS: Record<RiskLevel, string> = { high: 'Risco alto', warn: 'Atenção', ok: 'Tranquila', }; /_* pt-BR heading of each assumption kind, in display order. _/ export const ASSUMPTION_LABELS = { informed: 'Informado por você', estimate: 'Estimativas usadas', change: 'Mudanças recentes de data', } as const; /_* Goal of a course: its own (from the syllabus) or the plan's. _/ export function courseGoal(plan: PlanData, code: string): number { return plan.courses.find((c) => c.code === code)?.goal ?? plan.goal; } /_* Risk level of every course, by code. _/ export function courseLevels(plan: PlanData): Map<string, RiskLevel> { return new Map( plan.courses.map((c) => [c.code, riskLevel(c.points, c.goal ?? plan.goal, c.needsRecovery)]), ); } /_* CSS class that colors a tag: the course's level, or neutral for tags that are not a course. _/ export function levelClass(levels: ReadonlyMap<string, RiskLevel>, code: string): string { return `lvl-${levels.get(code) ?? 'none'}`; } /_* Sentence under the title: program, course count, situation time, sources and goal. _/ export function situationText(plan: PlanData): string { const n = plan.courses.length; const custom = plan.courses.some((c) => c.goal !== undefined && c.goal !== plan.goal); return [ `${plan.program} · PUC Minas · ${n} ${n === 1 ? 'matéria' : 'matérias'}.`, `Situação em ${formatStamp(plan.generatedAt)}, a partir de: ${plan.sources.join(', ')}.`, `Para aprovar: **${formatPoints(plan.goal)} de 100** pontos em cada matéria${custom ? ' (salvo onde o plano de ensino diz outra meta)' : ''}.`, ].join(' '); } /_* Fills the header: title, situation and the assumptions box (hidden when empty). _/ export function renderHeader(doc: Document, plan: PlanData): void { requireEl(doc, 'plan-title').textContent = planTitle(plan.term); appendRichText(requireEl(doc, 'plan-situation'), situationText(plan)); const box = requireEl(doc, 'plan-assumptions'); for (const [kind, label] of Object.entries(ASSUMPTION_LABELS)) { const texts = plan.assumptions.filter((a) => a.kind === kind).map((a) => a.text); if (texts.length === 0) continue; const row = createEl(doc, 'p'); row.append(createEl(doc, 'strong', { text: `${label}: ` })); texts.forEach((t, i) => appendRichText(row, i === 0 ? t : ` · ${t}`)); box.append(row); } box.hidden = plan.assumptions.length === 0; } /_* One chip per course linking to its card: code, points missing and level. _/ export function renderRiskChips(doc: Document, plan: PlanData): void { const list = requireEl(doc, 'risk-list'); const levels = courseLevels(plan); for (const course of plan.courses) { const level = levels.get(course.code) ?? 'ok'; const missing = pointsMissing(course.points, course.goal ?? plan.goal); const chip = createEl(doc, 'a', { className: `chip ${levelClass(levels, course.code)}` }); chip.href = `#curso-${course.id}`; chip.append(createEl(doc, 'span', { className: 'chip-code', text: course.code })); chip.append( createEl(doc, 'span', { className: 'chip-need', text: `faltam ${formatPoints(missing)} pts`, }), ); chip.append(createEl(doc, 'span', { className: 'chip-level', text: LEVEL_LABELS[level] })); list.append(chip); } } /_* Footer: sources and time of the query, and the sources that were not connected.
- **Input:** `doc`: page; `plan`: plan.
- **Output:** Nothing.
- **Effects:** Fills the footer with the sources and the ones not connected.
- **Errors:** `requireEl` errors propagate.

## `connectors/canvas-puc/src/plan/plan-cli-core.ts`

### `parsePlanOptions`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-cli-core.ts`
- **Signature:** `parsePlanOptions(rest: readonly string[]): Record<string, string>`
- **Used by:** `parsePlanArgs()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Commands of the `/planejamento-faculdade` script (`node scripts/plan.mjs <command>`): validate the plan JSON, build the page from the template (reusing the previous version's ids), extract the JSON of a published page and print a short summary. File access comes in through `PlanIo`, so the commands are tested without touching disk. / import { extractPlan, injectPlan } from './plan-embed.js'; import { mergeWithPrevious } from './plan-ids.js'; import { formatPoints, pointsMissing, riskLevel } from './plan-points.js'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { validatePlan, zodIssueLines } from './plan-validate.js'; /** Commands the script accepts. _/ export const PLAN_COMMANDS = ['validate', 'build', 'extract', 'summary'] as const; /_* Usage text printed on a wrong call. _/ export const PLAN_USAGE = [ 'Usage:', ' node plan.mjs validate <plan.json>', ' node plan.mjs build <plan.json> --out <page.html> [--previous <old-page.html>] [--data-out <merged.json>]', ' node plan.mjs extract <page.html> --out <plan.json>', ' node plan.mjs summary <plan.json>', ].join('\n'); export type PlanCommand = (typeof PLAN_COMMANDS)[number]; export interface PlanArgs { readonly command: PlanCommand; readonly input: string; readonly options: Readonly<Record<string, string>>; } export interface PlanIo { readText(path: string): string; writeText(path: string, text: string): void; readonly templatePath: string; } export interface PlanResult { readonly code: 0 | 1; readonly output: string; } /_* Parses `--name value` pairs (out, previous, data-out); throws on an unknown or unpaired option.
- **Input:** `rest`: arguments after the input.
- **Output:** Options keyed by name without `--` (`out`, `previous`, `data-out`).
- **Effects:** None (pure).
- **Errors:** Throws with the usage text on an unpaired or unknown option.

### `parsePlanArgs`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-cli-core.ts`
- **Signature:** `parsePlanArgs(argv: readonly string[]): PlanArgs`
- **Used by:** `runPlanCommand()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Commands of the `/planejamento-faculdade` script (`node scripts/plan.mjs <command>`): validate the plan JSON, build the page from the template (reusing the previous version's ids), extract the JSON of a published page and print a short summary. File access comes in through `PlanIo`, so the commands are tested without touching disk. / import { extractPlan, injectPlan } from './plan-embed.js'; import { mergeWithPrevious } from './plan-ids.js'; import { formatPoints, pointsMissing, riskLevel } from './plan-points.js'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { validatePlan, zodIssueLines } from './plan-validate.js'; /** Commands the script accepts. _/ export const PLAN_COMMANDS = ['validate', 'build', 'extract', 'summary'] as const; /_* Usage text printed on a wrong call. _/ export const PLAN_USAGE = [ 'Usage:', ' node plan.mjs validate <plan.json>', ' node plan.mjs build <plan.json> --out <page.html> [--previous <old-page.html>] [--data-out <merged.json>]', ' node plan.mjs extract <page.html> --out <plan.json>', ' node plan.mjs summary <plan.json>', ].join('\n'); export type PlanCommand = (typeof PLAN_COMMANDS)[number]; export interface PlanArgs { readonly command: PlanCommand; readonly input: string; readonly options: Readonly<Record<string, string>>; } export interface PlanIo { readText(path: string): string; writeText(path: string, text: string): void; readonly templatePath: string; } export interface PlanResult { readonly code: 0 | 1; readonly output: string; } /_* Parses `--name value` pairs (out, previous, data-out); throws on an unknown or unpaired option. _/ export function parsePlanOptions(rest: readonly string[]): Record<string, string> { if (rest.length % 2 !== 0) throw new Error(PLAN_USAGE); const options: Record<string, string> = {}; for (let i = 0; i < rest.length; i += 2) { const name = rest[i] ?? ''; if (!/^--(out|previous|data-out)$/.test(name)) { throw new Error(`Unknown option ${name}\n${PLAN_USAGE}`); } options[name.slice(2)] = rest[i + 1] ?? ''; } return options; } /_* Parses `<command> <input> [--name value]...`; throws with the usage text on anything else.
- **Input:** `argv`: arguments after the script.
- **Output:** `{command, input, options}`.
- **Effects:** None (pure).
- **Errors:** Throws with the usage text on an unknown command or a missing input.

### `invalidResult`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-cli-core.ts`
- **Signature:** `invalidResult(what: string, errors: readonly string[]): PlanResult`
- **Used by:** `runBuild()`, `runExtract()`, `runSummary()`, `runValidate()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Commands of the `/planejamento-faculdade` script (`node scripts/plan.mjs <command>`): validate the plan JSON, build the page from the template (reusing the previous version's ids), extract the JSON of a published page and print a short summary. File access comes in through `PlanIo`, so the commands are tested without touching disk. / import { extractPlan, injectPlan } from './plan-embed.js'; import { mergeWithPrevious } from './plan-ids.js'; import { formatPoints, pointsMissing, riskLevel } from './plan-points.js'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { validatePlan, zodIssueLines } from './plan-validate.js'; /** Commands the script accepts. _/ export const PLAN_COMMANDS = ['validate', 'build', 'extract', 'summary'] as const; /_* Usage text printed on a wrong call. _/ export const PLAN_USAGE = [ 'Usage:', ' node plan.mjs validate <plan.json>', ' node plan.mjs build <plan.json> --out <page.html> [--previous <old-page.html>] [--data-out <merged.json>]', ' node plan.mjs extract <page.html> --out <plan.json>', ' node plan.mjs summary <plan.json>', ].join('\n'); export type PlanCommand = (typeof PLAN_COMMANDS)[number]; export interface PlanArgs { readonly command: PlanCommand; readonly input: string; readonly options: Readonly<Record<string, string>>; } export interface PlanIo { readText(path: string): string; writeText(path: string, text: string): void; readonly templatePath: string; } export interface PlanResult { readonly code: 0 | 1; readonly output: string; } /_* Parses `--name value` pairs (out, previous, data-out); throws on an unknown or unpaired option. _/ export function parsePlanOptions(rest: readonly string[]): Record<string, string> { if (rest.length % 2 !== 0) throw new Error(PLAN_USAGE); const options: Record<string, string> = {}; for (let i = 0; i < rest.length; i += 2) { const name = rest[i] ?? ''; if (!/^--(out|previous|data-out)$/.test(name)) { throw new Error(`Unknown option ${name}\n${PLAN_USAGE}`); } options[name.slice(2)] = rest[i + 1] ?? ''; } return options; } /_* Parses `<command> <input> [--name value]...`; throws with the usage text on anything else. _/ export function parsePlanArgs(argv: readonly string[]): PlanArgs { const [command = '', input = '', ...rest] = argv; const known = (PLAN_COMMANDS as readonly string[]).includes(command); if (!known || input === '' || input.startsWith('--')) throw new Error(PLAN_USAGE); return { command: command as PlanCommand, input, options: parsePlanOptions(rest) }; } /_* A failed result listing validation errors.
- **Input:** `what`: file or step; `errors`: messages.
- **Output:** Failed result (`code: 1`) listing the errors.
- **Effects:** None (pure).
- **Errors:** None.

### `readJsonFile`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-cli-core.ts`
- **Signature:** `readJsonFile(io: PlanIo, path: string): unknown`
- **Used by:** `runBuild()`, `runSummary()`, `runValidate()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Commands of the `/planejamento-faculdade` script (`node scripts/plan.mjs <command>`): validate the plan JSON, build the page from the template (reusing the previous version's ids), extract the JSON of a published page and print a short summary. File access comes in through `PlanIo`, so the commands are tested without touching disk. / import { extractPlan, injectPlan } from './plan-embed.js'; import { mergeWithPrevious } from './plan-ids.js'; import { formatPoints, pointsMissing, riskLevel } from './plan-points.js'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { validatePlan, zodIssueLines } from './plan-validate.js'; /** Commands the script accepts. _/ export const PLAN_COMMANDS = ['validate', 'build', 'extract', 'summary'] as const; /_* Usage text printed on a wrong call. _/ export const PLAN_USAGE = [ 'Usage:', ' node plan.mjs validate <plan.json>', ' node plan.mjs build <plan.json> --out <page.html> [--previous <old-page.html>] [--data-out <merged.json>]', ' node plan.mjs extract <page.html> --out <plan.json>', ' node plan.mjs summary <plan.json>', ].join('\n'); export type PlanCommand = (typeof PLAN_COMMANDS)[number]; export interface PlanArgs { readonly command: PlanCommand; readonly input: string; readonly options: Readonly<Record<string, string>>; } export interface PlanIo { readText(path: string): string; writeText(path: string, text: string): void; readonly templatePath: string; } export interface PlanResult { readonly code: 0 | 1; readonly output: string; } /_* Parses `--name value` pairs (out, previous, data-out); throws on an unknown or unpaired option. _/ export function parsePlanOptions(rest: readonly string[]): Record<string, string> { if (rest.length % 2 !== 0) throw new Error(PLAN_USAGE); const options: Record<string, string> = {}; for (let i = 0; i < rest.length; i += 2) { const name = rest[i] ?? ''; if (!/^--(out|previous|data-out)$/.test(name)) { throw new Error(`Unknown option ${name}\n${PLAN_USAGE}`); } options[name.slice(2)] = rest[i + 1] ?? ''; } return options; } /_* Parses `<command> <input> [--name value]...`; throws with the usage text on anything else. _/ export function parsePlanArgs(argv: readonly string[]): PlanArgs { const [command = '', input = '', ...rest] = argv; const known = (PLAN_COMMANDS as readonly string[]).includes(command); if (!known || input === '' || input.startsWith('--')) throw new Error(PLAN_USAGE); return { command: command as PlanCommand, input, options: parsePlanOptions(rest) }; } /_* A failed result listing validation errors. _/ export function invalidResult(what: string, errors: readonly string[]): PlanResult { return { code: 1, output: [`✖ ${what} is invalid:`, ...errors.map((e) => `  - ${e}`)].join('\n'), }; } /_* Reads and parses a JSON file; throws naming the file when it is not JSON.
- **Input:** `io`: file access; `path`: file.
- **Output:** Parsed JSON value.
- **Effects:** Reads the file through `io`.
- **Errors:** Throws naming the file when it is not JSON; read errors propagate.

### `planSummaryLines`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-cli-core.ts`
- **Signature:** `planSummaryLines(plan: PlanData): string[]`
- **Used by:** `runBuild()`, `runSummary()`, `runValidate()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Commands of the `/planejamento-faculdade` script (`node scripts/plan.mjs <command>`): validate the plan JSON, build the page from the template (reusing the previous version's ids), extract the JSON of a published page and print a short summary. File access comes in through `PlanIo`, so the commands are tested without touching disk. / import { extractPlan, injectPlan } from './plan-embed.js'; import { mergeWithPrevious } from './plan-ids.js'; import { formatPoints, pointsMissing, riskLevel } from './plan-points.js'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { validatePlan, zodIssueLines } from './plan-validate.js'; /** Commands the script accepts. _/ export const PLAN_COMMANDS = ['validate', 'build', 'extract', 'summary'] as const; /_* Usage text printed on a wrong call. _/ export const PLAN_USAGE = [ 'Usage:', ' node plan.mjs validate <plan.json>', ' node plan.mjs build <plan.json> --out <page.html> [--previous <old-page.html>] [--data-out <merged.json>]', ' node plan.mjs extract <page.html> --out <plan.json>', ' node plan.mjs summary <plan.json>', ].join('\n'); export type PlanCommand = (typeof PLAN_COMMANDS)[number]; export interface PlanArgs { readonly command: PlanCommand; readonly input: string; readonly options: Readonly<Record<string, string>>; } export interface PlanIo { readText(path: string): string; writeText(path: string, text: string): void; readonly templatePath: string; } export interface PlanResult { readonly code: 0 | 1; readonly output: string; } /_* Parses `--name value` pairs (out, previous, data-out); throws on an unknown or unpaired option. _/ export function parsePlanOptions(rest: readonly string[]): Record<string, string> { if (rest.length % 2 !== 0) throw new Error(PLAN_USAGE); const options: Record<string, string> = {}; for (let i = 0; i < rest.length; i += 2) { const name = rest[i] ?? ''; if (!/^--(out|previous|data-out)$/.test(name)) { throw new Error(`Unknown option ${name}\n${PLAN_USAGE}`); } options[name.slice(2)] = rest[i + 1] ?? ''; } return options; } /_* Parses `<command> <input> [--name value]...`; throws with the usage text on anything else. _/ export function parsePlanArgs(argv: readonly string[]): PlanArgs { const [command = '', input = '', ...rest] = argv; const known = (PLAN_COMMANDS as readonly string[]).includes(command); if (!known || input === '' || input.startsWith('--')) throw new Error(PLAN_USAGE); return { command: command as PlanCommand, input, options: parsePlanOptions(rest) }; } /_* A failed result listing validation errors. _/ export function invalidResult(what: string, errors: readonly string[]): PlanResult { return { code: 1, output: [`✖ ${what} is invalid:`, ...errors.map((e) => `  - ${e}`)].join('\n'), }; } /_* Reads and parses a JSON file; throws naming the file when it is not JSON. _/ export function readJsonFile(io: PlanIo, path: string): unknown { try { return JSON.parse(io.readText(path)) as unknown; } catch (error) { throw new Error(`${path} is not valid JSON: ${(error as Error).message}`, { cause: error }); } } /_* One line per course: code, points missing to the goal and risk level; plus the counts.
- **Input:** `plan`: valid plan.
- **Output:** One line per course (missing points, goal, level) plus the item counts.
- **Effects:** None (pure).
- **Errors:** None.

### `runValidate`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-cli-core.ts`
- **Signature:** `runValidate(args: PlanArgs, io: PlanIo): PlanResult`
- **Used by:** `runPlanCommand()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Commands of the `/planejamento-faculdade` script (`node scripts/plan.mjs <command>`): validate the plan JSON, build the page from the template (reusing the previous version's ids), extract the JSON of a published page and print a short summary. File access comes in through `PlanIo`, so the commands are tested without touching disk. / import { extractPlan, injectPlan } from './plan-embed.js'; import { mergeWithPrevious } from './plan-ids.js'; import { formatPoints, pointsMissing, riskLevel } from './plan-points.js'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { validatePlan, zodIssueLines } from './plan-validate.js'; /** Commands the script accepts. _/ export const PLAN_COMMANDS = ['validate', 'build', 'extract', 'summary'] as const; /_* Usage text printed on a wrong call. _/ export const PLAN_USAGE = [ 'Usage:', ' node plan.mjs validate <plan.json>', ' node plan.mjs build <plan.json> --out <page.html> [--previous <old-page.html>] [--data-out <merged.json>]', ' node plan.mjs extract <page.html> --out <plan.json>', ' node plan.mjs summary <plan.json>', ].join('\n'); export type PlanCommand = (typeof PLAN_COMMANDS)[number]; export interface PlanArgs { readonly command: PlanCommand; readonly input: string; readonly options: Readonly<Record<string, string>>; } export interface PlanIo { readText(path: string): string; writeText(path: string, text: string): void; readonly templatePath: string; } export interface PlanResult { readonly code: 0 | 1; readonly output: string; } /_* Parses `--name value` pairs (out, previous, data-out); throws on an unknown or unpaired option. _/ export function parsePlanOptions(rest: readonly string[]): Record<string, string> { if (rest.length % 2 !== 0) throw new Error(PLAN_USAGE); const options: Record<string, string> = {}; for (let i = 0; i < rest.length; i += 2) { const name = rest[i] ?? ''; if (!/^--(out|previous|data-out)$/.test(name)) { throw new Error(`Unknown option ${name}\n${PLAN_USAGE}`); } options[name.slice(2)] = rest[i + 1] ?? ''; } return options; } /_* Parses `<command> <input> [--name value]...`; throws with the usage text on anything else. _/ export function parsePlanArgs(argv: readonly string[]): PlanArgs { const [command = '', input = '', ...rest] = argv; const known = (PLAN_COMMANDS as readonly string[]).includes(command); if (!known || input === '' || input.startsWith('--')) throw new Error(PLAN_USAGE); return { command: command as PlanCommand, input, options: parsePlanOptions(rest) }; } /_* A failed result listing validation errors. _/ export function invalidResult(what: string, errors: readonly string[]): PlanResult { return { code: 1, output: [`✖ ${what} is invalid:`, ...errors.map((e) => `  - ${e}`)].join('\n'), }; } /_* Reads and parses a JSON file; throws naming the file when it is not JSON. _/ export function readJsonFile(io: PlanIo, path: string): unknown { try { return JSON.parse(io.readText(path)) as unknown; } catch (error) { throw new Error(`${path} is not valid JSON: ${(error as Error).message}`, { cause: error }); } } /_* One line per course: code, points missing to the goal and risk level; plus the counts. _/ export function planSummaryLines(plan: PlanData): string[] { const courses = plan.courses.map((course) => { const goal = course.goal ?? plan.goal; const level = riskLevel(course.points, goal, course.needsRecovery); return `${course.code}: faltam ${formatPoints(pointsMissing(course.points, goal))} de ${formatPoints(goal)} · ${level}`; }); const study = plan.study.reduce((n, d) => n + d.items.length, 0); const timeline = plan.timeline.reduce((n, d) => n + d.items.length, 0) + plan.undated.length; return [ ...courses, `itens: ${study} de estudo, ${timeline} na linha do tempo, ${plan.questions.length} perguntas`, ]; } /_* `validate`: checks the plan JSON.
- **Input:** `args`: parsed arguments; `io`: file access.
- **Output:** Success with the summary, or the validation errors.
- **Effects:** Reads the input file.
- **Errors:** Read and JSON errors propagate (caught by `runPlanCommand`).

### `readPreviousPlan`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-cli-core.ts`
- **Signature:** `readPreviousPlan(args: PlanArgs, io: PlanIo): PlanData | null`
- **Used by:** `runBuild()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Commands of the `/planejamento-faculdade` script (`node scripts/plan.mjs <command>`): validate the plan JSON, build the page from the template (reusing the previous version's ids), extract the JSON of a published page and print a short summary. File access comes in through `PlanIo`, so the commands are tested without touching disk. / import { extractPlan, injectPlan } from './plan-embed.js'; import { mergeWithPrevious } from './plan-ids.js'; import { formatPoints, pointsMissing, riskLevel } from './plan-points.js'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { validatePlan, zodIssueLines } from './plan-validate.js'; /** Commands the script accepts. _/ export const PLAN_COMMANDS = ['validate', 'build', 'extract', 'summary'] as const; /_* Usage text printed on a wrong call. _/ export const PLAN_USAGE = [ 'Usage:', ' node plan.mjs validate <plan.json>', ' node plan.mjs build <plan.json> --out <page.html> [--previous <old-page.html>] [--data-out <merged.json>]', ' node plan.mjs extract <page.html> --out <plan.json>', ' node plan.mjs summary <plan.json>', ].join('\n'); export type PlanCommand = (typeof PLAN_COMMANDS)[number]; export interface PlanArgs { readonly command: PlanCommand; readonly input: string; readonly options: Readonly<Record<string, string>>; } export interface PlanIo { readText(path: string): string; writeText(path: string, text: string): void; readonly templatePath: string; } export interface PlanResult { readonly code: 0 | 1; readonly output: string; } /_* Parses `--name value` pairs (out, previous, data-out); throws on an unknown or unpaired option. _/ export function parsePlanOptions(rest: readonly string[]): Record<string, string> { if (rest.length % 2 !== 0) throw new Error(PLAN_USAGE); const options: Record<string, string> = {}; for (let i = 0; i < rest.length; i += 2) { const name = rest[i] ?? ''; if (!/^--(out|previous|data-out)$/.test(name)) { throw new Error(`Unknown option ${name}\n${PLAN_USAGE}`); } options[name.slice(2)] = rest[i + 1] ?? ''; } return options; } /_* Parses `<command> <input> [--name value]...`; throws with the usage text on anything else. _/ export function parsePlanArgs(argv: readonly string[]): PlanArgs { const [command = '', input = '', ...rest] = argv; const known = (PLAN_COMMANDS as readonly string[]).includes(command); if (!known || input === '' || input.startsWith('--')) throw new Error(PLAN_USAGE); return { command: command as PlanCommand, input, options: parsePlanOptions(rest) }; } /_* A failed result listing validation errors. _/ export function invalidResult(what: string, errors: readonly string[]): PlanResult { return { code: 1, output: [`✖ ${what} is invalid:`, ...errors.map((e) => `  - ${e}`)].join('\n'), }; } /_* Reads and parses a JSON file; throws naming the file when it is not JSON. _/ export function readJsonFile(io: PlanIo, path: string): unknown { try { return JSON.parse(io.readText(path)) as unknown; } catch (error) { throw new Error(`${path} is not valid JSON: ${(error as Error).message}`, { cause: error }); } } /_* One line per course: code, points missing to the goal and risk level; plus the counts. _/ export function planSummaryLines(plan: PlanData): string[] { const courses = plan.courses.map((course) => { const goal = course.goal ?? plan.goal; const level = riskLevel(course.points, goal, course.needsRecovery); return `${course.code}: faltam ${formatPoints(pointsMissing(course.points, goal))} de ${formatPoints(goal)} · ${level}`; }); const study = plan.study.reduce((n, d) => n + d.items.length, 0); const timeline = plan.timeline.reduce((n, d) => n + d.items.length, 0) + plan.undated.length; return [ ...courses, `itens: ${study} de estudo, ${timeline} na linha do tempo, ${plan.questions.length} perguntas`, ]; } /_* `validate`: checks the plan JSON. _/ export function runValidate(args: PlanArgs, io: PlanIo): PlanResult { const result = validatePlan(readJsonFile(io, args.input)); if (!result.ok) return invalidResult(args.input, result.errors); return { code: 0, output: ['✔ plan valid', ...planSummaryLines(result.plan)].join('\n') }; } /_* The previous version's plan, from its page; null without `--previous`. Throws when it is not a valid plan.
- **Input:** `args`: parsed arguments; `io`: file access.
- **Output:** The previous plan from the `--previous` page, or `null` without it.
- **Effects:** Reads the previous page.
- **Errors:** Throws when the previous plan is invalid; read and extract errors propagate.

### `runBuild`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-cli-core.ts`
- **Signature:** `runBuild(args: PlanArgs, io: PlanIo): PlanResult`
- **Used by:** `runPlanCommand()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Commands of the `/planejamento-faculdade` script (`node scripts/plan.mjs <command>`): validate the plan JSON, build the page from the template (reusing the previous version's ids), extract the JSON of a published page and print a short summary. File access comes in through `PlanIo`, so the commands are tested without touching disk. / import { extractPlan, injectPlan } from './plan-embed.js'; import { mergeWithPrevious } from './plan-ids.js'; import { formatPoints, pointsMissing, riskLevel } from './plan-points.js'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { validatePlan, zodIssueLines } from './plan-validate.js'; /** Commands the script accepts. _/ export const PLAN_COMMANDS = ['validate', 'build', 'extract', 'summary'] as const; /_* Usage text printed on a wrong call. _/ export const PLAN_USAGE = [ 'Usage:', ' node plan.mjs validate <plan.json>', ' node plan.mjs build <plan.json> --out <page.html> [--previous <old-page.html>] [--data-out <merged.json>]', ' node plan.mjs extract <page.html> --out <plan.json>', ' node plan.mjs summary <plan.json>', ].join('\n'); export type PlanCommand = (typeof PLAN_COMMANDS)[number]; export interface PlanArgs { readonly command: PlanCommand; readonly input: string; readonly options: Readonly<Record<string, string>>; } export interface PlanIo { readText(path: string): string; writeText(path: string, text: string): void; readonly templatePath: string; } export interface PlanResult { readonly code: 0 | 1; readonly output: string; } /_* Parses `--name value` pairs (out, previous, data-out); throws on an unknown or unpaired option. _/ export function parsePlanOptions(rest: readonly string[]): Record<string, string> { if (rest.length % 2 !== 0) throw new Error(PLAN_USAGE); const options: Record<string, string> = {}; for (let i = 0; i < rest.length; i += 2) { const name = rest[i] ?? ''; if (!/^--(out|previous|data-out)$/.test(name)) { throw new Error(`Unknown option ${name}\n${PLAN_USAGE}`); } options[name.slice(2)] = rest[i + 1] ?? ''; } return options; } /_* Parses `<command> <input> [--name value]...`; throws with the usage text on anything else. _/ export function parsePlanArgs(argv: readonly string[]): PlanArgs { const [command = '', input = '', ...rest] = argv; const known = (PLAN_COMMANDS as readonly string[]).includes(command); if (!known || input === '' || input.startsWith('--')) throw new Error(PLAN_USAGE); return { command: command as PlanCommand, input, options: parsePlanOptions(rest) }; } /_* A failed result listing validation errors. _/ export function invalidResult(what: string, errors: readonly string[]): PlanResult { return { code: 1, output: [`✖ ${what} is invalid:`, ...errors.map((e) => `  - ${e}`)].join('\n'), }; } /_* Reads and parses a JSON file; throws naming the file when it is not JSON. _/ export function readJsonFile(io: PlanIo, path: string): unknown { try { return JSON.parse(io.readText(path)) as unknown; } catch (error) { throw new Error(`${path} is not valid JSON: ${(error as Error).message}`, { cause: error }); } } /_* One line per course: code, points missing to the goal and risk level; plus the counts. _/ export function planSummaryLines(plan: PlanData): string[] { const courses = plan.courses.map((course) => { const goal = course.goal ?? plan.goal; const level = riskLevel(course.points, goal, course.needsRecovery); return `${course.code}: faltam ${formatPoints(pointsMissing(course.points, goal))} de ${formatPoints(goal)} · ${level}`; }); const study = plan.study.reduce((n, d) => n + d.items.length, 0); const timeline = plan.timeline.reduce((n, d) => n + d.items.length, 0) + plan.undated.length; return [ ...courses, `itens: ${study} de estudo, ${timeline} na linha do tempo, ${plan.questions.length} perguntas`, ]; } /_* `validate`: checks the plan JSON. _/ export function runValidate(args: PlanArgs, io: PlanIo): PlanResult { const result = validatePlan(readJsonFile(io, args.input)); if (!result.ok) return invalidResult(args.input, result.errors); return { code: 0, output: ['✔ plan valid', ...planSummaryLines(result.plan)].join('\n') }; } /_* The previous version's plan, from its page; null without `--previous`. Throws when it is not a valid plan. _/ export function readPreviousPlan(args: PlanArgs, io: PlanIo): PlanData | null { const path = args.options.previous; if (path === undefined) return null; const result = validatePlan(extractPlan(io.readText(path))); if (!result.ok) throw new Error(`${path}: the previous plan is invalid:\n${result.errors.join('\n')}`); return result.plan; } /_* `build`: checks the shape, merges with the previous version, validates and writes the page (and the merged JSON).
- **Input:** `args`: parsed arguments (`--out` required); `io`: file access.
- **Output:** Success with the summary, or the shape/validation errors (nothing written).
- **Effects:** Reads the input, previous page and template; writes the page and, with `--data-out`, the merged JSON.
- **Errors:** Throws without `--out`; file errors propagate (caught by `runPlanCommand`).

### `runExtract`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-cli-core.ts`
- **Signature:** `runExtract(args: PlanArgs, io: PlanIo): PlanResult`
- **Used by:** `runPlanCommand()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Commands of the `/planejamento-faculdade` script (`node scripts/plan.mjs <command>`): validate the plan JSON, build the page from the template (reusing the previous version's ids), extract the JSON of a published page and print a short summary. File access comes in through `PlanIo`, so the commands are tested without touching disk. / import { extractPlan, injectPlan } from './plan-embed.js'; import { mergeWithPrevious } from './plan-ids.js'; import { formatPoints, pointsMissing, riskLevel } from './plan-points.js'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { validatePlan, zodIssueLines } from './plan-validate.js'; /** Commands the script accepts. _/ export const PLAN_COMMANDS = ['validate', 'build', 'extract', 'summary'] as const; /_* Usage text printed on a wrong call. _/ export const PLAN_USAGE = [ 'Usage:', ' node plan.mjs validate <plan.json>', ' node plan.mjs build <plan.json> --out <page.html> [--previous <old-page.html>] [--data-out <merged.json>]', ' node plan.mjs extract <page.html> --out <plan.json>', ' node plan.mjs summary <plan.json>', ].join('\n'); export type PlanCommand = (typeof PLAN_COMMANDS)[number]; export interface PlanArgs { readonly command: PlanCommand; readonly input: string; readonly options: Readonly<Record<string, string>>; } export interface PlanIo { readText(path: string): string; writeText(path: string, text: string): void; readonly templatePath: string; } export interface PlanResult { readonly code: 0 | 1; readonly output: string; } /_* Parses `--name value` pairs (out, previous, data-out); throws on an unknown or unpaired option. _/ export function parsePlanOptions(rest: readonly string[]): Record<string, string> { if (rest.length % 2 !== 0) throw new Error(PLAN_USAGE); const options: Record<string, string> = {}; for (let i = 0; i < rest.length; i += 2) { const name = rest[i] ?? ''; if (!/^--(out|previous|data-out)$/.test(name)) { throw new Error(`Unknown option ${name}\n${PLAN_USAGE}`); } options[name.slice(2)] = rest[i + 1] ?? ''; } return options; } /_* Parses `<command> <input> [--name value]...`; throws with the usage text on anything else. _/ export function parsePlanArgs(argv: readonly string[]): PlanArgs { const [command = '', input = '', ...rest] = argv; const known = (PLAN_COMMANDS as readonly string[]).includes(command); if (!known || input === '' || input.startsWith('--')) throw new Error(PLAN_USAGE); return { command: command as PlanCommand, input, options: parsePlanOptions(rest) }; } /_* A failed result listing validation errors. _/ export function invalidResult(what: string, errors: readonly string[]): PlanResult { return { code: 1, output: [`✖ ${what} is invalid:`, ...errors.map((e) => `  - ${e}`)].join('\n'), }; } /_* Reads and parses a JSON file; throws naming the file when it is not JSON. _/ export function readJsonFile(io: PlanIo, path: string): unknown { try { return JSON.parse(io.readText(path)) as unknown; } catch (error) { throw new Error(`${path} is not valid JSON: ${(error as Error).message}`, { cause: error }); } } /_* One line per course: code, points missing to the goal and risk level; plus the counts. _/ export function planSummaryLines(plan: PlanData): string[] { const courses = plan.courses.map((course) => { const goal = course.goal ?? plan.goal; const level = riskLevel(course.points, goal, course.needsRecovery); return `${course.code}: faltam ${formatPoints(pointsMissing(course.points, goal))} de ${formatPoints(goal)} · ${level}`; }); const study = plan.study.reduce((n, d) => n + d.items.length, 0); const timeline = plan.timeline.reduce((n, d) => n + d.items.length, 0) + plan.undated.length; return [ ...courses, `itens: ${study} de estudo, ${timeline} na linha do tempo, ${plan.questions.length} perguntas`, ]; } /_* `validate`: checks the plan JSON. _/ export function runValidate(args: PlanArgs, io: PlanIo): PlanResult { const result = validatePlan(readJsonFile(io, args.input)); if (!result.ok) return invalidResult(args.input, result.errors); return { code: 0, output: ['✔ plan valid', ...planSummaryLines(result.plan)].join('\n') }; } /_* The previous version's plan, from its page; null without `--previous`. Throws when it is not a valid plan. _/ export function readPreviousPlan(args: PlanArgs, io: PlanIo): PlanData | null { const path = args.options.previous; if (path === undefined) return null; const result = validatePlan(extractPlan(io.readText(path))); if (!result.ok) throw new Error(`${path}: the previous plan is invalid:\n${result.errors.join('\n')}`); return result.plan; } /_* `build`: checks the shape, merges with the previous version, validates and writes the page (and the merged JSON). _/ export function runBuild(args: PlanArgs, io: PlanIo): PlanResult { const out = args.options.out; if (out === undefined) throw new Error(`build needs --out\n${PLAN_USAGE}`); const shape = planSchema.safeParse(readJsonFile(io, args.input)); if (!shape.success) return invalidResult(args.input, zodIssueLines(shape.error)); const merged = mergeWithPrevious(shape.data, readPreviousPlan(args, io)); const result = validatePlan(merged); if (!result.ok) return invalidResult(args.input, result.errors); io.writeText(out, injectPlan(io.readText(io.templatePath), result.plan)); const dataOut = args.options['data-out']; if (dataOut !== undefined) io.writeText(dataOut, `${JSON.stringify(result.plan, null, 2)}\n`); return { code: 0, output: [`✔ page written to ${out}`, ...planSummaryLines(result.plan)].join('\n'), }; } /_* `extract`: writes the plan JSON of a published page and says whether it is valid.
- **Input:** `args`: parsed arguments (`--out` required); `io`: file access.
- **Output:** Success, or failure listing why the extracted plan is invalid (the JSON is still written).
- **Effects:** Reads the page and writes the JSON.
- **Errors:** Throws without `--out` or without a data block.

### `runSummary`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-cli-core.ts`
- **Signature:** `runSummary(args: PlanArgs, io: PlanIo): PlanResult`
- **Used by:** `runPlanCommand()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Commands of the `/planejamento-faculdade` script (`node scripts/plan.mjs <command>`): validate the plan JSON, build the page from the template (reusing the previous version's ids), extract the JSON of a published page and print a short summary. File access comes in through `PlanIo`, so the commands are tested without touching disk. / import { extractPlan, injectPlan } from './plan-embed.js'; import { mergeWithPrevious } from './plan-ids.js'; import { formatPoints, pointsMissing, riskLevel } from './plan-points.js'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { validatePlan, zodIssueLines } from './plan-validate.js'; /** Commands the script accepts. _/ export const PLAN_COMMANDS = ['validate', 'build', 'extract', 'summary'] as const; /_* Usage text printed on a wrong call. _/ export const PLAN_USAGE = [ 'Usage:', ' node plan.mjs validate <plan.json>', ' node plan.mjs build <plan.json> --out <page.html> [--previous <old-page.html>] [--data-out <merged.json>]', ' node plan.mjs extract <page.html> --out <plan.json>', ' node plan.mjs summary <plan.json>', ].join('\n'); export type PlanCommand = (typeof PLAN_COMMANDS)[number]; export interface PlanArgs { readonly command: PlanCommand; readonly input: string; readonly options: Readonly<Record<string, string>>; } export interface PlanIo { readText(path: string): string; writeText(path: string, text: string): void; readonly templatePath: string; } export interface PlanResult { readonly code: 0 | 1; readonly output: string; } /_* Parses `--name value` pairs (out, previous, data-out); throws on an unknown or unpaired option. _/ export function parsePlanOptions(rest: readonly string[]): Record<string, string> { if (rest.length % 2 !== 0) throw new Error(PLAN_USAGE); const options: Record<string, string> = {}; for (let i = 0; i < rest.length; i += 2) { const name = rest[i] ?? ''; if (!/^--(out|previous|data-out)$/.test(name)) { throw new Error(`Unknown option ${name}\n${PLAN_USAGE}`); } options[name.slice(2)] = rest[i + 1] ?? ''; } return options; } /_* Parses `<command> <input> [--name value]...`; throws with the usage text on anything else. _/ export function parsePlanArgs(argv: readonly string[]): PlanArgs { const [command = '', input = '', ...rest] = argv; const known = (PLAN_COMMANDS as readonly string[]).includes(command); if (!known || input === '' || input.startsWith('--')) throw new Error(PLAN_USAGE); return { command: command as PlanCommand, input, options: parsePlanOptions(rest) }; } /_* A failed result listing validation errors. _/ export function invalidResult(what: string, errors: readonly string[]): PlanResult { return { code: 1, output: [`✖ ${what} is invalid:`, ...errors.map((e) => `  - ${e}`)].join('\n'), }; } /_* Reads and parses a JSON file; throws naming the file when it is not JSON. _/ export function readJsonFile(io: PlanIo, path: string): unknown { try { return JSON.parse(io.readText(path)) as unknown; } catch (error) { throw new Error(`${path} is not valid JSON: ${(error as Error).message}`, { cause: error }); } } /_* One line per course: code, points missing to the goal and risk level; plus the counts. _/ export function planSummaryLines(plan: PlanData): string[] { const courses = plan.courses.map((course) => { const goal = course.goal ?? plan.goal; const level = riskLevel(course.points, goal, course.needsRecovery); return `${course.code}: faltam ${formatPoints(pointsMissing(course.points, goal))} de ${formatPoints(goal)} · ${level}`; }); const study = plan.study.reduce((n, d) => n + d.items.length, 0); const timeline = plan.timeline.reduce((n, d) => n + d.items.length, 0) + plan.undated.length; return [ ...courses, `itens: ${study} de estudo, ${timeline} na linha do tempo, ${plan.questions.length} perguntas`, ]; } /_* `validate`: checks the plan JSON. _/ export function runValidate(args: PlanArgs, io: PlanIo): PlanResult { const result = validatePlan(readJsonFile(io, args.input)); if (!result.ok) return invalidResult(args.input, result.errors); return { code: 0, output: ['✔ plan valid', ...planSummaryLines(result.plan)].join('\n') }; } /_* The previous version's plan, from its page; null without `--previous`. Throws when it is not a valid plan. _/ export function readPreviousPlan(args: PlanArgs, io: PlanIo): PlanData | null { const path = args.options.previous; if (path === undefined) return null; const result = validatePlan(extractPlan(io.readText(path))); if (!result.ok) throw new Error(`${path}: the previous plan is invalid:\n${result.errors.join('\n')}`); return result.plan; } /_* `build`: checks the shape, merges with the previous version, validates and writes the page (and the merged JSON). _/ export function runBuild(args: PlanArgs, io: PlanIo): PlanResult { const out = args.options.out; if (out === undefined) throw new Error(`build needs --out\n${PLAN_USAGE}`); const shape = planSchema.safeParse(readJsonFile(io, args.input)); if (!shape.success) return invalidResult(args.input, zodIssueLines(shape.error)); const merged = mergeWithPrevious(shape.data, readPreviousPlan(args, io)); const result = validatePlan(merged); if (!result.ok) return invalidResult(args.input, result.errors); io.writeText(out, injectPlan(io.readText(io.templatePath), result.plan)); const dataOut = args.options['data-out']; if (dataOut !== undefined) io.writeText(dataOut, `${JSON.stringify(result.plan, null, 2)}\n`); return { code: 0, output: [`✔ page written to ${out}`, ...planSummaryLines(result.plan)].join('\n'), }; } /_* `extract`: writes the plan JSON of a published page and says whether it is valid. _/ export function runExtract(args: PlanArgs, io: PlanIo): PlanResult { const out = args.options.out; if (out === undefined) throw new Error(`extract needs --out\n${PLAN_USAGE}`); const data = extractPlan(io.readText(args.input)); io.writeText(out, `${JSON.stringify(data, null, 2)}\n`); const result = validatePlan(data); return result.ok ? { code: 0, output: `✔ plan extracted to ${out}` } : invalidResult(`plan extracted to ${out}`, result.errors); } /_* `summary`: the per-course lines of a valid plan.
- **Input:** `args`: parsed arguments; `io`: file access.
- **Output:** The per-course lines, or the validation errors.
- **Effects:** Reads the input file.
- **Errors:** Read and JSON errors propagate.

### `runPlanCommand`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-cli-core.ts`
- **Signature:** `runPlanCommand(argv: readonly string[], io: PlanIo): PlanResult`
- **Used by:** `runPlanCli()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Commands of the `/planejamento-faculdade` script (`node scripts/plan.mjs <command>`): validate the plan JSON, build the page from the template (reusing the previous version's ids), extract the JSON of a published page and print a short summary. File access comes in through `PlanIo`, so the commands are tested without touching disk. / import { extractPlan, injectPlan } from './plan-embed.js'; import { mergeWithPrevious } from './plan-ids.js'; import { formatPoints, pointsMissing, riskLevel } from './plan-points.js'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { validatePlan, zodIssueLines } from './plan-validate.js'; /** Commands the script accepts. _/ export const PLAN_COMMANDS = ['validate', 'build', 'extract', 'summary'] as const; /_* Usage text printed on a wrong call. _/ export const PLAN_USAGE = [ 'Usage:', ' node plan.mjs validate <plan.json>', ' node plan.mjs build <plan.json> --out <page.html> [--previous <old-page.html>] [--data-out <merged.json>]', ' node plan.mjs extract <page.html> --out <plan.json>', ' node plan.mjs summary <plan.json>', ].join('\n'); export type PlanCommand = (typeof PLAN_COMMANDS)[number]; export interface PlanArgs { readonly command: PlanCommand; readonly input: string; readonly options: Readonly<Record<string, string>>; } export interface PlanIo { readText(path: string): string; writeText(path: string, text: string): void; readonly templatePath: string; } export interface PlanResult { readonly code: 0 | 1; readonly output: string; } /_* Parses `--name value` pairs (out, previous, data-out); throws on an unknown or unpaired option. _/ export function parsePlanOptions(rest: readonly string[]): Record<string, string> { if (rest.length % 2 !== 0) throw new Error(PLAN_USAGE); const options: Record<string, string> = {}; for (let i = 0; i < rest.length; i += 2) { const name = rest[i] ?? ''; if (!/^--(out|previous|data-out)$/.test(name)) { throw new Error(`Unknown option ${name}\n${PLAN_USAGE}`); } options[name.slice(2)] = rest[i + 1] ?? ''; } return options; } /_* Parses `<command> <input> [--name value]...`; throws with the usage text on anything else. _/ export function parsePlanArgs(argv: readonly string[]): PlanArgs { const [command = '', input = '', ...rest] = argv; const known = (PLAN_COMMANDS as readonly string[]).includes(command); if (!known || input === '' || input.startsWith('--')) throw new Error(PLAN_USAGE); return { command: command as PlanCommand, input, options: parsePlanOptions(rest) }; } /_* A failed result listing validation errors. _/ export function invalidResult(what: string, errors: readonly string[]): PlanResult { return { code: 1, output: [`✖ ${what} is invalid:`, ...errors.map((e) => `  - ${e}`)].join('\n'), }; } /_* Reads and parses a JSON file; throws naming the file when it is not JSON. _/ export function readJsonFile(io: PlanIo, path: string): unknown { try { return JSON.parse(io.readText(path)) as unknown; } catch (error) { throw new Error(`${path} is not valid JSON: ${(error as Error).message}`, { cause: error }); } } /_* One line per course: code, points missing to the goal and risk level; plus the counts. _/ export function planSummaryLines(plan: PlanData): string[] { const courses = plan.courses.map((course) => { const goal = course.goal ?? plan.goal; const level = riskLevel(course.points, goal, course.needsRecovery); return `${course.code}: faltam ${formatPoints(pointsMissing(course.points, goal))} de ${formatPoints(goal)} · ${level}`; }); const study = plan.study.reduce((n, d) => n + d.items.length, 0); const timeline = plan.timeline.reduce((n, d) => n + d.items.length, 0) + plan.undated.length; return [ ...courses, `itens: ${study} de estudo, ${timeline} na linha do tempo, ${plan.questions.length} perguntas`, ]; } /_* `validate`: checks the plan JSON. _/ export function runValidate(args: PlanArgs, io: PlanIo): PlanResult { const result = validatePlan(readJsonFile(io, args.input)); if (!result.ok) return invalidResult(args.input, result.errors); return { code: 0, output: ['✔ plan valid', ...planSummaryLines(result.plan)].join('\n') }; } /_* The previous version's plan, from its page; null without `--previous`. Throws when it is not a valid plan. _/ export function readPreviousPlan(args: PlanArgs, io: PlanIo): PlanData | null { const path = args.options.previous; if (path === undefined) return null; const result = validatePlan(extractPlan(io.readText(path))); if (!result.ok) throw new Error(`${path}: the previous plan is invalid:\n${result.errors.join('\n')}`); return result.plan; } /_* `build`: checks the shape, merges with the previous version, validates and writes the page (and the merged JSON). _/ export function runBuild(args: PlanArgs, io: PlanIo): PlanResult { const out = args.options.out; if (out === undefined) throw new Error(`build needs --out\n${PLAN_USAGE}`); const shape = planSchema.safeParse(readJsonFile(io, args.input)); if (!shape.success) return invalidResult(args.input, zodIssueLines(shape.error)); const merged = mergeWithPrevious(shape.data, readPreviousPlan(args, io)); const result = validatePlan(merged); if (!result.ok) return invalidResult(args.input, result.errors); io.writeText(out, injectPlan(io.readText(io.templatePath), result.plan)); const dataOut = args.options['data-out']; if (dataOut !== undefined) io.writeText(dataOut, `${JSON.stringify(result.plan, null, 2)}\n`); return { code: 0, output: [`✔ page written to ${out}`, ...planSummaryLines(result.plan)].join('\n'), }; } /_* `extract`: writes the plan JSON of a published page and says whether it is valid. _/ export function runExtract(args: PlanArgs, io: PlanIo): PlanResult { const out = args.options.out; if (out === undefined) throw new Error(`extract needs --out\n${PLAN_USAGE}`); const data = extractPlan(io.readText(args.input)); io.writeText(out, `${JSON.stringify(data, null, 2)}\n`); const result = validatePlan(data); return result.ok ? { code: 0, output: `✔ plan extracted to ${out}` } : invalidResult(`plan extracted to ${out}`, result.errors); } /_* `summary`: the per-course lines of a valid plan. _/ export function runSummary(args: PlanArgs, io: PlanIo): PlanResult { const result = validatePlan(readJsonFile(io, args.input)); if (!result.ok) return invalidResult(args.input, result.errors); return { code: 0, output: planSummaryLines(result.plan).join('\n') }; } /_* Runs a command line; usage and file errors become a failed result instead of an exception.
- **Input:** `argv`: arguments; `io`: file access.
- **Output:** `{code, output}`; usage, file and validation problems become `code: 1`.
- **Effects:** Whatever the dispatched command does through `io`.
- **Errors:** None (every error becomes a failed result).

## `connectors/canvas-puc/src/plan/plan-cli.ts`

### `runPlanCli`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-cli.ts`
- **Signature:** `runPlanCli(): void`
- **Used by:** `connectors/canvas-puc/src/plan/plan-cli.ts (module)`
- **Processes:** —

<!-- generated:end -->

- **Does:** Entry of the `/planejamento-faculdade` script, bundled to `plugin/skills/planejamento-faculdade/scripts/plan.mjs` by `npm run build`: wires the real file system into the tested commands of plan-cli-core.ts. / import { readFileSync, writeFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { runPlanCommand } from './plan-cli-core.js'; /** Runs the script with the process arguments and exits with its code.
- **Input:** None (reads `process.argv`).
- **Output:** Nothing.
- **Effects:** Reads and writes files, prints to stdout/stderr and sets `process.exitCode`.
- **Errors:** None (errors become exit code 1).

## `connectors/canvas-puc/src/plan/plan-embed.ts`

### `planTitle`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-embed.ts`
- **Signature:** `planTitle(term: string): string`
- **Used by:** `injectPlan()`, `renderHeader()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Puts the plan JSON into the page template and takes it back out of a published page. The JSON lives in a single `<script id="plan-data" type="application/json">` block, with `<`, `>`, `&` and the JavaScript line separators escaped, so no text from Canvas, email or WhatsApp can close the tag. Pure. / import type { PlanData } from './plan-schema.js'; /** The data block: opening tag, JSON, closing tag. _/ export const PLAN_DATA_PATTERN = /(<script id="plan-data" type="application\/json">)([\s\S]_?)(<\/script>)/g; /** The page title element. _/ export const TITLE_PATTERN = /<title>[\s\S]_?<\/title>/g; const JSON_ESCAPES: Record<string, string> = { '<': '\\u003c', '>': '\\u003e', '&': '\\u0026', '\u2028': '\\u2028', '\u2029': '\\u2029', }; const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', }; /** Plan title shown in the page and used to find the artifact: "Plano do Semestre 2026/2".
- **Input:** `term`: `YYYY/S`.
- **Output:** `Plano do Semestre <term>`.
- **Effects:** None (pure).
- **Errors:** None.

### `serializePlanJson`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-embed.ts`
- **Signature:** `serializePlanJson(plan: PlanData): string`
- **Used by:** `injectPlan()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Puts the plan JSON into the page template and takes it back out of a published page. The JSON lives in a single `<script id="plan-data" type="application/json">` block, with `<`, `>`, `&` and the JavaScript line separators escaped, so no text from Canvas, email or WhatsApp can close the tag. Pure. / import type { PlanData } from './plan-schema.js'; /** The data block: opening tag, JSON, closing tag. _/ export const PLAN_DATA_PATTERN = /(<script id="plan-data" type="application\/json">)([\s\S]_?)(<\/script>)/g; /** The page title element. _/ export const TITLE_PATTERN = /<title>[\s\S]_?<\/title>/g; const JSON_ESCAPES: Record<string, string> = { '<': '\\u003c', '>': '\\u003e', '&': '\\u0026', '\u2028': '\\u2028', '\u2029': '\\u2029', }; const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', }; /** Plan title shown in the page and used to find the artifact: "Plano do Semestre 2026/2". _/ export function planTitle(term: string): string { return `Plano do Semestre ${term}`; } /_* JSON of the plan, safe inside a `<script>` element (still valid JSON).
- **Input:** `plan`: plan.
- **Output:** Valid JSON with `<`, `>`, `&`, U+2028 and U+2029 escaped as `\uXXXX`.
- **Effects:** None (pure).
- **Errors:** None.

### `escapeHtmlText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-embed.ts`
- **Signature:** `escapeHtmlText(value: string): string`
- **Used by:** `injectPlan()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Puts the plan JSON into the page template and takes it back out of a published page. The JSON lives in a single `<script id="plan-data" type="application/json">` block, with `<`, `>`, `&` and the JavaScript line separators escaped, so no text from Canvas, email or WhatsApp can close the tag. Pure. / import type { PlanData } from './plan-schema.js'; /** The data block: opening tag, JSON, closing tag. _/ export const PLAN_DATA_PATTERN = /(<script id="plan-data" type="application\/json">)([\s\S]_?)(<\/script>)/g; /** The page title element. _/ export const TITLE_PATTERN = /<title>[\s\S]_?<\/title>/g; const JSON_ESCAPES: Record<string, string> = { '<': '\\u003c', '>': '\\u003e', '&': '\\u0026', '\u2028': '\\u2028', '\u2029': '\\u2029', }; const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', }; /** Plan title shown in the page and used to find the artifact: "Plano do Semestre 2026/2". _/ export function planTitle(term: string): string { return `Plano do Semestre ${term}`; } /_* JSON of the plan, safe inside a `<script>` element (still valid JSON). _/ export function serializePlanJson(plan: PlanData): string { return JSON.stringify(plan).replace(/[<>&\u2028\u2029]/g, (char) => JSON_ESCAPES[char] ?? char); } /_* Text escaped for HTML content and attribute values.
- **Input:** `value`: text.
- **Output:** Text with `& < > " '` escaped for HTML.
- **Effects:** None (pure).
- **Errors:** None.

### `countMatches`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-embed.ts`
- **Signature:** `countMatches(text: string, pattern: RegExp): number`
- **Used by:** `injectPlan()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Puts the plan JSON into the page template and takes it back out of a published page. The JSON lives in a single `<script id="plan-data" type="application/json">` block, with `<`, `>`, `&` and the JavaScript line separators escaped, so no text from Canvas, email or WhatsApp can close the tag. Pure. / import type { PlanData } from './plan-schema.js'; /** The data block: opening tag, JSON, closing tag. _/ export const PLAN_DATA_PATTERN = /(<script id="plan-data" type="application\/json">)([\s\S]_?)(<\/script>)/g; /** The page title element. _/ export const TITLE_PATTERN = /<title>[\s\S]_?<\/title>/g; const JSON_ESCAPES: Record<string, string> = { '<': '\\u003c', '>': '\\u003e', '&': '\\u0026', '\u2028': '\\u2028', '\u2029': '\\u2029', }; const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', }; /** Plan title shown in the page and used to find the artifact: "Plano do Semestre 2026/2". _/ export function planTitle(term: string): string { return `Plano do Semestre ${term}`; } /_* JSON of the plan, safe inside a `<script>` element (still valid JSON). _/ export function serializePlanJson(plan: PlanData): string { return JSON.stringify(plan).replace(/[<>&\u2028\u2029]/g, (char) => JSON_ESCAPES[char] ?? char); } /_* Text escaped for HTML content and attribute values. _/ export function escapeHtmlText(value: string): string { return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char); } /_* Number of matches of a global pattern in a text.
- **Input:** `text`: text; `pattern`: global regex.
- **Output:** Number of matches.
- **Effects:** None (pure).
- **Errors:** None.

### `injectPlan`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-embed.ts`
- **Signature:** `injectPlan(template: string, plan: PlanData): string`
- **Used by:** `runBuild()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Puts the plan JSON into the page template and takes it back out of a published page. The JSON lives in a single `<script id="plan-data" type="application/json">` block, with `<`, `>`, `&` and the JavaScript line separators escaped, so no text from Canvas, email or WhatsApp can close the tag. Pure. / import type { PlanData } from './plan-schema.js'; /** The data block: opening tag, JSON, closing tag. _/ export const PLAN_DATA_PATTERN = /(<script id="plan-data" type="application\/json">)([\s\S]_?)(<\/script>)/g; /** The page title element. _/ export const TITLE_PATTERN = /<title>[\s\S]_?<\/title>/g; const JSON_ESCAPES: Record<string, string> = { '<': '\\u003c', '>': '\\u003e', '&': '\\u0026', '\u2028': '\\u2028', '\u2029': '\\u2029', }; const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', }; /** Plan title shown in the page and used to find the artifact: "Plano do Semestre 2026/2". _/ export function planTitle(term: string): string { return `Plano do Semestre ${term}`; } /_* JSON of the plan, safe inside a `<script>` element (still valid JSON). _/ export function serializePlanJson(plan: PlanData): string { return JSON.stringify(plan).replace(/[<>&\u2028\u2029]/g, (char) => JSON_ESCAPES[char] ?? char); } /_* Text escaped for HTML content and attribute values. _/ export function escapeHtmlText(value: string): string { return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char); } /_* Number of matches of a global pattern in a text. _/ export function countMatches(text: string, pattern: RegExp): number { return [...text.matchAll(pattern)].length; } /_* Page HTML: the template with the plan JSON and the title filled in. Throws if the template has no single slot.
- **Input:** `template`: page template; `plan`: plan.
- **Output:** Page HTML with the JSON in `#plan-data` and the `<title>` set.
- **Effects:** None (pure).
- **Errors:** Throws when the template lacks exactly one data block or one `<title>`.

### `extractPlan`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-embed.ts`
- **Signature:** `extractPlan(html: string): unknown`
- **Used by:** `readPreviousPlan()`, `runExtract()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Puts the plan JSON into the page template and takes it back out of a published page. The JSON lives in a single `<script id="plan-data" type="application/json">` block, with `<`, `>`, `&` and the JavaScript line separators escaped, so no text from Canvas, email or WhatsApp can close the tag. Pure. / import type { PlanData } from './plan-schema.js'; /** The data block: opening tag, JSON, closing tag. _/ export const PLAN_DATA_PATTERN = /(<script id="plan-data" type="application\/json">)([\s\S]_?)(<\/script>)/g; /** The page title element. _/ export const TITLE_PATTERN = /<title>[\s\S]_?<\/title>/g; const JSON_ESCAPES: Record<string, string> = { '<': '\\u003c', '>': '\\u003e', '&': '\\u0026', '\u2028': '\\u2028', '\u2029': '\\u2029', }; const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', }; /** Plan title shown in the page and used to find the artifact: "Plano do Semestre 2026/2". _/ export function planTitle(term: string): string { return `Plano do Semestre ${term}`; } /_* JSON of the plan, safe inside a `<script>` element (still valid JSON). _/ export function serializePlanJson(plan: PlanData): string { return JSON.stringify(plan).replace(/[<>&\u2028\u2029]/g, (char) => JSON_ESCAPES[char] ?? char); } /_* Text escaped for HTML content and attribute values. _/ export function escapeHtmlText(value: string): string { return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char); } /_* Number of matches of a global pattern in a text. _/ export function countMatches(text: string, pattern: RegExp): number { return [...text.matchAll(pattern)].length; } /_* Page HTML: the template with the plan JSON and the title filled in. Throws if the template has no single slot. _/ export function injectPlan(template: string, plan: PlanData): string { if ( countMatches(template, PLAN_DATA_PATTERN) !== 1 || countMatches(template, TITLE_PATTERN) !== 1 ) { throw new Error( 'The template must have exactly one <title> and one <script id="plan-data" type="application/json">: rebuild it with `npm run build`.', ); } const json = serializePlanJson(plan); const page = template.replace(PLAN_DATA_PATTERN, (block) => block.replace(/>[\s\S]_<\/script>$/, () => `>${json}</script>`), ); const title = `<title>${escapeHtmlText(planTitle(plan.term))}</title>`; return page.replace(TITLE_PATTERN, () => title); } /** The plan JSON of a page built by `injectPlan` (not validated). Throws if the page has no single data block.
- **Input:** `html`: published page.
- **Output:** The parsed JSON of `#plan-data` (not validated).
- **Effects:** None (pure).
- **Errors:** Throws when there is not exactly one data block; `JSON.parse` errors propagate.

## `connectors/canvas-puc/src/plan/plan-ids.ts`

### `normalizeMatchText`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-ids.ts`
- **Signature:** `normalizeMatchText(value: string): string`
- **Used by:** `itemMatchKey()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Stable ids for checklist items and questions across plan updates (the saved ticks depend on them): new items without an id reuse the id of the same item in the previous version, or get a deterministic one; items of the previous version that the new one left out are carried over, never deleted. Pure. / import type { PlanData, StudyDay, TimelineDay } from './plan-schema.js'; type IdKind = 's' | 't' | 'u' | 'q'; interface IdEntry { readonly kind: IdKind; readonly key: string; readonly item: { id?: string | undefined }; } /** Lowercase text without accents, with every run of other characters as one hyphen.
- **Input:** `value`: text.
- **Output:** Lowercase text without accents, other characters collapsed to single hyphens, trimmed.
- **Effects:** None (pure).
- **Errors:** None.

### `fnvHash36`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-ids.ts`
- **Signature:** `fnvHash36(value: string): string`
- **Used by:** `stableItemId()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Stable ids for checklist items and questions across plan updates (the saved ticks depend on them): new items without an id reuse the id of the same item in the previous version, or get a deterministic one; items of the previous version that the new one left out are carried over, never deleted. Pure. / import type { PlanData, StudyDay, TimelineDay } from './plan-schema.js'; type IdKind = 's' | 't' | 'u' | 'q'; interface IdEntry { readonly kind: IdKind; readonly key: string; readonly item: { id?: string | undefined }; } /** Lowercase text without accents, with every run of other characters as one hyphen. _/ export function normalizeMatchText(value: string): string { return value .normalize('NFD') .replace(/[\u0300-\u036f]/g, '') .toLowerCase() .replace(/[^a-z0-9]+/g, '-') .replace(/^-|-$/g, ''); } /_* 32-bit FNV-1a hash of a text, in base 36.
- **Input:** `value`: text.
- **Output:** 32-bit FNV-1a hash in base 36.
- **Effects:** None (pure).
- **Errors:** None.

### `stableItemId`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-ids.ts`
- **Signature:** `stableItemId(kind: IdKind, key: string, taken: ReadonlySet<string>): string`
- **Used by:** `assignPlanIds()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Stable ids for checklist items and questions across plan updates (the saved ticks depend on them): new items without an id reuse the id of the same item in the previous version, or get a deterministic one; items of the previous version that the new one left out are carried over, never deleted. Pure. / import type { PlanData, StudyDay, TimelineDay } from './plan-schema.js'; type IdKind = 's' | 't' | 'u' | 'q'; interface IdEntry { readonly kind: IdKind; readonly key: string; readonly item: { id?: string | undefined }; } /** Lowercase text without accents, with every run of other characters as one hyphen. _/ export function normalizeMatchText(value: string): string { return value .normalize('NFD') .replace(/[\u0300-\u036f]/g, '') .toLowerCase() .replace(/[^a-z0-9]+/g, '-') .replace(/^-|-$/g, ''); } /_* 32-bit FNV-1a hash of a text, in base 36. _/ export function fnvHash36(value: string): string { let hash = 0x811c9dc5; for (const char of value) { hash ^= char.codePointAt(0) ?? 0; hash = Math.imul(hash, 0x01000193) >>> 0; } return hash.toString(36); } /_* Deterministic id for a key, with a numeric suffix when the base id is already taken.
- **Input:** `kind`: `s`/`t`/`u`/`q`; `key`: matching key; `taken`: ids in use.
- **Output:** `<kind>-<hash>`, with `-2`, `-3`... when taken.
- **Effects:** None (pure).
- **Errors:** None.

### `itemMatchKey`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-ids.ts`
- **Signature:** `itemMatchKey(kind: IdKind, parts: readonly string[]): string`
- **Used by:** `idEntry()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Stable ids for checklist items and questions across plan updates (the saved ticks depend on them): new items without an id reuse the id of the same item in the previous version, or get a deterministic one; items of the previous version that the new one left out are carried over, never deleted. Pure. / import type { PlanData, StudyDay, TimelineDay } from './plan-schema.js'; type IdKind = 's' | 't' | 'u' | 'q'; interface IdEntry { readonly kind: IdKind; readonly key: string; readonly item: { id?: string | undefined }; } /** Lowercase text without accents, with every run of other characters as one hyphen. _/ export function normalizeMatchText(value: string): string { return value .normalize('NFD') .replace(/[\u0300-\u036f]/g, '') .toLowerCase() .replace(/[^a-z0-9]+/g, '-') .replace(/^-|-$/g, ''); } /_* 32-bit FNV-1a hash of a text, in base 36. _/ export function fnvHash36(value: string): string { let hash = 0x811c9dc5; for (const char of value) { hash ^= char.codePointAt(0) ?? 0; hash = Math.imul(hash, 0x01000193) >>> 0; } return hash.toString(36); } /_* Deterministic id for a key, with a numeric suffix when the base id is already taken. _/ export function stableItemId(kind: IdKind, key: string, taken: ReadonlySet<string>): string { const base = `${kind}-${fnvHash36(key)}`; let id = base; for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`; return id; } /_* Matching key of an item: its kind and parts (date, course, title) normalized and joined.
- **Input:** `kind`: item kind; `parts`: date, course and title (or course and text).
- **Output:** Normalized parts joined with `|` after the kind.
- **Effects:** None (pure).
- **Errors:** None.

### `idEntry`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-ids.ts`
- **Signature:** `idEntry(kind: IdKind, parts: readonly string[], item: IdEntry['item']): IdEntry`
- **Used by:** `planIdEntries()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Stable ids for checklist items and questions across plan updates (the saved ticks depend on them): new items without an id reuse the id of the same item in the previous version, or get a deterministic one; items of the previous version that the new one left out are carried over, never deleted. Pure. / import type { PlanData, StudyDay, TimelineDay } from './plan-schema.js'; type IdKind = 's' | 't' | 'u' | 'q'; interface IdEntry { readonly kind: IdKind; readonly key: string; readonly item: { id?: string | undefined }; } /** Lowercase text without accents, with every run of other characters as one hyphen. _/ export function normalizeMatchText(value: string): string { return value .normalize('NFD') .replace(/[\u0300-\u036f]/g, '') .toLowerCase() .replace(/[^a-z0-9]+/g, '-') .replace(/^-|-$/g, ''); } /_* 32-bit FNV-1a hash of a text, in base 36. _/ export function fnvHash36(value: string): string { let hash = 0x811c9dc5; for (const char of value) { hash ^= char.codePointAt(0) ?? 0; hash = Math.imul(hash, 0x01000193) >>> 0; } return hash.toString(36); } /_* Deterministic id for a key, with a numeric suffix when the base id is already taken. _/ export function stableItemId(kind: IdKind, key: string, taken: ReadonlySet<string>): string { const base = `${kind}-${fnvHash36(key)}`; let id = base; for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`; return id; } /_* Matching key of an item: its kind and parts (date, course, title) normalized and joined. _/ export function itemMatchKey(kind: IdKind, parts: readonly string[]): string { return [kind, ...parts].map(normalizeMatchText).join('|'); } /_* Id entry of an item, keyed by its kind and parts.
- **Input:** `kind`: item kind; `parts`: key parts; `item`: the item object.
- **Output:** `{kind, key, item}`.
- **Effects:** None (pure).
- **Errors:** None.

### `planIdEntries`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-ids.ts`
- **Signature:** `planIdEntries(plan: PlanData): IdEntry[]`
- **Used by:** `assignPlanIds()`, `carryPreviousItems()`, `previousIdIndex()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Stable ids for checklist items and questions across plan updates (the saved ticks depend on them): new items without an id reuse the id of the same item in the previous version, or get a deterministic one; items of the previous version that the new one left out are carried over, never deleted. Pure. / import type { PlanData, StudyDay, TimelineDay } from './plan-schema.js'; type IdKind = 's' | 't' | 'u' | 'q'; interface IdEntry { readonly kind: IdKind; readonly key: string; readonly item: { id?: string | undefined }; } /** Lowercase text without accents, with every run of other characters as one hyphen. _/ export function normalizeMatchText(value: string): string { return value .normalize('NFD') .replace(/[\u0300-\u036f]/g, '') .toLowerCase() .replace(/[^a-z0-9]+/g, '-') .replace(/^-|-$/g, ''); } /_* 32-bit FNV-1a hash of a text, in base 36. _/ export function fnvHash36(value: string): string { let hash = 0x811c9dc5; for (const char of value) { hash ^= char.codePointAt(0) ?? 0; hash = Math.imul(hash, 0x01000193) >>> 0; } return hash.toString(36); } /_* Deterministic id for a key, with a numeric suffix when the base id is already taken. _/ export function stableItemId(kind: IdKind, key: string, taken: ReadonlySet<string>): string { const base = `${kind}-${fnvHash36(key)}`; let id = base; for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`; return id; } /_* Matching key of an item: its kind and parts (date, course, title) normalized and joined. _/ export function itemMatchKey(kind: IdKind, parts: readonly string[]): string { return [kind, ...parts].map(normalizeMatchText).join('|'); } /_* Id entry of an item, keyed by its kind and parts. _/ export function idEntry(kind: IdKind, parts: readonly string[], item: IdEntry['item']): IdEntry { return { kind, key: itemMatchKey(kind, parts), item }; } /_* Every item of a plan with its matching key (kind, date, course and normalized title).
- **Input:** `plan`: plan (ids optional).
- **Output:** Every study, timeline, undated and question item with its matching key (references to the plan objects).
- **Effects:** None (pure).
- **Errors:** None.

### `previousIdIndex`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-ids.ts`
- **Signature:** `previousIdIndex(previous: PlanData | null): Map<string, string>`
- **Used by:** `assignPlanIds()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Stable ids for checklist items and questions across plan updates (the saved ticks depend on them): new items without an id reuse the id of the same item in the previous version, or get a deterministic one; items of the previous version that the new one left out are carried over, never deleted. Pure. / import type { PlanData, StudyDay, TimelineDay } from './plan-schema.js'; type IdKind = 's' | 't' | 'u' | 'q'; interface IdEntry { readonly kind: IdKind; readonly key: string; readonly item: { id?: string | undefined }; } /** Lowercase text without accents, with every run of other characters as one hyphen. _/ export function normalizeMatchText(value: string): string { return value .normalize('NFD') .replace(/[\u0300-\u036f]/g, '') .toLowerCase() .replace(/[^a-z0-9]+/g, '-') .replace(/^-|-$/g, ''); } /_* 32-bit FNV-1a hash of a text, in base 36. _/ export function fnvHash36(value: string): string { let hash = 0x811c9dc5; for (const char of value) { hash ^= char.codePointAt(0) ?? 0; hash = Math.imul(hash, 0x01000193) >>> 0; } return hash.toString(36); } /_* Deterministic id for a key, with a numeric suffix when the base id is already taken. _/ export function stableItemId(kind: IdKind, key: string, taken: ReadonlySet<string>): string { const base = `${kind}-${fnvHash36(key)}`; let id = base; for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`; return id; } /_* Matching key of an item: its kind and parts (date, course, title) normalized and joined. _/ export function itemMatchKey(kind: IdKind, parts: readonly string[]): string { return [kind, ...parts].map(normalizeMatchText).join('|'); } /_* Id entry of an item, keyed by its kind and parts. _/ export function idEntry(kind: IdKind, parts: readonly string[], item: IdEntry['item']): IdEntry { return { kind, key: itemMatchKey(kind, parts), item }; } /_* Every item of a plan with its matching key (kind, date, course and normalized title). _/ export function planIdEntries(plan: PlanData): IdEntry[] { return [ ...plan.study.flatMap((d) => d.items.map((it) => idEntry('s', [d.date, it.course, it.task], it)), ), ...plan.timeline.flatMap((d) => d.items.map((it) => idEntry('t', [d.date, it.course, it.title], it)), ), ...plan.undated.map((it) => idEntry('u', [it.course, it.title], it)), ...plan.questions.map((it) => idEntry('q', [it.course, it.text], it)), ]; } /_* Map from matching key to id, for the items of a previous plan that have one.
- **Input:** `previous`: previous plan or `null`.
- **Output:** Map from matching key to id (first id wins); empty without a previous plan.
- **Effects:** None (pure).
- **Errors:** None.

### `assignPlanIds`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-ids.ts`
- **Signature:** `assignPlanIds(next: PlanData, previous: PlanData | null): PlanData`
- **Used by:** `mergeWithPrevious()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Stable ids for checklist items and questions across plan updates (the saved ticks depend on them): new items without an id reuse the id of the same item in the previous version, or get a deterministic one; items of the previous version that the new one left out are carried over, never deleted. Pure. / import type { PlanData, StudyDay, TimelineDay } from './plan-schema.js'; type IdKind = 's' | 't' | 'u' | 'q'; interface IdEntry { readonly kind: IdKind; readonly key: string; readonly item: { id?: string | undefined }; } /** Lowercase text without accents, with every run of other characters as one hyphen. _/ export function normalizeMatchText(value: string): string { return value .normalize('NFD') .replace(/[\u0300-\u036f]/g, '') .toLowerCase() .replace(/[^a-z0-9]+/g, '-') .replace(/^-|-$/g, ''); } /_* 32-bit FNV-1a hash of a text, in base 36. _/ export function fnvHash36(value: string): string { let hash = 0x811c9dc5; for (const char of value) { hash ^= char.codePointAt(0) ?? 0; hash = Math.imul(hash, 0x01000193) >>> 0; } return hash.toString(36); } /_* Deterministic id for a key, with a numeric suffix when the base id is already taken. _/ export function stableItemId(kind: IdKind, key: string, taken: ReadonlySet<string>): string { const base = `${kind}-${fnvHash36(key)}`; let id = base; for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`; return id; } /_* Matching key of an item: its kind and parts (date, course, title) normalized and joined. _/ export function itemMatchKey(kind: IdKind, parts: readonly string[]): string { return [kind, ...parts].map(normalizeMatchText).join('|'); } /_* Id entry of an item, keyed by its kind and parts. _/ export function idEntry(kind: IdKind, parts: readonly string[], item: IdEntry['item']): IdEntry { return { kind, key: itemMatchKey(kind, parts), item }; } /_* Every item of a plan with its matching key (kind, date, course and normalized title). _/ export function planIdEntries(plan: PlanData): IdEntry[] { return [ ...plan.study.flatMap((d) => d.items.map((it) => idEntry('s', [d.date, it.course, it.task], it)), ), ...plan.timeline.flatMap((d) => d.items.map((it) => idEntry('t', [d.date, it.course, it.title], it)), ), ...plan.undated.map((it) => idEntry('u', [it.course, it.title], it)), ...plan.questions.map((it) => idEntry('q', [it.course, it.text], it)), ]; } /_* Map from matching key to id, for the items of a previous plan that have one. _/ export function previousIdIndex(previous: PlanData | null): Map<string, string> { const index = new Map<string, string>(); for (const entry of previous ? planIdEntries(previous) : []) { if (entry.item.id !== undefined && !index.has(entry.key)) index.set(entry.key, entry.item.id); } return index; } /_* Copy of the plan where every item without an id gets the previous version's id or a new stable one.
- **Input:** `next`: new plan; `previous`: previous plan or `null`.
- **Output:** Copy of `next` where every missing id is the previous version's id for the same item or a new stable id.
- **Effects:** None (pure).
- **Errors:** None.

### `carryDays`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-ids.ts`
- **Signature:** `carryDays(days: readonly D[], previousDays: readonly D[], keep: (id: string | undefined) => boolean): D[]`
- **Used by:** `carryPreviousItems()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Stable ids for checklist items and questions across plan updates (the saved ticks depend on them): new items without an id reuse the id of the same item in the previous version, or get a deterministic one; items of the previous version that the new one left out are carried over, never deleted. Pure. / import type { PlanData, StudyDay, TimelineDay } from './plan-schema.js'; type IdKind = 's' | 't' | 'u' | 'q'; interface IdEntry { readonly kind: IdKind; readonly key: string; readonly item: { id?: string | undefined }; } /** Lowercase text without accents, with every run of other characters as one hyphen. _/ export function normalizeMatchText(value: string): string { return value .normalize('NFD') .replace(/[\u0300-\u036f]/g, '') .toLowerCase() .replace(/[^a-z0-9]+/g, '-') .replace(/^-|-$/g, ''); } /_* 32-bit FNV-1a hash of a text, in base 36. _/ export function fnvHash36(value: string): string { let hash = 0x811c9dc5; for (const char of value) { hash ^= char.codePointAt(0) ?? 0; hash = Math.imul(hash, 0x01000193) >>> 0; } return hash.toString(36); } /_* Deterministic id for a key, with a numeric suffix when the base id is already taken. _/ export function stableItemId(kind: IdKind, key: string, taken: ReadonlySet<string>): string { const base = `${kind}-${fnvHash36(key)}`; let id = base; for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`; return id; } /_* Matching key of an item: its kind and parts (date, course, title) normalized and joined. _/ export function itemMatchKey(kind: IdKind, parts: readonly string[]): string { return [kind, ...parts].map(normalizeMatchText).join('|'); } /_* Id entry of an item, keyed by its kind and parts. _/ export function idEntry(kind: IdKind, parts: readonly string[], item: IdEntry['item']): IdEntry { return { kind, key: itemMatchKey(kind, parts), item }; } /_* Every item of a plan with its matching key (kind, date, course and normalized title). _/ export function planIdEntries(plan: PlanData): IdEntry[] { return [ ...plan.study.flatMap((d) => d.items.map((it) => idEntry('s', [d.date, it.course, it.task], it)), ), ...plan.timeline.flatMap((d) => d.items.map((it) => idEntry('t', [d.date, it.course, it.title], it)), ), ...plan.undated.map((it) => idEntry('u', [it.course, it.title], it)), ...plan.questions.map((it) => idEntry('q', [it.course, it.text], it)), ]; } /_* Map from matching key to id, for the items of a previous plan that have one. _/ export function previousIdIndex(previous: PlanData | null): Map<string, string> { const index = new Map<string, string>(); for (const entry of previous ? planIdEntries(previous) : []) { if (entry.item.id !== undefined && !index.has(entry.key)) index.set(entry.key, entry.item.id); } return index; } /_* Copy of the plan where every item without an id gets the previous version's id or a new stable one. _/ export function assignPlanIds(next: PlanData, previous: PlanData | null): PlanData { const plan = structuredClone(next); const entries = planIdEntries(plan); const taken = new Set(entries.flatMap((e) => (e.item.id === undefined ? [] : [e.item.id]))); const index = previousIdIndex(previous); for (const entry of entries.filter((e) => e.item.id === undefined)) { const reused = index.get(entry.key); const id = reused !== undefined && !taken.has(reused) ? reused : stableItemId(entry.kind, entry.key, taken); entry.item.id = id; taken.add(id); } return plan; } /_* Copy of the day list with the previous day's left-out items added back (the day is recreated if missing).
- **Input:** `days`: new days; `previousDays`: previous days; `keep`: which previous ids to carry.
- **Output:** Copy of `days` with the kept previous items added back (the day is recreated when missing), sorted by date.
- **Effects:** None (pure).
- **Errors:** None.

### `carryPreviousItems`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-ids.ts`
- **Signature:** `carryPreviousItems(next: PlanData, previous: PlanData): PlanData`
- **Used by:** `mergeWithPrevious()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Stable ids for checklist items and questions across plan updates (the saved ticks depend on them): new items without an id reuse the id of the same item in the previous version, or get a deterministic one; items of the previous version that the new one left out are carried over, never deleted. Pure. / import type { PlanData, StudyDay, TimelineDay } from './plan-schema.js'; type IdKind = 's' | 't' | 'u' | 'q'; interface IdEntry { readonly kind: IdKind; readonly key: string; readonly item: { id?: string | undefined }; } /** Lowercase text without accents, with every run of other characters as one hyphen. _/ export function normalizeMatchText(value: string): string { return value .normalize('NFD') .replace(/[\u0300-\u036f]/g, '') .toLowerCase() .replace(/[^a-z0-9]+/g, '-') .replace(/^-|-$/g, ''); } /_* 32-bit FNV-1a hash of a text, in base 36. _/ export function fnvHash36(value: string): string { let hash = 0x811c9dc5; for (const char of value) { hash ^= char.codePointAt(0) ?? 0; hash = Math.imul(hash, 0x01000193) >>> 0; } return hash.toString(36); } /_* Deterministic id for a key, with a numeric suffix when the base id is already taken. _/ export function stableItemId(kind: IdKind, key: string, taken: ReadonlySet<string>): string { const base = `${kind}-${fnvHash36(key)}`; let id = base; for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`; return id; } /_* Matching key of an item: its kind and parts (date, course, title) normalized and joined. _/ export function itemMatchKey(kind: IdKind, parts: readonly string[]): string { return [kind, ...parts].map(normalizeMatchText).join('|'); } /_* Id entry of an item, keyed by its kind and parts. _/ export function idEntry(kind: IdKind, parts: readonly string[], item: IdEntry['item']): IdEntry { return { kind, key: itemMatchKey(kind, parts), item }; } /_* Every item of a plan with its matching key (kind, date, course and normalized title). _/ export function planIdEntries(plan: PlanData): IdEntry[] { return [ ...plan.study.flatMap((d) => d.items.map((it) => idEntry('s', [d.date, it.course, it.task], it)), ), ...plan.timeline.flatMap((d) => d.items.map((it) => idEntry('t', [d.date, it.course, it.title], it)), ), ...plan.undated.map((it) => idEntry('u', [it.course, it.title], it)), ...plan.questions.map((it) => idEntry('q', [it.course, it.text], it)), ]; } /_* Map from matching key to id, for the items of a previous plan that have one. _/ export function previousIdIndex(previous: PlanData | null): Map<string, string> { const index = new Map<string, string>(); for (const entry of previous ? planIdEntries(previous) : []) { if (entry.item.id !== undefined && !index.has(entry.key)) index.set(entry.key, entry.item.id); } return index; } /_* Copy of the plan where every item without an id gets the previous version's id or a new stable one. _/ export function assignPlanIds(next: PlanData, previous: PlanData | null): PlanData { const plan = structuredClone(next); const entries = planIdEntries(plan); const taken = new Set(entries.flatMap((e) => (e.item.id === undefined ? [] : [e.item.id]))); const index = previousIdIndex(previous); for (const entry of entries.filter((e) => e.item.id === undefined)) { const reused = index.get(entry.key); const id = reused !== undefined && !taken.has(reused) ? reused : stableItemId(entry.kind, entry.key, taken); entry.item.id = id; taken.add(id); } return plan; } /_* Copy of the day list with the previous day's left-out items added back (the day is recreated if missing). _/ export function carryDays<D extends StudyDay | TimelineDay>( days: readonly D[], previousDays: readonly D[], keep: (id: string | undefined) => boolean, ): D[] { const result = structuredClone([...days]); for (const previous of previousDays) { const left = previous.items.filter((item) => keep(item.id)); if (left.length === 0) continue; let day = result.find((d) => d.date === previous.date); if (!day) { day = { ...structuredClone(previous), items: [] }; result.push(day); } (day.items as D['items'][number][]).push(...structuredClone(left)); } return result.sort((a, b) => a.date.localeCompare(b.date)); } /_* Copy of the plan with the previous version's checklist items that it left out carried over.
- **Input:** `next`: new plan with ids; `previous`: previous plan.
- **Output:** Copy of `next` with every previous checklist item it left out carried over (questions are not carried).
- **Effects:** None (pure).
- **Errors:** None.

### `mergeWithPrevious`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-ids.ts`
- **Signature:** `mergeWithPrevious(next: PlanData, previous: PlanData | null): PlanData`
- **Used by:** `runBuild()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Stable ids for checklist items and questions across plan updates (the saved ticks depend on them): new items without an id reuse the id of the same item in the previous version, or get a deterministic one; items of the previous version that the new one left out are carried over, never deleted. Pure. / import type { PlanData, StudyDay, TimelineDay } from './plan-schema.js'; type IdKind = 's' | 't' | 'u' | 'q'; interface IdEntry { readonly kind: IdKind; readonly key: string; readonly item: { id?: string | undefined }; } /** Lowercase text without accents, with every run of other characters as one hyphen. _/ export function normalizeMatchText(value: string): string { return value .normalize('NFD') .replace(/[\u0300-\u036f]/g, '') .toLowerCase() .replace(/[^a-z0-9]+/g, '-') .replace(/^-|-$/g, ''); } /_* 32-bit FNV-1a hash of a text, in base 36. _/ export function fnvHash36(value: string): string { let hash = 0x811c9dc5; for (const char of value) { hash ^= char.codePointAt(0) ?? 0; hash = Math.imul(hash, 0x01000193) >>> 0; } return hash.toString(36); } /_* Deterministic id for a key, with a numeric suffix when the base id is already taken. _/ export function stableItemId(kind: IdKind, key: string, taken: ReadonlySet<string>): string { const base = `${kind}-${fnvHash36(key)}`; let id = base; for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`; return id; } /_* Matching key of an item: its kind and parts (date, course, title) normalized and joined. _/ export function itemMatchKey(kind: IdKind, parts: readonly string[]): string { return [kind, ...parts].map(normalizeMatchText).join('|'); } /_* Id entry of an item, keyed by its kind and parts. _/ export function idEntry(kind: IdKind, parts: readonly string[], item: IdEntry['item']): IdEntry { return { kind, key: itemMatchKey(kind, parts), item }; } /_* Every item of a plan with its matching key (kind, date, course and normalized title). _/ export function planIdEntries(plan: PlanData): IdEntry[] { return [ ...plan.study.flatMap((d) => d.items.map((it) => idEntry('s', [d.date, it.course, it.task], it)), ), ...plan.timeline.flatMap((d) => d.items.map((it) => idEntry('t', [d.date, it.course, it.title], it)), ), ...plan.undated.map((it) => idEntry('u', [it.course, it.title], it)), ...plan.questions.map((it) => idEntry('q', [it.course, it.text], it)), ]; } /_* Map from matching key to id, for the items of a previous plan that have one. _/ export function previousIdIndex(previous: PlanData | null): Map<string, string> { const index = new Map<string, string>(); for (const entry of previous ? planIdEntries(previous) : []) { if (entry.item.id !== undefined && !index.has(entry.key)) index.set(entry.key, entry.item.id); } return index; } /_* Copy of the plan where every item without an id gets the previous version's id or a new stable one. _/ export function assignPlanIds(next: PlanData, previous: PlanData | null): PlanData { const plan = structuredClone(next); const entries = planIdEntries(plan); const taken = new Set(entries.flatMap((e) => (e.item.id === undefined ? [] : [e.item.id]))); const index = previousIdIndex(previous); for (const entry of entries.filter((e) => e.item.id === undefined)) { const reused = index.get(entry.key); const id = reused !== undefined && !taken.has(reused) ? reused : stableItemId(entry.kind, entry.key, taken); entry.item.id = id; taken.add(id); } return plan; } /_* Copy of the day list with the previous day's left-out items added back (the day is recreated if missing). _/ export function carryDays<D extends StudyDay | TimelineDay>( days: readonly D[], previousDays: readonly D[], keep: (id: string | undefined) => boolean, ): D[] { const result = structuredClone([...days]); for (const previous of previousDays) { const left = previous.items.filter((item) => keep(item.id)); if (left.length === 0) continue; let day = result.find((d) => d.date === previous.date); if (!day) { day = { ...structuredClone(previous), items: [] }; result.push(day); } (day.items as D['items'][number][]).push(...structuredClone(left)); } return result.sort((a, b) => a.date.localeCompare(b.date)); } /_* Copy of the plan with the previous version's checklist items that it left out carried over. _/ export function carryPreviousItems(next: PlanData, previous: PlanData): PlanData { const present = new Set(planIdEntries(next).map((e) => e.item.id)); function keep(id: string | undefined): boolean { return id !== undefined && !present.has(id); } return { ...structuredClone(next), study: carryDays(next.study, previous.study, keep), timeline: carryDays(next.timeline, previous.timeline, keep), undated: [ ...structuredClone(next.undated), ...structuredClone(previous.undated.filter((i) => keep(i.id))), ], }; } /_* Merges a new plan with the previous version: ids reused or assigned, left-out items carried over.
- **Input:** `next`: new plan; `previous`: previous plan or `null`.
- **Output:** The plan with ids assigned and left-out items carried over.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/plan/plan-points.ts`

### `roundPoints`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-points.ts`
- **Signature:** `roundPoints(value: number): number`
- **Used by:** `formatPoints()`, `pointsMissing()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Points model of a course (total 100): `sure` already graded, `pend` submitted without a grade (estimated), `open` still to earn and `lost` lost or uncertain. Pure: shared by the CLI and the page runtime. / import type { PointSplit, RiskLevel } from './plan-schema.js'; /** Segment kinds of the stacked bar, in drawing order. _/ export const BAR_SEGMENT_KINDS = ['sure', 'pend', 'open', 'lost'] as const; /_* Share of the open points that may still be missing for each level (above the last one: high risk). _/ export const RISK_THRESHOLDS = { ok: 0.3, warn: 0.6 } as const; export interface BarSegment { readonly kind: (typeof BAR_SEGMENT_KINDS)[number]; readonly percent: number; } /_* Rounds points to one decimal (how the plan shows them).
- **Input:** `value`: points.
- **Output:** Value rounded to one decimal.
- **Effects:** None (pure).
- **Errors:** None.

### `formatPoints`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-points.ts`
- **Signature:** `formatPoints(value: number): string`
- **Used by:** `assessmentValueText()`, `barLabel()`, `planSummaryLines()`, `renderNeed()`, `renderPointsBar()`, `renderRiskChips()`, `situationText()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Points model of a course (total 100): `sure` already graded, `pend` submitted without a grade (estimated), `open` still to earn and `lost` lost or uncertain. Pure: shared by the CLI and the page runtime. / import type { PointSplit, RiskLevel } from './plan-schema.js'; /** Segment kinds of the stacked bar, in drawing order. _/ export const BAR_SEGMENT_KINDS = ['sure', 'pend', 'open', 'lost'] as const; /_* Share of the open points that may still be missing for each level (above the last one: high risk). _/ export const RISK_THRESHOLDS = { ok: 0.3, warn: 0.6 } as const; export interface BarSegment { readonly kind: (typeof BAR_SEGMENT_KINDS)[number]; readonly percent: number; } /_* Rounds points to one decimal (how the plan shows them). _/ export function roundPoints(value: number): number { return Math.round(value * 10) / 10; } /_* Points with at most one decimal and a pt-BR comma: 17.25 → "17,3".
- **Input:** `value`: points.
- **Output:** pt-BR text with at most one decimal (`17,3`, `60`).
- **Effects:** None (pure).
- **Errors:** None.

### `pointsTotal`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-points.ts`
- **Signature:** `pointsTotal(points: PointSplit): number`
- **Used by:** `barSegments()`, `checkPointSums()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Points model of a course (total 100): `sure` already graded, `pend` submitted without a grade (estimated), `open` still to earn and `lost` lost or uncertain. Pure: shared by the CLI and the page runtime. / import type { PointSplit, RiskLevel } from './plan-schema.js'; /** Segment kinds of the stacked bar, in drawing order. _/ export const BAR_SEGMENT_KINDS = ['sure', 'pend', 'open', 'lost'] as const; /_* Share of the open points that may still be missing for each level (above the last one: high risk). _/ export const RISK_THRESHOLDS = { ok: 0.3, warn: 0.6 } as const; export interface BarSegment { readonly kind: (typeof BAR_SEGMENT_KINDS)[number]; readonly percent: number; } /_* Rounds points to one decimal (how the plan shows them). _/ export function roundPoints(value: number): number { return Math.round(value * 10) / 10; } /_* Points with at most one decimal and a pt-BR comma: 17.25 → "17,3". _/ export function formatPoints(value: number): string { return roundPoints(value).toLocaleString('pt-BR', { maximumFractionDigits: 1 }); } /_* Sum of the four parts of a course's points.
- **Input:** `points`: `{sure, pend, open, lost}`.
- **Output:** Their sum.
- **Effects:** None (pure).
- **Errors:** None.

### `pointsMissing`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-points.ts`
- **Signature:** `pointsMissing(points: PointSplit, goal: number): number`
- **Used by:** `planSummaryLines()`, `renderNeed()`, `renderRiskChips()`, `riskLevel()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Points model of a course (total 100): `sure` already graded, `pend` submitted without a grade (estimated), `open` still to earn and `lost` lost or uncertain. Pure: shared by the CLI and the page runtime. / import type { PointSplit, RiskLevel } from './plan-schema.js'; /** Segment kinds of the stacked bar, in drawing order. _/ export const BAR_SEGMENT_KINDS = ['sure', 'pend', 'open', 'lost'] as const; /_* Share of the open points that may still be missing for each level (above the last one: high risk). _/ export const RISK_THRESHOLDS = { ok: 0.3, warn: 0.6 } as const; export interface BarSegment { readonly kind: (typeof BAR_SEGMENT_KINDS)[number]; readonly percent: number; } /_* Rounds points to one decimal (how the plan shows them). _/ export function roundPoints(value: number): number { return Math.round(value * 10) / 10; } /_* Points with at most one decimal and a pt-BR comma: 17.25 → "17,3". _/ export function formatPoints(value: number): string { return roundPoints(value).toLocaleString('pt-BR', { maximumFractionDigits: 1 }); } /_* Sum of the four parts of a course's points. _/ export function pointsTotal(points: PointSplit): number { return points.sure + points.pend + points.open + points.lost; } /_* Points still missing to reach the goal: max(0, goal − sure − pend).
- **Input:** `points`: split; `goal`: approval goal.
- **Output:** `max(0, goal − sure − pend)`, one decimal.
- **Effects:** None (pure).
- **Errors:** None.

### `riskLevel`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-points.ts`
- **Signature:** `riskLevel(points: PointSplit, goal: number, needsRecovery = false): RiskLevel`
- **Used by:** `courseLevels()`, `planSummaryLines()`, `renderCourses()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Points model of a course (total 100): `sure` already graded, `pend` submitted without a grade (estimated), `open` still to earn and `lost` lost or uncertain. Pure: shared by the CLI and the page runtime. / import type { PointSplit, RiskLevel } from './plan-schema.js'; /** Segment kinds of the stacked bar, in drawing order. _/ export const BAR_SEGMENT_KINDS = ['sure', 'pend', 'open', 'lost'] as const; /_* Share of the open points that may still be missing for each level (above the last one: high risk). _/ export const RISK_THRESHOLDS = { ok: 0.3, warn: 0.6 } as const; export interface BarSegment { readonly kind: (typeof BAR_SEGMENT_KINDS)[number]; readonly percent: number; } /_* Rounds points to one decimal (how the plan shows them). _/ export function roundPoints(value: number): number { return Math.round(value * 10) / 10; } /_* Points with at most one decimal and a pt-BR comma: 17.25 → "17,3". _/ export function formatPoints(value: number): string { return roundPoints(value).toLocaleString('pt-BR', { maximumFractionDigits: 1 }); } /_* Sum of the four parts of a course's points. _/ export function pointsTotal(points: PointSplit): number { return points.sure + points.pend + points.open + points.lost; } /_* Points still missing to reach the goal: max(0, goal − sure − pend). _/ export function pointsMissing(points: PointSplit, goal: number): number { return roundPoints(Math.max(0, goal - points.sure - points.pend)); } /_* Risk level: ok up to 30% of the open points missing, warn up to 60%, high above, beyond reach or on recovery.
- **Input:** `points`: split; `goal`: goal; `needsRecovery`: passing depends on recovery (default false).
- **Output:** `ok`, `warn` or `high` (≤ 30% / ≤ 60% / above of `open`; `high` beyond reach or on recovery; `ok` when nothing is missing).
- **Effects:** None (pure).
- **Errors:** None.

### `barSegments`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-points.ts`
- **Signature:** `barSegments(points: PointSplit): BarSegment[]`
- **Used by:** `renderPointsBar()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Points model of a course (total 100): `sure` already graded, `pend` submitted without a grade (estimated), `open` still to earn and `lost` lost or uncertain. Pure: shared by the CLI and the page runtime. / import type { PointSplit, RiskLevel } from './plan-schema.js'; /** Segment kinds of the stacked bar, in drawing order. _/ export const BAR_SEGMENT_KINDS = ['sure', 'pend', 'open', 'lost'] as const; /_* Share of the open points that may still be missing for each level (above the last one: high risk). _/ export const RISK_THRESHOLDS = { ok: 0.3, warn: 0.6 } as const; export interface BarSegment { readonly kind: (typeof BAR_SEGMENT_KINDS)[number]; readonly percent: number; } /_* Rounds points to one decimal (how the plan shows them). _/ export function roundPoints(value: number): number { return Math.round(value * 10) / 10; } /_* Points with at most one decimal and a pt-BR comma: 17.25 → "17,3". _/ export function formatPoints(value: number): string { return roundPoints(value).toLocaleString('pt-BR', { maximumFractionDigits: 1 }); } /_* Sum of the four parts of a course's points. _/ export function pointsTotal(points: PointSplit): number { return points.sure + points.pend + points.open + points.lost; } /_* Points still missing to reach the goal: max(0, goal − sure − pend). _/ export function pointsMissing(points: PointSplit, goal: number): number { return roundPoints(Math.max(0, goal - points.sure - points.pend)); } /_* Risk level: ok up to 30% of the open points missing, warn up to 60%, high above, beyond reach or on recovery. _/ export function riskLevel(points: PointSplit, goal: number, needsRecovery = false): RiskLevel { const missing = pointsMissing(points, goal); if (missing === 0) return 'ok'; if (needsRecovery || missing > points.open) return 'high'; const share = missing / points.open; if (share <= RISK_THRESHOLDS.ok) return 'ok'; return share <= RISK_THRESHOLDS.warn ? 'warn' : 'high'; } /_* Widths (in %) of the stacked bar, in drawing order; they always add up to exactly 100.
- **Input:** `points`: split.
- **Output:** Four `{kind, percent}` in drawing order adding up to exactly 100; all `open` when the total is 0.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/plan/plan-validate.ts`

### `isRealIsoDate`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-validate.ts`
- **Signature:** `isRealIsoDate(value: string): boolean`
- **Used by:** `checkPlanDates()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Validation of the plan JSON before it is injected into the page: the zod shape plus the rules zod cannot express (points add up to 100, real and ordered dates, unique ids, known course references). Pure. / import type { ZodError } from 'zod'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { pointsTotal } from './plan-points.js'; /** Format of a checklist or question id (stable across updates: the saved ticks depend on it). _/ export const PLAN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/; /_* Tolerance when checking that a course's points add up to 100. _/ export const POINTS_TOLERANCE = 0.05; export type PlanValidation = | { readonly ok: true; readonly plan: PlanData } | { readonly ok: false; readonly errors: readonly string[] }; /_* Says whether a YYYY-MM-DD string is a real calendar date (2026-02-30 is not).
- **Input:** `value`: text.
- **Output:** `true` for a real `YYYY-MM-DD` calendar date.
- **Effects:** None (pure).
- **Errors:** None.

### `zodIssueLines`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-validate.ts`
- **Signature:** `zodIssueLines(error: ZodError): string[]`
- **Used by:** `runBuild()`, `validatePlan()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Validation of the plan JSON before it is injected into the page: the zod shape plus the rules zod cannot express (points add up to 100, real and ordered dates, unique ids, known course references). Pure. / import type { ZodError } from 'zod'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { pointsTotal } from './plan-points.js'; /** Format of a checklist or question id (stable across updates: the saved ticks depend on it). _/ export const PLAN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/; /_* Tolerance when checking that a course's points add up to 100. _/ export const POINTS_TOLERANCE = 0.05; export type PlanValidation = | { readonly ok: true; readonly plan: PlanData } | { readonly ok: false; readonly errors: readonly string[] }; /_* Says whether a YYYY-MM-DD string is a real calendar date (2026-02-30 is not). _/ export function isRealIsoDate(value: string): boolean { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (!match) return false; const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]; const date = new Date(Date.UTC(year, month - 1, day)); return ( date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ); } /_* Turns zod issues into `path: message` lines.
- **Input:** `error`: zod error.
- **Output:** One `path: message` line per issue (`(root)` for the root).
- **Effects:** None (pure).
- **Errors:** None.

### `checkPointSums`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-validate.ts`
- **Signature:** `checkPointSums(plan: PlanData): string[]`
- **Used by:** `validatePlan()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Validation of the plan JSON before it is injected into the page: the zod shape plus the rules zod cannot express (points add up to 100, real and ordered dates, unique ids, known course references). Pure. / import type { ZodError } from 'zod'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { pointsTotal } from './plan-points.js'; /** Format of a checklist or question id (stable across updates: the saved ticks depend on it). _/ export const PLAN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/; /_* Tolerance when checking that a course's points add up to 100. _/ export const POINTS_TOLERANCE = 0.05; export type PlanValidation = | { readonly ok: true; readonly plan: PlanData } | { readonly ok: false; readonly errors: readonly string[] }; /_* Says whether a YYYY-MM-DD string is a real calendar date (2026-02-30 is not). _/ export function isRealIsoDate(value: string): boolean { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (!match) return false; const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]; const date = new Date(Date.UTC(year, month - 1, day)); return ( date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ); } /_* Turns zod issues into `path: message` lines. _/ export function zodIssueLines(error: ZodError): string[] { return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`); } /_* Errors of courses whose points do not add up to 100 or whose grades exceed the assessment value.
- **Input:** `plan`: parsed plan.
- **Output:** Errors of courses whose points do not add up to 100 (± 0.05) and of grades above the assessment value.
- **Effects:** None (pure).
- **Errors:** None.

### `planDates`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-validate.ts`
- **Signature:** `planDates(plan: PlanData): [string, string][]`
- **Used by:** `checkPlanDates()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Validation of the plan JSON before it is injected into the page: the zod shape plus the rules zod cannot express (points add up to 100, real and ordered dates, unique ids, known course references). Pure. / import type { ZodError } from 'zod'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { pointsTotal } from './plan-points.js'; /** Format of a checklist or question id (stable across updates: the saved ticks depend on it). _/ export const PLAN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/; /_* Tolerance when checking that a course's points add up to 100. _/ export const POINTS_TOLERANCE = 0.05; export type PlanValidation = | { readonly ok: true; readonly plan: PlanData } | { readonly ok: false; readonly errors: readonly string[] }; /_* Says whether a YYYY-MM-DD string is a real calendar date (2026-02-30 is not). _/ export function isRealIsoDate(value: string): boolean { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (!match) return false; const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]; const date = new Date(Date.UTC(year, month - 1, day)); return ( date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ); } /_* Turns zod issues into `path: message` lines. _/ export function zodIssueLines(error: ZodError): string[] { return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`); } /_* Errors of courses whose points do not add up to 100 or whose grades exceed the assessment value. _/ export function checkPointSums(plan: PlanData): string[] { return plan.courses.flatMap((course) => { const total = pointsTotal(course.points); const sum = Math.abs(total - 100) > POINTS_TOLERANCE ? [`courses.${course.id}.points: sure + pend + open + lost must be 100 (got ${total})`] : []; const grades = course.assessments .filter((a) => a.score !== null && a.score > a.max) .map((a) => `courses.${course.id}.assessments: "${a.title}" score is above its value`); return [...sum, ...grades]; }); } /_* Every date in the plan with its path, for the calendar check.
- **Input:** `plan`: parsed plan.
- **Output:** Every `[path, date]` of the plan (focus, blocks, days, questions, rules, assessments).
- **Effects:** None (pure).
- **Errors:** None.

### `checkDayOrder`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-validate.ts`
- **Signature:** `checkDayOrder(name: string, days: readonly { date: string }[]): string[]`
- **Used by:** `checkPlanDates()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Validation of the plan JSON before it is injected into the page: the zod shape plus the rules zod cannot express (points add up to 100, real and ordered dates, unique ids, known course references). Pure. / import type { ZodError } from 'zod'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { pointsTotal } from './plan-points.js'; /** Format of a checklist or question id (stable across updates: the saved ticks depend on it). _/ export const PLAN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/; /_* Tolerance when checking that a course's points add up to 100. _/ export const POINTS_TOLERANCE = 0.05; export type PlanValidation = | { readonly ok: true; readonly plan: PlanData } | { readonly ok: false; readonly errors: readonly string[] }; /_* Says whether a YYYY-MM-DD string is a real calendar date (2026-02-30 is not). _/ export function isRealIsoDate(value: string): boolean { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (!match) return false; const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]; const date = new Date(Date.UTC(year, month - 1, day)); return ( date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ); } /_* Turns zod issues into `path: message` lines. _/ export function zodIssueLines(error: ZodError): string[] { return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`); } /_* Errors of courses whose points do not add up to 100 or whose grades exceed the assessment value. _/ export function checkPointSums(plan: PlanData): string[] { return plan.courses.flatMap((course) => { const total = pointsTotal(course.points); const sum = Math.abs(total - 100) > POINTS_TOLERANCE ? [`courses.${course.id}.points: sure + pend + open + lost must be 100 (got ${total})`] : []; const grades = course.assessments .filter((a) => a.score !== null && a.score > a.max) .map((a) => `courses.${course.id}.assessments: "${a.title}" score is above its value`); return [...sum, ...grades]; }); } /_* Every date in the plan with its path, for the calendar check. _/ export function planDates(plan: PlanData): [string, string][] { const dates: [string, string][] = [ ['focus.from', plan.focus.from], ['focus.to', plan.focus.to], ]; plan.focus.blocks.forEach((b, i) => dates.push([`focus.blocks.${i}.date`, b.date])); plan.study.forEach((d, i) => dates.push([`study.${i}.date`, d.date])); plan.timeline.forEach((d, i) => dates.push([`timeline.${i}.date`, d.date])); plan.questions.forEach((q, i) => { if (q.sentOn) dates.push([`questions.${i}.sentOn`, q.sentOn]); }); for (const course of plan.courses) { course.rules.forEach((r, i) => dates.push([`courses.${course.id}.rules.${i}.date`, r.date])); course.assessments.forEach((a, i) => { if (a.date) dates.push([`courses.${course.id}.assessments.${i}.date`, a.date]); }); } return dates; } /_* Errors of a day list that is not in strictly increasing date order.
- **Input:** `name`: list name; `days`: list with `date`.
- **Output:** Errors where a day is not after the previous one.
- **Effects:** None (pure).
- **Errors:** None.

### `checkPlanDates`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-validate.ts`
- **Signature:** `checkPlanDates(plan: PlanData): string[]`
- **Used by:** `validatePlan()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Validation of the plan JSON before it is injected into the page: the zod shape plus the rules zod cannot express (points add up to 100, real and ordered dates, unique ids, known course references). Pure. / import type { ZodError } from 'zod'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { pointsTotal } from './plan-points.js'; /** Format of a checklist or question id (stable across updates: the saved ticks depend on it). _/ export const PLAN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/; /_* Tolerance when checking that a course's points add up to 100. _/ export const POINTS_TOLERANCE = 0.05; export type PlanValidation = | { readonly ok: true; readonly plan: PlanData } | { readonly ok: false; readonly errors: readonly string[] }; /_* Says whether a YYYY-MM-DD string is a real calendar date (2026-02-30 is not). _/ export function isRealIsoDate(value: string): boolean { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (!match) return false; const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]; const date = new Date(Date.UTC(year, month - 1, day)); return ( date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ); } /_* Turns zod issues into `path: message` lines. _/ export function zodIssueLines(error: ZodError): string[] { return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`); } /_* Errors of courses whose points do not add up to 100 or whose grades exceed the assessment value. _/ export function checkPointSums(plan: PlanData): string[] { return plan.courses.flatMap((course) => { const total = pointsTotal(course.points); const sum = Math.abs(total - 100) > POINTS_TOLERANCE ? [`courses.${course.id}.points: sure + pend + open + lost must be 100 (got ${total})`] : []; const grades = course.assessments .filter((a) => a.score !== null && a.score > a.max) .map((a) => `courses.${course.id}.assessments: "${a.title}" score is above its value`); return [...sum, ...grades]; }); } /_* Every date in the plan with its path, for the calendar check. _/ export function planDates(plan: PlanData): [string, string][] { const dates: [string, string][] = [ ['focus.from', plan.focus.from], ['focus.to', plan.focus.to], ]; plan.focus.blocks.forEach((b, i) => dates.push([`focus.blocks.${i}.date`, b.date])); plan.study.forEach((d, i) => dates.push([`study.${i}.date`, d.date])); plan.timeline.forEach((d, i) => dates.push([`timeline.${i}.date`, d.date])); plan.questions.forEach((q, i) => { if (q.sentOn) dates.push([`questions.${i}.sentOn`, q.sentOn]); }); for (const course of plan.courses) { course.rules.forEach((r, i) => dates.push([`courses.${course.id}.rules.${i}.date`, r.date])); course.assessments.forEach((a, i) => { if (a.date) dates.push([`courses.${course.id}.assessments.${i}.date`, a.date]); }); } return dates; } /_* Errors of a day list that is not in strictly increasing date order. _/ export function checkDayOrder(name: string, days: readonly { date: string }[]): string[] { return days.flatMap((day, i) => { const previous = days[i - 1]; return previous && previous.date >= day.date ? [`${name}.${i}.date: days must be in increasing order without repeats (${day.date})`] : []; }); } /_* Errors of impossible dates, unordered day lists and a focus window that ends before it starts.
- **Input:** `plan`: parsed plan.
- **Output:** Errors of impossible dates, an inverted focus window and unordered day lists.
- **Effects:** None (pure).
- **Errors:** None.

### `planItemIds`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-validate.ts`
- **Signature:** `planItemIds(plan: PlanData): [string, string | undefined][]`
- **Used by:** `checkPlanIds()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Validation of the plan JSON before it is injected into the page: the zod shape plus the rules zod cannot express (points add up to 100, real and ordered dates, unique ids, known course references). Pure. / import type { ZodError } from 'zod'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { pointsTotal } from './plan-points.js'; /** Format of a checklist or question id (stable across updates: the saved ticks depend on it). _/ export const PLAN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/; /_* Tolerance when checking that a course's points add up to 100. _/ export const POINTS_TOLERANCE = 0.05; export type PlanValidation = | { readonly ok: true; readonly plan: PlanData } | { readonly ok: false; readonly errors: readonly string[] }; /_* Says whether a YYYY-MM-DD string is a real calendar date (2026-02-30 is not). _/ export function isRealIsoDate(value: string): boolean { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (!match) return false; const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]; const date = new Date(Date.UTC(year, month - 1, day)); return ( date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ); } /_* Turns zod issues into `path: message` lines. _/ export function zodIssueLines(error: ZodError): string[] { return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`); } /_* Errors of courses whose points do not add up to 100 or whose grades exceed the assessment value. _/ export function checkPointSums(plan: PlanData): string[] { return plan.courses.flatMap((course) => { const total = pointsTotal(course.points); const sum = Math.abs(total - 100) > POINTS_TOLERANCE ? [`courses.${course.id}.points: sure + pend + open + lost must be 100 (got ${total})`] : []; const grades = course.assessments .filter((a) => a.score !== null && a.score > a.max) .map((a) => `courses.${course.id}.assessments: "${a.title}" score is above its value`); return [...sum, ...grades]; }); } /_* Every date in the plan with its path, for the calendar check. _/ export function planDates(plan: PlanData): [string, string][] { const dates: [string, string][] = [ ['focus.from', plan.focus.from], ['focus.to', plan.focus.to], ]; plan.focus.blocks.forEach((b, i) => dates.push([`focus.blocks.${i}.date`, b.date])); plan.study.forEach((d, i) => dates.push([`study.${i}.date`, d.date])); plan.timeline.forEach((d, i) => dates.push([`timeline.${i}.date`, d.date])); plan.questions.forEach((q, i) => { if (q.sentOn) dates.push([`questions.${i}.sentOn`, q.sentOn]); }); for (const course of plan.courses) { course.rules.forEach((r, i) => dates.push([`courses.${course.id}.rules.${i}.date`, r.date])); course.assessments.forEach((a, i) => { if (a.date) dates.push([`courses.${course.id}.assessments.${i}.date`, a.date]); }); } return dates; } /_* Errors of a day list that is not in strictly increasing date order. _/ export function checkDayOrder(name: string, days: readonly { date: string }[]): string[] { return days.flatMap((day, i) => { const previous = days[i - 1]; return previous && previous.date >= day.date ? [`${name}.${i}.date: days must be in increasing order without repeats (${day.date})`] : []; }); } /_* Errors of impossible dates, unordered day lists and a focus window that ends before it starts. _/ export function checkPlanDates(plan: PlanData): string[] { const impossible = planDates(plan) .filter(([, value]) => !isRealIsoDate(value)) .map(([path, value]) => `${path}: ${value} is not a real date`); const window = plan.focus.from > plan.focus.to ? ['focus: "from" must not be after "to"'] : []; return [ ...impossible, ...window, ...checkDayOrder('study', plan.study), ...checkDayOrder('timeline', plan.timeline), ]; } /_* Every checklist item and question id with its path (undefined when the id is missing).
- **Input:** `plan`: parsed plan.
- **Output:** `[path, id]` of every checklist item and question (`id` may be undefined).
- **Effects:** None (pure).
- **Errors:** None.

### `repeatedValues`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-validate.ts`
- **Signature:** `repeatedValues(values: readonly string[]): string[]`
- **Used by:** `checkPlanIds()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Validation of the plan JSON before it is injected into the page: the zod shape plus the rules zod cannot express (points add up to 100, real and ordered dates, unique ids, known course references). Pure. / import type { ZodError } from 'zod'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { pointsTotal } from './plan-points.js'; /** Format of a checklist or question id (stable across updates: the saved ticks depend on it). _/ export const PLAN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/; /_* Tolerance when checking that a course's points add up to 100. _/ export const POINTS_TOLERANCE = 0.05; export type PlanValidation = | { readonly ok: true; readonly plan: PlanData } | { readonly ok: false; readonly errors: readonly string[] }; /_* Says whether a YYYY-MM-DD string is a real calendar date (2026-02-30 is not). _/ export function isRealIsoDate(value: string): boolean { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (!match) return false; const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]; const date = new Date(Date.UTC(year, month - 1, day)); return ( date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ); } /_* Turns zod issues into `path: message` lines. _/ export function zodIssueLines(error: ZodError): string[] { return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`); } /_* Errors of courses whose points do not add up to 100 or whose grades exceed the assessment value. _/ export function checkPointSums(plan: PlanData): string[] { return plan.courses.flatMap((course) => { const total = pointsTotal(course.points); const sum = Math.abs(total - 100) > POINTS_TOLERANCE ? [`courses.${course.id}.points: sure + pend + open + lost must be 100 (got ${total})`] : []; const grades = course.assessments .filter((a) => a.score !== null && a.score > a.max) .map((a) => `courses.${course.id}.assessments: "${a.title}" score is above its value`); return [...sum, ...grades]; }); } /_* Every date in the plan with its path, for the calendar check. _/ export function planDates(plan: PlanData): [string, string][] { const dates: [string, string][] = [ ['focus.from', plan.focus.from], ['focus.to', plan.focus.to], ]; plan.focus.blocks.forEach((b, i) => dates.push([`focus.blocks.${i}.date`, b.date])); plan.study.forEach((d, i) => dates.push([`study.${i}.date`, d.date])); plan.timeline.forEach((d, i) => dates.push([`timeline.${i}.date`, d.date])); plan.questions.forEach((q, i) => { if (q.sentOn) dates.push([`questions.${i}.sentOn`, q.sentOn]); }); for (const course of plan.courses) { course.rules.forEach((r, i) => dates.push([`courses.${course.id}.rules.${i}.date`, r.date])); course.assessments.forEach((a, i) => { if (a.date) dates.push([`courses.${course.id}.assessments.${i}.date`, a.date]); }); } return dates; } /_* Errors of a day list that is not in strictly increasing date order. _/ export function checkDayOrder(name: string, days: readonly { date: string }[]): string[] { return days.flatMap((day, i) => { const previous = days[i - 1]; return previous && previous.date >= day.date ? [`${name}.${i}.date: days must be in increasing order without repeats (${day.date})`] : []; }); } /_* Errors of impossible dates, unordered day lists and a focus window that ends before it starts. _/ export function checkPlanDates(plan: PlanData): string[] { const impossible = planDates(plan) .filter(([, value]) => !isRealIsoDate(value)) .map(([path, value]) => `${path}: ${value} is not a real date`); const window = plan.focus.from > plan.focus.to ? ['focus: "from" must not be after "to"'] : []; return [ ...impossible, ...window, ...checkDayOrder('study', plan.study), ...checkDayOrder('timeline', plan.timeline), ]; } /_* Every checklist item and question id with its path (undefined when the id is missing). _/ export function planItemIds(plan: PlanData): [string, string | undefined][] { const ids: [string, string | undefined][] = []; for (const d of plan.study) d.items.forEach((it, j) => ids.push([`study.${d.date}.${j}`, it.id])); for (const d of plan.timeline) { d.items.forEach((it, j) => ids.push([`timeline.${d.date}.${j}`, it.id])); } plan.undated.forEach((it, j) => ids.push([`undated.${j}`, it.id])); plan.questions.forEach((q, j) => ids.push([`questions.${j}`, q.id])); return ids; } /_* Values that appear more than once, in order of first repeat.
- **Input:** `values`: texts.
- **Output:** Each value that appears more than once, in order of first repeat.
- **Effects:** None (pure).
- **Errors:** None.

### `checkPlanIds`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-validate.ts`
- **Signature:** `checkPlanIds(plan: PlanData): string[]`
- **Used by:** `validatePlan()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Validation of the plan JSON before it is injected into the page: the zod shape plus the rules zod cannot express (points add up to 100, real and ordered dates, unique ids, known course references). Pure. / import type { ZodError } from 'zod'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { pointsTotal } from './plan-points.js'; /** Format of a checklist or question id (stable across updates: the saved ticks depend on it). _/ export const PLAN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/; /_* Tolerance when checking that a course's points add up to 100. _/ export const POINTS_TOLERANCE = 0.05; export type PlanValidation = | { readonly ok: true; readonly plan: PlanData } | { readonly ok: false; readonly errors: readonly string[] }; /_* Says whether a YYYY-MM-DD string is a real calendar date (2026-02-30 is not). _/ export function isRealIsoDate(value: string): boolean { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (!match) return false; const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]; const date = new Date(Date.UTC(year, month - 1, day)); return ( date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ); } /_* Turns zod issues into `path: message` lines. _/ export function zodIssueLines(error: ZodError): string[] { return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`); } /_* Errors of courses whose points do not add up to 100 or whose grades exceed the assessment value. _/ export function checkPointSums(plan: PlanData): string[] { return plan.courses.flatMap((course) => { const total = pointsTotal(course.points); const sum = Math.abs(total - 100) > POINTS_TOLERANCE ? [`courses.${course.id}.points: sure + pend + open + lost must be 100 (got ${total})`] : []; const grades = course.assessments .filter((a) => a.score !== null && a.score > a.max) .map((a) => `courses.${course.id}.assessments: "${a.title}" score is above its value`); return [...sum, ...grades]; }); } /_* Every date in the plan with its path, for the calendar check. _/ export function planDates(plan: PlanData): [string, string][] { const dates: [string, string][] = [ ['focus.from', plan.focus.from], ['focus.to', plan.focus.to], ]; plan.focus.blocks.forEach((b, i) => dates.push([`focus.blocks.${i}.date`, b.date])); plan.study.forEach((d, i) => dates.push([`study.${i}.date`, d.date])); plan.timeline.forEach((d, i) => dates.push([`timeline.${i}.date`, d.date])); plan.questions.forEach((q, i) => { if (q.sentOn) dates.push([`questions.${i}.sentOn`, q.sentOn]); }); for (const course of plan.courses) { course.rules.forEach((r, i) => dates.push([`courses.${course.id}.rules.${i}.date`, r.date])); course.assessments.forEach((a, i) => { if (a.date) dates.push([`courses.${course.id}.assessments.${i}.date`, a.date]); }); } return dates; } /_* Errors of a day list that is not in strictly increasing date order. _/ export function checkDayOrder(name: string, days: readonly { date: string }[]): string[] { return days.flatMap((day, i) => { const previous = days[i - 1]; return previous && previous.date >= day.date ? [`${name}.${i}.date: days must be in increasing order without repeats (${day.date})`] : []; }); } /_* Errors of impossible dates, unordered day lists and a focus window that ends before it starts. _/ export function checkPlanDates(plan: PlanData): string[] { const impossible = planDates(plan) .filter(([, value]) => !isRealIsoDate(value)) .map(([path, value]) => `${path}: ${value} is not a real date`); const window = plan.focus.from > plan.focus.to ? ['focus: "from" must not be after "to"'] : []; return [ ...impossible, ...window, ...checkDayOrder('study', plan.study), ...checkDayOrder('timeline', plan.timeline), ]; } /_* Every checklist item and question id with its path (undefined when the id is missing). _/ export function planItemIds(plan: PlanData): [string, string | undefined][] { const ids: [string, string | undefined][] = []; for (const d of plan.study) d.items.forEach((it, j) => ids.push([`study.${d.date}.${j}`, it.id])); for (const d of plan.timeline) { d.items.forEach((it, j) => ids.push([`timeline.${d.date}.${j}`, it.id])); } plan.undated.forEach((it, j) => ids.push([`undated.${j}`, it.id])); plan.questions.forEach((q, j) => ids.push([`questions.${j}`, q.id])); return ids; } /_* Values that appear more than once, in order of first repeat. _/ export function repeatedValues(values: readonly string[]): string[] { const seen = new Set<string>(); const repeated = new Set<string>(); for (const value of values) (seen.has(value) ? repeated : seen).add(value); return [...repeated]; } /_* Errors of missing, malformed or repeated ids, and of repeated course ids or codes.
- **Input:** `plan`: parsed plan.
- **Output:** Errors of missing, malformed and repeated ids and of repeated course ids or codes.
- **Effects:** None (pure).
- **Errors:** None.

### `checkCourseRefs`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-validate.ts`
- **Signature:** `checkCourseRefs(plan: PlanData): string[]`
- **Used by:** `validatePlan()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Validation of the plan JSON before it is injected into the page: the zod shape plus the rules zod cannot express (points add up to 100, real and ordered dates, unique ids, known course references). Pure. / import type { ZodError } from 'zod'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { pointsTotal } from './plan-points.js'; /** Format of a checklist or question id (stable across updates: the saved ticks depend on it). _/ export const PLAN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/; /_* Tolerance when checking that a course's points add up to 100. _/ export const POINTS_TOLERANCE = 0.05; export type PlanValidation = | { readonly ok: true; readonly plan: PlanData } | { readonly ok: false; readonly errors: readonly string[] }; /_* Says whether a YYYY-MM-DD string is a real calendar date (2026-02-30 is not). _/ export function isRealIsoDate(value: string): boolean { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (!match) return false; const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]; const date = new Date(Date.UTC(year, month - 1, day)); return ( date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ); } /_* Turns zod issues into `path: message` lines. _/ export function zodIssueLines(error: ZodError): string[] { return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`); } /_* Errors of courses whose points do not add up to 100 or whose grades exceed the assessment value. _/ export function checkPointSums(plan: PlanData): string[] { return plan.courses.flatMap((course) => { const total = pointsTotal(course.points); const sum = Math.abs(total - 100) > POINTS_TOLERANCE ? [`courses.${course.id}.points: sure + pend + open + lost must be 100 (got ${total})`] : []; const grades = course.assessments .filter((a) => a.score !== null && a.score > a.max) .map((a) => `courses.${course.id}.assessments: "${a.title}" score is above its value`); return [...sum, ...grades]; }); } /_* Every date in the plan with its path, for the calendar check. _/ export function planDates(plan: PlanData): [string, string][] { const dates: [string, string][] = [ ['focus.from', plan.focus.from], ['focus.to', plan.focus.to], ]; plan.focus.blocks.forEach((b, i) => dates.push([`focus.blocks.${i}.date`, b.date])); plan.study.forEach((d, i) => dates.push([`study.${i}.date`, d.date])); plan.timeline.forEach((d, i) => dates.push([`timeline.${i}.date`, d.date])); plan.questions.forEach((q, i) => { if (q.sentOn) dates.push([`questions.${i}.sentOn`, q.sentOn]); }); for (const course of plan.courses) { course.rules.forEach((r, i) => dates.push([`courses.${course.id}.rules.${i}.date`, r.date])); course.assessments.forEach((a, i) => { if (a.date) dates.push([`courses.${course.id}.assessments.${i}.date`, a.date]); }); } return dates; } /_* Errors of a day list that is not in strictly increasing date order. _/ export function checkDayOrder(name: string, days: readonly { date: string }[]): string[] { return days.flatMap((day, i) => { const previous = days[i - 1]; return previous && previous.date >= day.date ? [`${name}.${i}.date: days must be in increasing order without repeats (${day.date})`] : []; }); } /_* Errors of impossible dates, unordered day lists and a focus window that ends before it starts. _/ export function checkPlanDates(plan: PlanData): string[] { const impossible = planDates(plan) .filter(([, value]) => !isRealIsoDate(value)) .map(([path, value]) => `${path}: ${value} is not a real date`); const window = plan.focus.from > plan.focus.to ? ['focus: "from" must not be after "to"'] : []; return [ ...impossible, ...window, ...checkDayOrder('study', plan.study), ...checkDayOrder('timeline', plan.timeline), ]; } /_* Every checklist item and question id with its path (undefined when the id is missing). _/ export function planItemIds(plan: PlanData): [string, string | undefined][] { const ids: [string, string | undefined][] = []; for (const d of plan.study) d.items.forEach((it, j) => ids.push([`study.${d.date}.${j}`, it.id])); for (const d of plan.timeline) { d.items.forEach((it, j) => ids.push([`timeline.${d.date}.${j}`, it.id])); } plan.undated.forEach((it, j) => ids.push([`undated.${j}`, it.id])); plan.questions.forEach((q, j) => ids.push([`questions.${j}`, q.id])); return ids; } /_* Values that appear more than once, in order of first repeat. _/ export function repeatedValues(values: readonly string[]): string[] { const seen = new Set<string>(); const repeated = new Set<string>(); for (const value of values) (seen.has(value) ? repeated : seen).add(value); return [...repeated]; } /_* Errors of missing, malformed or repeated ids, and of repeated course ids or codes. _/ export function checkPlanIds(plan: PlanData): string[] { const ids = planItemIds(plan); const malformed = ids .filter(([, id]) => id === undefined || !PLAN_ID_PATTERN.test(id)) .map(([path, id]) => `${path}: id ${id === undefined ? 'is missing' : `"${id}" is malformed`}`); const present = ids.flatMap(([, id]) => (id === undefined ? [] : [id])); return [ ...malformed, ...repeatedValues(present).map((id) => `id "${id}" is used more than once`), ...repeatedValues(plan.courses.map((c) => c.id)).map((id) => `course id "${id}" repeats`), ...repeatedValues(plan.courses.map((c) => c.code)).map((c) => `course code "${c}" repeats`), ]; } /_* Errors of questions and WhatsApp groups that name a course code missing from `courses`.
- **Input:** `plan`: parsed plan.
- **Output:** Errors of questions and WhatsApp groups naming an unknown course code.
- **Effects:** None (pure).
- **Errors:** None.

### `validatePlan`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/plan/plan-validate.ts`
- **Signature:** `validatePlan(input: unknown): PlanValidation`
- **Used by:** `readPreviousPlan()`, `runBuild()`, `runExtract()`, `runSummary()`, `runValidate()`
- **Processes:** P20

<!-- generated:end -->

- **Does:** Validation of the plan JSON before it is injected into the page: the zod shape plus the rules zod cannot express (points add up to 100, real and ordered dates, unique ids, known course references). Pure. / import type { ZodError } from 'zod'; import { planSchema } from './plan-schema.js'; import type { PlanData } from './plan-schema.js'; import { pointsTotal } from './plan-points.js'; /** Format of a checklist or question id (stable across updates: the saved ticks depend on it). _/ export const PLAN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/; /_* Tolerance when checking that a course's points add up to 100. _/ export const POINTS_TOLERANCE = 0.05; export type PlanValidation = | { readonly ok: true; readonly plan: PlanData } | { readonly ok: false; readonly errors: readonly string[] }; /_* Says whether a YYYY-MM-DD string is a real calendar date (2026-02-30 is not). _/ export function isRealIsoDate(value: string): boolean { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (!match) return false; const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]; const date = new Date(Date.UTC(year, month - 1, day)); return ( date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ); } /_* Turns zod issues into `path: message` lines. _/ export function zodIssueLines(error: ZodError): string[] { return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`); } /_* Errors of courses whose points do not add up to 100 or whose grades exceed the assessment value. _/ export function checkPointSums(plan: PlanData): string[] { return plan.courses.flatMap((course) => { const total = pointsTotal(course.points); const sum = Math.abs(total - 100) > POINTS_TOLERANCE ? [`courses.${course.id}.points: sure + pend + open + lost must be 100 (got ${total})`] : []; const grades = course.assessments .filter((a) => a.score !== null && a.score > a.max) .map((a) => `courses.${course.id}.assessments: "${a.title}" score is above its value`); return [...sum, ...grades]; }); } /_* Every date in the plan with its path, for the calendar check. _/ export function planDates(plan: PlanData): [string, string][] { const dates: [string, string][] = [ ['focus.from', plan.focus.from], ['focus.to', plan.focus.to], ]; plan.focus.blocks.forEach((b, i) => dates.push([`focus.blocks.${i}.date`, b.date])); plan.study.forEach((d, i) => dates.push([`study.${i}.date`, d.date])); plan.timeline.forEach((d, i) => dates.push([`timeline.${i}.date`, d.date])); plan.questions.forEach((q, i) => { if (q.sentOn) dates.push([`questions.${i}.sentOn`, q.sentOn]); }); for (const course of plan.courses) { course.rules.forEach((r, i) => dates.push([`courses.${course.id}.rules.${i}.date`, r.date])); course.assessments.forEach((a, i) => { if (a.date) dates.push([`courses.${course.id}.assessments.${i}.date`, a.date]); }); } return dates; } /_* Errors of a day list that is not in strictly increasing date order. _/ export function checkDayOrder(name: string, days: readonly { date: string }[]): string[] { return days.flatMap((day, i) => { const previous = days[i - 1]; return previous && previous.date >= day.date ? [`${name}.${i}.date: days must be in increasing order without repeats (${day.date})`] : []; }); } /_* Errors of impossible dates, unordered day lists and a focus window that ends before it starts. _/ export function checkPlanDates(plan: PlanData): string[] { const impossible = planDates(plan) .filter(([, value]) => !isRealIsoDate(value)) .map(([path, value]) => `${path}: ${value} is not a real date`); const window = plan.focus.from > plan.focus.to ? ['focus: "from" must not be after "to"'] : []; return [ ...impossible, ...window, ...checkDayOrder('study', plan.study), ...checkDayOrder('timeline', plan.timeline), ]; } /_* Every checklist item and question id with its path (undefined when the id is missing). _/ export function planItemIds(plan: PlanData): [string, string | undefined][] { const ids: [string, string | undefined][] = []; for (const d of plan.study) d.items.forEach((it, j) => ids.push([`study.${d.date}.${j}`, it.id])); for (const d of plan.timeline) { d.items.forEach((it, j) => ids.push([`timeline.${d.date}.${j}`, it.id])); } plan.undated.forEach((it, j) => ids.push([`undated.${j}`, it.id])); plan.questions.forEach((q, j) => ids.push([`questions.${j}`, q.id])); return ids; } /_* Values that appear more than once, in order of first repeat. _/ export function repeatedValues(values: readonly string[]): string[] { const seen = new Set<string>(); const repeated = new Set<string>(); for (const value of values) (seen.has(value) ? repeated : seen).add(value); return [...repeated]; } /_* Errors of missing, malformed or repeated ids, and of repeated course ids or codes. _/ export function checkPlanIds(plan: PlanData): string[] { const ids = planItemIds(plan); const malformed = ids .filter(([, id]) => id === undefined || !PLAN_ID_PATTERN.test(id)) .map(([path, id]) => `${path}: id ${id === undefined ? 'is missing' : `"${id}" is malformed`}`); const present = ids.flatMap(([, id]) => (id === undefined ? [] : [id])); return [ ...malformed, ...repeatedValues(present).map((id) => `id "${id}" is used more than once`), ...repeatedValues(plan.courses.map((c) => c.id)).map((id) => `course id "${id}" repeats`), ...repeatedValues(plan.courses.map((c) => c.code)).map((c) => `course code "${c}" repeats`), ]; } /_* Errors of questions and WhatsApp groups that name a course code missing from `courses`. _/ export function checkCourseRefs(plan: PlanData): string[] { const codes = new Set(plan.courses.map((c) => c.code)); const refs: [string, string][] = [ ...plan.questions.map((q, i): [string, string] => [`questions.${i}`, q.course]), ...plan.whatsappGroups.map((g, i): [string, string] => [`whatsappGroups.${i}`, g.course]), ]; return refs .filter(([, code]) => !codes.has(code)) .map(([path, code]) => `${path}.course: "${code}" is not a course code`); } /_* Validates an unknown value as a plan: shape first, then the cross-field rules.
- **Input:** `input`: unknown JSON value.
- **Output:** `{ok: true, plan}` or `{ok: false, errors}` (shape first, then the cross-field rules).
- **Effects:** None (pure).
- **Errors:** None.

## `tools/bundle/plan-skill.ts`

### `hasPlanSkill`

<!-- generated:start -->

- **File:** `tools/bundle/plan-skill.ts`
- **Signature:** `hasPlanSkill(connectorDir: string): boolean`
- **Used by:** `buildConnector()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Build of the `/planejamento-faculdade` skill files (canvas-puc): the plan script bundled to `scripts/plan.mjs` and the page template with its runtime inlined to `assets/plan-template.html`. Both are generated and versioned, like `server/remote.js`; `pr:check` fails when they are stale. / import { existsSync, readFileSync } from 'node:fs'; import { join } from 'node:path'; import { build } from 'esbuild'; import type { BuildOptions } from 'esbuild'; import { GENERATED_NOTE, PLAN_RUNTIME_SLOT, PLAN_SOURCES } from './bundle.js'; /** Says whether a connector has the plan skill sources.
- **Input:** `connectorDir`: connector folder.
- **Output:** `true` when `src/plan/plan-cli.ts` exists.
- **Effects:** Reads the disk (existence check).
- **Errors:** None.

### `planCliBundleOptions`

<!-- generated:start -->

- **File:** `tools/bundle/plan-skill.ts`
- **Signature:** `planCliBundleOptions(entry: string, outfile: string): BuildOptions`
- **Used by:** `buildPlanSkill()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Build of the `/planejamento-faculdade` skill files (canvas-puc): the plan script bundled to `scripts/plan.mjs` and the page template with its runtime inlined to `assets/plan-template.html`. Both are generated and versioned, like `server/remote.js`; `pr:check` fails when they are stale. / import { existsSync, readFileSync } from 'node:fs'; import { join } from 'node:path'; import { build } from 'esbuild'; import type { BuildOptions } from 'esbuild'; import { GENERATED_NOTE, PLAN_RUNTIME_SLOT, PLAN_SOURCES } from './bundle.js'; /** Says whether a connector has the plan skill sources. _/ export function hasPlanSkill(connectorDir: string): boolean { return existsSync(join(connectorDir, PLAN_SOURCES.cliEntry)); } /_* esbuild options of the plan script: one Node ESM file with no dependencies left outside.
- **Input:** `entry`: plan CLI entry; `outfile`: output path.
- **Output:** esbuild options: one Node ESM file with a shebang and the "generated" banner.
- **Effects:** None (pure).
- **Errors:** None.

### `planRuntimeBundleOptions`

<!-- generated:start -->

- **File:** `tools/bundle/plan-skill.ts`
- **Signature:** `planRuntimeBundleOptions(entry: string): BuildOptions & { write: false }`
- **Used by:** `buildPlanTemplate()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Build of the `/planejamento-faculdade` skill files (canvas-puc): the plan script bundled to `scripts/plan.mjs` and the page template with its runtime inlined to `assets/plan-template.html`. Both are generated and versioned, like `server/remote.js`; `pr:check` fails when they are stale. / import { existsSync, readFileSync } from 'node:fs'; import { join } from 'node:path'; import { build } from 'esbuild'; import type { BuildOptions } from 'esbuild'; import { GENERATED_NOTE, PLAN_RUNTIME_SLOT, PLAN_SOURCES } from './bundle.js'; /** Says whether a connector has the plan skill sources. _/ export function hasPlanSkill(connectorDir: string): boolean { return existsSync(join(connectorDir, PLAN_SOURCES.cliEntry)); } /_* esbuild options of the plan script: one Node ESM file with no dependencies left outside. _/ export function planCliBundleOptions(entry: string, outfile: string): BuildOptions { return { entryPoints: [entry], outfile, bundle: true, platform: 'node', format: 'esm', target: 'node20', banner: { js: `#!/usr/bin/env node\n// ${GENERATED_NOTE}` }, logLevel: 'warning', }; } /_* esbuild options of the page runtime: one browser script, returned in memory.
- **Input:** `entry`: page runtime entry.
- **Output:** esbuild options: in-memory (`write: false`) browser IIFE for ES2020.
- **Effects:** None (pure).
- **Errors:** None.

### `inlinePlanRuntime`

<!-- generated:start -->

- **File:** `tools/bundle/plan-skill.ts`
- **Signature:** `inlinePlanRuntime(template: string, runtime: string): string`
- **Used by:** `buildPlanTemplate()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Build of the `/planejamento-faculdade` skill files (canvas-puc): the plan script bundled to `scripts/plan.mjs` and the page template with its runtime inlined to `assets/plan-template.html`. Both are generated and versioned, like `server/remote.js`; `pr:check` fails when they are stale. / import { existsSync, readFileSync } from 'node:fs'; import { join } from 'node:path'; import { build } from 'esbuild'; import type { BuildOptions } from 'esbuild'; import { GENERATED_NOTE, PLAN_RUNTIME_SLOT, PLAN_SOURCES } from './bundle.js'; /** Says whether a connector has the plan skill sources. _/ export function hasPlanSkill(connectorDir: string): boolean { return existsSync(join(connectorDir, PLAN_SOURCES.cliEntry)); } /_* esbuild options of the plan script: one Node ESM file with no dependencies left outside. _/ export function planCliBundleOptions(entry: string, outfile: string): BuildOptions { return { entryPoints: [entry], outfile, bundle: true, platform: 'node', format: 'esm', target: 'node20', banner: { js: `#!/usr/bin/env node\n// ${GENERATED_NOTE}` }, logLevel: 'warning', }; } /_* esbuild options of the page runtime: one browser script, returned in memory. _/ export function planRuntimeBundleOptions(entry: string): BuildOptions & { write: false } { return { entryPoints: [entry], bundle: true, write: false, platform: 'browser', format: 'iife', target: 'es2020', charset: 'utf8', legalComments: 'none', logLevel: 'warning', }; } /_* Template with the runtime inlined in place of the slot; throws when either side is unsafe to join.
- **Input:** `template`: template source; `runtime`: bundled page script.
- **Output:** Template with `<script>` (banner + runtime) in place of `<!--plan-runtime-->`.
- **Effects:** None (pure).
- **Errors:** Throws when the slot is missing or repeated, or when the runtime contains `</script` or `<!--`.

### `buildPlanTemplate`

<!-- generated:start -->

- **File:** `tools/bundle/plan-skill.ts`
- **Signature:** `async buildPlanTemplate(connectorDir: string): Promise<string>`
- **Used by:** `buildPlanSkill()`
- **Processes:** P05

<!-- generated:end -->

- **Does:** Build of the `/planejamento-faculdade` skill files (canvas-puc): the plan script bundled to `scripts/plan.mjs` and the page template with its runtime inlined to `assets/plan-template.html`. Both are generated and versioned, like `server/remote.js`; `pr:check` fails when they are stale. / import { existsSync, readFileSync } from 'node:fs'; import { join } from 'node:path'; import { build } from 'esbuild'; import type { BuildOptions } from 'esbuild'; import { GENERATED_NOTE, PLAN_RUNTIME_SLOT, PLAN_SOURCES } from './bundle.js'; /** Says whether a connector has the plan skill sources. _/ export function hasPlanSkill(connectorDir: string): boolean { return existsSync(join(connectorDir, PLAN_SOURCES.cliEntry)); } /_* esbuild options of the plan script: one Node ESM file with no dependencies left outside. _/ export function planCliBundleOptions(entry: string, outfile: string): BuildOptions { return { entryPoints: [entry], outfile, bundle: true, platform: 'node', format: 'esm', target: 'node20', banner: { js: `#!/usr/bin/env node\n// ${GENERATED_NOTE}` }, logLevel: 'warning', }; } /_* esbuild options of the page runtime: one browser script, returned in memory. _/ export function planRuntimeBundleOptions(entry: string): BuildOptions & { write: false } { return { entryPoints: [entry], bundle: true, write: false, platform: 'browser', format: 'iife', target: 'es2020', charset: 'utf8', legalComments: 'none', logLevel: 'warning', }; } /_* Template with the runtime inlined in place of the slot; throws when either side is unsafe to join. _/ export function inlinePlanRuntime(template: string, runtime: string): string { if (template.split(PLAN_RUNTIME_SLOT).length !== 2) { throw new Error(`The plan template needs exactly one ${PLAN_RUNTIME_SLOT}.`); } if (/<\/script|<!--/i.test(runtime)) { throw new Error('The plan runtime contains "</script" or "<!--": it cannot be inlined safely.'); } const script = `<script>\n// ${GENERATED_NOTE}\n${runtime}</script>`; return template.replace(PLAN_RUNTIME_SLOT, () => script); } /_* Builds the page template of a connector in memory (template source + bundled runtime).
- **Input:** `connectorDir`: connector folder.
- **Output:** Promise of the full page template (HTML).
- **Effects:** Reads `src/plan/template.html` and bundles the runtime with esbuild (in memory).
- **Errors:** esbuild errors and `inlinePlanRuntime` errors propagate.

## `tools/pr-check/cli.ts`

### `runPrCheckCli`

<!-- generated:start -->

- **File:** `tools/pr-check/cli.ts`
- **Signature:** `runPrCheckCli(): void`
- **Used by:** `tools/pr-check/cli.ts (module)`
- **Processes:** P06

<!-- generated:end -->

- **Does:** Prints `build` or `skip` for the WhatsApp image step of `pr:check`.
- **Input:** `argv[3]`: base ref, default `origin/main`; the current folder.
- **Output:** `build` or `skip` on stdout.
- **Effects:** Runs git through `listChangedFiles()`; writes to stdout.
- **Errors:** git errors propagate and fail `pr:check`.

## `tools/pr-check/whatsapp-image.ts`

### `touchesWhatsAppImage`

<!-- generated:start -->

- **File:** `tools/pr-check/whatsapp-image.ts`
- **Signature:** `touchesWhatsAppImage(files: string[]): boolean`
- **Used by:** `whatsAppImageDecision()`
- **Processes:** P06

<!-- generated:end -->

- **Does:** Says whether the diff touches the WhatsApp container image inputs (`WHATSAPP_IMAGE_INPUTS`), so `pr:check` must build the image.
- **Input:** `files`: changed paths, relative to the repository root.
- **Output:** `true` when a path equals an input file or is inside an input folder.
- **Effects:** None (pure).
- **Errors:** None.

### `splitGitLines`

<!-- generated:start -->

- **File:** `tools/pr-check/whatsapp-image.ts`
- **Signature:** `splitGitLines(outputs: string[]): string[]`
- **Used by:** `listChangedFiles()`
- **Processes:** P06

<!-- generated:end -->

- **Does:** Joins the outputs of several `git ... --name-only` commands into one path list.
- **Input:** `outputs`: raw git outputs, one path per line.
- **Output:** Unique, trimmed, non-empty paths, in first-seen order.
- **Effects:** None (pure).
- **Errors:** None.

### `runGit`

<!-- generated:start -->

- **File:** `tools/pr-check/whatsapp-image.ts`
- **Signature:** `runGit(cwd: string, args: string[]): string`
- **Used by:** `listChangedFiles()`
- **Processes:** P06

<!-- generated:end -->

- **Does:** Runs one git command in a folder and returns its output.
- **Input:** `cwd`: repository folder; `args`: git arguments.
- **Output:** git's stdout.
- **Effects:** Spawns `git`.
- **Errors:** Throws `git <args> failed: <stderr>` when git exits non-zero.

### `listChangedFiles`

<!-- generated:start -->

- **File:** `tools/pr-check/whatsapp-image.ts`
- **Signature:** `listChangedFiles(cwd: string, base: string): string[]`
- **Used by:** `runPrCheckCli()`
- **Processes:** P06

<!-- generated:end -->

- **Does:** Lists every file changed since the merge-base with `base`: branch commits, staged and unstaged edits and untracked files.
- **Input:** `cwd`: repository folder; `base`: branch or ref to compare with (e.g. `origin/main`).
- **Output:** Unique paths relative to the repository root.
- **Effects:** Runs `git merge-base`, `git diff --name-only` (twice) and `git ls-files --others --exclude-standard`.
- **Errors:** Throws (via `runGit()`) when `base` does not exist.

### `whatsAppImageDecision`

<!-- generated:start -->

- **File:** `tools/pr-check/whatsapp-image.ts`
- **Signature:** `whatsAppImageDecision(files: string[]): 'build' | 'skip'`
- **Used by:** `runPrCheckCli()`
- **Processes:** P06

<!-- generated:end -->

- **Does:** Turns the changed files into the word `pr:check` acts on for the WhatsApp image step.
- **Input:** `files`: changed paths, relative to the repository root.
- **Output:** `build` when `touchesWhatsAppImage()` is true, else `skip`.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/changes.ts`

### `latestStamp`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/changes.ts`
- **Signature:** `latestStamp(stamps: Stamps): number`
- **Used by:** `keepChanged()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Picks the latest valid timestamp among an item's dates.
- **Input:** `stamps`: ISO dates, possibly `null`/`undefined` or invalid.
- **Output:** Milliseconds of the latest valid date, or `NaN` when none is valid.
- **Effects:** None (pure).
- **Errors:** None.

### `keepChanged`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/changes.ts`
- **Signature:** `keepChanged(items: readonly T[], since: string | undefined, stampsOf: (item: T) => Stamps): readonly T[]`
- **Used by:** `connectors/canvas-puc/src/tools-inbox.ts (module)`, `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Keeps the items changed at or after the `changed_since` cursor; items with no date stay, so nothing is missed.
- **Input:** `items`; `since`: ISO cursor or `undefined`; `stampsOf`: reads the dates of an item.
- **Output:** The same array when there is no cursor, else the filtered items.
- **Effects:** None (pure).
- **Errors:** None (`changedSinceArg` validates the cursor before).

### `assignmentStamps`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/changes.ts`
- **Signature:** `assignmentStamps(a: CanvasAssignment): Stamps`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Lists the dates that change an assignment for the student.
- **Input:** `a`: Canvas assignment with `include[]=submission`.
- **Output:** `[updated_at, submission.submitted_at, submission.graded_at]`.
- **Effects:** None (pure).
- **Errors:** None.

### `announcementStamps`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/changes.ts`
- **Signature:** `announcementStamps(a: CanvasAnnouncement): Stamps`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Lists the date of an announcement.
- **Input:** `a`: Canvas announcement.
- **Output:** `[posted_at]`.
- **Effects:** None (pure).
- **Errors:** None.

### `topicStamps`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/changes.ts`
- **Signature:** `topicStamps(t: CanvasDiscussionTopic): Stamps`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Lists the dates of a discussion forum.
- **Input:** `t`: Canvas discussion topic.
- **Output:** `[posted_at, last_reply_at]`.
- **Effects:** None (pure).
- **Errors:** None.

### `conversationStamps`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/changes.ts`
- **Signature:** `conversationStamps(c: CanvasConversation): Stamps`
- **Used by:** `connectors/canvas-puc/src/tools-inbox.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Lists the date of the last message of an inbox conversation.
- **Input:** `c`: Canvas conversation.
- **Output:** `[last_message_at]`.
- **Effects:** None (pure).
- **Errors:** None.

### `checkedAtNote`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/changes.ts`
- **Signature:** `checkedAtNote(now: Date): string`
- **Used by:** `withCheckedAt()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the note that gives the model the cursor for its next call.
- **Input:** `now`: time taken before reading Canvas.
- **Output:** `checked_at=<ISO> (pass it as changed_since ...)`.
- **Effects:** None (pure).
- **Errors:** None.

### `withCheckedAt`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/changes.ts`
- **Signature:** `withCheckedAt(data: unknown, now: Date): RawToolResult`
- **Used by:** `connectors/canvas-puc/src/tools-inbox.ts (module)`, `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Wraps a listing with the `checked_at` note.
- **Input:** `data`: the views; `now`: the cursor time.
- **Output:** `RawToolResult`: compact JSON block plus the note block.
- **Effects:** None (pure).
- **Errors:** None.

## `connectors/canvas-puc/src/peer-reviews.ts`

### `revieweeName`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `revieweeName(req: GqlAssessmentRequest, anonymous: boolean): string`
- **Used by:** `toPeerReview()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Gives the name of the student to review, or explains that Canvas hides it (anonymous peer reviews).
- **Input:** `req`: assessment request; `anonymous`: whether reviews are anonymous.
- **Output:** Name or explanation text.
- **Effects:** None (pure).
- **Errors:** None.

### `assignmentPageUrl`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `assignmentPageUrl(a: GqlPeerReviewAssignment, baseUrl: string): string`
- **Used by:** `reviewPageUrl()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Builds the absolute link of an assignment page, under its course when known.
- **Input:** `a`: GraphQL assignment; `baseUrl`: Canvas base URL.
- **Output:** URL.
- **Effects:** None (pure).
- **Errors:** None.

### `reviewedSubmissionPath`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `reviewedSubmissionPath(anonymous: boolean, req: GqlAssessmentRequest): string | null`
- **Used by:** `reviewPageUrl()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Path of the reviewed submission under its assignment: `/anonymous_submissions/<anonymousId>` or `/submissions/<user id>`.
- **Input:** `anonymous`: anonymous reviews; `req`: assessment request.
- **Output:** The path, or `null` when neither id is known.
- **Effects:** None (pure).
- **Errors:** None.

### `reviewPageUrl`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `reviewPageUrl(a: GqlPeerReviewAssignment, req: GqlAssessmentRequest, baseUrl: string): string`
- **Used by:** `toPeerReview()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Link to the Canvas page where the student does the review.
- **Input:** `a`: assignment; `req`: assessment request; `baseUrl`: Canvas base URL.
- **Output:** URL of the review page, or of the assignment when the submission is unknown.
- **Effects:** None (pure).
- **Errors:** None.

### `peerSubmissionView`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `peerSubmissionView(sub: GqlPeerSubmission | null | undefined): View | null`
- **Used by:** `toPeerReview()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Summarizes what the reviewee sent: type, URL and date, plus the attachments only when there is no URL (skips Canvas's page snapshot).
- **Input:** `sub`: GraphQL submission.
- **Output:** View, or `null` without a submission.
- **Effects:** None (pure).
- **Errors:** None.

### `orNull`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `orNull(value: T | null | undefined): T | null`
- **Used by:** `peerReviewAssignmentFields()`, `toPeerReview()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Turns a missing value into `null`, keeping absent fields explicit for the model.
- **Input:** `value`: any value.
- **Output:** The value or `null`.
- **Effects:** None (pure).
- **Errors:** None.

### `peerReviewAssignmentFields`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `peerReviewAssignmentFields(a: GqlPeerReviewAssignment): View`
- **Used by:** `toPeerReview()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Fields of a peer review that come from its assignment: course, assignment, review due date, assignment due date and anonymity.
- **Input:** `a`: GraphQL assignment.
- **Output:** View.
- **Effects:** None (pure).
- **Errors:** None.

### `toPeerReview`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `toPeerReview(a: GqlPeerReviewAssignment, req: GqlAssessmentRequest, baseUrl: string): View`
- **Used by:** `peerReviewsOf()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converts one assessment request into the view `list_peer_reviews` returns.
- **Input:** `a`: assignment; `req`: assessment request; `baseUrl`: Canvas base URL.
- **Output:** View with course, assignment, `due_at`, `reviewee`, `anonymous`, `status`, `available`, `submission`, `review_url`.
- **Effects:** None (pure).
- **Errors:** None.

### `peerReviewsOf`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `peerReviewsOf(a: GqlPeerReviewAssignment, baseUrl: string): View[]`
- **Used by:** `assignmentPeerReviews()`, `listCoursePeerReviews()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Converts every peer review of an assignment assigned to the student.
- **Input:** `a`: GraphQL assignment; `baseUrl`: Canvas base URL.
- **Output:** List of views (empty without requests).
- **Effects:** None (pure).
- **Errors:** None.

### `reviewRank`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `reviewRank(review: View): number`
- **Used by:** `sortPeerReviews()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Sort rank of a peer review: pending before completed.
- **Input:** `review`: view.
- **Output:** 0 or 1.
- **Effects:** None (pure).
- **Errors:** None.

### `reviewDueTime`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `reviewDueTime(review: View): number`
- **Used by:** `sortPeerReviews()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Due instant of a peer review for sorting; undated or invalid dates sort last.
- **Input:** `review`: view.
- **Output:** Milliseconds, or `Number.MAX_SAFE_INTEGER`.
- **Effects:** None (pure).
- **Errors:** None.

### `sortPeerReviews`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `sortPeerReviews(reviews: readonly T[]): T[]`
- **Used by:** `listPeerReviews()`, `sweepPeerReviews()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Sorts peer reviews: pending first, then the nearest due date.
- **Input:** `reviews`: views.
- **Output:** New sorted list.
- **Effects:** None (pure).
- **Errors:** None.

### `peerReviewDenial`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `peerReviewDenial(status: number | null, target: string): string | null`
- **Used by:** `assignmentPeerReviews()`, `explainPeerReviewError()`, `fetchPeerReviewAssignment()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Clear message for a status Canvas uses to refuse (401/403: the route may be closed to students, or the course unpublished or restricted) or hide (404) a resource.
- **Input:** `status`: HTTP status; `target`: what was asked ("course 1").
- **Output:** Message, or `null` for any other status.
- **Effects:** None (pure).
- **Errors:** None.

### `explainPeerReviewError`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `explainPeerReviewError(error: unknown, target: string): unknown`
- **Used by:** `listCoursePeerReviews()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Rewrites a 401/403/404 from Canvas into a clear `CanvasApiError` with the same status.
- **Input:** `error`: caught error; `target`: what was asked.
- **Output:** The new error, or `error` unchanged (rejected token, other statuses, non-Canvas errors).
- **Effects:** None (pure).
- **Errors:** None (returns the error, the caller throws it).

### `fetchPeerReviewAssignment`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `async fetchPeerReviewAssignment(client: CanvasClient, assignmentId: Id): Promise<GqlPeerReviewAssignment>`
- **Used by:** `assignmentPeerReviews()`, `listCoursePeerReviews()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Reads an assignment and the peer reviews assigned to the student through GraphQL (`assessmentRequestsForCurrentUser`), the route that works for a student account.
- **Input:** `client`: Canvas client; `assignmentId`: assignment.
- **Output:** GraphQL assignment.
- **Effects:** Network: one GraphQL query.
- **Errors:** `CanvasApiError` 404 when Canvas hides or lacks the assignment; client errors.

### `peerReviewAssignmentIds`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `async peerReviewAssignmentIds(client: CanvasClient, courseId: Id): Promise<Id[]>`
- **Used by:** `listCoursePeerReviews()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Lists a course's assignments (every page, via the `Link` header) and keeps those with peer reviews.
- **Input:** `client`: Canvas client; `courseId`: course.
- **Output:** Assignment ids.
- **Effects:** Network: `GET /courses/:id/assignments` (paginated).
- **Errors:** Client errors.

### `listCoursePeerReviews`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `async listCoursePeerReviews(client: CanvasClient, courseId: Id): Promise<View[]>`
- **Used by:** `listPeerReviews()`, `sweepPeerReviews()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Every peer review the student must do in a course.
- **Input:** `client`: Canvas client; `courseId`: course.
- **Output:** List of views.
- **Effects:** Network: assignments listing plus one GraphQL query per peer-review assignment.
- **Errors:** Clear `CanvasApiError` on 401/403/404 (`explainPeerReviewError()`); a rejected token passes unchanged.

### `assignmentPeerReviews`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `async assignmentPeerReviews(client: CanvasClient, args: PeerReviewArgs): Promise<View[]>`
- **Used by:** `listPeerReviews()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Peer reviews of one assignment, checking it belongs to `course_id` when given.
- **Input:** `client`: Canvas client; `args`: `assignment_id` and optional `course_id`.
- **Output:** List of views.
- **Effects:** Network: one GraphQL query.
- **Errors:** `CanvasApiError` 404 when the assignment is missing, hidden or in another course.

### `sweepPeerReviews`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `async sweepPeerReviews(client: CanvasClient): Promise<PeerReviewList>`
- **Used by:** `listPeerReviews()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Sweeps the active courses; a course Canvas refuses goes to `unavailable` instead of failing the others.
- **Input:** `client`: Canvas client.
- **Output:** `{ peer_reviews, unavailable? }`, pending first.
- **Effects:** Network: active courses plus each course's lookups, in parallel.
- **Errors:** Only a rejected token (401) fails the whole sweep.

### `listPeerReviews`

<!-- generated:start -->

- **File:** `connectors/canvas-puc/src/peer-reviews.ts`
- **Signature:** `async listPeerReviews(client: CanvasClient, args: PeerReviewArgs): Promise<PeerReviewList>`
- **Used by:** `connectors/canvas-puc/src/tools-read.ts (module)`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Runs `list_peer_reviews`: one assignment, one course or every active course; read-only (never submits a review).
- **Input:** `client`: Canvas client; `args`: optional `course_id` and `assignment_id` (numeric, validated by `canvasIdSchema`).
- **Output:** `{ peer_reviews, unavailable? }`.
- **Effects:** Network: see `assignmentPeerReviews()`, `listCoursePeerReviews()` and `sweepPeerReviews()`.
- **Errors:** Clear `CanvasApiError` for 401/403/404 on the course or assignment asked for; rejected token.

## `src/core/async.ts`

### `drainQueue`

<!-- generated:start -->

- **File:** `src/core/async.ts`
- **Signature:** `async drainQueue(queue: WorkQueue<T, R>, fn: (item: T) => Promise<R>): Promise<void>`
- **Used by:** `mapWithLimit()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** One worker of `mapWithLimit()`: takes the next item from the shared queue until none is left, storing each result at its index.
- **Input:** `queue`: items, results and next index; `fn`: async work.
- **Output:** Nothing; fills `queue.results`.
- **Effects:** Mutates `queue`; whatever `fn` does.
- **Errors:** Rejects with the first error of `fn`.

### `mapWithLimit`

<!-- generated:start -->

- **File:** `src/core/async.ts`
- **Signature:** `async mapWithLimit(items: readonly T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]>`
- **Used by:** `listCoursePeerReviews()`, `sweepPeerReviews()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Maps a list with an async function running at most `limit` calls at once (results in input order).
- **Input:** `items`: list; `limit`: max calls at once (at least 1); `fn`: async work.
- **Output:** Results in input order.
- **Effects:** Whatever `fn` does.
- **Errors:** Rejects with the first error of `fn`.

## `src/core/time.ts`

### `parseOffsetLabel`

<!-- generated:start -->

- **File:** `src/core/time.ts`
- **Signature:** `parseOffsetLabel(label: string | undefined): number`
- **Used by:** `zoneOffsetMinutes()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Reads the minutes of an `Intl` `longOffset` label, refusing anything unexpected instead of guessing UTC.
- **Input:** `label`: `GMT`, `GMT-03:00`, `GMT+05:30`...
- **Output:** Minutes from UTC.
- **Effects:** None (pure).
- **Errors:** `RangeError` for any other label.

### `zoneOffsetMinutes`

<!-- generated:start -->

- **File:** `src/core/time.ts`
- **Signature:** `zoneOffsetMinutes(instant: Date, timeZone: string): number`
- **Used by:** `startOfDayIn()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Reads the offset of a time zone from UTC at an instant with `Intl` (follows daylight saving time).
- **Input:** `instant`: date; `timeZone`: IANA name.
- **Output:** Minutes (São Paulo → -180, UTC → 0).
- **Effects:** None (pure).
- **Errors:** `RangeError` for an unknown time zone (or an unreadable label, `parseOffsetLabel()`).

### `startOfDayIn`

<!-- generated:start -->

- **File:** `src/core/time.ts`
- **Signature:** `startOfDayIn(instant: Date, timeZone: string): Date`
- **Used by:** `plannerWindow()`
- **Processes:** P03

<!-- generated:end -->

- **Does:** Computes 00:00 of the calendar day that contains an instant in a time zone.
- **Input:** `instant`: date; `timeZone`: IANA name.
- **Output:** The instant of local midnight.
- **Effects:** None (pure).
- **Errors:** `RangeError` for an unknown time zone.

## Data and constants

| Name                              | File                                                    | What it is                                                                                                                                                                                   |
| --------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CANVAS_USER_AGENT`               | `connectors/canvas-puc/src/remote.ts`                   | User-Agent of the remote mode's calls to Canvas (Canvas returns 403 without a User-Agent).                                                                                                   |
| `TOKEN_RENEWAL_SECONDS`           | `connectors/canvas-puc/src/remote.ts`                   | How much each renewal extends the Canvas token: 30 days minus 1 hour (Canvas refuses more than 30 days ahead).                                                                               |
| `TEST_EXCEPTIONS`                 | `src/test-exceptions.ts`                                | Single list of functions without automated tests, with reason and manual test.                                                                                                               |
| `DEFAULT_DOCS_CONFIG`             | `tools/docs/config.ts`                                  | Default `docs:check` configuration; `docs.config.json` overrides it.                                                                                                                         |
| `MODULE_SCOPE_SUFFIX`             | `tools/docs/ast.ts`                                     | Suffix of the label for a reference made outside a function (`arquivo (module)`).                                                                                                            |
| `WALK_IGNORED_DIRS`               | `tools/docs/inventory.ts`                               | Folders skipped when walking the disk without git.                                                                                                                                           |
| `GENERATED_START`                 | `tools/docs/markdown.ts`                                | Start marker of the generated block in FUNCTIONS.md.                                                                                                                                         |
| `GENERATED_END`                   | `tools/docs/markdown.ts`                                | End marker of the generated block.                                                                                                                                                           |
| `INDEX_START`                     | `tools/docs/markdown.ts`                                | Start marker of the per-module index.                                                                                                                                                        |
| `INDEX_END`                       | `tools/docs/markdown.ts`                                | End marker of the per-module index.                                                                                                                                                          |
| `PLACEHOLDER`                     | `tools/docs/markdown.ts`                                | `_fill_in_` text left in new manual fields.                                                                                                                                                  |
| `MANUAL_FIELDS`                   | `tools/docs/render.ts`                                  | Fixed order of the manual fields (Does, Input, Output, Effects, Errors).                                                                                                                     |
| `HTML_SKIPPED_TAGS`               | `src/core/html.ts`                                      | Tags whose content never reaches the text (`script`, `style`, `noscript`, `template`, `head`, `title`).                                                                                      |
| `HTML_BLOCK_TAGS`                 | `src/core/html.ts`                                      | Tags whose closing ends a line (`p`, `div`, `li`, `h1`–`h6`, `tr`).                                                                                                                          |
| `HTML_MEDIA_TAGS`                 | `src/core/html.ts`                                      | Media tags collected as references and the attribute holding their URL.                                                                                                                      |
| `HTML_KEPT_ATTRS`                 | `src/core/html.ts`                                      | Attributes kept on each reference (`title`, `alt`, `data-api-endpoint`, `data-media-id`...).                                                                                                 |
| `HTML_TEXT_CLEANUPS`              | `src/core/html.ts`                                      | Final cleanups of the text: non-breaking spaces, trailing spaces, repeated blank lines.                                                                                                      |
| `LIST_FILES_HINT`                 | `connectors/canvas-puc/src/linked-files.ts`             | Note added to every `list_files` answer: students do not see hidden files; use `links` or `list_linked_files`.                                                                               |
| `VIDEO_PROVIDERS`                 | `connectors/canvas-puc/src/links.ts`                    | Followable video providers (YouTube, Vimeo, Panopto, Stream, SharePoint and Drive, the last two only embedded).                                                                              |
| `PLAYER_TAGS`                     | `connectors/canvas-puc/src/links.ts`                    | Tags that play media (`iframe`, `video`, `audio`, `source`, `embed`).                                                                                                                        |
| `CANVAS_PATH_PATTERNS`            | `connectors/canvas-puc/src/links.ts`                    | Canvas URL paths (files, media, pages, assignments...) and the ids each one carries.                                                                                                         |
| `fileRefShape`                    | `connectors/canvas-puc/src/tools-read.ts`               | File arguments of `download_file` and `read_file_text`: `file_id`, `url`, `course_id`.                                                                                                       |
| `CFB_SIGNATURE`                   | `src/core/cfb.ts`                                       | The first 8 bytes of every OLE/CFB file (the .doc container).                                                                                                                                |
| `CP1252_HIGH`                     | `src/core/word.ts`                                      | Windows-1252 characters 0x80 to 0x9F, used when decoding the .doc's 8-bit text.                                                                                                              |
| `WORD_TEXT_REPLACEMENTS`          | `src/core/word.ts`                                      | Replacements (regex → text) applied in order by `cleanWordText` to Word marks.                                                                                                               |
| `MAX_DOWNLOAD_BYTES`              | `connectors/canvas-puc/src/files.ts`                    | Largest file `download_file` brings into the conversation (70 MB, in parts — ADR 0023, 0024).                                                                                                |
| `MAX_DOWNLOAD_MB`                 | `connectors/canvas-puc/src/files.ts`                    | The same limit in MB (70), used in the tool description and refusals.                                                                                                                        |
| `MAX_UPLOAD_BYTES`                | `connectors/canvas-puc/src/upload.ts`                   | Largest file `submit_file_assignment` accepts (5 MB — ADR 0026).                                                                                                                             |
| `MAX_UPLOAD_MB`                   | `connectors/canvas-puc/src/upload.ts`                   | The same limit in MB (5), used in the tool description and refusals.                                                                                                                         |
| `MAX_CHUNK_BYTES`                 | `connectors/canvas-puc/src/chunks.ts`                   | Largest part `download_file` returns per call (8 MB; ADR 0024).                                                                                                                              |
| `downloadFileShape`               | `connectors/canvas-puc/src/tools-read.ts`               | Arguments of `download_file` (`fileRefShape` plus `offset`, `length`), shared with `streamCanvasTool()`.                                                                                     |
| `MAX_TEXT_CHARS`                  | `connectors/canvas-puc/src/files.ts`                    | Largest text returned by `read_file_text` (100,000 characters).                                                                                                                              |
| `CONNECTORS_DIR`                  | `tools/bundle/bundle.ts`                                | Connectors folder relative to the root (`connectors`).                                                                                                                                       |
| `PLUGIN_DIR`                      | `tools/bundle/bundle.ts`                                | Plugin subfolder of each connector (`plugin`), holding only plugin content (ADR 0020).                                                                                                       |
| `PLUGIN_MANIFEST_PATH`            | `tools/bundle/bundle.ts`                                | Plugin manifest in each connector (`plugin/.claude-plugin/plugin.json`); marks the folder as a connector.                                                                                    |
| `PLUGIN_MCP_CONFIG_PATH`          | `tools/bundle/bundle.ts`                                | Plugin MCP config (`plugin/.mcp.json`) with the remote server URL.                                                                                                                           |
| `CANVAS_PAGE_SIZE`                | `connectors/canvas-puc/src/client.ts`                   | Items per page requested from Canvas (`per_page`, the API maximum).                                                                                                                          |
| `CANVAS_TIMEOUT_MS`               | `connectors/canvas-puc/src/client.ts`                   | Time limit of each Canvas API call (30 s); a timeout becomes a clear 504 error.                                                                                                              |
| `CANVAS_GRAPHQL_PATH`             | `connectors/canvas-puc/src/client.ts`                   | Canvas GraphQL endpoint (`/api/graphql`, outside `/api/v1`), used only for read-only queries.                                                                                                |
| `PLANNER_TYPE_NAMES`              | `connectors/canvas-puc/src/format.ts`                   | Planner types renamed for the model (`assessment_request` → `peer_review`).                                                                                                                  |
| `CANVAS_TIME_ZONE`                | `connectors/canvas-puc/src/helpers.ts`                  | Time zone of PUC Minas (`America/Sao_Paulo`): the planner window starts at 00:00 here.                                                                                                       |
| `PEER_REVIEWS_QUERY`              | `connectors/canvas-puc/src/peer-reviews.ts`             | GraphQL query of an assignment with `assessmentRequestsForCurrentUser` (peer reviews the student must do).                                                                                   |
| `PEER_REVIEW_CONCURRENCY`         | `connectors/canvas-puc/src/peer-reviews.ts`             | Canvas calls running at once per level of the peer-review sweep (courses, then assignments).                                                                                                 |
| `canvasIdSchema`                  | `connectors/canvas-puc/src/peer-reviews.ts`             | Zod schema of a numeric Canvas id (string of digits or positive integer).                                                                                                                    |
| `CONVERSATION_PREVIEW_LENGTH`     | `connectors/canvas-puc/src/inbox.ts`                    | Maximum length of the last-message preview in `list_conversations`.                                                                                                                          |
| `changedSinceArg`                 | `connectors/canvas-puc/src/changes.ts`                  | Optional `changed_since` argument (ISO with offset) of `list_assignments`, `list_announcements`, `list_discussions` and `list_conversations`.                                                |
| `MAX_MESSAGE_RECIPIENTS`          | `connectors/canvas-puc/src/tools-inbox.ts`              | Maximum recipients of one `send_message` (user IDs only).                                                                                                                                    |
| `CANVAS_INBOX_READ_TOOLS`         | `connectors/canvas-puc/src/tools-inbox.ts`              | Inbox read tools: `find_recipients`, `list_conversations`, `get_conversation`.                                                                                                               |
| `CANVAS_INBOX_WRITE_TOOLS`        | `connectors/canvas-puc/src/tools-inbox.ts`              | Inbox send tools `send_message`, `reply_message` (with attachments); always listed, refusing with the reason when writing is off for the user.                                               |
| `DEFAULT_MAX_ITEMS`               | `connectors/canvas-puc/src/client.ts`                   | Default limit of items summed across pages in `getAll`.                                                                                                                                      |
| `DEFAULT_CANVAS_URL`              | `connectors/canvas-puc/src/remote.ts`                   | PUC Minas Canvas URL, used without `CANVAS_BASE_URL`.                                                                                                                                        |
| `MAX_TEXT_LENGTH`                 | `connectors/canvas-puc/src/format.ts`                   | Maximum length of long texts returned to the model by `shortText`.                                                                                                                           |
| `ASSIGNMENT_BUCKETS`              | `connectors/canvas-puc/src/helpers.ts`                  | `list_assignments` filters → Canvas API `bucket` (`all` does not filter).                                                                                                                    |
| `CANVAS_READ_TOOLS`               | `connectors/canvas-puc/src/tools-read.ts`               | Canvas read MCP tools (courses, assignments, grades, announcements etc.).                                                                                                                    |
| `CANVAS_WRITE_TOOLS`              | `connectors/canvas-puc/src/tools-write.ts`              | Write MCP tools (`submit_text_assignment`, `submit_file_assignment`, `reply_to_discussion`); destructive; always listed, refusing with the reason when writing is off for the user.          |
| `CANVAS_SERVER_INFO`              | `connectors/canvas-puc/src/tools.ts`                    | MCP server name and version; the version comes from `plugin/.claude-plugin/plugin.json`.                                                                                                     |
| `REMOTE_ENTRY`                    | `tools/bundle/bundle.ts`                                | Entry of a connector's Node remote server (`src/remote-main.ts`).                                                                                                                            |
| `REMOTE_BUNDLE_PATH`              | `tools/bundle/bundle.ts`                                | Remote server bundle (`server/remote.js`), used by the Dockerfile.                                                                                                                           |
| `SEAL_KEY_BYTES`                  | `src/remote/seal.ts`                                    | Size of `SEAL_KEY` (32 bytes, AES-256).                                                                                                                                                      |
| `CLIENT_TTL_SECONDS`              | `src/remote/oauth.ts`                                   | Lifetime of the registered `client_id` (10 years).                                                                                                                                           |
| `PENDING_TTL_SECONDS`             | `src/remote/tokens.ts`                                  | Lifetime of the request sealed in the login form (15 minutes).                                                                                                                               |
| `CODE_TTL_SECONDS`                | `src/remote/tokens.ts`                                  | Lifetime of the authorization code (5 minutes).                                                                                                                                              |
| `ACCESS_TTL_SECONDS`              | `src/remote/tokens.ts`                                  | Lifetime of the access token (1 hour).                                                                                                                                                       |
| `REFRESH_TTL_SECONDS`             | `src/remote/tokens.ts`                                  | Lifetime of the refresh token (30 days, like the PUC token).                                                                                                                                 |
| `REVOKED_SECRET_DESCRIPTION`      | `src/remote/handler.ts`                                 | `error_description` of the `invalid_grant` answered when the connector says the credential was revoked.                                                                                      |
| `LOGIN_PAGE_CSS`                  | `src/remote/login-page.ts`                              | Style of the authorization page, with the tokens from `docs/UI.md`.                                                                                                                          |
| `CORS_HEADERS`                    | `src/remote/handler.ts`                                 | CORS headers of the remote endpoints (any origin; there are no cookies).                                                                                                                     |
| `REMOTE_ROUTES`                   | `src/remote/handler.ts`                                 | Table `MÉTODO caminho` → remote server function.                                                                                                                                             |
| `DEFAULT_REDIRECT_HOSTS`          | `src/remote/oauth.ts`                                   | OAuth redirect hosts accepted by default (`claude.ai`, `claude.com`, `localhost`).                                                                                                           |
| `MAX_BODY_BYTES`                  | `src/remote/node-server.ts`                             | Largest request body accepted by the remote server (1 MB).                                                                                                                                   |
| `PDF_ESCAPES`                     | `src/core/pdf.ts`                                       | Letter escapes of PDF literal strings (`\n`, `\t`...).                                                                                                                                       |
| `TJ_SPACE_THRESHOLD`              | `src/core/pdf.ts`                                       | `TJ` adjustment from which it counts as a space between words.                                                                                                                               |
| `PDF_TEXT_OPERATORS`              | `src/core/pdf.ts`                                       | PDF text operator → the text it produces.                                                                                                                                                    |
| `ACCESS_TOKEN_MARGIN_MS`          | `connectors/gmail/src/access-token.ts`                  | Margin before expiry at which the Google access token is renewed.                                                                                                                            |
| `MAX_ATTACHMENT_BYTES`            | `connectors/gmail/src/attachments.ts`                   | Largest attachment read as text (5 MB).                                                                                                                                                      |
| `MAX_ATTACHMENT_CHARS`            | `connectors/gmail/src/attachments.ts`                   | Largest text returned from an attachment.                                                                                                                                                    |
| `GMAIL_MODIFY_SCOPE`              | `connectors/gmail/src/config.ts`                        | The `gmail.modify` scope, the only data scope requested (read, send, organize; no permanent deletion).                                                                                       |
| `MIN_CONSENT_SECRET_CHARS`        | `connectors/gmail/src/config.ts`                        | Minimum length of `CONSENT_SECRET`.                                                                                                                                                          |
| `UPSTREAM_USER_AGENT`             | `connectors/gmail/src/context.ts`                       | User-Agent sent to Google and the Gmail API.                                                                                                                                                 |
| `GMAIL_API_BASE`                  | `connectors/gmail/src/gmail-api.ts`                     | Gmail API base for the token's account.                                                                                                                                                      |
| `GMAIL_STATUS_MESSAGES`           | `connectors/gmail/src/gmail-api.ts`                     | Actionable message per Gmail API HTTP status.                                                                                                                                                |
| `GOOGLE_AUTHORIZE_URL`            | `connectors/gmail/src/google-oauth.ts`                  | Google authorization endpoint.                                                                                                                                                               |
| `GOOGLE_TOKEN_URL`                | `connectors/gmail/src/google-oauth.ts`                  | Google token endpoint.                                                                                                                                                                       |
| `GOOGLE_CALLBACK_PATH`            | `connectors/gmail/src/google-oauth.ts`                  | Google callback path (`/google/callback`).                                                                                                                                                   |
| `GOOGLE_JWKS_URL`                 | `connectors/gmail/src/id-token.ts`                      | Public keys that sign Google's `id_token`.                                                                                                                                                   |
| `GOOGLE_ISSUERS`                  | `connectors/gmail/src/id-token.ts`                      | Issuers accepted in the `id_token`.                                                                                                                                                          |
| `CLOCK_SKEW_SECONDS`              | `connectors/gmail/src/id-token.ts`                      | Clock skew tolerated in the `id_token` validity.                                                                                                                                             |
| `LINK_STATE_PREFIX`               | `connectors/gmail/src/link-flow.ts`                     | Prefix of the account-link `state` (`link.`).                                                                                                                                                |
| `LINK_COOKIE`                     | `connectors/gmail/src/link-flow.ts`                     | `__Host-` cookie that binds the link to the browser.                                                                                                                                         |
| `LINK_TTL_SECONDS`                | `connectors/gmail/src/link-flow.ts`                     | Lifetime of the link request (10 minutes).                                                                                                                                                   |
| `LINK_REQUEST_TYP`                | `connectors/gmail/src/link-flow.ts`                     | Seal type of the link request.                                                                                                                                                               |
| `MAX_MESSAGE_CHARS`               | `connectors/gmail/src/message-format.ts`                | Largest message body returned.                                                                                                                                                               |
| `MAX_THREAD_CHARS`                | `connectors/gmail/src/message-format.ts`                | Largest sum of a thread's bodies.                                                                                                                                                            |
| `MIN_MESSAGE_CHARS`               | `connectors/gmail/src/message-format.ts`                | Smallest slice per message in a long thread.                                                                                                                                                 |
| `MESSAGE_HEADERS`                 | `connectors/gmail/src/message-format.ts`                | Headers returned for each message.                                                                                                                                                           |
| `UNTRUSTED_NOTICE`                | `connectors/gmail/src/message-format.ts`                | Notice of untrusted email content (prompt injection).                                                                                                                                        |
| `GOOGLE_ACCOUNTS_ORIGIN`          | `connectors/gmail/src/pages.ts`                         | Google origin allowed in the consent page's `form-action`.                                                                                                                                   |
| `RATE_LIMIT_RETRY_SECONDS`        | `connectors/gmail/src/rate-limit.ts`                    | `Retry-After` seconds in the 429 response.                                                                                                                                                   |
| `GMAIL_ID`                        | `connectors/gmail/src/tools.ts`                         | Zod schema of a Gmail API id (only URL-safe characters).                                                                                                                                     |
| `listAccountsTool`                | `connectors/gmail/src/tools.ts`                         | The `list_accounts` tool.                                                                                                                                                                    |
| `searchThreadsTool`               | `connectors/gmail/src/tools.ts`                         | The `search_threads` tool.                                                                                                                                                                   |
| `getThreadTool`                   | `connectors/gmail/src/tools.ts`                         | The `get_thread` tool.                                                                                                                                                                       |
| `getMessageTool`                  | `connectors/gmail/src/tools.ts`                         | The `get_message` tool.                                                                                                                                                                      |
| `listLabelsTool`                  | `connectors/gmail/src/tools.ts`                         | The `list_labels` tool.                                                                                                                                                                      |
| `getAttachmentTextTool`           | `connectors/gmail/src/tools.ts`                         | The `get_attachment_text` tool.                                                                                                                                                              |
| `GMAIL_TOOLS`                     | `connectors/gmail/src/tool-list.ts`                     | All Gmail tools, in the order shown to Claude.                                                                                                                                               |
| `MAX_QUOTED_CHARS`                | `connectors/gmail/src/compose.ts`                       | Largest excerpt of the original quoted in a reply (20 thousand characters).                                                                                                                  |
| `FORWARD_SEPARATOR`               | `connectors/gmail/src/compose.ts`                       | Line that opens the forwarded email block.                                                                                                                                                   |
| `DRAFT_SHAPE`                     | `connectors/gmail/src/draft-tools.ts`                   | Parameters of a draft's content (create and replace).                                                                                                                                        |
| `listDraftsTool`                  | `connectors/gmail/src/draft-tools.ts`                   | The `list_drafts` tool.                                                                                                                                                                      |
| `createDraftTool`                 | `connectors/gmail/src/draft-tools.ts`                   | The `create_draft` tool.                                                                                                                                                                     |
| `updateDraftTool`                 | `connectors/gmail/src/draft-tools.ts`                   | The `update_draft` tool.                                                                                                                                                                     |
| `sendDraftTool`                   | `connectors/gmail/src/draft-tools.ts`                   | The `send_draft` tool.                                                                                                                                                                       |
| `deleteDraftTool`                 | `connectors/gmail/src/draft-tools.ts`                   | The `delete_draft` tool.                                                                                                                                                                     |
| `MAX_GMAIL_ERROR_DETAIL`          | `connectors/gmail/src/gmail-api.ts`                     | Largest Gmail error detail passed to the model (200 characters).                                                                                                                             |
| `TARGET_SHAPE`                    | `connectors/gmail/src/mailbox-tools.ts`                 | Target parameters of the organizing tools (`message_ids`, `thread_ids`).                                                                                                                     |
| `markReadTool`                    | `connectors/gmail/src/mailbox-tools.ts`                 | The `mark_read` tool.                                                                                                                                                                        |
| `archiveTool`                     | `connectors/gmail/src/mailbox-tools.ts`                 | The `archive` tool.                                                                                                                                                                          |
| `starTool`                        | `connectors/gmail/src/mailbox-tools.ts`                 | The `star` tool.                                                                                                                                                                             |
| `updateLabelsTool`                | `connectors/gmail/src/mailbox-tools.ts`                 | The `update_labels` tool.                                                                                                                                                                    |
| `trashTool`                       | `connectors/gmail/src/mailbox-tools.ts`                 | The `trash` tool.                                                                                                                                                                            |
| `untrashTool`                     | `connectors/gmail/src/mailbox-tools.ts`                 | The `untrash` tool.                                                                                                                                                                          |
| `MAX_TARGET_MESSAGES`             | `connectors/gmail/src/mailbox.ts`                       | Maximum messages per call of the organizing tools (50).                                                                                                                                      |
| `MAX_TARGET_THREADS`              | `connectors/gmail/src/mailbox.ts`                       | Maximum threads per call of the organizing tools (20).                                                                                                                                       |
| `MAILBOX_ACTIONS`                 | `connectors/gmail/src/mailbox.ts`                       | System labels each action adds and removes (read, archive, star).                                                                                                                            |
| `MAX_ENCODED_WORD_BYTES`          | `connectors/gmail/src/mime.ts`                          | Largest UTF-8 chunk of an RFC 2047 word (45 bytes, word ≤ 75).                                                                                                                               |
| `MAX_BODY_CHARS`                  | `connectors/gmail/src/send-tools.ts`                    | Largest email body accepted (100 thousand characters).                                                                                                                                       |
| `RECIPIENTS`                      | `connectors/gmail/src/send-tools.ts`                    | Zod schema of a recipient list.                                                                                                                                                              |
| `BODY`                            | `connectors/gmail/src/send-tools.ts`                    | Zod schema of the plain-text body.                                                                                                                                                           |
| `SUBJECT`                         | `connectors/gmail/src/send-tools.ts`                    | Zod schema of the subject (up to 998 characters).                                                                                                                                            |
| `sendEmailTool`                   | `connectors/gmail/src/send-tools.ts`                    | The `send_email` tool.                                                                                                                                                                       |
| `replyEmailTool`                  | `connectors/gmail/src/send-tools.ts`                    | The `reply_email` tool.                                                                                                                                                                      |
| `replyAllEmailTool`               | `connectors/gmail/src/send-tools.ts`                    | The `reply_all_email` tool.                                                                                                                                                                  |
| `forwardEmailTool`                | `connectors/gmail/src/send-tools.ts`                    | The `forward_email` tool.                                                                                                                                                                    |
| `MAX_RECIPIENTS`                  | `connectors/gmail/src/send.ts`                          | Maximum recipients (To + Cc + Bcc) in an email (100).                                                                                                                                        |
| `MAX_FORWARD_BYTES`               | `connectors/gmail/src/send.ts`                          | Largest sum of attachments in a forward (18 MB).                                                                                                                                             |
| `ONE_ACCOUNT`                     | `connectors/gmail/src/tools.ts`                         | Zod schema of the single-account `account` parameter.                                                                                                                                        |
| `CONFIRM_HINT`                    | `connectors/gmail/src/tools.ts`                         | Sentence of the write tools: confirm with the user and never act on an email's request.                                                                                                      |
| `GMAIL_SERVER_INFO`               | `connectors/gmail/src/worker.ts`                        | MCP server name and version; the version comes from `plugin/.claude-plugin/plugin.json`.                                                                                                     |
| `GMAIL_SERVER_INSTRUCTIONS`       | `connectors/gmail/src/worker.ts`                        | MCP server instructions (accounts and untrusted content).                                                                                                                                    |
| `ACCESS_TOKEN_TTL_SECONDS`        | `connectors/gmail/src/worker.ts`                        | Lifetime of the access token issued to Claude (1 hour).                                                                                                                                      |
| `REFRESH_TOKEN_TTL_SECONDS`       | `connectors/gmail/src/worker.ts`                        | Lifetime of the refresh token issued to Claude (30 days).                                                                                                                                    |
| `GMAIL_ROUTES`                    | `connectors/gmail/src/worker.ts`                        | The Worker's own routes: `MÉTODO caminho` → handler.                                                                                                                                         |
| `BRIDGE_ERROR_MESSAGES`           | `connectors/whatsapp/src/bridge-client.ts`              | User-facing messages (English) for the bridge's known error codes.                                                                                                                           |
| `WHATSAPP_DEFAULTS`               | `connectors/whatsapp/src/config.ts`                     | Connector defaults: sleep after 5 min, 25 s per tool, 8 s waiting for sync, 10 sends per hour.                                                                                               |
| `BRIDGE_ENV_KEYS`                 | `connectors/whatsapp/src/config.ts`                     | Variables passed from the Worker to the bridge container (`bridge/API.md`).                                                                                                                  |
| `SNAPSHOT_PUSH_URL`               | `connectors/whatsapp/src/config.ts`                     | Internal address, intercepted by the Worker, to which the bridge sends the snapshot on `SIGTERM`.                                                                                            |
| `UNTRUSTED_NOTICE`                | `connectors/whatsapp/src/format.ts`                     | Notice of untrusted third-party data that accompanies every result with messages or contacts.                                                                                                |
| `HIDDEN_CHAR_RANGES`              | `connectors/whatsapp/src/format.ts`                     | Ranges of invisible characters (control, zero-width, bidi, BOM) removed by `sanitizeText`.                                                                                                   |
| `SNAPSHOT_INTERVAL_MS`            | `connectors/whatsapp/src/lifecycle.ts`                  | Minimum interval between usage-triggered snapshots (1 minute).                                                                                                                               |
| `SNAPSHOT_AFTER_PATHS`            | `connectors/whatsapp/src/lifecycle.ts`                  | Bridge routes after which the database may have changed and a snapshot is worth trying.                                                                                                      |
| `SEND_HISTORY_KEY`                | `connectors/whatsapp/src/lifecycle.ts`                  | Key, in the Durable Object storage, of the recent send timestamps (hourly limit).                                                                                                            |
| `PAIR_PAGE_CSS`                   | `connectors/whatsapp/src/pair-page.ts`                  | Style additions of the `/pair` page (large code, QR, secondary and danger buttons).                                                                                                          |
| `PAIR_SESSION_COOKIE`             | `connectors/whatsapp/src/pair.ts`                       | Name of the `__Host-` cookie of the sealed `/pair` session.                                                                                                                                  |
| `PAIR_NONCE_COOKIE`               | `connectors/whatsapp/src/pair.ts`                       | Name of the `__Host-` cookie of the nonce that binds the `/pair` login to the browser.                                                                                                       |
| `PAIR_SESSION_TTL_SECONDS`        | `connectors/whatsapp/src/pair.ts`                       | Lifetime of the `/pair` session and the anti-CSRF token (30 minutes).                                                                                                                        |
| `PAIR_LOGIN_TTL_SECONDS`          | `connectors/whatsapp/src/pair.ts`                       | Lifetime of the in-progress `/pair` login (10 minutes).                                                                                                                                      |
| `PAIR_CALLBACK_PATH`              | `connectors/whatsapp/src/pair.ts`                       | GitHub callback path for `/pair` (a subpath of the OAuth App callback).                                                                                                                      |
| `PAIR_ACTIONS`                    | `connectors/whatsapp/src/pair.ts`                       | `/pair` actions by path: code, QR, unlink and start over from scratch.                                                                                                                       |
| `SNAPSHOT_KEY_NAME`               | `connectors/whatsapp/src/snapshots.ts`                  | Key of the current snapshot in the R2 bucket (`whatsapp/snapshot.was1`).                                                                                                                     |
| `WHATSAPP_INSTRUCTIONS`           | `connectors/whatsapp/src/tools.ts`                      | MCP server instructions: what the connector is and the rule about untrusted content.                                                                                                         |
| `WHATSAPP_SERVER_INFO`            | `connectors/whatsapp/src/tools.ts`                      | MCP server name and version; the version comes from `plugin/.claude-plugin/plugin.json`.                                                                                                     |
| `READ_TOOLS`                      | `connectors/whatsapp/src/tools.ts`                      | Read tools (phase 1), always active.                                                                                                                                                         |
| `BRIDGE_INSTANCE_NAME`            | `connectors/whatsapp/src/worker-env.ts`                 | Fixed name of the bridge's single Durable Object instance (single instance = single session).                                                                                                |
| `WHATSAPP_WORKER_HANDLERS`        | `connectors/whatsapp/src/worker.ts`                     | Worker handlers (`fetch` and `scheduled`), exported by `index.ts` with the Durable Object.                                                                                                   |
| `GITHUB_USER_AGENT`               | `src/remote/github-login.ts`                            | User-Agent of the calls to GitHub (the API refuses requests without it).                                                                                                                     |
| `READ_ONLY_HINTS`                 | `src/mcp/annotations.ts`                                | Hints of a read-only tool (`readOnlyHint: true`, idempotent, open world).                                                                                                                    |
| `SEND_HINTS`                      | `src/mcp/annotations.ts`                                | Hints of a tool that sends or publishes (email, message, submission): destructive, not idempotent.                                                                                           |
| `DESTRUCTIVE_HINTS`               | `src/mcp/annotations.ts`                                | Hints of a tool that deletes or overwrites (trash, draft, account link): destructive, idempotent.                                                                                            |
| `ORGANIZE_HINTS`                  | `src/mcp/annotations.ts`                                | Hints of a reversible organizing tool (read, archive, star, labels, restore): writes, not destructive.                                                                                       |
| `CREATE_HINTS`                    | `src/mcp/annotations.ts`                                | Hints of a tool that creates something without deleting (draft, link): writes, not destructive.                                                                                              |
| `FALLBACK_SERVER_VERSION`         | `src/mcp/server-version.ts`                             | Version announced when the plugin manifest has none (`0.0.0`).                                                                                                                               |
| `UPSTREAM_CALLBACK_PATH`          | `src/remote/handler.ts`                                 | Callback path of the delegated login (`/oauth/callback`), registered with the provider.                                                                                                      |
| `BRIDGE_RETRY_MS`                 | `connectors/whatsapp/src/bridge-client.ts`              | Wait between attempts while the bridge wakes up (750 ms).                                                                                                                                    |
| `GMAIL_SCOPES`                    | `connectors/gmail/src/config.ts`                        | Login and link scopes (`openid email` + Gmail read-only).                                                                                                                                    |
| `GOOGLE_REVOKE_URL`               | `connectors/gmail/src/google-oauth.ts`                  | Google token revocation endpoint.                                                                                                                                                            |
| `LINK_TICKET_TYP`                 | `connectors/gmail/src/link-flow.ts`                     | Seal type of the link ticket issued by `link_account`.                                                                                                                                       |
| `OWNER_RECORD_TYP`                | `connectors/gmail/src/token-store.ts`                   | Seal type of a user's accounts record.                                                                                                                                                       |
| `OWNER_RECORD_EXP`                | `connectors/gmail/src/token-store.ts`                   | Technical expiry of the record's seal (year 2100).                                                                                                                                           |
| `MAX_LINKED_ACCOUNTS`             | `connectors/gmail/src/token-store.ts`                   | Maximum Gmail accounts a user can link (10).                                                                                                                                                 |
| `linkAccountTool`                 | `connectors/gmail/src/tools.ts`                         | The `link_account` tool.                                                                                                                                                                     |
| `unlinkAccountTool`               | `connectors/gmail/src/tools.ts`                         | The `unlink_account` tool.                                                                                                                                                                   |
| `SECRET_PATTERNS`                 | `src/core/redact.ts`                                    | Secret patterns removed by `redactSecrets` (Bearer, Canvas, Google, JWT, OAuth fields, long seals) and their masks.                                                                          |
| `EMAIL_PATTERN`                   | `src/core/redact.ts`                                    | Email address pattern masked in logs by `redactForLog`.                                                                                                                                      |
| `BROWSER_PAGE_PATHS`              | `src/remote/handler.ts`                                 | Browser pages of the remote server (`/authorize`, `/oauth/callback`): no CORS headers.                                                                                                       |
| `LEGACY_AUDLESS_UNTIL`            | `src/remote/seal.ts`                                    | Cutoff (2027-01-01 UTC) until which a seal issued before `aud` existed still opens; every older access/refresh token expires before it.                                                      |
| `CANVAS_WRITE_GRANT`              | `connectors/canvas-puc/src/remote.ts`                   | Permission (`write`) a Canvas user opts into at login so the send, reply and submit tools run (also possible later on `/write-access`).                                                      |
| `CANVAS_WRITE_OPTION_LABEL`       | `connectors/canvas-puc/src/remote.ts`                   | Label of the unticked write opt-in checkbox on the Canvas login page.                                                                                                                        |
| `LINK_CONFIRM_TYP`                | `connectors/gmail/src/link-flow.ts`                     | Seal type of the Gmail link confirmation form (ticket `jti` + browser cookie hash).                                                                                                          |
| `OWNER_CHECK_SCOPES`              | `connectors/gmail/src/link-flow.ts`                     | Scopes of the Gmail link owner check (`openid email`, no Gmail access).                                                                                                                      |
| `TOOL_CONTRACT_FILE`              | `tools/smoke/smoke.ts`                                  | Contract file of each connector, relative to its folder (`tool-contract.json`).                                                                                                              |
| `WHATSAPP_IMAGE_INPUTS`           | `tools/pr-check/whatsapp-image.ts`                      | Files and folders whose change makes `pr:check` build the WhatsApp container image: `Dockerfile`, `.dockerignore`, `NOTICE.md`, `wrangler.toml`, `bridge/` and `scripts/docker-proxy-ca.sh`. |
| `SMOKE_ATTEMPTS`                  | `tools/smoke/smoke.ts`                                  | Attempts of the post-deploy smoke test (4): a fresh deploy can take seconds to reach every location.                                                                                         |
| `SMOKE_RETRY_MS`                  | `tools/smoke/smoke.ts`                                  | Pause between smoke attempts (5000 ms).                                                                                                                                                      |
| `UNAVAILABLE_TOOL_NOTE`           | `src/mcp/tool-gate.ts`                                  | Marker (`UNAVAILABLE on this connection:`) appended to the description of a listed but switched-off tool.                                                                                    |
| `TOOL_CATALOG_PATH`               | `src/remote/mcp-endpoint.ts`                            | Path of the public tool catalog (`/tools`): the `tools/list` answer, no user data.                                                                                                           |
| `MAX_MESSAGE_ATTACHMENTS`         | `connectors/canvas-puc/src/message-attachments.ts`      | Most files one inbox message may carry (5).                                                                                                                                                  |
| `CONVERSATION_ATTACHMENTS_FOLDER` | `connectors/canvas-puc/src/message-attachments.ts`      | Canvas folder of the user's inbox attachments (`conversation attachments`, the API's `parent_folder_path`).                                                                                  |
| `MAX_DIRECT_UPLOAD_MB`            | `connectors/canvas-puc/src/attachment-refs.ts`          | Largest file `prepare_attachment_upload` accepts, in MB (25).                                                                                                                                |
| `MAX_DIRECT_UPLOAD_BYTES`         | `connectors/canvas-puc/src/attachment-refs.ts`          | `MAX_DIRECT_UPLOAD_MB` in bytes.                                                                                                                                                             |
| `LOCAL_PATH_PLACEHOLDER`          | `connectors/canvas-puc/src/attachment-refs.ts`          | Placeholder (`<LOCAL_FILE_PATH>`) the local file path replaces in the returned `curl`.                                                                                                       |
| `CONVERSATION_FOLDER_PATH`        | `connectors/canvas-puc/src/attachment-refs.ts`          | API path that resolves the user's `conversation attachments` folder.                                                                                                                         |
| `DIRECT_UPLOAD_NEXT_STEPS`        | `connectors/canvas-puc/src/attachment-refs.ts`          | Steps returned with the `curl`: run it where the file is, then pass the printed `id` in `file_ids`.                                                                                          |
| `USER_FILES_PATH`                 | `connectors/canvas-puc/src/message-attachments.ts`      | Step-1 upload endpoint of a file in the user's own files (`/users/self/files`).                                                                                                              |
| `ATTACHMENTS_LIMIT_TEXT`          | `connectors/canvas-puc/src/message-attachments.ts`      | Text of the attachments limit (`up to 5 files of at most 5 MB each`), for the tool descriptions.                                                                                             |
| `CANVAS_WRITE_OFF_REASON`         | `connectors/canvas-puc/src/remote.ts`                   | Why the write tools refuse when the operator turned writing off (`CANVAS_ALLOW_WRITE`).                                                                                                      |
| `FILE_FIELDS`                     | `connectors/canvas-puc/src/tools-write.ts`              | Zod fields of a file inside a tool call (`file_name`, `content`, `encoding`, `content_type`), shared by submissions and message attachments.                                                 |
| `WRITE_ACCESS_PATH`               | `connectors/canvas-puc/src/write-access.ts`             | Path of the page that turns Canvas writing on or off for a connection (`/write-access`).                                                                                                     |
| `WRITE_TICKET_TYP`                | `connectors/canvas-puc/src/write-access.ts`             | Seal type of the write-access link ticket (`canvas-write-access`).                                                                                                                           |
| `WRITE_TICKET_TTL_SECONDS`        | `connectors/canvas-puc/src/write-access.ts`             | Lifetime of the write-access link (15 minutes).                                                                                                                                              |
| `WHATSAPP_SEND_OFF_REASON`        | `connectors/whatsapp/src/tools.ts`                      | Why `send_message` refuses when the server runs without `ENABLE_SEND`.                                                                                                                       |
| `PLAN_SKILL_DIR`                  | `tools/bundle/bundle.ts`                                | Folder of the `/planejamento-faculdade` skill inside a connector (`plugin/skills/planejamento-faculdade`).                                                                                   |
| `PLAN_SOURCES`                    | `tools/bundle/bundle.ts`                                | Sources (plan CLI entry, page runtime entry, template) and generated outputs (`scripts/plan.mjs`, `assets/plan-template.html`) of the plan skill.                                            |
| `PLAN_RUNTIME_SLOT`               | `tools/bundle/bundle.ts`                                | Placeholder in the template source where the bundled page runtime is inlined (`<!--plan-runtime-->`).                                                                                        |
| `GENERATED_NOTE`                  | `tools/bundle/bundle.ts`                                | Banner of the generated plan skill files ("do not edit by hand").                                                                                                                            |
| `PLAN_COMMANDS`                   | `connectors/canvas-puc/src/plan/plan-cli-core.ts`       | Commands of the plan script: `validate`, `build`, `extract`, `summary`.                                                                                                                      |
| `PLAN_USAGE`                      | `connectors/canvas-puc/src/plan/plan-cli-core.ts`       | Usage text of the plan script.                                                                                                                                                               |
| `PLAN_DATA_PATTERN`               | `connectors/canvas-puc/src/plan/plan-embed.ts`          | The `<script id="plan-data" type="application/json">` block of the page.                                                                                                                     |
| `TITLE_PATTERN`                   | `connectors/canvas-puc/src/plan/plan-embed.ts`          | The page `<title>` element.                                                                                                                                                                  |
| `BAR_SEGMENT_KINDS`               | `connectors/canvas-puc/src/plan/plan-points.ts`         | Stacked bar segments in drawing order: `sure`, `pend`, `open`, `lost`.                                                                                                                       |
| `RISK_THRESHOLDS`                 | `connectors/canvas-puc/src/plan/plan-points.ts`         | Share of the open points that may be missing: Tranquila ≤ 0.3, Atenção ≤ 0.6.                                                                                                                |
| `RISK_LEVELS`                     | `connectors/canvas-puc/src/plan/plan-schema.ts`         | Course risk levels: `high`, `warn`, `ok`.                                                                                                                                                    |
| `ITEM_STATUSES`                   | `connectors/canvas-puc/src/plan/plan-schema.ts`         | Checklist item statuses: `open`, `done`, `dropped`.                                                                                                                                          |
| `QUESTION_STATUSES`               | `connectors/canvas-puc/src/plan/plan-schema.ts`         | Question statuses: `open`, `sent`.                                                                                                                                                           |
| `ASSUMPTION_KINDS`                | `connectors/canvas-puc/src/plan/plan-schema.ts`         | Assumption kinds of the header box: `informed`, `estimate`, `change`.                                                                                                                        |
| `DEFAULT_GOAL`                    | `connectors/canvas-puc/src/plan/plan-schema.ts`         | PUC Minas approval goal when the syllabus says nothing else (60).                                                                                                                            |
| `PLAN_SCHEMA_VERSION`             | `connectors/canvas-puc/src/plan/plan-schema.ts`         | Current version of the plan JSON (1).                                                                                                                                                        |
| `planSchema`                      | `connectors/canvas-puc/src/plan/plan-schema.ts`         | Zod schema of the whole plan JSON (strict: unknown fields are rejected).                                                                                                                     |
| `PLAN_ID_PATTERN`                 | `connectors/canvas-puc/src/plan/plan-validate.ts`       | Format of checklist and question ids.                                                                                                                                                        |
| `POINTS_TOLERANCE`                | `connectors/canvas-puc/src/plan/plan-validate.ts`       | Tolerance when checking that a course adds up to 100 points (0.05).                                                                                                                          |
| `SYNC_MESSAGES`                   | `connectors/canvas-puc/src/plan/page/checks.ts`         | pt-BR status line of each checklist sync state (loading, account, local, error).                                                                                                             |
| `ACCOUNT_TIMEOUT_MS`              | `connectors/canvas-puc/src/plan/page/checks.ts`         | Wait for the viewer account before saying the ticks are local only (10 s).                                                                                                                   |
| `PLAN_TIME_ZONE`                  | `connectors/canvas-puc/src/plan/page/format.ts`         | Time zone of every date the plan shows (`America/Sao_Paulo`).                                                                                                                                |
| `WEEKDAYS_PT`                     | `connectors/canvas-puc/src/plan/page/format.ts`         | Short pt-BR weekday names, Sunday first.                                                                                                                                                     |
| `SEGMENT_LABELS`                  | `connectors/canvas-puc/src/plan/page/render-courses.ts` | pt-BR names of the bar segments for the accessible description.                                                                                                                              |
| `LEVEL_LABELS`                    | `connectors/canvas-puc/src/plan/page/render-header.ts`  | pt-BR label of each risk level (Risco alto, Atenção, Tranquila).                                                                                                                             |
| `ASSUMPTION_LABELS`               | `connectors/canvas-puc/src/plan/page/render-header.ts`  | pt-BR heading of each assumption kind, in display order.                                                                                                                                     |
