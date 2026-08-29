import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

function TA(props) {
  return (
    <div>
      <label className="block text-slate-300 font-medium mb-1">{props.label}</label>
      <textarea value={props.value} onChange={function (e) { props.onChange(e.target.value); }} rows="2" placeholder={props.ph} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none resize-none" />
    </div>
  );
}

export default function NfrSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  if (mode !== 'enterprise' && !se.nfr) return null;
  return (
    <EditorSection title="NFR, Keamanan & Figma Prototype" icon={faShieldHalved} color="amber">
      <div className="space-y-3 text-xs">
        <TA label="Keamanan & Compliance" value={f.nfrSpecs} onChange={function (v) { set('nfrSpecs', v); }} ph="OAuth 2.0, HTTPS, CSRF" />
        <TA label="Performance" value={f.nfrPerformance} onChange={function (v) { set('nfrPerformance', v); }} ph="FCP < 1.5s, Lighthouse >= 85" />
        <TA label="Bahasa & Lokalisasi" value={f.nfrLocalization} onChange={function (v) { set('nfrLocalization', v); }} ph="UI Bahasa Indonesia, format Rupiah" />
        <TA label="Browser Support" value={f.nfrBrowser} onChange={function (v) { set('nfrBrowser', v); }} ph="Chrome/Edge/Firefox/Safari" />
        <div>
          <label className="block text-slate-300 font-medium mb-1">Figma Link</label>
          <input type="text" value={f.figmaLink} onChange={function (e) { set('figmaLink', e.target.value); }} placeholder="https://figma.com/file/..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none" />
        </div>
        <TA label="Analisis Risiko & Mitigasi" value={f.riskMitigation} onChange={function (v) { set('riskMitigation', v); }} ph="Risiko teknis / bisnis..." />
      </div>
    </EditorSection>
  );
}
