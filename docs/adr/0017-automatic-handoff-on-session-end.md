# 0017 — Handoff automático no SessionEnd

- **Estado:** Aceito
- **Data:** 2026-11-14
- **Relacionado:** complementa os ADRs 0004 e 0005 (handoff em `docs/STATE.md`)

## Contexto

O ciclo de contexto pequeno depende de `/handoff` antes do `/clear`. O `Stop` só cobra o handoff quando há commit
novo, e o `PreCompact` só roda quando a conversa é compactada. Um `/clear` (ou o fim da sessão) depois de editar
arquivos sem commitar perdia o estado: a sessão seguinte começava sem saber o que estava em andamento.

## Decisão

Um hook `SessionEnd` (`session-end-handoff.sh`) reaproveita a geração do `PreCompact` (`generate_handoff` em
`hook-lib.sh`, via `claude -p`). Ele só gera se `handoff_is_stale` disser que o transcript tem trabalho (Edit,
Write, MultiEdit, NotebookEdit fora do `STATE.md`, ou Bash com `git commit`/`merge`/`push`) depois da última
modificação do `STATE.md`. O `timeout` de 60 s no `settings.json` eleva o orçamento padrão de 1,5 s do SessionEnd.

## Alternativas consideradas

| Alternativa                                    | Motivo para descartar                                                        |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| Gerar em todo SessionEnd                       | Gasta tokens e trava o `/clear` até 45 s mesmo em sessão só de conversa      |
| Rodar `claude -p` em segundo plano (detached)  | O SessionStart do `/clear` leria o STATE.md antigo; resultado chegaria tarde |
| Bloquear o `/clear` até haver handoff          | Impossível: SessionEnd não tem controle de decisão                           |
| Comparar só o marcador `.claude/.last-handoff` | O marcador só anda com commit; não detecta edição sem commit                 |

## Consequências

- Positivas: `/clear` ou saída sem handoff não perde mais o estado; sessão sem trabalho não custa nada.
- Negativas / custos aceitos: quando dispara, o `/clear` espera o `claude -p` (até `CLAUDE_HANDOFF_TIMEOUT`, 45 s);
  edições feitas por Bash fora de `git commit`/`merge`/`push` (ex.: `sed -i`) não contam como trabalho; a doc do
  Claude Code não garante que o SessionEnd termine antes do SessionStart do `/clear` — se não terminar, o handoff
  vale para a sessão seguinte. Desligue com `CLAUDE_HANDOFF_AUTOGEN=0`.
- O que muda nos docs: WORKFLOW.md, DOCUMENTATION.md, CLAUDE.md e o índice de ADRs.
