# 0018 — WhatsApp plugin without a bundled server

- **Status:** Accepted
- **Date:** 2026-11-14
- **Related:** ADR 0008, ADR 0013, ADR 0015

## Context

The WhatsApp plugin used `${user_config.server_url}` in `.mcp.json` so each person could enter their own server
(self-host template, ADR 0015). The value only exists on the computer where it was filled in. The plugin
installed by the organization on claude.ai resolves a different URL, and the **Connect** button rejected the
login before opening GitHub, in any new conversation, with the server working.

## Decision

The WhatsApp plugin **has no `.mcp.json`**: it ships only the skills. Each person connects their own server as
an account **custom connector** (claude.ai → Settings → Connectors), which works on claude.ai, in the app, on
mobile, in Cowork and in Claude Code; `/config-whatsapp` guides them. `npm run build` accepts a plugin without
`.mcp.json` and rejects `${user_config.*}` in the URL of any `.mcp.json`.

## Alternatives considered

| Alternative                                     | Why not                                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Keep `${user_config.server_url}`                | It causes the error: the local value never reaches the plugin the organization installed |
| Hard-code the owner's server URL in `.mcp.json` | Breaks self-hosting: other people could not use their own server                         |
| Central router that forwards to each owner      | Becomes a multi-tenant service, against ADR 0015, and would route everyone's traffic     |

## Consequences

- Positive: each person uses their own server in every Claude, with a single setup; Connect does not depend on
  the plugin; the build keeps the broken format from coming back.
- Negative / accepted costs: installing the plugin connects nothing by itself; the custom connector has to be
  added (one step, guided by `/config-whatsapp`).
- Docs that change: the connector's README and `config-whatsapp` skill, PROCESSES (P05, P07), STRUCTURE,
  FUNCTIONS (`isRemoteMcpUrl`, `buildConnector`), CHANGELOG.
