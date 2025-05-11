import { createApp, provide, h } from 'vue';
import App from './App.vue';
import router from './router';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClient } from './apolloClient';
import { createHead } from '@unhead/vue/client';
import { InferSeoMetaPlugin } from '@unhead/vue/plugins';
import { registerSW } from 'virtual:pwa-register';
import VueDOMPurifyHTML from 'vue-dompurify-html';

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
app.use(VueDOMPurifyHTML);

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
