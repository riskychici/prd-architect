import { faClipboardCheck, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';

export default function AcSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const ac = usePrdStore(function (s) { return s.acModules; });
  const addM = usePrdStore(function (s) { return s.addAcModule; });
  const updM = usePrdStore(function (s) { return s.updateAcModule; });
  const remM = usePrdStore(function (s) { return s.removeAcModule; });
  const addI = usePrdStore(function (s) { return s.addAcItem; });
  const updI = usePrdStore(function (s) { return s.updateAcItem; });
  const remI = usePrdStore(function (s) { return s.removeAcItem; });
  if (mode !== 'enterprise' && !se.ac) return null;
  return (
    <EditorSection title="Acceptance Criteria per Modul" icon={faClipboardCheck} color="amber"
      action={<IconButton onClick={addM} variant="accent">+ Modul</IconButton>}>
      <div className="space-y-4">
        {ac.map(function (m, mi) {
          return (
            <div key={mi} className="p-3 bg-slate-900 border border-amber-900/50 rounded-lg space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <input value={m.title} onChange={function (e) { updM(mi, { title: e.target.value }); }} placeholder="Nama modul" className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 font-semibold w-2/3" />
                <button onClick={function () { remM(mi); }} className="text-rose-400 hover:text-rose-300"><FontAwesomeIcon icon={faXmark} /> Hapus</button>
              </div>
              <div className="space-y-2">
                {m.items.map(function (it, ii) {
                  return (
                    <div key={ii} className="p-2 bg-slate-800/60 border border-slate-700 rounded space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-400">AC-{mi + 1}.{ii + 1}</span>
                        <button onClick={function () { remI(mi, ii); }} className="text-rose-400 hover:text-rose-300"><FontAwesomeIcon icon={faXmark} /></button>
                      </div>
                      <input value={it.title} onChange={function (e) { updI(mi, ii, { title: e.target.value }); }} placeholder="Judul kriteria" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
                      <textarea value={it.desc} onChange={function (e) { updI(mi, ii, { desc: e.target.value }); }} rows="2" placeholder="Deskripsi kriteria..." className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 resize-none" />
                    </div>
                  );
                })}
              </div>
              <button onClick={function () { addI(mi); }} className="text-amber-400 hover:text-amber-300 font-semibold"><FontAwesomeIcon icon={faPlus} className="mr-1" />Tambah Kriteria</button>
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
