import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AccountSidebar } from '@/components';
import { AccountDetailsForm } from '@/components';
import { PasswordForm } from '@/components';
import { ROUTES } from '@/constants';
import { authService } from '@/services';
import { usersService } from '@/services/users.service';
import type { User } from '@/types/user';

export function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();

      localStorage.removeItem('token');
      localStorage.removeItem('token_expires');
      localStorage.removeItem('role');
      localStorage.removeItem('user');

      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await usersService.getMe();
        setUser(data);
        setFirstName(data.firstName ?? '');
        setLastName(data.lastName ?? '');
      } catch (err) {
        setPageError(
          err instanceof Error ? err.message : 'Failed to load profile',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      setSubmitError('');
      setSuccessMessage('');

      let updatedUser = user;

      const profileChanged =
        firstName !== (user.firstName ?? '') ||
        lastName !== (user.lastName ?? '');

      if (profileChanged) {
        updatedUser = await usersService.updateMe({
          firstName,
          lastName,
        });

        setUser(updatedUser);
      }

      const hasAnyPasswordValue =
        oldPassword.trim() !== '' ||
        newPassword.trim() !== '' ||
        repeatPassword.trim() !== '';

      if (hasAnyPasswordValue) {
        if (!oldPassword || !newPassword || !repeatPassword) {
          throw new Error('Fill in all password fields');
        }

        if (newPassword !== repeatPassword) {
          throw new Error('Passwords do not match');
        }

        if (newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters');
        }

        await usersService.changePassword({
          oldPassword,
          newPassword,
        });

        setOldPassword('');
        setNewPassword('');
        setRepeatPassword('');
      }

      if (!profileChanged && !hasAnyPasswordValue) {
        throw new Error('No changes to save');
      }

      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to update profile',
      );
    } finally {
      setIsSaving(false);
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
            <AccountDetailsForm
              user={user}
              firstName={firstName}
              lastName={lastName}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
            />

            <PasswordForm
              oldPassword={oldPassword}
              newPassword={newPassword}
              repeatPassword={repeatPassword}
              onOldPasswordChange={setOldPassword}
              onNewPasswordChange={setNewPassword}
              onRepeatPasswordChange={setRepeatPassword}
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="mt-6 h-[44px] min-w-[90px] cursor-pointer rounded-md bg-black px-6 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Edit'}
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
          </div>
        </div>
      </div>
    </section>
  );
}
