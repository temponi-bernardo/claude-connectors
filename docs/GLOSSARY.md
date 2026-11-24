# Glossary

**ADR** — Architecture Decision Record; a short record of an architecture decision, its context and
consequences. Lives in `docs/adr/`.

**Generated block** — Part of FUNCTIONS.md between `<!-- generated:start -->` and `<!-- generated:end -->`, written
by `npm run docs:generate` from the code.

**Manual fields** — Does, Input, Output, Effects and Errors of each function in FUNCTIONS.md; written by hand.

**Check** — `npm run check`: format, lint, types, tests with coverage, docs, duplication and secrets. The
full PR gate is `pr:check` (there is no CI, ADR 0006).

**Connector** — Remote MCP server for an external service (e.g. Canvas), in a folder of `connectors/`, with
the marketplace plugin that points to it and the tools for Claude.

**Core** — Pure logic layer (`src/core/`): it decides, it does not do.

**Call budget** — How many Spotify requests one tool call may make (`SPOTIFY_CALL_BUDGET`, 40 by default); long
operations stop at the budget and continue on the next call.

**Plan (Spotify)** — A stored batch change (`plan_id`) produced by a `preview_*` tool and run by `apply_plan`
after the user's OK; valid for 10 minutes, resumable, backed up before removals (ADR 0033).

**Snapshot (Spotify)** — The user's Liked Songs or one playlist read into their vault, possibly over several
calls, so previews work on the whole collection.

**Vault (Spotify)** — The per-user records in `SPOTIFY_KV`, each sealed with AES-256-GCM together with its type and
owner, under a hash of the owner.

**Conventional Commits** — The `type(scope): description` format of commit messages and PR titles.

**Decide vs. do** — Separation between pure functions (decide) and functions with effects (do).

**docs:check** — Checker that fails when docs and code diverge.

**Test exception** — Entry in `src/test-exceptions.ts` that exempts a function from an automated test,
with a reason and a manual test.

**Phase / Task (F1.2)** — Units of ROADMAP.md: a phase groups tasks; `F<phase>.<n>` identifies one.

**Reference index** — Map function → who calls it or passes it as a value, computed from the AST; becomes the
"Used by" field.

**Inventory** — Everything `docs:check` extracts from the repository before comparing it with the docs.

**MVP** — Minimum set of phases that delivers real value; defined in ROADMAP.md.

**Tool annotations** — MCP metadata every tool must carry: a `title` and the behaviour hints (`readOnlyHint`,
or `destructiveHint` when it writes). Built with `toolAnnotations()` and the presets of `src/mcp/annotations.ts`;
clients ask for confirmation before destructive tools, and the Connectors Directory requires them.

**Process (P01)** — End-to-end flow described in PROCESSES.md.

**Function registry** — List of top-level functions (`function name`) found in the code.

**Plugin marketplace** — Repository with `.claude-plugin/marketplace.json` from which Claude installs
plugins; here, each connector is a plugin.

**pr:check** — `npm run pr:check -- "<title>"`: the local PR gate that replaces CI (check, connector build,
commitlint of the commits and the title).

**Release-please** — Tool that generates the release PR, version and changelog from the commits; here it runs through the local CLI.

**Skill** — Reusable Claude Code procedure in `.claude/skills/<name>/SKILL.md`, invoked as
`/name`.

**Squash merge** — Merge that condenses the branch into one commit on `main`; the PR title becomes the message.

**Remote connector** — Mode of a connector served over HTTP (`server/remote.js`) and added in claude.ai as a
custom connector; it authorizes through OAuth and works on the web, in Cowork and on mobile (ADR 0009).

**Bridge (WhatsApp)** — Go server with whatsmeow inside the container (`connectors/whatsapp/bridge/`), with an
internal HTTP API protected by `BRIDGE_TOKEN`; the Worker talks to it through the `WhatsAppBridge` Durable Object.

**Pairing** — Linking the number to the connector as a WhatsApp "linked device", by code (PairPhone) or
QR, on the `/pair` page.

**Delegated (upstream) login** — Variant of the remote connector's OAuth in which `/authorize` sends the browser to
an identity provider (GitHub) and the sealed secret is the email accepted in `ALLOWED_EMAILS`.

**Snapshot (WhatsApp)** — Encrypted copy (`WAS1` format, AES-256-GCM) of the bridge's session and message
database, stored in R2 and restored when the container wakes up.

**Seal** — Encrypted, authenticated text (AES-256-GCM, key `SEAL_KEY`) that carries the `client_id`, code and
tokens of the stateless OAuth; only the server opens it and nobody can alter it.

**Template** — `template-new-project`, the source repository of this structure (docs, checks, skills).
