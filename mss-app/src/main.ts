import { createApp, provide, h } from 'vue';
import App from './App.vue';
import router from './router';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClient } from './apolloClient'; // Import Apollo Client setup
import { createHead } from '@unhead/vue/client';

// Create the Vue app
const app = createApp({
  setup() {
    // Provide the Apollo Client to the app
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App)
});

const head = createHead({
  hooks: {
    'tags:beforeResolve': (ctx) => {
      ctx.tags.push(
        { tag: 'meta', props: { name: 'twitter:title', content: "Matt's College Sports on TV" } },
        { tag: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', props: { name: 'twitter:site', content: '@mattsarz' } },
        { tag: 'meta', props: { name: 'twitter:creator', content: '@mattsarz' } },
        {
          tag: 'meta',
          props: {
            name: 'twitter:description',
            content: "Since 2005, college football and men's college basketball television & webcast schedules."
          }
        },
        { tag: 'meta', props: { name: 'twitter:image', content: 'https://www.mattsarzsports.com/images/logo.jpg' } },
        { tag: 'meta', props: { name: 'og:type', content: 'website' } },
        {
          tag: 'meta',
          props: {
            name: 'og:description',
            content: "Since 2005, college football and men's college basketball television & webcast schedules."
          }
        },
        { tag: 'meta', props: { name: 'og:site_name', content: "Matt's College Sports on TV" } },
        { tag: 'meta', props: { name: 'og:locale', content: 'en_US' } },
        { tag: 'meta', props: { name: 'og:image', content: 'https://www.mattsarzsports.com/images/logo.jpg' } }
      );
    }
  }
});
app.use(head);

// Use the router and mount the app
app.use(router);

router
  .isReady()
  .then(() => {
    app.mount('#app');
  })
  .catch((error: unknown) => {
    console.error(
      'Error during router readiness. Ensure all routes are properly configured:',
      (error as Error).message
    );
  });
