import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authService } from '@/services/authService';
import { render, screen, userEvent } from '@/utils/test-utils';

import { ResetPasswordPage } from './ResetPasswordPage';

vi.mock('@/services/authService', () => ({
  authService: {
    resetPassword: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

// Helper to render with ?token= query param via MemoryRouter
const renderWithToken = (token?: string) => {
  const search = token ? `?token=${token}` : '';
  const client = createTestQueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/reset-password${search}`]}>
        <ResetPasswordPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('Feature: ResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows invalid link state when token is missing', () => {
    renderWithToken();

    expect(screen.getByText('Invalid link')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Request new link/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Back to Sign In/i }),
    ).toBeInTheDocument();
  });

  it('renders the password form when token is present', () => {
    renderWithToken('valid-token');

    expect(screen.getByPlaceholderText('New password')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Confirm new password'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Set new password/i }),
    ).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    const user = userEvent.setup();
    renderWithToken('valid-token');

    await user.click(screen.getByRole('button', { name: /Set new password/i }));

    expect(
      await screen.findByText('Password must be at least 8 characters'),
    ).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderWithToken('valid-token');

    await user.type(
      screen.getByPlaceholderText('New password'),
      'Strongpass1!',
    );
    await user.type(
      screen.getByPlaceholderText(/Confirm new password/i),
      'Different1!',
    );
    await user.click(screen.getByRole('button', { name: /Set new password/i }));

    expect(
      await screen.findByText("Passwords don't match"),
    ).toBeInTheDocument();
  });

  it('shows success state after successful password reset', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.resetPassword).mockResolvedValueOnce({
      message: 'OK',
    });

    renderWithToken('valid-token');

    await user.type(
      screen.getByPlaceholderText('New password'),
      'Strongpass1!',
    );
    await user.type(
      screen.getByPlaceholderText(/Confirm new password/i),
      'Strongpass1!',
    );
    await user.click(screen.getByRole('button', { name: /Set new password/i }));

    expect(await screen.findByText('Password updated')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Go to Sign In/i }),
    ).toBeInTheDocument();
  });

  it('shows error message on failed reset', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.resetPassword).mockRejectedValueOnce(
      new Error('Token expired'),
    );

    renderWithToken('expired-token');

    await user.type(
      screen.getByPlaceholderText('New password'),
      'Strongpass1!',
    );
    await user.type(
      screen.getByPlaceholderText(/Confirm new password/i),
      'Strongpass1!',
    );
    await user.click(screen.getByRole('button', { name: /Set new password/i }));

    expect(await screen.findByText('Token expired')).toBeInTheDocument();
  });

  it('shows fallback error when non-Error is thrown', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.resetPassword).mockRejectedValueOnce('oops');

    renderWithToken('some-token');

    await user.type(
      screen.getByPlaceholderText('New password'),
      'Strongpass1!',
    );
    await user.type(
      screen.getByPlaceholderText(/Confirm new password/i),
      'Strongpass1!',
    );
    await user.click(screen.getByRole('button', { name: /Set new password/i }));

    expect(
      await screen.findByText('Failed to reset password.'),
    ).toBeInTheDocument();
  });

  it('shows loading state while submitting', async () => {
    const user = userEvent.setup();
    let resolve: (v: { message: string }) => void;
    vi.mocked(authService.resetPassword).mockReturnValueOnce(
      new Promise((r) => {
        resolve = r;
      }),
    );

    renderWithToken('valid-token');

    await user.type(
      screen.getByPlaceholderText('New password'),
      'Strongpass1!',
    );
    await user.type(
      screen.getByPlaceholderText(/Confirm new password/i),
      'Strongpass1!',
    );
    await user.click(screen.getByRole('button', { name: /Set new password/i }));

    expect(
      await screen.findByRole('button', { name: /Updating/i }),
    ).toBeDisabled();
    resolve!({ message: 'done' });
  });

  it('navigates to sign in when Go to Sign In button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.resetPassword).mockResolvedValueOnce({
      message: 'OK',
    });

    renderWithToken('valid-token');

    await user.type(
      screen.getByPlaceholderText('New password'),
      'Strongpass1!',
    );
    await user.type(
      screen.getByPlaceholderText(/Confirm new password/i),
      'Strongpass1!',
    );
    await user.click(screen.getByRole('button', { name: /Set new password/i }));

    await user.click(
      await screen.findByRole('button', { name: /Go to Sign In/i }),
    );
  });
});
