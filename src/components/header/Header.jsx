import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faRotateLeft, faRotateRight, faWandMagicSparkles, faTrash, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';
import { useThemeStore } from '../../store/useThemeStore';
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
  const theme = useThemeStore(function (s) { return s.theme; });
  const setTheme = useThemeStore(function (s) { return s.setTheme; });
  const showToast = useToast();

  return (
    <header className="bg-panel border-b border-line py-3 md:py-3.5 px-4 md:px-6 no-print sticky top-0 z-50 flex flex-wrap justify-between items-center gap-2 md:gap-4">
      <div className="flex items-center space-x-2.5 md:space-x-3 order-1 flex-1 md:flex-none min-w-0">
        <div className="bg-accent text-white p-2 rounded-lg shrink-0">
          <FontAwesomeIcon icon={faFileContract} className="text-lg md:text-xl" />
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-base md:text-lg text-ink leading-snug truncate py-0.5">
            PRD Architect{' '}
            <span className="align-middle whitespace-nowrap text-[10px] md:text-xs bg-accent/15 text-accent border border-accent/30 px-1.5 md:px-2 py-0.5 rounded-full ml-1">
              Pro V3.4
            </span>
          </h1>
          <p className="text-[11px] md:text-xs text-mut mt-0.5 md:mt-1 truncate">Perancang Dokumen PRD Profesional</p>
        </div>
      </div>
      <ModeSwitcher />
      <div className="contents md:flex md:items-center md:space-x-3 md:order-3">
        <span className="text-[10px] text-mut hidden lg:inline">{saveIndicator}</span>
        <div className="flex items-center space-x-1 bg-base border border-line rounded-lg p-0.5 order-2">
          <IconButton icon={faRotateLeft} onClick={undo} disabled={hi <= 0} title="Undo (Ctrl+Z)" className="w-10 h-10 md:w-auto md:h-auto">
            <span className="hidden md:inline">Undo</span>
          </IconButton>
          <IconButton icon={faRotateRight} onClick={redo} disabled={hi >= hl - 1} title="Redo (Ctrl+Y)" className="w-10 h-10 md:w-auto md:h-auto">
            <span className="hidden md:inline">Redo</span>
          </IconButton>
          <IconButton
            icon={theme === 'dark' ? faSun : faMoon}
            onClick={function () { setTheme(theme === 'dark' ? 'light' : 'dark'); }}
            title={theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
            className="w-10 h-10 md:w-auto md:h-auto"
          />
        </div>
        <IconButton icon={faWandMagicSparkles} onClick={function () { loadSampleData(); commitHistory(); showToast('Data contoh Instagram dimuat'); }} className="order-4 flex-1 md:flex-none h-10 md:h-auto">
          Muat Contoh
        </IconButton>
        <IconButton icon={faTrash} onClick={function () { clearAll(); storageService.clear(); commitHistory(); showToast('Form direset', 'info'); }} variant="danger" className="order-4 flex-1 md:flex-none h-10 md:h-auto">
          Reset
        </IconButton>
      </div>
    </header>
  );
}
