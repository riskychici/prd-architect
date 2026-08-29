import { useEffect, useRef } from 'react';

export const useSwipe = function (onLeft, onRight, threshold) {
  threshold = threshold || 70;
  const start = useRef(null);

  useEffect(function () {
    const mq = window.matchMedia('(max-width: 1023.98px)');
    const ts = function (e) {
      if (!mq.matches) return;
      if (e.target.closest && e.target.closest('pre,table,.combo-drop,input,textarea,select,[data-no-swipe]')) return;
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    };
    const te = function (e) {
      if (!start.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      start.current = null;
      if (Math.abs(dx) > threshold && Math.abs(dx) > 2 * Math.abs(dy)) {
        if (dx < 0) onLeft && onLeft();
        else onRight && onRight();
      }
    };
    document.addEventListener('touchstart', ts, { passive: true });
    document.addEventListener('touchend', te, { passive: true });
    return function () {
      document.removeEventListener('touchstart', ts);
      document.removeEventListener('touchend', te);
    };
  }, [onLeft, onRight, threshold]);
};
