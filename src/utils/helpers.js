export const escapeHtml = function (s) { return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
export const isValidHex = function (s) { return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test((s||'').trim()); };
export const normalizeHex = function (h) {
  if (!h) return '#000000';
  let s = h.trim();
  if (!s.startsWith('#')) s = '#' + s;
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  if (/^#[0-9A-Fa-f]{3}$/.test(s)) return '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
  return '#000000';
};
export const liveHexColor = function (digits) {
  let s = (digits||'').replace(/[^0-9A-Fa-f]/g,'');
  if (!s) return null;
  if (s.length===3) s = s.split('').map(function (c) { return c + c; }).join('');
  if (s.length!==6) { let o=''; while (o.length<6) o+=s; s = o.slice(0,6); }
  return '#' + s;
};
export const formatTargetDate = function (value, format) {
  if (!value) return '-';
  const d = new Date(value+'T00:00:00');
  if (isNaN(d.getTime())) return '-';
  const months=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const month=months[d.getMonth()], year=d.getFullYear();
  if (format==='month') return month + ' ' + year;
  if (format==='quarter') return 'Q' + (Math.floor(d.getMonth()/3)+1) + ' ' + year;
  return d.getDate() + ' ' + month + ' ' + year;
};
export const buildBreakpoints = function (fields) {
  const pairs=[['Mobile','bpMobile'],['Tablet','bpTablet'],['Desktop','bpDesktop']];
  const parts=[];
  pairs.forEach(function (pair) {
    const label=pair[0], key=pair[1];
    const num=(fields[key]||'').trim();
    if (!num) return;
    parts.push(label + ' ' + (fields[key+'Op']||'') + num + (fields[key+'Unit']||''));
  });
  return parts.join(' · ');
};

// ============================================================
// UTILITAS WARNA (hex, RGB, HSL)
// ============================================================
const hexToRgb = function (hex) {
  const h = normalizeHex(hex);
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  };
};
const rgbToHex = function (r, g, b) {
  const to2 = function (c) {
    const v = Math.max(0, Math.min(255, Math.round(c)));
    return v.toString(16).padStart(2, '0');
  };
  return '#' + to2(r) + to2(g) + to2(b);
};
const rgbToHsl = function (r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return { h: h, s: s, l: l };
};
const hslToRgb = function (h, s, l) {
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  const hue2rgb = function (p, q, t) {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: hue2rgb(p, q, h + 1 / 3) * 255,
    g: hue2rgb(p, q, h) * 255,
    b: hue2rgb(p, q, h - 1 / 3) * 255,
  };
};
// Gelapkan warna hex dengan faktor 0 sampai 1 (0 = hitam pekat)
export const shadeHex = function (hex, factor) {
  const h = normalizeHex(hex);
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  const to2 = function (c) {
    const v = Math.max(0, Math.min(255, Math.round(c * factor)));
    return v.toString(16).padStart(2, '0');
  };
  return '#' + to2(r) + to2(g) + to2(b);
};
// Versi warna yang aman dibaca sebagai teks di latar putih.
// Warna terang digelapkan lebih kuat agar kontras tetap terjaga.
export const textSafeHex = function (hex) {
  const h = normalizeHex(hex);
  const r = parseInt(h.slice(1, 3), 16) / 255;
  const g = parseInt(h.slice(3, 5), 16) / 255;
  const b = parseInt(h.slice(5, 7), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const factor = lum > 0.65 ? 0.55 : lum > 0.45 ? 0.7 : 0.85;
  return shadeHex(h, factor);
};

// ============================================================
// SANITASI AKSEN (PENDEKATAN 2)
// Warna brand boleh masuk sampul hanya sebagai aksen, dan harus
// dinormalisasi agar tidak norak, tidak menyilaukan, dan tetap
// terlihat jelas di atas latar gelap.
// ============================================================
const sanitizeAccent = function (hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const s = Math.max(0.35, Math.min(0.85, hsl.s));
  const l = Math.max(0.45, Math.min(0.68, hsl.l));
  const out = hslToRgb(hsl.h, s, l);
  return rgbToHex(out.r, out.g, out.b);
};
// Turunan nada gelap dari satu warna, untuk aksen sekunder
// (bar bawah) agar seragam dengan warna utama.
const deriveDarkTone = function (hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const s = Math.max(0.3, Math.min(0.75, hsl.s));
  const l = Math.max(0.3, Math.min(0.45, hsl.l));
  const out = hslToRgb(hsl.h, s, l);
  return rgbToHex(out.r, out.g, out.b);
};

// ============================================================
// RESOLVER TEMA SAMPUL, FOOTER, & DOKUMEN
// MODE OTOMATIS (PENDEKATAN 2):
// 1. Latar sampul dikunci ke charcoal #15171C, tidak ikut brand,
//    sehingga teks putih/abu selalu terbaca dan tampil elegan.
// 2. Warna brand hanya jadi aksen tipis (bar, garis, label).
// 3. Warna tidak layak (putih, hitam, abu, terlalu pucat atau
//    terlalu gelap) otomatis dilewati.
// 4. Warna utama = warna layak pertama sesuai urutan palette
//    (menghormati hierarki brand), aksen sekunder = warna layak
//    berikutnya dengan hue berbeda. Jika tidak ada, dipakai
//    nada gelap dari warna utama.
// 5. Jika tidak ada warna layak sama sekali, fallback ke emas
//    #C9A961 yang selalu aman di latar gelap.
// MODE MANUAL: pilihan user dihormati apa adanya.
// ============================================================
export const resolveCoverTheme = function (fields, palette) {
  const FALLBACK = '#C9A961';
  const FIXED_BG = '#15171C';
  const f = fields || {};
  if (f.coverThemeAuto === false) {
    const primary = isValidHex(f.coverPrimary) ? normalizeHex(f.coverPrimary) : FALLBACK;
    const accent = isValidHex(f.coverAccent) ? normalizeHex(f.coverAccent) : deriveDarkTone(primary);
    const bg = isValidHex(f.coverBg) ? normalizeHex(f.coverBg) : FIXED_BG;
    return {
      primary: primary,
      accent: accent,
      bg: bg,
      primaryText: textSafeHex(primary),
      accentText: textSafeHex(accent),
    };
  }
  const suitable = [];
  (palette || []).forEach(function (p) {
    if (!isValidHex(p.hex)) return;
    const hex = normalizeHex(p.hex);
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    // Lewati abu-abu/putih/hitam (saturation rendah)
    // dan warna terlalu gelap atau terlalu pucat.
    if (hsl.s >= 0.22 && hsl.l >= 0.22 && hsl.l <= 0.88) {
      suitable.push({ hex: hex, hsl: hsl });
    }
  });
  let primary = FALLBACK;
  if (suitable.length) primary = sanitizeAccent(suitable[0].hex);
  let accent = '';
  for (let i = 1; i < suitable.length; i++) {
    const dh = Math.abs(suitable[i].hsl.h - suitable[0].hsl.h);
    const hueDist = Math.min(dh, 1 - dh);
    if (hueDist > 0.08) {
      accent = sanitizeAccent(suitable[i].hex);
      break;
    }
  }
  if (!accent) accent = deriveDarkTone(primary);
  return {
    primary: primary,
    accent: accent,
    bg: FIXED_BG,
    primaryText: textSafeHex(primary),
    accentText: textSafeHex(accent),
  };
};

// ============================================================
// HASH CACHE UNTUK TAGLINE
// hashText mendeteksi perubahan teks agar pemanggilan AI tidak
// berulang untuk teks yang sama.
// TAGLINE_HASH_VERSION dinaikkan setiap kali prompt AI berubah,
// agar cache tagline lama otomatis dianggap basi dan dibuat ulang.
// ============================================================
export const hashText = function (s) {
  let h = 5381;
  const str = (s || '');
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return 'h' + (h >>> 0).toString(36) + '-' + str.length;
};

export const TAGLINE_HASH_VERSION = 'v3';

export const taglineHash = function (text) {
  return hashText((text || '') + '|' + TAGLINE_HASH_VERSION);
};

// ============================================================
// PERINGKAS TEKS SAMPUL (FALLBACK HEURISTIK)
// Memotong di batas klausa alami (koma atau kata sambung) lalu
// mengakhiri hasil dengan titik. TIDAK ADA elipsis, sehingga
// sampul selalu terlihat bersih dan profesional.
// ============================================================
const CLAUSE_MARKERS = [' dan ', ' serta ', ' atau ', ' sehingga ', ' agar ', ' untuk ', ' dengan ', ' yang '];

export const summarizeForCover = function (text, max) {
  if (!text || !text.trim()) return '';
  let s = text.trim().split('\n')[0];
  const sentenceEnd = s.indexOf('. ');
  if (sentenceEnd > -1) s = s.slice(0, sentenceEnd);
  s = s.replace(/[.!?]+$/, '').trim();
  if (!s) return '';
  if (s.length <= max) return s + '.';
  const cut = s.slice(0, max);
  let pos = cut.lastIndexOf(',');
  if (pos < 40) {
    CLAUSE_MARKERS.forEach(function (w) {
      const p = cut.lastIndexOf(w);
      if (p > pos) pos = p;
    });
  }
  if (pos < 40) pos = cut.lastIndexOf(' ');
  const clean = s.slice(0, pos).replace(/[\s,;:]+$/, '').trim();
  return (clean || cut.trim()) + '.';
};

// ============================================================
// TITLE CASE UNTUK SUBTITLE SAMPUL
// Mengkapitalisasi huruf awal setiap kata, kecuali kata
// penghubung, kata depan, dan partikel (dan, untuk, di, yang,
// hingga, dll) sesuai kaidah judul EYD.
// Kata pertama dan terakhir selalu dikapitalisasi.
// Kata ber-hyphen dikapitalisasi per bagiannya, sehingga
// "real-time" menjadi "Real-Time".
// ============================================================
const TITLE_SMALL_WORDS = {
  dan: 1, atau: 1, serta: 1, tetapi: 1, tapi: 1, sedangkan: 1, melainkan: 1, padahal: 1,
  bahwa: 1, karena: 1, sebab: 1, sehingga: 1, hingga: 1, agar: 1, supaya: 1,
  jika: 1, kalau: 1, bila: 1, ketika: 1, saat: 1, sejak: 1, semenjak: 1, selama: 1,
  setelah: 1, sesudah: 1, sebelum: 1, maka: 1, yaitu: 1, yakni: 1, yang: 1,
  di: 1, ke: 1, dari: 1, pada: 1, kepada: 1, dalam: 1, bagi: 1, untuk: 1, buat: 1,
  tentang: 1, mengenai: 1, oleh: 1, terhadap: 1, menurut: 1, berdasarkan: 1,
  sekitar: 1, sepanjang: 1, menjelang: 1, menuju: 1,
  pun: 1, per: 1, si: 1, sang: 1,
};

const capWord = function (w) {
  return w.split('-').map(function (part) {
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('-');
};

export const titleCaseForCover = function (text) {
  const s = (text || '').trim();
  if (!s) return '';
  const tokens = s.split(/\s+/);
  return tokens.map(function (w, i) {
    const lower = w.toLowerCase();
    const isSmall = Object.prototype.hasOwnProperty.call(TITLE_SMALL_WORDS, lower);
    if (isSmall && i !== 0 && i !== tokens.length - 1) return lower;
    return capWord(w);
  }).join(' ');
};