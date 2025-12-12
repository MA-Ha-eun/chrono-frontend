import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { LandingPage } from "@/pages/LandingPage";

export function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

