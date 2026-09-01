import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function EditorSection(props) {
  const title = props.title;
  const icon = props.icon;
  const action = props.action;
  const children = props.children;

  return (
    <div className="bg-card p-5 rounded-xl border border-line space-y-4">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider flex items-center text-ink">
          {icon && <FontAwesomeIcon icon={icon} className="mr-2 text-accent" />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}
