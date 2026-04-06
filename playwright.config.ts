import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  use: {
    headless: true,
    baseURL: 'http://localhost:4173', // frontend preview
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
  },
  webServer: {
    command: 'pnpm run preview --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
