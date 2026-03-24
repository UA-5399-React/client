import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { AccountDetailsForm, AccountSidebar, PasswordForm } from '@/components';
import { ROUTES } from '@/constants';
import { authService } from '@/services';
import { usersService } from '@/services/users.service';
import type { User } from '@/types/user';

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
};

export function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
    },
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await usersService.getMe();
        setUser(currentUser);

        reset({
          firstName: currentUser.firstName ?? '',
          lastName: currentUser.lastName ?? '',
          oldPassword: '',
          newPassword: '',
          repeatPassword: '',
        });
      } catch (err) {
        setPageError(
          err instanceof Error ? err.message : 'Failed to load profile',
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadUser();
  }, [reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      setIsSaving(true);
      setSubmitError('');
      setSuccessMessage('');

      const profileChanged =
        values.firstName !== (user.firstName ?? '') ||
        values.lastName !== (user.lastName ?? '');

      const hasAnyPasswordValue =
        values.oldPassword.trim() !== '' ||
        values.newPassword.trim() !== '' ||
        values.repeatPassword.trim() !== '';

      if (!profileChanged && !hasAnyPasswordValue) {
        throw new Error('No changes to save');
      }

      let updatedUser = user;

      if (profileChanged) {
        await usersService.updateMe({
          firstName: values.firstName,
          lastName: values.lastName,
        });

        updatedUser = await usersService.getMe();
        setUser(updatedUser);
      }

      if (hasAnyPasswordValue) {
        await usersService.changePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        });
      }

      reset({
        firstName: updatedUser.firstName ?? values.firstName,
        lastName: updatedUser.lastName ?? values.lastName,
        oldPassword: '',
        newPassword: '',
        repeatPassword: '',
      });

      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to update profile',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();

      localStorage.removeItem('token');
      localStorage.removeItem('token_expires');
      localStorage.removeItem('role');
      localStorage.removeItem('user');

      setUser(null);
      setPageError('');
      setSubmitError('');
      setSuccessMessage('');

      reset({
        firstName: '',
        lastName: '',
        oldPassword: '',
        newPassword: '',
        repeatPassword: '',
      });

      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  if (pageError) {
    return (
      <div className="p-10 text-[rgb(var(--color-red-600))]">{pageError}</div>
    );
  }

  if (!user) {
    return <div className="p-10">User not found</div>;
  }

  return (
    <section className="min-h-screen bg-white px-4 md:px-8 lg:px-40">
      <h1 className="mt-10 mb-16 text-center text-[54px] leading-none font-semibold text-black">
        My Account
      </h1>

      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
          <AccountSidebar user={user} onLogout={handleLogout} />

          <div className="max-w-[760px] px-[72px]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AccountDetailsForm
                user={user}
                control={control}
                errors={errors}
              />

              <PasswordForm control={control} errors={errors} />

              <button
                type="submit"
                disabled={isSaving}
                className="mt-6 h-[44px] min-w-[90px] cursor-pointer rounded-md bg-black px-6 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>

              {submitError && (
                <p className="mt-3 text-sm text-[rgb(var(--color-red-600))]">
                  {submitError}
                </p>
              )}

              {successMessage && (
                <p className="mt-3 text-sm text-[rgb(var(--color-green-600))]">
                  {successMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
