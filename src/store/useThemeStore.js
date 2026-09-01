import { create } from 'zustand';

const KEY = 'prdTheme';

export const applyTheme = function (t) {
  const root = document.documentElement;
  if (t === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
};

export const useThemeStore = create(function (set) {
  let initial = 'dark';
  try { initial = localStorage.getItem(KEY) || 'dark'; } catch (e) {}
  return {
    theme: initial,
    setTheme: function (t) {
      applyTheme(t);
      try { localStorage.setItem(KEY, t); } catch (e) {}
      set({ theme: t });
    },
  };
});
