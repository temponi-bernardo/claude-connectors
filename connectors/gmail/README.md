# Gmail remoto (multi-conta, só leitura)

Conector MCP remoto que deixa o Claude (claude.ai, app e Cowork) **ler** duas ou mais contas Gmail. Roda no
Cloudflare Workers **só quando chega uma requisição**: sem Containers, Cron Triggers, alarms ou polling. Estado
no Workers KV. Decisão e alternativas em [ADR 0014](../../docs/adr/0014-gmail-remoto-sob-demanda-no-workers.md).

## Como funciona

| Rota                                | Quem usa           | Faz                                                               |
| ----------------------------------- | ------------------ | ----------------------------------------------------------------- |
| `/mcp`                              | Claude             | Ferramentas MCP (exige o token OAuth emitido por este Worker)     |
| `/register`, `/authorize`, `/token` | Claude             | OAuth 2.1 com registro dinâmico e PKCE (`workers-oauth-provider`) |
| `/accounts/link`                    | Você, no navegador | Vincula uma conta Gmail (uma vez por conta)                       |
| `/google/callback`                  | Google             | Retorno do login e do vínculo                                     |

- **Login no conector:** ao adicionar o conector, você aprova o acesso e entra com o Google (só `openid email`).
  E-mail fora de `ALLOWED_EMAILS` recebe **403**.
- **Vínculo de contas:** em `/accounts/link` você entra com cada conta e concede `gmail.readonly`. O refresh
  token fica no KV cifrado com AES-256-GCM (`TOKEN_ENC_KEY`); os access tokens são renovados sozinhos.
- **Apelido da conta:** a parte antes do `@` de cada e-mail de `ALLOWED_EMAILS` (ex.: `fulano@gmail.com` →
  `fulano`). É o valor do parâmetro `account`; `all` consulta todas onde faz sentido.

## Ferramentas (só leitura)

| Ferramenta            | Parâmetros                                                 | Observação                                    |
| --------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| `list_accounts`       | —                                                          | Contas, vínculo e status do token             |
| `search_threads`      | `account` (ou `all`), `query`, `max_results`, `page_token` | Sintaxe de busca do Gmail; até 25 por conta   |
| `get_thread`          | `account`, `thread_id`, `format` (`text` ou `minimal`)     | Texto plano (HTML convertido), corpo limitado |
| `get_message`         | `account`, `message_id`                                    | Corpo, cabeçalhos e lista de anexos           |
| `list_labels`         | `account` (ou `all`)                                       | Rótulos de sistema e do usuário               |
| `get_attachment_text` | `account`, `message_id`, `attachment_id`                   | PDF, Word, HTML ou texto; até 5 MB; sem OCR   |

O conteúdo dos e-mails é tratado como **dado não confiável**: as descrições e cada resultado avisam o modelo
para não seguir instruções que venham dentro de um e-mail.

## 1. Google Cloud (uma vez)

1. Em [console.cloud.google.com](https://console.cloud.google.com), crie um projeto (ex.: `claude-gmail`).
2. **APIs e serviços → Biblioteca → Gmail API → Ativar.**
3. **Tela de consentimento OAuth** (Google Auth Platform):
   - Tipo de usuário **Externo**; nome do app, e-mail de suporte e de contato do desenvolvedor.
   - **Acesso a dados → Adicionar escopos:** `openid`, `.../auth/userinfo.email` e
     `https://www.googleapis.com/auth/gmail.readonly`.
   - **Público → Publicar app** para o estado **"Em produção"**. Sem isso o refresh token vence em 7 dias.
     O app fica "não verificado": no login o Google mostra um aviso; clique em **Avançado → Acessar** (uso
     pessoal, só as suas contas da allowlist conseguem usar o conector).
4. **Clientes → Criar cliente → Aplicativo da Web**:
   - **URIs de redirecionamento autorizados:** `https://gmail-remote.<sua-conta>.workers.dev/google/callback`
     (troque `<sua-conta>` pelo subdomínio `workers.dev` da sua conta Cloudflare; é o mesmo do Canvas, ex.:
     `canvas-puc-remote.<sua-conta>.workers.dev`).
   - Guarde o **ID do cliente** e a **chave secreta**.

## 2. Cloudflare (no seu Mac, na raiz do repositório)

```sh
git pull && npm ci
npx wrangler login                 # ou exporte CLOUDFLARE_API_TOKEN

# KV: copie cada "id" impresso para connectors/gmail/wrangler.toml (OAUTH_KV e GMAIL_KV)
npx wrangler kv namespace create OAUTH_KV --config connectors/gmail/wrangler.toml
npx wrangler kv namespace create GMAIL_KV --config connectors/gmail/wrangler.toml

# Primeiro deploy (cria o Worker; até os secrets existirem, as rotas respondem 500 dizendo qual falta)
npm run gmail:deploy

# Secrets (cada comando pede o valor no terminal; nada vai para o repositório; valem na hora, sem novo deploy)
npx wrangler secret put GOOGLE_CLIENT_ID --config connectors/gmail/wrangler.toml
npx wrangler secret put GOOGLE_CLIENT_SECRET --config connectors/gmail/wrangler.toml
node -e "console.log(crypto.randomBytes(32).toString('base64'))" | npx wrangler secret put TOKEN_ENC_KEY --config connectors/gmail/wrangler.toml
node -e "console.log(crypto.randomBytes(32).toString('base64url'))" | npx wrangler secret put CONSENT_SECRET --config connectors/gmail/wrangler.toml
npx wrangler secret put ALLOWED_EMAILS --config connectors/gmail/wrangler.toml   # e-mails separados por vírgula
```

O deploy imprime a URL (`https://gmail-remote.<sua-conta>.workers.dev`); confira que ela bate com o redirect do Google.
Teste: `curl https://gmail-remote.<sua-conta>.workers.dev/` responde `ok`.

> `TOKEN_ENC_KEY` não pode ser trocada sem vincular as contas de novo. Guarde-a num gerenciador de senhas se
> quiser recriar o Worker sem refazer o vínculo.

## 3. Adicionar no Claude

**Pelo marketplace (recomendado):** no Claude, "Adicionar marketplace" com `temponi-bernardo/claude-connectors`
e instale o plugin `gmail`. O `.mcp.json` dele aponta para `https://gmail-remote.bftemponi.workers.dev/mcp`; se o
seu subdomínio `workers.dev` for outro, use o conector personalizado abaixo.

**Como conector personalizado:**

1. claude.ai → **Configurações → Conectores → Adicionar conector personalizado**.
2. Nome: `Gmail (multi-conta)`; URL: `https://gmail-remote.<sua-conta>.workers.dev/mcp`.
3. **Conectar** → página "Conectar Claude ao Gmail?" → **Permitir** → entre com uma conta da allowlist.

O conector aparece também no app e no Cowork com a mesma conta do claude.ai.

## 4. Vincular cada conta Gmail

1. Abra `https://gmail-remote.<sua-conta>.workers.dev/accounts/link` no navegador.
2. Escolha a conta, marque a permissão de **ler e-mails** e confirme. A página diz "Conta vinculada".
3. Repita para a outra conta (de preferência numa aba anônima, para escolher a conta certa).
4. No Claude, peça "liste minhas contas do Gmail" (`list_accounts`): as duas devem aparecer com `status: ok`.

Se uma ferramenta disser que a conta "perdeu o acesso" (senha trocada, acesso revogado em
myaccount.google.com/permissions), repita o passo 4 para ela.

## Desenvolvimento

- `npm run gmail:dev` sobe o Worker localmente (secrets em `connectors/gmail/.dev.vars`, ignorado pelo git;
  nomes em `.env.example`).
- Testes: `npm test` (Node + Vitest, com a Gmail API e o Google simulados; ver ADR 0014 sobre o
  `vitest-pool-workers`).
- Fluxos detalhados: [PROCESSES.md](../../docs/PROCESSES.md) P10–P12.

## Segurança

- Nenhum segredo no repositório; tudo por `wrangler secret put`.
- OAuth do Claude com PKCE S256, consentimento por cliente e retorno limitado a `claude.ai`, `claude.com` e
  `localhost`; login e vínculo no Google com `state` de uso único, PKCE, `nonce` e `id_token` validado
  (assinatura RS256, emissor, audiência, validade e e-mail verificado).
- Cookies `__Host-`, `Secure`, `HttpOnly`, `SameSite=Lax`; páginas com CSP restritiva e sem frames.
- Nada de conteúdo de e-mail, tokens ou endereços nos logs.
- Limite de 120 requisições por minuto por sessão (binding de rate limiting, sem custo de KV).
