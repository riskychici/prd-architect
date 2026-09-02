import { useCallback, useEffect, useRef } from 'react';

export const useThrottledCallback = function (fn, wait) {
  wait = wait || 50;

  const fnRef = useRef(fn);
  const timer = useRef(null);
  const pending = useRef(null);
  const lastRun = useRef(0);

  useEffect(function () {
    fnRef.current = fn;
  });

  useEffect(function () {
    return function () {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return useCallback(function (value) {
    pending.current = value;

    const now = Date.now();
    const elapsed = now - lastRun.current;

    if (elapsed >= wait) {
      lastRun.current = now;
      fnRef.current(pending.current);
      pending.current = null;
      return;
    }

    if (timer.current) return;

    timer.current = setTimeout(function () {
      timer.current = null;
      lastRun.current = Date.now();
      fnRef.current(pending.current);
      pending.current = null;
    }, wait - elapsed);
  }, [wait]);
};
