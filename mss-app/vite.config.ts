import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// import vueDevTools from 'vite-plugin-vue-devtools';
// import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // eslint-disable-next-line prettier/prettier
    plugins: [vue(), vueJsx(), viteCompression({ 
      algorithm: 'brotliCompress' ,
      filter: /\.(js|mjs|json|css|html|png|jpg|jpeg|gif|svg)$/i })
    ],
    // plugins: [vue(), vueJsx(), vueDevTools(), visualizer({ open: true }), viteCompression()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: {
      minify: 'esbuild',
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'; // Create a separate vendor chunk for node_modules
            }
          }
        }
      }
    },
    define: {
      'process.env': env // Define environment variables
    }
  };
});
