import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Os hooks do git (ex.: pre-push num worktree) exportam GIT_DIR e afins; os testes que criam repositórios
// temporários herdariam essas variáveis e mexeriam no repositório de verdade.
for (const name of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_PREFIX', 'GIT_COMMON_DIR']) {
  Reflect.deleteProperty(process.env, name);
}

export default defineConfig({
  // `cloudflare:workers` só existe no runtime do Workers; nos testes em Node vira um substituto (ADR 0012).
  resolve: {
    alias: {
      'cloudflare:workers': fileURLToPath(
        new URL('./connectors/gmail/src/fixtures/cloudflare-workers-stub.ts', import.meta.url),
      ),
    },
  },
  test: {
    server: { deps: { inline: ['@cloudflare/workers-oauth-provider'] } },
    include: ['src/**/*.test.ts', 'tools/**/*.test.ts', 'connectors/**/*.test.ts'],
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'tools/**/*.ts', 'connectors/**/*.ts'],
      exclude: [
        '**/*.test.ts',
        'tools/**/cli.ts',
        'tools/**/fixtures/**',
        'connectors/*/src/fixtures/**',
        '**/*.d.ts',
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
