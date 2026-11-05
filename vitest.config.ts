import { defineConfig } from 'vitest/config';

// Os hooks do git (ex.: pre-push num worktree) exportam GIT_DIR e afins; os testes que criam repositórios
// temporários herdariam essas variáveis e mexeriam no repositório de verdade.
for (const name of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_PREFIX', 'GIT_COMMON_DIR']) {
  Reflect.deleteProperty(process.env, name);
}

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'tools/**/*.test.ts', 'connectors/**/*.test.ts'],
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'tools/**/*.ts', 'connectors/**/*.ts'],
      exclude: [
        '**/*.test.ts',
        'tools/**/cli.ts',
        'tools/**/fixtures/**',
        // Pontos de entrada e automação de navegador: exceções em src/test-exceptions.ts
        'connectors/*/src/main.ts',
        'connectors/*/src/remote-main.ts',
        'connectors/*/src/browser-login.ts',
      ],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
      reporter: ['text', 'lcov'],
    },
  },
});
