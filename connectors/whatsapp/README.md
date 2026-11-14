# WhatsApp pessoal no Claude (`whatsapp`)

Conector MCP **remoto** que deixa o Claude (claude.ai, app, Cowork e Claude Code) ler o seu WhatsApp **pessoal**
(não Business): conversas, mensagens, busca, contatos e mídias, e **enviar** texto para qualquer contato ou grupo —
uma mensagem por vez, sempre com a sua confirmação explícita e com limite por hora.

É um **template self-host**: cada pessoa publica na **própria conta Cloudflare** e pareia o **próprio número**.
Não existe servidor central nem serviço hospedado por terceiros. Decisões em
[ADR 0015](../../docs/adr/0015-whatsapp-on-cloudflare-containers.md).

> ⚠️ O WhatsApp não tem API oficial para contas pessoais. Este conector usa o
> [whatsmeow](https://github.com/tulir/whatsmeow), que se conecta como um "aparelho conectado" (como o WhatsApp
> Web). Isso não é autorizado pela Meta e pode, em tese, levar a bloqueio da conta. Use por sua conta e risco, só
> na sua própria conta, e evite envios automáticos.

## Como funciona

```text
Claude ──OAuth 2.1 + MCP (HTTPS)──▶ Worker ──▶ Durable Object "owner" ──▶ Container (Go + whatsmeow)
                                       │              │  restore/snapshot        │  SQLite local
                                       │              └──────────▶ R2 (backup cifrado AES-256-GCM)
                                       └─ /pair (login GitHub do dono)          └─ WebSocket do WhatsApp
```

- **Sob demanda:** o container só sobe quando chega uma chamada de ferramenta (ou você abre `/pair`) e dorme
  depois de `SLEEP_AFTER` (padrão **5 min**) sem uso. Sem keep-alive, polling, alarme próprio nem Cron Trigger.
- **Persistência:** o disco do container some ao dormir. A sessão do WhatsApp e o banco de mensagens viram um
  snapshot cifrado no R2 (no máximo um por minuto de uso, na hora em que a sessão muda — pareou, conectou ou
  saiu —, e sempre antes de dormir ou ser encerrado) e são restaurados no boot. Assim o pareamento sobrevive a
  deploys e reinícios.
- **Sessão única:** um só Durable Object (nome fixo `owner`) e `max_instances = 1`: duas pontes nunca rodam o
  mesmo número ao mesmo tempo. Snapshots com geração menor que a gravada são descartados.
- **Prazos:** toda ferramenta tem teto total (`TOOL_TIMEOUT_MS`, 25 s). Antes de ler, espera até `SYNC_WAIT_MS`
  (8 s) pelas pendências; se não der, responde com o que já tem e um aviso de resultado parcial.

## Ferramentas

| Ferramenta        | Faz                                                                               |
| ----------------- | --------------------------------------------------------------------------------- |
| `whatsapp_status` | Conexão, último evento, sync completo ou não, se precisa parear                   |
| `list_chats`      | Conversas (mais recentes primeiro) com prévia da última mensagem; filtro e página |
| `get_messages`    | Mensagens de uma conversa, paginadas com `before`                                 |
| `search_messages` | Busca no texto das mensagens guardadas, opcionalmente numa conversa               |
| `search_contacts` | Contatos por nome ou número                                                       |
| `get_media`       | Imagem, áudio ou documento de uma mensagem (até `MAX_MEDIA_BYTES`, 5 MB)          |
| `send_message`    | Uma mensagem de texto para um contato ou grupo, opcionalmente citando outra       |

Datas em ISO 8601 com fuso (`TIMEZONE`, padrão `America/Sao_Paulo`). Respostas compactas e com o aviso de que o
conteúdo das mensagens é dado de terceiros não confiável.

## Configuração guiada

Com o plugin instalado, digite **`/setup-whatsapp`** no chat. O Claude confere se o seu servidor responde,
guia a publicação (se faltar), conecta o Claude ao seu `/mcp`, conduz o pareamento em `/pair` e faz um teste.

Comandos de uso, depois de configurado:

- **`/whatsapp-summary`** — o que aconteceu nas conversas e grupos no período.
- **`/whatsapp-pending`** — conversas esperando resposta da pessoa.
- **`/search-whatsapp`** — endereço, PIX, link, documento ou mídia nas mensagens.

## Publicar (uma vez)

**Deploy na nuvem (recomendado, é como está publicado):** o Workers Builds da Cloudflare monta a imagem e
publica, sem Docker na sua máquina. No painel: Workers & Pages → Create → **Continue with GitHub** → este
repositório, com nome `whatsapp-remote`, deploy command
`npx wrangler deploy --config connectors/whatsapp/wrangler.toml`, root `/`, preview builds desligados. Em
Settings → Builds, deixe a produção na `main` e os _build watch paths_ `connectors/whatsapp/*`, `src/remote/*`,
`src/mcp/*`, `src/core/*` e `package-lock.json`: só merges que tocam o WhatsApp publicam (e reiniciam o
container). Os passos 3, 5 e 6 abaixo continuam valendo (bucket, OAuth App e secrets via `wrangler secret put`).

**Deploy local (alternativa):**

Pré-requisitos: conta Cloudflare com **Workers Paid** (US$ 5/mês, inclui Containers), Node 22+, Docker rodando
(o `wrangler` constrói a imagem da ponte) e uma conta no GitHub.

1. **Clone** (ou faça fork) e instale: `git clone https://github.com/temponi-bernardo/claude-connectors && cd claude-connectors && npm ci`.
2. **Autentique o wrangler:** `npx wrangler login` (ou `CLOUDFLARE_API_TOKEN` com permissão de Workers, Containers e R2).
3. **Bucket R2** para os backups: `npx wrangler r2 bucket create whatsapp-snapshots`.
4. **Primeiro deploy** (para saber o endereço): `npm run whatsapp:deploy`. Anote a URL
   `https://whatsapp-remote.<sua-conta>.workers.dev`. Até os secrets existirem, ele responde 500 explicando o que
   falta.
5. **OAuth App do GitHub** (login do dono): GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
   - Homepage URL: `https://whatsapp-remote.<sua-conta>.workers.dev`
   - Redirect URIs (as duas, sem wildcard): `https://whatsapp-remote.<sua-conta>.workers.dev/oauth/callback` (login
     do Claude) e `https://whatsapp-remote.<sua-conta>.workers.dev/oauth/callback/pair` (página `/pair`)
   - Gere um _client secret_.
6. **Secrets** (cada comando pede o valor; `--config connectors/whatsapp/wrangler.toml` em todos):

   ```sh
   C="--config connectors/whatsapp/wrangler.toml"
   node -e "console.log(crypto.randomBytes(32).toString('base64'))" | npx wrangler secret put SEAL_KEY $C
   node -e "console.log(crypto.randomBytes(32).toString('base64'))" | npx wrangler secret put SNAPSHOT_KEY $C
   node -e "console.log(crypto.randomBytes(32).toString('hex'))"    | npx wrangler secret put BRIDGE_TOKEN $C
   npx wrangler secret put GITHUB_CLIENT_ID $C
   npx wrangler secret put GITHUB_CLIENT_SECRET $C
   npx wrangler secret put ALLOWED_EMAILS $C   # seu e-mail verificado no GitHub (vírgula para mais de um)
   ```

   Guarde a `SNAPSHOT_KEY` num gerenciador de senhas: sem ela o backup não abre (e trocá-la obriga a parear de novo).

7. **Deploy de novo:** `npm run whatsapp:deploy`.

## Parear o número

1. Abra `https://whatsapp-remote.<sua-conta>.workers.dev/pair` e entre com o GitHub (só e-mails de
   `ALLOWED_EMAILS` passam). O primeiro acesso acorda o container (alguns segundos).
2. Digite seu número com DDI (ex.: `5531999999999`) e clique em **Gerar código de pareamento**.
3. No celular: WhatsApp → **Aparelhos conectados** → **Conectar aparelho** → **Conectar com número de telefone**
   e digite o código. Alternativa: **Mostrar QR** e ler o QR.
4. A página atualiza sozinha; quando mostrar "Conectado", o histórico recente começa a chegar (até
   `HISTORY_DAYS`, 90 dias).

Na mesma página: **Desvincular este aparelho** (logout) e **Recomeçar do zero** (arquiva o backup no R2 e pede
pareamento de novo; use se trocar a `SNAPSHOT_KEY` ou o backup corromper).

## Conectar ao Claude

- **claude.ai / app / Cowork:** Configurações → Conectores → **Adicionar conector personalizado** →
  `https://whatsapp-remote.<sua-conta>.workers.dev/mcp`. O Claude abre o login do GitHub; só o dono entra.
  Vale para todos os lugares: o conector da sua conta aparece no claude.ai, no app, no celular, no Cowork e no
  Claude Code (logado na mesma conta).
- **Claude Code sem conta claude.ai:**
  `claude mcp add --transport http whatsapp https://whatsapp-remote.<sua-conta>.workers.dev/mcp`.
- **Plugin do marketplace** (opcional): traz só as skills (`/setup-whatsapp`, `/whatsapp-summary` etc.), **sem**
  servidor embutido, porque cada pessoa tem o próprio. Instale e rode `/setup-whatsapp`, que conecta o seu.

  ```text
  /plugin install whatsapp --marketplace temponi-bernardo/claude-connectors
  ```

  Por que o plugin não pede a URL: um campo `${user_config.*}` no `.mcp.json` só existe no computador onde foi
  preenchido; o plugin instalado pela organização no claude.ai fica com outra URL e o botão **Vincular** recusa o
  login antes de abrir o GitHub. O `npm run build` recusa esse formato (ADR 0018).

O acesso dura enquanto o Claude renova o token (refresh de 30 dias). Tirar seu e-mail de `ALLOWED_EMAILS`
revoga na hora (o `/mcp` passa a responder 403).

## Configuração (`[vars]` do `wrangler.toml`)

| Variável            | Padrão              | Para quê                                                               |
| ------------------- | ------------------- | ---------------------------------------------------------------------- |
| `SLEEP_AFTER`       | `5m`                | Sem uso por esse tempo, guarda o backup e desliga o container (30s–1h) |
| `TOOL_TIMEOUT_MS`   | `25000`             | Teto de cada ferramenta, de ponta a ponta                              |
| `SYNC_WAIT_MS`      | `8000`              | Quanto esperar pendências antes de responder parcial                   |
| `TIMEZONE`          | `America/Sao_Paulo` | Fuso das datas                                                         |
| `HISTORY_DAYS`      | `90`                | Histórico guardado no sync inicial                                     |
| `MAX_MEDIA_BYTES`   | `5242880`           | Limite do `get_media`                                                  |
| `ENABLE_SEND`       | `true`              | Liga `send_message` (`"false"` desliga de vez)                         |
| `SEND_ALLOWLIST`    | vazio               | Opcional: restringe o envio a números ou JIDs; vazia = qualquer um     |
| `SEND_MAX_PER_HOUR` | `10`                | Limite rígido de envios por hora (Worker e ponte)                      |
| `SYNC_CRON`         | vazio               | Sync periódico opcional (ver abaixo)                                   |
| `PUBLIC_URL`        | —                   | Domínio próprio; sem ela vale o `*.workers.dev`                        |

### Envio

Ligado por padrão no `wrangler.toml` (`ENABLE_SEND = "true"`), para **qualquer contato ou grupo**. Proteções:

- **Confirmação a cada mensagem:** a ferramenta exige `confirmed_by_user: true` e manda o modelo mostrar
  destinatário, texto e mensagem citada e pedir a sua confirmação daquela mensagem exata antes de cada envio.
- **Limite por hora** (`SEND_MAX_PER_HOUR`, 10): guardado no Durable Object e na ponte; tentativa que falhou também
  conta.
- **Uma mensagem de texto por chamada**, sem envio em massa. Destinatário só como número (DDI + número) ou JID de
  contato (`@s.whatsapp.net`, `@lid`) ou de grupo (`@g.us`, de `list_chats`); status e listas de transmissão
  são recusados.
- **Allowlist opcional:** com `SEND_ALLOWLIST = "5531999999999,120363000000000001@g.us"`, só esses destinatários
  (conferido no Worker e na ponte). Vazia, vale qualquer um.

**Responder citando** (`reply_to_message_id`): o id de uma mensagem da **mesma conversa**, como `get_messages`
devolve. A ponte busca a mensagem no banco local e a resposta sai citada; id desconhecido é recusado sem gastar o
limite.

**Fora, por ora:** envio de mídia (imagem, áudio, documento). Exigiria passar o arquivo em base64 dentro da
chamada da ferramenta (pesa no contexto e no teto de 25 s), validar o tipo real do arquivo e gerar miniatura e
dimensões para o WhatsApp exibir direito — mais risco de mandar o arquivo errado e de bloqueio. Detalhes na ADR 0015.

### Sync periódico (opcional, desligado)

Sem ele, mensagens que chegam com o container dormindo ficam na fila do WhatsApp e entram na próxima vez que você
usar o conector. Se você passa semanas sem usar, a fila pode expirar e o histórico desse período não chega. Para
evitar, ligue um cron: ponha **a mesma expressão** em `SYNC_CRON` e em `[triggers] crons`, por exemplo
`"17 */6 * * *"` (a cada 6 h). Cada disparo acorda a ponte, espera até 20 s o sync, guarda o backup e deixa o
container dormir após `SLEEP_AFTER`. Custo: 4 disparos/dia × ~6 min ≈ 12 h/mês de container `lite` ≈ 3 GiB-h de
memória e 24 GB-h de disco, dentro da franquia (ver abaixo).

## Custo estimado

Franquia do Workers Paid (US$ 5/mês) para Containers: **25 GiB-h de memória, 375 vCPU-min, 200 GB-h de disco**;
acima disso, US$ 0,0000025/GiB-s, US$ 0,000020/vCPU-s e US$ 0,00000007/GB-s. Memória e disco contam pelo
provisionado enquanto o container está ligado; CPU só pelo uso real. A instância `lite` tem 256 MiB, 2 GB e
1/16 vCPU.

**Uso típico: 20 sessões/dia de 5–10 min.** Cada sessão deixa o container ligado durante o uso + 5 min de
`SLEEP_AFTER`, ou seja, 10–15 min.

| Item                       | 10 min/sessão (100 h/mês)                                                                        | 15 min/sessão (150 h/mês)               |
| -------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------- |
| Memória (0,25 GiB)         | 25 GiB-h → dentro da franquia                                                                    | 37,5 GiB-h → 12,5 excedentes ≈ US$ 0,11 |
| Disco (2 GB)               | 200 GB-h → dentro da franquia                                                                    | 300 GB-h → 100 excedentes ≈ US$ 0,03    |
| CPU (uso médio ~20%)       | ~75 vCPU-min → dentro                                                                            | ~113 vCPU-min → dentro                  |
| Durable Object, Worker, R2 | dentro das franquias (DO: ~45–70 mil GB-s de 400 mil; R2: < 1 GB e poucos milhares de operações) | idem                                    |
| **Total além dos US$ 5**   | **≈ US$ 0,00**                                                                                   | **≈ US$ 0,14/mês**                      |

Saída de rede do container: 1 TB/mês incluído na América do Norte e Europa (500 GB no resto); o WhatsApp usa
poucos MB por sessão. Para limitar gastos, use o _spending limit_ do Workers e baixe `SLEEP_AFTER` (ex.: `2m`).

## Segurança

- **Prompt injection:** mensagens, nomes e legendas são dados de terceiros. Toda resposta vem com
  `notice` dizendo para não seguir instruções contidas nelas; textos passam por limpeza (caracteres de controle e
  de direção bidi removidos, corte em 2.000 caracteres) e as instruções do servidor MCP repetem a regra.
- **Acesso:** OAuth 2.1 com PKCE e registro dinâmico (retorno só para `claude.ai`, `claude.com` e `localhost`), login
  pelo GitHub com e-mail **verificado** em `ALLOWED_EMAILS`; o token do GitHub é descartado na hora. Os tokens do
  conector são selados com AES-256-GCM (`SEAL_KEY`) e o servidor não guarda nada de sessão.
- **`/pair`:** sessão em cookie `__Host-` selado (HttpOnly, Secure, SameSite=Lax, 30 min), state + nonce no login,
  token anti-CSRF e checagem de `Origin` em todo POST, CSP sem script e sem frames.
- **Ponte:** porta só dentro do container, `BRIDGE_TOKEN` comparado em tempo constante, SQL parametrizado, limites
  de corpo e de tempo, logs sem texto de mensagem nem número completo.
- **Backup:** cifrado na ponte com AES-256-GCM em blocos (HKDF por snapshot, cabeçalho autenticado): truncar,
  reordenar ou alterar qualquer byte faz a restauração falhar. A chave nunca vai para o R2.
- **Limitações:** quem controla sua conta Cloudflare controla o conector (secrets e container). O backup antigo
  arquivado no "Recomeçar do zero" continua no R2 até você apagar.

## Desenvolvimento

- Worker (TypeScript): `connectors/whatsapp/src/`, testes com `npm test`; `npm run whatsapp:build` gera o bundle sem
  publicar; `npm run whatsapp:dev` roda local (precisa de Docker).
- Ponte (Go 1.26+): `connectors/whatsapp/bridge/`, contrato em [`bridge/API.md`](bridge/API.md); `npm run bridge:test`
  roda gofmt, vet e testes.
- Licenças de terceiros em [NOTICE.md](NOTICE.md). Atenção: a imagem inclui o `go.mau.fi/libsignal` (GPL-3.0);
  se você **distribuir** a imagem ou o binário (não só rodar na sua conta), cumpra a GPL-3.0 para o conjunto.

## Problemas comuns

| Sintoma                                     | O que fazer                                                                                    |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 500 "Configuração do Worker inválida"       | Falta um secret: a mensagem diz qual                                                           |
| "WhatsApp is not paired"                    | Abra `/pair` e pareie                                                                          |
| Pareamento some depois de deploy/reinício   | Confira no R2 o objeto `whatsapp/snapshot.was1`; sem ele, veja nos logs "Snapshot falhou"      |
| "Tempo esgotado esperando o WhatsApp"       | Container acordando (primeira chamada após dormir): repita em alguns segundos                  |
| "Não consegui abrir o backup criptografado" | `SNAPSHOT_KEY` mudou ou backup corrompido: volte a chave antiga ou use "Recomeçar do zero"     |
| Login do GitHub recusado                    | O e-mail precisa estar verificado no GitHub e em `ALLOWED_EMAILS`                              |
| Callback do GitHub dá erro de redirect      | O OAuth App precisa das duas URIs exatas: `<url>/oauth/callback` e `<url>/oauth/callback/pair` |
