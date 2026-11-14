# 0015 — Personal WhatsApp on Cloudflare Workers + Containers, on demand

- **Status:** Accepted
- **Date:** 2026-11-14
- **Related:** F3.1, F3.4, ADR 0009, ADR 0010, ADR 0014

## Context

The owner wants Claude (web, app, Cowork, Claude Code) to read their **personal** WhatsApp. There is no official
API for personal accounts: the way in is a "linked device" client such as
[whatsmeow](https://github.com/tulir/whatsmeow) (Go, MPL-2.0), which needs a process with an open WebSocket and
local state (Signal keys). Constraints:

- **Self-host** template: each person publishes on their own Cloudflare account; never a multi-tenant service.
- **Nothing on without use:** the container only starts on a call; no keep-alive, polling, own alarm or cron by
  default. The owner has Workers Paid (US$ 5/month, with Containers).
- The container disk is ephemeral; the session and history must survive, and two instances must never use the
  same session (WhatsApp drops one of them and the keys diverge).
- Message content is written by third parties: prompt injection risk.

## Decision

1. **Worker (TypeScript)** reuses `src/remote/` (stateless OAuth 2.1, ADR 0009) with a new **delegated login**
   mode: `/authorize` sends the browser to **GitHub** (the owner's OAuth App, `user:email` scope) and only accepts
   a verified email from `ALLOWED_EMAILS`; the secret sealed in the tokens is that email, rechecked on every
   `/mcp`. GitHub instead of Google: anyone publishing a template on Cloudflare has a GitHub account, the OAuth
   App is free and needs no JWT validation (we read `/user/emails` with the single-use token).
2. **Container (Go + whatsmeow)** with an **internal** HTTP API (`bridge/API.md`), authenticated by
   `BRIDGE_TOKEN`. The Worker talks to it through **a single Durable Object** (`WhatsAppBridge`, fixed name
   `owner`, `Container` class from `@cloudflare/containers`) and `max_instances = 1`: single instance = single
   session.
3. **On demand:** `sleepAfter` = `SLEEP_AFTER` (default `5m`); before sleeping (`onActivityExpired`) the DO saves
   a snapshot and stops the container. No alarm of ours; the cron (`SYNC_CRON`) exists, but off and documented.
4. **Persistence:** local SQLite in the container (whatsmeow's `session.db` + `messages.db`) and an **encrypted
   snapshot in R2**: the bridge runs `VACUUM INTO`, packs it into a tar and encrypts it in blocks (`WAS1` format:
   HKDF-SHA256 per snapshot, AES-256-GCM in 64 KiB blocks, authenticated header, last-block flag). The key
   (`SNAPSHOT_KEY`) exists only in the container; the Worker passes the encrypted stream through without loading
   it into memory. Snapshot at most once per minute of use, before sleeping and, best effort, on `SIGTERM` (push
   to `snapshot.internal`, intercepted by the Worker). Restore on boot, before connecting; a snapshot that does
   not open does **not** start over on its own (only through `/pair`). Generations lower than the stored one are
   discarded.
5. **Deadlines:** every tool has a ceiling (`TOOL_TIMEOUT_MS`, 25 s); the sync wait (`SYNC_WAIT_MS`, 8 s) fits in
   it with room to spare, and the result comes out partial with a warning if the sync did not finish.
6. **Pairing** at `/pair`, protected by the same GitHub login (sealed `__Host-` cookie, state + nonce, CSRF and
   `Origin`), with a code (PairPhone) and QR.
7. **Sending** only with `ENABLE_SEND=true`, to `SEND_ALLOWLIST`, one text message at a time, `confirmed_by_user`
   required and an hourly limit in DO storage and again in the bridge. _Updated in F3.4: sending on, optional
   allowlist, quoting and groups — see "Update: sending on" below._
8. **Prompt injection:** every result with third-party content comes under an untrusted-data `notice`, with
   cleaned text (control and bidi characters removed, cut at 2,000 characters) and MCP server instructions
   repeating the rule.
9. **`lite` instance** (1/16 vCPU, 256 MiB, 2 GB). Measurements below.

## Update: sending on (F3.4, 2026-11-14)

At the owner's request, sending becomes part of normal use. Only item 7 changes; the rest of the decision still
holds.

- **On by default:** `ENABLE_SEND = "true"` in `wrangler.toml` (the code default is still `false`: whoever
  deletes the variable has no sending).
- **Optional allowlist:** an empty `SEND_ALLOWLIST` allows any contact or group; with entries (numbers or JIDs),
  it restricts as before, in the Worker and in the bridge.
- **Kept:** `confirmed_by_user: true` on every call, the instruction to show recipient, text and quote and ask
  for confirmation of that exact message, one text message per call and `SEND_MAX_PER_HOUR` in the DO and in the
  bridge.
- **Accepted recipients:** a number with country code or a contact JID (`@s.whatsapp.net`, `@lid`) or group JID
  (`@g.us`). Status (`status@broadcast`), broadcast lists and newsletters are rejected.
- **Groups (done):** whatsmeow's `client.SendMessage` already encrypts for groups (sender key), with no extra code
  in the bridge; the risk is the same as sending to a contact, bounded by the confirmation and the hourly limit.
- **Quoting (done):** `reply_to` with the id of a message **from the same chat** stored in `messages.db`. The
  bridge builds an `ExtendedTextMessage` with `ContextInfo` (`StanzaID`, `Participant` and the quoted text). An
  unknown id returns `404 quoted_not_found` before reserving quota. The quoted preview carries only text (quoted
  media shows its caption); the recipient's WhatsApp finds the original by `StanzaID`.
- **Media (out):** it would require passing the file as base64 in the tool argument (heavy on context and on the
  25 s `TOOL_TIMEOUT_MS` ceiling), checking the file's real type, and generating thumbnail, dimensions and
  duration for WhatsApp to display it properly (`client.Upload` encrypts but generates none of that). More surface
  for sending the wrong file and more signs of an automated client. Left for its own task, if there is real demand
  (ROADMAP F3.5).

## Measurements (Go bridge)

Measured on 2026-11-14 with `/proc/<pid>/status` (VmRSS/VmHWM) and in a container with the `lite` limits
(`--memory=256m --cpus=0.0625`). SQLite driver `modernc.org/sqlite` (pure Go, static binary, no CGO) and
`GOMEMLIMIT` of 160 MiB.

| Scenario                                                  | Result                                                                                                     |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Binary / image (`distroless/static:nonroot`)              | 19.7 MB / 33.5 MB (8.3 MB compressed)                                                                      |
| Idle after `/restore` with no snapshot                    | ~25 MB RSS                                                                                                 |
| 50,000 messages, 500 chats (26 MB `messages.db`), queries | 30 MB RSS; 43 MB peak during `/snapshot`                                                                   |
| Same scenario on `lite` (`docker stats`, with page cache) | 46 MiB                                                                                                     |
| Timings on `lite`                                         | `/restore` 1.1 s; `/chats` 4 ms; search 90 ms (2.7 s scanning everything with no match); `/snapshot` 3.0 s |

The real history sync could not be measured without a connected account; the estimate is an 80–150 MB peak
(whatsmeow decompresses each history block in memory), still below 256 MiB. To be confirmed in F3.2. `lite` fits
with room to spare; `basic` (1 GiB, 4× more billed memory) is not justified.

**Licenses:** whatsmeow and `go.mau.fi/util` are MPL-2.0, but `go.mau.fi/libsignal` (a required dependency) is
**GPL-3.0**. This repository's code stays MIT (compatible); anyone who **distributes** the image or the binary
must comply with GPL-3.0 for the whole. Running it on your own account is not distribution. Details in
`connectors/whatsapp/NOTICE.md`.

## Alternatives considered

| Alternative                                                 | Why not                                                                                                                                                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@cloudflare/workers-oauth-provider` (like Gmail, ADR 0014) | Requires stateful KV (stored tokens and grants); here only the owner's email goes into the tokens and the stateless OAuth in `src/remote/` (ADR 0009) does the job without another binding |
| Google login (OIDC)                                         | Requires validating JWT/JWKS and setting up a consent screen; GitHub is simpler for the template's audience                                                                                |
| D1 as the bridge database                                   | whatsmeow writes a lot in small transactions through `database/sql`; D1 is only reachable through the Worker (HTTP per query), high latency and no driver                                  |
| Durable Object SQLite                                       | Same problem: only the DO can reach it; every bridge query would become a call to the DO                                                                                                   |
| Native container snapshot (beta)                            | Beta, encrypted with Cloudflare's key rather than ours, requires the `durable_object` scheduling policy; does not leave the platform                                                       |
| Encrypt the snapshot in the Worker                          | The Worker would have to load the whole file into memory (128 MB) and know the key; WebCrypto has no streaming GCM                                                                         |
| Always-on container / keep-alive alarms                     | Against the cost rule; ~720 h/month of `lite` exceeds the allowance                                                                                                                        |
| Cron by default                                             | Wakes the container without use; stays opt-in (`SYNC_CRON`)                                                                                                                                |
| WhatsApp Business Cloud API                                 | Does not work for a personal account                                                                                                                                                       |

## Consequences

- Positive: WhatsApp reading in any Claude; typical usage cost within the Workers Paid allowance (README); the
  Worker never sees the backup in clear; whoever uses the template depends on no one.
- Negative / accepted costs: risk of the account being banned (unofficial client, warning in the README); a cold
  start of a few seconds on the first call after sleeping; an abrupt stop without `SIGTERM` loses what changed
  since the last snapshot (WhatsApp resends pending items); the container's network egress is not yet restricted
  to WhatsApp hosts (F3.3); changing `SNAPSHOT_KEY` requires pairing again; a separate Go module with its own test
  cycle (`npm run bridge:test` in `pr:check`).
- Docs that change: ARCHITECTURE (remote-only connector, services), STRUCTURE (WhatsApp folders), PROCESSES
  (P13–P17), UI (`/pair` page), WORKFLOW and CLAUDE.md (`whatsapp:deploy`, `bridge:test`), ROADMAP (Phase 3),
  PRODUCT (Q4, Q8, Q9), GLOSSARY, `.env.example`, the connector's README and NOTICE.
