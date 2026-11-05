# Interface

**Este projeto ainda não tem interface.** `docs.config.json` tem `"uiDir": null`, então o `docs:check` não
cobra componentes. A tarefa F1.3 do [ROADMAP.md](ROADMAP.md) decide se haverá interface.

## Quando houver interface

1. Crie o pacote de design system (ex.: `src/ui/`) com **tokens** (cores, tipografia, espaçamento, raio,
   sombra) e **componentes** (botão, campo, cartão...). Nenhuma tela estiliza "na mão": só usa tokens e
   componentes daqui.
2. Aponte `"uiDir": "src/ui"` em `docs.config.json`. A partir daí todo arquivo `.tsx` da pasta precisa de
   uma seção aqui (modelo em [DOCUMENTATION.md](DOCUMENTATION.md#componente)).
3. Registre a decisão da stack de UI em um ADR e atualize ARCHITECTURE.md (camada `entrada`).
4. Se houver diferença por sistema (web × desktop × mobile), crie `docs/PLATFORMS.md` e linke aqui.
5. Design (ícones, ilustrações, imagens) é sempre original — nada copiado de bibliotecas de terceiros sem
   licença compatível, nada que imite marca alheia.

## Tokens

| Token | Valor | Uso |
| ----- | ----- | --- |
| —     | —     | —   |

## Componentes

_Nenhum ainda._
