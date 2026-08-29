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