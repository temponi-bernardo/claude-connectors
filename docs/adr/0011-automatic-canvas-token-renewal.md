# 0011 — Renovação automática do token do Canvas no refresh do OAuth

- **Estado:** Aceito
- **Data:** 2026-11-05
- **Relacionado:** F2.8, substitui em parte a ADR 0009 (custo "reconectar a cada 30 dias")

## Contexto

O conector remoto (ADR 0009) guarda o token pessoal do Canvas selado nos tokens OAuth. O token da PUC vence
e o usuário precisava gerar outro e reconectar todo mês. Testes com o Canvas da PUC em 2026-11-05 mostraram:

- `GET /api/v1/users/self/user_generated_tokens` funciona com o próprio token, e cada item traz o começo
  visível do token (`visible_token`), o que permite achar o próprio.
- `PUT /api/v1/users/self/tokens/:id` com `token[expires_at]` funciona com o próprio token, sem gerar outro.
- A validade pedida não pode passar de **30 dias a partir de agora** (400 "Expiration date cannot be more than
  30 days in the future"). O `ENV` da página fala em 90 dias, mas a API aplica 30.

## Decisão

1. `RemoteConnector` ganha `renewSecret` opcional. A cada `grant_type=refresh_token`, `handleToken()` chama
   `renewSecretQuietly()` antes de responder; falha na renovação só vira aviso no log e o refresh segue.
2. No Canvas, `renewCanvasToken()` lista os tokens, acha o próprio pelo `visible_token` e estende a validade
   para agora + 30 dias − 1 hora (`TOKEN_RENEWAL_SECONDS`), só se ela vence mais de um dia antes disso (no
   máximo um `PUT` por dia). Token sem validade ou com validade maior não é tocado.
3. O token não é regenerado: o segredo selado continua o mesmo e nada mais precisa mudar.

## Alternativas consideradas

| Alternativa                             | Por que não                                                                   |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| Regenerar o token (`token[regenerate]`) | Troca o segredo; exigiria emitir tokens OAuth novos e não traz ganho.         |
| Criar um token novo a cada renovação    | Deixa tokens órfãos na conta do usuário e também troca o segredo.             |
| Token de 90 dias e reconectar a cada 3  | A API recusa mais de 30 dias; e ainda obrigaria a reconectar.                 |
| Renovar por agendamento (Cron Trigger)  | O Worker não guarda tokens (sem estado); só os conhece quando o Claude chama. |

## Consequências

- Positivas: quem usa o conector ao menos uma vez a cada 30 dias não reconecta mais.
- Negativas / custos aceitos: um `GET` extra ao Canvas a cada refresh (cerca de 1 por hora de uso); se o
  usuário ficar mais de 30 dias sem usar, o token vence e ele reconecta como antes; depende de a PUC continuar
  permitindo o `PUT` com o próprio token.
- O que muda nos docs: PROCESSES (P08 passo 7, P09), FUNCTIONS, README do conector, ROADMAP (F2.8), CHANGELOG.
