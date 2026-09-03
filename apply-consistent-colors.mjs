// apply-consistent-colors.mjs
// Jalankan dari root proyek: node apply-consistent-colors.mjs
// 1) Menyamakan warna section & subsection (semua mengikuti warna primary dokumen).
// 2) Menambahkan zebra stripe (baris selang-seling) pada semua tabel dokumen.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Letakkan script ini di root proyek (sejajar dengan package.json).');
  process.exit(1);
}

// ============================================================
// 1) globals.css: samakan warna heading + zebra stripe tabel
// ============================================================
const cssPath = path.join(root, 'src/styles/globals.css');
let css = fs.readFileSync(cssPath, 'utf8');
let ubah = 0;

// Semua aturan warna amber (subsection, kode AC, ikon schema)
// diarahkan ke variable primary agar sama dengan section.
const swaps = [
  ['h3.text-amber-700 { color: var(--doc-accent-text); }', 'h3.text-amber-700 { color: var(--doc-primary-text); }'],
  ['h3.border-amber-500 { border-left-color: var(--doc-accent); }', 'h3.border-amber-500 { border-left-color: var(--doc-primary); }'],
  ['p.text-amber-700 { color: var(--doc-accent-text); }', 'p.text-amber-700 { color: var(--doc-primary-text); }'],
  ['.border-amber-400 { border-left-color: var(--doc-accent); }', '.border-amber-400 { border-left-color: var(--doc-primary); }'],
  ['.text-amber-600 { color: var(--doc-accent-text); }', '.text-amber-600 { color: var(--doc-primary-text); }'],
];
swaps.forEach(function (pair) {
  if (css.includes(pair[0])) {
    css = css.replace(pair[0], pair[1]);
    ubah++;
  }
});

// Zebra stripe: baris genap abu-abu muda, ganjil putih, seperti contoh.
const anchor = '.text-amber-600 { color: var(--doc-primary-text); }';
const zebra =
  '\n#prdDocument tbody tr:nth-child(odd) { background: #ffffff; }' +
  '\n#prdDocument tbody tr:nth-child(even) { background: #f3f4f6; }';
if (css.includes('tbody tr:nth-child')) {
  console.log('[LEWAT] aturan zebra sudah ada di globals.css');
} else {
  const idx = css.indexOf(anchor);
  if (idx !== -1) {
    const end = idx + anchor.length;
    css = css.slice(0, end) + zebra + css.slice(end);
  } else {
    css = css.trimEnd() + '\n' + zebra + '\n';
  }
  ubah++;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('[OK]   src/styles/globals.css (' + ubah + ' perubahan)');

// ============================================================
// 2) TechStackPreview.jsx: hapus background bawaan agar zebra terlihat rata
// ============================================================
const tsPath = path.join(root, 'src/components/preview/sections/TechStackPreview.jsx');
let ts = fs.readFileSync(tsPath, 'utf8');
let tsUbah = 0;
if (ts.includes('border border-slate-200 bg-slate-50 keep-together')) {
  ts = ts.replace('border border-slate-200 bg-slate-50 keep-together', 'border border-slate-200 keep-together');
  tsUbah++;
}
if (ts.includes('p-2 font-bold bg-slate-100 text-slate-700')) {
  ts = ts.replace('p-2 font-bold bg-slate-100 text-slate-700', 'p-2 font-bold text-slate-700');
  tsUbah++;
}
if (tsUbah > 0) {
  fs.writeFileSync(tsPath, ts, 'utf8');
  console.log('[OK]   src/components/preview/sections/TechStackPreview.jsx');
} else {
  console.log('[LEWAT] TechStackPreview.jsx sudah bersih');
}

console.log('');
console.log('Selesai. Section & subsection kini satu warna (primary dokumen),');
console.log('dan baris tabel tampil selang-seling putih/abu seperti contoh.');
console.log('Jalankan npm run dev untuk melihat hasilnya.');