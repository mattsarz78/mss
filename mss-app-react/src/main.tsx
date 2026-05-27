import App from '#/App';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

const httpLink = new HttpLink({
  uri: import.meta.env.API_URL ?? 'http://localhost:8020/graphql' // Fallback to localhost if API_URL is not set
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    query: { fetchPolicy: 'cache-first' },
    watchQuery: { fetchPolicy: 'cache-and-network' }
  }
});

if (!import.meta.env.PROD) {
  // Dynamically import dev tools module - completely tree-shaken from production
  const { initializeApolloDevTools } = await import('#/devtools');
  await initializeApolloDevTools(apolloClient);
}

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      void updateSW();
    }
  }
});

// Create a context for Apollo Client
export const ApolloContext = React.createContext(apolloClient);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloContext.Provider value={apolloClient}>
      <App />
    </ApolloContext.Provider>
  </React.StrictMode>
);
