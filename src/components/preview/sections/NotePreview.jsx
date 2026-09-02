import { usePreviewStore as usePrdStore } from '../../../store/usePreviewStore';
import { getSectionNote } from '../../../utils/sectionNotes';

export default function NotePreview(props) {
  const noteKey = props.noteKey;

  const fields = usePrdStore(function (s) { return s.fields; });
  const mode = usePrdStore(function (s) { return s.mode; });
  const simpleExtras = usePrdStore(function (s) { return s.simpleExtras; });

  const note = getSectionNote(
    {
      fields: fields,
      mode: mode,
      simpleExtras: simpleExtras,
    },
    noteKey
  );

  if (!note) return null;

  if (note.important) {
    return (
      <div className="p-3 bg-rose-50 border-l-4 border-rose-600 rounded text-xs keep-together">
        <p className="text-rose-900 leading-relaxed">
          <strong className="font-bold">Penting:</strong>{' '}
          <span className="whitespace-pre-wrap">{note.text}</span>
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-3 bg-slate-100 border-l-4 rounded text-xs keep-together"
      style={{ borderLeftColor: 'var(--doc-accent)' }}
    >
      <p className="text-slate-700 leading-relaxed">
        <strong className="font-bold" style={{ color: 'var(--doc-accent-text)' }}>
          Catatan:
        </strong>{' '}
        <span className="whitespace-pre-wrap">{note.text}</span>
      </p>
    </div>
  );
}
