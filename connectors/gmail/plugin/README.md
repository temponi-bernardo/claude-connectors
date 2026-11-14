# gmail plugin

Claude plugin for multi-account Gmail. It connects Claude to the remote MCP server at
`https://gmail-remote.bftemponi.workers.dev/mcp` (see `.mcp.json`) and adds usage skills in `skills/`.
Nothing runs on your computer. The server code and the full guide live one folder up, in
[`connectors/gmail/`](../README.md).

## Install

```
/plugin install gmail --marketplace temponi-bernardo/claude-connectors
```

## Skills

- `/setup-gmail` — guided setup (connection, accounts and test).
- `/triage-inbox` — inbox of every linked account, by priority.
- `/find-document` — bank slips, invoices, receipts and contracts, with the attachment data.
- `/summarize-thread` — thread summary, open items and a draft reply.
