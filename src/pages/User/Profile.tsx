import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { AccountDetailsForm, AccountSidebar, PasswordForm } from '@/components';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import {
  type ProfileFormValues,
  profileSchema,
} from '@/schemas/profile.schema';
import { UnauthorizedError, usersService } from '@/services/users.service';
import type { User } from '@/types/user';
import { clearAuthStorage } from '@/utils/auth-storage';

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
    defaultValues: {
      firstName: '',
      lastName: '',
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
    },
  });

  const handleUnauthorized = () => {
    clearAuthStorage();
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

    navigate(ROUTES.LOGIN, { replace: true });
  };

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
        if (err instanceof UnauthorizedError) {
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
  }, [navigate, reset, handleUnauthorized]);

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
      if (err instanceof UnauthorizedError) {
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

      reset({
        firstName: updatedUser.firstName ?? normalizedFirstName,
        lastName: updatedUser.lastName ?? normalizedLastName,
        oldPassword: '',
        newPassword: '',
        repeatPassword: '',
      });

      if (profileChanged && hasAnyPasswordValue) {
        setSuccessMessage('Profile and password updated successfully');
      } else if (profileChanged) {
        setSuccessMessage('Profile updated successfully');
      } else {
        setSuccessMessage('Password updated successfully');
      }
    } catch (err) {
      if (err instanceof UnauthorizedError) {
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
    <section className="bg-background text-text min-h-screen px-4 md:px-8 lg:px-40">
      <h1 className="text-text mt-10 mb-16 text-center text-[54px] leading-none font-semibold">
        My Account
      </h1>

      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
          <AccountSidebar
            user={user}
            onAvatarClick={handleAvatarUpload}
            onLogout={handleLogout}
            isAvatarUploading={isAvatarUploading}
          />

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
                className="bg-text text-background mt-6 h-[44px] min-w-[90px] cursor-pointer rounded-md px-6 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>

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
