import { create } from 'zustand';
import { usePrdStore } from './usePrdStore';

const pick = function (s) {
  return {
    fields: s.fields,
    features: s.features,
    palette: s.palette,
    roles: s.roles,
    schemaTables: s.schemaTables,
    acModules: s.acModules,
    techOptional: s.techOptional,
    simpleExtras: s.simpleExtras,
    mode: s.mode,
  };
};

export const usePreviewStore = create(function () {
  return pick(usePrdStore.getState());
});

let rafScheduled = false;

usePrdStore.subscribe(function () {
  if (rafScheduled) return;
  rafScheduled = true;

  requestAnimationFrame(function () {
    rafScheduled = false;
    usePreviewStore.setState(pick(usePrdStore.getState()));
  });
});