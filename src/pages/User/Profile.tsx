import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';

import googleIcon from '@/assets/icons/google-icon.webp';
import { AccountDetailsForm, AccountSidebar, PasswordForm } from '@/components';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { GOOGLE_CONNECT_FEEDBACK } from '@/pages/User/googleConnectFeedback';
import {
  type ProfileFormValues,
  profileSchema,
} from '@/schemas/profile.schema';
import { authService } from '@/services/authService';
import { usersService } from '@/services/users.service';
import type { User } from '@/types/user';
import { clearAuthStorage } from '@/utils/auth-storage';
import { EMPTY_FORM_VALUES, getFormValuesFromUser } from '@/utils/profile-form';

export function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isDisconnectingGoogle, setIsDisconnectingGoogle] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: EMPTY_FORM_VALUES,
  });

  const handleUnauthorized = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    setPageError('');
    setSubmitError('');
    setSuccessMessage('');
    reset(EMPTY_FORM_VALUES);
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate, reset]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await usersService.getMe();
        setUser(currentUser);
        reset(getFormValuesFromUser(currentUser));
      } catch (err) {
        if (err instanceof Error && err.message.includes('401')) {
          handleUnauthorized();
          return;
        }
        setPageError(
          err instanceof Error ? err.message : 'Failed to load profile',
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadUser();
  }, [reset, handleUnauthorized]);

  useEffect(() => {
    const googleStatus = searchParams.get('google');

    if (!googleStatus) {
      return;
    }

    const feedback = GOOGLE_CONNECT_FEEDBACK[googleStatus];

    setSubmitError('');
    setSuccessMessage('');

    if (feedback) {
      if (feedback.kind === 'success') {
        setSuccessMessage(feedback.message);
      } else {
        setSubmitError(feedback.message);
      }
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('google');
    setSearchParams(nextSearchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Autoclear messages
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (!submitError) return;
    const timer = setTimeout(() => {
      setSubmitError('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [submitError]);

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    try {
      setIsAvatarUploading(true);
      setSubmitError('');
      setSuccessMessage('');

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, and WEBP files are allowed');
      }

      if (file.size > maxSize) {
        throw new Error('Maximum file size is 5 MB');
      }

      const updatedUser = await usersService.uploadAvatar(file);
      setUser(updatedUser);
      setSuccessMessage('Avatar updated successfully');
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        handleUnauthorized();
        return;
      }

      setSubmitError(
        err instanceof Error ? err.message : 'Failed to upload avatar',
      );
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      setIsSaving(true);
      setSubmitError('');
      setSuccessMessage('');

      const normalizedFirstName = values.firstName.trim();
      const normalizedLastName = values.lastName.trim();

      const profileChanged =
        normalizedFirstName !== (user.firstName ?? '') ||
        normalizedLastName !== (user.lastName ?? '');

      const hasAnyPasswordValue =
        values.oldPassword.trim() !== '' ||
        values.newPassword.trim() !== '' ||
        values.repeatPassword.trim() !== '';

      if (!profileChanged && !hasAnyPasswordValue) {
        return;
      }

      let updatedUser = user;

      if (profileChanged) {
        await usersService.updateMe({
          firstName: normalizedFirstName,
          lastName: normalizedLastName,
        });

        updatedUser = await usersService.getMe();
        setUser(updatedUser);
      }

      if (hasAnyPasswordValue) {
        await usersService.changePassword({
          oldPassword: values.oldPassword.trim(),
          newPassword: values.newPassword.trim(),
        });
      }

      reset(getFormValuesFromUser(updatedUser));

      if (profileChanged && hasAnyPasswordValue) {
        setSuccessMessage('Profile and password updated successfully');
      } else if (profileChanged) {
        setSuccessMessage('Profile updated successfully');
      } else {
        setSuccessMessage('Password updated successfully');
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        handleUnauthorized();
        return;
      }

      setSubmitError(
        err instanceof Error ? err.message : 'Failed to update profile',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME, { replace: true });
  };

  const handleGoogleConnect = () => {
    setSubmitError('');
    setSuccessMessage('');
    authService.startGoogleConnect();
  };

  const handleGoogleDisconnect = async () => {
    if (!user) return;

    try {
      setIsDisconnectingGoogle(true);
      setSubmitError('');
      setSuccessMessage('');

      await authService.disconnectGoogle();

      const updatedUser = await usersService.getMe();
      setUser(updatedUser);
      setSuccessMessage('Google account disconnected successfully');
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        handleUnauthorized();
        return;
      }

      let errorMessage = 'Failed to disconnect Google account';

      if (err instanceof Error) {
        errorMessage = err.message;

        if (
          err.message === 'You must set a password before disconnecting Google'
        ) {
          errorMessage =
            'This account uses Google as the only sign-in method, so Google disconnect is unavailable.';
        }
      }

      setSubmitError(errorMessage);
    } finally {
      setIsDisconnectingGoogle(false);
    }
  };

  if (isLoading) {
    return <div className="bg-background text-text p-10">Loading...</div>;
  }

  if (pageError) {
    return <div className="bg-background p-10 text-red-600">{pageError}</div>;
  }

  if (!user) {
    return <div className="bg-background text-text p-10">User not found</div>;
  }

  return (
    <section className="bg-background text-text min-h-screen px-8 lg:px-40 lg:pb-20">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-muted mt-4 mb-6 flex items-center gap-2 border-none bg-transparent text-[16px] font-medium transition md:hidden"
      >
        <ChevronLeft size={20} />
        back
      </button>

      <h1 className="text-text mt-10 mb-16 text-center text-[40px] leading-none font-semibold md:text-[54px]">
        My Account
      </h1>

      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 justify-items-center gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:justify-items-stretch">
          <AccountSidebar
            user={user}
            onAvatarClick={handleAvatarUpload}
            onLogout={handleLogout}
            isAvatarUploading={isAvatarUploading}
          />

          <div className="w-full max-w-[760px] px-5 pb-7 md:px-8 lg:px-[72px]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AccountDetailsForm
                user={user}
                control={control}
                errors={errors}
              />

              <section className="mt-10 px-7 lg:px-0">
                <h2 className="text-text mt-0 mb-6 text-[20px] font-semibold">
                  Google Account
                </h2>

                <p className="text-muted text-sm leading-6">
                  {user.isGoogleConnected
                    ? 'Your Google account is connected and can be used for future sign-ins.'
                    : 'Connect your Google account to use it for future sign-ins.'}
                </p>

                <div className="flex flex-wrap gap-3">
                  {user.isGoogleConnected ? (
                    <button
                      type="button"
                      onClick={handleGoogleDisconnect}
                      disabled={isDisconnectingGoogle}
                      className="hover:bg-background h-[44px] min-w-[183px] cursor-pointer rounded-md border border-red-600 bg-transparent px-6 text-sm font-semibold text-red-600 transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="flex items-center gap-3">
                        <img
                          src={googleIcon}
                          alt="google"
                          aria-hidden="true"
                          className="h-5 w-5 rounded-sm bg-white/90 p-0.5"
                        />
                        <span>
                          {isDisconnectingGoogle
                            ? 'Disconnecting...'
                            : 'Disconnect Google'}
                        </span>
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGoogleConnect}
                      className="bg-primary text-background h-[44px] min-w-[220px] cursor-pointer rounded-md border-0 px-6 text-sm font-semibold transition hover:opacity-90"
                    >
                      <span className="flex items-center gap-3">
                        <img
                          src={googleIcon}
                          alt="google"
                          aria-hidden="true"
                          className="h-5 w-5 rounded-sm bg-white/90 p-0.5"
                        />
                        <span>Connect Google account</span>
                      </span>
                    </button>
                  )}
                </div>
              </section>

              <PasswordForm control={control} errors={errors} />

              <div className="mt-6 flex flex-col gap-6 px-5 md:flex-row md:items-center lg:px-0">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-text text-background h-[44px] min-w-[183px] cursor-pointer rounded-md border-0 px-6 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save changes'}
                </button>
              </div>

              {successMessage && (
                <div className="mt-6 w-[280px] rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800 lg:w-[675px] dark:border-green-700 dark:bg-green-900 dark:text-green-300">
                  {successMessage}
                </div>
              )}

              {submitError && (
                <div className="mt-6 w-[280px] rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800 lg:w-[675px] dark:border-red-700 dark:bg-red-900 dark:text-red-300">
                  {submitError}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
