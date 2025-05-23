import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, PluginOption, UserConfigExport, Rollup } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  const config: UserConfigExport = {
    optimizeDeps: { include: ['vue', 'luxon'], exclude: ['@vueuse/core'] },
    esbuild: { drop: mode === 'production' ? ['console', 'debugger'] : [], legalComments: 'none' },
    plugins: [
      vue({ isProduction: true, features: { optionsAPI: false } }),
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
          globPatterns: ['**/*.{js,css,html,txt,xml,ico,png,svg,webmanifest}']
        }
      })
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: {
      cssMinify: 'lightningcss',
      minify: 'terser',
      target: 'esnext',
      dynamicImportVarsOptions: { warnOnError: true, exclude: [] },
      rollupOptions: {
        external: ['workbox-window'],
        output: {
          manualChunks: (id) => {
            return chunkGroup(id);
          }
        }
      }
    },
    define: { 'import.meta.env.API_URL': JSON.stringify(env.API_URL) }
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('Add local dependencies');
    config.plugins?.push(loadVisualizer());
    config.plugins?.push(loadVueDevTools());
  }
  return config;
});

function chunkGroup(id: string): string | Rollup.NullValue {
  // Vendor dependencies first
  if (id.includes('node_modules')) {
    return getVendorChunk(id);
  }

  // Core utilities and composables
  if (id.includes('/utils/') || id.includes('/composables/')) {
    return getCoreChunk(id);
  }

  // Feature modules
  if (id.includes('/components/')) {
    return getFeatureChunk(id);
  }

  // Route-based chunks
  if (id.includes('/views/')) {
    return getRouteChunk(id);
  }

  // Static data
  if (id.includes('/staticData/')) {
    return 'chunk-static';
  }

  return null;
}

function getVendorChunk(id: string): string {
  if (id.includes('vue')) return 'vendor-vue';
  if (id.includes('luxon')) return 'vendor-dates';
  return 'vendor-other';
}

function getCoreChunk(id: string): string {
  if (id.includes('/utils/game') || id.includes('/utils/ppvColumn')) {
    return 'core-game-utils';
  }
  if (id.includes('/composables/use')) {
    return 'core-composables';
  }
  return 'core-common';
}

function getFeatureChunk(id: string): string {
  if (id.includes('/components/weekly/')) return 'feature-weekly';
  if (id.includes('/components/conference/')) return 'feature-conference';
  if (id.includes('/components/noTVGames/')) return 'feature-no-tv';
  if (id.includes('/components/shared/')) return 'feature-shared';
  if (id.includes('/components/season/')) return 'feature-season';
  if (id.includes('/components/weeklyText/')) return 'feature-weekly-text';
  return 'feature-other';
}

function getRouteChunk(id: string): string {
  const route = /\/views\/(\w+)View/.exec(id)?.[1]?.toLowerCase();
  if (route) return `route-${route}`;
  return 'route-other';
}

async function loadVueDevTools() {
  const vueDevTools = await import('vite-plugin-vue-devtools');
  return vueDevTools.default();
}

async function loadVisualizer() {
  const { visualizer } = await import('rollup-plugin-visualizer');
  return visualizer({ open: true }) as PluginOption;
}
