export const SECTION_TITLES = {
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
