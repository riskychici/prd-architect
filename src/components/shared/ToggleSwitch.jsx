export default function ToggleSwitch(props) {
  const checked = props.checked;
  const onChange = props.onChange;
  const label = props.label;
  const icon = props.icon;
  const iconColor = props.iconColor || 'text-slate-400';
  const id = 'toggle-' + (label || '').replace(/\s+/g, '-').toLowerCase();

  return (
    <label htmlFor={id} className="extra-toggle flex items-center justify-between p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-700 rounded-lg cursor-pointer transition">
      <span className="flex items-center space-x-2 text-slate-200">
        {icon && <span className={'text-xs w-4 ' + iconColor}>{icon}</span>}
        <span className="text-[11px] font-medium">{label}</span>
      </span>
      <input
        id={id}
        type="checkbox"
        checked={!!checked}
        onChange={function (e) { onChange && onChange(e.target.checked); }}
        className="appearance-none w-9 h-5 bg-slate-600 rounded-full relative cursor-pointer transition-colors checked:bg-emerald-500 after:content-[''] after:absolute after:w-4 after:h-4 after:rounded-full after:bg-white after:top-0.5 after:left-0.5 after:transition-all checked:after:left-[18px]"
      />
    </label>
  );
}