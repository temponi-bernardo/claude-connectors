# 0015 — WhatsApp pessoal no Cloudflare Workers + Containers, sob demanda

- **Estado:** Aceito
- **Data:** 2026-11-14
- **Relacionado:** F3.1, F3.4, ADR 0009, ADR 0010, ADR 0014

## Contexto

O dono quer que o Claude (web, app, Cowork, Claude Code) leia o WhatsApp **pessoal**. Não há API oficial para
contas pessoais: o caminho é um cliente "aparelho conectado", como o [whatsmeow](https://github.com/tulir/whatsmeow)
(Go, MPL-2.0), que precisa de um processo com WebSocket aberto e estado local (chaves do Signal). Restrições:

- Template **self-host**: cada pessoa publica na própria conta Cloudflare; nunca um serviço multi-tenant.
- **Nada ligado sem uso:** container só sobe com uma chamada; sem keep-alive, polling, alarme próprio ou cron por
  padrão. O dono tem Workers Paid (US$ 5/mês, com Containers).
- O disco do container é efêmero; a sessão e o histórico precisam sobreviver, e duas instâncias nunca podem usar a
  mesma sessão (o WhatsApp derruba uma delas e as chaves divergem).
- Conteúdo das mensagens é escrito por terceiros: risco de prompt injection.

## Decisão

1. **Worker (TypeScript)** reaproveita `src/remote/` (OAuth 2.1 sem estado, ADR 0009) com um modo novo de **login
   delegado**: o `/authorize` manda o navegador ao **GitHub** (OAuth App do dono, escopo `user:email`) e só aceita
   e-mail verificado de `ALLOWED_EMAILS`; o segredo selado nos tokens é esse e-mail, reconferido a cada `/mcp`.
   GitHub em vez de Google: quem publica um template no Cloudflare tem conta no GitHub, o OAuth App é gratuito e
   não exige validar JWT (lemos `/user/emails` com o token de uso único).
2. **Container (Go + whatsmeow)** com API HTTP **interna** (`bridge/API.md`), autenticada por `BRIDGE_TOKEN`. O
   Worker fala com ela por **um único Durable Object** (`WhatsAppBridge`, nome fixo `owner`, classe `Container` de
   `@cloudflare/containers`) e `max_instances = 1`: instância única = sessão única.
3. **Sob demanda:** `sleepAfter` = `SLEEP_AFTER` (padrão `5m`); antes de dormir (`onActivityExpired`) o DO guarda um
   snapshot e para o container. Nenhum alarme nosso; o cron (`SYNC_CRON`) existe, mas desligado e documentado.
4. **Persistência:** SQLite local no container (`session.db` do whatsmeow + `messages.db`) e **snapshot cifrado no
   R2**: a ponte faz `VACUUM INTO`, junta num tar e cifra em blocos (formato `WAS1`: HKDF-SHA256 por snapshot,
   AES-256-GCM em blocos de 64 KiB, cabeçalho autenticado, flag de último bloco). A chave (`SNAPSHOT_KEY`) só existe
   no container; o Worker repassa o fluxo cifrado sem carregá-lo na memória. Snapshot no máximo 1×/min de uso, antes
   de dormir e, no melhor esforço, no `SIGTERM` (push para `snapshot.internal`, interceptado pelo Worker). Restore no
   boot, antes de conectar; snapshot que não abre **não** recomeça do zero sozinho (só pelo `/pair`). Gerações
   menores que a gravada são descartadas.
5. **Prazos:** toda ferramenta tem teto (`TOOL_TIMEOUT_MS`, 25 s); a espera do sync (`SYNC_WAIT_MS`, 8 s) cabe nele
   com folga, e o resultado sai parcial com aviso se o sync não terminou.
6. **Pareamento** em `/pair`, protegido pelo mesmo login do GitHub (cookie `__Host-` selado, state + nonce, CSRF e
   `Origin`), com código (PairPhone) e QR.
7. **Envio** só com `ENABLE_SEND=true`, para `SEND_ALLOWLIST`, uma mensagem de texto por vez, `confirmed_by_user`
   obrigatório e limite por hora no armazenamento do DO e de novo na ponte. _Atualizado em F3.4: envio ligado,
   allowlist opcional, citação e grupos — ver "Atualização: envio ligado" abaixo._
8. **Prompt injection:** todo resultado com conteúdo de terceiros vem sob `notice` de dado não confiável, com textos
   limpos (controle e bidi removidos, corte em 2.000 caracteres) e instruções do servidor MCP repetindo a regra.
9. **Instância `lite`** (1/16 vCPU, 256 MiB, 2 GB). Medição abaixo.

## Atualização: envio ligado (F3.4, 2026-11-14)

A pedido do dono, o envio passa a ser parte do uso normal. Muda só o item 7; o resto da decisão continua valendo.

- **Ligado por padrão:** `ENABLE_SEND = "true"` no `wrangler.toml` (o padrão no código continua `false`: quem
  apagar a variável fica sem envio).
- **Allowlist opcional:** `SEND_ALLOWLIST` vazia libera qualquer contato ou grupo; com itens (números ou JIDs),
  restringe como antes, no Worker e na ponte.
- **Mantidos:** `confirmed_by_user: true` a cada chamada, instrução para mostrar destinatário, texto e citação e
  pedir confirmação daquela mensagem exata, uma mensagem de texto por chamada e `SEND_MAX_PER_HOUR` no DO e na
  ponte.
- **Destinatários aceitos:** número com DDI ou JID de contato (`@s.whatsapp.net`, `@lid`) ou de grupo (`@g.us`).
  Status (`status@broadcast`), listas de transmissão e newsletters são recusados.
- **Grupos (feito):** `client.SendMessage` do whatsmeow já cifra para grupos (sender key), sem código extra na
  ponte; o risco é o mesmo de um envio para contato, limitado pela confirmação e pelo limite por hora.
- **Citação (feito):** `reply_to` com o id de uma mensagem **da mesma conversa** guardada no `messages.db`. A ponte
  monta um `ExtendedTextMessage` com `ContextInfo` (`StanzaID`, `Participant` e o texto citado). Id desconhecido
  responde `404 quoted_not_found` antes de reservar a cota. A prévia citada leva só o texto (mídia citada aparece
  pela legenda); o WhatsApp do destinatário localiza a original pelo `StanzaID`.
- **Mídia (fora):** exigiria passar o arquivo em base64 no argumento da ferramenta (pesado no contexto e no teto de
  25 s do `TOOL_TIMEOUT_MS`), checar o tipo real do arquivo, e gerar miniatura, dimensões e duração para o
  WhatsApp exibir direito (`client.Upload` cifra, mas não gera nada disso). Mais superfície para mandar o arquivo
  errado e mais sinal de cliente automatizado. Fica para uma tarefa própria, se houver pedido real (ROADMAP F3.5).

## Medição (ponte Go)

Medido em 2026-11-14 com `/proc/<pid>/status` (VmRSS/VmHWM) e num container com os limites da `lite`
(`--memory=256m --cpus=0.0625`). Driver SQLite `modernc.org/sqlite` (Go puro, binário estático, sem CGO) e
`GOMEMLIMIT` de 160 MiB.

| Cenário                                                             | Resultado                                                                                       |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Binário / imagem (`distroless/static:nonroot`)                      | 19,7 MB / 33,5 MB (8,3 MB comprimida)                                                           |
| Ocioso após `/restore` sem snapshot                                 | ~25 MB RSS                                                                                      |
| 50 mil mensagens, 500 conversas (`messages.db` de 26 MB), consultas | 30 MB RSS; pico de 43 MB no `/snapshot`                                                         |
| Mesmo cenário na `lite` (`docker stats`, com cache de página)       | 46 MiB                                                                                          |
| Tempos na `lite`                                                    | `/restore` 1,1 s; `/chats` 4 ms; busca 90 ms (2,7 s varrendo tudo sem achar); `/snapshot` 3,0 s |

O history sync real não pôde ser medido sem uma conta conectada; a estimativa é de 80–150 MB de pico (o whatsmeow
descomprime cada bloco de histórico na memória), ainda abaixo dos 256 MiB. Confirmar em F3.2. A `lite` cabe com
folga; a `basic` (1 GiB, 4× mais memória faturada) não se justifica.

**Licenças:** whatsmeow e `go.mau.fi/util` são MPL-2.0, mas o `go.mau.fi/libsignal` (dependência obrigatória) é
**GPL-3.0**. O código deste repositório continua MIT (compatível); quem **distribuir** a imagem ou o binário
precisa cumprir a GPL-3.0 para o conjunto. Rodar na própria conta não é distribuição. Detalhes em
`connectors/whatsapp/NOTICE.md`.

## Alternativas consideradas

| Alternativa                                                   | Por que não                                                                                                                                                           |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@cloudflare/workers-oauth-provider` (como o Gmail, ADR 0014) | Exige KV com estado (tokens e grants guardados); aqui só o e-mail do dono vai nos tokens e o OAuth sem estado de `src/remote/` (ADR 0009) resolve sem mais um binding |
| Login pelo Google (OIDC)                                      | Exige validar JWT/JWKS e configurar tela de consentimento; GitHub é mais simples para o público do template                                                           |
| D1 como banco da ponte                                        | O whatsmeow escreve muito e em transações pequenas via `database/sql`; D1 só é acessível pelo Worker (HTTP por query), latência alta e sem driver                     |
| SQLite do Durable Object                                      | Mesmo problema: só o DO acessa; cada query da ponte viraria uma chamada ao DO                                                                                         |
| Snapshot nativo de container (beta)                           | Beta, cifrado com chave da Cloudflare e não nossa, exige a política `durable_object` de agendamento; não sai da plataforma                                            |
| Cifrar o snapshot no Worker                                   | O Worker teria de carregar o arquivo inteiro na memória (128 MB) e conhecer a chave; streaming GCM não existe no WebCrypto                                            |
| Container sempre ligado / alarmes de keep-alive               | Contra a regra de custo; ~720 h/mês de `lite` passa a franquia                                                                                                        |
| Cron por padrão                                               | Acorda o container sem uso; fica opt-in (`SYNC_CRON`)                                                                                                                 |
| WhatsApp Business Cloud API                                   | Não serve para conta pessoal                                                                                                                                          |

## Consequências

- Positivas: leitura do WhatsApp em qualquer Claude; custo do uso típico dentro da franquia do Workers Paid (README);
  o Worker nunca vê o backup em claro; quem usa o template não depende de ninguém.
- Negativas / custos aceitos: risco de bloqueio da conta (cliente não oficial, aviso no README); cold start de
  alguns segundos na primeira chamada após dormir; queda abrupta sem `SIGTERM` perde o que mudou desde o último
  snapshot (o WhatsApp reenvia pendências); a saída de rede do container ainda não é restrita aos hosts do WhatsApp
  (F3.3); trocar `SNAPSHOT_KEY` exige parear de novo; módulo Go à parte com seu próprio ciclo de testes
  (`npm run bridge:test` no `pr:check`).
- O que muda nos docs: ARCHITECTURE (conector só remoto, serviços), STRUCTURE (pastas do WhatsApp), PROCESSES
  (P13–P17), UI (página `/pair`), WORKFLOW e CLAUDE.md (`whatsapp:deploy`, `bridge:test`), ROADMAP (Fase 3),
  PRODUCT (Q4, Q8, Q9), GLOSSARY, `.env.example`, README e NOTICE do conector.
