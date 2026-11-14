# 0012 — WhatsApp pessoal no Cloudflare Workers + Containers, sob demanda

- **Estado:** Aceito
- **Data:** 2026-11-14
- **Relacionado:** F3.1, ADR 0009, ADR 0010

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
   obrigatório e limite por hora no armazenamento do DO e de novo na ponte.
8. **Prompt injection:** todo resultado com conteúdo de terceiros vem sob `notice` de dado não confiável, com textos
   limpos (controle e bidi removidos, corte em 2.000 caracteres) e instruções do servidor MCP repetindo a regra.
9. **Instância `lite`** (1/16 vCPU, 256 MiB, 2 GB). Medição abaixo.

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

| Alternativa                                     | Por que não                                                                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@cloudflare/workers-oauth-provider`            | Exige KV com estado (tokens e grants guardados); o repo já tem OAuth sem estado testado (ADR 0009). Menos alvo para vazar                         |
| Login pelo Google (OIDC)                        | Exige validar JWT/JWKS e configurar tela de consentimento; GitHub é mais simples para o público do template                                       |
| D1 como banco da ponte                          | O whatsmeow escreve muito e em transações pequenas via `database/sql`; D1 só é acessível pelo Worker (HTTP por query), latência alta e sem driver |
| SQLite do Durable Object                        | Mesmo problema: só o DO acessa; cada query da ponte viraria uma chamada ao DO                                                                     |
| Snapshot nativo de container (beta)             | Beta, cifrado com chave da Cloudflare e não nossa, exige a política `durable_object` de agendamento; não sai da plataforma                        |
| Cifrar o snapshot no Worker                     | O Worker teria de carregar o arquivo inteiro na memória (128 MB) e conhecer a chave; streaming GCM não existe no WebCrypto                        |
| Container sempre ligado / alarmes de keep-alive | Contra a regra de custo; ~720 h/mês de `lite` passa a franquia                                                                                    |
| Cron por padrão                                 | Acorda o container sem uso; fica opt-in (`SYNC_CRON`)                                                                                             |
| WhatsApp Business Cloud API                     | Não serve para conta pessoal                                                                                                                      |

## Consequências

- Positivas: leitura do WhatsApp em qualquer Claude; custo do uso típico dentro da franquia do Workers Paid (README);
  o Worker nunca vê o backup em claro; quem usa o template não depende de ninguém.
- Negativas / custos aceitos: risco de bloqueio da conta (cliente não oficial, aviso no README); cold start de
  alguns segundos na primeira chamada após dormir; queda abrupta sem `SIGTERM` perde o que mudou desde o último
  snapshot (o WhatsApp reenvia pendências); a saída de rede do container ainda não é restrita aos hosts do WhatsApp
  (F3.3); trocar `SNAPSHOT_KEY` exige parear de novo; módulo Go à parte com seu próprio ciclo de testes
  (`npm run bridge:test` no `pr:check`).
- O que muda nos docs: ARCHITECTURE (conector só remoto, serviços), STRUCTURE (pastas do WhatsApp), PROCESSES
  (P10–P14), UI (página `/pair`), WORKFLOW e CLAUDE.md (`whatsapp:deploy`, `bridge:test`), ROADMAP (Fase 3),
  PRODUCT (Q4, Q8, Q9), GLOSSARY, `.env.example`, README e NOTICE do conector.
