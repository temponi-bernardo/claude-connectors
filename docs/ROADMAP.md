# Roadmap

## Next task

**F3.2 — WhatsApp: publish on the owner's account and pair the number.** Phase 4 (Anthropic plugin standard and
English) is done; the Connectors Directory submission steps left for the owner are in
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

| Id    | Task                                                                        | Status | Done when                                                                                                             |
| ----- | --------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| F2.1  | First release `v0.1.0` of the remote connector                              | ✅     | `v0.1.0` tag and notes published, with no attachment (ADR 0013)                                                       |
| F2.2  | Install from the marketplace and retire `Documents/canvas-mcp`              | ⬜     | Plugin installed from the marketplace connects via OAuth; old registration and `.mcpb` removed                        |
| F2.3  | Choose and sketch the next connector (PRODUCT Q4)                           | ⬜     | Question Q4 decided and Phase 3 tasks written                                                                         |
| F2.4  | Evaluate migrating to zod 4 (Dependabot ignores zod majors until then)      | ⬜     | Connector tested with zod 4 and ignore rule removed, or an ADR saying why not                                         |
| F2.5  | Evaluate TypeScript 7 (Dependabot ignores TS majors until then)             | ⬜     | `npm run check` green with TS 7 and ignore rule removed, or an ADR saying why not                                     |
| F2.6  | Remote Canvas connector: HTTP + OAuth with token (ADR 0009)                 | ✅     | `server/remote.js` runs the full OAuth and answers the tools; Dockerfile and Render                                   |
| F2.7  | Remote connector on Cloudflare Workers and connected on claude.ai           | ✅     | Worker live and `proximas_entregas` answering in a Cowork session (ADR 0010)                                          |
| F2.8  | Automatic renewal of the Canvas token on OAuth refresh                      | ✅     | OAuth refresh extends the token's validity at PUC (ADR 0011)                                                          |
| F2.9  | Public site on GitHub Pages: home, privacy and terms (ADR 0012)             | ✅     | Pages in `docs/` built by Jekyll, without the internal `.md` files; manifest points to the site                       |
| F2.10 | Remove local mode: marketplace plugin points to the Worker                  | ✅     | No stdio, `.mcpb` or browser login; `.mcp.json` is `http` only (ADR 0013)                                             |
| F2.11 | Public, multi-user, read-only remote Gmail (ADR 0014, 0016)                 | ✅     | Code, tests and docs in the PR; Worker published and both accounts linked on claude.ai                                |
| F2.12 | Gmail with full management: send, reply, drafts, organize (ADR 0019)        | ✅     | Code, tests and docs in the PR; `gmail.modify` scope at Google, deploy, and relinked accounts sending via claude.ai   |
| F2.13 | Canvas: links of HTML content and files hidden from `list_files` (ADR 0025) | ✅     | `get_assignment(294409, 1408627)` lists the review PDF and the video; `download_file` brings the PDF; Worker deployed |
| F2.14 | Canvas token savings: compact JSON and `changed_since` cursor (ADR 0031)    | ✅     | Four listings return only changes since the cursor with a `checked_at` note; plan update mode uses it                 |

## Phase 3 — Personal WhatsApp (self-host)

| Id   | Task                                                                                  | Status | Done when                                                                                       |
| ---- | ------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| F3.1 | `whatsapp` connector: Worker + GitHub OAuth, Go bridge in the container, R2 snapshots | ✅     | `pr:check` green with full read, `/pair`, send behind a flag and ADR 0015 with the measurements |
| F3.2 | Publish on the owner's account and pair the number                                    | 🟨     | `list_chats` answering on claude.ai; real history-sync RSS recorded in the ADR                  |
| F3.3 | Restrict container egress to WhatsApp hosts (`allowedHosts`)                          | ⬜     | Bridge connects with `enableInternet = false` and only WhatsApp hosts, or an ADR saying why not |
| F3.4 | Sending enabled to any contact or group, with quoting (ADR 0015)                      | ✅     | `ENABLE_SEND` on, optional allowlist, confirmation and limit kept; Worker and Go tests          |
| F3.5 | Evaluate sending media over WhatsApp                                                  | ⬜     | Image/document sent with thumbnail and checked type, or an ADR saying why not                   |

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

## Later phases

One new connector per phase, following the mold of `connectors/canvas-puc/`. Do not plan more than two phases
ahead in detail.
