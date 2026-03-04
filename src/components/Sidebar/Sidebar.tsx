import { ROUTES } from '@/constants';
import { NavLink } from 'react-router-dom';
import { Button } from '../Button';

const SIDEBAR_LINKS = [
  { to: ROUTES.ADMIN_PRODUCTS, label: 'Products' },
  { to: ROUTES.ADMIN_SETTING, label: 'Settings' },
];

export const Sidebar = () => {
  return (
    <div className="flex h-full min-h-full flex-col bg-[#F1F1F1] py-16">
      <h1 className="pb-16 text-center text-4xl font-bold text-black">ADMIN</h1>

      <nav>
        {SIDEBAR_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex h-[42px] items-center gap-2 px-4 py-2 hover:bg-black hover:text-white ${
                isActive ? 'bg-black font-semibold text-white' : ''
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <Button className="mt-auto text-start">Sign out</Button>
    </div>
  );
};
