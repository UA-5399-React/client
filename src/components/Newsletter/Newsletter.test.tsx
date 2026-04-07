import { act, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { subscribeToNewsletter } from '@/services/newsletter.service';
import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { Newsletter } from './Newsletter';

vi.mock('@/services/newsletter.service', () => ({
  subscribeToNewsletter: vi.fn(),
}));

describe('Component: Newsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render heading and description', () => {
    render(<Newsletter />);

    expect(screen.getByText('Join Our Newsletter')).toBeInTheDocument();
    expect(
      screen.getByText('Sign up for deals, new products and promotions'),
    ).toBeInTheDocument();
  });

  it('should render email input and signup button', () => {
    render(<Newsletter />);

    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Signup' })).toBeInTheDocument();
  });

  it('should render decorative images', () => {
    render(<Newsletter />);

    expect(screen.getByAltText('headphones')).toBeInTheDocument();
    expect(screen.getByAltText('laptop')).toBeInTheDocument();
  });

  it('should render a form element', () => {
    const { container } = render(<Newsletter />);

    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('should call subscribe service and show success message', async () => {
    const user = userEvent.setup();

    vi.mocked(subscribeToNewsletter).mockResolvedValue({ message: 'success' });

    render(<Newsletter />);

    const input = screen.getByPlaceholderText('Email address');
    const button = screen.getByRole('button', { name: 'Signup' });

    await user.type(input, 'test@example.com');
    await user.click(button);

    await waitFor(() => {
      expect(subscribeToNewsletter).toHaveBeenCalledWith('test@example.com');
    });

    expect(
      screen.getByText('You have successfully subscribed'),
    ).toBeInTheDocument();
  });

  it('should show error message when subscription fails', async () => {
    const user = userEvent.setup();

    vi.mocked(subscribeToNewsletter).mockRejectedValue(new Error('Failed'));

    render(<Newsletter />);

    const input = screen.getByPlaceholderText('Email address');
    const button = screen.getByRole('button', { name: 'Signup' });

    await user.type(input, 'test@example.com');
    await user.click(button);

    await waitFor(() => {
      expect(subscribeToNewsletter).toHaveBeenCalledWith('test@example.com');
    });

    expect(
      screen.getByText('Something went wrong. Try again.'),
    ).toBeInTheDocument();
  });

  it('should show loading state while submitting', async () => {
    const user = userEvent.setup();

    let resolvePromise: () => void = () => {};

    vi.mocked(subscribeToNewsletter).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = () => resolve({ message: 'success' });
        }),
    );

    render(<Newsletter />);

    const input = screen.getByPlaceholderText('Email address');
    const button = screen.getByRole('button', { name: 'Signup' });

    await user.type(input, 'test@example.com');
    await user.click(button);

    expect(screen.getByRole('button', { name: 'Loading' })).toBeInTheDocument();

    resolvePromise();

    await waitFor(() => {
      expect(
        screen.getByText('You have successfully subscribed'),
      ).toBeInTheDocument();
    });
  });

  it('should clear success message after 8 seconds', async () => {
    vi.useFakeTimers();

    vi.mocked(subscribeToNewsletter).mockResolvedValue({ message: 'success' });

    render(<Newsletter />);

    const input = screen.getByPlaceholderText('Email address');
    const form = document.querySelector('form');

    fireEvent.change(input, { target: { value: 'test@example.com' } });

    await act(async () => {
      fireEvent.submit(form!);
    });

    expect(
      screen.getByText('You have successfully subscribed'),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(
      screen.queryByText('You have successfully subscribed'),
    ).not.toBeInTheDocument();
  });
});
