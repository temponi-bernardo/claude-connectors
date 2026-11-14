---
name: update-docs
description: Use after changing code and before opening or updating a PR, to collect the diff, classify each change with the table in docs/DOCUMENTATION.md, apply the updates in the right order and run docs:check.
---

# Update the documentation from the diff

Guide and templates: `docs/DOCUMENTATION.md`. Index of what exists: `docs/README.md`.

## Steps

1. **Collect the diff:** `git diff main...HEAD --stat` and `git diff main...HEAD -- src tools connectors .claude-plugin`
   (or the task's range). List: functions created/renamed/removed, changed signatures, new exported constants,
   new folders, new UI components, changed flows, new dependencies.
   A plugin change (`connectors/`, `.claude-plugin/`: manifest, version, tools, `.mcp.json`, deploy) always
   requires documentation: the connector README, the CHANGELOG and whatever else the table asks for. The `Stop`
   hook `stop-plugin-docs.sh` blocks ending the turn until it exists.
2. **Classify** each item with the "change → which doc to update" table in `docs/DOCUMENTATION.md`.
3. **Apply in this order:**
   1. `npm run docs:generate` (index, generated blocks, new sections in FUNCTIONS.md).
   2. Fill the manual fields of the new sections (Does, Input, Output, Effects, Errors — the labels `docs:check`
      parses); remove sections of deleted functions; add constants to the "Data and constants" table. A function
      that moved to another file gives `SECTION_IN_WRONG_MODULE`: `docs:generate` does not move the section; move
      it under the new file's heading.
   3. PROCESSES.md: create/edit the process citing the functions as `` `name()` ``; then run
      `npm run docs:generate` again (the Processes field depends on it).
   4. STRUCTURE.md (folders), UI.md (components), ARCHITECTURE.md (layers, services), an ADR if there was a
      decision, PRODUCT.md if there was a product decision, WORKFLOW.md/CLAUDE.md if a command or rule changed.
   5. ROADMAP.md (status and "Next task") and CHANGELOG.md ("Unreleased").
   6. `.env.example` if a new variable appeared; GLOSSARY.md if a new term appeared.
4. **`npm run docs:check`** until `✔`. Read each message: it says exactly what is missing or extra.
   A `GENERATED_BLOCK_OUTDATED` that comes back after Prettier is usually a signature with an inline object
   type spanning several lines (parameter or return): Prettier reindents the block and the generator does not.
   Name the type (`interface`) and run `docs:generate` again.
5. **Report** in the PR body using the template checklist: for each doc, "updated" or "n/a: reason".
