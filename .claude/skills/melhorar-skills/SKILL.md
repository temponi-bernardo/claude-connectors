---
name: melhorar-skills
description: Use ao fim de cada tarefa, ou quando um passo se repetiu, um comando/ferramenta/regra mudou, ou uma skill levou a um erro, para decidir se alguma skill deve ser criada, atualizada ou removida — e fazer isso no mesmo PR.
---

# Revisar as skills do projeto

Regra 9 do CLAUDE.md: passo repetido, comando, ferramenta ou regra nova → skill criada ou atualizada no
mesmo PR. Skills vivem em `.claude/skills/<nome>/SKILL.md` e são listadas em `CLAUDE.md`.

## Perguntas a responder (responda todas, rápido)

1. Repeti algum procedimento manual nesta tarefa que não está em skill nenhuma? → **criar**.
2. Alguma skill mandou fazer algo de um jeito que não funcionou, está desatualizado ou duplicou regra que
   já está nos docs? → **atualizar** (apontar para o doc em vez de copiar a regra).
3. Mudou algum comando (`package.json`), hook, caminho ou doc que uma skill cita? → **atualizar**.
4. Alguma skill não foi usada há muito tempo e está coberta por outra? → **remover** (e tirar do
   CLAUDE.md).

## Como escrever uma skill

- `name` em kebab-case; `description` diz **quando** usar (gatilho concreto), não só o que faz — é por ela
  que o Claude decide invocar.
- Passos numerados, curtos, apontando para os docs. Nada de copiar regras de CODING-STANDARDS, TESTING ou
  WORKFLOW: linke.
- `disable-model-invocation: true` em skills com efeito externo que a pessoa deve disparar (release, criar
  repositório). `context: fork` em auditorias longas que poluiriam o contexto.
- Teste mentalmente: uma sessão nova, só com CLAUDE.md e esta skill, conseguiria executar?

## Feche

Atualize a tabela "Skills" do `CLAUDE.md` e, se a skill introduziu comando novo, `docs/WORKFLOW.md`.
Commit `chore(skills): ...` no mesmo PR da tarefa.
