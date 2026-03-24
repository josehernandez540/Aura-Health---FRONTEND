import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/auth.store";

const ForceChangePasswordRoute = ({ children }) => {
  const { mustChangePassword } = useAuthStore();

  if (!mustChangePassword) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ForceChangePasswordRoute;