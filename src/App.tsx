import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ProductDetails } from '@/pages/ProductDetails/ProductDetails';

import { MainLayout, ProtectedRoute } from './components';
import { LoginForm } from './components';
import { AdminLayout } from './components/AdminLayout/AdminLayout';
import { AuthLayout } from './components/AuthLayout';
import { RegisterForm } from './components/RegisterForm';
import { AUTH_ROLES, ROUTES } from './constants';
import { useCartSync } from './hooks/useCartSync';
import { Cart, Checkout, Home, OrderConfirmation } from './pages';
import { AddCategory } from './pages/Admin/AddCategory/AddCategory';
import { AdminCategories } from './pages/Admin/Categories/AdminCategories';
import { CreateProduct } from './pages/Admin/CreateProduct/CreateProduct';
import { EditCategory } from './pages/Admin/EditCategory/EditCategory';
import { EditProduct } from './pages/Admin/EditProduct/EditProduct';
import { AdminOrders } from './pages/Admin/Orders/AdminOrders';
import { AdminProducts } from './pages/Admin/Products/AdminProducts';
import { AdminSettings } from './pages/Admin/Settings/AdminSettings';
import { AdminUsers } from './pages/Admin/Users/AdminUsers';
import { ContactUs, NotFound, Shop } from './pages/Mocks';
import { MyOrders } from './pages/User/MyOrders';
import { Profile } from './pages/User/Profile';

function App() {
  useCartSync();
  const {
    HOME,
    SHOP,
    PRODUCT,
    CONTACT_US,
    CART,
    CHECKOUT,
    ORDER_CONFIRMATION,
    ADMIN,
    ADMIN_CATEGORIES,
    ADMIN_CATEGORY_ADD,
    ADMIN_CATEGORY_EDIT,
    ADMIN_PRODUCTS,
    ADMIN_USERS,
    ADMIN_SETTING,
    ADMIN_PRODUCT_CREATE,
    ADMIN_PRODUCT_EDIT,
    LOGIN,
    REGISTER,
    ADMIN_ORDERS,
    PROFILE,
    MYORDERS,
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
            <Route path={MYORDERS} element={<MyOrders />} />
            <Route path={CHECKOUT} element={<Checkout />} />
            <Route path={ORDER_CONFIRMATION} element={<OrderConfirmation />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={LOGIN} element={<LoginForm />} />
          <Route path={REGISTER} element={<RegisterForm />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[AUTH_ROLES.ADMIN, AUTH_ROLES.SUPER_ADMIN]}
            />
          }
        >
          <Route path={ADMIN} element={<AdminLayout />}>
            <Route index element={<Navigate to={ADMIN_PRODUCTS} replace />} />
            <Route path={ADMIN_CATEGORIES} element={<AdminCategories />} />
            <Route path={ADMIN_CATEGORY_ADD} element={<AddCategory />} />
            <Route path={ADMIN_CATEGORY_EDIT} element={<EditCategory />} />
            <Route path={ADMIN_PRODUCTS} element={<AdminProducts />} />
            <Route path={ADMIN_PRODUCT_CREATE} element={<CreateProduct />} />
            <Route path={ADMIN_PRODUCT_EDIT} element={<EditProduct />} />
            <Route path={ADMIN_ORDERS} element={<AdminOrders />} />
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[AUTH_ROLES.SUPER_ADMIN]}
                  redirectTo={ADMIN_PRODUCTS}
                />
              }
            >
              <Route path={ADMIN_USERS} element={<AdminUsers />} />
              <Route path={ADMIN_SETTING} element={<AdminSettings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
