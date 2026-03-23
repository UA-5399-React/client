import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ProductDetails } from '@/pages/ProductDetails/ProductDetails';

import { MainLayout, ProtectedRoute } from './components';
import { LoginForm } from './components';
import { AdminLayout } from './components/AdminLayout/AdminLayout';
import { AdminRoute } from './components/AdminRoute/AdminRoute';
import { AuthLayout } from './components/AuthLayout';
import { RegisterForm } from './components/RegisterForm';
import { ROUTES } from './constants';
import { Cart, Home } from './pages';
import { AdminCategories } from './pages/Admin/Categories/AdminCategories';
import { CreateProduct } from './pages/Admin/CreateProduct/CreateProduct';
import { EditProduct } from './pages/Admin/EditProduct/EditProduct';
import { AdminProducts } from './pages/Admin/Products/AdminProducts';
import { AdminSettings } from './pages/Admin/Settings/AdminSettings';
import { AdminUsers } from './pages/Admin/Users/AdminUsers';
import { ContactUs, NotFound, Shop } from './pages/Mocks';
import { Profile } from './pages/User/Profile';

function App() {
  const {
    HOME,
    SHOP,
    PRODUCT,
    CONTACT_US,
    CART,
    ADMIN,
    ADMIN_CATEGORIES,
    ADMIN_PRODUCTS,
    ADMIN_USERS,
    ADMIN_SETTING,
    ADMIN_PRODUCT_CREATE,
    ADMIN_PRODUCT_EDIT,
    LOGIN,
    REGISTER,
    PROFILE,
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
          <Route element={<ProtectedRoute />}>
            <Route path={PROFILE} element={<Profile />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={LOGIN} element={<LoginForm />} />
          <Route path={REGISTER} element={<RegisterForm />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path={ADMIN} element={<AdminLayout />}>
            <Route index element={<Navigate to={ADMIN_PRODUCTS} replace />} />
            <Route path={ADMIN_CATEGORIES} element={<AdminCategories />} />
            <Route path={ADMIN_PRODUCTS} element={<AdminProducts />} />
            <Route path={ADMIN_USERS} element={<AdminUsers />} />
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
