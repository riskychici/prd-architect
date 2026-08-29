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
    // Action untuk memanggil Gemini API & ekstraksi draf perbaikan
    analyzeWithAi: async function () {
      const state = get();
      const prdSnapshot = state.getSnapshot();

      set({ isAnalyzing: true, aiError: null });

      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
          throw new Error('VITE_GEMINI_API_KEY belum diisi pada file .env.local!');
        }

        const prompt = `Kamu adalah seorang System Analyst dan Senior Product Manager handal.
Analisis data PRD berikut.

TUGAS KAMU:
1. Berikan analisis dan saran perbaikan dalam bentuk teks Markdown yang rapi.
2. Di PALING AKHIR jawabanmu, sertakan blok kode JSON khusus dengan format:
\`\`\`json_draft
{
  "problemStatement": "isi draf problem statement saranmu jika yang ada masih kosong/kurang tepat",
  "productGoal": "isi draf product goal saranmu jika kosong",
  "userPersona": "isi draf user persona saranmu jika kosong",
  "outOfScope": "isi draf out of scope (dipisahkan baris)",
  "defOfDone": "isi draf definition of done (dipisahkan baris)"
}
\`\`\`

Data PRD saat ini:
${JSON.stringify(prdSnapshot, null, 2)}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Gagal memproses request ke Gemini API');
        }

        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Ekstraksi JSON Draft dari teks respons Gemini
        let extractedDraft = null;
        const match = rawText.match(/```json_draft\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          try {
            extractedDraft = JSON.parse(match[1]);
          } catch (e) {
            console.warn('Gagal parse JSON draft dari AI:', e);
          }
        }

        // Bersihkan teks Markdown agar blok json_draft tidak tampil di UI ulasan
        const cleanFeedback = rawText.replace(/```json_draft[\s\S]*?```/, '').trim();

        set({
          aiFeedback: cleanFeedback,
          aiDraft: extractedDraft,
          isAnalyzing: false
        });

        return cleanFeedback;
      } catch (err) {
        set({ aiError: err.message, isAnalyzing: false });
        throw err;
      }
    },
    // Action untuk memasukkan draf dari AI ke dalam fields PRD
    applyAiDraft: function () {
      const state = get();
      const draft = state.aiDraft;
      if (!draft) return false;

      set(function (s) {
        const newFields = { ...s.fields };
        Object.keys(draft).forEach((key) => {
          if (draft[key]) {
            newFields[key] = draft[key];
          }
        });

        return { fields: newFields, aiDraft: null };
      });

      // Simpan ke riwayat Undo/Redo
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
            bpMobileOp: '\u2264', bpMobile: '640', bpMobileUnit: 'px',
            bpTabletOp: '\u2264', bpTablet: '1024', bpTabletUnit: 'px',
            bpDesktopOp: '\u2265', bpDesktop: '1024', bpDesktopUnit: 'px',
            nfrSpecs: 'HTTPS/TLS 1.3, OAuth 2.0, rate limiting, enkripsi at-rest',
            nfrPerformance: 'FCP < 1.2s, feed load < 2s, kompresi media otomatis',
            nfrLocalization: 'Multi-bahasa (30+), format waktu & tanggal lokal',
            nfrBrowser: 'iOS 15+, Android 9+, Chrome/Safari/Edge',
            figmaLink: 'https://figma.com/file/instagram-clone',
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