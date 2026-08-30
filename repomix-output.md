This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
public/
  logo-riskychici.svg
src/
  api/
    analyze-prd.js
  components/
    editor/
      sections/
        AcSection.jsx
        BrandingSection.jsx
        FeaturesList.jsx
        NfrSection.jsx
        OutOfScope.jsx
        PersonaSection.jsx
        ProblemGoal.jsx
        ProjectInfo.jsx
        RolesSection.jsx
        SchemaSection.jsx
        TechStack.jsx
      EditorPanel.jsx
      EditorSection.jsx
      ExtrasPicker.jsx
      ModeBanner.jsx
    header/
      Header.jsx
      ModeSwitcher.jsx
    mobile/
      MobileTabBar.jsx
      ScrollButtons.jsx
    preview/
      sections/
        AcPreview.jsx
        BrandingPreview.jsx
        FeaturesPreview.jsx
        NfrPreview.jsx
        OverviewPreview.jsx
        PersonaPreview.jsx
        RolesPreview.jsx
        SchemaPreview.jsx
        ScopeDonePreview.jsx
        TechStackPreview.jsx
      PreviewActions.jsx
      PreviewDocument.jsx
      PreviewPanel.jsx
    shared/
      ComboBox.jsx
      IconButton.jsx
      Toast.jsx
      ToggleSwitch.jsx
  hooks/
    useAutoResize.js
    useAutoSave.js
    useSwipe.js
    useToast.js
  services/
    exportService.js
    storageService.js
  store/
    usePrdStore.js
    useViewStore.js
  styles/
    globals.css
  utils/
    constants.js
    helpers.js
    markdown.js
    validators.js
  App.jsx
  main.jsx
.gitignore
index.html
LICENSE
package.json
README.md
vite.config.js
````

# Files

## File: public/logo-riskychici.svg
````xml
<svg width="6804" height="6804" viewBox="0 0 6804 6804" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M502.002 6263.69C502.002 6250.47 502.21 5409.18 502.21 3616.12C502.21 1868.34 502.323 1164.65 502.323 868.064C502.323 615.057 722.598 503.856 1046.67 503.856H2688.83C4215.61 503.856 4509.15 480.408 4942.86 600.197C6392.55 1000.6 6965.09 3255.29 5229.69 4202.23C5185.53 4226.33 5174.13 4244.81 5180 4276.28C5184.24 4299.01 5412.18 4666.59 5686.53 5093.14C5960.88 5519.69 6199.28 5902.77 6221.98 5941.11C6381.78 6210.98 6263.82 6301.99 6166.94 6301.99H4209.06C3982.21 6303.57 3900.92 6087.26 3813.74 5931.61C3691.04 5712.54 3121.15 4585.76 2936.91 4241.11C2779.46 3946.57 2729.9 3800.28 2729.41 3628.67C2728.9 3449.88 2777.59 3319.35 2893.59 3188.52C3014.8 3051.81 3159.5 2981.11 3591.13 2847.7C4301.29 2628.2 4428.27 2582.42 4380.09 2563.22C4354.1 2552.87 4009.99 2549.24 3528.27 2554.25C2609.07 2563.79 2482.04 2555.44 2321.84 2474.85C2169.86 2398.4 2094.52 2306.99 1708.74 1730.98C1418.75 1297.98 1009.52 1104.63 1009.52 1149.65C1009.52 1157.35 1105.47 1385.93 1222.74 1657.6C1468.66 2227.3 1699.23 2790.96 2227.52 4113.95C2434.88 4633.25 2661.09 5191.67 2731.24 5354.42C3062.58 6123.09 3042.86 6301.94 2725.91 6301.94C2647.69 6301.94 2547.43 6301.12 1606.15 6301.81C1021 6302.25 544.168 6300.87 529.42 6300.87C502.332 6300.87 502 6273.42 502 6263.68L502.002 6263.69Z" fill="white"/>
</svg>
````

## File: src/api/analyze-prd.js
````javascript
// api/analyze-prd.js

export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Handling aman untuk parse body jika dikirim sebagai string
    let bodyData = req.body;
    if (typeof bodyData === 'string') {
      try {
        bodyData = JSON.parse(bodyData);
      } catch (e) {
        return res.status(400).json({ error: 'Format JSON request body tidak valid.' });
      }
    }

    const prdData = bodyData?.prdData;

    if (!prdData) {
      return res.status(400).json({ error: 'Data PRD tidak boleh kosong.' });
    }

    // Mengambil API Key dari Environment Variable (Node.js)
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY belum dikonfigurasi di server.' });
    }

    // Memanggil API Gemini 1.5 Flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Kamu adalah seorang System Analyst dan Senior Product Manager handal.
Analisis data PRD berikut. Berikan masukan konkret mengenai:
1. Kekurangan atau hal yang belum jelas (Missing Requirements).
2. Saran perbaikan deskripsi / Acceptance Criteria / Tech Stack.
3. Potensi risiko teknis atau bisnis.

Data PRD:
${JSON.stringify(prdData, null, 2)}`
                }
              ]
            }
          ]
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Gagal memproses request ke Gemini API'
      });
    }

    // Mengambil hasil teks dari response Gemini
    const aiFeedback = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada analisis yang dihasilkan.';

    return res.status(200).json({ feedback: aiFeedback });
  } catch (error) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan internal.' });
  }
}
````

## File: src/components/editor/EditorSection.jsx
````javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function EditorSection(props) {
  const title = props.title;
  const icon = props.icon;
  const color = props.color || 'blue';
  const action = props.action;
  const children = props.children;
  const c = { blue: 'text-blue-400', amber: 'text-amber-400' };
  const b = { blue: 'border-slate-700/80', amber: 'border-blue-900/60' };
  return (
    <div className={'bg-slate-800 p-5 rounded-xl border shadow-md space-y-4 ' + b[color]}>
      <div className="flex justify-between items-center gap-2">
        <h2 className={'text-sm font-bold uppercase tracking-wider flex items-center ' + c[color]}>
          {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}
````

## File: src/components/editor/ExtrasPicker.jsx
````javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece, faRotateLeft, faUsers, faPalette, faUserShield, faClipboardCheck, faTableList, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';
import { EXTRAS_DEFINITIONS } from '../../utils/constants';
import { useToast } from '../../hooks/useToast';
import ToggleSwitch from '../shared/ToggleSwitch';

const IM = { faUsers: faUsers, faPalette: faPalette, faUserShield: faUserShield, faClipboardCheck: faClipboardCheck, faTableList: faTableList, faShieldHalved: faShieldHalved };
const CM = { indigo: 'text-indigo-400', pink: 'text-pink-400', emerald: 'text-emerald-400', amber: 'text-amber-400', cyan: 'text-cyan-400', rose: 'text-rose-400' };

export default function ExtrasPicker() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const toggle = usePrdStore(function (s) { return s.toggleSimpleExtra; });
  const resetAll = usePrdStore(function (s) { return s.resetAllExtras; });
  const commit = usePrdStore(function (s) { return s.commitHistory; });
  const showToast = useToast();
  if (mode === 'enterprise') return null;
  return (
    <div className="bg-gradient-to-br from-indigo-950/40 to-purple-950/40 p-5 rounded-xl border border-indigo-700/60 shadow-md space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center"><FontAwesomeIcon icon={faPuzzlePiece} className="mr-2" />Section Opsional (Tambahan)</h2>
          <p className="text-[11px] text-slate-400 mt-1">Aktifkan bagian Enterprise yang Anda butuhkan di mode Simple</p>
        </div>
        <button onClick={function () { resetAll(); commit(); showToast('Semua section opsional dinonaktifkan', 'info'); }} className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded border border-slate-700 hover:border-slate-600 transition">
          <FontAwesomeIcon icon={faRotateLeft} className="mr-1" />Reset Semua
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
        {EXTRAS_DEFINITIONS.map(function (d) {
          return (
            <ToggleSwitch key={d.key} checked={se[d.key]} onChange={function (v) { toggle(d.key, v); commit(); }} label={d.label}
              icon={<FontAwesomeIcon icon={IM[d.icon]} />} iconColor={CM[d.color]} />
          );
        })}
      </div>
    </div>
  );
}
````

## File: src/components/editor/ModeBanner.jsx
````javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';

const isVis = function (mode, se, key) { return mode === 'enterprise' || se[key] === true; };

export default function ModeBanner() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  const features = usePrdStore(function (s) { return s.features; });
  const palette = usePrdStore(function (s) { return s.palette; });
  const roles = usePrdStore(function (s) { return s.roles; });
  const acModules = usePrdStore(function (s) { return s.acModules; });
  const schemaTables = usePrdStore(function (s) { return s.schemaTables; });

  const checks = [];
  ['projectName','author','problemStatement','productGoal','userFlow','techFrontend','techBackend','techDatabase','defOfDone'].forEach(function (id) { checks.push(!!(f[id] || '').trim()); });
  checks.push(features.length > 0);
  if (isVis(mode, se, 'persona')) { checks.push(!!(f.userPersona || '').trim()); checks.push(!!(f.successMetrics || '').trim()); }
  if (isVis(mode, se, 'branding')) { checks.push(palette.length > 0); checks.push(!!(f.brandTypography || '').trim()); checks.push(!!(f.brandLayout || '').trim()); checks.push(['bpMobile','bpTablet','bpDesktop'].some(function (id) { return !!(f[id] || '').trim(); })); }
  if (isVis(mode, se, 'roles')) checks.push(roles.length > 0);
  if (isVis(mode, se, 'ac')) checks.push(acModules.length > 0);
  if (isVis(mode, se, 'schema')) checks.push(schemaTables.length > 0);
  if (isVis(mode, se, 'nfr')) ['nfrSpecs','nfrPerformance','nfrLocalization','nfrBrowser','figmaLink','riskMitigation'].forEach(function (id) { checks.push(!!(f[id] || '').trim()); });
  const pct = checks.length ? Math.round(checks.filter(Boolean).length / checks.length * 100) : 0;
  const txt = mode === 'enterprise' ? 'Enterprise Mode (Kompleks & Profesional)' : 'Simple MVP (Praktis & Cepat)';

  return (
    <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs flex justify-between items-center text-blue-300">
      <span className="font-medium"><FontAwesomeIcon icon={faCircleInfo} className="mr-1.5" />Mode Aktif: <strong className="text-white">{txt}</strong></span>
      <span className="flex items-center space-x-2 text-[10px] text-slate-400">
        <span>Kelengkapan:</span>
        <span className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden"><span className="block h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: pct + '%' }} /></span>
        <strong className="text-emerald-400">{pct}%</strong>
      </span>
    </div>
  );
}
````

## File: src/components/mobile/MobileTabBar.jsx
````javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faEye } from '@fortawesome/free-solid-svg-icons';
import { useViewStore } from '../../store/useViewStore';
import { useSwipe } from '../../hooks/useSwipe';

export default function MobileTabBar() {
  const view = useViewStore(function (s) { return s.view; });
  const setView = useViewStore(function (s) { return s.setView; });

  function go(v) {
    setView(v);
    const s = document.getElementById('panelSlider');
    if (s) s.classList.toggle('slide-preview', v === 'preview');
  }

  useSwipe(function () { go('preview'); }, function () { go('editor'); });
  const isP = view === 'preview';
  const indCls = 'absolute top-1 bottom-1 rounded-xl shadow-md transition-all duration-300 ' + (isP
    ? 'left-[calc(50%+2px)] right-1 bg-gradient-to-br from-emerald-600 to-emerald-800'
    : 'left-1 right-[calc(50%+2px)] bg-gradient-to-br from-blue-600 to-blue-800');

  return (
    <nav className="lg:hidden no-print fixed bottom-0 left-0 right-0 z-40 bg-slate-800/95 backdrop-blur border-t border-slate-700" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="relative flex p-1">
        <span id="tabIndicator" className={indCls} />
        <button onClick={function () { go('editor'); }} className={'relative z-10 flex-1 h-12 flex items-center justify-center space-x-2 text-xs font-semibold transition-colors duration-300 ' + (isP ? 'text-slate-400' : 'text-white')}>
          <FontAwesomeIcon icon={faPenToSquare} /><span>Editor PRD</span>
        </button>
        <button onClick={function () { go('preview'); }} className={'relative z-10 flex-1 h-12 flex items-center justify-center space-x-2 text-xs font-semibold transition-colors duration-300 ' + (isP ? 'text-white' : 'text-slate-400')}>
          <FontAwesomeIcon icon={faEye} /><span>Preview PDF</span>
        </button>
      </div>
    </nav>
  );
}
````

## File: src/components/preview/sections/AcPreview.jsx
````javascript
import { usePrdStore } from '../../../store/usePrdStore';
export default function AcPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const ac = usePrdStore(function (s) { return s.acModules; });
  if (mode !== 'enterprise' && !se.ac) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">2.1 Acceptance Criteria per Modul</h3>
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
````

## File: src/components/preview/sections/BrandingPreview.jsx
````javascript
import { usePrdStore } from '../../../store/usePrdStore';
import { buildBreakpoints, isValidHex } from '../../../utils/helpers';
export default function BrandingPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  const palette = usePrdStore(function (s) { return s.palette; });
  if (mode !== 'enterprise' && !se.branding) return null;
  return (
    <div className="space-y-2 keep-together">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">1.2 Branding & Design System</h3>
      <div className="pl-3 space-y-2 text-xs text-slate-700">
        <div className="space-y-1">
          {palette.length ? palette.map(function (p, i) {
            const hex = isValidHex(p.hex) ? p.hex : '#ffffff';
            return (
              <div key={i} className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded shrink-0" style={{ border: '8px solid ' + hex, outline: '1px solid #cbd5e1' }} />
                <span className="font-semibold text-slate-900">{p.name || '-'}</span>
                <span className="font-mono text-slate-500">{p.hex}</span>
                <span className="text-slate-500">{'\u00B7'} {p.usage}</span>
              </div>
            );
          }) : <p className="italic text-slate-400">Belum ada palette warna.</p>}
        </div>
        <p><strong className="text-slate-900">Typography:</strong> <span>{f.brandTypography || '-'}</span></p>
        <p><strong className="text-slate-900">Prinsip Layout:</strong> <span>{f.brandLayout || '-'}</span></p>
        <p><strong className="text-slate-900">Breakpoint:</strong> <span className="font-mono">{buildBreakpoints(f) || '-'}</span></p>
      </div>
    </div>
  );
}
````

## File: src/components/preview/sections/FeaturesPreview.jsx
````javascript
import { usePrdStore } from '../../../store/usePrdStore';
export default function FeaturesPreview() {
  const features = usePrdStore(function (s) { return s.features; });
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">2. Fitur Utama & Requirements</h3>
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
````

## File: src/components/preview/sections/OverviewPreview.jsx
````javascript
import { usePrdStore } from '../../../store/usePrdStore';
export default function OverviewPreview() {
  const f = usePrdStore(function (s) { return s.fields; });
  return (
    <div className="space-y-2 keep-together">
      <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">1. Overview & Goals</h3>
      <div className="pl-3 space-y-2 text-xs text-slate-700">
        <p><strong className="text-slate-900">Latar Belakang:</strong> <span className="italic text-slate-600">{f.problemStatement || 'Belum diisi.'}</span></p>
        <p><strong className="text-slate-900">Tujuan Utama:</strong> <span className="italic text-slate-600">{f.productGoal || 'Belum diisi.'}</span></p>
      </div>
    </div>
  );
}
````

## File: src/components/preview/sections/PersonaPreview.jsx
````javascript
import { usePrdStore } from '../../../store/usePrdStore';
export default function PersonaPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  if (mode !== 'enterprise' && !se.persona) return null;
  return (
    <div className="space-y-2 keep-together">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">1.1 Target User Persona & Success Metrics</h3>
      <div className="pl-3 space-y-2 text-xs text-slate-700">
        <p><strong className="text-slate-900">Target User Persona:</strong> <span>{f.userPersona || '-'}</span></p>
        <p><strong className="text-slate-900">Metrik & KPI Utama:</strong> <span>{f.successMetrics || '-'}</span></p>
      </div>
    </div>
  );
}
````

## File: src/components/preview/sections/RolesPreview.jsx
````javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
export default function RolesPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const roles = usePrdStore(function (s) { return s.roles; });
  if (mode !== 'enterprise' && !se.roles) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">1.3 Role & Permission Matrix</h3>
      <div className="pl-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {roles.length ? roles.map(function (r, i) {
          return (
            <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded keep-together">
              <h4 className="font-bold text-slate-900 mb-1">{r.name || 'Role'}</h4>
              <p className="text-emerald-700"><FontAwesomeIcon icon={faCircleCheck} className="mr-1" />{r.can.split('\n').filter(function (x) { return x.trim(); }).join(' \u00B7 ') || '-'}</p>
              <p className="text-rose-700 mt-0.5"><FontAwesomeIcon icon={faCircleXmark} className="mr-1" />{r.cannot.split('\n').filter(function (x) { return x.trim(); }).join(' \u00B7 ') || '-'}</p>
            </div>
          );
        }) : <p className="italic text-slate-400">Belum ada role.</p>}
      </div>
    </div>
  );
}
````

## File: src/components/preview/sections/SchemaPreview.jsx
````javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
export default function SchemaPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const st = usePrdStore(function (s) { return s.schemaTables; });
  if (mode !== 'enterprise' && !se.schema) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">4.1 Schema Data</h3>
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
````

## File: src/components/preview/sections/ScopeDonePreview.jsx
````javascript
import { usePrdStore } from '../../../store/usePrdStore';
export default function ScopeDonePreview() {
  const f = usePrdStore(function (s) { return s.fields; });
  const oos = (f.outOfScope || '').trim();
  const dod = (f.defOfDone || '').trim();
  const oosI = oos ? oos.split('\n').filter(function (x) { return x.trim(); }) : [];
  const dodI = dod ? dod.split('\n').filter(function (x) { return x.trim(); }) : [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 keep-together">
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
````

## File: src/components/preview/sections/TechStackPreview.jsx
````javascript
import { usePrdStore } from '../../../store/usePrdStore';
import { TECH_REQUIRED, TECH_OPTIONAL } from '../../../utils/constants';

export default function TechStackPreview() {
  const f = usePrdStore(function (s) { return s.fields; });
  const techOptional = usePrdStore(function (s) { return s.techOptional; });

  const rows = TECH_REQUIRED.map(function (d) { return { label: d.label, value: f[d.key] }; })
    .concat(TECH_OPTIONAL.filter(function (d) { return techOptional.includes(d.key); })
    .map(function (d) { return { label: d.label, value: f[d.key] }; }));

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">4. Spesifikasi Tech Stack & Arsitektur</h3>
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
````

## File: src/components/preview/PreviewDocument.jsx
````javascript
import { usePrdStore } from '../../store/usePrdStore';
import { formatTargetDate } from '../../utils/helpers';
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
  const mode = usePrdStore(function (s) { return s.mode; });
  const title = f.projectName || 'PROYEK TANPA NAMA';
  const date = formatTargetDate(f.targetDate, f.targetDateFormat);
  const ht = mode === 'enterprise' ? 'PRODUCT REQUIREMENT DOCUMENT (ENTERPRISE SPEC)' : 'PRODUCT REQUIREMENT DOCUMENT (SIMPLE MVP)';

  return (
    <div id="prdDocument" className="bg-white text-slate-900 p-8 rounded-lg shadow-2xl border border-slate-200 text-sm space-y-6 max-w-2xl mx-auto w-full h-auto mb-12">
      <div className="border-b-2 border-blue-600 pb-4 keep-together">
        <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{ht}</p>
      </div>
      <table className="w-full text-xs border-collapse border border-slate-200 bg-slate-50 keep-together tbl-stack"><tbody>
        <tr className="border-b border-slate-200"><td className="p-2 font-bold bg-slate-100 text-slate-700 w-1/4">Owner</td><td className="p-2 w-1/4 text-slate-800">{f.author || '-'}</td><td className="p-2 font-bold bg-slate-100 text-slate-700 w-1/4">Versi</td><td className="p-2 w-1/4 text-slate-800">{f.docVersion || 'v1.0'}</td></tr>
        <tr><td className="p-2 font-bold bg-slate-100 text-slate-700">Target</td><td className="p-2 text-slate-800">{date}</td><td className="p-2 font-bold bg-slate-100 text-slate-700">Status</td><td className="p-2 text-slate-800 font-semibold text-blue-700">Approved / In Development</td></tr>
      </tbody></table>
      <OverviewPreview /><PersonaPreview /><BrandingPreview /><RolesPreview /><FeaturesPreview /><AcPreview />
      <div className="space-y-2 keep-together">
        <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">3. Alur Pengguna (User Flow)</h3>
        <div className="p-3 bg-slate-100 rounded border border-slate-200 font-mono text-xs text-slate-800">{f.userFlow ? f.userFlow.split('->').join(' \u27A4 ') : 'Belum ada alur pengguna.'}</div>
      </div>
      <TechStackPreview /><SchemaPreview /><NfrPreview /><ScopeDonePreview />
    </div>
  );
}
````

## File: src/components/preview/PreviewPanel.jsx
````javascript
import PreviewActions from './PreviewActions';
import PreviewDocument from './PreviewDocument';
export default function PreviewPanel() {
  return (
    <section id="previewPanel" className="bg-slate-950 p-6 overflow-y-auto" style={{ height: '100%' }}>
      <PreviewActions /><PreviewDocument />
    </section>
  );
}
````

## File: src/components/shared/Toast.jsx
````javascript
import { useToastStore } from '../../hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export default function ToastContainer() {
  const toasts = useToastStore(function (s) { return s.toasts; });
  const colors = { success: 'bg-emerald-600', error: 'bg-rose-600', info: 'bg-blue-600' };
  const icons = { success: faCircleCheck, error: faCircleExclamation, info: faCircleInfo };
  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-2 no-print">
      {toasts.map(function (t) {
        return (
          <div key={t.id} className={'px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white flex items-center space-x-2 ' + colors[t.type] + ' animate-[slideUp_0.3s_ease]'}>
            <FontAwesomeIcon icon={icons[t.type]} />
            <span>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}
````

## File: src/hooks/useAutoResize.js
````javascript
import { useEffect, useCallback } from 'react';

export const useAutoResize = function () {
  const resize = useCallback(function (el) {
    if (!el || el.tagName !== 'TEXTAREA') return;
    if (!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)) return;
    if (!el.dataset.minHeight) {
      const p = el.style.height;
      el.style.height = 'auto';
      el.dataset.minHeight = el.scrollHeight + 2;
      el.style.height = p || (el.scrollHeight + 2) + 'px';
      return;
    }
    const min = parseInt(el.dataset.minHeight || '0', 10);
    el.style.height = 'auto';
    el.style.height = Math.max(min, el.scrollHeight + 2) + 'px';
  }, []);
  const resizeAll = useCallback(function () {
    document.querySelectorAll('textarea').forEach(resize);
  }, [resize]);
  useEffect(function () {
    resizeAll();
    window.addEventListener('resize', resizeAll);
    return function () { window.removeEventListener('resize', resizeAll); };
  }, [resizeAll]);
  return { resize: resize, resizeAll: resizeAll };
};
````

## File: src/hooks/useSwipe.js
````javascript
import { useEffect, useRef } from 'react';

export const useSwipe = function (onLeft, onRight, threshold) {
  threshold = threshold || 70;
  const start = useRef(null);

  useEffect(function () {
    const mq = window.matchMedia('(max-width: 1023.98px)');
    const ts = function (e) {
      if (!mq.matches) return;
      if (e.target.closest && e.target.closest('pre,table,.combo-drop,input,textarea,select,[data-no-swipe]')) return;
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    };
    const te = function (e) {
      if (!start.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      start.current = null;
      if (Math.abs(dx) > threshold && Math.abs(dx) > 2 * Math.abs(dy)) {
        if (dx < 0) onLeft && onLeft();
        else onRight && onRight();
      }
    };
    document.addEventListener('touchstart', ts, { passive: true });
    document.addEventListener('touchend', te, { passive: true });
    return function () {
      document.removeEventListener('touchstart', ts);
      document.removeEventListener('touchend', te);
    };
  }, [onLeft, onRight, threshold]);
};
````

## File: src/hooks/useToast.js
````javascript
import { create } from 'zustand';

export const useToastStore = create(function (set) {
  return {
    toasts: [],
    showToast: function (msg, type) {
      type = type || 'success';
      const id = Date.now() + Math.random();
      set(function (s) { return { toasts: s.toasts.concat([{ id: id, msg: msg, type: type }]) }; });
      setTimeout(function () {
        set(function (s) { return { toasts: s.toasts.filter(function (t) { return t.id !== id; }) }; });
      }, 2900);
    },
  };
});

export const useToast = function () { return useToastStore(function (s) { return s.showToast; }); };
````

## File: src/services/storageService.js
````javascript
import { STORAGE_KEY } from '../utils/constants';

export const storageService = {
  save: function (data) {
    try {
      const p = JSON.stringify(data);
      if (p.length > 4000000) throw new Error('Too large');
      localStorage.setItem(STORAGE_KEY, p);
      return true;
    } catch (e) { return false; }
  },
  load: function () {
    try {
      const r = localStorage.getItem(STORAGE_KEY);
      return r ? JSON.parse(r) : null;
    } catch (e) { return null; }
  },
  clear: function () {
    try { localStorage.removeItem(STORAGE_KEY); return true; } catch (e) { return false; }
  },
};
````

## File: src/store/useViewStore.js
````javascript
import { create } from 'zustand';
export const useViewStore = create(function (set) {
  return { view: 'editor', setView: function (v) { set({ view: v }); } };
});
````

## File: src/utils/constants.js
````javascript
import { faServer, faDatabase, faCloud, faGlobe, faCodeBranch, faShieldHalved, faHardDrive, faPlug, faInfinity, faBolt, faEnvelopeOpenText, faChartLine, faChartColumn, faFlask } from '@fortawesome/free-solid-svg-icons';
import { faHtml5 } from '@fortawesome/free-brands-svg-icons';

export const STORAGE_KEY = 'prdArchitectV4';
export const MAX_HISTORY = 50;
export const AUTOSAVE_DELAY = 800;

export const EXTRAS_DEFINITIONS = [
  { key: 'persona', label: 'Persona & KPI Sukses', icon: 'faUsers', color: 'indigo' },
  { key: 'branding', label: 'Branding & Design System', icon: 'faPalette', color: 'pink' },
  { key: 'roles', label: 'Role & Permission Matrix', icon: 'faUserShield', color: 'emerald' },
  { key: 'ac', label: 'Acceptance Criteria', icon: 'faClipboardCheck', color: 'amber' },
  { key: 'schema', label: 'Schema Data', icon: 'faTableList', color: 'cyan' },
  { key: 'nfr', label: 'NFR & Keamanan', icon: 'faShieldHalved', color: 'rose' },
];

export const TECH_REQUIRED = [
  { key: 'techFrontend', label: 'Frontend', icon: faHtml5, color: 'text-orange-400', ph: 'misal: React, Tailwind CSS' },
  { key: 'techBackend', label: 'Backend', icon: faServer, color: 'text-emerald-400', ph: 'misal: Node.js, Laravel' },
  { key: 'techDatabase', label: 'Database', icon: faDatabase, color: 'text-blue-400', ph: 'misal: PostgreSQL, Redis' },
  { key: 'techInfra', label: 'Infrastructure & Cloud Hosting', icon: faCloud, color: 'text-purple-400', ph: 'misal: Vercel, AWS, Docker' },
  { key: 'techDomain', label: 'Domain & DNS Management', icon: faGlobe, color: 'text-cyan-400', ph: 'misal: Niagahoster, Cloudflare DNS' },
  { key: 'techVcs', label: 'Version Control System', icon: faCodeBranch, color: 'text-slate-400', ph: 'misal: GitHub, GitLab' },
];

export const TECH_OPTIONAL = [
  { key: 'techSecurity', label: 'Security & Authentication', icon: faShieldHalved, color: 'text-rose-400', category: 'Esensial', ph: 'misal: OAuth 2.0, JWT, bcrypt' },
  { key: 'techStorage', label: 'Object Storage & CDN', icon: faHardDrive, color: 'text-cyan-400', category: 'Esensial', ph: 'misal: AWS S3 + CloudFront, Cloudflare R2' },
  { key: 'techThirdParty', label: 'Third-Party APIs / Integrations', icon: faPlug, color: 'text-amber-400', category: 'Esensial', ph: 'misal: Midtrans, Firebase Auth' },
  { key: 'techDevOps', label: 'CI/CD & DevOps', icon: faInfinity, color: 'text-purple-400', category: 'Lanjutan', ph: 'misal: GitHub Actions, GitLab CI' },
  { key: 'techCaching', label: 'Caching Layer', icon: faBolt, color: 'text-yellow-400', category: 'Lanjutan', ph: 'misal: Redis, Memcached' },
  { key: 'techQueue', label: 'Message Brokers / Queueing', icon: faEnvelopeOpenText, color: 'text-emerald-400', category: 'Lanjutan', ph: 'misal: RabbitMQ, Kafka' },
  { key: 'techMonitoring', label: 'Monitoring, Logging, & Error Tracking', icon: faChartLine, color: 'text-blue-400', category: 'Lanjutan', ph: 'misal: Sentry, Grafana' },
  { key: 'techAnalytics', label: 'Analytics & Data Pipeline', icon: faChartColumn, color: 'text-indigo-400', category: 'Lanjutan', ph: 'misal: Google Analytics, Metabase' },
  { key: 'techTesting', label: 'Testing / QA Automation', icon: faFlask, color: 'text-lime-400', category: 'Lanjutan', ph: 'misal: Vitest, Playwright' },
];

export const DATA_TYPES = [
  { category: 'Numerik Tepat', items: ['TINYINT','SMALLINT','MEDIUMINT','INT / INTEGER','BIGINT','DECIMAL / NUMERIC'] },
  { category: 'Numerik Perkiraan', items: ['FLOAT','DOUBLE','REAL'] },
  { category: 'String Karakter', items: ['CHAR','VARCHAR','TEXT','MEDIUMTEXT','LONGTEXT'] },
  { category: 'Temporal', items: ['DATE','TIME','DATETIME','TIMESTAMP','YEAR'] },
  { category: 'Logika', items: ['BOOLEAN','BIT','ENUM','SET'] },
  { category: 'Biner', items: ['BINARY','VARBINARY','BLOB'] },
  { category: 'Semi-Terstruktur', items: ['JSON','XML'] },
  { category: 'Sistem & Identitas', items: ['UUID / GUID','INET','MACADDR'] },
];

export const DEFAULT_FIELDS = {
  projectName:'',docVersion:'v1.0',author:'',targetDate:'',targetDateFormat:'full',
  problemStatement:'',productGoal:'',userPersona:'',successMetrics:'',
  brandTypography:'',brandLayout:'',
  bpMobileOp:'\u2264',bpMobile:'',bpMobileUnit:'px',
  bpTabletOp:'\u2264',bpTablet:'',bpTabletUnit:'px',
  bpDesktopOp:'\u2265',bpDesktop:'',bpDesktopUnit:'px',
  userFlow:'',
  techFrontend:'',techBackend:'',techDatabase:'',techInfra:'',techDomain:'',techVcs:'',
  techSecurity:'',techStorage:'',techThirdParty:'',techDevOps:'',techCaching:'',
  techQueue:'',techMonitoring:'',techAnalytics:'',techTesting:'',
  dbSchema:'',
  nfrSpecs:'',nfrPerformance:'',nfrLocalization:'',nfrBrowser:'',figmaLink:'',riskMitigation:'',
  outOfScope:'',defOfDone:'',
};

export const INITIAL_SIMPLE_EXTRAS = EXTRAS_DEFINITIONS.reduce(function (a, d) { const o = Object.assign({}, a); o[d.key] = false; return o; }, {});
````

## File: src/utils/helpers.js
````javascript
export const escapeHtml = function (s) { return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };

export const isValidHex = function (s) { return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test((s||'').trim()); };

export const normalizeHex = function (h) {
  if (!h) return '#000000';
  let s = h.trim();
  if (!s.startsWith('#')) s = '#' + s;
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  if (/^#[0-9A-Fa-f]{3}$/.test(s)) return '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
  return '#000000';
};

export const liveHexColor = function (digits) {
  let s = (digits||'').replace(/[^0-9A-Fa-f]/g,'');
  if (!s) return null;
  if (s.length===3) s = s.split('').map(function (c) { return c + c; }).join('');
  if (s.length!==6) { let o=''; while (o.length<6) o+=s; s = o.slice(0,6); }
  return '#' + s;
};

export const formatTargetDate = function (value, format) {
  if (!value) return '-';
  const d = new Date(value+'T00:00:00');
  if (isNaN(d.getTime())) return '-';
  const months=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const month=months[d.getMonth()], year=d.getFullYear();
  if (format==='month') return month + ' ' + year;
  if (format==='quarter') return 'Q' + (Math.floor(d.getMonth()/3)+1) + ' ' + year;
  return d.getDate() + ' ' + month + ' ' + year;
};

export const buildBreakpoints = function (fields) {
  const pairs=[['Mobile','bpMobile'],['Tablet','bpTablet'],['Desktop','bpDesktop']];
  const parts=[];
  pairs.forEach(function (pair) {
    const label=pair[0], key=pair[1];
    const num=(fields[key]||'').trim();
    if (!num) return;
    parts.push(label + ' ' + (fields[key+'Op']||'') + num + (fields[key+'Unit']||''));
  });
  return parts.join(' \u00B7 ');
};
````

## File: src/utils/markdown.js
````javascript
import { buildBreakpoints, formatTargetDate } from './helpers';
import { TECH_REQUIRED, TECH_OPTIONAL } from './constants';

const BT = String.fromCharCode(96);
const FENCE = BT + BT + BT;

const isVis = function (mode, extras, key) { return mode === 'enterprise' || extras[key] === true; };

export const generateMarkdown = function (state) {
  const f = state.fields;
  const features = state.features;
  const palette = state.palette;
  const roles = state.roles;
  const acModules = state.acModules;
  const schemaTables = state.schemaTables;
  const mode = state.mode;
  const se = state.simpleExtras;
  const techOptional = state.techOptional || [];

  const title = f.projectName || 'PROYEK TANPA NAMA';
  const date = formatTargetDate(f.targetDate, f.targetDateFormat);

  let feat = '| ID | Fitur | Deskripsi | Prioritas |\n|---|---|---|---|\n';
  features.forEach(function (ft) { feat += '| ' + ft.id + ' | ' + ft.name + ' | ' + ft.story + ' | ' + ft.priority + ' |\n'; });

  let out = '# ' + title + '\n**Product Requirement Document (' + mode.toUpperCase() + ')**\n\n';
  out += '**Author:** ' + f.author + ' | **Version:** ' + f.docVersion + ' | **Target:** ' + date + '\n\n';
  out += '## 1. Overview & Goals\n- **Problem:** ' + f.problemStatement + '\n- **Goal:** ' + f.productGoal + '\n\n';

  if (isVis(mode, se, 'persona')) out += '## 1.1 Target User Persona & Metrics\n- **Persona:** ' + f.userPersona + '\n- **Success KPI:** ' + f.successMetrics + '\n\n';

  if (isVis(mode, se, 'branding') && (palette.length || f.brandTypography)) {
    const bp = buildBreakpoints(f);
    out += '## 1.2 Branding & Design System\n';
    out += palette.map(function (p) { return '- **' + p.name + '** ' + BT + p.hex + BT + ' : ' + p.usage; }).join('\n');
    out += '\n\n**Typography:** ' + f.brandTypography + '\n**Layout:** ' + f.brandLayout + '\n';
    if (bp) out += '**Breakpoint:** ' + bp + '\n';
    out += '\n';
  }

  if (isVis(mode, se, 'roles') && roles.length) {
    out += '## 1.3 Role & Permission Matrix\n';
    out += roles.map(function (r) {
      return '### ' + r.name + '\n- \u2705 ' + r.can.split('\n').filter(function (x) { return x.trim(); }).join(' | ') + '\n- \u274c ' + r.cannot.split('\n').filter(function (x) { return x.trim(); }).join(' | ');
    }).join('\n\n');
    out += '\n\n';
  }

  out += '## 2. Core Features (Requirements)\n' + feat + '\n';

  if (isVis(mode, se, 'ac') && acModules.length) {
    out += '## 2.1 Acceptance Criteria per Modul\n';
    out += acModules.map(function (m, mi) {
      return '### ' + (mi + 1) + '. ' + m.title + '\n' + m.items.map(function (it, ii) { return '- **AC-' + (mi + 1) + '.' + (ii + 1) + ' ' + it.title + '**: ' + it.desc; }).join('\n');
    }).join('\n\n');
    out += '\n\n';
  }

  out += '## 3. User Flow\n' + BT + f.userFlow + BT + '\n\n';

  out += '## 4. Detailed Tech Stack & Architecture\n';
  TECH_REQUIRED.forEach(function (d) { out += '- **' + d.label + ':** ' + (f[d.key] || '-') + '\n'; });
  TECH_OPTIONAL.forEach(function (d) { if (techOptional.includes(d.key)) out += '- **' + d.label + ':** ' + (f[d.key] || '-') + '\n'; });
  out += '\n' + FENCE + 'sql\n' + f.dbSchema + '\n' + FENCE + '\n\n';

  if (isVis(mode, se, 'schema') && schemaTables.length) {
    out += '## 4.1 Schema Data\n';
    out += schemaTables.map(function (t) {
      let s = '### Tabel: ' + (t.name || 'tanpa_nama') + '\n';
      if (t.desc) s += '> ' + t.desc + '\n';
      s += '| Field | Tipe | Not Null | Keterangan |\n|---|---|---|---|\n';
      s += t.fields.map(function (c) { return '| ' + c.field + ' | ' + c.type + ' | ' + c.required + ' | ' + c.note + ' |'; }).join('\n');
      return s;
    }).join('\n\n');
    out += '\n\n';
  }

  if (isVis(mode, se, 'nfr')) {
    out += '## 4.2 NFR, Prototype & Risk Analysis\n- **Keamanan:** ' + f.nfrSpecs + '\n- **Performance:** ' + f.nfrPerformance + '\n- **Lokalisasi:** ' + f.nfrLocalization + '\n- **Browser:** ' + f.nfrBrowser + '\n- **Figma Link:** ' + f.figmaLink + '\n- **Risk & Mitigation:** ' + f.riskMitigation + '\n\n';
  }

  out += '## 5. Out of Scope\n' + f.outOfScope + '\n\n';
  out += '## 6. Definition of Done\n' + f.defOfDone;
  return out;
};
````

## File: src/utils/validators.js
````javascript
export const validateRequired = function (v) { return !!(v && v.toString().trim()); };
````

## File: src/main.jsx
````javascript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
````

## File: LICENSE
````
MIT License

Copyright (c) 2026 Risky Chici and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: README.md
````markdown
# PRD Architect Pro

> **Satu Alat untuk Semua Kebutuhan Spesifikasi Produk**  
> Platform perancang *Product Requirement Document* (PRD) interaktif berbasis React untuk membantu Product Manager, System Analyst, dan Software Architect menyusun dokumen spesifikasi teknis dan bisnis secara terstruktur dan efisien.

[![Version](https://img.shields.io/badge/version-3.1-blue.svg?style=flat-square)](https://github.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](./LICENSE)

---

## Preview Aplikasi

| Single Editor View | Live PRD Preview |
| :---: | :---: |
| *[ Sisipkan Screenshot Panel Editor di Sini ]* | *[ Sisipkan Screenshot Preview Dokumen di Sini ]* |

---

## Ringkasan Fitur

PRD Architect Pro dirancang untuk memangkas waktu pengerjaan dokumentasi produk tanpa mengorbankan kualitas spesifikasi teknis. Aplikasi ini menjembatani ideasi bisnis dengan kebutuhan implementasi teknis lewat dua alur kerja terpisah:

* **Mode Simple MVP:** Berfokus pada komponen esensial (*Problem Statement*, *Core Features*, *High-level Flow*) untuk percepatan fase *prototyping* atau proyek skala kecil.
* **Mode Enterprise:** Menyediakan modul dokumentasi mendalam termasuk *Persona Matrix*, *Design System Standard*, *Role & Permission Matrix*, *Schema Data*, *Acceptance Criteria*, hingga *Non-Functional Requirements (NFR)* dan *Risk Analysis*.

---

## Fitur Unggulan

### Fleksibilitas & Kustomisasi
* **Dynamic Section Toggling:** Aktifkan modul Enterprise secara parsial di Mode Simple tanpa perlu mengubah struktur dokumen secara keseluruhan.
* **Live Side-by-Side Preview:** Render dokumen secara *real-time* saat pengisian data.

### Editor & Manajemen Data
* **Data Schema & Architecture Mapping:** Tentukan entitas data, relasi, tipe data, dan dependensi sistem secara eksplisit.
* **State Persistence & History:** Dilengkapi fitur *Auto-save* ke `localStorage` serta *Undo/Redo stack* hingga 50 riwayat perubahan.
* **Integrated Sample Data:** Lakukan eksplorasi fitur secara cepat menggunakan preset data bawaan (*Prime Property Case Study*).

### Interoperabilitas Multi-Format
* **Export & Import JSON:** Simpan berkas mentah untuk kebutuhan *backup* atau kolaborasi antar anggota tim.
* **Markdown Generator:** Salin format Markdown siap pakai untuk diintegrasikan ke Notion, GitHub, atau Jira.
* **A4 Print Engine:** Layout teroptimasi khusus untuk cetak langsung atau *Export to PDF* dengan tampilan korporat yang rapi.

---

## Stack Teknologi

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 | Library utama antarmuka komponen |
| **Build Tooling** | Vite 8 | Transpiler dan *dev server* berkecepatan tinggi |
| **Styling Engine** | Tailwind CSS 4 | *Utility-first CSS framework* untuk desain responsif |
| **State Management** | Zustand 5 | Manajemen state global yang ringan dan terprediksi |
| **Icons & Media** | Font Awesome 7 | Set ikon grafis untuk navigasi UI |
| **Utilities** | Lodash, File-Saver | Manipulasi data, manajemen *history*, dan penanganan ekspor berkas |

---

## Panduan Memulai (*Quick Start*)

### Prasyarat Sistem
* **Node.js**: v18.0.0 atau versi terbaru
* **Package Manager**: `npm` v9+ atau `yarn` / `pnpm`

### Langkah Instalasi

1. **Clone repositori:**
   ```bash
   git clone https://github.com/username/prd-architect-pro.git
   cd prd-architect-pro
   ```

2. **Pasang dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Akses aplikasi pada peramban melalui alamat `http://localhost:5173`.

4. **Kompilasi untuk Production:**
   ```bash
   npm run build
   ```
   Aset hasil kompilasi akan tersimpan pada direktori `/dist`.

---

## Struktur Direktori Proyek

```bash
prd-architect-pro/
├── src/
│   ├── components/
│   │   ├── editor/          # Panel kontrol dan pengisian formulir
│   │   │   └── sections/    # Komponen formulir spesifik per modul
│   │   ├── header/          # Header utama, status indicator, & mode switcher
│   │   ├── mobile/          # Modul responsif dan gesture navigation
│   │   ├── preview/         # Visualizer dokumen live-preview
│   │   │   └── sections/    # Komponen renderer dokumen spesifik
│   │   └── shared/          # UI Kit reusable (Input, Modal, Button)
│   ├── hooks/               # Custom hooks (Auto-save, History management)
│   ├── services/            # Modul parser Markdown, PDF, dan File I/O
│   ├── store/               # Zustand Central Store & State Mutator
│   ├── styles/              # Design tokens dan Tailwind directives
│   ├── utils/               # Form validator, formatter, dan mock constants
│   ├── App.jsx              # Application Layout Shell
│   └── main.jsx             # Entry point React DOM
├── public/                  # Aset statis & manifes
└── package.json             # Dependensi dan skrip proyek
```

---

## Pintasan Board (Keyboard Shortcuts)

| Kombinasi Tombol | Aksi |
| :--- | :--- |
| `Ctrl` + `Z` | Batalkan perubahan terakhir (*Undo*) |
| `Ctrl` + `Y` | Ulangi perubahan (*Redo*) |
| `Ctrl` + `Shift` + `Z` | Alternatif *Redo* |

---

## Kontribusi

Aplikasi ini bersifat terbuka untuk pengembang dan praktisi manajemen produk. Jika Anda ingin berkontribusi:

1. Lakukan **Fork** pada repositori ini.
2. Buat *feature branch* baru (`git checkout -b feature/FiturBaru`).
3. Simpan perubahan Anda (`git commit -m 'feat: menambahkan modul export baru'`).
4. Unggah ke branch Anda (`git push origin feature/FiturBaru`).
5. Buat **Pull Request** baru untuk ditinjau.

---

## Lisensi

Proyek ini didistribusikan di bawah lisensi **MIT**. Silakan merujuk ke berkas [LICENSE](./LICENSE) untuk informasi selengkapnya.

---

<p align="center">
  Didesain untuk efisiensi tim produk modern. Dipelihara oleh komunitas open-source.
</p>
````

## File: src/components/editor/sections/AcSection.jsx
````javascript
import { faClipboardCheck, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';

export default function AcSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const ac = usePrdStore(function (s) { return s.acModules; });
  const addM = usePrdStore(function (s) { return s.addAcModule; });
  const updM = usePrdStore(function (s) { return s.updateAcModule; });
  const remM = usePrdStore(function (s) { return s.removeAcModule; });
  const addI = usePrdStore(function (s) { return s.addAcItem; });
  const updI = usePrdStore(function (s) { return s.updateAcItem; });
  const remI = usePrdStore(function (s) { return s.removeAcItem; });

  if (mode !== 'enterprise' && !se.ac) return null;

  return (
    <EditorSection title="Acceptance Criteria per Modul" icon={faClipboardCheck} color="amber"
      action={<IconButton onClick={addM} variant="accent" ariaLabel="Tambah modul baru">+ Modul</IconButton>}>
      <div className="space-y-4">
        {ac.map(function (m, mi) {
          return (
            <div key={mi} className="p-3 bg-slate-900 border border-amber-900/50 rounded-lg space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <label htmlFor={'ac-mod-title-' + mi} className="sr-only">Nama modul {mi + 1}</label>
                <input id={'ac-mod-title-' + mi} value={m.title} onChange={function (e) { updM(mi, { title: e.target.value }); }} placeholder="Nama modul" className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 font-semibold w-2/3" />
                <button onClick={function () { remM(mi); }} aria-label={'Hapus modul ' + (m.title || (mi + 1))} className="text-rose-400 hover:text-rose-300">
                  <FontAwesomeIcon icon={faXmark} aria-hidden="true" /> Hapus
                </button>
              </div>
              <div className="space-y-2">
                {m.items.map(function (it, ii) {
                  return (
                    <div key={ii} className="p-2 bg-slate-800/60 border border-slate-700 rounded space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-400">AC-{mi + 1}.{ii + 1}</span>
                        <button onClick={function () { remI(mi, ii); }} aria-label={'Hapus kriteria AC-' + (mi + 1) + '.' + (ii + 1)} className="text-rose-400 hover:text-rose-300">
                          <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
                        </button>
                      </div>
                      <label htmlFor={'ac-item-title-' + mi + '-' + ii} className="sr-only">Judul kriteria AC-{mi + 1}.{ii + 1}</label>
                      <input id={'ac-item-title-' + mi + '-' + ii} value={it.title} onChange={function (e) { updI(mi, ii, { title: e.target.value }); }} placeholder="Judul kriteria" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
                      <label htmlFor={'ac-item-desc-' + mi + '-' + ii} className="sr-only">Deskripsi kriteria AC-{mi + 1}.{ii + 1}</label>
                      <textarea id={'ac-item-desc-' + mi + '-' + ii} value={it.desc} onChange={function (e) { updI(mi, ii, { desc: e.target.value }); }} rows="2" placeholder="Deskripsi kriteria..." className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 resize-none" />
                    </div>
                  );
                })}
              </div>
              <button onClick={function () { addI(mi); }} aria-label={'Tambah kriteria ke modul ' + (m.title || (mi + 1))} className="text-amber-400 hover:text-amber-300 font-semibold">
                <FontAwesomeIcon icon={faPlus} className="mr-1" aria-hidden="true" />Tambah Kriteria
              </button>
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
````

## File: src/components/editor/sections/BrandingSection.jsx
````javascript
import { faPalette, faEyeDropper, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import { liveHexColor, normalizeHex } from '../../../utils/helpers';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';

export default function BrandingSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  const palette = usePrdStore(function (s) { return s.palette; });
  const addP = usePrdStore(function (s) { return s.addPalette; });
  const updP = usePrdStore(function (s) { return s.updatePalette; });
  const remP = usePrdStore(function (s) { return s.removePalette; });

  if (mode !== 'enterprise' && !se.branding) return null;

  const bps = [
    { l: 'Mobile', k: 'bpMobile' },
    { l: 'Tablet', k: 'bpTablet' },
    { l: 'Desktop', k: 'bpDesktop' },
  ];

  return (
    <EditorSection title="Branding & Design System" icon={faPalette} color="amber"
      action={<IconButton onClick={addP} variant="accent" ariaLabel="Tambah warna baru">+ Warna</IconButton>}>
      <div className="space-y-2">
        {palette.map(function (p, i) {
          const d = (p.hex || '').replace(/^#/, '');
          return (
            <div key={i} className="grid grid-cols-6 md:grid-cols-12 gap-2 items-center p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs">
              <span className="col-span-1 order-1 flex justify-center" aria-hidden="true">
                <span className="w-5 h-5 rounded-full border border-slate-600" style={{ background: liveHexColor(d) || '#0f172a' }} />
              </span>
              <label htmlFor={'palette-name-' + i} className="sr-only">Nama warna {i + 1}</label>
              <input id={'palette-name-' + i} value={p.name} onChange={function (e) { updP(i, { name: e.target.value }); }} placeholder="Nama warna" className="col-span-4 md:col-span-3 order-2 bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
              <div className="relative col-span-3 md:col-span-4 order-4 md:order-3">
                <label htmlFor={'palette-hex-' + i} className="sr-only">Kode hex warna {i + 1}</label>
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[11px] pointer-events-none" aria-hidden="true">#</span>
                <input id={'palette-hex-' + i} type="text" value={d} onChange={function (e) { const c = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6); updP(i, { hex: c ? '#' + c : '' }); }} placeholder="C9A961" maxLength="6" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 pl-6 pr-8 text-slate-100 font-mono focus:border-amber-500 focus:outline-none" />
                <label htmlFor={'palette-picker-' + i} className="sr-only">Pilih warna {i + 1}</label>
                <input id={'palette-picker-' + i} type="color" value={normalizeHex(p.hex)} onChange={function (e) { updP(i, { hex: e.target.value }); }} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 cursor-pointer" />
                <FontAwesomeIcon icon={faEyeDropper} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
              </div>
              <label htmlFor={'palette-usage-' + i} className="sr-only">Penggunaan warna {i + 1}</label>
              <input id={'palette-usage-' + i} value={p.usage} onChange={function (e) { updP(i, { usage: e.target.value }); }} placeholder="Penggunaan" className="col-span-3 order-5 md:order-4 bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
              <button onClick={function () { remP(i); }} aria-label={'Hapus warna ' + (p.name || (i + 1))} className="col-span-1 order-3 md:order-5 text-rose-400 hover:text-rose-300 flex justify-center">
                <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
      <div className="space-y-3 text-xs pt-2">
        <div>
          <label htmlFor="brandTypography" className="block text-slate-300 font-medium mb-1">Typography</label>
          <input id="brandTypography" type="text" value={f.brandTypography} onChange={function (e) { set('brandTypography', e.target.value); }} placeholder="misal: Inter / Geist" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="brandLayout" className="block text-slate-300 font-medium mb-1">Prinsip Layout</label>
          <textarea id="brandLayout" value={f.brandLayout} onChange={function (e) { set('brandLayout', e.target.value); }} rows="2" placeholder="misal: compact, mobile-responsive" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none resize-none" />
        </div>
        <div>
          <span className="block text-slate-300 font-medium mb-1">Breakpoint Responsif</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {bps.map(function (bp) {
              return (
                <div key={bp.k}>
                  <label htmlFor={bp.k + '-op'} className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">{bp.l} operator</label>
                  <div className="flex">
                    <select id={bp.k + '-op'} value={f[bp.k + 'Op']} onChange={function (e) { set(bp.k + 'Op', e.target.value); }} className="bg-slate-800 border border-slate-700 rounded-l-lg px-1.5 py-2 text-[11px] text-slate-300 font-mono">
                      <option value={'\u2264'}>{'\u2264'}</option>
                      <option value={'\u2265'}>{'\u2265'}</option>
                      <option value="=">=</option>
                    </select>
                    <label htmlFor={bp.k} className="sr-only">{bp.l} breakpoint value</label>
                    <input id={bp.k} type="text" value={f[bp.k]} onChange={function (e) { set(bp.k, e.target.value.replace(/[^0-9.]/g, '')); }} placeholder={bp.l === 'Mobile' ? '640' : '1024'} className="w-full min-w-0 bg-slate-900 border-y border-slate-700 px-2 py-2 text-[11px] text-slate-100 font-mono" />
                    <label htmlFor={bp.k + '-unit'} className="sr-only">{bp.l} unit</label>
                    <select id={bp.k + '-unit'} value={f[bp.k + 'Unit']} onChange={function (e) { set(bp.k + 'Unit', e.target.value); }} className="bg-slate-800 border border-slate-700 rounded-r-lg px-1.5 py-2 text-[11px] text-slate-300 font-mono">
                      <option value="px">px</option>
                      <option value="rem">rem</option>
                      <option value="em">em</option>
                      <option value="%">%</option>
                      <option value="vw">vw</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </EditorSection>
  );
}
````

## File: src/components/editor/sections/FeaturesList.jsx
````javascript
import { faListCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';

export default function FeaturesList() {
  const features = usePrdStore(function (s) { return s.features; });
  const add = usePrdStore(function (s) { return s.addFeature; });
  const upd = usePrdStore(function (s) { return s.updateFeature; });
  const rem = usePrdStore(function (s) { return s.removeFeature; });

  return (
    <EditorSection title="3. Fitur Utama (Requirements)" icon={faListCheck}
      action={<IconButton onClick={add} ariaLabel="Tambah fitur baru">+ Tambah Fitur</IconButton>}>
      <div className="space-y-3">
        {features.map(function (f, i) {
          return (
            <div key={i} className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-400">{f.id}</span>
                <button onClick={function () { rem(i); }} aria-label={'Hapus fitur ' + (f.name || f.id)} className="text-rose-400 hover:text-rose-300 text-xs">
                  <FontAwesomeIcon icon={faXmark} aria-hidden="true" /> Hapus
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <label htmlFor={'feat-name-' + i} className="sr-only">Nama fitur {i + 1}</label>
                <input id={'feat-name-' + i} type="text" value={f.name} onChange={function (e) { upd(i, { name: e.target.value }); }} placeholder="Nama Fitur" className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
                <label htmlFor={'feat-story-' + i} className="sr-only">Deskripsi fitur {i + 1}</label>
                <input id={'feat-story-' + i} type="text" value={f.story} onChange={function (e) { upd(i, { story: e.target.value }); }} placeholder="Deskripsi / User Story" className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 md:col-span-2" />
              </div>
              <label htmlFor={'feat-priority-' + i} className="sr-only">Prioritas fitur {i + 1}</label>
              <select id={'feat-priority-' + i} value={f.priority} onChange={function (e) { upd(i, { priority: e.target.value }); }} className="bg-slate-800 border border-slate-700 rounded p-1 text-slate-100 text-[11px]">
                <option value="High">High (Must-Have)</option>
                <option value="Medium">Medium (Should-Have)</option>
                <option value="Low">Low (Nice-to-Have)</option>
              </select>
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
````

## File: src/components/editor/sections/NfrSection.jsx
````javascript
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

function TA(props) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-slate-300 font-medium mb-1">{props.label}</label>
      <textarea id={props.id} value={props.value} onChange={function (e) { props.onChange(e.target.value); }} rows="2" placeholder={props.ph} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none resize-none" />
    </div>
  );
}

export default function NfrSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });

  if (mode !== 'enterprise' && !se.nfr) return null;

  return (
    <EditorSection title="NFR, Keamanan & Figma Prototype" icon={faShieldHalved} color="amber">
      <div className="space-y-3 text-xs">
        <TA id="nfrSpecs" label="Keamanan & Compliance" value={f.nfrSpecs} onChange={function (v) { set('nfrSpecs', v); }} ph="OAuth 2.0, HTTPS, CSRF" />
        <TA id="nfrPerformance" label="Performance" value={f.nfrPerformance} onChange={function (v) { set('nfrPerformance', v); }} ph="FCP < 1.5s, Lighthouse >= 85" />
        <TA id="nfrLocalization" label="Bahasa & Lokalisasi" value={f.nfrLocalization} onChange={function (v) { set('nfrLocalization', v); }} ph="UI Bahasa Indonesia, format Rupiah" />
        <TA id="nfrBrowser" label="Browser Support" value={f.nfrBrowser} onChange={function (v) { set('nfrBrowser', v); }} ph="Chrome/Edge/Firefox/Safari" />
        <div>
          <label htmlFor="figmaLink" className="block text-slate-300 font-medium mb-1">Figma Link</label>
          <input id="figmaLink" type="text" value={f.figmaLink} onChange={function (e) { set('figmaLink', e.target.value); }} placeholder="https://figma.com/file/..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none" />
        </div>
        <TA id="riskMitigation" label="Analisis Risiko & Mitigasi" value={f.riskMitigation} onChange={function (v) { set('riskMitigation', v); }} ph="Risiko teknis / bisnis..." />
      </div>
    </EditorSection>
  );
}
````

## File: src/components/editor/sections/OutOfScope.jsx
````javascript
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

export default function OutOfScope() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });

  return (
    <EditorSection title="5. Batasan (Out of Scope) & Definition of Done" icon={faBan}>
      <div className="space-y-3 text-xs">
        <div>
          <label htmlFor="outOfScope" className="block text-rose-300 font-medium mb-1">Fitur Ditunda (Out of Scope)</label>
          <textarea id="outOfScope" value={f.outOfScope} onChange={function (e) { set('outOfScope', e.target.value); }} rows="2" placeholder="Fitur yang sengaja ditunda (pisahkan per baris)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label htmlFor="defOfDone" className="block text-emerald-300 font-medium mb-1">Kriteria Selesai (Definition of Done)</label>
          <textarea id="defOfDone" value={f.defOfDone} onChange={function (e) { set('defOfDone', e.target.value); }} rows="2" placeholder="Kapan proyek ini dianggap rilis sukses?" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" />
        </div>
      </div>
    </EditorSection>
  );
}
````

## File: src/components/editor/sections/PersonaSection.jsx
````javascript
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

export default function PersonaSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });

  if (mode !== 'enterprise' && !se.persona) return null;

  return (
    <EditorSection title="Target User Persona & KPI Sukses" icon={faUsers} color="amber">
      <div className="space-y-3 text-xs">
        <div>
          <label htmlFor="userPersona" className="block text-slate-300 font-medium mb-1">Target User Persona</label>
          <textarea id="userPersona" value={f.userPersona} onChange={function (e) { set('userPersona', e.target.value); }} rows="2" placeholder="Siapa segmen target pengguna utama?" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label htmlFor="successMetrics" className="block text-slate-300 font-medium mb-1">Metrik & Analytics KPI</label>
          <textarea id="successMetrics" value={f.successMetrics} onChange={function (e) { set('successMetrics', e.target.value); }} rows="2" placeholder="Indikator keberhasilan" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none resize-none" />
        </div>
      </div>
    </EditorSection>
  );
}
````

## File: src/components/editor/sections/ProblemGoal.jsx
````javascript
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

export default function ProblemGoal() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });

  return (
    <EditorSection title="2. Masalah & Tujuan (Problem & Goal)" icon={faBullseye}>
      <div className="space-y-3 text-xs">
        <div>
          <label htmlFor="problemStatement" className="block text-slate-300 font-medium mb-1">Latar Belakang / Problem Statement</label>
          <textarea id="problemStatement" value={f.problemStatement} onChange={function (e) { set('problemStatement', e.target.value); }} rows="3" placeholder="Masalah utama apa yang dihadapi calon pengguna?" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label htmlFor="productGoal" className="block text-slate-300 font-medium mb-1">Tujuan Utama Produk (Goals)</label>
          <textarea id="productGoal" value={f.productGoal} onChange={function (e) { set('productGoal', e.target.value); }} rows="3" placeholder="Solusi konkret dan target yang ingin dicapai..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" />
        </div>
      </div>
    </EditorSection>
  );
}
````

## File: src/components/editor/sections/ProjectInfo.jsx
````javascript
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

export default function ProjectInfo() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });

  return (
    <EditorSection title="1. Informasi Proyek & Metadata" icon={faCircleInfo}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label htmlFor="projectName" className="block text-slate-300 font-medium mb-1">Nama Proyek / Aplikasi</label>
          <input id="projectName" type="text" value={f.projectName} onChange={function (e) { set('projectName', e.target.value); }} placeholder="misal: Prime Property" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="docVersion" className="block text-slate-300 font-medium mb-1">Versi Dokumen</label>
          <input id="docVersion" type="text" value={f.docVersion} onChange={function (e) { set('docVersion', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="author" className="block text-slate-300 font-medium mb-1">Penulis / Product Owner</label>
          <input id="author" type="text" value={f.author} onChange={function (e) { set('author', e.target.value); }} placeholder="Nama Anda / Tim Product" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="targetDate" className="block text-slate-300 font-medium mb-1">Target Rilis</label>
          <input id="targetDate" type="date" value={f.targetDate} onChange={function (e) { set('targetDate', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="targetDateFormat" className="block text-slate-300 font-medium mb-1">Format Tampilan Target Rilis</label>
          <select id="targetDateFormat" value={f.targetDateFormat} onChange={function (e) { set('targetDateFormat', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none">
            <option value="full">Tanggal Lengkap</option>
            <option value="month">Bulan + Tahun</option>
            <option value="quarter">Kuartal + Tahun</option>
          </select>
        </div>
      </div>
    </EditorSection>
  );
}
````

## File: src/components/editor/sections/RolesSection.jsx
````javascript
import { faUserShield, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';

export default function RolesSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const roles = usePrdStore(function (s) { return s.roles; });
  const add = usePrdStore(function (s) { return s.addRole; });
  const upd = usePrdStore(function (s) { return s.updateRole; });
  const rem = usePrdStore(function (s) { return s.removeRole; });

  if (mode !== 'enterprise' && !se.roles) return null;

  return (
    <EditorSection title="Role & Permission Matrix" icon={faUserShield} color="amber"
      action={<IconButton onClick={add} variant="accent" ariaLabel="Tambah role baru">+ Role</IconButton>}>
      <div className="space-y-3">
        {roles.map(function (r, i) {
          return (
            <div key={i} className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <label htmlFor={'role-name-' + i} className="sr-only">Nama role {i + 1}</label>
                <input id={'role-name-' + i} value={r.name} onChange={function (e) { upd(i, { name: e.target.value }); }} placeholder="Nama role" className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 font-semibold w-1/2" />
                <button onClick={function () { rem(i); }} aria-label={'Hapus role ' + (r.name || (i + 1))} className="text-rose-400 hover:text-rose-300">
                  <FontAwesomeIcon icon={faXmark} aria-hidden="true" /> Hapus
                </button>
              </div>
              <label htmlFor={'role-can-' + i} className="sr-only">Hak akses role {i + 1}</label>
              <textarea id={'role-can-' + i} value={r.can} onChange={function (e) { upd(i, { can: e.target.value }); }} rows="2" placeholder="Yang boleh dilakukan" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 resize-none" />
              <label htmlFor={'role-cannot-' + i} className="sr-only">Batasan role {i + 1}</label>
              <textarea id={'role-cannot-' + i} value={r.cannot} onChange={function (e) { upd(i, { cannot: e.target.value }); }} rows="2" placeholder="Yang TIDAK boleh dilakukan" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 resize-none" />
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
````

## File: src/components/editor/sections/SchemaSection.jsx
````javascript
import { faTableList, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';
import ComboBox from '../../shared/ComboBox';

export default function SchemaSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const st = usePrdStore(function (s) { return s.schemaTables; });
  const addT = usePrdStore(function (s) { return s.addSchemaTable; });
  const updT = usePrdStore(function (s) { return s.updateSchemaTable; });
  const remT = usePrdStore(function (s) { return s.removeSchemaTable; });
  const addF = usePrdStore(function (s) { return s.addSchemaField; });
  const updF = usePrdStore(function (s) { return s.updateSchemaField; });
  const remF = usePrdStore(function (s) { return s.removeSchemaField; });

  if (mode !== 'enterprise' && !se.schema) return null;

  return (
    <EditorSection title="Schema Data (Multi-Tabel)" icon={faTableList} color="amber"
      action={<IconButton onClick={addT} variant="accent" ariaLabel="Tambah tabel baru">+ Tabel</IconButton>}>
      <p className="text-[11px] text-slate-500 -mt-1">Tambahkan nama tabel beserta propertinya.</p>
      <div className="space-y-4">
        {st.map(function (t, ti) {
          return (
            <div key={ti} className="p-3 bg-slate-900 border border-amber-900/50 rounded-lg space-y-3 text-xs">
              <div className="grid grid-cols-6 md:grid-cols-12 gap-2 items-center">
                <span className="col-span-1 order-1 text-amber-400 text-center" aria-hidden="true">
                  <FontAwesomeIcon icon={faTableList} />
                </span>
                <label htmlFor={'schema-tbl-name-' + ti} className="sr-only">Nama tabel {ti + 1}</label>
                <input id={'schema-tbl-name-' + ti} value={t.name} onChange={function (e) { updT(ti, { name: e.target.value }); }} placeholder="Nama tabel" className="col-span-4 md:col-span-4 order-2 bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 font-mono font-semibold" />
                <button onClick={function () { remT(ti); }} aria-label={'Hapus tabel ' + (t.name || (ti + 1))} className="col-span-1 order-3 md:order-4 text-rose-400 hover:text-rose-300 flex justify-center">
                  <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
                </button>
                <label htmlFor={'schema-tbl-desc-' + ti} className="sr-only">Deskripsi tabel {ti + 1}</label>
                <input id={'schema-tbl-desc-' + ti} value={t.desc} onChange={function (e) { updT(ti, { desc: e.target.value }); }} placeholder="Deskripsi tabel" className="col-span-6 md:col-span-6 order-4 md:order-3 bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
              </div>
              <div className="space-y-2">
                {t.fields.map(function (s, fi) {
                  return (
                    <div key={fi} className="grid grid-cols-6 md:grid-cols-12 gap-2 items-center p-2 bg-slate-800/60 border border-slate-700 rounded-lg">
                      <label htmlFor={'schema-fld-name-' + ti + '-' + fi} className="sr-only">Nama kolom {fi + 1} di tabel {t.name || (ti + 1)}</label>
                      <input id={'schema-fld-name-' + ti + '-' + fi} value={s.field} onChange={function (e) { updF(ti, fi, { field: e.target.value }); }} placeholder="Nama kolom" className="col-span-5 md:col-span-3 order-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono" />
                      <button onClick={function () { remF(ti, fi); }} aria-label={'Hapus kolom ' + (s.field || (fi + 1))} className="col-span-1 order-2 md:order-5 text-rose-400 hover:text-rose-300 flex justify-center">
                        <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
                      </button>
                      <div className="col-span-4 md:col-span-3 order-3 md:order-2">
                        <ComboBox value={s.type} onChange={function (v) { updF(ti, fi, { type: v }); }} label={'Tipe kolom ' + (s.field || (fi + 1))} />
                      </div>
                      <label htmlFor={'schema-fld-req-' + ti + '-' + fi} className="sr-only">Required status kolom {fi + 1}</label>
                      <select id={'schema-fld-req-' + ti + '-' + fi} value={s.required} onChange={function (e) { updF(ti, fi, { required: e.target.value }); }} className="col-span-2 md:col-span-2 order-4 md:order-3 bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100">
                        <option value="Ya">Not Null</option>
                        <option value="Opsional">Opsional</option>
                      </select>
                      <label htmlFor={'schema-fld-note-' + ti + '-' + fi} className="sr-only">Keterangan kolom {fi + 1}</label>
                      <input id={'schema-fld-note-' + ti + '-' + fi} value={s.note} onChange={function (e) { updF(ti, fi, { note: e.target.value }); }} placeholder="Keterangan" className="col-span-6 md:col-span-3 order-5 md:order-4 bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100" />
                    </div>
                  );
                })}
              </div>
              <button onClick={function () { addF(ti); }} aria-label={'Tambah kolom ke tabel ' + (t.name || (ti + 1))} className="text-amber-400 hover:text-amber-300 font-semibold">
                <FontAwesomeIcon icon={faPlus} className="mr-1" aria-hidden="true" />Tambah Kolom
              </button>
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
````

## File: src/components/editor/sections/TechStack.jsx
````javascript
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import { TECH_REQUIRED, TECH_OPTIONAL } from '../../../utils/constants';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';

function FieldRow(props) {
  const def = props.def;
  const value = props.value;
  const onChange = props.onChange;
  const onRemove = props.onRemove;
  const fieldId = 'tech-' + def.key;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={fieldId} className="text-slate-300 font-medium flex items-center">
          <FontAwesomeIcon icon={def.icon} className={def.color + ' mr-1'} aria-hidden="true" />
          {def.label}
        </label>
        {onRemove && (
          <button onClick={onRemove} className="text-rose-400 hover:text-rose-300 text-[10px] font-semibold" title="Hapus stack ini" aria-label={'Hapus ' + def.label}>
            <FontAwesomeIcon icon={faXmark} className="mr-1" aria-hidden="true" />
            Hapus
          </button>
        )}
      </div>
      <input
        id={fieldId}
        type="text"
        value={value}
        onChange={function (e) { onChange(e.target.value); }}
        placeholder={def.ph || ''}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

export default function TechStack() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  const techOptional = usePrdStore(function (s) { return s.techOptional; });
  const addTech = usePrdStore(function (s) { return s.addTechExtra; });
  const remTech = usePrdStore(function (s) { return s.removeTechExtra; });
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(function () {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return function () { document.removeEventListener('mousedown', onDoc); };
  }, []);

  const availEssential = TECH_OPTIONAL.filter(function (d) { return d.category === 'Esensial' && !techOptional.includes(d.key); });
  const availAdvanced = TECH_OPTIONAL.filter(function (d) { return d.category === 'Lanjutan' && !techOptional.includes(d.key); });
  const addedOptional = TECH_OPTIONAL.filter(function (d) { return techOptional.includes(d.key); });

  return (
    <EditorSection
      title="4. Spesifikasi Tech Stack & Arsitektur"
      icon={faLayerGroup}
      action={
        <div className="relative" ref={wrapRef}>
          <IconButton icon={faPlus} onClick={function () { setOpen(!open); }} ariaLabel="Tambah stack lanjutan">Tambah Stack Lanjutan</IconButton>
          {open && (
            <div className="absolute z-40 right-0 mt-2 w-80 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-72 overflow-y-auto" role="menu">
              {availEssential.length > 0 && (
                <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-slate-500 bg-slate-900 sticky top-0">Esensial</div>
              )}
              {availEssential.map(function (d) {
                return (
                  <button key={d.key} onClick={function () { addTech(d.key); }} role="menuitem" className="block w-full text-left px-3 py-2 text-[11px] text-slate-200 hover:bg-blue-600/30">
                    <FontAwesomeIcon icon={d.icon} className={d.color + ' mr-2'} aria-hidden="true" />
                    {d.label}
                  </button>
                );
              })}
              {availAdvanced.length > 0 && (
                <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-slate-500 bg-slate-900 sticky top-0">Lanjutan</div>
              )}
              {availAdvanced.map(function (d) {
                return (
                  <button key={d.key} onClick={function () { addTech(d.key); }} role="menuitem" className="block w-full text-left px-3 py-2 text-[11px] text-slate-200 hover:bg-blue-600/30">
                    <FontAwesomeIcon icon={d.icon} className={d.color + ' mr-2'} aria-hidden="true" />
                    {d.label}
                  </button>
                );
              })}
              {availEssential.length === 0 && availAdvanced.length === 0 && (
                <div className="px-3 py-2 text-[11px] text-slate-500 italic">Semua stack sudah ditambahkan.</div>
              )}
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-3 text-xs">
        <div>
          <label htmlFor="userFlow" className="block text-slate-300 font-medium mb-1">Alur Pengguna (User Flow)</label>
          <input id="userFlow" type="text" value={f.userFlow} onChange={function (e) { set('userFlow', e.target.value); }} placeholder="Landing -> Auth -> Dashboard" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {TECH_REQUIRED.map(function (d) {
            return <FieldRow key={d.key} def={d} value={f[d.key]} onChange={function (v) { set(d.key, v); }} />;
          })}
          {addedOptional.map(function (d) {
            return <FieldRow key={d.key} def={d} value={f[d.key]} onChange={function (v) { set(d.key, v); }} onRemove={function () { remTech(d.key); }} />;
          })}
        </div>
        <div className="pt-1">
          <label htmlFor="dbSchema" className="block text-slate-300 font-medium mb-1">Skema Database & Model Relasi</label>
          <textarea id="dbSchema" value={f.dbSchema} onChange={function (e) { set('dbSchema', e.target.value); }} rows="3" placeholder="users: id, name, email" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none font-mono resize-none" />
        </div>
      </div>
    </EditorSection>
  );
}
````

## File: src/components/preview/sections/NfrPreview.jsx
````javascript
import { usePrdStore } from '../../../store/usePrdStore';

export default function NfrPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });

  if (mode !== 'enterprise' && !se.nfr) return null;

  const isFigmaLink = f.figmaLink && /^https?:\/\//i.test(f.figmaLink);

  return (
    <div className="space-y-2 keep-together">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">4.2 NFR, Prototype & Analisis Risiko</h3>
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
````

## File: src/components/preview/PreviewActions.jsx
````javascript
import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFileExport, faFileImport, faCopy, faPrint } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';
import { exportService } from '../../services/exportService';
import { useToast } from '../../hooks/useToast';
import IconButton from '../shared/IconButton';

export default function PreviewActions() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const getSnap = usePrdStore(function (s) { return s.getSnapshot; });
  const restore = usePrdStore(function (s) { return s.restoreState; });
  const setMode = usePrdStore(function (s) { return s.setMode; });
  const commit = usePrdStore(function (s) { return s.commitHistory; });
  const ref = useRef(null);
  const showToast = useToast();

  function handleImport(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = function () {
      try {
        const d = JSON.parse(r.result);
        const st = d.state || d;
        if (!st || typeof st !== 'object' || !st.fields) {
          showToast('File JSON tidak valid', 'error');
          return;
        }
        if (d.mode) setMode(d.mode);
        restore(st);
        setTimeout(function () { commit(); }, 0);
        showToast('Dokumen berhasil diimpor');
      } catch (err) {
        showToast('File JSON tidak valid', 'error');
      }
    };
    r.readAsText(f);
    e.target.value = '';
  }

  const badge = mode === 'enterprise'
    ? 'bg-amber-900 text-amber-200 border-amber-700'
    : 'bg-blue-900 text-blue-200 border-blue-700';

  return (
    <div className="no-print flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-3 bg-slate-950 pb-4 pt-1 mb-4 border-b border-slate-800">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
        <FontAwesomeIcon icon={faEye} className="mr-1.5" aria-hidden="true" />
        Live Preview Dokumen
        <span className={'ml-2 px-2 py-0.5 rounded text-[10px] border ' + badge}>
          {mode === 'enterprise' ? 'ENTERPRISE' : 'SIMPLE'} MODE
        </span>
      </span>
      <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:flex-wrap sm:items-center">
        <IconButton icon={faFileExport} onClick={function () { exportService.exportJSON(getSnap()); showToast('JSON berhasil diunduh'); }} className="w-full sm:w-auto" ariaLabel="Ekspor JSON">JSON</IconButton>
        <IconButton icon={faFileImport} onClick={function () { ref.current && ref.current.click(); }} className="w-full sm:w-auto" ariaLabel="Impor JSON">Impor</IconButton>
        <input ref={ref} type="file" accept=".json" className="hidden" onChange={handleImport} aria-label="Pilih file JSON untuk diimpor" />
        <IconButton icon={faCopy} onClick={function () { exportService.copyMarkdown(getSnap()); showToast('Markdown disalin'); }} className="col-span-2 w-full sm:w-auto" ariaLabel="Salin Markdown">Salin Markdown</IconButton>
        <IconButton icon={faPrint} onClick={function () { exportService.printDocument(); }} variant="primary" className="col-span-2 w-full sm:w-auto" ariaLabel="Ekspor PDF atau cetak">Ekspor PDF / Cetak</IconButton>
      </div>
    </div>
  );
}
````

## File: src/components/shared/ComboBox.jsx
````javascript
import { useState, useRef, useEffect } from 'react';
import { DATA_TYPES } from '../../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function ComboBox(props) {
  const value = props.value;
  const onChange = props.onChange;
  const placeholder = props.placeholder || 'Tipe data';
  const label = props.label || 'Tipe data';
  const inputId = 'combo-' + (label || '').replace(/\s+/g, '-').toLowerCase() + '-' + Math.random().toString(36).slice(2, 7);

  const [open, setOpen] = useState(false);
  const [ai, setAi] = useState(-1);
  const ref = useRef(null);

  useEffect(function () {
    const h = function (e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return function () { document.removeEventListener('mousedown', h); };
  }, []);

  const q = (value || '').trim().toLowerCase();
  const flat = [];
  DATA_TYPES.forEach(function (cat) {
    cat.items.filter(function (it) { return !q || it.toLowerCase().includes(q); }).forEach(function (it) {
      flat.push({ cat: cat.category, value: it });
    });
  });

  const grouped = {};
  flat.forEach(function (it) {
    if (!grouped[it.cat]) grouped[it.cat] = [];
    grouped[it.cat].push(it.value);
  });

  const onKey = function (e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { setOpen(true); return; }
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setAi(function (i) { return (i + 1) % Math.max(1, flat.length); }); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAi(function (i) { return (i - 1 + flat.length) % Math.max(1, flat.length); }); }
    else if (e.key === 'Enter' && ai >= 0) { e.preventDefault(); onChange && onChange(flat[ai].value); setOpen(false); }
  };

  return (
    <div ref={ref} className="relative">
      <label htmlFor={inputId} className="sr-only">{label}</label>
      <input
        id={inputId}
        value={value}
        onChange={function (e) { onChange && onChange(e.target.value); setOpen(true); setAi(-1); }}
        onFocus={function () { setOpen(true); }}
        onKeyDown={onKey}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 pr-6 text-slate-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
      />
      <FontAwesomeIcon icon={faChevronDown} className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-500 pointer-events-none" aria-hidden="true" />
      {open && (
        <div className="absolute z-40 left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg max-h-56 overflow-y-auto shadow-xl" role="listbox">
          {Object.keys(grouped).length === 0 ? (
            <div className="px-2.5 py-2 text-[11px] text-slate-500 italic">Tidak ada tipe data yang cocok</div>
          ) : Object.entries(grouped).map(function (entry) {
            const cat = entry[0];
            const items = entry[1];
            return (
              <div key={cat}>
                <div className="px-2.5 py-1 text-[9px] uppercase tracking-wider text-slate-500 bg-slate-900 sticky top-0">{cat}</div>
                {items.map(function (it) {
                  const gi = flat.findIndex(function (x) { return x.value === it; });
                  return (
                    <button key={it} type="button" role="option" aria-selected={gi === ai} onClick={function () { onChange && onChange(it); setOpen(false); }}
                      className={'block w-full text-left px-2.5 py-1.5 text-[11px] text-slate-200 hover:bg-blue-600/30 font-mono ' + (gi === ai ? 'bg-blue-600/40' : '')}>{it}</button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
````

## File: src/components/shared/ToggleSwitch.jsx
````javascript
export default function ToggleSwitch(props) {
  const checked = props.checked;
  const onChange = props.onChange;
  const label = props.label;
  const icon = props.icon;
  const iconColor = props.iconColor || 'text-slate-400';
  const id = 'toggle-' + (label || '').replace(/\s+/g, '-').toLowerCase();

  return (
    <label htmlFor={id} className="extra-toggle flex items-center justify-between p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-700 rounded-lg cursor-pointer transition">
      <span className="flex items-center space-x-2 text-slate-200">
        {icon && <span className={'text-xs w-4 ' + iconColor}>{icon}</span>}
        <span className="text-[11px] font-medium">{label}</span>
      </span>
      <input
        id={id}
        type="checkbox"
        checked={!!checked}
        onChange={function (e) { onChange && onChange(e.target.checked); }}
        className="appearance-none w-9 h-5 bg-slate-600 rounded-full relative cursor-pointer transition-colors checked:bg-emerald-500 after:content-[''] after:absolute after:w-4 after:h-4 after:rounded-full after:bg-white after:top-0.5 after:left-0.5 after:transition-all checked:after:left-[18px]"
      />
    </label>
  );
}
````

## File: src/hooks/useAutoSave.js
````javascript
import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { usePrdStore } from '../store/usePrdStore';
import { storageService } from '../services/storageService';
import { AUTOSAVE_DELAY } from '../utils/constants';

export const useAutoSave = function () {
  const mode = usePrdStore(function (s) { return s.mode; });
  const fields = usePrdStore(function (s) { return s.fields; });
  const features = usePrdStore(function (s) { return s.features; });
  const palette = usePrdStore(function (s) { return s.palette; });
  const roles = usePrdStore(function (s) { return s.roles; });
  const schemaTables = usePrdStore(function (s) { return s.schemaTables; });
  const acModules = usePrdStore(function (s) { return s.acModules; });
  const simpleExtras = usePrdStore(function (s) { return s.simpleExtras; });
  const techOptional = usePrdStore(function (s) { return s.techOptional; });
  const aiFeedback = usePrdStore(function (s) { return s.aiFeedback; });
  const aiDraft = usePrdStore(function (s) { return s.aiDraft; });
  const setSaveIndicator = usePrdStore(function (s) { return s.setSaveIndicator; });
  const first = useRef(true);

  useEffect(function () {
    const payload = {
      mode: mode,
      state: {
        fields: fields,
        features: features,
        palette: palette,
        roles: roles,
        schemaTables: schemaTables,
        acModules: acModules,
        simpleExtras: simpleExtras,
        techOptional: techOptional,
        aiFeedback: aiFeedback,
        aiDraft: aiDraft,
      },
    };

    const save = debounce(function () {
      const ok = storageService.save(payload);
      if (ok) {
        const t = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setSaveIndicator('Tersimpan ' + t);
      }
    }, AUTOSAVE_DELAY);

    if (first.current) {
      first.current = false;
      save.flush();
    } else {
      save();
    }

    return function () { save.cancel(); };
  }, [mode, fields, features, palette, roles, schemaTables, acModules, simpleExtras, techOptional, aiFeedback, aiDraft, setSaveIndicator]);
};
````

## File: src/styles/globals.css
````css
@import "tailwindcss";

:root { font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
button:not(:disabled) { cursor: pointer; }
button:disabled { cursor: not-allowed; }

* { scrollbar-width: thin; scrollbar-color: #475569 transparent; }
*::-webkit-scrollbar { width: 6px; height: 6px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: #334155; border-radius: 999px; }
*::-webkit-scrollbar-thumb:hover { background: #64748b; }

textarea { overflow-y: hidden; }
input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); cursor: pointer; }

/* Skip link utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.sr-only:focus {
  position: fixed;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

@keyframes slideUp {
  from { transform: translateY(12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

#panelSlider {
  display: flex; flex-direction: row; height: 100%;
  width: 200%; transform: translateX(0);
  transition: transform 0.55s cubic-bezier(0.22,0.61,0.36,1);
  will-change: transform;
}
#panelSlider.slide-preview { transform: translateX(-50%); }
#panelSlider > div { width: 50%; height: 100%; flex-shrink: 0; min-height: 0; }

@media (min-width: 1024px) {
  #panelSlider { width: 100% !important; transform: none !important; transition: none !important; }
}

@media (max-width: 1023.98px) {
  html, body { overflow: hidden; }
  body { height: 100vh; height: 100dvh; min-height: 0 !important; }
  #panelSlider {
    height: 100%;
    padding-bottom: calc(56px + env(safe-area-inset-bottom));
    box-sizing: border-box;
  }
  #panelSlider > div > section {
    max-height: none !important; height: 100% !important;
    min-height: 0; overflow-y: auto !important;
  }
}

#prdDocument { min-width: 0; }
#prdDocument table { table-layout: fixed; width: 100%; }
#prdDocument th, #prdDocument td { overflow-wrap: break-word; }
#prdDocument p, #prdDocument span, #prdDocument li { overflow-wrap: anywhere; }

@media screen and (max-width: 640px) {
  #prdDocument { padding: 1.5rem 1rem; }
  #prdDocument table.tbl-stack { table-layout: auto; border: none; }
  #prdDocument table.tbl-stack thead { display: none; }
  #prdDocument table.tbl-stack, #prdDocument table.tbl-stack tbody,
  #prdDocument table.tbl-stack tr, #prdDocument table.tbl-stack td {
    display: block; width: 100%; box-sizing: border-box;
  }
  #prdDocument table.tbl-stack tr {
    border: 1px solid #e2e8f0; border-radius: 10px;
    margin-bottom: 10px; padding: 10px 12px; background: #f8fafc;
  }
  #prdDocument table.tbl-stack td { border: none; padding: 4px 0; text-align: left; }
  #prdDocument table.tbl-stack td[data-label]::before {
    content: attr(data-label); display: block; font-size: 9px;
    font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
    color: #64748b; margin-bottom: 1px;
  }
}

@page { size: A4; margin: 14mm 12mm; }

@media print {
  .no-print, nav, header { display: none !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  html, body { background: #ffffff !important; height: auto !important; overflow: visible !important; }
  #root { height: auto !important; }
  #root > div {
    display: block !important; height: auto !important;
    overflow: visible !important; background: #ffffff !important;
  }
  main { display: block !important; height: auto !important; overflow: visible !important; }
  #panelSlider {
    display: block !important; width: 100% !important;
    height: auto !important; transform: none !important; padding: 0 !important;
  }
  #panelSlider > div { width: 100% !important; height: auto !important; overflow: visible !important; }
  #panelSlider > div:first-child { display: none !important; }
  #previewPanel {
    height: auto !important; max-height: none !important;
    overflow: visible !important; background: #ffffff !important; padding: 0 !important;
  }
  #prdDocument {
    max-width: 100% !important; margin: 0 !important; padding: 0 !important;
    border: none !important; border-radius: 0 !important;
    box-shadow: none !important; background: #ffffff !important;
  }
  .keep-together { break-inside: avoid !important; page-break-inside: avoid !important; }
  tr { break-inside: avoid !important; page-break-inside: avoid !important; }
  h1, h2, h3, h4 { break-after: avoid !important; page-break-after: avoid !important; }
  p, li { orphans: 3; widows: 3; }
  pre { break-inside: avoid !important; white-space: pre-wrap !important; word-break: break-word !important; }
  .shadow-lg, .shadow-md, .shadow-2xl { box-shadow: none !important; }
}
````

## File: src/App.jsx
````javascript
import { useEffect, useRef, lazy, Suspense } from 'react';
import { debounce } from 'lodash';
import { usePrdStore } from './store/usePrdStore';
import { storageService } from './services/storageService';
import Header from './components/header/Header';
import EditorPanel from './components/editor/EditorPanel';
import MobileTabBar from './components/mobile/MobileTabBar';
import ScrollButtons from './components/mobile/ScrollButtons';
import ToastContainer from './components/shared/Toast';

const PreviewPanel = lazy(() => import('./components/preview/PreviewPanel'));

export default function App() {
  const restoreState = usePrdStore(function (s) { return s.restoreState; });
  const setMode = usePrdStore(function (s) { return s.setMode; });
  const initDoneRef = useRef(false);

  useEffect(function () {
    if (initDoneRef.current) return;
    initDoneRef.current = true;
    const saved = storageService.load();
    if (saved && saved.state) {
      if (saved.mode) setMode(saved.mode);
      restoreState(saved.state);
    }
    setTimeout(function () { usePrdStore.getState().commitHistory(); }, 0);
  }, []);

  useEffect(function () {
    const commit = debounce(function () { usePrdStore.getState().commitHistory(); }, 500);
    function onInput(e) {
      if (e.target.matches && e.target.matches('input, textarea, select')) commit();
    }
    function onClick(e) {
      const b = e.target.closest ? e.target.closest('button') : null;
      if (!b) return;
      const t = b.title || '';
      if (t.indexOf('Undo') === 0 || t.indexOf('Redo') === 0) return;
      commit();
    }
    document.addEventListener('input', onInput);
    document.addEventListener('change', onInput);
    document.addEventListener('click', onClick);
    return function () {
      document.removeEventListener('input', onInput);
      document.removeEventListener('change', onInput);
      document.removeEventListener('click', onClick);
      commit.cancel();
    };
  }, []);

  useEffect(function () {
    function handler(e) {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        usePrdStore.getState().undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        usePrdStore.getState().redo();
      }
    }
    document.addEventListener('keydown', handler);
    return function () { document.removeEventListener('keydown', handler); };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
      <a
        href="#editorPanel"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-blue-600 focus:text-white focus:px-3 focus:py-2 focus:rounded focus:text-sm"
      >
        Lompat ke Editor
      </a>
      <a
        href="#previewPanel"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-emerald-600 focus:text-white focus:px-3 focus:py-2 focus:rounded focus:text-sm"
      >
        Lompat ke Preview
      </a>
      <Header />
      <main className="flex-grow min-h-0 overflow-hidden relative">
        <div id="panelSlider">
          <div><EditorPanel /></div>
          <div>
            <Suspense fallback={
              <div id="previewPanel" className="bg-slate-950 p-6 flex items-center justify-center" style={{ height: '100%' }}>
                <div className="text-slate-400 text-sm">Memuat preview...</div>
              </div>
            }>
              <PreviewPanel />
            </Suspense>
          </div>
        </div>
        <ScrollButtons />
      </main>
      <MobileTabBar />
      <ToastContainer />
    </div>
  );
}
````

## File: vite.config.js
````javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: function (id) {
          // Pisahkan dependensi dari node_modules ke chunk yang berbeda
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('@fortawesome')) {
              return 'icons';
            }
            if (id.includes('lodash') || id.includes('zustand')) {
              return 'utils';
            }
            if (id.includes('file-saver') || id.includes('copy-to-clipboard')) {
              return 'services';
            }
            // Fallback untuk node_modules lainnya
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
});
````

## File: src/components/editor/EditorPanel.jsx
````javascript
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faSpinner, faTrash, faRobot } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import { usePrdStore } from '../../store/usePrdStore';
import { useToast } from '../../hooks/useToast';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useAutoResize } from '../../hooks/useAutoResize';
import ModeBanner from './ModeBanner';
import ExtrasPicker from './ExtrasPicker';
import ProjectInfo from './sections/ProjectInfo';
import ProblemGoal from './sections/ProblemGoal';
import PersonaSection from './sections/PersonaSection';
import BrandingSection from './sections/BrandingSection';
import RolesSection from './sections/RolesSection';
import FeaturesList from './sections/FeaturesList';
import AcSection from './sections/AcSection';
import TechStack from './sections/TechStack';
import SchemaSection from './sections/SchemaSection';
import NfrSection from './sections/NfrSection';
import OutOfScope from './sections/OutOfScope';

function AiAnalysisCard() {
  const analyzeWithAi = usePrdStore((s) => s.analyzeWithAi);
  const applyAiDraft = usePrdStore((s) => s.applyAiDraft);
  const rawAiFeedback = usePrdStore((s) => s.aiFeedback);
  const aiDraft = usePrdStore((s) => s.aiDraft);
  const isAnalyzing = usePrdStore((s) => s.isAnalyzing);
  const aiError = usePrdStore((s) => s.aiError);
  const clearAiFeedback = usePrdStore((s) => s.clearAiFeedback);
  const showToast = useToast();
  
  const feedbackBoxRef = useRef(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingFinished, setIsTypingFinished] = useState(true);

  // Smooth Typewriter Engine
  useEffect(() => {
    if (!rawAiFeedback) {
      setDisplayedText('');
      setIsTypingFinished(true);
      return;
    }

    setIsTypingFinished(false);

    const timer = setInterval(() => {
      setDisplayedText((prev) => {
        if (prev.length < rawAiFeedback.length) {
          const step = Math.min(3, rawAiFeedback.length - prev.length);
          return rawAiFeedback.slice(0, prev.length + step);
        } else {
          setIsTypingFinished(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 15);

    return () => clearInterval(timer);
  }, [rawAiFeedback]);

  // Smooth Auto-scroll
  useEffect(() => {
    if ((isAnalyzing || !isTypingFinished) && feedbackBoxRef.current) {
      feedbackBoxRef.current.scrollTo({
        top: feedbackBoxRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [displayedText, isAnalyzing, isTypingFinished]);

  const handleAnalyze = async () => {
    try {
      setDisplayedText('');
      await analyzeWithAi();
      showToast('Analisis AI selesai!', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal menganalisis PRD', 'error');
    }
  };

  const handleApplyDraft = () => {
    const ok = applyAiDraft();
    if (ok) {
      showToast('Draf saran AI berhasil diterapkan ke formulir!', 'success');
    } else {
      showToast('Tidak ada data draf yang bisa diterapkan', 'info');
    }
  };

  const isBusy = isAnalyzing || !isTypingFinished;

  return (
    <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 p-5 rounded-xl border border-purple-500/40 shadow-lg space-y-4">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faRobot} className="text-purple-400 text-base" />
          <div>
            <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              Analisis PRD Berbasis AI
              <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono">
                Gemini Flash
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Evaluasi kelengkapan, risiko teknis, & perbaikan spesifikasi</p>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isBusy}
          className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {isBusy ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
              <span>{isAnalyzing && !displayedText ? 'Memproses...' : 'Menulis...'}</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-amber-300 text-xs" />
              <span>Analisis PRD</span>
            </>
          )}
        </button>
      </div>

      {aiError && (
        <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-xs text-rose-300">
          ⚠️ {aiError}
        </div>
      )}

      {(displayedText || isAnalyzing) && (
        <div className="space-y-3 pt-1 border-t border-purple-900/40">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              Hasil Rekomendasi AI:
              {isBusy && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-normal text-purple-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  {displayedText ? 'Sedang mengetik masukan...' : 'AI sedang membaca dokumen PRD...'}
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {aiDraft && !isBusy && (
                <button
                  onClick={handleApplyDraft}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 py-1 rounded transition-all duration-200 flex items-center gap-1 cursor-pointer shadow-md hover:shadow-emerald-500/20"
                  title="Isi otomatis bagian form yang kosong dengan saran AI"
                >
                  <FontAwesomeIcon icon={faWandMagicSparkles} /> Terapkan ke Form
                </button>
              )}
              {!isBusy && (
                <button
                  onClick={clearAiFeedback}
                  className="text-[10px] text-slate-400 hover:text-rose-400 transition flex items-center gap-1 cursor-pointer"
                  title="Hapus hasil analisis"
                >
                  <FontAwesomeIcon icon={faTrash} /> Hapus
                </button>
              )}
            </div>
          </div>

          <div
            ref={feedbackBoxRef}
            className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 space-y-2 font-sans leading-relaxed max-h-96 overflow-y-auto relative min-h-[90px]"
          >
            {isAnalyzing && !displayedText ? (
              <div className="space-y-2.5 animate-pulse py-1">
                <div className="h-3.5 bg-purple-900/40 rounded w-1/3" />
                <div className="h-3 bg-slate-800/80 rounded w-full" />
                <div className="h-3 bg-slate-800/80 rounded w-5/6" />
                <div className="h-3 bg-slate-800/80 rounded w-4/6" />
                <div className="flex items-center gap-2 pt-1">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-purple-400 text-xs" />
                  <span className="text-[11px] text-purple-300/80 font-mono">Menyiapkan ulasan spesifikasi produk...</span>
                </div>
              </div>
            ) : (
              <>
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="font-extrabold text-base text-purple-200 border-b border-purple-800/60 pb-1 mt-4 mb-2 tracking-wide uppercase" {...props} />,
                    h2: ({node, ...props}) => <h2 className="font-bold text-sm text-purple-300 mt-4 mb-2 flex items-center gap-1.5" {...props} />,
                    h3: ({node, ...props}) => <h3 className="font-semibold text-xs text-indigo-300 mt-3 mb-1 pl-2 border-l-2 border-indigo-500/60" {...props} />,
                    h4: ({node, ...props}) => <h4 className="font-medium text-xs text-slate-300 mt-2 mb-1 italic" {...props} />,
                    p: ({node, ...props}) => <p className="text-xs text-slate-200 leading-relaxed my-1" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 my-1.5 text-slate-300" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1 my-1.5 text-slate-300" {...props} />,
                    li: ({node, ...props}) => <li className="text-slate-300 text-xs" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                    code: ({node, ...props}) => <code className="bg-slate-800 text-amber-300 px-1 py-0.5 rounded font-mono text-[11px]" {...props} />,
                    hr: ({node, ...props}) => <hr className="border-purple-900/50 my-3" {...props} />,
                  }}
                >
                  {displayedText}
                </ReactMarkdown>
                {isBusy && (
                  <span className="inline-block w-1.5 h-4 bg-purple-400 animate-pulse ml-1 align-middle" />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPanel() {
  useAutoSave();
  const ra = useAutoResize();

  useEffect(function () {
    const t = setTimeout(ra.resizeAll, 100);
    function onInput(e) {
      if (e.target.tagName === 'TEXTAREA') ra.resize(e.target);
    }
    document.addEventListener('input', onInput);
    return function () {
      clearTimeout(t);
      document.removeEventListener('input', onInput);
    };
  }, [ra]);

  return (
    <section id="editorPanel" className="p-4 md:p-6 overflow-y-auto no-print space-y-6 border-r border-slate-800 bg-slate-900" style={{ height: '100%' }}>
      <ModeBanner />
      <ExtrasPicker />
      <AiAnalysisCard />
      <ProjectInfo />
      <ProblemGoal />
      <PersonaSection />
      <BrandingSection />
      <RolesSection />
      <FeaturesList />
      <AcSection />
      <TechStack />
      <SchemaSection />
      <NfrSection />
      <OutOfScope />
    </section>
  );
}
````

## File: src/components/header/ModeSwitcher.jsx
````javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';
export default function ModeSwitcher() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const setMode = usePrdStore(function (s) { return s.setMode; });
  const sw = function (m) { if (mode === m) return; setMode(m); };
  const a = 'flex-1 md:flex-none h-10 md:h-auto flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 shadow-md ';
  const i = 'flex-1 md:flex-none h-10 md:h-auto flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-all duration-200';
  return (
    <div className="flex items-center bg-slate-900 border border-slate-700 p-1 rounded-xl shadow-inner space-x-1 order-3 md:order-2 w-full md:w-auto">
      <button onClick={function () { sw('simple'); }} className={mode === 'simple' ? a + 'bg-blue-600 text-white' : i}>
        <FontAwesomeIcon icon={faBolt} className="text-amber-300" /><span>Mode Simple</span>
      </button>
      <button onClick={function () { sw('enterprise'); }} className={mode === 'enterprise' ? a + 'bg-amber-600 text-white' : i}>
        <FontAwesomeIcon icon={faBuilding} className="text-blue-400" /><span>Mode Enterprise</span>
      </button>
    </div>
  );
}
````

## File: src/components/mobile/ScrollButtons.jsx
````javascript
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useViewStore } from '../../store/useViewStore';

const AMBANG_NAIK = 0.8;
const AMBANG_TURUN = 0.2;

export default function ScrollButtons() {
  const view = useViewStore(function (s) { return s.view; });
  const [atTop, setAtTop] = useState({ editor: true, preview: true });
  const autoScroll = useRef({ editor: false, preview: false });
  const timers = useRef({ editor: null, preview: null });
  const guards = useRef({ editor: null, preview: null });

  function getEl(panel) {
    return document.getElementById(panel === 'editor' ? 'editorPanel' : 'previewPanel');
  }

  function updateIcon(panel) {
    const el = getEl(panel);
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setAtTop(function (prev) {
      let top = prev[panel];
      if (max <= 4) {
        top = true;
      } else {
        const p = el.scrollTop / max;
        if (p >= AMBANG_NAIK) top = false;
        else if (p <= AMBANG_TURUN) top = true;
      }
      if (prev[panel] === top) return prev;
      const next = { editor: prev.editor, preview: prev.preview };
      next[panel] = top;
      return next;
    });
  }

  function stopAuto(panel) {
    if (timers.current[panel]) { clearInterval(timers.current[panel]); timers.current[panel] = null; }
    if (guards.current[panel]) { clearTimeout(guards.current[panel]); guards.current[panel] = null; }
    if (autoScroll.current[panel]) {
      autoScroll.current[panel] = false;
      updateIcon(panel);
    }
  }

  function watchEnd(panel, el, dest) {
    if (timers.current[panel]) clearInterval(timers.current[panel]);
    if (guards.current[panel]) clearTimeout(guards.current[panel]);
    let last = el.scrollTop;
    let same = 0;
    timers.current[panel] = setInterval(function () {
      const cur = el.scrollTop;
      const reached = Math.abs(cur - dest) <= 4;
      same = cur === last ? same + 1 : 0;
      last = cur;
      if (reached || same >= 3) stopAuto(panel);
    }, 80);
    guards.current[panel] = setTimeout(function () { stopAuto(panel); }, 3000);
  }

  function scroll(panel, down) {
    const el = getEl(panel);
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 4) return;
    const dest = down ? max : 0;
    autoScroll.current[panel] = true;
    el.scrollTo({ top: dest, behavior: 'smooth' });
    watchEnd(panel, el, dest);
  }

  useEffect(function () {
    function onScrollCapture(e) {
      const t = e.target;
      if (!t || t.nodeType !== 1) return;
      if (t.id === 'editorPanel' && !autoScroll.current.editor) updateIcon('editor');
      else if (t.id === 'previewPanel' && !autoScroll.current.preview) updateIcon('preview');
    }

    document.addEventListener('scroll', onScrollCapture, { capture: true, passive: true });

    function interrupt() {
      if (autoScroll.current.editor) stopAuto('editor');
      if (autoScroll.current.preview) stopAuto('preview');
    }

    document.addEventListener('touchstart', interrupt, { passive: true });
    document.addEventListener('wheel', interrupt, { passive: true });
    document.addEventListener('keydown', interrupt, { passive: true });

    updateIcon('editor');
    updateIcon('preview');

    return function () {
      document.removeEventListener('scroll', onScrollCapture, { capture: true });
      document.removeEventListener('touchstart', interrupt);
      document.removeEventListener('wheel', interrupt);
      document.removeEventListener('keydown', interrupt);
      stopAuto('editor');
      stopAuto('preview');
    };
  }, []);

  function btn(panel) {
    const top = atTop[panel];
    return (
      <button
        onClick={function () { scroll(panel, top); }}
        className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-800 text-slate-200 border border-slate-600 shadow-lg hover:bg-blue-600 hover:text-white transition"
        title={panel === 'editor' ? 'Scroll editor' : 'Scroll preview'}
      >
        <FontAwesomeIcon icon={top ? faArrowDown : faArrowUp} />
      </button>
    );
  }

  const editorCls = 'no-print fixed z-[45] bottom-20 lg:bottom-5 right-3 lg:right-[calc(50%+14px)] flex-col gap-2 ' + (view === 'editor' ? 'flex' : 'hidden lg:flex');
  const previewCls = 'no-print fixed z-[45] bottom-20 lg:bottom-5 right-3 lg:right-5 flex-col gap-2 ' + (view === 'preview' ? 'flex' : 'hidden lg:flex');

  return (
    <div>
      <div className={editorCls}>{btn('editor')}</div>
      <div className={previewCls}>{btn('preview')}</div>
    </div>
  );
}
````

## File: src/components/shared/IconButton.jsx
````javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function IconButton(props) {
  const icon = props.icon;
  const onClick = props.onClick;
  const variant = props.variant || 'default';
  const disabled = props.disabled;
  const className = props.className || '';
  const children = props.children;
  const title = props.title;
  const ariaLabel = props['aria-label'] || props.ariaLabel || title;
  const v = {
    default: 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600',
    danger: 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800',
    primary: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500',
    accent: 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={'flex items-center justify-center gap-1.5 px-3 py-2 md:py-1.5 text-xs font-semibold rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed ' + (v[variant] || v.default) + ' ' + className}
    >
      {icon && <FontAwesomeIcon icon={icon} aria-hidden="true" />}
      {children}
    </button>
  );
}
````

## File: src/services/exportService.js
````javascript
import { saveAs } from 'file-saver';
import copyToClipboard from 'copy-to-clipboard';
import { generateMarkdown } from '../utils/markdown';

export const exportService = {
  exportJSON: function (state) {
    const data = { app: 'PRD Architect Pro', version: '3.3', mode: state.mode, state: state };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, (state.fields.projectName || 'PRD') + '.json');
  },
  copyMarkdown: function (state) {
    copyToClipboard(generateMarkdown(state));
  },
  printDocument: function () { window.print(); },
};
````

## File: index.html
````html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="PRD Architect Pro - Perancang dokumen Product Requirement Document profesional dengan mode Simple MVP dan Enterprise." />
    <meta name="keywords" content="PRD, Product Requirement Document, product manager, spesifikasi produk, dokumen teknis" />
    <meta name="author" content="PRD Architect Pro" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="robots" content="index, follow" />

    <!-- Open Graph -->
    <meta property="og:title" content="PRD Architect Pro" />
    <meta property="og:description" content="Perancang Dokumen PRD Profesional - Simple MVP & Enterprise Mode" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="id_ID" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="PRD Architect Pro" />
    <meta name="twitter:description" content="Perancang Dokumen PRD Profesional" />

    <title>PRD Architect Pro - Perancang Dokumen PRD Profesional</title>

    <link rel="icon" type="image/svg+xml" href="/logo-riskychici.svg" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" /></noscript>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PRD Architect Pro",
      "description": "Perancang dokumen Product Requirement Document profesional dengan mode Simple MVP dan Enterprise.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "inLanguage": "id-ID",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "IDR"
      }
    }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
````

## File: package.json
````json
{
  "name": "prd-architect-pro",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@fortawesome/free-brands-svg-icons": "^7.3.1",
    "@fortawesome/free-regular-svg-icons": "^7.3.1",
    "@fortawesome/free-solid-svg-icons": "^7.3.1",
    "@fortawesome/react-fontawesome": "^3.5.0",
    "copy-to-clipboard": "^4.0.2",
    "file-saver": "^2.0.5",
    "lodash": "^4.18.1",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-markdown": "^10.1.0",
    "zustand": "^5.0.15"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "autoprefixer": "^10.5.4",
    "tailwindcss": "^4.3.3",
    "vite": "^8.2.2"
  }
}
````

## File: .gitignore
````
node_modules
dist
dist-ssr
*.local
.DS_Store
.vscode
.env
prd-architec-v3.1.md
.repomixignore
.vercel
````

## File: src/components/header/Header.jsx
````javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faRotateLeft, faRotateRight, faWandMagicSparkles, faTrash } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';
import ModeSwitcher from './ModeSwitcher';
import IconButton from '../shared/IconButton';
import { useToast } from '../../hooks/useToast';
import { storageService } from '../../services/storageService';
export default function Header() {
  const saveIndicator = usePrdStore(function (s) { return s.saveIndicator; });
  const undo = usePrdStore(function (s) { return s.undo; });
  const redo = usePrdStore(function (s) { return s.redo; });
  const hi = usePrdStore(function (s) { return s.historyIndex; });
  const hl = usePrdStore(function (s) { return s.history.length; });
  const loadSampleData = usePrdStore(function (s) { return s.loadSampleData; });
  const clearAll = usePrdStore(function (s) { return s.clearAll; });
  const commitHistory = usePrdStore(function (s) { return s.commitHistory; });
  const showToast = useToast();
  return (
    <header className="bg-slate-800 border-b border-slate-700 py-3 md:py-3.5 px-4 md:px-6 no-print sticky top-0 z-50 flex flex-wrap justify-between items-center gap-2 md:gap-4">
      <div className="flex items-center space-x-2.5 md:space-x-3 order-1 flex-1 md:flex-none min-w-0">
        <div className="bg-blue-600 text-white p-2 rounded-lg shrink-0"><FontAwesomeIcon icon={faFileContract} className="text-lg md:text-xl" /></div>
        <div className="min-w-0">
          <h1 className="font-bold text-base md:text-lg text-white leading-snug truncate py-0.5">PRD Architect <span className="align-middle whitespace-nowrap text-[10px] md:text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 md:px-2 py-0.5 rounded-full ml-1">Pro V3.3</span></h1>
          <p className="text-[11px] md:text-xs text-slate-400 mt-0.5 md:mt-1 truncate">Perancang Dokumen PRD Profesional</p>
        </div>
      </div>
      <ModeSwitcher />
      <div className="contents md:flex md:items-center md:space-x-3 md:order-3">
        <span className="text-[10px] text-slate-500 hidden lg:inline">{saveIndicator}</span>
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700 rounded-lg p-0.5 shadow-inner order-2">
          <IconButton icon={faRotateLeft} onClick={undo} disabled={hi <= 0} title="Undo (Ctrl+Z)" className="w-10 h-10 md:w-auto md:h-auto"><span className="hidden md:inline">Undo</span></IconButton>
          <IconButton icon={faRotateRight} onClick={redo} disabled={hi >= hl - 1} title="Redo (Ctrl+Y)" className="w-10 h-10 md:w-auto md:h-auto"><span className="hidden md:inline">Redo</span></IconButton>
        </div>
        <IconButton icon={faWandMagicSparkles} onClick={function () { loadSampleData(); commitHistory(); showToast('Data contoh Instagram dimuat'); }} className="order-4 flex-1 md:flex-none h-10 md:h-auto">Muat Contoh</IconButton>
        <IconButton icon={faTrash} onClick={function () { clearAll(); commitHistory(); storageService.clear(); showToast('Form direset', 'info'); }} variant="danger" className="order-4 flex-1 md:flex-none h-10 md:h-auto">Reset</IconButton>
      </div>
    </header>
  );
}
````

## File: src/store/usePrdStore.js
````javascript
import { create } from 'zustand';
import { cloneDeep } from 'lodash';
import { DEFAULT_FIELDS, INITIAL_SIMPLE_EXTRAS, MAX_HISTORY } from '../utils/constants';

const init = function () {
  return {
    mode: 'simple', simpleExtras: { ...INITIAL_SIMPLE_EXTRAS }, fields: { ...DEFAULT_FIELDS },
    features: [], palette: [], roles: [], schemaTables: [], acModules: [], techOptional: [],
    history: [], historyIndex: -1, saveIndicator: '',
    // State untuk AI Analysis & Auto-fill Draft
    aiFeedback: '', aiDraft: null, isAnalyzing: false, aiError: null,
  };
};

const stripNonUndo = function (snap) {
  const c = Object.assign({}, snap);
  delete c.mode;
  delete c.simpleExtras;
  return c;
};

// Helper untuk membersihkan simbol bullet/strip/nomor/tabel Markdown dari awal & isi baris
const sanitizeMultiline = function (text) {
  if (!text || typeof text !== 'string') return text;
  return text
    .split('\n')
    .map(function (line) {
      if (/^\|?[\s\-\|:]+\|?$/.test(line.trim())) return '';
      let cleaned = line.replace(/^[\s\|\-\*\•\d+\.\)]+/, '').trim();
      cleaned = cleaned.replace(/\|/g, '').trim();
      return cleaned;
    })
    .filter(function (line) {
      return line.length > 0;
    })
    .join('\n');
};

// Helper khusus penanganan & pembersihan simbol/format LaTeX
const cleanLatex = function (str) {
  if (!str || typeof str !== 'string') return str;

  return str
    .replace(/\\ge\b|\\geq\b/g, '≥')
    .replace(/\\le\b|\\leq\b/g, '≤')
    .replace(/\\approx\b/g, '≈')
    .replace(/\\neq\b/g, '≠')
    .replace(/\\times\b/g, '×')
    .replace(/\\div\b/g, '÷')
    .replace(/\\pm\b/g, '±')
    .replace(/\\infty\b/g, '∞')
    .replace(/\$\\text\{([^}]+)\}\$/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')     .replace(/\$\$([^$]+)\$\$/g, '$1')     .replace(/\$([^$]+)\$/g, '$1')
    .replace(/\\([_#%&])/g, '$1')
    .trim();
};

export const usePrdStore = create(function (set, get) {
  return {
    ...init(),
    setMode: function (mode) { set({ mode: mode }); },
    setField: function (key, value) { set(function (s) { return { fields: Object.assign({}, s.fields, { [key]: value }) }; }); },
    setSaveIndicator: function (t) { set({ saveIndicator: t }); },
    toggleSimpleExtra: function (key, value) { set(function (s) { return { simpleExtras: Object.assign({}, s.simpleExtras, { [key]: value }) }; }); },
    resetAllExtras: function () { set({ simpleExtras: { ...INITIAL_SIMPLE_EXTRAS } }); },
    addTechExtra: function (key) {
      set(function (s) {
        if (s.techOptional.includes(key)) return {};
        return { techOptional: s.techOptional.concat([key]) };
      });
    },
    removeTechExtra: function (key) {
      set(function (s) {
        return { techOptional: s.techOptional.filter(function (k) { return k !== key; }) };
      });
    },
    addFeature: function () { set(function (s) { return { features: s.features.concat([{ id: 'F-0' + (s.features.length + 1), name: '', story: '', priority: 'High' }]) }; }); },
    updateFeature: function (i, p) { set(function (s) { const f = s.features.slice(); f[i] = Object.assign({}, f[i], p); return { features: f }; }); },
    removeFeature: function (i) { set(function (s) { return { features: s.features.filter(function (_, x) { return x !== i; }).map(function (f, x) { return Object.assign({}, f, { id: 'F-0' + (x + 1) }); }) }; }); },
    addPalette: function () { set(function (s) { return { palette: s.palette.concat([{ name: '', hex: '#C9A961', usage: '' }]) }; }); },
    updatePalette: function (i, p) { set(function (s) { const a = s.palette.slice(); a[i] = Object.assign({}, a[i], p); return { palette: a }; }); },
    removePalette: function (i) { set(function (s) { return { palette: s.palette.filter(function (_, x) { return x !== i; }) }; }); },
    addRole: function () { set(function (s) { return { roles: s.roles.concat([{ name: '', can: '', cannot: '' }]) }; }); },
    updateRole: function (i, p) { set(function (s) { const a = s.roles.slice(); a[i] = Object.assign({}, a[i], p); return { roles: a }; }); },
    removeRole: function (i) { set(function (s) { return { roles: s.roles.filter(function (_, x) { return x !== i; }) }; }); },
    addSchemaTable: function () { set(function (s) { return { schemaTables: s.schemaTables.concat([{ name: '', desc: '', fields: [{ field: '', type: '', required: 'Ya', note: '' }] }]) }; }); },
    updateSchemaTable: function (i, p) { set(function (s) { const a = s.schemaTables.slice(); a[i] = Object.assign({}, a[i], p); return { schemaTables: a }; }); },
    removeSchemaTable: function (i) { set(function (s) { return { schemaTables: s.schemaTables.filter(function (_, x) { return x !== i; }) }; }); },
    addSchemaField: function (ti) { set(function (s) { const a = s.schemaTables.slice(); a[ti] = Object.assign({}, a[ti], { fields: a[ti].fields.concat([{ field: '', type: '', required: 'Ya', note: '' }]) }); return { schemaTables: a }; }); },
    updateSchemaField: function (ti, fi, p) { set(function (s) { const a = s.schemaTables.slice(); const f = a[ti].fields.slice(); f[fi] = Object.assign({}, f[fi], p); a[ti] = Object.assign({}, a[ti], { fields: f }); return { schemaTables: a }; }); },
    removeSchemaField: function (ti, fi) { set(function (s) { const a = s.schemaTables.slice(); a[ti] = Object.assign({}, a[ti], { fields: a[ti].fields.filter(function (_, x) { return x !== fi; }) }); return { schemaTables: a }; }); },
    addAcModule: function () { set(function (s) { return { acModules: s.acModules.concat([{ title: '', items: [{ title: '', desc: '' }] }]) }; }); },
    updateAcModule: function (i, p) { set(function (s) { const a = s.acModules.slice(); a[i] = Object.assign({}, a[i], p); return { acModules: a }; }); },
    removeAcModule: function (i) { set(function (s) { return { acModules: s.acModules.filter(function (_, x) { return x !== i; }) }; }); },
    addAcItem: function (mi) { set(function (s) { const a = s.acModules.slice(); a[mi] = Object.assign({}, a[mi], { items: a[mi].items.concat([{ title: '', desc: '' }]) }); return { acModules: a }; }); },
    updateAcItem: function (mi, ii, p) { set(function (s) { const a = s.acModules.slice(); const it = a[mi].items.slice(); it[ii] = Object.assign({}, it[ii], p); a[mi] = Object.assign({}, a[mi], { items: it }); return { acModules: a }; }); },
    removeAcItem: function (mi, ii) { set(function (s) { const a = s.acModules.slice(); a[mi] = Object.assign({}, a[mi], { items: a[mi].items.filter(function (_, x) { return x !== ii; }) }); return { acModules: a }; }); },
    getSnapshot: (function () {
      let cache = null;
      let last = null;
      return function () {
        const st = get();
        if (last &&
          last.fields === st.fields && last.features === st.features && last.palette === st.palette &&
          last.roles === st.roles && last.schemaTables === st.schemaTables && last.acModules === st.acModules &&
          last.simpleExtras === st.simpleExtras && last.techOptional === st.techOptional && last.mode === st.mode) {
          return cache;
        }
        last = { fields: st.fields, features: st.features, palette: st.palette, roles: st.roles, schemaTables: st.schemaTables, acModules: st.acModules, simpleExtras: st.simpleExtras, techOptional: st.techOptional, mode: st.mode };
        cache = {
          fields: cloneDeep(st.fields), features: cloneDeep(st.features), palette: cloneDeep(st.palette),
          roles: cloneDeep(st.roles), schemaTables: cloneDeep(st.schemaTables), acModules: cloneDeep(st.acModules),
          simpleExtras: cloneDeep(st.simpleExtras), techOptional: cloneDeep(st.techOptional), mode: st.mode,
        };
        return cache;
      };
    })(),
    commitHistory: function () {
      set(function (s) {
        const snap = get().getSnapshot();
        const last = s.history[s.historyIndex];
        if (last && JSON.stringify(stripNonUndo(last)) === JSON.stringify(stripNonUndo(snap))) return {};
        const h = s.history.slice(0, s.historyIndex + 1);
        h.push(snap);
        if (h.length > MAX_HISTORY) h.shift();
        return { history: h, historyIndex: h.length - 1 };
      });
    },
    undo: function () {
      set(function (s) {
        if (s.historyIndex <= 0) return {};
        const ni = s.historyIndex - 1;
        const st = stripNonUndo(s.history[ni]);
        return Object.assign({}, st, { historyIndex: ni, history: s.history });
      });
    },
    redo: function () {
      set(function (s) {
        if (s.historyIndex >= s.history.length - 1) return {};
        const ni = s.historyIndex + 1;
        const st = stripNonUndo(s.history[ni]);
        return Object.assign({}, st, { historyIndex: ni, history: s.history });
      });
    },
    restoreState: function (st) {
      const fields = Object.assign({}, DEFAULT_FIELDS, st.fields || {});
      const features = st.features || [];

      const isEmptyPrd =
        !(fields.projectName || '').trim() &&
        !(fields.problemStatement || '').trim() &&
        !(fields.productGoal || '').trim() &&
        features.length === 0;

      set({
        fields: fields,
        features: features,
        palette: st.palette || [],
        roles: st.roles || [],
        schemaTables: st.schemaTables || [],
        acModules: st.acModules || [],
        simpleExtras: st.simpleExtras || { ...INITIAL_SIMPLE_EXTRAS },
        techOptional: st.techOptional || [],
        aiFeedback: isEmptyPrd ? '' : (st.aiFeedback || ''),
        aiDraft: isEmptyPrd ? null : (st.aiDraft || null),
        mode: st.mode || 'simple',
      });
    },
    clearAll: function () {
      set(function (s) {
        const base = init();
        return Object.assign({}, base, { mode: s.mode, history: s.history, historyIndex: s.historyIndex, saveIndicator: s.saveIndicator });
      });
    },

    // Action STREAMING dengan Analisis Mendalam & Rekomendasi Solutif
    analyzeWithAi: async function () {
      const state = get();
      const prdSnapshot = state.getSnapshot();

      set({ isAnalyzing: true, aiError: null, aiFeedback: '', aiDraft: null });

      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
          throw new Error('VITE_GEMINI_API_KEY belum diisi pada file .env.local!');
        }

        const prompt = `Kamu adalah seorang Principal System Analyst dan VP of Product berpengalaman.
Tugasmu adalah melakukan audit, analisis, SERTA MEMBERIKAN REKOMENDASI TERBAIK DAN SARAN STRATEGIS terhadap dokumen PRD (Product Requirement Document) berikut secara EKSTENSIF, DETAIL, KOMPREHENSIF, dan PROFESIONAL.

PEDOMAN FORMATTING & GAYA BAHASA (WAJIB DIPATUHI):
1. Tuliskan jawaban dalam bahasa Indonesia formal, taktis, mendalam, dan kaya akan terminologi industri perangkat lunak.
2. DILARANG KERAS menggunakan format matematika LaTeX (seperti $...$, \\text{...}, \\ge, \\le). Gunakan simbol baku Unicode seperti ≥, ≤, ≈, atau teks biasa.
3. Struktur teks HARUS menggunakan hirarki Markdown berikut:
   - Seksi Utama: GUNAKAN LEVEL HEADING 2 (## 1. Analisis System Analyst, ## 2. Analisis Product Manager, ## 3. Saran Terbaik & Rekomendasi AI)
   - Sub-Seksi: GUNAKAN LEVEL HEADING 3 (### A. ..., ### B. ..., dst)
4. Setiap poin analisis WAJIB diawali dengan bullet point (*) dan teks tebal (**Bold Title**), diikuti oleh penjelasan komprehensif 2-3 kalimat per poin.

TEMPLATE ANALISIS & REKOMENDASI LENGKAP:

## 1. Analisis System Analyst

### A. Evaluasi Kelengkapan Data & Arsitektur Sistem
* **Status Kelengkapan Spesifikasi**: Audit mendalam mengenai kelengkapan komponen PRD (apakah empty state, partial, atau full) serta kesiapan tim pengembang.
* **Evaluasi Frontend & User Interface**: Ulas opsi stack frontend (misal React/Next.js), arsitektur state management, serta pertimbangan SSR vs CSR.
* **Evaluasi Backend & Microservices**: Ulas pilihan arsitektur backend, skalabilitas penanganan konkurensi (Node.js/Go/Python), serta desain REST API / GraphQL.

### B. Analisis Basis Data, Caching & Infrastruktur Cloud
* **Integritas Skema Basis Data**: Ulas struktur tabel (schemaTables), kebutuhan indexing, primary/foreign key constraints, dan potensi query bottleneck.
* **Strategi Caching & Message Queue**: Ulas kebutuhan Redis untuk caching serta Kafka/RabbitMQ untuk pemrosesan asynchronous.
* **Infrastruktur & Pipeline DevOps**: Rekomendasikan kontainerisasi (Docker/Kubernetes), CI/CD (GitHub Actions), serta manajemen cloud (AWS/GCP).

### C. Spesifikasi Non-Fungsional (NFR) & Keamanan
* **Keamanan & Manajemen Akses**: Audit sistem otentikasi (JWT, OAuth 2.0, 2FA), enkripsi data (at-rest & in-transit), dan mitigasi serangan cyber.
* **Performa, Latensi & SLA**: Tentukan standar FCP, response time API, target uptime SLA (99.9%), dan kapasitas concurrent users.

## 2. Analisis Product Manager

### A. Value Proposition & Strategi Bisnis
* **Kejelasan Problem Statement & Goals**: Evaluasi seberapa kuat pernyataan masalah dan tujuan produk dalam menjawab kebutuhan pasar dan ROI.
* **Segmentasi User Persona**: Ulas ketajaman profil pengguna target, pain points mereka, dan kesesuaian alur penggunaan (userFlow).

### B. Manajemen Ruang Lingkup (Scope Creep) & DoD
* **Batasan Fitur (Out of Scope)**: Identifikasi risiko pembengkakan fitur (scope creep) dan evaluasi kejelasan batasan hal yang tidak dikerjakan.
* **Kriteria Keberhasilan (Definition of Done)**: Ulas standar kualitas rilis (QA testing coverage, bug threshold, performance metrics) sebelum siap produksi.

### C. Roadmap Pengembangan MVP & Success Metrics
* **Prioritisasi Fitur MVP**: Rekomendasikan urutan eksekusi fitur inti (High Priority) untuk membentuk MVP yang fungsional.
* **Metrik Keberhasilan Terukur**: Tentukan indikator kinerja utama / KPI (seperti DAU/MAU, Retention Rate, CSAT) yang dipantau pasca rilis.

## 3. Saran Terbaik & Rekomendasi AI

### A. Rekomendasi Arsitektur & Technology Stack Terbaik
* **Rekomendasi Stack Ideal**: Berikan kombinasi teknologi (Frontend, Backend, DB, Cloud) paling ideal dan rasional untuk jenis proyek ini beserta alasan teknisnya.
* **Standar Keamanan Utama**: Berikan rekomendasi langkah keamanan prioritas tinggi yang wajib langsung diimplementasikan pada sprint pertama.

### B. Rekomendasi Eksekusi Produk & Langkah Selanjutnya
* **Langkah Krusial Berikutnya (Next Action Items)**: Berikan daftar 3-5 langkah konkret yang harus dilakukan tim (PM/Dev) saat ini juga untuk mematangkan PRD ini.
* **Strategi Mitigasi Risiko Bisnis**: Berikan masukan langsung mengenai potensi kendala operasional/pengguna beserta solusi pencegahannya.

\`\`\`json_draft
{
  "fields": {
    "projectName": "saran nama proyek draf jika kosong",
    "problemStatement": "saran revisi/lengkapi masalah",
    "productGoal": "saran revisi/lengkapi tujuan",
    "userPersona": "saran revisi/lengkapi persona",
    "userFlow": "saran revisi/lengkapi user flow",
    "techFrontend": "saran stack frontend",
    "techBackend": "saran stack backend",
    "techDatabase": "saran stack database",
    "techInfra": "saran infrastruktur cloud",
    "outOfScope": "Item pertama\\nItem kedua\\nItem ketiga",
    "defOfDone": "Kriteria pertama\\nKriteria kedua\\nKriteria ketiga",
    "successMetrics": "saran metrik sukses terukur",
    "nfrSpecs": "saran NFR keamanan dan spesifikasi",
    "nfrPerformance": "saran NFR performa dan latency",
    "riskMitigation": "saran mitigasi risiko utama"
  },
  "features": [
    { "id": "F-01", "name": "Nama Fitur Inti", "story": "User story fitur", "priority": "High" }
  ],
  "roles": [
    { "name": "Nama Peran", "can": "Hak akses diizinkan", "cannot": "Batasan akses" }
  ],
  "acModules": [
    {
      "title": "Nama Modul AC",
      "items": [
        { "title": "Skenario AC", "desc": "Deskripsi BDD Given-When-Then" }
      ]
    }
  ],
  "schemaTables": [
    {
      "name": "nama_tabel",
      "desc": "Deskripsi fungsi tabel",
      "fields": [
        { "field": "nama_kolom", "type": "TIPE_DATA", "required": "Ya/Opsional", "note": "catatan/PK/FK" }
      ]
    }
  ]
}
\`\`\`

Data PRD saat ini:
${JSON.stringify(prdSnapshot, null, 2)}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:streamGenerateContent?key=${apiKey}&alt=sse`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 8192,
              }
            })
          }
        );

        if (!response.ok) {
          const errJson = await response.json();
          const errMsg = errJson.error?.message || '';

          if (response.status === 429 || errJson.error?.code === 429) {
            if (errMsg.includes('Quota exceeded') || errMsg.includes('free_tier')) {
              throw new Error('Kuota harian (Free Tier) Gemini API telah habis. Silakan gunakan API Key baru atau tunggu reset kuota harian.');
            }
            throw new Error('Batas penggunaan AI sedang penuh. Silakan tunggu 30 detik lalu coba lagi.');
          }

          throw new Error(errMsg || 'Gagal memproses request ke Gemini API');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullTextAccumulator = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.replace('data: ', '').trim();
              if (jsonStr === '[DONE]') continue;

              try {
                const parsed = JSON.parse(jsonStr);
                const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
                fullTextAccumulator += textChunk;

                const cleanDisplay = cleanLatex(
                  fullTextAccumulator.replace(/```json_draft[\s\S]*?$/, '')
                );

                set({ aiFeedback: cleanDisplay });
              } catch (e) {
                // Ignore incomplete JSON chunks
              }
            }
          }
        }

        let extractedDraft = null;
        const match = fullTextAccumulator.match(/```json_draft\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          try {
            extractedDraft = JSON.parse(match[1]);
          } catch (e) {
            console.warn('Gagal parse JSON draft dari AI:', e);
          }
        }

        const finalCleanFeedback = cleanLatex(
          fullTextAccumulator.replace(/```json_draft[\s\S]*?```/, '')
        );

        set({
          aiFeedback: finalCleanFeedback,
          aiDraft: extractedDraft,
          isAnalyzing: false
        });

        return finalCleanFeedback;
      } catch (err) {
        set({ aiError: err.message, isAnalyzing: false });
        throw err;
      }
    },

    applyAiDraft: function () {
      const state = get();
      const draft = state.aiDraft;
      if (!draft) return false;

      set(function (s) {
        const updateState = {};

        if (draft.fields && typeof draft.fields === 'object') {
          updateState.fields = { ...s.fields };
          Object.keys(draft.fields).forEach((key) => {
            if (draft.fields[key]) {
              let val = draft.fields[key];

              if (typeof val === 'string') {
                val = sanitizeMultiline(cleanLatex(val));
              }

              updateState.fields[key] = val;
            }
          });
        }

        if (Array.isArray(draft.features) && draft.features.length > 0) {
          updateState.features = draft.features.map(function(f, idx) {
            return {
              id: f.id || 'F-0' + (idx + 1),
              name: sanitizeMultiline(cleanLatex(f.name || '')),
              story: sanitizeMultiline(cleanLatex(f.story || '')),
              priority: f.priority || 'High'
            };
          });
        }

        if (Array.isArray(draft.roles) && draft.roles.length > 0) {
          updateState.roles = draft.roles.map(function(r) {
            return {
              name: sanitizeMultiline(cleanLatex(r.name || '')),
              can: sanitizeMultiline(cleanLatex(r.can || '')),
              cannot: sanitizeMultiline(cleanLatex(r.cannot || ''))
            };
          });
        }

        if (Array.isArray(draft.acModules) && draft.acModules.length > 0) {
          updateState.acModules = draft.acModules.map(function(m) {
            return {
              title: sanitizeMultiline(cleanLatex(m.title || '')),
              items: Array.isArray(m.items) ? m.items.map(function(it) {
                return {
                  title: sanitizeMultiline(cleanLatex(it.title || '')),
                  desc: sanitizeMultiline(cleanLatex(it.desc || ''))
                };
              }) : []
            };
          });
        }

        if (Array.isArray(draft.schemaTables) && draft.schemaTables.length > 0) {
          updateState.schemaTables = draft.schemaTables.map(function(t) {
            return {
              name: sanitizeMultiline(cleanLatex(t.name || '')),
              desc: sanitizeMultiline(cleanLatex(t.desc || '')),
              fields: Array.isArray(t.fields) ? t.fields.map(function(fi) {
                return {
                  field: sanitizeMultiline(cleanLatex(fi.field || '')),
                  type: sanitizeMultiline(cleanLatex(fi.type || '')),
                  required: fi.required || 'Ya',
                  note: sanitizeMultiline(cleanLatex(fi.note || ''))
                };
              }) : []
            };
          });
        }

        return { ...updateState, aiDraft: null };
      });

      get().commitHistory();
      return true;
    },

    clearAiFeedback: function () {
      set({ aiFeedback: '', aiDraft: null, aiError: null });
    },

    loadSampleData: function () {
      set(function () {
        return {
          fields: {
            projectName: 'Instagram', docVersion: 'v2.0 Final Draft', author: 'Tim Product Instagram',
            targetDate: '2026-12-15', targetDateFormat: 'full',
            problemStatement: 'Pengguna membutuhkan platform untuk berbagi momen berupa foto dan video secara cepat, serta berinteraksi dengan komunitas melalui like, komentar, dan pesan langsung.',
            productGoal: 'Membangun platform media sosial berbagi foto dan video dengan feed personal, stories 24 jam, dan sistem interaksi real-time.',
            userFlow: 'Onboarding -> Login -> Home Feed -> Upload Post -> Edit & Filter -> Publish -> Like/Komentar -> Profile',
            techFrontend: 'React Native, React, Redux Toolkit',
            techBackend: 'Node.js, GraphQL, Django REST',
            techDatabase: 'PostgreSQL, Redis, Cassandra',
            techInfra: 'AWS (EC2, S3, CloudFront), Docker, Kubernetes',
            techDomain: 'Route 53, Cloudflare DNS',
            techVcs: 'GitHub',
            techSecurity: 'OAuth 2.0, JWT + refresh token, bcrypt, 2FA',
            techStorage: 'AWS S3 + CloudFront CDN',
            techThirdParty: 'Firebase Cloud Messaging, FFmpeg, Google Maps',
            techDevOps: 'GitHub Actions CI/CD, Sentry',
            techCaching: 'Redis, Memcached',
            techQueue: 'Kafka, RabbitMQ',
            techMonitoring: 'Sentry, Grafana, Prometheus',
            techAnalytics: 'Amplitude, Google Analytics',
            techTesting: 'Jest, Detox, Playwright',
            dbSchema: 'users: id, username, email, password_hash, bio, profile_pic_url\nposts: id, user_id, media_url, caption, likes_count\ncomments: id, post_id, user_id, text\nfollows: follower_id, followee_id\nstories: id, user_id, media_url, expires_at',
            outOfScope: 'Live streaming\nVideo call\nMarketplace / jual beli',
            defOfDone: 'Semua AC terpenuhi\nTidak ada bug critical\nFeed load < 2 detik\nUpload media sukses 99%',
            userPersona: 'Gen Z & milenial 15-34 tahun, content creator, brand & bisnis',
            successMetrics: 'DAU/MAU >= 0.6, Retention D30 >= 40%, avg session >= 15 menit',
            brandTypography: 'System font (SF Pro / Roboto), Billabong untuk logo',
            brandLayout: 'Mobile-first, grid gallery 3 kolom, infinite scroll',
            bpMobileOp: '≤', bpMobile: '640', bpMobileUnit: 'px',
            bpTabletOp: '≤', bpTablet: '1024', bpTabletUnit: 'px',
            bpDesktopOp: '≥', bpDesktop: '1024', bpDesktopUnit: 'px',
            nfrSpecs: 'HTTPS/TLS 1.3, OAuth 2.0, rate limiting, enkripsi at-rest',
            nfrPerformance: 'FCP < 1.2s, feed load < 2s, kompresi media otomatis',
            nfrLocalization: 'Multi-bahasa (30+), format waktu & tanggal lokal',
            nfrBrowser: 'iOS 15+, Android 9+, Chrome/Safari/Edge',
            figmaLink: '[https://figma.com/file/instagram-clone](https://figma.com/file/instagram-clone)',
            riskMitigation: 'Risiko konten ilegal & cyberbullying. Mitigasi: AI moderation, report & block, rate limiting.',
          },
          techOptional: ['techSecurity', 'techStorage', 'techThirdParty', 'techDevOps', 'techCaching', 'techQueue', 'techMonitoring', 'techAnalytics', 'techTesting'],
          simpleExtras: { persona: true, branding: true, roles: true, ac: true, schema: true, nfr: true },
          palette: [
            { name: 'Primary Blue', hex: '#0095F6', usage: 'Tombol primer & link' },
            { name: 'Gradient Purple', hex: '#833AB4', usage: 'Gradient logo & stories ring' },
            { name: 'Gradient Pink', hex: '#E1306C', usage: 'Gradient logo & stories ring' },
            { name: 'Gradient Orange', hex: '#F77737', usage: 'Gradient logo & accent' },
            { name: 'Neutral White', hex: '#FFFFFF', usage: 'Background utama' },
            { name: 'Text Black', hex: '#262626', usage: 'Teks utama' },
          ],
          roles: [
            { name: 'User Reguler', can: 'Buat post & story\nLike, komentar, share, save\nFollow/unfollow\nDirect message', cannot: 'Hapus konten orang lain\nAkses insight analitik' },
            { name: 'Content Creator (Pro)', can: 'Semua hak user reguler\nAkses insight & analitik\nMonetisasi & link di story', cannot: 'Hapus konten orang lain' },
            { name: 'Admin / Moderator', can: 'Hapus konten melanggar\nSuspend/ban akun\nKelola laporan pengguna', cannot: 'Edit post milik pengguna' },
          ],
          schemaTables: [
            { name: 'users', desc: 'Akun pengguna', fields: [
              { field: 'id', type: 'BIGINT', required: 'Ya', note: 'PK' },
              { field: 'username', type: 'VARCHAR', required: 'Ya', note: 'unik, max 30' },
              { field: 'email', type: 'VARCHAR', required: 'Ya', note: 'unik' },
              { field: 'password_hash', type: 'VARCHAR', required: 'Ya', note: 'bcrypt' },
              { field: 'bio', type: 'TEXT', required: 'Opsional', note: 'max 150 karakter' },
              { field: 'profile_pic_url', type: 'VARCHAR', required: 'Opsional', note: 'URL S3' },
            ] },
            { name: 'posts', desc: 'Post foto/video di feed', fields: [
              { field: 'id', type: 'BIGINT', required: 'Ya', note: 'PK' },
              { field: 'user_id', type: 'BIGINT', required: 'Ya', note: 'FK ke users' },
              { field: 'media_url', type: 'VARCHAR', required: 'Ya', note: 'URL S3/CDN' },
              { field: 'caption', type: 'TEXT', required: 'Opsional', note: 'dengan hashtag' },
              { field: 'likes_count', type: 'INT / INTEGER', required: 'Ya', note: 'default 0' },
              { field: 'created_at', type: 'TIMESTAMP', required: 'Ya', note: 'untuk urutan feed' },
            ] },
            { name: 'comments', desc: 'Komentar pada post', fields: [
              { field: 'id', type: 'BIGINT', required: 'Ya', note: 'PK' },
              { field: 'post_id', type: 'BIGINT', required: 'Ya', note: 'FK ke posts' },
              { field: 'user_id', type: 'BIGINT', required: 'Ya', note: 'FK ke users' },
              { field: 'text', type: 'TEXT', required: 'Ya', note: 'max 2200 karakter' },
            ] },
            { name: 'follows', desc: 'Relasi follow antar user', fields: [
              { field: 'follower_id', type: 'BIGINT', required: 'Ya', note: 'FK ke users' },
              { field: 'followee_id', type: 'BIGINT', required: 'Ya', note: 'FK ke users' },
              { field: 'created_at', type: 'TIMESTAMP', required: 'Ya', note: 'PK komposit' },
            ] },
          ],
          acModules: [
            { title: 'Autentikasi & Onboarding', items: [
              { title: 'Registrasi', desc: 'Daftar dengan email/username unik, password minimal 8 karakter, verifikasi email' },
              { title: 'Login Aman', desc: 'Login dengan JWT + refresh token, dukungan 2FA dan logout semua perangkat' },
            ] },
            { title: 'Feed & Post', items: [
              { title: 'Home Feed', desc: 'Infinite scroll post dari akun yang diikuti dengan pull-to-refresh' },
              { title: 'Upload Post', desc: 'Upload foto/video, crop, filter, caption + hashtag, lalu publish' },
              { title: 'Like & Komentar', desc: 'Double-tap untuk like dengan animasi hati, komentar real-time dengan mention' },
            ] },
            { title: 'Stories', items: [
              { title: 'Buat Story', desc: 'Story foto/video 15 detik dengan stiker & teks, otomatis hilang setelah 24 jam' },
              { title: 'Stories Ring', desc: 'Ring gradient pada avatar untuk story yang belum dilihat, abu-abu setelah dilihat' },
            ] },
            { title: 'Profile & Follow', items: [
              { title: 'Profile Grid', desc: 'Grid 3 kolom, tab Posts/Saved/Tagged, edit profile dan ganti foto' },
              { title: 'Follow System', desc: 'Follow/unfollow dengan update count follower & following secara real-time' },
            ] },
          ],
          features: [
            { id: 'F-01', name: 'Autentikasi', story: 'Registrasi, login, logout dengan JWT dan 2FA', priority: 'High' },
            { id: 'F-02', name: 'Upload Post', story: 'Upload foto/video dengan filter, crop, dan caption', priority: 'High' },
            { id: 'F-03', name: 'Home Feed', story: 'Infinite scroll post dari akun yang diikuti', priority: 'High' },
            { id: 'F-04', name: 'Interaksi Sosial', story: 'Like, komentar, share, dan save post', priority: 'High' },
            { id: 'F-05', name: 'Stories', story: 'Story 24 jam dengan ring gradient dan stiker', priority: 'Medium' },
            { id: 'F-06', name: 'Direct Message', story: 'Chat pribadi dengan kirim teks, foto, dan reaksi', priority: 'Medium' },
            { id: 'F-07', name: 'Explore & Search', story: 'Rekomendasi konten berdasarkan minat dan tren', priority: 'Medium' },
            { id: 'F-08', name: 'Notifikasi Push', story: 'Notifikasi like, komentar, follow via FCM', priority: 'Low' },
          ],
        };
      });
    },
  };
});
````
