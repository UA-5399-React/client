import type * as ReactRouterDom from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const navigateMock = vi.fn();
const createUserMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof ReactRouterDom;

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('@/components/UserForm/UserForm', () => ({
  UserForm: ({
    onSubmit,
  }: {
    onSubmit: (data: {
      name: string;
      email: string;
      password: string;
      role: 'CUSTOMER';
      imagePreview: null;
      imageFile?: File;
    }) => Promise<void>;
  }) => (
    <button
      type="button"
      onClick={() =>
        void onSubmit({
          name: 'John Doe',
          email: 'john@example.com',
          password: '',
          role: 'CUSTOMER',
          imagePreview: null,
        })
      }
    >
      Submit form
    </button>
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
    uploadImage: vi.fn(),
    loading: false,
  }),
}));

import { CreateUser } from './CreateUser';

describe('CreateUser page', () => {
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
});
