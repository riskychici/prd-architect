import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

export default function PersonaSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  if (mode !== 'enterprise' && !se.persona) return null;
  return (
    <EditorSection title="Target User Persona & KPI Sukses" icon={faUsers} color="amber">
      <div className="space-y-3 text-xs">
        <div><label className="block text-slate-300 font-medium mb-1">Target User Persona</label>
          <textarea value={f.userPersona} onChange={function (e) { set('userPersona', e.target.value); }} rows="2" placeholder="Siapa segmen target pengguna utama?" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none resize-none" /></div>
        <div><label className="block text-slate-300 font-medium mb-1">Metrik & Analytics KPI</label>
          <textarea value={f.successMetrics} onChange={function (e) { set('successMetrics', e.target.value); }} rows="2" placeholder="Indikator keberhasilan" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none resize-none" /></div>
      </div>
    </EditorSection>
  );
}
