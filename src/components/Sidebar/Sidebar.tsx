import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChartBarStacked,
  ChevronsLeft,
  ChevronsRight,
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

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
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
    <aside
      className={`flex h-full min-h-full flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      <div>
        <div
          className={`flex items-center p-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="toggle sidebar"
            className="cursor-pointer border-none bg-transparent text-[rgb(var(--color-text))] hover:opacity-80"
          >
            {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
          </button>
        </div>
        {!isCollapsed && (
          <h1 className="text-text pb-10 text-center text-4xl font-bold">
            ADMIN
          </h1>
        )}

        <nav className="flex flex-col gap-2 px-2">
          {visibleLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              title={isCollapsed ? label : ''}
              className={({ isActive }) =>
                `flex h-[42px] items-center gap-2 rounded-md transition-all ${
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
                } ${isDark ? 'hover:bg-white! hover:text-black!' : 'hover:bg-black! hover:text-white!'} ${
                  isActive
                    ? `${isDark ? 'bg-white text-black!' : 'bg-black text-white!'}`
                    : ''
                }`
              }
            >
              <span className="flex-shrink-0">{icon}</span>
              {!isCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <Button
        className="mt-auto w-full bg-transparent dark:text-white"
        onClick={handleLogout}
      >
        <div
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2 px-4'} py-8 ${isDark ? 'text-white' : 'text-black'}`}
        >
          <LogOut />
          {!isCollapsed && <span>Logout</span>}
        </div>
      </Button>
    </aside>
  );
};
