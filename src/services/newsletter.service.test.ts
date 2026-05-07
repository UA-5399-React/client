import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { API_BASE_URL } from '@/constants';

import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
} from './newsletter.service';

global.fetch = vi.fn();

describe('newsletter.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('subscribeToNewsletter', () => {
    it('POSTs email JSON and returns parsed body when ok', async () => {
      const body = { message: 'Subscribed' };
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => body,
      });

      const result = await subscribeToNewsletter('user@example.com');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/newsletter/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'user@example.com' }),
        },
      );
      expect(result).toEqual(body);
    });

    it('throws with API message when response is not ok', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Already on list' }),
      });

      await expect(subscribeToNewsletter('a@b.com')).rejects.toThrow(
        'Already on list',
      );
    });

    it('throws default message when not ok and body has no message', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(subscribeToNewsletter('a@b.com')).rejects.toThrow(
        'Failed to subscribe',
      );
    });

    it('throws default message when not ok and json parse fails', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error('invalid json');
        },
      });

      await expect(subscribeToNewsletter('a@b.com')).rejects.toThrow(
        'Failed to subscribe',
      );
    });
  });

  describe('unsubscribeFromNewsletter', () => {
    it('PATCHes unsubscribe URL with email query param', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      await unsubscribeFromNewsletter('me@test.org');

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, init] = (global.fetch as Mock).mock.calls[0] as [
        string,
        RequestInit,
      ];

      expect(url).toBe(
        `${API_BASE_URL}/newsletter/unsubscribe?email=${encodeURIComponent('me@test.org')}`,
      );
      expect(init).toMatchObject({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('throws with API message when unsubscribe fails', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Unknown email' }),
      });

      await expect(unsubscribeFromNewsletter('x@y.com')).rejects.toThrow(
        'Unknown email',
      );
    });

    it('throws default when unsubscribe fails without message', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(unsubscribeFromNewsletter('x@y.com')).rejects.toThrow(
        'Failed to unsubscribe',
      );
    });
  });
});
