# Testing

## Tests first (TDD)

1. Write the test that describes the desired behavior.
2. Run it and **watch it fail** for the right reason.
3. Write the minimum code that makes it pass.
4. Refactor with the tests green.

For a bug: first the test that reproduces the bug (failing), then the fix. The `/testes-primeiro` skill drives the
cycle.

## Rules

- **Every function has a test.** `docs:check` fails if a function's name does not appear in any `*.test.ts`
  file. This checks presence, not quality: review checks that the test covers behavior, edge cases and errors.
- Minimum coverage **90%** (lines, functions, branches, statements) in `src/**` and `tools/**`, measured by
  `npm run test:coverage`. Entry points (`remote-main.ts`, `cli.ts`) and fixtures are excluded from the measure.
- The test sits next to the code: `client.ts` → `client.test.ts`.
- Pure functions: table tests (input → output), no mocks.
- Functions with effects: use a real temporary directory (`mkdtempSync`) instead of mocking `fs`; clean up in
  `afterAll`. Mocks only for network and clock.
- Test names describe the behavior, in English ([ADR 0021](adr/0021-english-across-the-repository.md)):
  `it('strips hyphens at the ends')`.
- One `expect` per concept; several `expect`s for the same concept are fine.

## Exceptions

A function without an automated test needs an entry in `src/test-exceptions.ts` (`TEST_EXCEPTIONS`), with `reason`
and `manualTest` filled in. `docs:check` fails if an exception names a function that does not exist. Acceptable
exceptions: entry points that only dispatch; code that depends on hardware/UI with no harness. Not acceptable:
"hard to test" — refactor by separating decision from effect.

## Fixtures

Large test data goes in `tools/<tool>/fixtures/` or `src/<module>/fixtures/` (ignored by lint, jscpd and
`docs:check`). Prefer small inline fixtures.

## Commands

| Command                               | Does                                             |
| ------------------------------------- | ------------------------------------------------ |
| `npm test`                            | Runs everything once                             |
| `npm run test:watch`                  | Interactive mode                                 |
| `npm run test:coverage`               | With coverage and thresholds (what `check` runs) |
| `npx vitest run path/to/file.test.ts` | A single file                                    |
