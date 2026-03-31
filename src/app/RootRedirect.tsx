import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/auth.store';

export default function RootRedirect() {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  if (!hasHydrated) return null;

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/login" replace />;
}