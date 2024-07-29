import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import Copyright from '../views/CopyrightView.vue';
import Archive from '../views/ArchiveView.vue';
import Season from '../views/SeasonView.vue';
import ConferenceGameList from '../views/ConferenceGames.vue';
import TvWindowsView from '../views/TvWindowsView.vue';
import WeeklyScheduleView from '../views/WeeklyScheduleView.vue';
import WeeklyTextScheduleView from '../views/WeeklyTextScheduleView.vue';
import DailyScheduleView from '../views/DailyScheduleView.vue';
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
    }
  ]
});

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title as string;
  if ((to.meta.title as string) === 'Contents') {
    const capitalized = `${(to.params.sport as string).charAt(0).toUpperCase()}${(to.params.sport as string).slice(1)}`;
    document.title = `${to.params.year} ${capitalized} Season`;
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
