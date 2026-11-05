---
name: tarefa
description: Use para pegar a próxima tarefa do docs/ROADMAP.md (ou uma tarefa indicada, ex. "F2.1") e levá-la do entendimento ao merge, passando por branch, TDD, documentação, check e PR.
argument-hint: '[id da tarefa, ex. F2.1]'
---

# Executar uma tarefa do roadmap

Tarefa alvo: `$ARGUMENTS` (vazio = a "Próxima tarefa" do topo de `docs/ROADMAP.md`).

## Passos

1. **Entenda pelos docs, não pelo código.** Leia a linha da tarefa no ROADMAP (critério "Pronto quando"),
   depois o que `docs/README.md` indicar: PROCESSES.md para o fluxo tocado, FUNCTIONS.md para as funções
   envolvidas (e quem as usa), ARCHITECTURE.md para a camada certa, STRUCTURE.md para onde colocar arquivos
   novos. Só abra código que FUNCTIONS.md apontar.
2. **Marque a tarefa como 🟨** no ROADMAP.
3. **Branch** a partir da `main` atualizada: `git switch -c <tipo>/<id>-<descricao>` (ver
   `docs/WORKFLOW.md`).
4. **Implemente com `/testes-primeiro`**: teste → falhar → código mínimo → refatorar, uma função por vez,
   respeitando `docs/CODING-STANDARDS.md`. Antes de criar função, procure equivalente em FUNCTIONS.md.
5. **Documente com `/atualizar-docs`** no mesmo conjunto de mudanças.
6. **`npm run check`** até ficar verde. Não use `--no-verify`; corrija a causa.
7. **Commits** pequenos no formato Conventional Commits com descrição em português.
8. **PR:** `gh pr create` com título convencional, corpo pelo template (`.github/PULL_REQUEST_TEMPLATE.md`),
   checklist de documentação preenchido item a item. Antes, rode `npm run pr:check -- "<título do PR>"`
   (não há CI, ADR 0006); corrija até ficar verde; responda comentários.
9. **Merge:** o Claude mergeia com `pr:check` verde (`docs/WORKFLOW.md`). Rode o `pr:check` de novo na
   branch final e então `gh pr merge --squash --delete-branch`. Se o PR mexeu no conector Canvas, publique
   o remoto na `main` atualizada: `npm run worker:deploy` (precisa de `CLOUDFLARE_API_TOKEN`, ADR 0010).
10. **Feche a tarefa:** ✅ no ROADMAP, "Próxima tarefa" atualizada, entrada no CHANGELOG se visível ao
    usuário. Isso pode ir no mesmo PR (preferido) ou em um PR `docs(docs): ...` imediato.
11. **`/melhorar-skills`**: algo se repetiu ou mudou? Atualize a skill no mesmo PR.
12. **`/handoff`**: sobrescreva `docs/STATE.md` (local, não vai para commit) e avise o usuário para rodar
    `/clear`. O hook `Stop` cobra isso se houver commit seu novo sem handoff.

## Não faça

Não comece a codar sem ler os docs; não crie função sem teste; não deixe `_preencher_` no FUNCTIONS.md; não
abra PR com `check` vermelho; não toque na `main`; não encerre a tarefa sem `/handoff`. Não grave arquivo por
heredoc ou script no Bash se o texto tiver `.env` entre aspas (ex.: `process.env`): o guard bloqueia; use
Write/Edit.
