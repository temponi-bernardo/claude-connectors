# 0011 — Automatic Canvas token renewal on OAuth refresh

- **Status:** Accepted
- **Date:** 2026-11-05
- **Related:** F2.8, partly supersedes ADR 0009 (the "reconnect every 30 days" cost)

## Context

The remote connector (ADR 0009) keeps the personal Canvas token sealed inside the OAuth tokens. The PUC token
expires, and the user had to generate a new one and reconnect every month. Tests against PUC's Canvas on
2026-11-05 showed:

- `GET /api/v1/users/self/user_generated_tokens` works with the token itself, and each item includes the
  visible start of the token (`visible_token`), which lets us find our own.
- `PUT /api/v1/users/self/tokens/:id` with `token[expires_at]` works with the token itself, without generating
  a new one.
- The requested expiry cannot exceed **30 days from now** (400 "Expiration date cannot be more than 30 days in
  the future"). The page's `ENV` mentions 90 days, but the API enforces 30.

## Decision

1. `RemoteConnector` gains an optional `renewSecret`. On every `grant_type=refresh_token`, `handleToken()`
   calls `renewSecretQuietly()` before responding; a renewal failure only becomes a log warning and the refresh
   proceeds.
2. For Canvas, `renewCanvasToken()` lists the tokens, finds its own by `visible_token` and extends the expiry
   to now + 30 days − 1 hour (`TOKEN_RENEWAL_SECONDS`), only if it expires more than a day before that (at most
   one `PUT` per day). A token with no expiry or a later one is left untouched.
3. The token is not regenerated: the sealed secret stays the same and nothing else needs to change.

## Alternatives considered

| Alternative                                | Why not                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| Regenerate the token (`token[regenerate]`) | Changes the secret; would require issuing new OAuth tokens and brings no gain. |
| Create a new token on every renewal        | Leaves orphan tokens in the user's account and also changes the secret.        |
| 90-day token and reconnect every 3 months  | The API refuses more than 30 days; and it would still force reconnecting.      |
| Renew on a schedule (Cron Trigger)         | The Worker stores no tokens (stateless); it only sees them when Claude calls.  |

## Consequences

- Positive: anyone who uses the connector at least once every 30 days no longer reconnects.
- Negative / accepted costs: one extra `GET` to Canvas per refresh (about 1 per hour of use); if the user goes
  more than 30 days without using it, the token expires and they reconnect as before; depends on PUC still
  allowing the `PUT` with the token itself.
- Docs that change: PROCESSES (P08 step 7, P09), FUNCTIONS, connector README, ROADMAP (F2.8), CHANGELOG.
