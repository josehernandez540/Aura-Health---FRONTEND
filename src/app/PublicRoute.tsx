import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/auth.store';

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  if (!hasHydrated) return null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}