import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await page.goto('/');
});

test('aplikasi berhasil dimuat', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /PRD Architect/i })).toBeVisible();
  await expect(page.getByText('Live Preview Dokumen')).toBeVisible();
});

test('mode switcher tampil', async ({ page }) => {
  await expect(page.getByRole('button', { name: /Mode Simple/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Mode Enterprise/i })).toBeVisible();
});

test('tombol undo redo dan header tampil', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Undo (Ctrl+Z)' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Redo (Ctrl+Y)' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Muat Contoh/i })).toBeVisible();
  
  // PERBAIKAN: Gunakan exact: true agar tidak bentrok dengan tombol "Reset Semua"
  await expect(page.getByRole('button', { name: 'Reset', exact: true })).toBeVisible();
});