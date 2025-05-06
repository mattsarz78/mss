import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
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
          manualChunks: chunks
      }
    }},
    define: { 'import.meta.env.API_URL': JSON.stringify(env.API_URL) }
  }
});

const chunks: Record<string,string[]> = {
  'ads-group': [
    './src/components/shared/CopyrightLink.vue',
    './src/components/shared/AdsByGoogle.vue',
    './src/components/shared/AdsByGoogleScript.vue',
    './src/components/shared/GoogleSearchBar.vue'
  ],
  'group-home': ['./src/views/HomeView.vue', './src/components/TwitterRetrieval.vue'],
  'group-season': [
    './src/views/SeasonView.vue',
    './src/components/SeasonDates.vue',
    './src/components/ConferenceList.vue',
    './src/components/WeekLink.vue'
  ],
  'group-conference-games': [
    './src/views/ConferenceGames.vue',
    './src/components/conference/ConferenceGameList.vue',
    './src/components/conference/ConferenceTable.vue',
    './src/components/IndependentsGameList.vue'
  ],
  'group-weekly-base': [
    './src/components/WeeklyBase.vue',
    './src/components/weekly/WeekGamesTable.vue',
    './src/components/weekly/PostseasonMbkEvent.vue',
    './src/components/weekly/WeekGameRow.vue'
  ],
  'group-weekly-text': ['./src/views/WeeklyTextScheduleView.vue', './src/components/WeekTextSchedule.vue'],
  'group-weekly-text-base': ['./src/components/WeekTextBase.vue', './src/components/WeekTextTable.vue'],
  'group-back-to-top': [
    './src/components/shared/BackToTop.vue',
    './src/components/shared/BackToTopButton.vue',
    './src/components/shared/BackToTopScript.vue'
  ],
  'group-week-schedule-view': [
    './src/views/WeeklyScheduleView.vue',
    './src/components/WeekSchedule.vue',
    './src/components/noTVGames/NoTvGames.vue',
    './src/components/noTVGames/NoTvGamesTable.vue'
  ]
}