import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@fortawesome/react-fontawesome': path.resolve(__dirname, 'src/icons/fontawesome-shim.jsx'),
      '@fortawesome/free-solid-svg-icons': path.resolve(__dirname, 'src/icons/solid-shim.js'),
      '@fortawesome/free-brands-svg-icons': path.resolve(__dirname, 'src/icons/brands-shim.js'),
      '@fortawesome/free-regular-svg-icons': path.resolve(__dirname, 'src/icons/solid-shim.js'),
    },
  },
  build: {
    target: 'esnext',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: function (id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('lodash') || id.includes('zustand')) return 'utils';
            if (id.includes('file-saver') || id.includes('copy-to-clipboard')) return 'services';
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
