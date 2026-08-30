import { create } from 'zustand';
import { cloneDeep } from 'lodash';
import { DEFAULT_FIELDS, INITIAL_SIMPLE_EXTRAS, MAX_HISTORY } from '../utils/constants';

const init = function () {
  return {
    mode: 'simple', simpleExtras: { ...INITIAL_SIMPLE_EXTRAS }, fields: { ...DEFAULT_FIELDS },
    features: [], palette: [], roles: [], schemaTables: [], acModules: [], techOptional: [],
    history: [], historyIndex: -1, saveIndicator: '',
    aiFeedback: '', aiDraft: null, isAnalyzing: false, aiError: null,
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

    // ============================================================
    // ACTION ANALISIS AI (Prompt lebih ringkas, output seimbang)
    // ============================================================
    analyzeWithAi: async function () {
      const state = get();
      const prdSnapshot = state.getSnapshot();
      set({ isAnalyzing: true, aiError: null, aiFeedback: '', aiDraft: null });

      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error('VITE_GEMINI_API_KEY belum diisi pada file .env.local!');
        }

        const prompt = `Kamu adalah Principal Product Manager & System Analyst senior dengan pengalaman 10+ tahun di startup teknologi Indonesia (Gojek, Tokopedia, Traveloka level).

Tugasmu: audit PRD berikut dan berikan rekomendasi strategis yang actionable. Tulis dengan gaya manusia sungguhan, PADAT, dan BERISI.

================================================================================
ATURAN PANJANG OUTPUT (SANGAT PENTING)
================================================================================
- Total output analisis MAKSIMAL 1200 kata (tidak termasuk json_draft)
- Setiap poin analisis MAKSIMAL 2-3 kalimat saja
- JANGAN bertele-tele, JANGAN mengulang poin yang sama dengan kata berbeda
- Fokus ke insight actionable, bukan penjelasan teori
- Jika field PRD kosong, cukup sebutkan 1 kali dan berikan saran konkret

================================================================================
ATURAN GAYA BAHASA
================================================================================
1. TULIS SEPERTI MANUSIA. To the point, kontekstual, pakai istilah industri yang natural.

2. DAFTAR KATA YANG DILARANG (klise AI):
   - "guna meningkatkan", "guna mempercepat", "guna meminimalisir"
   - "secara manual dan terfragmentasi"
   - "kredensial yang valid"
   - "melakukan manipulasi", "melakukan proses"
   - "platform digital terpusat"
   - "efisiensi waktu dan akurasi"
   - "secara tepat", "secara mudah", "secara real-time"
   - "sehingga dapat", "diharapkan dapat", "bertujuan untuk"
   - "guna", "adapun", "selanjutnya"

3. PAKAI GAYA INI:
   - Singkatan umum: auth, dashboard, API, endpoint, flow, deploy, user, admin
   - Kalimat pendek dan aktif
   - Konteks bisnis nyata dengan contoh spesifik
   - Berikan reasoning "kenapa" di balik setiap rekomendasi

4. DILARANG pakai LaTeX ($...$, \\text{}, \\ge). Pakai simbol Unicode: ≥, ≤, ≈, ×

================================================================================
STRUKTUR ANALISIS (IKUTI PERSIS, JANGAN TAMBAH SEKSI LAIN)
================================================================================

## 1. Analisis System Analyst

### A. Arsitektur & Stack Teknologi
* **Status Kelengkapan & Kesiapan**: Audit singkat kelengkapan PRD dan gap kritis yang harus diisi sebelum sprint planning.
* **Rekomendasi Frontend & Backend**: Stack yang paling cocok untuk use case ini, plus alasan teknis singkat (SSR vs CSR, monolith vs microservices, REST vs GraphQL).

### B. Basis Data & Infrastruktur
* **Skema & Integritas Data**: Evaluasi struktur tabel, indexing, dan normalisasi berdasarkan kebutuhan aplikasi.
* **Caching, Queue & DevOps**: Kebutuhan Redis/cache, message queue jika relevan, dan strategi CI/CD + containerization.

### C. Keamanan & NFR
* **Security & Compliance**: Standar auth, enkripsi, dan compliance regulasi data (UU PDP) yang wajib dipenuhi.
* **Performance & SLA**: Target FCP, response time API, uptime SLA, dan strategi monitoring.

## 2. Analisis Product Manager

### A. Problem Statement & Persona
* **Kejelasan Masalah & Tujuan**: Evaluasi apakah problem statement sudah spesifik dan goals sudah terukur. Berikan saran perbaikan jika masih generic.
* **Ketajaman Persona**: Apakah persona sudah menggambarkan pain point nyata dan jobs-to-be-done pengguna target.

### B. Scope & Definition of Done
* **Batasan Fitur (Out of Scope)**: Identifikasi risiko scope creep dan fitur yang sebaiknya di-cut untuk MVP yang lebih fokus.
* **Kriteria Rilis (DoD)**: Standar kualitas yang harus dipenuhi sebelum fitur dinyatakan selesai (testing coverage, bug threshold, approval).

### C. Roadmap & Success Metrics
* **Prioritas MVP**: Urutan eksekusi fitur inti menggunakan framework sederhana (High/Medium/Low) dengan justifikasi singkat.
* **KPI Terukur**: 3-5 metrik utama pasca-rilis (retention, DAU, conversion, CSAT) dengan target angka realistis.

## 3. Rekomendasi AI

### A. Stack Ideal & Keamanan Prioritas
* **Stack Rekomendasi**: Kombinasi teknologi paling rasional untuk proyek ini beserta alasan singkat kenapa lebih baik dari alternatif.
* **Security Quick Wins**: 2-3 langkah keamanan yang wajib langsung dikerjakan di sprint pertama.

### B. Next Actions & Mitigasi Risiko
* **Langkah Konkret Berikutnya**: 3-5 action items yang harus dilakukan tim (PM/Dev/Design) saat ini juga, urutkan berdasarkan prioritas.
* **Mitigasi Risiko Utama**: Top 2 risiko terbesar (teknis atau bisnis) beserta strategi mitigasi praktis.

================================================================================
ATURAN FORMAT JSON DRAFT (WAJIB OUTPUT DI AKHIR)
================================================================================

Setelah analisis, WAJIB output blok \`\`\`json_draft. Semua nilai string HARUS:
- Bahasa Indonesia natural
- JANGAN pakai format "Sebagai X, saya dapat Y" untuk user story
- Kontekstual, tidak generik

ATURAN FORMAT KHUSUS:
1. PERSONA (field "userPersona"): JANGAN pakai nama orang fiktif atau umur. Fokus ke PERAN, PAIN POINT, dan GOAL HARIAN.
2. ROLE MATRIX (array "roles"): Pisahkan SETIAP poin dengan ENTER (newline \\n), BUKAN koma. JANGAN pakai bullet "-", "*", atau nomor.
3. TECH STACK: TULIS NAMA TEKNOLOGI SAJA tanpa penjelasan atau alasan.
4. RISK (field "riskMitigation"): JANGAN awali dengan kata "Risiko:" karena sudah ada label otomatis. Langsung tulis isi.
5. OUT OF SCOPE & DEFINITION OF DONE: Pisahkan SETIAP item dengan ENTER (\\n), tanpa bullet atau koma.
6. DB SCHEMA (field "dbSchema"): Format "nama_tabel: field1, field2" per baris, dipisah dengan \\n.

\`\`\`json_draft
{
  "fields": {
    "projectName": "nama proyek",
    "problemStatement": "masalah konkret dengan konteks bisnis",
    "productGoal": "tujuan SMART terukur",
    "userPersona": "peran + pain point + goal harian (TANPA nama/umur)",
    "userFlow": "alur step-by-step natural",
    "techFrontend": "nama teknologi saja",
    "techBackend": "nama teknologi saja",
    "techDatabase": "nama teknologi saja",
    "techInfra": "nama teknologi saja",
    "dbSchema": "users: id, username, email\\nposts: id, user_id, caption",
    "outOfScope": "Item pertama\\nItem kedua",
    "defOfDone": "Kriteria pertama\\nKriteria kedua",
    "successMetrics": "KPI spesifik realistis",
    "brandTypography": "font + alasan UX singkat",
    "brandLayout": "prinsip layout praktis",
    "nfrSpecs": "security stack konkret",
    "nfrPerformance": "angka performance realistis",
    "nfrLocalization": "scope lokalisasi",
    "nfrBrowser": "support matrix",
    "figmaLink": "link kalau relevan",
    "riskMitigation": "risiko + mitigasi praktis (TANPA awalan 'Risiko:')"
  },
  "features": [
    { "id": "F-01", "name": "Nama Fitur", "story": "user story natural tanpa template", "priority": "High" }
  ],
  "palette": [
    { "name": "Nama", "hex": "#HEX", "usage": "konteks pemakaian" }
  ],
  "roles": [
    { "name": "Role", "can": "Aksi pertama\\nAksi kedua", "cannot": "Batasan pertama\\nBatasan kedua" }
  ],
  "acModules": [
    {
      "title": "Modul",
      "items": [
        { "title": "Skenario", "desc": "trigger → reaksi sistem" }
      ]
    }
  ],
  "schemaTables": [
    {
      "name": "nama_tabel",
      "desc": "fungsi tabel di konteks bisnis",
      "fields": [
        { "field": "kolom", "type": "TIPE", "required": "Ya", "note": "catatan praktis" }
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
                temperature: 0.4,
                maxOutputTokens: 4096,
                topP: 0.95,
              }
            })
          }
        );

        if (!response.ok) {
          const errJson = await response.json().catch(function () { return {}; });
          const errMsg = errJson.error?.message || '';
          if (response.status === 429 || errJson.error?.code === 429) {
            if (errMsg.includes('Quota exceeded') || errMsg.includes('free_tier')) {
              throw new Error('Kuota harian (Free Tier) Gemini API telah habis.');
            }
            throw new Error('Batas penggunaan AI sedang penuh. Tunggu 30 detik lalu coba lagi.');
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
                  fullTextAccumulator.replace(/```json_draft[\s\S]*$/, '')
                );
                set({ aiFeedback: cleanDisplay });
              } catch (e) {}
            }
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
                  required: fi.required || 'Ya',
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
      set({ aiFeedback: '', aiDraft: null, aiError: null });
    },

    loadSampleData: function () {
      set(function () {
        return {
          fields: {
            projectName: 'Instagram', docVersion: 'v2.0 Final Draft', author: 'Tim Product Instagram',
            targetDate: '2026-12-15', targetDateFormat: 'full',
            problemStatement: 'Pengguna butuh platform buat share foto & video cepet, plus interaksi lewat like, komentar, dan DM.',
            productGoal: 'Platform social media foto/video dengan feed personal, stories 24 jam, dan interaksi real-time.',
            userFlow: 'Onboarding → Login → Home Feed → Upload Post → Edit & Filter → Publish → Like/Komentar → Profile',
            techFrontend: 'React Native + Redux Toolkit',
            techBackend: 'Node.js + GraphQL',
            techDatabase: 'PostgreSQL + Redis + Cassandra',
            techInfra: 'AWS EC2 + S3 + CloudFront + Kubernetes',
            techDomain: 'Route 53 + Cloudflare DNS',
            techVcs: 'GitHub',
            techSecurity: 'OAuth 2.0 + JWT + bcrypt + 2FA',
            techStorage: 'AWS S3 + CloudFront CDN',
            techThirdParty: 'Firebase Cloud Messaging + FFmpeg + Google Maps',
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
            successMetrics: 'DAU/MAU ratio ≥ 0.6, D30 retention ≥ 40%, avg session ≥ 15 menit',
            brandTypography: 'System font (SF Pro iOS / Roboto Android), Billabong untuk logo saja',
            brandLayout: 'Mobile-first, grid 3 kolom, infinite scroll, thumb-friendly navigation',
            bpMobileOp: '≤', bpMobile: '640', bpMobileUnit: 'px',
            bpTabletOp: '≤', bpTablet: '1024', bpTabletUnit: 'px',
            bpDesktopOp: '≥', bpDesktop: '1024', bpDesktopUnit: 'px',
            nfrSpecs: 'HTTPS/TLS 1.3 everywhere, OAuth 2.0, rate limit per IP, enkripsi at-rest (AES-256)',
            nfrPerformance: 'FCP < 1.2s, feed load < 2s, image auto-compress WebP/AVIF',
            nfrLocalization: '30+ bahasa, format waktu & tanggal lokal, RTL support',
            nfrBrowser: 'iOS 15+, Android 9+, Chrome/Safari/Edge 2 versi terakhir',
            figmaLink: 'https://figma.com/file/instagram-clone',
            riskMitigation: 'Konten ilegal & cyberbullying → AI moderation + report flow + rate limit upload',
          },
          techOptional: ['techSecurity', 'techStorage', 'techThirdParty', 'techDevOps', 'techCaching', 'techQueue', 'techMonitoring', 'techAnalytics', 'techTesting'],
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
              { title: 'Register', desc: 'User submit email + username unik + password ≥ 8 char → email verifikasi terkirim < 5 detik' },
              { title: 'Login', desc: 'Kredensial valid → mint JWT + refresh token, redirect ke home feed' },
            ] },
            { title: 'Feed & Post', items: [
              { title: 'Home Feed', desc: 'Pull-to-refresh load post terbaru dari following, infinite scroll batch 20 post' },
              { title: 'Upload Post', desc: 'Pilih foto/video → crop/filter → caption + hashtag → publish → muncul di feed follower dalam < 3 detik' },
              { title: 'Like', desc: 'Double-tap post → animasi hati, counter increment, notifikasi ke owner' },
            ] },
            { title: 'Stories', items: [
              { title: 'Buat Story', desc: 'Capture foto/video ≤ 15 detik → tambah stiker/teks → publish → ring gradient muncul di avatar follower' },
              { title: 'View Story', desc: 'Tap avatar → putar story, auto-next, ring jadi abu-abu setelah semua story dilihat' },
            ] },
            { title: 'Profile & Follow', items: [
              { title: 'Profile Grid', desc: 'Tab Posts/Saved/Tagged render grid 3 kolom, scroll infinite' },
              { title: 'Follow/Unfollow', desc: 'Tap tombol → counter update real-time, feed algorithm adjust' },
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