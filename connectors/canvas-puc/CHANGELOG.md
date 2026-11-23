# Changelog — canvas-puc

Plugin and remote server versions of the Canvas connector (ADR 0022). The repository changelog is
[`CHANGELOG.md`](../../CHANGELOG.md).

## Unreleased

### Added

- `/planejamento-faculdade` skill: builds and updates the "Plano do Semestre AAAA/S" artifact (risk per course, today and
  tomorrow, day-by-day study plan, course cards with a points bar, timeline, questions for instructors) from
  Canvas plus the optional `gmail` and `whatsapp` plugins, read-only; persistent checklists with stable ids
  (browser + artifact database); `scripts/plan.mjs` validates, builds and extracts the page; offers three daily
  routines (ADR 0030).
- `prepare_attachment_upload`: returns a one-time `curl` that uploads a local file (up to 25 MB) straight to
  Canvas, with no base64 in the call; `send_message` and `reply_message` take its `id` in `file_ids` (ADR 0028).
- `file_ids` on `send_message` and `reply_message`: attach Canvas files by id; files outside "conversation
  attachments" are copied there first.
- `send_message` and `reply_message` take attachments (up to 5 files of 5 MB, text or base64), uploaded to the
  "conversation attachments" folder before sending; a refused or failed file sends nothing.
- `/write-access`: a read-only connection turns writing on (or off) from a link, without a new Canvas token.
- Public `GET /tools` (the server's `tools/list`) for the post-deploy smoke test.

### Changed

- Write tools are always listed; when writing is off they answer why and how to turn it on instead of
  disappearing (ADR 0027).
- `reply_to_conversation` is now `reply_message`.

### Fixed

- `find_recipients` promised a `send_message` that read-only connections could not see.

## [3.2.0](https://github.com/temponi-bernardo/claude-connectors/compare/canvas-puc-v3.1.0...canvas-puc-v3.2.0) (2026-11-23)


### ⚠ BREAKING CHANGES

* **skills:** plugin slash commands were renamed, e.g. /resumo-semana is now /weekly-summary and /config-canvas is now /setup-canvas.
* **canvas:** Canvas tool names changed (e.g. proximas_entregas is now upcoming_assignments); saved permissions with the old names must be updated.
* **canvas:** quem usava a extensão .mcpb ou o plugin local precisa reinstalar pelo marketplace e entrar com um token do Canvas.

### Added

* **canvas:** add /planejamento-faculdade semester plan skill ([#72](https://github.com/temponi-bernardo/claude-connectors/issues/72)) ([1c4a7c3](https://github.com/temponi-bernardo/claude-connectors/commit/1c4a7c38f26c12850d0b4fbefbe24176963a77c1))
* **canvas:** add inbox tools to find people, read and send messages ([#56](https://github.com/temponi-bernardo/claude-connectors/issues/56)) ([1d089b3](https://github.com/temponi-bernardo/claude-connectors/commit/1d089b32d424e226af42a805e8f3ea4655efe9e7))
* **canvas:** add submit_file_assignment for upload-only assignments ([#61](https://github.com/temponi-bernardo/claude-connectors/issues/61)) ([2ec0daf](https://github.com/temponi-bernardo/claude-connectors/commit/2ec0dafb9a989185faec08a24c33ae3dcc5c0b69))
* **canvas:** attach files by id and direct upload ([#69](https://github.com/temponi-bernardo/claude-connectors/issues/69)) ([2187df7](https://github.com/temponi-bernardo/claude-connectors/commit/2187df7cc5d4478f33ec0b543fadfc0fcb208c34))
* **canvas:** baixar arquivos e ler .doc/.docx ([#19](https://github.com/temponi-bernardo/claude-connectors/issues/19)) ([04a1994](https://github.com/temponi-bernardo/claude-connectors/commit/04a199435d01d2055a158f1be602b258b32e3e0b))
* **canvas:** extract links from HTML and open files hidden from list_files ([#58](https://github.com/temponi-bernardo/claude-connectors/issues/58)) ([5e73066](https://github.com/temponi-bernardo/claude-connectors/commit/5e73066809c1a825e0928b66000339c445e07cfa))
* **canvas:** instalar conectores pelo marketplace de plugins do Claude ([#9](https://github.com/temponi-bernardo/claude-connectors/issues/9)) ([5c7fb83](https://github.com/temponi-bernardo/claude-connectors/commit/5c7fb83eb5804f3860032c13ab7d4e224c850c2c))
* **canvas:** remover o modo local e instalar só pelo marketplace na nuvem ([#23](https://github.com/temponi-bernardo/claude-connectors/issues/23)) ([5113c24](https://github.com/temponi-bernardo/claude-connectors/commit/5113c241e7e83b6406e6c884d2afa8a25f365aff))
* **canvas:** rename tools to English and annotate every tool ([#45](https://github.com/temponi-bernardo/claude-connectors/issues/45)) ([9d09a18](https://github.com/temponi-bernardo/claude-connectors/commit/9d09a18318c578e17bb9bde8884894e6594f8817))
* **canvas:** return large download_file results in 8 MB parts ([#57](https://github.com/temponi-bernardo/claude-connectors/issues/57)) ([e35b5d2](https://github.com/temponi-bernardo/claude-connectors/commit/e35b5d28b9405b4b166a705e527bb96c3b7f82a0))
* **canvas:** stream download_file and raise its limit to 70 MB ([#55](https://github.com/temponi-bernardo/claude-connectors/issues/55)) ([5909b31](https://github.com/temponi-bernardo/claude-connectors/commit/5909b31b101d4a74070276f0126c190b5a114bcd))
* **config:** add plugin versions, metadata and strict validation ([#43](https://github.com/temponi-bernardo/claude-connectors/issues/43)) ([e933b75](https://github.com/temponi-bernardo/claude-connectors/commit/e933b7566713202372a337a573812b1cea409db8))
* **gmail:** adicionar conector Gmail remoto multi-conta só leitura no Workers ([#25](https://github.com/temponi-bernardo/claude-connectors/issues/25)) ([372a068](https://github.com/temponi-bernardo/claude-connectors/commit/372a068f88e9ca0df15a130de40fa02dced8275d))
* **gmail:** adicionar envio, respostas, rascunhos e organização da caixa ([#38](https://github.com/temponi-bernardo/claude-connectors/issues/38)) ([a5b6114](https://github.com/temponi-bernardo/claude-connectors/commit/a5b611425aedd8c4769f5715d2a819984c8c4445))
* **remote:** adicionar conector Canvas remoto com OAuth para a nuvem ([#11](https://github.com/temponi-bernardo/claude-connectors/issues/11)) ([e8f545c](https://github.com/temponi-bernardo/claude-connectors/commit/e8f545c4a87de0b298c5723a1dedc906a8bbbb46))
* **remote:** publicar o conector Canvas remoto no Cloudflare Workers ([#12](https://github.com/temponi-bernardo/claude-connectors/issues/12)) ([75b6a00](https://github.com/temponi-bernardo/claude-connectors/commit/75b6a009f02c73acc219704e876f895daa0ddd65))
* **remote:** renovar sozinho a validade do token do Canvas no refresh do OAuth ([#18](https://github.com/temponi-bernardo/claude-connectors/issues/18)) ([14aefc1](https://github.com/temponi-bernardo/claude-connectors/commit/14aefc1f0e5afe60dfb46219a95d93de3c0151d1))
* **site:** publicar página do serviço no GitHub Pages ([#22](https://github.com/temponi-bernardo/claude-connectors/issues/22)) ([8e66f69](https://github.com/temponi-bernardo/claude-connectors/commit/8e66f69bb195dd34f81874d9bd87aa17f1a77b09))
* **skills:** adicionar os comandos /config-canvas, /config-gmail e /config-whatsapp ([#34](https://github.com/temponi-bernardo/claude-connectors/issues/34)) ([f4454ef](https://github.com/temponi-bernardo/claude-connectors/commit/f4454ef6c70e667d8a66cc15e36d3b46022a6f0d))
* **skills:** adicionar skills de uso aos plugins Canvas, Gmail e WhatsApp ([#35](https://github.com/temponi-bernardo/claude-connectors/issues/35)) ([7cf775b](https://github.com/temponi-bernardo/claude-connectors/commit/7cf775bfa1cda4e069629a5a39b26c645bbfb5e9))
* **skills:** rename plugin skills and write them in English ([#47](https://github.com/temponi-bernardo/claude-connectors/issues/47)) ([1bc7c20](https://github.com/temponi-bernardo/claude-connectors/commit/1bc7c2068cdad122f3f2d36c2848d2ee8847a998))
* **whatsapp:** adicionar conector WhatsApp pessoal remoto (Workers + Containers) ([#27](https://github.com/temponi-bernardo/claude-connectors/issues/27)) ([4a711d4](https://github.com/temponi-bernardo/claude-connectors/commit/4a711d4a413fac2671b392db5578343770bdd36d))


### Fixed

* **canvas:** keep gated tools listed and add message attachments ([#67](https://github.com/temponi-bernardo/claude-connectors/issues/67)) ([24d0ef7](https://github.com/temponi-bernardo/claude-connectors/commit/24d0ef73c0336514f795a9a6e1708cf4362f32e7))
* **canvas:** usar o proxy do ambiente no plugin para funcionar na nuvem ([#20](https://github.com/temponi-bernardo/claude-connectors/issues/20)) ([2ceb4fa](https://github.com/temponi-bernardo/claude-connectors/commit/2ceb4fa8f5ed004aac48a37f38cceb83f3d90dd3))
* **remote:** enviar User-Agent nas chamadas ao Canvas pelo Worker ([#13](https://github.com/temponi-bernardo/claude-connectors/issues/13)) ([2594501](https://github.com/temponi-bernardo/claude-connectors/commit/259450127f624d63f358cc9db69961b62493c3f2))
* **remote:** isolate user data across connectors ([#62](https://github.com/temponi-bernardo/claude-connectors/issues/62)) ([4dcacc1](https://github.com/temponi-bernardo/claude-connectors/commit/4dcacc14136f5a67675aa58a24c3b737232694a2))
* **remote:** liberar o retorno do OAuth no form-action da página de login ([#14](https://github.com/temponi-bernardo/claude-connectors/issues/14)) ([7c76778](https://github.com/temponi-bernardo/claude-connectors/commit/7c76778fab97f3bb597137772681b5099dc4cabd))
* **remote:** prepare Canvas and Gmail for the Connectors Directory ([#44](https://github.com/temponi-bernardo/claude-connectors/issues/44)) ([8f147e9](https://github.com/temponi-bernardo/claude-connectors/commit/8f147e9fb3f881ee3d7300443705c7aa2a58c605))

## 3.1.0 (2026-11-18)

### Added

- Links and media of assignments, pages, forums and announcements: the text keeps `title [link N]` marks and a new
  `links` field lists embedded files, videos, images, pages and external links; `raw_html: true` returns the
  original HTML (ADR 0025).
- `list_linked_files(course_id)`: every file and video the course content points to, once per file id.
- `list_files` takes `include_linked: true` and always notes that hidden files are not listed.
- Inbox tools: `find_recipients`, `list_conversations`, `get_conversation`, `send_message` and
  `reply_to_conversation` (writes only with confirmation).

### Changed

- `download_file` and `read_file_text` open files hidden from `list_files`, by `file_id` or Canvas file `url`,
  trying the course, global and verifier endpoints, with a clear error per endpoint.
- `download_file` handles files up to 70 MB, streamed, in parts of 8 MB (ADR 0023, 0024).
- A 401 that only denies one resource is no longer reported as an expired token.
