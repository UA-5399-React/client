import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { AdminCategories } from './AdminCategories';

const useAdminCategoriesPageMock = vi.fn();

vi.mock('@/hooks/useAdminCategoriesPage', () => ({
  useAdminCategoriesPage: (...args: unknown[]) =>
    useAdminCategoriesPageMock(...args),
}));

describe('Page: AdminCategories', () => {
  it('should read page from URL params', () => {
    window.history.pushState({}, '', '/admin/categories?page=2');
    useAdminCategoriesPageMock.mockReturnValue({
      categories: [],
      loading: false,
      error: null,
      totalPages: 5,
    });

    render(<AdminCategories />);

    expect(useAdminCategoriesPageMock).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      search: '',
    });
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('should update URL params when user searches and changes page', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/admin/categories?page=3');
    useAdminCategoriesPageMock.mockReturnValue({
      categories: [],
      loading: false,
      error: null,
      totalPages: 5,
    });

    render(<AdminCategories />);

    await user.type(screen.getByRole('textbox'), 'tv');

    expect(window.location.search).toContain('page=1');
    expect(window.location.search).not.toContain('search=');
    expect(screen.getByRole('textbox')).toHaveValue('tv');

    await user.click(screen.getByRole('button', { name: '2' }));

    expect(window.location.search).toContain('page=2');
    expect(window.location.search).not.toContain('search=');
  });

  it('should reset page to 1 when current page has no items but categories exist', async () => {
    window.history.pushState({}, '', '/admin/categories?page=100');
    useAdminCategoriesPageMock.mockReturnValue({
      categories: [],
      loading: false,
      error: null,
      totalPages: 5,
      total: 20,
    });

    render(<AdminCategories />);

    await waitFor(() => {
      expect(window.location.search).toContain('page=1');
    });
  });
});
