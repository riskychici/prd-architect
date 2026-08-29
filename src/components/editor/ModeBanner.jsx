import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';

const isVis = function (mode, se, key) { return mode === 'enterprise' || se[key] === true; };

export default function ModeBanner() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const f = usePrdStore(function (s) { return s.fields; });
  const features = usePrdStore(function (s) { return s.features; });
  const palette = usePrdStore(function (s) { return s.palette; });
  const roles = usePrdStore(function (s) { return s.roles; });
  const acModules = usePrdStore(function (s) { return s.acModules; });
  const schemaTables = usePrdStore(function (s) { return s.schemaTables; });

  const checks = [];
  ['projectName','author','problemStatement','productGoal','userFlow','techFrontend','techBackend','techDatabase','defOfDone'].forEach(function (id) { checks.push(!!(f[id] || '').trim()); });
  checks.push(features.length > 0);
  if (isVis(mode, se, 'persona')) { checks.push(!!(f.userPersona || '').trim()); checks.push(!!(f.successMetrics || '').trim()); }
  if (isVis(mode, se, 'branding')) { checks.push(palette.length > 0); checks.push(!!(f.brandTypography || '').trim()); checks.push(!!(f.brandLayout || '').trim()); checks.push(['bpMobile','bpTablet','bpDesktop'].some(function (id) { return !!(f[id] || '').trim(); })); }
  if (isVis(mode, se, 'roles')) checks.push(roles.length > 0);
  if (isVis(mode, se, 'ac')) checks.push(acModules.length > 0);
  if (isVis(mode, se, 'schema')) checks.push(schemaTables.length > 0);
  if (isVis(mode, se, 'nfr')) ['nfrSpecs','nfrPerformance','nfrLocalization','nfrBrowser','figmaLink','riskMitigation'].forEach(function (id) { checks.push(!!(f[id] || '').trim()); });
  const pct = checks.length ? Math.round(checks.filter(Boolean).length / checks.length * 100) : 0;
  const txt = mode === 'enterprise' ? 'Enterprise Mode (Kompleks & Profesional)' : 'Simple MVP (Praktis & Cepat)';

  return (
    <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs flex justify-between items-center text-blue-300">
      <span className="font-medium"><FontAwesomeIcon icon={faCircleInfo} className="mr-1.5" />Mode Aktif: <strong className="text-white">{txt}</strong></span>
      <span className="flex items-center space-x-2 text-[10px] text-slate-400">
        <span>Kelengkapan:</span>
        <span className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden"><span className="block h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: pct + '%' }} /></span>
        <strong className="text-emerald-400">{pct}%</strong>
      </span>
    </div>
  );
}
