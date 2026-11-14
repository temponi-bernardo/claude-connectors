---
name: improve-skills
description: Use at the end of each task, or when a step repeated, a command/tool/rule changed, or a skill led to a mistake, to decide whether a skill should be created, updated or removed — and do it in the same PR.
---

# Review the project skills

CLAUDE.md rule 9: a repeated step, command, tool or new rule → a skill created or updated in the same PR. Skills
live in `.claude/skills/<name>/SKILL.md` and are listed in `CLAUDE.md`.

## Questions to answer (all of them, quickly)

1. Did I repeat a manual procedure in this task that no skill covers? → **create**.
2. Did a skill tell me to do something in a way that did not work, is outdated, or duplicates a rule already in
   the docs? → **update** (point to the doc instead of copying the rule).
3. Did a command (`package.json`), hook, path or doc that a skill cites change? → **update**.
4. Has a skill gone unused for a long time and is covered by another? → **remove** (and take it out of
   CLAUDE.md).

## How to write a skill

- `name` in English kebab-case (ADR 0021); `description` says **when** to use it (a concrete trigger), not just
  what it does — Claude decides to invoke it from that.
- Short numbered steps pointing to the docs. Don't copy rules from CODING-STANDARDS, TESTING or WORKFLOW: link.
- `disable-model-invocation: true` on skills with external effects that the person should trigger (release,
  creating a repository). `context: fork` on long audits that would pollute the context.
- Test it mentally: could a new session, with only CLAUDE.md and this skill, carry it out?

## Close

Update the "Skills" table in `CLAUDE.md` and, if the skill introduced a new command, `docs/WORKFLOW.md`.
Commit `chore(skills): ...` in the task's PR.
