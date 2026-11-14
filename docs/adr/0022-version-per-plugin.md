# 0022 — One version per plugin

- **Status:** Accepted
- **Date:** 2026-11-14
- **Related:** ADR 0003, ADR 0006, roadmap F4.3

## Context

No `plugin.json` has a `version`. Claude Code then falls back to the git commit SHA, so any commit to the repo
looks like an update of every plugin, and users cannot tell versions apart. The numbers that exist do not match:
Canvas `package.json` says 2.0.0, the WhatsApp server hard-codes 0.1.0 and release-please tracks only the root at
0.1.0. `claude plugin validate` warns when `version` is missing, and the plugin.json version wins over the
marketplace entry.

## Decision

Each plugin carries an explicit semver `version` in its `plugin.json`, and only there (not in the marketplace
entry). release-please manages each plugin as its own package and bumps that field through `extra-files`. Server
code reads its MCP server version from the same `plugin.json`. Starting versions: `canvas-puc` 3.0.0 (the tool
renames are breaking), `gmail` 1.0.0, `whatsapp` 1.0.0.

## Alternatives considered

| Alternative                         | Why not                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------- |
| No version (track the commit SHA)   | Every commit is an "update" of all plugins; no readable version for users |
| Version in `marketplace.json` entry | plugin.json wins when both exist; one place avoids drift                  |
| One repo-wide version for all three | A Gmail fix would bump Canvas and WhatsApp too                            |

## Consequences

- Positive: predictable updates, readable versions, one source of truth per plugin.
- Negative / accepted costs: a release must bump the version or users see "already at the latest version";
  release-please config grows to one package per plugin.
- Docs that change: WORKFLOW (release), `/lancar-versao` skill, STRUCTURE, CHANGELOG.
