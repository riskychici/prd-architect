import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
export default function ScopeDonePreview() {
  const f = usePrdStore(function (s) { return s.fields; });
  const oos = (f.outOfScope || '').trim();
  const dod = (f.defOfDone || '').trim();
  const oosI = oos ? oos.split('\n').filter(function (x) { return x.trim(); }) : [];
  const dodI = dod ? dod.split('\n').filter(function (x) { return x.trim(); }) : [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 pt-2 keep-together">
      <div className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded text-xs space-y-1">
        <h4 className="font-bold text-rose-800">Out of Scope (Ditunda)</h4>
        <ul className="list-disc pl-4 text-rose-900 space-y-0.5">{oosI.length ? oosI.map(function (x, i) { return <li key={i}>{x}</li>; }) : <li className="italic text-slate-400">Tidak ada.</li>}</ul>
      </div>
      <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-xs space-y-1">
        <h4 className="font-bold text-emerald-800">Definition of Done</h4>
        <ul className="list-disc pl-4 text-emerald-900 space-y-0.5">{dodI.length ? dodI.map(function (x, i) { return <li key={i}>{x}</li>; }) : <li className="italic text-slate-400">Belum ditentukan.</li>}</ul>
      </div>
    </div>
  );
}
