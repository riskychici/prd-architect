import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // PERBAIKAN: Gunakan evaluate alih-alih addInitScript.
  // addInitScript akan berjalan ulang setiap kali page.reload() dipanggil,
  // sehingga menghapus localStorage tepat sebelum aplikasi membaca datanya.
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();
});

test('autosave menyimpan data ke localStorage', async ({ page }) => {
  const inputNamaProyek = page.getByLabel('Nama Proyek / Aplikasi');

  await inputNamaProyek.fill('Kasir Kopi');

  // Tunggu sampai localStorage benar-benar mengandung "Kasir Kopi"
  await page.waitForFunction((key) => {
    const data = localStorage.getItem(key);
    return data && data.includes('Kasir Kopi');
  }, 'prdArchitectV4', { timeout: 5000 });

  const saved = await page.evaluate((key) => {
    return localStorage.getItem(key);
  }, 'prdArchitectV4');

  expect(saved).toContain('Kasir Kopi');
});

test('data tetap ada setelah reload', async ({ page }) => {
  const inputNamaProyek = page.getByLabel('Nama Proyek / Aplikasi');

  await inputNamaProyek.fill('Kasir Kopi');

  // Tunggu sampai localStorage benar-benar mengandung "Kasir Kopi"
  await page.waitForFunction((key) => {
    const data = localStorage.getItem(key);
    return data && data.includes('Kasir Kopi');
  }, 'prdArchitectV4', { timeout: 5000 });

  await page.reload();

  // Tunggu aplikasi selesai render ulang setelah reload
  await expect(page.getByRole('heading', { name: /PRD Architect/i })).toBeVisible();

  // Evaluasi ulang locator pada DOM yang baru
  await expect(page.getByLabel('Nama Proyek / Aplikasi')).toHaveValue('Kasir Kopi');
});