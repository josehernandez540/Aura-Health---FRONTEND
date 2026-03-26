import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/auth.store';

export default function PublicRoute({ children }) {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  if (!hasHydrated) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}