# claude-connectors

Conectores MCP para o Claude, empacotados como extensões .mcpb, começando pelo Canvas da PUC Minas.

Cada conector vive em `connectors/<nome>/` e vira uma extensão `.mcpb` (ADR 0007); código compartilhado
fica em `src/`. Não há GitHub Actions: o portão de PR é `npm run pr:check` (ADR 0006).

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
   tabela de `docs/DOCUMENTATION.md`.
6. **Interface só com o design system** (`docs/UI.md`), quando houver.
7. **Nada direto na `main`** — branch por tarefa, PR, `pr:check` verde, squash merge (`docs/WORKFLOW.md`).
8. **Conventional Commits** com descrição em português: `feat(canvas): adicionar ferramenta de notas`.
9. **Skills sempre atualizadas** — passo repetido, comando ou regra nova → skill no mesmo PR.
10. Docs e mensagens ao usuário em **português**; identificadores em **inglês**.
11. **Contexto pequeno.** Uma tarefa por sessão. Exploração, pesquisa e verificações independentes vão para
    subagents; só o resumo volta. Ao concluir uma tarefa ou passo grande: `/handoff` (sobrescreve
    `docs/STATE.md`, local e fora do git) e avise o usuário para rodar `/clear`. Você não consegue rodar `/clear` —
    só avisar.

## Comandos

| Comando                              | Faz                                                                   |
| ------------------------------------ | --------------------------------------------------------------------- |
| `npm run check`                      | Formato, lint, tipos, testes, docs, duplicação e segredos             |
| `npm run pr:check -- "<título>"`     | Portão de PR (não há CI): check, build, pacotes e commitlint          |
| `npm run docs:generate`              | Atualiza os blocos gerados de `docs/FUNCTIONS.md` e cria seções novas |
| `npm run docs:check`                 | Falha se docs e código divergirem                                     |
| `npm test` / `npm run test:coverage` | Testes / com cobertura mínima de 90%                                  |
| `npm run lint` / `npm run lint:fix`  | ESLint                                                                |
| `npm run format:fix`                 | Prettier                                                              |
| `npm run typecheck`                  | `tsc --noEmit`                                                        |
| `npm run dup:check`                  | jscpd                                                                 |
| `npm run pack -- <conector>`         | Gera `dist/connectors/<conector>-<versão>.mcpb` (`pack:all`: todos)   |

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
- Hook `SessionStart`: injeta `docs/STATE.md` e a próxima tarefa do roadmap (também após `/clear`).
- Hook `PreCompact`: gera handoff automático em `docs/STATE.md` via `claude -p` antes de compactar.
- Ciclo completo em `docs/WORKFLOW.md` → "Ciclo de contexto do Claude Code".
- `.claude/rules/`: regras carregadas por caminho (`codigo.md`, `testes.md`, `docs.md`).
