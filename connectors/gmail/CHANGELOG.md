# Changelog

## [2.0.0](https://github.com/temponi-bernardo/claude-connectors/compare/gmail-v1.0.0...gmail-v2.0.0) (2026-11-23)


### ⚠ BREAKING CHANGES

* **skills:** plugin slash commands were renamed, e.g. /resumo-semana is now /weekly-summary and /config-canvas is now /setup-canvas.
* **canvas:** Canvas tool names changed (e.g. proximas_entregas is now upcoming_assignments); saved permissions with the old names must be updated.

### Added

* **canvas:** rename tools to English and annotate every tool ([#45](https://github.com/temponi-bernardo/claude-connectors/issues/45)) ([9d09a18](https://github.com/temponi-bernardo/claude-connectors/commit/9d09a18318c578e17bb9bde8884894e6594f8817))
* **config:** add plugin versions, metadata and strict validation ([#43](https://github.com/temponi-bernardo/claude-connectors/issues/43)) ([e933b75](https://github.com/temponi-bernardo/claude-connectors/commit/e933b7566713202372a337a573812b1cea409db8))
* **gmail:** adicionar conector Gmail remoto multi-conta só leitura no Workers ([#25](https://github.com/temponi-bernardo/claude-connectors/issues/25)) ([372a068](https://github.com/temponi-bernardo/claude-connectors/commit/372a068f88e9ca0df15a130de40fa02dced8275d))
* **gmail:** adicionar envio, respostas, rascunhos e organização da caixa ([#38](https://github.com/temponi-bernardo/claude-connectors/issues/38)) ([a5b6114](https://github.com/temponi-bernardo/claude-connectors/commit/a5b611425aedd8c4769f5715d2a819984c8c4445))
* **gmail:** tornar o conector Gmail público e multiusuário ([#28](https://github.com/temponi-bernardo/claude-connectors/issues/28)) ([8b2a53a](https://github.com/temponi-bernardo/claude-connectors/commit/8b2a53ac5c5608b04f422388b09e7cf0d535a3d2))
* **skills:** adicionar os comandos /config-canvas, /config-gmail e /config-whatsapp ([#34](https://github.com/temponi-bernardo/claude-connectors/issues/34)) ([f4454ef](https://github.com/temponi-bernardo/claude-connectors/commit/f4454ef6c70e667d8a66cc15e36d3b46022a6f0d))
* **skills:** adicionar skills de uso aos plugins Canvas, Gmail e WhatsApp ([#35](https://github.com/temponi-bernardo/claude-connectors/issues/35)) ([7cf775b](https://github.com/temponi-bernardo/claude-connectors/commit/7cf775bfa1cda4e069629a5a39b26c645bbfb5e9))
* **skills:** rename plugin skills and write them in English ([#47](https://github.com/temponi-bernardo/claude-connectors/issues/47)) ([1bc7c20](https://github.com/temponi-bernardo/claude-connectors/commit/1bc7c2068cdad122f3f2d36c2848d2ee8847a998))


### Fixed

* **canvas:** keep gated tools listed and add message attachments ([#67](https://github.com/temponi-bernardo/claude-connectors/issues/67)) ([24d0ef7](https://github.com/temponi-bernardo/claude-connectors/commit/24d0ef73c0336514f795a9a6e1708cf4362f32e7))
* **gmail:** require the owner's sign-in and keep one WhatsApp owner ([#64](https://github.com/temponi-bernardo/claude-connectors/issues/64)) ([521fff2](https://github.com/temponi-bernardo/claude-connectors/commit/521fff272df32a2b60efeb64ce04dbeb8c796450))
* **remote:** isolate user data across connectors ([#62](https://github.com/temponi-bernardo/claude-connectors/issues/62)) ([4dcacc1](https://github.com/temponi-bernardo/claude-connectors/commit/4dcacc14136f5a67675aa58a24c3b737232694a2))
* **remote:** prepare Canvas and Gmail for the Connectors Directory ([#44](https://github.com/temponi-bernardo/claude-connectors/issues/44)) ([8f147e9](https://github.com/temponi-bernardo/claude-connectors/commit/8f147e9fb3f881ee3d7300443705c7aa2a58c605))
