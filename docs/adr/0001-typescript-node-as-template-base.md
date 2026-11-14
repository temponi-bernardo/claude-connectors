# 0001 — TypeScript on Node as the template base

- **Status:** Accepted
- **Date:** 2026-10-01
- **Related:** F0.1

## Context

The template needs a language for its own tools (docs checker, initializer) and a default for product code.
The checks rely on reliable parsing and a mature lint/test ecosystem. Derived projects may use other stacks
(Flutter, Python), but the repository tools must run on any development machine.

## Decision

Node 22 + strict TypeScript (ESM) for the tools and as the skeleton's default stack. Vitest for tests, ESLint
(typescript-eslint, type-checked) + Prettier for style, jscpd for duplication, ts-morph for the AST.

## Alternatives considered

| Alternative           | Why not                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| Python for the tools  | No native TS parser; two toolchains in the same repository                |
| Shell scripts + regex | Fragile at skipping strings/comments; exactly the problem ADR 0002 solves |
| Deno/Bun              | Less mature lint/AST ecosystem; Node is what the machines already have    |

## Consequences

- Positive: one toolchain; AST-based analysis; strict types catch errors early.
- Negative: projects with another product language (Python, Dart) must extend `tools/docs/ast.ts` with a
  parser (tree-sitter) or keep product code in a folder analyzed by another tool — to be recorded as a future
  ADR when it happens.
- Docs that change: ARCHITECTURE.md, STRUCTURE.md, CODING-STANDARDS.md.
