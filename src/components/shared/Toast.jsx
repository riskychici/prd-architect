import { useToastStore } from '../../hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export default function ToastContainer() {
  const toasts = useToastStore(function (s) { return s.toasts; });
  const colors = { success: 'bg-emerald-600', error: 'bg-rose-600', info: 'bg-blue-600' };
  const icons = { success: faCircleCheck, error: faCircleExclamation, info: faCircleInfo };
  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-2 no-print">
      {toasts.map(function (t) {
        return (
          <div key={t.id} className={'px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white flex items-center space-x-2 ' + colors[t.type] + ' animate-[slideUp_0.3s_ease]'}>
            <FontAwesomeIcon icon={icons[t.type]} />
            <span>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}
