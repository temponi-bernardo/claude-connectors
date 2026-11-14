# 0018 — Plugin do WhatsApp sem servidor embutido

- **Estado:** Aceito
- **Data:** 2026-11-14
- **Relacionado:** ADR 0008, ADR 0013, ADR 0015

## Contexto

O plugin do WhatsApp usava `${user_config.server_url}` no `.mcp.json` para cada pessoa informar o próprio servidor
(template self-host, ADR 0015). O valor só existe no computador onde foi preenchido. O plugin instalado pela
organização no claude.ai resolve outra URL, e o botão **Vincular** recusava o login antes de abrir o GitHub, em
qualquer conversa nova, com o servidor funcionando.

## Decisão

O plugin do WhatsApp **não tem `.mcp.json`**: traz só as skills. Cada pessoa conecta o próprio servidor como
**conector personalizado** da conta (claude.ai → Configurações → Conectores), que vale no claude.ai, no app, no
celular, no Cowork e no Claude Code; `/config-whatsapp` guia. O `npm run build` aceita plugin sem `.mcp.json` e
recusa `${user_config.*}` na URL de qualquer `.mcp.json`.

## Alternativas consideradas

| Alternativa                                 | Por que não                                                                         |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| Manter `${user_config.server_url}`          | É a causa do erro: o valor local não chega ao plugin instalado pela organização     |
| URL fixa do servidor do dono no `.mcp.json` | Quebra o self-host: as outras pessoas não conseguiriam usar o próprio servidor      |
| Roteador central que repassa para cada dono | Vira serviço multi-tenant, contra a ADR 0015, e passaria o tráfego de todos por ele |

## Consequências

- Positivas: cada pessoa usa o próprio servidor em todos os Claude, com um só cadastro; o Vincular não depende do
  plugin; o build impede que o formato quebrado volte.
- Negativas / custos aceitos: instalar o plugin não conecta nada sozinho; é preciso adicionar o conector
  personalizado (um passo, guiado por `/config-whatsapp`).
- O que muda nos docs: README e skill `config-whatsapp` do conector, PROCESSES (P05, P07), STRUCTURE, FUNCTIONS
  (`isRemoteMcpUrl`, `buildConnector`), CHANGELOG.
