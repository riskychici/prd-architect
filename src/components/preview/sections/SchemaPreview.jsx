import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
export default function SchemaPreview() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const st = usePrdStore(function (s) { return s.schemaTables; });
  if (mode !== 'enterprise' && !se.schema) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider border-l-4 border-amber-500 pl-2">4.1 Schema Data</h3>
      <div className="pl-3 space-y-4">
        {st.length ? st.map(function (t, ti) {
          return (
            <div key={ti} className="space-y-1 keep-together">
              <h4 className="text-xs font-bold text-slate-900 font-mono flex items-center gap-2"><FontAwesomeIcon icon={faDatabase} className="text-amber-600" /><span>{t.name || 'tabel_tanpa_nama'}</span></h4>
              {t.desc && <p className="text-[11px] text-slate-500 pl-6">{t.desc}</p>}
              <table className="w-full text-xs border-collapse border border-slate-200 tbl-stack">
                <thead className="bg-slate-100 text-slate-700"><tr><th className="p-2 text-left w-[24%]">Field</th><th className="p-2 text-left w-[26%]">Tipe</th><th className="p-2 text-center w-[14%]">Not Null</th><th className="p-2 text-left">Keterangan</th></tr></thead>
                <tbody className="divide-y divide-slate-200">
                  {t.fields.length ? t.fields.map(function (s, fi) {
                    return (
                      <tr key={fi}><td data-label="Kolom" className="p-2 font-mono font-semibold text-slate-900">{s.field || '-'}</td><td data-label="Tipe" className="p-2 text-slate-600 font-mono">{s.type || '-'}</td><td data-label="Not Null" className="p-2 text-center"><FontAwesomeIcon icon={s.required === 'Ya' ? faCheck : faMinus} className={s.required === 'Ya' ? 'text-emerald-600' : 'text-slate-400'} /></td><td data-label="Keterangan" className="p-2 text-slate-600">{s.note}</td></tr>
                    );
                  }) : <tr><td colSpan="4" className="p-2 text-center text-slate-400 italic">Belum ada kolom.</td></tr>}
                </tbody>
              </table>
            </div>
          );
        }) : <p className="italic text-slate-400">Belum ada schema.</p>}
      </div>
    </div>
  );
}