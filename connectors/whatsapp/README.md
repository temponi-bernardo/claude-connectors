# Personal WhatsApp in Claude (`whatsapp`)

**Remote** MCP connector that lets Claude (claude.ai, app, Cowork and Claude Code) read your **personal**
WhatsApp (not Business): chats, messages, search, contacts and media, and **send** text to any contact or group —
one message at a time, always with your explicit confirmation and with an hourly limit.

It is a **self-host template**: each person deploys it to **their own Cloudflare account** and pairs **their own
number**. There is no central server or third-party hosted service. Decisions in
[ADR 0015](../../docs/adr/0015-whatsapp-on-cloudflare-containers.md).

> ⚠️ WhatsApp has no official API for personal accounts. This connector uses
> [whatsmeow](https://github.com/tulir/whatsmeow), which connects as a "linked device" (like WhatsApp Web). This
> is not authorized by Meta and could, in theory, get the account banned. Use it at your own risk, only on your
> own account, and avoid automated sending.

## How it works

```text
Claude ──OAuth 2.1 + MCP (HTTPS)──▶ Worker ──▶ Durable Object "owner" ──▶ Container (Go + whatsmeow)
                                       │              │  restore/snapshot        │  local SQLite
                                       │              └──────────▶ R2 (AES-256-GCM encrypted backup)
                                       └─ /pair (owner's GitHub login)          └─ WhatsApp WebSocket
```

- **On demand:** the container only starts when a tool call arrives (or you open `/pair`) and sleeps after
  `SLEEP_AFTER` (default **5 min**) without use. No keep-alive, polling, custom alarm or Cron Trigger.
- **Persistence:** the container's disk is wiped when it sleeps. The WhatsApp session and the message database
  become an encrypted snapshot in R2 (at most one per minute of use, when the session changes — paired,
  connected or logged out —, and always before sleeping or shutting down) and are restored on boot. So the
  pairing survives deploys and restarts.
- **Single session:** a single Durable Object (fixed name `owner`) and `max_instances = 1`: two bridges never run
  the same number at the same time. Snapshots with a lower generation than the stored one are discarded.
- **Deadlines:** every tool has a total ceiling (`TOOL_TIMEOUT_MS`, 25 s). Before reading, it waits up to
  `SYNC_WAIT_MS` (8 s) for pending sync; if that is not enough, it answers with what it has and a partial-result
  warning.

## Tools

| Tool              | Does                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `whatsapp_status` | Connection, last event, whether sync is complete, whether pairing is needed (waits for the reconnect after idling) |
| `list_chats`      | Chats (most recent first) with a preview of the last message; filter and paging                                    |
| `get_messages`    | Messages in a chat, paged with `before`                                                                            |
| `search_messages` | Search in the text of stored messages, optionally within one chat                                                  |
| `search_contacts` | Contacts by name or number                                                                                         |
| `get_media`       | Image, audio or document from a message (up to `MAX_MEDIA_BYTES`, 5 MB)                                            |
| `send_message`    | One text message to a contact or group, optionally quoting another                                                 |

Dates in ISO 8601 with time zone (`TIMEZONE`, default `America/Sao_Paulo`). Compact answers, with the warning that
message content is untrusted third-party data.

## Guided setup

With the plugin installed, type **`/setup-whatsapp`** in the chat. Claude checks whether your server answers,
guides the deploy (if missing), connects Claude to your `/mcp`, walks you through pairing at `/pair` and runs a
test.

Everyday commands, once set up:

- **`/whatsapp-summary`** — what happened in chats and groups over a period.
- **`/whatsapp-pending`** — chats waiting for your reply.
- **`/search-whatsapp`** — address, PIX key, link, document or media in the messages.

## Deploy (once)

**Cloud deploy (recommended, this is how it is deployed):** Cloudflare's Workers Builds builds the image and
deploys it, with no Docker on your machine. In the dashboard: Workers & Pages → Create → **Continue with GitHub**
→ this repository, named `whatsapp-remote`, deploy command
`npx wrangler deploy --config connectors/whatsapp/wrangler.toml`, root `/`, preview builds off. Under
Settings → Builds, keep production on `main` and the _build watch paths_ `connectors/whatsapp/*`, `src/remote/*`,
`src/mcp/*`, `src/core/*` and `package-lock.json`: only merges that touch WhatsApp deploy (and restart the
container). Steps 3, 5 and 6 below still apply (bucket, OAuth App and secrets via `wrangler secret put`).

**Local deploy (alternative):**

Prerequisites: a Cloudflare account with **Workers Paid** (US$ 5/month, includes Containers), Node 22+, Docker
running (`wrangler` builds the bridge image) and a GitHub account.

1. **Clone** (or fork) and install: `git clone https://github.com/temponi-bernardo/claude-connectors && cd claude-connectors && npm ci`.
2. **Authenticate wrangler:** `npx wrangler login` (or `CLOUDFLARE_API_TOKEN` with Workers, Containers and R2 permissions).
3. **R2 bucket** for the backups: `npx wrangler r2 bucket create whatsapp-snapshots`.
4. **First deploy** (to learn the address): `npm run whatsapp:deploy`. Note the URL
   `https://whatsapp-remote.<your-account>.workers.dev`. Until the secrets exist, it answers 500 explaining what
   is missing.
5. **GitHub OAuth App** (owner login): GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
   - Homepage URL: `https://whatsapp-remote.<your-account>.workers.dev`
   - Redirect URIs (both, no wildcard): `https://whatsapp-remote.<your-account>.workers.dev/oauth/callback` (Claude
     login) and `https://whatsapp-remote.<your-account>.workers.dev/oauth/callback/pair` (`/pair` page)
   - Generate a _client secret_.
6. **Secrets** (each command asks for the value; `--config connectors/whatsapp/wrangler.toml` on all of them):

   ```sh
   C="--config connectors/whatsapp/wrangler.toml"
   node -e "console.log(crypto.randomBytes(32).toString('base64'))" | npx wrangler secret put SEAL_KEY $C
   node -e "console.log(crypto.randomBytes(32).toString('base64'))" | npx wrangler secret put SNAPSHOT_KEY $C
   node -e "console.log(crypto.randomBytes(32).toString('hex'))"    | npx wrangler secret put BRIDGE_TOKEN $C
   npx wrangler secret put GITHUB_CLIENT_ID $C
   npx wrangler secret put GITHUB_CLIENT_SECRET $C
   npx wrangler secret put ALLOWED_EMAILS $C   # your verified GitHub email (comma-separated for more than one)
   ```

   Keep the `SNAPSHOT_KEY` in a password manager: without it the backup cannot be opened (and changing it forces
   you to pair again).

7. **Deploy again:** `npm run whatsapp:deploy`.

## Pair the number

1. Open `https://whatsapp-remote.<your-account>.workers.dev/pair` and sign in with GitHub (only emails in
   `ALLOWED_EMAILS` get through). The first visit wakes the container (a few seconds).
2. Type your number with country code (e.g. `5531999999999`) and click **Generate pairing code**.
3. On your phone: WhatsApp → **Linked devices** → **Link a device** → **Link with phone number instead** and
   type the code. Alternative: **Show QR** and scan the QR code.
4. The page refreshes on its own; when it shows "Connected", recent history starts arriving (up to
   `HISTORY_DAYS`, 90 days).

On the same page: **Unlink this device** (logout) and **Start over**
(archives the backup in R2 and asks for pairing again; use it if you change the `SNAPSHOT_KEY` or the
backup gets corrupted).

## Connect to Claude

- **claude.ai / app / Cowork:** Settings → Connectors → **Add custom connector** →
  `https://whatsapp-remote.<your-account>.workers.dev/mcp`. Claude opens the GitHub login; only the owner gets
  in. It works everywhere: your account's connector shows up on claude.ai, in the app, on the phone, in Cowork
  and in Claude Code (signed in to the same account).
- **Claude Code without a claude.ai account:**
  `claude mcp add --transport http whatsapp https://whatsapp-remote.<your-account>.workers.dev/mcp`.
- **Marketplace plugin** (optional): brings only the skills (`/setup-whatsapp`, `/whatsapp-summary` etc.),
  **without** a bundled server, because each person has their own. Install it and run `/setup-whatsapp`, which
  connects yours.

  ```text
  /plugin install whatsapp --marketplace temponi-bernardo/claude-connectors
  ```

  Why the plugin does not ask for the URL: a `${user_config.*}` field in `.mcp.json` only exists on the computer
  where it was filled in; the plugin installed by the organization on claude.ai ends up with another URL and the
  **Connect** button rejects the login before opening GitHub. `npm run build` rejects that format (ADR 0018).

Access lasts as long as Claude renews the token (30-day refresh). Removing your email from `ALLOWED_EMAILS`
revokes it immediately (`/mcp` starts answering 403).

## Configuration (`[vars]` in `wrangler.toml`)

| Variable            | Default             | Purpose                                                                        |
| ------------------- | ------------------- | ------------------------------------------------------------------------------ |
| `SLEEP_AFTER`       | `5m`                | After this long without use, saves the backup and stops the container (30s–1h) |
| `TOOL_TIMEOUT_MS`   | `25000`             | End-to-end ceiling for each tool                                               |
| `SYNC_WAIT_MS`      | `8000`              | How long to wait for pending sync before answering partially                   |
| `TIMEZONE`          | `America/Sao_Paulo` | Time zone for dates                                                            |
| `HISTORY_DAYS`      | `90`                | History kept in the initial sync                                               |
| `MAX_MEDIA_BYTES`   | `5242880`           | `get_media` limit                                                              |
| `ENABLE_SEND`       | `true`              | Enables `send_message` (`"false"` turns it off for good)                       |
| `SEND_ALLOWLIST`    | empty               | Optional: restricts sending to numbers or JIDs; empty = anyone                 |
| `SEND_MAX_PER_HOUR` | `10`                | Hard limit of sends per hour (Worker and bridge)                               |
| `SYNC_CRON`         | empty               | Optional periodic sync (see below)                                             |
| `PUBLIC_URL`        | —                   | Custom domain; without it `*.workers.dev` is used                              |

### Sending

On by default in `wrangler.toml` (`ENABLE_SEND = "true"`), to **any contact or group**. Safeguards:

- **Confirmation for every message:** the tool requires `confirmed_by_user: true` and tells the model to show
  the recipient, text and quoted message and ask you to confirm that exact message before each send.
- **Hourly limit** (`SEND_MAX_PER_HOUR`, 10): stored in the Durable Object and in the bridge; failed attempts
  count too.
- **One text message per call**, no bulk sending. Recipient only as a number (country code + number) or a
  contact JID (`@s.whatsapp.net`, `@lid`) or group JID (`@g.us`, from `list_chats`); status and broadcast lists
  are rejected.
- **Optional allowlist:** with `SEND_ALLOWLIST = "5531999999999,120363000000000001@g.us"`, only those recipients
  (checked in the Worker and in the bridge). Empty, anyone goes.

**Reply with a quote** (`reply_to_message_id`): the id of a message from the **same chat**, as `get_messages`
returns it. The bridge looks the message up in the local database and the reply goes out quoted; an unknown id
is rejected without using up the limit.

**Out, for now:** sending media (image, audio, document). It would require passing the file as base64 inside the
tool call (heavy on context and on the 25 s ceiling), validating the file's real type and generating a thumbnail
and dimensions for WhatsApp to display it properly — more risk of sending the wrong file and of a ban. Details in
ADR 0015.

### Periodic sync (optional, off)

Without it, messages that arrive while the container sleeps wait in WhatsApp's queue and come in the next time
you use the connector. If you go weeks without using it, the queue may expire and that period's history never
arrives. To avoid this, enable a cron: put **the same expression** in `SYNC_CRON` and in `[triggers] crons`, for
example `"17 */6 * * *"` (every 6 h). Each run wakes the bridge, waits up to 20 s for the sync, saves the backup
and lets the container sleep after `SLEEP_AFTER`. Cost: 4 runs/day × ~6 min ≈ 12 h/month of a `lite` container
≈ 3 GiB-h of memory and 24 GB-h of disk, within the free allowance (see below).

## Estimated cost

Workers Paid allowance (US$ 5/month) for Containers: **25 GiB-h of memory, 375 vCPU-min, 200 GB-h of disk**;
above that, US$ 0.0000025/GiB-s, US$ 0.000020/vCPU-s and US$ 0.00000007/GB-s. Memory and disk are billed as
provisioned while the container is on; CPU only for actual use. The `lite` instance has 256 MiB, 2 GB and
1/16 vCPU.

**Typical use: 20 sessions/day of 5–10 min.** Each session keeps the container on during use + 5 min of
`SLEEP_AFTER`, i.e. 10–15 min.

| Item                       | 10 min/session (100 h/month)                                                               | 15 min/session (150 h/month)      |
| -------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------- |
| Memory (0.25 GiB)          | 25 GiB-h → within the allowance                                                            | 37.5 GiB-h → 12.5 over ≈ US$ 0.11 |
| Disk (2 GB)                | 200 GB-h → within the allowance                                                            | 300 GB-h → 100 over ≈ US$ 0.03    |
| CPU (~20% average use)     | ~75 vCPU-min → within                                                                      | ~113 vCPU-min → within            |
| Durable Object, Worker, R2 | within the allowances (DO: ~45–70k GB-s of 400k; R2: < 1 GB and a few thousand operations) | same                              |
| **Total beyond the US$ 5** | **≈ US$ 0.00**                                                                             | **≈ US$ 0.14/month**              |

Container network egress: 1 TB/month included in North America and Europe (500 GB elsewhere); WhatsApp uses a
few MB per session. To cap spending, use the Workers _spending limit_ and lower `SLEEP_AFTER` (e.g. `2m`).

## Security

- **Prompt injection:** messages, names and captions are third-party data. Every answer comes with a `notice`
  saying not to follow instructions contained in them; text is sanitized (control and bidi direction characters
  removed, cut at 2,000 characters) and the MCP server instructions repeat the rule.
- **Access:** OAuth 2.1 with PKCE and dynamic registration (redirects only to `claude.ai`, `claude.com` and
  `localhost`), GitHub login with a **verified** email in `ALLOWED_EMAILS`; the GitHub token is discarded
  immediately. The connector's tokens are sealed with AES-256-GCM (`SEAL_KEY`) and the server stores no session
  state.
- **`/pair`:** session in a sealed `__Host-` cookie (HttpOnly, Secure, SameSite=Lax, 30 min), state + nonce on
  login, anti-CSRF token and an `Origin` check on every POST, CSP with no scripts and no frames.
- **Bridge:** port only inside the container, `BRIDGE_TOKEN` compared in constant time, parameterized SQL, body
  and time limits, logs without message text or full numbers.
- **Backup:** encrypted in the bridge with chunked AES-256-GCM (HKDF per snapshot, authenticated header):
  truncating, reordering or changing any byte makes the restore fail. The key never goes to R2.
- **Limitations:** whoever controls your Cloudflare account controls the connector (secrets and container). The
  old backup archived by "Start over" stays in R2 until you delete it.

## Development

- Worker (TypeScript): `connectors/whatsapp/src/`, tests with `npm test`; `npm run whatsapp:build` builds the
  bundle without deploying; `npm run whatsapp:dev` runs it locally (needs Docker).
- Bridge (Go 1.26+): `connectors/whatsapp/bridge/`, contract in [`bridge/API.md`](bridge/API.md);
  `npm run bridge:test` runs gofmt, vet and tests.
- Third-party licenses in [NOTICE.md](NOTICE.md). Note: the image includes `go.mau.fi/libsignal` (GPL-3.0); if
  you **distribute** the image or the binary (not just run it on your account), comply with GPL-3.0 for the
  whole.

## Common problems

| Symptom                                   | What to do                                                                                           |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 500 "Invalid Worker configuration"        | A secret is missing: the message says which one                                                      |
| "WhatsApp is not paired"                  | Open `/pair` and pair                                                                                |
| Pairing disappears after a deploy/restart | Check R2 for the `whatsapp/snapshot.was1` object; if missing, look for "Snapshot failed" in the logs |
| "Timed out waiting for WhatsApp"          | Container waking up (first call after sleeping): retry in a few seconds                              |
| "Could not open the encrypted backup"     | `SNAPSHOT_KEY` changed or the backup is corrupted: restore the old key or use "Start over"           |
| GitHub login rejected                     | The email must be verified on GitHub and listed in `ALLOWED_EMAILS`                                  |
| GitHub callback gives a redirect error    | The OAuth App needs both exact URIs: `<url>/oauth/callback` and `<url>/oauth/callback/pair`          |
