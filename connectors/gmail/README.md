# Remote Gmail (multiple accounts, reading and management)

Remote MCP connector that lets Claude (claude.ai, app, Cowork and Claude Code) **read and manage** one or more
Gmail accounts of whoever installs it: search, read, send, reply, forward, drafts, labels, archive and trash.
There is no permanent deletion, and Claude asks for confirmation before sending or deleting. It is public and
multi-user: each person signs in with their own Google account and only sees the accounts they linked
themselves. It runs on Cloudflare Workers **only when a request arrives**: no Containers, Cron Triggers, alarms
or polling, so being idle costs nothing. State lives in Workers KV. Decisions in
[ADR 0014](../../docs/adr/0014-on-demand-remote-gmail-on-workers.md),
[ADR 0016](../../docs/adr/0016-public-multi-user-gmail.md) and
[ADR 0019](../../docs/adr/0019-full-gmail-management.md) (management).

## For users

The easiest way: type **`/setup-gmail`** in the chat. Claude checks the connection, shows the accounts, links
or unlinks accounts and runs a test. The manual steps are:

1. In Claude, add the `temponi-bernardo/claude-connectors` marketplace and install the **`gmail`** plugin (or
   add `https://gmail-remote.bftemponi.workers.dev/mcp` under Settings → Connectors → Add custom connector).
2. When connecting, click **Allow** and sign in with your Google account, checking the permission to **read,
   compose and send email** (manage Gmail). That account is linked right away.
3. For more accounts, ask Claude: _"link another Gmail account"_. It generates a single-use link (valid for 10
   minutes); open it in the browser and sign in with the other account.
4. Ask as usual: _"find the FL Cloud receipt in all my accounts"_, _"reply to Ana saying I'm in"_, _"archive
   today's promotions"_. Before sending, forwarding, trashing or deleting a draft, Claude shows what it will do
   and waits for your "yes".
5. To remove an account: _"unlink account X"_. The connector deletes the token and revokes access at Google.

**Account linked before management existed:** accounts linked when the connector only read keep reading, but
the write tools answer _"Account "X" was linked read-only… use link_account and sign in with it again"_, and
`list_accounts` shows `write_access: false`. Ask for a link (`link_account`) and sign in with the **same**
account: the new access replaces the old one, no unlinking needed.

Until the Google app is verified, the sign-in screen shows the **"Google hasn't verified this app"** warning:
click **Advanced → Go to**. Google limits unverified apps using Gmail to 100 users.

## Plugin commands

- **`/setup-gmail`** — guided setup (connection, accounts and test).
- **`/triage-inbox`** — the inbox of every account, by priority.
- **`/find-document`** — bills, invoices, receipts and contracts, with the attachment's data.
- **`/summarize-thread`** — summary of a thread, open items and a draft reply.

You can also ask in natural language ("any email I need to answer?"): Claude picks the right skill.

## Tools

| Tool                  | Parameters                                                 | Notes                                          |
| --------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| `list_accounts`       | —                                                          | Your linked accounts and token status          |
| `link_account`        | —                                                          | Single-use link to link another account        |
| `unlink_account`      | `account`                                                  | Deletes the token and revokes access at Google |
| `search_threads`      | `account` (or `all`), `query`, `max_results`, `page_token` | Gmail search syntax; up to 25 per account      |
| `get_thread`          | `account`, `thread_id`, `format` (`text` or `minimal`)     | Plain text (HTML converted), capped body       |
| `get_message`         | `account`, `message_id`                                    | Body, headers and attachment list              |
| `list_labels`         | `account` (or `all`)                                       | System and user labels                         |
| `get_attachment_text` | `account`, `message_id`, `attachment_id`                   | PDF, Word, HTML or text; up to 5 MB; no OCR    |
| `list_drafts`         | `account`, `max_results`                                   | Drafts with id, recipients and subject         |

Write tools (all take `account` for a single account; none accepts `all`):

| Tool              | Parameters                                                               | Notes                                                                   |
| ----------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `send_email`      | `to`, `cc`, `bcc`, `subject`, `body`                                     | Plain text; up to 100 recipients                                        |
| `reply_email`     | `message_id`, `body`                                                     | To the sender (or `Reply-To`), in the same thread, quoting the original |
| `reply_all_email` | `message_id`, `body`                                                     | Sender + To + Cc, without your account and without duplicates           |
| `forward_email`   | `message_id`, `to`, `cc`, `bcc`, `note`                                  | With the original attachments (up to 18 MB in total)                    |
| `create_draft`    | `to`, `cc`, `bcc`, `subject`, `body`, `reply_to_message_id`, `reply_all` | New draft, or a reply in the thread with `reply_to_message_id`          |
| `update_draft`    | `draft_id` + the `create_draft` fields                                   | Replaces the whole content                                              |
| `send_draft`      | `draft_id`                                                               | Sends the draft as is                                                   |
| `delete_draft`    | `draft_id`                                                               | Deletes only the draft                                                  |
| `mark_read`       | `message_ids` and/or `thread_ids`, `read`                                | `read: false` marks as unread                                           |
| `archive`         | `message_ids` and/or `thread_ids`, `archived`                            | Removes from the inbox; `archived: false` moves it back                 |
| `star`            | `message_ids` and/or `thread_ids`, `starred`                             | `starred: false` removes the star                                       |
| `update_labels`   | `message_ids` and/or `thread_ids`, `add_labels`, `remove_labels`         | Labels by id or name (`list_labels`)                                    |
| `trash`           | `message_ids` and/or `thread_ids`                                        | Trash (Gmail empties it after 30 days); no permanent deletion           |
| `untrash`         | `message_ids` and/or `thread_ids`                                        | Restores from the trash                                                 |

Up to 50 messages or 20 threads per organizing call. The tools carry **MCP annotations**: sending, trashing,
editing or deleting a draft and unlinking an account have `destructiveHint: true` (the client asks for
confirmation); organizing is reversible (`destructiveHint: false`); reading has `readOnlyHint: true`. Every tool
also has a `title` (presets in `src/mcp/annotations.ts`). Replies and forwards go out as plain text (the
original's HTML becomes text).

`account` is the alias (the part before the `@`; the full address if two accounts clash) or the email address
itself. Email content is treated as **untrusted data**: descriptions and results warn the model not to follow
instructions that come from an email.

## How it works

| Route                               | Used by             | Does                                                                    |
| ----------------------------------- | ------------------- | ----------------------------------------------------------------------- |
| `/mcp`                              | Claude              | Tools (requires the OAuth token issued by this Worker)                  |
| `/register`, `/authorize`, `/token` | Claude              | OAuth 2.1 with dynamic registration and PKCE (`workers-oauth-provider`) |
| `/accounts/link?ticket=...`         | You, in the browser | Links one more account (link generated by `link_account`)               |
| `/google/callback`                  | Google              | Return from sign-in and linking                                         |

- **User:** the stable id of the sign-in Google account (`sub`). Each user has a KV record (`owner:<sha256>`)
  with their accounts, encrypted with AES-256-GCM (`TOKEN_ENC_KEY`).
- **Cost:** one KV read per tool call; writes only when linking, unlinking and signing in. Google access tokens
  stay only in the isolate's memory.
- **Limits:** 120 req/min per session on `/mcp` and 30 req/min per IP on the public routes (rate limiting
  bindings, no KV).
- **Private mode (optional):** with the `ALLOWED_EMAILS` secret, only the listed addresses get in; everyone
  else gets 403.

## For hosts (Worker owner)

### 1. Google Cloud (once)

1. At [console.cloud.google.com](https://console.cloud.google.com), create a project (e.g. `claude-gmail`).
2. **APIs & Services → Library → Gmail API → Enable.**
3. **Google Auth Platform → Branding:** app name, support email, home page
   `https://temponi-bernardo.github.io/claude-connectors/`, privacy policy
   `https://temponi-bernardo.github.io/claude-connectors/privacy.html` and terms
   `https://temponi-bernardo.github.io/claude-connectors/terms.html`.
4. **Audience:** type **External** → **Publish app** ("In production"). Without this the refresh token expires
   in 7 days.
5. **Data access → Add scopes:** `openid`, `.../auth/userinfo.email` and
   `https://www.googleapis.com/auth/gmail.modify` (read, send, drafts, labels and trash; no permanent deletion).
   If you had `gmail.readonly` registered, you can remove it once the accounts have been linked again.
6. **Clients → Create client → Web application**, with the redirect URI
   `https://gmail-remote.<your-account>.workers.dev/google/callback`. Keep the client ID and secret.
7. To open it to more than 100 people: app **Verification** at Google. `gmail.modify` is a restricted scope and
   requires, besides the review, the annual security assessment (CASA). Until then, personal and invited use
   works.

### 2. Cloudflare

```sh
git pull && npm ci
npx wrangler login

# Copy each printed "id" into connectors/gmail/wrangler.toml (OAUTH_KV and GMAIL_KV)
npx wrangler kv namespace create OAUTH_KV --config connectors/gmail/wrangler.toml
npx wrangler kv namespace create GMAIL_KV --config connectors/gmail/wrangler.toml

npm run gmail:deploy

npx wrangler secret put GOOGLE_CLIENT_ID --config connectors/gmail/wrangler.toml
npx wrangler secret put GOOGLE_CLIENT_SECRET --config connectors/gmail/wrangler.toml
node -e "console.log(crypto.randomBytes(32).toString('base64'))" | npx wrangler secret put TOKEN_ENC_KEY --config connectors/gmail/wrangler.toml
node -e "console.log(crypto.randomBytes(32).toString('base64url'))" | npx wrangler secret put CONSENT_SECRET --config connectors/gmail/wrangler.toml
# Optional (private mode): npx wrangler secret put ALLOWED_EMAILS --config connectors/gmail/wrangler.toml

curl https://gmail-remote.<your-account>.workers.dev/   # answers "ok"
```

Secrets take effect immediately, with no new deploy. If the `workers.dev` subdomain is not `bftemponi`, adjust
the URL in `connectors/gmail/plugin/.mcp.json`. **Keep the `TOKEN_ENC_KEY`:** changing it forces everyone to
link their accounts again.

### 3. Upgrade a Worker that was already live (read-only → management)

1. **Google Cloud:** in the connector's project, **Google Auth Platform → Data access → Add scopes** and add
   `https://www.googleapis.com/auth/gmail.modify`. Save. Without this Google rejects sign-in with the new scope.
2. **Deploy:** `npm run gmail:deploy` (secrets and KV stay the same).
3. **Reconnect the accounts:** each old account shows up in `list_accounts` with `write_access: false`. Ask
   Claude for `link_account` and sign in with the same account, allowing Gmail management. The sign-in account
   can be linked the same way (or reconnect the connector in Claude).

## Development

- `npm run gmail:dev` runs the Worker locally (secrets in `connectors/gmail/.dev.vars`, ignored by git; names
  in `.env.example`).
- Tests: `npm test` (Node + Vitest, with the Gmail API and Google mocked; see ADR 0014).
- Flows: [PROCESSES.md](../../docs/PROCESSES.md) P10–P12 and P18 (writing).

## Security

- No secrets in the repository; everything via `wrangler secret put`.
- Claude OAuth with PKCE S256, per-client consent and redirects limited to `claude.ai`, `claude.com` and
  `localhost`; Google sign-in and linking with a single-use `state`, PKCE, `nonce` and a validated `id_token`
  (RS256 signature, issuer, audience, expiry, `sub` and verified email).
- Per-user isolation: the account record only opens for the `sub` that wrote it; the linking link is single-use,
  valid for 10 minutes and does not reveal the user.
- `__Host-`, `Secure`, `HttpOnly`, `SameSite=Lax` cookies; pages with a strict CSP and no frames.
- Writes only with `gmail.modify` checked before calling Google; emails built in the Worker with validated
  addresses and headers without line breaks (no header injection); no permanent deletion.
- Prompt injection: descriptions, server instructions and results warn the model that email content is
  untrusted and that it must never send, forward or delete because an email asked it to.
- No email content, tokens or addresses in the logs. Privacy policy with Google's Limited Use disclosure in
  [privacy.html](../../docs/privacy.html).
