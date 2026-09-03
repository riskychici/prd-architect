// apply-section-format.mjs
// Jalankan dari root proyek: node apply-section-format.mjs
// Mengembalikan format dokumen ke gaya semula, dengan pembeda halus:
// section = teks lebih besar + bar kiri 4px,
// subsection = teks kecil + bar kiri 2px + indentasi ringan.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Letakkan script ini di root proyek (sejajar dengan package.json).');
  process.exit(1);
}

const FILES = {};

FILES['src/components/preview/sections/OverviewPreview.jsx'] = String.raw`import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
export default function OverviewPreview() {
  const f = usePrdStore(function (s) { return s.fields; });
  return (
    <div className="space-y-2 keep-together">
      <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">1. Overview & Goals</h3>
      <div className="pl-3 space-y-2 text-xs text-slate-700">
        <p><strong className="text-slate-900">Latar Belakang:</strong> <span className="italic text-slate-600">{f.problemStatement || 'Belum diisi.'}</span></p>
        <p><strong className="text-slate-900">Tujuan Utama:</strong> <span className="italic text-slate-600">{f.productGoal || 'Belum diisi.'}</span></p>
      </div>
    </div>
  );
}
`;

FILES['src/components/preview/sections/PersonaPreview.jsx'] = String.raw`import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
export default function PersonaPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  if (mode !== 'enterprise' && !se.persona) return null;
  return (
    <div className="space-y-2 keep-together">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-2 border-amber-500 pl-2 ml-1">1.1 Target User Persona & Success Metrics</h3>
      <div className="pl-3 space-y-2 text-xs text-slate-700">
        <p><strong className="text-slate-900">Target User Persona:</strong> <span>{f.userPersona || '-'}</span></p>
        <p><strong className="text-slate-900">Metrik & KPI Utama:</strong> <span>{f.successMetrics || '-'}</span></p>
      </div>
    </div>
  );
}
`;

FILES['src/components/preview/sections/BrandingPreview.jsx'] = String.raw`import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
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
        <div className="space-y-1">
          {palette.length ? palette.map(function (p, i) {
            const hex = isValidHex(p.hex) ? p.hex : '#ffffff';
            return (
              <div key={i} className="flex items-center space-x-2">
                <span
                  id={'preview-palette-swatch-' + i}
                  className="w-4 h-4 rounded shrink-0"
                  style={{ border: '8px solid ' + hex, outline: '1px solid #cbd5e1' }}
                />
                <span className="font-semibold text-slate-900">{p.name || '-'}</span>
                <span id={'preview-palette-hex-' + i} className="font-mono text-slate-500">
                  {p.hex}
                </span>
                <span className="text-slate-500">{'\u00B7'} {p.usage}</span>
              </div>
            );
          }) : (
            <p className="italic text-slate-400">Belum ada palette warna.</p>
          )}
        </div>
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
`;

FILES['src/components/preview/sections/RolesPreview.jsx'] = String.raw`import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
export default function RolesPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const roles = usePrdStore(function (s) { return s.roles; });
  if (mode !== 'enterprise' && !se.roles) return null;
  const splitLines = function (text) {
    if (!text) return [];
    return text
      .split('\n')
      .map(function (line) {
        return line.replace(/^[\s\|\-\*\•\d+\.\)]+/, '').trim();
      })
      .filter(function (line) { return line.length > 0; });
  };
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-2 border-amber-500 pl-2 ml-1">1.3 Role & Permission Matrix</h3>
      <div className="pl-3 grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3">
        {roles.length ? roles.map(function (r, i) {
          const canItems = splitLines(r.can);
          const cannotItems = splitLines(r.cannot);
          return (
            <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded keep-together space-y-2">
              <h4 className="font-bold text-slate-900 mb-1">{r.name || 'Role'}</h4>
              <div className="space-y-1">
                <p className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                  <FontAwesomeIcon icon={faCircleCheck} /> Diizinkan:
                </p>
                {canItems.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-0.5 text-emerald-700 text-xs">
                    {canItems.map(function (item, idx) { return <li key={idx}>{item}</li>; })}
                  </ul>
                ) : (<p className="text-slate-400 italic text-xs">-</p>)}
              </div>
              <div className="space-y-1">
                <p className="text-rose-700 font-semibold text-[11px] flex items-center gap-1">
                  <FontAwesomeIcon icon={faCircleXmark} /> Dilarang:
                </p>
                {cannotItems.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-0.5 text-rose-700 text-xs">
                    {cannotItems.map(function (item, idx) { return <li key={idx}>{item}</li>; })}
                  </ul>
                ) : (<p className="text-slate-400 italic text-xs">-</p>)}
              </div>
            </div>
          );
        }) : <p className="italic text-slate-400">Belum ada role.</p>}
      </div>
    </div>
  );
}
`;

FILES['src/components/preview/sections/FeaturesPreview.jsx'] = String.raw`import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
export default function FeaturesPreview() {
  const features = usePrdStore(function (s) { return s.features; });
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">2. Fitur Utama & Requirements</h3>
      <table className="w-full text-xs border-collapse border border-slate-200 mt-2 tbl-stack">
        <thead className="bg-slate-800 text-white"><tr><th className="p-2 text-left w-12">ID</th><th className="p-2 text-left w-1/3">Nama Fitur</th><th className="p-2 text-left">Deskripsi</th><th className="p-2 text-center w-24">Prioritas</th></tr></thead>
        <tbody className="divide-y divide-slate-200">
          {features.length ? features.map(function (f) {
            let b = 'bg-slate-200 text-slate-800';
            if (f.priority === 'High') b = 'bg-rose-100 text-rose-800 font-bold';
            if (f.priority === 'Medium') b = 'bg-amber-100 text-amber-800 font-bold';
            if (f.priority === 'Low') b = 'bg-blue-100 text-blue-800';
            return (
              <tr key={f.id}><td data-label="ID" className="p-2 font-bold text-slate-900">{f.id}</td><td data-label="Fitur" className="p-2 font-semibold text-slate-800">{f.name || '-'}</td><td data-label="Deskripsi" className="p-2 text-slate-600">{f.story || '-'}</td><td data-label="Prioritas" className="p-2 text-center"><span className={'px-2 py-0.5 rounded text-[10px] ' + b}>{f.priority}</span></td></tr>
            );
          }) : <tr><td colSpan="4" className="p-3 text-center text-slate-400 italic">Belum ada fitur.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
`;

FILES['src/components/preview/sections/AcPreview.jsx'] = String.raw`import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
export default function AcPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const ac = usePrdStore(function (s) { return s.acModules; });
  if (mode !== 'enterprise' && !se.ac) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-2 border-amber-500 pl-2 ml-1">2.1 Acceptance Criteria per Modul</h3>
      <div className="pl-3 space-y-3">
        {ac.length ? ac.map(function (m, mi) {
          return (
            <div key={mi} className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900">{mi + 1}. {m.title || 'Modul'}</h4>
              <div className="space-y-1.5">{m.items.map(function (it, ii) {
                return (
                  <div key={ii} className="pl-3 border-l-2 border-amber-400 keep-together">
                    <p className="font-bold text-amber-700">AC-{mi + 1}.{ii + 1} {it.title}</p>
                    <p className="text-slate-700">{it.desc}</p>
                  </div>
                );
              })}</div>
            </div>
          );
        }) : <p className="italic text-slate-400">Belum ada acceptance criteria.</p>}
      </div>
    </div>
  );
}
`;

FILES['src/components/preview/sections/SchemaPreview.jsx'] = String.raw`import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
export default function SchemaPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const st = usePrdStore(function (s) { return s.schemaTables; });
  if (mode !== 'enterprise' && !se.schema) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-2 border-amber-500 pl-2 ml-1">4.1 Schema Data</h3>
      <div className="pl-3 space-y-4">
        {st.length ? st.map(function (t, ti) {
          return (
            <div key={ti} className="space-y-1 keep-together">
              <h4 className="text-xs font-bold text-slate-900 font-mono flex items-center gap-2"><FontAwesomeIcon icon={faDatabase} className="text-amber-600" /><span>{t.name || 'tabel_tanpa_nama'}</span></h4>
              {t.desc && <p className="text-[11px] text-slate-500 pl-6">{t.desc}</p>}
              <table className="w-full text-xs border-collapse border border-slate-200 tbl-stack">
                <thead className="bg-slate-100 text-slate-700"><tr><th className="p-2 text-left w-[24%]">Field</th><th className="p-2 text-left w-[26%]">Tipe</th><th className="p-2 text-center w-[14%]">Not Null</th><th className="p-2 text-left">Keterangan</th></tr></thead>
                <tbody className="divide-y divide-slate-200">
                  {t.fields.length ? t.fields.map(function (s, fi) {
                    return (
                      <tr key={fi}><td data-label="Kolom" className="p-2 font-mono font-semibold text-slate-900">{s.field || '-'}</td><td data-label="Tipe" className="p-2 text-slate-600 font-mono">{s.type || '-'}</td><td data-label="Not Null" className="p-2 text-center"><FontAwesomeIcon icon={s.required === 'Ya' ? faCheck : faMinus} className={s.required === 'Ya' ? 'text-emerald-600' : 'text-slate-400'} /></td><td data-label="Keterangan" className="p-2 text-slate-600">{s.note}</td></tr>
                    );
                  }) : <tr><td colSpan="4" className="p-2 text-center text-slate-400 italic">Belum ada kolom.</td></tr>}
                </tbody>
              </table>
            </div>
          );
        }) : <p className="italic text-slate-400">Belum ada schema.</p>}
      </div>
    </div>
  );
}
`;

FILES['src/components/preview/sections/NfrPreview.jsx'] = String.raw`import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
export default function NfrPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  if (mode !== 'enterprise' && !se.nfr) return null;
  const isFigmaLink = f.figmaLink && /^https?:\/\//i.test(f.figmaLink);
  return (
    <div className="space-y-2 keep-together">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-2 border-amber-500 pl-2 ml-1">4.2 NFR, Prototype & Analisis Risiko</h3>
      <div className="pl-3 space-y-2 text-xs text-slate-700">
        <p><strong className="text-slate-900">Keamanan:</strong> <span>{f.nfrSpecs || '-'}</span></p>
        <p><strong className="text-slate-900">Performance:</strong> <span>{f.nfrPerformance || '-'}</span></p>
        <p><strong className="text-slate-900">Lokalisasi:</strong> <span>{f.nfrLocalization || '-'}</span></p>
        <p><strong className="text-slate-900">Browser:</strong> <span>{f.nfrBrowser || '-'}</span></p>
        <p>
          <strong className="text-slate-900">Figma:</strong>{' '}
          {isFigmaLink ? (
            <a href={f.figmaLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-mono">
              {f.figmaLink}
            </a>
          ) : (
            <span className="font-mono">{f.figmaLink || '-'}</span>
          )}
        </p>
        <p><strong className="text-slate-900">Risiko:</strong> <span>{f.riskMitigation || '-'}</span></p>
      </div>
    </div>
  );
}
`;

FILES['src/components/preview/sections/TechStackPreview.jsx'] = String.raw`import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
import { TECH_REQUIRED, TECH_OPTIONAL } from '../../../utils/constants';
export default function TechStackPreview() {
  const f = usePrdStore(function (s) { return s.fields; });
  const techOptional = usePrdStore(function (s) { return s.techOptional; });
  const rows = TECH_REQUIRED.map(function (d) { return { label: d.label, value: f[d.key] }; })
    .concat(TECH_OPTIONAL.filter(function (d) { return techOptional.includes(d.key); })
    .map(function (d) { return { label: d.label, value: f[d.key] }; }));
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">4. Spesifikasi Tech Stack & Arsitektur</h3>
      <div className="pl-3 space-y-3 text-xs text-slate-700">
        <table className="w-full text-xs border-collapse border border-slate-200 bg-slate-50 keep-together tbl-stack">
          <tbody>
            {rows.map(function (r, i) {
              return (
                <tr key={i} className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-100 text-slate-700 w-1/3">{r.label}</td>
                  <td className="p-2 text-slate-800">{r.value || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>
          <strong className="text-slate-900 block mb-1">Skema Database:</strong>
          <pre className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-xs overflow-x-auto">{f.dbSchema || '-'}</pre>
        </div>
      </div>
    </div>
  );
}
`;

FILES['src/components/preview/sections/ScopeDonePreview.jsx'] = String.raw`import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
export default function ScopeDonePreview() {
  const f = usePrdStore(function (s) { return s.fields; });
  const oos = (f.outOfScope || '').trim();
  const dod = (f.defOfDone || '').trim();
  const oosI = oos ? oos.split('\n').filter(function (x) { return x.trim(); }) : [];
  const dodI = dod ? dod.split('\n').filter(function (x) { return x.trim(); }) : [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 pt-2 keep-together">
      <div className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded text-xs space-y-1">
        <h4 className="font-bold text-rose-800">Out of Scope (Ditunda)</h4>
        <ul className="list-disc pl-4 text-rose-900 space-y-0.5">{oosI.length ? oosI.map(function (x, i) { return <li key={i}>{x}</li>; }) : <li className="italic text-slate-400">Tidak ada.</li>}</ul>
      </div>
      <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-xs space-y-1">
        <h4 className="font-bold text-emerald-800">Definition of Done</h4>
        <ul className="list-disc pl-4 text-emerald-900 space-y-0.5">{dodI.length ? dodI.map(function (x, i) { return <li key={i}>{x}</li>; }) : <li className="italic text-slate-400">Belum ditentukan.</li>}</ul>
      </div>
    </div>
  );
}
`;

FILES['src/components/preview/sections/NotePreview.jsx'] = String.raw`import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
import { getSectionNote } from '../../../utils/sectionNotes';
export default function NotePreview(props) {
  const noteKey = props.noteKey;
  const fields = usePrdStore(function (s) { return s.fields; });
  const mode = usePrdStore(function (s) { return s.mode; });
  const simpleExtras = usePrdStore(function (s) { return s.simpleExtras; });
  const note = getSectionNote(
    {
      fields: fields,
      mode: mode,
      simpleExtras: simpleExtras,
    },
    noteKey
  );
  if (!note) return null;
  if (note.important) {
    return (
      <div className="p-3 bg-rose-50 border-l-4 border-rose-600 rounded text-xs keep-together">
        <p className="text-rose-900 leading-relaxed">
          <strong className="font-bold">Penting:</strong>{' '}
          <span className="whitespace-pre-wrap">{note.text}</span>
        </p>
      </div>
    );
  }
  return (
    <div
      className="p-3 bg-slate-100 border-l-4 rounded text-xs keep-together"
      style={{ borderLeftColor: 'var(--doc-accent)' }}
    >
      <p className="text-slate-700 leading-relaxed">
        <strong className="font-bold" style={{ color: 'var(--doc-accent-text)' }}>
          Catatan:
        </strong>{' '}
        <span className="whitespace-pre-wrap">{note.text}</span>
      </p>
    </div>
  );
}
`;

FILES['src/components/preview/PreviewDocument.jsx'] = String.raw`import { usePreviewStore as usePrdStore } from '../../store/usePreviewStore';
import CoverPage from './CoverPage';
import DocFooter from './DocFooter';
import LiveThemeVars from './LiveThemeVars';
import OverviewPreview from './sections/OverviewPreview';
import FeaturesPreview from './sections/FeaturesPreview';
import TechStackPreview from './sections/TechStackPreview';
import PersonaPreview from './sections/PersonaPreview';
import BrandingPreview from './sections/BrandingPreview';
import RolesPreview from './sections/RolesPreview';
import AcPreview from './sections/AcPreview';
import SchemaPreview from './sections/SchemaPreview';
import NfrPreview from './sections/NfrPreview';
import ScopeDonePreview from './sections/ScopeDonePreview';
export default function PreviewDocument() {
  const f = usePrdStore(function (s) { return s.fields; });
  return (
    <div id="previewThemeRoot">
      <LiveThemeVars targetId="previewThemeRoot" />
      <CoverPage />
      <div
        id="prdDocument"
        className="bg-white text-slate-900 p-8 rounded-lg border border-slate-200 text-sm space-y-6 max-w-2xl mx-auto w-full h-auto mb-12"
      >
        <OverviewPreview /><PersonaPreview /><BrandingPreview /><RolesPreview /><FeaturesPreview /><AcPreview />
        <div className="space-y-2 keep-together">
          <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">3. Alur Pengguna (User Flow)</h3>
          <div className="p-3 bg-slate-100 rounded border border-slate-200 font-mono text-xs text-slate-800">
            {f.userFlow ? f.userFlow.split('->').join(' \u27A4 ') : 'Belum ada alur pengguna.'}
          </div>
        </div>
        <TechStackPreview /><SchemaPreview /><NfrPreview /><ScopeDonePreview />
        <DocFooter />
      </div>
    </div>
  );
}
`;

// ============================================================
// 1) Tulis semua file preview (kembali ke gaya semula + pembeda halus)
// ============================================================
let gagal = 0;
for (const rel of Object.keys(FILES)) {
  const abs = path.join(root, rel);
  try {
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, FILES[rel], 'utf8');
    console.log('[OK]   ' + rel);
  } catch (e) {
    gagal++;
    console.error('[GAGAL] ' + rel + ' : ' + e.message);
  }
}

// ============================================================
// 2) Hapus sisa komponen versi sebelumnya (jika ada)
// ============================================================
['src/components/preview/sections/SectionHead.jsx', 'src/components/preview/sections/SubSectionHead.jsx'].forEach(function (rel) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) {
    fs.unlinkSync(abs);
    console.log('[HAPUS] ' + rel);
  }
});

// ============================================================
// 3) Bersihkan aturan .subsec-badge dari globals.css (jika ada)
// ============================================================
const cssPath = path.join(root, 'src/styles/globals.css');
try {
  const css = fs.readFileSync(cssPath, 'utf8');
  if (css.includes('.subsec-badge')) {
    const bersih = css.split('\n').filter(function (line) { return line.indexOf('.subsec-badge') === -1; }).join('\n');
    fs.writeFileSync(cssPath, bersih, 'utf8');
    console.log('[OK]   globals.css (aturan .subsec-badge dihapus)');
  } else {
    console.log('[LEWAT] globals.css sudah bersih');
  }
} catch (e) {
  gagal++;
  console.error('[GAGAL] globals.css : ' + e.message);
}

if (gagal > 0) {
  console.error('Selesai dengan ' + gagal + ' kesalahan. Periksa pesan di atas.');
  process.exit(1);
}
console.log('');
console.log('Format dikembalikan seperti semula dengan pembeda halus:');
console.log('  Section    : teks lebih besar (text-sm) + bar kiri tebal 4px');
console.log('  Subsection : teks kecil (text-xs) + bar kiri tipis 2px + indentasi');
console.log('Jalankan npm run dev untuk melihat hasilnya.');