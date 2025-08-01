import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('#views/HomeView.vue');
const Copyright = () => import('#views/CopyrightView.vue');
const Archive = () => import('#views/ArchiveView.vue');
const Season = () => import('#views/SeasonView.vue');
const ConferenceGameList = () => import('#views/ConferenceGamesView.vue');
const TvWindowsView = () => import('#views/TvWindowsView.vue');
const WeeklyScheduleView = () => import('#views/WeeklyScheduleView.vue');
const WeeklyTextScheduleView = () => import('#views/WeeklyTextScheduleView.vue');
const DailyScheduleView = () => import('#views/DailyScheduleView.vue');
const DailyTextScheduleView = () => import('#views/DailyTextScheduleView.vue');

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/copyright', component: Copyright },
  { path: '/archive', component: Archive },
  { path: '/season/contents/:year/', redirect: { name: 'home' } }, // Redirect to home due to old URL structure
  { path: '/season/:sport/:year', component: Season },
  { path: '/contract/:conference/:year', component: ConferenceGameList },
  { path: '/tv-windows/:year', component: TvWindowsView },
  { path: '/schedule/daily/:year', redirect: { name: 'home' } }, // Redirect to home due to old URL structure
  { path: '/schedule/dailytext/:year', redirect: { name: 'home' } }, // Redirect to home due to old URL structure
  { path: '/schedule/weekly/:year/:week', redirect: { name: 'home' } }, // Redirect to home due to old URL structure
  { path: '/schedule/weeklytext/:year/:week', redirect: { name: 'home' } }, // Redirect to home due to old URL structure
  {
    path: '/schedule/:sport/:year/:week',
    name: 'Weekly',
    props: (route) => ({ sport: route.params.sport, year: route.params.year, week: route.params.week }),
    component: WeeklyScheduleView
  },
  {
    path: '/schedule/:sport/:year/:week/text',
    name: 'Weekly Text',
    props: (route) => ({ sport: route.params.sport, year: route.params.year, week: route.params.week }),
    component: WeeklyTextScheduleView
  },
  { path: '/schedule/:sport/daily', component: DailyScheduleView },
  { path: '/schedule/:sport/daily/text', component: DailyTextScheduleView },
  // Catch-all route for 404s - must be last
  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
];

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
export default router;
