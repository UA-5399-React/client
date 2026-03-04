/* eslint-disable react-refresh/only-export-components */
import React, { type ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';

// Create new QueryClient for each test for isolation
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests so they fail immediately
      },
    },
  });

// Our global wrapper with all providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

// Override the standard render method to include our providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Export everything from the standard RTL to use this file as a single entry point
export * from '@testing-library/react';

// Export our overridden render (and userEvent for convenience)
export { customRender as render };
export { default as userEvent } from '@testing-library/user-event';
