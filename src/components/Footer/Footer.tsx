import { Link, NavLink } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';

import logoDark from '@/assets/logo/dark_theme_logo.png';
import logoLight from '@/assets/logo/light_theme_logo.png';
import { ROUTES } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

const NAV_LINKS = [{ path: ROUTES.SHOP, label: 'Shop' }];

export const Footer = () => {
  const { isDark } = useTheme();
  const logoSrc = isDark ? logoLight : logoDark;

  return (
    <footer
      className={`px-4 py-10 transition-colors duration-300 lg:px-16 lg:py-12 ${
        isDark ? 'bg-white text-black' : 'bg-[#141718] text-white'
      }`}
    >
      <div className="flex flex-col gap-6 pb-8 lg:flex-row lg:items-center lg:justify-between lg:pb-10">
        <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-6">
          <Link to={ROUTES.HOME}>
            <img
              src={logoSrc}
              alt="TechnoWorld"
              className="align-center flex h-38 w-auto"
            />
          </Link>

          <div
            className={`hidden h-6 border-l lg:block ${
              isDark ? 'border-gray-400' : 'border-gray-600'
            }`}
          />

          <span
            className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
          >
            Gift & Decoration Store
          </span>
        </div>

        <nav>
          <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-3 p-0 lg:gap-8">
            {NAV_LINKS.map(({ path, label }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `text-sm font-medium no-underline transition-colors duration-300 ${
                      isActive
                        ? isDark
                          ? 'text-black'
                          : 'text-white'
                        : isDark
                          ? 'text-gray-500 hover:text-black'
                          : 'text-gray-400 hover:text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={`border-t ${isDark ? 'border-gray-300' : 'border-gray-700'}`}
      />
      <div
        className={`flex flex-col gap-5 pt-6 text-xs lg:flex-row lg:items-center lg:justify-between lg:pt-8 ${
          isDark ? 'text-gray-600' : 'text-gray-400'
        }`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center lg:gap-8">
          <span>Copyright © 2026 TechnoWorld. All rights reserved</span>
          <div className="flex items-center gap-4 font-semibold lg:gap-6"></div>
        </div>

        <div className="flex items-center gap-5 lg:gap-6">
          <Link
            to="#"
            className="transition-opacity hover:opacity-70"
            style={{ color: 'inherit' }}
          >
            <Instagram className="h-5 w-5 transition-all duration-300 lg:h-6 lg:w-6" />
          </Link>
          <Link
            to="#"
            className="transition-opacity hover:opacity-70"
            style={{ color: 'inherit' }}
          >
            <Facebook className="h-5 w-5 transition-all duration-300 lg:h-6 lg:w-6" />
          </Link>
          <Link
            to="#"
            className="transition-opacity hover:opacity-70"
            style={{ color: 'inherit' }}
          >
            <Youtube className="h-5 w-5 transition-all duration-300 lg:h-6 lg:w-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
