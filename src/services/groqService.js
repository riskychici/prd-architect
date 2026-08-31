// ============================================================
// LAYANAN GROQ DENGAN DUAL MODEL FALLBACK
// Model utama: qwen/qwen3.8-27b
// Model cadangan: qwen/qwen3.6-27b (dipakai saat utama kena limit)
// ============================================================
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
export const GROQ_PRIMARY_MODEL = 'qwen/qwen3.8-27b';
export const GROQ_FALLBACK_MODEL = 'qwen/qwen3.6-27b';

const callGroq = async function (apiKey, model, prompt, maxTokens) {
  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: maxTokens || 300,
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

export const callGroqWithFallback = async function (prompt, maxTokens) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY belum diisi pada .env.local');
  try {
    return await callGroq(apiKey, GROQ_PRIMARY_MODEL, prompt, maxTokens);
  } catch (primaryErr) {
    const retryable = !primaryErr.status || primaryErr.status === 429 || primaryErr.status >= 500;
    if (!retryable) throw primaryErr;
    console.warn('[Groq] Model utama gagal, memakai cadangan:', primaryErr.message);
    return await callGroq(apiKey, GROQ_FALLBACK_MODEL, prompt, maxTokens);
  }
};

const cleanThink = function (t) {
  return (t || '').replace(/[\s\S]*<\/think>\s*/g, '').trim();
};

// ============================================================
// UTILITAS PERBAIKAN JSON
// Model bahasa kadang mengembalikan JSON yang sedikit cacat:
// kutip ganda lupa di-escape, koma trailing, atau output terpotong
// batas token. Lapisan ini memperbaiki kasus umum sebelum
// JSON.parse dipanggil, plus menyelamatkan hasil parsial.
// ============================================================

// Mengamankan kutip ganda di dalam string. Kutip yang TIDAK diikuti
// karakter struktural (, } ] :) dianggap kutip internal, lalu
// di-escape agar JSON tetap valid. JSON yang sudah valid lolos
// tanpa perubahan sama sekali.
const repairInnerQuotes = function (text) {
  let out = '';
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (!inString) {
      if (ch === '"') inString = true;
      out += ch;
      continue;
    }
    if (ch === '\\') {
      out += ch + (text[i + 1] || '');
      i++;
      continue;
    }
    if (ch === '"') {
      let j = i + 1;
      while (j < text.length && /\s/.test(text[j])) j++;
      const next = text[j];
      if (next === ',' || next === '}' || next === ']' || next === ':' || next === undefined) {
        inString = false;
        out += ch;
      } else {
        out += '\\"';
      }
      continue;
    }
    out += ch;
  }
  return out;
};

const removeTrailingCommas = function (text) {
  return text.replace(/,\s*([}\]])/g, '$1');
};

// Menutup kurung yang masih terbuka berdasarkan stack, dipakai
// untuk menyelamatkan JSON yang terpotong di tengah jalan.
const closeOpenStructures = function (text) {
  const stack = [];
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === '\\') i++;
      else if (ch === '"') inString = false;
    } else if (ch === '"') {
      inString = true;
    } else if (ch === '{' || ch === '[') {
      stack.push(ch);
    } else if (ch === '}' || ch === ']') {
      stack.pop();
    }
  }
  let out = text.replace(/,\s*$/, '');
  for (let i = stack.length - 1; i >= 0; i--) {
    out += stack[i] === '{' ? '}' : ']';
  }
  return out;
};

// Memotong output di batas objek utuh terakhir lalu menutup semua
// kurung, supaya tabel yang sudah lengkap tetap bisa dipakai walau
// output AI terpotong batas token.
const salvageTruncated = function (text) {
  let search = text;
  while (search.length) {
    const lastClose = search.lastIndexOf('}');
    if (lastClose === -1) return null;
    const cut = search.slice(0, lastClose + 1);
    const closed = closeOpenStructures(cut);
    try {
      const parsed = JSON.parse(closed);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (e) {}
    search = search.slice(0, lastClose);
  }
  return null;
};

const parseSchemaJson = function (rawText) {
  const cleaned = cleanThink(rawText).replace(/```json|```/gi, '').trim();
  const start = cleaned.indexOf('[');
  if (start === -1) throw new Error('AI tidak mengembalikan daftar tabel');
  const end = cleaned.lastIndexOf(']');
  const body = end > start ? cleaned.slice(start, end + 1) : cleaned.slice(start);

  const repaired = removeTrailingCommas(repairInnerQuotes(body));
  const candidates = [body, removeTrailingCommas(body), repairInnerQuotes(body), repaired];

  let lastErr = null;
  for (let i = 0; i < candidates.length; i++) {
    try {
      const parsed = JSON.parse(candidates[i]);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) { lastErr = e; }
  }

  const salvaged = salvageTruncated(repaired);
  if (salvaged) {
    console.warn('[Groq] JSON schema terpotong, dipakai sebagian:', salvaged.length, 'tabel');
    return salvaged;
  }

  console.error('[Groq] JSON schema tidak bisa diparse:', lastErr, rawText);
  throw new Error('Format JSON dari AI tidak dapat dibaca. Silakan coba sekali lagi.');
};

// ============================================================
// GENERATOR TAGLINE SAMPUL (dipakai tombol "Pakai saran AI")
// ============================================================
export const generateCoverTagline = async function (goalText) {
  const prompt = 'Kamu adalah copywriter dokumen korporat senior. Tulis SATU tagline untuk sampul dokumen PRD yang menangkap INTI produk dari teks "Tujuan Produk" di bawah.\n' +
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
    'Teks: """' + goalText + '"""\nTagline:';
  const raw = await callGroqWithFallback(prompt, 80);
  return cleanThink(raw)
    .split('\n')[0]
    .replace(/^tagline\s*:\s*/i, '')
    .replace(/\*\*/g, '')
    .replace(/["']/g, '')
    .replace(/[.!?]+$/, '')
    .trim();
};

// ============================================================
// MODE PERHALUS TEKS (untuk tombol wand di kolom editor)
// ============================================================
const MODE_INSTRUCTIONS = {
  paragraph: 'Tulis ulang sebagai paragraf profesional bergaya dokumentasi Product Manager. Bahasa Indonesia formal, jelas, dan enak dibaca. Jangan mengubah makna.',
  list: 'Tulis ulang setiap baris menjadi poin profesional bergaya dokumentasi produk. Pertahankan jumlah poin dan urutan baris. Satu poin per baris, tanpa bullet, tanpa nomor.',
  phrase: 'Tulis ulang sebagai frasa singkat profesional maksimal 12 kata, tanpa titik di akhir.',
  name: 'Rapikan penulisan menjadi Title Case yang konsisten. Jangan menambah atau menghapus kata.',
  technical: 'Tulis ulang sebagai spesifikasi teknis profesional. Jangan mengubah nama teknologi, angka, standar, atau protokol. Pertahankan format singkat.',
  flow: 'Rapikan alur menjadi langkah berurutan dengan nama langkah profesional. Pisahkan langkah dengan " -> ". Jangan menambah langkah baru.',
};

export const refineText = async function (text, mode) {
  const instruction = MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.paragraph;
  const prompt = 'Kamu editor profesional dokumen Product Requirement Document berbahasa Indonesia.\n' +
    'Tugasmu: perhalus draf kasar berikut menjadi tulisan profesional berstandar dokumentasi Product Manager.\n' +
    'Aturan khusus:\n' + instruction + '\n' +
    'Aturan umum:\n' +
    '1. Jangan menambah fakta, angka, fitur, atau teknologi yang tidak ada di draf.\n' +
    '2. Jangan menghapus poin penting dari draf.\n' +
    '3. Jangan memberi penjelasan atau awalan. Output HANYA teks hasil.\n\n' +
    'Draf kasar: """' + text + '"""\nHasil:';
  const raw = await callGroqWithFallback(prompt, 400);
  return cleanThink(raw).replace(/^["']+|["']+$/g, '').trim();
};

// ============================================================
// GENERATOR SCHEMA DARI USER FLOW
// Kini tahan banting: JSON cacat diperbaiki dulu, JSON terpotong
// diselamatkan sebagian, dan pesan error dibuat ramah user.
// ============================================================
export const generateSchemaFromFlow = async function (flowText) {
  const prompt = 'Kamu System Analyst senior. Dari alur pengguna (user flow) aplikasi berikut, identifikasi entitas data utama lalu rancang skema database relasional yang masuk akal untuk MVP.\n' +
    'Aturan:\n' +
    '1. Output HANYA JSON array valid, tanpa markdown fence, tanpa penjelasan.\n' +
    '2. Bentuk setiap elemen: {"name":"nama_tabel","desc":"fungsi tabel dalam konteks bisnis","fields":[{"field":"nama_kolom","type":"TIPE","required":"Ya","note":"catatan singkat"}]}\n' +
    '3. Gunakan tipe SQL umum: BIGINT, VARCHAR, TEXT, DECIMAL, BOOLEAN, TIMESTAMP, ENUM.\n' +
    '4. Setiap tabel wajib punya kolom id sebagai primary key dan foreign key berakhiran _id untuk relasi.\n' +
    '5. Maksimal 6 tabel dan maksimal 6 kolom per tabel agar output tidak terpotong.\n' +
    '6. JANGAN pakai tanda kutip ganda di dalam nilai string. Jika perlu kutip, gunakan tanda kutip tunggal.\n' +
    '7. JANGAN gunakan koma di akhir sebelum penutup kurung (trailing comma).\n' +
    '8. Pastikan JSON lengkap sampai kurung penutup terakhir.\n\n' +
    'User flow: """' + flowText + '"""\nJSON:';
  const raw = await callGroqWithFallback(prompt, 1600);
  const tables = parseSchemaJson(raw);
  if (!tables.length) throw new Error('AI tidak menghasilkan tabel');
  return tables.map(function (t, ti) {
    return {
      name: String(t.name || 'tabel_' + (ti + 1)).toLowerCase().replace(/\s+/g, '_'),
      desc: String(t.desc || ''),
      fields: Array.isArray(t.fields) ? t.fields.map(function (fi) {
        return {
          field: String(fi.field || 'kolom'),
          type: String(fi.type || 'VARCHAR'),
          required: fi.required === 'Opsional' ? 'Opsional' : 'Ya',
          note: String(fi.note || ''),
        };
      }) : [],
    };
  });
};