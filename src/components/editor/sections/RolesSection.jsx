import { faUserShield, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';

export default function RolesSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const roles = usePrdStore(function (s) { return s.roles; });
  const add = usePrdStore(function (s) { return s.addRole; });
  const upd = usePrdStore(function (s) { return s.updateRole; });
  const rem = usePrdStore(function (s) { return s.removeRole; });
  if (mode !== 'enterprise' && !se.roles) return null;
  return (
    <EditorSection title="Role & Permission Matrix" icon={faUserShield} color="amber"
      action={<IconButton onClick={add} variant="accent">+ Role</IconButton>}>
      <div className="space-y-3">
        {roles.map(function (r, i) {
          return (
            <div key={i} className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <input value={r.name} onChange={function (e) { upd(i, { name: e.target.value }); }} placeholder="Nama role" className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 font-semibold w-1/2" />
                <button onClick={function () { rem(i); }} className="text-rose-400 hover:text-rose-300"><FontAwesomeIcon icon={faXmark} /> Hapus</button>
              </div>
              <textarea value={r.can} onChange={function (e) { upd(i, { can: e.target.value }); }} rows="2" placeholder="Yang boleh dilakukan" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 resize-none" />
              <textarea value={r.cannot} onChange={function (e) { upd(i, { cannot: e.target.value }); }} rows="2" placeholder="Yang TIDAK boleh dilakukan" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 resize-none" />
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
