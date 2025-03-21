import { createApp, provide, h } from 'vue';
import App from './App.vue';
import router from './router';
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: process.env.API_URL
});

const consoleLink = new ApolloLink((operation, forward) => {
  if (process.env.NODE_ENV === 'development') {
    loadDevMessages();
    loadErrorMessages();
    return forward(operation).map((data) => {
      console.groupCollapsed(`Operation: ${operation.operationName}`);
      console.dir(operation);
      console.groupEnd();
      return data;
    });
  } else {
    return forward(operation).map((data) => data);
  }
});

// Cache implementation
const cache = new InMemoryCache();

const link = ApolloLink.from([consoleLink, httpLink]);

// Create the apollo client
const apolloClient = new ApolloClient({
  link,
  cache
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App)
});

app.use(router);
router.isReady().then(() => {
  app.mount('#app');
});
