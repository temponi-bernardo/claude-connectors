# 0009 — Remote HTTP connector with OAuth and the Canvas token

- **Status:** Accepted
- **Date:** 2026-11-05
- **Related:** F2.6, ADR 0007, ADR 0008

## Context

The plugin and the `.mcpb` extension run the MCP server over stdio on the user's computer and log in through
Chrome. Cloud sessions (Cowork, mobile, claude.ai) do not start the plugin's server or have no browser for the
login. To use Canvas there, Claude needs a **custom connector**: an HTTPS URL that speaks MCP over Streamable
HTTP and authenticates with OAuth 2.1 (with dynamic client registration). PUC does not provide a Canvas OAuth
developer key, so the only credential possible without a browser is the personal **access token** (Account →
Settings), valid for 30 days at PUC.

## Decision

1. An HTTP server (`connectors/canvas-puc/src/remote-main.ts`) exposes the same read and write tools at `/mcp`
   (stateless Streamable HTTP, one `McpServer` instance per request). The `conectar_canvas`/`desconectar_canvas`
   tools do not exist in remote mode.
2. The server itself is the OAuth authorization server (new `src/remote/` layer, generic for other
   connectors): metadata (RFC 8414 and RFC 9728), dynamic registration (RFC 7591), `/authorize` with mandatory
   PKCE S256 and `/token` (code and refresh).
3. The `/authorize` page asks for the Canvas token, validates it at `/api/v1/users/self` and only then issues
   the code.
4. **No database:** `client_id`, code, access token and refresh token are blobs sealed with AES-256-GCM (server
   key `SEAL_KEY`), with type and expiry inside. The Canvas token only travels sealed and is never stored.
5. OAuth redirect addresses are limited by an allowlist (`claude.ai`, `claude.com` and `localhost`,
   configurable), so a client registered by a third party cannot receive someone's token.
6. The Canvas address is fixed on the server (`CANVAS_BASE_URL`), so the server does not access user-chosen
   URLs.
7. The handler is written on top of `Request`/`Response` (Web standard) and a thin adapter serves it with
   `node:http`; bundled into `server/remote.js` and published with Docker (any Node host with HTTPS).

## Alternatives considered

| Alternative                                 | Why not                                                                                   |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Canvas's own OAuth (developer key)          | Requires PUC to create a developer key; out of our control.                               |
| Browser login on the server (Playwright)    | Would have to store the user's Microsoft password/MFA; insecure and fragile.              |
| Connector without auth, token in a variable | Serves only one person and exposes the account to anyone who knows the URL.               |
| Store tokens in a database (KV, SQLite)     | More infrastructure and a leak target; sealing removes the need for storage.              |
| Express + the SDK's `mcpAuthRouter`         | Needs a new dependency and a stateful provider; the Web-standard handler is pure to test. |
| Stateful MCP sessions (`Mcp-Session-Id`)    | Do not survive restarts or multiple instances; no tool needs them.                        |

## Consequences

- Positive: Canvas works on claude.ai, in Cowork and on mobile; the server stores no user secret.
- Negative / accepted costs: the PUC token expires in 30 days and the user reconnects the connector after
  that; an authorization code can be reused during its 5-minute validity (stateless), which PKCE mitigates;
  changing `SEAL_KEY` disconnects everyone; someone has to host the server with HTTPS.
- Docs that change: ARCHITECTURE (`remote` layer, external service), STRUCTURE, PROCESSES (OAuth and remote MCP
  flows), connector README (how to host and connect), ROADMAP (F2.6).
