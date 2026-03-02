import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components';
import { Home } from './pages';
import { ROUTES } from './constants';
import Login from './pages/Login/Login';
import { Shop, ProductDetails, ContactUs, Cart, NotFound } from './pages/Mocks';

function App() {
  const { HOME, SHOP, PRODUCT, CONTACT_US, LOGIN, CART } = ROUTES;
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
        <Route path={LOGIN} element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
