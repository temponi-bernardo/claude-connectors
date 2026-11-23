# claude-connectors

MCP connectors for Claude that run in the cloud and install through the plugin marketplace, starting with PUC
Minas's Canvas.

Each connector lives in `connectors/<name>/` and is a marketplace plugin that points to its remote server
(ADR 0013); shared code lives in `src/`. There are no GitHub Actions: the PR gate is `npm run pr:check` (ADR 0006).

The documentation in `docs/` is the source of truth. **Before touching code, read `docs/README.md`** ("I want... →
read..."); `docs/FUNCTIONS.md`, `docs/PROCESSES.md` and `docs/STRUCTURE.md` tell you what exists without
sweeping the code. Next task: top of `docs/ROADMAP.md`. Where the previous session stopped: `docs/STATE.md`
(injected at session start).

## How to work

- **Simple request** (a fix, a question, a small change): do it directly, without the `/task` ceremony.
- **Roadmap task or multi-step change:** `/task`. It covers TDD, docs, one `pr:check`, one `/review-pr`, PR,
  merge and `/handoff`.
- **Small context:** noisy searches go to the `docs-explorer` agent. When finishing something big, `/handoff`
  and tell the user to run `/clear` (you can't run it).

## Non-negotiable rules

🔒 the machine enforces it · 📝 depends on you

1. 🔒 **Nothing repeated** (`npm run dup:check`, zero threshold): shared logic becomes a shared function.
2. 🔒 **Functions ≤ 25 lines and ≤ 3 parameters** (ESLint). 📝 One job; deciding (pure) separate from doing
   (effects) — `docs/CODING-STANDARDS.md`.
3. 🔒 **Function names unique** across the repository (`docs:check`).
4. 🔒 **Tests first.** Every function has a test (`docs:check` in the `pre-commit`); exceptions only in
   `src/test-exceptions.ts`, with a reason (`docs/TESTING.md`).
5. 🔒 **Documentation in the same change:** `npm run docs:generate`, manual fields and the table in
   `docs/DOCUMENTATION.md` (`/update-docs`). A plugin change (`connectors/`, `.claude-plugin/`) without docs is
   blocked by the `Stop` hook `stop-plugin-docs.sh`.
6. 📝 **UI only with the design system** (`docs/UI.md`), when there is one.
7. 🔒 **Nothing directly on `main`:** a branch per task, a PR, one green `pr:check`, squash merge
   (`docs/WORKFLOW.md`). Claude merges on its own with a green `pr:check`, without asking.
8. 🔒 **Conventional Commits** with an English description: `feat(canvas): add grades tool`.
9. 📝 **Skills up to date:** a repeated step, command or new rule → a skill in the same PR (`/improve-skills`).
10. 📝 **English everywhere** (ADR 0021): docs, skills, rules, hook messages, commits and identifiers.
11. 📝 **One independent review per PR:** `/review-pr` before opening it, one round of fixes, no loop (ADR 0029).
12. 🔒 **Nothing that spends GitHub credits:** no Actions or CodeQL; the CI is the local `pr:check` (ADR 0006).

## Commands

| Command                                         | Does                                                                                    |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| `npm run check`                                 | Format, lint, types, tests with coverage, docs, duplication and secrets                 |
| `npm run pr:check -- "<title>"`                 | PR gate, once per PR: check, build, bridge, plugin validation and commitlint            |
| `npm run docs:generate` / `docs:check`          | Updates the generated blocks of the docs / fails if docs and code diverge               |
| `npm test` / `npm run test:coverage`            | Tests / with a 90% minimum coverage                                                     |
| `npm run lint:fix` / `format:fix` / `typecheck` | ESLint / Prettier / `tsc --noEmit`                                                      |
| `npm run dup:check` / `secrets:check`           | jscpd / gitleaks                                                                        |
| `npm run build`                                 | Validates `.mcp.json` (remote only) and generates each connector's `server/remote.js`   |
| `npm run worker:deploy` / `worker:dev`          | Deploys the remote Canvas to Cloudflare Workers, then the smoke test / runs it local    |
| `npm run gmail:deploy` / `gmail:dev`            | Same for the remote Gmail                                                               |
| `npm run whatsapp:deploy` / `whatsapp:build`    | Deploys WhatsApp (Workers + Containers) / bundle and image only                         |
| `npm run smoke -- <connector>`                  | Post-deploy smoke: published `GET /tools` must equal `tool-contract.json` (ADR 0027)    |
| `npm run bridge:test`                           | WhatsApp Go bridge: gofmt, vet and tests (Go 1.26+, part of `pr:check`)                 |
| `npm run plan:e2e`                              | `/planejamento` page in Chromium (Playwright): run when its template or runtime changes |

Hooks, skills and agents: `docs/WORKFLOW.md` → "Claude Code context cycle".
