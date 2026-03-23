import { NavLink } from 'react-router-dom';
import { Camera } from 'lucide-react';

import { ROUTES } from '@/constants';
import type { User } from '@/types/user';

const DEFAULT_AVATAR_URL =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330';

type AccountSidebarProps = {
  user: User;
  onAvatarClick?: () => void;
  onLogout?: () => void;
};

export function AccountSidebar({
  user,
  onAvatarClick,
  onLogout,
}: AccountSidebarProps) {
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

  const navItemClass =
    'block w-full border-b pb-2 text-[16px] font-semibold transition';

  return (
    <aside className="w-full max-w-[220px] rounded-md bg-[rgb(var(--color-gray-100))] px-4 py-10">
      <div className="flex flex-col items-center">
        <div className="relative h-[82px] w-[82px]">
          <img
            src={user.avatarUrl || DEFAULT_AVATAR_URL}
            alt="avatar"
            className="h-full w-full rounded-full object-cover"
          />

          <button
            type="button"
            onClick={onAvatarClick}
            className="absolute -right-1 -bottom-1 flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-[rgb(var(--color-neutral-0))] bg-[rgb(var(--color-neutral-900))] text-[rgb(var(--color-neutral-0))] shadow-md transition hover:scale-110"
          >
            <Camera size={16} />
          </button>
        </div>

        <h3 className="mt-3 mb-0 text-[20px] leading-none font-semibold text-[rgb(var(--color-neutral-900))]">
          {fullName || 'User'}
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
                    ? 'border-[rgb(var(--neutral-800))] text-black'
                    : 'border-transparent text-[rgb(var(--color-neutral-500))] hover:text-[rgb(var(--color-neutral-900))]'
                }`
              }
            >
              Account
            </NavLink>
          </li>

          <li>
            <span
              aria-disabled="true"
              className={`${navItemClass} border-transparent text-[rgb(var(--color-neutral-400))]`}
            >
              Orders
            </span>
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
