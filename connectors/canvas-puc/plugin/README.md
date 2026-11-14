# canvas-puc plugin

Claude plugin for the PUC Minas Canvas LMS. It connects Claude to the remote MCP server at
`https://canvas-puc-remote.bftemponi.workers.dev/mcp` (see `.mcp.json`) and adds usage skills in `skills/`.
Nothing runs on your computer. The server code and the full guide live one folder up, in
[`connectors/canvas-puc/`](../README.md).

## Install

```
/plugin install canvas-puc --marketplace temponi-bernardo/claude-connectors
```

## Skills

- `/setup-canvas` — guided setup (token, connection and test).
- `/weekly-summary` — assignments due, overdue work, announcements and grades for the week.
- `/prepare-submission` — description, rubric, checklist, plan and review; submits only with confirmation.
- `/study-course` — module summaries, key concepts, review questions and a plan up to the exam.
