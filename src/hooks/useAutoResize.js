import { useEffect, useCallback, useMemo } from 'react';

export const useAutoResize = function () {
  const resize = useCallback(function (el) {
    if (!el || el.tagName !== 'TEXTAREA') return;
    if (!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)) return;
    if (!el.dataset.minHeight) {
      const p = el.style.height;
      el.style.height = 'auto';
      el.dataset.minHeight = el.scrollHeight + 2;
      el.style.height = p || (el.scrollHeight + 2) + 'px';
      return;
    }
    const min = parseInt(el.dataset.minHeight || '0', 10);
    el.style.height = 'auto';
    el.style.height = Math.max(min, el.scrollHeight + 2) + 'px';
  }, []);

  const resizeAll = useCallback(function () {
    document.querySelectorAll('textarea').forEach(resize);
  }, [resize]);

  useEffect(function () {
    resizeAll();
    window.addEventListener('resize', resizeAll);
    return function () { window.removeEventListener('resize', resizeAll); };
  }, [resizeAll]);

  // Objek return dibuat stabil dengan useMemo.
  // Sebelumnya objek baru dibuat tiap render, sehingga effect di
  // EditorPanel bongkar pasang listener setiap ketikan dan membuat
  // ketikan terasa patah-patah.
  return useMemo(function () {
    return { resize: resize, resizeAll: resizeAll };
  }, [resize, resizeAll]);
};