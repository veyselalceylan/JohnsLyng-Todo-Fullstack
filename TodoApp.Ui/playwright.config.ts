import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'on-first-retry',
  },

  webServer: [
    {
      command: 'dotnet run --urls=http://0.0.0.0:5000',
      url: 'http://127.0.0.1:5000',
      reuseExistingServer: !process.env.CI,
      cwd: '../TodoApp.Api',
      timeout: 120 * 1000,
    },
    {
      command: 'npm start -- --host 0.0.0.0',
      url: 'http://127.0.0.1:4200',
      reuseExistingServer: !process.env.CI,
      cwd: '.',
      timeout: 120 * 1000,
    },
  ],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});