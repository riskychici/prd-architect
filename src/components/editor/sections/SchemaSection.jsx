import { faTableList, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';
import ComboBox from '../../shared/ComboBox';

export default function SchemaSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const st = usePrdStore(function (s) { return s.schemaTables; });
  const addT = usePrdStore(function (s) { return s.addSchemaTable; });
  const updT = usePrdStore(function (s) { return s.updateSchemaTable; });
  const remT = usePrdStore(function (s) { return s.removeSchemaTable; });
  const addF = usePrdStore(function (s) { return s.addSchemaField; });
  const updF = usePrdStore(function (s) { return s.updateSchemaField; });
  const remF = usePrdStore(function (s) { return s.removeSchemaField; });
  if (mode !== 'enterprise' && !se.schema) return null;
  return (
    <EditorSection title="Schema Data (Multi-Tabel)" icon={faTableList} color="amber"
      action={<IconButton onClick={addT} variant="accent">+ Tabel</IconButton>}>
      <p className="text-[11px] text-slate-500 -mt-1">Tambahkan nama tabel beserta propertinya.</p>
      <div className="space-y-4">
        {st.map(function (t, ti) {
          return (
            <div key={ti} className="p-3 bg-slate-900 border border-amber-900/50 rounded-lg space-y-3 text-xs">
              <div className="grid grid-cols-6 md:grid-cols-12 gap-2 items-center">
                <span className="col-span-1 order-1 text-amber-400 text-center"><FontAwesomeIcon icon={faTableList} /></span>
                <input value={t.name} onChange={function (e) { updT(ti, { name: e.target.value }); }} placeholder="Nama tabel" className="col-span-4 md:col-span-4 order-2 bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100 font-mono font-semibold" />
                <button onClick={function () { remT(ti); }} className="col-span-1 order-3 md:order-4 text-rose-400 hover:text-rose-300 flex justify-center"><FontAwesomeIcon icon={faXmark} /></button>
                <input value={t.desc} onChange={function (e) { updT(ti, { desc: e.target.value }); }} placeholder="Deskripsi tabel" className="col-span-6 md:col-span-6 order-4 md:order-3 bg-slate-800 border border-slate-700 rounded p-1.5 text-slate-100" />
              </div>
              <div className="space-y-2">
                {t.fields.map(function (s, fi) {
                  return (
                    <div key={fi} className="grid grid-cols-6 md:grid-cols-12 gap-2 items-center p-2 bg-slate-800/60 border border-slate-700 rounded-lg">
                      <input value={s.field} onChange={function (e) { updF(ti, fi, { field: e.target.value }); }} placeholder="Nama kolom" className="col-span-5 md:col-span-3 order-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono" />
                      <button onClick={function () { remF(ti, fi); }} className="col-span-1 order-2 md:order-5 text-rose-400 hover:text-rose-300 flex justify-center"><FontAwesomeIcon icon={faXmark} /></button>
                      <div className="col-span-4 md:col-span-3 order-3 md:order-2"><ComboBox value={s.type} onChange={function (v) { updF(ti, fi, { type: v }); }} /></div>
                      <select value={s.required} onChange={function (e) { updF(ti, fi, { required: e.target.value }); }} className="col-span-2 md:col-span-2 order-4 md:order-3 bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100">
                        <option value="Ya">Not Null</option>
                        <option value="Opsional">Opsional</option>
                      </select>
                      <input value={s.note} onChange={function (e) { updF(ti, fi, { note: e.target.value }); }} placeholder="Keterangan" className="col-span-6 md:col-span-3 order-5 md:order-4 bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100" />
                    </div>
                  );
                })}
              </div>
              <button onClick={function () { addF(ti); }} className="text-amber-400 hover:text-amber-300 font-semibold"><FontAwesomeIcon icon={faPlus} className="mr-1" />Tambah Kolom</button>
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
