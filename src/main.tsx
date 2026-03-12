import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ConfirmModalProvider } from '@/contexts/ConfirmModalProvider';
import { ThemeProvider } from '@/contexts/ThemeProvider';

import App from './App.tsx';
import { queryClient } from './lib';
import { apolloClient } from './lib/apolloClient.ts';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ConfirmModalProvider>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </ConfirmModalProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ApolloProvider>
  </StrictMode>,
);
