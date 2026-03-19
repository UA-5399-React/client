import type { AdminUser } from '@/types/admin-user.types';

export const mockUsers: AdminUser[] = [
  {
    id: '69b93ba7b300b74fd87e6489',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@admin.com',
    role: 'super_admin',
    isActive: true,
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    createdAt: '2026-03-17T11:31:51.737Z',
    updatedAt: '2026-03-17T11:31:51.737Z',
  },
  {
    id: '69b93ba7b300b74fd87e648c',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@admin.com',
    role: 'admin',
    isActive: true,
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    createdAt: '2026-03-17T11:31:51.971Z',
    updatedAt: '2026-03-17T11:31:51.971Z',
  },
  {
    id: '69b93ba8b300b74fd87e6490',
    firstName: 'Test',
    lastName: 'Customer',
    email: 'customer@test.com',
    role: 'customer',
    isActive: true,
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    createdAt: '2026-03-16T10:20:00.000Z',
    updatedAt: '2026-03-16T10:20:00.000Z',
  },
  {
    id: 'u4',
    firstName: 'Andrew',
    lastName: 'Bojangles',
    email: 'example1@gmail.com',
    role: 'admin',
    isActive: true,
    avatarUrl:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop',
    createdAt: '2026-03-15T09:15:00.000Z',
    updatedAt: '2026-03-15T09:15:00.000Z',
  },
  {
    id: 'u5',
    firstName: 'Andrew',
    lastName: 'Bojangles',
    email: 'example2@gmail.com',
    role: 'customer',
    isActive: true,
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    createdAt: '2026-03-14T12:00:00.000Z',
    updatedAt: '2026-03-14T12:00:00.000Z',
  },
  {
    id: 'u6',
    firstName: 'Andrew',
    lastName: 'Bojangles',
    email: 'example3@gmail.com',
    role: 'super_admin',
    isActive: true,
    avatarUrl:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop',
    createdAt: '2026-03-13T08:00:00.000Z',
    updatedAt: '2026-03-13T08:00:00.000Z',
  },
  {
    id: 'u7',
    firstName: 'Andrew',
    lastName: 'Bojangles',
    email: 'example4@gmail.com',
    role: 'admin',
    isActive: true,
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    createdAt: '2026-03-12T14:30:00.000Z',
    updatedAt: '2026-03-12T14:30:00.000Z',
  },
  {
    id: 'u8',
    firstName: 'Andrew',
    lastName: 'Bojangles',
    email: 'example5@gmail.com',
    role: 'customer',
    isActive: false,
    avatarUrl:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=200&h=200&fit=crop',
    createdAt: '2026-03-11T16:45:00.000Z',
    updatedAt: '2026-03-11T16:45:00.000Z',
  },
];
