import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function read(rel) {
  const abs = path.join(ROOT, rel);

  if (!fs.existsSync(abs)) {
    throw new Error('File tidak ditemukan: ' + rel);
  }

  return fs.readFileSync(abs, 'utf8');
}

function write(rel, content) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log('Menulis: ' + rel);
}

function remove(rel) {
  const abs = path.join(ROOT, rel);

  if (fs.existsSync(abs)) {
    fs.rmSync(abs);
    console.log('Menghapus: ' + rel);
  }
}

/* ============================================================
   src/utils/sectionNotes.js
   ============================================================ */

const SECTION_NOTES_UTIL = `export const SECTION_TITLES = {
  coverFooter: 'Sampul & Footer Dokumen',
  projectInfo: 'Informasi Proyek & Metadata',
  problemGoal: 'Masalah & Tujuan',
  persona: 'Target User Persona & KPI Sukses',
  branding: 'Branding & Design System',
  roles: 'Role & Permission Matrix',
  features: 'Fitur Utama',
  ac: 'Acceptance Criteria',
  techStack: 'Tech Stack & Arsitektur',
  schema: 'Schema Data',
  nfr: 'NFR, Keamanan & Figma',
  outOfScope: 'Out of Scope & Definition of Done',
};

export const isSectionVisible = function (key, mode, simpleExtras) {
  const se = simpleExtras || {};

  if (key === 'persona') {
    return mode === 'enterprise' || se.persona === true;
  }

  if (key === 'branding') {
    return mode === 'enterprise' || se.branding === true;
  }

  if (key === 'roles') {
    return mode === 'enterprise' || se.roles === true;
  }

  if (key === 'ac') {
    return mode === 'enterprise' || se.ac === true;
  }

  if (key === 'schema') {
    return mode === 'enterprise' || se.schema === true;
  }

  if (key === 'nfr') {
    return mode === 'enterprise' || se.nfr === true;
  }

  return true;
};

export const getSectionNote = function (state, key) {
  const fields = state.fields || {};
  const enabledMap = fields.sectionNotesEnabled || {};
  const notesMap = fields.sectionNotes || {};
  const importantMap = fields.sectionNotesImportant || {};

  if (enabledMap[key] !== true) return null;
  if (!isSectionVisible(key, state.mode, state.simpleExtras)) return null;

  const text = (notesMap[key] || '').trim();
  if (!text) return null;

  return {
    text: text,
    important: importantMap[key] === true,
  };
};

export const getNoteKeyByTitle = function (title) {
  if (!title) return '';

  if (title.includes('Sampul & Footer')) return 'coverFooter';
  if (title.includes('Informasi Proyek')) return 'projectInfo';
  if (title.includes('Masalah & Tujuan')) return 'problemGoal';
  if (title.includes('Target User Persona')) return 'persona';
  if (title.includes('Branding & Design System')) return 'branding';
  if (title.includes('Role & Permission')) return 'roles';
  if (title.includes('Fitur Utama')) return 'features';
  if (title.includes('Acceptance Criteria')) return 'ac';
  if (title.includes('Tech Stack')) return 'techStack';
  if (title.includes('Schema Data')) return 'schema';
  if (title.includes('NFR')) return 'nfr';
  if (title.includes('Out of Scope')) return 'outOfScope';

  return '';
};
`;

/* ============================================================
   src/components/editor/SectionNote.jsx
   ============================================================ */

const SECTION_NOTE = `import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';
import ToggleSwitch from '../shared/ToggleSwitch';
import { SECTION_TITLES, isSectionVisible } from '../../utils/sectionNotes';

export default function SectionNote(props) {
  const noteKey = props.noteKey;

  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  const mode = usePrdStore(function (s) { return s.mode; });
  const simpleExtras = usePrdStore(function (s) { return s.simpleExtras; });
  const commit = usePrdStore(function (s) { return s.commitHistory; });

  if (!isSectionVisible(noteKey, mode, simpleExtras)) return null;

  const title = SECTION_TITLES[noteKey] || noteKey;
  const enabledMap = f.sectionNotesEnabled || {};
  const notesMap = f.sectionNotes || {};
  const importantMap = f.sectionNotesImportant || {};
  const enabled = enabledMap[noteKey] === true;
  const important = importantMap[noteKey] === true;
  const value = notesMap[noteKey] || '';

  function handleToggle(v) {
    set('sectionNotesEnabled', Object.assign({}, enabledMap, {
      [noteKey]: v,
    }));
    commit();
  }

  function handleImportant(v) {
    set('sectionNotesImportant', Object.assign({}, importantMap, {
      [noteKey]: v,
    }));
    commit();
  }

  function handleChange(e) {
    set('sectionNotes', Object.assign({}, notesMap, {
      [noteKey]: e.target.value,
    }));
  }

  const boxCls = important
    ? 'mt-4 rounded-lg border border-dashed border-danger/50 bg-danger/5 p-3 space-y-2'
    : 'mt-4 rounded-lg border border-dashed border-accent/40 bg-accent/5 p-3 space-y-2';

  return (
    <div className={boxCls}>
      <ToggleSwitch
        checked={enabled}
        onChange={handleToggle}
        label={'Catatan section: ' + title}
        icon={<FontAwesomeIcon icon={faCircleInfo} />}
        iconColor={important ? 'text-danger' : 'text-accent'}
      />

      {enabled && (
        <div className="space-y-2">
          <div>
            <label htmlFor={'section-note-' + noteKey} className="sr-only">
              {'Catatan untuk ' + title}
            </label>

            <textarea
              id={'section-note-' + noteKey}
              value={value}
              onChange={handleChange}
              rows="2"
              maxLength={500}
              placeholder="Tulis catatan: asumsi, aturan teknis, TODO, atau reminder untuk tim."
              className="w-full bg-field border border-line rounded-lg p-2.5 text-xs text-ink focus:border-accent focus:outline-none resize-none"
            />

            <p className="text-[10px] text-mut">{value.length}/500</p>
          </div>

          <ToggleSwitch
            checked={important}
            onChange={handleImportant}
            label="Tandai sebagai catatan penting"
            icon={<FontAwesomeIcon icon={faCircleExclamation} />}
            iconColor="text-danger"
          />

          <p className="text-[10px] text-mut">
            {important
              ? 'Di dokumen, catatan ini tampil dengan aksen merah dan label Penting.'
              : 'Di dokumen, catatan ini tampil dengan aksen emas dan label Catatan.'}
          </p>
        </div>
      )}
    </div>
  );
}
`;

/* ============================================================
   src/components/preview/sections/NotePreview.jsx
   ============================================================ */

const NOTE_PREVIEW = `import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
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
      style={{ borderLeftColor: '#C9A961' }}
    >
      <p className="text-slate-700 leading-relaxed">
        <strong className="font-bold text-slate-900">Catatan:</strong>{' '}
        <span className="whitespace-pre-wrap">{note.text}</span>
      </p>
    </div>
  );
}
`;

/* ============================================================
   src/components/editor/EditorSection.jsx
   ============================================================ */

const EDITOR_SECTION = `import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SectionNote from './SectionNote';
import { getNoteKeyByTitle } from '../../utils/sectionNotes';

export default function EditorSection(props) {
  const title = props.title;
  const icon = props.icon;
  const action = props.action;
  const children = props.children;
  const noteKey = props.noteKey || getNoteKeyByTitle(title);

  return (
    <div className="bg-card p-5 rounded-xl border border-line space-y-4">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider flex items-center text-ink">
          {icon && <FontAwesomeIcon icon={icon} className="mr-2 text-accent" />}
          {title}
        </h2>
        {action}
      </div>

      {children}

      {noteKey ? <SectionNote noteKey={noteKey} /> : null}
    </div>
  );
}
`;

/* ============================================================
   src/components/editor/EditorPanel.jsx
   ============================================================ */

const EDITOR_PANEL = `import { useEffect } from 'react';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useAutoResize } from '../../hooks/useAutoResize';

import ModeBanner from './ModeBanner';
import ExtrasPicker from './ExtrasPicker';
import AiAnalysisCard from './AiAnalysisCard';

import ProjectInfo from './sections/ProjectInfo';
import ProblemGoal from './sections/ProblemGoal';
import PersonaSection from './sections/PersonaSection';
import BrandingSection from './sections/BrandingSection';
import CoverFooterSection from './sections/CoverFooterSection';
import RolesSection from './sections/RolesSection';
import FeaturesList from './sections/FeaturesList';
import AcSection from './sections/AcSection';
import TechStack from './sections/TechStack';
import SchemaSection from './sections/SchemaSection';
import NfrSection from './sections/NfrSection';
import OutOfScope from './sections/OutOfScope';

function AutoSaveBridge() {
  useAutoSave();
  return null;
}

export default function EditorPanel() {
  const ra = useAutoResize();

  useEffect(function () {
    function onInput(e) {
      if (e.target.tagName === 'TEXTAREA') ra.resize(e.target);
    }

    document.addEventListener('input', onInput);

    return function () {
      document.removeEventListener('input', onInput);
    };
  }, [ra.resize]);

  return (
    <section
      id="editorPanel"
      className="p-4 md:p-6 overflow-y-auto no-print space-y-6 border-r border-line bg-base"
      style={{ height: '100%' }}
    >
      <AutoSaveBridge />

      <ModeBanner />

      <ExtrasPicker />

      <AiAnalysisCard />

      <CoverFooterSection />

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
`;

/* ============================================================
   src/components/preview/PreviewDocument.jsx
   ============================================================ */

const PREVIEW_DOCUMENT = `import { usePreviewStore as usePrdStore } from '../../store/usePreviewStore';
import { resolveCoverTheme } from '../../utils/helpers';

import CoverPage from './CoverPage';
import DocFooter from './DocFooter';

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
import NotePreview from './sections/NotePreview';

export default function PreviewDocument() {
  const f = usePrdStore(function (s) { return s.fields; });
  const palette = usePrdStore(function (s) { return s.palette; });

  const theme = resolveCoverTheme(f, palette);

  return (
    <>
      <CoverPage />

      <div
        id="prdDocument"
        className="bg-white text-slate-900 p-8 rounded-lg border border-slate-200 text-sm space-y-6 max-w-2xl mx-auto w-full h-auto mb-12"
        style={{
          '--doc-primary': theme.primary,
          '--doc-primary-text': theme.primaryText,
          '--doc-accent': theme.accent,
          '--doc-accent-text': theme.accentText,
        }}
      >
        <NotePreview noteKey="coverFooter" />
        <NotePreview noteKey="projectInfo" />

        <OverviewPreview />
        <NotePreview noteKey="problemGoal" />

        <PersonaPreview />
        <NotePreview noteKey="persona" />

        <BrandingPreview />
        <NotePreview noteKey="branding" />

        <RolesPreview />
        <NotePreview noteKey="roles" />

        <FeaturesPreview />
        <NotePreview noteKey="features" />

        <AcPreview />
        <NotePreview noteKey="ac" />

        <div className="space-y-2 keep-together">
          <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">
            3. Alur Pengguna (User Flow)
          </h3>

          <div className="p-3 bg-slate-100 rounded border border-slate-200 font-mono text-xs text-slate-800">
            {f.userFlow ? f.userFlow.split('->').join(' \\u27A4 ') : 'Belum ada alur pengguna.'}
          </div>
        </div>

        <TechStackPreview />
        <NotePreview noteKey="techStack" />

        <SchemaPreview />
        <NotePreview noteKey="schema" />

        <NfrPreview />
        <NotePreview noteKey="nfr" />

        <ScopeDonePreview />
        <NotePreview noteKey="outOfScope" />

        <DocFooter />
      </div>
    </>
  );
}
`;

/* ============================================================
   src/utils/constants.js
   ============================================================ */

const CONSTANTS = `import { faServer, faDatabase, faCloud, faGlobe, faCodeBranch, faShieldHalved, faHardDrive, faPlug, faInfinity, faBolt, faEnvelopeOpenText, faChartLine, faChartColumn, faFlask, faRobot } from '@fortawesome/free-solid-svg-icons';
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

const ICON_TONE = 'text-mut';

export const TECH_REQUIRED = [
  { key: 'techFrontend', label: 'Frontend', icon: faHtml5, color: ICON_TONE, ph: 'misal: React, Tailwind CSS' },
  { key: 'techBackend', label: 'Backend', icon: faServer, color: ICON_TONE, ph: 'misal: Node.js, Laravel' },
  { key: 'techDatabase', label: 'Database', icon: faDatabase, color: ICON_TONE, ph: 'misal: PostgreSQL, Redis' },
  { key: 'techInfra', label: 'Infrastructure & Cloud Hosting', icon: faCloud, color: ICON_TONE, ph: 'misal: Vercel, AWS, Docker' },
  { key: 'techDomain', label: 'Domain & DNS Management', icon: faGlobe, color: ICON_TONE, ph: 'misal: Niagahoster, Cloudflare DNS' },
  { key: 'techVcs', label: 'Version Control System', icon: faCodeBranch, color: ICON_TONE, ph: 'misal: GitHub, GitLab' },
];

export const TECH_OPTIONAL = [
  { key: 'techSecurity', label: 'Security & Authentication', icon: faShieldHalved, color: ICON_TONE, category: 'Esensial', ph: 'misal: OAuth 2.0, JWT, bcrypt' },
  { key: 'techStorage', label: 'Object Storage & CDN', icon: faHardDrive, color: ICON_TONE, category: 'Esensial', ph: 'misal: AWS S3 + CloudFront, Cloudflare R2' },
  { key: 'techThirdParty', label: 'Third-Party APIs / Integrations', icon: faPlug, color: ICON_TONE, category: 'Esensial', ph: 'misal: Midtrans, Firebase Auth' },
  { key: 'techAi', label: 'AI / LLM & Machine Learning', icon: faRobot, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: OpenAI GPT-4, Gemini, LangChain, HuggingFace' },
  { key: 'techDevOps', label: 'CI/CD & DevOps', icon: faInfinity, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: GitHub Actions, GitLab CI' },
  { key: 'techCaching', label: 'Caching Layer', icon: faBolt, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: Redis, Memcached' },
  { key: 'techQueue', label: 'Message Brokers / Queueing', icon: faEnvelopeOpenText, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: RabbitMQ, Kafka' },
  { key: 'techMonitoring', label: 'Monitoring, Logging, & Error Tracking', icon: faChartLine, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: Sentry, Grafana' },
  { key: 'techAnalytics', label: 'Analytics & Data Pipeline', icon: faChartColumn, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: Google Analytics, Metabase' },
  { key: 'techTesting', label: 'Testing / QA Automation', icon: faFlask, color: ICON_TONE, category: 'Lanjutan', ph: 'misal: Vitest, Playwright' },
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

export const SECTION_NOTE_KEYS = [
  'coverFooter',
  'projectInfo',
  'problemGoal',
  'persona',
  'branding',
  'roles',
  'features',
  'ac',
  'techStack',
  'schema',
  'nfr',
  'outOfScope',
];

export const DEFAULT_SECTION_NOTES = SECTION_NOTE_KEYS.reduce(function (acc, key) {
  acc[key] = '';
  return acc;
}, {});

export const DEFAULT_SECTION_NOTES_ENABLED = SECTION_NOTE_KEYS.reduce(function (acc, key) {
  acc[key] = false;
  return acc;
}, {});

export const DEFAULT_SECTION_NOTES_IMPORTANT = SECTION_NOTE_KEYS.reduce(function (acc, key) {
  acc[key] = false;
  return acc;
}, {});

export const DEFAULT_FIELDS = {
  projectName:'',docVersion:'1.0',docStatus:'Draft',author:'',targetDate:'',targetDateFormat:'full',
  problemStatement:'',productGoal:'',userPersona:'',successMetrics:'',
  brandTypography:'',brandLayout:'',
  bpMobileOp:'≤',bpMobile:'',bpMobileUnit:'px',
  bpTabletOp:'≤',bpTablet:'',bpTabletUnit:'px',
  bpDesktopOp:'≥',bpDesktop:'',bpDesktopUnit:'px',
  userFlow:'',
  techFrontend:'',techBackend:'',techDatabase:'',techInfra:'',techDomain:'',techVcs:'',
  techSecurity:'',techStorage:'',techThirdParty:'',techAi:'',techDevOps:'',techCaching:'',
  techQueue:'',techMonitoring:'',techAnalytics:'',techTesting:'',
  dbSchema:'',
  nfrSpecs:'',nfrPerformance:'',nfrLocalization:'',nfrBrowser:'',figmaLink:'',riskMitigation:'',
  outOfScope:'',defOfDone:'',
  coverThemeAuto:true,coverPrimary:'#C9A961',coverAccent:'#AB883A',coverBg:'#15171C',
  coverKicker:'',coverFooterNote:'',coverShowFooter:true,
  coverSubtitle:'',
  sectionNotes: { ...DEFAULT_SECTION_NOTES },
  sectionNotesEnabled: { ...DEFAULT_SECTION_NOTES_ENABLED },
  sectionNotesImportant: { ...DEFAULT_SECTION_NOTES_IMPORTANT },
};

export const INITIAL_SIMPLE_EXTRAS = EXTRAS_DEFINITIONS.reduce(function (a, d) {
  const o = Object.assign({}, a);
  o[d.key] = false;
  return o;
}, {});
`;

/* ============================================================
   src/utils/markdown.js
   ============================================================ */

const MARKDOWN = `import { buildBreakpoints, formatTargetDate } from './helpers';
import { TECH_REQUIRED, TECH_OPTIONAL } from './constants';
import { getSectionNote } from './sectionNotes';

const BT = String.fromCharCode(96);
const FENCE = BT + BT + BT;

const isVis = function (mode, extras, key) {
  return mode === 'enterprise' || extras[key] === true;
};

const noteBlock = function (state, key) {
  const note = getSectionNote(state, key);

  if (!note) return '';

  const label = note.important ? 'Penting' : 'Catatan';
  const parts = note.text.split('\\n');

  let block = '> **' + label + ':** ' + parts[0] + '\\n';

  for (let i = 1; i < parts.length; i++) {
    block += '> ' + parts[i] + '\\n';
  }

  return block + '\\n';
};

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

  let feat = '| ID | Fitur | Deskripsi | Prioritas |\\n|---|---|---|---|\\n';

  features.forEach(function (ft) {
    feat += '| ' + ft.id + ' | ' + ft.name + ' | ' + ft.story + ' | ' + ft.priority + ' |\\n';
  });

  let out = '# ' + title + '\\n**Product Requirement Document (' + mode.toUpperCase() + ')**\\n\\n';

  out += '**Author:** ' + f.author + ' | **Version:** ' + f.docVersion + ' | **Target:** ' + date + '\\n\\n';

  out += noteBlock(state, 'coverFooter');
  out += noteBlock(state, 'projectInfo');

  out += '## 1. Overview & Goals\\n- **Problem:** ' + f.problemStatement + '\\n- **Goal:** ' + f.productGoal + '\\n\\n';
  out += noteBlock(state, 'problemGoal');

  if (isVis(mode, se, 'persona')) {
    out += '## 1.1 Target User Persona & Metrics\\n- **Persona:** ' + f.userPersona + '\\n- **Success KPI:** ' + f.successMetrics + '\\n\\n';
    out += noteBlock(state, 'persona');
  }

  if (isVis(mode, se, 'branding') && (palette.length || f.brandTypography)) {
    const bp = buildBreakpoints(f);

    out += '## 1.2 Branding & Design System\\n';
    out += palette.map(function (p) {
      return '- **' + p.name + '** ' + BT + p.hex + BT + ' : ' + p.usage;
    }).join('\\n');

    out += '\\n\\n**Typography:** ' + f.brandTypography + '\\n**Layout:** ' + f.brandLayout + '\\n';

    if (bp) out += '**Breakpoint:** ' + bp + '\\n';

    out += '\\n';
    out += noteBlock(state, 'branding');
  }

  if (isVis(mode, se, 'roles') && roles.length) {
    out += '## 1.3 Role & Permission Matrix\\n';

    out += roles.map(function (r) {
      return (
        '### ' + r.name + '\\n- \\u2705 ' +
        r.can.split('\\n').filter(function (x) { return x.trim(); }).join(' | ') +
        '\\n- \\u274c ' +
        r.cannot.split('\\n').filter(function (x) { return x.trim(); }).join(' | ')
      );
    }).join('\\n\\n');

    out += '\\n\\n';
    out += noteBlock(state, 'roles');
  }

  out += '## 2. Core Features (Requirements)\\n' + feat + '\\n';
  out += noteBlock(state, 'features');

  if (isVis(mode, se, 'ac') && acModules.length) {
    out += '## 2.1 Acceptance Criteria per Modul\\n';

    out += acModules.map(function (m, mi) {
      return (
        '### ' + (mi + 1) + '. ' + m.title + '\\n' +
        m.items.map(function (it, ii) {
          return '- **AC-' + (mi + 1) + '.' + (ii + 1) + ' ' + it.title + '**: ' + it.desc;
        }).join('\\n')
      );
    }).join('\\n\\n');

    out += '\\n\\n';
    out += noteBlock(state, 'ac');
  }

  out += '## 3. User Flow\\n' + BT + f.userFlow + BT + '\\n\\n';

  out += '## 4. Detailed Tech Stack & Architecture\\n';

  TECH_REQUIRED.forEach(function (d) {
    out += '- **' + d.label + ':** ' + (f[d.key] || '-') + '\\n';
  });

  TECH_OPTIONAL.forEach(function (d) {
    if (techOptional.includes(d.key)) {
      out += '- **' + d.label + ':** ' + (f[d.key] || '-') + '\\n';
    }
  });

  out += '\\n' + FENCE + 'sql\\n' + f.dbSchema + '\\n' + FENCE + '\\n\\n';
  out += noteBlock(state, 'techStack');

  if (isVis(mode, se, 'schema') && schemaTables.length) {
    out += '## 4.1 Schema Data\\n';

    out += schemaTables.map(function (t) {
      let s = '### Tabel: ' + (t.name || 'tanpa_nama') + '\\n';

      if (t.desc) s += '> ' + t.desc + '\\n';

      s += '| Field | Tipe | Not Null | Keterangan |\\n|---|---|---|---|\\n';

      s += t.fields.map(function (c) {
        return '| ' + c.field + ' | ' + c.type + ' | ' + c.required + ' | ' + c.note + ' |';
      }).join('\\n');

      return s;
    }).join('\\n\\n');

    out += '\\n\\n';
    out += noteBlock(state, 'schema');
  }

  if (isVis(mode, se, 'nfr')) {
    out += '## 4.2 NFR, Prototype & Risk Analysis\\n';
    out += '- **Keamanan:** ' + f.nfrSpecs + '\\n';
    out += '- **Performance:** ' + f.nfrPerformance + '\\n';
    out += '- **Lokalisasi:** ' + f.nfrLocalization + '\\n';
    out += '- **Browser:** ' + f.nfrBrowser + '\\n';
    out += '- **Figma Link:** ' + f.figmaLink + '\\n';
    out += '- **Risk & Mitigation:** ' + f.riskMitigation + '\\n\\n';
    out += noteBlock(state, 'nfr');
  }

  out += '## 5. Out of Scope\\n' + f.outOfScope + '\\n\\n';
  out += '## 6. Definition of Done\\n' + f.defOfDone;
  out += noteBlock(state, 'outOfScope');

  return out;
};
`;

/* ============================================================
   PATCH OPSIONAL: src/store/usePrdStore.js
   Membersihkan sisa patch versi 1 jika pernah dipasang.
   ============================================================ */

function patchStore() {
  const rel = 'src/store/usePrdStore.js';
  let content = read(rel);
  let changed = false;

  const oldImportWithNotes = "import { DEFAULT_FIELDS, INITIAL_SIMPLE_EXTRAS, MAX_HISTORY, DEFAULT_SECTION_NOTES } from '../utils/constants';";
  const newImportWithNotesEnabled = "import { DEFAULT_FIELDS, INITIAL_SIMPLE_EXTRAS, MAX_HISTORY, DEFAULT_SECTION_NOTES, DEFAULT_SECTION_NOTES_ENABLED, DEFAULT_SECTION_NOTES_IMPORTANT } from '../utils/constants';";

  if (content.includes('DEFAULT_SECTION_NOTES') && !content.includes('DEFAULT_SECTION_NOTES_IMPORTANT')) {
    if (content.includes(oldImportWithNotes)) {
      content = content.replace(oldImportWithNotes, newImportWithNotesEnabled);
      changed = true;
    }
  }

  const oldSampleBlock = /sectionNotes:\s*\{\s*\.\.\.DEFAULT_SECTION_NOTES\s*\},\s*showSectionNotes:\s*false,\s*includeNotesInDocument:\s*false,/;

  if (oldSampleBlock.test(content)) {
    content = content.replace(
      oldSampleBlock,
      'sectionNotes: { ...DEFAULT_SECTION_NOTES },\n           sectionNotesEnabled: { ...DEFAULT_SECTION_NOTES_ENABLED },\n           sectionNotesImportant: { ...DEFAULT_SECTION_NOTES_IMPORTANT },'
    );

    changed = true;
  }

  if (changed) {
    write(rel, content);
  } else {
    console.log('Store tidak perlu diubah, atau sudah bersih.');
  }
}

/* ============================================================
   JALANKAN SEMUA
   ============================================================ */

try {
  remove('src/components/editor/SectionNotesControls.jsx');

  write('src/utils/sectionNotes.js', SECTION_NOTES_UTIL);
  write('src/utils/constants.js', CONSTANTS);
  write('src/utils/markdown.js', MARKDOWN);

  write('src/components/editor/SectionNote.jsx', SECTION_NOTE);
  write('src/components/editor/EditorSection.jsx', EDITOR_SECTION);
  write('src/components/editor/EditorPanel.jsx', EDITOR_PANEL);

  write('src/components/preview/sections/NotePreview.jsx', NOTE_PREVIEW);
  write('src/components/preview/PreviewDocument.jsx', PREVIEW_DOCUMENT);

  patchStore();

  console.log('');
  console.log('Selesai.');
  console.log('Catatan biasa tampil dengan aksen emas dan label Catatan.');
  console.log('Catatan penting tampil dengan aksen merah dan label Penting.');
} catch (err) {
  console.error('Gagal menerapkan patch.');
  console.error(err.message);
  process.exit(1);
}