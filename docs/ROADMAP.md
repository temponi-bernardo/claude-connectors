# Roadmap

## Próxima tarefa

**F2.1 — Primeira release `v0.1.0`** com o `canvas-puc-1.2.0.mcpb` anexado (skill `/lancar-versao`).

## Como ler

Tarefas têm id `F<fase>.<n>`, estado (⬜ não começou · 🟨 em andamento · ✅ pronto · ⏸️ pausado) e um
critério "Pronto quando" verificável. Uma tarefa por PR, sempre que possível. Ao terminar, atualize o estado e
a "Próxima tarefa". Formato das linhas: [DOCUMENTATION.md](DOCUMENTATION.md#estado-de-tarefa).

## MVP

O MVP é o conector do Canvas instalado como extensão e usado no dia a dia: **Fases 1 e 2**.

## Fase 0 — Fundação (template) ✅

| Id   | Tarefa                                                                 | Estado | Pronto quando                                                     |
| ---- | ---------------------------------------------------------------------- | ------ | ----------------------------------------------------------------- |
| F0.1 | Estrutura, docs, checagens, hooks e skills (do `template-new-project`) | ✅     | `npm run check` passa do zero em um clone limpo                   |
| F0.2 | CI local no lugar do GitHub Actions (`pr:check`, ADR 0006)             | ✅     | Actions desligado; `npm run pr:check` cobre o que o CI cobria     |
| F0.3 | Adaptar o template ao projeto (`/novo-projeto`)                        | ✅     | Sem marcadores; PRODUCT, ROADMAP, ARCHITECTURE refletem o projeto |

## Fase 1 — Estrutura de conectores e Canvas

| Id   | Tarefa                                                                    | Estado | Pronto quando                                                       |
| ---- | ------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------- |
| F1.1 | Código compartilhado (`src/core`, `src/mcp`) e empacotador (`tools/pack`) | ✅     | `npm run pack:all` gera `.mcpb` válidos                             |
| F1.2 | Portar o conector do Canvas para TypeScript, com testes e docs            | ✅     | 19 ferramentas; pacote extraído responde com a sessão real          |
| F1.3 | Login pelo navegador com renovação silenciosa (ADR 0007)                  | ✅     | Sessão renovada sem janela; janela só quando a Microsoft pede senha |
| F1.4 | Repositório como marketplace de plugins (ADR 0008)                        | ✅     | `claude plugin validate .` passa e o plugin roda pelo `.mcp.json`   |

## Fase 2 — Uso real

| Id   | Tarefa                                                                 | Estado | Pronto quando                                                                          |
| ---- | ---------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------- |
| F2.1 | Primeira release `v0.1.0` com o `.mcpb` anexado                        | ⬜     | Rascunho de release com `canvas-puc-1.2.0.mcpb`                                        |
| F2.2 | Instalar pelo marketplace e aposentar `Documents/canvas-mcp`           | ⬜     | Extensão ativa; registro antigo no Claude Code trocado pelo do repo                    |
| F2.3 | Escolher e esboçar o próximo conector (PRODUCT Q4)                     | ⬜     | Pergunta Q4 decidida e tarefas da Fase 3 escritas                                      |
| F2.4 | Avaliar a migração para zod 4 (Dependabot ignora majors do zod até lá) | ⬜     | Conector testado com zod 4 e regra de ignore removida, ou ADR dizendo por que não      |
| F2.5 | Avaliar TypeScript 7 (Dependabot ignora majors do TS até lá)           | ⬜     | `npm run check` verde com TS 7 e regra de ignore removida, ou ADR dizendo por que não  |
| F2.6 | Conector remoto do Canvas: HTTP + OAuth com token (ADR 0009)           | ✅     | `server/remote.js` faz o OAuth completo e responde as ferramentas; Dockerfile e Render |
| F2.7 | Conector remoto no Cloudflare Workers e conectado no claude.ai         | 🟨     | Worker no ar e `proximas_entregas` respondendo numa sessão do Cowork (ADR 0010)        |

## Fases seguintes

Um conector novo por fase, seguindo o molde de `connectors/canvas-puc/`. Não planeje mais de duas fases à
frente em detalhe.
