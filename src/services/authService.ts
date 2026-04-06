import { API_BASE_URL, AUTH_ENDPOINTS, AUTH_MESSAGES } from '@/constants';

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
    const authUrl = new URL(AUTH_ENDPOINTS.GOOGLE, API_URL);

    if (typeof redirectTo === 'string' && redirectTo.startsWith('/')) {
      authUrl.searchParams.set('redirect', redirectTo);
    }

    window.location.assign(authUrl.toString());
  },

  login: async (data: LoginPayload) => {
    const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    return response.json();
  },

  register: async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, AUTH_MESSAGES.CREATE_ACCOUNT_FAILED),
      );
    }

    return response.json();
  },

  confirmEmail: async (token: string): Promise<ConfirmEmailResponse> => {
    const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.CONFIRM_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, AUTH_MESSAGES.CONFIRM_EMAIL_FAILED),
      );
    }

    return response.json();
  },

  getMe: async () => {
    const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.ME}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(AUTH_MESSAGES.FETCH_PROFILE_FAILED);
    }

    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.LOGOUT}`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      console.error(AUTH_MESSAGES.LOGOUT_FAILED);
    }

    return response.ok;
  },
};
