import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
    locale: 'en-US',
    channel: process.env.PLAYWRIGHT_CHANNEL,
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'npm --prefix ../e-learning-platform-server run start:e2e',
      url: 'http://localhost:3001/api/courses',
      reuseExistingServer: false,
      timeout: 60000,
    },
    {
      command: 'npm start',
      url: 'http://localhost:3000',
      reuseExistingServer: false,
      timeout: 60000,
    }
  ],
});
