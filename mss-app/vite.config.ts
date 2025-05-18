import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, PluginOption, UserConfigExport, Rollup } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  const config: UserConfigExport = {
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

  if (process.env.NODE_ENV === 'development') {
    console.log('Add local dependencies');
    config.plugins?.push(loadVisualizer());
    config.plugins?.push(loadVueDevTools());
  }
  return config;
});

function chunkGroup(id: string): string | Rollup.NullValue {
  if (id.includes('node_modules')) return 'vendor';

  const chunkMap: Record<string, string> = {
    'utils/domText.ts': 'group-dom-text',
    'src/components/shared/CopyrightLink.vue': 'ads-group',
    'src/components/shared/AdsByGoogle.vue': 'ads-group',
    'src/views/HomeView.vue': 'group-home',
    'src/components/TwitterRetrieval.vue': 'group-home',
    'composables/useSeasonContents.ts': 'group-season',
    'src/views/SeasonView.vue': 'group-season',
    'src/components/SeasonDates.vue': 'group-season',
    'src/components/ConferenceList.vue': 'group-season',
    'src/components/WeekLink.vue': 'group-season',
    'composables/useConferenceGames.ts': 'group-conference-games',
    'utils/conference.ts': 'group-conference-games',
    'src/views/ConferenceGames.vue': 'group-conference-games',
    'src/staticData/conference-data': 'group-conference-games',
    'src/components/conference/ConferenceGameList.vue': 'group-conference-games',
    'src/components/conference/ConferenceTable.vue': 'group-conference-games',
    'src/components/IndependentsGameList.vue': 'group-conference-games',
    'src/components/WeeklyBase.vue': 'group-weekly-base',
    'src/components/weekly/WeekGamesTable.vue': 'group-weekly-base',
    'src/components/weekly/PostseasonMbkEvent.vue': 'group-weekly-base',
    'src/components/weekly/WeekGameRow.vue': 'group-weekly-base',
    'composables/useWeekTextSchedule.ts': 'group-weekly-text',
    'src/views/WeeklyTextScheduleView.vue': 'group-weekly-text',
    'src/components/WeekTextSchedule.vue': 'group-weekly-text',
    'src/components/WeekTextBase.vue': 'group-weekly-text-base',
    'src/components/WeekTextTable.vue': 'group-weekly-text-base',
    'src/components/shared/BackToTop.vue': 'group-back-to-top',
    'src/components/shared/BackToTopButton.vue': 'group-back-to-top',
    'src/components/shared/BackToTopScript.vue': 'group-back-to-top',
    'src/views/TvWindowsView.vue': 'group-tv-windows-view',
    'src/views/ArchiveView.vue': 'group-archive-view',
    'src/views/DailyScheduleView.vue': 'group-daily-schedule-view',
    'composables/useDailyTvGames.ts': 'group-daily-schedule-view',
    'src/views/DailyTextScheduleView.vue': 'group-daily-text-schedule-view',
    'composables/useDailyTvTextGames.ts': 'group-daily-text-schedule-view',
    'src/views/CopyrightView.vue': 'group-copyright-view',
    'src/views/WeeklyScheduleView.vue': 'group-week-schedule-view',
    'src/components/WeekSchedule.vue': 'group-week-schedule-view',
    'composables/useWeekSchedule.ts': 'group-week-schedule-view',
    'composables/useNoTvSchedule.ts': 'group-week-schedule-view',
    'src/components/noTVGames/NoTvGames.vue': 'group-week-schedule-view',
    'src/components/noTVGames/NoTvGamesTable.vue': 'group-week-schedule-view'
  };

  for (const [filePath, chunkName] of Object.entries(chunkMap)) {
    if (id.includes(filePath)) {
      return chunkName;
    }
  }
}

async function loadVueDevTools() {
  const vueDevTools = await import('vite-plugin-vue-devtools');
  return vueDevTools.default();
}

async function loadVisualizer() {
  const { visualizer } = await import('rollup-plugin-visualizer');
  return visualizer({ open: true }) as PluginOption;
}
