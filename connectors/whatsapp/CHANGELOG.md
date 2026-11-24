# Changelog — whatsapp

Plugin and remote server versions of the WhatsApp connector (ADR 0022). The repository changelog is
[`CHANGELOG.md`](../../CHANGELOG.md).

## Unreleased

### Added

- Chat access list (ADR 0033): on `/pair`, the owner chooses which contacts and groups Claude may read and
  message; `get_access_list` tool and `/whatsapp-access` skill.

## [2.0.0](https://github.com/temponi-bernardo/claude-connectors/compare/whatsapp-v1.0.0...whatsapp-v2.0.0) (2026-11-23)

### ⚠ BREAKING CHANGES

- Skills renamed to English (#47): `/buscar-whatsapp` → `/search-whatsapp`, `/config-whatsapp` →
  `/setup-whatsapp`, `/pendencias-whatsapp` → `/whatsapp-pending`, `/resumo-whatsapp` → `/whatsapp-summary`.

### Changed

- `send_message` is listed even with `ENABLE_SEND` off and answers that sending is off (#67).

### Fixed

- `whatsapp_status` waits for the reconnect (#54).

### Security

- `ALLOWED_EMAILS` must have exactly one email, since everyone listed would read the same WhatsApp (#64).
- `/pair` seals name their connector (`aud`); data is isolated per user (#62).

## 1.0.0

First versioned plugin release (ADR 0022).
