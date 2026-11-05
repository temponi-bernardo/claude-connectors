# Arquitetura

## Camadas

```text
┌──────────────────────────────┐
│  entrada  (src/main.ts, CLI, │  efeitos: argv, stdout, HTTP, UI
│  handlers, telas)            │
├──────────────────────────────┤
│  aplicação (src/app/)        │  orquestra casos de uso; chama core e adaptadores
├──────────────────────────────┤
│  core (src/core/)            │  lógica pura: decide, não faz
├──────────────────────────────┤
│  adaptadores (src/adapters/) │  disco, rede, banco, serviços externos
└──────────────────────────────┘
```

O template entrega só `entrada` (`src/main.ts`) e `core` (`src/core/`). Crie `src/app/` e `src/adapters/`
quando a F1.4 definir as camadas; registre a decisão em um ADR.

## Regras de dependência (quem pode importar quem)

| De ↓ / Para → | core | adapters            | app | entrada | tools |
| ------------- | ---- | ------------------- | --- | ------- | ----- |
| **core**      | ✅   | ❌                  | ❌  | ❌      | ❌    |
| **adapters**  | ✅   | ✅                  | ❌  | ❌      | ❌    |
| **app**       | ✅   | ✅ (via interfaces) | ✅  | ❌      | ❌    |
| **entrada**   | ✅   | ✅                  | ✅  | ✅      | ❌    |
| **tools**     | ✅   | ❌                  | ❌  | ❌      | ✅    |

Princípio: **decidir (puro) separado de fazer (efeitos)**. `core` nunca importa Node (`node:fs`, `node:http`)
nem bibliotecas com efeito. Testes de `core` não precisam de mocks.

## Fluxo de dados

Entrada recebe o evento (argumento, requisição, clique) → converte para tipos do domínio → `app` chama `core`
para decidir → `app` chama `adapters` para executar → entrada formata a resposta. Ver os processos em
[PROCESSES.md](PROCESSES.md).

## Serviços externos

| Serviço | Usado para | Onde está o adaptador | Segredo (nome da variável) |
| ------- | ---------- | --------------------- | -------------------------- |
| —       | —          | —                     | —                          |

Segredos só em variáveis de ambiente (`.env` local, nunca versionado; `.env.example` lista os nomes).

## Ferramentas internas (`tools/`)

`tools/docs/` é o verificador/gerador de documentação e `tools/init/` o inicializador do template. Seguem as
mesmas regras do código de produto (documentação, testes, lint), mas não entram no build (`tsconfig.build.json`).

## Decisões

Histórico e justificativas em [adr/README.md](adr/README.md).
