import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import AiRefineButton from '../../shared/AiRefineButton';

export default function PersonaSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });

  if (mode !== 'enterprise' && !se.persona) return null;

  return (
    <EditorSection title="Target User Persona & KPI Sukses" icon={faUsers}>
      <div className="space-y-3 text-xs">
        <div>
          <label htmlFor="userPersona" className="block text-ink font-medium mb-1">Target User Persona</label>
          <div className="relative">
            <textarea id="userPersona" value={f.userPersona} onChange={function (e) { set('userPersona', e.target.value); }} rows="2" placeholder="Siapa segmen target pengguna utama?" className="w-full bg-field border border-line rounded-lg p-2.5 pr-10 text-ink focus:border-accent focus:outline-none resize-none" />
            <AiRefineButton value={f.userPersona} onApply={function (v) { set('userPersona', v); }} mode="paragraph" label="Target User Persona" className="absolute right-2 top-2" />
          </div>
        </div>
        <div>
          <label htmlFor="successMetrics" className="block text-ink font-medium mb-1">Metrik & Analytics KPI</label>
          <div className="relative">
            <textarea id="successMetrics" value={f.successMetrics} onChange={function (e) { set('successMetrics', e.target.value); }} rows="2" placeholder="Indikator keberhasilan" className="w-full bg-field border border-line rounded-lg p-2.5 pr-10 text-ink focus:border-accent focus:outline-none resize-none" />
            <AiRefineButton value={f.successMetrics} onApply={function (v) { set('successMetrics', v); }} mode="list" label="Metrik KPI" className="absolute right-2 top-2" />
          </div>
        </div>
      </div>
    </EditorSection>
  );
}
