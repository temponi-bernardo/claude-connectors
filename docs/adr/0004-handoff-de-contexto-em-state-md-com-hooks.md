# 0004 — Handoff de contexto em `docs/STATE.md` com hooks do Claude Code

- **Estado:** Substituído em parte por [0005](0005-state-md-local-por-clone.md) (STATE.md local e critério do `Stop`)
- **Data:** 2026-10-19
- **Relacionado:** ADR 0002 (docs como fonte da verdade)

## Contexto

Sessões longas do Claude Code acumulam contexto irrelevante, degradam a qualidade e estouram a janela.
Queremos que o Claude trabalhe em contextos pequenos: ao fim de cada tarefa, o contexto é descartado
(`/clear`) e a sessão seguinte retoma só com o essencial. Restrições: o Claude **não consegue** executar
`/clear` nem `/compact` por conta própria (são comandos do usuário), e hooks são scripts de shell, não a IA.

## Decisão

O estado de retomada vive em `docs/STATE.md`, sobrescrito a cada tarefa pela skill `/handoff`. Três hooks
fecham o ciclo: `Stop` bloqueia o encerramento quando há commit novo sem handoff; `SessionStart` injeta o
STATE.md em toda sessão (inclusive após `/clear` e compactação); `PreCompact` gera um handoff automático
via `claude -p` como rede de segurança. O usuário roda `/clear` quando o Claude avisar.

## Alternativas consideradas

| Alternativa                                         | Motivo para descartar                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------------ |
| Depender só de `/compact`                           | Resumo imprevisível, perde detalhes; não dá pra escolher o que fica            |
| Pedir no CLAUDE.md para o Claude "rodar `/clear`"   | Impossível: não existe tool nem hook para isso; a regra seria ignorada         |
| Hook gerar sempre o handoff via `claude -p`         | Gasta tokens a cada turno e perde o contexto que o Claude tem no fim da tarefa |
| Bloquear o `Stop` a cada turno com mudança pendente | Interrompe trabalho em andamento; "commit novo" marca o fim de uma etapa       |

## Consequências

- Positivas: retomada barata e previsível; `/clear` deixa de custar informação; o STATE.md é um doc comum,
  revisável em PR.
- Negativas / custos aceitos: marcador local `.claude/.last-handoff` (ignorado pelo git); `PreCompact`
  depende do binário `claude` no PATH e gasta tokens quando dispara.
- O que muda nos docs: STRUCTURE.md (skill nova), README.md e DOCUMENTATION.md (STATE.md), WORKFLOW.md e
  CLAUDE.md (hooks e regra de contexto pequeno).
