# 0009 — Conector remoto por HTTP com OAuth e token do Canvas

- **Estado:** Aceito
- **Data:** 2026-11-05
- **Relacionado:** F2.6, ADR 0007, ADR 0008

## Contexto

O plugin e a extensão `.mcpb` rodam o servidor MCP por stdio no computador do usuário e fazem login pelo
Chrome. Sessões na nuvem (Cowork, celular, claude.ai) não iniciam o servidor do plugin ou não têm navegador
para o login. Para usar o Canvas nelas, o Claude precisa de um **conector personalizado**: uma URL HTTPS que
fala MCP por Streamable HTTP e autentica com OAuth 2.1 (com registro dinâmico de cliente). A PUC não fornece
chave de desenvolvedor OAuth do Canvas, então a única credencial possível sem navegador é o **token de acesso**
pessoal (Conta → Configurações), que na PUC vale 30 dias.

## Decisão

1. Um servidor HTTP (`connectors/canvas-puc/src/remote-main.ts`) expõe as mesmas ferramentas de leitura e
   escrita em `/mcp` (Streamable HTTP sem sessão, uma instância de `McpServer` por requisição). As ferramentas
   `conectar_canvas`/`desconectar_canvas` não existem no modo remoto.
2. O próprio servidor é o servidor de autorização OAuth (camada nova `src/remote/`, genérica para outros
   conectores): metadados (RFC 8414 e RFC 9728), registro dinâmico (RFC 7591), `/authorize` com PKCE S256
   obrigatório e `/token` (código e refresh).
3. A tela de `/authorize` pede o token do Canvas, valida em `/api/v1/users/self` e só então emite o código.
4. **Sem banco de dados:** `client_id`, código, access token e refresh token são blobs selados com AES-256-GCM
   (chave `SEAL_KEY` do servidor), com tipo e validade dentro. O token do Canvas viaja só selado e nunca é gravado.
5. Endereços de retorno do OAuth limitados por lista (`claude.ai`, `claude.com` e `localhost`, configurável),
   para que um cliente registrado por terceiros não receba o token de alguém.
6. O endereço do Canvas é fixo no servidor (`CANVAS_BASE_URL`), então o servidor não acessa URLs escolhidas
   pelo usuário.
7. O handler é escrito sobre `Request`/`Response` (Web padrão) e um adaptador fino o serve com `node:http`;
   empacotado em `server/remote.js` e publicado por Docker (qualquer host Node com HTTPS).

## Alternativas consideradas

| Alternativa                                   | Por que não                                                                            |
| --------------------------------------------- | -------------------------------------------------------------------------------------- |
| OAuth do próprio Canvas (developer key)       | Exige que a PUC crie uma chave de desenvolvedor; fora do nosso controle.               |
| Login pelo navegador no servidor (Playwright) | Precisaria guardar senha/MFA da Microsoft do usuário; inseguro e frágil.               |
| Conector sem autenticação, token em variável  | Só serve a uma pessoa e expõe a conta de quem souber a URL.                            |
| Guardar tokens em banco (KV, SQLite)          | Mais infraestrutura e um alvo para vazamento; o selo dispensa armazenamento.           |
| Express + `mcpAuthRouter` do SDK              | Exige dependência nova e um provedor com estado; o handler Web padrão é testável puro. |
| Sessões MCP com estado (`Mcp-Session-Id`)     | Não sobrevivem a reinício nem a várias instâncias; nenhuma ferramenta precisa delas.   |

## Consequências

- Positivas: o Canvas funciona no claude.ai, no Cowork e no celular; o servidor não guarda segredo de usuário.
- Negativas / custos aceitos: o token da PUC expira em 30 dias e o usuário reconecta o conector depois disso;
  um código de autorização pode ser reusado durante os 5 minutos de validade (sem estado), o que o PKCE mitiga;
  trocar a `SEAL_KEY` desconecta todo mundo; alguém precisa hospedar o servidor com HTTPS.
- O que muda nos docs: ARCHITECTURE (camada `remote`, serviço externo), STRUCTURE, PROCESSES (fluxos OAuth e
  MCP remoto), README do conector (como hospedar e conectar), ROADMAP (F2.6).
