import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  UserCircle,
  X,
} from 'lucide-react';

import logoDark from '@/assets/logo/dark_theme_logo.png';
import logoLight from '@/assets/logo/light_theme_logo.png';
import { Button, CartCounter, FlyoutCart, SearchInput } from '@/components';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useMe } from '@/hooks/useMe';
import { useTheme } from '@/hooks/useTheme';
import { useCartStore } from '@/store/useCartStore';

const NAV_LINKS = [
  { path: ROUTES.HOME, label: 'Home', end: true },
  { path: ROUTES.SHOP, label: 'Shop', end: false },
  { path: ROUTES.CONTACT_US, label: 'Contact Us', end: false },
];

export const Header = () => {
  const { theme, setTheme, isDark } = useTheme();
  const logoSrc = isDark ? logoDark : logoLight;
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);

  const { openCart } = useCartStore();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSearch = searchParams.get('search') || '';
  const [searchValue, setSearchValue] = useState(initialSearch);
  const debouncedSearch = useDebouncedValue(searchValue, 500);

  const [prevUrlSearch, setPrevUrlSearch] = useState(initialSearch);

  const { isAuth } = useAuth();

  const { data: me } = useMe(isAuth);

  const userInitials = (() => {
    if (!me) return null;
    const first = me.firstName?.trim()[0]?.toUpperCase() ?? '';
    const last = me.lastName?.trim()[0]?.toUpperCase() ?? '';
    if (first || last) return `${first}${last}`;
    return me.email?.[0]?.toUpperCase() ?? null;
  })();

  const avatarUrl = me?.avatarUrl;
  const shouldShowAvatar = Boolean(avatarUrl && failedAvatarUrl !== avatarUrl);

  const handleUserNavigate = () => {
    navigate(isAuth ? ROUTES.PROFILE : ROUTES.LOGIN);
  };

  if (initialSearch !== prevUrlSearch) {
    setPrevUrlSearch(initialSearch);
    setSearchValue(initialSearch);
  }

  useEffect(() => {
    if (debouncedSearch !== initialSearch) {
      if (debouncedSearch) {
        navigate(
          `${ROUTES.SHOP}?search=${encodeURIComponent(debouncedSearch)}`,
        );
      } else {
        navigate(ROUTES.SHOP);
      }
    }
  }, [debouncedSearch, navigate, initialSearch]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

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

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <header className="bg-background text-text transition-colors duration-300">
        <div className="flex h-16 items-center px-4 lg:hidden">
          <button
            className="cursor-pointer border-none bg-transparent p-0 text-inherit"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link
            to={ROUTES.HOME}
            className="text-text mx-auto text-xl font-bold no-underline"
          >
            <img
              src={logoSrc}
              alt="TechnoWorld"
              className="align-center flex h-28 w-auto"
            />
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={openCart}
              className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-inherit no-underline"
              aria-label="Cart"
            >
              <ShoppingBag className="h-6 w-6" />
              <CartCounter />
            </button>
          </div>
        </div>
        <div className="hidden h-20 items-center justify-between px-16 lg:flex">
          <Link to={ROUTES.HOME}>
            <img
              src={logoSrc}
              alt="TechnoWorld"
              className="align-center flex h-36 w-auto"
            />
          </Link>

          <nav>
            <ul className="m-0 flex list-none gap-8 p-0">
              {NAV_LINKS.map(({ path, label, end }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    end={end}
                    className={({ isActive }) =>
                      `text-base font-semibold no-underline transition-colors duration-300 ${
                        isActive
                          ? 'text-[rgb(var(--color-text))]'
                          : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  searchOpen ? 'ml-6 w-72 opacity-100' : 'ml-0 w-0 opacity-0'
                }`}
                aria-hidden={!searchOpen}
              >
                <SearchInput
                  value={searchValue}
                  onChange={setSearchValue}
                  className="w-full min-w-[18rem]"
                  disabled={!searchOpen}
                />
              </div>
              <button
                aria-label="Search"
                onClick={() => {
                  setSearchOpen((prev) => !prev);
                  if (searchOpen) setSearchValue('');
                }}
                className="cursor-pointer border-none bg-transparent p-0 text-inherit transition-opacity hover:opacity-70"
              >
                <Search className="h-6 w-6" />
              </button>
            </div>

            <button
              onClick={handleUserNavigate}
              aria-label="User"
              className="cursor-pointer border-none bg-transparent p-0 text-inherit transition-opacity hover:opacity-70"
            >
              {shouldShowAvatar ? (
                <img
                  src={avatarUrl}
                  alt={userInitials ? `${userInitials} avatar` : 'User avatar'}
                  className="h-7 w-7 rounded-full object-cover"
                  onError={() => setFailedAvatarUrl(avatarUrl ?? null)}
                />
              ) : userInitials ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  {userInitials}
                </span>
              ) : (
                <UserCircle className="h-6 w-6" />
              )}
            </button>

            <button
              aria-label="Theme"
              onClick={handleToggleTheme}
              className="cursor-pointer border-none bg-transparent p-0 text-inherit transition-opacity hover:opacity-70"
            >
              {theme === 'dark' ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={openCart}
              className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-inherit no-underline transition-opacity hover:opacity-70"
              aria-label="Cart"
            >
              <ShoppingBag className="h-6 w-6" />
              <CartCounter />
            </button>
          </div>
        </div>
      </header>
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={closeMenu} />

          <div
            className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col shadow-2xl ${isDark ? 'bg-[#141718]' : 'bg-white'}`}
          >
            <div className="flex shrink-0 items-center justify-between px-6 py-5">
              <span
                className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}
              >
                TechnoWorld.
              </span>
              <button
                onClick={closeMenu}
                className={`cursor-pointer border-none bg-transparent p-0 outline-none ${isDark ? 'text-white' : 'text-black'}`}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mx-6 mb-2 shrink-0">
              <SearchInput
                value={searchValue}
                onChange={setSearchValue}
                className="w-full"
              />
            </div>
            <nav className="px-6 pt-2">
              {NAV_LINKS.map(({ path, label, end }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={end}
                  onClick={closeMenu}
                  className={`flex items-center border-b py-4 text-sm font-medium no-underline ${isDark ? 'border-gray-700 text-white' : 'border-gray-200 text-black'}`}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <div
              className={`mt-auto shrink-0 border-t px-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <button
                onClick={handleToggleTheme}
                className={`flex w-full cursor-pointer items-center justify-between border-x-0 border-t-0 border-b bg-transparent py-4 pr-0 pl-0 text-left font-[inherit] text-sm font-medium outline-none ${isDark ? 'border-gray-700 text-white' : 'border-gray-200 text-black'}`}
              >
                <span>Change Theme</span>
                {isDark ? (
                  <Sun className="h-5 w-5 shrink-0 text-gray-400" />
                ) : (
                  <Moon className="h-5 w-5 shrink-0 text-gray-400" />
                )}
              </button>

              <button
                onClick={() => {
                  closeMenu();
                  openCart();
                }}
                className={`flex w-full cursor-pointer items-center justify-between border-x-0 border-t-0 border-b bg-transparent py-4 text-left font-[inherit] text-sm font-medium outline-none ${isDark ? 'border-gray-700 text-white' : 'border-gray-200 text-black'}`}
              >
                <span>Cart</span>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 shrink-0 text-gray-400" />
                  <CartCounter />
                </div>
              </button>

              <Link
                to="#"
                onClick={closeMenu}
                className={`flex items-center justify-between border-b py-4 text-sm font-medium no-underline ${isDark ? 'border-gray-700 text-white' : 'border-gray-200 text-black'}`}
              >
                <span>Wishlist</span>
                <Heart className="h-5 w-5 shrink-0 text-gray-400" />
              </Link>
            </div>
            <div className="shrink-0 px-6 pt-2 pb-6">
              <Button
                onClick={() => {
                  closeMenu();
                  handleUserNavigate();
                }}
                className="w-full"
              >
                {isAuth ? 'My Account' : 'Sign In'}
              </Button>
            </div>
          </div>
        </>
      )}
      <FlyoutCart />
    </>
  );
};
