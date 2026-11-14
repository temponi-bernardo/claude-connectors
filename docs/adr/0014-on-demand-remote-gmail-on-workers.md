# 0014 — Multi-account, read-only remote Gmail, on demand on Cloudflare Workers

- **Status:** Superseded in part by 0016 and 0019 (read-only scope and tools: see ADR 0019)
- **Date:** 2026-11-14
- **Related:** ADR 0009, ADR 0010, ADR 0013

## Context

The owner has two Gmail accounts (the main one and the one for music receipts) and wants Claude (claude.ai, app
and Cowork) to read both. The official claude.ai Gmail connector accepts only one account. The plan is Workers
Paid (US$ 5/month) and **nothing may run continuously**: no Containers, Cron Triggers, Durable Object alarms,
polling or keep-alive. Unlike Canvas (ADR 0009), here there is a long-lived credential that must be stored on
the server: each account's Google refresh token, linked once and used by every session.

## Decision

1. **On-demand Worker, stateless MCP.** `connectors/gmail/` is remote and becomes a marketplace plugin like
   Canvas (ADR 0013). Each request builds a new `McpServer` and replies in JSON (`serveMcpRequest()`, the same as
   Canvas); no Durable Object. State only in **Workers KV**. The main module (`src/index.ts`) exports only the
   `default`: the runtime treats every named export as an entrypoint and rejects constants (found while testing
   with `wrangler dev`).
2. **OAuth 2.1 with `@cloudflare/workers-oauth-provider`** (DCR, PKCE S256, tokens and grants in the `OAUTH_KV`
   KV), instead of Canvas's sealed stateless OAuth. Reasons: KV is already required here; the library provides
   single-use codes, refresh token rotation and revocation, and consent helpers against _confused deputy_
   (single-use handle and `state` bound to the browser by a `__Host-` cookie, frameless page). Dynamic
   registration only accepts redirects to `claude.ai`, `claude.com` or `localhost` (`isAllowedRedirect()`,
   reused from ADR 0009).
3. **Owner login through Google with an allowlist.** `/authorize` shows per-client consent (remembered for 30
   days in a cookie signed with `CONSENT_SECRET`), goes to Google with only `openid email` and, on return,
   validates the `id_token` (RS256 signature against Google's JWKS, issuer, audience, expiry, `nonce`, verified
   email). An email outside `ALLOWED_EMAILS` gets **403** and no code.
4. **Separate account linking** at `/accounts/link`: Google with `gmail.readonly` + `openid email`,
   `access_type=offline` and `prompt=consent`, a single-use `state` (prefix `link.`) stored in KV only as a hash
   and bound to the browser by the `__Host-gmail-link` cookie, PKCE S256 and `nonce`. Only an allowlisted email
   with a valid `id_token` and the Gmail scope granted stores the refresh token. A single `/google/callback`
   redirect serves both flows (the library's `state` never contains a dot).
5. **Refresh token encrypted** with AES-256-GCM (`sealPayload()` from `src/remote/seal.ts`, key `TOKEN_ENC_KEY`),
   with the email inside the seal and checked on read. Access tokens live only in isolate memory until 1 min
   before they expire. `invalid_grant` marks the account as revoked and the tool asks for a new link.
6. **Read-only tools** with `account` (`all` where it makes sense), ids validated against path injection,
   bounded responses (20,000 characters per message, 60,000 per thread, attachments up to 5 MB and 50,000
   characters) and an untrusted-content notice in the descriptions and in every result (prompt injection).
   `get_attachment_text` reads PDF (`src/core/pdf.ts`, no dependency), Word, HTML and text, detecting the type
   from the bytes, because Gmail's `attachmentId` changes on every read.
7. **Per-session limit** with the Workers rate limiting binding (120 req/min per grant): a counter at the edge,
   no KV writes.
8. **Google Cloud "In production"** (External app, unverified, personal use) so the refresh token does not
   expire after 7 days; Web client with redirect `https://<worker>/google/callback`.
9. **Tests in Node, not in `@cloudflare/vitest-pool-workers`:** its current version requires Vitest 4 and the
   repository uses Vitest 5. The OAuth library runs in tests with `cloudflare:workers` swapped for a stand-in
   (alias in `vitest.config.ts`), in-memory KV and a fake Google with real RSA keys; the real runtime is checked
   with `wrangler dev`. The Workers types the library uses live in a minimal `.d.ts` (`workers-env.d.ts`),
   because `@cloudflare/workers-types` clashes with `@types/node` in the single `tsconfig`.

## Alternatives considered

| Alternative                                  | Why not                                                                                             |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| AnythingMCP on a Cloudflare Container        | Container cold start, external Postgres and continuous cost; breaks "nothing running continuously". |
| `McpAgent` (stateful Durable Object)         | No tool needs a session; a DO adds cost and complexity for no gain.                                 |
| Canvas's sealed stateless OAuth (ADR 0009)   | No revocation or single-use codes; KV is already needed for the refresh tokens.                     |
| Use the Claude login to link the account     | Would mix the owner's identity with each Gmail account; separate linking keeps the second optional. |
| Store the refresh token in the grant `props` | Every Claude reconnect would lose the link; accounts apply to every session.                        |
| PDF library (pdf.js/unpdf)                   | ~1 MB more in the bundle and high CPU per request; receipts are simple text PDFs.                   |
| `@cloudflare/vitest-pool-workers`            | Requires Vitest 4; downgrading the whole repository for this one package is not worth it.           |

## Consequences

- Positive: both accounts on claude.ai, in Cowork and on mobile; no idle process; cost within the plan (a few
  KV writes per login/link); revocable tokens; secrets only in `wrangler secret`.
- Negative / accepted costs: the unverified Google app shows a warning at login (personal use); changing
  `TOKEN_ENC_KEY` means linking the accounts again; scanned PDFs or PDFs with fonts lacking ToUnicode have no
  text; manual deploy (ADR 0010); new runtime dependency (`@cloudflare/workers-oauth-provider`).
- Docs that change: ARCHITECTURE (connector, services, dependency), STRUCTURE (`connectors/gmail/`), PROCESSES
  (P10–P12), WORKFLOW and CLAUDE.md (`gmail:dev`, `gmail:deploy`, `gmail` scope), UI (Gmail pages), connector
  README, CHANGELOG and ROADMAP.
