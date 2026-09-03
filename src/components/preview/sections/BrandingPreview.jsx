import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
import { buildBreakpoints, isValidHex } from '../../../utils/helpers';
export default function BrandingPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  const palette = usePrdStore(function (s) { return s.palette; });
  if (mode !== 'enterprise' && !se.branding) return null;
  return (
    <div className="space-y-2 keep-together">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-2 border-amber-500 pl-2 ml-1">
        1.2 Branding & Design System
      </h3>
      <div className="pl-3 space-y-2 text-xs text-slate-700">
        <div className="space-y-1">
          {palette.length ? palette.map(function (p, i) {
            const hex = isValidHex(p.hex) ? p.hex : '#ffffff';
            return (
              <div key={i} className="flex items-center space-x-2">
                <span
                  id={'preview-palette-swatch-' + i}
                  className="w-4 h-4 rounded shrink-0"
                  style={{ border: '8px solid ' + hex, outline: '1px solid #cbd5e1' }}
                />
                <span className="font-semibold text-slate-900">{p.name || '-'}</span>
                <span id={'preview-palette-hex-' + i} className="font-mono text-slate-500">
                  {p.hex}
                </span>
                <span className="text-slate-500">{'\u00B7'} {p.usage}</span>
              </div>
            );
          }) : (
            <p className="italic text-slate-400">Belum ada palette warna.</p>
          )}
        </div>
        <p>
          <strong className="text-slate-900">Typography:</strong>{' '}
          <span>{f.brandTypography || '-'}</span>
        </p>
        <p>
          <strong className="text-slate-900">Prinsip Layout:</strong>{' '}
          <span>{f.brandLayout || '-'}</span>
        </p>
        <p>
          <strong className="text-slate-900">Breakpoint:</strong>{' '}
          <span className="font-mono">{buildBreakpoints(f) || '-'}</span>
        </p>
      </div>
    </div>
  );
}
