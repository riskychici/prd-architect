import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { refineText } from '../../services/groqService';
import { usePrdStore } from '../../store/usePrdStore';
import { useToast } from '../../hooks/useToast';

export default function AiRefineButton(props) {
  const value = props.value || '';
  const onApply = props.onApply;
  const mode = props.mode || 'paragraph';
  const label = props.label || 'kolom ini';
  const className = props.className || '';
  const commit = usePrdStore(function (s) { return s.commitHistory; });
  const showToast = useToast();
  const [busy, setBusy] = useState(false);
  const [lastRefined, setLastRefined] = useState(null);

  const trimmed = value.trim();
  const unchangedSinceRefine = lastRefined !== null && trimmed === lastRefined;
  const disabled = busy || !trimmed || unchangedSinceRefine;

  async function handle() {
    if (disabled) return;
    setBusy(true);
    try {
      const result = await refineText(trimmed, mode, label);
      if (result && result.trim()) {
        if (result.trim() !== trimmed) {
          onApply(result.trim());
          commit();
          showToast('Teks berhasil diperhalus oleh AI', 'success');
        } else {
          showToast('AI: Teks ini sudah cukup profesional', 'info');
        }
        setLastRefined(result.trim());
      } else {
        setLastRefined(trimmed);
        showToast('AI tidak menghasilkan output', 'error');
      }
    } catch (e) {
      showToast('Gagal memperhalus: ' + e.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  const title = busy
    ? 'Sedang memperhalus teks...'
    : unchangedSinceRefine
      ? 'Ubah teks terlebih dahulu untuk memperhalus lagi'
      : 'Perhalus teks dengan AI (Qwen)';

  return (
    <button
      type="button"
      onClick={handle}
      disabled={disabled}
      title={title}
      aria-label={'Perhalus teks ' + label + ' dengan AI'}
      className={
        'inline-flex items-center justify-center w-7 h-7 rounded-md border border-line bg-field text-accent hover:text-white hover:border-accent hover:bg-accent transition disabled:opacity-30 disabled:cursor-not-allowed ' +
        className
      }
    >
      <FontAwesomeIcon icon={busy ? faSpinner : faWandMagicSparkles} className={'text-[11px] ' + (busy ? 'animate-spin' : '')} />
    </button>
  );
}
