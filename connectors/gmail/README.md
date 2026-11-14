# Gmail remoto (várias contas, só leitura)

Conector MCP remoto que deixa o Claude (claude.ai, app, Cowork e Claude Code) **ler** uma ou mais contas Gmail
de quem o instala. É público e multiusuário: cada pessoa entra com a própria conta Google e só vê as contas que
ela mesma vinculou. Roda no Cloudflare Workers **só quando chega uma requisição**: sem Containers, Cron
Triggers, alarms ou polling, então ficar ocioso não custa nada. Estado no Workers KV. Decisões em
[ADR 0014](../../docs/adr/0014-gmail-remoto-sob-demanda-no-workers.md) e
[ADR 0015](../../docs/adr/0015-gmail-multiusuario-publico.md).

## Para quem vai usar

1. No Claude, adicione o marketplace `temponi-bernardo/claude-connectors` e instale o plugin **`gmail`** (ou
   adicione `https://gmail-remote.bftemponi.workers.dev/mcp` em Configurações → Conectores → Adicionar
   conector personalizado).
2. Ao conectar, clique em **Permitir** e entre com a sua conta Google, marcando a permissão de **ler e-mails**.
   Essa conta já fica vinculada.
3. Para mais contas, peça ao Claude: _"vincule outra conta do Gmail"_. Ele gera um link de uso único (vale 10
   minutos); abra no navegador e entre com a outra conta.
4. Pergunte normalmente: _"procure o recibo do FL Cloud em todas as minhas contas"_.
5. Para remover uma conta: _"desvincule a conta X"_. O conector apaga o token e revoga o acesso no Google.

Enquanto o app do Google não for verificado, a tela de login mostra o aviso **"O Google não verificou este
app"**: clique em **Avançado → Acessar**. O Google limita apps não verificados com Gmail a 100 usuários.

## Ferramentas

| Ferramenta            | Parâmetros                                                 | Observação                                    |
| --------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| `list_accounts`       | —                                                          | Suas contas vinculadas e status do token      |
| `link_account`        | —                                                          | Link de uso único para vincular outra conta   |
| `unlink_account`      | `account`                                                  | Apaga o token e revoga o acesso no Google     |
| `search_threads`      | `account` (ou `all`), `query`, `max_results`, `page_token` | Sintaxe de busca do Gmail; até 25 por conta   |
| `get_thread`          | `account`, `thread_id`, `format` (`text` ou `minimal`)     | Texto plano (HTML convertido), corpo limitado |
| `get_message`         | `account`, `message_id`                                    | Corpo, cabeçalhos e lista de anexos           |
| `list_labels`         | `account` (ou `all`)                                       | Rótulos de sistema e do usuário               |
| `get_attachment_text` | `account`, `message_id`, `attachment_id`                   | PDF, Word, HTML ou texto; até 5 MB; sem OCR   |

`account` é o apelido (parte antes do `@`; o e-mail inteiro se duas contas repetirem) ou o próprio e-mail. O
conteúdo dos e-mails é tratado como **dado não confiável**: descrições e resultados avisam o modelo para não
seguir instruções vindas de um e-mail.

## Como funciona

| Rota                                | Quem usa           | Faz                                                               |
| ----------------------------------- | ------------------ | ----------------------------------------------------------------- |
| `/mcp`                              | Claude             | Ferramentas (exige o token OAuth emitido por este Worker)         |
| `/register`, `/authorize`, `/token` | Claude             | OAuth 2.1 com registro dinâmico e PKCE (`workers-oauth-provider`) |
| `/accounts/link?ticket=...`         | Você, no navegador | Vincula mais uma conta (link gerado por `link_account`)           |
| `/google/callback`                  | Google             | Retorno do login e do vínculo                                     |

- **Usuário:** o id estável da conta Google do login (`sub`). Cada usuário tem um registro no KV
  (`owner:<sha256>`) com as contas dele, cifrado com AES-256-GCM (`TOKEN_ENC_KEY`).
- **Custo:** uma leitura de KV por chamada de ferramenta; escritas só ao vincular, desvincular e logar. Access
  tokens do Google ficam só na memória do isolate.
- **Limites:** 120 req/min por sessão no `/mcp` e 30 req/min por IP nas rotas públicas (bindings de rate
  limiting, sem KV).
- **Modo privado (opcional):** com o secret `ALLOWED_EMAILS`, só os e-mails listados entram; os demais recebem 403.

## Para quem vai hospedar (dono do Worker)

### 1. Google Cloud (uma vez)

1. Em [console.cloud.google.com](https://console.cloud.google.com), crie um projeto (ex.: `claude-gmail`).
2. **APIs e serviços → Biblioteca → Gmail API → Ativar.**
3. **Google Auth Platform → Branding:** nome do app, e-mail de suporte, página inicial
   `https://temponi-bernardo.github.io/claude-connectors/`, política de privacidade
   `https://temponi-bernardo.github.io/claude-connectors/privacidade.html` e termos
   `https://temponi-bernardo.github.io/claude-connectors/termos.html`.
4. **Público:** tipo **Externo** → **Publicar app** ("Em produção"). Sem isso o refresh token vence em 7 dias.
5. **Acesso a dados → Adicionar escopos:** `openid`, `.../auth/userinfo.email` e
   `https://www.googleapis.com/auth/gmail.readonly`.
6. **Clientes → Criar cliente → Aplicativo da Web**, com o URI de redirecionamento
   `https://gmail-remote.<sua-conta>.workers.dev/google/callback`. Guarde o ID e a chave secreta.
7. Para abrir a mais de 100 pessoas: **Verificação** do app no Google. `gmail.readonly` é escopo restrito e
   exige, além da revisão, a avaliação de segurança anual (CASA). Até lá, uso pessoal e de convidados funciona.

### 2. Cloudflare

```sh
git pull && npm ci
npx wrangler login

# Copie cada "id" impresso para connectors/gmail/wrangler.toml (OAUTH_KV e GMAIL_KV)
npx wrangler kv namespace create OAUTH_KV --config connectors/gmail/wrangler.toml
npx wrangler kv namespace create GMAIL_KV --config connectors/gmail/wrangler.toml

npm run gmail:deploy

npx wrangler secret put GOOGLE_CLIENT_ID --config connectors/gmail/wrangler.toml
npx wrangler secret put GOOGLE_CLIENT_SECRET --config connectors/gmail/wrangler.toml
node -e "console.log(crypto.randomBytes(32).toString('base64'))" | npx wrangler secret put TOKEN_ENC_KEY --config connectors/gmail/wrangler.toml
node -e "console.log(crypto.randomBytes(32).toString('base64url'))" | npx wrangler secret put CONSENT_SECRET --config connectors/gmail/wrangler.toml
# Opcional (modo privado): npx wrangler secret put ALLOWED_EMAILS --config connectors/gmail/wrangler.toml

curl https://gmail-remote.<sua-conta>.workers.dev/   # responde "ok"
```

Os secrets valem na hora, sem novo deploy. Se o subdomínio `workers.dev` não for `bftemponi`, ajuste a URL em
`connectors/gmail/.mcp.json`. **Guarde a `TOKEN_ENC_KEY`:** trocá-la obriga todo mundo a vincular as contas de
novo.

## Desenvolvimento

- `npm run gmail:dev` sobe o Worker localmente (secrets em `connectors/gmail/.dev.vars`, ignorado pelo git;
  nomes em `.env.example`).
- Testes: `npm test` (Node + Vitest, com a Gmail API e o Google simulados; ver ADR 0014).
- Fluxos: [PROCESSES.md](../../docs/PROCESSES.md) P10–P12.

## Segurança

- Nenhum segredo no repositório; tudo por `wrangler secret put`.
- OAuth do Claude com PKCE S256, consentimento por cliente e retorno limitado a `claude.ai`, `claude.com` e
  `localhost`; login e vínculo no Google com `state` de uso único, PKCE, `nonce` e `id_token` validado
  (assinatura RS256, emissor, audiência, validade, `sub` e e-mail verificado).
- Isolamento por usuário: o registro de contas só abre para o `sub` que o gravou; o link de vínculo é de uso
  único, vale 10 minutos e não revela o usuário.
- Cookies `__Host-`, `Secure`, `HttpOnly`, `SameSite=Lax`; páginas com CSP restritiva e sem frames.
- Nada de conteúdo de e-mail, tokens ou endereços nos logs. Política de privacidade com a declaração de Uso
  Limitado do Google em [privacidade.html](../../docs/privacidade.html).
