import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'on-first-retry',
  },

  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'dotnet run --project ../TodoApp.Api/TodoApp.Api.csproj --urls http://0.0.0.0:5000',
      url: 'http://127.0.0.1:5000',
      timeout: 120000,
    },
    {
      command: 'npm start -- --host 0.0.0.0 --poll=2000',
      url: 'http://127.0.0.1:4200',
      timeout: 120000,
    },
  ],
});