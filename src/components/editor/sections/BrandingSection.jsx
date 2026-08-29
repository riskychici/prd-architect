import { faPalette, faEyeDropper, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import { liveHexColor, normalizeHex } from '../../../utils/helpers';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';

export default function BrandingSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  const palette = usePrdStore(function (s) { return s.palette; });
  const addP = usePrdStore(function (s) { return s.addPalette; });
  const updP = usePrdStore(function (s) { return s.updatePalette; });
  const remP = usePrdStore(function (s) { return s.removePalette; });

  if (mode !== 'enterprise' && !se.branding) return null;

  const bps = [
    { l: 'Mobile', k: 'bpMobile' },
    { l: 'Tablet', k: 'bpTablet' },
    { l: 'Desktop', k: 'bpDesktop' },
  ];

  return (
    <EditorSection title="Branding & Design System" icon={faPalette} color="amber"
      action={<IconButton onClick={addP} variant="accent" ariaLabel="Tambah warna baru">+ Warna</IconButton>}>
      <div className="space-y-2">
        {palette.map(function (p, i) {
          const d = (p.hex || '').replace(/^#/, '');
          return (
            <div key={i} className="grid grid-cols-6 md:grid-cols-12 gap-2 items-center p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs">
              <span className="col-span-1 order-1 flex justify-center" aria-hidden="true">
                <span className="w-5 h-5 rounded-full border border-slate-600" style={{ background: liveHexColor(d) || '#0f172a' }} />
              </span>
              <label htmlFor={'palette-name-' + i} className="sr-only">Nama warna {i + 1}</label>
              <input id={'palette-name-' + i} value={p.name} onChange={function (e) { updP(i, { name: e.target.value }); }} placeholder="Nama warna" className="col-span-4 md:col-span-3 order-2 bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
              <div className="relative col-span-3 md:col-span-4 order-4 md:order-3">
                <label htmlFor={'palette-hex-' + i} className="sr-only">Kode hex warna {i + 1}</label>
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[11px] pointer-events-none" aria-hidden="true">#</span>
                <input id={'palette-hex-' + i} type="text" value={d} onChange={function (e) { const c = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6); updP(i, { hex: c ? '#' + c : '' }); }} placeholder="C9A961" maxLength="6" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 pl-6 pr-8 text-slate-100 font-mono focus:border-amber-500 focus:outline-none" />
                <label htmlFor={'palette-picker-' + i} className="sr-only">Pilih warna {i + 1}</label>
                <input id={'palette-picker-' + i} type="color" value={normalizeHex(p.hex)} onChange={function (e) { updP(i, { hex: e.target.value }); }} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 cursor-pointer" />
                <FontAwesomeIcon icon={faEyeDropper} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
              </div>
              <label htmlFor={'palette-usage-' + i} className="sr-only">Penggunaan warna {i + 1}</label>
              <input id={'palette-usage-' + i} value={p.usage} onChange={function (e) { updP(i, { usage: e.target.value }); }} placeholder="Penggunaan" className="col-span-3 order-5 md:order-4 bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
              <button onClick={function () { remP(i); }} aria-label={'Hapus warna ' + (p.name || (i + 1))} className="col-span-1 order-3 md:order-5 text-rose-400 hover:text-rose-300 flex justify-center">
                <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
      <div className="space-y-3 text-xs pt-2">
        <div>
          <label htmlFor="brandTypography" className="block text-slate-300 font-medium mb-1">Typography</label>
          <input id="brandTypography" type="text" value={f.brandTypography} onChange={function (e) { set('brandTypography', e.target.value); }} placeholder="misal: Inter / Geist" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="brandLayout" className="block text-slate-300 font-medium mb-1">Prinsip Layout</label>
          <textarea id="brandLayout" value={f.brandLayout} onChange={function (e) { set('brandLayout', e.target.value); }} rows="2" placeholder="misal: compact, mobile-responsive" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none resize-none" />
        </div>
        <div>
          <span className="block text-slate-300 font-medium mb-1">Breakpoint Responsif</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {bps.map(function (bp) {
              return (
                <div key={bp.k}>
                  <label htmlFor={bp.k + '-op'} className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">{bp.l} operator</label>
                  <div className="flex">
                    <select id={bp.k + '-op'} value={f[bp.k + 'Op']} onChange={function (e) { set(bp.k + 'Op', e.target.value); }} className="bg-slate-800 border border-slate-700 rounded-l-lg px-1.5 py-2 text-[11px] text-slate-300 font-mono">
                      <option value={'\u2264'}>{'\u2264'}</option>
                      <option value={'\u2265'}>{'\u2265'}</option>
                      <option value="=">=</option>
                    </select>
                    <label htmlFor={bp.k} className="sr-only">{bp.l} breakpoint value</label>
                    <input id={bp.k} type="text" value={f[bp.k]} onChange={function (e) { set(bp.k, e.target.value.replace(/[^0-9.]/g, '')); }} placeholder={bp.l === 'Mobile' ? '640' : '1024'} className="w-full min-w-0 bg-slate-900 border-y border-slate-700 px-2 py-2 text-[11px] text-slate-100 font-mono" />
                    <label htmlFor={bp.k + '-unit'} className="sr-only">{bp.l} unit</label>
                    <select id={bp.k + '-unit'} value={f[bp.k + 'Unit']} onChange={function (e) { set(bp.k + 'Unit', e.target.value); }} className="bg-slate-800 border border-slate-700 rounded-r-lg px-1.5 py-2 text-[11px] text-slate-300 font-mono">
                      <option value="px">px</option>
                      <option value="rem">rem</option>
                      <option value="em">em</option>
                      <option value="%">%</option>
                      <option value="vw">vw</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </EditorSection>
  );
}