# Product

## In one sentence

MCP connectors for Claude that run in the cloud and install through the plugin marketplace, starting with PUC Minas Canvas.

## For whom

- **Main audience:** the repository owner (a Computer Science student at PUC Minas), who uses Claude and wants
  direct access to everyday systems.
- **Platforms:** claude.ai, Cowork, the mobile app and Claude Code, all through the same remote server. It installs
  through the plugin marketplace; nothing runs on the computer (ADR 0013). No graphical interface of its own.

## Connectors

| Connector    | What it gives Claude                                                        | Status    |
| ------------ | --------------------------------------------------------------------------- | --------- |
| `canvas-puc` | Due-date agenda, assignments, grades, announcements, modules, files, forums | ✅ v3.0.0 |
| `gmail`      | Several Gmail accounts: search, read, send, drafts, labels, archive, trash  | ✅ v1.0.0 |
| `whatsapp`   | Personal WhatsApp: chats, messages, search, contacts and media (self-host)  | ✅ v1.0.0 |
| `spotify`    | Spotify with your own app: library, playlists, cleanups with preview/backup | 🟨 v0.1.0 |

Usage guide for each one in `connectors/<name>/README.md`.

## Business model

None: personal use, private repository, zero cost (no hosting and no GitHub Actions).

## Open questions → decisions

Record the question when it comes up; once decided, move it to the decisions table with the date. An
architecture decision goes to an ADR; a product decision stays here.

### Open

| #   | Question                                          | Options under consideration                    |
| --- | ------------------------------------------------- | ---------------------------------------------- |
| Q5  | Is mobile/web access (remote connector) worth it? | Host with its own OAuth × stay on Desktop only |

### Decided

| #   | Decision                                                                                                                                                           | Date       | Reason                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------------------------------------------- |
| Q1  | Audience: the owner's personal use; first pain: following PUC Canvas without opening the site                                                                      | 2026-11-05 | Owner's request                                      |
| Q2  | No interface of its own; the interface is Claude (web, Cowork, mobile and Code)                                                                                    | 2026-11-05 | MCP connectors                                       |
| Q3  | No revenue; zero cost, including no GitHub Actions                                                                                                                 | 2026-11-05 | Owner's request (ADR 0006)                           |
| Q6  | Sign-in with a Canvas token on the OAuth page, with its expiry renewed automatically (replaces browser sign-in)                                                    | 2026-11-14 | Cloud-only connector (ADR 0011, ADR 0013)            |
| Q7  | Writes (submit an assignment, reply in a forum) enabled, always with confirmation in the chat                                                                      | 2026-11-05 | Owner's choice (`CANVAS_ALLOW_WRITE=true` in Worker) |
| Q8  | Cloud-only connector, installed through the marketplace; nothing runs on the computer                                                                              | 2026-11-14 | Owner's request (ADR 0013)                           |
| Q4  | Next connector: personal WhatsApp, as a self-host template (each person on their own Cloudflare account, never multi-tenant)                                       | 2026-11-14 | Owner's request (ADR 0015)                           |
| Q10 | Spotify connector for the owner and friends, each with their own Spotify app (5-user cap per app in 2026), batch changes only through preview → apply with backups | 2026-11-24 | Owner's request (ADR 0033)                           |
| Q9  | WhatsApp: sending enabled to any contact or group, with confirmation for each message and an hourly limit (F3.4)                                                   | 2026-11-14 | Owner's request; reduces abuse and ban risk          |
| Q10 | On-demand WhatsApp: nothing running without use (no cron by default); typical use within the Workers Paid allowance                                                | 2026-11-14 | Owner's request (cost in the connector README)       |
