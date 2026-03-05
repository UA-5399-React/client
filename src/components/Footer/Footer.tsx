import { Link, NavLink } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';

import { ROUTES } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

const NAV_LINKS = [
  { path: ROUTES.HOME, label: 'Home' },
  { path: ROUTES.SHOP, label: 'Shop' },
  { path: ROUTES.PRODUCT, label: 'Product' },
  { path: ROUTES.BLOG, label: 'Blog' },
  { path: ROUTES.CONTACT_US, label: 'Contact Us' },
];

export const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer
      className={`px-16 py-12 transition-colors duration-300 ${
        isDark ? 'bg-white text-black' : 'bg-[#141718] text-white'
      }`}
    >
      <div className="flex items-center justify-between pb-10">
        <div className="flex items-center gap-6">
          <Link
            to={ROUTES.HOME}
            className="text-2xl font-medium no-underline transition-colors duration-300"
            style={{ color: 'inherit' }}
          >
            TechnoWorld
          </Link>
          <div
            className={`h-6 border-l ${isDark ? 'border-gray-400' : 'border-gray-600'}`}
          ></div>
          <span
            className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-300'}`}
          >
            Gift & Decoration Store
          </span>
        </div>

        <nav className="flex gap-8">
          {NAV_LINKS.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `text-sm font-medium no-underline transition-colors duration-300 ${
                  isActive
                    ? isDark
                      ? 'text-black'
                      : 'text-white'
                    : isDark
                      ? 'text-gray-500 hover:text-black'
                      : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div
        className={`border-t ${isDark ? 'border-gray-300' : 'border-gray-700'}`}
      ></div>

      <div
        className={`flex items-center justify-between pt-8 text-xs ${isDark ? 'text-gray-600' : 'text-gray-300'}`}
      >
        <div className="flex items-center gap-8">
          <span>Copyright © 2026 TechnoWorld. All rights reserved</span>
          <div className="flex items-center gap-6 font-semibold">
            <Link
              to="#"
              className="no-underline transition-colors duration-300 hover:opacity-70"
              style={{ color: 'inherit' }}
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="no-underline transition-colors duration-300 hover:opacity-70"
              style={{ color: 'inherit' }}
            >
              Terms of Use
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link to="#" className="transition-opacity hover:opacity-70">
            <Instagram className="h-6 w-6 transition-all duration-300" />
          </Link>
          <Link to="#" className="transition-opacity hover:opacity-70">
            <Facebook className="h-6 w-6 transition-all duration-300" />
          </Link>
          <Link to="#" className="transition-opacity hover:opacity-70">
            <Youtube className="h-6 w-6 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
