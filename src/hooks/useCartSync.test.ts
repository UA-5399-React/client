import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/hooks/useAuth';
import { cartService } from '@/services/cartService';
import { productService } from '@/services/productService';
import { useCartStore } from '@/store/useCartStore';
import type { CartResponse } from '@/types/cart.types';

import { useCartSync } from './useCartSync';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/cartService');
vi.mock('@/services/productService');
vi.mock('@/store/useCartStore');

type MockCartLine = {
  product: {
    id?: string;
    _id?: string;
    title: string;
    price: number;
    status: 'active';
  };
  quantity: number;
};

describe('useCartSync', () => {
  let cartItems: MockCartLine[];
  const setCart = vi.fn((next: MockCartLine[]) => {
    cartItems = next;
  });

  const buildMockItems = (): MockCartLine[] => [
    {
      product: {
        id: 'prod-1',
        title: 'Product 1',
        price: 100,
        status: 'active' as const,
      },
      quantity: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    cartItems = buildMockItems();
    setCart.mockImplementation((next: MockCartLine[]) => {
      cartItems = next;
    });

    const storeApi = {
      get items() {
        return cartItems;
      },
      setCart,
    };

    vi.mocked(useCartStore).mockImplementation(((selector?: unknown) => {
      if (typeof selector === 'function') {
        return (selector as (s: typeof storeApi) => unknown)(storeApi);
      }
      return storeApi;
    }) as typeof useCartStore);

    vi.mocked(useCartStore).getState = vi.fn(
      () =>
        ({
          items: cartItems,
          setCart,
        }) as unknown as ReturnType<(typeof useCartStore)['getState']>,
    );

    vi.mocked(productService.getById).mockImplementation(
      async (id: string) => ({
        id,
        title: 'P',
        price: 1,
        status: 'active',
      }),
    );

    vi.mocked(cartService.updateCart).mockResolvedValue({
      userId: 'test-user',
      items: [],
      total: 0,
    } as CartResponse);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not sync on initial mount', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);

    renderHook(() => useCartSync());

    vi.advanceTimersByTime(1000);
    expect(cartService.updateCart).not.toHaveBeenCalled();
    expect(productService.getById).not.toHaveBeenCalled();
  });

  it('should not sync if not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: false,
    } as unknown as ReturnType<typeof useAuth>);

    const { rerender } = renderHook(() => useCartSync());

    cartItems = [
      ...buildMockItems(),
      {
        product: {
          id: 'prod-2',
          title: 'Product 2',
          price: 50,
          status: 'active' as const,
        },
        quantity: 1,
      },
    ];
    rerender();

    vi.advanceTimersByTime(1000);
    expect(cartService.updateCart).not.toHaveBeenCalled();
    expect(productService.getById).not.toHaveBeenCalled();
  });

  it('should sync after debounce when items change and authenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);

    const { rerender } = renderHook(() => useCartSync());

    expect(cartService.updateCart).not.toHaveBeenCalled();

    cartItems = [
      ...buildMockItems(),
      {
        product: {
          id: 'prod-2',
          title: 'Product 2',
          price: 50,
          status: 'active' as const,
        },
        quantity: 1,
      },
    ];
    rerender();

    await vi.advanceTimersByTimeAsync(500);
    expect(cartService.updateCart).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(500);

    expect(productService.getById).toHaveBeenCalledWith('prod-1');
    expect(productService.getById).toHaveBeenCalledWith('prod-2');
    expect(cartService.updateCart).toHaveBeenCalledWith([
      { productId: 'prod-1', quantity: 2 },
      { productId: 'prod-2', quantity: 1 },
    ]);
  });

  it('should use _id if id is missing', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);

    const { rerender } = renderHook(() => useCartSync());

    cartItems = [
      {
        product: {
          _id: 'prod-mongo-1',
          title: 'Product 1',
          price: 100,
          status: 'active' as const,
        },
        quantity: 1,
      },
    ];
    rerender();

    await vi.advanceTimersByTimeAsync(1000);

    expect(productService.getById).toHaveBeenCalledWith('prod-mongo-1');
    expect(cartService.updateCart).toHaveBeenCalledWith([
      { productId: 'prod-mongo-1', quantity: 1 },
    ]);
  });

  it('should debounce multiple changes', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);

    const { rerender } = renderHook(() => useCartSync());

    cartItems = [...cartItems];
    rerender();
    await vi.advanceTimersByTimeAsync(500);

    cartItems = [...cartItems];
    rerender();
    await vi.advanceTimersByTimeAsync(500);

    expect(cartService.updateCart).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(500);
    expect(cartService.updateCart).toHaveBeenCalledTimes(1);
  });

  it('should log error if sync fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);
    vi.mocked(cartService.updateCart).mockRejectedValue(
      new Error('Network error'),
    );

    const { rerender } = renderHook(() => useCartSync());

    cartItems = [...cartItems];
    rerender();

    await vi.advanceTimersByTimeAsync(1000);

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

    const { unmount, rerender } = renderHook(() => useCartSync());

    rerender();

    unmount();

    vi.advanceTimersByTime(1000);
    expect(cartService.updateCart).not.toHaveBeenCalled();
  });

  it('should unmount cleanly when no timer is active', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);

    const { unmount } = renderHook(() => useCartSync());

    unmount();

    expect(cartService.updateCart).not.toHaveBeenCalled();
  });

  it('should remove inactive products from cart and omit them from sync', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuth: true,
    } as unknown as ReturnType<typeof useAuth>);

    vi.mocked(productService.getById).mockImplementation(async (id: string) => {
      if (id === 'prod-2') {
        return {
          id,
          title: 'P2',
          price: 50,
          status: 'inactive',
        };
      }
      return { id, title: 'P1', price: 100, status: 'active' };
    });

    const { rerender } = renderHook(() => useCartSync());

    cartItems = [
      ...buildMockItems(),
      {
        product: {
          id: 'prod-2',
          title: 'Product 2',
          price: 50,
          status: 'active' as const,
        },
        quantity: 1,
      },
    ];
    rerender();
    await vi.advanceTimersByTimeAsync(1000);

    expect(setCart).toHaveBeenCalled();

    expect(setCart).toHaveBeenCalledWith([
      {
        product: expect.objectContaining({ id: 'prod-1' }),
        quantity: 2,
      },
    ]);
    expect(cartService.updateCart).toHaveBeenCalledWith([
      { productId: 'prod-1', quantity: 2 },
    ]);
  });
});
