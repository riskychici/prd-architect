import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function EditorSection(props) {
  const title = props.title;
  const icon = props.icon;
  const color = props.color || 'blue';
  const action = props.action;
  const children = props.children;
  const c = { blue: 'text-blue-400', amber: 'text-amber-400' };
  const b = { blue: 'border-slate-700/80', amber: 'border-blue-900/60' };
  return (
    <div className={'bg-slate-800 p-5 rounded-xl border shadow-md space-y-4 ' + b[color]}>
      <div className="flex justify-between items-center gap-2">
        <h2 className={'text-sm font-bold uppercase tracking-wider flex items-center ' + c[color]}>
          {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}
