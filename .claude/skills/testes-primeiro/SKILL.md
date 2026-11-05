---
name: testes-primeiro
description: Use sempre que for escrever ou alterar código — função nova, mudança de comportamento ou correção de bug — para conduzir o ciclo TDD do projeto (teste, ver falhar, código mínimo, refatorar), incluindo fixtures e exceções de teste.
---

# Ciclo TDD

Regras completas em `docs/TESTING.md`; estilo de código em `docs/CODING-STANDARDS.md`.

## Função nova ou comportamento novo

1. Escreva o teste em `<arquivo>.test.ts` ao lado do código, com nome em português descrevendo o
   comportamento. Cubra: caso normal, bordas (vazio, limite), e cada erro que a função pode lançar.
2. Rode só esse arquivo (`npx vitest run <caminho>`) e confirme que **falha pelo motivo esperado** (não por
   erro de import ou sintaxe).
3. Escreva o código mínimo que faz passar: `function` de topo, nome único, ≤ 25 linhas, ≤ 3 parâmetros,
   JSDoc de uma linha. Pura se possível.
4. Rode de novo: verde. Refatore (duplicação, nomes, tamanho) mantendo verde.
5. `npm run test:coverage` — se um ramo ficou descoberto, adicione o caso, não um `/* istanbul ignore */`.

## Bug

1. Escreva primeiro o teste que **reproduz** o bug com a entrada real que falhou. Ele deve falhar.
2. Corrija. O teste passa e os demais continuam verdes.
3. Registre no CHANGELOG ("Corrigido") se o bug era visível ao usuário.

## Efeitos (disco, processo, rede)

Separe: a decisão vira função pura testada por tabela; o efeito vira função fina testada com diretório
temporário real (`mkdtempSync` + `rmSync` no `afterAll`) ou subprocesso real. Mock só para rede e relógio.

## Fixtures

Pequenas e inline. Se precisar de arquivos, `tools/<ferramenta>/fixtures/` ou `src/<modulo>/fixtures/`
(ignorados por lint, jscpd e `docs:check`).

## Exceções

Se uma função não puder ter teste automatizado, adicione a `src/test-exceptions.ts` com `reason` e
`manualTest` concretos. "Difícil de testar" não é motivo: refatore.
