// apply-schema-header.mjs
// Jalankan dari root proyek: node apply-schema-header.mjs
// Menyamakan warna header tabel di section 4.1 Schema Data
// dengan header tabel 2. Fitur Utama & Requirements (gelap + teks putih).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Letakkan script ini di root proyek (sejajar dengan package.json).');
  process.exit(1);
}

const target = path.join(root, 'src/components/preview/sections/SchemaPreview.jsx');
let src;
try {
  src = fs.readFileSync(target, 'utf8');
} catch (e) {
  console.error('[GAGAL] Tidak bisa membaca SchemaPreview.jsx : ' + e.message);
  process.exit(1);
}

const oldThead = '<thead className="bg-slate-100 text-slate-700">';
const newThead = '<thead className="bg-slate-800 text-white">';

if (src.indexOf(oldThead) === -1) {
  if (src.indexOf(newThead) !== -1) {
    console.log('[LEWAT] Header tabel Schema sudah memakai warna gelap.');
  } else {
    console.error('[GAGAL] Pola thead tidak ditemukan di SchemaPreview.jsx');
    process.exit(1);
  }
} else {
  const jumlah = src.split(oldThead).length - 1;
  src = src.split(oldThead).join(newThead);
  fs.writeFileSync(target, src, 'utf8');
  console.log('[OK]   src/components/preview/sections/SchemaPreview.jsx (' + jumlah + ' thead diubah)');
}

console.log('');
console.log('Selesai. Header tabel Schema Data kini gelap seperti tabel Fitur Utama.');
console.log('Jalankan npm run dev untuk melihat hasilnya.');