# Data isolation — audit and map

Audit of November 2026: can one user see another user's data (the owner × a friend using the public Canvas), one
account another account's, one connector another connector's, or one request another request's in the same Worker
isolate? Each finding has a test that fails if the isolation breaks.

## Where each connector keeps the user

| Connector           | Tenancy                     | Who the user is                                                            | Where the user's data lives                                                                                                                     |
| ------------------- | --------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `canvas-puc-remote` | Public, multi-user          | The Canvas token sealed (AES-256-GCM, `SEAL_KEY`) in the OAuth tokens      | Nowhere on the server: stateless, no KV                                                                                                         |
| `gmail-remote`      | Public, multi-user          | Google `sub` in the library grant (`ctx.props.owner`)                      | `GMAIL_KV` `owner:sha256(sub)`, sealed with `TOKEN_ENC_KEY` together with the owner; access tokens in an isolate cache keyed by owner + account |
| `whatsapp-remote`   | Personal, **single tenant** | The owner's GitHub email, checked against `ALLOWED_EMAILS` on every `/mcp` | One Durable Object (`owner`), its bridge container and the R2 snapshots                                                                         |

The seal keys are per Worker and distinct: `SEAL_KEY` (Canvas), `SEAL_KEY` (WhatsApp), `TOKEN_ENC_KEY` (Gmail).
Checked by name with `wrangler secret list` and, without reading any value, by a live probe: a `client_id`
registered on one Worker is refused (`400 Unknown client`) by the other, in both directions.

## Life of a request

### Canvas (`src/remote/handler.ts`, `connectors/canvas-puc/src/remote.ts`)

1. **Auth** — `handleMcp()` → `readAccessGrant()` → `openSealed()` checks the key (GCM tag), `typ: access`, `exp`
   and `aud` = this issuer. Missing, random, tampered, expired or foreign token → `401`.
2. **Secret** — the grant gives the Canvas token and the permissions the user ticked at login (`grants`).
3. **Server** — `serveMcpWithStreaming()` creates a **new** `McpServer` per request (`createServer(secret,
grants)`) with a Canvas client bound to that token; `serveMcpRequest()` closes it in `finally`.
   `download_file` streams through `streamTool()` with a client also built for that request.
4. **Storage/cache** — none.
5. **Response/log** — tool errors go through `errorResult()` → `redactSecrets()`; warnings through `logWarning()`
   (`redactForLog()`: secrets and emails).

### Gmail (`connectors/gmail/src/worker.ts`)

1. **Auth** — `@cloudflare/workers-oauth-provider` validates the token in `OAUTH_KV` and gives `ctx.props`
   (`owner`, `email`, `sid`).
2. **Owner** — `handleMcpApi()` builds `OwnerDeps` with that owner; per-session rate limit by `sid`.
3. **Server** — a new `McpServer` per request (`createGmailServer()`), closed by `serveMcpRequest()`.
4. **Storage/cache** — `loadOwnerAccounts()` reads `owner:sha256(owner)` and `openOwnerAccounts()` refuses a
   record whose sealed `owner` differs. `accessTokenCache` (the only module-level state) is keyed
   `owner\nemail`, so the same Gmail account linked by two users keeps two tokens.
5. **Linking another account** — `link_account` issues a ticket (owner, owner email, `jti`, 10 minutes, `aud` =
   this Worker). `GET /accounts/link` only shows whose connector receives the account and sets a `__Host-`
   cookie; the `POST` confirmation must come from that page in that browser (sealed `jti` + cookie hash) before
   the ticket is spent and the browser goes to Google.
6. **Response/log** — `errorResult()` and `messagePage()` redact secrets.

### WhatsApp (`connectors/whatsapp/src/worker.ts`)

1. **Auth** — the same handler as Canvas (`aud` included); the secret is the owner's email.
2. **Owner** — `acceptsSecret()` re-checks the email against `ALLOWED_EMAILS` on every request → `403` otherwise.
   `readAllowedEmails()` refuses more than one email unless `ALLOW_SHARED_OWNER=true`.
3. **Server** — a new `McpServer` per request, wired to the single Durable Object.
4. **Storage** — Durable Object `owner`, container and R2 snapshots (encrypted with `SNAPSHOT_KEY`): one person's.
5. **`/pair`** — GitHub login of its own (`pair_login` → `pair_session` cookie, `aud` bound), email re-checked on
   every page; without a session it redirects to GitHub.

### Module state

`src/module-state.test.ts` scans `src/**` and `connectors/**/src/**` and fails on any top-level `let`/`var`,
mutable `Map`/`Set`/array/object literal not typed read-only, outside a reviewed allowlist (today only
`accessTokenCache`). Regexes with `/g` at module level are used only with `matchAll`/`replace`, which do not share
`lastIndex`.

## Findings

| #   | Item                               | Verdict                  | Evidence                                                                                                            | Fix                                                                                                                                           | Test                                                                                                                               |
| --- | ---------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Seals without audience             | Confirmed (no live leak) | `openSealed` only checked `typ`/`exp`; `issueTokenSet`, `registerClient`, pair seals and Gmail tickets had no `aud` | `aud` = issuer in every seal of the OAuth, `/pair` and Gmail link flows; `audienceMatches()` in `openSealed`. Keys are distinct → no rotation | `tokens.test.ts`, `seal.test.ts`, `canvas-puc/src/isolation.test.ts`, `whatsapp/src/worker.test.ts`, `gmail/src/link-flow.test.ts` |
| 2   | Canvas writing on for everyone     | Confirmed                | `CANVAS_ALLOW_WRITE = "true"` gave every user `send_message`, `reply_to_*`, `submit_*`                              | Per-user opt-in: unticked checkbox on the login page, `write` grant sealed in the tokens; old tokens are read-only. Annotations checked       | `canvas-puc/src/isolation.test.ts`, `remote.test.ts` (`canWriteFor`), `handler.test.ts` (`chosenGrants`)                           |
| 3   | Canvas without per-user revocation | Confirmed (by design)    | Stateless: access 1 h, refresh 30 days                                                                              | Documented: deleting the token in Canvas cuts that user at once (every call and every refresh hit Canvas). No denylist (it would need KV)     | `remote.test.ts` (`renewCanvasSecret` → `revoked`)                                                                                 |
| 4   | WhatsApp with several owners       | Confirmed                | `readAllowedEmails` accepted any list                                                                               | More than one email throws unless `ALLOW_SHARED_OWNER=true`                                                                                   | `whatsapp/src/config.test.ts`, `worker.test.ts`                                                                                    |
| 5   | Gmail link ticket forwarded        | Confirmed                | `GET /accounts/link` spent the ticket and went to Google at once                                                    | Confirmation page with the masked owner email; POST bound to the page and browser cookie; ticket bound to the Worker                          | `gmail/src/link-flow.test.ts`, `pages.test.ts`, `worker.test.ts`                                                                   |
| 5b  | Gmail `ALLOWED_EMAILS` empty       | Intended                 | `config.ts` header: "public and multi-user"; no `ALLOWED_EMAILS` secret deployed                                    | None                                                                                                                                          | `gmail/src/config.test.ts`                                                                                                         |
| 6   | Global state                       | Refuted (one safe cache) | Only `accessTokenCache` (`owner\nemail` key); `McpServer` per request, closed in `finally`                          | Architecture test; constants typed read-only                                                                                                  | `src/module-state.test.ts`, `gmail/src/isolation.test.ts`                                                                          |
| 7   | Errors and logs                    | Confirmed                | `client.ts` returned up to 300 characters of the Canvas body; `console.warn` with raw `error.message`               | `src/core/redact.ts`: `redactSecrets()` in `errorResult`, login/callback pages and `messagePage`; `logWarning()` for every log                | `src/core/redact.test.ts`, `handler.test.ts`, `canvas-puc/src/isolation.test.ts`                                                   |
| 8   | CORS `*` everywhere                | Partly confirmed         | `routeRemoteRequest` added CORS to `/authorize` and `/oauth/callback`                                               | No CORS on the browser pages; `*` stays on discovery, `/register`, `/token` and `/mcp` (no cookies there)                                     | `handler.test.ts`                                                                                                                  |

## Residual risks

- A Canvas user who leaves keeps working until their Canvas token is deleted in Canvas (or expires). There is no
  server-side switch per user; `SEAL_KEY` rotation disconnects everyone.
- Tokens issued before this change have no `aud`; they keep opening until `LEGACY_AUDLESS_UNTIL` (2027-01-01).
  Every access/refresh token issued before the change expires earlier, and the keys are distinct, so nothing
  crosses Workers today.
- The Gmail confirmation page relies on the person reading it: someone who receives a forwarded link and still
  confirms links their own account into the sender's connector.
- WhatsApp with `ALLOW_SHARED_OWNER=true` gives everyone listed full access to the same WhatsApp.
