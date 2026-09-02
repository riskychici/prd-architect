import { faPalette, faEyeDropper, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import { liveHexColor } from '../../../utils/helpers';
import { useSmoothColor } from '../../../hooks/useSmoothColor';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';
import AiRefineButton from '../../shared/AiRefineButton';

function updateDomColor(i, hex) {
  const clean = (hex || '').replace(/^#/, '');

  const editorSwatch = document.getElementById('palette-swatch-' + i);
  if (editorSwatch) editorSwatch.style.background = hex;

  const editorHex = document.getElementById('palette-hex-' + i);
  if (editorHex) editorHex.value = clean;

  const previewSwatch = document.getElementById('preview-palette-swatch-' + i);
  if (previewSwatch) previewSwatch.style.border = '8px solid ' + hex;

  const previewHex = document.getElementById('preview-palette-hex-' + i);
  if (previewHex) previewHex.textContent = hex;
}

function PaletteRow(props) {
  const p = props.p;
  const i = props.i;
  const updP = props.updP;
  const remP = props.remP;

  const smooth = useSmoothColor({
    value: p.hex,
    commit: function (v) {
      updP(i, { hex: v });
    },
    makeLive: function (hex) {
      const current = usePrdStore.getState().palette || [];
      const pal = current.slice();

      pal[i] = Object.assign({}, pal[i] || {}, {
        hex: hex,
      });

      return { palette: pal };
    },
    onLiveDom: function (hex) {
      updateDomColor(i, hex);
    },
  });

  const d = (p.hex || '').replace(/^#/, '');

  return (
    <div className="grid grid-cols-6 md:grid-cols-12 gap-2 items-center p-2 bg-field border border-line rounded-lg text-xs">
      <span className="col-span-1 order-1 flex justify-center" aria-hidden="true">
        <span
          id={'palette-swatch-' + i}
          className="w-5 h-5 rounded-full border border-line"
          style={{ background: liveHexColor(d) || '#0f172a' }}
        />
      </span>

      <label htmlFor={'palette-name-' + i} className="sr-only">
        Nama warna {i + 1}
      </label>

      <input
        id={'palette-name-' + i}
        value={p.name}
        onChange={function (e) { updP(i, { name: e.target.value }); }}
        placeholder="Nama warna"
        className="col-span-4 md:col-span-3 order-2 bg-card border border-line rounded p-1.5 text-ink"
      />

      <div className="relative col-span-3 md:col-span-4 order-4 md:order-3">
        <label htmlFor={'palette-hex-' + i} className="sr-only">
          Kode hex warna {i + 1}
        </label>

        <span
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mut font-mono text-[11px] pointer-events-none"
          aria-hidden="true"
        >
          #
        </span>

        <input
          id={'palette-hex-' + i}
          type="text"
          value={d}
          onChange={function (e) {
            const c = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
            updP(i, { hex: c ? '#' + c : '' });
          }}
          placeholder="FFFFFF"
          maxLength="6"
          className="w-full bg-card border border-line rounded p-1.5 pl-6 pr-8 text-ink font-mono focus:border-accent focus:outline-none"
        />

        <label htmlFor={'palette-picker-' + i} className="sr-only">
          Pilih warna {i + 1}
        </label>

        <input
          key={smooth.version}
          id={'palette-picker-' + i}
          type="color"
          ref={smooth.ref}
          defaultValue={smooth.defaultHex}
          onChange={smooth.onInput}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 cursor-pointer"
        />

        <FontAwesomeIcon
          icon={faEyeDropper}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-mut pointer-events-none"
          aria-hidden="true"
        />
      </div>

      <label htmlFor={'palette-usage-' + i} className="sr-only">
        Penggunaan warna {i + 1}
      </label>

      <div className="relative col-span-3 order-5 md:order-4">
        <input
          id={'palette-usage-' + i}
          value={p.usage}
          onChange={function (e) { updP(i, { usage: e.target.value }); }}
          placeholder="Penggunaan"
          className="w-full bg-card border border-line rounded p-1.5 pr-9 text-ink"
        />

        <AiRefineButton
          value={p.usage}
          onApply={function (v) { updP(i, { usage: v }); }}
          mode="phrase"
          label={'penggunaan warna ' + (p.name || (i + 1))}
          className="absolute right-1 top-1/2 -translate-y-1/2"
        />
      </div>

      <button
        onClick={function () { remP(i); }}
        aria-label={'Hapus warna ' + (p.name || (i + 1))}
        className="col-span-1 order-3 md:order-5 text-danger flex justify-center"
      >
        <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
      </button>
    </div>
  );
}

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
    <EditorSection
      title="Branding & Design System"
      icon={faPalette}
      action={
        <IconButton onClick={addP} variant="accent" ariaLabel="Tambah warna baru">
          + Warna
        </IconButton>
      }
    >
      <div className="space-y-2">
        {palette.map(function (p, i) {
          return (
            <PaletteRow
              key={i}
              p={p}
              i={i}
              updP={updP}
              remP={remP}
            />
          );
        })}
      </div>

      <div className="space-y-3 text-xs pt-2">
        <div>
          <label htmlFor="brandTypography" className="block text-ink font-medium mb-1">
            Typography
          </label>

          <div className="relative">
            <input
              id="brandTypography"
              type="text"
              value={f.brandTypography}
              onChange={function (e) { set('brandTypography', e.target.value); }}
              placeholder="misal: Inter / Geist"
              className="w-full bg-field border border-line rounded-lg p-2.5 pr-10 text-ink focus:border-accent focus:outline-none"
            />

            <AiRefineButton
              value={f.brandTypography}
              onApply={function (v) { set('brandTypography', v); }}
              mode="phrase"
              label="Typography"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="brandLayout" className="block text-ink font-medium mb-1">
            Prinsip Layout
          </label>

          <div className="relative">
            <textarea
              id="brandLayout"
              value={f.brandLayout}
              onChange={function (e) { set('brandLayout', e.target.value); }}
              rows="2"
              placeholder="misal: compact, mobile-responsive"
              className="w-full bg-field border border-line rounded-lg p-2.5 pr-10 text-ink focus:border-accent focus:outline-none resize-none"
            />

            <AiRefineButton
              value={f.brandLayout}
              onApply={function (v) { set('brandLayout', v); }}
              mode="paragraph"
              label="Prinsip Layout"
              className="absolute right-2 top-2"
            />
          </div>
        </div>

        <div>
          <span className="block text-ink font-medium mb-1">
            Breakpoint Responsif
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {bps.map(function (bp) {
              return (
                <div key={bp.k}>
                  <label
                    htmlFor={bp.k + '-op'}
                    className="block text-[10px] text-mut mb-1 uppercase tracking-wider"
                  >
                    {bp.l} operator
                  </label>

                  <div className="flex">
                    <select
                      id={bp.k + '-op'}
                      value={f[bp.k + 'Op']}
                      onChange={function (e) { set(bp.k + 'Op', e.target.value); }}
                      className="bg-card border border-line rounded-l-lg px-1.5 py-2 text-[11px] text-mut font-mono"
                    >
                      <option value={'\u2264'}>{'\u2264'}</option>
                      <option value={'\u2265'}>{'\u2265'}</option>
                      <option value="=">=</option>
                    </select>

                    <label htmlFor={bp.k} className="sr-only">
                      {bp.l} breakpoint value
                    </label>

                    <input
                      id={bp.k}
                      type="text"
                      value={f[bp.k]}
                      onChange={function (e) {
                        set(bp.k, e.target.value.replace(/[^0-9.]/g, ''));
                      }}
                      placeholder={bp.l === 'Mobile' ? '640' : '1024'}
                      className="w-full min-w-0 bg-field border-y border-line px-2 py-2 text-[11px] text-ink font-mono"
                    />

                    <label htmlFor={bp.k + '-unit'} className="sr-only">
                      {bp.l} unit
                    </label>

                    <select
                      id={bp.k + '-unit'}
                      value={f[bp.k + 'Unit']}
                      onChange={function (e) { set(bp.k + 'Unit', e.target.value); }}
                      className="bg-card border border-line rounded-r-lg px-1.5 py-2 text-[11px] text-mut font-mono"
                    >
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
