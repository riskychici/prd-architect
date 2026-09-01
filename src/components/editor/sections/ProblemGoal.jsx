import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import AiRefineButton from '../../shared/AiRefineButton';

export default function ProblemGoal() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });

  return (
    <EditorSection title="2. Masalah & Tujuan (Problem & Goal)" icon={faBullseye}>
      <div className="space-y-3 text-xs">
        <div>
          <label htmlFor="problemStatement" className="block text-ink font-medium mb-1">Latar Belakang / Problem Statement</label>
          <div className="relative">
            <textarea id="problemStatement" value={f.problemStatement} onChange={function (e) { set('problemStatement', e.target.value); }} rows="3" placeholder="Masalah utama apa yang dihadapi calon pengguna?" className="w-full bg-field border border-line rounded-lg p-2.5 pr-10 text-ink focus:border-accent focus:outline-none resize-none" />
            <AiRefineButton value={f.problemStatement} onApply={function (v) { set('problemStatement', v); }} mode="paragraph" label="Problem Statement" className="absolute right-2 top-2" />
          </div>
        </div>
        <div>
          <label htmlFor="productGoal" className="block text-ink font-medium mb-1">Tujuan Utama Produk (Goals)</label>
          <div className="relative">
            <textarea id="productGoal" value={f.productGoal} onChange={function (e) { set('productGoal', e.target.value); }} rows="3" placeholder="Solusi konkret dan target yang ingin dicapai..." className="w-full bg-field border border-line rounded-lg p-2.5 pr-10 text-ink focus:border-accent focus:outline-none resize-none" />
            <AiRefineButton value={f.productGoal} onApply={function (v) { set('productGoal', v); }} mode="paragraph" label="Tujuan Utama Produk" className="absolute right-2 top-2" />
          </div>
        </div>
      </div>
    </EditorSection>
  );
}
