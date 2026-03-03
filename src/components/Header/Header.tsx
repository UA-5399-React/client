import { Link } from 'react-router-dom';

import { ROUTES } from '../../constants';

const NAV_LINKS = [
  { path: ROUTES.HOME, label: 'Home' },
  { path: ROUTES.SHOP, label: 'Shop' },
  { path: ROUTES.CART, label: 'Cart' },
  { path: ROUTES.LOGIN, label: 'Login' },
];

export const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          {NAV_LINKS.map(({ path, label }) => (
            <li key={path}>
              <Link to={path}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
