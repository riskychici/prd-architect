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
  return parts.join(' \u00B7 ');
};
