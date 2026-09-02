import { usePreviewStore as usePrdStore } from '../../store/usePreviewStore';

export default function DocFooter() {
  const f = usePrdStore(function (s) { return s.fields; });
  if (f.coverShowFooter === false) return null;
  const title = (f.projectName || 'PROYEK TANPA NAMA').toUpperCase();
  const docLabel = 'Product Requirement Document';
  const note = (f.coverFooterNote || '').trim() || 'Dokumen ini menjadi rujukan utama bagi tim development dan QA selama fase implementasi.';
  return (
    <div className="doc-footer keep-together mt-8 pt-4 border-t-2 text-center space-y-1" style={{ borderColor: 'var(--doc-primary, #2563eb)' }}>
      <p className="text-[11px] text-slate-600">
        <strong className="text-slate-900">{title}</strong>
        <span>{' \u00B7 '}{docLabel}{' \u00B7 Versi '}{f.docVersion || '1.0'}</span>
      </p>
      <p className="text-[11px] text-slate-500">{note}</p>
    </div>
  );
}
