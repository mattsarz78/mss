import { createHead } from '@unhead/vue/client';
import { InferSeoMetaPlugin } from '@unhead/vue/plugins';
import { registerSW } from 'virtual:pwa-register';
import { createApp, h, provide } from 'vue';
import * as VuePurify from 'vue-dompurify-html';
import { apolloClient } from '#/apolloClient.mjs';
import App from '#/App.vue';
import router from '#/router/index.mjs';
import { ApolloClient } from '@apollo/client/core';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      void updateSW();
    }
  }
});

const app = createApp({
  setup() {
    provide(ApolloClient, apolloClient);
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
