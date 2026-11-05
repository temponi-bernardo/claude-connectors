import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'tools/**/*.test.ts'],
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'tools/**/*.ts'],
      exclude: ['**/*.test.ts', 'src/main.ts', 'tools/**/cli.ts', 'tools/**/fixtures/**'],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
      reporter: ['text', 'lcov'],
    },
  },
});
