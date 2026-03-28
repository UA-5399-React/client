import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, User as UserIcon } from 'lucide-react';

import { ROUTES } from '@/constants';
import type { User } from '@/types/user';

const SIDEBAR_LINKS = [
  { to: ROUTES.PROFILE, end: true, label: 'Account' },
  { to: ROUTES.MYORDERS, label: 'Orders' },
] as const;

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
    <aside className="border-fieldBorder bg-backgroundSec w-full max-w-[220px] rounded-md border px-4 py-10">
      <div className="flex flex-col items-center">
        <div className="relative h-[82px] w-[82px]">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="border-fieldBorder h-full w-full rounded-full border object-cover"
            />
          ) : (
            <div className="border-fieldBorder bg-background flex h-full w-full items-center justify-center rounded-full border">
              <UserIcon size={32} className="text-muted" />
            </div>
          )}

          <button
            type="button"
            onClick={handleOpenFilePicker}
            disabled={isAvatarUploading}
            className="border-neutral-0 text-neutral-0 absolute -right-1 -bottom-1 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border-2 bg-neutral-900 shadow-md transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
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

        <h3 className="text-text mt-3 mb-0 text-center text-[20px] leading-none font-semibold">
          {displayName}
        </h3>
      </div>

      <nav className="mt-10">
        <ul className="flex list-none flex-col gap-3 pl-0 text-[16px] font-semibold">
          {SIDEBAR_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === ROUTES.PROFILE}
                className={({ isActive }) =>
                  `${navItemClass} ${
                    isActive
                      ? 'text-text border-text'
                      : 'text-muted hover:text-text border-transparent'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}

          <li>
            <span
              aria-disabled="true"
              className={`${navItemClass} border-transparent text-gray-600`}
            >
              Wishlist
            </span>
          </li>

          <li>
            <button
              type="button"
              onClick={onLogout}
              className="text-text block w-full cursor-pointer appearance-none border-b border-transparent bg-transparent p-0 pb-2 text-left text-[15px] leading-none font-semibold transition hover:text-red-600"
            >
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
