import { beforeEach, describe, expect, it } from 'vitest';

import { useAdminProductsStore } from './useAdminProductsStore';

describe('Store: useAdminProductsStore selection', () => {
  beforeEach(() => {
    useAdminProductsStore.getState().clearSelection();
  });

  it('should allow multiple product IDs to be selected', () => {
    useAdminProductsStore.getState().toggleSelect('product-1');
    useAdminProductsStore.getState().toggleSelect('product-2');

    expect(useAdminProductsStore.getState().selectedIds).toEqual([
      'product-1',
      'product-2',
    ]);
  });

  it('should deselect only the product ID that is toggled again', () => {
    useAdminProductsStore.getState().selectAll(['product-1', 'product-2']);
    useAdminProductsStore.getState().toggleSelect('product-1');

    expect(useAdminProductsStore.getState().selectedIds).toEqual(['product-2']);
  });
});
