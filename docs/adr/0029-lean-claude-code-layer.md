# 0029 — Lean Claude Code layer: checks once per PR, no hidden model calls

- **Status:** Accepted
- **Date:** 2026-11-19
- **Related:** supersedes ADR 0017 and the `Stop`/`PreCompact` part of ADR 0004; complements ADR 0006 (no
  GitHub Actions). Ported from the `template-new-project` repository (its ADRs 0013, 0015, 0016 and 0017).

## Context

A simple change cost too much ceremony. `npm run check` ran in the `pre-push`, again in `npm run pr:check` before
opening the PR and again before merging: three or four full runs per PR, each one to two minutes. The `Stop`
hooks blocked the turn on every commit without a fresh `STATE.md` and re-ran `docs:check` on every reply. The
`PreCompact` and `SessionEnd` hooks opened hidden `claude -p` calls to write the handoff. `/improve-skills` was a
mandatory step of every task. The guard on Bash matched text, not commands, so a heredoc mentioning
`git … push … main` was blocked. The template repository had already moved away from all of this.

## Decision

- **Checks once per PR.** `npm run pr:check` runs once after the last commit and is reused for the merge unless a
  commit came after it. The `pre-commit` keeps only the fast part (lint-staged and `docs:check`, which also catches
  a function without a test) and refuses `.github/workflows/`. The `pre-push` keeps two fast barriers: gitleaks (`secrets:check`, a few seconds, so a
  secret never reaches GitHub even on a task branch) and the refusal to update or delete
  `main`/`master` on the remote (`.githooks/protected-branches.sh`), for anyone.
- **No hidden model calls.** `precompact-handoff.sh` and `session-end-handoff.sh` are removed: `/handoff` is manual,
  the last step of `/task`.
- **No blocking `Stop` on every commit.** `stop-handoff.sh` and `stop-docs-check.sh` are removed (the `pre-commit`
  already runs `docs:check`). `stop-plugin-docs.sh` stays: it is this repository's rule 5 and does not loop.
- **Guards before the fact.** `guard-edit.mjs` (`PreToolUse` on Edit/Write) blocks writes to `.github/workflows/`,
  `.env*`/`.dev.vars*` and key files; `format-on-edit.mjs` (`PostToolUse`) runs Prettier on the edited file;
  `guard-bash.mjs` matches `git` followed by the subcommand and the protected branch as a whole refspec, and
  blocks starting GitHub Actions workflows.
- **Agents.** `docs-explorer` (haiku, read-only) answers "where/what" from the docs and audits docs × code for
  `/sync-docs`; `reviewer` (sonnet, read-only) reviews the whole PR once, through the new `/review-pr` skill, with
  one round of fixes and no loop.
- `/improve-skills` and `/sync-docs` run only when the person calls them (`disable-model-invocation`). `CLAUDE.md`
  gets a "How to work" section (a simple request is done directly) and drops the skills table and the hook
  description, which live in `docs/WORKFLOW.md`.

## Alternatives considered

| Alternative                                           | Why not                                                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Template's `dev`/`main` branching (its ADR 0011)      | Adds a sync branch and a release PR per version; this repository ships through release-please on `main` and deploys |
| Template's merge gate (`pr:merge`, `review:record`)   | Built on `gh`, which cloud sessions here do not have (PRs go through the GitHub MCP); more steps, not fewer         |
| Template's `docs/GOAL.md` with a blocking `Stop` hook | Another `Stop` block per task; the roadmap's "Done when" and `/task` already define done                            |
| Template's project sheet (`PROJECT.md`, `guard-spec`) | Bootstraps a new project from the template; this repository already has PRODUCT, ARCHITECTURE and 28 ADRs           |
| Keep `pre-push` running `npm run check`               | Duplicates `pr:check`; a push to a task branch never reaches `main` without `pr:check`                              |
| Keep the `SessionEnd`/`PreCompact` handoff            | A hidden model call per session end; a forgotten handoff costs less than paying for it every time                   |

## Consequences

- Positive: a commit and a push take seconds; one full check per PR; no model call outside the
  conversation; the guard no longer blocks heredocs that only mention push and main.
- Negative / accepted costs: a broken type or test can sit on a task branch until `pr:check`; a `/clear` without
  `/handoff` loses the in-progress summary (git still has the commits); the review is one pass and its leftovers
  only go into the PR body.
- Docs that change: CLAUDE.md, WORKFLOW.md, DOCUMENTATION.md, STRUCTURE.md, the `task`, `improve-skills`,
  `sync-docs` and `handoff` skills, ADR 0004 and 0017 statuses.
