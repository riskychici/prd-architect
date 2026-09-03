// apply-palette-cards.mjs
// Jalankan dari root proyek: node apply-palette-cards.mjs
// Kartu palette: blok warna besar di atas, lalu nama, hex (lebih besar),
// dan keterangan penggunaan pada baris terpisah di bawah hex.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Letakkan script ini di root proyek (sejajar dengan package.json).');
  process.exit(1);
}

// ============================================================
// 1) Timpa BrandingPreview.jsx dengan layout kartu yang disesuaikan
// ============================================================
const previewPath = path.join(root, 'src/components/preview/sections/BrandingPreview.jsx');
fs.writeFileSync(previewPath, String.raw`import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
import { buildBreakpoints, isValidHex } from '../../../utils/helpers';
export default function BrandingPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  const palette = usePrdStore(function (s) { return s.palette; });
  if (mode !== 'enterprise' && !se.branding) return null;
  return (
    <div className="space-y-2 keep-together">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-2 border-amber-500 pl-2 ml-1">
        1.2 Branding & Design System
      </h3>
      <div className="pl-3 space-y-2 text-xs text-slate-700">
        {palette.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 print:grid-cols-5 gap-2">
            {palette.map(function (p, i) {
              const hex = isValidHex(p.hex) ? p.hex : '#ffffff';
              return (
                <div key={i} className="border border-slate-200 rounded-md overflow-hidden bg-white keep-together">
                  <div
                    id={'preview-palette-swatch-' + i}
                    className="h-12 w-full border-b border-slate-200"
                    style={{ background: hex }}
                  />
                  <div className="p-2 space-y-0.5">
                    <p className="font-bold text-slate-900 text-[11px] leading-snug">{p.name || '-'}</p>
                    <p className="font-mono text-xs text-slate-800 leading-snug">
                      <span id={'preview-palette-hex-' + i}>{p.hex}</span>
                    </p>
                    {p.usage ? (
                      <p className="text-[10px] text-slate-500 leading-snug">{p.usage}</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="italic text-slate-400">Belum ada palette warna.</p>
        )}
        <p>
          <strong className="text-slate-900">Typography:</strong>{' '}
          <span>{f.brandTypography || '-'}</span>
        </p>
        <p>
          <strong className="text-slate-900">Prinsip Layout:</strong>{' '}
          <span>{f.brandLayout || '-'}</span>
        </p>
        <p>
          <strong className="text-slate-900">Breakpoint:</strong>{' '}
          <span className="font-mono">{buildBreakpoints(f) || '-'}</span>
        </p>
      </div>
    </div>
  );
}
`, 'utf8');
console.log('[OK]   src/components/preview/sections/BrandingPreview.jsx');

// ============================================================
// 2) Pastikan live color di BrandingSection.jsx memperbarui background blok
// ============================================================
const sectionPath = path.join(root, 'src/components/editor/sections/BrandingSection.jsx');
let src = fs.readFileSync(sectionPath, 'utf8');
const oldCode = "if (previewSwatch) previewSwatch.style.border = '8px solid ' + hex;";
const newCode = "if (previewSwatch) previewSwatch.style.background = hex;";
if (src.includes(newCode)) {
  console.log('[LEWAT] BrandingSection.jsx sudah disesuaikan');
} else if (src.includes(oldCode)) {
  src = src.replace(oldCode, newCode);
  fs.writeFileSync(sectionPath, src, 'utf8');
  console.log('[OK]   src/components/editor/sections/BrandingSection.jsx');
} else {
  console.error('[GAGAL] Pola updateDomColor tidak ditemukan di BrandingSection.jsx');
  process.exit(1);
}

console.log('');
console.log('Selesai. Hex kini lebih besar dan keterangan penggunaan berada di bawahnya.');
console.log('Jalankan npm run dev untuk melihat hasilnya.');