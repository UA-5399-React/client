import { useParams } from 'react-router-dom';

import { Products } from './Products/Products';

export const Shop = () => <Products />;

export const ProductDetails = () => {
  const { id } = useParams();
  return (
    <div>
      Product Details Page (ID: <span>{id}</span>)
    </div>
  );
};

export const Login = () => <div>Login Page</div>;
