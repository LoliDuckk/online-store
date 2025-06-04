import { Component } from "react";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import BasketPage from "./pages/BasketPage";
import DevicePage from "./pages/DevicePage";
import ShopPage from "./pages/ShopPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import OrderPage from "./pages/OrderPage";
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  DEVICE_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
  HOME_ROUTE,
  PROFILE_ROUTE,
  CATEGORY_ROUTE,
  ORDER_ROUTE,
  HISTORY_ROUTE,
} from "./utils/consts";
import CategorySelector from "./pages/CategorySelector";
import OrderHistoryPage from "./pages/OrderHistoryPage";

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: AdminPage,
  },
  {
    path: BASKET_ROUTE,
    Component: BasketPage,
  },
  {
    path: PROFILE_ROUTE,
    Component: ProfilePage,
  },
  {
    path: ORDER_ROUTE,
    Component: OrderPage,
  },
  {
    path: HISTORY_ROUTE,
    Component: OrderHistoryPage,
  },
];

export const publicRoutes = [
  {
    path: CATEGORY_ROUTE,
    Component: CategorySelector,
  },
  {
    path: SHOP_ROUTE,
    Component: ShopPage,
  },
  {
    path: HOME_ROUTE,
    Component: HomePage,
  },
  {
    path: LOGIN_ROUTE,
    Component: AuthPage,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: AuthPage,
  },
  {
    path: DEVICE_ROUTE + "/:id",
    Component: DevicePage,
  },
];
