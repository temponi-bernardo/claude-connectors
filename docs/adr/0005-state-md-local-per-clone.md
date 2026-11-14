# 0005 — `docs/STATE.md` como estado local de cada clone

- **Estado:** Aceito
- **Data:** 2026-10-19
- **Relacionado:** substitui em parte o ADR 0004 (onde o STATE.md vive e o critério do hook `Stop`)

## Contexto

O ADR 0004 versionava `docs/STATE.md`. Mas o `/handoff` roda ao fim da tarefa, depois do squash merge, já
na `main` — onde não se commita. O handoff ficava como mudança solta na `main`, ia parar no PR seguinte (sem
relação com ele) ou gerava conflito. Além disso, o hook `Stop` tratava qualquer HEAD novo como "tarefa
concluída", inclusive o que chega por `git pull`, e cobrava um handoff sem trabalho feito.

## Decisão

`docs/STATE.md` é **local de cada clone**: fica no `.gitignore`, é sobrescrito pelo `/handoff` e lido pelo
hook `SessionStart`, como antes, mas nunca entra em commit. O hook `Stop` só cobra handoff quando há commit
novo **feito por esta pessoa** (committer = `git var GIT_COMMITTER_IDENT`); commits de outros, como o squash
do GitHub trazido por `git pull`, só avançam o marcador.

## Alternativas consideradas

| Alternativa                                   | Motivo para descartar                                                      |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| Fazer o handoff dentro do PR, antes do squash | O estado pós-merge (próxima tarefa, merge feito) nunca entraria no handoff |
| Commit direto na `main` só para o STATE.md    | Viola "nada direto na `main`" e a branch protection                        |
| Ignorar commits que já estão em `@{upstream}` | Um push no mesmo turno do commit faria o hook deixar de cobrar o handoff   |

## Consequências

- Positivas: a `main` fica limpa depois de cada tarefa; nenhum PR carrega handoff de outra tarefa; `git pull`
  não dispara cobrança falsa.
- Negativas / custos aceitos: o handoff não é revisado em PR nem compartilhado entre máquinas — quem troca de
  máquina recomeça pelo ROADMAP e pelo histórico de PRs. Um clone novo começa sem STATE.md (o `SessionStart`
  avisa).
- O que muda nos docs: `.gitignore`, WORKFLOW.md, DOCUMENTATION.md, CLAUDE.md, skills `/handoff` e
  `/tarefa`, `.claude/rules/docs.md`.
