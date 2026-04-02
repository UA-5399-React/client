import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  use: {
    headless: true,
    baseURL: 'http://localhost:5173',
  },
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    timeout: 120_000,
  },
});
