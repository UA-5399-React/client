import { apiClient } from './api';

export interface CheckoutItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
}

export interface SessionStatusResponse {
  status: string;
  paymentStatus: string;
}

export const paymentService = {
  async createCheckoutSession(
    items: CheckoutItem[],
    orderId?: string,
  ): Promise<CheckoutSessionResponse> {
    return apiClient.post<CheckoutSessionResponse>(
      '/payments/create-checkout-session',
      { items, orderId },
    );
  },

  getSessionStatus(sessionId: string): Promise<SessionStatusResponse> {
    return apiClient.get<SessionStatusResponse>(
      `/payments/session/${sessionId}`,
    );
  },
};
