# Estrutura

Uma linha por pasta versionada. `npm run docs:check` falha se uma pasta versionada não aparecer aqui
(o nome vai em crase com barra final, ex.: `` `src/core/` ``).

```text
.
├── .claude/          # Configuração do Claude Code: permissões, hooks, regras e skills
├── .githooks/        # Git hooks versionados (ativados pelo `npm install`)
├── .claude-plugin/   # marketplace.json: este repo como marketplace de plugins do Claude
├── .github/          # Templates de PR/issue, Dependabot, CODEOWNERS (sem Actions, ADR 0006)
├── connectors/       # Um conector MCP remoto por pasta, cada um vira um plugin do marketplace
│   ├── canvas-puc/   # Canvas LMS da PUC Minas (plugin + src/ + Worker + server/remote.js gerado)
│   ├── gmail/        # Gmail multi-conta só leitura (plugin + src/ + Worker), ADR 0014
│   └── whatsapp/     # WhatsApp pessoal self-host: Worker (src/) + ponte Go no container (bridge/), ADR 0015
├── docs/             # Documentação — fonte da verdade (e o site público do GitHub Pages)
├── scripts/          # Scripts de shell auxiliares (GitHub, segredos, pr:check)
├── src/              # Código compartilhado entre conectores (core puro, mcp, remote)
└── tools/            # Ferramentas internas do repositório (bundle, docs, hooks)
```

## Pastas

| Pasta                                              | O que tem                                                                                             | Arquivos principais                                         |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `.claude/`                                         | Configuração do Claude Code para este repositório                                                     | `settings.json`                                             |
| `.claude/hooks/`                                   | Scripts chamados pelos hooks do Claude Code                                                           | `guard-bash.mjs`, `session-tools.sh`, `stop-plugin-docs.sh` |
| `.claude/rules/`                                   | Regras carregadas por caminho (quando o arquivo tocado casa com `paths`)                              | `codigo.md`, `testes.md`, `docs.md`                         |
| `.claude/skills/`                                  | Skills do projeto, uma pasta por skill                                                                | `*/SKILL.md`                                                |
| `.claude/skills/tarefa/`                           | Skill do ciclo completo de uma tarefa do roadmap                                                      | `SKILL.md`                                                  |
| `.claude/skills/testes-primeiro/`                  | Skill do ciclo TDD                                                                                    | `SKILL.md`                                                  |
| `.claude/skills/atualizar-docs/`                   | Skill que atualiza a documentação a partir do diff                                                    | `SKILL.md`                                                  |
| `.claude/skills/sincronizar-docs/`                 | Skill de auditoria docs × código                                                                      | `SKILL.md`                                                  |
| `.claude/skills/melhorar-skills/`                  | Skill de revisão das próprias skills                                                                  | `SKILL.md`                                                  |
| `.claude/skills/lancar-versao/`                    | Skill de release                                                                                      | `SKILL.md`                                                  |
| `.claude/skills/handoff/`                          | Skill que sobrescreve `docs/STATE.md` ao fim de uma tarefa                                            | `SKILL.md`                                                  |
| `.claude-plugin/`                                  | Manifesto do marketplace de plugins (este repositório)                                                | `marketplace.json`                                          |
| `.githooks/`                                       | Hooks do git versionados                                                                              | `commit-msg`, `pre-commit`, `pre-push`                      |
| `.github/`                                         | Configuração do GitHub (sem workflows: CI é local, ADR 0006)                                          | `dependabot.yml`, `PULL_REQUEST_TEMPLATE.md`, `CODEOWNERS`  |
| `.github/ISSUE_TEMPLATE/`                          | Formulários de issue                                                                                  | `bug.yml`, `ideia.yml`, `config.yml`                        |
| `connectors/`                                      | Conectores MCP remotos, um por pasta; `npm run build` confere e gera o bundle de todos                | `*/.mcp.json`                                               |
| `connectors/canvas-puc/`                           | Conector do Canvas: plugin (`.mcp.json` com a URL do Worker), Worker e guia                           | `.mcp.json`, `wrangler.toml`, `Dockerfile`, `README.md`     |
| `connectors/canvas-puc/.claude-plugin/`            | Manifesto do plugin (nome, versão, descrição)                                                         | `plugin.json`                                               |
| `connectors/canvas-puc/skills/`                    | Skills do plugin, que viram comandos `/` no Claude                                                    | —                                                           |
| `connectors/canvas-puc/skills/config-canvas/`      | Comando `/config-canvas`: configuração guiada do conector (conexão, login e teste)                    | `SKILL.md`                                                  |
| `connectors/canvas-puc/skills/resumo-semana/`      | Comando `/resumo-semana`: entregas, atrasos, avisos e notas da semana                                 | `SKILL.md`                                                  |
| `connectors/canvas-puc/skills/preparar-entrega/`   | Comando `/preparar-entrega`: enunciado, rubrica, checklist, plano e revisão; envia só com confirmação | `SKILL.md`                                                  |
| `connectors/canvas-puc/skills/estudar-disciplina/` | Comando `/estudar-disciplina`: resumo dos módulos, conceitos, questões de revisão e plano até a prova | `SKILL.md`                                                  |
| `connectors/canvas-puc/server/`                    | Bundle gerado por `npm run build` (versionado; não editar à mão), usado pelo Dockerfile               | `remote.js`                                                 |
| `connectors/canvas-puc/src/`                       | Código do conector: cliente, formatação, tools, OAuth do Canvas e Worker                              | `worker.ts`, `remote.ts`, `client.ts`, `tools.ts`           |
| `connectors/canvas-puc/src/fixtures/`              | Contexto falso (cliente simulado) para os testes das ferramentas                                      | `fake-context.ts`                                           |
| `connectors/gmail/`                                | Conector Gmail: plugin (`.mcp.json` com a URL do Worker), Worker e guia (ADR 0014)                    | `.mcp.json`, `wrangler.toml`, `README.md`                   |
| `connectors/gmail/.claude-plugin/`                 | Manifesto do plugin (nome, descrição)                                                                 | `plugin.json`                                               |
| `connectors/gmail/skills/`                         | Skills do plugin, que viram comandos `/` no Claude                                                    | —                                                           |
| `connectors/gmail/skills/config-gmail/`            | Comando `/config-gmail`: configuração guiada do conector (conexão, login e teste)                     | `SKILL.md`                                                  |
| `connectors/gmail/skills/triagem-email/`           | Comando `/triagem-email`: caixa de entrada de todas as contas por prioridade                          | `SKILL.md`                                                  |
| `connectors/gmail/skills/achar-documento/`         | Comando `/achar-documento`: boletos, faturas, recibos e contratos, com os dados do anexo              | `SKILL.md`                                                  |
| `connectors/gmail/skills/resumir-conversa/`        | Comando `/resumir-conversa`: resumo de uma thread, pendências e rascunho de resposta                  | `SKILL.md`                                                  |
| `connectors/gmail/src/`                            | OAuth (biblioteca + Google), vínculo de contas, cliente Gmail, tools, Worker                          | `index.ts`, `worker.ts`, `tools.ts`, `link-flow.ts`         |
| `connectors/gmail/src/fixtures/`                   | KV, Google (chaves RSA de teste) e mensagens falsos para os testes                                    | `fake-kv.ts`, `fake-google.ts`, `messages.ts`               |
| `connectors/whatsapp/`                             | Conector WhatsApp (só remoto, self-host): guia, `wrangler.toml`, imagem da ponte, licenças            | `README.md`, `wrangler.toml`, `Dockerfile`, `NOTICE.md`     |
| `connectors/whatsapp/.claude-plugin/`              | Manifesto do plugin (só skills; sem `.mcp.json`, cada pessoa conecta o próprio servidor)              | `plugin.json`                                               |
| `connectors/whatsapp/skills/`                      | Skills do plugin, que viram comandos `/` no Claude                                                    | —                                                           |
| `connectors/whatsapp/skills/config-whatsapp/`      | Comando `/config-whatsapp`: configuração guiada do conector (conexão, login e teste)                  | `SKILL.md`                                                  |
| `connectors/whatsapp/skills/resumo-whatsapp/`      | Comando `/resumo-whatsapp`: o que aconteceu nas conversas e grupos no período                         | `SKILL.md`                                                  |
| `connectors/whatsapp/skills/pendencias-whatsapp/`  | Comando `/pendencias-whatsapp`: conversas esperando resposta da pessoa                                | `SKILL.md`                                                  |
| `connectors/whatsapp/skills/buscar-whatsapp/`      | Comando `/buscar-whatsapp`: endereço, PIX, link, documento ou mídia nas mensagens                     | `SKILL.md`                                                  |
| `connectors/whatsapp/src/`                         | Worker: OAuth do dono, ferramentas MCP, `/pair`, Durable Object e ciclo de vida da ponte              | `index.ts`, `worker.ts`, `tools.ts`, `lifecycle.ts`         |
| `connectors/whatsapp/src/fixtures/`                | Fakes dos testes: bucket R2, armazenamento do DO, host e ponte                                        | `fakes.ts`                                                  |
| `connectors/whatsapp/bridge/`                      | Ponte Go (whatsmeow) com API HTTP interna; módulo Go próprio                                          | `main.go`, `go.mod`, `API.md`                               |
| `connectors/whatsapp/bridge/internal/`             | Pacotes internos da ponte                                                                             | —                                                           |
| `connectors/whatsapp/bridge/internal/api/`         | Rotas HTTP da ponte (auth por `BRIDGE_TOKEN`, limites, JSON)                                          | —                                                           |
| `connectors/whatsapp/bridge/internal/bridge/`      | Orquestra fases, restore/snapshot e o cliente do WhatsApp                                             | —                                                           |
| `connectors/whatsapp/bridge/internal/config/`      | Leitura e validação do ambiente do container                                                          | —                                                           |
| `connectors/whatsapp/bridge/internal/snapshot/`    | Formato `WAS1`: tar dos bancos cifrado em blocos AES-256-GCM                                          | —                                                           |
| `connectors/whatsapp/bridge/internal/store/`       | Banco de mensagens SQLite (conversas, mensagens, contatos, envios)                                    | —                                                           |
| `connectors/whatsapp/bridge/internal/wa/`          | Adaptador do whatsmeow (eventos, pareamento, mídia, envio)                                            | —                                                           |
| `docs/`                                            | Documentação (índice em `README.md`) e site do GitHub Pages (`*.html`)                                | `FUNCTIONS.md`, `index.html`, `_config.yml`                 |
| `docs/_layouts/`                                   | Layout Jekyll do site público (cabeçalho, rodapé, CSP), ADR 0012                                      | `site.html`                                                 |
| `docs/adr/`                                        | Registros de decisão de arquitetura                                                                   | `README.md`, `0000-modelo.md`                               |
| `scripts/`                                         | Scripts de shell                                                                                      | `install-gitleaks.sh`, `secrets-check.sh`, `pr-check.sh`    |
| `src/`                                             | Código compartilhado entre conectores e lista de exceções de teste                                    | `test-exceptions.ts`                                        |
| `src/core/`                                        | Lógica pura compartilhada, sem efeitos (HTML, URL, env, ZIP/OLE/Word/PDF → texto)                     | `html.ts`, `http.ts`, `env.ts`                              |
| `src/core/fixtures/`                               | Documentos do Word de exemplo (.doc/.docx) para os testes de `word.ts`                                | `exemplo.doc`, `exemplo.docx`, `unicode.doc`                |
| `src/mcp/`                                         | Definição e registro de ferramentas MCP, usados por todos os conectores                               | `tools.ts`                                                  |
| `src/remote/`                                      | Servidor remoto genérico: OAuth sem estado, página de login, `/mcp` por HTTP                          | `handler.ts`, `oauth.ts`, `tokens.ts`, `node-server.ts`     |
| `tools/`                                           | Ferramentas internas do repositório                                                                   | —                                                           |
| `tools/docs/`                                      | Verificador e gerador de documentação (`docs:check`, `docs:generate`)                                 | `cli.ts`, `run.ts`, `checks.ts`, `ast.ts`                   |
| `tools/hooks/`                                     | Testes dos hooks do Claude Code que vivem em `.claude/hooks/`                                         | `guard-bash.test.ts`, `session-tools.test.ts`               |
| `tools/hooks/fixtures/`                            | Utilitários dos testes de hooks (repositório git temporário, runner)                                  | `hook-test-utils.ts`                                        |
| `tools/site/`                                      | Testes do site público (páginas, links, exclusão dos docs internos)                                   | `site.test.ts`                                              |
| `tools/bundle/`                                    | Build dos conectores (`npm run build`): confere o `.mcp.json` e gera `server/remote.js`               | `cli.ts`, `bundle.ts`                                       |

## Onde colocar algo novo

| Quero adicionar...                            | Vai em...                                                                              | E documento em...                                 |
| --------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Conector novo                                 | `connectors/<nome>/` (`.claude-plugin/plugin.json`, `.mcp.json` http, `src/worker.ts`) | STRUCTURE.md, FUNCTIONS.md, PROCESSES.md, ROADMAP |
| Servidor remoto de um conector (HTTP + OAuth) | `connectors/<nome>/src/remote.ts` + `src/remote/`                                      | ARCHITECTURE.md, PROCESSES.md (P08–P09), README   |
| Lógica pura usada por mais de um conector     | `src/core/`                                                                            | FUNCTIONS.md, PROCESSES.md se for um fluxo novo   |
| Efeito (IO, rede, banco, terminal)            | `src/<camada>/` conforme ARCHITECTURE.md                                               | FUNCTIONS.md (campo Efeitos)                      |
| Componente de UI                              | pasta `uiDir` de `docs.config.json`                                                    | UI.md                                             |
| Constante ou dado compartilhado               | junto do módulo que o usa; exportado                                                   | FUNCTIONS.md, tabela "Dados e constantes"         |
| Ferramenta interna do repositório             | `tools/<nome>/`                                                                        | STRUCTURE.md, FUNCTIONS.md                        |
| Script de shell                               | `scripts/`                                                                             | STRUCTURE.md, WORKFLOW.md se for parte do fluxo   |
| Decisão de arquitetura                        | `docs/adr/NNNN-titulo.md`                                                              | `docs/adr/README.md`                              |
| Passo repetido do trabalho com o Claude       | `.claude/skills/<nome>/SKILL.md`                                                       | CLAUDE.md (lista de skills)                       |
| Regra que só vale para alguns caminhos        | `.claude/rules/<nome>.md` com `paths`                                                  | CLAUDE.md                                         |
| Pasta nova de qualquer tipo                   | —                                                                                      | STRUCTURE.md (esta tabela e a árvore)             |
