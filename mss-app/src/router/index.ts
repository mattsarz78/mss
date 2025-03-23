import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { getConferenceCasingBySlug } from '@/utils';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, _from, next) => {
  const { title } = to.meta;
  if (title) {
    document.title = title as string;
  }

  switch (title) {
    case 'Contents':
      const sport = to.params.sport as string;
      const capitalized = `${sport.charAt(0).toUpperCase()}${sport.slice(1)}`;
      const titleYear =
        sport === 'football'
          ? to.params.year
          : `${(to.params.year as string).substring(0, 4)}-${(to.params.year as string).substring(5, 7)}`;
      document.title = `${titleYear} ${capitalized} Season`;
      break;
    case 'TV Windows':
      document.title = `Football TV Windows for ${to.params.year}`;
      break;
    case 'Contract':
      document.title = `${to.params.year} ${getConferenceCasingBySlug(to.params.conference as string)?.cased} Controlled Games`;
      break;
  }
  next();
});

export default router;
