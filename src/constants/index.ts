// TODO: these constants are just placeholders, you can replace them with your own values
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CART: '/cart',
  CONTACT: '/contact-us',
  PRODUCT: '/product/$productId',
} as const;
