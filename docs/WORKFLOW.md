# Fluxo de trabalho

## Branches

- `main` é protegida: só recebe código por PR com CI verde; sem push direto, sem force push.
- Uma branch por tarefa: `<tipo>/<id-roadmap>-<descricao-curta>`, ex.: `feat/f2-1-processo-principal`,
  `fix/slug-acentos`, `docs/arquitetura-camadas`.
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

Escopos permitidos (`commitlint.config.js`): `core`, `docs`, `tools`, `ci`, `deps`, `skills`, `release`,
`config`. Ao criar uma camada ou módulo novo, adicione o escopo lá **e** aqui no mesmo PR.

`BREAKING CHANGE:` no rodapé (ou `!` após o tipo) gera major. O hook `commit-msg` valida localmente; o CI
valida o **título do PR**, porque com squash merge é ele que vira o commit da `main`.

## Pull request

1. Abra o PR cedo, como rascunho se ainda não terminou.
2. Título no formato Conventional Commits (vira o commit da `main`).
3. Preencha o template: o que mudou, como testar, checklist de documentação (cada doc marcado ou "não se
   aplica: motivo").
4. CI verde é obrigatório. Corrija em vez de pular (`--no-verify` é proibido e barrado pelo Claude Code).
5. Merge por **squash**, apagando a branch.

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
2. O workflow `release-please` abre/atualiza um **PR de release** com o bump de versão e o CHANGELOG gerado.
3. Revisar o PR de release (e a seção "Não lançado" do CHANGELOG, que vira a versão).
4. Mergear o PR de release — essa é a confirmação humana. O workflow cria a tag `vX.Y.Z` e um **rascunho**
   de release no GitHub.
5. Publicar o rascunho quando quiser. Segredos necessários a releases futuras estão comentados em
   `.github/workflows/release-please.yml`.

## Segurança no fluxo

- `gitleaks` roda no CI em todo PR e no `secrets:check` local (pre-push). Sem gitleaks instalado, o
  `secrets:check` local falha; pule conscientemente com `SECRETS_CHECK=skip` (o CI ainda barra).
- Dependabot semanal, agrupado; `dependency-review` bloqueia dependências com vulnerabilidade conhecida.
- CodeQL em PRs, em push na `main` e semanalmente.
- `dependency-review` e CodeQL só rodam em repositório público: em privado exigem GitHub Advanced
  Security / Code Security, e os jobs são pulados (job pulado conta como aprovado na branch protection).
- Branch protection configurada por `scripts/setup-github.sh`. Em repositório privado no plano gratuito o
  GitHub não oferece branch protection: o script avisa, termina o resto e sai com código 1.
- Actions fixadas por SHA do commit (com a versão em comentário); o Dependabot as atualiza.
