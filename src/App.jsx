import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { usePrdStore } from './store/usePrdStore';
import { storageService } from './services/storageService';
import Header from './components/header/Header';
import EditorPanel from './components/editor/EditorPanel';
import PreviewPanel from './components/preview/PreviewPanel';
import MobileTabBar from './components/mobile/MobileTabBar';
import ScrollButtons from './components/mobile/ScrollButtons';
import ToastContainer from './components/shared/Toast';

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
      <Header />
      <main className="flex-grow min-h-0 overflow-hidden relative">
        <div id="panelSlider">
          <div><EditorPanel /></div>
          <div><PreviewPanel /></div>
        </div>
        <ScrollButtons />
      </main>
      <MobileTabBar />
      <ToastContainer />
    </div>
  );
}
