import { useHead } from '@unhead/vue';

export const addMetaTags = (title: string) => {
  useHead({
    title,
    meta: [
      { name: 'twitter:title', content: title },
      { name: 'twitter:text:title', content: title },
      { name: 'og:title', content: title },
      { name: 'og:url', content: window.location.href }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: title,
          url: window.location.href
        })
      }
    ]
  });
};
