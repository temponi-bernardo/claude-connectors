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
   Only open code that FUNCTIONS.md points to. "Where is / who uses" questions go to the `docs-explorer`
   agent, which returns only the answer.
2. **Mark the task as 🟨** in the ROADMAP.
3. **Branch** from an up-to-date `main`: `git switch -c <type>/<id>-<description>` (see `docs/WORKFLOW.md`).
   In a new worktree (`.claude/worktrees/...`), run `npm ci` first: without its own `node_modules`, `check` and
   `build` do not run.
4. **Implement with `/tests-first`**: test → fail → minimal code → refactor, one function at a time, following
   `docs/CODING-STANDARDS.md`. Before creating a function, look for an equivalent in FUNCTIONS.md.
5. **Document with `/update-docs`** in the same set of changes.
6. **Commits**: small, Conventional Commits with an English description (ADR 0021). The `pre-commit` only runs
   lint-staged and `docs:check`; `pre-push` only guards `main` (ADR 0029). While working, run just the tests of
   what you touched (`npx vitest run <path>`).
7. **`npm run pr:check -- "<PR title>"` once**, after the last commit: it is the CI of the delivery (there is no
   GitHub CI, ADR 0006). Red: fix, commit and run it again. Do not use `--no-verify`; fix the cause. In a Claude
   Code cloud session the Docker daemon is installed but stopped, and `whatsapp:build` needs it even in dry-run:
   start it first with `(dockerd > /dev/null 2>&1 &)` and wait until `docker info` answers.
8. **`/review-pr`** once: the `reviewer` agent reviews the whole PR, you fix once (rerun `pr:check` if code
   changed). No loop.
9. **PR:** `gh pr create` with a conventional title, body from the template (`.github/PULL_REQUEST_TEMPLATE.md`),
   documentation checklist filled item by item and the review findings that were left. Without `gh` (cloud
   session), open and merge the PR with the GitHub MCP tools (`create_pull_request`, `merge_pull_request` with
   `merge_method: squash`).
10. **Merge:** Claude merges with the green `pr:check` of step 7 (`docs/WORKFLOW.md`); no second run unless a
    commit came after it. `gh pr merge --squash --delete-branch`. If the PR touched the Canvas connector, deploy the remote
    server from the updated `main`: `npm run worker:deploy` (needs `CLOUDFLARE_API_TOKEN`, ADR 0010). If it
    touched the Gmail connector, `npm run gmail:deploy` (ADR 0014); without a token in the session, hand the
    command to the user. Before shipping a Worker, run `npm run gmail:dev` (or `worker:dev`) and `curl` `/`: the
    real runtime rejects things the Node tests accept (e.g. a non-function named export in the main module).
    Every `*:deploy` script ends with `npm run smoke -- <connector>` (ADR 0027): if it fails, the published
    `GET /tools` differs from `tool-contract.json` — fix it or `wrangler rollback`, never edit the contract to match
    a broken deploy. Adding, removing or renaming a tool means updating that connector's `tool-contract.json` in
    the same PR; a tool that depends on a flag or permission is gated with `gateToolSpecs()`, never left out.
    If it touched WhatsApp (`connectors/whatsapp/`), `pr:check` already runs `bridge:test` (Go 1.26+) and
    `whatsapp:build`; the deploy (`npm run whatsapp:deploy`, with Docker) belongs to whoever hosts it (ADR 0015).
11. **Close the task:** ✅ in the ROADMAP, "Next task" updated, CHANGELOG entry if user-visible. This can go in
    the same PR (preferred) or in an immediate `docs(docs): ...` PR.
12. **`/handoff`**: overwrite `docs/STATE.md` (local, never committed) and tell the user to run `/clear`.

## Don't

Don't start coding without reading the docs; don't create a function without a test; don't leave `_fill_in_`
in FUNCTIONS.md; don't open a PR with a red `pr:check` or without `/review-pr`; don't touch `main`; don't end the task without `/handoff`.
Don't write files through a heredoc or script in Bash if the text has `.env` in quotes (e.g. `process.env`): the
guard blocks it; use Write/Edit.
