# 0028 — Canvas message attachments by reference and direct upload

- **Status:** Accepted
- **Date:** 2026-11-19
- **Related:** ADR 0026, ADR 0027

## Context

`send_message` and `reply_message` only took attachments inside the tool call (text or base64, ADR 0026's model).
A real case failed: a 189 KB zip on the user's computer becomes about 252,000 base64 characters, which a model
cannot transcribe into a tool call reliably. A corrupted attachment would reach the teacher unopenable, so the
message was not sent at all. Canvas only attaches files that live in the sender's `conversation attachments`
folder.

## Decision

1. **`file_ids` on `send_message` and `reply_message`.** Canvas file IDs the user can access. Every file is read
   first (`GET /files/:id`); a file outside `conversation attachments` is copied there
   (`POST /folders/:id/copy_file`, rename on clash) before sending. Inline files and ids share the limit of 5.
2. **`prepare_attachment_upload`.** It runs upload step 1 into `conversation attachments` and returns a `curl`
   command. Claude runs it where the file is. The bytes go straight to Canvas's file store and never pass through
   Claude's context or the Worker. Canvas (inst-fs) answers `201` with the file JSON, and its `id` goes in
   `file_ids`. The limit is 25 MB (`MAX_DIRECT_UPLOAD_MB`), since the Worker holds nothing.
3. The command sends Canvas's fields with `--form-string`, so no value can make `curl` read a local file. Every
   value is single-quoted.
4. The tool is gated like the other write tools (ADR 0027), with `CREATE_HINTS`: it only creates a private file
   and sends nothing to anyone.

## Consequences

- Any local binary up to 25 MB can be attached without base64, if Claude can run `curl` on the machine with the
  file. Otherwise the user uploads it to Canvas and Claude passes the id.
- The returned slot carries a short-lived, single-use upload token. It only allows that one upload into the user's
  own folder.
- If Canvas ever answers the upload with a 3xx that needs an authenticated confirmation, the file stays pending.
  This was not seen on PUC Minas (inst-fs answers 201); the tool would need a confirm step then.
- Checked against the live Canvas: a zip uploaded with the returned `curl` and a file copied from another folder
  were both attached to a sent message (conversation 11571696).
