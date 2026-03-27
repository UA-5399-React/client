import type * as ReactRouterDom from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const navigateMock = vi.fn();
const useGetAdminUserMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof ReactRouterDom;

  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ id: 'user-1' }),
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
  UserForm: () => <div>User form</div>,
}));

vi.mock('@/hooks/useGetAdminUser', () => ({
  useGetAdminUser: () => useGetAdminUserMock(),
}));

vi.mock('@/hooks/useUpdateAdminUser', () => ({
  useUpdateAdminUser: () => ({
    updateUser: vi.fn(),
    isUpdating: false,
  }),
}));

vi.mock('@/hooks/useUploadProductImage', () => ({
  useUploadProductImage: () => ({
    uploadImage: vi.fn(),
    loading: false,
  }),
}));

import { EditUser } from './EditUser';

describe('EditUser page', () => {
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
});
