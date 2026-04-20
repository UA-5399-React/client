import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChartBarStacked,
  LayoutDashboard,
  LogOut,
  Mail,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  Sparkles,
  Store,
  UsersIcon,
} from 'lucide-react';

import { Button } from '@/components/Button';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useTheme } from '@/hooks/useTheme';
import { canAccessAdminRoute } from '@/utils/permissions';

const SIDEBAR_LINKS = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard /> },
  { to: ROUTES.ADMIN_PRODUCTS, label: 'Products', icon: <PackageIcon /> },
  {
    to: ROUTES.ADMIN_CATEGORIES,
    label: 'Categories',
    icon: <ChartBarStacked />,
  },
  { to: ROUTES.ADMIN_USERS, label: 'Users', icon: <UsersIcon /> },
  { to: ROUTES.ADMIN_ORDERS, label: 'Orders', icon: <ShoppingCartIcon /> },
  { to: ROUTES.ADMIN_MAILER, label: 'Mailer', icon: <Mail /> },
  { to: ROUTES.ADMIN_SETTING, label: 'Settings', icon: <SettingsIcon /> },
  { to: ROUTES.ADMIN_FEATURED, label: 'Featured Products', icon: <Sparkles /> },
  { to: ROUTES.HOME, label: 'View Store', icon: <Store /> },
];

export const Sidebar = () => {
  const { isDark } = useTheme();
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  const { openConfirmModal } = useConfirmModal();
  const visibleLinks = SIDEBAR_LINKS.filter(({ to }) =>
    canAccessAdminRoute(role, to),
  );

  const handleLogout = () => {
    openConfirmModal({
      title: 'Logout',
      description: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      onConfirm: async () => {
        await logout();
        navigate(ROUTES.LOGIN);
      },
    });
  };

  return (
    <div className="flex h-full min-h-full flex-col justify-between">
      <div>
        <h1 className="pb-16 text-center text-4xl font-bold text-[rgb(var(--color-text))]">
          ADMIN
        </h1>

        <nav>
          {visibleLinks.map(({ to, label, icon }) => (
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
          Logout
        </div>
      </Button>
    </div>
  );
};
