import type { ButtonHTMLAttributes } from 'react';
import type * as ReactRouterDom from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';

const navigateMock = vi.fn();
const useGetAdminUserMock = vi.fn();
const updateUserMock = vi.fn();
const uploadImageMock = vi.fn();
let routeParams: { id?: string } = { id: 'user-1' };
let userFormSubmitData = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: '',
  role: 'ADMIN' as const,
  imagePreview: null as string | null,
  imageFile: undefined as File | undefined,
};

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof ReactRouterDom;

  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div>Navigate:{to}</div>,
    useNavigate: () => navigateMock,
    useParams: () => routeParams,
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
      <div>User form</div>
    </div>
  ),
}));

vi.mock('@/hooks/useGetAdminUser', () => ({
  useGetAdminUser: () => useGetAdminUserMock(),
}));

vi.mock('@/hooks/useUpdateAdminUser', () => ({
  useUpdateAdminUser: () => ({
    updateUser: updateUserMock,
    isUpdating: false,
  }),
}));

vi.mock('@/hooks/useUploadProductImage', () => ({
  useUploadProductImage: () => ({
    uploadImage: uploadImageMock,
    loading: false,
  }),
}));

import { EditUser } from './EditUser';

describe('EditUser page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routeParams = { id: 'user-1' };
    userFormSubmitData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '',
      role: 'ADMIN',
      imagePreview: null,
      imageFile: undefined,
    };
  });

  it('redirects back to users page when route id is missing', () => {
    routeParams = {};
    useGetAdminUserMock.mockReturnValue({
      user: undefined,
      loading: false,
      error: undefined,
    });

    render(<EditUser />);

    expect(screen.getByText(`Navigate:${ROUTES.ADMIN_USERS}`)).toBeInTheDocument();
  });

  it('renders a loading state while fetching the user', () => {
    useGetAdminUserMock.mockReturnValue({
      user: undefined,
      loading: true,
      error: undefined,
    });

    render(<EditUser />);

    expect(screen.getByText(/loading user/i)).toBeInTheDocument();
  });

  it('renders an error state when user data cannot be loaded', () => {
    useGetAdminUserMock.mockReturnValue({
      user: undefined,
      loading: false,
      error: new Error('User not found'),
    });

    render(<EditUser />);

    expect(screen.getByText(/unable to load user/i)).toBeInTheDocument();
    expect(screen.getByText(/user not found/i)).toBeInTheDocument();
  });

  it('renders fallback message when user is missing without explicit error', () => {
    useGetAdminUserMock.mockReturnValue({
      user: undefined,
      loading: false,
      error: undefined,
    });

    render(<EditUser />);

    expect(
      screen.getByText('The selected user could not be found.'),
    ).toBeInTheDocument();
  });

  it('updates the user and navigates back after success', async () => {
    useGetAdminUserMock.mockReturnValue({
      user: {
        id: 'user-1',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        role: 'ADMIN',
        isActive: true,
        isEmailConfirmed: true,
        createdAt: '2026-03-20T10:00:00.000Z',
        updatedAt: '2026-03-20T10:00:00.000Z',
      },
      loading: false,
      error: undefined,
    });

    render(<EditUser />);

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith({
        id: 'user-1',
        role: 'ADMIN',
        firstName: 'Jane',
        lastName: 'Doe',
      });
    });

    expect(navigateMock).toHaveBeenCalledWith(ROUTES.ADMIN_USERS, {
      state: { successMessage: 'User updated successfully.' },
    });
  });

  it('uploads avatar before updating the user', async () => {
    const imageFile = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    userFormSubmitData = {
      ...userFormSubmitData,
      imageFile,
    };

    useGetAdminUserMock.mockReturnValue({
      user: {
        id: 'user-1',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        role: 'ADMIN',
        isActive: true,
        isEmailConfirmed: true,
        createdAt: '2026-03-20T10:00:00.000Z',
        updatedAt: '2026-03-20T10:00:00.000Z',
      },
      loading: false,
      error: undefined,
    });
    uploadImageMock.mockResolvedValueOnce({
      imageUrl: 'https://example.com/avatar.png',
    });

    render(<EditUser />);

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    await waitFor(() => {
      expect(uploadImageMock).toHaveBeenCalledWith(imageFile);
    });

    expect(updateUserMock).toHaveBeenCalledWith(
      expect.objectContaining({
        avatarUrl: 'https://example.com/avatar.png',
      }),
    );
  });

  it('shows a server error when updating fails', async () => {
    useGetAdminUserMock.mockReturnValue({
      user: {
        id: 'user-1',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        role: 'ADMIN',
        isActive: true,
        isEmailConfirmed: true,
        createdAt: '2026-03-20T10:00:00.000Z',
        updatedAt: '2026-03-20T10:00:00.000Z',
      },
      loading: false,
      error: undefined,
    });
    updateUserMock.mockRejectedValueOnce(new Error('Update failed'));

    render(<EditUser />);

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Update failed');
    });
  });
});
