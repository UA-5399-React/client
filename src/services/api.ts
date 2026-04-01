import { API_BASE_URL, MOCK_AUTH } from '../constants';

interface FetchOptions extends RequestInit {
  params?: Record<
    string,
    string | number | boolean | Array<string | number | boolean> | undefined
  >;
}

let refreshPromise: Promise<boolean> | null = null;

const buildUrl = (
  endpoint: string,
  params?: Record<string, unknown>,
): string => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            url.searchParams.append(key, String(item));
          });
          return;
        }

        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

const clearClientAuthState = () => {
  localStorage.removeItem(MOCK_AUTH.TOKEN_KEY);
  localStorage.removeItem(MOCK_AUTH.EXPIRES_KEY);
  localStorage.removeItem(MOCK_AUTH.ROLE_KEY);
};

const refreshAuthSession = async (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const shouldAttemptRefresh = (endpoint: string, response: Response) =>
  response.status === 401 && !endpoint.startsWith('/auth/');
/**
 * Base API client configuration
 */
export const apiClient = {
  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const url = buildUrl(endpoint, options?.params);

    let response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      ...options,
    });

    if (shouldAttemptRefresh(endpoint, response)) {
      const refreshed = await refreshAuthSession();

      if (refreshed) {
        response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          ...options,
        });
      } else {
        clearClientAuthState();
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (shouldAttemptRefresh(endpoint, response)) {
      const refreshed = await refreshAuthSession();

      if (refreshed) {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
      } else {
        clearClientAuthState();
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (shouldAttemptRefresh(endpoint, response)) {
      const refreshed = await refreshAuthSession();

      if (refreshed) {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
      } else {
        clearClientAuthState();
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (shouldAttemptRefresh(endpoint, response)) {
      const refreshed = await refreshAuthSession();

      if (refreshed) {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } else {
        clearClientAuthState();
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};
