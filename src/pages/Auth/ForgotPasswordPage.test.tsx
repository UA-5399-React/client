import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authService } from '@/services/authService';
import { render, screen, userEvent } from '@/utils/test-utils';

import { ForgotPasswordPage } from './ForgotPasswordPage';

vi.mock('@/services/authService', () => ({
  authService: {
    requestPasswordReset: vi.fn(),
  },
}));

describe('Feature: ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with email input and submit button', () => {
    render(<ForgotPasswordPage />);

    expect(
      screen.getByPlaceholderText(/Your email address/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Send reset link/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Back to Sign In/i }),
    ).toBeInTheDocument();
  });

  it('shows validation error for empty submit', async () => {
    const user = userEvent.setup();

    render(<ForgotPasswordPage />);

    await user.click(screen.getByRole('button', { name: /Send reset link/i }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();

    render(<ForgotPasswordPage />);

    await user.type(
      screen.getByPlaceholderText(/Your email address/i),
      'notanemail',
    );
    await user.click(screen.getByRole('button', { name: /Send reset link/i }));

    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
  });

  it('shows success state after successful submit', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.requestPasswordReset).mockResolvedValueOnce({
      message: 'Reset link sent',
    });

    render(<ForgotPasswordPage />);

    await user.type(
      screen.getByPlaceholderText(/Your email address/i),
      'test@example.com',
    );
    await user.click(screen.getByRole('button', { name: /Send reset link/i }));

    expect(await screen.findByText('Check your email')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Back to Sign In/i }),
    ).toBeInTheDocument();
  });

  it('shows server error message on failed submit', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.requestPasswordReset).mockRejectedValueOnce(
      new Error('User not found'),
    );

    render(<ForgotPasswordPage />);

    await user.type(
      screen.getByPlaceholderText(/Your email address/i),
      'test@example.com',
    );
    await user.click(screen.getByRole('button', { name: /Send reset link/i }));

    expect(await screen.findByText('User not found')).toBeInTheDocument();
  });

  it('shows fallback error message when non-Error is thrown', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.requestPasswordReset).mockRejectedValueOnce('oops');

    render(<ForgotPasswordPage />);

    await user.type(
      screen.getByPlaceholderText(/Your email address/i),
      'test@example.com',
    );
    await user.click(screen.getByRole('button', { name: /Send reset link/i }));

    expect(
      await screen.findByText('Something went wrong.'),
    ).toBeInTheDocument();
  });

  it('shows loading state while submitting', async () => {
    const user = userEvent.setup();
    let resolve: (v: { message: string }) => void;
    vi.mocked(authService.requestPasswordReset).mockReturnValueOnce(
      new Promise((r) => {
        resolve = r;
      }),
    );

    render(<ForgotPasswordPage />);

    await user.type(
      screen.getByPlaceholderText(/Your email address/i),
      'test@example.com',
    );
    await user.click(screen.getByRole('button', { name: /Send reset link/i }));

    expect(
      await screen.findByRole('button', { name: /Sending/i }),
    ).toBeDisabled();
    resolve!({ message: 'done' });
  });

  it('shows fallback message in success state when server returns no message', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.requestPasswordReset).mockResolvedValueOnce(
      {} as { message: string },
    );

    render(<ForgotPasswordPage />);

    await user.type(
      screen.getByPlaceholderText(/Your email address/i),
      'test@example.com',
    );
    await user.click(screen.getByRole('button', { name: /Send reset link/i }));

    expect(await screen.findByText('Check your email')).toBeInTheDocument();
    expect(
      screen.getByText(/If this email is registered/i),
    ).toBeInTheDocument();
  });
});
