# Changelog — gmail

Plugin and remote server versions of the Gmail connector (ADR 0022). The repository changelog is
[`CHANGELOG.md`](../../CHANGELOG.md).

## Unreleased

## [2.0.0](https://github.com/temponi-bernardo/claude-connectors/compare/gmail-v1.0.0...gmail-v2.0.0) (2026-11-23)

### ⚠ BREAKING CHANGES

- Skills renamed to English (#47): `/achar-documento` → `/find-document`, `/config-gmail` → `/setup-gmail`,
  `/resumir-conversa` → `/summarize-thread`, `/triagem-email` → `/triage-inbox`.

### Changed

- Tool descriptions, messages and pages are in English (#45).
- Public `GET /tools` and a tool contract (`tool-contract.json`) checked by tests and by the post-deploy smoke
  test (#67).

### Security

- Opening a `link_account` link shows whose connector receives the account and asks for confirmation, then
  Google confirms the owner's identity before asking for Gmail access; a forwarded link links nothing (#64).
- Every link seal names its connector (`aud`); data is isolated per user (#62).
- Sign-in prepared for the Connectors Directory (#44).

## 1.0.0

First versioned plugin release (ADR 0022).
