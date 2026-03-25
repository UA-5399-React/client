import { API_BASE_URL } from '@/constants';

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
  ): Promise<CheckoutSessionResponse> {
    const response = await fetch(
      `${API_BASE_URL}/payments/create-checkout-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ items }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getSessionStatus(sessionId: string): Promise<SessionStatusResponse> {
    return apiClient.get<SessionStatusResponse>(
      `/payments/session/${sessionId}`,
    );
  },
};
