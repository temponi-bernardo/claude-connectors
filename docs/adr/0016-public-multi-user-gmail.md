# 0016 — Public, multi-user remote Gmail

- **Status:** Superseded in part by 0019 (login asks for `gmail.modify` instead of `gmail.readonly`)
- **Date:** 2026-11-14
- **Related:** supersedes in part ADR 0014 (items 3 and 4: mandatory allowlist and linking through the
  allowlist)

## Context

The repository is public and the `gmail` plugin shows up in the marketplace for anyone. ADR 0014 designed the
connector for a single owner: `ALLOWED_EMAILS` mandatory and linked accounts in a single KV space. Anyone who
installed the plugin could not sign in, and if the allowlist were opened everyone would see the same accounts.
The cost constraint still holds: the Worker only runs when a request arrives and can sit idle at no cost.

## Decision

1. **Everyone who installs is a user.** Google login happens in Claude's own OAuth, after installing the
   connector. The user is the `id_token`'s `sub` (stable, unlike the email) and goes into the grant `props`
   together with the email and a session id.
2. **Login already links the account.** Login asks for `openid email gmail.readonly` with offline access; if
   Google grants Gmail and the refresh token, the account joins the user's accounts. A failed write does not
   block the login.
3. **Per-user accounts, in a single record.** `owner:<sha256(sub)>` holds the user's accounts sealed with
   AES-256-GCM (`TOKEN_ENC_KEY`), with the `sub` inside the seal and checked on read. One KV read per tool
   call; writes only when linking, unlinking or revoking. Up to 10 accounts per user.
4. **More accounts through a single-use link.** The `link_account` tool generates `/accounts/link?ticket=...`:
   a seal with the user, a 10-minute expiry and a `jti` marked in KV on first use. Without a valid ticket,
   `/accounts/link` does nothing. The rest of linking (`__Host-` cookie, PKCE, `nonce`, `id_token`) is ADR 0014's.
5. **`unlink_account`** removes the account from the record and revokes the refresh token at Google (best
   effort).
6. **`ALLOWED_EMAILS` becomes optional:** without it the connector is public; with it, only the listed emails
   get in (private mode, 403 for everyone else).
7. **Per-IP limit on public routes** (registration, `/authorize`, `/token`, linking and callback): the
   `RATE_LIMITER_PUBLIC` binding, 30 requests per minute per IP. `/mcp` keeps the per-session limit (120/min).
   Both bindings count at the edge, with no KV and nothing running between requests.
8. **Per-user aliases:** the part before the `@`; if two of the same user's accounts collide, the full email is
   used. `account` accepts an alias, an email or `all`.

## Alternatives considered

| Alternative                                      | Why not                                                                                      |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Keep the allowlist mandatory                     | The public plugin would work for no one but the owner.                                       |
| Open linking at `/accounts/link` (no ticket)     | No way to know which Claude user the account belongs to.                                     |
| Store the accounts in the grant `props`          | Every Claude reconnect would lose the extra accounts; `props` do not change off refresh.     |
| One KV key per account (`owner:<sub>:<account>`) | Listing needs `kv.list` (billed separately and eventually consistent); one record is enough. |
| Per-IP limit with a KV counter                   | One KV write per request; the rate limiting binding writes nothing.                          |

## Consequences

- Positive: anyone installs and uses it with their own accounts; data isolated per user; the owner can close
  the connector with `ALLOWED_EMAILS`; cost is still per request only.
- Negative / accepted costs: `gmail.readonly` is a **restricted** Google scope. Until the app is verified,
  Google shows the unverified-app warning and caps it at **100 users**. Truly opening it to the public requires
  Google verification (privacy policy with Limited Use, demo video) and the annual security assessment (CASA).
  That process belongs to the project owner, outside the code.
- The minimal Workers runtime types live in a single `src/remote/cloudflare-workers.d.ts`, shared with WhatsApp
  (formerly `connectors/gmail/src/workers-env.d.ts`, mentioned in ADR 0014), because two declarations of the
  `cloudflare:workers` module clash.
- Docs that change: PROCESSES (P10–P12), FUNCTIONS, ARCHITECTURE (secrets), connector README, site (privacy
  with Gmail and the Limited Use statement), CHANGELOG, `.env.example`.
