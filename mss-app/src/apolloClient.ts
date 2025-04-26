import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { connectApolloClientToVSCodeDevTools } from '@apollo/client-devtools-vscode';

const httpLink = createHttpLink({
  uri: import.meta.env.API_URL ?? 'http://localhost:8020/graphql' // Fallback to localhost if API_URL is not set
});

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({ link: httpLink, cache });

if (!import.meta.env.PROD) {
  connectApolloClientToVSCodeDevTools(apolloClient, 'ws://localhost:7095');
}
