import { createRouter, createWebHistory } from 'vue-router';
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
import { getConferenceCasingBySlug } from '@/utils';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
  ]
});

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title as string;
  if ((to.meta.title as string) === 'Contents') {
    const capitalized = `${(to.params.sport as string).charAt(0).toUpperCase()}${(to.params.sport as string).slice(1)}`;
    const titleYear =
      to.params.sport === 'football'
        ? to.params.year
        : `${(to.params.year as string).substring(0, 4)}-${(to.params.year as string).substring(5, 7)}`;
    document.title = `${titleYear} ${capitalized} Season`;
  }

  if ((to.meta.title as string) === 'TV Windows') {
    document.title = `Football TV Windows for ${to.params.year}`;
  }

  if ((to.meta.title as string) === 'Contract') {
    document.title = `${to.params.year} ${getConferenceCasingBySlug(to.params.conference as string)?.cased} Controlled Games`;
  }
  next();
});

export default router;
