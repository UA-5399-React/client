import { useState } from 'react';

import type { AdminUser } from '@/types/admin-user.types';

interface UserAvatarProps {
  user: AdminUser;
}

const getUserInitials = (user: AdminUser) => {
  const firstInitial = user.firstName ? user.firstName[0] : '';
  const lastInitial = user.lastName ? user.lastName[0] : '';

  return `${firstInitial}${lastInitial}`.toUpperCase();
};

export const UserAvatar = ({ user }: UserAvatarProps) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="border-fieldBorder text-text dark:text-neutral-0 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-gray-100 text-sm font-semibold dark:bg-neutral-800">
      {user.avatarUrl && !hasError ? (
        <img
          src={user.avatarUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{getUserInitials(user)}</span>
      )}
    </div>
  );
};
