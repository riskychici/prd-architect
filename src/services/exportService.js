import { saveAs } from 'file-saver';
import copyToClipboard from 'copy-to-clipboard';
import { generateMarkdown } from '../utils/markdown';

export const exportService = {
  exportJSON: function (state) {
    const data = { app: 'PRD Architect Pro', version: '3.1', mode: state.mode, state: state };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, (state.fields.projectName || 'PRD') + '.json');
  },
  copyMarkdown: function (state) {
    copyToClipboard(generateMarkdown(state));
  },
  printDocument: function () { window.print(); },
};
