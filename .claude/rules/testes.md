---
paths:
  - '**/*.test.ts'
---

# Ao editar testes

- Teste primeiro, veja falhar, depois implemente (`docs/TESTING.md`).
- Nomes de teste em português descrevendo o comportamento.
- Efeitos de disco: diretório temporário real (`mkdtempSync`) + limpeza; não mocke `fs`.
- Cobertura mínima 90%; `npm run test:coverage` mostra o que falta.
- Função sem teste só com entrada em `src/test-exceptions.ts`, com motivo e teste manual.
