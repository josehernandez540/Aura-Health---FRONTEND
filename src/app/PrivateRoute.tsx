import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/auth.store';

interface Props {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const {
    token,
    isAuthenticated,
    mustChangePassword,
    hasHydrated
  } = useAuthStore();
  
  const location = useLocation();

  if (!hasHydrated) return null;

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (mustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  return <>{children}</>;
}