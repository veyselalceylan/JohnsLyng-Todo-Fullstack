import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: 'http://127.0.0.1:4200',

    headless: true,

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  webServer: [
    {
      // .NET API
      command: 'dotnet run --project ../backend/TodoApp.Api.csproj',
      url: 'http://127.0.0.1:5000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },

    {
      // Angular app
      command: 'npm start',
      url: 'http://127.0.0.1:4200',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
});