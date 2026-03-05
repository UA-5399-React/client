import { Link, NavLink } from 'react-router-dom';
import { Moon, Search, ShoppingBag, Sun, UserCircle } from 'lucide-react';

import { ROUTES } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

const NAV_LINKS = [
  { path: ROUTES.HOME, label: 'Home', end: true },
  { path: ROUTES.SHOP, label: 'Shop', end: false },
  { path: ROUTES.PRODUCT, label: 'Product', end: false },
  { path: ROUTES.CONTACT_US, label: 'Contact Us', end: false },
];

export const Header = () => {
  const { theme, setTheme, isDark } = useTheme();

  const handleToggleTheme = () => {
    if (theme === 'system') {
      const isSystemDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setTheme(isSystemDark ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <header className="bg-background text-text transition-colors duration-300">
      <div className="flex h-20 items-center justify-between px-16">
        <Link
          to={ROUTES.HOME}
          className="text-text text-2xl font-bold no-underline transition-colors duration-300"
        >
          TechnoWorld.
        </Link>
        <nav>
          <ul className="m-0 flex list-none gap-8 p-0">
            {NAV_LINKS.map(({ path, label, end }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={end}
                  className="text-base font-semibold no-underline transition-colors duration-300"
                  style={({ isActive }) => ({
                    color: isActive
                      ? 'rgb(var(--color-text))'
                      : 'rgb(var(--color-muted))',
                  })}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-6">
          <button
            aria-label="Search"
            className="cursor-pointer border-none bg-transparent p-0 text-inherit transition-opacity hover:opacity-70"
          >
            <Search className="h-6 w-6 transition-all duration-300" />
          </button>

          <button
            aria-label="User"
            className="cursor-pointer border-none bg-transparent p-0 text-inherit transition-opacity hover:opacity-70"
          >
            <UserCircle className="h-6 w-6 transition-all duration-300" />
          </button>

          <button
            aria-label="Theme"
            onClick={handleToggleTheme}
            className="cursor-pointer border-none bg-transparent p-0 text-inherit transition-opacity hover:opacity-70"
          >
            {isDark ? (
              <Sun className="h-6 w-6 transition-all duration-300" />
            ) : (
              <Moon className="h-6 w-6 transition-all duration-300" />
            )}
          </button>

          <Link
            to={ROUTES.CART}
            className="flex items-center gap-2 text-inherit no-underline transition-opacity hover:opacity-70"
          >
            <ShoppingBag className="h-6 w-6 transition-all duration-300" />
            <span className="bg-text text-background flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300"></span>
          </Link>
        </div>
      </div>
    </header>
  );
};
