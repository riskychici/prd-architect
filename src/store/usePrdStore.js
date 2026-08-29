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
            dbSchema: 'users: id, email, password_hash, role\nproperties: id, nama, price, status',
            outOfScope: 'Upload gambar\nPembayaran online',
            defOfDone: 'Semua AC terpenuhi\nTidak ada bug critical\nResponsive',
            userPersona: 'Agen internal, Superadmin, pengunjung publik',
            successMetrics: 'Lighthouse >= 85',
            brandTypography: 'Inter atau Geist',
            brandLayout: 'Compact, mobile-responsive',
            bpMobileOp: '\u2264', bpMobile: '640', bpMobileUnit: 'px',
            bpTabletOp: '\u2264', bpTablet: '1024', bpTabletUnit: 'px',
            bpDesktopOp: '\u2265', bpDesktop: '1024', bpDesktopUnit: 'px',
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
            { name: 'Admin', can: 'View listing\nFilter', cannot: 'CRUD properti' },
            { name: 'Superadmin', can: 'Full CRUD\nManage users', cannot: '-' },
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
