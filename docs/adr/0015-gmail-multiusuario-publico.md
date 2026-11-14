# 0015 — Gmail remoto público e multiusuário

- **Estado:** Aceito
- **Data:** 2026-11-14
- **Relacionado:** substitui em parte o ADR 0014 (itens 3 e 4: allowlist obrigatória e vínculo pela allowlist)

## Contexto

O repositório é público e o plugin `gmail` aparece no marketplace para qualquer pessoa. O ADR 0014 desenhou o
conector para um dono só: `ALLOWED_EMAILS` obrigatório e contas vinculadas num espaço único do KV. Quem instalasse
o plugin não conseguiria entrar, e se a allowlist fosse aberta todo mundo veria as mesmas contas. A restrição de
custo continua: o Worker só roda quando chega uma requisição e pode ficar ocioso sem custo.

## Decisão

1. **Cada pessoa que instala é um usuário.** O login no Google acontece no OAuth do próprio Claude, depois de
   instalar o conector. O usuário é o `sub` do `id_token` (estável, diferente do e-mail) e vai nos `props` do
   grant junto do e-mail e de um id de sessão.
2. **O login já vincula a conta.** O login pede `openid email gmail.readonly` com acesso offline; se o Google
   concede o Gmail e o refresh token, a conta entra nas contas do usuário. Falha ao gravar não impede o login.
3. **Contas por usuário, num registro só.** `owner:<sha256(sub)>` guarda as contas do usuário seladas com
   AES-256-GCM (`TOKEN_ENC_KEY`), com o `sub` dentro do selo conferido na leitura. Uma leitura de KV por
   chamada de ferramenta; escrita só ao vincular, desvincular ou revogar. Até 10 contas por usuário.
4. **Mais contas por link de uso único.** A ferramenta `link_account` gera `/accounts/link?ticket=...`: um selo
   com o usuário, validade de 10 minutos e um `jti` marcado no KV no primeiro uso. Sem ticket válido,
   `/accounts/link` não faz nada. O resto do vínculo (cookie `__Host-`, PKCE, `nonce`, `id_token`) é o do ADR 0014.
5. **`unlink_account`** apaga a conta do registro e revoga o refresh token no Google (melhor esforço).
6. **`ALLOWED_EMAILS` vira opcional:** sem ele o conector é público; com ele, só os e-mails listados entram
   (modo privado, 403 para os demais).
7. **Limite por IP nas rotas públicas** (registro, `/authorize`, `/token`, vínculo e retorno): binding
   `RATE_LIMITER_PUBLIC`, 30 requisições por minuto por IP. O `/mcp` mantém o limite por sessão (120/min).
   Os dois bindings contam na borda, sem KV e sem nada rodando entre requisições.
8. **Apelidos por usuário:** a parte antes do `@`; se duas contas do mesmo usuário repetem, vale o e-mail inteiro.
   `account` aceita apelido, e-mail ou `all`.

## Alternativas consideradas

| Alternativa                                       | Por que não                                                                               |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Manter a allowlist obrigatória                    | O plugin público não funcionaria para ninguém além do dono.                               |
| Vínculo aberto em `/accounts/link` (sem ticket)   | Não há como saber a qual usuário do Claude a conta pertence.                              |
| Guardar as contas nos `props` do grant            | Cada reconexão do Claude perderia as contas extras; os `props` não mudam fora do refresh. |
| Uma chave do KV por conta (`owner:<sub>:<conta>`) | Listar exige `kv.list` (cobrado à parte e eventual); um registro por usuário basta.       |
| Limite por IP com contador no KV                  | Uma escrita de KV por requisição; o binding de rate limiting não grava nada.              |

## Consequências

- Positivas: qualquer pessoa instala e usa com as próprias contas; dados isolados por usuário; o dono pode
  fechar o conector com `ALLOWED_EMAILS`; custo continua só por requisição.
- Negativas / custos aceitos: `gmail.readonly` é um escopo **restrito** do Google. Enquanto o app não for
  verificado, o Google mostra o aviso de app não verificado e limita a **100 usuários**. Para abrir de verdade ao
  público é preciso a verificação do Google (política de privacidade com Uso Limitado, vídeo de demonstração) e a
  avaliação de segurança anual (CASA). Esse processo é do dono do projeto, fora do código.
- O que muda nos docs: PROCESSES (P10–P12), FUNCTIONS, ARCHITECTURE (segredos), README do conector, site
  (privacidade com o Gmail e a declaração de Uso Limitado), CHANGELOG, `.env.example`.
