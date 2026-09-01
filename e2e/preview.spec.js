import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await page.goto('/');
});

test('export JSON menghasilkan file download', async ({ page }) => {
  const inputNamaProyek = page.getByLabel('Nama Proyek / Aplikasi');

  await inputNamaProyek.fill('Kasir Kopi');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Ekspor JSON' }).click(),
  ]);

  const filename = download.suggestedFilename();

  expect(filename).toContain('.json');
});

test('import JSON mengisi form', async ({ page }) => {
  const fileInput = page.locator('input[accept=".json"]');

  await fileInput.setInputFiles('e2e/fixtures/sample-import.json');

  const inputNamaProyek = page.getByLabel('Nama Proyek / Aplikasi');

  await expect(inputNamaProyek).toHaveValue('Prime Property');
});

test('mode print menyembunyikan editor dan menampilkan preview', async ({ page }) => {
  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('#editorPanel')).toBeHidden();
  await expect(page.locator('#previewPanel')).toBeVisible();
});
