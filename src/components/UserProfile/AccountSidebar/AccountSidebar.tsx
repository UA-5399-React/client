import { useMemo, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Camera, User as UserIcon } from 'lucide-react';

import { Dropdown } from '@/components/Dropdown';
import { ROUTES } from '@/constants';
import type { User } from '@/types/user';

type SidebarLink = {
  to: string;
  label: string;
  end?: boolean;
};

const SIDEBAR_LINKS: SidebarLink[] = [
  { to: ROUTES.PROFILE, end: true, label: 'Account' },
  { to: ROUTES.MYORDERS, label: 'Orders' },
  { to: ROUTES.WISHLIST, label: 'Wishlist' },
];

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
  const location = useLocation();
  const navigate = useNavigate();

  const currentOption = useMemo(() => {
    return SIDEBAR_LINKS.find((item) =>
      item.end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to),
    );
  }, [location.pathname]);

  const dropdownOptions = SIDEBAR_LINKS.map((item) => ({
    label: item.label,
    value: item.to,
  }));

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

  const handleMobileNavChange = (
    selected: Array<{ label: string; value: string }>,
  ) => {
    const selectedRoute = selected[0]?.value;

    if (selectedRoute) {
      navigate(selectedRoute);
    }
  };

  const navItemClass =
    'block w-full border-b pb-2 text-[16px] font-semibold transition';

  return (
    <aside className="border-fieldBorder bg-backgroundSec mx-auto w-full max-w-[290px] rounded-md border px-3 py-6 md:mx-0 md:max-w-[220px] md:px-4 md:py-10">
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

      <div className="mt-8 md:hidden">
        <Dropdown
          label=""
          options={dropdownOptions}
          selectedValues={currentOption ? [currentOption.to] : []}
          onChange={handleMobileNavChange}
          multiple={false}
          placeholder="Select page"
          selectClassName="w-full"
        />
      </div>

      <nav className="mt-10 hidden md:block">
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

      <div className="mt-4 md:hidden">
        <button
          type="button"
          onClick={onLogout}
          className="text-text bg-background flex h-[32px] w-full items-center justify-center rounded-[6px] border-1 border-gray-300 px-[14px] text-[15px] font-semibold transition"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
