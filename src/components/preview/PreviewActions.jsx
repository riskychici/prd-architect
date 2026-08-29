import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFileExport, faFileImport, faCopy, faPrint } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';
import { exportService } from '../../services/exportService';
import { useToast } from '../../hooks/useToast';
import IconButton from '../shared/IconButton';

export default function PreviewActions() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const getSnap = usePrdStore(function (s) { return s.getSnapshot; });
  const restore = usePrdStore(function (s) { return s.restoreState; });
  const setMode = usePrdStore(function (s) { return s.setMode; });
  const commit = usePrdStore(function (s) { return s.commitHistory; });
  const ref = useRef(null);
  const showToast = useToast();

  function handleImport(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = function () {
      try {
        const d = JSON.parse(r.result);
        const st = d.state || d;
        if (!st || typeof st !== 'object' || !st.fields) {
          showToast('File JSON tidak valid', 'error');
          return;
        }
        if (d.mode) setMode(d.mode);
        restore(st);
        setTimeout(function () { commit(); }, 0);
        showToast('Dokumen berhasil diimpor');
      } catch (err) {
        showToast('File JSON tidak valid', 'error');
      }
    };
    r.readAsText(f);
    e.target.value = '';
  }

  const badge = mode === 'enterprise'
    ? 'bg-amber-900 text-amber-200 border-amber-700'
    : 'bg-blue-900 text-blue-200 border-blue-700';

  return (
    <div className="no-print flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-3 bg-slate-950 pb-4 pt-1 mb-4 border-b border-slate-800">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
        <FontAwesomeIcon icon={faEye} className="mr-1.5" />
        Live Preview Dokumen
        <span className={'ml-2 px-2 py-0.5 rounded text-[10px] border ' + badge}>
          {mode === 'enterprise' ? 'ENTERPRISE' : 'SIMPLE'} MODE
        </span>
      </span>
      <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:flex-wrap sm:items-center">
        <IconButton icon={faFileExport} onClick={function () { exportService.exportJSON(getSnap()); showToast('JSON berhasil diunduh'); }} className="w-full sm:w-auto">JSON</IconButton>
        <IconButton icon={faFileImport} onClick={function () { ref.current && ref.current.click(); }} className="w-full sm:w-auto">Impor</IconButton>
        <input ref={ref} type="file" accept=".json" className="hidden" onChange={handleImport} />
        <IconButton icon={faCopy} onClick={function () { exportService.copyMarkdown(getSnap()); showToast('Markdown disalin'); }} className="col-span-2 w-full sm:w-auto">Salin Markdown</IconButton>
        <IconButton icon={faPrint} onClick={function () { exportService.printDocument(); }} variant="primary" className="col-span-2 w-full sm:w-auto">Ekspor PDF / Cetak</IconButton>
      </div>
    </div>
  );
}
