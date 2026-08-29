import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useViewStore } from '../../store/useViewStore';

const AMBANG_NAIK = 0.8;
const AMBANG_TURUN = 0.2;

export default function ScrollButtons() {
  const view = useViewStore(function (s) { return s.view; });
  const [atTop, setAtTop] = useState({ editor: true, preview: true });
  const autoScroll = useRef({ editor: false, preview: false });
  const timers = useRef({ editor: null, preview: null });
  const guards = useRef({ editor: null, preview: null });

  function getEl(panel) {
    return document.getElementById(panel === 'editor' ? 'editorPanel' : 'previewPanel');
  }

  function updateIcon(panel) {
    const el = getEl(panel);
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setAtTop(function (prev) {
      let top = prev[panel];
      if (max <= 4) {
        top = true;
      } else {
        const p = el.scrollTop / max;
        if (p >= AMBANG_NAIK) top = false;
        else if (p <= AMBANG_TURUN) top = true;
      }
      if (prev[panel] === top) return prev;
      const next = { editor: prev.editor, preview: prev.preview };
      next[panel] = top;
      return next;
    });
  }

  function stopAuto(panel) {
    if (timers.current[panel]) { clearInterval(timers.current[panel]); timers.current[panel] = null; }
    if (guards.current[panel]) { clearTimeout(guards.current[panel]); guards.current[panel] = null; }
    if (autoScroll.current[panel]) {
      autoScroll.current[panel] = false;
      updateIcon(panel);
    }
  }

  function watchEnd(panel, el, dest) {
    if (timers.current[panel]) clearInterval(timers.current[panel]);
    if (guards.current[panel]) clearTimeout(guards.current[panel]);
    let last = el.scrollTop;
    let same = 0;
    timers.current[panel] = setInterval(function () {
      const cur = el.scrollTop;
      const reached = Math.abs(cur - dest) <= 4;
      same = cur === last ? same + 1 : 0;
      last = cur;
      if (reached || same >= 3) stopAuto(panel);
    }, 80);
    guards.current[panel] = setTimeout(function () { stopAuto(panel); }, 3000);
  }

  function scroll(panel, down) {
    const el = getEl(panel);
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 4) return;
    const dest = down ? max : 0;
    autoScroll.current[panel] = true;
    el.scrollTo({ top: dest, behavior: 'smooth' });
    watchEnd(panel, el, dest);
  }

  useEffect(function () {
    function onScrollCapture(e) {
      const t = e.target;
      if (!t || t.nodeType !== 1) return;
      if (t.id === 'editorPanel' && !autoScroll.current.editor) updateIcon('editor');
      else if (t.id === 'previewPanel' && !autoScroll.current.preview) updateIcon('preview');
    }

    document.addEventListener('scroll', onScrollCapture, { capture: true, passive: true });

    function interrupt() {
      if (autoScroll.current.editor) stopAuto('editor');
      if (autoScroll.current.preview) stopAuto('preview');
    }

    document.addEventListener('touchstart', interrupt, { passive: true });
    document.addEventListener('wheel', interrupt, { passive: true });
    document.addEventListener('keydown', interrupt, { passive: true });

    updateIcon('editor');
    updateIcon('preview');

    return function () {
      document.removeEventListener('scroll', onScrollCapture, { capture: true });
      document.removeEventListener('touchstart', interrupt);
      document.removeEventListener('wheel', interrupt);
      document.removeEventListener('keydown', interrupt);
      stopAuto('editor');
      stopAuto('preview');
    };
  }, []);

  function btn(panel) {
    const top = atTop[panel];
    return (
      <button
        onClick={function () { scroll(panel, top); }}
        className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-800 text-slate-200 border border-slate-600 shadow-lg hover:bg-blue-600 hover:text-white transition"
        title={panel === 'editor' ? 'Scroll editor' : 'Scroll preview'}
      >
        <FontAwesomeIcon icon={top ? faArrowDown : faArrowUp} />
      </button>
    );
  }

  const editorCls = 'no-print fixed z-[45] bottom-20 lg:bottom-5 right-3 lg:right-[calc(50%+14px)] flex-col gap-2 ' + (view === 'editor' ? 'flex' : 'hidden lg:flex');
  const previewCls = 'no-print fixed z-[45] bottom-20 lg:bottom-5 right-3 lg:right-5 flex-col gap-2 ' + (view === 'preview' ? 'flex' : 'hidden lg:flex');

  return (
    <div>
      <div className={editorCls}>{btn('editor')}</div>
      <div className={previewCls}>{btn('preview')}</div>
    </div>
  );
}