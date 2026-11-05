# Estrutura

Uma linha por pasta versionada. `npm run docs:check` falha se uma pasta versionada não aparecer aqui
(o nome vai em crase com barra final, ex.: `` `src/core/` ``).

```text
.
├── .claude/          # Configuração do Claude Code: permissões, hooks, regras e skills
├── .githooks/        # Git hooks versionados (ativados pelo `npm install`)
├── .claude-plugin/   # marketplace.json: este repo como marketplace de plugins do Claude
├── .github/          # Templates de PR/issue, Dependabot, CODEOWNERS (sem Actions, ADR 0006)
├── connectors/       # Um conector MCP por pasta, cada um vira uma extensão .mcpb
│   └── canvas-puc/   # Canvas LMS da PUC Minas (plugin + manifest .mcpb + src/ + server/ gerado)
├── docs/             # Documentação — fonte da verdade
├── scripts/          # Scripts de shell auxiliares (GitHub, segredos, pr:check)
├── src/              # Código compartilhado entre conectores (core puro + mcp)
└── tools/            # Ferramentas internas do repositório (docs, hooks, pack)
```

## Pastas

| Pasta                                   | O que tem                                                                    | Arquivos principais                                          |
| --------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `.claude/`                              | Configuração do Claude Code para este repositório                            | `settings.json`                                              |
| `.claude/hooks/`                        | Scripts chamados pelos hooks do Claude Code                                  | `guard-bash.mjs`, `stop-handoff.sh`, `precompact-handoff.sh` |
| `.claude/rules/`                        | Regras carregadas por caminho (quando o arquivo tocado casa com `paths`)     | `codigo.md`, `testes.md`, `docs.md`                          |
| `.claude/skills/`                       | Skills do projeto, uma pasta por skill                                       | `*/SKILL.md`                                                 |
| `.claude/skills/tarefa/`                | Skill do ciclo completo de uma tarefa do roadmap                             | `SKILL.md`                                                   |
| `.claude/skills/testes-primeiro/`       | Skill do ciclo TDD                                                           | `SKILL.md`                                                   |
| `.claude/skills/atualizar-docs/`        | Skill que atualiza a documentação a partir do diff                           | `SKILL.md`                                                   |
| `.claude/skills/sincronizar-docs/`      | Skill de auditoria docs × código                                             | `SKILL.md`                                                   |
| `.claude/skills/melhorar-skills/`       | Skill de revisão das próprias skills                                         | `SKILL.md`                                                   |
| `.claude/skills/lancar-versao/`         | Skill de release                                                             | `SKILL.md`                                                   |
| `.claude/skills/handoff/`               | Skill que sobrescreve `docs/STATE.md` ao fim de uma tarefa                   | `SKILL.md`                                                   |
| `.claude-plugin/`                       | Manifesto do marketplace de plugins (este repositório)                       | `marketplace.json`                                           |
| `.githooks/`                            | Hooks do git versionados                                                     | `commit-msg`, `pre-commit`, `pre-push`                       |
| `.github/`                              | Configuração do GitHub (sem workflows: CI é local, ADR 0006)                 | `dependabot.yml`, `PULL_REQUEST_TEMPLATE.md`, `CODEOWNERS`   |
| `.github/ISSUE_TEMPLATE/`               | Formulários de issue                                                         | `bug.yml`, `ideia.yml`, `config.yml`                         |
| `connectors/`                           | Conectores MCP, um por pasta; `npm run pack:all` empacota todos              | `*/manifest.json`                                            |
| `connectors/canvas-puc/`                | Conector do Canvas: plugin do Claude Code, manifesto `.mcpb`, runtime e guia | `.mcp.json`, `manifest.json`, `package.json`, `README.md`    |
| `connectors/canvas-puc/.claude-plugin/` | Manifesto do plugin, com os campos de configuração (`userConfig`)            | `plugin.json`                                                |
| `connectors/canvas-puc/server/`         | Bundle gerado por `npm run pack` (versionado; não editar à mão)              | `index.js`                                                   |
| `connectors/canvas-puc/src/`            | Código do conector: config, sessão, auth, cliente, formatação, tools         | `main.ts`, `tools-read.ts`, `client.ts`, `auth.ts`           |
| `connectors/canvas-puc/src/fixtures/`   | Contexto falso (cliente e auth simulados) para os testes das ferramentas     | `fake-context.ts`                                            |
| `docs/`                                 | Documentação do projeto (índice em `README.md`)                              | `FUNCTIONS.md`, `PROCESSES.md`, `ROADMAP.md`                 |
| `docs/adr/`                             | Registros de decisão de arquitetura                                          | `README.md`, `0000-modelo.md`                                |
| `scripts/`                              | Scripts de shell                                                             | `setup-github.sh`, `secrets-check.sh`, `pr-check.sh`         |
| `src/`                                  | Código compartilhado entre conectores e lista de exceções de teste           | `test-exceptions.ts`                                         |
| `src/core/`                             | Lógica pura compartilhada, sem efeitos (HTML → texto, URL, paginação)        | `html.ts`, `http.ts`                                         |
| `src/mcp/`                              | Definição e registro de ferramentas MCP, usados por todos os conectores      | `tools.ts`                                                   |
| `tools/`                                | Ferramentas internas do repositório                                          | —                                                            |
| `tools/docs/`                           | Verificador e gerador de documentação (`docs:check`, `docs:generate`)        | `cli.ts`, `run.ts`, `checks.ts`, `ast.ts`                    |
| `tools/hooks/`                          | Testes dos hooks do Claude Code que vivem em `.claude/hooks/`                | `guard-bash.test.ts`, `stop-handoff.test.ts`                 |
| `tools/hooks/fixtures/`                 | Utilitários dos testes de hooks (repositório git temporário, runner)         | `hook-test-utils.ts`                                         |
| `tools/pack/`                           | Empacotador de conectores em `.mcpb` (`npm run pack`, `pack:all`)            | `cli.ts`, `pack.ts`                                          |

## Onde colocar algo novo

| Quero adicionar...                        | Vai em...                                              | E documento em...                                 |
| ----------------------------------------- | ------------------------------------------------------ | ------------------------------------------------- |
| Conector novo                             | `connectors/<nome>/` (`manifest.json` + `src/main.ts`) | STRUCTURE.md, FUNCTIONS.md, PROCESSES.md, ROADMAP |
| Lógica pura usada por mais de um conector | `src/core/`                                            | FUNCTIONS.md, PROCESSES.md se for um fluxo novo   |
| Efeito (IO, rede, banco, terminal)        | `src/<camada>/` conforme ARCHITECTURE.md               | FUNCTIONS.md (campo Efeitos)                      |
| Componente de UI                          | pasta `uiDir` de `docs.config.json`                    | UI.md                                             |
| Constante ou dado compartilhado           | junto do módulo que o usa; exportado                   | FUNCTIONS.md, tabela "Dados e constantes"         |
| Ferramenta interna do repositório         | `tools/<nome>/`                                        | STRUCTURE.md, FUNCTIONS.md                        |
| Script de shell                           | `scripts/`                                             | STRUCTURE.md, WORKFLOW.md se for parte do fluxo   |
| Decisão de arquitetura                    | `docs/adr/NNNN-titulo.md`                              | `docs/adr/README.md`                              |
| Passo repetido do trabalho com o Claude   | `.claude/skills/<nome>/SKILL.md`                       | CLAUDE.md (lista de skills)                       |
| Regra que só vale para alguns caminhos    | `.claude/rules/<nome>.md` com `paths`                  | CLAUDE.md                                         |
| Pasta nova de qualquer tipo               | —                                                      | STRUCTURE.md (esta tabela e a árvore)             |
