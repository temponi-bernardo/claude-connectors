# Roadmap

## Próxima tarefa

**F1.1 — Definir o produto em PRODUCT.md** (responder às perguntas abertas e registrar as decisões com data).

## Como ler

Tarefas têm id `F<fase>.<n>`, estado (⬜ não começou · 🟨 em andamento · ✅ pronto · ⏸️ pausado) e um
critério "Pronto quando" verificável. Uma tarefa por PR, sempre que possível. Ao terminar, atualize o estado e
a "Próxima tarefa". Formato das linhas: [DOCUMENTATION.md](DOCUMENTATION.md#estado-de-tarefa).

## MVP

O MVP é o menor conjunto de fases que entrega valor real a um usuário: **Fases 1 e 2**. Fases seguintes são
evolução.

## Fase 0 — Fundação (template) ✅

| Id   | Tarefa                                                                             | Estado | Pronto quando                                                     |
| ---- | ---------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------- |
| F0.1 | Estrutura, docs, checagens, hooks, CI e skills                                     | ✅     | `npm run check` passa do zero em um clone limpo                   |
| F0.2 | Esqueleto que roda com lógica pura testada                                         | ✅     | `npm start -- Olá Mundo` imprime `ola-mundo`                      |
| F0.3 | Travas provadas (função sem doc, pasta sem doc, duplicação, commit fora do padrão) | ✅     | Cada violação barrada e desfeita, registrada no PR/commit inicial |

## Fase 1 — Definição do produto

| Id   | Tarefa                                               | Estado | Pronto quando                                                |
| ---- | ---------------------------------------------------- | ------ | ------------------------------------------------------------ |
| F1.1 | Definir o produto em PRODUCT.md                      | ⬜     | Nenhuma pergunta aberta sem decisão datada                   |
| F1.2 | Escolher a stack definitiva e registrar ADR          | ⬜     | ADR aceito em `docs/adr/` e ARCHITECTURE.md atualizado       |
| F1.3 | Definir se há interface e configurar `uiDir` + UI.md | ⬜     | `docs:check` cobra componentes, ou UI.md diz "sem interface" |
| F1.4 | Modelar as camadas em ARCHITECTURE.md                | ⬜     | Tabela de dependências permitidas completa                   |

## Fase 2 — Primeiro fluxo de valor

| Id   | Tarefa                                               | Estado | Pronto quando                                       |
| ---- | ---------------------------------------------------- | ------ | --------------------------------------------------- |
| F2.1 | Implementar o processo principal (P05) ponta a ponta | ⬜     | PROCESSES.md descreve o fluxo e ele roda com testes |
| F2.2 | Primeira release `v0.1.0`                            | ⬜     | Rascunho de release publicado pelo release-please   |

## Fases seguintes

Adicione fases conforme o PRODUCT.md evoluir. Não planeje mais de duas fases à frente em detalhe.
