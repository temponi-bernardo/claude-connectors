# 0007 — Conectores como extensões `.mcpb`, com sessão do navegador no lugar de token

- **Estado:** Aceito
- **Data:** 2026-11-05
- **Relacionado:** F1.1, F2.1, ADR 0001

## Contexto

O repositório reúne conectores para o Claude, usados no Claude Desktop deste PC. O primeiro é o Canvas da
PUC Minas, onde a instituição limita tokens de acesso a 30 dias. O dono quer instalar pela aba de
extensões/conectores, sem manutenção mensal, e sem custo de hospedagem.

## Decisão

1. Cada conector é um servidor MCP em stdio, numa pasta `connectors/<nome>/` com `manifest.json` (formato
   `.mcpb` 0.3), empacotado por `npm run pack:all` num `.mcpb` instalável com dois cliques.
2. O código é unido pelo esbuild num único arquivo; só dependências que não podem ser unidas
   (`RUNTIME_EXTERNALS`) vão em `node_modules` do pacote.
3. A autenticação do Canvas usa a sessão de um login feito numa janela do Chrome/Edge instalado, com perfil
   próprio. Em 401, a sessão é renovada em segundo plano (navegador oculto, SSO guardado); o token do Canvas
   fica só como reserva.

## Alternativas consideradas

| Alternativa                               | Por que não                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| Conector remoto (URL pública + OAuth)     | Exige hospedar e proteger um servidor; login por navegador não roda na nuvem.     |
| Só token de acesso                        | Expira em 30 dias na PUC; exige trocar à mão todo mês.                            |
| Ler cookies do perfil principal do Chrome | Bloqueado pelo Chrome (criptografia por app, perfil travado); técnica de malware. |
| Pacote sem bundle (node_modules completo) | 6 MB+ e milhares de arquivos; o bundle reduz a ~3 MB.                             |
| Baixar Chromium do Playwright             | +150 MB; o Chrome/Edge já instalado basta (`playwright-core` + `channel`).        |

## Consequências

- Positivas: instalação pela interface do Claude, sem token para renovar, sem custo; conectores novos seguem o
  mesmo molde e reaproveitam `src/core` e `src/mcp`.
- Negativas / custos aceitos: funciona só no computador onde a extensão está instalada (não no celular nem na
  web); depende de Chrome ou Edge instalados; a sessão some se a Microsoft exigir senha de novo (aí abre a janela).
- O que muda nos docs: ARCHITECTURE (camadas, serviços), STRUCTURE (`connectors/`, `src/mcp/`, `tools/pack/`),
  PROCESSES (P03–P05), PRODUCT, ROADMAP.
