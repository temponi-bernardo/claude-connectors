# Fluxo de trabalho

## Branches

- `main` só recebe código por PR com `npm run pr:check` verde; sem push direto, sem force push. Não há CI
  no GitHub Actions ([ADR 0006](adr/0006-sem-github-actions-checagens-locais.md)): o portão é local.
- Uma branch por tarefa: `<tipo>/<id-roadmap>-<descricao-curta>`, ex.: `feat/f2-1-processo-principal`,
  `fix/canvas-paginacao`, `docs/arquitetura-camadas`.
- Branch nasce da `main` atualizada e morre no merge (squash).

## Commits (Conventional Commits, descrição em português)

```text
<tipo>(<escopo>): <descrição no imperativo, minúscula, sem ponto final>

[corpo opcional: o porquê]

[rodapé opcional: BREAKING CHANGE: ..., Closes #12]
```

| Tipo       | Quando                                    | Entra no changelog como |
| ---------- | ----------------------------------------- | ----------------------- |
| `feat`     | Funcionalidade nova visível               | Adicionado (minor)      |
| `fix`      | Correção de comportamento                 | Corrigido (patch)       |
| `perf`     | Melhora de desempenho                     | Alterado                |
| `refactor` | Mudança interna sem alterar comportamento | —                       |
| `docs`     | Só documentação                           | —                       |
| `test`     | Só testes                                 | —                       |
| `build`    | Build, dependências de produção           | —                       |
| `ci`       | GitHub Actions, hooks                     | —                       |
| `chore`    | Manutenção que não se encaixa acima       | —                       |
| `revert`   | Reverte um commit                         | —                       |

Escopos permitidos (`commitlint.config.js`): `core`, `mcp`, `canvas`, `pack`, `docs`, `tools`, `ci`, `deps`,
`skills`, `release`, `config`, `remote`. Conector novo ganha um escopo com o nome dele. Ao criar uma camada ou módulo novo, adicione o escopo lá **e** aqui no mesmo PR.

`BREAKING CHANGE:` no rodapé (ou `!` após o tipo) gera major. O hook `commit-msg` valida localmente; o
`pr:check` valida o **título do PR**, porque com squash merge é ele que vira o commit da `main`.

## Pull request

1. Abra o PR cedo, como rascunho se ainda não terminou.
2. Título no formato Conventional Commits (vira o commit da `main`).
3. Preencha o template: o que mudou, como testar, checklist de documentação (cada doc marcado ou "não se
   aplica: motivo").
4. `npm run pr:check -- "<título do PR>"` verde é obrigatório antes de abrir e de mergear: check completo,
   pacotes `.mcpb`, runtime dos conectores commitado e atual, commitlint dos commits e do título. Corrija em vez de pular (`--no-verify` é
   proibido e barrado pelo Claude Code).
5. **Quem mergeia:** o Claude, com `pr:check` verde, sem pedir confirmação, inclusive o PR de release
   (decisão do dono, 2026-11-05).
6. Merge por **squash**, apagando a branch.

## Definição de pronto

Uma tarefa está pronta quando: o critério "Pronto quando" do ROADMAP é verificável e verdadeiro; `npm run
check` passa; a documentação do mesmo PR está atualizada conforme [DOCUMENTATION.md](DOCUMENTATION.md);
CHANGELOG "Não lançado" tem a entrada (se visível ao usuário); o estado no ROADMAP e a "Próxima tarefa"
foram atualizados; skills afetadas foram revisadas.

## Hooks locais

Versionados em `.githooks/` e ativados pelo `npm install` (script `prepare` → `git config core.hooksPath`).

| Hook         | Roda                                                              | Tempo alvo  |
| ------------ | ----------------------------------------------------------------- | ----------- |
| `pre-commit` | lint-staged (ESLint + Prettier nos arquivos staged) e `typecheck` | segundos    |
| `commit-msg` | commitlint                                                        | instantâneo |
| `pre-push`   | `npm run check` completo                                          | 1–2 min     |

## Ciclo de contexto do Claude Code

O Claude trabalha em contextos pequenos: uma tarefa por sessão. O ciclo, sustentado pelos hooks de
`.claude/settings.json` (decisões em [ADR 0004](adr/0004-handoff-de-contexto-em-state-md-com-hooks.md) e
[ADR 0005](adr/0005-state-md-local-por-clone.md)):

1. `SessionStart` injeta `docs/STATE.md` (handoff) e a próxima tarefa do roadmap.
2. Durante a tarefa, trabalho que pode ser isolado vai para subagents; só o resumo volta ao contexto.
3. Ao concluir, `/handoff` sobrescreve `docs/STATE.md`, que é local de cada clone (está no `.gitignore` e
   nunca vai para commit). Se houver commit seu novo sem handoff, o hook `Stop` bloqueia o encerramento e
   pede o handoff; commits trazidos por `git pull` não contam.
4. O Claude avisa; o usuário roda `/clear`. Se o contexto estourar antes, `PreCompact` gera um handoff
   automático via `claude -p` (desligue com `CLAUDE_HANDOFF_AUTOGEN=0`).

## Versão e release

Versão oficial em um lugar só: `package.json` (`.release-please-manifest.json` é o espelho mantido pelo
release-please). O fluxo é da skill `/lancar-versao`:

1. Commits convencionais chegam na `main` via PR.
2. A CLI local abre/atualiza um **PR de release** com o bump de versão e o CHANGELOG gerado:
   `npx release-please release-pr --token "$(gh auth token)" --repo-url temponi-bernardo/claude-connectors`.
3. Revisar o PR de release (e a seção "Não lançado" do CHANGELOG, que vira a versão).
4. O Claude mergeia o PR de release, como qualquer PR. A confirmação humana fica em publicar o rascunho. Depois, a mesma CLI cria a tag `vX.Y.Z` e um
   **rascunho** de release: `npx release-please github-release --draft --token "$(gh auth token)" --repo-url
temponi-bernardo/claude-connectors`.
5. Publicar o rascunho quando quiser, anexando os `.mcpb` de `dist/connectors/`.

O **conector remoto** (ADR 0010) não depende de release: depois de um merge que mexe no conector, rode
`npm run worker:deploy` na `main` (precisa de `CLOUDFLARE_API_TOKEN`). Para testar antes, `npm run worker:dev`.

## Segurança no fluxo

- `gitleaks` roda no `secrets:check` (dentro do `check`, do `pre-push` e do `pr:check`). Sem CI, ele é a única
  barreira: sem gitleaks instalado o `secrets:check` falha (`winget install Gitleaks.Gitleaks`).
- Dependabot semanal para npm, agrupado (gratuito, não usa minutos de Actions). PR do Dependabot passa pelo
  mesmo `pr:check` antes do merge.
- Sem CodeQL e sem `dependency-review` (exigiam Actions). Antes de adicionar dependência nova, confira
  `npm audit` e a licença.
- `scripts/setup-github.sh` desliga o Actions, deixa só squash merge e tenta a branch protection, que em
  repositório privado no plano gratuito não é aplicada (exige GitHub Pro). Sem ela, os hooks locais
  (`guard-bash`, `pre-push`) impedem push direto na `main`.
