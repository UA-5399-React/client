import { Link, NavLink } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

import { ROUTES } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

const NAV_LINKS = [{ path: ROUTES.SHOP, label: 'Shop', end: false }];

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
        </div>
      </div>
    </header>
  );
};
