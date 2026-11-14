# Connectors Directory listing

Readiness of the Canvas and Gmail remote MCP servers for Anthropic's Connectors Directory (roadmap F4.7). Nothing
here has been submitted: this page holds the listing drafts, the OAuth compliance checklist with the tests that
prove each item, what was checked against the live servers, and what the owner still has to do by hand.

WhatsApp is not a candidate: it is a self-host template (each person runs their own server, ADR 0015), so there is
no single public URL to list.

## Listing drafts

Shared fields for both connectors:

| Field           | Value                                                               |
| --------------- | ------------------------------------------------------------------- |
| Publisher       | Bernardo Temponi                                                    |
| Support contact | <https://github.com/temponi-bernardo/claude-connectors/issues>      |
| Privacy policy  | <https://temponi-bernardo.github.io/claude-connectors/privacy.html> |
| Terms           | <https://temponi-bernardo.github.io/claude-connectors/terms.html>   |
| Authentication  | OAuth 2.1 with PKCE (S256) and dynamic client registration          |
| Transport       | Streamable HTTP, stateless, JSON responses                          |

### Canvas PUC Minas

| Field              | Value (limit)                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| Server URL         | `https://canvas-puc-remote.bftemponi.workers.dev/mcp`                                            |
| Name (≤ 100)       | Canvas PUC Minas                                                                                 |
| One-liner (≤ 200)  | Assignments, deadlines, grades, announcements, modules and files from PUC Minas Canvas in Claude |
| Categories (1–5)   | Education, Productivity                                                                          |
| Documentation      | <https://github.com/temponi-bernardo/claude-connectors/tree/main/connectors/canvas-puc>          |
| Data the user sees | Only what their own Canvas account can already see                                               |

Description (≤ 2000 characters):

> Connect Claude to your PUC Minas Canvas account. Ask what is due this week, read an assignment with its rubric
> and attachments, check grades, catch up on announcements, browse course modules, pages and files, read and reply
> to discussions, and see your calendar. Claude can also submit a text assignment or post a discussion reply, and
> asks for your confirmation before each submission.
>
> How sign-in works: the first time you connect, the authorization page asks for a Canvas access token (Account →
> Settings → New access token). The token is checked against Canvas and then travels only encrypted (AES-256-GCM)
> inside the tokens handed to Claude: the server has no database and stores neither the token nor Canvas data.
> While you keep using the connector, the server extends the token's expiry, at most once a day, so you do not
> have to reconnect every month. If you delete the token in Canvas, the next refresh fails and Claude asks you to
> connect again.
>
> The Canvas address is fixed on the server (pucminas.instructure.com), so the connector cannot be pointed at
> another site. Open source under the MIT license.

### Gmail (multi-account)

| Field              | Value (limit)                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| Server URL         | `https://gmail-remote.bftemponi.workers.dev/mcp`                                                            |
| Name (≤ 100)       | Gmail (multi-account)                                                                                       |
| One-liner (≤ 200)  | Search, read, send and organize several Gmail accounts from one connector, with confirmation before sending |
| Categories (1–5)   | Productivity, Communication                                                                                 |
| Documentation      | <https://github.com/temponi-bernardo/claude-connectors/tree/main/connectors/gmail>                          |
| Google scopes      | `openid`, `email`, `https://www.googleapis.com/auth/gmail.modify`                                           |
| Data the user sees | Only the Gmail accounts they linked themselves                                                              |

Description (≤ 2000 characters):

> One connector for all your Gmail accounts. Search across every linked account at once, read threads and
> messages, extract the text of attachments, and, when you ask, send, reply, forward, manage drafts and labels,
> archive and move to trash. Permanent deletion is not possible: the connector only asks Google for the
> gmail.modify scope. Claude shows the exact recipients and content and waits for your explicit confirmation
> before sending, replying, forwarding, sending a draft, trashing or deleting a draft. Email content is treated as
> untrusted data: instructions inside an email are never followed.
>
> How sign-in works: connect and sign in with Google; that account is linked automatically. Ask Claude for a link
> to add more accounts (up to 10). Each person only ever sees the accounts they linked. Google refresh tokens are
> stored encrypted with AES-256-GCM in Cloudflare Workers KV; email content is never stored. Unlinking an account
> deletes its token and revokes access at Google.
>
> Google API data use follows the Google API Services User Data Policy, including the Limited Use requirements.
> Open source under the MIT license.

## OAuth compliance checklist

Canvas (and WhatsApp) use the shared stateless OAuth server in `src/remote/` (ADR 0009); Gmail uses
`@cloudflare/workers-oauth-provider` (ADR 0014), so its items are tested against the configured provider.

| Requirement                                                                     | Canvas (`src/remote/`)                                       | Gmail (`connectors/gmail/`)                                                                         | Result |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ------ |
| PKCE S256 required; `plain` and missing `code_challenge` rejected               | `readCodeChallenge`; test "PKCE: rejects plain…"             | library (`codeChallengeMethods: ['S256']`, public clients must use PKCE); test "PKCE: plain or…"    | Pass   |
| Unauthenticated `/mcp` → 401 with `WWW-Authenticate: Bearer resource_metadata=` | `mcpUnauthorizedResponse`; test "discovery: 401 points…"     | library; test "discovery: 401 points…"                                                              | Pass   |
| Protected resource metadata `resource` equals the server URL (`…/mcp`)          | `protectedResourceMetadata`; same test                       | `createGmailProvider`; same test                                                                    | Pass   |
| Authorization server metadata discoverable                                      | `authorizationServerMetadata`; same test                     | library; same test                                                                                  | Pass   |
| DCR accepts `https://claude.ai/api/mcp/auth_callback`                           | `registerClient`; test "dynamic client registration…"        | `checkClientRegistration`; test "dynamic client registration…"                                      | Pass   |
| Token endpoint accepts `application/x-www-form-urlencoded`                      | `handleToken`; test "token endpoint takes form bodies…"      | library (form only, JSON refused with a reason); test "token endpoint takes form bodies…"           | Pass   |
| Dead or invalid refresh token → `invalid_grant`                                 | `redeemRefreshToken`, `handleToken`; tests above + "revoked" | library; test "token endpoint answers invalid_grant…"                                               | Fixed  |
| Tokens never accepted in the query string                                       | `readAccessSecret` (header only); test "never accepts…"      | library (header only); test "never accepts…"                                                        | Pass   |
| Errors are actionable                                                           | `error` + `error_description` saying what to do; test        | library descriptions; sign-in pages explain the next step (`authorizationErrorResponse`)            | Pass   |
| Resource name matches what the connector does                                   | —                                                            | `resource_name` was "Gmail (read-only, multi-account)" after F3.3 made it read-write; now corrected | Fixed  |

Tests live in the `Connectors Directory requirements` blocks of `src/remote/handler.test.ts` and
`connectors/gmail/src/worker.test.ts`; the Canvas revocation logic is covered in
`connectors/canvas-puc/src/remote.test.ts` (`isCanvasTokenAlive`, `renewCanvasSecret`).

What was fixed:

- **Canvas, revoked token on refresh.** The refresh token seals the Canvas token, so a refresh used to succeed
  even after the user deleted that token in Canvas, and every tool call then failed. Now each refresh first asks
  Canvas `/users/self`; a 401 makes the connector answer `revoked` and the token endpoint return `invalid_grant`,
  which makes Claude ask the user to connect again. Network errors and 5xx still count as alive, so a Canvas
  outage never logs anyone out.
- **Gmail `resource_name`.** Corrected to "Gmail (multi-account)".

Notes:

- The `resource_metadata` URL is the path-suffixed form from RFC 9728
  (`/.well-known/oauth-protected-resource/mcp`). Both servers also serve the same document at
  `/.well-known/oauth-protected-resource`.
- Canvas's 401 carries `error="invalid_token"` even when no token was sent; RFC 6750 allows omitting it. Claude
  and the Inspector handle both.
- Canvas OAuth error descriptions are still in Portuguese; they are translated with the rest of the error
  messages in the F4 English tasks (ADR 0021).

## Checks against the live servers

Run on 2026-11-14 against the deployed servers (before this change was deployed).

| Check                                                                         | Canvas                          | Gmail                                                                |
| ----------------------------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------- |
| `POST /mcp` without token                                                     | 401 + `resource_metadata`       | 401 + `resource_metadata`                                            |
| Protected resource metadata `resource`                                        | `…/mcp`                         | `…/mcp` (`resource_name` still says read-only until the next deploy) |
| Authorization server metadata (`code_challenge_methods_supported`)            | `["S256"]`                      | `["S256"]`                                                           |
| DCR with the claude.ai callback                                               | 201                             | 201                                                                  |
| `/authorize` with `plain` / without PKCE                                      | 400 page, no redirect           | 302 back to claude.ai with `error=invalid_request`, never to Google  |
| `/token` with a bogus refresh token (form body)                               | 400 `invalid_grant`             | 400 `invalid_grant`                                                  |
| `POST /mcp?access_token=…`                                                    | 401                             | 401                                                                  |
| MCP Inspector CLI 2.13.0 (`--cli <url> --transport http --method tools/list`) | Detects OAuth (`auth_required`) | Detects OAuth (`auth_required`)                                      |

Not verified here: the Inspector's interactive OAuth flow and an authenticated `tools/list`, which need a TTY,
a browser and the owner's Canvas token or Google account. The owner should run
`npx @modelcontextprotocol/inspector --cli <url> --transport http --method tools/list` in a terminal, finish the
login, and also try the UI (`npx @modelcontextprotocol/inspector`) for `tools/call`.

## Remaining manual steps before submitting

1. Deploy both servers (`npm run worker:deploy`, `npm run gmail:deploy`) so the revocation fix and the new
   `resource_name` are live, and rerun the checks above.
2. Tool names are English and every tool has a `title` plus `readOnlyHint` or an explicit `destructiveHint`
   (enforced by the type in `src/mcp/annotations.ts`, F4.4). After deploying, confirm it in the Inspector.
3. Run the authenticated Inspector session described above for each server and connect each one in claude.ai
   (web) and the Claude desktop app as a custom connector, end to end.
4. Gmail: Google OAuth verification of the app for the restricted `gmail.modify` scope (including the security
   assessment) must be complete, or the consent screen shows "unverified app" and is limited to test users.
5. Provide a test account for reviewers: a Canvas sandbox token (or a PUC Minas test account) and a Google test
   account; decide how to share the credentials privately.
6. ~~Translate the public site to English (ADR 0021)~~: done; the policy is at `privacy.html` and the terms at
   `terms.html` (the old Portuguese addresses redirect).
7. Fill in Anthropic's submission form with the drafts above and submit.
