# Changelog — whatsapp

Plugin and remote server versions of the WhatsApp connector (ADR 0022). The repository changelog is
[`CHANGELOG.md`](../../CHANGELOG.md).

## Unreleased

## [2.0.0](https://github.com/temponi-bernardo/claude-connectors/compare/whatsapp-v1.0.0...whatsapp-v2.0.0) (2026-11-23)


### ⚠ BREAKING CHANGES

* **skills:** plugin slash commands were renamed, e.g. /resumo-semana is now /weekly-summary and /config-canvas is now /setup-canvas.
* **canvas:** Canvas tool names changed (e.g. proximas_entregas is now upcoming_assignments); saved permissions with the old names must be updated.

### Added

* **canvas:** rename tools to English and annotate every tool ([#45](https://github.com/temponi-bernardo/claude-connectors/issues/45)) ([9d09a18](https://github.com/temponi-bernardo/claude-connectors/commit/9d09a18318c578e17bb9bde8884894e6594f8817))
* **skills:** rename plugin skills and write them in English ([#47](https://github.com/temponi-bernardo/claude-connectors/issues/47)) ([1bc7c20](https://github.com/temponi-bernardo/claude-connectors/commit/1bc7c2068cdad122f3f2d36c2848d2ee8847a998))


### Fixed

* **canvas:** keep gated tools listed and add message attachments ([#67](https://github.com/temponi-bernardo/claude-connectors/issues/67)) ([24d0ef7](https://github.com/temponi-bernardo/claude-connectors/commit/24d0ef73c0336514f795a9a6e1708cf4362f32e7))
* **gmail:** require the owner's sign-in and keep one WhatsApp owner ([#64](https://github.com/temponi-bernardo/claude-connectors/issues/64)) ([521fff2](https://github.com/temponi-bernardo/claude-connectors/commit/521fff272df32a2b60efeb64ce04dbeb8c796450))
* **remote:** isolate user data across connectors ([#62](https://github.com/temponi-bernardo/claude-connectors/issues/62)) ([4dcacc1](https://github.com/temponi-bernardo/claude-connectors/commit/4dcacc14136f5a67675aa58a24c3b737232694a2))
* **whatsapp:** wait for the reconnect in whatsapp_status ([#54](https://github.com/temponi-bernardo/claude-connectors/issues/54)) ([e64d8e6](https://github.com/temponi-bernardo/claude-connectors/commit/e64d8e667340dfca3c6daea074d4363b1dd6d921))

## 1.0.0

First versioned plugin release (ADR 0022).
