import PreviewActions from './PreviewActions';
import PreviewDocument from './PreviewDocument';

export default function PreviewPanel() {
  return (
    <section id="previewPanel" className="bg-base p-6 overflow-y-auto overflow-x-hidden" style={{ height: '100%' }}>
      <PreviewActions />
      <PreviewDocument />
    </section>
  );
}
