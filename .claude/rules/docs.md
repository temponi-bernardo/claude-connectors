---
paths:
  - 'docs/**/*.md'
  - 'CHANGELOG.md'
---

# When editing documentation

- Follow the templates in `docs/DOCUMENTATION.md`; a fact lives in one place only, the others link to it.
- Never edit the content between `<!-- gerado:inicio -->` and `<!-- gerado:fim -->` — run `npm run docs:generate`.
- An accepted ADR is not edited: create a new one that supersedes it.
- When finishing a task, update the status in `docs/ROADMAP.md` and the "Next task" at the top, and overwrite
  `docs/STATE.md` with `/handoff` (a local file, outside git).
- User-visible change → an entry in `CHANGELOG.md`, "Unreleased" section.
- English (ADR 0021), short sentences, code identifiers in backticks. Existing Portuguese text is translated in
  roadmap phase F4.
