# Padrões de código

Regras inegociáveis do CLAUDE.md, explicadas. O que o ESLint confere está marcado com ⚙️; o resto é
revisão humana (checklist do PR).

## 1. Nada repetido ⚙️ (jscpd, limite zero)

Nenhuma função, constante, dado ou estilo duplicado. Dois trechos iguais ou quase iguais viram uma função
compartilhada com nome claro. `npm run dup:check` falha com qualquer clone de 50+ tokens (testes e
fixtures excluídos; `docs/FUNCTIONS.md` e `docs/adr/` também, porque seguem modelos fixos que repetem
estrutura, não conteúdo). Lógica _parecida_ que o jscpd não pega é responsabilidade da revisão.

## 2. Funções pequenas, com um único trabalho ⚙️

- Até **25 linhas** (sem contar brancos e comentários) — `max-lines-per-function`.
- Até **3 parâmetros**; mais que isso vira um objeto tipado — `max-params`.
- Complexidade ciclomática até **8**, aninhamento até **3** — `complexity`, `max-depth`.
- Se a descrição da função precisa de "e", divida.
- **Decidir separado de fazer:** funções puras (cálculo, validação, decisão) não tocam disco, rede, stdout
  nem estado global; funções com efeito são finas e chamam as puras. O campo **Efeitos** do FUNCTIONS.md
  deixa isso explícito.

## 3. Nomes de função únicos no repositório inteiro ⚙️ (`docs:check`)

Um nome, uma função. Isso torna `FUNCTIONS.md` um índice sem ambiguidade e permite calcular "Usada por"
sem confusão. Prefira nomes que carregam o contexto: `renderGeneratedBlock`, não `render`.

Frameworks que exigem nomes fixos (`GET`, `loader`, `default`) ficam em arquivos de entrada e são
registrados como exceção documentada em ARCHITECTURE.md quando a stack for escolhida.

## 4. Declaração de funções ⚙️

Funções de topo são declaradas com `function` (`func-style: declaration`), nunca com arrow atribuída a
`const`. Arrow functions são para callbacks inline. Toda função exportada tem tipos explícitos nos limites
(`explicit-module-boundary-types`).

## 5. Tipos

TypeScript estrito com `noUncheckedIndexedAccess` e `exactOptionalPropertyTypes`. Nada de `any`; use
`unknown` e estreite. Sem `!` (non-null assertion) fora de testes. Dados de entrada externos são validados
na borda e viram tipos do domínio.

## 6. Erros

Lance `Error` com mensagem em português que diz **o que** falhou e **como corrigir**. Não engula erros
silenciosamente; se um `catch` devolve um valor padrão, documente isso em **Erros** e **Saída**.

## 7. Nomes

- Identificadores em inglês, `camelCase` para funções/variáveis, `PascalCase` para tipos,
  `UPPER_SNAKE_CASE` para constantes exportadas.
- Booleanos como pergunta: `isAnalyzedSource`, `hasTests`.
- Funções com verbo: `collectFunctions`, `renderNewSection`, `checkStructure`.
- Arquivos em `kebab-case.ts`; teste ao lado: `arquivo.test.ts`.

## 8. Comentários

JSDoc de uma linha em toda função (`/** O que faz. */`) — a mesma frase vai para o campo **Faz**.
Comentários explicam o porquê, nunca o óbvio. Sem código comentado.

## 9. Imports

ESM com extensão `.js` nos imports relativos (`moduleResolution: NodeNext`). `import type` para tipos
(`consistent-type-imports`). Respeite a tabela de dependências de [ARCHITECTURE.md](ARCHITECTURE.md).

## 10. Idioma

Código, identificadores e mensagens de commit (tipo/escopo) em inglês; docs, comentários, mensagens ao
usuário e descrição dos commits em português.
