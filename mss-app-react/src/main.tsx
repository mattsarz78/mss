import App from '#/App.tsx';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

const httpLink = new HttpLink({
  uri: import.meta.env.API_URL ?? 'http://localhost:8020/graphql' 
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
  const { initializeApolloDevTools } = await import('#/devtools.mjs');
  await initializeApolloDevTools(apolloClient);
}

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      void updateSW();
    }
  }
});

// 2. REMOVED: export const ApolloContext = React.createContext(apolloClient);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. Changed from <ApolloContext.Provider value={...}> to <ApolloProvider client={...}> */}
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);