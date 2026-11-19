# 0004 — Context handoff in `docs/STATE.md` with Claude Code hooks

- **Status:** Partly superseded by [0005](0005-state-md-local-per-clone.md) (local STATE.md and the `Stop` criterion) and by [0029](0029-lean-claude-code-layer.md) (no `Stop`/`PreCompact` handoff hooks)
- **Date:** 2026-10-19
- **Related:** ADR 0002 (docs as the source of truth)

## Context

Long Claude Code sessions pile up irrelevant context, degrade quality and overflow the window. We want Claude
to work in small contexts: at the end of each task the context is discarded (`/clear`) and the next session
resumes with only the essentials. Constraints: Claude **cannot** run `/clear` or `/compact` on its own (they
are user commands), and hooks are shell scripts, not the AI.

## Decision

The resume state lives in `docs/STATE.md`, overwritten after each task by the `/handoff` skill. Three hooks
close the loop: `Stop` blocks ending when there is a new commit without a handoff; `SessionStart` injects
STATE.md into every session (including after `/clear` and compaction); `PreCompact` generates an automatic
handoff via `claude -p` as a safety net. The user runs `/clear` when Claude says so.

## Alternatives considered

| Alternative                                       | Why not                                                                     |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| Rely on `/compact` only                           | Unpredictable summary, loses detail; no way to choose what stays            |
| Ask Claude in CLAUDE.md to "run `/clear`"         | Impossible: there is no tool or hook for it; the rule would be ignored      |
| Hook always generates the handoff via `claude -p` | Spends tokens every turn and loses the context Claude has at the task's end |
| Block `Stop` on every turn with pending changes   | Interrupts work in progress; "new commit" marks the end of a step           |

## Consequences

- Positive: cheap, predictable resumption; `/clear` no longer costs information; STATE.md is an ordinary doc,
  reviewable in a PR.
- Negative / accepted costs: local marker `.claude/.last-handoff` (ignored by git); `PreCompact` depends on
  the `claude` binary in PATH and spends tokens when it fires.
- Docs that change: STRUCTURE.md (new skill), README.md and DOCUMENTATION.md (STATE.md), WORKFLOW.md and
  CLAUDE.md (hooks and the small-context rule).
