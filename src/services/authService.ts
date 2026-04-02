import { API_BASE_URL } from '@/constants';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
}

export interface ConfirmEmailResponse {
  message: string;
}

const API_URL = API_BASE_URL;
const GOOGLE_AUTH_PATH = '/auth/google';

const getErrorMessage = async (response: Response, fallbackMessage: string) => {
  try {
    const errorData = (await response.json()) as {
      message?: string | string[];
    };

    if (Array.isArray(errorData.message)) {
      return errorData.message[0] ?? fallbackMessage;
    }

    if (typeof errorData.message === 'string') {
      return errorData.message;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
};

export const authService = {
  startGoogleAuth: (redirectTo?: string) => {
    const authUrl = new URL(GOOGLE_AUTH_PATH, API_URL);

    if (typeof redirectTo === 'string' && redirectTo.startsWith('/')) {
      authUrl.searchParams.set('redirect', redirectTo);
    }

    window.location.assign(authUrl.toString());
  },

  login: async (data: LoginPayload) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Invalid email or password');
    }

    return response.json();
  },

  register: async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, 'Failed to create account'),
      );
    }

    return response.json();
  },

  confirmEmail: async (token: string): Promise<ConfirmEmailResponse> => {
    const response = await fetch(`${API_URL}/auth/confirm-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, 'Failed to confirm email'),
      );
    }

    return response.json();
  },

  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Failed to logout on server');
    }

    return response.ok;
  },
};
