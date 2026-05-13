import { test, expect, Page, Locator } from '@playwright/test';


test('Todo full workflow stable', async ({ page }) => {

  // -------------------------
  // SETUP + LOGIN
  // -------------------------
  await page.goto('http://localhost:4200/login');

  await page.getByRole('textbox', { name: /username/i }).fill('veysel');
  await page.getByRole('button', { name: /get started/i }).click();

  await expect(page).toHaveURL(/todos/);

  // wait app ready
  await expect(page.locator('p-table')).toBeVisible();

  // clear possible overlays
  await page.waitForTimeout(500);

  // -------------------------
  // DEMO DATA
  // -------------------------
  await page.getByRole('button', { name: /add demo data/i }).click();
  await page.getByRole('button', { name: /yes/i }).click();

  await page.waitForTimeout(500);

  // -------------------------
  // CREATE TASK
  // -------------------------
  const taskName = `test-${Date.now()}`;

  await page.getByRole('button', { name: /new task/i }).click();

  await page.getByRole('textbox', { name: /task title/i }).fill(taskName);

  await page.getByRole('combobox', { name: /deadline/i }).click();
  await page.getByText('20', { exact: true }).click();
  await page.keyboard.press('Escape');

  await page.getByRole('textbox', { name: /description/i })
    .fill('auto test task');

  await page.getByRole('button', { name: /create task/i }).click();
  await page.getByRole('button', { name: /yes/i }).click();

  // verify task exists (STRICT SAFE)
  const row = page.locator('p-table tbody tr', { hasText: taskName });
  await expect(row).toBeVisible();

  // -------------------------
  // EDIT / COMPLETE TASK
  // -------------------------
  await page.waitForSelector('.p-datatable-mask', { state: 'detached', timeout: 10000 }).catch(() => {});
  await page.waitForSelector('.p-dialog-mask', { state: 'detached', timeout: 10000 }).catch(() => {});
  await row.first().scrollIntoViewIfNeeded();
  const editBtn = row.locator('button:has(.pi-pencil)');
  await expect(editBtn.first()).toBeVisible({ timeout: 5000 });
  try {
    await editBtn.first().click({ timeout: 3000 });
  } catch {
    await editBtn.first().evaluate((b: HTMLElement) => (b as HTMLElement).click());
  }

  // wait modal
  const dialog = page.locator('.p-dialog');
  await expect(dialog).toBeVisible({ timeout: 10000 });

  // mark completed
  const isCompletedInput = dialog.locator('input#isCompleted, input[id="isCompleted"]');
  await expect(isCompletedInput.first()).toBeVisible({ timeout: 5000 });
  try {
    await isCompletedInput.first().click({ timeout: 2000 });
  } catch {
    await isCompletedInput.first().evaluate((el: HTMLInputElement) => {
      el.checked = !el.checked;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  // save
  const saveBtn = page.getByRole('button', { name: /save changes/i });
  await expect(saveBtn).toBeVisible();
  await expect(saveBtn).toBeEnabled();

  await saveBtn.click();

  await page.getByRole('button', { name: /yes/i }).click();

  // -------------------------
  // FILTER DATE
  // -------------------------
  await page.getByRole('button', { name: /choose date/i }).first().click();

  await page.getByText('9', { exact: true }).click();
  await page.keyboard.press('Escape');

  // cleanup overlays again
  await page.waitForTimeout(500);

  // -------------------------
  // LOGOUT
  // -------------------------
  // Click avatar (PrimeNG p-avatar) to open profile menu 
  const avatar = page.locator('p-avatar, .p-avatar');
  await expect(avatar.first()).toBeVisible({ timeout: 5000 });
  await avatar.first().click();

  // Click logout from menu
  try {
    await page.getByRole('menuitem', { name: /logout/i }).click({ timeout: 5000 });
  } catch {
    await page.getByText(/logout/i).click();
  }

  await expect(page).toHaveURL(/login|auth/);
});