import { useEffect, useRef, lazy, Suspense } from 'react';
import { debounce } from 'lodash';
import { usePrdStore } from './store/usePrdStore';
import { storageService } from './services/storageService';
import Header from './components/header/Header';
import EditorPanel from './components/editor/EditorPanel';
import MobileTabBar from './components/mobile/MobileTabBar';
import ScrollButtons from './components/mobile/ScrollButtons';
import ToastContainer from './components/shared/Toast';

const PreviewPanel = lazy(() => import('./components/preview/PreviewPanel'));

export default function App() {
  const restoreState = usePrdStore(function (s) { return s.restoreState; });
  const setMode = usePrdStore(function (s) { return s.setMode; });
  const initDoneRef = useRef(false);

  useEffect(function () {
    if (initDoneRef.current) return;
    initDoneRef.current = true;
    const saved = storageService.load();
    if (saved && saved.state) {
      if (saved.mode) setMode(saved.mode);
      restoreState(saved.state);
    }
    setTimeout(function () { usePrdStore.getState().commitHistory(); }, 0);
  }, []);

  useEffect(function () {
    const commit = debounce(function () { usePrdStore.getState().commitHistory(); }, 500);
    function onInput(e) {
      if (e.target.matches && e.target.matches('input, textarea, select')) commit();
    }
    function onClick(e) {
      const b = e.target.closest ? e.target.closest('button') : null;
      if (!b) return;
      const t = b.title || '';
      if (t.indexOf('Undo') === 0 || t.indexOf('Redo') === 0) return;
      commit();
    }
    document.addEventListener('input', onInput);
    document.addEventListener('change', onInput);
    document.addEventListener('click', onClick);
    return function () {
      document.removeEventListener('input', onInput);
      document.removeEventListener('change', onInput);
      document.removeEventListener('click', onClick);
      commit.cancel();
    };
  }, []);

  useEffect(function () {
    function handler(e) {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        usePrdStore.getState().undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        usePrdStore.getState().redo();
      }
    }
    document.addEventListener('keydown', handler);
    return function () { document.removeEventListener('keydown', handler); };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
      <a
        href="#editorPanel"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-blue-600 focus:text-white focus:px-3 focus:py-2 focus:rounded focus:text-sm"
      >
        Lompat ke Editor
      </a>
      <a
        href="#previewPanel"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-emerald-600 focus:text-white focus:px-3 focus:py-2 focus:rounded focus:text-sm"
      >
        Lompat ke Preview
      </a>
      <Header />
      <main className="flex-grow min-h-0 overflow-hidden relative">
        <div id="panelSlider">
          <div><EditorPanel /></div>
          <div>
            <Suspense fallback={
              <div id="previewPanel" className="bg-slate-950 p-6 flex items-center justify-center" style={{ height: '100%' }}>
                <div className="text-slate-400 text-sm">Memuat preview...</div>
              </div>
            }>
              <PreviewPanel />
            </Suspense>
          </div>
        </div>
        <ScrollButtons />
      </main>
      <MobileTabBar />
      <ToastContainer />
    </div>
  );
}