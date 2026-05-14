import { test, expect } from '@playwright/test';

test('Todo full workflow - Stable Version', async ({ page }) => {
  // Creating a professional, traceable name for the task
  const timestamp = new Date().toLocaleTimeString('en-AU'); // Australia/Melbourne time format
  const taskName = `🚀 E2E Test Task - ${Math.floor(Math.random() * 9999)}`;
  const taskDesc = `Automated check performed by Playwright CI at ${timestamp}. Verified for cross-browser stability.`;

  // 1. LOGIN
  // Navigating to the local environment (or CI production URL)
  await page.goto('http://localhost:4200/login');
  await page.getByRole('textbox', { name: /username/i }).fill('veysel');
  await page.getByRole('button', { name: /get started/i }).click();

  // Ensuring we are on the dashboard before proceeding
  await expect(page).toHaveURL(/todos/, { timeout: 10000 });

  // 2. CREATE TASK (Seed Data for Test Isolation)
  await page.getByRole('button', { name: /new task/i }).click();
  
  // Fill in the title with the descriptive test name
  const titleInput = page.getByRole('textbox', { name: /task title/i });
  await titleInput.waitFor({ state: 'visible' });
  await titleInput.fill(taskName);

  // Interaction with PrimeNG Calendar/DatePicker
  await page.getByRole('combobox', { name: /deadline/i }).click();
  await page.getByText('25', { exact: true }).first().click();

  // Submit the form
  await page.getByRole('button', { name: /create task/i }).click();
  
  // Confirm via PrimeNG Dialog
  const confirmCreate = page.getByRole('button', { name: /yes/i });
  await confirmCreate.waitFor({ state: 'visible' });
  await confirmCreate.click();

  // 3. VERIFY & EDIT
  // Locate the specific row created during this run to ensure test isolation
  const row = page.locator('p-table tbody tr').filter({ hasText: taskName }).first();
  await expect(row).toBeVisible({ timeout: 15000 });

  // Triggering the Edit Modal
  await row.locator('button:has(.pi-pencil)').click({ force: true });
  const dialog = page.locator('.p-dialog').first();
  await dialog.waitFor({ state: 'visible' });
  
  // Save changes without modification just to test the update flow
  await dialog.getByRole('button', { name: /save changes/i }).click({ force: true });
  await page.getByRole('button', { name: /yes/i }).click();

  // 4. DELETE (Cleanup Stage)
  // Ensures we leave the database clean after the test run
  await expect(row).toBeVisible();
  await row.locator('button:has(.pi-trash)').click({ force: true });
  await page.getByRole('button', { name: /yes/i }).click();

  // 5. LOGOUT
  await page.locator('.p-avatar').click();
  await page.getByText(/logout/i).click();

  // Verify the user is redirected back to the login page
  await expect(page).toHaveURL(/login/);
});