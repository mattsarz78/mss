import vue from '@vitejs/plugin-vue';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PluginOption, Rollup, UserConfig, UserConfigExport } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const _dirname = dirname(fileURLToPath(import.meta.url));

const alias = {
  '@': resolve(_dirname, './src'),
  '#composables': resolve(_dirname, './src/composables'),
  '@views': resolve(_dirname, './src/views'),
  '@utils': resolve(_dirname, './src/utils'),
  '@data': resolve(_dirname, './src/staticData'),
  '@conference': resolve(_dirname, './src/components/conference'),
  '@noTv': resolve(_dirname, './src/components/noTVGames'),
  '@season': resolve(_dirname, './src/components/season'),
  '@shared': resolve(_dirname, './src/components/shared'),
  '@weekly': resolve(_dirname, './src/components/weekly'),
  '@text': resolve(_dirname, './src/components/weeklyText')
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  const buildId = new Date().getTime().toString();

  const config: UserConfigExport = {
    optimizeDeps: {
      include: ['vue', 'luxon', '@apollo/client/core'],
      exclude: ['@vueuse/core'],
      esbuildOptions: { target: 'esnext', supported: { 'top-level-await': true } }
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none',
      treeShaking: true,
      minifyIdentifiers: true,
      minifySyntax: true
    },
    server: {
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'] // Also ignore build output
      },
      hmr: {
        overlay: true,
        timeout: 30000 // Increase timeout for slower connections
      },
      host: true, // Listen on all addresses
      strictPort: true, // Fail if port is already in use
      open: false // Don't open browser automatically
    },
    css: { devSourcemap: true },
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.gif'],
    base: '/',
    publicDir: 'public',
    plugins: [
      vue({ isProduction: true, features: { optionsAPI: false } }),
      VitePWA({
        injectRegister: 'script-defer',
        registerType: 'autoUpdate',
        minify: true,
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
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
          // defining cached files formats
          globPatterns: ['**/*.{js,mjs,css,html,txt,xml,ico,png,svg,json,vue,woff2,webmanifest}'],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true
        }
      })
    ],
    resolve: { alias },
    build: {
      cssMinify: 'lightningcss',
      minify: 'terser',
      target: 'esnext',
      terserOptions: { compress: { drop_console: true, drop_debugger: true } },
      dynamicImportVarsOptions: { warnOnError: true, exclude: [] },
      rollupOptions: {
        external: ['workbox-window'],
        output: {
          manualChunks: (id) => {
            return chunkGroup(id);
          },
          inlineDynamicImports: false,
          entryFileNames: `assets/[name].[hash].${buildId}.mjs`,
          chunkFileNames: `assets/[name].[hash].${buildId}.mjs`,
          assetFileNames: `assets/[name].[hash].${buildId}.[ext]`
        }
      },
      manifest: true, // Generate manifest.json for asset mapping
      sourcemap: mode === 'development',
      reportCompressedSize: mode === 'production'
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

const chunkGroup = (id: string): string | Rollup.NullValue => {
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
};

const getVendorChunk = (id: string): string => {
  if (id.includes('luxon') || id.includes('@vueuse/core')) return 'vendor-utils';
  if (id.includes('vue') || id.includes('vue-router')) return 'vendor-vue';
  if (id.includes('@apollo/client') || id.includes('@vue/apollo-composable')) return 'vendor-apollo';
  return 'vendor-other';
};

const getCoreChunk = (id: string): string => {
  if (id.includes('/utils/game') || id.includes('/utils/ppvColumn')) {
    return 'core-game-utils';
  }
  if (id.includes('/composables/use')) {
    return 'core-composables';
  }
  return 'core-common';
};

const getFeatureChunk = (id: string): string => {
  if (id.includes('/components/weekly/')) return 'feature-weekly';
  if (id.includes('/components/conference/')) return 'feature-conference';
  if (id.includes('/components/noTVGames/')) return 'feature-no-tv';
  if (id.includes('/components/shared/')) return 'feature-shared';
  if (id.includes('/components/season/')) return 'feature-season';
  if (id.includes('/components/weeklyText/')) return 'feature-weekly-text';
  return 'feature-other';
};

const getRouteChunk = (id: string): string => {
  const route = /\/views\/(\w+)View/.exec(id)?.[1]?.toLowerCase();
  if (route) return `route-${route}`;
  return 'route-other';
};

const loadVueDevTools = async () => {
  const vueDevTools = await import('vite-plugin-vue-devtools');
  return vueDevTools.default();
};

const loadVisualizer = async () => {
  const { visualizer } = await import('rollup-plugin-visualizer');
  return visualizer({ open: true }) as PluginOption;
};
