import { StrictMode } from 'react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { authService } from '@/services/authService';
import { render, screen } from '@/utils/test-utils';

import { EmailConfirmationPage } from './EmailConfirmationPage';

vi.mock('@/services/authService', () => ({
  authService: {
    confirmEmail: vi.fn(),
  },
}));

describe('Page: EmailConfirmationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/');
  });

  it('should confirm email and render success state', async () => {
    (authService.confirmEmail as Mock).mockResolvedValueOnce({
      message: 'Email confirmed successfully',
    });

    window.history.pushState({}, '', '/email-confirmation?token=valid-token');

    render(
      <StrictMode>
        <EmailConfirmationPage />
      </StrictMode>,
    );

    expect(await screen.findByText('Email confirmed')).toBeInTheDocument();
    expect(
      screen.getByText('Email confirmed successfully'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Your account is ready to use.'),
    ).toBeInTheDocument();

    expect(authService.confirmEmail).toHaveBeenCalledWith('valid-token');
    expect(authService.confirmEmail).toHaveBeenCalledTimes(1);
  });

  it('should render error state when confirmation fails', async () => {
    (authService.confirmEmail as Mock).mockRejectedValueOnce(
      new Error('Token expired'),
    );

    window.history.pushState({}, '', '/email-confirmation?token=expired-token');

    render(<EmailConfirmationPage />);

    expect(await screen.findByText('Confirmation failed')).toBeInTheDocument();
    expect(screen.getByText('Token expired')).toBeInTheDocument();
    expect(
      screen.getByText('The confirmation link may be invalid or expired.'),
    ).toBeInTheDocument();
  });

  it('should show error when token is missing', async () => {
    render(<EmailConfirmationPage />);

    expect(await screen.findByText('Confirmation failed')).toBeInTheDocument();
    expect(
      screen.getByText('Confirmation token is missing.'),
    ).toBeInTheDocument();
    expect(authService.confirmEmail).not.toHaveBeenCalled();
  });
});
