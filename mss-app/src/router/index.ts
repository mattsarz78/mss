import { createRouter, createWebHistory } from 'vue-router';
// import { createRouter, createWebHistory, type RouteLocationNormalizedGeneric } from 'vue-router';
import { routes } from './routes';
// import { getConferenceCasingBySlug } from '@/utils/conference';
// import { DateTime } from 'luxon';

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });

// router.beforeEach((to, _from, next) => {
//   const title = to.meta.title as string | undefined;
//   const metaTags = to.meta.metaTags as { name?: string; content?: string; property?: string }[] | undefined;

//   // Update document title
//   if (title) {
//     document.title = generateTitle(title, to);
//   }

//   // Update meta tags
//   if (metaTags) {
//     updateMetaTags(metaTags, to);
//   }

//   next();
// });

// Helper function to generate document title
// function generateTitle(title: string, to: RouteLocationNormalizedGeneric): string {
//   switch (title) {
//     case 'Contents':
//       return createTitle(to);
//     case 'TV Windows':
//       return `Football TV Windows for ${Array.isArray(to.params.year) ? to.params.year[0] : to.params.year}`;
//     case 'Contract':
//       const year = Array.isArray(to.params.year) ? to.params.year[0] : to.params.year;
//       return `${year} ${getConferenceCasingBySlug(to.params.conference as string)?.cased ?? 'Unknown Conference'} Controlled Games`;
//     case 'Weekly':
//     case 'Weekly Text':
//       return generateWeeklyTitle(title, to);
//     case 'Daily':
//     case 'Daily Text':
//       return `Daily TV Games for ${DateTime.now().toFormat('LLLL dd, yyyy')}`;
//     default:
//       return title;
//   }
// }

// // Helper function to create a title for "Contents"
// function createTitle(to: RouteLocationNormalizedGeneric): string {
//   const sport = to.params.sport as string;
//   const capitalized = `${sport.charAt(0).toUpperCase()}${sport.slice(1)}`;
//   const titleYear =
//     sport === 'football'
//       ? to.params.year
//       : `${(to.params.year as string).substring(0, 4)}-${(to.params.year as string).substring(5, 7)}`;
//   return `${Array.isArray(titleYear) ? titleYear[0] : titleYear} ${capitalized} Season`;
// }

// // Helper function to generate titles for "Weekly" and "Weekly Text"
// function generateWeeklyTitle(title: string, to: RouteLocationNormalizedGeneric): string {
//   const sport = Array.isArray(to.params.sport) ? to.params.sport[0] : to.params.sport;
//   const capitalizedSport = `${sport.charAt(0).toUpperCase()}${sport.slice(1)}`;
//   const week = to.params.week;
//   const year = to.params.year;
//   const resolvedYear = Array.isArray(year) ? year[0] : year;
//   const resolvedWeek = Array.isArray(week) ? week[0] : week;
//   return `${capitalizedSport} ${title.includes('Text') ? 'Weekly Text Schedule' : 'Weekly Schedule'} for ${resolvedYear} Week ${resolvedWeek}`;
// }

// // Helper function to update meta tags
// function updateMetaTags(
//   metaTags: { name?: string; content?: string; property?: string }[],
//   to: RouteLocationNormalizedGeneric
// ): void {
//   const url = `${window.location.origin}${to.fullPath}`;
//   metaTags.forEach((tag) => {
//     const content = generateMetaContent(tag, to, url);

//     // Remove existing meta tag with the same name or property
//     const existingMeta = document.querySelector(
//       `meta[name="${tag.name ?? ''}"], meta[property="${tag.property ?? ''}"]`
//     );
//     if (existingMeta) {
//       existingMeta.replaceWith(Object.assign(existingMeta, { content }));
//     }
//   });
// }

// // Helper function to generate meta tag content
// function generateMetaContent(
//   tag: { name?: string; content?: string; property?: string },
//   to: RouteLocationNormalizedGeneric,
//   url: string
// ): string | undefined {
//   if (tag.property === 'og:title' || tag.name === 'twitter:title') {
//     return generateTitle(to.meta.title as string, to);
//   }
//   if (tag.property === 'og:url') {
//     return url;
//   }
//   return tag.content;
// }

export default router;
