import { useHead } from '@unhead/vue';

export const addMetaTags = (title: string) => {
  useHead({
    title,
    meta: [
      { name: 'twitter:title', content: title },
      { name: 'twitter:text:title', content: title },
      { name: 'og:title', content: title },
      { name: 'og:url', content: window.location.href }
    ]
  });
};
