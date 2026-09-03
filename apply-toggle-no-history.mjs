// apply-toggle-no-history.mjs
// Jalankan dari root proyek: node apply-toggle-no-history.mjs
// Membuat toggle "Warna sampul & footer otomatis mengikuti palette branding"
// tidak memicu commit history, sehingga Undo/Redo tidak aktif hanya karena
// menyalakan atau mematikan toggle tersebut.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Letakkan script ini di root proyek (sejajar dengan package.json).');
  process.exit(1);
}

let gagal = 0;

// ============================================================
// 1) App.jsx: lewati commit untuk input di dalam [data-no-history]
// ============================================================
const appPath = path.join(root, 'src/App.jsx');
let app = fs.readFileSync(appPath, 'utf8');
const oldApp = "if (e.target.matches && e.target.matches('input, textarea, select')) commit();";
const newApp = "if (e.target.matches && e.target.matches('input, textarea, select')) {\n        if (e.target.closest && e.target.closest('[data-no-history]')) return;\n        commit();\n      }";
if (app.includes('data-no-history')) {
  console.log('[LEWAT] App.jsx sudah mendukung data-no-history');
} else if (app.includes(oldApp)) {
  app = app.replace(oldApp, newApp);
  fs.writeFileSync(appPath, app, 'utf8');
  console.log('[OK]   src/App.jsx');
} else {
  gagal++;
  console.error('[GAGAL] Pola onInput tidak ditemukan di App.jsx');
}

// ============================================================
// 2) CoverFooterSection.jsx: tandai toggle auto theme
// ============================================================
const coverPath = path.join(root, 'src/components/editor/sections/CoverFooterSection.jsx');
let cover = fs.readFileSync(coverPath, 'utf8');
const oldToggle = '<ToggleSwitch checked={auto} onChange={handleToggleAuto} label="Warna sampul & footer otomatis mengikuti palette branding" />';
const newToggle = '<div data-no-history="true">\n          <ToggleSwitch checked={auto} onChange={handleToggleAuto} label="Warna sampul & footer otomatis mengikuti palette branding" />\n        </div>';
if (cover.includes('data-no-history')) {
  console.log('[LEWAT] CoverFooterSection.jsx sudah ditandai');
} else if (cover.includes(oldToggle)) {
  cover = cover.replace(oldToggle, newToggle);
  fs.writeFileSync(coverPath, cover, 'utf8');
  console.log('[OK]   src/components/editor/sections/CoverFooterSection.jsx');
} else {
  gagal++;
  console.error('[GAGAL] Toggle auto theme tidak ditemukan di CoverFooterSection.jsx');
}

if (gagal > 0) {
  console.error('Selesai dengan ' + gagal + ' kesalahan. Periksa pesan di atas.');
  process.exit(1);
}
console.log('');
console.log('Selesai. Menyalakan/mematikan toggle warna otomatis tidak lagi');
console.log('mengaktifkan tombol Undo/Redo.');
console.log('Jalankan npm run dev untuk mencoba.');