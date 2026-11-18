# Changelog — canvas-puc

Plugin and remote server versions of the Canvas connector (ADR 0022). The repository changelog is
[`CHANGELOG.md`](../../CHANGELOG.md).

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
