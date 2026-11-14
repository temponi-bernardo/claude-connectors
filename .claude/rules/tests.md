---
paths:
  - '**/*.test.ts'
---

# When editing tests

- Test first, watch it fail, then implement (`docs/TESTING.md`).
- Test names in English describing the behavior (ADR 0021).
- Disk effects: a real temporary directory (`mkdtempSync`) + cleanup; don't mock `fs`.
- Minimum coverage 90%; `npm run test:coverage` shows what is missing.
- A function without a test only with an entry in `src/test-exceptions.ts`, with a reason and a manual test.
