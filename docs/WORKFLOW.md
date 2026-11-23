# Workflow

## Branches

- `main` only receives code through a PR with a green `npm run pr:check`; no direct push, no force push. There is
  no CI on GitHub Actions ([ADR 0006](adr/0006-no-github-actions-local-checks.md)): the gate is local.
- One branch per task: `<type>/<roadmap-id>-<short-description>`, e.g. `feat/f2-1-main-process`,
  `fix/canvas-pagination`, `docs/architecture-layers`.
- A branch starts from an up-to-date `main` and dies at the merge (squash).

## Commits (Conventional Commits, description in English)

Commit descriptions are in English ([ADR 0021](adr/0021-english-across-the-repository.md)), e.g.
`feat(canvas): add grades tool`.

```text
<type>(<scope>): <description in the imperative, lowercase, no trailing period>

[optional body: the why]

[optional footer: BREAKING CHANGE: ..., Closes #12]
```

| Type       | When                                    | Changelog section  |
| ---------- | --------------------------------------- | ------------------ |
| `feat`     | New visible feature                     | Adicionado (minor) |
| `fix`      | Behavior fix                            | Corrigido (patch)  |
| `perf`     | Performance improvement                 | Alterado           |
| `refactor` | Internal change, behavior unchanged     | —                  |
| `docs`     | Documentation only                      | —                  |
| `test`     | Tests only                              | —                  |
| `build`    | Build, production dependencies          | —                  |
| `ci`       | GitHub Actions, hooks                   | —                  |
| `chore`    | Maintenance that fits none of the above | —                  |
| `revert`   | Reverts a commit                        | —                  |

The changelog section names (Adicionado = Added, Corrigido = Fixed, Alterado = Changed) are still Portuguese in
`release-please-config.json` and `CHANGELOG.md`.

Allowed scopes (`commitlint.config.js`): `core`, `mcp`, `canvas`, `bundle`, `docs`, `tools`, `ci`, `deps`,
`skills`, `release`, `config`, `remote`, `site`, `gmail`, `whatsapp`. A new connector gets a scope with its name.
When you create a new layer or module, add the scope there **and** here in the same PR.

`BREAKING CHANGE:` in the footer (or `!` after the type) produces a major. The `commit-msg` hook validates locally;
`pr:check` validates the **PR title**, because with squash merge it becomes the commit on `main`.

## Pull request

1. Open the PR early, as a draft if it is not finished.
2. Title in Conventional Commits format (it becomes the commit on `main`).
3. Fill in the template: what changed, how to test, documentation checklist (each doc ticked or "n/a:
   reason").
4. A green `npm run pr:check -- "<PR title>"`, **run once** after the last commit: full check, connector build
   (remote-only plugin, `server/remote.js` committed and current), commitlint of the commits and of the title. It
   is reused for the merge; run it again only if a commit came after it
   ([ADR 0029](adr/0029-lean-claude-code-layer.md)). Fix things instead of skipping them (`--no-verify` is
   forbidden and blocked by Claude Code).
5. **Review once** with `/review-pr`: the read-only `reviewer` agent reviews the whole PR since the merge-base,
   the session fixes once and what is left goes into the PR body. No review loop.
6. **Who merges:** Claude, with a green `pr:check`, without asking for confirmation, including the release PR
   (owner's decision, 2026-11-05).
7. Merge by **squash**, deleting the branch.

## Definition of done

A task is done when: the roadmap's "Pronto quando" (done when) criterion is verifiable and true; `npm run check`
passes; the documentation in the same PR is updated as in [DOCUMENTATION.md](DOCUMENTATION.md); the CHANGELOG
"Unreleased" section has the entry (if user-visible); the state in the ROADMAP and its "Next task"
were updated; a skill is updated in the same PR when a step, command or rule it cites changed.

## Local hooks

Versioned in `.githooks/` and enabled by `npm install` (the `prepare` script → `git config core.hooksPath`).

| Hook         | Runs                                                                                                                     | Target time |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `pre-commit` | refuses `.github/workflows/`, lint-staged (ESLint + Prettier on staged files), `docs:check`                              | seconds     |
| `commit-msg` | commitlint                                                                                                               | instant     |
| `pre-push`   | refuses updating or deleting `main`/`master` on the remote (`protected-branches.sh`) and runs gitleaks (`secrets:check`) | seconds     |

Types and the test suite run once per PR, in `pr:check` ([ADR 0029](adr/0029-lean-claude-code-layer.md)). While
working, run the tests of what you touched (`npx vitest run <path>`).

## Claude Code context cycle

Claude works in small contexts: one task per session. A simple request (a fix, a question, a small change) is done
directly; a roadmap task or a multi-step change goes through `/task`. The configuration lives in
`.claude/settings.json` (decisions in [ADR 0005](adr/0005-state-md-local-per-clone.md) and
[ADR 0029](adr/0029-lean-claude-code-layer.md)):

1. `SessionStart` injects `docs/STATE.md` (handoff) and the roadmap's next task. In the cloud, `session-tools.sh`
   also installs gitleaks and the npm dependencies.
2. Guards run before the fact: `guard-bash.mjs` (force push, push to `main`, `--no-verify`, reading secret files,
   starting GitHub Actions) and `guard-edit.mjs` (writing `.github/workflows/`, secret files, key files). After
   every edit, `format-on-edit.mjs` runs Prettier on the file.
3. Noisy work goes to subagents and only the summary comes back: `docs-explorer` (where/what, from the docs) and
   `reviewer` (one review per PR, through `/review-pr`).
4. If the branch changed a plugin (`connectors/` or `.claude-plugin/`) without touching documentation (`docs/`,
   `CHANGELOG.md`, `README.md` or the connector's README), the `Stop` hook `stop-plugin-docs.sh` blocks ending the
   turn and asks for the `/update-docs` skill: every plugin change documents everything that was done.
5. When done, `/handoff` overwrites `docs/STATE.md`, which is local to each clone (it is in `.gitignore` and is
   never committed), and Claude tells the user to run `/clear`. There is no automatic handoff: no hook calls a
   model outside the conversation.

Skills: `/task`, `/tests-first`, `/update-docs`, `/review-pr`, `/handoff` and `/release`; `/sync-docs` and
`/improve-skills` run only when the person calls them.

## Version and release

Each version lives in one place ([ADR 0022](adr/0022-version-per-plugin.md)). The repository version is in
`package.json` (package `.`, tag `vX.Y.Z`). Each plugin has its own `version` in
`connectors/<name>/plugin/.claude-plugin/plugin.json` and is its own release-please package (`connectors/<name>`,
`release-type: simple`, tag `<name>-vX.Y.Z`, changelog in `connectors/<name>/CHANGELOG.md`); release-please bumps
the `plugin.json` field through `extra-files` (`jsonpath: $.version`). The marketplace entry never carries a
version. `.release-please-manifest.json` mirrors every package's current version. A plugin only shows an update
to users after its version is bumped, so release any change to a connector (server or plugin) that users should
get. The flow belongs to the `/release` skill:

1. Conventional commits reach `main` through PRs.
2. The local CLI opens/updates a **release PR** with the version bump and the generated CHANGELOG:
   `npx release-please release-pr --token "$(gh auth token)" --repo-url temponi-bernardo/claude-connectors`.
3. Review the release PR (and the CHANGELOG "Unreleased" section, which becomes the version).
4. Claude merges the release PR, like any PR. Human confirmation is in publishing the draft. Afterwards the same
   CLI creates the `vX.Y.Z` tag and a release **draft**: `npx release-please github-release --draft --token
"$(gh auth token)" --repo-url temponi-bernardo/claude-connectors`. It also creates `<name>-vX.Y.Z` tags and
   drafts for the plugins in the release PR.
5. Publish the draft whenever you want. There is no attachment: the plugin points to the remote server (ADR 0013).

A package whose manifest version has no GitHub release yet (e.g. bumped by hand) has no baseline: release-please
then reads the whole history and can propose a wrong major. Dry-run first (`release-pr --dry-run`); if a version
is wrong, pin it with `release-as` on that package in `release-please-config.json` for that one release, and
remove the pin in the post-release PR (otherwise every later release PR proposes the same version again).

The **remote connector** (ADR 0010) does not depend on a release: after a merge that touches the connector, run
`npm run worker:deploy` on `main` (needs `CLOUDFLARE_API_TOKEN`). To test first, `npm run worker:dev`. The
**remote Gmail** (ADR 0014) follows the same path with `npm run gmail:deploy` / `npm run gmail:dev`; the first
deploy (KV, secrets, Google Cloud) is in [connectors/gmail/README.md](../connectors/gmail/README.md).
**WhatsApp** (ADR 0015) is published by whoever hosts it: `npm run whatsapp:deploy` (needs Docker for the bridge
image). `pr:check` runs `npm run bridge:test` (Go 1.26+; with `GOTOOLCHAIN=auto` Go downloads the toolchain) and
`npm run whatsapp:build` (bundle and image, without publishing). In a cloud session (Claude Code on the web) the
image build cannot reach the Go module proxy, because the build container does not trust the session's TLS proxy
CA: start `dockerd` if `docker info` fails, and prefix the command (`pr:check`, `whatsapp:build` or
`whatsapp:deploy`) with `WRANGLER_DOCKER_BIN="$PWD/scripts/docker-proxy-ca.sh"`. The script trusts the CA in the
image's build stage only, in a temporary copy of the context; the published image never carries it.
Every deploy script runs the post-deploy smoke test right after `wrangler deploy` (ADR 0027): `npm run smoke --
<connector>` reads the published `GET /tools` and fails the command when it differs from the connector's
`tool-contract.json` (roll back with `npx wrangler rollback --config connectors/<connector>/wrangler.toml`).

## Security in the flow

- `gitleaks` runs in `secrets:check` (inside `check`, `pre-push` and `pr:check`). Without CI it is the only
  barrier: without gitleaks installed, `secrets:check` fails (`winget install Gitleaks.Gitleaks`). In the Claude
  Code cloud it installs version 8.28.0 by itself through Go (`scripts/install-gitleaks.sh`): the direct GitHub
  download is blocked by the proxy and apt ships an old version, without `gitleaks git`/`dir`.
- Weekly Dependabot for npm, grouped (free, uses no Actions minutes). A Dependabot PR goes through the same
  `pr:check` before merging.
- No CodeQL and no `dependency-review` (they required Actions). Before adding a new dependency, check
  `npm audit` and the license.
- `scripts/setup-github.sh` turns off Actions, leaves only squash merge and tries branch protection, which is not
  enforced on a private repository on the free plan (it requires GitHub Pro). Without it, the local hooks
  (`guard-bash`, `pre-push` → `protected-branches.sh`) prevent direct pushes to `main`.
