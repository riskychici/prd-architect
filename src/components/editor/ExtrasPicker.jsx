import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece, faRotateLeft, faUsers, faPalette, faUserShield, faClipboardCheck, faTableList, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';
import { EXTRAS_DEFINITIONS } from '../../utils/constants';
import { useToast } from '../../hooks/useToast';
import ToggleSwitch from '../shared/ToggleSwitch';

const IM = { faUsers: faUsers, faPalette: faPalette, faUserShield: faUserShield, faClipboardCheck: faClipboardCheck, faTableList: faTableList, faShieldHalved: faShieldHalved };
const CM = { indigo: 'text-indigo-400', pink: 'text-pink-400', emerald: 'text-emerald-400', amber: 'text-amber-400', cyan: 'text-cyan-400', rose: 'text-rose-400' };

export default function ExtrasPicker() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const toggle = usePrdStore(function (s) { return s.toggleSimpleExtra; });
  const resetAll = usePrdStore(function (s) { return s.resetAllExtras; });
  const commit = usePrdStore(function (s) { return s.commitHistory; });
  const showToast = useToast();
  if (mode === 'enterprise') return null;
  return (
    <div className="bg-gradient-to-br from-indigo-950/40 to-purple-950/40 p-5 rounded-xl border border-indigo-700/60 shadow-md space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center"><FontAwesomeIcon icon={faPuzzlePiece} className="mr-2" />Section Opsional (Tambahan)</h2>
          <p className="text-[11px] text-slate-400 mt-1">Aktifkan bagian Enterprise yang Anda butuhkan di mode Simple</p>
        </div>
        <button onClick={function () { resetAll(); commit(); showToast('Semua section opsional dinonaktifkan', 'info'); }} className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded border border-slate-700 hover:border-slate-600 transition">
          <FontAwesomeIcon icon={faRotateLeft} className="mr-1" />Reset Semua
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
        {EXTRAS_DEFINITIONS.map(function (d) {
          return (
            <ToggleSwitch key={d.key} checked={se[d.key]} onChange={function (v) { toggle(d.key, v); commit(); }} label={d.label}
              icon={<FontAwesomeIcon icon={IM[d.icon]} />} iconColor={CM[d.color]} />
          );
        })}
      </div>
    </div>
  );
}
