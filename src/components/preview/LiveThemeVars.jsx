import { useEffect } from 'react';
import { usePrdStore } from '../../store/usePrdStore';
import { useLiveColorStore } from '../../store/useLiveColorStore';
import { resolveCoverTheme } from '../../utils/helpers';

export default function LiveThemeVars(props) {
  const targetId = props.targetId;
  const f = usePrdStore(function (s) { return s.fields; });
  const palette = usePrdStore(function (s) { return s.palette; });
  const live = useLiveColorStore(function (s) { return s.live; });

  useEffect(function () {
    const el = document.getElementById(targetId);
    if (!el) return;

    const fields = live && live.fieldsPatch ? Object.assign({}, f, live.fieldsPatch) : f;
    const pal = live && live.palette ? live.palette : palette;
    const t = resolveCoverTheme(fields, pal);

    el.style.setProperty('--doc-primary', t.primary);
    el.style.setProperty('--doc-primary-text', t.primaryText);
    el.style.setProperty('--doc-accent', t.accent);
    el.style.setProperty('--doc-accent-text', t.accentText);
    el.style.setProperty('--doc-bg', t.bg);
  }, [targetId, f, palette, live]);

  return null;
}
