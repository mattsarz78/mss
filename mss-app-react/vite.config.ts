import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { UserConfig, UserConfigExport } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { versionJson } from './plugins/writeVersion.mjs';

const _dirname = dirname(fileURLToPath(import.meta.url));

const getGitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
};

const alias = {
  '#': resolve(_dirname, './src'),
  '#hooks': resolve(_dirname, './src/hooks'),
  '#views': resolve(_dirname, './src/views'),
  '#utils': resolve(_dirname, './src/utils'),
  '#data': resolve(_dirname, './src/staticData'),
  '#conference': resolve(_dirname, './src/components/conference'),
  '#noTv': resolve(_dirname, './src/components/noTVGames'),
  '#season': resolve(_dirname, './src/components/season'),
  '#shared': resolve(_dirname, './src/components/shared'),
  '#weekly': resolve(_dirname, './src/components/weekly'),
  '#text': resolve(_dirname, './src/components/weeklyText')
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '');

  const config: UserConfigExport = {
    optimizeDeps: { include: ['react', 'react-dom', 'luxon', '@apollo/client/core'] },
    server: {
      watch: { usePolling: false, ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'] },
      hmr: { overlay: true, timeout: 30000 },
      host: true,
      strictPort: true,
      open: false
    },
    css: { devSourcemap: true },
    assetsInclude: ['**/*.png', 'version.json', '**/*.webp'],
    base: '/',
    publicDir: 'public',
    resolve: { alias },
    plugins: [
      versionJson(),
      react(),
      VitePWA({
        injectRegister: 'script-defer',
        registerType: 'autoUpdate',
        strategies: 'generateSW',
        minify: true,
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'robots.txt', 'version.json'],
        manifest: {
          description:
            "MattSarzSports App - Your go-to source for all things college football and men's basketball on TV.",
          name: 'MattSarzSports App',
          short_name: 'MattSarzSports',
          theme_color: '#ffffff',
          icons: [
            { src: 'favicon.ico', sizes: '48x48', type: 'image/x-icon', purpose: 'any' },
            { src: '192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: '512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            { src: 'apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'maskable' }
          ],
          screenshots: [
            { src: 'mss-wide.png', type: 'image/png', sizes: '3198x1138', form_factor: 'wide', label: 'Application' },
            { src: 'mss-mobile.png', type: 'image/png', sizes: '966x1114', form_factor: 'narrow', label: 'Application' }
          ],
          start_url: '/'
        },
        workbox: {
          globPatterns: ['**/*.{js,mjs,css,html,txt,xml,ico,png,svg,json,tsx,woff2,webmanifest}'],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          runtimeCaching: [
            {
              urlPattern: /\/graphql/,
              handler: 'NetworkFirst',
              options: { cacheName: 'graphql-api', expiration: { maxEntries: 50, maxAgeSeconds: 60 } }
            }
          ]
        }
      })
    ],
    build: {
      sourcemap: env.SOURCEMAP === 'true' ? true : false,
      target: 'esnext',
      minify: 'esbuild',
      chunkSizeWarningLimit: 800, // 👈 Safely raise limits to match typical application scales
      rollupOptions: {
        external: ['workbox-window'],
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@apollo') || id.includes('graphql')) {
                return 'vendor-graphql'; // Isolates data pipeline dependencies
              }
              if (id.includes('luxon')) {
                return 'vendor-luxon'; // Separates weightier calendar parsing utilities
              }
              if (id.includes('react')) {
                return 'vendor-react-core'; // Keeps core UI rendering engines lean
              }
              return 'vendor-misc'; // Catch-all bucket for smaller system tools
            }
          }
        }
      }
    },
    define: {
      'import.meta.env.API_URL': JSON.stringify(env.API_URL),
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(getGitHash() ?? Date.now().toString())
    }
  };

  return config;
});
