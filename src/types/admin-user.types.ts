export type UserRole = 'super_admin' | 'admin' | 'customer';

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
