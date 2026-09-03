import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { debounce } from 'lodash';
import { usePrdStore } from './store/usePrdStore';
import { storageService } from './services/storageService';
import Header from './components/header/Header';
import EditorPanel from './components/editor/EditorPanel';
import MobileTabBar from './components/mobile/MobileTabBar';
import ScrollButtons from './components/mobile/ScrollButtons';
import ToastContainer from './components/shared/Toast';
import DocsPage from './components/docs/DocsPage';

const PreviewPanel = lazy(() => import('./components/preview/PreviewPanel'));

// FIX: Variabel module-level agar tidak reset saat komponen remount
let appInitDone = false;

export default function App() {
  const [page, setPage] = useState('app');
  const restoreState = usePrdStore(function (s) { return s.restoreState; });
  const setMode = usePrdStore(function (s) { return s.setMode; });

  // Inisialisasi data dari localStorage (hanya sekali)
  useEffect(function () {
    if (appInitDone) return;
    appInitDone = true;
    const saved = storageService.load();
    if (saved && saved.state) {
      if (saved.mode) setMode(saved.mode);
      restoreState(saved.state);
    }
    setTimeout(function () { usePrdStore.getState().commitHistory(); }, 0);
  }, []);

  // Commit history saat user mengetik atau klik tombol
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

  // FIX 1: Guard keyboard shortcut agar tidak aktif di halaman docs
  useEffect(function () {
    function handler(e) {
      if (page !== 'app') return;
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
  }, [page]);

  // FIX 2: Trigger resize textarea saat kembali ke app
  // (karena saat display:none, textarea punya dimensi 0)
  useEffect(function () {
    if (page === 'app') {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          window.dispatchEvent(new Event('resize'));
        });
      });
    }
  }, [page]);

  // FIX 3: Render kedua halaman bersamaan.
  // App disembunyikan dengan display:none (bukan di-unmount),
  // sehingga tidak ada proses rebuild DOM yang berat saat kembali.
  return (
    <>
      {page === 'docs' && <DocsPage onBack={function () { setPage('app'); }} />}

      <div
        className="app-shell flex flex-col bg-base text-ink overflow-hidden"
        style={page === 'docs' ? { display: 'none' } : undefined}
      >
        <a href="#editorPanel" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-accent focus:text-white focus:px-3 focus:py-2 focus:rounded focus:text-sm">Lompat ke Editor</a>
        <a href="#previewPanel" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-accent focus:text-white focus:px-3 focus:py-2 focus:rounded focus:text-sm">Lompat ke Preview</a>
        <Header onOpenDocs={function () { setPage('docs'); }} />
        <main className="flex-grow min-h-0 overflow-hidden relative">
          <div id="panelSlider">
            <div><EditorPanel /></div>
            <div>
              <Suspense fallback={
                <div id="previewPanel" className="bg-base p-6 flex items-center justify-center h-full">
                  <div className="text-mut text-sm">Memuat preview...</div>
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
    </>
  );
}