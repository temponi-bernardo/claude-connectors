---
name: handoff
description: Use ao concluir uma tarefa ou um passo grande, ou quando o hook Stop pedir. Sobrescreve docs/STATE.md com um resumo curto e concreto do que foi feito, do que está em andamento e dos próximos passos, para que a próxima sessão retome sem o excesso de contexto desta.
---

# Handoff de contexto

Objetivo: a próxima sessão (após `/clear`) começa sabendo exatamente onde parou, lendo só `docs/STATE.md`.

## Passos

1. Levante o que mudou nesta sessão: `git status --porcelain`, `git log --oneline main..HEAD` (ou os
   últimos commits) e o que você lembra de decisões e erros abertos.
2. **Sobrescreva** `docs/STATE.md` com exatamente estas seções, nesta ordem:
   - `# Estado atual` — uma linha de contexto (branch, tarefa, data).
   - `## Tarefa atual` — id do roadmap e critério "Pronto quando".
   - `## Feito` — bullets concretos (arquivo, função, comando), no passado.
   - `## Em andamento` — o que está pela metade e **em que ponto exato** parou.
   - `## Próximos passos` — lista numerada, acionável, primeiro item = o que fazer ao retomar.
   - `## Arquivos tocados` — caminhos, um por linha, com uma palavra do porquê.
   - `## Decisões e pendências` — decisões tomadas (com link ao ADR se houver), dúvidas abertas, erros
     ainda não resolvidos, comandos que falharam.
3. Limite: **60 linhas**. Nada de narrativa, nada de histórico já commitado em versões anteriores do
   STATE.md. Fato duplicado em ROADMAP/CHANGELOG/ADR → linke em vez de repetir.
4. Se a tarefa fechou: atualize também `docs/ROADMAP.md` (estado e "Próxima tarefa"), conforme
   `.claude/rules/docs.md`.
5. **Não commite** o STATE.md: ele é local de cada clone e está no `.gitignore`
   ([ADR 0005](../../../docs/adr/0005-state-md-local-por-clone.md)). Por isso pode ser escrito depois do merge,
   já na `main`.
6. Termine a resposta com: **"Handoff salvo em docs/STATE.md. Rode `/clear` para continuar com contexto
   limpo."**

## Não faça

Não colar diffs ou saídas de comando; não deixar `_preencher_`; não gravar segredos ou caminhos fora do
repositório; não pular o aviso de `/clear`.
