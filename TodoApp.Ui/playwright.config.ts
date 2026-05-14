import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },

  webServer: [
    {
      command: 'dotnet run',
      url: 'http://localhost:5000',
      reuseExistingServer: !process.env.CI,
      cwd: '../TodoApp.Api',
      timeout: 120 * 1000,
    },
    {
      command: 'npm start',
      url: 'http://localhost:4200',
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