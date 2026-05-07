import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { NotFound } from './NotFound';

const renderPage = () =>
  render(
    <BrowserRouter>
      <NotFound />
    </BrowserRouter>,
  );

describe('NotFound page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders 404 heading and navigation links', () => {
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

  it('navigates to home when Go to Home button is clicked', () => {
    const assignSpy = vi
      .spyOn(window.location, 'assign')
      .mockImplementation(() => {});

    renderPage();

    fireEvent.click(screen.getByRole('button', { name: /go to home/i }));

    expect(assignSpy).toHaveBeenCalledWith('/');
  });
});
