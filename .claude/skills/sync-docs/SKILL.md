---
name: sync-docs
description: Use to audit the whole documentation against the code when you suspect drift the machine does not catch (stale Faz/Entrada/Saída/Efeitos/Erros fields, processes that do not match the real flow, outdated ROADMAP or ARCHITECTURE), for example after each finished phase or before a release.
context: fork
agent: general-purpose
---

# Docs × code audit

`docs:check` guarantees presence and structural consistency. This skill covers the **content**: what the
machine does not read. Work in a subagent and return only the report and the fixes.

## Steps

1. Run `npm run docs:check` and `npm run docs:generate`; if anything changed, that is already a drift to report.
2. **FUNCTIONS.md, function by function:** open the file it points to and check the five manual fields against
   the code. Watch for: undeclared effects (console, disk, network), thrown errors missing from "Erros",
   parameters whose meaning changed, a "Faz" with "and" (a function doing two things → note it as debt).
3. **PROCESSES.md:** for each process, follow the real flow from its trigger and check that the steps, order,
   result and failures match. Processes without a real trigger or real flows without a process → fix.
4. **STRUCTURE.md:** are the folder descriptions still true? Do the "main files" exist? Does the "where to put
   something new" table cover the kinds of files that appeared?
5. **ARCHITECTURE.md:** `grep -r "from '" src tools` and check the imports against the dependency table; are the
   external services used listed? Do the accepted ADRs still describe what is implemented?
6. **ROADMAP.md / CHANGELOG.md / PRODUCT.md:** statuses consistent with what exists; "Next task" correct;
   product decisions made in conversations/PRs recorded with a date.
7. **CLAUDE.md and skills:** do the listed commands exist in `package.json`? Do the skills reference docs that
   exist?
8. **Fix** everything objective; list what needs a decision as a question.
9. **Final report:** a "Doc | Drift | Fix applied or question" table, followed by a green `npm run docs:check`.
   Open a `docs(docs): sync documentation with the code` PR.
