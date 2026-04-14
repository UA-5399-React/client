import { API_BASE_URL, AUTH_ENDPOINTS, AUTH_MESSAGES } from '@/constants';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
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

export interface ResendConfirmationResponse {
  message: string;
}

export interface RequestPasswordResetResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

const API_URL = API_BASE_URL;

type ErrorResponseData = {
  code?: string;
  message?: string | string[];
};

export class AuthApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'AuthApiError';
    this.code = code;
  }
}

const redirectToAuthEndpoint = (endpoint: string, redirectTo?: string) => {
  const authUrl = new URL(endpoint, API_URL);

  if (typeof redirectTo === 'string' && redirectTo.startsWith('/')) {
    authUrl.searchParams.set('redirect', redirectTo);
  }

  window.location.assign(authUrl.toString());
};

const getErrorData = async (
  response: Response,
  fallbackMessage: string,
): Promise<{ code?: string; message: string }> => {
  try {
    const errorData = (await response.json()) as ErrorResponseData;
    const message = Array.isArray(errorData.message)
      ? errorData.message[0]
      : errorData.message;

    return {
      code: errorData.code,
      message: typeof message === 'string' ? message : fallbackMessage,
    };
  } catch {
    return { message: fallbackMessage };
  }
};

export const authService = {
  startGoogleAuth: (redirectTo?: string) => {
    redirectToAuthEndpoint(AUTH_ENDPOINTS.GOOGLE, redirectTo);
  },

  startGoogleConnect: () => {
    redirectToAuthEndpoint(AUTH_ENDPOINTS.GOOGLE_CONNECT);
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
      const errorData = await getErrorData(
        response,
        AUTH_MESSAGES.INVALID_CREDENTIALS,
      );
      throw new AuthApiError(errorData.message, errorData.code);
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
      const errorData = await getErrorData(
        response,
        AUTH_MESSAGES.CREATE_ACCOUNT_FAILED,
      );
      throw new AuthApiError(errorData.message, errorData.code);
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
      const errorData = await getErrorData(
        response,
        AUTH_MESSAGES.CONFIRM_EMAIL_FAILED,
      );
      throw new AuthApiError(errorData.message, errorData.code);
    }

    return response.json();
  },

  resendConfirmation: async (
    email: string,
  ): Promise<ResendConfirmationResponse> => {
    const response = await fetch(
      `${API_URL}${AUTH_ENDPOINTS.RESEND_CONFIRMATION}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      },
    );

    if (!response.ok) {
      const errorData = await getErrorData(
        response,
        AUTH_MESSAGES.RESEND_CONFIRMATION_FAILED,
      );
      throw new AuthApiError(errorData.message, errorData.code);
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

  disconnectGoogle: async (): Promise<{ success: true }> => {
    const response = await fetch(
      `${API_URL}${AUTH_ENDPOINTS.GOOGLE_DISCONNECT}`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );

    if (!response.ok) {
      const errorData = await getErrorData(
        response,
        AUTH_MESSAGES.GOOGLE_DISCONNECT_FAILED,
      );
      throw new AuthApiError(errorData.message, errorData.code);
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

  requestPasswordReset: async (
    email: string,
  ): Promise<RequestPasswordResetResponse> => {
    const response = await fetch(
      `${API_URL}${AUTH_ENDPOINTS.RESET_PASSWORD_REQUEST}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      },
    );

    if (!response.ok) {
      const errorData = await getErrorData(
        response,
        AUTH_MESSAGES.RESET_PASSWORD_REQUEST_FAILED,
      );
      throw new AuthApiError(errorData.message, errorData.code);
    }

    return response.json();
  },

  resetPassword: async (
    token: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<ResetPasswordResponse> => {
    const url = new URL(`${API_URL}${AUTH_ENDPOINTS.RESET_PASSWORD_CONFIRM}`);
    url.searchParams.set('token', token);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, passwordConfirmation }),
    });

    if (!response.ok) {
      const errorData = await getErrorData(
        response,
        AUTH_MESSAGES.RESET_PASSWORD_FAILED,
      );
      throw new AuthApiError(errorData.message, errorData.code);
    }

    return response.json();
  },
};
