/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const isTest = process.env.NODE_ENV === 'test';
const isStorybook = process.argv.some((arg) => arg.includes('storybook'));

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: isTest || isStorybook ? [] : [['babel-plugin-react-compiler']],
      },
    }),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      exclude: [
        'node_modules/**',
        'src/setupTests.ts',
        '**/*.d.ts',
        '**/*.stories.tsx',
        'src/main.tsx',
        'eslint.config.*',
        'vite.config.*',
        '.storybook/**',
        '**/*.css',
        'src/utils/test-utils.tsx',
        'tests/e2e/**',
      ],
    },
  },
});
