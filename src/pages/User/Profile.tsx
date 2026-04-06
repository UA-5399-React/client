import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';

import { AccountDetailsForm, AccountSidebar, PasswordForm } from '@/components';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import {
  type ProfileFormValues,
  profileSchema,
} from '@/schemas/profile.schema';
import { usersService } from '@/services/users.service';
import type { User } from '@/types/user';
import { clearAuthStorage } from '@/utils/auth-storage';
import { EMPTY_FORM_VALUES, getFormValuesFromUser } from '@/utils/profile-form';

export function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
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

  // Autoclear success messages
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // Autoclear error messages
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

  const handleCancel = () => {
    reset(); // react-hook-form
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
    <section className="bg-background text-text min-h-screen px-8 lg:px-40">
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

          <div className="w-full max-w-[760px] px-5 md:px-8 lg:px-[72px]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AccountDetailsForm
                user={user}
                control={control}
                errors={errors}
              />

              <PasswordForm control={control} errors={errors} />

              <div className="mt-6 flex flex-col gap-6 px-5 md:flex-row md:items-center lg:px-0">
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

              {submitError && (
                <p className="mt-3 text-sm text-red-600">{submitError}</p>
              )}

              {successMessage && (
                <p className="mt-3 text-sm text-green-600">{successMessage}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
