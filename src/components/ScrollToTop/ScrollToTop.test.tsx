import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ScrollToTop } from './ScrollToTop';

describe('ScrollToTop', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls window.scrollTo(0, 0) after mount', async () => {
    render(
      <MemoryRouter initialEntries={['/page']}>
        <ScrollToTop />
        <Routes>
          <Route path="/page" element={<div>Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  it('calls window.scrollTo again when the pathname changes', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/first']}>
        <ScrollToTop />
        <Routes>
          <Route path="/first" element={<Link to="/second">Next</Link>} />
          <Route path="/second" element={<div>Second</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole('link', { name: 'Next' }));

    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledTimes(2);
      expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0);
    });
  });
});
