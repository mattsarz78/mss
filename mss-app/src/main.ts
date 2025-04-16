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
  init: [
    { title: "Matt's College Sports on TV", meta: [{ name: 'twitter:title', content: "Matt's College Sports on TV" }] }
  ]
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
