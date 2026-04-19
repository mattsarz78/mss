import App from '#/App.vue';
import router from '#/router/index.mjs';
import { updateSpeculationForRoute } from '#/utils/speculationRules.mts';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { registerSW } from 'virtual:pwa-register';
import { createApp, h, provide } from 'vue';
import * as VuePurify from 'vue-dompurify-html';

const httpLink = new HttpLink({
  uri: import.meta.env.API_URL ?? 'http://localhost:8020/graphql' // Fallback to localhost if API_URL is not set
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    query: { fetchPolicy: 'cache-first', errorPolicy: 'all' },
    watchQuery: { fetchPolicy: 'cache-and-network', errorPolicy: 'all' }
  }
});

if (!import.meta.env.PROD) {
  // Dynamically import dev tools module - completely tree-shaken from production
  const { initializeApolloDevTools } = await import('#/devtools.mts');
  await initializeApolloDevTools(apolloClient);
}

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      void updateSW();
    }
  }
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App)
});

app.directive('reset-adsense-height', {
  created: (el: HTMLElement) => {
    const observer = new MutationObserver(() => {
      el.style.height = '';
      el.style.minHeight = '';
    });
    observer.observe(el, { attributes: true, attributeFilter: ['style'] });
  }
});

app.use(VuePurify.vueDompurifyHTMLPlugin, { default: { ADD_ATTR: ['target'] } });

// Set initial page title
document.title = "Matt's College Sports on TV";

app.use(router);

router.afterEach((to) => {
  updateSpeculationForRoute(to);
});

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
