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
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTING: '/admin/setting',
  ADMIN_PRODUCT_CREATE: '/admin/products/create',
  ADMIN_PRODUCT_EDIT: '/admin/products/:id',
  BLOG: '/blog',
  ADMIN_LOGIN: '/admin/login',
  REGISTER: '/register',
  ADMIN_CATEGORY_ADD: '/admin/categories/add',
  ADMIN_CATEGORY_EDIT: '/admin/categories/edit/:id',
  ADMIN_ORDERS: '/admin/orders',
  PROFILE: '/profile',
} as const;

export const DEFAULT_FILTER: ProductsFilters = {
  categories: [],
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
  CUSTOMER: 'customer',
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
} as const;

export type AuthRole = (typeof AUTH_ROLES)[keyof typeof AUTH_ROLES];

export const ADMIN_PAGE_LIMIT = 10;
export const NEW_ARRIVALS_LIMIT = 10;

export const ITEMS_PER_PAGE = 10;

export * from './theme';
