# 0006 — No GitHub Actions: checks and release run locally

- **Status:** Accepted
- **Date:** 2026-11-05
- **Related:** task F0.2, ADR 0003 (partly superseded)

## Context

The repository owner wants no GitHub Actions cost at all. The repository is private, and in private
repositories Actions minutes are billed or use up the plan's quota. All work is done by Claude Code on the
local machine, which already has the git hooks and `npm run check`.

## Decision

GitHub Actions is disabled in the repository and there are no files in `.github/workflows/`. The CI role moves
to the local script `npm run pr:check -- "<PR title>"`, required before opening and before merging a PR.
release-please stays (ADR 0003), but runs through the local CLI (`npx release-please`), which only uses the
GitHub API.

## Alternatives considered

| Alternative                        | Why not                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------- |
| Keep CI on Actions                 | Minutes cost in a private repository, refused by the owner.                |
| Public repository (free Actions)   | Exposes code and personal Canvas access configuration.                     |
| Self-hosted runner                 | Requires keeping a service running; Claude already runs it all locally.    |
| Git hooks only, without `pr:check` | `pre-push` does not check the PR title, the build or the `.mcpb` packages. |

## Consequences

- Positive: zero Actions cost; the same command runs on the PC and decides the merge.
- Negative / accepted costs: nothing on the server prevents an unchecked merge; the discipline lives in the
  flow (`/tarefa` skill) and the hooks. gitleaks becomes required locally (`secrets:check` fails without it).
  CodeQL and `dependency-review` are dropped; Dependabot (free) stays, for npm only.
- Docs that change: WORKFLOW (PR, release, security), CLAUDE.md, STRUCTURE (`.github/workflows/` removed), the
  `/tarefa` and `/lancar-versao` skills, SECURITY.md.
