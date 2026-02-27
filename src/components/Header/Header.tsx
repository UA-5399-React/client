import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const Header = () => {
  return (
    <nav>
      <div>
        <Link to={ROUTES.HOME}>Home</Link>
        <Link to={ROUTES.SHOP}>Shop</Link>
        <Link to={ROUTES.CONTACT_US}>Contact Us</Link>
        <Link to={ROUTES.LOGIN}>Login</Link>
        <Link to={ROUTES.CART}>Cart</Link>
      </div>
    </nav>
  );
};
