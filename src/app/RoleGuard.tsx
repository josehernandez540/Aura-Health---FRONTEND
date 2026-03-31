import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/auth.store";
import type { Role } from "../utils/hasRole";

interface Props {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const RoleGuard = ({ children, allowedRoles = [] }: Props) => {
  const { role, hasHydrated } = useAuthStore();
  
  if (!hasHydrated) return null;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;