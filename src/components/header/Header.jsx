import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faRotateLeft, faRotateRight, faWandMagicSparkles, faTrash } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';
import ModeSwitcher from './ModeSwitcher';
import IconButton from '../shared/IconButton';
import { useToast } from '../../hooks/useToast';
import { storageService } from '../../services/storageService';
export default function Header() {
  const saveIndicator = usePrdStore(function (s) { return s.saveIndicator; });
  const undo = usePrdStore(function (s) { return s.undo; });
  const redo = usePrdStore(function (s) { return s.redo; });
  const hi = usePrdStore(function (s) { return s.historyIndex; });
  const hl = usePrdStore(function (s) { return s.history.length; });
  const loadSampleData = usePrdStore(function (s) { return s.loadSampleData; });
  const clearAll = usePrdStore(function (s) { return s.clearAll; });
  const commitHistory = usePrdStore(function (s) { return s.commitHistory; });
  const showToast = useToast();
  return (
    <header className="bg-slate-800 border-b border-slate-700 py-3 md:py-3.5 px-4 md:px-6 no-print sticky top-0 z-50 flex flex-wrap justify-between items-center gap-2 md:gap-4">
      <div className="flex items-center space-x-2.5 md:space-x-3 order-1 flex-1 md:flex-none min-w-0">
        <div className="bg-blue-600 text-white p-2 rounded-lg shrink-0"><FontAwesomeIcon icon={faFileContract} className="text-lg md:text-xl" /></div>
        <div className="min-w-0">
          <h1 className="font-bold text-base md:text-lg text-white leading-snug truncate py-0.5">PRD Architect <span className="align-middle whitespace-nowrap text-[10px] md:text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 md:px-2 py-0.5 rounded-full ml-1">Pro V3.1</span></h1>
          <p className="text-[11px] md:text-xs text-slate-400 mt-0.5 md:mt-1 truncate">Perancang Dokumen PRD Profesional</p>
        </div>
      </div>
      <ModeSwitcher />
      <div className="contents md:flex md:items-center md:space-x-3 md:order-3">
        <span className="text-[10px] text-slate-500 hidden lg:inline">{saveIndicator}</span>
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700 rounded-lg p-0.5 shadow-inner order-2">
          <IconButton icon={faRotateLeft} onClick={undo} disabled={hi <= 0} title="Undo (Ctrl+Z)" className="w-10 h-10 md:w-auto md:h-auto"><span className="hidden md:inline">Undo</span></IconButton>
          <IconButton icon={faRotateRight} onClick={redo} disabled={hi >= hl - 1} title="Redo (Ctrl+Y)" className="w-10 h-10 md:w-auto md:h-auto"><span className="hidden md:inline">Redo</span></IconButton>
        </div>
        <IconButton icon={faWandMagicSparkles} onClick={function () { loadSampleData(); commitHistory(); showToast('Data contoh Instagram dimuat'); }} className="order-4 flex-1 md:flex-none h-10 md:h-auto">Muat Contoh</IconButton>
        <IconButton icon={faTrash} onClick={function () { clearAll(); commitHistory(); storageService.clear(); showToast('Form direset', 'info'); }} variant="danger" className="order-4 flex-1 md:flex-none h-10 md:h-auto">Reset</IconButton>
      </div>
    </header>
  );
}