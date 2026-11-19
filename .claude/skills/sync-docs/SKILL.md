---
name: sync-docs
description: Use to audit the whole documentation against the code when you suspect drift the machine does not catch (stale Does/Input/Output/Effects/Errors fields, processes that do not match the real flow, outdated ROADMAP or ARCHITECTURE), for example after each finished phase or before a release.
disable-model-invocation: true
---

# Docs × code audit

`docs:check` guarantees presence and structural consistency. This skill covers the **content**: what the
machine does not read. The heavy reading goes to the `docs-explorer` agent (audit mode, read-only); this session
only applies the fixes.

## Steps

1. Run `npm run docs:check` and `npm run docs:generate`; if anything changed, that is already a drift to report.
2. **Delegate the audit to `docs-explorer`**, asking for **audit mode** (FUNCTIONS, PROCESSES, STRUCTURE,
   ARCHITECTURE, ROADMAP/CHANGELOG/PRODUCT, CLAUDE.md, skills and agents). It returns the
   "Doc | Drift | Suggested fix or question" table.
3. **Fix** everything objective; list what needs a decision as a question to the user.
4. **Final report:** the table with "applied" or "question" on each row, followed by a green
   `npm run docs:check`. Open a `docs(docs): sync documentation with the code` PR (with `/review-pr` before it).
