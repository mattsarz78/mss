import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { connectApolloClientToVSCodeDevTools } from '@apollo/client-devtools-vscode';

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: process.env.API_URL ?? 'http://localhost:8020/graphql' // Fallback to localhost if API_URL is not set
});

// Cache implementation
const cache = new InMemoryCache();

// Create and export the Apollo Client
export const apolloClient = new ApolloClient({ link: httpLink, cache });

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const devtoolsRegistration = connectApolloClientToVSCodeDevTools(
    apolloClient,
    // the default port of the VSCode DevTools is 7095
    'ws://localhost:7095'
  );
}
