import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { paymentService } from '@/services/paymentService';
import { useCartStore } from '@/store/useCartStore';

import { useCheckout } from './useCheckout';

const useMutationMock = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useMutation: (options: unknown) => useMutationMock(options),
}));

vi.mock('@/store/useCartStore', () => ({
  useCartStore: vi.fn(),
}));

vi.mock('@/services/paymentService', () => ({
  paymentService: {
    createCheckoutSession: vi.fn(),
  },
}));

describe('Hook: useCheckout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps cart items and creates checkout session', async () => {
    vi.mocked(useCartStore).mockReturnValue([
      {
        product: {
          _id: 'mongo-1',
          id: 'fallback-1',
          title: 'Keyboard',
          price: 99,
          imageUrl: 'https://image.test/kb.png',
          status: 'active',
        },
        quantity: 2,
      },
      {
        product: {
          id: 'uuid-2',
          title: 'Mouse',
          price: 49,
          status: 'active',
        },
        quantity: 1,
      },
    ] as ReturnType<typeof useCartStore>);

    vi.mocked(paymentService.createCheckoutSession).mockResolvedValue({
      sessionId: 'sess_123',
      sessionUrl: 'http://checkout.test/sess_123',
    });

    useMutationMock.mockImplementation(({ mutationFn }) => ({
      mutate: () => mutationFn(),
      isPending: false,
      error: null,
    }));

    const { result } = renderHook(() => useCheckout());

    await act(async () => {
      await result.current.checkout();
    });

    expect(paymentService.createCheckoutSession).toHaveBeenCalledWith([
      {
        productId: 'mongo-1',
        title: 'Keyboard',
        price: 99,
        quantity: 2,
        imageUrl: 'https://image.test/kb.png',
      },
      {
        productId: 'uuid-2',
        title: 'Mouse',
        price: 49,
        quantity: 1,
        imageUrl: undefined,
      },
    ]);
  });

  it('returns loading and error values from mutation', () => {
    const expectedError = new Error('Checkout failed');

    vi.mocked(useCartStore).mockReturnValue(
      [] as ReturnType<typeof useCartStore>,
    );

    useMutationMock.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: expectedError,
    });

    const { result } = renderHook(() => useCheckout());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(expectedError);
    expect(typeof result.current.checkout).toBe('function');
  });
});
