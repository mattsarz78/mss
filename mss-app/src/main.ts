import { createApp, provide, h } from 'vue';
import App from './App.vue';
import router from './router';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClient } from './apolloClient'; // Import Apollo Client setup
import { createHead } from '@unhead/vue/client';
import { InferSeoMetaPlugin } from '@unhead/vue/plugins';

// Create the Vue app
const app = createApp({
  setup() {
    // Provide the Apollo Client to the app
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App)
});

const head = createHead({ init: [{ title: "Matt's College Sports on TV" }], plugins: [InferSeoMetaPlugin()] });
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
