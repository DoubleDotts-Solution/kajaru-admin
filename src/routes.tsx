import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./layouts";
import {
  Consignment,
  Dashboard,
  Delivery,
  Login,
  Reporting,
  Settings,
  Support,
  Users,
} from "./pages";
import { AuthLayout } from "./layouts/AuthLayout";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [{ path: "login", element: <Login /> }],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/consignment", element: <Consignment /> },
      { path: "/delivery", element: <Delivery /> },
      { path: "/users", element: <Users /> },
      { path: "/reporting", element: <Reporting /> },
      { path: "/support", element: <Support /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);
