# Roadmap

## Next task

**F6.2 — Private source repository with the full history** (Phase 6, ADR 0035). The owner first creates the empty
private repository `temponi-bernardo/ia-conectors-src` and installs the Claude GitHub App on it. Still open:
F5.2 (Spotify: the owner creates their Spotify app and `list_liked_tracks` answers on claude.ai). F3.2 (WhatsApp
publish) is paused by ADR 0035. The Connectors Directory submission steps left for the owner are in
[DIRECTORY-LISTING.md](DIRECTORY-LISTING.md).

## How to read

Tasks have an id `F<phase>.<n>`, a status (⬜ not started · 🟨 in progress · ✅ done · ⏸️ paused) and a verifiable
"Done when" criterion. One task per PR whenever possible. When you finish, update the status and the "Next
task". Row format: [DOCUMENTATION.md](DOCUMENTATION.md#task-status).

## MVP

The MVP is the Canvas connector installed from the marketplace and used day to day, with nothing local: **Phases 1 and 2**.

## Phase 0 — Foundation (template) ✅

| Id   | Task                                                                    | Status | Done when                                                       |
| ---- | ----------------------------------------------------------------------- | ------ | --------------------------------------------------------------- |
| F0.1 | Structure, docs, checks, hooks and skills (from `template-new-project`) | ✅     | `npm run check` passes from scratch on a clean clone            |
| F0.2 | Local CI instead of GitHub Actions (`pr:check`, ADR 0006)               | ✅     | Actions off; `npm run pr:check` covers what CI covered          |
| F0.3 | Adapt the template to the project (`/novo-projeto`)                     | ✅     | No placeholders; PRODUCT, ROADMAP, ARCHITECTURE reflect project |

## Phase 1 — Connector structure and Canvas

| Id   | Task                                                          | Status | Done when                                                             |
| ---- | ------------------------------------------------------------- | ------ | --------------------------------------------------------------------- |
| F1.1 | Shared code (`src/core`, `src/mcp`) and packer (`tools/pack`) | ✅     | `npm run pack:all` produces valid `.mcpb` files                       |
| F1.2 | Port the Canvas connector to TypeScript, with tests and docs  | ✅     | 19 tools; extracted package answers with the real session             |
| F1.3 | Browser login with silent renewal (ADR 0007)                  | ✅     | Session renewed without a window; window only when Microsoft asks     |
| F1.4 | Repository as a plugin marketplace (ADR 0008)                 | ✅     | `claude plugin validate .` passes and the plugin runs via `.mcp.json` |

## Phase 2 — Real use

| Id    | Task                                                                                               | Status | Done when                                                                                                                                                                   |
| ----- | -------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F2.1  | First release `v0.1.0` of the remote connector                                                     | ✅     | `v0.1.0` tag and notes published, with no attachment (ADR 0013)                                                                                                             |
| F2.2  | Install from the marketplace and retire `Documents/canvas-mcp`                                     | ⬜     | Plugin installed from the marketplace connects via OAuth; old registration and `.mcpb` removed                                                                              |
| F2.3  | Choose and sketch the next connector (PRODUCT Q4)                                                  | ⬜     | Question Q4 decided and Phase 3 tasks written                                                                                                                               |
| F2.4  | Evaluate migrating to zod 4 (Dependabot ignores zod majors until then)                             | ⬜     | Connector tested with zod 4 and ignore rule removed, or an ADR saying why not                                                                                               |
| F2.5  | Evaluate TypeScript 7 (Dependabot ignores TS majors until then)                                    | ⬜     | `npm run check` green with TS 7 and ignore rule removed, or an ADR saying why not                                                                                           |
| F2.6  | Remote Canvas connector: HTTP + OAuth with token (ADR 0009)                                        | ✅     | `server/remote.js` runs the full OAuth and answers the tools; Dockerfile and Render                                                                                         |
| F2.7  | Remote connector on Cloudflare Workers and connected on claude.ai                                  | ✅     | Worker live and `proximas_entregas` answering in a Cowork session (ADR 0010)                                                                                                |
| F2.8  | Automatic renewal of the Canvas token on OAuth refresh                                             | ✅     | OAuth refresh extends the token's validity at PUC (ADR 0011)                                                                                                                |
| F2.9  | Public site on GitHub Pages: home, privacy and terms (ADR 0012)                                    | ✅     | Pages in `docs/` built by Jekyll, without the internal `.md` files; manifest points to the site                                                                             |
| F2.10 | Remove local mode: marketplace plugin points to the Worker                                         | ✅     | No stdio, `.mcpb` or browser login; `.mcp.json` is `http` only (ADR 0013)                                                                                                   |
| F2.11 | Public, multi-user, read-only remote Gmail (ADR 0014, 0016)                                        | ✅     | Code, tests and docs in the PR; Worker published and both accounts linked on claude.ai                                                                                      |
| F2.12 | Gmail with full management: send, reply, drafts, organize (ADR 0019)                               | ✅     | Code, tests and docs in the PR; `gmail.modify` scope at Google, deploy, and relinked accounts sending via claude.ai                                                         |
| F2.13 | Canvas: links of HTML content and files hidden from `list_files` (ADR 0025)                        | ✅     | `get_assignment(294409, 1408627)` lists the review PDF and the video; `download_file` brings the PDF; Worker deployed                                                       |
| F2.14 | Canvas token savings: compact JSON and `changed_since` cursor (ADR 0031)                           | ✅     | Four listings return only changes since the cursor with a `checked_at` note; plan update mode uses it                                                                       |
| F2.15 | Canvas: peer reviews (`list_peer_reviews`) and today's window in `upcoming_assignments` (ADR 0032) | ✅     | The 3 peer reviews of assignment 1388566 (due 00:00 today) show in `upcoming_assignments` as `peer_review` and in `list_peer_reviews` with the video links; Worker deployed |

## Phase 3 — Personal WhatsApp (self-host)

| Id   | Task                                                                                  | Status | Done when                                                                                       |
| ---- | ------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| F3.1 | `whatsapp` connector: Worker + GitHub OAuth, Go bridge in the container, R2 snapshots | ✅     | `pr:check` green with full read, `/pair`, send behind a flag and ADR 0015 with the measurements |
| F3.2 | Publish on the owner's account and pair the number                                    | ⏸️     | `list_chats` answering on claude.ai; real history-sync RSS recorded in the ADR                  |
| F3.3 | Restrict container egress to WhatsApp hosts (`allowedHosts`)                          | ⬜     | Bridge connects with `enableInternet = false` and only WhatsApp hosts, or an ADR saying why not |
| F3.4 | Sending enabled to any contact or group, with quoting (ADR 0015)                      | ✅     | `ENABLE_SEND` on, optional allowlist, confirmation and limit kept; Worker and Go tests          |
| F3.5 | Evaluate sending media over WhatsApp                                                  | ⬜     | Image/document sent with thumbnail and checked type, or an ADR saying why not                   |
| F3.6 | Chat access list managed by the owner on `/pair` (ADR 0033)                           | ✅     | Reads and sends refused outside the list in mode `selected`; Worker tests; skill and docs       |

## Phase 4 — Anthropic plugin standard and English

Plan from the 2026-11-14 marketplace review. One PR per task, in order; each ends with `pr:check` green.

| Id   | Task                                                                                            | Status | Done when                                                                                                                                                           |
| ---- | ----------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F4.1 | Decisions: plugin subfolder, English, version per plugin (ADR 0020–0022)                        | ✅     | ADRs accepted; CLAUDE.md rules 8 and 10 in English                                                                                                                  |
| F4.2 | Move plugin content to `connectors/<name>/plugin/` (ADR 0020)                                   | ✅     | Marketplace `source` points at `plugin/`; installed cache holds only manifests, `.mcp.json`, skills                                                                 |
| F4.3 | Complete manifests and add `claude plugin validate --strict` to `pr:check` (ADR 0022)           | ✅     | `version`, `license`, `keywords`, `homepage`, `author.url`; entries with `category`/`tags`; validate green                                                          |
| F4.4 | Required `title` and read-only/destructive hints in `src/mcp/tools.ts`; Canvas tools in English | ✅     | Typecheck fails without annotations; 18 Canvas tools and fields renamed; all three servers deployed                                                                 |
| F4.5 | Plugin skills renamed and written in English                                                    | ✅     | 12 skills with English names and content citing the new tool names                                                                                                  |
| F4.6 | Translate the repo: `docs:check` labels first, then docs, project skills, hooks, site           | ✅     | No Portuguese text left outside quoted user data; `docs:check` green                                                                                                |
| F4.7 | Connectors Directory readiness for Canvas and Gmail (no submission)                             | ✅     | OAuth audit (PKCE S256, resource metadata, claude.ai callback, `invalid_grant`) tested; privacy page reviewed; MCP Inspector run recorded; listing draft in `docs/` |

## Security — data isolation (out of phase)

Audit of 2026-11-18: no user, account, connector or request may see another one's data. Map, evidence and residual
risks in [security/isolation.md](security/isolation.md).

| Id   | Task                                                                                                                        | Status | Done when                                                                                                                                                                               |
| ---- | --------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1.1 | Isolation audit and fixes: seal `aud`, Canvas write opt-in, Gmail link confirmation, single WhatsApp owner, redaction, CORS | ✅     | Isolation tests green (two concurrent users, foreign/tampered/expired tokens, per-owner KV and cache, link ticket, redaction, module state); 3 Workers deployed; live probe 401/200/302 |

## Phase 5 — Spotify (each user's own app)

Decision in [ADR 0034](adr/0034-spotify-with-each-users-own-app.md); API checked in [SPOTIFY-API.md](SPOTIFY-API.md);
ideas in [SPOTIFY-IDEAS.md](SPOTIFY-IDEAS.md).

| Id   | Task                                                                                         | Status | Done when                                                                                                                        |
| ---- | -------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| F5.1 | `spotify` connector: own-app sign-in, sealed vault, full library/playlists, plans, backups   | ✅     | `pr:check` green; isolation, crypto, refresh, pagination, 429 and preview/apply tests; ADR 0034 and API validation in `docs/`    |
| F5.2 | Publish the Spotify Worker and connect the owner's account                                   | 🟨     | KV ids in `wrangler.toml`, `TOKEN_ENC_KEY` set, `npm run spotify:deploy` smoke green, `list_liked_tracks` answering on claude.ai |
| F5.3 | Run the motivating cleanup for real ("only Chris Cornell + electronic") and tune genre terms | ⬜     | Preview checked by the owner, applied, backup restorable; genre-term notes added to `/limpar-curtidas` if needed                 |

## Phase 6 — Private source, public marketplace (ADR 0035)

Close the source from now on without breaking current users: same marketplace name, plugin names, Worker URLs,
OAuth grants and site URLs. WhatsApp becomes private to the owner (F3.2 paused). One PR per task, in order; the
public repository is only slimmed (F6.5) after F6.2–F6.4 are proven.

| Id   | Task                                                                                                                                                 | Status | Done when                                                                                                                                                        |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F6.1 | Decision and plan: ADR 0035 and this phase                                                                                                           | ✅     | ADR accepted; F3.2 paused                                                                                                                                        |
| F6.2 | Private repo `ia-conectors-src` with the full history (`git push --mirror`); Claude GitHub App on it; cloud sessions use it                          | ⬜     | `pr:check` green and `npm run smoke` passing for all four connectors from a clone of the private repo                                                            |
| F6.3 | `npm run marketplace:publish` in the private repo: build, copy `canvas-puc`/`gmail`/`spotify` plugin folders and the site, public manifest, validate | ⬜     | Tested command produces the public tree; `claude plugin validate --strict` green on it; no source file outside `plugin/` and the site copied                     |
| F6.4 | WhatsApp private to the owner: private marketplace `claude-connectors-private` in the private repo                                                   | ⬜     | `whatsapp_status` answers on claude.ai after installing from the private marketplace (fallback recorded if only the custom connector URL works)                  |
| F6.5 | Slim the public repo in one revertible PR: only manifest, Canvas, Gmail and Spotify plugins, site, README, LICENSE; WhatsApp out of `privacy.html`   | ⬜     | `claude plugin validate --strict` green; Pages home, privacy and terms answer 200 at the same URLs; no history rewrite                                           |
| F6.6 | Compatibility check for current users                                                                                                                | ⬜     | Fresh install and update of an old install both work; existing OAuth connections still answer; Canvas, Gmail and Spotify smoke green; recorded in ADR 0035 notes |
| F6.7 | Switch the working setup to the private repo: CLAUDE.md, WORKFLOW, STRUCTURE, `/task` and `/release` with the publish step                           | ⬜     | A new session on the private repo runs `/task` end to end, including `marketplace:publish`                                                                       |

## Later phases

One new connector per phase, following the mold of `connectors/canvas-puc/`. Do not plan more than two phases
ahead in detail.
