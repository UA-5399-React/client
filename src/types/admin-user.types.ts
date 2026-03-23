export type UserRole = 'super_admin' | 'admin' | 'customer';

export type UserStatusFilter = 'all' | 'active' | 'blocked';
export type UserRoleFilter = 'all' | UserRole;

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}
