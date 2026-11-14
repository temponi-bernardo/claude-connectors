# API interna da ponte WhatsApp (contrato Worker ↔ container)

A ponte (`bridge/`, Go + whatsmeow) escuta em `:8080` **só dentro do container**. Quem fala com ela é o
Durable Object `WhatsAppBridge` do Worker (`src/container.ts`); ela nunca fica exposta na internet.

## Autenticação

Toda rota, menos `GET /health`, exige `Authorization: Bearer <BRIDGE_TOKEN>` (comparação em tempo constante).
Sem o header ou com token errado: `401 {"error":"unauthorized"}`.

## Ambiente do container

| Variável            | Obrigatória | Padrão              | Para quê                                                                     |
| ------------------- | ----------- | ------------------- | ---------------------------------------------------------------------------- |
| `BRIDGE_TOKEN`      | sim         | —                   | Token compartilhado com o Worker (≥ 32 caracteres)                           |
| `SNAPSHOT_KEY`      | sim         | —                   | 32 bytes em base64: chave AES-256 dos snapshots                              |
| `DATA_DIR`          | não         | `/data`             | Onde ficam `session.db` e `messages.db`                                      |
| `PORT`              | não         | `8080`              | Porta HTTP                                                                   |
| `TIMEZONE`          | não         | `America/Sao_Paulo` | Fuso das datas ISO devolvidas (IANA; `time/tzdata` embutido)                 |
| `HISTORY_DAYS`      | não         | `90`                | Mensagens mais antigas que isso não são guardadas (sync de histórico)        |
| `MAX_MEDIA_BYTES`   | não         | `5242880`           | Limite de `GET /media`                                                       |
| `ENABLE_SEND`       | não         | `false`             | Liga `POST /send` (o `wrangler.toml` do Worker repassa `true`)               |
| `SEND_ALLOWLIST`    | não         | vazio               | Números ou JIDs separados por vírgula; vazia = qualquer destinatário         |
| `SEND_MAX_PER_HOUR` | não         | `10`                | Limite rígido de envios por hora (persistido no banco)                       |
| `SNAPSHOT_PUSH_URL` | não         | vazio               | Para onde enviar o snapshot no `SIGTERM` e quando a sessão muda (ver abaixo) |

Logs nunca contêm texto de mensagem, número de telefone completo nem chaves.

## Fases

`awaiting_restore` → (`POST /restore`) → `starting` → `ready`. Enquanto não estiver `ready`, as rotas de dados
respondem `503 {"error":"not_ready","phase":"..."}` (inclusive `/status` e `/snapshot`; só `/health` e `/restore`
fogem disso). `ready` significa banco aberto e cliente whatsmeow criado (conectado ou não; a conexão é assíncrona).
Se a abertura dos bancos falhar depois de um `/restore` aceito, a ponte volta para `awaiting_restore` (e o erro vai
para o log).

## Rotas

Respostas JSON com `content-type: application/json`. Datas sempre RFC 3339 com fuso (`2026-11-14T09:30:00-03:00`).
Erro: `{"error":"<código>","message":"<texto em português>"}`. Códigos gerais: `400 bad_request` (parâmetro ou
corpo inválido), `500 internal`, `503 not_connected` (precisa do WhatsApp conectado e ele não está).

Textos devolvidos (mensagens, nomes, nomes de arquivo) vêm sem caracteres de controle (menos `\n` e `\t`) e sem
overrides bidi (U+202A–U+202E, U+2066–U+2069). Buscas (`query`) ignoram maiúsculas e acentos (`joao` acha `João`).
`sender_name` é `"Você"` nas mensagens enviadas pela própria conta; sem nome conhecido, vale o telefone
(`+5531...`).

### `GET /health` (sem auth)

`200 {"phase":"awaiting_restore"|"starting"|"ready"}`.

### `POST /restore`

- Só na fase `awaiting_restore` (senão `409 {"error":"already_restored"}`).
- Header `X-Snapshot: none` e corpo vazio → começa do zero (`400` se vier corpo). Senão o corpo é um snapshot
  (formato abaixo), lido em streaming, com teto de 1 GiB.
- Snapshot inválido (MAC, versão, truncado) → `422 {"error":"bad_snapshot"}` e a ponte **continua** em
  `awaiting_restore` (o Worker decide começar do zero ou não).
- Sucesso: `200 {"restored":true|false,"generation":<n>}`; abre os bancos e conecta ao WhatsApp em segundo plano.

### `GET /snapshot`

Gera um snapshot consistente (`VACUUM INTO` dos dois bancos → tar → cifra). Se o SHA-256 do tar em claro for igual
ao do último snapshot entregue ou restaurado: `204`. Senão `200` com `content-type: application/octet-stream`,
`content-length` e `x-snapshot-generation: <n>` (n cresce 1 a cada snapshot novo).

`GET /snapshot?force=1` ignora a comparação e sempre devolve `200` (útil se o Worker recebeu um snapshot mas não
conseguiu gravá-lo no R2: sem isso, os próximos dariam `204`). Para o hash ser estável, a ponte normaliza nos bancos
copiados os campos do cabeçalho SQLite que mudam sem mudar o conteúdo (formato WAL/legado, contador de mudanças e
schema cookie).

### `GET /status`

```json
{
  "phase": "ready",
  "connected": true,
  "logged_in": true,
  "needs_pairing": false,
  "account": "+55 31 9****-**12",
  "offline_sync_complete": true,
  "last_event_at": "2026-11-14T09:30:00-03:00",
  "chats": 120,
  "messages": 5321,
  "send_enabled": false
}
```

`needs_pairing` = sem sessão (nunca pareado ou deslogado pelo celular). `last_event_at` pode ser `null`; `account`
é `null` sem sessão.

### `POST /sync/wait?timeout_ms=<n>`

Espera até `connected && offline_sync_complete`, ou `needs_pairing`, ou o tempo (padrão 10000, máximo 20000; valores
maiores são reduzidos a 20000). Devolve o mesmo corpo do `/status` mais `"partial": true` se o tempo acabou antes
(sem o campo quando terminou).

### `GET /chats?query=&limit=&cursor=`

`limit` 1–100 (padrão 20). `query` filtra por nome ou número (LIKE com escape, sem diferenciar maiúsculas).
Ordem: última mensagem mais recente primeiro. `cursor` é opaco (devolvido em `next_cursor`, `null` no fim).

```json
{
  "chats": [
    {
      "jid": "5531999999999@s.whatsapp.net",
      "name": "Maria",
      "is_group": false,
      "last_message_at": "2026-11-14T09:30:00-03:00",
      "last_message": { "from_me": false, "sender_name": "Maria", "text": "Oi", "type": "text" }
    }
  ],
  "next_cursor": "..."
}
```

### `GET /messages?chat_jid=&limit=&before=`

`limit` 1–100 (padrão 30). Mais recentes primeiro. `before` é o `next_before` opaco da página anterior.
`404 {"error":"chat_not_found"}` se o JID não existe no banco.

```json
{
  "chat": { "jid": "...", "name": "...", "is_group": false },
  "messages": [
    {
      "id": "3EB0ABC...",
      "chat_jid": "...",
      "sender_jid": "...",
      "sender_name": "Maria",
      "from_me": false,
      "timestamp": "2026-11-14T09:30:00-03:00",
      "type": "text|image|audio|video|document|sticker|location|contact|other",
      "text": "Oi",
      "media": { "mime": "image/jpeg", "size": 12345, "filename": null }
    }
  ],
  "next_before": "..."
}
```

`text` é a legenda em mídias e pode ser `""`. `media` só existe em mensagens de mídia.

### `GET /search?query=&chat_jid=&limit=`

`query` obrigatório (1–200 caracteres; `400` senão). `limit` 1–100 (padrão 20). Busca no texto (LIKE com escape).
Devolve `{"messages":[...]}` no formato acima com `chat_name` em cada item.

### `GET /contacts?query=&limit=`

`query` obrigatório (1–200 caracteres). `limit` 1–100 (padrão 20). Busca em nome salvo, push name e número (o
número só entra com 3 dígitos ou mais). Grupos ficam de fora.
`{"contacts":[{"jid":"...","name":"...","push_name":"...","phone":"+5531999999999"}]}`. Campos sem valor vêm `null`
(`phone` é `null` para contatos só com LID).

### `GET /media?message_id=&chat_jid=`

Baixa a mídia pelo whatsmeow. `404 {"error":"not_found"}` se a mensagem não existe ou não tem mídia;
`413 {"error":"too_large"}` se o tamanho declarado (ou o baixado) passar de `MAX_MEDIA_BYTES`;
`410 {"error":"media_expired"}` se o WhatsApp não tiver mais o arquivo; `502 {"error":"download_failed"}` em outras
falhas. Sucesso: bytes com `content-type` da mídia (`application/octet-stream` se o tipo guardado for inválido),
`content-length` e `x-media-filename` quando houver — **percent-encoded em UTF-8** (use `decodeURIComponent`).

### `POST /pair/code` — corpo `{"phone":"5531999999999"}`

Só dígitos, 8–15. Exige `needs_pairing`. Devolve `{"code":"ABCD-EFGH"}` (whatsmeow `PairPhone`; pode levar alguns
segundos, porque espera o websocket de pareamento abrir). `409 {"error":"already_paired"}` se já houver sessão;
`503 not_connected` se o websocket não abrir em 15 s; `502 {"error":"pair_failed"}` se o WhatsApp recusar.

### `GET /pair/qr`

`{"qr":"<texto do QR>","png_base64":"<PNG 256×256 do QR em base64>","expires_at":"..."}` com o QR atual, ou
`409 {"error":"already_paired"}` se já pareado, `503 {"error":"qr_not_ready"}` se ainda não chegou (ou expirou: nesse
caso a ponte reabre o pareamento e um novo QR chega em alguns segundos).

### `POST /logout`

Desloga do WhatsApp e apaga a sessão local (se o servidor não responder, apaga só a local). `{"logged_out":true}`;
`502 {"error":"logout_failed"}` se nem a sessão local puder ser apagada. As mensagens já guardadas ficam.

### `POST /send` — corpo `{"recipient":"5531999999999","text":"...","reply_to":"<id opcional>"}`

- `ENABLE_SEND=false` → `403 {"error":"send_disabled"}`.
- `recipient` aceita número (só dígitos, com DDI, `+` opcional) ou JID de contato (`@s.whatsapp.net`, `@lid`) ou de
  grupo (`@g.us`); qualquer outro (ex.: `status@broadcast`) → `400`.
- `SEND_ALLOWLIST` vazia libera qualquer contato ou grupo; com itens, destinatário fora dela →
  `403 {"error":"recipient_not_allowed"}`.
- Texto vazio (só espaços) ou acima de 4096 caracteres → `400`.
- `reply_to` (opcional, até 200 caracteres): id de uma mensagem **da mesma conversa** já guardada no banco; a resposta
  sai citando essa mensagem. Id desconhecido → `404 {"error":"quoted_not_found"}`, sem gastar a cota de envios.
- Mais de `SEND_MAX_PER_HOUR` tentativas na última hora → `429 {"error":"rate_limited","retry_after_seconds":n}` (e
  header `Retry-After`). A tentativa conta mesmo se o WhatsApp recusar depois.
- WhatsApp desconectado → `503 not_connected`; recusa do WhatsApp → `502 {"error":"send_failed"}`.
- Sucesso: `{"id":"...","timestamp":"..."}`; a mensagem enviada também é gravada no banco.

## Formato do snapshot (`WAS1`)

Cabeçalho (63 bytes, usado como dado associado de todos os blocos):

| Campo         | Bytes | Valor                                                                    |
| ------------- | ----- | ------------------------------------------------------------------------ |
| magic         | 4     | `WAS1`                                                                   |
| versão        | 1     | `1`                                                                      |
| generation    | 8     | uint64 big-endian                                                        |
| tamanho bloco | 4     | uint32 big-endian (65536)                                                |
| salt          | 32    | aleatório; subchave = HKDF-SHA256(chave, salt, `"whatsapp-snapshot-v1"`) |
| reservado     | 14    | zeros                                                                    |

Depois, blocos `AES-256-GCM` de até `tamanho bloco` bytes em claro, cada um com nonce de 12 bytes =
contador uint64 big-endian em 11 bytes (os 3 primeiros zero) + 1 byte de flag (`1` no último bloco, `0` nos
outros). O último bloco pode ser vazio. Truncar, reordenar ou alterar qualquer byte faz a abertura falhar.
O conteúdo em claro é um tar com `session.db` e `messages.db`.

## `SIGTERM`

Para de aceitar requisições, desconecta o whatsmeow e, se `SNAPSHOT_PUSH_URL` estiver definida e houver mudança
desde o último snapshot, faz `PUT` do snapshot nela (header `Authorization: Bearer <BRIDGE_TOKEN>`,
`x-snapshot-generation`), com limite de 10 s. Falha só vai para o log.

## Mudança de sessão

O mesmo `PUT` acontece, em segundo plano, quando a sessão do aparelho muda: pareamento concluído
(`PairSuccess`), conexão aberta (`Connected`) e logout pelo celular (`LoggedOut`). Sem mudança desde o último
snapshot, nada é enviado; antes de `ready`, o aviso é ignorado. Assim um pareamento novo chega ao R2 na hora e
sobrevive a deploys e reinícios do container.
