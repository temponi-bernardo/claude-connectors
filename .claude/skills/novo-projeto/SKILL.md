---
name: novo-projeto
description: Use na primeira sessão de um repositório criado a partir do template-new-project, quando ainda houver marcadores {{PROJECT_NAME}} no CLAUDE.md ou README.md, para adaptar o template ao projeto real.
disable-model-invocation: true
---

# Adaptar o template a um projeto novo

Objetivo: sair desta sessão com o repositório sem marcadores, com produto definido, stack decidida e a
Fase 1 do roadmap pronta para começar.

## Passos

1. **Colete as decisões que mudam a estrutura**, de uma vez, com opções e uma recomendação para cada:
   nome, ideia em uma frase, plataformas/público, modelo de negócio (se houver), stack (ou "recomende"),
   conta do GitHub e política de merge ("você pode mergear com CI verde" ou "eu faço todos").
2. **Rode a substituição de marcadores:**
   `npm run init -- --name "<nome>" --description "<frase>" --owner <conta>`.
   Ele também renomeia o pacote (`package.json`/`package-lock.json`) e esvazia "Não lançado" no CHANGELOG.
   Confira que `grep -rn '{{[A-Z_]*}}' --include='*.md' --include='*.json' . | grep -v node_modules` só
   devolve a documentação do próprio init (PROCESSES.md e FUNCTIONS.md, removidas no passo 10).
3. **Produto:** preencha `docs/PRODUCT.md` (público, plataformas, planos) movendo as perguntas respondidas
   para "Decididas" com a data de hoje. Perguntas sem resposta ficam em "Abertas".
4. **Stack:** se for diferente de TypeScript/Node para o código de produto, escreva um ADR
   (próximo número livre em `docs/adr/`) seguindo `docs/adr/0000-modelo.md`, atualize `docs/ARCHITECTURE.md` e, se houver
   outra linguagem analisada, registre em ROADMAP a tarefa de estender `tools/docs/ast.ts`.
5. **Interface:** se houver, siga a seção "Quando houver interface" de `docs/UI.md` (inclusive `uiDir` em
   `docs.config.json`). Se não houver, deixe `docs/UI.md` como está.
6. **Política de merge:** registre em `docs/WORKFLOW.md` (seção Pull request) quem mergeia. Se o Claude
   pode mergear com CI verde, a skill `/tarefa` já prevê isso.
7. **Roadmap:** reescreva as Fases 1 e 2 de `docs/ROADMAP.md` para o produto real, mantenha a Fase 0 como
   concluída e defina o MVP. Atualize a "Próxima tarefa".
8. **Esqueleto:** substitua `src/core/slug.ts` pela primeira lógica pura real do produto (ou mantenha como
   exemplo até a F2.1 — decida e registre no ROADMAP). Se remover, remova também seções em FUNCTIONS.md,
   P04 em PROCESSES.md e a exceção `main` se mudar.
9. **GitHub:** se o repositório ainda não existe:
   1. `gh auth status` precisa dos escopos `repo` e `workflow`; se faltar, peça para a pessoa rodar
      `gh auth refresh -h github.com -s workflow`.
   2. Se `git config user.name`/`user.email` estiverem vazios, configure só neste repositório:
      `git config user.name "<nome de gh api user --jq .name>"` e `git config user.email "<e-mail>"`, onde
      o e-mail é `gh api user --jq .email` ou, se vier `null`, o noreply
      `<id>+<login>@users.noreply.github.com` (`id` de `gh api user --jq .id`).
   3. `gh repo create <owner>/<nome> --private --source=. --push` (ou `--public`). Se o push falhar com
      "Host key verification failed", rode `ssh-keyscan github.com` para um arquivo temporário, confira os
      fingerprints (`ssh-keygen -lf`) contra `gh api meta --jq .ssh_key_fingerprints` e só então anexe a
      `~/.ssh/known_hosts`. O repositório já foi criado: o retry é `git push -u origin main`, que o hook
      `guard-bash` bloqueia — peça para a pessoa rodar no terminal dela (não contorne o guard).
   4. `bash scripts/setup-github.sh <owner>/<nome>` e confira o resultado: o script ignora falhas dos
      endpoints de segurança. Em repositório privado, `private-vulnerability-reporting` dá 404 (só existe em
      público; `SECURITY.md` já orienta o e-mail ao mantenedor) e CodeQL e `dependency-review` são pulados
      (exigem GitHub Advanced Security). Confira
      `gh api repos/<owner>/<nome>/branches/main/protection` e o primeiro CI com `gh run watch`.
10. **Remova o inicializador**, que não serve mais: apague `tools/init/`, o script `init` do
    `package.json`, a entrada `runInitCli` de `src/test-exceptions.ts`, a linha `tools/init/` (e a menção na
    árvore) de `docs/STRUCTURE.md`, o processo P03 de `docs/PROCESSES.md`, a linha `TEMPLATE_FILES` (e
    `PACKAGE_FILES`, `CHANGELOG_FILE`) da tabela "Dados e constantes" e a seção "Este repositório veio de um
    template" do `README.md`. `npm run docs:generate` poda sozinho as seções órfãs do FUNCTIONS.md.
11. **Feche:** `npm run check` verde, commit `chore(config): adaptar template ao projeto <nome>` em branch
    própria, PR, e `/melhorar-skills` (esta skill pode ser apagada depois de usada — registre a decisão).

## Resultado esperado

Sem marcadores; PRODUCT, ROADMAP, ARCHITECTURE e WORKFLOW refletem o projeto; `npm run check` verde; PR
aberto; próxima tarefa definida.
