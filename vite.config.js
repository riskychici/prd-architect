import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: function (id) {
          // Pisahkan dependensi dari node_modules ke chunk yang berbeda
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('@fortawesome')) {
              return 'icons';
            }
            if (id.includes('lodash') || id.includes('zustand')) {
              return 'utils';
            }
            if (id.includes('file-saver') || id.includes('copy-to-clipboard')) {
              return 'services';
            }
            // Fallback untuk node_modules lainnya
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
});