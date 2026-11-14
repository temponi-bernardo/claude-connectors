# 0012 — Conector só remoto, instalado pelo marketplace

- **Estado:** Aceito
- **Data:** 2026-11-14
- **Relacionado:** F2.9, ADR 0007 (substituído), ADR 0008 (substituído em parte), ADR 0009, ADR 0010

## Contexto

O conector do Canvas tinha dois modos: um **local** (servidor stdio no computador, login pelo navegador com
`playwright-core`, empacotado como `.mcpb` e como plugin que rodava `node server/index.js`) e um **remoto**
(Worker no Cloudflare com OAuth, ADR 0009 e 0010). O remoto já funciona no claude.ai, no Cowork e no celular.
O local não funciona em sessões na nuvem (não há navegador nem a sessão da PUC) e exige Node, npm e Chrome no
computador. O dono quer um produto só: a pessoa instala pelo marketplace e usa, sem nada local.

## Decisão

1. O modo local sai do projeto: servidor stdio, login pelo navegador, sessão em disco, `playwright-core`,
   ferramentas `conectar_canvas`/`desconectar_canvas`, manifesto e pacote `.mcpb`.
2. O plugin do marketplace passa a ser só a configuração: `.mcp.json` com um servidor `type: "http"` apontando
   para o Worker (`https://canvas-puc-remote.bftemponi.workers.dev/mcp`). Na primeira chamada, o Claude faz o
   OAuth do servidor (registro dinâmico de cliente) e a pessoa cola o token do Canvas uma vez.
3. `plugin.json` e `.mcp.json` passam a ser escritos à mão (não há mais `manifest.json` para gerá-los).
   `npm run build` (`tools/bundle/`) confere que todo `.mcp.json` só tem servidores `http` com URL `https://` e
   gera `server/remote.js` para o Dockerfile.

## Alternativas consideradas

| Alternativa                                          | Por que não                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| Manter os dois modos                                 | Dobra código, testes e suporte; o local não roda na nuvem, que é o uso desejado |
| Plugin local que só faz proxy para o Worker          | Continua exigindo Node no computador sem ganho nenhum                           |
| Só o conector personalizado do claude.ai, sem plugin | Cada pessoa teria de copiar a URL à mão; o marketplace instala com um clique    |

## Consequências

- Positivas: um caminho só (instalar pelo marketplace), nada instalado no computador, funciona igual no
  Claude Code, no Cowork, na web e no celular; menos código e nenhuma dependência de navegador.
- Negativas / custos aceitos: a pessoa precisa gerar um token de acesso no Canvas (a página do OAuth explica e
  o token é renovado sozinho, ADR 0011); o Worker vira ponto único de falha; quem já usava o `.mcpb` precisa
  reinstalar pelo marketplace.
- O que muda nos docs: ARCHITECTURE, STRUCTURE, PROCESSES (P04 removido, P05 e P07 reescritos), FUNCTIONS,
  ROADMAP (F2.1 e F2.2 sem `.mcpb`), README do conector e skills de release.
