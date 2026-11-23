# Changelog

## [2.0.0](https://github.com/temponi-bernardo/claude-connectors/compare/whatsapp-v1.0.0...whatsapp-v2.0.0) (2026-11-23)


### ⚠ BREAKING CHANGES

* **skills:** plugin slash commands were renamed, e.g. /resumo-semana is now /weekly-summary and /config-canvas is now /setup-canvas.
* **canvas:** Canvas tool names changed (e.g. proximas_entregas is now upcoming_assignments); saved permissions with the old names must be updated.

### Added

* **canvas:** rename tools to English and annotate every tool ([#45](https://github.com/temponi-bernardo/claude-connectors/issues/45)) ([9d09a18](https://github.com/temponi-bernardo/claude-connectors/commit/9d09a18318c578e17bb9bde8884894e6594f8817))
* **config:** add plugin versions, metadata and strict validation ([#43](https://github.com/temponi-bernardo/claude-connectors/issues/43)) ([e933b75](https://github.com/temponi-bernardo/claude-connectors/commit/e933b7566713202372a337a573812b1cea409db8))
* **skills:** adicionar os comandos /config-canvas, /config-gmail e /config-whatsapp ([#34](https://github.com/temponi-bernardo/claude-connectors/issues/34)) ([f4454ef](https://github.com/temponi-bernardo/claude-connectors/commit/f4454ef6c70e667d8a66cc15e36d3b46022a6f0d))
* **skills:** adicionar skills de uso aos plugins Canvas, Gmail e WhatsApp ([#35](https://github.com/temponi-bernardo/claude-connectors/issues/35)) ([7cf775b](https://github.com/temponi-bernardo/claude-connectors/commit/7cf775bfa1cda4e069629a5a39b26c645bbfb5e9))
* **skills:** rename plugin skills and write them in English ([#47](https://github.com/temponi-bernardo/claude-connectors/issues/47)) ([1bc7c20](https://github.com/temponi-bernardo/claude-connectors/commit/1bc7c2068cdad122f3f2d36c2848d2ee8847a998))
* **whatsapp:** adicionar conector WhatsApp pessoal remoto (Workers + Containers) ([#27](https://github.com/temponi-bernardo/claude-connectors/issues/27)) ([4a711d4](https://github.com/temponi-bernardo/claude-connectors/commit/4a711d4a413fac2671b392db5578343770bdd36d))
* **whatsapp:** ligar envio para qualquer contato ou grupo, com citação ([#36](https://github.com/temponi-bernardo/claude-connectors/issues/36)) ([a7d7220](https://github.com/temponi-bernardo/claude-connectors/commit/a7d7220da95610dce6e48469ca69311dc0d49f42))


### Fixed

* **canvas:** keep gated tools listed and add message attachments ([#67](https://github.com/temponi-bernardo/claude-connectors/issues/67)) ([24d0ef7](https://github.com/temponi-bernardo/claude-connectors/commit/24d0ef73c0336514f795a9a6e1708cf4362f32e7))
* **gmail:** require the owner's sign-in and keep one WhatsApp owner ([#64](https://github.com/temponi-bernardo/claude-connectors/issues/64)) ([521fff2](https://github.com/temponi-bernardo/claude-connectors/commit/521fff272df32a2b60efeb64ce04dbeb8c796450))
* **remote:** isolate user data across connectors ([#62](https://github.com/temponi-bernardo/claude-connectors/issues/62)) ([4dcacc1](https://github.com/temponi-bernardo/claude-connectors/commit/4dcacc14136f5a67675aa58a24c3b737232694a2))
* **whatsapp:** conectar o servidor próprio de cada pessoa sem embuti-lo no plugin ([#37](https://github.com/temponi-bernardo/claude-connectors/issues/37)) ([e732b5a](https://github.com/temponi-bernardo/claude-connectors/commit/e732b5aa63f9a9bb5fe309198b3cbad466983fa3))
* **whatsapp:** salvar a sessão no R2 para o pareamento sobreviver a deploys ([#39](https://github.com/temponi-bernardo/claude-connectors/issues/39)) ([02a898a](https://github.com/temponi-bernardo/claude-connectors/commit/02a898af3dab5c7016a4d46ca78eb62f01addad7))
* **whatsapp:** wait for the reconnect in whatsapp_status ([#54](https://github.com/temponi-bernardo/claude-connectors/issues/54)) ([e64d8e6](https://github.com/temponi-bernardo/claude-connectors/commit/e64d8e667340dfca3c6daea074d4363b1dd6d921))
