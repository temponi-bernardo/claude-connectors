---
name: lancar-versao
description: Use quando a pessoa pedir para preparar, revisar ou publicar uma release (nova versão, tag, changelog), para conduzir o release-please pela CLI local descrito em docs/WORKFLOW.md sem criar tag sem confirmação humana.
disable-model-invocation: true
---

# Lançar uma versão

Fluxo completo em `docs/WORKFLOW.md` (seção "Versão e release") e decisões em `docs/adr/0003` e `0006`
(não há GitHub Actions: o release-please roda pela CLI local).

## Passos

1. **Confira a `main`:** `git fetch && git switch main && git pull`, `git log --oneline -20` (todos
   convencionais?) e `npm run check` verde na `main`.
2. **Changelog humano:** leia a seção "Não lançado" de `CHANGELOG.md`. Falta algo que os commits `feat`/`fix`
   desde a última tag indicam (`git log <última-tag>..origin/main --oneline`)? Complete em um PR
   `docs(release): ...` antes de seguir.
3. **PR de release:** `npx release-please release-pr --token "$(gh auth token)" --repo-url temponi-bernardo/claude-connectors` abre ou atualiza o PR
   (`gh pr list --label "autorelease: pending"`). Abra o PR e confira: versão proposta coerente com os
   commits (feat → minor, fix → patch, BREAKING → major), CHANGELOG gerado legível.
4. **Mova "Não lançado"** para a versão no PR de release se o texto humano for melhor que o gerado (edite a
   branch do release-please; ele preserva edições manuais no CHANGELOG).
5. **Mergeie** o PR de release sem pedir confirmação (`gh pr merge --squash`), como qualquer PR com
   `pr:check` verde (`docs/WORKFLOW.md`). Nunca crie tag à mão.
6. **Tag e rascunho:** depois do merge, `npx release-please github-release --draft --token "$(gh auth token)" --repo-url temponi-bernardo/claude-connectors`
   cria a tag `vX.Y.Z` e o rascunho com as notas. Não há anexo: o plugin aponta para o servidor remoto
   (ADR 0013). Publicar é decisão da pessoa (`gh release edit vX.Y.Z --draft=false`).
7. **Servidor remoto:** se a release mexeu no conector, rode `npm run worker:deploy` na `main` (precisa de
   `CLOUDFLARE_API_TOKEN`); sem isso, quem instalou pelo marketplace continua na versão antiga do Worker.
8. **Depois:** confirme que `package.json` e `.release-please-manifest.json` têm a mesma versão na `main`;
   abra nova seção "Não lançado" vazia no CHANGELOG se o release-please não o fez; ROADMAP: marque a tarefa
   de release como ✅.
