import type { ComponentProps, ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import type * as LucideIcons from 'lucide-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_USER_ROLE_FILTER,
  DEFAULT_USER_STATUS_FILTER,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from '@/constants/adminUsers';
import type {
  UserRoleFilter,
  UserStatusFilter,
} from '@/types/admin-user.types';

import { UsersToolbar } from './UsersToolbar';

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof LucideIcons>();

  return {
    ...actual,
    UserPlus: () => <div data-testid="user-plus-icon" />,
  };
});

vi.mock('@/components', () => ({
  Button: ({
    children,
    onClick,
    type,
    className,
  }: {
    children: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
  }) => (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  ),

  SearchInput: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }) => (
    <input
      data-testid="search-input"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ),

  Dropdown: ({
    label,
    options,
    selectedValues,
    onChange,
    placeholder,
  }: {
    label: string;
    options: { label: string; value: string }[];
    selectedValues: string[];
    onChange: (selected: { label: string; value: string }[]) => void;
    placeholder?: string;
  }) => (
    <div>
      <label>{label}</label>
      <select
        aria-label={label}
        data-testid={`dropdown-${label.toLowerCase()}`}
        value={selectedValues[0] ?? ''}
        onChange={(e) => {
          const selectedOption = options.find(
            (option) => option.value === e.target.value,
          );

          onChange(selectedOption ? [selectedOption] : []);
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

describe('UsersToolbar', () => {
  const setSearchValue = vi.fn<(value: string) => void>();
  const setStatusFilter = vi.fn<(value: UserStatusFilter) => void>();
  const setRoleFilter = vi.fn<(value: UserRoleFilter) => void>();
  const onCreateUser = vi.fn<() => void>();

  const defaultProps: ComponentProps<typeof UsersToolbar> = {
    searchValue: '',
    setSearchValue,
    statusFilter: DEFAULT_USER_STATUS_FILTER,
    setStatusFilter,
    roleFilter: DEFAULT_USER_ROLE_FILTER,
    setRoleFilter,
    statusOptions: USER_STATUS_OPTIONS.map((option) => ({ ...option })),
    roleOptions: USER_ROLE_OPTIONS.map((option) => ({ ...option })),
    onCreateUser,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input, create button and both dropdowns', () => {
    render(<UsersToolbar {...defaultProps} />);

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create user/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('user-plus-icon')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-status')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-role')).toBeInTheDocument();
  });

  it('passes searchValue to SearchInput', () => {
    render(<UsersToolbar {...defaultProps} searchValue="john" />);

    expect(screen.getByTestId('search-input')).toHaveValue('john');
  });

  it('calls setSearchValue when typing in search input', () => {
    render(<UsersToolbar {...defaultProps} />);

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'test user' },
    });

    expect(setSearchValue).toHaveBeenCalledTimes(1);
    expect(setSearchValue).toHaveBeenCalledWith('test user');
  });

  it('calls onCreateUser when create button is clicked', () => {
    render(<UsersToolbar {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /create user/i }));

    expect(onCreateUser).toHaveBeenCalledTimes(1);
  });

  it('does not fail if onCreateUser is not provided', () => {
    render(<UsersToolbar {...defaultProps} onCreateUser={undefined} />);

    fireEvent.click(screen.getByRole('button', { name: /create user/i }));
  });

  it('calls setStatusFilter when status dropdown changes', () => {
    render(<UsersToolbar {...defaultProps} />);

    fireEvent.change(screen.getByTestId('dropdown-status'), {
      target: { value: 'active' },
    });

    expect(setStatusFilter).toHaveBeenCalledTimes(1);
    expect(setStatusFilter).toHaveBeenCalledWith('active');
  });

  it('falls back to default status filter when status is cleared', () => {
    render(<UsersToolbar {...defaultProps} statusFilter="active" />);

    fireEvent.change(screen.getByTestId('dropdown-status'), {
      target: { value: '' },
    });

    expect(setStatusFilter).toHaveBeenCalledTimes(1);
    expect(setStatusFilter).toHaveBeenCalledWith(DEFAULT_USER_STATUS_FILTER);
  });

  it('calls setRoleFilter when role dropdown changes', () => {
    render(<UsersToolbar {...defaultProps} />);

    fireEvent.change(screen.getByTestId('dropdown-role'), {
      target: { value: 'admin' },
    });

    expect(setRoleFilter).toHaveBeenCalledTimes(1);
    expect(setRoleFilter).toHaveBeenCalledWith('admin');
  });

  it('falls back to default role filter when role is cleared', () => {
    render(<UsersToolbar {...defaultProps} roleFilter="admin" />);

    fireEvent.change(screen.getByTestId('dropdown-role'), {
      target: { value: '' },
    });

    expect(setRoleFilter).toHaveBeenCalledTimes(1);
    expect(setRoleFilter).toHaveBeenCalledWith(DEFAULT_USER_ROLE_FILTER);
  });

  it('uses current selected status value', () => {
    render(<UsersToolbar {...defaultProps} statusFilter="active" />);

    expect(screen.getByTestId('dropdown-status')).toHaveValue('active');
  });

  it('uses current selected role value', () => {
    render(<UsersToolbar {...defaultProps} roleFilter="admin" />);

    expect(screen.getByTestId('dropdown-role')).toHaveValue('admin');
  });
});
