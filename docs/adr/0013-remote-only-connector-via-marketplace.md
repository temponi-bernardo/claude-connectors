# 0013 — Remote-only connector, installed from the marketplace

- **Status:** Superseded in part by 0020 (plugin root: see ADR 0020)
- **Date:** 2026-11-14
- **Related:** F2.9, ADR 0007 (superseded), ADR 0008 (superseded in part), ADR 0009, ADR 0010

## Context

The Canvas connector had two modes: a **local** one (stdio server on the computer, browser login with
`playwright-core`, packaged as `.mcpb` and as a plugin that ran `node server/index.js`) and a **remote** one
(a Cloudflare Worker with OAuth, ADR 0009 and 0010). The remote one already works on claude.ai, in Cowork and on
mobile. The local one does not work in cloud sessions (there is no browser and no PUC session) and requires
Node, npm and Chrome on the computer. The owner wants a single product: install from the marketplace and use it,
with nothing local.

## Decision

1. Local mode leaves the project: stdio server, browser login, on-disk session, `playwright-core`, the
   `conectar_canvas`/`desconectar_canvas` tools, the `.mcpb` manifest and package.
2. The marketplace plugin becomes configuration only: a `.mcp.json` with a `type: "http"` server pointing at the
   Worker (`https://canvas-puc-remote.bftemponi.workers.dev/mcp`). On the first call, Claude runs the server's
   OAuth (dynamic client registration) and the person pastes their Canvas token once.
3. `plugin.json` and `.mcp.json` are now written by hand (there is no `manifest.json` to generate them anymore).
   `npm run build` (`tools/bundle/`) checks that every `.mcp.json` has only `http` servers with an `https://` URL
   and generates `server/remote.js` for the Dockerfile.

## Alternatives considered

| Alternative                                         | Why not                                                                          |
| --------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keep both modes                                     | Doubles code, tests and support; local does not run in the cloud, the main use   |
| Local plugin that only proxies to the Worker        | Still requires Node on the computer for no gain                                  |
| Only a claude.ai custom connector, without a plugin | Everyone would have to copy the URL by hand; the marketplace installs in a click |

## Consequences

- Positive: a single path (install from the marketplace), nothing installed on the computer, works the same in
  Claude Code, Cowork, the web and mobile; less code and no browser dependency.
- Negative / accepted costs: the person has to generate an access token in Canvas (the OAuth page explains how
  and the token renews itself, ADR 0011); the Worker becomes a single point of failure; anyone already using the
  `.mcpb` has to reinstall from the marketplace.
- Docs that change: ARCHITECTURE, STRUCTURE, PROCESSES (P04 removed, P05 and P07 rewritten), FUNCTIONS,
  ROADMAP (F2.1 and F2.2 without `.mcpb`), connector README and release skills.
