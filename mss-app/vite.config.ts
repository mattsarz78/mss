import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
// import vueDevTools from 'vite-plugin-vue-devtools';
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
      viteCompression({ filter: /\.(js|mjs|json|css|html|txt|xml)$/i, algorithm: 'brotliCompress', threshold: 5 }),
      VitePWA({
        registerType: 'autoUpdate',
        minify: true,
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'MSS App',
          short_name: 'MSS',
          theme_color: '#ffffff',
          icons: [
            { src: '/192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/512x512.png', sizes: '512x512', type: 'image/png' }
          ]
        },
        workbox: {
          // defining cached files formats
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}']
        }
      })
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: {
      cssMinify: 'lightningcss',
      minify: 'terser',
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks(id, { getModuleInfo }) {
            const match = /.*\.strings\.(\w+)\.js/.exec(id);
            if (match) {
              const language = match[1]; // e.g. "en"
              const dependentEntryPoints = [];

              // we use a Set here so we handle each module at most once. This
              // prevents infinite loops in case of circular dependencies
              const idsToHandle = new Set(getModuleInfo(id)?.dynamicImporters);

              for (const moduleId of idsToHandle) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const { isEntry, dynamicImporters, importers } = getModuleInfo(moduleId)!;
                if (isEntry || dynamicImporters.length > 0) dependentEntryPoints.push(moduleId);

                // The Set iterator is intelligent enough to iterate over
                // elements that are added during iteration
                for (const importerId of importers) idsToHandle.add(importerId);
              }

              // If there is a unique entry, we put it into a chunk based on the
              // entry name
              if (dependentEntryPoints.length === 1) {
                return `${dependentEntryPoints[0].split('/').slice(-1)[0].split('.')[0]}.strings.${language}`;
              }
              // For multiple entries, we put it into a "shared" chunk
              if (dependentEntryPoints.length > 1) {
                return `shared.strings.${language}`;
              }
            }
          }
        }
      }
    },
    define: { 'import.meta.env.API_URL': JSON.stringify(env.API_URL) }
  };
});
