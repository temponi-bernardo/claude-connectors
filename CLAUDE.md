# claude-connectors

Conectores MCP para o Claude, que rodam na nuvem e se instalam pelo marketplace de plugins, começando pelo Canvas da PUC Minas.

Cada conector vive em `connectors/<nome>/` e é um plugin do marketplace que aponta para o servidor remoto dele
(ADR 0013); código compartilhado fica em `src/`. Não há GitHub Actions: o portão de PR é `npm run pr:check` (ADR 0006).

A documentação em `docs/` é a fonte da verdade. **Antes de mexer em código, leia `docs/README.md`** e siga
o "quero... → leia...". Não varra o código para descobrir o que existe: `docs/FUNCTIONS.md`,
`docs/PROCESSES.md` e `docs/STRUCTURE.md` dizem. A próxima tarefa está no topo de `docs/ROADMAP.md`; o que a
sessão anterior deixou está em `docs/STATE.md` (injetado no início da sessão).

## Regras inegociáveis

1. **Nada repetido** — lógica compartilhada vira função compartilhada (`npm run dup:check`, limite zero).
2. **Funções pequenas, um só trabalho** — ≤ 25 linhas, ≤ 3 parâmetros, decidir (puro) separado de fazer
   (efeitos). Detalhes em `docs/CODING-STANDARDS.md`.
3. **Nomes de função únicos no repositório** (conferido por `docs:check`).
4. **Testes primeiro.** Toda função tem teste; exceções só em `src/test-exceptions.ts` com motivo
   (`docs/TESTING.md`).
5. **Documentação na mesma mudança.** Rode `npm run docs:generate`, preencha os campos manuais, siga a
   tabela de `docs/DOCUMENTATION.md`. **Toda alteração em plugin** (`connectors/`, `.claude-plugin/`)
   atualiza as docs afetadas e documenta tudo o que foi feito, via `/atualizar-docs` — o hook `Stop`
   `stop-plugin-docs.sh` bloqueia se não houver.
6. **Interface só com o design system** (`docs/UI.md`), quando houver.
7. **Nada direto na `main`** — branch por tarefa, PR, `pr:check` verde, squash merge (`docs/WORKFLOW.md`).
   O Claude mergeia sozinho com o `pr:check` verde, sem pedir confirmação.
8. **Conventional Commits** com descrição em português: `feat(canvas): adicionar ferramenta de notas`.
9. **Skills sempre atualizadas** — passo repetido, comando ou regra nova → skill no mesmo PR.
10. Docs e mensagens ao usuário em **português**; identificadores em **inglês**.
11. **Contexto pequeno.** Uma tarefa por sessão. Exploração, pesquisa e verificações independentes vão para
    subagents; só o resumo volta. Ao concluir uma tarefa ou passo grande: `/handoff` (sobrescreve
    `docs/STATE.md`, local e fora do git) e avise o usuário para rodar `/clear`. Você não consegue rodar `/clear` —
    só avisar.

## Comandos

| Comando                              | Faz                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| `npm run check`                      | Formato, lint, tipos, testes, docs, duplicação e segredos                       |
| `npm run pr:check -- "<título>"`     | Portão de PR (não há CI): check, build, pacotes e commitlint                    |
| `npm run docs:generate`              | Atualiza os blocos gerados de `docs/FUNCTIONS.md` e cria seções novas           |
| `npm run docs:check`                 | Falha se docs e código divergirem                                               |
| `npm test` / `npm run test:coverage` | Testes / com cobertura mínima de 90%                                            |
| `npm run lint` / `npm run lint:fix`  | ESLint                                                                          |
| `npm run format:fix`                 | Prettier                                                                        |
| `npm run typecheck`                  | `tsc --noEmit`                                                                  |
| `npm run dup:check`                  | jscpd                                                                           |
| `npm run build`                      | Valida o `.mcp.json` (só remoto) e gera `server/remote.js` de cada conector     |
| `npm run worker:deploy`              | Publica o Canvas remoto no Cloudflare Workers (`worker:dev`: local)             |
| `npm run gmail:deploy`               | Publica o Gmail remoto no Cloudflare Workers (`gmail:dev`: local)               |
| `npm run whatsapp:deploy`            | Publica o WhatsApp (Workers + Containers); `whatsapp:build`: só bundle e imagem |
| `npm run bridge:test`                | Ponte Go do WhatsApp: gofmt, vet e testes (Go 1.26+, parte do `pr:check`)       |

## Skills

| Skill               | Quando                                                                   |
| ------------------- | ------------------------------------------------------------------------ |
| `/tarefa`           | Pegar a próxima tarefa do roadmap e levá-la até o merge                  |
| `/testes-primeiro`  | Qualquer código novo ou bug: o ciclo TDD                                 |
| `/atualizar-docs`   | Depois de alterar código, antes de abrir o PR                            |
| `/sincronizar-docs` | Auditoria completa docs × código (inclusive o que a máquina não confere) |
| `/melhorar-skills`  | Ao fim de cada tarefa: revisar se alguma skill precisa mudar             |
| `/lancar-versao`    | Preparar e acompanhar uma release                                        |
| `/handoff`          | Ao concluir tarefa ou passo grande: salvar o estado em `docs/STATE.md`   |

## Como o Claude Code está configurado aqui

- `.claude/settings.json`: comandos de checagem liberados; push na `main`, `--force`, `--no-verify` e
  leitura de `.env`/segredos negados (também por hook `PreToolUse`).
- Hook `Stop` (`stop-docs-check.sh`): roda `docs:check` ao fim de cada resposta que alterou código ou docs.
- Hook `Stop` (`stop-handoff.sh`): se há commit seu novo sem `docs/STATE.md` atualizado, bloqueia e pede `/handoff`.
- Hook `Stop` (`stop-plugin-docs.sh`): se a branch alterou plugin (`connectors/`, `.claude-plugin/`) sem
  tocar documentação (`docs/`, `CHANGELOG.md`, READMEs), bloqueia e pede `/atualizar-docs`.
- Hook `SessionStart`: injeta `docs/STATE.md` e a próxima tarefa do roadmap (também após `/clear`).
- Hook `SessionStart` (`session-tools.sh`, só na nuvem): instala o gitleaks 8.28.0 pelo Go
  (`scripts/install-gitleaks.sh`) e roda `npm install` se o lockfile mudou. O `secrets:check` usa o mesmo script
  se o gitleaks faltar na nuvem (inclusive no pre-push).
- Hook `PreCompact`: gera handoff automático em `docs/STATE.md` via `claude -p` antes de compactar.
- Hook `SessionEnd` (`session-end-handoff.sh`): no `/clear` ou fim de sessão, se houve edição ou commit depois do
  último `STATE.md`, gera o handoff do mesmo jeito (sessão só de conversa não gasta nada).
- Ciclo completo em `docs/WORKFLOW.md` → "Ciclo de contexto do Claude Code".
- `.claude/rules/`: regras carregadas por caminho (`codigo.md`, `testes.md`, `docs.md`).
