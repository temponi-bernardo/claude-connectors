---
name: tests-first
description: Use whenever you write or change code — a new function, a behavior change or a bug fix — to drive the project's TDD cycle (test, watch it fail, minimal code, refactor), including fixtures and test exceptions.
---

# TDD cycle

Full rules in `docs/TESTING.md`; code style in `docs/CODING-STANDARDS.md`.

## New function or new behavior

1. Write the test in `<file>.test.ts` next to the code, named in English after the behavior. Cover: the normal
   case, edges (empty, limit) and every error the function can throw.
2. Run only that file (`npx vitest run <path>`) and confirm it **fails for the expected reason** (not an import
   or syntax error).
3. Write the minimal code that makes it pass: top-level `function`, unique name, ≤ 25 lines, ≤ 3 parameters,
   one-line JSDoc. Pure if possible.
4. Run again: green. Refactor (duplication, names, size) while keeping it green.
5. `npm run test:coverage` — if a branch is uncovered, add the case, not a `/* istanbul ignore */`.

## Bug

1. First write the test that **reproduces** the bug with the real input that failed. It must fail.
2. Fix it. The test passes and the others stay green.
3. Record it in the CHANGELOG ("Fixed") if the bug was user-visible.

## Effects (disk, process, network)

Split them: the decision becomes a pure function tested with a table; the effect becomes a thin function tested
with a real temporary directory (`mkdtempSync` + `rmSync` in `afterAll`) or a real subprocess. Mock only the
network and the clock.

## Fixtures

Small and inline. If you need files, `tools/<tool>/fixtures/` or `src/<module>/fixtures/` (ignored by lint,
jscpd and `docs:check`).

## Exceptions

If a function cannot have an automated test, add it to `src/test-exceptions.ts` with a concrete `reason` and
`manualTest`. "Hard to test" is not a reason: refactor.
