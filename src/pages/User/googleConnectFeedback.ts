export type GoogleConnectFeedback = {
  kind: 'success' | 'error';
  message: string;
};

export const GOOGLE_CONNECT_FEEDBACK: Record<string, GoogleConnectFeedback> = {
  connected: {
    kind: 'success',
    message: 'Google account connected successfully',
  },
  already_linked: {
    kind: 'error',
    message: 'This Google account is already linked to another user',
  },
  email_mismatch: {
    kind: 'error',
    message: 'Google account email must match your current account email',
  },
  unauthorized: {
    kind: 'error',
    message:
      'Your session expired. Please sign in again and retry Google connect',
  },
  error: {
    kind: 'error',
    message: 'Failed to connect Google account',
  },
};
