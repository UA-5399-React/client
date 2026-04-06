import {
  ApolloClient,
  CombinedGraphQLErrors,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { Observable } from '@apollo/client/utilities';

import { MOCK_AUTH, ROUTES } from '@/constants';

const uri = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3000/graphql';

const httpLink = new HttpLink({ uri, credentials: 'include' });

let refreshPromise: Promise<boolean> | null = null;

const clearClientAuthState = () => {
  localStorage.removeItem(MOCK_AUTH.TOKEN_KEY);
  localStorage.removeItem(MOCK_AUTH.EXPIRES_KEY);
  localStorage.removeItem(MOCK_AUTH.ROLE_KEY);
};

const refreshAuthSession = async (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};
const errorLink = new ErrorLink(({ error, operation, forward }) => {
  const isUnauthorizedGraphQL =
    CombinedGraphQLErrors.is(error) &&
    error.errors.some(
      (err) =>
        err.extensions?.code === 'UNAUTHENTICATED' ||
        err.message === 'Unauthorized',
    );

  const isUnauthorizedNetwork =
    !CombinedGraphQLErrors.is(error) &&
    'statusCode' in error &&
    error.statusCode === 401;

  if (!isUnauthorizedGraphQL && !isUnauthorizedNetwork) {
    return;
  }

  return new Observable((observer) => {
    refreshAuthSession()
      .then((success) => {
        if (!success) {
          clearClientAuthState();
          window.location.replace(ROUTES.LOGIN);
          observer.error(error);
          return;
        }

        forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch((err) => {
        observer.error(err);
      });
  });
});

export const apolloClient = new ApolloClient({
  link: errorLink.concat(httpLink),
  cache: new InMemoryCache(),
});
