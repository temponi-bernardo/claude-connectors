# 0007 — Connectors as `.mcpb` extensions, with a browser session instead of a token

- **Status:** Accepted
- **Date:** 2026-11-05
- **Related:** F1.1, F2.1, ADR 0001

## Context

The repository gathers connectors for Claude, used in Claude Desktop on this PC. The first is PUC Minas'
Canvas, where the institution limits access tokens to 30 days. The owner wants to install through the
extensions/connectors tab, with no monthly maintenance and no hosting cost.

## Decision

1. Each connector is a stdio MCP server, in a `connectors/<nome>/` folder with a `manifest.json` (`.mcpb` 0.3
   format), packed by `npm run pack:all` into a `.mcpb` installable in two clicks.
2. The code is bundled by esbuild into a single file; only dependencies that cannot be bundled
   (`RUNTIME_EXTERNALS`) go into the package's `node_modules`.
3. Canvas authentication uses the session from a login done in a window of the installed Chrome/Edge, with its
   own profile. On 401, the session is renewed in the background (hidden browser, saved SSO); the Canvas token
   is only a fallback.

## Alternatives considered

| Alternative                                  | Why not                                                                          |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| Remote connector (public URL + OAuth)        | Requires hosting and securing a server; browser login does not run in the cloud. |
| Access token only                            | Expires in 30 days at PUC; must be replaced by hand every month.                 |
| Read cookies from Chrome's main profile      | Blocked by Chrome (app-bound encryption, locked profile); a malware technique.   |
| Package without a bundle (full node_modules) | 6 MB+ and thousands of files; the bundle cuts it to ~3 MB.                       |
| Download Playwright's Chromium               | +150 MB; the installed Chrome/Edge is enough (`playwright-core` + `channel`).    |

## Consequences

- Positive: install through Claude's UI, no token to renew, no cost; new connectors follow the same mold and
  reuse `src/core` and `src/mcp`.
- Negative / accepted costs: only works on the computer where the extension is installed (not on mobile or the
  web); depends on Chrome or Edge being installed; the session is lost if Microsoft asks for the password again
  (then the window opens).
- Docs that change: ARCHITECTURE (layers, services), STRUCTURE (`connectors/`, `src/mcp/`, `tools/pack/`),
  PROCESSES (P03–P05), PRODUCT, ROADMAP.
