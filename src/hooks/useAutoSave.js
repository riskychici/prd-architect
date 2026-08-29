import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { usePrdStore } from '../store/usePrdStore';
import { storageService } from '../services/storageService';
import { AUTOSAVE_DELAY } from '../utils/constants';

export const useAutoSave = function () {
  const mode = usePrdStore(function (s) { return s.mode; });
  const fields = usePrdStore(function (s) { return s.fields; });
  const features = usePrdStore(function (s) { return s.features; });
  const palette = usePrdStore(function (s) { return s.palette; });
  const roles = usePrdStore(function (s) { return s.roles; });
  const schemaTables = usePrdStore(function (s) { return s.schemaTables; });
  const acModules = usePrdStore(function (s) { return s.acModules; });
  const simpleExtras = usePrdStore(function (s) { return s.simpleExtras; });
  const techOptional = usePrdStore(function (s) { return s.techOptional; });
  const setSaveIndicator = usePrdStore(function (s) { return s.setSaveIndicator; });
  const first = useRef(true);

  useEffect(function () {
    const state = { mode: mode, fields: fields, features: features, palette: palette, roles: roles, schemaTables: schemaTables, acModules: acModules, simpleExtras: simpleExtras, techOptional: techOptional };
    const save = debounce(function () {
      const ok = storageService.save(state);
      if (ok) {
        const t = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setSaveIndicator('Tersimpan ' + t);
      }
    }, AUTOSAVE_DELAY);
    if (first.current) { first.current = false; save.flush(); } else { save(); }
    return function () { save.cancel(); };
  }, [mode, fields, features, palette, roles, schemaTables, acModules, simpleExtras, techOptional, setSaveIndicator]);
};
