import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, User as UserIcon } from 'lucide-react';

import { ROUTES } from '@/constants';
import type { User } from '@/types/user';

type AccountSidebarProps = {
  user: User;
  onAvatarClick?: (file: File) => void;
  onLogout: () => void;
  isAvatarUploading?: boolean;
};

export function AccountSidebar({
  user,
  onAvatarClick,
  onLogout,
  isAvatarUploading = false,
}: AccountSidebarProps) {
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  const displayName = fullName || 'User';

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenFilePicker = () => {
    if (isAvatarUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onAvatarClick?.(file);
    event.target.value = '';
  };

  const navItemClass =
    'block w-full border-b pb-2 text-[16px] font-semibold transition';

  return (
    <aside className="w-full max-w-[220px] rounded-md bg-[rgb(var(--color-gray-100))] px-4 py-10">
      <div className="flex flex-col items-center">
        <div className="relative h-[82px] w-[82px]">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[rgb(var(--color-gray-200))]">
              <UserIcon
                size={32}
                className="text-[rgb(var(--color-gray-500))]"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleOpenFilePicker}
            disabled={isAvatarUploading}
            className="absolute -right-1 -bottom-1 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border-2 border-[rgb(var(--color-neutral-0))] bg-[rgb(var(--color-neutral-900))] text-[rgb(var(--color-neutral-0))] shadow-md transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Camera size={16} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <h3 className="mt-3 mb-0 text-[20px] leading-none font-semibold text-[rgb(var(--color-neutral-900))]">
          {displayName}
        </h3>
      </div>

      <nav className="mt-10">
        <ul className="flex list-none flex-col gap-3 pl-0 text-[16px] font-semibold">
          <li>
            <NavLink
              to={ROUTES.PROFILE}
              end
              className={({ isActive }) =>
                `${navItemClass} ${
                  isActive
                    ? 'border-[rgb(var(--color-neutral-800))] text-black'
                    : 'border-transparent text-[rgb(var(--color-neutral-500))] hover:text-[rgb(var(--color-neutral-900))]'
                }`
              }
            >
              Account
            </NavLink>
          </li>

          <li>
            <NavLink
              to={ROUTES.MYORDERS}
              className={({ isActive }) =>
                `${navItemClass} ${
                  isActive
                    ? 'border-[rgb(var(--neutral-800))] text-black'
                    : 'border-transparent text-[rgb(var(--color-neutral-500))] hover:text-[rgb(var(--color-neutral-900))]'
                }`
              }
            >
              Orders
            </NavLink>
          </li>

          <li>
            <span
              aria-disabled="true"
              className={`${navItemClass} border-transparent text-[rgb(var(--color-neutral-400))]`}
            >
              Wishlist
            </span>
          </li>

          <li>
            <button
              type="button"
              onClick={onLogout}
              className="block w-full cursor-pointer appearance-none border-b border-transparent bg-transparent p-0 pb-2 text-left text-[15px] leading-none font-semibold text-[rgb(var(--color-neutral-800))] transition hover:text-[rgb(var(--color-neutral-900))]"
            >
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
