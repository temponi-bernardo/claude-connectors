# 0001 — TypeScript sobre Node como base do template

- **Estado:** Aceito
- **Data:** 2026-10-01
- **Relacionado:** F0.1

## Contexto

O template precisa de uma linguagem para as próprias ferramentas (verificador de docs, inicializador) e um
padrão inicial para o código de produto. As checagens dependem de análise sintática confiável e de um
ecossistema de lint/teste maduro. Projetos derivados podem ter stacks diferentes (Flutter, Python), mas as
ferramentas do repositório precisam rodar em qualquer máquina de desenvolvimento.

## Decisão

Node 22 + TypeScript estrito (ESM) para as ferramentas e como stack padrão do esqueleto. Vitest para testes,
ESLint (typescript-eslint, type-checked) + Prettier para estilo, jscpd para duplicação, ts-morph para AST.

## Alternativas consideradas

| Alternativa                | Por que não                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| Python para as ferramentas | Sem parser TS nativo; duas toolchains no mesmo repositório                                |
| Scripts shell + regex      | Frágil para ignorar strings/comentários; foi justamente o problema que o ADR 0002 resolve |
| Deno/Bun                   | Ecossistema de lint/AST menos maduro; Node é o que já existe nas máquinas                 |

## Consequências

- Positivas: uma toolchain; análise por AST; tipos estritos pegam erros cedo.
- Negativas: projetos com outra linguagem de produto (Python, Dart) precisam estender `tools/docs/ast.ts`
  com um parser (tree-sitter) ou manter código de produto em pasta analisada por outra ferramenta — fica
  registrado como ADR futuro quando acontecer.
- Docs afetados: ARCHITECTURE.md, STRUCTURE.md, CODING-STANDARDS.md.
