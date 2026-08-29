import { create } from 'zustand';

export const useToastStore = create(function (set) {
  return {
    toasts: [],
    showToast: function (msg, type) {
      type = type || 'success';
      const id = Date.now() + Math.random();
      set(function (s) { return { toasts: s.toasts.concat([{ id: id, msg: msg, type: type }]) }; });
      setTimeout(function () {
        set(function (s) { return { toasts: s.toasts.filter(function (t) { return t.id !== id; }) }; });
      }, 2900);
    },
  };
});

export const useToast = function () { return useToastStore(function (s) { return s.showToast; }); };
