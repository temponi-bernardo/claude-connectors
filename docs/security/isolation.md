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
   the ticket is spent. Then the person must **prove they are the owner**: a Google sign-in with `openid email`
   whose `sub` must equal the ticket owner (`verifyOwnerThenLink()`). Only after that does Google ask for Gmail
   access for the account to add. Someone who opens a forwarded link cannot pass the owner check, so nothing of
   theirs is linked.
6. **Response/log** — `errorResult()` and `messagePage()` redact secrets.

### WhatsApp (`connectors/whatsapp/src/worker.ts`)

1. **Auth** — the same handler as Canvas (`aud` included); the secret is the owner's email.
2. **Owner** — `acceptsSecret()` re-checks the email against `ALLOWED_EMAILS` on every request → `403` otherwise.
   `readAllowedEmails()` requires exactly one email, with no override.
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

| #   | Item                               | Verdict                  | Evidence                                                                                                            | Fix                                                                                                                                                                                                                                                                           | Test                                                                                                                                  |
| --- | ---------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Seals without audience             | Confirmed (no live leak) | `openSealed` only checked `typ`/`exp`; `issueTokenSet`, `registerClient`, pair seals and Gmail tickets had no `aud` | `aud` = issuer in every seal of the OAuth, `/pair` and Gmail link flows; `audienceMatches()` in `openSealed`. Keys are distinct → no rotation                                                                                                                                 | `tokens.test.ts`, `seal.test.ts`, `canvas-puc/src/isolation.test.ts`, `whatsapp/src/worker.test.ts`, `gmail/src/link-flow.test.ts`    |
| 2   | Canvas writing on for everyone     | Confirmed                | `CANVAS_ALLOW_WRITE = "true"` gave every user `send_message`, `reply_to_*`, `submit_*`                              | Per-user opt-in: unticked checkbox on the login page (`write` grant sealed in the tokens) or, later, the `/write-access` link (15-min seal with the token fingerprint; opt-in in `CANVAS_KV`, ADR 0027). Write tools listed for all, refusing without calling Canvas when off | `canvas-puc/src/isolation.test.ts`, `remote.test.ts` (`canvasWriteBlock`), `write-access.test.ts`, `handler.test.ts` (`chosenGrants`) |
| 3   | Canvas without per-user revocation | Confirmed (by design)    | Stateless: access 1 h, refresh 30 days                                                                              | Documented: deleting the token in Canvas cuts that user at once (every call and every refresh hit Canvas). No denylist (it would need KV)                                                                                                                                     | `remote.test.ts` (`renewCanvasSecret` → `revoked`)                                                                                    |
| 4   | WhatsApp with several owners       | Confirmed                | `readAllowedEmails` accepted any list                                                                               | Exactly one email, no override                                                                                                                                                                                                                                                | `whatsapp/src/config.test.ts`, `worker.test.ts`                                                                                       |
| 5   | Gmail link ticket forwarded        | Confirmed                | `GET /accounts/link` spent the ticket and went to Google at once                                                    | Confirmation page (masked owner); POST bound to page + browser cookie; Google owner check (`sub` = owner) before Gmail access; ticket bound to the Worker                                                                                                                     | `gmail/src/link-flow.test.ts`, `pages.test.ts`, `worker.test.ts`                                                                      |
| 5b  | Gmail `ALLOWED_EMAILS` empty       | Intended                 | `config.ts` header: "public and multi-user"; no `ALLOWED_EMAILS` secret deployed                                    | None                                                                                                                                                                                                                                                                          | `gmail/src/config.test.ts`                                                                                                            |
| 6   | Global state                       | Refuted (one safe cache) | Only `accessTokenCache` (`owner\nemail` key); `McpServer` per request, closed in `finally`                          | Architecture test; constants typed read-only                                                                                                                                                                                                                                  | `src/module-state.test.ts`, `gmail/src/isolation.test.ts`                                                                             |
| 7   | Errors and logs                    | Confirmed                | `client.ts` returned up to 300 characters of the Canvas body; `console.warn` with raw `error.message`               | `src/core/redact.ts`: `redactSecrets()` in `errorResult`, login/callback pages and `messagePage`; `logWarning()` for every log                                                                                                                                                | `src/core/redact.test.ts`, `handler.test.ts`, `canvas-puc/src/isolation.test.ts`                                                      |
| 8   | CORS `*` everywhere                | Partly confirmed         | `routeRemoteRequest` added CORS to `/authorize` and `/oauth/callback`                                               | No CORS on the browser pages; `*` stays on discovery, `/register`, `/token` and `/mcp` (no cookies there)                                                                                                                                                                     | `handler.test.ts`                                                                                                                     |

## Live evidence (2026-11-18, fake credentials only)

- **Two users in the real Workers runtime** (`wrangler dev`/workerd, Canvas Worker, fake Canvas server, full OAuth
  for both): 40 interleaved concurrent calls each returned only the caller's profile and no token; write tools
  only for the user who ticked the box (kept after refresh); refresh token as access, tampered and random tokens
  → 401; after revoking one user's token in Canvas, that user's calls fail (no token in the error) and the
  refresh gives `invalid_grant`, while the other user is unaffected. 11/11 checks passed.
- **Two users on Cloudflare** (temporary Workers, created with the owner's approval and deleted after the run: a
  copy of the Canvas Worker built from this code plus a fake Canvas, full OAuth for both users): the same checks
  passed, **12/12**: 40 interleaved concurrent calls with each user seeing only their own data and no token; write
  tools only for the opted-in user, kept after refresh; refresh-as-access, tampered and random tokens → 401;
  revoking Alice in the fake Canvas → her calls fail without leaking her token and her refresh gives
  `invalid_grant`, Bob unaffected; a token of that Worker refused by the production Canvas Worker (401). Real
  Canvas tokens were never used: revoking one would cut a real user's access.
- **Same `SEAL_KEY`, two Workers** (two local Canvas Workers on different origins): a token valid on its own Worker
  (200) is refused by the other: access 401, refresh 400, `client_id` 400. This is the `aud` check working even
  when the keys are equal.
- **Deployed Workers, real sealed artifacts crossed:** Canvas `pending` → WhatsApp `/oauth/callback` 400;
  WhatsApp `state` → Canvas `POST /authorize` 400; each Worker's `client_id` on the other 400; control on its own
  Worker 200. `/mcp` without or with a random token → 401 on all three.

**Accepted by the owner (2026-11-18):** the two-user run and the token revocation were proven on Cloudflare with
the production code (temporary Workers) and not on the production Workers, because that would need real Canvas
tokens, which the audit rules forbid. The production Workers were checked with real sealed values crossed between
them and with bad tokens (401).

## Residual risks

- Revoking one Canvas user is done in Canvas (delete the token); it takes effect on the next call (proven live
  above). There is no server-side switch per user; `SEAL_KEY` rotation disconnects everyone.
- Tokens issued before this change have no `aud`; they keep opening until `LEGACY_AUDLESS_UNTIL` (2027-01-01).
  Every access/refresh token issued before the change expires earlier, and the keys are distinct, so nothing
  crosses Workers today.
- None of these lets one user read another user's data. Gmail forwarded links are stopped by the owner check;
  WhatsApp accepts exactly one owner.
