# 0017 — Automatic handoff on SessionEnd

- **Status:** Superseded by [0029](0029-lean-claude-code-layer.md)
- **Date:** 2026-11-14
- **Related:** complements ADRs 0004 and 0005 (handoff in `docs/STATE.md`)

## Context

The small-context cycle depends on `/handoff` before `/clear`. `Stop` only asks for the handoff when there is a
new commit, and `PreCompact` only runs when the conversation is compacted. A `/clear` (or the end of the
session) after editing files without committing lost the state: the next session started without knowing what
was in progress.

## Decision

A `SessionEnd` hook (`session-end-handoff.sh`) reuses the `PreCompact` generation (`generate_handoff` in
`hook-lib.sh`, via `claude -p`). It only generates when `handoff_is_stale` says the transcript has work (Edit,
Write, MultiEdit, NotebookEdit outside `STATE.md`, or Bash with `git commit`/`merge`/`push`) after the last
change to `STATE.md`. The 60 s `timeout` in `settings.json` raises SessionEnd's default 1.5 s budget.

## Alternatives considered

| Alternative                                   | Why not                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------------ |
| Generate on every SessionEnd                  | Spends tokens and blocks `/clear` for up to 45 s even in chat-only sessions    |
| Run `claude -p` in the background (detached)  | The `/clear` SessionStart would read the old STATE.md; the result arrives late |
| Block `/clear` until there is a handoff       | Impossible: SessionEnd has no decision control                                 |
| Compare only the `.claude/.last-handoff` mark | The mark only moves with a commit; it does not detect uncommitted edits        |

## Consequences

- Positive: `/clear` or exiting without a handoff no longer loses the state; a session with no work costs
  nothing.
- Negative / accepted costs: when it fires, `/clear` waits for `claude -p` (up to `CLAUDE_HANDOFF_TIMEOUT`,
  45 s); edits made through Bash other than `git commit`/`merge`/`push` (e.g. `sed -i`) do not count as work; the
  Claude Code docs do not guarantee that SessionEnd finishes before the `/clear` SessionStart — if it does not,
  the handoff applies to the following session. Turn it off with `CLAUDE_HANDOFF_AUTOGEN=0`.
- Docs that change: WORKFLOW.md, DOCUMENTATION.md, CLAUDE.md and the ADR index.
