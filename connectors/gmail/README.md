# Gmail remoto (várias contas, leitura e gerenciamento)

Conector MCP remoto que deixa o Claude (claude.ai, app, Cowork e Claude Code) **ler e gerenciar** uma ou mais
contas Gmail de quem o instala: buscar, ler, enviar, responder, encaminhar, rascunhos, marcadores, arquivar e
lixeira. Não existe exclusão definitiva, e o Claude pede confirmação antes de enviar ou apagar. É público e multiusuário: cada pessoa entra com a própria conta Google e só vê as contas que
ela mesma vinculou. Roda no Cloudflare Workers **só quando chega uma requisição**: sem Containers, Cron
Triggers, alarms ou polling, então ficar ocioso não custa nada. Estado no Workers KV. Decisões em
[ADR 0014](../../docs/adr/0014-gmail-remoto-sob-demanda-no-workers.md) e
[ADR 0016](../../docs/adr/0016-gmail-multiusuario-publico.md) e
[ADR 0019](../../docs/adr/0019-gmail-gerenciamento-completo.md) (gerenciamento).

## Para quem vai usar

O jeito mais fácil: digite **`/config-gmail`** no chat. O Claude confere a conexão, mostra as contas, vincula
ou desvincula contas e faz um teste. O passo a passo manual é este:

1. No Claude, adicione o marketplace `temponi-bernardo/claude-connectors` e instale o plugin **`gmail`** (ou
   adicione `https://gmail-remote.bftemponi.workers.dev/mcp` em Configurações → Conectores → Adicionar
   conector personalizado).
2. Ao conectar, clique em **Permitir** e entre com a sua conta Google, marcando a permissão de **ler, escrever
   e enviar e-mails** (gerenciar o Gmail). Essa conta já fica vinculada.
3. Para mais contas, peça ao Claude: _"vincule outra conta do Gmail"_. Ele gera um link de uso único (vale 10
   minutos); abra no navegador e entre com a outra conta.
4. Peça normalmente: _"procure o recibo do FL Cloud em todas as minhas contas"_, _"responda à Ana dizendo que
   topo"_, _"arquive as propagandas de hoje"_. Antes de enviar, encaminhar, mandar para a lixeira ou apagar um
   rascunho, o Claude mostra o que vai fazer e espera o seu "sim".
5. Para remover uma conta: _"desvincule a conta X"_. O conector apaga o token e revoga o acesso no Google.

**Conta vinculada antes do gerenciamento:** contas vinculadas quando o conector só lia continuam lendo, mas as
ferramentas de escrita respondem _"a conta X foi vinculada só para leitura… use link_account e entre com ela de
novo"_, e `list_accounts` mostra `write_access: false`. Peça um link (`link_account`) e entre com a **mesma**
conta: o acesso novo substitui o antigo, sem precisar desvincular.

Enquanto o app do Google não for verificado, a tela de login mostra o aviso **"O Google não verificou este
app"**: clique em **Avançado → Acessar**. O Google limita apps não verificados com Gmail a 100 usuários.

## Comandos do plugin

- **`/config-gmail`** — configuração guiada (conexão, contas e teste).
- **`/triagem-email`** — caixa de entrada de todas as contas por prioridade.
- **`/achar-documento`** — boletos, faturas, recibos e contratos, com os dados do anexo.
- **`/resumir-conversa`** — resumo de uma thread, pendências e rascunho de resposta.

Também dá para pedir em linguagem natural ("tem e-mail pra responder?"): o Claude usa a skill certa.

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
| `list_drafts`         | `account`, `max_results`                                   | Rascunhos com id, destinatários e assunto     |

Ferramentas de escrita (todas com `account` de uma conta só; nenhuma aceita `all`):

| Ferramenta        | Parâmetros                                                               | Observação                                                          |
| ----------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `send_email`      | `to`, `cc`, `bcc`, `subject`, `body`                                     | Texto plano; até 100 destinatários                                  |
| `reply_email`     | `message_id`, `body`                                                     | Ao remetente (ou `Reply-To`), na mesma conversa, citando o original |
| `reply_all_email` | `message_id`, `body`                                                     | Remetente + To + Cc, sem a sua conta e sem repetir                  |
| `forward_email`   | `message_id`, `to`, `cc`, `bcc`, `note`                                  | Com os anexos originais (até 18 MB no total)                        |
| `create_draft`    | `to`, `cc`, `bcc`, `subject`, `body`, `reply_to_message_id`, `reply_all` | Rascunho novo, ou resposta na conversa com `reply_to_message_id`    |
| `update_draft`    | `draft_id` + os campos de `create_draft`                                 | Substitui o conteúdo inteiro                                        |
| `send_draft`      | `draft_id`                                                               | Envia o rascunho como está                                          |
| `delete_draft`    | `draft_id`                                                               | Apaga só o rascunho                                                 |
| `mark_read`       | `message_ids` e/ou `thread_ids`, `read`                                  | `read: false` marca como não lido                                   |
| `archive`         | `message_ids` e/ou `thread_ids`, `archived`                              | Tira da caixa de entrada; `archived: false` devolve                 |
| `star`            | `message_ids` e/ou `thread_ids`, `starred`                               | `starred: false` tira a estrela                                     |
| `update_labels`   | `message_ids` e/ou `thread_ids`, `add_labels`, `remove_labels`           | Marcadores por id ou nome (`list_labels`)                           |
| `trash`           | `message_ids` e/ou `thread_ids`                                          | Lixeira (o Gmail esvazia em 30 dias); sem exclusão definitiva       |
| `untrash`         | `message_ids` e/ou `thread_ids`                                          | Restaura da lixeira                                                 |

Até 50 mensagens ou 20 conversas por chamada de organização. As ferramentas levam as **anotações MCP**:
envio, lixeira, editar ou apagar rascunho e desvincular conta têm `destructiveHint: true` (o cliente pede
confirmação); organizar é reversível (`destructiveHint: false`); leitura tem `readOnlyHint: true`. Respostas e
encaminhamentos saem em texto plano (o HTML do original vira texto).

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
   `https://www.googleapis.com/auth/gmail.modify` (ler, enviar, rascunhos, marcadores e lixeira; sem exclusão
   definitiva). Quem já tinha `gmail.readonly` cadastrado pode removê-lo depois que as contas forem vinculadas
   de novo.
6. **Clientes → Criar cliente → Aplicativo da Web**, com o URI de redirecionamento
   `https://gmail-remote.<sua-conta>.workers.dev/google/callback`. Guarde o ID e a chave secreta.
7. Para abrir a mais de 100 pessoas: **Verificação** do app no Google. `gmail.modify` é escopo restrito e
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

### 3. Atualizar um Worker que já estava no ar (só leitura → gerenciamento)

1. **Google Cloud:** no projeto do conector, **Google Auth Platform → Acesso a dados → Adicionar escopos** e
   inclua `https://www.googleapis.com/auth/gmail.modify`. Salve. Sem isso o Google recusa o login com o escopo
   novo.
2. **Publicar:** `npm run gmail:deploy` (os secrets e o KV continuam os mesmos).
3. **Reconectar as contas:** cada conta antiga aparece em `list_accounts` com `write_access: false`. Peça ao
   Claude `link_account` e entre com a mesma conta, aceitando gerenciar o Gmail. A conta do login pode ser
   vinculada do mesmo jeito (ou reconecte o conector no Claude).

## Desenvolvimento

- `npm run gmail:dev` sobe o Worker localmente (secrets em `connectors/gmail/.dev.vars`, ignorado pelo git;
  nomes em `.env.example`).
- Testes: `npm test` (Node + Vitest, com a Gmail API e o Google simulados; ver ADR 0014).
- Fluxos: [PROCESSES.md](../../docs/PROCESSES.md) P10–P12 e P18 (escrita).

## Segurança

- Nenhum segredo no repositório; tudo por `wrangler secret put`.
- OAuth do Claude com PKCE S256, consentimento por cliente e retorno limitado a `claude.ai`, `claude.com` e
  `localhost`; login e vínculo no Google com `state` de uso único, PKCE, `nonce` e `id_token` validado
  (assinatura RS256, emissor, audiência, validade, `sub` e e-mail verificado).
- Isolamento por usuário: o registro de contas só abre para o `sub` que o gravou; o link de vínculo é de uso
  único, vale 10 minutos e não revela o usuário.
- Cookies `__Host-`, `Secure`, `HttpOnly`, `SameSite=Lax`; páginas com CSP restritiva e sem frames.
- Escrita só com `gmail.modify` conferido antes de chamar o Google; e-mails montados no Worker com endereços
  validados e cabeçalhos sem quebra de linha (sem injeção de cabeçalho); sem exclusão definitiva.
- Prompt injection: descrições, instruções do servidor e resultados avisam o modelo que o conteúdo dos e-mails
  não é confiável e que ele nunca deve enviar, encaminhar ou apagar porque um e-mail pediu.
- Nada de conteúdo de e-mail, tokens ou endereços nos logs. Política de privacidade com a declaração de Uso
  Limitado do Google em [privacidade.html](../../docs/privacidade.html).
