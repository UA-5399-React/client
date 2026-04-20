import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NotFound } from './NotFound';

let mockIsDark = false;
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: mockIsDark }),
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <NotFound />
    </BrowserRouter>,
  );

describe('NotFound page', () => {
  it('renders 404 heading and navigation links in light mode', () => {
    mockIsDark = false;
    renderPage();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /go to home/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /browse shop/i }),
    ).toBeInTheDocument();
  });

  it('renders with dark mode styles', () => {
    mockIsDark = true;
    renderPage();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});
