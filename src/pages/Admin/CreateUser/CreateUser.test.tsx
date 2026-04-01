import type { ButtonHTMLAttributes } from 'react';
import type * as ReactRouterDom from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';

const navigateMock = vi.fn();
const createUserMock = vi.fn();
const uploadImageMock = vi.fn();
let userFormSubmitData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: '',
  role: 'CUSTOMER' as const,
  imagePreview: null as string | null,
  imageFile: undefined as File | undefined,
};

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof ReactRouterDom;

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@/components/Button', () => ({
  Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('@/components/UserForm/UserForm', () => ({
  UserForm: ({
    onSubmit,
    onCancel,
    serverError,
  }: {
    onSubmit: (data: typeof userFormSubmitData) => Promise<void>;
    onCancel: () => void;
    serverError?: string | null;
  }) => (
    <div>
      {serverError && <div role="alert">{serverError}</div>}
      <button type="button" onClick={() => void onSubmit(userFormSubmitData)}>
        Submit form
      </button>
      <button type="button" onClick={onCancel}>
        Cancel form
      </button>
    </div>
  ),
}));

vi.mock('@/hooks/useCreateAdminUser', () => ({
  useCreateAdminUser: () => ({
    createUser: createUserMock,
    loading: false,
  }),
}));

vi.mock('@/hooks/useUploadProductImage', () => ({
  useUploadProductImage: () => ({
    uploadImage: uploadImageMock,
    loading: false,
  }),
}));

import { CreateUser } from './CreateUser';

describe('CreateUser page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    userFormSubmitData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '',
      role: 'CUSTOMER',
      imagePreview: null,
      imageFile: undefined,
    };
  });

  it('shows temporary credentials after successful creation', async () => {
    createUserMock.mockResolvedValueOnce({
      user: {
        id: 'user-1',
        email: 'john@example.com',
      },
      tempPassword: 'TempPass123',
    });

    render(<CreateUser />);

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    await waitFor(() => {
      expect(screen.getByText(/temporary password/i)).toBeInTheDocument();
    });

    expect(screen.getByText('TempPass123')).toBeInTheDocument();
    expect(createUserMock).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: undefined,
      role: 'CUSTOMER',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: undefined,
    });
  });

  it('shows manual password message and navigates back after success without temp password', async () => {
    createUserMock.mockResolvedValueOnce({
      user: {
        id: 'user-1',
        email: 'john@example.com',
      },
      tempPassword: null,
    });

    render(<CreateUser />);

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'This user was created with the password you entered.',
        ),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /back to users/i }));

    expect(navigateMock).toHaveBeenCalledWith(ROUTES.ADMIN_USERS, {
      state: { successMessage: 'User created successfully.' },
    });
  });

  it('uploads avatar before creating the user', async () => {
    const imageFile = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    userFormSubmitData = {
      ...userFormSubmitData,
      imageFile,
    };

    uploadImageMock.mockResolvedValueOnce({
      imageUrl: 'https://example.com/avatar.png',
    });
    createUserMock.mockResolvedValueOnce({
      user: {
        id: 'user-1',
        email: 'john@example.com',
      },
      tempPassword: null,
    });

    render(<CreateUser />);

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    await waitFor(() => {
      expect(uploadImageMock).toHaveBeenCalledWith(imageFile);
    });

    expect(createUserMock).toHaveBeenCalledWith(
      expect.objectContaining({
        avatarUrl: 'https://example.com/avatar.png',
      }),
    );
  });

  it('shows a server error when creating a user fails', async () => {
    createUserMock.mockResolvedValueOnce(null);

    render(<CreateUser />);

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Failed to create user',
      );
    });
  });
});
