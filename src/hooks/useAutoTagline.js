import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { usePrdStore } from '../store/usePrdStore';
import { taglineHash, summarizeForCover } from '../utils/helpers';

// ============================================================
// AUTO TAGLINE: PERINGKAS SAMPUL CERDAS DENGAN DUAL MODEL FALLBACK
// Model utama: qwen/qwen3.8-27b
// Model cadangan: qwen/qwen3.6-27b
// Fallback terakhir: heuristik lokal (summarizeForCover)
// ============================================================

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = 'qwen/qwen3.8-27b';
const FALLBACK_MODEL = 'qwen/qwen3.6-27b';

// Hanya aktif jika teks cukup panjang untuk butuh peringkasan
const MIN_CHARS = 140;
// Batas keras panjang tagline agar sampul selalu ringkas
const MAX_TAGLINE_CHARS = 90;
// Tunggu user benar-benar berhenti mengetik sebelum memanggil AI
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
    'Contoh 1:\n' +
    'Teks: "Membangun platform kasir digital untuk warung kopi agar pencatatan penjualan harian lebih rapi dan stok bahan baku selalu terpantau sehingga pemilik tidak perlu mengecek manual"\n' +
    'Tagline: "Platform kasir digital dengan pencatatan penjualan dan stok yang otomatis"\n\n' +
    'Contoh 2:\n' +
    'Teks: "Mempermudah pelanggan barbershop melakukan booking jadwal cukur secara online sehingga mengurangi antrian fisik dan meningkatkan jumlah booking hingga 40 persen dalam enam bulan"\n' +
    'Tagline: "Pemesanan cukur daring yang memangkas waktu antrian hingga 40%"\n\n' +
    'Contoh 3:\n' +
    'Teks: "Menyediakan satu dashboard terpusat untuk memantau omzet, jumlah pesanan, dan produk terlaris secara real-time serta menyusun laporan penjualan mingguan secara otomatis"\n' +
    'Tagline: "Dashboard terpusat untuk pemantauan omzet dan penjualan secara real-time"\n\n' +
    'Teks: """' + text + '"""\n' +
    'Tagline:';
};

const callGroq = async function (apiKey, model, prompt) {
  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 60,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(function () { return {}; });
    const msg = errData.error && errData.error.message ? errData.error.message : 'HTTP ' + res.status;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content || '';
  }
  return '';
};

// Bersihkan output model dan paksa batas panjang
const cleanTagline = function (raw, originalLength) {
  let t = (raw || '');
  // Buang blok thinking jika model mengeluarkannya
  t = t.replace(/[\s\S]*<\/think>\s*/g, '');
  // Ambil baris pertama saja
  t = t.split('\n')[0];
  // Buang awalan "Tagline:" jika model mengulanginya
  t = t.replace(/^tagline\s*:\s*/i, '');
  // Buang bold markdown, kutip, dan tanda baca akhir
  t = t.replace(/\*\*/g, '').replace(/["']/g, '').replace(/[.!?]+$/, '').trim();
  if (!t || t.length > originalLength) return '';
  // Jika model masih mengirim terlalu panjang, potong di batas
  // klausa alami dan akhiri dengan titik (tanpa elipsis).
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

      // Teks pendek tidak butuh peringkasan AI
      if (text.length < MIN_CHARS) return;

      // Hash memakai versi prompt, sehingga tagline lama dari
      // prompt versi sebelumnya otomatis dibuat ulang.
      const hash = taglineHash(text);

      // Teks yang sama sudah pernah diproses, jangan panggil ulang
      if (state.fields.coverTaglineHash === hash) return;

      // Cegah pemanggilan bersamaan
      if (busyRef.current) return;

      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) return;

      busyRef.current = true;
      let tagline = '';

      try {
        // Percobaan 1: model utama
        try {
          const raw = await callGroq(apiKey, PRIMARY_MODEL, buildPrompt(text));
          tagline = cleanTagline(raw, text.length);
        } catch (primaryErr) {
          // Fallback hanya untuk error kuota, server, atau jaringan
          const retryable = !primaryErr.status || primaryErr.status === 429 || primaryErr.status >= 500;
          if (!retryable) throw primaryErr;
          console.warn('[AutoTagline] Model utama gagal, mencoba cadangan:', primaryErr.message);
        }

        // Percobaan 2: model cadangan (jika utama error retryable
        // atau utama sukses tapi hasilnya kosong tidak wajar)
        if (!tagline) {
          const raw2 = await callGroq(apiKey, FALLBACK_MODEL, buildPrompt(text));
          tagline = cleanTagline(raw2, text.length);
        }

        if (tagline) state.setField('coverTagline', tagline);
        state.setField('coverTaglineHash', hash);
      } catch (e) {
        // Gagal diam-diam: sampul jatuh ke heuristik lokal.
        // Hash tetap disimpan agar teks sama tidak di-retry terus.
        console.error('[AutoTagline] Semua model gagal:', e.message);
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