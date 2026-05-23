import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';

const ProtectedRoute = () => {
  const { isAuthenticated, mustChangePassword } = useAuthStore();
  const location = useLocation();

  // Sin token → al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Con token pero debe cambiar contraseña → solo puede estar en /change-password
  if (mustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;