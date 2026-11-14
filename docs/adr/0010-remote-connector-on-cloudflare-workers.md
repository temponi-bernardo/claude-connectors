# 0010 — Remote connector hosted on Cloudflare Workers

- **Status:** Accepted
- **Date:** 2026-11-05
- **Related:** F2.7, partly supersedes ADR 0009 (item 7, hosting)

## Context

ADR 0009 published the remote server with Docker, using a Render blueprint. Render's free plan sleeps after
15 minutes idle and the first call takes about 1 minute, long enough for Claude to give up. The owner already
has a Cloudflare account and connector and prefers Workers. The remote handler already uses
`Request`/`Response` (Web standard), which is Workers' native interface.

## Decision

1. The remote Canvas connector is published on **Cloudflare Workers** with `npm run worker:deploy`
   (`connectors/canvas-puc/wrangler.toml`, entry `src/worker.ts`, `nodejs_compat` flag for `node:crypto`).
2. `SEAL_KEY` is a Worker _secret_ (`wrangler secret put`); `CANVAS_BASE_URL` and `CANVAS_ALLOW_WRITE` go in
   `[vars]`. Without `PUBLIC_URL`, the OAuth issuer is the request origin (`*.workers.dev`).
3. Deployment is manual (after the merge), with `CLOUDFLARE_API_TOKEN` in the environment: Claude's Cloudflare
   connector does not publish Workers and the project does not use CI (ADR 0006).
4. `render.yaml` is removed. The `Dockerfile` and `server/remote.js` stay for anyone who wants another host.

## Alternatives considered

| Alternative            | Why not                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| Keep Render            | Sleeps on the free plan; the first call may exceed Claude's timeout. |
| Google Cloud Run       | Requires a card and `gcloud` setup; no advantage over Workers here.  |
| Automatic deploy by CI | There are no GitHub Actions (ADR 0006).                              |

## Consequences

- Positive: no sleeping server, HTTPS and domain ready, ~164 KiB compressed bundle, free plan.
- Negative / accepted costs: manual deploy after each merge that touches the connector; the global `fetch`
  must be called without another object's `this` (see `readCanvasRemoteSettings()`); a new dev dependency
  (`wrangler`).
- Docs that change: ARCHITECTURE (installation format and services), STRUCTURE (`wrangler.toml`), PROCESSES
  (P08), WORKFLOW and CLAUDE.md (`worker:dev`, `worker:deploy`), connector README, `.env.example`.
