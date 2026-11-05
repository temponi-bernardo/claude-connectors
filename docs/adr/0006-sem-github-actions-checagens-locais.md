# 0006 — Sem GitHub Actions: checagens e release rodam localmente

- **Estado:** Aceito
- **Data:** 2026-11-05
- **Relacionado:** tarefa F0.2, ADR 0003 (substituído em parte)

## Contexto

O dono do repositório não quer nenhum custo de GitHub Actions. O repositório é privado, e em repositório
privado os minutos de Actions são cobrados ou consomem a cota do plano. Todo o trabalho é feito pelo Claude
Code na máquina local, que já tem os git hooks e o `npm run check`.

## Decisão

GitHub Actions fica desligado no repositório e não há arquivos em `.github/workflows/`. O papel do CI passa
para o script local `npm run pr:check -- "<título do PR>"`, obrigatório antes de abrir e de mergear um PR.
O release-please continua (ADR 0003), mas roda pela CLI local (`npx release-please`), que só usa a API do
GitHub.

## Alternativas consideradas

| Alternativa                            | Por que não                                                            |
| -------------------------------------- | ---------------------------------------------------------------------- |
| Manter o CI no Actions                 | Custo de minutos em repositório privado, recusado pelo dono.           |
| Repositório público (Actions gratuito) | Expõe código e configuração pessoal de acesso ao Canvas.               |
| Runner self-hosted                     | Exige manter um serviço ligado; o Claude já roda tudo localmente.      |
| Só os git hooks, sem `pr:check`        | O `pre-push` não confere o título do PR, o build e os pacotes `.mcpb`. |

## Consequências

- Positivas: custo zero de Actions; o mesmo comando roda no PC e decide o merge.
- Negativas / custos aceitos: nada impede no servidor um merge sem checagem; a disciplina fica no fluxo
  (skill `/tarefa`) e nos hooks. O gitleaks passa a ser obrigatório localmente (`secrets:check` falha sem
  ele). CodeQL e `dependency-review` saem; o Dependabot (gratuito) segue só para npm.
- O que muda nos docs: WORKFLOW (PR, release, segurança), CLAUDE.md, STRUCTURE (`.github/workflows/` sai),
  skills `/tarefa` e `/lancar-versao`, SECURITY.md.
