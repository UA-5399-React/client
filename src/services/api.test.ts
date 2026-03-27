import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { API_BASE_URL, MOCK_AUTH } from '@/constants';

import { apiClient } from './api';

describe('service: apiClient', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('retries a protected POST request after refreshing the auth session', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, {
          status: 401,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ status: 'success' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            sessionId: 'cs_test',
            sessionUrl: 'https://stripe.test',
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

    global.fetch = fetchMock as typeof fetch;

    const response = await apiClient.post('/payments/create-checkout-session', {
      items: [],
    });

    expect(response).toEqual({
      sessionId: 'cs_test',
      sessionUrl: 'https://stripe.test',
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${API_BASE_URL}/auth/refresh`,
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      `${API_BASE_URL}/payments/create-checkout-session`,
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      }),
    );
  });

  it('clears local auth markers when refresh fails after a 401 response', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, {
          status: 401,
        }),
      )
      .mockResolvedValueOnce(
        new Response(null, {
          status: 401,
        }),
      );

    global.fetch = fetchMock as typeof fetch;

    localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'cookie-is-set');
    localStorage.setItem(MOCK_AUTH.EXPIRES_KEY, String(Date.now() + 60_000));
    localStorage.setItem(MOCK_AUTH.ROLE_KEY, 'customer');

    await expect(
      apiClient.post('/payments/create-checkout-session', { items: [] }),
    ).rejects.toThrow('HTTP error! status: 401');

    expect(localStorage.getItem(MOCK_AUTH.TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(MOCK_AUTH.EXPIRES_KEY)).toBeNull();
    expect(localStorage.getItem(MOCK_AUTH.ROLE_KEY)).toBeNull();
  });
});
