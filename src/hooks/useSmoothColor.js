import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeHex } from '../utils/helpers';
import { useLiveColorStore } from '../store/useLiveColorStore';

export const useSmoothColor = function (opts) {
  const storeHex = opts.value;
  const [defaultHex, setDefaultHex] = useState(function () { return normalizeHex(storeHex); });
  const [version, setVersion] = useState(0);
  const first = useRef(true);
  const lastPushed = useRef(null);
  const lastCommitted = useRef(null);
  const idleTimer = useRef(null);
  const raf = useRef(null);
  const pendingHex = useRef(null);
  const cleanupRef = useRef(null);
  const optsRef = useRef(opts);

  useEffect(function () { optsRef.current = opts; });

  // Remount (ganti key) HANYA untuk perubahan dari luar:
  // ketik hex, undo, redo, impor, atau AI.
  useEffect(function () {
    if (first.current) { first.current = false; return; }
    if (storeHex !== lastPushed.current && storeHex !== lastCommitted.current) {
      setDefaultHex(normalizeHex(storeHex));
      setVersion(function (v) { return v + 1; });
    }
  }, [storeHex]);

  useEffect(function () {
    return function () {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (raf.current) cancelAnimationFrame(raf.current);
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  const commitNow = useCallback(function (v) {
    lastCommitted.current = v;
    lastPushed.current = v;
    if (idleTimer.current) { clearTimeout(idleTimer.current); idleTimer.current = null; }
    if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; }
    pendingHex.current = null;
    useLiveColorStore.getState().clearLive();
    optsRef.current.commit(v);
  }, []);

  // Selama geseran: tidak ada setState, tidak ada commit store.
  // Hanya live override via requestAnimationFrame (max 1x per frame).
  const onInput = useCallback(function (e) {
    const v = e.target.value;
    if (v === lastPushed.current) return;
    lastPushed.current = v;
    pendingHex.current = v;

    if (!raf.current) {
      raf.current = requestAnimationFrame(function () {
        raf.current = null;
        const h = pendingHex.current;
        pendingHex.current = null;
        if (!h) return;
        const o = optsRef.current;
        if (o.makeLive) useLiveColorStore.getState().setLive(o.makeLive(h));
        if (o.onLiveDom) o.onLiveDom(h);
      });
    }

    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(function () {
      idleTimer.current = null;
      commitNow(v);
    }, 450);
  }, [commitNow]);

  const setRef = useCallback(function (node) {
    if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null; }
    if (node) {
      const onNativeChange = function () {
        commitNow(node.value);
      };
      node.addEventListener('change', onNativeChange);
      cleanupRef.current = function () { node.removeEventListener('change', onNativeChange); };
    }
  }, [commitNow]);

  return { version: version, defaultHex: defaultHex, onInput: onInput, ref: setRef };
};
