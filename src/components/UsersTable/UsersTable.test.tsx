import type { HTMLAttributes } from 'react';
import * as ApolloTesting from '@apollo/client/testing';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type * as LucideIcons from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { mockUsers } from '@/constants/mockUsers';

import { UsersTable } from './UsersTable';

const { MockedProvider } = ApolloTesting as unknown as {
  MockedProvider: React.ComponentType<{
    mocks?: readonly unknown[];
    addTypename?: boolean;
    children?: React.ReactNode;
  }>;
};

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof LucideIcons>();

  return {
    ...actual,
    EllipsisVertical: (props: HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="ellipsis" {...props} />
    ),
    Pencil: (props: HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="pencil" {...props} />
    ),
    Trash: (props: HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="trash" {...props} />
    ),
  };
});

describe('UsersTable', () => {
  const renderWithApollo = (ui: React.ReactElement) => {
    return render(
      <MockedProvider mocks={[]} addTypename={false}>
        {ui}
      </MockedProvider>,
    );
  };

  it('renders "No users found" when list is empty', () => {
    renderWithApollo(<UsersTable items={[]} />);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('renders user information correctly', () => {
    renderWithApollo(<UsersTable items={mockUsers} />);
    const firstUser = mockUsers[0];
    const fullName = `${firstUser.firstName} ${firstUser.lastName}`;

    const avatar = screen.getByRole('img', { name: fullName });
    expect(avatar).toBeInTheDocument();

    const row = avatar.closest('tr');
    expect(row).not.toBeNull();

    expect(
      within(row as HTMLTableRowElement).getByText(firstUser.email),
    ).toBeInTheDocument();
  });

  it('opens action menu and interacts with buttons', () => {
    renderWithApollo(<UsersTable items={mockUsers} />);
    const firstUser = mockUsers[0];
    const menuBtn = screen.getByLabelText(
      new RegExp(`actions for ${firstUser.firstName}`, 'i'),
    );

    fireEvent.click(menuBtn);

    const editBtn = screen.getByText(/edit/i);
    const deleteBtn = screen.getByText(/delete/i);

    expect(editBtn).toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(editBtn);
  });

  it('renders dropdowns for status and role', () => {
    renderWithApollo(<UsersTable items={mockUsers} />);
    const statusButtons = screen.getAllByRole('combobox', { name: /status/i });
    const roleButtons = screen.getAllByRole('combobox', { name: /role/i });

    expect(statusButtons.length).toBeGreaterThan(0);
    expect(roleButtons.length).toBeGreaterThan(0);
  }, 10_000);
});
