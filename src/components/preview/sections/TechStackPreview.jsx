import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
import { TECH_REQUIRED, TECH_OPTIONAL } from '../../../utils/constants';
export default function TechStackPreview() {
  const f = usePrdStore(function (s) { return s.fields; });
  const techOptional = usePrdStore(function (s) { return s.techOptional; });
  const rows = TECH_REQUIRED.map(function (d) { return { label: d.label, value: f[d.key] }; })
    .concat(TECH_OPTIONAL.filter(function (d) { return techOptional.includes(d.key); })
    .map(function (d) { return { label: d.label, value: f[d.key] }; }));
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider border-l-4 border-blue-600 pl-2">4. Spesifikasi Tech Stack & Arsitektur</h3>
      <div className="pl-3 space-y-3 text-xs text-slate-700">
        <table className="w-full text-xs border-collapse border border-slate-200 bg-slate-50 keep-together tbl-stack">
          <tbody>
            {rows.map(function (r, i) {
              return (
                <tr key={i} className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-100 text-slate-700 w-1/3">{r.label}</td>
                  <td className="p-2 text-slate-800">{r.value || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>
          <strong className="text-slate-900 block mb-1">Skema Database:</strong>
          <pre className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-xs overflow-x-auto">{f.dbSchema || '-'}</pre>
        </div>
      </div>
    </div>
  );
}