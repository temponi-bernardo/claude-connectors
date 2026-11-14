# Third-party notices — WhatsApp connector

The bridge in `bridge/` (Go) is code from this repository (MIT license, see `LICENSE` at the root). The binary and
the container image include the libraries below, all used **unmodified**, at the versions pinned in
`bridge/go.mod`/`bridge/go.sum`.

## Main libraries

| Library                                                                          | License      | Use                                     |
| -------------------------------------------------------------------------------- | ------------ | --------------------------------------- |
| [go.mau.fi/whatsmeow](https://github.com/tulir/whatsmeow)                        | MPL-2.0      | WhatsApp client (multi-device protocol) |
| [go.mau.fi/util](https://github.com/mautrix/go-util)                             | MPL-2.0      | whatsmeow dependency (`dbutil` etc.)    |
| [go.mau.fi/libsignal](https://github.com/tulir/libsignal-protocol-go)            | **GPL-3.0**  | whatsmeow dependency (Signal protocol)  |
| [modernc.org/sqlite](https://gitlab.com/cznic/sqlite) (+ libc, mathutil, memory) | BSD-3-Clause | Pure Go SQLite driver                   |
| [github.com/skip2/go-qrcode](https://github.com/skip2/go-qrcode)                 | MIT          | Pairing QR code PNG                     |
| [golang.org/x/crypto](https://pkg.go.dev/golang.org/x/crypto) (HKDF)             | BSD-3-Clause | Derivation of the snapshot subkey       |

### Note: GPL-3.0

`go.mau.fi/libsignal` is GPL-3.0 and ends up in the binary as a mandatory dependency of whatsmeow. Anyone who
**distributes** the binary or the image must comply with GPL-3.0 for the whole (offer the corresponding source
code, which is this repository plus the modules in `go.sum`). The project's own code remains MIT, which is
compatible with GPL-3.0. Running the image only on your own Cloudflare account is not distribution.

## Other transitive dependencies

| Library                                                                                    | License      |
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

## Inspiration

The `messages.db` schema and the event handling follow the general idea of
[lharries/whatsapp-mcp](https://github.com/lharries/whatsapp-mcp) (MIT), but no code was copied: the schema,
queries and handlers were written from scratch for this connector.

## Base image

`gcr.io/distroless/static-debian12:nonroot` (Google, Apache-2.0; includes Debian's CA certificates and tzdata
under their own licenses).
