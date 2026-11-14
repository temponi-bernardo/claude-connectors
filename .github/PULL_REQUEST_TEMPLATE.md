## What changes

<!-- One or two sentences. Roadmap task: F?.? -->

## How to test

<!-- Commands and what to look for. -->

## Documentation checklist (docs/DOCUMENTATION.md)

For each item: check it if you updated it **or** write "n/a: reason".

- [ ] `docs/FUNCTIONS.md` — `npm run docs:generate` run and manual fields filled in
- [ ] `docs/PROCESSES.md` — new/changed flows cite the functions
- [ ] `docs/STRUCTURE.md` — new folders
- [ ] `docs/ROADMAP.md` — task status and "Next task"
- [ ] `CHANGELOG.md` — "Unreleased" section (if user-visible)
- [ ] `docs/ARCHITECTURE.md` — layers, dependencies, external services
- [ ] `docs/adr/` — architecture decision recorded
- [ ] `docs/PRODUCT.md` — product decision recorded with a date
- [ ] `docs/UI.md` — new components (if there is an interface)
- [ ] `docs/WORKFLOW.md` / `CLAUDE.md` — commands, rules, commit scopes
- [ ] `.claude/skills/` — skill created/updated (rule 9)
- [ ] `.env.example` — new variables

## Quality checklist

- [ ] `npm run check` green locally
- [ ] Tests written before the code (or a test that reproduces the bug)
- [ ] No new function without a test (or a justified exception in `src/test-exceptions.ts`)
- [ ] PR title in the format `type(scope): description in English`
