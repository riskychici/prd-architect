import { faClipboardCheck, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePrdStore } from '../../../store/usePrdStore';
import EditorSection from '../EditorSection';
import IconButton from '../../shared/IconButton';
import AiRefineButton from '../../shared/AiRefineButton';

export default function AcSection() {
  const mode = usePrdStore(function (s) { return s.mode; });
  const se = usePrdStore(function (s) { return s.simpleExtras; });
  const ac = usePrdStore(function (s) { return s.acModules; });
  const addM = usePrdStore(function (s) { return s.addAcModule; });
  const updM = usePrdStore(function (s) { return s.updateAcModule; });
  const remM = usePrdStore(function (s) { return s.removeAcModule; });
  const addI = usePrdStore(function (s) { return s.addAcItem; });
  const updI = usePrdStore(function (s) { return s.updateAcItem; });
  const remI = usePrdStore(function (s) { return s.removeAcItem; });

  if (mode !== 'enterprise' && !se.ac) return null;

  return (
    <EditorSection title="Acceptance Criteria per Modul" icon={faClipboardCheck}
      action={<IconButton onClick={addM} variant="accent" ariaLabel="Tambah modul baru">+ Modul</IconButton>}>
      <div className="space-y-4">
        {ac.map(function (m, mi) {
          return (
            <div key={mi} className="p-3 bg-field border border-line rounded-lg space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <div className="relative w-2/3">
                  <label htmlFor={'ac-mod-title-' + mi} className="sr-only">Nama modul {mi + 1}</label>
                  <input id={'ac-mod-title-' + mi} value={m.title} onChange={function (e) { updM(mi, { title: e.target.value }); }} placeholder="Nama modul" className="w-full bg-card border border-line rounded p-1.5 pr-9 text-ink font-semibold" />
                  <AiRefineButton value={m.title} onApply={function (v) { updM(mi, { title: v }); }} mode="phrase" label={'nama modul ' + (mi + 1)} className="absolute right-1 top-1/2 -translate-y-1/2" />
                </div>
                <button onClick={function () { remM(mi); }} aria-label={'Hapus modul ' + (m.title || (mi + 1))} className="text-danger">
                  <FontAwesomeIcon icon={faXmark} aria-hidden="true" /> Hapus
                </button>
              </div>
              <div className="space-y-2">
                {m.items.map(function (it, ii) {
                  return (
                    <div key={ii} className="p-2 bg-card border border-line rounded space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-accent">AC-{mi + 1}.{ii + 1}</span>
                        <button onClick={function () { remI(mi, ii); }} aria-label={'Hapus kriteria AC-' + (mi + 1) + '.' + (ii + 1)} className="text-danger">
                          <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
                        </button>
                      </div>
                      <div className="relative">
                        <label htmlFor={'ac-item-title-' + mi + '-' + ii} className="sr-only">Judul kriteria AC-{mi + 1}.{ii + 1}</label>
                        <input id={'ac-item-title-' + mi + '-' + ii} value={it.title} onChange={function (e) { updI(mi, ii, { title: e.target.value }); }} placeholder="Judul kriteria" className="w-full bg-field border border-line rounded p-1.5 pr-9 text-ink" />
                        <AiRefineButton value={it.title} onApply={function (v) { updI(mi, ii, { title: v }); }} mode="phrase" label={'judul kriteria AC-' + (mi + 1) + '.' + (ii + 1)} className="absolute right-1 top-1/2 -translate-y-1/2" />
                      </div>
                      <div className="relative">
                        <label htmlFor={'ac-item-desc-' + mi + '-' + ii} className="sr-only">Deskripsi kriteria AC-{mi + 1}.{ii + 1}</label>
                        <textarea id={'ac-item-desc-' + mi + '-' + ii} value={it.desc} onChange={function (e) { updI(mi, ii, { desc: e.target.value }); }} rows="2" placeholder="Deskripsi kriteria..." className="w-full bg-field border border-line rounded p-1.5 pr-9 text-ink resize-none" />
                        <AiRefineButton value={it.desc} onApply={function (v) { updI(mi, ii, { desc: v }); }} mode="paragraph" label={'deskripsi kriteria AC-' + (mi + 1) + '.' + (ii + 1)} className="absolute right-1 top-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={function () { addI(mi); }} aria-label={'Tambah kriteria ke modul ' + (m.title || (mi + 1))} className="text-accent font-semibold">
                <FontAwesomeIcon icon={faPlus} className="mr-1" aria-hidden="true" />Tambah Kriteria
              </button>
            </div>
          );
        })}
      </div>
    </EditorSection>
  );
}
