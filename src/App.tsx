import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ProductDetails } from '@/pages/ProductDetails/ProductDetails';

import {
  LoginForm,
  MainLayout,
  ProtectedRoute,
  ScrollToTop,
} from './components';
import { AdminLayout } from './components/AdminLayout/AdminLayout';
import { AuthLayout } from './components/AuthLayout';
import { Message } from './components/Message.tsx/Message';
import { NewsletterUnsubscribePage } from './components/NewsletterUnsubscribePage/NewsletterUnsubscribePage';
import { RegisterForm } from './components/RegisterForm';
import { AUTH_ROLES, ROUTES } from './constants';
import { useCartSync } from './hooks/useCartSync';
import { useRestoreAuthSession } from './hooks/useRestoreAuthSession';
import { Cart, Checkout, Home, OrderConfirmation } from './pages';
import { AddCategory } from './pages/Admin/AddCategory/AddCategory';
import { AdminCreateOrder } from './pages/Admin/AdminCreateOrder/AdminCreateOrder';
import { AdminEditOrder } from './pages/Admin/AdminEditOrder/AdminEditOrder';
import AdminMailer from './pages/Admin/AdminMailer/AdminMailer';
import { AdminCategories } from './pages/Admin/Categories/AdminCategories';
import { CreateProduct } from './pages/Admin/CreateProduct/CreateProduct';
import { CreateUser } from './pages/Admin/CreateUser/CreateUser';
import { Dashboard } from './pages/Admin/Dashboard/Dashboard';
import { EditCategory } from './pages/Admin/EditCategory/EditCategory';
import { EditProduct } from './pages/Admin/EditProduct/EditProduct';
import { EditUser } from './pages/Admin/EditUser/EditUser';
import { FeaturedProducts } from './pages/Admin/FeaturedProducts/FeaturedProducts';
import { AdminOrders } from './pages/Admin/Orders/AdminOrders';
import { AdminProducts } from './pages/Admin/Products/AdminProducts';
import { AdminSettings } from './pages/Admin/Settings/AdminSettings';
import { AdminUsers } from './pages/Admin/Users/AdminUsers';
import { EmailConfirmationPage } from './pages/Auth/EmailConfirmationPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/Auth/ResetPasswordPage';
import { Contact } from './pages/Contact/Contact';
import { Shop } from './pages/Mocks';
import { NotFound } from './pages/NotFound/NotFound';
import { MyOrders } from './pages/User/MyOrders';
import { OrderDetails } from './pages/User/OrderDetails';
import { Profile } from './pages/User/Profile';
import { Wishlist } from './pages/User/Wishlist';

function App() {
  const isAuthReady = useRestoreAuthSession();
  useCartSync();
  const {
    HOME,
    SHOP,
    PRODUCT,
    CONTACT,
    CART,
    NEWSLETTER_UNSUBSCRIBE,
    CHECKOUT,
    ORDER_CONFIRMATION,
    ORDER_DETAIL,
    ADMIN,
    ADMIN_CATEGORIES,
    ADMIN_CATEGORY_ADD,
    ADMIN_CATEGORY_EDIT,
    ADMIN_PRODUCTS,
    ADMIN_USERS,
    ADMIN_USER_CREATE,
    ADMIN_USER_EDIT,
    ADMIN_SETTING,
    ADMIN_PRODUCT_CREATE,
    ADMIN_PRODUCT_EDIT,
    ADMIN_ORDER_CREATE,
    ADMIN_ORDER_EDIT,
    ADMIN_MAILER,
    ADMIN_DASHBOARD,
    LOGIN,
    REGISTER,
    EMAIL_CONFIRMATION,
    ADMIN_ORDERS,
    ADMIN_FEATURED,
    PROFILE,
    MYORDERS,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
    WISHLIST,
  } = ROUTES;

  if (!isAuthReady) {
    return null;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Message />
      <Routes>
        <Route path={HOME} element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={SHOP} element={<Shop />} />
          <Route path={PRODUCT} element={<ProductDetails />} />
          <Route path={CONTACT} element={<Contact />} />
          <Route path={CART} element={<Cart />} />
          <Route path={WISHLIST} element={<Wishlist />} />
          <Route
            path={NEWSLETTER_UNSUBSCRIBE}
            element={<NewsletterUnsubscribePage />}
          />
          <Route path="*" element={<NotFound />} />
          <Route element={<ProtectedRoute />}>
            <Route path={PROFILE} element={<Profile />} />
            <Route path={MYORDERS} element={<MyOrders />} />
            <Route path={ORDER_DETAIL} element={<OrderDetails />} />
            <Route path={CHECKOUT} element={<Checkout />} />
            <Route path={ORDER_CONFIRMATION} element={<OrderConfirmation />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={LOGIN} element={<LoginForm />} />
          <Route path={REGISTER} element={<RegisterForm />} />
          <Route
            path={EMAIL_CONFIRMATION}
            element={<EmailConfirmationPage />}
          />
          <Route path={FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[AUTH_ROLES.ADMIN, AUTH_ROLES.SUPER_ADMIN]}
            />
          }
        >
          <Route path={ADMIN} element={<AdminLayout />}>
            <Route index element={<Navigate to={ADMIN_DASHBOARD} replace />} />
            <Route path={ADMIN_CATEGORIES} element={<AdminCategories />} />
            <Route path={ADMIN_CATEGORY_ADD} element={<AddCategory />} />
            <Route path={ADMIN_CATEGORY_EDIT} element={<EditCategory />} />
            <Route path={ADMIN_PRODUCTS} element={<AdminProducts />} />
            <Route path={ADMIN_DASHBOARD} element={<Dashboard />} />
            <Route path={ADMIN_PRODUCT_CREATE} element={<CreateProduct />} />
            <Route path={ADMIN_PRODUCT_EDIT} element={<EditProduct />} />
            <Route path={ADMIN_ORDERS} element={<AdminOrders />} />
            <Route path={ADMIN_ORDER_CREATE} element={<AdminCreateOrder />} />
            <Route path={ADMIN_ORDER_EDIT} element={<AdminEditOrder />} />
            <Route path={ADMIN_MAILER} element={<AdminMailer />} />
            <Route path={ADMIN_FEATURED} element={<FeaturedProducts />} />
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[AUTH_ROLES.SUPER_ADMIN]}
                  redirectTo={ADMIN_PRODUCTS}
                />
              }
            >
              <Route path={ADMIN_USERS} element={<AdminUsers />} />
              <Route path={ADMIN_USER_CREATE} element={<CreateUser />} />
              <Route path={ADMIN_USER_EDIT} element={<EditUser />} />
              <Route path={ADMIN_SETTING} element={<AdminSettings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
