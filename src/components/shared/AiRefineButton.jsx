import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { refineText } from '../../services/groqService';
import { useToast } from '../../hooks/useToast';

// ============================================================
// TOMBOL PERHALUS TEKS AI (IN-LINE TEXT ENHANCER)
// - Nonaktif otomatis jika kolom kosong.
// - Menampilkan spinner saat AI bekerja.
// - Jika hasil AI sama dengan teks asli, berarti teks sudah
//   dianggap profesional, jadi diberi feedback positif,
//   bukan pesan yang terkesan seperti error.
// ============================================================
export default function AiRefineButton(props) {
  const value = props.value || '';
  const onApply = props.onApply;
  const mode = props.mode || 'paragraph';
  const label = props.label || 'kolom ini';
  const className = props.className || '';
  const showToast = useToast();
  const [busy, setBusy] = useState(false);
  const disabled = busy || !value.trim();

  async function handle() {
    if (disabled) return;
    setBusy(true);
    try {
      const result = await refineText(value.trim(), mode);

      if (result && result.trim()) {
        if (result.trim() !== value.trim()) {
          // AI memberikan versi yang lebih profesional
          onApply(result.trim());
          showToast('Teks berhasil diperhalus oleh AI', 'success');
        } else {
          // OPSI 1: AI memutuskan teks sudah bagus.
          // Beri feedback positif agar user paham ini fitur,
          // bukan bug.
          showToast('AI: Teks ini sudah cukup profesional', 'info');
        }
      } else {
        showToast('AI tidak menghasilkan output', 'error');
      }
    } catch (e) {
      showToast('Gagal memperhalus: ' + e.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handle}
      disabled={disabled}
      title="Perhalus teks dengan AI (Qwen)"
      aria-label={'Perhalus teks ' + label + ' dengan AI'}
      className={
        'inline-flex items-center justify-center w-7 h-7 rounded-md border border-purple-700/50 bg-purple-950/40 text-purple-300 hover:text-white hover:border-purple-500 hover:bg-purple-700/40 transition disabled:opacity-30 disabled:cursor-not-allowed ' +
        className
      }
    >
      <FontAwesomeIcon
        icon={busy ? faSpinner : faWandMagicSparkles}
        className={'text-[11px] ' + (busy ? 'animate-spin' : '')}
      />
    </button>
  );
}