import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';

export default function ModeSwitcher() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const setMode = usePrdStore(function (s) { return s.setMode; });
  const commitHistory = usePrdStore(function (s) { return s.commitHistory; });
  const sw = function (m) { if (mode === m) return; setMode(m); commitHistory(); };
  const a = 'flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 shadow-md ';
  const i = 'flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-all duration-200';
  return (
    <div className="flex items-center bg-slate-900 border border-slate-700 p-1 rounded-xl shadow-inner space-x-1 order-3 md:order-2 w-full md:w-auto">
      <button onClick={function () { sw('simple'); }} className={mode === 'simple' ? a + 'bg-blue-600 text-white' : i}>
        <FontAwesomeIcon icon={faBolt} className="text-amber-300" /><span>Mode Simple</span>
      </button>
      <button onClick={function () { sw('enterprise'); }} className={mode === 'enterprise' ? a + 'bg-amber-600 text-white' : i}>
        <FontAwesomeIcon icon={faBuilding} className="text-blue-400" /><span>Mode Enterprise</span>
      </button>
    </div>
  );
}
