import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockUsers } from '@/constants/mockUsers';

import { UsersTable } from './UsersTable';

vi.mock('@/hooks/useUpdateAdminUser', () => ({
  useUpdateAdminUser: () => ({
    handleUpdate: vi.fn(),
    isUpdating: false,
  }),
}));

vi.mock('lucide-react', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, React.FC>;

  return {
    ...actual,
    EllipsisVertical: () => <div data-testid="ellipsis" />,
    Pencil: () => <div data-testid="pencil" />,
    Trash: () => <div data-testid="trash" />,
  };
});

describe('UsersTable', () => {
  it('renders "No users found" when list is empty', () => {
    render(<UsersTable items={[]} />);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('renders user information correctly', () => {
    render(<UsersTable items={mockUsers} />);
    const firstUser = mockUsers[0];
    const fullName = `${firstUser.firstName} ${firstUser.lastName}`;
    expect(screen.getByText(fullName)).toBeInTheDocument();
    expect(screen.getByText(firstUser.email)).toBeInTheDocument();
  });

  it('opens action menu and interacts with buttons', () => {
    render(<UsersTable items={mockUsers} />);
    const firstUser = mockUsers[0];
    const menuBtn = screen.getByLabelText(
      new RegExp(`actions for ${firstUser.firstName}`, 'i'),
    );
    fireEvent.click(menuBtn);
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  it('renders dropdowns for status and role', () => {
    render(<UsersTable items={mockUsers} />);
    const statusButtons = screen.getAllByRole('combobox', { name: /status/i });
    const roleButtons = screen.getAllByRole('combobox', { name: /role/i });

    expect(statusButtons.length).toBeGreaterThan(0);
    expect(roleButtons.length).toBeGreaterThan(0);
  });
});
