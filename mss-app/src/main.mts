import App from '#/App.vue';
import router from '#/router/index.mjs';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
import { createHead } from '@unhead/vue/client';
import { InferSeoMetaPlugin } from '@unhead/vue/plugins';
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
  try {
    const { connectApolloClientToVSCodeDevTools } = await import('@apollo/client-devtools-vscode');
    if (typeof connectApolloClientToVSCodeDevTools === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      connectApolloClientToVSCodeDevTools(apolloClient as any, 'ws://localhost:7095');
    }
  } catch (err) {
    // Swallow devtools import errors.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = err && (err as any).message ? (err as any).message : String(err);
    console.debug('Apollo VSCode devtools not loaded:', msg);
  }
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

const head = createHead({ init: [{ title: "Matt's College Sports on TV" }], plugins: [InferSeoMetaPlugin()] });
app.use(head);
app.use(VuePurify.vueDompurifyHTMLPlugin, { default: { ADD_ATTR: ['target'] } });

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
