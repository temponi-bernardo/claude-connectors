---
name: lancar-versao
description: Use quando a pessoa pedir para preparar, revisar ou publicar uma release (nova versão, tag, changelog), para conduzir o fluxo do release-please descrito em docs/WORKFLOW.md sem criar tag sem confirmação humana.
disable-model-invocation: true
---

# Lançar uma versão

Fluxo completo em `docs/WORKFLOW.md` (seção "Versão e release") e decisão em `docs/adr/0003`.

## Passos

1. **Confira a `main`:** `git fetch && git log origin/main --oneline -20`. Todos os commits são convencionais?
   (Se o CI de título de PR está ativo, sim.) `gh run list --branch main --limit 5` verde?
2. **Changelog humano:** leia a seção "Não lançado" de `CHANGELOG.md`. Falta algo que os commits `feat`/`fix`
   desde a última tag indicam (`git log <última-tag>..origin/main --oneline`)? Complete em um PR
   `docs(release): ...` antes de seguir.
3. **PR de release:** `gh pr list --label "autorelease: pending"`. Se não existe, dispare o workflow:
   `gh workflow run release-please.yml` e aguarde. Abra o PR e confira: versão proposta coerente com os
   commits (feat → minor, fix → patch, BREAKING → major), CHANGELOG gerado legível.
4. **Mova "Não lançado"** para a versão no PR de release se o texto humano for melhor que o gerado (edite a
   branch do release-please; ele preserva edições manuais no CHANGELOG).
5. **Pare e peça confirmação explícita** para mergear o PR de release. Só mergeie (`gh pr merge --squash`)
   com um "sim" da pessoa. Nunca crie tag à mão.
6. **Acompanhe:** o workflow cria a tag `vX.Y.Z` e um **rascunho** de release. `gh release view vX.Y.Z`.
   Publicar o rascunho é decisão da pessoa (`gh release edit vX.Y.Z --draft=false`).
7. **Depois:** confirme que `package.json` e `.release-please-manifest.json` têm a mesma versão na `main`;
   abra nova seção "Não lançado" vazia no CHANGELOG se o release-please não o fez; ROADMAP: marque a tarefa
   de release como ✅.
