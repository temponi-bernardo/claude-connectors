# 0033 — Spotify connector with each user's own Spotify app and two-step batch changes

- **Status:** Accepted
- **Date:** 2026-11-24
- **Related:** task F5.1, ADR 0014, ADR 0016, ADR 0027; [SPOTIFY-API.md](../SPOTIFY-API.md)

## Context

Claude's built-in Spotify connector searches, creates playlists and likes items by URI, but cannot list Liked
Songs or playlist items, or edit existing playlists; "keep only Chris Cornell + electronic and unlike the rest"
is impossible with it. The owner wants a connector that friends can use too.

The Spotify Web API changed in 2026 ([SPOTIFY-API.md](../SPOTIFY-API.md)): an app in development mode serves at
most **5 users** and its owner needs **Premium**; extended quota is only for organizations with 250k MAU;
refresh tokens **expire 6 months** after authorization; batch catalog endpoints, `popularity`, recommendations
and audio features are gone for development-mode apps; library writes moved to `PUT/DELETE /me/library` (40 URIs)
and playlist items to `/playlists/{id}/items`. A single shared app would cap the connector at 5 people and put
every user's traffic on one quota.

## Decision

Each user brings **their own Spotify app**: the connector's `/authorize` page shows the exact Redirect URI and
takes the app's Client ID and Secret; the Worker runs Spotify's Authorization Code flow with that app and stores
the credentials and refresh token **sealed (AES-256-GCM, `TOKEN_ENC_KEY`) in a per-user vault in Workers KV**,
keyed by a hash of the Spotify account (`account_id`). Claude's OAuth is `@cloudflare/workers-oauth-provider`
(as Gmail). Every batch change is a **plan**: a `preview_*` tool answers counts, a sample and a `plan_id` valid
for 10 minutes; `apply_plan` runs it, saving a JSON backup first whenever it removes or rewrites. Large reads and
writes resume across calls within a per-call request budget (`SPOTIFY_CALL_BUDGET`, 40 by default to fit the
Workers Free plan's 50 subrequests).

## Alternatives considered

| Alternative                                  | Why not                                                                                                                                                                                                                       |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One shared Spotify app owned by the host     | 5-user cap in development mode; extended quota is not available to individuals; one quota for everyone                                                                                                                        |
| PKCE without a client secret (public client) | Fits, but combining PKCE with a confidential client is not documented by Spotify, and the secret flow is the documented server-side path; the library's single-use `state` bound to the browser already protects the callback |
| Stateless tokens (Canvas model, ADR 0009)    | Spotify rotates refresh tokens and the connector keeps snapshots, plans and backups: it needs per-user server state anyway                                                                                                    |
| Direct batch tools without preview           | One wrong filter could unlike thousands of tracks; preview + backup + plan id makes it reviewable and undoable                                                                                                                |
| A cron that pre-syncs libraries              | Against the on-demand rule of ADR 0014; resumable snapshots cover large libraries                                                                                                                                             |

## Consequences

- Positive: no shared quota or 5-user ceiling; full read and edit of the library and playlists; every bulk
  removal is previewed, confirmed and backed up; one user's data never opens for another (owner bound inside
  each seal, hashed keys, isolation tests).
- Negative / accepted costs: each person spends ~5 minutes creating an app and needs Premium as the app owner;
  authorizations end after 6 months (Claude's refresh token is set to 180 days so the next connection asks
  again); `genres` is deprecated and may be empty for some artists, so genre filters are best effort;
  `popularity` filters are not possible; liked dates cannot be restored; playlists with local files are never
  rewritten; artist follows use `/me/library` with a fallback to `/me/following` because Spotify's pages are
  ambiguous.
- Docs that change: ARCHITECTURE (services), STRUCTURE, PROCESSES (P21–P25), FUNCTIONS, ROADMAP (phase 5),
  PRODUCT, GLOSSARY, security/isolation.md, privacy pages, WORKFLOW (scope and deploy).
