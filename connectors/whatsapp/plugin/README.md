# whatsapp plugin

Claude plugin for personal WhatsApp, self-hosted. It ships only usage skills in `skills/`: each person publishes
their own server on Cloudflare and adds it as a custom connector (ADR 0018). The server code and the full guide
live one folder up, in [`connectors/whatsapp/`](../README.md).

## Install

```
/plugin install whatsapp --marketplace temponi-bernardo/claude-connectors
```

## Skills

- `/setup-whatsapp` — guided setup (own server, connector, pairing and test).
- `/whatsapp-summary` — what happened in chats and groups in the period.
- `/whatsapp-pending` — chats waiting for your reply.
- `/search-whatsapp` — address, PIX key, link, document or media in the messages.
