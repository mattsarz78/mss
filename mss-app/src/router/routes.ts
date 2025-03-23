import type { RouteRecordRaw } from 'vue-router';
const Home = () => import('../views/HomeView.vue');
const Copyright = () => import('../views/CopyrightView.vue');
const Archive = () => import('../views/ArchiveView.vue');
const Season = () => import('../views/SeasonView.vue');
const ConferenceGameList = () => import('../views/ConferenceGames.vue');
const TvWindowsView = () => import('../views/TvWindowsView.vue');
const WeeklyScheduleView = () => import('../views/WeeklyScheduleView.vue');
const WeeklyTextScheduleView = () => import('../views/WeeklyTextScheduleView.vue');
const DailyScheduleView = () => import('../views/DailyScheduleView.vue');
const DailyTextScheduleView = () => import('../views/DailyTextScheduleView.vue');

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    meta: { title: "Matt's College Sports on TV" },
    component: Home
  },
  {
    path: '/copyright',
    meta: { title: 'Copyright and Disclaimer' },
    component: Copyright
  },
  {
    path: '/archive',
    meta: { title: 'Archive Listings' },
    component: Archive
  },
  {
    path: '/season/:sport/:year',
    meta: { title: 'Contents' },
    component: Season
  },
  {
    path: '/contract/:conference/:year',
    meta: { title: 'Contract' },
    component: ConferenceGameList
  },
  {
    path: '/tv-windows/:year',
    meta: { title: 'TV Windows' },
    component: TvWindowsView
  },
  {
    path: '/schedule/:sport/:year/:week',
    meta: { title: 'Weekly' },
    name: 'Weekly',
    props: (route) => ({
      sport: route.params.sport,
      year: route.params.year,
      week: route.params.week
    }),
    component: WeeklyScheduleView
  },
  {
    path: '/schedule/:sport/:year/:week/text',
    meta: { title: 'Weekly Text' },
    name: 'Weekly Text',
    props: (route) => ({
      sport: route.params.sport,
      year: route.params.year,
      week: route.params.week
    }),
    component: WeeklyTextScheduleView
  },
  {
    path: '/schedule/:sport/daily',
    meta: { title: 'Daily' },
    component: DailyScheduleView
  },
  {
    path: '/schedule/:sport/daily/text',
    meta: { title: 'Daily Text' },
    component: DailyTextScheduleView
  }
];
