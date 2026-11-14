---
paths:
  - 'src/**/*.ts'
  - 'tools/**/*.ts'
  - 'connectors/**/*.ts'
---

# When editing code

- Before creating a function, look in `docs/FUNCTIONS.md` for an equivalent. Nothing repeated.
- New function: unique name in the repository, top-level `function`, ≤ 25 lines, ≤ 3 parameters, one-line
  JSDoc. Pure whenever possible; effects in a separate thin function.
- After creating/renaming/removing a function: `npm run docs:generate`, fill Does/Input/Output/Effects/Errors in
  `docs/FUNCTIONS.md` and cite the function in the right process in `docs/PROCESSES.md`.
- New exported constant → a row in the "Data and constants" table.
- New folder → a row in `docs/STRUCTURE.md`.
- Never read `.env`; the variable names are in `.env.example`.
- New MCP tool: English `name` and `title`, and `annotations: toolAnnotations('<Title>', <PRESET>)` from
  `src/mcp/annotations.ts` (`READ_ONLY_HINTS` for reads; `SEND_HINTS`/`DESTRUCTIVE_HINTS` for anything that
  sends, submits, overwrites or deletes). The typecheck fails without them (Connectors Directory requirement).
