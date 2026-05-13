import { test, expect } from '@playwright/test';

test('Todo full workflow - Stable Version', async ({ page }) => {
  // 1. LOGIN
  await page.goto('http://localhost:4200/login');
  await page.getByRole('textbox', { name: /username/i }).fill('veysel');
  await page.getByRole('button', { name: /get started/i }).click();

  await expect(page).toHaveURL(/todos/);

  // 2. CREATE TASK
  const taskName = `Task ${Math.floor(Math.random() * 1000)}`; // Simpler unique name
  await page.getByRole('button', { name: /new task/i }).click();
  await page.getByRole('textbox', { name: /task title/i }).fill(taskName);

  await page.getByRole('combobox', { name: /deadline/i }).click();
  await page.getByText('20', { exact: true }).click();

  await page.getByRole('button', { name: /create task/i }).click();
  await page.getByRole('button', { name: /yes/i }).click();

  // 3. EDIT / COMPLETE TASK
  const row = page.locator('p-table tbody tr', { hasText: taskName });
  await expect(row).toBeVisible();
 await page.waitForTimeout(5000);
  await row.locator('button:has(.pi-pencil)').click({ force: true });
  await page.waitForTimeout(1000);
  const dialog = page.locator('.p-dialog').first();
  await dialog.waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(5000);
  await dialog.getByRole('button', { name: /save changes/i }).click({ force: true });
  await page.getByRole('button', { name: /yes/i }).click();
  // 4. LOGOUT
  await page.locator('.p-avatar').click();
  await page.getByText(/logout/i).click();

  await expect(page).toHaveURL(/login/);
});
