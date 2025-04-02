import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import ScrollToTop from "../components/common/scrollToTop";
import { useIsAuthenticated } from "../hooks/useAuth";
import { Sidebar } from "../components/sidebar";

export const Layout = () => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex flex-col flex-grow">
      <ScrollToTop />
      <main className="">
        <Suspense fallback={<Spinner />}>
          <div className="flex w-full">
            <div className="w-1/5 h-screen fixed">
              <Sidebar />
            </div>
            <div className="w-4/5 ml-auto min-h-screen">
              <Outlet />
            </div>
          </div>
        </Suspense>
      </main>
    </div>
  );
};
