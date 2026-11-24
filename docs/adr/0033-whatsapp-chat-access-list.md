# 0033 — WhatsApp chat access list managed by the owner on `/pair`

- **Status:** Accepted
- **Date:** 2026-11-24
- **Related:** ADR 0015 (sending on, `SEND_ALLOWLIST`), ADR 0027 (gated tools stay listed)

## Context

The owner wants to choose which contacts and groups Claude may read and message, from the connector's own
interface, instead of opening the whole WhatsApp. `SEND_ALLOWLIST` only restricts sending, and only through a
Worker variable that needs a redeploy to change.

## Decision

1. **Access list** with two modes: `all` (every chat, the behavior before this ADR and the default while nothing
   was saved) and `selected` (only the listed chats). Each entry is a contact or group JID with a display name; at
   most 200 entries.
2. **Storage:** the `WhatsAppBridge` Durable Object storage (`access-list`), served by the internal route
   `/__access` (GET reads, PUT saves). It never wakes the container. A corrupt stored value fails closed (mode
   `selected`, nothing allowed).
3. **Managed only by the owner on `/pair`** ("Chat access": mode, allowed chats with Remove, and a search of chats
   and contacts with Allow), behind the existing GitHub login, anti-CSRF token and `Origin` check. There is **no
   MCP tool that changes the list**: a prompt injection in a message could otherwise widen its own access. The
   read-only `get_access_list` tool shows the list and where to manage it.
4. **Enforced in the Worker tools**, in mode `selected`:
   - `get_messages`, `get_media` and `send_message` refuse a chat outside the list before waking the container;
   - `search_messages` refuses a `chat_jid` outside the list and, without one, asks the bridge for up to 100
     results and keeps only allowed chats, with a `warning` suggesting `chat_jid` when that window was full and
     fewer results than asked were left;
   - `list_chats` and `search_contacts` still list everything (so Claude can help the owner pick chats), but
     `list_chats` flags `allowed` and hides the last-message preview of chats outside the list.
5. `SEND_ALLOWLIST` stays as a deploy-time ceiling: a send must pass both lists.

## Consequences

- Positive: the owner narrows Claude to the chats they choose without a redeploy; message content of other chats
  never reaches the model in mode `selected`.
- Negative: one extra Durable Object call per tool call (no container wake-up). Matching is by exact JID: a
  contact allowed by number (`@s.whatsapp.net`) does not cover the same person's `@lid` chat, so the owner allows
  the chat as it appears in the search.
- Neutral: chat names and JIDs (metadata) stay visible to `list_chats` and `search_contacts` in both modes.
