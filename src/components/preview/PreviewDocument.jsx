import { usePreviewStore as usePrdStore } from '../../store/usePreviewStore';

import CoverPage from './CoverPage';
import DocFooter from './DocFooter';
import LiveThemeVars from './LiveThemeVars';

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

  return (
    <div id="previewThemeRoot">
      <LiveThemeVars targetId="previewThemeRoot" />

      <CoverPage />

      <div
        id="prdDocument"
        className="bg-white text-slate-900 p-8 rounded-lg border border-slate-200 text-sm space-y-6 max-w-2xl mx-auto w-full h-auto mb-12"
      >
        <OverviewPreview /><PersonaPreview /><BrandingPreview /><RolesPreview /><FeaturesPreview /><AcPreview />
        <div className="space-y-2 keep-together">
          <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">3. Alur Pengguna (User Flow)</h3>
          <div className="p-3 bg-slate-100 rounded border border-slate-200 font-mono text-xs text-slate-800">
            {f.userFlow ? f.userFlow.split('->').join(' \u27A4 ') : 'Belum ada alur pengguna.'}
          </div>
        </div>
        <TechStackPreview /><SchemaPreview /><NfrPreview /><ScopeDonePreview />
        <DocFooter />
      </div>
    </div>
  );
}
