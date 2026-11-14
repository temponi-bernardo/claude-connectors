# claude-connectors

MCP connectors for Claude that run in the cloud and install from the plugin marketplace, starting with PUC Minas's Canvas.

## Connectors

| Connector                                       | What it does                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| [`canvas-puc`](connectors/canvas-puc/README.md) | PUC Minas's Canvas LMS: due dates, assignments, grades, announcements, files |
| [`gmail`](connectors/gmail/README.md)           | Multi-account Gmail: read, send, reply, forward, drafts and organize         |

## Install in Claude

In Claude (claude.ai, Cowork or Claude Code), **Add marketplace** → `temponi-bernardo/claude-connectors`
and install the plugin you want. Nothing is installed on the computer: the plugin points to the connector's
remote server, and login happens the first time, on an OAuth page ([ADR 0013](docs/adr/0013-remote-only-connector-via-marketplace.md)).

## Develop

```bash
nvm use            # Node 22 (.nvmrc)
npm install        # installs and enables the git hooks
npm run check      # format, lint, types, tests, docs, secrets
npm run build      # validates the plugin (remote only) and builds server/remote.js
npm run worker:deploy   # publishes the remote server to Cloudflare Workers
```

Requirements: Node 22 and gitleaks (`winget install Gitleaks.Gitleaks`; in the Claude Code cloud it is installed
automatically through Go, with `scripts/install-gitleaks.sh`).

## Site

The service's public page, privacy policy and terms: <https://temponi-bernardo.github.io/claude-connectors/>
(GitHub Pages served from `docs/`, ADR 0012).

## No GitHub Actions

Nothing runs on GitHub: the PR gate is `npm run pr:check -- "<PR title>"` and releases use the release-please
CLI locally ([ADR 0006](docs/adr/0006-no-github-actions-local-checks.md)).

## Documentation

Start at [`docs/README.md`](docs/README.md). Development rules in [`CLAUDE.md`](CLAUDE.md).

## License

[MIT](LICENSE).
