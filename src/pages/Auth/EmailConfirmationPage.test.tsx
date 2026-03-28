import { beforeEach, describe, expect, it } from 'vitest';

import { render, screen } from '@/utils/test-utils';

import { EmailConfirmationPage } from './EmailConfirmationPage';

describe('Page: EmailConfirmationPage', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('should render success confirmation state from query params', () => {
    window.history.pushState(
      {},
      '',
      '/email-confirmation?status=success&message=Email%20confirmed%20successfully',
    );

    render(<EmailConfirmationPage />);

    expect(screen.getByText('Email confirmed')).toBeInTheDocument();
    expect(
      screen.getByText('Email confirmed successfully'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Your account is ready to use.'),
    ).toBeInTheDocument();
  });

  it('should render error confirmation state from query params', () => {
    window.history.pushState(
      {},
      '',
      '/email-confirmation?status=error&message=Token%20expired',
    );

    render(<EmailConfirmationPage />);

    expect(screen.getByText('Confirmation failed')).toBeInTheDocument();
    expect(screen.getByText('Token expired')).toBeInTheDocument();
    expect(
      screen.getByText('The confirmation link may be invalid or expired.'),
    ).toBeInTheDocument();
  });
});
