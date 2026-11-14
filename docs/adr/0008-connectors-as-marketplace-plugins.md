# 0008 — Connectors also as plugins of a Claude Code marketplace

- **Status:** Accepted
- **Date:** 2026-11-05
- **Related:** ADR 0007, F1.4

## Context

The owner wants to install the connectors through Claude's plugin marketplace screen ("Add marketplace" with
`temponi-bernardo/claude-connectors`). A plugin is copied only from its own folder; Claude does not run a build
and only runs `npm install` if the folder has `package.json` + `package-lock.json`. The Canvas login depends on
`playwright-core`, which reads its own files at runtime and cannot be bundled by esbuild.

## Decision

1. The repository is a marketplace (`.claude-plugin/marketplace.json`) and each `connectors/<nome>/` is a
   plugin (`.claude-plugin/plugin.json` with `userConfig` + `.mcp.json`), with no fixed `version`: updates
   follow the folder's commits. Both files are **generated** from the `.mcpb` `manifest.json`, the single
   source of name, description, command and configuration fields.
2. `npm run pack` now generates the versioned runtime inside the connector folder: `server/index.js` (bundle),
   `package.json` and `package-lock.json` with only the external dependencies. `pr:check` fails if it is out
   of date. The same runtime goes into the `.mcpb` (ADR 0007 still holds).
3. `playwright-core` is loaded only when browser login is needed (`loadPlaywright()`): first from
   `node_modules` (installed by Claude or by the `.mcpb`), otherwise from `~/.canvas-puc/runtime`, installing
   it there the first time.

## Alternatives considered

| Alternative                             | Why not                                                                      |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| Bundle playwright-core                  | Tested: depends on `__dirname`, its own `package.json` and optional modules. |
| Commit `node_modules` to the repository | ~10 MB per version in the git history.                                       |
| Token-only plugin (no browser login)    | Brings back PUC's 30-day token problem.                                      |
| Fixed `version` in `plugin.json`        | Would require remembering to bump it on every change, or nobody updates.     |

## Consequences

- Positive: install and update through Claude's UI; the same bundle serves the plugin and the `.mcpb`.
- Negative / accepted costs: a committed generated bundle (~780 KB) and bigger PRs when code changes; the
  private repo requires working git credentials on the PC (passwordless SSH or `gh auth setup-git`).
- Docs that change: ARCHITECTURE (packaging), STRUCTURE, PROCESSES (P05, P07), WORKFLOW (`pr:check`), READMEs.
