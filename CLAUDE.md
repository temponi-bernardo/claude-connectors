# claude-connectors

MCP connectors for Claude that run in the cloud and install through the plugin marketplace, starting with PUC
Minas's Canvas.

Each connector lives in `connectors/<name>/` and is a marketplace plugin that points to its remote server
(ADR 0013); shared code lives in `src/`. There are no GitHub Actions: the PR gate is `npm run pr:check` (ADR 0006).

The documentation in `docs/` is the source of truth. **Before touching code, read `docs/README.md`** and follow
its "I want... → read...". Don't sweep the code to find out what exists: `docs/FUNCTIONS.md`,
`docs/PROCESSES.md` and `docs/STRUCTURE.md` tell you. The next task is at the top of `docs/ROADMAP.md`; what the
previous session left is in `docs/STATE.md` (injected at session start).

## Non-negotiable rules

1. **Nothing repeated** — shared logic becomes a shared function (`npm run dup:check`, zero threshold).
2. **Small functions, one job** — ≤ 25 lines, ≤ 3 parameters, deciding (pure) separate from doing
   (effects). Details in `docs/CODING-STANDARDS.md`.
3. **Function names unique across the repository** (checked by `docs:check`).
4. **Tests first.** Every function has a test; exceptions only in `src/test-exceptions.ts` with a reason
   (`docs/TESTING.md`).
5. **Documentation in the same change.** Run `npm run docs:generate`, fill the manual fields, follow the
   table in `docs/DOCUMENTATION.md`. **Every plugin change** (`connectors/`, `.claude-plugin/`) updates the
   affected docs and documents everything that was done, via `/update-docs` — the `Stop` hook
   `stop-plugin-docs.sh` blocks if it is missing.
6. **UI only with the design system** (`docs/UI.md`), when there is one.
7. **Nothing directly on `main`** — a branch per task, a PR, a green `pr:check`, squash merge (`docs/WORKFLOW.md`).
   Claude merges on its own with a green `pr:check`, without asking for confirmation.
8. **Conventional Commits** with an English description: `feat(canvas): add grades tool`.
9. **Skills always up to date** — a repeated step, command or new rule → a skill in the same PR.
10. **English everywhere** (ADR 0021): docs, skills, rules, hook messages, commits and identifiers. Existing
    Portuguese text is translated in roadmap phase F4.
11. **Small context.** One task per session. Exploration, research and independent checks go to subagents;
    only the summary comes back. When finishing a task or a big step: `/handoff` (overwrites `docs/STATE.md`,
    local and outside git) and tell the user to run `/clear`. You can't run `/clear` — only tell them.

## Commands

| Command                              | Does                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `npm run check`                      | Format, lint, types, tests, docs, duplication and secrets                             |
| `npm run pr:check -- "<title>"`      | PR gate (there is no CI): check, build, packages and commitlint                       |
| `npm run docs:generate`              | Updates the generated blocks of `docs/FUNCTIONS.md` and creates new sections          |
| `npm run docs:check`                 | Fails if docs and code diverge                                                        |
| `npm test` / `npm run test:coverage` | Tests / with a 90% minimum coverage                                                   |
| `npm run lint` / `npm run lint:fix`  | ESLint                                                                                |
| `npm run format:fix`                 | Prettier                                                                              |
| `npm run typecheck`                  | `tsc --noEmit`                                                                        |
| `npm run dup:check`                  | jscpd                                                                                 |
| `npm run build`                      | Validates `.mcp.json` (remote only) and generates each connector's `server/remote.js` |
| `npm run worker:deploy`              | Deploys the remote Canvas to Cloudflare Workers (`worker:dev`: local)                 |
| `npm run gmail:deploy`               | Deploys the remote Gmail to Cloudflare Workers (`gmail:dev`: local)                   |
| `npm run whatsapp:deploy`            | Deploys WhatsApp (Workers + Containers); `whatsapp:build`: bundle and image only      |
| `npm run bridge:test`                | WhatsApp Go bridge: gofmt, vet and tests (Go 1.26+, part of `pr:check`)               |

## Skills

| Skill             | When                                                                   |
| ----------------- | ---------------------------------------------------------------------- |
| `/task`           | Take the next roadmap task and carry it through to the merge           |
| `/tests-first`    | Any new code or bug: the TDD cycle                                     |
| `/update-docs`    | After changing code, before opening the PR                             |
| `/sync-docs`      | Full docs × code audit (including what the machine doesn't check)      |
| `/improve-skills` | At the end of each task: review whether any skill needs to change      |
| `/release`        | Prepare and follow a release                                           |
| `/handoff`        | When finishing a task or a big step: save the state to `docs/STATE.md` |

## How Claude Code is configured here

- `.claude/settings.json`: check commands allowed; push to `main`, `--force`, `--no-verify` and reading
  `.env`/secrets denied (also by a `PreToolUse` hook).
- `Stop` hook (`stop-docs-check.sh`): runs `docs:check` at the end of each reply that changed code or docs.
- `Stop` hook (`stop-handoff.sh`): if you have a new commit without an updated `docs/STATE.md`, blocks and asks
  for `/handoff`.
- `Stop` hook (`stop-plugin-docs.sh`): if the branch changed a plugin (`connectors/`, `.claude-plugin/`) without
  touching documentation (`docs/`, `CHANGELOG.md`, READMEs), blocks and asks for `/update-docs`.
- `SessionStart` hook: injects `docs/STATE.md` and the roadmap's next task (also after `/clear`).
- `SessionStart` hook (`session-tools.sh`, cloud only): installs gitleaks 8.28.0 through Go
  (`scripts/install-gitleaks.sh`) and runs `npm install` if the lockfile changed. `secrets:check` uses the same
  script if gitleaks is missing in the cloud (pre-push included).
- `PreCompact` hook: generates an automatic handoff in `docs/STATE.md` via `claude -p` before compacting.
- `SessionEnd` hook (`session-end-handoff.sh`): on `/clear` or session end, if there was an edit or commit after
  the last `STATE.md`, generates the handoff the same way (a chat-only session costs nothing).
- Full cycle in `docs/WORKFLOW.md` → "Claude Code context cycle".
- `.claude/rules/`: rules loaded by path (`code.md`, `tests.md`, `docs.md`).
