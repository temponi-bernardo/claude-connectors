# 0003 — release-please para versão, tag e changelog

- **Estado:** Aceito
- **Data:** 2026-10-01
- **Relacionado:** F0.1, F2.2

## Contexto

A versão precisa viver em um lugar só, o CHANGELOG precisa refletir os commits e a tag `vX.Y.Z` só pode
nascer com confirmação humana. Uma proposta inicial previa script próprio de sincronização de versão e
edição manual do CHANGELOG antes de criar a tag.

## Decisão

Usar o `release-please` (GitHub Action). Ele lê os Conventional Commits da `main`, abre um PR de release com
bump de versão em `package.json` e CHANGELOG gerado; **mergear esse PR é a confirmação humana** e cria tag e
rascunho de release. Squash merge + validação do título do PR no CI garantem que a `main` só tenha commits
convencionais.

## Alternativas consideradas

| Alternativa                         | Por que não                                                     |
| ----------------------------------- | --------------------------------------------------------------- |
| Script próprio de bump + tag manual | Mais código para manter e testar; reinventa o que a ação faz    |
| changesets                          | Ótimo para monorepos com vários pacotes; excesso para um pacote |
| semantic-release                    | Publica direto sem passo humano; queremos a confirmação via PR  |

## Consequências

- Positivas: fonte única de versão (`package.json`, espelhada em `.release-please-manifest.json`),
  changelog automático, tag só após merge humano.
- Negativas: a seção "Não lançado" do CHANGELOG é mantida à mão como visão humana e precisa ser movida para a
  versão no PR de release (a skill `/lancar-versao` cuida disso).
- Docs afetados: WORKFLOW.md (seção release), CHANGELOG.md.
