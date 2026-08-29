import { usePrdStore } from '../../../store/usePrdStore';
export default function PersonaPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  if (mode !== 'enterprise' && !se.persona) return null;
  return (
    <div className="space-y-2 keep-together">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">1.1 Target User Persona & Success Metrics</h3>
      <div className="pl-3 space-y-2 text-xs text-slate-700">
        <p><strong className="text-slate-900">Target User Persona:</strong> <span>{f.userPersona || '-'}</span></p>
        <p><strong className="text-slate-900">Metrik & KPI Utama:</strong> <span>{f.successMetrics || '-'}</span></p>
      </div>
    </div>
  );
}
