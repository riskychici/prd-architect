import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

// Opsi status dokumen yang umum dipakai di industri,
// lengkap dengan keterangan agar maknanya jelas.
const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft (masih konsep, belum final)' },
  { value: 'In Review', label: 'In Review (sedang ditinjau tim/stakeholder)' },
  { value: 'Approved', label: 'Approved (disetujui, siap jadi acuan)' },
  { value: 'In Development', label: 'In Development (spec sedang dikerjakan tim dev)' },
  { value: 'Released', label: 'Released (final, produk sudah rilis)' },
  { value: 'Archived', label: 'Archived (dokumen lama, disimpan sebagai arsip)' },
];

export default function ProjectInfo() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  return (
    <EditorSection title="1. Informasi Proyek & Metadata" icon={faCircleInfo}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label htmlFor="projectName" className="block text-slate-300 font-medium mb-1">Nama Proyek / Aplikasi</label>
          <input id="projectName" type="text" value={f.projectName} onChange={function (e) { set('projectName', e.target.value); }} placeholder="misal: Prime Property" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="docVersion" className="block text-slate-300 font-medium mb-1">Versi Dokumen</label>
          <input id="docVersion" type="text" value={f.docVersion} onChange={function (e) { set('docVersion', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="author" className="block text-slate-300 font-medium mb-1">Penulis / Product Owner</label>
          <input id="author" type="text" value={f.author} onChange={function (e) { set('author', e.target.value); }} placeholder="Nama Anda / Tim Product" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="docStatus" className="block text-slate-300 font-medium mb-1">Status Dokumen</label>
          <select id="docStatus" value={f.docStatus || 'Draft'} onChange={function (e) { set('docStatus', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none">
            {STATUS_OPTIONS.map(function (o) {
              return <option key={o.value} value={o.value}>{o.label}</option>;
            })}
          </select>
        </div>
        <div>
          <label htmlFor="targetDate" className="block text-slate-300 font-medium mb-1">Target Rilis</label>
          <input id="targetDate" type="date" value={f.targetDate} onChange={function (e) { set('targetDate', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="targetDateFormat" className="block text-slate-300 font-medium mb-1">Format Tampilan Target Rilis</label>
          <select id="targetDateFormat" value={f.targetDateFormat} onChange={function (e) { set('targetDateFormat', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none">
            <option value="full">Tanggal Lengkap</option>
            <option value="month">Bulan + Tahun</option>
            <option value="quarter">Kuartal + Tahun</option>
          </select>
        </div>
      </div>
    </EditorSection>
  );
}