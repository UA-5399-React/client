import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NotFound } from './NotFound';

const renderPage = () =>
  render(
    <BrowserRouter>
      <NotFound />
    </BrowserRouter>,
  );

describe('NotFound page', () => {
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
    render(
      <MemoryRouter initialEntries={['/not-found']}>
        <Routes>
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /go to home/i }));

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});
