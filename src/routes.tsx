import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./layouts";
import { Dashboard, Login } from "./pages";
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
    children: [{ path: "/dashboard", element: <Dashboard /> }],
  },
]);
