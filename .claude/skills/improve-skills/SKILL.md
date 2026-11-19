---
name: improve-skills
description: Run only when the person calls /improve-skills, to decide whether a skill or agent should be created, updated or removed after a repeated step, a changed command, hook or rule, or a skill that led to a mistake — and do it in the same PR.
disable-model-invocation: true
---

# Review the project skills and agents

CLAUDE.md rule 9: a repeated step, command, tool or new rule → a skill created or updated in the same PR. Skills
live in `.claude/skills/<name>/SKILL.md`, agents in `.claude/agents/<name>.md`. It runs only when the person
calls it, not at the end of every task.

## Questions to answer (all of them, quickly)

1. Did I repeat a manual procedure in this task that no skill covers? → **create**.
2. Did a skill tell me to do something in a way that did not work, is outdated, or duplicates a rule already in
   the docs? → **update** (point to the doc instead of copying the rule).
3. Did a command (`package.json`), hook, path or doc that a skill cites change? → **update**.
4. Has a skill gone unused for a long time and is covered by another? → **remove**.
5. Did noisy work (long output, wide search, independent check) come back into the main context? → a new or
   existing **agent** (`docs-explorer`, `reviewer`).

## How to write a skill

- `name` in English kebab-case (ADR 0021); `description` says **when** to use it (a concrete trigger), not just
  what it does — Claude decides to invoke it from that.
- Short numbered steps pointing to the docs. Don't copy rules from CODING-STANDARDS, TESTING or WORKFLOW: link.
- `disable-model-invocation: true` on skills with external effects that the person should trigger (release,
  creating a repository). `context: fork` on long audits that would pollute the context.
- Test it mentally: could a new session, with only CLAUDE.md and this skill, carry it out?

## How to write an agent

- File `.claude/agents/<name>.md` with `name`, `description` (when to delegate), minimal `tools` and
  `disallowedTools: Edit, Write, NotebookEdit` if read-only; `model: haiku` and `effort: low` for mechanical work.
- The agent starts without the history: the body says everything it needs and the short answer format.
- A decision that must be guaranteed (merge, security) does not live in an agent: it goes into tested code or a
  hook; the agent only runs and reports.

## Close

If the skill introduced a new command, update `docs/WORKFLOW.md` (CLAUDE.md does not list skills or agents:
Claude Code already loads them).
Commit `chore(skills): ...` in the task's PR.
