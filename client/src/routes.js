import { Component } from "react";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import BasketPage from "./pages/BasketPage";
import DevicePage from "./pages/DevicePage";
import ShopPage from "./pages/ShopPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  DEVICE_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
  HOME_ROUTE,
  PROFILE_ROUTE,
} from "./utils/consts";

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
];

export const publicRoutes = [
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
