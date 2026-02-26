import { Link, Outlet } from "@tanstack/react-router";
import { ROUTES } from "../../constants";

export const MainLayout = () => (
  <div className="min-h-screen flex flex-col w-full">
    <header className="w-full border-b">
      <nav className="flex justify-center gap-10 p-4">
        <Link to={ROUTES.HOME} activeOptions={{ exact: true }}>
          Home
        </Link>
        <Link to={ROUTES.LOGIN}>Login</Link>
        <Link to={ROUTES.CART}>Cart</Link>
        <Link to={ROUTES.CONTACT}>Contact Us</Link>
      </nav>
    </header>

    <main className="flex-grow">
      <Outlet />
    </main>
  </div>
);
