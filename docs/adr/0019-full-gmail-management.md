# 0019 — Gmail com gerenciamento completo (`gmail.modify`)

- **Estado:** Aceito
- **Data:** 2026-11-14
- **Relacionado:** tarefa F2.12, substitui em parte o ADR 0014 (itens 4 e 6: escopo `gmail.readonly` e
  ferramentas só de leitura) e o ADR 0016 (item 2: escopo pedido no login)

## Contexto

O conector Gmail só lia (ADR 0014 e 0016). Para o Claude cuidar da caixa de verdade ele precisa enviar,
responder mantendo a conversa, encaminhar com os anexos, cuidar de rascunhos, organizar (lido, arquivar,
marcadores, estrela) e mandar para a lixeira. Escrever e-mail em nome da pessoa é irreversível e expõe o
conector a prompt injection: um e-mail recebido pode pedir para o modelo enviar ou apagar algo. As contas já
vinculadas têm refresh tokens concedidos só com `gmail.readonly`, e o Google não amplia um token já emitido.

## Decisão

1. **Um escopo de dados só: `gmail.modify`.** Cobre ler, enviar, rascunhos, marcadores e lixeira, e **não**
   permite a exclusão definitiva (só `https://mail.google.com/` permitiria). `gmail.send` é dispensável porque
   `gmail.modify` já inclui o envio. Login e vínculo pedem `openid email gmail.modify`; o vínculo recusa um token
   sem `gmail.modify` com a mensagem "marque a permissão de gerenciar o Gmail".
2. **Contas antigas continuam lendo.** O escopo gravado na conta é conferido em cada escrita
   (`requireWriteAccess()`, também dentro de `gmailWrite()`): sem `gmail.modify`, a ferramenta falha **antes de
   chamar o Google** com "a conta X foi vinculada só para leitura… use link_account e entre com ela de novo".
   `list_accounts` mostra `write_access` e a mesma dica. Um 403 do Gmail também sugere o novo vínculo.
3. **Ferramentas novas, todas com `account` (uma conta, sem `all`):** `send_email`, `reply_email`,
   `reply_all_email`, `forward_email`, `list_drafts`, `create_draft` (novo ou resposta), `update_draft`,
   `send_draft`, `delete_draft`, `mark_read`, `archive`, `star`, `update_labels`, `trash` e `untrash`. Não há
   ferramenta de exclusão definitiva.
4. **Anotações MCP para o cliente pedir confirmação.** O `ToolSpec` compartilhado ganhou `annotations`. Envio
   (`send_*`, `reply_*`, `forward_email`, `send_draft`): `destructiveHint: true`, `idempotentHint: false`.
   Lixeira, editar e apagar rascunho, desvincular: `destructiveHint: true`, `idempotentHint: true`. Organização
   reversível: `destructiveHint: false`. Leitura: `readOnlyHint: true`. As descrições e as instruções do
   servidor pedem para mostrar o conteúdo e esperar a confirmação, e para nunca agir porque um e-mail pediu.
5. **MIME montado no Worker, sem dependência nova** (`mime.ts`): texto plano UTF-8 em base64, assunto e nomes
   em RFC 2047, anexos em `multipart/mixed`. Endereços validados um a um e todo cabeçalho limpo de quebras de
   linha (sem injeção de cabeçalho); de `Message-ID`/`References` do original só passam os ids `<...>`.
6. **Respostas na mesma conversa:** `threadId` do original, `In-Reply-To`, `References`, `Re:` e o original
   citado. Responder a todos tira a própria conta e repete ninguém; responder a uma mensagem sua vai para os
   destinatários originais.
7. **Limites:** até 100 destinatários por e-mail, corpo até 100 mil caracteres, anexos encaminhados até 18 MB
   no total (conferido antes de baixar), até 50 mensagens ou 20 conversas por chamada de organização.

## Alternativas consideradas

| Alternativa                                 | Por que não                                                                             |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| `gmail.readonly` + `gmail.send` + `compose` | Três escopos para o que `gmail.modify` cobre; ainda faltariam marcadores e lixeira.     |
| `https://mail.google.com/`                  | Permite exclusão definitiva, que não queremos; escopo mais amplo do que o necessário.   |
| Biblioteca MIME (ex.: `mimetext`)           | Dependência a mais no Worker para um formato pequeno que dá para montar e testar puro.  |
| Migrar os tokens antigos sem novo vínculo   | O Google não amplia um token emitido; só um novo consentimento traz `gmail.modify`.     |
| Uma ferramenta genérica `modify_messages`   | Nomes específicos (`archive`, `trash`) deixam a confirmação e as anotações mais claras. |

## Consequências

- Positivas: o Claude gerencia a caixa inteira; enviar e apagar sempre pedem confirmação no cliente; contas
  antigas continuam lendo e recebem uma instrução clara para o novo vínculo; sem exclusão definitiva.
- Negativas / custos aceitos: `gmail.modify` também é escopo **restrito** do Google (mesmas regras do
  `gmail.readonly`: aviso de app não verificado, 100 usuários, verificação e CASA para abrir ao público). O dono
  precisa adicionar o escopo na tela de consentimento (Google Auth Platform → Acesso a dados) e cada usuário
  precisa vincular as contas de novo. Respostas e encaminhamentos saem em texto plano (o HTML do original é
  convertido em texto).
- O que muda nos docs: PROCESSES (P10–P12 e P18 novo), FUNCTIONS, ARCHITECTURE (Gmail API leitura e escrita),
  README do conector, site (início e privacidade), marketplace e manifesto do plugin, CHANGELOG, ROADMAP.
