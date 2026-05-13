import { test, expect } from '@playwright/test';

test('Full User Workflow: Login, Task Management and Dashboard Analytics', async ({ page }) => {
  // 1. Giriş ve Sayfa Yükleme
  await page.goto('http://localhost:4200/login');
  await page.getByRole('textbox', { name: 'Username' }).fill('veysel');
  await page.getByRole('button', { name: /Get Started/i }).click();

  // Dashboard'un yüklendiğinden emin olalım (URL veya bir başlık kontrolü)
  await expect(page).toHaveURL(/.*todos/);

  // 2. Temizlik Operasyonu (Delete)
  // Önce tablodaki o "maske" (loading) perdesinin gitmesini bekle
  const mask = page.locator('.p-datatable-mask');
  await expect(mask).not.toBeVisible({ timeout: 10000 });

  //toplu veri silme
  await page.locator('[data-testid="main-checkbox"] input').dispatchEvent('click');
  await page.getByRole('button', { name: ' Delete Selected' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();

  // 3. Yeni Task Ekleme
  await page.getByRole('button', { name: /New Task/i }).click();
  await page.getByRole('textbox', { name: 'Task Title *' }).fill('Playwright Otomasyon Testi');

  // Takvim (Deadline)
  await page.getByRole('combobox', { name: 'Deadline' }).click();
  await page.getByRole('gridcell', { name: '20' }).first().click(); // 20 rakamına sahip ilk hücre

  await page
    .getByRole('textbox', { name: 'Description' })
    .fill('Bu görev Playwright tarafından otomatik oluşturuldu.');
  await page.getByRole('button', { name: /Create Task/i }).click();
  await page.getByRole('button', { name: 'Yes' }).click();

  // 4. Analytics & Filtreleme (Dashboard Kısmı)
  // Başlangıç Tarihi
  await page.getByRole('button', { name: 'Choose Date' }).first().click();
  await page.getByText('11', { exact: true }).first().click();

  // Bitiş Tarihi
  await page.getByRole('button', { name: 'Choose Date' }).last().click();
  // 27 rakamını içeren son görünür elemana tıkla
  await page.locator('.p-datepicker-calendar').locator('text=27').last().click();

  // Update ve Doğrulama
  const updateBtn = page.getByRole('button', { name: /Update/i });
  await updateBtn.click();

  // Backend'den veri geldiğini kanıtlayan yazı
  await expect(page.locator('text=Live Backend Data')).toBeVisible();
});
