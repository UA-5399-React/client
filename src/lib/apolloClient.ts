import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const uri = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3000/graphql';

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri, credentials: 'include' }),
  cache: new InMemoryCache(),
});
