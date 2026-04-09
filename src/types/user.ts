export type User = {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  isEmailConfirmed: boolean;
  isGoogleConnected?: boolean;
};
