import { useUser } from "../contexts/UserProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import MobileBottomNav from "../components/MobileBottomNav";
import Footer from "@/components/Footer";

export default function MainLayout() {
  const { isAuthenticated, loading } = useUser();
  const location = useLocation();

  // Pagine protette che richiedono autenticazione
  const protectedRoutes = ["/dashboard", "/dashboard/profile"];

  const isProtectedRoute = protectedRoutes.includes(location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (isProtectedRoute && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-20 md:pb-0">
        <Outlet />
      <Footer/>
      </main>
      <MobileBottomNav />
    </div>
  );
}
