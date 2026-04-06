import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { useRegister } from '@/hooks';
import { authService } from '@/services/authService';
import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { RegisterForm } from './RegisterForm';

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks');
  return {
    ...actual,
    useRegister: vi.fn(),
  };
});

vi.mock('@/services/authService', () => ({
  authService: {
    startGoogleAuth: vi.fn(),
  },
}));

describe('Feature: RegisterForm', () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useRegister as Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it('should display all required form fields and submit button', () => {
    render(<RegisterForm />);

    expect(
      screen.getByPlaceholderText(/Your email address/i),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Password$/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirm password/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Continue with Google' }),
    ).toBeInTheDocument();
  });

  it('should show validation errors when submitted empty', async () => {
    const user = userEvent.setup();

    render(<RegisterForm />);

    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(
      await screen.findByText(
        'Password must be at least 8 characters, include uppercase, lowercase, number and symbol',
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Please confirm your password'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        'You must agree to the Privacy Policy and Terms of Use',
      ),
    ).toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should call register API with backend payload and show success state', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce({
      status: 'success',
      message: 'User created successfully.',
    });

    render(<RegisterForm />);

    await user.type(
      screen.getByPlaceholderText(/Your email address/i),
      'newuser@test.com',
    );
    await user.type(screen.getByPlaceholderText(/^Password$/i), 'Password1!');
    await user.type(
      screen.getByPlaceholderText(/Confirm password/i),
      'Password1!',
    );
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'newuser@test.com',
        password: 'Password1!',
        passwordConfirmation: 'Password1!',
      });
    });

    expect(await screen.findByText('Check your email')).toBeInTheDocument();
    expect(
      screen.getByText(/We sent a confirmation email to/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Back to Sign In' }),
    ).toBeInTheDocument();
  });

  it('should show server error and clear it after form changes', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockRejectedValueOnce(new Error('Email already in use'));

    render(<RegisterForm />);

    const emailInput = screen.getByPlaceholderText(/Your email address/i);

    await user.type(emailInput, 'newuser@test.com');
    await user.type(screen.getByPlaceholderText(/^Password$/i), 'Password1!');
    await user.type(
      screen.getByPlaceholderText(/Confirm password/i),
      'Password1!',
    );
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('Email already in use')).toBeInTheDocument();

    await user.type(emailInput, 'a');

    await waitFor(() => {
      expect(
        screen.queryByText('Email already in use'),
      ).not.toBeInTheDocument();
    });
  });

  it('should start google auth when Google button is clicked', async () => {
    const user = userEvent.setup();

    render(<RegisterForm />);

    await user.click(
      screen.getByRole('button', { name: 'Continue with Google' }),
    );

    expect(authService.startGoogleAuth).toHaveBeenCalledWith();
  });
});
