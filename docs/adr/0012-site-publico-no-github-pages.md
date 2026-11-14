# 0012 — Site público no GitHub Pages, servido da pasta `docs/`

- **Estado:** Aceito
- **Data:** 2026-11-14
- **Relacionado:** F2.9, ADR 0006, ADR 0009

## Contexto

Para colocar o conector em produção (tela de consentimento OAuth, diretórios de conectores, manifesto `.mcpb`)
os serviços pedem um link público com a página inicial do serviço e a política de privacidade. O projeto não
usa GitHub Actions (ADR 0006) nem tem hospedagem paga. O GitHub Pages só publica sem Actions a partir da raiz
ou da pasta `/docs` de uma branch.

## Decisão

1. O site (início, privacidade e termos) vive em `docs/` como HTML com front matter, montado pelo Jekyll do
   próprio GitHub Pages com o layout `docs/_layouts/site.html` e o estilo `docs/site.css` (tokens de UI.md).
2. `docs/_config.yml` exclui `*.md`, `adr` e `STATE.md`: a documentação interna não é publicada.
3. Pages configurado em **Settings → Pages → Deploy from a branch → `main` / `/docs`**. Endereço:
   `https://temponi-bernardo.github.io/claude-connectors/`.
4. O manifesto `.mcpb` aponta `homepage` e `privacy_policies` para o site.
5. Sem scripts, cookies ou análise de audiência; CSP `default-src 'none'` por `<meta>`.

## Alternativas consideradas

| Alternativa                             | Por que não                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| Branch `gh-pages` separada              | Fica fora do fluxo de PR e do `pr:check`; site e docs divergiriam.              |
| Pages com GitHub Actions                | O projeto não usa Actions (ADR 0006).                                           |
| Servir as páginas pelo Worker do Canvas | Mistura site institucional com o servidor OAuth; cada deploy do Worker o afeta. |
| `.nojekyll` com HTML puro               | Cabeçalho e rodapé repetidos em cada página (regra "nada repetido") e os `.md`  |
|                                         | internos seriam publicados crus.                                                |

## Consequências

- Positivas: link público grátis, versionado e revisado no mesmo PR que muda o comportamento descrito.
- Negativas / custos aceitos: com o repositório privado, o GitHub Pages exige plano GitHub Pro (ou tornar o
  repositório público); o site é publicado depois do merge na `main`, não no PR. Política e termos precisam
  ser revistos quando o conector mudar o que acessa ou onde é hospedado.
- O que muda nos docs: STRUCTURE (`docs/_layouts/`, `tools/site/`), ARCHITECTURE (serviço externo), UI.md,
  WORKFLOW (escopo `site`), ROADMAP (F2.9).
