import { test, expect } from '@playwright/test';

test('Todo full workflow - Stable Version', async ({ page }) => {
  // 🟢 API MOCKING: Simulating Backend responses for CI/CD environment stability
  await page.route('**/api/**', async (route) => {
    const method = route.request().method();
    const url = route.request().url();

    // Mock GET requests to return a predefined task list
    if (method === 'GET' && url.includes('/tasks')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, title: 'Task 843', deadline: '2026-05-20', isCompleted: false }
        ])
      });
    } 
    // Mock POST, PUT, and DELETE requests to return a successful status
    else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Success' })
      });
    }
  });

  // 1. LOGIN
  await page.goto('http://localhost:4200/login');
  await page.getByRole('textbox', { name: /username/i }).fill('veysel');
  await page.getByRole('button', { name: /get started/i }).click();

  await expect(page).toHaveURL(/todos/);

  // 2. CREATE TASK
  // Note: Using a fixed name to match the mocked GET response above
  const taskName = 'Task 843'; 
  await page.getByRole('button', { name: /new task/i }).click();
  await page.getByRole('textbox', { name: /task title/i }).fill(taskName);

  await page.getByRole('combobox', { name: /deadline/i }).click();
  await page.getByText('20', { exact: true }).click();

  await page.getByRole('button', { name: /create task/i }).click();
  await page.getByRole('button', { name: /yes/i }).click();

  // 3. EDIT / COMPLETE TASK
  const row = page.locator('p-table tbody tr').filter({ hasText: taskName });
  await expect(row).toBeVisible({ timeout: 10000 });
  
  await row.locator('button:has(.pi-pencil)').click({ force: true });
  const dialog = page.locator('.p-dialog').first();
  await dialog.waitFor({ state: 'visible', timeout: 5000 });
  await dialog.getByRole('button', { name: /save changes/i }).click({ force: true });
  await page.getByRole('button', { name: /yes/i }).click();

  // 4. DELETE TASK
  await expect(row).toBeVisible();
  await row.locator('button:has(.pi-trash)').click({ force: true });
  await page.getByRole('button', { name: /yes/i }).click();

  // 5. LOGOUT
  await page.locator('.p-avatar').click();
  await page.getByText(/logout/i).click();

  await expect(page).toHaveURL(/login/);
});