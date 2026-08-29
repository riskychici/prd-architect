import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';

export default function ProjectInfo() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  return (
    <EditorSection title="1. Informasi Proyek & Metadata" icon={faCircleInfo}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div><label className="block text-slate-300 font-medium mb-1">Nama Proyek / Aplikasi</label>
          <input type="text" value={f.projectName} onChange={function (e) { set('projectName', e.target.value); }} placeholder="misal: Prime Property" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" /></div>
        <div><label className="block text-slate-300 font-medium mb-1">Versi Dokumen</label>
          <input type="text" value={f.docVersion} onChange={function (e) { set('docVersion', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" /></div>
        <div><label className="block text-slate-300 font-medium mb-1">Penulis / Product Owner</label>
          <input type="text" value={f.author} onChange={function (e) { set('author', e.target.value); }} placeholder="Nama Anda / Tim Product" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" /></div>
        <div><label className="block text-slate-300 font-medium mb-1">Target Rilis</label>
          <input type="date" value={f.targetDate} onChange={function (e) { set('targetDate', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" /></div>
        <div className="md:col-span-2"><label className="block text-slate-300 font-medium mb-1">Format Tampilan Target Rilis</label>
          <select value={f.targetDateFormat} onChange={function (e) { set('targetDateFormat', e.target.value); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none">
            <option value="full">Tanggal Lengkap</option><option value="month">Bulan + Tahun</option><option value="quarter">Kuartal + Tahun</option>
          </select></div>
      </div>
    </EditorSection>
  );
}
