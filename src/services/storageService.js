import { STORAGE_KEY } from '../utils/constants';

export const storageService = {
  save: function (data) {
    try {
      const p = JSON.stringify(data);
      if (p.length > 4000000) throw new Error('Too large');
      localStorage.setItem(STORAGE_KEY, p);
      return true;
    } catch (e) { return false; }
  },
  load: function () {
    try {
      const r = localStorage.getItem(STORAGE_KEY);
      return r ? JSON.parse(r) : null;
    } catch (e) { return null; }
  },
  clear: function () {
    try { localStorage.removeItem(STORAGE_KEY); return true; } catch (e) { return false; }
  },
};
