import type { RouteRecordRaw } from 'vue-router';

// Dynamic imports for views
const Home = () => import('@/views/HomeView.vue');
const Copyright = () => import('@/views/CopyrightView.vue');
const Archive = () => import('@/views/ArchiveView.vue');
const Season = () => import('@/views/SeasonView.vue');
const ConferenceGameList = () => import('@/views/ConferenceGames.vue');
const TvWindowsView = () => import('@/views/TvWindowsView.vue');
const WeeklyScheduleView = () => import('@/views/WeeklyScheduleView.vue');
const WeeklyTextScheduleView = () => import('@/views/WeeklyTextScheduleView.vue');
const DailyScheduleView = () => import('@/views/DailyScheduleView.vue');
const DailyTextScheduleView = () => import('@/views/DailyTextScheduleView.vue');

// Base meta tags
const twitterMetaTags = [
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:site', content: '@mattsarz' },
  { name: 'twitter:title', content: "Matt's College Sports on TV" },
  {
    name: 'twitter:description',
    content: "Since 2005, college football and men's college basketball television & webcast schedules."
  },
  { name: 'twitter:image', content: 'https://mattsarzsports.com/images/tvnets.jpg' }
];

const baseOpenGraphMetaTags = [
  { property: 'og:type', content: 'website' },
  { property: 'og:title', content: '' },
  { property: 'og:site_name', content: "Matt's College Sports on TV" },
  { property: 'og:locale', content: 'en_US' },
  {
    property: 'og:description',
    content: "Since 2005, college football and men's college basketball television & webcast schedules."
  },
  { property: 'og:image', content: 'https://mattsarzsports.com/images/tvnets.jpg' },
  { property: 'og:url', content: 'https://mattsarzsports.com' }
];

// Utility function to generate meta tags
const generateMetaTags = (title: string) => [
  ...twitterMetaTags,
  ...baseOpenGraphMetaTags.map((tag) => (tag.property === 'og:title' ? { ...tag, content: title } : tag))
];

// Routes definition
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    meta: { title: "Matt's College Sports on TV", metaTags: generateMetaTags("Matt's College Sports on TV") },
    component: Home
  },
  {
    path: '/copyright',
    meta: { title: 'Copyright and Disclaimer', metaTags: generateMetaTags('Copyright and Disclaimer') },
    component: Copyright
  },
  {
    path: '/archive',
    meta: { title: 'Archive Listings', metaTags: generateMetaTags('Archive Listings') },
    component: Archive
  },
  {
    path: '/season/:sport/:year',
    meta: { title: 'Contents', metaTags: generateMetaTags('Contents') },
    component: Season
  },
  {
    path: '/contract/:conference/:year',
    meta: { title: 'Contract', metaTags: generateMetaTags('Contract') },
    component: ConferenceGameList
  },
  {
    path: '/tv-windows/:year',
    meta: { title: 'TV Windows', metaTags: generateMetaTags('TV Windows') },
    component: TvWindowsView
  },
  {
    path: '/schedule/:sport/:year/:week',
    name: 'Weekly',
    meta: { title: 'Weekly', metaTags: generateMetaTags('Weekly') },
    props: (route) => ({ sport: route.params.sport, year: route.params.year, week: route.params.week }),
    component: WeeklyScheduleView
  },
  {
    path: '/schedule/:sport/:year/:week/text',
    name: 'Weekly Text',
    meta: { title: 'Weekly Text', metaTags: generateMetaTags('Weekly Text') },
    props: (route) => ({ sport: route.params.sport, year: route.params.year, week: route.params.week }),
    component: WeeklyTextScheduleView
  },
  {
    path: '/schedule/:sport/daily',
    meta: { title: 'Daily', metaTags: generateMetaTags('Daily') },
    component: DailyScheduleView
  },
  {
    path: '/schedule/:sport/daily/text',
    meta: { title: 'Daily Text', metaTags: generateMetaTags('Daily Text') },
    component: DailyTextScheduleView
  }
];
