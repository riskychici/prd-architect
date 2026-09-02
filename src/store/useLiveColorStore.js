import { create } from 'zustand';

export const useLiveColorStore = create(function (set) {
  return {
    live: null,
    setLive: function (live) { set({ live: live }); },
    clearLive: function () { set({ live: null }); },
  };
});
