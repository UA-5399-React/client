import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ScrollToTop } from './ScrollToTop';

describe('UI Component: ScrollToTop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
  });

  it('scrolls to top on initial render', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <ScrollToTop />
      </MemoryRouter>,
    );

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });

  it('scrolls to top when pathname changes', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <ScrollToTop />
        <Routes>
          <Route
            path="/profile"
            element={<Link to="/orders">Go to orders</Link>}
          />
          <Route path="/orders" element={<div>Orders page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('link', { name: 'Go to orders' }));

    expect(screen.getByText('Orders page')).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0);
  });
});
