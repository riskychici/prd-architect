import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await page.goto('/');
});

test('undo dan redo bekerja pada input nama proyek', async ({ page }) => {
  const inputNamaProyek = page.getByLabel('Nama Proyek / Aplikasi');

  await inputNamaProyek.fill('Kasir Kopi');

  const tombolUndo = page.getByRole('button', { name: 'Undo (Ctrl+Z)' });
  const tombolRedo = page.getByRole('button', { name: 'Redo (Ctrl+Y)' });

  await expect(tombolUndo).toBeEnabled();

  await tombolUndo.click();
  await expect(inputNamaProyek).toHaveValue('');

  await expect(tombolRedo).toBeEnabled();

  await tombolRedo.click();
  await expect(inputNamaProyek).toHaveValue('Kasir Kopi');
});
