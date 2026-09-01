import { useState } from 'react';
import { faTableList, faXmark, faPlus, faWandMagicSparkles, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';
import ComboBox from '../../shared/ComboBox';
import AiRefineButton from '../../shared/AiRefineButton';
import { generateSchemaFromFlow } from '../../../services/groqService';
import { useToast } from '../../../hooks/useToast';

export default function SchemaSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const st = usePrdStore(function (s) { return s.schemaTables; });
  const f = usePrdStore(function (s) { return s.fields; });
  const addT = usePrdStore(function (s) { return s.addSchemaTable; });
  const updT = usePrdStore(function (s) { return s.updateSchemaTable; });
  const remT = usePrdStore(function (s) { return s.removeSchemaTable; });
  const addF = usePrdStore(function (s) { return s.addSchemaField; });
  const updF = usePrdStore(function (s) { return s.updateSchemaField; });
  const remF = usePrdStore(function (s) { return s.removeSchemaField; });
  const setTables = usePrdStore(function (s) { return s.setSchemaTables; });
  const commit = usePrdStore(function (s) { return s.commitHistory; });
  const showToast = useToast();
  const [genBusy, setGenBusy] = useState(false);
  const flowText = (f.userFlow || '').trim();

  async function handleGenerate() {
    if (!flowText || genBusy) return;
    setGenBusy(true);
    try {
      const tables = await generateSchemaFromFlow(flowText);
      setTables(tables);
      commit();
      showToast('Schema dibuat dari user flow: ' + tables.length + ' tabel', 'success');
    } catch (e) {
      showToast('Gagal membuat schema: ' + e.message, 'error');
    } finally {
      setGenBusy(false);
    }
  }

  if (mode !== 'enterprise' && !se.schema) return null;

  return (
    <EditorSection title="Schema Data (Multi-Tabel)" icon={faTableList}
      action={
        <div className="flex items-center gap-2">
          <IconButton onClick={handleGenerate} disabled={!flowText || genBusy} variant="primary" ariaLabel="Generate schema dari user flow" title="AI membaca user flow lalu menyusun tabel database">
            <FontAwesomeIcon icon={genBusy ? faSpinner : faWandMagicSparkles} className={genBusy ? 'animate-spin' : ''} />
            {genBusy ? 'Menganalisis...' : 'Generate dari User Flow'}
          </IconButton>
          <IconButton onClick={addT} variant="accent" ariaLabel="Tambah tabel baru">+ Tabel</IconButton>
        </div>
      }>
      <p className="text-[11px] text-mut -mt-1">Tambahkan nama tabel beserta propertinya, atau biarkan AI menyusunnya dari user flow.</p>
      <div className="space-y-4">
        {st.map(function (t, ti) {
          return (
            <div key={ti} className="p-3 bg-field border border-line rounded-lg space-y-3 text-xs">
              <div className="grid grid-cols-6 md:grid-cols-12 gap-2 items-center">
                <span className="col-span-1 order-1 text-accent text-center" aria-hidden="true">
                  <FontAwesomeIcon icon={faTableList} />
                </span>
                <label htmlFor={'schema-tbl-name-' + ti} className="sr-only">Nama tabel {ti + 1}</label>
                <input id={'schema-tbl-name-' + ti} value={t.name} onChange={function (e) { updT(ti, { name: e.target.value }); }} placeholder="Nama tabel" className="col-span-4 md:col-span-4 order-2 bg-card border border-line rounded p-1.5 text-ink font-mono font-semibold" />
                <button onClick={function () { remT(ti); }} aria-label={'Hapus tabel ' + (t.name || (ti + 1))} className="col-span-1 order-3 md:order-4 text-danger flex justify-center">
                  <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
                </button>
                <label htmlFor={'schema-tbl-desc-' + ti} className="sr-only">Deskripsi tabel {ti + 1}</label>
                <div className="relative col-span-6 md:col-span-6 order-4 md:order-3">
                  <input id={'schema-tbl-desc-' + ti} value={t.desc} onChange={function (e) { updT(ti, { desc: e.target.value }); }} placeholder="Deskripsi tabel" className="w-full bg-card border border-line rounded p-1.5 pr-9 text-ink" />
                  <AiRefineButton value={t.desc} onApply={function (v) { updT(ti, { desc: v }); }} mode="phrase" label={'deskripsi tabel ' + (t.name || (ti + 1))} className="absolute right-1 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                {t.fields.map(function (s, fi) {
                  return (
                    <div key={fi} className="grid grid-cols-6 md:grid-cols-12 gap-2 items-center p-2 bg-card border border-line rounded-lg">
                      <label htmlFor={'schema-fld-name-' + ti + '-' + fi} className="sr-only">Nama kolom {fi + 1} di tabel {t.name || (ti + 1)}</label>
                      <input id={'schema-fld-name-' + ti + '-' + fi} value={s.field} onChange={function (e) { updF(ti, fi, { field: e.target.value }); }} placeholder="Nama kolom" className="col-span-5 md:col-span-3 order-1 bg-field border border-line rounded p-1.5 text-ink font-mono" />
                      <button onClick={function () { remF(ti, fi); }} aria-label={'Hapus kolom ' + (s.field || (fi + 1))} className="col-span-1 order-2 md:order-5 text-danger flex justify-center">
                        <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
                      </button>
                      <div className="col-span-4 md:col-span-3 order-3 md:order-2">
                        <ComboBox value={s.type} onChange={function (v) { updF(ti, fi, { type: v }); }} label={'Tipe kolom ' + (s.field || (fi + 1))} />
                      </div>
                      <label htmlFor={'schema-fld-req-' + ti + '-' + fi} className="sr-only">Required status kolom {fi + 1}</label>
                      <select id={'schema-fld-req-' + ti + '-' + fi} value={s.required} onChange={function (e) { updF(ti, fi, { required: e.target.value }); }} className="col-span-2 md:col-span-2 order-4 md:order-3 bg-field border border-line rounded p-1.5 text-ink">
                        <option value="Ya">Not Null</option>
                        <option value="Opsional">Opsional</option>
                      </select>
                      <label htmlFor={'schema-fld-note-' + ti + '-' + fi} className="sr-only">Keterangan kolom {fi + 1}</label>
                      <div className="relative col-span-6 md:col-span-3 order-5 md:order-4">
                        <input id={'schema-fld-note-' + ti + '-' + fi} value={s.note} onChange={function (e) { updF(ti, fi, { note: e.target.value }); }} placeholder="Keterangan" className="w-full bg-field border border-line rounded p-1.5 pr-9 text-ink" />
                        <AiRefineButton value={s.note} onApply={function (v) { updF(ti, fi, { note: v }); }} mode="phrase" label={'keterangan kolom ' + (s.field || (fi + 1))} className="absolute right-1 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={function () { addF(ti); }} aria-label={'Tambah kolom ke tabel ' + (t.name || (ti + 1))} className="text-accent font-semibold">
                <FontAwesomeIcon icon={faPlus} className="mr-1" aria-hidden="true" />Tambah Kolom
              </button>
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
