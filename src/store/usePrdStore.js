import { create } from 'zustand';
import { DEFAULT_FIELDS, INITIAL_SIMPLE_EXTRAS, MAX_HISTORY } from '../utils/constants';
import { buildAiPrompt } from '../utils/aiPrompts';

const init = function () {
  return {
    mode: 'simple', simpleExtras: { ...INITIAL_SIMPLE_EXTRAS }, fields: { ...DEFAULT_FIELDS },
    features: [], palette: [], roles: [], schemaTables: [], acModules: [], techOptional: [],
    history: [], historyIndex: -1, saveIndicator: '',
    aiFeedback: '', aiDraft: null, isAnalyzing: false, aiError: null,
    aiTypewriterActive: false,
  };
};

const stripNonUndo = function (snap) {
  const c = Object.assign({}, snap);
  delete c.mode;
  delete c.simpleExtras;
  return c;
};

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
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\$\$([^$]+)\$\$/g, '$1')
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/\\([_#%&])/g, '$1')
    .trim();
};

function extractAiDraft(fullText) {
  if (!fullText || typeof fullText !== 'string') return null;
  let match = fullText.match(/```json_draft\s*\n?([\s\S]*?)\n?\s*```/);
  if (match && match[1]) {
    try { return JSON.parse(match[1].trim()); } catch (e) {}
  }
  match = fullText.match(/`{3,}\s*json_draft\s*([\s\S]*?)\s*`{3,}/i);
  if (match && match[1]) {
    try { return JSON.parse(match[1].trim()); } catch (e) {}
  }
  const jsonMatch = fullText.match(/\{[\s\S]*?"fields"\s*:\s*\{[\s\S]*?\}\s*\}/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch (e) {}
  }
  return null;
}

// ============================================================
// DUAL MODEL GEMINI UNTUK ANALISIS PRD
// ============================================================
const GEMINI_PRIMARY_MODEL = 'gemini-3.5-flash-lite';
const GEMINI_FALLBACK_MODEL = 'gemini-3.1-flash-lite';

const describeGeminiError = function (err) {
  if (err && err.status === 429) {
    const m = err.message || '';
    if (m.includes('Quota exceeded') || m.includes('free_tier')) {
      return 'Kuota harian (Free Tier) Gemini API telah habis.';
    }
    return 'Batas penggunaan AI sedang penuh. Tunggu 30 detik lalu coba lagi.';
  }
  if (err && err.status >= 500) {
    return 'Server Gemini sedang bermasalah. Coba lagi sebentar lagi.';
  }
  if (err && !err.status && /fetch|network/i.test(err.message || '')) {
    return 'Koneksi ke server Gemini gagal. Periksa koneksi internetmu lalu coba lagi.';
  }
  return (err && err.message) || 'Gagal memproses request ke Gemini API';
};

const streamGeminiAnalysis = async function (apiKey, model, prompt, onDisplay) {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':streamGenerateContent?key=' + apiKey + '&alt=sse',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8192,
          topP: 0.95,
        }
      })
    }
  );

  if (!response.ok) {
    const errJson = await response.json().catch(function () { return {}; });
    const err = new Error(errJson.error && errJson.error.message ? errJson.error.message : '');
    err.status = response.status;
    throw err;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let lastUiPush = 0;

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
          fullText += textChunk;
          const now = performance.now();
          if (now - lastUiPush > 80) {
            lastUiPush = now;
            onDisplay(fullText);
          }
        } catch (e) {}
      }
    }
  }
  return fullText;
};

export const usePrdStore = create(function (set, get) {
  return {
    ...init(),

    setMode: function (mode) { set({ mode: mode }); },
    setField: function (key, value) { set(function (s) { return { fields: Object.assign({}, s.fields, { [key]: value }) }; }); },
    setSaveIndicator: function (t) { set({ saveIndicator: t }); },
    setAiTypewriterActive: function (v) { set({ aiTypewriterActive: v }); },
    setSchemaTables: function (tables) { set({ schemaTables: tables }); },

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

    // ============================================================
    // FIX PERFORMA: getSnapshot menyimpan REFERENSI langsung,
    // BUKAN cloneDeep. Semua mutasi store memakai pola immutable
    // (concat, slice, Object.assign), jadi objek lama tidak pernah
    // berubah dan history tetap aman tanpa deep copy. Ini menghapus
    // pekerjaan sinkron terberat yang membuat klik terasa macet.
    // ============================================================
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
          fields: st.fields, features: st.features, palette: st.palette,
          roles: st.roles, schemaTables: st.schemaTables, acModules: st.acModules,
          simpleExtras: st.simpleExtras, techOptional: st.techOptional, mode: st.mode,
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
        aiTypewriterActive: false,
      });
    },

    clearAll: function () {
      set(function (s) {
        const base = init();
        return Object.assign({}, base, { mode: s.mode, history: s.history, historyIndex: s.historyIndex, saveIndicator: s.saveIndicator });
      });
    },

    analyzeWithAi: async function (userBrief) {
      const state = get();
      const prdSnapshot = state.getSnapshot();
      set({ isAnalyzing: true, aiError: null, aiFeedback: '', aiDraft: null, aiTypewriterActive: true });
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error('VITE_GEMINI_API_KEY belum diisi pada file .env.local!');
        }
        const prompt = buildAiPrompt(prdSnapshot, userBrief);

        const pushDisplay = function (fullText) {
          const cleanDisplay = cleanLatex(
            fullText.replace(/```json_draft[\s\S]*$/, '')
          );
          set({ aiFeedback: cleanDisplay });
        };

        let fullTextAccumulator = '';
        try {
          fullTextAccumulator = await streamGeminiAnalysis(apiKey, GEMINI_PRIMARY_MODEL, prompt, pushDisplay);
        } catch (primaryErr) {
          const retryable = !primaryErr.status || primaryErr.status === 429 || primaryErr.status >= 500;
          if (!retryable) throw primaryErr;

          console.warn('[Gemini] Model utama gagal, memakai cadangan:', primaryErr.message);
          set({ aiFeedback: '' });
          try {
            fullTextAccumulator = await streamGeminiAnalysis(apiKey, GEMINI_FALLBACK_MODEL, prompt, pushDisplay);
          } catch (fallbackErr) {
            throw new Error(describeGeminiError(fallbackErr));
          }
        }

        const extractedDraft = extractAiDraft(fullTextAccumulator);
        console.log('[AI Draft] Hasil ekstraksi:', extractedDraft ? 'BERHASIL' : 'GAGAL');

        const finalCleanFeedback = cleanLatex(
          fullTextAccumulator.replace(/`{3,}\s*json_draft[\s\S]*?`{3,}/gi, '')
        );

        set({
          aiFeedback: finalCleanFeedback,
          aiDraft: extractedDraft,
          isAnalyzing: false
        });

        return finalCleanFeedback;
      } catch (err) {
        const friendly = describeGeminiError(err);
        set({ aiError: friendly, isAnalyzing: false });
        throw new Error(friendly);
      }
    },

    applyAiDraft: function () {
      const state = get();
      const draft = state.aiDraft;
      if (!draft) return false;
      set(function (s) {
        const updateState = {};
        const newSimpleExtras = { ...s.simpleExtras };
        if (draft.fields && typeof draft.fields === 'object') {
          updateState.fields = { ...s.fields };
          Object.keys(draft.fields).forEach((key) => {
            const rawVal = draft.fields[key];
            if (rawVal && typeof rawVal === 'string' && rawVal.trim()) {
              const val = sanitizeMultiline(cleanLatex(rawVal));
              if (val.trim()) {
                updateState.fields[key] = val;
              }
            }
          });
          const personaKeys = ['userPersona', 'successMetrics'];
          if (personaKeys.some(function (k) { return draft.fields[k] && draft.fields[k].trim(); })) {
            newSimpleExtras.persona = true;
          }
          const brandingKeys = ['brandTypography', 'brandLayout'];
          if (brandingKeys.some(function (k) { return draft.fields[k] && draft.fields[k].trim(); })) {
            newSimpleExtras.branding = true;
          }
          const nfrKeys = ['nfrSpecs', 'nfrPerformance', 'nfrLocalization', 'nfrBrowser', 'figmaLink', 'riskMitigation'];
          if (nfrKeys.some(function (k) { return draft.fields[k] && draft.fields[k].trim(); })) {
            newSimpleExtras.nfr = true;
          }
        }
        if (Array.isArray(draft.features) && draft.features.length > 0) {
          updateState.features = draft.features.map(function (f, idx) {
            return {
              id: f.id || 'F-0' + (idx + 1),
              name: sanitizeMultiline(cleanLatex(f.name || '')),
              story: sanitizeMultiline(cleanLatex(f.story || '')),
              priority: f.priority || 'High'
            };
          });
        }
        if (Array.isArray(draft.palette) && draft.palette.length > 0) {
          updateState.palette = draft.palette.map(function (p) {
            return {
              name: sanitizeMultiline(cleanLatex(p.name || '')),
              hex: p.hex || '#C9A961',
              usage: sanitizeMultiline(cleanLatex(p.usage || ''))
            };
          });
          newSimpleExtras.branding = true;
        }
        if (Array.isArray(draft.roles) && draft.roles.length > 0) {
          updateState.roles = draft.roles.map(function (r) {
            return {
              name: sanitizeMultiline(cleanLatex(r.name || '')),
              can: sanitizeMultiline(cleanLatex(r.can || '')),
              cannot: sanitizeMultiline(cleanLatex(r.cannot || ''))
            };
          });
          newSimpleExtras.roles = true;
        }
        if (Array.isArray(draft.acModules) && draft.acModules.length > 0) {
          updateState.acModules = draft.acModules.map(function (m) {
            return {
              title: sanitizeMultiline(cleanLatex(m.title || '')),
              items: Array.isArray(m.items) ? m.items.map(function (it) {
                return {
                  title: sanitizeMultiline(cleanLatex(it.title || '')),
                  desc: sanitizeMultiline(cleanLatex(it.desc || ''))
                };
              }) : []
            };
          });
          newSimpleExtras.ac = true;
        }
        if (Array.isArray(draft.schemaTables) && draft.schemaTables.length > 0) {
          updateState.schemaTables = draft.schemaTables.map(function (t) {
            return {
              name: sanitizeMultiline(cleanLatex(t.name || '')),
              desc: sanitizeMultiline(cleanLatex(t.desc || '')),
              fields: Array.isArray(t.fields) ? t.fields.map(function (fi) {
                return {
                  field: sanitizeMultiline(cleanLatex(fi.field || '')),
                  type: sanitizeMultiline(cleanLatex(fi.type || '')),
                  required: fi.required === 'Ya' ? 'Ya' : 'Opsional',
                  note: sanitizeMultiline(cleanLatex(fi.note || ''))
                };
              }) : []
            };
          });
          newSimpleExtras.schema = true;
        }
        updateState.simpleExtras = newSimpleExtras;
        return { ...updateState, aiDraft: null };
      });
      get().commitHistory();
      console.log('[AI Draft] Apply selesai.');
      return true;
    },

    clearAiFeedback: function () {
      set({ aiFeedback: '', aiDraft: null, aiError: null, aiTypewriterActive: false });
    },

    loadSampleData: function () {
      set(function (s) {
        const keepCover = {};
        const coverKeys = ['coverThemeAuto', 'coverPrimary', 'coverAccent', 'coverBg', 'coverKicker', 'coverFooterNote', 'coverShowFooter', 'coverSubtitle'];
        coverKeys.forEach(function (k) {
          if (Object.prototype.hasOwnProperty.call(s.fields, k)) keepCover[k] = s.fields[k];
        });
        return {
          fields: Object.assign({
            projectName: 'Instagram', docVersion: '2.0 Final Draft', docStatus: 'In Development', author: 'Tim Product Instagram',
            targetDate: '2026-12-15', targetDateFormat: 'full',
            problemStatement: 'Pengguna butuh platform buat share foto & video cepet, plus interaksi lewat like, komentar, dan DM.',
            productGoal: 'Platform social media foto/video dengan feed personal, stories 24 jam, dan interaksi real-time.',
            userFlow: 'Onboarding \u2192 Login \u2192 Home Feed \u2192 Upload Post \u2192 Edit & Filter \u2192 Publish \u2192 Like/Komentar \u2192 Profile',
            techFrontend: 'React Native + Redux Toolkit',
            techBackend: 'Node.js + GraphQL',
            techDatabase: 'PostgreSQL + Redis + Cassandra',
            techInfra: 'AWS EC2 + S3 + CloudFront + Kubernetes',
            techDomain: 'Route 53 + Cloudflare DNS',
            techVcs: 'GitHub',
            techSecurity: 'OAuth 2.0 + JWT + bcrypt + 2FA',
            techStorage: 'AWS S3 + CloudFront CDN',
            techThirdParty: 'Firebase Cloud Messaging + FFmpeg + Google Maps',
            techAi: 'Gemini API + LangChain untuk moderasi konten & rekomendasi feed',
            techDevOps: 'GitHub Actions CI/CD + Sentry',
            techCaching: 'Redis + Memcached',
            techQueue: 'Kafka',
            techMonitoring: 'Sentry + Grafana + Prometheus',
            techAnalytics: 'Amplitude + Google Analytics',
            techTesting: 'Jest + Detox + Playwright',
            dbSchema: 'users: id, username, email, password_hash, bio, profile_pic_url\nposts: id, user_id, media_url, caption, likes_count\ncomments: id, post_id, user_id, text\nfollows: follower_id, followee_id\nstories: id, user_id, media_url, expires_at',
            outOfScope: 'Live streaming\nVideo call\nMarketplace / jual beli',
            defOfDone: 'Semua AC lulus\nZero critical bug\nFeed load < 2 detik\nUpload success rate 99%',
            userPersona: 'Gen Z 15-24 tahun (content creator kasual), milenial 25-34 (brand/bisnis kecil)',
            successMetrics: 'DAU/MAU ratio \u2265 0.6, D30 retention \u2265 40%, avg session \u2265 15 menit',
            brandTypography: 'System font (SF Pro iOS / Roboto Android), Billabong untuk logo saja',
            brandLayout: 'Mobile-first, grid 3 kolom, infinite scroll, thumb-friendly navigation',
            bpMobileOp: '\u2264', bpMobile: '640', bpMobileUnit: 'px',
            bpTabletOp: '\u2264', bpTablet: '1024', bpTabletUnit: 'px',
            bpDesktopOp: '\u2265', bpDesktop: '1024', bpDesktopUnit: 'px',
            nfrSpecs: 'HTTPS/TLS 1.3 everywhere, OAuth 2.0, rate limit per IP, enkripsi at-rest (AES-256)',
            nfrPerformance: 'FCP < 1.2s, feed load < 2s, image auto-compress WebP/AVIF',
            nfrLocalization: '30+ bahasa, format waktu & tanggal lokal, RTL support',
            nfrBrowser: 'iOS 15+, Android 9+, Chrome/Safari/Edge 2 versi terakhir',
            figmaLink: 'https://figma.com/file/instagram-clone',
            riskMitigation: 'Konten ilegal & cyberbullying \u2192 AI moderation + report flow + rate limit upload',
          }, keepCover),
          techOptional: ['techSecurity', 'techStorage', 'techThirdParty', 'techAi', 'techDevOps', 'techCaching', 'techQueue', 'techMonitoring', 'techAnalytics', 'techTesting'],
          simpleExtras: { persona: true, branding: true, roles: true, ac: true, schema: true, nfr: true },
          palette: [
            { name: 'Primary Blue', hex: '#0095F6', usage: 'Tombol utama & link aktif' },
            { name: 'Gradient Purple', hex: '#833AB4', usage: 'Gradient logo & stories ring' },
            { name: 'Gradient Pink', hex: '#E1306C', usage: 'Gradient logo & stories ring' },
            { name: 'Gradient Orange', hex: '#F77737', usage: 'Gradient accent' },
            { name: 'Neutral White', hex: '#FFFFFF', usage: 'Background utama' },
            { name: 'Text Black', hex: '#262626', usage: 'Teks body & heading' },
          ],
          roles: [
            { name: 'User Reguler', can: 'Post & story\nLike, komentar, share, save\nFollow/unfollow\nDM', cannot: 'Hapus konten orang lain\nAkses insight' },
            { name: 'Creator (Pro)', can: 'Semua hak user reguler\nInsight & analytics\nMonetisasi link story', cannot: 'Hapus konten orang lain' },
            { name: 'Admin/Moderator', can: 'Hapus konten violating\nSuspend/ban akun\nHandle report queue', cannot: 'Edit post user' },
          ],
          schemaTables: [
            { name: 'users', desc: 'Akun pengguna + profil publik', fields: [
              { field: 'id', type: 'BIGINT', required: 'Ya', note: 'PK' },
              { field: 'username', type: 'VARCHAR', required: 'Ya', note: 'unik, max 30 char' },
              { field: 'email', type: 'VARCHAR', required: 'Ya', note: 'unik, verified' },
              { field: 'password_hash', type: 'VARCHAR', required: 'Ya', note: 'bcrypt 12 rounds' },
              { field: 'bio', type: 'TEXT', required: 'Opsional', note: 'max 150 karakter' },
              { field: 'profile_pic_url', type: 'VARCHAR', required: 'Opsional', note: 'URL S3' },
            ] },
            { name: 'posts', desc: 'Post foto/video di feed utama', fields: [
              { field: 'id', type: 'BIGINT', required: 'Ya', note: 'PK' },
              { field: 'user_id', type: 'BIGINT', required: 'Ya', note: 'FK ke users' },
              { field: 'media_url', type: 'VARCHAR', required: 'Ya', note: 'URL S3/CDN' },
              { field: 'caption', type: 'TEXT', required: 'Opsional', note: 'support hashtag & mention' },
              { field: 'likes_count', type: 'INT', required: 'Ya', note: 'counter, default 0' },
              { field: 'created_at', type: 'TIMESTAMP', required: 'Ya', note: 'index untuk feed ordering' },
            ] },
            { name: 'comments', desc: 'Komentar di post', fields: [
              { field: 'id', type: 'BIGINT', required: 'Ya', note: 'PK' },
              { field: 'post_id', type: 'BIGINT', required: 'Ya', note: 'FK ke posts' },
              { field: 'user_id', type: 'BIGINT', required: 'Ya', note: 'FK ke users' },
              { field: 'text', type: 'TEXT', required: 'Ya', note: 'max 2200 karakter' },
            ] },
            { name: 'follows', desc: 'Relasi follow antar user', fields: [
              { field: 'follower_id', type: 'BIGINT', required: 'Ya', note: 'FK ke users' },
              { field: 'followee_id', type: 'BIGINT', required: 'Ya', note: 'FK ke users' },
              { field: 'created_at', type: 'TIMESTAMP', required: 'Ya', note: 'composite PK' },
            ] },
          ],
          acModules: [
            { title: 'Auth & Onboarding', items: [
              { title: 'Register', desc: 'User submit email + username unik + password \u2265 8 char \u2192 email verifikasi terkirim < 5 detik' },
              { title: 'Login', desc: 'Kredensial valid \u2192 mint JWT + refresh token, redirect ke home feed' },
            ] },
            { title: 'Feed & Post', items: [
              { title: 'Home Feed', desc: 'Pull-to-refresh load post terbaru dari following, infinite scroll batch 20 post' },
              { title: 'Upload Post', desc: 'Pilih foto/video \u2192 crop/filter \u2192 caption + hashtag \u2192 publish \u2192 muncul di feed follower dalam < 3 detik' },
              { title: 'Like', desc: 'Double-tap post \u2192 animasi hati, counter increment, notifikasi ke owner' },
            ] },
            { title: 'Stories', items: [
              { title: 'Buat Story', desc: 'Capture foto/video \u2264 15 detik \u2192 tambah stiker/teks \u2192 publish \u2192 ring gradient muncul di avatar follower' },
              { title: 'View Story', desc: 'Tap avatar \u2192 putar story, auto-next, ring jadi abu-abu setelah semua story dilihat' },
            ] },
            { title: 'Profile & Follow', items: [
              { title: 'Profile Grid', desc: 'Tab Posts/Saved/Tagged render grid 3 kolom, scroll infinite' },
              { title: 'Follow/Unfollow', desc: 'Tap tombol \u2192 counter update real-time, feed algorithm adjust' },
            ] },
          ],
          features: [
            { id: 'F-01', name: 'Auth', story: 'User bisa login/logout pakai email + 2FA opsional, session persist 30 hari', priority: 'High' },
            { id: 'F-02', name: 'Upload Post', story: 'User bisa upload foto/video dengan filter, crop, caption + hashtag', priority: 'High' },
            { id: 'F-03', name: 'Home Feed', story: 'User lihat post terbaru dari following, infinite scroll, pull-to-refresh', priority: 'High' },
            { id: 'F-04', name: 'Interaksi', story: 'User bisa like, komentar, share, save post. Counter real-time.', priority: 'High' },
            { id: 'F-05', name: 'Stories', story: 'User bisa post story 24 jam dengan ring gradient, auto-expire', priority: 'Medium' },
            { id: 'F-06', name: 'DM', story: 'User bisa chat privat (teks + foto + reaksi) dengan follower mutual', priority: 'Medium' },
            { id: 'F-07', name: 'Explore', story: 'User dapat rekomendasi konten berdasarkan minat & trending', priority: 'Medium' },
            { id: 'F-08', name: 'Push Notification', story: 'User dapat notifikasi like, komentar, follow via FCM', priority: 'Low' },
          ],
        };
      });
    },
  };
});