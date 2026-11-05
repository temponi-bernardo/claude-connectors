# Testes

## Testes primeiro (TDD)

1. Escreva o teste que descreve o comportamento desejado.
2. Rode e **veja falhar** pelo motivo certo.
3. Escreva o código mínimo que faz passar.
4. Refatore com os testes verdes.

Para bug: primeiro o teste que reproduz o bug (falhando), depois a correção. A skill `/testes-primeiro`
conduz o ciclo.

## Regras

- **Toda função tem teste.** `docs:check` falha se o nome de uma função não aparecer em nenhum arquivo
  `*.test.ts`. Isso confere presença, não qualidade: a revisão confere se o teste cobre comportamento,
  bordas e erros.
- Cobertura mínima **90%** (linhas, funções, ramos, statements) em `src/**` e `tools/**`, medida por
  `npm run test:coverage`. Pontos de entrada (`main.ts`, `cli.ts`) e fixtures ficam fora da medição.
- Teste fica ao lado do código: `client.ts` → `client.test.ts`.
- Funções puras: testes de tabela (entrada → saída), sem mocks.
- Funções com efeito: use um diretório temporário real (`mkdtempSync`) em vez de mockar `fs`; limpe no
  `afterAll`. Mocks só para rede e relógio.
- Nomes de teste em português, descrevendo o comportamento: `it('remove hífens nas pontas')`.
- Um `expect` por conceito; vários `expect` do mesmo conceito são aceitáveis.

## Exceções

Função sem teste automatizado só com entrada em `src/test-exceptions.ts` (`TEST_EXCEPTIONS`), com
`reason` e `manualTest` descritos. `docs:check` falha se a exceção citar função inexistente. Exceções
aceitáveis: pontos de entrada que só despacham; código que depende de hardware/UI sem harness.
Exceção não aceitável: "difícil de testar" — refatore separando decisão de efeito.

## Fixtures

Dados de teste grandes vão em `tools/<ferramenta>/fixtures/` ou `src/<modulo>/fixtures/` (ignorados
por lint, jscpd e `docs:check`). Prefira fixtures pequenas inline.

## Comandos

| Comando                                  | Faz                                                 |
| ---------------------------------------- | --------------------------------------------------- |
| `npm test`                               | Roda tudo uma vez                                   |
| `npm run test:watch`                     | Modo interativo                                     |
| `npm run test:coverage`                  | Com cobertura e thresholds (é o que o `check` roda) |
| `npx vitest run caminho/arquivo.test.ts` | Um arquivo                                          |
