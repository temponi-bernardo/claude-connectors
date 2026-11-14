# 0020 — Plugin content lives in a `plugin/` subfolder

- **Status:** Accepted
- **Date:** 2026-11-14
- **Related:** ADR 0013 (replaced in part), ADR 0018, roadmap F4.2

## Context

Each marketplace entry points at `connectors/<name>/`, so the whole folder is the plugin. Claude Code copies the
plugin folder to `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/` on install. Today that copy carries
the server code too: `src/`, tests and fixtures, `Dockerfile`, `wrangler.toml`, `package.json`, the 838 KB
`server/remote.js` bundle (Canvas) and the Go bridge (WhatsApp). None of it is used by the installed plugin.
Anthropic's plugin docs ask for self-contained plugins that hold only plugin components; there is no exclude
mechanism for copied files.

## Decision

Each connector keeps its server in `connectors/<name>/` and moves the plugin itself to `connectors/<name>/plugin/`:
`.claude-plugin/plugin.json`, `.mcp.json` (when there is one), `skills/` and a short `README.md`. Each
`marketplace.json` entry points its `source` at `./connectors/<name>/plugin`. This replaces the part of ADR 0013
that made `connectors/<name>/` the plugin root.

## Alternatives considered

| Alternative                                    | Why not                                                                    |
| ---------------------------------------------- | -------------------------------------------------------------------------- |
| Keep the plugin at `connectors/<name>/`        | Ships server code, tests and bundles to every user's plugin cache          |
| Top-level `plugins/<name>/`, servers elsewhere | Splits one connector across two trees; more path churn for the same result |
| `metadata.pluginRoot` with a separate tree     | Same split as above; only shortens the `source` strings                    |

## Consequences

- Positive: the installed plugin holds only manifests, `.mcp.json`, skills and README; server and plugin stay
  next to each other in one connector folder.
- Negative / accepted costs: every path that names `connectors/<name>/.claude-plugin`, `.mcp.json` or `skills/`
  changes (`tools/bundle/`, `scripts/pr-check.sh`, `stop-plugin-docs.sh`, docs). Users reinstall or update once.
- Docs that change: STRUCTURE, ARCHITECTURE, PROCESSES, WORKFLOW, connector READMEs, CHANGELOG.
