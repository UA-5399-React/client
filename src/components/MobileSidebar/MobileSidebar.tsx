import { NavLink, useNavigate } from 'react-router-dom';
import { LogOutIcon, MenuIcon, XIcon } from 'lucide-react';

import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '../Button';

const MOBILE_LINKS = [
  { to: ROUTES.ADMIN_PRODUCTS, label: 'Products' },
  { to: ROUTES.ADMIN_SETTING, label: 'Settings' },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileSidebar = ({ isOpen, onOpenChange }: MobileSidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-w-[680px]">
      <div className="flex h-[64px] items-center gap-2 pl-4">
        <MenuIcon onClick={() => onOpenChange(!isOpen)} />

        <span className="text-2xl font-bold">Admin</span>
      </div>

      {isOpen && (
        <div className="absolute top-0 left-0 flex h-full w-full min-w-[680px] flex-col justify-between bg-[rgb(var(--color-bg-sec))]">
          <div>
            <div className="flex items-center gap-4 p-4">
              <XIcon
                className="cursor-pointer text-[rgb(var(--color-gray-600))]"
                onClick={() => onOpenChange(false)}
              />

              <span className="text-2xl font-bold">ADMIN</span>
            </div>

            <nav className="px-4">
              <ul className="list-none p-0">
                {MOBILE_LINKS.map(({ to, label }) => (
                  <li
                    key={to}
                    className="x-4 mt-4 h-[40px] border-b border-gray-200"
                  >
                    <NavLink
                      to={to}
                      onClick={() => onOpenChange(false)}
                      className={({ isActive }) =>
                        `h-[40px] ${isActive ? 'text-xl font-bold' : ''}`
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Button
            onClick={() => handleLogout()}
            className="my-6 flex items-center gap-2 border-none bg-transparent px-4"
          >
            <LogOutIcon />

            <span>Logout</span>
          </Button>
        </div>
      )}
    </div>
  );
};
