import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faEye } from '@fortawesome/free-solid-svg-icons';
import { useViewStore } from '../../store/useViewStore';
import { useSwipe } from '../../hooks/useSwipe';

export default function MobileTabBar() {
  const view = useViewStore(function (s) { return s.view; });
  const setView = useViewStore(function (s) { return s.setView; });

  function go(v) {
    setView(v);
    const s = document.getElementById('panelSlider');
    if (s) s.classList.toggle('slide-preview', v === 'preview');
  }

  useSwipe(function () { go('preview'); }, function () { go('editor'); });

  const isP = view === 'preview';
  const indCls = 'absolute top-1 bottom-1 rounded-lg transition-all duration-300 ' + (isP
    ? 'left-[calc(50%+2px)] right-1 bg-accent'
    : 'left-1 right-[calc(50%+2px)] bg-accent');

  return (
    <nav className="lg:hidden no-print fixed bottom-0 left-0 right-0 z-40 bg-panel border-t border-line" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="relative flex p-1">
        <span id="tabIndicator" className={indCls} />
        <button onClick={function () { go('editor'); }} className={'relative z-10 flex-1 h-12 flex items-center justify-center space-x-2 text-xs font-semibold transition-colors duration-300 ' + (isP ? 'text-mut' : 'text-white')}>
          <FontAwesomeIcon icon={faPenToSquare} /><span>Editor PRD</span>
        </button>
        <button onClick={function () { go('preview'); }} className={'relative z-10 flex-1 h-12 flex items-center justify-center space-x-2 text-xs font-semibold transition-colors duration-300 ' + (isP ? 'text-white' : 'text-mut')}>
          <FontAwesomeIcon icon={faEye} /><span>Preview PDF</span>
        </button>
      </div>
    </nav>
  );
}
