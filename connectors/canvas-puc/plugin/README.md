# canvas-puc plugin

Claude plugin for the PUC Minas Canvas LMS. It connects Claude to the remote MCP server at
`https://canvas-puc-remote.bftemponi.workers.dev/mcp` (see `.mcp.json`) and adds usage skills in `skills/`.
Nothing runs on your computer. The service page, privacy policy and terms are on the
[project site](https://claude-connectors-site.bftemponi.workers.dev/).

## Install

```
/plugin install canvas-puc --marketplace temponi-bernardo/claude-connectors
```

## Skills

- `/setup-canvas` — guided setup (token, connection and test).
- `/weekly-summary` — assignments due, overdue work, announcements and grades for the week.
- `/prepare-submission` — description, rubric, checklist, plan and review; submits only with confirmation.
- `/study-course` — module summaries, key concepts, review questions and a plan up to the exam.
- `/planejamento-faculdade` — builds and keeps the "Plano do Semestre AAAA/S" artifact: risk per course, today and
  tomorrow, a day-by-day study plan, course cards with a points bar, a timeline with persistent checklists and
  questions for instructors. Optional source: the `gmail` plugin of this marketplace; it offers
  three daily routines (morning, night and an unsent-assignment alert). Read-only on every connector.
