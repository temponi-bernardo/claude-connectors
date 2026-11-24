# claude-connectors

MCP connectors for Claude that run in the cloud and install from the plugin marketplace, starting with PUC Minas's
Canvas.

## Connectors

| Plugin                                        | What it does                                                                 |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| [`canvas-puc`](connectors/canvas-puc/plugin/) | PUC Minas's Canvas LMS: due dates, assignments, grades, announcements, files |
| [`gmail`](connectors/gmail/plugin/)           | Multi-account Gmail: read, send, reply, forward, drafts and organize         |
| [`spotify`](connectors/spotify/plugin/)       | Spotify with your own app: library, playlists, cleanups with preview/backup  |

## Install in Claude

In Claude (claude.ai, Cowork or Claude Code), **Add marketplace** → `temponi-bernardo/claude-connectors` and
install the plugin you want. Nothing is installed on your computer: the plugin points to the connector's remote
server, and you sign in the first time, on an OAuth page.

## Site

The service's public page, privacy policy and terms: <https://claude-connectors-site.bftemponi.workers.dev/>.

## About this repository

This repository only holds the published marketplace: the plugin folders, the manifest and the site. It is
generated from the private development repository; changes made here directly are overwritten on the next
publish.

## License

[MIT](LICENSE).
