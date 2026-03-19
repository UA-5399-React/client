import { afterEach, describe, expect, it, vi } from 'vitest';

import { act, render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { AdminCategories } from './AdminCategories';

const useAdminCategoriesPageMock = vi.fn();
const openConfirmModalMock = vi.fn();
const deleteCategoryMock = vi.fn();

vi.mock('@/hooks/useAdminCategoriesPage', () => ({
  useAdminCategoriesPage: (...args: unknown[]) =>
    useAdminCategoriesPageMock(...args),
}));

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks');
  return {
    ...actual,
    useConfirmModal: () => ({
      openConfirmModal: openConfirmModalMock,
    }),
    useDeleteAdminCategory: () => ({
      deleteCategory: deleteCategoryMock,
    }),
  };
});

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false }),
}));

describe('Page: AdminCategories', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

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

  it('should open confirm modal when user clicks delete on leaf category', async () => {
    const user = userEvent.setup();
    useAdminCategoriesPageMock.mockReturnValue({
      categories: [
        {
          id: 'parent-1',
          title: 'Laptops',
          imageUrl: null,
          description: 'Main laptops category',
          parent: null,
          depth: 1,
          createdAt: '2025-10-10T12:00:00Z',
          updatedAt: '2025-10-11T12:00:00Z',
        },
        {
          id: 'child-1',
          title: 'Ultrabooks',
          imageUrl: null,
          description: 'Slim laptops',
          parent: 'parent-1',
          depth: 2,
          createdAt: '2025-10-12T12:00:00Z',
          updatedAt: '2025-10-13T12:00:00Z',
        },
        {
          id: 'parent-2',
          title: 'Accessories',
          imageUrl: null,
          description: 'Category without children',
          parent: null,
          depth: 1,
          createdAt: '2025-10-14T12:00:00Z',
          updatedAt: '2025-10-15T12:00:00Z',
        },
      ],
      loading: false,
      error: null,
      totalPages: 1,
      total: 3,
    });

    render(<AdminCategories />);

    await user.click(
      screen.getByRole('button', { name: 'Delete Accessories' }),
    );

    expect(openConfirmModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Delete Category',
        confirmText: 'Delete',
      }),
    );
  });

  it('should execute delete mutation when modal confirm callback is called', async () => {
    useAdminCategoriesPageMock.mockReturnValue({
      categories: [
        {
          id: 'parent-2',
          title: 'Accessories',
          imageUrl: null,
          description: 'Category without children',
          parent: null,
          depth: 1,
          createdAt: '2025-10-14T12:00:00Z',
          updatedAt: '2025-10-15T12:00:00Z',
        },
      ],
      loading: false,
      error: null,
      totalPages: 1,
      total: 1,
    });
    deleteCategoryMock.mockResolvedValue(undefined);

    render(<AdminCategories />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Delete Accessories' }),
    );

    const modalConfig = openConfirmModalMock.mock.calls[0]?.[0];

    await act(async () => {
      await modalConfig.onConfirm();
    });

    expect(deleteCategoryMock).toHaveBeenCalledWith('parent-2');
  });
});
