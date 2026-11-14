# 0002 — Documentação verificada e gerada por análise de AST

- **Estado:** Aceito
- **Data:** 2026-10-01
- **Relacionado:** F0.1, ADR 0001

## Contexto

Queremos que `docs/FUNCTIONS.md` liste toda função com "Usada por" e "Processos" corretos, sem que ninguém
mantenha isso à mão. Uma versão anterior baseada em regex precisava de uma lista crescente de cuidados
(ignorar comentários, strings, `${}`, chaves de objeto, descobrir a função dona pelo recuo do `}`), e ainda
assim errava.

## Decisão

Usar a AST (ts-morph) para registrar funções de topo, resolver referências por símbolo e descobrir a função
que contém cada referência. Os campos deriváveis do código (Arquivo, Assinatura, Usada por, Processos) são
**gerados** por `docs:generate` em blocos marcados; `docs:check` só falha se o bloco gerado estiver
desatualizado. Os campos de intenção (Faz, Entrada, Saída, Efeitos, Erros) continuam manuais e obrigatórios.

## Alternativas consideradas

| Alternativa                                     | Por que não                                                           |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| Regex sobre o código                            | Lista infinita de exceções; falsos positivos em strings e comentários |
| Só conferir (sem gerar)                         | Obriga a escrever à mão dados que a máquina já sabe; churn em todo PR |
| TypeDoc                                         | Gera referência de API, mas não "Usada por" nem ligação com processos |
| Exigir arrow vs. `function` por causa do parser | Com AST a restrição é desnecessária; mantida só como estilo (lint)    |

## Consequências

- Positivas: zero regex sobre código; mensagens de erro exatas (esperado × encontrado); menos tokens gastos
  pelo Claude escrevendo o que a máquina gera.
- Negativas: `docs:check` leva alguns segundos (ts-morph carrega o programa); depende de TypeScript como
  linguagem analisada (ver ADR 0001).
- Docs afetados: DOCUMENTATION.md (modelo de função), FUNCTIONS.md (marcadores).
