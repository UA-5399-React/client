import type { AuthRole } from '@/constants';

export type UserRole = AuthRole;

export type UserStatusFilter = 'all' | 'active' | 'blocked';
export type UserRoleFilter = 'all' | UserRole;

export interface AdminUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}
export interface UpdateUserInput {
  id: string;
  role?: UserRole;
  isActive?: boolean;
}
