import { usePrdStore } from '../../../store/usePrdStore';
export default function AcPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const ac = usePrdStore(function (s) { return s.acModules; });
  if (mode !== 'enterprise' && !se.ac) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">2.1 Acceptance Criteria per Modul</h3>
      <div className="pl-3 space-y-3">
        {ac.length ? ac.map(function (m, mi) {
          return (
            <div key={mi} className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900">{mi + 1}. {m.title || 'Modul'}</h4>
              <div className="space-y-1.5">{m.items.map(function (it, ii) {
                return (
                  <div key={ii} className="pl-3 border-l-2 border-amber-400 keep-together">
                    <p className="font-bold text-amber-700">AC-{mi + 1}.{ii + 1} {it.title}</p>
                    <p className="text-slate-700">{it.desc}</p>
                  </div>
                );
              })}</div>
            </div>
          );
        }) : <p className="italic text-slate-400">Belum ada acceptance criteria.</p>}
      </div>
    </div>
  );
}
