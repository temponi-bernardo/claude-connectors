---
paths:
  - 'src/**/*.ts'
  - 'tools/**/*.ts'
  - 'connectors/**/*.ts'
---

# Ao editar código

- Antes de criar uma função, procure em `docs/FUNCTIONS.md` se já existe algo equivalente. Nada repetido.
- Função nova: nome único no repositório, `function` no topo, ≤ 25 linhas, ≤ 3 parâmetros, JSDoc de uma
  linha. Pura sempre que possível; efeito em função fina separada.
- Depois de criar/renomear/remover função: `npm run docs:generate`, preencha Faz/Entrada/Saída/Efeitos/Erros
  em `docs/FUNCTIONS.md` e cite a função no processo certo em `docs/PROCESSES.md`.
- Constante exportada nova → linha na tabela "Dados e constantes".
- Pasta nova → linha em `docs/STRUCTURE.md`.
- Nunca leia `.env`; os nomes das variáveis estão em `.env.example`.
