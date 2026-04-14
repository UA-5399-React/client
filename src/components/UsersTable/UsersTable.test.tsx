import { generatePath } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { mockUsers } from '@/constants/mockUsers';
import type { AdminUser } from '@/types/admin-user.types';
import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@/utils/test-utils';

import { UsersTable } from './UsersTable';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  handleUpdate: vi.fn(),
  deleteUser: vi.fn(),
  openConfirmModal: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

vi.mock('@/hooks/useUpdateAdminUser', () => ({
  useUpdateAdminUser: () => ({
    handleUpdate: mocks.handleUpdate,
    isUpdating: false,
  }),
}));

vi.mock('@/hooks/useDeleteAdminUser', () => ({
  useDeleteAdminUser: () => ({
    deleteUser: mocks.deleteUser,
    loading: false,
  }),
}));

vi.mock('@/hooks/useConfirmModal', () => ({
  useConfirmModal: () => ({
    openConfirmModal: mocks.openConfirmModal,
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
  const renderTable = (
    items: AdminUser[] = mockUsers,
    props?: Partial<{
      lastLoginSort: 'asc' | 'desc' | null;
      onLastLoginSortChange: (order: 'asc' | 'desc') => void;
    }>,
  ) =>
    render(
      <UsersTable
        items={items}
        lastLoginSort={props?.lastLoginSort ?? null}
        onLastLoginSortChange={props?.onLastLoginSortChange ?? vi.fn()}
      />,
    );

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.handleUpdate.mockResolvedValue(undefined);
  });

  it('renders "No users found" when list is empty', () => {
    renderTable([]);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('renders user information correctly', () => {
    renderTable();
    const firstUser = mockUsers[0];
    const fullName = `${firstUser.firstName} ${firstUser.lastName}`;
    expect(screen.getAllByText(fullName).length).toBeGreaterThan(0);
    expect(screen.getByText(firstUser.email)).toBeInTheDocument();
  });

  it('renders underscore placeholder when user has no name', () => {
    const noNameUser: AdminUser = {
      id: 'no-name',
      email: 'ghost@example.com',
      role: 'customer',
      isActive: true,
      firstName: '',
      lastName: '   ',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };

    renderTable([noNameUser]);

    expect(screen.getByText('_')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /actions for _/i }),
    ).toBeInTheDocument();
  });

  it('renders column headers', () => {
    renderTable();
    expect(
      screen.getByRole('columnheader', { name: /user/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /^status$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /^email$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /^role$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /activity/i }),
    ).toBeInTheDocument();
  });

  it('toggles activity sort between asc and desc', () => {
    const onLastLoginSortChange = vi.fn();

    const { rerender } = render(
      <UsersTable
        items={mockUsers}
        lastLoginSort={null}
        onLastLoginSortChange={onLastLoginSortChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /activity/i }));
    expect(onLastLoginSortChange).toHaveBeenLastCalledWith('asc');

    rerender(
      <UsersTable
        items={mockUsers}
        lastLoginSort="asc"
        onLastLoginSortChange={onLastLoginSortChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /activity/i }));
    expect(onLastLoginSortChange).toHaveBeenLastCalledWith('desc');

    rerender(
      <UsersTable
        items={mockUsers}
        lastLoginSort="desc"
        onLastLoginSortChange={onLastLoginSortChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /activity/i }));
    expect(onLastLoginSortChange).toHaveBeenLastCalledWith('asc');
  });

  it('opens action menu and confirms delete flow', async () => {
    const user = userEvent.setup();
    renderTable();
    const firstUser = mockUsers[0];
    const fullName = `${firstUser.firstName} ${firstUser.lastName}`;

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`actions for ${fullName}`, 'i'),
      }),
    );

    await user.click(screen.getByRole('button', { name: /^edit$/i }));
    expect(mocks.navigate).toHaveBeenCalledWith(
      generatePath(ROUTES.ADMIN_USER_EDIT, { id: firstUser.id }),
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`actions for ${fullName}`, 'i'),
      }),
    );
    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    expect(mocks.openConfirmModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Delete User',
        description: 'Are you sure you want to delete this user?',
        isCritical: true,
        confirmText: 'Delete',
      }),
    );

    const confirmModalArg = mocks.openConfirmModal.mock.calls[0][0];
    confirmModalArg.onConfirm();
    expect(mocks.deleteUser).toHaveBeenCalledWith(firstUser.id);
  }, 10000);

  it('renders dropdowns for status and role', () => {
    renderTable();
    const statusButtons = screen.getAllByRole('combobox', { name: /status/i });
    const roleButtons = screen.getAllByRole('combobox', { name: /role/i });

    expect(statusButtons.length).toBeGreaterThan(0);
    expect(roleButtons.length).toBeGreaterThan(0);
  });

  it('calls handleUpdate when status changes to blocked', async () => {
    const user = userEvent.setup();
    const activeUser: AdminUser = {
      id: 'active-only',
      firstName: 'Active',
      lastName: 'User',
      email: 'active@example.com',
      role: 'customer',
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };

    renderTable([activeUser]);

    const [statusSelect] = screen.getAllByRole('combobox', { name: /status/i });
    await user.click(statusSelect);
    await user.click(await screen.findByRole('option', { name: /^blocked$/i }));

    await waitFor(() => {
      expect(mocks.handleUpdate).toHaveBeenCalledWith('active-only', {
        isActive: false,
      });
    });
  });

  it('calls handleUpdate when role changes', async () => {
    const user = userEvent.setup();
    const customer: AdminUser = {
      id: 'cust-1',
      firstName: 'Pat',
      lastName: 'Lee',
      email: 'pat@example.com',
      role: 'customer',
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };

    renderTable([customer]);

    const [roleSelect] = screen.getAllByRole('combobox', { name: /role/i });
    await user.click(roleSelect);
    await user.click(await screen.findByRole('option', { name: /^admin$/i }));

    await waitFor(() => {
      expect(mocks.handleUpdate).toHaveBeenCalledWith('cust-1', {
        role: 'ADMIN',
      });
    });
  });

  describe('activity labels', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('shows Never when lastLoginAt is missing', () => {
      renderTable([mockUsers[0]]);
      expect(screen.getAllByText('Never').length).toBeGreaterThan(0);
    });

    it('shows Today, Yesterday, and day count from lastLoginAt', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));

      const base: Omit<AdminUser, 'lastLoginAt'> = {
        id: 'a1',
        firstName: 'A',
        lastName: 'One',
        email: 'a1@example.com',
        role: 'customer',
        isActive: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      };

      const rows: AdminUser[] = [
        { ...base, id: 't1', lastLoginAt: '2026-06-15T08:00:00.000Z' },
        { ...base, id: 't2', lastLoginAt: '2026-06-14T08:00:00.000Z' },
        { ...base, id: 't3', lastLoginAt: '2026-06-10T08:00:00.000Z' },
      ];

      renderTable(rows);

      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('Yesterday')).toBeInTheDocument();
      expect(screen.getByText('5 days ago')).toBeInTheDocument();
    });

    it('shows Unknown for invalid lastLoginAt', () => {
      renderTable([
        {
          id: 'bad-date',
          firstName: 'Bad',
          lastName: 'Date',
          email: 'bad@example.com',
          role: 'customer',
          isActive: true,
          lastLoginAt: 'not-a-date',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ]);

      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });
});
