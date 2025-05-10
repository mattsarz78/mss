import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { Rollup } from 'vite';
// import vueDevTools from 'vite-plugin-vue-devtools';
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
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
});

function chunkGroup(id: string): string | Rollup.NullValue {
  const adsGroup = [
    'src/components/shared/CopyrightLink.vue',
    'src/components/shared/AdsByGoogle.vue',
    'src/components/shared/AdsByGoogleScript.vue',
    'src/components/shared/GoogleSearchBar.vue'
  ];

  const homeGroup = ['src/views/HomeView.vue', 'src/components/TwitterRetrieval.vue'];

  const seasonGroup = [
    'src/views/SeasonView.vue',
    'src/components/SeasonDates.vue',
    'src/components/ConferenceList.vue',
    'src/components/WeekLink.vue'
  ];

  const conferenceGames = [
    'src/views/ConferenceGames.vue',
    'src/components/conference/ConferenceGameList.vue',
    'src/components/conference/ConferenceTable.vue',
    'src/components/IndependentsGameList.vue'
  ];

  const weeklyBase = [
    'src/components/WeeklyBase.vue',
    'src/components/weekly/WeekGamesTable.vue',
    'src/components/weekly/PostseasonMbkEvent.vue',
    'src/components/weekly/WeekGameRow.vue'
  ];

  const weeklyText = ['src/views/WeeklyTextScheduleView.vue', 'src/components/WeekTextSchedule.vue'];

  const weeklyTextBase = ['src/components/WeekTextBase.vue', 'src/components/WeekTextTable.vue'];

  const backToTop = [
    'src/components/shared/BackToTop.vue',
    'src/components/shared/BackToTopButton.vue',
    'src/components/shared/BackToTopScript.vue'
  ];

  const weekScheduleView = [
    'src/views/WeeklyScheduleView.vue',
    'src/components/WeekSchedule.vue',
    'src/components/noTVGames/NoTvGames.vue',
    'src/components/noTVGames/NoTvGamesTable.vue'
  ];

  if (adsGroup.some((x) => id.includes(x))) return 'ads-group';

  if (homeGroup.some((x) => id.includes(x))) return 'group-home';

  if (seasonGroup.some((x) => id.includes(x))) return 'group-season';

  if (weeklyBase.some((x) => id.includes(x))) return 'group-weekly-base';

  if (weeklyText.some((x) => id.includes(x))) return 'group-weekly-text';

  if (weeklyTextBase.some((x) => id.includes(x))) return 'group-weekly-text-base';

  if (backToTop.some((x) => id.includes(x))) return 'group-back-to-top';

  if (weekScheduleView.some((x) => id.includes(x))) return 'group-week-schedule-view';

  if (conferenceGames.some((x) => id.includes(x))) return 'group-conference-games';

  if (id.includes('node_modules')) return 'vendor';
}
