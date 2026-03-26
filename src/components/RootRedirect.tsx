import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/landing" replace />;
}
