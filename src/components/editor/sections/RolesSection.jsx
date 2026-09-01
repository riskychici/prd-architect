import { faUserShield, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';
import AiRefineButton from '../../shared/AiRefineButton';

export default function RolesSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const roles = usePrdStore(function (s) { return s.roles; });
  const add = usePrdStore(function (s) { return s.addRole; });
  const upd = usePrdStore(function (s) { return s.updateRole; });
  const rem = usePrdStore(function (s) { return s.removeRole; });

  if (mode !== 'enterprise' && !se.roles) return null;

  return (
    <EditorSection title="Role & Permission Matrix" icon={faUserShield}
      action={<IconButton onClick={add} variant="accent" ariaLabel="Tambah role baru">+ Role</IconButton>}>
      <div className="space-y-3">
        {roles.map(function (r, i) {
          return (
            <div key={i} className="p-3 bg-field border border-line rounded-lg space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <div className="relative w-1/2">
                  <label htmlFor={'role-name-' + i} className="sr-only">Nama role {i + 1}</label>
                  <input id={'role-name-' + i} value={r.name} onChange={function (e) { upd(i, { name: e.target.value }); }} placeholder="Nama role" className="w-full bg-card border border-line rounded p-1.5 pr-9 text-ink font-semibold" />
                  <AiRefineButton value={r.name} onApply={function (v) { upd(i, { name: v }); }} mode="name" label={'nama role ' + (i + 1)} className="absolute right-1 top-1/2 -translate-y-1/2" />
                </div>
                <button onClick={function () { rem(i); }} aria-label={'Hapus role ' + (r.name || (i + 1))} className="text-danger">
                  <FontAwesomeIcon icon={faXmark} aria-hidden="true" /> Hapus
                </button>
              </div>
              <div className="relative">
                <label htmlFor={'role-can-' + i} className="sr-only">Hak akses role {i + 1}</label>
                <textarea id={'role-can-' + i} value={r.can} onChange={function (e) { upd(i, { can: e.target.value }); }} rows="2" placeholder="Yang boleh dilakukan" className="w-full bg-card border border-line rounded p-1.5 pr-9 text-ink resize-none" />
                <AiRefineButton value={r.can} onApply={function (v) { upd(i, { can: v }); }} mode="list" label={'hak akses role ' + (i + 1)} className="absolute right-1 top-1" />
              </div>
              <div className="relative">
                <label htmlFor={'role-cannot-' + i} className="sr-only">Batasan role {i + 1}</label>
                <textarea id={'role-cannot-' + i} value={r.cannot} onChange={function (e) { upd(i, { cannot: e.target.value }); }} rows="2" placeholder="Yang TIDAK boleh dilakukan" className="w-full bg-card border border-line rounded p-1.5 pr-9 text-ink resize-none" />
                <AiRefineButton value={r.cannot} onApply={function (v) { upd(i, { cannot: v }); }} mode="list" label={'batasan role ' + (i + 1)} className="absolute right-1 top-1" />
              </div>
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
