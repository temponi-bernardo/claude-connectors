# Remote Spotify (your own Spotify app)

Remote MCP connector that lets Claude (claude.ai, app, Cowork and Claude Code) **read and manage the whole Spotify
library** of whoever installs it: search, Liked Songs and playlists in full, editing playlists, follows, history,
top items, playback, and bulk cleanups with a preview, an automatic backup and restore. Each person connects with
**their own Spotify app**, so nobody shares a quota or the 5-user limit of development-mode apps. It runs on
Cloudflare Workers **only when a request arrives**; state lives in Workers KV, encrypted per user. Decision in
[ADR 0033](../../docs/adr/0033-spotify-with-each-users-own-app.md); what the 2026 Web API allows in
[SPOTIFY-API.md](../../docs/SPOTIFY-API.md).

## For users (a new friend, ~5 minutes)

The easiest way: install the plugin and type **`/setup-spotify`**; Claude walks through these steps.

1. **Create your Spotify app** at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard),
   signed in with the Spotify account you will use. **The app owner needs Spotify Premium** (Spotify's rule for
   development-mode apps).
   - **Create app** → any name and description.
   - **Redirect URI**, exactly: `https://spotify-remote.bftemponi.workers.dev/spotify/callback` (the connector page
     shows the address of the Worker you use).
   - Tick **Web API**, accept the terms, **Save**.
   - **Settings** → copy the **Client ID**; **View client secret** → copy it. Never paste them in a chat.
   - Connecting another Spotify account with this app? Add its email under **Settings → User Management**
     (up to 5).
2. **In Claude**: add the `temponi-bernardo/claude-connectors` marketplace and install **`spotify`** (or add
   `https://spotify-remote.bftemponi.workers.dev/mcp` under Settings → Connectors → Add custom connector).
   Click **Connect**.
3. On the connector page, paste the **Client ID** and **Client Secret** → **Continue to Spotify** → **Agree**.
4. Ask: _"keep in my likes only Chris Cornell and electronic music"_, _"split my likes by genre into
   playlists"_, _"make this week's playlist from my likes"_, _"back up my likes"_. Batch changes always come as a
   preview first; nothing changes until you say yes.

**Every 6 months** Spotify ends the authorization: Claude says so; disconnect and connect again (same app,
same credentials). **To leave:** ask Claude to `disconnect` (erases everything the connector stored about you),
then remove the app at [spotify.com/account/apps](https://www.spotify.com/account/apps/).

## Plugin commands

- **`/setup-spotify`** — create your app, connect and test.
- **`/limpar-curtidas`** — keep/remove likes by artist, genre, year or date; duplicates; unavailable tracks.
- **`/organizar-playlists`** — sort, split, merge, dedupe, abandoned playlists, details and cover.
- **`/backup-spotify`** — back up, export (JSON) and restore.
- **`/playlist-da-semana`** — a new playlist with your recent likes (can be a weekly scheduled task).

## Tools

| Group                          | Tools                                                                                                                                                                                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account                        | `connection_status`, `disconnect` (erases your data; `confirm: true`)                                                                                                                                                                                |
| Catalog and listening          | `search` (≤ 10 per type, Spotify's 2026 limit), `get_artist` (genres, latest releases), `currently_playing`, `recently_played`, `top_items`                                                                                                          |
| Library                        | `list_liked_tracks` (date liked, optional genres), `list_saved_albums`, `list_followed_artists`, `save_to_library` / `remove_from_library` (≤ 40 URIs; artist/playlist/user URIs follow/unfollow), `check_library`                                   |
| Playlists                      | `list_my_playlists`, `get_playlist`, `create_playlist`, `create_playlist_from_queries`, `update_playlist_details`, `add_playlist_items`, `remove_playlist_items`, `reorder_playlist_items`, `set_playlist_cover`                                     |
| Smart (preview → `apply_plan`) | `sync_library`, `preview_filter_liked`, `preview_dedupe`, `preview_unavailable`, `preview_copy_liked_to_playlist`, `preview_organize_playlists` (sort/split/merge), `preview_stale_playlists`, `preview_library_change`, `apply_plan`, `cancel_plan` |
| Backups                        | `create_backup`, `list_backups`, `export_backup`, `preview_restore`, `delete_backup`                                                                                                                                                                 |
| Playback (Premium)             | `playback_state`, `list_devices`, `play`, `pause`, `skip`, `seek`, `set_volume`, `set_shuffle`, `set_repeat`, `get_queue`, `add_to_queue`, `transfer_playback`                                                                                       |

Every tool has a `title` and MCP hints: removals, `apply_plan`, `disconnect` and `delete_backup` are
`destructiveHint: true`; reads are `readOnlyHint: true`.

**How batch changes work:** a `preview_*` tool reads what it needs (answering `status: "loading"` while a big
library is read over several calls), stores a **plan** for 10 minutes and answers counts, a sample and a
`plan_id`. `apply_plan` runs it only with that id, **saving a JSON backup first** whenever it removes or rewrites
something; big plans run over several calls (`status: "partial"`) and resume where they stopped. Library writes
go in chunks of 40, playlist writes in chunks of 100 (Spotify's maximums).

**Limits that come from Spotify (2026):** no popularity filter (field removed), genres may be missing (deprecated),
no recommendations or audio features, items only of playlists you own or collaborate on, liked dates cannot be
restored, local files cannot be re-added (such playlists are never rewritten).

## How it works

| Path                                | Caller     | Purpose                                                                                                       |
| ----------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `/mcp`                              | Claude     | Tools (requires the OAuth token issued by this Worker)                                                        |
| `/register`, `/authorize`, `/token` | Claude     | OAuth 2.1 with dynamic registration and PKCE (`workers-oauth-provider`); `/authorize` is the credentials page |
| `/spotify/callback`                 | Spotify    | Return from the user's app authorization (the Redirect URI)                                                   |
| `/tools`                            | Smoke test | Public tool catalog                                                                                           |

- **User:** the Spotify `account_id` (else `id`) answered by `/me` right after the code exchange with the user's
  own app. Each user has a vault in `SPOTIFY_KV`: keys `<type>:sha256(user)[:id]`, values sealed with AES-256-GCM
  (`TOKEN_ENC_KEY`) together with type, user and id.
- **Request budget:** each tool call makes at most `SPOTIFY_CALL_BUDGET` Spotify requests (default 40, fits the
  Workers Free plan's 50 subrequests); on Workers Paid raise it (e.g. 400) so big libraries finish in fewer calls.
- **Rate limits:** `Retry-After` up to 5 s is awaited inside the call; longer waits come back as a clear error.
  120 req/min per session on `/mcp` and 30 req/min per IP on the public routes.

## For hosts (Worker owner) — deploy step by step

Prerequisites: Node 22, a Cloudflare account (Free works), this repository.

```sh
git pull && npm ci
npx wrangler login

# 1. KV namespaces: copy each printed "id" into connectors/spotify/wrangler.toml (OAUTH_KV and SPOTIFY_KV)
npx wrangler kv namespace create OAUTH_KV --config connectors/spotify/wrangler.toml
npx wrangler kv namespace create SPOTIFY_KV --config connectors/spotify/wrangler.toml

# 2. First deploy (creates the Worker)
npm run spotify:deploy

# 3. The encryption key of every user's vault (its own value; keep it safe)
node -e "console.log(crypto.randomBytes(32).toString('base64'))" | npx wrangler secret put TOKEN_ENC_KEY --config connectors/spotify/wrangler.toml

# 4. Check
curl https://spotify-remote.<your-account>.workers.dev/          # "ok"
npm run smoke -- spotify                                        # published tools = tool-contract.json
```

- If your `workers.dev` subdomain is not `bftemponi`, update `connectors/spotify/plugin/.mcp.json` and the
  Redirect URI in `plugin/skills/setup-spotify/SKILL.md`, and commit (through a PR).
- Optional `[vars]` in `wrangler.toml`: `PUBLIC_URL` (custom domain) and `SPOTIFY_CALL_BUDGET`.
- **Keep `TOKEN_ENC_KEY`:** changing it makes every user connect again. The host never needs a Spotify app.
- Commit the KV ids in `wrangler.toml` through a PR (they are not secrets).

## Development

- `npm run spotify:dev` runs the Worker locally (`TOKEN_ENC_KEY` in `connectors/spotify/.dev.vars`, ignored by
  git). Spotify only accepts HTTPS Redirect URIs (or loopback IPs), so test the full sign-in on a deployed
  Worker.
- Tests: `npx vitest run connectors/spotify` — a fake Spotify (no real calls): crypto and isolation, token
  renewal, pagination, 429/401/5xx, preview → apply, resume, backups and the full OAuth flow.
- Flows: [PROCESSES.md](../../docs/PROCESSES.md) P21–P25.

## Security

- Nothing secret in the repository; `TOKEN_ENC_KEY` via `wrangler secret put`. Users' Client Secrets and refresh
  tokens exist only sealed in their vault and, for 15 minutes during sign-in, sealed in the OAuth transaction;
  never in URLs, logs or error messages.
- Claude OAuth with PKCE S256, consent per client, redirects only to `claude.ai`, `claude.com` and `localhost`;
  the Spotify return is bound to the browser by a single-use `state`.
- Isolation tests: concurrent users in one isolate, foreign plans/backups, copied vault records, token cache,
  `disconnect` scope ([security/isolation.md](../../docs/security/isolation.md)).
- Prompt injection: track, playlist and artist names are third-party data; the server instructions tell Claude
  never to follow instructions in them and to confirm every removal.
