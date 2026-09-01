import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { usePrdStore } from '../store/usePrdStore';
import { taglineHash, summarizeForCover } from '../utils/helpers';
import { callAi, requireAiKey } from '../services/aiService';

// ============================================================
// AUTO TAGLINE: PERINGKAS SAMPUL CERDAS VIA OPENROUTER (GEMMA 4)
// Fallback terakhir: heuristik lokal (summarizeForCover)
// ============================================================
const MIN_CHARS = 140;
const MAX_TAGLINE_CHARS = 90;
const DEBOUNCE_MS = 2500;

const buildPrompt = function (text) {
  return 'Kamu adalah copywriter dokumen korporat senior. Tulis SATU tagline untuk sampul dokumen PRD yang menangkap INTI produk dari teks "Tujuan Produk" di bawah.\n' +
    'Aturan wajib:\n' +
    '1. Gunakan Bahasa Indonesia formal dan profesional, layak untuk sampul dokumen bisnis.\n' +
    '2. Tata bahasa harus utuh dan benar, bukan gaya telegrafik. Pertahankan kata hubung yang diperlukan seperti untuk, secara, dalam, dengan, yang.\n' +
    '3. Maksimal 14 kata dan maksimal 90 karakter.\n' +
    '4. Wajib menyebut nilai utama produk plus satu metrik kunci (angka atau persentase) jika ada.\n' +
    '5. JANGAN menyalin atau memotong kalimat asli. Tulis ulang menjadi frasa yang ringkas dan elegan.\n' +
    '6. Tanpa titik di akhir, tanpa tanda kutip, tanpa awalan seperti "Tujuan produk ini".\n' +
    '7. Output HANYA tagline, tanpa penjelasan apapun.\n\n' +
    'Teks: """' + text + '"""\n' +
    'Tagline:';
};

const cleanTagline = function (raw, originalLength) {
  let t = (raw || '');
  t = t.replace(/[\s\S]*<\/think>\s*/g, '');
  t = t.split('\n')[0];
  t = t.replace(/^tagline\s*:\s*/i, '');
  t = t.replace(/\*\*/g, '').replace(/["']/g, '').replace(/[.!?]+$/, '').trim();
  if (!t || t.length > originalLength) return '';
  if (t.length > MAX_TAGLINE_CHARS) {
    t = summarizeForCover(t, MAX_TAGLINE_CHARS);
  }
  return t;
};

export const useAutoTagline = function () {
  const productGoal = usePrdStore(function (s) { return s.fields.productGoal; });
  const busyRef = useRef(false);
  useEffect(function () {
    const run = debounce(async function () {
      const state = usePrdStore.getState();
      const text = (state.fields.productGoal || '').trim();
      if (text.length < MIN_CHARS) return;
      const hash = taglineHash(text);
      if (state.fields.coverTaglineHash === hash) return;
      if (busyRef.current) return;
      let apiKey = '';
      try { apiKey = requireAiKey(); } catch (e) { return; }
      busyRef.current = true;
      let tagline = '';
      try {
        const raw = await callAi(apiKey, buildPrompt(text), 60);
        tagline = cleanTagline(raw, text.length);
        if (tagline) state.setField('coverTagline', tagline);
        state.setField('coverTaglineHash', hash);
      } catch (e) {
        console.error('[AutoTagline] Gagal:', e.message);
        state.setField('coverTaglineHash', hash);
      } finally {
        busyRef.current = false;
      }
    }, DEBOUNCE_MS);
    run();
    return function () { run.cancel(); };
  }, [productGoal]);
  return null;
};
