import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import googleIcon from '@/assets/icons/google-icon.webp';
import { AccountDetailsForm, PasswordForm } from '@/components';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useMe } from '@/hooks/useMe';
import { queryClient } from '@/lib';
import { GOOGLE_CONNECT_FEEDBACK } from '@/pages/User/googleConnectFeedback';
import {
  type ProfileFormValues,
  profileSchema,
} from '@/schemas/profile.schema';
import { authService } from '@/services/authService';
import { usersService } from '@/services/users.service';
import { useErrorStore } from '@/store/errorStore';
import { clearAuthStorage } from '@/utils/auth-storage';
import { EMPTY_FORM_VALUES, getFormValuesFromUser } from '@/utils/profile-form';

export function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuth } = useAuth();

  const { data: user, isPending: isLoadingUser, isError } = useMe(isAuth);

  const [isSaving, setIsSaving] = useState(false);
  const [isDisconnectingGoogle, setIsDisconnectingGoogle] = useState(false);

  const showMessage = useErrorStore((s) => s.show);

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

    reset(EMPTY_FORM_VALUES);
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate, reset]);

  useEffect(() => {
    if (!user) return;
    reset(getFormValuesFromUser(user));
  }, [reset, user]);

  useEffect(() => {
    const googleStatus = searchParams.get('google');

    if (!googleStatus) {
      return;
    }

    const feedback = GOOGLE_CONNECT_FEEDBACK[googleStatus];

    if (feedback) {
      if (feedback.kind === 'success') {
        void usersService.getMe().then((user) => {
          queryClient.setQueryData(['me'], user);
          reset(getFormValuesFromUser(user));
        });

        showMessage('success', 'Google account connected', feedback.message);
      } else {
        showMessage(
          'error',
          'Google account connection failed',
          feedback.message,
        );
      }
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('google');
    setSearchParams(nextSearchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      setIsSaving(true);

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
        queryClient.setQueryData(['me'], updatedUser);
      }

      if (hasAnyPasswordValue) {
        await usersService.changePassword({
          oldPassword: values.oldPassword.trim(),
          newPassword: values.newPassword.trim(),
        });
      }

      reset(getFormValuesFromUser(updatedUser));

      if (profileChanged && hasAnyPasswordValue) {
        showMessage(
          'success',
          'Profile and password updated',
          'Profile and password updated successfully',
        );
      } else if (profileChanged) {
        showMessage(
          'success',
          'Profile updated',
          'Profile updated successfully',
        );
      } else {
        showMessage(
          'success',
          'Password updated',
          'Password updated successfully',
        );
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        handleUnauthorized();
        return;
      }

      showMessage(
        'error',
        'Failed to update profile',
        err instanceof Error ? err.message : 'Failed to update profile',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
  };

  const handleGoogleConnect = () => {
    authService.startGoogleConnect();
  };

  const handleGoogleDisconnect = async () => {
    if (!user) return;

    try {
      setIsDisconnectingGoogle(true);

      await authService.disconnectGoogle();

      const updatedUser = await usersService.getMe();
      queryClient.setQueryData(['me'], updatedUser);

      showMessage(
        'success',
        'Google account disconnected',
        'Google account disconnected successfully',
      );
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

      showMessage('error', 'Failed to disconnect Google account', errorMessage);
    } finally {
      setIsDisconnectingGoogle(false);
    }
  };

  if (isLoadingUser) {
    return <div className="bg-background text-text p-10">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="bg-background p-10 text-red-600">
        Error loading profile
      </div>
    );
  }

  if (!user) {
    return <div className="bg-background text-text p-10">User not found</div>;
  }

  return (
    <section>
      <div className="w-full max-w-[760px] px-5 pb-7 md:px-8 lg:px-[72px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AccountDetailsForm user={user} control={control} errors={errors} />

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

          <div className="mt-6 flex flex-col gap-6 px-7 md:flex-row md:items-center lg:px-0">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-text text-background h-[44px] w-[183px] cursor-pointer rounded-md px-6 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="text-text border-text hover:bg-backgroundSec h-[44px] w-[131px] rounded-md border-2 bg-transparent text-sm font-medium transition md:hidden"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
