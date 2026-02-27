import { useParams } from 'react-router-dom';

export const Shop = () => <div>Shop Page</div>;

export const ProductDetails = () => {
  const { id } = useParams();
  return (
    <div>
      Product Details Page (ID: <span>{id}</span>)
    </div>
  );
};

export const ContactUs = () => <div>Contact Us Page</div>;

export const Cart = () => <div>Cart Page</div>;

export const Login = () => <div>Login Page</div>;

export const NotFound = () => <div>Page not found</div>;
