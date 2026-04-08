import { beforeEach, describe, expect, it, vi } from 'vitest';

import { unsubscribeFromNewsletter } from '@/services/newsletter.service';
import { render, screen, waitFor } from '@/utils/test-utils';

import { NewsletterUnsubscribePage } from './NewsletterUnsubscribePage';

vi.mock('@/services/newsletter.service', () => ({
  unsubscribeFromNewsletter: vi.fn(),
}));

describe('Page: NewsletterUnsubscribePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/');
  });

  it('should render page heading', () => {
    window.history.pushState(
      {},
      '',
      '/newsletter/unsubscribe?email=test@example.com',
    );

    vi.mocked(unsubscribeFromNewsletter).mockResolvedValue({ message: 'ok' });

    render(<NewsletterUnsubscribePage />);

    expect(screen.getByText('Newsletter Unsubscribe')).toBeInTheDocument();
  });

  it('should show error when email is missing in query params', async () => {
    render(<NewsletterUnsubscribePage />);

    expect(
      await screen.findByText('Email is missing in the unsubscribe link.'),
    ).toBeInTheDocument();

    expect(unsubscribeFromNewsletter).not.toHaveBeenCalled();
  });

  it('should call unsubscribe service with email from query params', async () => {
    window.history.pushState(
      {},
      '',
      '/newsletter/unsubscribe?email=test@example.com',
    );

    vi.mocked(unsubscribeFromNewsletter).mockResolvedValue({ message: 'ok' });

    render(<NewsletterUnsubscribePage />);

    await waitFor(() => {
      expect(unsubscribeFromNewsletter).toHaveBeenCalledWith(
        'test@example.com',
      );
    });
  });

  it('should show loading state before successful unsubscribe', async () => {
    window.history.pushState(
      {},
      '',
      '/newsletter/unsubscribe?email=test@example.com',
    );

    let resolvePromise: (value: { message: string }) => void = () => {};

    vi.mocked(unsubscribeFromNewsletter).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    render(<NewsletterUnsubscribePage />);

    expect(screen.getByText('Processing your request...')).toBeInTheDocument();

    resolvePromise({ message: 'ok' });

    expect(
      await screen.findByText(
        'You have successfully unsubscribed from the newsletter.',
      ),
    ).toBeInTheDocument();
  });

  it('should show success message after successful unsubscribe', async () => {
    window.history.pushState(
      {},
      '',
      '/newsletter/unsubscribe?email=test@example.com',
    );

    vi.mocked(unsubscribeFromNewsletter).mockResolvedValue({ message: 'ok' });

    render(<NewsletterUnsubscribePage />);

    expect(
      await screen.findByText(
        'You have successfully unsubscribed from the newsletter.',
      ),
    ).toBeInTheDocument();
  });

  it('should show service error message when unsubscribe fails', async () => {
    window.history.pushState(
      {},
      '',
      '/newsletter/unsubscribe?email=test@example.com',
    );

    vi.mocked(unsubscribeFromNewsletter).mockRejectedValue(
      new Error('Failed to unsubscribe'),
    );

    render(<NewsletterUnsubscribePage />);

    expect(
      await screen.findByText('Failed to unsubscribe'),
    ).toBeInTheDocument();
  });

  it('should show fallback error message when unsubscribe throws non-error value', async () => {
    window.history.pushState(
      {},
      '',
      '/newsletter/unsubscribe?email=test@example.com',
    );

    vi.mocked(unsubscribeFromNewsletter).mockRejectedValue(
      'unexpected failure',
    );

    render(<NewsletterUnsubscribePage />);

    expect(
      await screen.findByText('Failed to unsubscribe from the newsletter.'),
    ).toBeInTheDocument();
  });

  it('should call unsubscribe only once for the same mount', async () => {
    window.history.pushState(
      {},
      '',
      '/newsletter/unsubscribe?email=test@example.com',
    );

    vi.mocked(unsubscribeFromNewsletter).mockResolvedValue({ message: 'ok' });

    render(<NewsletterUnsubscribePage />);

    await waitFor(() => {
      expect(unsubscribeFromNewsletter).toHaveBeenCalledTimes(1);
    });
  });
});
