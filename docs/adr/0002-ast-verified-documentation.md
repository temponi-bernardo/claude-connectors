# 0002 — Documentation checked and generated from AST analysis

- **Status:** Accepted
- **Date:** 2026-10-01
- **Related:** F0.1, ADR 0001

## Context

We want `docs/FUNCTIONS.md` to list every function with correct "Usada por" and "Processos", without anyone
maintaining that by hand. An earlier regex-based version needed a growing list of special cases (skip
comments, strings, `${}`, object keys, find the owning function by the indentation of `}`), and still got it
wrong.

## Decision

Use the AST (ts-morph) to register top-level functions, resolve references by symbol and find the function
that contains each reference. Fields derivable from the code (Arquivo, Assinatura, Usada por, Processos) are
**generated** by `docs:generate` in marked blocks; `docs:check` only fails if a generated block is out of
date. Intent fields (Faz, Entrada, Saída, Efeitos, Erros) stay manual and required.

## Alternatives considered

| Alternative                                        | Why not                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| Regex over the code                                | Endless list of exceptions; false positives in strings and comments      |
| Check only (no generation)                         | Forces writing by hand data the machine already knows; churn in every PR |
| TypeDoc                                            | Generates an API reference, but no "Usada por" nor links to processes    |
| Require arrow vs. `function` because of the parser | With an AST the restriction is unnecessary; kept only as style (lint)    |

## Consequences

- Positive: zero regex over code; exact error messages (expected × found); fewer tokens spent by Claude
  writing what the machine generates.
- Negative: `docs:check` takes a few seconds (ts-morph loads the program); depends on TypeScript as the
  analyzed language (see ADR 0001).
- Docs that change: DOCUMENTATION.md (function template), FUNCTIONS.md (markers).
