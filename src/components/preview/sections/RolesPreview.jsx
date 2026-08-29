import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
export default function RolesPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const roles = usePrdStore(function (s) { return s.roles; });
  if (mode !== 'enterprise' && !se.roles) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">1.3 Role & Permission Matrix</h3>
      <div className="pl-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {roles.length ? roles.map(function (r, i) {
          return (
            <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded keep-together">
              <h4 className="font-bold text-slate-900 mb-1">{r.name || 'Role'}</h4>
              <p className="text-emerald-700"><FontAwesomeIcon icon={faCircleCheck} className="mr-1" />{r.can.split('\n').filter(function (x) { return x.trim(); }).join(' \u00B7 ') || '-'}</p>
              <p className="text-rose-700 mt-0.5"><FontAwesomeIcon icon={faCircleXmark} className="mr-1" />{r.cannot.split('\n').filter(function (x) { return x.trim(); }).join(' \u00B7 ') || '-'}</p>
            </div>
          );
        }) : <p className="italic text-slate-400">Belum ada role.</p>}
      </div>
    </div>
  );
}
