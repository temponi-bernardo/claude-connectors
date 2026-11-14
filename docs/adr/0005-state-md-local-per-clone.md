# 0005 — `docs/STATE.md` as local state of each clone

- **Status:** Accepted
- **Date:** 2026-10-19
- **Related:** partly supersedes ADR 0004 (where STATE.md lives and the `Stop` hook criterion)

## Context

ADR 0004 kept `docs/STATE.md` under version control. But `/handoff` runs at the end of the task, after the
squash merge, already on `main` — where nobody commits. The handoff was left as a loose change on `main`,
ended up in the next PR (unrelated to it) or caused conflicts. Also, the `Stop` hook treated any new HEAD as
"task done", including one that arrives via `git pull`, and demanded a handoff with no work done.

## Decision

`docs/STATE.md` is **local to each clone**: it is in `.gitignore`, overwritten by `/handoff` and read by the
`SessionStart` hook as before, but never committed. The `Stop` hook only demands a handoff when there is a
new commit **made by this person** (committer = `git var GIT_COMMITTER_IDENT`); commits by others, like the
GitHub squash brought in by `git pull`, only advance the marker.

## Alternatives considered

| Alternative                                 | Why not                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| Do the handoff inside the PR, before squash | The post-merge state (next task, merge done) would never be in the handoff  |
| Commit directly to `main` just for STATE.md | Violates "nothing directly on `main`" and branch protection                 |
| Ignore commits already in `@{upstream}`     | A push in the same turn as the commit would make the hook stop demanding it |

## Consequences

- Positive: `main` stays clean after each task; no PR carries another task's handoff; `git pull` does not
  trigger a false demand.
- Negative / accepted costs: the handoff is not reviewed in a PR nor shared across machines — whoever switches
  machines restarts from the ROADMAP and the PR history. A new clone starts without STATE.md (`SessionStart`
  warns).
- Docs that change: `.gitignore`, WORKFLOW.md, DOCUMENTATION.md, CLAUDE.md, the `/handoff` and `/tarefa`
  skills, `.claude/rules/docs.md`.
