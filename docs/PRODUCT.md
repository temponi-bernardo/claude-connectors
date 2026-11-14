# Produto

## Em uma frase

Conectores MCP para o Claude, que rodam na nuvem e se instalam pelo marketplace de plugins, começando pelo Canvas da PUC Minas.

## Para quem

- **Público principal:** o próprio dono do repositório (estudante de Ciência da Computação da PUC Minas), que
  usa o Claude e quer acesso direto aos sistemas do dia a dia.
- **Plataformas:** claude.ai, Cowork, app do celular e Claude Code, todos pelo mesmo servidor remoto. Instala
  pelo marketplace de plugins; nada roda no computador (ADR 0013). Sem interface gráfica própria.

## Conectores

| Conector     | O que dá ao Claude                                                           | Estado    |
| ------------ | ---------------------------------------------------------------------------- | --------- |
| `canvas-puc` | Agenda de entregas, tarefas, notas, avisos, módulos, arquivos e fóruns       | ✅ v2.0.0 |
| `whatsapp`   | WhatsApp pessoal: conversas, mensagens, busca, contatos e mídias (self-host) | 🟨 v0.1.0 |

Guia de uso de cada um em `connectors/<nome>/README.md`.

## Modelo de negócio

Nenhum: uso pessoal, repositório privado, custo zero (sem hospedagem e sem GitHub Actions).

## Perguntas abertas → decisões

Registre a pergunta quando surgir; ao decidir, mova para a tabela de decisões com a data. Decisão de
arquitetura vai para um ADR; decisão de produto fica aqui.

### Abertas

| #   | Pergunta                                            | Opções em consideração                           |
| --- | --------------------------------------------------- | ------------------------------------------------ |
| Q5  | Vale ter acesso pelo celular/web (conector remoto)? | Hospedar com OAuth próprio × ficar só no Desktop |

### Decididas

| #   | Decisão                                                                                                                   | Data       | Motivo                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------- |
| Q1  | Público: uso pessoal do dono; primeira dor: acompanhar o Canvas da PUC sem abrir o site                                   | 2026-11-05 | Pedido do dono                                        |
| Q2  | Sem interface própria; a interface é o Claude (web, Cowork, celular e Code)                                               | 2026-11-05 | Conectores MCP                                        |
| Q3  | Sem receita; custo zero, inclusive sem GitHub Actions                                                                     | 2026-11-05 | Pedido do dono (ADR 0006)                             |
| Q6  | Login por token do Canvas na página de OAuth, com validade renovada sozinha (substitui o login pelo navegador)            | 2026-11-14 | Conector só na nuvem (ADR 0011, ADR 0013)             |
| Q7  | Envios (entregar tarefa, responder fórum) liberados, sempre com confirmação no chat                                       | 2026-11-05 | Escolha do dono (`CANVAS_ALLOW_WRITE=true` no Worker) |
| Q8  | Conector só na nuvem, instalado pelo marketplace; nada roda no computador                                                 | 2026-11-14 | Pedido do dono (ADR 0013)                             |
| Q4  | Próximo conector: WhatsApp pessoal, como template self-host (cada pessoa na própria conta Cloudflare, nunca multi-tenant) | 2026-11-14 | Pedido do dono (ADR 0015)                             |
| Q9  | WhatsApp: envio ligado para qualquer contato ou grupo, com confirmação a cada mensagem e limite por hora (F3.4)           | 2026-11-14 | Pedido do dono; reduz abuso e risco de bloqueio       |
| Q10 | WhatsApp sob demanda: nada ligado sem uso (sem cron por padrão); uso típico dentro da franquia do Workers Paid            | 2026-11-14 | Pedido do dono (custo no README do conector)          |
