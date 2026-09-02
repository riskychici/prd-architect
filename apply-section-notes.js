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

function indentOf(line) {
  const m = line.match(/^\s*/);
  return m ? m[0] : '';
}

function insertAfter(lines, marker, newLines) {
  const idx = lines.findIndex(function (line) {
    return line.includes(marker);
  });

  if (idx === -1) return lines;

  return lines
    .slice(0, idx + 1)
    .concat(newLines)
    .concat(lines.slice(idx + 1));
}

function insertBefore(lines, marker, newLines) {
  const idx = lines.findIndex(function (line) {
    return line.includes(marker);
  });

  if (idx === -1) return lines;

  return lines
    .slice(0, idx)
    .concat(newLines)
    .concat(lines.slice(idx));
}

function insertNoteAfter(lines, marker, keys) {
  const idx = lines.findIndex(function (line) {
    return line.includes(marker);
  });

  if (idx === -1) return lines;

  const indent = indentOf(lines[idx]);
  const inserts = keys.map(function (key) {
    return indent + "out += noteBlock(state, '" + key + "');";
  });

  return lines
    .slice(0, idx + 1)
    .concat(inserts)
    .concat(lines.slice(idx + 1));
}

function insertNoteBefore(lines, marker, keys) {
  const idx = lines.findIndex(function (line) {
    return line.includes(marker);
  });

  if (idx === -1) return lines;

  const indent = indentOf(lines[idx]);
  const inserts = keys.map(function (key) {
    return indent + "out += noteBlock(state, '" + key + "');";
  });

  return lines
    .slice(0, idx)
    .concat(inserts)
    .concat(lines.slice(idx));
}

/* ============================================================
   1. FILE BARU: src/utils/sectionNotes.js
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

export const getVisibleSectionNote = function (state, key) {
  const fields = state.fields || {};

  if (fields.includeNotesInDocument !== true) return '';
  if (!isSectionVisible(key, state.mode, state.simpleExtras)) return '';

  const notes = fields.sectionNotes || {};
  return (notes[key] || '').trim();
};
`;

/* ============================================================
   2. FILE BARU: src/components/editor/SectionNotesControls.jsx
   ============================================================ */

const SECTION_NOTES_CONTROLS = `import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';
import ToggleSwitch from '../shared/ToggleSwitch';

export default function SectionNotesControls() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  const commit = usePrdStore(function (s) { return s.commitHistory; });

  return (
    <div className="bg-card p-5 rounded-xl border border-line space-y-4">
      <div>
        <h2 className="text-sm font-bold text-ink uppercase tracking-wider flex items-center">
          <FontAwesomeIcon icon={faCircleInfo} className="mr-2 text-accent" />
          Catatan Section Opsional
        </h2>
        <p className="text-[11px] text-mut mt-1">
          Catatan internal untuk tiap section. Default mati dan tidak ikut dokumen final kecuali diaktifkan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
        <ToggleSwitch
          checked={!!f.showSectionNotes}
          onChange={function (v) {
            set('showSectionNotes', v);
            commit();
          }}
          label="Tampilkan catatan internal di editor"
        />

        <ToggleSwitch
          checked={!!f.includeNotesInDocument}
          onChange={function (v) {
            set('includeNotesInDocument', v);
            commit();
          }}
          label="Sertakan catatan penulis di dokumen final"
        />
      </div>

      <p className="text-[11px] text-mut">
        Jika hanya ingin catatan kerja untuk tim, aktifkan opsi pertama saja. Jika catatan ingin muncul di preview, print, atau Markdown, aktifkan opsi kedua.
      </p>
    </div>
  );
}
`;

/* ============================================================
   3. FILE BARU: src/components/editor/SectionNote.jsx
   ============================================================ */

const SECTION_NOTE = `import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';
import { SECTION_TITLES, isSectionVisible } from '../../utils/sectionNotes';

export default function SectionNote(props) {
  const sectionKey = props.sectionKey;

  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  const mode = usePrdStore(function (s) { return s.mode; });
  const simpleExtras = usePrdStore(function (s) { return s.simpleExtras; });

  const [open, setOpen] = useState(false);

  const sectionNotes = f.sectionNotes || {};
  const value = sectionNotes[sectionKey] || '';
  const showNotes = !!f.showSectionNotes;

  useEffect(function () {
    if (showNotes && value.trim() && !open) {
      setOpen(true);
    }
  }, [showNotes, value]);

  if (!showNotes) return null;
  if (!isSectionVisible(sectionKey, mode, simpleExtras)) return null;

  const title = SECTION_TITLES[sectionKey] || sectionKey;
  const inputId = 'section-note-' + sectionKey;

  function handleChange(e) {
    set('sectionNotes', Object.assign({}, sectionNotes, {
      [sectionKey]: e.target.value,
    }));
  }

  return (
    <div className="bg-card border border-dashed border-accent/40 rounded-xl p-4 space-y-2">
      <button
        type="button"
        onClick={function () { setOpen(!open); }}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 text-left"
      >
        <span className="text-[11px] font-semibold text-accent flex items-center gap-1.5">
          <FontAwesomeIcon icon={faCircleInfo} />
          Catatan Section: {title}
          {value.trim() ? ' (terisi)' : ''}
        </span>
        <span className="text-[10px] text-mut">
          {open ? 'Tutup' : 'Tulis'}
        </span>
      </button>

      {open && (
        <div className="space-y-1">
          <label htmlFor={inputId} className="sr-only">
            {'Catatan section ' + title}
          </label>

          <textarea
            id={inputId}
            value={value}
            onChange={handleChange}
            rows="2"
            maxLength={500}
            placeholder="Catatan internal: asumsi, TODO, pertanyaan, atau reminder untuk tim. Bagian ini tidak ikut dokumen final kecuali diaktifkan."
            className="w-full bg-field border border-line rounded-lg p-2.5 text-xs text-ink focus:border-accent focus:outline-none resize-none"
          />

          <p className="text-[10px] text-mut">
            {value.length}/500
          </p>
        </div>
      )}
    </div>
  );
}
`;

/* ============================================================
   4. FILE BARU: src/components/preview/sections/NotePreview.jsx
   ============================================================ */

const NOTE_PREVIEW = `import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
import { SECTION_TITLES, getVisibleSectionNote } from '../../../utils/sectionNotes';

export default function NotePreview(props) {
  const noteKey = props.noteKey;

  const fields = usePrdStore(function (s) { return s.fields; });
  const mode = usePrdStore(function (s) { return s.mode; });
  const simpleExtras = usePrdStore(function (s) { return s.simpleExtras; });

  const text = getVisibleSectionNote(
    {
      fields: fields,
      mode: mode,
      simpleExtras: simpleExtras,
    },
    noteKey
  );

  if (!text) return null;

  const title = SECTION_TITLES[noteKey] || noteKey;

  return (
    <div className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded text-xs space-y-1 keep-together">
      <p className="font-bold text-amber-800">
        Catatan Penulis: {title}
      </p>
      <p className="text-amber-900 whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}
`;

/* ============================================================
   PATCH 1: constants.js
   ============================================================ */

function patchConstants() {
  const rel = 'src/utils/constants.js';
  let content = read(rel);
  let changed = false;

  if (!content.includes('SECTION_NOTE_KEYS')) {
    const definitions = `export const SECTION_NOTE_KEYS = [
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

`;

    content = content.replace(
      /export const DEFAULT_FIELDS/,
      definitions + 'export const DEFAULT_FIELDS'
    );

    changed = true;
  }

  if (!content.includes('sectionNotes')) {
    content = content.replace(
      /coverSubtitle:\s*''\s*,?/,
      `coverSubtitle:'',
  sectionNotes: { ...DEFAULT_SECTION_NOTES },
  showSectionNotes: false,
  includeNotesInDocument: false,`
    );

    changed = true;
  }

  if (changed) {
    write(rel, content);
  } else {
    console.log('Sudah diterapkan: ' + rel);
  }
}

/* ============================================================
   PATCH 2: usePrdStore.js
   ============================================================ */

function patchStore() {
  const rel = 'src/store/usePrdStore.js';
  let content = read(rel);
  let changed = false;

  if (!content.includes('DEFAULT_SECTION_NOTES')) {
    content = content.replace(
      /import\s*\{\s*DEFAULT_FIELDS,\s*INITIAL_SIMPLE_EXTRAS,\s*MAX_HISTORY\s*\}\s*from\s*'\.\.\/utils\/constants';/,
      "import { DEFAULT_FIELDS, INITIAL_SIMPLE_EXTRAS, MAX_HISTORY, DEFAULT_SECTION_NOTES } from '../utils/constants';"
    );

    changed = true;
  }

  if (!content.includes('sectionNotes: { ...DEFAULT_SECTION_NOTES }')) {
    content = content.replace(
      /\}, keepCover\),/,
      `sectionNotes: { ...DEFAULT_SECTION_NOTES },
           showSectionNotes: false,
           includeNotesInDocument: false,
         }, keepCover),`
    );

    changed = true;
  }

  if (changed) {
    write(rel, content);
  } else {
    console.log('Sudah diterapkan: ' + rel);
  }
}

/* ============================================================
   PATCH 3: EditorPanel.jsx
   ============================================================ */

function patchEditorPanel() {
  const rel = 'src/components/editor/EditorPanel.jsx';
  let content = read(rel);
  let changed = false;

  if (!content.includes('SectionNotesControls')) {
    content = content.replace(
      "import AiAnalysisCard from './AiAnalysisCard';",
      "import AiAnalysisCard from './AiAnalysisCard';\nimport SectionNotesControls from './SectionNotesControls';\nimport SectionNote from './SectionNote';"
    );

    changed = true;
  }

  if (!content.includes('<SectionNotesControls />')) {
    content = content.replace(
      '<ModeBanner />',
      '<ModeBanner />\n       <SectionNotesControls />'
    );

    changed = true;
  }

  const notes = [
    ['CoverFooterSection', 'coverFooter'],
    ['ProjectInfo', 'projectInfo'],
    ['ProblemGoal', 'problemGoal'],
    ['PersonaSection', 'persona'],
    ['BrandingSection', 'branding'],
    ['RolesSection', 'roles'],
    ['FeaturesList', 'features'],
    ['AcSection', 'ac'],
    ['TechStack', 'techStack'],
    ['SchemaSection', 'schema'],
    ['NfrSection', 'nfr'],
    ['OutOfScope', 'outOfScope'],
  ];

  notes.forEach(function (pair) {
    const tag = pair[0];
    const key = pair[1];
    const marker = '<SectionNote sectionKey="' + key + '" />';

    if (!content.includes(marker)) {
      content = content.replace(
        '<' + tag + ' />',
        '<' + tag + ' />\n       <SectionNote sectionKey="' + key + '" />'
      );

      changed = true;
    }
  });

  if (changed) {
    write(rel, content);
  } else {
    console.log('Sudah diterapkan: ' + rel);
  }
}

/* ============================================================
   PATCH 4: PreviewDocument.jsx
   ============================================================ */

function patchPreviewDocument() {
  const rel = 'src/components/preview/PreviewDocument.jsx';
  let content = read(rel);
  let changed = false;

  if (!content.includes('NotePreview')) {
    content = content.replace(
      "import ScopeDonePreview from './sections/ScopeDonePreview';",
      "import ScopeDonePreview from './sections/ScopeDonePreview';\nimport NotePreview from './sections/NotePreview';"
    );

    changed = true;
  }

  if (!content.includes('<NotePreview noteKey="coverFooter" />')) {
    content = content.replace(
      /<OverviewPreview \/>\s*<PersonaPreview \/>\s*<BrandingPreview \/>\s*<RolesPreview \/>\s*<FeaturesPreview \/>\s*<AcPreview \/>/,
      `<NotePreview noteKey="coverFooter" />
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
         <NotePreview noteKey="ac" />`
    );

    changed = true;
  }

  if (!content.includes('<NotePreview noteKey="techStack" />')) {
    content = content.replace(
      /<TechStackPreview \/>\s*<SchemaPreview \/>\s*<NfrPreview \/>\s*<ScopeDonePreview \/>/,
      `<TechStackPreview />
         <NotePreview noteKey="techStack" />
         <SchemaPreview />
         <NotePreview noteKey="schema" />
         <NfrPreview />
         <NotePreview noteKey="nfr" />
         <ScopeDonePreview />
         <NotePreview noteKey="outOfScope" />`
    );

    changed = true;
  }

  if (changed) {
    write(rel, content);
  } else {
    console.log('Sudah diterapkan: ' + rel);
  }
}

/* ============================================================
   PATCH 5: markdown.js
   ============================================================ */

function patchMarkdown() {
  const rel = 'src/utils/markdown.js';
  let content = read(rel);

  if (content.includes('noteBlock')) {
    console.log('Sudah diterapkan: ' + rel);
    return;
  }

  let lines = content.split('\n');

  lines = insertAfter(
    lines,
    "import { TECH_REQUIRED, TECH_OPTIONAL } from './constants';",
    ["import { SECTION_TITLES, getVisibleSectionNote } from './sectionNotes';"]
  );

  const noteBlockCode = String.raw`const noteBlock = function (state, key) {
  const text = getVisibleSectionNote(state, key);
  if (!text) return '';
  const title = SECTION_TITLES[key] || key;
  const lines = text.split('\n').map(function (line) { return '> ' + line; }).join('\n');
  return '> **Catatan Penulis (' + title + '):**\n' + lines + '\n\n';
};`;

  lines = insertAfter(
    lines,
    'const isVis = function',
    noteBlockCode.trim().split('\n')
  );

  lines = insertNoteAfter(
    lines,
    "out += '**Author:** ' + f.author",
    ['coverFooter', 'projectInfo']
  );

  lines = insertNoteAfter(
    lines,
    "out += '## 1. Overview & Goals",
    ['problemGoal']
  );

  const personaIndex = lines.findIndex(function (line) {
    return line.includes("if (isVis(mode, se, 'persona')) out += ");
  });

  if (personaIndex !== -1) {
    const line = lines[personaIndex];
    const indent = indentOf(line);
    const outPart = line.substring(line.indexOf('out +='));

    const replacement = [
      indent + "if (isVis(mode, se, 'persona')) {",
      indent + '  ' + outPart,
      indent + "  out += noteBlock(state, 'persona');",
      indent + '}',
    ];

    lines = lines
      .slice(0, personaIndex)
      .concat(replacement)
      .concat(lines.slice(personaIndex + 1));
  }

  lines = insertNoteBefore(
    lines,
    "if (isVis(mode, se, 'roles') && roles.length) {",
    ['branding']
  );

  lines = insertNoteBefore(
    lines,
    "out += '## 2. Core Features (Requirements)",
    ['roles']
  );

  lines = insertNoteAfter(
    lines,
    "out += '## 2. Core Features (Requirements)",
    ['features']
  );

  lines = insertNoteBefore(
    lines,
    "out += '## 3. User Flow",
    ['ac']
  );

  lines = insertNoteAfter(
    lines,
    "FENCE + 'sql",
    ['techStack']
  );

  lines = insertNoteBefore(
    lines,
    "if (isVis(mode, se, 'nfr')) {",
    ['schema']
  );

  lines = insertNoteBefore(
    lines,
    "out += '## 5. Out of Scope",
    ['nfr']
  );

  lines = insertNoteAfter(
    lines,
    "out += '## 6. Definition of Done",
    ['outOfScope']
  );

  write(rel, lines.join('\n'));
}

/* ============================================================
   JALANKAN SEMUA PATCH
   ============================================================ */

try {
  write('src/utils/sectionNotes.js', SECTION_NOTES_UTIL);
  write('src/components/editor/SectionNotesControls.jsx', SECTION_NOTES_CONTROLS);
  write('src/components/editor/SectionNote.jsx', SECTION_NOTE);
  write('src/components/preview/sections/NotePreview.jsx', NOTE_PREVIEW);

  patchConstants();
  patchStore();
  patchEditorPanel();
  patchPreviewDocument();
  patchMarkdown();

  console.log('');
  console.log('Selesai.');
  console.log('Fitur catatan section opsional sudah diterapkan.');
  console.log('Jalankan npm run dev untuk melihat hasilnya.');
} catch (err) {
  console.error('Gagal menerapkan patch.');
  console.error(err.message);
  process.exit(1);
}