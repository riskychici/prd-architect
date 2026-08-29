import { usePrdStore } from '../../store/usePrdStore';
import { formatTargetDate } from '../../utils/helpers';
import OverviewPreview from './sections/OverviewPreview';
import FeaturesPreview from './sections/FeaturesPreview';
import TechStackPreview from './sections/TechStackPreview';
import PersonaPreview from './sections/PersonaPreview';
import BrandingPreview from './sections/BrandingPreview';
import RolesPreview from './sections/RolesPreview';
import AcPreview from './sections/AcPreview';
import SchemaPreview from './sections/SchemaPreview';
import NfrPreview from './sections/NfrPreview';
import ScopeDonePreview from './sections/ScopeDonePreview';

export default function PreviewDocument() {
  const f = usePrdStore(function (s) { return s.fields; });
  const mode = usePrdStore(function (s) { return s.mode; });
  const title = f.projectName || 'PROYEK TANPA NAMA';
  const date = formatTargetDate(f.targetDate, f.targetDateFormat);
  const ht = mode === 'enterprise' ? 'PRODUCT REQUIREMENT DOCUMENT (ENTERPRISE SPEC)' : 'PRODUCT REQUIREMENT DOCUMENT (SIMPLE MVP)';

  return (
    <div id="prdDocument" className="bg-white text-slate-900 p-8 rounded-lg shadow-2xl border border-slate-200 text-sm space-y-6 max-w-2xl mx-auto w-full h-auto mb-12">
      <div className="border-b-2 border-blue-600 pb-4 keep-together">
        <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{ht}</p>
      </div>
      <table className="w-full text-xs border-collapse border border-slate-200 bg-slate-50 keep-together tbl-stack"><tbody>
        <tr className="border-b border-slate-200"><td className="p-2 font-bold bg-slate-100 text-slate-700 w-1/4">Owner</td><td className="p-2 w-1/4 text-slate-800">{f.author || '-'}</td><td className="p-2 font-bold bg-slate-100 text-slate-700 w-1/4">Versi</td><td className="p-2 w-1/4 text-slate-800">{f.docVersion || 'v1.0'}</td></tr>
        <tr><td className="p-2 font-bold bg-slate-100 text-slate-700">Target</td><td className="p-2 text-slate-800">{date}</td><td className="p-2 font-bold bg-slate-100 text-slate-700">Status</td><td className="p-2 text-slate-800 font-semibold text-blue-700">Approved / In Development</td></tr>
      </tbody></table>
      <OverviewPreview /><PersonaPreview /><BrandingPreview /><RolesPreview /><FeaturesPreview /><AcPreview />
      <div className="space-y-2 keep-together">
        <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">3. Alur Pengguna (User Flow)</h3>
        <div className="p-3 bg-slate-100 rounded border border-slate-200 font-mono text-xs text-slate-800">{f.userFlow ? f.userFlow.split('->').join(' \u27A4 ') : 'Belum ada alur pengguna.'}</div>
      </div>
      <TechStackPreview /><SchemaPreview /><NfrPreview /><ScopeDonePreview />
    </div>
  );
}
