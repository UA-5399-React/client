import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockUsers } from '@/constants/mockUsers';

import { UsersTable } from './UsersTable';

vi.mock('@/hooks/useUpdateAdminUser', () => ({
  useUpdateAdminUser: () => ({
    handleUpdate: vi.fn(),
    isUpdating: false,
  }),
}));

const mockDeleteUser = vi.fn();
vi.mock('@/hooks/useDeleteAdminUser', () => ({
  useDeleteAdminUser: () => ({
    deleteUser: mockDeleteUser,
    loading: false,
  }),
}));

const mockOpenConfirmModal = vi.fn();
vi.mock('@/hooks/useConfirmModal', () => ({
  useConfirmModal: () => ({
    openConfirmModal: mockOpenConfirmModal,
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
  const renderTable = (items = mockUsers) =>
    render(
      <MemoryRouter>
        <UsersTable
          items={items}
          lastLoginSort={null}
          onLastLoginSortChange={vi.fn()}
        />
      </MemoryRouter>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "No users found" when list is empty', () => {
    renderTable([]);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('renders user information correctly', () => {
    renderTable();
    const firstUser = mockUsers[0];
    const fullName = `${firstUser.firstName} ${firstUser.lastName}`;
    const nameElements = screen.getAllByText(fullName);
    expect(nameElements[0]).toBeInTheDocument();
    expect(screen.getByText(firstUser.email)).toBeInTheDocument();
  });

  it('opens action menu and interacts with buttons', async () => {
    renderTable();
    const firstUser = mockUsers[0];
    const menuBtn = screen.getByLabelText(
      new RegExp(`actions for ${firstUser.firstName}`, 'i'),
    );
    fireEvent.click(menuBtn);
    expect(screen.getByText(/edit/i)).toBeInTheDocument();

    const deleteBtn = screen.getByText(/delete/i);
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);
    expect(mockOpenConfirmModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Delete User',
        isCritical: true,
      }),
    );

    // Call the onConfirm callback to verify it triggers deleteUser
    const confirmModalArg = mockOpenConfirmModal.mock.calls[0][0];
    confirmModalArg.onConfirm();
    expect(mockDeleteUser).toHaveBeenCalledWith(firstUser.id);
  });

  it('renders dropdowns for status and role', () => {
    renderTable();
    const statusButtons = screen.getAllByRole('combobox', { name: /status/i });
    const roleButtons = screen.getAllByRole('combobox', { name: /role/i });

    expect(statusButtons.length).toBeGreaterThan(0);
    expect(roleButtons.length).toBeGreaterThan(0);
  });
});
