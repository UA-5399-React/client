import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/hooks/useAuth';
import { cartService } from '@/services/cartService';
import { useCartStore } from '@/store/useCartStore';

import { useCartSync } from './useCartSync';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/cartService');
vi.mock('@/store/useCartStore');

describe('useCartSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockItems = [
    {
      product: { id: 'prod-1', name: 'Product 1', price: 100 },
      quantity: 2,
    },
  ];

  it('should not sync on initial mount', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);
    vi.mocked(useCartStore).mockReturnValue({
      items: mockItems,
    } as unknown as ReturnType<typeof useCartStore>);

    renderHook(() => useCartSync());

    vi.advanceTimersByTime(1000);
    expect(cartService.updateCart).not.toHaveBeenCalled();
  });

  it('should not sync if not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: false,
    } as unknown as ReturnType<typeof useAuth>);
    vi.mocked(useCartStore).mockReturnValue({
      items: mockItems,
    } as unknown as ReturnType<typeof useCartStore>);

    const { rerender } = renderHook(() => useCartSync());

    // Trigger items change
    vi.mocked(useCartStore).mockReturnValue({
      items: [...mockItems, { product: { id: 'prod-2' }, quantity: 1 }],
    } as unknown as ReturnType<typeof useCartStore>);
    rerender();

    vi.advanceTimersByTime(1000);
    expect(cartService.updateCart).not.toHaveBeenCalled();
  });

  it('should sync after debounce when items change and authenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);
    vi.mocked(useCartStore).mockReturnValue({
      items: mockItems,
    } as unknown as ReturnType<typeof useCartStore>);

    const { rerender } = renderHook(() => useCartSync());

    // Initial mount skip
    expect(cartService.updateCart).not.toHaveBeenCalled();

    // Change items
    const newItems = [
      ...mockItems,
      {
        product: { id: 'prod-2', name: 'Product 2', price: 50 },
        quantity: 1,
      },
    ];
    vi.mocked(useCartStore).mockReturnValue({
      items: newItems,
    } as unknown as ReturnType<typeof useCartStore>);
    rerender();

    vi.advanceTimersByTime(500);
    expect(cartService.updateCart).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(cartService.updateCart).toHaveBeenCalledWith([
      { productId: 'prod-1', quantity: 2 },
      { productId: 'prod-2', quantity: 1 },
    ]);
  });

  it('should use _id if id is missing', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);
    const itemsWithUnderscoreId = [
      {
        product: { _id: 'prod-mongo-1', name: 'Product 1', price: 100 },
        quantity: 1,
      },
    ];
    vi.mocked(useCartStore).mockReturnValue({
      items: itemsWithUnderscoreId,
    } as unknown as ReturnType<typeof useCartStore>);

    const { rerender } = renderHook(() => useCartSync());

    vi.mocked(useCartStore).mockReturnValue({
      items: [...itemsWithUnderscoreId],
    } as unknown as ReturnType<typeof useCartStore>);
    rerender();

    vi.advanceTimersByTime(1000);

    expect(cartService.updateCart).toHaveBeenCalledWith([
      { productId: 'prod-mongo-1', quantity: 1 },
    ]);
  });

  it('should debounce multiple changes', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);
    vi.mocked(useCartStore).mockReturnValue({
      items: mockItems,
    } as unknown as ReturnType<typeof useCartStore>);

    const { rerender } = renderHook(() => useCartSync());

    // Change 1
    vi.mocked(useCartStore).mockReturnValue({
      items: [...mockItems],
    } as unknown as ReturnType<typeof useCartStore>);
    rerender();
    vi.advanceTimersByTime(500);

    // Change 2
    vi.mocked(useCartStore).mockReturnValue({
      items: [...mockItems],
    } as unknown as ReturnType<typeof useCartStore>);
    rerender();
    vi.advanceTimersByTime(500);

    expect(cartService.updateCart).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(cartService.updateCart).toHaveBeenCalledTimes(1);
  });

  it('should log error if sync fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);
    vi.mocked(useCartStore).mockReturnValue({
      items: mockItems,
    } as unknown as ReturnType<typeof useCartStore>);
    vi.mocked(cartService.updateCart).mockRejectedValue(
      new Error('Network error'),
    );

    const { rerender } = renderHook(() => useCartSync());

    vi.mocked(useCartStore).mockReturnValue({
      items: [...mockItems],
    } as unknown as ReturnType<typeof useCartStore>);
    rerender();

    vi.advanceTimersByTime(1000);

    // We need to wait for the promise inside setTimeout
    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to sync cart to backend:',
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it('should clear debounce timer on unmount', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);
    vi.mocked(useCartStore).mockReturnValue({
      items: mockItems,
    } as unknown as ReturnType<typeof useCartStore>);

    const { unmount, rerender } = renderHook(() => useCartSync());

    // Trigger sync
    vi.mocked(useCartStore).mockReturnValue({
      items: [...mockItems],
    } as unknown as ReturnType<typeof useCartStore>);
    rerender();

    // Timer should be set
    unmount();

    // Advance time - sync should not be called because timer was cleared
    vi.advanceTimersByTime(1000);
    expect(cartService.updateCart).not.toHaveBeenCalled();
  });

  it('should unmount cleanly when no timer is active', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);
    vi.mocked(useCartStore).mockReturnValue({
      items: mockItems,
    } as unknown as ReturnType<typeof useCartStore>);

    const { unmount } = renderHook(() => useCartSync());

    // No changes triggered, so no timer set
    unmount();

    // No errors should be thrown, and no calls should be made
    expect(cartService.updateCart).not.toHaveBeenCalled();
  });
});
