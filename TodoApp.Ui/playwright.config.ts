import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  use: {
    baseURL: 'http://localhost:4200',
    bypassCSP: true,
    trace: 'on-first-retry',
    launchOptions: {
      args: ['--disable-web-security'],
    },
  },

  webServer: [
    {
      command: '/usr/local/share/dotnet/dotnet run --urls "http://127.0.0.1:5005"',
      url: 'http://127.0.0.1:5005/swagger/index.html',
      reuseExistingServer: !process.env.CI,
      cwd: '../TodoApp.Api', // Klasör yolunun doğruluğundan emin ol
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
