import type {
  UserRoleFilter,
  UserStatusFilter,
} from '@/types/admin-user.types';

export const DEFAULT_USER_STATUS_FILTER: UserStatusFilter = 'all';
export const DEFAULT_USER_ROLE_FILTER: UserRoleFilter = 'all';

export const USER_STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'blocked' },
] as const;

export const USER_ROLE_OPTIONS = [
  { label: 'All Roles', value: 'all' },
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Customer', value: 'customer' },
] as const;

export const USER_ROLE_EDIT_OPTIONS = [
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Customer', value: 'CUSTOMER' },
] as const;

export const USER_STATUS_EDIT_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Blocked', value: 'BLOCKED' },
] as const;
