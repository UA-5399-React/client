import type { AuthRole } from '@/constants';

export type UserRole = AuthRole;
export type UserRoleValue = Uppercase<UserRole>;
export type UserRoleResponse = UserRole | UserRoleValue;

export type UserStatusFilter = 'all' | 'active' | 'blocked';
export type UserRoleFilter = 'all' | UserRole;

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoleResponse;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AdminUserDetails extends AdminUser {
  phone?: string;
  isEmailConfirmed: boolean;
}

export interface CreateAdminUserInput {
  email: string;
  password?: string;
  role: UserRoleValue;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface UpdateUserInput {
  id: string;
  role?: UserRoleValue;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: UserRoleValue;
  imagePreview: string | null;
  imageFile?: File;
}

export interface CreateUserPayload {
  user: AdminUserDetails;
  tempPassword?: string | null;
}
