import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
export default function RolesPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const roles = usePrdStore(function (s) { return s.roles; });
  if (mode !== 'enterprise' && !se.roles) return null;
  const splitLines = function (text) {
    if (!text) return [];
    return text
      .split('\n')
      .map(function (line) {
        return line.replace(/^[\s\|\-\*\•\d+\.\)]+/, '').trim();
      })
      .filter(function (line) { return line.length > 0; });
  };
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">1.3 Role & Permission Matrix</h3>
      <div className="pl-3 grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3">
        {roles.length ? roles.map(function (r, i) {
          const canItems = splitLines(r.can);
          const cannotItems = splitLines(r.cannot);
          return (
            <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded keep-together space-y-2">
              <h4 className="font-bold text-slate-900 mb-1">{r.name || 'Role'}</h4>
              <div className="space-y-1">
                <p className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                  <FontAwesomeIcon icon={faCircleCheck} /> Diizinkan:
                </p>
                {canItems.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-0.5 text-emerald-700 text-xs">
                    {canItems.map(function (item, idx) { return <li key={idx}>{item}</li>; })}
                  </ul>
                ) : (<p className="text-slate-400 italic text-xs">-</p>)}
              </div>
              <div className="space-y-1">
                <p className="text-rose-700 font-semibold text-[11px] flex items-center gap-1">
                  <FontAwesomeIcon icon={faCircleXmark} /> Dilarang:
                </p>
                {cannotItems.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-0.5 text-rose-700 text-xs">
                    {cannotItems.map(function (item, idx) { return <li key={idx}>{item}</li>; })}
                  </ul>
                ) : (<p className="text-slate-400 italic text-xs">-</p>)}
              </div>
            </div>
          );
        }) : <p className="italic text-slate-400">Belum ada role.</p>}
      </div>
    </div>
  );
}