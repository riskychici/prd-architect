import { test, expect } from '@playwright/test';
import { mockGroq, mockGeminiStream, mockGeminiError } from './helpers/mockAi.js';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await page.goto('/');
});

test('analisis AI menampilkan hasil mock', async ({ page }) => {
  await mockGeminiStream(page, [
    '## 1. Analisis System Analyst\n',
    'PRD perlu menambahkan acceptance criteria yang lebih detail.',
  ]);

  const briefTextarea = page.getByPlaceholder(/Contoh: Aplikasi kasir/i);
  await briefTextarea.fill('Aplikasi kasir untuk warung kopi');

  await page.getByRole('button', { name: /Analisis PRD/i }).click();

  await expect(
    page.getByText('PRD perlu menambahkan acceptance criteria yang lebih detail.')
  ).toBeVisible({ timeout: 15000 });
});

test('tombol AI refine mengubah teks problem statement', async ({ page }) => {
  await mockGroq(
    page,
    'Pemilik warung kesulitan mencatat penjualan harian secara manual.'
  );

  const textarea = page.getByLabel('Latar Belakang / Problem Statement');
  await textarea.fill('masalah pencatatan');

  const tombolRefine = page.getByRole(
    'button',
    { name: 'Perhalus teks Problem Statement dengan AI' }
  );
  await tombolRefine.click();

  await expect(textarea).toHaveValue(
    'Pemilik warung kesulitan mencatat penjualan harian secara manual.'
  );
});

test('analisis AI menampilkan pesan error ketika API gagal', async ({ page }) => {
  await mockGeminiError(page, 429, 'Quota exceeded for free tier');

  const briefTextarea = page.getByPlaceholder(/Contoh: Aplikasi kasir/i);
  await briefTextarea.fill('Aplikasi kasir untuk warung kopi');

  await page.getByRole('button', { name: /Analisis PRD/i }).click();

  // PERBAIKAN: Gunakan .first() karena pesan error muncul di card AI dan juga di Toast notifikasi
  await expect(
    page.getByText(/Kuota harian/i).first()
  ).toBeVisible({ timeout: 10000 });
});