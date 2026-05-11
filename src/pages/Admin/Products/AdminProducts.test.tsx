import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAdminProductsStore } from '@/store/useAdminProductsStore';
import type { Product } from '@/types';
import { act, render, screen, userEvent } from '@/utils/test-utils';

import { AdminProducts } from './AdminProducts';

const openConfirmModalMock = vi.fn();
const deleteProductMock = vi.fn();
const duplicateProductMock = vi.fn();

const draftProducts: Product[] = [
  {
    id: 'draft-1',
    title: 'Draft Alpha',
    status: 'draft',
    price: 99,
    description: 'First draft product',
    imageUrl: 'https://example.com/draft-alpha.jpg',
    createdAt: '2026-04-07T10:00:00.000Z',
    purchaseCount: 7,
  },
  {
    id: 'draft-2',
    title: 'Draft Beta',
    status: 'draft',
    price: 49,
    description: 'Second draft product',
    imageUrl: 'https://example.com/draft-beta.jpg',
    createdAt: '2026-04-08T10:00:00.000Z',
    purchaseCount: 3,
  },
];

vi.mock('@/hooks/useAdminProduct', () => ({
  useAdminProducts: () => ({
    items: draftProducts,
    loading: false,
    error: null,
    totalPages: 1,
  }),
}));

vi.mock('@/hooks/useConfirmModal', () => ({
  useConfirmModal: () => ({
    openConfirmModal: openConfirmModalMock,
  }),
}));

vi.mock('@/hooks/useDeleteAdminProduct', () => ({
  useDeleteAdminProduct: () => ({
    deleteProduct: deleteProductMock,
  }),
}));

vi.mock('@/hooks/useDuplicate', () => ({
  useDuplicate: () => ({
    duplicateProduct: duplicateProductMock,
  }),
}));

vi.mock('@/hooks/useErrorMessage', () => ({
  useErrorMessage: () => undefined,
}));

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false }),
}));

describe('Page: AdminProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAdminProductsStore.getState().clearSelection();
    deleteProductMock.mockResolvedValue(undefined);
    window.history.pushState({}, '', '/admin/products');
  });

  it('should bulk delete all selected draft products', async () => {
    const user = userEvent.setup();

    render(<AdminProducts />);

    const [, firstProductCheckbox, secondProductCheckbox] =
      screen.getAllByRole('checkbox');

    await user.click(firstProductCheckbox);
    await user.click(secondProductCheckbox);
    await user.click(
      screen.getByRole('button', { name: 'Open actions for Draft Alpha' }),
    );
    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(openConfirmModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Delete Selected',
        description: 'Delete 2 draft products?',
        confirmText: 'Delete',
      }),
    );

    const modalConfig = openConfirmModalMock.mock.calls[0]?.[0];

    await act(async () => {
      await modalConfig.onConfirm();
    });

    expect(deleteProductMock).toHaveBeenCalledTimes(2);
    expect(deleteProductMock).toHaveBeenCalledWith('draft-1');
    expect(deleteProductMock).toHaveBeenCalledWith('draft-2');
  });
});
