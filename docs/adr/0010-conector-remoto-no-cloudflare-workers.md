# 0010 — Conector remoto hospedado no Cloudflare Workers

- **Estado:** Aceito
- **Data:** 2026-11-05
- **Relacionado:** F2.7, substitui em parte a ADR 0009 (item 7, hospedagem)

## Contexto

A ADR 0009 publicava o servidor remoto por Docker, com um blueprint do Render. O plano grátis do Render dorme
depois de 15 minutos sem uso e a primeira chamada leva cerca de 1 minuto, tempo em que o Claude pode desistir.
O dono já tem conta e conector da Cloudflare e prefere o Workers. O handler remoto já usa `Request`/`Response`
(Web padrão), que é a interface nativa do Workers.

## Decisão

1. O conector remoto do Canvas é publicado no **Cloudflare Workers** com `npm run worker:deploy`
   (`connectors/canvas-puc/wrangler.toml`, entrada `src/worker.ts`, flag `nodejs_compat` para `node:crypto`).
2. `SEAL_KEY` é um _secret_ do Worker (`wrangler secret put`); `CANVAS_BASE_URL` e `CANVAS_ALLOW_WRITE` ficam em
   `[vars]`. Sem `PUBLIC_URL`, o emissor OAuth é a origem da requisição (`*.workers.dev`).
3. O deploy é manual (depois do merge), com `CLOUDFLARE_API_TOKEN` no ambiente: o conector da Cloudflare do
   Claude não publica Workers e o projeto não usa CI (ADR 0006).
4. O `render.yaml` sai. O `Dockerfile` e o `server/remote.js` continuam para quem quiser outro host.

## Alternativas consideradas

| Alternativa              | Por que não                                                                |
| ------------------------ | -------------------------------------------------------------------------- |
| Manter o Render          | Dorme no plano grátis; a primeira chamada pode estourar o tempo do Claude. |
| Google Cloud Run         | Pede cartão e configuração do `gcloud`; sem vantagem sobre o Workers aqui. |
| Deploy automático por CI | Não há GitHub Actions (ADR 0006).                                          |

## Consequências

- Positivas: sem servidor dormindo, HTTPS e domínio prontos, bundle de ~164 KiB comprimido, plano grátis.
- Negativas / custos aceitos: deploy manual depois de cada merge que mexe no conector; o `fetch` global precisa
  ser chamado sem `this` de outro objeto (ver `readCanvasRemoteSettings()`); dependência de dev nova (`wrangler`); o `fetch` do Workers não manda `User-Agent` e o Canvas responde 403 sem ele (`withCanvasUserAgent()`, PR #13).
- Publicado em 2026-11-05 em `https://canvas-puc-remote.bftemponi.workers.dev` e conectado no claude.ai (F2.7). A página de login precisa liberar a origem do retorno no `form-action` da CSP, senão o navegador barra o 302 (`pageSecurityPolicy()`, PR #14).
- O que muda nos docs: ARCHITECTURE (formato de instalação e serviços), STRUCTURE (`wrangler.toml`), PROCESSES
  (P08), WORKFLOW e CLAUDE.md (`worker:dev`, `worker:deploy`), README do conector, `.env.example`.
