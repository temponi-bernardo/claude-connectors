# Coding standards

The non-negotiable rules from CLAUDE.md, explained. What ESLint checks is marked with ⚙️; the rest is human review
(the PR checklist).

## 1. Nothing repeated ⚙️ (jscpd, zero limit)

No duplicated function, constant, data or style. Two identical or near-identical snippets become one shared
function with a clear name. `npm run dup:check` fails on any clone of 50+ tokens (tests and fixtures excluded;
`docs/FUNCTIONS.md` and `docs/adr/` too, because they follow fixed templates that repeat structure, not content).
_Similar_ logic that jscpd misses is the review's job.

## 2. Small functions with a single job ⚙️

- Up to **25 lines** (not counting blank lines and comments) — `max-lines-per-function`.
- Up to **3 parameters**; more than that becomes a typed object — `max-params`.
- Cyclomatic complexity up to **8**, nesting up to **3** — `complexity`, `max-depth`.
- If the function's description needs an "and", split it.
- **Deciding apart from doing:** pure functions (calculation, validation, decision) do not touch disk, network,
  stdout or global state; functions with effects are thin and call the pure ones. The **Efeitos** (effects) field
  in FUNCTIONS.md makes this explicit.

## 3. Function names unique across the whole repository ⚙️ (`docs:check`)

One name, one function. This makes `FUNCTIONS.md` an unambiguous index and lets "Usada por" (used by) be computed
without confusion. Prefer names that carry their context: `renderGeneratedBlock`, not `render`.

Frameworks that require fixed names (`GET`, `loader`, `default`) stay in entry files and are recorded as a
documented exception in ARCHITECTURE.md when the stack is chosen.

## 4. Function declarations ⚙️

Top-level functions are declared with `function` (`func-style: declaration`), never as an arrow assigned to a
`const`. Arrow functions are for inline callbacks. Every exported function has explicit types at its boundaries
(`explicit-module-boundary-types`).

## 5. Types

Strict TypeScript with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. No `any`; use `unknown` and
narrow it. No `!` (non-null assertion) outside tests. External input data is validated at the edge and becomes
domain types.

## 6. Errors

Throw an `Error` whose message says **what** failed and **how to fix it**. Do not swallow errors silently; if a
`catch` returns a default value, document it in **Erros** (errors) and **Saída** (output).

## 7. Names

- Identifiers in English, `camelCase` for functions/variables, `PascalCase` for types, `UPPER_SNAKE_CASE` for
  exported constants.
- Booleans as questions: `isAnalyzedSource`, `hasTests`.
- Functions with a verb: `collectFunctions`, `renderNewSection`, `checkStructure`.
- Files in `kebab-case.ts`; the test sits next to them: `file.test.ts`.

## 8. Comments

A one-line JSDoc on every function (`/** What it does. */`) — the same sentence goes into the **Faz** (what it
does) field. Comments explain the why, never the obvious. No commented-out code.

## 9. Imports

ESM with the `.js` extension on relative imports (`moduleResolution: NodeNext`). `import type` for types
(`consistent-type-imports`). Respect the dependency table in [ARCHITECTURE.md](ARCHITECTURE.md).

## 10. Language

Everything is in English ([ADR 0021](adr/0021-english-across-the-repository.md)): code, identifiers, commit
messages (type, scope and description), docs, comments, error messages and user-facing messages. Text that is
still Portuguese is being translated in the roadmap's F4 tasks.
