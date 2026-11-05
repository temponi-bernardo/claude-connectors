# Glossário

**ADR** — Architecture Decision Record; registro curto de uma decisão de arquitetura, seu contexto e
consequências. Vive em `docs/adr/`.

**Bloco gerado** — Trecho de FUNCTIONS.md entre `<!-- gerado:inicio -->` e `<!-- gerado:fim -->`, escrito
por `npm run docs:generate` a partir do código.

**Campos manuais** — Faz, Entrada, Saída, Efeitos e Erros de cada função em FUNCTIONS.md; escritos à mão.

**Check** — `npm run check`: formato, lint, tipos, testes com cobertura, docs, duplicação e segredos. O
portão completo de PR é o `pr:check` (não há CI, ADR 0006).

**Conector** — Servidor MCP de um serviço externo (ex.: Canvas), numa pasta de `connectors/`, com
manifesto `.mcpb` e ferramentas para o Claude.

**Core** — Camada de lógica pura (`src/core/`): decide, não faz.

**Conventional Commits** — Formato `tipo(escopo): descrição` das mensagens de commit e títulos de PR.

**Decidir vs. fazer** — Separação entre funções puras (decidir) e funções com efeito (fazer).

**docs:check** — Verificador que falha quando documentação e código divergem.

**Extensão `.mcpb`** — Pacote instalável no Claude Desktop (Configurações → Extensões) com o servidor MCP
de um conector, gerado por `npm run pack`.

**Exceção de teste** — Entrada em `src/test-exceptions.ts` que isenta uma função de teste automatizado,
com motivo e teste manual.

**Fase / Tarefa (F1.2)** — Unidades do ROADMAP.md: fase agrupa tarefas; `F<fase>.<n>` identifica uma.

**Índice de referências** — Mapa função → quem a chama ou passa como valor, calculado por AST; vira o campo
"Usada por".

**Inventário** — Tudo o que o `docs:check` extrai do repositório antes de comparar com os docs.

**MVP** — Conjunto mínimo de fases que entrega valor real; definido no ROADMAP.md.

**Processo (P01)** — Fluxo de ponta a ponta descrito em PROCESSES.md.

**Registro de funções** — Lista de funções de topo (`function nome`) encontradas no código.

**pr:check** — `npm run pr:check -- "<título>"`: o portão local de PR que substitui o CI (check, build,
pacotes `.mcpb`, commitlint dos commits e do título).

**Release-please** — Ferramenta que gera PR de release, versão e changelog a partir dos commits; aqui roda pela CLI local.

**Skill** — Procedimento reutilizável do Claude Code em `.claude/skills/<nome>/SKILL.md`, invocado como
`/nome`.

**Squash merge** — Merge que condensa a branch em um commit na `main`; o título do PR vira a mensagem.

**Sessão do Canvas** — Cookies do login feito pelo navegador, salvos em `~/.canvas-puc/session.json` e
renovados sozinhos quando expiram.

**Template** — `template-new-project`, repositório de origem desta estrutura (docs, checagens, skills).
