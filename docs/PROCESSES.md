# Processes

System flows, from trigger to result. Each step cites the functions involved as `` `nome()` ``;
`docs:check` uses these citations (plus everything they call) to fill in the **Processes** field
of each function in [FUNCTIONS.md](FUNCTIONS.md). Citing a function that does not exist in the code is an error.

Process template: see [DOCUMENTATION.md](DOCUMENTATION.md#process).

## P01 — Check the documentation (`npm run docs:check`)

- **Trigger:** `npm run docs:check`, `npm run check`, the `pre-commit` hook and `pr:check`.
- **Steps:**
  1. `runDocsCli()` reads the command (`check` by default) and calls `runCheck()`.
  2. `runCheck()` loads the configuration with `loadDocsConfig()`, builds the inventory with `buildInventory()`
     (code parsed via AST, versioned folders, tests, UI components and test exceptions) and reads the
     documents with `readDocsTexts()`.
  3. The PROCESSES.md citations are extracted with `extractProcessCitations()`.
  4. `runAllChecks()` runs each pure check and collects the issues.
  5. `formatIssues()` prints the result; the process exits with code 1 if there is any issue.
- **Result:** numbered list of issues with a code (`FUNCTION_UNDOCUMENTED`, `DIR_UNDOCUMENTED`...) and the
  expected fix, or `✔` when everything is up to date.
- **Failures:** an invalid `docs.config.json` or a malformed `TEST_EXCEPTIONS` aborts the run with an error.

## P02 — Generate the documentation blocks (`npm run docs:generate`)

- **Trigger:** `npm run docs:generate`, usually right after creating or changing functions.
- **Steps:**
  1. `runDocsCli()` receives `generate` and calls `runGenerate()`.
  2. `runGenerate()` builds the inventory and reads the documents as in P01, and calls `generateFunctionsDoc()`.
  3. `generateFunctionsDoc()` computes "Processes" per function with `processesByFunction()` and applies
     `applyGenerated()`: updates the per-module index, replaces the existing generated blocks and appends
     new sections with the manual fields marked as `_fill_in_`.
  4. The file is rewritten only if something changed.
- **Result:** `docs/FUNCTIONS.md` with up-to-date generated blocks; the new manual fields are left for the person
  (or Claude) to fill in — P01 enforces this.
- **Failures:** the same as P01.

## P03 — Answer a Canvas tool (Claude call)

- **Trigger:** Claude calls a tool of the `canvas-puc` connector (e.g. `upcoming_assignments`).
- **Steps:**
  1. On each request to `/mcp` (P09), `canvasRemoteConnector()` creates the client with `createCanvasClient()` and the
     user's token, picks the tools with `canvasTools()` and registers them with `registerToolSpecs()` inside
     `createCanvasMcpServer()`, which announces the version from `plugin.json` (`manifestVersion()`). Each tool carries
     a `title` and hints from `toolAnnotations()`: read tools are `readOnlyHint`, write tools `destructiveHint`.
  2. The call goes through `runToolSafely()`; the `ToolSpec` created by `defineTool()` validates the arguments.
  3. The tool uses the client: `requestCanvas()` sends the request with `sendCanvasRequest()`
     (`buildUrl()` + `Authorization: Bearer`, cut at `CANVAS_TIMEOUT_MS`; `networkFailure()` turns a timeout into a
     504, also while reading the body with `readCanvasJson()` / `requestCanvasJson()`); listings follow the pages with `collectPages()` and `parseNextLink()`. The client's `query` posts
     read-only GraphQL with `queryCanvasGraphql()` (`isReadOnlyGraphql()` refuses mutations before any call;
     `graphqlData()` turns GraphQL errors into exceptions). Helpers such as `activeCourses()`,
     `fetchOwnSubmission()` and `getAllOrEmpty()` compose lookups.
     `upcoming_assignments` asks the planner for `plannerWindow()`: from 00:00 of today in São Paulo
     (`startOfDayIn()` over `zoneOffsetMinutes()` and `parseOffsetLabel()`), so items due earlier today stay in; every planner type is kept
     and `plannerItemType()` names `assessment_request` `peer_review`, with `reviewStatus()`.
     `list_peer_reviews` runs `listPeerReviews()` (ids validated by `canvasIdSchema`): one assignment with
     `assignmentPeerReviews()`, one course with `listCoursePeerReviews()` or every active course with
     `sweepPeerReviews()`, at most `PEER_REVIEW_CONCURRENCY` calls at once (`mapWithLimit()`, `drainQueue()`). A course lists its assignments with `peerReviewAssignmentIds()` (paginated) and reads
     each peer-review assignment with `fetchPeerReviewAssignment()` (GraphQL `assessmentRequestsForCurrentUser`,
     the only route that lists a student's reviews to do). `peerReviewsOf()` → `toPeerReview()`
     (`peerReviewAssignmentFields()`, `orNull()`, `revieweeName()`, `peerSubmissionView()`, `reviewPageUrl()` with
     `assignmentPageUrl()` and `reviewedSubmissionPath()`) builds each view and `sortPeerReviews()` (`reviewRank()`,
     `reviewDueTime()`) puts pending first. A 401/403/404 becomes a clear message with `explainPeerReviewError()`
     (`peerReviewDenial()`); while sweeping, a refused course goes to `unavailable`.
  4. Responses become lean objects with English keys (`toCourse()`, `toPlannerItem()`, `toAssignmentDetail()`
     etc.), with HTML converted by `htmlToText()`. Content HTML (assignments, pages, forums with
     `flattenDiscussion()`, announcements with `toAnnouncement()`) goes through `canvasHtml()` (ADR 0025):
     `parseHtmlContent()` tokenizes it with htmlparser2 (`openHtmlTag()`, `closeHtmlTag()`, `openHtmlAnchor()`,
     `closeHtmlAnchor()`, `addHtmlMedia()`, `addHtmlRef()`, `markHtmlRef()`, `keptHtmlAttrs()`, `safeHttpUrl()`,
     `tidyHtmlText()`) into text with `title [link N]` marks, and `classifyCanvasRef()` types each reference
     (`isCanvasUrl()`, `canvasRefTarget()`, `canvasTargetOf()`, `videoProviderOf()`, `hostMatches()`). The views add
     `links` (`linksField()` for posts) and, with `raw_html`, the original HTML (`rawHtmlField()`).
     `list_linked_files` runs `listLinkedFiles()`: `fetchLinkSources()` (`linkSource()`) and the modules feed
     `originLinks()` (`moduleItemLinks()`), and `collectLinkedFiles()` (`isLinkedFileLink()`, `linkedFileKey()`,
     `toLinkedFile()`) keeps one entry per file or video. `list_files` adds `LIST_FILES_HINT`, or with
     `include_linked` calls `listFilesWithLinked()` (`linkedOnlyRows()`, `linkedOnlyNote()`).
  5. Files: both file tools first find the file with `resolveCanvasFile()`: `fileRefFromArgs()` (`fileRefFromUrl()`)
     reads `file_id`/`url`/`course_id`, and `fileLookupPlan()` tries the course, global and verifier endpoints; when
     all fail, `fileAccessError()` (`fileAccessReason()`, `canvasErrorStatus()`) lists each one. `read_file_text`
     uses `readCanvasFileText()`, which downloads text with `fetchPlainText()` or, for
     Word (`wordKind()`), the bytes with `fetchFileBytes()` and extracts the text with `wordToText()` (`docxToText()`
     over `readZipEntry()`; `docToText()` over `openCfb()`/`readCfbStream()` and `parsePieceTable()`).
     `download_file` uses `downloadCanvasFile()`: `planCanvasDownload()` applies `downloadRefusal()` (no link or above
     `MAX_DOWNLOAD_BYTES`, 70 MB, message from `tooLargeMessage()`) and `planDownloadChunk()`, which returns the whole
     file up to `MAX_CHUNK_BYTES` (8 MB) or one part from `offset` (ADR 0024). `openCanvasChunk()` asks for the part with
     `rangeHeaders()` and, unless `isRangeAnswer()`, cuts it out of the full stream with `byteRangeStream()`;
     `chunkToolResult()` embeds it (`chunkMimeType()`, `chunkUri()`, `binaryContentBlock()`, `base64ContentBlock()`)
     with `chunkDescription()`, which gives the next offset, and marks it with `rawToolResult()`. Claude calls again
     with each offset and joins the parts. In remote mode this path only answers what P09 step 2 does not stream.
  6. Inbox: `find_recipients` maps `GET /search/recipients` with `toRecipient()`; `list_conversations` and
     `get_conversation` (read without marking as read) use `toConversationSummary()` and `toConversationDetail()`
     (`conversationNames()`, `participantName()`, `toConversationMessage()`). With writing on, `send_message`
     accepts only numeric user IDs (at most `MAX_MESSAGE_RECIPIENTS`) and calls `sendInboxMessage()`;
     `reply_message` calls `replyInboxMessage()`. Both run `collectMessageAttachments()`:
     `attachmentCountRefusal()` (inline plus `file_ids`, at most `MAX_MESSAGE_ATTACHMENTS`), then
     `prepareAttachments()` (`uploadedFileFromArgs()`, `attachmentsRefusal()`: files of `MAX_UPLOAD_BYTES`), then
     `resolveFileAttachments()` for `file_ids` (ADR 0028: `conversationFolderId()`, `fetchAttachmentFile()` for
     every id first, then `copyToConversationFolder()` when `needsConversationCopy()`), so a refusal comes before
     any upload or copy; then `uploadMessageAttachments()` sends each file through `uploadMessageAttachment()` →
     `uploadCanvasFile()` (`POST /users/self/files` with `parent_folder_path` = `CONVERSATION_ATTACHMENTS_FOLDER`,
     then the client's `upload`); a failed upload throws `attachmentUploadError()` and nothing is sent. The body
     carries `attachmentIds()` via `newMessagePayload()` / `replyPayload()` (`attachmentIdsField()`), and the
     answer (`sentConversation()` / `sentReply()`) adds `attachmentSummary()`. Message bodies and file contents
     are never logged. For a local binary, `prepare_attachment_upload` calls `prepareAttachmentUpload()`: step 1 of
     the upload into the same folder, and `curlUploadCommand()` (`shellQuote()`) returns the `curl` that Claude
     runs where the file is; Canvas answers it with the file JSON, whose `id` goes in `file_ids`.
     6b. Writing off (ADR 0027): `createCanvasUserServer()` asks `canvasWriteBlock()` — `CANVAS_WRITE_OFF_REASON` when
     the server flag is off; null when `userAllowsWrite()` (sign-in `write` grant, or `hasStoredWriteOptIn()` in
     `CANVAS_KV`); otherwise `readOnlyConnectionReason()` with `writeAccessUrl()`. `canvasTools()` passes the
     reason to `gateToolSpecs()`: the write tools stay listed and `disabledToolSpec()` answers each call with
     `unavailableToolMessage()`. The user opens the link: `showWriteAccess()` opens the ticket
     (`openWriteTicket()`) and renders `renderWriteAccessPage()`; `submitWriteAccess()` stores or deletes
     `writeAccessKey()` of the `tokenFingerprint()`; a bad ticket gets `expiredWriteAccessPage()`.
  7. File submission (ADR 0026, writes only): `submit_file_assignment` builds the file with `uploadedFileFromArgs()`
     (`decodeUploadContent()`, `uploadContentType()` over `fileExtension()`) and calls `submitFileAssignment()`. It
     reads the assignment and `uploadRefusal()` refuses, before any upload, an assignment without `online_upload`,
     an extension outside `allowed_extensions` (`extensionRefusal()`) or an empty file or one above
     `MAX_UPLOAD_BYTES` (`uploadSizeRefusal()`). Then it asks for an upload slot
     (`POST .../submissions/self/files`), sends the file with the client's `upload`: `postUploadForm()` posts
     `uploadForm()` to the signed URL without the token or redirects, and `confirmUpload()` reads the file or
     confirms a 3xx at its `Location` with the token. Last, it posts `onlineUploadPayload()` to `.../submissions`.
  8. Change detection: `list_assignments`, `list_announcements`, `list_discussions` and `list_conversations` take
     `changed_since` (`changedSinceArg`). `keepChanged()` drops the items whose latest date (`latestStamp()` over
     `assignmentStamps()`, `announcementStamps()`, `topicStamps()` or `conversationStamps()`) is before it, and
     `withCheckedAt()` appends `checkedAtNote()` with the time taken before reading Canvas: the cursor for the next
     call. Stateless: nothing about the user is stored server side.
  9. `toToolResult()` returns compact JSON (via `textResult()`) or the ready-made result to Claude; any error becomes
     `errorResult()` with the message.
- **Result:** Claude receives only the useful fields, with absolute links and clean text.
- **Failures:** a 401 that refuses the token becomes `unauthorizedMessage()` (generate another token and reconnect);
  a 401 whose body denies only the resource (`isPermissionDenial()`) and any other non-2xx status become a
  `canvasApiError()` with status and body; invalid arguments are rejected by zod. Download errors hide verifiers
  (`redactVerifier()`).

## P04 — (removed) Browser login

The local mode, with a browser session, was removed from the project ([ADR 0013](adr/0013-remote-only-connector-via-marketplace.md)).
Authentication is now only the OAuth of P08. The number stays reserved so the other processes are not renumbered.

## P05 — Connector build (`npm run build`)

- **Trigger:** `npm run build` or `pr:check`.
- **Steps:**
  1. `runBuildCli()` finds the connectors with `listConnectors()` (folders with `plugin/.claude-plugin/plugin.json`).
  2. `buildConnector()` reads the plugin's `.mcp.json`, if any (the self-hosted WhatsApp has none), and fails if
     `pluginMcpProblems()` (with `mcpServerProblems()` and `isRemoteMcpUrl()`) finds a server that is not `http` with
     a fixed `https://` URL (no `${user_config.*}`), or one with a local `command`.
  3. If there is a `src/remote-main.ts`, bundles the remote server with esbuild (`bundleOptions()`) into
     `connectors/<nome>/server/remote.js`, used by the Dockerfile (P08). The Worker compiles straight from `src/`.
  4. If `hasPlanSkill()` (canvas-puc), `buildPlanSkill()` bundles the plan script (`planCliBundleOptions()`) into
     `plugin/skills/planejamento-faculdade/scripts/plan.mjs` and writes the page template from `buildPlanTemplate()`
     (`planRuntimeBundleOptions()` + `inlinePlanRuntime()`) into `assets/plan-template.html` (P20).
- **Result:** plugin checked and remote bundle (and plan skill files) updated in the connector folder.
- **Failures:** a `.mcp.json` with a local server or an insecure URL, or a compile error, aborts with the list of
  problems.

## P06 — Local PR gate (`npm run pr:check`)

- **Trigger:** once per PR, after the last commit; reused for the merge (there is no CI, ADR 0006).
- **Steps:**
  1. `scripts/pr-check.sh` requires the PR title and runs `npm run check` (includes P01 via `runDocsCli()`).
  2. Runs `npm run bridge:test` and `npm run whatsapp:build` (WhatsApp Worker bundle, no Docker). Then
     `tools/pr-check/cli.ts` (`runPrCheckCli()`) lists the changed files since the merge-base with `origin/main`
     (`listChangedFiles()`, `runGit()`, `splitGitLines()`) and `whatsAppImageDecision()` (`touchesWhatsAppImage()`) checks them
     against `WHATSAPP_IMAGE_INPUTS`: on `build` it runs `npm run whatsapp:image` (fails with how to start Docker when
     `docker info` fails), on `skip` it prints why it skipped; any other answer stops `pr:check`.
  3. Runs P05 (`npm run build`) and fails if the connectors' versioned bundle changes without a commit.
  4. Runs `npm run plugin:validate` (`scripts/plugin-validate.sh`): `claude plugin validate --strict` on the
     marketplace and on each `connectors/<name>/plugin`; any warning fails (needs the Claude Code CLI, ADR 0022).
  5. Runs commitlint on the branch commits since `origin/main` and on the PR title.
- **Result:** `✔ pr:check green`, the condition for Claude to squash merge.
- **Failures:** any failing step stops the script with a non-zero exit code.

## P07 — Install a connector from the marketplace (Claude, Cowork and Claude Code)

- **Trigger:** in Claude, "Add marketplace" with `temponi-bernardo/claude-connectors` and install the plugin.
- **Steps:**
  1. Claude reads `.claude-plugin/marketplace.json` and copies `connectors/<nome>/plugin/` (ADR 0020), which only has `plugin.json`, skills and the
     `.mcp.json` (P05 ensures it points to a remote server). WhatsApp has no `.mcp.json`: the plugin
     ships only the skills and the person connects their own server as a custom connector (P13–P17, ADR 0018).
  2. The `.mcp.json` registers the Worker's `http` server (`https://canvas-puc-remote.bftemponi.workers.dev/mcp`).
     Nothing is installed or runs on the computer.
  3. On the first call, the server answers 401 and Claude opens the OAuth of P08 (Gmail: P10); from then on, P09
     (Gmail: P12).
- **Result:** the tools show up as `mcp__plugin_<nome>_<servidor>__<ferramenta>`.
- **Failures:** without access to the repository, "Add marketplace" fails; Worker down → the connector shows up
  as a connection failure.

## P08 — Connect the remote Canvas (OAuth on claude.ai)

- **Trigger:** the first call of the installed plugin (P07), or on claude.ai: Settings → Connectors →
  Add custom connector with `https://<servidor>/mcp` (ADR 0009); or an expired token that forces a
  reconnect.
- **Steps:**
  1. On startup, `startCanvasRemoteServer()` reads `readRemoteServerConfig()` (`readPublicUrl()`, `parseSealKey()`) and
     `readCanvasRemoteSettings()`, builds `canvasRemoteConnector()` and starts `startRemoteHttpServer()` with
     `createRemoteHandler()`; each request goes through `serveNodeRequest()` (`readNodeBody()`, `toWebRequest()`,
     `writeWebResponse()`) and `routeRemoteRequest()`. On Cloudflare Workers (ADR 0010), `handleWorkerFetch()`
     converts the environment with `toEnvVars()` and builds the app with `createWorkerApp()` (`readOAuthSettings()`), using the
     request origin as issuer.
  2. Claude calls `/mcp` without a token and receives `mcpUnauthorizedResponse()`; it reads the metadata from
     `protectedResourceMetadata()` and `authorizationServerMetadata()`.
  3. `handleRegister()` registers the client with `registerClient()`: `isAllowedRedirect()` checks the redirect and the
     `client_id` is a seal from `sealPayload()`.
  4. `handleAuthorizePage()` validates the query with `parseAuthorizeQuery()` (`clientRedirectUris()`,
     `readCodeChallenge()`) and shows `renderLoginPage()` via `loginPageFor()`, with the request sealed by
     `sealAuthorizeRequest()`.
  5. The user pastes the token and may tick the write opt-in (`grantCheckbox()`, offered by `canvasLoginText()` when
     `CANVAS_ALLOW_WRITE` is on); `handleAuthorizeSubmit()` opens the request with `openAuthorizeRequest()`, checks the
     token with `verifyCanvasToken()`, keeps only the offered permission with `chosenGrants()` and returns the code
     from `issueAuthorizationCode()` via `redirectWithCode()`. Every seal carries `aud` = issuer, checked by
     `audienceMatches()` (docs/security/isolation.md).
  6. `handleToken()` exchanges the code in `redeemTokenRequest()` (`redeemAuthorizationCode()` checks PKCE with
     `pkceChallenge()`) and answers with `issueTokenSet()`; afterwards, the refresh goes through `redeemRefreshToken()`.
  7. On each refresh, `handleToken()` calls `renewSecretQuietly()`: for Canvas, `renewCanvasSecret()` first asks
     `isCanvasTokenAlive()` (`fetchCanvasSelf()`); a 401 answers `revoked` and the refresh returns `invalid_grant`,
     so Claude asks the user to connect again. Otherwise `renewCanvasToken()` lists the tokens
     with `canvasTokenApi()`, finds its own with `matchesVisibleToken()` and, if `planTokenRenewal()` says so, extends the
     expiry to now + 30 days (the maximum PUC accepts). A failed renewal only becomes a log warning.
- **Result:** the connector shows up as connected in Claude (web, Cowork and mobile); the server stored nothing.
- **Failures:** token rejected → the page comes back with the error; Canvas token deleted or expired → the next refresh
  gives `invalid_grant`; request older than 15 minutes → 400; redirect outside
  `OAUTH_REDIRECT_HOSTS` → registration rejected; changing the `SEAL_KEY` → everyone reconnects.

## P09 — Answer a tool through the remote connector

- **Trigger:** Claude calls a tool at `POST /mcp` with the access token.
- **Steps:**
  1. `handleMcp()` reads the Canvas token with `readAccessGrant()` (`openSealed()` checks type, expiry and audience `aud`).
  2. `serveMcpWithStreaming()` first tries `streamToolQuietly()` (ADR 0023): `readToolCallRequest()` reads a clone
     of the body (`parseToolCallRequest()`, `asJsonObject()`) and the connector's `streamTool`, `streamCanvasTool()`,
     takes only `download_file`: `canvasClientFor()` builds the client, `resolveCanvasFile()` finds the file
     (P03 step 5) and `streamCanvasFile()` plans the part with
     `planCanvasDownload()` and opens it with `openCanvasChunk()` (P03 step 5).
     `streamedToolResponse()` writes the JSON-RPC result from `streamedResultFrame()` around the body encoded by
     `base64EncodeStream()` (`splitBase64Ready()`) and framed by `framedStream()`, so no file ever sits
     whole in the Worker's memory. Any other call, a refusal or a failure (warned) falls through to step 3.
  3. The `createServer` of `canvasRemoteConnector()` calls `createCanvasUserServer()`: it builds the client with
     `canvasClientFor()`, decides the write tools with `canvasWriteBlock()` (P03 step 6b) and
     `createCanvasMcpServer()` registers `canvasTools()` — every tool, always (ADR 0027). `routeRemoteRequest()`
     serves the connector's own pages (`connectorPage()`: `/write-access`, from `writeAccessStoreFrom()`'s
     `CANVAS_KV`) after the OAuth and MCP routes, without CORS.
  4. `serveMcpRequest()` handles the request sessionless, in JSON, and closes the server; the tool follows P03
     from step 2.
- **Result:** the tool's response, with nothing stored on the server.
- **Failures:** expired access token → 401 and Claude uses the refresh token (and P08 step 7 extends the
  Canvas token); expired Canvas token (more than 30 days unused, or revoked) → `unauthorizedMessage()` returns the
  instruction to generate another token and reconnect (P08). A part never carries more than its planned bytes
  (`byteRangeStream()`), whatever Canvas sends.

## P10 — Connect the remote Gmail (install and sign in with Google)

- **Trigger:** anyone installs the `gmail` plugin from the marketplace or adds `https://<worker>/mcp` as a
  custom connector in Claude (ADR 0014, ADR 0016).
- **Steps:**
  1. `handleGmailWorkerFetch()` (entry `src/index.ts`) applies `isRateLimited()` per IP (`clientIpKey()`) outside
     `/mcp` (`isMcpPath()`) and creates the provider with `createGmailProvider()` for the origin from `publicOrigin()`; the
     library serves metadata, `/register` (filtered by `checkClientRegistration()`) and `/token`, and sends the
     rest to `handleDefaultRequest()`, which builds `createGmailDeps()` (`readGmailSettings()`).
  2. `GET /authorize`: `showAuthorize()` validates the request and shows `consentPage()`; if consent was already
     remembered, it goes straight to `beginGoogleSignIn()`.
  3. `POST /authorize`: `submitAuthorize()` denies (back to Claude with `access_denied`) or approves and calls
     `beginGoogleSignIn()`, which stores the PKCE verifier and `nonce` in the transaction and redirects with
     `googleAuthorizeUrl()` (`openid email gmail.modify`, offline access).
  4. `GET /google/callback` without the `link.` prefix: `finishSignIn()` recovers the transaction; `completeSignIn()` exchanges the
     code with `exchangeGoogleCode()`, validates the `id_token` with `verifyGoogleIdToken()`, checks
     `isEmailAllowed()` (only blocks in private mode) and `linkSignedInAccount()` links the sign-in account right away
     (`storeGoogleAccount()`); the library completes the authorization with the `sub` as user (props: user,
     email and session id).
- **Result:** Claude receives the code and exchanges it for tokens in the `OAUTH_KV` KV; the sign-in account already shows up in
  `list_accounts`.
- **Failures:** in private mode, an email outside `ALLOWED_EMAILS` → 403 (`accessDeniedPage()`); refusal at Google →
  `access_denied` to Claude; Gmail unchecked → signs in with no linked account; invalid request or missing cookie →
  `authorizationErrorResponse()`; more than 30 req/min from the same IP → 429; missing secret → 500
  (`configErrorResponse()`).

## P11 — Link another Gmail account (`link_account` → `/accounts/link`)

- **Trigger:** the user asks Claude to link another account, or a tool says the account lost
  access.
- **Steps:**
  1. The `link_account` tool calls `issueLinkUrl()`: a sealed ticket with the user, their email, a `jti` and 10 minutes
     of validity, bound to this Worker (`aud`).
  2. The user opens the link; `showLinkConfirmation()` opens the ticket with `openLinkTicket()` without spending it
     (checking `usedTicketKey()`), shows `linkConfirmPage()` (`linkConfirmBody()`, owner email masked by `maskEmail()`)
     and sets the link cookie.
  3. The user confirms; `startAccountLink()` calls `redeemConfirmedTicket()`, which requires
     `isConfirmedInThisBrowser()` (the sealed confirmation names the same ticket and the cookie hash) and redeems the
     ticket with `redeemLinkTicket()` (single use, marked in KV). `beginLinkStage()` starts the `verify` stage:
     `storeLinkRequest()` keeps the sealed request under a `link.` state and `linkStageUrl()` sends the browser to
     Google with `OWNER_CHECK_SCOPES` and the owner `login_hint`.
  4. On return, `finishAccountLink()` takes the request with `takeLinkRequest()` (single use, cookie checked by
     `readCookie()` and `sha256Hex()`) and `linkSafely()` runs its stage. In `verify`, `verifyOwnerThenLink()`
     requires the `id_token` `sub` to be the owner (otherwise `notOwnerPage()`, 403, nothing linked) and starts the
     `link` stage with `beginLinkStage()` (Gmail scopes, offline access), keeping the cookie.
  5. In `link`, `linkSafely()` runs `linkFromCode()`, which exchanges the code, validates the `id_token`, checks `linkRefusalReason()`
     (`gmail.modify` scope with `hasModifyScope()` and refresh token) and stores with `storeGoogleAccount()` (`upsertAccount()`,
     `saveOwnerAccounts()`, seal from `sealOwnerAccounts()`) under the ticket's user.
- **Result:** "Account linked" page; the cookie is cleared with `linkCookie()`.
- **Failures:** expired link, already used, from another Worker, or confirmed without the page's cookie →
  `invalidTicketPage()`; owner check signed in with another Google account (a forwarded link) → `notOwnerPage()`; refusal at Google → "Link
  cancelled"; Gmail permission unchecked → "Missing permission"; more than 10 accounts → limit error.

## P12 — Answer a Gmail tool

- **Trigger:** Claude calls a tool at `POST /mcp` with the access token.
- **Steps:**
  1. The library validates the token and calls `handleMcpApi()`, which applies `isRateLimited()` per session, builds the
     dependencies with the user from `props` and creates `createGmailServer()` with `GMAIL_TOOLS`; `serveMcpRequest()`
     answers sessionless.
  2. The tool reads the user's accounts with `ownerRefs()` (`loadOwnerAccounts()`, `openOwnerAccounts()`,
     `aliasAccounts()`) and resolves `account` with `resolveOwnerAccounts()` or `resolveSingleAccount()`.
  3. `gmailGet()` → `gmailCall()` gets the access token with `getAccessToken()` (in memory by `accessTokenKey()` or
     `renewAccessToken()`), calls the Gmail API with `gmailUrl()` and `sendGmailRequest()`, reads with `readGmailJson()`
     and, after a 401, retries once.
  4. Responses become lean objects: `searchThreads()` (`searchAccount()`, `summarizeThread()`, combined
     page with `encodeMultiPageToken()`), `formatThread()`/`formatMessage()` (`messageBodyText()`,
     `truncateText()`), `accountLabels()` (`fetchLabels()`), `accountStatus()` (`accountBase()` shows `write_access`) or
     `readAttachmentText()` (`downloadAttachment()`,
     `attachmentBytesToText()` → `pdfToText()`, `wordToText()` or `htmlToText()`); `withUntrustedNotice()` adds the
     untrusted-content notice. `unlink_account` uses `revokeGoogleToken()` and `saveOwnerAccounts()`.
- **Result:** lean JSON text, size-limited, with the account alias on each item; only the user's
  own accounts.
- **Failures:** no account → `noAccountsError()`; revoked account → `relinkError()` (asks for `link_account`);
  `invalid_grant` marks the account with `markAccountRevoked()`; Gmail HTTP error → `gmailHttpError()` (with
  `gmailErrorDetail()`); more than 120
  req/min → 429 (`rateLimitedResponse()`); attachment above 5 MB or unsupported type → error explaining the limit.

## P13 — Connect the remote WhatsApp (OAuth with owner login via GitHub)

- **Trigger:** in Claude, add the WhatsApp custom connector `https://<worker>/mcp` (ADR 0015).
- **Steps:**
  1. `handleWhatsAppFetch()` builds the apps with `createWhatsAppApps()` (`readWhatsAppSettings()`: `readAllowedEmails()`,
     `requireEnv()`, `readTimingSettings()`, `readSendSettings()`; `resolveIssuer()`, `readOAuthSettings()`) and,
     since the path is not under `/pair`, passes the request to `routeRemoteRequest()`.
  2. Discovery and registration follow P08 (steps 2 and 3). The connector comes from `whatsappRemoteConnector()`, with the login
     from `githubUpstreamLogin()` (`githubSettingsFrom()`).
  3. `handleAuthorizePage()` validates the request and, since it is a delegated login, `redirectToUpstream()` sends the browser to
     `githubAuthorizeUrl()` with the request sealed in the `state`.
  4. On return, `handleUpstreamCallback()` opens the `state` with `openAuthorizeRequest()` and calls `finishGithubLogin()`:
     `exchangeGithubCode()` exchanges the code, `fetchGithubEmails()` reads the emails and `pickAllowedEmail()` requires a
     verified one from `ALLOWED_EMAILS` (list from `parseEmailList()`). The GitHub token is discarded.
  5. The accepted email becomes the code's secret (`issueAuthorizationCode()`, `redirectWithCode()`); the token exchange
     follows P08 (step 6).
- **Result:** the connector shows up as connected; the secret sealed in the tokens is only the owner's email.
- **Failures:** login cancelled or account outside the list → 403 page with the reason (`escapeHtml()`); expired `state` →
  400; missing secret, or `ALLOWED_EMAILS` without exactly one email (single tenant) → 500 explaining which one.

## P14 — Answer a WhatsApp tool (on demand)

- **Trigger:** Claude calls a tool at `POST /mcp` (e.g. `list_chats`).
- **Steps:**
  1. `handleMcp()` opens the access token and checks with `acceptsSecret` whether the email is still on the list; the
     `createServer` builds `createWhatsAppMcpServer()` with `whatsappTools()` (read; sending only with `ENABLE_SEND`).
  2. The tool runs in `runRead()` with the deadline from `toolDeadline()`: `prepareRead()` calls `waitForSync()`, which
     requests `POST /sync/wait` with the budget from `syncWaitBudget()`, and, if pairing is needed, returns the `/pair`
     address. `withDeadline()` cuts off anything past the ceiling. `whatsapp_status` also calls `waitForSync()` (not
     `GET /status`), so a container that just woke up reports its connection once it reconnects instead of
     `connected: false`; if the wait runs out, `compactStatus()` adds the `warning`.
  3. Bridge calls go through `bridgeJson()`/`callBridge()` (`bridgePath()`, `jsonPost()`), which use
     `bridgeFetchFor()` over the single stub from `bridgeStub()`. Errors become text with `bridgeErrorFrom()`;
     deadline overruns, `bridgeTimeoutMessage()`.
  4. In the Durable Object, `routeBridgeRequest()` (built by `createBridgeLifecycle()`) calls `ensureRestored()`:
     `readBridgePhase()` and, if the bridge just woke up, `restoreRequestInit()` sends the R2 snapshot. Then
     `fetchBridge()` forwards with `withBridgeToken()` and `forwardInit()`.
  5. The response is reduced by `compactChat()`, `compactMessage()`, `compactContact()` or `compactStatus()` (text
     cleaned by `sanitizeText()` and `isHiddenChar()`) and wrapped by `untrusted()`; `partialSyncWarning()` adds the
     partial-result notice. Media becomes an MCP block in `mediaResult()` (`binaryContentBlock()`, `bytesToBase64()`).
- **Result:** compact response, with ISO dates with time zone and the untrusted-content notice.
- **Failures:** slow cold start → `Timed out waiting for WhatsApp…: try again in a moment`; a snapshot that does not open → `bad_snapshot` error
  (the bridge never restarts from scratch on its own); email removed from the list → 403.

## P15 — Pair the number (`/pair`)

- **Trigger:** the owner opens `https://<worker>/pair`.
- **Steps:**
  1. `routePairRequest()` recognizes the path with `isPairPath()` and reads the session with `readPairSession()`
     (`parseCookies()`, `openSealed()`).
  2. Without a session, `startPairLogin()` sends to GitHub with a sealed `state` and a nonce in a cookie (`pairCookie()`,
     `redirectWithCookies()`). On return, `handlePairCallback()` checks with `isValidPairLogin()`, completes with
     `finishGithubLogin()` and `openPairSession()` stores the session.
  3. `pairPage()` shows `renderPairPage()` with the status from `fetchPairStatus()` (`describePairStatus()`,
     `pairingSection()`, `maintenanceSection()`, `pairForm()`, `alertHtml()`) and a token from `issuePairCsrf()`.
  4. Each POST goes through `routePairPost()` and `handlePairPost()`: `isTrustedPost()` checks the token and `Origin`, and the
     `PAIR_ACTIONS` action calls the bridge (`/pair/code` with `normalizePhone()`, `/pair/qr`, `/logout`, or
     `/__reset`, which reaches `resetBridge()` and `archiveSnapshot()`), with the deadline from `pairDeadline()`; a failure becomes
     `pairActionError()`.
- **Result:** pairing code (or QR) on screen; once typed on the phone, the bridge stays connected.
- **Failures:** stale form or from another origin → 403; invalid number → notice on the page; bridge not responding →
  `Could not read the WhatsApp status right now.`.

## P16 — Save and restore the session (snapshots in R2)

- **Trigger:** routes that may change the database (`SNAPSHOT_AFTER_PATHS`), the end of `SLEEP_AFTER` and, best
  effort, the bridge's `SIGTERM`.
- **Steps:**
  1. After forwarding, `SnapshotScheduler` schedules a snapshot if the last one is older than `SNAPSHOT_INTERVAL_MS`;
     snapshots run in a queue and failures only go to the log (`logSnapshotFailure()`).
  2. `snapshotBridge()` requests `GET /snapshot` from the bridge (already encrypted) and `storeSnapshotResponse()` reads
     `readUploadHeaders()`; `storeSnapshot()` compares with `storedGeneration()` and writes as a fixed-length stream
     (`workersFixedLength()`, which copies with `pumpInto()`), discarding an old generation.
  3. Before sleeping, the `onActivityExpired` of `WhatsAppBridge` takes the last snapshot and stops the container.
  4. On `SIGTERM` and whenever the device session changes (paired, connected or logged out), the bridge pushes the snapshot
     on its own to `snapshot.internal`, intercepted by the Worker in `acceptSnapshotPush()` (token checked by
     `sameSecret()`). So a new pairing goes to R2 right away, without waiting for use or for the container to sleep.
  5. On the next boot, `ensureRestored()` hands the snapshot back to the bridge (P14, step 4).
- **Result:** session and messages survive the container sleeping, without the Worker seeing the content in clear text.
- **Failures:** snapshot rejected by the bridge → error until `Start over` (start over) on `/pair`; abrupt crash without `SIGTERM`
  → loses only what changed since the last snapshot (WhatsApp resends pending items); a failed R2 write →
  the next snapshot is forced (`?force=1`).

## P17 — Send a message (`ENABLE_SEND`) and optional periodic sync

- **Trigger:** `send_message` with `confirmed_by_user: true`; or a Cron Trigger equal to `SYNC_CRON`.
- **Steps:**
  1. Sending: `allowedRecipient()` normalizes the recipient with `normalizeRecipient()` (number, contact, LID or
     group) and, if `SEND_ALLOWLIST` has items, requires it to be on it; `reply_to_message_id` becomes `reply_to`.
     In the Durable Object, `guardSend()` applies `planSend()` with the stored history before forwarding
     `/send`. The bridge checks recipient and allowlist, looks up the quoted message (`GetQuoted`) and applies the limit
     again before sending.
  2. Cron: `runScheduledSync()` only acts if `isSyncCronEnabled()`; wakes the bridge with `/sync/wait`, requests
     `/__snapshot` and lets the container sleep after `SLEEP_AFTER`.
- **Result:** at most `SEND_MAX_PER_HOUR` sends per hour, to any contact or group (or only the
  allowlist, if set), each confirmed by the owner; with cron, history stays up to date even without use.
- **Failures:** invalid recipient or outside the list → refused without calling the bridge; unknown quoted message →
  `quoted_not_found` without using the quota; limit exceeded → 429 with the wait in seconds.
- **Result:** at most `SEND_MAX_PER_HOUR` sends per hour, only to the allowlist; with cron, history stays up to date
  even without use.
- **Failures:** recipient outside the list → refused without calling the bridge; limit exceeded → 429 with the wait in seconds.

## P18 — Manage Gmail: send, reply, forward, drafts and organize

- **Trigger:** Claude calls a write tool (`send_email`, `reply_email`, `reply_all_email`,
  `forward_email`, `create_draft`, `update_draft`, `send_draft`, `delete_draft`, `mark_read`, `archive`, `star`,
  `update_labels`, `trash`, `untrash`) at `POST /mcp`, after showing the content to the user and receiving
  confirmation (the MCP annotations for sending and deleting have `destructiveHint`; ADR 0019). Every tool of the three
  connectors has a `title` and mandatory hints (`toolAnnotations()` in `src/mcp/annotations.ts`; typecheck fails without them).
- **Steps:**
  1. Steps 1 and 2 of P12; the account comes from `resolveWritableAccount()`, which requires the scope with
     `requireWriteAccess()` (`hasModifyScope()`) before any Gmail call.
  2. New email: `composeEmail()` validates the recipients (`parseRecipients()`, `splitAddressList()`,
     `parseMailAddress()`) and the limit (`checkRecipientLimit()`). Reply: `prepareReply()` reads the original with
     `fetchFullMessage()` and `replyEmail()` computes `replyRecipients()` (`replyToList()`, `uniqueAddresses()`),
     `prefixSubject()`, `threadingHeaders()` and `quotedText()`. Forward: `prepareForward()` downloads the attachments
     with `forwardAttachments()` and builds `forwardEmail()` (`forwardedText()`).
  3. `gmailMessageResource()` builds the MIME with `buildMimeMessage()` (`mimeHeaderLines()`, `formatMailAddress()`,
     `encodeHeaderWord()`, `cleanHeaderText()`, `textPart()`, `attachmentPart()`, boundary from `mimeBoundary()`)
     and `toRawMessage()`; `sendPrepared()` sends via `messages/send` keeping the `threadId` (`sentResult()`).
  4. Drafts: `prepareDraftEmail()` (new or reply, via `draftArgs()`), `createDraft()`, `updateDraft()`,
     `sendDraft()`, `deleteDraft()` and `listDrafts()` (`draftSummary()`, `draftIds()`).
  5. Organization: `writableTargets()` (`mailTargets()`) and `runMailboxAction()` apply `MAILBOX_ACTIONS` with
     `applyLabelChange()` (`batchModify` on messages, `modify` on threads); `update_labels` uses
     `fetchLabels()`, `resolveLabelIds()` and `checkLabelChange()`; `moveToTrash()` does `trash`/`untrash`.
     Every write goes through `gmailWrite()`.
- **Result:** email sent or draft/labels changed in the requested account; the result includes the ids.
  Permanent deletion does not exist (not even the `gmail.modify` scope allows it).
- **Failures:** account linked with only `gmail.readonly` → `writeAccessError()` (asks for `link_account`), without calling
  Gmail; invalid address or no recipient → error naming the field; attachments above 18 MB → error before
  downloading; unknown label → error suggesting `list_labels`; refusal from Gmail → `gmailHttpError()` with the
  detail.

## P19 — Deploy a remote connector and smoke-test its tools

- **Trigger:** `npm run worker:deploy`, `npm run gmail:deploy` or `npm run whatsapp:deploy` (ADR 0027).
- **Steps:**
  1. `wrangler deploy` publishes the Worker.
  2. `npm run smoke -- <connector>` runs `runSmokeCli()`: `readSmokeCheck()` reads `wrangler.toml` and
     `tool-contract.json` (`readToolContract()`, `contractEntryAsListed()`, `toolContractOf()`) and finds the address
     with `workerBaseUrl()` (`SMOKE_URL`, else `wranglerValue()` of `PUBLIC_URL`, else
     `<name>.<fetchWorkersSubdomain()>.workers.dev`).
  3. `runSmokeCheck()` calls `smokeAttempt()` up to `SMOKE_ATTEMPTS` times, `SMOKE_RETRY_MS` apart (`sleepMs()`):
     `fetchPublishedTools()` reads `GET /tools`, which the Worker answers with `handleToolCatalog()` (shared
     handler) or `handleDefaultRequest()` (Gmail) through `serveToolCatalog()` and `toolsListRequest()` — the real
     `tools/list` of a server built with `listOnlyContext()` (`refuseListOnlyUse()` on any use):
     `createCanvasMcpServer()`, `createGmailServer()` or `createWhatsAppCatalogServer()`. `toolsFromListResponse()`
     and `toolContractDiff()` compare it with the contract.
- **Result:** `✔ smoke <connector>: N tools … match tool-contract.json`.
- **Failures:** a missing, extra or differently annotated tool, or an unreachable Worker, after every attempt →
  exit 1, the deploy command fails and prints the `wrangler rollback` command. The same comparison runs in the
  unit tests (`contract.test.ts` of each connector, `unregisteredToolMentions()` over `snakeCaseWords()` and `toolTexts()`), so a
  divergence is normally caught before deploying.

## P20 — Semester plan (`/planejamento-faculdade`)

- **Trigger:** the student types `/planejamento-faculdade` (or asks for the semester plan), or one of its three routines
  fires (morning, night, unsent-assignment alert).
- **Steps:**
  1. The skill detects the connectors (`whoami`, `list_accounts`, `whatsapp_status`); Canvas is required, Gmail
     and WhatsApp are optional and go to `missingSources` when absent. Everything is read-only.
  2. Update mode: the published page is saved and `runPlanCommand()` runs `extract` (`runExtract()`,
     `extractPlan()`, `validatePlan()`) to recover the plan JSON with its ids.
  3. Claude writes the plan JSON (format in the skill's `references/plan-json.md`) and runs `build`
     (`runBuild()`): `planSchema` checks the shape, `readPreviousPlan()` reads `--previous`, `mergeWithPrevious()`
     reuses ids (`assignPlanIds()`, `previousIdIndex()`, `planIdEntries()`, `stableItemId()`) and carries over
     left-out items (`carryPreviousItems()`, `carryDays()`), `validatePlan()` checks the rules (`checkPointSums()`,
     `checkPlanDates()`, `checkPlanIds()`, `checkCourseRefs()`) and `injectPlan()` puts `serializePlanJson()` into
     the template from P05.
  4. Claude publishes the page as a private artifact with the `db` and `user` capabilities. In update mode, the
     Canvas listings take `changed_since` = previous `generatedAt` − 24 h (P03 step 8), and the skill offers to
     refresh morning and night routines whose prompt lacks `changed_since`: `update_trigger` with the prompt only,
     never `enabled`, the schedule or the name, and never recreating a deleted routine.
  5. In the browser, `startPlanPage()` → `bootPlanPage()` reads `readEmbeddedPlan()`, renders with
     `renderPlanSections()` (header, risk chips, today, study, cards with `barSegments()` and `riskLevel()`,
     timeline, questions, footer) using only `createEl()`/`appendRichText()`, and wires the checklists:
     `createCheckStore()` loads localStorage, `registerCheck()` keys each box by its stable id, and
     `connectAccount()` → `accountDocument()` / `adoptAccount()` merge with `data/users/<uid>/<planKey>`
     (`mergeChecks()`), write with `flushChecks()` (`retryOnUnavailable()`) and follow other devices with
     `onRemoteSnapshot()`.
- **Result:** an up-to-date "Plano do Semestre" whose ticks survive reloads, plan updates and devices.
- **Failures:** Canvas not connected → the skill stops and points to `/setup-canvas`; an invalid plan → `build`
  writes nothing and lists the errors; broken page data → `#plan-error` shows the message; no account → the
  ticks stay in this browser (`local` state).

## P21 — Connect Spotify with your own app (OAuth through the user's Spotify app)

- **Trigger:** the user clicks **Connect** on the `spotify` connector in Claude (ADR 0033).
- **Steps:**
  1. Claude registers at `/register` (`checkClientRegistration()` only accepts Claude callbacks) and opens
     `/authorize`; `showSpotifyAuthorize()` validates the request, starts the consent (`beginConsent`) and renders
     `credentialsPage()` (`credentialsBody()`, `appSetupSteps()` with the exact Redirect URI from
     `pageTargets()` / `spotifyRedirectUri()`).
  2. The user creates their app on the Spotify dashboard, pastes the Client ID and Secret and posts the form.
     `submitSpotifyAuthorize()` sends a cancel back to Claude (`denyConsent`); otherwise `credentialsProblem()`
     validates the pair (`isSpotifyAppCredential()`) and an invalid one re-shows the page with the same handle
     (`credentialsRetryPage()`).
  3. `beginSpotifyAuthorization()` approves the consent, seals the credentials for 15 minutes
     (`sealPendingApp()`) inside the library's upstream transaction and redirects to `spotifyAuthorizeUrl()` with
     the user's Client ID, the minimal `SPOTIFY_SCOPES` and `show_dialog=true`.
  4. Spotify returns to `/spotify/callback`: `finishSpotifySignIn()` → `resumeSpotifySignIn()` checks the
     single-use `state` (`finishUpstream`), turns a refusal into `access_denied`, reopens the credentials
     (`openPendingApp()`) and calls `completeSpotifySignIn()`.
  5. `connectSpotifyAccount()` exchanges the code with HTTP Basic auth of the user's app (`exchangeSpotifyCode()`
     → `postSpotifyToken()`), reads `/me` (`fetchSpotifyIdentity()`: owner = `account_id`, else `id`, URL-encoded)
     and stores the account sealed in the vault (`saveAccount()` → `writeVault()`). `completeAuthorization` issues
     Claude's grant with `{ owner, sid }`.
- **Result:** Claude holds a token for this connector user; the user's app credentials and refresh token sit
  encrypted under a hash of their Spotify account.
- **Failures:** wrong Redirect URI → Spotify's own error page; wrong credentials → `spotifyFailurePage()` "Wrong
  app credentials"; account not in the app's User Management (403 on `/me`) → "Account not allowed in your app";
  forged or replayed `state` → 400; credentials sealed more than 15 minutes ago → `expiredConnectionPage()`.

## P22 — Answer a Spotify tool (token renewal, call budget, retries)

- **Trigger:** Claude calls a tool at `POST /mcp`.
- **Steps:**
  1. `handleSpotifyWorkerFetch()` → the library checks the token; `handleSpotifyMcp()` applies the per-session
     limit (`isRateLimited()`), builds the deps (`createSpotifyDeps()`, `readSpotifySettings()`) with a fresh
     request budget (`parseCallBudget()`) and serves `createSpotifyServer()`.
  2. Each Web API request goes through `spotifyCall()`: `sendSpotifyAttempt()` gets a token from
     `getSpotifyAccessToken()` (memory, keyed by owner, or `renewSpotifyAccessToken()` with the stored refresh
     token via `refreshSpotifyToken()`, saving a rotated one), spends the budget (`spendCall()`) and sends
     `spotifyRequestInit()`.
  3. `decideRetry()` renews once after a 401 (`forgetSpotifyAccessToken()`), waits for a short `Retry-After` on 429
     (`retryableDecision()`, `rateLimitDecision()`, `retryAfterSeconds()`), retries 5xx, and otherwise
     `spotifyHttpError()` builds the actionable message (`forbiddenMessage()`, `notFoundMessage()`,
     `rateLimitMessage()`, `spotifyErrorDetail()`).
  4. Listings page with `collectOffsetPages()` / `fetchOffsetPage()` (`readPagingObject()`, `nextPageOffset()`,
     `cursorAfter()`); results are compacted by `trackOutput()`, `playlistOutput()` and `catalogItemOutput()`.
- **Result:** compact JSON for Claude; long reads return what fit plus where to continue.
- **Failures:** expired authorization (6 months) or rotated secret → `reconnectError()`; no account →
  `notConnectedError()`; budget exhausted → `BudgetExhaustedError`, turned into a "loading"/"partial" answer by
  the smart tools; playback without Premium or device → the 403/404 messages.

## P23 — Smart operation: preview → confirm → apply (with automatic backup)

- **Trigger:** the user asks for a batch change (e.g. "keep only Chris Cornell + electronic").
- **Steps:**
  1. The `preview_*` tool loads its source with `readySource()` → `loadCompleteSource()` → `loadSource()`, which
     reuses or continues a vault snapshot (`isSnapshotReusable()`, `emptySnapshot()`, `sourceVersion()`,
     `advanceSnapshot()`), answering `loadingStatus()` until complete. Genres come from `ensureGenres()`
     (per-user cache, `fetchArtistGenres()`).
  2. A pure draft is built: `filterLikedDraft()` (`matchesFilter()`, `tracksToRemove()`), `dedupeDraft()`
     (`findDuplicates()`, `songKey()`), `unavailableDraft()`, `splitDraft()`, `mergeDraft()`, `sortDraft()`,
     `copyLikedDraft()`, `staleDraft()` (after `scanOwnPlaylists()`), or `restoreDraft()`.
  3. `previewDraft()` stores it with `createPlan()` (10-minute validity) and answers `previewOutput()`: counts,
     sample and `plan_id`. Nothing changed yet.
  4. After the user's explicit OK, `apply_plan` loads it (`requirePlan()`) and `runPlan()` runs:
     `backupBeforeApply()` saves the "before" data (`saveBackup()`) when a step removes or rewrites,
     `reconcilePlan()` re-reads the item count of a resumed playlist step (`playlistItemCount()`), and
     `runPlanChunk()` sends chunks (`writeLibraryChunk()` 40 URIs, `runAddChunk()`, `runReplaceChunk()`,
     `runCreateChunk()` 100 items), moving with `advancePlan()`.
  5. `forgetTouchedSources()` drops the snapshots it changed; `storePlan()` keeps the progress (or removes the
     finished plan) and `applyOutput()` answers `done` or `partial`.
- **Result:** the change is applied; the answer carries `backup_id` and created playlists.
- **Failures:** expired plan → "Run the preview again"; budget exhausted → `partial`, the next call continues;
  Spotify error → progress kept, error message returned; playlists with local files are never rewritten
  (`checkNoLocalFiles()`).

## P24 — Back up, export and restore

- **Trigger:** `create_backup`, `export_backup`, `preview_restore` or an automatic backup in P23.
- **Steps:**
  1. `create_backup` loads the source (P23 step 1) and saves `toBackupTrack()` / `playlistBefore()` with
     `saveBackup()`, which keeps the newest `MAX_BACKUPS` (`listBackups()`, `backupEntry()`).
  2. `export_backup` reads `requireBackup()` and pages it with `backupPage()`.
  3. `preview_restore` builds `restoreSteps()` (re-like, re-follow, playlists recreated as new ones) and goes
     through P23 steps 3–5.
- **Result:** JSON copies of likes and playlists the user can export or restore.
- **Failures:** unknown or another user's id → "does not exist"; liked dates cannot be restored (Spotify limit).

## P25 — Disconnect and erase

- **Trigger:** `disconnect` with `confirm: true`, after the user agrees.
- **Steps:**
  1. `eraseOwner()` deletes every vault key of the user, of every type in `VAULT_TYPES` (`deletePrefix()` over
     `ownerHash()` prefixes).
  2. `forgetSpotifyAccessToken()` drops the cached access token; `revokeClaudeGrants()` revokes the user's Claude
     grants on this connector.
- **Result:** nothing of the user remains on the connector; the answer points to Spotify's apps page to remove
  the app's access there too (Spotify has no revocation API).
- **Failures:** none expected; KV errors propagate.
