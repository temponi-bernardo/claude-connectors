# Glossário

**ADR** — Architecture Decision Record; registro curto de uma decisão de arquitetura, seu contexto e
consequências. Vive em `docs/adr/`.

**Bloco gerado** — Trecho de FUNCTIONS.md entre `<!-- gerado:inicio -->` e `<!-- gerado:fim -->`, escrito
por `npm run docs:generate` a partir do código.

**Campos manuais** — Faz, Entrada, Saída, Efeitos e Erros de cada função em FUNCTIONS.md; escritos à mão.

**Check** — `npm run check`: tudo o que o CI roda (formato, lint, tipos, testes com cobertura, docs,
duplicação, segredos).

**Core** — Camada de lógica pura (`src/core/`): decide, não faz.

**Conventional Commits** — Formato `tipo(escopo): descrição` das mensagens de commit e títulos de PR.

**Decidir vs. fazer** — Separação entre funções puras (decidir) e funções com efeito (fazer).

**docs:check** — Verificador que falha quando documentação e código divergem.

**Esqueleto** — Código mínimo que roda (`npm start`) e prova que a estrutura funciona.

**Exceção de teste** — Entrada em `src/test-exceptions.ts` que isenta uma função de teste automatizado,
com motivo e teste manual.

**Fase / Tarefa (F1.2)** — Unidades do ROADMAP.md: fase agrupa tarefas; `F<fase>.<n>` identifica uma.

**Índice de referências** — Mapa função → quem a chama ou passa como valor, calculado por AST; vira o campo
"Usada por".

**Inventário** — Tudo o que o `docs:check` extrai do repositório antes de comparar com os docs.

**MVP** — Conjunto mínimo de fases que entrega valor real; definido no ROADMAP.md.

**Processo (P01)** — Fluxo de ponta a ponta descrito em PROCESSES.md.

**Registro de funções** — Lista de funções de topo (`function nome`) encontradas no código.

**Release-please** — Ação do GitHub que gera PR de release, versão e changelog a partir dos commits.

**Skill** — Procedimento reutilizável do Claude Code em `.claude/skills/<nome>/SKILL.md`, invocado como
`/nome`.

**Squash merge** — Merge que condensa a branch em um commit na `main`; o título do PR vira a mensagem.

**Template** — Este repositório, base para projetos novos via `/novo-projeto`.
