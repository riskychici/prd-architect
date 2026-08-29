import { faBan } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

export default function OutOfScope() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  return (
    <EditorSection title="5. Batasan (Out of Scope) & Definition of Done" icon={faBan}>
      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-rose-300 font-medium mb-1">Fitur Ditunda (Out of Scope)</label>
          <textarea value={f.outOfScope} onChange={function (e) { set('outOfScope', e.target.value); }} rows="2" placeholder="Fitur yang sengaja ditunda (pisahkan per baris)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label className="block text-emerald-300 font-medium mb-1">Kriteria Selesai (Definition of Done)</label>
          <textarea value={f.defOfDone} onChange={function (e) { set('defOfDone', e.target.value); }} rows="2" placeholder="Kapan proyek ini dianggap rilis sukses?" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" />
        </div>
      </div>
    </EditorSection>
  );
}
