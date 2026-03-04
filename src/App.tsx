import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { MainLayout } from './components';
import { LogoutButton } from './components/LogoutButton/LogoutButton';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { ROUTES } from './constants';
import { Home } from './pages';
import Login from './pages/Login/Login';
import { Cart, ContactUs, NotFound, ProductDetails, Shop } from './pages/Mocks';

const AdminProductsPlaceholder = () => (
  <div className="p-10 text-center">
    <h1 className="mb-4 text-3xl font-bold">Admin Dashboard</h1>
    <p className="mb-6 text-gray-600">soon</p>
    <LogoutButton />
  </div>
);

function App() {
  const {
    HOME,
    SHOP,
    PRODUCT,
    CONTACT_US,
    LOGIN,
    CART,
    ADMIN_LOGIN,
    ADMIN_PRODUCTS,
  } = ROUTES;
  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME} element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={SHOP} element={<Shop />} />
          <Route path={PRODUCT} element={<ProductDetails />} />
          <Route path={CONTACT_US} element={<ContactUs />} />
          <Route path={CART} element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path={ADMIN_LOGIN} element={<Login />} />

        <Route path={LOGIN} element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path={ADMIN_PRODUCTS || '/admin/products'}
            element={<AdminProductsPlaceholder />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
