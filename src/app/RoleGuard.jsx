import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/auth.store";

const RoleGuard = ({ children, allowedRoles = [] }) => {
  const { role, hasHydrated } = useAuthStore();
  
  if (!hasHydrated) return null;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleGuard;
