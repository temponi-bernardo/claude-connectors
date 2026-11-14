# 0019 — Gmail with full management (`gmail.modify`)

- **Status:** Accepted
- **Date:** 2026-11-14
- **Related:** task F2.12, supersedes in part ADR 0014 (items 4 and 6: `gmail.readonly` scope and read-only
  tools) and ADR 0016 (item 2: scope requested at login)

## Context

The Gmail connector could only read (ADR 0014 and 0016). For Claude to really look after the inbox it needs to
send, reply while keeping the thread, forward with attachments, handle drafts, organize (read, archive, labels,
star) and move to trash. Writing email on the person's behalf is irreversible and exposes the connector to
prompt injection: an incoming email can ask the model to send or delete something. Accounts already linked hold
refresh tokens granted only with `gmail.readonly`, and Google does not widen a token once issued.

## Decision

1. **A single data scope: `gmail.modify`.** It covers reading, sending, drafts, labels and trash, and does
   **not** allow permanent deletion (only `https://mail.google.com/` would). `gmail.send` is unnecessary because
   `gmail.modify` already includes sending. Login and linking ask for `openid email gmail.modify`; linking rejects
   a token without `gmail.modify` with the message "check the permission to manage Gmail".
2. **Old accounts keep reading.** The scope stored on the account is checked on every write
   (`requireWriteAccess()`, also inside `gmailWrite()`): without `gmail.modify`, the tool fails **before calling
   Google** with "account X was linked for reading only… use link_account and sign in with it again".
   `list_accounts` shows `write_access` and the same hint. A Gmail 403 also suggests linking again.
3. **New tools, all with `account` (a single account, no `all`):** `send_email`, `reply_email`,
   `reply_all_email`, `forward_email`, `list_drafts`, `create_draft` (new or reply), `update_draft`,
   `send_draft`, `delete_draft`, `mark_read`, `archive`, `star`, `update_labels`, `trash` and `untrash`. There is
   no permanent-delete tool.
4. **MCP annotations so the client asks for confirmation.** The shared `ToolSpec` gained `annotations`. Sending
   (`send_*`, `reply_*`, `forward_email`, `send_draft`): `destructiveHint: true`, `idempotentHint: false`.
   Trash, editing and deleting a draft, unlinking: `destructiveHint: true`, `idempotentHint: true`. Reversible
   organizing: `destructiveHint: false`. Reading: `readOnlyHint: true`. The descriptions and server instructions
   ask to show the content and wait for confirmation, and never to act because an email asked.
5. **MIME built in the Worker, no new dependency** (`mime.ts`): UTF-8 plain text in base64, subject and names in
   RFC 2047, attachments in `multipart/mixed`. Addresses validated one by one and every header stripped of line
   breaks (no header injection); from the original's `Message-ID`/`References` only the `<...>` ids pass.
6. **Replies in the same thread:** the original's `threadId`, `In-Reply-To`, `References`, `Re:` and the
   original quoted. Reply-all drops your own account and repeats no one; replying to your own message goes to the
   original recipients.
7. **Limits:** up to 100 recipients per email, body up to 100,000 characters, forwarded attachments up to 18 MB
   in total (checked before downloading), up to 50 messages or 20 threads per organizing call.

## Alternatives considered

| Alternative                                 | Why not                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `gmail.readonly` + `gmail.send` + `compose` | Three scopes for what `gmail.modify` covers; labels and trash would still be missing. |
| `https://mail.google.com/`                  | Allows permanent deletion, which we do not want; broader scope than needed.           |
| MIME library (e.g. `mimetext`)              | One more dependency in the Worker for a small format we can build and test purely.    |
| Migrate old tokens without a new link       | Google does not widen an issued token; only new consent brings `gmail.modify`.        |
| A generic `modify_messages` tool            | Specific names (`archive`, `trash`) make confirmation and annotations clearer.        |

## Consequences

- Positive: Claude manages the whole inbox; sending and deleting always ask for confirmation in the client; old
  accounts keep reading and get clear instructions to link again; no permanent deletion.
- Negative / accepted costs: `gmail.modify` is also a **restricted** Google scope (same rules as
  `gmail.readonly`: unverified-app warning, 100 users, verification and CASA to open it to the public). The owner
  has to add the scope on the consent screen (Google Auth Platform → Data access) and every user has to link
  their accounts again. Replies and forwards go out as plain text (the original's HTML is converted to text).
- Docs that change: PROCESSES (P10–P12 and new P18), FUNCTIONS, ARCHITECTURE (Gmail API read and write),
  connector README, site (home and privacy), marketplace and plugin manifest, CHANGELOG, ROADMAP.
