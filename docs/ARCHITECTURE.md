# Architecture

Repository of **remote MCP connectors** for Claude. Each connector is an HTTP server with OAuth hosted in the
cloud (Cloudflare Workers, [ADR 0010](adr/0010-remote-connector-on-cloudflare-workers.md)) and published as a
plugin in this repository's marketplace: the plugin only points to the server URL. Nothing runs on the installer's
computer ([ADR 0013](adr/0013-remote-only-connector-via-marketplace.md)). The **Gmail** connector
(`connectors/gmail/`) follows the same model, with OAuth from the `@cloudflare/workers-oauth-provider` library and
state in Workers KV ([ADR 0014](adr/0014-on-demand-remote-gmail-on-workers.md)). The **WhatsApp** connector
(`connectors/whatsapp/`) is a self-host template: Worker + Durable Object + container with a Go bridge, on
demand, with owner login through GitHub ([ADR 0015](adr/0015-whatsapp-on-cloudflare-containers.md)).

## Layers

```text
┌───────────────────────────────────────────────┐
│  connector  (connectors/<name>/src/)           │  entry (worker.ts), tools, API client,
│                                                │  service OAuth, response formatting
├───────────────────────────────────────────────┤
│  remote  (src/remote/)                         │  HTTP server: stateless OAuth, login page,
│                                                │  sessionless /mcp
├───────────────────────────────────────────────┤
│  mcp  (src/mcp/)                               │  tool definition/registration, results
├───────────────────────────────────────────────┤
│  core  (src/core/)                             │  shared pure logic: decides, does not act
└───────────────────────────────────────────────┘
        tools/  (bundle, docs, hooks) — repository tooling, outside the server
```

Inside a connector the same rule applies at a smaller scale: pure functions (`format`, `helpers`, parts of
`remote`) are kept apart from those with effects (`client` → network, `worker` → Workers, `remote-main` → HTTP on
Node).

## Dependency rules (who may import whom)

| From ↓ / To → | core | mcp | remote | connector (itself) | other connector | tools |
| ------------- | ---- | --- | ------ | ------------------ | --------------- | ----- |
| **core**      | ✅   | ❌  | ❌     | ❌                 | ❌              | ❌    |
| **mcp**       | ✅   | ✅  | ❌     | ❌                 | ❌              | ❌    |
| **remote**    | ✅   | ❌  | ✅     | ❌                 | ❌              | ❌    |
| **connector** | ✅   | ✅  | ✅     | ✅                 | ❌              | ❌    |
| **tools**     | ✅   | ❌  | ❌     | ❌                 | ❌              | ✅    |

- Connectors do **not** import each other: logic used by two connectors moves up to `src/core/` or `src/mcp/`.
- `remote` knows no connector: it receives a `RemoteConnector` (page texts, credential check and `McpServer`
  factory). It uses `node:crypto` and `node:http`, which is why it is not in `core`.
- In WhatsApp, `config`, `format`, `pair-page` and the plans (`planSend()`) are pure; `lifecycle`, `snapshots`,
  `pair` and `tools` act through injected ports (testable with fakes) and only `container.ts`/`index.ts` touch the
  runtime.
- `src/core/` also holds format readers used by more than one connector (Word, ZIP, PDF).
- `core` never imports Node (`node:fs`, `node:http`) or libraries with effects; `core` tests use no mocks.

## Data flow

Claude calls a tool → `src/mcp` validates the arguments (zod) → the connector's tool uses the API client → the
client authenticates and paginates → responses are reduced to lean objects in Portuguese → the result goes back
as JSON text. Details in [PROCESSES.md](PROCESSES.md) (P03–P05).

## Installation and deploy

| Piece                      | How it reaches the user                                                           | Decision |
| -------------------------- | --------------------------------------------------------------------------------- | -------- |
| Marketplace plugin         | Claude → Add marketplace `temponi-bernardo/claude-connectors`                     | ADR 0013 |
| Server (Cloudflare Worker) | `npm run worker:deploy` compiles `src/worker.ts` and publishes                    | ADR 0010 |
| Node server (Docker)       | Alternative: `npm run build` generates `server/remote.js`, used by the Dockerfile | ADR 0009 |

The plugin lives in `connectors/<name>/plugin/` (ADR 0020) and has only `.claude-plugin/plugin.json`, skills and
`.mcp.json` (an `http` server with the Worker URL). `npm run build` (P05) rejects any `.mcp.json` with a local
server.

## External services

| Service                    | Used for                                       | Where the adapter is                                   | Secret                                                         |
| -------------------------- | ---------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------- |
| Canvas LMS REST API        | Courses, assignments, grades, announcements... | `connectors/canvas-puc/src/client.ts`                  | User token, only sealed inside the OAuth tokens                |
| Canvas access token        | The connector's only credential                | `connectors/canvas-puc/src/remote.ts`                  | Only sealed inside the OAuth tokens (`SEAL_KEY` on the server) |
| Cloudflare Workers         | Running the remote connector                   | `connectors/canvas-puc/src/worker.ts`, `wrangler.toml` | `SEAL_KEY` (Worker secret); deploy with `CLOUDFLARE_API_TOKEN` |
| GitHub Pages               | Public site (home, privacy, terms)             | `docs/_config.yml`, `docs/_layouts/site.html`          | None (ADR 0012)                                                |
| Google OAuth / OIDC        | Owner login and account linking                | `connectors/gmail/src/google-oauth.ts`, `id-token.ts`  | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Worker secrets)    |
| Gmail API (`gmail.modify`) | Read, send, drafts, organize, trash            | `connectors/gmail/src/gmail-api.ts`                    | Refresh token sealed in KV with `TOKEN_ENC_KEY`                |
| Workers KV / rate limit    | OAuth grants, accounts and limits (Gmail)      | `connectors/gmail/src/worker.ts`, `wrangler.toml`      | `CONSENT_SECRET`; optional `ALLOWED_EMAILS` (private mode)     |
| GitHub OAuth App           | Owner login (WhatsApp)                         | `src/remote/github-login.ts`                           | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_EMAILS`   |
| Cloudflare Containers + DO | On-demand WhatsApp bridge                      | `connectors/whatsapp/src/container.ts`, `lifecycle.ts` | `BRIDGE_TOKEN` (Worker ↔ bridge)                               |
| Cloudflare R2              | Encrypted session backup (WhatsApp)            | `connectors/whatsapp/src/snapshots.ts`                 | `SNAPSHOT_KEY` (container only)                                |
| WhatsApp (whatsmeow)       | Messages of the paired number                  | `connectors/whatsapp/bridge/` (Go)                     | Device session, inside the snapshot                            |

No credentials in the repository or on the server: the Canvas token exists only sealed (AES-GCM with the
`SEAL_KEY`) inside the OAuth tokens that Claude stores.

## Runtime dependencies

| Package                              | What for                                                   |
| ------------------------------------ | ---------------------------------------------------------- |
| `@modelcontextprotocol/sdk`          | MCP server over Streamable HTTP                            |
| `zod` (v3)                           | Tool input schemas                                         |
| `@cloudflare/workers-oauth-provider` | OAuth 2.1 for the Gmail connector (DCR, PKCE, consent, KV) |
| `@cloudflare/containers`             | `Container` class of the WhatsApp bridge's Durable Object  |

The WhatsApp bridge is a separate Go module (`connectors/whatsapp/bridge/go.mod`: whatsmeow, SQLite), with
licenses in `connectors/whatsapp/NOTICE.md` (note: `go.mau.fi/libsignal` is GPL-3.0).

Dev: `esbuild` (Dockerfile bundle) and `wrangler` (Worker, ADR 0010), plus the template's tooling.

## Internal tooling (`tools/`)

`tools/docs/` is the documentation checker/generator, `tools/hooks/` tests the Claude Code hooks and
`tools/bundle/` checks the plugins and builds the server bundle. They follow the same rules as product code
(documentation, tests, lint) but do not ship in the server.

## Decisions

History and rationale in [adr/README.md](adr/README.md).
