import { useState, useRef, useEffect } from 'react';
import { DATA_TYPES } from '../../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function ComboBox(props) {
  const value = props.value;
  const onChange = props.onChange;
  const placeholder = props.placeholder || 'Tipe data';
  const label = props.label || 'Tipe data';

  const [inputId] = useState(function () {
    return 'combo-' + (label || '').replace(/\s+/g, '-').toLowerCase() + '-' + Math.random().toString(36).slice(2, 7);
  });
  const [open, setOpen] = useState(false);
  const [ai, setAi] = useState(-1);
  const ref = useRef(null);

  useEffect(function () {
    const h = function (e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return function () { document.removeEventListener('mousedown', h); };
  }, []);

  const q = (value || '').trim().toLowerCase();
  const flat = [];
  DATA_TYPES.forEach(function (cat) {
    cat.items.filter(function (it) { return !q || it.toLowerCase().includes(q); }).forEach(function (it) {
      flat.push({ cat: cat.category, value: it });
    });
  });

  const grouped = {};
  flat.forEach(function (it) {
    if (!grouped[it.cat]) grouped[it.cat] = [];
    grouped[it.cat].push(it.value);
  });

  const onKey = function (e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { setOpen(true); return; }
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setAi(function (i) { return (i + 1) % Math.max(1, flat.length); }); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAi(function (i) { return (i - 1 + flat.length) % Math.max(1, flat.length); }); }
    else if (e.key === 'Enter' && ai >= 0) { e.preventDefault(); onChange && onChange(flat[ai].value); setOpen(false); }
  };

  return (
    <div ref={ref} className="relative">
      <label htmlFor={inputId} className="sr-only">{label}</label>
      <input
        id={inputId}
        value={value}
        onChange={function (e) { onChange && onChange(e.target.value); setOpen(true); setAi(-1); }}
        onFocus={function () { setOpen(true); }}
        onKeyDown={onKey}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className="w-full bg-field border border-line rounded p-1.5 pr-6 text-ink font-mono text-xs focus:border-accent focus:outline-none"
      />
      <FontAwesomeIcon icon={faChevronDown} className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-mut pointer-events-none" aria-hidden="true" />
      {open && (
        <div className="absolute z-40 left-0 right-0 mt-1 bg-card border border-line rounded-lg max-h-56 overflow-y-auto shadow-lg" role="listbox">
          {Object.keys(grouped).length === 0 ? (
            <div className="px-2.5 py-2 text-[11px] text-mut italic">Tidak ada tipe data yang cocok</div>
          ) : Object.entries(grouped).map(function (entry) {
            const cat = entry[0];
            const items = entry[1];
            return (
              <div key={cat}>
                <div className="px-2.5 py-1 text-[9px] uppercase tracking-wider text-mut bg-field sticky top-0">{cat}</div>
                {items.map(function (it) {
                  const gi = flat.findIndex(function (x) { return x.value === it; });
                  return (
                    <button key={it} type="button" role="option" aria-selected={gi === ai} onClick={function () { onChange && onChange(it); setOpen(false); }}
                      className={'block w-full text-left px-2.5 py-1.5 text-[11px] text-ink hover:bg-accent/15 font-mono ' + (gi === ai ? 'bg-accent/20' : '')}>{it}</button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
