# Avisos de terceiros — conector WhatsApp

A ponte em `bridge/` (Go) é código deste repositório (licença MIT, ver `LICENSE` na raiz). O binário e a
imagem do container incluem as bibliotecas abaixo, todas usadas **sem modificação**, nas versões fixadas em
`bridge/go.mod`/`bridge/go.sum`.

## Bibliotecas principais

| Biblioteca                                                                       | Licença      | Uso                                          |
| -------------------------------------------------------------------------------- | ------------ | -------------------------------------------- |
| [go.mau.fi/whatsmeow](https://github.com/tulir/whatsmeow)                        | MPL-2.0      | Cliente do WhatsApp (protocolo multi-device) |
| [go.mau.fi/util](https://github.com/mautrix/go-util)                             | MPL-2.0      | Dependência do whatsmeow (`dbutil` etc.)     |
| [go.mau.fi/libsignal](https://github.com/tulir/libsignal-protocol-go)            | **GPL-3.0**  | Dependência do whatsmeow (protocolo Signal)  |
| [modernc.org/sqlite](https://gitlab.com/cznic/sqlite) (+ libc, mathutil, memory) | BSD-3-Clause | Driver SQLite em Go puro                     |
| [github.com/skip2/go-qrcode](https://github.com/skip2/go-qrcode)                 | MIT          | PNG do QR de pareamento                      |
| [golang.org/x/crypto](https://pkg.go.dev/golang.org/x/crypto) (HKDF)             | BSD-3-Clause | Derivação da subchave dos snapshots          |

### Atenção: GPL-3.0

O `go.mau.fi/libsignal` é GPL-3.0 e entra no binário por dependência obrigatória do whatsmeow. Quem
**distribuir** o binário ou a imagem precisa cumprir a GPL-3.0 para o conjunto (oferecer o código-fonte
correspondente, que é este repositório mais os módulos em `go.sum`). O código próprio continua MIT, que é
compatível com a GPL-3.0. Rodar a imagem só na própria conta do Cloudflare não é distribuição.

## Demais dependências transitivas

| Biblioteca                                                                                 | Licença      |
| ------------------------------------------------------------------------------------------ | ------------ |
| filippo.io/edwards25519                                                                    | BSD-3-Clause |
| github.com/beeper/argo-go                                                                  | MIT          |
| github.com/coder/websocket                                                                 | ISC          |
| github.com/dustin/go-humanize                                                              | MIT          |
| github.com/elliotchance/orderedmap/v3                                                      | MIT          |
| github.com/google/uuid                                                                     | BSD-3-Clause |
| github.com/mattn/go-colorable, github.com/mattn/go-isatty                                  | MIT          |
| github.com/petermattis/goid                                                                | Apache-2.0   |
| github.com/remyoudompheng/bigfft                                                           | BSD-3-Clause |
| github.com/rs/zerolog                                                                      | MIT          |
| github.com/vektah/gqlparser/v2                                                             | MIT          |
| golang.org/x/exp, golang.org/x/net, golang.org/x/sync, golang.org/x/sys, golang.org/x/text | BSD-3-Clause |
| google.golang.org/protobuf                                                                 | BSD-3-Clause |

## Inspiração

O esquema de `messages.db` e o tratamento de eventos seguem a ideia geral de
[lharries/whatsapp-mcp](https://github.com/lharries/whatsapp-mcp) (MIT), mas nenhum código foi copiado: o
esquema, as consultas e os handlers foram escritos do zero para este conector.

## Imagem base

`gcr.io/distroless/static-debian12:nonroot` (Google, Apache-2.0; inclui certificados CA e tzdata do Debian
com as licenças deles).
