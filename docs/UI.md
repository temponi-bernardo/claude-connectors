# Interface

**Este projeto não tem interface de aplicativo.** `docs.config.json` tem `"uiDir": null`, então o `docs:check`
não cobra componentes. A única tela é a **página de autorização do conector remoto** (ADR 0009): HTML estático,
sem script, gerado por `renderLoginPage()` em `src/remote/login-page.ts`, com o estilo em `LOGIN_PAGE_CSS` e os
tokens abaixo (claro e escuro por `prefers-color-scheme`).

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

| Token       | Valor (claro / escuro) | Uso                                  |
| ----------- | ---------------------- | ------------------------------------ |
| `--bg`      | `#f6f7f9` / `#121417`  | Fundo da página e dos campos         |
| `--surface` | `#fff` / `#1c1f24`     | Cartão central                       |
| `--text`    | `#1d2129` / `#e8eaed`  | Texto principal                      |
| `--muted`   | `#5b6270` / `#a3a9b3`  | Texto de apoio                       |
| `--accent`  | `#2357d9` / `#7aa2ff`  | Botão e links                        |
| `--danger`  | `#b42318` / `#ff8a80`  | Mensagem de erro (`role="alert"`)    |
| `--line`    | `#d9dde3` / `#30343b`  | Bordas                               |
| `--space`   | `16px`                 | Espaçamento base                     |
| `--radius`  | `10px`                 | Raio do cartão (campos e botão: 8px) |

## Componentes

_Nenhum ainda._
