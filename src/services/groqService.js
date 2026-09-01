// ============================================================
// LAYANAN AI VIA OPENROUTER (MODEL: google/gemma-4-31b-it:free)
// Menggantikan Groq khusus untuk fitur Qwen (Refine Text, 
// Tagline Sampul, Generate Schema).
// Fitur Analisis PRD Besar (Gemini) di usePrdStore.js tidak disentuh.
// ============================================================

// 1. ENDPOINT OPENROUTER
const AI_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

// 2. MODEL GRATIS DARI GOOGLE
export const AI_MODEL = 'google/gemma-4-31b-it:free';

// Instruksi agar model tidak membuang token untuk "berpikir"
const NO_THINK_SUFFIX =
  '\n\nPENTING: Jangan menulis proses berpikir, jangan pakai tag think, ' +
  'dan jangan memberi penjelasan apa pun. Langsung tulis hasil akhirnya saja.\n/no_think';

// 3. FUNGSI PANGGILAN API DASAR
const callAi = async function (apiKey, model, prompt, maxTokens) {
  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + apiKey,
      // Header wajib OpenRouter agar aplikasi terdaftar di dashboard mereka
      'HTTP-Referer': window.location.origin,
      'X-Title': 'PRD Architect Pro'
    },
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

// Wrapper fallback (disederhanakan karena hanya pakai 1 model gratis)
export const callGroqWithFallback = async function (prompt, maxTokens) {
  // Mengambil key OpenRouter dari environment variable
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('VITE_OPENROUTER_API_KEY belum diisi pada .env.local');
  
  try {
    return await callAi(apiKey, AI_MODEL, prompt, maxTokens);
  } catch (err) {
    console.warn('[OpenRouter] Request gagal:', err.message);
    throw err;
  }
};

// ============================================================
// PEMBERSIH BLOK THINKING (TETAP SAMA)
// ============================================================
const cleanThink = function (t) {
  let s = (t || '');
  s = s.replace(/[\s\S]*?<\/think>/gi, '');
  s = s.replace(/<think>[\s\S]*$/gi, '');
  s = s.replace(/[\s\S]*?<\/think>/gi, '');
  return s.trim();
};

const callGroqClean = async function (prompt, maxTokens) {
  const raw = await callGroqWithFallback(prompt, maxTokens);
  let out = cleanThink(raw).trim();
  if (!out) {
    console.warn('[OpenRouter] Output habis untuk thinking, mengulang sekali dengan instruksi langsung...');
    const raw2 = await callGroqWithFallback(
      prompt + '\n\nPERINTAH ULANG: Jangan menulis proses berpikir sama sekali. Langsung tulis hasil akhirnya saja sekarang.',
      maxTokens
    );
    out = cleanThink(raw2).trim();
  }
  return out;
};

// ============================================================
// GENERATOR TAGLINE SAMPUL (TETAP SAMA)
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
    'Teks: """' + goalText + '"""\n' +
    'Tagline:' + NO_THINK_SUFFIX;
    
  const out = await callGroqClean(prompt, 2048);
  return out
    .split('\n')[0]
    .replace(/^tagline\s*:\s*/i, '')
    .replace(/\*\*/g, '')
    .replace(/["']/g, '')
    .replace(/[.!?]+$/, '')
    .trim();
};

// ============================================================
// MODE PERHALUS TEKS / TOMBOL WAND (TETAP SAMA)
// ============================================================
const MODE_INSTRUCTIONS = {
  paragraph: 'Tulis ulang menjadi 1 sampai 3 kalimat padat bergaya dokumentasi Product Manager. ' +
    'Langsung ke inti: sebutkan subjek, masalah atau tujuan, dan dampak atau metrik kunci bila ada. ' +
    'Buang basa-basi dan frasa birokratis, tetapi JANGAN buang fakta, angka, atau poin penting dari draf. ' +
    'Gunakan kalimat aktif yang jelas dan profesional, bukan poin-poin telegrafis.',
  list: 'Tulis ulang setiap baris menjadi poin profesional yang jelas, maksimal 15 kata per poin. ' +
    'Pertahankan jumlah poin, urutan baris, dan seluruh informasi dari draf. Satu poin per baris, tanpa bullet, tanpa nomor.',
  phrase: 'Tulis ulang sebagai frasa singkat profesional maksimal 10 kata, tanpa titik di akhir.',
  name: 'Rapikan penulisan menjadi Title Case yang konsisten. Jangan menambah atau menghapus kata.',
  technical: 'Tulis ulang sebagai spesifikasi teknis yang rapi dan profesional. Jangan mengubah nama teknologi, angka, standar, atau protokol. Boleh terdiri dari beberapa frasa yang dipisah koma.',
  flow: 'Rapikan alur menjadi langkah berurutan dengan nama langkah yang profesional dan jelas. Pisahkan langkah dengan " -> ". Jangan menambah langkah baru.',
};

export const refineText = async function (text, mode, context) {
  const instruction = MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.paragraph;
  const example = mode === 'paragraph'
    ? 'Contoh gaya yang diinginkan (profesional, jelas, langsung ke inti, tidak bertele-tele):\n' +
      'Draf: "user suka bingung nyari tombol print trs app suka ngecrash pas upload"\n' +
      'Hasil: "Pengguna kesulitan menemukan tombol cetak, dan aplikasi sering gagal saat mengunggah berkas."\n\n' +
      'Draf: "pelanggan harus antri lama tanpa kepastian jadwal, pemilik susah atur kursi kosong"\n' +
      'Hasil: "Pelanggan mengantre lama tanpa kepastian jadwal, sementara pemilik kesulitan mengisi kursi kosong."\n\n'
    : '';
  const contextRule = context
    ? '7. KOLOM TUJUAN: "' + context + '". Hasil WAJIB berada dalam fokus kolom tersebut. ' +
      'Jika perlu, ubah sudut pandang kalimat agar cocok dengan tujuan kolom ' +
      '(misalnya dari deskripsi fitur menjadi rumusan masalah dan pain point pengguna ' +
      'untuk kolom Problem Statement atau Latar Belakang, atau menjadi target terukur ' +
      'untuk kolom Goals atau Tujuan), tanpa menambah atau mengurangi inti informasi dari draf.\n'
    : '';
  const prompt = 'Kamu adalah penulis dokumentasi produk senior. Hasil harus profesional, jelas, dan langsung ke inti.\n' +
    'Tugasmu: perhalus BAHASA draf kasar berikut menjadi tulisan berstandar dokumentasi Product Manager, tanpa memperpanjang isinya.\n' +
    'Aturan khusus:\n' + instruction + '\n' +
    example +
    'Aturan umum:\n' +
    '1. Jangan menambah fakta, angka, fitur, atau teknologi yang tidak ada di draf.\n' +
    '2. Jangan membuang fakta penting: angka, entitas, dan poin inti draf wajib muncul.\n' +
    '3. Jangan memberi penjelasan atau awalan. Output HANYA teks hasil.\n' +
    '4. JANGAN memperpanjang draf: hasil maksimal sepanjang draf, idealnya lebih ringkas. Dilarang bertele-tele.\n' +
    '5. Hindari frasa birokratis dan klise seperti: secara paralel, kondisi ini mencerminkan, guna, diharapkan dapat, bertujuan untuk, melakukan proses, dalam rangka, secara signifikan.\n' +
    '6. Gunakan kalimat aktif yang jelas dan istilah industri yang wajar (unggah, unduh, dasbor, antrean, autentikasi).\n' +
    contextRule +
    '\nDraf kasar: """' + text + '"""\nHasil:' + NO_THINK_SUFFIX;
    
  const out = await callGroqClean(prompt, 4096);
  return out
    .replace(/^hasil\s*:\s*/i, '')
    .replace(/^["']+|["']+$/g, '')
    .trim();
};

// ============================================================
// GENERATOR SCHEMA DARI USER FLOW (TETAP SAMA)
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
    'User flow: """' + flowText + '"""\nJSON:' + NO_THINK_SUFFIX;
    
  let raw = await callGroqWithFallback(prompt, 4096);
  
  if (cleanThink(raw).indexOf('[') === -1 && /<think/i.test(raw)) {
    console.warn('[OpenRouter] Schema habis untuk thinking, mengulang sekali...');
    raw = await callGroqWithFallback(
      prompt + '\n\nPERINTAH ULANG: Jangan menulis proses berpikir. Langsung tulis JSON array sekarang.',
      4096
    );
  }
  
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

// ============================================================
// PARSER JSON SCHEMA YANG TAHAN BANTING (TETAP SAMA)
// ============================================================
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

const BT = String.fromCharCode(96);
const FENCE_RE = new RegExp(BT + '{3,}json|' + BT + '{3,}', 'gi');

const parseSchemaJson = function (rawText) {
  const cleaned = cleanThink(rawText).replace(FENCE_RE, '').trim();
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
    console.warn('[OpenRouter] JSON schema terpotong, dipakai sebagian:', salvaged.length, 'tabel');
    return salvaged;
  }
  console.error('[OpenRouter] JSON schema tidak bisa diparse:', lastErr, rawText);
  throw new Error('Format JSON dari AI tidak dapat dibaca. Silakan coba sekali lagi.');
};
