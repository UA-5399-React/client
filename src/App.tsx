import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout/MainLayout';
import { Home } from './pages/Home/Home';
import { ROUTES } from './constants';
import { Login } from './pages/Login/Login';
import * as Mocks from './pages/Mocks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.SHOP} element={<Mocks.Shop />} />
          <Route path={ROUTES.PRODUCT} element={<Mocks.ProductDetails />} />
          <Route path={ROUTES.CONTACT_US} element={<Mocks.ContactUs />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.CART} element={<Mocks.Cart />} />
          <Route path="*" element={<Mocks.NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
