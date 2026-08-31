import { usePreviewStore as usePrdStore } from '../../store/usePreviewStore';
import { resolveCoverTheme } from '../../utils/helpers';

export default function DocFooter() {
  const f = usePrdStore(function (s) { return s.fields; });
  const palette = usePrdStore(function (s) { return s.palette; });
  if (f.coverShowFooter === false) return null;
  const theme = resolveCoverTheme(f, palette);
  const title = (f.projectName || 'PROYEK TANPA NAMA').toUpperCase();
  const docLabel = 'Product Requirement Document';
  const note = (f.coverFooterNote || '').trim() || 'Dokumen ini menjadi rujukan utama bagi tim development dan QA selama fase implementasi.';
  return (
    <div className="doc-footer keep-together mt-8 pt-4 border-t-2 text-center space-y-1" style={{ borderColor: theme.primary }}>
      <p className="text-[11px] text-slate-600">
        <strong className="text-slate-900">{title}</strong>
        <span>{' · '}{docLabel}{' · Versi '}{f.docVersion || '1.0'}</span>
      </p>
      <p className="text-[11px] text-slate-500">{note}</p>
    </div>
  );
}