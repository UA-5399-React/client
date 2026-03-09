import type { ProductsFilters } from '@/types/filters';

// TODO: these constants are just placeholders, you can replace them with your own values
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT: '/product/:id',
  CONTACT_US: '/contact',
  LOGIN: '/login',
  CART: '/cart',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_SETTING: '/admin/setting',
  ADMIN_PRODUCT_CREATE: '/admin/products/create',
  ADMIN_PRODUCT_EDIT: '/admin/products/:id',
  BLOG: '/blog',
  ADMIN_LOGIN: '/admin/login',
} as const;

export const DEFAULT_FILTER: ProductsFilters = {
  tags: [],
  minPrice: '',
  maxPrice: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  dateField: 'createdAt',
};
export const MOCK_AUTH = {
  ADMIN_EMAIL: 'admin@gmail.com',
  ADMIN_PASSWORD: 'admin123',
  TOKEN_KEY: 'token',
  EXPIRES_KEY: 'token_expires',
  ROLE_KEY: 'role',
  MOCK_TOKEN: 'mock-jwt-token',
};

export const AUTH_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export * from './theme';
