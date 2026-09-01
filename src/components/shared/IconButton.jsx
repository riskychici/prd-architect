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
    default: 'bg-field hover:bg-line text-ink border-line',
    danger: 'bg-danger/10 hover:bg-danger/20 text-danger border-danger/30',
    primary: 'bg-accent hover:bg-accent2 text-white border-accent',
    accent: 'bg-accent hover:bg-accent2 text-white border-accent',
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
