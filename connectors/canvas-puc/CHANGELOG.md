# Changelog — canvas-puc

Plugin and remote server versions of the Canvas connector (ADR 0022). The repository changelog is
[`CHANGELOG.md`](../../CHANGELOG.md).

## Unreleased

### Added

- `list_peer_reviews`: peer reviews the student must do (pending and completed), with course, assignment, review
  due date, reviewee (Canvas hides the name when the instructor made the reviews anonymous), the URL or files the
  reviewee sent and the link to the review page. Without `course_id` it sweeps every active course; read-only.

### Fixed

- `upcoming_assignments` starts at 00:00 of today (São Paulo time) instead of "now", so a peer review or
  assignment due earlier today is no longer left out; peer reviews come as `type: "peer_review"` with a
  `status`.
- Every Canvas call now times out after 30 s with a clear message instead of hanging.

## [3.2.0](https://github.com/temponi-bernardo/claude-connectors/compare/canvas-puc-v3.1.0...canvas-puc-v3.2.0) (2026-11-23)

### Added

- `/planejamento-faculdade` skill: builds and updates the "Plano do Semestre AAAA/S" artifact (risk per course, today and
  tomorrow, day-by-day study plan, course cards with a points bar, timeline, questions for instructors) from
  Canvas plus the optional `gmail` and `whatsapp` plugins, read-only; persistent checklists with stable ids
  (browser + artifact database); `scripts/plan.mjs` validates, builds and extracts the page; offers three daily
  routines (ADR 0030).
- `prepare_attachment_upload`: returns a one-time `curl` that uploads a local file (up to 25 MB) straight to
  Canvas, with no base64 in the call; `send_message` and `reply_message` take its `id` in `file_ids` (ADR 0028).
- `file_ids` on `send_message` and `reply_message`: attach Canvas files by id; files outside "conversation
  attachments" are copied there first.
- `send_message` and `reply_message` take attachments (up to 5 files of 5 MB, text or base64), uploaded to the
  "conversation attachments" folder before sending; a refused or failed file sends nothing.
- `/write-access`: a read-only connection turns writing on (or off) from a link, without a new Canvas token.
- Public `GET /tools` (the server's `tools/list`) for the post-deploy smoke test.

### Changed

- Write tools are always listed; when writing is off they answer why and how to turn it on instead of
  disappearing (ADR 0027).
- `reply_to_conversation` is now `reply_message`.

### Fixed

- `find_recipients` promised a `send_message` that read-only connections could not see.

## 3.1.0 (2026-11-18)

### Added

- Links and media of assignments, pages, forums and announcements: the text keeps `title [link N]` marks and a new
  `links` field lists embedded files, videos, images, pages and external links; `raw_html: true` returns the
  original HTML (ADR 0025).
- `list_linked_files(course_id)`: every file and video the course content points to, once per file id.
- `list_files` takes `include_linked: true` and always notes that hidden files are not listed.
- Inbox tools: `find_recipients`, `list_conversations`, `get_conversation`, `send_message` and
  `reply_to_conversation` (writes only with confirmation).

### Changed

- `download_file` and `read_file_text` open files hidden from `list_files`, by `file_id` or Canvas file `url`,
  trying the course, global and verifier endpoints, with a clear error per endpoint.
- `download_file` handles files up to 70 MB, streamed, in parts of 8 MB (ADR 0023, 0024).
- A 401 that only denies one resource is no longer reported as an expired token.
