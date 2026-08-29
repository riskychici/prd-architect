import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../../store/usePrdStore';
import { TECH_REQUIRED, TECH_OPTIONAL } from '../../../utils/constants';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';

function FieldRow(props) {
  const def = props.def;
  const value = props.value;
  const onChange = props.onChange;
  const onRemove = props.onRemove;
  const fieldId = 'tech-' + def.key;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={fieldId} className="text-slate-300 font-medium flex items-center">
          <FontAwesomeIcon icon={def.icon} className={def.color + ' mr-1'} aria-hidden="true" />
          {def.label}
        </label>
        {onRemove && (
          <button onClick={onRemove} className="text-rose-400 hover:text-rose-300 text-[10px] font-semibold" title="Hapus stack ini" aria-label={'Hapus ' + def.label}>
            <FontAwesomeIcon icon={faXmark} className="mr-1" aria-hidden="true" />
            Hapus
          </button>
        )}
      </div>
      <input
        id={fieldId}
        type="text"
        value={value}
        onChange={function (e) { onChange(e.target.value); }}
        placeholder={def.ph || ''}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

export default function TechStack() {
  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  const techOptional = usePrdStore(function (s) { return s.techOptional; });
  const addTech = usePrdStore(function (s) { return s.addTechExtra; });
  const remTech = usePrdStore(function (s) { return s.removeTechExtra; });
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(function () {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return function () { document.removeEventListener('mousedown', onDoc); };
  }, []);

  const availEssential = TECH_OPTIONAL.filter(function (d) { return d.category === 'Esensial' && !techOptional.includes(d.key); });
  const availAdvanced = TECH_OPTIONAL.filter(function (d) { return d.category === 'Lanjutan' && !techOptional.includes(d.key); });
  const addedOptional = TECH_OPTIONAL.filter(function (d) { return techOptional.includes(d.key); });

  return (
    <EditorSection
      title="4. Spesifikasi Tech Stack & Arsitektur"
      icon={faLayerGroup}
      action={
        <div className="relative" ref={wrapRef}>
          <IconButton icon={faPlus} onClick={function () { setOpen(!open); }} ariaLabel="Tambah stack lanjutan">Tambah Stack Lanjutan</IconButton>
          {open && (
            <div className="absolute z-40 right-0 mt-2 w-80 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-72 overflow-y-auto" role="menu">
              {availEssential.length > 0 && (
                <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-slate-500 bg-slate-900 sticky top-0">Esensial</div>
              )}
              {availEssential.map(function (d) {
                return (
                  <button key={d.key} onClick={function () { addTech(d.key); }} role="menuitem" className="block w-full text-left px-3 py-2 text-[11px] text-slate-200 hover:bg-blue-600/30">
                    <FontAwesomeIcon icon={d.icon} className={d.color + ' mr-2'} aria-hidden="true" />
                    {d.label}
                  </button>
                );
              })}
              {availAdvanced.length > 0 && (
                <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-slate-500 bg-slate-900 sticky top-0">Lanjutan</div>
              )}
              {availAdvanced.map(function (d) {
                return (
                  <button key={d.key} onClick={function () { addTech(d.key); }} role="menuitem" className="block w-full text-left px-3 py-2 text-[11px] text-slate-200 hover:bg-blue-600/30">
                    <FontAwesomeIcon icon={d.icon} className={d.color + ' mr-2'} aria-hidden="true" />
                    {d.label}
                  </button>
                );
              })}
              {availEssential.length === 0 && availAdvanced.length === 0 && (
                <div className="px-3 py-2 text-[11px] text-slate-500 italic">Semua stack sudah ditambahkan.</div>
              )}
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-3 text-xs">
        <div>
          <label htmlFor="userFlow" className="block text-slate-300 font-medium mb-1">Alur Pengguna (User Flow)</label>
          <input id="userFlow" type="text" value={f.userFlow} onChange={function (e) { set('userFlow', e.target.value); }} placeholder="Landing -> Auth -> Dashboard" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {TECH_REQUIRED.map(function (d) {
            return <FieldRow key={d.key} def={d} value={f[d.key]} onChange={function (v) { set(d.key, v); }} />;
          })}
          {addedOptional.map(function (d) {
            return <FieldRow key={d.key} def={d} value={f[d.key]} onChange={function (v) { set(d.key, v); }} onRemove={function () { remTech(d.key); }} />;
          })}
        </div>
        <div className="pt-1">
          <label htmlFor="dbSchema" className="block text-slate-300 font-medium mb-1">Skema Database & Model Relasi</label>
          <textarea id="dbSchema" value={f.dbSchema} onChange={function (e) { set('dbSchema', e.target.value); }} rows="3" placeholder="users: id, name, email" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none font-mono resize-none" />
        </div>
      </div>
    </EditorSection>
  );
}