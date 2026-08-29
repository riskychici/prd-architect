import { create } from 'zustand';
export const useViewStore = create(function (set) {
  return { view: 'editor', setView: function (v) { set({ view: v }); } };
});
