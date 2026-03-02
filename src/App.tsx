import { BrowserRouter, Route,Routes } from 'react-router-dom';

import { MainLayout } from './components';
import { ROUTES } from './constants';
import { Home } from './pages';
import {
  Cart,
  ContactUs,
  Login,
  NotFound,
  ProductDetails,
  Shop,
} from './pages/Mocks';

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
          <Route path={LOGIN} element={<Login />} />
          <Route path={CART} element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
