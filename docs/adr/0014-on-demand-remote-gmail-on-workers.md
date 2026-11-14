# 0014 — Gmail remoto multi-conta, só leitura, sob demanda no Cloudflare Workers

- **Estado:** Substituído em parte por 0016 e 0019 (escopo e ferramentas só de leitura: ver ADR 0019)
- **Data:** 2026-11-14
- **Relacionado:** ADR 0009, ADR 0010, ADR 0013

## Contexto

O dono tem duas contas Gmail (a principal e a de recibos de música) e quer que o Claude (claude.ai, app e
Cowork) leia as duas. O conector oficial de Gmail do claude.ai aceita uma conta só. O plano é o Workers Paid
(US$ 5/mês) e **nada pode ficar rodando continuamente**: sem Containers, Cron Triggers, alarms de Durable Object,
polling ou keep-alive. Diferente do Canvas (ADR 0009), aqui há credencial de longa duração que precisa ser
guardada no servidor: o refresh token do Google de cada conta, vinculado uma vez e usado por todas as sessões.

## Decisão

1. **Worker sob demanda, MCP sem estado.** `connectors/gmail/` é remoto e vira plugin do marketplace como o Canvas (ADR 0013). Cada requisição monta
   um `McpServer` novo e responde em JSON (`serveMcpRequest()`, o mesmo do Canvas); sem Durable Object. Estado só
   no **Workers KV**. O módulo principal (`src/index.ts`) exporta só o `default`: o runtime trata cada export
   nomeado como entrypoint e recusa constantes (achado no teste com `wrangler dev`).
2. **OAuth 2.1 com `@cloudflare/workers-oauth-provider`** (DCR, PKCE S256, tokens e grants no KV `OAUTH_KV`),
   em vez do OAuth selado sem estado do Canvas. Motivos: aqui o KV já é obrigatório; a biblioteca dá código de uso
   único, rotação e revogação de refresh token e os auxiliares de consentimento contra _confused deputy_ (handle
   e `state` de uso único presos ao navegador por cookie `__Host-`, página sem frame). O registro dinâmico só
   aceita retorno em `claude.ai`, `claude.com` ou `localhost` (`isAllowedRedirect()`, reaproveitado do ADR 0009).
3. **Login do dono pelo Google com allowlist.** `/authorize` mostra o consentimento por cliente (lembrado por
   30 dias em cookie assinado com `CONSENT_SECRET`), vai ao Google só com `openid email` e, na volta, valida o
   `id_token` (assinatura RS256 pelo JWKS do Google, emissor, audiência, validade, `nonce`, e-mail verificado).
   E-mail fora de `ALLOWED_EMAILS` recebe **403** e nenhum código.
4. **Vínculo de conta separado** em `/accounts/link`: Google com `gmail.readonly` + `openid email`,
   `access_type=offline` e `prompt=consent`, `state` (prefixo `link.`) de uso único guardado no KV só pelo hash e
   preso ao navegador por cookie `__Host-gmail-link`, PKCE S256 e `nonce`. Só e-mail da allowlist com `id_token`
   válido e escopo do Gmail concedido grava o refresh token. Um único retorno `/google/callback` atende os dois
   fluxos (o `state` da biblioteca nunca tem ponto).
5. **Refresh token cifrado** com AES-256-GCM (`sealPayload()` de `src/remote/seal.ts`, chave `TOKEN_ENC_KEY`),
   com o e-mail dentro do selo e conferido na leitura. Access tokens ficam só na memória do isolate até 1 min
   antes de vencer. `invalid_grant` marca a conta como revogada e a ferramenta pede novo vínculo.
6. **Ferramentas só de leitura** com `account` (`all` onde faz sentido), ids validados contra injeção de
   caminho, respostas limitadas (20 mil caracteres por mensagem, 60 mil por conversa, anexos até 5 MB e 50 mil
   caracteres) e aviso de conteúdo não confiável nas descrições e em cada resultado (prompt injection).
   `get_attachment_text` lê PDF (`src/core/pdf.ts`, sem dependência), Word, HTML e texto, detectando o tipo pelos
   bytes, porque o `attachmentId` do Gmail muda a cada leitura.
7. **Limite por sessão** com o binding de rate limiting do Workers (120 req/min por grant): contador na borda,
   sem escrita no KV.
8. **Google Cloud em "In production"** (app External, não verificado, uso pessoal) para o refresh token não
   vencer em 7 dias; cliente Web com retorno `https://<worker>/google/callback`.
9. **Testes em Node, não em `@cloudflare/vitest-pool-workers`:** a versão atual dele exige Vitest 4 e o
   repositório usa Vitest 5. A biblioteca OAuth roda nos testes com `cloudflare:workers` trocado por um
   substituto (alias no `vitest.config.ts`), KV em memória e Google falso com chaves RSA reais; o runtime real é
   conferido com `wrangler dev`. Os tipos do Workers usados pela biblioteca ficam num `.d.ts` mínimo
   (`workers-env.d.ts`), porque `@cloudflare/workers-types` colide com `@types/node` no `tsconfig` único.

## Alternativas consideradas

| Alternativa                                  | Por que não                                                                                           |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| AnythingMCP em Cloudflare Container          | Cold start de container, Postgres externo e custo contínuo; viola "nada rodando continuamente".       |
| `McpAgent` (Durable Object com estado)       | Nenhuma ferramenta precisa de sessão; DO acrescenta custo e complexidade sem ganho.                   |
| OAuth selado sem estado do Canvas (ADR 0009) | Sem revogação nem código de uso único; o KV já é necessário para os refresh tokens.                   |
| Usar o login do Claude para vincular a conta | Misturaria identidade do dono com cada conta Gmail; vincular separado deixa a segunda conta opcional. |
| Guardar o refresh token nos `props` do grant | Cada reconexão do Claude perderia o vínculo; as contas valem para todas as sessões.                   |
| Biblioteca de PDF (pdf.js/unpdf)             | ~1 MB a mais no bundle e CPU alta por requisição; recibos são PDFs de texto simples.                  |
| `@cloudflare/vitest-pool-workers`            | Exige Vitest 4; rebaixar o repositório inteiro só por este pacote não compensa.                       |

## Consequências

- Positivas: as duas contas no claude.ai, no Cowork e no celular; nenhum processo ocioso; custo dentro do plano
  (algumas escritas de KV por login/vínculo); tokens revogáveis; segredos só em `wrangler secret`.
- Negativas / custos aceitos: o app do Google não verificado mostra um aviso no login (uso pessoal); trocar a
  `TOKEN_ENC_KEY` obriga a vincular as contas de novo; PDF escaneado ou com fontes sem ToUnicode não tem texto;
  deploy manual (ADR 0010); dependência de runtime nova (`@cloudflare/workers-oauth-provider`).
- O que muda nos docs: ARCHITECTURE (conector, serviços, dependência), STRUCTURE (`connectors/gmail/`), PROCESSES
  (P10–P12), WORKFLOW e CLAUDE.md (`gmail:dev`, `gmail:deploy`, escopo `gmail`), UI (páginas do Gmail),
  README do conector, CHANGELOG e ROADMAP.
