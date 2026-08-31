import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { usePreviewStore as usePrdStore } from '../../store/usePreviewStore';
import { formatTargetDate, resolveCoverTheme, summarizeForCover, taglineHash, titleCaseForCover } from '../../utils/helpers';

export default function CoverPage() {
  const f = usePrdStore(function (s) { return s.fields; });
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const features = usePrdStore(function (s) { return s.features; });
  const palette = usePrdStore(function (s) { return s.palette; });

  const theme = resolveCoverTheme(f, palette);

  const kicker = (f.coverKicker || '').trim() || 'PRODUCT REQUIREMENT DOCUMENT';
  const words = (f.projectName || 'PROYEK TANPA NAMA').toUpperCase().split(/\s+/).filter(Boolean);
  const firstWord = words[0] || '';
  const restWords = words.slice(1).join(' ');

  const goalText = (f.productGoal || '').trim();
  const autoTagline = (f.coverTagline || '').trim();
  const taglineValid = !!autoTagline && f.coverTaglineHash === taglineHash(goalText);

  // Subtitle mentah (heuristik atau AI), lalu diformat Title Case
  // agar tampil seperti judul dokumen profesional.
  const rawSubtitle = (taglineValid ? autoTagline : summarizeForCover(goalText, 90)) || 'Dokumen Spesifikasi Produk';
  const subtitle = titleCaseForCover(rawSubtitle);

  // Deteksi momen subtitle "naik kelas" dari heuristik ke hasil AI,
  // supaya animasi transisi dijalankan tepat satu kali dan user
  // menyadari bahwa ini fitur, bukan bug.
  const [upgraded, setUpgraded] = useState(false);
  const prevValidRef = useRef(false);

  useEffect(function () {
    if (taglineValid && !prevValidRef.current) {
      prevValidRef.current = true;
      setUpgraded(true);
      const t = setTimeout(function () { setUpgraded(false); }, 800);
      return function () { clearTimeout(t); };
    }
    if (!taglineValid) prevValidRef.current = false;
    return undefined;
  }, [taglineValid]);

  const featureLine = features.length
    ? features.slice(0, 4).map(function (ft) { return ft.name || ft.id; }).join(' · ')
    : 'Overview · Fitur Utama · Tech Stack';

  const descLine = summarizeForCover(f.problemStatement, 140) || 'Latar belakang masalah dan tujuan pengembangan produk.';

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
    <div className="doc-cover relative flex flex-col w-full max-w-2xl mx-auto mb-6 overflow-hidden rounded-lg shadow-2xl text-slate-300 min-h-[780px]" style={{ background: theme.bg }}>
      <div className="h-8 w-full" style={{ background: theme.primary }} />

      <div className="cover-body flex-1 flex flex-col px-8 md:px-14 pt-16 md:pt-20 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide text-white leading-tight">
          {firstWord}
          {restWords && <span style={{ color: theme.primary }}> {restWords}</span>}
        </h1>

        <div className="mt-5 h-[3px] w-16" style={{ background: theme.accent }} />

        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: theme.primary }}>{kicker}</p>

        {/* Subtitle sampul berformat Title Case:
            - key berubah saat sumber berganti (heuristik ke AI) agar
              animasi fade-in jalan tepat pada momen pergantian.
            - Saat user mengetik (heuristik), tidak ada animasi,
              sehingga tidak ada flicker per ketikan.
            - Chip AI hanya tampil di layar, hilang saat print. */}
        <h2
          key={(taglineValid ? 'ai-' : 'heur-') + subtitle}
          className={'mt-3 max-w-[85%] text-xl md:text-2xl font-bold leading-snug text-white' + (upgraded ? ' cover-subtitle-in' : '')}
          title={f.productGoal || ''}
        >
          {subtitle}
          {taglineValid && (
            <span
              className="cover-fade-in no-print ml-2 inline-flex items-center gap-1 align-middle text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40"
              title="Subtitle ini diringkas otomatis oleh AI dari kolom Tujuan Utama Produk"
            >
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[8px]" />
              AI
            </span>
          )}
        </h2>

        <p className="mt-5 text-xs text-slate-400">{featureLine}</p>

        <p className="mt-2 text-xs text-slate-400" title={f.problemStatement || ''}>
          {descLine}
        </p>

        <div className="mt-8 border-l-[3px] px-5 py-4" style={{ borderColor: theme.primary, background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: theme.primary }}>Ruang Lingkup Dokumen</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">{scope.join(' · ')}</p>
        </div>

        <div className="flex-1 min-h-6" />

        <div className="cover-meta grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-5 border-t border-slate-700 pt-4">
          <div>
            <p className={labelCls} style={{ color: theme.primary }}>Versi</p>
            <p className={valueCls}>{f.docVersion || '1.0'}</p>
          </div>
          <div>
            <p className={labelCls} style={{ color: theme.primary }}>Bahasa</p>
            <p className={valueCls}>Indonesia</p>
          </div>
          <div>
            <p className={labelCls} style={{ color: theme.primary }}>Target Rilis</p>
            <p className={valueCls}>{targetDate}</p>
          </div>
          <div>
            <p className={labelCls} style={{ color: theme.primary }}>Tanggal Dibuat</p>
            <p className={valueCls}>{createdDate}</p>
          </div>
          <div>
            <p className={labelCls} style={{ color: theme.primary }}>Owner</p>
            <p className={valueCls}>{owner}</p>
          </div>
          <div>
            <p className={labelCls} style={{ color: theme.primary }}>Status</p>
            <p className={valueCls}>{status}</p>
          </div>
        </div>
      </div>

      <div className="h-8 w-full" style={{ background: theme.accent }} />
    </div>
  );
}