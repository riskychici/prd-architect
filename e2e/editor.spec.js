import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await page.goto('/');
});

test('nama proyek yang diisi muncul di cover preview', async ({ page }) => {
  const inputNamaProyek = page.getByLabel('Nama Proyek / Aplikasi');
  await inputNamaProyek.fill('Kasir Kopi');

  const coverTitle = page.locator('.doc-cover h1');
  await expect(coverTitle).toContainText('KASIR KOPI');
});

test('problem statement yang diisi muncul di preview', async ({ page }) => {
  const inputProblem = page.getByLabel('Latar Belakang / Problem Statement');
  await inputProblem.fill('Pemilik warung sulit mencatat penjualan harian.');

  const previewText = page.locator('#prdDocument');
  await expect(previewText).toContainText(
    'Pemilik warung sulit mencatat penjualan harian.'
  );
});

test('mode enterprise menampilkan section NFR', async ({ page }) => {
  await page.getByRole('button', { name: /Mode Enterprise/i }).click();

  await expect(
    page.getByText('NFR, Keamanan & Figma Prototype')
  ).toBeVisible();
});

test('toggle persona menampilkan section persona di mode simple', async ({ page }) => {
  const togglePersona = page.getByLabel('Persona & KPI Sukses');
  await togglePersona.check();

  // PERBAIKAN: Gunakan locator ID karena getByLabel bentrok dengan aria-label tombol AI Refine
  await expect(
    page.locator('#userPersona')
  ).toBeVisible();
});

test('reset mengosongkan form', async ({ page }) => {
  const inputNamaProyek = page.getByLabel('Nama Proyek / Aplikasi');
  await inputNamaProyek.fill('Kasir Kopi');

  // PERBAIKAN: Gunakan exact: true agar tidak memilih tombol "Reset Semua" di section Extras
  await page.getByRole('button', { name: 'Reset', exact: true }).click();

  await expect(inputNamaProyek).toHaveValue('');
});

test('muat contoh mengisi data Instagram', async ({ page }) => {
  await page.getByRole('button', { name: /Muat Contoh/i }).click();

  const inputNamaProyek = page.getByLabel('Nama Proyek / Aplikasi');
  await expect(inputNamaProyek).toHaveValue('Instagram');
});