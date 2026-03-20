import { fireEvent, render, screen } from '@testing-library/react';
import type * as LucideIcons from 'lucide-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
    children: React.ReactNode;
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
  const defaultProps = {
    searchValue: '',
    setSearchValue: vi.fn(),
    statusFilter: 'all',
    setStatusFilter: vi.fn(),
    roleFilter: 'all',
    setRoleFilter: vi.fn(),
    statusOptions: [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
    ],
    roleOptions: [
      { label: 'All Roles', value: 'all' },
      { label: 'Admin', value: 'admin' },
    ],
    onCreateUser: vi.fn(),
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

    expect(defaultProps.setSearchValue).toHaveBeenCalledTimes(1);
    expect(defaultProps.setSearchValue).toHaveBeenCalledWith('test user');
  });

  it('calls onCreateUser when create button is clicked', () => {
    render(<UsersToolbar {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /create user/i }));

    expect(defaultProps.onCreateUser).toHaveBeenCalledTimes(1);
  });

  it('calls setStatusFilter when status dropdown changes', () => {
    render(<UsersToolbar {...defaultProps} />);

    fireEvent.change(screen.getByTestId('dropdown-status'), {
      target: { value: 'active' },
    });

    expect(defaultProps.setStatusFilter).toHaveBeenCalledTimes(1);
    expect(defaultProps.setStatusFilter).toHaveBeenCalledWith('active');
  });

  it('calls setRoleFilter when role dropdown changes', () => {
    render(<UsersToolbar {...defaultProps} />);

    fireEvent.change(screen.getByTestId('dropdown-role'), {
      target: { value: 'admin' },
    });

    expect(defaultProps.setRoleFilter).toHaveBeenCalledTimes(1);
    expect(defaultProps.setRoleFilter).toHaveBeenCalledWith('admin');
  });

  it('uses current selected status value', () => {
    render(<UsersToolbar {...defaultProps} statusFilter="active" />);

    expect(screen.getByTestId('dropdown-status')).toHaveValue('active');
  });

  it('uses current selected role value', () => {
    render(<UsersToolbar {...defaultProps} roleFilter="admin" />);

    expect(screen.getByTestId('dropdown-role')).toHaveValue('admin');
  });

  it('does not fail if onCreateUser is not provided', () => {
    render(<UsersToolbar {...defaultProps} onCreateUser={undefined} />);

    fireEvent.click(screen.getByRole('button', { name: /create user/i }));
  });
});
