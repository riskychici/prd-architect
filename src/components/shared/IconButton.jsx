import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function IconButton(props) {
  const icon = props.icon;
  const onClick = props.onClick;
  const variant = props.variant || 'default';
  const disabled = props.disabled;
  const className = props.className || '';
  const children = props.children;
  const title = props.title;
  const ariaLabel = props['aria-label'] || props.ariaLabel || title;
  const v = {
    default: 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600',
    danger: 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800',
    primary: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500',
    accent: 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={'flex items-center justify-center gap-1.5 px-3 py-2 md:py-1.5 text-xs font-semibold rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed ' + (v[variant] || v.default) + ' ' + className}
    >
      {icon && <FontAwesomeIcon icon={icon} aria-hidden="true" />}
      {children}
    </button>
  );
}