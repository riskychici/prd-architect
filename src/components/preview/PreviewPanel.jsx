import PreviewActions from './PreviewActions';
import PreviewDocument from './PreviewDocument';
export default function PreviewPanel() {
  return (
    <section id="previewPanel" className="bg-slate-950 p-6 overflow-y-auto" style={{ height: '100%' }}>
      <PreviewActions /><PreviewDocument />
    </section>
  );
}
