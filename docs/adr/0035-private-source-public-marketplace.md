# 0035 — Private source repository, public marketplace repository

- **Status:** Accepted
- **Date:** 2026-11-24
- **Related:** Phase 6 (F6.1–F6.7), ADR 0006, 0008, 0012, 0013, 0018, 0020, 0022, 0033, 0034; pauses F3.2

## Context

This repository is public under MIT and holds everything: the shared code (`src/`), the connectors' servers,
tests, tooling, internal docs, the GitHub Pages site and the marketplace (`.claude-plugin/marketplace.json` pointing
at `connectors/<name>/plugin/`, ADR 0020). The owner wants to stop publishing the source from now on, while people
who already use the marketplace keep working with no action on their side.

Facts that shape the decision:

- Users add the marketplace as `temponi-bernardo/claude-connectors`; Claude clones it with the user's own access. A
  private repository breaks install and update for everyone without access.
- A plugin only needs its folder (manifest, `.mcp.json` with the remote URL, skills, icon): the servers run on
  Cloudflare Workers and are deployed from a clone, not from GitHub. OAuth grants and `SEAL_KEY` live on the Workers.
- A public marketplace whose plugin `source` points at a private repository fails for users without access
  (anthropics/claude-code#61271), so the public repository must contain the plugin folders themselves.
- Private GitHub marketplaces can be added on claude.ai through the Claude GitHub App and in Claude Code with the
  user's git credentials (claude.com docs: "org sync", "host a marketplace"). The Connectors Directory requires the
  listed repository to be public.
- The privacy and terms pages are served by GitHub Pages from `docs/` (ADR 0012) and referenced by the Google OAuth
  consent screen and by every `plugin.json`.
- WhatsApp is self-hosted (ADR 0018) and in practice used only by the owner; its public publication (F3.2) never
  finished. Its bridge links GPL-3.0 code (`connectors/whatsapp/NOTICE.md`).
- Code already published under MIT stays usable by whoever copied it; this decision only applies going forward.

## Decision

Split in two repositories, keeping the public name: **`temponi-bernardo/claude-connectors` stays public as a thin
marketplace** (marketplace manifest, the `canvas-puc`, `gmail` and `spotify` plugin folders, the Pages site, README, MIT
license), and **a new private repository `temponi-bernardo/ia-conectors-src` holds the full history and all
development** (code, tests, tooling, internal docs, Claude Code layer, deploys and releases). A local, tested
`npm run marketplace:publish` command in the private repository copies the built plugin folders and the site into a
checkout of the public one. **WhatsApp leaves the public marketplace** and is served to the owner only, from a
private marketplace inside the private repository.

Order is fixed so nothing breaks: the private repository is proven (checks, deploys, smoke, publish command,
private WhatsApp install) **before** the public one is slimmed, and the slimming is a single revertible PR, with no
history rewrite.

## Alternatives considered

| Alternative                                                   | Why not                                                                                         |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Make this repository private                                  | Breaks install and update for every current user; the Pages site needs a public repo (free).    |
| New public marketplace repo, this one private                 | Every user would have to add a new marketplace; old installs stop updating.                     |
| Public marketplace pointing `source` at the private repo      | Install fails for users without access (anthropics/claude-code#61271).                          |
| Keep everything public and change the license (AGPL/PolyForm) | Valid, but the owner chose to close the source; can still be applied to the public files later. |
| Rewrite public history to remove the code                     | Destructive, breaks forks and clones, and does not recall copies already made under MIT.        |

## Consequences

- Positive: current users notice nothing (same marketplace name, plugin names, Worker URLs, OAuth grants and site
  URLs); source closed from now on; WhatsApp private to the owner.
- Negative / accepted costs: two repositories to keep in sync (one local command, no GitHub Actions, ADR 0006);
  skills and manifests stay public; past history remains public under MIT; cloud sessions must be given the
  private repository; a WhatsApp install on claude.ai depends on the Claude GitHub App on the private repo (fallback:
  add the Worker `/mcp` URL as a custom connector, without the skills).
- Docs that change: ROADMAP (Phase 6, F3.2 paused); in later tasks CLAUDE.md, README, WORKFLOW, STRUCTURE,
  ARCHITECTURE, `/task` and `/release` skills (publish step), `privacy.html` and the plugin READMEs (WhatsApp removed).
