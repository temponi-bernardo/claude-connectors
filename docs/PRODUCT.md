# Produto

## Em uma frase

Conectores MCP para o Claude, empacotados como extensões .mcpb, começando pelo Canvas da PUC Minas.

## Para quem

- **Público principal:** o próprio dono do repositório (estudante de Ciência da Computação da PUC Minas), que
  usa o Claude Desktop e quer acesso direto aos sistemas do dia a dia.
- **Plataformas:** Claude Desktop no Windows (extensão `.mcpb`, aba Extensões); também funciona no Claude Code
  pelo mesmo servidor. Sem interface gráfica própria.

## Conectores

| Conector     | O que dá ao Claude                                                                   | Estado    |
| ------------ | ------------------------------------------------------------------------------------ | --------- |
| `canvas-puc` | Agenda de entregas, tarefas, notas, avisos, módulos, arquivos e fóruns               | ✅ v1.3.0 |
| `whatsapp`   | WhatsApp pessoal: conversas, mensagens, busca, contatos e mídias (remoto, self-host) | 🟨 v0.1.0 |

Guia de uso de cada um em `connectors/<nome>/README.md`.

## Modelo de negócio

Nenhum: uso pessoal, custo zero no Canvas (sem hospedagem paga e sem GitHub Actions). O WhatsApp roda no Workers
Paid do próprio dono (US$ 5/mês, uso típico dentro da franquia) e é publicado como template: quem usar publica na
própria conta.

## Perguntas abertas → decisões

Registre a pergunta quando surgir; ao decidir, mova para a tabela de decisões com a data. Decisão de
arquitetura vai para um ADR; decisão de produto fica aqui.

### Abertas

| #   | Pergunta                                            | Opções em consideração                           |
| --- | --------------------------------------------------- | ------------------------------------------------ |
| Q5  | Vale ter acesso pelo celular/web (conector remoto)? | Hospedar com OAuth próprio × ficar só no Desktop |

### Decididas

| #   | Decisão                                                                                                                           | Data       | Motivo                                             |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------- |
| Q1  | Público: uso pessoal do dono; primeira dor: acompanhar o Canvas da PUC sem abrir o site                                           | 2026-11-05 | Pedido do dono                                     |
| Q2  | Sem interface própria; a interface é o Claude (Desktop e Code)                                                                    | 2026-11-05 | Conectores MCP                                     |
| Q3  | Sem receita; custo zero, inclusive sem GitHub Actions                                                                             | 2026-11-05 | Pedido do dono (ADR 0006)                          |
| Q6  | Login pelo navegador com renovação automática, token só como reserva                                                              | 2026-11-05 | Tokens da PUC expiram em 30 dias (ADR 0007)        |
| Q7  | Envios (entregar tarefa, responder fórum) liberados, sempre com confirmação no chat                                               | 2026-11-05 | Escolha do dono na configuração da extensão        |
| Q4  | Próximo conector: WhatsApp pessoal, remoto, como template self-host (cada pessoa na própria conta Cloudflare, nunca multi-tenant) | 2026-11-14 | Pedido do dono (ADR 0012)                          |
| Q8  | WhatsApp: leitura primeiro; envio atrás de `ENABLE_SEND`, desligado por padrão, com allowlist e limite por hora                   | 2026-11-14 | Pedido do dono; reduz risco de abuso e de bloqueio |
| Q9  | WhatsApp sob demanda: nada fica ligado sem uso (sem cron por padrão); custo dentro da franquia do Workers Paid                    | 2026-11-14 | Pedido do dono (README do conector, custo)         |
