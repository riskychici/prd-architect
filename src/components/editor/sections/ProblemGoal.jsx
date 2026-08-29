import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

export default function ProblemGoal() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  return (
    <EditorSection title="2. Masalah & Tujuan (Problem & Goal)" icon={faBullseye}>
      <div className="space-y-3 text-xs">
        <div><label className="block text-slate-300 font-medium mb-1">Latar Belakang / Problem Statement</label>
          <textarea value={f.problemStatement} onChange={function (e) { set('problemStatement', e.target.value); }} rows="3" placeholder="Masalah utama apa yang dihadapi calon pengguna?" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" /></div>
        <div><label className="block text-slate-300 font-medium mb-1">Tujuan Utama Produk (Goals)</label>
          <textarea value={f.productGoal} onChange={function (e) { set('productGoal', e.target.value); }} rows="3" placeholder="Solusi konkret dan target yang ingin dicapai..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none" /></div>
      </div>
    </EditorSection>
  );
}
