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
- Constante exportada nova → linha na tabela "Data and constants".
- Pasta nova → linha em `docs/STRUCTURE.md`.
- Nunca leia `.env`; os nomes das variáveis estão em `.env.example`.
- New MCP tool: English `name` and `title`, and `annotations: toolAnnotations('<Title>', <PRESET>)` from
  `src/mcp/annotations.ts` (`READ_ONLY_HINTS` for reads; `SEND_HINTS`/`DESTRUCTIVE_HINTS` for anything that
  sends, submits, overwrites or deletes). The typecheck fails without them (Connectors Directory requirement).
