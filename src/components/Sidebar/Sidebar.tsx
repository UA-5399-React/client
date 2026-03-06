import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, PackageIcon, SettingsIcon } from 'lucide-react';

import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

import { Button } from '../Button';

const SIDEBAR_LINKS = [
  { to: ROUTES.ADMIN_PRODUCTS, label: 'Products', icon: <PackageIcon /> },
  { to: ROUTES.ADMIN_SETTING, label: 'Settings', icon: <SettingsIcon /> },
];

export const Sidebar = () => {
  const { isDark } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex h-full min-h-full flex-col justify-between">
      <div>
        <h1 className="light:text-white pb-16 text-center text-4xl font-bold dark:text-black">
          ADMIN
        </h1>

        <nav>
          {SIDEBAR_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex h-[42px] items-center gap-2 rounded-md px-4 py-2 ${isDark ? 'hover:bg-white! hover:text-black!' : 'hover:bg-black! hover:text-white!'} ${
                  isActive
                    ? `${isDark ? 'bg-white text-black!' : 'bg-black text-white!'}`
                    : ''
                }`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <Button
        className="mt-auto w-full bg-transparent dark:text-white"
        onClick={handleLogout}
      >
        <div
          className={`flex items-center gap-2 py-8 ${isDark ? 'text-white' : 'text-black'}`}
        >
          <LogOut />
          Sign out
        </div>
      </Button>
    </div>
  );
};
