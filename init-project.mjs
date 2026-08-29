import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

function log(msg) { console.log('\x1b[36m' + msg + '\x1b[0m'); }
function ok(msg) { console.log('\x1b[32m✓\x1b[0m ' + msg); }
function warn(msg) { console.log('\x1b[33m! ' + msg + '\x1b[0m'); }

function writeFile(relPath, content) {
  const p = join(ROOT, relPath);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content.trimStart(), 'utf8');
  ok(relPath);
}

function run(cmd) {
  log('> ' + cmd);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: ROOT });
  } catch (e) {
    warn('Perintah gagal: ' + cmd);
  }
}

// ============================================================
// BAGIAN 1: Inisialisasi proyek Vite + React
// ============================================================
log('\n=== BAGIAN 1/5: Inisialisasi proyek Vite ===');
writeFile('package.json', `
{
  "name": "prd-architect-pro",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
`);

writeFile('index.html', `
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PRD Architect Pro</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

writeFile('vite.config.js', `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`);

writeFile('.gitignore', `
node_modules
dist
dist-ssr
*.local
.DS_Store
.vscode
`);

// ============================================================
// BAGIAN 2: Instalasi dependensi
// ============================================================
log('\n=== BAGIAN 2/5: Instalasi dependensi ===');
run('npm install react react-dom');
run('npm install -D vite @vitejs/plugin-react');
run('npm install -D tailwindcss @tailwindcss/vite autoprefixer');
run('npm install zustand lodash');
run('npm install file-saver copy-to-clipboard');
run('npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons');

// ============================================================
// BAGIAN 3: Utilitas
// ============================================================
log('\n=== BAGIAN 3/5: Membuat utilitas & konstanta ===');

writeFile('src/utils/constants.js', `
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
  bpMobileOp:'\\u2264',bpMobile:'',bpMobileUnit:'px',
  bpTabletOp:'\\u2264',bpTablet:'',bpTabletUnit:'px',
  bpDesktopOp:'\\u2265',bpDesktop:'',bpDesktopUnit:'px',
  userFlow:'',
  techFrontend:'',techBackend:'',techDatabase:'',techInfra:'',techDomain:'',techVcs:'',
  techSecurity:'',techStorage:'',techThirdParty:'',techDevOps:'',techCaching:'',
  techQueue:'',techMonitoring:'',techAnalytics:'',techTesting:'',
  dbSchema:'',
  nfrSpecs:'',nfrPerformance:'',nfrLocalization:'',nfrBrowser:'',figmaLink:'',riskMitigation:'',
  outOfScope:'',defOfDone:'',
};

export const INITIAL_SIMPLE_EXTRAS = EXTRAS_DEFINITIONS.reduce(function (a, d) { const o = Object.assign({}, a); o[d.key] = false; return o; }, {});
`);

writeFile('src/utils/helpers.js', `
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
  return parts.join(' \\u00B7 ');
};
`);

writeFile('src/utils/validators.js', `
export const validateRequired = function (v) { return !!(v && v.toString().trim()); };
`);

// markdown.js - pakai teknik array join untuk hindari masalah backtick
const mdLines = [
  "import { buildBreakpoints, formatTargetDate } from './helpers';",
  "import { TECH_REQUIRED, TECH_OPTIONAL } from './constants';",
  "",
  "const BT = String.fromCharCode(96);",
  "const FENCE = BT + BT + BT;",
  "",
  "const isVis = function (mode, extras, key) { return mode === 'enterprise' || extras[key] === true; };",
  "",
  "export const generateMarkdown = function (state) {",
  "  const f = state.fields;",
  "  const features = state.features;",
  "  const palette = state.palette;",
  "  const roles = state.roles;",
  "  const acModules = state.acModules;",
  "  const schemaTables = state.schemaTables;",
  "  const mode = state.mode;",
  "  const se = state.simpleExtras;",
  "  const techOptional = state.techOptional || [];",
  "",
  "  const title = f.projectName || 'PROYEK TANPA NAMA';",
  "  const date = formatTargetDate(f.targetDate, f.targetDateFormat);",
  "",
  "  let feat = '| ID | Fitur | Deskripsi | Prioritas |\\n|---|---|---|---|\\n';",
  "  features.forEach(function (ft) { feat += '| ' + ft.id + ' | ' + ft.name + ' | ' + ft.story + ' | ' + ft.priority + ' |\\n'; });",
  "",
  "  let out = '# ' + title + '\\n**Product Requirement Document (' + mode.toUpperCase() + ')**\\n\\n';",
  "  out += '**Author:** ' + f.author + ' | **Version:** ' + f.docVersion + ' | **Target:** ' + date + '\\n\\n';",
  "  out += '## 1. Overview & Goals\\n- **Problem:** ' + f.problemStatement + '\\n- **Goal:** ' + f.productGoal + '\\n\\n';",
  "",
  "  if (isVis(mode, se, 'persona')) out += '## 1.1 Target User Persona & Metrics\\n- **Persona:** ' + f.userPersona + '\\n- **Success KPI:** ' + f.successMetrics + '\\n\\n';",
  "",
  "  if (isVis(mode, se, 'branding') && (palette.length || f.brandTypography)) {",
  "    const bp = buildBreakpoints(f);",
  "    out += '## 1.2 Branding & Design System\\n';",
  "    out += palette.map(function (p) { return '- **' + p.name + '** ' + BT + p.hex + BT + ' : ' + p.usage; }).join('\\n');",
  "    out += '\\n\\n**Typography:** ' + f.brandTypography + '\\n**Layout:** ' + f.brandLayout + '\\n';",
  "    if (bp) out += '**Breakpoint:** ' + bp + '\\n';",
  "    out += '\\n';",
  "  }",
  "",
  "  if (isVis(mode, se, 'roles') && roles.length) {",
  "    out += '## 1.3 Role & Permission Matrix\\n';",
  "    out += roles.map(function (r) {",
  "      return '### ' + r.name + '\\n- \\u2705 ' + r.can.split('\\n').filter(function (x) { return x.trim(); }).join(' | ') + '\\n- \\u274c ' + r.cannot.split('\\n').filter(function (x) { return x.trim(); }).join(' | ');",
  "    }).join('\\n\\n');",
  "    out += '\\n\\n';",
  "  }",
  "",
  "  out += '## 2. Core Features (Requirements)\\n' + feat + '\\n';",
  "",
  "  if (isVis(mode, se, 'ac') && acModules.length) {",
  "    out += '## 2.1 Acceptance Criteria per Modul\\n';",
  "    out += acModules.map(function (m, mi) {",
  "      return '### ' + (mi + 1) + '. ' + m.title + '\\n' + m.items.map(function (it, ii) { return '- **AC-' + (mi + 1) + '.' + (ii + 1) + ' ' + it.title + '**: ' + it.desc; }).join('\\n');",
  "    }).join('\\n\\n');",
  "    out += '\\n\\n';",
  "  }",
  "",
  "  out += '## 3. User Flow\\n' + BT + f.userFlow + BT + '\\n\\n';",
  "",
  "  out += '## 4. Detailed Tech Stack & Architecture\\n';",
  "  TECH_REQUIRED.forEach(function (d) { out += '- **' + d.label + ':** ' + (f[d.key] || '-') + '\\n'; });",
  "  TECH_OPTIONAL.forEach(function (d) { if (techOptional.includes(d.key)) out += '- **' + d.label + ':** ' + (f[d.key] || '-') + '\\n'; });",
  "  out += '\\n' + FENCE + 'sql\\n' + f.dbSchema + '\\n' + FENCE + '\\n\\n';",
  "",
  "  if (isVis(mode, se, 'schema') && schemaTables.length) {",
  "    out += '## 4.1 Schema Data\\n';",
  "    out += schemaTables.map(function (t) {",
  "      let s = '### Tabel: ' + (t.name || 'tanpa_nama') + '\\n';",
  "      if (t.desc) s += '> ' + t.desc + '\\n';",
  "      s += '| Field | Tipe | Not Null | Keterangan |\\n|---|---|---|---|\\n';",
  "      s += t.fields.map(function (c) { return '| ' + c.field + ' | ' + c.type + ' | ' + c.required + ' | ' + c.note + ' |'; }).join('\\n');",
  "      return s;",
  "    }).join('\\n\\n');",
  "    out += '\\n\\n';",
  "  }",
  "",
  "  if (isVis(mode, se, 'nfr')) {",
  "    out += '## 4.2 NFR, Prototype & Risk Analysis\\n- **Keamanan:** ' + f.nfrSpecs + '\\n- **Performance:** ' + f.nfrPerformance + '\\n- **Lokalisasi:** ' + f.nfrLocalization + '\\n- **Browser:** ' + f.nfrBrowser + '\\n- **Figma Link:** ' + f.figmaLink + '\\n- **Risk & Mitigation:** ' + f.riskMitigation + '\\n\\n';",
  "  }",
  "",
  "  out += '## 5. Out of Scope\\n' + f.outOfScope + '\\n\\n';",
  "  out += '## 6. Definition of Done\\n' + f.defOfDone;",
  "  return out;",
  "};",
];
writeFile('src/utils/markdown.js', mdLines.join('\n'));

// ============================================================
// BAGIAN 4: Store, Hooks, Services
// ============================================================
log('\n=== BAGIAN 4/5: Store, Hooks, Services ===');

writeFile('src/services/storageService.js', `
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
`);

writeFile('src/services/exportService.js', `
import { saveAs } from 'file-saver';
import copyToClipboard from 'copy-to-clipboard';
import { generateMarkdown } from '../utils/markdown';

export const exportService = {
  exportJSON: function (state) {
    const data = { app: 'PRD Architect Pro', version: '2.5', mode: state.mode, state: state };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, (state.fields.projectName || 'PRD') + '.json');
  },
  copyMarkdown: function (state) {
    copyToClipboard(generateMarkdown(state));
  },
  printDocument: function () { window.print(); },
};
`);

writeFile('src/store/usePrdStore.js', `
import { create } from 'zustand';
import { cloneDeep } from 'lodash';
import { DEFAULT_FIELDS, INITIAL_SIMPLE_EXTRAS, MAX_HISTORY } from '../utils/constants';

const init = function () {
  return {
    mode: 'simple', simpleExtras: { ...INITIAL_SIMPLE_EXTRAS }, fields: { ...DEFAULT_FIELDS },
    features: [], palette: [], roles: [], schemaTables: [], acModules: [], techOptional: [],
    history: [], historyIndex: -1, saveIndicator: '',
  };
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
        if (last && JSON.stringify(last) === JSON.stringify(snap)) return {};
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
        const st = s.history[ni];
        return Object.assign({}, st, { historyIndex: ni, history: s.history });
      });
    },
    redo: function () {
      set(function (s) {
        if (s.historyIndex >= s.history.length - 1) return {};
        const ni = s.historyIndex + 1;
        const st = s.history[ni];
        return Object.assign({}, st, { historyIndex: ni, history: s.history });
      });
    },

    restoreState: function (st) {
      set({
        fields: Object.assign({}, DEFAULT_FIELDS, st.fields || {}),
        features: st.features || [], palette: st.palette || [], roles: st.roles || [],
        schemaTables: st.schemaTables || [], acModules: st.acModules || [],
        simpleExtras: st.simpleExtras || { ...INITIAL_SIMPLE_EXTRAS },
        techOptional: st.techOptional || [],
        mode: st.mode || 'simple',
      });
    },

    clearAll: function () {
      set(function (s) {
        const base = init();
        return Object.assign({}, base, { mode: s.mode, history: s.history, historyIndex: s.historyIndex, saveIndicator: s.saveIndicator });
      });
    },

    loadSampleData: function () {
      set(function () {
        return {
          fields: {
            projectName: 'Prime Property', docVersion: 'v1.0 Final Draft', author: 'Tim Product Prime Property',
            targetDate: '2026-05-24', targetDateFormat: 'full',
            problemStatement: 'Agen properti membutuhkan portal internal untuk mengelola listing properti secara terpusat.',
            productGoal: 'Membangun web platform publik dan portal internal agent.',
            userFlow: 'Landing -> About -> Contact -> Login Agent -> Dashboard Listing -> CRUD Properti',
            techFrontend: 'HTML5, Tailwind CSS, JavaScript',
            techBackend: 'Node.js / Laravel',
            techDatabase: 'PostgreSQL',
            techInfra: 'Vercel, Docker, Nginx',
            techDomain: 'Cloudflare DNS, Niagahoster',
            techVcs: 'GitHub',
            techSecurity: 'httpOnly cookie, SameSite=Lax, CSRF, bcrypt',
            techThirdParty: 'WhatsApp API, Google Maps',
            techDevOps: 'GitHub Actions CI/CD',
            dbSchema: 'users: id, email, password_hash, role\\nproperties: id, nama, price, status',
            outOfScope: 'Upload gambar\\nPembayaran online',
            defOfDone: 'Semua AC terpenuhi\\nTidak ada bug critical\\nResponsive',
            userPersona: 'Agen internal, Superadmin, pengunjung publik',
            successMetrics: 'Lighthouse >= 85',
            brandTypography: 'Inter atau Geist',
            brandLayout: 'Compact, mobile-responsive',
            bpMobileOp: '\\u2264', bpMobile: '640', bpMobileUnit: 'px',
            bpTabletOp: '\\u2264', bpTablet: '1024', bpTabletUnit: 'px',
            bpDesktopOp: '\\u2265', bpDesktop: '1024', bpDesktopUnit: 'px',
            nfrSpecs: 'HTTPS, rate limiting',
            nfrPerformance: 'FCP < 1.5s',
            nfrLocalization: 'Bahasa Indonesia, Rupiah',
            nfrBrowser: 'Chrome/Edge/Firefox/Safari',
            figmaLink: 'https://figma.com/file/prime-property',
            riskMitigation: 'Risiko kebocoran data.',
          },
          techOptional: ['techSecurity', 'techThirdParty', 'techDevOps'],
          simpleExtras: { persona: true, branding: true, roles: true, ac: true, schema: true, nfr: true },
          palette: [
            { name: 'Primary Black', hex: '#1A1A1A', usage: 'Header' },
            { name: 'Accent Gold', hex: '#C9A961', usage: 'CTA' },
            { name: 'Accent Red', hex: '#B33A3A', usage: 'Status urgent' },
            { name: 'Neutral White', hex: '#FFFFFF', usage: 'Background utama' },
          ],
          roles: [
            { name: 'Admin', can: 'View listing\\nFilter', cannot: 'CRUD properti' },
            { name: 'Superadmin', can: 'Full CRUD\\nManage users', cannot: '-' },
          ],
          schemaTables: [
            { name: 'users', desc: 'Akun agent', fields: [
              { field: 'id', type: 'BIGINT', required: 'Ya', note: 'PK' },
              { field: 'email', type: 'VARCHAR', required: 'Ya', note: 'unik' },
              { field: 'role', type: 'ENUM', required: 'Ya', note: 'admin/superadmin' },
            ] },
            { name: 'properties', desc: 'Listing properti', fields: [
              { field: 'id', type: 'BIGINT', required: 'Ya', note: 'PK' },
              { field: 'nama', type: 'VARCHAR', required: 'Ya', note: 'nama properti' },
              { field: 'price', type: 'BIGINT', required: 'Ya', note: 'rupiah' },
              { field: 'status', type: 'ENUM', required: 'Ya', note: 'in_stock/sold_out' },
            ] },
          ],
          acModules: [
            { title: 'Landing Page', items: [
              { title: 'Hero Section', desc: 'Tagline + CTA primer dengan aksen emas' },
              { title: 'Navigasi', desc: 'Sticky header dengan menu lengkap' },
            ] },
            { title: 'CRUD Properti', items: [
              { title: 'Delete Aman', desc: 'Soft delete dengan modal konfirmasi' },
            ] },
          ],
          features: [
            { id: 'F-01', name: 'Autentikasi Agent', story: 'Login email + password dengan lockout', priority: 'High' },
            { id: 'F-02', name: 'Property Listing', story: 'Filter & search real-time', priority: 'High' },
            { id: 'F-03', name: 'CRUD Properti', story: 'Create/update/delete dengan audit log', priority: 'High' },
          ],
        };
      });
    },
  };
});
`);

writeFile('src/store/useViewStore.js', `
import { create } from 'zustand';
export const useViewStore = create(function (set) {
  return { view: 'editor', setView: function (v) { set({ view: v }); } };
});
`);

writeFile('src/hooks/useToast.js', `
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
`);

writeFile('src/hooks/useAutoSave.js', `
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
  const setSaveIndicator = usePrdStore(function (s) { return s.setSaveIndicator; });
  const first = useRef(true);

  useEffect(function () {
    const state = { mode: mode, fields: fields, features: features, palette: palette, roles: roles, schemaTables: schemaTables, acModules: acModules, simpleExtras: simpleExtras, techOptional: techOptional };
    const save = debounce(function () {
      const ok = storageService.save(state);
      if (ok) {
        const t = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setSaveIndicator('Tersimpan ' + t);
      }
    }, AUTOSAVE_DELAY);
    if (first.current) { first.current = false; save.flush(); } else { save(); }
    return function () { save.cancel(); };
  }, [mode, fields, features, palette, roles, schemaTables, acModules, simpleExtras, techOptional, setSaveIndicator]);
};
`);

writeFile('src/hooks/useAutoResize.js', `
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
`);

writeFile('src/hooks/useSwipe.js', `
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
`);

// ============================================================
// BAGIAN 5: Semua Komponen React
// ============================================================
log('\n=== BAGIAN 5/5: Membuat semua komponen React ===');

writeFile('src/styles/globals.css', `
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
`);

writeFile('src/components/shared/Toast.jsx', `
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
`);

writeFile('src/components/shared/IconButton.jsx', `
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function IconButton(props) {
  const icon = props.icon;
  const onClick = props.onClick;
  const variant = props.variant || 'default';
  const disabled = props.disabled;
  const className = props.className || '';
  const children = props.children;
  const title = props.title;

  const v = {
    default: 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600',
    danger: 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800',
    primary: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500',
    accent: 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500',
  };
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      className={'flex items-center justify-center px-3 py-2 md:py-1.5 text-xs font-semibold rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed ' + (v[variant] || v.default) + ' ' + className}>
      {icon && <FontAwesomeIcon icon={icon} className={children ? 'mr-1.5' : ''} />}
      {children}
    </button>
  );
}
`);

writeFile('src/components/shared/ToggleSwitch.jsx', `
export default function ToggleSwitch(props) {
  const checked = props.checked;
  const onChange = props.onChange;
  const label = props.label;
  const icon = props.icon;
  const iconColor = props.iconColor || 'text-slate-400';
  return (
    <label className="extra-toggle flex items-center justify-between p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-700 rounded-lg cursor-pointer transition">
      <span className="flex items-center space-x-2 text-slate-200">
        {icon && <span className={'text-xs w-4 ' + iconColor}>{icon}</span>}
        <span className="text-[11px] font-medium">{label}</span>
      </span>
      <input type="checkbox" checked={!!checked} onChange={function (e) { onChange && onChange(e.target.checked); }}
        className="appearance-none w-9 h-5 bg-slate-600 rounded-full relative cursor-pointer transition-colors checked:bg-emerald-500 after:content-[''] after:absolute after:w-4 after:h-4 after:rounded-full after:bg-white after:top-0.5 after:left-0.5 after:transition-all checked:after:left-[18px]" />
    </label>
  );
}
`);

writeFile('src/components/shared/ComboBox.jsx', `
import { useState, useRef, useEffect } from 'react';
import { DATA_TYPES } from '../../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function ComboBox(props) {
  const value = props.value;
  const onChange = props.onChange;
  const placeholder = props.placeholder || 'Tipe data';

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
      <input value={value}
        onChange={function (e) { onChange && onChange(e.target.value); setOpen(true); setAi(-1); }}
        onFocus={function () { setOpen(true); }}
        onKeyDown={onKey}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 pr-6 text-slate-100 font-mono text-xs focus:border-amber-500 focus:outline-none" />
      <FontAwesomeIcon icon={faChevronDown} className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-500 pointer-events-none" />
      {open && (
        <div className="absolute z-40 left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg max-h-56 overflow-y-auto shadow-xl">
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
                    <button key={it} type="button" onClick={function () { onChange && onChange(it); setOpen(false); }}
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
`);

writeFile('src/components/header/ModeSwitcher.jsx', `
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';

export default function ModeSwitcher() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const setMode = usePrdStore(function (s) { return s.setMode; });
  const commitHistory = usePrdStore(function (s) { return s.commitHistory; });
  const sw = function (m) { if (mode === m) return; setMode(m); commitHistory(); };
  const a = 'flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 shadow-md ';
  const i = 'flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-all duration-200';
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
`);

writeFile('src/components/header/Header.jsx', `
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
          <h1 className="font-bold text-base md:text-lg text-white leading-snug truncate py-0.5">PRD Architect <span className="align-middle whitespace-nowrap text-[10px] md:text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 md:px-2 py-0.5 rounded-full ml-1">Pro V2.5</span></h1>
          <p className="text-[11px] md:text-xs text-slate-400 mt-0.5 md:mt-1 truncate">Perancang Dokumen PRD Profesional</p>
        </div>
      </div>
      <ModeSwitcher />
      <div className="contents md:flex md:items-center md:space-x-3 md:order-3">
        <span className="text-[10px] text-slate-500 hidden lg:inline">{saveIndicator}</span>
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700 rounded-lg p-0.5 shadow-inner order-2">
          <IconButton icon={faRotateLeft} onClick={undo} disabled={hi <= 0} title="Undo (Ctrl+Z)"><span className="hidden md:inline">Undo</span></IconButton>
          <IconButton icon={faRotateRight} onClick={redo} disabled={hi >= hl - 1} title="Redo (Ctrl+Y)"><span className="hidden md:inline">Redo</span></IconButton>
        </div>
        <IconButton icon={faWandMagicSparkles} onClick={function () { loadSampleData(); commitHistory(); showToast('Data contoh Prime Property dimuat'); }} className="order-4 flex-1 md:flex-none">Muat Contoh</IconButton>
        <IconButton icon={faTrash} onClick={function () { clearAll(); commitHistory(); storageService.clear(); showToast('Form direset', 'info'); }} variant="danger" className="order-4 flex-1 md:flex-none">Reset</IconButton>
      </div>
    </header>
  );
}
`);

writeFile('src/components/editor/EditorSection.jsx', `
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
`);

writeFile('src/components/editor/ModeBanner.jsx', `
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
`);

writeFile('src/components/editor/ExtrasPicker.jsx', `
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
`);

writeFile('src/components/editor/sections/ProjectInfo.jsx', `
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

export default function ProjectInfo() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  return (
    <EditorSection title="1. Informasi Proyek & Metadata" icon={faCircleInfo}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div><label className="block text-slate-300 font-medium mb-1">Nama Proyek / Aplikasi</label>
          <input type="text" value={f.projectName} onChange={function (e) { set('projectName', e.target.value); }} placeholder="misal: Prime Property" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" /></div>
        <div><label className="block text-slate-300 font-medium mb-1">Versi Dokumen</label>
          <input type="text" value={f.docVersion} onChange={function (e) { set('docVersion', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" /></div>
        <div><label className="block text-slate-300 font-medium mb-1">Penulis / Product Owner</label>
          <input type="text" value={f.author} onChange={function (e) { set('author', e.target.value); }} placeholder="Nama Anda / Tim Product" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" /></div>
        <div><label className="block text-slate-300 font-medium mb-1">Target Rilis</label>
          <input type="date" value={f.targetDate} onChange={function (e) { set('targetDate', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" /></div>
        <div className="md:col-span-2"><label className="block text-slate-300 font-medium mb-1">Format Tampilan Target Rilis</label>
          <select value={f.targetDateFormat} onChange={function (e) { set('targetDateFormat', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none">
            <option value="full">Tanggal Lengkap</option><option value="month">Bulan + Tahun</option><option value="quarter">Kuartal + Tahun</option>
          </select></div>
      </div>
    </EditorSection>
  );
}
`);

writeFile('src/components/editor/sections/ProblemGoal.jsx', `
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

export default function ProblemGoal() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  return (
    <EditorSection title="2. Masalah & Tujuan (Problem & Goal)" icon={faBullseye}>
      <div className="space-y-3 text-xs">
        <div><label className="block text-slate-300 font-medium mb-1">Latar Belakang / Problem Statement</label>
          <textarea value={f.problemStatement} onChange={function (e) { set('problemStatement', e.target.value); }} rows="3" placeholder="Masalah utama apa yang dihadapi calon pengguna?" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" /></div>
        <div><label className="block text-slate-300 font-medium mb-1">Tujuan Utama Produk (Goals)</label>
          <textarea value={f.productGoal} onChange={function (e) { set('productGoal', e.target.value); }} rows="3" placeholder="Solusi konkret dan target yang ingin dicapai..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" /></div>
      </div>
    </EditorSection>
  );
}
`);

writeFile('src/components/editor/sections/PersonaSection.jsx', `
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
        <div><label className="block text-slate-300 font-medium mb-1">Target User Persona</label>
          <textarea value={f.userPersona} onChange={function (e) { set('userPersona', e.target.value); }} rows="2" placeholder="Siapa segmen target pengguna utama?" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none resize-none" /></div>
        <div><label className="block text-slate-300 font-medium mb-1">Metrik & Analytics KPI</label>
          <textarea value={f.successMetrics} onChange={function (e) { set('successMetrics', e.target.value); }} rows="2" placeholder="Indikator keberhasilan" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none resize-none" /></div>
      </div>
    </EditorSection>
  );
}
`);

writeFile('src/components/editor/sections/BrandingSection.jsx', `
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
      action={<IconButton onClick={addP} variant="accent">+ Warna</IconButton>}>
      <div className="space-y-2">
        {palette.map(function (p, i) {
          const d = (p.hex || '').replace(/^#/, '');
          return (
            <div key={i} className="grid grid-cols-6 md:grid-cols-12 gap-2 items-center p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs">
              <span className="col-span-1 order-1 flex justify-center">
                <span className="w-5 h-5 rounded-full border border-slate-600" style={{ background: liveHexColor(d) || '#0f172a' }} />
              </span>
              <input value={p.name} onChange={function (e) { updP(i, { name: e.target.value }); }} placeholder="Nama warna" className="col-span-4 md:col-span-3 order-2 bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
              <div className="relative col-span-3 md:col-span-4 order-4 md:order-3">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[11px] pointer-events-none">#</span>
                <input type="text" value={d} onChange={function (e) { const c = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6); updP(i, { hex: c ? '#' + c : '' }); }} placeholder="C9A961" maxLength="6" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 pl-6 pr-8 text-slate-100 font-mono focus:border-amber-500 focus:outline-none" />
                <input type="color" value={normalizeHex(p.hex)} onChange={function (e) { updP(i, { hex: e.target.value }); }} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 cursor-pointer" />
                <FontAwesomeIcon icon={faEyeDropper} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <input value={p.usage} onChange={function (e) { updP(i, { usage: e.target.value }); }} placeholder="Penggunaan" className="col-span-3 order-5 md:order-4 bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
              <button onClick={function () { remP(i); }} className="col-span-1 order-3 md:order-5 text-rose-400 hover:text-rose-300 flex justify-center"><FontAwesomeIcon icon={faXmark} /></button>
            </div>
          );
        })}
      </div>
      <div className="space-y-3 text-xs pt-2">
        <div>
          <label className="block text-slate-300 font-medium mb-1">Typography</label>
          <input type="text" value={f.brandTypography} onChange={function (e) { set('brandTypography', e.target.value); }} placeholder="misal: Inter / Geist" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-slate-300 font-medium mb-1">Prinsip Layout</label>
          <textarea value={f.brandLayout} onChange={function (e) { set('brandLayout', e.target.value); }} rows="2" placeholder="misal: compact, mobile-responsive" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label className="block text-slate-300 font-medium mb-1">Breakpoint Responsif</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {bps.map(function (bp) {
              return (
                <div key={bp.k}>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">{bp.l}</label>
                  <div className="flex">
                    <select value={f[bp.k + 'Op']} onChange={function (e) { set(bp.k + 'Op', e.target.value); }} className="bg-slate-800 border border-slate-700 rounded-l-lg px-1.5 py-2 text-[11px] text-slate-300 font-mono">
                      <option value={'\\u2264'}>{'\\u2264'}</option>
                      <option value={'\\u2265'}>{'\\u2265'}</option>
                      <option value="=">=</option>
                    </select>
                    <input type="text" value={f[bp.k]} onChange={function (e) { set(bp.k, e.target.value.replace(/[^0-9.]/g, '')); }} placeholder={bp.l === 'Mobile' ? '640' : '1024'} className="w-full min-w-0 bg-slate-900 border-y border-slate-700 px-2 py-2 text-[11px] text-slate-100 font-mono" />
                    <select value={f[bp.k + 'Unit']} onChange={function (e) { set(bp.k + 'Unit', e.target.value); }} className="bg-slate-800 border border-slate-700 rounded-r-lg px-1.5 py-2 text-[11px] text-slate-300 font-mono">
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
`);

writeFile('src/components/editor/sections/RolesSection.jsx', `
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
      action={<IconButton onClick={add} variant="accent">+ Role</IconButton>}>
      <div className="space-y-3">
        {roles.map(function (r, i) {
          return (
            <div key={i} className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <input value={r.name} onChange={function (e) { upd(i, { name: e.target.value }); }} placeholder="Nama role" className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 font-semibold w-1/2" />
                <button onClick={function () { rem(i); }} className="text-rose-400 hover:text-rose-300"><FontAwesomeIcon icon={faXmark} /> Hapus</button>
              </div>
              <textarea value={r.can} onChange={function (e) { upd(i, { can: e.target.value }); }} rows="2" placeholder="Yang boleh dilakukan" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 resize-none" />
              <textarea value={r.cannot} onChange={function (e) { upd(i, { cannot: e.target.value }); }} rows="2" placeholder="Yang TIDAK boleh dilakukan" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 resize-none" />
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
`);

writeFile('src/components/editor/sections/FeaturesList.jsx', `
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
      action={<IconButton onClick={add}>+ Tambah Fitur</IconButton>}>
      <div className="space-y-3">
        {features.map(function (f, i) {
          return (
            <div key={i} className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-400">{f.id}</span>
                <button onClick={function () { rem(i); }} className="text-rose-400 hover:text-rose-300 text-xs"><FontAwesomeIcon icon={faXmark} /> Hapus</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input type="text" value={f.name} onChange={function (e) { upd(i, { name: e.target.value }); }} placeholder="Nama Fitur" className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
                <input type="text" value={f.story} onChange={function (e) { upd(i, { story: e.target.value }); }} placeholder="Deskripsi / User Story" className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 md:col-span-2" />
              </div>
              <select value={f.priority} onChange={function (e) { upd(i, { priority: e.target.value }); }} className="bg-slate-800 border border-slate-700 rounded p-1 text-slate-100 text-[11px]">
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
`);

writeFile('src/components/editor/sections/AcSection.jsx', `
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
      action={<IconButton onClick={addM} variant="accent">+ Modul</IconButton>}>
      <div className="space-y-4">
        {ac.map(function (m, mi) {
          return (
            <div key={mi} className="p-3 bg-slate-900 border border-amber-900/50 rounded-lg space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <input value={m.title} onChange={function (e) { updM(mi, { title: e.target.value }); }} placeholder="Nama modul" className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 font-semibold w-2/3" />
                <button onClick={function () { remM(mi); }} className="text-rose-400 hover:text-rose-300"><FontAwesomeIcon icon={faXmark} /> Hapus</button>
              </div>
              <div className="space-y-2">
                {m.items.map(function (it, ii) {
                  return (
                    <div key={ii} className="p-2 bg-slate-800/60 border border-slate-700 rounded space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-400">AC-{mi + 1}.{ii + 1}</span>
                        <button onClick={function () { remI(mi, ii); }} className="text-rose-400 hover:text-rose-300"><FontAwesomeIcon icon={faXmark} /></button>
                      </div>
                      <input value={it.title} onChange={function (e) { updI(mi, ii, { title: e.target.value }); }} placeholder="Judul kriteria" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
                      <textarea value={it.desc} onChange={function (e) { updI(mi, ii, { desc: e.target.value }); }} rows="2" placeholder="Deskripsi kriteria..." className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 resize-none" />
                    </div>
                  );
                })}
              </div>
              <button onClick={function () { addI(mi); }} className="text-amber-400 hover:text-amber-300 font-semibold"><FontAwesomeIcon icon={faPlus} className="mr-1" />Tambah Kriteria</button>
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
`);

writeFile('src/components/editor/sections/TechStack.jsx', `
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
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-slate-300 font-medium">
          <FontAwesomeIcon icon={def.icon} className={def.color + ' mr-1'} />
          {def.label}
        </label>
        {onRemove && (
          <button onClick={onRemove} className="text-rose-400 hover:text-rose-300 text-[10px] font-semibold" title="Hapus stack ini">
            <FontAwesomeIcon icon={faXmark} className="mr-1" />
            Hapus
          </button>
        )}
      </div>
      <input
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
          <IconButton icon={faPlus} onClick={function () { setOpen(!open); }}>Tambah Stack Lanjutan</IconButton>
          {open && (
            <div className="absolute z-40 right-0 mt-2 w-80 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-72 overflow-y-auto">
              {availEssential.length > 0 && (
                <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-slate-500 bg-slate-900 sticky top-0">Esensial</div>
              )}
              {availEssential.map(function (d) {
                return (
                  <button key={d.key} onClick={function () { addTech(d.key); }} className="block w-full text-left px-3 py-2 text-[11px] text-slate-200 hover:bg-blue-600/30">
                    <FontAwesomeIcon icon={d.icon} className={d.color + ' mr-2'} />
                    {d.label}
                  </button>
                );
              })}
              {availAdvanced.length > 0 && (
                <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-slate-500 bg-slate-900 sticky top-0">Lanjutan</div>
              )}
              {availAdvanced.map(function (d) {
                return (
                  <button key={d.key} onClick={function () { addTech(d.key); }} className="block w-full text-left px-3 py-2 text-[11px] text-slate-200 hover:bg-blue-600/30">
                    <FontAwesomeIcon icon={d.icon} className={d.color + ' mr-2'} />
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
          <label className="block text-slate-300 font-medium mb-1">Alur Pengguna (User Flow)</label>
          <input
            type="text"
            value={f.userFlow}
            onChange={function (e) { set('userFlow', e.target.value); }}
            placeholder="Landing -> Auth -> Dashboard"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
          />
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
          <label className="block text-slate-300 font-medium mb-1">Skema Database & Model Relasi</label>
          <textarea
            value={f.dbSchema}
            onChange={function (e) { set('dbSchema', e.target.value); }}
            rows="3"
            placeholder="users: id, name, email"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none font-mono resize-none"
          />
        </div>
      </div>
    </EditorSection>
  );
}
`);

writeFile('src/components/editor/sections/SchemaSection.jsx', `
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
      action={<IconButton onClick={addT} variant="accent">+ Tabel</IconButton>}>
      <p className="text-[11px] text-slate-500 -mt-1">Tambahkan nama tabel beserta propertinya.</p>
      <div className="space-y-4">
        {st.map(function (t, ti) {
          return (
            <div key={ti} className="p-3 bg-slate-900 border border-amber-900/50 rounded-lg space-y-3 text-xs">
              <div className="grid grid-cols-6 md:grid-cols-12 gap-2 items-center">
                <span className="col-span-1 order-1 text-amber-400 text-center"><FontAwesomeIcon icon={faTableList} /></span>
                <input value={t.name} onChange={function (e) { updT(ti, { name: e.target.value }); }} placeholder="Nama tabel" className="col-span-4 md:col-span-4 order-2 bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 font-mono font-semibold" />
                <button onClick={function () { remT(ti); }} className="col-span-1 order-3 md:order-4 text-rose-400 hover:text-rose-300 flex justify-center"><FontAwesomeIcon icon={faXmark} /></button>
                <input value={t.desc} onChange={function (e) { updT(ti, { desc: e.target.value }); }} placeholder="Deskripsi tabel" className="col-span-6 md:col-span-6 order-4 md:order-3 bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
              </div>
              <div className="space-y-2">
                {t.fields.map(function (s, fi) {
                  return (
                    <div key={fi} className="grid grid-cols-6 md:grid-cols-12 gap-2 items-center p-2 bg-slate-800/60 border border-slate-700 rounded-lg">
                      <input value={s.field} onChange={function (e) { updF(ti, fi, { field: e.target.value }); }} placeholder="Nama kolom" className="col-span-5 md:col-span-3 order-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono" />
                      <button onClick={function () { remF(ti, fi); }} className="col-span-1 order-2 md:order-5 text-rose-400 hover:text-rose-300 flex justify-center"><FontAwesomeIcon icon={faXmark} /></button>
                      <div className="col-span-4 md:col-span-3 order-3 md:order-2"><ComboBox value={s.type} onChange={function (v) { updF(ti, fi, { type: v }); }} /></div>
                      <select value={s.required} onChange={function (e) { updF(ti, fi, { required: e.target.value }); }} className="col-span-2 md:col-span-2 order-4 md:order-3 bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100">
                        <option value="Ya">Not Null</option>
                        <option value="Opsional">Opsional</option>
                      </select>
                      <input value={s.note} onChange={function (e) { updF(ti, fi, { note: e.target.value }); }} placeholder="Keterangan" className="col-span-6 md:col-span-3 order-5 md:order-4 bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100" />
                    </div>
                  );
                })}
              </div>
              <button onClick={function () { addF(ti); }} className="text-amber-400 hover:text-amber-300 font-semibold"><FontAwesomeIcon icon={faPlus} className="mr-1" />Tambah Kolom</button>
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
`);

writeFile('src/components/editor/sections/NfrSection.jsx', `
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

function TA(props) {
  return (
    <div>
      <label className="block text-slate-300 font-medium mb-1">{props.label}</label>
      <textarea value={props.value} onChange={function (e) { props.onChange(e.target.value); }} rows="2" placeholder={props.ph} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none resize-none" />
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
        <TA label="Keamanan & Compliance" value={f.nfrSpecs} onChange={function (v) { set('nfrSpecs', v); }} ph="OAuth 2.0, HTTPS, CSRF" />
        <TA label="Performance" value={f.nfrPerformance} onChange={function (v) { set('nfrPerformance', v); }} ph="FCP < 1.5s, Lighthouse >= 85" />
        <TA label="Bahasa & Lokalisasi" value={f.nfrLocalization} onChange={function (v) { set('nfrLocalization', v); }} ph="UI Bahasa Indonesia, format Rupiah" />
        <TA label="Browser Support" value={f.nfrBrowser} onChange={function (v) { set('nfrBrowser', v); }} ph="Chrome/Edge/Firefox/Safari" />
        <div>
          <label className="block text-slate-300 font-medium mb-1">Figma Link</label>
          <input type="text" value={f.figmaLink} onChange={function (e) { set('figmaLink', e.target.value); }} placeholder="https://figma.com/file/..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none" />
        </div>
        <TA label="Analisis Risiko & Mitigasi" value={f.riskMitigation} onChange={function (v) { set('riskMitigation', v); }} ph="Risiko teknis / bisnis..." />
      </div>
    </EditorSection>
  );
}
`);

writeFile('src/components/editor/sections/OutOfScope.jsx', `
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
          <label className="block text-rose-300 font-medium mb-1">Fitur Ditunda (Out of Scope)</label>
          <textarea value={f.outOfScope} onChange={function (e) { set('outOfScope', e.target.value); }} rows="2" placeholder="Fitur yang sengaja ditunda (pisahkan per baris)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label className="block text-emerald-300 font-medium mb-1">Kriteria Selesai (Definition of Done)</label>
          <textarea value={f.defOfDone} onChange={function (e) { set('defOfDone', e.target.value); }} rows="2" placeholder="Kapan proyek ini dianggap rilis sukses?" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" />
        </div>
      </div>
    </EditorSection>
  );
}
`);

writeFile('src/components/editor/EditorPanel.jsx', `
import { useEffect } from 'react';
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
`);

writeFile('src/components/preview/sections/OverviewPreview.jsx', `
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
`);

writeFile('src/components/preview/sections/PersonaPreview.jsx', `
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
`);

writeFile('src/components/preview/sections/BrandingPreview.jsx', `
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
                <span className="text-slate-500">{'\\u00B7'} {p.usage}</span>
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
`);

writeFile('src/components/preview/sections/RolesPreview.jsx', `
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
              <p className="text-emerald-700"><FontAwesomeIcon icon={faCircleCheck} className="mr-1" />{r.can.split('\\n').filter(function (x) { return x.trim(); }).join(' \\u00B7 ') || '-'}</p>
              <p className="text-rose-700 mt-0.5"><FontAwesomeIcon icon={faCircleXmark} className="mr-1" />{r.cannot.split('\\n').filter(function (x) { return x.trim(); }).join(' \\u00B7 ') || '-'}</p>
            </div>
          );
        }) : <p className="italic text-slate-400">Belum ada role.</p>}
      </div>
    </div>
  );
}
`);

writeFile('src/components/preview/sections/FeaturesPreview.jsx', `
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
`);

writeFile('src/components/preview/sections/AcPreview.jsx', `
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
`);

writeFile('src/components/preview/sections/TechStackPreview.jsx', `
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
`);

writeFile('src/components/preview/sections/SchemaPreview.jsx', `
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
`);

writeFile('src/components/preview/sections/NfrPreview.jsx', `
import { usePrdStore } from '../../../store/usePrdStore';
export default function NfrPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  if (mode !== 'enterprise' && !se.nfr) return null;
  return (
    <div className="space-y-2 keep-together">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">4.2 NFR, Prototype & Analisis Risiko</h3>
      <div className="pl-3 space-y-2 text-xs text-slate-700">
        <p><strong className="text-slate-900">Keamanan:</strong> <span>{f.nfrSpecs || '-'}</span></p>
        <p><strong className="text-slate-900">Performance:</strong> <span>{f.nfrPerformance || '-'}</span></p>
        <p><strong className="text-slate-900">Lokalisasi:</strong> <span>{f.nfrLocalization || '-'}</span></p>
        <p><strong className="text-slate-900">Browser:</strong> <span>{f.nfrBrowser || '-'}</span></p>
        <p><strong className="text-slate-900">Figma:</strong> <span className="text-blue-600 underline font-mono">{f.figmaLink || '-'}</span></p>
        <p><strong className="text-slate-900">Risiko:</strong> <span>{f.riskMitigation || '-'}</span></p>
      </div>
    </div>
  );
}
`);

writeFile('src/components/preview/sections/ScopeDonePreview.jsx', `
import { usePrdStore } from '../../../store/usePrdStore';
export default function ScopeDonePreview() {
  const f = usePrdStore(function (s) { return s.fields; });
  const oos = (f.outOfScope || '').trim();
  const dod = (f.defOfDone || '').trim();
  const oosI = oos ? oos.split('\\n').filter(function (x) { return x.trim(); }) : [];
  const dodI = dod ? dod.split('\\n').filter(function (x) { return x.trim(); }) : [];
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
`);

writeFile('src/components/preview/PreviewActions.jsx', `
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
        <FontAwesomeIcon icon={faEye} className="mr-1.5" />
        Live Preview Dokumen
        <span className={'ml-2 px-2 py-0.5 rounded text-[10px] border ' + badge}>
          {mode === 'enterprise' ? 'ENTERPRISE' : 'SIMPLE'} MODE
        </span>
      </span>
      <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:flex-wrap sm:items-center">
        <IconButton icon={faFileExport} onClick={function () { exportService.exportJSON(getSnap()); showToast('JSON berhasil diunduh'); }} className="w-full sm:w-auto">JSON</IconButton>
        <IconButton icon={faFileImport} onClick={function () { ref.current && ref.current.click(); }} className="w-full sm:w-auto">Impor</IconButton>
        <input ref={ref} type="file" accept=".json" className="hidden" onChange={handleImport} />
        <IconButton icon={faCopy} onClick={function () { exportService.copyMarkdown(getSnap()); showToast('Markdown disalin'); }} className="col-span-2 w-full sm:w-auto">Salin Markdown</IconButton>
        <IconButton icon={faPrint} onClick={function () { exportService.printDocument(); }} variant="primary" className="col-span-2 w-full sm:w-auto">Ekspor PDF / Cetak</IconButton>
      </div>
    </div>
  );
}
`);

writeFile('src/components/preview/PreviewDocument.jsx', `
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
        <div className="p-3 bg-slate-100 rounded border border-slate-200 font-mono text-xs text-slate-800">{f.userFlow ? f.userFlow.split('->').join(' \\u27A4 ') : 'Belum ada alur pengguna.'}</div>
      </div>
      <TechStackPreview /><SchemaPreview /><NfrPreview /><ScopeDonePreview />
    </div>
  );
}
`);

writeFile('src/components/preview/PreviewPanel.jsx', `
import PreviewActions from './PreviewActions';
import PreviewDocument from './PreviewDocument';
export default function PreviewPanel() {
  return (
    <section id="previewPanel" className="bg-slate-950 p-6 overflow-y-auto" style={{ height: '100%' }}>
      <PreviewActions /><PreviewDocument />
    </section>
  );
}
`);

writeFile('src/components/mobile/MobileTabBar.jsx', `
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
`);

writeFile('src/components/mobile/ScrollButtons.jsx', `
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useViewStore } from '../../store/useViewStore';

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
    const top = el.scrollTop <= 8;
    setAtTop(function (prev) {
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
    const editor = getEl('editor');
    const preview = getEl('preview');

    function onScroll(panel) {
      if (autoScroll.current[panel]) return;
      updateIcon(panel);
    }
    const eh = function () { onScroll('editor'); };
    const ph = function () { onScroll('preview'); };
    if (editor) editor.addEventListener('scroll', eh, { passive: true });
    if (preview) preview.addEventListener('scroll', ph, { passive: true });

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
      if (editor) editor.removeEventListener('scroll', eh);
      if (preview) preview.removeEventListener('scroll', ph);
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
`);

writeFile('src/App.jsx', `
import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { usePrdStore } from './store/usePrdStore';
import { storageService } from './services/storageService';
import Header from './components/header/Header';
import EditorPanel from './components/editor/EditorPanel';
import PreviewPanel from './components/preview/PreviewPanel';
import MobileTabBar from './components/mobile/MobileTabBar';
import ScrollButtons from './components/mobile/ScrollButtons';
import ToastContainer from './components/shared/Toast';

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
      <Header />
      <main className="flex-grow min-h-0 overflow-hidden relative">
        <div id="panelSlider">
          <div><EditorPanel /></div>
          <div><PreviewPanel /></div>
        </div>
        <ScrollButtons />
      </main>
      <MobileTabBar />
      <ToastContainer />
    </div>
  );
}
`);

writeFile('src/main.jsx', `
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`);

console.log('\n' + '='.repeat(60));
console.log('\x1b[32m🎉 Setup selesai!\x1b[0m');
console.log('\nJalankan perintah berikut:');
console.log('  \x1b[36mnpm run dev\x1b[0m');
console.log('\nKemudian buka \x1b[36mhttp://localhost:5173\x1b[0m di browser.');
console.log('='.repeat(60) + '\n');