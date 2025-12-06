import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';

const httpLink = new HttpLink({
  uri: import.meta.env.API_URL ?? 'http://localhost:8020/graphql' // Fallback to localhost if API_URL is not set
});

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    query: { fetchPolicy: 'cache-first', errorPolicy: 'all' },
    watchQuery: { fetchPolicy: 'cache-and-network', errorPolicy: 'all' }
  }
});

if (!import.meta.env.PROD) {
  try {
    // The VS Code devtools package can pull in node-specific internals
    // or paths that may not resolve in a browser environment. Wrap in
    // try/catch so a missing module won't crash the app in dev.
    const { connectApolloClientToVSCodeDevTools } = await import('@apollo/client-devtools-vscode');
    if (typeof connectApolloClientToVSCodeDevTools === 'function') {
      connectApolloClientToVSCodeDevTools(apolloClient, 'ws://localhost:7095');
    }
  } catch (err) {
    // Swallow devtools import errors. This is non-fatal and expected
    // in some environments (for example when certain exports are not
    // available to the browser bundler).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = err && (err as any).message ? (err as any).message : String(err);
    console.debug('Apollo VSCode devtools not loaded:', msg);
  }
}
