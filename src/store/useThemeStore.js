import { create } from 'zustand';

const KEY = 'prdTheme';
const TRANSITION_MS = 500;
let transitionTimer = null;

export const applyTheme = function (t, animate) {
  const root = document.documentElement;

  var applyChange = function () {
    if (t === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  };

  if (!animate) {
    applyChange();
    return;
  }

  // Metode utama: View Transition API (Chrome, Edge, Opera)
  // Sangat mulus karena cross-fade diproses di compositor browser
  if (typeof document.startViewTransition === 'function') {
    document.startViewTransition(applyChange);
    return;
  }

  // Fallback: CSS transition (Firefox, Safari, browser lama)
  root.classList.add('theme-transition');
  applyChange();
  if (transitionTimer) clearTimeout(transitionTimer);
  transitionTimer = setTimeout(function () {
    root.classList.remove('theme-transition');
    transitionTimer = null;
  }, TRANSITION_MS);
};

export const useThemeStore = create(function (set) {
  let initial = 'dark';
  try { initial = localStorage.getItem(KEY) || 'dark'; } catch (e) {}
  return {
    theme: initial,
    setTheme: function (t) {
      applyTheme(t, true);
      try { localStorage.setItem(KEY, t); } catch (e) {}
      set({ theme: t });
    },
  };
});