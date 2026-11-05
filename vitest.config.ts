import { defineConfig } from 'vitest/config';

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
