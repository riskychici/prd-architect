import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import { resolveCoverTheme, taglineHash, titleCaseForCover } from '../../../utils/helpers';
import EditorSection from '../EditorSection';
import ToggleSwitch from '../../shared/ToggleSwitch';

function ColorField(props) {
  const safe = /^#[0-9A-Fa-f]{6}$/.test(props.value || '') ? props.value : '#000000';
  return (
    <div>
      <span className="block text-slate-300 font-medium mb-1">{props.label}</span>
      <div className="flex items-center gap-2">
        <input type="color" value={safe} onChange={function (e) { props.onChange(e.target.value); }} aria-label={props.label} className="w-9 h-9 bg-slate-800 border border-slate-700 rounded cursor-pointer p-1 shrink-0" />
        <input type="text" value={props.value} onChange={function (e) { props.onChange(e.target.value); }} placeholder="#C9A961" className="w-full min-w-0 bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-blue-500 focus:outline-none" />
      </div>
    </div>
  );
}

export default function CoverFooterSection() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  const palette = usePrdStore(function (s) { return s.palette; });
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

  const taglineValid = !!(f.coverTagline || '').trim() && f.coverTaglineHash === taglineHash((f.productGoal || '').trim());

  return (
    <EditorSection title="Sampul & Footer Dokumen" icon={faBookOpen}>
      <div className="space-y-3 text-xs">
        <ToggleSwitch checked={auto} onChange={handleToggleAuto} label="Warna sampul & footer otomatis mengikuti palette branding" />
        {auto ? (
          <p className="text-[11px] text-slate-500">
            {palette.length
              ? 'Warna brand dipakai sebagai aksen saja: warna pertama palette yang layak menjadi warna utama, warna berikutnya dengan hue berbeda menjadi aksen kedua. Warna putih, hitam, abu, atau terlalu pucat otomatis dilewati, dan latar sampul dikunci charcoal agar selalu elegan.'
              : 'Palette masih kosong, jadi aksen emas default yang dipakai. Isi section Branding untuk memakai warna brand.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ColorField label="Warna Utama" value={f.coverPrimary} onChange={function (v) { set('coverPrimary', v); }} />
            <ColorField label="Warna Aksen" value={f.coverAccent} onChange={function (v) { set('coverAccent', v); }} />
            <ColorField label="Latar Sampul" value={f.coverBg} onChange={function (v) { set('coverBg', v); }} />
          </div>
        )}
        <div>
          <label htmlFor="coverKicker" className="block text-slate-300 font-medium mb-1">Kicker Sampul (teks kecil di atas judul)</label>
          <input id="coverKicker" type="text" value={f.coverKicker} onChange={function (e) { set('coverKicker', e.target.value); }} placeholder="PRODUCT REQUIREMENT DOCUMENT" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" />
        </div>

        {taglineValid && (
          <div className="p-2.5 bg-purple-950/30 border border-purple-800/50 rounded-lg">
            <p className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider mb-1">Ringkasan Cerdas Sampul (AI)</p>
            <p className="text-[11px] text-slate-300 italic">{titleCaseForCover(f.coverTagline)}</p>
          </div>
        )}

        <div>
          <label htmlFor="coverFooterNote" className="block text-slate-300 font-medium mb-1">Catatan Footer</label>
          <textarea id="coverFooterNote" value={f.coverFooterNote} onChange={function (e) { set('coverFooterNote', e.target.value); }} rows="2" placeholder="Dokumen ini menjadi rujukan utama bagi tim development dan QA selama fase implementasi." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" />
        </div>
        <ToggleSwitch checked={f.coverShowFooter !== false} onChange={function (v) { set('coverShowFooter', v); }} label="Tampilkan footer di akhir dokumen" />
      </div>
    </EditorSection>
  );
}