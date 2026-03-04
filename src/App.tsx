import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { MainLayout } from './components';
import { ROUTES } from './constants';
import { Home } from './pages';
import Login from './pages/Login/Login';
import { Cart, ContactUs, NotFound, ProductDetails, Shop } from './pages/Mocks';
import { AdminLayout } from './components/AdminLayout/AdminLayout';
import { AdminProducts } from './pages/Admin/Products/AdminProducts';
import { AdminSettings } from './pages/Admin/Settings/AdminSettings';

function App() {
  const {
    HOME,
    SHOP,
    PRODUCT,
    CONTACT_US,
    LOGIN,
    CART,
    ADMIN,
    ADMIN_PRODUCTS,
    ADMIN_SETTING,
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
        <Route path={ADMIN} element={<AdminLayout />}>
          <Route path={ADMIN_PRODUCTS} element={<AdminProducts />} />
          <Route path={ADMIN_SETTING} element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
