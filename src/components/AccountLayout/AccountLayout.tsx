import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { PAGE_TITLES, ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useMe } from '@/hooks/useMe';
import { queryClient } from '@/lib/queryClient';
import { usersService } from '@/services/users.service';
import { useErrorStore } from '@/store/errorStore';

import { BackButton } from '../BackButton/BackButton';
import { AccountSidebar } from '../UserProfile/AccountSidebar/AccountSidebar';

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/profile/order/')) {
    return 'My Order Details';
  }
  return PAGE_TITLES[pathname] ?? 'My Account';
}

export function AccountLayout() {
  const { isAuth, logout } = useAuth();
  const { data: user, isPending } = useMe(isAuth);

  const navigate = useNavigate();
  const { openConfirmModal } = useConfirmModal();
  const title = getPageTitle(location.pathname);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const showMessage = useErrorStore((s) => s.show);

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    try {
      setIsAvatarUploading(true);

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, and WEBP files are allowed');
      }

      if (file.size > maxSize) {
        throw new Error('Maximum file size is 5 MB');
      }

      const updatedUser = await usersService.uploadAvatar(file);

      queryClient.setQueryData(['me'], updatedUser);

      showMessage(
        'success',
        'Avatar updated',
        'Your avatar was updated successfully.',
      );
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }

      showMessage(
        'error',
        'Failed to upload avatar',
        err instanceof Error ? err.message : 'Failed to upload avatar',
      );
    } finally {
      setIsAvatarUploading(false);
    }
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const handleLogout = async () => {
    openConfirmModal({
      title: 'Logout',
      description: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      isCritical: true,
      onConfirm: async () => {
        await logout();
        navigate(ROUTES.HOME, { replace: true });
      },
    });
  };

  return (
    <section className="bg-background text-text min-h-screen px-8 lg:px-40 lg:pb-20">
      <BackButton />

      <h1 className="text-text mt-10 mb-16 text-center text-[40px] leading-none font-semibold md:text-[54px]">
        {title}
      </h1>

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 justify-items-center gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:justify-items-stretch">
          <AccountSidebar
            user={user}
            onLogout={handleLogout}
            onAvatarClick={handleAvatarUpload}
            isAvatarUploading={isAvatarUploading}
          />

          <Outlet />
        </div>
      </div>
    </section>
  );
}
