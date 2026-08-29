import { usePrdStore } from '../../../store/usePrdStore';

export default function NfrPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });

  if (mode !== 'enterprise' && !se.nfr) return null;

  const isFigmaLink = f.figmaLink && /^https?:\/\//i.test(f.figmaLink);

  return (
    <div className="space-y-2 keep-together">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">4.2 NFR, Prototype & Analisis Risiko</h3>
      <div className="pl-3 space-y-2 text-xs text-slate-700">
        <p><strong className="text-slate-900">Keamanan:</strong> <span>{f.nfrSpecs || '-'}</span></p>
        <p><strong className="text-slate-900">Performance:</strong> <span>{f.nfrPerformance || '-'}</span></p>
        <p><strong className="text-slate-900">Lokalisasi:</strong> <span>{f.nfrLocalization || '-'}</span></p>
        <p><strong className="text-slate-900">Browser:</strong> <span>{f.nfrBrowser || '-'}</span></p>
        <p>
          <strong className="text-slate-900">Figma:</strong>{' '}
          {isFigmaLink ? (
            <a href={f.figmaLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-mono">
              {f.figmaLink}
            </a>
          ) : (
            <span className="font-mono">{f.figmaLink || '-'}</span>
          )}
        </p>
        <p><strong className="text-slate-900">Risiko:</strong> <span>{f.riskMitigation || '-'}</span></p>
      </div>
    </div>
  );
}