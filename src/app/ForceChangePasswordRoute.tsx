import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/auth.store";

interface Props {
  children: React.ReactNode;
}

const ForceChangePasswordRoute = ({ children }: Props) => {
  const { mustChangePassword, hasHydrated } = useAuthStore();

  if (!hasHydrated) return null;

  if (!mustChangePassword) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ForceChangePasswordRoute;