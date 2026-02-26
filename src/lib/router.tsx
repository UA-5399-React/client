import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { MainLayout } from "../components/MainLayout/MainLayout";
import {
  Home,
  Login,
  Cart,
  ContactUs,
  ProductDetails,
  NotFound,
} from "../pages";
import { ROUTES } from "../constants";

const rootRoute = createRootRoute({
  component: MainLayout,
  notFoundComponent: NotFound,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.HOME,
  component: Home,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.LOGIN,
  component: Login,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.CART,
  component: Cart,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.CONTACT,
  component: ContactUs,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.PRODUCT,
  component: ProductDetails,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  cartRoute,
  contactRoute,
  productRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
