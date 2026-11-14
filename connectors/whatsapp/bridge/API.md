# WhatsApp bridge internal API (Worker ↔ container contract)

The bridge (`bridge/`, Go + whatsmeow) listens on `:8080` **only inside the container**. The only caller is the
Worker's `WhatsAppBridge` Durable Object (`src/container.ts`); it is never exposed to the internet.

## Authentication

Every route except `GET /health` requires `Authorization: Bearer <BRIDGE_TOKEN>` (constant-time comparison).
Without the header or with a wrong token: `401 {"error":"unauthorized"}`.

## Container environment

| Variable            | Required | Default             | Purpose                                                                      |
| ------------------- | -------- | ------------------- | ---------------------------------------------------------------------------- |
| `BRIDGE_TOKEN`      | yes      | —                   | Token shared with the Worker (≥ 32 characters)                               |
| `SNAPSHOT_KEY`      | yes      | —                   | 32 bytes in base64: AES-256 key for the snapshots                            |
| `DATA_DIR`          | no       | `/data`             | Where `session.db` and `messages.db` live                                    |
| `PORT`              | no       | `8080`              | HTTP port                                                                    |
| `TIMEZONE`          | no       | `America/Sao_Paulo` | Time zone of the returned ISO dates (IANA; `time/tzdata` embedded)           |
| `HISTORY_DAYS`      | no       | `90`                | Messages older than this are not stored (history sync)                       |
| `MAX_MEDIA_BYTES`   | no       | `5242880`           | `GET /media` limit                                                           |
| `ENABLE_SEND`       | no       | `false`             | Enables `POST /send` (the Worker's `wrangler.toml` passes `true`)            |
| `SEND_ALLOWLIST`    | no       | empty               | Comma-separated numbers or JIDs; empty = any recipient                       |
| `SEND_MAX_PER_HOUR` | no       | `10`                | Hard limit of sends per hour (persisted in the database)                     |
| `SNAPSHOT_PUSH_URL` | no       | empty               | Where to send the snapshot on `SIGTERM` and when the session changes (below) |

Logs never contain message text, full phone numbers or keys.

## Phases

`awaiting_restore` → (`POST /restore`) → `starting` → `ready`. Until `ready`, the data routes answer
`503 {"error":"not_ready","phase":"..."}` (including `/status` and `/snapshot`; only `/health` and `/restore`
are exempt). `ready` means the database is open and the whatsmeow client is created (connected or not; the
connection is asynchronous). If opening the databases fails after an accepted `/restore`, the bridge goes back
to `awaiting_restore` (and the error goes to the log).

## Routes

JSON responses with `content-type: application/json`. Dates are always RFC 3339 with offset
(`2026-11-14T09:30:00-03:00`). Error: `{"error":"<code>","message":"<text in Portuguese>"}`. General codes:
`400 bad_request` (invalid parameter or body), `500 internal`, `503 not_connected` (WhatsApp must be connected
and it is not).

Returned text (messages, names, file names) comes without control characters (except `\n` and `\t`) and without
bidi overrides (U+202A–U+202E, U+2066–U+2069). Searches (`query`) ignore case and accents (`joao` finds `João`).
`sender_name` is `"You"` on messages sent by the account itself; with no known name, the phone number is used
(`+5531...`).

### `GET /health` (no auth)

`200 {"phase":"awaiting_restore"|"starting"|"ready"}`.

### `POST /restore`

- Only in the `awaiting_restore` phase (otherwise `409 {"error":"already_restored"}`).
- `X-Snapshot: none` header and empty body → start from scratch (`400` if there is a body). Otherwise the body is
  a snapshot (format below), read as a stream, capped at 1 GiB.
- Invalid snapshot (MAC, version, truncated) → `422 {"error":"bad_snapshot"}` and the bridge **stays** in
  `awaiting_restore` (the Worker decides whether to start from scratch).
- Success: `200 {"restored":true|false,"generation":<n>}`; opens the databases and connects to WhatsApp in the
  background.

### `GET /snapshot`

Builds a consistent snapshot (`VACUUM INTO` of both databases → tar → encrypt). If the SHA-256 of the plaintext
tar equals that of the last snapshot delivered or restored: `204`. Otherwise `200` with
`content-type: application/octet-stream`, `content-length` and `x-snapshot-generation: <n>` (n grows by 1 with
each new snapshot).

`GET /snapshot?force=1` skips the comparison and always returns `200` (useful if the Worker received a snapshot
but could not write it to R2: without this, the next ones would return `204`). To keep the hash stable, the
bridge normalizes, in the copied databases, the SQLite header fields that change without the content changing
(WAL/legacy format, change counter and schema cookie).

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

`needs_pairing` = no session (never paired or logged out from the phone). `last_event_at` may be `null`;
`account` is `null` without a session.

### `POST /sync/wait?timeout_ms=<n>`

Waits until `connected && offline_sync_complete`, or `needs_pairing`, or the timeout (default 10000, maximum
20000; larger values are reduced to 20000). Returns the same body as `/status` plus `"partial": true` if time
ran out first (the field is absent when it finished).

### `GET /chats?query=&limit=&cursor=`

`limit` 1–100 (default 20). `query` filters by name or number (escaped LIKE, case-insensitive). Order: most
recent last message first. `cursor` is opaque (returned in `next_cursor`, `null` at the end).

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

`limit` 1–100 (default 30). Most recent first. `before` is the opaque `next_before` from the previous page.
`404 {"error":"chat_not_found"}` if the JID does not exist in the database.

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

`text` is the caption on media and may be `""`. `media` only exists on media messages.

### `GET /search?query=&chat_jid=&limit=`

`query` required (1–200 characters; `400` otherwise). `limit` 1–100 (default 20). Searches the text (escaped
LIKE). Returns `{"messages":[...]}` in the format above with `chat_name` on each item.

### `GET /contacts?query=&limit=`

`query` required (1–200 characters). `limit` 1–100 (default 20). Searches saved name, push name and number (the
number only counts with 3 or more digits). Groups are excluded.
`{"contacts":[{"jid":"...","name":"...","push_name":"...","phone":"+5531999999999"}]}`. Fields without a value
are `null` (`phone` is `null` for LID-only contacts).

### `GET /media?message_id=&chat_jid=`

Downloads the media through whatsmeow. `404 {"error":"not_found"}` if the message does not exist or has no media;
`413 {"error":"too_large"}` if the declared (or downloaded) size exceeds `MAX_MEDIA_BYTES`;
`410 {"error":"media_expired"}` if WhatsApp no longer has the file; `502 {"error":"download_failed"}` on other
failures. Success: bytes with the media's `content-type` (`application/octet-stream` if the stored type is
invalid), `content-length` and `x-media-filename` when available — **percent-encoded in UTF-8** (use
`decodeURIComponent`).

### `POST /pair/code` — body `{"phone":"5531999999999"}`

Digits only, 8–15. Requires `needs_pairing`. Returns `{"code":"ABCD-EFGH"}` (whatsmeow `PairPhone`; it may take
a few seconds, because it waits for the pairing websocket to open). `409 {"error":"already_paired"}` if a
session already exists; `503 not_connected` if the websocket does not open within 15 s;
`502 {"error":"pair_failed"}` if WhatsApp refuses.

### `GET /pair/qr`

`{"qr":"<QR text>","png_base64":"<256×256 QR PNG in base64>","expires_at":"..."}` with the current QR, or
`409 {"error":"already_paired"}` if already paired, `503 {"error":"qr_not_ready"}` if it has not arrived yet (or
expired: in that case the bridge reopens pairing and a new QR arrives in a few seconds).

### `POST /logout`

Logs out of WhatsApp and deletes the local session (if the server does not answer, deletes only the local one).
`{"logged_out":true}`; `502 {"error":"logout_failed"}` if not even the local session can be deleted. Messages
already stored are kept.

### `POST /send` — body `{"recipient":"5531999999999","text":"...","reply_to":"<optional id>"}`

- `ENABLE_SEND=false` → `403 {"error":"send_disabled"}`.
- `recipient` accepts a number (digits only, with country code, optional `+`) or a contact JID
  (`@s.whatsapp.net`, `@lid`) or group JID (`@g.us`); anything else (e.g. `status@broadcast`) → `400`.
- An empty `SEND_ALLOWLIST` allows any contact or group; with entries, a recipient outside it →
  `403 {"error":"recipient_not_allowed"}`.
- Empty text (whitespace only) or longer than 4096 characters → `400`.
- `reply_to` (optional, up to 200 characters): id of a message **from the same chat** already stored in the
  database; the reply goes out quoting that message. Unknown id → `404 {"error":"quoted_not_found"}`, without
  using up the send quota.
- More than `SEND_MAX_PER_HOUR` attempts in the last hour → `429 {"error":"rate_limited","retry_after_seconds":n}`
  (and a `Retry-After` header). The attempt counts even if WhatsApp refuses it afterwards.
- WhatsApp disconnected → `503 not_connected`; refusal by WhatsApp → `502 {"error":"send_failed"}`.
- Success: `{"id":"...","timestamp":"..."}`; the sent message is also written to the database.

## Snapshot format (`WAS1`)

Header (63 bytes, used as associated data for every chunk):

| Field      | Bytes | Value                                                             |
| ---------- | ----- | ----------------------------------------------------------------- |
| magic      | 4     | `WAS1`                                                            |
| version    | 1     | `1`                                                               |
| generation | 8     | uint64 big-endian                                                 |
| chunk size | 4     | uint32 big-endian (65536)                                         |
| salt       | 32    | random; subkey = HKDF-SHA256(key, salt, `"whatsapp-snapshot-v1"`) |
| reserved   | 14    | zeros                                                             |

Then `AES-256-GCM` chunks of up to `chunk size` plaintext bytes, each with a 12-byte nonce = uint64 big-endian
counter in 11 bytes (the first 3 zero) + 1 flag byte (`1` on the last chunk, `0` on the others). The last chunk
may be empty. Truncating, reordering or changing any byte makes opening fail. The plaintext is a tar with
`session.db` and `messages.db`.

## `SIGTERM`

Stops accepting requests, disconnects whatsmeow and, if `SNAPSHOT_PUSH_URL` is set and something changed since
the last snapshot, `PUT`s the snapshot to it (header `Authorization: Bearer <BRIDGE_TOKEN>`,
`x-snapshot-generation`), with a 10 s limit. A failure only goes to the log.

## Session change

The same `PUT` happens, in the background, when the device session changes: pairing completed (`PairSuccess`),
connection opened (`Connected`) and logout from the phone (`LoggedOut`). With no change since the last snapshot,
nothing is sent; before `ready`, the notification is ignored. This way a new pairing reaches R2 right away and
survives container deploys and restarts.
