import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: process.env.API_URL ?? 'http://localhost:8020/graphql' // Fallback to localhost if API_URL is not set
});

// Cache implementation
const cache = new InMemoryCache();

// Create and export the Apollo Client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache
});
