# 0026 — Canvas file submissions from the tool call

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** ADR 0010, ADR 0025

## Context

Many PUC Minas assignments only accept uploads (`submission_types: ["online_upload"]`), e.g. assignment 1408620
of course 294409, which asks for a `.txt` report. The connector only had `submit_text_assignment` (text or URL), so
the `prepare-submission` skill sent students to Canvas to upload by hand. The server runs remotely on Cloudflare
Workers: it cannot read the user's disk, so the bytes must reach it some other way.

## Decision

1. A new write tool, `submit_file_assignment`, receives the file inside the call: `file_name`, `content` and
   `encoding` (`text` by default, for `.txt`, `.md`, code; or `base64` for anything else), plus an optional
   `content_type` (guessed from the extension otherwise). The limit is `MAX_UPLOAD_MB` = 5 MB, since every byte
   travels through the model's tool call.
2. Before uploading anything, the tool reads the assignment and refuses when `submission_types` lacks
   `online_upload`, the extension is outside a non-empty `allowed_extensions` (case-insensitive) or the file is
   empty or above the limit.
3. It follows Canvas's upload flow: `POST /courses/:c/assignments/:a/submissions/self/files` (name, size, type) →
   multipart `POST` to the returned `upload_url` with `upload_params` first and the file last, **without** the
   Canvas token and with `redirect: 'manual'` → a 2xx answer is the file; a 3xx is confirmed with an authenticated
   `POST` to its `Location` → `POST .../submissions` with `submission_type: online_upload` and `file_ids`.
4. Like every write tool, it is only registered with `CANVAS_ALLOW_WRITE`, carries `SEND_HINTS` and its
   description asks Claude to confirm with the user first.

## Alternatives considered

| Alternative                               | Why not                                                                           |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| Fetch the file from a URL the user gives  | Opens the server to arbitrary hosts (SSRF, ADR 0025); files rarely have a URL     |
| Canvas's "upload via URL" (`url` param)   | Same SSRF concern moved to Canvas, and asynchronous (needs status polling)        |
| A larger limit (e.g. 70 MB like download) | The bytes come through the model's output; large base64 is impractical and costly |
| Read the file from disk (stdio server)    | The connector is remote-only (ADR 0013)                                           |

## Consequences

- Positive: upload-only assignments can be submitted from the conversation; refusals come before any upload.
- Negative / accepted costs: files above 5 MB still go through Canvas itself; the Docker/Node server caps request
  bodies at 1 MB (`MAX_BODY_BYTES`), so there the practical limit is lower; base64 files cost model tokens.
- Docs that change: PROCESSES (P03), FUNCTIONS, Canvas README, `prepare-submission` skill, CHANGELOG.
