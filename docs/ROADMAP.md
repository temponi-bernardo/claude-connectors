# Roadmap

## Próxima tarefa

**F3.2 — WhatsApp: publicar na conta do dono e parear o número.**

## Como ler

Tarefas têm id `F<fase>.<n>`, estado (⬜ não começou · 🟨 em andamento · ✅ pronto · ⏸️ pausado) e um
critério "Pronto quando" verificável. Uma tarefa por PR, sempre que possível. Ao terminar, atualize o estado e
a "Próxima tarefa". Formato das linhas: [DOCUMENTATION.md](DOCUMENTATION.md#estado-de-tarefa).

## MVP

O MVP é o conector do Canvas instalado pelo marketplace e usado no dia a dia, sem nada local: **Fases 1 e 2**.

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

| Id    | Tarefa                                                                               | Estado | Pronto quando                                                                                                      |
| ----- | ------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------ |
| F2.1  | Primeira release `v0.1.0` do conector remoto                                         | ✅     | Tag e notas da `v0.1.0` publicadas, sem anexo (ADR 0013)                                                           |
| F2.2  | Instalar pelo marketplace e aposentar `Documents/canvas-mcp`                         | ⬜     | Plugin instalado pelo marketplace conecta por OAuth; registro antigo e `.mcpb` removidos                           |
| F2.3  | Escolher e esboçar o próximo conector (PRODUCT Q4)                                   | ⬜     | Pergunta Q4 decidida e tarefas da Fase 3 escritas                                                                  |
| F2.4  | Avaliar a migração para zod 4 (Dependabot ignora majors do zod até lá)               | ⬜     | Conector testado com zod 4 e regra de ignore removida, ou ADR dizendo por que não                                  |
| F2.5  | Avaliar TypeScript 7 (Dependabot ignora majors do TS até lá)                         | ⬜     | `npm run check` verde com TS 7 e regra de ignore removida, ou ADR dizendo por que não                              |
| F2.6  | Conector remoto do Canvas: HTTP + OAuth com token (ADR 0009)                         | ✅     | `server/remote.js` faz o OAuth completo e responde as ferramentas; Dockerfile e Render                             |
| F2.7  | Conector remoto no Cloudflare Workers e conectado no claude.ai                       | ✅     | Worker no ar e `proximas_entregas` respondendo numa sessão do Cowork (ADR 0010)                                    |
| F2.8  | Renovação automática do token do Canvas no refresh do OAuth                          | ✅     | Refresh do OAuth estende a validade do token na PUC (ADR 0011)                                                     |
| F2.9  | Site público no GitHub Pages: início, privacidade e termos (ADR 0012)                | ✅     | Páginas em `docs/` montadas pelo Jekyll, sem os `.md` internos; manifesto aponta o site                            |
| F2.10 | Remover o modo local: plugin do marketplace aponta para o Worker                     | ✅     | Sem stdio, `.mcpb` e login pelo navegador; `.mcp.json` só `http` (ADR 0013)                                        |
| F2.11 | Gmail remoto público, multiusuário e só leitura (ADR 0014, 0016)                     | ✅     | Código, testes e docs no PR; Worker publicado e as duas contas vinculadas no claude.ai                             |
| F2.12 | Gmail com gerenciamento completo: enviar, responder, rascunhos, organizar (ADR 0019) | ✅     | Código, testes e docs no PR; escopo `gmail.modify` no Google, deploy e contas revinculadas enviando pelo claude.ai |

## Fase 3 — WhatsApp pessoal (self-host)

| Id   | Tarefa                                                                          | Estado | Pronto quando                                                                                 |
| ---- | ------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| F3.1 | Conector `whatsapp`: Worker + OAuth GitHub, ponte Go no container, snapshots R2 | ✅     | `pr:check` verde com leitura completa, `/pair`, envio atrás de flag e ADR 0015 com a medição  |
| F3.2 | Publicar na conta do dono e parear o número                                     | 🟨     | `list_chats` respondendo no claude.ai; RSS real do history sync registrado na ADR             |
| F3.3 | Restringir a saída do container aos hosts do WhatsApp (`allowedHosts`)          | ⬜     | Ponte conecta com `enableInternet = false` e só hosts do WhatsApp, ou ADR dizendo por que não |
| F3.4 | Envio ligado para qualquer contato ou grupo, com citação (ADR 0015)             | ✅     | `ENABLE_SEND` ligado, allowlist opcional, confirmação e limite mantidos; testes Worker e Go   |
| F3.5 | Avaliar envio de mídia pelo WhatsApp                                            | ⬜     | Imagem/documento enviados com miniatura e tipo conferido, ou ADR dizendo por que não          |

## Fases seguintes

Um conector novo por fase, seguindo o molde de `connectors/canvas-puc/`. Não planeje mais de duas fases à
frente em detalhe.
