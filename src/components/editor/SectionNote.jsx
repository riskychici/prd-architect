import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { usePrdStore } from '../../store/usePrdStore';
import ToggleSwitch from '../shared/ToggleSwitch';
import { SECTION_TITLES, isSectionVisible } from '../../utils/sectionNotes';

export default function SectionNote(props) {
  const noteKey = props.noteKey;

  const f = usePrdStore(function (s) { return s.fields; });
  const set = usePrdStore(function (s) { return s.setField; });
  const mode = usePrdStore(function (s) { return s.mode; });
  const simpleExtras = usePrdStore(function (s) { return s.simpleExtras; });
  const commit = usePrdStore(function (s) { return s.commitHistory; });

  if (!isSectionVisible(noteKey, mode, simpleExtras)) return null;

  const title = SECTION_TITLES[noteKey] || noteKey;
  const enabledMap = f.sectionNotesEnabled || {};
  const notesMap = f.sectionNotes || {};
  const importantMap = f.sectionNotesImportant || {};
  const enabled = enabledMap[noteKey] === true;
  const important = importantMap[noteKey] === true;
  const value = notesMap[noteKey] || '';

  function handleToggle(v) {
    set('sectionNotesEnabled', Object.assign({}, enabledMap, {
      [noteKey]: v,
    }));
    commit();
  }

  function handleImportant(v) {
    set('sectionNotesImportant', Object.assign({}, importantMap, {
      [noteKey]: v,
    }));
    commit();
  }

  function handleChange(e) {
    set('sectionNotes', Object.assign({}, notesMap, {
      [noteKey]: e.target.value,
    }));
  }

  const boxCls = important
    ? 'mt-4 rounded-lg border border-dashed border-danger/50 bg-danger/5 p-3 space-y-2'
    : 'mt-4 rounded-lg border border-dashed border-accent/40 bg-accent/5 p-3 space-y-2';

  return (
    <div className={boxCls}>
      <ToggleSwitch
        checked={enabled}
        onChange={handleToggle}
        label={'Catatan section: ' + title}
        icon={<FontAwesomeIcon icon={faCircleInfo} />}
        iconColor={important ? 'text-danger' : 'text-accent'}
      />

      {enabled && (
        <div className="space-y-2">
          <div>
            <label htmlFor={'section-note-' + noteKey} className="sr-only">
              {'Catatan untuk ' + title}
            </label>

            <textarea
              id={'section-note-' + noteKey}
              value={value}
              onChange={handleChange}
              rows="2"
              maxLength={500}
              placeholder="Tulis catatan: asumsi, aturan teknis, TODO, atau reminder untuk tim."
              className="w-full bg-field border border-line rounded-lg p-2.5 text-xs text-ink focus:border-accent focus:outline-none resize-none"
            />

            <p className="text-[10px] text-mut">{value.length}/500</p>
          </div>

          <ToggleSwitch
            checked={important}
            onChange={handleImportant}
            label="Tandai sebagai catatan penting"
            icon={<FontAwesomeIcon icon={faCircleExclamation} />}
            iconColor="text-danger"
          />

          <p className="text-[10px] text-mut">
            {important
              ? 'Di dokumen, catatan ini tampil dengan aksen merah dan label Penting.'
              : 'Di dokumen, catatan ini tampil mengikuti warna dokumen dengan label Catatan.'}
          </p>
        </div>
      )}
    </div>
  );
}
