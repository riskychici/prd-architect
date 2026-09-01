import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await page.goto('/');
});

test('tab bar mobile muncul', async ({ page }) => {
  await expect(page.getByRole('button', { name: /Editor PRD/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Preview PDF/i })).toBeVisible();
});

test('bisa pindah ke preview dari tab bar', async ({ page }) => {
  await page.getByRole('button', { name: /Preview PDF/i }).click();

  await expect(page.locator('#previewPanel')).toBeVisible();
});

test('bisa kembali ke editor dari tab bar', async ({ page }) => {
  await page.getByRole('button', { name: /Preview PDF/i }).click();
  await page.getByRole('button', { name: /Editor PRD/i }).click();

  await expect(page.locator('#editorPanel')).toBeVisible();
});
