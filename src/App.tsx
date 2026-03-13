import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ProductDetails } from '@/pages/ProductDetails/ProductDetails';

import { MainLayout, ProtectedRoute } from './components';
import { LoginForm } from './components';
import { AdminLayout } from './components/AdminLayout/AdminLayout';
import { AuthLayout } from './components/AuthLayout';
import { RegisterForm } from './components/RegisterForm';
import { ROUTES } from './constants';
import { CreateProduct } from './pages/Admin/CreateProduct/CreateProduct';
import { EditProduct } from './pages/Admin/EditProduct/EditProduct';
import { AdminProducts } from './pages/Admin/Products/AdminProducts';
import { AdminSettings } from './pages/Admin/Settings/AdminSettings';
import { Cart, ContactUs, NotFound, Shop } from './pages/Mocks';

function App() {
  const {
    HOME,
    SHOP,
    PRODUCT,
    CONTACT_US,
    CART,
    ADMIN,
    ADMIN_PRODUCTS,
    ADMIN_SETTING,
    ADMIN_PRODUCT_CREATE,
    ADMIN_PRODUCT_EDIT,
    LOGIN,
    REGISTER,
  } = ROUTES;

  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME} element={<MainLayout />}>
          <Route index element={<Navigate to={SHOP} replace />} />
          <Route path={SHOP} element={<Shop />} />
          <Route path={PRODUCT} element={<ProductDetails />} />
          <Route path={CONTACT_US} element={<ContactUs />} />
          <Route path={CART} element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={LOGIN} element={<LoginForm />} />
          <Route path={REGISTER} element={<RegisterForm />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={ADMIN} element={<AdminLayout />}>
            <Route path={ADMIN_PRODUCTS} element={<AdminProducts />} />
            <Route path={ADMIN_SETTING} element={<AdminSettings />} />
            <Route path={ADMIN_PRODUCT_CREATE} element={<CreateProduct />} />
            <Route path={ADMIN_PRODUCT_EDIT} element={<EditProduct />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
