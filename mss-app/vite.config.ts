import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { VitePWA } from 'vite-plugin-pwa';
// import vueDevTools from 'vite-plugin-vue-devtools';
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
      vueJsx(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'MSS App',
          short_name: 'MSS',
          theme_color: '#ffffff',
          icons: [
            { src: '/192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/512x512.png', sizes: '512x512', type: 'image/png' }
          ]
        }
      })
    ],
    // plugins: [vue(), vueJsx(), vueDevTools(), visualizer({ open: true })],
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
    define: { 'import.meta.env.API_URL': JSON.stringify(env.API_URL) }
  };
});
