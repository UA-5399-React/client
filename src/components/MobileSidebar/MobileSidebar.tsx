import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOutIcon, MenuIcon, XIcon } from 'lucide-react';

import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '../Button';

const MOBILE_LINKS = [
  { to: ROUTES.ADMIN_PRODUCTS, label: 'Products' },
  { to: ROUTES.ADMIN_SETTING, label: 'Settings' },
];

export const MobileSidebar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-w-[680px]">
      <div className="flex h-[64px] w-full items-center gap-2 px-4">
        <MenuIcon onClick={() => setIsOpen(!isOpen)} />

        <span className="text-2xl font-bold">Admin</span>
      </div>

      {isOpen && (
        <div className="absolute top-0 left-0 z-2 flex h-full w-full min-w-[680px] flex-col justify-between bg-[rgb(var(--color-bg-sec))]">
          <div>
            <div className="flex items-center gap-4 p-4">
              <XIcon
                className="text-[rgb(var(--color-gray-600))]"
                onClick={() => setIsOpen(!isOpen)}
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
                      onClick={() => setIsOpen(false)}
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
