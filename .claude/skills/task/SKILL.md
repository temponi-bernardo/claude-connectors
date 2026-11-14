---
name: task
description: Use to take the next task from docs/ROADMAP.md (or a given task, e.g. "F2.1") from understanding to merge, through branch, TDD, documentation, check and PR.
argument-hint: '[task id, e.g. F2.1]'
---

# Run a roadmap task

Target task: `$ARGUMENTS` (empty = the "Next task" at the top of `docs/ROADMAP.md`).

## Steps

1. **Understand through the docs, not the code.** Read the task's line in the ROADMAP ("Done when" criterion),
   then whatever `docs/README.md` points to: PROCESSES.md for the affected flow, FUNCTIONS.md for the functions
   involved (and their callers), ARCHITECTURE.md for the right layer, STRUCTURE.md for where new files go.
   Only open code that FUNCTIONS.md points to.
2. **Mark the task as 🟨** in the ROADMAP.
3. **Branch** from an up-to-date `main`: `git switch -c <type>/<id>-<description>` (see `docs/WORKFLOW.md`).
   In a new worktree (`.claude/worktrees/...`), run `npm ci` first: without its own `node_modules`, `check` and
   `build` do not run.
4. **Implement with `/tests-first`**: test → fail → minimal code → refactor, one function at a time, following
   `docs/CODING-STANDARDS.md`. Before creating a function, look for an equivalent in FUNCTIONS.md.
5. **Document with `/update-docs`** in the same set of changes.
6. **`npm run check`** until green. Do not use `--no-verify`; fix the cause.
7. **Commits**: small, Conventional Commits with an English description (ADR 0021).
8. **PR:** `gh pr create` with a conventional title, body from the template (`.github/PULL_REQUEST_TEMPLATE.md`),
   documentation checklist filled item by item. Before that, run `npm run pr:check -- "<PR title>"` (there is no
   CI, ADR 0006); fix until green; answer comments.
9. **Merge:** Claude merges with a green `pr:check` (`docs/WORKFLOW.md`). Run `pr:check` again on the final
   branch, then `gh pr merge --squash --delete-branch`. If the PR touched the Canvas connector, deploy the remote
   server from the updated `main`: `npm run worker:deploy` (needs `CLOUDFLARE_API_TOKEN`, ADR 0010). If it
   touched the Gmail connector, `npm run gmail:deploy` (ADR 0014); without a token in the session, hand the
   command to the user. Before shipping a Worker, run `npm run gmail:dev` (or `worker:dev`) and `curl` `/`: the
   real runtime rejects things the Node tests accept (e.g. a non-function named export in the main module).
   If it touched WhatsApp (`connectors/whatsapp/`), `pr:check` already runs `bridge:test` (Go 1.26+) and
   `whatsapp:build`; the deploy (`npm run whatsapp:deploy`, with Docker) belongs to whoever hosts it (ADR 0015).
10. **Close the task:** ✅ in the ROADMAP, "Next task" updated, CHANGELOG entry if user-visible. This can go in
    the same PR (preferred) or in an immediate `docs(docs): ...` PR.
11. **`/improve-skills`**: did something repeat or change? Update the skill in the same PR.
12. **`/handoff`**: overwrite `docs/STATE.md` (local, never committed) and tell the user to run `/clear`. The
    `Stop` hook enforces it when you have a new commit without a handoff.

## Don't

Don't start coding without reading the docs; don't create a function without a test; don't leave `_fill_in_`
in FUNCTIONS.md; don't open a PR with a red `check`; don't touch `main`; don't end the task without `/handoff`.
Don't write files through a heredoc or script in Bash if the text has `.env` in quotes (e.g. `process.env`): the
guard blocks it; use Write/Edit.
