import { faListCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';

export default function FeaturesList() {
  const features = usePrdStore(function (s) { return s.features; });
  const add = usePrdStore(function (s) { return s.addFeature; });
  const upd = usePrdStore(function (s) { return s.updateFeature; });
  const rem = usePrdStore(function (s) { return s.removeFeature; });
  return (
    <EditorSection title="3. Fitur Utama (Requirements)" icon={faListCheck}
      action={<IconButton onClick={add}>+ Tambah Fitur</IconButton>}>
      <div className="space-y-3">
        {features.map(function (f, i) {
          return (
            <div key={i} className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-400">{f.id}</span>
                <button onClick={function () { rem(i); }} className="text-rose-400 hover:text-rose-300 text-xs"><FontAwesomeIcon icon={faXmark} /> Hapus</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input type="text" value={f.name} onChange={function (e) { upd(i, { name: e.target.value }); }} placeholder="Nama Fitur" className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
                <input type="text" value={f.story} onChange={function (e) { upd(i, { story: e.target.value }); }} placeholder="Deskripsi / User Story" className="bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 md:col-span-2" />
              </div>
              <select value={f.priority} onChange={function (e) { upd(i, { priority: e.target.value }); }} className="bg-slate-800 border border-slate-700 rounded p-1 text-slate-100 text-[11px]">
                <option value="High">High (Must-Have)</option>
                <option value="Medium">Medium (Should-Have)</option>
                <option value="Low">Low (Nice-to-Have)</option>
              </select>
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
