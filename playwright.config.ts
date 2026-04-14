import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  use: {
    headless: true,
    baseURL: 'http://localhost:5173', // frontend preview
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
  },
  webServer: {
    command: 'pnpm run dev --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
