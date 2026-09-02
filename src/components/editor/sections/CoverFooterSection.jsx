import { useState } from 'react';
import { faBookOpen, faWandMagicSparkles, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import { resolveCoverTheme } from '../../../utils/helpers';
import { generateCoverTagline } from '../../../services/aiService';
import { useSmoothColor } from '../../../hooks/useSmoothColor';
import { useToast } from '../../../hooks/useToast';
import EditorSection from '../EditorSection';
import ToggleSwitch from '../../shared/ToggleSwitch';

function ColorField(props) {
  const digits = (props.value || '').replace(/^#/, '');
  const inputId = 'cover-hex-' + (props.label || '').replace(/\s+/g, '-').toLowerCase();

  const smooth = useSmoothColor({
    value: props.value,
    commit: props.onChange,
    makeLive: function (hex) {
      const patch = {};
      patch[props.fieldKey] = hex;
      return { fieldsPatch: patch };
    },
    onLiveDom: function (hex) {
      const el = document.getElementById(inputId);
      if (el) el.value = (hex || '').replace(/^#/, '');
    },
  });

  return (
    <div>
      <span className="block text-ink font-medium mb-1">{props.label}</span>
      <div className="flex items-center gap-2">
        <input
          key={smooth.version}
          type="color"
          ref={smooth.ref}
          defaultValue={smooth.defaultHex}
          onChange={smooth.onInput}
          aria-label={'Pilih ' + props.label}
          className="w-9 h-9 bg-field border border-line rounded cursor-pointer p-1 shrink-0"
        />
        <div className="relative w-full min-w-0">
          <span
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mut font-mono text-[11px] pointer-events-none select-none"
            aria-hidden="true"
          >#</span>
          <label htmlFor={inputId} className="sr-only">{'Kode hex ' + props.label}</label>
          <input
            id={inputId}
            type="text"
            value={digits}
            onChange={function (e) {
              const c = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
              props.onChange(c ? '#' + c : '');
            }}
            placeholder="C9A961"
            maxLength="6"
            className="w-full bg-field border border-line rounded-lg p-2 pl-6 text-ink font-mono focus:border-accent focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default function CoverFooterSection() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  const palette = usePrdStore(function (s) { return s.palette; });
  const commit = usePrdStore(function (s) { return s.commitHistory; });
  const showToast = useToast();
  const [aiBusy, setAiBusy] = useState(false);

  const auto = f.coverThemeAuto !== false;

  const handleToggleAuto = function (v) {
    if (!v) {
      const t = resolveCoverTheme(f, palette);
      set('coverPrimary', t.primary);
      set('coverAccent', t.accent);
      set('coverBg', t.bg);
    }
    set('coverThemeAuto', v);
  };

  const goalText = (f.productGoal || '').trim();

  async function handleUseAi() {
    if (aiBusy || !goalText) return;
    setAiBusy(true);
    try {
      const t = await generateCoverTagline(goalText);
      if (t) {
        set('coverSubtitle', t);
        commit();
        showToast('Saran AI diterapkan ke Subtitle Sampul', 'success');
      } else {
        showToast('AI tidak menghasilkan saran', 'error');
      }
    } catch (e) {
      showToast('Gagal membuat saran: ' + e.message, 'error');
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <EditorSection title="Sampul & Footer Dokumen" icon={faBookOpen}>
      <div className="space-y-3 text-xs">
        <ToggleSwitch checked={auto} onChange={handleToggleAuto} label="Warna sampul & footer otomatis mengikuti palette branding" />
        {auto ? (
          <p className="text-[11px] text-mut">
            {palette.length
              ? 'Sistem akan meracik warna sampul dari palette brandingmu secara otomatis.'
              : 'Palette branding masih kosong. Isi dulu section Branding & Design System agar sampul bisa memakai warna brandmu.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ColorField fieldKey="coverPrimary" label="Warna Utama" value={f.coverPrimary} onChange={function (v) { set('coverPrimary', v); }} />
            <ColorField fieldKey="coverAccent" label="Warna Aksen" value={f.coverAccent} onChange={function (v) { set('coverAccent', v); }} />
            <ColorField fieldKey="coverBg" label="Latar Sampul" value={f.coverBg} onChange={function (v) { set('coverBg', v); }} />
          </div>
        )}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <label htmlFor="coverSubtitle" className="text-ink font-medium">Subtitle Sampul (di bawah judul)</label>
            <button
              type="button"
              onClick={handleUseAi}
              disabled={aiBusy || !goalText}
              title="Isi subtitle dengan ringkasan AI dari kolom Tujuan Utama Produk"
              className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md border border-line bg-field text-accent hover:text-white hover:border-accent hover:bg-accent transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              <FontAwesomeIcon icon={aiBusy ? faSpinner : faWandMagicSparkles} className={aiBusy ? 'animate-spin' : ''} />
              {aiBusy ? 'Membuat...' : 'Pakai saran AI'}
            </button>
          </div>
          <input
            id="coverSubtitle"
            type="text"
            value={f.coverSubtitle}
            onChange={function (e) { set('coverSubtitle', e.target.value); }}
            placeholder="Contoh: Dashboard terpusat untuk pemantauan omzet secara real-time"
            className="w-full bg-field border border-line rounded-lg p-2.5 text-ink focus:border-accent focus:outline-none"
          />
          <p className="text-[10px] text-mut mt-1">
            Kalimat pendek ini yang tampil di bawah judul pada sampul dokumen.
          </p>
        </div>
        <div>
          <label htmlFor="coverKicker" className="block text-ink font-medium mb-1">Kicker Sampul (teks kecil di atas judul)</label>
          <input id="coverKicker" type="text" value={f.coverKicker} onChange={function (e) { set('coverKicker', e.target.value); }} placeholder="PRODUCT REQUIREMENT DOCUMENT" className="w-full bg-field border border-line rounded-lg p-2.5 text-ink focus:border-accent focus:outline-none" />
        </div>
        <div>
          <label htmlFor="coverFooterNote" className="block text-ink font-medium mb-1">Catatan Footer</label>
          <textarea id="coverFooterNote" value={f.coverFooterNote} onChange={function (e) { set('coverFooterNote', e.target.value); }} rows="2" placeholder="Dokumen ini menjadi rujukan utama bagi tim development dan QA selama fase implementasi." className="w-full bg-field border border-line rounded-lg p-2.5 text-ink focus:border-accent focus:outline-none resize-none" />
        </div>
        <ToggleSwitch checked={f.coverShowFooter !== false} onChange={function (v) { set('coverShowFooter', v); }} label="Tampilkan footer di akhir dokumen" />
      </div>
    </EditorSection>
  );
}
