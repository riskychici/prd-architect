import { usePreviewStore as usePrdStore } from '../../store/usePreviewStore';
import { formatTargetDate, titleCaseForCover } from '../../utils/helpers';

export default function CoverPage() {
  const f = usePrdStore(function (s) { return s.fields; });
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const features = usePrdStore(function (s) { return s.features; });

  const kicker = (f.coverKicker || '').trim() || 'PRODUCT REQUIREMENT DOCUMENT';
  const words = (f.projectName || 'PROYEK TANPA NAMA').toUpperCase().split(/\s+/).filter(Boolean);
  const firstWord = words[0] || '';
  const restWords = words.slice(1).join(' ');

  const rawSubtitle = (f.coverSubtitle || '').trim();
  const subtitle = rawSubtitle ? titleCaseForCover(rawSubtitle) : 'Dokumen Spesifikasi Produk';

  const featureLine = features.length
    ? features.slice(0, 4).map(function (ft) {
        let name = (ft.name || ft.id || '').trim();
        if (name.length > 25) {
          const cut = name.slice(0, 22);
          const lastSpace = cut.lastIndexOf(' ');
          name = cut.slice(0, lastSpace > 12 ? lastSpace : 22).trimEnd() + '...';
        }
        return name;
      }).join(' \u00B7 ')
    : 'Overview \u00B7 Fitur Utama \u00B7 Tech Stack';

  const vis = function (key) { return mode === 'enterprise' || se[key] === true; };
  const scope = ['Overview & Goals'];
  if (vis('persona')) scope.push('Target User Persona & Success Metrics');
  if (vis('branding')) scope.push('Branding & Design System');
  if (vis('roles')) scope.push('Role & Permission Matrix');
  scope.push('Fitur Utama & Requirements');
  if (vis('ac')) scope.push('Acceptance Criteria per Modul');
  scope.push('User Flow');
  scope.push('Tech Stack & Arsitektur');
  if (vis('schema')) scope.push('Schema Data');
  if (vis('nfr')) scope.push('Non-Functional Requirements');
  scope.push('Out of Scope & Definition of Done');

  const today = new Date();
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const createdDate = today.getDate() + ' ' + months[today.getMonth()] + ' ' + today.getFullYear();
  const targetDate = formatTargetDate(f.targetDate, f.targetDateFormat);
  const owner = (f.author || '').trim() || '-';
  const status = f.docStatus || 'Draft';
  const labelCls = 'meta-label text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap';
  const valueCls = 'mt-1 text-[11px] text-slate-400';

  return (
    <div className="doc-cover relative flex flex-col w-full max-w-2xl mx-auto mb-6 overflow-hidden rounded-lg shadow-2xl text-slate-300 min-h-[780px]" style={{ background: 'var(--doc-bg, #15171C)' }}>
      <div className="h-8 w-full" style={{ background: 'var(--doc-primary, #C9A961)' }} />
      <div className="cover-body flex-1 flex flex-col px-8 md:px-14 pt-16 md:pt-20 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide text-white leading-tight">
          {firstWord}
          {restWords && <span style={{ color: 'var(--doc-primary, #C9A961)' }}> {restWords}</span>}
        </h1>
        <div className="mt-5 h-[3px] w-16" style={{ background: 'var(--doc-accent, #AB883A)' }} />
        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: 'var(--doc-primary, #C9A961)' }}>{kicker}</p>
        <h2 className="mt-3 max-w-[85%] text-xl md:text-2xl font-bold leading-snug text-white" title={rawSubtitle || 'Isi lewat section Sampul & Footer Dokumen'}>
          {subtitle}
        </h2>
        <p className="mt-5 text-xs text-slate-400">{featureLine}</p>
        <div className="mt-8 border-l-[3px] px-5 py-4" style={{ borderColor: 'var(--doc-primary, #C9A961)', background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--doc-primary, #C9A961)' }}>Ruang Lingkup Dokumen</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">{scope.join(' \u00B7 ')}</p>
        </div>
        <div className="flex-1 min-h-6" />
        <div className="cover-meta grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-5 border-t border-slate-700 pt-4">
          <div>
            <p className={labelCls} style={{ color: 'var(--doc-primary, #C9A961)' }}>Versi</p>
            <p className={valueCls}>{f.docVersion || '1.0'}</p>
          </div>
          <div>
            <p className={labelCls} style={{ color: 'var(--doc-primary, #C9A961)' }}>Bahasa</p>
            <p className={valueCls}>Indonesia</p>
          </div>
          <div>
            <p className={labelCls} style={{ color: 'var(--doc-primary, #C9A961)' }}>Target Rilis</p>
            <p className={valueCls}>{targetDate}</p>
          </div>
          <div>
            <p className={labelCls} style={{ color: 'var(--doc-primary, #C9A961)' }}>Tanggal Dibuat</p>
            <p className={valueCls}>{createdDate}</p>
          </div>
          <div>
            <p className={labelCls} style={{ color: 'var(--doc-primary, #C9A961)' }}>Owner</p>
            <p className={valueCls}>{owner}</p>
          </div>
          <div>
            <p className={labelCls} style={{ color: 'var(--doc-primary, #C9A961)' }}>Status</p>
            <p className={valueCls}>{status}</p>
          </div>
        </div>
      </div>
      <div className="h-8 w-full" style={{ background: 'var(--doc-accent, #AB883A)' }} />
    </div>
  );
}
