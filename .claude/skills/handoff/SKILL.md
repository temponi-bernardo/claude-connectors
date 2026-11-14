---
name: handoff
description: Use when finishing a task or a big step, or when the Stop hook asks for it. Overwrites docs/STATE.md with a short, concrete summary of what was done, what is in progress and the next steps, so the next session resumes without this session's excess context.
---

# Context handoff

Goal: the next session (after `/clear`) starts knowing exactly where things stopped, reading only
`docs/STATE.md`.

## Steps

1. Collect what changed in this session: `git status --porcelain`, `git log --oneline main..HEAD` (or the last
   commits) and what you remember of decisions and open errors.
2. **Overwrite** `docs/STATE.md` with exactly these sections, in this order:
   - `# Current state` — one line of context (branch, task, date).
   - `## Current task` — roadmap id and "Done when" criterion.
   - `## Done` — concrete bullets (file, function, command), in the past tense.
   - `## In progress` — what is half done and **at which exact point** it stopped.
   - `## Next steps` — numbered, actionable list; first item = what to do when resuming.
   - `## Files touched` — paths, one per line, with a word on why.
   - `## Decisions and open items` — decisions made (with a link to the ADR if any), open questions, unresolved
     errors, commands that failed.
3. Limit: **60 lines**. No narrative, no history already committed in earlier versions of STATE.md. A fact
   duplicated in ROADMAP/CHANGELOG/ADR → link instead of repeating.
4. If the task is closed: also update `docs/ROADMAP.md` (status and "Next task"), as `.claude/rules/docs.md`
   says.
5. **Don't commit** STATE.md: it is local to each clone and is in `.gitignore`
   ([ADR 0005](../../../docs/adr/0005-state-md-local-per-clone.md)). So it can be written after the merge,
   already on `main`.
6. End the reply with: **"Handoff saved to docs/STATE.md. Run `/clear` to continue with a clean context."**

## Don't

Don't paste diffs or command output; don't leave `_preencher_`; don't record secrets or paths outside the
repository; don't skip the `/clear` notice.
